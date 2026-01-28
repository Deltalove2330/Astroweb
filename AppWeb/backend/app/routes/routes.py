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
@routes_bp.route('/api/routes/<string:route_name>/details')
@login_required
def get_route_details(route_name):
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
                rp.activa,  -- Nuevo campo
                rp.id_programacion  -- Nuevo campo
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
            "departamento": row[5],
            "ciudad": row[6],
            "dia": row[7],
            "prioridad": row[8],
            "activa": bool(row[9]),  # Nuevo campo
            "id_programacion": row[10]  # Nuevo campo
        } for row in points])
        
    except Exception as e:
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


@routes_bp.route('/api/routes/<string:route_name>/add-point', methods=['POST'])
@login_required
def add_point_to_route(route_name):
    """Agregar un punto a una ruta"""
    try:
        data = request.get_json()
        point_id = data.get('point_id')
        client_id = data.get('client_id')
        
        if not point_id or not client_id:
            return jsonify({
                "success": False,
                "message": "ID del punto y ID del cliente son requeridos"
            }), 400
            
        # Primero obtener el id_ruta de la ruta por nombre
        route_id_query = "SELECT id_ruta FROM RUTAS_NUEVAS WHERE ruta = ?"
        route_id_result = execute_query(route_id_query, (route_name,), fetch_one=True)
        
        if not route_id_result:
            return jsonify({
                "success": False,
                "message": "Ruta no encontrada"
            }), 404
            
        route_id = route_id_result[0]
            
        # Verificar si ya existe
        check_query = """
            SELECT COUNT(*) FROM RUTA_PROGRAMACION 
            WHERE id_ruta = ? AND id_punto_interes = ? AND id_cliente = ?
        """
        exists = execute_query(check_query, (route_id, point_id, client_id), fetch_one=True)
        
        if exists[0] > 0:
            return jsonify({
                "success": False,
                "message": "Este punto ya existe en la ruta"
            }), 400
            
        # Insertar nuevo punto
        insert_query = """
            INSERT INTO RUTA_PROGRAMACION (id_ruta, id_punto_interes, id_cliente)
            VALUES (?, ?, ?)
        """
        execute_query(insert_query, (route_id, point_id, client_id), commit=True)
        
        return jsonify({
            "success": True,
            "message": "Punto agregado exitosamente a la ruta"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@routes_bp.route('/api/routes/<string:route_name>/remove-point', methods=['DELETE'])
@login_required
def remove_point_from_route(route_name):
    """Eliminar un punto de una ruta"""
    try:
        data = request.get_json()
        point_id = data.get('point_id')
        client_id = data.get('client_id')
        
        if not point_id or not client_id:
            return jsonify({
                "success": False,
                "message": "ID del punto y ID del cliente son requeridos"
            }), 400
            
        # Primero obtener el id_ruta de la ruta por nombre
        route_id_query = "SELECT id_ruta FROM RUTAS_NUEVAS WHERE ruta = ?"
        route_id_result = execute_query(route_id_query, (route_name,), fetch_one=True)
        
        if not route_id_result:
            return jsonify({
                "success": False,
                "message": "Ruta no encontrada"
            }), 404
            
        route_id = route_id_result[0]
            
        delete_query = """
            DELETE FROM RUTA_PROGRAMACION
            WHERE id_ruta = ? AND id_punto_interes = ? AND id_cliente = ?
        """
        execute_query(delete_query, (route_id, point_id, client_id), commit=True)
        
        return jsonify({
            "success": True,
            "message": "Punto eliminado exitosamente de la ruta"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@routes_bp.route('/api/routes/create', methods=['POST'])
@login_required
def create_route():
    """Crear una nueva ruta en RUTAS_NUEVAS"""
    try:
        data = request.get_json()
        route_name = data.get('route_name')
        
        if not route_name:
            return jsonify({
                "success": False,
                "message": "Nombre de la ruta es requerido"
            }), 400
            
        # Verificar si ya existe
        check_query = "SELECT COUNT(*) FROM RUTAS_NUEVAS WHERE ruta = ?"
        exists = execute_query(check_query, (route_name,), fetch_one=True)
        
        if exists[0] > 0:
            return jsonify({
                "success": False,
                "message": "Ya existe una ruta con este nombre"
            }), 400
            
        # Insertar nueva ruta
        insert_query = """
            INSERT INTO RUTAS_NUEVAS (ruta)
            VALUES (?)
        """
        execute_query(insert_query, (route_name,), commit=True)
        
        return jsonify({
            "success": True,
            "message": "Ruta creada exitosamente"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

# app/routes/routes.py
@routes_bp.route('/api/routes/<string:route_name>/update-points', methods=['POST'])
@login_required
def update_points_in_route(route_name):
    """Actualizar día, prioridad y estado activo de múltiples puntos en una ruta"""
    try:
        data = request.get_json()
        
        # Validar que sea una lista de actualizaciones
        if not isinstance(data, list):
            return jsonify({
                "success": False,
                "message": "Se espera una lista de actualizaciones"
            }), 400
            
        # Validar que todos los datos requeridos estén presentes
        for update in data:
            if not update.get('programacion_id') or update.get('day') is None or update.get('priority') is None or update.get('active') is None:
                return jsonify({
                    "success": False,
                    "message": "ID de programación, día, prioridad y estado activo son requeridos para cada actualización"
                }), 400
        
        # Actualizar cada punto usando id_programacion
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