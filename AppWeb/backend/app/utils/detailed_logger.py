# app/utils/detailed_logger.py
"""
Logger detallado para debugging de uploads desde iPhone/iOS
Agrega esto a tu carpeta app/utils/
"""
from flask import request, current_app
import traceback
import sys

class DetailedLogger:
    """Logger para diagnosticar problemas de upload en iOS"""
    
    @staticmethod
    def log_request():
        """Log detallado del request completo"""
        print("\n" + "="*80)
        print("📱 DETAILED REQUEST LOG - iOS DEBUG")
        print("="*80)
        
        # 1. Headers del request
        print("\n📋 HEADERS:")
        for key, value in request.headers:
            print(f"   {key}: {value}")
        
        # 2. User Agent (identificar dispositivo)
        user_agent = request.headers.get('User-Agent', 'Unknown')
        print(f"\n📱 USER AGENT: {user_agent}")
        
        is_ios = 'iPhone' in user_agent or 'iPad' in user_agent or 'iOS' in user_agent
        is_safari = 'Safari' in user_agent and 'Chrome' not in user_agent
        print(f"   ├─ Es iOS: {is_ios}")
        print(f"   └─ Es Safari: {is_safari}")
        
        # 3. Content-Type
        content_type = request.content_type
        print(f"\n📦 CONTENT-TYPE: {content_type}")
        
        # 4. Form data
        print("\n📝 FORM DATA:")
        for key in request.form:
            value = request.form[key]
            print(f"   {key}: {value[:100] if len(str(value)) > 100 else value}")
        
        # 5. Files
        print("\n📁 FILES:")
        if request.files:
            for key in request.files:
                file = request.files[key]
                print(f"   Key: {key}")
                print(f"   ├─ filename: {file.filename}")
                print(f"   ├─ content_type: {file.content_type}")
                print(f"   ├─ mimetype: {file.mimetype}")
                print(f"   ├─ name: {file.name}")
                
                # Verificar si el archivo tiene contenido
                try:
                    file.seek(0, 2)  # Ir al final
                    size = file.tell()  # Obtener posición (tamaño)
                    file.seek(0)  # Volver al inicio
                    print(f"   ├─ size: {size} bytes ({size/1024:.2f} KB)")
                    
                    # Leer primeros bytes para detectar tipo real
                    first_bytes = file.read(12)
                    file.seek(0)  # Volver al inicio
                    
                    # Detectar formato real por magic bytes
                    real_format = DetailedLogger.detect_image_format(first_bytes)
                    print(f"   └─ formato_real: {real_format}")
                    
                except Exception as e:
                    print(f"   └─ ERROR leyendo archivo: {str(e)}")
        else:
            print("   ❌ No se recibieron archivos")
        
        print("\n" + "="*80)
        
    @staticmethod
    def detect_image_format(header_bytes):
        """Detectar formato de imagen por magic bytes"""
        if not header_bytes:
            return "EMPTY"
        
        # JPEG: FF D8 FF
        if header_bytes[:3] == b'\xff\xd8\xff':
            return "JPEG"
        
        # PNG: 89 50 4E 47
        if header_bytes[:4] == b'\x89PNG':
            return "PNG"
        
        # GIF: 47 49 46 38
        if header_bytes[:4] == b'GIF8':
            return "GIF"
        
        # HEIC/HEIF: ftypheic o ftypmif1 o ftypmsf1
        if b'ftyp' in header_bytes:
            if b'heic' in header_bytes or b'heix' in header_bytes:
                return "HEIC"
            if b'mif1' in header_bytes:
                return "HEIF"
            if b'avif' in header_bytes:
                return "AVIF"
        
        # WebP: 52 49 46 46 ... 57 45 42 50
        if header_bytes[:4] == b'RIFF' and len(header_bytes) >= 12:
            if header_bytes[8:12] == b'WEBP':
                return "WEBP"
        
        # BMP: 42 4D
        if header_bytes[:2] == b'BM':
            return "BMP"
        
        return f"UNKNOWN (first bytes: {header_bytes[:8].hex()})"
    
    @staticmethod
    def log_file_details(file_obj, label="FILE"):
        """Log detallado de un archivo específico"""
        print(f"\n🔍 {label} DETAILS:")
        
        if file_obj is None:
            print("   ❌ file_obj es None")
            return
        
        try:
            print(f"   ├─ type: {type(file_obj)}")
            print(f"   ├─ filename: {getattr(file_obj, 'filename', 'N/A')}")
            print(f"   ├─ content_type: {getattr(file_obj, 'content_type', 'N/A')}")
            print(f"   ├─ mimetype: {getattr(file_obj, 'mimetype', 'N/A')}")
            
            # Obtener tamaño
            current_pos = file_obj.tell()
            file_obj.seek(0, 2)
            size = file_obj.tell()
            file_obj.seek(current_pos)  # Restaurar posición
            print(f"   ├─ size: {size} bytes")
            
            # Verificar si está vacío
            if size == 0:
                print("   └─ ⚠️ ARCHIVO VACÍO!")
            else:
                # Leer header para detectar formato
                file_obj.seek(0)
                header = file_obj.read(12)
                file_obj.seek(0)
                real_format = DetailedLogger.detect_image_format(header)
                print(f"   └─ formato_detectado: {real_format}")
                
        except Exception as e:
            print(f"   └─ ERROR: {str(e)}")
            traceback.print_exc()

    @staticmethod
    def log_error(error, context=""):
        """Log detallado de errores"""
        print(f"\n❌ ERROR {context}:")
        print(f"   Type: {type(error).__name__}")
        print(f"   Message: {str(error)}")
        print(f"   Traceback:")
        traceback.print_exc()
        
        # Log a archivo también
        try:
            current_app.logger.error(f"ERROR {context}: {str(error)}", exc_info=True)
        except:
            pass