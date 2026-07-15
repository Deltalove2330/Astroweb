# app/socket_chat_grupo_visita.py
"""
Sub-hilo de chat por VISITA dentro de un grupo de cliente (namespace
/chat_grupo, mismo que socket_chat_grupo.py — reutiliza la conexion, solo
cambian los nombres de evento/sala para no chocar con el chat general del
grupo).

Permite, para una visita puntual, hablar solo con el equipo operativo o con
equipo+cliente — a diferencia del chat general del grupo (sin visita) y del
chat 1-a-1 de visita (CHAT_MENSAJES, ver socket_chat.py). Mismo patron que
CHAT_MENSAJES_GRUPO_VISITA en epran_backend (el backend movil) — comparte esa
tabla, y el watcher de epran_backend puentea los mensajes nuevos hacia el
socket del mercaderista (ver db-change-watcher.ts).

Salas: grupo_visita_{id_cliente}_{tipo_grupo}_{id_visita}. Autorizacion con la
misma membresia dinamica que el chat general del grupo (chat_grupos_membresia)
— si sos miembro del grupo del cliente, podes acceder a cualquier sub-hilo de
visita de ese grupo.
"""
from flask_socketio import emit, join_room, leave_room
from flask import request
import logging

from app.utils.database import get_db_connection, execute_query
from app.socket_chat import resolve_user_id
from app.utils.chat_grupos_membresia import usuario_es_miembro

logger = logging.getLogger(__name__)
NS = '/chat_grupo'


def _sala(id_cliente, tipo_grupo, id_visita):
    return f"grupo_visita_{id_cliente}_{tipo_grupo}_{id_visita}"


def init_chat_grupo_visita_socketio(socketio):
    """Registra los handlers del sub-hilo de visita en el namespace /chat_grupo."""

    @socketio.on('join_grupo_visita', namespace=NS)
    def handle_join_grupo_visita(data):
        from flask_login import current_user
        id_cliente = data.get('id_cliente')
        tipo_grupo = data.get('tipo_grupo')
        id_visita = data.get('id_visita')
        username_fb = data.get('username')

        if not id_cliente or not tipo_grupo or not id_visita:
            emit('grupo_error', {'error': 'id_cliente, tipo_grupo e id_visita son requeridos'}, namespace=NS)
            return

        id_usuario, _ = resolve_user_id(current_user, username_fb)
        if not usuario_es_miembro(id_usuario, id_cliente, tipo_grupo):
            emit('grupo_error', {'error': 'No autorizado'}, namespace=NS)
            return

        join_room(_sala(id_cliente, tipo_grupo, id_visita), namespace=NS)
        emit('joined_grupo_visita', {
            'id_cliente': id_cliente, 'tipo_grupo': tipo_grupo, 'id_visita': id_visita,
        }, namespace=NS)

    @socketio.on('leave_grupo_visita', namespace=NS)
    def handle_leave_grupo_visita(data):
        id_cliente = data.get('id_cliente')
        tipo_grupo = data.get('tipo_grupo')
        id_visita = data.get('id_visita')
        if id_cliente and tipo_grupo and id_visita:
            leave_room(_sala(id_cliente, tipo_grupo, id_visita), namespace=NS)

    @socketio.on('send_message_grupo_visita', namespace=NS)
    def handle_send_message_grupo_visita(data):
        from flask_login import current_user
        id_cliente = data.get('id_cliente')
        tipo_grupo = data.get('tipo_grupo')
        id_visita = data.get('id_visita')
        mensaje = (data.get('mensaje') or '').strip()
        username_fb = data.get('username')

        if not id_cliente or not tipo_grupo or not id_visita or not mensaje:
            emit('grupo_error', {'error': 'Datos incompletos'}, namespace=NS)
            return

        id_usuario, username = resolve_user_id(current_user, username_fb)
        if id_usuario is None:
            emit('grupo_error', {'error': 'Usuario no identificado'}, namespace=NS)
            return
        if not usuario_es_miembro(id_usuario, id_cliente, tipo_grupo):
            emit('grupo_error', {'error': 'No autorizado'}, namespace=NS)
            return

        conn = cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO CHAT_MENSAJES_GRUPO_VISITA
                    (id_cliente, tipo_grupo, id_visita, id_usuario, username, mensaje, tipo_mensaje, fecha_envio)
                OUTPUT INSERTED.id_mensaje, INSERTED.fecha_envio
                VALUES (?, ?, ?, ?, ?, ?, 'usuario', GETDATE())
            """, (id_cliente, tipo_grupo, id_visita, id_usuario, username, mensaje))
            result = cursor.fetchone()
            conn.commit()

            id_mensaje, fecha_envio = result[0], result[1]
            payload = {
                'id_mensaje': int(id_mensaje),
                'id_cliente': id_cliente,
                'tipo_grupo': tipo_grupo,
                'id_visita': id_visita,
                'id_usuario': id_usuario,
                'username': username,
                'mensaje': mensaje,
                'tipo_mensaje': 'usuario',
                'fecha_envio': fecha_envio.isoformat() if fecha_envio else None,
            }
            emit('new_message_grupo_visita', payload, room=_sala(id_cliente, tipo_grupo, id_visita), namespace=NS)
            logger.info(f"💬 grupo_visita cliente={id_cliente} tipo={tipo_grupo} visita={id_visita} ← {username}: {mensaje[:50]}")
        except Exception as e:
            logger.error(f"❌ send_message_grupo_visita: {e}", exc_info=True)
            if conn:
                conn.rollback()
            emit('grupo_error', {'error': f'Error al enviar: {e}'}, namespace=NS)
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    @socketio.on('typing_grupo_visita', namespace=NS)
    def handle_typing_grupo_visita(data):
        id_cliente = data.get('id_cliente')
        tipo_grupo = data.get('tipo_grupo')
        id_visita = data.get('id_visita')
        username = data.get('username')
        is_typing = data.get('is_typing', False)
        if not id_cliente or not tipo_grupo or not id_visita:
            return
        emit('user_typing_grupo_visita', {'username': username, 'is_typing': is_typing},
             room=_sala(id_cliente, tipo_grupo, id_visita), include_self=False, namespace=NS)

    logger.info(f"✅ Handlers del sub-hilo de chat por visita registrados en {NS}")
