# database.py
import pyodbc
import time
import logging
from config import TOKEN, LOG_FORMAT, LOG_LEVEL
from config import SERVER, DATABASE, USERNAME, PASSWORD
logging.basicConfig(format=LOG_FORMAT, level=LOG_LEVEL)
logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self):
        self.connection_string = (
            f'DRIVER={{ODBC Driver 17 for SQL Server}};'
            f'SERVER={SERVER};'
            f'DATABASE={DATABASE};'
            f'UID={USERNAME};'
            f'PWD={PASSWORD}'
        )
    
    def get_connection(self):
        try:
            return pyodbc.connect(self.connection_string)
        except pyodbc.Error as e:
            logger.error(f"Database connection failed: {e}")
            raise
    
    def execute_query(self, query, params=None, max_retries=3):
        for attempt in range(max_retries):
            try:
                conn = self.get_connection()
                with conn.cursor() as cursor:
                    if params:
                        cursor.execute(query, params)
                    else:
                        cursor.execute(query)
                    return cursor.fetchall()
            except pyodbc.OperationalError as e:
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt  # Backoff exponencial
                    logger.warning(f"Database error: {e}. Retrying in {wait_time}s...")
                    time.sleep(wait_time)
                else:
                    raise
            finally:
                if 'conn' in locals():
                    conn.close()