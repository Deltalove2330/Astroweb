# app/routes/points.py
from flask import Blueprint, render_template, jsonify, current_app, redirect, url_for
from flask_login import login_required, current_user
from app.utils.database import execute_query  
from app.utils.helpers import obtener_dia_actual_espanol

dia_actual = obtener_dia_actual_espanol()
points_bp = Blueprint('points', __name__)

@points_bp.route("/")
@login_required
def index():
    # Redirigir clientes a su sección específica
    if current_user.rol == 'client':
        return redirect(url_for('auth.client_photos_page'))
    # Los analistas ven el dashboard normal
    return render_template("index.html")

@points_bp.route("/api/pending-points")
@login_required
def get_pending_points():
    # Solo permitir acceso a analistas
    if current_user.rol == 'client':
        return jsonify({"error": "No autorizado"}), 403
    
    try:
        # Obtener el día actual en español
        dia_actual = obtener_dia_actual_espanol()
        
        query = """
        SELECT DISTINCT
            pin.identificador,
            pin.punto_de_interes,
            c.cliente,
            COUNT(vm.id_visita) AS visitas_pendientes
        FROM PUNTOS_INTERES1 pin
        JOIN VISITAS_MERCADERISTA vm ON pin.identificador = vm.identificador_punto_interes
        JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
        JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes AND c.id_cliente = rp.id_cliente
        WHERE vm.estado = 'Pendiente' 
            AND rp.dia = ? 
            AND rp.activa = 1
        GROUP BY pin.identificador, pin.punto_de_interes, c.cliente
        HAVING COUNT(vm.id_visita) > 0
        ORDER BY visitas_pendientes DESC
        """
        points = execute_query(query, (dia_actual,))
        return jsonify([{
            "id": row[0],
            "nombre": row[1],
            "cliente": row[2],
            "pendientes": row[3]
        } for row in points])
    except Exception as e:
        current_app.logger.error(f"Error obteniendo puntos pendientes: {str(e)}")
        return jsonify({"error": str(e)}), 500