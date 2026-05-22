from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.utils.database import execute_query
import json
import bcrypt
from datetime import datetime

requests_bp = Blueprint('requests', __name__)

def verificar_permiso_solicitudes():
    """Verificar si el usuario tiene permiso para gestionar solicitudes"""
    # Permitir tanto a admin como a atención al cliente (id_rol = 10)
    if current_user.rol == 'admin':
        return True
    if current_user.id_rol == 10:  # Atención al Cliente
        return True
    return False

@requests_bp.route('/api/pending-requests', methods=['GET'])
@login_required
def get_pending_requests():
    if not verificar_permiso_solicitudes():
        return jsonify({
            "success": False,
            "message": "Acceso denegado: Se requiere rol de administrador o atención al cliente"
        }), 403

    try:
        query = """SELECT id_solicitud, tipo_solicitud, datos, estado, id_solicitante, fecha_solicitud
                   FROM SOLICITUDES
                   WHERE estado = 'pendiente'
                   ORDER BY fecha_solicitud DESC"""
        requests = execute_query(query)
        
        formatted_requests = []
        for req in requests:
            # Obtener información del solicitante
            user_query = "SELECT username, rol FROM USUARIOS WHERE id_usuario = ?"
            requester = execute_query(user_query, (req[4],), fetch_one=True)
            
            formatted_requests.append({
                "id": req[0],
                "type": req[1],
                "data": json.loads(req[2]),
                "status": req[3],
                "requester": {
                    "id": req[4],
                    "username": requester[0] if requester else "Desconocido",
                    "role": requester[1] if requester else "Desconocido"
                },
                "date": req[5].isoformat() if req[5] else None
            })
        
        return jsonify({
            "success": True,
            "requests": formatted_requests
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al obtener solicitudes: {str(e)}"
        }), 500

