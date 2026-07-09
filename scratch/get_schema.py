import sys
import os

# Add backend to path
sys.path.insert(0, os.path.abspath('AppWeb/backend'))

from app.utils.database import execute_query
from app import create_app

try:
    app_result = create_app()
    app = app_result[0] if isinstance(app_result, tuple) else app_result
except Exception as e:
    print("Error creating app:", e)
    sys.exit(1)

with app.app_context():
    # Since we know pyodbc is used, let's query information_schema or just select * from PUNTOS_INTERES1 limit 1 to get column names
    try:
        # SQL Server information schema
        cols = execute_query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'RUTA_PROGRAMACION'")
        if cols:
            print("Columns in RUTA_PROGRAMACION:")
            for col in cols:
                print(col[0])
        else:
            print("No columns found or not SQL Server")
    except Exception as e:
        print("Error:", e)
