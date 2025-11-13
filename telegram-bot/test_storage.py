# test_storage.py
from config import PHOTO_DIR
import os

test_path = os.path.join(PHOTO_DIR, "test_file.txt")

try:
    with open(test_path, "w") as f:
        f.write("Prueba de escritura en Azure Storage")
    print(f"✅ Archivo creado exitosamente en: {test_path}")
    
    # Intentar leer
    with open(test_path, "r") as f:
        content = f.read()
        print(f"✅ Contenido leído: {content}")
    
    # Limpiar
    os.remove(test_path)
    print("✅ Archivo eliminado")
except Exception as e:
    print(f"❌ Error: {str(e)}")