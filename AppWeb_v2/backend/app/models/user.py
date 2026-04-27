from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base
from app.models.rol import Rol

ROL_MAP: dict[int, str] = {
    1: "client",        # Cliente
    2: "analyst",       # Analista
    3: "client",        # Coordinador Exclusivo
    4: "client",        # Coordinador Tradex
    5: "mercaderista",  # Mercaderista
    6: "supervisor",    # Supervisor
    7: "auditor",       # Auditor
    8: "admin",         # Administrador
    9: "client",        # Vendedor
    10: "client",       # Atencion al Cliente
    11: "client",       # Coordinador General
    12: "client",       # Encuestador
}


class Usuario(Base):
    __tablename__ = "USUARIOS"

    id = Column("id_usuario", Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    password = Column("password_hash", String(255), nullable=False)
    email = Column(String(200), nullable=True)
    id_rol = Column(Integer, ForeignKey("ROLES.id_rol"), nullable=True)
    id_perfil = Column(Integer, nullable=True)
    activo = Column(Boolean, default=True)

    rol_obj = relationship(Rol, lazy="joined", foreign_keys=[id_rol])
    sesiones = relationship("SesionActiva", back_populates="usuario", cascade="all, delete-orphan")
    solicitudes = relationship("Solicitud", back_populates="usuario", cascade="all, delete-orphan")
    permisos = relationship("UserPermission", back_populates="usuario", cascade="all, delete-orphan", lazy="noload")

    @property
    def rol(self) -> str:
        return ROL_MAP.get(self.id_rol or 0, "client")

    @property
    def rol_nombre(self) -> str:
        return self.rol_obj.nombre if self.rol_obj else ROL_MAP.get(self.id_rol or 0, "client")

    @property
    def is_admin(self) -> bool:
        return self.id_rol == 8

    @property
    def is_analyst(self) -> bool:
        return self.id_rol == 2

    @property
    def is_supervisor(self) -> bool:
        return self.id_rol == 6

    @property
    def is_client(self) -> bool:
        return self.id_rol in (1, 3, 4, 9, 10, 11)

    @property
    def is_mercaderista(self) -> bool:
        return self.id_rol == 5

    @property
    def is_coordinador_exclusivo(self) -> bool:
        return self.id_rol == 3

    @property
    def is_coordinador_tradex(self) -> bool:
        return self.id_rol == 4

    def has_permission(self, module: str, action: str) -> bool:
        if self.is_admin:
            return True
        p = next((p for p in self.permisos if p.module == module), None)
        if not p:
            return False
        if action == 'read': return p.can_read
        if action == 'write': return p.can_write
        if action == 'delete': return p.can_delete
        return False


class UserPermission(Base):
    __tablename__ = "usuario_permisos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column("id_usuario", Integer, ForeignKey("USUARIOS.id_usuario"), nullable=False)
    module = Column(String(50), nullable=False)
    can_read = Column(Boolean, default=True)
    can_write = Column(Boolean, default=False)
    can_delete = Column(Boolean, default=False)
    can_see_all = Column(Boolean, default=False)

    usuario = relationship("Usuario", back_populates="permisos")
