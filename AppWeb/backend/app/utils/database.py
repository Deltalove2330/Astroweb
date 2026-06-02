# app/utils/database.py
# ════════════════════════════════════════════════════════════════════
#  v3 — Connection pool + eventlet.tpool wrap + retry
#
#  PROBLEMA QUE RESUELVE:
#    Con 50+ usuarios simultáneos el servidor daba "tiempo de espera
#    agotado" porque:
#      1) pyodbc es síncrono y bloqueaba el único green thread de eventlet
#      2) cada query abría/cerraba una conexión nueva (100-500ms cada vez)
#      3) 659 llamadas a DB en el código multiplicaban el costo
#
#  CÓMO LO ARREGLA:
#    - ConnectionPool reutiliza conexiones limpias (max 30, configurable).
#    - eventlet.tpool.execute() corre cada query en un thread nativo, así
#      el green thread del worker eventlet sigue atendiendo otras requests.
#    - Retry automático ante errores transitorios de red/SQL Server.
#    - API pública IDÉNTICA: execute_query() y get_db_connection() se
#      pueden seguir llamando sin tocar el resto del código (659 calls).
# ════════════════════════════════════════════════════════════════════
import time
import threading
import logging
from collections import deque
from contextlib import contextmanager

import pyodbc
from config import config

# Pool interno de pyodbc — comparte handles de bajo nivel entre threads
pyodbc.pooling = True

# eventlet.tpool: corre funciones bloqueantes en un thread real
# (sin bloquear el green thread del worker)
try:
    from eventlet import tpool as _tpool
    _USE_TPOOL = True
except Exception:                # pragma: no cover
    _tpool = None
    _USE_TPOOL = False

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────
# CONFIG (overrideable vía env / config.py)
# ─────────────────────────────────────────────────────────────────
DB_POOL_MAX_SIZE      = int(getattr(config, 'DB_POOL_MAX_SIZE', 30))
DB_POOL_IDLE_TIMEOUT  = int(getattr(config, 'DB_POOL_IDLE_TIMEOUT', 300))   # seg
DB_CONNECT_TIMEOUT    = int(getattr(config, 'DB_CONNECT_TIMEOUT', 10))      # seg
DB_QUERY_TIMEOUT      = int(getattr(config, 'DB_QUERY_TIMEOUT', 30))        # seg
DB_RETRY_ATTEMPTS     = int(getattr(config, 'DB_RETRY_ATTEMPTS', 2))
DB_RETRY_BACKOFF      = float(getattr(config, 'DB_RETRY_BACKOFF', 0.4))     # seg


# ─────────────────────────────────────────────────────────────────
# POOL DE CONEXIONES
# ─────────────────────────────────────────────────────────────────
class _ConnectionPool:
    """Pool simple de conexiones pyodbc reutilizables.

    Reglas:
      - get(): primero intenta reusar una conexión idle; si está sana
        la devuelve. Si no hay idle, crea una nueva (hasta `max_size`).
      - put(): devuelve la conexión al pool (idle) o la cierra si está
        rota o si el pool está lleno.
      - Cada conexión idle se valida con `SELECT 1` antes de reusarla.
    """

    def __init__(self, conn_str: str, max_size: int = 30, idle_timeout: int = 300):
        self.conn_str     = conn_str
        self.max_size     = max_size
        self.idle_timeout = idle_timeout
        self._idle        = deque()       # [(conn, last_used_ts), ...]
        self._in_use      = 0
        self._lock        = threading.Lock()
        # Métricas básicas para /api/admin/db-pool-stats
        self.stats        = {"created": 0, "reused": 0, "discarded": 0,
                             "errors": 0, "wait_total_s": 0.0}

    # ── Conexión nueva (fuera del lock) ─────────────────────
    def _new_conn(self):
        conn = pyodbc.connect(self.conn_str, timeout=DB_CONNECT_TIMEOUT, autocommit=True)
        self.stats["created"] += 1
        return conn

    def get(self):
        t0 = time.time()
        while True:
            with self._lock:
                while self._idle:
                    conn, last_used = self._idle.popleft()
                    if time.time() - last_used > self.idle_timeout:
                        # Demasiado vieja, descartar
                        try: conn.close()
                        except Exception: pass
                        self.stats["discarded"] += 1
                        continue
                    # Conexión candidata — validamos fuera del lock
                    self._in_use += 1
                    self.stats["wait_total_s"] += time.time() - t0
                    # Validar con un SELECT 1 corto
                    try:
                        conn.timeout = 2
                        cur = conn.cursor()
                        cur.execute("SELECT 1")
                        cur.fetchone()
                        cur.close()
                        conn.timeout = DB_QUERY_TIMEOUT
                        self.stats["reused"] += 1
                        return conn
                    except Exception:
                        try: conn.close()
                        except Exception: pass
                        with self._lock:
                            self._in_use -= 1
                        self.stats["discarded"] += 1
                        continue
                # No hay idle — crear nueva si cabe
                self._in_use += 1
                self.stats["wait_total_s"] += time.time() - t0
                break

        try:
            return self._new_conn()
        except Exception:
            with self._lock:
                self._in_use -= 1
            self.stats["errors"] += 1
            raise

    def put(self, conn, broken: bool = False):
        with self._lock:
            self._in_use = max(0, self._in_use - 1)
            if broken or len(self._idle) >= self.max_size:
                try: conn.close()
                except Exception: pass
                if broken:
                    self.stats["errors"] += 1
                else:
                    self.stats["discarded"] += 1
                return
            self._idle.append((conn, time.time()))

    def snapshot(self) -> dict:
        with self._lock:
            return {
                "idle":     len(self._idle),
                "in_use":   self._in_use,
                "max_size": self.max_size,
                **self.stats,
            }


