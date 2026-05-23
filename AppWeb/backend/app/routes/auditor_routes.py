# app/routes/auditor_routes.py - VERSIÓN CORREGIDA
from flask import Blueprint, render_template, jsonify, session, redirect, url_for, flash, current_app, request
from flask_login import login_required, current_user
from datetime import datetime
from app.utils.database import execute_query

auditor_bp = Blueprint('auditor', __name__)

@auditor_bp.route('/dashboard')
@login_required
def dashboard_auditor():
    """Dashboard para mercaderistas tipo Auditor"""
    if current_user.rol != 'mercaderista':
        flash('Acceso no autorizado', 'danger')
        return redirect(url_for('auth.login'))
    
    try:
        # ✅ USAR current_user.username que contiene la cédula
        cedula = current_user.username
        
        # ✅ Usar execute_query en lugar de SQLAlchemy
        result = execute_query(
            "SELECT nombre, cedula, tipo, fecha_ingreso FROM MERCADERISTAS WHERE cedula = ?",
            (cedula,),
            fetch_one=True
        )
        
        if not result:
            flash('Usuario no encontrado', 'danger')
            return redirect(url_for('auth.login'))
        
        # Verificar si es Auditor
        if result[2] != 'Auditor':  # tipo está en la posición 2
            flash('Solo los auditores pueden acceder a esta página', 'danger')
            return redirect(url_for('merchandisers.dashboard_mercaderista'))
        
        session['auditor_name'] = result[0]
        session['auditor_cedula'] = result[1]
        session['auditor_tipo'] = result[2]
        session['fechaIngreso'] = result[3].isoformat() if result[3] else None
        
        return render_template('auditor_dashboard.html',
                             nombre=result[0],
                             cedula=result[1],
                             tipo=result[2],
                             fechaIngreso=result[3].isoformat() if result[3] else None)
                             
    except Exception as e:
        print(f"Error al cargar dashboard auditor: {e}")
        import traceback
        traceback.print_exc()
        flash('Error al cargar información del auditor', 'danger')
        return redirect(url_for('auth.login'))

