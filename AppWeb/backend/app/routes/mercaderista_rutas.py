# app/routes/mercaderista_rutas.py
from flask import Blueprint, render_template, request, jsonify, current_app
from flask_login import login_required, current_user
from app.utils.database import execute_query

mercaderista_rutas_bp = Blueprint('mercaderista_rutas', __name__, url_prefix='/mercaderista-rutas')

@mercaderista_rutas_bp.route('/')
@login_required
def mercaderista_rutas_management():
    """Página principal de gestión de rutas para mercaderistas"""
    current_app.logger.info(f"Acceso a asignación de rutas por usuario: {current_user.username}")
    return render_template('mercaderista_rutas.html')

@mercaderista_rutas_bp.route('/api/mercaderistas')
@login_required
def get_mercaderistas():
    """Obtener lista de mercaderistas con sus rutas asignadas"""
    try:
        query = """
            SELECT 
                m.id_mercaderista,
                m.nombre,
                m.cedula,
                m.activo,
                m.telefono,
                m.tipo,
                m.email,
                COUNT(mr.id_ruta) as rutas_asignadas
            FROM MERCADERISTAS m
            LEFT JOIN MERCADERISTAS_RUTAS mr ON m.id_mercaderista = mr.id_mercaderista
            GROUP BY 
                m.id_mercaderista, m.nombre, m.cedula, m.activo, 
                m.telefono, m.tipo, m.email
            ORDER BY m.nombre
        """
        mercaderistas = execute_query(query)
        
        return jsonify([{
            "id_mercaderista": row[0],
            "nombre": row[1] or '',
            "cedula": row[2] or '',
            "activo": bool(row[3]),
            "telefono": row[4] or '',
            "tipo": row[5] or 'Variable',
            "email": row[6] or '',
            "rutas_asignadas": row[7]
        } for row in mercaderistas])
        
    except Exception as e:
        current_app.logger.error(f"Error en get_mercaderistas: {str(e)}")
        return jsonify({"error": str(e)}), 500

@mercaderista_rutas_bp.route('/api/routes')
@login_required
def get_all_routes():
    """Obtener todas las rutas disponibles"""
    try:
        query = """
            SELECT id_ruta, ruta, servicio
            FROM RUTAS_NUEVAS
            WHERE ruta IS NOT NULL
            ORDER BY ruta
        """
        routes = execute_query(query)
        
        return jsonify([{
            "id_ruta": row[0],
            "ruta": row[1] or '',
            "servicio": row[2] or ''
        } for row in routes])
        
    except Exception as e:
        current_app.logger.error(f"Error en get_all_routes: {str(e)}")
        return jsonify({"error": str(e)}), 500

@mercaderista_rutas_bp.route('/api/mercaderista/<int:mercaderista_id>/routes')
@login_required
def get_mercaderista_routes(mercaderista_id):
    """Obtener rutas asignadas a un mercaderista específico"""
    try:
        query = """
            SELECT 
                mr.id_mercaderista_ruta,
                mr.id_mercaderista,
                mr.id_ruta,
                mr.tipo_ruta,
                rn.ruta as ruta_nombre,
                rn.servicio
            FROM MERCADERISTAS_RUTAS mr
            LEFT JOIN RUTAS_NUEVAS rn ON mr.id_ruta = rn.id_ruta
            WHERE mr.id_mercaderista = ?
            ORDER BY rn.ruta
        """
        assignments = execute_query(query, (mercaderista_id,))
        
        return jsonify([{
            "id_mercaderista_ruta": row[0],
            "id_mercaderista": row[1],
            "id_ruta": row[2],
            "tipo_ruta": row[3] or 'Variable',
            "ruta_nombre": row[4] or '',
            "servicio": row[5] or ''
        } for row in assignments])
        
    except Exception as e:
        current_app.logger.error(f"Error en get_mercaderista_routes: {str(e)}")
        return jsonify({"error": str(e)}), 500

