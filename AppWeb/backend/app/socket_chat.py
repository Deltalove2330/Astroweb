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

def resolve_user_id(current_user_obj, username_fallback=None):
    """
    Resuelve el id_usuario real (INT) desde cualquier fuente.
    
    Maneja los casos:
    - current_user.id es INT directo (analista/admin) → lo devuelve
    - current_user.id es "mercaderista_215" → busca en USUARIOS por id_mercaderista
    - current_user no autenticado → busca por username en USUARIOS
    
    Returns:
        tuple: (id_usuario: int|None, username: str)
    """
    from app.utils.database import execute_query
    
    id_usuario = None
    username = username_fallback or 'Usuario'
    
    # Intentar desde current_user
    if hasattr(current_user_obj, 'id') and current_user_obj.is_authenticated:
        raw_id = current_user_obj.id
        
        if isinstance(raw_id, int):
            # Caso simple: analista/admin con id numérico
            id_usuario = raw_id
            if hasattr(current_user_obj, 'username'):
                username = current_user_obj.username
        elif isinstance(raw_id, str) and raw_id.startswith('mercaderista_'):
            # Caso mercaderista: "mercaderista_215" → extraer id_mercaderista
            try:
                merc_id = int(raw_id.replace('mercaderista_', ''))
                row = execute_query("""
                    SELECT u.id_usuario, m.nombre
                    FROM USUARIOS u
                    JOIN MERCADERISTAS m ON u.id_mercaderista = m.id_mercaderista
                    WHERE u.id_mercaderista = ?
                """, (merc_id,), fetch_one=True)
                if row:
                    id_usuario = int(row[0]) if isinstance(row, (tuple, list)) else int(getattr(row, 'id_usuario', row[0] if hasattr(row, '__getitem__') else row))
                    nombre = row[1] if isinstance(row, (tuple, list)) and len(row) > 1 else None
                    if nombre:
                        username = nombre
                    logger.info(f"✅ resolve_user_id: mercaderista_{merc_id} → id_usuario={id_usuario}, nombre={username}")
            except (ValueError, TypeError) as e:
                logger.warning(f"⚠️ resolve_user_id: No se pudo parsear '{raw_id}': {e}")
        else:
            # Intentar convertir directamente
            try:
                id_usuario = int(raw_id)
            except (ValueError, TypeError):
                logger.warning(f"⚠️ resolve_user_id: id no numérico '{raw_id}'")
    
    # Si no se resolvió, intentar por username
    if id_usuario is None and username_fallback:
        try:
            row = execute_query("""
                SELECT u.id_usuario, m.nombre
                FROM USUARIOS u
                JOIN MERCADERISTAS m ON u.id_mercaderista = m.id_mercaderista
                WHERE u.username = ?
            """, (str(username_fallback),), fetch_one=True)
            
            if row:
                id_usuario = int(row[0]) if isinstance(row, (tuple, list)) else int(row)
                nombre = row[1] if isinstance(row, (tuple, list)) and len(row) > 1 else None
                if nombre:
                    username = nombre
            else:
                # Búsqueda alternativa por CAST
                row2 = execute_query("""
                    SELECT u.id_usuario, m.nombre
                    FROM USUARIOS u
                    JOIN MERCADERISTAS m ON u.id_mercaderista = m.id_mercaderista
                    WHERE CAST(u.username AS VARCHAR(20)) = CAST(? AS VARCHAR(20))
                """, (str(username_fallback),), fetch_one=True)
                if row2:
                    id_usuario = int(row2[0]) if isinstance(row2, (tuple, list)) else int(row2)
                    nombre = row2[1] if isinstance(row2, (tuple, list)) and len(row2) > 1 else None
                    if nombre:
                        username = nombre
        except Exception as e:
            logger.error(f"❌ resolve_user_id: Error buscando por username '{username_fallback}': {e}")
    
    return id_usuario, username

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
        username_from_client = data.get('username', 'Usuario')
        print(f'asdasdasddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd{username_from_client}', )
        mensaje = data.get('mensaje', '')
        
        logger.info(f"💬 {username_from_client} envía mensaje a visita {visit_id}: {mensaje}")
        
        if not mensaje.strip():
            emit('chat_error', {'error': 'El mensaje está vacío'}, namespace='/chat')
            return
        
        conn = None
        cursor = None
        try:
            from flask_login import current_user
            
            # ✅ USAR HELPER para resolver id_usuario correctamente
            id_usuario, username = resolve_user_id(current_user, username_from_client)
            
            if id_usuario is None:
                logger.error(f"❌ id_usuario no resuelto para '{username_from_client}'. Abortando.")
                emit('chat_error', {'error': 'No se pudo identificar al usuario. Intenta cerrar sesión y volver a entrar.'}, namespace='/chat')
                return
            
            logger.info(f"📤 Insertando mensaje: visit_id={visit_id}, id_usuario={id_usuario}, username={username}")
            
            conn = get_db_connection()
            cursor = conn.cursor()
            
            insert_query = """
                INSERT INTO CHAT_MENSAJES
                (id_visita, id_usuario, username, mensaje, tipo_mensaje, fecha_envio, visto)
                OUTPUT INSERTED.id_mensaje, INSERTED.fecha_envio
                VALUES (?, ?, ?, ?, 'usuario', GETDATE(), 0)
            """
            
            cursor.execute(insert_query, (visit_id, id_usuario, username, mensaje))
            result = cursor.fetchone()
            conn.commit()
            
            if not result:
                logger.error("❌ No se obtuvo resultado del INSERT")
                emit('chat_error', {'error': 'Error al guardar mensaje'}, namespace='/chat')
                return
            
            id_mensaje = result[0]
            fecha_envio = result[1]
            
            logger.info(f"✅ Mensaje guardado con ID: {id_mensaje}")
            
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
            
            room = f"chat_visit_{visit_id}"
            emit('new_message', mensaje_data, room=room, namespace='/chat')
            logger.info(f"📤 Mensaje emitido a sala: {room}")

             # ── Web Push al mercaderista ──────────────────────────
            try:
                from app.utils.push_service import enviar_push_mercaderista, get_cedula_de_visita
                cedula_merc = get_cedula_de_visita(visit_id)
                if cedula_merc:
                    enviar_push_mercaderista(
                        cedula = cedula_merc,
                        titulo = '💬 Nuevo mensaje — Analistas',
                        cuerpo = f'{username}: {mensaje[:80]}',
                        tipo   = 'analistas'
                    )
            except Exception as push_err:
                logger.warning(f"⚠️ Push analistas falló (no crítico): {push_err}")
            # ─────────────────────────────────────────────────────
            
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
        username_from_client = data.get('username')

        if not id_mensaje:
            return

        conn   = None
        cursor = None
        try:
            from flask_login import current_user

            # ✅ USAR HELPER para resolver id_usuario correctamente
            id_usuario, _ = resolve_user_id(current_user, username_from_client)

            if id_usuario is None:
                logger.warning(f"⚠️ mark_message_read: no se pudo resolver id_usuario para '{username_from_client}'")
                return

            conn   = get_db_connection()
            cursor = conn.cursor()

            # UPDATE visto=1 (global)
            cursor.execute("""
                UPDATE CHAT_MENSAJES
                SET visto = 1, fecha_visto = GETDATE()
                WHERE id_mensaje = ?
                  AND id_usuario != ?
                  AND visto = 0
            """, (id_mensaje, id_usuario))

            # INSERT en CHAT_LECTURAS (evitar duplicados)
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