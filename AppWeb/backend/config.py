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
    
    # ⏰ APScheduler Configuration
    SCHEDULER_API_ENABLED = True
    SCHEDULER_TIMEZONE = 'America/Caracas'  # Ajusta a tu zona horaria
    SCHEDULER_INTERVAL_MINUTES = int(os.getenv('SCHEDULER_INTERVAL_MINUTES', '60'))  # Cada 60 min por defecto
    
    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return f"DRIVER={{{self.DB_DRIVER}}};SERVER={self.DB_SERVER};DATABASE={self.DB_NAME};UID={self.DB_USER};PWD={self.DB_PASSWORD}"

config = Config()