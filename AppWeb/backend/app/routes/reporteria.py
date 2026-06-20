from flask import Blueprint, jsonify, render_template, request, current_app
import plotly.graph_objects as go
from plotly.offline import plot
import pandas as pd
import pyodbc
from datetime import datetime

# ✅ Blueprint correctamente definido
reporteria_bp = Blueprint('reporteria', __name__, template_folder='templates', static_folder='static')

# Paleta de colores profesional
COLOR_PALETTE = ['#3A86FF', '#FF006E', '#8338EC', '#FB5607', '#FFBE0B', '#06D6A0', '#118AB2', '#073B4C']
BACKGROUND_COLOR = 'rgba(0,0,0,0)'
FONT_COLOR = '#E6F1FF'
GRID_COLOR = 'rgba(255,255,255,0.1)'

# Colores específicos para el gráfico de rutas activadas
ROUTAS_COLORS = {
    'Finalizado': '#28a745',      # Verde
    'En Progreso': '#ffc107'      # Amarillo
}

@reporteria_bp.route('/')
def reporteria():
    return render_template('reporteria.html')

# ✅ Función helper para obtener datos (sin depender del request context)
def get_reporte_data(tipo_reporte):
    """
    Obtiene los datos del reporte según el tipo
    """
    if tipo_reporte == 'analistas':
        # ✅ NUEVO: Datos para gráfico de rutas activadas (Top 4 Analistas)
        data = {
            'titulo': 'Top 4 Analistas - Rutas Activadas',
            'descripcion': 'Rutas activadas por tipo y estado del día actual',
            'tipo_grafico': 'stacked_bar',
            'fecha': datetime.now().strftime('%Y-%m-%d'),
            'datos': obtener_rutas_activadas_hoy()
        }
    elif tipo_reporte == 'puntos_interes':
        data = {
            'titulo': 'Top Puntos de Interés',
            'descripcion': 'Puntos más visitados en los últimos 30 días',
            'tipo_grafico': 'pie',
            'datos': [
                {'nombre': 'Supermercado Central', 'visitas': 120},
                {'nombre': 'Tienda del Este', 'visitas': 98},
                {'nombre': 'Mercado Norte', 'visitas': 85},
                {'nombre': 'Plaza Comercial', 'visitas': 78},
                {'nombre': 'Centro Comercial Sur', 'visitas': 65}
            ]
        }
    elif tipo_reporte == 'personas_interes':
        data = {
            'titulo': 'Top Personas de Interés',
            'descripcion': 'Personas con más interacciones en el sistema',
            'tipo_grafico': 'horizontal_bar',
            'datos': [
                {'nombre': 'Juan Rodríguez', 'interacciones': 45},
                {'nombre': 'Laura Sánchez', 'interacciones': 38},
                {'nombre': 'Miguel Torres', 'interacciones': 32},
                {'nombre': 'Sofía Ramírez', 'interacciones': 28},
                {'nombre': 'Diego Fernández', 'interacciones': 25}
            ]
        }
    elif tipo_reporte == 'mercaderistas':
        data = {
            'titulo': 'Top Mercaderistas',
            'descripcion': 'Mercaderistas con más visitas completadas',
            'tipo_grafico': 'bar',
            'datos': [
                {'nombre': 'Roberto Gómez', 'visitas': 62},
                {'nombre': 'Elena Vargas', 'visitas': 58},
                {'nombre': 'Oscar Díaz', 'visitas': 54},
                {'nombre': 'Carmen Ruiz', 'visitas': 50},
                {'nombre': 'Jorge Herrera', 'visitas': 47}
            ]
        }
    else:  # otros_tops
        data = {
            'titulo': 'Métricas Clave',
            'descripcion': 'Diversas métricas relevantes del sistema',
            'tipo_grafico': 'line',
            'datos': [
                {'nombre': 'Visitas Diarias', 'valor': 35},
                {'nombre': 'Fotos Aprobadas', 'valor': 92},
                {'nombre': 'Clientes Nuevos', 'valor': 8},
                {'nombre': 'Tiempo Promedio', 'valor': 24},
                {'nombre': 'Satisfacción', 'valor': 88}
            ]
        }
    
    return data

# ✅ API para obtener datos de reportes
@reporteria_bp.route('/api/reportes')
def obtener_reportes():
    tipo_reporte = request.args.get('tipo')
    data = get_reporte_data(tipo_reporte)
    return jsonify(data)

