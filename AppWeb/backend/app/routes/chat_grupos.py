# app/routes/chat_grupos.py
"""
API REST de los GRUPOS DE CHAT por cliente (estilo WhatsApp privado).

Endpoints:
  GET  /api/chat-grupos/mis-grupos                 → grupos del usuario + no-leídos
  GET  /api/chat-grupos/<id_grupo>/mensajes        → historial (paginado)
  GET  /api/chat-grupos/<id_grupo>/miembros        → miembros (dinámico)
  POST /api/chat-grupos/<id_grupo>/marcar-leido    → marca leído hasta el último

El envío de mensajes en tiempo real va por el socket /chat_grupo
(app/socket_chat_grupo.py). Estos endpoints son para carga inicial e historial.
"""
from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user

from app.utils.database import execute_query, get_db_connection
from app.socket_chat import resolve_user_id
from app.utils.chat_grupos_membresia import get_grupos_de_usuario, get_miembros_grupo

chat_grupos_bp = Blueprint('chat_grupos', __name__, url_prefix='/api/chat-grupos')


def _id_usuario_actual():
    """id_usuario INT del usuario logueado (maneja mercaderistas 'mercaderista_N')."""
    uname = getattr(current_user, 'username', None)
    id_usuario, _ = resolve_user_id(current_user, uname)
    return id_usuario


def _grupo_info(id_grupo):
    row = execute_query(
        "SELECT id_grupo, id_cliente, tipo_grupo, nombre, activa FROM CHAT_GRUPOS WHERE id_grupo = ?",
        (id_grupo,), fetch_one=True
    )
    if not row:
        return None
    return {"id_grupo": row[0], "id_cliente": row[1], "tipo_grupo": row[2],
            "nombre": row[3], "activa": bool(row[4])}


def _autorizado(id_usuario, id_grupo):
    """True si el usuario pertenece al grupo (membresía dinámica)."""
    if id_usuario is None:
        return False
    return any(g["id_grupo"] == id_grupo for g in get_grupos_de_usuario(id_usuario))


@chat_grupos_bp.route('/mis-grupos', methods=['GET'])
@login_required
def mis_grupos():
    """Grupos a los que pertenece el usuario, con conteo de no-leídos y preview."""
    try:
        id_usuario = _id_usuario_actual()
        if id_usuario is None:
            return jsonify({"success": False, "error": "Usuario no identificado", "grupos": []}), 200

        grupos = get_grupos_de_usuario(id_usuario)
        if not grupos:
            return jsonify({"success": True, "grupos": []})

        ids = [g["id_grupo"] for g in grupos]
        ph = ",".join("?" for _ in ids)

        # No-leídos por grupo: mensajes ajenos con id > last_read del usuario.
        unread_rows = execute_query(f"""
            SELECT m.id_grupo, COUNT(*)
            FROM CHAT_GRUPO_MENSAJES m
            LEFT JOIN CHAT_GRUPO_LECTURAS l
                   ON l.id_grupo = m.id_grupo AND l.id_usuario = ?
            WHERE m.id_grupo IN ({ph})
              AND m.id_usuario <> ?
              AND m.id_mensaje > ISNULL(l.last_read_id_mensaje, 0)
            GROUP BY m.id_grupo
        """, tuple([id_usuario] + ids + [id_usuario])) or []
        unread = {r[0]: int(r[1]) for r in unread_rows}

        # Último mensaje por grupo (preview).
        last_rows = execute_query(f"""
            SELECT x.id_grupo, x.mensaje, x.username, x.fecha_envio
            FROM (
                SELECT m.id_grupo, m.mensaje, m.username, m.fecha_envio,
                       ROW_NUMBER() OVER (PARTITION BY m.id_grupo ORDER BY m.id_mensaje DESC) AS rn
                FROM CHAT_GRUPO_MENSAJES m
                WHERE m.id_grupo IN ({ph})
            ) x
            WHERE x.rn = 1
        """, tuple(ids)) or []
        last = {r[0]: {"mensaje": r[1], "username": r[2],
                       "fecha_envio": r[3].isoformat() if r[3] else None}
                for r in last_rows}

        for g in grupos:
            g["no_leidos"] = unread.get(g["id_grupo"], 0)
            g["ultimo_mensaje"] = last.get(g["id_grupo"])

        # Orden: primero los que tienen no-leídos, luego por nombre.
        grupos.sort(key=lambda g: (-g["no_leidos"], g.get("nombre") or ""))
        return jsonify({"success": True, "grupos": grupos})

    except Exception as e:
        current_app.logger.error(f"Error en mis_grupos: {e}", exc_info=True)
        return jsonify({"success": False, "error": str(e), "grupos": []}), 500


