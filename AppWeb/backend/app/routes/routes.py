# app/routes/routes.py
from flask import Blueprint, render_template, request, jsonify, current_app
from flask_login import login_required, current_user
from app.utils.database import execute_query
from app.utils.helpers import obtener_dia_actual_espanol

routes_bp = Blueprint('routes', __name__)

@routes_bp.route('/')
@login_required
def routes_management():
    current_app.logger.info(f"Acceso a gestión de rutas por usuario: {current_user.username}")
    return render_template('routes.html')

@routes_bp.route('/api/routes')
@login_required
def get_routes():
    """Obtener todas las rutas desde RUTAS_NUEVAS"""
    try:
        current_app.logger.info(f"Solicitud de rutas por usuario: {current_user.username}")
        query = """
            SELECT 
                rn.ruta as nombre_ruta,
                COUNT(rp.id_punto_interes) as total_puntos
            FROM RUTAS_NUEVAS rn
            LEFT JOIN RUTA_PROGRAMACION rp ON rn.id_ruta = rp.id_ruta
            WHERE rn.ruta IS NOT NULL
            GROUP BY rn.ruta
            ORDER BY rn.ruta
        """
        routes = execute_query(query)
        
        current_app.logger.info(f"Se encontraron {len(routes)} rutas")
        
        return jsonify([{
            "nombre_ruta": row[0],
            "total_puntos": row[1]
        } for row in routes])
        
    except Exception as e:
        current_app.logger.error(f"Error en get_routes: {str(e)}")
        return jsonify({"error": str(e)}), 500

    
