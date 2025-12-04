# app/routes/merchandisers.py
from flask import Blueprint, request, jsonify, render_template, current_app
from flask_login import login_required, current_user
from app.utils.database import execute_query
from app.utils.auth import get_user_id_by_username
import pyodbc
import datetime
import json

merchandisers_bp = Blueprint('merchandisers', __name__)

@merchandisers_bp.route('/api/add-merchandiser', methods=['POST'])
@login_required
def add_merchandiser():
    # Verificar si es administrador
    if current_user.rol == 'admin':
        return add_merchandiser_directly()
    elif current_user.rol == 'analyst':
        return add_merchandiser_request()
    else:
        return jsonify({
            "success": False,
            "message": "Acceso denegado: Rol no autorizado para crear mercaderistas"
        }), 403

def add_merchandiser_directly():
    # Obtener datos del request
    data = request.get_json()
    nombre = data.get('nombre')
    cedula = data.get('cedula')
    
    # Validar datos
    if not nombre or not cedula:
        return jsonify({
            "success": False,
            "message": "Nombre y cédula son requeridos"
        }), 400

    try:
        # Verificar si la cédula ya existe
        check_query = "SELECT COUNT(*) FROM MERCADERISTAS WHERE cedula = ?"
        count_result = execute_query(check_query, (cedula,), fetch_one=True)
        if count_result and count_result[0] > 0:
            return jsonify({
                "success": False,
                "message": "La cédula ya está registrada"
            }), 409

        # Insertar nuevo mercaderista
        insert_query = "INSERT INTO MERCADERISTAS (nombre, cedula) VALUES (?, ?)"
        result = execute_query(insert_query, (nombre, cedula), commit=True)
        
        if result and result.get('rowcount', 0) > 0:
            return jsonify({
                "success": True,
                "message": f"Mercaderista '{nombre}' creado exitosamente"
            })
        else:
            return jsonify({
                "success": False,
                "message": "No se pudo crear el mercaderista"
            })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al crear mercaderista: {str(e)}"
        }), 500

def add_merchandiser_request():
    try:
        data = request.get_json()
        nombre = data.get('nombre')
        cedula = data.get('cedula')
        
        # Validar datos
        if not nombre or not cedula:
            return jsonify({
                "success": False,
                "message": "Nombre y cédula son requeridos"
            }), 400

        # Verificar si la cédula ya existe
        check_query = "SELECT COUNT(*) FROM MERCADERISTAS WHERE cedula = ?"
        count_result = execute_query(check_query, (cedula,), fetch_one=True)
        if count_result and count_result[0] > 0:
            return jsonify({
                "success": False,
                "message": "La cédula ya está registrada"
            }), 409

        # Preparar datos para la solicitud
        request_data = {
            "nombre": nombre,
            "cedula": cedula
        }
        
        # Insertar solicitud en la tabla SOLICITUDES
        request_data_json = json.dumps(request_data)
        insert_query = """INSERT INTO SOLICITUDES 
                        (tipo_solicitud, datos, estado, id_solicitante)
                        VALUES ('creacion_mercaderista', ?, 'pendiente', ?)"""
        solicitante_id = get_user_id_by_username(current_user.username)
        result = execute_query(insert_query, (request_data_json, solicitante_id), commit=True)
        
        if result and result.get('rowcount', 0) > 0:
            return jsonify({
                "success": True,
                "message": "Solicitud de creación de mercaderista creada. Espera aprobación del administrador."
            })
        else:
            return jsonify({
                "success": False, 
                "message": "No se pudo crear la solicitud"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al crear solicitud: {str(e)}"
        }), 500

@merchandisers_bp.route('/api/remove-merchandiser', methods=['POST'])
@login_required
def remove_merchandiser():
    # Verificar si es administrador
    if current_user.rol == 'admin':
        return remove_merchandiser_directly()
    elif current_user.rol == 'analyst':
        return remove_merchandiser_request()
    else:
        return jsonify({
            "success": False,
            "message": "Acceso denegado: Rol no autorizado para desactivar mercaderistas"
        }), 403

def remove_merchandiser_directly():
    data = request.get_json()
    cedula = data.get('cedula')
    
    if not cedula:
        return jsonify({
            "success": False,
            "message": "Cédula es requerida"
        }), 400
    
    try:
        # Verificar si existe el mercaderista y su estado actual
        check_query = """
        SELECT CAST(activo AS TINYINT) AS activo_int 
        FROM MERCADERISTAS 
        WHERE cedula = ?
        """
        estado_actual = execute_query(check_query, (cedula,), fetch_one=True)
        
        if not estado_actual:
            return jsonify({
                "success": False,
                "message": "No existe un mercaderista con esta cédula"
            }), 404
        
        # Si ya está inactivo
        if estado_actual[0] == 0:
            return jsonify({
                "success": True,
                "message": "El mercaderista ya estaba inactivo"
            })
        
        # Actualizar estado a inactivo (0)
        # 🔴 CORRECCIÓN IMPORTANTE - Usa 0 en lugar de 0x00 🔴
        update_query = "UPDATE MERCADERISTAS SET activo = ? WHERE cedula = ?"
        result = execute_query(update_query, (0, cedula), commit=True)
        
        if result and result.get('rowcount', 0) > 0:
            return jsonify({
                "success": True,
                "message": "Mercaderista desactivado exitosamente"
            })
        else:
            return jsonify({
                "success": False,
                "message": "No se pudo desactivar el mercaderista"
            })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error interno del servidor: {str(e)}"
        }), 500

