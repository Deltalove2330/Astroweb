# scripts/create_azure_container.py
import os
import sys
from pathlib import Path

# Agregar el directorio padre al path para importar la aplicación
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
from azure.storage.blob import BlobServiceClient

def create_container():
    try:
        # Cargar variables de entorno desde el directorio raíz
        env_path = Path(__file__).parent.parent / '.env'
        load_dotenv(env_path)
        
        connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
        container_name = os.getenv('AZURE_CONTAINER_NAME', 'epran')
        
        if not connection_string:
            print("❌ Error: No se encontró la cadena de conexión de Azure Storage.")
            print("Asegúrate de tener AZURE_STORAGE_CONNECTION_STRING en tu archivo .env")
            sys.exit(1)
        
        print(f"Conectando a Azure Storage...")
        print(f"Container name: {container_name}")
        
        # Crear cliente de Blob Service
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        
        # Verificar si el contenedor existe
        try:
            container_client = blob_service_client.get_container_client(container_name)
            container_client.get_container_properties()
            print(f"✅ El contenedor '{container_name}' ya existe.")
        except Exception as e:
            if "ContainerNotFound" in str(e):
                print(f"⚠️  Contenedor no encontrado. Creando '{container_name}'...")
                # Crear el contenedor
                container_client = blob_service_client.create_container(container_name)
                
                # Configurar permisos (opcional: público para lectura)
                container_client.set_container_access_policy(signed_identifiers={}, public_access="blob")
                
                print(f"✅ Contenedor '{container_name}' creado exitosamente!")
            else:
                print(f"❌ Error inesperado: {str(e)}")
                sys.exit(1)
                
        # Listar blobs existentes
        print(f"\n📂 Contenido del contenedor '{container_name}':")
        blobs = container_client.list_blobs()
        blob_count = 0
        for blob in blobs:
            print(f"  - {blob.name}")
            blob_count += 1
        
        if blob_count == 0:
            print("  (vacío)")
            
        print(f"\n✨ Listo! El contenedor está configurado correctamente.")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    create_container()