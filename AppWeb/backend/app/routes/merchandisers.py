# app/routes/merchandisers.py
from flask import Blueprint, request, jsonify, render_template, current_app, session
from flask_login import login_required, current_user
from app.utils.database import execute_query, get_db_connection
from app.utils.auth import get_user_id_by_username 
from app.utils.exif_helper import extract_metadata, extract_metadata_with_fallback
import pyodbc
import datetime
import json
from app.utils.azure_storage import upload_to_azure

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

'''@merchandisers_bp.route('/api/verify-merchandiser', methods=['POST'])
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
        }), 500'''
    
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
            SELECT 
                rn.id_ruta, 
                rn.ruta,
                (
                    SELECT COUNT(DISTINCT rp2.id_punto_interes)
                    FROM RUTA_PROGRAMACION rp2
                    WHERE rp2.id_ruta = rn.id_ruta 
                    AND rp2.activa = 1
                ) as total_puntos
            FROM RUTAS_NUEVAS rn
            JOIN MERCADERISTAS_RUTAS mr ON rn.id_ruta = mr.id_ruta
            JOIN MERCADERISTAS m ON mr.id_mercaderista = m.id_mercaderista
            WHERE m.cedula = ? AND mr.tipo_ruta = 'Fija'
            ORDER BY rn.ruta
        """
        routes = execute_query(query, (cedula))
        return jsonify([{
            "id": row[0],
            "nombre": row[1],
            "total_puntos": row[2] if row[2] is not None else 0
        } for row in routes])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@merchandisers_bp.route('/api/route-points1/<int:route_id>')
def get_route_points(route_id):
    try:
        cedula = request.args.get('cedula')
        if not cedula:
            return jsonify({"error": "Cédula requerida"}), 400

        query = """
        WITH PuntosUnicos AS (
            SELECT 
                pin.identificador,
                pin.punto_de_interes,
                MAX(rp.prioridad) as prioridad_max,
                CASE 
                    -- Buscar fotos de activación/desactivación con visita
                    WHEN EXISTS (
                        SELECT TOP 1 1
                        FROM FOTOS_TOTALES ft
                        JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
                        JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
                        WHERE vm.identificador_punto_interes = pin.identificador
                        AND m.cedula = ?
                        AND ft.id_tipo_foto = 5
                        AND ft.Estado = 'Aprobada'
                        ORDER BY ft.fecha_registro DESC
                    ) AND NOT EXISTS (
                        -- Verificar que no haya una desactivación más reciente
                        SELECT TOP 1 1
                        FROM FOTOS_TOTALES ft2
                        LEFT JOIN VISITAS_MERCADERISTA vm2 ON ft2.id_visita = vm2.id_visita
                        LEFT JOIN MERCADERISTAS m2 ON (vm2.id_mercaderista = m2.id_mercaderista OR (ft2.id_visita IS NULL AND m2.cedula = ?))
                        WHERE (vm2.identificador_punto_interes = pin.identificador OR ft2.file_path LIKE '%' + pin.identificador + '%')
                        AND m2.cedula = ?
                        AND ft2.id_tipo_foto = 6
                        AND ft2.Estado = 'Aprobada'
                        AND ft2.fecha_registro > COALESCE((
                            SELECT MAX(ft3.fecha_registro)
                            FROM FOTOS_TOTALES ft3
                            JOIN VISITAS_MERCADERISTA vm3 ON ft3.id_visita = vm3.id_visita
                            WHERE vm3.identificador_punto_interes = pin.identificador
                            AND ft3.id_tipo_foto = 5
                            AND ft3.Estado = 'Aprobada'
                        ), '1900-01-01')
                    ) THEN 1
                    ELSE 0 
                END as activado,
                COUNT(DISTINCT c.id_cliente) as total_clientes
            FROM RUTAS_NUEVAS rn
            JOIN RUTA_PROGRAMACION rp ON rn.id_ruta = rp.id_ruta
            JOIN PUNTOS_INTERES1 pin ON rp.id_punto_interes = pin.identificador
            JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
            JOIN MERCADERISTAS_RUTAS mr ON rn.id_ruta = mr.id_ruta
            JOIN MERCADERISTAS m ON mr.id_mercaderista = m.id_mercaderista
            WHERE rn.id_ruta = ?
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
        
        points = execute_query(query, (cedula, cedula, cedula, route_id, cedula))
        
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
        # 🔴 LOG TEMPORAL PARA DEBUG
        print("🔴 INICIO DE upload_activation_photo")
        print(f"🔴 Datos del formulario: {request.form}")
        print(f"🔴 Archivos recibidos: {request.files}")

        # Obtener datos del formulario
        point_id = request.form.get('point_id')
        route_id = request.form.get('route_id')
        cedula = request.form.get('cedula')
        photo = request.files.get('photo')

        print(f"🔴 Valores obtenidos: point_id={point_id}, cedula={cedula}, photo={photo}")

        # Validaciones
        if not point_id or not cedula or not photo:
            print("❌ ERROR: Datos incompletos")
            return jsonify({"success": False, "message": "Datos incompletos"}), 400

        # Verificar que el archivo sea una imagen
        if not photo.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            print(f"❌ ERROR: Formato de archivo no válido: {photo.filename}")
            return jsonify({"success": False, "message": "Formato de archivo no válido. Use JPG, PNG o GIF"}), 400

        print(f"✅ Archivo válido: {photo.filename}")

        # Obtener información del mercaderista
        mercaderista_query = "SELECT id_mercaderista, nombre FROM MERCADERISTAS WHERE cedula = ?"
        mercaderista = execute_query(mercaderista_query, (cedula,), fetch_one=True)

        if not mercaderista:
            print(f"❌ ERROR: Mercaderista no encontrado con cédula: {cedula}")
            return jsonify({"success": False, "message": "Mercaderista no encontrado"}), 404

        mercaderista_id = mercaderista[0]
        mercaderista_nombre = mercaderista[1]
        print(f"✅ Mercaderista encontrado: ID={mercaderista_id}, Nombre={mercaderista_nombre}")

        # Obtener información del punto (solo para referencia, NO para crear visita)
        punto_query = """
            SELECT rp.punto_interes
            FROM RUTA_PROGRAMACION rp
            WHERE rp.id_punto_interes = ?
        """
        punto = execute_query(punto_query, (point_id,), fetch_one=True)

        if not punto:
            print(f"❌ ERROR: Punto de interés no encontrado: {point_id}")
            return jsonify({"success": False, "message": "Punto de interés no encontrado"}), 404

        punto_nombre = punto[0]
        print(f"✅ Punto encontrado: {punto_nombre}")

        # 📸 EXTRAER METADATOS EXIF/GPS
        from app.utils.exif_helper import extract_metadata
        meta = extract_metadata(photo)
        print(f"📸 Metadatos EXIF extraídos: {meta}")

        # 📸 EXTRAER METADATOS EXIF/GPS

        # ✅ USAR GPS DEL DISPOSITIVO SIEMPRE QUE ESTÉ DISPONIBLE
        lat_fallback = float(request.form.get('lat')) if request.form.get('lat') else None
        lon_fallback = float(request.form.get('lon')) if request.form.get('lon') else None
        alt_fallback = float(request.form.get('alt')) if request.form.get('alt') else None

        # Priorizar GPS del dispositivo sobre EXIF
        meta['latitud'] = lat_fallback if lat_fallback is not None else meta['latitud']
        meta['longitud'] = lon_fallback if lon_fallback is not None else meta['longitud']
        meta['altitud'] = alt_fallback if alt_fallback is not None else meta['altitud']

        print(f"📸 Metadatos finales a guardar: {meta}")

        # Subir foto a Azure
        from datetime import datetime
        from app.utils.azure_storage import upload_to_azure

        connection_string = current_app.config['AZURE_STORAGE_CONNECTION_STRING']
        container_name = current_app.config['AZURE_CONTAINER_NAME']

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"activaciones/{mercaderista_id}_{point_id}_{timestamp}.jpg"

        print(f"📤 Subiendo archivo a Azure: {filename}")

        try:
            upload_to_azure(photo, filename, connection_string, container_name)
            print(f"✅ Archivo subido exitosamente a Azure: {filename}")
        except Exception as azure_error:
            print(f"❌ ERROR al subir a Azure: {azure_error}")
            return jsonify({"success": False, "message": f"Error al subir a Azure: {str(azure_error)}"}), 500

        # Insertar en FOTOS_TOTALES con metadatos
        foto_query = """
            INSERT INTO FOTOS_TOTALES 
            (categoria, file_path, fecha_registro, id_tipo_foto, Estado,
             latitud, longitud, altitud, fecha_disparo,
             fabricante_camara, modelo_camara, iso, apertura,
             tiempo_exposicion, orientacion)
            VALUES (NULL, ?, GETDATE(), 5, 'Aprobada',
                    ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?)
        """
        try:
            execute_query(foto_query, (
                filename,
                meta['latitud'], meta['longitud'], meta['altitud'], meta['fecha_disparo'],
                meta['fabricante_camara'], meta['modelo_camara'], meta['iso'], meta['apertura'],
                meta['tiempo_exposicion'], meta['orientacion']
            ), commit=True)
            print(f"✅ Foto insertada en FOTOS_TOTALES con metadatos: {filename}")
        except Exception as db_error:
            print(f"❌ ERROR al insertar en base de datos: {db_error}")
            return jsonify({"success": False, "message": f"Error al guardar en base de datos: {str(db_error)}"}), 500

        # 🔴 OBTENER EL ID_FOTO RECIÉN INSERTADO
        print("🔄 Obteniendo id_foto...")
        id_foto_query = """
            SELECT TOP 1 id_foto 
            FROM FOTOS_TOTALES 
            WHERE file_path = ?
            ORDER BY id_foto DESC
        """
        id_foto_result = execute_query(id_foto_query, (filename,), fetch_one=True)

        if id_foto_result is not None:
            id_foto = id_foto_result
            print(f"✅ id_foto obtenido: {id_foto}")
        else:
            print("❌ ERROR: No se pudo obtener el id_foto")
            id_foto = None

        # Preparar respuesta
        if id_foto:
            response_data = {
                "success": True,
                "message": "Foto de activación subida correctamente",
                "id_foto": int(id_foto),
                "file_path": filename,
                "mercaderista_id": mercaderista_id,
                "point_id": point_id,
                "punto_nombre": punto_nombre,
                "meta": meta
            }
            print(f"📤 Enviando respuesta EXITOSA: {response_data}")
            return jsonify(response_data)
        else:
            print("❌ ERROR CRÍTICO: id_foto es None")
            return jsonify({
                "success": False,
                "message": "Error crítico: No se pudo obtener el ID de la foto"
            }), 500

    except Exception as e:
        print(f"❌ ERROR GENERAL en upload-activation-photo: {str(e)}")
        import traceback
        traceback.print_exc()
        current_app.logger.error(f"Error en upload-activation-photo: {str(e)}")
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500
    
@merchandisers_bp.route('/api/upload-route-photos', methods=['POST'])
def upload_route_photos():
    try:
        # Obtener datos del formulario
        point_id = request.form.get('point_id')
        route_id = request.form.get('route_id')
        cedula = request.form.get('cedula')
        photo_type = request.form.get('photo_type')
        photo = request.files.get('photo')

        # Validaciones
        if not point_id or not cedula or not photo_type or not photo:
            return jsonify({"success": False, "message": "Datos incompletos"}), 400

        # Mapear tipos de foto a id_tipo_foto
        tipo_foto_map = {
            'precios': 1,
            'gestion': 2,
            'exhibiciones': 3,
            'activacion': 5,
            'desactivacion': 6
        }

        id_tipo_foto = tipo_foto_map.get(photo_type)
        if not id_tipo_foto:
            return jsonify({"success": False, "message": "Tipo de foto no válido"}), 400

        # Obtener información del mercaderista
        mercaderista_query = "SELECT id_mercaderista, nombre FROM MERCADERISTAS WHERE cedula = ?"
        mercaderista_result = execute_query(mercaderista_query, (cedula,), fetch_one=True)

        if not mercaderista_result:
            return jsonify({"success": False, "message": "Mercaderista no encontrado"}), 404

        mercaderista_id = mercaderista_result[0]
        mercaderista_nombre = mercaderista_result[1] if len(mercaderista_result) > 1 else None

        # 📸 EXTRAER METADATOS EXIF/GPS
        from app.utils.exif_helper import extract_metadata
        meta = extract_metadata(photo)
        print(f"📸 Metadatos EXIF extraídos: {meta}")

        # ✅ USAR GPS DEL DISPOSITIVO SI EXIF NO TRAE COORDENADAS
        lat_fallback = float(request.form.get('lat')) if request.form.get('lat') else None
        lon_fallback = float(request.form.get('lon')) if request.form.get('lon') else None
        alt_fallback = float(request.form.get('alt')) if request.form.get('alt') else None

        if meta['latitud'] is None and lat_fallback is not None:
            meta['latitud'] = lat_fallback
            print(f"🌍 Usando latitud del dispositivo: {lat_fallback}")
        if meta['longitud'] is None and lon_fallback is not None:
            meta['longitud'] = lon_fallback
            print(f"🌍 Usando longitud del dispositivo: {lon_fallback}")
        if meta['altitud'] is None and alt_fallback is not None:
            meta['altitud'] = alt_fallback
            print(f"🌍 Usando altitud del dispositivo: {alt_fallback}")

        print(f"📸 Metadatos finales a guardar: {meta}")

        # Subir foto a Azure
        from datetime import datetime
        from app.utils.azure_storage import upload_to_azure

        connection_string = current_app.config['AZURE_STORAGE_CONNECTION_STRING']
        container_name = current_app.config['AZURE_CONTAINER_NAME']

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{photo_type}/{mercaderista_id}_{point_id}_{timestamp}.jpg"

        upload_to_azure(photo, filename, connection_string, container_name)

        # 🔴 NUEVO: CASO DESACTIVACIÓN - Obtener la última visita del punto
        if photo_type == 'desactivacion':
            # Obtener la última visita creada para este punto
            ultima_visita_query = """
                SELECT TOP 1 vm.id_visita
                FROM VISITAS_MERCADERISTA vm
                JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
                WHERE vm.identificador_punto_interes = ?
                AND m.cedula = ?
                ORDER BY vm.fecha_visita DESC, vm.id_visita DESC
            """
            ultima_visita = execute_query(ultima_visita_query, (point_id, cedula), fetch_one=True)
            
            if not ultima_visita:
                return jsonify({
                    "success": False,
                    "message": "No se encontró ninguna visita previa para este punto"
                }), 404
            
            # 🔴 ARREGLADO: Manejar correctamente el resultado de execute_query
            visita_id = ultima_visita if isinstance(ultima_visita, (int, str)) else ultima_visita[0]
            print(f"📸 Foto de desactivación se asociará a la visita: {visita_id}")

            # 🔴 🔴 🔴 VALIDACIÓN CRÍTICA: Verificar que no existe ya una foto de desactivación para esta visita
            check_desactivacion_query = """
                SELECT COUNT(*) 
                FROM FOTOS_TOTALES 
                WHERE id_visita = ? AND id_tipo_foto = 6
            """
            existing_desactivacion = execute_query(check_desactivacion_query, (visita_id,), fetch_one=True)

            if existing_desactivacion and existing_desactivacion > 0:
                return jsonify({
                    "success": False,
                    "message": "Ya existe una foto de desactivación para esta visita"
                }), 400

            # Insertar foto de desactivación con el id_visita de la última visita
            foto_query = """
                INSERT INTO FOTOS_TOTALES 
                (id_visita, categoria, file_path, fecha_registro, id_tipo_foto, Estado,
                 latitud, longitud, altitud, fecha_disparo,
                 fabricante_camara, modelo_camara, iso, apertura,
                 tiempo_exposicion, orientacion)
                VALUES (?, NULL, ?, GETDATE(), 6, 'Aprobada',
                        ?, ?, ?, ?,
                        ?, ?, ?, ?,
                        ?, ?)
            """
            execute_query(foto_query, (
                visita_id,
                filename,
                meta['latitud'], meta['longitud'], meta['altitud'], meta['fecha_disparo'],
                meta['fabricante_camara'], meta['modelo_camara'], meta['iso'], meta['apertura'],
                meta['tiempo_exposicion'], meta['orientacion']
            ), commit=True)

            return jsonify({
                "success": True,
                "message": "Foto de desactivación subida correctamente",
                "file_path": filename,
                "visita_id": visita_id,
                "meta": meta
            })

        # ✅ CASOS CON VISITA: precios, gestion, exhibiciones (sin cambios)
        # Obtener cliente del punto
        punto_query = """
            SELECT c.id_cliente
            FROM RUTA_PROGRAMACION rp
            JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
            WHERE rp.id_punto_interes = ?
        """
        cliente_result = execute_query(punto_query, (point_id,), fetch_one=True)
        if not cliente_result:
            return jsonify({"success": False, "message": "No se encontró cliente para este punto"}), 404

        cliente_id = cliente_result[0] if isinstance(cliente_result, (tuple, list)) else cliente_result

        # Obtener o crear visita
        visita_query = """
            SELECT TOP 1 id_visita 
            FROM VISITAS_MERCADERISTA 
            WHERE id_cliente = ? AND identificador_punto_interes = ? AND id_mercaderista = ?
            AND tipo_visita != 'Desactivacion'
            ORDER BY id_visita DESC
        """
        visita_result = execute_query(visita_query, (cliente_id, point_id, mercaderista_id), fetch_one=True)

        visita_id = None
        if visita_result:
            visita_id = visita_result[0] if isinstance(visita_result, (tuple, list)) else visita_result

        if not visita_id:
            visita_insert_query = """
                INSERT INTO VISITAS_MERCADERISTA 
                (id_cliente, identificador_punto_interes, id_mercaderista, fecha_visita, estado, tipo_visita)
                VALUES (?, ?, ?, GETDATE(), 'Pendiente', 'Normal')
            """
            execute_query(visita_insert_query, (cliente_id, point_id, mercaderista_id), commit=True)
            visita_id_result = execute_query("SELECT SCOPE_IDENTITY()", fetch_one=True)
            visita_id = visita_id_result[0] if isinstance(visita_id_result, (tuple, list)) else visita_id_result

        # Determinar categoría
        categorias = {
            'precios': 'Precios',
            'gestion': 'Gestión',
            'exhibiciones': 'Exhibiciones'
        }
        categoria = categorias.get(photo_type, 'General')

        # Insertar en FOTOS_TOTALES con metadatos
        foto_query = """
            INSERT INTO FOTOS_TOTALES 
            (id_visita, categoria, file_path, fecha_registro, id_tipo_foto, Estado,
             latitud, longitud, altitud, fecha_disparo,
             fabricante_camara, modelo_camara, iso, apertura,
             tiempo_exposicion, orientacion)
            VALUES (?, ?, ?, GETDATE(), ?, 'Aprobada',
                    ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?)
        """
        execute_query(foto_query, (
            visita_id,
            categoria,
            filename,
            id_tipo_foto,
            meta['latitud'], meta['longitud'], meta['altitud'], meta['fecha_disparo'],
            meta['fabricante_camara'], meta['modelo_camara'], meta['iso'], meta['apertura'],
            meta['tiempo_exposicion'], meta['orientacion']
        ), commit=True)

        return jsonify({
            "success": True,
            "message": f"Foto de {photo_type} subida correctamente",
            "file_path": filename,
            "meta": meta
        })

    except Exception as e:
        print(f"Error en upload_route_photos: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500

@merchandisers_bp.route('/api/point-clients1/<string:point_id>')
def get_point_clients(point_id):
    """Obtener clientes para un punto de interés - Acceso para mercaderistas (sin Flask-Login)"""
    try:
        # Obtener la cédula de la sesión
        cedula = session.get('merchandiser_cedula')
        
        if not cedula:
            # Intentar obtener del header si no está en sesión
            cedula = request.headers.get('X-Merchandiser-Cedula')
            
        if not cedula:
            return jsonify({"error": "No autorizado - sesión no válida"}), 401
        
        query = """
            SELECT DISTINCT
                rp.id_cliente,
                c.cliente,
                rp.prioridad
            FROM RUTA_PROGRAMACION rp
            JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
            WHERE rp.id_punto_interes = ?
            AND rp.activa = 1
            ORDER BY rp.prioridad DESC, c.cliente
        """
        clients = execute_query(query, (point_id,))
        return jsonify([{
            "id": row[0],
            "nombre": row[1],
            "prioridad": row[2] or "Media"
        } for row in clients])
    except Exception as e:
        current_app.logger.error(f"Error en get_point_clients: {str(e)}")
        return jsonify({"error": f"Error interno: {str(e)}"}), 500
    

@merchandisers_bp.route('/api/create-client-visit', methods=['POST'])
def create_client_visit():
    """Crear una visita para un cliente - Acceso solo para mercaderistas (sin Flask-Login)"""
    try:
        data = request.get_json()
        client_id = data.get('client_id')
        point_id = data.get('point_id')
        mercaderista_id = data.get('mercaderista_id')
        id_foto = data.get('id_foto')  # 🔴 NUEVO: Puede venir de una activación previa
        route_id = data.get('route_id')  # Parámetro opcional
        
        # Quitar la validación de Flask-Login y usar sesión simple
        # Obtener cédula de la sesión para validación adicional
        cedula_session = session.get('merchandiser_cedula')
        if not all([client_id, point_id, mercaderista_id]):
            return jsonify({
                "success": False,
                "message": "Datos incompletos para crear visita"
            }), 400
        
        # Verificar que el mercaderista existe y está activo
        mercaderista_query = "SELECT cedula FROM MERCADERISTAS WHERE id_mercaderista = ? AND activo = 1"
        mercaderista = execute_query(mercaderista_query, (mercaderista_id,), fetch_one=True)
        if not mercaderista:
            return jsonify({
                "success": False,
                "message": "Mercaderista no encontrado o inactivo"
            }), 404
        
        # Verificar que el punto y cliente existen
        check_query = """
        SELECT 1
        FROM RUTA_PROGRAMACION rp
        WHERE rp.id_punto_interes = ?
        AND rp.id_cliente = ?
        AND rp.activa = 1
        """
        check_result = execute_query(check_query, (point_id, client_id), fetch_one=True)
        if not check_result:
            return jsonify({
                "success": False,
                "message": "El cliente no está asignado a este punto de interés"
            }), 400
        
        # 🔴 MODIFICADO: Si se proporciona id_foto, verificar que existe
        if id_foto:
            foto_query = """
            SELECT id_foto, id_visita
            FROM FOTOS_TOTALES
            WHERE id_foto = ? AND id_tipo_foto = 5
            """
            foto = execute_query(foto_query, (id_foto,), fetch_one=True)
            if not foto:
                return jsonify({
                    "success": False,
                    "message": "La foto de activación no existe"
                }), 404
            # No verificamos si ya tiene id_visita, porque puede ser reutilizada
        
        # Crear visita
        insert_query = """
        INSERT INTO VISITAS_MERCADERISTA
        (id_cliente, identificador_punto_interes, id_mercaderista, fecha_visita, estado)
        OUTPUT INSERTED.id_visita
        VALUES (?, ?, ?, GETDATE(), 'Pendiente')
        """
        
        # Usar una conexión directa para asegurar que obtenemos el ID
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute(insert_query, (client_id, point_id, mercaderista_id))
            visita_id = cursor.fetchone()[0]
            conn.commit()
            
            # 🔴 MODIFICADO: Si se proporcionó id_foto, actualizar la foto con el id_visita
            if id_foto:
                update_foto_query = """
                UPDATE FOTOS_TOTALES
                SET id_visita = ?
                WHERE id_foto = ?
                """
                cursor.execute(update_foto_query, (visita_id, id_foto))
                conn.commit()
            
            response_data = {
                "success": True,
                "visita_id": visita_id,
                "message": "Visita creada exitosamente"
            }
            
            if id_foto:
                response_data["id_foto"] = id_foto
            
            return jsonify(response_data)
            
        except Exception as db_error:
            conn.rollback()
            raise db_error
        finally:
            cursor.close()
            conn.close()
        
    except Exception as e:
        current_app.logger.error(f"Error en create_client_visit: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "message": f"Error al crear visita: {str(e)}"
        }), 500
    
@merchandisers_bp.route('/api/upload-additional-photo', methods=['POST'])
def upload_additional_photo():
    try:
        # Obtener datos del formulario
        point_id = request.form.get('point_id')
        cedula = request.form.get('cedula')
        photo_type = request.form.get('photo_type')
        visita_id = request.form.get('visita_id')
        photo = request.files.get('photo')
        
        # Validaciones
        if not all([point_id, cedula, photo_type, visita_id, photo]):
            return jsonify({"success": False, "message": "Datos incompletos"}), 400
            
        # Verificar que el archivo sea una imagen
        if not photo.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            return jsonify({"success": False, "message": "Formato de archivo no válido. Use JPG, PNG o GIF"}), 400
            
        # Mapear tipos de foto a id_tipo_foto
        tipo_foto_map = {
            'precios': 1,
            'gestion': 2, 
            'exhibiciones': 3
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
        
        # Obtener información del punto y cliente
        punto_query = """
            SELECT TOP 1 
                pin.punto_de_interes,
                pin.departamento,
                pin.ciudad,
                c.cliente
            FROM VISITAS_MERCADERISTA vm
            JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
            JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
            WHERE vm.id_visita = ?
        """
        punto = execute_query(punto_query, (visita_id,), fetch_one=True)
        
        if not punto:
            return jsonify({"success": False, "message": "Visita no encontrada"}), 404

        punto_nombre = punto[0]
        departamento = punto[1] or "SinDepartamento"
        ciudad = punto[2] or "SinCiudad"
        cliente_nombre = punto[3]
        
        # Generar nombre de archivo único
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{photo_type}_{mercaderista_id}_{point_id}_{timestamp}.jpg"
        
        # 🔴 **USANDO AZURE FILE STORAGE**
        from app.utils.azure_file_storage import azure_storage
        
        # Construir ruta relativa - usar backslash como separador
        fecha_actual = datetime.now().strftime("%Y-%m-%d")
        
        # Mapear tipos de foto a carpetas
        folder_map = {
            'precios': 'precios',
            'gestion': 'gestion', 
            'exhibiciones': 'exhibiciones'
        }
        folder = folder_map.get(photo_type, 'general')
        
        relative_path = f"{departamento}\\{ciudad}\\{punto_nombre}\\{cliente_nombre}\\{fecha_actual}\\{folder}\\{filename}"
        
        # Guardar el archivo
        success, fs_path, db_path, error_msg = azure_storage.save_file(photo, relative_path)
        
        if not success:
            return jsonify({
                "success": False, 
                "message": f"No se pudo guardar el archivo: {error_msg}"
            }), 500
        
        # Determinar categoría según tipo (NULL como solicitaste)
        categorias = {
            'precios': None,
            'gestion': None,
            'exhibiciones': None
        }
        categoria = categorias.get(photo_type)
        
        # Insertar en FOTOS_TOTALES con la ruta con doble barra invertida
        foto_query = """
            INSERT INTO FOTOS_TOTALES 
            (id_visita, categoria, file_path, fecha_registro, id_tipo_foto, Estado)
            VALUES (?, ?, ?, GETDATE(), ?, 'Aprobada')
        """
        execute_query(foto_query, (visita_id, categoria, db_path, id_tipo_foto), commit=True)
        
        return jsonify({
            "success": True, 
            "message": f"Foto de {photo_type} subida correctamente",
            "file_path": db_path,
            "visita_id": visita_id
        })
        
    except Exception as e:
        print(f"Error en upload_additional_photo: {str(e)}")
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500
    

@merchandisers_bp.route('/api/create-visit-from-activation', methods=['POST'])
def create_visit_from_activation():
    try:
        data = request.get_json()
        print("📦 Datos recibidos en create_visit_from_activation:", data)

        client_id = data.get('client_id')
        point_id = data.get('point_id')
        mercaderista_id = data.get('mercaderista_id')
        id_foto = data.get('id_foto')

        print(f"🔍 client_id: {client_id}")
        print(f"🔍 point_id: {point_id}")
        print(f"🔍 mercaderista_id: {mercaderista_id}")
        print(f"🔍 id_foto: {id_foto} (type: {type(id_foto)})")

        if not all([client_id, point_id, mercaderista_id, id_foto]):
            return jsonify({
                "success": False,
                "message": f"Faltan datos: client_id={client_id}, point_id={point_id}, mercaderista_id={mercaderista_id}, id_foto={id_foto}"
            }), 400

        # 🔍 Verificar que la foto existe y no tiene visita asignada
        foto_query = "SELECT id_visita FROM FOTOS_TOTALES WHERE id_foto = ?"
        foto = execute_query(foto_query, (id_foto,), fetch_one=True)

        print(f"🔍 Resultado de consulta de foto: {foto}")

        # Con la nueva execute_query, foto será None si no hay fila o si id_visita es NULL
        if foto is None:
            # La foto no existe (o no tiene visita)
            # Verificar si la foto existe
            check_query = "SELECT COUNT(*) FROM FOTOS_TOTALES WHERE id_foto = ?"
            exists = execute_query(check_query, (id_foto,), fetch_one=True)
            
            if exists == 0:
                return jsonify({
                    "success": False,
                    "message": "La foto no existe"
                }), 400
            # Si existe y foto es None, significa que id_visita es NULL, así que está bien
        elif foto is not None:
            # Si foto no es None, entonces ya tiene un id_visita asignado
            return jsonify({
                "success": False,
                "message": "La foto ya fue asignada a una visita"
            }), 400

        # ✅ Crear visita con OUTPUT para obtener el ID directamente
        insert_query = """
            INSERT INTO VISITAS_MERCADERISTA 
            (id_cliente, identificador_punto_interes, id_mercaderista, fecha_visita, estado)
            OUTPUT INSERTED.id_visita
            VALUES (?, ?, ?, GETDATE(), 'Pendiente')
        """
        
        # Usar una conexión directa para asegurar que obtenemos el ID
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute(insert_query, (client_id, point_id, mercaderista_id))
            visita_id = cursor.fetchone()[0]
            conn.commit()
            
            print(f"✅ Visita creada con ID: {visita_id}")
            
            # ✅ IMPORTANTE: Actualizar la foto de activación con el id_visita
            update_foto_query = "UPDATE FOTOS_TOTALES SET id_visita = ? WHERE id_foto = ?"
            cursor.execute(update_foto_query, (visita_id, id_foto))
            conn.commit()
            
            print(f"✅ Foto {id_foto} asignada a visita {visita_id}")
            
            return jsonify({
                "success": True,
                "visita_id": visita_id,
                "id_foto": id_foto,
                "message": "Visita creada y foto asignada correctamente"
            })
            
        except Exception as db_error:
            conn.rollback()
            raise db_error
        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        current_app.logger.error(f"Error en create_visit_from_activation: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Error interno: {str(e)}"
        }), 500
    

@merchandisers_bp.route('/api/deactivate-point', methods=['POST'])
def deactivate_point():
    try:
        data = request.get_json()
        point_id = data.get('point_id')
        cedula = data.get('cedula')
        
        if not point_id or not cedula:
            return jsonify({"success": False, "message": "Datos incompletos"}), 400
        
        # Obtener mercaderista
        mercaderista_query = "SELECT id_mercaderista FROM MERCADERISTAS WHERE cedula = ?"
        mercaderista = execute_query(mercaderista_query, (cedula,), fetch_one=True)
        
        if not mercaderista:
            return jsonify({"success": False, "message": "Mercaderista no encontrado"}), 404
            
        mercaderista_id = mercaderista[0]
        
        # Verificar si hay una activación pendiente para este punto
        activacion_query = """
            SELECT TOP 1 vm.id_visita
            FROM VISITAS_MERCADERISTA vm
            JOIN FOTOS_TOTALES ft ON vm.id_visita = ft.id_visita
            WHERE vm.identificador_punto_interes = ?
            AND vm.id_mercaderista = ?
            AND ft.id_tipo_foto = 5
            AND vm.estado = 'Pendiente'
            ORDER BY vm.fecha_visita DESC
        """
        activacion = execute_query(activacion_query, (point_id, mercaderista_id), fetch_one=True)
        
        if activacion:
            # Marcar la visita de activación como completada
            update_query = "UPDATE VISITAS_MERCADERISTA SET estado = 'Completada' WHERE id_visita = ?"
            execute_query(update_query, (activacion[0],), commit=True)
        
        return jsonify({
            "success": True,
            "message": "Punto desactivado correctamente"
        })
        
    except Exception as e:
        print(f"Error en deactivate_point: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500
    

@merchandisers_bp.route('/api/foto/<int:id_foto>/metadatos', methods=['GET'])
def get_foto_metadatos(id_foto):
    row = execute_query("""
        SELECT id_foto, file_path, latitud, longitud, altitud,
               fecha_disparo, fabricante_camara, modelo_camara,
               iso, apertura, tiempo_exposicion, orientacion
        FROM FOTOS_TOTALES
        WHERE id_foto = ?
    """, (id_foto,), fetch_one=True)
    if not row:
        return jsonify({"error": "Foto no encontrada"}), 404
    keys = ['id_foto', 'file_path', 'latitud', 'longitud', 'altitud',
            'fecha_disparo', 'fabricante_camara', 'modelo_camara',
            'iso', 'apertura', 'tiempo_exposicion', 'orientacion']
    return jsonify(dict(zip(keys, row)))


@merchandisers_bp.route('/api/active-points-with-clients')
def get_active_points_with_clients():
    """Obtener puntos de interés activos con sus clientes para continuar visitas"""
    try:
        cedula = session.get('merchandiser_cedula')
        if not cedula:
            cedula = request.headers.get('X-Merchandiser-Cedula')
        if not cedula:
            return jsonify({"error": "No autorizado - sesión no válida"}), 401

        query = """
        WITH PuntosActivos AS (
            SELECT DISTINCT
                pin.identificador as point_id,
                pin.punto_de_interes as point_name,
                rn.id_ruta as route_id,
                rn.ruta as route_name
            FROM PUNTOS_INTERES1 pin
            JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes
            JOIN RUTAS_NUEVAS rn ON rn.id_ruta = rp.id_ruta
            JOIN MERCADERISTAS_RUTAS mr ON rn.id_ruta = mr.id_ruta
            JOIN MERCADERISTAS m ON mr.id_mercaderista = m.id_mercaderista
            WHERE m.cedula = ?
            AND rp.activa = 1
            AND EXISTS (
                -- Tiene foto de activación aprobada
                SELECT 1 
                FROM FOTOS_TOTALES ft
                JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
                WHERE vm.identificador_punto_interes = pin.identificador
                AND ft.id_tipo_foto = 5
                AND ft.Estado = 'Aprobada'
            )
            AND NOT EXISTS (
                -- No tiene desactivación más reciente
                SELECT 1 
                FROM FOTOS_TOTALES ft2
                WHERE ft2.file_path LIKE '%' + pin.identificador + '%'
                AND ft2.id_tipo_foto = 6
                AND ft2.Estado = 'Aprobada'
                AND ft2.fecha_registro > (
                    SELECT MAX(ft3.fecha_registro)
                    FROM FOTOS_TOTALES ft3
                    JOIN VISITAS_MERCADERISTA vm3 ON ft3.id_visita = vm3.id_visita
                    WHERE vm3.identificador_punto_interes = pin.identificador
                    AND ft3.id_tipo_foto = 5
                    AND ft3.Estado = 'Aprobada'
                )
            )
        ),
        ClientesPorPunto AS (
            SELECT DISTINCT
                rp.id_punto_interes as point_id,
                c.id_cliente,
                c.cliente as client_name,
                rp.prioridad
            FROM RUTA_PROGRAMACION rp
            JOIN CLIENTES c ON rp.id_cliente = c.id_cliente
            WHERE rp.activa = 1
        )
        SELECT DISTINCT  -- 🔴 🔴 🔴 AÑADIR DISTINCT AQUÍ PARA EVITAR DUPLICADOS
            pa.point_id,
            pa.point_name,
            pa.route_id,
            pa.route_name,
            cpc.id_cliente,
            cpc.client_name,
            cpc.prioridad
        FROM PuntosActivos pa
        LEFT JOIN ClientesPorPunto cpc ON pa.point_id = cpc.point_id
        ORDER BY cpc.client_name, pa.route_name, pa.point_name, cpc.prioridad DESC
        """
        
        results = execute_query(query, (cedula,))
        
        # Organizar los resultados por punto de interés
        active_points = {}
        for row in results:
            point_id = row[0]
            if point_id not in active_points:
                active_points[point_id] = {
                    "point_id": point_id,
                    "point_name": row[1],
                    "route_id": row[2],
                    "route_name": row[3],
                    "clients": []
                }
            
            # 🔴 🔴 🔴 VERIFICAR SI EL CLIENTE YA EXISTE EN LA LISTA ANTES DE AGREGARLO
            if row[4] is not None:  # Si hay cliente
                client_exists = False
                for existing_client in active_points[point_id]["clients"]:
                    if existing_client["client_id"] == row[4]:
                        client_exists = True
                        break
                
                if not client_exists:
                    active_points[point_id]["clients"].append({
                        "client_id": row[4],
                        "client_name": row[5],
                        "priority": row[6] or "Media"
                    })
        
        # Convertir a lista
        active_points_list = list(active_points.values())
        
        return jsonify(active_points_list)
        
    except Exception as e:
        current_app.logger.error(f"Error en get_active_points_with_clients: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error interno: {str(e)}"}), 500
    
@merchandisers_bp.route('/api/merchandiser/<string:cedula>')
def get_merchandiser_by_cedula(cedula):
    """Obtener información del mercaderista por cédula"""
    try:
        query = """
        SELECT id_mercaderista, nombre, cedula
        FROM MERCADERISTAS 
        WHERE cedula = ? AND activo = 1
        """
        result = execute_query(query, (cedula,), fetch_one=True)
        
        if not result:
            return jsonify({
                "success": False,
                "message": "Mercaderista no encontrado o inactivo"
            }), 404
        
        return jsonify({
            "success": True,
            "id_mercaderista": result[0],
            "nombre": result[1],
            "cedula": result[2]
        })
        
    except Exception as e:
        current_app.logger.error(f"Error en get_merchandiser_by_cedula: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Error interno: {str(e)}"
        }), 500
    
