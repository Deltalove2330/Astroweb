# app/socket_chat_grupo.py
"""
Chat en tiempo real para los GRUPOS por cliente (namespace /chat_grupo).

Salas: grupo_{id_grupo}. Autorización en cada join/send con membresía dinámica
(chat_grupos_membresia). Persiste en CHAT_GRUPO_MENSAJES; el historial inicial
se carga por REST (/api/chat-grupos/<id>/mensajes).
"""
from flask_socketio import emit, join_room, leave_room
from flask import request
import logging

from app.utils.database import get_db_connection, execute_query
from app.socket_chat import resolve_user_id
from app.utils.chat_grupos_membresia import usuario_es_miembro

logger = logging.getLogger(__name__)
NS = '/chat_grupo'


def _grupo_cliente_tipo(id_grupo):
    row = execute_query(
        "SELECT id_cliente, tipo_grupo FROM CHAT_GRUPOS WHERE id_grupo = ? AND activa = 1",
        (id_grupo,), fetch_one=True
    )
    return (row[0], row[1]) if row else (None, None)


def init_chat_grupo_socketio(socketio):
    """Registra los handlers del chat de grupos en el namespace /chat_grupo."""

    @socketio.on('connect', namespace=NS)
    def handle_connect():
        logger.info(f"🟢 Conectado a {NS} - SID: {request.sid}")
        emit('connection_status', {'status': 'connected', 'namespace': NS})

    @socketio.on('disconnect', namespace=NS)
    def handle_disconnect():
        logger.info(f"🔴 Desconectado de {NS} - SID: {request.sid}")

    @socketio.on('join_grupo', namespace=NS)
    def handle_join_grupo(data):
        from flask_login import current_user
        id_grupo = data.get('id_grupo')
        username_fb = data.get('username')
        if not id_grupo:
            emit('grupo_error', {'error': 'id_grupo requerido'}, namespace=NS)
            return

        id_usuario, _ = resolve_user_id(current_user, username_fb)
        id_cliente, tipo = _grupo_cliente_tipo(id_grupo)
        if id_cliente is None:
            emit('grupo_error', {'error': 'Grupo inexistente'}, namespace=NS)
            return
        if not usuario_es_miembro(id_usuario, id_cliente, tipo):
            emit('grupo_error', {'error': 'No autorizado'}, namespace=NS)
            return

        join_room(f"grupo_{id_grupo}", namespace=NS)
        emit('joined_grupo', {'id_grupo': id_grupo}, namespace=NS)

    @socketio.on('leave_grupo', namespace=NS)
    def handle_leave_grupo(data):
        id_grupo = data.get('id_grupo')
        if id_grupo:
            leave_room(f"grupo_{id_grupo}", namespace=NS)

    @socketio.on('send_message_grupo', namespace=NS)
    def handle_send_message_grupo(data):
        from flask_login import current_user
        id_grupo = data.get('id_grupo')
        mensaje = (data.get('mensaje') or '').strip()
        username_fb = data.get('username')

        if not id_grupo or not mensaje:
            emit('grupo_error', {'error': 'Datos incompletos'}, namespace=NS)
            return

        id_usuario, username = resolve_user_id(current_user, username_fb)
        if id_usuario is None:
            emit('grupo_error', {'error': 'Usuario no identificado'}, namespace=NS)
            return

        id_cliente, tipo = _grupo_cliente_tipo(id_grupo)
        if id_cliente is None or not usuario_es_miembro(id_usuario, id_cliente, tipo):
            emit('grupo_error', {'error': 'No autorizado'}, namespace=NS)
            return

        conn = cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO CHAT_GRUPO_MENSAJES
                    (id_grupo, id_usuario, username, mensaje, tipo_mensaje, fecha_envio)
                OUTPUT INSERTED.id_mensaje, INSERTED.fecha_envio
                VALUES (?, ?, ?, ?, 'usuario', GETDATE())
            """, (id_grupo, id_usuario, username, mensaje))
            result = cursor.fetchone()
            conn.commit()

            id_mensaje, fecha_envio = result[0], result[1]
            payload = {
                'id_mensaje': int(id_mensaje),
                'id_grupo': id_grupo,
                'id_usuario': id_usuario,
                'username': username,
                'mensaje': mensaje,
                'tipo_mensaje': 'usuario',
                'fecha_envio': fecha_envio.isoformat() if fecha_envio else None,
            }
            emit('new_message_grupo', payload, room=f"grupo_{id_grupo}", namespace=NS)
            logger.info(f"💬 grupo {id_grupo} ← {username}: {mensaje[:50]}")
        except Exception as e:
            logger.error(f"❌ send_message_grupo: {e}", exc_info=True)
            if conn:
                conn.rollback()
            emit('grupo_error', {'error': f'Error al enviar: {e}'}, namespace=NS)
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    @socketio.on('mark_read_grupo', namespace=NS)
    def handle_mark_read_grupo(data):
        from flask_login import current_user
        id_grupo = data.get('id_grupo')
        username_fb = data.get('username')
        if not id_grupo:
            return
        id_usuario, _ = resolve_user_id(current_user, username_fb)
        if id_usuario is None:
            return

        conn = cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "SELECT ISNULL(MAX(id_mensaje), 0) FROM CHAT_GRUPO_MENSAJES WHERE id_grupo = ?",
                (id_grupo,))
            last_id = cursor.fetchone()[0] or 0
            cursor.execute("""
                MERGE CHAT_GRUPO_LECTURAS AS t
                USING (SELECT ? AS id_grupo, ? AS id_usuario) AS s
                   ON t.id_grupo = s.id_grupo AND t.id_usuario = s.id_usuario
                WHEN MATCHED THEN
                    UPDATE SET last_read_id_mensaje = ?, fecha_actualizacion = GETDATE()
                WHEN NOT MATCHED THEN
                    INSERT (id_grupo, id_usuario, last_read_id_mensaje)
                    VALUES (?, ?, ?);
            """, (id_grupo, id_usuario, last_id, id_grupo, id_usuario, last_id))
            conn.commit()
            emit('grupo_leido', {'id_grupo': id_grupo, 'id_usuario': id_usuario,
                                 'last_read_id_mensaje': last_id}, namespace=NS)
        except Exception as e:
            logger.error(f"❌ mark_read_grupo: {e}", exc_info=True)
            if conn:
                conn.rollback()
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    @socketio.on('typing_grupo', namespace=NS)
    def handle_typing_grupo(data):
        id_grupo = data.get('id_grupo')
        username = data.get('username')
        is_typing = data.get('is_typing', False)
        if not id_grupo:
            return
        emit('user_typing_grupo', {'username': username, 'is_typing': is_typing},
             room=f"grupo_{id_grupo}", include_self=False, namespace=NS)

    logger.info(f"✅ Handlers del chat de GRUPOS registrados en {NS}")
