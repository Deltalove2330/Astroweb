from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import date
from app.db.session import get_db
from app.core.dependencies import get_current_user, require_analyst_or_admin
from app.models.user import Usuario
from app.models.visita import Visita
from app.models.foto import Foto, NotificacionRechazoFoto
from app.models.balance import Balance
from app.models.analista import AnalistaCliente
from app.schemas.visita import VisitaCreate, VisitaUpdate, VisitaResponse, UpdateBalancesRequest, BalanceResponse
from app.schemas.foto import FotoResponse, ApprovePhotosRequest, RejectPhotoRequest, SavePhotoDecisionsRequest
from app.services.audit_service import log_action
from datetime import datetime

router = APIRouter(prefix="/api/visits", tags=["Visitas"])


@router.get("/", response_model=List[VisitaResponse])
def list_visits(
    ruta_id: Optional[int] = None,
    fecha: Optional[date] = None,
    estado: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    query = db.query(Visita)
    if ruta_id:
        query = query.filter(Visita.ruta_id == ruta_id)
    if fecha:
        query = query.filter(Visita.fecha == fecha)
    if estado:
        query = query.filter(Visita.estado == estado)
    return query.order_by(Visita.fecha.desc()).all()


@router.post("/", response_model=VisitaResponse, status_code=201)
def create_visit(
    data: VisitaCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    visita = Visita(**data.model_dump())
    db.add(visita)
    db.commit()
    db.refresh(visita)
    return visita


@router.get("/pending", response_model=List[VisitaResponse])
def get_pending_visits(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_analyst_or_admin),
):
    today = date.today()
    return db.query(Visita).filter(
        Visita.fecha == today,
        Visita.estado.in_(["Pendiente", "En Progreso"]),
    ).options(joinedload(Visita.punto), joinedload(Visita.mercaderista)).all()


@router.get("/with-balances", response_model=List[VisitaResponse])
def get_visits_with_balances(
    fecha_inicio: Optional[date] = None,
    fecha_fin: Optional[date] = None,
    cliente_id: Optional[int] = None,
    mercaderista_id: Optional[int] = None,
    punto_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_analyst_or_admin),
):
    query = db.query(Visita).join(Balance, Visita.id == Balance.visita_id).distinct()

    if current_user.is_analyst and current_user.id_perfil:
        managed_clients = db.query(AnalistaCliente.id_cliente).filter(
            AnalistaCliente.id_analista == current_user.id_perfil
        ).all()
        managed_ids = [c[0] for c in managed_clients]
        query = query.filter(Balance.id_cliente.in_(managed_ids))

    if fecha_inicio:
        query = query.filter(Visita.fecha >= fecha_inicio)
    if fecha_fin:
        query = query.filter(Visita.fecha <= fecha_fin)
    if cliente_id:
        query = query.filter(Visita.id_cliente == cliente_id)
    if mercaderista_id:
        query = query.filter(Visita.mercaderista_id == mercaderista_id)
    if punto_id:
        query = query.filter(Visita.punto_id == punto_id)

    return query.options(
        joinedload(Visita.punto),
        joinedload(Visita.mercaderista),
        joinedload(Visita.cliente)
    ).order_by(Visita.fecha.desc()).all()


