from sqlalchemy import Column, Integer, String, Boolean
from app.db.base import Base


class Cliente(Base):
    __tablename__ = "CLIENTES"

    id = Column("id_cliente", Integer, primary_key=True, index=True)
    nombre = Column("cliente", String(200), nullable=False)
