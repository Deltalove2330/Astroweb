from fastapi import APIRouter, Depends, HTTPException, status, Request
from app.services.audit_service import log_action
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.db.session import get_db
from app.core.dependencies import get_current_user, require_roles
from app.models.user import Usuario
from app.models.punto import PuntoInteres
from app.models.producto import Producto, Categoria
from app.models.solicitud import Solicitud
from app.schemas.cliente import PuntoInteresCreate, PuntoInteresUpdate, PuntoInteresResponse
from app.schemas.producto import ProductoCreate, ProductoUpdate, ProductoResponse, ProductoListResponse, CategoriaResponse

router = APIRouter(prefix="/api/atencion-cliente", tags=["Atención al Cliente"])


@router.get("/pdv", response_model=List[PuntoInteresResponse])
def list_pdv(
    activo: Optional[bool] = None,
    region: Optional[str] = None,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    query = db.query(PuntoInteres)
    if activo is not None:
        query = query.filter(PuntoInteres.activo == activo)
    if region:
        query = query.filter(PuntoInteres.departamento == region)
    return query.limit(500).all()


@router.post("/pdv", response_model=PuntoInteresResponse, status_code=201)
def create_pdv(
    data: PuntoInteresCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    punto = PuntoInteres(**data.model_dump())
    db.add(punto)
    db.commit()
    db.refresh(punto)
    return punto


@router.get("/pdv/{punto_id}", response_model=PuntoInteresResponse)
def get_pdv(punto_id: str, db: Session = Depends(get_db), _: Usuario = Depends(get_current_user)):
    punto = db.query(PuntoInteres).filter(PuntoInteres.id == punto_id).first()
    if not punto:
        raise HTTPException(status_code=404, detail="PDV no encontrado")
    return punto


@router.put("/pdv/{punto_id}", response_model=PuntoInteresResponse)
def update_pdv(
    punto_id: str,
    data: PuntoInteresUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    punto = db.query(PuntoInteres).filter(PuntoInteres.id == punto_id).first()
    if not punto:
        raise HTTPException(status_code=404, detail="PDV no encontrado")
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(punto, k, v)
    db.commit()
    db.refresh(punto)
    return punto


@router.delete("/pdv/{punto_id}")
def delete_pdv(punto_id: str, db: Session = Depends(get_db), _: Usuario = Depends(get_current_user)):
    punto = db.query(PuntoInteres).filter(PuntoInteres.id == punto_id).first()
    if not punto:
        raise HTTPException(status_code=404, detail="PDV no encontrado")
    punto.activo = False
    db.commit()
    return {"message": "PDV desactivado"}



# ==================== PRODUCTOS ====================

@router.get("/productos", response_model=ProductoListResponse)
def list_productos(
    skip: int = 0,
    limit: int = 25,
    busqueda: Optional[str] = None,
    categoria: Optional[str] = None,
    fabricante: Optional[str] = None,
    tipo_servicio: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin")),

):
    """
    Listar productos con paginación y búsqueda full-text.
    Solo accesible para usuarios con rol 'Administrador'.
    
    - skip: Número de productos a saltar (para paginación)
    - limit: Cantidad de productos por página (default 25)
    - busqueda: Busca en SKU, Fabricante y nombre del producto
    - categoria: Filtro por categoría exacta
    - fabricante: Filtro por fabricante exacto
    - tipo_servicio: Filtro por tipo de servicio
    """
    query = db.query(Producto)
    
    # Búsqueda full-text
    if busqueda:
        search_term = f"%{busqueda}%"
        query = query.filter(
            (Producto.nombre.ilike(search_term)) |
            (Producto.fabricante.ilike(search_term))
        )
    
    # Filtros exactos
    if categoria:
        query = query.filter(Producto.categoria == categoria)
    if fabricante:
        query = query.filter(Producto.fabricante == fabricante)
    if tipo_servicio:
        query = query.filter(Producto.tipo_servicio == tipo_servicio)
    
    # Contar total ANTES de aplicar paginación
    total = query.count()
    
    # Aplicar paginación
    items = query.order_by(Producto.id).offset(skip).limit(limit).all()

    
    # Calcular página actual (1-indexed)
    pagina = (skip // limit) + 1 if limit > 0 else 1
    
    return {
        "total": total,
        "pagina": pagina,
        "items": items
    }


@router.get("/productos/{producto_id}", response_model=ProductoResponse)
def get_producto(
    producto_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin")),
):
    """Obtener un producto específico por ID."""
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


@router.post("/productos", response_model=ProductoResponse, status_code=201)
def create_producto(
    data: ProductoCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin")),
):
    if not data.nombre or data.nombre.strip() == "":
        raise HTTPException(status_code=400, detail="SKU (nombre) es requerido")
    existente = db.query(Producto).filter(Producto.nombre == data.nombre).first()
    if existente:
        raise HTTPException(status_code=400, detail="SKU ya existe")
    producto = Producto(**data.model_dump())
    db.add(producto)
    db.flush()
    log_action(db, action="CREATE_PRODUCT", entity_type="Producto",
               user_id=current_user.id, username=current_user.username, rol=current_user.rol,
               ip_address=request.client.host if request.client else None,
               entity_id=producto.id, entity_name=data.nombre,
               changes=data.model_dump())
    db.commit()
    db.refresh(producto)
    from app.services.realtime import notify_event
    notify_event("product.created", {"id": producto.id, "nombre": producto.nombre})
    return producto


@router.put("/productos/{producto_id}", response_model=ProductoResponse)
def update_producto(
    producto_id: int,
    data: ProductoUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin")),
):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    if data.nombre and data.nombre.strip() == "":
        raise HTTPException(status_code=400, detail="SKU no puede estar vacío")
    if data.nombre and data.nombre != producto.nombre:
        existente = db.query(Producto).filter(Producto.nombre == data.nombre).first()
        if existente:
            raise HTTPException(status_code=400, detail="SKU ya existe")
    changes = data.model_dump(exclude_none=True)
    for k, v in changes.items():
        setattr(producto, k, v)
    log_action(db, action="UPDATE_PRODUCT", entity_type="Producto",
               user_id=current_user.id, username=current_user.username, rol=current_user.rol,
               ip_address=request.client.host if request.client else None,
               entity_id=producto_id, entity_name=producto.nombre, changes=changes)
    db.commit()
    db.refresh(producto)
    from app.services.realtime import notify_event
    notify_event("product.updated", {"id": producto.id, "nombre": producto.nombre})
    return producto


@router.delete("/productos/{producto_id}")
def delete_producto(
    producto_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin")),
):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    nombre = producto.nombre
    db.delete(producto)
    log_action(db, action="DELETE_PRODUCT", entity_type="Producto",
               user_id=current_user.id, username=current_user.username, rol=current_user.rol,
               ip_address=request.client.host if request.client else None,
               entity_id=producto_id, entity_name=nombre)
    db.commit()
    from app.services.realtime import notify_event
    notify_event("product.deleted", {"id": producto_id})
    return {"success": True, "message": "Producto eliminado correctamente"}


@router.get("/productos/listado/categorias", response_model=list[str])
def list_categorias_productos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin")),

):
    """Obtener lista de categorías únicas."""
    categorias = db.query(Producto.categoria).distinct().filter(Producto.categoria.isnot(None)).all()
    return [c[0] for c in categorias]


@router.get("/productos/listado/fabricantes", response_model=list[str])
def list_fabricantes_productos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin")),

):
    """Obtener lista de fabricantes únicos."""
    fabricantes = db.query(Producto.fabricante).distinct().filter(Producto.fabricante.isnot(None)).all()
    return [f[0] for f in fabricantes]


@router.get("/productos/listado/tipos-servicio", response_model=list[str])
def list_tipos_servicio_productos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin")),

):
    """Obtener lista de tipos de servicio únicos."""
    tipos = db.query(Producto.tipo_servicio).distinct().filter(Producto.tipo_servicio.isnot(None)).all()
    return [t[0] for t in tipos]


@router.get("/productos/listado/tipos-fabricante", response_model=list[str])
def list_tipos_fabricante_productos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin")),

):
    """Obtener lista de tipos de fabricante únicos."""
    tipos = db.query(Producto.tipo_fabricante).distinct().filter(Producto.tipo_fabricante.isnot(None)).all()
    return [t[0] for t in tipos]


