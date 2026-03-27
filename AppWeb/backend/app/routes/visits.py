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
            4: "Exhibición",
            8: "Material POP (Antes)",
            9: "Material POP (Despues)"
        }
        
        tipo_foto = tipo_foto_map.get(foto_info.get('id_tipo_foto'), 'Desconocida')
        
        # ✅ CONSTRUIR MENSAJE CON RAZÓN COMPLETA
        mensaje = f"""🚫 Foto Rechazada
🆔 ID Foto: {foto_id}
📸 Tipo: {tipo_foto}
🏢 Cliente: {foto_info.get('cliente', 'N/A')}
📍 Punto: {foto_info.get('punto_venta', 'N/A')}
📅 Fecha: {foto_info.get('fecha', 'N/A')}
👤 Rechazado por: {rechazado_por}
📝 Razón: {razon_texto}"""
        
        # Metadata adicional
        # Obtener file_path de la foto rechazada
        # Obtener file_path de la foto rechazada
        file_path_foto = None
        try:
            fp_result = execute_query(
                "SELECT file_path FROM FOTOS_TOTALES WHERE id_foto = ?",
                (foto_id,), fetch_one=True
            )
            current_app.logger.info(f"🔍 foto_id={foto_id}, fp_result={fp_result}, tipo={type(fp_result)}")
            if fp_result:
                current_app.logger.info(f"🔍 fp_result[0]={fp_result[0]}, len={len(str(fp_result[0])) if fp_result[0] else 'None'}")
            if fp_result and fp_result[0] and len(str(fp_result[0])) > 5:
                raw = str(fp_result[0]).replace("X://", "").replace("X:/", "")
                raw = raw.replace("\\", "/").lstrip("/")
                file_path_foto = raw
                current_app.logger.info(f"✅ file_path_foto={file_path_foto}")
        except Exception as fp_err:
            current_app.logger.warning(f"⚠️ file_path error foto {foto_id}: {fp_err}")

        # Metadata adicional
        file_path_foto = None
        try:
            fp_result = execute_query(
                "SELECT file_path FROM FOTOS_TOTALES WHERE id_foto = ?",
                (foto_id,), fetch_one=True
            )
            if fp_result is not None:
                raw_path = fp_result if isinstance(fp_result, str) else fp_result[0]
                if raw_path and len(str(raw_path)) > 5:
                    raw_path = str(raw_path).replace("X://", "").replace("X:/", "")
                    raw_path = raw_path.replace("\\", "/").lstrip("/")
                    file_path_foto = raw_path
        except Exception as fp_err:
            current_app.logger.warning(f"⚠️ file_path error foto {foto_id}: {fp_err}")

        # Metadata adicional
        metadata = {
            'tipo_evento': 'rechazo_foto',
            'id_foto': foto_id,
            'tipo_foto': tipo_foto,
            'cliente': foto_info.get('cliente'),
            'punto_venta': foto_info.get('punto_venta'),
            'rechazado_por': rechazado_por,
            'razon': razon_texto,
            'file_path': file_path_foto
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
            
            socketio.emit('new_message', mensaje_data, room=room, namespace='/chat')
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
            ORDER BY bt.FECHA_BALANCE DESC
        """
        rows = execute_query(query)
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
    import urllib.parse
    from flask import redirect
    from app.utils.azure_sas import get_sas_url

    clean = image_path.replace("X://", "").replace("X:/", "")
    clean = clean.replace("\\", "/").lstrip("/")
    clean = urllib.parse.unquote(clean)

    try:
        url = get_sas_url(clean)
        return redirect(url, code=302)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
            fotos_validas_aprobar = []
            for pid in approved_photos:
                chk = execute_query(
                    "SELECT Estado, ISNULL(veces_reemplazada,0) FROM FOTOS_TOTALES WHERE id_foto=?",
                    (pid,), fetch_one=True
                )
                if not chk:
                    continue
                if chk[0] == 'Aprobada':
                    current_app.logger.warning(f"Foto {pid} ya aprobada, saltando")
                    continue
                if chk[0] == 'Rechazada':
                    count_r = execute_query(
                        "SELECT COUNT(*) FROM FOTOS_RECHAZADAS WHERE id_foto_original=?",
                        (pid,), fetch_one=True
                    )
                    rechazos = int(count_r[0] or 0) if count_r else 0
                    if rechazos >= int(chk[1] or 0):
                        current_app.logger.warning(f"Foto {pid} bloqueada para aprobar")
                        continue
                fotos_validas_aprobar.append(pid)

            if fotos_validas_aprobar:
                update_approved_query = """
                UPDATE FOTOS_TOTALES
                SET Estado = 'Aprobada'
                WHERE id_foto IN ({})
                """.format(','.join(['?'] * len(fotos_validas_aprobar)))
                execute_query(update_approved_query, fotos_validas_aprobar, commit=True)
                
        for rejected_photo in rejected_photos:
            photo_id = rejected_photo.get("id_foto")
            reason_id = rejected_photo.get("rejection_reason_id")
            description = rejected_photo.get("rejection_description", "")

            check_dup = execute_query(
                "SELECT Estado, ISNULL(veces_reemplazada,0) FROM FOTOS_TOTALES WHERE id_foto=?",
                (photo_id,), fetch_one=True
            )
            if check_dup and check_dup[0] == 'Rechazada' and int(check_dup[1] or 0) == 0:
                current_app.logger.warning(f"Foto {photo_id} ya rechazada sin actualizar, saltando")
                continue
            
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
        
        verificacion_query = """
            SELECT COUNT(*) as total_fotos,
                   SUM(CASE WHEN Estado = 'Aprobada' THEN 1 ELSE 0 END) as fotos_aprobadas
            FROM FOTOS_TOTALES
            WHERE id_visita = ?
            AND id_tipo_foto IN (1, 2, 3, 4, 8, 9)
        """
        resultado = execute_query(verificacion_query, (visit_id,), fetch_one=True)
        total_fotos = resultado[0] if resultado else 0
        fotos_aprobadas = resultado[1] if resultado else 0

        if total_fotos > 0 and total_fotos == fotos_aprobadas:
        
            update_visit_status_query = """
            UPDATE VISITAS_MERCADERISTA
            SET estado = 'Revisado'
            WHERE id_visita = ?
        """
            execute_query(update_visit_status_query, (visit_id,), commit=True)
            mensaje_estado = "✅ Visita completada - todas las fotos han sido revisadas"
        else:
            mensaje_estado = f"📊 Progreso: {fotos_aprobadas} de {total_fotos} fotos revisadas"
        
        return jsonify({
    "success": True,
    "message": f"... {mensaje_estado}"  # Agregar mensaje_estado al mensaje de respuesta
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
    if current_user.rol != 'client':
        return jsonify({"error": "Unauthorized"}), 403

    import urllib.parse
    from flask import redirect
    from app.utils.azure_sas import get_sas_url

    clean = image_path.replace("X://", "").replace("X:/", "")
    clean = clean.replace("\\", "/").lstrip("/")
    clean = urllib.parse.unquote(clean)

    try:
        return redirect(get_sas_url(clean), code=302)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

            reason_id = decision.get("rejection_reason_id")  # ✅ ID numérico

            razones = decision.get("razones", [])
            descripcion = decision.get("descripcion", "")
            
            update_query = """
            UPDATE FOTOS_TOTALES
            SET Estado = ?
            WHERE id_foto = ? AND id_visita = ?
            """
            
            estado_texto = 'Aprobada' if status == 'approved' else 'Rechazada'

            chk = execute_query(
                "SELECT Estado, ISNULL(veces_reemplazada,0) FROM FOTOS_TOTALES WHERE id_foto=?",
                (photo_id,), fetch_one=True
            )
            if not chk:
                continue

            veces_reemplazada = int(chk[1] or 0)

            if status == 'approved':
                if chk[0] == 'Aprobada':
                    current_app.logger.warning(f"Foto {photo_id} ya aprobada, saltando")
                    continue
                if chk[0] == 'Rechazada':
                    count_r = execute_query(
                        "SELECT COUNT(*) FROM FOTOS_RECHAZADAS WHERE id_foto_original=?",
                        (photo_id,), fetch_one=True
                    )
                    rechazos = int(count_r[0] or 0) if count_r else 0
                    if rechazos >= veces_reemplazada:
                        current_app.logger.warning(f"Foto {photo_id} bloqueada para aprobar")
                        continue

            if status == 'rejected':
                if chk[0] == 'Rechazada':
                    count_r = execute_query(
                        "SELECT COUNT(*) FROM FOTOS_RECHAZADAS WHERE id_foto_original=?",
                        (photo_id,), fetch_one=True
                    )
                    rechazos = int(count_r[0] or 0) if count_r else 0
                    if rechazos >= veces_reemplazada:
                        current_app.logger.warning(f"Foto {photo_id} bloqueada para rechazar")
                        continue
            update_query = """
            UPDATE FOTOS_TOTALES
            SET Estado = ?
            WHERE id_foto = ? AND id_visita = ?
            """
            execute_query(update_query, (estado_texto, photo_id, visit_id), commit=True)

            #execute_query(update_query, (estado_texto, photo_id, visit_id), commit=True)
            
            if status == 'rejected':
                foto_info_query = """

                SELECT vm.id_cliente, c.cliente, pin.punto_de_interes, ft.fecha_registro, ft.id_tipo_foto

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

                id_tipo_foto = foto_info[4] if foto_info and len(foto_info) > 4 else 3
                
                # ✅ Texto de razones para descripción y chat
                razones_texto = "; ".join(razones) if razones else ""
                descripcion_final = descripcion if descripcion else razones_texto

                foto_info_chat = {
                    'id_tipo_foto': id_tipo_foto,
                    'cliente': nombre_cliente,
                    'punto_venta': punto_venta,
                    'fecha': fecha_registro.strftime('%Y-%m-%d') if fecha_registro else 'N/A'
                }

                razon_final = razones_texto if razones_texto else descripcion

                enviar_mensaje_sistema_rechazo(
                    visit_id=visit_id,
                    foto_id=photo_id,
                    foto_info=foto_info_chat,
                    razon_texto=razon_final,
                    rechazado_por=current_user.username
                )

                
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

                    # ✅ reason_id es INT o NULL, descripcion_final es el texto
                    cursor.execute(insert_query, (
                        visit_id, photo_id, fecha_registro, 
                        reason_id if reason_id else None,
                        descripcion_final,
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
                                      (rechazo_id, visit_id, id_cliente, nombre_cliente,

                                       punto_venta, current_user.username, descripcion_final, photo_id))

                        
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

                            'descripcion': descripcion_final,

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

                            'comentario': descripcion_final,

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
        

        # ========================================
        # ✅ VERIFICACIÓN DE COMPLETITUD
        # ========================================
        verificacion_query = """
            SELECT COUNT(*) as total_fotos,
                   SUM(CASE WHEN Estado = 'Aprobada' THEN 1 ELSE 0 END) as fotos_aprobadas
            FROM FOTOS_TOTALES
            WHERE id_visita = ?
            AND id_tipo_foto IN (1, 2, 3, 4, 8, 9)
        """
        resultado = execute_query(verificacion_query, (visit_id,), fetch_one=True)
        total_fotos = resultado[0] if resultado else 0
        fotos_aprobadas = resultado[1] if resultado else 0

        if total_fotos > 0 and total_fotos == fotos_aprobadas:
            update_visit_status_query = """
            UPDATE VISITAS_MERCADERISTA
            SET estado = 'Revisado'
            WHERE id_visita = ?
            """
            execute_query(update_visit_status_query, (visit_id,), commit=True)
            mensaje_estado = "✅ Visita completada - todas las fotos han sido revisadas"
        else:
            mensaje_estado = f"📊 Progreso: {fotos_aprobadas} de {total_fotos} fotos revisadas"
        
        return jsonify({
            "success": True,
            "message": f"Procesadas {len(decisions)} decisiones de precios. {mensaje_estado}"

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



@visits_bp.route("/api/save-exhibition-decisions", methods=["POST"])
@login_required
def save_exhibition_decisions():
    try:
        data = request.get_json()
        visit_id = data.get("visit_id")
        decisions = data.get("decisions", [])
        
        from app.routes.auth import enviar_notificacion_telegram, emit_new_notification
        app = current_app._get_current_object()
        
        for decision in decisions:
            photo_id = decision.get("id_foto")
            status = decision.get("status")
            reason_id = decision.get("rejection_reason_id")  # ✅ ID numérico
            razones = decision.get("razones", [])
            descripcion = decision.get("descripcion", "")
            
            update_query = """
            UPDATE FOTOS_TOTALES
            SET Estado = ?
            WHERE id_foto = ? AND id_visita = ?
            """
            
            estado_texto = 'Aprobada' if status == 'approved' else 'Rechazada'

            chk = execute_query(
                "SELECT Estado, ISNULL(veces_reemplazada,0) FROM FOTOS_TOTALES WHERE id_foto=?",
                (photo_id,), fetch_one=True
            )
            if not chk:
                continue

            veces_reemplazada = int(chk[1] or 0)

            if status == 'approved':
                if chk[0] == 'Aprobada':
                    current_app.logger.warning(f"Foto {photo_id} ya aprobada, saltando")
                    continue
                if chk[0] == 'Rechazada':
                    count_r = execute_query(
                        "SELECT COUNT(*) FROM FOTOS_RECHAZADAS WHERE id_foto_original=?",
                        (photo_id,), fetch_one=True
                    )
                    rechazos = int(count_r[0] or 0) if count_r else 0
                    if rechazos >= veces_reemplazada:
                        current_app.logger.warning(f"Foto {photo_id} bloqueada para aprobar")
                        continue

            if status == 'rejected':
                if chk[0] == 'Rechazada':
                    count_r = execute_query(
                        "SELECT COUNT(*) FROM FOTOS_RECHAZADAS WHERE id_foto_original=?",
                        (photo_id,), fetch_one=True
                    )
                    rechazos = int(count_r[0] or 0) if count_r else 0
                    if rechazos >= veces_reemplazada:
                        current_app.logger.warning(f"Foto {photo_id} bloqueada para rechazar")
                        continue

            update_query = """
            UPDATE FOTOS_TOTALES
            SET Estado = ?
            WHERE id_foto = ? AND id_visita = ?
            """
            execute_query(update_query, (estado_texto, photo_id, visit_id), commit=True)

            
            if status == 'rejected':
                foto_info_query = """
                SELECT vm.id_cliente, c.cliente, pin.punto_de_interes, ft.fecha_registro, ft.id_tipo_foto
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
                id_tipo_foto = foto_info[4] if foto_info else 4
                
                # ✅ Texto de razones para descripción y chat
                razones_texto = "; ".join(razones) if razones else ""
                descripcion_final = descripcion if descripcion else razones_texto
                
                foto_info_chat = {
                    'id_tipo_foto': id_tipo_foto,
                    'cliente': nombre_cliente,
                    'punto_venta': punto_venta,
                    'fecha': fecha_registro.strftime('%Y-%m-%d') if fecha_registro else 'N/A'
                }
                
                razon_final = razones_texto if razones_texto else descripcion
                
                enviar_mensaje_sistema_rechazo(
                    visit_id=visit_id,
                    foto_id=photo_id,
                    foto_info=foto_info_chat,
                    razon_texto=razon_final,
                    rechazado_por=current_user.username
                )
                
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
                    # ✅ reason_id es INT o NULL, descripcion_final es el texto
                    cursor.execute(insert_query, (
                        visit_id, photo_id, fecha_registro, 
                        reason_id if reason_id else None,
                        descripcion_final,
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
                                      (rechazo_id, visit_id, id_cliente, nombre_cliente,
                                       punto_venta, current_user.username, descripcion_final, photo_id))
                        
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
                            'descripcion': descripcion_final,
                            'tipo_foto': 'Exhibición'
                        }
                        
                        emit_new_notification(notification_data)
                        
                        telegram_data = {
                            'rechazado_por': current_user.username,
                            'id_visita': visit_id,
                            'id_foto': photo_id,
                            'cliente': nombre_cliente,
                            'punto_venta': punto_venta,
                            'fecha_rechazo': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                            'comentario': descripcion_final,
                            'tipo_foto': 'Exhibición'
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
        
        # ========================================
        # ✅ VERIFICACIÓN DE COMPLETITUD
        # ========================================
        verificacion_query = """
            SELECT COUNT(*) as total_fotos,
                   SUM(CASE WHEN Estado = 'Aprobada' THEN 1 ELSE 0 END) as fotos_aprobadas
            FROM FOTOS_TOTALES
            WHERE id_visita = ?
            AND id_tipo_foto IN (1, 2, 3, 4, 8, 9)
        """
        resultado = execute_query(verificacion_query, (visit_id,), fetch_one=True)
        total_fotos = resultado[0] if resultado else 0
        fotos_aprobadas = resultado[1] if resultado else 0

        if total_fotos > 0 and total_fotos == fotos_aprobadas:
            update_visit_status_query = """
            UPDATE VISITAS_MERCADERISTA
            SET estado = 'Revisado'
            WHERE id_visita = ?
            """
            execute_query(update_visit_status_query, (visit_id,), commit=True)
            mensaje_estado = "✅ Visita completada - todas las fotos han sido revisadas"
        else:
            mensaje_estado = f"📊 Progreso: {fotos_aprobadas} de {total_fotos} fotos revisadas"
        
        return jsonify({
            "success": True,
            "message": f"Procesadas {len(decisions)} decisiones de exhibiciones. {mensaje_estado}"
        })
        
    except Exception as e:
        current_app.logger.error(f"Error guardando decisiones de exhibiciones: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500



# ========================================
# ENDPOINTS DE ACTIVACIONES/DESACTIVACIONES
# ========================================

@visits_bp.route("/api/point-activation-dates/<string:point_id>")
@login_required
def get_point_activation_dates(point_id):
    """Obtiene las fechas donde hay fotos de activación/desactivación para un punto"""
    try:
        query = """
            SELECT DISTINCT 
                CONVERT(VARCHAR(10), ft.fecha_registro, 23) as fecha
            FROM FOTOS_TOTALES ft
            JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
            WHERE vm.identificador_punto_interes = ?
            AND ft.id_tipo_foto IN (5, 6)
            ORDER BY fecha DESC
        """
        rows = execute_query(query, (point_id,))
        
        fechas = [row[0] for row in rows] if rows else []
        
        return jsonify(fechas)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo fechas de activaciones: {str(e)}")
        return jsonify({"error": str(e)}), 500



@visits_bp.route("/api/point-activation-photos/<string:point_id>/<string:fecha>")
@login_required
def get_point_activation_photos(point_id, fecha):
    """Obtiene TODAS las fotos de activación y desactivación para un punto en una fecha"""
    try:
        query = """
            SELECT 
                ft.id_foto,
                ft.file_path,
                ft.id_tipo_foto,
                ft.Estado,
                c.cliente,
                pin.punto_de_interes,
                m.nombre as mercaderista,
                vm.fecha_visita,
                ft.fecha_registro,
                vm.id_visita,
                c.id_cliente,
                m.id_mercaderista
            FROM FOTOS_TOTALES ft
            JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
            JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
            JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
            JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
            WHERE vm.identificador_punto_interes = ?
            AND ft.id_tipo_foto IN (5, 6)
            AND CONVERT(VARCHAR(10), ft.fecha_registro, 23) = ?
            ORDER BY m.nombre, c.cliente, ft.fecha_registro ASC
        """
        
        rows = execute_query(query, (point_id, fecha))
        
        # Agrupar fotos por mercaderista-cliente
        activaciones_agrupadas = {}
        
        for row in rows:
            mercaderista_id = row[11]
            cliente_id = row[10]
            key = f"{mercaderista_id}_{cliente_id}"
            
            if key not in activaciones_agrupadas:
                activaciones_agrupadas[key] = {
                    "mercaderista": row[6],
                    "mercaderista_id": mercaderista_id,
                    "cliente": row[4],
                    "cliente_id": cliente_id,
                    "punto_de_interes": row[5],
                    "activacion": None,
                    "desactivacion": None
                }
            
            foto_data = {
                "id_foto": row[0],
                "file_path": row[1],
                "id_tipo_foto": row[2],
                "estado": row[3],
                "fecha_registro": row[8].isoformat() if row[8] else None,
                "id_visita": row[9]
            }
            
            # Asignar a activación o desactivación
            if row[2] == 5:  # Activación
                # Si ya hay una activación, tomar la más reciente
                if activaciones_agrupadas[key]["activacion"] is None:
                    activaciones_agrupadas[key]["activacion"] = foto_data
                else:
                    # Comparar fechas y quedarse con la más reciente
                    fecha_actual = row[8]
                    fecha_existente = activaciones_agrupadas[key]["activacion"]["fecha_registro"]
                    if fecha_actual and (not fecha_existente or fecha_actual > fecha_existente):
                        activaciones_agrupadas[key]["activacion"] = foto_data
            
            elif row[2] == 6:  # Desactivación
                # Si ya hay una desactivación, tomar la más reciente
                if activaciones_agrupadas[key]["desactivacion"] is None:
                    activaciones_agrupadas[key]["desactivacion"] = foto_data
                else:
                    fecha_actual = row[8]
                    fecha_existente = activaciones_agrupadas[key]["desactivacion"]["fecha_registro"]
                    if fecha_actual and (not fecha_existente or fecha_actual > fecha_existente):
                        activaciones_agrupadas[key]["desactivacion"] = foto_data
        
        # Convertir a lista
        resultado = list(activaciones_agrupadas.values())
        
        return jsonify(resultado)
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo fotos de activaciones: {str(e)}")
        import traceback
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500



@visits_bp.route("/api/point-activation-count/<string:point_id>")
@login_required
def get_point_activation_count(point_id):
    """Cuenta las activaciones únicas (mercaderista-cliente) del día actual"""
    try:
        today = datetime.now().strftime('%Y-%m-%d')
        
        query = """
            SELECT 
                COUNT(DISTINCT CASE WHEN ft.id_tipo_foto = 5 
                    THEN CAST(vm.id_mercaderista AS VARCHAR) + '_' + CAST(vm.id_cliente AS VARCHAR) 
                    END) as activaciones_unicas,
                COUNT(DISTINCT CASE WHEN ft.id_tipo_foto = 6 
                    THEN CAST(vm.id_mercaderista AS VARCHAR) + '_' + CAST(vm.id_cliente AS VARCHAR) 
                    END) as desactivaciones_unicas
            FROM FOTOS_TOTALES ft
            JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
            WHERE vm.identificador_punto_interes = ?
            AND ft.id_tipo_foto IN (5, 6)
            AND CONVERT(VARCHAR(10), ft.fecha_registro, 23) = ?
        """
        
        result = execute_query(query, (point_id, today), fetch_one=True)
        
        return jsonify({
            "activaciones": result[0] if result else 0,
            "desactivaciones": result[1] if result else 0,
            "fecha": today
        })
    except Exception as e:
        current_app.logger.error(f"Error contando activaciones: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
# ========================================
# ENDPOINTS PARA MATERIAL POP (TIPOS 8 Y 10)
# ========================================

@visits_bp.route("/api/visit-pop-photos/<int:visit_id>")
@login_required
def get_visit_pop_photos(visit_id):
    try:
        query = """
        SELECT id_foto, file_path, id_tipo_foto
        FROM FOTOS_TOTALES
        WHERE id_visita = ? AND id_tipo_foto IN (8, 9)
        ORDER BY id_tipo_foto ASC, id_foto ASC
        """
        rows = execute_query(query, (visit_id,))
        fotos = []
        for row in rows:
            fotos.append({
                "id_foto": row[0],
                "file_path": row[1],
                "type": "pop_antes" if row[2] == 8 else "pop_despues",
                "id_tipo_foto": row[2]  # AGREGAR ESTO para debug
            })
        current_app.logger.info(f"Fotos POP encontradas para visita {visit_id}: {len(fotos)} - Tipos: {[f['id_tipo_foto'] for f in fotos]}")
        return jsonify(fotos)
    except Exception as e:
        current_app.logger.error(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@visits_bp.route("/api/save-pop-decisions", methods=["POST"])
@login_required
def save_pop_decisions():
    """
    Guarda decisiones de aprobación/rechazo para fotos de Material POP
    """
    try:
        data = request.get_json()
        visit_id = data.get("visit_id")
        decisions = data.get("decisions", [])
        
        from app.routes.auth import enviar_notificacion_telegram, emit_new_notification
        app = current_app._get_current_object()
        
        for decision in decisions:
            photo_id = decision.get("id_foto")
            status = decision.get("status")
            reason_id = decision.get("rejection_reason_id")
            razones = decision.get("razones", [])
            descripcion = decision.get("descripcion", "")
            
            # Actualizar estado en FOTOS_TOTALES
            update_query = """
            UPDATE FOTOS_TOTALES
            SET Estado = ?
            WHERE id_foto = ? AND id_visita = ?
            """
            estado_texto = 'Aprobada' if status == 'approved' else 'Rechazada'

            chk = execute_query(
                "SELECT Estado, ISNULL(veces_reemplazada,0) FROM FOTOS_TOTALES WHERE id_foto=?",
                (photo_id,), fetch_one=True
            )
            if not chk:
                continue

            veces_reemplazada = int(chk[1] or 0)

            if status == 'approved':
                if chk[0] == 'Aprobada':
                    current_app.logger.warning(f"Foto {photo_id} ya aprobada, saltando")
                    continue
                if chk[0] == 'Rechazada':
                    count_r = execute_query(
                        "SELECT COUNT(*) FROM FOTOS_RECHAZADAS WHERE id_foto_original=?",
                        (photo_id,), fetch_one=True
                    )
                    rechazos = int(count_r[0] or 0) if count_r else 0
                    if rechazos >= veces_reemplazada:
                        current_app.logger.warning(f"Foto {photo_id} bloqueada para aprobar")
                        continue

            if status == 'rejected':
                if chk[0] == 'Rechazada':
                    count_r = execute_query(
                        "SELECT COUNT(*) FROM FOTOS_RECHAZADAS WHERE id_foto_original=?",
                        (photo_id,), fetch_one=True
                    )
                    rechazos = int(count_r[0] or 0) if count_r else 0
                    if rechazos >= veces_reemplazada:
                        current_app.logger.warning(f"Foto {photo_id} bloqueada para rechazar")
                        continue
            update_query = """
            UPDATE FOTOS_TOTALES
            SET Estado = ?
            WHERE id_foto = ? AND id_visita = ?
            """
            execute_query(update_query, (estado_texto, photo_id, visit_id), commit=True)
            
            # Si es rechazada, procesar notificaciones
            if status == 'rejected':
                # Obtener info completa de la foto
                foto_info_query = """
                SELECT vm.id_cliente, c.cliente, pin.punto_de_interes, 
                       ft.fecha_registro, ft.id_tipo_foto
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
                id_tipo_foto = foto_info[4] if foto_info and len(foto_info) > 4 else 8
                
                # Texto de razones
                razones_texto = "; ".join(razones) if razones else ""
                descripcion_final = descripcion if descripcion else razones_texto
                
                # Preparar info para chat
                foto_info_chat = {
                    'id_tipo_foto': id_tipo_foto,
                    'cliente': nombre_cliente,
                    'punto_venta': punto_venta,
                    'fecha': fecha_registro.strftime('%Y-%m-%d') if fecha_registro else 'N/A'
                }
                
                # Enviar mensaje al chat
                razon_final = razones_texto if razones_texto else descripcion
                enviar_mensaje_sistema_rechazo(
                    visit_id=visit_id,
                    foto_id=photo_id,
                    foto_info=foto_info_chat,
                    razon_texto=razon_final,
                    rechazado_por=current_user.username
                )
                
                # Insertar en FOTOS_RECHAZADAS
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
                        reason_id if reason_id else None,
                        descripcion_final,
                        current_user.username
                    ))
                    rechazo_result = cursor.fetchone()
                    rechazo_id = rechazo_result[0] if rechazo_result else None
                    
                    if rechazo_id:
                        # Crear notificación
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
                             punto_venta, current_user.username, descripcion_final, photo_id))
                        notif_result = cursor.fetchone()
                        notificacion_id = notif_result[0] if notif_result else rechazo_id
                        
                        conn.commit()
                        
                        # Emitir notificación WebSocket
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
                            'descripcion': descripcion_final,
                            'tipo_foto': 'Material POP'
                        }
                        emit_new_notification(notification_data)
                        
                        # Enviar notificación Telegram (async)
                        telegram_data = {
                            'rechazado_por': current_user.username,
                            'id_visita': visit_id,
                            'id_foto': photo_id,
                            'cliente': nombre_cliente,
                            'punto_venta': punto_venta,
                            'fecha_rechazo': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                            'comentario': descripcion_final,
                            'tipo_foto': 'Material POP'
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
                    current_app.logger.error(f"Error en rechazo POP: {str(e)}")
                    raise e
                finally:
                    cursor.close()
                    conn.close()
        
        # Verificación de completitud (incluye tipos 1,2,3,4,8,10)
        verificacion_query = """
            SELECT COUNT(*) as total_fotos,
                   SUM(CASE WHEN Estado = 'Aprobada' THEN 1 ELSE 0 END) as fotos_aprobadas
            FROM FOTOS_TOTALES
            WHERE id_visita = ?
            AND id_tipo_foto IN (1, 2, 3, 4, 8, 9)
        """
        resultado = execute_query(verificacion_query, (visit_id,), fetch_one=True)
        total_fotos = resultado[0] if resultado else 0
        fotos_aprobadas = resultado[1] if resultado else 0

        if total_fotos > 0 and total_fotos == fotos_aprobadas:
            update_visit_status_query = """
            UPDATE VISITAS_MERCADERISTA
            SET estado = 'Revisado'
            WHERE id_visita = ?
            """
            execute_query(update_visit_status_query, (visit_id,), commit=True)
            mensaje_estado = "✅ Visita completada - todas las fotos han sido revisadas"
        else:
            mensaje_estado = f"📊 Progreso: {fotos_aprobadas} de {total_fotos} fotos revisadas"
        
        return jsonify({
            "success": True,
            "message": f"Procesadas {len(decisions)} decisiones de Material POP. {mensaje_estado}"
        })
        
    except Exception as e:
        current_app.logger.error(f"Error guardando decisiones de Material POP: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500
    
# ╔══════════════════════════════════════════════════════════════════════╗
# ║  CENTRO DE MANDO v4.2 FINAL                                        ║
# ║                                                                     ║
# ║  INSTRUCCIONES:                                                     ║
# ║  1. En visits.py BORRAR los endpoints anteriores del Centro de      ║
# ║     Mando (busca "CENTRO DE MANDO" y borra desde ahí hasta el      ║
# ║     final del archivo)                                              ║
# ║  2. Pegar TODO este código al final de visits.py                    ║
# ║                                                                     ║
# ║  ENDPOINTS:                                                         ║
# ║  - GET  /api/unified-pending-visits                                 ║
# ║  - POST /api/mark-chat-read/<visit_id>       ← NUEVO               ║
# ║  - POST /api/mark-visit-reviewed/<visit_id>                        ║
# ║  - POST /api/unmark-visit-reviewed/<visit_id>                      ║
# ║                                                                     ║
# ║  LÓGICA DE MENSAJES NO LEÍDOS:                                     ║
# ║  - El campo CHAT_MENSAJES.visto es GLOBAL (no per-user)            ║
# ║  - Si CUALQUIER analista/admin abre el chat → visto=1 para TODOS   ║
# ║  - Solo cuenta mensajes tipo 'usuario' (del mercaderista)           ║
# ║  - Los tipo 'sistema' (rechazos) no cuentan como "no leídos"       ║
# ╚══════════════════════════════════════════════════════════════════════╝


# ════════════════════════════════════════════════════════════════
# CENTRO DE MANDO - GET /api/unified-pending-visits
# ════════════════════════════════════════════════════════════════

@visits_bp.route("/api/unified-pending-visits")
@login_required
def get_unified_pending_visits():
    try:
        is_admin = current_user.rol in ('admin', 'superadmin')
        is_analyst = current_user.rol == 'analyst'
        
        incluir_revisadas = request.args.get('incluir_revisadas', '0') == '1'
        
        base_query = """
            SELECT
                vm.id_visita,
                c.cliente,
                c.id_cliente,
                pin.punto_de_interes,
                pin.identificador AS id_punto,
                ISNULL(pin.departamento, '') AS departamento,
                ISNULL(pin.ciudad, '') AS ciudad,
                m.nombre AS mercaderista,
                m.id_mercaderista,
                vm.fecha_visita,
                ISNULL(pin.jerarquia_nivel_2, '') AS tipo_pdv,
                vm.estado,
                
                ISNULL((
                    SELECT TOP 1 rn2.ruta
                    FROM RUTA_PROGRAMACION rp2
                    JOIN RUTAS_NUEVAS rn2 ON rp2.id_ruta = rn2.id_ruta
                    WHERE rp2.id_punto_interes = pin.identificador
                      AND rp2.activa = 1
                    ORDER BY rn2.id_ruta
                ), 'Sin ruta') AS ruta,
                
                ISNULL((
                    SELECT TOP 1 rn2.id_ruta
                    FROM RUTA_PROGRAMACION rp2
                    JOIN RUTAS_NUEVAS rn2 ON rp2.id_ruta = rn2.id_ruta
                    WHERE rp2.id_punto_interes = pin.identificador
                      AND rp2.activa = 1
                    ORDER BY rn2.id_ruta
                ), 0) AS id_ruta,
                
                ISNULL((
                    SELECT TOP 1 a2.nombre_analista
                    FROM RUTA_PROGRAMACION rp2
                    JOIN RUTAS_NUEVAS rn2 ON rp2.id_ruta = rn2.id_ruta
                    LEFT JOIN analistas a2 ON rn2.id_analista = a2.id_analista
                    WHERE rp2.id_punto_interes = pin.identificador
                      AND rp2.activa = 1
                    ORDER BY rn2.id_ruta
                ), '') AS nombre_analista,
                
                ISNULL(fc.fotos_gestion, 0) AS fotos_gestion,       -- row[15]
                ISNULL(fc.fotos_precio, 0) AS fotos_precio,          -- row[16]
                ISNULL(fc.fotos_exhibicion, 0) AS fotos_exhibicion,  -- row[17]
                ISNULL(fc.fotos_pop, 0) AS fotos_pop,                -- row[18]
                ISNULL(fc.fotos_activacion, 0) AS fotos_activacion,  -- row[19]
                ISNULL(fc.total_fotos, 0) AS total_fotos,            -- row[20]
                ISNULL(fc.fotos_aprobadas, 0) AS fotos_aprobadas,    -- row[21]
                ISNULL(fc.fotos_rechazadas, 0) AS fotos_rechazadas,  -- row[22]
                
                ISNULL((
                    SELECT COUNT(*)
                    FROM CHAT_MENSAJES cm
                    WHERE cm.id_visita = vm.id_visita
                      AND cm.visto = 0
                      AND cm.tipo_mensaje = 'usuario'
                ), 0) AS mensajes_no_leidos,                         -- row[23]
                
                ISNULL(vm.revisada, 0) AS revisada_manual            -- row[24]
                
            FROM VISITAS_MERCADERISTA vm
            JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
            JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
            JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
            LEFT JOIN (
                SELECT 
                    ft.id_visita,
                    SUM(CASE WHEN ft.id_tipo_foto IN (1, 2) THEN 1 ELSE 0 END) AS fotos_gestion,
                    SUM(CASE WHEN ft.id_tipo_foto = 3 THEN 1 ELSE 0 END) AS fotos_precio,
                    SUM(CASE WHEN ft.id_tipo_foto = 4 THEN 1 ELSE 0 END) AS fotos_exhibicion,
                    SUM(CASE WHEN ft.id_tipo_foto IN (8, 9) THEN 1 ELSE 0 END) AS fotos_pop,
                    SUM(CASE WHEN ft.id_tipo_foto IN (5, 6) THEN 1 ELSE 0 END) AS fotos_activacion,
                    COUNT(*) AS total_fotos,
                    SUM(CASE WHEN ft.Estado = 'Aprobada' THEN 1 ELSE 0 END) AS fotos_aprobadas,
                    SUM(CASE WHEN ft.Estado = 'Rechazada' THEN 1 ELSE 0 END) AS fotos_rechazadas
                FROM FOTOS_TOTALES ft
                GROUP BY ft.id_visita
            ) fc ON vm.id_visita = fc.id_visita
            WHERE vm.estado IN ('Pendiente', 'Revisado')
              AND CAST(vm.fecha_visita AS DATE) = CAST(GETDATE() AS DATE)
        """
        
        if is_admin:
            if incluir_revisadas:
                query = base_query + " AND ISNULL(vm.revisada, 0) = 1 ORDER BY vm.fecha_visita DESC"
            else:
                query = base_query + " ORDER BY vm.fecha_visita DESC"
            rows = execute_query(query)
            
        elif is_analyst:
            analista_id = current_user.id_analista
            if not analista_id:
                return jsonify({"success": True, "total": 0, "visits": [], "stats": {}})
            
            analyst_filter = """
    AND EXISTS (
        SELECT 1 
        FROM RUTA_PROGRAMACION rp3
        JOIN analistas_rutas ar ON rp3.id_ruta = ar.id_ruta
        WHERE rp3.id_punto_interes = pin.identificador
          AND rp3.activa = 1
          AND ar.id_analista = ?
    )
    AND EXISTS (
        SELECT 1
        FROM ANALISTAS_CLIENTE ac
        WHERE ac.id_cliente = c.id_cliente
          AND ac.id_analista = ?
    )
"""
            if incluir_revisadas:
                query = base_query + analyst_filter + " AND ISNULL(vm.revisada, 0) = 1 ORDER BY vm.fecha_visita DESC"
            else:
                query = base_query + analyst_filter + " ORDER BY vm.fecha_visita DESC"
            
            rows = execute_query(query, (analista_id, analista_id))
        else:
            return jsonify({"success": True, "total": 0, "visits": [], "stats": {}})
        
        visits = []
        seen_ids = set()
        total_fotos_global = 0
        total_aprobadas_global = 0
        total_rechazadas_global = 0
        
        for row in rows:
            vid = row[0]
            if vid in seen_ids:
                continue
            seen_ids.add(vid)
            
            total_fotos = row[20] or 0
            fotos_aprobadas = row[21] or 0
            fotos_rechazadas = row[22] or 0
            sin_revisar = total_fotos - fotos_aprobadas
            progreso = round((fotos_aprobadas / total_fotos * 100), 1) if total_fotos > 0 else 0
            
            revisada_manual = row[24] if row[24] else 0
            esta_revisada = bool(revisada_manual) or (total_fotos > 0 and progreso == 100)
            
            total_fotos_global += total_fotos
            total_aprobadas_global += fotos_aprobadas
            total_rechazadas_global += fotos_rechazadas
            
            visits.append({
                "id_visita": vid,
                "cliente": row[1],
                "id_cliente": row[2],
                "punto_de_interes": row[3],
                "id_punto": row[4],
                "departamento": row[5],
                "ciudad": row[6],
                "mercaderista": row[7],
                "id_mercaderista": row[8],
                "fecha_visita": row[9].isoformat() if row[9] else None,
                "tipo_pdv": row[10],
                "estado_visita": row[11],
                "ruta": row[12],
                "id_ruta": row[13],
                "analista": row[14],
                "fotos_gestion": row[15],
                "fotos_precio": row[16],
                "fotos_exhibicion": row[17],
                "fotos_pop": row[18],
                "fotos_activacion": row[19],
                "total_fotos": total_fotos,
                "fotos_aprobadas": fotos_aprobadas,
                "fotos_rechazadas": fotos_rechazadas,
                "sin_revisar": sin_revisar,
                "progreso": progreso,
                "mensajes_no_leidos": row[23],
                "revisada": esta_revisada
            })
        
        progreso_general = round((total_aprobadas_global / total_fotos_global * 100), 1) if total_fotos_global > 0 else 0
        
        stats = {
            "total_visitas": len(visits),
            "total_fotos": total_fotos_global,
            "fotos_aprobadas": total_aprobadas_global,
            "fotos_rechazadas": total_rechazadas_global,
            "sin_revisar": total_fotos_global - total_aprobadas_global,
            "progreso_general": progreso_general
        }
        
        return jsonify({
            "success": True,
            "total": len(visits),
            "visits": visits,
            "stats": stats
        })
        
    except Exception as e:
        current_app.logger.error(f"Error en unified-pending-visits: {str(e)}")
        import traceback
        current_app.logger.error(traceback.format_exc())
        return jsonify({"success": False, "error": str(e), "visits": [], "stats": {}}), 500

# ════════════════════════════════════════════════════════════════
# NUEVO: POST /api/mark-chat-read/<visit_id>
# Marca TODOS los mensajes de mercaderistas como leídos (GLOBAL)
# ════════════════════════════════════════════════════════════════

@visits_bp.route("/api/mark-chat-read/<int:visit_id>", methods=["POST"])
@login_required
def mark_chat_read(visit_id):
    """
    Marca TODOS los mensajes tipo 'usuario' de una visita como visto=1.
    
    Se llama cuando un analista/admin abre el chat desde el Centro de Mando.
    Es GLOBAL: si un analista lo lee, queda leído para TODOS los analistas/admins.
    El campo visto en CHAT_MENSAJES es compartido, no es per-user.
    """
    try:
        update_query = """
            UPDATE CHAT_MENSAJES
            SET visto = 1, fecha_visto = GETDATE()
            WHERE id_visita = ?
              AND visto = 0
              AND tipo_mensaje = 'usuario'
        """
        execute_query(update_query, (visit_id,), commit=True)
        
        current_app.logger.info(f"✅ Chat visita #{visit_id} marcado como leído por {current_user.username}")
        
        return jsonify({"success": True})
        
    except Exception as e:
        current_app.logger.error(f"Error marcando chat leído: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


# ════════════════════════════════════════════════════════════════
# POST /api/mark-visit-reviewed/<visit_id>
# ════════════════════════════════════════════════════════════════

@visits_bp.route("/api/mark-visit-reviewed/<int:visit_id>", methods=["POST"])
@login_required
def mark_visit_reviewed(visit_id):
    try:
        if current_user.rol not in ('admin', 'superadmin', 'analyst'):
            return jsonify({"success": False, "error": "No autorizado"}), 403
        
        check = execute_query(
            "SELECT id_visita FROM VISITAS_MERCADERISTA WHERE id_visita = ?",
            (visit_id,), fetch_one=True
        )
        if not check:
            return jsonify({"success": False, "error": "Visita no encontrada"}), 404
        
        execute_query(
            """UPDATE VISITAS_MERCADERISTA 
               SET revisada = 1, 
                   revisada_por = ?,
                   fecha_revision = GETDATE()
               WHERE id_visita = ?""",
            (current_user.username, visit_id),
            commit=True
        )
        
        return jsonify({"success": True, "message": f"Visita #{visit_id} marcada como revisada"})
        
    except Exception as e:
        current_app.logger.error(f"Error marcando visita revisada: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


# ════════════════════════════════════════════════════════════════
# POST /api/unmark-visit-reviewed/<visit_id>
# ════════════════════════════════════════════════════════════════

@visits_bp.route("/api/unmark-visit-reviewed/<int:visit_id>", methods=["POST"])
@login_required
def unmark_visit_reviewed(visit_id):
    try:
        if current_user.rol not in ('admin', 'superadmin', 'analyst'):
            return jsonify({"success": False, "error": "No autorizado"}), 403
        
        execute_query(
            """UPDATE VISITAS_MERCADERISTA 
               SET revisada = 0,
                   revisada_por = NULL,
                   fecha_revision = NULL
               WHERE id_visita = ?""",
            (visit_id,),
            commit=True
        )
        
        return jsonify({"success": True, "message": f"Visita #{visit_id} desmarcada"})
        
    except Exception as e:
        current_app.logger.error(f"Error desmarcando visita: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


@visits_bp.route("/api/fotos-with-status/<int:visit_id>/<string:tipo>")
@login_required
def get_fotos_with_status(visit_id, tipo):
    try:
        tipo_map = {
            'gestion':   '(1, 2)',
            'precio':    '(3)',
            'exhibicion':'(4)',
            'pop':       '(8, 9)'
        }
        tipos_sql = tipo_map.get(tipo)
        if not tipos_sql:
            return jsonify({"error": "Tipo inválido"}), 400

        query = f"""
            SELECT 
                ft.id_foto,
                ft.file_path,
                ft.id_tipo_foto,
                ft.Estado,
                ISNULL(ft.veces_reemplazada, 0) AS veces_reemplazada
            FROM FOTOS_TOTALES ft
            WHERE ft.id_visita = ? AND ft.id_tipo_foto IN {tipos_sql}
            ORDER BY ft.id_tipo_foto, ft.id_foto
        """
        rows = execute_query(query, (visit_id,))

        fotos = []
        for row in (rows or []):
            estado = row[3] or 'Pendiente'
            veces = int(row[4] or 0)
            # foto_actualizada = True si fue reemplazada al menos una vez
            foto_actualizada = veces > 0
            # Badge: Pendiente con reemplazo = "Rechazada-Actualizada"
            if estado == 'Pendiente' and foto_actualizada:
                badge_estado = 'Rechazada-Actualizada'
            elif estado == 'Rechazada' and foto_actualizada:
                badge_estado = 'Rechazada-Actualizada'
            else:
                badge_estado = estado

            fotos.append({
                "id_foto":          row[0],
                "file_path":        row[1],
                "id_tipo_foto":     row[2],
                "estado":           badge_estado,
                "foto_actualizada": foto_actualizada,
                "veces_reemplazada": veces,
                "type": {
                    1: "antes", 2: "despues", 3: "precio",
                    4: "exhibicion", 8: "pop_antes", 9: "pop_despues"
                }.get(row[2], "otro")
            })

        return jsonify(fotos)
    except Exception as e:
        current_app.logger.error(f"Error get_fotos_with_status: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
 
@visits_bp.route("/api/unified-all-visits")
@login_required
def get_unified_all_visits():
    """Igual que unified-pending-visits pero sin filtro de fecha de hoy. Permite ver histórico."""
    try:
        is_admin = current_user.rol in ('admin', 'superadmin')
        is_analyst = current_user.rol == 'analyst'
        incluir_revisadas = request.args.get('incluir_revisadas', '0') == '1'
        fecha_desde = request.args.get('fecha_desde', '')
        fecha_hasta = request.args.get('fecha_hasta', '')

        fecha_filter = ""
        if fecha_desde:
            fecha_filter += f" AND vm.fecha_visita >= '{fecha_desde}'"
        if fecha_hasta:
            fecha_filter += f" AND vm.fecha_visita <= '{fecha_hasta} 23:59:59'"

        base_query = """
            SELECT
                vm.id_visita, c.cliente, c.id_cliente,
                pin.punto_de_interes, pin.identificador AS id_punto,
                ISNULL(pin.departamento,'') AS departamento,
                ISNULL(pin.ciudad,'') AS ciudad,
                m.nombre AS mercaderista, m.id_mercaderista,
                vm.fecha_visita,
                ISNULL(pin.jerarquia_nivel_2,'') AS tipo_pdv,
                vm.estado,
                ISNULL((SELECT TOP 1 rn2.ruta FROM RUTA_PROGRAMACION rp2
                    JOIN RUTAS_NUEVAS rn2 ON rp2.id_ruta=rn2.id_ruta
                    WHERE rp2.id_punto_interes=pin.identificador AND rp2.activa=1
                    ORDER BY rn2.id_ruta),'Sin ruta') AS ruta,
                ISNULL((SELECT TOP 1 rn2.id_ruta FROM RUTA_PROGRAMACION rp2
                    JOIN RUTAS_NUEVAS rn2 ON rp2.id_ruta=rn2.id_ruta
                    WHERE rp2.id_punto_interes=pin.identificador AND rp2.activa=1
                    ORDER BY rn2.id_ruta),0) AS id_ruta,
                ISNULL((SELECT TOP 1 a2.nombre_analista FROM RUTA_PROGRAMACION rp2
                    JOIN RUTAS_NUEVAS rn2 ON rp2.id_ruta=rn2.id_ruta
                    LEFT JOIN analistas a2 ON rn2.id_analista=a2.id_analista
                    WHERE rp2.id_punto_interes=pin.identificador AND rp2.activa=1
                    ORDER BY rn2.id_ruta),'') AS nombre_analista,
                ISNULL(fc.fotos_gestion,0) AS fotos_gestion,         -- row[15]
                ISNULL(fc.fotos_precio,0) AS fotos_precio,            -- row[16]
                ISNULL(fc.fotos_exhibicion,0) AS fotos_exhibicion,    -- row[17]
                ISNULL(fc.fotos_pop,0) AS fotos_pop,                  -- row[18]
                ISNULL(fc.fotos_activacion,0) AS fotos_activacion,    -- row[19]
                ISNULL(fc.total_fotos,0) AS total_fotos,              -- row[20]
                ISNULL(fc.fotos_aprobadas,0) AS fotos_aprobadas,      -- row[21]
                ISNULL(fc.fotos_rechazadas,0) AS fotos_rechazadas,    -- row[22]
                ISNULL((SELECT COUNT(*) FROM CHAT_MENSAJES cm
                    WHERE cm.id_visita=vm.id_visita AND cm.visto=0
                    AND cm.tipo_mensaje='usuario'),0) AS mensajes_no_leidos,  -- row[23]
                ISNULL(vm.revisada,0) AS revisada_manual              -- row[24]
            FROM VISITAS_MERCADERISTA vm
            JOIN CLIENTES c ON vm.id_cliente=c.id_cliente
            JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes=pin.identificador
            JOIN MERCADERISTAS m ON vm.id_mercaderista=m.id_mercaderista
            LEFT JOIN (
                SELECT ft.id_visita,
                    SUM(CASE WHEN ft.id_tipo_foto IN (1,2) THEN 1 ELSE 0 END) AS fotos_gestion,
                    SUM(CASE WHEN ft.id_tipo_foto=3 THEN 1 ELSE 0 END) AS fotos_precio,
                    SUM(CASE WHEN ft.id_tipo_foto=4 THEN 1 ELSE 0 END) AS fotos_exhibicion,
                    SUM(CASE WHEN ft.id_tipo_foto IN (8,9) THEN 1 ELSE 0 END) AS fotos_pop,
                    SUM(CASE WHEN ft.id_tipo_foto IN (5,6) THEN 1 ELSE 0 END) AS fotos_activacion,
                    COUNT(*) AS total_fotos,
                    SUM(CASE WHEN ft.Estado='Aprobada' THEN 1 ELSE 0 END) AS fotos_aprobadas,
                    SUM(CASE WHEN ft.Estado='Rechazada' THEN 1 ELSE 0 END) AS fotos_rechazadas
                FROM FOTOS_TOTALES ft GROUP BY ft.id_visita
            ) fc ON vm.id_visita=fc.id_visita
            WHERE vm.estado IN ('Pendiente', 'Revisado')
        """ + fecha_filter

        if is_admin:
            rev_filter = " AND ISNULL(vm.revisada,0)=1" if incluir_revisadas else ""
            query = base_query + rev_filter + " ORDER BY vm.fecha_visita DESC"
            rows = execute_query(query)
        elif is_analyst:
            analista_id = current_user.id_analista
            if not analista_id:
                return jsonify({"success": True, "total": 0, "visits": [], "stats": {}})
            analyst_filter = """
    AND EXISTS (SELECT 1 FROM RUTA_PROGRAMACION rp3
        JOIN analistas_rutas ar ON rp3.id_ruta=ar.id_ruta
        WHERE rp3.id_punto_interes=pin.identificador AND rp3.activa=1 AND ar.id_analista=?)
    AND EXISTS (SELECT 1 FROM ANALISTAS_CLIENTE ac
        WHERE ac.id_cliente=c.id_cliente AND ac.id_analista=?)
"""
            rev_filter = " AND ISNULL(vm.revisada,0)=1" if incluir_revisadas else ""
            query = base_query + analyst_filter + rev_filter + " ORDER BY vm.fecha_visita DESC"
            rows = execute_query(query, (analista_id, analista_id))
        else:
            return jsonify({"success": True, "total": 0, "visits": [], "stats": {}})

        visits = []
        seen_ids = set()
        total_fotos_global = total_aprobadas_global = total_rechazadas_global = 0

        for row in (rows or []):
            vid = row[0]
            if vid in seen_ids:
                continue
            seen_ids.add(vid)
            total_fotos = row[20] or 0
            fotos_aprobadas = row[21] or 0
            fotos_rechazadas = row[22] or 0
            sin_revisar = total_fotos - fotos_aprobadas - fotos_rechazadas
            progreso = round((fotos_aprobadas / total_fotos * 100), 1) if total_fotos > 0 else 0
            revisada_manual = row[24] if row[24] else 0
            esta_revisada = bool(revisada_manual) or (total_fotos > 0 and progreso == 100)
            total_fotos_global += total_fotos
            total_aprobadas_global += fotos_aprobadas
            total_rechazadas_global += fotos_rechazadas
            visits.append({
                "id_visita": vid, "cliente": row[1], "id_cliente": row[2],
                "punto_de_interes": row[3], "id_punto": row[4],
                "departamento": row[5], "ciudad": row[6],
                "mercaderista": row[7], "id_mercaderista": row[8],
                "fecha_visita": row[9].isoformat() if row[9] else None,
                "tipo_pdv": row[10], "estado_visita": row[11],
                "ruta": row[12], "id_ruta": row[13], "analista": row[14],
                "fotos_gestion": row[15], "fotos_precio": row[16],
                "fotos_exhibicion": row[17], "fotos_pop": row[18],
                "fotos_activacion": row[19],
                "total_fotos": total_fotos, "fotos_aprobadas": fotos_aprobadas,
                "fotos_rechazadas": fotos_rechazadas, "sin_revisar": sin_revisar,
                "progreso": progreso, "mensajes_no_leidos": row[23],
                "revisada": esta_revisada
            })

        progreso_general = round((total_aprobadas_global / total_fotos_global * 100), 1) if total_fotos_global > 0 else 0
        stats = {
            "total_visitas": len(visits), "total_fotos": total_fotos_global,
            "fotos_aprobadas": total_aprobadas_global,
            "fotos_rechazadas": total_rechazadas_global,
            "sin_revisar": total_fotos_global - total_aprobadas_global,
            "progreso_general": progreso_general
        }
        return jsonify({"success": True, "total": len(visits), "visits": visits, "stats": stats})
    except Exception as e:
        current_app.logger.error(f"Error unified-all-visits: {str(e)}")
        return jsonify({"success": False, "error": str(e), "visits": [], "stats": {}}), 500

@visits_bp.route("/api/visit-activation-photos/<int:visit_id>")
@login_required
def get_visit_activation_photos_by_visit(visit_id):
    """Obtiene fotos de activación (tipo 5) y desactivación (tipo 6) de una visita específica"""
    try:
        query = """
            SELECT 
                ft.id_foto,
                ft.file_path,
                ft.id_tipo_foto,
                ft.Estado,
                ft.fecha_registro,
                m.nombre AS mercaderista,
                c.cliente,
                pin.punto_de_interes
            FROM FOTOS_TOTALES ft
            JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
            JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
            JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
            JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
            WHERE ft.id_visita = ?
              AND ft.id_tipo_foto IN (5, 6)
            ORDER BY ft.id_tipo_foto ASC, ft.id_foto ASC
        """
        rows = execute_query(query, (visit_id,))
        
        fotos = []
        for row in rows:
            fotos.append({
                "id_foto": row[0],
                "file_path": row[1],
                "id_tipo_foto": row[2],
                "estado": row[3],
                "fecha_registro": row[4].isoformat() if row[4] else None,
                "mercaderista": row[5],
                "cliente": row[6],
                "punto_de_interes": row[7],
                "type": "activacion" if row[2] == 5 else "desactivacion"
            })
        
        return jsonify(fotos)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo fotos de activación por visita: {str(e)}")
        return jsonify({"error": str(e)}), 500  


# ════════════════════════════════════════════════════════════════
# CENTRO DE MANDO - ACTIVACIONES
# Pegar estos endpoints al final de visits.py
# ════════════════════════════════════════════════════════════════

# ════════════════════════════════════════════════════════════════
# CENTRO DE MANDO — ACTIVACIONES
# Pegar al final de visits.py (reemplaza cualquier versión anterior)
# ════════════════════════════════════════════════════════════════
# ════════════════════════════════════════════════════════════════
# CENTRO DE MANDO — ACTIVACIONES  v3.0 FINAL
# Reemplaza COMPLETAMENTE el endpoint anterior en visits.py
# ════════════════════════════════════════════════════════════════

@visits_bp.route("/api/unified-activaciones")
@login_required
def get_unified_activaciones():
    try:
        from datetime import date as _date
        import calendar as _calendar

        is_admin   = current_user.rol in ('admin', 'superadmin')
        is_analyst = current_user.rol == 'analyst'

        # Parámetros de filtro
        solo_hoy    = request.args.get('solo_hoy', '1') == '1'
        fecha_desde = request.args.get('fecha_desde', '')
        fecha_hasta = request.args.get('fecha_hasta', '')
        filtro_mes  = request.args.get('mes', '')      # "2026-03"
        filtro_anio = request.args.get('anio', '')     # "2026"

        hoy            = _date.today()
        primer_dia_mes = hoy.replace(day=1)
        ultimo_dia_mes = hoy.replace(day=_calendar.monthrange(hoy.year, hoy.month)[1])

        # ── Determinar rango de fechas del query ─────────────────────
        if solo_hoy and not fecha_desde and not fecha_hasta and not filtro_mes and not filtro_anio:
            rango_filter = " AND CAST(vm.fecha_visita AS DATE) = CAST(GETDATE() AS DATE)"
            rango_params = []
        elif filtro_mes:
            y, m = filtro_mes.split('-')
            d_ini = f"{y}-{m}-01"
            d_fin = f"{y}-{m}-{_calendar.monthrange(int(y), int(m))[1]}"
            rango_filter = " AND CAST(vm.fecha_visita AS DATE) BETWEEN ? AND ?"
            rango_params = [d_ini, d_fin]
        elif filtro_anio:
            rango_filter = " AND YEAR(vm.fecha_visita) = ?"
            rango_params = [int(filtro_anio)]
        elif fecha_desde or fecha_hasta:
            rango_filter = ""
            rango_params = []
            if fecha_desde:
                rango_filter += " AND vm.fecha_visita >= ?"
                rango_params.append(fecha_desde)
            if fecha_hasta:
                rango_filter += " AND vm.fecha_visita <= ?"
                rango_params.append(fecha_hasta + ' 23:59:59')
        else:
            rango_filter = " AND CAST(vm.fecha_visita AS DATE) = CAST(GETDATE() AS DATE)"
            rango_params = []

        analista_id = None
        if is_analyst:
            analista_id = current_user.id_analista
            if not analista_id:
                return jsonify({"success": True, "total": 0, "activaciones": [], "stats": {}, "meses_disponibles": []})

        # ── Filtro analista ──────────────────────────────────────────
        analyst_filter = ""
        analyst_params_extra = []
        if is_analyst and analista_id:
            analyst_filter = """
    AND EXISTS (
        SELECT 1 FROM RUTA_PROGRAMACION rp3
        JOIN analistas_rutas ar ON rp3.id_ruta = ar.id_ruta
        WHERE rp3.id_punto_interes = pin.identificador
          AND rp3.activa = 1 AND ar.id_analista = ?
    )
    AND EXISTS (
        SELECT 1 FROM ANALISTAS_CLIENTE ac
        WHERE ac.id_cliente = c.id_cliente AND ac.id_analista = ?
    )
"""
            analyst_params_extra = [analista_id, analista_id]

        # ── Query principal ──────────────────────────────────────────
        base_query = """
            SELECT
                vm.id_visita,
                c.cliente,
                c.id_cliente,
                pin.punto_de_interes,
                pin.identificador          AS id_punto,
                ISNULL(pin.departamento,'') AS departamento,
                ISNULL(pin.ciudad,'')       AS ciudad,
                m.nombre                   AS mercaderista,
                m.id_mercaderista,
                vm.fecha_visita,
                ISNULL(pin.jerarquia_nivel_2,'') AS tipo_pdv,
                act.id_foto                AS id_foto_activacion,
                act.file_path              AS file_path_activacion,
                act.fecha_registro         AS fecha_activacion,
                act.Estado                 AS estado_activacion,
                des.id_foto                AS id_foto_desactivacion,
                des.file_path              AS file_path_desactivacion,
                des.fecha_registro         AS fecha_desactivacion,
                des.Estado                 AS estado_desactivacion,
                ISNULL((
                    SELECT TOP 1 rn2.ruta
                    FROM RUTA_PROGRAMACION rp2
                    JOIN RUTAS_NUEVAS rn2 ON rp2.id_ruta = rn2.id_ruta
                    WHERE rp2.id_punto_interes = pin.identificador AND rp2.activa = 1
                    ORDER BY rn2.id_ruta
                ), 'Sin ruta') AS ruta,
                ISNULL((
                    SELECT TOP 1 rn2.id_ruta
                    FROM RUTA_PROGRAMACION rp2
                    JOIN RUTAS_NUEVAS rn2 ON rp2.id_ruta = rn2.id_ruta
                    WHERE rp2.id_punto_interes = pin.identificador AND rp2.activa = 1
                    ORDER BY rn2.id_ruta
                ), 0) AS id_ruta,
                ISNULL((
                    SELECT TOP 1 a2.nombre_analista
                    FROM RUTA_PROGRAMACION rp2
                    JOIN RUTAS_NUEVAS rn2 ON rp2.id_ruta = rn2.id_ruta
                    LEFT JOIN analistas a2 ON rn2.id_analista = a2.id_analista
                    WHERE rp2.id_punto_interes = pin.identificador AND rp2.activa = 1
                    ORDER BY rn2.id_ruta
                ), '') AS nombre_analista,
                ISNULL((
                    SELECT COUNT(*)
                    FROM CHAT_MENSAJES cm
                    WHERE cm.id_visita = vm.id_visita
                      AND cm.visto = 0 AND cm.tipo_mensaje = 'usuario'
                ), 0) AS mensajes_no_leidos
            FROM VISITAS_MERCADERISTA vm
            JOIN CLIENTES c   ON vm.id_cliente  = c.id_cliente
            JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
            JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
            LEFT JOIN (
                SELECT ft.*, ROW_NUMBER() OVER (PARTITION BY ft.id_visita ORDER BY ft.fecha_registro DESC) AS rn
                FROM FOTOS_TOTALES ft WHERE ft.id_tipo_foto = 5
            ) act ON act.id_visita = vm.id_visita AND act.rn = 1
            LEFT JOIN (
                SELECT ft.*, ROW_NUMBER() OVER (PARTITION BY ft.id_visita ORDER BY ft.fecha_registro DESC) AS rn
                FROM FOTOS_TOTALES ft WHERE ft.id_tipo_foto = 6
            ) des ON des.id_visita = vm.id_visita AND des.rn = 1
            WHERE (act.id_foto IS NOT NULL OR des.id_foto IS NOT NULL)
        """ + rango_filter + analyst_filter + " ORDER BY vm.fecha_visita DESC"

        all_params = rango_params + analyst_params_extra
        rows = execute_query(base_query, all_params if all_params else ())

        # ── Construir lista principal ────────────────────────────────
        activaciones = []
        seen_ids = set()
        total_con_activacion = total_con_desactivacion = 0
        total_completas = total_activos_ahora = 0
        rutas_set = set()
        rutas_ejecutadas_set = set()

        for row in (rows or []):
            vid = row[0]
            if vid in seen_ids:
                continue
            seen_ids.add(vid)

            tiene_act = row[11] is not None
            tiene_des = row[15] is not None
            id_ruta   = row[20]   # ruta nombre = row[19], id_ruta = row[20]

            if tiene_act:  total_con_activacion    += 1
            if tiene_des:  total_con_desactivacion += 1
            if tiene_act and tiene_des:      total_completas    += 1
            if tiene_act and not tiene_des:  total_activos_ahora += 1

            if id_ruta and id_ruta != 0:
                rutas_set.add(id_ruta)
                if tiene_act:
                    rutas_ejecutadas_set.add(id_ruta)

            duracion_minutos = None
            if tiene_act and tiene_des and row[13] and row[17]:
                delta = row[17] - row[13]
                duracion_minutos = int(delta.total_seconds() / 60)

                #holaa

            activaciones.append({
                "id_visita":               row[0],
                "cliente":                 row[1],
                "id_cliente":              row[2],
                "punto_de_interes":        row[3],
                "id_punto":                row[4],
                "departamento":            row[5],
                "ciudad":                  row[6],
                "mercaderista":            row[7],
                "id_mercaderista":         row[8],
                "fecha_visita":            row[9].isoformat()  if row[9]  else None,
                "tipo_pdv":                row[10],
                "id_foto_activacion":      row[11],
                "file_path_activacion":    row[12],
                "fecha_activacion":        row[13].isoformat() if row[13] else None,
                "estado_activacion":       row[14],
                "id_foto_desactivacion":   row[15],
                "file_path_desactivacion": row[16],
                "fecha_desactivacion":     row[17].isoformat() if row[17] else None,
                "estado_desactivacion":    row[18],
                "ruta":                    row[19],
                "id_ruta":                 row[20],
                "analista":                row[21],
                "mensajes_no_leidos":      row[22],
                "duracion_minutos":        duracion_minutos,
                "estado_presencia":        "completa" if tiene_act and tiene_des
                                        else ("activo" if tiene_act else "solo_salida"),
            })

        total = len(activaciones)
        progreso_activaciones = round((total_con_activacion / total * 100), 1) if total > 0 else 0
        progreso_completas    = round((total_completas      / total * 100), 1) if total > 0 else 0

        # ── Desglose por punto y cliente (activaciones vs completas) ─
        def _desglose(key_fn, id_fn):
            act_map = {}
            com_map = {}
            for v in activaciones:
                k    = key_fn(v)
                kid  = id_fn(v)
                tiene_act2 = v["id_foto_activacion"] is not None
                es_completa = v["estado_presencia"] == "completa"

                for mp, cond in [(act_map, tiene_act2), (com_map, es_completa)]:
                    if k not in mp:
                        mp[k] = {"nombre": k, "id": kid, "total": 0, "con": 0}
                    mp[k]["total"] += 1
                    if cond:
                        mp[k]["con"] += 1

            def _sort(mp):
                return sorted([
                    {"nombre": v["nombre"], "id": v["id"],
                     "total": v["total"], "con": v["con"],
                     "porcentaje": round(v["con"] / v["total"] * 100, 1) if v["total"] else 0}
                    for v in mp.values()
                ], key=lambda x: x["porcentaje"], reverse=True)

            return _sort(act_map), _sort(com_map)

        pp_act, pp_com = _desglose(lambda v: v["punto_de_interes"], lambda v: v["id_punto"])
        pc_act, pc_com = _desglose(lambda v: v["cliente"],          lambda v: v["id_cliente"])

        # ── Meses disponibles (para el selector) ────────────────────
        meses_query = """
            SELECT DISTINCT
                YEAR(vm2.fecha_visita)  AS anio,
                MONTH(vm2.fecha_visita) AS mes
            FROM VISITAS_MERCADERISTA vm2
            JOIN CLIENTES c2   ON vm2.id_cliente = c2.id_cliente
            JOIN PUNTOS_INTERES1 pin2 ON vm2.identificador_punto_interes = pin2.identificador
            WHERE EXISTS (
                SELECT 1 FROM FOTOS_TOTALES ft2
                WHERE ft2.id_visita = vm2.id_visita
                  AND ft2.id_tipo_foto IN (5, 6)
            )
        """ + analyst_filter + " ORDER BY anio DESC, mes DESC"

        meses_rows = execute_query(meses_query, analyst_params_extra if analyst_params_extra else ())
        meses_disponibles = []
        nombres_meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                         'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
        for r in (meses_rows or []):
            anio = r[0]; mes = r[1]
            meses_disponibles.append({
                "value": f"{anio}-{mes:02d}",
                "label": f"{nombres_meses[mes-1]} {anio}",
                "anio":  anio,
                "mes":   mes,
            })

        stats = {
            "total_registros":        total,
            "con_activacion":         total_con_activacion,
            "con_desactivacion":      total_con_desactivacion,
            "completas":              total_completas,
            "activos_ahora":          total_activos_ahora,
            "total_rutas":            len(rutas_set),
            "rutas_ejecutadas":       len(rutas_ejecutadas_set),
            "progreso_activaciones":  progreso_activaciones,
            "progreso_completas":     progreso_completas,
            # Desglose
            "pp_activaciones":  pp_act,
            "pp_completas":     pp_com,
            "pc_activaciones":  pc_act,
            "pc_completas":     pc_com,
        }

        return jsonify({
            "success":            True,
            "total":              total,
            "activaciones":       activaciones,
            "stats":              stats,
            "meses_disponibles":  meses_disponibles,
        })

    except Exception as e:
        current_app.logger.error(f"Error unified-activaciones: {str(e)}")
        import traceback
        current_app.logger.error(traceback.format_exc())
        return jsonify({"success": False, "error": str(e), "activaciones": [], "stats": {}}), 500