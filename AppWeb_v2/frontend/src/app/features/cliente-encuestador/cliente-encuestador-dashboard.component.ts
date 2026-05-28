// features/cliente-encuestador/cliente-encuestador-dashboard.component.ts
//
// Dashboard BI para Cliente Encuestador (id_rol = 13).
// - KPIs cards arriba
// - 10 gráficos Chart.js (donut/bar/line) + heatmap + mapa Leaflet
// - Sidebar de filtros multi-select reactivos
// - Tabla maestra paginada con búsqueda
// - Export CSV de la data filtrada

import {
  Component, OnInit, AfterViewInit, signal, computed,
  ElementRef, ViewChild, ViewChildren, QueryList, OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { forkJoin, Subject, of, debounceTime } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';
import * as L from 'leaflet';

import {
  ClienteEncuestadorService, Filtros, FiltrosResponse, KPIs,
  RankingEncuestador, MapaEstado, Heatmap, Temporal, ChartLabelsData,
  MedicoTablaRow,
} from './cliente-encuestador.service';

Chart.register(...registerables);

const PALETTE = [
  '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444',
  '#ec4899', '#3b82f6', '#84cc16', '#f97316', '#a855f7',
  '#14b8a6', '#eab308',
];

const VE_ESTADOS_LATLNG: Record<string, [number, number]> = {
  'Amazonas': [5.6634, -67.6262], 'Anzoátegui': [10.13, -64.69],
  'Apure': [7.8939, -67.4717], 'Aragua': [10.2469, -67.5958],
  'Barinas': [8.6231, -70.2076], 'Bolívar': [8.1224, -63.5497],
  'Carabobo': [10.162, -68.0077], 'Cojedes': [9.6526, -68.5734],
  'Delta Amacuro': [8.3517, -62.6447], 'Distrito Capital': [10.4806, -66.9036],
  'Falcón': [11.4045, -69.6797], 'Guárico': [9.91, -67.35],
  'Lara': [10.064, -69.357], 'Mérida': [8.5897, -71.1561],
  'Miranda': [10.2755, -66.809], 'Monagas': [9.7466, -63.1839],
  'Nueva Esparta': [10.9571, -63.8514], 'Portuguesa': [9.0476, -69.347],
  'Sucre': [10.4543, -64.1751], 'Táchira': [7.7669, -72.2247],
  'Trujillo': [9.3697, -70.438], 'Vargas': [10.6017, -66.9341],
  'La Guaira': [10.6017, -66.9341], 'Yaracuy': [10.082, -68.9092],
  'Zulia': [10.6427, -71.6125],
};

@Component({
  selector: 'app-cliente-encuestador-dashboard',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatProgressSpinnerModule, MatTooltipModule,
    MatChipsModule, MatTableModule, MatPaginatorModule,
  ],
  templateUrl: './cliente-encuestador-dashboard.component.html',
  styleUrls: ['./cliente-encuestador-dashboard.component.scss'],
})
export class ClienteEncuestadorDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  // ── Estado ──
  loading = signal(true);
  filtros = signal<Filtros>({});
  catalogos = signal<FiltrosResponse | null>(null);
  kpis = signal<KPIs | null>(null);
  ranking = signal<RankingEncuestador[]>([]);

  tabla = signal<MedicoTablaRow[]>([]);
  tablaTotal = signal(0);
  tablaPage = signal(1);
  tablaPerPage = signal(25);
  tablaSearch = '';
  private tablaSearch$ = new Subject<string>();
  displayedColumns = ['id', 'medico', 'especialidad', 'centro', 'ciudad', 'estado',
                      'valor', 'pacientes', 'fecha', 'encuestador'];

  // Refs a canvas
  @ViewChild('chEsp')     chEsp!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chValor')   chValor!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chPac')     chPac!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chEstado')  chEstado!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chUni')     chUni!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chCentros') chCentros!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chValorEsp') chValorEsp!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chDias')    chDias!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chTiempo')  chTiempo!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chContact') chContact!: ElementRef<HTMLCanvasElement>;
  @ViewChild('mapEl')     mapEl!: ElementRef<HTMLDivElement>;

  private charts: Record<string, Chart> = {};
  private map?: L.Map;
  private mapLayer?: L.LayerGroup;
  heatmap = signal<Heatmap>({ x: [], y: [], matrix: [] });

  constructor(private svc: ClienteEncuestadorService) {}

  ngOnInit(): void {
    this.svc.getFiltros().subscribe(c => this.catalogos.set(c));
    this.tablaSearch$.pipe(debounceTime(350)).subscribe(() => {
      this.tablaPage.set(1);
      this.loadTabla();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.refreshAll(), 0);
  }

  ngOnDestroy(): void {
    Object.values(this.charts).forEach(c => c.destroy());
    if (this.map) this.map.remove();
  }

  // ── Filtros ──
  aplicarFiltros(): void { this.tablaPage.set(1); this.refreshAll(); }
  limpiarFiltros(): void { this.filtros.set({}); this.aplicarFiltros(); }

  onTablaSearch(v: string): void {
    this.tablaSearch = v;
    this.tablaSearch$.next(v);
  }
  onPage(e: PageEvent): void {
    this.tablaPage.set(e.pageIndex + 1);
    this.tablaPerPage.set(e.pageSize);
    this.loadTabla();
  }

  refreshAll(): void {
    this.loading.set(true);
    const f = this.filtros();

    forkJoin({
      kpis:    this.svc.getKPIs(f),
      esp:     this.svc.getChart('especialidad', f).pipe(catchError(() => of<ChartLabelsData>({labels:[],data:[]}))),
      valor:   this.svc.getChart('valor-consulta', f).pipe(catchError(() => of<ChartLabelsData>({labels:[],data:[]}))),
      pac:     this.svc.getChart('pacientes-semana', f).pipe(catchError(() => of<ChartLabelsData>({labels:[],data:[]}))),
      est:     this.svc.getChart('estado', f).pipe(catchError(() => of<ChartLabelsData>({labels:[],data:[]}))),
      uni:     this.svc.getChart('universidad', f).pipe(catchError(() => of<ChartLabelsData>({labels:[],data:[]}))),
      centros: this.svc.getChart('centros-top', f).pipe(catchError(() => of<ChartLabelsData>({labels:[],data:[]}))),
      vesp:    this.svc.getChart('valor-por-especialidad', f).pipe(catchError(() => of<ChartLabelsData>({labels:[],data:[]}))),
      dias:    this.svc.getChart('dias-consulta', f).pipe(catchError(() => of<ChartLabelsData>({labels:[],data:[]}))),
      temp:    this.svc.getTemporal(f).pipe(catchError(() => of<Temporal>({labels:[],encuestas:[],medicos:[]}))),
      hmap:    this.svc.getHeatmap(f).pipe(catchError(() => of<Heatmap>({x:[],y:[],matrix:[]}))),
      ranking: this.svc.getRanking(f).pipe(catchError(() => of<RankingEncuestador[]>([]))),
      mapa:    this.svc.getMapa(f).pipe(catchError(() => of<MapaEstado[]>([]))),
    }).subscribe(r => {
      this.kpis.set(r.kpis);
      this.ranking.set(r.ranking);
      this.heatmap.set(r.hmap);

      this.doughnut('esp',   this.chEsp,   r.esp.labels,   r.esp.data);
      this.doughnut('valor', this.chValor, r.valor.labels, r.valor.data);
      this.doughnut('pac',   this.chPac,   r.pac.labels,   r.pac.data);
      this.bar('estado',  this.chEstado, r.est.labels,     r.est.data, false);
      this.bar('uni',     this.chUni,    r.uni.labels,     r.uni.data, true);
      this.bar('centros', this.chCentros,r.centros.labels, r.centros.data, true);
      this.bar('vesp',    this.chValorEsp, r.vesp.labels,  r.vesp.data, true);
      this.bar('dias',    this.chDias,   r.dias.labels,    r.dias.data, false);
      this.line('tiempo', this.chTiempo, r.temp.labels.map(x => x || ''),
                [{ label: 'Encuestas', data: r.temp.encuestas },
                 { label: 'Médicos',   data: r.temp.medicos }]);

      this.drawContact(r.kpis);
      this.drawMap(r.mapa);
      this.loadTabla();
      this.loading.set(false);
    });
  }

  loadTabla(): void {
    this.svc.getMedicosTabla(this.filtros(), this.tablaPage(), this.tablaPerPage(), this.tablaSearch)
      .subscribe(r => {
        this.tabla.set(r.medicos);
        this.tablaTotal.set(r.total);
      });
  }

  // ── Chart builders ──
  private destroy(name: string): void {
    if (this.charts[name]) { this.charts[name].destroy(); delete this.charts[name]; }
  }

  private doughnut(name: string, ref: ElementRef<HTMLCanvasElement>, labels: string[], data: number[]) {
    this.destroy(name);
    if (!ref?.nativeElement) return;
    this.charts[name] = new Chart(ref.nativeElement, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: PALETTE, borderWidth: 2 }] },
      options: {
        cutout: '60%',
        plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } } },
      },
    });
  }

  private bar(name: string, ref: ElementRef<HTMLCanvasElement>, labels: string[], data: number[], horizontal: boolean) {
    this.destroy(name);
    if (!ref?.nativeElement) return;
    this.charts[name] = new Chart(ref.nativeElement, {
      type: 'bar',
      data: { labels, datasets: [{ data, backgroundColor: PALETTE, borderRadius: 6 }] },
      options: {
        indexAxis: horizontal ? 'y' : 'x',
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { font: { size: 10 } } }, y: { ticks: { font: { size: 10 } } } },
      },
    });
  }

  private line(name: string, ref: ElementRef<HTMLCanvasElement>, labels: string[],
               datasets: { label: string; data: number[] }[]) {
    this.destroy(name);
    if (!ref?.nativeElement) return;
    this.charts[name] = new Chart(ref.nativeElement, {
      type: 'line',
      data: { labels, datasets: datasets.map((d, i) => ({
        ...d, borderColor: PALETTE[i], backgroundColor: PALETTE[i] + '33',
        borderWidth: 2, tension: .35, pointRadius: 3, fill: true,
      })) },
      options: { scales: { y: { beginAtZero: true } } },
    });
  }

  private drawContact(k: KPIs) {
    this.destroy('contact');
    if (!this.chContact?.nativeElement) return;
    this.charts['contact'] = new Chart(this.chContact.nativeElement, {
      type: 'bar',
      data: {
        labels: ['WhatsApp', 'Email', 'Teléfono', 'Instagram', 'LinkedIn'],
        datasets: [{
          data: [k.pct_whatsapp, k.pct_email, k.pct_telefono, k.pct_instagram, k.pct_linkedin],
          backgroundColor: PALETTE.slice(0, 5),
          borderRadius: 6,
        }],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: c => `${c.formattedValue}%` } },
        },
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { callback: v => `${v}%` } },
        },
      },
    });
  }

  private drawMap(data: MapaEstado[]) {
    if (!this.map && this.mapEl?.nativeElement) {
      this.map = L.map(this.mapEl.nativeElement).setView([7.5, -66.0], 6);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18, attribution: '© OSM, © CARTO',
      }).addTo(this.map);
    }
    if (!this.map) return;
    if (this.mapLayer) this.map.removeLayer(this.mapLayer);
    const group = L.layerGroup();
    const max = Math.max(1, ...data.map(d => d.valor));
    for (const d of data) {
      const ll = VE_ESTADOS_LATLNG[d.estado];
      if (!ll) continue;
      const r = 8 + (d.valor / max) * 28;
      L.circleMarker(ll, {
        radius: r, color: '#8b5cf6', weight: 1.5,
        fillColor: '#8b5cf6', fillOpacity: .55,
      }).bindTooltip(`<strong>${d.estado}</strong><br>${d.valor} médicos`).addTo(group);
    }
    group.addTo(this.map);
    this.mapLayer = group;
  }

  // ── Export CSV ──
  exportCSV(): void {
    this.svc.getMedicosTabla(this.filtros(), 1, 10000, this.tablaSearch).subscribe(r => {
      if (!r.medicos.length) { alert('Sin datos para exportar'); return; }
      const cols = ['id_medico_externo','nombre_completo','especialidad','sub_especialidad',
                    'universidad','centro','ciudad','estado','telefono','whatsapp','email',
                    'valor_consulta_rango','promedio_pacientes','dias_consulta',
                    'fecha_verificacion','encuestador'];
      const esc = (v: any) => v == null ? '' : '"' + String(v).replace(/"/g, '""') + '"';
      const csv = [cols.join(',')]
        .concat(r.medicos.map(m => cols.map(c => esc((m as any)[c])).join(',')))
        .join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `medicos_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
    });
  }

  // ── Helpers para template ──
  heatmapAlpha(value: number): number {
    const flat = this.heatmap().matrix.flat();
    const max = Math.max(1, ...flat);
    return value ? Math.max(.1, value / max) : 0;
  }
  heatmapStyle(v: number): string {
    return `background: rgba(139, 92, 246, ${this.heatmapAlpha(v)});`;
  }
}
