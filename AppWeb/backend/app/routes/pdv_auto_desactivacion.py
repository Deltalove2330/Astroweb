# app/routes/pdv_auto_desactivacion.py
"""
Auto-desactivación de PDVs al final del día + auditoría.

Resuelve el bug en producción donde el mercaderista activa un PDV
(foto type=5) pero olvida enviar la foto de desactivación (type=6).
Al día siguiente esos PDVs siguen "activos" y bloquean al mercaderista
(Web View Android termina dando "memoria insuficiente" al cargar el
estado inválido).

LÓGICA:
  - Job programado a las 19:00 todos los días.
  - Busca PDVs con foto de activación HOY y sin foto de desactivación.
  - Inserta una foto type=6 'Auto-cierre 7PM' para que el sistema vea
    el PDV como desactivado.
  - Registra todo en PDV_AUTO_DESACTIVACIONES (auditoría).

ENDPOINTS:
  GET  /api/admin/pdv-auto-desactivaciones
        ?fecha_desde&fecha_hasta&id_mercaderista&id_ruta
  POST /api/admin/pdv-auto-desactivaciones/ejecutar
        — dispara el job manualmente (admin only)
"""
from datetime import datetime, date as _date, timedelta
from typing import Optional

from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user

from app.utils.database import execute_query, get_db_connection

pdv_auto_bp = Blueprint('pdv_auto_desactivacion', __name__,
                        url_prefix='/api/admin/pdv-auto-desactivaciones')


