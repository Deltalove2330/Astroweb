from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ChatMensajeCreate(BaseModel):
    visita_id: Optional[int] = None
    cliente_id: Optional[int] = None
    mensaje: str
    sender_type: Optional[str] = "usuario"
    sender_id: Optional[int] = None
    sender_nombre: Optional[str] = None


class ChatMensajeResponse(BaseModel):
    id: int
    visita_id: Optional[int] = None
    cliente_id: Optional[int] = None
    sender_type: Optional[str] = None
    sender_id: Optional[int] = None
    sender_nombre: Optional[str] = None
    mensaje: Optional[str] = None
    leido: Optional[bool] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
