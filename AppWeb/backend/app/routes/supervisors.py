# app/routes/supervisors.py

from flask import Blueprint, jsonify, request, render_template, current_app
from flask_login import login_required, current_user
from app.utils.database import execute_query
import os, uuid, urllib
from datetime import datetime, date
from werkzeug.utils import secure_filename

supervisors_bp = Blueprint('supervisors', __name__)


@supervisors_bp.route('/')
@login_required
def supervisor_dashboard():
    """Página principal del módulo de supervisor"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    return render_template('supervisor.html')


@supervisors_bp.route('/notificaciones')
@login_required
def supervisor_notificaciones():
    """Página de notificaciones para supervisor"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    return render_template('supervisor_notificaciones.html')


def _parse_fechas(request_args):
    """
    Extrae y valida fecha_inicio y fecha_fin del query string.
    Por defecto ambos son hoy.
    """
    hoy = date.today().strftime('%Y-%m-%d')
    fecha_inicio_str = request_args.get('fecha_inicio', hoy)
    fecha_fin_str    = request_args.get('fecha_fin',    hoy)

    try:
        datetime.strptime(fecha_inicio_str, '%Y-%m-%d')
        datetime.strptime(fecha_fin_str,    '%Y-%m-%d')
    except ValueError:
        fecha_inicio_str = hoy
        fecha_fin_str    = hoy

    return fecha_inicio_str, fecha_fin_str


def _clean_photo_row_rechazadas(row):
    """Convierte una fila de rechazadas al dict estándar."""
    cleaned_path = row[1].replace("X://", "").replace("X:/", "").replace("\\", "/")
    if cleaned_path.startswith("/"):
        cleaned_path = cleaned_path[1:]

    def fmt_fecha(val):
        if val is None:
            return "N/A"
        try:
            return val.strftime("%d/%m/%Y %H:%M")
        except Exception:
            return str(val)

    razon = row[10] if row[10] else "Otra razón"
    if row[11] and row[11].strip() and "Otra razón" not in razon:
        razon += f": {row[11]}"

    punto_interes = row[4]
    if not punto_interes or (len(punto_interes) <= 10 and any(c.isdigit() for c in punto_interes)):
        punto_interes = row[5].strip() if row[5] and row[5].strip() else f"Punto {row[4] or 'desconocido'}"

    return {
        "id_foto":          row[0],
        "file_path":        cleaned_path,
        "categoria":        row[2] or "Sin categoría",
        "fecha_visita":     row[3].strftime("%d/%m/%Y") if row[3] else "N/A",
        "punto_de_interes": punto_interes,
        "direccion":        row[5] or "",
        "cliente":          row[6],
        "ruta":             row[7],
        "fecha_registro":   fmt_fecha(row[8]),
        "fecha_rechazo":    fmt_fecha(row[9]),
        "razon_rechazo":    razon,
        "mercaderista":     row[12],
        "analista_rechazo": row[13] or "N/A",
        "estado":           "Rechazada",
    }


def _clean_photo_row_other(row, estado_db):
    """Convierte una fila de estados distintos a rechazadas al dict estándar."""
    cleaned_path = row[1].replace("X://", "").replace("X:/", "").replace("\\", "/")
    if cleaned_path.startswith("/"):
        cleaned_path = cleaned_path[1:]

    def fmt_fecha(val):
        if val is None:
            return "N/A"
        try:
            return val.strftime("%d/%m/%Y %H:%M")
        except Exception:
            return str(val)

    punto_interes = row[4]
    if not punto_interes or (len(punto_interes) <= 10 and any(c.isdigit() for c in punto_interes)):
        punto_interes = row[5].strip() if row[5] and row[5].strip() else f"Punto {row[4] or 'desconocido'}"

    return {
        "id_foto":          row[0],
        "file_path":        cleaned_path,
        "categoria":        row[2] or "Sin categoría",
        "fecha_visita":     row[3].strftime("%d/%m/%Y") if row[3] else "N/A",
        "punto_de_interes": punto_interes,
        "direccion":        row[5] or "",
        "cliente":          row[6],
        "ruta":             row[7],
        "fecha_registro":   fmt_fecha(row[8]),
        "fecha_rechazo":    "N/A",
        "razon_rechazo":    None,
        "mercaderista":     row[12],
        "analista_rechazo": row[13] or "N/A",
        "estado":           row[14] if len(row) > 14 and row[14] else estado_db,
    }


