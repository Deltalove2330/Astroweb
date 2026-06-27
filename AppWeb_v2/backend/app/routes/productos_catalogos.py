from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.core.dependencies import get_current_user, require_analyst_or_admin
from app.models.user import Usuario
from app.models.producto import Categoria, SubCategoria, Producto
from app.schemas.producto_catalogo import (
    CategoriaCreate, CategoriaUpdate, CategoriaResponse,
    SubCategoriaCreate, SubCategoriaUpdate, SubCategoriaResponse
)

router = APIRouter(prefix="/api/productos-catalogos", tags=["Catálogos de Productos"])

# =======================
# CATEGORIAS
# =======================

@router.get("/categorias", response_model=List[CategoriaResponse])
def get_categorias(db: Session = Depends(get_db)):
    """Listar todas las categorías de productos."""
    return db.query(Categoria).all()

@router.post("/categorias", response_model=CategoriaResponse)
def create_categoria(
    cat: CategoriaCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_analyst_or_admin)
):
    """Crear una nueva categoría de producto."""
    nueva = Categoria(**cat.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.put("/categorias/{id_categoria}", response_model=CategoriaResponse)
def update_categoria(
    id_categoria: int,
    cat: CategoriaUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_analyst_or_admin)
):
    """Actualizar una categoría de producto existente."""
    db_cat = db.query(Categoria).filter(Categoria.id_categoria == id_categoria).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    for key, value in cat.model_dump().items():
        setattr(db_cat, key, value)
        
    db.commit()
    db.refresh(db_cat)
    return db_cat

@router.delete("/categorias/{id_categoria}")
def delete_categoria(
    id_categoria: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_analyst_or_admin)
):
    """Eliminar una categoría de producto."""
    db_cat = db.query(Categoria).filter(Categoria.id_categoria == id_categoria).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    # Verificar si está en uso por subcategorías
    en_uso = db.query(SubCategoria).filter(SubCategoria.id_categoria == id_categoria).count()
    if en_uso > 0:
        raise HTTPException(status_code=400, detail=f"No se puede eliminar porque está en uso por {en_uso} subcategorías.")
        
    db.delete(db_cat)
    db.commit()
    return {"detail": "Categoría eliminada"}

# =======================
# SUBCATEGORIAS
# =======================

@router.get("/subcategorias", response_model=List[SubCategoriaResponse])
def get_subcategorias(
    id_categoria: int = Query(None, description="Filtrar por id_categoria"),
    db: Session = Depends(get_db)
):
    """Listar subcategorías, opcionalmente filtradas por categoría."""
    query = db.query(SubCategoria)
    if id_categoria is not None:
        query = query.filter(SubCategoria.id_categoria == id_categoria)
    return query.all()

@router.post("/subcategorias", response_model=SubCategoriaResponse)
def create_subcategoria(
    subcat: SubCategoriaCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_analyst_or_admin)
):
    """Crear una nueva subcategoría de producto."""
    nueva = SubCategoria(**subcat.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.put("/subcategorias/{id_subcategoria}", response_model=SubCategoriaResponse)
def update_subcategoria(
    id_subcategoria: int,
    subcat: SubCategoriaUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_analyst_or_admin)
):
    """Actualizar una subcategoría de producto."""
    db_subcat = db.query(SubCategoria).filter(SubCategoria.id_subcategoria == id_subcategoria).first()
    if not db_subcat:
        raise HTTPException(status_code=404, detail="SubCategoría no encontrada")
    
    for key, value in subcat.model_dump().items():
        setattr(db_subcat, key, value)
        
    db.commit()
    db.refresh(db_subcat)
    return db_subcat

@router.delete("/subcategorias/{id_subcategoria}")
def delete_subcategoria(
    id_subcategoria: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_analyst_or_admin)
):
    """Eliminar una subcategoría de producto."""
    db_subcat = db.query(SubCategoria).filter(SubCategoria.id_subcategoria == id_subcategoria).first()
    if not db_subcat:
        raise HTTPException(status_code=404, detail="SubCategoría no encontrada")
    
    # Verificar si está en uso por productos
    en_uso = db.query(Producto).filter(Producto.id_subcategoria == id_subcategoria).count()
    if en_uso > 0:
        raise HTTPException(status_code=400, detail=f"No se puede eliminar porque está en uso por {en_uso} productos.")
        
    db.delete(db_subcat)
    db.commit()
    return {"detail": "SubCategoría eliminada"}
