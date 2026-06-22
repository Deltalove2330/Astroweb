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

print("Poblando PRODUCTS...")

query = """
INSERT INTO PRODUCTS (
    producto_gutrade,
    descripcionbi,
    id_departamento,
    id_categoria,
    id_subcategoria,
    id_presentacion,
    id_categoriaBI,
    id_subcategoriaBI,
    gramos,
    id_clasificacion_tamaño,
    id_marca,
    id_productora,
    cod_bar,
    comentario
)
SELECT 
    s.[Producto Gu],
    s.DescripcionBI,
    d.id_departamento,
    c.id_categoria,
    sc.id_subcategoria,
    p.id_presentacion,
    cbi.id_categoriaBI,
    scbi.id_subcategoriaBI,
    s.GRAMOS,
    ct.id_clasificacion_tamaño,
    m.id_marca,
    pr.id_productora,
    s.CodProd,
    s.Comentario
FROM [Sheet1$] s
LEFT JOIN DEPARTAMENTOS d ON s.Departamento = d.departamento
LEFT JOIN CATEGORIAS c ON s.Categoria = c.categoria
LEFT JOIN SUBCATEGORIAS sc ON s.SubCategoria = sc.subcategoria
LEFT JOIN PRESENTACIONES p ON s.Presentacion = p.presentacion
LEFT JOIN CATEGORIAS_BI cbi ON s.CategoriaBI = cbi.categoriaBI
LEFT JOIN SUBCATEGORIAS_BI scbi ON s.SubCategoriaBI = scbi.subcategoriaBI
LEFT JOIN CLASIFICACION_TAMANOS ct ON s.[Clasif# Tamaños] = ct.clasificacion
LEFT JOIN MARCAS m ON s.MARCA = m.marca
LEFT JOIN PRODUCTORAS pr ON s.PRODUCTORA = pr.productora;
"""

try:
    execute_query(query)
    print("Éxito poblando PRODUCTS.")
except Exception as e:
    print(f"Error poblando PRODUCTS: {e}")
