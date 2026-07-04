# config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'EPRAN123')
    DB_DRIVER = os.getenv('DB_DRIVER', 'ODBC Driver 17 for SQL Server')
    DB_SERVER = os.getenv('DB_SERVER')
    DB_NAME = os.getenv('DB_NAME')
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DEBUG = os.getenv('DEBUG', 'True') == 'True'
    
    # Azure Storage
    AZURE_STORAGE_CONNECTION_STRING = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
    AZURE_CONTAINER_NAME = "epran"
    PHOTOS_DIR = 'X:/'

    # Web Push VAPID
    VAPID_PUBLIC_KEY  = os.getenv('VAPID_PUBLIC_KEY', '')
    VAPID_PRIVATE_KEY = os.getenv('VAPID_PRIVATE_KEY', '')
    VAPID_CLAIMS      = {'sub': 'mailto:' + os.getenv('VAPID_EMAIL', 'admin@hjassta.com')}
    
    # 🔗 Pool de conexiones DB + eventlet.tpool
    # Dimensionado para 300-400 mercaderistas concurrentes (pico de login + jornada).
    # Regla: EVENTLET_THREADPOOL_SIZE <= DB_POOL_MAX_SIZE (cada hilo de tpool que
    # corre una query toma una conexión del pool; se deja headroom para los
    # call-sites que usan get_db_connection() directamente fuera de tpool).
    DB_POOL_MAX_SIZE         = int(os.getenv('DB_POOL_MAX_SIZE', '120'))
    DB_POOL_IDLE_TIMEOUT     = int(os.getenv('DB_POOL_IDLE_TIMEOUT', '300'))
    DB_CONNECT_TIMEOUT       = int(os.getenv('DB_CONNECT_TIMEOUT', '10'))
    DB_QUERY_TIMEOUT         = int(os.getenv('DB_QUERY_TIMEOUT', '30'))
    DB_RETRY_ATTEMPTS        = int(os.getenv('DB_RETRY_ATTEMPTS', '2'))
    # Validar conexión idle con SELECT 1 solo si estuvo idle más de N seg.
    DB_VALIDATE_AFTER        = int(os.getenv('DB_VALIDATE_AFTER', '20'))
    # Hilos OS de eventlet.tpool = máximo de queries DB simultáneas. Con el RTT
    # remoto (~449ms) el techo es tpool/0.449 q/s; por eso lo subimos a 100
    # (~220 q/s) para absorber el pico real (logins + visitas + fotos + chat).
    # Debe ser <= DB_POOL_MAX_SIZE. Ajustable por env si la RAM del server aprieta.
    EVENTLET_THREADPOOL_SIZE = int(os.getenv('EVENTLET_THREADPOOL_SIZE', '100'))

    # Cost factor de bcrypt para hashes nuevos y rehash-on-login. 10 = ~60ms,
    # 4× más rápido que el 12 histórico; mínimo recomendado por OWASP. Cada +1
    # duplica el tiempo de login (CPU-bound → afecta directo al login storm).
    BCRYPT_ROUNDS = int(os.getenv('BCRYPT_ROUNDS', '10'))

    # ⏰ APScheduler Configuration
    SCHEDULER_API_ENABLED = True
    SCHEDULER_TIMEZONE = 'America/Caracas'  # Ajusta a tu zona horaria
    SCHEDULER_INTERVAL_MINUTES = int(os.getenv('SCHEDULER_INTERVAL_MINUTES', '60'))  # Cada 60 min por defecto
    
    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return f"DRIVER={{{self.DB_DRIVER}}};SERVER={self.DB_SERVER};DATABASE={self.DB_NAME};UID={self.DB_USER};PWD={self.DB_PASSWORD}"

config = Config()