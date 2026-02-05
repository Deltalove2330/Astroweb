# app/routes/auth.py
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, current_app, session
from flask_login import login_user, logout_user, current_user, login_required
from app.models.user import User
from app.utils.auth import verify_password, get_user_by_username
from app.utils.database import execute_query, get_db_connection
from datetime import datetime, timedelta
from functools import wraps
import requests
import time
import bcrypt

auth_bp = Blueprint('auth', __name__)

# ===================================================================
# FUNCIONES HELPER PARA WEBSOCKET
# ===================================================================


def mapear_tipo_foto(id_tipo_foto):
    """Mapea ID de tipo de foto a nombre descriptivo"""
    if not id_tipo_foto:
        return 'Desconocido'
    
    if id_tipo_foto == 1:
        return 'Gestion - Antes'
    elif id_tipo_foto == 2:
        return 'Gestion - Despues'
    elif id_tipo_foto == 3:
        return 'Precio'
    elif id_tipo_foto == 4:
        return 'Exhibiciones'
    else:
        return 'Desconocido'



def get_notifications_for_user(user, leido=None, limit=10):
    """Obtiene notificaciones para un usuario con filtros por rol Y cliente"""
    try:
        query = """
        SELECT 
            n.id_notificacion, n.id_foto_rechazada, n.id_foto_original,
            n.id_visita, n.id_cliente, n.nombre_cliente, n.punto_venta,
            n.rechazado_por, n.fecha_rechazo, n.fecha_notificacion,
            n.leido, n.descripcion, ft.id_tipo_foto
        FROM NOTIFICACIONES_RECHAZO_FOTOS n WITH (NOLOCK)
        LEFT JOIN FOTOS_TOTALES ft WITH (NOLOCK) ON n.id_foto_original = ft.id_foto
        WHERE 1=1
        """
        
        params = []
        
        # ✅ FILTRO POR ROL Y CLIENTE
        if user.rol == 'client':
            query += " AND n.rechazado_por = ?"
            params.append('cliente')
            
            # ✅ USAR cliente_id del modelo
            if user.cliente_id:
                query += " AND n.id_cliente = ?"
                params.append(user.cliente_id)
                print(f"🔍 Filtrando para cliente ID: {user.cliente_id}")
        
        if leido is not None:
            query += " AND n.leido = ?"
            params.append(leido)
        
        query += " ORDER BY n.fecha_notificacion DESC"
        
        if limit:
            query += f" OFFSET 0 ROWS FETCH NEXT {limit} ROWS ONLY"
        
        if params:
            notificaciones = execute_query(query, tuple(params))
        else:
            notificaciones = execute_query(query)
        
        # Query count
        query_count = "SELECT COUNT(*) FROM NOTIFICACIONES_RECHAZO_FOTOS WITH (NOLOCK) WHERE leido = ?"
        count_params = [0]
        
        if user.rol == 'client':
            query_count += " AND rechazado_por = ?"
            count_params.append('cliente')
            
            if user.cliente_id:
                query_count += " AND id_cliente = ?"
                count_params.append(user.cliente_id)
        
        if count_params:
            count_result = execute_query(query_count, tuple(count_params), fetch_one=True)
        else:
            count_result = execute_query(query_count, fetch_one=True)
        no_leidas = count_result[0] if count_result else 0
        
        result = []
        if notificaciones:
            for row in notificaciones:
                result.append({
                    'id_notificacion': row[0],   
                    'id_foto_rechazada': row[1],
                    'id_foto_original': row[2],
                    'id_visita': row[3],
                    'id_cliente': row[4],
                    'nombre_cliente': row[5],
                    'punto_venta': row[6],
                    'rechazado_por': row[7],
                    'fecha_rechazo': row[8].strftime('%Y-%m-%d %H:%M:%S') if row[8] else None,
                    'fecha_notificacion': row[9].strftime('%Y-%m-%d %H:%M:%S') if row[9] else None,
                    'leido': row[10],
                    'descripcion': row[11],
                    'tipo_foto': mapear_tipo_foto(row[12])
                })
        
        return {
            'notificaciones': result,
            'no_leidas': no_leidas
        }
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        return {'notificaciones': [], 'no_leidas': 0}

def mark_notification_as_read_internal(notification_id):
    """Marcar notificación como leída (función interna para WebSocket)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE NOTIFICACIONES_RECHAZO_FOTOS 
            SET leido = 1 
            WHERE id_notificacion = ?
        """, (notification_id,))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        current_app.logger.info(f"✅ Notificación {notification_id} marcada como leída")
        return True
        
    except Exception as e:
        current_app.logger.error(f"Error mark_notification_as_read_internal: {str(e)}")
        return False



def emit_new_notification(notification_data):
    """Emite una nueva notificación a través de WebSocket a TODOS los usuarios conectados"""
    try:
        from app import socketio
        
        if not socketio:
            print("⚠️ SocketIO no disponible")
            return
        
        print(f"📡 Emitiendo notificación WebSocket - ID: {notification_data.get('id_notificacion')}")
        print(f"   Rechazado por: {notification_data.get('rechazado_por')}")
        print(f"   Tipo: {notification_data.get('tipo_foto')}")
        print(f"   Cliente ID: {notification_data.get('id_cliente')}")
        
        socketio.emit(
            'new_notification',
            {'notification': notification_data},
            namespace='/'
        )
        
        print(f"✅ Notificación emitida exitosamente")
        
    except Exception as e:
        print(f"❌ Error emitiendo notificación WebSocket: {e}")
        import traceback
        traceback.print_exc()

