"""
Client Photos API – Endpoints para la vista del cliente.
Permite navegar: Regiones → Cadenas → Puntos → Visitas/Fotos
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import Usuario
from datetime import datetime
from typing import Optional
import logging

router = APIRouter(prefix="/api/client", tags=["Client Photos"])
logger = logging.getLogger("app.client_photos")


def _get_cliente_id(user: Usuario) -> int:
    """Obtiene el id_cliente vinculado al usuario actual."""
    if not user.is_client:
        raise HTTPException(status_code=403, detail="No autorizado")
    if not user.id_perfil:
        raise HTTPException(status_code=400, detail="No tienes un cliente asociado. Contacta al administrador.")
    return user.id_perfil


# ─── REGIONES ────────────────────────────────────────────────────────────────
@router.get("/regions")
def get_client_regions(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Obtener las regiones geográficas del cliente."""
    cliente_id = _get_cliente_id(current_user)
    query = text("""
        SELECT DISTINCT rn.cuadrante AS region
        FROM RUTAS_NUEVAS rn
        INNER JOIN RUTA_PROGRAMACION rp ON rn.id_ruta = rp.id_ruta
        WHERE rp.id_cliente = :cliente_id
          AND rn.cuadrante IS NOT NULL
          AND rn.cuadrante != ''
        ORDER BY rn.cuadrante
    """)
    rows = db.execute(query, {"cliente_id": cliente_id}).fetchall()
    return [{"region": r[0]} for r in rows if r[0]]


