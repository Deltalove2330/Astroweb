# app/utils/helpers.py
def obtener_dia_actual_espanol():
    from datetime import datetime
    dias = {
        0: 'Lunes',
        1: 'Martes',
        2: 'Miércoles',
        3: 'Jueves',
        4: 'Viernes',
        5: 'Sábado',
        6: 'Domingo'
    }
    hoy = datetime.now()
    return dias[hoy.weekday()]