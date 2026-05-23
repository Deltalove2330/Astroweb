# UBICACIÓN: backend/app/routes/push_routes.py
import os
import logging
from flask import Blueprint, request, jsonify, current_app, send_from_directory, make_response

logger  = logging.getLogger(__name__)
push_bp = Blueprint('push', __name__)


@push_bp.route('/sw-mercaderista.js')
def serve_sw():
    """
    Sirve el SW con scope raíz y sin caché.
    El header Service-Worker-Allowed: / es obligatorio porque el archivo
    está en /js/ pero necesita controlar rutas de nivel raíz como /dashboard-*.
    """
    js_folder = os.path.join(current_app.static_folder, 'js')
    resp = make_response(send_from_directory(js_folder, 'sw-mercaderista.js'))
    resp.headers['Cache-Control']          = 'no-cache, no-store, must-revalidate'
    resp.headers['Content-Type']           = 'application/javascript'
    resp.headers['Service-Worker-Allowed'] = '/'
    return resp


# ── SIN @login_required ──────────────────────────────────────────────────────
# session_protection='strong' invalida la sesión cuando cambia el user-agent
# del navegador (esto pasa todo el tiempo en PWA/iOS). Si estos endpoints
# requieren login, la suscripción nunca se guarda y el push nunca llega.

@push_bp.route('/api/push-vapid-public-key')
def push_vapid_public_key():
    public_key = current_app.config.get('VAPID_PUBLIC_KEY', '').strip()
    if not public_key:
        logger.error('VAPID_PUBLIC_KEY vacía en config')
        return jsonify({'error': 'VAPID no configurado'}), 500
    return jsonify({'public_key': public_key})


@push_bp.route('/api/push-subscribe', methods=['POST'])
def push_subscribe():
    try:
        data         = request.get_json(force=True, silent=True) or {}
        cedula       = str(data.get('cedula', '')).strip()
        subscription = data.get('subscription')

        if not cedula or not subscription:
            return jsonify({'success': False, 'error': 'Datos incompletos'}), 400

        from app.utils.push_service import guardar_suscripcion
        ok = guardar_suscripcion(cedula, subscription)
        return jsonify({'success': ok})

    except Exception as e:
        logger.error('Error en push_subscribe: %s', e, exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500