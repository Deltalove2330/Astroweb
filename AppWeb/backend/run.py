# run.py
import eventlet
import socket
import sys
import traceback
from datetime import datetime
import os

eventlet.monkey_patch()  # ✅ CRÍTICO: Debe estar AL INICIO antes de cualquier import

# ========== CONFIGURACIÓN DE LOGS DETALLADOS ==========
class DetailedLogger:
    """Logger personalizado para mostrar errores con detalles completos"""
    
    @staticmethod
    def handle_exception(exc_type, exc_value, exc_traceback):
        """Maneja excepciones no capturadas mostrando detalles completos"""
        if issubclass(exc_type, KeyboardInterrupt):
            sys.__excepthook__(exc_type, exc_value, exc_traceback)
            return
        
        print("\n" + "="*100)
        print("🚨 ERROR CRÍTICO DEL SISTEMA")
        print("="*100)
        
        # Información básica del error
        print(f"📅 Fecha/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"📂 Directorio actual: {os.getcwd()}")
        print(f"📦 Exception Type: {exc_type.__name__}")
        print(f"💬 Mensaje: {exc_value}")
        
        print("\n" + "-"*100)
        print("🔍 TRAZA COMPLETA DEL ERROR:")
        print("-"*100)
        
        # Obtener traceback completo con colores mejorados
        tb_lines = traceback.format_exception(exc_type, exc_value, exc_traceback)
        for i, line in enumerate(tb_lines):
            # Resaltar líneas de archivos
            if "File " in line:
                print(f"\033[93m{line.rstrip()}\033[0m")  # Amarillo para rutas de archivos
            elif "line " in line.lower():
                print(f"\033[96m{line.rstrip()}\033[0m")  # Cyan para números de línea
            else:
                print(line.rstrip())
        
        print("\n" + "="*100 + "\n")
        
        # También guardar en archivo de log
        try:
            with open('system_errors.log', 'a', encoding='utf-8') as f:
                f.write(f"\n{'='*80}\n")
                f.write(f"ERROR: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"Type: {exc_type.__name__}\n")
                f.write(f"Message: {exc_value}\n")
                f.write(f"Traceback:\n")
                f.writelines(tb_lines)
                f.write(f"{'='*80}\n")
        except:
            pass

# Configurar el manejador de excepciones
sys.excepthook = DetailedLogger.handle_exception

# ========== OBTENER IPs DISPONIBLES ==========
def get_network_ips():
    """Obtiene todas las IPs de red disponibles sin dependencias externas"""
    ips = []
    
    try:
        # Obtener el nombre del host
        hostname = socket.gethostname()
        
        # Obtener todas las IPs asociadas (método básico)
        try:
            all_ips = socket.gethostbyname_ex(hostname)[2]
            # Filtrar IPs locales válidas (no loopback)
            for ip in all_ips:
                if not ip.startswith('127.') and ip not in ips:
                    ips.append(ip)
        except:
            pass
        
        # Método alternativo usando socket UDP (funciona en la mayoría de sistemas)
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.settimeout(0.1)
            # Conectar a un DNS público
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            if ip not in ips:
                ips.append(ip)
        except:
            pass
        
        # Intentar obtener IPs de todas las interfaces
        try:
            # Esto funciona en Windows, Linux y Mac
            import subprocess
            import platform
            
            system = platform.system()
            
            if system == "Windows":
                # Comando para Windows
                result = subprocess.run(['ipconfig'], capture_output=True, text=True)
                for line in result.stdout.split('\n'):
                    if 'IPv4 Address' in line or 'Dirección IPv4' in line:
                        parts = line.split(':')
                        if len(parts) > 1:
                            ip = parts[1].strip()
                            if ip and ip != '127.0.0.1' and ip not in ips:
                                ips.append(ip)
            
            elif system in ["Linux", "Darwin"]:  # Darwin es MacOS
                # Comando para Linux/Mac
                result = subprocess.run(['ifconfig', '-a'], capture_output=True, text=True)
                lines = result.stdout.split('\n')
                for i, line in enumerate(lines):
                    if 'inet ' in line and '127.0.0.1' not in line:
                        parts = line.strip().split()
                        if len(parts) >= 2:
                            ip = parts[1]
                            if ip and ip not in ips:
                                ips.append(ip)
        except:
            pass
            
    except Exception as e:
        # Si todo falla, solo mostrar localhost
        pass
    
    # Si no hay IPs, usar localhost
    if not ips:
        ips.append('127.0.0.1')
    
    return list(set(ips))  # Eliminar duplicados

# ========== MOSTRAR INFORMACIÓN DEL SISTEMA ==========
def display_system_info():
    """Muestra información detallada del sistema"""
    print("\033[95m" + "="*80 + "\033[0m")
    print("\033[95m🚀 INICIANDO SERVIDOR FLASK-SOCKETIO\033[0m")
    print("\033[95m" + "="*80 + "\033[0m")
    
    # Obtener IPs disponibles
    network_ips = get_network_ips()
    
    # Mostrar información básica
    print(f"\n\033[94m📊 INFORMACIÓN DEL SISTEMA:\033[0m")
    print(f"   📂 Directorio: \033[93m{os.getcwd()}\033[0m")
    
    # Mostrar IPs de red
    print(f"\n\033[94m🌐 DIRECCIONES DE ACCESO DISPONIBLES:\033[0m")
    print(f"   🔗 Local:      \033[92mhttp://localhost:5000\033[0m")
    print(f"   🔗 Local:      \033[92mhttp://127.0.0.1:5000\033[0m")
    
    for idx, ip in enumerate(network_ips, 1):
        if idx == 1:
            print(f"   🌍 Red Principal: \033[92mhttp://{ip}:5000\033[0m")
        else:
            print(f"   🌍 Red {idx}:     \033[92mhttp://{ip}:5000\033[0m")
    
    print(f"\n\033[94m🔧 CONFIGURACIÓN:\033[0m")
    print(f"   🚪 Puerto:      \033[93m5000\033[0m")
    print(f"   🎭 Async Mode:  \033[93meventlet\033[0m")
    print(f"   📡 WebSocket:   \033[92mACTIVADO\033[0m")
    print(f"   🐛 Debug Mode:  \033[93mACTIVADO\033[0m")

# Mostrar información del sistema
display_system_info()

# ========== CONFIGURACIÓN DE LA APLICACIÓN ==========
try:
    from app import create_app
    from app.utils.auth import load_user
    
    # Crear la aplicación
    app, login_manager = create_app()
    
    # ✅ Importar socketio DESPUÉS de crear la app
    from app import socketio
    
    # ✅ Configurar el user loader para Flask-Login
    @login_manager.user_loader
    def user_loader(user_id):
        """Carga el usuario desde la base de datos cuando se autentica"""
        return load_user(user_id)
    
    print(f"\n\033[94m✅ APLICACIÓN INICIALIZADA CORRECTAMENTE\033[0m")
    
    if __name__ == "__main__":
        # ✅ Verificar que socketio existe y usar socketio.run
        if socketio is None:
            print("\033[91m" + "="*80 + "\033[0m")
            print("\033[91m❌ ADVERTENCIA: SocketIO no se inicializó correctamente\033[0m")
            print("\033[93m💡 Ejecutando sin WebSocket...\033[0m")
            print("\033[91m" + "="*80 + "\033[0m" + "\n")
            
            # Configurar Flask para logs detallados
            import logging
            
            # Configurar logger para mostrar archivos y líneas de error
            logging.basicConfig(
                level=logging.DEBUG,
                format='\033[91m%(asctime)s - %(name)s - %(levelname)s\033[0m\n\033[93m📍 %(pathname)s:%(lineno)d\033[0m\n   💬 %(message)s\n',
                handlers=[
                    logging.StreamHandler(),
                    logging.FileHandler('flask_errors.log', encoding='utf-8')
                ]
            )
            
            app.run(
                host='0.0.0.0', 
                port=5000, 
                debug=True,
                threaded=True
            )
        else:
            print("\033[92m" + "="*80 + "\033[0m")
            print("\033[92m✅ SocketIO inicializado correctamente\033[0m")
            print("\033[92m🔔 Sistema de notificaciones en tiempo real: ACTIVO\033[0m")
            print("\033[92m" + "="*80 + "\033[0m" + "\n")
            
            # Configurar logging para mostrar errores con detalles
            import logging
            
            # Configurar logger para Flask-SocketIO (solo errores)
            logging.getLogger('socketio').setLevel(logging.WARNING)
            logging.getLogger('engineio').setLevel(logging.WARNING)
            
            # Configurar logger para Flask (más detallado)
            flask_logger = logging.getLogger('werkzeug')
            flask_logger.setLevel(logging.INFO)
            
            # Handler personalizado para Flask
            class ColoredFormatter(logging.Formatter):
                def format(self, record):
                    # Colores para diferentes tipos de logs
                    if record.levelno >= logging.ERROR:
                        color = '\033[91m'  # Rojo para errores
                    elif record.levelno >= logging.WARNING:
                        color = '\033[93m'  # Amarillo para warnings
                    elif record.levelno >= logging.INFO:
                        color = '\033[92m'  # Verde para info
                    else:
                        color = '\033[96m'  # Cyan para debug
                    
                    # Formato con colores
                    message = super().format(record)
                    return f"{color}{message}\033[0m"
            
            # Configurar handler para consola con colores
            console_handler = logging.StreamHandler()
            console_handler.setLevel(logging.DEBUG)
            console_handler.setFormatter(ColoredFormatter(
                '[%(asctime)s] %(levelname)s en %(module)s.%(funcName)s [Línea %(lineno)d]:\n   %(message)s'
            ))
            
            # Aplicar handler a los loggers
            flask_logger.addHandler(console_handler)
            app.logger.addHandler(console_handler)
            
            # ✅ Usar socketio.run con configuración optimizada
            socketio.run(
                app,
                host='0.0.0.0',
                port=5000,
                debug=True,
                use_reloader=False,      # ✅ Evitar recargas que rompen WebSocket
                log_output=True,         # ✅ Mostrar logs de conexión
                allow_unsafe_werkzeug=True  # ✅ Permitir Werkzeug en modo debug
            )
            
except Exception as e:
    print("\n\033[91m" + "="*80 + "\033[0m")
    print("\033[91m❌ ERROR AL INICIALIZAR LA APLICACIÓN\033[0m")
    print("\033[91m" + "="*80 + "\033[0m")
    
    # Mostrar el error con detalles usando nuestro logger personalizado
    exc_type, exc_value, exc_traceback = sys.exc_info()
    DetailedLogger.handle_exception(exc_type, exc_value, exc_traceback)
    
    sys.exit(1)