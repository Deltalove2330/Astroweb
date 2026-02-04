# app/__init__.py
#from AppWeb.backend.app.socket_chat_cliente import init_chat_cliente_socketio
from flask import Flask
from flask_login import LoginManager
from flask_socketio import SocketIO
from config import config
from .commands import register_commands
from flask_cors import CORS
from datetime import timedelta
import logging
import sys

# Variable global para SocketIO
socketio = None

def create_app():
    app = Flask(__name__, template_folder='templates', static_folder='static')
    app.config.from_object(config)
    
    # Configuración CORS (de subida-fotos-completa-v1)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Configuración de sesión (de dev)
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_PERMANENT'] = True
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)
    app.config['SESSION_COOKIE_NAME'] = 'hjassta_session'
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = False
    
    # ========== CONFIGURACIÓN DE LOGGING DETALLADO ========== (de dev)
    if app.debug:
        # Configurar logging para desarrollo
        logging.basicConfig(
            level=logging.DEBUG,
            format='%(asctime)s - %(name)s - %(levelname)s - %(pathname)s:%(lineno)d - %(message)s',
            handlers=[
                logging.StreamHandler(sys.stdout),
                logging.FileHandler('app_debug.log', encoding='utf-8')
            ]
        )
        
        # Reducir verbosidad de algunas librerías
        logging.getLogger('werkzeug').setLevel(logging.INFO)
        
        # Configurar logger de la aplicación para mostrar archivo y línea
        app.logger.handlers.clear()
        
        # Handler para consola con colores
        class DebugFormatter(logging.Formatter):
            def format(self, record):
                # Colores según el nivel
                colors = {
                    'DEBUG': '\033[96m',    # Cyan
                    'INFO': '\033[92m',     # Verde
                    'WARNING': '\033[93m',  # Amarillo
                    'ERROR': '\033[91m',    # Rojo
                    'CRITICAL': '\033[95m', # Magenta
                }
                
                color = colors.get(record.levelname, '\033[0m')
                reset = '\033[0m'
                
                # Formato con ubicación del error
                location = f"{record.pathname}:{record.lineno}"
                message = super().format(record)
                
                return f"{color}[{record.levelname}] {record.name}{reset}\n{color}📍 {location}{reset}\n   {record.getMessage()}{reset}"
        
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.DEBUG)
        console_handler.setFormatter(DebugFormatter())
        
        # Handler para archivo
        file_handler = logging.FileHandler('flask_errors.log', encoding='utf-8')
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(pathname)s:%(lineno)d - %(message)s'
        ))
        
        # Aplicar handlers
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
        app, 
        cors_allowed_origins="*", 
        async_mode='eventlet',
        logger=app.debug,  # Usar configuración de debug de la app
        engineio_logger=app.debug,
        ping_timeout=60,
        ping_interval=25,
        transports=['websocket', 'polling'],
        manage_session=False,
        cookie=app.config['SESSION_COOKIE_NAME']
    )
    
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
    
    # Registrar eventos de WebSocket (SOLO EVENTOS NORMALES, NO CHAT)
    try:
        from app.socket_events import init_socketio
        init_socketio(socketio)
        app.logger.info("✅ WebSocket events registrados correctamente")
    except Exception as e:
        app.logger.error(f"❌ Error registrando WebSocket events: {e}")
        import traceback
        app.logger.error(traceback.format_exc())
    
    # ✅ NUEVO: Registrar eventos de CHAT
    try:
        from app.socket_chat import init_chat_socketio
        init_chat_socketio(socketio)
        app.logger.info("✅ Chat ANALISTA registrado en namespace /chat")
    except Exception as e:
        app.logger.error(f"❌ Error registrando chat analista: {e}")
        import traceback
        app.logger.error(traceback.format_exc())

    try:
        from app.socket_chat_cliente import init_chat_cliente_socketio
        init_chat_cliente_socketio(socketio)
        app.logger.info("✅ Chat CLIENTE registrado en namespace /chat_cliente")
    except Exception as e:
        app.logger.error(f"❌ Error chat cliente: {e}")
        import traceback
        app.logger.error(traceback.format_exc())

    

    return app, login_manager