from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import Usuario
from app.models.cliente import Cliente
from app.schemas.cliente import ClienteResponse

router = APIRouter(prefix="/api/clients", tags=["Clientes"])


@router.get("/", response_model=List[ClienteResponse])
def list_clients(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return db.query(Cliente).order_by(Cliente.nombre).all()


@router.get("/{client_id}", response_model=ClienteResponse)
def get_client(client_id: int, db: Session = Depends(get_db), _: Usuario = Depends(get_current_user)):
    cliente = db.query(Cliente).filter(Cliente.id == client_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente

from app.schemas.cliente import ClienteCreate, ClienteUpdate
from app.core.dependencies import require_admin
from fastapi import status

@router.post("/", response_model=ClienteResponse, status_code=status.HTTP_201_CREATED)
def create_client(
    data: ClienteCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    cliente = Cliente(**data.model_dump())
    db.add(cliente)
    db.commit()
    db.refresh(cliente)
    return cliente

@router.put("/{client_id}", response_model=ClienteResponse)
def update_client(
    client_id: int,
    data: ClienteUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    cliente = db.query(Cliente).filter(Cliente.id == client_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    update_data = data.model_dump(exclude_none=True)
    for key, value in update_data.items():
        setattr(cliente, key, value)
    
    db.commit()
    db.refresh(cliente)
    return cliente

@router.delete("/{client_id}")
def delete_client(
    client_id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    cliente = db.query(Cliente).filter(Cliente.id == client_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    db.delete(cliente)
    db.commit()
    return {"message": "Cliente eliminado"}