def remove_merchandiser_request():
    try:
        data = request.get_json()
        cedula = data.get('cedula')
        
        # Validar datos
        if not cedula:
            return jsonify({
                "success": False,
                "message": "Cédula es requerida"
            }), 400

        # Verificar si existe el mercaderista
        check_query = "SELECT id_mercaderista, nombre FROM MERCADERISTAS WHERE cedula = ?"
        mercaderista = execute_query(check_query, (cedula,), fetch_one=True)
        
        if not mercaderista:
            return jsonify({
                "success": False,
                "message": "No existe un mercaderista con esta cédula"
            }), 404
        
        # Preparar datos para la solicitud
        request_data = {
            "cedula": cedula,
            "nombre": mercaderista[1]
        }
        
        # Insertar solicitud en la tabla SOLICITUDES
        request_data_json = json.dumps(request_data)
        insert_query = """INSERT INTO SOLICITUDES 
                        (tipo_solicitud, datos, estado, id_solicitante)
                        VALUES ('eliminacion_mercaderista', ?, 'pendiente', ?)"""
        solicitante_id = get_user_id_by_username(current_user.username)
        result = execute_query(insert_query, (request_data_json, solicitante_id), commit=True)
        
        if result and result.get('rowcount', 0) > 0:
            return jsonify({
                "success": True,
                "message": "Solicitud de desactivación de mercaderista creada. Espera aprobación del administrador."
            })
        else:
            return jsonify({
                "success": False, 
                "message": "No se pudo crear la solicitud"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al crear solicitud: {str(e)}"
        }), 500

@merchandisers_bp.route("/api/visit-merchandiser/<int:visit_id>")
@login_required
def get_visit_merchandiser(visit_id):
    try:
        query = """
            SELECT m.nombre
            FROM VISITAS_MERCADERISTA vm
            JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
            WHERE vm.id_visita = ?
        """
        result = execute_query(query, (visit_id,), fetch_one=True)
        
        if result:
            return jsonify({"nombre": result[0]})
        else:
            return jsonify({"nombre": "Desconocido"})
            
    except pyodbc.Error as e:
        return jsonify({
            "error": f"Error en la base de datos: {str(e)}"
        }), 500
        
    except Exception as e:
        return jsonify({
            "error": f"Error interno del servidor: {str(e)}"
        }), 500

@merchandisers_bp.route("/api/merchandisers")
@login_required
def get_all_merchandisers():
    try:
        query = "SELECT id_mercaderista, nombre, cedula FROM MERCADERISTAS ORDER BY nombre"
        results = execute_query(query)
        
        merchandisers = [{
            "id": row[0],
            "nombre": row[1],
            "cedula": row[2]
        } for row in results]
        
        return jsonify(merchandisers)
        
    except pyodbc.Error as e:
        return jsonify({
            "error": f"Error en la base de datos: {str(e)}"
        }), 500
        
    except Exception as e:
        return jsonify({
            "error": f"Error interno del servidor: {str(e)}"
        }), 500

@merchandisers_bp.route('/api/verify-merchandiser', methods=['POST'])
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
            WHERE cedula = ? 
            AND activo = 1
        """
        result = execute_query(query, (cedula,), fetch_one=True)
        
        if result:
            return jsonify({
                "success": True,
                "nombre": result[0],
                "cedula": result[1]
            })
        else:
            return jsonify({
                "success": False,
                "message": "Cédula no encontrada o mercaderista inactivo"
            }), 404
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al verificar mercaderista: {str(e)}"
        }), 500
    
@merchandisers_bp.route('/carga-mercaderista')
def carga_mercaderista():
    return render_template('carga-mercaderista.html')

@merchandisers_bp.route("/api/merchandiser-pending-visits/<int:cedula>")
def get_merchandiser_pending_visits(cedula):
    try:
        query = """
    SELECT 
        vm.id_visita,
        c.cliente,
        pin.punto_de_interes,
        m.nombre AS mercaderista,
        vm.fecha_visita AS fecha,
        vm.identificador_punto_interes,
        c.id_cliente AS cliente_id
    FROM VISITAS_MERCADERISTA vm
    JOIN CLIENTES c           ON vm.id_cliente = c.id_cliente
    JOIN PUNTOS_INTERES1 pin   ON vm.identificador_punto_interes = pin.identificador
    JOIN MERCADERISTAS m      ON vm.id_mercaderista = m.id_mercaderista
    WHERE m.cedula = ?
      AND vm.estado = 'Pendiente'
      AND NOT EXISTS (
          SELECT 1
          FROM BALANCES_TOTALES bt
          WHERE bt.ID_VISITA = vm.id_visita
      )
    ORDER BY vm.fecha_visita DESC
