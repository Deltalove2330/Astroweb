# app/routes/supervisors.py
# app/routes/supervisors.py
from flask import Blueprint, jsonify, request, render_template, current_app
from flask_login import login_required, current_user
from app.utils.database import execute_query
import re, os, uuid, urllib
from datetime import datetime
from flask import current_app, jsonify, request
from werkzeug.utils import secure_filename

supervisors_bp = Blueprint('supervisors', __name__)

@supervisors_bp.route('/')
@login_required
def supervisor_dashboard():
    """Página principal del módulo de supervisor"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    return render_template('supervisor.html')

@supervisors_bp.route('/api/supervisor-rejected-photos')
@login_required
def get_supervisor_rejected_photos():
    """Obtener todas las fotos rechazadas de las rutas del supervisor"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        supervisor_id = current_user.id_supervisor
        
        query = """
        SELECT 
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
            rr.razon AS razon_rechazo,
            fr.descripcion AS descripcion_rechazo,
            m.nombre AS mercaderista,
            a.nombre_analista
        FROM FOTOS_RECHAZADAS fr
        JOIN FOTOS_TOTALES ft ON fr.id_foto_original = ft.id_foto
        JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
        JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
        JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes
        JOIN RUTAS_NUEVAS rn ON rp.id_ruta = rn.id_ruta
        LEFT JOIN RAZONES_RECHAZOS rr ON fr.id_razones_rechazos = rr.id_razones_rechazos
        JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
        JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
        LEFT JOIN ANALISTAS a ON rn.id_analista = a.id_analista
        WHERE 
            TRY_CAST(
                LTRIM(
                    SUBSTRING(
                        rn.supervisor, 
                        CHARINDEX('T', rn.supervisor) + 1, 
                        LEN(rn.supervisor)
                    )
                ) AS INT
            ) = ?
            AND ft.estado = 'Rechazada'
        GROUP BY 
            ft.id_foto, ft.file_path, ft.categoria, vm.fecha_visita, 
            pin.punto_de_interes, pin.Direccion,
            c.cliente, rn.ruta, fr.fecha_registro, fr.fecha_rechazo,
            rr.razon, fr.descripcion, m.nombre, a.nombre_analista
        ORDER BY vm.fecha_visita DESC
        """
        
        photos = execute_query(query, (supervisor_id,))
        
        # Procesar y limpiar las rutas de las fotos
        cleaned_photos = []
        for row in photos:
            # Verificar que tenemos suficientes columnas
            if len(row) < 14:
                continue
                
            cleaned_path = row[1].replace("X://", "").replace("X:/", "").replace("\\", "/")
            
            # Formatear fechas con manejo seguro de NULL
            fecha_registro = "N/A"
            if row[8] is not None:
                try:
                    fecha_registro = row[8].strftime("%d/%m/%Y %H:%M")
                except:
                    fecha_registro = str(row[8])
            
            fecha_rechazo = "N/A"
            if row[9] is not None:
                try:
                    fecha_rechazo = row[9].strftime("%d/%m/%Y %H:%M")
                except:
                    fecha_rechazo = str(row[9])
            
            # Construir la descripción de la razón de rechazo
            razon = row[10] if row[10] else "Otra razón"
            if row[11] and row[11].strip() and "Otra razón" not in razon:
                razon += f": {row[11]}"
            
            # El analista podría ser NULL si no hay relación
            analista = row[13] if row[13] else "Analista no asignado"
            
            # Si punto_de_interes parece ser un código (ej: FTD0103), intentamos usar la dirección
            punto_interes = row[4]
            if not punto_interes or (len(punto_interes) <= 10 and any(char.isdigit() for char in punto_interes)):
                # Si parece ser un código, usamos la dirección si está disponible
                if row[5] and row[5].strip():
                    punto_interes = row[5]
                else:
                    punto_interes = f"Punto {row[4] if row[4] else 'desconocido'}"
            
            cleaned_photos.append({
                "id": row[0],
                "file_path": cleaned_path,
                "categoria": row[2] if row[2] else "Sin categoría",
                "fecha_visita": row[3].strftime("%d/%m/%Y") if row[3] else "N/A",
                "punto_de_interes": punto_interes,
                "direccion": row[5] if row[5] else "",
                "cliente": row[6],
                "ruta": row[7],
                "fecha_registro": fecha_registro,
                "fecha_rechazo": fecha_rechazo,
                "razon_rechazo": razon,
                "mercaderista": row[12],
                "analista_rechazo": analista
            })
            
        return jsonify(cleaned_photos)
    
    except Exception as e:
        current_app.logger.error(f"Error en get_supervisor_rejected_photos: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@supervisors_bp.route('/api/replace-rejected-photo', methods=['POST'])
@login_required
def replace_rejected_photo():
    """Reemplazar una foto rechazada con una nueva foto"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        # Verificar que se haya subido un archivo
        if 'photo' not in request.files:
            return jsonify({"success": False, "message": "No se ha seleccionado ninguna foto"}), 400
        
        photo = request.files['photo']
        photo_id = request.form.get('photo_id')
        
        if not photo_id:
            return jsonify({"success": False, "message": "ID de foto requerido"}), 400
        
        # Validar que el archivo sea una imagen
        if photo.filename == '':
            return jsonify({"success": False, "message": "Nombre de archivo vacío"}), 400
        
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
        file_ext = photo.filename.rsplit('.', 1)[1].lower() if '.' in photo.filename else ''
        if file_ext not in allowed_extensions:
            return jsonify({"success": False, "message": "Formato de archivo no permitido"}), 400
        
        # Obtener información de la foto original
        query = """
        SELECT ft.file_path, ft.id_visita, vm.identificador_punto_interes, vm.id_mercaderista
        FROM FOTOS_TOTALES ft
        JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
        WHERE ft.id_foto = ?
        """
        photo_info = execute_query(query, (photo_id,), fetch_one=True)
        
        if not photo_info:
            return jsonify({"success": False, "message": "Foto no encontrada"}), 404
        
        # Procesamiento robusto de la ruta
        original_path = photo_info[0]
        current_app.logger.info(f"Ruta original recibida: {original_path}")
        
        # Normalizar la ruta para el sistema operativo actual
        normalized_path = original_path.replace("\\", os.sep).replace("/", os.sep)
        
        # Eliminar prefijos comunes
        if normalized_path.startswith("X:" + os.sep):
            normalized_path = normalized_path[3:]
        elif normalized_path.startswith("X:"):
            normalized_path = normalized_path[2:]
            
        # Dividir la ruta en partes
        path_parts = normalized_path.split(os.sep)
        
        # Verificar que tengamos suficientes partes
        # Esperamos: [Departamento, Ciudad, Punto, Cliente, Fecha, Categoria, Archivo]
        if len(path_parts) < 7:
            current_app.logger.error(f"Formato de ruta no válido. Partes encontradas: {len(path_parts)}, Ruta: {normalized_path}")
            return jsonify({"success": False, "message": "Formato de ruta no válido"}), 500
        
        # Extraer las partes necesarias
        departamento = path_parts[-7]
        ciudad = path_parts[-6]
        punto = path_parts[-5]
        cliente = path_parts[-4]
        fecha = path_parts[-3]
        categoria = path_parts[-2]
        
        # Obtener la configuración del directorio de fotos
        photos_dir = current_app.config.get('PHOTOS_DIR', 'X:/')
        
        # Asegurar que photos_dir termine con el separador de ruta adecuado
        if not photos_dir.endswith(os.sep):
            photos_dir += os.sep
            
        # Crear la ruta física completa usando os.path.join para manejar correctamente las barras
        full_dir = os.path.join(photos_dir, departamento, ciudad, punto, cliente, fecha, categoria)
        
        # Crear el directorio si no existe
        os.makedirs(full_dir, exist_ok=True)
        current_app.logger.info(f"Directorio creado: {full_dir}")
        
        # Generar nuevo nombre de archivo único
        new_filename = f"reemplazo_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex}.{file_ext}"
        
        # Guardar la foto en el sistema de archivos
        system_path = os.path.join(full_dir, new_filename)
        photo.save(system_path)
        current_app.logger.info(f"Foto guardada en: {system_path}")
        
        # Crear la ruta relativa para la base de datos
        # Usamos barras normales para la base de datos
        db_path = f"{departamento}/{ciudad}/{punto}/{cliente}/{fecha}/{categoria}/{new_filename}"
        
        # Actualizar la foto en la base de datos
        update_query = """
        UPDATE FOTOS_TOTALES
        SET file_path = ?, estado = 'Aprobada'
        WHERE id_foto = ?
        """
        execute_query(update_query, (db_path, photo_id), commit=True)
        
        # Eliminar de FOTOS_RECHAZADAS
        delete_rejected_query = """
        DELETE FROM FOTOS_RECHAZADAS
        WHERE id_foto_original = ?
        """
        execute_query(delete_rejected_query, (photo_id,), commit=True)
        
        return jsonify({
            "success": True,
            "message": "Foto reemplazada exitosamente",
            "new_path": db_path,
            "image_url": f"/api/image/{urllib.parse.quote(db_path)}"
        })
    
    except Exception as e:
        current_app.logger.error(f"Error reemplazando foto: {str(e)}", exc_info=True)
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500

@supervisors_bp.route('/api/supervisor-photos/<string:estado>')
@login_required
def get_supervisor_photos(estado):
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403

    try:
        supervisor_id = current_user.id_supervisor
        
        # Normalizar el estado para coincidir con la base de datos
        estado_db = estado
        if estado == 'rechazadas':
            estado_db = 'Rechazada'
        elif estado == 'aprobada':
            estado_db = 'Aprobada'
        elif estado == 'pendiente':
            estado_db = 'Pendiente'
        elif estado == 'no revisado':
            estado_db = 'No Revisado'
        else:
            return jsonify({"error": "Estado no válido"}), 400

        # Determinar consulta según el estado
        if estado == 'rechazadas':
            query = """
                SELECT DISTINCT ft.id_foto, ft.file_path, ft.categoria, vm.fecha_visita,
                       pin.punto_de_interes, pin.Direccion, c.cliente, rn.ruta,
                       fr.fecha_registro, fr.fecha_rechazo, rr.razon, fr.descripcion,
                       m.nombre AS mercaderista, a.nombre_analista
                FROM FOTOS_RECHAZADAS fr
                JOIN FOTOS_TOTALES ft ON fr.id_foto_original = ft.id_foto
                JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
                JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
                JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes
                JOIN RUTAS_NUEVAS rn ON rp.id_ruta = rn.id_ruta
                LEFT JOIN RAZONES_RECHAZOS rr ON fr.id_razones_rechazos = rr.id_razones_rechazos
                JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
                JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
                LEFT JOIN ANALISTAS a ON rn.id_analista = a.id_analista
                WHERE TRY_CAST(LTRIM(SUBSTRING(rn.supervisor, CHARINDEX('T', rn.supervisor) + 1, LEN(rn.supervisor))) AS INT) = ?
                  AND ft.estado = 'Rechazada'
                GROUP BY ft.id_foto, ft.file_path, ft.categoria, vm.fecha_visita, 
                         pin.punto_de_interes, pin.Direccion, c.cliente, rn.ruta,
                         fr.fecha_registro, fr.fecha_rechazo, rr.razon, fr.descripcion,
                         m.nombre, a.nombre_analista
            """
            params = (supervisor_id,)
        else:
            query = """
                SELECT DISTINCT ft.id_foto, ft.file_path, ft.categoria, vm.fecha_visita,
                       pin.punto_de_interes, pin.Direccion, c.cliente, rn.ruta,
                       ft.fecha_registro, NULL AS fecha_rechazo, NULL AS razon, NULL AS descripcion,
                       m.nombre AS mercaderista, a.nombre_analista, ft.estado
                FROM FOTOS_TOTALES ft
                JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
                JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
                JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes
                JOIN RUTAS_NUEVAS rn ON rp.id_ruta = rn.id_ruta
                JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
                JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
                LEFT JOIN ANALISTAS a ON rn.id_analista = a.id_analista
                WHERE TRY_CAST(LTRIM(SUBSTRING(rn.supervisor, CHARINDEX('T', rn.supervisor) + 1, LEN(rn.supervisor))) AS INT) = ?
                  AND ft.estado = ?
                GROUP BY ft.id_foto, ft.file_path, ft.categoria, vm.fecha_visita, 
                         pin.punto_de_interes, pin.Direccion, c.cliente, rn.ruta,
                         ft.fecha_registro, m.nombre, a.nombre_analista, ft.estado
            """
            params = (supervisor_id, estado_db)

        photos = execute_query(query, params)
        
        # Procesar y limpiar los datos para la respuesta
        cleaned_photos = []
        for row in photos:
            # Limpiar y formatear la ruta de la foto
            cleaned_path = row[1].replace("X://", "").replace("X:/", "").replace("\\", "/")
            
            # Formatear fechas
            fecha_visita = row[3].strftime("%d/%m/%Y") if row[3] else "N/A"
            
            # Manejar fecha_registro
            fecha_registro = "N/A"
            if row[8] is not None:
                try:
                    fecha_registro = row[8].strftime("%d/%m/%Y %H:%M")
                except:
                    fecha_registro = str(row[8])
            
            # Manejar fecha_rechazo y razón (solo para fotos rechazadas)
            fecha_rechazo = "N/A"
            razon_rechazo = None
            if estado == 'rechazadas':
                if row[9] is not None:
                    try:
                        fecha_rechazo = row[9].strftime("%d/%m/%Y %H:%M")
                    except:
                        fecha_rechazo = str(row[9])
                razon_rechazo = row[10] if row[10] else "Otra razón"
                if row[11] and row[11].strip() and "Otra razón" not in razon_rechazo:
                    razon_rechazo += f": {row[11]}"
            
            # Manejar analista
            analista_rechazo = row[13] if row[13] else "N/A"
            
            # Determinar estado para los casos no rechazados
            estado_foto = row[14] if len(row) > 14 and row[14] else estado_db
            
            # Si punto_de_interes parece ser un código, intentamos usar la dirección
            punto_interes = row[4]
            if not punto_interes or (len(punto_interes) <= 10 and any(char.isdigit() for char in punto_interes)):
                if row[5] and row[5].strip():
                    punto_interes = row[5]
                else:
                    punto_interes = f"Punto {row[4] if row[4] else 'desconocido'}"
            
            cleaned_photos.append({
                "id_foto": row[0],
                "file_path": cleaned_path,
                "categoria": row[2] if row[2] else "Sin categoría",
                "fecha_visita": fecha_visita,
                "punto_de_interes": punto_interes,
                "direccion": row[5] if row[5] else "",
                "cliente": row[6],
                "ruta": row[7],
                "fecha_registro": fecha_registro,
                "fecha_rechazo": fecha_rechazo,
                "razon_rechazo": razon_rechazo,
                "mercaderista": row[12],
                "analista_rechazo": analista_rechazo,
                "estado": estado_foto
            })
            
        return jsonify(cleaned_photos)

    except Exception as e:
        current_app.logger.error(f"Error en get_supervisor_photos: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500