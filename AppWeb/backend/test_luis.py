import sys
sys.path.append('c:/Users/Yoel Abreu/Documents/epran/Astroweb/AppWeb/backend')
from app import create_app
from app.utils.database import execute_query

app_tuple = create_app()
app = app_tuple[0] if isinstance(app_tuple, tuple) else app_tuple

with app.app_context():
    # Find a recent visit for Cafare
    q1 = """
        SELECT TOP 5 ID_VISITA, ID_CLIENTE 
        FROM BALANCES_TOTALES 
        WHERE ID_CLIENTE = 62 
        ORDER BY FECHA_BALANCE DESC
    """
    v = execute_query(q1)
    print("Visitas recientes para Cafare:", v)
    
    # Let's check if any of these visits have products from Fisa (id_cliente = 43)
    if v:
        visit_ids = [str(x[0]) for x in v]
        q2 = f"SELECT DISTINCT ID_CLIENTE FROM BALANCES_TOTALES WHERE ID_VISITA IN ({','.join(visit_ids)})"
        c = execute_query(q2)
        print("Clientes encontrados en los balances de esas visitas:", c)
        
        q3 = f"SELECT ID_VISITA, ID_CLIENTE, FABRICANTE, PRODUCTO FROM BALANCES_TOTALES WHERE ID_VISITA = {visit_ids[0]} AND ID_CLIENTE != 62"
        p = execute_query(q3)
        print("Productos de otros clientes en la visita 1:", p)