def enviar_notificacion_telegram(rechazo_info):
    """Envía notificación de rechazo de foto a Telegram"""
    try:
        TELEGRAM_BOT_TOKEN = "8584965689:AAFXhMaVtGG6Mvy5UpJGAt8URxbi6XnIXAI"
        TELEGRAM_API_URL = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage"
        CHAT_ID = "5024717873"
        
        fecha_rechazo = rechazo_info.get('fecha_rechazo', '')
        try:
            if isinstance(fecha_rechazo, str):
                fecha_obj = datetime.strptime(fecha_rechazo, '%Y-%m-%d %H:%M:%S')
                fecha_formateada = fecha_obj.strftime('%d/%m/%Y a las %H:%M')
            else:
                fecha_formateada = fecha_rechazo.strftime('%d/%m/%Y a las %H:%M')
        except:
            fecha_formateada = str(fecha_rechazo)
        
        tipo_foto = rechazo_info.get('tipo_foto', 'Desconocido')
        tipo_icon = '📸'
        
        if tipo_foto == 'Gestion - Antes':
            tipo_icon = '🔄'
        elif tipo_foto == 'Gestion - Despues':
            tipo_icon = '🔄'
        elif tipo_foto == 'Precio':
            tipo_icon = '💰'
        elif tipo_foto == 'Exhibiciones':
            tipo_icon = '🖼️'
        elif tipo_foto == 'PDV':
            tipo_icon = '🏪'
        
        mensaje = """🚨 <b>RECHAZO DE FOTO DETECTADO</b> 🚨

Se ha detectado un rechazo de fotos por un <b>{rechazado_por}</b>

{tipo_icon} <b>Tipo:</b> {tipo_foto}

📋 <b>Detalles:</b>
- Foto ID: <code>{id_foto}</code>
- Visita ID: <code>{id_visita}</code>
- Cliente: <b>{cliente}</b>
- Punto de Venta: <b>{punto_venta}</b>
- Fecha: {fecha}
""".format(
            rechazado_por=rechazo_info.get('rechazado_por', 'Desconocido'),
            tipo_icon=tipo_icon,
            tipo_foto=tipo_foto,
            id_foto=rechazo_info.get('id_foto', 'N/A'),
            id_visita=rechazo_info.get('id_visita', 'N/A'),
            cliente=rechazo_info.get('cliente', 'Desconocido'),
            punto_venta=rechazo_info.get('punto_venta', 'Desconocido'),
            fecha=fecha_formateada
        )
        
        comentario = rechazo_info.get('comentario', '').strip()
        if comentario:
            mensaje += "\n💬 <b>Comentario:</b>\n" + comentario
        
        payload = {
            "chat_id": CHAT_ID,
            "text": mensaje,
            "parse_mode": "HTML"
        }
        
        # ✅ TIMEOUT CORTO (3 segundos)
        response = requests.post(TELEGRAM_API_URL, json=payload, timeout=3)
        return response.status_code == 200
        
    except requests.exceptions.Timeout:
        print("⏱️ Telegram timeout (3s)")
        return False
    except Exception as e:
        print(f"Error al enviar notificación Telegram: {str(e)}")
        return False


