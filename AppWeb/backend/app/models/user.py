# app/models/user.py
from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, id, username, rol, cliente_id=None, email=None, 
                 id_supervisor=None, id_analista=None, 
                 mercaderista_id=None, mercaderista_nombre=None, 
                 mercaderista_tipo=None, id_rol=None):
        self.id = id
        self.username = username
        self.rol = rol
        self.cliente_id = cliente_id
        self.email = email
        self.id_supervisor = id_supervisor
        self.id_analista = id_analista
        self.mercaderista_id = mercaderista_id
        self.mercaderista_nombre = mercaderista_nombre
        self.mercaderista_tipo = mercaderista_tipo
        self.id_rol = id_rol
    
    def debug_info(self):
        """Imprimir información de depuración del usuario"""
        print(f"\n{'='*60}")
        print(f"DEBUG USER INFO:")
        print(f"  ID: {self.id}")
        print(f"  Username: {self.username}")
        print(f"  Rol: {self.rol}")
        print(f"  ID_Rol: {self.id_rol}")
        print(f"  Cliente ID: {self.cliente_id}")
        print(f"  Email: {self.email}")
        print(f"  ID_Supervisor: {self.id_supervisor}")
        print(f"  ID_Analista: {self.id_analista}")
        print(f"  Mercaderista ID: {self.mercaderista_id}")
        print(f"  Mercaderista Nombre: {self.mercaderista_nombre}")
        print(f"  Mercaderista Tipo: {self.mercaderista_tipo}")
        print(f"  Es Coordinador Exclusivo: {self.is_coordinador_exclusivo()}")
        print(f"  Es Coordinador Tradex: {self.is_coordinador_tradex()}")
        print(f"  Es Cliente: {self.is_client()}")
        print(f"  Es Analista: {self.is_analyst()}")
        print(f"  Es Admin: {self.is_admin()}")
        print(f"{'='*60}\n")
    
    def is_admin(self):
        return self.rol == 'admin'
    
    def is_analyst(self):
        return self.rol == 'analyst'
    
    def is_client(self):
        return self.rol == 'client'
    
    def is_coordinador_exclusivo(self):
        """Verificar si es Coordinador Exclusivo"""
        return self.id_rol == 3
    
    def is_coordinador_tradex(self):
        """Verificar si es Coordinador Tradex"""
        return self.id_rol == 4
    
    def is_mercaderista(self):
        return self.rol == 'mercaderista'
    
    def is_mercaderista_auditor(self):
        """Verificar si es mercaderista tipo Auditor"""
        return self.rol == 'mercaderista' and self.mercaderista_tipo == 'Auditor'
    
    def is_mercaderista_normal(self):
        """Verificar si es mercaderista tipo Mercaderista"""
        return self.rol == 'mercaderista' and self.mercaderista_tipo == 'Mercaderista'
    
    def get_mercaderista_tipo_display(self):
        """Obtener el tipo de mercaderista formateado"""
        if not self.mercaderista_tipo:
            return "Mercaderista"
        return self.mercaderista_tipo
    
    def to_dict(self):
        """Convertir usuario a diccionario para JSON"""
        user_dict = {
            'id': self.id,
            'username': self.username,
            'rol': self.rol,
            'cliente_id': self.cliente_id,
            'email': self.email,
            'id_supervisor': self.id_supervisor,
            'id_analista': self.id_analista,
            'id_rol': self.id_rol
        }
        
        # Agregar campos específicos de mercaderista si existe
        if self.rol == 'mercaderista':
            user_dict['mercaderista_id'] = self.mercaderista_id
            user_dict['mercaderista_nombre'] = self.mercaderista_nombre
            user_dict['mercaderista_tipo'] = self.mercaderista_tipo
        
        return user_dict
    
    def __repr__(self):
        if self.rol == 'mercaderista':
            return f"<User(mercaderista) {self.mercaderista_nombre} ({self.username}) - Tipo: {self.mercaderista_tipo}>"
        elif self.rol == 'client':
            return f"<User(client) {self.username} - Cliente ID: {self.cliente_id}>"
        else:
            return f"<User({self.rol}) {self.username}>"