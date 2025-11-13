# test_azure_connection.py
from azure.storage.blob import BlobServiceClient

connection_string = "DefaultEndpointsProtocol=https;AccountName=saeprandat001;AccountKey=mdCgzMhYIGJG/F3WZwuxKwM0oms3hrNNk5ceXOqXpr0EEliD5fpTR7EPE6DShpy/G1Li3TIqbW0I+AStIYOQxQ==;EndpointSuffix=core.windows.net"
container_name = "epran"

try:
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service_client.get_container_client(container_name)
    
    # Listar blobs
    blobs = container_client.list_blobs()
    print("Blobs encontrados:")
    for blob in blobs:
        print(f"- {blob.name}")
        
except Exception as e:
    print(f"Error: {e}")