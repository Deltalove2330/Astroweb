#app/utils/auth.py
import bcrypt
from app.models.user import User
from app.utils.database import execute_query, run_blocking
from flask_login import LoginManager
from flask import current_app
from config import config

login_manager = LoginManager()

# ───────────────────────────────────────────────────────────────────
# REHASH-ON-LOGIN
# La mayoría de los hashes están en cost=12 (~250ms, 4× más lento que 10).
# Cuando un usuario entra bien tenemos su contraseña en claro un instante:
# aprovechamos para re-guardarla en BCRYPT_ROUNDS (10). Migración gradual,
# sin tocar las cuentas que no se loguean. Un fallo aquí NUNCA tumba el login.
# ───────────────────────────────────────────────────────────────────
BCRYPT_ROUNDS = int(getattr(config, 'BCRYPT_ROUNDS', 10))


def _bcrypt_cost(stored_hash):
    """Cost factor del hash bcrypt, o None si no es bcrypt válido."""
    try:
        return int(str(stored_hash).split('$')[2])
    except (IndexError, ValueError):
        return None


def needs_rehash(stored_hash):
    """True si conviene re-hashear (cost mayor al objetivo BCRYPT_ROUNDS)."""
    cost = _bcrypt_cost(stored_hash)
    return cost is not None and cost > BCRYPT_ROUNDS


def _rehash_worker(password, where_col, where_val):
    """Cuerpo del rehash. Corre en segundo plano → no añade latencia al login.
    bcrypt vía tpool para no congelar el event loop. Nunca propaga errores."""
    try:
        nuevo = run_blocking(
            bcrypt.hashpw,
            password.encode('utf-8'),
            bcrypt.gensalt(rounds=BCRYPT_ROUNDS),
        ).decode('utf-8')
        execute_query(
            f"UPDATE USUARIOS SET password_hash = ? WHERE {where_col} = ?",
            (nuevo, where_val),
            commit=True,
        )
    except Exception:
        try:
            current_app.logger.warning(
                f"Rehash bcrypt falló ({where_col}={where_val}) — el login sigue válido",
                exc_info=True,
            )
        except Exception:
            pass


def rehash_and_store(password, where_col, where_val):
    """Dispara el rehash en SEGUNDO PLANO (fire-and-forget vía eventlet).

    Así el login responde de inmediato y la migración cost12→10 ocurre
    aparte — clave durante el pico, cuando muchos usuarios migran a la vez.
    `where_col` es un nombre de columna fijo del código ('username' o
    'id_usuario'), nunca entrada del usuario.
    """
    if where_col not in ('username', 'id_usuario'):
        return  # guard defensivo: solo columnas conocidas
    try:
        import eventlet
        eventlet.spawn_n(_rehash_worker, password, where_col, where_val)
    except Exception:
        # Sin eventlet (tests locales): ejecutar inline
        _rehash_worker(password, where_col, where_val)

# ───────────────────────────────────────────────────────────────────
# CACHÉ DE load_user EN LA SESIÓN
# load_user corre en CADA request (Flask-Login lo llama al acceder a
# current_user, p.ej. en el before_request). Sin caché = 1 query a la DB
# remota (~450ms) por CADA request de toda la app. Guardamos el User en la
# sesión (que ya vive en Redis vía flask-session, sin round-trip extra) y lo
# reconstruimos sin tocar la DB. Se invalida solo al cerrar sesión
# (session.clear() en /logout) o al expirar la sesión.
# ───────────────────────────────────────────────────────────────────
_USER_FIELDS = (
    'id', 'username', 'rol', 'cliente_id', 'email', 'id_supervisor',
    'id_analista', 'mercaderista_id', 'mercaderista_nombre',
    'mercaderista_tipo', 'id_rol',
)


def _user_to_cache(user):
    return {f: getattr(user, f, None) for f in _USER_FIELDS}


def _user_from_cache(d):
    return User(**{f: d.get(f) for f in _USER_FIELDS})


