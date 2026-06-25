# app/routes/cliente_encuestador.py
"""
Dashboard BI para Cliente Encuestador (id_rol = 13) — v2 FastAPI.

Consume la data del encuestador médico:
  - medicos, centros_salud, encuestas_centro,
    medico_centro_encuesta, JORNADAS_ENCUESTADOR, usuarios

Endpoints (todos bajo /api/cliente-encuestador):
  GET  /filtros                  → catálogos para los <select> del sidebar
  GET  /kpis                     → tarjetas del header
  GET  /charts/especialidad      → donut
  GET  /charts/valor-consulta    → donut con orden lógico de rangos
  GET  /charts/pacientes-semana  → donut con orden lógico
  GET  /charts/estado            → barras
  GET  /charts/ciudad            → barras top 15
  GET  /charts/universidad       → barras horizontales top 10
  GET  /charts/centros-top       → barras horizontales top 15
  GET  /charts/dias-consulta     → barras por día de la semana
  GET  /charts/valor-por-especialidad  → midpoint $ por especialidad
  GET  /charts/heatmap-esp-estado      → matriz top 10 × top 8
  GET  /charts/mapa-venezuela    → médicos por estado para mapa
  GET  /charts/temporal          → encuestas/médicos por semana
  GET  /charts/encuestadores-ranking
  GET  /medicos                  → tabla paginada con búsqueda

Filtros globales aceptados por la mayoría (todos opcionales, query params):
  fecha_desde, fecha_hasta, estados[], ciudades[], especialidades[],
  sub_especialidades[], universidades[], centros[], encuestadores[],
  fuentes[], valor_consulta_rangos[], promedio_pacientes_rangos[],
  dias_consulta[]
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status, Request
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import Usuario

router = APIRouter(prefix="/api/cliente-encuestador", tags=["Cliente Encuestador BI"])


# ── Dependency: solo rol 13 (cliente encuestador) — admin también puede entrar ──
def require_cliente_encuestador(current_user: Usuario = Depends(get_current_user)) -> Usuario:
    if current_user.id_rol not in (13, 8):  # 13 = cliente encuestador, 8 = admin
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso no autorizado. Solo Cliente Encuestador o admin.",
        )
    return current_user


# ── Helpers ──────────────────────────────────────────────────────
JOINS = """
    FROM medico_centro_encuesta mce
    JOIN encuestas_centro ec   ON ec.id_encuesta = mce.id_encuesta
    JOIN medicos m             ON m.id_medico   = mce.id_medico
    JOIN centros_salud cs      ON cs.id_centro  = ec.id_centro
    JOIN usuarios u            ON u.id_usuario  = ec.id_usuario
