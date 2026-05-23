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
worker_class = "eventlet"
workers = 1
worker_connections = 2000     # Conexiones simultáneas por worker
threads = 8               # No usar threads con eventlet

# ── Timeouts ──────────────────────────────────────────────
timeout = 120                 # Tiempo máximo de respuesta (seg)
graceful_timeout = 30         # Tiempo para cierre graceful
keepalive = 10             # Keep-alive para conexiones WebSocket

# ── Rendimiento ───────────────────────────────────────────
max_requests = 3000          # Reiniciar worker tras N requests (evita memory leaks)
max_requests_jitter = 50     # Variación aleatoria para evitar reinicio masivo

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

def worker_init(arbiter, worker):
    """Worker inicializado"""
    print(f"✅ Worker {worker.pid} listo")

def worker_exit(server, worker):
    """Worker finalizado"""
    print(f"⚠️  Worker {worker.pid} finalizado")