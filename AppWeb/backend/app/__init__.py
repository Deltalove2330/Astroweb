# app/__init__.py
from flask import Flask
from flask_login import LoginManager
from flask_socketio import SocketIO
from flask_apscheduler import APScheduler  
from config import config
from .commands import register_commands
from flask_cors import CORS
from datetime import timedelta
import logging
import sys

# Variable global para SocketIO
socketio = None

# ✅ Clase personalizada para APScheduler con acceso al contexto de Flask
class FlaskScheduler(APScheduler):
    def init_app(self, app):
        super().init_app(app)
        # Ejecutar trabajos dentro del contexto de la aplicación Flask
        self.app = app
        
    def run_job(self, job_id, *args, **kwargs):
        """Ejecuta un job dentro del contexto de Flask"""
        with self.app.app_context():
            return super().run_job(job_id, *args, **kwargs)

def create_app():
    app = Flask(__name__, template_folder='templates', static_folder='static')
    app.config.from_object(config)
    
    # Configuración CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Configuración de sesión
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_PERMANENT'] = True
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)
    app.config['SESSION_COOKIE_NAME'] = 'hjassta_session'
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = False
    
    # ========== CONFIGURACIÓN DE LOGGING DETALLADO ==========
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
        logging.getLogger('apscheduler').setLevel(logging.INFO)  # ✅ Logs del scheduler
        
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
                message = super().format(record)
                return f"{color}[{record.levelname}] {record.name}{reset}\n{color}📍 {location}{reset}\n   {record.getMessage()}{reset}"
        
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.DEBUG)
        console_handler.setFormatter(DebugFormatter())
        
        file_handler = logging.FileHandler('flask_errors.log', encoding='utf-8')
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(pathname)s:%(lineno)d - %(message)s'
        ))
        
        app.logger.addHandler(console_handler)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.DEBUG)
    
    # Initialize Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.session_protection = 'strong'
    
    # Initialize SocketIO
    global socketio
    socketio = SocketIO(
        app, cors_allowed_origins="*", async_mode='eventlet',
        logger=app.debug, engineio_logger=app.debug,
        ping_timeout=60, ping_interval=25,
        transports=['websocket', 'polling'],
        manage_session=False, cookie=app.config['SESSION_COOKIE_NAME']
    )
    
    # ✅ INICIALIZAR APSCHEDULER
    scheduler = FlaskScheduler()
    scheduler.init_app(app)
    
    # ✅ Función que ejecuta cambios futuros pendientes
    def ejecutar_cambios_futuros():
        """Job que se ejecuta periódicamente para procesar cambios programados"""
        try:
            from datetime import date
            from app.utils.database import execute_query
            
            app.logger.info("🔄 [Scheduler] Verificando cambios futuros pendientes...")
            
            # Obtener cambios pendientes para hoy o antes
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
                app.logger.info("✅ [Scheduler] No hay cambios pendientes para ejecutar")
                return
            
            ejecutados = 0
            errores = []
            
            for change in pending_changes:
                try:
                    (id_cambio, id_prog, id_ruta, point_id, client_id, 
                     dia, prioridad, activa, tipo_cambio, ruta_nombre) = change
                    
                    app.logger.info(f"📤 [Scheduler] Ejecutando cambio {id_cambio}: {tipo_cambio} en {ruta_nombre}")
                    
                    if tipo_cambio == 'INSERT':
                        # Verificar duplicado
                        check_query = """
                            SELECT COUNT(*) FROM RUTA_PROGRAMACION 
                            WHERE id_ruta = ? AND id_punto_interes = ? AND id_cliente = ?
                        """
                        exists = execute_query(check_query, (id_ruta, point_id, client_id), fetch_one=True)
                        
                        if exists and exists > 0:
                            app.logger.warning(f"⚠️ [Scheduler] Punto ya existe, saltando: {point_id}/{client_id}")
                            continue
                        
                        insert_query = """
                            INSERT INTO RUTA_PROGRAMACION 
                            (id_ruta, id_punto_interes, id_cliente, dia, prioridad, activa, punto_interes)
                            VALUES (?, ?, ?, ?, ?, 1, 
                                (SELECT punto_de_interes FROM PUNTOS_INTERES1 WHERE identificador = ?))
                        """
                        execute_query(insert_query, (id_ruta, point_id, client_id, dia, prioridad, point_id), commit=True)
                        ejecutados += 1
                    
                    elif tipo_cambio == 'UPDATE' and id_prog:
                        updates = []
                        params = []
                        
                        if dia:  # ✅ Esto está bien, dia viene como string
                            updates.append("dia = ?"); params.append(dia)
                        if prioridad:  # ✅ Esto está bien, prioridad viene como string
                            updates.append("prioridad = ?"); params.append(prioridad)
                        if activa is not None:  # ✅ IMPORTANTE: verificar None explícitamente
                            updates.append("activa = ?"); params.append(int(activa))  # ✅ Convertir a int
                        
                        if updates:
                            params.append(id_prog)
                            update_query = f"UPDATE RUTA_PROGRAMACION SET {', '.join(updates)} WHERE id_programacion = ?"
                            execute_query(update_query, tuple(params), commit=True)
                            ejecutados += 1
                    
                    elif tipo_cambio == 'DELETE' and id_prog:
                        delete_query = "DELETE FROM RUTA_PROGRAMACION WHERE id_programacion = ?"
                        execute_query(delete_query, (id_prog,), commit=True)
                        ejecutados += 1
                    
                    # Marcar como ejecutado
                    mark_query = """
                        UPDATE RUTA_PROGRAMACION_CAMBIOS_FUTUROS
                        SET estado = 'EJECUTADO', fecha_ejecutado = GETDATE()
                        WHERE id_cambio_futuro = ?
                    """
                    execute_query(mark_query, (id_cambio,), commit=True)
                    
                except Exception as e:
                    error_msg = f"Cambio {id_cambio}: {str(e)}"
                    errores.append(error_msg)
                    app.logger.error(f"❌ [Scheduler] Error ejecutando cambio: {error_msg}")
            
            app.logger.info(f"✅ [Scheduler] {ejecutados} cambios ejecutados | {len(errores)} errores")
            if errores:
                app.logger.warning(f"⚠️ [Scheduler] Errores: {errores}")
                
        except Exception as e:
            app.logger.error(f"❌ [Scheduler] Error crítico en ejecutar_cambios_futuros: {str(e)}", exc_info=True)
    
    # ✅ Agregar job al scheduler
    scheduler.add_job(
        func=ejecutar_cambios_futuros,
        trigger='interval',
        minutes=config.SCHEDULER_INTERVAL_MINUTES,
        id='ejecutar_cambios_futuros',
        name='Ejecutar cambios futuros de rutas',
        replace_existing=True,
        max_instances=1  # Evitar ejecuciones superpuestas
    )
    
    # ✅ Iniciar scheduler (NO usar scheduler.start() aquí, se hace en run.py)
    app.config['SCHEDULER'] = scheduler
    
    # Registrar blueprints
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

    
    register_commands(app)
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(clients_bp)
    app.register_blueprint(merchandisers_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(visits_bp)
    app.register_blueprint(points_bp)
    app.register_blueprint(reporteria_bp, url_prefix='/reporteria')
    app.register_blueprint(routes_bp, url_prefix='/rutas')
    app.register_blueprint(reset_pass_bp)
    app.register_blueprint(supervisors_bp, url_prefix='/supervisor')
    app.register_blueprint(requests_bp, url_prefix='/requests')
    app.register_blueprint(auditor_bp, url_prefix='/auditor')
    app.register_blueprint(atencion_cliente_bp)
    app.register_blueprint(mercaderista_rutas_bp, url_prefix='/mercaderista-rutas')
    
    # Registrar eventos de WebSocket
    try:
        from app.socket_events import init_socketio
        init_socketio(socketio)
        app.logger.info("✅ WebSocket events registrados correctamente")
    except Exception as e:
        app.logger.error(f"❌ Error registrando WebSocket events: {e}")
    
    # Registrar eventos de CHAT
    try:
        from app.socket_chat import init_chat_socketio
        init_chat_socketio(socketio)
        app.logger.info("✅ Chat ANALISTA registrado en namespace /chat")
    except Exception as e:
        app.logger.error(f"❌ Error registrando chat analista: {e}")

    try:
        from app.socket_chat_cliente import init_chat_cliente_socketio
        init_chat_cliente_socketio(socketio)
        app.logger.info("✅ Chat CLIENTE registrado en namespace /chat_cliente")
    except Exception as e:
        app.logger.error(f"❌ Error chat cliente: {e}")

    @app.route('/sw-mercaderista.js')
    def serve_sw_mercaderista():
        from flask import send_from_directory, make_response
        resp = make_response(send_from_directory(app.static_folder, 'sw-mercaderista.js'))
        resp.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        resp.headers['Content-Type']  = 'application/javascript'
        return resp

    return app, login_manager