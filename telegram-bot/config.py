# config.py
import os
import logging 
from datetime import datetime

# Telegram Bot
TOKEN = "8115542729:AAGUkGUXSV5bcNxGeT2uZwBK6TgkustIm8o"

# Base de datos
SERVER = '172.174.41.110'
DATABASE = 'EPRAN'
USERNAME = 'dev'
PASSWORD = 'abcd1234*'

# Configuración Azure Blob Storage (montado como unidad de red)
# Configuración Azure Blob Storage
AZURE_STORAGE_ACCOUNT = "saeprandat001"
AZURE_SHARE_NAME = "epran"
AZURE_ACCESS_KEY = "mdCgzMhYIGJG/F3WZwuxKwM0oms3hrNNk5ceXOqXpr0EEliD5fpTR7EPE6DShpy/G1Li3TIqbW0I+AStIYOQxQ=="

# Directorio raíz en Azure Files (unidad montada X:)
PHOTO_DIR = r"X:\\"  # Cambiado a doble barra al final

# Verificar y crear directorio raíz si no existe
try:
    os.makedirs(PHOTO_DIR, exist_ok=True)
    print(f"✅ Directorio de Azure Storage confirmado: {PHOTO_DIR}")
except Exception as e:
    print(f"⚠️ Error al acceder a Azure Storage: {str(e)}")
    # Fallback a directorio local si hay problemas con Azure
    local_fallback = os.path.join(os.path.expanduser("~"), "Fotos_EPRAN")
    os.makedirs(local_fallback, exist_ok=True)
    PHOTO_DIR = local_fallback
    print(f"⚠️ Usando directorio local como fallback: {PHOTO_DIR}")

# Configuración logging
LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
LOG_LEVEL = logging.INFO

# Función para verificar conexión con Azure Storage
def check_azure_connection():
    test_path = os.path.join(PHOTO_DIR, "connection_test.txt")
    try:
        with open(test_path, "w") as f:
            f.write(f"Test de conexión: {datetime.now()}")  # Corregido aquí
        os.remove(test_path)
        return True
    except Exception as e:
        print(f"❌ Error de conexión con Azure Storage: {str(e)}")
        return False

# Verificar conexión al iniciar
if __name__ == "__main__":
    if not check_azure_connection():
        print("⚠️ Advertencia: No se pudo escribir en Azure Storage. Usando fallback local.")