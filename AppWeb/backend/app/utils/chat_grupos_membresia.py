# app/utils/chat_grupos_membresia.py
"""
Resolución DINÁMICA de la membresía de los grupos de chat por cliente.

No se guarda lista de miembros: se calcula desde las tablas operativas. Si
cambian los mercaderistas/analistas/etc. del cliente, los grupos se ajustan
solos.

Fuentes de verdad del vínculo persona ↔ cliente:
  • Mercaderistas → RUTA_PROGRAMACION (activa=1) vía MERCADERISTAS_RUTAS.
                    (NO se usa MERCADERISTAS_CLIENTE: está desactualizada.)
  • Analistas     → ANALISTAS_CLIENTE
  • Supervisores  → SUPERVISORES_CLIENTE
  • Coordinadores → USUARIOS.id_rol  (3 = Exclusivo, 4 = Tradex), según el
                    tipo del cliente (CLIENTES.id_tipo_cliente = 3 → Exclusivo)
  • Usuarios del cliente → USUARIOS.id_cliente   (solo grupo 'operativo_cliente')

Tipos de grupo:
  • 'operativo'          → solo personal epran (los 4 primeros bloques)
  • 'operativo_cliente'  → lo anterior + usuarios rol 'client' del cliente
"""
from app.utils.database import execute_query

TIPOS_VALIDOS = ('operativo', 'operativo_cliente')

ID_ROL_COORD_EXCLUSIVO = 3
ID_ROL_COORD_TRADEX    = 4


def _coord_rol_para_cliente(id_cliente: int):
    """Devuelve el id_rol de coordinador que corresponde al tipo del cliente.

    Exclusivo (id_tipo_cliente=3) → coordinadores exclusivos (id_rol=3).
    Cualquier otro tipo (Tradex)  → coordinadores tradex (id_rol=4).
    """
    row = execute_query(
        "SELECT id_tipo_cliente FROM CLIENTES WHERE id_cliente = ?",
        (id_cliente,), fetch_one=True
    )
    id_tipo = row[0] if row else None
    return ID_ROL_COORD_EXCLUSIVO if id_tipo == 3 else ID_ROL_COORD_TRADEX


def get_miembros_grupo(id_cliente: int, tipo_grupo: str):
    """Lista de miembros de un grupo: [{'id_usuario', 'username', 'origen'}].

    'origen' indica por qué está en el grupo (mercaderista/analista/supervisor/
    coordinador/cliente) — útil para depurar y para la UI.
    """
    if tipo_grupo not in TIPOS_VALIDOS:
        raise ValueError(f"tipo_grupo inválido: {tipo_grupo}")

    coord_rol = _coord_rol_para_cliente(id_cliente)

    # Bloques del grupo 'operativo' (personal epran). Cada SELECT trae el mismo
    # shape (id_usuario, username, origen) y se unifican con UNION.
    bloques = [
        # Mercaderistas con ruta programada activa para el cliente
        ("""
            SELECT DISTINCT u.id_usuario, u.username, 'mercaderista' AS origen
            FROM USUARIOS u
            JOIN MERCADERISTAS_RUTAS mr ON mr.id_mercaderista = u.id_mercaderista
            JOIN RUTA_PROGRAMACION rp   ON rp.id_ruta = mr.id_ruta
            WHERE rp.id_cliente = ? AND rp.activa = 1
        """, (id_cliente,)),
        # Analistas del cliente
        ("""
            SELECT DISTINCT u.id_usuario, u.username, 'analista' AS origen
            FROM USUARIOS u
            JOIN ANALISTAS_CLIENTE ac ON ac.id_analista = u.id_analista
            WHERE ac.id_cliente = ?
        """, (id_cliente,)),
        # Supervisores del cliente
        ("""
            SELECT DISTINCT u.id_usuario, u.username, 'supervisor' AS origen
            FROM USUARIOS u
            JOIN SUPERVISORES_CLIENTE sc ON sc.id_supervisor = u.id_supervisor
            WHERE sc.id_cliente = ?
        """, (id_cliente,)),
        # Coordinadores del tipo correspondiente al cliente
        ("""
            SELECT DISTINCT u.id_usuario, u.username, 'coordinador' AS origen
            FROM USUARIOS u
            WHERE u.id_rol = ?
        """, (coord_rol,)),
    ]

    if tipo_grupo == 'operativo_cliente':
        # Usuarios rol 'client' (u otros) ligados directamente al cliente
        bloques.append(("""
            SELECT DISTINCT u.id_usuario, u.username, 'cliente' AS origen
            FROM USUARIOS u
            WHERE u.id_cliente = ?
        """, (id_cliente,)))

    # Dedup por id_usuario conservando el primer 'origen' encontrado.
    miembros = {}
    for sql, params in bloques:
        for row in (execute_query(sql, params) or []):
            uid = row[0]
            if uid is None or uid in miembros:
                continue
            miembros[uid] = {
                "id_usuario": int(uid),
                "username":   row[1],
                "origen":     row[2],
            }
    return list(miembros.values())


