from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db, SessionLocal
from app.core.dependencies import get_current_user
from app.models.user import Usuario
from app.models.chat import ChatMensaje
from app.schemas.chat import ChatMensajeCreate, ChatMensajeResponse
from app.websockets.manager import manager

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.get("/messages/{foto_id}", response_model=List[ChatMensajeResponse])
def get_messages_by_photo(
    foto_id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return db.query(ChatMensaje).filter(
        ChatMensaje.foto_id == foto_id
    ).order_by(ChatMensaje.created_at).all()


@router.get("/visit/{visita_id}/messages", response_model=List[ChatMensajeResponse])
def get_messages_by_visit(
    visita_id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return db.query(ChatMensaje).filter(
        ChatMensaje.visita_id == visita_id
    ).order_by(ChatMensaje.created_at).all()


@router.post("/send", response_model=ChatMensajeResponse, status_code=201)
def send_message(
    data: ChatMensajeCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    mensaje = ChatMensaje(
        visita_id=data.visita_id,
        foto_id=data.foto_id,
        sender_type=data.sender_type,
        sender_id=data.sender_id or current_user.id,
        mensaje=data.mensaje,
    )
    db.add(mensaje)
    db.commit()
    db.refresh(mensaje)
    return mensaje


@router.websocket("/ws/{room}")
async def websocket_chat(websocket: WebSocket, room: str):
    await manager.connect(websocket, f"chat_{room}")
    try:
        while True:
            data = await websocket.receive_json()
            db = SessionLocal()
            try:
                mensaje = ChatMensaje(
                    visita_id=data.get("visita_id"),
                    foto_id=data.get("foto_id"),
                    sender_type=data.get("sender_type", "user"),
                    sender_id=data.get("sender_id"),
                    mensaje=data["mensaje"],
                )
                db.add(mensaje)
                db.commit()
                db.refresh(mensaje)
                await manager.broadcast_to_room(f"chat_{room}", {
                    "id": mensaje.id,
                    "sender_id": mensaje.sender_id,
                    "mensaje": mensaje.mensaje,
                    "created_at": str(mensaje.created_at),
                    "sender_type": mensaje.sender_type,
                })
            finally:
                db.close()
    except WebSocketDisconnect:
        manager.disconnect(websocket, f"chat_{room}")
