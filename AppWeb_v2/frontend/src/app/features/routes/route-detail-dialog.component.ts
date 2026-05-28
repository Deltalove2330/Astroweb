import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Ruta } from '../../core/models/ruta.model';

@Component({
  selector: 'app-route-detail-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    MatDialogModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatTooltipModule
  ],
  template: `
<div class="flex flex-col bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-white/8"
     style="width:min(96vw,1100px); max-height:90vh;">

  <!-- HEADER -->
  <div class="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border-b border-white/8 shrink-0">
    <div class="flex items-start justify-between px-8 pt-7 pb-5">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
          <mat-icon class="text-white !text-2xl">route</mat-icon>
        </div>
        <div>
          <h2 class="text-xl font-black text-white tracking-tight leading-none mb-1">{{ ruta.nombre }}</h2>
          <div class="flex flex-wrap gap-2 mt-2">
            <span class="px-2.5 py-1 bg-white/8 rounded-lg text-xs font-bold text-slate-400 flex items-center gap-1">
              <mat-icon class="!text-xs text-primary-400">grid_view</mat-icon>{{ ruta.cuadrante || '—' }}
            </span>
            <span class="px-2.5 py-1 bg-white/8 rounded-lg text-xs font-bold text-slate-400 flex items-center gap-1">
              <mat-icon class="!text-xs text-indigo-400">business_center</mat-icon>{{ ruta.servicio || '—' }}
            </span>
            <span class="px-2.5 py-1 bg-white/8 rounded-lg text-xs font-bold text-slate-400 flex items-center gap-1">
              <mat-icon class="!text-xs text-emerald-400">manage_accounts</mat-icon>{{ ruta.coordinador_1 || '—' }}
            </span>
            @if (ruta.coordinador_2) {
              <span class="px-2.5 py-1 bg-white/8 rounded-lg text-xs font-bold text-slate-400 flex items-center gap-1">
                <mat-icon class="!text-xs text-slate-500">person</mat-icon>{{ ruta.coordinador_2 }}
              </span>
            }
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0 ml-4">
        <button (click)="editingRoute.set(!editingRoute())"
          [ngClass]="editingRoute()
            ? 'border-primary-500 text-primary-400 bg-primary-900'
            : 'border-slate-700 text-slate-400 hover:border-slate-500'"
          class="flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-all duration-200 text-sm font-bold"
          matTooltip="Editar datos de la ruta">
          <mat-icon class="!text-base">{{ editingRoute() ? 'close' : 'edit' }}</mat-icon>
          {{ editingRoute() ? 'Cancelar' : 'Editar Ruta' }}
        </button>
        <button (click)="dialogRef.close()"
          class="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
          <mat-icon class="!text-lg">close</mat-icon>
        </button>
      </div>
    </div>

    <!-- Edit Route Form -->
    @if (editingRoute()) {
      <div class="px-8 pb-6 animate-in slide-in-from-top-2 duration-200">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-800 rounded-2xl p-4 border border-white/5">
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cuadrante</label>
            <input [formControl]="$any(editRouteForm.get('cuadrante'))"
              class="w-full bg-slate-700 border border-slate-600 focus:border-primary-500 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none transition-colors"
              placeholder="Norte, Sur...">
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Servicio</label>
            <input [formControl]="$any(editRouteForm.get('servicio'))"
              class="w-full bg-slate-700 border border-slate-600 focus:border-primary-500 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none transition-colors"
              placeholder="Nombre del servicio">
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Coordinador 1</label>
            <input [formControl]="$any(editRouteForm.get('coordinador_1'))"
              class="w-full bg-slate-700 border border-slate-600 focus:border-primary-500 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none transition-colors"
              placeholder="Principal">
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Coordinador 2</label>
            <input [formControl]="$any(editRouteForm.get('coordinador_2'))"
              class="w-full bg-slate-700 border border-slate-600 focus:border-slate-600 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none transition-colors"
              placeholder="Opcional">
          </div>
          <div class="col-span-2 md:col-span-4 flex justify-end pt-1">
            <button type="button" (click)="saveRoute()" [disabled]="savingRoute()"
              class="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-xl text-sm shadow-lg transition-all active:scale-95 disabled:opacity-50">
              @if (savingRoute()) { <mat-spinner diameter="14"></mat-spinner> } @else { <mat-icon class="!text-base">save</mat-icon> }
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Tabs -->
    <div class="flex gap-1 px-8">
      <button type="button" (click)="activeTab.set('points')"
        [ngClass]="activeTab()==='points' ? 'bg-slate-950 text-white' : 'text-slate-500 hover:text-slate-300'"
        class="px-5 py-2.5 text-sm font-black rounded-t-xl transition-all duration-200 flex items-center gap-2">
        <mat-icon class="!text-base">location_on</mat-icon>
        Puntos
        <span class="bg-primary-900 text-primary-400 text-xs px-2 py-0.5 rounded-full">{{ routePoints().length }}</span>
      </button>
      <button type="button" (click)="loadTab('changes')"
        [ngClass]="activeTab()==='changes' ? 'bg-slate-950 text-white' : 'text-slate-500 hover:text-slate-300'"
        class="px-5 py-2.5 text-sm font-black rounded-t-xl transition-all duration-200 flex items-center gap-2">
        <mat-icon class="!text-base">schedule</mat-icon>
        Cambios Futuros
        <span class="bg-amber-900 text-amber-400 text-xs px-2 py-0.5 rounded-full">{{ futureChanges().length }}</span>
      </button>
    </div>
  </div>

  <!-- BODY -->
  <div class="flex-1 overflow-y-auto">

    <!-- TAB POINTS -->
    @if (activeTab() === 'points') {

      <!-- Add Point Form -->
      <div class="px-8 py-6 border-b border-white/5 bg-slate-900">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-7 h-7 rounded-lg bg-emerald-900 flex items-center justify-center">
            <mat-icon class="!text-sm text-emerald-400">add_location_alt</mat-icon>
          </div>
          <span class="text-sm font-black text-slate-300 uppercase tracking-widest">Agregar Nuevo Punto</span>
        </div>
        <form [formGroup]="addPointForm" (ngSubmit)="addPoint()" class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="space-y-1.5 col-span-2 md:col-span-1 relative">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Punto de Interés *</label>
            <div class="relative">
              <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none !text-base">search</mat-icon>
              <input #pointSearch
                [value]="pointSearchText()"
                (input)="onPointSearch(pointSearch.value)"
                placeholder="Buscar punto..."
                autocomplete="off"
                class="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 text-white placeholder-slate-500 rounded-xl pl-9 pr-3 py-2.5 text-sm font-semibold outline-none transition-colors">
            </div>
            @if (pointResults().length > 0) {
              <div class="absolute z-50 top-full mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-h-52 overflow-y-auto">
                @for (p of pointResults(); track p.id) {
                  <button type="button" (click)="selectPoint(p)"
                    class="w-full text-left px-4 py-2.5 hover:bg-slate-700 text-sm text-white font-semibold border-b border-slate-700 last:border-0 transition-colors">
                    <span class="block truncate">{{ p.nombre }}</span>
                    <span class="block text-xs text-slate-500 truncate">{{ p.direccion || p.ciudad }}</span>
                  </button>
                }
              </div>
            }
            @if (searchingPoints()) {
              <div class="absolute z-50 top-full mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                <mat-spinner diameter="12"></mat-spinner> Buscando...
              </div>
            }
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cliente *</label>
            <div class="relative">
              <select formControlName="client_id"
                class="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 text-white rounded-xl px-3 py-2.5 pr-8 text-sm font-semibold appearance-none outline-none transition-colors">
                <option value="" disabled>Seleccionar...</option>
                <option *ngFor="let c of clients()" [value]="c.id">{{ c.nombre }}</option>
              </select>
              <mat-icon class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none !text-base">expand_more</mat-icon>
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Día *</label>
            <div class="relative">
              <select formControlName="dia"
                class="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 text-white rounded-xl px-3 py-2.5 pr-8 text-sm font-semibold appearance-none outline-none transition-colors">
                <option value="" disabled>Día...</option>
                @for (d of dias; track d.v) { <option [value]="d.v">{{ d.l }}</option> }
              </select>
              <mat-icon class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none !text-base">expand_more</mat-icon>
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prioridad *</label>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <select formControlName="priority"
                  class="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 text-white rounded-xl px-3 py-2.5 pr-8 text-sm font-semibold appearance-none outline-none transition-colors">
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
                <mat-icon class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none !text-base">expand_more</mat-icon>
              </div>
              <button type="submit" [disabled]="addPointForm.invalid || adding()"
                class="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-xl font-black text-sm transition-all active:scale-95 flex items-center gap-1 whitespace-nowrap shadow-lg">
                @if (adding()) { <mat-spinner diameter="14"></mat-spinner> } @else { <mat-icon class="!text-base">add</mat-icon> }
                Agregar
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Points List -->
      <div class="px-8 py-5 space-y-2">
        @if (routePoints().length === 0) {
          <div class="flex flex-col items-center justify-center py-20 gap-4 text-slate-600">
            <div class="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center">
              <mat-icon class="!text-3xl">location_off</mat-icon>
            </div>
            <p class="font-bold tracking-tight">No hay puntos programados para esta ruta</p>
          </div>
        }
        @for (p of routePoints(); track p.id) {
          @if (editingPointId() === p.id) {
            <!-- INLINE EDIT -->
            <div class="bg-slate-800 border border-primary-700 rounded-2xl p-4">
              <div class="flex items-center gap-2 mb-3">
                <mat-icon class="!text-base text-primary-400">edit_location</mat-icon>
                <span class="text-xs font-black text-primary-400 uppercase tracking-widest">Editando:</span>
                <span class="text-sm font-bold text-white truncate">{{ p.punto?.nombre }}</span>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="space-y-1.5">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cliente</label>
                  <div class="relative">
                    <select [(ngModel)]="inlineEdit['client_id']"
                      class="w-full bg-slate-700 border border-slate-600 focus:border-primary-500 text-white rounded-xl px-3 py-2 pr-8 text-sm font-semibold appearance-none outline-none">
                      <option *ngFor="let c of clients()" [value]="c.id">{{ c.nombre }}</option>
                    </select>
                    <mat-icon class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none !text-base">expand_more</mat-icon>
                  </div>
                </div>
                <div class="space-y-1.5">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Día</label>
                  <div class="relative">
                    <select [(ngModel)]="inlineEdit['dia']"
                      class="w-full bg-slate-700 border border-slate-600 focus:border-primary-500 text-white rounded-xl px-3 py-2 pr-8 text-sm font-semibold appearance-none outline-none">
                      @for (d of dias; track d.v) { <option [value]="d.v">{{ d.l }}</option> }
                    </select>
                    <mat-icon class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none !text-base">expand_more</mat-icon>
                  </div>
                </div>
                <div class="space-y-1.5">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prioridad</label>
                  <div class="relative">
                    <select [(ngModel)]="inlineEdit['prioridad']"
                      class="w-full bg-slate-700 border border-slate-600 focus:border-primary-500 text-white rounded-xl px-3 py-2 pr-8 text-sm font-semibold appearance-none outline-none">
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                    <mat-icon class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none !text-base">expand_more</mat-icon>
                  </div>
                </div>
                <div class="space-y-1.5">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aplicar</label>
                  <div class="relative">
                    <select [(ngModel)]="inlineEdit['tipo']"
                      class="w-full bg-slate-700 border border-slate-600 focus:border-amber-500 text-white rounded-xl px-3 py-2 pr-8 text-sm font-semibold appearance-none outline-none">
                      <option value="inmediato">Inmediato</option>
                      <option value="futuro">Programar fecha</option>
                    </select>
                    <mat-icon class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none !text-base">expand_more</mat-icon>
                  </div>
                </div>
                @if (inlineEdit['tipo'] === 'futuro') {
                  <div class="space-y-1.5 col-span-2">
                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fecha de ejecución</label>
                    <input type="date" [(ngModel)]="inlineEdit['fecha_ejecucion']"
                      class="w-full bg-slate-700 border border-amber-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 text-sm font-semibold outline-none">
                  </div>
                  <div class="space-y-1.5 col-span-2">
                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Observaciones</label>
                    <input [(ngModel)]="inlineEdit['observaciones']" placeholder="Motivo del cambio..."
                      class="w-full bg-slate-700 border border-slate-600 focus:border-amber-500 text-white placeholder-slate-600 rounded-xl px-3 py-2 text-sm font-semibold outline-none">
                  </div>
                }
              </div>
              <div class="flex justify-end gap-2 mt-4">
                <button type="button" (click)="editingPointId.set(null)"
                  class="px-4 py-2 rounded-xl border border-slate-600 text-slate-400 hover:text-white text-sm font-bold transition-all">
                  Cancelar
                </button>
                <button type="button" (click)="savePointEdit(p)" [disabled]="savingPoint()"
                  [ngClass]="inlineEdit['tipo']==='futuro' ? 'bg-amber-700 hover:bg-amber-600' : 'bg-primary-700 hover:bg-primary-600'"
                  class="flex items-center gap-2 px-5 py-2 rounded-xl font-black text-sm text-white transition-all active:scale-95 shadow-lg disabled:opacity-50">
                  @if (savingPoint()) { <mat-spinner diameter="14"></mat-spinner> }
                  @else if (inlineEdit['tipo']==='futuro') { <mat-icon class="!text-base">schedule</mat-icon> Programar Cambio }
                  @else { <mat-icon class="!text-base">save</mat-icon> Guardar Ahora }
                </button>
              </div>
            </div>
          } @else {
            <!-- NORMAL ROW -->
            <div class="flex items-center gap-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl px-5 py-4 transition-all duration-200 group">
              <div class="w-8 h-8 rounded-xl bg-primary-900 flex items-center justify-center shrink-0">
                <mat-icon class="!text-sm text-primary-400">storefront</mat-icon>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-white text-sm truncate">{{ p.punto?.nombre || '—' }}</p>
                <p class="text-xs text-slate-500 font-medium">{{ p.cliente?.nombre || '—' }}</p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-black text-slate-400 uppercase tracking-tight">
                  {{ p.dia }}
                </span>
                <span [ngClass]="getPriorityClass(p.prioridad)" class="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tight">
                  {{ p.prioridad }}
                </span>
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button type="button" (click)="startEditPoint(p)" matTooltip="Editar / Programar cambio"
                    class="w-8 h-8 rounded-lg bg-primary-900 hover:bg-primary-800 text-primary-400 flex items-center justify-center transition-all">
                    <mat-icon class="!text-base">edit</mat-icon>
                  </button>
                  <button type="button" (click)="removePoint(p)" matTooltip="Eliminar punto"
                    class="w-8 h-8 rounded-lg bg-red-950 hover:bg-red-900 text-red-400 flex items-center justify-center transition-all">
                    <mat-icon class="!text-base">delete</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          }
        }
      </div>
    }

    <!-- TAB CHANGES -->
    @if (activeTab() === 'changes') {
      <div class="px-8 py-6 space-y-3">
        @if (futureChanges().length === 0) {
          <div class="flex flex-col items-center justify-center py-20 gap-4 text-slate-600">
            <div class="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center">
              <mat-icon class="!text-3xl">event_available</mat-icon>
            </div>
            <p class="font-bold tracking-tight">No hay cambios futuros programados</p>
            <p class="text-sm text-slate-700 text-center max-w-xs">Edita un punto y selecciona "Programar fecha" para agendar un cambio.</p>
          </div>
        }
        @for (c of futureChanges(); track c.id) {
          <div [ngClass]="getChangeCardBorder(c)"
            class="flex items-start gap-4 bg-slate-900 border rounded-2xl px-5 py-4">
            <div [ngClass]="getChangeIconBg(c)"
              class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
              <mat-icon [ngClass]="getChangeIconColor(c)" class="!text-lg">
                {{ c.estado === 'ejecutado' ? 'task_alt' : 'schedule' }}
              </mat-icon>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-black text-white text-sm">{{ c.punto_interes_nombre || '—' }}</span>
                <span [ngClass]="getChangeBadge(c)" class="px-2 py-0.5 rounded-full text-xs font-black uppercase">
                  {{ c.estado || 'pendiente' }}
                </span>
              </div>
              <div class="flex flex-wrap gap-3 text-xs text-slate-500">
                @if (c.fecha_ejecucion) {
                  <span class="flex items-center gap-1"><mat-icon class="!text-xs">calendar_today</mat-icon>{{ c.fecha_ejecucion | date:'dd/MM/yyyy' }}</span>
                }
                @if (c.dia) { <span class="flex items-center gap-1"><mat-icon class="!text-xs">today</mat-icon>{{ c.dia }}</span> }
                @if (c.prioridad) { <span class="flex items-center gap-1"><mat-icon class="!text-xs">flag</mat-icon>{{ c.prioridad }}</span> }
                @if (c.cliente_nombre) { <span class="flex items-center gap-1"><mat-icon class="!text-xs">business</mat-icon>{{ c.cliente_nombre }}</span> }
              </div>
              @if (c.observaciones) {
                <p class="mt-1.5 text-xs text-slate-600 italic">"{{ c.observaciones }}"</p>
              }
            </div>
            <span class="text-xs font-bold text-slate-600 shrink-0 mt-1">{{ c.tipo_cambio || 'modificación' }}</span>
          </div>
        }
      </div>
    }
  </div>
</div>
  `,
  styles: []
})
export class RouteDetailDialogComponent implements OnInit {
  points = signal<any[]>([]);
  clients = signal<any[]>([]);
  routePoints = signal<any[]>([]);
  futureChanges = signal<any[]>([]);
  pointResults = signal<any[]>([]);
  pointSearchText = signal('');
  searchingPoints = signal(false);
  selectedPoint: any = null;
  adding = signal(false);
  savingRoute = signal(false);
  savingPoint = signal(false);
  editingRoute = signal(false);
  editingPointId = signal<number | null>(null);
  activeTab = signal<'points' | 'changes'>('points');
  inlineEdit: Record<string, any> = {};
  ruta!: Ruta;

