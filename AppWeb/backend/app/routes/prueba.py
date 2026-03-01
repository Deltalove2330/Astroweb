from flask import Blueprint, request, jsonify, render_template, current_app, session
from flask_login import login_required, current_user
from app.utils.database import execute_query, get_db_connection
from app.utils.auth import get_user_id_by_username 
from app.utils.exif_helper import extract_metadata
import pyodbc
import datetime
import json

@merchandisers_bp.route('/api/route-points1/<int:route_id>')
def get_route_points(route_id):
    try:
        cedula = request.args.get('cedula')
        if not cedula:
            return jsonify({"error": "Cédula requerida"}), 400

        query = """
        WITH PuntosUnicos AS (
            SELECT 
                pin.identificador,
                pin.punto_de_interes,
                MAX(rp.prioridad) as prioridad_max,
                CASE 
                    -- Buscar fotos de activación/desactivación con visita
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
                        -- Verificar que no haya una desactivación más reciente
                        SELECT TOP 1 1
                        FROM FOTOS_TOTALES ft2
                        LEFT JOIN VISITAS_MERCADERISTA vm2 ON ft2.id_visita = vm2.id_visita
                        LEFT JOIN MERCADERISTAS m2 ON (vm2.id_mercaderista = m2.id_mercaderista OR (ft2.id_visita IS NULL AND m2.cedula = ?))
                        WHERE (vm2.identificador_punto_interes = pin.identificador OR ft2.file_path LIKE '%' + pin.identificador + '%')
                        AND m2.cedula = ?
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
        )
        SELECT 
            identificador,
            punto_de_interes,
            prioridad_max,
            activado,
            total_clientes
        FROM PuntosUnicos
        ORDER BY punto_de_interes
        """
        
        points = execute_query(query, (cedula, cedula, cedula, route_id, cedula))
        
        return jsonify([{
            "id": row[0],
            "nombre": row[1],
            "prioridad": row[2] or "Sin prioridad",
            "activado": bool(row[3]),
            "total_clientes": row[4]
        } for row in points])

    except Exception as e:
        print(f"Error en get_route_points: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@merchandisers_bp.route('/api/upload-activation-photo', methods=['POST'])
def upload_activation_photo():
    try:
        # 🔴 LOG TEMPORAL PARA DEBUG
        print("🔴 INICIO DE upload_activation_photo")
        print(f"🔴 Datos del formulario: {request.form}")
        print(f"🔴 Archivos recibidos: {request.files}")

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

        # Verificar que el archivo sea una imagen
        if not photo.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            print(f"❌ ERROR: Formato de archivo no válido: {photo.filename}")
            return jsonify({"success": False, "message": "Formato de archivo no válido. Use JPG, PNG o GIF"}), 400

        print(f"✅ Archivo válido: {photo.filename}")

        # Obtener información del mercaderista
        mercaderista_query = "SELECT id_mercaderista, nombre FROM MERCADERISTAS WHERE cedula = ?"
        mercaderista = execute_query(mercaderista_query, (cedula,), fetch_one=True)

        if not mercaderista:
            print(f"❌ ERROR: Mercaderista no encontrado con cédula: {cedula}")
            return jsonify({"success": False, "message": "Mercaderista no encontrado"}), 404

        mercaderista_id = mercaderista[0]
        mercaderista_nombre = mercaderista[1]
        print(f"✅ Mercaderista encontrado: ID={mercaderista_id}, Nombre={mercaderista_nombre}")

        # Obtener información del punto (solo para referencia, NO para crear visita)
        punto_query = """
            SELECT rp.punto_interes
            FROM RUTA_PROGRAMACION rp
            WHERE rp.id_punto_interes = ?
        """
        punto = execute_query(punto_query, (point_id,), fetch_one=True)

        if not punto:
            print(f"❌ ERROR: Punto de interés no encontrado: {point_id}")
            return jsonify({"success": False, "message": "Punto de interés no encontrado"}), 404

        punto_nombre = punto[0]
        print(f"✅ Punto encontrado: {punto_nombre}")

        # 📸 EXTRAER METADATOS EXIF/GPS
        from app.utils.exif_helper import extract_metadata
        meta = extract_metadata(photo)
        print(f"📸 Metadatos EXIF extraídos: {meta}")

        # 📸 EXTRAER METADATOS EXIF/GPS

        # ✅ USAR GPS DEL DISPOSITIVO SIEMPRE QUE ESTÉ DISPONIBLE
        lat_fallback = float(request.form.get('lat')) if request.form.get('lat') else None
        lon_fallback = float(request.form.get('lon')) if request.form.get('lon') else None
        alt_fallback = float(request.form.get('alt')) if request.form.get('alt') else None

        # Priorizar GPS del dispositivo sobre EXIF
        meta['latitud'] = lat_fallback if lat_fallback is not None else meta['latitud']
        meta['longitud'] = lon_fallback if lon_fallback is not None else meta['longitud']
        meta['altitud'] = alt_fallback if alt_fallback is not None else meta['altitud']

        print(f"📸 Metadatos finales a guardar: {meta}")

        # Subir foto a Azure
        from datetime import datetime
        from app.utils.azure_storage import upload_to_azure

        connection_string = current_app.config['AZURE_STORAGE_CONNECTION_STRING']
        container_name = current_app.config['AZURE_CONTAINER_NAME']

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"activaciones/{mercaderista_id}_{point_id}_{timestamp}.jpg"

        print(f"📤 Subiendo archivo a Azure: {filename}")

        try:
            upload_to_azure(photo, filename, connection_string, container_name)
            print(f"✅ Archivo subido exitosamente a Azure: {filename}")
        except Exception as azure_error:
            print(f"❌ ERROR al subir a Azure: {azure_error}")
            return jsonify({"success": False, "message": f"Error al subir a Azure: {str(azure_error)}"}), 500

        # Insertar en FOTOS_TOTALES con metadatos
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

        # 🔴 OBTENER EL ID_FOTO RECIÉN INSERTADO
        print("🔄 Obteniendo id_foto...")
        id_foto_query = """
            SELECT TOP 1 id_foto 
            FROM FOTOS_TOTALES 
            WHERE file_path = ?
            ORDER BY id_foto DESC
        """
        id_foto_result = execute_query(id_foto_query, (filename,), fetch_one=True)

        if id_foto_result is not None:
            id_foto = id_foto_result
            print(f"✅ id_foto obtenido: {id_foto}")
        else:
            print("❌ ERROR: No se pudo obtener el id_foto")
            id_foto = None

        # Preparar respuesta
        if id_foto:
            response_data = {
                "success": True,
                "message": "Foto de activación subida correctamente",
                "id_foto": int(id_foto),
                "file_path": filename,
                "mercaderista_id": mercaderista_id,
                "point_id": point_id,
                "punto_nombre": punto_nombre,
                "meta": meta
            }
            print(f"📤 Enviando respuesta EXITOSA: {response_data}")
            return jsonify(response_data)
        else:
            print("❌ ERROR CRÍTICO: id_foto es None")
            return jsonify({
                "success": False,
                "message": "Error crítico: No se pudo obtener el ID de la foto"
            }), 500

    except Exception as e:
        print(f"❌ ERROR GENERAL en upload-activation-photo: {str(e)}")
        import traceback
        traceback.print_exc()
        current_app.logger.error(f"Error en upload-activation-photo: {str(e)}")
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500
    
@merchandisers_bp.route('/api/upload-route-photos', methods=['POST'])
def upload_route_photos():
    try:
        # Obtener datos del formulario
        point_id = request.form.get('point_id')
        route_id = request.form.get('route_id')
        cedula = request.form.get('cedula')
        photo_type = request.form.get('photo_type')
        photo = request.files.get('photo')

        # Validaciones
        if not point_id or not cedula or not photo_type or not photo:
            return jsonify({"success": False, "message": "Datos incompletos"}), 400

        # Mapear tipos de foto a id_tipo_foto
        tipo_foto_map = {
            'precios': 1,
            'gestion': 2,
            'exhibiciones': 3,
            'activacion': 5,
            'desactivacion': 6
        }

        id_tipo_foto = tipo_foto_map.get(photo_type)
        if not id_tipo_foto:
            return jsonify({"success": False, "message": "Tipo de foto no válido"}), 400

        # Obtener información del mercaderista
        mercaderista_query = "SELECT id_mercaderista, nombre FROM MERCADERISTAS WHERE cedula = ?"
        mercaderista_result = execute_query(mercaderista_query, (cedula,), fetch_one=True)

        if not mercaderista_result:
            return jsonify({"success": False, "message": "Mercaderista no encontrado"}), 404

        mercaderista_id = mercaderista_result[0]
        mercaderista_nombre = mercaderista_result[1] if len(mercaderista_result) > 1 else None

        # 📸 EXTRAER METADATOS EXIF/GPS
        from app.utils.exif_helper import extract_metadata
        meta = extract_metadata(photo)
        print(f"📸 Metadatos EXIF extraídos: {meta}")

        # ✅ USAR GPS DEL DISPOSITIVO SI EXIF NO TRAE COORDENADAS
        lat_fallback = float(request.form.get('lat')) if request.form.get('lat') else None
        lon_fallback = float(request.form.get('lon')) if request.form.get('lon') else None
        alt_fallback = float(request.form.get('alt')) if request.form.get('alt') else None

        if meta['latitud'] is None and lat_fallback is not None:
            meta['latitud'] = lat_fallback
            print(f"🌍 Usando latitud del dispositivo: {lat_fallback}")
        if meta['longitud'] is None and lon_fallback is not None:
            meta['longitud'] = lon_fallback
            print(f"🌍 Usando longitud del dispositivo: {lon_fallback}")
        if meta['altitud'] is None and alt_fallback is not None:
            meta['altitud'] = alt_fallback
            print(f"🌍 Usando altitud del dispositivo: {alt_fallback}")

        print(f"📸 Metadatos finales a guardar: {meta}")

        # Subir foto a Azure
        from datetime import datetime
        from app.utils.azure_storage import upload_to_azure

        connection_string = current_app.config['AZURE_STORAGE_CONNECTION_STRING']
        container_name = current_app.config['AZURE_CONTAINER_NAME']

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{photo_type}/{mercaderista_id}_{point_id}_{timestamp}.jpg"

        upload_to_azure(photo, filename, connection_string, container_name)

        # ✅ CASO DESACTIVACIÓN: Crear una visita especial para la desactivación
        if photo_type == 'desactivacion':
            # Obtener cualquier cliente asociado a este punto
            cliente_query = """
                SELECT TOP 1 c.id_cliente
                FROM RUTA_PROGRAMACION rp
                JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
                WHERE rp.id_punto_interes = ?
                AND rp.activa = 1
            """
            cliente_result = execute_query(cliente_query, (point_id,), fetch_one=True)

            cliente_id = None
            if cliente_result:
                cliente_id = cliente_result[0] if isinstance(cliente_result, (tuple, list)) else cliente_result

            # Crear visita de desactivación
            visita_insert_query = """
                INSERT INTO VISITAS_MERCADERISTA 
                (id_cliente, identificador_punto_interes, id_mercaderista, fecha_visita, estado, tipo_visita)
                VALUES (?, ?, ?, GETDATE(), 'Desactivacion', 'Desactivacion')
            """
            execute_query(visita_insert_query, (cliente_id, point_id, mercaderista_id), commit=True)

            # Obtener el ID de la visita creada
            visita_id_result = execute_query("SELECT SCOPE_IDENTITY()", fetch_one=True)
            visita_id = visita_id_result[0] if isinstance(visita_id_result, (tuple, list)) else visita_id_result

            # Guardar en FOTOS_TOTALES con metadatos
            foto_query = """
                INSERT INTO FOTOS_TOTALES 
                (id_visita, categoria, file_path, fecha_registro, id_tipo_foto, Estado,
                 latitud, longitud, altitud, fecha_disparo,
                 fabricante_camara, modelo_camara, iso, apertura,
                 tiempo_exposicion, orientacion)
                VALUES (?, NULL, ?, GETDATE(), 6, 'Aprobada',
                        ?, ?, ?, ?,
                        ?, ?, ?, ?,
                        ?, ?)
            """
            execute_query(foto_query, (
                visita_id,
                filename,
                meta['latitud'], meta['longitud'], meta['altitud'], meta['fecha_disparo'],
                meta['fabricante_camara'], meta['modelo_camara'], meta['iso'], meta['apertura'],
                meta['tiempo_exposicion'], meta['orientacion']
            ), commit=True)

            return jsonify({
                "success": True,
                "message": "Foto de desactivación subida correctamente",
                "file_path": filename,
                "meta": meta
            })

        # ✅ CASOS CON VISITA: precios, gestion, exhibiciones
        # Obtener cliente del punto
        punto_query = """
            SELECT c.id_cliente
            FROM RUTA_PROGRAMACION rp
            JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
            WHERE rp.id_punto_interes = ?
        """
        cliente_result = execute_query(punto_query, (point_id,), fetch_one=True)
        if not cliente_result:
            return jsonify({"success": False, "message": "No se encontró cliente para este punto"}), 404

        cliente_id = cliente_result[0] if isinstance(cliente_result, (tuple, list)) else cliente_result

        # Obtener o crear visita
        visita_query = """
            SELECT TOP 1 id_visita 
            FROM VISITAS_MERCADERISTA 
            WHERE id_cliente = ? AND identificador_punto_interes = ? AND id_mercaderista = ?
            AND tipo_visita != 'Desactivacion'
            ORDER BY id_visita DESC
        """
        visita_result = execute_query(visita_query, (cliente_id, point_id, mercaderista_id), fetch_one=True)

        visita_id = None
        if visita_result:
            visita_id = visita_result[0] if isinstance(visita_result, (tuple, list)) else visita_result

        if not visita_id:
            visita_insert_query = """
                INSERT INTO VISITAS_MERCADERISTA 
                (id_cliente, identificador_punto_interes, id_mercaderista, fecha_visita, estado, tipo_visita)
                VALUES (?, ?, ?, GETDATE(), 'Pendiente', 'Normal')
            """
            execute_query(visita_insert_query, (cliente_id, point_id, mercaderista_id), commit=True)
            visita_id_result = execute_query("SELECT SCOPE_IDENTITY()", fetch_one=True)
            visita_id = visita_id_result[0] if isinstance(visita_id_result, (tuple, list)) else visita_id_result

        # Determinar categoría
        categorias = {
            'precios': 'Precios',
            'gestion': 'Gestión',
            'exhibiciones': 'Exhibiciones'
        }
        categoria = categorias.get(photo_type, 'General')

        # Insertar en FOTOS_TOTALES con metadatos
        foto_query = """
            INSERT INTO FOTOS_TOTALES 
            (id_visita, categoria, file_path, fecha_registro, id_tipo_foto, Estado,
             latitud, longitud, altitud, fecha_disparo,
             fabricante_camara, modelo_camara, iso, apertura,
             tiempo_exposicion, orientacion)
            VALUES (?, ?, ?, GETDATE(), ?, 'Aprobada',
                    ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?)
        """
        execute_query(foto_query, (
            visita_id,
            categoria,
            filename,
            id_tipo_foto,
            meta['latitud'], meta['longitud'], meta['altitud'], meta['fecha_disparo'],
            meta['fabricante_camara'], meta['modelo_camara'], meta['iso'], meta['apertura'],
            meta['tiempo_exposicion'], meta['orientacion']
        ), commit=True)

        return jsonify({
            "success": True,
            "message": f"Foto de {photo_type} subida correctamente",
            "file_path": filename,
            "meta": meta
        })

    except Exception as e:
        print(f"Error en upload-route-photos: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500
    

@merchandisers_bp.route('/api/point-clients1/<string:point_id>')
def get_point_clients(point_id):
    """Obtener clientes para un punto de interés - Acceso para mercaderistas (sin Flask-Login)"""
    try:
        # Obtener la cédula de la sesión
        cedula = session.get('merchandiser_cedula')
        
        if not cedula:
            # Intentar obtener del header si no está en sesión
            cedula = request.headers.get('X-Merchandiser-Cedula')
            
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
            "id": row[0],
            "nombre": row[1],
            "prioridad": row[2] or "Media"
        } for row in clients])
    except Exception as e:
        current_app.logger.error(f"Error en get_point_clients: {str(e)}")
        return jsonify({"error": f"Error interno: {str(e)}"}), 500
    

