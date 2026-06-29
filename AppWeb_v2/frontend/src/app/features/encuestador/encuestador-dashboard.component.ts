import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-encuestador-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-white mb-6">Dashboard Encuestador</h1>
      
      <div *ngIf="loading" class="text-white">Cargando...</div>
      
      <div *ngIf="!loading && !jornadaActiva" class="bg-slate-900 rounded-xl p-8 border border-white/10 shadow-lg text-center max-w-2xl mx-auto mt-10">
        <div class="mb-4 flex justify-center">
          <div class="w-16 h-16 rounded-full border-2 border-indigo-500 flex items-center justify-center text-indigo-500">
            <span class="material-icons text-4xl ml-1">play_arrow</span>
          </div>
        </div>
        <h2 class="text-2xl font-semibold text-white mb-2">Inicia tu jornada</h2>
        <p class="text-slate-400 mb-8">Activa para comenzar a visitar centros de salud y registrar médicos.</p>
        <button (click)="activarJornada()" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg">
          <span class="material-icons">rocket_launch</span> Activar Jornada
        </button>
      </div>

      <div *ngIf="!loading && jornadaActiva" class="bg-slate-900 rounded-xl p-6 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-emerald-400">Jornada en Progreso</h2>
          <button (click)="finalizarJornada()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold">
            Finalizar Jornada
          </button>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div class="text-slate-400 text-sm">Centros Visitados</div>
            <div class="text-3xl font-bold text-white">{{ stats.centros_visitados }}</div>
          </div>
          <div class="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div class="text-slate-400 text-sm">Médicos Registrados</div>
            <div class="text-3xl font-bold text-white">{{ stats.medicos_registrados }}</div>
          </div>
        </div>
        
        <button routerLink="/encuestador/centro" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-lg transition-colors text-lg shadow-lg">
          Gestionar Centro de Salud
        </button>
      </div>
    </div>
  `
})
export class EncuestadorDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  loading = true;
  jornadaActiva = false;
  stats: any = { centros_visitados: 0, medicos_registrados: 0 };
  
  ngOnInit() {
    this.checkJornada();
  }
  
  checkJornada() {
    this.http.get<any>(`${environment.apiUrl}/api/encuestador/jornada-activa`).subscribe({
      next: (res) => {
        this.jornadaActiva = res.activa;
        if (res.activa) {
          this.stats = {
            centros_visitados: res.centros_visitados,
            medicos_registrados: res.medicos_registrados
          };
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
  
  activarJornada() {
    this.loading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => this.doActivar(pos.coords.latitude, pos.coords.longitude),
        () => this.doActivar(null, null),
        { timeout: 5000 }
      );
    } else {
      this.doActivar(null, null);
    }
  }
  
  doActivar(lat: number | null, lng: number | null) {
    this.http.post<any>(`${environment.apiUrl}/api/encuestador/activar-jornada`, {
      latitud: lat,
      longitud: lng,
      ciudad: '',
      estado_geo: ''
    }).subscribe({
      next: () => {
        // En lugar de quedarse en el dashboard, redirigir directo a seleccionar centro
        this.router.navigate(['/encuestador/centro']);
      },
      error: () => this.loading = false
    });
  }
  
  finalizarJornada() {
    if (confirm('¿Estás seguro de finalizar la jornada actual?')) {
      this.loading = true;
      this.http.post(`${environment.apiUrl}/api/encuestador/finalizar-jornada`, {}).subscribe({
        next: () => this.checkJornada(),
        error: () => this.loading = false
      });
    }
  }
}
