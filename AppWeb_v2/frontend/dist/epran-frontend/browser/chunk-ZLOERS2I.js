import {
  MatSnackBar,
  MatSnackBarModule
} from "./chunk-7QJW63DM.js";
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
  DatePipe,
  __spreadProps,
  __spreadValues,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
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
  ɵɵpipeBind2,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-QB3BCYT5.js";

// src/app/features/atencion-cliente/atencion-cliente.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function AtencionClienteComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 4)(1, "mat-icon", 6);
    \u0275\u0275text(2, "mark_email_unread");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", ctx_r0.solicitudes().length, " pendiente", ctx_r0.solicitudes().length !== 1 ? "s" : "", " ");
  }
}
function AtencionClienteComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275element(1, "mat-spinner", 7);
    \u0275\u0275elementStart(2, "p", 8);
    \u0275\u0275text(3, "Buscando solicitudes pendientes...");
    \u0275\u0275elementEnd()();
  }
}
function AtencionClienteComponent_Conditional_9_For_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 20);
    \u0275\u0275listener("click", function AtencionClienteComponent_Conditional_9_For_2_Conditional_12_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const sol_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.rechazar(sol_r3.id));
    });
    \u0275\u0275text(1, " Rechazar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 21);
    \u0275\u0275listener("click", function AtencionClienteComponent_Conditional_9_For_2_Conditional_12_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r2);
      const sol_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.aprobar(sol_r3.id));
    });
    \u0275\u0275text(3, " Aprobar ");
    \u0275\u0275elementEnd();
  }
}
function AtencionClienteComponent_Conditional_9_For_2_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Procesada el ", \u0275\u0275pipeBind2(2, 1, ctx_r0.today, "short"), " ");
  }
}
function AtencionClienteComponent_Conditional_9_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 13)(2, "div", 14)(3, "span", 15);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h4", 16);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "span", 17);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "p", 18);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 19);
    \u0275\u0275template(12, AtencionClienteComponent_Conditional_9_For_2_Conditional_12_Template, 4, 0)(13, AtencionClienteComponent_Conditional_9_For_2_Conditional_13_Template, 3, 4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const sol_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("border-l-amber-400", sol_r3.estado === "pendiente")("border-l-emerald-400", sol_r3.estado === "aprobada")("border-l-rose-400", sol_r3.estado === "rechazada");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(sol_r3.tipo);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Solicitud #", sol_r3.id, "");
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r0.getSolicitudClasses(sol_r3.estado));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", sol_r3.estado, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", sol_r3.descripcion, " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(12, sol_r3.estado === "pendiente" ? 12 : 13);
  }
}
function AtencionClienteComponent_Conditional_9_ForEmpty_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "mat-icon", 23);
    \u0275\u0275text(2, "all_inbox");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 24);
    \u0275\u0275text(4, "Sin solicitudes pendientes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 25);
    \u0275\u0275text(6, "El buz\xF3n est\xE1 vac\xEDo en este momento.");
    \u0275\u0275elementEnd()();
  }
}
function AtencionClienteComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275repeaterCreate(1, AtencionClienteComponent_Conditional_9_For_2_Template, 14, 13, "div", 10, _forTrack0, false, AtencionClienteComponent_Conditional_9_ForEmpty_3_Template, 7, 0, "div", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.solicitudes());
  }
}
var AtencionClienteComponent = class _AtencionClienteComponent {
  constructor(api, snack) {
    this.api = api;
    this.snack = snack;
    this.loadingSolicitudes = signal(true);
    this.solicitudes = signal([]);
    this.today = /* @__PURE__ */ new Date();
  }
  ngOnInit() {
    this.api.getSolicitudes("pendiente").subscribe({
      next: (data) => {
        this.solicitudes.set(data);
        this.loadingSolicitudes.set(false);
      },
      error: () => this.loadingSolicitudes.set(false)
    });
  }
  aprobar(id) {
    this.api.aprobarSolicitud(id).subscribe({
      next: () => {
        this.solicitudes.update((ss) => ss.map((s) => s.id === id ? __spreadProps(__spreadValues({}, s), { estado: "aprobada" }) : s));
        this.snack.open("Solicitud aprobada", "OK", { duration: 2e3 });
      }
    });
  }
  rechazar(id) {
    this.api.rechazarSolicitud(id).subscribe({
      next: () => {
        this.solicitudes.update((ss) => ss.map((s) => s.id === id ? __spreadProps(__spreadValues({}, s), { estado: "rechazada" }) : s));
        this.snack.open("Solicitud rechazada", "OK", { duration: 2e3 });
      }
    });
  }
  getSolicitudClasses(estado) {
    const map = {
      aprobada: "bg-emerald-100 text-emerald-700",
      rechazada: "bg-rose-100 text-rose-700",
      pendiente: "bg-amber-100 text-amber-700"
    };
    return map[estado] ?? "bg-slate-100 text-slate-500";
  }
  static {
    this.\u0275fac = function AtencionClienteComponent_Factory(t) {
      return new (t || _AtencionClienteComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AtencionClienteComponent, selectors: [["app-atencion-cliente"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 10, vars: 2, consts: [[1, "space-y-8", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-6"], [1, "text-3xl", "font-bold", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "flex", "items-center", "gap-2", "px-4", "py-2", "bg-amber-50", "dark:bg-amber-900/20", "border", "border-amber-200", "dark:border-amber-800/30", "text-amber-700", "dark:text-amber-400", "rounded-xl", "text-sm", "font-black"], [1, "flex", "flex-col", "items-center", "py-24", "gap-3"], [1, "!text-base", "animate-pulse"], ["diameter", "40"], [1, "text-slate-400", "font-medium"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "bg-white", "dark:bg-slate-900", "p-6", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "hover:shadow-md", "transition-all", "flex", "flex-col", "gap-4", "border-l-4", 3, "border-l-amber-400", "border-l-emerald-400", "border-l-rose-400"], [1, "lg:col-span-2", "py-24", "flex", "flex-col", "items-center", "gap-3", "opacity-40"], [1, "bg-white", "dark:bg-slate-900", "p-6", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "hover:shadow-md", "transition-all", "flex", "flex-col", "gap-4", "border-l-4"], [1, "flex", "justify-between", "items-start"], [1, "space-y-1"], [1, "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest"], [1, "text-lg", "font-bold", "text-slate-800", "dark:text-white"], [1, "px-2.5", "py-1", "rounded-lg", "text-[10px]", "font-black", "uppercase", "tracking-tighter"], [1, "text-slate-600", "dark:text-slate-300", "text-sm", "leading-relaxed", "bg-slate-50", "dark:bg-slate-800/50", "p-4", "rounded-2xl", "border", "border-slate-100", "dark:border-white/5"], [1, "flex", "items-center", "justify-end", "gap-3", "pt-2"], ["mat-button", "", 1, "!text-rose-600", "!font-bold", "hover:!bg-rose-50", "dark:hover:!bg-rose-900/20", "!rounded-xl", 3, "click"], ["mat-flat-button", "", "color", "primary", 1, "!rounded-xl", "!font-bold", "!bg-emerald-500", "hover:!bg-emerald-600", "shadow-sm", 3, "click"], [1, "text-xs", "text-slate-400", "font-medium", "italic"], [1, "!text-6xl", "text-slate-400"], [1, "text-xl", "font-bold", "dark:text-white"], [1, "text-sm", "dark:text-slate-400"]], template: function AtencionClienteComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
        \u0275\u0275text(4, "Solicitudes");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p", 3);
        \u0275\u0275text(6, "Buz\xF3n de solicitudes de servicio pendientes de revisi\xF3n.");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(7, AtencionClienteComponent_Conditional_7_Template, 4, 2, "span", 4);
        \u0275\u0275elementEnd();
        \u0275\u0275template(8, AtencionClienteComponent_Conditional_8_Template, 4, 0, "div", 5)(9, AtencionClienteComponent_Conditional_9_Template, 4, 1);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(7);
        \u0275\u0275conditional(7, ctx.solicitudes().length > 0 ? 7 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(8, ctx.loadingSolicitudes() ? 8 : 9);
      }
    }, dependencies: [CommonModule, DatePipe, MatButtonModule, MatButton, MatIconModule, MatIcon, MatProgressSpinnerModule, MatProgressSpinner, MatSnackBarModule], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n  .modern-tabs .mat-mdc-tab-header {\n  background: white;\n  border-radius: 16px;\n  margin-bottom: 24px;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);\n  border: 1px solid rgba(0, 0, 0, 0.05);\n}\n  .modern-tabs .mat-mdc-tab-group-inverted-header {\n  border-bottom: none;\n}\n  .modern-tabs .mdc-tab {\n  height: 64px;\n}\n  .modern-tabs .mat-mdc-tab-labels {\n  padding: 0 16px;\n}\n/*# sourceMappingURL=atencion-cliente.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AtencionClienteComponent, { className: "AtencionClienteComponent", filePath: "src\\app\\features\\atencion-cliente\\atencion-cliente.component.ts", lineNumber: 19 });
})();
export {
  AtencionClienteComponent
};
//# sourceMappingURL=chunk-ZLOERS2I.js.map
