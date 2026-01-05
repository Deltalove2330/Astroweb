#Prueba
# app/__init__.py
from flask import Flask
from flask_login import LoginManager
from config import config
from .commands import register_commands
from flask_cors import CORS  # Asegúrate de tener instalado flask-cors

def create_app():
    app = Flask(__name__, template_folder='templates', static_folder='static')
    app.config.from_object(config)
    
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    # Initialize Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    
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

    return app, login_manager