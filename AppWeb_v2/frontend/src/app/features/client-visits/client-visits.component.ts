import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { SearchableSelectComponent } from './searchable-select.component';
import { PhotoLightboxComponent } from '../../shared/photo-lightbox/photo-lightbox.component';

interface ExclusiveClient { id_cliente: number; cliente: string; id_tipo_cliente: number; }

interface Foto {
  id_foto: number;
  file_path: string;
  id_tipo_foto: number;
  tipo_desc: string;
  categoria: string;
  estado: string;
  fecha: string;
  id_visita: number;
}

interface Visita {
  id_visita: number;
  fecha_visita: string;
  mercaderista: string;
  punto_id: string;
  punto_nombre: string;
  departamento: string;
  ciudad: string;
  region: string;
  cadena: string;
  cliente_nombre: string;
  total_fotos: number;
  preview_foto: string | null;
  fotos_por_categoria: {
    [key: string]: Foto[];
  };
  // UI state
  expanded?: boolean;
}

interface Filtros {
  regiones: string[];
  cadenas: string[];
  puntos: { id: string; nombre: string }[];
}

@Component({
  selector: 'app-client-visits',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SearchableSelectComponent,
    PhotoLightboxComponent
  ],
  templateUrl: './client-visits.component.html',
  styleUrls: ['./client-visits.component.scss']
})
export class ClientVisitsComponent implements OnInit {
  // State
  loading = signal(false);
  error = signal<string | null>(null);

  // Coordinador Exclusivo
  isCoordinadorExclusivo = signal(false);
  needsClientSelection = signal(false);
  exclusiveClients = signal<ExclusiveClient[]>([]);
  selectedExclusiveClient = signal<ExclusiveClient | null>(null);
  exclusiveClientSearch = signal('');
  filteredExclusiveClients = computed(() => {
    const term = this.exclusiveClientSearch().trim().toLowerCase();
    if (!term) return this.exclusiveClients();
    return this.exclusiveClients().filter(c => (c.cliente || '').toLowerCase().includes(term));
  });

  // Data
  visitas = signal<Visita[]>([]);
  filtrosDisponibles = signal<Filtros>({ regiones: [], cadenas: [], puntos: [] });
  bannerInfo = signal({
    esHoy: true,
    fechaInicio: '',
    fechaFin: '',
    totalVisitas: 0,
    totalFotos: 0
  });

  // Current filters
  fechaInicio = signal(this.getTodayStr());
  fechaFin = signal(this.getTodayStr());
  region = signal('');
  cadena = signal('');
  puntoId = signal('');

  // Carousel (delega en <app-photo-lightbox>)
  carouselOpen = signal(false);
  carouselFotos = signal<Foto[]>([]);
  carouselIndex = signal(0);
  carouselTitle = signal('');
  // Computado para alimentar el lightbox: agrega url ← file_path
  lightboxPhotos = computed(() =>
    this.carouselFotos().map(f => ({ ...f, url: f.file_path }))
  );
  currentCarouselFoto = computed<Foto | undefined>(() => this.carouselFotos()[this.carouselIndex()]);

