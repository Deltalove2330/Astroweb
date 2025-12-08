# app/routes/auth.py
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, current_app, session
from flask_login import login_user, logout_user, current_user, login_required
from app.utils.auth import verify_password, get_user_by_username
from app.utils.database import execute_query, get_db_connection
import bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if verify_password(username, password):
            user = get_user_by_username(username)
            login_user(user)
            
            # Si es AJAX request, devolver JSON
            if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                if user.rol == 'client':
                    return jsonify({'redirect': url_for('auth.client_photos_page')})
                elif user.rol == 'supervisor':
                    return jsonify({'redirect': url_for('supervisors.supervisor_dashboard')})
                else:
                    return jsonify({'redirect': url_for('points.index')})
            
            # Si es formulario tradicional
            if user.rol == 'client':
                return redirect(url_for('auth.client_photos_page'))
            elif user.rol == 'supervisor':
                return redirect(url_for('supervisors.supervisor_dashboard'))
            else:
                return redirect(url_for('points.index'))
                
        if request.is_json:
            return jsonify({'error': 'Usuario o contraseña incorrectos'}), 401
        flash('Usuario o contraseña incorrectos', 'danger')
    
    # Manejar tanto el caso GET como el caso POST fallido
    return render_template('login.html')
    

@auth_bp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

# Reemplazar el endpoint current_user_info existente por:
@auth_bp.route('/api/current-user')
@login_required
def current_user_info():
    # Añadir lógica para redirigir a supervisores si están en la página principal
    if current_user.rol == 'supervisor' and request.referrer and 'supervisor' not in request.referrer:
        return jsonify({
            'id': current_user.id,
            'username': current_user.username,
            'rol': current_user.rol,
            'cliente_id': current_user.cliente_id if hasattr(current_user, 'cliente_id') else None,
            'redirect_to_supervisor': True
        })
    
    return jsonify({
        'id': current_user.id,
        'username': current_user.username,
        'rol': current_user.rol,
        'cliente_id': current_user.cliente_id if hasattr(current_user, 'cliente_id') else None
    })
# Nueva ruta para login de mercaderistas
@auth_bp.route('/login-mercaderista')
def login_mercaderista():
    return render_template('login-mercaderista.html')

@auth_bp.route('/carga-mercaderista')
def carga_mercaderista():
    return render_template('carga-mercaderista.html')

# Ruta API para verificar mercaderista
@auth_bp.route('/api/verify-merchandiser', methods=['POST'])
def verify_merchandiser():
    try:
        data = request.get_json()
        cedula = data.get('cedula')
        
        if not cedula:
            return jsonify({
                "success": False,
                "message": "Cédula requerida"
            }), 400
        
        # Verificar si la cédula existe y está activa
        query = """
            SELECT nombre, cedula 
            FROM MERCADERISTAS 
            WHERE cedula = ? AND activo = 0x01
        """
        result = execute_query(query, (cedula,), fetch_one=True)
        
        if result:
            # Establecer la sesión del mercaderista
            session['merchandiser_cedula'] = cedula
            session['merchandiser_authenticated'] = True
            session['merchandiser_nombre'] = result[0]
            
            # Para asegurar que la sesión se guarde
            session.modified = True
            
            return jsonify({
                "success": True,
                "nombre": result[0],
                "cedula": result[1]
            })
        else:
            return jsonify({
                "success": False,
                "message": "Cédula no encontrada o inactiva"
            }), 404
            
    except Exception as e:
        current_app.logger.error(f"Error en verify_merchandiser: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "message": f"Error al verificar mercaderista: {str(e)}"
        }), 500
# Agregar estos nuevos endpoints al final del archivo

