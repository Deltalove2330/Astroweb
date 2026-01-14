# app/utils/detailed_logger.py
# LOGGING DETALLADO - NO TOCA NADA DEL CÓDIGO EXISTENTE
# Solo importa y usa

import sys
import datetime
import traceback
from functools import wraps
from flask import request

class DetailedLogger:
    """Logger ultra detallado para debugging"""
    
    @staticmethod
    def setup():
        """Configura el logging para que se vea TODO"""
        import logging
        
        # Configurar para que se vea en consola
        logging.basicConfig(
            level=logging.DEBUG,
            format='%(message)s',
            handlers=[
                logging.StreamHandler(sys.stdout)
            ],
            force=True  # Forzar reconfiguración
        )
        
        # Hacer que print se vea inmediatamente
        sys.stdout.reconfigure(line_buffering=True) if hasattr(sys.stdout, 'reconfigure') else None
    
    @staticmethod
    def log(msg, level="INFO"):
        """Log con timestamp y emoji"""
        emojis = {
            "START": "🚀",
            "INFO": "ℹ️",
            "SUCCESS": "✅",
            "ERROR": "❌",
            "WARNING": "⚠️",
            "DEBUG": "🔍",
            "DATA": "📊"
        }
        
        timestamp = datetime.datetime.now().strftime("%H:%M:%S.%f")[:-3]
        emoji = emojis.get(level, "📝")
        line = f"[{timestamp}] {emoji} {msg}"
        
        print(line, flush=True)
        sys.stdout.flush()
        
        # Guardar en archivo
        try:
            with open('detailed_logs.log', 'a', encoding='utf-8') as f:
                f.write(line + '\n')
                f.flush()
        except:
            pass
    
    @staticmethod
    def log_request():
        """Log detallado de la petición actual"""
        DetailedLogger.log("="*80, "START")
        DetailedLogger.log(f"NUEVA PETICIÓN: {request.method} {request.path}", "START")
        DetailedLogger.log("="*80, "START")
        
        # Headers importantes
        DetailedLogger.log(f"Content-Type: {request.content_type}", "DEBUG")
        DetailedLogger.log(f"Content-Length: {request.content_length}", "DEBUG")
        
        # Form data
        if request.form:
            DetailedLogger.log("FORM DATA recibida:", "DATA")
            for key, value in request.form.items():
                DetailedLogger.log(f"  • {key} = {value}", "DEBUG")
        
        # Files
        if request.files:
            DetailedLogger.log("FILES recibidos:", "DATA")
            for key, file in request.files.items():
                file_size = len(file.read())
                file.seek(0)  # Volver al inicio
                DetailedLogger.log(f"  • {key} = {file.filename} ({file_size} bytes, {file.content_type})", "DEBUG")
    
    @staticmethod
    def log_exception(e):
        """Log detallado de excepción"""
        DetailedLogger.log("="*80, "ERROR")
        DetailedLogger.log(f"EXCEPCIÓN: {type(e).__name__}", "ERROR")
        DetailedLogger.log(f"Mensaje: {str(e)}", "ERROR")
        DetailedLogger.log("TRACEBACK:", "ERROR")
        for line in traceback.format_exc().split('\n'):
            if line.strip():
                DetailedLogger.log(f"  {line}", "ERROR")
        DetailedLogger.log("="*80, "ERROR")


def log_endpoint(func):
    """Decorador para loggear endpoints automáticamente"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        DetailedLogger.log_request()
        
        try:
            DetailedLogger.log(f"Ejecutando: {func.__name__}()", "INFO")
            result = func(*args, **kwargs)
            DetailedLogger.log(f"✅ {func.__name__}() completado exitosamente", "SUCCESS")
            return result
        except Exception as e:
            DetailedLogger.log_exception(e)
            raise
    
    return wrapper


# Función para monitorear queries SQL
original_execute_query = None

def patch_execute_query():
    """Parchea execute_query para ver todas las queries"""
    global original_execute_query
    
    try:
        from app.utils.database import execute_query as orig_eq
        original_execute_query = orig_eq
        
        def logged_execute_query(query, params=None, fetch_one=False, commit=False):
            """Version con logs de execute_query"""
            DetailedLogger.log("EJECUTANDO QUERY:", "DATA")
            DetailedLogger.log(f"  SQL: {query[:200]}...", "DEBUG")
            DetailedLogger.log(f"  Params: {params}", "DEBUG")
            DetailedLogger.log(f"  fetch_one={fetch_one}, commit={commit}", "DEBUG")
            
            try:
                result = original_execute_query(query, params, fetch_one, commit)
                DetailedLogger.log(f"  Resultado: {result if fetch_one else f'{len(result) if result else 0} filas'}", "SUCCESS")
                return result
            except Exception as e:
                DetailedLogger.log(f"  ERROR en query: {str(e)}", "ERROR")
                raise
        
        # Reemplazar en el módulo
        import app.utils.database as db_module
        db_module.execute_query = logged_execute_query
        
        DetailedLogger.log("✅ execute_query parcheado para logging", "SUCCESS")
    except Exception as e:
        DetailedLogger.log(f"⚠️ No se pudo parchear execute_query: {str(e)}", "WARNING")


# Función para monitorear Azure uploads
def patch_azure_upload():
    """Parchea upload_to_azure para ver uploads"""
    try:
        from app.utils.azure_storage import upload_to_azure as orig_upload
        
        def logged_upload_to_azure(file, blob_name, connection_string, container_name):
            """Version con logs de upload_to_azure"""
            DetailedLogger.log("SUBIENDO A AZURE:", "DATA")
            DetailedLogger.log(f"  Blob: {blob_name}", "DEBUG")
            DetailedLogger.log(f"  Container: {container_name}", "DEBUG")
            DetailedLogger.log(f"  File: {file.filename if hasattr(file, 'filename') else 'N/A'}", "DEBUG")
            
            try:
                result = orig_upload(file, blob_name, connection_string, container_name)
                DetailedLogger.log("  ✅ Upload a Azure exitoso", "SUCCESS")
                return result
            except Exception as e:
                DetailedLogger.log(f"  ❌ Error en Azure: {str(e)}", "ERROR")
                raise
        
        # Reemplazar
        import app.utils.azure_storage as azure_module
        azure_module.upload_to_azure = logged_upload_to_azure
        
        DetailedLogger.log("✅ upload_to_azure parcheado para logging", "SUCCESS")
    except Exception as e:
        DetailedLogger.log(f"⚠️ No se pudo parchear upload_to_azure: {str(e)}", "WARNING")


def enable_detailed_logging():
    """Activa TODOS los logs detallados de una vez"""
    print("\n" + "🔥"*50)
    print("🔥 ACTIVANDO LOGGING DETALLADO")
    print("🔥"*50 + "\n")
    
    DetailedLogger.setup()
    patch_execute_query()
    patch_azure_upload()
    
    print("\n" + "✅"*50)
    print("✅ LOGGING DETALLADO ACTIVADO")
    print("✅ Todos los logs se verán en consola Y en detailed_logs.log")
    print("✅"*50 + "\n")
    sys.stdout.flush()