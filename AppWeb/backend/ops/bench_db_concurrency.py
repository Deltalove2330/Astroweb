#!/usr/bin/env python3
# ops/bench_db_concurrency.py
# Mide la concurrencia REAL de la capa DB (eventlet + tpool + pool +
# execute_query) sin Flask/HTTP. Aísla si el cuello de botella del login
# está en la capa de base de datos.
#
# USO (en el server con el venv):
#   /home/pc/Escritorio/Astroweb/env/bin/python ops/bench_db_concurrency.py
import eventlet
eventlet.monkey_patch()   # replica el entorno de gunicorn

import sys, os, time
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.utils.database import execute_query, get_pool_stats

CED = 32030127
Q = ("SELECT m.id_mercaderista, u.password_hash "
     "FROM MERCADERISTAS m INNER JOIN USUARIOS u "
     "ON u.username = CONVERT(nvarchar(50), m.cedula) "
     "WHERE m.cedula = ? AND m.activo = 1")


def one(_=None):
    t0 = time.time()
    execute_query(Q, (CED,), fetch_one=True)
    return time.time() - t0


def run(n, conc):
    pool = eventlet.GreenPool(conc)
    t0 = time.time()
    lat = list(pool.imap(one, range(n)))
    dt = time.time() - t0
    lat_ms = sorted(x * 1000 for x in lat)
    p50 = lat_ms[len(lat_ms) // 2]
    print(f"  conc={conc:>3}  n={n:>3}  ->  {dt:5.2f}s   {n/dt:6.1f} q/s   "
          f"p50={p50:6.0f}ms   concurrencia_efectiva≈{(sum(lat)/dt):.1f}")


print("Calentando pool...")
for _ in range(5):
    one()

print("\nBenchmark capa DB (execute_query vía tpool+pool):")
for conc in (1, 5, 10, 20, 40, 80):
    run(max(conc * 2, 40), conc)

print("\nStats del pool:", get_pool_stats())
