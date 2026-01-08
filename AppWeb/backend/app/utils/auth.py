#app/utils/auth.py
import bcrypt
from app.models.user import User
from app.utils.database import execute_query

from flask_login import LoginManager
from flask import current_app
from app.models.user import User

login_manager = LoginManager()

@login_manager.user_loader
def load_user(user_id):
    """Carga un usuario desde la base de datos por su ID - Soporta usuarios normales y mercaderistas"""
    try:
        # Si el user_id empieza con "mercaderista_", es un mercaderista
        if isinstance(user_id, str) and user_id.startswith('mercaderista_'):
            mercaderista_id = user_id.replace('mercaderista_', '')
            
            query = "SELECT id_mercaderista, cedula, nombre FROM MERCADERISTAS WHERE id_mercaderista = ?"
            result = execute_query(query, (mercaderista_id,), fetch_one=True)
            
            if result:
                return User(
                    id=f"mercaderista_{result[0]}",  # Prefijo para diferenciar
                    username=result[1],  # cedula como username
                    rol='mercaderista',
                    mercaderista_id=result[0],
                    mercaderista_nombre=result[2]
                )
            return None
        else:
            # Es un usuario normal del sistema (query corregida de dev)
            query = """
                SELECT id_usuario, username, rol, id_cliente, email, id_supervisor, id_analista
                FROM USUARIOS 
                WHERE id_usuario = ?
            """
            user_data = execute_query(query, (user_id,), fetch_one=True)
            
            if user_data:
                return User(
                    id=user_data[0],
                    username=user_data[1],
                    rol=user_data[2],
                    cliente_id=user_data[3],      # ✅ MAPEAR id_cliente -> cliente_id
                    email=user_data[4],
                    id_supervisor=user_data[5],
                    id_analista=user_data[6]
                )
            return None
    except Exception as e:
        current_app.logger.error(f"Error en load_user: {str(e)}")
        return None

def verify_password(username, password):
    query = "SELECT password_hash FROM USUARIOS WHERE username = ?"
    result = execute_query(query, (username,), fetch_one=True)
    if result and bcrypt.checkpw(password.encode('utf-8'), result[0].encode('utf-8')):
        return True
    return False

def get_user_by_username(username):
    query = """SELECT id_usuario, username, rol, id_cliente, email, id_supervisor, id_analista
               FROM USUARIOS
               WHERE username = ?"""
    user_data = execute_query(query, (username,), fetch_one=True)
    if user_data:
        return User(id=user_data[0],
                    username=user_data[1],
                    rol=user_data[2],
                    cliente_id=user_data[3],
                    email=user_data[4],
                    id_supervisor=user_data[5],
                    id_analista=user_data[6])
    return None

# Nueva función para obtener cliente por ID
def get_client_by_user(user_id):
    query = """
        SELECT c.id_cliente, c.nombre 
        FROM CLIENTES c
        JOIN USUARIOS u ON c.id_cliente = u.id_cliente
        WHERE u.id_usuario = ?
    """
    result = execute_query(query, (user_id,), fetch_one=True)
    return result if result else None

def get_user_id_by_username(username):
    query = "SELECT id_usuario FROM USUARIOS WHERE username = ?"
    result = execute_query(query, (username,), fetch_one=True)
    return result[0] if result else None