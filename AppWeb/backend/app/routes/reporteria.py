# reporteria.py (actualizado)
from flask import Blueprint, jsonify, render_template, request
import plotly.graph_objects as go


reporteria_bp = Blueprint('reporteria', __name__)

# Paleta de colores profesional
COLOR_PALETTE = ['#3A86FF', '#FF006E', '#8338EC', '#FB5607', '#FFBE0B', '#06D6A0', '#118AB2', '#073B4C']
BACKGROUND_COLOR = 'rgba(0,0,0,0)'
FONT_COLOR = '#E6F1FF'
GRID_COLOR = 'rgba(255,255,255,0.1)'

@reporteria_bp.route('/')
def reporteria():
    return render_template('reporteria.html')

# API para obtener datos de reportes
@reporteria_bp.route('/api/reportes')
def obtener_reportes():
    tipo_reporte = request.args.get('tipo')
    
    # Datos de ejemplo - en producción conectarías a tu base de datos
    if tipo_reporte == 'analistas':
        data = {
            'titulo': 'Top 4 Analistas',
            'descripcion': 'Analistas con mejor rendimiento en el mes',
            'tipo_grafico': 'bar',
            'datos': [
                {'nombre': 'Ana López', 'puntos': 95},
                {'nombre': 'Carlos Pérez', 'puntos': 88},
                {'nombre': 'María García', 'puntos': 85},
                {'nombre': 'Pedro Martínez', 'puntos': 80}
            ]
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
    
    return jsonify(data)

# Generar gráficos Plotly mejorados
@reporteria_bp.route('/api/grafico')
def generar_grafico():
    tipo_reporte = request.args.get('tipo')
    datos = obtener_reportes().json  # Obtener datos del reporte
    
    # Configuración común para todos los gráficos
    layout_config = {
        'paper_bgcolor': BACKGROUND_COLOR,
        'plot_bgcolor': BACKGROUND_COLOR,
        'font': {'color': FONT_COLOR},
        'margin': {'t': 60, 'b': 60, 'l': 60, 'r': 40},
        'hovermode': 'closest',
        'hoverlabel': {
            'bgcolor': 'rgba(26, 42, 73, 0.9)',
            'font': {'color': 'white'}
        }
    }
    
    if datos['tipo_grafico'] == 'bar':
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
                x=0.05,
                y=0.95
            ),
            xaxis=dict(
                title="",
                gridcolor=GRID_COLOR,
                showline=True,
                linecolor=GRID_COLOR,
                tickfont=dict(size=12)
            ),
            yaxis=dict(
                title="Valor",
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
                x=0.05,
                y=0.95
            ),
            yaxis=dict(
                title="",
                gridcolor=GRID_COLOR,
                showline=True,
                linecolor=GRID_COLOR,
                tickfont=dict(size=12),
                autorange='reversed'
            ),
            xaxis=dict(
                title="Interacciones",
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
                x=0.05,
                y=0.95
            ),
            legend=dict(
                orientation="h",
                yanchor="bottom",
                y=-0.2,
                xanchor="center",
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
                x=0.05,
                y=0.95
            ),
            xaxis=dict(
                title="",
                gridcolor=GRID_COLOR,
                showline=True,
                linecolor=GRID_COLOR,
                tickfont=dict(size=12)
            ),
            yaxis=dict(
                title="Valor",
                gridcolor=GRID_COLOR,
                showline=True,
                linecolor=GRID_COLOR
            ),
            **layout_config
        )
    
    return fig.to_json()