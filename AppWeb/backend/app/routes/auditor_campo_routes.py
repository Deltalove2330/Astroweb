# app/routes/auditor_campo_routes.py
# Módulo "Auditor de Campo" (rol 14, MERCADERISTAS.tipo='Auditor de Campo').
# Flujo: activar ruta -> PDV (foto activación) -> cliente -> por categoría:
#   fotos (N) + cuestionario (AUDITORIA_CATEGORIAS) + POP/promo/exhibición ->
#   otros clientes -> desactivar PDV -> desactivar ruta.
# Reutiliza helpers de foto/Azure de auditor_routes.
from flask import Blueprint, render_template, jsonify, session, redirect, url_for, flash, current_app, request
from flask_login import login_required, current_user
from datetime import datetime
from app.utils.database import execute_query
from app.routes.auditor_routes import extract_metadata_safe, safe_upload_to_azure

auditor_campo_bp = Blueprint('auditor_campo', __name__)

TIPO = 'Auditor de Campo'
DIAS = {0: 'Lunes', 1: 'Martes', 2: 'Miércoles', 3: 'Jueves', 4: 'Viernes', 5: 'Sábado', 6: 'Domingo'}


def _auditor_id(cedula):
    r = execute_query(
        "SELECT id_mercaderista FROM MERCADERISTAS WHERE LTRIM(RTRIM(cedula))=LTRIM(RTRIM(?)) AND tipo = ?",
        (cedula, TIPO), fetch_one=True)
    return r if isinstance(r, int) else (r[0] if r else None)


# ───────────────────────── Páginas ─────────────────────────
@auditor_campo_bp.route('/dashboard')
@login_required
def dashboard():
    cedula = current_user.username
    r = execute_query("SELECT nombre, cedula, tipo FROM MERCADERISTAS WHERE cedula = ?", (cedula,), fetch_one=True)
    if not r or r[2] != TIPO:
        flash('Acceso no autorizado', 'danger')
        return redirect(url_for('auth.login'))
    session['auditor_campo_name'] = r[0]
    session['auditor_campo_cedula'] = r[1]
    return render_template('auditor_campo_dashboard.html', nombre=r[0], cedula=r[1], tipo=r[2])


@auditor_campo_bp.route('/carga')
@login_required
def carga():
    cedula = current_user.username
    r = execute_query("SELECT tipo FROM MERCADERISTAS WHERE cedula = ?", (cedula,), fetch_one=True)
    tipo = r[0] if isinstance(r, (tuple, list)) else r
    if tipo != TIPO:
        flash('Acceso no autorizado', 'danger')
        return redirect(url_for('auditor_campo.dashboard'))
    return render_template('carga_auditor_campo.html', cedula=cedula)


# ───────────────────────── Rutas / PDVs ─────────────────────────
@auditor_campo_bp.route('/api/rutas/<cedula>')
@login_required
def get_rutas(cedula):
    try:
        query = """
        SELECT rn.id_ruta, rn.ruta,
            (SELECT COUNT(DISTINCT rp2.id_punto_interes) FROM RUTA_PROGRAMACION rp2
             WHERE rp2.id_ruta = rn.id_ruta AND rp2.activa = 1) AS total_puntos,
            CASE WHEN EXISTS (
                SELECT 1 FROM RUTAS_ACTIVADAS ra JOIN MERCADERISTAS m2 ON ra.id_mercaderista = m2.id_mercaderista
                WHERE ra.id_ruta = rn.id_ruta AND m2.cedula = ? AND ra.estado = 'En Progreso'
                AND CAST(ra.fecha_hora_activacion AS DATE) = CAST(GETDATE() AS DATE)) THEN 1 ELSE 0 END AS esta_activa
        FROM RUTAS_NUEVAS rn
        JOIN MERCADERISTAS_RUTAS mr ON rn.id_ruta = mr.id_ruta
        JOIN MERCADERISTAS m ON mr.id_mercaderista = m.id_mercaderista
        WHERE m.cedula = ? AND m.tipo = ?
        ORDER BY rn.ruta
        """
        rows = execute_query(query, (cedula, cedula, TIPO))
        return jsonify([{'id': r[0], 'nombre': r[1], 'total_puntos': r[2] or 0, 'esta_activa': bool(r[3])} for r in rows])
    except Exception as e:
        current_app.logger.error(f"[auditor_campo] get_rutas: {e}")
        return jsonify({"error": str(e)}), 500


