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
# RECORDATORIO 18:30 — push a mercaderistas con PDVs sin cerrar HOY
# ═════════════════════════════════════════════════════════════════
def ejecutar_recordatorio_pdvs_abiertos(logger=None) -> dict:
    """
    Detecta mercaderistas con PDVs activados HOY pero sin desactivación.
    Envía push notification recordándoles cerrar antes del auto-cierre 19:00.
    Idempotente — se puede correr varias veces sin problema (solo manda push).
    """
    log = logger or current_app.logger
    hoy = _date.today()

    rows = execute_query("""
        SELECT
            vm.id_mercaderista,
            ISNULL(m.cedula,''),
            ISNULL(m.nombre,''),
            COUNT(DISTINCT vm.identificador_punto_interes) AS pdvs_abiertos
        FROM VISITAS_MERCADERISTA vm
        JOIN MERCADERISTAS m ON m.id_mercaderista = vm.id_mercaderista
        WHERE EXISTS (
            -- Foto type=5 HOY
            SELECT 1 FROM FOTOS_TOTALES ft
            WHERE ft.id_visita    = vm.id_visita
              AND ft.id_tipo_foto = 5
              AND ft.Estado       = 'Aprobada'
              AND CAST(ft.fecha_registro AS DATE) = CAST(? AS DATE)
        )
        AND NOT EXISTS (
            -- Sin foto type=6 posterior
            SELECT 1 FROM FOTOS_TOTALES ft2
            WHERE ft2.id_visita    = vm.id_visita
              AND ft2.id_tipo_foto = 6
              AND ft2.Estado       = 'Aprobada'
        )
        GROUP BY vm.id_mercaderista, m.cedula, m.nombre
    """, (hoy,)) or []

    if not rows:
        log.info(f"📋 [recordatorio 18:30] {hoy}: no hay PDVs pendientes")
        return {"fecha": str(hoy), "mercaderistas_notificados": 0}

    notificados = 0
    try:
        from app.utils.push_service import enviar_push_mercaderista
    except Exception as e:
        log.error(f"[recordatorio 18:30] no se pudo importar push_service: {e}")
        return {"fecha": str(hoy), "error": str(e)}

    for id_merc, cedula, nombre, n_pdvs in rows:
        if not cedula:
            continue
        try:
            enviar_push_mercaderista(
                cedula=str(cedula),
                titulo='⏰ Recordatorio: PDVs sin cerrar',
                cuerpo=(f'Tienes {int(n_pdvs)} PDV(s) activos sin foto de desactivación. '
                        f'Ciérralos antes de las 7 PM para evitar el auto-cierre.'),
                tipo='recordatorio_cierre',
            )
            notificados += 1
            log.info(f"  📲 recordatorio enviado a {nombre} ({cedula}) — {n_pdvs} PDV(s)")
        except Exception as e:
            log.warning(f"  ⚠️ falló push a {cedula}: {e}")

    log.info(f"✅ [recordatorio 18:30] {hoy}: {notificados}/{len(rows)} notificados")
    return {"fecha": str(hoy), "mercaderistas_notificados": notificados,
            "mercaderistas_pendientes": len(rows)}


# ═════════════════════════════════════════════════════════════════
# DETECTAR MERCADERISTAS REINCIDENTES → alertar a su supervisor
# ═════════════════════════════════════════════════════════════════
UMBRAL_AUTOCIERRES_7D = 3


