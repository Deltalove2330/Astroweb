import pyodbc
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

conn_str = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER=172.174.41.110;DATABASE=epran;UID=dev;PWD=abcd1234*"
conn = pyodbc.connect(conn_str)

def query(sql):
    return pd.read_sql(sql, conn)

print("--- Sheet1$ sample ---")
print(query("SELECT TOP 5 * FROM [Sheet1$]"))

print("\n--- categorias_Cliente sample ---")
try:
    print(query("SELECT TOP 5 * FROM categorias_Cliente"))
except Exception as e:
    print("Error querying categorias_Cliente:", e)

print("\n--- Current CATEGORIAS table sample ---")
try:
    print(query("SELECT TOP 5 * FROM CATEGORIAS"))
except Exception as e:
    print("Error querying CATEGORIAS:", e)
    
print("\n--- Current FABRICANTES table sample ---")
try:
    print(query("SELECT TOP 5 * FROM FABRICANTES"))
except Exception as e:
    print("Error querying FABRICANTES:", e)
