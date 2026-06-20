# UBICACIÓN: backend/app/utils/push_service.py
"""
push_service.py — v8 DEFINITIVO
Compatible con pywebpush 2.3.0 (API completamente distinta a 1.x).

La API de pywebpush 2.x usa la función `webpush()` directamente, no WebPusher.
La versión 1.x usaba:  WebPusher(sub).send(data, headers, vapid=...) — YA NO EXISTE.
"""
import json
import logging

logger = logging.getLogger(__name__)


# ══════════════════════════════════════════════════════════════════════════════
# GUARDAR SUSCRIPCIÓN
# ══════════════════════════════════════════════════════════════════════════════
def guardar_suscripcion(cedula: str, subscription: dict) -> bool:
    """
    Guarda o actualiza una suscripción Web Push para un mercaderista.
    Hace UPSERT: si el endpoint ya existe lo actualiza, si no lo inserta.
    """
    from app.utils.database import execute_query

    try:
        endpoint  = subscription.get('endpoint', '').strip()
        sub_json  = json.dumps(subscription, ensure_ascii=False)

        if not endpoint:
            logger.error('guardar_suscripcion: endpoint vacío')
            return False

        # Verificar si ya existe este endpoint
        existing = execute_query(
            'SELECT id FROM PUSH_SUBSCRIPTIONS WHERE endpoint = ?',
            (endpoint,), fetch_one=True
        )

        if existing:
            execute_query(
                """UPDATE PUSH_SUBSCRIPTIONS
                   SET cedula = ?, subscription_json = ?, fecha_actualizacion = GETDATE()
                   WHERE endpoint = ?""",
                (cedula, sub_json, endpoint), commit=True
            )
            logger.info('✅ Suscripción actualizada — cédula %s', cedula)
        else:
            execute_query(
                """INSERT INTO PUSH_SUBSCRIPTIONS (cedula, endpoint, subscription_json)
                   VALUES (?, ?, ?)""",
                (cedula, endpoint, sub_json), commit=True
            )
            logger.info('✅ Suscripción insertada — cédula %s', cedula)

        return True

    except Exception as e:
        logger.error('Error en guardar_suscripcion: %s', e, exc_info=True)
        return False


# ══════════════════════════════════════════════════════════════════════════════
# OBTENER CÉDULA DE UNA VISITA
# ══════════════════════════════════════════════════════════════════════════════
def get_cedula_de_visita(visit_id) -> str | None:
    """Devuelve la cédula del mercaderista asignado a una visita."""
    from app.utils.database import execute_query

    try:
        row = execute_query(
            """SELECT m.cedula
               FROM VISITAS_MERCADERISTA vm
               JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
               WHERE vm.id_visita = ?""",
            (visit_id,), fetch_one=True
        )
        return str(row[0]).strip() if row and row[0] else None
    except Exception as e:
        logger.error('Error en get_cedula_de_visita(%s): %s', visit_id, e)
        return None


# ══════════════════════════════════════════════════════════════════════════════
# ENVIAR PUSH — pywebpush 2.3.0
# ══════════════════════════════════════════════════════════════════════════════
def enviar_push_mercaderista(cedula: str, titulo: str, cuerpo: str, tipo: str = 'general'):
    """
    Envía Web Push a todos los dispositivos suscritos de un mercaderista.

    Compatibilidad pywebpush 2.3.0:
      - Usa la función `webpush()` (no la clase WebPusher)
      - vapid_private_key acepta PEM string directamente
      - NO pasar content_encoding — pywebpush lo elige por dispositivo
    """
    from flask import current_app
    from app.utils.database import execute_query

    try:
        from pywebpush import webpush, WebPushException
    except ImportError:
        logger.error('pywebpush no instalado. Ejecutar: pip install pywebpush --break-system-packages')
        return

    # ── Obtener suscripciones del mercaderista ────────────────────────────────
    subs = execute_query(
        'SELECT id, subscription_json FROM PUSH_SUBSCRIPTIONS WHERE cedula = ?',
        (cedula,)
    )

    if not subs:
        logger.debug('Sin suscripciones push para cédula %s', cedula)
        return

    # ── Configuración VAPID ───────────────────────────────────────────────────
    vapid_private_key = current_app.config.get('VAPID_PRIVATE_KEY', '').strip()
    vapid_claims      = current_app.config.get('VAPID_CLAIMS', {'sub': 'mailto:admin@hjassta.com'})

    if not vapid_private_key:
        logger.error('VAPID_PRIVATE_KEY no configurada en .env')
        return

    payload = json.dumps({
        'titulo': titulo,
        'cuerpo': cuerpo,
        'tipo':   tipo
    }, ensure_ascii=False)

    endpoints_a_borrar = []

    # ── Enviar a cada dispositivo ─────────────────────────────────────────────
    for row in subs:
        row_id   = row[0]
        sub_json = row[1]

        try:
            subscription = json.loads(sub_json)

            webpush(
                subscription_info  = subscription,
                data               = payload,
                vapid_private_key  = vapid_private_key,
                vapid_claims       = vapid_claims,
                ttl                = 86400,           # 24 horas
                # SIN content_encoding — pywebpush 2.x lo elige automáticamente
            )
            logger.info('📲 Push enviado — cédula %s | tipo %s', cedula, tipo)

        except WebPushException as wpe:
            status = wpe.response.status_code if wpe.response is not None else 0
            body   = wpe.response.text[:300]  if wpe.response is not None else ''
            logger.warning(
                'WebPushException cédula %s | status=%s | body=%s',
                cedula, status, body
            )

            # 404/410 = suscripción expirada o inválida → eliminar
            if status in (404, 410):
                endpoints_a_borrar.append(row_id)

        except Exception as e:
            logger.error('Error inesperado enviando push a %s: %s', cedula, e, exc_info=True)

    # ── Limpiar suscripciones expiradas ───────────────────────────────────────
    for row_id in endpoints_a_borrar:
        try:
            execute_query(
                'DELETE FROM PUSH_SUBSCRIPTIONS WHERE id = ?',
                (row_id,), commit=True
            )
            logger.info('🗑️ Suscripción expirada eliminada — id %s', row_id)
        except Exception as e:
            logger.warning('No se pudo borrar suscripción %s: %s', row_id, e)