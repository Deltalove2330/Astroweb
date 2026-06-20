# app/routes/users.py
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
import bcrypt
from app.utils.database import execute_query

users_bp = Blueprint('users', __name__)

@users_bp.route('/api/add-user', methods=['POST'])
@login_required
def add_user():
    # Verificar si es administrador
    if current_user.rol == 'admin':
        # Mantener la lógica actual para crear usuario directamente
        return create_user_directly()
    elif current_user.rol == 'analyst':
        # Si es analista, crear una solicitud
        return create_user_request()
    else:
        return jsonify({
            "success": False,
            "message": "Acceso denegado: Rol no autorizado para crear usuarios"
        }), 403

def create_user_directly():
    # Obtener datos del request
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    client_id = data.get('client_id')
    analyst_id = data.get('analyst_id')
    supervisor_id = data.get('supervisor_id')
    
    # Validar campos requeridos
    if not username or not email or not password or not role:
        return jsonify({
            "success": False,
            "message": "Faltan campos requeridos: username, email, password o role"
        }), 400
    
    # Validar formato de correo electrónico
    import re
    if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        return jsonify({
            "success": False,
            "message": "Formato de correo electrónico inválido"
        }), 400
    
    # Validar rol permitido
    if role not in ['admin', 'analyst', 'supervisor', 'client']:
        return jsonify({
            "success": False,
            "message": "Rol inválido. Los roles permitidos son 'admin', 'analyst', 'supervisor' o 'client'"
        }), 400
    
    # Validar asociaciones según el rol
    if role == 'client' and not client_id:
        return jsonify({
            "success": False,
            "message": "Para crear un usuario cliente, debe asociarse a un cliente existente"
        }), 400
    if role == 'analyst' and not analyst_id:
        return jsonify({
            "success": False,
            "message": "Para crear un usuario analista, debe asociarse a un analista existente"
        }), 400
    if role == 'supervisor' and not supervisor_id:
        return jsonify({
            "success": False,
            "message": "Para crear un usuario supervisor, debe asociarse a un supervisor existente"
        }), 400
    
    try:
        # Verificar si el usuario ya existe
        check_query = "SELECT COUNT(*) FROM USUARIOS WHERE username = ?"
        user_exists = execute_query(check_query, (username,), fetch_one=True)
        if user_exists and user_exists > 0:  # Cambiado user_exists[0] a user_exists
            return jsonify({
                "success": False,
                "message": "El nombre de usuario ya existe"
            }), 409
        
        # Verificar si el correo ya existe
        check_email_query = "SELECT COUNT(*) FROM USUARIOS WHERE email = ?"
        email_exists = execute_query(check_email_query, (email,), fetch_one=True)
        if email_exists and email_exists > 0:  # Cambiado email_exists[0] a email_exists
            return jsonify({
                "success": False,
                "message": "El correo electrónico ya está en uso"
            }), 409
        
        # Hashear la contraseña
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Insertar nuevo usuario según el rol
        if role == 'client':
            insert_query = "INSERT INTO USUARIOS (username, email, password_hash, rol, id_cliente) VALUES (?, ?, ?, ?, ?)"
            result = execute_query(insert_query, (username, email, password_hash, role, client_id), commit=True)
        elif role == 'analyst':
            insert_query = "INSERT INTO USUARIOS (username, email, password_hash, rol, id_analista) VALUES (?, ?, ?, ?, ?)"
            result = execute_query(insert_query, (username, email, password_hash, role, analyst_id), commit=True)
        elif role == 'supervisor':
            insert_query = "INSERT INTO USUARIOS (username, email, password_hash, rol, id_supervisor) VALUES (?, ?, ?, ?, ?)"
            result = execute_query(insert_query, (username, email, password_hash, role, supervisor_id), commit=True)
        else:  # admin
            insert_query = "INSERT INTO USUARIOS (username, email, password_hash, rol) VALUES (?, ?, ?, ?)"
            result = execute_query(insert_query, (username, email, password_hash, role), commit=True)
        
        # CORRECCIÓN: Manejar ambos casos (entero o diccionario)
        rowcount = 0
        if isinstance(result, dict):
            rowcount = result.get('rowcount', 0)
        elif isinstance(result, int):
            rowcount = result
        
        if rowcount > 0:
            return jsonify({
                "success": True,
                "message": f"Usuario '{username}' creado exitosamente con rol '{role}'"
            })
        else:
            return jsonify({
                "success": False,
                "message": "No se pudo crear el usuario"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al crear usuario: {str(e)}"
        }), 500

