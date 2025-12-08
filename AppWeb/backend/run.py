# run.py
from app import create_app
from app.utils.auth import load_user

app, login_manager = create_app()

# ✅ Importar socketio DESPUÉS de crear la app
from app import socketio

@login_manager.user_loader
def user_loader(user_id):
    return load_user(user_id)

if __name__ == "__main__":
    # ✅ Verificar que socketio existe y usar socketio.run
    if socketio is None:
        print("❌ ERROR: SocketIO no se inicializó correctamente")
        print("💡 Ejecutando sin WebSocket...")
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        print("✅ SocketIO inicializado correctamente")
        print("🚀 Iniciando servidor con WebSocket...")
        socketio.run(app, host='0.0.0.0', port=5000, debug=True)