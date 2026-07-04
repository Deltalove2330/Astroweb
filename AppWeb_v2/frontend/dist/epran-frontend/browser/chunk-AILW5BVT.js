import {
  MatSnackBar,
  MatSnackBarModule
} from "./chunk-7QJW63DM.js";
import {
  MatCardModule
} from "./chunk-HA7AXTKJ.js";
import "./chunk-CELNEZAJ.js";
import "./chunk-ABO6AUNU.js";
import "./chunk-WHO5S5ML.js";
import {
  MatProgressSpinner,
  MatProgressSpinnerModule
} from "./chunk-EGRIEE5E.js";
import {
  ApiService
} from "./chunk-G4LBJVY7.js";
import {
  MatButton,
  MatButtonModule,
  MatIcon,
  MatIconModule
} from "./chunk-KQNRR4FF.js";
import "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  CommonModule,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
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
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-QB3BCYT5.js";

// src/app/features/supervisor/supervisor.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function SupervisorComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275element(1, "mat-spinner", 10);
    \u0275\u0275elementStart(2, "p", 11);
    \u0275\u0275text(3, "Escaneando base de datos...");
    \u0275\u0275elementEnd()();
  }
}
function SupervisorComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 13)(2, "mat-icon", 14);
    \u0275\u0275text(3, "verified");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "h3", 15);
    \u0275\u0275text(5, "Todo Aprobado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 16);
    \u0275\u0275text(7, "No hay discrepancias pendientes. El sistema est\xE1 operando bajo los est\xE1ndares de calidad.");
    \u0275\u0275elementEnd()();
  }
}
function SupervisorComponent_Conditional_18_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 20);
  }
  if (rf & 2) {
    const foto_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", foto_r2.url, \u0275\u0275sanitizeUrl);
  }
}
function SupervisorComponent_Conditional_18_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "mat-icon", 31);
    \u0275\u0275text(2, "image_not_supported");
    \u0275\u0275elementEnd()();
  }
}
function SupervisorComponent_Conditional_18_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18)(1, "div", 19);
    \u0275\u0275template(2, SupervisorComponent_Conditional_18_For_2_Conditional_2_Template, 1, 1, "img", 20)(3, SupervisorComponent_Conditional_18_For_2_Conditional_3_Template, 3, 0);
    \u0275\u0275elementStart(4, "div", 21);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 22)(7, "div", 23)(8, "div", 24)(9, "span", 25);
    \u0275\u0275text(10, "Observaci\xF3n T\xE9cnica");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 26);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 27);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "button", 28);
    \u0275\u0275listener("click", function SupervisorComponent_Conditional_18_For_2_Template_button_click_15_listener() {
      const foto_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.approvePhoto(foto_r2));
    });
    \u0275\u0275elementStart(16, "mat-icon", 29);
    \u0275\u0275text(17, "verified_user");
    \u0275\u0275elementEnd();
    \u0275\u0275text(18, " Aprobaci\xF3n Forzada ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const foto_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275conditional(2, foto_r2.url ? 2 : 3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" Visita #", foto_r2.visita_id, " ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("ID: ", foto_r2.id, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(' "', foto_r2.motivo_rechazo || "El supervisor debe definir el motivo del rechazo", '" ');
  }
}
function SupervisorComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275repeaterCreate(1, SupervisorComponent_Conditional_18_For_2_Template, 19, 4, "div", 18, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.photos());
  }
}
var SupervisorComponent = class _SupervisorComponent {
  constructor(api, snack) {
    this.api = api;
    this.snack = snack;
    this.loading = signal(true);
    this.photos = signal([]);
  }
  ngOnInit() {
    this.api.getRejectedPhotos().subscribe({
      next: (data) => {
        this.photos.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
  approvePhoto(foto) {
    this.api.approvePhotos([foto.id]).subscribe({
      next: () => {
        this.photos.update((ps) => ps.filter((p) => p.id !== foto.id));
        this.snack.open("Foto aprobada", "OK", { duration: 2e3 });
      },
      error: () => {
        this.snack.open("Error al procesar la aprobaci\xF3n", "OK", { duration: 3e3 });
      }
    });
  }
  static {
    this.\u0275fac = function SupervisorComponent_Factory(t) {
      return new (t || _SupervisorComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SupervisorComponent, selectors: [["app-supervisor"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 19, vars: 2, consts: [[1, "space-y-8", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-6"], [1, "text-3xl", "font-bold", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "flex", "items-center", "gap-3", "bg-white", "dark:bg-slate-900", "p-2", "rounded-2xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm"], [1, "w-10", "h-10", "bg-rose-100", "dark:bg-rose-900/20", "text-rose-600", "dark:text-rose-400", "rounded-xl", "flex", "items-center", "justify-center"], [1, "pr-4"], [1, "text-xs", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest"], [1, "text-lg", "font-black", "text-rose-600", "dark:text-rose-400", "leading-none"], [1, "flex", "flex-col", "items-center", "justify-center", "py-24", "gap-4"], ["diameter", "48", "strokeWidth", "4"], [1, "text-slate-400", "font-medium"], [1, "bg-white", "dark:bg-slate-900", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "p-16", "text-center", "flex", "flex-col", "items-center", "gap-4", "shadow-sm"], [1, "w-24", "h-24", "bg-emerald-50", "dark:bg-emerald-900/20", "rounded-full", "flex", "items-center", "justify-center", "text-emerald-500", "mb-2"], [1, "!text-6xl"], [1, "text-2xl", "font-bold", "text-slate-800", "dark:text-white"], [1, "text-slate-500", "dark:text-slate-400", "max-w-sm", "mx-auto"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-8"], [1, "bg-white", "dark:bg-slate-900", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "overflow-hidden", "flex", "flex-col", "border-b-4", "border-b-rose-500/20"], [1, "relative", "h-56", "bg-slate-100", "dark:bg-slate-800"], ["alt", "Foto rechazada", 1, "w-full", "h-full", "object-cover", 3, "src"], [1, "absolute", "bottom-4", "right-4", "bg-white/90", "dark:bg-slate-900/90", "backdrop-blur", "shadow-lg", "px-3", "py-1.5", "rounded-xl", "text-xs", "font-bold", "text-slate-800", "dark:text-white"], [1, "p-6", "flex-1", "flex", "flex-col", "justify-between", "space-y-4"], [1, "space-y-3"], [1, "flex", "items-center", "justify-between"], [1, "text-[10px]", "font-black", "text-slate-300", "dark:text-slate-600", "uppercase", "tracking-widest"], [1, "text-rose-500", "dark:text-rose-400", "font-bold", "text-xs"], [1, "p-4", "bg-rose-50", "dark:bg-rose-900/10", "rounded-2xl", "border", "border-rose-100", "dark:border-rose-900/20", "text-sm", "font-semibold", "text-rose-800", "dark:text-rose-400", "italic", "leading-relaxed"], ["mat-flat-button", "", "color", "primary", 1, "!w-full", "!rounded-2xl", "!h-12", "!font-bold", "!bg-primary-600", "hover:!bg-primary-700", "transition-all", "shadow-lg", "shadow-primary-500/10", 3, "click"], [1, "mr-2"], [1, "w-full", "h-full", "flex", "items-center", "justify-center", "text-slate-300", "dark:text-slate-600"], [1, "!text-5xl"]], template: function SupervisorComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
        \u0275\u0275text(4, "Panel de Supervisi\xF3n");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p", 3);
        \u0275\u0275text(6, "Revisi\xF3n de incidencias y aprobaci\xF3n de material gr\xE1fico.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div", 4)(8, "div", 5)(9, "mat-icon");
        \u0275\u0275text(10, "security");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(11, "div", 6)(12, "p", 7);
        \u0275\u0275text(13, "Estado Cr\xEDtico");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "p", 8);
        \u0275\u0275text(15);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(16, SupervisorComponent_Conditional_16_Template, 4, 0, "div", 9)(17, SupervisorComponent_Conditional_17_Template, 8, 0)(18, SupervisorComponent_Conditional_18_Template, 3, 0);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(15);
        \u0275\u0275textInterpolate1("", ctx.photos().length, " Fotos");
        \u0275\u0275advance();
        \u0275\u0275conditional(16, ctx.loading() ? 16 : ctx.photos().length === 0 ? 17 : 18);
      }
    }, dependencies: [CommonModule, MatCardModule, MatButtonModule, MatButton, MatIconModule, MatIcon, MatProgressSpinnerModule, MatProgressSpinner, MatSnackBarModule], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n/*# sourceMappingURL=supervisor.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SupervisorComponent, { className: "SupervisorComponent", filePath: "src\\app\\features\\supervisor\\supervisor.component.ts", lineNumber: 21 });
})();
export {
  SupervisorComponent
};
//# sourceMappingURL=chunk-AILW5BVT.js.map
