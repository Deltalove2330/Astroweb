import pyodbc
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

conn_str = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER=172.174.41.110;DATABASE=epran;UID=dev;PWD=abcd1234*"

def execute_query(query, commit=True):
    with pyodbc.connect(conn_str) as conn:
        cursor = conn.cursor()
        cursor.execute(query)
        if commit:
            conn.commit()

def fetch_query(query):
    return pd.read_sql(query, pyodbc.connect(conn_str))

print("1. Haciendo backups...")
backups = [
    ("CATEGORIAS", "CATEGORIAS_BKP_20260622"),
    ("CATEGORIAS_CLIENTES", "CATEGORIAS_CLIENTES_BKP_20260622"),
    ("PRODUCTS", "PRODUCTS_BKP_20260622"),
    ("BALANCES_TOTALES", "BALANCES_TOTALES_BKP_20260622")
]

for src, dst in backups:
    try:
        execute_query(f"SELECT * INTO {dst} FROM {src}")
        print(f"Backup {src} -> {dst} creado.")
    except pyodbc.ProgrammingError as e:
        if "There is already an object named" in str(e):
            print(f"Backup {dst} ya existe.")
        else:
            print(f"Error backup {src}: {e}")
    except Exception as e:
        print(f"Error backup {src}: {e}")

print("\n2. Eliminando constraints y tablas antiguas...")
try:
    execute_query("DROP TABLE PRODUCTS")
    print("Tabla PRODUCTS eliminada.")
except Exception as e:
    print(f"Error eliminando PRODUCTS: {e}")

try:
    execute_query("DELETE FROM CATEGORIAS_CLIENTES")
    print("Tabla CATEGORIAS_CLIENTES vaciada.")
except Exception as e:
    print(f"Error vaciando CATEGORIAS_CLIENTES: {e}")

try:
    execute_query("DELETE FROM CATEGORIAS")
    print("Tabla CATEGORIAS vaciada.")
except Exception as e:
    print(f"Error vaciando CATEGORIAS: {e}")


print("\n3. Creando nuevas tablas dimensionales...")
dimension_tables = [
    "CREATE TABLE DEPARTAMENTOS (id_departamento INT IDENTITY(1,1) PRIMARY KEY, departamento VARCHAR(255) UNIQUE NOT NULL);",
    "CREATE TABLE SUBCATEGORIAS (id_subcategoria INT IDENTITY(1,1) PRIMARY KEY, subcategoria VARCHAR(255) UNIQUE NOT NULL);",
    "CREATE TABLE CATEGORIAS_BI (id_categoriaBI INT IDENTITY(1,1) PRIMARY KEY, categoriaBI VARCHAR(255) UNIQUE NOT NULL);",
    "CREATE TABLE SUBCATEGORIAS_BI (id_subcategoriaBI INT IDENTITY(1,1) PRIMARY KEY, subcategoriaBI VARCHAR(255) UNIQUE NOT NULL);",
    "CREATE TABLE PRESENTACIONES (id_presentacion INT IDENTITY(1,1) PRIMARY KEY, presentacion VARCHAR(255) UNIQUE NOT NULL);",
    "CREATE TABLE CLASIFICACION_TAMANOS (id_clasificacion_tamaño INT IDENTITY(1,1) PRIMARY KEY, clasificacion VARCHAR(255) UNIQUE NOT NULL);",
    "CREATE TABLE MARCAS (id_marca INT IDENTITY(1,1) PRIMARY KEY, marca VARCHAR(255) UNIQUE NOT NULL);",
    "CREATE TABLE PRODUCTORAS (id_productora INT IDENTITY(1,1) PRIMARY KEY, productora VARCHAR(255) UNIQUE NOT NULL);"
]

for query in dimension_tables:
    table_name = query.split("CREATE TABLE ")[1].split(" ")[0]
    try:
        execute_query(query)
        print(f"Tabla {table_name} creada.")
    except Exception as e:
        if "There is already an object named" in str(e):
             print(f"Tabla {table_name} ya existe.")
        else:
             print(f"Error creando {table_name}: {e}")


print("\n4. Creando nueva tabla PRODUCTS...")
create_products = """
CREATE TABLE PRODUCTS (
    id_product INT IDENTITY(1,1) PRIMARY KEY,
    producto_gutrade VARCHAR(255),
    descripcionbi VARCHAR(255),
    id_departamento INT FOREIGN KEY REFERENCES DEPARTAMENTOS(id_departamento),
    id_categoria INT FOREIGN KEY REFERENCES CATEGORIAS(id_categoria),
    id_subcategoria INT FOREIGN KEY REFERENCES SUBCATEGORIAS(id_subcategoria),
    id_presentacion INT FOREIGN KEY REFERENCES PRESENTACIONES(id_presentacion),
    id_categoriaBI INT FOREIGN KEY REFERENCES CATEGORIAS_BI(id_categoriaBI),
    id_subcategoriaBI INT FOREIGN KEY REFERENCES SUBCATEGORIAS_BI(id_subcategoriaBI),
    gramos FLOAT,
    id_clasificacion_tamaño INT FOREIGN KEY REFERENCES CLASIFICACION_TAMANOS(id_clasificacion_tamaño),
    id_marca INT FOREIGN KEY REFERENCES MARCAS(id_marca),
    id_productora INT FOREIGN KEY REFERENCES PRODUCTORAS(id_productora),
    cod_bar VARCHAR(100),
    inagotable BIT,
    comentario TEXT
);
"""
try:
    execute_query(create_products)
    print("Nueva tabla PRODUCTS creada.")
except Exception as e:
    print(f"Error creando PRODUCTS: {e}")

print("\nTerminado.")
