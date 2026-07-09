import re

path = r"c:\Users\Yoel Abreu\Documents\epran\Astroweb\AppWeb_v2\frontend\src\app\features\centro-mando\centro-mando.component.html"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add scroll to the modal body tables.
# The table containers are `<div class="pdv-section">` inside `.cm-modal-body`
content = content.replace(
    '<div class="pdv-section">',
    '<div class="pdv-section overflow-hidden flex flex-col max-h-[300px] bg-[#161b22] border border-white/5 rounded-xl">'
)
content = content.replace(
    '<table class="pdv-table">',
    '<div class="overflow-y-auto flex-1"><table class="pdv-table w-full">'
)
content = content.replace(
    '</table>\n          </div>',
    '</table></div>\n          </div>'
)

# 2. Modify Pendientes headers
content = content.replace(
    "<thead><tr><th>Ruta</th><th>PDV</th><th>Mercaderista</th>@if(filtroDesde !== filtroHasta){<th>Plan.</th>}</tr></thead>",
    "<thead><tr class=\"sticky top-0 bg-[#21262d] z-10\"><th>Prioridad</th><th>Ruta</th><th>PDV</th><th>Mercaderista</th>@if(filtroDesde !== filtroHasta){<th>Plan.</th>}</tr></thead>"
)

# 3. Modify Activos headers
content = content.replace(
    "<thead><tr><th>Ruta</th><th>PDV</th><th>Mercaderista</th>@if(filtroDesde !== filtroHasta){<th>Plan.</th><th>Act.</th>}</tr></thead>",
    "<thead><tr class=\"sticky top-0 bg-[#21262d] z-10\"><th>Prioridad</th><th>Ruta</th><th>PDV</th><th>Mercaderista</th>@if(filtroDesde !== filtroHasta){<th>Plan.</th><th>Act.</th>}</tr></thead>"
)

# 4. Modify Completados headers
content = content.replace(
    "<thead><tr><th>Ruta</th><th>PDV</th><th>Mercaderista</th>@if(filtroDesde !== filtroHasta){<th>Plan.</th><th>Comp.</th>}</tr></thead>",
    "<thead><tr class=\"sticky top-0 bg-[#21262d] z-10\"><th>Prioridad</th><th>Ruta</th><th>PDV</th><th>Mercaderista</th>@if(filtroDesde !== filtroHasta){<th>Plan.</th><th>Comp.</th>}</tr></thead>"
)

# 5. Modify Table Bodies using regex (applies to all 3)
pattern_tbody = re.compile(r"""(<tr>\s*<td class="fw">{{ p\.ruta }}</td>\s*<td>){{ p\.punto_de_interes }}(</td>)""")
replacement_tbody = r"""<tr>
                    <td>
                      <span class="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                        {{ p.prioridad || 'Baja' }}
                      </span>
                    </td>
                    <td class="fw">{{ p.ruta }}</td>
                    <td>
                      <div class="font-bold">{{ p.punto_de_interes }}</div>
                      <div class="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">{{ p.departamento || 'Sin Depto.' }}</div>
                    </td>"""
content = pattern_tbody.sub(replacement_tbody, content)

# 6. Modify cm-merc-card info
# Originally:
# <div class="cm-merc-info">
#   <h4>{{ m.nombre }}</h4>
#   @if (m.activo_ahora) {
#     <span class="cm-pill green"><span class="dot"></span> En punto</span>
#   } @else {
#     <span class="cm-pill gray">Inactivo</span>
#   }
# </div>

pattern_merc = re.compile(r"""(<div class="cm-merc-info">\s*<h4>{{ m\.nombre }}</h4>)(\s*@if \(m\.activo_ahora\))""")
replacement_merc = r"""\1
                    <div class="flex items-center flex-wrap gap-1 mt-0.5 mb-1.5 text-[10px] text-slate-400 font-medium leading-tight">
                      <div class="flex items-center gap-0.5" title="Cuadrante"><mat-icon class="!text-[14px] !h-3.5 !w-3.5 text-blue-400">explore</mat-icon> <span class="max-w-[80px] truncate">{{ m.cuadrantes_str || 'S/C' }}</span></div>
                      <span class="opacity-30">|</span>
                      <div class="flex items-center gap-0.5" title="Departamento"><mat-icon class="!text-[14px] !h-3.5 !w-3.5 text-red-400">location_on</mat-icon> <span class="max-w-[80px] truncate">{{ m.departamentos_str || 'S/D' }}</span></div>
                      <span class="opacity-30">|</span>
                      <div class="flex items-center gap-0.5" title="Rutas"><mat-icon class="!text-[14px] !h-3.5 !w-3.5 text-green-400">route</mat-icon> <span class="max-w-[80px] truncate">{{ m.rutas_str || 'S/R' }}</span></div>
                    </div>\2"""
content = pattern_merc.sub(replacement_merc, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Frontend updated")
