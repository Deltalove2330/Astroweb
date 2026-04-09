# run.py
import eventlet
eventlet.monkey_patch()  # ✅ CRÍTICO: Debe estar AL INICIO antes de cualquier import

import socket
import sys
import traceback
from datetime import datetime
import os
import logging
from logging.handlers import RotatingFileHandler

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
    print("INICIANDO SERVIDOR FLASK-SOCKETIO + APSCHEDULER")
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
    print(f"   Scheduler:   APScheduler (cada 60 min)")
    print(f"   Debug Mode:  ACTIVADO")

# Mostrar información del sistema
display_system_info()

# ========== CONFIGURACIÓN DE LA APLICACIÓN ==========
try:
    from app import create_app
    from app.utils.auth import load_user
    
    app, login_manager = create_app()
    
    from app import socketio
    
    @login_manager.user_loader
    def user_loader(user_id):
        """Carga el usuario desde la base de datos cuando se autentica"""
        return load_user(user_id)
    
    print(f"\n✅ APLICACION INICIALIZADA CORRECTAMENTE")
    
    if __name__ == "__main__":
        # ============================================
        # CONFIGURACIÓN DE LOGGING ROTATIVO
        # ============================================
        if not app.debug:
            # Logging rotativo para producción (máx 10MB por archivo, 5 backups)
            if not os.path.exists('logs'):
                os.mkdir('logs')
            
            file_handler = RotatingFileHandler(
                'logs/app.log',
                maxBytes=10*1024*1024,  # 10 MB
                backupCount=5,
                encoding='utf-8'
            )
            file_handler.setFormatter(logging.Formatter(
                '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
            ))
            file_handler.setLevel(logging.INFO)
            app.logger.addHandler(file_handler)
            
            app.logger.setLevel(logging.INFO)
            app.logger.info('🚀 Aplicación iniciada')
        
        # ============================================
        # INICIALIZAR APSCHEDULER PARA CAMBIOS FUTUROS
        # ============================================
        scheduler = app.config.get('SCHEDULER')
        if scheduler:
            try:
                # ⚠️ IMPORTANTE: use_reloader=False previene duplicación del scheduler
                if not scheduler.running:
                    scheduler.start(paused=False)
                    interval = app.config.get('SCHEDULER_INTERVAL_MINUTES', 60)
                    print(f"✅ APScheduler iniciado - Ejecutará cambios futuros cada {interval} minutos")
                    app.logger.info(f"✅ APScheduler iniciado - Intervalo: {interval} minutos")
                else:
                    print("⚠️ APScheduler ya estaba corriendo")
            except Exception as e:
                print(f"⚠️ Advertencia: No se pudo iniciar scheduler: {e}")
                app.logger.warning(f"⚠️ Error iniciando scheduler: {e}")
        else:
            print("⚠️ Scheduler no configurado en app.config")
            app.logger.warning("⚠️ Scheduler no encontrado en configuración")
        
        # ============================================
        # INICIAR SERVIDOR
        # ============================================
        if socketio is None:
            print("="*80)
            print("ADVERTENCIA: SocketIO no se inicializó correctamente")
            print("Ejecutando sin WebSocket...")
            print("="*80 + "\n")
            
            app.run(
                host='0.0.0.0', 
                port=5000, 
                debug=True,
                threaded=True
            )
        else:
            print("="*80)
            print("✅ SocketIO inicializado correctamente")
            print("✅ Sistema de notificaciones en tiempo real: ACTIVO")
            print("✅ Sistema de CHAT en tiempo real: ACTIVO")
            print("✅ APScheduler: ACTIVO - Ejecutará cambios futuros automáticamente")
            print("="*80 + "\n")
            
            # Configurar niveles de log para librerías externas
            logging.getLogger('socketio').setLevel(logging.WARNING)
            logging.getLogger('engineio').setLevel(logging.WARNING)
            logging.getLogger('apscheduler').setLevel(logging.INFO)
            logging.getLogger('werkzeug').setLevel(logging.INFO)
            
            # Handler personalizado para logs en consola
            class ColoredFormatter(logging.Formatter):
                def format(self, record):
                    message = super().format(record)
                    return message
            
            console_handler = logging.StreamHandler()
            console_handler.setLevel(logging.DEBUG if app.debug else logging.INFO)
            console_handler.setFormatter(ColoredFormatter(
                '[%(asctime)s] %(levelname)s en %(module)s.%(funcName)s [Línea %(lineno)d]:\n   %(message)s'
            ))
            
            # Agregar handler solo si no existe
            if not any(isinstance(h, logging.StreamHandler) for h in app.logger.handlers):
                app.logger.addHandler(console_handler)
            
            # ============================================
            # EJECUTAR SERVIDOR CON SOCKET.IO
            # ============================================
            socketio.run(
                app,
                host='0.0.0.0',
                port=5000,
                debug=True,
                use_reloader=False,  # ✅ CRÍTICO: Evita duplicar scheduler en debug mode
                log_output=True,
                allow_unsafe_werkzeug=True
            )
            
except KeyboardInterrupt:
    print("\n\n⏹️  Interrupción recibida - Deteniendo aplicación...")
    try:
        if 'app' in locals() and 'SCHEDULER' in app.config:
            app.config['SCHEDULER'].shutdown(wait=False)
            print("✅ Scheduler detenido")
    except:
        pass
    sys.exit(0)
    
except Exception as e:
    print("\n" + "="*80)
    print("❌ ERROR AL INICIALIZAR LA APLICACION")
    print("="*80)
    
    exc_type, exc_value, exc_traceback = sys.exc_info()
    DetailedLogger.handle_exception(exc_type, exc_value, exc_traceback)
    
    sys.exit(1)