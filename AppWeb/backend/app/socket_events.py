# app/socket_events.py
from flask import session
from flask_socketio import emit, disconnect
from app.models import User
from app.utils.database import execute_query
from app.routes.auth import get_notifications_for_user
import logging

logger = logging.getLogger(__name__)

def init_socketio(socketio):
    """Registra todos los eventos de WebSocket"""
    
    @socketio.on('connect')
    def handle_connect():
        """Maneja la conexión de un cliente"""
        user_id = session.get('user_id')
        if user_id:
            logger.info(f'✅ Cliente conectado - User ID: {user_id}')
            print(f'✅ WEBSOCKET CONECTADO - User ID: {user_id}')
        else:
            logger.warning('⚠️ Conexión WebSocket sin user_id en sesión - permitiendo pero limitando funcionalidad')
            print('⚠️ Conexión WebSocket sin user_id - el cliente usará HTTP como fallback')
            # ✅ NO DESCONECTAR - dejar que el cliente use HTTP como fallback

    @socketio.on('disconnect')
    def handle_disconnect():
        """Maneja la desconexión de un cliente"""
        user_id = session.get('user_id')
        logger.info(f'❌ Cliente desconectado - User ID: {user_id}')
        print(f'❌ Cliente desconectado - User ID: {user_id}')

    @socketio.on('request_notifications')
    def handle_request_notifications(data):
        """Maneja solicitudes de notificaciones desde el cliente"""
        try:
            print(f"📡 Solicitud de notificaciones recibida: {data}")
            
            user_id = session.get('user_id')
            
            if not user_id:
                print("❌ Usuario no autenticado en WebSocket")
                emit('notifications_update', {
                    'success': False,
                    'error': 'No autenticado - usa HTTP',
                    'notificaciones': [],
                    'no_leidas': 0
                })
                return
            
            # ✅ Cargar el objeto usuario completo
            user = User.query.get(user_id)
            
            if not user:
                print(f"❌ Usuario no encontrado: {user_id}")
                emit('notifications_update', {
                    'success': False,
                    'error': 'Usuario no encontrado',
                    'notificaciones': [],
                    'no_leidas': 0
                })
                return
            
            print(f"✅ Usuario cargado: {user.username} (rol: {user.rol})")
            
            leido = data.get('leido', None)
            limit = data.get('limit', 10)

            # Cache de notificaciones — 30 segundos
            import redis as _r_lib, json as _j
            try:
                _rn = _r_lib.Redis(host='localhost', port=6379, db=2,
                                decode_responses=True, socket_timeout=1)
                _nk = f"notifs:{user_id}:{leido}:{limit}"
                _nc = _rn.get(_nk)
                if _nc:
                    _nd = _j.loads(_nc)
                    emit('notifications_update', {'success': True, **_nd})
                    return
            except Exception:
                pass
            
            # ✅ Pasar objeto user completo
            result = get_notifications_for_user(user, leido=leido, limit=limit)
            
            try:
                _rn.setex(_nk, 30, _j.dumps({
                    'notificaciones': result['notificaciones'],
                    'no_leidas': result['no_leidas']
                }))
            except Exception:
                pass

            print(f"📬 Enviando {len(result['notificaciones'])} notificaciones")
            
            emit('notifications_update', {
                'success': True,
                'notificaciones': result['notificaciones'],
                'no_leidas': result['no_leidas']
            })
            
        except Exception as e:
            print(f"❌ Error en handle_request_notifications: {e}")
            import traceback
            traceback.print_exc()
            emit('notifications_update', {
                'success': False,
                'error': str(e),
                'notificaciones': [],
                'no_leidas': 0
            })

    @socketio.on('mark_as_read')
    def handle_mark_as_read(data):
        """Marca una notificación como leída"""
        try:
            user_id = session.get('user_id')
            
            if not user_id:
                emit('mark_read_response', {'success': False, 'error': 'No autenticado'})
                return
            
            notification_id = data.get('notification_id')
            
            if not notification_id:
                emit('mark_read_response', {'success': False, 'error': 'ID no proporcionado'})
                return
            
            query = """
                UPDATE NOTIFICACIONES_RECHAZO_FOTOS
                SET leido = 1
                WHERE id_notificacion = ?
            """
            
            execute_query(query, (notification_id,))
            
            user = User.query.get(user_id)
            result = get_notifications_for_user(user, leido=0, limit=5)
            
            emit('mark_read_response', {
                'success': True,
                'no_leidas': result['no_leidas']
            })
            
            print(f"✅ Notificación {notification_id} marcada como leída")
            
        except Exception as e:
            print(f"❌ Error en handle_mark_as_read: {e}")
            emit('mark_read_response', {'success': False, 'error': str(e)})

    @socketio.on('mark_all_as_read')
    def handle_mark_all_as_read():
        """Marca todas las notificaciones como leídas"""
        try:
            user_id = session.get('user_id')
            
            if not user_id:
                emit('mark_all_read_response', {'success': False, 'error': 'No autenticado'})
                return
            
            user = User.query.get(user_id)
            
            if not user:
                emit('mark_all_read_response', {'success': False, 'error': 'Usuario no encontrado'})
                return
            
            query = """
                UPDATE NOTIFICACIONES_RECHAZO_FOTOS
                SET leido = 1
                WHERE leido = 0
            """
            
            if user.rol == 'client':
                query += " AND rechazado_por = 'cliente'"
            
            execute_query(query)
            
            emit('mark_all_read_response', {
                'success': True,
                'no_leidas': 0
            })
            
            print(f"✅ Todas las notificaciones marcadas como leídas para user {user_id}")
            
        except Exception as e:
            print(f"❌ Error en handle_mark_all_as_read: {e}")
            emit('mark_all_read_response', {'success': False, 'error': str(e)})
    
    print("✅ Eventos de WebSocket registrados correctamente")