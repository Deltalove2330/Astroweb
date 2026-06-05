# app/utils/database.py
# ════════════════════════════════════════════════════════════════════
#  v4 — Connection pool + eventlet.tpool wrap + retry
#
#  BUGS CORREGIDOS vs v3:
#    - DEADLOCK PROPIO: el método get() del pool llamaba `with self._lock`
#      dentro de otro `with self._lock` (al intentar decrementar _in_use
#      después de que fallaba SELECT 1). Ahora la validación corre FUERA
#      del lock.
#    - conn.close() NO DEVOLVÍA AL POOL: el código existente (40+ archivos)
#      llama conn.close() cuando termina, lo que destruía la conexión sin
#      devolverla. Ahora get_db_connection() retorna un PooledConnection
#      que intercepta .close() y la devuelve al pool en vez de destruirla.
#      → Los 40+ archivos se benefician del pool sin tocar una sola línea.
#    - autocommit=True en la conexión conflictuaba con conn.commit() explícito.
#      Ahora: autocommit=False, y _do_execute maneja commit/rollback
#      correctamente. Para get_db_connection() el código existente hace
#      su propio commit() que sigue funcionando igual.
#
#  CÓMO LO ARREGLA:
#    - _ConnectionPool: pool propio, max 30 conexiones, idle timeout 300s.
#    - PooledConnection: wrapper transparente — conn.close() → pool.put().
#    - eventlet.tpool.execute() corre cada query en thread nativo.
#    - Retry automático ante errores transitorios de SQL Server.
#    - API pública IDÉNTICA para los 659+ call-sites existentes.
# ════════════════════════════════════════════════════════════════════
import os
import time
import threading
import logging
from collections import deque
from contextlib import contextmanager

import pyodbc
from config import config

# pyodbc.pooling = True usa el pool interno de pyodbc a nivel ODBC Driver.
# Lo mantenemos activo como segunda capa de caché de drivers.
pyodbc.pooling = True

# ── Tamaño del thread pool de eventlet ────────────────────────────
# eventlet.tpool lee EVENTLET_THREADPOOL_SIZE UNA SOLA VEZ, al importar el
# módulo (por defecto 20). Por eso lo fijamos AQUÍ, ANTES del import de tpool.
# Sin esto, aunque el pool de DB sea de 50, solo 20 queries correrían a la vez.
os.environ.setdefault(
    'EVENTLET_THREADPOOL_SIZE',
    str(int(getattr(config, 'EVENTLET_THREADPOOL_SIZE', 40))),
)

# eventlet.tpool: corre funciones bloqueantes en un thread OS real,
# dejando el green thread del worker eventlet libre para otras requests.
try:
    from eventlet import tpool as _tpool
    _USE_TPOOL = True
except Exception:          # pragma: no cover — entorno sin eventlet (tests locales)
    _tpool = None
    _USE_TPOOL = False

# ── Lock NATIVO para el pool (NO el verde de eventlet) ────────────────
# CRÍTICO: el pool se accede DESDE los threads OS reales de eventlet.tpool
# (vía execute_query). Un threading.Lock monkey-patcheado por eventlet es
# "verde" y su acquire desde un thread OS que no corre el hub de eventlet
# se DEADLOCKEA bajo contención → 100 logins simultáneos colgaban todos.
# Un lock nativo funciona correctamente tanto desde threads OS (tpool) como
# desde green threads (get_db_connection directo). El lock se sostiene solo
# microsegundos (la validación/queries corren FUERA del lock), así que no
# bloquea el event loop de forma apreciable.
try:
    from eventlet import patcher as _ev_patcher
    _native_threading = _ev_patcher.original('threading')
