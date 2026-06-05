# gunicorn.conf.py
# ============================================================
# Configuración de Gunicorn para Flask-SocketIO + Eventlet
#
# IMPORTANTE con eventlet:
#   - 1 worker = miles de conexiones concurrentes (green threads)
#   - NO usar múltiples workers con APScheduler sin coordinación
#   - eventlet hace que 1 proceso maneje todo de forma async
# ============================================================
import eventlet
eventlet.monkey_patch()

import os
import multiprocessing

# ── Red ───────────────────────────────────────────────────
bind = "0.0.0.0:5000"
backlog = 2048

# ── Workers ───────────────────────────────────────────────
# Con eventlet: 1 worker es suficiente y recomendado
# (maneja miles de conexiones simultáneas via green threads)
# IMPORTANTE: con eventlet, las queries pyodbc se ejecutan vía
# eventlet.tpool (ver app/utils/database.py) para que NO bloqueen
# el green thread. Sin ese wrap, 50 usuarios saturan todo.
worker_class = "eventlet"
workers = 1
worker_connections = 2000     # Conexiones simultáneas por worker
# threads NO se usa con eventlet — green threads no son OS threads.
# El paralelismo real para queries DB lo provee eventlet.tpool internamente.

# ── Timeouts ──────────────────────────────────────────────
# Subido de 120 a 180 para tolerar consultas pesadas + retry interno.
timeout = 180                 # Tiempo máximo de respuesta (seg)
graceful_timeout = 30         # Tiempo para cierre graceful
keepalive = 10                # Keep-alive para conexiones WebSocket

# ── Rendimiento ───────────────────────────────────────────
# max_requests = 0 → DESACTIVADO. Con 1 worker eventlet + WebSocket, reciclar el
# worker (antes cada 3000 requests) corta TODAS las conexiones /chat activas y
# deja un hueco breve sin servicio — pésimo en medio del pico de la mañana.
# Trade-off: se pierde la mitigación de fugas de memoria; si la RAM crece, usar
# el botón "liberar memoria" o reiniciar el servicio fuera de horario.
max_requests = 0
max_requests_jitter = 0

# ── Logging ───────────────────────────────────────────────
os.makedirs("logs", exist_ok=True)

accesslog = "logs/access.log"
errorlog  = "logs/error.log"
loglevel  = "info"

access_log_format = (
    '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s '
    '"%(f)s" "%(a)s" %(D)sµs'
)

worker_tmp_dir      = "/dev/shm"

# ── Proceso ───────────────────────────────────────────────
proc_name  = "hjassta"
daemon     = False
preload_app = True            # Cargar app antes del fork (ahorra memoria)
chdir      = os.path.dirname(os.path.abspath(__file__))

# ── Hooks de ciclo de vida ────────────────────────────────
def on_starting(server):
    """Se ejecuta antes de que el master process arranque"""
    os.makedirs("logs", exist_ok=True)
    print("=" * 60)
    print("🚀 HJASSTA arrancando con Gunicorn + Eventlet")
    print(f"   Bind:    http://0.0.0.0:5000")
    print(f"   Workers: {workers} (eventlet async)")
    print(f"   Conex.:  hasta {worker_connections} simultáneas")
    print("=" * 60)

def on_exit(server):
    """Limpieza al apagar"""
    print("⏹️  Gunicorn apagándose limpiamente...")

def post_fork(server, worker):
    """Se ejecuta en cada worker después del fork"""
    # Re-aplicar monkey_patch en cada worker (necesario con preload_app)
    eventlet.monkey_patch()
    # Pre-calentar el pool en segundo plano: evita el "thundering herd" de
    # apertura de conexiones a la DB remota en el primer pico (arranque frío).
    try:
        from app.utils.database import start_prewarm
        start_prewarm()
    except Exception as e:
        print(f"⚠️ prewarm del pool falló (no crítico): {e}")

def worker_init(arbiter, worker):
    """Worker inicializado"""
    print(f"✅ Worker {worker.pid} listo")

def worker_exit(server, worker):
    """Worker finalizado"""
    print(f"⚠️  Worker {worker.pid} finalizado")