@supervisors_bp.route('/api/supervisor-photos/<string:estado>')
@login_required
def get_supervisor_photos(estado):
    """
    Devuelve fotos filtradas por:
      - Rutas del supervisor  (via SUPERVISORES_RUTAS)
      - Clientes del supervisor (via SUPERVISORES_CLIENTE)
      - Estado de la foto
      - Rango de fechas de visita (fecha_inicio / fecha_fin, default hoy)

    Query params:
        fecha_inicio=YYYY-MM-DD  (default hoy)
        fecha_fin=YYYY-MM-DD     (default hoy)
    """
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403

    estado_map = {
        'rechazadas':  'Rechazada',
        'aprobada':    'Aprobada',
        'pendiente':   'Pendiente',
        'no revisado': 'No Revisado',
    }
    if estado not in estado_map:
        return jsonify({"error": "Estado no válido"}), 400

    estado_db = estado_map[estado]
    supervisor_id = current_user.id_supervisor
    fecha_inicio, fecha_fin = _parse_fechas(request.args)

    try:
        if estado == 'rechazadas':
            query = """
                SELECT DISTINCT
                    ft.id_foto,
                    ft.file_path,
                    ft.categoria,
                    vm.fecha_visita,
                    pin.punto_de_interes,
                    pin.Direccion,
                    c.cliente,
                    rn.ruta,
                    fr.fecha_registro,
                    fr.fecha_rechazo,
                    rr.razon,
                    fr.descripcion,
                    m.nombre         AS mercaderista,
                    a.nombre_analista
                FROM FOTOS_RECHAZADAS fr
                JOIN FOTOS_TOTALES           ft  ON fr.id_foto_original = ft.id_foto
                JOIN VISITAS_MERCADERISTA    vm  ON ft.id_visita = vm.id_visita
                JOIN PUNTOS_INTERES1         pin ON vm.identificador_punto_interes = pin.identificador
                JOIN RUTA_PROGRAMACION       rp  ON pin.identificador = rp.id_punto_interes
                JOIN RUTAS_NUEVAS            rn  ON rp.id_ruta = rn.id_ruta
                -- ✅ Filtro por rutas asignadas al supervisor
                JOIN SUPERVISORES_RUTAS      sr  ON sr.id_ruta = rn.id_ruta
                                                 AND sr.id_supervisor = ?
                JOIN CLIENTES                c   ON vm.id_cliente = c.id_cliente
                -- ✅ Filtro por clientes asignados al supervisor
                JOIN SUPERVISORES_CLIENTE    sc  ON sc.id_cliente = c.id_cliente
                                                 AND sc.id_supervisor = ?
                JOIN MERCADERISTAS           m   ON vm.id_mercaderista = m.id_mercaderista
                LEFT JOIN RAZONES_RECHAZOS   rr  ON fr.id_razones_rechazos = rr.id_razones_rechazos
                LEFT JOIN ANALISTAS          a   ON rn.id_analista = a.id_analista
                WHERE ft.estado = 'Rechazada'
                  AND CAST(vm.fecha_visita AS DATE) BETWEEN ? AND ?
                GROUP BY
                    ft.id_foto, ft.file_path, ft.categoria, vm.fecha_visita,
                    pin.punto_de_interes, pin.Direccion, c.cliente, rn.ruta,
                    fr.fecha_registro, fr.fecha_rechazo, rr.razon, fr.descripcion,
                    m.nombre, a.nombre_analista
                ORDER BY vm.fecha_visita DESC
            """
            params = (supervisor_id, supervisor_id, fecha_inicio, fecha_fin)

        else:
            query = """
                SELECT DISTINCT
                    ft.id_foto,
                    ft.file_path,
                    ft.categoria,
                    vm.fecha_visita,
                    pin.punto_de_interes,
                    pin.Direccion,
                    c.cliente,
                    rn.ruta,
                    ft.fecha_registro,
                    NULL  AS fecha_rechazo,
                    NULL  AS razon,
                    NULL  AS descripcion,
                    m.nombre         AS mercaderista,
                    a.nombre_analista,
                    ft.estado
                FROM FOTOS_TOTALES           ft
                JOIN VISITAS_MERCADERISTA    vm  ON ft.id_visita = vm.id_visita
                JOIN PUNTOS_INTERES1         pin ON vm.identificador_punto_interes = pin.identificador
                JOIN RUTA_PROGRAMACION       rp  ON pin.identificador = rp.id_punto_interes
                JOIN RUTAS_NUEVAS            rn  ON rp.id_ruta = rn.id_ruta
                -- ✅ Filtro por rutas asignadas al supervisor
                JOIN SUPERVISORES_RUTAS      sr  ON sr.id_ruta = rn.id_ruta
                                                 AND sr.id_supervisor = ?
                JOIN CLIENTES                c   ON vm.id_cliente = c.id_cliente
                -- ✅ Filtro por clientes asignados al supervisor
                JOIN SUPERVISORES_CLIENTE    sc  ON sc.id_cliente = c.id_cliente
                                                 AND sc.id_supervisor = ?
                JOIN MERCADERISTAS           m   ON vm.id_mercaderista = m.id_mercaderista
                LEFT JOIN ANALISTAS          a   ON rn.id_analista = a.id_analista
                WHERE ft.estado = ?
                  AND CAST(vm.fecha_visita AS DATE) BETWEEN ? AND ?
                GROUP BY
                    ft.id_foto, ft.file_path, ft.categoria, vm.fecha_visita,
                    pin.punto_de_interes, pin.Direccion, c.cliente, rn.ruta,
                    ft.fecha_registro, m.nombre, a.nombre_analista, ft.estado
                ORDER BY vm.fecha_visita DESC
            """
            params = (supervisor_id, supervisor_id, estado_db, fecha_inicio, fecha_fin)

        rows = execute_query(query, params)

        if estado == 'rechazadas':
            photos = [_clean_photo_row_rechazadas(r) for r in rows if len(r) >= 14]
        else:
            photos = [_clean_photo_row_other(r, estado_db) for r in rows]

        return jsonify(photos)

    except Exception as e:
        current_app.logger.error(f"Error en get_supervisor_photos: {e}", exc_info=True)
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500