except Exception:          # pragma: no cover — sin eventlet
    _native_threading = threading

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────
# CONFIG — overrideable vía config.py o variables de entorno
# ─────────────────────────────────────────────────────────────────
DB_POOL_MAX_SIZE     = int(getattr(config, 'DB_POOL_MAX_SIZE',     30))
DB_POOL_IDLE_TIMEOUT = int(getattr(config, 'DB_POOL_IDLE_TIMEOUT', 300))  # seg
DB_CONNECT_TIMEOUT   = int(getattr(config, 'DB_CONNECT_TIMEOUT',   10))   # seg
DB_QUERY_TIMEOUT     = int(getattr(config, 'DB_QUERY_TIMEOUT',     30))   # seg
DB_RETRY_ATTEMPTS    = int(getattr(config, 'DB_RETRY_ATTEMPTS',    2))
DB_RETRY_BACKOFF     = float(getattr(config, 'DB_RETRY_BACKOFF',   0.4))  # seg
# Validar una conexión idle (SELECT 1, round-trip a la DB remota) SOLO si
# estuvo idle más de N seg. Las recién devueltas casi seguro están vivas;
# si una resulta muerta, el retry de execute_query lo maneja. Esto quita un
# round-trip a la mayoría de los get() bajo carga.
DB_VALIDATE_AFTER    = int(getattr(config, 'DB_VALIDATE_AFTER',    20))   # seg


# ─────────────────────────────────────────────────────────────────
# POOL DE CONEXIONES
# ─────────────────────────────────────────────────────────────────
class _ConnectionPool:
    """Pool de conexiones pyodbc reutilizables thread-safe.

    Diseño:
      - get()  → retorna PooledConnection (conn.close() = devolver al pool).
      - put()  → devuelve al idle o cierra si está rota / pool lleno.
      - Validación SELECT 1 corre FUERA del lock → no hay deadlock.
      - Stats para /api/admin/pdv-auto-desactivaciones/db-pool-stats.
    """

    def __init__(self, conn_str: str, max_size: int = 30, idle_timeout: int = 300):
        self.conn_str     = conn_str
        self.max_size     = max_size
        self.idle_timeout = idle_timeout
        self._idle        = deque()   # [(raw_pyodbc_conn, last_used_ts), ...]
        self._in_use      = 0
        self._lock        = _native_threading.Lock()  # nativo, NO verde (ver arriba)
        self.stats        = {
            "created": 0, "reused": 0, "discarded": 0,
            "errors": 0, "wait_total_s": 0.0
        }

    # ── Crea conexión pyodbc cruda ───────────────────────────
    def _new_raw(self) -> pyodbc.Connection:
        conn = pyodbc.connect(
            self.conn_str,
            timeout=DB_CONNECT_TIMEOUT,
            autocommit=False,   # el código usa conn.commit() explícito
        )
        conn.timeout = DB_QUERY_TIMEOUT
        self.stats["created"] += 1
        return conn

    # ── Valida que una conexión idle siga activa (FUERA del lock) ──
    @staticmethod
    def _is_alive(raw_conn: pyodbc.Connection) -> bool:
        try:
            old_timeout = raw_conn.timeout
            raw_conn.timeout = 2
            cur = raw_conn.cursor()
            cur.execute("SELECT 1")
            cur.fetchone()
            cur.close()
            raw_conn.timeout = old_timeout
            return True
        except Exception:
            return False

    def get(self) -> "PooledConnection":
        """Retorna una PooledConnection lista para usar."""
        t0 = time.time()

        while True:
            # — Paso 1: intentar reusar una conexión idle —
            candidate = None
            candidate_age = 0.0
            stale = []   # conexiones vencidas a cerrar FUERA del lock
            with self._lock:
                while self._idle:
                    raw, last_used = self._idle.popleft()
                    age = time.time() - last_used
                    if age > self.idle_timeout:
                        stale.append(raw)
                        self.stats["discarded"] += 1
                        continue
                    # Candidata encontrada: reservarla
                    self._in_use += 1
                    candidate = raw
                    candidate_age = age
                    break

            # Cerrar vencidas fuera del lock (close() puede ser un round-trip)
            for raw in stale:
                try: raw.close()
                except Exception: pass

            if candidate is not None:
                # Validar FUERA del lock (evita deadlock). Saltamos el SELECT 1
                # si la conexión estuvo idle poco tiempo (casi seguro viva).
                if candidate_age <= DB_VALIDATE_AFTER or self._is_alive(candidate):
                    self.stats["reused"] += 1
                    self.stats["wait_total_s"] += time.time() - t0
                    return PooledConnection(candidate, self)
                else:
                    # Conexión muerta → descartarla y seguir buscando
                    try: candidate.close()
                    except Exception: pass
                    with self._lock:
                        self._in_use -= 1
                    self.stats["discarded"] += 1
                    continue  # reintentar con la siguiente idle

            # — Paso 2: no había idle → crear nueva —
            with self._lock:
                self._in_use += 1

            try:
                raw = self._new_raw()
                self.stats["wait_total_s"] += time.time() - t0
                return PooledConnection(raw, self)
            except Exception:
                with self._lock:
                    self._in_use -= 1
                self.stats["errors"] += 1
                raise

    def put(self, raw_conn: pyodbc.Connection, broken: bool = False) -> None:
        """Devuelve una conexión cruda al pool (o la cierra si está rota).

        CRÍTICO: el rollback() y el close() son operaciones potencialmente
        lentas (round-trip a la DB remota, ~100ms). Se hacen FUERA del lock.
        Hacer rollback() dentro del lock serializaba TODO el pool a ~10/s
        (1 / tiempo_de_rollback) y mataba la concurrencia.
        """
        # — Rollback preventivo FUERA del lock (limpia estado de transacción) —
        if not broken:
            try:
                raw_conn.rollback()
            except Exception:
                broken = True   # si el rollback falla, la conexión está rota

        # — Decidir bajo el lock (solo ops en memoria: microsegundos) —
        with self._lock:
            self._in_use = max(0, self._in_use - 1)
            descartar = broken or len(self._idle) >= self.max_size
            if not descartar:
                self._idle.append((raw_conn, time.time()))
            if broken:
                self.stats["errors"] += 1
            elif descartar:
                self.stats["discarded"] += 1

        # — Cerrar FUERA del lock si toca descartar —
        if descartar:
            try: raw_conn.close()
            except Exception: pass

    def snapshot(self) -> dict:
        with self._lock:
            return {
                "idle":     len(self._idle),
                "in_use":   self._in_use,
                "max_size": self.max_size,
                **self.stats,
            }


