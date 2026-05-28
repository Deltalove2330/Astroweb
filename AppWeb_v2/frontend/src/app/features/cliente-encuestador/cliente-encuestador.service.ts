// features/cliente-encuestador/cliente-encuestador.service.ts
//
// Wrapper de los 16 endpoints de /api/cliente-encuestador (FastAPI v2).
// Todos los gráficos comparten un mismo objeto Filtros que se serializa
// a query params.

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Filtros {
  fecha_desde?: string | null;
  fecha_hasta?: string | null;
  estados?: string[];
  ciudades?: string[];
  especialidades?: string[];
  sub_especialidades?: string[];
  universidades?: string[];
  centros?: (number | string)[];
  encuestadores?: (number | string)[];
  fuentes?: string[];
  valor_consulta_rangos?: string[];
  promedio_pacientes_rangos?: string[];
  dias_consulta?: string[];
}

export interface FiltrosResponse {
  success: boolean;
  especialidades: string[];
  sub_especialidades: string[];
  estados: string[];
  ciudades: string[];
  universidades: string[];
  centros: { id_centro: number; nombre_centro: string }[];
  encuestadores: { id_usuario: number; username: string }[];
  fuentes: string[];
  valor_consulta_rangos: string[];
  promedio_pacientes_rangos: string[];
  dias_consulta: string[];
}

export interface KPIs {
  success: boolean;
  total_medicos: number;
  total_centros: number;
  total_especialidades: number;
  total_estados: number;
  total_ciudades: number;
  total_encuestas: number;
  encuestas_30d: number;
  medicos_con_2do_consultorio: number;
  pct_2do_consultorio: number;
  pct_whatsapp: number;
  pct_email: number;
  pct_telefono: number;
  pct_instagram: number;
  pct_linkedin: number;
}

export interface ChartLabelsData { labels: string[]; data: number[]; }
export interface Heatmap { x: string[]; y: string[]; matrix: number[][]; }
export interface Temporal { labels: (string | null)[]; encuestas: number[]; medicos: number[]; }
export interface MapaEstado { estado: string; valor: number; }
export interface RankingEncuestador {
  id_usuario: number; username: string;
  medicos: number; centros: number; encuestas: number;
}
export interface MedicoTablaRow {
  id_medico: number; id_medico_externo: string; nombre_completo: string;
  especialidad: string; sub_especialidad?: string; universidad?: string;
  ciudad: string; estado: string;
  telefono?: string; whatsapp?: string; email?: string;
  centro: string; valor_consulta_rango: string;
  promedio_pacientes: string; dias_consulta: string;
  fecha_verificacion?: string; encuestador?: string;
}
export interface MedicosTablaResponse {
  success: boolean; total: number; page: number; per_page: number;
  medicos: MedicoTablaRow[];
}

@Injectable({ providedIn: 'root' })
export class ClienteEncuestadorService {
  private base = `${environment.apiUrl}/api/cliente-encuestador`;

  constructor(private http: HttpClient) {}

  private buildParams(f: Filtros): HttpParams {
    let p = new HttpParams();
    if (f.fecha_desde) p = p.set('fecha_desde', f.fecha_desde);
    if (f.fecha_hasta) p = p.set('fecha_hasta', f.fecha_hasta);

    const arr = (name: keyof Filtros) => {
      const v = f[name] as unknown[];
      if (Array.isArray(v) && v.length) {
        for (const item of v) p = p.append(name as string, String(item));
      }
    };
    arr('estados'); arr('ciudades'); arr('especialidades'); arr('sub_especialidades');
    arr('universidades'); arr('centros'); arr('encuestadores'); arr('fuentes');
    arr('valor_consulta_rangos'); arr('promedio_pacientes_rangos'); arr('dias_consulta');
    return p;
  }

  getFiltros(): Observable<FiltrosResponse> {
    return this.http.get<FiltrosResponse>(`${this.base}/filtros`);
  }
  getKPIs(f: Filtros): Observable<KPIs> {
    return this.http.get<KPIs>(`${this.base}/kpis`, { params: this.buildParams(f) });
  }
  getChart(name: string, f: Filtros): Observable<any> {
    return this.http.get<any>(`${this.base}/charts/${name}`, { params: this.buildParams(f) });
  }
  getRanking(f: Filtros): Observable<RankingEncuestador[]> {
    return this.http.get<RankingEncuestador[]>(`${this.base}/charts/encuestadores-ranking`,
      { params: this.buildParams(f) });
  }
  getMapa(f: Filtros): Observable<MapaEstado[]> {
    return this.http.get<MapaEstado[]>(`${this.base}/charts/mapa-venezuela`,
      { params: this.buildParams(f) });
  }
  getHeatmap(f: Filtros): Observable<Heatmap> {
    return this.http.get<Heatmap>(`${this.base}/charts/heatmap-esp-estado`,
      { params: this.buildParams(f) });
  }
  getTemporal(f: Filtros): Observable<Temporal> {
    return this.http.get<Temporal>(`${this.base}/charts/temporal`,
      { params: this.buildParams(f) });
  }
  getMedicosTabla(f: Filtros, page: number, perPage: number, q?: string): Observable<MedicosTablaResponse> {
    let params = this.buildParams(f).set('page', String(page)).set('per_page', String(perPage));
    if (q && q.trim()) params = params.set('q', q.trim());
    return this.http.get<MedicosTablaResponse>(`${this.base}/medicos`, { params });
  }
}
