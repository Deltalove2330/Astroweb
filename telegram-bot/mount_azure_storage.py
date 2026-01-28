# mount_azure_storage.py (actualizado)
import subprocess
import os
from config import AZURE_STORAGE_ACCOUNT, AZURE_SHARE_NAME, AZURE_ACCESS_KEY

def mount_azure_storage():
    """Monta Azure File Storage como unidad de red con autenticación"""
    if not os.path.exists("X:"):
        print("⚠️ Unidad X: no detectada. Intentando montar Azure Storage...")
        try:
            # Comando para agregar credenciales
            cred_cmd = (
                f'cmdkey /add:{AZURE_STORAGE_ACCOUNT}.file.core.windows.net '
                f'/user:AZURE\\{AZURE_STORAGE_ACCOUNT} '
                f'/pass:{AZURE_ACCESS_KEY}'
            )
            subprocess.run(cred_cmd, shell=True, check=True)
            
            # Comando para montar la unidad
            mount_cmd = (
                f'net use X: '
                f'\\\\{AZURE_STORAGE_ACCOUNT}.file.core.windows.net\\{AZURE_SHARE_NAME} '
                f'/persistent:yes'
            )
            subprocess.run(mount_cmd, shell=True, check=True)
            
            print("✅ Azure Storage montado exitosamente en X:")
            return True
        except Exception as e:
            print(f"❌ Error montando storage: {str(e)}")
            return False
    return True

if __name__ == "__main__":
    mount_azure_storage()