# ─────────────────────────────────────────────────────────────────
# POOLED CONNECTION — wrapper transparente sobre pyodbc.Connection
# ─────────────────────────────────────────────────────────────────
class PooledConnection:
    """Envuelve una conexión pyodbc cruda.

    La clave: conn.close() devuelve la conexión al pool en vez de destruirla.
    Esto hace que todo el código existente (40+ archivos que llaman conn.close())
    se beneficie del pool automáticamente SIN modificar ningún archivo.

    Todos los demás atributos y métodos se delegan a la conexión real.
    """

    def __init__(self, raw: pyodbc.Connection, pool: _ConnectionPool):
        # Usar object.__setattr__ para evitar recursión en __setattr__
        object.__setattr__(self, '_raw', raw)
        object.__setattr__(self, '_pool', pool)
        object.__setattr__(self, '_closed', False)

    # ── close() → devuelve al pool ──────────────────────────
    def close(self):
        if not object.__getattribute__(self, '_closed'):
            object.__setattr__(self, '_closed', True)
            raw  = object.__getattribute__(self, '_raw')
            pool = object.__getattribute__(self, '_pool')
            pool.put(raw, broken=False)

    # ── Delegación transparente ──────────────────────────────
    def __getattr__(self, name):
        return getattr(object.__getattribute__(self, '_raw'), name)

    def __setattr__(self, name, value):
        if name in ('_raw', '_pool', '_closed'):
            object.__setattr__(self, name, value)
        else:
            setattr(object.__getattribute__(self, '_raw'), name, value)

    # ── Context manager: `with get_db_connection() as conn:` ──
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        broken = exc_type is not None and issubclass(exc_type, (pyodbc.Error, SystemError))
        if not object.__getattribute__(self, '_closed'):
            object.__setattr__(self, '_closed', True)
            raw  = object.__getattribute__(self, '_raw')
            pool = object.__getattribute__(self, '_pool')
            pool.put(raw, broken=broken)
        return False   # no suprime la excepción

    def __del__(self):
        """Seguridad: devolver al pool si el GC recoge esta conexión sin cerrar."""
        try:
            self.close()
        except Exception:
            pass