@auditor_bp.route('/api/stats/<cedula>')
@login_required
def get_auditor_stats(cedula):
    """Obtener estadísticas del auditor usando execute_query"""
    try:
        # 1. Obtener ID del mercaderista
        mercaderista = execute_query(
            "SELECT id_mercaderista FROM MERCADERISTAS WHERE cedula = ? AND tipo = 'Auditor'",
            (cedula,),
            fetch_one=True
        )
        
        if not mercaderista:
            return jsonify({'error': 'Auditor no encontrado'}), 404
        
        mercaderista_id = mercaderista if isinstance(mercaderista, int) else mercaderista[0]
        
        # 2. Obtener rutas asignadas al auditor
        rutas_result = execute_query(
            "SELECT id_ruta FROM MERCADERISTAS_RUTAS WHERE id_mercaderista = ?",
            (mercaderista_id,)
        )
        
        if not rutas_result:
            rutas_ids = []
        else:
            rutas_ids = [r[0] if isinstance(r, (tuple, list)) else r for r in rutas_result]
        
        if not rutas_ids:
            return jsonify({
                'rutasAsignadas': 0,
                'rutasPendientes': 0,
                'rutasCompletadas': 0,
                'avance': 0
            })
        
        # 3. Obtener programaciones activas para estas rutas (HOY)
        from datetime import datetime
        dia_semana = {
            0: 'Lunes', 1: 'Martes', 2: 'Miércoles',
            3: 'Jueves', 4: 'Viernes', 5: 'Sábado', 6: 'Domingo'
        }
        today_dow = dia_semana[datetime.now().weekday()]
        
        # Construir query dinámicamente
        placeholders = ','.join('?' for _ in rutas_ids)
        query = f"""
        SELECT COUNT(*)
        FROM RUTA_PROGRAMACION
        WHERE id_ruta IN ({placeholders})
        AND dia = ?
        AND activa = 1
        """
        params = tuple(rutas_ids) + (today_dow,)  # ¡Importante la coma después de today_dow!
        programaciones = execute_query(query, params, fetch_one=True)
        
        rutas_pendientes = programaciones[0] if isinstance(programaciones, (tuple, list)) else programaciones
        
        # Calcular avance (simplificado)
        avance = 0
        if rutas_pendientes and rutas_pendientes > 0:
            avance = 0  # Podrías calcular esto basado en visitas completadas
        
        return jsonify({
            'rutasAsignadas': len(rutas_ids),
            'rutasPendientes': rutas_pendientes or 0,
            'rutasCompletadas': 0,
            'avance': avance
        })
        
    except Exception as e:
        print(f"Error al obtener estadísticas del auditor: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Error al cargar estadísticas'}), 500

@auditor_bp.route('/carga-data')
@login_required
def carga_auditor():
    """Página de carga de data para auditores"""
    try:
        # ✅ USAR current_user.username que contiene la cédula
        cedula = current_user.username
        
        mercaderista = execute_query(
            "SELECT tipo FROM MERCADERISTAS WHERE cedula = ?",
            (cedula,),
            fetch_one=True
        )
        
        if not mercaderista or (isinstance(mercaderista, (tuple, list)) and mercaderista[0] != 'Auditor'):
            flash('Acceso no autorizado', 'danger')
            return redirect(url_for('auditor.dashboard_auditor'))
        
        return render_template('carga_auditor.html')
        
    except Exception as e:
        print(f"Error en carga-auditor: {e}")
        import traceback
        traceback.print_exc()
        flash('Error al cargar página de carga', 'danger')
        return redirect(url_for('auditor.dashboard_auditor'))

@auditor_bp.route('/api/auditor-fixed-routes/<cedula>')
@login_required
def get_auditor_fixed_routes(cedula):
    """Obtener rutas fijas asignadas al auditor"""
    try:
        from datetime import datetime
        
        dias_espanol = {
            'Monday': 'Lunes',
            'Tuesday': 'Martes',
            'Wednesday': 'Miércoles',
            'Thursday': 'Jueves',
            'Friday': 'Viernes',
            'Saturday': 'Sábado',
            'Sunday': 'Domingo'
        }
        dia_actual = dias_espanol[datetime.now().strftime('%A')]
        
        query = """
        SELECT
            rn.id_ruta,
            rn.ruta,
            (
                SELECT COUNT(DISTINCT rp2.id_punto_interes)
                FROM RUTA_PROGRAMACION rp2
                WHERE rp2.id_ruta = rn.id_ruta
                AND rp2.activa = 1
            ) as total_puntos,
            CASE
                WHEN EXISTS (
                    SELECT 1
                    FROM RUTAS_ACTIVADAS ra
                    JOIN MERCADERISTAS m2 ON ra.id_mercaderista = m2.id_mercaderista
                    WHERE ra.id_ruta = rn.id_ruta
                    AND m2.cedula = ?
                    AND ra.estado = 'En Progreso'
                    AND CAST(ra.fecha_hora_activacion AS DATE) = CAST(GETDATE() AS DATE)
                ) THEN 1
                ELSE 0
            END as esta_activa
        FROM RUTAS_NUEVAS rn
        JOIN MERCADERISTAS_RUTAS mr ON rn.id_ruta = mr.id_ruta
        JOIN MERCADERISTAS m ON mr.id_mercaderista = m.id_mercaderista
        WHERE m.cedula = ? AND rn.servicio = 'Auditor'
        ORDER BY rn.ruta
        """
        
        routes = execute_query(query, (cedula, cedula))
        
        return jsonify([{
            'id': row[0],
            'nombre': row[1],
            'total_puntos': row[2] if row[2] is not None else 0,
            'esta_activa': bool(row[3])
        } for row in routes])
        
    except Exception as e:
        current_app.logger.error(f"Error en get_auditor_fixed_routes: {str(e)}")
        return jsonify({"error": str(e)}), 500

@auditor_bp.route('/api/auditor-route-points/<int:route_id>')
@login_required
def get_auditor_route_points(route_id):
    """Obtener puntos de interés de una ruta para auditor"""
    try:
        cedula = request.args.get('cedula')
        if not cedula:
            return jsonify({"error": "Cédula requerida"}), 400
        
        query = """
        SELECT
            pin.identificador,
            pin.punto_de_interes,
            MAX(rp.prioridad) as prioridad_max,
            CASE
                WHEN EXISTS (
                    SELECT TOP 1 1
                    FROM FOTOS_TOTALES ft
                    JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
                    JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
                    WHERE vm.identificador_punto_interes = pin.identificador
                    AND m.cedula = ?
                    AND ft.id_tipo_foto = 5
                    AND ft.Estado = 'Aprobada'
                    ORDER BY ft.fecha_registro DESC
                ) AND NOT EXISTS (
                    SELECT TOP 1 1
                    FROM FOTOS_TOTALES ft2
                    WHERE ft2.file_path LIKE '%' + pin.identificador + '%'
                    AND ft2.id_tipo_foto = 6
                    AND ft2.Estado = 'Aprobada'
                    AND ft2.fecha_registro > COALESCE((
                        SELECT MAX(ft3.fecha_registro)
                        FROM FOTOS_TOTALES ft3
                        JOIN VISITAS_MERCADERISTA vm3 ON ft3.id_visita = vm3.id_visita
                        WHERE vm3.identificador_punto_interes = pin.identificador
                        AND ft3.id_tipo_foto = 5
                        AND ft3.Estado = 'Aprobada'
                    ), '1900-01-01')
                ) THEN 1
                ELSE 0
            END as activado,
            COUNT(DISTINCT c.id_cliente) as total_clientes
        FROM RUTAS_NUEVAS rn
        JOIN RUTA_PROGRAMACION rp ON rn.id_ruta = rp.id_ruta
        JOIN PUNTOS_INTERES1 pin ON rp.id_punto_interes = pin.identificador
        JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
        JOIN MERCADERISTAS_RUTAS mr ON rn.id_ruta = mr.id_ruta
        JOIN MERCADERISTAS m ON mr.id_mercaderista = m.id_mercaderista
        WHERE rn.id_ruta = ?
        AND rp.activa = 1
        AND m.cedula = ?
        GROUP BY pin.identificador, pin.punto_de_interes
        ORDER BY pin.punto_de_interes
        """
        
        points = execute_query(query, (cedula, route_id, cedula))
        
        return jsonify([{
            'id': row[0],
            'nombre': row[1],
            'prioridad': row[2] or "Media",
            'activado': bool(row[3]),
            'total_clientes': row[4]
        } for row in points])
        
    except Exception as e:
        print(f"Error en get_auditor_route_points: {str(e)}")
        return jsonify({"error": str(e)}), 500

@auditor_bp.route('/api/activar-ruta-auditor', methods=['POST'])
@login_required
def activar_ruta_auditor():
    """Activar ruta para auditor"""
    try:
        data = request.get_json()
        id_ruta = data.get('id_ruta')
        cedula = request.headers.get('X-Auditor-Cedula') or session.get('auditor_cedula')
        
        if not id_ruta or not cedula:
            return jsonify({"success": False, "message": "Datos incompletos"}), 400
        
        # Obtener id_mercaderista (auditor)
        mercaderista_query = "SELECT id_mercaderista FROM MERCADERISTAS WHERE cedula = ? AND activo = 1 AND tipo = 'Auditor'"
        mercaderista_id = execute_query(mercaderista_query, (cedula,), fetch_one=True)
        
        if not mercaderista_id:
            return jsonify({"success": False, "message": "Auditor no encontrado o inactivo"}), 404
        
        # Verificar si ya existe una ruta activa en progreso HOY
        check_query = """
        SELECT COUNT(*) FROM RUTAS_ACTIVADAS
        WHERE id_ruta = ? AND id_mercaderista = ? AND estado = 'En Progreso'
        AND CAST(fecha_hora_activacion AS DATE) = CAST(GETDATE() AS DATE)
        """
        existe = execute_query(check_query, (id_ruta, mercaderista_id), fetch_one=True)
        
        if existe and existe > 0:
            return jsonify({"success": False, "message": "Esta ruta ya está activa en progreso hoy"}), 400
        
        # Insertar nueva activación
        insert_query = """
        INSERT INTO RUTAS_ACTIVADAS (id_ruta, id_mercaderista, fecha_hora_activacion, estado, tipo_activacion)
        VALUES (?, ?, GETDATE(), 'En Progreso', 'Auditor')
        """
        execute_query(insert_query, (id_ruta, mercaderista_id), commit=True)
        
        return jsonify({"success": True, "message": "Ruta activada exitosamente"})
        
    except Exception as e:
        current_app.logger.error(f"Error en activar_ruta_auditor: {str(e)}")
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500

@auditor_bp.route('/api/desactivar-ruta-auditor', methods=['POST'])
@login_required
def desactivar_ruta_auditor():
    """Desactivar ruta para auditor"""
    try:
        data = request.get_json()
        id_ruta = data.get('id_ruta')
        cedula = request.headers.get('X-Auditor-Cedula') or session.get('auditor_cedula')
        
        if not id_ruta or not cedula:
            return jsonify({"success": False, "message": "Datos incompletos"}), 400
        
        # Obtener id_mercaderista (auditor)
        mercaderista_query = "SELECT id_mercaderista FROM MERCADERISTAS WHERE cedula = ? AND activo = 1 AND tipo = 'Auditor'"
        mercaderista_id = execute_query(mercaderista_query, (cedula,), fetch_one=True)
        
        if not mercaderista_id:
            return jsonify({"success": False, "message": "Auditor no encontrado o inactivo"}), 404
        
        # Actualizar estado a Finalizado solo para las activaciones de HOY
        update_query = """
        UPDATE RUTAS_ACTIVADAS
        SET estado = 'Finalizado'
        WHERE id_ruta = ? AND id_mercaderista = ? AND estado = 'En Progreso'
        AND CAST(fecha_hora_activacion AS DATE) = CAST(GETDATE() AS DATE)
        """
        result = execute_query(update_query, (id_ruta, mercaderista_id), commit=True)
        
        if result and result.get('rowcount', 0) > 0:
            return jsonify({"success": True, "message": "Ruta desactivada exitosamente"})
        else:
            return jsonify({"success": False, "message": "No se encontró una ruta activa para desactivar hoy"}), 404
            
    except Exception as e:
        current_app.logger.error(f"Error en desactivar_ruta_auditor: {str(e)}")
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500

@auditor_bp.route('/api/upload-activation-photo-auditor', methods=['POST'])
@login_required
def upload_activation_photo_auditor():
    """Subir foto de activación para auditor - Reutiliza lógica de mercaderista"""
    try:
        print("🔴 INICIO DE upload_activation_photo_auditor")
        
        # Obtener datos del formulario
        point_id = request.form.get('point_id')
        route_id = request.form.get('route_id')
        cedula = request.form.get('cedula')
        photo = request.files.get('photo')
        
        print(f"🔴 Valores obtenidos: point_id={point_id}, cedula={cedula}, photo={photo}")
        
        # Validaciones
        if not point_id or not cedula or not photo:
            print("❌ ERROR: Datos incompletos")
            return jsonify({"success": False, "message": "Datos incompletos"}), 400
        
        # Verificar formato
        if not photo.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            print(f"❌ ERROR: Formato no válido: {photo.filename}")
            return jsonify({"success": False, "message": "Formato no válido. Use JPG, PNG o GIF"}), 400
        
        print(f"✅ Archivo válido: {photo.filename}")
        
        # Obtener información del auditor
        auditor_query = "SELECT id_mercaderista, nombre FROM MERCADERISTAS WHERE cedula = ? AND tipo = 'Auditor'"
        auditor = execute_query(auditor_query, (cedula,), fetch_one=True)
        
        if not auditor:
            print(f"❌ ERROR: Auditor no encontrado: {cedula}")
            return jsonify({"success": False, "message": "Auditor no encontrado"}), 404
        
        auditor_id = auditor[0]
        auditor_nombre = auditor[1]
        print(f"✅ Auditor encontrado: ID={auditor_id}, Nombre={auditor_nombre}")
        
        # Obtener información del punto
        punto_query = """
        SELECT rp.punto_interes
        FROM RUTA_PROGRAMACION rp
        WHERE rp.id_punto_interes = ?
        """
        punto = execute_query(punto_query, (point_id,), fetch_one=True)
        
        if not punto:
            print(f"❌ ERROR: Punto no encontrado: {point_id}")
            return jsonify({"success": False, "message": "Punto no encontrado"}), 404
        
        punto_nombre = punto[0]
        print(f"✅ Punto: {punto_nombre}")
        
        # ========== 🔧 FIX IPHONE: Extraer metadatos de forma segura ==========
        photo.seek(0)
        meta = extract_metadata_safe(photo)
        photo.seek(0)  # Asegurar reset
        print(f"📸 Metadatos EXIF: {meta}")
        
        # Priorizar GPS del dispositivo sobre EXIF
        lat_fallback = float(request.form.get('lat')) if request.form.get('lat') else None
        lon_fallback = float(request.form.get('lon')) if request.form.get('lon') else None
        alt_fallback = float(request.form.get('alt')) if request.form.get('alt') else None
        
        meta['latitud'] = lat_fallback if lat_fallback is not None else meta['latitud']
        meta['longitud'] = lon_fallback if lon_fallback is not None else meta['longitud']
        meta['altitud'] = alt_fallback if alt_fallback is not None else meta['altitud']
        
        print(f"📍 GPS final: lat={meta['latitud']}, lon={meta['longitud']}, alt={meta['altitud']}")
        
        # Generar nombre de archivo
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"activaciones_auditor/{auditor_id}_{point_id}_{timestamp}.jpg"
        print(f"📤 Subiendo a Azure: {filename}")
        
        # ========== 🔧 FIX IPHONE: Subida segura a Azure ==========
        connection_string = current_app.config['AZURE_STORAGE_CONNECTION_STRING']
        container_name = current_app.config['AZURE_CONTAINER_NAME']
        photo.seek(0)
        
        if not safe_upload_to_azure(photo, filename, connection_string, container_name):
            return jsonify({"success": False, "message": "Error al subir a Azure"}), 500
        
        print(f"✅ Subido a Azure exitosamente")
        
        # Insertar en FOTOS_TOTALES (tipo 5 = activación)
        foto_query = """
        INSERT INTO FOTOS_TOTALES
        (categoria, file_path, fecha_registro, id_tipo_foto, Estado,
        latitud, longitud, altitud, fecha_disparo,
        fabricante_camara, modelo_camara, iso, apertura,
        tiempo_exposicion, orientacion)
        VALUES (NULL, ?, GETDATE(), 5, 'Aprobada',
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?)
        """
        
        try:
            execute_query(foto_query, (
                filename,
                meta['latitud'], meta['longitud'], meta['altitud'], meta['fecha_disparo'],
                meta['fabricante_camara'], meta['modelo_camara'], meta['iso'], meta['apertura'],
                meta['tiempo_exposicion'], meta['orientacion']
            ), commit=True)
            print(f"✅ Foto insertada en FOTOS_TOTALES con metadatos: {filename}")
        except Exception as db_error:
            print(f"❌ ERROR al insertar en base de datos: {db_error}")
            return jsonify({"success": False, "message": f"Error al guardar en base de datos: {str(db_error)}"}), 500
        
        # Obtener el ID_FOTO recién insertado
        print("🔄 Obteniendo id_foto...")
        id_foto_query = """
        SELECT TOP 1 id_foto
        FROM FOTOS_TOTALES
        WHERE file_path = ?
        ORDER BY id_foto DESC
        """
        id_foto_result = execute_query(id_foto_query, (filename,), fetch_one=True)
        
        if id_foto_result is not None:
            id_foto = int(id_foto_result)
            print(f"✅ id_foto obtenido: {id_foto}")
            return jsonify({
                "success": True,
                "message": "Foto de activación subida correctamente",
                "id_foto": id_foto,
                "file_path": filename,
                "auditor_id": auditor_id,
                "point_id": point_id,
                "punto_nombre": punto_nombre,
                "meta": meta
            })
        else:
            print("❌ ERROR: No se pudo obtener id_foto")
            return jsonify({
                "success": False,
                "message": "Error: No se pudo obtener el ID de la foto"
            }), 500
            
    except Exception as e:
        print(f"❌ ERROR GENERAL: {str(e)}")
        import traceback
        traceback.print_exc()
        current_app.logger.error(f"Error en upload_activation_photo_auditor: {str(e)}")
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500

@auditor_bp.route('/api/auditor-point-clients/<string:point_id>')
@login_required
def get_auditor_point_clients(point_id):
    """Obtener clientes para un punto de interés - Auditor"""
    try:
        # Obtener la cédula del auditor
        cedula = session.get('auditor_cedula')
        if not cedula:
            cedula = request.headers.get('X-Auditor-Cedula')
        
        if not cedula:
            return jsonify({"error": "No autorizado - sesión no válida"}), 401
        
        query = """
        SELECT DISTINCT
            rp.id_cliente,
            c.cliente,
            rp.prioridad
        FROM RUTA_PROGRAMACION rp
        JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
        WHERE rp.id_punto_interes = ?
        AND rp.activa = 1
        ORDER BY rp.prioridad DESC, c.cliente
        """
        
        clients = execute_query(query, (point_id,))
        
        return jsonify([{
            'id': row[0],
            'nombre': row[1],
            'prioridad': row[2] or "Media"
        } for row in clients])
        
    except Exception as e:
        current_app.logger.error(f"Error en get_auditor_point_clients: {str(e)}")
        return jsonify({"error": f"Error interno: {str(e)}"}), 500

@auditor_bp.route('/api/route-active-points-auditor/<int:route_id>')
@login_required
def get_route_active_points_auditor(route_id):
    """Verificar si una ruta tiene puntos activos sin desactivar para auditor"""
    try:
        cedula = session.get('auditor_cedula')
        if not cedula:
            cedula = request.headers.get('X-Auditor-Cedula')
        
        if not cedula:
            return jsonify({"error": "No autorizado"}), 401
        
        query = """
        SELECT COUNT(DISTINCT pin.identificador) as puntos_activos
        FROM PUNTOS_INTERES1 pin
        JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes
        JOIN RUTAS_NUEVAS rn ON rn.id_ruta = rp.id_ruta
        JOIN MERCADERISTAS_RUTAS mr ON rn.id_ruta = mr.id_ruta
        JOIN MERCADERISTAS m ON mr.id_mercaderista = m.id_mercaderista
        WHERE rn.id_ruta = ?
        AND rp.activa = 1
        AND m.cedula = ?
        AND EXISTS (
            SELECT 1
            FROM FOTOS_TOTALES ft
            JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
            WHERE vm.identificador_punto_interes = pin.identificador
            AND ft.id_tipo_foto = 5
            AND ft.Estado = 'Aprobada'
        )
        AND NOT EXISTS (
            SELECT 1
            FROM FOTOS_TOTALES ft2
            WHERE ft2.file_path LIKE '%' + pin.identificador + '%'
            AND ft2.id_tipo_foto = 6
            AND ft2.Estado = 'Aprobada'
            AND ft2.fecha_registro > (
                SELECT MAX(ft3.fecha_registro)
                FROM FOTOS_TOTALES ft3
                JOIN VISITAS_MERCADERISTA vm3 ON ft3.id_visita = vm3.id_visita
                WHERE vm3.identificador_punto_interes = pin.identificador
                AND ft3.id_tipo_foto = 5
                AND ft3.Estado = 'Aprobada'
            )
        )
        """
        
        result = execute_query(query, (route_id, cedula), fetch_one=True)
        
        if isinstance(result, (tuple, list)):
            puntos_activos = result[0] if result and result[0] is not None else 0
        else:
            puntos_activos = result if result is not None else 0
        
        return jsonify({
            "success": True,
            "puntos_activos": int(puntos_activos),
            "can_desactivar": int(puntos_activos) == 0
        })
        
    except Exception as e:
        current_app.logger.error(f"Error en get_route_active_points_auditor: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ============================================================================
# 🔧 FUNCIONES AUXILIARES PARA FIX DE IPHONE - REUTILIZADAS DE MERCADERISTA
# ============================================================================
def extract_metadata_safe(photo):
    """Extrae metadatos EXIF de forma segura sin consumir el stream original."""
    try:
        photo.seek(0)
        photo_data = photo.read()
        photo.seek(0)
        
        if not photo_data:
            print("⚠️ extract_metadata_safe: Archivo vacío")
            return get_empty_metadata()
        
        print(f"✅ extract_metadata_safe: Leyó {len(photo_data)} bytes")
        
        import io
        from app.utils.exif_helper import extract_metadata
        
        class TempFile:
            def __init__(self, data):
                self._stream = io.BytesIO(data)
            def read(self, *args):
                return self._stream.read(*args)
            def seek(self, *args):
                return self._stream.seek(*args)
            def tell(self):
                return self._stream.tell()
        
        temp_photo = TempFile(photo_data)
        meta = extract_metadata(temp_photo)
        photo.seek(0)
        
        return meta
    except Exception as e:
        print(f"❌ Error en extract_metadata_safe: {str(e)}")
        import traceback
        traceback.print_exc()
        try:
            photo.seek(0)
        except:
            pass
        return get_empty_metadata()

def get_empty_metadata():
    """Retorna diccionario de metadatos vacío con estructura estándar."""
    return {
        'latitud': None,
        'longitud': None,
        'altitud': None,
        'fecha_disparo': None,
        'fabricante_camara': None,
        'modelo_camara': None,
        'iso': None,
        'apertura': None,
        'tiempo_exposicion': None,
        'orientacion': None
    }

def safe_upload_to_azure(photo, filename, connection_string, container_name):
    """Sube archivo a Azure de forma segura, asegurando que el stream tenga contenido."""
    import io
    from app.utils.azure_storage import upload_to_azure
    
    try:
        if isinstance(photo, io.BytesIO):
            photo.seek(0)
            upload_to_azure(photo, filename, connection_string, container_name)
            return True
        
        photo.seek(0)
        photo_content = photo.read()
        photo.seek(0)
        
        if not photo_content:
            print(f"❌ safe_upload_to_azure: Contenido vacío para {filename}")
            return False
        
        print(f"✅ safe_upload_to_azure: Subiendo {len(photo_content)} bytes")
        
        photo_stream = io.BytesIO(photo_content)
        upload_to_azure(photo_stream, filename, connection_string, container_name)
        return True
    except Exception as e:
        print(f"❌ Error en safe_upload_to_azure: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    
# ============================================================================
# NUEVOS ENDPOINTS PARA CATEGORÍAS Y PRODUCTOS DESPUÉS DE ACTIVACIÓN
# ============================================================================

@auditor_bp.route('/api/point-categories/<string:point_id>/<int:route_id>')
@login_required
def get_point_categories(point_id, route_id):
    """Obtener categorías pendientes para un punto de interés y ruta para el auditor - USANDO CATEGORIAS_CLIENTES"""
    try:
        cedula = request.args.get('cedula')
        if not cedula:
            return jsonify({"error": "Cédula requerida"}), 400

        # Obtener id_mercaderista del auditor
        mercaderista = execute_query(
            "SELECT id_mercaderista FROM MERCADERISTAS WHERE cedula = ? AND tipo = 'Auditor'",
            (cedula,),
            fetch_one=True
        )
        if not mercaderista:
            return jsonify({"error": "Auditor no encontrado"}), 404
        mercaderista_id = mercaderista[0] if isinstance(mercaderista, (tuple, list)) else mercaderista

        # Verificar que la ruta esté asignada al auditor
        route_check = execute_query(
            "SELECT COUNT(*) FROM MERCADERISTAS_RUTAS WHERE id_mercaderista = ? AND id_ruta = ?",
            (mercaderista_id, route_id),
            fetch_one=True
        )
        if not route_check or (isinstance(route_check, (tuple, list)) and route_check[0] == 0):
            return jsonify({"error": "Ruta no asignada al auditor"}), 403

        # ✅ CORREGIDO: Usar CATEGORIAS_CLIENTES en lugar de CLIENTES.id_categoria
        query = """
        SELECT DISTINCT c.id_categoria, c.categoria, COUNT(DISTINCT rp.id_cliente) as total_clientes
        FROM RUTA_PROGRAMACION rp
        JOIN CATEGORIAS_CLIENTES cc ON rp.id_cliente = cc.id_cliente  -- ✅ Tabla correcta
        JOIN CATEGORIAS c ON cc.id_categoria = c.id_categoria          -- ✅ Relación correcta
        WHERE rp.id_punto_interes = ?
        AND rp.id_ruta = ?
        AND rp.activa = 1
        GROUP BY c.id_categoria, c.categoria
        ORDER BY c.categoria
        """
        categories = execute_query(query, (point_id, route_id))
        
        # Debug para verificar resultados
        print(f"🔍 Categorías encontradas para punto {point_id}, ruta {route_id}: {len(categories) if categories else 0}")
        if categories:
            for cat in categories:
                print(f"   - ID: {cat[0]}, Nombre: {cat[1]}, Clientes: {cat[2]}")
        
        return jsonify([{
            'id': row[0],
            'nombre': row[1],
            'total_clientes': row[2] if row[2] else 0
        } for row in categories])
    except Exception as e:
        current_app.logger.error(f"Error en get_point_categories: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error interno: {str(e)}"}), 500

@auditor_bp.route('/api/category-products/<int:category_id>')
@login_required
def get_category_products(category_id):
    """Obtener productos de una categoría - Versión corregida"""
    try:
        cedula = request.args.get('cedula', '')
        
        # ✅ QUERY CORREGIDA: Obtener TODOS los productos de la categoría (sin depender de ruta activa HOY)
        query = """
            SELECT ID_PRODUCT, SKUs, fabricante, inagotable
            FROM PRODUCTS
            WHERE id_categoria = ?
            ORDER BY SKUs
        """
        products = execute_query(query, (category_id,))
        
        if not products:
            current_app.logger.warning(f"No se encontraron productos para categoría {category_id}")
            return jsonify([])
            
        return jsonify([{
            'id': row[0],
            'sku': row[1],
            'fabricante': row[2] if row[2] else 'N/A',
            'inagotable': bool(row[3]) if row[3] is not None else False
        } for row in products])
        
    except Exception as e:
        current_app.logger.error(f"Error en get_category_products: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error interno: {str(e)}"}), 500


@auditor_bp.route('/api/category-clients/<int:category_id>/<string:point_id>/<int:route_id>')
@login_required
def get_category_clients(category_id, point_id, route_id):
    """Obtener clientes que pertenecen a una categoría en un punto específico"""
    try:
        cedula = request.args.get('cedula')
        if not cedula:
            return jsonify({"error": "Cédula requerida"}), 400
        
        # Obtener id_mercaderista del auditor
        mercaderista = execute_query(
            "SELECT id_mercaderista FROM MERCADERISTAS WHERE cedula = ? AND tipo = 'Auditor'",
            (cedula,),
            fetch_one=True
        )
        if not mercaderista:
            return jsonify({"error": "Auditor no encontrado"}), 404
        mercaderista_id = mercaderista[0] if isinstance(mercaderista, (tuple, list)) else mercaderista
        
        # Obtener clientes que tienen productos de esta categoría en este punto
        query = """
        SELECT DISTINCT 
            c.id_cliente,
            c.cliente,
            rp.prioridad
        FROM RUTA_PROGRAMACION rp
        JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
        JOIN CATEGORIAS_CLIENTES cc ON c.id_cliente = cc.id_cliente
        JOIN PRODUCTS p ON c.id_cliente = p.ID_FABRICANTE
        WHERE rp.id_punto_interes = ?
        AND rp.id_ruta = ?
        AND rp.activa = 1
        AND cc.id_categoria = ?
        AND p.id_categoria = ?
        ORDER BY rp.prioridad DESC, c.cliente
        """
        clients = execute_query(query, (point_id, route_id, category_id, category_id))
        
        return jsonify([{
            'id': row[0],
            'nombre': row[1],
            'prioridad': row[2] or "Media"
        } for row in clients])
        
    except Exception as e:
        current_app.logger.error(f"Error en get_category_clients: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error interno: {str(e)}"}), 500
    
