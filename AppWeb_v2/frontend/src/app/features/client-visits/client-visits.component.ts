import { Component, OnInit, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../core/services/api.service';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './client-visits.component.html',
  styleUrls: ['./client-visits.component.scss']
})
export class ClientVisitsComponent implements OnInit {
  // State
  loading = signal(false);
  error = signal<string | null>(null);
  
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

  // Carousel
  carouselOpen = signal(false);
  carouselFotos = signal<Foto[]>([]);
  carouselIndex = signal(0);
  carouselTitle = signal('');

  // Categories config
  readonly CATEGORIAS = [
    { nombre: 'Gestión', emoji: '📋', color: '#3b82f6' },
    { nombre: 'Precio', emoji: '🏷️', color: '#f59e0b' },
    { nombre: 'Exhibiciones Adicionales', emoji: '🖼️', color: '#06b6d4' },
    { nombre: 'Material POP Antes', emoji: '📦', color: '#8b5cf6' },
    { nombre: 'Material POP Despues', emoji: '🎁', color: '#ec4899' },
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarVisitas();
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

  onRegionChange(): void {
    this.cadena.set('');
    this.puntoId.set('');
    this.aplicarFiltros();
  }

  onCadenaChange(): void {
    this.puntoId.set('');
    this.aplicarFiltros();
  }

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
    document.body.classList.add('modal-open');
  }

  closeCarousel(): void {
    this.carouselOpen.set(false);
    this.carouselFotos.set([]);
    document.body.classList.remove('modal-open');
  }

  prevSlide(): void {
    if (this.carouselIndex() > 0) {
      this.carouselIndex.update(i => i - 1);
    }
  }

  nextSlide(): void {
    if (this.carouselIndex() < this.carouselFotos().length - 1) {
      this.carouselIndex.update(i => i + 1);
    }
  }

  goToSlide(index: number): void {
    this.carouselIndex.set(index);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.carouselOpen()) return;

    if (event.key === 'ArrowLeft') {
      this.prevSlide();
    } else if (event.key === 'ArrowRight') {
      this.nextSlide();
    } else if (event.key === 'Escape') {
      this.closeCarousel();
    }
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

  getCarouselDots(): number[] {
    const total = this.carouselFotos().length;
    const max = Math.min(total, 12);
    return Array.from({ length: max }, (_, i) => i);
  }
}
