# app/utils/chat_grupos_membresia.py
"""
Resolución DINÁMICA de la membresía de los grupos de chat por cliente.

No se guarda lista de miembros: se calcula desde las tablas operativas. Si
cambian los mercaderistas/analistas/etc. del cliente, los grupos se ajustan
solos.

Fuentes de verdad del vínculo persona ↔ cliente:
  • Mercaderistas → RUTA_PROGRAMACION (activa=1) vía MERCADERISTAS_RUTAS,
                    resolviendo el usuario por USUARIOS.username =
                    MERCADERISTAS.cedula (USUARIOS.id_mercaderista se
                    eliminó de la tabla).
                    (NO se usa MERCADERISTAS_CLIENTE: está desactualizada.)
  • Analistas     → RUTA_PROGRAMACION (activa=1) vía ANALISTAS_RUTAS, mismo
                    criterio que mercaderistas (ANALISTAS_CLIENTE quedó
                    desactualizada), resolviendo el usuario por
                    USUARIOS.id_perfil (id_rol=2) — USUARIOS.id_analista
                    se eliminó; id_perfil lo reemplaza para ese rol.
  • Supervisores  → SUPERVISORES_CLIENTE. USUARIOS.id_supervisor se
                    eliminó y, a diferencia de cliente/analista, ningún
                    usuario supervisor tiene id_perfil poblado con el
                    reemplazo — no hay forma confiable de resolverlo
                    todavía. Este bloque queda deshabilitado (no aporta
                    miembros) hasta que exista esa relación.
  • Coordinadores → USUARIOS.id_rol (3 = Exclusivo, 4 = Tradex, 11 = General).
                    A diferencia de mercaderistas/analistas (que solo ven los
                    clientes que tienen asignados), un coordinador de
                    cualquiera de estos tres roles ve y es miembro de TODOS
                    los clientes con grupo activo, sin filtrar por
                    CLIENTES.id_tipo_cliente.
  • Usuarios del cliente → USUARIOS.id_perfil (id_rol=1) — USUARIOS.id_cliente
                    se eliminó; id_perfil lo reemplaza para ese rol.
                    (solo grupo 'operativo_cliente')

Tipos de grupo:
  • 'operativo'          → solo personal epran (los 4 primeros bloques)
  • 'operativo_cliente'  → lo anterior + usuarios rol 'client' del cliente
"""
from app.utils.database import execute_query

TIPOS_VALIDOS = ('operativo', 'operativo_cliente')

ID_ROL_COORD_EXCLUSIVO = 3
ID_ROL_COORD_TRADEX    = 4
ID_ROL_COORD_GENERAL   = 11
ROLES_COORDINADOR = (ID_ROL_COORD_EXCLUSIVO, ID_ROL_COORD_TRADEX, ID_ROL_COORD_GENERAL)