# ─── CADENAS POR REGIÓN ─────────────────────────────────────────────────────
@router.get("/chains/{region}")
def get_client_chains_by_region(
    region: str,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Obtener las cadenas comerciales de una región para el cliente."""
    cliente_id = _get_cliente_id(current_user)
    query = text("""
        SELECT DISTINCT pin.jerarquia_nivel_2_2 AS cadena
        FROM PUNTOS_INTERES1 pin
        INNER JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes
        INNER JOIN RUTAS_NUEVAS rn ON rp.id_ruta = rn.id_ruta
        WHERE rp.id_cliente = :cliente_id
          AND rn.cuadrante = :region
          AND pin.jerarquia_nivel_2_2 IS NOT NULL
          AND pin.jerarquia_nivel_2_2 != ''
        ORDER BY pin.jerarquia_nivel_2_2
    """)
    rows = db.execute(query, {"cliente_id": cliente_id, "region": region}).fetchall()
    return [{"cadena": r[0]} for r in rows if r[0]]


# ─── PUNTOS POR REGIÓN ──────────────────────────────────────────────────────
@router.get("/points/{region}")
def get_client_points_by_region(
    region: str,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Obtener los puntos de venta de una región para el cliente."""
    cliente_id = _get_cliente_id(current_user)
    query = text("""
        SELECT DISTINCT
            pin.identificador,
            pin.punto_de_interes,
            pin.jerarquia_nivel_2_2 AS cadena,
            pin.Direccion AS direccion,
            pin.ciudad
        FROM PUNTOS_INTERES1 pin
        INNER JOIN RUTA_PROGRAMACION rp ON pin.identificador = rp.id_punto_interes
        INNER JOIN RUTAS_NUEVAS rn ON rp.id_ruta = rn.id_ruta
        WHERE rp.id_cliente = :cliente_id
          AND rn.cuadrante = :region
        ORDER BY pin.punto_de_interes
    """)
    rows = db.execute(query, {"cliente_id": cliente_id, "region": region}).fetchall()
    return [
        {
            "identificador": r[0],
            "punto_de_interes": r[1],
            "cadena": r[2] or "Sin cadena",
            "direccion": r[3] or "",
            "ciudad": r[4] or "",
        }
        for r in rows
    ]


# ─── VISITAS + FOTOS DE UN PUNTO ─────────────────────────────────────────────
@router.get("/point/{point_id}/visits")
def get_client_point_visits(
    point_id: str,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Obtener las visitas de un punto con sus fotos agrupadas por tipo."""
    cliente_id = _get_cliente_id(current_user)

    # Obtener visitas del punto
    visits_query = text("""
        SELECT
            vm.id_visita,
            vm.fecha_visita,
            vm.estado,
            m.nombre AS mercaderista_nombre,
            m.cedula AS mercaderista_cedula
        FROM VISITAS_MERCADERISTA vm
        LEFT JOIN MERCADERISTAS m ON vm.id_mercaderista = m.id_mercaderista
        WHERE vm.identificador_punto_interes = :point_id
          AND vm.id_cliente = :cliente_id
        ORDER BY vm.fecha_visita DESC
    """)
    visit_rows = db.execute(visits_query, {"point_id": point_id, "cliente_id": cliente_id}).fetchall()

    if not visit_rows:
        return []

    visit_ids = [v[0] for v in visit_rows]

    # Obtener fotos de todas las visitas — dynamic IN params for MSSQL
    placeholders = ", ".join(f":vid_{i}" for i in range(len(visit_ids)))
    photos_query = text(f"""
        SELECT
            ft.id_foto,
            ft.id_visita,
            ft.id_tipo_foto,
            ft.file_path,
            ft.Estado,
            ft.fecha_registro
        FROM FOTOS_TOTALES ft
        WHERE ft.id_visita IN ({placeholders})
          AND ft.Estado = 'Aprobada'
        ORDER BY ft.id_tipo_foto, ft.fecha_registro DESC
    """)
    params = {f"vid_{i}": vid for i, vid in enumerate(visit_ids)}
    photo_rows = db.execute(photos_query, params).fetchall()

    # Generar SAS URLs
    from app.services.azure_service import azure_service
    photos_by_visit: dict[int, list] = {}
    for p in photo_rows:
        vid = p[1]
        if vid not in photos_by_visit:
            photos_by_visit[vid] = []
        url = azure_service.get_sas_url(p[3]) if p[3] else None
        photos_by_visit[vid].append({
            "id_foto": p[0],
            "id_tipo_foto": p[2],
            "tipo_nombre": _map_tipo_foto(p[2]),
            "url": url,
            "estado": p[4],
            "fecha": str(p[5]) if p[5] else None,
        })

    result = []
    for v in visit_rows:
        fotos = photos_by_visit.get(v[0], [])
        result.append({
            "id_visita": v[0],
            "fecha": str(v[1]) if v[1] else None,
            "estado": v[2],
            "mercaderista": v[3] or "Desconocido",
            "mercaderista_cedula": v[4],
            "total_fotos": len(fotos),
            "fotos": fotos,
        })

    return result


def _map_tipo_foto(id_tipo: int | None) -> str:
    mapping = {
        1: "Gestión Antes",
        2: "Gestión Después",
        3: "Precio",
        4: "Exhibiciones Adicionales",
        8: "Material POP Antes",
        9: "Material POP Después",
    }
    return mapping.get(id_tipo or 0, "Otro")


# ─── MIS VISITAS (GLOBAL) ───────────────────────────────────────────────────
@router.get("/mis-visitas")
def get_client_mis_visitas(
    fecha_inicio: Optional[str] = None,
    fecha_fin: Optional[str] = None,
    region: Optional[str] = None,
    cadena: Optional[str] = None,
    punto_id: Optional[str] = None,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Obtener todas las visitas del cliente en un rango de fechas, con filtros."""
    cliente_id = _get_cliente_id(current_user)

    if not fecha_inicio:
        fecha_inicio_sql = datetime.now().strftime('%Y%m%d')
        fecha_inicio_res = datetime.now().strftime('%Y-%m-%d')
    else:
        try:
            parsed = datetime.strptime(fecha_inicio, '%Y-%m-%d')
            fecha_inicio_sql = parsed.strftime('%Y%m%d')
            fecha_inicio_res = fecha_inicio
        except ValueError:
            raise HTTPException(status_code=400, detail="Formato de fecha inválido (YYYY-MM-DD)")

    if not fecha_fin:
        fecha_fin_sql = fecha_inicio_sql
        fecha_fin_res = fecha_inicio_res
    else:
        try:
            parsed = datetime.strptime(fecha_fin, '%Y-%m-%d')
            fecha_fin_sql = parsed.strftime('%Y%m%d')
            fecha_fin_res = fecha_fin
        except ValueError:
            raise HTTPException(status_code=400, detail="Formato de fecha inválido (YYYY-MM-DD)")

    # Query principal de visitas
    query_str = """
        SELECT
            vm.id_visita,
            vm.fecha_visita,
            m.nombre                        AS mercaderista,
            pin.identificador               AS punto_id,
            pin.punto_de_interes            AS punto_nombre,
            pin.departamento,
            pin.ciudad,
            rn.cuadrante                    AS region,
            pin.jerarquia_nivel_2_2         AS cadena,
            ft.id_foto,
            ft.file_path,
            ft.id_tipo_foto,
            ft.estado                       AS foto_estado,
            c.cliente                       AS cliente_nombre
        FROM VISITAS_MERCADERISTA vm
        JOIN MERCADERISTAS m         ON vm.id_mercaderista = m.id_mercaderista
        JOIN PUNTOS_INTERES1 pin     ON vm.identificador_punto_interes = pin.identificador
        JOIN CLIENTES c              ON vm.id_cliente = c.id_cliente
        LEFT JOIN FOTOS_TOTALES ft   ON ft.id_visita = vm.id_visita AND ft.estado = 'Aprobada'
        LEFT JOIN RUTA_PROGRAMACION rp ON rp.id_punto_interes = pin.identificador AND rp.id_cliente = vm.id_cliente
        LEFT JOIN RUTAS_NUEVAS rn    ON rn.id_ruta = rp.id_ruta
        WHERE vm.id_cliente = :cliente_id
          AND CAST(vm.fecha_visita AS DATE) >= :fecha_inicio_sql
          AND CAST(vm.fecha_visita AS DATE) <= :fecha_fin_sql
          AND vm.estado = 'Revisado'
    """
    params = {"cliente_id": cliente_id, "fecha_inicio_sql": fecha_inicio_sql, "fecha_fin_sql": fecha_fin_sql}

    if region:
        query_str += " AND rn.cuadrante = :region"
        params["region"] = region
    if cadena:
        query_str += " AND pin.jerarquia_nivel_2_2 = :cadena"
        params["cadena"] = cadena
    if punto_id:
        query_str += " AND pin.identificador = :punto_id"
        params["punto_id"] = punto_id

    query_str += " ORDER BY vm.id_visita DESC, ft.id_tipo_foto, ft.id_foto DESC"
    
    rows = db.execute(text(query_str), params).fetchall()

    CATEGORIAS_CONFIG = {
        1: ('Gestión', 'Gestión'),
        2: ('Gestión', 'Gestión'),
        3: ('Precio', 'Precio'),
        4: ('Exhibiciones', 'Exhibiciones Adicionales'),
        8: ('Material POP Antes', 'Material POP Antes'),
        9: ('Material POP Despues', 'Material POP Despues'),
    }

    visitas_dict = {}
    from app.services.azure_service import azure_service
    
    for row in rows:
        vid = row[0]
        if vid not in visitas_dict:
            visitas_dict[vid] = {
                'id_visita': vid,
                'fecha_visita': str(row[1]) if row[1] else None,
                'mercaderista': row[2] or '',
                'punto_id': row[3],
                'punto_nombre': row[4] or '',
                'departamento': row[5] or '',
                'ciudad': row[6] or '',
                'region': row[7] or '',
                'cadena': row[8] or '',
                'cliente_nombre': row[13] or '',
                'total_fotos': 0,
                'preview_foto': None,
                'fotos_por_categoria': {
                    'Gestión': [],
                    'Precio': [],
                    'Exhibiciones Adicionales': [],
                    'Material POP Antes': [],
                    'Material POP Despues': [],
                    'Otros': []
                }
            }

        # Foto (si hay)
        if row[9]:
            id_tipo = row[11]
            cat_key, cat_label = CATEGORIAS_CONFIG.get(id_tipo, (f'Tipo {id_tipo}', 'Otros'))
            
            tipo_desc_map = {
                1: 'Antes', 2: 'Después', 3: 'Precio',
                4: 'Exhibiciones', 8: 'Material POP Antes', 9: 'Material POP Después'
            }

            url = azure_service.get_sas_url(row[10]) if row[10] else None

            foto = {
                'id_foto': row[9],
                'file_path': url, # Use the SAS URL instead of the raw path for the frontend
                'id_tipo_foto': id_tipo,
                'tipo_desc': tipo_desc_map.get(id_tipo, f'Tipo {id_tipo}'),
                'categoria': cat_label,
                'estado': row[12],
                'fecha': str(row[1]) if row[1] else None,
                'id_visita': vid,
            }

            cat_bucket = visitas_dict[vid]['fotos_por_categoria']
            if cat_label in cat_bucket:
                cat_bucket[cat_label].append(foto)
            else:
                cat_bucket['Otros'].append(foto)
                
            visitas_dict[vid]['total_fotos'] += 1
            if not visitas_dict[vid]['preview_foto']:
                visitas_dict[vid]['preview_foto'] = url

    # Obtener filtros (todas las combinaciones posibles para ese día y cliente)
    filtros_query = """
        SELECT DISTINCT
            rn.cuadrante                AS region,
            pin.jerarquia_nivel_2_2     AS cadena,
            pin.identificador           AS punto_id,
            pin.punto_de_interes        AS punto_nombre
        FROM VISITAS_MERCADERISTA vm
        JOIN PUNTOS_INTERES1 pin     ON vm.identificador_punto_interes = pin.identificador
        LEFT JOIN RUTA_PROGRAMACION rp ON rp.id_punto_interes = pin.identificador AND rp.id_cliente = vm.id_cliente
        LEFT JOIN RUTAS_NUEVAS rn    ON rn.id_ruta = rp.id_ruta
        WHERE vm.id_cliente = :cliente_id
          AND CAST(vm.fecha_visita AS DATE) >= :fecha_inicio_sql
          AND CAST(vm.fecha_visita AS DATE) <= :fecha_fin_sql
          AND vm.estado = 'Revisado'
        ORDER BY rn.cuadrante, pin.jerarquia_nivel_2_2, pin.punto_de_interes
    """
    filtros_rows = db.execute(text(filtros_query), {"cliente_id": cliente_id, "fecha_inicio_sql": fecha_inicio_sql, "fecha_fin_sql": fecha_fin_sql}).fetchall()

    regiones = sorted({r[0] for r in filtros_rows if r[0]})
    cadenas  = sorted({r[1] for r in filtros_rows if r[1]})
    puntos   = [{'id': r[2], 'nombre': r[3]} for r in filtros_rows if r[2]]
    
    seen = set()
    puntos_uniq = []
    for p in puntos:
        if p['id'] not in seen:
            seen.add(p['id'])
            puntos_uniq.append(p)

    return {
        'success': True,
        'fecha_inicio': fecha_inicio_res,
        'fecha_fin': fecha_fin_res,
        'es_hoy': fecha_inicio_res == datetime.now().strftime('%Y-%m-%d') and fecha_fin_res == datetime.now().strftime('%Y-%m-%d'),
        'visitas': list(visitas_dict.values()),
        'total': len(visitas_dict),
        'filtros': {
            'regiones': regiones,
            'cadenas': cadenas,
            'puntos': puntos_uniq,
        }
    }
