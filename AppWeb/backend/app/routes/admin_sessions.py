# app/routes/admin_sessions.py
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.utils.session_manager import session_manager
from app.utils.database import execute_query

admin_sessions_bp = Blueprint('admin_sessions', __name__)


def require_admin(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        if not current_user.is_authenticated or current_user.rol != 'admin':
            return jsonify({'error': 'No autorizado'}), 403
        return f(*args, **kwargs)
    return decorated


@admin_sessions_bp.route('/api/admin/sessions/active', methods=['GET'])
@login_required
@require_admin
def get_active_sessions():
    sessions = session_manager.get_active_sessions()
    return jsonify({'success': True, 'sessions': sessions, 'total': len(sessions)})


@admin_sessions_bp.route('/api/admin/sessions/invalidate', methods=['POST'])
@login_required
@require_admin
def invalidate_session():
    data       = request.get_json()
    session_id = data.get('session_id')
    if not session_id:
        return jsonify({'error': 'session_id requerido'}), 400

    session_manager.invalidate_session(session_id, motivo='admin')
    return jsonify({'success': True, 'message': 'Sesión terminada correctamente'})


@admin_sessions_bp.route('/api/admin/sessions/invalidate-user/<int:user_id>', methods=['POST'])
@login_required
@require_admin
def invalidate_user_sessions(user_id):
    session_manager.invalidate_all_user_sessions(user_id, motivo='admin')
    return jsonify({'success': True, 'message': f'Todas las sesiones del usuario {user_id} terminadas'})


@admin_sessions_bp.route('/api/admin/sessions/history/<int:user_id>', methods=['GET'])
@login_required
@require_admin
def user_session_history(user_id):
    history = session_manager.get_user_session_history(user_id)
    return jsonify({'success': True, 'history': history})


@admin_sessions_bp.route('/api/admin/sessions/cleanup', methods=['POST'])
@login_required
@require_admin
def cleanup_expired_sessions():
    """Limpiar sesiones que llevan más de 9h sin actividad."""
    execute_query("""
        UPDATE SESIONES_ACTIVAS
        SET activa = 0, fecha_cierre = GETDATE(), motivo_cierre = 'expiracion'
        WHERE activa = 1
        AND ultimo_acceso < DATEADD(HOUR, -9, GETDATE())
    """, commit=True)
    return jsonify({'success': True, 'message': 'Limpieza completada'})


@admin_sessions_bp.route('/api/admin/sessions/invalidate-username', methods=['POST'])
@login_required
@require_admin
def invalidate_by_username():
    """Tumbar sesión por username — más fácil que buscar el id_usuario."""
    data     = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({'error': 'username requerido'}), 400

    # Buscar session_ids activas de ese username directamente en DB
    from app.utils.database import execute_query
    rows = execute_query("""
        SELECT session_id FROM SESIONES_ACTIVAS
        WHERE username = ? AND activa = 1
    """, (username,))

    if not rows:
        return jsonify({'success': False, 'message': 'No hay sesiones activas para ese usuario'})

    count = 0
    for row in rows:
        session_manager.invalidate_session(row[0], motivo='admin')
        count += 1

    return jsonify({
        'success': True,
        'message': f'{count} sesión(es) terminada(s) para {username}'
    })