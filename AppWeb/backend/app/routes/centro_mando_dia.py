# app/routes/centro_mando_dia.py
"""
Resumen del Día para el Centro de Mando (cliente).

Para un cliente dado y la fecha de hoy (o una fecha explícita), calcula:

  • Mercaderistas asignados al cliente   (vía RUTA_PROGRAMACION + MERCADERISTAS_RUTAS)
  • Mercaderistas planificados hoy       (tienen rp.dia = <hoy> para este cliente)
  • Mercaderistas que activaron hoy      (RUTAS_ACTIVADAS con fecha = hoy)
  • Mercaderistas faltantes hoy          (planificados − activos)
  • Clasificación Exclusivo / Tradex     (DISTINCT(id_cliente) de su programación)

  • Rutas:    planificadas vs activas vs completadas
  • POIs:     planificados vs activos vs completados
  • Clientes: planificados vs activos vs completados   (relevante para Tradex)

Definiciones:
  - "activa"     : tiene foto de activación (id_tipo_foto = 5, Aprobada) hoy
  - "completada" : tiene activación Y desactivación (id_tipo_foto = 6, Aprobada) hoy

El endpoint respeta el filtro cliente_id, igual que /api/unified-activaciones.
"""
from datetime import date as _date, datetime
from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user

from app.utils.database import execute_query

centro_mando_dia_bp = Blueprint('centro_mando_dia', __name__,
                                url_prefix='/api/centro-mando')


# ───────────────────── Helpers ─────────────────────
DIAS_ES = {
    'Monday':    'Lunes',
    'Tuesday':   'Martes',
    'Wednesday': 'Miércoles',
    'Thursday':  'Jueves',
    'Friday':    'Viernes',
    'Saturday':  'Sábado',
    'Sunday':    'Domingo',
}


def _dia_es(fecha: _date) -> str:
    return DIAS_ES[fecha.strftime('%A')]


def _scalar(r, default=0):
    """execute_query con COUNT(*) puede devolver int o tupla — normaliza."""
    if r is None:
        return default
    if isinstance(r, (int, float)):
        return int(r)
    try:
        return int(r[0]) if r[0] is not None else default
    except Exception:
        return default


# ───────────────────── Endpoint: lista de clientes (lightweight) ─────────────────────
@centro_mando_dia_bp.route('/clientes')
@login_required
def listar_clientes():
    """
    Devuelve la lista de clientes que tienen al menos una RUTA_PROGRAMACION activa,
    para alimentar el selector del banner de Centro de Mando.
    """
    try:
        rows = execute_query("""
            SELECT DISTINCT c.id_cliente, c.cliente
            FROM CLIENTES c
            JOIN RUTA_PROGRAMACION rp ON rp.id_cliente = c.id_cliente
            WHERE rp.activa = 1 AND c.cliente IS NOT NULL
            ORDER BY c.cliente
        """) or []
        return jsonify({
            "success":  True,
            "clientes": [{"id_cliente": r[0], "cliente": r[1]} for r in rows]
        })
    except Exception as e:
        current_app.logger.error(f"Error en /api/centro-mando/clientes: {e}", exc_info=True)
        return jsonify({"success": False, "message": str(e), "clientes": []}), 500


