#app/utils/auth.py
import bcrypt
from app.models.user import User
from app.utils.database import execute_query

def load_user(user_id):
    query = """SELECT id_usuario, username, rol, id_cliente, email, id_supervisor, id_analista
               FROM USUARIOS
               WHERE id_usuario = ?"""
    user_data = execute_query(query, (user_id,), fetch_one=True)
    if user_data:
        return User(id=user_data[0],
                    username=user_data[1],
                    rol=user_data[2],
                    cliente_id=user_data[3],
                    email=user_data[4],
                    id_supervisor=user_data[5],
                    id_analista=user_data[6])
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