def create_user_request():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        client_id = data.get('client_id')
        analyst_id = data.get('analyst_id')
        supervisor_id = data.get('supervisor_id')
        
        # Validar campos requeridos
        if not username or not password or not role:
            return jsonify({
                "success": False, 
                "message": "Faltan campos requeridos: username, password o role"
            }), 400
            
        # Validar rol permitido
        if role not in ['analyst', 'supervisor', 'client']:
            return jsonify({
                "success": False,
                "message": "Rol inválido. Los roles permitidos son 'analyst', 'supervisor' o 'client'"
            }), 400
        
        # Validar asociaciones según el rol
        if role == 'client' and not client_id:
            return jsonify({
                "success": False,
                "message": "Para crear un usuario cliente, debe asociarse a un cliente existente"
            }), 400
        if role == 'analyst' and not analyst_id:
            return jsonify({
                "success": False,
                "message": "Para crear un usuario analista, debe asociarse a un analista existente"
            }), 400
        if role == 'supervisor' and not supervisor_id:
            return jsonify({
                "success": False,
                "message": "Para crear un usuario supervisor, debe asociarse a un supervisor existente"
            }), 400
            
        # Verificar si el usuario ya existe (para evitar solicitudes duplicadas)
        check_query = "SELECT COUNT(*) FROM USUARIOS WHERE username = ?"
        user_exists = execute_query(check_query, (username,), fetch_one=True)
        if user_exists and user_exists > 0:  # Cambiado user_exists[0] a user_exists
            return jsonify({
                "success": False,
                "message": "El nombre de usuario ya existe"
            }), 409
            
        # Preparar datos para la solicitud
        request_data = {
            "username": username,
            "email": email,
            "password": password,  # Se procesará en el servidor al aprobar
            "role": role,
            "client_id": client_id,
            "analyst_id": analyst_id,
            "supervisor_id": supervisor_id
        }
        
        # Insertar solicitud en la tabla SOLICITUDES
        import json
        request_data_json = json.dumps(request_data)
        insert_query = """INSERT INTO SOLICITUDES 
                        (tipo_solicitud, datos, estado, id_solicitante)
                        VALUES ('creacion_usuario', ?, 'pendiente', ?)"""
        result = execute_query(insert_query, (request_data_json, current_user.id), commit=True)
        
        # CORRECCIÓN: Manejar ambos casos (entero o diccionario)
        rowcount = 0
        if isinstance(result, dict):
            rowcount = result.get('rowcount', 0)
        elif isinstance(result, int):
            rowcount = result
        
        if rowcount > 0:
            return jsonify({
                "success": True,
                "message": "Solicitud de creación de usuario creada. Espera aprobación del administrador."
            })
        else:
            return jsonify({
                "success": False, 
                "message": "No se pudo crear la solicitud"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al crear solicitud: {str(e)}"
        }), 500
    
    
@users_bp.route('/api/remove-user', methods=['POST'])
@login_required
def remove_user():
    # Verificar si es administrador
    if current_user.rol == 'admin':
        return remove_user_directly()
    elif current_user.rol == 'analyst':
        return remove_user_request()
    else:
        return jsonify({
            "success": False,
            "message": "Acceso denegado: Rol no autorizado para eliminar usuarios"
        }), 403

def remove_user_directly():
    # Obtener datos del request
    data = request.get_json()
    username = data.get('username')
    
    # Validar datos
    if not username:
        return jsonify({
            "success": False,
            "message": "Nombre de usuario requerido"
        }), 400

    try:
        # Prevenir auto-eliminación
        if current_user.username == username:
            return jsonify({
                "success": False,
                "message": "No puedes eliminarte a ti mismo"
            }), 400
        
        # Obtener información del usuario a eliminar
        user_query = "SELECT id_usuario, rol FROM USUARIOS WHERE username = ?"
        user_data = execute_query(user_query, (username,), fetch_one=True)
        
        # Verificar si existe el usuario
        if not user_data:
            return jsonify({
                "success": False,
                "message": "Usuario no encontrado"
            }), 404
            
        # Prevenir eliminación de otros administradores
        if user_data[1] == 'admin':  # user_data es una tupla, mantener [1]
            return jsonify({
                "success": False,
                "message": "No puedes eliminar otros administradores"
            }), 403
        
        # Eliminar usuario (con commit=True)
        delete_query = "DELETE FROM USUARIOS WHERE username = ?"
        result = execute_query(delete_query, (username,), commit=True)
        
        # CORRECCIÓN: Manejar ambos casos (entero o diccionario)
        rowcount = 0
        if isinstance(result, dict):
            rowcount = result.get('rowcount', 0)
        elif isinstance(result, int):
            rowcount = result
        
        if rowcount > 0:
            return jsonify({
                "success": True,
                "message": f"Usuario '{username}' eliminado correctamente"
            })
        else:
            return jsonify({
                "success": False,
                "message": "No se pudo eliminar el usuario"
            })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al eliminar usuario: {str(e)}"
        }), 500