# ───────────────────── Endpoint principal ─────────────────────
@centro_mando_dia_bp.route('/resumen-dia')
@login_required
def resumen_dia():
    try:
        cliente_id = request.args.get('cliente_id', type=int)
        fecha_str  = request.args.get('fecha')  # YYYY-MM-DD opcional

        # Si el usuario es coordinador exclusivo y no pasó cliente_id, usar el suyo
        if cliente_id is None and getattr(current_user, 'is_coordinador_exclusivo', lambda: False)():
            cliente_id = getattr(current_user, 'cliente_id', None)

        # cliente_id ahora es OPCIONAL → si es None se agrega para todos los clientes

        try:
            fecha = (datetime.strptime(fecha_str, '%Y-%m-%d').date()
                     if fecha_str else _date.today())
        except ValueError:
            return jsonify({"success": False, "message": "fecha inválida"}), 400

        dia = _dia_es(fecha)

        cliente_tipo = None
        if cliente_id:
            cli_row = execute_query(
                "SELECT cliente, id_tipo_cliente FROM CLIENTES WHERE id_cliente = ?",
                (cliente_id,), fetch_one=True
            )
            if cli_row:
                try:
                    row_list = list(cli_row)
                    cliente_nombre = row_list[0]
                    cliente_tipo = row_list[1]
                except Exception:
                    cliente_nombre = str(cli_row)
                    cliente_tipo = None
            else:
                cliente_nombre = f"Cliente {cliente_id}"
        else:
            cliente_nombre = "Todos los clientes"

        # 🔴 Fuente de verdad del vínculo mercaderista↔cliente = RUTA_PROGRAMACION
        #    (MERCADERISTAS_CLIENTE está DESACTUALIZADA → subcontaba; ver memoria).
        #    Para clientes Exclusivos (tipo 3) se cuentan SOLO las rutas de
        #    servicio 'Exclusivo' (las rutas Tradex que cruzan el cliente no son
        #    parte de su planificación exclusiva). serv_filter requiere JOIN RUTAS_NUEVAS rn.
        serv_filter = " AND rn.servicio = 'Exclusivo'" if cliente_tipo == 3 else ""

        # ═══════════════════════════════════════════════════════════
        # 1) MERCADERISTAS ASIGNADOS — fuente: RUTA_PROGRAMACION (cualquier día)
        # ═══════════════════════════════════════════════════════════
        if cliente_id:
            merc_asig_q = f"""
                SELECT DISTINCT m.id_mercaderista, m.nombre, m.cedula,
                                ISNULL(m.tipo,'Mercaderista') AS tipo_camp
                FROM MERCADERISTAS m
                JOIN MERCADERISTAS_RUTAS mr ON mr.id_mercaderista = m.id_mercaderista
                JOIN RUTA_PROGRAMACION rp   ON rp.id_ruta = mr.id_ruta
                JOIN RUTAS_NUEVAS rn        ON rn.id_ruta = rp.id_ruta
                WHERE m.activo = 1 AND rp.activa = 1 AND rp.id_cliente = ?{serv_filter}
            """
            asignados = execute_query(merc_asig_q, (cliente_id,)) or []
        else:
            merc_asig_q = """
                SELECT DISTINCT m.id_mercaderista, m.nombre, m.cedula,
                                ISNULL(m.tipo,'Mercaderista') AS tipo_camp
                FROM MERCADERISTAS m
                JOIN MERCADERISTAS_RUTAS mr ON mr.id_mercaderista = m.id_mercaderista
                JOIN RUTA_PROGRAMACION rp   ON rp.id_ruta = mr.id_ruta
                WHERE m.activo = 1 AND rp.activa = 1
            """
            asignados = execute_query(merc_asig_q, ()) or []
        asignados_map = {r[0]: {"id_mercaderista": r[0], "nombre": r[1],
                                "cedula": r[2], "tipo_campo": r[3]}
                         for r in asignados}

        # ═══════════════════════════════════════════════════════════
        # 2) MERCADERISTAS PLANIFICADOS HOY
        #    (mercaderistas con al menos un rp.dia = <hoy> para el cliente)
        # ═══════════════════════════════════════════════════════════
        if cliente_id:
            plan_hoy_q = f"""
                SELECT DISTINCT m.id_mercaderista, m.nombre
                FROM MERCADERISTAS m
                JOIN MERCADERISTAS_RUTAS mr ON mr.id_mercaderista = m.id_mercaderista
                JOIN RUTA_PROGRAMACION rp   ON rp.id_ruta         = mr.id_ruta
                JOIN RUTAS_NUEVAS rn        ON rn.id_ruta = rp.id_ruta
                WHERE m.activo = 1 AND rp.activa = 1
                  AND rp.dia = ? AND rp.id_cliente = ?{serv_filter}
            """
            plan_hoy = execute_query(plan_hoy_q, (dia, cliente_id)) or []
        else:
            plan_hoy_q = """
                SELECT DISTINCT m.id_mercaderista, m.nombre
                FROM MERCADERISTAS m
                JOIN MERCADERISTAS_RUTAS mr ON mr.id_mercaderista = m.id_mercaderista
                JOIN RUTA_PROGRAMACION rp   ON rp.id_ruta         = mr.id_ruta
                WHERE m.activo = 1 AND rp.activa = 1
                  AND rp.dia = ?
            """
            plan_hoy = execute_query(plan_hoy_q, (dia,)) or []
        planificados_ids = {r[0] for r in plan_hoy}

        # ═══════════════════════════════════════════════════════════
        # 3) MERCADERISTAS QUE ACTIVARON HOY (al menos 1 ruta)
        # ═══════════════════════════════════════════════════════════
        if cliente_id:
            activos_hoy_q = f"""
                SELECT DISTINCT ra.id_mercaderista
                FROM RUTAS_ACTIVADAS ra
                JOIN MERCADERISTAS_RUTAS mr ON mr.id_ruta = ra.id_ruta
                JOIN RUTA_PROGRAMACION rp   ON rp.id_ruta = ra.id_ruta
                JOIN RUTAS_NUEVAS rn        ON rn.id_ruta = rp.id_ruta
                WHERE CAST(ra.fecha_hora_activacion AS DATE) = CAST(? AS DATE)
                  AND mr.id_mercaderista = ra.id_mercaderista
                  AND rp.id_cliente = ?{serv_filter}
            """
            activos_rows = execute_query(activos_hoy_q, (fecha, cliente_id)) or []
        else:
            activos_hoy_q = """
                SELECT DISTINCT ra.id_mercaderista
                FROM RUTAS_ACTIVADAS ra
                JOIN MERCADERISTAS_RUTAS mr ON mr.id_ruta = ra.id_ruta
                JOIN RUTA_PROGRAMACION rp   ON rp.id_ruta = ra.id_ruta
                WHERE CAST(ra.fecha_hora_activacion AS DATE) = CAST(? AS DATE)
                  AND mr.id_mercaderista = ra.id_mercaderista
            """
            activos_rows = execute_query(activos_hoy_q, (fecha,)) or []
        activos_ids = {r[0] for r in activos_rows}

        # ═══════════════════════════════════════════════════════════
        # 4) CLASIFICACIÓN Exclusivo / Tradex — fuente: RUTA_PROGRAMACION
        #    (MERCADERISTAS_CLIENTE está desactualizada — ver memoria).
        #    Exclusivo: el mercaderista cubre 1 SOLO cliente en su programación activa.
        #    Tradex:   cubre 2 o más clientes distintos.
        #    NO depende del cliente filtrado — un mercaderista exclusivo de Fisa
        #    sigue siendo Exclusivo aunque filtres por Fisa.
        # ═══════════════════════════════════════════════════════════
        if asignados_map:
            ids = list(asignados_map.keys())
            ph  = ",".join("?" for _ in ids)
            clas_q = f"""
                SELECT mr.id_mercaderista, COUNT(DISTINCT rp.id_cliente) AS n_cli
                FROM MERCADERISTAS_RUTAS mr
                JOIN RUTA_PROGRAMACION rp ON rp.id_ruta = mr.id_ruta
                WHERE mr.id_mercaderista IN ({ph}) AND rp.activa = 1
                GROUP BY mr.id_mercaderista
            """
            for mid, n in (execute_query(clas_q, tuple(ids)) or []):
                # Si el cliente es Exclusivo (tipo 3), forzamos Exclusivo para todos sus mercaderistas asignados
                if cliente_tipo == 3:
                    asignados_map[mid]["tipo_servicio"] = "Exclusivo"
                else:
                    asignados_map[mid]["tipo_servicio"] = "Exclusivo" if n == 1 else "Tradex"
                asignados_map[mid]["n_clientes_asignados"] = int(n)
        for m in asignados_map.values():
            if cliente_tipo == 3:
                m["tipo_servicio"] = "Exclusivo"
            else:
                m.setdefault("tipo_servicio", "Exclusivo")
            m.setdefault("n_clientes_asignados", 1)

        # ═══════════════════════════════════════════════════════════
        # 5) RUTAS: planificadas / activas / completadas
        # ═══════════════════════════════════════════════════════════
        # 5.a planificadas: distinct id_ruta con rp.dia=hoy para el cliente
        if cliente_id:
            rutas_plan_q = f"""
                SELECT DISTINCT rp.id_ruta, rn.ruta, mr.id_mercaderista, m.nombre
                FROM RUTA_PROGRAMACION rp
                JOIN RUTAS_NUEVAS rn        ON rn.id_ruta = rp.id_ruta
                JOIN MERCADERISTAS_RUTAS mr ON mr.id_ruta = rp.id_ruta
                JOIN MERCADERISTAS m        ON m.id_mercaderista = mr.id_mercaderista
                WHERE rp.activa = 1 AND m.activo = 1
                  AND rp.dia = ? AND rp.id_cliente = ?{serv_filter}
            """
            rutas_plan_rows = execute_query(rutas_plan_q, (dia, cliente_id)) or []
        else:
            rutas_plan_q = """
                SELECT DISTINCT rp.id_ruta, rn.ruta, mr.id_mercaderista, m.nombre
                FROM RUTA_PROGRAMACION rp
                JOIN RUTAS_NUEVAS rn        ON rn.id_ruta = rp.id_ruta
                JOIN MERCADERISTAS_RUTAS mr ON mr.id_ruta = rp.id_ruta
                JOIN MERCADERISTAS m        ON m.id_mercaderista = mr.id_mercaderista
                WHERE rp.activa = 1 AND m.activo = 1
                  AND rp.dia = ?
            """
            rutas_plan_rows = execute_query(rutas_plan_q, (dia,)) or []

        ruta_merc_pairs = {(r[0], r[2]): {"id_ruta": r[0], "ruta": r[1],
                                          "id_mercaderista": r[2],
                                          "nombre_mercaderista": r[3],
                                          "estado": "Planificada",
                                          "pois_plan": 0, "pois_act": 0, "pois_com": 0,
                                          "clientes_plan": 0, "clientes_act": 0, "clientes_com": 0}
                          for r in rutas_plan_rows}

        # 5.b RUTAS_ACTIVADAS hoy (estado actual)
        ra_q = """
            SELECT ra.id_ruta, ra.id_mercaderista, ra.estado, ra.fecha_hora_activacion
            FROM RUTAS_ACTIVADAS ra
            WHERE CAST(ra.fecha_hora_activacion AS DATE) = CAST(? AS DATE)
        """
        ra_rows = execute_query(ra_q, (fecha,)) or []
        ra_map = {}
        for rid, mid, estado, fha in ra_rows:
            ra_map[(rid, mid)] = {"estado": estado, "fha": fha}

        for key, ent in ruta_merc_pairs.items():
            if key in ra_map:
                est = ra_map[key]["estado"]
                ent["estado"] = "Activa" if est == 'En Progreso' else \
                                ("Completada" if est == 'Finalizado' else est)
                ent["hora_activacion"] = ra_map[key]["fha"].isoformat() if ra_map[key]["fha"] else None

        rutas_planificadas = len(ruta_merc_pairs)
        rutas_activas      = sum(1 for v in ruta_merc_pairs.values() if v["estado"] == "Activa")
        rutas_completadas  = sum(1 for v in ruta_merc_pairs.values() if v["estado"] == "Completada")

        # ═══════════════════════════════════════════════════════════
        # 6) POIs: planificados / activos / completados
        #    Planificado = (id_punto, id_mercaderista) con rp.dia=hoy
        #    Activo      = tiene VISITA hoy con FOTO id_tipo_foto=5 (act) pero sin deactivación aún
        #    Completado  = tiene activación + desactivación (foto=6) hoy
        # ═══════════════════════════════════════════════════════════
        if cliente_id:
            pois_plan_q = f"""
                SELECT DISTINCT rp.id_punto_interes, mr.id_mercaderista,
                                pin.punto_de_interes, rp.id_ruta, rn.ruta
                FROM RUTA_PROGRAMACION rp
                JOIN MERCADERISTAS_RUTAS mr ON mr.id_ruta = rp.id_ruta
                JOIN RUTAS_NUEVAS rn        ON rn.id_ruta = rp.id_ruta
                JOIN PUNTOS_INTERES1 pin    ON pin.identificador = rp.id_punto_interes
                JOIN MERCADERISTAS m        ON m.id_mercaderista = mr.id_mercaderista
                WHERE rp.activa = 1 AND m.activo = 1
                  AND rp.dia = ? AND rp.id_cliente = ?{serv_filter}
            """
            pois_plan_rows = execute_query(pois_plan_q, (dia, cliente_id)) or []
        else:
            pois_plan_q = """
                SELECT DISTINCT rp.id_punto_interes, mr.id_mercaderista,
                                pin.punto_de_interes, rp.id_ruta, rn.ruta
                FROM RUTA_PROGRAMACION rp
                JOIN MERCADERISTAS_RUTAS mr ON mr.id_ruta = rp.id_ruta
                JOIN RUTAS_NUEVAS rn        ON rn.id_ruta = rp.id_ruta
                JOIN PUNTOS_INTERES1 pin    ON pin.identificador = rp.id_punto_interes
                JOIN MERCADERISTAS m        ON m.id_mercaderista = mr.id_mercaderista
                WHERE rp.activa = 1 AND m.activo = 1
                  AND rp.dia = ?
            """
            pois_plan_rows = execute_query(pois_plan_q, (dia,)) or []

        # Estado por (punto, mercaderista, cliente)
        if cliente_id:
            estado_visita_q = """
                SELECT vm.identificador_punto_interes, vm.id_mercaderista, vm.id_cliente,
                       MAX(CASE WHEN ft.id_tipo_foto=5 AND ft.Estado='Aprobada' THEN 1 ELSE 0 END) AS tiene_act,
                       MAX(CASE WHEN ft.id_tipo_foto=6 AND ft.Estado='Aprobada' THEN 1 ELSE 0 END) AS tiene_des
                FROM VISITAS_MERCADERISTA vm
                LEFT JOIN FOTOS_TOTALES ft ON ft.id_visita = vm.id_visita
                WHERE CAST(vm.fecha_visita AS DATE) = CAST(? AS DATE)
                  AND vm.id_cliente = ?
                GROUP BY vm.identificador_punto_interes, vm.id_mercaderista, vm.id_cliente
            """
            ev_rows = execute_query(estado_visita_q, (fecha, cliente_id)) or []
        else:
            estado_visita_q = """
                SELECT vm.identificador_punto_interes, vm.id_mercaderista, vm.id_cliente,
                       MAX(CASE WHEN ft.id_tipo_foto=5 AND ft.Estado='Aprobada' THEN 1 ELSE 0 END) AS tiene_act,
                       MAX(CASE WHEN ft.id_tipo_foto=6 AND ft.Estado='Aprobada' THEN 1 ELSE 0 END) AS tiene_des
                FROM VISITAS_MERCADERISTA vm
                LEFT JOIN FOTOS_TOTALES ft ON ft.id_visita = vm.id_visita
                WHERE CAST(vm.fecha_visita AS DATE) = CAST(? AS DATE)
                GROUP BY vm.identificador_punto_interes, vm.id_mercaderista, vm.id_cliente
            """
            ev_rows = execute_query(estado_visita_q, (fecha,)) or []
        estado_visita = {(r[0], r[1], r[2]): {"act": bool(r[3]), "des": bool(r[4])}
                         for r in ev_rows}

        # ── Agregado por (punto, mercaderista) para usar también en modo "todos" ──
        ev_agg = {}  # (id_punto, id_merc) → {act_any, com_any}
        for (id_punto, id_merc, _cli), st in estado_visita.items():
            d = ev_agg.setdefault((id_punto, id_merc), {"act_any": False, "com_any": False})
            if st["act"]:               d["act_any"] = True
            if st["act"] and st["des"]: d["com_any"] = True

        # ── Estructura por (punto, mercaderista) ──
        pois_status = {}
        for id_punto, id_merc, nombre_punto, id_ruta, ruta_nombre in pois_plan_rows:
            key = (id_punto, id_merc)
            ent = pois_status.setdefault(key, {
                "id_punto": id_punto, "punto_de_interes": nombre_punto,
                "id_mercaderista": id_merc, "id_ruta": id_ruta, "ruta": ruta_nombre,
                "act": False, "com": False,
                "clientes_plan": 1,
                "clientes_act": 0, "clientes_com": 0
            })
            if cliente_id is not None:
                ev = estado_visita.get((id_punto, id_merc, cliente_id))
                if ev:
                    # Activo ahora = tiene foto de activacion Y NO tiene foto de desactivacion
                    if ev["act"] and not ev["des"]: ent["act"] = True
                    if ev["act"] and ev["des"]:     ent["com"] = True
                    if ev["act"] and not ev["des"]: ent["clientes_act"] += 1
                    if ev["act"] and ev["des"]:     ent["clientes_com"] += 1
            else:
                # Modo "todos los clientes" → agregamos por punto+mercaderista
                ag = ev_agg.get(key)
                if ag:
                    if ag["act_any"] and not ag["com_any"]: ent["act"] = True
                    if ag["com_any"]:                       ent["com"] = True
                    if ag["act_any"] and not ag["com_any"]: ent["clientes_act"] += 1
                    if ag["com_any"]:                       ent["clientes_com"] += 1

            # Sumar al pair (ruta, mercaderista) los conteos
            pair = ruta_merc_pairs.get((id_ruta, id_merc))
            if pair is not None:
                pair["pois_plan"] += 1
                if ent["act"]:                       pair["pois_act"] += 1
                if ent["com"]:                       pair["pois_com"] += 1
                pair["clientes_plan"] += ent["clientes_plan"]
                pair["clientes_act"]  += ent["clientes_act"]
                pair["clientes_com"]  += ent["clientes_com"]

        pois_planificados = len(pois_status)
        pois_activos      = sum(1 for v in pois_status.values() if v["act"])
        pois_completados  = sum(1 for v in pois_status.values() if v["com"])

        # ═══════════════════════════════════════════════════════════
        # 7) CLIENTES (relevante para Tradex)
        #    Para cada (id_punto, id_merc) Tradex, contamos los clientes
        #    asociados al POI en rp.dia = hoy (sin filtrar por cliente).
        # ═══════════════════════════════════════════════════════════
        tradex_ids = [mid for mid, m in asignados_map.items()
                      if m.get("tipo_servicio") == "Tradex"]
        clientes_plan = clientes_act = clientes_com = 0

        if tradex_ids:
            ph = ",".join("?" for _ in tradex_ids)
            tradex_pois_q = f"""
                SELECT rp.id_punto_interes, mr.id_mercaderista, rp.id_cliente
                FROM RUTA_PROGRAMACION rp
                JOIN MERCADERISTAS_RUTAS mr ON mr.id_ruta = rp.id_ruta
                WHERE rp.activa = 1 AND rp.dia = ?
                  AND mr.id_mercaderista IN ({ph})
            """
            tradex_rows = execute_query(tradex_pois_q, tuple([dia] + tradex_ids)) or []

            # Estado por (punto, mercaderista, cliente_X) — necesita revisar TODAS las visitas hoy (no solo del cliente filtrado)
            estado_visita_full_q = """
                SELECT vm.identificador_punto_interes, vm.id_mercaderista, vm.id_cliente,
                       MAX(CASE WHEN ft.id_tipo_foto=5 AND ft.Estado='Aprobada' THEN 1 ELSE 0 END),
                       MAX(CASE WHEN ft.id_tipo_foto=6 AND ft.Estado='Aprobada' THEN 1 ELSE 0 END)
                FROM VISITAS_MERCADERISTA vm
                LEFT JOIN FOTOS_TOTALES ft ON ft.id_visita = vm.id_visita
                WHERE CAST(vm.fecha_visita AS DATE) = CAST(? AS DATE)
                GROUP BY vm.identificador_punto_interes, vm.id_mercaderista, vm.id_cliente
            """
            ev_full = execute_query(estado_visita_full_q, (fecha,)) or []
            ev_full_map = {(r[0], r[1], r[2]): {"act": bool(r[3]), "des": bool(r[4])}
                           for r in ev_full}

            seen = set()
            for id_punto, id_merc, id_cli in tradex_rows:
                key = (id_punto, id_merc, id_cli)
                if key in seen:
                    continue
                seen.add(key)
                clientes_plan += 1
                ev = ev_full_map.get(key)
                if ev and ev["act"] and not ev["des"]: clientes_act += 1
                if ev and ev["act"] and ev["des"]:     clientes_com += 1

        # ═══════════════════════════════════════════════════════════
        # 8) DETALLE de mercaderistas (planificados, faltantes, etc.)
        # ═══════════════════════════════════════════════════════════
        # Sumar conteos de POIs por mercaderista
        merc_pois = {}
        for (id_punto, id_merc), ent in pois_status.items():
            d = merc_pois.setdefault(id_merc, {"pois_plan":0, "pois_act":0, "pois_com":0})
            d["pois_plan"] += 1
            if ent["act"]: d["pois_act"] += 1
            if ent["com"]: d["pois_com"] += 1

        # Rutas por mercaderista hoy
        merc_rutas = {}
        for (id_ruta, id_merc), ent in ruta_merc_pairs.items():
            d = merc_rutas.setdefault(id_merc, {"rutas_plan":0, "rutas_act":0, "rutas_com":0,
                                                "rutas_nombres": []})
            d["rutas_plan"] += 1
            if ent["estado"] == "Activa":     d["rutas_act"] += 1
            if ent["estado"] == "Completada": d["rutas_com"] += 1
            d["rutas_nombres"].append(ent["ruta"])

        mercaderistas_detalle = []
        for mid, m in asignados_map.items():
            plan_hoy_b = mid in planificados_ids
            activo_b   = mid in activos_ids
            mp = merc_pois.get(mid, {"pois_plan":0,"pois_act":0,"pois_com":0})
            mr = merc_rutas.get(mid, {"rutas_plan":0,"rutas_act":0,"rutas_com":0,"rutas_nombres":[]})

            estado = ("No planificado" if not plan_hoy_b else
                      ("Falta"  if not activo_b else
                       ("Completada" if mr["rutas_com"] == mr["rutas_plan"] and mr["rutas_plan"] > 0
                        else "Activa")))

            mercaderistas_detalle.append({
                **m,
                "planificado_hoy":  plan_hoy_b,
                "activo_hoy":       activo_b,
                "estado":           estado,
                "rutas_planificadas": mr["rutas_plan"],
                "rutas_activas":      mr["rutas_act"],
                "rutas_completadas":  mr["rutas_com"],
                "rutas_nombres":      mr["rutas_nombres"],
                "pois_planificados":  mp["pois_plan"],
                "pois_activos":       mp["pois_act"],
                "pois_completados":   mp["pois_com"],
            })

        # Orden: faltantes primero, luego activos, luego no planificados
        prio = {"Falta":0,"Activa":1,"Completada":2,"No planificado":3}
        mercaderistas_detalle.sort(key=lambda x: (prio.get(x["estado"],99), x["nombre"] or ""))

        faltantes = [m for m in mercaderistas_detalle if m["estado"] == "Falta"]
        activos   = [m for m in mercaderistas_detalle if m["estado"] in ("Activa", "Completada")]

        # ═══════════════════════════════════════════════════════════
        # RESPUESTA
        # ═══════════════════════════════════════════════════════════
        return jsonify({
            "success":         True,
            "cliente_id":      cliente_id,
            "cliente_nombre":  cliente_nombre,
            "fecha":           fecha.isoformat(),
            "dia_semana":      dia,
            "mercaderistas": {
                "total_asignados":         len(asignados_map),
                "planificados_hoy":        len(planificados_ids),
                "activos_hoy":             len([1 for m in mercaderistas_detalle
                                                if m["estado"] in ("Activa","Completada")]),
                "faltantes_hoy":           len(faltantes),
                "exclusivos":              sum(1 for m in asignados_map.values()
                                               if m["tipo_servicio"] == "Exclusivo"),
                "tradex":                  sum(1 for m in asignados_map.values()
                                               if m["tipo_servicio"] == "Tradex"),
                "detalle":                 mercaderistas_detalle,
                "faltantes":               faltantes,
                "activos":                 activos,
            },
            "rutas": {
                "planificadas":  rutas_planificadas,
                "activas":       rutas_activas,
                "completadas":   rutas_completadas,
                "detalle":       list(ruta_merc_pairs.values()),
            },
            "puntos_interes": {
                "planificados":  pois_planificados,
                "activos":       pois_activos,
                "completados":   pois_completados,
                "detalle":       list(pois_status.values()),
            },
            "clientes_tradex": {
                "planificados":  clientes_plan,
                "activos":       clientes_act,
                "completados":   clientes_com,
                "aplica":        bool(tradex_ids),
            },
        })

    except Exception as e:
        current_app.logger.error(f"Error en /api/centro-mando/resumen-dia: {e}", exc_info=True)
        return jsonify({"success": False, "message": str(e)}), 500


