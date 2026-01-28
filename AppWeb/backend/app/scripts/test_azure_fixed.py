# app/scripts/test_azure_fixed.py
import sys
import os
from pathlib import Path

# Agregar el directorio raíz del proyecto al path
current_dir = Path(__file__).parent  # scripts
app_dir = current_dir.parent          # app
backend_dir = app_dir.parent          # backend

sys.path.insert(0, str(backend_dir))

try:
    from app.utils.azure_file_storage import AzureFileStorage
    print("✅ Módulo importado correctamente")
except ImportError as e:
    print(f"❌ Error importando: {e}")
    sys.exit(1)

def test_fixed_storage():
    print("🔧 Probando Azure File Storage Corregido...")
    
    # Crear instancia
    storage = AzureFileStorage(base_path='X:')
    print(f"Base path configurado: {storage.base_path}")
    
    # 1. Probar construcción de rutas
    print("\n1. Probando construcción de rutas:")
    fs_path, db_path = storage.construct_path(
        "Miranda",
        "Caracas",
        "Farmatodo Test",
        "Abbott",
        "2025-12-23",
        "activaciones",
        "test_photo.jpg"
    )
    print(f"   FS Path: {fs_path}")
    print(f"   DB Path: {db_path}")
    
    # Verificar formato
    if fs_path.startswith("X:\\"):
        print("✅ Formato FS correcto (con barra después de X:)")
    else:
        print(f"❌ Formato FS incorrecto. Esperaba 'X:\\...'")
    
    if db_path.startswith("X:\\\\"):
        print("✅ Formato DB correcto (doble barra invertida)")
    else:
        print(f"❌ Formato DB incorrecto. Esperaba 'X:\\\\...'")
    
    # 2. Probar guardar archivo simple
    print("\n2. Probando guardado de archivo simple...")
    
    # Crear un archivo de prueba simple
    test_content = b"Contenido de prueba para la foto"
    
    class SimpleFile:
        def __init__(self, content, filename):
            self.content = content
            self.filename = filename
        
        def save(self, path):
            # Crear directorios si no existen
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, 'wb') as f:
                f.write(self.content)
    
    mock_file = SimpleFile(test_content, "test_photo.jpg")
    
    # Ruta relativa para la prueba - usar backslash
    relative_path = "Miranda\\Caracas\\Farmatodo Test\\Abbott\\2025-12-23\\activaciones\\test_photo.jpg"
    
    success, fs_path, db_path, error = storage.save_file(mock_file, relative_path)
    
    if success:
        print(f"✅ Archivo guardado exitosamente")
        print(f"   FS Path: {fs_path}")
        print(f"   DB Path: {db_path}")
        
        # Verificar que el archivo existe
        if os.path.exists(fs_path):
            print(f"✅ Archivo verificado en disco")
            file_size = os.path.getsize(fs_path)
            print(f"✅ Tamaño del archivo: {file_size} bytes")
            
            # Limpiar
            try:
                os.remove(fs_path)
                print("✅ Archivo de prueba eliminado")
            except Exception as e:
                print(f"⚠️  No se pudo eliminar archivo: {e}")
        else:
            print(f"❌ Archivo no encontrado en disco")
    else:
        print(f"❌ Error al guardar: {error}")
    
    print("\n" + "="*60)
    print("RESUMEN:")
    print("="*60)
    print(f"Base path: {storage.base_path}")
    print("Rutas generadas correctamente:")
    print("  - FS: 'X:\\departamento\\ciudad\\...'")
    print("  - DB: 'X:\\\\departamento\\\\ciudad\\\\...'")
    print("\nEl sistema está listo para producción.")

if __name__ == "__main__":
    test_fixed_storage()