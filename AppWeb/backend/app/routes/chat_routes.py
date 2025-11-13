# app/routes/chat_routes.py
from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from app.utils.database import execute_query, get_db_connection

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/api/photo-chat/<int:photo_id>', methods=['GET'])
@login_required
def get_photo_chat(photo_id):
    """Obtener historial del chat de una foto"""
    try:
        query = """
            SELECT 
                cf.id_chat, 
                cf.id_usuario, 
                cf.tipo_usuario, 
                cf.mensaje, 
                cf.fecha_mensaje,
                cf.leido,
                CASE 
                    WHEN cf.tipo_usuario = 'cliente' THEN c.cliente
                    ELSE u.username
                END as nombre_usuario
            FROM CHAT_FOTOS cf
            LEFT JOIN USUARIOS u ON cf.id_usuario = u.id
            LEFT JOIN CLIENTES c ON u.cliente_id = c.id_cliente
            WHERE cf.id_foto = ?
            ORDER BY cf.fecha_mensaje ASC
        """
        results = execute_query(query, (photo_id,))
        
        mensajes = []
        for row in results:
            mensajes.append({
                'id_chat': row[0],
                'id_usuario': row[1],
                'tipo_usuario': row[2],
                'mensaje': row[3],
                'fecha_mensaje': row[4].isoformat() if row[4] else None,
                'leido': bool(row[5]) if row[5] is not None else False,
                'username': row[6],
                'es_mio': row[1] == current_user.id
            })
        
        return jsonify(mensajes)
        
    except Exception as e:
        current_app.logger.error(f"Error en get_photo_chat: {str(e)}")
        return jsonify({'error': str(e)}), 500


@chat_bp.route('/api/send-chat-message', methods=['POST'])
@login_required
def send_chat_message():
    """Enviar mensaje en el chat de una foto"""
    try:
        data = request.get_json()
        photo_id = data.get('photo_id')
        mensaje = data.get('mensaje', '').strip()
        
        if not mensaje:
            return jsonify({'error': 'El mensaje no puede estar vacío'}), 400
        
        if not photo_id:
            return jsonify({'error': 'ID de foto requerido'}), 400
        
        tipo_usuario = 'cliente' if current_user.rol == 'client' else 'analista'
        
        query = """
            INSERT INTO CHAT_FOTOS (id_foto, id_usuario, tipo_usuario, mensaje, leido)
            VALUES (?, ?, ?, ?, 0)
        """
        execute_query(query, (photo_id, current_user.id, tipo_usuario, mensaje))
        
        return jsonify({'success': True, 'message': 'Mensaje enviado'})
        
    except Exception as e:
        current_app.logger.error(f"Error en send_chat_message: {str(e)}")
        return jsonify({'error': str(e)}), 500


@chat_bp.route('/api/approve-photo', methods=['POST'])
@login_required
def approve_photo():
    """Aprobar una foto"""
    if current_user.rol != 'client':
        return jsonify({'error': 'No autorizado'}), 403
    
    try:
        data = request.get_json()
        photo_id = data.get('photo_id')
        
        if not photo_id:
            return jsonify({'error': 'ID de foto requerido'}), 400
        
        query = """
            UPDATE FOTOS_TOTALES 
            SET estado = 'Aprobada'
            WHERE id_foto = ?
        """
        execute_query(query, (photo_id,))
        
        return jsonify({'success': True, 'message': 'Foto aprobada correctamente'})
        
    except Exception as e:
        current_app.logger.error(f"Error en approve_photo: {str(e)}")
        return jsonify({'error': str(e)}), 500