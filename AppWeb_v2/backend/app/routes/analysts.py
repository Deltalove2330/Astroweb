from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.core.dependencies import require_admin, get_current_user
from app.models.analista import Analista
from app.models.user import Usuario
from app.schemas.analista import AnalistaCreate, AnalistaUpdate, AnalistaResponse

router = APIRouter(prefix="/api/analysts", tags=["Analistas"])

@router.get("/", response_model=List[AnalistaResponse])
def list_analysts(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return db.query(Analista).order_by(Analista.nombre).all()

@router.get("/{analyst_id}", response_model=AnalistaResponse)
def get_analyst(analyst_id: int, db: Session = Depends(get_db), _: Usuario = Depends(get_current_user)):
    analyst = db.query(Analista).filter(Analista.id == analyst_id).first()
    if not analyst:
        raise HTTPException(status_code=404, detail="Analista no encontrado")
    return analyst

@router.post("/", response_model=AnalistaResponse, status_code=status.HTTP_201_CREATED)
def create_analyst(
    data: AnalistaCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    analyst = Analista(**data.model_dump())
    db.add(analyst)
    db.commit()
    db.refresh(analyst)
    return analyst

@router.put("/{analyst_id}", response_model=AnalistaResponse)
def update_analyst(
    analyst_id: int,
    data: AnalistaUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    analyst = db.query(Analista).filter(Analista.id == analyst_id).first()
    if not analyst:
        raise HTTPException(status_code=404, detail="Analista no encontrado")
    
    update_data = data.model_dump(exclude_none=True)
    for key, value in update_data.items():
        setattr(analyst, key, value)
    
    db.commit()
    db.refresh(analyst)
    return analyst

@router.delete("/{analyst_id}")
def delete_analyst(
    analyst_id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    analyst = db.query(Analista).filter(Analista.id == analyst_id).first()
    if not analyst:
        raise HTTPException(status_code=404, detail="Analista no encontrado")
    db.delete(analyst)
    db.commit()
    return {"message": "Analista eliminado"}
