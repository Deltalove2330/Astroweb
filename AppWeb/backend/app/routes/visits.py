# app/routes/visits.py
from flask import Blueprint, request, jsonify, current_app, send_file, render_template
from flask_login import login_required, current_user
from app.utils.database import execute_query, get_db_connection
import io, os
import urllib.parse
from app.utils.helpers import obtener_dia_actual_espanol

from datetime import datetime
import threading
import json
from azure.storage.blob import BlobServiceClient
import io
import urllib.parse

visits_bp = Blueprint('visits', __name__)

# ========================================
# ENDPOINTS ORIGINALES
# ========================================

# Añadir esta función al inicio del archivo visits.py (después de los imports)

def enviar_mensaje_sistema_rechazo(visit_id, foto_id, foto_info, razon_texto, rechazado_por):
    """
    Envía un mensaje automático al chat cuando se rechaza una foto
    """
    try:
        from app import socketio
        from flask_login import current_user
        
        # Mapear tipo de foto
        tipo_foto_map = {
            1: "Gestión (Antes)",
            2: "Gestión (Después)",
            3: "Precio",
            4: "Exhibición"
        }
        
        tipo_foto = tipo_foto_map.get(foto_info.get('id_tipo_foto'), 'Desconocida')
        
        # ✅ CONSTRUIR MENSAJE CON RAZÓN COMPLETA
        mensaje = f"""🚫 Foto Rechazada

📸 Tipo: {tipo_foto}
🏢 Cliente: {foto_info.get('cliente', 'N/A')}
📍 Punto: {foto_info.get('punto_venta', 'N/A')}
📅 Fecha: {foto_info.get('fecha', 'N/A')}
👤 Rechazado por: {rechazado_por}
📝 Razón: {razon_texto}"""
        
        # Metadata adicional
        metadata = {
            'tipo_evento': 'rechazo_foto',
            'id_foto': foto_id,
            'tipo_foto': tipo_foto,
            'cliente': foto_info.get('cliente'),
            'punto_venta': foto_info.get('punto_venta'),
            'rechazado_por': rechazado_por,
            'razon': razon_texto  # ✅ Razón completa
        }
        
        id_usuario_actual = None
        
        if hasattr(current_user, 'id') and current_user.id:
            id_usuario_actual = current_user.id
        else:
            conn_temp = get_db_connection()
            cursor_temp = conn_temp.cursor()
            cursor_temp.execute("SELECT id_usuario FROM USUARIOS WHERE username = ?", (rechazado_por,))
            user_result = cursor_temp.fetchone()
            if user_result:
                id_usuario_actual = user_result[0]
            cursor_temp.close()
            conn_temp.close()
        
        if not id_usuario_actual:
            current_app.logger.error(f"❌ No se pudo obtener id_usuario para {rechazado_por}")
            return
        
        query = """
            INSERT INTO CHAT_MENSAJES 
            (id_visita, id_usuario, username, mensaje, tipo_mensaje, metadata, fecha_envio, visto)
            OUTPUT INSERTED.id_mensaje, INSERTED.fecha_envio
            VALUES (?, ?, ?, ?, 'sistema', ?, GETDATE(), 0)
        """
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(query, (
            visit_id,
            id_usuario_actual,
            rechazado_por,
            mensaje,
            json.dumps(metadata)
        ))
        
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        if result:
            id_mensaje = result[0]
            fecha_envio = result[1]
            
            current_app.logger.info(f"✅ Mensaje de sistema guardado: ID {id_mensaje}")
            
            room = f"chat_visit_{visit_id}"
            mensaje_data = {
                'id_mensaje': id_mensaje,
                'id_visita': visit_id,
                'id_usuario': id_usuario_actual,
                'username': rechazado_por,
                'mensaje': mensaje,
                'tipo_mensaje': 'sistema',
                'fecha_envio': fecha_envio.isoformat(),
                'visto': False,
                'metadata': metadata
            }
            
            socketio.emit('new_message', mensaje_data, room=room, namespace='/')
            current_app.logger.info(f"📨 Mensaje emitido a sala: {room}")
            
    except Exception as e:
        current_app.logger.error(f"❌ Error: {e}")
        import traceback
        current_app.logger.error(traceback.format_exc())


@visits_bp.route("/api/visits/<string:ruta_id>")
@login_required
def get_visits(ruta_id):
    try:
        query = """
            SELECT DISTINCT
                vm.id_visita, 
                c.cliente, 
                vm.fecha_visita, 
                m.nombre AS mercaderista,
                pin.punto_de_interes
            FROM RUTAS_NUEVAS rn 
            JOIN RUTA_PROGRAMACION rp ON rn.id_ruta = rp.id_ruta
            JOIN PUNTOS_INTERES1 pin ON rp.id_punto_interes = pin.identificador
            JOIN VISITAS_MERCADERISTA vm ON pin.identificador = vm.identificador_punto_interes
            JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
            JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
            WHERE rn.ruta = ? AND vm.estado = 'Pendiente'
            ORDER BY vm.fecha_visita DESC
        """
        visits = execute_query(query, (ruta_id,))
        
        if not visits:
            return jsonify([])
        return jsonify([{
            "id": row[0], 
            "cliente": row[1], 
            "fecha": row[2], 
            "mercaderista": row[3],
            "punto_interes": row[4]
        } for row in visits])
    except Exception as e:
        current_app.logger.error(f"Error obteniendo visitas: {str(e)}")
        return jsonify({"error": "Error interno", "details": str(e)}), 500
    
@visits_bp.route("/api/visits/<int:id>", methods=["PUT"])
@login_required
def update_visit(id):
    try:
        data = request.get_json()
        estado = data["estado"]
        
        query = "UPDATE VISITAS_MERCADERISTA SET estado = ? WHERE id_visita = ?"
        execute_query(query, (estado, id))
        return jsonify({"status": "ok"})
    except Exception as e:
        current_app.logger.error(f"Error actualizando visita: {str(e)}")
        return jsonify({"error": "Error interno", "details": str(e)}), 500

@visits_bp.route("/api/photo-status", methods=["POST"])
@login_required
def update_photo_status():
    try:
        data = request.get_json()
        visit_id = data["visitId"]
        filename = data["filename"]
        status = data["status"]
        section = data["section"]
        
        query = """
            UPDATE FOTOS_VISITAS
            SET estado = ?
            WHERE id_visita = ? AND (foto_antes = ? OR foto_despues = ?)
        """
        execute_query(query, (status, visit_id, filename, filename))
        
        return jsonify({"status": "ok"})
    except Exception as e:
        current_app.logger.error(f"Error actualizando estado de foto: {str(e)}")
        return jsonify({"error": "Error interno", "details": str(e)}), 500

@visits_bp.route("/api/visit-status/<int:visit_id>")
@login_required
def get_visit_status(visit_id):
    try:
        query = "SELECT estado FROM FOTOS_VISITAS WHERE id_visita = ?"
        photos = execute_query(query, (visit_id,))
        return jsonify({"photos": [{"estado": row[0]} for row in photos]})
    except Exception as e:
        current_app.logger.error(f"Error obteniendo estado de visita: {str(e)}")
        return jsonify({"error": "Error interno", "details": str(e)}), 500