@supervisors_bp.route('/api/replace-rejected-photo', methods=['POST'])
@login_required
def replace_rejected_photo():
    """Reemplazar una foto rechazada con una nueva foto"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403

    try:
        if 'photo' not in request.files:
            return jsonify({"success": False, "message": "No se ha seleccionado ninguna foto"}), 400

        photo    = request.files['photo']
        photo_id = request.form.get('photo_id')

        if not photo_id:
            return jsonify({"success": False, "message": "ID de foto requerido"}), 400
        if photo.filename == '':
            return jsonify({"success": False, "message": "Nombre de archivo vacío"}), 400

        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
        file_ext = photo.filename.rsplit('.', 1)[1].lower() if '.' in photo.filename else ''
        if file_ext not in allowed_extensions:
            return jsonify({"success": False, "message": "Formato de archivo no permitido"}), 400

        query = """
            SELECT ft.file_path, ft.id_visita, vm.identificador_punto_interes, vm.id_mercaderista
            FROM FOTOS_TOTALES ft
            JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
            WHERE ft.id_foto = ?
        """
        photo_info = execute_query(query, (photo_id,), fetch_one=True)
        if not photo_info:
            return jsonify({"success": False, "message": "Foto no encontrada"}), 404

        from azure.storage.blob import BlobServiceClient

        original_path = photo_info[0]
        clean_path = original_path.replace("X://", "").replace("X:/", "").replace("\\", "/")
        if clean_path.startswith("/"):
            clean_path = clean_path[1:]

        path_parts = clean_path.split("/")
        if len(path_parts) < 7:
            current_app.logger.error(f"❌ Formato de ruta no válido: {clean_path}")
            return jsonify({"success": False, "message": "Formato de ruta no válido"}), 500

        departamento = path_parts[0]
        ciudad       = path_parts[1]
        punto        = path_parts[2]
        cliente      = path_parts[3]
        fecha        = path_parts[4]
        categoria    = path_parts[5]

        connection_string = current_app.config.get('AZURE_STORAGE_CONNECTION_STRING')
        container_name    = current_app.config.get('AZURE_CONTAINER_NAME', 'epran')
        new_filename      = f"reemplazo_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex}.{file_ext}"
        blob_path         = f"{departamento}/{ciudad}/{punto}/{cliente}/{fecha}/{categoria}/{new_filename}"

        try:
            blob_service_client = BlobServiceClient.from_connection_string(connection_string)
            blob_client         = blob_service_client.get_blob_client(container=container_name, blob=blob_path)
            photo.seek(0)
            blob_client.upload_blob(photo, overwrite=True)
        except Exception as e:
            current_app.logger.error(f"❌ Error subiendo a Azure: {e}")
            return jsonify({"success": False, "message": f"Error al subir: {e}"}), 500

        execute_query(
            """
            UPDATE FOTOS_TOTALES
               SET file_path          = ?,
                   estado             = 'Rechazada',
                   veces_reemplazada  = ISNULL(veces_reemplazada, 0) + 1
             WHERE id_foto = ?
            """,
            (blob_path, photo_id),
            commit=True,
        )

        execute_query(
            "DELETE FROM FOTOS_RECHAZADAS WHERE id_foto_original = ?",
            (photo_id,),
            commit=True,
        )

        return jsonify({
            "success":   True,
            "message":   "Foto reemplazada exitosamente",
            "new_path":  blob_path,
            "image_url": f"/api/image/{urllib.parse.quote(blob_path)}",
        })

    except Exception as e:
        current_app.logger.error(f"Error reemplazando foto: {e}", exc_info=True)
        return jsonify({"success": False, "message": f"Error interno: {e}"}), 500