def detectar_y_alertar_reincidentes(logger=None) -> dict:
    """
    Busca mercaderistas con > UMBRAL_AUTOCIERRES_7D auto-cierres en los
    últimos 7 días y crea una alerta en ALERTAS_SUPERVISOR_PDV +
    push notification a su supervisor (vía SUPERVISORES_RUTAS).

    Solo crea una alerta nueva si NO existe una en las últimas 24h por
    el mismo (supervisor, mercaderista) — evita duplicados.
    """
    log = logger or current_app.logger

    reincidentes = execute_query(f"""
        SELECT
            id_mercaderista,
            MAX(mercaderista_nombre)   AS nombre_merc,
            MAX(cedula_mercaderista)   AS cedula_merc,
            COUNT(*)                   AS cnt
        FROM PDV_AUTO_DESACTIVACIONES
        WHERE fecha_auto_desactivacion >= DATEADD(day, -7, GETDATE())
        GROUP BY id_mercaderista
        HAVING COUNT(*) > {UMBRAL_AUTOCIERRES_7D}
    """) or []

    if not reincidentes:
        log.info("✅ [alertas] sin mercaderistas reincidentes (>%s/7d)",
                 UMBRAL_AUTOCIERRES_7D)
        return {"reincidentes": 0, "alertas_creadas": 0, "push_enviados": 0}

    log.info(f"🚨 [alertas] {len(reincidentes)} mercaderista(s) reincidente(s)")

    alertas_creadas = 0
    push_enviados   = 0

    try:
        from app.utils.push_service import enviar_push_mercaderista
    except Exception:
        enviar_push_mercaderista = None

    for id_merc, nombre_merc, cedula_merc, cnt in reincidentes:
        # Supervisores asociados a las rutas de este mercaderista
        supervisores = execute_query("""
            SELECT DISTINCT s.id_supervisor, s.nombre_supervisor,
                            ISNULL(u.username,'')  AS username_supervisor
            FROM MERCADERISTAS_RUTAS mr
            JOIN SUPERVISORES_RUTAS  sr ON sr.id_ruta = mr.id_ruta
            JOIN SUPERVISORES        s  ON s.id_supervisor = sr.id_supervisor
            LEFT JOIN USUARIOS       u  ON u.id_supervisor = s.id_supervisor
            WHERE mr.id_mercaderista = ?
        """, (id_merc,)) or []

        for id_sup, nombre_sup, username_sup in supervisores:
            cedula_sup = str(username_sup).strip() if username_sup else None

            # Evitar duplicados — ¿ya hay alerta en últimas 24h?
            ya_existe = execute_query("""
                SELECT TOP 1 id_alerta FROM ALERTAS_SUPERVISOR_PDV
                WHERE id_supervisor   = ?
                  AND id_mercaderista = ?
                  AND fecha_alerta >= DATEADD(hour, -24, GETDATE())
            """, (id_sup, id_merc), fetch_one=True)
            if ya_existe:
                log.debug(f"  ↩️ alerta ya existe para sup={id_sup} merc={id_merc}")
                continue

            # Push al supervisor (si está suscrito)
            push_ok = 0
            if cedula_sup and enviar_push_mercaderista:
                try:
                    enviar_push_mercaderista(
                        cedula=cedula_sup,
                        titulo='🚨 Alerta supervisión',
                        cuerpo=(f'{nombre_merc} acumuló {int(cnt)} PDVs auto-cerrados '
                                f'en los últimos 7 días. Revisar.'),
                        tipo='alerta_supervisor_pdv',
                    )
                    push_ok = 1
                    push_enviados += 1
                except Exception as e:
                    log.warning(f"  ⚠️ push supervisor {cedula_sup} falló: {e}")

            # Persistir alerta
            execute_query("""
                INSERT INTO ALERTAS_SUPERVISOR_PDV (
                    id_supervisor, nombre_supervisor, cedula_supervisor,
                    id_mercaderista, nombre_mercaderista, cedula_mercaderista,
                    cantidad_auto_cierres, ventana_dias, motivo, push_enviado
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 7, ?, ?)
            """, (
                id_sup, nombre_sup, cedula_sup,
                id_merc, nombre_merc, cedula_merc,
                int(cnt),
                f'Mercaderista {nombre_merc} superó el umbral de {UMBRAL_AUTOCIERRES_7D} auto-cierres en 7 días',
                push_ok,
            ), commit=True)
            alertas_creadas += 1
            log.info(f"  📌 alerta creada → supervisor {nombre_sup} sobre {nombre_merc} (cnt={cnt})")

    return {
        "reincidentes":    len(reincidentes),
        "alertas_creadas": alertas_creadas,
        "push_enviados":   push_enviados,
    }


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


