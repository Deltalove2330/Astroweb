# app/commands.py
import click
from app.utils.database import execute_query
import bcrypt

def register_commands(app):
    @app.cli.command("create-initial-user")
    def create_initial_user():
        """Crea el usuario inicial 'Dev' con contraseña 'Devops123' y rol 'admin'"""
        try:
            username = "Dev"
            password = "Devops123"
            role = "admin"
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            # Verificar si el usuario ya existe
            check_query = "SELECT COUNT(*) FROM USUARIOS WHERE username = ?"
            result = execute_query(check_query, (username,), fetch_one=True)
            
            if result and result[0] > 0:
                print(f"El usuario {username} ya existe.")
                return

            # Insertar nuevo usuario
            insert_query = "INSERT INTO USUARIOS (username, password_hash, rol) VALUES (?, ?, ?)"
            execute_query(insert_query, (username, password_hash, role), commit=True)
            
            print(f"✅ Usuario {username} creado con rol {role}")
        
        except Exception as e:
            print(f"❌ Error creando usuario: {str(e)}")

    @app.cli.command("migrate-catalogues")
    def migrate_catalogues():
        """Migra las tablas CAT_* desde la base de datos epran-qa a epran (produccion)"""
        import pyodbc
        from app.config import config
        
        print("Iniciando migracion de catalogos desde QA a Produccion...")
        
        # QA connection details (from AppWeb_v2 backend)
        qa_conn_str = (
            "DRIVER={ODBC Driver 17 for SQL Server};"
            "SERVER=172.174.41.110;"
            "DATABASE=epran-qa;"
            "UID=dev;"
            "PWD=abcd1234*;"
        )
        
        # PROD connection details (from database.py / config)
        from config import config as prod_config
        prod_conn_str = prod_config.SQLALCHEMY_DATABASE_URI
        
        tables = [
            "CAT_DEPARTAMENTOS",
            "CAT_CIUDADES",
            "CAT_CANAL_VENTA",
            "CAT_ALCANCE",
            "CAT_TIPO_NEGOCIO",
            "CAT_SUBTIPO_NEGOCIO"
        ]
        
        try:
            print("Conectando a base de datos de QA (epran-qa)...")
            conn_qa = pyodbc.connect(qa_conn_str, timeout=15)
            cursor_qa = conn_qa.cursor()
            print("¡Conectado a QA!")
            
            print("Conectando a base de datos de Produccion (epran)...")
            conn_prod = pyodbc.connect(prod_conn_str, timeout=15)
            cursor_prod = conn_prod.cursor()
            print("¡Conectado a Produccion!")
            
            for table in tables:
                print(f"\n--- Procesando tabla: {table} ---")
                
                # Verificar si existe en PROD
                cursor_prod.execute(f"SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '{table}'")
                table_exists = cursor_prod.fetchone()[0] > 0
                
                if not table_exists:
                    print(f"La tabla {table} no existe en Produccion. Creandola...")
                    
                    # Consultar columnas desde QA
                    cursor_qa.execute(f"""
                        SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
                        FROM INFORMATION_SCHEMA.COLUMNS
                        WHERE TABLE_NAME = '{table}'
                        ORDER BY ORDINAL_POSITION
                    """)
                    columns = cursor_qa.fetchall()
                    
                    columns_def = []
                    for col in columns:
                        col_name, data_type, max_len, is_nullable = col
                        nullable_str = "NULL" if is_nullable == "YES" else "NOT NULL"
                        
                        if max_len is not None:
                            if max_len == -1:
                                type_str = f"{data_type}(MAX)"
                            else:
                                type_str = f"{data_type}({max_len})"
                        else:
                            type_str = data_type
                        
                        columns_def.append(f"[{col_name}] {type_str} {nullable_str}")
                    
                    # Consultar llaves primarias en QA
                    cursor_qa.execute(f"""
                        SELECT COLUMN_NAME
                        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                        WHERE OBJECTPROPERTY(OBJECT_ID(CONSTRAINT_SCHEMA + '.' + CONSTRAINT_NAME), 'IsPrimaryKey') = 1
                        AND TABLE_NAME = '{table}'
                    """)
                    pks = [row[0] for row in cursor_qa.fetchall()]
                    
                    pk_clause = ""
                    if pks:
                        pk_clause = f", PRIMARY KEY ({', '.join([f'[{pk}]' for pk in pks])})"
                    
                    create_ddl = f"CREATE TABLE [{table}] ({', '.join(columns_def)}{pk_clause})"
                    print(f"Ejecutando DDL: {create_ddl}")
                    cursor_prod.execute(create_ddl)
                    conn_prod.commit()
                    print(f"Tabla {table} creada en Produccion.")
                else:
                    print(f"La tabla {table} ya existe en Produccion. Se saltara la creacion.")
                
                # Vaciar la tabla en PROD para evitar duplicados al recargar
                cursor_prod.execute(f"SELECT COUNT(*) FROM [{table}]")
                row_count_prod = cursor_prod.fetchone()[0]
                if row_count_prod > 0:
                    print(f"La tabla {table} en Produccion tiene {row_count_prod} registros. Vaciando tabla para recargar...")
                    # Si es referenciada por FK, truncate puede fallar, usamos DELETE en su lugar
                    try:
                        cursor_prod.execute(f"TRUNCATE TABLE [{table}]")
                    except Exception:
                        cursor_prod.execute(f"DELETE FROM [{table}]")
                    conn_prod.commit()
                
                # Obtener datos de QA
                cursor_qa.execute(f"SELECT * FROM [{table}]")
                rows = cursor_qa.fetchall()
                
                # Obtener nombres de columnas
                cursor_qa.execute(f"""
                    SELECT COLUMN_NAME 
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = '{table}' 
                    ORDER BY ORDINAL_POSITION
                """)
                col_names = [r[0] for r in cursor_qa.fetchall()]
                
                # Detectar si hay columna identidad
                cursor_qa.execute(f"SELECT name FROM sys.identity_columns WHERE object_id = OBJECT_ID('{table}')")
                identity_col_row = cursor_qa.fetchone()
                has_identity = identity_col_row is not None
                
                # Construir insert
                placeholders = ", ".join(["?" for _ in col_names])
                cols_str = ", ".join([f"[{c}]" for c in col_names])
                insert_stmt = f"INSERT INTO [{table}] ({cols_str}) VALUES ({placeholders})"
                
                print(f"Migrando {len(rows)} filas a la tabla {table}...")
                
                if has_identity:
                    cursor_prod.execute(f"SET IDENTITY_INSERT [{table}] ON")
                    
                for row in rows:
                    cursor_prod.execute(insert_stmt, tuple(row))
                    
                if has_identity:
                    cursor_prod.execute(f"SET IDENTITY_INSERT [{table}] OFF")
                    
                conn_prod.commit()
                print(f"¡Tabla {table} migrada exitosamente!")
                
            print("\n🎉 ¡Migración de catálogos completada con éxito!")
            
        except Exception as e:
            print(f"❌ Error durante la migración: {str(e)}")
            if 'conn_prod' in locals():
                try:
                    conn_prod.rollback()
                except Exception:
                    pass
        finally:
            if 'conn_qa' in locals():
                conn_qa.close()
            if 'conn_prod' in locals():
                conn_prod.close()