@chat_grupos_bp.route('/<int:id_grupo>/mensajes', methods=['GET'])
@login_required
def mensajes_grupo(id_grupo):
    """Historial del grupo (más reciente primero, paginado con before_id)."""
    try:
        id_usuario = _id_usuario_actual()
        if not _autorizado(id_usuario, id_grupo):
            return jsonify({"success": False, "error": "No autorizado"}), 403

        limit = min(request.args.get('limit', 50, type=int), 200)
        before_id = request.args.get('before_id', type=int)

        cond = " AND m.id_mensaje < ?" if before_id else ""

        rows = execute_query(f"""
            SELECT TOP (?) m.id_mensaje, m.id_grupo, m.id_usuario, m.username,
                           m.mensaje, m.tipo_mensaje, m.fecha_envio
            FROM CHAT_GRUPO_MENSAJES m
            WHERE m.id_grupo = ?{cond}
            ORDER BY m.id_mensaje DESC
        """, tuple([limit, id_grupo] + ([before_id] if before_id else []))) or []

        mensajes = [{
            "id_mensaje": r[0], "id_grupo": r[1], "id_usuario": r[2],
            "username": r[3], "mensaje": r[4], "tipo_mensaje": r[5],
            "fecha_envio": r[6].isoformat() if r[6] else None,
            "es_mio": r[2] == id_usuario,
        } for r in rows]
        mensajes.reverse()  # cronológico ascendente para la UI
        return jsonify({"success": True, "mensajes": mensajes})

    except Exception as e:
        current_app.logger.error(f"Error en mensajes_grupo: {e}", exc_info=True)
        return jsonify({"success": False, "error": str(e), "mensajes": []}), 500


@chat_grupos_bp.route('/<int:id_grupo>/miembros', methods=['GET'])
@login_required
def miembros_grupo(id_grupo):
    """Miembros actuales del grupo (calculados dinámicamente)."""
    try:
        id_usuario = _id_usuario_actual()
        if not _autorizado(id_usuario, id_grupo):
            return jsonify({"success": False, "error": "No autorizado"}), 403
        info = _grupo_info(id_grupo)
        miembros = get_miembros_grupo(info["id_cliente"], info["tipo_grupo"])
        return jsonify({"success": True, "miembros": miembros, "total": len(miembros)})
    except Exception as e:
        current_app.logger.error(f"Error en miembros_grupo: {e}", exc_info=True)
        return jsonify({"success": False, "error": str(e), "miembros": []}), 500


@chat_grupos_bp.route('/<int:id_grupo>/marcar-leido', methods=['POST'])
@login_required
def marcar_leido(id_grupo):
    """Marca el grupo como leído hasta su último mensaje (upsert en LECTURAS)."""
    try:
        id_usuario = _id_usuario_actual()
        if not _autorizado(id_usuario, id_grupo):
            return jsonify({"success": False, "error": "No autorizado"}), 403

        last = execute_query(
            "SELECT ISNULL(MAX(id_mensaje), 0) FROM CHAT_GRUPO_MENSAJES WHERE id_grupo = ?",
            (id_grupo,), fetch_one=True
        )
        last_id = int(last[0]) if last and last[0] is not None else 0

        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                MERGE CHAT_GRUPO_LECTURAS AS t
                USING (SELECT ? AS id_grupo, ? AS id_usuario) AS s
                   ON t.id_grupo = s.id_grupo AND t.id_usuario = s.id_usuario
                WHEN MATCHED THEN
                    UPDATE SET last_read_id_mensaje = ?, fecha_actualizacion = GETDATE()
                WHEN NOT MATCHED THEN
                    INSERT (id_grupo, id_usuario, last_read_id_mensaje)
                    VALUES (?, ?, ?);
            """, (id_grupo, id_usuario, last_id, id_grupo, id_usuario, last_id))
            conn.commit()
        finally:
            cursor.close()
            conn.close()

        return jsonify({"success": True, "last_read_id_mensaje": last_id})

    except Exception as e:
        current_app.logger.error(f"Error en marcar_leido: {e}", exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500
