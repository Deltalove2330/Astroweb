import pyodbc
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

conn_str = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER=172.174.41.110;DATABASE=epran;UID=dev;PWD=abcd1234*"
conn = pyodbc.connect(conn_str)

def query(sql):
    return pd.read_sql(sql, conn)

print("--- CATEGORIAS_CLIENTES ---")
print(query("SELECT TOP 5 * FROM CATEGORIAS_CLIENTES"))

print("\n--- PRODUCTS schema ---")
print(query("SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'PRODUCTS'"))

print("\n--- BALANCES_TOTALES schema ---")
print(query("SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'BALANCES_TOTALES'"))
