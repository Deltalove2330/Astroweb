#!/usr/bin/env python3
# ops/check_bcrypt_rounds.py
# ════════════════════════════════════════════════════════════════════
#  Reporta la distribución del "cost factor" (rounds) de los hashes
#  bcrypt en USUARIOS.password_hash.
#
#  Formato bcrypt:  $2b$ 12 $ ....   ← el "12" es el cost (rounds=2^12).
#  Cada +1 en el cost DUPLICA el tiempo de login. 10 es seguro y ~4× más
#  rápido que 12. Si ves muchos 12+, considera re-hashear con rounds=10
#  (solo afecta logins nuevos; los viejos se re-hashean al loguearse).
#
#  USO (desde AppWeb/backend/):
#      python ops/check_bcrypt_rounds.py
# ════════════════════════════════════════════════════════════════════
import os
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    import pyodbc
except ImportError:
    sys.exit("Falta pyodbc. Instala con: pip install pyodbc")

from config import config


def cost_de_hash(h):
    """Extrae el cost factor de un hash bcrypt; None si no es bcrypt válido."""
    if not h:
        return None
    h = str(h).strip()
    # $2b$12$...  → partes: ['', '2b', '12', '....']
    partes = h.split("$")
    if len(partes) < 4 or partes[1] not in ("2a", "2b", "2y"):
        return None
    try:
        return int(partes[2])
    except ValueError:
        return None


def main():
    print(f"🔐 Revisando rounds bcrypt en USUARIOS — {config.DB_SERVER}/{config.DB_NAME}\n")
    try:
        conn = pyodbc.connect(config.SQLALCHEMY_DATABASE_URI, timeout=10)
    except Exception as e:
        sys.exit(f"❌ No se pudo conectar: {e}")

    cur = conn.cursor()
    cur.execute("SELECT password_hash FROM USUARIOS")
    filas = cur.fetchall()
    cur.close()
    conn.close()

    distrib = {}
    no_bcrypt = 0
    for (h,) in filas:
        c = cost_de_hash(h)
        if c is None:
            no_bcrypt += 1
        else:
            distrib[c] = distrib.get(c, 0) + 1

    total = len(filas)
    print(f"Total usuarios: {total}\n")
    print("  rounds (cost) | tiempo relativo | usuarios")
    print("  --------------+-----------------+---------")
    for cost in sorted(distrib):
        rel = 2 ** (cost - 10)  # relativo a cost=10
        print(f"       {cost:>2}       |   {rel:>5.1f}×        | {distrib[cost]}")
    if no_bcrypt:
        print(f"\n  ⚠️  {no_bcrypt} usuario(s) SIN hash bcrypt válido (revisar).")

    altos = sum(v for k, v in distrib.items() if k >= 12)
    if altos:
        print(f"\n  💡 {altos} usuario(s) con cost ≥ 12 → cada login ~{2**(12-10)}× más lento "
              "que con cost=10. Considera re-hashear nuevos logins con rounds=10.")
    elif distrib:
        print("\n  ✅ Costs razonables — no se requiere acción.")


if __name__ == "__main__":
    main()
