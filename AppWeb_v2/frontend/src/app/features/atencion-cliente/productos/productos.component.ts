import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

interface Producto {
  id: number;
  nombre: string;
  categoria?: string;
  fabricante?: string;
  tipo_servicio?: string;
  tipo_fabricante?: string;
  cod_bar?: string;
  inagotable?: boolean;
  id_fabricante?: number;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatIconModule, MatSnackBarModule, MatProgressSpinnerModule, MatTooltipModule,
  ],
  template: `
<div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">

  <!-- HEADER -->
  <div class="bg-gradient-to-r from-slate-50 via-slate-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-white/8 px-8 py-6">
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shrink-0">
          <mat-icon class="text-white !text-2xl">inventory_2</mat-icon>
        </div>
        <div>
          <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">Productos</h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
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

    <!-- FILTROS -->
    <div class="flex flex-wrap gap-3 mt-5">
      <div class="relative flex-1 min-w-52">
        <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none !text-base">search</mat-icon>
        <input [ngModel]="searchText()" (ngModelChange)="onSearch($event)"
          placeholder="Buscar por SKU o fabricante..."
          class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-violet-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 text-sm font-semibold outline-none transition-colors">
      </div>
      <div class="relative">
        <select [ngModel]="filterCat()" (ngModelChange)="filterCat.set($event); load()"
          class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-violet-500 text-slate-900 dark:text-white rounded-xl px-3 py-2.5 pr-8 text-sm font-semibold appearance-none outline-none transition-colors min-w-40">
          <option value="">Todas las categorías</option>
          @for (c of categorias(); track c) { <option [value]="c">{{ c }}</option> }
        </select>
        <mat-icon class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none !text-base">expand_more</mat-icon>
      </div>
      <div class="relative">
        <select [ngModel]="filterFab()" (ngModelChange)="filterFab.set($event); load()"
          class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-violet-500 text-slate-900 dark:text-white rounded-xl px-3 py-2.5 pr-8 text-sm font-semibold appearance-none outline-none transition-colors min-w-40">
          <option value="">Todos los fabricantes</option>
          @for (f of fabricantes(); track f) { <option [value]="f">{{ f }}</option> }
        </select>
        <mat-icon class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none !text-base">expand_more</mat-icon>
      </div>
      @if (searchText() || filterCat() || filterFab()) {
        <button (click)="clearFilters()"
          class="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white rounded-xl text-sm font-bold transition-all">
          <mat-icon class="!text-base">close</mat-icon> Limpiar
        </button>
      }
    </div>
  </div>

  <!-- TABLA -->
  <div class="px-8 py-6">
    @if (loading()) {
      <div class="flex items-center justify-center py-32">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
    } @else if (productos().length === 0) {
      <div class="flex flex-col items-center justify-center py-32 gap-4 text-slate-400 dark:text-slate-600">
        <div class="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center">
          <mat-icon class="!text-4xl">inventory_2</mat-icon>
        </div>
        <p class="font-bold text-lg">No se encontraron productos</p>
        <p class="text-sm">Intenta otros filtros o agrega un nuevo producto.</p>
      </div>
    } @else {
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/8 rounded-2xl overflow-hidden">
        <div class="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_100px_80px] gap-4 px-5 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-white/8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <span>SKU / Producto</span>
          <span>Categoría</span>
          <span>Fabricante</span>
          <span>Tipo Servicio</span>
          <span>Cód. Barras</span>
          <span class="text-center">Inagotable</span>
          <span></span>
        </div>
        @for (p of productos(); track p.id) {
          <div class="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_100px_80px] gap-4 items-center px-5 py-3.5 border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                <mat-icon class="!text-base text-violet-600 dark:text-violet-400">inventory_2</mat-icon>
              </div>
              <p class="font-bold text-slate-900 dark:text-white text-sm truncate">{{ p.nombre }}</p>
            </div>
            <span class="text-sm text-slate-500 dark:text-slate-400 truncate">{{ p.categoria || '—' }}</span>
            <span class="text-sm text-slate-500 dark:text-slate-400 truncate">{{ p.fabricante || '—' }}</span>
            <span class="text-sm text-slate-500 dark:text-slate-400 truncate">{{ p.tipo_servicio || '—' }}</span>
            <span class="text-sm font-mono text-slate-400 dark:text-slate-500 truncate">{{ p.cod_bar || '—' }}</span>
            <div class="flex justify-center">
              <span [ngClass]="p.inagotable
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800'
                : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-900'"
                class="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full border whitespace-nowrap">
                <span [ngClass]="p.inagotable ? 'bg-emerald-500' : 'bg-rose-500'" class="w-1.5 h-1.5 rounded-full shrink-0"></span>
                {{ p.inagotable ? 'Sí' : 'No' }}
              </span>
            </div>
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

      <!-- PAGINACIÓN -->
      <div class="flex items-center justify-between mt-5 flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <p class="text-sm text-slate-500">
            Mostrando <span class="text-slate-900 dark:text-white font-bold">{{ skip() + 1 }}–{{ skip() + productos().length }}</span>
            de <span class="text-slate-900 dark:text-white font-bold">{{ total() }}</span>
          </p>
          <div class="relative">
            <select [ngModel]="pageSize()" (ngModelChange)="onPageSizeChange($event)"
              class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-violet-500 text-slate-900 dark:text-white rounded-xl px-3 py-1.5 pr-7 text-sm font-bold appearance-none outline-none transition-colors">
              <option [value]="25">25 / pág</option>
              <option [value]="50">50 / pág</option>
              <option [value]="100">100 / pág</option>
            </select>
            <mat-icon class="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none !text-base">expand_more</mat-icon>
          </div>
        </div>
        <div class="flex gap-2">
          <button (click)="prevPage()" [disabled]="skip() === 0"
            class="flex items-center gap-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-xl text-sm font-bold transition-all">
            <mat-icon class="!text-base">chevron_left</mat-icon> Anterior
          </button>
          <button (click)="nextPage()" [disabled]="skip() + pageSize() >= total()"
            class="flex items-center gap-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-xl text-sm font-bold transition-all">
            Siguiente <mat-icon class="!text-base">chevron_right</mat-icon>
          </button>
        </div>
      </div>
    }
  </div>
</div>

<!-- SLIDE PANEL -->
@if (panelOpen()) {
  <div class="fixed inset-0 z-50 flex justify-end">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="closePanel()"></div>
    <div class="relative w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/8 h-full flex flex-col shadow-2xl">

      <div class="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-white/8 px-6 py-5 shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-violet-900 flex items-center justify-center">
              <mat-icon class="text-violet-400 !text-xl">{{ editingId() ? 'edit' : 'add_circle' }}</mat-icon>
            </div>
            <div>
              <h3 class="font-black text-slate-900 dark:text-white">{{ editingId() ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
              <p class="text-xs text-slate-500">{{ editingId() ? 'Modifica los datos del producto' : 'Agrega al catálogo' }}</p>
            </div>
          </div>
          <button (click)="closePanel()"
            class="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <mat-icon class="!text-lg">close</mat-icon>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-6">
        <form [formGroup]="form" class="space-y-5">

          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">SKU / Nombre *</label>
            <input formControlName="nombre" placeholder="Nombre o código del producto"
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors"
              [class.border-red-600]="form.get('nombre')?.invalid && form.get('nombre')?.touched">
            @if (form.get('nombre')?.invalid && form.get('nombre')?.touched) {
              <p class="text-xs text-red-400">El SKU es requerido</p>
            }
          </div>

          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Código de Barras</label>
            <input formControlName="cod_bar" placeholder="Ej: 7501234567890"
              class="w-full bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm font-semibold font-mono text-white placeholder-slate-500 outline-none transition-colors">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Categoría</label>
              <input formControlName="categoria" placeholder="Ej: Bebidas" list="cat-list"
                class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors">
              <datalist id="cat-list">
                @for (c of categorias(); track c) { <option [value]="c"> }
              </datalist>
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fabricante</label>
              <input formControlName="fabricante" placeholder="Ej: Nestlé" list="fab-list"
                class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors">
              <datalist id="fab-list">
                @for (f of fabricantes(); track f) { <option [value]="f"> }
              </datalist>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipo Servicio</label>
              <input formControlName="tipo_servicio" placeholder="Ej: Retail"
                class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors">
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipo Fabricante</label>
              <input formControlName="tipo_fabricante" placeholder="Ej: Nacional"
                class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors">
            </div>
          </div>

          <div class="flex items-center justify-between bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center">
                <mat-icon class="!text-base text-emerald-400">all_inclusive</mat-icon>
              </div>
              <div>
                <p class="text-sm font-bold text-white">Inagotable</p>
                <p class="text-xs text-slate-500">Siempre disponible en stock</p>
              </div>
            </div>
            <button type="button" (click)="toggleInagotable()"
              [ngClass]="form.get('inagotable')?.value ? 'bg-emerald-600' : 'bg-slate-700'"
              class="relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0">
              <span [ngClass]="form.get('inagotable')?.value ? 'translate-x-6' : 'translate-x-1'"
                class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"></span>
            </button>
          </div>
        </form>
      </div>

      <div class="px-6 py-5 border-t border-slate-200 dark:border-white/8 shrink-0 flex gap-3">
        <button type="button" (click)="closePanel()"
          class="flex-1 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl font-bold text-sm transition-all">
          Cancelar
        </button>
        <button type="button" (click)="save()" [disabled]="form.invalid || saving()"
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
export class ProductosComponent implements OnInit {
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  productos = signal<Producto[]>([]);
  total = signal(0);
  loading = signal(false);
  saving = signal(false);
  panelOpen = signal(false);
  editingId = signal<number | null>(null);
  categorias = signal<string[]>([]);
  fabricantes = signal<string[]>([]);
  searchText = signal('');
  filterCat = signal('');
  filterFab = signal('');
  skip = signal(0);
  pageSize = signal(25);

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

  ngOnInit(): void {
    this.load();
    this.loadFiltros();
    this.search$.pipe(debounceTime(350), distinctUntilChanged()).subscribe(() => {
      this.skip.set(0); this.load();
    });
  }

  load(): void {
    this.loading.set(true);
    this.api.getProductos({
      skip: this.skip(), limit: this.pageSize(),
      busqueda: this.searchText() || undefined,
      categoria: this.filterCat() || undefined,
      fabricante: this.filterFab() || undefined,
    }).subscribe({
      next: (res) => { this.productos.set(res.items); this.total.set(res.total); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  loadFiltros(): void {
    this.api.getProductosCategorias().subscribe({ next: d => this.categorias.set(d), error: () => {} });
    this.api.getProductosFabricantes().subscribe({ next: d => this.fabricantes.set(d), error: () => {} });
  }

  onSearch(val: string): void { this.searchText.set(val); this.search$.next(val); }
  clearFilters(): void { this.searchText.set(''); this.filterCat.set(''); this.filterFab.set(''); this.skip.set(0); this.load(); }
  prevPage(): void { this.skip.update(v => Math.max(0, v - this.pageSize())); this.load(); }
  nextPage(): void { this.skip.update(v => v + this.pageSize()); this.load(); }
  onPageSizeChange(size: number): void { this.pageSize.set(+size); this.skip.set(0); this.load(); }

  openPanel(p: Producto | null): void {
    this.editingId.set(p?.id ?? null);
    this.form.reset({ nombre: p?.nombre ?? '', cod_bar: p?.cod_bar ?? '', categoria: p?.categoria ?? '', fabricante: p?.fabricante ?? '', tipo_servicio: p?.tipo_servicio ?? '', tipo_fabricante: p?.tipo_fabricante ?? '', inagotable: p?.inagotable ?? false });
    this.panelOpen.set(true);
  }

  closePanel(): void { this.panelOpen.set(false); }
  toggleInagotable(): void { this.form.patchValue({ inagotable: !this.form.get('inagotable')?.value }); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const op = this.editingId()
      ? this.api.updateProducto(this.editingId()!, this.form.value)
      : this.api.createProducto(this.form.value);
    op.subscribe({
      next: () => { this.saving.set(false); this.closePanel(); this.load(); this.loadFiltros(); this.snack.open(this.editingId() ? 'Producto actualizado' : 'Producto creado', 'OK', { duration: 3000 }); },
      error: (err) => { this.saving.set(false); this.snack.open(err?.error?.detail ?? 'Error al guardar', 'OK', { duration: 4000 }); }
    });
  }

  deleteProducto(p: Producto): void {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    this.api.deleteProducto(p.id).subscribe({
      next: () => { this.load(); this.snack.open('Producto eliminado', 'OK', { duration: 3000 }); },
      error: () => this.snack.open('Error al eliminar', 'OK', { duration: 3000 })
    });
  }
}
