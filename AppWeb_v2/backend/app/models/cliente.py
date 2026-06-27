from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.db.base import Base
from sqlalchemy.orm import relationship

class Cliente(Base):
    __tablename__ = "CLIENTES"

    id = Column("id_cliente", Integer, primary_key=True, index=True)
    nombre = Column("cliente", String(200), nullable=False)

class CategoriaCliente(Base):
    __tablename__ = "CATEGORIAS_CLIENTES"

    id_categoria = Column(Integer, ForeignKey("CATEGORIAS.id_categoria"), primary_key=True)
    id_cliente = Column(Integer, ForeignKey("CLIENTES.id_cliente"), primary_key=True)