# ==================== CATEGORÍAS ====================

@router.get("/categorias", response_model=List[CategoriaResponse])
def list_categorias(db: Session = Depends(get_db), _: Usuario = Depends(get_current_user)):
    return db.query(Categoria).limit(100).all()


@router.get("/solicitudes")
def get_solicitudes(
    estado: Optional[str] = None,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    query = db.query(Solicitud)
    if estado:
        query = query.filter(Solicitud.estado == estado)
    return query.order_by(Solicitud.created_at.desc()).limit(100).all()


import json
from app.models.encuestador import CentroSalud

@router.post("/solicitudes/{sol_id}/aprobar")
def aprobar_solicitud(
    sol_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    sol = db.query(Solicitud).filter(Solicitud.id == sol_id).first()
    if not sol:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    
    if sol.estado == "aprobada":
        raise HTTPException(status_code=400, detail="La solicitud ya estaba aprobada")

    if sol.tipo == "creacion_centro_salud":
        datos = json.loads(sol.descripcion) if sol.descripcion else {}
        nuevo_centro = CentroSalud(
            nombre_centro=datos.get("nombre_centro", ""),
            direccion_completa=datos.get("direccion_completa", ""),
            ciudad=datos.get("ciudad"),
            estado=datos.get("estado")
        )
        db.add(nuevo_centro)
        
    sol.estado = "aprobada"
    db.commit()
    return {"message": "Solicitud aprobada"}


@router.post("/solicitudes/{sol_id}/rechazar")
def rechazar_solicitud(
    sol_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    sol = db.query(Solicitud).filter(Solicitud.id == sol_id).first()
    if not sol:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    sol.estado = "rechazada"
    db.commit()
    return {"message": "Solicitud rechazada"}
