#!/usr/bin/env python3
# kill_session.py — Ejecutar desde el servidor para matar sesiones
# Uso: python kill_session.py <username>
# Ejemplo: python kill_session.py Dev
# Ejemplo: python kill_session.py 27322682

import sys
import os
import json

# Agregar el path del proyecto
sys.path.insert(0, '/home/pc/Escritorio/Astroweb/AppWeb/backend')

from redis import Redis

def kill_session(username):
    r = Redis(host='localhost', port=6379, db=0)

    # 1. Buscar todas las keys de sesión en Redis
    keys = r.keys('hjassta:sess:*')
    killed = 0

    for key in keys:
        raw = r.get(key)
        if not raw:
            continue
        try:
            data = json.loads(raw)
            if data.get('username') == username:
                # Marcar como inactiva
                data['active'] = False
                r.setex(key, 300, json.dumps(data))
                killed += 1
                print(f"✅ Sesión tumbada: {key.decode()}")
        except Exception as e:
            print(f"⚠️ Error procesando {key}: {e}")

    if killed == 0:
        print(f"⚠️ No se encontraron sesiones activas para '{username}'")
    else:
        print(f"✅ {killed} sesión(es) tumbada(s) para '{username}'")
        print(f"   El usuario será redirigido al login en máx 15 segundos")

    # 2. También actualizar DB
    try:
        os.environ.setdefault('FLASK_ENV', 'production')
        from app.utils.database import execute_query
        execute_query("""
            UPDATE SESIONES_ACTIVAS
            SET activa = 0, fecha_cierre = GETDATE(), motivo_cierre = 'admin_script'
            WHERE username = ? AND activa = 1
        """, (username,), commit=True)
        print(f"✅ DB actualizada")
    except Exception as e:
        print(f"⚠️ DB error (no crítico): {e}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Uso: python kill_session.py <username>")
        print("Ejemplo: python kill_session.py Dev")
        sys.exit(1)

    username = sys.argv[1]
    print(f"🔪 Matando sesiones de '{username}'...")
    kill_session(username)
