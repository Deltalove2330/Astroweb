from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.core.dependencies import get_current_user, require_analyst_or_admin
from app.models.user import Usuario
from app.models.punto import PuntoInteres
from app.schemas.cliente import PuntoInteresCreate, PuntoInteresUpdate, PuntoInteresResponse
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/points", tags=["Puntos de Interés"])


@router.get("/", response_model=List[PuntoInteresResponse])
def list_points(
    region: Optional[str] = None,
    ciudad: Optional[str] = None,
    cadena: Optional[str] = None,
    jerarquia_n2: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    query = db.query(PuntoInteres)
    if region:
        query = query.filter(PuntoInteres.departamento == region)
    if ciudad:
        query = query.filter(PuntoInteres.ciudad == ciudad)
    if cadena:
        query = query.filter(PuntoInteres.cadena == cadena)
    if jerarquia_n2:
        query = query.filter(PuntoInteres.jerarquia_n2 == jerarquia_n2)
    if search:
        query = query.filter(
            PuntoInteres.nombre.ilike(f"%{search}%") |
            PuntoInteres.id.ilike(f"%{search}%")
        )
    return query.order_by(PuntoInteres.nombre).offset(skip).limit(limit).all()


@router.post("/", response_model=PuntoInteresResponse, status_code=201)
def create_point(
    data: PuntoInteresCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_analyst_or_admin),
):
    punto = PuntoInteres(**data.model_dump())
    db.add(punto)
    db.flush()

    log_action(db, action="CREATE_POINT", entity_type="PuntoInteres",
               user_id=current_user.id, username=current_user.username, rol=current_user.rol,
               ip_address=request.client.host if request.client else None,
               entity_id=punto.id, entity_name=getattr(punto, 'nombre', str(punto.id)),
               changes=data.model_dump())
    db.commit()
    db.refresh(punto)
    return punto


@router.get("/regions/list")
def get_regions(db: Session = Depends(get_db), _: Usuario = Depends(get_current_user)):
    rows = db.query(PuntoInteres.departamento).filter(PuntoInteres.departamento != None).distinct().order_by(PuntoInteres.departamento).all()
    return [r[0] for r in rows if r[0]]


@router.get("/cities/list")
def get_cities(db: Session = Depends(get_db), _: Usuario = Depends(get_current_user)):
    rows = db.query(PuntoInteres.ciudad).filter(PuntoInteres.ciudad != None).distinct().order_by(PuntoInteres.ciudad).all()
    return [c[0] for c in rows if c[0]]


@router.get("/chains/list")
def get_chains(db: Session = Depends(get_db), _: Usuario = Depends(get_current_user)):
    rows = db.query(PuntoInteres.cadena).filter(PuntoInteres.cadena != None).distinct().order_by(PuntoInteres.cadena).all()
    return [c[0] for c in rows if c[0]]


@router.get("/jerarquia_n2/list")
def get_jerarquia_n2(db: Session = Depends(get_db), _: Usuario = Depends(get_current_user)):
    rows = db.query(PuntoInteres.jerarquia_n2).filter(PuntoInteres.jerarquia_n2 != None).distinct().order_by(PuntoInteres.jerarquia_n2).all()
    return [r[0] for r in rows if r[0]]


@router.get("/jerarquia_n2_2/list")
def get_jerarquia_n2_2(db: Session = Depends(get_db), _: Usuario = Depends(get_current_user)):
    rows = db.query(PuntoInteres.jerarquia_n2_2).filter(PuntoInteres.jerarquia_n2_2 != None).distinct().order_by(PuntoInteres.jerarquia_n2_2).all()
    return [r[0] for r in rows if r[0]]


@router.get("/nivel_alcance/list")
def get_nivel_alcance(db: Session = Depends(get_db), _: Usuario = Depends(get_current_user)):
    rows = db.query(PuntoInteres.nivel_de_alcance).filter(PuntoInteres.nivel_de_alcance != None).distinct().order_by(PuntoInteres.nivel_de_alcance).all()
    return [r[0] for r in rows if r[0]]


@router.get("/count")
def count_points(
    region: Optional[str] = None,
    ciudad: Optional[str] = None,
    cadena: Optional[str] = None,
    jerarquia_n2: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    query = db.query(PuntoInteres)
    if region:
        query = query.filter(PuntoInteres.departamento == region)
    if ciudad:
        query = query.filter(PuntoInteres.ciudad == ciudad)
    if cadena:
        query = query.filter(PuntoInteres.cadena == cadena)
    if jerarquia_n2:
        query = query.filter(PuntoInteres.jerarquia_n2 == jerarquia_n2)
    if search:
        query = query.filter(
            PuntoInteres.nombre.ilike(f"%{search}%") |
            PuntoInteres.id.ilike(f"%{search}%")
        )
    return {"total": query.count()}


@router.get("/{point_id}", response_model=PuntoInteresResponse)
def get_point(
    point_id: str,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    punto = db.query(PuntoInteres).filter(PuntoInteres.id == point_id).first()
    if not punto:
        raise HTTPException(status_code=404, detail="Punto no encontrado")
    return punto


@router.delete("/{point_id}")
def delete_point(
    point_id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_analyst_or_admin),
):
    punto = db.query(PuntoInteres).filter(PuntoInteres.id == point_id).first()
    if not punto:
        raise HTTPException(status_code=404, detail="Punto no encontrado")
    nombre = getattr(punto, 'nombre', point_id)
    db.delete(punto)

    log_action(db, action="DELETE_POINT", entity_type="PuntoInteres",
               user_id=current_user.id, username=current_user.username, rol=current_user.rol,
               ip_address=request.client.host if request.client else None,
               entity_id=point_id, entity_name=nombre)
    db.commit()
    return {"message": "Punto eliminado"}


@router.put("/{point_id}", response_model=PuntoInteresResponse)
def update_point(
    point_id: str,
    data: PuntoInteresUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_analyst_or_admin),
):
    punto = db.query(PuntoInteres).filter(PuntoInteres.id == point_id).first()
    if not punto:
        raise HTTPException(status_code=404, detail="Punto no encontrado")
    changes = data.model_dump(exclude_none=True)
    for key, value in changes.items():
        setattr(punto, key, value)

    log_action(db, action="UPDATE_POINT", entity_type="PuntoInteres",
               user_id=current_user.id, username=current_user.username, rol=current_user.rol,
               ip_address=request.client.host if request.client else None,
               entity_id=point_id, entity_name=getattr(punto, 'nombre', point_id),
               changes=changes)
    db.commit()
    db.refresh(punto)
    return punto
