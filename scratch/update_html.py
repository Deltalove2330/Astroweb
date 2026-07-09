import re

path = r"c:\Users\Yoel Abreu\Documents\epran\Astroweb\AppWeb_v2\frontend\src\app\features\centro-mando\centro-mando.component.html"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace Pendientes Table
content = content.replace(
    """<thead><tr><th>Ruta</th><th>PDV</th><th>Mercaderista</th>@if(filtroDesde !== filtroHasta){<th>Plan.</th>}</tr></thead>
              <tbody>
                @for (p of modalPdvs.pendientes; track p.id_punto + '_' + p.id_mercaderista) {
                  <tr>
                    <td class="fw">{{ p.ruta }}</td>
                    <td>{{ p.punto_de_interes }}</td>""",
    """<thead><tr><th>Prioridad</th><th>Ruta</th><th>PDV</th><th>Mercaderista</th>@if(filtroDesde !== filtroHasta){<th>Plan.</th>}</tr></thead>
              <tbody>
                @for (p of modalPdvs.pendientes; track p.id_punto + '_' + p.id_mercaderista) {
                  <tr>
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
)

# Replace Activos Table
content = content.replace(
    """<thead><tr><th>Ruta</th><th>PDV</th><th>Mercaderista</th>@if(filtroDesde !== filtroHasta){<th>Plan.</th><th>Act.</th>}</tr></thead>
              <tbody>
                @for (p of modalPdvs.activos; track p.id_punto + '_' + p.id_mercaderista) {
                  <tr>
                    <td class="fw">{{ p.ruta }}</td>
                    <td>{{ p.punto_de_interes }}</td>""",
    """<thead><tr><th>Prioridad</th><th>Ruta</th><th>PDV</th><th>Mercaderista</th>@if(filtroDesde !== filtroHasta){<th>Plan.</th><th>Act.</th>}</tr></thead>
              <tbody>
                @for (p of modalPdvs.activos; track p.id_punto + '_' + p.id_mercaderista) {
                  <tr>
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
)

# Replace Completados Table
content = content.replace(
    """<thead><tr><th>Ruta</th><th>PDV</th><th>Mercaderista</th>@if(filtroDesde !== filtroHasta){<th>Plan.</th><th>Comp.</th>}</tr></thead>
              <tbody>
                @for (p of modalPdvs.completados; track p.id_punto + '_' + p.id_mercaderista) {
                  <tr>
                    <td class="fw">{{ p.ruta }}</td>
                    <td>{{ p.punto_de_interes }}</td>""",
    """<thead><tr><th>Prioridad</th><th>Ruta</th><th>PDV</th><th>Mercaderista</th>@if(filtroDesde !== filtroHasta){<th>Plan.</th><th>Comp.</th>}</tr></thead>
              <tbody>
                @for (p of modalPdvs.completados; track p.id_punto + '_' + p.id_mercaderista) {
                  <tr>
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
)

# Replace cm-merc-card
content = content.replace(
    """              <div class="cm-merc-card">
                <div class="cm-merc-top">
                  <div class="cm-avatar">{{ (m.nombre || '?').charAt(0).toUpperCase() }}</div>
                  <div class="cm-merc-info">
                    <h4>{{ m.nombre }}</h4>
                    @if (m.activo_ahora) {
                      <span class="cm-pill green"><span class="dot"></span> En punto</span>
                    } @else {
                      <span class="cm-pill gray">Inactivo</span>
                    }""",
    """              <div class="cm-merc-card">
                <div class="cm-merc-top">
                  <div class="cm-avatar">{{ (m.nombre || '?').charAt(0).toUpperCase() }}</div>
                  <div class="cm-merc-info">
                    <h4>{{ m.nombre }}</h4>
                    <div class="flex items-center gap-1.5 mt-0.5 mb-1 text-[11px] text-slate-500 font-medium">
                      <mat-icon class="!text-[12px] !h-3 !w-3 text-slate-400">location_on</mat-icon>
                      <span class="truncate">{{ m.departamentos_str || 'Sin departamento' }}</span>
                      <span class="opacity-30">|</span>
                      <mat-icon class="!text-[12px] !h-3 !w-3 text-slate-400">route</mat-icon>
                      <span class="truncate">{{ m.rutas_str || 'Sin ruta' }}</span>
                    </div>
                    @if (m.activo_ahora) {
                      <span class="cm-pill green"><span class="dot"></span> En punto</span>
                    } @else {
                      <span class="cm-pill gray">Inactivo</span>
                    }"""
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated successfully")
