# app/scripts/test_azure_file_storage.py
import sys
import os
from pathlib import Path

# Agregar el directorio raíz del proyecto al path
current_dir = Path(__file__).parent  # scripts
app_dir = current_dir.parent          # app
backend_dir = app_dir.parent          # backend
project_root = backend_dir.parent     # AppWeb

# Agregar al path
sys.path.insert(0, str(backend_dir))
sys.path.insert(0, str(project_root))

from app.utils.azure_file_storage import AzureFileStorage
from io import BytesIO
import tempfile

def test_azure_storage():
    print("🔧 Probando Azure File Storage...")
    
    # Crear instancia
    storage = AzureFileStorage(base_path='X:')
    
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
    
    # 2. Probar guardar archivo
    print("\n2. Probando guardado de archivo...")
    
    # Crear un archivo de prueba en memoria
    test_content = b"Contenido de prueba para la foto"
    
    # Crear un objeto similar a FileStorage usando tempfile
    import tempfile
    from werkzeug.datastructures import FileStorage
    
    # Crear un archivo temporal
    with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp:
        tmp.write(test_content)
        tmp_path = tmp.name
    
    # Crear un FileStorage mock
    mock_file = FileStorage(
        stream=open(tmp_path, 'rb'),
        filename='test_photo.jpg',
        content_type='image/jpeg'
    )
    
    # Ruta relativa para la prueba
    relative_path = "Miranda/Caracas/Farmatodo Test/Abbott/2025-12-23/activaciones/test_photo.jpg"
    
    success, fs_path, db_path, error = storage.save_file(mock_file, relative_path)
    
    # Cerrar el archivo temporal
    mock_file.close()
    os.unlink(tmp_path)
    
    if success:
        print(f"✅ Archivo guardado exitosamente")
        print(f"   FS Path: {fs_path}")
        print(f"   DB Path: {db_path}")
        
        # Verificar que el archivo existe
        if Path(fs_path).exists():
            print(f"✅ Archivo verificado en disco")
            
            # Leer el archivo para verificar contenido
            with open(fs_path, 'rb') as f:
                content = f.read()
                print(f"✅ Tamaño del archivo: {len(content)} bytes")
        else:
            print(f"❌ Archivo no encontrado en disco")
    else:
        print(f"❌ Error al guardar: {error}")
    
    print("\n" + "="*50)
    print("📋 Resumen:")
    print("="*50)
    print(f"Unidad base: {storage.base_path}")
    print("Funcionalidades probadas:")
    print("  ✓ Construcción de rutas (FS y DB)")
    print("  ✓ Guardado de archivos")
    print("  ✓ Creación automática de directorios")

if __name__ == "__main__":
    test_azure_storage()