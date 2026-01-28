# app/routes/chat.py
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.utils.database import execute_query, get_db_connection
from datetime import datetime

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/api/chat/messages/<int:photo_id>', methods=['GET'])
@login_required
def get_chat_messages(photo_id):
    """Obtener todos los mensajes de una foto"""
    try:
        query = """
            SELECT 
                m.id_mensaje,
                m.id_usuario,
                m.tipo_usuario,
                m.mensaje,
                m.file_path,
                m.fecha_mensaje,
                m.leido,
                u.username,
                CASE 
                    WHEN u.id_cliente IS NOT NULL THEN c.cliente
                    ELSE u.username
                END as nombre_display
            FROM CHAT_FOTOS_MENSAJES m
            LEFT JOIN USUARIOS u ON m.id_usuario = u.id_usuario
            LEFT JOIN CLIENTES c ON u.id_cliente = c.id_cliente
            WHERE m.id_foto = ?
            ORDER BY m.fecha_mensaje ASC
        """
        results = execute_query(query, (photo_id,))
        
        messages = []
        for row in results:
            messages.append({
                'id_mensaje': row[0],
                'id_usuario': row[1],
                'tipo_usuario': row[2],
                'mensaje': row[3],
                'file_path': row[4],
                'fecha_mensaje': row[5].isoformat() if row[5] else None,
                'leido': bool(row[6]),
                'username': row[7],
                'nombre_display': row[8],
                'es_mio': row[1] == current_user.id
            })
        
        return jsonify({'success': True, 'messages': messages})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@chat_bp.route('/api/chat/send', methods=['POST'])
@login_required
def send_message():
    """Enviar un mensaje en el chat"""
    try:
        data = request.get_json()
        photo_id = data.get('photo_id')
        mensaje = data.get('mensaje', '').strip()
        
        if not photo_id or not mensaje:
            return jsonify({'success': False, 'error': 'Datos incompletos'}), 400
        
        # Determinar tipo de usuario
        tipo_usuario = 'cliente' if current_user.rol == 'client' else 'analista'
        
        query = """
            INSERT INTO CHAT_FOTOS_MENSAJES 
            (id_foto, id_usuario, tipo_usuario, mensaje, fecha_mensaje, leido)
            OUTPUT INSERTED.id_mensaje, INSERTED.fecha_mensaje
            VALUES (?, ?, ?, ?, GETDATE(), 0)
        """
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query, (photo_id, current_user.id, tipo_usuario, mensaje))
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        if result:
            return jsonify({
                'success': True,
                'id_mensaje': result[0],
                'fecha_mensaje': result[1].isoformat()
            })
        else:
            return jsonify({'success': False, 'error': 'No se pudo insertar'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@chat_bp.route('/api/chat/mark-read/<int:photo_id>', methods=['POST'])
@login_required
def mark_messages_read(photo_id):
    """Marcar mensajes como leídos"""
    try:
        query = """
            UPDATE CHAT_FOTOS_MENSAJES 
            SET leido = 1 
            WHERE id_foto = ? AND id_usuario != ? AND leido = 0
        """
        execute_query(query, (photo_id, current_user.id))
        return jsonify({'success': True})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500