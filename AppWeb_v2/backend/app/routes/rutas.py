from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional
from datetime import date
from app.db.session import get_db
from app.core.dependencies import get_current_user, require_analyst_or_admin
from app.models.user import Usuario, UserPermission
from app.models.ruta import Ruta, RutaProgramacion, RutaCambioFuturo, RutaActivada, AnalistaRuta
from app.schemas.ruta import (
    RutaCreate, RutaUpdate, RutaResponse,
    RutaProgramacionCreate, RutaProgramacionResponse,
    CambioFuturoResponse,
    AddPointToRouteRequest, ScheduleChangeRequest,
)

router = APIRouter(prefix="/api/routes", tags=["Rutas"])


@router.get("/next-number")
def get_next_route_number(tipo: str, db: Session = Depends(get_db), _: Usuario = Depends(get_current_user)):
    tipo = tipo.upper()
    if tipo not in ["E", "A", "T"]:
        raise HTTPException(status_code=400, detail="Tipo inválido. Use E, A o T")
    
    prefix = f"Ruta {tipo}"
    routes = db.query(Ruta.nombre).filter(Ruta.nombre.like(f"{prefix}%")).all()
    
    max_num = 0
    for (nombre,) in routes:
        if nombre:
            suffix = nombre[len(prefix):]
            if suffix.isdigit():
                max_num = max(max_num, int(suffix))
    
    return {"next_number": max_num + 1}


@router.get("/options")
def get_route_options(db: Session = Depends(get_db), _: Usuario = Depends(get_current_user)):
    servicios = db.query(Ruta.servicio).distinct().filter(Ruta.servicio != None).all()
    return {"servicios": [s[0] for s in servicios]}


@router.get("/", response_model=List[RutaResponse])
def list_routes(
    activa: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    query = db.query(Ruta)
    
    # Granular Visibility Logic
    if not current_user.is_admin:
        # Check if they have 'can_see_all' permission for routes
        perm = next((p for p in current_user.permisos if p.module == 'rutas'), None)
        can_see_all = perm.can_see_all if perm else False
        
        if not can_see_all and current_user.is_analyst:
            # Only see routes where they are assigned in analistas_rutas
            query = query.join(Ruta.analistas).filter(AnalistaRuta.id_analista == current_user.id_perfil)

    return query.order_by(Ruta.nombre).all()


@router.post("/", response_model=RutaResponse, status_code=201)
def create_route(
    data: RutaCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_analyst_or_admin),
):
    tipo = data.tipo.upper()
    prefix = f"Ruta {tipo}"
    routes = db.query(Ruta.nombre).filter(Ruta.nombre.like(f"{prefix}%")).all()
    
    max_num = 0
    for (nombre,) in routes:
        if nombre:
            suffix = nombre[len(prefix):]
            if suffix.isdigit():
                max_num = max(max_num, int(suffix))
    
    next_num = max_num + 1
    route_name = f"{prefix}{next_num}"
    
    db_data = data.model_dump(exclude={"tipo"})
    db_data["nombre"] = route_name
    
    ruta = Ruta(**db_data)
    db.add(ruta)
    db.commit()
    db.refresh(ruta)
    return ruta


@router.get("/activated/today")
def get_activated_routes_today(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    activadas = db.query(RutaActivada).all()
    return [{"ruta_id": a.ruta_id, "mercaderista_id": a.mercaderista_id} for a in activadas]


@router.get("/{route_id}", response_model=RutaResponse)
def get_route(route_id: int, db: Session = Depends(get_db), _: Usuario = Depends(get_current_user)):
    ruta = db.query(Ruta).filter(Ruta.id == route_id).first()
    if not ruta:
        raise HTTPException(status_code=404, detail="Ruta no encontrada")
    return ruta


@router.patch("/{route_id}", response_model=RutaResponse)
def update_route(
    route_id: int,
    data: RutaUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_analyst_or_admin),
):
    ruta = db.query(Ruta).filter(Ruta.id == route_id).first()
    if not ruta:
        raise HTTPException(status_code=404, detail="Ruta no encontrada")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(ruta, key, value)
    db.commit()
    db.refresh(ruta)
    return ruta


@router.get("/{route_id}/points", response_model=List[RutaProgramacionResponse])
def get_route_points(
    route_id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return db.query(RutaProgramacion).options(
        joinedload(RutaProgramacion.punto),
        joinedload(RutaProgramacion.cliente)
    ).filter(
        RutaProgramacion.ruta_id == route_id,
        RutaProgramacion.activo == True,
    ).all()


@router.post("/{route_id}/add-point", response_model=RutaProgramacionResponse, status_code=201)
def add_point_to_route(
    route_id: int,
    data: AddPointToRouteRequest,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_analyst_or_admin),
):
    existing = db.query(RutaProgramacion).filter(
        RutaProgramacion.ruta_id == route_id,
        RutaProgramacion.punto_id == data.punto_id,
        RutaProgramacion.id_cliente == data.client_id,
    ).first()
    
    if existing:
        existing.activo = True
        existing.dia = data.dia
        existing.prioridad = data.priority
        db.commit()
        db.refresh(existing)
        return existing
        
    prog = RutaProgramacion(
        ruta_id=route_id,
        punto_id=data.punto_id,
        id_cliente=data.client_id,
        dia=data.dia,
        prioridad=data.priority,
        activo=True
    )
    db.add(prog)
    db.commit()
    db.refresh(prog)
    return prog


@router.post("/{route_id}/schedule-change", response_model=CambioFuturoResponse, status_code=201)
def schedule_route_change(
    route_id: int,
    data: ScheduleChangeRequest,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_analyst_or_admin),
):
    ruta = db.query(Ruta).filter(Ruta.id == route_id).first()
    cambio = RutaCambioFuturo(
        ruta_id=route_id,
        ruta_nombre=ruta.nombre if ruta else None,
        id_programacion=data.id_programacion,
        id_punto_interes=data.id_punto_interes,
        punto_interes_nombre=data.punto_interes_nombre,
        id_cliente=data.id_cliente,
        cliente_nombre=data.cliente_nombre,
        dia=data.dia,
        prioridad=data.prioridad,
        tipo_cambio=data.tipo_cambio,
        fecha_ejecucion=data.fecha_ejecucion,
        observaciones=data.observaciones,
        creado_por=current_user.username,
        estado="PENDIENTE",
    )
    db.add(cambio)
    db.commit()
    db.refresh(cambio)
    return cambio


@router.get("/{route_id}/future-changes", response_model=List[CambioFuturoResponse])
def get_future_changes(
    route_id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return db.query(RutaCambioFuturo).filter(
        RutaCambioFuturo.ruta_id == route_id,
    ).order_by(RutaCambioFuturo.fecha_ejecucion.asc()).all()


@router.delete("/points/{programacion_id}", status_code=204)
def remove_point_from_route(
    programacion_id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_analyst_or_admin),
):
    prog = db.query(RutaProgramacion).filter(RutaProgramacion.id == programacion_id).first()
    if not prog:
        raise HTTPException(status_code=404, detail="Programación no encontrada")
    db.delete(prog)
    db.commit()
    return None
