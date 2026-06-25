from pydantic import BaseModel
from typing import Optional, List
from datetime import date


class RutaBase(BaseModel):
    nombre: Optional[str] = None
    servicio: Optional[str] = None
    id_analista: Optional[int] = None
    coordinador_1: Optional[str] = None
    coordinador_2: Optional[str] = None
    supervisor: Optional[str] = None
    cuadrante: Optional[str] = None


class RutaCreate(RutaBase):
    tipo: str


class RutaUpdate(BaseModel):
    nombre: Optional[str] = None
    servicio: Optional[str] = None
    id_analista: Optional[int] = None
    coordinador_1: Optional[str] = None
    coordinador_2: Optional[str] = None
    cuadrante: Optional[str] = None


class RutaResponse(RutaBase):
    id: int
    activa: bool = True

    class Config:
        from_attributes = True


class RutaProgramacionBase(BaseModel):
    ruta_id: int
    punto_id: Optional[str] = None
    dia: Optional[str] = None
    activo: bool = True
    id_cliente: Optional[int] = None
    prioridad: Optional[str] = None


class RutaProgramacionCreate(RutaProgramacionBase):
    pass


class RutaProgramacionResponse(RutaProgramacionBase):
    id: int
    punto: Optional["PuntoResponse"] = None
    cliente: Optional["ClienteResponse"] = None

    class Config:
        from_attributes = True


from app.schemas.punto import PuntoResponse
from app.schemas.cliente import ClienteResponse
RutaProgramacionResponse.model_rebuild()


class CambioFuturoResponse(BaseModel):
    id: int
    ruta_id: int
    id_programacion: Optional[int] = None
    punto_interes_nombre: Optional[str] = None
    cliente_nombre: Optional[str] = None
    dia: Optional[str] = None
    prioridad: Optional[str] = None
    tipo_cambio: Optional[str] = None
    fecha_ejecucion: Optional[date] = None
    estado: Optional[str] = None
    observaciones: Optional[str] = None
    creado_por: Optional[str] = None

    class Config:
        from_attributes = True


class AddPointToRouteRequest(BaseModel):
    punto_id: str
    client_id: int
    dia: str
    priority: str


class UpdatePointsRequest(BaseModel):
    puntos: List[dict]


class ScheduleChangeRequest(BaseModel):
    id_programacion: Optional[int] = None
    id_punto_interes: Optional[str] = None
    punto_interes_nombre: Optional[str] = None
    id_cliente: Optional[int] = None
    cliente_nombre: Optional[str] = None
    dia: Optional[str] = None
    prioridad: Optional[str] = None
    tipo_cambio: str = "modificacion"
    fecha_ejecucion: date
    observaciones: Optional[str] = None