# ═════════════════════════════════════════════════════════════════
# CORE: la función que el scheduler invoca a las 19:00
# ═════════════════════════════════════════════════════════════════
def ejecutar_auto_desactivacion(fecha_objetivo: _date | None = None,
                                logger=None) -> dict:
    """
    Cierra los PDVs activados sin foto de desactivación de un día dado.
    Si no se pasa fecha_objetivo, usa la fecha de HOY.

    Devuelve dict con stats y la lista de auto-desactivaciones creadas.
    """
    log = logger or current_app.logger
    fecha = fecha_objetivo or _date.today()
    dia_semana = _dia_semana_es(fecha)

    log.info(f"🌙 [auto-desact] Iniciando para {fecha} ({dia_semana})")

    # ── 1) Encontrar PDVs activados sin desactivar ──
    # Criterio: existe foto type=5 Aprobada con fecha = fecha_objetivo
    # Y NO existe una foto type=6 Aprobada con fecha > la activación más reciente
    pendientes_sql = """
        SELECT
            vm.id_visita,
            vm.identificador_punto_interes,
            ISNULL(pin.punto_de_interes, ''),
            vm.id_mercaderista,
            ISNULL(m.nombre, ''),
            ISNULL(m.cedula, ''),
            vm.id_cliente,
            ISNULL(c.cliente, ''),
            act.id_foto       AS id_foto_activacion,
            act.fecha_registro AS fecha_activacion_original,
            ruta_pre.id_ruta,
            ruta_pre.ruta_nombre
        FROM VISITAS_MERCADERISTA vm
        JOIN PUNTOS_INTERES1 pin ON pin.identificador = vm.identificador_punto_interes
        LEFT JOIN MERCADERISTAS  m ON m.id_mercaderista = vm.id_mercaderista
        LEFT JOIN CLIENTES       c ON c.id_cliente      = vm.id_cliente
        -- Última activación (foto type=5 Aprobada) en la fecha objetivo
        CROSS APPLY (
            SELECT TOP 1 ft.id_foto, ft.fecha_registro
            FROM FOTOS_TOTALES ft
            WHERE ft.id_visita    = vm.id_visita
              AND ft.id_tipo_foto = 5
              AND ft.Estado       = 'Aprobada'
              AND CAST(ft.fecha_registro AS DATE) = CAST(? AS DATE)
            ORDER BY ft.fecha_registro DESC
        ) act
        -- Ruta asociada al punto (top 1)
        OUTER APPLY (
            SELECT TOP 1 rp.id_ruta, rn.ruta AS ruta_nombre, rp.dia
            FROM RUTA_PROGRAMACION rp
            JOIN RUTAS_NUEVAS rn ON rn.id_ruta = rp.id_ruta
            WHERE rp.id_punto_interes = vm.identificador_punto_interes
              AND rp.activa = 1
        ) ruta_pre
        WHERE NOT EXISTS (
            -- No hay foto de desactivación posterior a la activación
            SELECT 1 FROM FOTOS_TOTALES ft2
            WHERE ft2.id_visita    = vm.id_visita
              AND ft2.id_tipo_foto = 6
              AND ft2.Estado       = 'Aprobada'
              AND ft2.fecha_registro > act.fecha_registro
        )
    """
    rows = execute_query(pendientes_sql, (fecha,)) or []

    if not rows:
        log.info(f"✅ [auto-desact] {fecha}: no hay PDVs activos sin desactivar")
        return {"fecha": str(fecha), "encontrados": 0, "cerrados": 0, "errores": []}

    log.info(f"🔍 [auto-desact] {fecha}: {len(rows)} PDV(s) a auto-cerrar")

    cerrados = 0
    errores  = []

    # Para cada PDV: insertar foto type=6 + registro en auditoría
    conn = None
    try:
        conn = get_db_connection()
        cur  = conn.cursor()

        for r in rows:
            (id_visita, id_punto, punto_nombre, id_merc, merc_nombre, cedula,
             id_cliente, cliente_nombre, id_foto_act, fecha_act_orig,
             id_ruta, ruta_nombre) = r

            try:
                # 1) Insertar foto type=6 (desactivación automática)
                cur.execute("""
                    INSERT INTO FOTOS_TOTALES
                        (id_visita, categoria, file_path, fecha_registro,
                         id_tipo_foto, Estado, fecha_disparo)
                    OUTPUT INSERTED.id_foto
                    VALUES (?, 'Auto-cierre 7PM', 'AUTO_DESACTIVACION_SISTEMA',
                            GETDATE(), 6, 'Aprobada', GETDATE())
                """, (id_visita,))
                id_foto_desact = cur.fetchone()[0]

                # 2) Registrar en la auditoría
                cur.execute("""
                    INSERT INTO PDV_AUTO_DESACTIVACIONES (
                        id_punto_interes, punto_de_interes,
                        id_mercaderista, mercaderista_nombre, cedula_mercaderista,
                        id_ruta, ruta_nombre, id_cliente, cliente_nombre,
                        fecha_activacion_original, dia_programado,
                        id_visita, id_foto_activacion, id_foto_desactivacion_auto
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    id_punto, punto_nombre,
                    id_merc, merc_nombre, str(cedula) if cedula else None,
                    id_ruta, ruta_nombre, id_cliente, cliente_nombre,
                    fecha_act_orig, dia_semana,
                    id_visita, id_foto_act, id_foto_desact,
                ))

                cerrados += 1
                log.info(f"  🔒 cerrado PDV {id_punto} ({punto_nombre}) "
                         f"- mercaderista {merc_nombre} - ruta {ruta_nombre}")

                # ── Push notification al mercaderista ──
                try:
                    from app.utils.push_service import enviar_push_mercaderista
                    if cedula:
                        enviar_push_mercaderista(
                            cedula=str(cedula),
                            titulo='⚠️ PDV Auto-cerrado',
                            cuerpo=(f'El sistema cerró automáticamente "{punto_nombre}" porque '
                                    f'no enviaste la foto de desactivación. Por favor recuerda '
                                    f'cerrar los PDVs antes de las 7 PM.'),
                            tipo='pdv_auto_cerrado',
                        )
                except Exception as _e_push:
                    log.warning(f"Push auto-cierre PDV {id_punto} falló: {_e_push}")

            except Exception as e_inner:
                errores.append({
                    "id_punto": id_punto, "id_mercaderista": id_merc,
                    "error": str(e_inner)
                })
                log.error(f"  ❌ error cerrando PDV {id_punto}: {e_inner}")

        conn.commit()

    except Exception as e:
        if conn:
            try: conn.rollback()
            except: pass
        log.error(f"❌ [auto-desact] error global: {e}", exc_info=True)
        errores.append({"error_global": str(e)})
    finally:
        if conn:
            try: conn.close()
            except: pass

    log.info(f"✅ [auto-desact] {fecha}: {cerrados}/{len(rows)} cerrados, "
             f"{len(errores)} errores")
    return {
        "fecha":       str(fecha),
        "encontrados": len(rows),
        "cerrados":    cerrados,
        "errores":     errores,
    }


def _dia_semana_es(fecha: _date) -> str:
    mapping = {0: 'Lunes', 1: 'Martes', 2: 'Miércoles', 3: 'Jueves',
               4: 'Viernes', 5: 'Sábado', 6: 'Domingo'}
    return mapping.get(fecha.weekday(), '')


# ═════════════════════════════════════════════════════════════════
# ENDPOINTS ADMIN
# ═════════════════════════════════════════════════════════════════
def _es_admin() -> bool:
    return (current_user.is_authenticated and
            (getattr(current_user, 'rol', None) in ('admin', 'analyst')
             or getattr(current_user, 'is_admin', lambda: False)()))


@pdv_auto_bp.route('/', methods=['GET'])
@login_required
def listar():
    """Lista la auditoría con filtros opcionales."""
    if not _es_admin():
        return jsonify({"success": False, "error": "Solo admin/analyst"}), 403

    try:
        fdesde   = request.args.get('fecha_desde')        # YYYY-MM-DD
        fhasta   = request.args.get('fecha_hasta')
        id_merc  = request.args.get('id_mercaderista', type=int)
        id_ruta  = request.args.get('id_ruta', type=int)
        limit    = min(int(request.args.get('limit', 200)), 1000)

        parts  = []
        params = []
        if fdesde:
            parts.append("CAST(fecha_auto_desactivacion AS DATE) >= ?"); params.append(fdesde)
        if fhasta:
            parts.append("CAST(fecha_auto_desactivacion AS DATE) <= ?"); params.append(fhasta)
        if id_merc:
            parts.append("id_mercaderista = ?"); params.append(id_merc)
        if id_ruta:
            parts.append("id_ruta = ?"); params.append(id_ruta)
        where = ("WHERE " + " AND ".join(parts)) if parts else ""

        rows = execute_query(f"""
            SELECT TOP {limit}
                id_auto_desact, id_punto_interes, punto_de_interes,
                id_mercaderista, mercaderista_nombre, cedula_mercaderista,
                id_ruta, ruta_nombre, id_cliente, cliente_nombre,
                fecha_activacion_original, fecha_auto_desactivacion,
                dia_programado, motivo, id_visita
            FROM PDV_AUTO_DESACTIVACIONES
            {where}
            ORDER BY fecha_auto_desactivacion DESC
        """, tuple(params)) or []

        total = execute_query(
            f"SELECT COUNT(*) FROM PDV_AUTO_DESACTIVACIONES {where}",
            tuple(params), fetch_one=True
        ) or 0
        total = total if isinstance(total, int) else (total[0] if total else 0)

        return jsonify({
            "success": True,
            "total":   int(total),
            "rows":    [{
                "id_auto_desact":     r[0],
                "id_punto_interes":   r[1],
                "punto_de_interes":   r[2],
                "id_mercaderista":    r[3],
                "mercaderista":       r[4],
                "cedula":             r[5],
                "id_ruta":            r[6],
                "ruta":               r[7],
                "id_cliente":         r[8],
                "cliente":            r[9],
                "fecha_activacion":   r[10].isoformat() if r[10] else None,
                "fecha_auto_desact":  r[11].isoformat() if r[11] else None,
                "dia_programado":     r[12],
                "motivo":             r[13],
                "id_visita":          r[14],
            } for r in rows]
        })
    except Exception as e:
        current_app.logger.error(f"Error listar PDV_AUTO_DESACTIVACIONES: {e}",
                                  exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500


@pdv_auto_bp.route('/ejecutar', methods=['POST'])
@login_required
def ejecutar_manual():
    """
    Dispara la auto-desactivación manualmente.
    Útil para correr el cierre del día anterior si el job nocturno falló.
    Body opcional: {"fecha": "YYYY-MM-DD"}  (default: hoy)
    """
    if not _es_admin():
        return jsonify({"success": False, "error": "Solo admin/analyst"}), 403

    try:
        data = request.get_json(silent=True) or {}
        fecha_str = data.get('fecha')
        fecha_obj = (datetime.strptime(fecha_str, '%Y-%m-%d').date()
                     if fecha_str else _date.today())
        resumen = ejecutar_auto_desactivacion(fecha_obj)
        return jsonify({"success": True, **resumen})
    except ValueError:
        return jsonify({"success": False, "error": "fecha inválida YYYY-MM-DD"}), 400
    except Exception as e:
        current_app.logger.error(f"Error ejecutar_manual: {e}", exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500


@pdv_auto_bp.route('/stats-resumen', methods=['GET'])
@login_required
def stats_resumen():
    """Stats agregadas para mostrar en un mini dashboard."""
    if not _es_admin():
        return jsonify({"success": False, "error": "Solo admin/analyst"}), 403
    try:
        rows = execute_query("""
            SELECT TOP 30
                CAST(fecha_auto_desactivacion AS DATE) AS fecha,
                COUNT(*) AS cnt,
                COUNT(DISTINCT id_mercaderista) AS mercaderistas,
                COUNT(DISTINCT id_punto_interes) AS pdvs_distintos
            FROM PDV_AUTO_DESACTIVACIONES
            GROUP BY CAST(fecha_auto_desactivacion AS DATE)
            ORDER BY fecha DESC
        """) or []

        ranking_merc = execute_query("""
            SELECT TOP 10
                id_mercaderista, mercaderista_nombre, COUNT(*) AS cnt
            FROM PDV_AUTO_DESACTIVACIONES
            WHERE fecha_auto_desactivacion >= DATEADD(day, -30, GETDATE())
            GROUP BY id_mercaderista, mercaderista_nombre
            ORDER BY cnt DESC
        """) or []

        return jsonify({
            "success": True,
            "por_dia": [{
                "fecha": r[0].isoformat() if r[0] else None,
                "auto_desactivados": r[1], "mercaderistas": r[2], "pdvs_distintos": r[3],
            } for r in rows],
            "top_mercaderistas_olvidadizos": [{
                "id_mercaderista": r[0], "nombre": r[1], "olvidos_ultimo_mes": r[2],
            } for r in ranking_merc],
        })
    except Exception as e:
        current_app.logger.error(f"Error stats_resumen: {e}", exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500
