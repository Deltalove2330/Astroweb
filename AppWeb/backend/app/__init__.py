# app/__init__.py
from flask import Flask, request, jsonify, redirect, url_for
from flask_socketio import SocketIO
from flask_apscheduler import APScheduler
from flask_session import Session
from redis import Redis
from config import config
from .commands import register_commands
from flask_cors import CORS
from datetime import timedelta
import logging
import sys

socketio = None


class FlaskScheduler(APScheduler):
    def init_app(self, app):
        super().init_app(app)
        self.app = app

    def run_job(self, job_id, *args, **kwargs):
        with self.app.app_context():
            return super().run_job(job_id, *args, **kwargs)


def create_app():
    app = Flask(__name__, template_folder='templates', static_folder='static')
    app.config.from_object(config)

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # ─────────────────────────────────────────────────────────────
    # SESIONES CON REDIS (reemplaza 'filesystem')
    # Redis db=0 para sesiones, db=1 lo usa Celery (no se pisan)
    # ─────────────────────────────────────────────────────────────
    redis_client = Redis(host='localhost', port=6379, db=0)

    app.config['SESSION_TYPE']                = 'redis'
    app.config['SESSION_REDIS']               = redis_client
    app.config['SESSION_PERMANENT']           = False
    app.config['SESSION_USE_SIGNER']          = True
    app.config['SESSION_KEY_PREFIX']          = 'hjassta:flask:'
    app.config['PERMANENT_SESSION_LIFETIME']  = timedelta(hours=8)
    app.config['SESSION_COOKIE_NAME']         = 'hjassta_session'
    app.config['SESSION_COOKIE_HTTPONLY']     = True
    app.config['SESSION_COOKIE_SAMESITE']     = 'Lax'
    app.config['SESSION_COOKIE_SECURE']       = False  # True cuando tengas HTTPS

    Session(app)

    # Inyectar Redis al SessionManager
    from app.utils.session_manager import session_manager
    session_manager._redis = redis_client

    # ─────────────────────────────────────────────────────────────
    # LOGGING
    # ─────────────────────────────────────────────────────────────
    if app.debug:
        logging.basicConfig(
            level=logging.DEBUG,
            format='%(asctime)s - %(name)s - %(levelname)s - %(pathname)s:%(lineno)d - %(message)s',
            handlers=[
                logging.StreamHandler(sys.stdout),
                logging.FileHandler('app_debug.log', encoding='utf-8')
            ]
        )
        logging.getLogger('werkzeug').setLevel(logging.INFO)
        logging.getLogger('apscheduler').setLevel(logging.INFO)

        app.logger.handlers.clear()

        class DebugFormatter(logging.Formatter):
            def format(self, record):
                colors = {
                    'DEBUG': '\033[96m', 'INFO': '\033[92m', 'WARNING': '\033[93m',
                    'ERROR': '\033[91m', 'CRITICAL': '\033[95m',
                }
                color = colors.get(record.levelname, '\033[0m')
                reset = '\033[0m'
                location = f"{record.pathname}:{record.lineno}"
                return f"{color}[{record.levelname}] {record.name}{reset}\n{color}📍 {location}{reset}\n   {record.getMessage()}{reset}"

        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        console_handler.setFormatter(DebugFormatter())

        file_handler = logging.FileHandler('flask_errors.log', encoding='utf-8')
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(pathname)s:%(lineno)d - %(message)s'
        ))

        app.logger.addHandler(console_handler)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)

    # ─────────────────────────────────────────────────────────────
    # FLASK-LOGIN
    # ─────────────────────────────────────────────────────────────
    from app.utils.auth import login_manager
    login_manager.init_app(app)
    login_manager.login_view      = 'auth.login'
    login_manager.session_protection = 'basic'

    @login_manager.unauthorized_handler
    def unauthorized():
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({
                'success': False,
                'error':   'Sesión expirada',
                'redirect': '/login'
            }), 401
        return redirect(url_for('auth.login'))

    # ─────────────────────────────────────────────────────────────
    # BEFORE REQUEST — verificar si la sesión fue invalidada
    # ─────────────────────────────────────────────────────────────
    from flask_login import current_user, logout_user
    from flask import session

    @app.before_request
    def verify_session_validity():
        public_endpoints = {
            'auth.login', 'auth.login_mercaderista',
            'merchandisers.verify_merchandiser',
            'static', None
        }

        if request.endpoint in public_endpoints:
            return

        if not current_user.is_authenticated:
            return

        sid = session.get('_sid')
        if not sid:
            return

        if not session_manager.is_session_valid(sid):
            logout_user()
            session.clear()

            if (request.is_json or
                    request.headers.get('X-Requested-With') == 'XMLHttpRequest'):
                return jsonify({
                    'error':  'Sesión terminada por el administrador',
                    'code':   'SESSION_INVALIDATED',
                    'redirect': '/login'
                }), 401

            return redirect(url_for('auth.login'))

        # Actualizar último acceso (throttled a 5 min internamente)
        session_manager.touch_session(sid)

    # ─────────────────────────────────────────────────────────────
    # SOCKETIO
    # ─────────────────────────────────────────────────────────────
    global socketio
    socketio = SocketIO(
        app, cors_allowed_origins="*", async_mode='eventlet',
        logger=app.debug, engineio_logger=app.debug,
        ping_timeout=60, ping_interval=25,
        transports=['websocket', 'polling'],
        manage_session=False, cookie=app.config['SESSION_COOKIE_NAME']
    )

    # ─────────────────────────────────────────────────────────────
    # APSCHEDULER
    # ─────────────────────────────────────────────────────────────
    scheduler = FlaskScheduler()
    scheduler.init_app(app)

    def ejecutar_cambios_futuros():
        try:
            from datetime import date
            from app.utils.database import execute_query

            app.logger.info("🔄 [Scheduler] Verificando cambios futuros pendientes...")

            query = """
                SELECT
                    id_cambio_futuro, id_programacion, id_ruta,
                    id_punto_interes, id_cliente, dia, prioridad, activa,
                    tipo_cambio, ruta_nombre
                FROM RUTA_PROGRAMACION_CAMBIOS_FUTUROS
                WHERE estado = 'PENDIENTE'
                  AND fecha_ejecucion <= ?
                ORDER BY fecha_ejecucion ASC
            """
            pending_changes = execute_query(query, (date.today().strftime('%Y-%m-%d'),))

            if not pending_changes:
                app.logger.info("✅ [Scheduler] No hay cambios pendientes")
                return

            ejecutados = 0
            errores    = []

            for change in pending_changes:
                try:
                    (id_cambio, id_prog, id_ruta, point_id, client_id,
                     dia, prioridad, activa, tipo_cambio, ruta_nombre) = change

                    app.logger.info(f"📤 [Scheduler] Ejecutando {id_cambio}: {tipo_cambio} en {ruta_nombre}")

                    if tipo_cambio == 'INSERT':
                        check_query = """
                            SELECT COUNT(*) FROM RUTA_PROGRAMACION
                            WHERE id_ruta = ? AND id_punto_interes = ? AND id_cliente = ?
                        """
                        exists = execute_query(check_query, (id_ruta, point_id, client_id), fetch_one=True)
                        if exists and exists > 0:
                            continue

                        execute_query("""
                            INSERT INTO RUTA_PROGRAMACION
                            (id_ruta, id_punto_interes, id_cliente, dia, prioridad, activa, punto_interes)
                            VALUES (?, ?, ?, ?, ?, 1,
                                (SELECT punto_de_interes FROM PUNTOS_INTERES1 WHERE identificador = ?))
                        """, (id_ruta, point_id, client_id, dia, prioridad, point_id), commit=True)
                        ejecutados += 1

                    elif tipo_cambio == 'UPDATE' and id_prog:
                        updates = []
                        params  = []
                        if dia:       updates.append("dia = ?");       params.append(dia)
                        if prioridad: updates.append("prioridad = ?"); params.append(prioridad)
                        if activa is not None:
                            updates.append("activa = ?")
                            params.append(int(activa))
                        if updates:
                            params.append(id_prog)
                            execute_query(
                                f"UPDATE RUTA_PROGRAMACION SET {', '.join(updates)} WHERE id_programacion = ?",
                                tuple(params), commit=True
                            )
                            ejecutados += 1

                    elif tipo_cambio == 'DELETE' and id_prog:
                        execute_query(
                            "DELETE FROM RUTA_PROGRAMACION WHERE id_programacion = ?",
                            (id_prog,), commit=True
                        )
                        ejecutados += 1

                    execute_query("""
                        UPDATE RUTA_PROGRAMACION_CAMBIOS_FUTUROS
                        SET estado = 'EJECUTADO', fecha_ejecutado = GETDATE()
                        WHERE id_cambio_futuro = ?
                    """, (id_cambio,), commit=True)

                except Exception as e:
                    errores.append(f"Cambio {id_cambio}: {str(e)}")
                    app.logger.error(f"❌ [Scheduler] {e}")

            app.logger.info(f"✅ [Scheduler] {ejecutados} ejecutados | {len(errores)} errores")
            if errores:
                app.logger.warning(f"⚠️ Errores: {errores}")

        except Exception as e:
            app.logger.error(f"❌ [Scheduler] Error crítico: {str(e)}", exc_info=True)

    scheduler.add_job(
        func=ejecutar_cambios_futuros,
        trigger='interval',
        minutes=config.SCHEDULER_INTERVAL_MINUTES,
        id='ejecutar_cambios_futuros',
        name='Ejecutar cambios futuros de rutas',
        replace_existing=True,
        max_instances=1
    )
    app.config['SCHEDULER'] = scheduler

    # ─────────────────────────────────────────────────────────────
    # BLUEPRINTS
    # ─────────────────────────────────────────────────────────────
    from .routes.auth import auth_bp
    from .routes.clients import clients_bp
    from .routes.merchandisers import merchandisers_bp
    from .routes.users import users_bp
    from .routes.visits import visits_bp
    from .routes.points import points_bp
    from .routes.reporteria import reporteria_bp
    from .routes.routes import routes_bp
    from .routes.reset_password import reset_pass_bp
    from app.routes.supervisors import supervisors_bp
    from app.routes.requests import requests_bp
    from app.routes.auditor_routes import auditor_bp
    from app.routes.atencion_cliente import atencion_cliente_bp
    from app.routes.mercaderista_rutas import mercaderista_rutas_bp
    from app.routes.push_routes import push_bp
    from app.routes.admin_sessions import admin_sessions_bp  # ← NUEVO

    register_commands(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(clients_bp)
    app.register_blueprint(merchandisers_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(visits_bp)
    app.register_blueprint(points_bp)
    app.register_blueprint(reporteria_bp,        url_prefix='/reporteria')
    app.register_blueprint(routes_bp,            url_prefix='/rutas')
    app.register_blueprint(reset_pass_bp)
    app.register_blueprint(supervisors_bp,       url_prefix='/supervisor')
    app.register_blueprint(requests_bp,          url_prefix='/requests')
    app.register_blueprint(auditor_bp,           url_prefix='/auditor')
    app.register_blueprint(atencion_cliente_bp)
    app.register_blueprint(mercaderista_rutas_bp, url_prefix='/mercaderista-rutas')
    app.register_blueprint(push_bp)
    app.register_blueprint(admin_sessions_bp)    # ← NUEVO

    # ─────────────────────────────────────────────────────────────
    # WEBSOCKET EVENTS
    # ─────────────────────────────────────────────────────────────
    try:
        from app.socket_events import init_socketio
        init_socketio(socketio)
        app.logger.info("✅ WebSocket events registrados")
    except Exception as e:
        app.logger.error(f"❌ Error WebSocket events: {e}")

    try:
        from app.socket_chat import init_chat_socketio
        init_chat_socketio(socketio)
        app.logger.info("✅ Chat ANALISTA registrado en /chat")
    except Exception as e:
        app.logger.error(f"❌ Error chat analista: {e}")

    try:
        from app.socket_chat_cliente import init_chat_cliente_socketio
        init_chat_cliente_socketio(socketio)
        app.logger.info("✅ Chat CLIENTE registrado en /chat_cliente")
    except Exception as e:
        app.logger.error(f"❌ Error chat cliente: {e}")

    return app, login_manager