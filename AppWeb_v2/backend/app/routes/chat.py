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

from sqlalchemy import text
from datetime import datetime

@router.get("/inbox")
def get_chat_inbox(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    # Obtener el cliente_id si el usuario es cliente
    cliente_id = current_user.id_perfil if current_user.is_client else None
    
    query_str = """
        SELECT 
            cm.id_visita, 
            MAX(cm.fecha_envio) as last_message_date,
            (SELECT TOP 1 mensaje FROM CHAT_MENSAJES_CLIENTE WHERE id_visita = cm.id_visita ORDER BY fecha_envio DESC) as last_message,
            p.punto_de_interes as punto_nombre,
            p.identificador as punto_id,
            v.fecha_visita
        FROM CHAT_MENSAJES_CLIENTE cm
        JOIN VISITAS_MERCADERISTA v ON cm.id_visita = v.id_visita
        LEFT JOIN PUNTOS_INTERES1 p ON v.identificador_punto_interes = p.identificador
    """
    params = {}
    if cliente_id:
        query_str += " WHERE cm.id_cliente = :cliente_id"
        params["cliente_id"] = cliente_id
        
    query_str += """
        GROUP BY cm.id_visita, p.punto_de_interes, p.identificador, v.fecha_visita
        ORDER BY last_message_date DESC
    """
    
    rows = db.execute(text(query_str), params).fetchall()
    
    inbox = []
    for row in rows:
        inbox.append({
            "visita_id": row.id_visita,
            "punto_nombre": row.punto_nombre or "Punto Desconocido",
            "punto_id": row.punto_id,
            "fecha_visita": str(row.fecha_visita) if row.fecha_visita else None,
            "last_message": row.last_message,
            "last_message_date": str(row.last_message_date) if row.last_message_date else None,
            "unread_count": 0  # To be implemented if needed
        })
    return inbox


@router.get("/search-visits")
def search_chat_visits(
    q: str,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    cliente_id = current_user.id_perfil if current_user.is_client else None
    
    query_str = """
        SELECT TOP 50
            v.id_visita, 
            p.punto_de_interes as punto_nombre,
            p.identificador as punto_id,
            p.jerarquia_nivel_2 as cadena,
            p.jerarquia_nivel_2_2 as region,
            v.fecha_visita,
            m.nombre as mercaderista_nombre
        FROM VISITAS_MERCADERISTA v
        LEFT JOIN PUNTOS_INTERES1 p ON v.identificador_punto_interes = p.identificador
        LEFT JOIN MERCADERISTAS m ON v.id_mercaderista = m.id_mercaderista
        WHERE 1=1
    """
    params = {}
    if cliente_id:
        query_str += " AND v.id_cliente = :cliente_id"
        params["cliente_id"] = cliente_id
        
    if q:
        query_str += """ AND (
            CAST(v.id_visita AS VARCHAR) LIKE :q OR
            p.punto_de_interes LIKE :q OR
            p.jerarquia_nivel_2 LIKE :q OR
            p.jerarquia_nivel_2_2 LIKE :q OR
            m.nombre LIKE :q
        )"""
        params["q"] = f"%{q}%"
        
    query_str += " ORDER BY v.fecha_visita DESC"
    
    rows = db.execute(text(query_str), params).fetchall()
    
    results = []
    for row in rows:
        results.append({
            "visita_id": row.id_visita,
            "punto_nombre": row.punto_nombre or "Punto Desconocido",
            "punto_id": row.punto_id,
            "cadena": row.cadena,
            "region": row.region,
            "mercaderista_nombre": row.mercaderista_nombre,
            "fecha_visita": str(row.fecha_visita) if row.fecha_visita else None,
            "last_message": "Nueva Conversación",
            "last_message_date": str(row.fecha_visita) if row.fecha_visita else None,
            "unread_count": 0
        })
    return results


@router.get("/visit/{visita_id}/messages", response_model=List[ChatMensajeResponse])
def get_messages_by_visit(
    visita_id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    mensajes = db.query(ChatMensaje).filter(
        ChatMensaje.visita_id == visita_id
    ).order_by(ChatMensaje.created_at).all()
    
    for msg in mensajes:
        if msg.sender_nombre and msg.sender_nombre.isdigit():
            from app.models.mercaderista import Mercaderista
            merc = db.query(Mercaderista).filter(Mercaderista.cedula == msg.sender_nombre).first()
            if merc and merc.nombre:
                msg.sender_nombre = merc.nombre
                
    return mensajes


@router.post("/send", response_model=ChatMensajeResponse, status_code=201)
def send_message(
    data: ChatMensajeCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    cliente_id = current_user.id_perfil if current_user.is_client else None
    if not cliente_id and data.cliente_id:
        cliente_id = data.cliente_id
        
    mensaje = ChatMensaje(
        visita_id=data.visita_id,
        cliente_id=cliente_id,
        sender_type="cliente" if current_user.is_client else "usuario",
        sender_id=current_user.id,
        sender_nombre=current_user.username,
        mensaje=data.mensaje,
        created_at=datetime.now()
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
                    cliente_id=data.get("cliente_id"),
                    sender_type=data.get("sender_type", "usuario"),
                    sender_id=data.get("sender_id"),
                    sender_nombre=data.get("sender_nombre"),
                    mensaje=data["mensaje"],
                    created_at=datetime.now()
                )
                db.add(mensaje)
                db.commit()
                db.refresh(mensaje)
                await manager.broadcast_to_room(f"chat_{room}", {
                    "id": mensaje.id,
                    "sender_id": mensaje.sender_id,
                    "sender_nombre": mensaje.sender_nombre,
                    "mensaje": mensaje.mensaje,
                    "created_at": str(mensaje.created_at),
                    "sender_type": mensaje.sender_type,
                })
            finally:
                db.close()
    except WebSocketDisconnect:
        manager.disconnect(websocket, f"chat_{room}")
