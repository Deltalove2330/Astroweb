# app/socket_chat.py
from flask_socketio import emit, join_room, leave_room
from flask import request
from datetime import datetime
import logging
import pyodbc
from config import config

logger = logging.getLogger(__name__)

def get_db_connection():
    """Obtener conexión a la base de datos"""
    return pyodbc.connect(config.SQLALCHEMY_DATABASE_URI)

def init_chat_socketio(socketio):
    """Registrar todos los event handlers del chat EN NAMESPACE /chat"""
    
    @socketio.on('connect', namespace='/chat')
    def handle_connect():
        """Cliente conectado al chat de analista"""
        logger.info(f"🟢 Cliente conectado a /chat - SID: {request.sid}")
        emit('connection_status', {'status': 'connected', 'namespace': '/chat'}, namespace='/chat')
    
    @socketio.on('disconnect', namespace='/chat')
    def handle_disconnect():
        """Cliente desconectado del chat de analista"""
        logger.info(f"🔴 Cliente desconectado de /chat - SID: {request.sid}")
    
    @socketio.on('join_chat', namespace='/chat')
    def handle_join_chat(data):
        """Usuario se une a la sala de chat de una visita"""
        visit_id = data.get('visit_id')
        username = data.get('username', 'Usuario')
        
        logger.info(f"🚪 {username} se une al chat de visita {visit_id}")
        
        # Unirse a la sala específica de la visita
        room = f"chat_visit_{visit_id}"
        join_room(room, namespace='/chat')
        
        # Cargar historial de mensajes desde la base de datos
        try:
            from app.utils.database import execute_query
            
            query = """
                SELECT
                    cm.id_mensaje,
                    cm.id_visita,
                    cm.id_usuario,
                    cm.username,
                    cm.mensaje,
                    cm.tipo_mensaje,
                    cm.fecha_envio,
                    cm.visto,
                    cm.metadata
                FROM CHAT_MENSAJES cm
                WHERE cm.id_visita = ?
                ORDER BY cm.fecha_envio ASC
            """
            
            mensajes_raw = execute_query(query, (visit_id,))
            
            # Formatear mensajes
            mensajes = []
            for msg in mensajes_raw:
                mensajes.append({
                    'id_mensaje': msg[0],
                    'id_visita': msg[1],
                    'id_usuario': msg[2],
                    'username': msg[3],
                    'mensaje': msg[4],
                    'tipo_mensaje': msg[5],
                    'fecha_envio': msg[6].isoformat() if msg[6] else None,
                    'visto': bool(msg[7]),
                    'metadata': msg[8]
                })
            
            logger.info(f"📨 Enviando {len(mensajes)} mensajes del historial")
            
            # Enviar historial al cliente
            emit('chat_history', {
                'success': True,
                'mensajes': mensajes
            }, namespace='/chat')
            
            # Notificar a otros en la sala
            emit('user_joined_chat', {
                'username': username,
                'visit_id': visit_id
            }, room=room, include_self=False, namespace='/chat')
            
        except Exception as e:
            logger.error(f"❌ Error al cargar historial: {str(e)}")
            emit('chat_error', {'error': f'Error al cargar mensajes: {str(e)}'}, namespace='/chat')
    
    @socketio.on('send_message', namespace='/chat')
    def handle_send_message(data):
        """Usuario envía un mensaje"""
        visit_id = data.get('visit_id')
        username = data.get('username', 'Usuario')
        mensaje = data.get('mensaje', '')
        
        logger.info(f"💬 {username} envía mensaje a visita {visit_id}: {mensaje}")
        
        if not mensaje.strip():
            emit('chat_error', {'error': 'El mensaje está vacío'}, namespace='/chat')
            return
        
        conn = None
        cursor = None
        try:
            from flask_login import current_user
            
            # Obtener ID del usuario actual
            if hasattr(current_user, 'id') and current_user.is_authenticated:
                id_usuario = current_user.id
            else:
                id_usuario = None
                try:
                    from app.utils.database import execute_query
                    logger.info(f"🔍 Buscando mercaderista con username='{username}' (tipo: {type(username)})")
                    
                    row = execute_query("""
                        SELECT u.id_usuario, m.nombre
                        FROM USUARIOS u
                        JOIN MERCADERISTAS m ON u.id_mercaderista = m.id_mercaderista
                        WHERE u.username = ?
                    """, (str(username),), fetch_one=True)
                    
                    logger.info(f"🔍 Resultado de la query: {row} (tipo: {type(row)})")
                    
                    if row:
                        id_usuario = int(row[0])
                        nombre_real = str(row[1]) if row[1] else None
                        if nombre_real:
                            username = nombre_real
                        logger.info(f"✅ Resuelto: id_usuario={id_usuario}, username={username}")
                    else:
                        logger.warning(f"⚠️ No se encontró usuario con username='{username}'")
                        # Intentar búsqueda alternativa por cedula (si username viene como int)
                        row2 = execute_query("""
                            SELECT u.id_usuario, m.nombre
                            FROM USUARIOS u
                            JOIN MERCADERISTAS m ON u.id_mercaderista = m.id_mercaderista
                            WHERE CAST(u.username AS VARCHAR(20)) = CAST(? AS VARCHAR(20))
                        """, (str(username),), fetch_one=True)
                        logger.info(f"🔍 Búsqueda alternativa: {row2}")
                        if row2:
                            id_usuario = int(row2[0])
                            nombre_real = str(row2[1]) if row2[1] else None
                            if nombre_real:
                                username = nombre_real
                            logger.info(f"✅ Resuelto por búsqueda alternativa: id_usuario={id_usuario}")
                        
                except Exception as e:
                    logger.error(f"❌ Error resolviendo mercaderista: {e}")
                    import traceback
                    logger.error(traceback.format_exc())
                
                # Si todavía es None, no podemos insertar
                if id_usuario is None:
                    logger.error(f"❌ id_usuario sigue siendo None para username='{username}'. Abortando.")
                    emit('chat_error', {'error': 'No se pudo identificar al usuario. Intenta cerrar sesión y volver a entrar.'}, namespace='/chat')
                    return  

            
            
            logger.info(f"🔍 Insertando mensaje en DB...")
            logger.info(f"   - visit_id: {visit_id}")
            logger.info(f"   - id_usuario: {id_usuario}")
            logger.info(f"   - username: {username}")
            
            # ✅ USAR CONEXIÓN MANUAL PARA TENER CONTROL DEL COMMIT
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Insertar mensaje con OUTPUT
            insert_query = """
                INSERT INTO CHAT_MENSAJES
                (id_visita, id_usuario, username, mensaje, tipo_mensaje, fecha_envio, visto)
                OUTPUT INSERTED.id_mensaje, INSERTED.fecha_envio
                VALUES (?, ?, ?, ?, 'usuario', GETDATE(), 0)
            """
            
            cursor.execute(insert_query, (visit_id, id_usuario, username, mensaje))
            result = cursor.fetchone()
            
            # ✅ HACER COMMIT EXPLÍCITO
            conn.commit()
            
            if not result:
                logger.error("❌ No se obtuvo resultado del INSERT")
                emit('chat_error', {'error': 'Error al guardar mensaje'}, namespace='/chat')
                return
            
            id_mensaje = result[0]
            fecha_envio = result[1]
            
            logger.info(f"✅ Mensaje guardado en DB con ID: {id_mensaje}")
            
            # Preparar mensaje para broadcast
            mensaje_data = {
                'id_mensaje': id_mensaje,
                'id_visita': visit_id,
                'id_usuario': id_usuario,
                'username': username,
                'mensaje': mensaje,
                'tipo_mensaje': 'usuario',
                'fecha_envio': fecha_envio.isoformat() if fecha_envio else None,
                'visto': False
            }
            
            # Enviar mensaje a todos en la sala
            room = f"chat_visit_{visit_id}"
            emit('new_message', mensaje_data, room=room, namespace='/chat')
            logger.info(f"📤 Mensaje enviado a sala: {room}")
            
        except Exception as e:
            logger.error(f"❌ Error al enviar mensaje: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            if conn:
                conn.rollback()
            emit('chat_error', {'error': f'Error al enviar mensaje: {str(e)}'}, namespace='/chat')
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
    
    
 
    @socketio.on('mark_message_read', namespace='/chat')
    def handle_mark_read(data):
        id_mensaje           = data.get('id_mensaje')
        visit_id             = data.get('visit_id')
        username_from_client = data.get('username')   # cédula del mercaderista

        if not id_mensaje:
            return

        conn   = None
        cursor = None
        try:
            from flask_login import current_user

            # ── 1. Resolver id_usuario ─────────────────────────────────────
            if hasattr(current_user, 'id') and current_user.is_authenticated:
                id_usuario = current_user.id
            else:
                # Mercaderista no autenticado con Flask-Login
                id_usuario = None
                if username_from_client:
                    try:
                        from app.utils.database import execute_query as eq
                        row = eq("""
                            SELECT u.id_usuario
                            FROM USUARIOS u
                            JOIN MERCADERISTAS m ON u.id_mercaderista = m.id_mercaderista
                            WHERE u.username = ?
                        """, (str(username_from_client),), fetch_one=True)
                        if row:
                            id_usuario = int(row[0])
                        else:
                            # Búsqueda alternativa por cast
                            row2 = eq("""
                                SELECT u.id_usuario
                                FROM USUARIOS u
                                JOIN MERCADERISTAS m ON u.id_mercaderista = m.id_mercaderista
                                WHERE CAST(u.username AS VARCHAR(20)) = CAST(? AS VARCHAR(20))
                            """, (str(username_from_client),), fetch_one=True)
                            if row2:
                                id_usuario = int(row2[0])
                    except Exception as e:
                        logger.error(f"❌ Error resolviendo id_usuario en mark_read: {e}")

            if id_usuario is None:
                logger.warning(f"⚠️ mark_message_read: no se pudo resolver id_usuario para '{username_from_client}'")
                return

            # ── 2. UPDATE visto=1 + fecha_visto en CHAT_MENSAJES ──────────
            conn   = get_db_connection()
            cursor = conn.cursor()

            cursor.execute("""
                UPDATE CHAT_MENSAJES
                SET visto = 1, fecha_visto = GETDATE()
                WHERE id_mensaje = ?
                  AND id_usuario != ?
                  AND visto = 0
            """, (id_mensaje, id_usuario))

            # ── 3. INSERT en CHAT_LECTURAS (evitar duplicados) ────────────
            cursor.execute("""
                IF NOT EXISTS (
                    SELECT 1 FROM CHAT_LECTURAS
                    WHERE id_mensaje = ? AND id_usuario = ?
                )
                INSERT INTO CHAT_LECTURAS (id_mensaje, id_usuario, fecha_lectura)
                VALUES (?, ?, GETDATE())
            """, (id_mensaje, id_usuario, id_mensaje, id_usuario))

            conn.commit()
            logger.info(f"✅ Mensaje {id_mensaje} marcado leído por usuario {id_usuario}")

            # ── 4. Notificar al emisor del mensaje ─────────────────────────
            emit('message_read', {
                'id_mensaje': id_mensaje,
                'visit_id':   visit_id
            }, room=f"chat_visit_{visit_id}", namespace='/chat')

        except Exception as e:
            logger.error(f"❌ Error en handle_mark_read: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            if conn:
                conn.rollback()
        finally:
            if cursor: cursor.close()
            if conn:   conn.close()
    
    @socketio.on('typing_indicator', namespace='/chat')
    def handle_typing(data):
        """Indicador de escritura"""
        visit_id = data.get('visit_id')
        username = data.get('username')
        is_typing = data.get('is_typing', False)
        
        room = f"chat_visit_{visit_id}"
        emit('user_typing', {
            'username': username,
            'is_typing': is_typing
        }, room=room, include_self=False, namespace='/chat')
    
    @socketio.on('leave_chat', namespace='/chat')
    def handle_leave_chat(data):
        """Usuario sale de la sala de chat"""
        visit_id = data.get('visit_id')
        username = data.get('username', 'Usuario')
        
        logger.info(f"👋 {username} sale del chat de visita {visit_id}")
        
        room = f"chat_visit_{visit_id}"
        leave_room(room, namespace='/chat')
        
        # Notificar a otros
        emit('user_left_chat', {
            'username': username,
            'visit_id': visit_id
        }, room=room, namespace='/chat')
    
    logger.info("✅ Event handlers del chat de ANALISTA registrados en /chat")