@visits_bp.route("/api/visit-photos/<int:visit_id>")
@login_required
def get_visit_photos(visit_id):
    try:
        query = "SELECT foto_antes, foto_despues FROM FOTOS_VISITAS WHERE id_visita = ?"
        photos = execute_query(query, (visit_id,))
        
        antes = []
        despues = []
        for row in photos:
            if row[0]:
                antes.extend(row[0].split(","))
            if row[1]:
                despues.extend(row[1].split(","))
        
        return jsonify({"antes": antes, "despues": despues})
    except Exception as e:
        current_app.logger.error(f"Error obteniendo fotos de visita: {str(e)}")
        return jsonify({"error": "Error interno", "details": str(e)}), 500

@visits_bp.route("/api/visit-gallery/<int:visit_id>")
@login_required
def get_visit_gallery(visit_id):
    try:
        query = """
        SELECT FILE_PATH, id_tipo_foto 
        FROM FOTOS_TOTALES 
        WHERE id_visita = ?
        """
        rows = execute_query(query, (visit_id,))
        
        fotos = {"antes": [], "despues": []}
        for row in rows:
            clean_path = row[0].replace("X://", "").replace("X:/", "")
            clean_path = clean_path.replace("\\", "/")
            
            tipo_foto = row[1]
            if tipo_foto == 1:
                fotos["antes"].append(clean_path)
            elif tipo_foto == 2:
                fotos["despues"].append(clean_path)
                
        return jsonify(fotos)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo galería: {str(e)}")
        return jsonify({"error": str(e)}), 500

