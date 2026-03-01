# scripts/verify_x_drive.py
import os
from pathlib import Path

def verify_x_drive():
    """Verifica que la unidad X: esté disponible y tenga permisos"""
    
    print("🔍 Verificando unidad X:\\...")
    
    # Verificar si la unidad existe
    if not os.path.exists('X:'):
        print("❌ ERROR: La unidad X: no está disponible")
        print("\n⚠️  Posibles soluciones:")
        print("1. Ejecuta este comando en PowerShell (como administrador):")
        print()
        print('''
        $connectTestResult = Test-NetConnection -ComputerName saeprandat001.file.core.windows.net -Port 445
        if ($connectTestResult.TcpTestSucceeded) {
            cmd.exe /C "cmdkey /add:`"saeprandat001.file.core.windows.net`" /user:`"localhost\\saeprandat001`" /pass:`"mdCgzMhYIGJG/F3WZwuxKwM0oms3hrNNk5ceXOqXpr0EEliD5fpTR7EPE6DShpy/G1Li3TIqbW0I+AStIYOQxQ==`""
            New-PSDrive -Name X -PSProvider FileSystem -Root "\\\\saeprandat001.file.core.windows.net\\epran" -Persist
        } else {
            Write-Error "No se puede conectar al puerto 445"
        }
        ''')
        print()
        return False
    
    print("✅ Unidad X: encontrada")
    
    # Probar crear un archivo de prueba
    test_path = Path("X:\\test_directory")
    try:
        test_path.mkdir(exist_ok=True)
        
        test_file = test_path / "test.txt"
        test_file.write_text("Test file for X: drive")
        print("✅ Permisos de escritura verificados")
        
        # Leer el archivo
        content = test_file.read_text()
        print(f"✅ Permisos de lectura verificados: {content}")
        
        # Eliminar archivo de prueba
        test_file.unlink()
        test_path.rmdir()
        print("✅ Permisos de eliminación verificados")
        
        return True
        
    except Exception as e:
        print(f"❌ Error al acceder a la unidad X:: {str(e)}")
        
        # Intentar ver el contenido de la unidad
        try:
            print("\n📂 Intentando listar contenido de X:\\:")
            items = list(Path("X:\\").iterdir())[:10]  # Primeros 10 items
            for item in items:
                print(f"  - {item.name} ({'dir' if item.is_dir() else 'file'})")
        except Exception as list_error:
            print(f"  No se pudo listar contenido: {list_error}")
        
        return False

def test_upload_simulation():
    """Simula el proceso de upload que hará la aplicación"""
    print("\n🔧 Probando simulación de upload...")
    
    # Crear estructura de directorios como lo haría la app
    test_structure = Path("X:\\Miranda\\Caracas\\Farmatodo Test\\Abbott\\2025-12-23\\activaciones")
    
    try:
        test_structure.mkdir(parents=True, exist_ok=True)
        print(f"✅ Directorios creados en: {test_structure}")
        
        # Crear un archivo de prueba
        test_file = test_structure / "test_upload.jpg"
        test_file.write_bytes(b"fake image data")
        print(f"✅ Archivo de prueba creado: {test_file}")
        
        # Ruta que se guardaría en la base de datos
        db_path = str(test_file).replace("\\", "\\\\")
        print(f"📝 Ruta para base de datos: {db_path}")
        
        # Limpiar
        test_file.unlink()
        test_structure.parent.parent.parent.parent.parent.rmdir()  # Sube varios niveles
        print("✅ Archivo de prueba eliminado")
        
        return True
    except Exception as e:
        print(f"❌ Error en simulación: {str(e)}")
        return False

if __name__ == "__main__":
    if verify_x_drive():
        test_upload_simulation()
    
    print("\n" + "="*50)
    print("📋 Resumen de configuración necesaria:")
    print("="*50)
    print("1. En tu aplicación Flask, asegúrate de usar:")
    print("   - file_path_for_fs: 'X:\\departamento\\ciudad\\punto\\cliente\\fecha\\tipo\\archivo.jpg'")
    print("   - file_path_for_db: 'X:\\\\departamento\\\\ciudad\\\\punto\\\\cliente\\\\fecha\\\\tipo\\\\archivo.jpg'")
    print("\n2. En el servidor, la unidad X: debe estar mapeada con:")
    print('   New-PSDrive -Name X -PSProvider FileSystem -Root "\\\\saeprandat001.file.core.windows.net\\epran" -Persist')
    print("\n3. Verifica que el servicio de Flask tenga permisos para escribir en X:")