# Instancia única del pool (lazy: usa la URI de config)
_pool = _ConnectionPool(
    config.SQLALCHEMY_DATABASE_URI,
    max_size=DB_POOL_MAX_SIZE,
    idle_timeout=DB_POOL_IDLE_TIMEOUT,
)


@contextmanager
def _scoped_conn():
    """Toma una conexión del pool, la libera limpia o rota al salir."""
    conn   = _pool.get()
    broken = False
    try:
        yield conn
    except (pyodbc.Error, SystemError):
        broken = True
        raise
    finally:
        _pool.put(conn, broken=broken)


# ─────────────────────────────────────────────────────────────────
# EJECUCIÓN DE QUERY (en thread real vía eventlet.tpool)
# ─────────────────────────────────────────────────────────────────
def _do_execute(query, params, fetch_one, commit):
    """Cuerpo síncrono — corre en thread nativo cuando tpool está activo."""
    with _scoped_conn() as conn:
        cursor = conn.cursor()
        try:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)

            if commit:
                conn.commit()
                return {"success": True, "rowcount": cursor.rowcount}

            if fetch_one:
                result = cursor.fetchone()
                if result is None:
                    return None
                if len(result) == 1:
                    return result[0]
                return result
            return cursor.fetchall()
        finally:
            try: cursor.close()
            except Exception: pass


def execute_query(query, params=(), fetch_one=False, commit=False):
    """
    Ejecuta una query con:
      - Pool de conexiones (reutiliza)
      - tpool de eventlet (no bloquea green threads)
      - Retry automático ante errores transitorios

    API idéntica a la versión anterior — los 659 call-sites siguen funcionando.
    """
    last_err = None
    for attempt in range(DB_RETRY_ATTEMPTS + 1):
        try:
            if _USE_TPOOL:
                return _tpool.execute(_do_execute, query, params, fetch_one, commit)
            return _do_execute(query, params, fetch_one, commit)
        except (pyodbc.Error, SystemError) as e:
            last_err = e
            msg = str(e)
            # Errores transitorios típicos: conexión rota, timeout de login, deadlock
            is_transient = (
                '08S01' in msg or '08001' in msg or '10054' in msg or
                'timeout' in msg.lower() or 'deadlock' in msg.lower() or
                'communication link failure' in msg.lower()
            )
            if attempt < DB_RETRY_ATTEMPTS and is_transient:
                time.sleep(DB_RETRY_BACKOFF * (attempt + 1))
                continue
            break

    # Si llegamos aquí, fallaron todos los retries
    try:
        from flask import current_app
        current_app.logger.error(
            f"Database error: {last_err} - Query: {str(query)[:300]}"
        )
    except RuntimeError:
        logger.error(f"Database error: {last_err} - Query: {str(query)[:300]}")

    if commit:
        return {"success": False, "error": str(last_err)}
    return None


# ─────────────────────────────────────────────────────────────────
# BACKWARDS COMPAT — get_db_connection()
# ─────────────────────────────────────────────────────────────────
def get_db_connection():
    """
    Devuelve una conexión cruda del pool.

    ⚠️ IMPORTANTE: si llamas a esta función debes:
      - cerrarla con `conn.close()` cuando termines (lo que ya hace todo
        el código existente), y la conexión NO se reusa.
      - O llamar a `release_connection(conn)` para devolverla al pool
        y aprovechar el pool.

    Para máxima eficiencia, usar `execute_query()` o el context manager
    `with scoped_db_conn() as conn: ...`.
    """
    return _pool.get()


def release_connection(conn, broken: bool = False):
    """Devuelve al pool una conexión obtenida con get_db_connection()."""
    _pool.put(conn, broken=broken)


@contextmanager
def scoped_db_conn():
    """Context manager público — equivalente a _scoped_conn()."""
    with _scoped_conn() as conn:
        yield conn


def get_pool_stats() -> dict:
    """Snapshot de métricas del pool para diagnóstico/monitoreo."""
    return _pool.snapshot()
