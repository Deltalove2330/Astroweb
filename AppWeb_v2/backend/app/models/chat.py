from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base


class ChatMensaje(Base):
    __tablename__ = "CHAT_MENSAJES_CLIENTE"

    id = Column("id_mensaje", Integer, primary_key=True, index=True)
    visita_id = Column("id_visita", Integer, ForeignKey("VISITAS_MERCADERISTA.id_visita"), nullable=True)
    cliente_id = Column("id_cliente", Integer, ForeignKey("CLIENTES.id_cliente"), nullable=True)
    sender_id = Column("id_usuario", Integer, nullable=True)
    sender_nombre = Column("username", String(255), nullable=True)
    mensaje = Column(Text, nullable=True)
    sender_type = Column("tipo_mensaje", String(50), nullable=True)
    leido = Column("visto", Boolean, default=False)
    created_at = Column("fecha_envio", DateTime, nullable=True)
    metadata_json = Column("metadata", String(1000), nullable=True)

    visita = relationship("Visita", back_populates="mensajes_chat")
