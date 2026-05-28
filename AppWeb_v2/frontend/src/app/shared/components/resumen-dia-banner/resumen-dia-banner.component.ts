// shared/components/resumen-dia-banner/resumen-dia-banner.component.ts
//
// Banner "Resumen del Día" del Centro de Mando — v2 Angular.
// Equivale al banner Flask en AppWeb/.../centro-mando-resumen-banner.js.
//
// Consume:
//   GET /api/centro-mando/resumen-dia?cliente_id&fecha
//   GET /api/centro-mando/clientes
//
// Acepta input `clienteFijo` para modo coordinador (sin selector).

import { Component, OnInit, signal, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../../../environments/environment';

interface ClienteOpcion { id_cliente: number; cliente: string; }
interface FaltanteDetalle {
  id_mercaderista: number;
  nombre: string;
  rutas_nombres: string[];
  rutas_planificadas: number;
  pois_planificados: number;
  tipo_servicio: 'Exclusivo' | 'Tradex';
}
interface ResumenDia {
  success: boolean;
  cliente_id: number | null;
  cliente_nombre: string;
  fecha: string;
  dia_semana: string;
  mercaderistas: {
    total_asignados: number;
    planificados_hoy: number;
    activos_hoy: number;
    faltantes_hoy: number;
    exclusivos: number;
    tradex: number;
    faltantes: FaltanteDetalle[];
  };
  rutas:           { planificadas: number; activas: number; completadas: number; };
  puntos_interes:  { planificados: number; activos: number; completados: number; };
  clientes_tradex: { planificados: number; activos: number; completados: number; aplica: boolean; };
}

type EstadoBanner = 'idle' | 'loading' | 'ok' | 'empty' | 'error';

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

@Component({
  selector: 'app-resumen-dia-banner',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatIconModule, MatButtonModule, MatProgressSpinnerModule,
    MatSelectModule, MatFormFieldModule, MatInputModule, MatTooltipModule,
  ],
  templateUrl: './resumen-dia-banner.component.html',
  styleUrls: ['./resumen-dia-banner.component.scss'],
})
export class ResumenDiaBannerComponent implements OnInit {
  /** Fija un cliente_id (modo coordinador exclusivo); oculta el selector. */
  clienteFijo = input<number | null>(null);

  estado     = signal<EstadoBanner>('idle');
  error      = signal<string>('');
  fecha      = signal<string>(todayIso());
  clienteId  = signal<number | null>(null);
  clientes   = signal<ClienteOpcion[] | null>(null);
  data       = signal<ResumenDia | null>(null);
  faltantesAbiertos = signal<boolean>(false);

  hoyIso = todayIso();

  showSelector = computed(() => this.clienteFijo() == null);
  titulo = computed(() => {
    const d = this.data();
    return (this.estado() === 'ok' && d) ? `${d.dia_semana} ${d.fecha}` : this.fecha();
  });
  subtitulo = computed(() => this.data()?.cliente_nombre ?? '');

  pct = (a: number, b: number) => b ? Math.round(a*100/b) : 0;
  pctClass = (p: number) => p >= 80 ? 'rd-good' : (p >= 50 ? 'rd-warn' : 'rd-bad');

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const cf = this.clienteFijo();
    if (cf != null) this.clienteId.set(cf);
    this.fetchClientes();
    this.fetch();
  }

  fetch(): void {
    this.estado.set('loading');
    this.error.set('');

    let url = `${environment.apiUrl}/api/centro-mando/resumen-dia?fecha=${this.fecha()}`;
    const cid = this.clienteId();
    if (cid != null) url += `&cliente_id=${cid}`;

    this.http.get<ResumenDia>(url).subscribe({
      next: (r) => {
        if (!r || !r.success) {
          this.estado.set('error');
          this.error.set('Respuesta inválida del servidor');
          return;
        }
        this.data.set(r);
        const tieneData = r.mercaderistas.total_asignados > 0 || r.rutas.planificadas > 0;
        this.estado.set(tieneData ? 'ok' : 'empty');
      },
      error: (err) => {
        this.estado.set('error');
        const detail = err?.error?.detail || err?.error?.message;
        this.error.set(detail
          ? `Error ${err.status || ''}: ${detail}`
          : `Error ${err.status || 'desconocido'} al cargar el resumen.`);
      },
    });
  }

  fetchClientes(): void {
    if (this.clientes()) return;
    if (!this.showSelector()) return;
    this.http.get<{success: boolean; clientes: ClienteOpcion[]}>(
      `${environment.apiUrl}/api/centro-mando/clientes`
    ).subscribe({
      next: (r) => { if (r?.success) this.clientes.set(r.clientes || []); },
      error: () => { this.clientes.set([]); },
    });
  }

  onFechaChange(v: string): void {
    if (!v) return;
    this.fecha.set(v);
    this.fetch();
  }

  onClienteChange(v: number | null | string): void {
    const parsed = (v === '' || v == null) ? null : Number(v);
    this.clienteId.set(Number.isNaN(parsed!) ? null : parsed);
    this.fetch();
  }

  shiftDia(days: number): void {
    const d = new Date(this.fecha() + 'T00:00:00');
    d.setDate(d.getDate() + days);
    const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (iso > this.hoyIso) return;
    this.fecha.set(iso);
    this.fetch();
  }

  goHoy(): void {
    this.fecha.set(todayIso());
    this.fetch();
  }

  toggleFaltantes(): void {
    this.faltantesAbiertos.update(v => !v);
  }
}