def obtener_rutas_activadas_hoy():
    """
    Consulta las rutas activadas del día actual desde SQL Server
    """
    try:
        # ✅ Configura tu conexión a la base de datos
        conn_str = (
            'DRIVER={ODBC Driver 17 for SQL Server};'
            'SERVER=192.168.1.100;'  # ⚠️ CAMBIA POR TU SERVIDOR
            'DATABASE=epran;'
            'UID=tu_usuario;'         # ⚠️ CAMBIA POR TU USUARIO
            'PWD=tu_password;'        # ⚠️ CAMBIA POR TU PASSWORD
        )
        
        query = """
        SELECT 
            tipo_activacion,
            estado,
            COUNT(*) as cantidad
        FROM [epran].[dbo].[RUTAS_ACTIVADAS]
        WHERE CAST(fecha_hora_activacion AS DATE) = CAST(GETDATE() AS DATE)
            AND tipo_activacion IN ('Auditor', 'Mercaderista')
            AND estado IN ('Finalizado', 'En Progreso')
        GROUP BY tipo_activacion, estado
        """
        
        conn = pyodbc.connect(conn_str)
        df = pd.read_sql(query, conn)
        conn.close()
        
        # Convertir a formato para el gráfico
        resultados = []
        for tipo in ['Mercaderista', 'Auditor']:
            fila = {'tipo_activacion': tipo}
            for estado in ['Finalizado', 'En Progreso']:
                valor = df[(df['tipo_activacion'] == tipo) & (df['estado'] == estado)]['cantidad'].sum()
                fila[estado] = int(valor) if not df.empty else 0
            resultados.append(fila)
        
        return resultados
        
    except Exception as e:
        print(f"Error al obtener rutas activadas: {e}")
        # Datos de respaldo por si falla la conexión
        return [
            {'tipo_activacion': 'Mercaderista', 'Finalizado': 45, 'En Progreso': 23},
            {'tipo_activacion': 'Auditor', 'Finalizado': 18, 'En Progreso': 12}
        ]

