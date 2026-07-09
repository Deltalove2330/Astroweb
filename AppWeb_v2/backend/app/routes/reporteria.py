from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date, timedelta
from app.db.session import get_db
from app.core.dependencies import get_current_user, require_analyst_or_admin
from app.models.user import Usuario
from app.models.visita import Visita
from app.models.foto import Foto
from app.models.ruta import RutaActivada
from app.models.punto import PuntoInteres

router = APIRouter(prefix="/api/reports", tags=["Reportería"])


@router.get("/summary")
def get_report_summary(
    fecha_inicio: Optional[date] = None,
    fecha_fin: Optional[date] = None,
    ruta_id: Optional[int] = None,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_analyst_or_admin),
):
    if not fecha_inicio:
        fecha_inicio = date.today() - timedelta(days=30)
    if not fecha_fin:
        fecha_fin = date.today()

    query = db.query(Visita).filter(
        Visita.fecha >= fecha_inicio,
        Visita.fecha <= fecha_fin,
    )
    if ruta_id:
        query = query.filter(Visita.ruta_id == ruta_id)

    visitas = query.all()
    total = len(visitas)
    completadas = sum(1 for v in visitas if v.estado == "completada")
    pendientes = sum(1 for v in visitas if v.estado == "pendiente")

    visita_ids = [v.id for v in visitas]
    fotos = db.query(Foto).filter(Foto.visita_id.in_(visita_ids)).all() if visita_ids else []
    fotos_aprobadas = sum(1 for f in fotos if f.estado == "aprobada")
    fotos_rechazadas = sum(1 for f in fotos if f.estado == "rechazada")
    fotos_pendientes = sum(1 for f in fotos if f.estado == "pendiente")

    return {
        "periodo": {"inicio": str(fecha_inicio), "fin": str(fecha_fin)},
        "visitas": {
            "total": total,
            "completadas": completadas,
            "pendientes": pendientes,
            "porcentaje_completadas": round(completadas / total * 100, 1) if total > 0 else 0,
        },
        "fotos": {
            "total": len(fotos),
            "aprobadas": fotos_aprobadas,
            "rechazadas": fotos_rechazadas,
            "pendientes": fotos_pendientes,
        },
    }


@router.get("/chart-data")
def get_chart_data(
    tipo: str = "visitas_por_dia",
    fecha_inicio: Optional[date] = None,
    fecha_fin: Optional[date] = None,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_analyst_or_admin),
):
    if not fecha_inicio:
        fecha_inicio = date.today() - timedelta(days=30)
    if not fecha_fin:
        fecha_fin = date.today()

    if tipo == "visitas_por_dia":
        from sqlalchemy import func
        results = db.query(
            Visita.fecha,
            func.count(Visita.id).label("total"),
        ).filter(
            Visita.fecha >= fecha_inicio,
            Visita.fecha <= fecha_fin,
        ).group_by(Visita.fecha).order_by(Visita.fecha).all()

        return {
            "labels": [str(r.fecha) for r in results],
            "data": [r.total for r in results],
            "title": "Visitas por Día",
        }

    elif tipo == "fotos_por_estado":
        from sqlalchemy import func
        results = db.query(
            Foto.estado,
            func.count(Foto.id).label("total"),
        ).group_by(Foto.estado).all()

        return {
            "labels": [r.estado for r in results],
            "data": [r.total for r in results],
            "title": "Fotos por Estado",
        }

    return {"labels": [], "data": [], "title": tipo}


@router.get("/activated-routes")
def get_activated_routes(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    today = date.today()
    activadas = db.query(RutaActivada).filter(RutaActivada.fecha == today).all()
    return [{"ruta_id": a.ruta_id, "cedula": a.mercaderista_cedula, "hora": str(a.activada_at)} for a in activadas]
