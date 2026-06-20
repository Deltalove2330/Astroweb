# utils/azure_storage.py
from azure.storage.blob import BlobServiceClient
import logging

logger = logging.getLogger(__name__)

def get_or_create_container(connection_string, container_name):
    """Obtiene o crea un contenedor en Azure Blob Storage"""
    try:
        # Crear cliente de Blob Service
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        
        # Intentar obtener el contenedor
        container_client = blob_service_client.get_container_client(container_name)
        
        # Verificar si el contenedor existe
        try:
            container_client.get_container_properties()
            logger.info(f"Contenedor '{container_name}' encontrado")
            return container_client
        except Exception as e:
            # Si no existe, crearlo
            if "ContainerNotFound" in str(e):
                logger.info(f"Creando contenedor '{container_name}'...")
                container_client = blob_service_client.create_container(container_name)
                logger.info(f"Contenedor '{container_name}' creado exitosamente")
                return container_client
            else:
                raise e
                
    except Exception as e:
        logger.error(f"Error al obtener/crear contenedor: {str(e)}")
        raise

def upload_to_azure(photo_file, filename, connection_string, container_name):
    """Sube un archivo a Azure Blob Storage"""
    try:
        # Obtener o crear el contenedor
        container_client = get_or_create_container(connection_string, container_name)
        
        # Subir el archivo
        blob_client = container_client.get_blob_client(filename)
        blob_client.upload_blob(photo_file, overwrite=True)
        
        logger.info(f"Archivo subido exitosamente: {filename}")
        return blob_client.url
        
    except Exception as e:
        logger.error(f"Error al subir archivo a Azure: {str(e)}")
        raise