"""


def _multi(request: Request, name: str) -> List[str]:
    """Lee query como lista (soporta ?name=a&name=b y ?name=a,b)."""
    vals = request.query_params.getlist(name)
    if len(vals) == 1 and ',' in vals[0]:
        vals = [v.strip() for v in vals[0].split(',') if v.strip()]
    return [v for v in vals if v]


def _build_filters(request: Request) -> tuple[str, dict]:
    """
    Devuelve (where_sql, params_dict). Se concatena después de 'WHERE 1=1'.
    """
    parts: list[str] = []
    params: dict = {}

    fdesde = request.query_params.get('fecha_desde')
    fhasta = request.query_params.get('fecha_hasta')
    if fdesde:
        parts.append("ec.fecha_verificacion >= :f_desde"); params['f_desde'] = fdesde
    if fhasta:
        parts.append("ec.fecha_verificacion <= :f_hasta"); params['f_hasta'] = fhasta

    def _in(col: str, name: str):
        vals = _multi(request, name)
        if vals:
            ph_names = [f"{name}_{i}" for i, _ in enumerate(vals)]
            parts.append(f"{col} IN ({','.join(':' + p for p in ph_names)})")
            for pn, v in zip(ph_names, vals):
                params[pn] = v

    _in("m.estado",                          "estados")
    _in("m.ciudad",                          "ciudades")
    _in("m.especialidad",                    "especialidades")
    _in("m.sub_especialidad",                "sub_especialidades")
    _in("m.universidad_graduacion",          "universidades")
    _in("cs.id_centro",                      "centros")
    _in("ec.id_usuario",                     "encuestadores")
    _in("ec.fuente_informacion",             "fuentes")
    _in("mce.valor_consulta_rango",          "valor_consulta_rangos")
    _in("mce.promedio_pacientes_semanal_rango", "promedio_pacientes_rangos")

    dias = _multi(request, "dias_consulta")
    if dias:
        ors = []
        for i, d in enumerate(dias):
            ph1 = f"dia_{i}_a"; ph2 = f"dia_{i}_b"
            ors.append(f"(mce.dias_consulta LIKE :{ph1} OR mce.dias_consulta2 LIKE :{ph2})")
            params[ph1] = f"%{d}%"; params[ph2] = f"%{d}%"
        parts.append("(" + " OR ".join(ors) + ")")

    where = ("AND " + " AND ".join(parts)) if parts else ""
    return where, params


def _rows(db: Session, sql: str, params: dict | None = None) -> list[tuple]:
    return [tuple(r) for r in db.execute(text(sql), params or {}).fetchall()]


def _scalar(db: Session, sql: str, params: dict | None = None):
    r = db.execute(text(sql), params or {}).fetchone()
    return r[0] if r else None


# ═════════════════════════════════════════════════════════════════
# CATÁLOGOS DE FILTROS
# ═════════════════════════════════════════════════════════════════
@router.get("/filtros")
def filtros(
    db: Session = Depends(get_db),
    _u: Usuario = Depends(require_cliente_encuestador),
):
    especialidades     = [r[0] for r in _rows(db, "SELECT DISTINCT especialidad FROM medicos WHERE especialidad IS NOT NULL ORDER BY especialidad")]
    sub_especialidades = [r[0] for r in _rows(db, "SELECT DISTINCT sub_especialidad FROM medicos WHERE sub_especialidad IS NOT NULL ORDER BY sub_especialidad")]
    estados            = [r[0] for r in _rows(db, "SELECT DISTINCT estado FROM medicos WHERE estado IS NOT NULL ORDER BY estado")]
    ciudades           = [r[0] for r in _rows(db, "SELECT DISTINCT ciudad FROM medicos WHERE ciudad IS NOT NULL ORDER BY ciudad")]
    universidades      = [r[0] for r in _rows(db, "SELECT DISTINCT universidad_graduacion FROM medicos WHERE universidad_graduacion IS NOT NULL ORDER BY universidad_graduacion")]
    centros            = [{"id_centro": r[0], "nombre_centro": r[1]} for r in
                          _rows(db, "SELECT id_centro, nombre_centro FROM centros_salud ORDER BY nombre_centro")]
    encuestadores      = [{"id_usuario": r[0], "username": r[1]} for r in
                          _rows(db, """SELECT DISTINCT u.id_usuario, u.username
                                       FROM usuarios u
                                       JOIN encuestas_centro ec ON ec.id_usuario = u.id_usuario
                                       ORDER BY u.username""")]
    fuentes            = [r[0] for r in _rows(db, "SELECT DISTINCT fuente_informacion FROM encuestas_centro WHERE fuente_informacion IS NOT NULL ORDER BY fuente_informacion")]
    valor_rangos       = [r[0] for r in _rows(db, "SELECT DISTINCT valor_consulta_rango FROM medico_centro_encuesta ORDER BY valor_consulta_rango")]
    pac_rangos         = [r[0] for r in _rows(db, "SELECT DISTINCT promedio_pacientes_semanal_rango FROM medico_centro_encuesta ORDER BY promedio_pacientes_semanal_rango")]

    return {
        "success":           True,
        "especialidades":    especialidades,
        "sub_especialidades": sub_especialidades,
        "estados":           estados,
        "ciudades":          ciudades,
        "universidades":     universidades,
        "centros":           centros,
        "encuestadores":     encuestadores,
        "fuentes":           fuentes,
        "valor_consulta_rangos":     valor_rangos,
        "promedio_pacientes_rangos": pac_rangos,
        "dias_consulta": ["Lunes", "Martes", "Miércoles", "Jueves",
                          "Viernes", "Sábado", "Domingo"],
    }


# ═════════════════════════════════════════════════════════════════
# KPIs
# ═════════════════════════════════════════════════════════════════
@router.get("/kpis")
def kpis(
    request: Request,
    db: Session = Depends(get_db),
    _u: Usuario = Depends(require_cliente_encuestador),
):
    where, params = _build_filters(request)
    base = f"{JOINS} WHERE 1=1 {where}"

    total_medicos        = _scalar(db, f"SELECT COUNT(DISTINCT m.id_medico)    {base}", params) or 0
    total_centros        = _scalar(db, f"SELECT COUNT(DISTINCT cs.id_centro)   {base}", params) or 0
    total_especialidades = _scalar(db, f"SELECT COUNT(DISTINCT m.especialidad) {base}", params) or 0
    total_estados        = _scalar(db, f"SELECT COUNT(DISTINCT m.estado)       {base}", params) or 0
    total_ciudades       = _scalar(db, f"SELECT COUNT(DISTINCT m.ciudad)       {base}", params) or 0
    total_encuestas      = _scalar(db, f"SELECT COUNT(DISTINCT ec.id_encuesta) {base}", params) or 0

    last30 = _scalar(db,
        f"SELECT COUNT(DISTINCT ec.id_encuesta) {base} "
        "AND ec.fecha_verificacion >= DATEADD(day, -30, CAST(GETDATE() AS DATE))",
        params) or 0

    contact_row = db.execute(text(f"""
        SELECT
          COUNT(DISTINCT CASE WHEN m.whatsapp  IS NOT NULL AND m.whatsapp  <> '' THEN m.id_medico END),
          COUNT(DISTINCT CASE WHEN m.email     IS NOT NULL AND m.email     <> '' THEN m.id_medico END),
          COUNT(DISTINCT CASE WHEN m.telefono  IS NOT NULL AND m.telefono  <> '' THEN m.id_medico END),
          COUNT(DISTINCT CASE WHEN m.instagram IS NOT NULL AND m.instagram <> '' THEN m.id_medico END),
          COUNT(DISTINCT CASE WHEN m.linkedin  IS NOT NULL AND m.linkedin  <> '' THEN m.id_medico END),
          COUNT(DISTINCT m.id_medico)
        {JOINS}
        WHERE 1=1 {where}
    """), params).fetchone()
    wa, em, tel, ig, li, tot = (contact_row or (0, 0, 0, 0, 0, 0))
    def pct(x: int) -> float:
        return round((x or 0) * 100.0 / tot, 1) if tot else 0.0

    dos_cons = _scalar(db, f"""
        SELECT COUNT(DISTINCT m.id_medico)
        {JOINS}
        WHERE 1=1 {where}
          AND mce.clinica2_nombre IS NOT NULL AND mce.clinica2_nombre <> ''
    """, params) or 0
    pct_dos = round((dos_cons or 0) * 100.0 / total_medicos, 1) if total_medicos else 0.0

    return {
        "success":             True,
        "total_medicos":       int(total_medicos),
        "total_centros":       int(total_centros),
        "total_especialidades": int(total_especialidades),
        "total_estados":       int(total_estados),
        "total_ciudades":      int(total_ciudades),
        "total_encuestas":     int(total_encuestas),
        "encuestas_30d":       int(last30),
        "medicos_con_2do_consultorio": int(dos_cons),
        "pct_2do_consultorio": pct_dos,
        "pct_whatsapp": pct(wa),
        "pct_email":    pct(em),
        "pct_telefono": pct(tel),
        "pct_instagram":pct(ig),
        "pct_linkedin": pct(li),
    }


# ─── Helper común para gráficos GROUP BY ───
def _agg_by(db: Session, request: Request, col: str, limit: int | None = None) -> list[tuple]:
    where, params = _build_filters(request)
    top = f"TOP {limit} " if limit else ""
    q = f"""
        SELECT {top}{col} AS label, COUNT(DISTINCT m.id_medico) AS valor
        {JOINS}
        WHERE 1=1 {where} AND {col} IS NOT NULL AND {col} <> ''
        GROUP BY {col}
        ORDER BY valor DESC
    """
    return _rows(db, q, params)


# ═════════════════════════════════════════════════════════════════
# DONUT / PIE
# ═════════════════════════════════════════════════════════════════
@router.get("/charts/especialidad")
def chart_especialidad(request: Request, db: Session = Depends(get_db), _u: Usuario = Depends(require_cliente_encuestador)):
    rows = _agg_by(db, request, "m.especialidad", limit=12)
    return {"labels": [r[0] for r in rows], "data": [r[1] for r in rows]}


@router.get("/charts/valor-consulta")
def chart_valor_consulta(request: Request, db: Session = Depends(get_db), _u: Usuario = Depends(require_cliente_encuestador)):
    order = ["Menos de 30$", "Entre 30$ a 50$", "Entre 50$ a 60$", "Entre 60$ a 100$", "Más de 100$"]
    rows = _agg_by(db, request, "mce.valor_consulta_rango")
    data_map = {r[0]: r[1] for r in rows}
    labels = [r for r in order if r in data_map] + [r for r in data_map if r not in order]
    return {"labels": labels, "data": [data_map[l] for l in labels]}


@router.get("/charts/pacientes-semana")
def chart_pacientes_semana(request: Request, db: Session = Depends(get_db), _u: Usuario = Depends(require_cliente_encuestador)):
    order = ["1 a 5 pacientes", "6 a 10 pacientes", "11 a 15 pacientes",
             "16 a 20 pacientes", "21 a 30 pacientes", "Más de 30 pacientes"]
    rows = _agg_by(db, request, "mce.promedio_pacientes_semanal_rango")
    data_map = {r[0]: r[1] for r in rows}
    labels = [r for r in order if r in data_map] + [r for r in data_map if r not in order]
    return {"labels": labels, "data": [data_map[l] for l in labels]}


@router.get("/charts/estado")
def chart_estado(request: Request, db: Session = Depends(get_db), _u: Usuario = Depends(require_cliente_encuestador)):
    rows = _agg_by(db, request, "m.estado", limit=20)
    return {"labels": [r[0] for r in rows], "data": [r[1] for r in rows]}


@router.get("/charts/ciudad")
def chart_ciudad(request: Request, db: Session = Depends(get_db), _u: Usuario = Depends(require_cliente_encuestador)):
    rows = _agg_by(db, request, "m.ciudad", limit=15)
    return {"labels": [r[0] for r in rows], "data": [r[1] for r in rows]}


@router.get("/charts/universidad")
def chart_universidad(request: Request, db: Session = Depends(get_db), _u: Usuario = Depends(require_cliente_encuestador)):
    rows = _agg_by(db, request, "m.universidad_graduacion", limit=10)
    return {"labels": [r[0] for r in rows], "data": [r[1] for r in rows]}


@router.get("/charts/centros-top")
def chart_centros_top(request: Request, db: Session = Depends(get_db), _u: Usuario = Depends(require_cliente_encuestador)):
    rows = _agg_by(db, request, "cs.nombre_centro", limit=15)
    return {"labels": [r[0] for r in rows], "data": [r[1] for r in rows]}


@router.get("/charts/dias-consulta")
def chart_dias_consulta(request: Request, db: Session = Depends(get_db), _u: Usuario = Depends(require_cliente_encuestador)):
    where, params = _build_filters(request)
    days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    out = []
    for i, d in enumerate(days):
        p = dict(params)
        p[f"d_a_{i}"] = f"%{d}%"; p[f"d_b_{i}"] = f"%{d}%"
        v = _scalar(db, f"""
            SELECT COUNT(DISTINCT m.id_medico)
            {JOINS}
            WHERE 1=1 {where}
              AND (mce.dias_consulta LIKE :d_a_{i} OR mce.dias_consulta2 LIKE :d_b_{i})
        """, p) or 0
        out.append(int(v))
    return {"labels": days, "data": out}


# ═════════════════════════════════════════════════════════════════
# CRUCES AVANZADOS
# ═════════════════════════════════════════════════════════════════
MIDPOINT = {
    "Menos de 30$": 20, "Entre 30$ a 50$": 40, "Entre 50$ a 60$": 55,
    "Entre 60$ a 100$": 80, "Más de 100$": 130,
}


@router.get("/charts/valor-por-especialidad")
def chart_valor_por_especialidad(request: Request, db: Session = Depends(get_db), _u: Usuario = Depends(require_cliente_encuestador)):
    where, params = _build_filters(request)
    rows = _rows(db, f"""
        SELECT m.especialidad, mce.valor_consulta_rango, COUNT(*)
        {JOINS}
        WHERE 1=1 {where} AND mce.valor_consulta_rango IS NOT NULL
        GROUP BY m.especialidad, mce.valor_consulta_rango
    """, params)

    agg: dict[str, tuple[float, int]] = {}
    for esp, rango, cnt in rows:
        if not esp: continue
        mid = MIDPOINT.get(rango)
        if mid is None: continue
        s, c = agg.get(esp, (0.0, 0))
        agg[esp] = (s + mid * int(cnt), c + int(cnt))

    items = sorted(
        [(esp, round(s / c, 1)) for esp, (s, c) in agg.items() if c],
        key=lambda x: x[1], reverse=True,
    )[:15]
    return {"labels": [x[0] for x in items], "data": [x[1] for x in items]}


@router.get("/charts/heatmap-esp-estado")
def chart_heatmap_esp_estado(request: Request, db: Session = Depends(get_db), _u: Usuario = Depends(require_cliente_encuestador)):
    where, params = _build_filters(request)

    top_esp = [r[0] for r in _rows(db, f"""
        SELECT TOP 10 m.especialidad, COUNT(DISTINCT m.id_medico) c
        {JOINS} WHERE 1=1 {where} AND m.especialidad IS NOT NULL
        GROUP BY m.especialidad ORDER BY c DESC
    """, params)]
    top_est = [r[0] for r in _rows(db, f"""
        SELECT TOP 8 m.estado, COUNT(DISTINCT m.id_medico) c
        {JOINS} WHERE 1=1 {where} AND m.estado IS NOT NULL
        GROUP BY m.estado ORDER BY c DESC
    """, params)]

    if not top_esp or not top_est:
        return {"x": [], "y": [], "matrix": []}

    esp_params = {f"esp_{i}": v for i, v in enumerate(top_esp)}
    est_params = {f"est_{i}": v for i, v in enumerate(top_est)}
    esp_ph = ",".join(f":esp_{i}" for i, _ in enumerate(top_esp))
    est_ph = ",".join(f":est_{i}" for i, _ in enumerate(top_est))

    q_params = {**params, **esp_params, **est_params}
    rows = _rows(db, f"""
        SELECT m.especialidad, m.estado, COUNT(DISTINCT m.id_medico)
        {JOINS}
        WHERE 1=1 {where}
          AND m.especialidad IN ({esp_ph})
          AND m.estado IN ({est_ph})
        GROUP BY m.especialidad, m.estado
    """, q_params)

    cell = {(r[0], r[1]): int(r[2]) for r in rows}
    matrix = [[cell.get((esp, est), 0) for est in top_est] for esp in top_esp]
    return {"y": top_esp, "x": top_est, "matrix": matrix}


@router.get("/charts/mapa-venezuela")
def chart_mapa_venezuela(request: Request, db: Session = Depends(get_db), _u: Usuario = Depends(require_cliente_encuestador)):
    where, params = _build_filters(request)
    rows = _rows(db, f"""
        SELECT m.estado, COUNT(DISTINCT m.id_medico)
        {JOINS}
        WHERE 1=1 {where} AND m.estado IS NOT NULL
        GROUP BY m.estado
        ORDER BY 2 DESC
    """, params)
    return [{"estado": r[0], "valor": int(r[1])} for r in rows]


@router.get("/charts/temporal")
def chart_temporal(request: Request, db: Session = Depends(get_db), _u: Usuario = Depends(require_cliente_encuestador)):
    where, params = _build_filters(request)
    rows = _rows(db, f"""
        SELECT
            CAST(DATEADD(day, -DATEPART(weekday, ec.fecha_verificacion)+1, ec.fecha_verificacion) AS DATE) AS semana,
            COUNT(DISTINCT ec.id_encuesta) AS encuestas,
            COUNT(DISTINCT m.id_medico)   AS medicos
        {JOINS}
        WHERE 1=1 {where}
        GROUP BY CAST(DATEADD(day, -DATEPART(weekday, ec.fecha_verificacion)+1, ec.fecha_verificacion) AS DATE)
        ORDER BY semana
    """, params)
    return {
        "labels":    [r[0].isoformat() if r[0] else None for r in rows],
        "encuestas": [int(r[1]) for r in rows],
        "medicos":   [int(r[2]) for r in rows],
    }


@router.get("/charts/encuestadores-ranking")
def chart_encuestadores_ranking(request: Request, db: Session = Depends(get_db), _u: Usuario = Depends(require_cliente_encuestador)):
    where, params = _build_filters(request)
    rows = _rows(db, f"""
        SELECT TOP 15
            u.id_usuario, u.username,
            COUNT(DISTINCT m.id_medico)   AS medicos,
            COUNT(DISTINCT cs.id_centro)  AS centros,
            COUNT(DISTINCT ec.id_encuesta) AS encuestas
        {JOINS}
        WHERE 1=1 {where}
        GROUP BY u.id_usuario, u.username
        ORDER BY medicos DESC, centros DESC
    """, params)
    return [{
        "id_usuario": r[0], "username": r[1],
        "medicos": int(r[2]), "centros": int(r[3]), "encuestas": int(r[4]),
    } for r in rows]


# ═════════════════════════════════════════════════════════════════
# TABLA MAESTRA DE MÉDICOS (paginada)
# ═════════════════════════════════════════════════════════════════
@router.get("/medicos")
def tabla_medicos(
    request: Request,
    page:     int = Query(1, ge=1),
    per_page: int = Query(25, ge=10, le=200),
    q:        Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _u: Usuario = Depends(require_cliente_encuestador),
):
    where, params = _build_filters(request)
    offset = (page - 1) * per_page

    search_clause = ""
    if q and q.strip():
        like = f"%{q.strip()}%"
        search_clause = """ AND (
            m.id_medico_externo LIKE :sq OR m.apellido1 LIKE :sq OR m.apellido2 LIKE :sq
            OR m.nombre1 LIKE :sq OR m.nombre2 LIKE :sq
            OR m.especialidad LIKE :sq OR cs.nombre_centro LIKE :sq
        )"""
        params['sq'] = like

    total = _scalar(db,
        f"SELECT COUNT(DISTINCT m.id_medico) {JOINS} WHERE 1=1 {where} {search_clause}",
        params) or 0

    params_pag = {**params, "offset": offset, "per_page": per_page}
    rows = _rows(db, f"""
        SELECT
            m.id_medico, m.id_medico_externo,
            CONCAT(m.apellido1, ' ', ISNULL(m.apellido2,''), ', ',
                   m.nombre1, ' ', ISNULL(m.nombre2,'')) AS nombre_completo,
            m.especialidad, m.sub_especialidad, m.universidad_graduacion,
            m.ciudad, m.estado, m.telefono, m.whatsapp, m.email,
            cs.nombre_centro, mce.valor_consulta_rango,
            mce.promedio_pacientes_semanal_rango, mce.dias_consulta,
            ec.fecha_verificacion, u.username AS encuestador
        {JOINS}
        WHERE 1=1 {where} {search_clause}
        ORDER BY ec.fecha_verificacion DESC, m.apellido1
        OFFSET :offset ROWS FETCH NEXT :per_page ROWS ONLY
    """, params_pag)

    return {
        "success": True, "total": int(total), "page": page, "per_page": per_page,
        "medicos": [{
            "id_medico": r[0], "id_medico_externo": r[1], "nombre_completo": r[2],
            "especialidad": r[3], "sub_especialidad": r[4], "universidad": r[5],
            "ciudad": r[6], "estado": r[7],
            "telefono": r[8], "whatsapp": r[9], "email": r[10],
            "centro": r[11], "valor_consulta_rango": r[12],
            "promedio_pacientes": r[13], "dias_consulta": r[14],
            "fecha_verificacion": r[15].isoformat() if r[15] else None,
            "encuestador": r[16],
        } for r in rows]
    }
