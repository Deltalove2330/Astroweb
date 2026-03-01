# app/routes/clients.py
from flask import Blueprint, jsonify, current_app
from flask_login import login_required, current_user
from app.utils.database import execute_query
from app.utils.helpers import obtener_dia_actual_espanol


clients_bp = Blueprint('clients', __name__)

@clients_bp.route("/api/clients")
@login_required
def get_clients():
    if current_user.rol == 'client':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        # Obtener el día actual en español
        dia_actual = obtener_dia_actual_espanol()
        
        # Si el usuario es un analista, filtrar por su id_analista
        if current_user.rol == 'analyst' and current_user.id_analista:
            query = """
            SELECT 
                rn.id_ruta,
                rn.ruta,
                rn.servicio,
                MAX(CASE WHEN rp.prioridad = 'Alta' THEN 1 ELSE 0 END) AS alta_count
            FROM RUTAS_NUEVAS rn
            JOIN RUTA_PROGRAMACION rp ON rn.id_ruta = rp.id_ruta
            JOIN PUNTOS_INTERES1 pin ON rp.id_punto_interes = pin.identificador
            WHERE rn.ruta IS NOT NULL
                AND rp.dia = ?
                AND rp.activa = 1
                AND EXISTS (
    SELECT 1 FROM analistas_rutas ar 
    WHERE ar.id_ruta = rn.id_ruta AND ar.id_analista = ?
)
            GROUP BY rn.id_ruta, rn.ruta, rn.servicio
            HAVING COUNT(pin.identificador) > 0
            ORDER BY 
                CAST(SUBSTRING(rn.ruta, PATINDEX('%[0-9]%', rn.ruta), LEN(rn.ruta)) AS INT)
            """
            rutas = execute_query(query, (dia_actual, current_user.id_analista))
        else:
            # Para administradores, mostrar todas las rutas
            query = """
            SELECT 
                rn.id_ruta,
                rn.ruta,
                rn.servicio,
                MAX(CASE WHEN rp.prioridad = 'Alta' THEN 1 ELSE 0 END) AS alta_count
            FROM RUTAS_NUEVAS rn
            JOIN RUTA_PROGRAMACION rp ON rn.id_ruta = rp.id_ruta
            JOIN PUNTOS_INTERES1 pin ON rp.id_punto_interes = pin.identificador
            WHERE rn.ruta IS NOT NULL
                AND rp.dia = ?
                AND rp.activa = 1
            GROUP BY rn.id_ruta, rn.ruta, rn.servicio
            HAVING COUNT(pin.identificador) > 0
            ORDER BY 
                CAST(SUBSTRING(rn.ruta, PATINDEX('%[0-9]%', rn.ruta), LEN(rn.ruta)) AS INT)
            """
            rutas = execute_query(query, (dia_actual,))
        
        return jsonify([{
            "id": row[0],
            "nombre": row[1],
            "servicio": row[2],
            "has_high_priority": bool(row[3])
        } for row in rutas])
    except Exception as e:
        current_app.logger.error(f"API CLIENTS ERROR: {str(e)}")
        return jsonify({"error": str(e), "details": "Error al cargar rutas"}), 500
    

@clients_bp.route("/api/route-points/<string:ruta_id>")
@login_required
def get_route_points(ruta_id):
    if current_user.rol == 'client':
        return jsonify({"error": "No autorizado"}), 403
    
    # Si el usuario es analista, verificar que la ruta pertenezca al analista
    if current_user.rol == 'analyst':
        analista_id = current_user.id_analista
        if not analista_id:
            return jsonify({"error": "Analista no asociado"}), 400
        
        # Verificar si la ruta pertenece al analista
        check_query = """
SELECT COUNT(*) 
FROM analistas_rutas 
WHERE id_ruta = ? AND id_analista = ?
"""
        count = execute_query(check_query, (ruta_id, analista_id), fetch_one=True)
        if count == 0:
            return jsonify({"error": "No autorizado para ver esta ruta"}), 403
    
    dia_actual = obtener_dia_actual_espanol()
    query = """
    WITH RankedPoints AS (
        SELECT
            pin.identificador AS id,
            pin.punto_de_interes AS nombre,
            rp.prioridad,
            ROW_NUMBER() OVER (
                PARTITION BY pin.identificador
                ORDER BY
                    CASE rp.prioridad
                        WHEN 'Alta' THEN 1
                        WHEN 'Media' THEN 2
                        WHEN 'Baja' THEN 3
                        ELSE 4
                    END
            ) AS rn
        FROM RUTAS_NUEVAS rn
        JOIN RUTA_PROGRAMACION rp ON rn.id_ruta = rp.id_ruta
        JOIN PUNTOS_INTERES1 pin ON rp.id_punto_interes = pin.identificador
        WHERE rn.id_ruta = ?
        AND rp.dia = ?
        AND rp.activa = 1
    )
    SELECT id, nombre, prioridad
    FROM RankedPoints
    WHERE rn = 1
    ORDER BY nombre
    """
    
    points = execute_query(query, (ruta_id, dia_actual))
    if not points:
        return jsonify([])
    
    return jsonify([{
        "id": row[0],
        "nombre": row[1],
        "prioridad": row[2] or "Sin prioridad"
    } for row in points])
    
@clients_bp.route("/api/all-clients")
@login_required
def get_all_clients():
    # Solo permitir acceso a analistas
    if current_user.rol == 'client':
        return jsonify({"error": "No autorizado"}), 403
        
    try:
        query = "SELECT id_cliente, cliente FROM CLIENTES ORDER BY cliente"
        clients = execute_query(query, ())
        return jsonify([{"id": row[0], "nombre": row[1]} for row in clients])
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo clientes: {str(e)}")
        return jsonify({"error": "Error interno", "details": str(e)}), 500
    

@clients_bp.route("/api/analyst-routes")
@login_required
def get_analyst_routes():
    if current_user.rol != 'analyst':
        return jsonify({"error": "No autorizado"}), 403
    
    analista_id = current_user.id_analista
    if not analista_id:
        return jsonify({"error": "Analista no asociado"}), 400
    
    dia_actual = obtener_dia_actual_espanol()
    
    query = """
    SELECT rn.id_ruta, rn.ruta, rn.servicio, 
           MAX(CASE WHEN rp.prioridad = 'Alta' THEN 1 ELSE 0 END) AS alta_count
    FROM RUTAS_NUEVAS rn
    JOIN RUTA_PROGRAMACION rp ON rn.id_ruta = rp.id_ruta
    JOIN PUNTOS_INTERES1 pin ON rp.id_punto_interes = pin.identificador
    WHERE rn.ruta IS NOT NULL
    AND rp.dia = ?
    AND rp.activa = 1
    AND EXISTS (
    SELECT 1 FROM analistas_rutas ar 
    WHERE ar.id_ruta = rn.id_ruta AND ar.id_analista = ?
)
    GROUP BY rn.id_ruta, rn.ruta, rn.servicio
    HAVING COUNT(pin.identificador) > 0
    ORDER BY CAST(SUBSTRING(rn.ruta, PATINDEX('%[0-9]%', rn.ruta), LEN(rn.ruta)) AS INT)
    """
    
    rutas = execute_query(query, (dia_actual, analista_id))
    return jsonify([{
        "id": row[0],
        "nombre": row[1],
        "servicio": row[2],
        "has_high_priority": bool(row[3])
    } for row in rutas])