@merchandisers_bp.route('/api/create-client-visit', methods=['POST'])
def create_client_visit():
    """Crear una visita para un cliente - Acceso solo para mercaderistas (sin Flask-Login)"""
    try:
        data = request.get_json()
        client_id = data.get('client_id')
        point_id = data.get('point_id')
        mercaderista_id = data.get('mercaderista_id')
        id_foto = data.get('id_foto')  # El id_foto de la foto de activación
        
        # Quitar la validación de Flask-Login y usar sesión simple
        # Obtener cédula de la sesión para validación adicional
        cedula_session = session.get('merchandiser_cedula')
        
        if not all([client_id, point_id, mercaderista_id, id_foto]):
            return jsonify({
                "success": False,
                "message": "Datos incompletos para crear visita"
            }), 400
        
        # Verificar que el mercaderista existe y está activo
        mercaderista_query = "SELECT cedula FROM MERCADERISTAS WHERE id_mercaderista = ? AND activo = 1"
        mercaderista = execute_query(mercaderista_query, (mercaderista_id,), fetch_one=True)
        
        if not mercaderista:
            return jsonify({
                "success": False,
                "message": "Mercaderista no encontrado o inactivo"
            }), 404
            
        # Verificar que el punto y cliente existen
        check_query = """
            SELECT 1 
            FROM RUTA_PROGRAMACION rp
            WHERE rp.id_punto_interes = ? 
            AND rp.id_cliente = ?
            AND rp.activa = 1
        """
        check_result = execute_query(check_query, (point_id, client_id), fetch_one=True)
        
        if not check_result:
            return jsonify({
                "success": False,
                "message": "El cliente no está asignado a este punto de interés"
            }), 400
        
        # Verificar que la foto existe y que no tenga visita asignada
        foto_query = """
            SELECT id_foto, id_visita 
            FROM FOTOS_TOTALES 
            WHERE id_foto = ? AND id_tipo_foto = 5
        """
        foto = execute_query(foto_query, (id_foto,), fetch_one=True)
        
        if not foto:
            return jsonify({
                "success": False,
                "message": "La foto de activación no existe"
            }), 404
            
        if foto[1] is not None:  # Si ya tiene id_visita, no se puede usar
            return jsonify({
                "success": False,
                "message": "La foto de activación ya fue asignada a una visita"
            }), 400
            
        # Crear visita
        insert_query = """
            INSERT INTO VISITAS_MERCADERISTA 
            (id_cliente, identificador_punto_interes, id_mercaderista, fecha_visita, estado)
            VALUES (?, ?, ?, GETDATE(), 'Pendiente')
        """
        execute_query(insert_query, (client_id, point_id, mercaderista_id), commit=True)
        
        # Obtener el ID de la visita creada
        visita_id_query = "SELECT SCOPE_IDENTITY()"
        visita_id = execute_query(visita_id_query, fetch_one=True)[0]
        
        # Actualizar la foto de activación con el id_visita
        update_foto_query = """
            UPDATE FOTOS_TOTALES 
            SET id_visita = ?
            WHERE id_foto = ?
        """
        execute_query(update_foto_query, (visita_id, id_foto), commit=True)
        
        return jsonify({
            "success": True,
            "visita_id": visita_id,
            "id_foto": id_foto,
            "message": "Visita creada exitosamente y foto asociada"
        })
        
    except Exception as e:
        print(f"Error en create_client_visit: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Error al crear visita: {str(e)}"
        }), 500
    
