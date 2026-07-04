import {
  MatInputModule
} from "./chunk-GXZEZIYO.js";
import {
  MatListModule
} from "./chunk-EBSQWFJT.js";
import "./chunk-APQQCC2U.js";
import {
  MatSnackBar,
  MatSnackBarModule
} from "./chunk-7QJW63DM.js";
import {
  AuthService
} from "./chunk-FAJEMXMR.js";
import {
  MatFormFieldModule
} from "./chunk-YUDUWHLJ.js";
import {
  MatCardModule
} from "./chunk-HA7AXTKJ.js";
import {
  MatTooltip,
  MatTooltipModule
} from "./chunk-PBKBS7OR.js";
import "./chunk-CELNEZAJ.js";
import "./chunk-ABO6AUNU.js";
import {
  FormsModule
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
import "./chunk-QGVFX6Y7.js";
import "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  CommonModule,
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
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-QB3BCYT5.js";

// src/app/features/auditor/auditor.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function AuditorComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "div", 10)(2, "div", 11)(3, "mat-icon", 12);
    \u0275\u0275text(4, "fact_check");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div")(6, "p", 13);
    \u0275\u0275text(7, "Visitas Hoy");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "h2", 14);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 10)(11, "div", 15)(12, "mat-icon", 12);
    \u0275\u0275text(13, "offline_bolt");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div")(15, "p", 13);
    \u0275\u0275text(16, "Activaciones Hoy");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "h2", 14);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate((tmp_1_0 = ctx_r0.stats()) == null ? null : tmp_1_0.visitas_hoy);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate((tmp_2_0 = ctx_r0.stats()) == null ? null : tmp_2_0.activaciones_hoy);
  }
}
function AuditorComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275element(1, "mat-spinner", 16);
    \u0275\u0275elementStart(2, "p", 17);
    \u0275\u0275text(3, "Cargando itinerarios...");
    \u0275\u0275elementEnd()();
  }
}
function AuditorComponent_Conditional_15_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19)(1, "div", 21)(2, "div", 22)(3, "mat-icon");
    \u0275\u0275text(4, "map");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 23)(6, "span", 24);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 25);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "button", 26);
    \u0275\u0275listener("click", function AuditorComponent_Conditional_15_For_2_Template_button_click_10_listener() {
      const ruta_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.activateRoute(ruta_r3.id));
    });
    \u0275\u0275elementStart(11, "mat-icon");
    \u0275\u0275text(12, "play_arrow");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ruta_r3 = ctx.$implicit;
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ruta_r3.nombre);
    \u0275\u0275advance();
    \u0275\u0275classMap(ruta_r3.activa ? "text-emerald-500" : "text-slate-400 dark:text-slate-500");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ruta_r3.activa ? "Activa" : "Inactiva", " ");
  }
}
function AuditorComponent_Conditional_15_ForEmpty_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "mat-icon", 27);
    \u0275\u0275text(2, "location_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 28);
    \u0275\u0275text(4, "No se han encontrado rutas asignadas a su perfil.");
    \u0275\u0275elementEnd()();
  }
}
function AuditorComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275repeaterCreate(1, AuditorComponent_Conditional_15_For_2_Template, 13, 4, "div", 19, _forTrack0, false, AuditorComponent_Conditional_15_ForEmpty_3_Template, 5, 0, "div", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.rutas());
  }
}
var AuditorComponent = class _AuditorComponent {
  constructor(api, auth, snack) {
    this.api = api;
    this.auth = auth;
    this.snack = snack;
    this.stats = signal(null);
    this.rutas = signal([]);
    this.loadingRoutes = signal(true);
  }
  ngOnInit() {
    const user = this.auth.currentUser();
    if (user) {
      this.api.getActiveSessions().subscribe();
    }
    this.loadingRoutes.set(false);
  }
  activateRoute(rutaId) {
    this.snack.open("Ruta activada para auditor\xEDa", "OK", { duration: 2e3 });
  }
  static {
    this.\u0275fac = function AuditorComponent_Factory(t) {
      return new (t || _AuditorComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AuditorComponent, selectors: [["app-auditor"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 16, vars: 2, consts: [[1, "space-y-8", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-6"], [1, "text-3xl", "font-bold", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "gap-6"], [1, "bg-white", "dark:bg-slate-900", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "overflow-hidden"], [1, "px-8", "py-6", "border-b", "border-slate-100", "dark:border-white/5", "flex", "items-center", "justify-between"], [1, "text-xl", "font-bold", "text-slate-800", "dark:text-white"], [1, "text-slate-300", "dark:text-slate-600"], [1, "flex", "flex-col", "items-center", "py-20", "gap-3"], [1, "bg-white", "dark:bg-slate-900", "p-8", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "flex", "items-center", "gap-6"], [1, "w-16", "h-16", "bg-primary-50", "dark:bg-primary-900/20", "text-primary-500", "dark:text-primary-400", "rounded-2xl", "flex", "items-center", "justify-center"], [1, "!text-3xl"], [1, "text-xs", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "mb-1"], [1, "text-3xl", "font-black", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "w-16", "h-16", "bg-emerald-50", "dark:bg-emerald-900/20", "text-emerald-500", "dark:text-emerald-400", "rounded-2xl", "flex", "items-center", "justify-center"], ["diameter", "40"], [1, "text-slate-400", "font-medium", "italic"], [1, "p-4", "space-y-3"], [1, "group", "flex", "items-center", "justify-between", "p-4", "rounded-2xl", "border", "border-slate-100", "dark:border-white/5", "hover:border-primary-200", "dark:hover:border-primary-900", "hover:bg-primary-50/30", "dark:hover:bg-primary-900/10", "transition-all", "duration-300"], [1, "py-16", "text-center", "space-y-3"], [1, "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "bg-slate-50", "dark:bg-slate-800", "text-slate-400", "dark:text-slate-500", "group-hover:bg-primary-500", "group-hover:text-white", "rounded-xl", "flex", "items-center", "justify-center", "transition-colors", "shadow-sm"], [1, "flex", "flex-col"], [1, "font-bold", "text-slate-800", "dark:text-white", "group-hover:text-primary-700", "dark:group-hover:text-primary-400", "transition-colors"], [1, "text-[10px]", "font-black", "uppercase", "tracking-wider"], ["matTooltip", "Iniciar Auditor\xEDa", 1, "w-10", "h-10", "flex", "items-center", "justify-center", "rounded-xl", "bg-slate-100", "dark:bg-slate-800", "text-slate-500", "dark:text-slate-400", "hover:bg-emerald-500", "hover:text-white", "transition-all", "shadow-sm", "dark:shadow-none", 3, "click"], [1, "!text-5xl", "text-slate-100", "dark:text-slate-800"], [1, "text-slate-400", "dark:text-slate-500", "font-medium", "italic"]], template: function AuditorComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
        \u0275\u0275text(4, "Panel Auditor");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p", 3);
        \u0275\u0275text(6, "Control de calidad y auditor\xEDa de rutas en tiempo real.");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(7, AuditorComponent_Conditional_7_Template, 19, 2, "div", 4);
        \u0275\u0275elementStart(8, "div", 5)(9, "div", 6)(10, "h3", 7);
        \u0275\u0275text(11, "Mis Rutas de Auditor\xEDa");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "mat-icon", 8);
        \u0275\u0275text(13, "route");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(14, AuditorComponent_Conditional_14_Template, 4, 0, "div", 9)(15, AuditorComponent_Conditional_15_Template, 4, 1);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(7);
        \u0275\u0275conditional(7, ctx.stats() ? 7 : -1);
        \u0275\u0275advance(7);
        \u0275\u0275conditional(14, ctx.loadingRoutes() ? 14 : 15);
      }
    }, dependencies: [
      CommonModule,
      FormsModule,
      MatCardModule,
      MatButtonModule,
      MatIconModule,
      MatIcon,
      MatFormFieldModule,
      MatInputModule,
      MatProgressSpinnerModule,
      MatProgressSpinner,
      MatListModule,
      MatSnackBarModule,
      MatTooltipModule,
      MatTooltip
    ], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n/*# sourceMappingURL=auditor.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AuditorComponent, { className: "AuditorComponent", filePath: "src\\app\\features\\auditor\\auditor.component.ts", lineNumber: 27 });
})();
export {
  AuditorComponent
};
//# sourceMappingURL=chunk-V4BAK3PE.js.map
