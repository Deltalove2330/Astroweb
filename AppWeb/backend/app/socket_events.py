# app/socket_events.py
from flask_socketio import emit, join_room, leave_room
from flask import request
import logging

logger = logging.getLogger(__name__)

def init_socketio(socketio):
    """Inicializar eventos de WebSocket"""
    
    @socketio.on('connect')
    def handle_connect():
        """Cliente conectado"""
        try:
            # ✅ No usar current_user en WebSocket, usar session_id
            sid = request.sid
            logger.info(f"✅ Cliente conectado - SID: {sid}")
            
            emit('connected', {
                'status': 'success',
                'sid': sid
            })
        except Exception as e:
            logger.error(f"❌ Error en connect: {str(e)}")
    
    @socketio.on('disconnect')
    def handle_disconnect():
        """Cliente desconectado"""
        try:
            sid = request.sid
            logger.info(f"❌ Cliente desconectado - SID: {sid}")
        except Exception as e:
            logger.error(f"❌ Error en disconnect: {str(e)}")
    
    @socketio.on('request_notifications')
    def handle_request_notifications(data):
        """Cliente solicita notificaciones"""
        try:
            from app.routes.auth import get_notifications_for_user
            
            # ✅ Obtener TODAS las notificaciones sin filtrar por usuario
            # porque get_notifications_for_user no usa user_id actualmente
            leido = data.get('leido', 0)
            limit = data.get('limit', 5)
            
            # Llamar con user_id dummy (la función no lo usa)
            notificaciones = get_notifications_for_user(0, leido, limit)
            
            emit('notifications_update', {
                'success': True,
                'notificaciones': notificaciones['notificaciones'],
                'no_leidas': notificaciones['no_leidas']
            })
            
            logger.info(f"📬 Enviadas {len(notificaciones['notificaciones'])} notificaciones")
            
        except Exception as e:
            logger.error(f"❌ Error obteniendo notificaciones: {str(e)}")
            emit('error', {'message': str(e)})
    
    @socketio.on('mark_as_read')
    def handle_mark_as_read(data):
        """Marcar notificación como leída"""
        try:
            from app.routes.auth import mark_notification_as_read_internal
            
            notification_id = data.get('notification_id')
            
            if notification_id:
                success = mark_notification_as_read_internal(notification_id)
                
                if success:
                    emit('notification_marked', {
                        'success': True,
                        'notification_id': notification_id
                    })
                    logger.info(f"✅ Notificación {notification_id} marcada como leída")
                else:
                    emit('error', {'message': 'No se pudo marcar la notificación'})
            else:
                emit('error', {'message': 'ID de notificación requerido'})
                
        except Exception as e:
            logger.error(f"❌ Error marcando notificación: {str(e)}")
            emit('error', {'message': str(e)})
    
    logger.info("🔌 WebSocket events registrados correctamente")