@merchandisers_bp.route('/api/upload-additional-photo', methods=['POST'])
def upload_additional_photo():
    try:
        # Obtener datos del formulario
        point_id = request.form.get('point_id')
        cedula = request.form.get('cedula')
        photo_type = request.form.get('photo_type')
        visita_id = request.form.get('visita_id')
        photo = request.files.get('photo')
        
        # Validaciones
        if not all([point_id, cedula, photo_type, visita_id, photo]):
            return jsonify({"success": False, "message": "Datos incompletos"}), 400
            
        # Verificar que el archivo sea una imagen
        if not photo.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            return jsonify({"success": False, "message": "Formato de archivo no válido. Use JPG, PNG o GIF"}), 400
            
        # Mapear tipos de foto a id_tipo_foto
        tipo_foto_map = {
            'precios': 1,
            'gestion': 2, 
            'exhibiciones': 3
        }
        id_tipo_foto = tipo_foto_map.get(photo_type)
        if not id_tipo_foto:
            return jsonify({"success": False, "message": "Tipo de foto no válido"}), 400
            
        # Obtener información del mercaderista
        mercaderista_query = "SELECT id_mercaderista, nombre FROM MERCADERISTAS WHERE cedula = ?"
        mercaderista = execute_query(mercaderista_query, (cedula,), fetch_one=True)
        
        if not mercaderista:
            return jsonify({"success": False, "message": "Mercaderista no encontrado"}), 404

        mercaderista_id = mercaderista[0]
        
        # Obtener información del punto y cliente
        punto_query = """
            SELECT TOP 1 
                pin.punto_de_interes,
                pin.departamento,
                pin.ciudad,
                c.cliente
            FROM VISITAS_MERCADERISTA vm
            JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
            JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
            WHERE vm.id_visita = ?
        """
        punto = execute_query(punto_query, (visita_id,), fetch_one=True)
        
        if not punto:
            return jsonify({"success": False, "message": "Visita no encontrada"}), 404

        punto_nombre = punto[0]
        departamento = punto[1] or "SinDepartamento"
        ciudad = punto[2] or "SinCiudad"
        cliente_nombre = punto[3]
        
        # Generar nombre de archivo único
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{photo_type}_{mercaderista_id}_{point_id}_{timestamp}.jpg"
        
        # 🔴 **USANDO AZURE FILE STORAGE**
        from app.utils.azure_file_storage import azure_storage
        
        # Construir ruta relativa - usar backslash como separador
        fecha_actual = datetime.now().strftime("%Y-%m-%d")
        
        # Mapear tipos de foto a carpetas
        folder_map = {
            'precios': 'precios',
            'gestion': 'gestion', 
            'exhibiciones': 'exhibiciones'
        }
        folder = folder_map.get(photo_type, 'general')
        
        relative_path = f"{departamento}\\{ciudad}\\{punto_nombre}\\{cliente_nombre}\\{fecha_actual}\\{folder}\\{filename}"
        
        # Guardar el archivo
        success, fs_path, db_path, error_msg = azure_storage.save_file(photo, relative_path)
        
        if not success:
            return jsonify({
                "success": False, 
                "message": f"No se pudo guardar el archivo: {error_msg}"
            }), 500
        
        # Determinar categoría según tipo (NULL como solicitaste)
        categorias = {
            'precios': None,
            'gestion': None,
            'exhibiciones': None
        }
        categoria = categorias.get(photo_type)
        
        # Insertar en FOTOS_TOTALES con la ruta con doble barra invertida
        foto_query = """
            INSERT INTO FOTOS_TOTALES 
            (id_visita, categoria, file_path, fecha_registro, id_tipo_foto, Estado)
            VALUES (?, ?, ?, GETDATE(), ?, 'Aprobada')
        """
        execute_query(foto_query, (visita_id, categoria, db_path, id_tipo_foto), commit=True)
        
        return jsonify({
            "success": True, 
            "message": f"Foto de {photo_type} subida correctamente",
            "file_path": db_path,
            "visita_id": visita_id
        })
        
    except Exception as e:
        print(f"Error en upload_additional_photo: {str(e)}")
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500
    

