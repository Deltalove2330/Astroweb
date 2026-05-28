import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

interface Producto {
  id: number;
  nombre: string;
  categoria?: string;
  fabricante?: string;
  id_fabricante?: number;
  tipo_servicio?: string;
  tipo_fabricante?: string;
  cod_bar?: string;
  inagotable?: boolean;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    MatIconModule, MatSnackBarModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  template: `
<div class="min-h-screen bg-slate-950 text-white">

  <!-- HEADER -->
  <div class="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border-b border-white/8 px-8 py-6">
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shrink-0">
          <mat-icon class="text-white !text-2xl">inventory_2</mat-icon>
        </div>
        <div>
          <h1 class="text-2xl font-black tracking-tight text-white leading-none">Productos</h1>
          <p class="text-slate-400 text-sm mt-0.5">
            <span class="font-bold text-violet-400">{{ total() }}</span> productos en catálogo
          </p>
        </div>
      </div>
      <button (click)="openPanel(null)"
        class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-700 to-purple-700 hover:from-violet-600 hover:to-purple-600 text-white font-black rounded-xl shadow-lg transition-all active:scale-95 text-sm">
        <mat-icon class="!text-base">add</mat-icon>
        Nuevo Producto
      </button>
    </div>

    <!-- SEARCH + FILTERS -->
    <div class="flex flex-wrap gap-3 mt-5">
      <div class="relative flex-1 min-w-52">
        <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none !text-base">search</mat-icon>
        <input [ngModel]="searchText()" (ngModelChange)="onSearch($event)"
          placeholder="Buscar por SKU o fabricante..."
          class="w-full bg-slate-800 border border-slate-700 focus:border-violet-500 text-white placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 text-sm font-semibold outline-none transition-colors">
      </div>
      <div class="relative">
        <select [ngModel]="filterCategoria()" (ngModelChange)="filterCategoria.set($event); loadProductos()"
          class="bg-slate-800 border border-slate-700 focus:border-violet-500 text-white rounded-xl px-3 py-2.5 pr-8 text-sm font-semibold appearance-none outline-none transition-colors min-w-36">
          <option value="">Todas las categorías</option>
          @for (c of categorias(); track c) { <option [value]="c">{{ c }}</option> }
        </select>
        <mat-icon class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none !text-base">expand_more</mat-icon>
      </div>
      <div class="relative">
        <select [ngModel]="filterFabricante()" (ngModelChange)="filterFabricante.set($event); loadProductos()"
          class="bg-slate-800 border border-slate-700 focus:border-violet-500 text-white rounded-xl px-3 py-2.5 pr-8 text-sm font-semibold appearance-none outline-none transition-colors min-w-36">
          <option value="">Todos los fabricantes</option>
          @for (f of fabricantes(); track f) { <option [value]="f">{{ f }}</option> }
        </select>
        <mat-icon class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none !text-base">expand_more</mat-icon>
      </div>
      @if (searchText() || filterCategoria() || filterFabricante()) {
        <button (click)="clearFilters()"
          class="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white rounded-xl text-sm font-bold transition-all">
          <mat-icon class="!text-base">close</mat-icon>
          Limpiar
        </button>
      }
    </div>
  </div>

  <!-- TABLE -->
  <div class="px-8 py-6">
    @if (loading()) {
      <div class="flex items-center justify-center py-32">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
    } @else if (productos().length === 0) {
      <div class="flex flex-col items-center justify-center py-32 gap-4 text-slate-600">
        <div class="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center">
          <mat-icon class="!text-4xl">inventory_2</mat-icon>
        </div>
        <p class="font-bold text-lg tracking-tight">No se encontraron productos</p>
        <p class="text-sm">Intenta con otros filtros o agrega un nuevo producto.</p>
      </div>
    } @else {
      <div class="bg-slate-900 border border-white/8 rounded-2xl overflow-hidden">
        <!-- Table header -->
        <div class="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-slate-800 border-b border-white/8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <span>SKU / Producto</span>
          <span>Categoría</span>
          <span>Fabricante</span>
          <span>Tipo Servicio</span>
          <span>Cód. Barras</span>
          <span></span>
        </div>
        @for (p of productos(); track p.id) {
          <div class="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5 border-b border-white/5 hover:bg-slate-800 transition-colors group">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 rounded-xl bg-violet-900 flex items-center justify-center shrink-0">
                <mat-icon class="!text-base text-violet-400">inventory_2</mat-icon>
              </div>
              <div class="min-w-0">
                <p class="font-bold text-white text-sm truncate">{{ p.nombre }}</p>
                @if (p.inagotable) {
                  <span class="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded-md">
                    <mat-icon class="!text-[10px]">all_inclusive</mat-icon> Inagotable
                  </span>
                }
              </div>
            </div>
            <span class="text-sm text-slate-400 truncate">{{ p.categoria || '—' }}</span>
            <span class="text-sm text-slate-400 truncate">{{ p.fabricante || '—' }}</span>
            <span class="text-sm text-slate-400 truncate">{{ p.tipo_servicio || '—' }}</span>
            <span class="text-sm font-mono text-slate-500 truncate">{{ p.cod_bar || '—' }}</span>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button (click)="openPanel(p)" matTooltip="Editar"
                class="w-8 h-8 rounded-lg bg-violet-900 hover:bg-violet-800 text-violet-400 flex items-center justify-center transition-all">
                <mat-icon class="!text-base">edit</mat-icon>
              </button>
              <button (click)="deleteProducto(p)" matTooltip="Eliminar"
                class="w-8 h-8 rounded-lg bg-red-950 hover:bg-red-900 text-red-400 flex items-center justify-center transition-all">
                <mat-icon class="!text-base">delete</mat-icon>
              </button>
            </div>
          </div>
        }
      </div>

      <!-- PAGINATION -->
      <div class="flex items-center justify-between mt-5">
        <p class="text-sm text-slate-500">
          Mostrando <span class="text-white font-bold">{{ skipVal() + 1 }}–{{ skipVal() + productos().length }}</span>
          de <span class="text-white font-bold">{{ total() }}</span>
        </p>
        <div class="flex gap-2">
          <button (click)="prevPage()" [disabled]="skipVal() === 0"
            class="flex items-center gap-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 text-white rounded-xl text-sm font-bold transition-all">
            <mat-icon class="!text-base">chevron_left</mat-icon> Anterior
          </button>
          <button (click)="nextPage()" [disabled]="skipVal() + pageSize >= total()"
            class="flex items-center gap-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 text-white rounded-xl text-sm font-bold transition-all">
            Siguiente <mat-icon class="!text-base">chevron_right</mat-icon>
          </button>
        </div>
      </div>
    }
  </div>
</div>

<!-- SLIDE PANEL OVERLAY -->
@if (panelOpen()) {
  <div class="fixed inset-0 z-50 flex justify-end">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="closePanel()"></div>
    <div class="relative w-full max-w-md bg-slate-900 border-l border-white/8 h-full flex flex-col shadow-2xl overflow-y-auto">

      <!-- Panel Header -->
      <div class="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-white/8 px-6 py-5 shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-violet-900 flex items-center justify-center">
              <mat-icon class="text-violet-400 !text-xl">{{ editingId() ? 'edit' : 'add_circle' }}</mat-icon>
            </div>
            <div>
              <h3 class="font-black text-white">{{ editingId() ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
              <p class="text-xs text-slate-500">{{ editingId() ? 'Modifica los datos del producto' : 'Agrega un producto al catálogo' }}</p>
            </div>
          </div>
          <button (click)="closePanel()"
            class="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <mat-icon class="!text-lg">close</mat-icon>
          </button>
        </div>
      </div>

      <!-- Panel Form -->
      <form [formGroup]="form" (ngSubmit)="saveProducto()" class="flex-1 px-6 py-6 space-y-5">

        <!-- SKU -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">SKU / Nombre *</label>
          <input formControlName="nombre" placeholder="Nombre o código SKU del producto"
            class="w-full bg-slate-800 border focus:ring-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-white placeholder-slate-500 outline-none transition-colors"
            [class.border-red-600]="form.get('nombre')?.invalid && form.get('nombre')?.touched"
            [class.border-slate-700]="!(form.get('nombre')?.invalid && form.get('nombre')?.touched)"
            [class.focus:border-violet-500]="true">
          @if (form.get('nombre')?.invalid && form.get('nombre')?.touched) {
            <p class="text-xs text-red-400 mt-1">El SKU es requerido</p>
          }
        </div>

        <!-- Código de barras -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Código de Barras</label>
          <input formControlName="cod_bar" placeholder="Código de barras (opcional)"
            class="w-full bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm font-semibold font-mono text-white placeholder-slate-500 outline-none transition-colors">
        </div>

        <!-- Categoría + Fabricante -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Categoría</label>
            <input formControlName="categoria" placeholder="Ej: Bebidas"
              list="categoria-list"
              class="w-full bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm font-semibold text-white placeholder-slate-500 outline-none transition-colors">
            <datalist id="categoria-list">
              @for (c of categorias(); track c) { <option [value]="c"> }
            </datalist>
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fabricante</label>
            <input formControlName="fabricante" placeholder="Ej: Nestlé"
              list="fabricante-list"
              class="w-full bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm font-semibold text-white placeholder-slate-500 outline-none transition-colors">
            <datalist id="fabricante-list">
              @for (f of fabricantes(); track f) { <option [value]="f"> }
            </datalist>
          </div>
        </div>

        <!-- Tipo Servicio + Tipo Fabricante -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipo Servicio</label>
            <input formControlName="tipo_servicio" placeholder="Ej: Retail"
              class="w-full bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm font-semibold text-white placeholder-slate-500 outline-none transition-colors">
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipo Fabricante</label>
            <input formControlName="tipo_fabricante" placeholder="Ej: Nacional"
              class="w-full bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm font-semibold text-white placeholder-slate-500 outline-none transition-colors">
          </div>
        </div>

        <!-- Inagotable toggle -->
        <div class="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center">
              <mat-icon class="!text-base text-emerald-400">all_inclusive</mat-icon>
            </div>
            <div>
              <p class="text-sm font-bold text-white">Inagotable</p>
              <p class="text-xs text-slate-500">Disponible siempre en stock</p>
            </div>
          </div>
          <button type="button" (click)="toggleInagotable()"
            [ngClass]="form.get('inagotable')?.value ? 'bg-emerald-600' : 'bg-slate-700'"
            class="relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0">
            <span [ngClass]="form.get('inagotable')?.value ? 'translate-x-6' : 'translate-x-1'"
              class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"></span>
          </button>
        </div>

        <!-- Spacer -->
        <div class="flex-1"></div>
      </form>

      <!-- Panel Footer -->
      <div class="px-6 py-5 border-t border-white/8 bg-slate-900 shrink-0 flex gap-3">
        <button type="button" (click)="closePanel()"
          class="flex-1 py-2.5 border border-slate-700 text-slate-400 hover:text-white rounded-xl font-bold text-sm transition-all">
          Cancelar
        </button>
        <button type="button" (click)="saveProducto()" [disabled]="form.invalid || saving()"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-700 to-purple-700 hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 text-white font-black rounded-xl text-sm shadow-lg transition-all active:scale-95">
          @if (saving()) { <mat-spinner diameter="16"></mat-spinner> }
          @else { <mat-icon class="!text-base">{{ editingId() ? 'save' : 'add' }}</mat-icon> }
          {{ editingId() ? 'Guardar Cambios' : 'Crear Producto' }}
        </button>
      </div>
    </div>
  </div>
}
  `
})
export class ProductsComponent implements OnInit {
  productos = signal<Producto[]>([]);
  total = signal(0);
  loading = signal(false);
  saving = signal(false);
  panelOpen = signal(false);
  editingId = signal<number | null>(null);
  categorias = signal<string[]>([]);
  fabricantes = signal<string[]>([]);

