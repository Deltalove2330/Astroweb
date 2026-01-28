import os
import pyodbc

def get_clients():
    conn = pyodbc.connect(
        f'DRIVER={{SQL Server}};'
        f'SERVER={os.getenv("DB_SERVER")};'
        f'DATABASE={os.getenv("DB_NAME")};'
        f'UID={os.getenv("DB_USER")};'
        f'PWD={os.getenv("DB_PASSWORD")}'
    )
    cursor = conn.cursor()
    cursor.execute("SELECT cliente FROM [EPRAN].[dbo].[CLIENTES]")
    clients = [row[0] for row in cursor.fetchall()]
    conn.close()
    return clients
