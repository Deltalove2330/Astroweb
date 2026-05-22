# app/utils/database.py
import pyodbc
from config import config
from flask import current_app

def get_db_connection():
    return pyodbc.connect(config.SQLALCHEMY_DATABASE_URI, timeout=10, autocommit=True)

def execute_query(query, params=(), fetch_one=False, commit=False):
    try:
        conn = get_db_connection()
        conn.timeout = 15
        cursor = conn.cursor()
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        
        if commit:
            conn.commit()
            return {"success": True, "rowcount": cursor.rowcount}
        
        if fetch_one:
            result = cursor.fetchone()
            if result is None:
                return None
            # Si es una sola columna, devolver el valor directamente
            if len(result) == 1:
                return result[0]
            return result
        else:
            return cursor.fetchall()
            
    except (pyodbc.Error, SystemError) as e:
        current_app.logger.error(f"Database error: {str(e)} - Query: {query}")
        if commit:
            return {"success": False, "error": str(e)}
        return None
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()