@router.get("/{visit_id}", response_model=VisitaResponse)
def get_visit(
    visit_id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    visita = db.query(Visita).filter(Visita.id == visit_id).first()
    if not visita:
        raise HTTPException(status_code=404, detail="Visita no encontrada")
    return visita


@router.patch("/{visit_id}", response_model=VisitaResponse)
def update_visit(
    visit_id: int,
    data: VisitaUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    visita = db.query(Visita).filter(Visita.id == visit_id).first()
    if not visita:
        raise HTTPException(status_code=404, detail="Visita no encontrada")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(visita, key, value)
    db.commit()
    db.refresh(visita)
    return visita


@router.get("/{visit_id}/photos", response_model=List[FotoResponse])
def get_visit_photos(
    visit_id: int,
    tipo: Optional[int] = None,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    query = db.query(Foto).filter(Foto.visita_id == visit_id)
    if tipo:
        query = query.filter(Foto.id_tipo_foto == tipo)
    return query.all()


def _assert_can_manage_photos(db: Session, current_user: Usuario, foto_ids: list[int]) -> None:
    """Admin/Analyst pueden todo. Cliente solo puede gestionar fotos de sus visitas."""
    if current_user.rol in ("admin", "analyst"):
        return
    if not current_user.is_client:
        raise HTTPException(status_code=403, detail="Acceso denegado")
    if not current_user.id_perfil:
        raise HTTPException(status_code=403, detail="Usuario cliente sin id_perfil")

    # Validar que TODAS las fotos pertenezcan a visitas del cliente.
    rows = (
        db.query(Foto.id, Visita.id_cliente)
        .join(Visita, Foto.visita_id == Visita.id)
        .filter(Foto.id.in_(foto_ids))
        .all()
    )
    if len(rows) != len(set(foto_ids)):
        raise HTTPException(status_code=404, detail="Alguna foto no existe")
    for foto_id, cliente_id in rows:
        if cliente_id != current_user.id_perfil:
            raise HTTPException(status_code=403, detail="No puedes gestionar fotos de otro cliente")


@router.post("/approve-photos")
def approve_photos(
    data: ApprovePhotosRequest,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    _assert_can_manage_photos(db, current_user, data.foto_ids)
    updated = db.query(Foto).filter(Foto.id.in_(data.foto_ids)).update(
        {"estado": "Aprobada"},
        synchronize_session=False,
    )
    log_action(db, action="APPROVE_PHOTOS", entity_type="Foto",
               user_id=current_user.id, username=current_user.username, rol=current_user.rol,
               changes={"foto_ids": data.foto_ids, "count": updated})
    db.commit()
    return {"updated": updated, "message": "Fotos aprobadas"}


@router.post("/reject-photo")
def reject_photo(
    data: RejectPhotoRequest,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    _assert_can_manage_photos(db, current_user, [data.foto_id])
    foto = db.query(Foto).filter(Foto.id == data.foto_id).first()
    if not foto:
        raise HTTPException(status_code=404, detail="Foto no encontrada")
    foto.estado = "Rechazada"

    visita = db.query(Visita).filter(Visita.id == foto.visita_id).first()
    merc_cedula = None
    if visita:
        from app.models.mercaderista import Mercaderista
        merc = db.query(Mercaderista).filter(Mercaderista.id == visita.mercaderista_id).first()
        if merc:
            merc_cedula = merc.cedula

    notif = NotificacionRechazoFoto(
        foto_id=foto.id,
        mercaderista_cedula=merc_cedula,
        descripcion=data.motivo,
    )
    db.add(notif)
    log_action(db, action="REJECT_PHOTO", entity_type="Foto",
               user_id=current_user.id, username=current_user.username, rol=current_user.rol,
               entity_id=foto.id, entity_name=foto.blob_path,
               changes={"motivo": data.motivo, "mercaderista": merc_cedula})
    db.commit()

    if merc_cedula:
        try:
            from app.services.notification_service import notify_photo_rejected
            notify_photo_rejected(db, merc_cedula, foto.id, data.motivo)
        except Exception:
            pass

    return {"message": "Foto rechazada", "foto_id": foto.id}


@router.post("/save-decisions")
def save_photo_decisions(
    data: SavePhotoDecisionsRequest,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_analyst_or_admin),
):
    for decision in data.decisions:
        foto_id = decision.get("foto_id")
        estado = decision.get("estado")
        foto = db.query(Foto).filter(Foto.id == foto_id).first()
        if foto and estado in ("Aprobada", "Rechazada"):
            foto.estado = estado
    db.commit()
    return {"message": "Decisiones guardadas"}





@router.get("/{visit_id}/balances", response_model=List[BalanceResponse])
def get_visit_balances(
    visit_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_analyst_or_admin),
):
    # Verificar que la visita pertenezca a un cliente manejado por el analista
    visita = db.query(Visita).filter(Visita.id == visit_id).first()
    if not visita:
        raise HTTPException(status_code=404, detail="Visita no encontrada")
    
    if current_user.is_analyst and current_user.id_perfil:
        is_managed = db.query(AnalistaCliente).filter(
            AnalistaCliente.id_analista == current_user.id_perfil,
            AnalistaCliente.id_cliente == visita.id_cliente
        ).first()
        if not is_managed:
            raise HTTPException(status_code=403, detail="No tiene permiso para ver esta visita")

    # Registrar inicio de modificación
    db.query(Balance).filter(Balance.visita_id == visit_id).update(
        {"fecha_inicio_modificacion": datetime.now()},
        synchronize_session=False
    )
    db.commit()
    
    return db.query(Balance).filter(Balance.visita_id == visit_id).all()


@router.post("/update-balances")
def update_balances(
    data: UpdateBalancesRequest,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_analyst_or_admin),
):
    for item in data.balances:
        db.query(Balance).filter(Balance.id == item.id_balance).update({
            "inv_inicial": item.inv_inicial,
            "inv_final": item.inv_final,
            "inv_deposito": item.inv_deposito,
            "caras": item.caras,
            "precio_bs": item.precio_bs,
            "precio_ds": item.precio_ds,
            "fecha_modificacion": datetime.now()
        }, synchronize_session=False)
    
    db.commit()
    return {"message": "Balances actualizados correctamente"}
