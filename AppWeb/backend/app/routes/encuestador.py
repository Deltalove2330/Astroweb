# app/routes/encuestador.py
"""
Módulo Encuestador Médico (id_rol = 12).

Flujo (espeja al vendedor / mercaderista):
  1. Login del encuestador.
  2. Pulsa "Activar Jornada" → se abre una jornada en JORNADAS_ENCUESTADOR.
  3. Busca o crea un Centro de Salud.
  4. Abre una "encuesta_centro" para ese centro (id_jornada, id_centro).
  5. Va agregando N médicos al centro:
       - Busca por id_medico_externo (o apellido). Si existe → precarga.
       - Si no existe → modal completo con datos del médico.
       - Cada submit inserta en medicos (si nuevo) + medico_centro_encuesta.
  6. Cierra encuesta del centro → puede ir a otro centro.
  7. Cierra jornada al terminar el día.
"""
from flask import (Blueprint, render_template, request, jsonify,
                   redirect, url_for, flash, current_app)
from flask_login import login_required, current_user
from functools import wraps
import traceback

from app.utils.database import execute_query

encuestador_bp = Blueprint('encuestador', __name__, url_prefix='/encuestador')


# ===================================================================
# DECORADOR DE ROL — solo Encuestador (id_rol = 12)
# ===================================================================
def verificar_rol_encuestador(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        es_api = request.path.startswith('/encuestador/api/')
        if not current_user.is_authenticated:
            if es_api:
                return jsonify({"success": False, "message": "No autorizado"}), 401
            flash('Debes iniciar sesión primero', 'warning')
            return redirect(url_for('auth.login'))
        if getattr(current_user, 'id_rol', None) != 12:
            if es_api:
                return jsonify({"success": False, "message": "Acceso no autorizado"}), 403
            flash('Acceso no autorizado. Solo para Encuestadores.', 'danger')
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated


# ===================================================================
# HELPERS
# ===================================================================
def _get_jornada_activa(id_usuario):
    """Devuelve fila de jornada en progreso, o None."""
    query = """
        SELECT TOP 1 id_jornada, fecha_inicio, ciudad, estado_geo
        FROM JORNADAS_ENCUESTADOR
        WHERE id_usuario = ? AND estado = 'En Progreso'
        ORDER BY id_jornada DESC
    """
    return execute_query(query, (id_usuario,), fetch_one=True)


def _get_encuesta_abierta(id_jornada):
    """Devuelve la encuesta de centro que aún esté Abierta en la jornada."""
    query = """
        SELECT TOP 1 ec.id_encuesta, ec.id_centro, cs.nombre_centro, cs.ciudad,
                     cs.estado, ec.fecha_verificacion, ec.fuente_informacion
        FROM encuestas_centro ec
        JOIN centros_salud cs ON cs.id_centro = ec.id_centro
        WHERE ec.id_jornada = ? AND ec.estado = 'Abierta'
        ORDER BY ec.id_encuesta DESC
    """
    return execute_query(query, (id_jornada,), fetch_one=True)


def _contar_medicos_jornada(id_jornada):
    r = execute_query("""
        SELECT COUNT(*) FROM medico_centro_encuesta mce
        JOIN encuestas_centro ec ON ec.id_encuesta = mce.id_encuesta
        WHERE ec.id_jornada = ?
    """, (id_jornada,), fetch_one=True)
    return r if isinstance(r, int) else (r[0] if r else 0)


def _contar_centros_jornada(id_jornada):
    r = execute_query("""
        SELECT COUNT(DISTINCT id_centro) FROM encuestas_centro WHERE id_jornada = ?
    """, (id_jornada,), fetch_one=True)
    return r if isinstance(r, int) else (r[0] if r else 0)


# ===================================================================
# PÁGINAS
# ===================================================================
@encuestador_bp.route('/')
@encuestador_bp.route('/dashboard')
@login_required
@verificar_rol_encuestador
def dashboard():
    """Home del encuestador: jornada actual + KPIs del día."""
    return render_template('encuestador_dashboard.html', username=current_user.username)


@encuestador_bp.route('/centro')
@login_required
@verificar_rol_encuestador
def centro_page():
    """Pantalla de gestión del centro (selección + agregar médicos)."""
    return render_template('encuestador_centro.html', username=current_user.username)


# ===================================================================
# JORNADA
# ===================================================================
@encuestador_bp.route('/api/jornada-activa')
@login_required
@verificar_rol_encuestador
def api_jornada_activa():
    try:
        j = _get_jornada_activa(current_user.id)
        if not j:
            return jsonify({"success": True, "activa": False})
        return jsonify({
            "success": True,
            "activa": True,
            "id_jornada": j[0],
            "fecha_inicio": j[1].isoformat() if j[1] else None,
            "ciudad": j[2],
            "estado_geo": j[3],
            "medicos_registrados": _contar_medicos_jornada(j[0]),
            "centros_visitados": _contar_centros_jornada(j[0])
        })
    except Exception as e:
        current_app.logger.error(f"Error jornada_activa encuestador: {e}\n{traceback.format_exc()}")
        return jsonify({"success": False, "message": str(e)}), 500


@encuestador_bp.route('/api/activar-jornada', methods=['POST'])
@login_required
@verificar_rol_encuestador
def api_activar_jornada():
    try:
        j = _get_jornada_activa(current_user.id)
        if j:
            return jsonify({"success": True, "id_jornada": j[0], "ya_activa": True})

        data = request.get_json(silent=True) or {}
        lat = data.get('latitud')
        lon = data.get('longitud')
        ciudad = (data.get('ciudad') or '').strip() or None
        estado_geo = (data.get('estado_geo') or '').strip() or None
        try:
            lat = float(lat) if lat not in (None, '') else None
            lon = float(lon) if lon not in (None, '') else None
        except (TypeError, ValueError):
            lat, lon = None, None

        execute_query(
            """INSERT INTO JORNADAS_ENCUESTADOR
               (id_usuario, fecha_inicio, estado, latitud, longitud, ciudad, estado_geo)
               VALUES (?, GETDATE(), 'En Progreso', ?, ?, ?, ?)""",
            (current_user.id, lat, lon, ciudad, estado_geo),
            commit=True
        )
        j = _get_jornada_activa(current_user.id)
        if not j:
            return jsonify({"success": False, "message": "No se pudo crear la jornada"}), 500
        return jsonify({"success": True, "id_jornada": j[0],
                        "fecha_inicio": j[1].isoformat() if j[1] else None})
    except Exception as e:
        current_app.logger.error(f"Error activar_jornada encuestador: {e}\n{traceback.format_exc()}")
        return jsonify({"success": False, "message": str(e)}), 500


@encuestador_bp.route('/api/finalizar-jornada', methods=['POST'])
@login_required
@verificar_rol_encuestador
def api_finalizar_jornada():
    try:
        # Cerrar encuestas que pudieran haber quedado abiertas
        execute_query("""
            UPDATE encuestas_centro
            SET estado = 'Cerrada'
            WHERE estado = 'Abierta'
              AND id_jornada IN (SELECT id_jornada FROM JORNADAS_ENCUESTADOR
                                 WHERE id_usuario = ? AND estado = 'En Progreso')
        """, (current_user.id,), commit=True)

        execute_query("""
            UPDATE JORNADAS_ENCUESTADOR
            SET estado = 'Finalizada', fecha_fin = GETDATE()
            WHERE id_usuario = ? AND estado = 'En Progreso'
        """, (current_user.id,), commit=True)
        return jsonify({"success": True, "message": "Jornada finalizada"})
    except Exception as e:
        current_app.logger.error(f"Error finalizar_jornada encuestador: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


# ===================================================================
# CENTROS DE SALUD
# ===================================================================
@encuestador_bp.route('/api/centros')
@login_required
@verificar_rol_encuestador
def api_centros_list():
    """Lista/busca centros de salud."""
    try:
        q = (request.args.get('q') or '').strip()
        if q:
            query = """
                SELECT TOP 50 id_centro, nombre_centro, direccion_completa, ciudad, estado
                FROM centros_salud
                WHERE nombre_centro LIKE ? OR ciudad LIKE ? OR estado LIKE ?
                ORDER BY nombre_centro
            """
            like = f"%{q}%"
            rows = execute_query(query, (like, like, like)) or []
        else:
            rows = execute_query("""
                SELECT TOP 100 id_centro, nombre_centro, direccion_completa, ciudad, estado
                FROM centros_salud ORDER BY nombre_centro
            """) or []

        return jsonify({"success": True, "centros": [{
            "id_centro": r[0], "nombre_centro": r[1],
            "direccion_completa": r[2], "ciudad": r[3], "estado": r[4]
        } for r in rows]})
    except Exception as e:
        current_app.logger.error(f"Error api_centros_list: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


@encuestador_bp.route('/api/centros', methods=['POST'])
@login_required
@verificar_rol_encuestador
def api_centros_create():
    """Crear un nuevo centro."""
    try:
        data = request.get_json() or {}
        nombre = (data.get('nombre_centro') or '').strip()
        direccion = (data.get('direccion_completa') or '').strip()
        ciudad = (data.get('ciudad') or '').strip() or None
        estado = (data.get('estado') or '').strip() or None
        if not nombre or not direccion:
            return jsonify({"success": False, "message": "nombre_centro y direccion_completa son requeridos"}), 400

        execute_query("""
            INSERT INTO centros_salud (nombre_centro, direccion_completa, ciudad, estado)
            VALUES (?, ?, ?, ?)
        """, (nombre, direccion, ciudad, estado), commit=True)

        new_id = execute_query("SELECT TOP 1 id_centro FROM centros_salud ORDER BY id_centro DESC",
                               fetch_one=True)
        return jsonify({"success": True, "id_centro": new_id, "nombre_centro": nombre,
                        "ciudad": ciudad, "estado": estado, "direccion_completa": direccion})
    except Exception as e:
        current_app.logger.error(f"Error api_centros_create: {e}\n{traceback.format_exc()}")
        return jsonify({"success": False, "message": str(e)}), 500


# ===================================================================
# ENCUESTAS DEL CENTRO
# ===================================================================
@encuestador_bp.route('/api/encuesta-abierta')
@login_required
@verificar_rol_encuestador
def api_encuesta_abierta():
    """Devuelve la encuesta de centro abierta en la jornada activa, si la hay."""
    try:
        j = _get_jornada_activa(current_user.id)
        if not j:
            return jsonify({"success": True, "tiene_encuesta": False, "jornada_activa": False})
        e = _get_encuesta_abierta(j[0])
        if not e:
            return jsonify({"success": True, "tiene_encuesta": False, "jornada_activa": True,
                            "id_jornada": j[0]})

        # Médicos ya cargados en esta encuesta
        meds = execute_query("""
            SELECT m.id_medico_externo, m.apellido1, m.apellido2, m.nombre1, m.nombre2,
                   m.especialidad, mce.valor_consulta_rango, mce.promedio_pacientes_semanal_rango,
                   mce.id_medico_centro
            FROM medico_centro_encuesta mce
            JOIN medicos m ON m.id_medico = mce.id_medico
            WHERE mce.id_encuesta = ?
            ORDER BY mce.id_medico_centro DESC
        """, (e[0],)) or []

        return jsonify({
            "success": True, "tiene_encuesta": True, "jornada_activa": True,
            "id_jornada": j[0], "id_encuesta": e[0], "id_centro": e[1],
            "nombre_centro": e[2], "ciudad": e[3], "estado": e[4],
            "fecha_verificacion": e[5].isoformat() if e[5] else None,
            "fuente_informacion": e[6],
            "medicos": [{
                "id_medico_centro": m[8], "id_medico_externo": m[0],
                "apellido1": m[1], "apellido2": m[2], "nombre1": m[3], "nombre2": m[4],
                "especialidad": m[5], "valor_consulta_rango": m[6],
                "promedio_pacientes_semanal_rango": m[7]
            } for m in meds]
        })
    except Exception as e:
        current_app.logger.error(f"Error api_encuesta_abierta: {e}\n{traceback.format_exc()}")
        return jsonify({"success": False, "message": str(e)}), 500


@encuestador_bp.route('/api/encuestas', methods=['POST'])
@login_required
@verificar_rol_encuestador
def api_encuesta_crear():
    """Abre una encuesta de centro dentro de la jornada activa."""
    try:
        j = _get_jornada_activa(current_user.id)
        if not j:
            return jsonify({"success": False, "message": "Debes activar una jornada primero"}), 400

        # Si ya hay una abierta, devolverla en vez de crear otra
        existente = _get_encuesta_abierta(j[0])
        if existente:
            return jsonify({"success": False,
                            "message": "Ya tienes una encuesta abierta. Ciérrala antes de iniciar otra.",
                            "id_encuesta": existente[0]}), 409

        data = request.get_json() or {}
        id_centro = data.get('id_centro')
        fuente = (data.get('fuente_informacion') or 'Visita presencial').strip()
        notas = (data.get('notas_generales') or '').strip() or None
        if not id_centro:
            return jsonify({"success": False, "message": "id_centro es requerido"}), 400

        execute_query("""
            INSERT INTO encuestas_centro
                (id_usuario, id_centro, id_jornada, fecha_verificacion, fuente_informacion,
                 notas_generales, estado)
            VALUES (?, ?, ?, CAST(GETDATE() AS DATE), ?, ?, 'Abierta')
        """, (current_user.id, id_centro, j[0], fuente, notas), commit=True)

        new_id = execute_query("SELECT TOP 1 id_encuesta FROM encuestas_centro ORDER BY id_encuesta DESC",
                               fetch_one=True)
        return jsonify({"success": True, "id_encuesta": new_id, "id_jornada": j[0]})
    except Exception as e:
        current_app.logger.error(f"Error api_encuesta_crear: {e}\n{traceback.format_exc()}")
        return jsonify({"success": False, "message": str(e)}), 500


@encuestador_bp.route('/api/encuestas/<int:id_encuesta>/cerrar', methods=['POST'])
@login_required
@verificar_rol_encuestador
def api_encuesta_cerrar(id_encuesta):
    try:
        execute_query("""
            UPDATE encuestas_centro SET estado = 'Cerrada'
            WHERE id_encuesta = ? AND id_usuario = ?
        """, (id_encuesta, current_user.id), commit=True)
        return jsonify({"success": True})
    except Exception as e:
        current_app.logger.error(f"Error api_encuesta_cerrar: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


# ===================================================================
# MÉDICOS (catálogo) + REGISTRO EN ENCUESTA
# ===================================================================
@encuestador_bp.route('/api/medicos/buscar')
@login_required
@verificar_rol_encuestador
def api_medicos_buscar():
    """Busca un médico por id_medico_externo o por apellido/nombre."""
    try:
        q = (request.args.get('q') or '').strip()
        if not q:
            return jsonify({"success": True, "medicos": []})

        like = f"%{q}%"
        rows = execute_query("""
            SELECT TOP 25 id_medico, id_medico_externo, apellido1, apellido2, nombre1, nombre2,
                          especialidad, sub_especialidad, universidad_graduacion,
                          nro_MPPS, nro_colegiado, ciudad, estado, telefono, whatsapp, email,
                          linkedin, instagram
            FROM medicos
            WHERE id_medico_externo LIKE ?
               OR apellido1 LIKE ? OR apellido2 LIKE ?
               OR nombre1 LIKE ? OR nombre2 LIKE ?
            ORDER BY apellido1, nombre1
        """, (like, like, like, like, like)) or []

        return jsonify({"success": True, "medicos": [{
            "id_medico": r[0], "id_medico_externo": r[1],
            "apellido1": r[2], "apellido2": r[3], "nombre1": r[4], "nombre2": r[5],
            "especialidad": r[6], "sub_especialidad": r[7],
            "universidad_graduacion": r[8], "nro_MPPS": r[9], "nro_colegiado": r[10],
            "ciudad": r[11], "estado": r[12], "telefono": r[13], "whatsapp": r[14],
            "email": r[15], "linkedin": r[16], "instagram": r[17]
        } for r in rows]})
    except Exception as e:
        current_app.logger.error(f"Error api_medicos_buscar: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


@encuestador_bp.route('/api/medico-centro', methods=['POST'])
@login_required
@verificar_rol_encuestador
def api_medico_centro_save():
    """
    Agrega un médico a la encuesta abierta del centro.
    - Si data.id_medico viene → usa ese médico.
    - Si no → crea el médico en la tabla `medicos` y luego usa el id generado.
    """
    try:
        data = request.get_json() or {}

        # Validar encuesta abierta
        j = _get_jornada_activa(current_user.id)
        if not j:
            return jsonify({"success": False, "message": "No tienes jornada activa"}), 400
        e = _get_encuesta_abierta(j[0])
        if not e:
            return jsonify({"success": False, "message": "No tienes encuesta abierta"}), 400
        id_encuesta = e[0]

        # ── 1) Resolver / crear el médico ────────────────────────────
        id_medico = data.get('id_medico')
        if not id_medico:
            req = ['id_medico_externo', 'apellido1', 'nombre1', 'especialidad', 'ciudad', 'estado']
            for f in req:
                if not data.get(f):
                    return jsonify({"success": False,
                                    "message": f"Campo de médico obligatorio: {f}"}), 400

            # Si ya existe por id_medico_externo, reusar
            existing = execute_query(
                "SELECT id_medico FROM medicos WHERE id_medico_externo = ?",
                (data['id_medico_externo'],), fetch_one=True
            )
            if existing:
                id_medico = existing if isinstance(existing, int) else existing[0]
            else:
                execute_query("""
                    INSERT INTO medicos (
                        id_medico_externo, apellido1, apellido2, nombre1, nombre2,
                        especialidad, sub_especialidad, universidad_graduacion,
                        nro_MPPS, nro_colegiado, ciudad, estado,
                        telefono, whatsapp, email, linkedin, instagram
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    data['id_medico_externo'], data['apellido1'], data.get('apellido2'),
                    data['nombre1'], data.get('nombre2'),
                    data['especialidad'], data.get('sub_especialidad'),
                    data.get('universidad_graduacion'),
                    data.get('nro_MPPS'), data.get('nro_colegiado'),
                    data['ciudad'], data['estado'],
                    data.get('telefono'), data.get('whatsapp'), data.get('email'),
                    data.get('linkedin'), data.get('instagram')
                ), commit=True)
                id_medico = execute_query(
                    "SELECT TOP 1 id_medico FROM medicos ORDER BY id_medico DESC",
                    fetch_one=True
                )

        # ── 2) Evitar duplicado del mismo médico en la misma encuesta ─
        dup = execute_query(
            "SELECT id_medico_centro FROM medico_centro_encuesta WHERE id_encuesta = ? AND id_medico = ?",
            (id_encuesta, id_medico), fetch_one=True
        )
        if dup:
            return jsonify({"success": False,
                            "message": "Este médico ya fue registrado en esta encuesta del centro."}), 409

        # ── 3) Validar campos obligatorios del cruce centro/encuesta ─
        valor = (data.get('valor_consulta_rango') or '').strip()
        promedio = (data.get('promedio_pacientes_semanal_rango') or '').strip()
        if not valor or not promedio:
            return jsonify({"success": False,
                            "message": "valor_consulta_rango y promedio_pacientes_semanal_rango son obligatorios"}), 400

        execute_query("""
            INSERT INTO medico_centro_encuesta (
                id_encuesta, id_medico,
                piso_consultorio, horarios_consulta, dias_consulta, direccion_especifica,
                clinica2_nombre, piso_consultorio2, horarios_consulta2, dias_consulta2,
                direccion_especifica2,
                valor_consulta_rango, promedio_pacientes_semanal_rango
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            id_encuesta, id_medico,
            data.get('piso_consultorio'), data.get('horarios_consulta'),
            data.get('dias_consulta'), data.get('direccion_especifica'),
            data.get('clinica2_nombre'), data.get('piso_consultorio2'),
            data.get('horarios_consulta2'), data.get('dias_consulta2'),
            data.get('direccion_especifica2'),
            valor, promedio
        ), commit=True)

        # Contar médicos en la encuesta
        cnt = execute_query(
            "SELECT COUNT(*) FROM medico_centro_encuesta WHERE id_encuesta = ?",
            (id_encuesta,), fetch_one=True
        )
        return jsonify({"success": True, "id_medico": id_medico,
                        "id_encuesta": id_encuesta,
                        "medicos_en_centro": cnt if isinstance(cnt, int) else (cnt[0] if cnt else 0)})

    except Exception as e:
        current_app.logger.error(f"Error api_medico_centro_save: {e}\n{traceback.format_exc()}")
        return jsonify({"success": False, "message": str(e)}), 500


# ===================================================================
# ENUMS / CATÁLOGOS para los <select>
# ===================================================================
@encuestador_bp.route('/api/catalogos')
@login_required
@verificar_rol_encuestador
def api_catalogos():
    """Devuelve los rangos y enums fijos del formulario."""
    return jsonify({
        "valor_consulta_rangos": [
            "Menos de 30$", "Entre 30$ a 50$", "Entre 50$ a 60$",
            "Entre 60$ a 100$", "Más de 100$"
        ],
        "promedio_pacientes_rangos": [
            "1 a 5 pacientes", "6 a 10 pacientes", "11 a 15 pacientes",
            "16 a 20 pacientes", "21 a 30 pacientes", "Más de 30 pacientes"
        ],
        "fuentes_informacion": [
            "Visita presencial", "Llamada telefónica", "Referencia",
            "Página web del centro", "Redes sociales", "Otra"
        ],
        "dias_consulta": ["Lunes", "Martes", "Miércoles", "Jueves",
                          "Viernes", "Sábado", "Domingo"]
    })