# app/routes/routes.py
@routes_bp.route('/api/routes/update-active-status', methods=['POST'])
@login_required
def update_active_status():
    try:
        data = request.get_json()
        programacion_id = data.get('programacion_id')
        activa = data.get('activa')
        
        query = "UPDATE RUTA_PROGRAMACION SET activa = ? WHERE id_programacion = ?"
        execute_query(query, (activa, programacion_id), commit=True)
        
        return jsonify({
            "success": True,
            "message": "Estado de activación actualizado correctamente"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@routes_bp.route('/api/routes/<route_name>/add-point', methods=['POST'])
@login_required
def add_point_to_route(route_name):
    """Agregar un punto a una ruta con día y prioridad"""
    try:
        data = request.get_json()
        point_id = data.get('point_id')
        client_id = data.get('client_id')
        day = data.get('day')
        priority = data.get('priority')
        
        # Validaciones
        if not point_id or not isinstance(point_id, str) or len(point_id.strip()) == 0:
            return jsonify({"success": False, "message": "ID del punto (string) es requerido"}), 400
        if not client_id:
            return jsonify({"success": False, "message": "ID del cliente es requerido"}), 400
        if not day:
            return jsonify({"success": False, "message": "Día es requerido"}), 400
        if not priority:
            return jsonify({"success": False, "message": "Prioridad es requerida"}), 400
        
        try:
            client_id = int(client_id)
        except (ValueError, TypeError):
            return jsonify({"success": False, "message": "ID del cliente debe ser número válido"}), 400
        
        # Obtener id_ruta
        route_id_query = "SELECT id_ruta FROM RUTAS_NUEVAS WHERE ruta = ?"
        route_id_result = execute_query(route_id_query, (route_name,), fetch_one=True)
        
        if not route_id_result:
            return jsonify({"success": False, "message": f"Ruta '{route_name}' no encontrada"}), 404
        
        route_id = route_id_result
        
        # Obtener nombre del punto
        point_name_query = "SELECT punto_de_interes FROM PUNTOS_INTERES1 WHERE identificador = ?"
        point_name_result = execute_query(point_name_query, (point_id,), fetch_one=True)
        point_name = point_name_result if point_name_result else ''
        
        # Verificar duplicado
        check_query = """
            SELECT COUNT(*) FROM RUTA_PROGRAMACION 
            WHERE id_ruta = ? AND id_punto_interes = ? AND id_cliente = ?
        """
        exists = execute_query(check_query, (route_id, point_id, client_id), fetch_one=True)
        
        if exists and exists > 0:
            return jsonify({"success": False, "message": "Este punto ya existe en la ruta"}), 400
        
        # INSERT
        insert_query = """
            INSERT INTO RUTA_PROGRAMACION 
            (id_ruta, id_punto_interes, id_cliente, dia, prioridad, activa, punto_interes)
            VALUES (?, ?, ?, ?, ?, 1, ?)
        """
        params = (route_id, point_id, client_id, day, priority, point_name)
        execute_query(insert_query, params, commit=True)
        
        return jsonify({
            "success": True,
            "message": "Punto agregado exitosamente a la ruta"
        })
        
    except Exception as e:
        current_app.logger.error(f"Error en add_point_to_route: {str(e)}", exc_info=True)
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500

    
@routes_bp.route('/api/routes/<route_name>/update-points', methods=['POST'])
@login_required
def update_points_in_route(route_name):
    """Actualizar día, prioridad y estado activo de múltiples puntos"""
    try:
        data = request.get_json()
        
        if not isinstance(data, list):
            return jsonify({
                "success": False,
                "message": "Se espera una lista de actualizaciones"
            }), 400
        
        for update in data:
            if not update.get('programacion_id') or update.get('day') is None or \
               update.get('priority') is None or update.get('active') is None:
                return jsonify({
                    "success": False,
                    "message": "ID de programación, día, prioridad y estado activo son requeridos"
                }), 400
        
        for update in data:
            query = """
                UPDATE RUTA_PROGRAMACION
                SET dia = ?, prioridad = ?, activa = ?
                WHERE id_programacion = ?
            """
            params = (update['day'], update['priority'], update['active'], update['programacion_id'])
            execute_query(query, params, commit=True)
        
        return jsonify({
            "success": True,
            "message": f"{len(data)} puntos actualizados exitosamente"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    

@routes_bp.route('/api/route-status')
@login_required
def get_route_status():
    try:
        # Obtener el día actual en español
        dia_actual = obtener_dia_actual_espanol()
        
        # Consulta para rutas sin activar (programadas para hoy pero no activadas)
        query_rutas_sin_activar = """
        SELECT r.id_ruta, r.ruta
        FROM dbo.RUTAS_NUEVAS r
        INNER JOIN dbo.RUTA_PROGRAMACION rp ON r.id_ruta = rp.id_ruta
        WHERE rp.dia = ? 
          AND r.id_ruta NOT IN (SELECT id_ruta FROM dbo.RUTAS_ACTIVADAS)
        GROUP BY r.id_ruta, r.ruta
        """
        
        # Consulta para rutas activadas (en RUTAS_ACTIVADAS con estado 'En progreso' y sin fotos revisadas)
        query_rutas_activadas = """
        SELECT ra.id_ruta, r.ruta
        FROM dbo.RUTAS_ACTIVADAS ra
        INNER JOIN dbo.RUTAS_NUEVAS r ON ra.id_ruta = r.id_ruta
        WHERE ra.estado = 'En progreso'
          AND ra.id_ruta NOT IN (
            SELECT DISTINCT v.id_ruta 
            FROM dbo.VISITAS_MERCADERISTA v
            WHERE v.revisada = 1
          )
        GROUP BY ra.id_ruta, r.ruta
        """
        
        # Consulta para fotos pendientes (visitas con fotos no revisadas)
        query_fotos_pendientes = """
        SELECT DISTINCT r.id_ruta, r.ruta, pin.punto_de_interes, c.cliente
        FROM dbo.VISITAS_MERCADERISTA v
        INNER JOIN dbo.RUTAS_NUEVAS r ON v.id_ruta = r.id_ruta
        INNER JOIN dbo.PUNTOS_INTERES1 pin ON v.id_punto_interes = pin.identificador
        INNER JOIN dbo.CLIENTES c ON v.id_cliente = c.id_cliente
        WHERE v.revisada = 0
        ORDER BY r.ruta, pin.punto_de_interes, c.cliente
        """
        
        # Ejecutar las consultas
        rutas_sin_activar = execute_query(query_rutas_sin_activar, (dia_actual,))
        rutas_activadas = execute_query(query_rutas_activadas)
        fotos_pendientes = execute_query(query_fotos_pendientes)
        
        # Formatear los resultados
        result = {
            "rutas_sin_activar": [{"id": row[0], "ruta": row[1]} for row in rutas_sin_activar],
            "rutas_activadas": [{"id": row[0], "ruta": row[1]} for row in rutas_activadas],
            "fotos_pendientes": []
        }
        
        # Agrupar fotos pendientes por ruta y punto de interés
        rutas_dict = {}
        for row in fotos_pendientes:
            id_ruta, ruta, punto_interes, cliente = row
            
            if id_ruta not in rutas_dict:
                rutas_dict[id_ruta] = {
                    "id": id_ruta,
                    "ruta": ruta,
                    "puntos_interes": {}
                }
                
            if punto_interes not in rutas_dict[id_ruta]["puntos_interes"]:
                rutas_dict[id_ruta]["puntos_interes"][punto_interes] = {
                    "punto": punto_interes,
                    "clientes": []
                }
                
            rutas_dict[id_ruta]["puntos_interes"][punto_interes]["clientes"].append(cliente)
        
        # Convertir a lista para el resultado
        for id_ruta, ruta_data in rutas_dict.items():
            puntos_list = []
            for punto, punto_data in ruta_data["puntos_interes"].items():
                puntos_list.append({
                    "punto": punto,
                    "clientes": punto_data["clientes"]
                })
                
            result["fotos_pendientes"].append({
                "id": ruta_data["id"],
                "ruta": ruta_data["ruta"],
                "puntos_interes": puntos_list
            })
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@routes_bp.route('/api/points-of-interest')
@login_required
def get_points_of_interest():
    """Obtener lista de puntos de interés"""
    try:
        query = """
            SELECT identificador, punto_de_interes, departamento, ciudad
            FROM PUNTOS_INTERES1
            WHERE punto_de_interes IS NOT NULL
            ORDER BY punto_de_interes
        """
        points = execute_query(query)
        
        return jsonify([{
            "identificador": row[0],
            "punto_de_interes": row[1],
            "departamento": row[2] or '',
            "ciudad": row[3] or ''
        } for row in points])
        
    except Exception as e:
        current_app.logger.error(f"Error en get_points_of_interest: {str(e)}")
        return jsonify({"error": str(e)}), 500


# === NUEVO ENDPOINT: Obtener clientes disponibles ===
@routes_bp.route('/api/clients')
@login_required
def get_clients():
    """Obtener lista de clientes"""
    try:
        query = """
            SELECT id_cliente, cliente
            FROM CLIENTES
            WHERE cliente IS NOT NULL
            ORDER BY cliente
        """
        clients = execute_query(query)
        
        return jsonify([{
            "id_cliente": row[0],
            "cliente": row[1]
        } for row in clients])
        
    except Exception as e:
        current_app.logger.error(f"Error en get_clients: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@routes_bp.route('/api/route-options')
@login_required
def get_route_options():
    """Obtener opciones para crear rutas (servicios disponibles)"""
    try:
        query = """
            SELECT DISTINCT servicio
            FROM RUTAS_NUEVAS
            WHERE servicio IS NOT NULL
            ORDER BY servicio
        """
        services = execute_query(query)
        
        return jsonify({
            "servicios": [row[0] for row in services]
        })
        
    except Exception as e:
        current_app.logger.error(f"Error en get_route_options: {str(e)}")
        return jsonify({"error": str(e)}), 500


@routes_bp.route('/api/routes/<route_name>/details', methods=['GET'])
@login_required
def get_route_details(route_name):
    """Obtener detalles de puntos de una ruta"""
    try:
        query = """
            SELECT
                rn.ruta,
                pin.identificador,
                pin.punto_de_interes,
                c.cliente,
                c.id_cliente,
                pin.departamento,
                pin.ciudad,
                rp.dia,
                rp.prioridad,
                rp.activa,
                rp.id_programacion
            FROM RUTAS_NUEVAS rn
            JOIN RUTA_PROGRAMACION rp ON rn.id_ruta = rp.id_ruta
            JOIN PUNTOS_INTERES1 pin ON rp.id_punto_interes = pin.identificador
            JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
            WHERE rn.ruta = ?
            ORDER BY rp.prioridad ASC, rp.dia ASC
        """
        points = execute_query(query, (route_name,))
        
        return jsonify([{
            "identificador": row[1],
            "punto_interes": row[2],
            "cliente": row[3],
            "id_cliente": int(row[4]),
            "departamento": row[5] or '',
            "ciudad": row[6] or '',
            "dia": row[7],
            "prioridad": row[8],
            "activa": bool(row[9]),
            "id_programacion": row[10]
        } for row in points])
        
    except Exception as e:
        current_app.logger.error(f"Error en get_route_details: {str(e)}")
        return jsonify({"error": str(e)}), 500


@routes_bp.route('/api/routes/<route_name>/remove-point', methods=['DELETE'])
@login_required
def remove_point_from_route(route_name):
    """Eliminar un punto de una ruta"""
    try:
        data = request.get_json()
        programacion_id = data.get('programacion_id')
        
        if not programacion_id:
            return jsonify({
                "success": False,
                "message": "ID de programación es requerido"
            }), 400
        
        delete_query = "DELETE FROM RUTA_PROGRAMACION WHERE id_programacion = ?"
        execute_query(delete_query, (programacion_id,), commit=True)
        
        return jsonify({
            "success": True,
            "message": "Punto eliminado exitosamente de la ruta"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
@routes_bp.route('/api/routes/<route_name>/update-point/<int:programacion_id>', methods=['PUT'])
@login_required
def update_point_in_route(route_name, programacion_id):
    """Actualizar punto de interés o cliente en una programación existente"""
    try:
        data = request.get_json()
        new_point_id = data.get('point_id')
        new_client_id = data.get('client_id')
        
        if not new_point_id and not new_client_id:
            return jsonify({"success": False, "message": "Debe proporcionar al menos un nuevo valor"}), 400
        
        updates = []
        params = []
        
        if new_point_id:
            updates.append("id_punto_interes = ?")
            params.append(new_point_id)
            updates.append("punto_interes = (SELECT punto_de_interes FROM PUNTOS_INTERES1 WHERE identificador = ?)")
            params.append(new_point_id)
        
        if new_client_id is not None:
            updates.append("id_cliente = ?")
            params.append(int(new_client_id))
        
        params.append(programacion_id)
        params.append(route_name)
        
        query = f"""
            UPDATE RUTA_PROGRAMACION
            SET {', '.join(updates)}
            WHERE id_programacion = ?
            AND id_ruta = (SELECT id_ruta FROM RUTAS_NUEVAS WHERE ruta = ?)
        """
        
        execute_query(query, tuple(params), commit=True)
        
        # Retornar datos actualizados
        refresh_query = """
            SELECT pin.identificador, pin.punto_de_interes, pin.departamento, pin.ciudad,
                   c.cliente, c.id_cliente
            FROM RUTA_PROGRAMACION rp
            JOIN PUNTOS_INTERES1 pin ON rp.id_punto_interes = pin.identificador
            JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
            WHERE rp.id_programacion = ?
        """
        updated = execute_query(refresh_query, (programacion_id,), fetch_one=True)
        
        return jsonify({
            "success": True,
            "message": "Punto actualizado exitosamente",
            "data": {
                "identificador": updated[0],
                "punto_interes": updated[1],
                "departamento": updated[2] or '',
                "ciudad": updated[3] or '',
                "cliente": updated[4],
                "id_cliente": int(updated[5])
            }
        })
        
    except Exception as e:
        current_app.logger.error(f"Error en update_point_in_route: {str(e)}", exc_info=True)
        return jsonify({"success": False, "message": str(e)}), 500
    
# ============================================================================
# === PROGRAMACIÓN FUTURA DE CAMBIOS ===
# ============================================================================

@routes_bp.route('/api/routes/<route_name>/schedule-change', methods=['POST'])
@login_required
def schedule_future_change(route_name):
    """Programar un cambio futuro para una ruta"""
    try:
        data = request.get_json()
        tipo_cambio = data.get('tipo_cambio')
        fecha_ejecucion = data.get('fecha_ejecucion')
        id_programacion = data.get('id_programacion')
        
        if not tipo_cambio or tipo_cambio not in ['INSERT', 'UPDATE', 'DELETE']:
            return jsonify({"success": False, "message": "Tipo de cambio inválido"}), 400
        
        if not fecha_ejecucion:
            return jsonify({"success": False, "message": "Fecha de ejecución es requerida"}), 400
        
        from datetime import datetime, date
        try:
            fecha_ejec = datetime.strptime(fecha_ejecucion, '%Y-%m-%d').date()
            if fecha_ejec < date.today():
                return jsonify({"success": False, "message": "La fecha debe ser hoy o futura"}), 400
        except ValueError:
            return jsonify({"success": False, "message": "Formato de fecha inválido (use YYYY-MM-DD)"}), 400
        
        route_id_query = "SELECT id_ruta FROM RUTAS_NUEVAS WHERE ruta = ?"
        route_id_result = execute_query(route_id_query, (route_name,), fetch_one=True)
        
        if not route_id_result:
            return jsonify({"success": False, "message": f"Ruta '{route_name}' no encontrada"}), 404
        
        route_id = route_id_result
        
        point_id = data.get('point_id')
        client_id = data.get('client_id')
        day = data.get('dia')
        priority = data.get('prioridad')
        activa = data.get('activa')
        observaciones = data.get('observaciones', '')
        
        if tipo_cambio == 'INSERT':
            if not point_id or not client_id:
                return jsonify({"success": False, "message": "Punto y cliente son requeridos para INSERT"}), 400
            
            point_name_query = "SELECT punto_de_interes FROM PUNTOS_INTERES1 WHERE identificador = ?"
            point_name = execute_query(point_name_query, (point_id,), fetch_one=True) or ''
            
            client_name_query = "SELECT cliente FROM CLIENTES WHERE id_cliente = ?"
            client_name = execute_query(client_name_query, (int(client_id),), fetch_one=True) or ''
            
            insert_query = """
                INSERT INTO RUTA_PROGRAMACION_CAMBIOS_FUTUROS
                (id_programacion, id_ruta, ruta_nombre, id_punto_interes, punto_interes_nombre,
                 id_cliente, cliente_nombre, dia, prioridad, activa, tipo_cambio,
                 fecha_ejecucion, creado_por, estado, observaciones)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDIENTE', ?)
            """
            params = (
                None, route_id, route_name, point_id, point_name,
                int(client_id), client_name, day, priority, 1 if activa else 0,
                'INSERT', fecha_ejecucion, current_user.username, observaciones
            )
            
        elif tipo_cambio == 'UPDATE':
            if not id_programacion:
                return jsonify({"success": False, "message": "id_programacion es requerido para UPDATE"}), 400
            
            current_data_query = """
                SELECT id_punto_interes, id_cliente, punto_interes
                FROM RUTA_PROGRAMACION
                WHERE id_programacion = ? AND id_ruta = ?
            """
            current_data = execute_query(current_data_query, (id_programacion, route_id), fetch_one=True)
            
            if not current_data:
                return jsonify({"success": False, "message": "Programación no encontrada"}), 404
            
            current_point_id = current_data[0]
            current_client_id = current_data[1]
            current_point_name = current_data[2] or ''
            
            current_client_name_query = "SELECT cliente FROM CLIENTES WHERE id_cliente = ?"
            current_client_name = execute_query(current_client_name_query, (current_client_id,), fetch_one=True) or ''
            
            insert_query = """
                INSERT INTO RUTA_PROGRAMACION_CAMBIOS_FUTUROS
                (id_programacion, id_ruta, ruta_nombre, id_punto_interes, punto_interes_nombre,
                 id_cliente, cliente_nombre, dia, prioridad, activa, tipo_cambio,
                 fecha_ejecucion, creado_por, estado, observaciones)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDIENTE', ?)
            """
            params = (
                id_programacion, route_id, route_name, current_point_id, current_point_name,
                current_client_id, current_client_name, day, priority, 1 if activa else 0,
                'UPDATE', fecha_ejecucion, current_user.username, observaciones
            )
            
        elif tipo_cambio == 'DELETE':
            if not id_programacion:
                return jsonify({"success": False, "message": "id_programacion es requerido para DELETE"}), 400
            
            current_data_query = """
                SELECT id_punto_interes, id_cliente, punto_interes
                FROM RUTA_PROGRAMACION
                WHERE id_programacion = ? AND id_ruta = ?
            """
            current_data = execute_query(current_data_query, (id_programacion, route_id), fetch_one=True)
            
            if not current_data:
                return jsonify({"success": False, "message": "Programación no encontrada"}), 404
            
            current_point_id = current_data[0]
            current_client_id = current_data[1]
            current_point_name = current_data[2] or ''
            
            current_client_name_query = "SELECT cliente FROM CLIENTES WHERE id_cliente = ?"
            current_client_name = execute_query(current_client_name_query, (current_client_id,), fetch_one=True) or ''
            
            insert_query = """
                INSERT INTO RUTA_PROGRAMACION_CAMBIOS_FUTUROS
                (id_programacion, id_ruta, ruta_nombre, id_punto_interes, punto_interes_nombre,
                 id_cliente, cliente_nombre, dia, prioridad, activa, tipo_cambio,
                 fecha_ejecucion, creado_por, estado, observaciones)
                VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL, 'DELETE', ?, ?, 'PENDIENTE', ?)
            """
            params = (
                id_programacion, route_id, route_name, current_point_id, current_point_name,
                current_client_id, current_client_name, fecha_ejecucion, current_user.username, observaciones
            )
        
        execute_query(insert_query, params, commit=True)
        
        return jsonify({
            "success": True,
            "message": f"Cambio {tipo_cambio} programado para {fecha_ejecucion}",
            "fecha_ejecucion": fecha_ejecucion,
            "tipo_cambio": tipo_cambio
        })
        
    except Exception as e:
        current_app.logger.error(f"Error en schedule_future_change: {str(e)}", exc_info=True)
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500


@routes_bp.route('/api/routes/<route_name>/future-changes', methods=['GET'])
@login_required
def get_future_changes(route_name):
    """Obtener cambios futuros programados para una ruta"""
    try:
        query = """
            SELECT
                id_cambio_futuro, id_programacion, id_ruta, ruta_nombre,
                id_punto_interes, punto_interes_nombre, id_cliente, cliente_nombre,
                dia, prioridad, activa, tipo_cambio, fecha_ejecucion,
                fecha_creacion, creado_por, estado, fecha_ejecutado, ejecutado_por, observaciones
            FROM RUTA_PROGRAMACION_CAMBIOS_FUTUROS
            WHERE ruta_nombre = ?
            ORDER BY fecha_ejecucion ASC, id_cambio_futuro DESC
        """
        changes = execute_query(query, (route_name,))
        
        return jsonify([{
            "id_cambio_futuro": row[0],
            "id_programacion": row[1],
            "id_ruta": row[2],
            "ruta_nombre": row[3],
            "id_punto_interes": row[4],
            "punto_interes_nombre": row[5] or 'N/A',
            "id_cliente": row[6],
            "cliente_nombre": row[7] or 'N/A',
            "dia": row[8],
            "prioridad": row[9],
            "activa": bool(row[10]) if row[10] is not None else None,
            "tipo_cambio": row[11],
            "fecha_ejecucion": row[12].strftime('%Y-%m-%d') if row[12] else None,
            "fecha_creacion": row[13].strftime('%Y-%m-%d %H:%M') if row[13] else None,
            "creado_por": row[14],
            "estado": row[15],
            "fecha_ejecutado": row[16].strftime('%Y-%m-%d %H:%M') if row[16] else None,
            "ejecutado_por": row[17],
            "observaciones": row[18] or ''
        } for row in changes])
        
    except Exception as e:
        current_app.logger.error(f"Error en get_future_changes: {str(e)}")
        return jsonify({"error": str(e)}), 500


@routes_bp.route('/api/routes/future-change/<int:id_cambio>/cancel', methods=['POST'])
@login_required
def cancel_future_change(id_cambio):
    """Cancelar un cambio futuro programado"""
    try:
        check_query = """
            SELECT estado FROM RUTA_PROGRAMACION_CAMBIOS_FUTUROS
            WHERE id_cambio_futuro = ?
        """
        result = execute_query(check_query, (id_cambio,), fetch_one=True)
        
        if not result:
            return jsonify({"success": False, "message": "Cambio no encontrado"}), 404
        
        if result[0] != 'PENDIENTE':
            return jsonify({
                "success": False, 
                "message": f"Solo se pueden cancelar cambios PENDIENTES (estado: {result[0]})"
            }), 400
        
        update_query = """
            UPDATE RUTA_PROGRAMACION_CAMBIOS_FUTUROS
            SET estado = 'CANCELADO', ejecutado_por = ?
            WHERE id_cambio_futuro = ?
        """
        execute_query(update_query, (current_user.username, id_cambio), commit=True)
        
        return jsonify({
            "success": True,
            "message": "Cambio futuro cancelado exitosamente"
        })
        
    except Exception as e:
        current_app.logger.error(f"Error en cancel_future_change: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500
    
#################################################################################################
################################### CRUD DE RUTAS NUEVAS PRUEBA #################################
#################################################################################################

@routes_bp.route('/api/routes/next-number')
@login_required
def get_next_route_number():
    """Obtiene el siguiente número correlativo para un tipo de ruta (E, A, T)"""
    try:
        tipo = request.args.get('tipo', '').upper()
        if tipo not in ['E', 'A', 'T']:
            return jsonify({"error": "Tipo inválido. Use E, A o T"}), 400
        
        prefix = f"Ruta {tipo}"
        query = "SELECT ruta FROM RUTAS_NUEVAS WHERE ruta LIKE ?"
        routes = execute_query(query, (prefix + '%',))
        
        max_num = 0
        for row in routes:
            suffix = row[0][len(prefix):]
            if suffix.isdigit():
                max_num = max(max_num, int(suffix))
        
        return jsonify({"next_number": max_num + 1})
    except Exception as e:
        current_app.logger.error(f"Error en get_next_route_number: {str(e)}")
        return jsonify({"error": str(e)}), 500
    

@routes_bp.route('/api/routes/create', methods=['POST'])
@login_required
def create_route():
    """Crear una nueva ruta con tipo, servicio, coordinadores y cuadrante"""
    try:
        data = request.get_json()
        current_app.logger.info(f"Datos recibidos para crear ruta: {data}")
        
        required_fields = ['tipo', 'servicio', 'coordinador_1', 'cuadrante']
        missing = [field for field in required_fields if not data.get(field)]
        if missing:
            return jsonify({
                "success": False,
                "message": f"Faltan campos: {', '.join(missing)}"
            }), 400

        tipo = data['tipo'].upper()
        if tipo not in ['E', 'A', 'T']:
            return jsonify({
                "success": False,
                "message": "Tipo debe ser E, A o T"
            }), 400

        servicio = data['servicio'].strip()
        coordinador_1 = data['coordinador_1'].strip()
        coordinador_2 = data.get('coordinador_2', '').strip() or None
        cuadrante = data['cuadrante'].strip()

        # Calcular el siguiente número
        prefix = f"Ruta {tipo}"
        query_rutas = "SELECT ruta FROM RUTAS_NUEVAS WHERE ruta LIKE ?"
        rutas_existentes = execute_query(query_rutas, (prefix + '%',))
        
        max_num = 0
        for row in rutas_existentes:
            suffix = row[0][len(prefix):]
            if suffix.isdigit():
                max_num = max(max_num, int(suffix))
        
        next_num = max_num + 1
        route_name = f"{prefix}{next_num}"

        # Insertar nueva ruta
        insert_query = """
            INSERT INTO RUTAS_NUEVAS 
            (ruta, servicio, coordinador_1, coordinador_2, cuadrante)
            VALUES (?, ?, ?, ?, ?)
        """
        params = (route_name, servicio, coordinador_1, coordinador_2, cuadrante)
        execute_query(insert_query, params, commit=True)

        current_app.logger.info(f"Ruta creada exitosamente: {route_name}")
        return jsonify({
            "success": True,
            "message": f"Ruta creada: {route_name}",
            "route_name": route_name
        })

    except Exception as e:
        current_app.logger.error(f"Error en create_route: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "message": f"Error interno: {str(e)}"
        }), 500
    
@routes_bp.route('/api/routes/<route_name>/info', methods=['GET'])
@login_required
def get_route_info(route_name):
    """Obtener información detallada de una ruta"""
    try:
        query = """
            SELECT ruta, servicio, coordinador_1, coordinador_2, cuadrante
            FROM RUTAS_NUEVAS
            WHERE ruta = ?
        """
        result = execute_query(query, (route_name,), fetch_one=True)
        
        if not result:
            return jsonify({"error": "Ruta no encontrada"}), 404
        
        return jsonify({
            "ruta": result[0],
            "servicio": result[1] or '',
            "coordinador_1": result[2] or '',
            "coordinador_2": result[3] or '',
            "cuadrante": result[4] or ''
        })
        
    except Exception as e:
        current_app.logger.error(f"Error en get_route_info: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@routes_bp.route('/api/routes/update', methods=['PUT'])
@login_required
def update_route():
    """Actualizar información de una ruta existente"""
    try:
        data = request.get_json()
        route_name = data.get('route_name')
        
        if not route_name:
            return jsonify({
                "success": False,
                "message": "Nombre de ruta es requerido"
            }), 400
        
        servicio = data.get('servicio', '').strip()
        coordinador_1 = data.get('coordinador_1', '').strip()
        coordinador_2 = data.get('coordinador_2', '').strip() or None
        cuadrante = data.get('cuadrante', '').strip()
        
        if not servicio or not coordinador_1 or not cuadrante:
            return jsonify({
                "success": False,
                "message": "Servicio, coordinador_1 y cuadrante son requeridos"
            }), 400
        
        update_query = """
            UPDATE RUTAS_NUEVAS
            SET servicio = ?, coordinador_1 = ?, coordinador_2 = ?, cuadrante = ?
            WHERE ruta = ?
        """
        params = (servicio, coordinador_1, coordinador_2, cuadrante, route_name)
        execute_query(update_query, params, commit=True)
        
        return jsonify({
            "success": True,
            "message": f"Ruta {route_name} actualizada exitosamente"
        })
        
    except Exception as e:
        current_app.logger.error(f"Error en update_route: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "message": f"Error interno: {str(e)}"
        }), 500
    

@routes_bp.route('/api/routes/<route_name>', methods=['DELETE'])
@login_required
def delete_route(route_name):
    """Eliminar una ruta y todos sus puntos programados"""
    try:
        # Primero obtener el id_ruta
        route_id_query = "SELECT id_ruta FROM RUTAS_NUEVAS WHERE ruta = ?"
        route_id_result = execute_query(route_id_query, (route_name,), fetch_one=True)
        
        if not route_id_result:
            return jsonify({
                "success": False,
                "message": f"Ruta '{route_name}' no encontrada"
            }), 404
        
        route_id = route_id_result
        
        # Eliminar puntos programados primero (por foreign key)
        delete_points_query = "DELETE FROM RUTA_PROGRAMACION WHERE id_ruta = ?"
        execute_query(delete_points_query, (route_id,), commit=True)
        
        # Eliminar cambios futuros programados
        delete_future_query = "DELETE FROM RUTA_PROGRAMACION_CAMBIOS_FUTUROS WHERE id_ruta = ?"
        execute_query(delete_future_query, (route_id,), commit=True)
        
        # Eliminar la ruta
        delete_route_query = "DELETE FROM RUTAS_NUEVAS WHERE id_ruta = ?"
        execute_query(delete_route_query, (route_id,), commit=True)
        
        current_app.logger.info(f"Ruta eliminada: {route_name}")
        return jsonify({
            "success": True,
            "message": f"Ruta '{route_name}' eliminada exitosamente"
        })
        
    except Exception as e:
        current_app.logger.error(f"Error en delete_route: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "message": f"Error interno: {str(e)}"
        }), 500