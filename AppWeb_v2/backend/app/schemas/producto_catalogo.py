from pydantic import BaseModel
from typing import Optional

class CategoriaBase(BaseModel):
    nombre: str
    nombre_bi: Optional[str] = None
    id_departamento: Optional[int] = None

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaUpdate(CategoriaBase):
    pass

class CategoriaResponse(CategoriaBase):
    id_categoria: int

    class Config:
        from_attributes = True


class SubCategoriaBase(BaseModel):
    nombre: str
    nombre_bi: Optional[str] = None
    id_categoria: Optional[int] = None

class SubCategoriaCreate(SubCategoriaBase):
    pass

class SubCategoriaUpdate(SubCategoriaBase):
    pass

class SubCategoriaResponse(SubCategoriaBase):
    id_subcategoria: int

    class Config:
        from_attributes = True