def remove_user_request():
    try:
        data = request.get_json()
        username = data.get('username')
        
        # Validar datos
        if not username:
            return jsonify({
                "success": False,
                "message": "Nombre de usuario requerido"
            }), 400

        # Prevenir auto-eliminación
        if current_user.username == username:
            return jsonify({
                "success": False,
                "message": "No puedes solicitarte tu propia eliminación"
            }), 400
        
        # Verificar si existe el usuario
        user_query = "SELECT id_usuario, rol FROM USUARIOS WHERE username = ?"
        user_data = execute_query(user_query, (username,), fetch_one=True)
        
        if not user_data:
            return jsonify({
                "success": False,
                "message": "Usuario no encontrado"
            }), 404
            
        # Prevenir solicitudes para eliminar administradores
        if user_data[1] == 'admin':  # user_data es una tupla, mantener [1]
            return jsonify({
                "success": False,
                "message": "No puedes solicitar la eliminación de administradores"
            }), 403
        
        # Preparar datos para la solicitud
        request_data = {
            "username": username,
            "user_id": user_data[0]  # user_data es una tupla, mantener [0]
        }
        
        # Insertar solicitud en la tabla SOLICITUDES
        import json
        request_data_json = json.dumps(request_data)
        insert_query = """INSERT INTO SOLICITUDES 
                        (tipo_solicitud, datos, estado, id_solicitante)
                        VALUES ('eliminacion_usuario', ?, 'pendiente', ?)"""
        result = execute_query(insert_query, (request_data_json, current_user.id), commit=True)
        
        # CORRECCIÓN: Manejar ambos casos (entero o diccionario)
        rowcount = 0
        if isinstance(result, dict):
            rowcount = result.get('rowcount', 0)
        elif isinstance(result, int):
            rowcount = result
        
        if rowcount > 0:
            return jsonify({
                "success": True,
                "message": "Solicitud de eliminación de usuario creada. Espera aprobación del administrador."
            })
        else:
            return jsonify({
                "success": False, 
                "message": "No se pudo crear la solicitud"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al crear solicitud: {str(e)}"
        }), 500

@users_bp.route('/api/list-users', methods=['GET'])
@login_required
def list_users():
    # Solo administradores pueden ver la lista de usuarios
    if current_user.rol != 'admin':
        return jsonify({
            "success": False,
            "message": "Acceso denegado: Se requiere rol de administrador"
        }), 403

    try:
        # Obtener lista de usuarios (excluyendo contraseñas)
        query = "SELECT id_usuario, username, rol FROM USUARIOS ORDER BY username"
        users = execute_query(query)
        
        # Formatear resultados
        user_list = [{
            "id": row[0],
            "username": row[1],
            "role": row[2]
        } for row in users]
        
        return jsonify({
            "success": True,
            "users": user_list
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al obtener lista de usuarios: {str(e)}"
        }), 500
    

@users_bp.route('/api/add-client', methods=['POST'])
@login_required
def add_client():
    # Verificar si es administrador
    if current_user.rol == 'admin':
        return add_client_directly()
    elif current_user.rol == 'analyst':
        return add_client_request()
    else:
        return jsonify({
            "success": False,
            "message": "Acceso denegado: Rol no autorizado para crear clientes"
        }), 403

def add_client_directly():
    # Obtener datos del request
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')  # Añadir email

    # Validar campos requeridos
    if not username or not password:
        return jsonify({
            "success": False,
            "message": "Faltan campos requeridos: username y password"
        }), 400

    # Si no se proporciona email, usar uno por defecto
    if not email:
        email = f"{username}@cliente.com"

    try:
        # Verificar si el usuario ya existe
        check_query = "SELECT COUNT(*) FROM USUARIOS WHERE username = ?"
        user_exists = execute_query(check_query, (username,), fetch_one=True)
        
        if user_exists and user_exists > 0:  # Cambiado user_exists[0] a user_exists
            return jsonify({
                "success": False,
                "message": "El nombre de usuario ya existe"
            }), 409

        # Hashear la contraseña
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Insertar nuevo cliente con rol 'client' (corregido de 'cliente' a 'client')
        insert_query = "INSERT INTO USUARIOS (username, email, password_hash, rol) VALUES (?, ?, ?, 'client')"
        result = execute_query(insert_query, (username, email, password_hash), commit=True)
        
        # CORRECCIÓN: Manejar ambos casos (entero o diccionario)
        rowcount = 0
        if isinstance(result, dict):
            rowcount = result.get('rowcount', 0)
        elif isinstance(result, int):
            rowcount = result
        
        if rowcount > 0:
            return jsonify({
                "success": True,
                "message": f"Cliente '{username}' creado exitosamente"
            })
        else:
            return jsonify({
                "success": False,
                "message": "No se pudo crear el cliente"
            })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al crear cliente: {str(e)}"
        }), 500