@auth_bp.route('/api/client-photos')
@login_required
def client_photos():
    """Obtener TODAS las fotos de un cliente"""
    if current_user.rol != 'client':
        return jsonify({'error': 'No autorizado'}), 403
    
    cliente_id = current_user.cliente_id
    if not cliente_id:
        return jsonify({'error': 'Cliente no asociado'}), 400
    
    try:
        query = """
            SELECT DISTINCT 
                pin.identificador,
                pin.punto_de_interes,
                c.cliente AS clientes,
                COUNT(ft.id_foto) as total_fotos,
                pin.departamento,
                pin.ciudad
            FROM FOTOS_TOTALES ft
            JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
            JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
            JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
            WHERE c.id_cliente = ?
            GROUP BY pin.identificador, pin.punto_de_interes, c.cliente, pin.departamento, pin.ciudad
        """
        results = execute_query(query, (cliente_id,))
        
        return jsonify([{
            'identificador': row[0],
            'punto_de_interes': row[1],
            'clientes': row[2],
            'total_fotos': row[3],
            'departamento': row[4],
            'ciudad': row[5]
        } for row in results])
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/client-point-photos/<string:point_id>')
@login_required
def client_point_photos(point_id):
    if current_user.rol != 'client':
        return jsonify({'error': 'No autorizado'}), 403

    cliente_id = current_user.cliente_id
    if not cliente_id:
        return jsonify({'error': 'Cliente no asociado'}), 400

    fecha_inicio = request.args.get('fecha_inicio', '')
    fecha_fin = request.args.get('fecha_fin', '')
    prioridad = request.args.get('prioridad', '').lower()
    id_visita = request.args.get('id_visita', '')

    try:
        base_query = """
            SELECT DISTINCT
                ft.id_foto,
                ft.file_path,
                ft.id_tipo_foto,
                ft.estado,
                vm.fecha_visita,
                vm.id_visita,
                m.nombre,
                pin.punto_de_interes,
                c.cliente
            FROM FOTOS_TOTALES ft
            JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
            JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
            JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
            JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
            JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes AND c.id_cliente = rp.id_cliente
            WHERE c.id_cliente = ? AND pin.identificador = ?
        """

        params = [cliente_id, point_id]

        if fecha_inicio:
            base_query += " AND vm.fecha_visita >= ?"
            params.append(fecha_inicio)

        if fecha_fin:
            base_query += " AND vm.fecha_visita <= ?"
            params.append(fecha_fin)

        if prioridad in ['alta', 'baja']:
            base_query += " AND rp.prioridad = ?"
            params.append(prioridad)
            
        if id_visita:
            base_query += " AND vm.id_visita = ?"
            params.append(id_visita)

        base_query += " ORDER BY vm.id_visita DESC, ft.id_tipo_foto, ft.id_foto DESC"

        results = execute_query(base_query, params)

        # Agrupar fotos por visita y por tipo
        visitas_dict = {}
        for row in results:
            id_visita = row[5]
            id_tipo_foto = row[2]
            
            # MAPEO COMPLETO DE TIPOS DE FOTO
            tipo_desc = ""
            categoria = ""
            
            if id_tipo_foto == 1:
                tipo_desc = "Antes"
                categoria = "Gestión"
            elif id_tipo_foto == 2:
                tipo_desc = "Después"
                categoria = "Gestión"
            elif id_tipo_foto == 3:
                tipo_desc = "Precio"
                categoria = "Precio"
            elif id_tipo_foto == 4:
                tipo_desc = "Exhibiciones"
                categoria = "Exhibiciones Adicionales"
            elif id_tipo_foto == 5:
                tipo_desc = "Material POP"
                categoria = "Exhibiciones Adicionales"
            elif id_tipo_foto == 6:
                tipo_desc = "Activación PDV"
                categoria = "PDV"
            elif id_tipo_foto == 7:
                tipo_desc = "Desactivación PDV"
                categoria = "PDV"
            else:
                tipo_desc = f"Tipo {id_tipo_foto}"
                categoria = "Otros"
            
            cleaned_path = row[1].replace("X://", "").replace("X:/", "").replace("\\", "/")
            foto_data = {
                'id_foto': row[0],
                'file_path': cleaned_path,
                'id_tipo_foto': id_tipo_foto,
                'tipo_desc': tipo_desc,
                'categoria': categoria,
                'estado': row[3],
                'fecha': row[4].isoformat() if row[4] else None,
                'id_visita': id_visita,
                'mercaderista': row[6],
                'punto_de_interes': row[7],
                'cliente': row[8]
            }
            
            if id_visita not in visitas_dict:
                visitas_dict[id_visita] = {
                    'id_visita': id_visita,
                    'fecha_visita': row[4].isoformat() if row[4] else None,
                    'mercaderista': row[6],
                    'fotos_por_categoria': {
                        'Gestión': [],
                        'Precio': [],
                        'Exhibiciones Adicionales': [],
                        'PDV': [],
                        'Otros': []
                    }
                }
            
            # Agregar foto a la categoría correspondiente
            if categoria in visitas_dict[id_visita]['fotos_por_categoria']:
                visitas_dict[id_visita]['fotos_por_categoria'][categoria].append(foto_data)
            else:
                visitas_dict[id_visita]['fotos_por_categoria']['Otros'].append(foto_data)
        
        # Calcular totales por visita
        visitas_list = []
        for visita_id, visita_data in visitas_dict.items():
            total_fotos = 0
            for categoria, fotos in visita_data['fotos_por_categoria'].items():
                total_fotos += len(fotos)
            
            visita_data['total_fotos'] = total_fotos
            visitas_list.append(visita_data)
        
        return jsonify(visitas_list)

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/mis-fotos')
@login_required
def client_photos_page():
    if current_user.rol != 'client':
        return redirect(url_for('points.index'))
    return render_template('client_photos.html')
