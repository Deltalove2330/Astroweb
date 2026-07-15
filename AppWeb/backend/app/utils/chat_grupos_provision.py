# app/utils/chat_grupos_provision.py
"""
Auto-provisión de los grupos de chat por cliente.

Crea (idempotente) los 2 grupos de cada cliente:
  • 'operativo'          → equipo epran
  • 'operativo_cliente'  → equipo epran + usuarios del cliente

La membresía es dinámica (ver chat_grupos_membresia), así que aquí solo se
crean las filas en CHAT_GRUPOS. Re-ejecutable sin duplicar gracias al UNIQUE
(id_cliente, tipo_grupo).
"""
from app.utils.database import execute_query, get_db_connection

TIPOS = ('operativo', 'operativo_cliente')


def _nombre_grupo(cliente_nombre: str, tipo_grupo: str) -> str:
    base = cliente_nombre or "Cliente"
    if tipo_grupo == 'operativo':
        return f"Equipo operativo · {base}"
    return f"{base} · Equipo + Cliente"


def asegurar_grupos_cliente(id_cliente: int, cliente_nombre: str = None) -> int:
    """Crea los grupos faltantes de un cliente. Devuelve cuántos creó."""
    if cliente_nombre is None:
        # execute_query(..., fetch_one=True) desenvuelve resultados de una sola
        # columna al valor escalar directo (no una tupla) — indexar con [0]
        # tomaba el primer caracter del nombre en vez del nombre completo.
        row = execute_query(
            "SELECT cliente FROM CLIENTES WHERE id_cliente = ?",
            (id_cliente,), fetch_one=True
        )
        cliente_nombre = row if row else f"Cliente {id_cliente}"

    creados = 0
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        for tipo in TIPOS:
            cursor.execute("""
                IF NOT EXISTS (
                    SELECT 1 FROM CHAT_GRUPOS
                    WHERE id_cliente = ? AND tipo_grupo = ?
                )
                INSERT INTO CHAT_GRUPOS (id_cliente, tipo_grupo, nombre)
                VALUES (?, ?, ?)
            """, (id_cliente, tipo, id_cliente, tipo, _nombre_grupo(cliente_nombre, tipo)))
            creados += cursor.rowcount if cursor.rowcount and cursor.rowcount > 0 else 0
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()
    return creados


def provisionar_todos() -> dict:
    """Provisiona grupos para todo cliente con programación de rutas activa.

    Cubre Exclusivos y Tradex (cualquier cliente con RUTA_PROGRAMACION activa).
    """
    clientes = execute_query("""
        SELECT DISTINCT c.id_cliente, c.cliente
        FROM CLIENTES c
        JOIN RUTA_PROGRAMACION rp ON rp.id_cliente = c.id_cliente
        WHERE rp.activa = 1 AND c.cliente IS NOT NULL
    """) or []

    total_clientes = 0
    total_grupos = 0
    for id_cliente, cliente_nombre in clientes:
        total_clientes += 1
        total_grupos += asegurar_grupos_cliente(id_cliente, cliente_nombre)
    return {"clientes": total_clientes, "grupos_creados": total_grupos}


if __name__ == '__main__':
    # Ejecutable: python -m app.utils.chat_grupos_provision  (desde backend/)
    from app import create_app
    app, _ = create_app()
    with app.app_context():
        res = provisionar_todos()
        print(f"✅ Provisión completada: {res['clientes']} clientes, "
              f"{res['grupos_creados']} grupos creados.")
