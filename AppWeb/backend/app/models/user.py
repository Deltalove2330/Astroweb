#app/models/user.py
from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, id, username, rol, cliente_id=None, email=None, id_supervisor=None, id_analista=None, mercaderista_id=None, mercaderista_nombre=None):
        self.id = id
        self.username = username
        self.rol = rol
        self.cliente_id = cliente_id
        self.email = email
        self.id_supervisor = id_supervisor
        self.id_analista = id_analista
        self.mercaderista_id = mercaderista_id  # Nuevo atributo
        self.mercaderista_nombre = mercaderista_nombre  # Nuevo atributo
    
    def is_admin(self):
        return self.rol == 'admin'
    
    def is_analyst(self):
        return self.rol == 'analyst'
    
    def is_client(self):
        return self.rol == 'client'
    
    def is_mercaderista(self):
        return self.rol == 'mercaderista'  # Nuevo método