# app/routes/vendedor.py
"""
Módulo Vendedor.

Flujo:
  1. El vendedor inicia sesión (USUARIOS con id_rol = 9).
  2. Pulsa "Activación de Ruta" → se abre una jornada ("salir a trabajar hoy").
  3. Ve todos los PDV de PUNTOS_INTERES1 (con buscador).
  4. Elige un PDV → ve todos los clientes de CLIENTES (con buscador).
  5. Elige un cliente → ¿vendió? Sí → monto / No → razón.
  6. Cada registro queda en VENDEDOR_VISITAS asociado a la jornada.
"""
from flask import (Blueprint, render_template, request, jsonify,
                   redirect, url_for, flash, current_app)
from flask_login import login_required, current_user
from functools import wraps
import json
from app.utils.database import execute_query
from app.utils.auth import get_user_id_by_username

vendedor_bp = Blueprint('vendedor', __name__, url_prefix='/vendedor')


# ===================================================================
# DECORADOR DE ROL — solo Vendedor (id_rol = 9)
# ===================================================================
def verificar_rol_vendedor(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        es_api = request.path.startswith('/vendedor/api/')
        if not current_user.is_authenticated:
            if es_api:
                return jsonify({"success": False, "message": "No autorizado"}), 401
            flash('Debes iniciar sesión primero', 'warning')
            return redirect(url_for('auth.login'))
        if getattr(current_user, 'id_rol', None) != 9:
            if es_api:
                return jsonify({"success": False, "message": "Acceso no autorizado"}), 403
            flash('Acceso no autorizado. Solo para Vendedores.', 'danger')
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated


# ===================================================================
# HELPERS
# ===================================================================
def _get_jornada_activa(id_usuario):
    """Devuelve (id_jornada, fecha_inicio) de la jornada en progreso, o None."""
    query = """
        SELECT TOP 1 id_jornada, fecha_inicio
        FROM VENDEDOR_JORNADAS
        WHERE id_usuario = ? AND estado = 'En Progreso'
        ORDER BY id_jornada DESC
    """
    return execute_query(query, (id_usuario,), fetch_one=True)


def _contar_visitas(id_jornada):
    r = execute_query("SELECT COUNT(*) FROM VENDEDOR_VISITAS WHERE id_jornada = ?",
                      (id_jornada,), fetch_one=True)
    if r is None:
        return 0
    return r if isinstance(r, int) else r[0]


# ===================================================================
# PÁGINA
# ===================================================================
@vendedor_bp.route('/')
@vendedor_bp.route('/dashboard')
@login_required
@verificar_rol_vendedor
def dashboard():
    return render_template('vendedor_dashboard.html', username=current_user.username)


# ===================================================================
# JORNADA ("Activación de Ruta")
# ===================================================================
@vendedor_bp.route('/api/jornada-activa')
@login_required
@verificar_rol_vendedor
def jornada_activa():
    try:
        j = _get_jornada_activa(current_user.id)
        if not j:
            return jsonify({"success": True, "activa": False})
        return jsonify({
            "success": True,
            "activa": True,
            "id_jornada": j[0],
            "fecha_inicio": j[1].isoformat() if j[1] else None,
            "visitas": _contar_visitas(j[0])
        })
    except Exception as e:
        current_app.logger.error(f"Error en jornada_activa: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


@vendedor_bp.route('/api/activar-jornada', methods=['POST'])
@login_required
@verificar_rol_vendedor
def activar_jornada():
    try:
        # Idempotente: si ya hay una jornada abierta, se devuelve esa.
        j = _get_jornada_activa(current_user.id)
        if j:
            return jsonify({"success": True, "id_jornada": j[0],
                            "fecha_inicio": j[1].isoformat() if j[1] else None,
                            "ya_activa": True})

        execute_query(
            """INSERT INTO VENDEDOR_JORNADAS (id_usuario, fecha_inicio, estado)
               VALUES (?, GETDATE(), 'En Progreso')""",
            (current_user.id,), commit=True
        )
        j = _get_jornada_activa(current_user.id)
        if not j:
            return jsonify({"success": False, "message": "No se pudo crear la jornada"}), 500
        return jsonify({"success": True, "id_jornada": j[0],
                        "fecha_inicio": j[1].isoformat() if j[1] else None})
    except Exception as e:
        current_app.logger.error(f"Error en activar_jornada: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


@vendedor_bp.route('/api/finalizar-jornada', methods=['POST'])
@login_required
@verificar_rol_vendedor
def finalizar_jornada():
    try:
        execute_query(
            """UPDATE VENDEDOR_JORNADAS
               SET estado = 'Finalizada', fecha_fin = GETDATE()
               WHERE id_usuario = ? AND estado = 'En Progreso'""",
            (current_user.id,), commit=True
        )
        return jsonify({"success": True, "message": "Jornada finalizada"})
    except Exception as e:
        current_app.logger.error(f"Error en finalizar_jornada: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


# ===================================================================
# CATÁLOGOS
# ===================================================================
@vendedor_bp.route('/api/pdvs')
@login_required
@verificar_rol_vendedor
def get_pdvs():
    """Todos los puntos de interés."""
    try:
        query = """
            SELECT identificador, punto_de_interes, Direccion, ciudad, localidad
            FROM PUNTOS_INTERES1
            ORDER BY punto_de_interes
        """
        rows = execute_query(query) or []
        return jsonify([{
            "identificador": r[0],
            "nombre": r[1],
            "direccion": r[2],
            "ciudad": r[3],
            "localidad": r[4]
        } for r in rows])
    except Exception as e:
        current_app.logger.error(f"Error en get_pdvs (vendedor): {e}")
        return jsonify({"error": str(e)}), 500


@vendedor_bp.route('/api/clientes')
@login_required
@verificar_rol_vendedor
def get_clientes():
    """Todos los clientes."""
    try:
        rows = execute_query("SELECT id_cliente, cliente FROM CLIENTES ORDER BY cliente") or []
        return jsonify([{"id_cliente": r[0], "nombre": r[1]} for r in rows])
    except Exception as e:
        current_app.logger.error(f"Error en get_clientes (vendedor): {e}")
        return jsonify({"error": str(e)}), 500


# ===================================================================
# REGISTRO DE VISITA (¿vendió? → monto / razón)
# ===================================================================
@vendedor_bp.route('/api/registrar-visita', methods=['POST'])
@login_required
@verificar_rol_vendedor
def registrar_visita():
    try:
        data = request.get_json() or {}
        id_punto_interes = data.get('id_punto_interes')
        id_cliente = data.get('id_cliente')
        vendio = data.get('vendio')

        if not id_punto_interes or not id_cliente or vendio is None:
            return jsonify({"success": False, "message": "Datos incompletos"}), 400

        vendio_bit = 1 if vendio in (True, 1, '1', 'true', 'True') else 0
        monto = None
        razon = None

        if vendio_bit == 1:
            try:
                monto = float(data.get('monto'))
            except (TypeError, ValueError):
                return jsonify({"success": False,
                                "message": "El monto es requerido y debe ser numérico"}), 400
            if monto <= 0:
                return jsonify({"success": False,
                                "message": "El monto debe ser mayor que cero"}), 400
        else:
            razon = (data.get('razon_no_venta') or '').strip()
            if not razon:
                return jsonify({"success": False,
                                "message": "La razón de no venta es requerida"}), 400

        # La visita se ata a la jornada activa (no se confía en el cliente).
        j = _get_jornada_activa(current_user.id)
        if not j:
            return jsonify({"success": False,
                            "message": "No tienes una jornada activa. Activa tu ruta primero."}), 400
        id_jornada = j[0]

        # GPS opcional
        lat = data.get('latitud')
        lon = data.get('longitud')
        try:
            lat = float(lat) if lat not in (None, '') else None
            lon = float(lon) if lon not in (None, '') else None
        except (TypeError, ValueError):
            lat, lon = None, None

        execute_query(
            """INSERT INTO VENDEDOR_VISITAS
               (id_jornada, id_usuario, id_punto_interes, id_cliente, fecha_hora,
                vendio, monto, razon_no_venta, latitud, longitud)
               VALUES (?, ?, ?, ?, GETDATE(), ?, ?, ?, ?, ?)""",
            (id_jornada, current_user.id, str(id_punto_interes), id_cliente,
             vendio_bit, monto, razon, lat, lon),
            commit=True
        )
        return jsonify({"success": True, "message": "Visita registrada",
                        "visitas": _contar_visitas(id_jornada)})
    except Exception as e:
        current_app.logger.error(f"Error en registrar_visita: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


@vendedor_bp.route('/api/solicitar-pdv', methods=['POST'])
@login_required
@verificar_rol_vendedor
def solicitar_pdv():
    """El vendedor solicita la creación de un nuevo PDV ("registro de cliente
    único"). La solicitud queda como 'creacion_pdv' en SOLICITUDES para que el
    equipo de Atención al Cliente la apruebe (completando los datos faltantes) o
    la rechace. Las fotos llegan como data URL base64 y se guardan dentro del
    JSON de la solicitud para que ATC pueda revisarlas."""
    try:
        data = request.get_json() or {}
        nombre    = (data.get('punto_de_interes') or '').strip()
        rif       = (data.get('rif') or '').strip()
        direccion = (data.get('direccion') or '').strip()
        foto_tienda = data.get('foto_tienda')   # data URL base64
        foto_rif    = data.get('foto_rif')      # data URL base64

        faltan = []
        if not nombre:      faltan.append('nombre del PDV')
        if not rif:         faltan.append('RIF')
        if not direccion:   faltan.append('dirección')
        if not foto_tienda: faltan.append('foto de la tienda')
        if not foto_rif:    faltan.append('foto del RIF')
        if faltan:
            return jsonify({"success": False,
                            "message": "Faltan datos: " + ", ".join(faltan)}), 400

        # GPS opcional (si el dispositivo lo entrega). ATC podrá ajustarlo.
        lat = data.get('latitud')
        lon = data.get('longitud')
        try:
            lat = float(lat) if lat not in (None, '') else None
            lon = float(lon) if lon not in (None, '') else None
        except (TypeError, ValueError):
            lat, lon = None, None

        datos = {
            "punto_de_interes": nombre,
            "rif": rif,
            "direccion": direccion,
            "latitud": lat,
            "longitud": lon,
            "foto_tienda": foto_tienda,
            "foto_rif": foto_rif,
        }
        solicitante_id = get_user_id_by_username(current_user.username)
        execute_query(
            """INSERT INTO SOLICITUDES (tipo_solicitud, datos, estado, id_solicitante)
               VALUES ('creacion_pdv', ?, 'pendiente', ?)""",
            (json.dumps(datos), solicitante_id), commit=True
        )
        return jsonify({"success": True,
                        "message": "Solicitud de creación de PDV enviada. "
                                   "Espera la aprobación de Atención al Cliente."})
    except Exception as e:
        current_app.logger.error(f"Error en solicitar_pdv: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


@vendedor_bp.route('/api/visitas-hoy')
@login_required
@verificar_rol_vendedor
def visitas_hoy():
    """Visitas registradas en la jornada activa."""
    try:
        j = _get_jornada_activa(current_user.id)
        if not j:
            return jsonify({"success": True, "visitas": []})
        query = """
            SELECT vv.fecha_hora, vv.vendio, vv.monto, vv.razon_no_venta,
                   pin.punto_de_interes, c.cliente
            FROM VENDEDOR_VISITAS vv
            LEFT JOIN PUNTOS_INTERES1 pin ON pin.identificador = vv.id_punto_interes
            LEFT JOIN CLIENTES c ON c.id_cliente = vv.id_cliente
            WHERE vv.id_jornada = ?
            ORDER BY vv.id_visita_vendedor DESC
        """
        rows = execute_query(query, (j[0],)) or []
        return jsonify({
            "success": True,
            "visitas": [{
                "fecha_hora": r[0].isoformat() if r[0] else None,
                "vendio": bool(r[1]),
                "monto": float(r[2]) if r[2] is not None else None,
                "razon_no_venta": r[3],
                "pdv": r[4],
                "cliente": r[5]
            } for r in rows]
        })
    except Exception as e:
        current_app.logger.error(f"Error en visitas_hoy: {e}")
        return jsonify({"success": False, "message": str(e)}), 500
