"""Inicialización de catálogos: crea tablas y semilla con valores existentes en PUNTOS_INTERES1."""
import logging
from sqlalchemy import inspect
from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.catalogo import (
    TipoNegocio, SubtipoNegocio, Alcance, CanalVenta, Departamento, Ciudad,
)
from app.models.punto import PuntoInteres

logger = logging.getLogger("app")

CATALOG_TABLES = [
    "CAT_TIPO_NEGOCIO",
    "CAT_SUBTIPO_NEGOCIO",
    "CAT_ALCANCE",
    "CAT_CANAL_VENTA",
    "CAT_DEPARTAMENTOS",
    "CAT_CIUDADES",
]


def ensure_catalog_tables() -> None:
    """Crea las tablas de catálogo si no existen, y siembra con valores distintos
    de PUNTOS_INTERES1 la primera vez."""
    inspector = inspect(engine)
    existing = set(inspector.get_table_names())
    missing = [t for t in CATALOG_TABLES if t not in existing]

    if missing:
        logger.info(f"Creando tablas de catálogo: {missing}")
        # Crear sólo los modelos que faltan
        tables_to_create = [
            t for t in Base.metadata.sorted_tables if t.name in missing
        ]
        Base.metadata.create_all(bind=engine, tables=tables_to_create)
        logger.info("Tablas de catálogo creadas")

    _seed_from_existing_pdv()


def _seed_from_existing_pdv() -> None:
    """Si una tabla de catálogo está vacía, la rellena con los DISTINCT
    de la columna correspondiente en PUNTOS_INTERES1."""
    db = SessionLocal()
    try:
        seed_map = [
            (TipoNegocio, PuntoInteres.jerarquia_n2),
            (SubtipoNegocio, PuntoInteres.jerarquia_n2_2),
            (Alcance, PuntoInteres.nivel_de_alcance),
            (CanalVenta, PuntoInteres.cadena),
            (Departamento, PuntoInteres.departamento),
        ]
        for Model, column in seed_map:
            if db.query(Model).count() > 0:
                continue
            distinct_values = (
                db.query(column).filter(column.isnot(None)).distinct().all()
            )
            seeded = 0
            for (val,) in distinct_values:
                if not val:
                    continue
                val = val.strip()
                if not val:
                    continue
                if not db.query(Model).filter(Model.nombre == val).first():
                    db.add(Model(nombre=val, activo=True))
                    seeded += 1
            if seeded:
                db.commit()
                logger.info(f"Sembrado {Model.__tablename__} con {seeded} valores")

        # Ciudades: necesita asociar con departamento
        if db.query(Ciudad).count() == 0:
            departamentos = {d.nombre: d.id for d in db.query(Departamento).all()}
            pares = (
                db.query(PuntoInteres.ciudad, PuntoInteres.departamento)
                .filter(PuntoInteres.ciudad.isnot(None))
                .filter(PuntoInteres.departamento.isnot(None))
                .distinct()
                .all()
            )
            seeded = 0
            seen: set[tuple[int, str]] = set()
            sin_dep = 0
            for ciudad_name, dep_name in pares:
                if not ciudad_name or not dep_name:
                    continue
                ciudad_name = ciudad_name.strip()
                dep_name = dep_name.strip()
                dep_id = departamentos.get(dep_name)
                if not dep_id:
                    sin_dep += 1
                    continue
                key = (dep_id, ciudad_name)
                if key in seen:
                    continue
                seen.add(key)
                db.add(Ciudad(nombre=ciudad_name, departamento_id=dep_id, activo=True))
                seeded += 1
            if seeded:
                db.commit()
                logger.info(f"Sembrado CAT_CIUDADES con {seeded} valores ({sin_dep} ignoradas sin departamento)")
    except Exception as e:
        logger.exception(f"Error sembrando catálogos: {e}")
        db.rollback()
    finally:
        db.close()