# ✅ API para generar gráficos (CORREGIDO - SIN test_request_context)
@reporteria_bp.route('/api/grafico')
def generar_grafico():
    tipo_reporte = request.args.get('tipo')
    
    # ✅ SOLUCIÓN: Llamar directamente a la función helper
    datos = get_reporte_data(tipo_reporte)
    
    # Configuración común para todos los gráficos
    layout_config = {
        'paper_bgcolor': BACKGROUND_COLOR,
        'plot_bgcolor': BACKGROUND_COLOR,
        'font': {'color': FONT_COLOR, 'family': 'Arial'},
        'margin': {'t': 60, 'b': 60, 'l': 60, 'r': 40},
        'hovermode': 'closest',
        'hoverlabel': {
            'bgcolor': 'rgba(26, 42, 73, 0.9)',
            'font': {'color': 'white'}
        } 
    }

    # ✅ NUEVO: Gráfico de Barras Apiladas para Rutas Activadas
    if datos['tipo_grafico'] == 'stacked_bar':
        tipos = [item['tipo_activacion'] for item in datos['datos']]
        finalizado = [item['Finalizado'] for item in datos['datos']]
        en_progreso = [item['En Progreso'] for item in datos['datos']]
        
        fig = go.Figure()
        
        # Barra apilada - Finalizado
        fig.add_trace(go.Bar(
            x=tipos,
            y=finalizado,
            name='Finalizado',
            marker_color=ROUTAS_COLORS['Finalizado'],
            text=finalizado,
            textposition='inside',
            textfont=dict(color='white', size=12, family='Arial'),
            hovertemplate='<b>Finalizado</b><br>Tipo: %{x}<br>Cantidad: %{y}<extra></extra>'
        ))
        
        # Barra apilada - En Progreso
        fig.add_trace(go.Bar(
            x=tipos,
            y=en_progreso,
            name='En Progreso',
            marker_color=ROUTAS_COLORS['En Progreso'],
            text=en_progreso,
            textposition='inside',
            textfont=dict(color='white', size=12, family='Arial'),
            hovertemplate='<b>En Progreso</b><br>Tipo: %{x}<br>Cantidad: %{y}<extra></extra>'
        ))
        
        # Calcular totales para anotaciones
        totales = [f + e for f, e in zip(finalizado, en_progreso)]
        
        fig.update_layout(
            title=dict(
                text=f"<b>{datos['titulo']}</b><br><span style='font-size:14px; color:#aaa;'>{datos['fecha']}</span>",
                font=dict(size=16, family='Arial'),
                x=0.5,
                y=0.95
            ),
            xaxis=dict(
                title='Tipo de Activación',
                gridcolor=GRID_COLOR,
                showline=True,
                linecolor=GRID_COLOR,
                tickfont=dict(size=12, family='Arial')
            ),
            yaxis=dict(
                title='Cantidad de Rutas',
                gridcolor=GRID_COLOR,
                showline=True,
                linecolor=GRID_COLOR,
                range=[0, 100]  # Escala fija de 0 a 100
            ),
            barmode='stack',
            legend=dict(
                orientation='h',
                yanchor='bottom',
                y=1.02,
                xanchor='center',
                x=0.5,
                font=dict(size=12, family='Arial')
            ),
            **layout_config
        )
        
        # Añadir anotaciones con totales
        for i, total in enumerate(totales):
            fig.add_annotation(
                x=i,
                y=total + 2,
                text=f'Total: {total}',
                showarrow=False,
                font=dict(size=11, color=FONT_COLOR, family='Arial'),
                xref='x',
                yref='y'
            )
    
    elif datos['tipo_grafico'] == 'bar':
        nombres = [item['nombre'] for item in datos['datos']]
        valores = [item['puntos'] if 'puntos' in item else 
                  item['visitas'] if 'visitas' in item else 
                  item['interacciones'] if 'interacciones' in item else 
                  item['valor'] for item in datos['datos']]
        
        fig = go.Figure([go.Bar(
            x=nombres, 
            y=valores,
            marker=dict(
                color=COLOR_PALETTE,
                line=dict(color='rgba(58, 134, 255, 0.8)', width=1)
            ),
            text=valores,
            textposition='auto',
            textfont=dict(color=FONT_COLOR),
            hoverinfo='y+name',
            hovertemplate='<b>%{x}</b><br>%{y}<extra></extra>'
        )])
        
        fig.update_layout(
            title=dict(
                text=f"<b>{datos['titulo']}</b>",
                font=dict(size=18),
                x=0.5,
                y=0.95
            ),
            xaxis=dict(
                title='',
                gridcolor=GRID_COLOR,
                showline=True,
                linecolor=GRID_COLOR,
                tickfont=dict(size=12)
            ),
            yaxis=dict(
                title='Valor',
                gridcolor=GRID_COLOR,
                showline=True,
                linecolor=GRID_COLOR
            ),
            **layout_config
        )
        
    elif datos['tipo_grafico'] == 'horizontal_bar':
        nombres = [item['nombre'] for item in datos['datos']]
        valores = [item['interacciones'] for item in datos['datos']]
        
        fig = go.Figure([go.Bar(
            y=nombres, 
            x=valores,
            orientation='h',
            marker=dict(
                color=COLOR_PALETTE,
                line=dict(color='rgba(58, 134, 255, 0.8)', width=1)
            ), 
            text=valores,
            textposition='auto',
            textfont=dict(color=FONT_COLOR),
            hoverinfo='x+name',
            hovertemplate='<b>%{y}</b><br>%{x}<extra></extra>'
        )])
        
        fig.update_layout(
            title=dict(
                text=f"<b>{datos['titulo']}</b>",
                font=dict(size=18),
                x=0.5,
                y=0.95
            ),
            yaxis=dict(
                title='',
                gridcolor=GRID_COLOR,
                showline=True,
                linecolor=GRID_COLOR,
                tickfont=dict(size=12),
                autorange='reversed'
            ),
            xaxis=dict(
                title='Interacciones',
                gridcolor=GRID_COLOR,
                showline=True,
                linecolor=GRID_COLOR
            ),
            **layout_config
        )
        
    elif datos['tipo_grafico'] == 'pie':
        nombres = [item['nombre'] for item in datos['datos']]
        valores = [item['visitas'] for item in datos['datos']]
        
        fig = go.Figure([go.Pie(
            labels=nombres, 
            values=valores,
            hole=0.4,
            marker=dict(colors=COLOR_PALETTE),
            textinfo='percent+label',
            insidetextorientation='radial',
            hovertemplate='<b>%{label}</b><br>%{value} visitas<extra></extra>',
            pull=[0.05 if i == 0 else 0 for i in range(len(valores))],
            sort=False
        )])
        
        fig.update_layout(
            title=dict(
                text=f"<b>{datos['titulo']}</b>",
                font=dict(size=18),
                x=0.5,
                y=0.95
            ),
            legend=dict(
                orientation='h',
                yanchor='bottom',
                y=-0.2,
                xanchor='center',
                x=0.5
            ),
            **layout_config
        )
        
    else:  # line
        nombres = [item['nombre'] for item in datos['datos']]
        valores = [item['valor'] for item in datos['datos']]
        
        fig = go.Figure([go.Scatter(
            x=nombres, 
            y=valores, 
            mode='lines+markers+text',
            line=dict(color=COLOR_PALETTE[0], width=3, shape='spline'),
            marker=dict(size=10, color=COLOR_PALETTE[0], line=dict(width=2, color='white')),
            text=valores,
            textposition='top center',
            textfont=dict(color=FONT_COLOR),
            fill='tozeroy',
            fillcolor='rgba(58, 134, 255, 0.2)',
            hoverinfo='y+x',
            hovertemplate='<b>%{x}</b><br>%{y}<extra></extra>'
        )])
        
        fig.update_layout(
            title=dict(
                text=f"<b>{datos['titulo']}</b>",
                font=dict(size=18),
                x=0.5,
                y=0.95
            ),
            xaxis=dict(
                title='',
                gridcolor=GRID_COLOR,
                showline=True,
                linecolor=GRID_COLOR,
                tickfont=dict(size=12)
            ),
            yaxis=dict(
                title='Valor',
                gridcolor=GRID_COLOR,
                showline=True,
                linecolor=GRID_COLOR
            ),
            **layout_config
        )

    return fig.to_json()

# ✅ API específica para rutas activadas (opcional - para refresh dinámico)
@reporteria_bp.route('/api/rutas-activadas')
def get_rutas_activadas_api():
    fecha = request.args.get('fecha', datetime.now().strftime('%Y-%m-%d'))
    datos = obtener_rutas_activadas_hoy()
    return jsonify({'fecha': fecha, 'datos': datos})