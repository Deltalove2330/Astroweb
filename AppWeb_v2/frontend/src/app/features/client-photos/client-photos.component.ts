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
import { ApiService } from '../../core/services/api.service';

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
    MatInputModule, MatChipsModule, MatTooltipModule,
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
    return this.points().filter(p =>
      !term || p.punto_de_interes.toLowerCase().includes(term) || p.cadena.toLowerCase().includes(term)
    );
  });

  // Lightbox
  lightboxOpen = signal(false);
  lightboxUrl = signal('');

  // Dashboard modal
  dashboardOpen = signal(false);

  constructor(private api: ApiService) {}

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
      next: data => { this.visits.set(data); this.loading.set(false); },
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
  openLightbox(url: string): void {
    this.lightboxUrl.set(url);
    this.lightboxOpen.set(true);
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
    this.lightboxUrl.set('');
  }

  // ─── DASHBOARD ────────────────────────────────────────────────────
  toggleDashboard(): void {
    this.dashboardOpen.update(v => !v);
  }

  getPointsByChain(cadena: string): Point[] {
    return this.filteredPoints().filter(p => p.cadena === cadena);
  }
}
