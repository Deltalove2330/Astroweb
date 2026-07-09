import re

html_path = r'AppWeb_v2\frontend\src\app\features\centro-mando\centro-mando.component.html'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Rutas
content = content.replace(
    '<span class="cm-metric-num orange">{{ resumenDia().rutas.activas }}</span>',
    '<span class="cm-metric-num orange">{{ resumenDia().rutas.planificadas - resumenDia().rutas.completadas }}</span>'
)
content = content.replace(
    '<span class="cm-metric-lbl">Activos · {{ pct(resumenDia().rutas.activas, resumenDia().rutas.planificadas) }}%</span>',
    '<span class="cm-metric-lbl">Pend. · {{ pct(resumenDia().rutas.planificadas - resumenDia().rutas.completadas, resumenDia().rutas.planificadas) }}%</span>'
)

# Replace Puntos
content = content.replace(
    '<span class="cm-metric-num orange">{{ resumenDia().puntos_interes.activos }}</span>',
    '<span class="cm-metric-num orange">{{ resumenDia().puntos_interes.planificados - resumenDia().puntos_interes.completados }}</span>'
)
content = content.replace(
    '<span class="cm-metric-lbl">Activos · {{ pct(resumenDia().puntos_interes.activos, resumenDia().puntos_interes.planificados) }}%</span>',
    '<span class="cm-metric-lbl">Pend. · {{ pct(resumenDia().puntos_interes.planificados - resumenDia().puntos_interes.completados, resumenDia().puntos_interes.planificados) }}%</span>'
)

# Replace Clientes (Tradex)
content = content.replace(
    '<span class="cm-metric-num orange">{{ resumenDia().clientes_tradex.activos }}</span>',
    '<span class="cm-metric-num orange">{{ resumenDia().clientes_tradex.planificados - resumenDia().clientes_tradex.completados }}</span>'
)
content = content.replace(
    '<span class="cm-metric-lbl">Activos · {{ pct(resumenDia().clientes_tradex.activos, resumenDia().clientes_tradex.planificados) }}%</span>',
    '<span class="cm-metric-lbl">Pend. · {{ pct(resumenDia().clientes_tradex.planificados - resumenDia().clientes_tradex.completados, resumenDia().clientes_tradex.planificados) }}%</span>'
)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated HTML with Pendientes instead of Activos!")
