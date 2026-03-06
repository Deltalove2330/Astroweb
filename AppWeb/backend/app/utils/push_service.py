# app/utils/push_service.py
"""
Servicio de Web Push Notifications con VAPID
=============================================
Envía notificaciones push al teléfono del mercaderista
incluso cuando la app está minimizada o la pantalla bloqueada.

Requiere: pip install pywebpush
"""
import json
import logging
from pywebpush import webpush, WebPushException
from app.utils.database import execute_query, get_db_connection

logger = logging.getLogger(__name__)


# ── Obtener config VAPID desde Flask ─────────────────────────────────────────
def _get_vapid_config():
    try:
        from flask import current_app
        return {
            'private_key': current_app.config.get('VAPID_PRIVATE_KEY', ''),
            'public_key':  current_app.config.get('VAPID_PUBLIC_KEY',  ''),
            'claims':      current_app.config.get('VAPID_CLAIMS', {'sub': 'mailto:admin@hjassta.com'})
        }
    except Exception:
        return None


# ── Guardar suscripción de un dispositivo ────────────────────────────────────
def guardar_suscripcion(cedula, subscription_json):
    """
    Guarda o actualiza la suscripción push de un dispositivo.
    subscription_json: dict con {endpoint, keys: {p256dh, auth}}
    """
    try:
        endpoint   = subscription_json.get('endpoint', '')
        p256dh     = subscription_json.get('keys', {}).get('p256dh', '')
        auth       = subscription_json.get('keys', {}).get('auth', '')
        sub_str    = json.dumps(subscription_json)

        if not endpoint or not p256dh or not auth:
            logger.warning("Suscripción push incompleta para cédula %s", cedula)
            return False

        conn   = get_db_connection()
        cursor = conn.cursor()
        try:
            # Upsert: actualizar si ya existe el endpoint, insertar si no
            cursor.execute("""
                IF EXISTS (
                    SELECT 1 FROM PUSH_SUBSCRIPTIONS
                    WHERE cedula = ? AND endpoint = ?
                )
                    UPDATE PUSH_SUBSCRIPTIONS
                    SET subscription_json = ?, fecha_actualizacion = GETDATE()
                    WHERE cedula = ? AND endpoint = ?
                ELSE
                    INSERT INTO PUSH_SUBSCRIPTIONS
                        (cedula, endpoint, subscription_json, fecha_creacion, fecha_actualizacion)
                    VALUES (?, ?, ?, GETDATE(), GETDATE())
            """, (cedula, endpoint, sub_str, cedula, endpoint,
                  cedula, endpoint, sub_str))
            conn.commit()
            logger.info("✅ Suscripción push guardada para cédula %s", cedula)
            return True
        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        logger.error("❌ Error guardando suscripción push: %s", e)
        return False


# ── Eliminar suscripción (cuando el endpoint ya no es válido) ─────────────────
def eliminar_suscripcion(endpoint):
    try:
        execute_query(
            "DELETE FROM PUSH_SUBSCRIPTIONS WHERE endpoint = ?",
            (endpoint,), commit=True
        )
    except Exception:
        pass


# ── Enviar push a todos los dispositivos de un mercaderista ──────────────────
def enviar_push_mercaderista(cedula, titulo, cuerpo, tipo='general'):
    """
    Envía una notificación push a todos los dispositivos suscritos
    del mercaderista identificado por su cédula.

    Llamar desde socket_chat.py y socket_chat_cliente.py cuando
    llega un mensaje nuevo.
    """
    cfg = _get_vapid_config()
    if not cfg or not cfg['private_key']:
        logger.warning("VAPID no configurado, push omitido")
        return

    # Obtener todas las suscripciones activas para esta cédula
    try:
        rows = execute_query(
            "SELECT endpoint, subscription_json FROM PUSH_SUBSCRIPTIONS WHERE cedula = ?",
            (cedula,)
        )
    except Exception as e:
        logger.error("Error obteniendo suscripciones: %s", e)
        return

    if not rows:
        return

    payload = json.dumps({
        'titulo': titulo,
        'cuerpo': cuerpo,
        'tipo':   tipo
    }, ensure_ascii=False)

    for row in rows:
        endpoint     = row[0]
        sub_json_str = row[1]
        try:
            sub_info = json.loads(sub_json_str)
            webpush(
                subscription_info=sub_info,
                data=payload,
                vapid_private_key=cfg['private_key'],
                vapid_claims=cfg['claims'],
                ttl=60  # segundos que el servidor retiene el mensaje si el dispositivo está offline
            )
            logger.info("✅ Push enviado a %s... (cédula %s)", endpoint[:40], cedula)

        except WebPushException as ex:
            status = ex.response.status_code if ex.response else None
            if status in (404, 410):
                # El endpoint ya no existe → limpiar
                logger.info("🗑️ Eliminando suscripción expirada: %s...", endpoint[:40])
                eliminar_suscripcion(endpoint)
            else:
                logger.warning("⚠️ Push fallido para %s: %s", endpoint[:40], ex)
        except Exception as ex:
            logger.warning("⚠️ Push error: %s", ex)


# ── Obtener cédula del mercaderista dueño de una visita ──────────────────────
def get_cedula_de_visita(visit_id):
    """Devuelve la cédula del mercaderista asociado a una visita."""
    try:
        result = execute_query("""
            SELECT m.cedula
            FROM VISITAS_MERCADERISTA vm
            JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
            WHERE vm.id_visita = ?
        """, (visit_id,), fetch_one=True)
        if result:
            return str(result[0] if isinstance(result, (tuple, list)) else result)
    except Exception:
        pass
    return None