@auth_bp.route('/api/client-all-points')
@login_required
def client_all_points():
    """Devuelve TODOS los puntos asociados al cliente, incluso sin fotos"""
    if current_user.rol != 'client':
        return jsonify({'error': 'No autorizado'}), 403

    cliente_id = current_user.cliente_id
    if not cliente_id:
        return jsonify({'error': 'Cliente no asociado'}), 400

    # Filtros opcionales
    departamento = request.args.get('departamento', '')
    ciudad = request.args.get('ciudad', '')
    fecha_inicio = request.args.get('fecha_inicio', '')
    fecha_fin = request.args.get('fecha_fin', '')

    try:
        base_query = """
            SELECT DISTINCT
                pin.identificador,
                pin.punto_de_interes,
                c.cliente AS clientes,
                ISNULL((
                    SELECT COUNT(ft.id_foto)
                    FROM FOTOS_TOTALES ft
                    JOIN VISITAS_MERCADERISTA vm2 ON ft.id_visita = vm2.id_visita
                    WHERE vm2.identificador_punto_interes = pin.identificador
                    AND vm2.id_cliente = ?
                    AND ft.estado = 'Aprobada'
                ), 0) as total_fotos,
                pin.departamento,
                pin.ciudad
            FROM PUNTOS_INTERES1 pin
            JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes
            JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
            WHERE c.id_cliente = ?
        """

        params = [cliente_id, cliente_id]

        if departamento:
            base_query += " AND pin.departamento = ?"
            params.append(departamento)

        if ciudad:
            base_query += " AND pin.ciudad = ?"
            params.append(ciudad)

        if fecha_inicio:
            base_query += """ AND EXISTS (
                SELECT 1 FROM VISITAS_MERCADERISTA vm3
                WHERE vm3.identificador_punto_interes = pin.identificador
                AND vm3.id_cliente = ?
                AND vm3.fecha_visita >= ?
            )"""
            params.extend([cliente_id, fecha_inicio])

        if fecha_fin:
            base_query += """ AND EXISTS (
                SELECT 1 FROM VISITAS_MERCADERISTA vm4
                WHERE vm4.identificador_punto_interes = pin.identificador
                AND vm4.id_cliente = ?
                AND vm4.fecha_visita <= ?
            )"""
            params.extend([cliente_id, fecha_fin])

        base_query += " ORDER BY pin.punto_de_interes"

        results = execute_query(base_query, params)

        return jsonify([{
            'identificador': row[0],
            'punto_de_interes': row[1],
            'clientes': row[2],
            'total_fotos': row[3],
            'departamento': row[4],
            'ciudad': row[5]
        } for row in results])

    except Exception as e:
        return jsonify({'error': str(e)}), 500
@auth_bp.route('/punto/<string:point_id>')
@login_required
def punto_fotos_page(point_id):
    if current_user.rol != 'client':
        return redirect(url_for('points.index'))
    return render_template('punto_fotos.html', point_id=point_id)
@auth_bp.route('/api/client-regions')
@login_required
def client_regions():
    if current_user.rol != 'client':
        return jsonify({'error': 'No autorizado'}), 403
    cliente_id = current_user.cliente_id
    if not cliente_id:
        return jsonify({'error': 'Cliente no asociado'}), 400

    query = """
        SELECT DISTINCT cuadrante AS region
        FROM RUTAS_NUEVAS
        WHERE id_ruta IN (
            SELECT id_ruta FROM RUTA_PROGRAMACION WHERE id_cliente = ?
        )
    """
    results = execute_query(query, (cliente_id,))
    return jsonify([{'region': row[0]} for row in results if row[0]])


