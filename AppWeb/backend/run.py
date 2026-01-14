# run.py
import eventlet
eventlet.monkey_patch()  # ✅ CRÍTICO: Debe estar AL INICIO antes de cualquier import

import socket
import sys
import traceback
from datetime import datetime
import os

# ========== CONFIGURAR UTF-8 PARA WINDOWS ==========
if sys.platform == 'win32':
    # Configurar salida UTF-8 en Windows
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')
    
    # Habilitar soporte ANSI en Windows 10/11
    try:
        import ctypes
        kernel32 = ctypes.windll.kernel32
        kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
    except:
        pass

# ========== CONFIGURACIÓN DE LOGS DETALLADOS ==========
class DetailedLogger:
    """Logger personalizado para mostrar errores con detalles completos"""
    
    @staticmethod
    def safe_print(text):
        """Imprime texto de forma segura, manejando errores de codificación"""
        try:
            print(text)
        except UnicodeEncodeError:
            # Remover caracteres problemáticos
            safe_text = text.encode('ascii', 'ignore').decode('ascii')
            print(safe_text)
    
    @staticmethod
    def handle_exception(exc_type, exc_value, exc_traceback):
        """Maneja excepciones no capturadas mostrando detalles completos"""
        if issubclass(exc_type, KeyboardInterrupt):
            sys.__excepthook__(exc_type, exc_value, exc_traceback)
            return
        
        DetailedLogger.safe_print("\n" + "="*100)
        DetailedLogger.safe_print("ERROR CRÍTICO DEL SISTEMA")
        DetailedLogger.safe_print("="*100)
        
        # Información básica del error
        DetailedLogger.safe_print(f"Fecha/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        DetailedLogger.safe_print(f"Directorio actual: {os.getcwd()}")
        DetailedLogger.safe_print(f"Exception Type: {exc_type.__name__}")
        DetailedLogger.safe_print(f"Mensaje: {exc_value}")
        
        DetailedLogger.safe_print("\n" + "-"*100)
        DetailedLogger.safe_print("TRAZA COMPLETA DEL ERROR:")
        DetailedLogger.safe_print("-"*100)
        
        # Obtener traceback completo
        tb_lines = traceback.format_exception(exc_type, exc_value, exc_traceback)
        for line in tb_lines:
            DetailedLogger.safe_print(line.rstrip())
        
        DetailedLogger.safe_print("\n" + "="*100 + "\n")
        
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
        hostname = socket.gethostname()
        
        try:
            all_ips = socket.gethostbyname_ex(hostname)[2]
            for ip in all_ips:
                if not ip.startswith('127.') and ip not in ips:
                    ips.append(ip)
        except:
            pass
        
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.settimeout(0.1)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            if ip not in ips:
                ips.append(ip)
        except:
            pass
        
        try:
            import subprocess
            import platform
            
            system = platform.system()
            
            if system == "Windows":
                result = subprocess.run(['ipconfig'], capture_output=True, text=True, encoding='utf-8', errors='ignore')
                for line in result.stdout.split('\n'):
                    if 'IPv4' in line or 'Dirección IPv4' in line or 'Direcci' in line:
                        parts = line.split(':')
                        if len(parts) > 1:
                            ip = parts[1].strip().split()[0]
                            if ip and ip != '127.0.0.1' and ip not in ips and '.' in ip:
                                ips.append(ip)
            
            elif system in ["Linux", "Darwin"]:
                result = subprocess.run(['ifconfig', '-a'], capture_output=True, text=True)
                lines = result.stdout.split('\n')
                for line in lines:
                    if 'inet ' in line and '127.0.0.1' not in line:
                        parts = line.strip().split()
                        if len(parts) >= 2:
                            ip = parts[1]
                            if ip and ip not in ips:
                                ips.append(ip)
        except:
            pass
            
    except:
        pass
    
    if not ips:
        ips.append('127.0.0.1')
    
    return list(set(ips))

# ========== MOSTRAR INFORMACIÓN DEL SISTEMA ==========
def display_system_info():
    """Muestra información detallada del sistema"""
    print("="*80)
    print("INICIANDO SERVIDOR FLASK-SOCKETIO")
    print("="*80)
    
    network_ips = get_network_ips()
    
    print(f"\nINFORMACION DEL SISTEMA:")
    print(f"   Directorio: {os.getcwd()}")
    
    print(f"\nDIRECCIONES DE ACCESO DISPONIBLES:")
    print(f"   Local:      http://localhost:5000")
    print(f"   Local:      http://127.0.0.1:5000")
    
    for idx, ip in enumerate(network_ips, 1):
        if idx == 1:
            print(f"   Red Principal: http://{ip}:5000")
        else:
            print(f"   Red {idx}:     http://{ip}:5000")
    
    print(f"\nCONFIGURACION:")
    print(f"   Puerto:      5000")
    print(f"   Async Mode:  eventlet")
    print(f"   WebSocket:   ACTIVADO")
    print(f"   Debug Mode:  ACTIVADO")

# Mostrar información del sistema
display_system_info()

# ========== CONFIGURACIÓN DE LA APLICACIÓN ==========
try:
    from app import create_app
    from app.utils.detailed_logger import enable_detailed_logging  # ★ LÍNEA NUEVA 1
    enable_detailed_logging() 
    from app.utils.auth import load_user
    
    app, login_manager = create_app()
    
    from app import socketio
    
    @login_manager.user_loader
    def user_loader(user_id):
        """Carga el usuario desde la base de datos cuando se autentica"""
        return load_user(user_id)
    
    print(f"\nAPLICACION INICIALIZADA CORRECTAMENTE")
    
    if __name__ == "__main__":
        if socketio is None:
            print("="*80)
            print("ADVERTENCIA: SocketIO no se inicializó correctamente")
            print("Ejecutando sin WebSocket...")
            print("="*80 + "\n")
            
            import logging
            
            logging.basicConfig(
                level=logging.DEBUG,
                format='%(asctime)s - %(name)s - %(levelname)s\n%(pathname)s:%(lineno)d\n   %(message)s\n',
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
            print("="*80)
            print("SocketIO inicializado correctamente")
            print("Sistema de notificaciones en tiempo real: ACTIVO")
            print("Sistema de CHAT en tiempo real: ACTIVO")
            print("="*80 + "\n")
            
            import logging
            
            logging.getLogger('socketio').setLevel(logging.WARNING)
            logging.getLogger('engineio').setLevel(logging.WARNING)
            
            flask_logger = logging.getLogger('werkzeug')
            flask_logger.setLevel(logging.INFO)
            
            class ColoredFormatter(logging.Formatter):
                def format(self, record):
                    message = super().format(record)
                    return message
            
            console_handler = logging.StreamHandler()
            console_handler.setLevel(logging.DEBUG)
            console_handler.setFormatter(ColoredFormatter(
                '[%(asctime)s] %(levelname)s en %(module)s.%(funcName)s [Linea %(lineno)d]:\n   %(message)s'
            ))
            
            flask_logger.addHandler(console_handler)
            app.logger.addHandler(console_handler)
            
            socketio.run(
                app,
                host='0.0.0.0',
                port=5000,
                debug=True,
                use_reloader=False,
                log_output=True,
                allow_unsafe_werkzeug=True
            )
            
except Exception as e:
    print("\n" + "="*80)
    print("ERROR AL INICIALIZAR LA APLICACION")
    print("="*80)
    
    exc_type, exc_value, exc_traceback = sys.exc_info()
    DetailedLogger.handle_exception(exc_type, exc_value, exc_traceback)
    
    sys.exit(1)