@auditor_bp.route('/api/save-auditor-data', methods=['POST'])
@login_required
def save_auditor_data():
    """Guardar data de productos cargados por auditor - VERSIÓN CORREGIDA"""
    try:
        data = request.get_json()
        
        # Validar campos requeridos
        required_fields = ['route_id', 'point_id', 'category_id', 'productos']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "message": f"Campo {field} es requerido"
                }), 400
        
        route_id = data['route_id']
        point_id = data['point_id']
        category_id = data['category_id']
        
        # ✅ CORREGIDO: Priorizar cédula del frontend, pero usar current_user como fallback
        cedula_from_data = data.get('cedula')
        if cedula_from_data and str(cedula_from_data).strip():
            cedula = str(cedula_from_data).strip()
        else:
            cedula = str(current_user.username).strip()
        
        if not cedula:
            return jsonify({
                "success": False,
                "message": "Cédula es requerida"
            }), 400
        
        productos = data['productos']
        
        if not isinstance(productos, list) or len(productos) == 0:
            return jsonify({
                "success": False,
                "message": "Debe enviar al menos un producto"
            }), 400
        
        current_app.logger.info(f"save_auditor_data - Cédula final usada: '{cedula}'")
        current_app.logger.info(f"save_auditor_data - Datos recibidos: route_id={route_id}, point_id={point_id}, category_id={category_id}")
        current_app.logger.info(f"save_auditor_data - Productos recibidos: {len(productos)}")
        
        # Buscar auditor
        mercaderista = execute_query(
            "SELECT id_mercaderista, nombre FROM MERCADERISTAS WHERE LTRIM(RTRIM(cedula)) = LTRIM(RTRIM(?)) AND tipo = 'Auditor'",
            (cedula,),
            fetch_one=True
        )
        
        if not mercaderista:
            auditores_existentes = execute_query(
                "SELECT cedula, nombre FROM MERCADERISTAS WHERE tipo = 'Auditor'"
            )
            auditores_list = [str(a[0]) for a in auditores_existentes] if auditores_existentes else []
            
            current_app.logger.error(
                f"Auditor no encontrado para cédula: '{cedula}'. "
                f"Auditores existentes: {auditores_list}"
            )
            return jsonify({
                "success": False,
                "message": f"Auditor no encontrado para cédula: {cedula}"
            }), 404
        
        auditor_id = mercaderista[0]
        auditor_nombre = mercaderista[1]
        fecha_balance = datetime.now().strftime('%Y-%m-%d')
        fecha_ingreso = data.get('fecha_ingreso')
        fecha_carga = data.get('fecha_carga')
        fecha_final_carga = datetime.now().isoformat()
        
        # ✅ NUEVO: Obtener cliente_id (ID_FABRICANTE) para cada producto desde PRODUCTS
        productos_con_cliente = []
        for producto in productos:
            producto_id = producto.get('id')
            if not producto_id:
                continue
            
            # Obtener ID_FABRICANTE (cliente_id) y datos del producto
            product_info = execute_query(
                "SELECT ID_FABRICANTE, Categoria, fabricante FROM PRODUCTS WHERE ID_PRODUCT = ?",
                (producto_id,),
                fetch_one=True
            )
            
            current_app.logger.info(f"Producto {producto_id}: product_info={product_info}")
            
            if not product_info:
                current_app.logger.warning(f"Producto {producto_id} no encontrado en PRODUCTS")
                continue
            
            cliente_id = product_info[0]
            categoria_producto = product_info[1] or ''
            fabricante_real = product_info[2] or producto.get('fabricante', '')
            
            if not cliente_id:
                current_app.logger.warning(f"Producto {producto_id} no tiene fabricante/cliente asociado (ID_FABRICANTE es NULL)")
                continue
            
            productos_con_cliente.append({
                'id': producto_id,
                'sku': producto.get('sku'),
                'fabricante': fabricante_real,
                'inventarioInicial': producto.get('inventarioInicial'),
                'inventarioFinal': producto.get('inventarioFinal'),
                'caras': producto.get('caras'),
                'inventarioDeposito': producto.get('inventarioDeposito', 0),
                'precioBs': producto.get('precioBs'),
                'precioUSD': producto.get('precioUSD'),
                'cliente_id': cliente_id,
                'categoria': categoria_producto
            })
        
        current_app.logger.info(f"Productos con cliente asociado: {len(productos_con_cliente)}")
        
        if not productos_con_cliente:
            return jsonify({
                "success": False,
                "message": "No se encontraron productos con cliente/fabricante asociado"
            }), 400
        
        # ✅ Agrupar productos por cliente_id (ID_FABRICANTE)
        from collections import defaultdict
        productos_por_cliente = defaultdict(list)
        for prod in productos_con_cliente:
            productos_por_cliente[prod['cliente_id']].append(prod)
        
        current_app.logger.info(f"Clientes únicos a procesar: {list(productos_por_cliente.keys())}")
        
        # Procesar cada cliente
        visitas_creadas = 0
        productos_guardados = 0
        
        for cliente_id, productos_cliente in productos_por_cliente.items():
            current_app.logger.info(f"Procesando cliente {cliente_id} con {len(productos_cliente)} productos")
            
            # ✅ CORREGIDO: Verificar que el cliente pertenece a la categoría en este punto
            try:
                client_check = execute_query("""
                    SELECT COUNT(*) as count
                    FROM RUTA_PROGRAMACION rp
                    JOIN CATEGORIAS_CLIENTES cc ON rp.id_cliente = cc.id_cliente
                    WHERE rp.id_punto_interes = ?
                    AND rp.id_ruta = ?
                    AND rp.id_cliente = ?
                    AND cc.id_categoria = ?
                    AND rp.activa = 1
                """, (point_id, route_id, cliente_id, category_id), fetch_one=True)
                
                # ✅ FIX: Manejar diferentes formatos de retorno
                if isinstance(client_check, (tuple, list)):
                    count_value = client_check[0] if len(client_check) > 0 else 0
                elif isinstance(client_check, dict):
                    count_value = client_check.get('count', 0)
                else:
                    count_value = client_check if client_check is not None else 0
                
                current_app.logger.info(f"Client check para cliente {cliente_id}: {client_check} -> count={count_value}")
                
                if not count_value or int(count_value) == 0:
                    current_app.logger.warning(
                        f"Cliente {cliente_id} no pertenece a categoría {category_id} en punto {point_id} de ruta {route_id}"
                    )
                    continue
                    
            except Exception as check_error:
                current_app.logger.error(f"Error en client_check para cliente {cliente_id}: {str(check_error)}")
                continue
            
            # ✅ CORREGIDO: Crear visita para este cliente usando SCOPE_IDENTITY() en lugar de OUTPUT
            # ✅ CORREGIDO: Crear visita usando OUTPUT INSERTED en una sola consulta
            try:
                # Paso 1: Insertar la visita
                visit_insert_query = """
                    INSERT INTO VISITAS_MERCADERISTA
                    (id_mercaderista, fecha_visita, estado, id_cliente,
                    identificador_punto_interes, estado_data, tipo_visita)
                    VALUES (?, GETDATE(), 'Pendiente', ?, ?, 'Activo', 'auditor_categoria')
                """
                execute_query(visit_insert_query, (auditor_id, cliente_id, point_id), commit=True)
                
                current_app.logger.info(f"INSERT ejecutado para cliente {cliente_id}")
                
                # Paso 2: Obtener el ID de la visita recién insertada
                # Buscamos por los campos únicos que identifican esta visita específica
                visit_id_query = """
                    SELECT TOP 1 id_visita 
                    FROM VISITAS_MERCADERISTA 
                    WHERE id_mercaderista = ? 
                    AND id_cliente = ? 
                    AND identificador_punto_interes = ?
                    AND tipo_visita = 'auditor_categoria'
                    ORDER BY id_visita DESC
                """
                visit_result = execute_query(visit_id_query, (auditor_id, cliente_id, point_id), fetch_one=True)
                
                current_app.logger.info(f"Resultado de búsqueda de visita: {visit_result}")
                
                # Extraer el ID del resultado
                if isinstance(visit_result, (tuple, list)):
                    visit_id = visit_result[0] if visit_result else None
                elif isinstance(visit_result, dict):
                    visit_id = visit_result.get('id_visita')
                else:
                    visit_id = visit_result
                
                current_app.logger.info(f"ID de visita extraído: {visit_id}")
                
                if not visit_id:
                    current_app.logger.error(f"No se pudo obtener ID de visita para cliente {cliente_id}")
                    continue
                
                current_app.logger.info(f"Visita creada para cliente {cliente_id}: ID {visit_id}")
                visitas_creadas += 1
                
            except Exception as visit_error:
                current_app.logger.error(f"Error creando visita para cliente {cliente_id}: {str(visit_error)}")
                import traceback
                current_app.logger.error(traceback.format_exc())
                continue
            
            # Insertar productos en BALANCES_TOTALES
            for producto in productos_cliente:
                try:
                    insert_query = """
                        INSERT INTO BALANCES_TOTALES (
                            ID_CLIENTE,
                            FECHA_BALANCE,
                            IDENTIFICADOR_PDV,
                            MERCADERISTA,
                            PRODUCTO,
                            CATEGORIA,
                            FABRICANTE,
                            INV_INICIAL,
                            INV_FINAL,
                            INV_DEPOSITO,
                            CARAS,
                            PRECIO_BS,
                            PRECIO_DS,
                            ID_VISITA,
                            FECHA_INGRESO,
                            FECHA_CARGA,
                            FECHA_FINAL_CARGA
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """
                    execute_query(insert_query, (
                        cliente_id,
                        fecha_balance,
                        point_id,
                        auditor_nombre,
                        producto['sku'],
                        producto['categoria'],
                        producto['fabricante'],
                        producto['inventarioInicial'],
                        producto['inventarioFinal'],
                        producto['inventarioDeposito'],
                        producto['caras'],
                        producto['precioBs'],
                        producto['precioUSD'],
                        visit_id,
                        fecha_ingreso,
                        fecha_carga,
                        fecha_final_carga
                    ), commit=True)
                    productos_guardados += 1
                    current_app.logger.info(f"Producto guardado: {producto['sku']} para visita {visit_id}")
                    
                except Exception as balance_error:
                    current_app.logger.error(f"Error guardando producto {producto['sku']}: {str(balance_error)}")
                    # Continuar con el siguiente producto, no fallar todo
        
        current_app.logger.info(f"Proceso completado: {visitas_creadas} visitas, {productos_guardados} productos")
        
        if visitas_creadas == 0:
            return jsonify({
                "success": False,
                "message": "No se pudieron crear visitas. Verifica que los clientes estén asignados a esta ruta y categoría."
            }), 400
        
        return jsonify({
            "success": True,
            "message": f"Datos guardados exitosamente",
            "visitas_creadas": visitas_creadas,
            "productos_guardados": productos_guardados
        })
        
    except Exception as e:
        current_app.logger.error(f"Error en save_auditor_data: {str(e)}")
        import traceback
        current_app.logger.error(traceback.format_exc())
        return jsonify({
            "success": False,
            "message": f"Error interno: {str(e)}"
        }), 500