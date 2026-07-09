import pyodbc, os
from dotenv import load_dotenv

load_dotenv('AppWeb_v2/backend/.env')
conn = pyodbc.connect(
    'Driver={ODBC Driver 17 for SQL Server};'
    f"Server={os.getenv('DB_SERVER')};"
    f"Database={os.getenv('DB_NAME')};"
    f"UID={os.getenv('DB_USER')};"
    f"PWD={os.getenv('DB_PASSWORD')}"
)
cursor = conn.cursor()
cursor.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='PUNTOS_INTERES1'")
print("PUNTOS_INTERES1:", [r[0] for r in cursor.fetchall()])

cursor.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='RUTA_PROGRAMACION'")
print("RUTA_PROGRAMACION:", [r[0] for r in cursor.fetchall()])
