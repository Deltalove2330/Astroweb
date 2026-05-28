// features/encuestador/encuestador.service.ts
// Wrapper de los 11 endpoints de /api/encuestador (FastAPI v2).

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// ─── Tipos ───────────────────────────────────────────────────────
export interface JornadaActivaResponse {
  success: boolean;
  activa: boolean;
  id_jornada?: number;
  fecha_inicio?: string;
  ciudad?: string | null;
  estado_geo?: string | null;
  medicos_registrados?: number;
  centros_visitados?: number;
}

export interface ActivarJornadaPayload {
  latitud?: number | null;
  longitud?: number | null;
  ciudad?: string | null;
  estado_geo?: string | null;
}

export interface Centro {
  id_centro: number;
  nombre_centro: string;
  direccion_completa?: string;
  ciudad?: string | null;
  estado?: string | null;
}
export interface CentroCreatePayload {
  nombre_centro: string;
  direccion_completa: string;
  ciudad?: string | null;
  estado?: string | null;
}

export interface EncuestaCrearPayload {
  id_centro: number;
  fuente_informacion?: string;
  notas_generales?: string | null;
}

export interface MedicoEnEncuesta {
  id_medico_centro: number;
  id_medico_externo: string;
  apellido1: string;
  apellido2?: string | null;
  nombre1: string;
  nombre2?: string | null;
  especialidad: string;
  valor_consulta_rango: string;
  promedio_pacientes_semanal_rango: string;
}

export interface EncuestaAbiertaResponse {
  success: boolean;
  tiene_encuesta: boolean;
  jornada_activa: boolean;
  id_jornada?: number;
  id_encuesta?: number;
  id_centro?: number;
  nombre_centro?: string;
  ciudad?: string | null;
  estado?: string | null;
  fecha_verificacion?: string;
  fuente_informacion?: string;
  medicos?: MedicoEnEncuesta[];
}

export interface MedicoCatalogo {
  id_medico: number;
  id_medico_externo: string;
  apellido1: string;
  apellido2?: string | null;
  nombre1: string;
  nombre2?: string | null;
  especialidad: string;
  sub_especialidad?: string | null;
  universidad_graduacion?: string | null;
  nro_MPPS?: string | null;
  nro_colegiado?: string | null;
  ciudad: string;
  estado: string;
  telefono?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
}

export interface MedicoCentroPayload {
  id_medico?: number | null;
  // Datos del médico (si nuevo)
  id_medico_externo?: string;
  apellido1?: string;
  apellido2?: string | null;
  nombre1?: string;
  nombre2?: string | null;
  especialidad?: string;
  sub_especialidad?: string | null;
  universidad_graduacion?: string | null;
  nro_MPPS?: string | null;
  nro_colegiado?: string | null;
  ciudad?: string;
  estado?: string;
  telefono?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  // Consultorio 1
  piso_consultorio?: string | null;
  horarios_consulta?: string | null;
  dias_consulta?: string | null;
  direccion_especifica?: string | null;
  // Consultorio 2
  clinica2_nombre?: string | null;
  piso_consultorio2?: string | null;
  horarios_consulta2?: string | null;
  dias_consulta2?: string | null;
  direccion_especifica2?: string | null;
  // Económicos
  valor_consulta_rango: string;
  promedio_pacientes_semanal_rango: string;
}

export interface Catalogos {
  valor_consulta_rangos: string[];
  promedio_pacientes_rangos: string[];
  fuentes_informacion: string[];
  dias_consulta: string[];
}

@Injectable({ providedIn: 'root' })
export class EncuestadorService {
  private base = `${environment.apiUrl}/api/encuestador`;
  constructor(private http: HttpClient) {}

  // Jornada
  getJornadaActiva(): Observable<JornadaActivaResponse> {
    return this.http.get<JornadaActivaResponse>(`${this.base}/jornada-activa`);
  }
  activarJornada(payload: ActivarJornadaPayload = {}): Observable<JornadaActivaResponse> {
    return this.http.post<JornadaActivaResponse>(`${this.base}/activar-jornada`, payload);
  }
  finalizarJornada(): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.base}/finalizar-jornada`, {});
  }

  // Centros
  buscarCentros(q?: string): Observable<{ success: boolean; centros: Centro[] }> {
    const url = `${this.base}/centros` + (q ? `?q=${encodeURIComponent(q)}` : '');
    return this.http.get<{ success: boolean; centros: Centro[] }>(url);
  }
  crearCentro(payload: CentroCreatePayload): Observable<Centro & { success: boolean }> {
    return this.http.post<Centro & { success: boolean }>(`${this.base}/centros`, payload);
  }

  // Encuesta del centro
  getEncuestaAbierta(): Observable<EncuestaAbiertaResponse> {
    return this.http.get<EncuestaAbiertaResponse>(`${this.base}/encuesta-abierta`);
  }
  crearEncuesta(payload: EncuestaCrearPayload): Observable<{ success: boolean; id_encuesta: number; id_jornada: number }> {
    return this.http.post<{ success: boolean; id_encuesta: number; id_jornada: number }>(`${this.base}/encuestas`, payload);
  }
  cerrarEncuesta(idEncuesta: number): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.base}/encuestas/${idEncuesta}/cerrar`, {});
  }

  // Médicos
  buscarMedicos(q: string): Observable<{ success: boolean; medicos: MedicoCatalogo[] }> {
    return this.http.get<{ success: boolean; medicos: MedicoCatalogo[] }>(
      `${this.base}/medicos/buscar?q=${encodeURIComponent(q)}`
    );
  }
  guardarMedicoCentro(payload: MedicoCentroPayload): Observable<{ success: boolean; id_medico: number; id_encuesta: number; medicos_en_centro: number }> {
    return this.http.post<{ success: boolean; id_medico: number; id_encuesta: number; medicos_en_centro: number }>(
      `${this.base}/medico-centro`, payload
    );
  }

  // Catálogos
  getCatalogos(): Observable<Catalogos> {
    return this.http.get<Catalogos>(`${this.base}/catalogos`);
  }
}