@requests_bp.route('/api/approve-request/<int:request_id>', methods=['POST'])
@login_required
def approve_request(request_id):
    if not verificar_permiso_solicitudes():
        return jsonify({
            "success": False,
            "message": "Acceso denegado: Se requiere rol de administrador o atención al cliente"
        }), 403
    
    try:
        # Obtener la solicitud
        query = "SELECT tipo_solicitud, datos FROM SOLICITUDES WHERE id_solicitud = ? AND estado = 'pendiente'"
        request_data = execute_query(query, (request_id,), fetch_one=True)
        
        if not request_data:
            return jsonify({
                "success": False,
                "message": "Solicitud no encontrada o ya procesada"
            }), 404
        
        tipo_solicitud = request_data[0]
        datos = json.loads(request_data[1])
        
        # Procesar según el tipo de solicitud
        if tipo_solicitud == 'creacion_usuario':
            # Lógica para crear usuario
            username = datos["username"]
            email = datos["email"]
            password = datos["password"]
            role = datos["role"]
            
            # Hashear la contraseña
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            # Insertar nuevo usuario
            if role == 'client':
                insert_query = "INSERT INTO USUARIOS (username, email, password_hash, rol, id_cliente) VALUES (?, ?, ?, ?, ?)"
                result = execute_query(insert_query, (username, email, password_hash, role, datos["client_id"]), commit=True)
            elif role == 'analyst':
                insert_query = "INSERT INTO USUARIOS (username, email, password_hash, rol, id_analista) VALUES (?, ?, ?, ?, ?)"
                result = execute_query(insert_query, (username, email, password_hash, role, datos["analyst_id"]), commit=True)
            elif role == 'supervisor':
                insert_query = "INSERT INTO USUARIOS (username, email, password_hash, rol, id_supervisor) VALUES (?, ?, ?, ?, ?)"
                result = execute_query(insert_query, (username, email, password_hash, role, datos["supervisor_id"]), commit=True)
            else:  # client
                insert_query = "INSERT INTO USUARIOS (username, email, password_hash, rol) VALUES (?, ?, ?, ?)"
                result = execute_query(insert_query, (username, email, password_hash, role), commit=True)
                
            if not (result and result.get('rowcount', 0) > 0):
                return jsonify({
                    "success": False,
                    "message": "No se pudo crear el usuario"
                }), 500
                
        elif tipo_solicitud == 'eliminacion_usuario':
            # Lógica para eliminar usuario
            username = datos["username"]
            delete_query = "DELETE FROM USUARIOS WHERE username = ?"
            result = execute_query(delete_query, (username,), commit=True)
            
            if not (result and result.get('rowcount', 0) > 0):
                return jsonify({
                    "success": False,
                    "message": "No se pudo eliminar el usuario"
                }), 500
                
        elif tipo_solicitud == 'creacion_mercaderista':
            # Lógica para crear mercaderista
            nombre = datos["nombre"]
            cedula = datos["cedula"]
            insert_query = "INSERT INTO MERCADERISTAS (nombre, cedula, activo) VALUES (?, ?, ?)"
            result = execute_query(insert_query, (nombre, cedula, 1), commit=True)
            
            if not (result and result.get('rowcount', 0) > 0):
                return jsonify({
                    "success": False,
                    "message": "No se pudo crear el mercaderista"
                }), 500
                
        elif tipo_solicitud == 'eliminacion_mercaderista':
            # 🔴 VERIFICACIÓN CRÍTICA - Agrega esto 🔴
            # Verificar si tiene visitas asociadas
            cedula = datos["cedula"]
            
            # Primero obtener el id_mercaderista
            mercaderista_query = "SELECT id_mercaderista FROM MERCADERISTAS WHERE cedula = ?"
            mercaderista = execute_query(mercaderista_query, (cedula,), fetch_one=True)
            
            if not mercaderista:
                return jsonify({
                    "success": False,
                    "message": "No existe el mercaderista"
                }), 404
            
            mercaderista_id = mercaderista[0]
            
            # Ahora verificar visitas asociadas
            visitas_query = "SELECT COUNT(*) FROM VISITAS_MERCADERISTA WHERE id_mercaderista = ?"
            count_visitas = execute_query(visitas_query, (mercaderista_id,), fetch_one=True)
            
            if count_visitas and count_visitas[0] > 0:
                return jsonify({
                    "success": False,
                    "message": "No se puede eliminar el mercaderista porque tiene visitas asociadas."
                }), 400
            
            # Eliminar mercaderista físicamente
            delete_query = "DELETE FROM MERCADERISTAS WHERE cedula = ?"
            result = execute_query(delete_query, (cedula,), commit=True)
            
            if not (result and result.get('rowcount', 0) > 0):
                return jsonify({
                    "success": False,
                    "message": "No se pudo eliminar el mercaderista"
                }), 500
                
        elif tipo_solicitud == 'cambio_estado_mercaderista':
            # Lógica para cambiar estado de mercaderista
            cedula = datos["cedula"]
            estado = 1 if datos["action"] == "enable" else 0
            activo_value = 1 if estado == 1 else 0  # ✅ Correcto (no binario)
            update_query = "UPDATE MERCADERISTAS SET activo = ? WHERE cedula = ?"
            result = execute_query(update_query, (activo_value, cedula), commit=True)
            
            if not (result and result.get('rowcount', 0) > 0):
                return jsonify({
                    "success": False,
                    "message": "No se pudo actualizar el estado del mercaderista"
                }), 500

        # Actualizar estado de la solicitud
        update_query = """UPDATE SOLICITUDES 
                        SET estado = 'aprobada', id_aprobador = ?, fecha_respuesta = GETDATE()
                        WHERE id_solicitud = ?"""
        execute_query(update_query, (current_user.id, request_id), commit=True)
        
        return jsonify({
            "success": True,
            "message": "Solicitud aprobada exitosamente"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al aprobar solicitud: {str(e)}"
        }), 500

@requests_bp.route('/api/reject-request/<int:request_id>', methods=['POST'])
@login_required
def reject_request(request_id):
    if not verificar_permiso_solicitudes():
        return jsonify({
            "success": False,
            "message": "Acceso denegado: Se requiere rol de administrador o atención al cliente"
        }), 403
    
    data = request.get_json()
    comment = data.get('comment', '')
    
    try:
        # Actualizar estado de la solicitud
        update_query = """UPDATE SOLICITUDES 
                        SET estado = 'rechazada', id_aprobador = ?, 
                            fecha_respuesta = GETDATE(), comentario = ?
                        WHERE id_solicitud = ?"""
        result = execute_query(update_query, (current_user.id, comment, request_id), commit=True)
        
        if result and result.get('rowcount', 0) > 0:
            return jsonify({
                "success": True,
                "message": "Solicitud rechazada"
            })
        else:
            return jsonify({
                "success": False,
                "message": "No se pudo rechazar la solicitud"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al rechazar solicitud: {str(e)}"
        }), 500