@visits_bp.route("/api/process-photo-decisions", methods=["POST"])
@login_required
def process_photo_decisions():
    try:
        data = request.get_json()
        visit_id = data.get("visitId")
        aprobados = data.get("aprobados", [])
        rechazados = data.get("rechazados", [])
        
        for aprobado in aprobados:
            query = """
                UPDATE FOTOS_VISITAS
                SET estado = 'Aprobada',
                    aprobado_por = ?,
                    fecha_aprobacion = GETDATE()
                WHERE id_visita = ? AND (foto_antes LIKE ? OR foto_despues LIKE ?)
            """
            execute_query(query, (
                current_user.username, 
                visit_id, 
                f"%{aprobado['src']}%", 
                f"%{aprobado['src']}%"
            ))
        
        for rechazado in rechazados:
            razones_texto = "; ".join(rechazado["razones"])
            query = """
                UPDATE FOTOS_VISITAS
                SET estado = 'Rechazada',
                    razon_rechazo = ?,
                    rechazado_por = ?,
                    fecha_rechazo = GETDATE()
                WHERE id_visita = ? AND (foto_antes LIKE ? OR foto_despues LIKE ?)
            """
            execute_query(query, (
                razones_texto, 
                current_user.username, 
                visit_id, 
                f"%{rechazado['src']}%", 
                f"%{rechazado['src']}%"
            ))
        
        return jsonify({
            "success": True,
            "message": f"Procesadas {len(aprobados)} aprobaciones y {len(rechazados)} rechazos"
        })
    except Exception as e:
        current_app.logger.error(f"Error procesando decisiones de fotos: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

@visits_bp.route("/api/rejection-reasons")
@login_required
def get_rejection_reasons():
    try:
        query = "SELECT id_razones_rechazos as id, razon FROM RAZONES_RECHAZOS ORDER BY razon"
        razones = execute_query(query,())
        return jsonify([{"id": row[0], "razon": row[1]} for row in razones])
    except Exception as e:
        current_app.logger.error(f"Error obteniendo razones de rechazo: {str(e)}")
        return jsonify({"error": str(e)}), 500

@visits_bp.route("/api/update-visit-review", methods=["POST"])
@login_required
def update_visit_review():
    try:
        data = request.get_json()
        visit_id = data.get("visitId")
        revisada = data.get("revisada", False)
        
        query = """
            UPDATE VISITAS_MERCADERISTA
            SET revisada = ?, 
                fecha_revision = GETDATE(),
                revisado_por = ?
            WHERE id_visita = ?
        """
        execute_query(query, (1 if revisada else 0, current_user.username, visit_id))
        
        return jsonify({
            "success": True,
            "message": "Visita actualizada correctamente"
        })
    except Exception as e:
        current_app.logger.error(f"Error actualizando revisión de visita: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

@visits_bp.route("/api/visit-merchandiser/<int:visit_id>")
@login_required
def get_visit_merchandiser(visit_id):
    try:
        query = """
            SELECT m.nombre
            FROM VISITAS_MERCADERISTA vm
            JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
            WHERE vm.id_visita = ?
        """
        result = execute_query(query, (visit_id,), fetch_one=True)
        
        if result:
            return jsonify({"nombre": result[0]})
        else:
            return jsonify({"nombre": "Desconocido"})
    except Exception as e:
        current_app.logger.error(f"Error obteniendo mercaderista: {str(e)}")
        return jsonify({"error": str(e)}), 500

@visits_bp.route("/api/visit-price/<int:visit_id>")
@login_required
def get_visit_price(visit_id):
    return jsonify({"precio": 125.50})

@visits_bp.route("/api/visit-exhibitions/<int:visit_id>")
@login_required
def get_visit_exhibitions(visit_id):
    return jsonify(["Exhibición 1", "Exhibición 2"])

@visits_bp.route("/api/all-pending-visits")
@login_required
def get_all_pending_visits():
    try:
        dia_actual = obtener_dia_actual_espanol()
        
        query = """
            SELECT DISTINCT
                bt.ID_VISITA               AS id,
                c.cliente,
                pin.punto_de_interes,
                m.nombre                   AS mercaderista,
                bt.FECHA_BALANCE           AS fecha
            FROM BALANCES_TOTALES bt
            JOIN CLIENTES c           ON bt.ID_CLIENTE = c.id_cliente
            JOIN PUNTOS_INTERES1 pin   ON bt.IDENTIFICADOR_PDV = pin.identificador
            JOIN MERCADERISTAS m      ON bt.MERCADERISTA = m.nombre
            JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes AND c.id_cliente = rp.id_cliente
            WHERE rp.dia = ? AND rp.activa = 1
            ORDER BY bt.FECHA_BALANCE DESC
        """
        rows = execute_query(query, (dia_actual,))
        return jsonify([{
            "id": row[0],
            "cliente": row[1],
            "punto_interes": row[2],
            "mercaderista": row[3],
            "fecha": row[4].isoformat() if row[4] else None
        } for row in rows])
    except Exception as e:
        current_app.logger.error(f"Error obteniendo visitas con datos: {str(e)}")
        return jsonify({"error": "Error interno", "details": str(e)}), 500
    
@visits_bp.route("/api/balances/<int:visit_id>", methods=['GET'])
@login_required
def get_balances(visit_id):
    try:
        query = """
            SELECT * FROM BALANCES_TOTALES
            WHERE ID_VISITA = ?
        """
        rows = execute_query(query, (visit_id,))
        keys = [
            'ID_BALANCE', 'ID_CLIENTE', 'FECHA_BALANCE', 'IDENTIFICADOR_PDV',
            'MERCADERISTA', 'PRODUCTO', 'CATEGORIA', 'FABRICANTE',
            'INV_INICIAL', 'INV_FINAL', 'INV_DEPOSITO', 'CARAS',
            'PRECIO_BS', 'PRECIO_DS', 'ID_VISITA'
        ]
        return jsonify([dict(zip(keys, r)) for r in rows])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@visits_bp.route("/revisar/<int:visit_id>")
@login_required
def revisar_visita(visit_id):
    update_query = """
        UPDATE BALANCES_TOTALES
        SET fecha_inicio_modificacion = GETDATE()
        WHERE ID_VISITA = ?
    """
    execute_query(update_query, (visit_id,), commit=True)
    
    rows = execute_query("SELECT * FROM BALANCES_TOTALES WHERE ID_VISITA = ?", (visit_id,))
    if not rows:
        return "No hay datos para esta visita", 404

    keys = [
        'ID_BALANCE','ID_CLIENTE','FECHA_BALANCE','IDENTIFICADOR_PDV','MERCADERISTA',
        'PRODUCTO','CATEGORIA','FABRICANTE','INV_INICIAL','INV_FINAL','INV_DEPOSITO',
        'CARAS','PRECIO_BS','PRECIO_DS','ID_VISITA'
    ]
    datos = [dict(zip(keys, r)) for r in rows]
    return render_template('revisar_visita.html', datos=datos, visit_id=visit_id)

@visits_bp.route("/api/update-visit-balances", methods=["POST"])
@login_required
def update_visit_balances():
    try:
        data = request.get_json()
        visit_id = data.get("visit_id")
        balances = data.get("balances")

        for balance in balances:
            update_query = """
                UPDATE BALANCES_TOTALES
                SET 
                    INV_INICIAL = ?,
                    INV_FINAL = ?,
                    INV_DEPOSITO = ?,
                    CARAS = ?,
                    PRECIO_BS = ?,
                    PRECIO_DS = ?,
                    fecha_modificacion = GETDATE()
                WHERE ID_BALANCE = ?
            """
            execute_query(
                update_query,
                (
                    balance.get("inv_inicial"),
                    balance.get("inv_final"),
                    balance.get("inv_deposito"),
                    balance.get("caras"),
                    balance.get("precio_bs"),
                    balance.get("precio_usd"),
                    balance.get("id_balance")
                ),
                commit=True
            )

        return jsonify({"success": True, "message": "Cambios guardados exitosamente"})
    except Exception as e:
        current_app.logger.error(f"Error actualizando balances: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

@visits_bp.route("/api/route-point-visits/<string:ruta_id>/<string:point_id>")
@login_required
def get_route_point_visits(ruta_id, point_id):
    try:
        query = """
            SELECT DISTINCT
                vm.id_visita, 
                c.cliente, 
                vm.fecha_visita, 
                m.nombre AS mercaderista
            FROM RUTAS_NUEVAS rn  
            JOIN RUTA_PROGRAMACION rp ON rn.id_ruta = rp.id_ruta
            JOIN PUNTOS_INTERES1 pin ON rp.id_punto_interes = pin.identificador
            JOIN VISITAS_MERCADERISTA vm ON pin.identificador = vm.identificador_punto_interes
            JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
            JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
            WHERE rn.ruta = ?
                AND pin.identificador = ?
                AND vm.estado = 'Pendiente'
            ORDER BY vm.fecha_visita DESC
        """
        visits = execute_query(query, (ruta_id, point_id))
        return jsonify([{
            "id": row[0], 
            "cliente": row[1], 
            "fecha": row[2], 
            "mercaderista": row[3]
        } for row in visits])
    except Exception as e:
        current_app.logger.error(f"Error obteniendo visitas del punto: {str(e)}")
        return jsonify({"error": "Error interno", "details": str(e)}), 500
    
@visits_bp.route("/api/point-clients/<string:point_id>")
@login_required
def get_point_clients(point_id):
    try:
        query = """
            SELECT DISTINCT
                c.id_cliente,
                c.cliente,
                COUNT(vm.id_visita) as visitas_pendientes
            FROM VISITAS_MERCADERISTA vm
            JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
            WHERE vm.identificador_punto_interes = ? 
                AND vm.estado = 'Pendiente'
            GROUP BY c.id_cliente, c.cliente
            ORDER BY c.cliente
        """
        clients = execute_query(query, (point_id,))
        
        return jsonify([{
            "id": row[0],
            "nombre": row[1],
            "pendientes": row[2]
        } for row in clients])
    except Exception as e:
        current_app.logger.error(f"Error obteniendo clientes del punto: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@visits_bp.route("/api/client-point-visits/<int:client_id>/<string:point_id>")
@login_required
def get_client_point_visits(client_id, point_id):
    try:
        query = """
            SELECT 
                vm.id_visita, 
                c.cliente, 
                vm.fecha_visita, 
                m.nombre AS mercaderista
            FROM VISITAS_MERCADERISTA vm
            JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
            JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
            WHERE vm.id_cliente = ? 
                AND vm.identificador_punto_interes = ? 
                AND vm.estado = 'Pendiente'
            ORDER BY vm.fecha_visita DESC
        """
        visits = execute_query(query, (client_id, point_id))
        
        return jsonify([{
            "id": row[0], 
            "cliente": row[1], 
            "fecha": row[2], 
            "mercaderista": row[3]
        } for row in visits])
    except Exception as e:
        current_app.logger.error(f"Error obteniendo visitas: {str(e)}")
        return jsonify({"error": "Error interno", "details": str(e)}), 500

@visits_bp.route("/api/point-all-clients/<string:point_id>")
@login_required
def get_point_all_clients(point_id):
    try:
        query = """
            SELECT DISTINCT
                c.id_cliente,
                c.cliente,
                ISNULL(pending_counts.pendientes, 0) as visitas_pendientes
            FROM CLIENTES c
            INNER JOIN RUTA_PROGRAMACION rp ON c.id_cliente = rp.id_cliente
            INNER JOIN PUNTOS_INTERES1 pin ON rp.id_punto_interes = pin.identificador
            LEFT JOIN (
                SELECT 
                    vm.id_cliente,
                    COUNT(vm.id_visita) as pendientes
                FROM VISITAS_MERCADERISTA vm
                WHERE vm.identificador_punto_interes = ? 
                    AND vm.estado = 'Pendiente'
                GROUP BY vm.id_cliente
            ) pending_counts ON c.id_cliente = pending_counts.id_cliente
            WHERE pin.identificador = ?
            ORDER BY c.cliente
        """
        clients = execute_query(query, (point_id, point_id))
        
        return jsonify([{
            "id": row[0],
            "nombre": row[1],
            "pendientes": row[2]
        } for row in clients])
    except Exception as e:
        current_app.logger.error(f"Error obteniendo todos los clientes del punto: {str(e)}")
        return jsonify({"error": str(e)}), 500


@visits_bp.route('/api/image/<path:image_path>')
@login_required
def serve_image(image_path):
    """
    Sirve imágenes desde Azure BLOB Storage
    """
    try:
        from azure.storage.blob import BlobServiceClient
        
        connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
        container_name = "epran"  # Tu contenedor
        
        if not connection_string:
            current_app.logger.error("❌ Azure Storage connection string no encontrada")
            return "Configuration error", 500
        
        # 🔥 LIMPIEZA DE RUTA
        clean_path = image_path
        
        # Remover prefijos legacy si existen
        if clean_path.startswith("X://") or clean_path.startswith("X:/") or clean_path.startswith("X:\\"):
            clean_path = clean_path.replace("X://", "").replace("X:/", "").replace("X:\\", "")
            current_app.logger.info(f"🔄 Ruta legacy convertida: {image_path} → {clean_path}")
        
        # Normalizar separadores (\ → /)
        clean_path = clean_path.replace("\\", "/").lstrip("/")
        
        # Decodificar URL encoding
        clean_path = urllib.parse.unquote(clean_path)
        
        # 📝 LOGS DETALLADOS
        current_app.logger.info(f"═══════════════════════════════════")
        current_app.logger.info(f"📂 BUSCANDO IMAGEN EN AZURE BLOB")
        current_app.logger.info(f"   Original: {image_path}")
        current_app.logger.info(f"   Limpiada: {clean_path}")
        current_app.logger.info(f"   Container: {container_name}")
        
        # 🔴 CAMBIO CRÍTICO: Usar BlobServiceClient en lugar de ShareServiceClient
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        blob_client = blob_service_client.get_blob_client(container=container_name, blob=clean_path)
        
        try:
            # Verificar que el blob existe
            blob_properties = blob_client.get_blob_properties()
            current_app.logger.info(f"✅ IMAGEN ENCONTRADA!")
            current_app.logger.info(f"   Tamaño: {blob_properties.size} bytes")
            current_app.logger.info(f"═══════════════════════════════════")
        except Exception as e:
            error_msg = str(e)
            current_app.logger.error(f"❌ IMAGEN NO ENCONTRADA")
            current_app.logger.error(f"   Error: {error_msg}")
            current_app.logger.error(f"   Ruta buscada: {clean_path}")
            current_app.logger.error(f"═══════════════════════════════════")
            return "Image not found", 404
        
        # Descargar el blob
        download_stream = blob_client.download_blob()
        file_content = download_stream.readall()
        
        # Detectar tipo MIME
        import mimetypes
        mime_type, _ = mimetypes.guess_type(clean_path)
        if not mime_type:
            mime_type = 'image/jpeg'
        
        return send_file(
            io.BytesIO(file_content),
            mimetype=mime_type,
            as_attachment=False,
            download_name=os.path.basename(clean_path)
        )
        
    except Exception as e:
        current_app.logger.error(f"❌ ERROR GENERAL SIRVIENDO IMAGEN")
        current_app.logger.error(f"   Exception: {str(e)}")
        import traceback
        current_app.logger.error(traceback.format_exc())
        return "Error serving image", 500

@visits_bp.route('/api/test-azure-connection')
@login_required
def test_azure_connection():
    try:
        connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
        share_name = "epran"
        
        service_client = ShareServiceClient.from_connection_string(connection_string)
        share_client = service_client.get_share_client(share_name)
        
        files = []
        for item in share_client.list_directories_and_files():
            files.append(item.name)
            if len(files) >= 5:
                break
                
        return jsonify({
            "success": True,
            "connection": "established",
            "files_found": files,
            "share_name": share_name
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@visits_bp.route("/api/photos/validate", methods=["POST"])
@login_required
def validate_photos():
    try:
        data = request.get_json()
        visit_id = data.get("visit_id")
        
        all_photos_query = """
            SELECT id_foto, file_path, id_tipo_foto, id_visita
            FROM FOTOS_TOTALES 
            WHERE id_visita = ?
        """
        all_photos = execute_query(all_photos_query, (visit_id,))
        
        pending_photos = []
        for photo in all_photos:
            photo_id = photo[0]
            file_path = photo[1]
            photo_type = "antes" if photo[2] == 1 else "despues"
            
            check_query = """
                SELECT COUNT(*) 
                FROM FOTOS_APROBADAS WHERE id_foto_original = ?
                UNION ALL
                SELECT COUNT(*) 
                FROM FOTOS_RECHAZADAS WHERE id_foto_original = ?
            """
            results = execute_query(check_query, (photo_id, photo_id))
            
            total_decisions = sum(row[0] for row in results)
            
            if total_decisions == 0:
                pending_photos.append({
                    "id": photo_id,
                    "file_path": file_path,
                    "type": photo_type
                })
        
        return jsonify({
            "all_reviewed": len(pending_photos) == 0,
            "pending_count": len(pending_photos),
            "total_photos": len(all_photos),
            "pending_photos": pending_photos
        })
        
    except Exception as e:
        current_app.logger.error(f"Error validando fotos: {str(e)}")
        return jsonify({"error": str(e)}), 500

@visits_bp.route("/api/approve-photos", methods=["POST"])
@login_required
def approve_photos():
    try:
        data = request.get_json()
        photo_ids = data.get("photo_ids", [])
        visit_id = data.get("visit_id")
        
        if not photo_ids:
            return jsonify({"success": False, "message": "No se proporcionaron IDs de fotos"}), 400
        
        update_query = """
            UPDATE FOTOS_TOTALES
            SET Estado = 'Aprobada'
            WHERE id_foto IN ({})
        """.format(','.join(['?'] * len(photo_ids)))
        
        execute_query(update_query, photo_ids, commit=True)
        
        return jsonify({
            "success": True,
            "message": f"{len(photo_ids)} fotos aprobadas correctamente"
        })
        
    except Exception as e:
        current_app.logger.error(f"Error aprobando fotos: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

@visits_bp.route("/api/save-photo-decisions", methods=["POST"])
@login_required
def save_photo_decisions():
    try:
        data = request.get_json()
        visit_id = data.get("visit_id")
        approved_photos = data.get("approved_photos", [])
        rejected_photos = data.get("rejected_photos", [])
        
        from app.routes.auth import enviar_notificacion_telegram, emit_new_notification, mapear_tipo_foto
        
        app = current_app._get_current_object()
        
        if approved_photos:
            update_approved_query = """
            UPDATE FOTOS_TOTALES
            SET Estado = 'Aprobada'
            WHERE id_foto IN ({})
            """.format(','.join(['?'] * len(approved_photos)))
            
            execute_query(update_approved_query, approved_photos, commit=True)
        
        for rejected_photo in rejected_photos:
            photo_id = rejected_photo.get("id_foto")
            reason_id = rejected_photo.get("rejection_reason_id")
            description = rejected_photo.get("rejection_description", "")
            
            update_rejected_query = """
            UPDATE FOTOS_TOTALES
            SET Estado = 'Rechazada'
            WHERE id_foto = ?
            """
            execute_query(update_rejected_query, (photo_id,), commit=True)
            
            # 🔥 OBTENER INFO COMPLETA DE LA FOTO PARA EL CHAT
            foto_info_query = """
            SELECT 
                ft.fecha_registro, 
                ft.id_visita, 
                ft.id_tipo_foto,
                vm.id_cliente, 
                c.cliente, 
                pin.punto_de_interes,
                CONVERT(VARCHAR, ft.fecha_registro, 23) as fecha_str
            FROM FOTOS_TOTALES ft
            JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
            LEFT JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
            LEFT JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
            WHERE ft.id_foto = ?
            """
            foto_info = execute_query(foto_info_query, (photo_id,), fetch_one=True)
            
            fecha_registro = foto_info[0] if foto_info else None
            id_visita_actual = foto_info[1] if foto_info else visit_id
            id_tipo_foto = foto_info[2] if foto_info else None
            id_cliente = foto_info[3] if foto_info else None
            nombre_cliente = foto_info[4] if foto_info else "Desconocido"
            punto_venta = foto_info[5] if foto_info else "Desconocido"
            fecha_str = foto_info[6] if foto_info else "N/A"
            
            tipo_foto = mapear_tipo_foto(id_tipo_foto)
            
            # Determinar texto de razón
            if reason_id:
                razon_query = "SELECT razon FROM RAZONES_RECHAZOS WHERE id_razones_rechazos = ?"
                razon_result = execute_query(razon_query, (reason_id,), fetch_one=True)
                razon_texto = razon_result[0] if razon_result else description
            else:
                razon_texto = description
            
            # 🔥 ENVIAR MENSAJE AL CHAT
            foto_info_chat = {
                'id_tipo_foto': id_tipo_foto,
                'cliente': nombre_cliente,
                'punto_venta': punto_venta,
                'fecha': fecha_str
            }
            
            enviar_mensaje_sistema_rechazo(
                visit_id=id_visita_actual,
                foto_id=photo_id,
                foto_info=foto_info_chat,
                razon_texto=razon_texto,
                rechazado_por=current_user.username
            )
            
            # Resto del código original (notificaciones, telegram, etc.)
            insert_rejected_query = """
            INSERT INTO FOTOS_RECHAZADAS
            (id_visita, id_foto_original, fecha_registro, fecha_rechazo,
             id_razones_rechazos, descripcion, rechazado_por)
            OUTPUT INSERTED.id_foto_rechazada
            VALUES (?, ?, ?, GETDATE(), ?, ?, ?)
            """
            
            conn = get_db_connection()
            cursor = conn.cursor()
            
            try:
                cursor.execute(insert_rejected_query, (
                    id_visita_actual, photo_id, fecha_registro,
                    reason_id if reason_id else None,
                    description,
                    current_user.username
                ))
                rechazo_result = cursor.fetchone()
                rechazo_id = rechazo_result[0] if rechazo_result else None
                
                if rechazo_id:
                    notif_query = """
                    INSERT INTO NOTIFICACIONES_RECHAZO_FOTOS
                    (id_foto_rechazada, id_visita, id_cliente, nombre_cliente,
                     punto_venta, rechazado_por, fecha_rechazo, fecha_notificacion,
                     leido, descripcion, id_foto_original)
                    OUTPUT INSERTED.id_notificacion
                    VALUES (?, ?, ?, ?, ?, ?, GETDATE(), GETDATE(), 0, ?, ?)
                    """
                    
                    cursor.execute(notif_query,
                                  (rechazo_id, id_visita_actual, id_cliente, nombre_cliente,
                                   punto_venta, current_user.username, description, photo_id))
                    
                    notif_result = cursor.fetchone()
                    notificacion_id = notif_result[0] if notif_result else rechazo_id
                    
                    conn.commit()
                    
                    notification_data = {
                        'id_notificacion': notificacion_id,
                        'id_foto_rechazada': rechazo_id,
                        'id_foto_original': photo_id,
                        'id_visita': id_visita_actual,
                        'id_cliente': id_cliente,
                        'nombre_cliente': nombre_cliente,
                        'punto_venta': punto_venta,
                        'rechazado_por': current_user.username,
                        'fecha_rechazo': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                        'fecha_notificacion': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                        'leido': 0,
                        'descripcion': description,
                        'tipo_foto': tipo_foto
                    }
                    
                    emit_new_notification(notification_data)
                    
                    telegram_data = {
                        'rechazado_por': current_user.username,
                        'id_visita': id_visita_actual,
                        'id_foto': photo_id,
                        'cliente': nombre_cliente,
                        'punto_venta': punto_venta,
                        'fecha_rechazo': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                        'comentario': description,
                        'tipo_foto': tipo_foto
                    }
                    
                    def enviar_telegram_async(app_ref, data):
                        with app_ref.app_context():
                            try:
                                enviar_notificacion_telegram(data)
                            except:
                                pass
                    
                    telegram_thread = threading.Thread(
                        target=enviar_telegram_async,
                        args=(app, telegram_data)
                    )
                    telegram_thread.daemon = True
                    telegram_thread.start()
            
            except Exception as e:
                conn.rollback()
                current_app.logger.error(f"Error en rechazo: {str(e)}")
                raise e
            finally:
                cursor.close()
                conn.close()
        
        update_visit_status_query = """
        UPDATE VISITAS_MERCADERISTA
        SET estado = 'Revisado'
        WHERE id_visita = ?
        """
        execute_query(update_visit_status_query, (visit_id,), commit=True)
        
        return jsonify({
            "success": True,
            "message": f"Procesadas {len(approved_photos)} aprobaciones y {len(rejected_photos)} rechazos."
        })
        
    except Exception as e:
        current_app.logger.error(f"Error guardando decisiones: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500


@visits_bp.route("/api/visit-photos-with-ids/<int:visit_id>")
@login_required
def get_visit_photos_with_ids(visit_id):
    try:
        query = """
            SELECT id_foto, file_path, id_tipo_foto 
            FROM FOTOS_TOTALES 
            WHERE id_visita = ? AND id_tipo_foto IN (1, 2)
            ORDER BY id_tipo_foto, id_foto
        """
        rows = execute_query(query, (visit_id,))
        
        fotos = []
        for row in rows:
            fotos.append({
                "id_foto": row[0],
                "file_path": row[1],
                "type": "antes" if row[2] == 1 else "despues"
            })
            
        return jsonify(fotos)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo fotos con IDs: {str(e)}")
        return jsonify({"error": str(e)}), 500

@visits_bp.route("/api/photos/save-visible-decisions", methods=["POST"])
@login_required
def save_visible_decisions():
    try:
        data = request.get_json()
        visit_id = data.get("visit_id")
        decisions = data.get("decisions", [])
        total_processed = data.get("total_photos_processed", 0)
        
        if not decisions:
            return jsonify({
                "success": False,
                "message": "No hay decisiones para procesar"
            }), 400
        
        categoria_query = """
            SELECT c.cliente
            FROM VISITAS_MERCADERISTA vm
            JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
            WHERE vm.id_visita = ?
        """
        categoria_result = execute_query(categoria_query, (visit_id,), fetch_one=True)
        categoria = categoria_result[0] if categoria_result else "Sin Categoría"
        
        aprobados = 0
        rechazados = 0
        
        for decision in decisions:
            file_path = decision["file_path"]
            photo_id = decision["id_foto_original"]
            tipo = decision["type"]
            status = decision["status"]
            
            clean_path = file_path.replace("X://", "").replace("X:/", "")
            
            if status == "aprobada":
                check_aprobada = "SELECT COUNT(*) FROM FOTOS_APROBADAS WHERE id_foto_original = ?"
                exists = execute_query(check_aprobada, (photo_id,), fetch_one=True)
                
                if exists[0] == 0:
                    insert_query = """
                        INSERT INTO FOTOS_APROBADAS 
                        (id_visita, id_foto_original, tipo, categoria, file_path, fecha_registro, fecha_aprobacion)
                        VALUES (?, ?, ?, ?, ?, GETDATE(), GETDATE())
                    """
                    execute_query(insert_query, (visit_id, photo_id, tipo, categoria, clean_path), commit=True)
                    aprobados += 1
                
            elif status == "rechazada":
                check_rechazada = "SELECT COUNT(*) FROM FOTOS_RECHAZADAS WHERE id_foto_original = ?"
                exists = execute_query(check_rechazada, (photo_id,), fetch_one=True)
                
                if exists[0] == 0:
                    razones = decision.get("razones", [])
                    descripcion = decision.get("descripcion", "")
                    
                    razones_str = ";".join(razones) if razones else ""
                    
                    insert_query = """
                        INSERT INTO FOTOS_RECHAZADAS 
                        (id_visita, id_foto_original, fecha_registro, fecha_rechazo, id_razones_rechazos, descripcion)
                        VALUES (?, ?, GETDATE(), GETDATE(), ?, ?)
                    """
                    execute_query(insert_query, (
                        visit_id, 
                        photo_id, 
                        razones_str, 
                        descripcion
                    ), commit=True)
                    rechazados += 1
        
        return jsonify({
            "success": True,
            "message": f"Procesadas {len(decisions)} fotos",
            "aprobados": aprobados,
            "rechazados": rechazados
        })
        
    except Exception as e:
        current_app.logger.error(f"Error guardando decisiones visibles: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

@visits_bp.route("/api/points-with-photos/<string:status>")
@login_required
def get_points_with_photos(status):
    try:
        query = """
            SELECT 
                pin.identificador,
                pin.punto_de_interes,
                c.cliente,
                COUNT(ft.id_foto) as total_fotos
            FROM FOTOS_TOTALES ft
            JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
            JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
            JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
            WHERE ft.estado = ?
            GROUP BY pin.identificador, pin.punto_de_interes, c.cliente
            ORDER BY pin.punto_de_interes, c.cliente
        """
        
        points = execute_query(query, (status,))
        
        points_dict = {}
        for row in points:
            point_id = row[0]
            if point_id not in points_dict:
                points_dict[point_id] = {
                    "identificador": row[0],
                    "punto_de_interes": row[1],
                    "clientes": row[2],
                    "total_fotos": 0
                }
            points_dict[point_id]["total_fotos"] += row[3]
            if row[2] not in points_dict[point_id]["clientes"]:
                if points_dict[point_id]["clientes"] != row[2]:
                    points_dict[point_id]["clientes"] += f", {row[2]}"
        
        return jsonify(list(points_dict.values()))
        
    except Exception as e:
        current_app.logger.error(f"Error obteniendo puntos con fotos: {str(e)}")
        return jsonify({"error": str(e)}), 500

@visits_bp.route("/api/point-photos/<string:point_id>/<string:status>")
@login_required
def get_point_photos(point_id, status):
    try:
        if status == "Todos los Estatus":
            query = """
                SELECT 
                    ft.id_foto,
                    ft.file_path,
                    ft.id_tipo_foto as tipo,
                    ft.estado,
                    c.cliente,
                    pin.punto_de_interes,
                    m.nombre as mercaderista,
                    vm.fecha_visita as fecha
                FROM FOTOS_TOTALES ft
                JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
                JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
                JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
                JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
                WHERE pin.identificador = ?
                ORDER BY vm.fecha_visita DESC, ft.id_foto DESC
            """
            params = (point_id,)
        else:
            query = """
                SELECT 
                    ft.id_foto,
                    ft.file_path,
                    ft.id_tipo_foto as tipo,
                    ft.estado,
                    c.cliente,
                    pin.punto_de_interes,
                    m.nombre as mercaderista,
                    vm.fecha_visita as fecha
                FROM FOTOS_TOTALES ft
                JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
                JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
                JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
                JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
                WHERE pin.identificador = ? AND ft.estado = ?
                ORDER BY vm.fecha_visita DESC, ft.id_foto DESC
            """
            params = (point_id, status)
        
        photos = execute_query(query, params)
        
        return jsonify([{
            "id_foto": row[0],
            "file_path": row[1],
            "tipo": 'antes' if row[2] == 1 else 'despues',
            "estado": row[3],
            "cliente": row[4],
            "punto_de_interes": row[5],
            "mercaderista": row[6],
            "fecha": row[7].isoformat() if row[7] else None
        } for row in photos])
        
    except Exception as e:
        current_app.logger.error(f"Error obteniendo fotos del punto: {str(e)}")
        return jsonify({"error": str(e)}), 500

@visits_bp.route("/api/photo-details/<int:photo_id>")
@login_required
def get_photo_details(photo_id):
    try:
        query = """
            SELECT 
                ft.id_foto,
                ft.file_path,
                ft.id_tipo_foto as tipo,
                ft.estado,
                c.cliente,
                pin.punto_de_interes,
                m.nombre as mercaderista,
                vm.fecha_visita as fecha
            FROM FOTOS_TOTALES ft
            JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
            JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
            JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
            JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
            WHERE ft.id_foto = ?
        """
        
        photo = execute_query(query, (photo_id,), fetch_one=True)
        
        if not photo:
            return jsonify({"error": "Foto no encontrada"}), 404
            
        return jsonify({
            "id_foto": photo[0],
            "file_path": photo[1],
            "tipo": 'antes' if photo[2] == 1 else 'despues',
            "estado": photo[3],
            "cliente": photo[4],
            "punto_de_interes": photo[5],
            "mercaderista": photo[6],
            "fecha": photo[7].isoformat() if photo[7] else None
        })
        
    except Exception as e:
        current_app.logger.error(f"Error obteniendo detalles de foto: {str(e)}")
        return jsonify({"error": str(e)}), 500

@visits_bp.route("/api/points-with-filters")
@login_required
def get_points_with_filters():
    try:
        departamento = request.args.get('departamento', '')
        ciudad = request.args.get('ciudad', '')
        cliente = request.args.get('cliente', '')
        analista = request.args.get('analista', '')
        fecha_inicio = request.args.get('fecha_inicio', '')
        fecha_fin = request.args.get('fecha_fin', '')
        status = request.args.get('status', '')
        search_point = request.args.get('search_point', '')
        tipo_pdv = request.args.get('tipo_pdv', '')

        query = """
            SELECT 
                pin.identificador,
                pin.punto_de_interes,
                pin.departamento,
                pin.ciudad,
                c.cliente,
                a.nombre_analista,
                COUNT(DISTINCT ft.id_foto) as total_fotos
            FROM FOTOS_TOTALES ft
            JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
            JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
            JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
            JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes AND c.id_cliente = rp.id_cliente
            JOIN RUTAS_NUEVAS rn ON rp.id_ruta = rn.id_ruta
            JOIN analistas a ON rn.id_analista = a.id_analista
            WHERE 1=1
        """
        
        params = []
        
        if status and status != "Todos los Estatus":
            query += " AND ft.estado = ?"
            params.append(status)
        
        if departamento:
            query += " AND pin.departamento LIKE ?"
            params.append(f"%{departamento}%")
        
        if ciudad:
            query += " AND pin.ciudad LIKE ?"
            params.append(f"%{ciudad}%")
        
        if cliente:
            query += " AND c.cliente LIKE ?"
            params.append(f"%{cliente}%")
        
        if analista:
            query += " AND a.nombre_analista LIKE ?"
            params.append(f"%{analista}%")
        
        if fecha_inicio:
            query += " AND vm.fecha_visita >= ?"
            params.append(fecha_inicio)
        
        if fecha_fin:
            query += " AND vm.fecha_visita <= ?"
            params.append(fecha_fin)
        
        if search_point:
            query += " AND pin.punto_de_interes LIKE ?"
            params.append(f"%{search_point}%")
            
        if tipo_pdv:
            query += " AND pin.jerarquia_nivel_2 = ?"
            params.append(tipo_pdv)
            
        query += """
            GROUP BY pin.identificador, pin.punto_de_interes, pin.departamento, 
                     pin.ciudad, c.cliente, a.nombre_analista
            HAVING COUNT(DISTINCT ft.id_foto) > 0
            ORDER BY pin.departamento, pin.ciudad, pin.punto_de_interes
        """
        
        rows = execute_query(query, params)
        
        points_dict = {}
        for row in rows:
            point_key = f"{row[0]}-{row[5]}"
            if point_key not in points_dict:
                points_dict[point_key] = {
                    "identificador": row[0],
                    "punto_de_interes": row[1],
                    "departamento": row[2],
                    "ciudad": row[3],
                    "clientes": [],
                    "analista": row[5],
                    "total_fotos": 0
                }
            
            if row[4] not in points_dict[point_key]["clientes"]:
                points_dict[point_key]["clientes"].append(row[4])
            
            points_dict[point_key]["total_fotos"] += row[6]
        
        result = []
        for point in points_dict.values():
            point["clientes"] = ", ".join(sorted(set(point["clientes"])))
            result.append(point)
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"Error obteniendo puntos con filtros: {str(e)}")
        return jsonify({"error": str(e)}), 500

@visits_bp.route("/api/filter-options")
@login_required
def get_filter_options():
    try:
        dept_query = """
            SELECT DISTINCT departamento 
            FROM PUNTOS_INTERES1 
            WHERE departamento IS NOT NULL 
            AND LTRIM(RTRIM(departamento)) != ''
            AND ISNUMERIC(departamento) = 0
            AND LEN(LTRIM(RTRIM(departamento))) > 3
            ORDER BY departamento
        """
        departamentos = [str(row[0]).strip() for row in execute_query(dept_query) if row[0]]
        
        city_query = """
            SELECT DISTINCT ciudad, departamento
            FROM PUNTOS_INTERES1 
            WHERE ciudad IS NOT NULL 
            AND LTRIM(RTRIM(ciudad)) != ''
            AND ISNUMERIC(ciudad) = 0
            AND LEN(LTRIM(RTRIM(ciudad))) > 3
            ORDER BY ciudad
        """
        ciudades = [{"nombre": str(row[0]).strip(), "departamento": str(row[1]).strip()} 
                   for row in execute_query(city_query) if row[0] and row[1]]
        
        client_query = """
            SELECT DISTINCT c.cliente, pin.ciudad
            FROM CLIENTES c
            JOIN RUTA_PROGRAMACION rp ON c.id_cliente = rp.id_cliente
            JOIN PUNTOS_INTERES1 pin ON rp.id_punto_interes = pin.identificador
            WHERE c.cliente IS NOT NULL 
            AND LTRIM(RTRIM(c.cliente)) != ''
            AND LEN(LTRIM(RTRIM(c.cliente))) > 2
            ORDER BY c.cliente
        """
        clientes = [{"nombre": str(row[0]).strip(), "ciudad": str(row[1]).strip()} 
                   for row in execute_query(client_query) if row[0] and row[1]]
        
        analyst_query = """
            SELECT DISTINCT a.nombre_analista 
            FROM analistas a
            JOIN RUTAS_NUEVAS rn ON a.id_analista = rn.id_analista
            WHERE a.nombre_analista IS NOT NULL 
            AND LTRIM(RTRIM(a.nombre_analista)) != ''
            AND LEN(LTRIM(RTRIM(a.nombre_analista))) > 2
            ORDER BY a.nombre_analista
        """
        analistas = [str(row[0]).strip() for row in execute_query(analyst_query) if row[0]]
        
        tipo_pdv_query = """
            SELECT DISTINCT jerarquia_nivel_2
            FROM PUNTOS_INTERES1 
            WHERE jerarquia_nivel_2 IS NOT NULL 
            AND LTRIM(RTRIM(jerarquia_nivel_2)) != ''
            AND LEN(LTRIM(RTRIM(jerarquia_nivel_2))) > 2
            ORDER BY jerarquia_nivel_2
        """
        tipos_pdv = [str(row[0]).strip() for row in execute_query(tipo_pdv_query) if row[0]]
        
        return jsonify({
            "departamentos": departamentos,
            "ciudades": ciudades,
            "clientes": clientes,
            "analistas": analistas,
            "tiposPdv": tipos_pdv
        })
        
    except Exception as e:
        return jsonify({
            "departamentos": [],
            "ciudades": [],
            "clientes": [],
            "analistas": [],
            "tiposPdv": []
        })

@visits_bp.route("/api/cities-by-department/<string:departamento>")
@login_required
def get_cities_by_department(departamento):
    try:
        query = """
            SELECT DISTINCT ciudad
            FROM PUNTOS_INTERES1 
            WHERE departamento = ?
            AND ciudad IS NOT NULL 
            AND LTRIM(RTRIM(ciudad)) != ''
            ORDER BY ciudad
        """
        ciudades = [str(row[0]).strip() for row in execute_query(query, (departamento,)) if row[0]]
        return jsonify(ciudades)
    except Exception as e:
        return jsonify([])
    
@visits_bp.route("/api/clients-by-city/<string:ciudad>")
@login_required
def get_clients_by_city(ciudad):
    try:
        query = """
            SELECT DISTINCT c.cliente
            FROM CLIENTES c
            JOIN RUTA_PROGRAMACION rp ON c.id_cliente = rp.id_cliente
            JOIN PUNTOS_INTERES1 pin ON rp.id_punto_interes = pin.identificador
            WHERE pin.ciudad = ?
            AND c.cliente IS NOT NULL 
            AND LTRIM(RTRIM(c.cliente)) != ''
            ORDER BY c.cliente
        """
        clientes = [str(row[0]).strip() for row in execute_query(query, (ciudad,)) if row[0]]
        return jsonify(clientes)
    except Exception as e:
        return jsonify([])


@visits_bp.route('/api/client-image/<path:image_path>')
@login_required
def serve_client_image(image_path):
    """
    Sirve imágenes para clientes desde Azure BLOB Storage
    """
    try:
        if current_user.rol != 'client':
            current_app.logger.warning(f"⚠️ Acceso no autorizado: {current_user.username}")
            return jsonify({"error": "Unauthorized"}), 403
        
        from azure.storage.blob import BlobServiceClient
        
        connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
        container_name = "epran"
        
        if not connection_string:
            current_app.logger.error("❌ Azure connection string no encontrada")
            return "Configuration error", 500
        
        # Limpieza de ruta
        clean_path = image_path
        
        if clean_path.startswith("X://") or clean_path.startswith("X:/") or clean_path.startswith("X:\\"):
            clean_path = clean_path.replace("X://", "").replace("X:/", "").replace("X:\\", "")
        
        clean_path = clean_path.replace("\\", "/").lstrip("/")
        clean_path = urllib.parse.unquote(clean_path)
        
        current_app.logger.info(f"📂 [CLIENTE] Buscando: {clean_path}")
        
        # Usar BlobServiceClient
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        blob_client = blob_service_client.get_blob_client(container=container_name, blob=clean_path)
        
        try:
            blob_properties = blob_client.get_blob_properties()
            current_app.logger.info(f"✅ [CLIENTE] Imagen encontrada")
        except Exception:
            current_app.logger.error(f"❌ [CLIENTE] Imagen NO encontrada: {clean_path}")
            return "Image not found", 404
        
        download_stream = blob_client.download_blob()
        file_content = download_stream.readall()
        
        import mimetypes
        mime_type, _ = mimetypes.guess_type(clean_path)
        if not mime_type:
            mime_type = 'image/jpeg'
        
        return send_file(
            io.BytesIO(file_content),
            mimetype=mime_type,
            as_attachment=False,
            download_name=os.path.basename(clean_path)
        )
        
    except Exception as e:
        current_app.logger.error(f"❌ [CLIENTE] Error: {str(e)}")
        return "Error serving image", 500

@visits_bp.route("/api/visit-price-photos/<int:visit_id>")
@login_required
def get_visit_price_photos(visit_id):
    try:
        query = """
            SELECT id_foto, file_path, id_tipo_foto 
            FROM FOTOS_TOTALES 
            WHERE id_visita = ? AND id_tipo_foto = 3
            ORDER BY id_foto
        """
        rows = execute_query(query, (visit_id,))
        
        fotos = []
        for row in rows:
            fotos.append({
                "id_foto": row[0],
                "file_path": row[1],
                "type": "precio"
            })
            
        return jsonify(fotos)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo fotos de precios: {str(e)}")
        return jsonify({"error": str(e)}), 500

@visits_bp.route("/api/save-price-decisions", methods=["POST"])
@login_required
def save_price_decisions():
    try:
        data = request.get_json()
        visit_id = data.get("visit_id")
        decisions = data.get("decisions", [])
        
        from app.routes.auth import enviar_notificacion_telegram, emit_new_notification
        app = current_app._get_current_object()
        
        for decision in decisions:
            photo_id = decision.get("id_foto")
            status = decision.get("status")
            razones = decision.get("razones", [])
            descripcion = decision.get("descripcion", "")
            
            update_query = """
            UPDATE FOTOS_TOTALES
            SET Estado = ?
            WHERE id_foto = ? AND id_visita = ?
            """
            
            estado_texto = 'Aprobada' if status == 'approved' else 'Rechazada'
            execute_query(update_query, (estado_texto, photo_id, visit_id), commit=True)
            
            if status == 'rejected':
                foto_info_query = """
                SELECT vm.id_cliente, c.cliente, pin.punto_de_interes, ft.fecha_registro
                FROM FOTOS_TOTALES ft
                JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
                LEFT JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
                LEFT JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
                WHERE ft.id_foto = ?
                """
                foto_info = execute_query(foto_info_query, (photo_id,), fetch_one=True)
                
                id_cliente = foto_info[0] if foto_info else None
                nombre_cliente = foto_info[1] if foto_info else "Desconocido"
                punto_venta = foto_info[2] if foto_info else "Desconocido"
                fecha_registro = foto_info[3] if foto_info else None
                
                razones_texto = "; ".join(razones) if razones else ""
                
                conn = get_db_connection()
                cursor = conn.cursor()
                
                try:
                    insert_query = """
                    INSERT INTO FOTOS_RECHAZADAS
                    (id_visita, id_foto_original, fecha_registro, fecha_rechazo,
                     id_razones_rechazos, descripcion, rechazado_por)
                    OUTPUT INSERTED.id_foto_rechazada
                    VALUES (?, ?, ?, GETDATE(), ?, ?, ?)
                    """
                    cursor.execute(insert_query, (
                        visit_id, photo_id, fecha_registro, 
                        razones_texto, descripcion, current_user.username
                    ))
                    
                    rechazo_result = cursor.fetchone()
                    rechazo_id = rechazo_result[0] if rechazo_result else None
                    
                    if rechazo_id:
                        notif_query = """
                        INSERT INTO NOTIFICACIONES_RECHAZO_FOTOS 
                        (id_foto_rechazada, id_visita, id_cliente, nombre_cliente, 
                         punto_venta, rechazado_por, fecha_rechazo, fecha_notificacion, 
                         leido, descripcion, id_foto_original)
                        OUTPUT INSERTED.id_notificacion
                        VALUES (?, ?, ?, ?, ?, ?, GETDATE(), GETDATE(), 0, ?, ?)
                        """
                        
                        cursor.execute(notif_query, 
                                      (rechazo_id, visit_id, id_cliente, nombre_cliente,
                                       punto_venta, current_user.username, descripcion, photo_id))
                        
                        notif_result = cursor.fetchone()
                        notificacion_id = notif_result[0] if notif_result else rechazo_id
                        
                        conn.commit()
                        
                        notification_data = {
                            'id_notificacion': notificacion_id,
                            'id_foto_rechazada': rechazo_id,
                            'id_foto_original': photo_id,
                            'id_visita': visit_id,
                            'id_cliente': id_cliente,
                            'nombre_cliente': nombre_cliente,
                            'punto_venta': punto_venta,
                            'rechazado_por': current_user.username,
                            'fecha_rechazo': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                            'fecha_notificacion': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                            'leido': 0,
                            'descripcion': descripcion,
                            'tipo_foto': 'Precio'
                        }
                        
                        emit_new_notification(notification_data)
                        
                        telegram_data = {
                            'rechazado_por': current_user.username,
                            'id_visita': visit_id,
                            'id_foto': photo_id,
                            'cliente': nombre_cliente,
                            'punto_venta': punto_venta,
                            'fecha_rechazo': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                            'comentario': descripcion,
                            'tipo_foto': 'Precio'
                        }
                        
                        def enviar_telegram_async(app_ref, data):
                            with app_ref.app_context():
                                try:
                                    enviar_notificacion_telegram(data)
                                except:
                                    pass
                        
                        telegram_thread = threading.Thread(
                            target=enviar_telegram_async,
                            args=(app, telegram_data)
                        )
                        telegram_thread.daemon = True
                        telegram_thread.start()
                
                except Exception as e:
                    conn.rollback()
                    raise e
                finally:
                    cursor.close()
                    conn.close()
        
        return jsonify({
            "success": True,
            "message": f"Procesadas {len(decisions)} decisiones de precios"
        })
        
    except Exception as e:
        current_app.logger.error(f"Error guardando decisiones de precios: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

@visits_bp.route("/api/visit-exhibition-photos/<int:visit_id>")
@login_required
def get_visit_exhibition_photos(visit_id):
    try:
        query = """
            SELECT id_foto, file_path, id_tipo_foto 
            FROM FOTOS_TOTALES 
            WHERE id_visita = ? AND id_tipo_foto = 4
            ORDER BY id_foto
        """
        rows = execute_query(query, (visit_id,))
        
        fotos = []
        for row in rows:
            fotos.append({
                "id_foto": row[0],
                "file_path": row[1],
                "type": "exhibicion"
            })
            
        return jsonify(fotos)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo fotos de exhibiciones: {str(e)}")
        return jsonify({"error": str(e)}), 500