@login_manager.user_loader
def load_user(user_id):
    from flask import session
    # 1) Intentar desde la sesión (Redis) → SIN query a la DB remota
    try:
        cached = session.get('_uc')
        if cached and str(cached.get('id')) == str(user_id):
            return _user_from_cache(cached)
    except Exception:
        pass  # caché corrupto → recargar de la DB

    # 2) Cargar de la DB y cachear en la sesión
    try:
        if user_id.startswith('mercaderista_'):
            mercaderista_id = int(user_id.replace('mercaderista_', ''))
            query = "SELECT id_mercaderista, cedula, nombre, tipo FROM MERCADERISTAS WHERE id_mercaderista = ? AND activo = 1"
            result = execute_query(query, (mercaderista_id,), fetch_one=True)
            if result:
                user = User(
                    id=f"mercaderista_{result[0]}",
                    username=result[1],
                    rol='mercaderista',
                    mercaderista_id=result[0],
                    mercaderista_nombre=result[2],
                    mercaderista_tipo=result[3]
                )
                try: session['_uc'] = _user_to_cache(user)
                except Exception: pass
                return user
            return None
        else:
            # Es un usuario normal de la tabla USUARIOS
            query = """
            SELECT u.id_usuario, u.username, u.rol, u.id_cliente, u.email,
                   u.id_supervisor, u.id_analista, u.id_rol
            FROM USUARIOS u
            WHERE u.id_usuario = ?
            """
            result = execute_query(query, (user_id,), fetch_one=True)
            if result:
                user = User(
                    id=result[0],
                    username=result[1],
                    rol=result[2],
                    cliente_id=result[3],
                    email=result[4],
                    id_supervisor=result[5],
                    id_analista=result[6],
                    id_rol=result[7]
                )
                try: session['_uc'] = _user_to_cache(user)
                except Exception: pass
                return user
            return None
    except Exception as e:
        current_app.logger.error(f"Error en load_user: {str(e)}", exc_info=True)
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
            
            # bcrypt vía tpool → no congela el event loop en el pico de login
            if run_blocking(bcrypt.checkpw, password_bytes, stored_hash_bytes):
                current_app.logger.info(f"✅ Contraseña correcta para usuario {username}")
                # Migración gradual del cost factor (12 → BCRYPT_ROUNDS)
                if needs_rehash(stored_hash):
                    rehash_and_store(password, 'username', username)
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

def authenticate_user(username, password):
    """Login general en UNA sola query: trae el hash + los datos del usuario
    juntos, verifica bcrypt (vía tpool) y devuelve el User si es válido (o None).

    Reemplaza el par verify_password() + get_user_by_username() que hacía DOS
    SELECT a USUARIOS por el mismo username. Bajo carga, cada round-trip a la DB
    remota cuesta ~450ms y un hilo de tpool, así que ahorrar una query por login
    importa en el pico. Mantiene rehash-on-login en segundo plano.
    """
    try:
        query = """
            SELECT id_usuario, username, rol, id_cliente, email,
                   id_supervisor, id_analista, id_rol, password_hash
            FROM USUARIOS
            WHERE username = ? AND activo = 1
        """
        row = execute_query(query, (username,), fetch_one=True)
        if not row:
            current_app.logger.warning(f"Usuario {username} no encontrado o inactivo")
            return None

        stored_hash = (row[8] or '').strip()
        if not stored_hash.startswith(('$2b$', '$2a$', '$2y$')):
            current_app.logger.error(f"Hash bcrypt inválido para {username}")
            return None

        if not run_blocking(bcrypt.checkpw, password.encode('utf-8'),
                            stored_hash.encode('utf-8')):
            current_app.logger.warning(f"❌ Contraseña incorrecta para usuario {username}")
            return None

        # Migración gradual del cost factor (12 → BCRYPT_ROUNDS), en background
        if needs_rehash(stored_hash):
            rehash_and_store(password, 'username', username)

        return User(
            id=row[0], username=row[1], rol=row[2], cliente_id=row[3],
            email=row[4], id_supervisor=row[5], id_analista=row[6], id_rol=row[7],
        )
    except Exception as e:
        current_app.logger.error(
            f"Error en authenticate_user para {username}: {e}", exc_info=True
        )
        return None


def get_user_by_username(username):
    """Obtener usuario normal por nombre de usuario - CORREGIDO CON id_rol"""
    query = """
        SELECT id_usuario, username, rol, id_cliente, email, id_supervisor, id_analista, id_rol
        FROM USUARIOS
        WHERE username = ?
    """
    user_data = execute_query(query, (username,), fetch_one=True)
    if user_data:
        return User(
            id=user_data[0],
            username=user_data[1],
            rol=user_data[2],
            cliente_id=user_data[3],
            email=user_data[4],
            id_supervisor=user_data[5],
            id_analista=user_data[6],
            id_rol=user_data[7]  # ✅ AGREGAR id_rol
        )
    return None

def get_merchandiser_by_cedula(cedula):
    """Obtener mercaderista por cédula (para uso en auth)"""
    try:
        query = "SELECT id_mercaderista, cedula, nombre, tipo FROM MERCADERISTAS WHERE id_mercaderista = ? AND activo = 1"
        result = execute_query(query, (mercaderista_id,), fetch_one=True)
        return result  # Devuelve tupla (id_mercaderista, cedula, nombre, tipo) o None
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