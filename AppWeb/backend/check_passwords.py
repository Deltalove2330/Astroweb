# backend/check_passwords.py
import sys
import os

# Agregar el directorio raíz al path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pyodbc
from config import config

def get_db_connection():
    """Conexión directa a la base de datos"""
    return pyodbc.connect(config.SQLALCHEMY_DATABASE_URI)

def check_all_passwords():
    """Verificar todos los hashes en la base de datos"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    print("=== VERIFICACIÓN DE HASHES EN BASE DE DATOS ===")
    
    # Obtener todos los usuarios
    cursor.execute("SELECT username, password_hash FROM USUARIOS")
    users = cursor.fetchall()
    
    print(f"Total de usuarios: {len(users)}\n")
    
    for username, password_hash in users:
        print(f"Usuario: {username}")
        
        if not password_hash:
            print("  ❌ Hash VACÍO")
            continue
        
        # Mostrar hash completo
        print(f"  Hash completo: '{password_hash}'")
        print(f"  Longitud: {len(password_hash)} caracteres")
        
        # Verificar formato bcrypt
        if password_hash.startswith('$2b$') or password_hash.startswith('$2a$') or password_hash.startswith('$2y$'):
            if len(password_hash) >= 60:
                print(f"  ✓ Hash bcrypt VÁLIDO")
            else:
                print(f"  ❌ Hash bcrypt pero muy corto ({len(password_hash)} chars)")
        else:
            print(f"  ❌ NO es formato bcrypt válido")
        
        print()
    
    cursor.close()
    conn.close()

def fix_password(username, new_password):
    """Reparar un hash específico"""
    import bcrypt
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    print(f"\n=== REPARANDO CONTRASEÑA PARA {username} ===")
    
    # Generar nuevo hash
    password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
    password_hash_str = password_hash.decode('utf-8')
    
    print(f"Nuevo hash: {password_hash_str}")
    print(f"Longitud: {len(password_hash_str)} caracteres")
    
    # Actualizar en BD
    cursor.execute(
        "UPDATE USUARIOS SET password_hash = ? WHERE username = ?",
        (password_hash_str, username)
    )
    
    conn.commit()
    
    # Verificar
    cursor.execute("SELECT password_hash FROM USUARIOS WHERE username = ?", (username,))
    updated_hash = cursor.fetchone()[0]
    
    print(f"\nHash actualizado en BD: '{updated_hash}'")
    print(f"✓ Contraseña reparada para {username}")
    
    cursor.close()
    conn.close()

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Reparar contraseñas corruptas")
    parser.add_argument('--check', action='store_true', help='Verificar todos los hashes')
    parser.add_argument('--fix', nargs=2, metavar=('USERNAME', 'PASSWORD'), 
                       help='Reparar un usuario específico')
    
    args = parser.parse_args()
    
    if args.check:
        check_all_passwords()
    elif args.fix:
        username, password = args.fix
        fix_password(username, password)
    else:
        print("Modo de uso:")
        print("  python check_passwords.py --check          # Verificar todos")
        print("  python check_passwords.py --fix Dev nueva_pass  # Reparar usuario")