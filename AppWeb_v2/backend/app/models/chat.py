from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base


class ChatMensaje(Base):
    __tablename__ = "CHAT_FOTOS_MENSAJES"

    id = Column("id_mensaje", Integer, primary_key=True, index=True)
    visita_id = Column("id_visita", Integer, ForeignKey("VISITAS_MERCADERISTA.id_visita"), nullable=True)
    foto_id = Column(Integer, ForeignKey("FOTOS_TOTALES.id_foto"), nullable=True)
    sender_type = Column("tipo_usuario", String(50), nullable=True)
    sender_id = Column("id_usuario", Integer, nullable=True)
    mensaje = Column(Text, nullable=True)
    blob_path = Column("file_path", String(500), nullable=True)
    leido = Column(Boolean, default=False)
    created_at = Column("fecha_mensaje", DateTime, nullable=True)

    visita = relationship("Visita", back_populates="mensajes_chat")
    foto = relationship("Foto", back_populates="mensajes_chat")