  // Categories config
  readonly CATEGORIAS = [
    { nombre: 'Gestión', emoji: '📋', color: '#3b82f6' },
    { nombre: 'Precio', emoji: '🏷️', color: '#f59e0b' },
    { nombre: 'Exhibiciones Adicionales', emoji: '🖼️', color: '#06b6d4' },
    { nombre: 'Material POP Antes', emoji: '📦', color: '#8b5cf6' },
    { nombre: 'Material POP Despues', emoji: '🎁', color: '#ec4899' },
  ];

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    const u = this.auth.currentUser();
    if (u?.is_coordinador_exclusivo) {
      this.isCoordinadorExclusivo.set(true);
      this.needsClientSelection.set(true);
      this.loadExclusiveClients();
    } else {
      this.cargarVisitas();
    }
  }

  // ─── COORDINADOR EXCLUSIVO ───────────────────────────────────────
  loadExclusiveClients(): void {
    this.loading.set(true);
    this.api.getExclusiveClients().subscribe({
      next: data => { this.exclusiveClients.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  selectExclusiveClient(c: ExclusiveClient): void {
    this.selectedExclusiveClient.set(c);
    this.needsClientSelection.set(false);
    this.cargarVisitas();
  }

  changeExclusiveClient(): void {
    this.selectedExclusiveClient.set(null);
    this.needsClientSelection.set(true);
    this.visitas.set([]);
  }

  // Helper for today's date in YYYY-MM-DD
  private getTodayStr(): string {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }

  // Load data from API
  cargarVisitas(): void {
    this.loading.set(true);
    this.error.set(null);

    const params: any = {
      fecha_inicio: this.fechaInicio(),
      fecha_fin: this.fechaFin()
    };
    if (this.region()) params.region = this.region();
    if (this.cadena()) params.cadena = this.cadena();
    if (this.puntoId()) params.punto_id = this.puntoId();
    const exc = this.selectedExclusiveClient();
    if (exc) params.cliente_id = exc.id_cliente;

    this.api.getClientMisVisitas(params).subscribe({
      next: (res: any) => {
        if (res.success) {
          // Add expanded=false to each visit by default
          const visitsData = res.visitas.map((v: any) => ({ ...v, expanded: false }));
          this.visitas.set(visitsData);
          
          if (res.filtros) {
            this.filtrosDisponibles.set(res.filtros);
          }

          const totalFotos = visitsData.reduce((sum: number, v: Visita) => sum + v.total_fotos, 0);

          this.bannerInfo.set({
            esHoy: res.es_hoy,
            fechaInicio: res.fecha_inicio,
            fechaFin: res.fecha_fin,
            totalVisitas: res.total,
            totalFotos: totalFotos
          });
        } else {
          this.error.set(res.error || 'Error al cargar visitas');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('No se pudo conectar con el servidor. Intenta de nuevo.');
        this.loading.set(false);
      }
    });
  }

  // Filter actions
  aplicarFiltros(): void {
    this.cargarVisitas();
  }

  volverAHoy(): void {
    this.fechaInicio.set(this.getTodayStr());
    this.fechaFin.set(this.getTodayStr());
    this.region.set('');
    this.cadena.set('');
    this.puntoId.set('');
    this.cargarVisitas();
  }

  onRegionChange(value: string): void {
    this.region.set(value);
    // Si la cadena/punto seleccionados ya no son válidos en la nueva región,
    // el backend los ignorará — los limpiamos para evitar confusión.
    this.cadena.set('');
    this.puntoId.set('');
    this.aplicarFiltros();
  }

  onCadenaChange(value: string): void {
    this.cadena.set(value);
    this.puntoId.set('');
    this.aplicarFiltros();
  }

  onPuntoChange(value: string): void {
    this.puntoId.set(value);
    this.aplicarFiltros();
  }

  // Adaptadores para el SearchableSelect
  regionOptions = computed(() =>
    this.filtrosDisponibles().regiones.map(r => ({ value: r, label: r }))
  );
  cadenaOptions = computed(() =>
    this.filtrosDisponibles().cadenas.map(c => ({ value: c, label: c }))
  );
  puntoOptions = computed(() =>
    this.filtrosDisponibles().puntos.map(p => ({ value: p.id, label: p.nombre }))
  );

  // UI interactions
  toggleCard(visita: Visita): void {
    // Modify the signal array to trigger CD
    const current = this.visitas();
    const index = current.findIndex(v => v.id_visita === visita.id_visita);
    if (index !== -1) {
      const newVisitas = [...current];
      newVisitas[index] = { ...newVisitas[index], expanded: !newVisitas[index].expanded };
      this.visitas.set(newVisitas);
    }
  }

  getFotosForCategoria(visita: Visita, catNombre: string): Foto[] {
    return visita.fotos_por_categoria[catNombre] || [];
  }

  openCarousel(catNombre: string, fotos: Foto[], event: Event): void {
    event.stopPropagation();
    if (!fotos || fotos.length === 0) return;
    this.carouselTitle.set(catNombre);
    this.carouselFotos.set(fotos);
    this.carouselIndex.set(0);
    this.carouselOpen.set(true);
  }

  closeCarousel(): void {
    this.carouselOpen.set(false);
    this.carouselFotos.set([]);
  }

  onCarouselIndexChange(i: number): void {
    this.carouselIndex.set(i);
  }

  // Formatters
  formatDateHuman(fechaStr: string): string {
    if (!fechaStr) return '';
    try {
      const d = new Date(fechaStr + 'T00:00:00');
      return d.toLocaleDateString('es-VE', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch (e) { return fechaStr; }
  }

  formatDateShort(fechaStr: string): string {
    if (!fechaStr) return '';
    try {
      const d = new Date(fechaStr + 'T00:00:00');
      return d.toLocaleDateString('es-VE', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
    } catch (e) { return fechaStr; }
  }

  formatTime(fechaStr: string): string {
    if (!fechaStr) return '';
    try {
      return new Date(fechaStr).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return ''; }
  }

}
