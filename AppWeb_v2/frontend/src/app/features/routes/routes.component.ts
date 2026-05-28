import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../core/services/api.service';
import { Ruta } from '../../core/models/ruta.model';
import { RouteDetailDialogComponent } from './route-detail-dialog.component';

interface AssignedRoute {
  id: number;
  nombre: string;
  servicio?: string;
  tipo_ruta: string;
}

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    MatButtonModule, MatIconModule, MatTableModule,
    MatFormFieldModule, MatInputModule, MatDialogModule,
    MatProgressSpinnerModule, MatSlideToggleModule, MatSnackBarModule,
    MatSelectModule, MatTooltipModule,
  ],
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements OnInit {
  // ── Existing ──────────────────────────────────────────────
  loading = signal(true);
  saving = signal(false);
  routes = signal<Ruta[]>([]);
  showCreateForm = signal(false);
  columns = ['nombre', 'servicio', 'coordinadores', 'cuadrante', 'activa', 'acciones'];
  services = signal<string[]>([]);
  nextNumber = signal<number | null>(null);

  createForm = this.fb.group({
    tipo: ['E', Validators.required],
    nombre_previsto: [{ value: '', disabled: true }],
    servicio: ['', Validators.required],
    coordinador_1: ['', Validators.required],
    coordinador_2: [''],
    cuadrante: ['', Validators.required],
    activa: [true],
  });

  // ── Tab ───────────────────────────────────────────────────
  activeTab = signal<'rutas' | 'mercaderistas'>('rutas');

  // ── Mercaderistas grid ────────────────────────────────────
  mercLoading = signal(false);
  mercList = signal<any[]>([]);
  mercSearch = '';
  mercFilterTipo = '';

  // ── Assignment panel ──────────────────────────────────────
  panelOpen = signal(false);
  panelSaving = signal(false);
  selectedMerc = signal<any>(null);
  assignedRoutes = signal<AssignedRoute[]>([]);
  panelRouteSearch = '';

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRoutes();
    this.loadOptions();
    this.onTipoChange('E');
  }

  // ── Existing methods ──────────────────────────────────────
  loadOptions(): void {
    this.api.getRouteOptions().subscribe(data => this.services.set(data.servicios));
  }

  onTipoChange(tipo: string): void {
    if (!tipo) return;
    this.api.getNextRouteNumber(tipo).subscribe(data => {
      this.nextNumber.set(data.next_number);
      this.createForm.patchValue({ nombre_previsto: `Ruta ${tipo}${data.next_number}` });
    });
  }

  loadRoutes(): void {
    this.loading.set(true);
    this.api.getRoutes().subscribe({
      next: (data) => { this.routes.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  createRoute(): void {
    if (this.createForm.invalid) return;
    this.saving.set(true);
    this.api.createRoute(this.createForm.value).subscribe({
      next: (ruta) => {
        this.saving.set(false);
        this.routes.update((rs: Ruta[]) => [...rs, ruta]);
        this.createForm.reset({ activa: true });
        this.showCreateForm.set(false);
        this.snack.open('Ruta creada exitosamente', 'OK', { duration: 3000 });
      },
      error: (err) => {
        this.saving.set(false);
        this.snack.open(err.error?.detail ?? 'Error al crear ruta', 'OK', { duration: 3000 });
      },
    });
  }

  toggleActive(ruta: Ruta): void {
    this.api.updateRoute(ruta.id, { activa: !ruta.activa }).subscribe({
      next: (updated) => {
        this.routes.update((rs: Ruta[]) => rs.map((r: Ruta) => (r.id === updated.id ? updated : r)));
      },
    });
  }

  viewPoints(ruta: Ruta): void {
    this.dialog.open(RouteDetailDialogComponent, {
      data: { ruta }, width: '100%', maxWidth: '1100px', panelClass: 'custom-dialog'
    });
  }

  // ── Tab switch ────────────────────────────────────────────
  switchTab(tab: 'rutas' | 'mercaderistas'): void {
    this.activeTab.set(tab);
    if (tab === 'mercaderistas' && this.mercList().length === 0) {
      this.loadMercaderistas();
    }
  }

  // ── Mercaderistas grid methods ────────────────────────────
  loadMercaderistas(): void {
    this.mercLoading.set(true);
    this.api.getMercaderistasConRutas().subscribe({
      next: (data) => { this.mercList.set(data); this.mercLoading.set(false); },
      error: () => this.mercLoading.set(false),
    });
  }

  get filteredMercaderistas(): any[] {
    const s = this.mercSearch.toLowerCase();
    const t = this.mercFilterTipo;
    return this.mercList().filter(m =>
      (!s || m.nombre?.toLowerCase().includes(s) || m.cedula?.includes(s) || m.email?.toLowerCase().includes(s)) &&
      (!t || m.tipo === t)
    );
  }

  get mercTipos(): string[] {
    return [...new Set(this.mercList().map(m => m.tipo).filter(Boolean))];
  }

  // ── Assignment panel methods ──────────────────────────────
  openPanel(merc: any): void {
    this.selectedMerc.set(merc);
    this.panelOpen.set(true);
    this.panelRouteSearch = '';
    this.api.getMercaderistaRoutes(merc.id).subscribe({
      next: (routes) => this.assignedRoutes.set(routes as AssignedRoute[]),
      error: () => this.assignedRoutes.set([]),
    });
  }

  closePanel(): void { this.panelOpen.set(false); this.selectedMerc.set(null); this.assignedRoutes.set([]); }

  isAssigned(routeId: number): boolean {
    return this.assignedRoutes().some(r => r.id === routeId);
  }

  addRoute(ruta: Ruta): void {
    if (this.isAssigned(ruta.id)) return;
    this.assignedRoutes.update(list => [...list, { id: ruta.id, nombre: ruta.nombre, servicio: ruta.servicio, tipo_ruta: 'Variable' }]);
  }

  removeRoute(routeId: number): void {
    this.assignedRoutes.update(list => list.filter(r => r.id !== routeId));
  }

  setTipoRuta(routeId: number, tipo: string): void {
    this.assignedRoutes.update(list => list.map(r => r.id === routeId ? { ...r, tipo_ruta: tipo } : r));
  }

  get availableRoutes(): Ruta[] {
    const s = this.panelRouteSearch.toLowerCase();
    return this.routes().filter(r =>
      !this.isAssigned(r.id) &&
      (!s || r.nombre?.toLowerCase().includes(s) || r.servicio?.toLowerCase().includes(s))
    );
  }

  saveRoutes(): void {
    const merc = this.selectedMerc();
    if (!merc) return;
    this.panelSaving.set(true);
    const payload = this.assignedRoutes().map(r => ({ ruta_id: r.id, tipo_ruta: r.tipo_ruta }));
    this.api.syncMercaderistaRoutes(merc.id, payload).subscribe({
      next: () => {
        this.panelSaving.set(false);
        this.snack.open('Asignaciones guardadas', 'OK', { duration: 3000 });
        this.mercList.update(list => list.map(m =>
          m.id === merc.id ? { ...m, rutas_count: this.assignedRoutes().length } : m
        ));
        this.closePanel();
      },
      error: (err) => {
        this.panelSaving.set(false);
        this.snack.open(err?.error?.detail ?? 'Error al guardar', 'OK', { duration: 4000 });
      },
    });
  }
}
