import pyodbc
import warnings
warnings.filterwarnings('ignore')

conn_str = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER=172.174.41.110;DATABASE=epran;UID=dev;PWD=abcd1234*"

def execute_query(query, commit=True):
    with pyodbc.connect(conn_str) as conn:
        cursor = conn.cursor()
        cursor.execute(query)
        if commit:
            conn.commit()

print("Poblando tablas dimensionales...")

queries = [
    # DEPARTAMENTOS
    "INSERT INTO DEPARTAMENTOS (departamento) SELECT DISTINCT Departamento FROM [Sheet1$] WHERE Departamento IS NOT NULL",
    # CATEGORIAS
    "INSERT INTO CATEGORIAS (categoria) SELECT DISTINCT Categoria FROM [Sheet1$] WHERE Categoria IS NOT NULL",
    # SUBCATEGORIAS
    "INSERT INTO SUBCATEGORIAS (subcategoria) SELECT DISTINCT SubCategoria FROM [Sheet1$] WHERE SubCategoria IS NOT NULL",
    # CATEGORIAS_BI
    "INSERT INTO CATEGORIAS_BI (categoriaBI) SELECT DISTINCT CategoriaBI FROM [Sheet1$] WHERE CategoriaBI IS NOT NULL",
    # SUBCATEGORIAS_BI
    "INSERT INTO SUBCATEGORIAS_BI (subcategoriaBI) SELECT DISTINCT SubCategoriaBI FROM [Sheet1$] WHERE SubCategoriaBI IS NOT NULL",
    # PRESENTACIONES
    "INSERT INTO PRESENTACIONES (presentacion) SELECT DISTINCT Presentacion FROM [Sheet1$] WHERE Presentacion IS NOT NULL",
    # CLASIFICACION_TAMANOS
    "INSERT INTO CLASIFICACION_TAMANOS (clasificacion) SELECT DISTINCT [Clasif# Tamaños] FROM [Sheet1$] WHERE [Clasif# Tamaños] IS NOT NULL",
    # MARCAS
    "INSERT INTO MARCAS (marca) SELECT DISTINCT MARCA FROM [Sheet1$] WHERE MARCA IS NOT NULL",
    # PRODUCTORAS
    "INSERT INTO PRODUCTORAS (productora) SELECT DISTINCT PRODUCTORA FROM [Sheet1$] WHERE PRODUCTORA IS NOT NULL"
]

for query in queries:
    try:
        execute_query(query)
        print(f"Éxito: {query.split(' ')[2]}")
    except Exception as e:
        print(f"Error en: {query.split(' ')[2]} -> {e}")

print("Dimensiones pobladas.")
