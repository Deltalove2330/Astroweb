# app/utils/database.py
import pyodbc
from config import config
from flask import current_app

def get_db_connection():
    return pyodbc.connect(config.SQLALCHEMY_DATABASE_URI)

def execute_query(query, params=(), fetch_one=False, commit=False, get_identity=False):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if get_identity:
            # Para obtener el ID de la fila insertada
            cursor.execute(query, params)
            cursor.execute("SELECT SCOPE_IDENTITY()")
            identity = cursor.fetchone()[0]
            if commit:
                conn.commit()
            return identity
        else:
            cursor.execute(query, params)
            
            if commit:
                conn.commit()
                return {"success": True, "rowcount": cursor.rowcount}
            
            if fetch_one:
                result = cursor.fetchone()
                return result if result else None
            else:
                return cursor.fetchall()
            
    except pyodbc.Error as e:
        current_app.logger.error(f"Database error: {str(e)} - Query: {query}")
        raise e
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()