@merchandisers_bp.route('/api/create-visit-from-activation', methods=['POST'])
def create_visit_from_activation():
    try:
        data = request.get_json()
        print("📦 Datos recibidos en create_visit_from_activation:", data)

        client_id = data.get('client_id')
        point_id = data.get('point_id')
        mercaderista_id = data.get('mercaderista_id')
        id_foto = data.get('id_foto')

        print(f"🔍 client_id: {client_id}")
        print(f"🔍 point_id: {point_id}")
        print(f"🔍 mercaderista_id: {mercaderista_id}")
        print(f"🔍 id_foto: {id_foto} (type: {type(id_foto)})")

        if not all([client_id, point_id, mercaderista_id, id_foto]):
            return jsonify({
                "success": False,
                "message": f"Faltan datos: client_id={client_id}, point_id={point_id}, mercaderista_id={mercaderista_id}, id_foto={id_foto}"
            }), 400

        # 🔍 Verificar que la foto existe y no tiene visita asignada
        foto_query = "SELECT id_visita FROM FOTOS_TOTALES WHERE id_foto = ?"
        foto = execute_query(foto_query, (id_foto,), fetch_one=True)

        print(f"🔍 Resultado de consulta de foto: {foto}")

        # Con la nueva execute_query, foto será None si no hay fila o si id_visita es NULL
        if foto is None:
            # La foto no existe (o no tiene visita)
            # Verificar si la foto existe
            check_query = "SELECT COUNT(*) FROM FOTOS_TOTALES WHERE id_foto = ?"
            exists = execute_query(check_query, (id_foto,), fetch_one=True)
            
            if exists == 0:
                return jsonify({
                    "success": False,
                    "message": "La foto no existe"
                }), 400
            # Si existe y foto es None, significa que id_visita es NULL, así que está bien
        elif foto is not None:
            # Si foto no es None, entonces ya tiene un id_visita asignado
            return jsonify({
                "success": False,
                "message": "La foto ya fue asignada a una visita"
            }), 400

        # ✅ Crear visita
        insert_query = """
            INSERT INTO VISITAS_MERCADERISTA 
            (id_cliente, identificador_punto_interes, id_mercaderista, fecha_visita, estado)
            OUTPUT INSERTED.id_visita
            VALUES (?, ?, ?, GETDATE(), 'Pendiente')
        """
        
        # Usar una conexión directa para asegurar que obtenemos el ID
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute(insert_query, (client_id, point_id, mercaderista_id))
            visita_id = cursor.fetchone()[0]
            conn.commit()
            
            print(f"✅ Visita creada con ID: {visita_id}")
            
            # ✅ Actualizar la foto de activación con el id_visita
            update_foto_query = "UPDATE FOTOS_TOTALES SET id_visita = ? WHERE id_foto = ?"
            cursor.execute(update_foto_query, (visita_id, id_foto))
            conn.commit()
            
            print(f"✅ Foto {id_foto} asignada a visita {visita_id}")
            
            return jsonify({
                "success": True,
                "visita_id": visita_id,
                "id_foto": id_foto,
                "message": "Visita creada y foto asignada correctamente"
            })
            
        except Exception as db_error:
            conn.rollback()
            raise db_error
        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        current_app.logger.error(f"Error en create_visit_from_activation: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Error interno: {str(e)}"
        }), 500
    