@auditor_campo_bp.route('/api/ruta-puntos/<int:route_id>')
@login_required
def get_ruta_puntos(route_id):
    """PDVs de la ruta para HOY (por día de la semana)."""
    try:
        cedula = request.args.get('cedula')
        if not cedula:
            return jsonify({"error": "Cédula requerida"}), 400
        dia = DIAS[datetime.now().weekday()]
        query = """
        SELECT pin.identificador, pin.punto_de_interes, MAX(rp.prioridad) AS prioridad,
            COUNT(DISTINCT rp.id_cliente) AS total_clientes,
            CASE WHEN EXISTS (
                SELECT 1 FROM FOTOS_TOTALES ft JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
                WHERE vm.identificador_punto_interes = pin.identificador AND ft.id_tipo_foto = 5
                AND CAST(ft.fecha_registro AS DATE) = CAST(GETDATE() AS DATE)) THEN 1 ELSE 0 END AS activado
        FROM RUTA_PROGRAMACION rp
        JOIN PUNTOS_INTERES1 pin ON rp.id_punto_interes = pin.identificador
        WHERE rp.id_ruta = ? AND rp.activa = 1 AND rp.dia = ?
        GROUP BY pin.identificador, pin.punto_de_interes
        ORDER BY pin.punto_de_interes
        """
        rows = execute_query(query, (route_id, dia))
        return jsonify([{'id': r[0], 'nombre': r[1], 'prioridad': r[2] or 'Media',
                         'total_clientes': r[3] or 0, 'activado': bool(r[4])} for r in rows])
    except Exception as e:
        current_app.logger.error(f"[auditor_campo] get_ruta_puntos: {e}")
        return jsonify({"error": str(e)}), 500