@mercaderista_rutas_bp.route('/api/assignments/save', methods=['POST'])
@login_required
def save_route_assignments():
    """Guardar/actualizar asignaciones de rutas a un mercaderista"""
    try:
        data = request.get_json()
        current_app.logger.info(f"📥 Datos recibidos: {data}")
        
        mercaderista_id = data.get('id_mercaderista')
        rutas = data.get('rutas', [])
        
        if not mercaderista_id:
            return jsonify({
                "success": False,
                "message": "ID de mercaderista es requerido"
            }), 400
        
        # Verificar que el mercaderista existe
        check_merc_query = "SELECT COUNT(*) FROM MERCADERISTAS WHERE id_mercaderista = ?"
        exists = execute_query(check_merc_query, (mercaderista_id,), fetch_one=True)
        
        if not exists or exists == 0:
            return jsonify({
                "success": False,
                "message": "Mercaderista no encontrado"
            }), 404
        
        # Obtener asignaciones actuales
        current_query = "SELECT id_ruta, id_mercaderista_ruta FROM MERCADERISTAS_RUTAS WHERE id_mercaderista = ?"
        current_assignments = execute_query(current_query, (mercaderista_id,))
        current_route_ids = {row[0]: row[1] for row in current_assignments}
        
        # Rutas nuevas (las que están en el payload pero no en la BD)
        new_route_ids = {r['id_ruta'] for r in rutas}
        existing_route_ids = set(current_route_ids.keys())
        
        routes_to_add = new_route_ids - existing_route_ids
        routes_to_update = new_route_ids & existing_route_ids
        routes_to_remove = existing_route_ids - new_route_ids
        
        current_app.logger.info(f"📊 Análisis: Agregar={len(routes_to_add)}, Actualizar={len(routes_to_update)}, Eliminar={len(routes_to_remove)}")
        
        # Eliminar rutas que ya no están asignadas
        if routes_to_remove:
            for route_id in routes_to_remove:
                delete_query = "DELETE FROM MERCADERISTAS_RUTAS WHERE id_mercaderista = ? AND id_ruta = ?"
                execute_query(delete_query, (mercaderista_id, route_id), commit=True)
            current_app.logger.info(f"✅ Eliminadas {len(routes_to_remove)} rutas")
        
        # Actualizar tipo de ruta para las existentes
        for ruta_data in rutas:
            route_id = ruta_data['id_ruta']
            if route_id in routes_to_update:
                tipo_ruta = ruta_data.get('tipo_ruta', 'Variable')
                update_query = "UPDATE MERCADERISTAS_RUTAS SET tipo_ruta = ? WHERE id_mercaderista = ? AND id_ruta = ?"
                execute_query(update_query, (tipo_ruta, mercaderista_id, route_id), commit=True)
        
        # Insertar nuevas asignaciones
        if routes_to_add:
            insert_query = """
                INSERT INTO MERCADERISTAS_RUTAS (id_mercaderista, id_ruta, tipo_ruta)
                VALUES (?, ?, ?)
            """
            for ruta_data in rutas:
                route_id = ruta_data['id_ruta']
                if route_id in routes_to_add:
                    tipo_ruta = ruta_data.get('tipo_ruta', 'Variable')
                    execute_query(insert_query, (mercaderista_id, route_id, tipo_ruta), commit=True)
            current_app.logger.info(f"✅ Agregadas {len(routes_to_add)} rutas")
        
        total_changes = len(routes_to_add) + len(routes_to_update) + len(routes_to_remove)
        
        return jsonify({
            "success": True,
            "message": f"Asignaciones actualizadas exitosamente ({total_changes} cambios)",
            "changes": {
                "added": len(routes_to_add),
                "updated": len(routes_to_update),
                "removed": len(routes_to_remove)
            }
        })
        
    except Exception as e:
        current_app.logger.error(f"❌ Error en save_route_assignments: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "message": f"Error interno: {str(e)}"
        }), 500

@mercaderista_rutas_bp.route('/api/mercaderista/<int:mercaderista_id>/update-type', methods=['PUT'])
@login_required
def update_mercaderista_type(mercaderista_id):
    """Actualizar el tipo de mercaderista (Fijo/Variable)"""
    try:
        data = request.get_json()
        new_type = data.get('tipo')
        
        if not new_type or new_type not in ['Fijo', 'Variable']:
            return jsonify({
                "success": False,
                "message": "Tipo debe ser 'Fijo' o 'Variable'"
            }), 400
        
        update_query = "UPDATE MERCADERISTAS SET tipo = ? WHERE id_mercaderista = ?"
        execute_query(update_query, (new_type, mercaderista_id), commit=True)
        
        return jsonify({
            "success": True,
            "message": f"Tipo actualizado a {new_type}"
        })
        
    except Exception as e:
        current_app.logger.error(f"Error en update_mercaderista_type: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500