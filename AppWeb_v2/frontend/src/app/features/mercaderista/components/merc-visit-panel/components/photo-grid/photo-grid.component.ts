import { Component, Input, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../../../../core/services/api.service';
import { OfflineQueueService } from '../../../../services/offline-queue.service';

@Component({
  selector: 'app-photo-grid',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="grid grid-cols-2 gap-4">
      @for (tipo of tipos(); track tipo.codigo) {
        <div class="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl p-4 shadow-sm flex flex-col gap-3 min-h-[160px] transition-all" [class.border-emerald-500]="tipo.foto">
          
          <!-- Tipo Info -->
          <div class="flex items-start justify-between">
            <div class="flex flex-col">
              <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Tipo de Foto</span>
              <h4 class="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">{{ tipo.label }}</h4>
            </div>
            @if (tipo.solo_camara) {
              <div class="px-1.5 py-0.5 bg-amber-500 text-white text-[7px] font-black uppercase rounded-md flex items-center gap-0.5">
                <mat-icon class="!text-[8px] !w-[8px] !h-[8px]">camera_alt</mat-icon> Cam Only
              </div>
            }
          </div>

          <!-- Preview / Placeholder -->
          <div class="flex-grow flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden relative group">
            @if (tipo.foto) {
              <img [src]="tipo.foto.url" class="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500">
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <button (click)="triggerUpload(tipo)" class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white">
                  <mat-icon>refresh</mat-icon>
                </button>
              </div>
            } @else {
              <div class="flex flex-col items-center gap-1 opacity-20">
                <mat-icon class="!text-3xl">add_a_photo</mat-icon>
              </div>
              <input type="file" 
                     [id]="'file-' + tipo.codigo"
                     class="absolute inset-0 opacity-0 cursor-pointer" 
                     accept="image/*"
                     [attr.capture]="tipo.solo_camara ? 'camera' : null"
                     (change)="onFileSelected($event, tipo)">
            }
            
            @if (isUploading(tipo.codigo)) {
              <div class="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                <mat-spinner diameter="24"></mat-spinner>
                <span class="text-[8px] font-black uppercase tracking-widest text-primary-500">Subiendo...</span>
              </div>
            }
          </div>

          @if (!tipo.foto) {
            <button (click)="triggerUpload(tipo)" class="w-full py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Capturar
            </button>
          } @else {
             <div class="flex items-center justify-between px-1">
                <span class="text-[8px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                  <mat-icon class="!text-[10px] !w-[10px] !h-[10px]">check_circle</mat-icon> Registrada
                </span>
                <span class="text-[8px] font-bold text-slate-400 italic">{{ tipo.foto.fecha | date:'shortTime' }}</span>
             </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class PhotoGridComponent implements OnInit {
  @Input() visitaId!: number;
  
  private api = inject(ApiService);
  private offline = inject(OfflineQueueService);

  tipos = signal<any[]>([]);
  uploading = signal<Set<string>>(new Set());

  ngOnInit() {
    this.loadFotos();
  }

  loadFotos() {
    this.api.getFotosVisita(this.visitaId).subscribe(res => {
      this.tipos.set(res.tipos);
    });
  }

  triggerUpload(tipo: any) {
    const input = document.getElementById('file-' + tipo.codigo) as HTMLInputElement;
    input?.click();
  }

  isUploading(codigo: string): boolean {
    return this.uploading().has(codigo);
  }

  async onFileSelected(event: Event, tipo: any) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const updated = this.tipos().map(t => {
        if (t.codigo === tipo.codigo) {
          return { ...t, foto: { url: e.target.result, fecha: new Date() } };
        }
        return t;
      });
      this.tipos.set(updated);
    };
    reader.readAsDataURL(file);

    this.uploading.update(s => { s.add(tipo.codigo); return new Set(s); });

    try {
      await this.offline.enqueuePhoto(this.visitaId, tipo.codigo, file);
    } finally {
      this.uploading.update(s => { s.delete(tipo.codigo); return new Set(s); });
    }
  }
}
