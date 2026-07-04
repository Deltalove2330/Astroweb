import {
  MatInputModule
} from "./chunk-GXZEZIYO.js";
import {
  MatTableModule
} from "./chunk-3L7HTECJ.js";
import {
  MatSelectModule
} from "./chunk-DD2LOOAS.js";
import {
  MatFormFieldModule
} from "./chunk-YUDUWHLJ.js";
import {
  MatTooltipModule
} from "./chunk-PBKBS7OR.js";
import "./chunk-CELNEZAJ.js";
import "./chunk-ABO6AUNU.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-I7XEM5TB.js";
import "./chunk-WHO5S5ML.js";
import {
  MatProgressSpinner,
  MatProgressSpinnerModule
} from "./chunk-EGRIEE5E.js";
import {
  ApiService
} from "./chunk-G4LBJVY7.js";
import {
  MatButtonModule,
  MatIcon,
  MatIconModule
} from "./chunk-KQNRR4FF.js";
import "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  CommonModule,
  DatePipe,
  DecimalPipe,
  __spreadProps,
  __spreadValues,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QB3BCYT5.js";

// src/app/features/admin/audit-log/audit-log.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function AuditLogComponent_For_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const et_r1 = ctx.$implicit;
    \u0275\u0275property("value", et_r1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(et_r1);
  }
}
function AuditLogComponent_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275element(1, "mat-spinner", 20);
    \u0275\u0275elementStart(2, "p", 21);
    \u0275\u0275text(3, "Cargando registros...");
    \u0275\u0275elementEnd()();
  }
}
function AuditLogComponent_Conditional_44_For_21_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 41);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("#", e_r3.entity_id, "");
  }
}
function AuditLogComponent_Conditional_44_For_21_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 47);
    \u0275\u0275listener("click", function AuditLogComponent_Conditional_44_For_21_Conditional_25_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const e_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.toggleExpand(e_r3.id));
    });
    \u0275\u0275elementStart(1, "mat-icon", 18);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const e_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r4.expandedId() === e_r3.id ? "expand_less" : "expand_more");
  }
}
function AuditLogComponent_Conditional_44_For_21_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 46)(1, "td", 48)(2, "p", 49);
    \u0275\u0275text(3, "Cambios registrados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "pre", 50);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const e_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r4.formatChanges(e_r3.changes));
  }
}
function AuditLogComponent_Conditional_44_For_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 33)(1, "td", 34);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td", 35)(5, "div", 36)(6, "span", 37);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 38);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "td", 35)(11, "span");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td", 39);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 35)(16, "span", 40);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275template(18, AuditLogComponent_Conditional_44_For_21_Conditional_18_Template, 2, 1, "span", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "td", 42);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "td", 35)(22, "span", 43);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "td", 44);
    \u0275\u0275template(25, AuditLogComponent_Conditional_44_For_21_Conditional_25_Template, 3, 1, "button", 45);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(26, AuditLogComponent_Conditional_44_For_21_Conditional_26_Template, 6, 1, "tr", 46);
  }
  if (rf & 2) {
    const e_r3 = ctx.$implicit;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(3, 15, e_r3.timestamp, "dd/MM/yy HH:mm:ss"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(e_r3.username || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r3.rol);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r4.actionClass(e_r3.action));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r3.action);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r3.entity_type || "\u2014");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(e_r3.entity_name || "\u2014");
    \u0275\u0275advance();
    \u0275\u0275conditional(18, e_r3.entity_id ? 18 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r3.ip_address || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275classMap(e_r3.status === "OK" ? "text-emerald-600" : "text-rose-600");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", e_r3.status || "\u2014", " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(25, e_r3.changes ? 25 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(26, ctx_r4.expandedId() === e_r3.id && e_r3.changes ? 26 : -1);
  }
}
function AuditLogComponent_Conditional_44_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 51)(2, "div", 52)(3, "mat-icon", 53);
    \u0275\u0275text(4, "search_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 54);
    \u0275\u0275text(6, "No se encontraron registros");
    \u0275\u0275elementEnd()()()();
  }
}
function AuditLogComponent_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "table", 23)(2, "thead")(3, "tr", 24)(4, "th", 25);
    \u0275\u0275text(5, "Fecha/Hora");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 26);
    \u0275\u0275text(7, "Usuario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 26);
    \u0275\u0275text(9, "Acci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 26);
    \u0275\u0275text(11, "Tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 26);
    \u0275\u0275text(13, "Entidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 26);
    \u0275\u0275text(15, "IP");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 26);
    \u0275\u0275text(17, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275element(18, "th", 27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "tbody");
    \u0275\u0275repeaterCreate(20, AuditLogComponent_Conditional_44_For_21_Template, 27, 18, null, null, _forTrack0);
    \u0275\u0275template(22, AuditLogComponent_Conditional_44_Conditional_22_Template, 7, 0, "tr");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "div", 28)(24, "p", 29);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 30)(27, "button", 31);
    \u0275\u0275listener("click", function AuditLogComponent_Conditional_44_Template_button_click_27_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.prevPage());
    });
    \u0275\u0275elementStart(28, "mat-icon", 18);
    \u0275\u0275text(29, "chevron_left");
    \u0275\u0275elementEnd();
    \u0275\u0275text(30, " Anterior ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "span", 32);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "button", 31);
    \u0275\u0275listener("click", function AuditLogComponent_Conditional_44_Template_button_click_33_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.nextPage());
    });
    \u0275\u0275text(34, " Siguiente ");
    \u0275\u0275elementStart(35, "mat-icon", 18);
    \u0275\u0275text(36, "chevron_right");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(20);
    \u0275\u0275repeater(ctx_r4.entries());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(22, ctx_r4.entries().length === 0 ? 22 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate3(" Mostrando ", ctx_r4.offset + 1, "\u2013", ctx_r4.showingEnd, " de ", ctx_r4.total(), " registros ");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r4.offset === 0);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", ctx_r4.currentPage, " / ", ctx_r4.totalPages, "");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r4.offset + ctx_r4.limit >= ctx_r4.total());
  }
}
var AuditLogComponent = class _AuditLogComponent {
  constructor(api) {
    this.api = api;
    this.loading = signal(false);
    this.entries = signal([]);
    this.total = signal(0);
    this.expandedId = signal(null);
    this.columns = ["timestamp", "username", "action", "entity_type", "entity_name", "ip_address", "status", "expand"];
    this.entityTypes = [];
    this.filters = { username: "", action: "", entity_type: "", from_date: "", to_date: "" };
    this.limit = 100;
    this.offset = 0;
    this.ACTION_COLORS = {
      LOGIN: "bg-emerald-50 text-emerald-700",
      LOGOUT: "bg-slate-100 text-slate-600",
      LOGIN_FAILED: "bg-rose-50 text-rose-600",
      CHANGE_PASSWORD: "bg-amber-50 text-amber-700",
      CREATE_USER: "bg-blue-50 text-blue-700",
      DELETE_USER: "bg-rose-50 text-rose-700",
      UPDATE_USER: "bg-indigo-50 text-indigo-700",
      UPDATE_PERMISSIONS: "bg-purple-50 text-purple-700",
      CREATE_POINT: "bg-teal-50 text-teal-700",
      UPDATE_POINT: "bg-cyan-50 text-cyan-700",
      DELETE_POINT: "bg-rose-50 text-rose-700",
      CREATE_PRODUCT: "bg-lime-50 text-lime-700",
      UPDATE_PRODUCT: "bg-yellow-50 text-yellow-700",
      DELETE_PRODUCT: "bg-rose-50 text-rose-700",
      APPROVE_PHOTOS: "bg-emerald-50 text-emerald-700",
      REJECT_PHOTO: "bg-orange-50 text-orange-700",
      REPLACE_PHOTO: "bg-sky-50 text-sky-700",
      KILL_SESSION: "bg-rose-50 text-rose-700",
      KILL_ALL_SESSIONS: "bg-rose-100 text-rose-800"
    };
  }
  ngOnInit() {
    this.api.getAuditEntityTypes().subscribe({ next: (t) => this.entityTypes = t });
    this.load();
  }
  load() {
    this.loading.set(true);
    const cleanFilters = {};
    for (const [k, v] of Object.entries(this.filters)) {
      if (v && String(v).trim() !== "")
        cleanFilters[k] = v;
    }
    this.api.getAuditLogs(__spreadProps(__spreadValues({}, cleanFilters), { limit: this.limit, offset: this.offset })).subscribe({
      next: (res) => {
        this.entries.set(res.items);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  applyFilters() {
    this.offset = 0;
    this.load();
  }
  clearFilters() {
    this.filters = { username: "", action: "", entity_type: "", from_date: "", to_date: "" };
    this.offset = 0;
    this.load();
  }
  prevPage() {
    this.offset = Math.max(0, this.offset - this.limit);
    this.load();
  }
  nextPage() {
    this.offset += this.limit;
    this.load();
  }
  get currentPage() {
    return Math.floor(this.offset / this.limit) + 1;
  }
  get totalPages() {
    return Math.ceil(this.total() / this.limit);
  }
  get showingEnd() {
    return Math.min(this.offset + this.limit, this.total());
  }
  toggleExpand(id) {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }
  actionClass(action) {
    return (this.ACTION_COLORS[action] ?? "bg-slate-100 text-slate-600") + " px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider";
  }
  formatChanges(raw) {
    if (!raw)
      return "\u2014";
    try {
      return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      return raw;
    }
  }
  static {
    this.\u0275fac = function AuditLogComponent_Factory(t) {
      return new (t || _AuditLogComponent)(\u0275\u0275directiveInject(ApiService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AuditLogComponent, selectors: [["app-audit-log"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 45, vars: 9, consts: [[1, "space-y-6", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4"], [1, "text-3xl", "font-bold", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "px-4", "py-2", "bg-slate-50", "dark:bg-slate-900", "rounded-2xl", "border", "border-slate-200", "dark:border-white/5", "text-slate-600", "dark:text-slate-300", "font-bold", "text-sm"], [1, "bg-white", "dark:bg-slate-900", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "p-6", "shadow-sm"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-5", "gap-4"], [1, "flex", "flex-col", "gap-1"], [1, "text-xs", "font-semibold", "text-slate-500", "uppercase", "tracking-wider"], ["placeholder", "Buscar usuario...", 1, "h-10", "px-3", "rounded-xl", "border", "border-slate-200", "dark:border-white/10", "bg-slate-50", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-200", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-primary-400", 3, "ngModelChange", "keyup.enter", "ngModel"], ["placeholder", "ej. LOGIN, CREATE...", 1, "h-10", "px-3", "rounded-xl", "border", "border-slate-200", "dark:border-white/10", "bg-slate-50", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-200", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-primary-400", 3, "ngModelChange", "keyup.enter", "ngModel"], [1, "h-10", "px-3", "rounded-xl", "border", "border-slate-200", "dark:border-white/10", "bg-slate-50", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-200", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-primary-400", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], ["type", "datetime-local", 1, "h-10", "px-3", "rounded-xl", "border", "border-slate-200", "dark:border-white/10", "bg-slate-50", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-200", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-primary-400", 3, "ngModelChange", "ngModel"], [1, "flex", "items-center", "justify-end", "gap-3", "mt-4"], [1, "px-4", "py-2", "text-sm", "text-slate-500", "hover:text-slate-700", "dark:hover:text-slate-200", "font-medium", "transition-colors", 3, "click"], [1, "flex", "items-center", "gap-2", "px-5", "py-2", "bg-primary-500", "hover:bg-primary-600", "text-white", "rounded-xl", "text-sm", "font-semibold", "transition-all", 3, "click"], [1, "!text-base"], [1, "flex", "items-center", "justify-center", "py-16", "gap-4"], ["diameter", "40", "strokeWidth", "3"], [1, "text-slate-400", "font-medium"], [1, "bg-white", "dark:bg-slate-900", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "overflow-hidden", "overflow-x-auto"], [1, "w-full", "text-left", "border-collapse"], [1, "bg-slate-50", "dark:bg-slate-950/50", "border-b", "border-slate-100", "dark:border-white/5"], [1, "px-4", "py-3", "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest", "min-w-[140px]"], [1, "px-4", "py-3", "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest"], [1, "px-4", "py-3", "w-10"], [1, "flex", "items-center", "justify-between", "px-2"], [1, "text-sm", "text-slate-500"], [1, "flex", "items-center", "gap-2"], [1, "flex", "items-center", "gap-1", "px-4", "py-2", "rounded-xl", "border", "border-slate-200", "dark:border-white/10", "text-sm", "font-medium", "text-slate-600", "dark:text-slate-300", "disabled:opacity-40", "hover:bg-slate-50", "dark:hover:bg-slate-800", "transition-colors", 3, "click", "disabled"], [1, "text-sm", "text-slate-500", "font-medium", "px-2"], [1, "border-b", "border-slate-100", "dark:border-white/5", "hover:bg-slate-50", "dark:hover:bg-slate-800/30", "transition-colors"], [1, "px-4", "py-3", "text-xs", "font-mono", "text-slate-500", "whitespace-nowrap"], [1, "px-4", "py-3"], [1, "flex", "flex-col"], [1, "font-semibold", "text-slate-700", "dark:text-slate-200", "text-sm"], [1, "text-xs", "text-slate-400"], [1, "px-4", "py-3", "text-sm", "text-slate-500"], [1, "text-sm", "font-medium", "text-slate-700", "dark:text-slate-300"], [1, "ml-1", "text-xs", "text-slate-400", "font-mono"], [1, "px-4", "py-3", "font-mono", "text-xs", "text-slate-400"], [1, "text-xs", "font-bold"], [1, "px-2", "py-3", "text-right"], [1, "w-8", "h-8", "rounded-lg", "bg-slate-100", "dark:bg-white/5", "hover:bg-primary-500", "hover:text-white", "text-slate-500", "inline-flex", "items-center", "justify-center", "transition-all"], [1, "bg-slate-50", "dark:bg-slate-800/50"], [1, "w-8", "h-8", "rounded-lg", "bg-slate-100", "dark:bg-white/5", "hover:bg-primary-500", "hover:text-white", "text-slate-500", "inline-flex", "items-center", "justify-center", "transition-all", 3, "click"], ["colspan", "8", 1, "px-6", "py-4", "border-b", "border-slate-100", "dark:border-white/5"], [1, "text-xs", "font-semibold", "text-slate-400", "uppercase", "tracking-wider", "mb-2"], [1, "text-xs", "font-mono", "text-slate-600", "dark:text-slate-300", "whitespace-pre-wrap", "break-all"], ["colspan", "8", 1, "py-16", "text-center"], [1, "flex", "flex-col", "items-center", "gap-2", "opacity-40"], [1, "!text-4xl"], [1, "font-bold", "text-sm"]], template: function AuditLogComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
        \u0275\u0275text(4, "Auditor\xEDa del Sistema");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p", 3);
        \u0275\u0275text(6, "Registro completo de todas las acciones realizadas en la plataforma.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div", 4);
        \u0275\u0275text(8);
        \u0275\u0275pipe(9, "number");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "div", 5)(11, "div", 6)(12, "div", 7)(13, "label", 8);
        \u0275\u0275text(14, "Usuario");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "input", 9);
        \u0275\u0275twoWayListener("ngModelChange", function AuditLogComponent_Template_input_ngModelChange_15_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filters.username, $event) || (ctx.filters.username = $event);
          return $event;
        });
        \u0275\u0275listener("keyup.enter", function AuditLogComponent_Template_input_keyup_enter_15_listener() {
          return ctx.applyFilters();
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(16, "div", 7)(17, "label", 8);
        \u0275\u0275text(18, "Acci\xF3n");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "input", 10);
        \u0275\u0275twoWayListener("ngModelChange", function AuditLogComponent_Template_input_ngModelChange_19_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filters.action, $event) || (ctx.filters.action = $event);
          return $event;
        });
        \u0275\u0275listener("keyup.enter", function AuditLogComponent_Template_input_keyup_enter_19_listener() {
          return ctx.applyFilters();
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(20, "div", 7)(21, "label", 8);
        \u0275\u0275text(22, "Tipo de entidad");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "select", 11);
        \u0275\u0275twoWayListener("ngModelChange", function AuditLogComponent_Template_select_ngModelChange_23_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filters.entity_type, $event) || (ctx.filters.entity_type = $event);
          return $event;
        });
        \u0275\u0275elementStart(24, "option", 12);
        \u0275\u0275text(25, "Todos");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(26, AuditLogComponent_For_27_Template, 2, 2, "option", 13, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(28, "div", 7)(29, "label", 8);
        \u0275\u0275text(30, "Desde");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(31, "input", 14);
        \u0275\u0275twoWayListener("ngModelChange", function AuditLogComponent_Template_input_ngModelChange_31_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filters.from_date, $event) || (ctx.filters.from_date = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(32, "div", 7)(33, "label", 8);
        \u0275\u0275text(34, "Hasta");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(35, "input", 14);
        \u0275\u0275twoWayListener("ngModelChange", function AuditLogComponent_Template_input_ngModelChange_35_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filters.to_date, $event) || (ctx.filters.to_date = $event);
          return $event;
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(36, "div", 15)(37, "button", 16);
        \u0275\u0275listener("click", function AuditLogComponent_Template_button_click_37_listener() {
          return ctx.clearFilters();
        });
        \u0275\u0275text(38, " Limpiar ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(39, "button", 17);
        \u0275\u0275listener("click", function AuditLogComponent_Template_button_click_39_listener() {
          return ctx.applyFilters();
        });
        \u0275\u0275elementStart(40, "mat-icon", 18);
        \u0275\u0275text(41, "search");
        \u0275\u0275elementEnd();
        \u0275\u0275text(42, " Filtrar ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(43, AuditLogComponent_Conditional_43_Template, 4, 0, "div", 19)(44, AuditLogComponent_Conditional_44_Template, 37, 8);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(9, 7, ctx.total()), " registros ");
        \u0275\u0275advance(7);
        \u0275\u0275twoWayProperty("ngModel", ctx.filters.username);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.filters.action);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.filters.entity_type);
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.entityTypes);
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.filters.from_date);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.filters.to_date);
        \u0275\u0275advance(8);
        \u0275\u0275conditional(43, ctx.loading() ? 43 : 44);
      }
    }, dependencies: [
      CommonModule,
      DecimalPipe,
      DatePipe,
      FormsModule,
      NgSelectOption,
      \u0275NgSelectMultipleOption,
      DefaultValueAccessor,
      SelectControlValueAccessor,
      NgControlStatus,
      NgModel,
      MatTableModule,
      MatButtonModule,
      MatIconModule,
      MatIcon,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatProgressSpinnerModule,
      MatProgressSpinner,
      MatTooltipModule
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AuditLogComponent, { className: "AuditLogComponent", filePath: "src\\app\\features\\admin\\audit-log\\audit-log.component.ts", lineNumber: 39 });
})();
export {
  AuditLogComponent
};
//# sourceMappingURL=chunk-QEG6PGI7.js.map
