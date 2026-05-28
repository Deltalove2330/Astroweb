# app/routes/centro_mando_dia.py
"""
Centro de Mando — Resumen del Día (v2 FastAPI).

Port directo desde AppWeb/backend/app/routes/centro_mando_dia.py (Flask).
Misma lógica, mismos resultados. Usa SQL raw vía SQLAlchemy text porque las
queries son agregaciones complejas que no se benefician del ORM.

Endpoints:
  GET /api/centro-mando/clientes        — lista de clientes con programación activa
  GET /api/centro-mando/resumen-dia     — KPIs del día (opcional cliente_id, fecha)
"""
from datetime import date as _date, datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import Usuario

router = APIRouter(prefix="/api/centro-mando", tags=["Centro de Mando · Resumen del Día"])


# ── Helpers ───────────────────────────────────────────────────────
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


def _rows(db: Session, sql: str, params: dict | None = None) -> List[tuple]:
    """Ejecuta SQL y devuelve filas como tuplas."""
    result = db.execute(text(sql), params or {})
    return [tuple(r) for r in result.fetchall()]


def _scalar(db: Session, sql: str, params: dict | None = None) -> int:
    """Ejecuta SQL y devuelve el primer valor escalar (int)."""
    r = db.execute(text(sql), params or {}).fetchone()
    return int(r[0]) if r and r[0] is not None else 0