@auth_bp.route('/api/client-points-by-region/<region>')
@login_required
def client_points_by_region(region):
    if current_user.rol != 'client':
        return jsonify({'error': 'No autorizado'}), 403
    cliente_id = current_user.cliente_id
    if not cliente_id:
        return jsonify({'error': 'Cliente no asociado'}), 400

    query = """
        SELECT DISTINCT pin.identificador, pin.punto_de_interes, pin.jerarquia_nivel_2_2 AS cadena
        FROM PUNTOS_INTERES1 pin
        JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes
        JOIN RUTAS_NUEVAS rn ON rp.id_ruta = rn.id_ruta
        WHERE rp.id_cliente = ? AND rn.cuadrante = ?
    """
    results = execute_query(query, (cliente_id, region))
    return jsonify([{'identificador': row[0], 'punto_de_interes': row[1], 'cadena': row[2]} for row in results])
@auth_bp.route('/api/client-chains')
@login_required
def client_chains():
    """Obtener todas las cadenas (jerarquia_nivel_2_2) del cliente"""
    if current_user.rol != 'client':
        return jsonify({'error': 'No autorizado'}), 403

    cliente_id = current_user.cliente_id
    if not cliente_id:
        return jsonify({'error': 'Cliente no asociado'}), 400

    query = """
        SELECT DISTINCT pin.jerarquia_nivel_2_2 AS cadena
        FROM PUNTOS_INTERES1 pin
        JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes
        WHERE rp.id_cliente = ?
        AND pin.jerarquia_nivel_2_2 IS NOT NULL AND pin.jerarquia_nivel_2_2 != ''
    """
    results = execute_query(query, (cliente_id,))
    return jsonify([{'cadena': row[0]} for row in results])

@auth_bp.route('/api/client-points-by-chain/<cadena>')
@login_required
def client_points_by_chain(cadena):
    """Obtener todos los puntos de una cadena específica"""
    if current_user.rol != 'client':
        return jsonify({'error': 'No autorizado'}), 403

    cliente_id = current_user.cliente_id
    if not cliente_id:
        return jsonify({'error': 'Cliente no asociado'}), 400

    query = """
        SELECT DISTINCT pin.identificador, pin.punto_de_interes
        FROM PUNTOS_INTERES1 pin
        JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes
        WHERE rp.id_cliente = ? AND pin.jerarquia_nivel_2_2 = ?
    """
    results = execute_query(query, (cliente_id, cadena))
    return jsonify([{'identificador': row[0], 'punto_de_interes': row[1]} for row in results])
@auth_bp.route('/api/client-chains-by-region/<region>')
@login_required
def client_chains_by_region(region):
    if current_user.rol != 'client':
        return jsonify({'error': 'No autorizado'}), 403

    cliente_id = current_user.cliente_id
    if not cliente_id:
        return jsonify({'error': 'Cliente no asociado'}), 400

    query = """
        SELECT DISTINCT pin.jerarquia_nivel_2_2 AS cadena
        FROM PUNTOS_INTERES1 pin
        JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes
        JOIN RUTAS_NUEVAS rn ON rp.id_ruta = rn.id_ruta
        WHERE rp.id_cliente = ?
          AND rn.cuadrante = ?
          AND pin.jerarquia_nivel_2_2 IS NOT NULL AND pin.jerarquia_nivel_2_2 != ''
    """
    results = execute_query(query, (cliente_id, region))
    return jsonify([{'cadena': row[0]} for row in results])


@auth_bp.route('/api/photo-rejection-reasons', methods=['GET'])
def get_rejection_reasons():
    """Obtener todas las razones de rechazo"""
    try:
        query = "SELECT id_razones_rechazos, razon FROM RAZONES_RECHAZOS"
        results = execute_query(query)
        return jsonify([{'id': row[0], 'razon': row[1]} for row in results])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/reject-photo', methods=['POST'])
