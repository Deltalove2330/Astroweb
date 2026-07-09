import os
import sys

# Add backend to path
sys.path.insert(0, os.path.abspath("AppWeb_v2/backend"))

from app.db.session import SessionLocal
from sqlalchemy import text

db = SessionLocal()

print("--- PUNTOS_INTERES1 columns ---")
res = db.execute(text("EXEC sp_columns PUNTOS_INTERES1")).fetchall()
for row in res:
    print(row.COLUMN_NAME, row.TYPE_NAME)