# ── Instancia única del pool ──────────────────────────────────────
_pool = _ConnectionPool(
    config.SQLALCHEMY_DATABASE_URI,
    max_size=DB_POOL_MAX_SIZE,
    idle_timeout=DB_POOL_IDLE_TIMEOUT,
)


# ─────────────────────────────────────────────────────────────────
# CONTEXT MANAGER INTERNO (para execute_query)
# ─────────────────────────────────────────────────────────────────
@contextmanager
def _scoped_conn():
    """Obtiene una PooledConnection, la libera al salir."""
    conn   = _pool.get()
    broken = False
    try:
        yield conn
    except (pyodbc.Error, SystemError):
        broken = True
        raise
    finally:
        if not object.__getattribute__(conn, '_closed'):
            object.__setattr__(conn, '_closed', True)
            pool = object.__getattribute__(conn, '_pool')
            raw  = object.__getattribute__(conn, '_raw')
            pool.put(raw, broken=broken)


# ─────────────────────────────────────────────────────────────────
# EJECUCIÓN DE QUERIES (en thread OS via eventlet.tpool)
# ─────────────────────────────────────────────────────────────────
def _do_execute(query: str, params, fetch_one: bool, commit: bool):
    """Cuerpo síncrono — se ejecuta en thread real cuando tpool está activo."""
    with _scoped_conn() as conn:
        raw = object.__getattribute__(conn, '_raw')
        cursor = raw.cursor()
        try:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)

            if commit:
                raw.commit()
                return {"success": True, "rowcount": cursor.rowcount}

            if fetch_one:
                result = cursor.fetchone()
                if result is None:
                    return None
                if len(result) == 1:
                    return result[0]
                return result

            return cursor.fetchall()

        except Exception:
            try: raw.rollback()
            except Exception: pass
            raise
        finally:
            try: cursor.close()
            except Exception: pass


