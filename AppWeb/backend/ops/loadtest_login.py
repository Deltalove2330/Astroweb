#!/usr/bin/env python3
# ops/loadtest_login.py
# ════════════════════════════════════════════════════════════════════
#  Prueba de carga del LOGIN de mercaderistas (POST /api/verify-merchandiser)
#
#  Objetivo: simular el "login storm" de 300-400 mercaderistas entrando
#  en una ventana corta, y comprobar que:
#    1. El servidor responde sin timeouts en cascada.
#    2. El EVENT LOOP sigue vivo durante el storm (sonda de responsividad).
#       → Esto es lo que valida el fix de bcrypt-vía-tpool. ANTES del fix,
#         la sonda se congelaba; DESPUÉS, debe seguir respondiendo rápido.
#
#  IMPORTANTE: una contraseña INCORRECTA igual ejecuta el bcrypt.checkpw
#  completo (solo se salta si la cédula no existe). Por eso puedes medir el
#  costo real de bcrypt bajo carga aunque solo tengas cédulas reales y NO
#  las contraseñas. Las respuestas serán 401, lo cual es esperado y válido
#  para medir latencia/estabilidad.
#
#  USO (sin dependencias extra — solo requests, ya instalado):
#    # Storm básico contra una cédula real (password dummy → 401, pero corre bcrypt)
#    python ops/loadtest_login.py --url http://localhost:5000 --cedula 12345678
#
#    # Storm con lista de cédulas reales (una por línea en un .txt)
#    python ops/loadtest_login.py --url http://TU_HOST --cedulas cedulas.txt \
#        --total 400 --concurrency 400
#
#    # Con credenciales válidas reales (csv: cedula,password por línea) → 200
#    python ops/loadtest_login.py --url http://TU_HOST --creds creds.csv
#
#    # Ajustar la sonda de responsividad a otro endpoint liviano
#    python ops/loadtest_login.py --url http://TU_HOST --cedula 123 \
#        --probe-path /api/version
# ════════════════════════════════════════════════════════════════════
import argparse
import csv
import statistics
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    import requests
except ImportError:
    sys.exit("Falta 'requests'. Instala con: pip install requests")


LOGIN_PATH_DEFAULT = "/api/verify-merchandiser"
PROBE_PATH_DEFAULT = "/api/version"


# ─────────────────────────────────────────────────────────────────
# Carga de credenciales / cédulas
# ─────────────────────────────────────────────────────────────────
def cargar_objetivos(args):
    """Devuelve lista de dicts {cedula, password} a usar en el storm."""
    objetivos = []

    if args.creds:
        with open(args.creds, newline="", encoding="utf-8") as f:
            for row in csv.reader(f):
                if not row or not row[0].strip():
                    continue
                cedula = row[0].strip()
                password = row[1].strip() if len(row) > 1 else "dummy"
                objetivos.append({"cedula": cedula, "password": password})

    elif args.cedulas:
        with open(args.cedulas, encoding="utf-8") as f:
            for line in f:
                ced = line.strip()
                if ced:
                    objetivos.append({"cedula": ced, "password": args.password})

    elif args.cedula:
        objetivos.append({"cedula": args.cedula, "password": args.password})

    else:
        sys.exit("Debes pasar --cedula, --cedulas <archivo> o --creds <csv>.")

    return objetivos


# ─────────────────────────────────────────────────────────────────
# Sonda de responsividad — corre en hilo aparte durante el storm
# ─────────────────────────────────────────────────────────────────
class ProbeRunner(threading.Thread):
    """Pinga un endpoint liviano cada `interval` s y mide su latencia.

    Si el event loop está bloqueado (p.ej. bcrypt CPU-bound sin tpool),
    estas latencias se disparan. Si el fix funciona, se mantienen bajas
    incluso con el login storm a tope.
    """

    def __init__(self, base_url, path, interval=0.5):
        super().__init__(daemon=True)
        self.url = base_url.rstrip("/") + path
        self.interval = interval
        self.latencias = []
        self.errores = 0
        self._stop = threading.Event()

    def run(self):
        sess = requests.Session()
        while not self._stop.is_set():
            t0 = time.perf_counter()
            try:
                r = sess.get(self.url, timeout=20)
                dt = (time.perf_counter() - t0) * 1000
                if r.status_code < 500:
                    self.latencias.append(dt)
                else:
                    self.errores += 1
            except Exception:
                self.errores += 1
            self._stop.wait(self.interval)

    def stop(self):
        self._stop.set()


# ─────────────────────────────────────────────────────────────────
# Una petición de login
# ─────────────────────────────────────────────────────────────────
def hacer_login(base_url, login_path, objetivo, timeout):
    url = base_url.rstrip("/") + login_path
    t0 = time.perf_counter()
    try:
        r = requests.post(url, json=objetivo, timeout=timeout)
        dt = (time.perf_counter() - t0) * 1000
        return {"ms": dt, "status": r.status_code, "error": None}
    except Exception as e:
        dt = (time.perf_counter() - t0) * 1000
        return {"ms": dt, "status": None, "error": type(e).__name__}


# ─────────────────────────────────────────────────────────────────
# Resumen estadístico
# ─────────────────────────────────────────────────────────────────
def pct(valores, p):
    if not valores:
        return 0.0
    s = sorted(valores)
    k = int(round((p / 100.0) * (len(s) - 1)))
    return s[k]


