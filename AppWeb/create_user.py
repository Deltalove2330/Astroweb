import bcrypt
import pyodbc
import os

def create_initial_user():
    conn = pyodbc.connect(
        f'DRIVER={{SQL Server}};'
        f'SERVER={os.getenv("DB_SERVER")};'
        f'DATABASE={os.getenv("DB_NAME")};'
        f'UID={os.getenv("DB_USER")};'
        f'PWD={os.getenv("DB_PASSWORD")}'
    )
    cursor = conn.cursor()

    username = "Dev"
    password = "Devops123"
    rol = "admin"

    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    cursor.execute("""
        INSERT INTO USUARIOS (username, password_hash, rol)
        VALUES (?, ?, ?)
    """, (username, password_hash, rol))

    conn.commit()
    conn.close()
    print(f"Usuario {username} creado con rol {rol}")

if __name__ == "__main__":
    create_initial_user()