# ───────────────── Endpoint: DETALLE de PDVs por estado (drill-down) ─────────────────
@centro_mando_dia_bp.route('/resumen-dia/puntos')
@login_required
def resumen_dia_puntos():
    """Lista de PDVs del día clasificados por estado, con su ruta y mercaderista.
    Es el drill-down del resumen del día (mismos criterios que /resumen-dia):
      - pendiente  : planificado (rp.dia) sin foto de activación en la fecha
      - activo     : tiene foto de activación (tipo 5 Aprobada) y NO de desactivación
      - completado : tiene activación (5) Y desactivación (6), ambas Aprobadas
    """
    try:
        cliente_id = request.args.get('cliente_id', type=int)
        fecha_str  = request.args.get('fecha')
        if cliente_id is None and getattr(current_user, 'is_coordinador_exclusivo', lambda: False)():
            cliente_id = getattr(current_user, 'cliente_id', None)

        try:
            fecha = (datetime.strptime(fecha_str, '%Y-%m-%d').date()
                     if fecha_str else _date.today())
        except ValueError:
            return jsonify({"success": False, "message": "fecha inválida"}), 400

        dia = _dia_es(fecha)

        # Igual que /resumen-dia: fuente de verdad RUTA_PROGRAMACION (no la stale
        # MERCADERISTAS_CLIENTE); para clientes Exclusivos (tipo 3), solo rutas Exclusivo.
        cliente_tipo = None
        if cliente_id:
            cli_row = execute_query(
                "SELECT id_tipo_cliente FROM CLIENTES WHERE id_cliente = ?",
                (cliente_id,), fetch_one=True)
            if cli_row:
                cliente_tipo = (cli_row[0] if not isinstance(cli_row, (int,)) else cli_row)
        serv_filter = " AND rn.servicio = 'Exclusivo'" if cliente_tipo == 3 else ""

        # 1) POIs planificados ese día (punto, mercaderista, nombre punto, ruta, nombre merc)
        if cliente_id:
            plan_q = f"""
                SELECT DISTINCT rp.id_punto_interes, mr.id_mercaderista,
                                pin.punto_de_interes, rn.ruta, m.nombre
                FROM RUTA_PROGRAMACION rp
                JOIN MERCADERISTAS_RUTAS mr ON mr.id_ruta = rp.id_ruta
                JOIN RUTAS_NUEVAS rn        ON rn.id_ruta = rp.id_ruta
                JOIN PUNTOS_INTERES1 pin    ON pin.identificador = rp.id_punto_interes
                JOIN MERCADERISTAS m        ON m.id_mercaderista = mr.id_mercaderista
                WHERE rp.activa = 1 AND m.activo = 1
                  AND rp.dia = ? AND rp.id_cliente = ?{serv_filter}
            """
            plan_rows = execute_query(plan_q, (dia, cliente_id)) or []
        else:
            plan_q = """
                SELECT DISTINCT rp.id_punto_interes, mr.id_mercaderista,
                                pin.punto_de_interes, rn.ruta, m.nombre
                FROM RUTA_PROGRAMACION rp
                JOIN MERCADERISTAS_RUTAS mr ON mr.id_ruta = rp.id_ruta
                JOIN RUTAS_NUEVAS rn        ON rn.id_ruta = rp.id_ruta
                JOIN PUNTOS_INTERES1 pin    ON pin.identificador = rp.id_punto_interes
                JOIN MERCADERISTAS m        ON m.id_mercaderista = mr.id_mercaderista
                WHERE rp.activa = 1 AND m.activo = 1 AND rp.dia = ?
            """
            plan_rows = execute_query(plan_q, (dia,)) or []

        # 2) Estado por (punto, mercaderista) según las fotos de ESA fecha
        if cliente_id:
            ev_q = """
                SELECT vm.identificador_punto_interes, vm.id_mercaderista,
                       MAX(CASE WHEN ft.id_tipo_foto=5 AND ft.Estado='Aprobada' THEN 1 ELSE 0 END),
                       MAX(CASE WHEN ft.id_tipo_foto=6 AND ft.Estado='Aprobada' THEN 1 ELSE 0 END)
                FROM VISITAS_MERCADERISTA vm
                LEFT JOIN FOTOS_TOTALES ft ON ft.id_visita = vm.id_visita
                WHERE CAST(vm.fecha_visita AS DATE) = CAST(? AS DATE)
                  AND vm.id_cliente = ?
                GROUP BY vm.identificador_punto_interes, vm.id_mercaderista
            """
            ev_rows = execute_query(ev_q, (fecha, cliente_id)) or []
        else:
            ev_q = """
                SELECT vm.identificador_punto_interes, vm.id_mercaderista,
                       MAX(CASE WHEN ft.id_tipo_foto=5 AND ft.Estado='Aprobada' THEN 1 ELSE 0 END),
                       MAX(CASE WHEN ft.id_tipo_foto=6 AND ft.Estado='Aprobada' THEN 1 ELSE 0 END)
                FROM VISITAS_MERCADERISTA vm
                LEFT JOIN FOTOS_TOTALES ft ON ft.id_visita = vm.id_visita
                WHERE CAST(vm.fecha_visita AS DATE) = CAST(? AS DATE)
                GROUP BY vm.identificador_punto_interes, vm.id_mercaderista
            """
            ev_rows = execute_query(ev_q, (fecha,)) or []
        estado = {(r[0], r[1]): {"act": bool(r[2]), "des": bool(r[3])} for r in ev_rows}

        # 3) Clasificar (dedupe por punto+mercaderista)
        seen = set()
        pendientes, activos, completados = [], [], []
        for id_punto, id_merc, nombre_punto, ruta_nombre, merc_nombre in plan_rows:
            key = (id_punto, id_merc)
            if key in seen:
                continue
            seen.add(key)
            st = estado.get(key, {"act": False, "des": False})
            item = {
                "id_punto": id_punto,
                "punto_de_interes": nombre_punto or id_punto,
                "ruta": ruta_nombre or '',
                "mercaderista": merc_nombre or '',
            }
            if st["act"] and st["des"]:
                item["estado"] = "completado"; completados.append(item)
            elif st["act"]:
                item["estado"] = "activo"; activos.append(item)
            else:
                item["estado"] = "pendiente"; pendientes.append(item)

        for lst in (pendientes, activos, completados):
            lst.sort(key=lambda x: (x["ruta"], x["punto_de_interes"]))

        return jsonify({
            "success": True,
            "fecha": fecha.isoformat(),
            "dia": dia,
            "cliente_id": cliente_id,
            "totales": {
                "pendientes": len(pendientes),
                "activos": len(activos),
                "completados": len(completados),
            },
            "pendientes": pendientes,
            "activos": activos,
            "completados": completados,
        })

    except Exception as e:
        current_app.logger.error(f"Error en /api/centro-mando/resumen-dia/puntos: {e}", exc_info=True)
        return jsonify({"success": False, "message": str(e)}), 500