  private pointSearch$ = new Subject<string>();

  dias = [
    { v: 'Lunes', l: 'Lunes' }, { v: 'Martes', l: 'Martes' },
    { v: 'Miercoles', l: 'Miércoles' }, { v: 'Jueves', l: 'Jueves' },
    { v: 'Viernes', l: 'Viernes' }, { v: 'Sabado', l: 'Sábado' },
    { v: 'Domingo', l: 'Domingo' }
  ];

  addPointForm = this.fb.group({
    point_id: ['', Validators.required],
    client_id: ['', Validators.required],
    dia: ['', Validators.required],
    priority: ['Alta', Validators.required]
  });

  editRouteForm = this.fb.group({
    cuadrante: [''], servicio: [''],
    coordinador_1: [''], coordinador_2: ['']
  });

  constructor(
    public dialogRef: MatDialogRef<RouteDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ruta: Ruta },
    private api: ApiService,
    private fb: FormBuilder,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.ruta = { ...this.data.ruta };
    this.editRouteForm.patchValue({
      cuadrante: this.ruta.cuadrante ?? '',
      servicio: this.ruta.servicio ?? '',
      coordinador_1: this.ruta.coordinador_1 ?? '',
      coordinador_2: this.ruta.coordinador_2 ?? ''
    });
    this.api.getClients().subscribe((d: any) => this.clients.set(d));
    this.loadRoutePoints();

