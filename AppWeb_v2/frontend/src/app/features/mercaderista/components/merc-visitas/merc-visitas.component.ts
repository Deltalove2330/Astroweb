import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../../core/services/api.service';
import { MercUiService } from '../../services/merc-ui.service';

@Component({
  selector: 'app-merc-visitas',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="p-4 space-y-6">
      
      <!-- Date Filter Placeholder (Simple for now) -->
      <div class="flex items-center justify-between px-2">
        <div class="flex flex-col">
          <h3 class="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Historial Reciente</h3>
          <span class="text-[10px] font-bold text-primary-500">Últimas 24 horas</span>
        </div>
        <button class="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500">
          <mat-icon>date_range</mat-icon>
        </button>
      </div>

      @if (loading()) {
        <div class="py-12 flex flex-col items-center gap-3">
          <mat-spinner diameter="32"></mat-spinner>
          <span class="text-xs text-slate-400 font-medium">Recuperando tus registros...</span>
        </div>
      } @else if (visitas().length === 0) {
        <div class="py-16 text-center flex flex-col items-center gap-4 opacity-30 grayscale">
          <mat-icon class="!text-6xl">history_toggle_off</mat-icon>
          <p class="font-bold">No tienes visitas registradas hoy</p>
        </div>
      } @else {
        <div class="space-y-4">
          @for (v of visitas(); track v.id_visita) {
            <div class="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-white/5 p-5 shadow-sm active:scale-[0.99] transition-all">
              
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
                    <mat-icon>store</mat-icon>
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="text-[10px] font-black text-primary-500 uppercase tracking-widest truncate">{{ v.cliente }}</span>
                    <h4 class="font-bold text-slate-800 dark:text-white truncate tracking-tight text-sm">{{ v.pdv_nombre }}</h4>
                  </div>
                </div>
                <div [class]="v.estado === 'Revisada' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'" 
                     class="px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest">
                  {{ v.estado }}
                </div>
              </div>

              <div class="grid grid-cols-3 gap-2 mb-4">
                <div class="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-white/5">
                  <div class="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase mb-0.5">
                    <mat-icon class="!text-[10px] !w-[10px] !h-[10px]">photo_library</mat-icon> Fotos
                  </div>
                  <span class="text-xs font-black text-slate-700 dark:text-slate-200">{{ v.fotos_count }}</span>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-white/5">
                  <div class="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase mb-0.5">
                    <mat-icon class="!text-[10px] !w-[10px] !h-[10px]">inventory_2</mat-icon> Data
                  </div>
                  <span class="text-xs font-black text-slate-700 dark:text-slate-200">{{ v.balances_count }}</span>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-white/5">
                  <div class="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase mb-0.5">
                    <mat-icon class="!text-[10px] !w-[10px] !h-[10px]">schedule</mat-icon> Hora
                  </div>
                  <span class="text-[9px] font-black text-slate-700 dark:text-slate-200">{{ v.fecha | date:'shortTime' }}</span>
                </div>
              </div>

              <button (click)="verDetalle(v)" class="w-full py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                Revisar Registro
              </button>
            </div>
          }
        </div>
      }

      <div class="h-10"></div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class MercVisitasComponent implements OnInit {
  private api = inject(ApiService);
  private ui = inject(MercUiService);
  
  loading = signal(true);
  visitas = signal<any[]>([]);

  ngOnInit(): void {
    this.loadVisitas();
  }

  loadVisitas(): void {
    this.loading.set(true);
    this.api.getMercMisVisitas().subscribe({
      next: (res) => {
        this.visitas.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  verDetalle(v: any): void {
    this.ui.openVisit({
      id_visita: v.id_visita,
      pdv_nombre: v.pdv_nombre,
      id_cliente: v.id_cliente,
      cliente: v.cliente
    });
  }
}
