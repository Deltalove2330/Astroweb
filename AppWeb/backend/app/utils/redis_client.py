import redis as redis_lib
import os
import json

_redis = None

def get_redis_client():
    global _redis
    if _redis is None:
        _redis = redis_lib.Redis(
            host=os.getenv('REDIS_HOST', 'localhost'),
            port=int(os.getenv('REDIS_PORT', 6379)),
            db=0, decode_responses=False,
            socket_connect_timeout=2, socket_timeout=2
        )
    return _redis

# ── Unread badges (mercaderista) ─────────────────────────────
# Cache del conteo de no-leídos para que el polling (cada 60s × cientos de
# mercaderistas) sea un GET a Redis y NO una query a la DB remota (~450ms).
# Se invalida al enviar/leer mensajes; TTL como red de seguridad por si se
# escapa algún evento (los sockets dan tiempo real igual).
def _unread_key(tipo, cedula):
    return f"unread:{tipo}:{str(cedula).strip()}"

def get_unread_cache(tipo, cedula):
    try:
        v = get_redis_client().get(_unread_key(tipo, cedula))
        return int(v) if v is not None else None
    except Exception:
        return None

def set_unread_cache(tipo, cedula, count, ttl=90):
    try:
        get_redis_client().setex(_unread_key(tipo, cedula), ttl, int(count))
    except Exception:
        pass

def invalidate_unread_cache(cedula, tipo=None):
    """Borra el cache de no-leídos. tipo=None borra analistas y clientes."""
    try:
        r = get_redis_client()
        if tipo:
            r.delete(_unread_key(tipo, cedula))
        else:
            r.delete(_unread_key('analistas', cedula), _unread_key('clientes', cedula))
    except Exception:
        pass

# ── Chat ─────────────────────────────────────────────────────
def invalidate_chat_cache(visit_id: int):
    try:
        get_redis_client().delete(f"chat_history:{visit_id}")
    except Exception:
        pass

# ── Supervisor ────────────────────────────────────────────────
def cache_supervisor_photos(estado: str, data: list, ttl: int = 120):
    try:
        get_redis_client().setex(
            f"supervisor_photos:{estado}", ttl,
            json.dumps(data, default=str)
        )
    except Exception:
        pass

def get_cached_supervisor_photos(estado: str):
    try:
        cached = get_redis_client().get(f"supervisor_photos:{estado}")
        if cached:
            return json.loads(cached)
    except Exception:
        pass
    return None

def invalidate_supervisor_cache():
    try:
        r = get_redis_client()
        for e in ['rechazadas', 'aprobada', 'pendiente', 'no revisado']:
            r.delete(f"supervisor_photos:{e}")
    except Exception:
        pass

# ── Point photos ──────────────────────────────────────────────
def cache_point_photos(point_id: int, data: list, ttl: int = 60):
    try:
        get_redis_client().setex(
            f"point_photos:{point_id}", ttl,
            json.dumps(data, default=str)
        )
    except Exception:
        pass

def get_cached_point_photos(point_id: int):
    try:
        cached = get_redis_client().get(f"point_photos:{point_id}")
        if cached:
            return json.loads(cached)
    except Exception:
        pass
    return None

def invalidate_point_photos_cache(point_id: int):
    try:
        get_redis_client().delete(f"point_photos:{point_id}")
    except Exception:
        pass