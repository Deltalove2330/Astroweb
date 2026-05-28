from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base


class Categoria(Base):
    __tablename__ = "CATEGORIAS"

    id = Column("id_categoria", Integer, primary_key=True, index=True)
    nombre = Column(String(200), nullable=True)
    activa = Column(Boolean, default=True)


class Producto(Base):
    __tablename__ = "PRODUCTS"

    id = Column("ID_PRODUCT", Integer, primary_key=True, index=True)
    nombre = Column("SKUs", String(300), nullable=False, unique=True)
    categoria = Column("Categoria", String(200), nullable=True)
    fabricante = Column("Fabricante", String(200), nullable=True)
    id_fabricante = Column("ID_FABRICANTE", Integer, nullable=True)
    tipo_servicio = Column("Tipo_de_servicio", String(200), nullable=True)
    tipo_fabricante = Column("Tipo_de_fabricante", String(200), nullable=True)
    cod_bar = Column("cod_bar", String(100), nullable=True)
    inagotable = Column("inagotable", Boolean, default=False)

    activaciones = relationship("Activacion", back_populates="producto")
