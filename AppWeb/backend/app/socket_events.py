# app/socket_events.py
from flask_socketio import emit
from flask import request
import logging

logger = logging.getLogger(__name__)

def init_socketio(socketio):
    """Inicializar eventos de WebSocket"""
    
    print("🔧 Registrando eventos de WebSocket...")
    
    @socketio.on('connect', namespace='/')
    def handle_connect():
        """Cliente conectado"""
        try:
            sid = request.sid
            print(f"✅ Cliente conectado - SID: {sid}")
            logger.info(f"Cliente conectado - SID: {sid}")
            
            emit('connected', {
                'status': 'success',
                'sid': sid,
                'message': 'Conectado al servidor de notificaciones'
            })
            
        except Exception as e:
            print(f"❌ Error en connect: {str(e)}")
            logger.error(f"Error en connect: {str(e)}")
    
    @socketio.on('disconnect', namespace='/')
    def handle_disconnect():
        """Cliente desconectado"""
        try:
            sid = request.sid
            print(f"❌ Cliente desconectado - SID: {sid}")
            logger.info(f"Cliente desconectado - SID: {sid}")
        except Exception as e:
            print(f"❌ Error en disconnect: {str(e)}")
            logger.error(f"Error en disconnect: {str(e)}")
    
    @socketio.on('request_notifications', namespace='/')
    def handle_request_notifications(data):
        """Cliente solicita notificaciones"""
        try:
            print(f"📡 Solicitud de notificaciones recibida: {data}")
            
            from app.routes.auth import get_notifications_for_user
            
            leido = data.get('leido', 0)
            limit = data.get('limit', 5)
            
            notificaciones = get_notifications_for_user(0, leido, limit)
            
            print(f"📬 Enviando {len(notificaciones['notificaciones'])} notificaciones")
            
            emit('notifications_update', {
                'success': True,
                'notificaciones': notificaciones['notificaciones'],
                'no_leidas': notificaciones['no_leidas']
            })
            
            logger.info(f"Enviadas {len(notificaciones['notificaciones'])} notificaciones")
            
        except Exception as e:
            print(f"❌ Error obteniendo notificaciones: {str(e)}")
            logger.error(f"Error obteniendo notificaciones: {str(e)}")
            emit('error', {'message': str(e)})
    
    @socketio.on('mark_as_read', namespace='/')
    def handle_mark_as_read(data):
        """Marcar notificación como leída"""
        try:
            print(f"✅ Marcando como leída: {data}")
            
            from app.routes.auth import mark_notification_as_read_internal
            
            notification_id = data.get('notification_id')
            
            if notification_id:
                success = mark_notification_as_read_internal(notification_id)
                
                if success:
                    emit('notification_marked', {
                        'success': True,
                        'notification_id': notification_id
                    })
                    print(f"✅ Notificación {notification_id} marcada")
                    logger.info(f"Notificación {notification_id} marcada")
                else:
                    emit('error', {'message': 'No se pudo marcar'})
            else:
                emit('error', {'message': 'ID requerido'})
                
        except Exception as e:
            print(f"❌ Error marcando: {str(e)}")
            logger.error(f"Error marcando: {str(e)}")
            emit('error', {'message': str(e)})
    
    print("✅ Eventos de WebSocket registrados:")
    print("   - connect")
    print("   - disconnect")
    print("   - request_notifications")
    print("   - mark_as_read")
    print("🔌 Sistema de notificaciones listo")