    this.pointSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term || term.length < 2) { this.pointResults.set([]); this.searchingPoints.set(false); return of([]); }
        this.searchingPoints.set(true);
        return this.api.getPoints({ search: term, limit: 30 });
      })
    ).subscribe({
      next: (res: any[]) => { this.pointResults.set(res); this.searchingPoints.set(false); },
      error: () => this.searchingPoints.set(false)
    });
  }

  onPointSearch(term: string): void {
    this.pointSearchText.set(term);
    this.selectedPoint = null;
    this.addPointForm.patchValue({ point_id: '' });
    this.pointSearch$.next(term);
  }

  selectPoint(p: any): void {
    this.selectedPoint = p;
    this.pointSearchText.set(p.nombre ?? '');
    this.addPointForm.patchValue({ point_id: p.id });
    this.pointResults.set([]);
  }

  loadRoutePoints(): void {
    this.api.getRoutePoints(this.ruta.id).subscribe(d => this.routePoints.set(d));
  }

  loadTab(tab: 'points' | 'changes'): void {
    this.activeTab.set(tab);
    if (tab === 'changes') {
      this.api.getFutureChanges(this.ruta.id).subscribe(d => this.futureChanges.set(d));
    }
  }

  saveRoute(): void {
    this.savingRoute.set(true);
    this.api.updateRoute(this.ruta.id, this.editRouteForm.value).subscribe({
      next: (updated) => {
        this.ruta = { ...this.ruta, ...updated };
        this.savingRoute.set(false);
        this.editingRoute.set(false);
        this.snack.open('Ruta actualizada', 'OK', { duration: 3000 });
      },
      error: () => this.savingRoute.set(false)
    });
  }

  addPoint(): void {
    if (this.addPointForm.invalid) return;
    this.adding.set(true);
    this.api.addPointToRoute(this.ruta.id, this.addPointForm.value).subscribe({
      next: () => {
        this.adding.set(false);
        this.addPointForm.reset({ priority: 'Alta' });
        this.pointSearchText.set('');
        this.selectedPoint = null;
        this.pointResults.set([]);
        this.loadRoutePoints();
        this.snack.open('Punto agregado', 'OK', { duration: 3000 });
      },
      error: () => this.adding.set(false)
    });
  }

  startEditPoint(p: any): void {
    this.editingPointId.set(p.id);
    this.inlineEdit = {
      client_id: p.cliente?.id ?? '',
      dia: p.dia ?? '',
      prioridad: p.prioridad ?? 'Media',
      tipo: 'inmediato',
      fecha_ejecucion: '',
      observaciones: ''
    };
  }

  savePointEdit(p: any): void {
    this.savingPoint.set(true);
    if (this.inlineEdit['tipo'] === 'futuro') {
      const clienteObj = this.clients().find((c: any) => c.id == this.inlineEdit['client_id']);
      const payload = {
        id_programacion: p.id,
        id_punto_interes: p.punto?.id ?? p.punto_id,
        punto_interes_nombre: p.punto?.nombre,
        id_cliente: this.inlineEdit['client_id'],
        cliente_nombre: clienteObj?.nombre ?? '',
        dia: this.inlineEdit['dia'],
        prioridad: this.inlineEdit['prioridad'],
        tipo_cambio: 'modificacion',
        fecha_ejecucion: this.inlineEdit['fecha_ejecucion'],
        observaciones: this.inlineEdit['observaciones']
      };
      this.api.scheduleChange(this.ruta.id, payload).subscribe({
        next: () => {
          this.savingPoint.set(false);
          this.editingPointId.set(null);
          this.snack.open('Cambio futuro programado', 'OK', { duration: 3000 });
        },
        error: () => this.savingPoint.set(false)
      });
    } else {
      const payload = {
        point_id: p.punto?.id ?? p.punto_id,
        client_id: this.inlineEdit['client_id'],
        dia: this.inlineEdit['dia'],
        priority: this.inlineEdit['prioridad']
      };
      this.api.removePointFromRoute(p.id).subscribe({
        next: () => {
          this.api.addPointToRoute(this.ruta.id, payload).subscribe({
            next: () => {
              this.savingPoint.set(false);
              this.editingPointId.set(null);
              this.loadRoutePoints();
              this.snack.open('Punto actualizado', 'OK', { duration: 3000 });
            },
            error: () => this.savingPoint.set(false)
          });
        },
        error: () => this.savingPoint.set(false)
      });
    }
  }

  removePoint(point: any): void {
    if (!confirm('¿Desea eliminar este punto de la ruta?')) return;
    this.api.removePointFromRoute(point.id).subscribe({
      next: () => { this.loadRoutePoints(); this.snack.open('Punto eliminado', 'OK', { duration: 3000 }); }
    });
  }

  getPriorityClass(p: string): string {
    switch (p) {
      case 'Alta':  return 'bg-red-950 text-red-400 border border-red-900';
      case 'Media': return 'bg-amber-950 text-amber-400 border border-amber-900';
      case 'Baja':  return 'bg-sky-950 text-sky-400 border border-sky-900';
      default:      return 'bg-slate-800 text-slate-400';
    }
  }

  getChangeCardBorder(c: any): string {
    if (c.estado === 'pendiente' || !c.estado) return 'border-amber-900';
    if (c.estado === 'ejecutado') return 'border-emerald-900';
    return 'border-slate-800';
  }

  getChangeIconBg(c: any): string {
    if (c.estado === 'pendiente' || !c.estado) return 'bg-amber-950';
    if (c.estado === 'ejecutado') return 'bg-emerald-950';
    return 'bg-slate-800';
  }

  getChangeIconColor(c: any): string {
    if (c.estado === 'pendiente' || !c.estado) return 'text-amber-400';
    if (c.estado === 'ejecutado') return 'text-emerald-400';
    return 'text-slate-400';
  }

  getChangeBadge(c: any): string {
    if (c.estado === 'pendiente' || !c.estado) return 'bg-amber-950 text-amber-400';
    if (c.estado === 'ejecutado') return 'bg-emerald-950 text-emerald-400';
    return 'bg-slate-800 text-slate-400';
  }
}