def add_client_request():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')  # Añadir email

        # Validar campos requeridos
        if not username or not password:
            return jsonify({
                "success": False,
                "message": "Faltan campos requeridos: username y password"
            }), 400

        # Si no se proporciona email, usar uno por defecto
        if not email:
            email = f"{username}@cliente.com"

        # Verificar si el usuario ya existe
        check_query = "SELECT COUNT(*) FROM USUARIOS WHERE username = ?"
        user_exists = execute_query(check_query, (username,), fetch_one=True)
        
        if user_exists and user_exists > 0:  # Cambiado user_exists[0] a user_exists
            return jsonify({
                "success": False,
                "message": "El nombre de usuario ya existe"
            }), 409

        # Preparar datos para la solicitud
        request_data = {
            "username": username,
            "email": email,
            "password": password
        }
        
        # Insertar solicitud en la tabla SOLICITUDES
        import json
        request_data_json = json.dumps(request_data)
        insert_query = """INSERT INTO SOLICITUDES 
                        (tipo_solicitud, datos, estado, id_solicitante)
                        VALUES ('creacion_cliente', ?, 'pendiente', ?)"""
        result = execute_query(insert_query, (request_data_json, current_user.id), commit=True)
        
        # CORRECCIÓN: Manejar ambos casos (entero o diccionario)
        rowcount = 0
        if isinstance(result, dict):
            rowcount = result.get('rowcount', 0)
        elif isinstance(result, int):
            rowcount = result
        
        if rowcount > 0:
            return jsonify({
                "success": True,
                "message": "Solicitud de creación de cliente creada. Espera aprobación del administrador."
            })
        else:
            return jsonify({
                "success": False, 
                "message": "No se pudo crear la solicitud"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al crear solicitud: {str(e)}"
        }), 500
    
@users_bp.route('/api/list-clients', methods=['GET'])
@login_required
def list_clients():
    # Solo administradores pueden ver la lista de clientes
    if current_user.rol != 'admin':
        return jsonify({
            "success": False,
            "message": "Acceso denegado: Se requiere rol de administrador"
        }), 403

    try:
        # Obtener lista de clientes (ajusta esta consulta según tu esquema de base de datos)
        query = "SELECT id_cliente, cliente FROM CLIENTES"
        clients = execute_query(query)
        
        # Formatear resultados
        client_list = [{
            "id": row[0],
            "cliente": row[1],
        } for row in clients]
        
        return jsonify({
            "success": True,
            "clients": client_list
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al obtener lista de clientes: {str(e)}"
        }), 500
    
@users_bp.route('/api/all-analysts', methods=['GET'])
@login_required
def get_all_analysts():
    if current_user.rol != 'admin':
        return jsonify({
            "success": False,
            "message": "Acceso denegado: Se requiere rol de administrador"
        }), 403
    
    try:
        query = "SELECT id_analista, nombre_analista FROM ANALISTAS"
        analysts = execute_query(query)
        
        analysts_list = [{
            "id_analista": row[0],
            "nombre_analista": row[1]
        } for row in analysts]
        
        return jsonify({
            "success": True,
            "analysts": analysts_list
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al obtener analistas: {str(e)}"
        }), 500

@users_bp.route('/api/all-supervisors', methods=['GET'])
@login_required
def get_all_supervisors():
    if current_user.rol != 'admin':
        return jsonify({
            "success": False,
            "message": "Acceso denegado: Se requiere rol de administrador"
        }), 403
    
    try:
        query = "SELECT id_supervisor, nombre_supervisor FROM SUPERVISORES"
        supervisors = execute_query(query)
        
        supervisors_list = [{
            "id_supervisor": row[0],
            "nombre_supervisor": row[1]
        } for row in supervisors]
        
        return jsonify({
            "success": True,
            "supervisors": supervisors_list
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al obtener supervisores: {str(e)}"
        }), 500