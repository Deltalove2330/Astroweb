import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiService } from '../../core/services/api.service';

import { Router } from '@angular/router';
import { Inject } from '@angular/core';

interface Region { region: string; }
interface Chain { cadena: string; }
interface Point { identificador: string; punto_de_interes: string; cadena: string; direccion: string; ciudad: string; }
interface PhotoItem { id_foto: number; id_tipo_foto: number; tipo_nombre: string; url: string; estado: string; fecha: string; }
interface Visit { id_visita: number; fecha: string; estado: string; mercaderista: string; total_fotos: number; fotos: PhotoItem[]; }

const REGION_EMOJIS: Record<string, string> = {
  andes: '🏔️', capital: '🏛️', centro: '🌆', insular: '🏝️',
  occidente: '🌅', oriente: '🌄', llanos: '🌾', zulia: '🌴',
};
const REGION_COLORS: Record<string, string> = {
  andes: '#6366f1', capital: '#8b5cf6', centro: '#06b6d4',
  insular: '#f59e0b', occidente: '#f97316', oriente: '#ec4899',
  llanos: '#22c55e', zulia: '#14b8a6',
};

const TIPO_FOTO_CONFIG: Record<number, { icon: string; color: string; gradient: string }> = {
  1: { icon: 'edit_note', color: '#6366f1', gradient: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' },
  2: { icon: 'edit_note', color: '#22c55e', gradient: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' },
  3: { icon: 'sell', color: '#f59e0b', gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' },
  4: { icon: 'grid_view', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)' },
  8: { icon: 'inventory_2', color: '#ec4899', gradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)' },
  9: { icon: 'inventory_2', color: '#14b8a6', gradient: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)' },
};

@Component({
  selector: 'app-client-photos',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatExpansionModule, MatFormFieldModule,
    MatInputModule, MatChipsModule, MatTooltipModule, MatDialogModule
  ],
  templateUrl: './client-photos.component.html',
  styleUrls: ['./client-photos.component.scss'],
})
export class ClientPhotosComponent implements OnInit {
  // State machine: 'regions' | 'chains' | 'points' | 'photos'
  view = signal<'regions' | 'chains' | 'points' | 'photos'>('regions');
  loading = signal(false);

  // Data
  regions = signal<Region[]>([]);
  chains = signal<Chain[]>([]);
  points = signal<Point[]>([]);
  visits = signal<Visit[]>([]);

  // Navigation context
  selectedRegion = signal<string>('');
  selectedChain = signal<string>('');
  selectedPoint = signal<Point | null>(null);

  // Search
  pointSearch = signal('');
  filteredPoints = computed(() => {
    const term = this.pointSearch().toLowerCase();
    const chain = this.selectedChain();
    return this.points().filter(p => {
      const matchChain = chain ? p.cadena === chain : true;
      const matchTerm = !term || p.punto_de_interes.toLowerCase().includes(term) || p.cadena.toLowerCase().includes(term);
      return matchChain && matchTerm;
    });
  });

  // Lightbox
  lightboxOpen = signal(false);
  lightboxPhoto = signal<PhotoItem | null>(null);

  // Dashboard modal
  dashboardOpen = signal(false);

  constructor(private api: ApiService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadRegions();
  }

  // ─── DATA LOADING ─────────────────────────────────────────────────
  loadRegions(): void {
    this.loading.set(true);
    this.api.getClientRegions().subscribe({
      next: data => { this.regions.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  selectRegion(region: string): void {
    this.selectedRegion.set(region);
    this.view.set('chains');
    this.loading.set(true);
    this.api.getClientChains(region).subscribe({
      next: data => { this.chains.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  selectChain(cadena: string): void {
    this.selectedChain.set(cadena);
  }

  loadPoints(): void {
    this.view.set('points');
    this.loading.set(true);
    this.api.getClientPoints(this.selectedRegion()).subscribe({
      next: data => { this.points.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  selectPoint(point: Point): void {
    this.selectedPoint.set(point);
    this.view.set('photos');
    this.loading.set(true);
    this.api.getClientPointVisits(point.identificador).subscribe({
      next: data => { 
        data.forEach(v => {
          v.total_fotos = this.getAllTipos(v.fotos).reduce((acc, curr) => acc + curr.count, 0);
        });
        this.visits.set(data); 
        this.loading.set(false); 
      },
      error: () => this.loading.set(false),
    });
  }

  // ─── NAVIGATION ───────────────────────────────────────────────────
  goBack(): void {
    const v = this.view();
    if (v === 'photos') { this.loadPoints(); }
    else if (v === 'points') { this.selectRegion(this.selectedRegion()); }
    else if (v === 'chains') { this.view.set('regions'); }
  }

  getBreadcrumb(): string[] {
    const crumbs: string[] = ['Regiones'];
    if (this.view() !== 'regions') crumbs.push(this.selectedRegion());
    if (this.view() === 'points' || this.view() === 'photos') crumbs.push('Puntos');
    if (this.view() === 'photos') crumbs.push(this.selectedPoint()?.punto_de_interes || '');
    return crumbs;
  }

  // ─── HELPERS ──────────────────────────────────────────────────────
  getRegionEmoji(region: string): string {
    const normalized = region.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const [key, emoji] of Object.entries(REGION_EMOJIS)) {
      if (normalized.includes(key)) return emoji;
    }
    return '📍';
  }

  getRegionColor(region: string): string {
    const normalized = region.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const [key, color] of Object.entries(REGION_COLORS)) {
      if (normalized.includes(key)) return color;
    }
    return '#6366f1';
  }

  getTipoConfig(tipo: number): { icon: string; color: string; gradient: string } {
    return TIPO_FOTO_CONFIG[tipo] || { icon: 'photo', color: '#94a3b8', gradient: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' };
  }

  groupFotosByTipo(fotos: PhotoItem[]): { tipo: number; nombre: string; fotos: PhotoItem[] }[] {
    const groups: Record<number, PhotoItem[]> = {};
    for (const f of fotos) {
      if (!groups[f.id_tipo_foto]) groups[f.id_tipo_foto] = [];
      groups[f.id_tipo_foto].push(f);
    }
    const TIPO_ORDER = [1, 2, 3, 4, 8, 9];
    return TIPO_ORDER
      .filter(t => groups[t])
      .map(t => ({ tipo: t, nombre: groups[t][0]?.tipo_nombre || 'Otro', fotos: groups[t] }));
  }

  getAllTipos(fotos: PhotoItem[]): { tipo: number; nombre: string; count: number; fotos: PhotoItem[] }[] {
    const ALL_TIPOS = [
      { tipo: 1, nombre: 'Gestión' },
      { tipo: 3, nombre: 'Precio' },
      { tipo: 4, nombre: 'Exhibiciones Adicionales' },
      { tipo: 8, nombre: 'Material POP Antes' },
      { tipo: 9, nombre: 'Material POP Después' },
    ];
    const grouped: Record<number, PhotoItem[]> = {};
    // Merge tipo 1 and 2 into "Gestión"
    for (const f of fotos) {
      const key = f.id_tipo_foto === 2 ? 1 : f.id_tipo_foto;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(f);
    }
    return ALL_TIPOS.map(t => ({
      ...t,
      count: grouped[t.tipo]?.length || 0,
      fotos: grouped[t.tipo] || [],
    }));
  }

  // ─── LIGHTBOX ─────────────────────────────────────────────────────
  openLightbox(foto: PhotoItem): void {
    this.lightboxPhoto.set(foto);
    this.lightboxOpen.set(true);
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
    this.lightboxPhoto.set(null);
  }

  goToChat(visitId: number): void {
    this.router.navigate(['/chat'], { queryParams: { visita: visitId } });
  }

  approvePhoto(foto: PhotoItem): void {
    this.api.approvePhotos([foto.id_foto]).subscribe({
      next: () => {
        foto.estado = 'Aprobada';
        this.closeLightbox();
      }
    });
  }

  rejectPhoto(foto: PhotoItem): void {
    const dialogRef = this.dialog.open(PhotoRejectionDialogComponent, {
      width: '500px',
      data: { foto },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.rejectPhoto(foto.id_foto, result).subscribe({
          next: () => {
            foto.estado = 'Rechazada';
            this.closeLightbox();
          }
        });
      }
    });
  }

  // ─── DASHBOARD ────────────────────────────────────────────────────
  toggleDashboard(): void {
    this.dashboardOpen.update(v => !v);
  }

  getPointsByChain(cadena: string): Point[] {
    return this.filteredPoints().filter(p => p.cadena === cadena);
  }
}

@Component({
  selector: 'app-photo-rejection-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
      <!-- Header -->
      <div class="bg-rose-600 text-white p-5 flex items-center justify-between">
        <h2 class="text-xl font-bold flex items-center gap-2 m-0">
          <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <mat-icon>block</mat-icon>
          </div>
          Rechazar Foto
        </h2>
        <button mat-icon-button (click)="dialogRef.close()" class="bg-black/10 hover:bg-black/20 transition-colors w-8 h-8 flex items-center justify-center rounded-full">
          <mat-icon class="text-[18px]">close</mat-icon>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <h3 class="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <mat-icon class="text-slate-400 text-sm">checklist</mat-icon>
          Motivos de rechazo
        </h3>
        
        <div class="bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-xl p-4 flex flex-col gap-2 mb-6">
          <mat-checkbox [(ngModel)]="motivos.resolucion" color="warn" class="text-slate-700 dark:text-slate-300 font-medium">Resolución</mat-checkbox>
          <mat-checkbox [(ngModel)]="motivos.orientacion" color="warn" class="text-slate-700 dark:text-slate-300 font-medium">Orientación de Foto</mat-checkbox>
          <mat-checkbox [(ngModel)]="motivos.planograma" color="warn" class="text-slate-700 dark:text-slate-300 font-medium">Incumplimiento de Planograma</mat-checkbox>
          <mat-checkbox [(ngModel)]="motivos.precio" color="warn" class="text-slate-700 dark:text-slate-300 font-medium">Falta Información de Precio</mat-checkbox>
          <mat-checkbox [(ngModel)]="motivos.pop" color="warn" class="text-slate-700 dark:text-slate-300 font-medium">Falta Material POP</mat-checkbox>
        </div>

        <h3 class="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <mat-icon class="text-slate-400 text-sm">chat</mat-icon>
          Comentario adicional
        </h3>
        
        <mat-form-field appearance="outline" class="w-full">
          <textarea matInput [(ngModel)]="comentario" rows="4" placeholder="Describe el problema o da instrucciones específicas..."></textarea>
        </mat-form-field>
      </div>

      <!-- Actions -->
      <div class="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3 rounded-b-2xl">
        <button mat-stroked-button (click)="dialogRef.close()" class="rounded-xl border-slate-300 dark:border-slate-600 font-bold">
          Cancelar
        </button>
        <button mat-flat-button color="warn" (click)="confirmar()" [disabled]="!isValido()" class="rounded-xl font-bold shadow-lg shadow-rose-500/20 px-6">
          <mat-icon class="mr-2">cancel</mat-icon>
          Confirmar Rechazo
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    ::ng-deep .custom-dialog-container .mat-mdc-dialog-container .mdc-dialog__surface {
      border-radius: 1rem !important;
      padding: 0 !important;
      overflow: hidden;
    }
  `]
})
export class PhotoRejectionDialogComponent {
  motivos = {
    resolucion: false,
    orientacion: false,
    planograma: false,
    precio: false,
    pop: false
  };
  comentario = '';

  constructor(
    public dialogRef: MatDialogRef<PhotoRejectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  isValido(): boolean {
    return Object.values(this.motivos).some(v => v) || this.comentario.trim().length > 0;
  }

  confirmar(): void {
    const seleccionados = [];
    if (this.motivos.resolucion) seleccionados.push('Resolución');
    if (this.motivos.orientacion) seleccionados.push('Orientación de Foto');
    if (this.motivos.planograma) seleccionados.push('Incumplimiento de Planograma');
    if (this.motivos.precio) seleccionados.push('Falta Información de Precio');
    if (this.motivos.pop) seleccionados.push('Falta Material POP');

    let stringMotivo = seleccionados.join(', ');
    if (this.comentario.trim()) {
      stringMotivo = stringMotivo ? `${stringMotivo} - ${this.comentario.trim()}` : this.comentario.trim();
    }
    
    this.dialogRef.close(stringMotivo);
  }
}

