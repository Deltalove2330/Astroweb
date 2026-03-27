# app/utils/session_manager.py
import json
from datetime import datetime, timedelta
from flask import request
from app.utils.database import execute_query


class SessionManager:
    def __init__(self, redis_client=None):
        self._redis = redis_client

    @property
    def redis(self):
        if self._redis is None:
            raise RuntimeError("SessionManager sin Redis configurado")
        return self._redis

    # ─────────────────────────────────────────────
    # CREAR SESIÓN
    # ─────────────────────────────────────────────
    def register_session(self, user_id: int, username: str, rol: str, session_id: str):
        ip         = request.remote_addr or 'unknown'
        user_agent = request.headers.get('User-Agent', '')[:200]
        now        = datetime.now()

        # Redis: TTL 8 horas
        redis_key    = f"hjassta:sess:{session_id}"
        session_data = {
            'user_id':    user_id,
            'username':   username,
            'rol':        rol,
            'ip':         ip,
            'created_at': now.isoformat(),
            'last_seen':  now.isoformat(),
            'active':     True
        }
        self.redis.setex(
            redis_key,
            int(timedelta(hours=8).total_seconds()),
            json.dumps(session_data)
        )

        # DB: cerrar sesiones previas del mismo usuario y registrar la nueva
        try:
            execute_query("""
                UPDATE SESIONES_ACTIVAS
                SET activa = 0, fecha_cierre = GETDATE(), motivo_cierre = 'nueva_sesion'
                WHERE id_usuario = ? AND activa = 1
            """, (user_id,), commit=True)

            execute_query("""
                INSERT INTO SESIONES_ACTIVAS
                (id_usuario, username, rol, session_id, ip_address, user_agent,
                 fecha_inicio, ultimo_acceso, activa)
                VALUES (?, ?, ?, ?, ?, ?, GETDATE(), GETDATE(), 1)
            """, (user_id, username, rol, session_id, ip, user_agent), commit=True)

        except Exception as e:
            print(f"⚠️ register_session DB error: {e}")

    # ─────────────────────────────────────────────
    # ACTUALIZAR ÚLTIMO ACCESO
    # ─────────────────────────────────────────────
    def touch_session(self, session_id: str):
        redis_key = f"hjassta:sess:{session_id}"
        raw = self.redis.get(redis_key)
        if not raw:
            return False

        try:
            data           = json.loads(raw)
            last_seen_str  = data.get('last_seen', '')
            data['last_seen'] = datetime.now().isoformat()

            # Resetear TTL en Redis siempre
            self.redis.setex(
                redis_key,
                int(timedelta(hours=8).total_seconds()),
                json.dumps(data)
            )

            # Actualizar DB solo cada 5 minutos para no saturar
            try:
                last_dt        = datetime.fromisoformat(last_seen_str)
                update_db      = (datetime.now() - last_dt).seconds > 300
            except Exception:
                update_db = True

            if update_db:
                execute_query("""
                    UPDATE SESIONES_ACTIVAS
                    SET ultimo_acceso = GETDATE()
                    WHERE session_id = ? AND activa = 1
                """, (session_id,), commit=True)

        except Exception as e:
            print(f"⚠️ touch_session error: {e}")

        return True

    # ─────────────────────────────────────────────
    # VERIFICAR VALIDEZ
    # ─────────────────────────────────────────────
    def is_session_valid(self, session_id: str) -> bool:
        if not session_id:
            return False

        redis_key = f"hjassta:sess:{session_id}"
        raw = self.redis.get(redis_key)

        if raw:
            try:
                data = json.loads(raw)
                return data.get('active', True)
            except Exception:
                return False

        return False  # Expiró o fue invalidada

    # ─────────────────────────────────────────────
    # INVALIDAR — TUMBAR SESIÓN
    # ─────────────────────────────────────────────
    def invalidate_session(self, session_id: str, motivo: str = 'admin'):
        redis_key = f"hjassta:sess:{session_id}"
        raw = self.redis.get(redis_key)

        if raw:
            try:
                data = json.loads(raw)
                data['active'] = False
                # Dejar 5 min más para que el before_request lo detecte
                self.redis.setex(redis_key, 300, json.dumps(data))
            except Exception:
                self.redis.delete(redis_key)

        try:
            execute_query("""
                UPDATE SESIONES_ACTIVAS
                SET activa = 0, fecha_cierre = GETDATE(), motivo_cierre = ?
                WHERE session_id = ?
            """, (motivo, session_id), commit=True)
        except Exception as e:
            print(f"⚠️ invalidate_session DB error: {e}")

    def invalidate_all_user_sessions(self, user_id: int, motivo: str = 'admin'):
        try:
            rows = execute_query("""
                SELECT session_id FROM SESIONES_ACTIVAS
                WHERE id_usuario = ? AND activa = 1
            """, (user_id,))

            if rows:
                for row in rows:
                    self.invalidate_session(row[0], motivo)
        except Exception as e:
            print(f"⚠️ invalidate_all_user_sessions error: {e}")

    # ─────────────────────────────────────────────
    # CONSULTAS PARA PANEL ADMIN
    # ─────────────────────────────────────────────
    def get_active_sessions(self):
        try:
            rows = execute_query("""
                SELECT
                    id_sesion, id_usuario, username, rol,
                    session_id, ip_address, fecha_inicio,
                    ultimo_acceso, user_agent
                FROM SESIONES_ACTIVAS
                WHERE activa = 1
                ORDER BY ultimo_acceso DESC
            """)

            sessions = []
            if rows:
                for row in rows:
                    session_id  = row[4]
                    still_alive = bool(self.redis.exists(f"hjassta:sess:{session_id}"))
                    sessions.append({
                        'id_sesion':        row[0],
                        'id_usuario':       row[1],
                        'username':         row[2],
                        'rol':              row[3],
                        'session_id_short': session_id[:8] + '...',
                        'session_id_full':  session_id,
                        'ip_address':       row[5],
                        'fecha_inicio':     row[6].strftime('%Y-%m-%d %H:%M:%S') if row[6] else None,
                        'ultimo_acceso':    row[7].strftime('%Y-%m-%d %H:%M:%S') if row[7] else None,
                        'user_agent':       row[8],
                        'en_redis':         still_alive
                    })
            return sessions
        except Exception as e:
            print(f"❌ get_active_sessions error: {e}")
            return []

    def get_user_session_history(self, user_id: int, limit: int = 20):
        try:
            rows = execute_query("""
                SELECT TOP (?)
                    session_id, ip_address, fecha_inicio, ultimo_acceso,
                    fecha_cierre, activa, motivo_cierre
                FROM SESIONES_ACTIVAS
                WHERE id_usuario = ?
                ORDER BY fecha_inicio DESC
            """, (limit, user_id))

            if not rows:
                return []

            return [{
                'session_id':    row[0][:8] + '...',
                'ip_address':    row[1],
                'fecha_inicio':  row[2].strftime('%Y-%m-%d %H:%M:%S') if row[2] else None,
                'ultimo_acceso': row[3].strftime('%Y-%m-%d %H:%M:%S') if row[3] else None,
                'fecha_cierre':  row[4].strftime('%Y-%m-%d %H:%M:%S') if row[4] else None,
                'activa':        bool(row[5]),
                'motivo_cierre': row[6]
            } for row in rows]
        except Exception as e:
            print(f"❌ get_user_session_history error: {e}")
            return []


# Instancia global
session_manager = SessionManager()