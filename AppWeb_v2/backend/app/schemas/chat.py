from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ChatMensajeCreate(BaseModel):
    visita_id: Optional[int] = None
    foto_id: Optional[int] = None
    mensaje: str
    sender_type: Optional[str] = None
    sender_id: Optional[int] = None


class ChatMensajeResponse(BaseModel):
    id: int
    visita_id: Optional[int] = None
    foto_id: Optional[int] = None
    sender_type: Optional[str] = None
    sender_id: Optional[int] = None
    mensaje: Optional[str] = None
    leido: Optional[bool] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
