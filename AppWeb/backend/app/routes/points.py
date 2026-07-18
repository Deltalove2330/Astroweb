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
    # Redirigir clientes REALES (id_rol=1) a su sección específica. Los 3
    # roles de coordinador (exclusivo/tradex/general, id_rol 3/4/11) también
    # tienen rol == 'client' (ROL_MAP los mapea así), pero deben ver el
    # mismo Centro de Mando que el analista — con todas las rutas y todos
    # los clientes, sin filtrar — así que se excluyen explícitamente de
    # esta redirección con is_coordinador().
    if current_user.rol == 'client' and not current_user.is_coordinador():
        return redirect(url_for('auth.client_photos_page'))
    # Analistas y coordinadores ven el dashboard normal (Centro de Mando)
    return render_template("index.html")

@points_bp.route("/api/pending-points")
@login_required
def get_pending_points():
    # Solo permitir acceso a analistas y coordinadores (no a clientes reales)
    if current_user.rol == 'client' and not current_user.is_coordinador():
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
        FROM PUNTOS_INTERES1 pin WITH (NOLOCK)
        JOIN VISITAS_MERCADERISTA vm WITH (NOLOCK) ON pin.identificador = vm.identificador_punto_interes
        JOIN CLIENTES c WITH (NOLOCK) ON vm.id_cliente = c.id_cliente
        JOIN RUTA_PROGRAMACION rp WITH (NOLOCK) ON pin.identificador = rp.id_punto_interes AND c.id_cliente = rp.id_cliente
        WHERE vm.estado = 'Pendiente' 
            AND rp.dia = ? 
            AND rp.activa = 1
        GROUP BY pin.identificador, pin.punto_de_interes, c.cliente
        HAVING COUNT(vm.id_visita) > 0
        ORDER BY visitas_pendientes DESC
        """
        points = execute_query(query, (dia_actual,))
        if points is None:
            return jsonify({"error": "No se pudieron cargar los puntos pendientes"}), 500
            
        return jsonify([{
            "id": row[0],
            "nombre": row[1],
            "cliente": row[2],
            "pendientes": row[3]
        } for row in points])
    except Exception as e:
        current_app.logger.error(f"Error obteniendo puntos pendientes: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@points_bp.route('/notificaciones-admin')
@login_required
def notificaciones_admin():
    """Página de notificaciones para analistas y administradores"""
    if current_user.rol not in ['analyst', 'admin']:
        return redirect(url_for('auth.login'))
    return render_template('notificaciones-admin.html')