def get_miembros_ids(id_cliente: int, tipo_grupo: str):
    """Conjunto de id_usuario miembros — para autorización y fan-out rápido."""
    return {m["id_usuario"] for m in get_miembros_grupo(id_cliente, tipo_grupo)}


def usuario_es_miembro(id_usuario: int, id_cliente: int, tipo_grupo: str) -> bool:
    """¿El usuario pertenece al grupo? Autorización del join/envío en el socket."""
    if id_usuario is None:
        return False
        
    # Los superadmins (1) y admins (2) tienen acceso global a los chats de clientes
    u = execute_query("SELECT id_rol FROM USUARIOS WHERE id_usuario = ?", (id_usuario,), fetch_one=True)
    if u and u[0] in (1, 2):
        return True
        
    return int(id_usuario) in get_miembros_ids(id_cliente, tipo_grupo)


def get_grupos_de_usuario(id_usuario: int):
    """Grupos (ya provisionados y activos) a los que pertenece un usuario.

    Inverso de get_miembros_grupo: parte de las relaciones del usuario y deduce
    los clientes para los que es operativo / cliente, luego cruza con
    CHAT_GRUPOS para devolver solo grupos reales y activos.

    Devuelve: [{'id_grupo', 'id_cliente', 'tipo_grupo', 'nombre'}].
    """
    if id_usuario is None:
        return []

    u = execute_query("""
        SELECT id_usuario, id_mercaderista, id_analista, id_supervisor,
               id_rol, id_cliente
        FROM USUARIOS WHERE id_usuario = ?
    """, (id_usuario,), fetch_one=True)
    if not u:
        return []

    id_merc, id_analista, id_supervisor, id_rol, id_cliente_user = \
        u[1], u[2], u[3], u[4], u[5]

    # Clientes para los que el usuario es OPERATIVO (→ ambos grupos)
    clientes_operativo = set()
    # Clientes donde el usuario es solo usuario-cliente (→ solo 'operativo_cliente')
    clientes_solo_cliente = set()

    if id_merc:
        for r in (execute_query("""
                SELECT DISTINCT rp.id_cliente
                FROM MERCADERISTAS_RUTAS mr
                JOIN RUTA_PROGRAMACION rp ON rp.id_ruta = mr.id_ruta
                WHERE mr.id_mercaderista = ? AND rp.activa = 1
            """, (id_merc,)) or []):
            if r[0] is not None:
                clientes_operativo.add(int(r[0]))

    if id_analista:
        for r in (execute_query(
                "SELECT id_cliente FROM ANALISTAS_CLIENTE WHERE id_analista = ?",
                (id_analista,)) or []):
            if r[0] is not None:
                clientes_operativo.add(int(r[0]))

    if id_supervisor:
        for r in (execute_query(
                "SELECT id_cliente FROM SUPERVISORES_CLIENTE WHERE id_supervisor = ?",
                (id_supervisor,)) or []):
            if r[0] is not None:
                clientes_operativo.add(int(r[0]))

    # Coordinadores: operativos de TODOS los clientes de su tipo que tengan grupo.
    if id_rol in (ID_ROL_COORD_EXCLUSIVO, ID_ROL_COORD_TRADEX):
        id_tipo = 3 if id_rol == ID_ROL_COORD_EXCLUSIVO else 1
        for r in (execute_query("""
                SELECT DISTINCT g.id_cliente
                FROM CHAT_GRUPOS g
                JOIN CLIENTES c ON c.id_cliente = g.id_cliente
                WHERE g.activa = 1 AND c.id_tipo_cliente = ?
            """, (id_tipo,)) or []):
            if r[0] is not None:
                clientes_operativo.add(int(r[0]))

    if id_cliente_user:
        clientes_solo_cliente.add(int(id_cliente_user))

    if not clientes_operativo and not clientes_solo_cliente:
        return []

    # Traer los grupos reales activos y filtrar según membresía deducida.
    rows = execute_query("""
        SELECT id_grupo, id_cliente, tipo_grupo, nombre
        FROM CHAT_GRUPOS WHERE activa = 1
    """) or []

    grupos = []
    for id_grupo, cli, tipo, nombre in rows:
        cli = int(cli)
        es_miembro = (
            cli in clientes_operativo
            or (tipo == 'operativo_cliente' and cli in clientes_solo_cliente)
        )
        if es_miembro:
            grupos.append({
                "id_grupo":   int(id_grupo),
                "id_cliente": cli,
                "tipo_grupo": tipo,
                "nombre":     nombre,
            })
    return grupos
