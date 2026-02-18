# app/routes/supervisors.py
from flask import Blueprint, jsonify, request, render_template, current_app
from flask_login import login_required, current_user
from app.utils.database import execute_query
import os, uuid, urllib
from datetime import datetime
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
            ft.id_foto, ft.file_path, ft.categoria, vm.fecha_visita,
            pin.punto_de_interes, pin.Direccion, c.cliente, rn.ruta,
            fr.fecha_registro, fr.fecha_rechazo, rr.razon AS razon_rechazo,
            fr.descripcion AS descripcion_rechazo, m.nombre AS mercaderista,
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
                LTRIM(SUBSTRING(rn.supervisor, CHARINDEX('T', rn.supervisor) + 1, LEN(rn.supervisor)))
                AS INT
            ) = ?
            AND ft.estado = 'Rechazada'
        GROUP BY 
            ft.id_foto, ft.file_path, ft.categoria, vm.fecha_visita, 
            pin.punto_de_interes, pin.Direccion, c.cliente, rn.ruta,
            fr.fecha_registro, fr.fecha_rechazo, rr.razon, fr.descripcion,
            m.nombre, a.nombre_analista
        ORDER BY vm.fecha_visita DESC
        """
        
        photos = execute_query(query, (supervisor_id,))
        
        cleaned_photos = []
        for row in photos:
            if len(row) < 14:
                continue
                
            cleaned_path = row[1].replace("X://", "").replace("X:/", "").replace("\\", "/")

            if cleaned_path.startswith("/"):
                cleaned_path = cleaned_path[1:]

            
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
            
            razon = row[10] if row[10] else "Otra razón"
            if row[11] and row[11].strip() and "Otra razón" not in razon:
                razon += f": {row[11]}"
            
            analista = row[13] if row[13] else "Analista no asignado"
            
            punto_interes = row[4]
            if not punto_interes or (len(punto_interes) <= 10 and any(char.isdigit() for char in punto_interes)):
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
        if 'photo' not in request.files:
            return jsonify({"success": False, "message": "No se ha seleccionado ninguna foto"}), 400
        
        photo = request.files['photo']
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
        current_app.logger.info(f"🔍 Ruta original: {original_path}")

        clean_path = original_path.replace("X://", "").replace("X:/", "").replace("\\", "/")
        if clean_path.startswith("/"):
            clean_path = clean_path[1:]

        current_app.logger.info(f"🔍 Ruta limpia: {clean_path}")

        path_parts = clean_path.split("/")

        if len(path_parts) < 7:
            current_app.logger.error(f"❌ Formato de ruta no válido: {clean_path}")
            return jsonify({"success": False, "message": "Formato de ruta no válido"}), 500
        
        departamento = path_parts[0]
        ciudad = path_parts[1]
        punto = path_parts[2]
        cliente = path_parts[3]
        fecha = path_parts[4]
        categoria = path_parts[5]

        current_app.logger.info(f"📂 Componentes: {departamento}/{ciudad}/{punto}/{cliente}/{fecha}/{categoria}")

# 🔥 USAR AZURE BLOB STORAGE
        connection_string = current_app.config.get('AZURE_STORAGE_CONNECTION_STRING')
        container_name = current_app.config.get('AZURE_CONTAINER_NAME', 'epran')

        new_filename = f"reemplazo_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex}.{file_ext}"

# Construir ruta en Blob Storage (con /)
        blob_path = f"{departamento}/{ciudad}/{punto}/{cliente}/{fecha}/{categoria}/{new_filename}"

        current_app.logger.info(f"☁️  Subiendo a Blob Storage: {blob_path}")

        try:

    # Crear cliente de Blob Storage
            blob_service_client = BlobServiceClient.from_connection_string(connection_string)
            blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_path)
            
            # Reposicionar el puntero del archivo al inicio
            photo.seek(0)
            
            # Subir el archivo
            blob_client.upload_blob(photo, overwrite=True)
            
            current_app.logger.info(f"✅ Foto subida exitosamente a Blob Storage")
            
            # Ruta para guardar en BD (igual que blob_path)
            db_path = blob_path

        except Exception as e:
            current_app.logger.error(f"❌ Error subiendo a Azure: {str(e)}")
            return jsonify({"success": False, "message": f"Error al subir: {str(e)}"}), 500


        
        update_query = """
            UPDATE FOTOS_TOTALES
            SET file_path = ?,
            estado = 'Rechazada',
            veces_reemplazada = ISNULL(veces_reemplazada, 0) + 1
            WHERE id_foto = ?
        """
        execute_query(update_query, (db_path, photo_id), commit=True)
        
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
        
        cleaned_photos = []
        for row in photos:

            # Limpiar ruta para Azure Blob Storage
            cleaned_path = row[1].replace("X://", "").replace("X:/", "").replace("\\", "/")
            if cleaned_path.startswith("/"):
                cleaned_path = cleaned_path[1:]

            
            fecha_visita = row[3].strftime("%d/%m/%Y") if row[3] else "N/A"
            
            fecha_registro = "N/A"
            if row[8] is not None:
                try:
                    fecha_registro = row[8].strftime("%d/%m/%Y %H:%M")
                except:
                    fecha_registro = str(row[8])
            
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
            
            analista_rechazo = row[13] if row[13] else "N/A"
            estado_foto = row[14] if len(row) > 14 and row[14] else estado_db
            
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
    
'''# ===== RUTAS PARA CRUD DE PRODUCTOS =====

@supervisors_bp.route('/productos')
@login_required
def supervisor_productos():
    """Página de gestión de productos para supervisor"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    return render_template('supervisor_productos.html')

