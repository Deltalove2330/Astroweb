from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, current_app
from flask_login import login_user, logout_user, current_user, login_required
from app.utils.database import execute_query
from app.utils.auth import verify_password, get_user_by_username
from datetime import datetime
import bcrypt
import json  

# Crear blueprint específico para Atención al Cliente
atencion_cliente_bp = Blueprint('atencion_cliente', __name__, url_prefix='/atencion-cliente')

# ===================================================================
# DECORADOR PARA VERIFICAR ROL DE ATENCIÓN AL CLIENTE
# ===================================================================
def verificar_rol_atencion_cliente(f):
    """Decorador para verificar que el usuario sea de Atención al Cliente (id_rol = 10)"""
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            flash('Debes iniciar sesión primero', 'warning')
            return redirect(url_for('auth.login'))
        
        if current_user.id_rol != 10:
            flash('Acceso no autorizado. Solo para Atención al Cliente.', 'danger')
            return redirect(url_for('auth.login'))
        
        return f(*args, **kwargs)
    return decorated_function

# ===================================================================
# DASHBOARD PRINCIPAL
# ===================================================================
@atencion_cliente_bp.route('/')
@atencion_cliente_bp.route('/dashboard')
@login_required
@verificar_rol_atencion_cliente
def dashboard():
    """Dashboard principal para Atención al Cliente"""
    return render_template('dashboard_atencion_cliente.html', 
                         username=current_user.username)

# ===================================================================
# GESTIÓN DE PDV (PUNTOS DE INTERÉS)
# ===================================================================
@atencion_cliente_bp.route('/gestion-pdv')
@login_required
@verificar_rol_atencion_cliente
def gestion_pdv():
    """Página de gestión de puntos de interés para Atención al Cliente"""
    return render_template('atencion_cliente_pdv.html')

@atencion_cliente_bp.route('/api/pdv')
@login_required
@verificar_rol_atencion_cliente
def get_pdv():
    """Obtener todos los puntos de interés"""
    try:
        query = """
        SELECT TOP 1000
        punto_de_interes, identificador, Direccion, latitud, longitud,
        departamento, jerarquia_nivel_2, jerarquia_nivel_2_2, radio,
        tiempo_minimo_de_visita, fecha_creado, ciudad, clasificacion_de_canal,
        nivel_de_alcance, rif, localidad
        FROM PUNTOS_INTERES1
        ORDER BY fecha_creado DESC
        """
        pdvs = execute_query(query)
        pdvs_list = []
        for row in pdvs:
            # Manejo seguro de fecha_creado
            fecha_creado = row[10]
            fecha_formateada = None
            if fecha_creado:
                if isinstance(fecha_creado, datetime):
                    fecha_formateada = fecha_creado.strftime("%d/%m/%Y")
                elif isinstance(fecha_creado, str):
                    fecha_formateada = fecha_creado
                else:
                    fecha_formateada = str(fecha_creado)
            
            pdvs_list.append({
                "id": row[1],  # identificador como ID
                "identificador": row[1],
                "punto_de_interes": row[0],
                "direccion": row[2],
                "latitud": row[3],
                "longitud": row[4],
                "departamento": row[5],
                "jerarquia_nivel_2": row[6],
                "jerarquia_nivel_2_2": row[7],
                "radio": row[8],
                "tiempo_minimo_de_visita": row[9],
                "fecha_creado": fecha_formateada,
                "ciudad": row[11],
                "clasificacion_de_canal": row[12],
                "nivel_de_alcance": row[13],
                "rif": row[14],
                "localidad": row[15]
            })
        return jsonify(pdvs_list)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo puntos de interés: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@atencion_cliente_bp.route('/api/pdv/<string:identificador>')
