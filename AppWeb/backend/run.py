# run.py
import eventlet
eventlet.monkey_patch()  # ✅ CRÍTICO: Debe estar AL INICIO antes de cualquier import

from app import create_app
from app.utils.auth import load_user

# Crear la aplicación
app, login_manager = create_app()

# ✅ Importar socketio DESPUÉS de crear la app
from app import socketio

# ✅ Configurar el user loader para Flask-Login
@login_manager.user_loader
def user_loader(user_id):
    """Carga el usuario desde la base de datos cuando se autentica"""
    return load_user(user_id)

if __name__ == "__main__":
    # ✅ Verificar que socketio existe y usar socketio.run
    if socketio is None:
        print("="*80)
        print("❌ ERROR: SocketIO no se inicializó correctamente")
        print("💡 Ejecutando sin WebSocket...")
        print("="*80)
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        print("="*80)
        print("✅ SocketIO inicializado correctamente")
        print("🚀 Iniciando servidor con WebSocket y Eventlet")
        print("📍 URL: http://0.0.0.0:5000")
        print("🔧 Modo: Debug")
        print("🔔 Sistema de notificaciones en tiempo real: ACTIVO")
        print("="*80)
        
        # ✅ Usar socketio.run con configuración optimizada
        socketio.run(
            app,
            host='0.0.0.0',
            port=5000,
            debug=True,
            use_reloader=False,  # ✅ Evitar recargas que rompen WebSocket
            log_output=False     # ✅ Reducir logs innecesarios
        )