@login_required
def reject_photo():
    """Rechazar una foto por el cliente - Versión alternativa"""
    if current_user.rol != 'client':
        return jsonify({'error': 'No autorizado'}), 403

    try:
        data = request.get_json()
        photo_id = data.get('photo_id')
        razones_ids = data.get('razones_ids', [])
        comentario = data.get('comentario', '')

        if not photo_id:
            return jsonify({'error': 'ID de foto requerido'}), 400

        # Obtener información de la foto
        query_foto = """
            SELECT ft.id_visita, ft.file_path 
            FROM FOTOS_TOTALES ft 
            WHERE ft.id_foto = ?
        """
        foto_info = execute_query(query_foto, (photo_id,), fetch_one=True)
        
        if not foto_info:
            return jsonify({'error': 'Foto no encontrada'}), 404

        id_visita = foto_info[0]

        # Usar transacción explícita
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            # Insertar en FOTOS_RECHAZADAS
            query_rechazo = """
                INSERT INTO FOTOS_RECHAZADAS 
                (id_visita, id_foto_original, fecha_registro, fecha_rechazo, descripcion, rechazado_por)
                OUTPUT INSERTED.id_foto_rechazada
                VALUES (?, ?, GETDATE(), GETDATE(), ?, 'cliente')
            """
            
            cursor.execute(query_rechazo, (id_visita, photo_id, comentario))
            rechazo_result = cursor.fetchone()
            
            if not rechazo_result:
                raise Exception("No se pudo obtener el ID del rechazo")
                
            rechazo_id = rechazo_result[0]

            # Insertar razones de rechazo
            for razon_id in razones_ids:
                cursor.execute(
                    "INSERT INTO FOTOS_RECHAZADAS_RAZONES (id_foto_rechazada, id_razones_rechazos) VALUES (?, ?)",
                    (rechazo_id, razon_id)
                )

            # Si hay comentario, guardarlo en el chat
            if comentario:
                cursor.execute(
                    "INSERT INTO CHAT_FOTOS (id_foto, id_usuario, tipo_usuario, mensaje) VALUES (?, ?, 'cliente', ?)",
                    (photo_id, current_user.id, comentario)
                )

            conn.commit()
            
            return jsonify({
                'success': True, 
                'message': 'Foto rechazada correctamente',
                'rechazo_id': rechazo_id
            })

        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        current_app.logger.error(f"Error en reject-photo: {str(e)}", exc_info=True)
        return jsonify({'error': f'Error al rechazar la foto: {str(e)}'}), 500

@auth_bp.route('/api/photo-chat/<int:photo_id>', methods=['GET'])
@login_required
def get_photo_chat(photo_id):
    """Obtener historial del chat de una foto"""
    try:
        query = """
            SELECT cf.id_chat, cf.id_usuario, cf.tipo_usuario, cf.mensaje, cf.fecha_mensaje,
                   u.username, c.cliente
            FROM CHAT_FOTOS cf
            LEFT JOIN USUARIOS u ON cf.id_usuario = u.id
            LEFT JOIN CLIENTES c ON u.cliente_id = c.id_cliente
            WHERE cf.id_foto = ?
            ORDER BY cf.fecha_mensaje ASC
        """
        results = execute_query(query, (photo_id,))
        
        mensajes = []
        for row in results:
            mensajes.append({
                'id_chat': row[0],
                'id_usuario': row[1],
                'tipo_usuario': row[2],
                'mensaje': row[3],
                'fecha_mensaje': row[4].isoformat() if row[4] else None,
                'username': row[5] if row[2] != 'cliente' else row[6],
                'es_cliente': row[2] == 'cliente'
            })
        
        return jsonify(mensajes)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/send-chat-message', methods=['POST'])
@login_required
def send_chat_message():
    """Enviar mensaje en el chat de una foto"""
    try:
        data = request.get_json()
        photo_id = data.get('photo_id')
        mensaje = data.get('mensaje')
        
        tipo_usuario = 'cliente' if current_user.rol == 'client' else 'analista'
        
        query = """
            INSERT INTO CHAT_FOTOS (id_foto, id_usuario, tipo_usuario, mensaje)
            VALUES (?, ?, ?, ?)
        """
        execute_query(query, (photo_id, current_user.id, tipo_usuario, mensaje))
        
        return jsonify({'success': True, 'message': 'Mensaje enviado'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/photo-details/<int:photo_id>')
@login_required
def photo_details(photo_id):
    """Obtener detalles completos de una foto"""
    try:
        query = """
            SELECT 
                ft.id_foto,
                ft.file_path,
                ft.id_tipo_foto,
                ft.estado,
                vm.fecha_visita,
                m.nombre as mercaderista,
                pin.punto_de_interes,
                c.cliente,
                pin.identificador,
                vm.id_visita
            FROM FOTOS_TOTALES ft
            JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
            JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
            JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
            JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
            WHERE ft.id_foto = ?
        """
        result = execute_query(query, (photo_id,), fetch_one=True)
        
        if not result:
            return jsonify({'error': 'Foto no encontrada'}), 404
            
        return jsonify({
            'id_foto': result[0],
            'file_path': result[1],
            'tipo': 'antes' if result[2] == 1 else 'despues',
            'estado': result[3],
            'fecha': result[4].isoformat() if result[4] else None,
            'mercaderista': result[5],
            'punto_de_interes': result[6],
            'cliente': result[7],
            'identificador_punto': result[8],
            'id_visita': result[9]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500