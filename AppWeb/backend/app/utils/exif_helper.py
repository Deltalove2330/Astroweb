# app/utils/exif_helper.py
import exifread
import datetime
import re
from flask import  current_app


def dms_to_decimal(degrees, minutes, seconds):
    """Convert degrees, minutes, seconds to decimal degrees."""
    return degrees + (minutes / 60.0) + (seconds / 3600.0)

def exif_to_decimal(coord, ref):
    """Convierte tupla EXIF (grados, minutos, segundos) + referencia a decimal."""
    if not coord or not ref:
        return None
    try:
        degrees = float(coord[0])
        minutes = float(coord[1])
        seconds = float(coord[2])
        decimal = dms_to_decimal(degrees, minutes, seconds)
        return -decimal if ref in ['S', 'W'] else decimal
    except Exception:
        return None

def _parse_exif_number(val):
    """
    Convierte cualquier valor EXIF (lista, string '123/1', '[123]', etc.) a float o None.
    """
    if val is None:
        return None
    # Si es lista con dos elementos, tratar como fracción
    if isinstance(val, list) and len(val) == 2:
        try:
            return float(val[0]) / float(val[1])
        except Exception:
            return None
    # Si es string que parece lista '[880]'
    if isinstance(val, str):
        val = val.strip()
        # quitar corchetes si los tiene
        if val.startswith('[') and val.endswith(']'):
            val = val[1:-1]
        # fracción 123/1
        if '/' in val:
            num, den = val.split('/', 1)
            try:
                return float(num) / float(den)
            except Exception:
                return None
        # número simple
        try:
            return float(val)
        except Exception:
            return None
    # cualquier otro caso
    try:
        return float(val)
    except Exception:
        return None

def extract_metadata(file_storage):
    """
    Recibe FileStorage (foto), devuelve dict con todos los metadatos.
    """
    file_storage.seek(0)
    tags = exifread.process_file(file_storage, details=False)
    file_storage.seek(0)  # dejar puntero al inicio para próximo read

    def get_tag(key, default=None, cast=str):
        if key in tags:
            val = tags[key].values if hasattr(tags[key], 'values') else tags[key]
            return cast(val) if val else default
        return default

    gps_lat  = get_tag('GPS GPSLatitude')
    gps_lat_ref = get_tag('GPS GPSLatitudeRef')
    gps_lon  = get_tag('GPS GPSLongitude')
    gps_lon_ref = get_tag('GPS GPSLongitudeRef')
    gps_alt_tag = get_tag('GPS GPSAltitude')
    gps_alt = _parse_exif_number(gps_alt_tag)

    lat = exif_to_decimal(gps_lat, gps_lat_ref) if gps_lat else None
    lon = exif_to_decimal(gps_lon, gps_lon_ref) if gps_lon else None
    alt = gps_alt if gps_alt else None

    fecha_disparo = None
    if 'EXIF DateTimeOriginal' in tags:
        dt_str = str(tags['EXIF DateTimeOriginal'])
        try:
            fecha_disparo = datetime.datetime.strptime(dt_str, '%Y:%m:%d %H:%M:%S')
        except Exception:
            pass

    return {
    'latitud': lat,
    'longitud': lon,
    'altitud': alt,
    'fecha_disparo': fecha_disparo,
    'fabricante_camara': get_tag('Image Make'),
    'modelo_camara': get_tag('Image Model'),
    'iso': _parse_exif_number(get_tag('EXIF ISOSpeedRatings')),
    'apertura': str(_parse_exif_number(get_tag('EXIF FNumber'))),
    'tiempo_exposicion': str(_parse_exif_number(get_tag('EXIF ExposureTime'))),
    'orientacion': str(get_tag('Image Orientation'))
    }


def extract_metadata_with_fallback(file_storage, device_meta=None):
    """
    Extrae metadatos EXIF y usa metadatos del dispositivo como fallback.
    """
    try:
        # Intentar extraer metadatos EXIF
        meta = extract_metadata(file_storage)
        
        # Si no hay coordenadas en EXIF y tenemos metadatos del dispositivo, usarlos
        if (meta['latitud'] is None or meta['longitud'] is None) and device_meta:
            meta['latitud'] = device_meta.get('lat')
            meta['longitud'] = device_meta.get('lon')
            meta['altitud'] = device_meta.get('alt') or meta['altitud']
        
        # Si no hay fecha de disparo, usar fecha actual
        if meta['fecha_disparo'] is None:
            meta['fecha_disparo'] = datetime.datetime.now()
            
        return meta
    except Exception as e:
        current_app.logger.warning(f"Error al extraer metadatos EXIF: {str(e)}")
        # Retornar metadatos básicos del dispositivo como fallback
        return {
            'latitud': device_meta.get('lat') if device_meta else None,
            'longitud': device_meta.get('lon') if device_meta else None,
            'altitud': device_meta.get('alt') if device_meta else None,
            'fecha_disparo': datetime.datetime.now(),
            'fabricante_camara': 'Dispositivo',
            'modelo_camara': device_meta.get('device') if device_meta else 'Desconocido',
            'iso': 'Auto',
            'apertura': 'Auto',
            'tiempo_exposicion': 'Auto',
            'orientacion': '0'
        }