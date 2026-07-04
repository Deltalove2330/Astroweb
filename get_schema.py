import pyodbc

def main():
    conn_str = "Driver={ODBC Driver 17 for SQL Server};Server=localhost;Database=epran;Trusted_Connection=yes;"
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    
    tables = ['JORNADAS_ENCUESTADOR', 'encuestas_centro', 'centros_salud', 'medicos', 'medico_centro_encuesta']
    for t in tables:
        try:
            cursor.execute(f"SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='{t}'")
            print(f'\n--- TABLE {t} ---')
            for row in cursor.fetchall():
                print(f'{row.COLUMN_NAME}: {row.DATA_TYPE} ({row.CHARACTER_MAXIMUM_LENGTH})')
        except Exception as e:
            print(e)
            
if __name__ == '__main__':
    main()