def get_miembros_grupo(id_cliente: int, tipo_grupo: str):
    """Lista de miembros de un grupo: [{'id_usuario', 'username', 'origen'}].

    'origen' indica por qué está en el grupo (mercaderista/analista/supervisor/
    coordinador/cliente) — útil para depurar y para la UI.
    """
    if tipo_grupo not in TIPOS_VALIDOS:
        raise ValueError(f"tipo_grupo inválido: {tipo_grupo}")

    coord_placeholders = ','.join('?' for _ in ROLES_COORDINADOR)

    # Bloques del grupo 'operativo' (personal epran). Cada SELECT trae el mismo
    # shape (id_usuario, username, origen) y se unifican con UNION.
    bloques = [
        # Mercaderistas con ruta programada activa para el cliente
        ("""
            SELECT DISTINCT u.id_usuario, u.username, 'mercaderista' AS origen
            FROM MERCADERISTAS_RUTAS mr
            JOIN RUTA_PROGRAMACION rp ON rp.id_ruta = mr.id_ruta
            JOIN MERCADERISTAS mm     ON mm.id_mercaderista = mr.id_mercaderista
            JOIN USUARIOS u           ON u.username = CONVERT(nvarchar(50), mm.cedula)
            WHERE rp.id_cliente = ? AND rp.activa = 1
        """, (id_cliente,)),
        # Analistas con ruta activa que sirve al cliente (id_perfil reemplaza
        # a id_analista para id_rol=2) — via ANALISTAS_RUTAS, no
        # ANALISTAS_CLIENTE (desactualizada), mismo criterio que mercaderistas.
        ("""
            SELECT DISTINCT u.id_usuario, u.username, 'analista' AS origen
            FROM ANALISTAS_RUTAS ar
            JOIN RUTA_PROGRAMACION rp ON rp.id_ruta = ar.id_ruta
            JOIN USUARIOS u           ON u.id_perfil = ar.id_analista
            WHERE u.id_rol = 2 AND rp.id_cliente = ? AND rp.activa = 1
        """, (id_cliente,)),
        # Supervisores del cliente — SIN RESOLVER: USUARIOS ya no tiene
        # id_supervisor ni un id_perfil equivalente poblado. Bloque
        # deshabilitado (no aporta miembros) en vez de tumbar la función.
        # Coordinadores (exclusivo/tradex/general) — miembros de TODOS los
        # clientes, sin filtrar por tipo (ver docstring del módulo).
        (f"""
            SELECT DISTINCT u.id_usuario, u.username, 'coordinador' AS origen
            FROM USUARIOS u
            WHERE u.id_rol IN ({coord_placeholders})
        """, ROLES_COORDINADOR),
    ]

    if tipo_grupo == 'operativo_cliente':
        # Usuarios rol 'client' del cliente (id_perfil reemplaza a id_cliente)
        bloques.append(("""
            SELECT DISTINCT u.id_usuario, u.username, 'cliente' AS origen
            FROM USUARIOS u
            WHERE u.id_rol = 1 AND u.id_perfil = ?
        """, (id_cliente,)))

    # Dedup por id_usuario conservando el primer 'origen' encontrado.
    # Cada bloque corre aislado: si uno falla (p.ej. una tabla ausente en
    # algún entorno) no debe tumbar la resolución de los demás.
    miembros = {}
    for sql, params in bloques:
        try:
            rows = execute_query(sql, params) or []
        except Exception:
            from flask import current_app
            current_app.logger.error(
                f"[chat_grupos_membresia] Bloque de membresía falló, se omite: {sql[:80]}...",
                exc_info=True,
            )
            continue
        for row in rows:
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

    # id_mercaderista/id_analista/id_supervisor/id_cliente ya no existen en
    # USUARIOS. id_perfil las reemplaza para mercaderista/analista/cliente
    # (id_rol 5/2/1 respectivamente) — supervisor sigue sin resolver.
    u = execute_query("""
        SELECT id_usuario, id_perfil, id_rol
        FROM USUARIOS WHERE id_usuario = ?
    """, (id_usuario,), fetch_one=True)
    if not u:
        return []

    id_perfil, id_rol = u[1], u[2]
    id_merc         = id_perfil if id_rol == 5 else None
    id_analista     = id_perfil if id_rol == 2 else None
    id_supervisor   = None
    id_cliente_user = id_perfil if id_rol == 1 else None

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
        for r in (execute_query("""
                SELECT DISTINCT rp.id_cliente
                FROM ANALISTAS_RUTAS ar
                JOIN RUTA_PROGRAMACION rp ON rp.id_ruta = ar.id_ruta
                WHERE ar.id_analista = ? AND rp.activa = 1
            """, (id_analista,)) or []):
            if r[0] is not None:
                clientes_operativo.add(int(r[0]))

    if id_supervisor:
        for r in (execute_query(
                "SELECT id_cliente FROM SUPERVISORES_CLIENTE WHERE id_supervisor = ?",
                (id_supervisor,)) or []):
            if r[0] is not None:
                clientes_operativo.add(int(r[0]))

    # Coordinadores (exclusivo/tradex/general): operativos de TODOS los
    # clientes que tengan grupo, sin filtrar por tipo de cliente.
    if id_rol in ROLES_COORDINADOR:
        for r in (execute_query("""
                SELECT DISTINCT g.id_cliente
                FROM CHAT_GRUPOS g
                WHERE g.activa = 1
            """) or []):
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
