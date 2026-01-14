from flask import Blueprint, jsonify, render_template, request
import plotly.graph_objects as go
from app.utils.database import execute_query
from datetime import datetime

reporteria_bp = Blueprint('reporteria', __name__)

COLOR_PALETTE = ['#3A86FF', '#FF006E', '#8338EC', '#FB5607', '#FFBE0B', '#06D6A0']
BACKGROUND_COLOR = 'rgba(0,0,0,0)'
FONT_COLOR = '#E6F1FF'
GRID_COLOR = 'rgba(255,255,255,0.1)'

@reporteria_bp.route('/')
def reporteria():
    return render_template('reporteria.html')

# API para obtener clientes
@reporteria_bp.route('/api/clientes')
def obtener_clientes():
    """Obtener lista de clientes para el filtro"""
    query = """
    SELECT 
        [id_cliente],
        [cliente] 
    FROM [epran].[dbo].[CLIENTES] 
    ORDER BY [cliente]
    """
    
    clientes = execute_query(query)
    if clientes:
        clientes_list = [{'id': row[0], 'nombre': row[1]} for row in clientes]
        return jsonify(clientes_list)
    return jsonify([])

# API para obtener regiones (cuadrantes)
@reporteria_bp.route('/api/regiones')
def obtener_regiones():
    """Obtener lista de regiones (cuadrantes) únicas"""
    query = """
    SELECT DISTINCT 
        [cuadrante]
    FROM [epran].[dbo].[RUTAS_NUEVAS] 
    WHERE [cuadrante] IS NOT NULL 
    ORDER BY [cuadrante]
    """
    
    regiones = execute_query(query)
    if regiones:
        regiones_list = [{'id': row[0], 'nombre': row[0]} for row in regiones]
        return jsonify(regiones_list)
    return jsonify([])

# API principal para obtener datos del gráfico
@reporteria_bp.route('/api/grafico')
def generar_grafico():
    """Generar gráfico de barras apiladas de activaciones"""
    try:
        # Obtener parámetros de filtro
        cliente_id = request.args.get('cliente', 'todos')
        region = request.args.get('region', 'todas')
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        
        # Construir consulta base
        query = """
        SELECT 
            RA.[tipo_activacion],
            RA.[estado],
            COUNT(*) as cantidad,
            RN.[cuadrante],
            C.[cliente]
        FROM [epran].[dbo].[RUTAS_ACTIVADAS] RA
        INNER JOIN [epran].[dbo].[RUTAS_NUEVAS] RN 
            ON RA.[id_ruta] = RN.[id_ruta]
        INNER JOIN [epran].[dbo].[CLIENTES] C 
            ON RN.[servicio] = C.[id_cliente]
        WHERE 1=1
        """
        
        params = []
        
        # Aplicar filtros
        if cliente_id != 'todos':
            query += " AND C.[id_cliente] = ?"
            params.append(cliente_id)
        
        if region != 'todas':
            query += " AND RN.[cuadrante] = ?"
            params.append(region)
        
        if fecha_inicio:
            query += " AND CAST(RA.[fecha_hora_activacion] AS DATE) >= ?"
            params.append(fecha_inicio)
        
        if fecha_fin:
            query += " AND CAST(RA.[fecha_hora_activacion] AS DATE) <= ?"
            params.append(fecha_fin)
        
        # Agrupar por tipo_activacion y estado
        query += """
        GROUP BY 
            RA.[tipo_activacion],
            RA.[estado],
            RN.[cuadrante],
            C.[cliente]
        ORDER BY 
            RA.[tipo_activacion],
            RA.[estado]
        """
        
        # Ejecutar consulta
        resultados = execute_query(query, params)
        
        if not resultados:
            # Si no hay datos, devolver gráfico vacío con mensaje
            fig = crear_grafico_vacio()
            return jsonify(fig)
        
        # Procesar datos para el gráfico
        datos_procesados = procesar_datos_grafico(resultados)
        
        # Crear gráfico
        fig = crear_grafico_apilado(datos_procesados)
        
        return fig.to_json()
        
    except Exception as e:
        print(f"Error generando gráfico: {str(e)}")
        fig = crear_grafico_error(str(e))
        return jsonify(fig)

