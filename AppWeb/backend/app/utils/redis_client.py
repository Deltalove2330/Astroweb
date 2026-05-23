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