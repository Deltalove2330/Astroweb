# app/commands.py
import click
from app.utils.database import execute_query
import bcrypt

def register_commands(app):
    @app.cli.command("create-initial-user")
    def create_initial_user():
        """Crea el usuario inicial 'Dev' con contraseña 'Devops123' y rol 'admin'"""
        try:
            username = "Dev"
            password = "Devops123"
            role = "admin"
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            # Verificar si el usuario ya existe
            check_query = "SELECT COUNT(*) FROM USUARIOS WHERE username = ?"
            result = execute_query(check_query, (username,), fetch_one=True)
            
            if result and result[0] > 0:
                print(f"El usuario {username} ya existe.")
                return

            # Insertar nuevo usuario
            insert_query = "INSERT INTO USUARIOS (username, password_hash, rol) VALUES (?, ?, ?)"
            execute_query(insert_query, (username, password_hash, role), commit=True)
            
            print(f"✅ Usuario {username} creado con rol {role}")
        
        except Exception as e:
            print(f"❌ Error creando usuario: {str(e)}")