# ───────────────────────── Activar / desactivar ruta ─────────────────────────
@auditor_campo_bp.route('/api/activar-ruta', methods=['POST'])
@login_required
def activar_ruta():
    try:
        data = request.get_json() or {}
        id_ruta = data.get('id_ruta')
        cedula = data.get('cedula') or session.get('auditor_campo_cedula')
        if not id_ruta or not cedula:
            return jsonify({"success": False, "message": "Datos incompletos"}), 400
        mid = _auditor_id(cedula)
        if not mid:
            return jsonify({"success": False, "message": "Auditor no encontrado"}), 404
        existe = execute_query("""SELECT COUNT(*) FROM RUTAS_ACTIVADAS WHERE id_ruta=? AND id_mercaderista=?
                                  AND estado='En Progreso' AND CAST(fecha_hora_activacion AS DATE)=CAST(GETDATE() AS DATE)""",
                               (id_ruta, mid), fetch_one=True)
        if existe and existe > 0:
            # Idempotente: si ya está activa hoy, no es un error -> seguir al flujo.
            return jsonify({"success": True, "message": "La ruta ya estaba activa hoy"})
        execute_query("""INSERT INTO RUTAS_ACTIVADAS (id_ruta, id_mercaderista, fecha_hora_activacion, estado, tipo_activacion)
                         VALUES (?, ?, GETDATE(), 'En Progreso', 'Auditor de Campo')""", (id_ruta, mid), commit=True)
        return jsonify({"success": True, "message": "Ruta activada"})
    except Exception as e:
        current_app.logger.error(f"[auditor_campo] activar_ruta: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


@auditor_campo_bp.route('/api/no-activar-ruta', methods=['POST'])
@login_required
def no_activar_ruta():
    try:
        data = request.get_json() or {}
        id_ruta = data.get('id_ruta')
        razon = (data.get('razon') or '').strip()
        cedula = data.get('cedula') or session.get('auditor_campo_cedula')
        if not id_ruta or not cedula:
            return jsonify({"success": False, "message": "Datos incompletos"}), 400
        if not razon:
            return jsonify({"success": False, "message": "La razón es requerida"}), 400
        mid = _auditor_id(cedula)
        if not mid:
            return jsonify({"success": False, "message": "Auditor no encontrado"}), 404
        execute_query("""INSERT INTO RUTAS_ACTIVADAS
                         (id_ruta, id_mercaderista, fecha_hora_activacion, estado, tipo_activacion, motivo_no_activacion)
                         VALUES (?, ?, GETDATE(), 'No Activada', 'Auditor de Campo', ?)""",
                      (id_ruta, mid, razon), commit=True)
        return jsonify({"success": True, "message": "No activación registrada"})
    except Exception as e:
        current_app.logger.error(f"[auditor_campo] no_activar_ruta: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


@auditor_campo_bp.route('/api/desactivar-ruta', methods=['POST'])
@login_required
def desactivar_ruta():
    try:
        data = request.get_json() or {}
        id_ruta = data.get('id_ruta')
        cedula = data.get('cedula') or session.get('auditor_campo_cedula')
        if not id_ruta or not cedula:
            return jsonify({"success": False, "message": "Datos incompletos"}), 400
        mid = _auditor_id(cedula)
        if not mid:
            return jsonify({"success": False, "message": "Auditor no encontrado"}), 404
        res = execute_query("""UPDATE RUTAS_ACTIVADAS SET estado='Finalizado'
                               WHERE id_ruta=? AND id_mercaderista=? AND estado='En Progreso'
                               AND CAST(fecha_hora_activacion AS DATE)=CAST(GETDATE() AS DATE)""",
                            (id_ruta, mid), commit=True)
        if res and res.get('rowcount', 0) > 0:
            return jsonify({"success": True, "message": "Ruta desactivada"})
        return jsonify({"success": False, "message": "No hay ruta activa para desactivar hoy"}), 404
    except Exception as e:
        current_app.logger.error(f"[auditor_campo] desactivar_ruta: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


# ───────────────────────── Fotos de PDV (activación / desactivación) ─────────────────────────
def _subir_foto(point_id, cedula, photo, id_tipo_foto, prefijo, id_visita=None, categoria=None):
    """Sube a Azure + inserta en FOTOS_TOTALES. Devuelve (ok, id_foto|msg)."""
    if not photo or not photo.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
        return False, "Formato no válido (use JPG/PNG)"
    mid = _auditor_id(cedula)
    if not mid:
        return False, "Auditor no encontrado"
    photo.seek(0)
    meta = extract_metadata_safe(photo)
    photo.seek(0)
    for k, f in (('latitud', 'lat'), ('longitud', 'lon'), ('altitud', 'alt')):
        v = request.form.get(f)
        if v:
            meta[k] = float(v)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    filename = f"{prefijo}/{mid}_{point_id}_{ts}.jpg"
    cs = current_app.config['AZURE_STORAGE_CONNECTION_STRING']
    cont = current_app.config['AZURE_CONTAINER_NAME']
    photo.seek(0)
    if not safe_upload_to_azure(photo, filename, cs, cont):
        # Fallback LOCAL: si Azure no es alcanzable (típico al probar en local con
        # eventlet+Windows) guardamos la foto en disco para no bloquear el flujo.
        # En el servidor (Azure OK) este bloque nunca se ejecuta.
        try:
            import os
            base = os.path.join(current_app.root_path, 'static', 'auditoria_local')
            os.makedirs(base, exist_ok=True)
            safe_name = filename.replace('/', '_')
            photo.seek(0)
            with open(os.path.join(base, safe_name), 'wb') as fh:
                fh.write(photo.read())
            filename = 'auditoria_local/' + safe_name
            current_app.logger.warning(f"[auditor_campo] Azure no disponible; foto guardada en local: {filename}")
        except Exception as ex:
            return False, f"Error al guardar foto (Azure y local fallaron): {ex}"
    execute_query("""INSERT INTO FOTOS_TOTALES
        (id_visita, categoria, file_path, fecha_registro, id_tipo_foto, Estado,
         latitud, longitud, altitud, fecha_disparo, fabricante_camara, modelo_camara, iso, apertura, tiempo_exposicion, orientacion)
        VALUES (?, ?, ?, GETDATE(), ?, 'Aprobada', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (id_visita, categoria, filename, id_tipo_foto, meta['latitud'], meta['longitud'], meta['altitud'],
         meta['fecha_disparo'], meta['fabricante_camara'], meta['modelo_camara'], meta['iso'], meta['apertura'],
         meta['tiempo_exposicion'], meta['orientacion']), commit=True)
    idf = execute_query("SELECT TOP 1 id_foto FROM FOTOS_TOTALES WHERE file_path = ? ORDER BY id_foto DESC",
                        (filename,), fetch_one=True)
    return True, (int(idf) if idf is not None else None)


@auditor_campo_bp.route('/api/activar-pdv', methods=['POST'])
@login_required
def activar_pdv():
    """Foto de activación del PDV (tipo 5)."""
    try:
        point_id = request.form.get('point_id')
        cedula = request.form.get('cedula')
        photo = request.files.get('photo')
        if not point_id or not cedula or not photo:
            return jsonify({"success": False, "message": "Datos incompletos"}), 400
        ok, res = _subir_foto(point_id, cedula, photo, 5, "activaciones_auditor_campo")
        if not ok:
            return jsonify({"success": False, "message": res}), 400
        return jsonify({"success": True, "message": "PDV activado", "id_foto": res})
    except Exception as e:
        current_app.logger.error(f"[auditor_campo] activar_pdv: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


@auditor_campo_bp.route('/api/desactivar-pdv', methods=['POST'])
@login_required
def desactivar_pdv():
    """Foto de desactivación del PDV (tipo 6)."""
    try:
        point_id = request.form.get('point_id')
        cedula = request.form.get('cedula')
        photo = request.files.get('photo')
        if not point_id or not cedula or not photo:
            return jsonify({"success": False, "message": "Datos incompletos"}), 400
        ok, res = _subir_foto(point_id, cedula, photo, 6, "desactivaciones_auditor_campo")
        if not ok:
            return jsonify({"success": False, "message": res}), 400
        return jsonify({"success": True, "message": "PDV desactivado", "id_foto": res})
    except Exception as e:
        current_app.logger.error(f"[auditor_campo] desactivar_pdv: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


# ───────────────────────── Clientes / categorías ─────────────────────────
@auditor_campo_bp.route('/api/pdv-clientes/<string:point_id>/<int:route_id>')
@login_required
def get_pdv_clientes(point_id, route_id):
    """Clientes del PDV programados para HOY."""
    try:
        dia = DIAS[datetime.now().weekday()]
        rows = execute_query("""
            SELECT DISTINCT rp.id_cliente, c.cliente, rp.prioridad
            FROM RUTA_PROGRAMACION rp JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
            WHERE rp.id_punto_interes = ? AND rp.id_ruta = ? AND rp.activa = 1 AND rp.dia = ?
            ORDER BY rp.prioridad DESC, c.cliente""", (point_id, route_id, dia))
        return jsonify([{'id': r[0], 'nombre': r[1], 'prioridad': r[2] or 'Media'} for r in rows])
    except Exception as e:
        current_app.logger.error(f"[auditor_campo] get_pdv_clientes: {e}")
        return jsonify({"error": str(e)}), 500


@auditor_campo_bp.route('/api/cliente-categorias/<int:cliente_id>')
@login_required
def get_cliente_categorias(cliente_id):
    """Categorías del cliente (CATEGORIAS_CLIENTES) para tomar foto + cuestionario."""
    try:
        rows = execute_query("""
            SELECT c.id_categoria, c.nombre
            FROM CATEGORIAS_CLIENTES cc JOIN CATEGORIAS c ON c.id_categoria = cc.id_categoria
            WHERE cc.id_cliente = ? ORDER BY c.nombre""", (cliente_id,))
        return jsonify([{'id': r[0], 'nombre': r[1]} for r in rows])
    except Exception as e:
        current_app.logger.error(f"[auditor_campo] get_cliente_categorias: {e}")
        return jsonify({"error": str(e)}), 500


# ───────────────────────── Auditoría por cliente ─────────────────────────
@auditor_campo_bp.route('/api/iniciar-auditoria-cliente', methods=['POST'])
@login_required
def iniciar_auditoria_cliente():
    """Crea (o reutiliza) la VISITA del auditor para un cliente+PDV. Devuelve id_visita."""
    try:
        data = request.get_json() or {}
        cliente_id = data.get('cliente_id')
        point_id = data.get('point_id')
        cedula = data.get('cedula') or session.get('auditor_campo_cedula')
        if not cliente_id or not point_id or not cedula:
            return jsonify({"success": False, "message": "Datos incompletos"}), 400
        mid = _auditor_id(cedula)
        if not mid:
            return jsonify({"success": False, "message": "Auditor no encontrado"}), 404
        existe = execute_query("""SELECT TOP 1 id_visita FROM VISITAS_MERCADERISTA
            WHERE id_mercaderista=? AND id_cliente=? AND identificador_punto_interes=? AND tipo_visita='auditor_campo'
            AND CAST(fecha_visita AS DATE)=CAST(GETDATE() AS DATE) ORDER BY id_visita DESC""",
            (mid, cliente_id, point_id), fetch_one=True)
        if existe:
            vid = existe if isinstance(existe, int) else existe[0]
        else:
            execute_query("""INSERT INTO VISITAS_MERCADERISTA
                (id_mercaderista, fecha_visita, estado, id_cliente, identificador_punto_interes, estado_data, tipo_visita)
                VALUES (?, GETDATE(), 'Pendiente', ?, ?, 'Activo', 'auditor_campo')""",
                (mid, cliente_id, point_id), commit=True)
            r = execute_query("""SELECT TOP 1 id_visita FROM VISITAS_MERCADERISTA
                WHERE id_mercaderista=? AND id_cliente=? AND identificador_punto_interes=? AND tipo_visita='auditor_campo'
                ORDER BY id_visita DESC""", (mid, cliente_id, point_id), fetch_one=True)
            vid = r if isinstance(r, int) else (r[0] if r else None)
        if not vid:
            return jsonify({"success": False, "message": "No se pudo crear la visita"}), 500
        return jsonify({"success": True, "id_visita": int(vid)})
    except Exception as e:
        current_app.logger.error(f"[auditor_campo] iniciar_auditoria_cliente: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


@auditor_campo_bp.route('/api/subir-foto-categoria', methods=['POST'])
@login_required
def subir_foto_categoria():
    """Sube una foto (tipo 11) asociada a la visita + categoría. Se puede llamar N veces."""
    try:
        id_visita = request.form.get('id_visita')
        id_categoria = request.form.get('id_categoria')
        categoria_nombre = request.form.get('categoria_nombre')
        point_id = request.form.get('point_id')
        cedula = request.form.get('cedula')
        photo = request.files.get('photo')
        if not id_visita or not id_categoria or not cedula or not photo:
            return jsonify({"success": False, "message": "Datos incompletos"}), 400
        ok, res = _subir_foto(point_id, cedula, photo, 11, "auditoria_categorias",
                              id_visita=int(id_visita), categoria=categoria_nombre)
        if not ok:
            return jsonify({"success": False, "message": res}), 400
        return jsonify({"success": True, "message": "Foto subida", "id_foto": res})
    except Exception as e:
        current_app.logger.error(f"[auditor_campo] subir_foto_categoria: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


@auditor_campo_bp.route('/api/guardar-auditoria-categoria', methods=['POST'])
@login_required
def guardar_auditoria_categoria():
    """Guarda el cuestionario de una categoría en AUDITORIA_CATEGORIAS."""
    try:
        d = request.get_json() or {}
        id_visita = d.get('id_visita')
        id_categoria = d.get('id_categoria')
        if not id_visita or not id_categoria:
            return jsonify({"success": False, "message": "id_visita e id_categoria requeridos"}), 400

        def b(k):
            v = d.get(k)
            return None if v is None else (1 if v in (True, 1, '1', 'si', 'Si', 'true') else 0)

        execute_query("""INSERT INTO AUDITORIA_CATEGORIAS
            (id_visita, id_categoria, aplico_planograma, lineamiento_marca, precio_correcto, limpieza_correcta,
             participacion_correcta, fifo_correcto, prox_vencer, prox_vencer_cantidad, prox_vencer_marca,
             competencia_actividad, competencia_material_pop, competencia_impulsadora,
             pop_hablador, pop_rompetrafico, pop_otro,
             promo_nuestra, promo_nuestra_desc, promo_competencia, promo_competencia_desc,
             exhibicion_adicional, exhibicion_tipos)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (int(id_visita), int(id_categoria),
             b('aplico_planograma'), b('lineamiento_marca'), b('precio_correcto'), b('limpieza_correcta'),
             b('participacion_correcta'), b('fifo_correcto'),
             b('prox_vencer'), d.get('prox_vencer_cantidad'), d.get('prox_vencer_marca'),
             b('competencia_actividad'), b('competencia_material_pop'), b('competencia_impulsadora'),
             b('pop_hablador'), b('pop_rompetrafico'), d.get('pop_otro'),
             b('promo_nuestra'), d.get('promo_nuestra_desc'), b('promo_competencia'), d.get('promo_competencia_desc'),
             b('exhibicion_adicional'), d.get('exhibicion_tipos')), commit=True)
        return jsonify({"success": True, "message": "Auditoría de categoría guardada"})
    except Exception as e:
        current_app.logger.error(f"[auditor_campo] guardar_auditoria_categoria: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


@auditor_campo_bp.route('/api/finalizar-auditoria-cliente', methods=['POST'])
@login_required
def finalizar_auditoria_cliente():
    """Marca la visita del cliente como finalizada."""
    try:
        d = request.get_json() or {}
        id_visita = d.get('id_visita')
        if not id_visita:
            return jsonify({"success": False, "message": "id_visita requerido"}), 400
        execute_query("UPDATE VISITAS_MERCADERISTA SET estado='Finalizada' WHERE id_visita=?",
                      (int(id_visita),), commit=True)
        return jsonify({"success": True, "message": "Auditoría del cliente finalizada"})
    except Exception as e:
        current_app.logger.error(f"[auditor_campo] finalizar_auditoria_cliente: {e}")
        return jsonify({"success": False, "message": str(e)}), 500
