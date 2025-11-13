#app/models/user.py
from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, id, username, rol, cliente_id=None, email=None, id_supervisor=None, id_analista=None):
        self.id = id
        self.username = username
        self.rol = rol
        self.cliente_id = cliente_id
        self.email = email
        self.id_supervisor = id_supervisor
        self.id_analista = id_analista  # Nuevo atributo
    
    def is_admin(self):
        return self.rol == 'admin'
    
    def is_analyst(self):
        return self.rol == 'analyst'
    
    def is_client(self):
        return self.rol == 'client'