def procesar_datos_grafico(resultados):
    """Procesar datos de la consulta para el gráfico"""
    # Estructura: {tipo_activacion: {estado: cantidad}}
    datos = {}
    
    for row in resultados:
        tipo_activacion = row[0] or 'Sin tipo'
        estado = row[1] or 'Sin estado'
        cantidad = row[2]
        
        if tipo_activacion not in datos:
            datos[tipo_activacion] = {}
        
        if estado not in datos[tipo_activacion]:
            datos[tipo_activacion][estado] = 0
        
        datos[tipo_activacion][estado] += cantidad
    
    return datos

def crear_grafico_apilado(datos):
    """Crear gráfico de barras apiladas"""
    # Preparar datos para Plotly
    tipos_activacion = list(datos.keys())
    
    # Obtener todos los estados únicos
    estados = set()
    for estados_dict in datos.values():
        estados.update(estados_dict.keys())
    estados = list(estados)
    
    # Crear lista de barras (una por estado)
    barras = []
    
    for i, estado in enumerate(estados):
        valores = []
        for tipo in tipos_activacion:
            valor = datos[tipo].get(estado, 0)
            valores.append(valor)
        
        barra = go.Bar(
            name=estado,
            x=tipos_activacion,
            y=valores,
            marker=dict(color=COLOR_PALETTE[i % len(COLOR_PALETTE)]),
            text=valores,
            textposition='auto',
            hoverinfo='y+name',
            hovertemplate='<b>Tipo: %{x}</b><br>Estado: %{fullData.name}<br>Cantidad: %{y}<extra></extra>'
        )
        barras.append(barra)
    
    # Configurar layout
    layout = go.Layout(
        title=dict(
            text="<b>Activaciones por Tipo y Estado</b>",
            font=dict(size=18, color=FONT_COLOR),
            x=0.5,
            y=0.95
        ),
        xaxis=dict(
            title="Tipo de Activación",
            titlefont=dict(color=FONT_COLOR),
            tickfont=dict(color=FONT_COLOR),
            gridcolor=GRID_COLOR,
            showline=True,
            linecolor=GRID_COLOR
        ),
        yaxis=dict(
            title="Cantidad de Activaciones",
            titlefont=dict(color=FONT_COLOR),
            tickfont=dict(color=FONT_COLOR),
            gridcolor=GRID_COLOR,
            showline=True,
            linecolor=GRID_COLOR
        ),
        barmode='stack',
        paper_bgcolor=BACKGROUND_COLOR,
        plot_bgcolor=BACKGROUND_COLOR,
        font=dict(color=FONT_COLOR),
        margin=dict(t=80, b=80, l=80, r=40),
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="center",
            x=0.5,
            font=dict(color=FONT_COLOR)
        ),
        hoverlabel=dict(
            bgcolor='rgba(26, 42, 73, 0.9)',
            font=dict(color='white')
        )
    )
    
    return go.Figure(data=barras, layout=layout)

def crear_grafico_vacio():
    """Crear gráfico vacío cuando no hay datos"""
    fig = go.Figure()
    fig.update_layout(
        title=dict(
            text="<b>No hay datos para los filtros seleccionados</b>",
            font=dict(size=18, color=FONT_COLOR),
            x=0.5,
            y=0.5
        ),
        paper_bgcolor=BACKGROUND_COLOR,
        plot_bgcolor=BACKGROUND_COLOR,
        font=dict(color=FONT_COLOR),
        xaxis=dict(visible=False),
        yaxis=dict(visible=False)
    )
    return fig.to_dict()

def crear_grafico_error(mensaje):
    """Crear gráfico de error"""
    fig = go.Figure()
    fig.update_layout(
        title=dict(
            text=f"<b>Error: {mensaje}</b>",
            font=dict(size=18, color='red'),
            x=0.5,
            y=0.5
        ),
        paper_bgcolor=BACKGROUND_COLOR,
        plot_bgcolor=BACKGROUND_COLOR,
        font=dict(color=FONT_COLOR),
        xaxis=dict(visible=False),
        yaxis=dict(visible=False)
    )
    return fig.to_dict()