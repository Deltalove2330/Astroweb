# app/routes/clients.py
from flask import Blueprint, jsonify, current_app, request
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
            FROM RUTAS_NUEVAS rn WITH (NOLOCK)
            JOIN RUTA_PROGRAMACION rp WITH (NOLOCK) ON rn.id_ruta = rp.id_ruta
            JOIN PUNTOS_INTERES1 pin WITH (NOLOCK) ON rp.id_punto_interes = pin.identificador
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
            FROM RUTAS_NUEVAS rn WITH (NOLOCK)
            JOIN RUTA_PROGRAMACION rp WITH (NOLOCK) ON rn.id_ruta = rp.id_ruta
            JOIN PUNTOS_INTERES1 pin WITH (NOLOCK) ON rp.id_punto_interes = pin.identificador
            WHERE rn.ruta IS NOT NULL
                AND rp.dia = ?
                AND rp.activa = 1
            GROUP BY rn.id_ruta, rn.ruta, rn.servicio
            HAVING COUNT(pin.identificador) > 0
            ORDER BY 
                CAST(SUBSTRING(rn.ruta, PATINDEX('%[0-9]%', rn.ruta), LEN(rn.ruta)) AS INT)
            """
            rutas = execute_query(query, (dia_actual,))
        
        if rutas is None:
            return jsonify({"error": "Error de base de datos cargando rutas"}), 500
        
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
        JOIN RUTA_PROGRAMACION rp WITH (NOLOCK) ON rn.id_ruta = rp.id_ruta
        JOIN PUNTOS_INTERES1 pin WITH (NOLOCK) ON rp.id_punto_interes = pin.identificador
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
        query = "SELECT id_cliente, cliente FROM CLIENTES WITH (NOLOCK) ORDER BY cliente"
        clients = execute_query(query)
        if clients is None:
            return jsonify({"error": "Error cargando clientes"}), 500
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
    FROM RUTAS_NUEVAS rn WITH (NOLOCK)
    JOIN RUTA_PROGRAMACION rp WITH (NOLOCK) ON rn.id_ruta = rp.id_ruta
    JOIN PUNTOS_INTERES1 pin WITH (NOLOCK) ON rp.id_punto_interes = pin.identificador
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
    if rutas is None:
        return jsonify({"error": "Error cargando rutas del analista"}), 500
    return jsonify([{
        "id": row[0],
        "nombre": row[1],
        "servicio": row[2],
        "has_high_priority": bool(row[3])
    } for row in rutas])


@clients_bp.route("/api/client-balances")
@login_required
def get_client_balances():
    """Balances totales APROBADOS del cliente logueado (rol 'client') o del
    cliente seleccionado por un coordinador exclusivo.

    "Aprobado" = la visita que originó el balance está en estado 'Revisado'
    (el analista aprobó todas sus fotos; ver visits.py). El cliente NUNCA ve
    balances de visitas Pendientes.
    """
    if current_user.rol != 'client' and not current_user.is_coordinador_exclusivo():
        return jsonify({"error": "No autorizado"}), 403

    # El cliente ve SOLO su propio id_cliente. Un coordinador puede pasar ?cliente_id=
    cliente_id = getattr(current_user, 'cliente_id', None)
    if not cliente_id and current_user.is_coordinador_exclusivo():
        cliente_id = request.args.get('cliente_id', type=int)
    if not cliente_id:
        return jsonify({"error": "Cliente no identificado"}), 400

    try:
        query = """
            SELECT
                b.fecha_balance,
                b.identificador_pdv,
                pin.punto_de_interes,
                b.mercaderista,
                b.producto,
                b.categoria,
                b.fabricante,
                b.inv_inicial,
                b.inv_deposito,
                b.inv_final,
                b.caras,
                b.precio_bs,
                b.precio_ds,
                b.FEFO
            FROM BALANCES_TOTALES b WITH (NOLOCK)
            JOIN VISITAS_MERCADERISTA v WITH (NOLOCK) ON b.id_visita = v.id_visita
            LEFT JOIN PUNTOS_INTERES1 pin WITH (NOLOCK) ON b.identificador_pdv = pin.identificador
            WHERE b.id_cliente = ? AND v.estado = 'Revisado'
            ORDER BY b.fecha_balance DESC, b.identificador_pdv, b.producto
        """
        rows = execute_query(query, (cliente_id,))
        if rows is None:
            return jsonify({"error": "Error de base de datos"}), 500

        return jsonify([{
            "fecha": row[0].isoformat() if row[0] else None,
            "identificador_pdv": row[1] or '',
            "punto_interes": row[2] or row[1] or '',
            "mercaderista": row[3] or '',
            "producto": row[4] or '',
            "categoria": row[5] or '',
            "fabricante": row[6] or '',
            "inv_inicial": row[7],
            "inv_deposito": row[8],
            "inv_final": row[9],
            "caras": row[10],
            "precio_bs": row[11],
            "precio_ds": row[12],
            "fefo": row[13].isoformat() if row[13] else None
        } for row in rows])
    except Exception as e:
        current_app.logger.error(f"Error en get_client_balances: {str(e)}")
        return jsonify({"error": "Error interno", "details": str(e)}), 500