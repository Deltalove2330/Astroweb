# app/__init__.py
from flask import Flask
from flask_login import LoginManager
from flask_socketio import SocketIO
from config import config
from .commands import register_commands
from flask_cors import CORS
from datetime import timedelta


# Variable global para SocketIO
socketio = None

def create_app():
    app = Flask(__name__, template_folder='templates', static_folder='static')
    app.config.from_object(config)
    
    # Configuración de sesión
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_PERMANENT'] = True
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)
    app.config['SESSION_COOKIE_NAME'] = 'hjassta_session'
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = False
    
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
        logger=False,
        engineio_logger=False,
        ping_timeout=60,
        ping_interval=25,
        transports=['websocket', 'polling'],
        manage_session=False,
        cookie=app.config['SESSION_COOKIE_NAME']
    )
    
    print("="*80)
    print(f"✅ SocketIO creado correctamente")
    print(f"✅ Instancia: {socketio}")
    print(f"✅ Async mode: eventlet")
    print(f"✅ CORS: *")
    print(f"✅ Session cookie: {app.config['SESSION_COOKIE_NAME']}")
    print(f"✅ Transports: websocket, polling")
    print("="*80)
    
    # Register blueprints
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
    
    print("✅ Blueprints registrados")
    
    # Registrar eventos de WebSocket (SOLO EVENTOS NORMALES, NO CHAT)
    try:
        print("🔧 Registrando eventos de WebSocket...")
        from app.socket_events import init_socketio
        init_socketio(socketio)
        print("✅ WebSocket events registrados correctamente")
        print("="*80)
    except Exception as e:
        print(f"❌ Error registrando WebSocket events: {e}")
        import traceback
        traceback.print_exc()
        print("="*80)

    return app, login_manager