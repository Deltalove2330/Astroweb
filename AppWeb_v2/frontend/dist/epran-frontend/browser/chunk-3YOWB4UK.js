import {
  HasPermDirective
} from "./chunk-RNOX4RCL.js";
import {
  MatSnackBar,
  MatSnackBarModule
} from "./chunk-7QJW63DM.js";
import "./chunk-FAJEMXMR.js";
import "./chunk-CELNEZAJ.js";
import "./chunk-ABO6AUNU.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-I7XEM5TB.js";
import "./chunk-WHO5S5ML.js";
import {
  MatProgressSpinner,
  MatProgressSpinnerModule
} from "./chunk-EGRIEE5E.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-KQNRR4FF.js";
import "./chunk-QGVFX6Y7.js";
import {
  environment
} from "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  CommonModule,
  HttpClient,
  NgClass,
  __spreadProps,
  __spreadValues,
  computed,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QB3BCYT5.js";

// src/app/features/clientes-rutas/clientes-rutas.component.ts
var _forTrack0 = ($index, $item) => $item.id_usuario;
var _forTrack1 = ($index, $item) => $item.id_ruta;
function ClientesRutasComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275element(1, "mat-spinner", 18);
    \u0275\u0275elementEnd();
  }
}
function ClientesRutasComponent_For_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 19);
    \u0275\u0275listener("click", function ClientesRutasComponent_For_21_Template_button_click_0_listener() {
      const u_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.seleccionar(u_r2));
    });
    \u0275\u0275elementStart(1, "div", 20)(2, "mat-icon", 21);
    \u0275\u0275text(3, "person");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 22)(5, "p", 23);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 24);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 25);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_10_0;
    const u_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("bg-violet-950", ((tmp_10_0 = ctx_r2.sel()) == null ? null : tmp_10_0.id_usuario) === u_r2.id_usuario);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(u_r2.cliente || u_r2.username);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r2.username);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", u_r2.n_rutas ? "bg-emerald-950 text-emerald-400" : "bg-slate-800 text-slate-500");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(u_r2.n_rutas);
  }
}
function ClientesRutasComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275text(1, "Sin usuarios cliente.");
    \u0275\u0275elementEnd();
  }
}
function ClientesRutasComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "mat-icon", 26);
    \u0275\u0275text(2, "alt_route");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 27);
    \u0275\u0275text(4, "Selecciona un usuario cliente para ver y asignar sus rutas");
    \u0275\u0275elementEnd()();
  }
}
function ClientesRutasComponent_Conditional_25_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275element(1, "mat-spinner", 33);
    \u0275\u0275elementEnd();
  }
}
function ClientesRutasComponent_Conditional_25_Conditional_9_For_1_Conditional_9_button_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 43);
    \u0275\u0275listener("click", function ClientesRutasComponent_Conditional_25_Conditional_9_For_1_Conditional_9_button_0_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const r_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.quitar(r_r5));
    });
    \u0275\u0275elementStart(1, "mat-icon", 44);
    \u0275\u0275text(2, "link_off");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Quitar ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275property("disabled", ctx_r2.busy());
  }
}
function ClientesRutasComponent_Conditional_25_Conditional_9_For_1_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ClientesRutasComponent_Conditional_25_Conditional_9_For_1_Conditional_9_button_0_Template, 4, 1, "button", 42);
  }
  if (rf & 2) {
    \u0275\u0275property("hasPerm", "clientes-rutas")("hasPermAction", "delete");
  }
}
function ClientesRutasComponent_Conditional_25_Conditional_9_For_1_Conditional_10_button_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 46);
    \u0275\u0275listener("click", function ClientesRutasComponent_Conditional_25_Conditional_9_For_1_Conditional_10_button_0_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const r_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.asignar(r_r5));
    });
    \u0275\u0275elementStart(1, "mat-icon", 44);
    \u0275\u0275text(2, "add_link");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Asignar ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275property("disabled", ctx_r2.busy());
  }
}
function ClientesRutasComponent_Conditional_25_Conditional_9_For_1_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ClientesRutasComponent_Conditional_25_Conditional_9_For_1_Conditional_10_button_0_Template, 4, 1, "button", 45);
  }
  if (rf & 2) {
    \u0275\u0275property("hasPerm", "clientes-rutas")("hasPermAction", "write");
  }
}
function ClientesRutasComponent_Conditional_25_Conditional_9_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34)(1, "div", 36)(2, "mat-icon", 37);
    \u0275\u0275text(3, "route");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 38)(5, "p", 39);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 40);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(9, ClientesRutasComponent_Conditional_25_Conditional_9_For_1_Conditional_9_Template, 1, 2, "button", 41)(10, ClientesRutasComponent_Conditional_25_Conditional_9_For_1_Conditional_10_Template, 1, 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r5 = ctx.$implicit;
    \u0275\u0275property("ngClass", r_r5.asignada ? "border-emerald-800/60" : "border-white/8");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", r_r5.asignada ? "bg-emerald-900" : "bg-slate-800");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", r_r5.asignada ? "text-emerald-400" : "text-slate-400");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(r_r5.ruta);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", r_r5.pdvs, " PDVs de este cliente");
    \u0275\u0275advance();
    \u0275\u0275conditional(9, r_r5.asignada ? 9 : 10);
  }
}
function ClientesRutasComponent_Conditional_25_Conditional_9_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35)(1, "mat-icon", 47);
    \u0275\u0275text(2, "wrong_location");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Este cliente no aparece en ninguna ruta programada. ");
    \u0275\u0275elementEnd();
  }
}
function ClientesRutasComponent_Conditional_25_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, ClientesRutasComponent_Conditional_25_Conditional_9_For_1_Template, 11, 6, "div", 34, _forTrack1);
    \u0275\u0275template(2, ClientesRutasComponent_Conditional_25_Conditional_9_Conditional_2_Template, 4, 0, "div", 35);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(ctx_r2.rutas());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(2, !ctx_r2.rutas().length ? 2 : -1);
  }
}
function ClientesRutasComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28)(1, "div")(2, "h2", 29);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 30);
    \u0275\u0275text(5, "Rutas donde aparece este cliente en la programaci\xF3n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "span", 31);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(8, ClientesRutasComponent_Conditional_25_Conditional_8_Template, 2, 0, "div", 32)(9, ClientesRutasComponent_Conditional_25_Conditional_9_Template, 3, 1);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(((tmp_1_0 = ctx_r2.sel()) == null ? null : tmp_1_0.cliente) || ((tmp_1_0 = ctx_r2.sel()) == null ? null : tmp_1_0.username));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", ctx_r2.asignadas(), " de ", ctx_r2.rutas().length, " asignadas");
    \u0275\u0275advance();
    \u0275\u0275conditional(8, ctx_r2.loadingRutas() ? 8 : 9);
  }
}
var ClientesRutasComponent = class _ClientesRutasComponent {
  constructor() {
    this.http = inject(HttpClient);
    this.snack = inject(MatSnackBar);
    this.API = `${environment.apiUrl}/api`;
    this.usuarios = signal([]);
    this.rutas = signal([]);
    this.sel = signal(null);
    this.loadingUsers = signal(false);
    this.loadingRutas = signal(false);
    this.busy = signal(false);
    this.filtro = "";
    this.usuariosFiltrados = computed(() => {
      const f = this.filtro.trim().toLowerCase();
      const list = this.usuarios();
      if (!f)
        return list;
      return list.filter((u) => (u.cliente || "").toLowerCase().includes(f) || u.username.toLowerCase().includes(f));
    });
    this.asignadas = computed(() => this.rutas().filter((r) => r.asignada).length);
  }
  ngOnInit() {
    this.loadUsuarios();
  }
  loadUsuarios() {
    this.loadingUsers.set(true);
    this.http.get(`${this.API}/clientes-rutas-usuarios`).subscribe({
      next: (u) => {
        this.usuarios.set(u);
        this.loadingUsers.set(false);
      },
      error: (e) => {
        this.loadingUsers.set(false);
        this.err(e);
      }
    });
  }
  seleccionar(u) {
    this.sel.set(u);
    this.loadRutas();
  }
  loadRutas() {
    const u = this.sel();
    if (!u)
      return;
    this.loadingRutas.set(true);
    this.http.get(`${this.API}/clientes-rutas-disponibles/${u.id_usuario}`).subscribe({
      next: (r) => {
        this.rutas.set(r.rutas);
        this.loadingRutas.set(false);
      },
      error: (e) => {
        this.loadingRutas.set(false);
        this.err(e);
      }
    });
  }
  asignar(r) {
    const u = this.sel();
    if (!u)
      return;
    this.busy.set(true);
    this.http.post(`${this.API}/clientes-rutas`, { id_usuario: u.id_usuario, id_ruta: r.id_ruta, activo: true }).subscribe({
      next: (res) => {
        this.busy.set(false);
        this.marcar(r.id_ruta, true, res.id_cliente_ruta);
        this.bumpUser(u, 1);
        this.snack.open("Ruta asignada", "OK", { duration: 2e3 });
      },
      error: (e) => {
        this.busy.set(false);
        this.err(e);
      }
    });
  }
  quitar(r) {
    const u = this.sel();
    if (!u || r.id_cliente_ruta == null)
      return;
    this.busy.set(true);
    this.http.delete(`${this.API}/clientes-rutas/${r.id_cliente_ruta}`).subscribe({
      next: () => {
        this.busy.set(false);
        this.marcar(r.id_ruta, false, null);
        this.bumpUser(u, -1);
        this.snack.open("Ruta quitada", "OK", { duration: 2e3 });
      },
      error: (e) => {
        this.busy.set(false);
        this.err(e);
      }
    });
  }
  marcar(idRuta, asignada, idCr) {
    this.rutas.update((list) => list.map((x) => x.id_ruta === idRuta ? __spreadProps(__spreadValues({}, x), { asignada, id_cliente_ruta: idCr }) : x));
  }
  bumpUser(u, delta) {
    this.usuarios.update((list) => list.map((x) => x.id_usuario === u.id_usuario ? __spreadProps(__spreadValues({}, x), { n_rutas: Math.max(0, x.n_rutas + delta) }) : x));
    this.sel.update((s) => s ? __spreadProps(__spreadValues({}, s), { n_rutas: Math.max(0, s.n_rutas + delta) }) : s);
  }
  err(e) {
    this.snack.open(e?.error?.detail || e?.error?.message || "Error", "OK", { duration: 4e3 });
  }
  static {
    this.\u0275fac = function ClientesRutasComponent_Factory(t) {
      return new (t || _ClientesRutasComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ClientesRutasComponent, selectors: [["app-clientes-rutas"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 26, vars: 4, consts: [[1, "min-h-screen", "bg-slate-950", "text-white"], [1, "bg-gradient-to-r", "from-slate-900", "to-slate-800", "border-b", "border-white/8", "px-8", "py-6"], [1, "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "rounded-2xl", "bg-gradient-to-br", "from-violet-600", "to-purple-700", "flex", "items-center", "justify-center", "shadow-lg", "shrink-0"], [1, "text-white"], [1, "text-2xl", "font-black", "tracking-tight", "leading-none"], [1, "text-slate-400", "text-sm", "mt-0.5"], [1, "px-8", "py-6", "grid", "grid-cols-1", "lg:grid-cols-[360px_1fr]", "gap-6", "max-w-6xl"], [1, "bg-slate-900", "border", "border-white/8", "rounded-2xl", "overflow-hidden", "self-start"], [1, "px-4", "py-3", "border-b", "border-white/8"], [1, "relative"], [1, "absolute", "left-2.5", "top-1/2", "-translate-y-1/2", "text-slate-500", "!text-base"], ["placeholder", "Buscar usuario cliente\u2026", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-violet-500", "rounded-xl", "pl-9", "pr-3", "py-2", "text-sm", "outline-none", 3, "ngModelChange", "ngModel"], [1, "max-h-[68vh]", "overflow-y-auto"], [1, "flex", "justify-center", "py-10"], [1, "w-full", "text-left", "px-4", "py-3", "border-b", "border-white/5", "hover:bg-slate-800", "transition-colors", "flex", "items-center", "gap-3", 3, "bg-violet-950"], [1, "text-center", "text-slate-600", "py-10", "text-sm"], [1, "flex", "flex-col", "items-center", "justify-center", "py-32", "text-slate-600", "gap-3"], ["diameter", "28"], [1, "w-full", "text-left", "px-4", "py-3", "border-b", "border-white/5", "hover:bg-slate-800", "transition-colors", "flex", "items-center", "gap-3", 3, "click"], [1, "w-9", "h-9", "rounded-xl", "bg-violet-900", "flex", "items-center", "justify-center", "shrink-0"], [1, "!text-base", "text-violet-400"], [1, "min-w-0", "flex-1"], [1, "font-bold", "text-sm", "truncate"], [1, "text-xs", "text-slate-500", "truncate"], [1, "text-xs", "px-2", "py-0.5", "rounded-full", "font-bold", "shrink-0", 3, "ngClass"], [1, "!text-5xl"], [1, "font-bold"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-lg", "font-black"], [1, "text-slate-400", "text-sm"], [1, "text-sm", "text-slate-400"], [1, "flex", "justify-center", "py-16"], ["diameter", "36"], [1, "bg-slate-900", "border", "rounded-2xl", "p-4", "mb-3", "flex", "items-center", "gap-3", "transition-colors", 3, "ngClass"], [1, "bg-slate-900", "border", "border-white/8", "rounded-2xl", "py-12", "text-center", "text-slate-500"], [1, "w-10", "h-10", "rounded-xl", "flex", "items-center", "justify-center", "shrink-0", 3, "ngClass"], [3, "ngClass"], [1, "flex-1", "min-w-0"], [1, "font-bold", "truncate"], [1, "text-xs", "text-slate-500"], [1, "px-4", "py-2", "bg-red-950", "hover:bg-red-900", "text-red-300", "rounded-xl", "text-sm", "font-bold", "flex", "items-center", "gap-1", 3, "disabled"], ["class", "px-4 py-2 bg-red-950 hover:bg-red-900 text-red-300 rounded-xl text-sm font-bold flex items-center gap-1", 3, "disabled", "click", 4, "hasPerm", "hasPermAction"], [1, "px-4", "py-2", "bg-red-950", "hover:bg-red-900", "text-red-300", "rounded-xl", "text-sm", "font-bold", "flex", "items-center", "gap-1", 3, "click", "disabled"], [1, "!text-base"], ["class", "px-4 py-2 bg-violet-700 hover:bg-violet-600 rounded-xl text-sm font-bold flex items-center gap-1", 3, "disabled", "click", 4, "hasPerm", "hasPermAction"], [1, "px-4", "py-2", "bg-violet-700", "hover:bg-violet-600", "rounded-xl", "text-sm", "font-bold", "flex", "items-center", "gap-1", 3, "click", "disabled"], [1, "!text-4xl", "block", "mx-auto", "mb-2", "text-slate-700"]], template: function ClientesRutasComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "mat-icon", 4);
        \u0275\u0275text(5, "alt_route");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(6, "div")(7, "h1", 5);
        \u0275\u0275text(8, "Clientes \xB7 Rutas");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "p", 6);
        \u0275\u0275text(10, "Asigna a cada usuario cliente las rutas que ver\xE1 (solo las de su programaci\xF3n)");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(11, "div", 7)(12, "div", 8)(13, "div", 9)(14, "div", 10)(15, "mat-icon", 11);
        \u0275\u0275text(16, "search");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(17, "input", 12);
        \u0275\u0275twoWayListener("ngModelChange", function ClientesRutasComponent_Template_input_ngModelChange_17_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filtro, $event) || (ctx.filtro = $event);
          return $event;
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(18, "div", 13);
        \u0275\u0275template(19, ClientesRutasComponent_Conditional_19_Template, 2, 0, "div", 14);
        \u0275\u0275repeaterCreate(20, ClientesRutasComponent_For_21_Template, 11, 6, "button", 15, _forTrack0);
        \u0275\u0275template(22, ClientesRutasComponent_Conditional_22_Template, 2, 0, "p", 16);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(23, "div");
        \u0275\u0275template(24, ClientesRutasComponent_Conditional_24_Template, 5, 0, "div", 17)(25, ClientesRutasComponent_Conditional_25_Template, 10, 4);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(17);
        \u0275\u0275twoWayProperty("ngModel", ctx.filtro);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(19, ctx.loadingUsers() ? 19 : -1);
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.usuariosFiltrados());
        \u0275\u0275advance(2);
        \u0275\u0275conditional(22, !ctx.loadingUsers() && !ctx.usuariosFiltrados().length ? 22 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(24, !ctx.sel() ? 24 : 25);
      }
    }, dependencies: [CommonModule, NgClass, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, MatIconModule, MatIcon, MatSnackBarModule, MatProgressSpinnerModule, MatProgressSpinner, HasPermDirective], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ClientesRutasComponent, { className: "ClientesRutasComponent", filePath: "src\\app\\features\\clientes-rutas\\clientes-rutas.component.ts", lineNumber: 112 });
})();
export {
  ClientesRutasComponent
};
//# sourceMappingURL=chunk-3YOWB4UK.js.map