  searchText = signal('');
  filterCategoria = signal('');
  filterFabricante = signal('');
  skipVal = signal(0);
  pageSize = 25;

  private search$ = new Subject<string>();

  form = this.fb.group({
    nombre: ['', Validators.required],
    cod_bar: [''],
    categoria: [''],
    fabricante: [''],
    tipo_servicio: [''],
    tipo_fabricante: [''],
    inagotable: [false]
  });

  constructor(private api: ApiService, private fb: FormBuilder, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.loadProductos();
    this.loadFiltros();
    this.search$.pipe(debounceTime(350), distinctUntilChanged()).subscribe(() => {
      this.skipVal.set(0);
      this.loadProductos();
    });
  }

  loadProductos(): void {
    this.loading.set(true);
    this.api.getProductos({
      skip: this.skipVal(),
      limit: this.pageSize,
      busqueda: this.searchText() || undefined,
      categoria: this.filterCategoria() || undefined,
      fabricante: this.filterFabricante() || undefined,
    }).subscribe({
      next: (res) => {
        this.productos.set(res.items);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadFiltros(): void {
    this.api.getProductos({ limit: 0 }).subscribe();
    this.api['http'].get<string[]>(`${this.api['base']}/api/atencion-cliente/productos/listado/categorias`).subscribe({
      next: (d) => this.categorias.set(d),
      error: () => {}
    });
    this.api['http'].get<string[]>(`${this.api['base']}/api/atencion-cliente/productos/listado/fabricantes`).subscribe({
      next: (d) => this.fabricantes.set(d),
      error: () => {}
    });
  }

  onSearch(val: string): void {
    this.searchText.set(val);
    this.search$.next(val);
  }

  clearFilters(): void {
    this.searchText.set('');
    this.filterCategoria.set('');
    this.filterFabricante.set('');
    this.skipVal.set(0);
    this.loadProductos();
  }

  prevPage(): void { this.skipVal.update(v => Math.max(0, v - this.pageSize)); this.loadProductos(); }
  nextPage(): void { this.skipVal.update(v => v + this.pageSize); this.loadProductos(); }

  openPanel(p: Producto | null): void {
    this.editingId.set(p?.id ?? null);
    this.form.reset({
      nombre: p?.nombre ?? '',
      cod_bar: p?.cod_bar ?? '',
      categoria: p?.categoria ?? '',
      fabricante: p?.fabricante ?? '',
      tipo_servicio: p?.tipo_servicio ?? '',
      tipo_fabricante: p?.tipo_fabricante ?? '',
      inagotable: p?.inagotable ?? false
    });
    this.panelOpen.set(true);
  }

  closePanel(): void { this.panelOpen.set(false); }

  toggleInagotable(): void {
    const current = this.form.get('inagotable')?.value;
    this.form.patchValue({ inagotable: !current });
  }

  saveProducto(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const payload = this.form.value;
    const op = this.editingId()
      ? this.api.updateProducto(this.editingId()!, payload)
      : this.api.createProducto(payload);
    op.subscribe({
      next: () => {
        this.saving.set(false);
        this.closePanel();
        this.loadProductos();
        this.loadFiltros();
        this.snack.open(this.editingId() ? 'Producto actualizado' : 'Producto creado', 'OK', { duration: 3000 });
      },
      error: (err) => {
        this.saving.set(false);
        const msg = err?.error?.detail ?? 'Error al guardar';
        this.snack.open(msg, 'OK', { duration: 4000 });
      }
    });
  }

  deleteProducto(p: Producto): void {
    if (!confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return;
    this.api['http'].delete(`${this.api['base']}/api/atencion-cliente/productos/${p.id}`).subscribe({
      next: () => { this.loadProductos(); this.snack.open('Producto eliminado', 'OK', { duration: 3000 }); },
      error: () => this.snack.open('Error al eliminar', 'OK', { duration: 3000 })
    });
  }
}