# ── Endpoint: lista de clientes ───────────────────────────────────
@router.get("/clientes")
def listar_clientes(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Lista los clientes con al menos una RUTA_PROGRAMACION activa."""
    rows = _rows(db, """
        SELECT DISTINCT c.id_cliente, c.cliente
        FROM CLIENTES c
        JOIN RUTA_PROGRAMACION rp ON rp.id_cliente = c.id_cliente
        WHERE rp.activa = 1 AND c.cliente IS NOT NULL
        ORDER BY c.cliente
    """)
    return {
        "success": True,
        "clientes": [{"id_cliente": r[0], "cliente": r[1]} for r in rows],
    }


# ── Endpoint principal: resumen del día ───────────────────────────
@router.get("/resumen-dia")
def resumen_dia(
    cliente_id: Optional[int] = Query(None, description="Filtra a un cliente; null = todos"),
    fecha:      Optional[str] = Query(None, description="YYYY-MM-DD; default = hoy"),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """
    Resumen del día con KPIs:
      mercaderistas {asignados, planificados_hoy, activos_hoy, faltantes_hoy,
                     exclusivos, tradex, detalle[], faltantes[]}
      rutas        {planificadas, activas, completadas, detalle[]}
      puntos_interes {planificados, activos, completados, detalle[]}
      clientes_tradex {planificados, activos, completados, aplica}

    Clasificación Exclusivo/Tradex viene de MERCADERISTAS_CLIENTE (fuente de verdad).
    """
    # Si es coordinador exclusivo y no pasa cliente_id, usar el suyo
    if cliente_id is None:
        if getattr(current_user, 'rol', None) == 'coordinador_exclusivo':
            cliente_id = getattr(current_user, 'cliente_id', None) or getattr(current_user, 'id_cliente', None)

    try:
        fecha_obj = (datetime.strptime(fecha, '%Y-%m-%d').date() if fecha else _date.today())
    except ValueError:
        raise HTTPException(status_code=400, detail="fecha inválida (formato YYYY-MM-DD)")

    dia = _dia_es(fecha_obj)
    has_cli = cliente_id is not None

    # Filtros dinámicos
    cli_rp_filter   = " AND rp.id_cliente = :cliente_id" if has_cli else ""
    cli_vm_filter   = " AND vm.id_cliente = :cliente_id" if has_cli else ""
    cli_merc_filter = " AND mc.id_cliente = :cliente_id" if has_cli else ""

    base_params = {"fecha": fecha_obj, "dia": dia}
    if has_cli:
        base_params["cliente_id"] = cliente_id

    # Nombre del cliente
    if has_cli:
        cli_row = db.execute(
            text("SELECT cliente FROM CLIENTES WHERE id_cliente = :cid"),
            {"cid": cliente_id}
        ).fetchone()
        cliente_nombre = cli_row[0] if cli_row else f"Cliente {cliente_id}"
    else:
        cliente_nombre = "Todos los clientes"

    # ── 1) Mercaderistas asignados (MERCADERISTAS_CLIENTE) ──────────
    asignados = _rows(db, f"""
        SELECT DISTINCT m.id_mercaderista, m.nombre, m.cedula,
                        ISNULL(m.tipo,'Mercaderista') AS tipo_camp
        FROM MERCADERISTAS m
        JOIN MERCADERISTAS_CLIENTE mc ON mc.id_mercaderista = m.id_mercaderista
        WHERE m.activo = 1 {cli_merc_filter}
    """, base_params)

    asignados_map = {r[0]: {"id_mercaderista": r[0], "nombre": r[1],
                            "cedula": r[2], "tipo_campo": r[3]}
                     for r in asignados}

    # ── 2) Mercaderistas planificados hoy ───────────────────────────
    plan_hoy = _rows(db, f"""
        SELECT DISTINCT m.id_mercaderista, m.nombre
        FROM MERCADERISTAS m
        JOIN MERCADERISTAS_RUTAS mr ON mr.id_mercaderista = m.id_mercaderista
        JOIN RUTA_PROGRAMACION rp   ON rp.id_ruta         = mr.id_ruta
        WHERE m.activo = 1 AND rp.activa = 1
          AND rp.dia = :dia {cli_rp_filter}
    """, base_params)
    planificados_ids = {r[0] for r in plan_hoy}

    # ── 3) Mercaderistas que activaron hoy ──────────────────────────
    activos_rows = _rows(db, f"""
        SELECT DISTINCT ra.id_mercaderista
        FROM RUTAS_ACTIVADAS ra
        JOIN MERCADERISTAS_RUTAS mr ON mr.id_ruta = ra.id_ruta
        JOIN RUTA_PROGRAMACION rp   ON rp.id_ruta = ra.id_ruta
        WHERE CAST(ra.fecha_hora_activacion AS DATE) = CAST(:fecha AS DATE)
          AND mr.id_mercaderista = ra.id_mercaderista
          {cli_rp_filter}
    """, base_params)
    activos_ids = {r[0] for r in activos_rows}

    # ── 4) Clasificación Exclusivo / Tradex ─────────────────────────
    if asignados_map:
        ids = list(asignados_map.keys())
        ph = ",".join(f":id{i}" for i, _ in enumerate(ids))
        clas_params = {f"id{i}": v for i, v in enumerate(ids)}
        for mid, n in _rows(db, f"""
            SELECT mc.id_mercaderista, COUNT(DISTINCT mc.id_cliente) AS n_cli
            FROM MERCADERISTAS_CLIENTE mc
            WHERE mc.id_mercaderista IN ({ph})
            GROUP BY mc.id_mercaderista
        """, clas_params):
            asignados_map[mid]["tipo_servicio"] = "Exclusivo" if n == 1 else "Tradex"
            asignados_map[mid]["n_clientes_asignados"] = int(n)
    for m in asignados_map.values():
        m.setdefault("tipo_servicio", "Exclusivo")
        m.setdefault("n_clientes_asignados", 1)

    # ── 5) Rutas planificadas para hoy ──────────────────────────────
    rutas_plan_rows = _rows(db, f"""
        SELECT DISTINCT rp.id_ruta, rn.ruta, mr.id_mercaderista, m.nombre
        FROM RUTA_PROGRAMACION rp
        JOIN RUTAS_NUEVAS rn        ON rn.id_ruta = rp.id_ruta
        JOIN MERCADERISTAS_RUTAS mr ON mr.id_ruta = rp.id_ruta
        JOIN MERCADERISTAS m        ON m.id_mercaderista = mr.id_mercaderista
        WHERE rp.activa = 1 AND m.activo = 1
          AND rp.dia = :dia {cli_rp_filter}
    """, base_params)

    ruta_merc_pairs = {(r[0], r[2]): {"id_ruta": r[0], "ruta": r[1],
                                      "id_mercaderista": r[2],
                                      "nombre_mercaderista": r[3],
                                      "estado": "Planificada",
                                      "pois_plan": 0, "pois_act": 0, "pois_com": 0,
                                      "clientes_plan": 0, "clientes_act": 0, "clientes_com": 0}
                      for r in rutas_plan_rows}

    # RUTAS_ACTIVADAS hoy
    for rid, mid, estado, fha in _rows(db, """
        SELECT ra.id_ruta, ra.id_mercaderista, ra.estado, ra.fecha_hora_activacion
        FROM RUTAS_ACTIVADAS ra
        WHERE CAST(ra.fecha_hora_activacion AS DATE) = CAST(:fecha AS DATE)
    """, {"fecha": fecha_obj}):
        key = (rid, mid)
        if key in ruta_merc_pairs:
            ent = ruta_merc_pairs[key]
            ent["estado"] = ("Activa" if estado == 'En Progreso'
                             else ("Completada" if estado == 'Finalizado' else estado))
            ent["hora_activacion"] = fha.isoformat() if fha else None

    rutas_planificadas = len(ruta_merc_pairs)
    rutas_activas      = sum(1 for v in ruta_merc_pairs.values() if v["estado"] == "Activa")
    rutas_completadas  = sum(1 for v in ruta_merc_pairs.values() if v["estado"] == "Completada")

    # ── 6) POIs planificados ────────────────────────────────────────
    pois_plan_rows = _rows(db, f"""
        SELECT DISTINCT rp.id_punto_interes, mr.id_mercaderista,
                        pin.punto_de_interes, rp.id_ruta, rn.ruta
        FROM RUTA_PROGRAMACION rp
        JOIN MERCADERISTAS_RUTAS mr ON mr.id_ruta = rp.id_ruta
        JOIN RUTAS_NUEVAS rn        ON rn.id_ruta = rp.id_ruta
        JOIN PUNTOS_INTERES1 pin    ON pin.identificador = rp.id_punto_interes
        JOIN MERCADERISTAS m        ON m.id_mercaderista = mr.id_mercaderista
        WHERE rp.activa = 1 AND m.activo = 1
          AND rp.dia = :dia {cli_rp_filter}
    """, base_params)

    # Estados de visita (por (punto, merc, cliente))
    ev_rows = _rows(db, f"""
        SELECT vm.identificador_punto_interes, vm.id_mercaderista, vm.id_cliente,
               MAX(CASE WHEN ft.id_tipo_foto=5 AND ft.Estado='Aprobada' THEN 1 ELSE 0 END) AS tiene_act,
               MAX(CASE WHEN ft.id_tipo_foto=6 AND ft.Estado='Aprobada' THEN 1 ELSE 0 END) AS tiene_des
        FROM VISITAS_MERCADERISTA vm
        LEFT JOIN FOTOS_TOTALES ft ON ft.id_visita = vm.id_visita
        WHERE CAST(vm.fecha_visita AS DATE) = CAST(:fecha AS DATE) {cli_vm_filter}
        GROUP BY vm.identificador_punto_interes, vm.id_mercaderista, vm.id_cliente
    """, base_params)
    estado_visita = {(r[0], r[1], r[2]): {"act": bool(r[3]), "des": bool(r[4])} for r in ev_rows}

    # Agregado por (punto, mercaderista)
    ev_agg = {}
    for (id_punto, id_merc, _cli), st in estado_visita.items():
        d = ev_agg.setdefault((id_punto, id_merc), {"act_any": False, "com_any": False})
        if st["act"]:               d["act_any"] = True
        if st["act"] and st["des"]: d["com_any"] = True

    pois_status = {}
    for id_punto, id_merc, nombre_punto, id_ruta, ruta_nombre in pois_plan_rows:
        key = (id_punto, id_merc)
        ent = pois_status.setdefault(key, {
            "id_punto": id_punto, "punto_de_interes": nombre_punto,
            "id_mercaderista": id_merc, "id_ruta": id_ruta, "ruta": ruta_nombre,
            "act": False, "com": False, "clientes_plan": 1,
            "clientes_act": 0, "clientes_com": 0
        })
        if has_cli:
            ev = estado_visita.get((id_punto, id_merc, cliente_id))
            if ev:
                if ev["act"]:               ent["act"] = True
                if ev["act"] and ev["des"]: ent["com"] = True
                if ev["act"]:               ent["clientes_act"] += 1
                if ev["act"] and ev["des"]: ent["clientes_com"] += 1
        else:
            ag = ev_agg.get(key)
            if ag:
                if ag["act_any"]: ent["act"] = True
                if ag["com_any"]: ent["com"] = True
                if ag["act_any"]: ent["clientes_act"] += 1
                if ag["com_any"]: ent["clientes_com"] += 1

        # Sumar al pair (ruta, mercaderista)
        pair = ruta_merc_pairs.get((id_ruta, id_merc))
        if pair is not None:
            pair["pois_plan"] += 1
            if ent["act"]:               pair["pois_act"] += 1
            if ent["com"]:               pair["pois_com"] += 1
            pair["clientes_plan"] += ent["clientes_plan"]
            pair["clientes_act"]  += ent["clientes_act"]
            pair["clientes_com"]  += ent["clientes_com"]

    pois_planificados = len(pois_status)
    pois_activos      = sum(1 for v in pois_status.values() if v["act"])
    pois_completados  = sum(1 for v in pois_status.values() if v["com"])

    # ── 7) Clientes (para Tradex) ───────────────────────────────────
    tradex_ids = [mid for mid, m in asignados_map.items() if m.get("tipo_servicio") == "Tradex"]
    clientes_plan = clientes_act = clientes_com = 0

    if tradex_ids:
        ph = ",".join(f":id{i}" for i, _ in enumerate(tradex_ids))
        tradex_params = {f"id{i}": v for i, v in enumerate(tradex_ids)}
        tradex_params["dia"] = dia
        tradex_rows = _rows(db, f"""
            SELECT rp.id_punto_interes, mr.id_mercaderista, rp.id_cliente
            FROM RUTA_PROGRAMACION rp
            JOIN MERCADERISTAS_RUTAS mr ON mr.id_ruta = rp.id_ruta
            WHERE rp.activa = 1 AND rp.dia = :dia
              AND mr.id_mercaderista IN ({ph})
        """, tradex_params)

        ev_full = _rows(db, """
            SELECT vm.identificador_punto_interes, vm.id_mercaderista, vm.id_cliente,
                   MAX(CASE WHEN ft.id_tipo_foto=5 AND ft.Estado='Aprobada' THEN 1 ELSE 0 END),
                   MAX(CASE WHEN ft.id_tipo_foto=6 AND ft.Estado='Aprobada' THEN 1 ELSE 0 END)
            FROM VISITAS_MERCADERISTA vm
            LEFT JOIN FOTOS_TOTALES ft ON ft.id_visita = vm.id_visita
            WHERE CAST(vm.fecha_visita AS DATE) = CAST(:fecha AS DATE)
            GROUP BY vm.identificador_punto_interes, vm.id_mercaderista, vm.id_cliente
        """, {"fecha": fecha_obj})
        ev_full_map = {(r[0], r[1], r[2]): {"act": bool(r[3]), "des": bool(r[4])} for r in ev_full}

        seen = set()
        for id_punto, id_merc, id_cli in tradex_rows:
            key = (id_punto, id_merc, id_cli)
            if key in seen:
                continue
            seen.add(key)
            clientes_plan += 1
            ev = ev_full_map.get(key)
            if ev and ev["act"]:               clientes_act += 1
            if ev and ev["act"] and ev["des"]: clientes_com += 1

    # ── 8) Detalle de mercaderistas ─────────────────────────────────
    merc_pois = {}
    for (id_punto, id_merc), ent in pois_status.items():
        d = merc_pois.setdefault(id_merc, {"pois_plan":0, "pois_act":0, "pois_com":0})
        d["pois_plan"] += 1
        if ent["act"]: d["pois_act"] += 1
        if ent["com"]: d["pois_com"] += 1

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
        plan_b   = mid in planificados_ids
        activo_b = mid in activos_ids
        mp = merc_pois.get(mid, {"pois_plan":0,"pois_act":0,"pois_com":0})
        mr = merc_rutas.get(mid, {"rutas_plan":0,"rutas_act":0,"rutas_com":0,"rutas_nombres":[]})

        estado = ("No planificado" if not plan_b else
                  ("Falta"  if not activo_b else
                   ("Completada" if mr["rutas_com"] == mr["rutas_plan"] and mr["rutas_plan"] > 0
                    else "Activa")))

        mercaderistas_detalle.append({
            **m,
            "planificado_hoy":  plan_b,
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

    prio = {"Falta":0, "Activa":1, "Completada":2, "No planificado":3}
    mercaderistas_detalle.sort(key=lambda x: (prio.get(x["estado"], 99), x["nombre"] or ""))
    faltantes = [m for m in mercaderistas_detalle if m["estado"] == "Falta"]

    return {
        "success":         True,
        "cliente_id":      cliente_id,
        "cliente_nombre":  cliente_nombre,
        "fecha":           fecha_obj.isoformat(),
        "dia_semana":      dia,
        "mercaderistas": {
            "total_asignados":  len(asignados_map),
            "planificados_hoy": len(planificados_ids),
            "activos_hoy":      len([1 for m in mercaderistas_detalle
                                     if m["estado"] in ("Activa","Completada")]),
            "faltantes_hoy":    len(faltantes),
            "exclusivos":       sum(1 for m in asignados_map.values() if m["tipo_servicio"] == "Exclusivo"),
            "tradex":           sum(1 for m in asignados_map.values() if m["tipo_servicio"] == "Tradex"),
            "detalle":          mercaderistas_detalle,
            "faltantes":        faltantes,
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
    }