@auth_bp.route('/api/current-user', methods=['GET'])
@login_required
def get_current_user():
    """Obtiene los datos del usuario actual para el chat"""
    try:
        return jsonify({
            'success': True,
            'username': current_user.username,
            'cliente_id': current_user.cliente_id,
            'id_usuario': current_user.id,
            'rol': getattr(current_user, 'rol', None)
        })
    except Exception as e:
        print(f"❌ Error en get_current_user: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@auth_bp.route('/api/notificaciones-rechazo', methods=['GET'])
@login_required
def obtener_notificaciones_rechazo():
    """Obtener notificaciones de fotos rechazadas"""
    try:
        leido_param = request.args.get('leido', type=int)
        limit = request.args.get('limit', 50, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Query base
        query = """
            SELECT 
                n.id_notificacion,
                n.id_foto_rechazada,
                n.id_visita,
                n.id_cliente,
                n.nombre_cliente,
                n.punto_venta,
                n.rechazado_por,
                n.fecha_rechazo,
                n.fecha_notificacion,
                CAST(n.leido AS INT) as leido,
                n.descripcion,
                n.id_foto_original
            FROM NOTIFICACIONES_RECHAZO_FOTOS n WITH (NOLOCK)
            WHERE 1=1
        """
        
        params = []
        
        # Filtrar por rol y cliente
        if current_user.rol == 'client':
            query += " AND n.rechazado_por = ?"
            params.append('cliente')
            
            if current_user.cliente_id:
                query += " AND n.id_cliente = ?"
                params.append(current_user.cliente_id)
        
        # Agregar filtro de leido solo si se especifica
        if leido_param is not None:
            query += " AND n.leido = ?"
            params.append(leido_param)
        
        query += " ORDER BY n.fecha_notificacion DESC"
        query += f" OFFSET {offset} ROWS FETCH NEXT {limit} ROWS ONLY"
        
        # Ejecutar query
        if params:
            resultados = execute_query(query, tuple(params))
        else:
            resultados = execute_query(query)
        
        # Query para conteo
        query_count = """
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN leido = 0 THEN 1 ELSE 0 END) as no_leidas
            FROM NOTIFICACIONES_RECHAZO_FOTOS WITH (NOLOCK)
            WHERE 1=1
        """
        count_params = []
        
        if current_user.rol == 'client':
            query_count += " AND rechazado_por = ?"
            count_params.append('cliente')
            
            if current_user.cliente_id:
                query_count += " AND id_cliente = ?"
                count_params.append(current_user.cliente_id)
        
        if count_params:
            conteo = execute_query(query_count, tuple(count_params), fetch_one=True)
        else:
            conteo = execute_query(query_count, fetch_one=True)
        
        notificaciones = []
        if resultados:
            for row in resultados:
                notificaciones.append({
                    'id_notificacion': row[0],
                    'id_foto_rechazada': row[1],
                    'id_visita': row[2],
                    'id_cliente': row[3],
                    'nombre_cliente': row[4],
                    'punto_venta': row[5],
                    'rechazado_por': row[6],
                    'fecha_rechazo': row[7].strftime('%Y-%m-%d %H:%M:%S') if row[7] else None,
                    'fecha_notificacion': row[8].strftime('%Y-%m-%d %H:%M:%S') if row[8] else None,
                    'leido': int(row[9]),
                    'descripcion': row[10],
                    'id_foto_original': row[11]
                })
        
        current_app.logger.info(f"📬 Devolviendo {len(notificaciones)} notificaciones")
        
        return jsonify({
            'success': True,
            'notificaciones': notificaciones,
            'total': conteo[0] if conteo else 0,
            'no_leidas': conteo[1] if conteo and conteo[1] else 0
        })
        
    except Exception as e:
        current_app.logger.error(f"❌ Error: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e),
            'notificaciones': [],
            'total': 0,
            'no_leidas': 0
        }), 500


# ===================================================================
# FIN DE FUNCIONES HELPER
# ===================================================================

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Validación básica
        if not username or not password:
            error_msg = 'Usuario y contraseña requeridos'
            if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return jsonify({'error': error_msg, 'success': False}), 400
            flash(error_msg, 'danger')
            return render_template('login.html')
        
        # Depuración detallada
        current_app.logger.info(f"Intento de login para usuario: {username}")
        
        try:
            if verify_password(username, password):
                user = get_user_by_username(username)
                if user:
                    login_user(user)
                    current_app.logger.info(f"✅ Login exitoso para {username}, rol: {user.rol}")
                    
                    # Respuesta para AJAX
                    if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                        current_app.logger.info("Petición AJAX, devolviendo JSON de redirección")
                        redirect_url = get_redirect_url_by_role(user.rol)
                        return jsonify({
                            'success': True,
                            'redirect': redirect_url,
                            'rol': user.rol,
                            'username': user.username
                        })
                    
                    # Redirección tradicional
                    current_app.logger.info(f"Redirigiendo {username} a su dashboard")
                    return redirect(get_redirect_url_by_role(user.rol))
                else:
                    error_msg = 'Usuario no encontrado en el sistema'
                    current_app.logger.warning(f"⚠️ {error_msg} para {username}")
            else:
                error_msg = 'Usuario o contraseña incorrectos'
                current_app.logger.warning(f"❌ {error_msg} para {username}")
        except Exception as e:
            error_msg = f'Error interno del servidor: {str(e)}'
            current_app.logger.error(f"❌ Error crítico en login: {str(e)}", exc_info=True)
        
        # Manejo de errores
        if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            current_app.logger.info("Devolviendo error JSON para AJAX")
            return jsonify({'error': error_msg, 'success': False}), 401
        
        flash(error_msg, 'danger')
        return render_template('login.html')
    
    return render_template('login.html')


def get_redirect_url_by_role(role):
    """Obtener URL de redirección según rol de usuario - CORREGIDO"""
    if role == 'client':
        return url_for('auth.client_photos_page')
    elif role == 'supervisor':
        return url_for('supervisors.supervisor_dashboard')
    elif role == 'mercaderista':
        # ✅ USAR SESSION en lugar de current_user.mercaderista_tipo (más confiable)
        mercaderista_tipo = session.get('merchandiser_tipo', 'Mercaderista')
        if mercaderista_tipo == 'Auditor':
            return url_for('auth.dashboard_auditor')
        else:
            return url_for('auth.dashboard_mercaderista')
    else:
        return url_for('points.index')


@auth_bp.route('/logout')
def logout():
    """Logout para todos los usuarios - maneja redirección según rol"""
    # Guardar el rol antes de hacer logout
    user_role = current_user.rol if current_user.is_authenticated else None
    
    # Limpiar sesión específica de mercaderista
    session.pop('merchandiser_cedula', None)
    session.pop('merchandiser_authenticated', None)
    session.pop('merchandiser_nombre', None)
    session.modified = True
    
    # Hacer logout de Flask-Login
    logout_user()
    
    # Redirigir según el tipo de usuario
    if user_role == 'mercaderista':
        return redirect(url_for('auth.login_mercaderista'))
    else:
        return redirect(url_for('auth.login'))


@auth_bp.route('/api/current-user')
@login_required
def current_user_info():
    """Devuelve información del usuario actual"""
    user_data = {
        'id': current_user.id,
        'username': current_user.username,
        'rol': current_user.rol,
        'id_rol': current_user.id_rol if hasattr(current_user, 'id_rol') else None,
        'cliente_id': current_user.cliente_id if hasattr(current_user, 'cliente_id') else None,
        'cliente_nombre': None
    }
    
    # Si es cliente, obtener nombre del cliente
    if current_user.cliente_id:
        result = execute_query(
            "SELECT cliente FROM CLIENTES WHERE id_cliente = ?",
            (current_user.cliente_id,),
            fetch_one=True
        )
        if result:
            user_data['cliente_nombre'] = result[0]
    
    return jsonify(user_data)


@auth_bp.route('/login-mercaderista')
def login_mercaderista():
    return render_template('login-mercaderista.html')

@auth_bp.route('/carga-mercaderista')
def carga_mercaderista():
    return render_template('carga-mercaderista.html')


@auth_bp.route('/api/verify-merchandiser', methods=['POST'])
def verify_merchandiser():
    """Verificar y autenticar mercaderista por cédula"""
    try:
        data = request.get_json()
        cedula = data.get('cedula')
        
        if not cedula:
            return jsonify({
                "success": False,
                "message": "Cédula requerida"
            }), 400
        
        # Importar la función desde utils.auth
        from app.utils.auth import get_merchandiser_by_cedula
        
        result = get_merchandiser_by_cedula(cedula)
        
        if result:
            # Crear objeto User para el mercaderista
            user = User(
                id=f"mercaderista_{result[0]}",  # ID único con prefijo
                username=result[1],  # cedula
                rol='mercaderista',
                mercaderista_id=result[0],
                mercaderista_nombre=result[2],
                mercaderista_tipo=result[3]  # NUEVO: guardar el tipo
            )
            
            # Loguear al mercaderista con Flask-Login
            login_user(user)
            
            # También mantener la sesión antigua para compatibilidad
            session['merchandiser_cedula'] = cedula
            session['merchandiser_authenticated'] = True
            session['merchandiser_nombre'] = result[2]
            session['merchandiser_tipo'] = result[3]  # NUEVO: guardar tipo en sesión
            session.modified = True
            
            current_app.logger.info(f"✅ Mercaderista autenticado: {result[2]} (Cédula: {cedula}, Tipo: {result[3]})")
            
            return jsonify({
                "success": True,
                "nombre": result[2],
                "cedula": result[1],
                "tipo": result[3]  # NUEVO: incluir tipo en respuesta
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


# app/routes/auth.py - Modificar endpoint client_photos
@auth_bp.route('/api/client-photos')
@login_required
def client_photos():
    """Obtener TODAS las fotos según rol del usuario"""
    # ✅ PERMITIR ACCESO A CLIENTES Y COORDINADORES EXCLUSIVOS
    if current_user.rol != 'client' and not current_user.is_coordinador_exclusivo():
        return jsonify({'error': 'No autorizado'}), 403
    
    try:
        # ✅ SI ES COORDINADOR EXCLUSIVO, OBTENER TODOS LOS CLIENTES EXCLUSIVOS
        if current_user.is_coordinador_exclusivo():
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
            WHERE c.id_tipo_cliente = 3  -- ✅ SOLO CLIENTES EXCLUSIVOS
            GROUP BY pin.identificador, pin.punto_de_interes, c.cliente, pin.departamento, pin.ciudad
            """
            results = execute_query(query)
        else:
            # Cliente normal - solo sus fotos
            cliente_id = current_user.cliente_id
            if not cliente_id:
                return jsonify({'error': 'Cliente no asociado'}), 400
            
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

# app/routes/auth.py - Modificar client_point_photos
@auth_bp.route('/api/client-point-photos/<string:point_id>')
@login_required
def client_point_photos(point_id):
    # ✅ PERMITIR ACCESO A CLIENTES Y COORDINADORES EXCLUSIVOS
    if current_user.rol != 'client' and not current_user.is_coordinador_exclusivo():
        return jsonify({'error': 'No autorizado'}), 403
    
    fecha_inicio = request.args.get('fecha_inicio', '')
    fecha_fin = request.args.get('fecha_fin', '')
    prioridad = request.args.get('prioridad', '').lower()
    id_visita = request.args.get('id_visita', '')
    
    try:
        # ✅ SI ES COORDINADOR EXCLUSIVO, NO FILTRAR POR CLIENTE ESPECÍFICO
        if current_user.is_coordinador_exclusivo():
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
            WHERE pin.identificador = ?
            AND c.id_tipo_cliente = 3  -- ✅ SOLO CLIENTES EXCLUSIVOS
            """
            params = [point_id]
        else:
            # Cliente normal
            cliente_id = current_user.cliente_id
            if not cliente_id:
                return jsonify({'error': 'Cliente no asociado'}), 400
            
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
            
            cleaned_path = row[1].replace("X://", "").replace("X:/", "").replace("\\", "/")
            if cleaned_path.startswith("/"):
                cleaned_path = cleaned_path[1:]
            
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
                        'Otros': []
                    }
                }
            
            if categoria in visitas_dict[id_visita]['fotos_por_categoria']:
                visitas_dict[id_visita]['fotos_por_categoria'][categoria].append(foto_data)
            else:
                visitas_dict[id_visita]['fotos_por_categoria']['Otros'].append(foto_data)
        
        visitas_list = []
        for visita_id, visita_data in visitas_dict.items():
            total_fotos = 0
            for categoria, fotos in visita_data['fotos_por_categoria'].items():
                total_fotos += len(fotos)
            visita_data['total_fotos'] = total_fotos
            visitas_list.append(visita_data)
        
        return jsonify(visitas_list)
    except Exception as e:
        current_app.logger.error(f"❌ Error: {e}", exc_info=True)
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

# app/routes/auth.py - Modificar endpoint client_regions
@auth_bp.route('/api/client-regions')
@login_required
def client_regions():
    """Obtener regiones según el rol del usuario y filtro de cliente"""
    # ✅ PERMITIR CLIENTES Y COORDINADORES EXCLUSIVOS
    if current_user.rol != 'client' and not current_user.is_coordinador_exclusivo():
        return jsonify({'error': 'No autorizado'}), 403
    
    # ✅ NUEVO: Obtener cliente_id del query string para coordinadores
    cliente_id_filtro = request.args.get('cliente_id', type=int)
    
    try:
        if current_user.is_coordinador_exclusivo():
            # ✅ Si es coordinador y tiene filtro de cliente, usar ese cliente
            if cliente_id_filtro:
                query = """
                SELECT DISTINCT rn.cuadrante AS region
                FROM RUTAS_NUEVAS rn
                INNER JOIN RUTA_PROGRAMACION rp ON rn.id_ruta = rp.id_ruta
                WHERE rp.id_cliente = ?
                AND rn.cuadrante IS NOT NULL
                AND rn.cuadrante != ''
                ORDER BY rn.cuadrante
                """
                results = execute_query(query, (cliente_id_filtro,))
            else:
                # ✅ Si no hay filtro, devolver vacío (primero debe seleccionar cliente)
                return jsonify([])
        else:
            # Cliente normal - solo sus regiones
            cliente_id = current_user.cliente_id
            if not cliente_id:
                return jsonify({'error': 'Cliente no asociado'}), 400
            
            query = """
            SELECT DISTINCT rn.cuadrante AS region
            FROM RUTAS_NUEVAS rn
            INNER JOIN RUTA_PROGRAMACION rp ON rn.id_ruta = rp.id_ruta
            WHERE rp.id_cliente = ?
            AND rn.cuadrante IS NOT NULL
            AND rn.cuadrante != ''
            ORDER BY rn.cuadrante
            """
            results = execute_query(query, (cliente_id,))
        
        if not results or len(results) == 0:
            print(f"⚠️ No se encontraron regiones")
            return jsonify([])
        
        return jsonify([{'region': row[0]} for row in results if row[0]])
    except Exception as e:
        current_app.logger.error(f"Error en client_regions: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

# app/routes/auth.py - Reemplazar el endpoint client_points_by_region
# app/routes/auth.py - Modificar endpoint client_points_by_region
@auth_bp.route('/api/client-points-by-region/<region>')
@login_required
def client_points_by_region(region):
    """Obtener puntos de una región según el rol del usuario y filtro de cliente"""
    if current_user.rol != 'client' and not current_user.is_coordinador_exclusivo():
        return jsonify({'error': 'No autorizado'}), 403
    
    # ✅ NUEVO: Obtener cliente_id del query string para coordinadores
    cliente_id_filtro = request.args.get('cliente_id', type=int)
    
    try:
        if current_user.is_coordinador_exclusivo():
            # ✅ Si es coordinador y tiene filtro de cliente, usar ese cliente
            if cliente_id_filtro:
                query = """
                SELECT DISTINCT pin.identificador, pin.punto_de_interes, pin.jerarquia_nivel_2_2 AS cadena
                FROM PUNTOS_INTERES1 pin
                INNER JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes
                INNER JOIN RUTAS_NUEVAS rn ON rp.id_ruta = rn.id_ruta
                WHERE rp.id_cliente = ?
                AND rn.cuadrante = ?
                ORDER BY pin.punto_de_interes
                """
                results = execute_query(query, (cliente_id_filtro, region))
            else:
                return jsonify([])
        else:
            # Cliente normal
            cliente_id = current_user.cliente_id
            if not cliente_id:
                return jsonify({'error': 'Cliente no asociado'}), 400
            
            query = """
            SELECT DISTINCT pin.identificador, pin.punto_de_interes, pin.jerarquia_nivel_2_2 AS cadena
            FROM PUNTOS_INTERES1 pin
            INNER JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes
            INNER JOIN RUTAS_NUEVAS rn ON rp.id_ruta = rn.id_ruta
            WHERE rp.id_cliente = ?
            AND rn.cuadrante = ?
            ORDER BY pin.punto_de_interes
            """
            results = execute_query(query, (cliente_id, region))
        
        if not results:
            print(f"⚠️ No se encontraron puntos para región {region}")
            return jsonify([])
        
        return jsonify([
            {
                'identificador': row[0],
                'punto_de_interes': row[1],
                'cadena': row[2] if row[2] else 'Sin cadena'
            } 
            for row in results
        ])
    except Exception as e:
        current_app.logger.error(f"Error en client_points_by_region: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

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

# app/routes/auth.py - Modificar endpoint client_chains_by_region
@auth_bp.route('/api/client-chains-by-region/<region>')
@login_required
def client_chains_by_region(region):
    """Obtener cadenas de una región según el rol del usuario y filtro de cliente"""
    if current_user.rol != 'client' and not current_user.is_coordinador_exclusivo():
        return jsonify({'error': 'No autorizado'}), 403
    
    # ✅ NUEVO: Obtener cliente_id del query string para coordinadores
    cliente_id_filtro = request.args.get('cliente_id', type=int)
    
    try:
        if current_user.is_coordinador_exclusivo():
            # ✅ Si es coordinador y tiene filtro de cliente, usar ese cliente
            if cliente_id_filtro:
                query = """
                SELECT DISTINCT pin.jerarquia_nivel_2_2 AS cadena
                FROM PUNTOS_INTERES1 pin
                INNER JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes
                INNER JOIN RUTAS_NUEVAS rn ON rp.id_ruta = rn.id_ruta
                WHERE rp.id_cliente = ?
                AND rn.cuadrante = ?
                AND pin.jerarquia_nivel_2_2 IS NOT NULL
                AND pin.jerarquia_nivel_2_2 != ''
                ORDER BY pin.jerarquia_nivel_2_2
                """
                results = execute_query(query, (cliente_id_filtro, region))
            else:
                return jsonify([])
        else:
            # Cliente normal
            cliente_id = current_user.cliente_id
            if not cliente_id:
                return jsonify({'error': 'Cliente no asociado'}), 400
            
            query = """
            SELECT DISTINCT pin.jerarquia_nivel_2_2 AS cadena
            FROM PUNTOS_INTERES1 pin
            INNER JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes
            INNER JOIN RUTAS_NUEVAS rn ON rp.id_ruta = rn.id_ruta
            WHERE rp.id_cliente = ?
            AND rn.cuadrante = ?
            AND pin.jerarquia_nivel_2_2 IS NOT NULL
            AND pin.jerarquia_nivel_2_2 != ''
            ORDER BY pin.jerarquia_nivel_2_2
            """
            results = execute_query(query, (cliente_id, region))
        
        if not results:
            print(f"⚠️ No se encontraron cadenas para región {region}")
            return jsonify([])
        
        return jsonify([{'cadena': row[0]} for row in results])
    except Exception as e:
        current_app.logger.error(f"Error en client_chains_by_region: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

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
    """Rechazar una foto por el cliente - Con notificaciones WebSocket y Chat"""
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
            SELECT ft.id_visita, ft.file_path, ft.id_tipo_foto,
                   vm.id_cliente, vm.identificador_punto_interes,
                   c.cliente, p.punto_de_interes
            FROM FOTOS_TOTALES ft 
            INNER JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
            LEFT JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
            LEFT JOIN PUNTOS_INTERES1 p ON vm.identificador_punto_interes = p.identificador
            WHERE ft.id_foto = ?
        """
        foto_info = execute_query(query_foto, (photo_id,), fetch_one=True)
        
        if not foto_info:
            return jsonify({'error': 'Foto no encontrada'}), 404

        id_visita = foto_info[0]
        id_tipo_foto = foto_info[2]
        id_cliente = foto_info[3]
        nombre_cliente = foto_info[5] if foto_info[5] else "Desconocido"
        punto_venta = foto_info[6] if foto_info[6] else "Desconocido"
        id_foto_original = photo_id

        # ═══════════════════════════════════════════════════════════════
        # MAPEO DE TIPOS DE FOTO
        # ═══════════════════════════════════════════════════════════════
        tipo_foto = 'Desconocido'
        if id_tipo_foto == 1:
            tipo_foto = 'Gestion - Antes'
        elif id_tipo_foto == 2:
            tipo_foto = 'Gestion - Despues'
        elif id_tipo_foto == 3:
            tipo_foto = 'Precio'
        elif id_tipo_foto == 4:
            tipo_foto = 'Exhibiciones'
        elif id_tipo_foto == 5:
            tipo_foto = 'Material POP'
        elif id_tipo_foto == 6:
            tipo_foto = 'Activacion PDV'
        elif id_tipo_foto == 7:
            tipo_foto = 'Desactivacion PDV'
        else:
            tipo_foto = f'Tipo {id_tipo_foto}'

        # Iniciar transacción
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Capturar la APP real antes del thread
        app = current_app._get_current_object()
        
        try:
            # ═══════════════════════════════════════════════════════════════
            # 1. OBTENER NOMBRES DE RAZONES PRIMERO
            # *** TABLA CORRECTA: RAZONES_RECHAZOS ***
            # *** COLUMNA CORRECTA: id_razones_rechazos ***
            # ═══════════════════════════════════════════════════════════════
            razones_nombres = []
            if razones_ids and len(razones_ids) > 0:
                try:
                    # Convertir a lista si no lo es
                    if not isinstance(razones_ids, list):
                        razones_ids = [razones_ids]
                    
                    # Crear placeholders para la consulta
                    placeholders = ','.join(['?' for _ in razones_ids])
                    
                    # *** CONSULTA CORREGIDA ***
                    query_razones = f"SELECT razon FROM RAZONES_RECHAZOS WHERE id_razones_rechazos IN ({placeholders})"
                    
                    print(f"🔍 Consultando razones: {query_razones}")
                    print(f"🔍 Con IDs: {razones_ids}")
                    
                    cursor.execute(query_razones, razones_ids)
                    razones_rows = cursor.fetchall()
                    
                    if razones_rows:
                        razones_nombres = [row[0] for row in razones_rows if row[0]]
                        print(f"✅ Razones encontradas: {razones_nombres}")
                    else:
                        print(f"⚠️ No se encontraron razones para IDs: {razones_ids}")
                        
                except Exception as e:
                    print(f"❌ Error obteniendo nombres de razones: {e}")
                    import traceback
                    traceback.print_exc()

            # ═══════════════════════════════════════════════════════════════
            # 2. Insertar en FOTOS_RECHAZADAS
            # ═══════════════════════════════════════════════════════════════
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
            print(f"✅ Rechazo insertado - ID: {rechazo_id}")

            # ═══════════════════════════════════════════════════════════════
            # 3. Insertar razones de rechazo en tabla de relación
            # ═══════════════════════════════════════════════════════════════
            for razon_id in razones_ids:
                cursor.execute(
                    "INSERT INTO FOTOS_RECHAZADAS_RAZONES (id_foto_rechazada, id_razones_rechazos) VALUES (?, ?)",
                    (rechazo_id, razon_id)
                )

            # ═══════════════════════════════════════════════════════════════
            # 4. Insertar notificación
            # ═══════════════════════════════════════════════════════════════
            query_notificacion = """
                INSERT INTO NOTIFICACIONES_RECHAZO_FOTOS 
                (id_foto_rechazada, id_visita, id_cliente, nombre_cliente, 
                 punto_venta, rechazado_por, fecha_rechazo, fecha_notificacion, 
                 leido, descripcion, id_foto_original)
                OUTPUT INSERTED.id_notificacion
                VALUES (?, ?, ?, ?, ?, 'cliente', GETDATE(), GETDATE(), 0, ?, ?)
            """
            
            cursor.execute(query_notificacion, 
                          (rechazo_id, id_visita, id_cliente, nombre_cliente, 
                           punto_venta, comentario, id_foto_original))
            
            notif_result = cursor.fetchone()
            notificacion_id = notif_result[0] if notif_result else rechazo_id

            # Commit ANTES de WebSocket/Telegram
            conn.commit()
            
            print(f"✅ Rechazo creado completamente - ID: {rechazo_id}")

            # ═══════════════════════════════════════════════════════════════
            # EMITIR VÍA WEBSOCKET - NOTIFICACIÓN
            # ═══════════════════════════════════════════════════════════════
            notification_data = {
                'id_notificacion': notificacion_id,
                'id_foto_rechazada': rechazo_id,
                'id_foto_original': id_foto_original,
                'id_visita': id_visita,
                'id_cliente': id_cliente,
                'nombre_cliente': nombre_cliente,
                'punto_venta': punto_venta,
                'rechazado_por': 'cliente',
                'fecha_rechazo': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'fecha_notificacion': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'leido': 0,
                'descripcion': comentario,
                'tipo_foto': tipo_foto
            }
            
            emit_new_notification(notification_data)
            print(f"📡 WebSocket notificación emitida - Rechazo #{rechazo_id}")

            # ═══════════════════════════════════════════════════════════════
            # EMITIR MENSAJE DE SISTEMA AL CHAT CLIENTE
            # ═══════════════════════════════════════════════════════════════
            try:
                from app.socket_chat_cliente import emit_system_message_cliente
                from app import socketio
                import json
                
                # Fecha actual formateada
                fecha_rechazo_str = datetime.now().strftime('%Y-%m-%d')
                
                # Usuario que rechaza
                rechazado_por = current_user.username if current_user else 'Cliente'
                
                # ═══════════════════════════════════════════════════════════
                # CONSTRUIR RAZÓN COMPLETA
                # ═══════════════════════════════════════════════════════════
                razon_texto = ''
                
                # Agregar razones si existen
                if razones_nombres and len(razones_nombres) > 0:
                    razon_texto = ', '.join(razones_nombres)
                    print(f"📝 Razones para mensaje: {razon_texto}")
                
                # Agregar comentario si existe
                if comentario and comentario.strip():
                    if razon_texto:
                        razon_texto = razon_texto + '. ' + comentario.strip()
                    else:
                        razon_texto = comentario.strip()
                
                # Si no hay nada, poner texto por defecto
                if not razon_texto:
                    razon_texto = 'Sin especificar'
                
                # Construir mensaje de texto
                mensaje_sistema = f"📷 Foto rechazada - Tipo: {tipo_foto}. Razón: {razon_texto}"
                
                # ═══════════════════════════════════════════════════════════
                # METADATA COMPLETA
                # ═══════════════════════════════════════════════════════════
                metadata_completa = {
                    'tipo_evento': 'rechazo_foto',
                    'id_foto': photo_id,
                    'id_foto_rechazada': rechazo_id,
                    'tipo_foto': tipo_foto,
                    'cliente': nombre_cliente,
                    'nombre_cliente': nombre_cliente,
                    'punto': punto_venta,
                    'punto_venta': punto_venta,
                    'fecha': fecha_rechazo_str,
                    'fecha_rechazo': fecha_rechazo_str,
                    'rechazado_por': rechazado_por,
                    'razones': razones_nombres if razones_nombres else [],
                    'razones_ids': razones_ids if razones_ids else [],
                    'comentario': comentario or '',
                    'razon_completa': razon_texto
                }
                
                print(f"📦 Metadata a enviar: {json.dumps(metadata_completa, ensure_ascii=False)}")
                
                emit_system_message_cliente(
                    socketio=socketio,
                    visit_id=id_visita,
                    cliente_id=id_cliente,
                    mensaje=mensaje_sistema,
                    metadata=metadata_completa
                )
                
                print(f"📢 Mensaje sistema emitido al chat cliente")
                print(f"   Razones: {razones_nombres}")
                print(f"   Razón completa: {razon_texto}")
                
            except Exception as chat_error:
                print(f"⚠️ Error emitiendo al chat cliente: {str(chat_error)}")
                import traceback
                traceback.print_exc()

            # ═══════════════════════════════════════════════════════════════
            # TELEGRAM EN BACKGROUND
            # ═══════════════════════════════════════════════════════════════
            import threading
            
            telegram_data = {
                'rechazado_por': 'cliente',
                'id_visita': id_visita,
                'id_foto': id_foto_original,
                'cliente': nombre_cliente,
                'punto_venta': punto_venta,
                'fecha_rechazo': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'comentario': comentario,
                'tipo_foto': tipo_foto
            }
            rechazo_id_copy = rechazo_id
            
            def enviar_telegram_async(app_ref, data, r_id):
                with app_ref.app_context():
                    try:
                        telegram_enviado = enviar_notificacion_telegram(data)
                        if telegram_enviado:
                            print(f"📱 Telegram enviado - Rechazo ID: {r_id}")
                        else:
                            print(f"⚠️ Telegram no enviado - Rechazo ID: {r_id}")
                    except Exception as e:
                        print(f"❌ Error Telegram async: {str(e)}")
            
            telegram_thread = threading.Thread(
                target=enviar_telegram_async,
                args=(app, telegram_data, rechazo_id_copy)
            )
            telegram_thread.daemon = True
            telegram_thread.start()
            
            # Respuesta inmediata
            return jsonify({
                'success': True, 
                'message': 'Foto rechazada correctamente',
                'rechazo_id': rechazo_id,
                'notificacion': {
                    'id_notificacion': notificacion_id,
                    'id_visita': id_visita,
                    'cliente': nombre_cliente,
                    'punto_venta': punto_venta,
                    'rechazado_por': 'cliente',
                    'fecha_rechazo': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'leido': 0,
                    'tipo_foto': tipo_foto
                }
            })

        except Exception as e:
            conn.rollback()
            print(f"❌ Error en transacción: {str(e)}")
            import traceback
            traceback.print_exc()
            raise e
        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        print(f"❌ Error en reject-photo: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Error al rechazar la foto: {str(e)}'}), 500


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

# ===================================================================
# ENDPOINTS DE NOTIFICACIONES
# ===================================================================

@auth_bp.route('/api/point-visitas/<string:point_id>')
@login_required
def point_visitas(point_id):
    """Obtener lista de visitas para un punto específico"""
    if current_user.rol != 'client':
        return jsonify({'error': 'No autorizado'}), 403

    cliente_id = current_user.cliente_id
    if not cliente_id:
        return jsonify({'error': 'Cliente no asociado'}), 400

    try:
        query = """
            SELECT DISTINCT 
                vm.id_visita,
                vm.fecha_visita,
                m.nombre as mercaderista,
                COUNT(ft.id_foto) as total_fotos
            FROM VISITAS_MERCADERISTA vm
            JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
            LEFT JOIN FOTOS_TOTALES ft ON vm.id_visita = ft.id_visita
            JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
            WHERE pin.identificador = ? AND vm.id_cliente = ?
            GROUP BY vm.id_visita, vm.fecha_visita, m.nombre
            ORDER BY vm.id_visita DESC
        """
        
        results = execute_query(query, (point_id, cliente_id))
        
        visitas = []
        for row in results:
            visitas.append({
                'id_visita': row[0],
                'fecha_visita': row[1].isoformat() if row[1] else None,
                'mercaderista': row[2],
                'total_fotos': row[3]
            })
        
        return jsonify(visitas)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/test-point-photos/<string:point_id>')
@login_required
def test_point_photos(point_id):
    """Endpoint de prueba"""
    if current_user.rol != 'client':
        return jsonify({'error': 'No autorizado'}), 403

    try:
        query = """
            SELECT DISTINCT TOP 5
                ft.id_foto,
                ft.file_path,
                ft.id_tipo_foto,
                vm.id_visita,
                m.nombre
            FROM FOTOS_TOTALES ft
            JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
            JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
            JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
            WHERE pin.identificador = ?
            ORDER BY vm.id_visita DESC
        """
        
        results = execute_query(query, (point_id,))
        
        return jsonify({
            'test_data': 'OK',
            'total_fotos': len(results),
            'fotos': [{
                'id_foto': row[0],
                'id_tipo_foto': row[2],
                'id_visita': row[3],
                'mercaderista': row[4]
            } for row in results]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500






@auth_bp.route('/api/marcar-todas-leidas', methods=['POST'])
@login_required
def marcar_todas_leidas():
    """Marca todas las notificaciones como leídas (filtrado por rol y cliente)"""
    try:
        query = """
            UPDATE NOTIFICACIONES_RECHAZO_FOTOS
            SET leido = 1
            WHERE leido = 0
        """
        
        params = []
        
        # ✅ FILTRAR POR ROL Y CLIENTE
        if current_user.rol == 'client':
            query += " AND rechazado_por = ?"
            params.append('cliente')
            
            if current_user.cliente_id:
                query += " AND id_cliente = ?"
                params.append(current_user.cliente_id)
        
        execute_query(query, tuple(params) if params else None, commit=True)
        
        print(f"✅ Todas las notificaciones marcadas como leídas para {current_user.username}")
        
        return jsonify({
            'success': True,
            'message': 'Todas las notificaciones marcadas como leídas'
        })
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@auth_bp.route('/api/marcar-notificacion-leida/<int:notif_id>', methods=['POST'])
@login_required
def marcar_notificacion_leida(notif_id):
    """Marca una notificación individual como leída"""
    try:
        query = """
            UPDATE NOTIFICACIONES_RECHAZO_FOTOS
            SET leido = 1
            WHERE id_notificacion = ?
        """
        execute_query(query, (notif_id,), commit=True)
        
        print(f"✅ Notificación {notif_id} marcada como leída")
        
        return jsonify({
            'success': True,
            'message': 'Notificación marcada como leída'
        })
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@auth_bp.route('/notificaciones')
@login_required
def notificaciones_page():
    """Página de todas las notificaciones"""
    if current_user.rol != 'client':
        return redirect(url_for('points.index'))
    return render_template('notificaciones.html')


# ===================================================================
# ENDPOINTS PARA DASHBOARD CLIENTE
# ===================================================================

@auth_bp.route('/api/client-dashboard')
@login_required
def client_dashboard():
    """Obtiene el iframe del dashboard para el cliente actual o para un cliente específico (coordinador exclusivo)"""
    try:
        # Obtener cliente_id del parámetro si existe (para coordinadores exclusivos)
        cliente_id_param = request.args.get('cliente_id')
        
        # Determinar qué cliente_id usar
        if current_user.rol == 'client':
            # Cliente normal - usar su propio ID
            target_cliente_id = current_user.cliente_id
        elif current_user.is_coordinador_exclusivo() and cliente_id_param:
            # Coordinador exclusivo con cliente seleccionado
            target_cliente_id = cliente_id_param
        elif current_user.is_coordinador_exclusivo() and not cliente_id_param:
            # Coordinador exclusivo sin cliente seleccionado
            return jsonify({
                'success': False,
                'message': 'Seleccione un cliente primero'
            }), 400
        else:
            return jsonify({'error': 'No autorizado'}), 403
        
        # Validar que el cliente tenga ID
        if not target_cliente_id:
            return jsonify({
                'success': False,
                'message': 'Cliente no tiene ID asignado'
            }), 400
        
        # Verificar permisos adicionales (coordinador solo puede ver clientes exclusivos que le pertenecen)
        if current_user.is_coordinador_exclusivo():
            # Verificar que el cliente_id_param pertenezca a un cliente exclusivo
            query_check = """
                SELECT 1 FROM CLIENTES 
                WHERE id_cliente = ? AND id_tipo_cliente = 3
            """
            check_result = execute_query(query_check, (target_cliente_id,), fetch_one=True)
            if not check_result:
                return jsonify({
                    'success': False,
                    'message': 'No tiene permisos para ver este dashboard'
                }), 403
        
        # Buscar dashboard por id_cliente
        query = """
            SELECT url_html, tipo 
            FROM dashboard_client 
            WHERE id_cliente = ?
        """
        result = execute_query(query, (target_cliente_id,), fetch_one=True)
        
        if result:
            url_html = result[0]
            tipo = result[1] if len(result) > 1 else 'General'
            
            # Validar que el HTML no esté vacío
            if not url_html or url_html.strip() == '':
                current_app.logger.warning(f"Cliente {target_cliente_id} tiene iframe vacío")
                return jsonify({
                    'success': False,
                    'message': 'Dashboard no configurado'
                })
            
            return jsonify({
                'success': True,
                'html': url_html.strip(),
                'tipo': tipo
            })
        else:
            # Registrar en logs si no hay dashboard
            current_app.logger.info(f"Cliente {target_cliente_id} no tiene dashboard configurado")
            return jsonify({
                'success': False,
                'message': 'No se encontró dashboard para este cliente'
            })
            
    except Exception as e:
        current_app.logger.error(f"Error en client_dashboard: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': 'Error interno del servidor'
        }), 500
    

@auth_bp.route('/api/client-info')
@login_required
def client_info():
    """Obtiene información básica del cliente actual"""
    try:
        # Determinar qué cliente_id usar
        cliente_id_param = request.args.get('cliente_id')
        
        if current_user.rol == 'client':
            target_cliente_id = current_user.cliente_id
        elif current_user.is_coordinador_exclusivo() and cliente_id_param:
            target_cliente_id = cliente_id_param
        else:
            return jsonify({
                'success': False,
                'message': 'No autorizado'
            }), 403
        
        query = """
            SELECT id_cliente, cliente, id_tipo_cliente
            FROM CLIENTES 
            WHERE id_cliente = ?
        """
        result = execute_query(query, (target_cliente_id,), fetch_one=True)
        
        if result:
            return jsonify({
                'success': True,
                'id_cliente': result[0],
                'cliente': result[1],
                'id_tipo_cliente': result[2]
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Cliente no encontrado'
            })
            
    except Exception as e:
        current_app.logger.error(f"Error en client_info: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Error interno del servidor'
        }), 500
    
    
@auth_bp.route('/dashboard-auditor')
@login_required
def dashboard_auditor():
    """Dashboard para mercaderistas tipo Auditor - CORREGIDO DEFINITIVO"""
    # Verificar que sea mercaderista
    if current_user.rol != 'mercaderista':
        flash('Acceso no autorizado', 'danger')
        return redirect(url_for('auth.login'))
    
    # Verificar que sea tipo Auditor
    mercaderista_tipo = session.get('merchandiser_tipo')
    if mercaderista_tipo != 'Auditor':
        flash('Solo los auditores pueden acceder a esta página', 'danger')
        # ✅ CORREGIDO: Endpoint correcto para mercaderistas
        return redirect(url_for('merchandisers.dashboard_mercaderista'))
    
    try:
        from app.utils.database import execute_query
        # ✅ ELIMINADO 'fecha_ingreso' - LA COLUMNA NO EXISTE EN LA TABLA
        result = execute_query(
            "SELECT nombre, cedula, tipo FROM MERCADERISTAS WHERE cedula = ?",
            (current_user.username,),  # current_user.username es la cédula
            fetch_one=True
        )
        
        if not result or result[2] != 'Auditor':
            flash('Acceso denegado: No eres un auditor activo', 'danger')
            # ✅ CORREGIDO: Endpoint correcto
            return redirect(url_for('merchandisers.dashboard_mercaderista'))
        
        # ✅ ESTABLECER DATOS EN SESSION (sin fecha_ingreso)
        session['auditor_name'] = result[0]
        session['auditor_cedula'] = result[1]
        session['auditor_tipo'] = result[2]
        session['fechaIngreso'] = None  # ✅ Valor nulo porque la columna no existe
        
        # ✅ PASAR VARIABLES AL TEMPLATE (fechaIngreso como None)
        return render_template('auditor_dashboard.html',
                             nombre=result[0],
                             cedula=result[1],
                             tipo=result[2],
                             fechaIngreso=None)  # ✅ Pasar None explícitamente
    
    except Exception as e:
        current_app.logger.error(f"Error al cargar dashboard auditor: {str(e)}")
        flash('Error al cargar información del auditor', 'danger')
        # ✅ CORREGIDO: Endpoint correcto en el handler de errores
        return redirect(url_for('merchandisers.dashboard_mercaderista'))


# app/routes/auth.py - Endpoint para clientes exclusivos
@auth_bp.route('/api/client-exclusive-clients')
@login_required
def client_exclusive_clients():
    """Obtener lista de clientes exclusivos para coordinadores"""
    if not current_user.is_coordinador_exclusivo():
        return jsonify({'error': 'No autorizado'}), 403
    
    try:
        # ✅ CORREGIDO: Eliminar condición AND c.activo = 1 (no existe el campo)
        query = """
        SELECT DISTINCT c.id_cliente, c.cliente
        FROM CLIENTES c
        WHERE c.id_tipo_cliente = 3  -- SOLO CLIENTES EXCLUSIVOS
        ORDER BY c.cliente
        """
        results = execute_query(query)
        
        if not results:
            print("⚠️ No se encontraron clientes exclusivos")
            return jsonify([])
        
        return jsonify([
            {
                'id_cliente': row[0],
                'cliente': row[1]
            } 
            for row in results
        ])
    except Exception as e:
        current_app.logger.error(f"Error en client_exclusive_clients: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500