@merchandisers_bp.route('/api/upload-multiple-additional-photos', methods=['POST'])
def upload_multiple_additional_photos():
    try:
        # Obtener datos del formulario
        point_id = request.form.get('point_id')
        cedula = request.form.get('cedula')
        photo_type = request.form.get('photo_type')
        visita_id = request.form.get('visita_id')
        photos = request.files.getlist('photos')  # Lista de archivos

        # Validaciones
        if not all([point_id, cedula, photo_type, visita_id]) or not photos:
            return jsonify({"success": False, "message": "Datos incompletos"}), 400

        # Mapear tipos de foto a id_tipo_foto
        tipo_foto_map = {
            'precios': 3,
            'gestion': 2,
            'exhibiciones': 4
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
        mercaderista_nombre = mercaderista[1] if len(mercaderista) > 1 else None

        # Obtener información de la visita (punto, cliente)
        visita_query = """
            SELECT 
                pin.punto_de_interes,
                pin.departamento,
                pin.ciudad,
                c.cliente,
                c.id_cliente
            FROM VISITAS_MERCADERISTA vm
            JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
            JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
            WHERE vm.id_visita = ?
        """
        visita = execute_query(visita_query, (visita_id,), fetch_one=True)
        if not visita:
            return jsonify({"success": False, "message": "Visita no encontrada"}), 404

        punto_nombre = visita[0]
        departamento = visita[1] or "SinDepartamento"
        ciudad = visita[2] or "SinCiudad"
        cliente_nombre = visita[3]
        cliente_id = visita[4]

        results = []

        # Procesar cada foto
        for idx, photo in enumerate(photos):
            try:
                # 📸 EXTRAER METADATOS EXIF/GPS de cada foto
                meta = extract_metadata(photo)

                # Si la foto NO tiene metadatos GPS, usar los del dispositivo (si están disponibles)
                device_lat = request.form.get(f'lat_{idx}')
                device_lon = request.form.get(f'lon_{idx}')
                device_alt = request.form.get(f'alt_{idx}')

                if meta['latitud'] is None and device_lat:
                    meta['latitud'] = float(device_lat)
                    meta['longitud'] = float(device_lon) if device_lon else None
                    meta['altitud'] = float(device_alt) if device_alt else None

                # Si aún no hay fecha de disparo, usar la actual
                if meta['fecha_disparo'] is None:
                    meta['fecha_disparo'] = datetime.datetime.now()

                # Subir foto a Azure
                from datetime import datetime
                from app.utils.azure_storage import upload_to_azure

                connection_string = current_app.config['AZURE_STORAGE_CONNECTION_STRING']
                container_name = current_app.config['AZURE_CONTAINER_NAME']

                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")

                # Construir ruta estructurada en Azure
                # Formato: tipo_foto/departamento/ciudad/punto/cliente/mercaderista/fecha/nombre_archivo
                fecha_actual = datetime.now().strftime("%Y-%m-%d")

                # Reemplazar caracteres problemáticos en los nombres
                safe_departamento = departamento.replace('/', '-').replace('\\', '-')
                safe_ciudad = ciudad.replace('/', '-').replace('\\', '-')
                safe_punto = punto_nombre.replace('/', '-').replace('\\', '-')
                safe_cliente = cliente_nombre.replace('/', '-').replace('\\', '-')
                safe_mercaderista = mercaderista_nombre.replace('/', '-').replace('\\', '-') if mercaderista_nombre else str(mercaderista_id)

                # Nombre de archivo único
                filename = f"{photo_type}/{safe_departamento}/{safe_ciudad}/{safe_punto}/{safe_cliente}/{fecha_actual}/{safe_mercaderista}_{timestamp}.jpg"

                # Subir a Azure
                upload_to_azure(photo, filename, connection_string, container_name)

                # Determinar categoría (NULL como solicitaste)
                categorias = {
                    'precios': None,
                    'gestion': None,
                    'exhibiciones': None
                }
                categoria = categorias.get(photo_type)

                # Insertar en FOTOS_TOTALES con metadatos
                foto_query = """
                    INSERT INTO FOTOS_TOTALES 
                    (id_visita, categoria, file_path, fecha_registro, id_tipo_foto, Estado,
                     latitud, longitud, altitud, fecha_disparo,
                     fabricante_camara, modelo_camara, iso, apertura,
                     tiempo_exposicion, orientacion)
                    VALUES (?, ?, ?, GETDATE(), ?, 'Pendiente',
                            ?, ?, ?, ?,
                            ?, ?, ?, ?,
                            ?, ?)
                """

                execute_query(foto_query, (
                    visita_id,
                    categoria,
                    filename,
                    id_tipo_foto,
                    meta['latitud'], meta['longitud'], meta['altitud'], meta['fecha_disparo'],
                    meta['fabricante_camara'], meta['modelo_camara'], meta['iso'], meta['apertura'],
                    meta['tiempo_exposicion'], meta['orientacion']
                ), commit=True)

                # Obtener el ID de la foto insertada
                id_foto_query = "SELECT SCOPE_IDENTITY()"
                id_foto_result = execute_query(id_foto_query, fetch_one=True)
                id_foto = id_foto_result[0] if id_foto_result else None

                results.append({
                    "success": True,
                    "file_path": filename,
                    "id_foto": id_foto,
                    "index": idx,
                    "meta": meta
                })

            except Exception as photo_error:
                results.append({
                    "success": False,
                    "index": idx,
                    "error": str(photo_error)
                })
                continue

        # Contar fotos exitosas
        successful_photos = [r for r in results if r["success"]]

        return jsonify({
            "success": True,
            "message": f"Se procesaron {len(photos)} fotos. {len(successful_photos)} exitosas, {len(results) - len(successful_photos)} fallidas.",
            "results": results,
            "total_successful": len(successful_photos),
            "total_failed": len(results) - len(successful_photos)
        })

    except Exception as e:
        print(f"❌ Error en upload_multiple_additional_photos: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500
    
@merchandisers_bp.route('/api/latest-activation-photo/<string:point_id>')
def get_latest_activation_photo(point_id):
    """Obtener la foto de activación más reciente PARA ASIGNAR a una visita"""
    try:
        cedula = request.headers.get('X-Merchandiser-Cedula') or session.get('merchandiser_cedula')
        if not cedula:
            return jsonify({"error": "No autorizado"}), 401

        # 🔴 MODIFICACIÓN IMPORTANTE: Solo buscar fotos que NO tengan id_visita asignado
        query = """
            SELECT TOP 1 ft.id_foto, ft.file_path
            FROM FOTOS_TOTALES ft
            JOIN MERCADERISTAS m ON m.cedula = ?
            WHERE ft.id_tipo_foto = 5  -- Foto de activación
            AND ft.Estado = 'Aprobada'
            AND ft.id_visita IS NULL  -- 🔴 CRÍTICO: Que no esté asignada a ninguna visita
            AND ft.file_path LIKE '%' + ? + '%'  -- 🔴 Que el nombre del archivo contenga el ID del punto
            ORDER BY ft.fecha_registro DESC
        """
        
        result = execute_query(query, (cedula, point_id), fetch_one=True)
        
        if result:
            return jsonify({
                "success": True,
                "id_foto": result[0],
                "file_path": result[1]
            })
        else:
            # 🔴 Si no hay foto disponible, verificar si ya existe una foto asignada
            check_assigned_query = """
                SELECT TOP 1 ft.id_foto, vm.id_visita, ft.file_path
                FROM FOTOS_TOTALES ft
                JOIN VISITAS_MERCADERISTA vm ON ft.id_visita = vm.id_visita
                JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
                WHERE vm.identificador_punto_interes = ?
                AND m.cedula = ?
                AND ft.id_tipo_foto = 5  -- Foto de activación
                AND ft.Estado = 'Aprobada'
                ORDER BY ft.fecha_registro DESC
            """
            
            assigned_result = execute_query(check_assigned_query, (point_id, cedula), fetch_one=True)
            
            if assigned_result:
                return jsonify({
                    "success": True,
                    "id_foto": assigned_result[0],
                    "id_visita": assigned_result[1],
                    "file_path": assigned_result[2],
                    "message": "Foto ya asignada a visita existente"
                })
            else:
                return jsonify({
                    "success": False,
                    "message": "No se encontró foto de activación disponible para este punto"
                }), 404
            
    except Exception as e:
        current_app.logger.error(f"Error en get_latest_activation_photo: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Error interno: {str(e)}"
        }), 500
    
@merchandisers_bp.route('/api/upload-gestion-photos', methods=['POST'])
def upload_gestion_photos():
    try:
        point_id = request.form.get('point_id')
        cedula = request.form.get('cedula')
        visita_id = request.form.get('visita_id')
        
        if not all([point_id, cedula, visita_id]):
            return jsonify({
                "success": False,
                "message": "Datos incompletos para subir fotos de gestión"
            }), 400
        
        # Obtener información del mercaderista y visita
        mercaderista_query = "SELECT id_mercaderista, nombre FROM MERCADERISTAS WHERE cedula = ?"
        mercaderista = execute_query(mercaderista_query, (cedula,), fetch_one=True)
        if not mercaderista:
            return jsonify({
                "success": False,
                "message": "Mercaderista no encontrado"
            }), 404
        
        mercaderista_id = mercaderista[0]
        mercaderista_nombre = mercaderista[1]
        
        # Obtener información de la visita
        visita_query = """
        SELECT
            pin.punto_de_interes,
            pin.departamento,
            pin.ciudad,
            c.cliente,
            c.id_cliente
        FROM VISITAS_MERCADERISTA vm
        JOIN PUNTOS_INTERES1 pin ON vm.identificador_punto_interes = pin.identificador
        JOIN CLIENTES c ON vm.id_cliente = c.id_cliente
        WHERE vm.id_visita = ?
        """
        visita = execute_query(visita_query, (visita_id,), fetch_one=True)
        if not visita:
            return jsonify({
                "success": False,
                "message": "Visita no encontrada"
            }), 404
        
        punto_nombre = visita[0]
        departamento = visita[1] or "SinDepartamento"
        ciudad = visita[2] or "SinCiudad"
        cliente_nombre = visita[3]
        cliente_id = visita[4]
        
        # Procesar fotos del antes
        antes_photos = request.files.getlist('antes_photos[]')
        despues_photos = request.files.getlist('despues_photos[]')
        
        if len(antes_photos) != len(despues_photos):
            return jsonify({
                "success": False,
                "message": "Debe haber la misma cantidad de fotos para antes y después"
            }), 400
        
        if len(antes_photos) == 0:
            return jsonify({
                "success": False,
                "message": "Debe subir al menos una foto de antes y una de después"
            }), 400
        
        results = {'antes': [], 'despues': []}
        fecha_actual = datetime.datetime.now().strftime("%Y-%m-%d")
        
        # Subir fotos del antes
        for idx, photo in enumerate(antes_photos):
            try:
                meta = extract_metadata_with_fallback(photo)
                device_lat = request.form.get(f'antes_lat_{idx}')
                device_lon = request.form.get(f'antes_lon_{idx}')
                device_alt = request.form.get(f'antes_alt_{idx}')
                
                if meta['latitud'] is None and device_lat:
                    meta['latitud'] = float(device_lat)
                if meta['longitud'] is None and device_lon:
                    meta['longitud'] = float(device_lon)
                if meta['altitud'] is None and device_alt:
                    meta['altitud'] = float(device_alt)
                
                # Generar nombre único
                timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S_%f")
                safe_departamento = departamento.replace('/', '-').replace('\\', '-')
                safe_ciudad = ciudad.replace('/', '-').replace('\\', '-')
                safe_punto = punto_nombre.replace('/', '-').replace('\\', '-')
                safe_cliente = cliente_nombre.replace('/', '-').replace('\\', '-')
                safe_mercaderista = mercaderista_nombre.replace('/', '-').replace('\\', '-')
                
                filename = f"gestion/{safe_departamento}/{safe_ciudad}/{safe_punto}/{safe_cliente}/{fecha_actual}/antes/{safe_mercaderista}_{timestamp}.jpg"
                
                # Subir a Azure
                upload_to_azure(photo, filename, 
                              current_app.config['AZURE_STORAGE_CONNECTION_STRING'],
                              current_app.config['AZURE_CONTAINER_NAME'])
                
                # Insertar en base de datos (id_tipo_foto = 1 para "Antes")
                foto_query = """
                INSERT INTO FOTOS_TOTALES
                (id_visita, categoria, file_path, fecha_registro, id_tipo_foto, Estado,
                 latitud, longitud, altitud, fecha_disparo,
                 fabricante_camara, modelo_camara, iso, apertura,
                 tiempo_exposicion, orientacion)
                VALUES (?, NULL, ?, GETDATE(), 1, 'Pendiente',
                        ?, ?, ?, ?,
                        ?, ?, ?, ?,
                        ?, ?)
                """
                execute_query(foto_query, (
                    visita_id, filename,
                    meta['latitud'], meta['longitud'], meta['altitud'], meta['fecha_disparo'],
                    meta['fabricante_camara'], meta['modelo_camara'], meta['iso'], meta['apertura'],
                    meta['tiempo_exposicion'], meta['orientacion']
                ), commit=True)
                
                results['antes'].append({
                    "success": True,
                    "file_path": filename,
                    "type": "antes"
                })
                
            except Exception as e:
                results['antes'].append({
                    "success": False,
                    "error": str(e),
                    "type": "antes"
                })
        
        # Subir fotos del después (similar al código anterior pero con id_tipo_foto = 2)
        for idx, photo in enumerate(despues_photos):
            try:
                meta = extract_metadata_with_fallback(photo)
                device_lat = request.form.get(f'despues_lat_{idx}')
                device_lon = request.form.get(f'despues_lon_{idx}')
                device_alt = request.form.get(f'despues_alt_{idx}')
                
                if meta['latitud'] is None and device_lat:
                    meta['latitud'] = float(device_lat)
                if meta['longitud'] is None and device_lon:
                    meta['longitud'] = float(device_lon)
                if meta['altitud'] is None and device_alt:
                    meta['altitud'] = float(device_alt)
                
                timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S_%f")
                safe_departamento = departamento.replace('/', '-').replace('\\', '-')
                safe_ciudad = ciudad.replace('/', '-').replace('\\', '-')
                safe_punto = punto_nombre.replace('/', '-').replace('\\', '-')
                safe_cliente = cliente_nombre.replace('/', '-').replace('\\', '-')
                safe_mercaderista = mercaderista_nombre.replace('/', '-').replace('\\', '-')
                
                filename = f"gestion/{safe_departamento}/{safe_ciudad}/{safe_punto}/{safe_cliente}/{fecha_actual}/despues/{safe_mercaderista}_{timestamp}.jpg"
                
                upload_to_azure(photo, filename, 
                              current_app.config['AZURE_STORAGE_CONNECTION_STRING'],
                              current_app.config['AZURE_CONTAINER_NAME'])
                
                # Insertar en base de datos (id_tipo_foto = 2 para "Después")
                foto_query = """
                INSERT INTO FOTOS_TOTALES
                (id_visita, categoria, file_path, fecha_registro, id_tipo_foto, Estado,
                 latitud, longitud, altitud, fecha_disparo,
                 fabricante_camara, modelo_camara, iso, apertura,
                 tiempo_exposicion, orientacion)
                VALUES (?, NULL, ?, GETDATE(), 2, 'Pendiente',
                        ?, ?, ?, ?,
                        ?, ?, ?, ?,
                        ?, ?)
                """
                execute_query(foto_query, (
                    visita_id, filename,
                    meta['latitud'], meta['longitud'], meta['altitud'], meta['fecha_disparo'],
                    meta['fabricante_camara'], meta['modelo_camara'], meta['iso'], meta['apertura'],
                    meta['tiempo_exposicion'], meta['orientacion']
                ), commit=True)
                
                results['despues'].append({
                    "success": True,
                    "file_path": filename,
                    "type": "despues"
                })
                
            except Exception as e:
                results['despues'].append({
                    "success": False,
                    "error": str(e),
                    "type": "despues"
                })
        
        # Contar fotos exitosas
        successful_antes = sum(1 for r in results['antes'] if r['success'])
        successful_despues = sum(1 for r in results['despues'] if r['success'])
        total_successful = successful_antes + successful_despues
        
        return jsonify({
            "success": True,
            "message": f"Se subieron {total_successful} fotos de gestión correctamente",
            "results": results,
            "total_successful": total_successful,
            "antes_count": successful_antes,
            "despues_count": successful_despues
        })
        
    except Exception as e:
        current_app.logger.error(f"Error en upload_gestion_photos: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Error interno: {str(e)}"
        }), 500