@supervisors_bp.route('/api/productos')
@login_required
def get_productos():
    """Obtener todos los productos"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    try:
        query = """
        SELECT ID_PRODUCT, SKUs, Categoria, Fabricante,
               Tipo_de_servicio, Tipo_de_fabricante, cod_bar, inagotable
        FROM PRODUCTS
        ORDER BY SKUs
        """
        productos = execute_query(query)
        productos_list = []
        for row in productos:
            productos_list.append({
                "id_product": row[0],
                "skus": row[1],
                "categoria": row[2],
                "fabricante": row[3],
                "tipo_de_servicio": row[4],  # Índice corregido
                "tipo_de_fabricante": row[5],  # Índice corregido
                "cod_bar": row[6],  # Índice corregido
                "inagotable": bool(row[7]) if row[7] is not None else False  # Índice corregido
            })
        return jsonify(productos_list)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo productos: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@supervisors_bp.route('/api/productos/<int:id>')
@login_required
def get_producto(id):
    """Obtener un producto específico"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    try:
        query = """
        SELECT ID_PRODUCT, SKUs, Categoria, Fabricante,
               Tipo_de_servicio, Tipo_de_fabricante, cod_bar, inagotable
        FROM PRODUCTS
        WHERE ID_PRODUCT = ?
        """
        producto = execute_query(query, (id,), fetch_one=True)
        if not producto:
            return jsonify({"error": "Producto no encontrado"}), 404
        return jsonify({
            "id_product": producto[0],
            "skus": producto[1],
            "categoria": producto[2],
            "fabricante": producto[3],
            "tipo_de_servicio": producto[4],  # Índice corregido
            "tipo_de_fabricante": producto[5],  # Índice corregido
            "cod_bar": producto[6],  # Índice corregido
            "inagotable": bool(producto[7]) if producto[7] is not None else False  # Índice corregido
        })
    except Exception as e:
        current_app.logger.error(f"Error obteniendo producto: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@supervisors_bp.route('/api/productos', methods=['POST'])
@login_required
def crear_producto():
    """Crear un nuevo producto"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    try:
        data = request.get_json()
        # Validar campos requeridos
        if not data.get('skus'):
            return jsonify({"error": "SKU es requerido"}), 400
        
        query = """
        INSERT INTO PRODUCTS (SKUs, Categoria, Fabricante,
                             Tipo_de_servicio, Tipo_de_fabricante, cod_bar, inagotable)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        params = (
            data['skus'],
            data.get('categoria'),
            data.get('fabricante'),
            data.get('tipo_de_servicio'),
            data.get('tipo_de_fabricante'),
            data.get('cod_bar'),
            1 if data.get('inagotable', False) else 0
        )
        execute_query(query, params, commit=True)
        return jsonify({"success": True, "message": "Producto creado exitosamente"})
    except Exception as e:
        current_app.logger.error(f"Error creando producto: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@supervisors_bp.route('/api/productos/<int:id>', methods=['PUT'])
@login_required
def actualizar_producto(id):
    """Actualizar un producto"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        data = request.get_json()
        
        query = """
        UPDATE PRODUCTS 
        SET SKUs = ?, Categoria = ?, Fabricante = ?, 
            Tipo_de_servicio = ?, Tipo_de_fabricante = ?, cod_bar = ?, inagotable = ?
        WHERE ID_PRODUCT = ?
        """
        
        params = (
            data.get('skus'),
            data.get('categoria'),
            data.get('fabricante'),
            data.get('tipo_de_servicio'),
            data.get('tipo_de_fabricante'),
            data.get('cod_bar'),
            1 if data.get('inagotable', False) else 0,
            id
        )
        
        execute_query(query, params, commit=True)
        
        return jsonify({"success": True, "message": "Producto actualizado exitosamente"})
    
    except Exception as e:
        current_app.logger.error(f"Error actualizando producto: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@supervisors_bp.route('/api/productos/<int:id>', methods=['DELETE'])
@login_required
def eliminar_producto(id):
    """Eliminar un producto"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        query = "DELETE FROM PRODUCTS WHERE ID_PRODUCT = ?"
        execute_query(query, (id,), commit=True)
        
        return jsonify({"success": True, "message": "Producto eliminado exitosamente"})
    
    except Exception as e:
        current_app.logger.error(f"Error eliminando producto: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@supervisors_bp.route('/api/productos/categorias')
@login_required
def get_categorias():
    """Obtener todas las categorías distintas"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        query = "SELECT DISTINCT Categoria FROM PRODUCTS WHERE Categoria IS NOT NULL ORDER BY Categoria"
        categorias = execute_query(query)
        
        return jsonify([row[0] for row in categorias if row[0]])
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo categorías: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@supervisors_bp.route('/api/productos/fabricantes')
@login_required
def get_fabricantes():
    """Obtener todos los fabricantes (clientes)"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        query = "SELECT DISTINCT cliente FROM CLIENTES ORDER BY cliente"
        fabricantes = execute_query(query)
        
        return jsonify([row[0] for row in fabricantes if row[0]])
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo fabricantes: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@supervisors_bp.route('/api/productos/tipos-servicio')
@login_required
def get_tipos_servicio():
    """Obtener todos los tipos de servicio distintos"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        query = "SELECT DISTINCT Tipo_de_servicio FROM PRODUCTS WHERE Tipo_de_servicio IS NOT NULL ORDER BY Tipo_de_servicio"
        tipos = execute_query(query)
        
        return jsonify([row[0] for row in tipos if row[0]])
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo tipos de servicio: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@supervisors_bp.route('/api/productos/tipos-fabricante')
@login_required
def get_tipos_fabricante():
    """Obtener todos los tipos de fabricante distintos"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        query = "SELECT DISTINCT Tipo_de_fabricante FROM PRODUCTS WHERE Tipo_de_fabricante IS NOT NULL ORDER BY Tipo_de_fabricante"
        tipos = execute_query(query)
        
        return jsonify([row[0] for row in tipos if row[0]])
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo tipos de fabricante: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500'''
    
'''@supervisors_bp.route('/pdv')
@login_required
def supervisor_pdv():
    """Página de gestión de puntos de interés para supervisor"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    return render_template('supervisor_pdv.html')

@supervisors_bp.route('/api/pdv')
@login_required
def get_pdv():
    """Obtener todos los puntos de interés"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        query = """
        SELECT TOP 1000 
            punto_de_interes, identificador, Direccion, latitud, longitud,
            departamento, jerarquia_nivel_2, jerarquia_nivel_2_2, radio,
            tiempo_minimo_de_visita, fecha_creado, ciudad, clasificacion_de_canal,
            nivel_de_alcance, rif
        FROM PUNTOS_INTERES1
        ORDER BY fecha_creado DESC
        """
        pdvs = execute_query(query)
        
        pdvs_list = []
        for row in pdvs:
            # Manejo seguro de fecha_creado
            fecha_creado = row[10]
            fecha_formateada = None
            
            if fecha_creado:
                if isinstance(fecha_creado, datetime):
                    # Si es un objeto datetime, formatearlo
                    fecha_formateada = fecha_creado.strftime("%d/%m/%Y")
                elif isinstance(fecha_creado, str):
                    # Si ya es string, mantenerlo tal cual
                    fecha_formateada = fecha_creado
                else:
                    # Para cualquier otro tipo, convertirlo a string
                    fecha_formateada = str(fecha_creado)
            
            pdvs_list.append({
                "id": row[1],  # identificador como ID
                "identificador": row[1],
                "punto_de_interes": row[0],
                "direccion": row[2],
                "latitud": row[3],
                "longitud": row[4],
                "departamento": row[5],
                "jerarquia_nivel_2": row[6],
                "jerarquia_nivel_2_2": row[7],
                "radio": row[8],
                "tiempo_minimo_de_visita": row[9],
                "fecha_creado": fecha_formateada,
                "ciudad": row[11],
                "clasificacion_de_canal": row[12],
                "nivel_de_alcance": row[13],
                "rif": row[14]
            })
        
        return jsonify(pdvs_list)
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo puntos de interés: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@supervisors_bp.route('/api/pdv/<string:identificador>')
@login_required
def get_pdv_by_id(identificador):
    """Obtener un punto de interés específico por identificador"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        query = """
        SELECT 
            punto_de_interes, identificador, Direccion, latitud, longitud,
            departamento, jerarquia_nivel_2, jerarquia_nivel_2_2, radio,
            tiempo_minimo_de_visita, fecha_creado, ciudad, clasificacion_de_canal,
            nivel_de_alcance, rif
        FROM PUNTOS_INTERES1
        WHERE identificador = ?
        """
        pdv = execute_query(query, (identificador,), fetch_one=True)
        
        if not pdv:
            return jsonify({"error": "Punto de interés no encontrado"}), 404
        
        # Manejo seguro de fecha_creado
        fecha_creado = pdv[10]
        fecha_formateada = None
        
        if fecha_creado:
            if isinstance(fecha_creado, datetime):
                fecha_formateada = fecha_creado.strftime("%d/%m/%Y")
            elif isinstance(fecha_creado, str):
                fecha_formateada = fecha_creado
            else:
                fecha_formateada = str(fecha_creado)
        
        return jsonify({
            "id": pdv[1],
            "identificador": pdv[1],
            "punto_de_interes": pdv[0],
            "direccion": pdv[2],
            "latitud": pdv[3],
            "longitud": pdv[4],
            "departamento": pdv[5],
            "jerarquia_nivel_2": pdv[6],
            "jerarquia_nivel_2_2": pdv[7],
            "radio": pdv[8],
            "tiempo_minimo_de_visita": pdv[9],
            "fecha_creado": fecha_formateada,
            "ciudad": pdv[11],
            "clasificacion_de_canal": pdv[12],
            "nivel_de_alcance": pdv[13],
            "rif": pdv[14]
        })
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo punto de interés: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@supervisors_bp.route('/api/pdv', methods=['POST'])
@login_required
def crear_pdv():
    """Crear un nuevo punto de interés"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        data = request.get_json()
        
        # Validar campos requeridos
        if not data.get('punto_de_interes'):
            return jsonify({"success": False, "message": "Nombre del punto es requerido"}), 400
        if not data.get('direccion'):
            return jsonify({"success": False, "message": "Dirección es requerida"}), 400
        if not data.get('latitud') or not data.get('longitud'):
            return jsonify({"success": False, "message": "Coordenadas son requeridas"}), 400
        if not data.get('jerarquia_nivel_2_2'):
            return jsonify({"success": False, "message": "Jerarquía nivel 2_2 es requerida para generar el identificador"}), 400
        
        jerarquia = data['jerarquia_nivel_2_2']
        
        # PRIMERO: Buscar si ya existen identificadores para esta jerarquía
        query_existentes = """
        SELECT identificador 
        FROM PUNTOS_INTERES1 
        WHERE jerarquia_nivel_2_2 = ?
        ORDER BY identificador DESC
        """
        resultados = execute_query(query_existentes, (jerarquia,))
        
        identificador_generado = None
        prefijo_usado = None
        
        if resultados:
            # Hay identificadores existentes para esta jerarquía
            # Tomar el último y sumarle 1
            ultimo_identificador = resultados[0][0]
            
            if ultimo_identificador and len(ultimo_identificador) >= 7:
                prefijo = ultimo_identificador[:3]
                numero_str = ultimo_identificador[3:7]
                
                try:
                    numero = int(numero_str)
                    siguiente_numero = numero + 1
                    identificador_generado = f"{prefijo}{siguiente_numero:04d}"
                    prefijo_usado = prefijo
                except (ValueError, IndexError):
                    # Si hay error en el formato, continuar con lógica normal
                    pass
        
        if not identificador_generado:
            # SEGUNDO: No hay identificadores existentes o hubo error
            # Generar basado en las primeras 3 letras de la jerarquía
            iniciales = ''.join(jerarquia.split())[:3].upper()
            
            if len(iniciales) < 3:
                iniciales = iniciales.ljust(3, 'X')
            
            # Verificar si ya existe algún identificador con estas iniciales
            query_prefijo = """
            SELECT identificador 
            FROM PUNTOS_INTERES1 
            WHERE identificador LIKE ? 
            ORDER BY identificador DESC
            """
            resultados_prefijo = execute_query(query_prefijo, (f"{iniciales}%",))
            
            max_numero = 0
            if resultados_prefijo:
                for row in resultados_prefijo:
                    identificador = row[0]
                    if identificador and identificador.startswith(iniciales) and len(identificador) >= 7:
                        try:
                            numero_str = identificador[len(iniciales):len(iniciales)+4]
                            numero = int(numero_str)
                            if numero > max_numero:
                                max_numero = numero
                        except (ValueError, IndexError):
                            continue
            
            siguiente_numero = max_numero + 1
            identificador_generado = f"{iniciales}{siguiente_numero:04d}"
            prefijo_usado = iniciales
        
        # Verificar si el identificador generado ya existe
        check_query = "SELECT COUNT(*) FROM PUNTOS_INTERES1 WHERE identificador = ?"
        result = execute_query(check_query, (identificador_generado,), fetch_one=True)
        
        if isinstance(result, tuple):
            count = result[0]
        elif isinstance(result, int):
            count = result
        else:
            count = 0
        
        if count > 0:
            # Si por alguna razón ya existe, buscar el siguiente disponible
            prefijo = prefijo_usado
            siguiente_numero_base = int(identificador_generado[3:7])
            
            for i in range(1, 1000):
                identificador_alternativo = f"{prefijo}{(siguiente_numero_base + i):04d}"
                check_alt = execute_query(check_query, (identificador_alternativo,), fetch_one=True)
                if isinstance(check_alt, tuple):
                    count_alt = check_alt[0]
                elif isinstance(check_alt, int):
                    count_alt = check_alt
                else:
                    count_alt = 0
                
                if count_alt == 0:
                    identificador_generado = identificador_alternativo
                    break
        
        # Resto del código (verificación de puntos cercanos e inserción)...
        # Verificar si hay un punto de interés cercano (dentro de 0.001 grados ~ 111 metros)
        lat = float(data['latitud'])
        lng = float(data['longitud'])
        tolerancia = 0.001  # Aproximadamente 111 metros
        
        # Consulta para encontrar puntos cercanos
        cerca_query = """
        SELECT identificador, punto_de_interes, latitud, longitud
        FROM PUNTOS_INTERES1
        WHERE ABS(CAST(latitud AS FLOAT) - ?) <= ? 
          AND ABS(CAST(longitud AS FLOAT) - ?) <= ?
        """
        puntos_cercanos = execute_query(cerca_query, (lat, tolerancia, lng, tolerancia))
        
        if puntos_cercanos:
            # Hay al menos un punto cercano
            punto = puntos_cercanos[0]  # Tomamos el primero
            distancia_lat = abs(float(punto[2]) - lat)
            distancia_lng = abs(float(punto[3]) - lng)
            distancia_aproximada = ((distancia_lat * 111000) ** 2 + (distancia_lng * 111000) ** 2) ** 0.5
            
            return jsonify({
                "success": False, 
                "message": f"Ya existe un punto de interés cercano a esta ubicación: {punto[1]} (ID: {punto[0]}) a {distancia_aproximada:.0f} metros. ¿Desea editarlo?",
                "punto_existente": {
                    "identificador": punto[0],
                    "nombre": punto[1],
                    "latitud": punto[2],
                    "longitud": punto[3]
                }
            }), 400
        
        # Insertar nuevo punto de interés
        query = """
        INSERT INTO PUNTOS_INTERES1 (
            punto_de_interes, identificador, Direccion, latitud, longitud,
            departamento, jerarquia_nivel_2, jerarquia_nivel_2_2, radio,
            tiempo_minimo_de_visita, fecha_creado, ciudad, clasificacion_de_canal,
            nivel_de_alcance, rif, coordenadas_geography
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE(), ?, ?, ?, ?, 
            geography::Point(?, ?, 4326))
        """
        
        params = (
            data['punto_de_interes'],
            identificador_generado,
            data['direccion'],
            data['latitud'],
            data['longitud'],
            data.get('departamento'),
            data.get('jerarquia_nivel_2'),
            data.get('jerarquia_nivel_2_2'),
            data.get('radio', 100),
            15,  # tiempo_minimo_de_visita por defecto
            data.get('ciudad'),
            data.get('clasificacion_de_canal'),
            data.get('nivel_de_alcance'),
            data.get('rif'),
            data['latitud'],
            data['longitud']
        )
        
        execute_query(query, params, commit=True)
        
        return jsonify({
            "success": True,
            "message": "Punto de interés creado exitosamente",
            "identificador": identificador_generado
        })
    
    except Exception as e:
        current_app.logger.error(f"Error creando punto de interés: {str(e)}")
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500

@supervisors_bp.route('/api/pdv/<string:identificador>', methods=['PUT'])
@login_required
def actualizar_pdv(identificador):
    """Actualizar un punto de interés existente"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        data = request.get_json()
        
        # Verificar si el punto de interés existe
        check_query = "SELECT COUNT(*) FROM PUNTOS_INTERES1 WHERE identificador = ?"
        result = execute_query(check_query, (identificador,), fetch_one=True)
        
        if isinstance(result, tuple):
            count = result[0]
        elif isinstance(result, int):
            count = result
        else:
            count = 0
        
        if count == 0:
            return jsonify({"success": False, "message": "Punto de interés no encontrado"}), 404
        
        # Si el identificador en los datos es diferente al de la URL, verificar que no exista otro con ese identificador
        nuevo_identificador = data.get('identificador')
        if nuevo_identificador and nuevo_identificador != identificador:
            check_identificador_query = "SELECT COUNT(*) FROM PUNTOS_INTERES1 WHERE identificador = ?"
            result_identificador = execute_query(check_identificador_query, (nuevo_identificador,), fetch_one=True)
            if isinstance(result_identificador, tuple):
                count_identificador = result_identificador[0]
            elif isinstance(result_identificador, int):
                count_identificador = result_identificador
            else:
                count_identificador = 0
            
            if count_identificador > 0:
                return jsonify({"success": False, "message": "El identificador ya existe en otro punto de interés"}), 400
        
        # Verificar si hay un punto de interés cercano (dentro de 0.001 grados ~ 111 metros) excluyendo el actual
        lat = float(data.get('latitud', 0))
        lng = float(data.get('longitud', 0))
        tolerancia = 0.001  # Aproximadamente 111 metros
        
        # Consulta para encontrar puntos cercanos excluyendo el actual
        cerca_query = """
        SELECT identificador, punto_de_interes, latitud, longitud
        FROM PUNTOS_INTERES1
        WHERE identificador != ? 
          AND ABS(CAST(latitud AS FLOAT) - ?) <= ? 
          AND ABS(CAST(longitud AS FLOAT) - ?) <= ?
        """
        puntos_cercanos = execute_query(cerca_query, (identificador, lat, tolerancia, lng, tolerancia))
        
        if puntos_cercanos:
            # Hay al menos un punto cercano
            punto = puntos_cercanos[0]  # Tomamos el primero
            distancia_lat = abs(float(punto[2]) - lat)
            distancia_lng = abs(float(punto[3]) - lng)
            distancia_aproximada = ((distancia_lat * 111000) ** 2 + (distancia_lng * 111000) ** 2) ** 0.5
            
            return jsonify({
                "success": False, 
                "message": f"Ya existe otro punto de interés cercano a esta ubicación: {punto[1]} (ID: {punto[0]}) a {distancia_aproximada:.0f} metros.",
                "punto_existente": {
                    "identificador": punto[0],
                    "nombre": punto[1],
                    "latitud": punto[2],
                    "longitud": punto[3]
                }
            }), 400
        
        # Actualizar el punto de interés
        query = """
        UPDATE PUNTOS_INTERES1 
        SET punto_de_interes = ?, identificador = ?, Direccion = ?, latitud = ?, longitud = ?,
            departamento = ?, jerarquia_nivel_2 = ?, jerarquia_nivel_2_2 = ?, radio = ?,
            ciudad = ?, clasificacion_de_canal = ?, nivel_de_alcance = ?, rif = ?,
            coordenadas_geography = geography::Point(?, ?, 4326)
        WHERE identificador = ?
        """
        
        params = (
            data.get('punto_de_interes'),
            nuevo_identificador if nuevo_identificador else identificador,
            data.get('direccion'),
            data.get('latitud'),
            data.get('longitud'),
            data.get('departamento'),
            data.get('jerarquia_nivel_2'),
            data.get('jerarquia_nivel_2_2'),
            data.get('radio', 100),
            data.get('ciudad'),
            data.get('clasificacion_de_canal'),
            data.get('nivel_de_alcance'),
            data.get('rif'),
            data.get('latitud'),
            data.get('longitud'),
            identificador
        )
        
        execute_query(query, params, commit=True)
        
        return jsonify({
            "success": True,
            "message": "Punto de interés actualizado exitosamente"
        })
    
    except Exception as e:
        current_app.logger.error(f"Error actualizando punto de interés: {str(e)}")
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500

@supervisors_bp.route('/api/pdv/<string:identificador>', methods=['DELETE'])
@login_required
def eliminar_pdv(identificador):
    """Eliminar un punto de interés"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        # Verificar si el punto de interés existe
        check_query = "SELECT COUNT(*) FROM PUNTOS_INTERES1 WHERE identificador = ?"
        result = execute_query(check_query, (identificador,), fetch_one=True)
        
        if isinstance(result, tuple):
            count = result[0]
        elif isinstance(result, int):
            count = result
        else:
            count = 0
        
        if count == 0:
            return jsonify({"success": False, "message": "Punto de interés no encontrado"}), 404
        
        # Eliminar el punto de interés
        query = "DELETE FROM PUNTOS_INTERES1 WHERE identificador = ?"
        execute_query(query, (identificador,), commit=True)
        
        return jsonify({
            "success": True,
            "message": "Punto de interés eliminado exitosamente"
        })
    
    except Exception as e:
        current_app.logger.error(f"Error eliminando punto de interés: {str(e)}")
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500

@supervisors_bp.route('/api/pdv/departamentos')
@login_required
def get_departamentos():
    """Obtener todos los departamentos distintos"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        query = """
        SELECT DISTINCT departamento 
        FROM PUNTOS_INTERES1 
        WHERE departamento IS NOT NULL AND departamento != ''
        ORDER BY departamento
        """
        departamentos = execute_query(query)
        
        return jsonify([row[0] for row in departamentos if row[0]])
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo departamentos: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@supervisors_bp.route('/api/pdv/ciudades')
@login_required
def get_ciudades():
    """Obtener todas las ciudades distintas"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        query = """
        SELECT DISTINCT ciudad 
        FROM PUNTOS_INTERES1 
        WHERE ciudad IS NOT NULL AND ciudad != ''
        ORDER BY ciudad
        """
        ciudades = execute_query(query)
        
        return jsonify([row[0] for row in ciudades if row[0]])
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo ciudades: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@supervisors_bp.route('/api/pdv/jerarquias-n2')
@login_required
def get_jerarquias_n2():
    """Obtener todas las jerarquías nivel 2 distintas"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        query = """
        SELECT DISTINCT jerarquia_nivel_2 
        FROM PUNTOS_INTERES1 
        WHERE jerarquia_nivel_2 IS NOT NULL AND jerarquia_nivel_2 != ''
        ORDER BY jerarquia_nivel_2
        """
        jerarquias = execute_query(query)
        
        return jsonify([row[0] for row in jerarquias if row[0]])
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo jerarquías nivel 2: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@supervisors_bp.route('/api/pdv/jerarquias-n2-2')
@login_required
def get_jerarquias_n2_2():
    """Obtener todas las jerarquías nivel 2_2 distintas"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        query = """
        SELECT DISTINCT jerarquia_nivel_2_2 
        FROM PUNTOS_INTERES1 
        WHERE jerarquia_nivel_2_2 IS NOT NULL AND jerarquia_nivel_2_2 != ''
        ORDER BY jerarquia_nivel_2_2
        """
        jerarquias = execute_query(query)
        
        return jsonify([row[0] for row in jerarquias if row[0]])
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo jerarquías nivel 2_2: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500
    
@supervisors_bp.route('/api/pdv/ciudades-por-departamento/<string:departamento>')
@login_required
def get_ciudades_por_departamento(departamento):
    """Obtener ciudades por departamento"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        query = """
        SELECT DISTINCT ciudad 
        FROM PUNTOS_INTERES1 
        WHERE departamento = ? AND ciudad IS NOT NULL AND ciudad != ''
        ORDER BY ciudad
        """
        ciudades = execute_query(query, (departamento,))
        
        return jsonify([row[0] for row in ciudades if row[0]])
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo ciudades por departamento: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@supervisors_bp.route('/api/pdv/jerarquias-n2_2-por-n2/<string:jerarquia_n2>')
@login_required
def get_jerarquias_n2_2_por_n2(jerarquia_n2):
    """Obtener jerarquías nivel 2_2 por jerarquía nivel 2"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        query = """
        SELECT DISTINCT jerarquia_nivel_2_2 
        FROM PUNTOS_INTERES1 
        WHERE jerarquia_nivel_2 = ? 
          AND jerarquia_nivel_2_2 IS NOT NULL 
          AND jerarquia_nivel_2_2 != ''
        ORDER BY jerarquia_nivel_2_2
        """
        jerarquias = execute_query(query, (jerarquia_n2,))
        
        return jsonify([row[0] for row in jerarquias if row[0]])
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo jerarquías nivel 2_2 por nivel 2: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@supervisors_bp.route('/api/pdv/next-identificador/<string:jerarquia_n2_2>')
@login_required
def get_next_identificador(jerarquia_n2_2):
    """Obtener el siguiente identificador para una jerarquía nivel 2_2"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        # Primero buscar si ya existen identificadores para esta jerarquía
        query = """
        SELECT identificador 
        FROM PUNTOS_INTERES1 
        WHERE jerarquia_nivel_2_2 = ?
        ORDER BY identificador DESC
        """
        resultados = execute_query(query, (jerarquia_n2_2,))
        
        if resultados:
            # Hay identificadores existentes para esta jerarquía
            # Tomar el último identificador y extraer su prefijo y número
            ultimo_identificador = resultados[0][0]
            
            if ultimo_identificador and len(ultimo_identificador) >= 7:
                # Extraer prefijo (primeras 3 letras) y número (4 dígitos)
                prefijo = ultimo_identificador[:3]
                numero_str = ultimo_identificador[3:7]
                
                try:
                    numero = int(numero_str)
                    siguiente_numero = numero + 1
                    siguiente_identificador = f"{prefijo}{siguiente_numero:04d}"
                    
                    return jsonify({
                        "success": True,
                        "identificador": siguiente_identificador,
                        "prefijo_existente": prefijo,
                        "ultimo_numero": numero
                    })
                except (ValueError, IndexError):
                    # Si hay error en el formato, generar nuevo basado en jerarquía
                    pass
        
        # Si no hay identificadores existentes o hubo error, generar uno nuevo
        # basado en las primeras 3 letras de la jerarquía
        iniciales = ''.join(jerarquia_n2_2.split())[:3].upper()
        
        if len(iniciales) < 3:
            iniciales = iniciales.ljust(3, 'X')
        
        # Verificar si ya existe algún identificador con estas iniciales
        query_prefijo = """
        SELECT identificador 
        FROM PUNTOS_INTERES1 
        WHERE identificador LIKE ? 
        ORDER BY identificador DESC
        """
        resultados_prefijo = execute_query(query_prefijo, (f"{iniciales}%",))
        
        max_numero = 0
        if resultados_prefijo:
            # Encontrar el número más alto para este prefijo
            for row in resultados_prefijo:
                identificador = row[0]
                if identificador and identificador.startswith(iniciales) and len(identificador) >= 7:
                    try:
                        numero_str = identificador[len(iniciales):len(iniciales)+4]
                        numero = int(numero_str)
                        if numero > max_numero:
                            max_numero = numero
                    except (ValueError, IndexError):
                        continue
        
        siguiente_numero = max_numero + 1
        siguiente_identificador = f"{iniciales}{siguiente_numero:04d}"
        
        return jsonify({
            "success": True,
            "identificador": siguiente_identificador,
            "prefijo_nuevo": iniciales,
            "es_nuevo_prefijo": True
        })
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo siguiente identificador: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@supervisors_bp.route('/api/pdv/sugerencias-direccion')
@login_required
def get_sugerencias_direccion():
    """Obtener sugerencias de direcciones desde Nominatim (OpenStreetMap)"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        query = request.args.get('q', '')
        if not query or len(query) < 3:
            return jsonify([])
        
        # Usar Nominatim API
        import urllib.parse
        import requests
        
        url = f"https://nominatim.openstreetmap.org/search"
        params = {
            'q': query,
            'format': 'json',
            'addressdetails': 1,
            'limit': 10,
            'countrycodes': 've',  # Filtrar por Venezuela
            'accept-language': 'es'
        }
        
        headers = {
            'User-Agent': 'AppWeb/1.0 (supervisor@example.com)'
        }
        
        response = requests.get(url, params=params, headers=headers)
        
        if response.status_code == 200:
            resultados = response.json()
            
            sugerencias = []
            for resultado in resultados:
                display_name = resultado.get('display_name', '')
                lat = resultado.get('lat', '')
                lon = resultado.get('lon', '')
                
                # Extraer componentes de dirección
                address = resultado.get('address', {})
                calle = address.get('road', '')
                numero = address.get('house_number', '')
                ciudad = address.get('city', address.get('town', address.get('village', '')))
                estado = address.get('state', '')
                
                direccion_formateada = ''
                if calle:
                    direccion_formateada += calle
                    if numero:
                        direccion_formateada += f' {numero}'
                if ciudad:
                    if direccion_formateada:
                        direccion_formateada += f', {ciudad}'
                    else:
                        direccion_formateada = ciudad
                if estado:
                    if direccion_formateada:
                        direccion_formateada += f', {estado}'
                    else:
                        direccion_formateada = estado
                
                if not direccion_formateada:
                    direccion_formateada = display_name[:100]  # Limitar longitud
                
                sugerencias.append({
                    "display_name": display_name,
                    "direccion": direccion_formateada,
                    "latitud": lat,
                    "longitud": lon,
                    "calle": calle,
                    "numero": numero,
                    "ciudad": ciudad,
                    "estado": estado
                })
            
            return jsonify(sugerencias)
        else:
            return jsonify([])
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo sugerencias de dirección: {str(e)}")
        return jsonify([])
    


@supervisors_bp.route('/api/pdv/jerarquias-n2-2', methods=['POST'])
@login_required
def agregar_jerarquia_n2_2():
    """Agregar una nueva jerarquía nivel 2_2"""
    if current_user.rol != 'supervisor':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        data = request.get_json()
        nueva_jerarquia = data.get('jerarquia')
        
        if not nueva_jerarquia or not nueva_jerarquia.strip():
            return jsonify({"success": False, "message": "El nombre de la jerarquía es requerido"}), 400
        
        # Verificar si ya existe (ignorando mayúsculas/minúsculas)
        query = """
        SELECT COUNT(*) 
        FROM PUNTOS_INTERES1 
        WHERE LOWER(jerarquia_nivel_2_2) = LOWER(?)
        """
        result = execute_query(query, (nueva_jerarquia,), fetch_one=True)
        
        if isinstance(result, tuple):
            count = result[0]
        elif isinstance(result, int):
            count = result
        else:
            count = 0
        
        # No necesitamos insertar en la base de datos porque es un campo de texto libre
        # Simplemente verificamos si ya existe en algún PDV
        if count > 0:
            return jsonify({
                "success": True, 
                "message": "La jerarquía ya existe en la base de datos",
                "jerarquia": nueva_jerarquia
            })
        
        # Como es un campo de texto libre, no hay una tabla de catálogo
        # Simplemente devolvemos éxito para que el frontend pueda usarla
        return jsonify({
            "success": True,
            "message": "Jerarquía disponible para usar",
            "jerarquia": nueva_jerarquia
        })
    
    except Exception as e:
        current_app.logger.error(f"Error agregando jerarquía: {str(e)}")
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500
'''