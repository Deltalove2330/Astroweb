#app/utils/auth.py
import bcrypt
from app.models.user import User
from app.utils.database import execute_query
from flask_login import LoginManager
from flask import current_app

login_manager = LoginManager()

@login_manager.user_loader
def load_user(user_id):
    try:
        # Si el user_id empieza con "mercaderista_", es un mercaderista
        if user_id.startswith('mercaderista_'):
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
            # CORREGIDO: Usar nombres de columnas correctos
            query = """
            SELECT u.id_usuario, u.username, u.rol, u.id_cliente, u.email, u.id_supervisor, u.id_analista,
                   c.cliente
            FROM USUARIOS u
            LEFT JOIN CLIENTES c ON u.id_cliente = c.id_cliente
            WHERE u.id_usuario = ?
            """
            result = execute_query(query, (user_id,), fetch_one=True)
            if result:
                return User(
                    id=result[0],
                    username=result[1],
                    rol=result[2],
                    cliente_id=result[3],  # id_cliente en la base de datos
                    email=result[4],
                    id_supervisor=result[5],
                    id_analista=result[6]
                )
            return None
    except Exception as e:
        current_app.logger.error(f"Error en load_user: {str(e)}")
        return None

def verify_password(username, password):
    """Verificar contraseña para usuarios normales - Versión corregida"""
    try:
        query = """
        SELECT password_hash 
        FROM USUARIOS 
        WHERE username = ? 
        AND activo = 1
        """
        result = execute_query(query, (username,), fetch_one=True)
        
        if not result:
            current_app.logger.warning(f"Usuario {username} no encontrado o inactivo")
            return False
            
        # Manejar diferentes formatos de resultado
        if isinstance(result, tuple):
            stored_hash = result[0] if result[0] is not None else ''
        elif isinstance(result, str):
            stored_hash = result
        else:
            stored_hash = str(result) if result else ''
            
        # DEPURACIÓN DETALLADA
        current_app.logger.info(f"Hash recuperado para {username}: '{stored_hash}'")
        current_app.logger.info(f"Longitud del hash: {len(stored_hash)}")
        
        if not stored_hash or len(stored_hash.strip()) < 10:
            current_app.logger.error(f"Hash inválido o incompleto para {username}: '{stored_hash}'")
            return False
            
        # Limpiar y validar el hash
        stored_hash = stored_hash.strip()
        
        # Validar formato bcrypt correcto
        if not stored_hash.startswith(('$2b$', '$2a$', '$2y$')):
            current_app.logger.error(f"Formato de hash bcrypt inválido para {username}. Hash: '{stored_hash[:20]}...'")
            return False
            
        # Verificar la contraseña
        try:
            password_bytes = password.encode('utf-8')
            stored_hash_bytes = stored_hash.encode('utf-8')
            
            if bcrypt.checkpw(password_bytes, stored_hash_bytes):
                current_app.logger.info(f"✅ Contraseña correcta para usuario {username}")
                return True
            else:
                current_app.logger.warning(f"❌ Contraseña incorrecta para usuario {username}")
                return False
                
        except (ValueError, TypeError) as e:
            current_app.logger.error(f"Error bcrypt al verificar contraseña para {username}: {str(e)}")
            current_app.logger.error(f"Hash problemático: '{stored_hash[:20]}...'")
            return False
            
    except Exception as e:
        current_app.logger.error(f"Error inesperado en verify_password para {username}: {str(e)}", exc_info=True)
        return False

def get_user_by_username(username):
    """Obtener usuario normal por nombre de usuario"""
    # CORREGIDO: Usar nombres de columnas correctos
    query = """SELECT id_usuario, username, rol, id_cliente, email, id_supervisor, id_analista
    FROM USUARIOS
    WHERE username = ?"""
    user_data = execute_query(query, (username,), fetch_one=True)
    if user_data:
        return User(
            id=user_data[0],
            username=user_data[1],
            rol=user_data[2],
            cliente_id=user_data[3],  # id_cliente en la base de datos
            email=user_data[4],
            id_supervisor=user_data[5],
            id_analista=user_data[6]
        )
    return None

# AÑADE ESTA FUNCIÓN - FALTA EN TU CÓDIGO
def get_merchandiser_by_cedula(cedula):
    """Obtener mercaderista por cédula (para uso en auth)"""
    try:
        query = "SELECT id_mercaderista, cedula, nombre FROM MERCADERISTAS WHERE cedula = ? AND activo = 1"
        result = execute_query(query, (cedula,), fetch_one=True)
        return result  # Devuelve tupla (id_mercaderista, cedula, nombre) o None
    except Exception as e:
        current_app.logger.error(f"Error en get_merchandiser_by_cedula: {str(e)}")
        return None

# Mantener las funciones existentes para compatibilidad
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