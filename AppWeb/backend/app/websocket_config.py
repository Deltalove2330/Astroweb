from flask_socketio import SocketIO

socketio = SocketIO(
    cors_allowed_origins="*",
    async_mode='threading',
    logger=False,  # ← DEBE SER False
    engineio_logger=False,  # ← DEBE SER False
    ping_timeout=60,
    ping_interval=25,
    manage_session=False
)

def init_socketio(app):
    socketio.init_app(app)
    
    from app.routes.chat_websocket import register_socketio_events
    register_socketio_events(socketio)
    
    print("✅ SocketIO configurado correctamente")
    
    return socketio