import os
from datetime import datetime, timedelta, timezone
from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions

_redis_client = None

def _get_redis():
    global _redis_client
    if _redis_client is None:
        import redis
        _redis_client = redis.Redis(
            host=os.getenv('REDIS_HOST', 'localhost'),
            port=int(os.getenv('REDIS_PORT', 6379)),
            db=0, decode_responses=False,
            socket_connect_timeout=2, socket_timeout=2
        )
    return _redis_client

from config import config
CONTAINER = config.AZURE_CONTAINER_NAME

def get_sas_url(blob_path: str, expiry_minutes: int = 60) -> str:
    """
    Genera URL directa a Azure con SAS token.
    El cliente descarga directo de Azure — 0 bytes por tu servidor.
    Cacheada en Redis 55 minutos.
    """
    cache_key = f"sas:{blob_path}"
    try:
        r = _get_redis()
        cached = r.get(cache_key)
        if cached:
            return cached.decode()
    except Exception:
        pass

    conn_str = config.AZURE_STORAGE_CONNECTION_STRING
    client       = BlobServiceClient.from_connection_string(conn_str)
    account_name = client.account_name
    account_key  = client.credential.account_key
    expiry       = datetime.now(timezone.utc) + timedelta(minutes=expiry_minutes)

    sas_token = generate_blob_sas(
        account_name=account_name,
        container_name=CONTAINER,
        blob_name=blob_path,
        account_key=account_key,
        permission=BlobSasPermissions(read=True),
        expiry=expiry
    )
    url = f"https://{account_name}.blob.core.windows.net/{CONTAINER}/{blob_path}?{sas_token}"

    try:
        _get_redis().setex(cache_key, (expiry_minutes - 5) * 60, url)
    except Exception:
        pass

    return url