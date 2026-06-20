# app/routes/chat_websocket.py
from flask import request
from flask_socketio import emit, join_room, leave_room
from app.utils.database import get_db_connection
from datetime import datetime
import traceback

def register_socketio_events(socketio):
    """Registrar todos los eventos de Socket.IO"""
    
    @socketio.on('connect')
    def handle_connect():
        print(f"✅ Cliente conectado: {request.sid}")
        emit('connected', {'message': 'Conectado al servidor'})

    @socketio.on('disconnect')
    def handle_disconnect():
        print(f"❌ Cliente desconectado: {request.sid}")

    @socketio.on('join_visit_chat')
    def handle_join_visit_chat(data):
        try:
            visit_id = data.get('visit_id')
            user_id = data.get('user_id')
            
            if not visit_id:
                emit('error', {'message': 'ID de visita no proporcionado'})
                return
            
            room = f"visit_{visit_id}"
            join_room(room)
            
            print(f"✅ Usuario {user_id} se unió a la sala: {room}")
            emit('joined_room', {'room': room, 'visit_id': visit_id})
            
        except Exception as e:
            print(f"❌ Error al unirse a la sala: {str(e)}")
            traceback.print_exc()
            emit('error', {'message': f'Error al unirse al chat: {str(e)}'})

    @socketio.on('leave_visit_chat')
    def handle_leave_visit_chat(data):
        try:
            visit_id = data.get('visit_id')
            user_id = data.get('user_id')
            
            if not visit_id:
                return
            
            room = f"visit_{visit_id}"
            leave_room(room)
            
            print(f"✅ Usuario {user_id} salió de la sala: {room}")
            
        except Exception as e:
            print(f"❌ Error al salir de la sala: {str(e)}")
            traceback.print_exc()

    @socketio.on('send_message')
    def handle_send_message(data):
        conn = None
        cursor = None
        
        try:
            visit_id = data.get('visit_id')
            user_id = data.get('user_id')
            user_type = data.get('user_type', 'analista')
            message = data.get('message', '').strip()
            file_path = data.get('file_path', None)
            
            print(f"📨 Mensaje recibido:")
            print(f"   visit_id: {visit_id}")
            print(f"   user_id: {user_id}")
            print(f"   user_type: {user_type}")
            print(f"   message: {message}")
            
            # Validar datos
            if not visit_id or not user_id or not message:
                print(f"❌ Datos incompletos")
                emit('error', {'message': 'Datos incompletos'})
                return
            
            # Conectar a la base de datos
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # INSERTAR mensaje con OUTPUT para obtener el ID y fecha
            query = """
    INSERT INTO CHAT_FOTOS_MENSAJES 
    (id_foto, id_visita, id_usuario, tipo_usuario, mensaje, file_path, fecha_mensaje, leido)
    OUTPUT INSERTED.id_mensaje, INSERTED.fecha_mensaje
    VALUES (NULL, ?, ?, ?, ?, ?, GETDATE(), 0)
"""
            
            print(f"🔍 Ejecutando INSERT...")
            cursor.execute(query, (visit_id, user_id, user_type, message, file_path))
            result = cursor.fetchone()
            
            if not result:
                raise Exception("No se pudo insertar el mensaje en la base de datos")
            
            mensaje_id = result[0]
            fecha_mensaje = result[1]
            
            conn.commit()
            
            print(f"✅ Mensaje insertado:")
            print(f"   ID: {mensaje_id}")
            print(f"   Fecha: {fecha_mensaje}")
            
            # Emitir mensaje a todos en la sala
            room = f"visit_{visit_id}"
            message_data = {
                'id_mensaje': int(mensaje_id),
                'id_visita': visit_id,
                'id_usuario': user_id,
                'tipo_usuario': user_type,
                'mensaje': message,
                'file_path': file_path,
                'fecha_mensaje': fecha_mensaje.strftime('%Y-%m-%d %H:%M:%S'),
                'leido': False
            }
            
            print(f"📤 Emitiendo mensaje a sala: {room}")
            emit('new_message', message_data, room=room)
            print(f"✅ Mensaje emitido correctamente")
            
        except Exception as e:
            print(f"❌ Error al enviar mensaje: {str(e)}")
            traceback.print_exc()
            
            if conn:
                try:
                    conn.rollback()
                    print("🔄 Rollback ejecutado")
                except:
                    pass
            
            emit('error', {'message': f'Error al enviar mensaje: {str(e)}'})
            
        finally:
            if cursor:
                try:
                    cursor.close()
                except:
                    pass
            if conn:
                try:
                    conn.close()
                except:
                    pass

    @socketio.on('mark_messages_read')
    def handle_mark_messages_read(data):
        conn = None
        cursor = None
        
        try:
            visit_id = data.get('visit_id')
            user_id = data.get('user_id')
            
            if not visit_id or not user_id:
                emit('error', {'message': 'Datos incompletos para marcar mensajes'})
                return
            
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Marcar como leídos todos los mensajes de la visita que NO sean del usuario actual
            query = """
                UPDATE CHAT_FOTOS_MENSAJES 
                SET leido = 1 
                WHERE id_visita = ? 
                AND id_usuario != ? 
                AND leido = 0
            """
            
            cursor.execute(query, (visit_id, user_id))
            conn.commit()
            
            # Obtener el último mensaje leído
            cursor.execute("""
                SELECT MAX(id_mensaje) 
                FROM CHAT_FOTOS_MENSAJES 
                WHERE id_visita = ? AND leido = 1
            """, (visit_id,))
            
            result = cursor.fetchone()
            last_message_id = result[0] if result and result[0] else 0
            
            print(f"✅ Mensajes marcados como leídos en visita {visit_id}")
            
            # Notificar a todos en la sala
            room = f"visit_{visit_id}"
            emit('messages_read', {
                'visit_id': visit_id,
                'last_message_id': last_message_id,
                'reader_id': user_id
            }, room=room)
            
        except Exception as e:
            print(f"❌ Error al marcar mensajes como leídos: {str(e)}")
            traceback.print_exc()
            
            if conn:
                try:
                    conn.rollback()
                except:
                    pass
            
            emit('error', {'message': f'Error al marcar mensajes: {str(e)}'})
            
        finally:
            if cursor:
                try:
                    cursor.close()
                except:
                    pass
            if conn:
                try:
                    conn.close()
                except:
                    pass

    @socketio.on('typing')
    def handle_typing(data):
        try:
            visit_id = data.get('visit_id')
            user_id = data.get('user_id')
            is_typing = data.get('is_typing', False)
            
            if not visit_id:
                return
            
            room = f"visit_{visit_id}"
            emit('user_typing', {
                'user_id': user_id,
                'is_typing': is_typing
            }, room=room, include_self=False)
            
        except Exception as e:
            print(f"❌ Error en evento typing: {str(e)}")
            traceback.print_exc()

    @socketio.on_error_default
    def default_error_handler(e):
        print(f"❌ Error en Socket.IO: {str(e)}")
        traceback.print_exc()
        emit('error', {'message': f'Error del servidor: {str(e)}'})
    
    print("✅ Eventos de Socket.IO registrados:")
    print("   - connect")
    print("   - disconnect")
    print("   - join_visit_chat")
    print("   - leave_visit_chat")
    print("   - send_message")
    print("   - mark_messages_read")
    print("   - typing")