import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

type Ruta = { id: number; nombre: string; total_puntos: number; esta_activa: boolean };
type Pdv = { id: string; nombre: string; prioridad: string; total_clientes: number; activado: boolean };
type Cli = { id: number; nombre: string; prioridad: string };
type Cat = { id: number; nombre: string };

@Component({
  selector: 'app-auditor-campo',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule],
  template: `
<div class="min-h-screen bg-slate-950 text-white">
  <!-- HEADER + STEPPER -->
  <div class="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-white/8 px-6 py-5">
    <div class="flex items-center gap-3">
      <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg">
        <mat-icon class="text-white">fact_check</mat-icon>
      </div>
      <div>
        <h1 class="text-xl font-black tracking-tight leading-none">Auditoría de Campo</h1>
        <p class="text-slate-400 text-xs mt-0.5">{{ crumb() || ('CI ' + cedula) }}</p>
      </div>
    </div>
    <div class="flex gap-2 mt-4">
      @for (s of steps; track s.n) {
        <div class="flex-1 text-center">
          <div class="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-black border-2 transition-all"
               [ngClass]="step()===s.n ? 'bg-violet-600 border-violet-500 text-white' : step()>s.n ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'">
            @if (step()>s.n) { <mat-icon class="!text-base">check</mat-icon> } @else { {{ s.n }} }
          </div>
          <span class="text-[10px] font-bold uppercase tracking-wider mt-1 block"
                [ngClass]="step()>=s.n ? 'text-violet-300' : 'text-slate-600'">{{ s.label }}</span>
        </div>
      }
    </div>
  </div>

  <div class="px-6 py-6 max-w-3xl mx-auto pb-28">
    @if (loading()) {
      <div class="flex justify-center py-24"><mat-spinner diameter="40"></mat-spinner></div>
    } @else {

    <!-- STEP 1: RUTAS -->
    @if (step()===1) {
      <h2 class="text-lg font-black mb-1">Mis rutas</h2>
      <p class="text-slate-400 text-sm mb-4">Selecciona una ruta para iniciar la jornada</p>
      @for (r of rutas(); track r.id) {
        <div class="bg-slate-900 border border-white/8 rounded-2xl p-4 mb-3 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-violet-900 flex items-center justify-center"><mat-icon class="text-violet-400">route</mat-icon></div>
          <div class="flex-1 min-w-0">
            <p class="font-bold truncate">{{ r.nombre }}</p>
            <p class="text-xs text-slate-400">{{ r.total_puntos }} PDVs @if(r.esta_activa){<span class="text-emerald-400 font-bold">· Activa</span>}</p>
          </div>
          <button (click)="activarRuta(r)" class="px-4 py-2 bg-violet-700 hover:bg-violet-600 rounded-xl text-sm font-bold">{{ r.esta_activa ? 'Continuar' : 'Activar' }}</button>
          @if(!r.esta_activa){ <button (click)="noActivar(r)" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold text-slate-300">No activar</button> }
        </div>
      }
      @if(!rutas().length){ <p class="text-center text-slate-600 py-12">No tienes rutas asignadas.</p> }
    }

    <!-- STEP 2: PDVs -->
    @if (step()===2) {
      <h2 class="text-lg font-black mb-1">Puntos de venta</h2>
      <p class="text-slate-400 text-sm mb-4">Programados para hoy</p>
      @for (p of pdvs(); track p.id) {
        <div class="bg-slate-900 border border-white/8 rounded-2xl p-4 mb-3 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" [ngClass]="p.activado?'bg-emerald-900':'bg-slate-800'"><mat-icon [ngClass]="p.activado?'text-emerald-400':'text-slate-400'">store</mat-icon></div>
          <div class="flex-1 min-w-0">
            <p class="font-bold truncate">{{ p.nombre }}</p>
            <p class="text-xs text-slate-400">{{ p.total_clientes }} clientes · <span [ngClass]="p.activado?'text-emerald-400':'text-amber-400'">{{ p.activado?'Activado':'Pendiente' }}</span></p>
          </div>
          @if(p.activado){ <button (click)="abrirClientes(p)" class="px-4 py-2 bg-violet-900 hover:bg-violet-800 rounded-xl text-sm font-bold text-violet-300">Clientes</button> }
          @else { <button (click)="activarPdv(p)" class="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl text-sm font-bold flex items-center gap-1"><mat-icon class="!text-base">photo_camera</mat-icon>Activar</button> }
        </div>
      }
      @if(!pdvs().length){ <p class="text-center text-slate-600 py-12">No hay PDVs programados para hoy.</p> }
    }

    <!-- STEP 3: CLIENTES + CATEGORIAS -->
    @if (step()===3 && !clienteSel()) {
      <h2 class="text-lg font-black mb-1">Clientes del PDV</h2>
      <p class="text-slate-400 text-sm mb-4">Selecciona el cliente a auditar</p>
      @for (c of clientes(); track c.id) {
        <button (click)="iniciarCliente(c)" class="w-full text-left bg-slate-900 hover:bg-slate-800 border border-white/8 rounded-2xl p-4 mb-3 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-violet-900 flex items-center justify-center"><mat-icon class="text-violet-400">person</mat-icon></div>
          <div class="flex-1"><p class="font-bold">{{ c.nombre }}</p><span class="text-xs px-2 py-0.5 bg-violet-950 text-violet-300 rounded-full font-bold">{{ c.prioridad }}</span></div>
          <mat-icon class="text-slate-600">chevron_right</mat-icon>
        </button>
      }
      @if(!clientes().length){ <p class="text-center text-slate-600 py-12">Sin clientes para hoy.</p> }
    }
    @if (step()===3 && clienteSel() && !catSel()) {
      <h2 class="text-lg font-black mb-1">Categorías a auditar</h2>
      <p class="text-slate-400 text-sm mb-4">{{ clienteSel()?.nombre }}</p>
      @for (cat of categorias(); track cat.id) {
        <button (click)="abrirCategoria(cat)" class="w-full text-left bg-slate-900 hover:bg-slate-800 border border-white/8 rounded-2xl p-4 mb-3 flex items-center gap-3" [class.opacity-50]="catsHechas().includes(cat.id)">
          <div class="w-10 h-10 rounded-xl bg-violet-900 flex items-center justify-center"><mat-icon class="text-violet-400">layers</mat-icon></div>
          <div class="flex-1"><p class="font-bold">{{ cat.nombre }}</p><p class="text-xs text-slate-500">{{ catsHechas().includes(cat.id)?'Auditada':'Toca para auditar' }}</p></div>
          <mat-icon class="text-slate-600">chevron_right</mat-icon>
        </button>
      }
      @if(!categorias().length){ <p class="text-center text-slate-600 py-12">Este cliente no tiene categorías configuradas.</p> }
    }

    <!-- STEP 4: CUESTIONARIO -->
    @if (step()===4 && catSel()) {
      <h2 class="text-lg font-black mb-1">{{ catSel()?.nombre }}</h2>
      <p class="text-slate-400 text-sm mb-4">Cuestionario de auditoría</p>

      <div class="bg-slate-900 border border-white/8 rounded-2xl overflow-hidden mb-3">
        <div class="px-4 py-2.5 bg-slate-800 text-violet-400 text-xs font-black uppercase tracking-wider">Fotos de la categoría</div>
        <div class="p-4 flex items-center justify-between">
          <span class="text-sm text-slate-400">Puedes tomar varias</span>
          <div class="flex items-center gap-2">
            <span class="text-xs px-2 py-1 bg-violet-950 text-violet-300 rounded-full font-bold">{{ fotos() }} fotos</span>
            <button (click)="cam('cat')" class="px-3 py-2 bg-violet-900 hover:bg-violet-800 rounded-xl text-sm font-bold text-violet-300 flex items-center gap-1"><mat-icon class="!text-base">photo_camera</mat-icon>Tomar</button>
          </div>
        </div>
      </div>

      @for (sec of secciones; track sec.t) {
        <div class="bg-slate-900 border border-white/8 rounded-2xl overflow-hidden mb-3">
          <div class="px-4 py-2.5 bg-slate-800 text-violet-400 text-xs font-black uppercase tracking-wider">{{ sec.t }}</div>
          <div class="p-4 space-y-1">
            @for (q of sec.qs; track q.k) {
              <div class="flex items-center justify-between gap-3 py-2.5 border-b border-white/5 last:border-0">
                <span class="text-sm font-semibold">{{ q.l }}</span>
                <div class="flex rounded-lg overflow-hidden border border-slate-700 shrink-0">
                  <button (click)="form[q.k]=1" [ngClass]="form[q.k]===1?'bg-emerald-600 text-white':'bg-slate-800 text-slate-400'" class="px-4 py-1.5 text-sm font-bold">Sí</button>
                  <button (click)="form[q.k]=0" [ngClass]="form[q.k]===0?'bg-red-600 text-white':'bg-slate-800 text-slate-400'" class="px-4 py-1.5 text-sm font-bold border-l border-slate-700">No</button>
                </div>
              </div>
              @if (q.k==='prox_vencer' && form['prox_vencer']===1) {
                <div class="pl-1 pb-2 grid grid-cols-2 gap-2">
                  <input [(ngModel)]="form['prox_vencer_cantidad']" type="number" placeholder="Cantidad" class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none">
                  <input [(ngModel)]="form['prox_vencer_marca']" placeholder="Marca" class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none">
                </div>
              }
              @if (q.k==='competencia_actividad' && form['competencia_actividad']===1) {
                <div class="pl-1 pb-2 space-y-2">
                  <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="form['competencia_material_pop']" class="w-4 h-4"> Hay material POP</label>
                  <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="form['competencia_impulsadora']" class="w-4 h-4"> Hay impulsadora</label>
                </div>
              }
              @if (q.k==='promo_nuestra' && form['promo_nuestra']===1) {
                <input [(ngModel)]="form['promo_nuestra_desc']" placeholder="¿Cuáles?" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none mb-2">
              }
              @if (q.k==='promo_competencia' && form['promo_competencia']===1) {
                <input [(ngModel)]="form['promo_competencia_desc']" placeholder="Describe" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none mb-2">
              }
              @if (q.k==='exhibicion_adicional' && form['exhibicion_adicional']===1) {
                <div class="pl-1 pb-2 flex flex-wrap gap-3">
                  @for (t of exhibTipos; track t) {
                    <label class="flex items-center gap-1.5 text-sm"><input type="checkbox" [checked]="exhibSel.has(t)" (change)="toggleExhib(t)" class="w-4 h-4"> {{ t }}</label>
                  }
                </div>
              }
            }
            @if (sec.t === 'Material POP del cliente') {
              <input [(ngModel)]="form['pop_otro']" placeholder="Otro material POP (opcional)" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none mt-1">
            }
          </div>
        </div>
      }
      <div class="flex gap-2 mt-4">
        <button (click)="catSel.set(null)" class="flex-1 py-3 border border-slate-700 rounded-xl font-bold text-slate-400">Cancelar</button>
        <button (click)="guardarCategoria()" [disabled]="saving()" class="flex-1 py-3 bg-gradient-to-r from-violet-700 to-purple-700 rounded-xl font-black flex items-center justify-center gap-2">
          @if(saving()){<mat-spinner diameter="18"></mat-spinner>}@else{<mat-icon class="!text-base">save</mat-icon>} Guardar
        </button>
      </div>
    }
    }
  </div>

  <!-- FOOTER ACCIONES -->
  @if (!loading() && footerBtns().length) {
    <div class="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-white/8 px-6 py-3 flex gap-2 max-w-3xl mx-auto">
      @for (b of footerBtns(); track b.l) {
        <button (click)="b.fn()" class="flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5" [ngClass]="b.cls">
          <mat-icon class="!text-base">{{ b.i }}</mat-icon>{{ b.l }}
        </button>
      }
    </div>
  }

  <!-- camera input + overlay -->
  <input #camInput type="file" accept="image/*" capture="environment" class="hidden" (change)="onCam($event)">
  @if (uploading()) {
    <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div class="bg-slate-900 rounded-2xl px-8 py-6 text-center border border-white/10">
        <mat-spinner diameter="40" class="mx-auto"></mat-spinner>
        <p class="mt-3 font-bold">{{ uploadMsg() }}</p>
      </div>
    </div>
  }
</div>
  `,
})
export class AuditorCampoComponent implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private snack = inject(MatSnackBar);
  private API = `${environment.apiUrl}/api/auditor-campo`;
  cedula = this.auth.currentUser()?.username || '';

  steps = [{ n: 1, label: 'Ruta' }, { n: 2, label: 'PDV' }, { n: 3, label: 'Cliente' }, { n: 4, label: 'Auditoría' }];
  exhibTipos = ['Cabezal', 'Torre', 'Isla', 'Cross', 'Checkout'];
  exhibSel = new Set<string>();
  secciones = [
    { t: 'Cumplimiento en el anaquel', qs: [
      { k: 'aplico_planograma', l: '¿Aplicó planograma?' }, { k: 'lineamiento_marca', l: 'Lineamiento de marca' },
      { k: 'precio_correcto', l: 'Precio colocado correcto' }, { k: 'limpieza_correcta', l: 'Limpieza correcta' },
      { k: 'participacion_correcta', l: 'Participación según objetivos' }, { k: 'fifo_correcto', l: 'Aplicación correcta de FIFO' } ] },
    { t: 'Vencimiento y competencia', qs: [
      { k: 'prox_vencer', l: '¿Productos próximos a vencer?' }, { k: 'competencia_actividad', l: '¿Actividad de la competencia?' } ] },
    { t: 'Material POP del cliente', qs: [
      { k: 'pop_hablador', l: 'Hablador' }, { k: 'pop_rompetrafico', l: 'Rompetráfico' } ] },
    { t: 'Promociones', qs: [
      { k: 'promo_nuestra', l: '¿Promociones nuestras?' }, { k: 'promo_competencia', l: '¿Promociones de la competencia?' } ] },
    { t: 'Exhibición adicional', qs: [ { k: 'exhibicion_adicional', l: '¿Existe exhibición adicional?' } ] },
  ];

  step = signal(1);
  loading = signal(false);
  saving = signal(false);
  uploading = signal(false);
  uploadMsg = signal('Subiendo foto…');
  rutas = signal<Ruta[]>([]);
  pdvs = signal<Pdv[]>([]);
  clientes = signal<Cli[]>([]);
  categorias = signal<Cat[]>([]);
  catsHechas = signal<number[]>([]);
  rutaSel = signal<Ruta | null>(null);
  pdvSel = signal<Pdv | null>(null);
  clienteSel = signal<Cli | null>(null);
  catSel = signal<Cat | null>(null);
  idVisita = signal<number | null>(null);
  fotos = signal(0);
  form: any = {};
  private camMode: 'pdv-on' | 'pdv-off' | 'cat' = 'cat';

  ngOnInit() { this.loadRutas(); }

  crumb() {
    return [this.rutaSel()?.nombre, this.pdvSel()?.nombre, this.clienteSel()?.nombre, this.catSel()?.nombre].filter(Boolean).join('  ›  ');
  }
  footerBtns(): any[] {
    if (this.step() === 2) return [
      { l: 'Rutas', i: 'arrow_back', cls: 'bg-slate-800 text-slate-300', fn: () => this.loadRutas() },
      { l: 'Terminar jornada', i: 'flag', cls: 'bg-red-950 text-red-300', fn: () => this.desactivarRuta() }];
    if (this.step() === 3 && !this.clienteSel()) return [
      { l: 'PDVs', i: 'arrow_back', cls: 'bg-slate-800 text-slate-300', fn: () => this.loadPdvs() },
      { l: 'Desactivar PDV', i: 'photo_camera', cls: 'bg-red-950 text-red-300', fn: () => this.cam('pdv-off') }];
    if (this.step() === 3 && this.clienteSel()) return [
      { l: 'Clientes', i: 'arrow_back', cls: 'bg-slate-800 text-slate-300', fn: () => this.abrirClientes(this.pdvSel()!) },
      { l: 'Terminar cliente', i: 'check', cls: 'bg-emerald-900 text-emerald-300', fn: () => this.finalizarCliente() }];
    return [];
  }

  private get<T>(u: string) { return this.http.get<T>(`${this.API}${u}`); }
  private post<T>(u: string, b: any) { return this.http.post<T>(`${this.API}${u}`, b); }
  err(e: any) { this.snack.open(e?.error?.detail || e?.error?.message || 'Error', 'OK', { duration: 4000 }); }

  loadRutas() {
    this.step.set(1); this.rutaSel.set(null); this.pdvSel.set(null); this.clienteSel.set(null); this.catSel.set(null);
    this.loading.set(true);
    this.get<Ruta[]>(`/rutas/${this.cedula}`).subscribe({ next: r => { this.rutas.set(r); this.loading.set(false); }, error: e => { this.loading.set(false); this.err(e); } });
  }
  activarRuta(r: Ruta) {
    this.rutaSel.set(r);
    this.post('/activar-ruta', { id_ruta: r.id, cedula: this.cedula }).subscribe({ next: () => this.loadPdvs(), error: e => this.err(e) });
  }
  noActivar(r: Ruta) {
    const razon = prompt('Motivo por el que NO activas esta ruta hoy:');
    if (!razon?.trim()) return;
    this.post('/no-activar-ruta', { id_ruta: r.id, cedula: this.cedula, razon: razon.trim() }).subscribe({ next: () => this.snack.open('Registrado', 'OK', { duration: 2500 }), error: e => this.err(e) });
  }
  loadPdvs() {
    this.step.set(2); this.clienteSel.set(null); this.catSel.set(null); this.loading.set(true);
    this.get<Pdv[]>(`/ruta-puntos/${this.rutaSel()!.id}?cedula=${this.cedula}`).subscribe({ next: p => { this.pdvs.set(p); this.loading.set(false); }, error: e => { this.loading.set(false); this.err(e); } });
  }
  abrirClientes(p: Pdv) {
    this.pdvSel.set(p); this.step.set(3); this.clienteSel.set(null); this.catSel.set(null); this.loading.set(true);
    this.get<Cli[]>(`/pdv-clientes/${p.id}/${this.rutaSel()!.id}`).subscribe({ next: c => { this.clientes.set(c); this.loading.set(false); }, error: e => { this.loading.set(false); this.err(e); } });
  }
  iniciarCliente(c: Cli) {
    this.post<any>('/iniciar-auditoria-cliente', { cliente_id: c.id, point_id: this.pdvSel()!.id, cedula: this.cedula }).subscribe({
      next: r => { this.clienteSel.set(c); this.idVisita.set(r.id_visita); this.catsHechas.set([]); this.loadCategorias(); }, error: e => this.err(e) });
  }
  loadCategorias() {
    this.catSel.set(null); this.loading.set(true);
    this.get<Cat[]>(`/cliente-categorias/${this.clienteSel()!.id}`).subscribe({ next: c => { this.categorias.set(c); this.loading.set(false); }, error: e => { this.loading.set(false); this.err(e); } });
  }
  abrirCategoria(cat: Cat) {
    this.catSel.set(cat); this.step.set(4); this.form = {}; this.exhibSel.clear(); this.fotos.set(0);
  }
  toggleExhib(t: string) { this.exhibSel.has(t) ? this.exhibSel.delete(t) : this.exhibSel.add(t); }
  guardarCategoria() {
    this.saving.set(true);
    const payload = { ...this.form, id_visita: this.idVisita(), id_categoria: this.catSel()!.id,
      exhibicion_tipos: [...this.exhibSel].join(', ') || null };
    this.post('/guardar-auditoria-categoria', payload).subscribe({
      next: () => { this.saving.set(false); this.snack.open('Categoría guardada', 'OK', { duration: 2500 });
        this.catsHechas.update(a => [...a, this.catSel()!.id]); this.step.set(3); this.catSel.set(null); },
      error: e => { this.saving.set(false); this.err(e); } });
  }
  finalizarCliente() {
    if (!confirm('¿Terminar la auditoría de este cliente?')) return;
    this.post('/finalizar-auditoria-cliente', { id_visita: this.idVisita() }).subscribe({ next: () => { this.snack.open('Cliente finalizado', 'OK', { duration: 2500 }); this.abrirClientes(this.pdvSel()!); }, error: e => this.err(e) });
  }
  activarPdv(p: Pdv) { this.pdvSel.set(p); this.cam('pdv-on'); }
  desactivarRuta() {
    if (!confirm('¿Terminar la jornada de esta ruta?')) return;
    this.post('/desactivar-ruta', { id_ruta: this.rutaSel()!.id, cedula: this.cedula }).subscribe({ next: () => { this.snack.open('Jornada terminada', 'OK', { duration: 2500 }); this.loadRutas(); }, error: e => this.err(e) });
  }

  // ── Cámara ──
  private camEl?: HTMLInputElement;
  cam(mode: 'pdv-on' | 'pdv-off' | 'cat') {
    this.camMode = mode;
    this.camEl ??= document.querySelector('input[type=file]') as HTMLInputElement;
    this.camEl?.click();
  }
  onCam(ev: Event) {
    const file = (ev.target as HTMLInputElement).files?.[0];
    (ev.target as HTMLInputElement).value = '';
    if (!file) return;
    const send = (lat?: number, lon?: number) => {
      this.uploadMsg.set('Subiendo foto…'); this.uploading.set(true);
      const fd = new FormData();
      fd.append('file', file); fd.append('cedula', this.cedula);
      if (lat != null) fd.append('lat', String(lat));
      if (lon != null) fd.append('lon', String(lon));
      let url = '';
      if (this.camMode === 'cat') {
        url = '/subir-foto-categoria';
        fd.append('id_visita', String(this.idVisita())); fd.append('id_categoria', String(this.catSel()!.id));
        fd.append('categoria_nombre', this.catSel()!.nombre); fd.append('point_id', this.pdvSel()?.id || '');
      } else {
        url = this.camMode === 'pdv-on' ? '/activar-pdv' : '/desactivar-pdv';
        fd.append('point_id', this.pdvSel()!.id);
      }
      this.http.post<any>(`${this.API}${url}`, fd).subscribe({
        next: () => { this.uploading.set(false);
          if (this.camMode === 'cat') this.fotos.update(n => n + 1);
          else if (this.camMode === 'pdv-on') this.abrirClientes(this.pdvSel()!);
          else { this.snack.open('PDV desactivado', 'OK', { duration: 2500 }); this.loadPdvs(); } },
        error: e => { this.uploading.set(false); this.err(e); } });
    };
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => send(p.coords.latitude, p.coords.longitude), () => send(), { enableHighAccuracy: true, timeout: 8000 });
    else send();
  }
}
