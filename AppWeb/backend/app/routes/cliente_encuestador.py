# app/routes/cliente_encuestador.py
"""
Dashboard BI para el Cliente Encuestador (id_rol = 13).

Consume la data capturada por el Encuestador (rol 12) en las tablas:
  - medicos
  - centros_salud
  - encuestas_centro
  - medico_centro_encuesta
  - JORNADAS_ENCUESTADOR
  - usuarios

Filtros globales soportados (todos opcionales, todos multi-select excepto fechas):
  - fecha_desde, fecha_hasta  (sobre encuestas_centro.fecha_verificacion)
  - estados, ciudades, especialidades, sub_especialidades,
    universidades, centros, encuestadores, dias_consulta,
    valor_consulta_rangos, promedio_pacientes_rangos, fuentes
"""
from flask import (Blueprint, render_template, request, jsonify,
                   redirect, url_for, flash, current_app)
from flask_login import login_required, current_user
from functools import wraps
import traceback

from app.utils.database import execute_query

cliente_encuestador_bp = Blueprint('cliente_encuestador', __name__,
                                   url_prefix='/cliente-encuestador')


# ===================================================================
# DECORADOR DE ROL — Cliente Encuestador (id_rol = 13)
# Admite también a admin para inspección/QA.
# ===================================================================
def verificar_rol_cliente_encuestador(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        es_api = request.path.startswith('/cliente-encuestador/api/')
        if not current_user.is_authenticated:
            if es_api:
                return jsonify({"success": False, "message": "No autorizado"}), 401
            flash('Debes iniciar sesión primero', 'warning')
            return redirect(url_for('auth.login'))
        id_rol = getattr(current_user, 'id_rol', None)
        if id_rol != 13 and not getattr(current_user, 'is_admin', lambda: False)():
            if es_api:
                return jsonify({"success": False, "message": "Acceso no autorizado"}), 403
            flash('Acceso no autorizado. Solo Cliente Encuestador.', 'danger')
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated


# ===================================================================
# CONSTRUCCIÓN DINÁMICA DE WHERE A PARTIR DE FILTROS
# ===================================================================
def _multi(name):
    """Lee request.args como lista (soporta `name=a&name=b` y `name=a,b`)."""
    vals = request.args.getlist(name)
    if len(vals) == 1 and ',' in vals[0]:
        vals = [v.strip() for v in vals[0].split(',') if v.strip()]
    return [v for v in vals if v]


def _build_filters():
    """
    Devuelve (where_sql, params) listos para concatenar después de
    'WHERE 1=1' en una consulta que tenga JOIN entre:
        medico_centro_encuesta mce
        JOIN encuestas_centro ec ON ec.id_encuesta = mce.id_encuesta
        JOIN medicos m ON m.id_medico = mce.id_medico
        JOIN centros_salud cs ON cs.id_centro = ec.id_centro
        JOIN usuarios u ON u.id_usuario = ec.id_usuario
    """
    parts, params = [], []

    fdesde = request.args.get('fecha_desde')
    fhasta = request.args.get('fecha_hasta')
    if fdesde:
        parts.append("ec.fecha_verificacion >= ?")
        params.append(fdesde)
    if fhasta:
        parts.append("ec.fecha_verificacion <= ?")
        params.append(fhasta)

    def _in(col, name):
        vals = _multi(name)
        if vals:
            ph = ",".join("?" for _ in vals)
            parts.append(f"{col} IN ({ph})")
            params.extend(vals)

    _in("m.estado",                        "estados")
    _in("m.ciudad",                        "ciudades")
    _in("m.especialidad",                  "especialidades")
    _in("m.sub_especialidad",              "sub_especialidades")
    _in("m.universidad_graduacion",        "universidades")
    _in("cs.id_centro",                    "centros")
    _in("ec.id_usuario",                   "encuestadores")
    _in("ec.fuente_informacion",           "fuentes")
    _in("mce.valor_consulta_rango",        "valor_consulta_rangos")
    _in("mce.promedio_pacientes_semanal_rango", "promedio_pacientes_rangos")

    # días_consulta = match parcial porque la columna es comma-separated
    dias = _multi("dias_consulta")
    if dias:
        ors = []
        for d in dias:
            ors.append("(mce.dias_consulta LIKE ? OR mce.dias_consulta2 LIKE ?)")
            params.extend([f"%{d}%", f"%{d}%"])
        parts.append("(" + " OR ".join(ors) + ")")

    where = ("AND " + " AND ".join(parts)) if parts else ""
    return where, params


_JOINS = """
    FROM medico_centro_encuesta mce
    JOIN encuestas_centro ec   ON ec.id_encuesta = mce.id_encuesta
    JOIN medicos m             ON m.id_medico   = mce.id_medico
    JOIN centros_salud cs      ON cs.id_centro  = ec.id_centro
    JOIN usuarios u            ON u.id_usuario  = ec.id_usuario
"""


# ===================================================================
# PÁGINA
# ===================================================================
@cliente_encuestador_bp.route('/dashboard')
@cliente_encuestador_bp.route('/')
@login_required
@verificar_rol_cliente_encuestador
def dashboard():
    return render_template('cliente_encuestador_dashboard.html',
                           username=current_user.username)


# ===================================================================
# CATÁLOGOS DE FILTROS (poblar dropdowns del sidebar)
# ===================================================================
@cliente_encuestador_bp.route('/api/filtros')
@login_required
@verificar_rol_cliente_encuestador
def api_filtros():
    try:
        especialidades = [r[0] for r in execute_query(
            "SELECT DISTINCT especialidad FROM medicos WHERE especialidad IS NOT NULL ORDER BY especialidad"
        ) or []]
        sub_especialidades = [r[0] for r in execute_query(
            "SELECT DISTINCT sub_especialidad FROM medicos WHERE sub_especialidad IS NOT NULL ORDER BY sub_especialidad"
        ) or []]
        estados = [r[0] for r in execute_query(
            "SELECT DISTINCT estado FROM medicos WHERE estado IS NOT NULL ORDER BY estado"
        ) or []]
        ciudades = [r[0] for r in execute_query(
            "SELECT DISTINCT ciudad FROM medicos WHERE ciudad IS NOT NULL ORDER BY ciudad"
        ) or []]
        universidades = [r[0] for r in execute_query(
            "SELECT DISTINCT universidad_graduacion FROM medicos WHERE universidad_graduacion IS NOT NULL ORDER BY universidad_graduacion"
        ) or []]
        centros = [{"id_centro": r[0], "nombre_centro": r[1]} for r in execute_query(
            "SELECT id_centro, nombre_centro FROM centros_salud ORDER BY nombre_centro"
        ) or []]
        encuestadores = [{"id_usuario": r[0], "username": r[1]} for r in execute_query(
            """SELECT DISTINCT u.id_usuario, u.username
               FROM usuarios u
               JOIN encuestas_centro ec ON ec.id_usuario = u.id_usuario
               ORDER BY u.username"""
        ) or []]
        fuentes = [r[0] for r in execute_query(
            "SELECT DISTINCT fuente_informacion FROM encuestas_centro WHERE fuente_informacion IS NOT NULL ORDER BY fuente_informacion"
        ) or []]
        valor_rangos = [r[0] for r in execute_query(
            "SELECT DISTINCT valor_consulta_rango FROM medico_centro_encuesta ORDER BY valor_consulta_rango"
        ) or []]
        pac_rangos = [r[0] for r in execute_query(
            "SELECT DISTINCT promedio_pacientes_semanal_rango FROM medico_centro_encuesta ORDER BY promedio_pacientes_semanal_rango"
        ) or []]

        return jsonify({
            "success": True,
            "especialidades": especialidades,
            "sub_especialidades": sub_especialidades,
            "estados": estados,
            "ciudades": ciudades,
            "universidades": universidades,
            "centros": centros,
            "encuestadores": encuestadores,
            "fuentes": fuentes,
            "valor_consulta_rangos": valor_rangos,
            "promedio_pacientes_rangos": pac_rangos,
            "dias_consulta": ["Lunes", "Martes", "Miércoles", "Jueves",
                              "Viernes", "Sábado", "Domingo"]
        })
    except Exception as e:
        current_app.logger.error(f"Error api_filtros: {e}\n{traceback.format_exc()}")
        return jsonify({"success": False, "message": str(e)}), 500


# ===================================================================
# KPIs (tarjetas del header)
# ===================================================================
@cliente_encuestador_bp.route('/api/kpis')
@login_required
@verificar_rol_cliente_encuestador
def api_kpis():
    try:
        where, params = _build_filters()
        base = f"{_JOINS} WHERE 1=1 {where}"

        total_medicos = execute_query(
            f"SELECT COUNT(DISTINCT m.id_medico) {base}", tuple(params), fetch_one=True) or 0
        total_centros = execute_query(
            f"SELECT COUNT(DISTINCT cs.id_centro) {base}", tuple(params), fetch_one=True) or 0
        total_especialidades = execute_query(
            f"SELECT COUNT(DISTINCT m.especialidad) {base}", tuple(params), fetch_one=True) or 0
        total_estados = execute_query(
            f"SELECT COUNT(DISTINCT m.estado) {base}", tuple(params), fetch_one=True) or 0
        total_ciudades = execute_query(
            f"SELECT COUNT(DISTINCT m.ciudad) {base}", tuple(params), fetch_one=True) or 0
        total_encuestas = execute_query(
            f"SELECT COUNT(DISTINCT ec.id_encuesta) {base}", tuple(params), fetch_one=True) or 0

        # Encuestas últimos 30 días (sobre la data filtrada)
        last30 = execute_query(
            f"""SELECT COUNT(DISTINCT ec.id_encuesta) {base}
                 AND ec.fecha_verificacion >= DATEADD(day, -30, CAST(GETDATE() AS DATE))""",
            tuple(params), fetch_one=True) or 0

        # Contactabilidad: % de médicos (distintos) con cada canal
        contact = execute_query(f"""
            SELECT
              COUNT(DISTINCT CASE WHEN m.whatsapp  IS NOT NULL AND m.whatsapp  <> '' THEN m.id_medico END),
              COUNT(DISTINCT CASE WHEN m.email     IS NOT NULL AND m.email     <> '' THEN m.id_medico END),
              COUNT(DISTINCT CASE WHEN m.telefono  IS NOT NULL AND m.telefono  <> '' THEN m.id_medico END),
              COUNT(DISTINCT CASE WHEN m.instagram IS NOT NULL AND m.instagram <> '' THEN m.id_medico END),
              COUNT(DISTINCT CASE WHEN m.linkedin  IS NOT NULL AND m.linkedin  <> '' THEN m.id_medico END),
              COUNT(DISTINCT m.id_medico)
            {_JOINS}
            WHERE 1=1 {where}
        """, tuple(params), fetch_one=True)

        wa, em, tel, ig, li, tot = (contact or (0, 0, 0, 0, 0, 0))
        def pct(x): return round((x or 0) * 100.0 / tot, 1) if tot else 0.0

        # Médicos con 2º consultorio
        dos_cons = execute_query(f"""
            SELECT COUNT(DISTINCT m.id_medico)
            {_JOINS}
            WHERE 1=1 {where}
              AND mce.clinica2_nombre IS NOT NULL AND mce.clinica2_nombre <> ''
        """, tuple(params), fetch_one=True) or 0

        pct_dos = round((dos_cons or 0) * 100.0 / total_medicos, 1) if total_medicos else 0.0

        def _val(x):
            return x if isinstance(x, int) else (x[0] if x else 0)

        return jsonify({
            "success": True,
            "total_medicos":       _val(total_medicos),
            "total_centros":       _val(total_centros),
            "total_especialidades":_val(total_especialidades),
            "total_estados":       _val(total_estados),
            "total_ciudades":      _val(total_ciudades),
            "total_encuestas":     _val(total_encuestas),
            "encuestas_30d":       _val(last30),
            "medicos_con_2do_consultorio": _val(dos_cons),
            "pct_2do_consultorio": pct_dos,
            "pct_whatsapp": pct(wa),
            "pct_email":    pct(em),
            "pct_telefono": pct(tel),
            "pct_instagram":pct(ig),
            "pct_linkedin": pct(li),
        })
    except Exception as e:
        current_app.logger.error(f"Error api_kpis: {e}\n{traceback.format_exc()}")
        return jsonify({"success": False, "message": str(e)}), 500


# ===================================================================
# HELPERS para gráficos: GROUP BY con filtros aplicados
# ===================================================================
def _agg_by(col, label_alias="label", limit=None, count_distinct_medico=True):
    """SELECT col AS label, COUNT(DISTINCT m.id_medico) ... FROM ... GROUP BY col"""
    where, params = _build_filters()
    metric = "COUNT(DISTINCT m.id_medico)" if count_distinct_medico else "COUNT(*)"
    top = f"TOP {limit} " if limit else ""
    q = f"""
        SELECT {top}{col} AS {label_alias}, {metric} AS valor
        {_JOINS}
        WHERE 1=1 {where} AND {col} IS NOT NULL AND {col} <> ''
        GROUP BY {col}
        ORDER BY valor DESC
    """
    return execute_query(q, tuple(params)) or []


# ===================================================================
# GRÁFICOS — DONUT / PIE
# ===================================================================
@cliente_encuestador_bp.route('/api/charts/especialidad')
@login_required
@verificar_rol_cliente_encuestador
def chart_especialidad():
    rows = _agg_by("m.especialidad", limit=12)
    return jsonify({"labels": [r[0] for r in rows], "data": [r[1] for r in rows]})


@cliente_encuestador_bp.route('/api/charts/valor-consulta')
@login_required
@verificar_rol_cliente_encuestador
def chart_valor_consulta():
    # Orden lógico de rangos
    order = ["Menos de 30$", "Entre 30$ a 50$", "Entre 50$ a 60$",
             "Entre 60$ a 100$", "Más de 100$"]
    rows = _agg_by("mce.valor_consulta_rango")
    data_map = {r[0]: r[1] for r in rows}
    labels = [r for r in order if r in data_map] + [r for r in data_map if r not in order]
    return jsonify({"labels": labels, "data": [data_map[l] for l in labels]})


@cliente_encuestador_bp.route('/api/charts/pacientes-semana')
@login_required
@verificar_rol_cliente_encuestador
def chart_pacientes_semana():
    order = ["1 a 5 pacientes", "6 a 10 pacientes", "11 a 15 pacientes",
             "16 a 20 pacientes", "21 a 30 pacientes", "Más de 30 pacientes"]
    rows = _agg_by("mce.promedio_pacientes_semanal_rango")
    data_map = {r[0]: r[1] for r in rows}
    labels = [r for r in order if r in data_map] + [r for r in data_map if r not in order]
    return jsonify({"labels": labels, "data": [data_map[l] for l in labels]})


@cliente_encuestador_bp.route('/api/charts/estado')
@login_required
@verificar_rol_cliente_encuestador
def chart_estado():
    rows = _agg_by("m.estado", limit=20)
    return jsonify({"labels": [r[0] for r in rows], "data": [r[1] for r in rows]})


@cliente_encuestador_bp.route('/api/charts/ciudad')
@login_required
@verificar_rol_cliente_encuestador
def chart_ciudad():
    rows = _agg_by("m.ciudad", limit=15)
    return jsonify({"labels": [r[0] for r in rows], "data": [r[1] for r in rows]})


@cliente_encuestador_bp.route('/api/charts/universidad')
@login_required
@verificar_rol_cliente_encuestador
def chart_universidad():
    rows = _agg_by("m.universidad_graduacion", limit=10)
    return jsonify({"labels": [r[0] for r in rows], "data": [r[1] for r in rows]})


@cliente_encuestador_bp.route('/api/charts/centros-top')
@login_required
@verificar_rol_cliente_encuestador
def chart_centros_top():
    rows = _agg_by("cs.nombre_centro", limit=15)
    return jsonify({"labels": [r[0] for r in rows], "data": [r[1] for r in rows]})


@cliente_encuestador_bp.route('/api/charts/dias-consulta')
@login_required
@verificar_rol_cliente_encuestador
def chart_dias_consulta():
    """Conteo por día contando si aparece en dias_consulta o dias_consulta2."""
    where, params = _build_filters()
    days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    out = []
    for d in days:
        q = f"""
            SELECT COUNT(DISTINCT m.id_medico)
            {_JOINS}
            WHERE 1=1 {where}
              AND (mce.dias_consulta LIKE ? OR mce.dias_consulta2 LIKE ?)
        """
        p = tuple(params) + (f"%{d}%", f"%{d}%")
        v = execute_query(q, p, fetch_one=True) or 0
        out.append(v if isinstance(v, int) else (v[0] if v else 0))
    return jsonify({"labels": days, "data": out})


# ===================================================================
# CRUCES AVANZADOS
# ===================================================================
@cliente_encuestador_bp.route('/api/charts/valor-por-especialidad')
@login_required
@verificar_rol_cliente_encuestador
def chart_valor_por_especialidad():
    """
    Valor medio de consulta por especialidad. Como `valor_consulta_rango`
    es texto, lo mapeamos a un punto medio numérico estimado.
    """
    where, params = _build_filters()
    q = f"""
        SELECT m.especialidad, mce.valor_consulta_rango, COUNT(*)
        {_JOINS}
        WHERE 1=1 {where} AND mce.valor_consulta_rango IS NOT NULL
        GROUP BY m.especialidad, mce.valor_consulta_rango
    """
    rows = execute_query(q, tuple(params)) or []

    # Midpoint $ por rango
    midpoint = {
        "Menos de 30$": 20,
        "Entre 30$ a 50$": 40,
        "Entre 50$ a 60$": 55,
        "Entre 60$ a 100$": 80,
        "Más de 100$": 130
    }

    agg = {}  # especialidad -> (sum, count)
    for esp, rango, cnt in rows:
        if not esp:
            continue
        mid = midpoint.get(rango)
        if mid is None:
            continue
        s, c = agg.get(esp, (0.0, 0))
        agg[esp] = (s + mid * cnt, c + cnt)

    items = sorted(
        [(esp, round(s / c, 1)) for esp, (s, c) in agg.items() if c],
        key=lambda x: x[1], reverse=True
    )[:15]
    return jsonify({
        "labels": [x[0] for x in items],
        "data":   [x[1] for x in items]
    })


@cliente_encuestador_bp.route('/api/charts/heatmap-esp-estado')
@login_required
@verificar_rol_cliente_encuestador
def chart_heatmap_esp_estado():
    """
    Matriz: filas = especialidades (top 10), columnas = estados (top 8).
    Cada celda = COUNT(DISTINCT médicos).
    """
    where, params = _build_filters()

    top_esp = [r[0] for r in execute_query(f"""
        SELECT TOP 10 m.especialidad, COUNT(DISTINCT m.id_medico) c
        {_JOINS} WHERE 1=1 {where} AND m.especialidad IS NOT NULL
        GROUP BY m.especialidad ORDER BY c DESC
    """, tuple(params)) or []]
    top_est = [r[0] for r in execute_query(f"""
        SELECT TOP 8 m.estado, COUNT(DISTINCT m.id_medico) c
        {_JOINS} WHERE 1=1 {where} AND m.estado IS NOT NULL
        GROUP BY m.estado ORDER BY c DESC
    """, tuple(params)) or []]

    if not top_esp or not top_est:
        return jsonify({"x": [], "y": [], "matrix": []})

    placeholders_e = ",".join("?" for _ in top_esp)
    placeholders_s = ",".join("?" for _ in top_est)
    q = f"""
        SELECT m.especialidad, m.estado, COUNT(DISTINCT m.id_medico)
        {_JOINS}
        WHERE 1=1 {where}
          AND m.especialidad IN ({placeholders_e})
          AND m.estado IN ({placeholders_s})
        GROUP BY m.especialidad, m.estado
    """
    rows = execute_query(q, tuple(params) + tuple(top_esp) + tuple(top_est)) or []
    cell = {(r[0], r[1]): r[2] for r in rows}
    matrix = [[cell.get((esp, est), 0) for est in top_est] for esp in top_esp]
    return jsonify({"y": top_esp, "x": top_est, "matrix": matrix})


@cliente_encuestador_bp.route('/api/charts/mapa-venezuela')
@login_required
@verificar_rol_cliente_encuestador
def chart_mapa_venezuela():
    """Médicos por estado para el mapa (Leaflet circle markers)."""
    where, params = _build_filters()
    q = f"""
        SELECT m.estado, COUNT(DISTINCT m.id_medico)
        {_JOINS}
        WHERE 1=1 {where} AND m.estado IS NOT NULL
        GROUP BY m.estado
        ORDER BY 2 DESC
    """
    rows = execute_query(q, tuple(params)) or []
    return jsonify([{"estado": r[0], "valor": r[1]} for r in rows])


@cliente_encuestador_bp.route('/api/charts/temporal')
@login_required
@verificar_rol_cliente_encuestador
def chart_temporal():
    """Encuestas (con sus médicos) por semana."""
    where, params = _build_filters()
    q = f"""
        SELECT
            CAST(DATEADD(day, -DATEPART(weekday, ec.fecha_verificacion)+1, ec.fecha_verificacion) AS DATE) AS semana,
            COUNT(DISTINCT ec.id_encuesta) AS encuestas,
            COUNT(DISTINCT m.id_medico)   AS medicos
        {_JOINS}
        WHERE 1=1 {where}
        GROUP BY CAST(DATEADD(day, -DATEPART(weekday, ec.fecha_verificacion)+1, ec.fecha_verificacion) AS DATE)
        ORDER BY semana
    """
    rows = execute_query(q, tuple(params)) or []
    return jsonify({
        "labels":   [r[0].isoformat() if r[0] else None for r in rows],
        "encuestas":[r[1] for r in rows],
        "medicos":  [r[2] for r in rows]
    })


@cliente_encuestador_bp.route('/api/charts/encuestadores-ranking')
@login_required
@verificar_rol_cliente_encuestador
def chart_encuestadores_ranking():
    """Ranking de encuestadores: # médicos y # centros aportados."""
    where, params = _build_filters()
    q = f"""
        SELECT TOP 15
            u.id_usuario, u.username,
            COUNT(DISTINCT m.id_medico) AS medicos,
            COUNT(DISTINCT cs.id_centro) AS centros,
            COUNT(DISTINCT ec.id_encuesta) AS encuestas
        {_JOINS}
        WHERE 1=1 {where}
        GROUP BY u.id_usuario, u.username
        ORDER BY medicos DESC, centros DESC
    """
    rows = execute_query(q, tuple(params)) or []
    return jsonify([{
        "id_usuario": r[0], "username": r[1],
        "medicos": r[2], "centros": r[3], "encuestas": r[4]
    } for r in rows])


# ===================================================================
# TABLA MAESTRA DE MÉDICOS (paginada)
# ===================================================================
@cliente_encuestador_bp.route('/api/medicos')
@login_required
@verificar_rol_cliente_encuestador
def api_medicos_tabla():
    try:
        where, params = _build_filters()
        try:
            page = max(1, int(request.args.get('page', 1)))
            per  = min(200, max(10, int(request.args.get('per_page', 25))))
        except ValueError:
            page, per = 1, 25
        offset = (page - 1) * per

        search = (request.args.get('q') or '').strip()
        search_clause = ""
        search_params = []
        if search:
            like = f"%{search}%"
            search_clause = """ AND (
                m.id_medico_externo LIKE ? OR m.apellido1 LIKE ? OR m.apellido2 LIKE ?
                OR m.nombre1 LIKE ? OR m.nombre2 LIKE ?
                OR m.especialidad LIKE ? OR cs.nombre_centro LIKE ?
            )"""
            search_params = [like]*7

        total = execute_query(
            f"SELECT COUNT(DISTINCT m.id_medico) {_JOINS} WHERE 1=1 {where} {search_clause}",
            tuple(params) + tuple(search_params), fetch_one=True
        ) or 0
        total = total if isinstance(total, int) else (total[0] if total else 0)

        rows = execute_query(f"""
            SELECT
                m.id_medico, m.id_medico_externo,
                CONCAT(m.apellido1, ' ', ISNULL(m.apellido2,''), ', ', m.nombre1, ' ', ISNULL(m.nombre2,'')) AS nombre_completo,
                m.especialidad, m.sub_especialidad, m.universidad_graduacion,
                m.ciudad, m.estado, m.telefono, m.whatsapp, m.email,
                cs.nombre_centro, mce.valor_consulta_rango,
                mce.promedio_pacientes_semanal_rango, mce.dias_consulta,
                ec.fecha_verificacion, u.username AS encuestador
            {_JOINS}
            WHERE 1=1 {where} {search_clause}
            ORDER BY ec.fecha_verificacion DESC, m.apellido1
            OFFSET ? ROWS FETCH NEXT ? ROWS ONLY
        """, tuple(params) + tuple(search_params) + (offset, per)) or []

        return jsonify({
            "success": True, "total": total, "page": page, "per_page": per,
            "medicos": [{
                "id_medico": r[0], "id_medico_externo": r[1], "nombre_completo": r[2],
                "especialidad": r[3], "sub_especialidad": r[4], "universidad": r[5],
                "ciudad": r[6], "estado": r[7],
                "telefono": r[8], "whatsapp": r[9], "email": r[10],
                "centro": r[11], "valor_consulta_rango": r[12],
                "promedio_pacientes": r[13], "dias_consulta": r[14],
                "fecha_verificacion": r[15].isoformat() if r[15] else None,
                "encuestador": r[16]
            } for r in rows]
        })
    except Exception as e:
        current_app.logger.error(f"Error api_medicos_tabla: {e}\n{traceback.format_exc()}")
        return jsonify({"success": False, "message": str(e)}), 500
