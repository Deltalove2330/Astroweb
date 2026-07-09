import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-centro-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-white">Gestión de Centro</h1>
        <button routerLink="/encuestador/dashboard" class="text-slate-400 hover:text-white transition-colors">Volver al Dashboard</button>
      </div>
      
      <div *ngIf="loading" class="text-white flex items-center gap-3">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div> Cargando...
      </div>
      
      <div *ngIf="!loading && encuestaActiva" class="bg-slate-900 rounded-xl p-6 border border-emerald-500/30 shadow-lg mb-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-2xl font-bold text-emerald-400">{{ encuestaActiva.nombre_centro }}</h2>
            <p class="text-slate-400">{{ encuestaActiva.ciudad }}, {{ encuestaActiva.estado }}</p>
          </div>
          <button (click)="cerrarEncuesta()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg">
            Cerrar Centro
          </button>
        </div>
        
        <div class="mt-6 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white">Médicos Registrados ({{ encuestaActiva.medicos?.length || 0 }})</h3>
          <button routerLink="/encuestador/medico" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-lg shadow-indigo-500/20">
            + Agregar Médico
          </button>
        </div>
        
        <div class="mt-4 space-y-2">
          <div *ngFor="let m of encuestaActiva.medicos" class="bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-between items-center">
            <div>
              <div class="font-bold text-white">{{ m.apellido1 }} {{ m.apellido2 }}, {{ m.nombre1 }} {{ m.nombre2 }}</div>
              <div class="text-sm text-slate-400">{{ m.especialidad }}</div>
            </div>
            <div class="text-right">
              <span class="inline-block px-2 py-1 bg-slate-700 text-xs rounded text-slate-300">{{ m.valor_consulta_rango }}</span>
            </div>
          </div>
          <div *ngIf="!encuestaActiva.medicos?.length" class="text-slate-500 italic py-4">No hay médicos registrados en este centro aún.</div>
        </div>
      </div>

      <div *ngIf="!loading && !encuestaActiva" class="bg-slate-900 rounded-xl p-8 border border-white/10 shadow-xl max-w-4xl mx-auto">
        <div class="flex items-center gap-2 mb-6">
          <span class="material-icons text-indigo-400 !text-3xl">domain</span>
          <h2 class="text-2xl font-bold text-white">Selecciona un centro</h2>
        </div>
        
        <div class="mb-4 relative">
          <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
          <input type="text" [(ngModel)]="searchQuery" (input)="buscarCentros()" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner" placeholder="Buscar por nombre, ciudad o estado...">
        </div>
        
        <div class="max-h-96 overflow-y-auto mb-6 rounded-xl border border-slate-700 bg-slate-800/30 custom-scrollbar" *ngIf="centrosResult.length">
          <div *ngFor="let c of centrosResult; let last = last" 
               class="p-5 hover:bg-slate-700/80 cursor-pointer transition-colors group" 
               [class.border-b]="!last" 
               [class.border-slate-700]="!last"
               (click)="confirmarApertura(c)">
            <div class="font-bold text-white group-hover:text-indigo-300 transition-colors">{{ c.nombre_centro | uppercase }}</div>
            <div class="text-sm text-slate-400 mt-1">{{ c.direccion_completa }}</div>
          </div>
        </div>
        
        <div class="mt-6 pt-6 border-t border-slate-800" *ngIf="!mostrandoCrearCentro">
          <button (click)="mostrandoCrearCentro = true" class="w-full border-2 border-dashed border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-400 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            <span class="material-icons text-xl">add_business</span> Crear nuevo centro de salud
          </button>
        </div>
        
        <div class="mt-6 pt-6 border-t border-slate-800 animate-in slide-in-from-top-4 duration-300" *ngIf="mostrandoCrearCentro">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-indigo-300 flex items-center gap-2"><span class="material-icons">add_location_alt</span> Solicitud de Nuevo Centro</h3>
            <button (click)="mostrandoCrearCentro = false" class="text-slate-400 hover:text-white transition-colors bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center"><span class="material-icons !text-lg">close</span></button>
          </div>
          <div class="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Nombre del Centro *</label>
                <input type="text" [(ngModel)]="nuevoCentro.nombre_centro" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors">
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Dirección Completa *</label>
                <input type="text" [(ngModel)]="nuevoCentro.direccion_completa" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Ciudad</label>
                <input type="text" [(ngModel)]="nuevoCentro.ciudad" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Estado</label>
                <select [(ngModel)]="nuevoCentro.estado" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors">
                  <option value="">Seleccione un estado</option>
                  <option *ngFor="let est of estados" [value]="est.nombre">{{ est.nombre }}</option>
                </select>
              </div>
            </div>
            
            <div class="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex gap-3 text-indigo-300">
              <span class="material-icons mt-0.5">info</span>
              <p class="text-sm">Al enviar este formulario, se creará una solicitud que deberá ser aprobada por el equipo de ATC antes de que el centro aparezca en la lista.</p>
            </div>
          </div>
          
          <button (click)="crearCentro()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-xl transition-colors w-full flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:grayscale" [disabled]="!nuevoCentro.nombre_centro || !nuevoCentro.direccion_completa">
            <span class="material-icons">send</span> Enviar Solicitud a ATC
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
    <div *ngIf="centroAConfirmar" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div class="bg-slate-900 rounded-3xl p-8 max-w-md w-full border border-slate-700 shadow-2xl text-center relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <div class="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-indigo-500/30">
          <span class="material-icons text-4xl text-indigo-400">add_task</span>
        </div>
        <h3 class="text-2xl font-black text-white mb-2">¿Iniciar encuesta?</h3>
        <p class="text-slate-300 font-medium mb-8">{{ centroAConfirmar.nombre_centro }}</p>
        
        <div class="flex gap-4 justify-center">
          <button (click)="abrirEncuesta(centroAConfirmar.id_centro)" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
            Sí, iniciar
          </button>
          <button (click)="centroAConfirmar = null" class="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-colors border border-slate-700">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  `
})
export class CentroFormComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiService = inject(ApiService);
  
  loading = true;
  encuestaActiva: any = null;
  searchQuery = '';
  centrosResult: any[] = [];
  centroAConfirmar: any = null;
  mostrandoCrearCentro = false;
  estados: any[] = [];
  
  nuevoCentro = { nombre_centro: '', direccion_completa: '', ciudad: '', estado: '' };
  
  ngOnInit() {
    this.checkEncuesta();
    this.buscarCentros();
    this.apiService.getEstados().subscribe(res => {
      this.estados = res || [];
    });
  }
  
  checkEncuesta() {
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/api/encuestador/encuesta-abierta`).subscribe({
      next: (res) => {
        if (!res.jornada_activa) {
          this.router.navigate(['/encuestador/dashboard']);
          return;
        }
        if (res.tiene_encuesta) {
          this.encuestaActiva = res;
        } else {
          this.encuestaActiva = null;
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
  
  buscarCentros() {
    this.http.get<any>(`${environment.apiUrl}/api/encuestador/centros?q=${this.searchQuery}`).subscribe(res => {
      this.centrosResult = res.centros || [];
    });
  }
  
  crearCentro() {
    this.loading = true;
    this.http.post<any>(`${environment.apiUrl}/api/encuestador/centros`, this.nuevoCentro).subscribe({
      next: (res) => {
        this.loading = false;
        this.mostrandoCrearCentro = false;
        alert(res.message || 'Solicitud enviada exitosamente.');
        this.nuevoCentro = { nombre_centro: '', direccion_completa: '', ciudad: '', estado: '' };
      },
      error: () => {
        this.loading = false;
        alert('Hubo un error al enviar la solicitud.');
      }
    });
  }
  
  confirmarApertura(centro: any) {
    this.centroAConfirmar = centro;
  }

  abrirEncuesta(id_centro: number) {
    this.centroAConfirmar = null;
    this.loading = true;
    this.http.post<any>(`${environment.apiUrl}/api/encuestador/encuestas`, { id_centro }).subscribe({
      next: () => this.checkEncuesta(),
      error: () => this.loading = false
    });
  }
  
  cerrarEncuesta() {
    if (confirm('¿Estás seguro de cerrar este centro?')) {
      this.loading = true;
      this.http.post(`${environment.apiUrl}/api/encuestador/encuestas/${this.encuestaActiva.id_encuesta}/cerrar`, {}).subscribe({
        next: () => this.checkEncuesta(),
        error: () => this.loading = false
      });
    }
  }
}