@pdv_auto_bp.route('/recordatorio/ejecutar', methods=['POST'])
@login_required
def recordatorio_manual():
    """Dispara manualmente el recordatorio 18:30 (admin)."""
    if not _es_admin():
        return jsonify({"success": False, "error": "Solo admin/analyst"}), 403
    try:
        resumen = ejecutar_recordatorio_pdvs_abiertos()
        return jsonify({"success": True, **resumen})
    except Exception as e:
        current_app.logger.error(f"Error recordatorio_manual: {e}", exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500


@pdv_auto_bp.route('/alertas-supervisor', methods=['GET'])
@login_required
def listar_alertas_supervisor():
    """
    Lista las alertas a supervisores.
    - Admin/analyst: ven TODAS las alertas.
    - Supervisor (current_user.id_supervisor): solo las suyas.
    Filtros: ?solo_no_leidas=1&id_supervisor=&id_mercaderista=
    """
    try:
        solo_no_leidas = request.args.get('solo_no_leidas') in ('1', 'true', 'True')
        id_sup_filter  = request.args.get('id_supervisor', type=int)
        id_merc_filter = request.args.get('id_mercaderista', type=int)
        limit          = min(int(request.args.get('limit', 200)), 1000)

        parts, params = [], []

        # Restricción por rol
        if not _es_admin():
            # Solo el supervisor logueado puede ver sus alertas
            id_sup = getattr(current_user, 'id_supervisor', None)
            if not id_sup:
                return jsonify({"success": False, "error": "Sin acceso"}), 403
            parts.append("id_supervisor = ?"); params.append(id_sup)
        elif id_sup_filter:
            parts.append("id_supervisor = ?"); params.append(id_sup_filter)

        if id_merc_filter:
            parts.append("id_mercaderista = ?"); params.append(id_merc_filter)
        if solo_no_leidas:
            parts.append("leida = 0")
        where = ("WHERE " + " AND ".join(parts)) if parts else ""

        rows = execute_query(f"""
            SELECT TOP {limit}
                id_alerta, id_supervisor, nombre_supervisor,
                id_mercaderista, nombre_mercaderista, cedula_mercaderista,
                cantidad_auto_cierres, ventana_dias, motivo,
                fecha_alerta, leida, fecha_leida, push_enviado
            FROM ALERTAS_SUPERVISOR_PDV
            {where}
            ORDER BY fecha_alerta DESC
        """, tuple(params)) or []

        return jsonify({"success": True, "rows": [{
            "id_alerta":             r[0],
            "id_supervisor":         r[1],
            "nombre_supervisor":     r[2],
            "id_mercaderista":       r[3],
            "nombre_mercaderista":   r[4],
            "cedula_mercaderista":   r[5],
            "cantidad_auto_cierres": r[6],
            "ventana_dias":          r[7],
            "motivo":                r[8],
            "fecha_alerta":          r[9].isoformat()  if r[9]  else None,
            "leida":                 bool(r[10]),
            "fecha_leida":           r[11].isoformat() if r[11] else None,
            "push_enviado":          bool(r[12]),
        } for r in rows]})
    except Exception as e:
        current_app.logger.error(f"Error listar_alertas_supervisor: {e}", exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500


@pdv_auto_bp.route('/alertas-supervisor/<int:id_alerta>/marcar-leida', methods=['POST'])
@login_required
def marcar_alerta_leida(id_alerta: int):
    """Marca una alerta como leída."""
    try:
        execute_query("""
            UPDATE ALERTAS_SUPERVISOR_PDV
            SET leida = 1, fecha_leida = GETDATE()
            WHERE id_alerta = ?
        """, (id_alerta,), commit=True)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@pdv_auto_bp.route('/db-pool-stats', methods=['GET'])
@login_required
def db_pool_stats():
    """
    Métricas del pool de conexiones a la DB.
    Útil para diagnosticar si los timeouts vienen por saturación del pool.
    """
    if not _es_admin():
        return jsonify({"success": False, "error": "Solo admin/analyst"}), 403
    try:
        from app.utils.database import get_pool_stats
        s = get_pool_stats()
        avg_wait_ms = (s["wait_total_s"] / max(1, s["reused"] + s["created"])) * 1000
        return jsonify({
            "success": True,
            "pool": {
                "idle":              s["idle"],
                "in_use":            s["in_use"],
                "max_size":          s["max_size"],
                "saturacion_pct":    round(s["in_use"] / s["max_size"] * 100, 1),
                "conn_creadas":      s["created"],
                "conn_reusadas":     s["reused"],
                "conn_descartadas":  s["discarded"],
                "errores":           s["errors"],
                "wait_avg_ms":       round(avg_wait_ms, 2),
            }
        })
    except Exception as e:
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
