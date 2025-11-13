# utils.py (actualizado)
import os
from datetime import datetime
from config import PHOTO_DIR
import logging
from config import TOKEN, LOG_FORMAT, LOG_LEVEL, PHOTO_DIR
import hashlib


logging.basicConfig(format=LOG_FORMAT, level=LOG_LEVEL)
logger = logging.getLogger(__name__)

def calculate_photo_hash(file_path):
    """Calcula el hash SHA-256 de una foto"""
    try:
        with open(file_path, "rb") as f:
            bytes = f.read()
            readable_hash = hashlib.sha256(bytes).hexdigest()
            return readable_hash
    except Exception as e:
        logger.error(f"Error calculando hash de foto {file_path}: {str(e)}")
        return None

def generate_photo_path(context, tipo="general"):
    """
    Genera una ruta única para guardar fotos, manteniendo la estructura existente
    y añadiendo subdirectorios para 'antes' y 'despues'
    """
    # Obtener datos del contexto con valores por defecto
    depto = context.user_data.get('departamento', 'Sin_Departamento')
    ciudad = context.user_data.get('ciudad', 'Sin_Ciudad')
    poi = context.user_data.get('punto_interes', 'Sin_PuntoInteres')
    cliente = context.user_data.get('cliente', 'Sin_Cliente')
    fecha = datetime.now().strftime("%Y-%m-%d")
    
    # Sanitizar nombres
    sanitized_parts = [
        sanitize(depto),
        sanitize(ciudad),
        sanitize(poi),
        sanitize(cliente),
        fecha
    ]
    
    # Crear estructura base de directorios
    base_path = os.path.join(PHOTO_DIR, *sanitized_parts)
    
    # Crear subdirectorios para antes/después
    if tipo == "antes":
        full_path = os.path.join(base_path, "antes")
    elif tipo == "despues":
        full_path = os.path.join(base_path, "despues")
    else:
        full_path = base_path
    
    # Crear directorios si no existen
    try:
        os.makedirs(full_path, exist_ok=True)
        return full_path
    except Exception as e:
        logger.error(f"Error creando directorios: {str(e)}")
        # Fallback a directorio raíz si hay problemas
        #return PHOTO_DIR
        return full_path.replace("X:\\", "")
    
def sanitize(name):
    """Limpia caracteres problemáticos para sistemas de archivos"""
    if not name:
        return "Sin_Nombre"
    invalid_chars = r'<>:"/\|?*'
    for char in invalid_chars:
        name = name.replace(char, '_')
    # Limitar longitud para rutas de Windows (260 caracteres)
    return name.strip()[:50]