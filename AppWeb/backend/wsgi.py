# wsgi.py
import eventlet
eventlet.monkey_patch()

import os
import sys
import logging
from logging.handlers import RotatingFileHandler

if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

from app import create_app, socketio
from app.utils.auth import load_user

app, login_manager = create_app()

@login_manager.user_loader
def user_loader(user_id):
    return load_user(user_id)

# ── Logging ───────────────────────────────────────────────
os.makedirs("logs", exist_ok=True)

formatter = logging.Formatter(
    '[%(asctime)s] %(levelname)s en %(module)s.%(funcName)s [Línea %(lineno)d]: %(message)s'
)

# Archivo: logs/app.log (tu app Flask)
file_handler = RotatingFileHandler(
    'logs/app.log', maxBytes=10*1024*1024, backupCount=5, encoding='utf-8'
)
file_handler.setFormatter(formatter)
file_handler.setLevel(logging.DEBUG)

# Consola (aparece en journalctl y en terminal)
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(formatter)
console_handler.setLevel(logging.DEBUG)

app.logger.addHandler(file_handler)
app.logger.addHandler(console_handler)
app.logger.setLevel(logging.DEBUG)

# Silenciar librerías ruidosas
logging.getLogger('socketio').setLevel(logging.WARNING)
logging.getLogger('engineio').setLevel(logging.WARNING)
logging.getLogger('werkzeug').setLevel(logging.INFO)
logging.getLogger('apscheduler').setLevel(logging.INFO)

app.logger.info("✅ HJASSTA iniciado con Gunicorn + Eventlet")

# ── APScheduler ───────────────────────────────────────────
def _start_scheduler():
    scheduler = app.config.get('SCHEDULER')
    if scheduler and not scheduler.running:
        try:
            scheduler.start(paused=False)
            interval = app.config.get('SCHEDULER_INTERVAL_MINUTES', 60)
            app.logger.info(f"✅ APScheduler iniciado (cada {interval} min)")
        except Exception as e:
            app.logger.warning(f"⚠️ Scheduler no se pudo iniciar: {e}")

with app.app_context():
    _start_scheduler()