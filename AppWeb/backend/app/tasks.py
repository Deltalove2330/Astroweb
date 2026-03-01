import os
from config import config
from celery import Celery

def make_celery():
    broker  = os.getenv('RABBITMQ_URL', 'amqp://guest:guest@localhost:5672//')
    backend = os.getenv('REDIS_URL',    'redis://localhost:6379/1')

    celery = Celery(
        'hjassta',
        broker=broker,
        backend=backend,
        include=['app.tasks']
    )
    celery.conf.update(
        task_serializer='json',
        result_expires=3600,
        worker_prefetch_multiplier=4,
        task_acks_late=True,
    )
    return celery

celery = make_celery()

@celery.task(bind=True, max_retries=3)
def upload_photo_task(self, photo_bytes_list, blob_path: str):
    """
    Sube foto a Azure en background.
    La respuesta HTTP al usuario es inmediata (~200ms).
    """
    import io
    from azure.storage.blob import BlobServiceClient

    try:
        photo_bytes = bytes(photo_bytes_list)
        conn_str  = config.AZURE_STORAGE_CONNECTION_STRING
        container = config.AZURE_CONTAINER_NAME
        client    = BlobServiceClient.from_connection_string(conn_str)
        blob      = client.get_blob_client(container=container, blob=blob_path)
        blob.upload_blob(io.BytesIO(photo_bytes), overwrite=True, timeout=30)
        return {'success': True, 'path': blob_path}
    except Exception as exc:
        raise self.retry(exc=exc, countdown=5)