@merchandisers_bp.route('/api/deactivate-point', methods=['POST'])
def deactivate_point():
    try:
        data = request.get_json()
        point_id = data.get('point_id')
        cedula = data.get('cedula')
        
        if not point_id or not cedula:
            return jsonify({"success": False, "message": "Datos incompletos"}), 400
        
        # Obtener mercaderista
        mercaderista_query = "SELECT id_mercaderista FROM MERCADERISTAS WHERE cedula = ?"
        mercaderista = execute_query(mercaderista_query, (cedula,), fetch_one=True)
        
        if not mercaderista:
            return jsonify({"success": False, "message": "Mercaderista no encontrado"}), 404
            
        mercaderista_id = mercaderista[0]
        
        # Verificar si hay una activación pendiente para este punto
        activacion_query = """
            SELECT TOP 1 vm.id_visita
            FROM VISITAS_MERCADERISTA vm
            JOIN FOTOS_TOTALES ft ON vm.id_visita = ft.id_visita
            WHERE vm.identificador_punto_interes = ?
            AND vm.id_mercaderista = ?
            AND ft.id_tipo_foto = 5
            AND vm.estado = 'Pendiente'
            ORDER BY vm.fecha_visita DESC
        """
        activacion = execute_query(activacion_query, (point_id, mercaderista_id), fetch_one=True)
        
        if activacion:
            # Marcar la visita de activación como completada
            update_query = "UPDATE VISITAS_MERCADERISTA SET estado = 'Completada' WHERE id_visita = ?"
            execute_query(update_query, (activacion[0],), commit=True)
        
        return jsonify({
            "success": True,
            "message": "Punto desactivado correctamente"
        })
        
    except Exception as e:
        print(f"Error en deactivate_point: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500
    

@merchandisers_bp.route('/api/foto/<int:id_foto>/metadatos', methods=['GET'])
def get_foto_metadatos(id_foto):
    row = execute_query("""
        SELECT id_foto, file_path, latitud, longitud, altitud,
               fecha_disparo, fabricante_camara, modelo_camara,
               iso, apertura, tiempo_exposicion, orientacion
        FROM FOTOS_TOTALES
        WHERE id_foto = ?
    """, (id_foto,), fetch_one=True)
    if not row:
        return jsonify({"error": "Foto no encontrada"}), 404
    keys = ['id_foto', 'file_path', 'latitud', 'longitud', 'altitud',
            'fecha_disparo', 'fabricante_camara', 'modelo_camara',
            'iso', 'apertura', 'tiempo_exposicion', 'orientacion']
    return jsonify(dict(zip(keys, row)))


@merchandisers_bp.route('/api/merchandiser-active-points/<cedula>')
def get_active_points(cedula):
    try:
        # 1. id del mercaderista
        mercaderista = execute_query(
            "SELECT id_mercaderista FROM MERCADERISTAS WHERE cedula = ? AND activo = 1",
            (cedula,), fetch_one=True
        )
        if not mercaderista:
            return jsonify([]), 404
        mercaderista_id = mercaderista[0]

        # 2. puntos que tienen al menos una visita pendiente
        sql_points = """
        SELECT DISTINCT
            pi.identificador AS point_id,
            pi.punto_de_interes AS point_name,
            r.nombre AS route_name
        FROM PUNTOS_INTERES1 pi
        JOIN RUTA_PROGRAMACION rp ON pi.identificador = rp.id_punto_interes
        JOIN RUTAS r ON rp.id_ruta = r.id_ruta
        WHERE rp.activa = 1
          AND EXISTS (
              SELECT 1
              FROM VISITAS_MERCADERISTA vm
              WHERE vm.identificador_punto_interes = pi.identificador
                AND vm.estado = 'Pendiente'
                AND vm.id_mercaderista = ?
          )
        """
        points = execute_query(sql_points, (mercaderista_id,))

        # 3. por cada punto, clientes sin visita pendiente
        sql_clients = """
        SELECT
            c.id_cliente AS id,
            c.cliente AS name
        FROM RUTA_PROGRAMACION rp
        JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
        WHERE rp.id_punto_interes = ?
          AND rp.activa = 1
          AND NOT EXISTS (
              SELECT 1
              FROM VISITAS_MERCADERISTA vm
              WHERE vm.identificador_punto_interes = rp.id_punto_interes
                AND vm.id_cliente = c.id_cliente
                AND vm.estado = 'Pendiente'
                AND vm.id_mercaderista = ?
          )
        """
        result = []
        for row in points:
            point_id, point_name, route_name = row
            clients = execute_query(sql_clients, (point_id, mercaderista_id))
            pending_clients = [{"id": c[0], "name": c[1]} for c in clients]
            if pending_clients:          # solo devolver puntos que tengan clientes pendientes
                result.append({
                    "point_id": point_id,
                    "point_name": point_name,
                    "route_name": route_name,
                    "pending_clients": pending_clients
                })
        return jsonify(result)
    except Exception as e:
        current_app.logger.error(f"Error en get_active_points: {e}")
        return jsonify({"error": "Error interno"}), 500


@merchandisers_bp.route('/api/create-visit-simple', methods=['POST'])
def create_visit_simple():
    try:
        data = request.get_json()
        point_id   = data.get('point_id')
        client_id  = data.get('client_id')
        mercaderista_id = data.get('mercadista_id') or data.get('mercaderista_id')

        if not all([point_id, client_id, mercaderista_id]):
            return jsonify({"success": False, "message": "Faltan datos"}), 400

        # verificar que el punto y cliente estén asignados
        check = execute_query(
            """SELECT 1 FROM RUTA_PROGRAMACION
               WHERE id_punto_interes = ? AND id_cliente = ? AND activa = 1""",
            (point_id, client_id), fetch_one=True
        )
        if not check:
            return jsonify({"success": False, "message": "Cliente no asignado a este punto"}), 400

        # crear visita
        insert_sql = """
        INSERT INTO VISITAS_MERCADERISTA
          (id_cliente, identificador_punto_interes, id_mercaderista, fecha_visita, estado)
        VALUES (?, ?, ?, GETDATE(), 'Pendiente')
        """
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(insert_sql, (client_id, point_id, mercaderista_id))
        cursor.execute("SELECT SCOPE_IDENTITY()")
        visita_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"success": True, "visita_id": visita_id})
    except Exception as e:
        current_app.logger.error(f"Error en create_visit_simple: {e}")
        return jsonify({"success": False, "message": "Error interno"}), 500