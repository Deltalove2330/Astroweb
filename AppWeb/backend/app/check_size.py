import pyodbc
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

conn_str = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER=172.174.41.110;DATABASE=epran;UID=dev;PWD=abcd1234*"

def fetch_query(query):
    return pd.read_sql(query, pyodbc.connect(conn_str))

print("Contando registros en Sheet1$...")
print(fetch_query("SELECT COUNT(*) as count FROM [Sheet1$]"))
