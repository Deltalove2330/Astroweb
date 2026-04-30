from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from datetime import date, timedelta
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import Usuario

router = APIRouter(prefix="/api/client-data", tags=["Client Data"])

@router.get("/filters")
def get_client_data_filters(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    cliente_id = current_user.id_perfil if current_user.is_client else None
    
    # We will get distinct products, chains, regions, pdvs, and mercaderistas
    query_params = {}
    where_clause = "WHERE 1=1"
    if cliente_id:
        where_clause += " AND b.id_cliente = :cliente_id"
        query_params["cliente_id"] = cliente_id

    # Get distinct productos
    productos = db.execute(text(f"SELECT DISTINCT producto FROM BALANCES_TOTALES b {where_clause} AND producto IS NOT NULL"), query_params).scalars().all()
    
    # Get distinct mercaderistas
    mercaderistas = db.execute(text(f"SELECT DISTINCT mercaderista FROM BALANCES_TOTALES b {where_clause} AND mercaderista IS NOT NULL"), query_params).scalars().all()

    # Get distinct PDVs (identificadores)
    pdvs = db.execute(text(f"""
        SELECT DISTINCT p.identificador, p.punto_de_interes 
        FROM BALANCES_TOTALES b 
        JOIN PUNTOS_INTERES1 p ON b.identificador_pdv = p.identificador 
        {where_clause}
    """), query_params).fetchall()
    
    # Get distinct cadenas
    cadenas = db.execute(text(f"""
        SELECT DISTINCT p.jerarquia_nivel_2 as cadena
        FROM BALANCES_TOTALES b 
        JOIN PUNTOS_INTERES1 p ON b.identificador_pdv = p.identificador 
        {where_clause} AND p.jerarquia_nivel_2 IS NOT NULL
    """), query_params).scalars().all()

    # Get distinct regions
    regiones = db.execute(text(f"""
        SELECT DISTINCT p.jerarquia_nivel_2_2 as region
        FROM BALANCES_TOTALES b 
        JOIN PUNTOS_INTERES1 p ON b.identificador_pdv = p.identificador 
        {where_clause} AND p.jerarquia_nivel_2_2 IS NOT NULL
    """), query_params).scalars().all()

    return {
        "productos": sorted(productos),
        "mercaderistas": sorted(mercaderistas),
        "pdvs": [{"id": p.identificador, "nombre": p.punto_de_interes} for p in pdvs],
        "cadenas": sorted(cadenas),
        "regiones": sorted(regiones)
    }

@router.get("/balances")
def get_client_balances(
    fecha_inicio: Optional[date] = None,
    fecha_fin: Optional[date] = None,
    producto: Optional[str] = None,
    cadena: Optional[str] = None,
    region: Optional[str] = None,
    pdv: Optional[str] = None,
    mercaderista: Optional[str] = None,
    visita_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    cliente_id = current_user.id_perfil if current_user.is_client else None
    
    # Default to last 30 days if no dates provided
    if not fecha_inicio and not fecha_fin:
        fecha_fin = date.today()
        fecha_inicio = fecha_fin - timedelta(days=30)
        
    query_str = """
        SELECT 
            b.id_balance,
            b.fecha_balance,
            b.id_visita as visita_id,
            p.jerarquia_nivel_2_2 as region,
            p.jerarquia_nivel_2 as cadena,
            p.punto_de_interes as pdv_nombre,
            b.mercaderista,
            b.producto,
            b.categoria,
            b.inv_inicial,
            b.inv_final,
            b.inv_deposito,
            b.caras,
            b.precio_bs,
            b.precio_ds
        FROM BALANCES_TOTALES b
        LEFT JOIN PUNTOS_INTERES1 p ON b.identificador_pdv = p.identificador
        WHERE 1=1
    """
    
    params = {}
    
    if cliente_id:
        query_str += " AND b.id_cliente = :cliente_id"
        params["cliente_id"] = cliente_id
        
    if fecha_inicio:
        query_str += " AND b.fecha_balance >= :fecha_inicio"
        params["fecha_inicio"] = fecha_inicio
        
    if fecha_fin:
        # Add 1 day to include the entire end date
        query_str += " AND b.fecha_balance < :fecha_fin_plus_one"
        params["fecha_fin_plus_one"] = fecha_fin + timedelta(days=1)
        
    if producto:
        query_str += " AND b.producto = :producto"
        params["producto"] = producto
        
    if cadena:
        query_str += " AND p.jerarquia_nivel_2 = :cadena"
        params["cadena"] = cadena
        
    if region:
        query_str += " AND p.jerarquia_nivel_2_2 = :region"
        params["region"] = region
        
    if pdv:
        query_str += " AND b.identificador_pdv = :pdv"
        params["pdv"] = pdv
        
    if mercaderista:
        query_str += " AND b.mercaderista = :mercaderista"
        params["mercaderista"] = mercaderista
        
    if visita_id:
        query_str += " AND b.id_visita = :visita_id"
        params["visita_id"] = visita_id
        
    query_str += " ORDER BY b.fecha_balance DESC"
    
    rows = db.execute(text(query_str), params).fetchall()
    
    results = []
    for row in rows:
        results.append({
            "id_balance": row.id_balance,
            "fecha_balance": str(row.fecha_balance) if row.fecha_balance else None,
            "visita_id": row.visita_id,
            "region": row.region,
            "cadena": row.cadena,
            "pdv_nombre": row.pdv_nombre,
            "mercaderista": row.mercaderista,
            "producto": row.producto,
            "categoria": row.categoria,
            "inv_inicial": row.inv_inicial,
            "inv_final": row.inv_final,
            "inv_deposito": row.inv_deposito,
            "caras": row.caras,
            "precio_bs": row.precio_bs,
            "precio_ds": row.precio_ds
        })
        
    return results