@login_required
@verificar_rol_atencion_cliente
def get_pdv_by_id(identificador):
    """Obtener un punto de interés específico por identificador"""
    try:
        query = """
        SELECT
        punto_de_interes, identificador, Direccion, latitud, longitud,
        departamento, jerarquia_nivel_2, jerarquia_nivel_2_2, radio,
        tiempo_minimo_de_visita, fecha_creado, ciudad, clasificacion_de_canal,
        nivel_de_alcance, rif, localidad
        FROM PUNTOS_INTERES1
        WHERE identificador = ?
        """
        pdv = execute_query(query, (identificador,), fetch_one=True)
        if not pdv:
            return jsonify({"error": "Punto de interés no encontrado"}), 404
        
        # Manejo seguro de fecha_creado
        fecha_creado = pdv[10]
        fecha_formateada = None
        if fecha_creado:
            if isinstance(fecha_creado, datetime):
                fecha_formateada = fecha_creado.strftime("%d/%m/%Y")
            elif isinstance(fecha_creado, str):
                fecha_formateada = fecha_creado
            else:
                fecha_formateada = str(fecha_creado)
        
        return jsonify({
            "id": pdv[1],
            "identificador": pdv[1],
            "punto_de_interes": pdv[0],
            "direccion": pdv[2],
            "latitud": pdv[3],
            "longitud": pdv[4],
            "departamento": pdv[5],
            "jerarquia_nivel_2": pdv[6],
            "jerarquia_nivel_2_2": pdv[7],
            "radio": pdv[8],
            "tiempo_minimo_de_visita": pdv[9],
            "fecha_creado": fecha_formateada,
            "ciudad": pdv[11],
            "clasificacion_de_canal": pdv[12],
            "nivel_de_alcance": pdv[13],
            "rif": pdv[14],
            "localidad": pdv[15]
        })
    except Exception as e:
        current_app.logger.error(f"Error obteniendo punto de interés: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@atencion_cliente_bp.route('/api/pdv', methods=['POST'])
@login_required
@verificar_rol_atencion_cliente
def crear_pdv():
    """Crear un nuevo punto de interés"""
    try:
        data = request.get_json()
        # Validar campos requeridos
        if not data.get('punto_de_interes'):
            return jsonify({"success": False, "message": "Nombre del punto es requerido"}), 400
        if not data.get('direccion'):
            return jsonify({"success": False, "message": "Dirección es requerida"}), 400
        if not data.get('latitud') or not data.get('longitud'):
            return jsonify({"success": False, "message": "Coordenadas son requeridas"}), 400
        if not data.get('jerarquia_nivel_2_2'):
            return jsonify({"success": False, "message": "Jerarquía nivel 2_2 es requerida para generar el identificador"}), 400
        
        jerarquia = data['jerarquia_nivel_2_2']
        
        # PRIMERO: Buscar si ya existen identificadores para esta jerarquía
        query_existentes = """
        SELECT identificador
        FROM PUNTOS_INTERES1
        WHERE jerarquia_nivel_2_2 = ?
        ORDER BY identificador DESC
        """
        resultados = execute_query(query_existentes, (jerarquia,))
        identificador_generado = None
        prefijo_usado = None
        
        if resultados:
            # Hay identificadores existentes para esta jerarquía
            ultimo_identificador = resultados[0][0]
            if ultimo_identificador and len(ultimo_identificador) >= 7:
                prefijo = ultimo_identificador[:3]
                numero_str = ultimo_identificador[3:7]
                try:
                    numero = int(numero_str)
                    siguiente_numero = numero + 1
                    identificador_generado = f"{prefijo}{siguiente_numero:04d}"
                    prefijo_usado = prefijo
                except (ValueError, IndexError):
                    pass
        
        if not identificador_generado:
            # SEGUNDO: No hay identificadores existentes o hubo error
            iniciales = ''.join(jerarquia.split())[:3].upper()
            if len(iniciales) < 3:
                iniciales = iniciales.ljust(3, 'X')
            
            # Verificar si ya existe algún identificador con estas iniciales
            query_prefijo = """
            SELECT identificador
            FROM PUNTOS_INTERES1
            WHERE identificador LIKE ?
            ORDER BY identificador DESC
            """
            resultados_prefijo = execute_query(query_prefijo, (f"{iniciales}%",))
            max_numero = 0
            if resultados_prefijo:
                for row in resultados_prefijo:
                    identificador = row[0]
                    if identificador and identificador.startswith(iniciales) and len(identificador) >= 7:
                        try:
                            numero_str = identificador[len(iniciales):len(iniciales)+4]
                            numero = int(numero_str)
                            if numero > max_numero:
                                max_numero = numero
                        except (ValueError, IndexError):
                            continue
            
            siguiente_numero = max_numero + 1
            identificador_generado = f"{iniciales}{siguiente_numero:04d}"
            prefijo_usado = iniciales
        
        # Verificar si el identificador generado ya existe
        check_query = "SELECT COUNT(*) FROM PUNTOS_INTERES1 WHERE identificador = ?"
        result = execute_query(check_query, (identificador_generado,), fetch_one=True)
        count = result[0] if isinstance(result, tuple) else (result if isinstance(result, int) else 0)
        
        if count > 0:
            # Si por alguna razón ya existe, buscar el siguiente disponible
            prefijo = prefijo_usado
            siguiente_numero_base = int(identificador_generado[3:7])
            for i in range(1, 1000):
                identificador_alternativo = f"{prefijo}{(siguiente_numero_base + i):04d}"
                check_alt = execute_query(check_query, (identificador_alternativo,), fetch_one=True)
                count_alt = check_alt[0] if isinstance(check_alt, tuple) else (check_alt if isinstance(check_alt, int) else 0)
                if count_alt == 0:
                    identificador_generado = identificador_alternativo
                    break
        
        # Verificar si hay un punto de interés cercano
        lat = float(data['latitud'])
        lng = float(data['longitud'])
        tolerancia = 0.001  # Aproximadamente 111 metros
        
        cerca_query = """
        SELECT identificador, punto_de_interes, latitud, longitud
        FROM PUNTOS_INTERES1
        WHERE ABS(CAST(latitud AS FLOAT) - ?) <= ?
        AND ABS(CAST(longitud AS FLOAT) - ?) <= ?
        """
        puntos_cercanos = execute_query(cerca_query, (lat, tolerancia, lng, tolerancia))
        
        if puntos_cercanos:
            punto = puntos_cercanos[0]
            distancia_lat = abs(float(punto[2]) - lat)
            distancia_lng = abs(float(punto[3]) - lng)
            distancia_aproximada = ((distancia_lat * 111000) ** 2 + (distancia_lng * 111000) ** 2) ** 0.5
            return jsonify({
                "success": False,
                "message": f"Ya existe un punto de interés cercano: {punto[1]} (ID: {punto[0]}) a {distancia_aproximada:.0f} metros",
                "punto_existente": {
                    "identificador": punto[0],
                    "nombre": punto[1],
                    "latitud": punto[2],
                    "longitud": punto[3]
                }
            }), 400
        
        # Insertar nuevo punto de interés
        query = """
        INSERT INTO PUNTOS_INTERES1 (
        punto_de_interes, identificador, Direccion, latitud, longitud,
        departamento, jerarquia_nivel_2, jerarquia_nivel_2_2, radio,
        tiempo_minimo_de_visita, fecha_creado, ciudad, clasificacion_de_canal,
        nivel_de_alcance, rif, localidad, coordenadas_geography
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE(), ?, ?, ?, ?, ?,
        geography::Point(?, ?, 4326))
        """
        params = (
            data['punto_de_interes'],
            identificador_generado,
            data['direccion'],
            data['latitud'],
            data['longitud'],
            data.get('departamento'),
            data.get('jerarquia_nivel_2'),
            data.get('jerarquia_nivel_2_2'),
            data.get('radio', 100),
            15,  # tiempo_minimo_de_visita por defecto
            data.get('ciudad'),
            data.get('clasificacion_de_canal'),
            data.get('nivel_de_alcance'),
            data.get('rif'),
            data.get('localidad'),
            data['latitud'],
            data['longitud']
        )
        execute_query(query, params, commit=True)
        
        return jsonify({
            "success": True,
            "message": "Punto de interés creado exitosamente",
            "identificador": identificador_generado
        })
    except Exception as e:
        current_app.logger.error(f"Error creando punto de interés: {str(e)}")
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500

@atencion_cliente_bp.route('/api/pdv/<string:identificador>', methods=['PUT'])
@login_required
@verificar_rol_atencion_cliente
def actualizar_pdv(identificador):
    """Actualizar un punto de interés existente"""
    try:
        data = request.get_json()
        
        # Verificar si el punto de interés existe
        check_query = "SELECT COUNT(*) FROM PUNTOS_INTERES1 WHERE identificador = ?"
        result = execute_query(check_query, (identificador,), fetch_one=True)
        count = result[0] if isinstance(result, tuple) else (result if isinstance(result, int) else 0)
        
        if count == 0:
            return jsonify({"success": False, "message": "Punto de interés no encontrado"}), 404
        
        # Si el identificador en los datos es diferente al de la URL, verificar que no exista otro
        nuevo_identificador = data.get('identificador')
        if nuevo_identificador and nuevo_identificador != identificador:
            check_identificador_query = "SELECT COUNT(*) FROM PUNTOS_INTERES1 WHERE identificador = ?"
            result_identificador = execute_query(check_identificador_query, (nuevo_identificador,), fetch_one=True)
            count_identificador = result_identificador[0] if isinstance(result_identificador, tuple) else (result_identificador if isinstance(result_identificador, int) else 0)
            if count_identificador > 0:
                return jsonify({"success": False, "message": "El identificador ya existe en otro punto de interés"}), 400
        
        # Verificar si hay un punto de interés cercano excluyendo el actual
        lat = float(data.get('latitud', 0))
        lng = float(data.get('longitud', 0))
        tolerancia = 0.001
        
        cerca_query = """
        SELECT identificador, punto_de_interes, latitud, longitud
        FROM PUNTOS_INTERES1
        WHERE identificador != ?
        AND ABS(CAST(latitud AS FLOAT) - ?) <= ?
        AND ABS(CAST(longitud AS FLOAT) - ?) <= ?
        """
        puntos_cercanos = execute_query(cerca_query, (identificador, lat, tolerancia, lng, tolerancia))
        
        if puntos_cercanos:
            punto = puntos_cercanos[0]
            distancia_lat = abs(float(punto[2]) - lat)
            distancia_lng = abs(float(punto[3]) - lng)
            distancia_aproximada = ((distancia_lat * 111000) ** 2 + (distancia_lng * 111000) ** 2) ** 0.5
            return jsonify({
                "success": False,
                "message": f"Ya existe otro punto cercano: {punto[1]} (ID: {punto[0]}) a {distancia_aproximada:.0f} metros",
                "punto_existente": {
                    "identificador": punto[0],
                    "nombre": punto[1],
                    "latitud": punto[2],
                    "longitud": punto[3]
                }
            }), 400
        
        # Actualizar el punto de interés
        query = """
        UPDATE PUNTOS_INTERES1
        SET punto_de_interes = ?, identificador = ?, Direccion = ?, latitud = ?, longitud = ?,
        departamento = ?, jerarquia_nivel_2 = ?, jerarquia_nivel_2_2 = ?, radio = ?,
        ciudad = ?, clasificacion_de_canal = ?, nivel_de_alcance = ?, rif = ?, localidad = ?,
        coordenadas_geography = geography::Point(?, ?, 4326)
        WHERE identificador = ?
        """
        params = (
            data.get('punto_de_interes'),
            nuevo_identificador if nuevo_identificador else identificador,
            data.get('direccion'),
            data.get('latitud'),
            data.get('longitud'),
            data.get('departamento'),
            data.get('jerarquia_nivel_2'),
            data.get('jerarquia_nivel_2_2'),
            data.get('radio', 100),
            data.get('ciudad'),
            data.get('clasificacion_de_canal'),
            data.get('nivel_de_alcance'),
            data.get('rif'),
            data.get('localidad'),
            data.get('latitud'),
            data.get('longitud'),
            identificador
        )
        execute_query(query, params, commit=True)
        
        return jsonify({
            "success": True,
            "message": "Punto de interés actualizado exitosamente"
        })
    except Exception as e:
        current_app.logger.error(f"Error actualizando punto de interés: {str(e)}")
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500

@atencion_cliente_bp.route('/api/pdv/<string:identificador>', methods=['DELETE'])
@login_required
@verificar_rol_atencion_cliente
def eliminar_pdv(identificador):
    """Eliminar un punto de interés"""
    try:
        # Verificar si el punto de interés existe
        check_query = "SELECT COUNT(*) FROM PUNTOS_INTERES1 WHERE identificador = ?"
        result = execute_query(check_query, (identificador,), fetch_one=True)
        count = result[0] if isinstance(result, tuple) else (result if isinstance(result, int) else 0)
        
        if count == 0:
            return jsonify({"success": False, "message": "Punto de interés no encontrado"}), 404
        
        # Eliminar el punto de interés
        query = "DELETE FROM PUNTOS_INTERES1 WHERE identificador = ?"
        execute_query(query, (identificador,), commit=True)
        
        return jsonify({
            "success": True,
            "message": "Punto de interés eliminado exitosamente"
        })
    except Exception as e:
        current_app.logger.error(f"Error eliminando punto de interés: {str(e)}")
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500

# ===================================================================
# ENDPOINTS PARA LISTAS DESPLEGABLES CON CATÁLOGOS DINÁMICOS
# ===================================================================

def get_table_columns(table_name):
    """Obtiene los nombres de columnas de una tabla de manera segura"""
    try:
        query = """
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = ? 
        ORDER BY ORDINAL_POSITION
        """
        res = execute_query(query, (table_name,))
        return [r[0] for r in res] if res else []
    except Exception as e:
        current_app.logger.error(f"Error obteniendo columnas de {table_name}: {str(e)}")
        return []

def get_text_column(columns):
    """Encuentra la columna de texto descriptiva principal"""
    text_cols = [c for c in columns if c.lower() not in ('id', 'activo', 'fecha_creado', 'created_at') and not c.lower().endswith('_id')]
    if not text_cols:
        text_cols = [c for c in columns if 'id' not in c.lower()]
    if not text_cols:
        text_cols = columns
    return text_cols[0] if text_cols else None

def query_catalog_or_fallback(table_name, select_col, fallback_query, fallback_params=None):
    """Consulta la tabla del catálogo si existe, o cae en la consulta de fallback sobre PUNTOS_INTERES1"""
    try:
        check_query = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = ?"
        exists = execute_query(check_query, (table_name,), fetch_one=True)
        table_exists = exists > 0 if isinstance(exists, int) else (exists[0] > 0 if exists else False)
        
        if table_exists:
            columns = get_table_columns(table_name)
            text_col = get_text_column(columns)
            if text_col:
                query = f"SELECT DISTINCT [{text_col}] FROM [{table_name}] WHERE [{text_col}] IS NOT NULL AND [{text_col}] != '' ORDER BY [{text_col}]"
                res = execute_query(query)
                if res:
                    return [r[0] for r in res if r[0]]
        
        res = execute_query(fallback_query, fallback_params or ())
        return [r[0] for r in res if r[0]]
    except Exception as e:
        current_app.logger.error(f"Error consultando catálogo {table_name}: {str(e)}")
        try:
            res = execute_query(fallback_query, fallback_params or ())
            return [r[0] for r in res if r[0]]
        except Exception:
            return []

@atencion_cliente_bp.route('/api/pdv/departamentos', methods=['GET', 'POST'])
@login_required
@verificar_rol_atencion_cliente
def manage_departamentos():
    """Obtener todos los departamentos o crear uno nuevo inline"""
    if request.method == 'POST':
        try:
            data = request.get_json()
            valor = data.get('valor', '').strip()
            if not valor:
                return jsonify({"success": False, "message": "El nombre del departamento es requerido"}), 400
            
            check_table = execute_query("SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'CAT_DEPARTAMENTOS'", fetch_one=True)
            table_exists = check_table > 0 if isinstance(check_table, int) else (check_table[0] > 0 if check_table else False)
            
            if table_exists:
                cols = get_table_columns("CAT_DEPARTAMENTOS")
                text_col = get_text_column(cols)
                
                dup = execute_query(f"SELECT COUNT(*) FROM CAT_DEPARTAMENTOS WHERE [{text_col}] = ?", (valor,), fetch_one=True)
                dup_count = dup > 0 if isinstance(dup, int) else (dup[0] > 0 if dup else False)
                if dup_count:
                    return jsonify({"success": True, "message": "El departamento ya existe"})
                
                query = f"INSERT INTO CAT_DEPARTAMENTOS ([{text_col}]) VALUES (?)"
                execute_query(query, (valor,), commit=True)
                return jsonify({"success": True, "message": "Departamento creado exitosamente"})
            else:
                return jsonify({"success": True, "message": "Valor guardado localmente (tabla catálogo no existe)"})
        except Exception as e:
            current_app.logger.error(f"Error creando departamento: {str(e)}")
            return jsonify({"success": False, "message": str(e)}), 500
            
    # GET method
    fallback = "SELECT DISTINCT departamento FROM PUNTOS_INTERES1 WHERE departamento IS NOT NULL AND departamento != '' ORDER BY departamento"
    data = query_catalog_or_fallback("CAT_DEPARTAMENTOS", "departamento", fallback)
    return jsonify(data)

@atencion_cliente_bp.route('/api/pdv/ciudades', methods=['GET', 'POST'])
@login_required
@verificar_rol_atencion_cliente
def manage_ciudades():
    """Obtener todas las ciudades o crear una nueva inline vinculada a un departamento"""
    if request.method == 'POST':
        try:
            data = request.get_json()
            valor = data.get('valor', '').strip()
            departamento = data.get('departamento', '').strip()
            if not valor:
                return jsonify({"success": False, "message": "El nombre de la ciudad es requerido"}), 400
            if not departamento:
                return jsonify({"success": False, "message": "El departamento es requerido para crear una ciudad"}), 400
            
            check_table = execute_query("SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'CAT_CIUDADES'", fetch_one=True)
            table_exists = check_table > 0 if isinstance(check_table, int) else (check_table[0] > 0 if check_table else False)
            
            if table_exists:
                cols = get_table_columns("CAT_CIUDADES")
                city_col = get_text_column(cols)
                
                dept_col = None
                for c in cols:
                    if c.lower() in ('departamento', 'id_departamento', 'departamento_id', 'estado', 'id_estado'):
                        dept_col = c
                        break
                
                if city_col and dept_col:
                    if dept_col.lower() in ('id_departamento', 'departamento_id') and 'CAT_DEPARTAMENTOS' in [t[0] for t in execute_query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES")]:
                        dept_cols = get_table_columns("CAT_DEPARTAMENTOS")
                        dept_name_col = get_text_column(dept_cols)
                        
                        dept_row = execute_query(f"SELECT id FROM CAT_DEPARTAMENTOS WHERE [{dept_name_col}] = ?", (departamento,), fetch_one=True)
                        if not dept_row:
                            execute_query(f"INSERT INTO CAT_DEPARTAMENTOS ([{dept_name_col}]) VALUES (?)", (departamento,), commit=True)
                            dept_row = execute_query(f"SELECT id FROM CAT_DEPARTAMENTOS WHERE [{dept_name_col}] = ?", (departamento,), fetch_one=True)
                        
                        dept_id = dept_row[0] if isinstance(dept_row, tuple) else dept_row
                        
                        dup = execute_query(f"SELECT COUNT(*) FROM CAT_CIUDADES WHERE [{city_col}] = ? AND [{dept_col}] = ?", (valor, dept_id), fetch_one=True)
                        dup_count = dup > 0 if isinstance(dup, int) else (dup[0] > 0 if dup else False)
                        if dup_count:
                            return jsonify({"success": True, "message": "La ciudad ya existe en este departamento"})
                        
                        execute_query(f"INSERT INTO CAT_CIUDADES ([{city_col}], [{dept_col}]) VALUES (?, ?)", (valor, dept_id), commit=True)
                    else:
                        dup = execute_query(f"SELECT COUNT(*) FROM CAT_CIUDADES WHERE [{city_col}] = ? AND [{dept_col}] = ?", (valor, departamento), fetch_one=True)
                        dup_count = dup > 0 if isinstance(dup, int) else (dup[0] > 0 if dup else False)
                        if dup_count:
                            return jsonify({"success": True, "message": "La ciudad ya existe en este departamento"})
                        
                        execute_query(f"INSERT INTO CAT_CIUDADES ([{city_col}], [{dept_col}]) VALUES (?, ?)", (valor, departamento), commit=True)
                    
                    return jsonify({"success": True, "message": "Ciudad creada exitosamente"})
            return jsonify({"success": True, "message": "Valor guardado localmente (tabla catálogo no existe)"})
        except Exception as e:
            current_app.logger.error(f"Error creando ciudad: {str(e)}")
            return jsonify({"success": False, "message": str(e)}), 500
            
    # GET method
    fallback = "SELECT DISTINCT ciudad FROM PUNTOS_INTERES1 WHERE ciudad IS NOT NULL AND ciudad != '' ORDER BY ciudad"
    data = query_catalog_or_fallback("CAT_CIUDADES", "ciudad", fallback)
    return jsonify(data)

@atencion_cliente_bp.route('/api/pdv/jerarquias-n2', methods=['GET', 'POST'])
@login_required
@verificar_rol_atencion_cliente
def manage_jerarquias_n2():
    """Obtener todas las jerarquías N2 o crear una nueva inline"""
    if request.method == 'POST':
        try:
            data = request.get_json()
            valor = data.get('valor', '').strip()
            if not valor:
                return jsonify({"success": False, "message": "La jerarquía nivel 2 (Tipo de Negocio) es requerida"}), 400
            
            check_table = execute_query("SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'CAT_TIPO_NEGOCIO'", fetch_one=True)
            table_exists = check_table > 0 if isinstance(check_table, int) else (check_table[0] > 0 if check_table else False)
            
            if table_exists:
                cols = get_table_columns("CAT_TIPO_NEGOCIO")
                text_col = get_text_column(cols)
                
                dup = execute_query(f"SELECT COUNT(*) FROM CAT_TIPO_NEGOCIO WHERE [{text_col}] = ?", (valor,), fetch_one=True)
                dup_count = dup > 0 if isinstance(dup, int) else (dup[0] > 0 if dup else False)
                if dup_count:
                    return jsonify({"success": True, "message": "La jerarquía nivel 2 ya existe"})
                
                query = f"INSERT INTO CAT_TIPO_NEGOCIO ([{text_col}]) VALUES (?)"
                execute_query(query, (valor,), commit=True)
                return jsonify({"success": True, "message": "Jerarquía Nivel 2 creada exitosamente"})
            else:
                return jsonify({"success": True, "message": "Valor guardado localmente (tabla catálogo no existe)"})
        except Exception as e:
            current_app.logger.error(f"Error creando jerarquía N2: {str(e)}")
            return jsonify({"success": False, "message": str(e)}), 500
            
    # GET method
    fallback = "SELECT DISTINCT jerarquia_nivel_2 FROM PUNTOS_INTERES1 WHERE jerarquia_nivel_2 IS NOT NULL AND jerarquia_nivel_2 != '' ORDER BY jerarquia_nivel_2"
    data = query_catalog_or_fallback("CAT_TIPO_NEGOCIO", "tipo_negocio", fallback)
    return jsonify(data)

@atencion_cliente_bp.route('/api/pdv/jerarquias-n2-2', methods=['GET', 'POST'])
@login_required
@verificar_rol_atencion_cliente
def manage_jerarquias_n2_2():
    """Obtener todas las jerarquías N2_2 o crear una nueva inline vinculada a una N2"""
    if request.method == 'POST':
        try:
            data = request.get_json()
            valor = data.get('valor', '').strip()
            jerarquia_n2 = data.get('jerarquia_n2', '').strip() # Tipo de negocio padre
            if not valor:
                return jsonify({"success": False, "message": "La jerarquía nivel 2_2 (Subtipo de Negocio) es requerida"}), 400
            if not jerarquia_n2:
                return jsonify({"success": False, "message": "La jerarquía nivel 2 (Tipo de Negocio) es requerida para vincular"}), 400
            
            check_table = execute_query("SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'CAT_SUBTIPO_NEGOCIO'", fetch_one=True)
            table_exists = check_table > 0 if isinstance(check_table, int) else (check_table[0] > 0 if check_table else False)
            
            if table_exists:
                cols = get_table_columns("CAT_SUBTIPO_NEGOCIO")
                sub_col = get_text_column(cols)
                
                tipo_col = None
                for c in cols:
                    if c.lower() in ('tipo', 'id_tipo', 'tipo_id', 'tipo_negocio', 'id_tipo_negocio', 'tipo_negocio_id', 'jerarquia_nivel_2'):
                        tipo_col = c
                        break
                
                if sub_col and tipo_col:
                    if tipo_col.lower() in ('id_tipo', 'tipo_id', 'id_tipo_negocio', 'tipo_negocio_id') and 'CAT_TIPO_NEGOCIO' in [t[0] for t in execute_query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES")]:
                        tipo_cols = get_table_columns("CAT_TIPO_NEGOCIO")
                        tipo_name_col = get_text_column(tipo_cols)
                        
                        tipo_row = execute_query(f"SELECT id FROM CAT_TIPO_NEGOCIO WHERE [{tipo_name_col}] = ?", (jerarquia_n2,), fetch_one=True)
                        if not tipo_row:
                            execute_query(f"INSERT INTO CAT_TIPO_NEGOCIO ([{tipo_name_col}]) VALUES (?)", (jerarquia_n2,), commit=True)
                            tipo_row = execute_query(f"SELECT id FROM CAT_TIPO_NEGOCIO WHERE [{tipo_name_col}] = ?", (jerarquia_n2,), fetch_one=True)
                        
                        tipo_id = tipo_row[0] if isinstance(tipo_row, tuple) else tipo_row
                        
                        dup = execute_query(f"SELECT COUNT(*) FROM CAT_SUBTIPO_NEGOCIO WHERE [{sub_col}] = ? AND [{tipo_col}] = ?", (valor, tipo_id), fetch_one=True)
                        dup_count = dup > 0 if isinstance(dup, int) else (dup[0] > 0 if dup else False)
                        if dup_count:
                            return jsonify({"success": True, "message": "La jerarquía ya existe en este tipo de negocio"})
                        
                        execute_query(f"INSERT INTO CAT_SUBTIPO_NEGOCIO ([{sub_col}], [{tipo_col}]) VALUES (?, ?)", (valor, tipo_id), commit=True)
                    else:
                        dup = execute_query(f"SELECT COUNT(*) FROM CAT_SUBTIPO_NEGOCIO WHERE [{sub_col}] = ? AND [{tipo_col}] = ?", (valor, jerarquia_n2), fetch_one=True)
                        dup_count = dup > 0 if isinstance(dup, int) else (dup[0] > 0 if dup else False)
                        if dup_count:
                            return jsonify({"success": True, "message": "La jerarquía ya existe en este tipo de negocio"})
                        
                        execute_query(f"INSERT INTO CAT_SUBTIPO_NEGOCIO ([{sub_col}], [{tipo_col}]) VALUES (?, ?)", (valor, jerarquia_n2), commit=True)
                    
                    return jsonify({"success": True, "message": "Jerarquía Nivel 2_2 creada exitosamente"})
            return jsonify({"success": True, "message": "Valor guardado localmente (tabla catálogo no existe)"})
        except Exception as e:
            current_app.logger.error(f"Error creando jerarquía N2_2: {str(e)}")
            return jsonify({"success": False, "message": str(e)}), 500
            
    # GET method
    fallback = "SELECT DISTINCT jerarquia_nivel_2_2 FROM PUNTOS_INTERES1 WHERE jerarquia_nivel_2_2 IS NOT NULL AND jerarquia_nivel_2_2 != '' ORDER BY jerarquia_nivel_2_2"
    data = query_catalog_or_fallback("CAT_SUBTIPO_NEGOCIO", "subtipo_negocio", fallback)
    return jsonify(data)

@atencion_cliente_bp.route('/api/pdv/canales', methods=['GET', 'POST'])
@login_required
@verificar_rol_atencion_cliente
def manage_canales():
    """Obtener todas las clasificaciones de canal o crear una nueva inline"""
    if request.method == 'POST':
        try:
            data = request.get_json()
            valor = data.get('valor', '').strip()
            if not valor:
                return jsonify({"success": False, "message": "El nombre del canal es requerido"}), 400
            
            check_table = execute_query("SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'CAT_CANAL_VENTA'", fetch_one=True)
            table_exists = check_table > 0 if isinstance(check_table, int) else (check_table[0] > 0 if check_table else False)
            
            if table_exists:
                cols = get_table_columns("CAT_CANAL_VENTA")
                text_col = get_text_column(cols)
                
                dup = execute_query(f"SELECT COUNT(*) FROM CAT_CANAL_VENTA WHERE [{text_col}] = ?", (valor,), fetch_one=True)
                dup_count = dup > 0 if isinstance(dup, int) else (dup[0] > 0 if dup else False)
                if dup_count:
                    return jsonify({"success": True, "message": "El canal ya existe"})
                
                execute_query(f"INSERT INTO CAT_CANAL_VENTA ([{text_col}]) VALUES (?)", (valor,), commit=True)
                return jsonify({"success": True, "message": "Canal creado exitosamente"})
            return jsonify({"success": True, "message": "Valor guardado localmente (tabla catálogo no existe)"})
        except Exception as e:
            current_app.logger.error(f"Error creando canal: {str(e)}")
            return jsonify({"success": False, "message": str(e)}), 500
            
    # GET method
    fallback = "SELECT DISTINCT clasificacion_de_canal FROM PUNTOS_INTERES1 WHERE clasificacion_de_canal IS NOT NULL AND clasificacion_de_canal != '' ORDER BY clasificacion_de_canal"
    data = query_catalog_or_fallback("CAT_CANAL_VENTA", "canal_venta", fallback)
    if not data:
        data = ["Moderno", "Tradicional"]
    return jsonify(data)

@atencion_cliente_bp.route('/api/pdv/alcances', methods=['GET', 'POST'])
@login_required
@verificar_rol_atencion_cliente
def manage_alcances():
    """Obtener todos los niveles de alcance o crear uno nuevo inline"""
    if request.method == 'POST':
        try:
            data = request.get_json()
            valor = data.get('valor', '').strip()
            if not valor:
                return jsonify({"success": False, "message": "El nivel de alcance es requerido"}), 400
            
            check_table = execute_query("SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'CAT_ALCANCE'", fetch_one=True)
            table_exists = check_table > 0 if isinstance(check_table, int) else (check_table[0] > 0 if check_table else False)
            
            if table_exists:
                cols = get_table_columns("CAT_ALCANCE")
                text_col = get_text_column(cols)
                
                dup = execute_query(f"SELECT COUNT(*) FROM CAT_ALCANCE WHERE [{text_col}] = ?", (valor,), fetch_one=True)
                dup_count = dup > 0 if isinstance(dup, int) else (dup[0] > 0 if dup else False)
                if dup_count:
                    return jsonify({"success": True, "message": "El alcance ya existe"})
                
                execute_query(f"INSERT INTO CAT_ALCANCE ([{text_col}]) VALUES (?)", (valor,), commit=True)
                return jsonify({"success": True, "message": "Alcance creado exitosamente"})
            return jsonify({"success": True, "message": "Valor guardado localmente (tabla catálogo no existe)"})
        except Exception as e:
            current_app.logger.error(f"Error creando alcance: {str(e)}")
            return jsonify({"success": False, "message": str(e)}), 500
            
    # GET method
    fallback = "SELECT DISTINCT nivel_de_alcance FROM PUNTOS_INTERES1 WHERE nivel_de_alcance IS NOT NULL AND nivel_de_alcance != '' ORDER BY nivel_de_alcance"
    data = query_catalog_or_fallback("CAT_ALCANCE", "alcance", fallback)
    if not data:
        data = ["Local", "Regional", "Nacional", "Internacional"]
    return jsonify(data)

@atencion_cliente_bp.route('/api/pdv/localidades', methods=['GET', 'POST'])
@login_required
@verificar_rol_atencion_cliente
def manage_localidades():
    """Obtener todas las localidades o crear una nueva inline"""
    if request.method == 'POST':
        try:
            data = request.get_json()
            valor = data.get('valor', '').strip()
            if not valor:
                return jsonify({"success": False, "message": "El nombre de la localidad es requerido"}), 400
            
            # Localidad es campo libre en PUNTOS_INTERES1, no hay tabla CAT_ local,
            # pero devolvemos success para simular la persistencia local de la creación inline.
            return jsonify({"success": True, "message": "Localidad agregada correctamente"})
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500
            
    # GET method
    try:
        query = """
        SELECT DISTINCT localidad
        FROM PUNTOS_INTERES1
        WHERE localidad IS NOT NULL AND localidad != ''
        ORDER BY localidad
        """
        localidades = execute_query(query)
        return jsonify([row[0] for row in localidades if row[0]])
    except Exception as e:
        current_app.logger.error(f"Error obteniendo localidades: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@atencion_cliente_bp.route('/api/pdv/ciudades-por-departamento/<string:departamento>')
@login_required
@verificar_rol_atencion_cliente
def get_ciudades_por_departamento(departamento):
    """Obtener ciudades por departamento"""
    try:
        check_query = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'CAT_CIUDADES'"
        exists = execute_query(check_query, fetch_one=True)
        table_exists = exists > 0 if isinstance(exists, int) else (exists[0] > 0 if exists else False)
        
        if table_exists:
            cols = get_table_columns("CAT_CIUDADES")
            city_col = get_text_column(cols)
            
            dept_col = None
            for c in cols:
                if c.lower() in ('departamento', 'id_departamento', 'departamento_id', 'estado', 'id_estado'):
                    dept_col = c
                    break
            
            if city_col and dept_col:
                if dept_col.lower() in ('id_departamento', 'departamento_id') and 'CAT_DEPARTAMENTOS' in [t[0] for t in execute_query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES")]:
                    dept_cols = get_table_columns("CAT_DEPARTAMENTOS")
                    dept_name_col = get_text_column(dept_cols)
                    
                    query = f"""
                    SELECT DISTINCT c.[{city_col}]
                    FROM [CAT_CIUDADES] c
                    JOIN [CAT_DEPARTAMENTOS] d ON c.[{dept_col}] = d.[id]
                    WHERE d.[{dept_name_col}] = ? AND c.[{city_col}] IS NOT NULL AND c.[{city_col}] != ''
                    ORDER BY c.[{city_col}]
                    """
                    res = execute_query(query, (departamento,))
                    if res:
                        return jsonify([r[0] for r in res if r[0]])
                else:
                    query = f"""
                    SELECT DISTINCT [{city_col}] 
                    FROM [CAT_CIUDADES] 
                    WHERE [{dept_col}] = ? AND [{city_col}] IS NOT NULL AND [{city_col}] != '' 
                    ORDER BY [{city_col}]
                    """
                    res = execute_query(query, (departamento,))
                    if res:
                        return jsonify([r[0] for r in res if r[0]])
        
        # Fallback
        fallback = "SELECT DISTINCT ciudad FROM PUNTOS_INTERES1 WHERE departamento = ? AND ciudad IS NOT NULL AND ciudad != '' ORDER BY ciudad"
        res = execute_query(fallback, (departamento,))
        return jsonify([row[0] for row in res if row[0]])
    except Exception as e:
        current_app.logger.error(f"Error obteniendo ciudades por departamento: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@atencion_cliente_bp.route('/api/pdv/jerarquias-n2_2-por-n2/<string:jerarquia_n2>')
@login_required
@verificar_rol_atencion_cliente
def get_jerarquias_n2_2_por_n2(jerarquia_n2):
    """Obtener jerarquías nivel 2_2 por jerarquía nivel 2"""
    try:
        check_query = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'CAT_SUBTIPO_NEGOCIO'"
        exists = execute_query(check_query, fetch_one=True)
        table_exists = exists > 0 if isinstance(exists, int) else (exists[0] > 0 if exists else False)
        
        if table_exists:
            cols = get_table_columns("CAT_SUBTIPO_NEGOCIO")
            subtipo_col = get_text_column(cols)
            
            tipo_col = None
            for c in cols:
                if c.lower() in ('tipo', 'id_tipo', 'tipo_id', 'tipo_negocio', 'id_tipo_negocio', 'tipo_negocio_id', 'jerarquia_nivel_2'):
                    tipo_col = c
                    break
            
            if subtipo_col and tipo_col:
                if tipo_col.lower() in ('id_tipo', 'tipo_id', 'id_tipo_negocio', 'tipo_negocio_id') and 'CAT_TIPO_NEGOCIO' in [t[0] for t in execute_query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES")]:
                    tipo_cols = get_table_columns("CAT_TIPO_NEGOCIO")
                    tipo_name_col = get_text_column(tipo_cols)
                    
                    query = f"""
                    SELECT DISTINCT s.[{subtipo_col}]
                    FROM [CAT_SUBTIPO_NEGOCIO] s
                    JOIN [CAT_TIPO_NEGOCIO] t ON s.[{tipo_col}] = t.[id]
                    WHERE t.[{tipo_name_col}] = ? AND s.[{subtipo_col}] IS NOT NULL AND s.[{subtipo_col}] != ''
                    ORDER BY s.[{subtipo_col}]
                    """
                    res = execute_query(query, (jerarquia_n2,))
                    if res:
                        return jsonify([r[0] for r in res if r[0]])
                else:
                    query = f"""
                    SELECT DISTINCT [{subtipo_col}] 
                    FROM [CAT_SUBTIPO_NEGOCIO] 
                    WHERE [{tipo_col}] = ? AND [{subtipo_col}] IS NOT NULL AND [{subtipo_col}] != '' 
                    ORDER BY [{subtipo_col}]
                    """
                    res = execute_query(query, (jerarquia_n2,))
                    if res:
                        return jsonify([r[0] for r in res if r[0]])
        
        # Fallback
        fallback = """
        SELECT DISTINCT jerarquia_nivel_2_2
        FROM PUNTOS_INTERES1
        WHERE jerarquia_nivel_2 = ? AND jerarquia_nivel_2_2 IS NOT NULL AND jerarquia_nivel_2_2 != ''
        ORDER BY jerarquia_nivel_2_2
        """
        res = execute_query(fallback, (jerarquia_n2,))
        return jsonify([row[0] for row in res if row[0]])
    except Exception as e:
        current_app.logger.error(f"Error obteniendo jerarquías nivel 2_2 por nivel 2: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@atencion_cliente_bp.route('/api/pdv/next-identificador/<string:jerarquia_n2_2>')
@login_required
@verificar_rol_atencion_cliente
def get_next_identificador(jerarquia_n2_2):
    """Obtener el siguiente identificador para una jerarquía nivel 2_2"""
    try:
        query = """
        SELECT identificador
        FROM PUNTOS_INTERES1
        WHERE jerarquia_nivel_2_2 = ?
        ORDER BY identificador DESC
        """
        resultados = execute_query(query, (jerarquia_n2_2,))
        
        if resultados:
            ultimo_identificador = resultados[0][0]
            if ultimo_identificador and len(ultimo_identificador) >= 7:
                prefijo = ultimo_identificador[:3]
                numero_str = ultimo_identificador[3:7]
                try:
                    numero = int(numero_str)
                    siguiente_numero = numero + 1
                    siguiente_identificador = f"{prefijo}{siguiente_numero:04d}"
                    return jsonify({
                        "success": True,
                        "identificador": siguiente_identificador,
                        "prefijo_existente": prefijo,
                        "ultimo_numero": numero
                    })
                except (ValueError, IndexError):
                    pass
        
        # Si no hay identificadores existentes o hubo error
        iniciales = ''.join(jerarquia_n2_2.split())[:3].upper()
        if len(iniciales) < 3:
            iniciales = iniciales.ljust(3, 'X')
        
        query_prefijo = """
        SELECT identificador
        FROM PUNTOS_INTERES1
        WHERE identificador LIKE ?
        ORDER BY identificador DESC
        """
        resultados_prefijo = execute_query(query_prefijo, (f"{iniciales}%",))
        max_numero = 0
        if resultados_prefijo:
            for row in resultados_prefijo:
                identificador = row[0]
                if identificador and identificador.startswith(iniciales) and len(identificador) >= 7:
                    try:
                        numero_str = identificador[len(iniciales):len(iniciales)+4]
                        numero = int(numero_str)
                        if numero > max_numero:
                            max_numero = numero
                    except (ValueError, IndexError):
                        continue
        
        siguiente_numero = max_numero + 1
        siguiente_identificador = f"{iniciales}{siguiente_numero:04d}"
        
        return jsonify({
            "success": True,
            "identificador": siguiente_identificador,
            "prefijo_nuevo": iniciales,
            "es_nuevo_prefijo": True
        })
    except Exception as e:
        current_app.logger.error(f"Error obteniendo siguiente identificador: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@atencion_cliente_bp.route('/api/pdv/sugerencias-direccion')
@login_required
@verificar_rol_atencion_cliente
def get_sugerencias_direccion():
    """Obtener sugerencias de direcciones desde Nominatim (OpenStreetMap)"""
    try:
        query = request.args.get('q', '')
        if not query or len(query) < 3:
            return jsonify([])
        
        # Usar Nominatim API
        import urllib.parse
        import requests
        
        url = f"https://nominatim.openstreetmap.org/search"
        params = {
            'q': query,
            'format': 'json',
            'addressdetails': 1,
            'limit': 10,
            'countrycodes': 've',
            'accept-language': 'es'
        }
        headers = {
            'User-Agent': 'AppWeb/1.0 (atencioncliente@example.com)'
        }
        
        response = requests.get(url, params=params, headers=headers)
        if response.status_code == 200:
            resultados = response.json()
            sugerencias = []
            for resultado in resultados:
                display_name = resultado.get('display_name', '')
                lat = resultado.get('lat', '')
                lon = resultado.get('lon', '')
                address = resultado.get('address', {})
                calle = address.get('road', '')
                numero = address.get('house_number', '')
                ciudad = address.get('city', address.get('town', address.get('village', '')))
                estado = address.get('state', '')
                
                direccion_formateada = ''
                if calle:
                    direccion_formateada += calle
                if numero:
                    direccion_formateada += f' {numero}'
                if ciudad:
                    if direccion_formateada:
                        direccion_formateada += f', {ciudad}'
                    else:
                        direccion_formateada = ciudad
                if estado:
                    if direccion_formateada:
                        direccion_formateada += f', {estado}'
                    else:
                        direccion_formateada = estado
                
                if not direccion_formateada:
                    direccion_formateada = display_name[:100]
                
                sugerencias.append({
                    "display_name": display_name,
                    "direccion": direccion_formateada,
                    "latitud": lat,
                    "longitud": lon,
                    "calle": calle,
                    "numero": numero,
                    "ciudad": ciudad,
                    "estado": estado
                })
            return jsonify(sugerencias)
        else:
            return jsonify([])
    except Exception as e:
        current_app.logger.error(f"Error obteniendo sugerencias de dirección: {str(e)}")
        return jsonify([])

# ===================================================================
# GESTIÓN DE PRODUCTOS (PLACEHOLDER - IMPLEMENTAR SEGÚN NECESIDADES)
# ===================================================================


# ===================================================================
# SOLICITUDES DE USUARIOS (PLACEHOLDER - IMPLEMENTAR SEGÚN NECESIDADES)
# ===================================================================
@atencion_cliente_bp.route('/solicitudes-usuarios')
@login_required
@verificar_rol_atencion_cliente
def solicitudes_usuarios():
    """Página de solicitudes de usuarios para Atención al Cliente"""
    return render_template('atencion_cliente_solicitudes.html')

@atencion_cliente_bp.route('/api/solicitudes-pendientes')
@login_required
@verificar_rol_atencion_cliente
def get_solicitudes_pendientes():
    """Obtener todas las solicitudes pendientes - CORREGIDO"""
    try:
        query = """SELECT id_solicitud, tipo_solicitud, datos, estado, id_solicitante, fecha_solicitud
                   FROM SOLICITUDES
                   WHERE estado = 'pendiente'
                   ORDER BY fecha_solicitud DESC"""
        requests = execute_query(query)
        formatted_requests = []
        for req in requests:
            # Obtener información del solicitante
            user_query = "SELECT username, rol FROM USUARIOS WHERE id_usuario = ?"
            requester = execute_query(user_query, (req[4],), fetch_one=True)
            
            # ✅ MANEJO SEGURO DE DATOS JSON (evita errores si es NULL o inválido)
            try:
                data_parsed = json.loads(req[2]) if req[2] else {}
            except (json.JSONDecodeError, TypeError) as e:
                current_app.logger.warning(f"⚠️ Datos inválidos en solicitud {req[0]}: {str(e)}. Usando diccionario vacío.")
                data_parsed = {}
            
            formatted_requests.append({
                "id": req[0],
                "type": req[1],
                "data": data_parsed,  # ✅ USAR VARIABLE SEGURA
                "status": req[3],
                "requester": {
                    "id": req[4],
                    "username": requester[0] if requester else "Desconocido",
                    "role": requester[1] if requester else "Desconocido"
                },
                "date": req[5].isoformat() if req[5] else None
            })
        
        return jsonify({
            "success": True,
            "requests": formatted_requests
        })
        
    except Exception as e:
        current_app.logger.error(f"Error obteniendo solicitudes: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "message": f"Error al obtener solicitudes: {str(e)}"
        }), 500

@atencion_cliente_bp.route('/api/solicitudes-aprobar/<int:request_id>', methods=['POST'])
@login_required
@verificar_rol_atencion_cliente
def aprobar_solicitud(request_id):
    """Aprobar una solicitud - CORREGIDO CON MANEJO SEGURO DE JSON"""
    try:
        # Obtener la solicitud
        query = "SELECT tipo_solicitud, datos FROM SOLICITUDES WHERE id_solicitud = ? AND estado = 'pendiente'"
        request_data = execute_query(query, (request_id,), fetch_one=True)
        
        if not request_data:
            return jsonify({
                "success": False,
                "message": "Solicitud no encontrada o ya procesada"
            }), 404
        
        tipo_solicitud = request_data[0]
        datos_json = request_data[1]
        
        # ✅ MANEJO SEGURO DE DATOS JSON (evita errores si es NULL, vacío o inválido)
        try:
            if datos_json is None or str(datos_json).strip() == '' or str(datos_json).lower() == 'null':
                current_app.logger.warning(f"⚠️ Datos NULL/vacíos en solicitud {request_id}. Usando diccionario vacío.")
                datos = {}
            else:
                datos = json.loads(str(datos_json))
        except (json.JSONDecodeError, TypeError, ValueError) as e:
            current_app.logger.error(f"❌ Error parseando datos de solicitud {request_id}: {str(e)}. Raw: {datos_json}")
            return jsonify({
                "success": False,
                "message": f"Error al procesar los datos de la solicitud. Formato JSON inválido. Detalle: {str(e)}"
            }), 400
        
        # Procesar según el tipo de solicitud
        if tipo_solicitud == 'creacion_usuario':
            # Validar campos requeridos
            username = datos.get("username")
            email = datos.get("email")
            password = datos.get("password")
            role = datos.get("role")
            
            if not all([username, email, password, role]):
                return jsonify({
                    "success": False,
                    "message": "Faltan campos requeridos: username, email, password o role"
                }), 400
            
            # Hashear la contraseña
            try:
                password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            except Exception as e:
                current_app.logger.error(f"Error hasheando contraseña: {str(e)}")
                return jsonify({
                    "success": False,
                    "message": "Error al procesar la contraseña"
                }), 500
            
            # Insertar nuevo usuario según rol
            if role == 'client':
                client_id = datos.get("client_id")
                if not client_id:
                    return jsonify({
                        "success": False,
                        "message": "client_id es requerido para rol client"
                    }), 400
                insert_query = "INSERT INTO USUARIOS (username, email, password_hash, rol, id_cliente) VALUES (?, ?, ?, ?, ?)"
                params = (username, email, password_hash, role, client_id)
            elif role == 'analyst':
                analyst_id = datos.get("analyst_id")
                if not analyst_id:
                    return jsonify({
                        "success": False,
                        "message": "analyst_id es requerido para rol analyst"
                    }), 400
                insert_query = "INSERT INTO USUARIOS (username, email, password_hash, rol, id_analista) VALUES (?, ?, ?, ?, ?)"
                params = (username, email, password_hash, role, analyst_id)
            elif role == 'supervisor':
                supervisor_id = datos.get("supervisor_id")
                if not supervisor_id:
                    return jsonify({
                        "success": False,
                        "message": "supervisor_id es requerido para rol supervisor"
                    }), 400
                insert_query = "INSERT INTO USUARIOS (username, email, password_hash, rol, id_supervisor) VALUES (?, ?, ?, ?, ?)"
                params = (username, email, password_hash, role, supervisor_id)
            else:  # admin u otros roles
                insert_query = "INSERT INTO USUARIOS (username, email, password_hash, rol) VALUES (?, ?, ?, ?)"
                params = (username, email, password_hash, role)
            
            result = execute_query(insert_query, params, commit=True)
            if not (result and result.get('rowcount', 0) > 0):
                return jsonify({
                    "success": False,
                    "message": "No se pudo crear el usuario en la base de datos"
                }), 500
                
        elif tipo_solicitud == 'eliminacion_usuario':
            username = datos.get("username")
            if not username:
                return jsonify({
                    "success": False,
                    "message": "username es requerido para eliminar usuario"
                }), 400
            
            delete_query = "DELETE FROM USUARIOS WHERE username = ?"
            result = execute_query(delete_query, (username,), commit=True)
            if not (result and result.get('rowcount', 0) > 0):
                return jsonify({
                    "success": False,
                    "message": "No se pudo eliminar el usuario (puede que no exista)"
                }), 404
                
        elif tipo_solicitud == 'creacion_mercaderista':
            nombre = datos.get("nombre")
            cedula = datos.get("cedula")
            if not nombre or not cedula:
                return jsonify({
                    "success": False,
                    "message": "nombre y cedula son requeridos para crear mercaderista"
                }), 400
            
            insert_query = "INSERT INTO MERCADERISTAS (nombre, cedula, activo) VALUES (?, ?, ?)"
            result = execute_query(insert_query, (nombre, cedula, 1), commit=True)
            if not (result and result.get('rowcount', 0) > 0):
                return jsonify({
                    "success": False,
                    "message": "No se pudo crear el mercaderista"
                }), 500
                
        elif tipo_solicitud == 'eliminacion_mercaderista':
            cedula = datos.get("cedula")
            if not cedula:
                return jsonify({
                    "success": False,
                    "message": "cedula es requerida para eliminar mercaderista"
                }), 400
            
            # Obtener id_mercaderista
            mercaderista_query = "SELECT id_mercaderista FROM MERCADERISTAS WHERE cedula = ?"
            mercaderista = execute_query(mercaderista_query, (cedula,), fetch_one=True)
            if not mercaderista:
                return jsonify({
                    "success": False,
                    "message": "No existe el mercaderista con la cédula proporcionada"
                }), 404
            
            mercaderista_id = mercaderista[0]
            
            # Verificar visitas asociadas
            visitas_query = "SELECT COUNT(*) FROM VISITAS_MERCADERISTA WHERE id_mercaderista = ?"
            count_visitas = execute_query(visitas_query, (mercaderista_id,), fetch_one=True)
            if count_visitas and count_visitas[0] > 0:
                return jsonify({
                    "success": False,
                    "message": "No se puede eliminar el mercaderista porque tiene visitas asociadas."
                }), 400
            
            # Eliminar mercaderista
            delete_query = "DELETE FROM MERCADERISTAS WHERE cedula = ?"
            result = execute_query(delete_query, (cedula,), commit=True)
            if not (result and result.get('rowcount', 0) > 0):
                return jsonify({
                    "success": False,
                    "message": "No se pudo eliminar el mercaderista"
                }), 500
                
        elif tipo_solicitud == 'cambio_estado_mercaderista':
            cedula = datos.get("cedula")
            action = datos.get("action")
            if not cedula or not action:
                return jsonify({
                    "success": False,
                    "message": "cedula y action son requeridos para cambiar estado de mercaderista"
                }), 400
            
            activo_value = 1 if action == "enable" else 0
            update_query = "UPDATE MERCADERISTAS SET activo = ? WHERE cedula = ?"
            result = execute_query(update_query, (activo_value, cedula), commit=True)
            if not (result and result.get('rowcount', 0) > 0):
                return jsonify({
                    "success": False,
                    "message": "No se pudo actualizar el estado del mercaderista"
                }), 500
        else:
            current_app.logger.warning(f"Tipo de solicitud no reconocido: {tipo_solicitud}")
            return jsonify({
                "success": False,
                "message": f"Tipo de solicitud '{tipo_solicitud}' no soportado"
            }), 400

        # ✅ Actualizar estado de la solicitud SOLO si todo fue exitoso
        update_query = """UPDATE SOLICITUDES 
                        SET estado = 'aprobada', id_aprobador = ?, fecha_respuesta = GETDATE()
                        WHERE id_solicitud = ?"""
        execute_query(update_query, (current_user.id, request_id), commit=True)
        
        current_app.logger.info(f"✅ Solicitud {request_id} aprobada exitosamente por {current_user.username}")
        return jsonify({
            "success": True,
            "message": "Solicitud aprobada exitosamente"
        })
        
    except Exception as e:
        current_app.logger.error(f"❌ Error CRÍTICO aprobando solicitud {request_id}: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "message": f"Error interno al aprobar solicitud: {str(e)}"
        }), 500

@atencion_cliente_bp.route('/api/solicitudes-rechazar/<int:request_id>', methods=['POST'])
@login_required
@verificar_rol_atencion_cliente
def rechazar_solicitud(request_id):
    """Rechazar una solicitud"""
    data = request.get_json()
    comment = data.get('comment', '')
    
    try:
        # Actualizar estado de la solicitud
        update_query = """UPDATE SOLICITUDES 
                        SET estado = 'rechazada', id_aprobador = ?, 
                            fecha_respuesta = GETDATE(), comentario = ?
                        WHERE id_solicitud = ?"""
        result = execute_query(update_query, (current_user.id, comment, request_id), commit=True)
        
        if result and result.get('rowcount', 0) > 0:
            return jsonify({
                "success": True,
                "message": "Solicitud rechazada"
            })
        else:
            return jsonify({
                "success": False,
                "message": "No se pudo rechazar la solicitud"
            }), 500
            
    except Exception as e:
        current_app.logger.error(f"Error rechazando solicitud: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Error al rechazar solicitud: {str(e)}"
        }), 500

@atencion_cliente_bp.route('/api/solicitudes-usuarios')
@login_required
@verificar_rol_atencion_cliente
def get_solicitudes_usuarios():
    """Obtener todas las solicitudes de usuarios"""
    try:
        # IMPLEMENTAR SEGÚN TU ESQUEMA DE BASE DE DATOS
        query = """
        SELECT id_solicitud, tipo_solicitud, datos, estado, 
               fecha_creacion, id_solicitante
        FROM SOLICITUDES
        ORDER BY fecha_creacion DESC
        """
        solicitudes = execute_query(query)
        solicitudes_list = [{
            "id": row[0],
            "tipo": row[1],
            "datos": row[2],
            "estado": row[3],
            "fecha_creacion": row[4].strftime('%Y-%m-%d %H:%M:%S') if row[4] else None,
            "id_solicitante": row[5]
        } for row in solicitudes]
        return jsonify(solicitudes_list)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo solicitudes: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

# ===================================================================
# REGISTRAR BLUEPRINT EN LA APLICACIÓN
# ===================================================================
def register_atencion_cliente_routes(app):
    """Registrar el blueprint de Atención al Cliente en la aplicación"""
    app.register_blueprint(atencion_cliente_bp)
    current_app.logger.info("✅ Blueprint de Atención al Cliente registrado correctamente")

# ===================================================================
# GESTIÓN DE PRODUCTOS
# ===================================================================
@atencion_cliente_bp.route('/gestion-productos')
@login_required
@verificar_rol_atencion_cliente
def gestion_productos():
    """Página de gestión de productos para Atención al Cliente"""
    return render_template('atencion_cliente_productos.html')

@atencion_cliente_bp.route('/api/productos')
@login_required
@verificar_rol_atencion_cliente
def get_productos():
    """Obtener todos los productos"""
    try:
        query = """
        SELECT ID_PRODUCT, SKUs, Categoria, Fabricante,
               Tipo_de_servicio, Tipo_de_fabricante, cod_bar, inagotable
        FROM PRODUCTS
        ORDER BY SKUs
        """
        productos = execute_query(query)
        productos_list = []
        for row in productos:
            productos_list.append({
                "id_product": row[0],
                "skus": row[1],
                "categoria": row[2],
                "fabricante": row[3],
                "tipo_de_servicio": row[4],
                "tipo_de_fabricante": row[5],
                "cod_bar": row[6],
                "inagotable": bool(row[7]) if row[7] is not None else False
            })
        return jsonify(productos_list)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo productos: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@atencion_cliente_bp.route('/api/productos/<int:id>')
@login_required
@verificar_rol_atencion_cliente
def get_producto(id):
    """Obtener un producto específico"""
    try:
        query = """
        SELECT ID_PRODUCT, SKUs, Categoria, Fabricante,
               Tipo_de_servicio, Tipo_de_fabricante, cod_bar, inagotable
        FROM PRODUCTS
        WHERE ID_PRODUCT = ?
        """
        producto = execute_query(query, (id,), fetch_one=True)
        if not producto:
            return jsonify({"error": "Producto no encontrado"}), 404
        return jsonify({
            "id_product": producto[0],
            "skus": producto[1],
            "categoria": producto[2],
            "fabricante": producto[3],
            "tipo_de_servicio": producto[4],
            "tipo_de_fabricante": producto[5],
            "cod_bar": producto[6],
            "inagotable": bool(producto[7]) if producto[7] is not None else False
        })
    except Exception as e:
        current_app.logger.error(f"Error obteniendo producto: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@atencion_cliente_bp.route('/api/productos', methods=['POST'])
@login_required
@verificar_rol_atencion_cliente
def crear_producto():
    """Crear un nuevo producto"""
    try:
        data = request.get_json()
        # Validar campos requeridos
        if not data.get('skus'):
            return jsonify({"error": "SKU es requerido"}), 400
        
        query = """
        INSERT INTO PRODUCTS (SKUs, Categoria, Fabricante,
                             Tipo_de_servicio, Tipo_de_fabricante, cod_bar, inagotable)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        params = (
            data['skus'],
            data.get('categoria'),
            data.get('fabricante'),
            data.get('tipo_de_servicio'),
            data.get('tipo_de_fabricante'),
            data.get('cod_bar'),
            1 if data.get('inagotable', False) else 0
        )
        execute_query(query, params, commit=True)
        return jsonify({"success": True, "message": "Producto creado exitosamente"})
    except Exception as e:
        current_app.logger.error(f"Error creando producto: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@atencion_cliente_bp.route('/api/productos/<int:id>', methods=['PUT'])
@login_required
@verificar_rol_atencion_cliente
def actualizar_producto(id):
    """Actualizar un producto"""
    try:
        data = request.get_json()
        
        query = """
        UPDATE PRODUCTS 
        SET SKUs = ?, Categoria = ?, Fabricante = ?, 
            Tipo_de_servicio = ?, Tipo_de_fabricante = ?, cod_bar = ?, inagotable = ?
        WHERE ID_PRODUCT = ?
        """
        
        params = (
            data.get('skus'),
            data.get('categoria'),
            data.get('fabricante'),
            data.get('tipo_de_servicio'),
            data.get('tipo_de_fabricante'),
            data.get('cod_bar'),
            1 if data.get('inagotable', False) else 0,
            id
        )
        
        execute_query(query, params, commit=True)
        
        return jsonify({"success": True, "message": "Producto actualizado exitosamente"})
    
    except Exception as e:
        current_app.logger.error(f"Error actualizando producto: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@atencion_cliente_bp.route('/api/productos/<int:id>', methods=['DELETE'])
@login_required
@verificar_rol_atencion_cliente
def eliminar_producto(id):
    """Eliminar un producto"""
    try:
        query = "DELETE FROM PRODUCTS WHERE ID_PRODUCT = ?"
        execute_query(query, (id,), commit=True)
        
        return jsonify({"success": True, "message": "Producto eliminado exitosamente"})
    
    except Exception as e:
        current_app.logger.error(f"Error eliminando producto: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@atencion_cliente_bp.route('/api/productos/categorias')
@login_required
@verificar_rol_atencion_cliente
def get_categorias():
    """Obtener todas las categorías distintas"""
    try:
        query = "SELECT DISTINCT Categoria FROM PRODUCTS WHERE Categoria IS NOT NULL ORDER BY Categoria"
        categorias = execute_query(query)
        
        return jsonify([row[0] for row in categorias if row[0]])
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo categorías: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@atencion_cliente_bp.route('/api/productos/fabricantes')
@login_required
@verificar_rol_atencion_cliente
def get_fabricantes():
    """Obtener todos los fabricantes (clientes)"""
    try:
        query = "SELECT DISTINCT cliente FROM CLIENTES ORDER BY cliente"
        fabricantes = execute_query(query)
        
        return jsonify([row[0] for row in fabricantes if row[0]])
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo fabricantes: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@atencion_cliente_bp.route('/api/productos/tipos-servicio')
@login_required
@verificar_rol_atencion_cliente
def get_tipos_servicio():
    """Obtener todos los tipos de servicio distintos"""
    try:
        query = "SELECT DISTINCT Tipo_de_servicio FROM PRODUCTS WHERE Tipo_de_servicio IS NOT NULL ORDER BY Tipo_de_servicio"
        tipos = execute_query(query)
        
        return jsonify([row[0] for row in tipos if row[0]])
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo tipos de servicio: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500

@atencion_cliente_bp.route('/api/productos/tipos-fabricante')
@login_required
@verificar_rol_atencion_cliente
def get_tipos_fabricante():
    """Obtener todos los tipos de fabricante distintos"""
    try:
        query = "SELECT DISTINCT Tipo_de_fabricante FROM PRODUCTS WHERE Tipo_de_fabricante IS NOT NULL ORDER BY Tipo_de_fabricante"
        tipos = execute_query(query)
        
        return jsonify([row[0] for row in tipos if row[0]])
    
    except Exception as e:
        current_app.logger.error(f"Error obteniendo tipos de fabricante: {str(e)}")
        return jsonify({"error": str(e), "message": "Error interno del servidor"}), 500