"""
        visits = execute_query(query, (cedula,))
        return jsonify([{
            "id": row[0],
            "cliente": row[1],
            "punto_interes": row[2],
            "mercaderista": row[3],
            "fecha": row[4].isoformat() if row[4] else None,
            "punto_id": row[5],
            "cliente_id": row[6]
        } for row in visits])
    except Exception as e:
        print(f"Error en merchandiser-pending-visits: {str(e)}")
        return jsonify({"error": str(e)}), 500

@merchandisers_bp.route("/api/cargar-datos-visita", methods=['POST'])
def cargar_datos_visita():
    try:
        data = request.get_json()

        # Validar campos requeridos
        required_fields = ['visitId', 'productos', 'fechaIngreso', 'fechaCarga', 'fechaFinalCarga']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "message": f"Campo {field} es requerido"
                }), 400

        visit_id = data['visitId']
        productos = data['productos']
        fecha_ingreso = data['fechaIngreso']  # Fecha de inicio de sesión
        fecha_carga = data['fechaCarga']      # Fecha de apertura de visita
        fecha_final_carga = data['fechaFinalCarga']  # Fecha de guardado

        if not isinstance(productos, list) or len(productos) == 0:
            return jsonify({
                "success": False,
                "message": "Debe enviar al menos un producto"
            }), 400

        # Obtener datos de la visita
        visita_query = """
            SELECT vm.id_visita, vm.id_cliente, vm.identificador_punto_interes, m.nombre AS mercaderista
            FROM VISITAS_MERCADERISTA vm
            JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
            WHERE vm.id_visita = ?
        """
        visita = execute_query(visita_query, (visit_id,), fetch_one=True)

        if not visita:
            return jsonify({
                "success": False,
                "message": "Visita no encontrada"
            }), 404

        id_cliente = visita[1]
        identificador_pdv = visita[2]
        mercaderista = visita[3]
        fecha_balance = datetime.datetime.now().strftime('%Y-%m-%d')

        # Insertar cada producto
        for producto in productos:
            producto_id = producto.get('id')
            fabricante = producto.get('fabricante', '')
            inv_inicial = producto.get('inventarioInicial')
            inv_final = producto.get('inventarioFinal')
            caras = producto.get('caras')
            inv_deposito = producto.get('inventarioDeposito', 0)
            precio_bs = producto.get('precioBs')
            precio_usd = producto.get('precioUSD')

            # Obtener categoría y fabricante desde PRODUCTS
            product_info_query = """
                SELECT Categoria, fabricante
                FROM PRODUCTS
                WHERE ID_PRODUCT = ?
            """
            product_info = execute_query(product_info_query, (producto_id,), fetch_one=True)

            if not product_info:
                return jsonify({
                    "success": False,
                    "message": f"Producto con ID {producto_id} no encontrado"
                }), 400

            categoria = product_info[0]
            fabricante_real = product_info[1] or fabricante

            # Insertar en BALANCES_TOTALES
            insert_query = """
                INSERT INTO BALANCES_TOTALES (
                    ID_CLIENTE,
                    FECHA_BALANCE,
                    IDENTIFICADOR_PDV,
                    MERCADERISTA,
                    PRODUCTO,
                    CATEGORIA,
                    FABRICANTE,
                    INV_INICIAL,
                    INV_FINAL,
                    INV_DEPOSITO,
                    CARAS,
                    PRECIO_BS,
                    PRECIO_DS,
                    ID_VISITA,
                    FECHA_INGRESO,   -- Nuevo campo
                    FECHA_CARGA,      -- Nuevo campo
                    FECHA_FINAL_CARGA -- Nuevo campo
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """

            execute_query(insert_query, (
                id_cliente,
                fecha_balance,
                identificador_pdv,
                mercaderista,
                producto['sku'],
                categoria,
                fabricante_real,
                inv_inicial,
                inv_final,
                inv_deposito,
                caras,
                precio_bs,
                precio_usd,
                visit_id,
                fecha_ingreso,      # Nuevo valor
                fecha_carga,        # Nuevo valor
                fecha_final_carga   # Nuevo valor
            ), commit=True)

        return jsonify({
            "success": True,
            "message": "Datos cargados exitosamente"
        })

    except Exception as e:
        print(f"Error en cargar_datos_visita: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Error interno: {str(e)}"
        }), 500
    

@merchandisers_bp.route("/api/client-from-visit/<int:visit_id>")
def get_client_from_visit(visit_id):
    try:
        # Consulta corregida con nombres de tablas y columnas actualizados
        query = """
            SELECT c.ID_CLIENTE, c.CLIENTE 
            FROM VISITAS_MERCADERISTA v
            JOIN CLIENTES c ON v.ID_CLIENTE = c.ID_CLIENTE
            WHERE v.ID_VISITA = ?
        """
        result = execute_query(query, (visit_id,), fetch_one=True)
        
        if result:
            return jsonify({
                "success": True,
                "id": result[0],
                "nombre": result[1]
            })
        else:
            return jsonify({
                "success": False,
                "message": "Cliente no encontrado para esta visita"
            }), 404
            
    except pyodbc.Error as e:
        # Registrar error específico de la base de datos
        current_app.logger.error(f"Error en la base de datos: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Error en la base de datos: {str(e)}"
        }), 500
        
    except Exception as e:
        # Registrar error general
        current_app.logger.error(f"Error interno en get_client_from_visit: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Error interno del servidor: {str(e)}"
        }), 500
    

@merchandisers_bp.route("/api/product-fabricante/<int:producto_id>")
def get_product_fabricante(producto_id):
    try:
        query = "SELECT fabricante FROM PRODUCTS WHERE ID_PRODUCT = ?"
        result = execute_query(query, (producto_id,), fetch_one=True)
        
        if result and result[0]:
            return jsonify({
                "success": True,
                "fabricante": result[0]
            })
        else:
            return jsonify({
                "success": False,
                "message": "Fabricante no encontrado"
            }), 404
            
    except Exception as e:
        print(f"Error en product-fabricante: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Error interno: {str(e)}"
        }), 500
    
@merchandisers_bp.route("/api/client-products/<int:cliente_id>")
def get_client_products(cliente_id):
    try:
        query = """
            SELECT p.ID_PRODUCT, p.SKUs, p.fabricante
            FROM Products p
            WHERE p.ID_Fabricante = ?
            ORDER BY p.SKUs
        """
        products = execute_query(query, (cliente_id,))
        
        if not products:
            return jsonify([])  # Devolver lista vacía si no hay productos
            
        productos_lista = [{
            "id": row[0], 
            "sku": row[1],
            "fabricante": row[2]  # Añadimos el fabricante aquí
        } for row in products]
        
        return jsonify(productos_lista)
    except Exception as e:
        print(f"Error en client-products: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
# Endpoint para habilitar mercaderistas
@merchandisers_bp.route('/api/enable-merchandiser', methods=['POST'])
@login_required
def enable_merchandiser():
    return update_merchandiser_status(1, "habilitado")

# Endpoint para deshabilitar mercaderistas
@merchandisers_bp.route('/api/disable-merchandiser', methods=['POST'])
@login_required
def disable_merchandiser():
    return update_merchandiser_status(0, "deshabilitado")

# Función principal para actualizar estado
def update_merchandiser_status(status_value, status_text):
    # Verificar si es administrador
    if current_user.rol == 'admin':
        return update_merchandiser_status_directly(status_value, status_text)
    elif current_user.rol == 'analyst':
        return update_merchandiser_status_request(status_value, status_text)
    else:
        return jsonify({
            "success": False,
            "message": "Acceso denegado: Rol no autorizado para actualizar mercaderistas"
        }), 403

def update_merchandiser_status_directly(status_value, status_text):
    if current_user.rol != 'admin':
        return jsonify({
            "success": False,
            "message": "Acceso denegado: Se requiere rol de administrador"
        }), 403

    data = request.get_json()
    cedula = data.get('cedula')
    
    if not cedula:
        return jsonify({
            "success": False,
            "message": "Cédula es requerida"
        }), 400
    
    try:
        # Verificar si existe el mercaderista
        check_query = "SELECT CAST(activo AS TINYINT) AS activo FROM MERCADERISTAS WHERE cedula = ?"
        current_status = execute_query(check_query, (cedula,), fetch_one=True)
        
        if not current_status:
            return jsonify({
                "success": False,
                "message": "No existe un mercaderista con esta cédula"
            }), 404
        
        # Verificar si ya está en el estado solicitado
        if current_status[0] == status_value:
            return jsonify({
                "success": True,
                "message": f"El mercaderista ya estaba {status_text}"
            })
        
        # Actualizar estado
        hex_value = '0x01' if status_value == 1 else '0x00'
        update_query = f"UPDATE MERCADERISTAS SET activo = {hex_value} WHERE cedula = ?"
        result = execute_query(update_query, (cedula,), commit=True)
        
        if result and result.get('rowcount', 0) > 0:
            return jsonify({
                "success": True,
                "message": f"Mercaderista {status_text} exitosamente"
            })
        else:
            return jsonify({
                "success": False,
                "message": f"No se pudo {status_text} el mercaderista"
            })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error interno del servidor: {str(e)}"
        }), 500

def update_merchandiser_status_request(status_value, status_text):
    try:
        data = request.get_json()
        cedula = data.get('cedula')
        
        # Validar datos
        if not cedula:
            return jsonify({
                "success": False,
                "message": "Cédula es requerida"
            }), 400
        
        # Verificar si existe el mercaderista
        check_query = "SELECT id_mercaderista, nombre FROM MERCADERISTAS WHERE cedula = ?"
        mercaderista = execute_query(check_query, (cedula,), fetch_one=True)
        
        if not mercaderista:
            return jsonify({
                "success": False,
                "message": "No existe un mercaderista con esta cédula"
            }), 404
        
        # Preparar datos para la solicitud
        request_data = {
            "cedula": cedula,
            "nombre": mercaderista[1],
            "action": "enable" if status_value == 1 else "disable"
        }
        
        # Insertar solicitud en la tabla SOLICITUDES
        request_data_json = json.dumps(request_data)
        insert_query = """INSERT INTO SOLICITUDES 
                        (tipo_solicitud, datos, estado, id_solicitante)
                        VALUES ('cambio_estado_mercaderista', ?, 'pendiente', ?)"""
        solicitante_id = get_user_id_by_username(current_user.username)
        result = execute_query(insert_query, (request_data_json, solicitante_id), commit=True)
        
        if result and result.get('rowcount', 0) > 0:
            return jsonify({
                "success": True,
                "message": f"Solicitud de {status_text} de mercaderista creada. Espera aprobación del administrador."
            })
        else:
            return jsonify({
                "success": False, 
                "message": "No se pudo crear la solicitud"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al crear solicitud: {str(e)}"
        }), 500

@merchandisers_bp.route('/api/delete-merchandiser', methods=['POST'])
@login_required
def delete_merchandiser():
    # Verificar si es administrador
    if current_user.rol == 'admin':
        return delete_merchandiser_directly()
    elif current_user.rol == 'analyst':
        return delete_merchandiser_request()
    else:
        return jsonify({
            "success": False,
            "message": "Acceso denegado: Rol no autorizado para eliminar mercaderistas"
        }), 403

def delete_merchandiser_directly():
    # Verificar si el usuario es administrador
    if current_user.rol != 'admin':
        return jsonify({
            "success": False,
            "message": "Acceso denegado: Se requiere rol de administrador"
        }), 403

    data = request.get_json()
    cedula = data.get('cedula')
    
    if not cedula:
        return jsonify({
            "success": False,
            "message": "Cédula es requerida"
        }), 400
    
    try:
        # Verificar si existe el mercaderista
        check_query = "SELECT id_mercaderista, nombre FROM MERCADERISTAS WHERE cedula = ?"
        mercaderista = execute_query(check_query, (cedula,), fetch_one=True)
        
        if not mercaderista:
            return jsonify({
                "success": False,
                "message": "No existe un mercaderista con esta cédula"
            }), 404
        
        mercaderista_id = mercaderista[0]
        nombre = mercaderista[1]
        
        # 🔴 VERIFICACIÓN CRÍTICA - Mantén esto pero mejora el mensaje 🔴
        # Verificar si tiene visitas asociadas
        visitas_query = "SELECT COUNT(*) FROM VISITAS_MERCADERISTA WHERE id_mercaderista = ?"
        count_visitas = execute_query(visitas_query, (mercaderista_id,), fetch_one=True)
        
        if count_visitas and count_visitas[0] > 0:
            return jsonify({
                "success": False,
                "message": f"No se puede eliminar a {nombre} porque tiene visitas asociadas."
            }), 400
        
        # Eliminar mercaderista físicamente
        delete_query = "DELETE FROM MERCADERISTAS WHERE cedula = ?"
        result = execute_query(delete_query, (cedula,), commit=True)
        
        if result and result.get('rowcount', 0) > 0:
            return jsonify({
                "success": True,
                "message": f"Mercaderista {nombre} eliminado permanentemente"
            })
        else:
            return jsonify({
                "success": False,
                "message": "No se pudo eliminar el mercaderista"
            })
        
    except pyodbc.Error as e:
        # Manejar específicamente el error de integridad referencial
        if e.args[0] == '23000' and '547' in e.args[1]:
            return jsonify({
                "success": False,
                "message": f"No se puede eliminar al mercaderista porque tiene visitas asociadas."
            }), 400
        else:
            return jsonify({
                "success": False,
                "message": f"Error en la base de datos: {str(e)}"
            }), 500
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error interno del servidor: {str(e)}"
        }), 500

def delete_merchandiser_request():
    try:
        data = request.get_json()
        cedula = data.get('cedula')
        
        # Validar datos
        if not cedula:
            return jsonify({
                "success": False,
                "message": "Cédula es requerida"
            }), 400

        # Verificar si existe el mercaderista
        check_query = "SELECT id_mercaderista, nombre FROM MERCADERISTAS WHERE cedula = ?"
        mercaderista = execute_query(check_query, (cedula,), fetch_one=True)
        
        if not mercaderista:
            return jsonify({
                "success": False,
                "message": "No existe un mercaderista con esta cédula"
            }), 404
        
        mercaderista_id = mercaderista[0]
        nombre = mercaderista[1]
        
        # 🔴 VERIFICACIÓN CRÍTICA - Agrega esto 🔴
        # Verificar si tiene visitas asociadas
        visitas_query = "SELECT COUNT(*) FROM VISITAS_MERCADERISTA WHERE id_mercaderista = ?"
        count_visitas = execute_query(visitas_query, (mercaderista_id,), fetch_one=True)
        
        if count_visitas and count_visitas[0] > 0:
            return jsonify({
                "success": False,
                "message": f"No se puede solicitar la eliminación de {nombre} porque tiene visitas asociadas. En su lugar, puedes solicitar deshabilitarlo."
            }), 400
        
        # Preparar datos para la solicitud
        request_data = {
            "cedula": cedula,
            "nombre": nombre
        }
        
        # Insertar solicitud en la tabla SOLICITUDES
        request_data_json = json.dumps(request_data)
        insert_query = """INSERT INTO SOLICITUDES 
                        (tipo_solicitud, datos, estado, id_solicitante)
                        VALUES ('eliminacion_mercaderista', ?, 'pendiente', ?)"""
        solicitante_id = get_user_id_by_username(current_user.username)
        result = execute_query(insert_query, (request_data_json, solicitante_id), commit=True)
        
        if result and result.get('rowcount', 0) > 0:
            return jsonify({
                "success": True,
                "message": "Solicitud de eliminación de mercaderista creada. Espera aprobación del administrador."
            })
        else:
            return jsonify({
                "success": False, 
                "message": "No se pudo crear la solicitud"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al crear solicitud: {str(e)}"
        }), 500
    
@merchandisers_bp.route('/api/request-add-merchandiser', methods=['POST'])
@login_required
def request_add_merchandiser():
    if current_user.rol != 'analyst':
        return jsonify({"success": False, "message": "No autorizado"}), 403
    return add_merchandiser_request()

@merchandisers_bp.route('/api/request-remove-merchandiser', methods=['POST'])
@login_required
def request_remove_merchandiser():
    if current_user.rol != 'analyst':
        return jsonify({"success": False, "message": "No autorizado"}), 403
    return remove_merchandiser_request()

@merchandisers_bp.route('/api/request-toggle-merchandiser-status', methods=['POST'])
@login_required
def request_toggle_merchandiser_status():
    if current_user.rol != 'analyst':
        return jsonify({"success": False, "message": "No autorizado"}), 403
    data = request.get_json()
    status_value = 1 if data.get('action') == 'enable' else 0
    status_text = "habilitar" if status_value == 1 else "deshabilitar"
    return update_merchandiser_status_request(status_value, status_text)

@merchandisers_bp.route('/dashboard-mercaderista')
def dashboard_mercaderista():
    return render_template('dashboard-mercaderista.html')

@merchandisers_bp.route('/carga-fotos-mercaderista')
def carga_fotos_mercaderista():
    return render_template('carga-fotos-mercaderista.html')

@merchandisers_bp.route('/realizar-ruta-mercaderista')
def realizar_ruta_mercaderista():
    return render_template('realizar-ruta-mercaderista.html')

@merchandisers_bp.route('/api/merchandiser-fixed-routes/<cedula>')
def get_merchandiser_fixed_routes(cedula):
    try:
        query = """
            SELECT rn.id_ruta, rn.ruta, COUNT(rp.id_programacion) as total_puntos
            FROM RUTAS_NUEVAS rn
            JOIN MERCADERISTAS_RUTAS mr ON rn.id_ruta = mr.id_ruta
            JOIN MERCADERISTAS m ON mr.id_mercaderista = m.id_mercaderista
            LEFT JOIN RUTA_PROGRAMACION rp ON rn.id_ruta = rp.id_ruta AND rp.activa = 1
            WHERE m.cedula = ? AND mr.tipo_ruta = 'Fija'
            GROUP BY rn.id_ruta, rn.ruta
            ORDER BY rn.ruta
        """
        routes = execute_query(query, (cedula,))
        return jsonify([{
            "id": row[0],
            "nombre": row[1],
            "total_puntos": row[2]
        } for row in routes])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@merchandisers_bp.route('/api/route-points1/<int:route_id>')
def get_route_points(route_id):
    try:
        # Obtener la cédula del query parameter
        cedula = request.args.get('cedula')
        if not cedula:
            return jsonify({"error": "Cédula requerida"}), 400
        
        # Obtener el día actual en español
        from datetime import datetime
        dias_espanol = {
            'Monday': 'Lunes',
            'Tuesday': 'Martes', 
            'Wednesday': 'Miércoles',
            'Thursday': 'Jueves',
            'Friday': 'Viernes',
            'Saturday': 'Sábado',
            'Sunday': 'Domingo'
        }
        dia_actual = dias_espanol[datetime.now().strftime('%A')]
        
        query = """
        WITH PuntosUnicos AS (
            SELECT 
                pin.identificador,
                pin.punto_de_interes,
                MAX(rp.prioridad) as prioridad_max,  -- Tomamos la prioridad más alta
                CASE WHEN EXISTS (
                    SELECT 1 FROM FOTOS_TOTALES ft 
                    WHERE ft.id_tipo_foto = 5 
                    AND ft.id_visita IN (
                        SELECT vm.id_visita 
                        FROM VISITAS_MERCADERISTA vm 
                        JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
                        WHERE vm.identificador_punto_interes = pin.identificador
                        AND m.cedula = ?
                    )
                ) THEN 1 ELSE 0 END as activado,
                COUNT(DISTINCT c.id_cliente) as total_clientes
            FROM RUTAS_NUEVAS rn
            JOIN RUTA_PROGRAMACION rp ON rn.id_ruta = rp.id_ruta
            JOIN PUNTOS_INTERES1 pin ON rp.id_punto_interes = pin.identificador
            JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
            JOIN MERCADERISTAS_RUTAS mr ON rn.id_ruta = mr.id_ruta
            JOIN MERCADERISTAS m ON mr.id_mercaderista = m.id_mercaderista
            WHERE rn.id_ruta = ?
            AND rp.dia = ?
            AND rp.activa = 1
            AND m.cedula = ?
            GROUP BY pin.identificador, pin.punto_de_interes
        )
        SELECT 
            identificador,
            punto_de_interes,
            prioridad_max,
            activado,
            total_clientes
        FROM PuntosUnicos
        ORDER BY punto_de_interes
        """
        
        points = execute_query(query, (cedula, route_id, dia_actual, cedula))
        
        return jsonify([{
            "id": row[0],
            "nombre": row[1],
            "prioridad": row[2] or "Sin prioridad",
            "activado": bool(row[3]),
            "total_clientes": row[4]
        } for row in points])
        
    except Exception as e:
        print(f"Error en get_route_points: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@merchandisers_bp.route('/api/upload-activation-photo', methods=['POST'])
def upload_activation_photo():
    try:
        # Obtener datos del formulario
        point_id = request.form.get('point_id')
        route_id = request.form.get('route_id')
        cedula = request.form.get('cedula')
        photo = request.files.get('photo')

        # Validaciones
        if not point_id or not cedula or not photo:
            return jsonify({"success": False, "message": "Datos incompletos"}), 400

        # Verificar que el archivo sea una imagen
        if not photo.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            return jsonify({"success": False, "message": "Formato de archivo no válido. Use JPG, PNG o GIF"}), 400

        # Obtener información del mercaderista
        mercaderista_query = "SELECT id_mercaderista, nombre FROM MERCADERISTAS WHERE cedula = ?"
        mercaderista = execute_query(mercaderista_query, (cedula,), fetch_one=True)
        
        if not mercaderista:
            return jsonify({"success": False, "message": "Mercaderista no encontrado"}), 404

        mercaderista_id = mercaderista[0]
        mercaderista_nombre = mercaderista[1]

        # Obtener información del punto
        punto_query = """
            SELECT rp.punto_interes, c.cliente, c.id_cliente
            FROM RUTA_PROGRAMACION rp
            JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
            WHERE rp.id_punto_interes = ?
        """
        punto = execute_query(punto_query, (point_id,), fetch_one=True)
        
        if not punto:
            return jsonify({"success": False, "message": "Punto de interés no encontrado"}), 404

        punto_nombre = punto[0]
        cliente_nombre = punto[1]
        cliente_id = punto[2]

        # Subir foto a Azure
        from azure.storage.blob import BlobServiceClient
        import os
        from datetime import datetime
        
        # Configuración de Azure
        connection_string = current_app.config['AZURE_STORAGE_CONNECTION_STRING']
        container_name = current_app.config['AZURE_CONTAINER_NAME']
        
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        container_client = blob_service_client.get_container_client(container_name)
        
        # Generar nombre único para el archivo
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"activaciones/{mercaderista_id}_{point_id}_{timestamp}.jpg"
        
        # Subir archivo
        blob_client = container_client.get_blob_client(filename)
        blob_client.upload_blob(photo, overwrite=True)
        
        # Crear visita para el punto (si no existe)
        visita_query = """
            INSERT INTO VISITAS_MERCADERISTA 
            (id_cliente, identificador_punto_interes, id_mercaderista, fecha_visita, estado)
            VALUES (?, ?, ?, GETDATE(), 'Completada')
        """
        execute_query(visita_query, (cliente_id, point_id, mercaderista_id), commit=True)
        
        # Obtener el ID de la visita creada
        visita_id_query = "SELECT SCOPE_IDENTITY()"
        visita_id = execute_query(visita_id_query, fetch_one=True)[0]
        
        # Insertar en FOTOS_TOTALES con id_tipo_foto = 5 (Activación)
        foto_query = """
            INSERT INTO FOTOS_TOTALES 
            (id_visita, categoria, file_path, fecha_registro, id_tipo_foto, Estado)
            VALUES (?, 'Activación', ?, GETDATE(), 5, 'Aprobada')
        """
        execute_query(foto_query, (visita_id, filename), commit=True)

        return jsonify({
            "success": True, 
            "message": "Foto de activación subida correctamente",
            "visita_id": visita_id,
            "file_path": filename
        })

    except Exception as e:
        print(f"Error en upload-activation-photo: {str(e)}")
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500

@merchandisers_bp.route('/api/upload-route-photos', methods=['POST'])
def upload_route_photos():
    try:
        # Obtener datos del formulario
        point_id = request.form.get('point_id')
        route_id = request.form.get('route_id')
        cedula = request.form.get('cedula')
        photo_type = request.form.get('photo_type')  # precios, gestion, exhibiciones
        photo = request.files.get('photo')

        # Validaciones
        if not point_id or not cedula or not photo_type or not photo:
            return jsonify({"success": False, "message": "Datos incompletos"}), 400

        # Mapear tipos de foto a id_tipo_foto
        tipo_foto_map = {
            'precios': 1,
            'gestion': 2, 
            'exhibiciones': 3,
            'activacion': 5
        }
        
        id_tipo_foto = tipo_foto_map.get(photo_type)
        if not id_tipo_foto:
            return jsonify({"success": False, "message": "Tipo de foto no válido"}), 400

        # Obtener información del mercaderista
        mercaderista_query = "SELECT id_mercaderista, nombre FROM MERCADERISTAS WHERE cedula = ?"
        mercaderista = execute_query(mercaderista_query, (cedula,), fetch_one=True)
        
        if not mercaderista:
            return jsonify({"success": False, "message": "Mercaderista no encontrado"}), 404

        mercaderista_id = mercaderista[0]
        mercaderista_nombre = mercaderista[1]

        # Obtener información del punto y cliente
        punto_query = """
            SELECT c.id_cliente
            FROM RUTA_PROGRAMACION rp
            JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
            WHERE rp.id_punto_interes = ?
        """
        punto = execute_query(punto_query, (point_id,), fetch_one=True)
        
        if not punto:
            return jsonify({"success": False, "message": "Punto de interés no encontrado"}), 404

        cliente_id = punto[0]

        # Subir foto a Azure
        from azure.storage.blob import BlobServiceClient
        from datetime import datetime
        
        connection_string = current_app.config['AZURE_STORAGE_CONNECTION_STRING']
        container_name = current_app.config['AZURE_CONTAINER_NAME']
        
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        container_client = blob_service_client.get_container_client(container_name)
        
        # Generar nombre único para el archivo
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{photo_type}/{mercaderista_id}_{point_id}_{timestamp}.jpg"
        
        # Subir archivo
        blob_client = container_client.get_blob_client(filename)
        blob_client.upload_blob(photo, overwrite=True)
        
        # Obtener o crear visita para el punto
        visita_query = """
            SELECT TOP 1 id_visita 
            FROM VISITAS_MERCADERISTA 
            WHERE id_cliente = ? AND identificador_punto_interes = ? AND id_mercaderista = ?
            ORDER BY id_visita DESC
        """
        visita = execute_query(visita_query, (cliente_id, point_id, mercaderista_id), fetch_one=True)
        
        visita_id = visita[0] if visita else None
        
        if not visita_id:
            # Crear nueva visita
            visita_insert_query = """
                INSERT INTO VISITAS_MERCADERISTA 
                (id_cliente, identificador_punto_interes, id_mercaderista, fecha_visita, estado)
                VALUES (?, ?, ?, GETDATE(), 'Completada')
            """
            execute_query(visita_insert_query, (cliente_id, point_id, mercaderista_id), commit=True)
            visita_id = execute_query("SELECT SCOPE_IDENTITY()", fetch_one=True)[0]

        # Determinar categoría según tipo
        categorias = {
            'precios': 'Precios',
            'gestion': 'Gestión',
            'exhibiciones': 'Exhibiciones',
            'activacion': 'Activación'
        }
        categoria = categorias.get(photo_type, 'General')

        # Insertar en FOTOS_TOTALES
        foto_query = """
            INSERT INTO FOTOS_TOTALES 
            (id_visita, categoria, file_path, fecha_registro, id_tipo_foto, Estado)
            VALUES (?, ?, ?, GETDATE(), ?, 'Aprobada')
        """
        execute_query(foto_query, (visita_id, categoria, filename, id_tipo_foto), commit=True)

        return jsonify({
            "success": True, 
            "message": f"Foto de {photo_type} subida correctamente",
            "file_path": filename
        })

    except Exception as e:
        print(f"Error en upload-route-photos: {str(e)}")
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500