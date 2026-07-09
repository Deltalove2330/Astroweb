import os
import sys
import json

# Add backend to path
sys.path.insert(0, os.path.abspath("AppWeb_v2/backend"))

from app.db.session import SessionLocal
from sqlalchemy import text

db = SessionLocal()

print("--- Sample Visita joined with Punto and Ruta Programacion ---")
res = db.execute(text("""
    SELECT TOP 1 v.id_visita, v.fecha_visita, p.punto_de_interes, p.departamento, rp.cuadrante, f.categoria
    FROM VISITAS_MERCADERISTA v
    LEFT JOIN PUNTOS_INTERES1 p ON v.identificador_punto_interes = p.identificador
    LEFT JOIN RUTAS_NUEVAS rp ON v.identificador_punto_interes = rp.id_punto_interes
    LEFT JOIN FOTOS_TOTALES f ON f.id_visita = v.id_visita
    WHERE v.id_cliente IS NOT NULL
""")).fetchall()

for row in res:
    print(dict(row._mapping))
