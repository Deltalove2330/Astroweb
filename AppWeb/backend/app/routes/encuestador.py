from flask import Blueprint, render_template, request, jsonify, current_app
from flask_login import login_required, current_user
from app.utils.database import execute_query
import traceback

encuestador_bp = Blueprint('encuestador', __name__, url_prefix='/encuestador')

@encuestador_bp.route('/formulario')
@login_required
def formulario():
    """
    Muestra el formulario de encuesta para usuarios con id_rol = 12.
    """
    try:
        # Verificar que el usuario tenga el rol de encuestador
        # Usamos getattr por si el atributo no existe (evita AttributeError)
        id_rol = getattr(current_user, 'id_rol', None)
        if id_rol != 12:
            current_app.logger.warning(f"Acceso denegado a formulario: usuario {current_user.username} con id_rol={id_rol}")
            return "No autorizado: Solo encuestadores pueden acceder", 403

        # Intentar renderizar el template
        return render_template('encuestador_form.html')
    
    except Exception as e:
        current_app.logger.error(f"Error en formulario encuestador: {str(e)}\n{traceback.format_exc()}")
        return f"Error interno del servidor: {str(e)}", 500


@encuestador_bp.route('/api/guardar', methods=['POST'])
@login_required
def guardar_encuesta():
    """
    Guarda los datos del formulario en la tabla ENCUESTAS_CANTINAS.
    """
    try:
        # Validar rol
        id_rol = getattr(current_user, 'id_rol', None)
        if id_rol != 12:
            return jsonify({'error': 'No autorizado'}), 403

        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se recibieron datos'}), 400

        # Lista de campos obligatorios
        required_fields = [
            'municipio', 'nombre_local', 'punto_referencia', 'enlace_ubicacion',
            'tipo_cantina', 'cliente_interesado', 'nombre_encargado',
            'telefono', 'correo', 'cargo', 'documentacion_cumple',
            'razon_social', 'rif'
        ]
        
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'El campo "{field}" es requerido'}), 400

        # Convertir radios a enteros (1 = Sí, 0 = No)
        cliente_interesado = 1 if data['cliente_interesado'] == 'si' else 0
        documentacion_cumple = 1 if data['documentacion_cumple'] == 'si' else 0

        # Insertar en la base de datos
        query = """
            INSERT INTO ENCUESTAS_CANTINAS (
                municipio, nombre_local, punto_referencia, enlace_ubicacion,
                tipo_cantina, cliente_interesado, nombre_encargado, telefono,
                correo, cargo, documentacion_cumple, razon_social, rif,
                id_usuario, fecha_creacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE())
        """
        params = (
            data['municipio'], data['nombre_local'], data['punto_referencia'],
            data['enlace_ubicacion'], data['tipo_cantina'], cliente_interesado,
            data['nombre_encargado'], data['telefono'], data['correo'],
            data['cargo'], documentacion_cumple, data['razon_social'],
            data['rif'], current_user.id
        )

        execute_query(query, params, commit=True)
        current_app.logger.info(f"Encuesta guardada por usuario {current_user.username} (ID: {current_user.id})")
        
        return jsonify({'success': True, 'message': 'Encuesta guardada correctamente'})

    except Exception as e:
        current_app.logger.error(f"Error guardando encuesta: {str(e)}\n{traceback.format_exc()}")
        return jsonify({'error': f'Error interno: {str(e)}'}), 500