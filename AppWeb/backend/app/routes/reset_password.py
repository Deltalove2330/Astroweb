#app/routes/reset_password.py
from flask import Blueprint, request, jsonify
from app.utils.auth import get_user_by_username
from app.utils.database import execute_query
import bcrypt
import random
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta
import logging

# Configuración del logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuración del correo
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
EMAIL_USER = 'sisa.auditoria@gmail.com'
EMAIL_PASS = 'upfr dnao qydj fllt'
#EMAIL_USER = 'abreuyoel4@gmail.com'
#EMAIL_PASS = 'zevy nmmp mspo kwdv'

reset_pass_bp = Blueprint('reset_pass', __name__)

reset_codes = {}  # Temporal, usa Redis o BD en producción

@reset_pass_bp.route('/api/request-reset-code', methods=['POST'])
def request_reset_code():
    data = request.get_json()
    username = data.get('username')
    
    if not username:
        return jsonify({'success': False, 'message': 'Nombre de usuario requerido'})
    
    user = get_user_by_username(username)
    if not user:
        return jsonify({'success': False, 'message': 'Usuario no encontrado'})
    
    # Verifica que el usuario tenga un email
    if not user.email:
        return jsonify({'success': False, 'message': 'El usuario no tiene un correo electrónico registrado'})
    
    # Genera y almacena el código (una sola vez)
    code = str(random.randint(100000, 999999))
    reset_codes[username] = {
        'code': code,
        'expires': datetime.utcnow() + timedelta(minutes=15)
    }
    
    try:
        # Configura el mensaje con el email del usuario
        msg = MIMEText(f'Tu código de restablecimiento es: {code}')
        msg['Subject'] = 'Restablecer contraseña - AstroWeb'
        msg['From'] = EMAIL_USER
        msg['To'] = user.email  # Aquí usamos el email del usuario
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, [user.email], msg.as_string())  # Enviamos al email del usuario
        
        logger.info(f"Código de restablecimiento enviado a {user.email} para el usuario {username}")
        return jsonify({'success': True})
    except Exception as e:
        logger.error(f"Error al enviar correo de restablecimiento a {username}: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al enviar el correo de restablecimiento'})


@reset_pass_bp.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    code = data.get('code')
    new_password = data.get('new_password')
    
    # Validaciones iniciales
    if not code or not new_password:
        return jsonify({'success': False, 'message': 'Código y nueva contraseña son requeridos'})
    
    # Validar longitud mínima de contraseña
    if len(new_password) < 8:
        return jsonify({'success': False, 'message': 'La contraseña debe tener al menos 8 caracteres'})
    
    # Buscar usuario con código válido
    username = None
    for user, data in reset_codes.items():
        if data['code'] == code and datetime.utcnow() < data['expires']:
            username = user
            break
    
    if not username:
        logger.warning(f"Intento de restablecimiento con código inválido o expirado: {code}")
        return jsonify({'success': False, 'message': 'Código inválido o expirado'})
    
    try:
        # Hashear nueva contraseña - CORREGIDO: fuera del bloque if
        hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        
        # Actualizar en BD
        query = "UPDATE USUARIOS SET password_hash = ? WHERE username = ?"
        rows_affected = execute_query(query, (hashed.decode('utf-8'), username), commit=True)
        
        # Verificar si se actualizó algún registro
        if rows_affected == 0:
            logger.error(f"No se encontró el usuario {username} en la base de datos durante restablecimiento")
            return jsonify({'success': False, 'message': 'Usuario no encontrado en la base de datos'})
        
        # Eliminar código usado
        if username in reset_codes:
            del reset_codes[username]
        
        logger.info(f"Contraseña actualizada exitosamente para el usuario: {username}")
        return jsonify({'success': True, 'message': 'Contraseña actualizada correctamente'})
    
    except Exception as e:
        logger.error(f"Error al restablecer contraseña para {username}: {str(e)}")
        return jsonify({'success': False, 'message': 'Error interno del servidor'})