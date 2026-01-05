# app/utils/database.py
import pyodbc
from config import config
from flask import current_app

def get_db_connection():
    return pyodbc.connect(config.SQLALCHEMY_DATABASE_URI)

def execute_query(query, params=(), fetch_one=False, commit=False):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(query, params)
        
        if commit:
            conn.commit()
            result = {"success": True, "rowcount": cursor.rowcount}
        else:
            if fetch_one:
                result = cursor.fetchone()
                if result and len(result) == 1:
                    result = result[0]
            else:
                result = cursor.fetchall()
        
        return result
            
    except pyodbc.Error as e:
        current_app.logger.error(f"Database error: {str(e)} - Query: {query}")
        raise e
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()