# app/socket_chat_cliente.py
# Chat en tiempo real para módulo de clientes - CORREGIDO

from flask_socketio import emit, join_room, leave_room
from flask import request
from app.utils.database import get_db_connection
import json

def init_chat_cliente_socketio(socketio):
    """Inicializa los eventos de Socket.IO para el chat de clientes"""
    
    @socketio.on('join_chat_cliente')
    def handle_join_chat_cliente(data):
        """Usuario se une a una sala de chat de cliente"""
        try:
            visit_id = data.get('visit_id')
            cliente_id = data.get('cliente_id')
            username = data.get('username')
            
            if not visit_id or not cliente_id:
                emit('chat_error_cliente', {'error': 'Datos incompletos'})
                return
            
            # Sala única por visita Y cliente
            room = f"chat_visit_{visit_id}_client_{cliente_id}"
            join_room(room)
            
            print(f"🔵 Usuario {username} se unió a sala cliente: {room}")
            
            # Cargar historial de mensajes - INCLUYE METADATA
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id_mensaje, username, mensaje, tipo_mensaje, fecha_envio, visto, metadata
                FROM CHAT_MENSAJES_CLIENTE
                WHERE id_visita = ? AND id_cliente = ?
                ORDER BY fecha_envio ASC
            """, (visit_id, cliente_id))
            
            mensajes = []
            for row in cursor.fetchall():
                # Parsear metadata si existe
                metadata_parsed = None
                if row[6]:  # columna metadata
                    try:
                        metadata_parsed = json.loads(row[6]) if isinstance(row[6], str) else row[6]
                    except:
                        metadata_parsed = None
                
                mensajes.append({
                    'id_mensaje': row[0],
                    'username': row[1],
                    'mensaje': row[2],
                    'tipo_mensaje': row[3],
                    'fecha_envio': row[4].isoformat() if row[4] else None,
                    'visto': bool(row[5]),
                    'metadata': metadata_parsed  # ← INCLUIR METADATA
                })
            
            cursor.close()
            conn.close()
            
            # Enviar historial al usuario que se unió
            emit('chat_history_cliente', {'mensajes': mensajes})
            
            # Notificar a otros en la sala
            emit('user_joined_chat_cliente', {'username': username}, room=room, include_self=False)
            
        except Exception as e:
            print(f"❌ Error en join_chat_cliente: {str(e)}")
            import traceback
            traceback.print_exc()
            emit('chat_error_cliente', {'error': str(e)})
    
    @socketio.on('send_message_cliente')
    def handle_send_message_cliente(data):
        """Enviar mensaje en el chat de cliente"""
        try:
            visit_id = data.get('visit_id')
            cliente_id = data.get('cliente_id')
            username = data.get('username')
            mensaje = data.get('mensaje', '').strip()
            
            if not visit_id or not cliente_id or not mensaje:
                emit('chat_error_cliente', {'error': 'Datos incompletos'})
                return
            
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Insertar mensaje
            cursor.execute("""
                INSERT INTO CHAT_MENSAJES_CLIENTE 
                (id_visita, id_cliente, username, mensaje, tipo_mensaje)
                OUTPUT INSERTED.id_mensaje, INSERTED.fecha_envio
                VALUES (?, ?, ?, ?, 'usuario')
            """, (visit_id, cliente_id, username, mensaje))
            
            result = cursor.fetchone()
            conn.commit()
            cursor.close()
            conn.close()
            
            if result:
                mensaje_data = {
                    'id_mensaje': result[0],
                    'id_visita': visit_id,
                    'id_cliente': cliente_id,
                    'username': username,
                    'mensaje': mensaje,
                    'tipo_mensaje': 'usuario',
                    'fecha_envio': result[1].isoformat() if result[1] else None,
                    'visto': False,
                    'metadata': None
                }
                
                # Emitir a toda la sala
                room = f"chat_visit_{visit_id}_client_{cliente_id}"
                emit('new_message_cliente', mensaje_data, room=room)
                
                print(f"💬 Mensaje enviado en sala cliente {room}: {mensaje[:50]}...")
            
        except Exception as e:
            print(f"❌ Error en send_message_cliente: {str(e)}")
            import traceback
            traceback.print_exc()
            emit('chat_error_cliente', {'error': str(e)})
    
    @socketio.on('mark_messages_read_cliente')
    def handle_mark_messages_read_cliente(data):
        """Marcar mensajes como leídos"""
        try:
            visit_id = data.get('visit_id')
            cliente_id = data.get('cliente_id')
            username = data.get('username')
            
            if not visit_id or not cliente_id:
                return
            
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Marcar todos los mensajes no propios como leídos
            cursor.execute("""
                UPDATE CHAT_MENSAJES_CLIENTE 
                SET visto = 1 
                WHERE id_visita = ? AND id_cliente = ? AND username != ? AND visto = 0
            """, (visit_id, cliente_id, username))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            # Notificar a la sala
            room = f"chat_visit_{visit_id}_client_{cliente_id}"
            emit('messages_read_cliente', {
                'visit_id': visit_id,
                'cliente_id': cliente_id,
                'read_by': username
            }, room=room)
            
        except Exception as e:
            print(f"❌ Error en mark_messages_read_cliente: {str(e)}")
    
    @socketio.on('typing_indicator_cliente')
    def handle_typing_cliente(data):
        """Indicador de escritura"""
        try:
            visit_id = data.get('visit_id')
            cliente_id = data.get('cliente_id')
            username = data.get('username')
            is_typing = data.get('is_typing', False)
            
            room = f"chat_visit_{visit_id}_client_{cliente_id}"
            emit('user_typing_cliente', {
                'username': username, 
                'is_typing': is_typing
            }, room=room, include_self=False)
            
        except Exception as e:
            print(f"❌ Error en typing_indicator_cliente: {str(e)}")
    
    @socketio.on('leave_chat_cliente')
    def handle_leave_cliente(data):
        """Usuario abandona la sala de chat"""
        try:
            visit_id = data.get('visit_id')
            cliente_id = data.get('cliente_id')
            username = data.get('username')
            
            room = f"chat_visit_{visit_id}_client_{cliente_id}"
            leave_room(room)
            
            emit('user_left_chat_cliente', {'username': username}, room=room)
            print(f"🔴 Usuario {username} salió de sala cliente: {room}")
            
        except Exception as e:
            print(f"❌ Error en leave_chat_cliente: {str(e)}")


def emit_system_message_cliente(socketio, visit_id, cliente_id, mensaje, metadata=None):
    """
    Función helper para emitir mensajes del sistema al chat de cliente.
    Usada cuando se rechaza una foto para notificar en el chat.
    
    IMPORTANTE: La metadata se guarda en BD Y se envía por WebSocket
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Serializar metadata a JSON string para guardar en BD
        metadata_json = None
        if metadata:
            try:
                metadata_json = json.dumps(metadata, ensure_ascii=False)
                print(f"📦 Metadata serializada: {metadata_json[:200]}...")
            except Exception as e:
                print(f"⚠️ Error serializando metadata: {e}")
                metadata_json = None
        
        # Insertar mensaje de sistema con metadata
        cursor.execute("""
            INSERT INTO CHAT_MENSAJES_CLIENTE 
            (id_visita, id_cliente, username, mensaje, tipo_mensaje, metadata)
            OUTPUT INSERTED.id_mensaje, INSERTED.fecha_envio
            VALUES (?, ?, 'Sistema', ?, 'sistema', ?)
        """, (visit_id, cliente_id, mensaje, metadata_json))
        
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        if result:
            # ═══════════════════════════════════════════════════════════════
            # IMPORTANTE: Incluir metadata en el mensaje emitido por WebSocket
            # ═══════════════════════════════════════════════════════════════
            mensaje_data = {
                'id_mensaje': result[0],
                'id_visita': visit_id,
                'id_cliente': cliente_id,
                'username': 'Sistema',
                'mensaje': mensaje,
                'tipo_mensaje': 'sistema',
                'fecha_envio': result[1].isoformat() if result[1] else None,
                'visto': False,
                'metadata': metadata  # ← INCLUIR METADATA EN EMISIÓN
            }
            
            # Emitir a la sala del chat cliente
            room = f"chat_visit_{visit_id}_client_{cliente_id}"
            socketio.emit('new_message_cliente', mensaje_data, room=room, namespace='/')
            
            print(f"📢 Mensaje sistema emitido a sala {room}")
            print(f"   Con metadata: {bool(metadata)}")
            if metadata:
                print(f"   Tipo: {metadata.get('tipo_foto', 'N/A')}")
                print(f"   Cliente: {metadata.get('cliente', 'N/A')}")
                print(f"   Punto: {metadata.get('punto', 'N/A')}")
                print(f"   Razones: {metadata.get('razones', [])}")
            
            return True
            
    except Exception as e:
        print(f"❌ Error emitiendo mensaje sistema cliente: {str(e)}")
        import traceback
        traceback.print_exc()
        return False