def imprimir_resumen(titulo, latencias, extra_lineas=None):
    print(f"\n── {titulo} ──")
    if not latencias:
        print("  (sin muestras)")
    else:
        print(f"  muestras : {len(latencias)}")
        print(f"  min      : {min(latencias):8.1f} ms")
        print(f"  p50      : {pct(latencias, 50):8.1f} ms")
        print(f"  p95      : {pct(latencias, 95):8.1f} ms")
        print(f"  p99      : {pct(latencias, 99):8.1f} ms")
        print(f"  max      : {max(latencias):8.1f} ms")
        print(f"  media    : {statistics.mean(latencias):8.1f} ms")
    for linea in (extra_lineas or []):
        print(f"  {linea}")


# ─────────────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser(description="Load test del login de mercaderistas")
    ap.add_argument("--url", required=True, help="Base URL, ej. http://localhost:5000")
    ap.add_argument("--cedula", help="Una sola cédula real para martillar")
    ap.add_argument("--cedulas", help="Archivo .txt con una cédula real por línea")
    ap.add_argument("--creds", help="CSV cedula,password por línea (login real → 200)")
    ap.add_argument("--password", default="loadtest-dummy",
                    help="Password a usar cuando solo das cédulas (dará 401, pero corre bcrypt)")
    ap.add_argument("--total", type=int, default=400, help="Total de logins a disparar")
    ap.add_argument("--concurrency", type=int, default=400, help="Peticiones en paralelo")
    ap.add_argument("--timeout", type=float, default=60, help="Timeout por request (s)")
    ap.add_argument("--login-path", default=LOGIN_PATH_DEFAULT)
    ap.add_argument("--probe-path", default=PROBE_PATH_DEFAULT,
                    help="Endpoint liviano para la sonda de responsividad (vacío para desactivar)")
    args = ap.parse_args()

    objetivos = cargar_objetivos(args)
    # Repetir/ciclar la lista hasta llegar a --total
    plan = [objetivos[i % len(objetivos)] for i in range(args.total)]

    print("=" * 60)
    print("🔥 LOAD TEST — login de mercaderistas")
    print(f"   URL       : {args.url}{args.login_path}")
    print(f"   Total     : {args.total} logins")
    print(f"   Paralelo  : {args.concurrency}")
    print(f"   Cédulas   : {len(objetivos)} distinta(s)")
    if not args.creds:
        print(f"   Password  : '{args.password}' → se esperan 401 (bcrypt SÍ corre)")
    print("=" * 60)

    # Arrancar sonda de responsividad
    probe = None
    if args.probe_path:
        probe = ProbeRunner(args.url, args.probe_path)
        probe.start()
        print(f"📡 Sonda activa contra {args.url}{args.probe_path} (cada 0.5s)")
        time.sleep(1.0)  # baseline antes del storm

    # Disparar el storm
    print(f"\n⏳ Disparando {args.total} logins (paralelo {args.concurrency})... "
          "progreso cada 25:", flush=True)
    resultados = []
    total = len(plan)
    paso = max(1, min(25, total // 10))
    t_inicio = time.perf_counter()
    with ThreadPoolExecutor(max_workers=args.concurrency) as ex:
        futs = [
            ex.submit(hacer_login, args.url, args.login_path, obj, args.timeout)
            for obj in plan
        ]
        for fut in as_completed(futs):
            resultados.append(fut.result())
            n = len(resultados)
            if n % paso == 0 or n == total:
                elapsed = time.perf_counter() - t_inicio
                print(f"  {n:>4}/{total}  ({elapsed:5.1f}s)", flush=True)
    duracion = time.perf_counter() - t_inicio

    if probe:
        time.sleep(1.0)  # cola post-storm
        probe.stop()
        probe.join(timeout=3)

    # ── Resumen login ──
    ok_lat = [r["ms"] for r in resultados if r["error"] is None]
    por_status = {}
    errores = {}
    for r in resultados:
        if r["error"]:
            errores[r["error"]] = errores.get(r["error"], 0) + 1
        else:
            por_status[r["status"]] = por_status.get(r["status"], 0) + 1

    rps = len(resultados) / duracion if duracion else 0
    imprimir_resumen(
        "LATENCIA DE LOGIN",
        ok_lat,
        extra_lineas=[
            f"duración : {duracion:8.1f} s  ({rps:.1f} req/s)",
            f"status   : {dict(sorted(por_status.items(), key=lambda x: str(x[0])))}",
            f"errores  : {errores if errores else 'ninguno'}",
        ],
    )

    # ── Resumen sonda (la prueba del fix de bcrypt) ──
    if probe:
        imprimir_resumen(
            "SONDA DE RESPONSIVIDAD (event loop durante el storm)",
            probe.latencias,
            extra_lineas=[f"errores sonda: {probe.errores}"],
        )
        if probe.latencias:
            p95 = pct(probe.latencias, 95)
            print()
            if p95 < 500:
                print(f"  ✅ Event loop SANO durante el storm (sonda p95={p95:.0f}ms). "
                      "El fix de bcrypt-vía-tpool funciona.")
            elif p95 < 2000:
                print(f"  ⚠️  Event loop con algo de presión (sonda p95={p95:.0f}ms). "
                      "Revisa tpool/pool y CPU del server.")
            else:
                print(f"  🔴 Event loop CONGELÁNDOSE (sonda p95={p95:.0f}ms). "
                      "Algo sigue bloqueando el loop (¿bcrypt fuera de tpool? ¿CPU saturada?).")

    print("\nListo.\n")


if __name__ == "__main__":
    main()