def execute_query(query: str, params=(), fetch_one: bool = False, commit: bool = False):
    """
    Ejecuta una query con pool + tpool + retry.

    API 100% compatible con v1/v2/v3 — los 659+ call-sites siguen funcionando.
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
            is_transient = (
                '08S01' in msg or '08001' in msg or '10054' in msg or
                'timeout' in msg.lower() or 'deadlock' in msg.lower() or
                'communication link failure' in msg.lower()
            )
            if attempt < DB_RETRY_ATTEMPTS and is_transient:
                time.sleep(DB_RETRY_BACKOFF * (attempt + 1))
                continue
            break

    # Todos los reintentos fallaron
    try:
        from flask import current_app
        current_app.logger.error(
            f"[DB] Error tras {DB_RETRY_ATTEMPTS + 1} intentos: "
            f"{last_err} — Query: {str(query)[:300]}"
        )
    except RuntimeError:
        logger.error(
            f"[DB] Error tras {DB_RETRY_ATTEMPTS + 1} intentos: "
            f"{last_err} — Query: {str(query)[:300]}"
        )

    if commit:
        return {"success": False, "error": str(last_err)}
    return None


# ─────────────────────────────────────────────────────────────────
# API PÚBLICA — backwards compat + helpers nuevos
# ─────────────────────────────────────────────────────────────────
def run_blocking(fn, *args, **kwargs):
    """Ejecuta una función bloqueante (CPU o IO-bound) en un thread OS real
    vía eventlet.tpool, para NO congelar el único event loop del worker.

    Uso crítico: bcrypt.checkpw() en el login. bcrypt tarda ~100ms de CPU pura
    y eventlet NO interrumpe código CPU-bound → sin esto, el pico de login de
    300-400 mercaderistas serializa y congela chat/fotos/todo. bcrypt libera el
    GIL durante el cálculo en C, así que en hilos de tpool SÍ paraleliza.
    """
    if _USE_TPOOL:
        return _tpool.execute(fn, *args, **kwargs)
    return fn(*args, **kwargs)


def get_db_connection() -> PooledConnection:
    """
    Retorna una PooledConnection del pool.

    El código existente puede seguir usando:
        conn = get_db_connection()
        ...
        conn.close()   ← AHORA devuelve al pool en vez de destruir

    Para máxima eficiencia, usar execute_query() que incluye tpool.
    """
    return _pool.get()


def release_connection(conn, broken: bool = False) -> None:
    """
    Devuelve manualmente una conexión al pool.
    Solo necesario si tomaste una conexión con get_db_connection()
    y quieres marcarla como rota (broken=True).
    """
    if isinstance(conn, PooledConnection):
        if not object.__getattribute__(conn, '_closed'):
            object.__setattr__(conn, '_closed', True)
            raw  = object.__getattribute__(conn, '_raw')
            pool = object.__getattribute__(conn, '_pool')
            pool.put(raw, broken=broken)
    else:
        # Conexión pyodbc cruda legacy
        _pool.put(conn, broken=broken)


@contextmanager
def scoped_db_conn():
    """
    Context manager público para operaciones multi-step con una sola conexión.

        with scoped_db_conn() as conn:
            conn.cursor().execute(...)
            conn.commit()
    """
    with _scoped_conn() as conn:
        yield conn


def get_pool_stats() -> dict:
    """Snapshot de métricas del pool para el endpoint de monitoreo."""
    return _pool.snapshot()


# ─────────────────────────────────────────────────────────────────
# PRE-CALENTAMIENTO DEL POOL
# En arranque frío, abrir decenas de conexiones a la DB remota A LA VEZ
# (lo que pasa en el primer pico de la mañana) causa stalls/errores
# (visto en el bench a conc 80). Pre-abrimos GRADUALMENTE (una a una) para
# que el pico reúse conexiones ya listas en vez de abrirlas todas de golpe.
# ─────────────────────────────────────────────────────────────────
DB_POOL_WARM = int(getattr(config, 'DB_POOL_WARM', 40))


def prewarm_pool(target=None):
    """Pre-abre `target` conexiones, de a una (gentil con la DB remota), y las
    devuelve al pool como idle. Pensado para correr en un thread nativo de fondo."""
    if target is None:
        target = min(DB_POOL_MAX_SIZE, DB_POOL_WARM)
    held = []
    try:
        for _ in range(max(0, target)):
            try:
                held.append(_pool.get())   # crea (o reúsa) una conexión
            except Exception:
                break
    finally:
        for pc in held:
            try: pc.close()   # la devuelve al idle, lista para el pico
            except Exception: pass
    try:
        logger.info(f"[DB] Pool pre-calentado: {_pool.snapshot().get('idle')} conexiones idle")
    except Exception:
        pass


def start_prewarm(target=None):
    """Lanza prewarm_pool en un thread nativo de fondo: no bloquea el arranque
    del worker ni el event loop. Seguro de llamar varias veces."""
    try:
        t = _native_threading.Thread(target=prewarm_pool, args=(target,), daemon=True)
        t.start()
    except Exception:
        pass
