import json
import logging
from datetime import date
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.ruta import RutaCambioFuturo, RutaProgramacion
from app.core.config import settings

logger = logging.getLogger(__name__)
scheduler = BackgroundScheduler(timezone=settings.SCHEDULER_TIMEZONE)


def ejecutar_cambios_futuros():
    db: Session = SessionLocal()
    try:
        hoy = date.today()
        cambios = db.query(RutaCambioFuturo).filter(
            RutaCambioFuturo.estado == "PENDIENTE",
            RutaCambioFuturo.fecha_programada <= hoy,
        ).all()

        for cambio in cambios:
            try:
                _ejecutar_cambio(db, cambio)
                cambio.estado = "EJECUTADO"
                db.commit()
                logger.info(f"Cambio {cambio.id} ejecutado exitosamente")
            except Exception as e:
                db.rollback()
                logger.error(f"Error ejecutando cambio {cambio.id}: {e}")
    finally:
        db.close()


def _ejecutar_cambio(db: Session, cambio: RutaCambioFuturo):
    params = json.loads(cambio.parametros) if cambio.parametros else {}

    if cambio.tipo_cambio == "INSERT":
        prog = RutaProgramacion(
            ruta_id=cambio.ruta_id,
            punto_id=cambio.punto_id,
            dia=params.get("dia"),
            prioridad=params.get("prioridad", 0),
            estado=True,
        )
        db.add(prog)

    elif cambio.tipo_cambio == "UPDATE":
        prog = db.query(RutaProgramacion).filter(
            RutaProgramacion.ruta_id == cambio.ruta_id,
            RutaProgramacion.punto_id == cambio.punto_id,
        ).first()
        if prog:
            for key, value in params.items():
                setattr(prog, key, value)

    elif cambio.tipo_cambio == "DELETE":
        prog = db.query(RutaProgramacion).filter(
            RutaProgramacion.ruta_id == cambio.ruta_id,
            RutaProgramacion.punto_id == cambio.punto_id,
        ).first()
        if prog:
            db.delete(prog)


def start_scheduler():
    scheduler.add_job(
        ejecutar_cambios_futuros,
        trigger=IntervalTrigger(minutes=settings.SCHEDULER_INTERVAL_MINUTES),
        id="ejecutar_cambios_futuros",
        replace_existing=True,
        max_instances=1,
    )
    scheduler.start()
    logger.info("Scheduler iniciado")


def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown(wait=False)
