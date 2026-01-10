# app/scripts/test_full_activation_flow.py
import sys
import os
from pathlib import Path
import tempfile
from datetime import datetime

# Agregar el directorio raíz del proyecto al path
current_dir = Path(__file__).parent  # scripts
app_dir = current_dir.parent          # app
backend_dir = app_dir.parent          # backend

sys.path.insert(0, str(backend_dir))

def test_full_flow():
    print("="*70)
    print("🔧 PRUEBA COMPLETA DE FLUJO DE ACTIVACIÓN")
    print("="*70)
    
    # 1. Verificar unidad X:
    print("\n1. 🔍 Verificando unidad X:\\...")
    if not os.path.exists('X:'):
        print("❌ ERROR: La unidad X: no está disponible")
        return False
    print("✅ Unidad X: disponible")
    
    # 2. Crear foto de prueba
    print("\n2. 📸 Creando foto de prueba...")
    test_content = b"FAKE_IMAGE_DATA" * 100  # 1600 bytes
    temp_file = tempfile.NamedTemporaryFile(suffix='.jpg', delete=False)
    temp_file.write(test_content)
    temp_file.close()
    print(f"✅ Foto de prueba creada: {temp_file.name} ({len(test_content)} bytes)")
    
    # 3. Simular datos de una activación real
    print("\n3. 🗺️  Simulando datos de activación...")
    
    # Datos de ejemplo (similares a los que vendrían del frontend)
    test_data = {
        'departamento': 'Miranda',
        'ciudad': 'Caracas', 
        'punto_nombre': 'Farmatodo Test',
        'cliente_nombre': 'Abbott',
        'mercaderista_id': 215,
        'point_id': 'FTD0011'
    }
    
    # 4. Probar guardado con AzureFileStorage
    print("\n4. 💾 Probando guardado con AzureFileStorage...")
    try:
        from app.utils.azure_file_storage import AzureFileStorage
        
        storage = AzureFileStorage(base_path='X:')
        
        # Generar nombre de archivo
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"activacion_{test_data['mercaderista_id']}_{test_data['point_id']}_{timestamp}.jpg"
        fecha_actual = datetime.now().strftime("%Y-%m-%d")
        
        # Construir ruta relativa
        relative_path = f"{test_data['departamento']}\\{test_data['ciudad']}\\{test_data['punto_nombre']}\\{test_data['cliente_nombre']}\\{fecha_actual}\\activaciones\\{filename}"
        
        print(f"   📍 Ruta relativa: {relative_path}")
        
        # Crear objeto File simulado
        class MockFile:
            def __init__(self, path, filename):
                self.path = path
                self.filename = filename
            
            def save(self, save_path):
                import shutil
                shutil.copy2(self.path, save_path)
        
        mock_file = MockFile(temp_file.name, filename)
        
        # Guardar archivo
        success, fs_path, db_path, error = storage.save_file(mock_file, relative_path)
        
        if success:
            print(f"✅ Archivo guardado en: {fs_path}")
            print(f"✅ Ruta para DB: {db_path}")
            
            # Verificar que el archivo existe
            if os.path.exists(fs_path):
                file_size = os.path.getsize(fs_path)
                print(f"✅ Archivo verificado: {file_size} bytes")
                
                # Verificar formato de ruta DB
                if db_path.startswith("X:\\\\") and "\\\\" in db_path:
                    print("✅ Formato de ruta DB correcto (doble barra invertida)")
                else:
                    print(f"⚠️  Formato DB podría estar incorrecto: {db_path}")
                
                # Mostrar la ruta completa
                print(f"\n📂 RUTAS GENERADAS:")
                print(f"   Sistema de archivos: {fs_path}")
                print(f"   Base de datos:       {db_path}")
                
                # Verificar que podemos acceder al archivo
                try:
                    with open(fs_path, 'rb') as f:
                        content = f.read(100)
                        print(f"✅ Puedo leer el archivo (primeros 100 bytes: {len(content)})")
                except Exception as e:
                    print(f"❌ No puedo leer el archivo: {e}")
                
                # Limpiar archivo de prueba
                try:
                    os.remove(fs_path)
                    print("✅ Archivo de prueba eliminado del sistema de archivos")
                except Exception as e:
                    print(f"⚠️  No se pudo eliminar archivo: {e}")
            else:
                print(f"❌ Archivo no encontrado en: {fs_path}")
        else:
            print(f"❌ Error al guardar: {error}")
            
    except Exception as e:
        print(f"❌ Error en la prueba: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Limpiar archivo temporal
        if os.path.exists(temp_file.name):
            os.remove(temp_file.name)
            print("✅ Archivo temporal eliminado")
    
    # 5. Verificar estructura de directorios sugerida
    print("\n5. 📁 Verificando estructura de directorios...")
    
    sample_structure = Path("X:/Miranda/Caracas/Farmatodo Test/Abbott/2025-12-23/activaciones")
    
    # Crear directorios de ejemplo
    sample_structure.mkdir(parents=True, exist_ok=True)
    
    if sample_structure.exists():
        print(f"✅ Estructura de directorios creada: {sample_structure}")
        
        # Mostrar cómo quedaría en DB
        sample_file = sample_structure / "ejemplo_activacion.jpg"
        db_format = str(sample_file).replace("\\", "\\\\")
        print(f"📝 Ejemplo de ruta para DB: {db_format}")
        
        # Limpiar
        try:
            sample_structure.rmdir()
            sample_structure.parent.rmdir()
            sample_structure.parent.parent.rmdir()
            sample_structure.parent.parent.parent.rmdir()
            sample_structure.parent.parent.parent.parent.rmdir()
            print("✅ Directorios de ejemplo eliminados")
        except:
            pass  # No importa si no se pueden eliminar
    
    print("\n" + "="*70)
    print("📋 RESUMEN DEL FLUJO DE ACTIVACIÓN")
    print("="*70)
    print("1. Frontend envía: point_id, cedula, photo")
    print("2. Backend obtiene del punto:")
    print("   - departamento, ciudad, punto_nombre, cliente_nombre")
    print("3. Genera nombre único: activacion_[mercaderista_id]_[point_id]_[timestamp].jpg")
    print("4. Construye ruta: departamento\\ciudad\\punto\\cliente\\fecha\\activaciones\\archivo.jpg")
    print("5. Guarda en: X:\\[ruta_completa]")
    print("6. Registra en DB con: X:\\\\[ruta_completa] (doble barra invertida)")
    print("7. Retorna éxito con foto_id para continuar con selección de cliente")
    
    return True

if __name__ == "__main__":
    test_full_flow()