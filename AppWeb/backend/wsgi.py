# wsgi.py
# ============================================================
# ENTRY POINT PARA GUNICORN
# Comando: gunicorn --config gunicorn.conf.py wsgi:app
# ============================================================
import eventlet
eventlet.monkey_patch()  # CRÍTICO: antes de todo

import os
import sys
import logging

# Configurar UTF-8
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

from app import create_app, socketio
from app.utils.auth import load_user

# Crear la app Flask
app, login_manager = create_app()

@login_manager.user_loader
def user_loader(user_id):
    return load_user(user_id)

# ── Iniciar APScheduler UNA sola vez ──────────────────────
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

# 'app' es lo que Gunicorn importa