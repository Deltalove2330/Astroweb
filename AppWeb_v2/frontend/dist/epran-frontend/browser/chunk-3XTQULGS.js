import {
  MatTabsModule
} from "./chunk-A5TTJWI6.js";
import {
  MatInput,
  MatInputModule
} from "./chunk-GXZEZIYO.js";
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel
} from "./chunk-YUDUWHLJ.js";
import {
  MatCardModule
} from "./chunk-HA7AXTKJ.js";
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
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QB3BCYT5.js";

// src/app/features/reports/reports.component.ts
function ReportsComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "mat-spinner", 11);
    \u0275\u0275elementStart(2, "p", 12);
    \u0275\u0275text(3, "Procesando vol\xFAmenes de datos...");
    \u0275\u0275elementEnd()();
  }
}
function ReportsComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 14)(2, "p", 15);
    \u0275\u0275text(3, "Visitas Totales");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 16)(5, "h2", 17);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 18)(8, "mat-icon");
    \u0275\u0275text(9, "stacked_line_chart");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(10, "div", 14)(11, "p", 15);
    \u0275\u0275text(12, "Efectividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 16)(14, "h2", 19);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 20)(17, "mat-icon");
    \u0275\u0275text(18, "task_alt");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(19, "div", 14)(20, "p", 15);
    \u0275\u0275text(21, "Fotos Aprobadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 16)(23, "h2", 17);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 21)(26, "mat-icon");
    \u0275\u0275text(27, "done_all");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(28, "div", 14)(29, "p", 15);
    \u0275\u0275text(30, "Fotos Rechazadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 16)(32, "h2", 22);
    \u0275\u0275text(33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "div", 23)(35, "mat-icon");
    \u0275\u0275text(36, "rule");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(37, "div", 24);
    \u0275\u0275element(38, "div", 25);
    \u0275\u0275elementStart(39, "div", 26)(40, "div", 27)(41, "h3", 28);
    \u0275\u0275text(42, "Desglose del Per\xEDodo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "div", 29)(44, "mat-icon", 30);
    \u0275\u0275text(45, "date_range");
    \u0275\u0275elementEnd();
    \u0275\u0275text(46);
    \u0275\u0275pipe(47, "date");
    \u0275\u0275pipe(48, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(49, "div", 31)(50, "div", 32)(51, "p", 33);
    \u0275\u0275text(52, "Ejecuci\xF3n de Visitas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "div", 34)(54, "span", 35);
    \u0275\u0275text(55, "Completadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "span", 36);
    \u0275\u0275text(57);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(58, "div", 34)(59, "span", 35);
    \u0275\u0275text(60, "Pendientes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "span", 37);
    \u0275\u0275text(62);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(63, "div", 38);
    \u0275\u0275element(64, "div", 39);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(65, "div", 40)(66, "p", 33);
    \u0275\u0275text(67, "Calidad Fotogr\xE1fica");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "div", 34)(69, "span", 35);
    \u0275\u0275text(70, "Total Capturadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "span", 41);
    \u0275\u0275text(72);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(73, "div", 34)(74, "span", 35);
    \u0275\u0275text(75, "Tasa de Aceptaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(76, "span", 42);
    \u0275\u0275text(77);
    \u0275\u0275pipe(78, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(79, "div", 43)(80, "mat-icon", 44);
    \u0275\u0275text(81, "military_tech");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(82, "span", 45);
    \u0275\u0275text(83, "Score Operativo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(84, "span", 46);
    \u0275\u0275text(85, "94.2");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    let tmp_10_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate((tmp_1_0 = ctx_r0.summary()) == null ? null : tmp_1_0.visitas == null ? null : tmp_1_0.visitas.total);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1("", (tmp_2_0 = ctx_r0.summary()) == null ? null : tmp_2_0.visitas == null ? null : tmp_2_0.visitas.porcentaje_completadas, "%");
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate((tmp_3_0 = ctx_r0.summary()) == null ? null : tmp_3_0.fotos == null ? null : tmp_3_0.fotos.aprobadas);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r0.summary()) == null ? null : tmp_4_0.fotos == null ? null : tmp_4_0.fotos.rechazadas);
    \u0275\u0275advance(13);
    \u0275\u0275textInterpolate2(" ", \u0275\u0275pipeBind2(47, 12, (tmp_5_0 = ctx_r0.summary()) == null ? null : tmp_5_0.periodo == null ? null : tmp_5_0.periodo.inicio, "shortDate"), " \u2014 ", \u0275\u0275pipeBind2(48, 15, (tmp_5_0 = ctx_r0.summary()) == null ? null : tmp_5_0.periodo == null ? null : tmp_5_0.periodo.fin, "shortDate"), " ");
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate((tmp_6_0 = ctx_r0.summary()) == null ? null : tmp_6_0.visitas == null ? null : tmp_6_0.visitas.completadas);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate((tmp_7_0 = ctx_r0.summary()) == null ? null : tmp_7_0.visitas == null ? null : tmp_7_0.visitas.pendientes);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", (tmp_8_0 = ctx_r0.summary()) == null ? null : tmp_8_0.visitas == null ? null : tmp_8_0.visitas.porcentaje_completadas, "%");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate((tmp_9_0 = ctx_r0.summary()) == null ? null : tmp_9_0.fotos == null ? null : tmp_9_0.fotos.total);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(78, 18, ((tmp_10_0 = ctx_r0.summary()) == null ? null : tmp_10_0.fotos == null ? null : tmp_10_0.fotos.aprobadas) / ((tmp_10_0 = ctx_r0.summary()) == null ? null : tmp_10_0.fotos == null ? null : tmp_10_0.fotos.total) * 100, "1.0-1"), "% ");
  }
}
var ReportsComponent = class _ReportsComponent {
  constructor(api) {
    this.api = api;
    this.loading = signal(false);
    this.summary = signal(null);
    this.fechaInicio = "";
    this.fechaFin = "";
    const now = /* @__PURE__ */ new Date();
    this.fechaFin = now.toISOString().split("T")[0];
    const start = /* @__PURE__ */ new Date();
    start.setDate(now.getDate() - 30);
    this.fechaInicio = start.toISOString().split("T")[0];
  }
  ngOnInit() {
    this.loadReport();
  }
  loadReport() {
    this.loading.set(true);
    this.api.getReportSummary({
      fecha_inicio: this.fechaInicio,
      fecha_fin: this.fechaFin
    }).subscribe({
      next: (data) => {
        this.summary.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
  static {
    this.\u0275fac = function ReportsComponent_Factory(t) {
      return new (t || _ReportsComponent)(\u0275\u0275directiveInject(ApiService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ReportsComponent, selectors: [["app-reports"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 23, vars: 3, consts: [[1, "space-y-8", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-6"], [1, "text-3xl", "font-bold", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "flex", "flex-wrap", "items-center", "gap-3", "bg-white", "dark:bg-slate-900", "p-3", "rounded-3xl", "shadow-sm", "border", "border-slate-200", "dark:border-white/5"], ["appearance", "outline", 1, "density-compact", "!mb-0", "w-40"], ["matInput", "", "type", "date", 3, "ngModelChange", "ngModel"], [1, "w-2", "h-0.5", "bg-slate-200", "dark:bg-slate-800", "rounded-full", "hidden", "sm:block"], [1, "flex", "items-center", "gap-2", "px-6", "py-2.5", "bg-primary-500", "hover:bg-primary-600", "text-white", "rounded-2xl", "shadow-lg", "shadow-primary-500/20", "transition-all", "font-bold", 3, "click"], [1, "!text-lg"], [1, "flex", "flex-col", "items-center", "justify-center", "py-24", "gap-4"], ["diameter", "48", "strokeWidth", "4"], [1, "text-slate-400", "font-medium"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-4", "gap-6"], [1, "bg-white", "dark:bg-slate-900", "p-8", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm"], [1, "text-xs", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "mb-4"], [1, "flex", "items-end", "justify-between"], [1, "text-4xl", "font-black", "text-slate-800", "dark:text-white", "tracking-tighter"], [1, "p-2", "bg-primary-50", "dark:bg-primary-900/20", "text-primary-500", "dark:text-primary-400", "rounded-xl"], [1, "text-4xl", "font-black", "text-emerald-600", "dark:text-emerald-400", "tracking-tighter"], [1, "p-2", "bg-emerald-50", "dark:bg-emerald-900/20", "text-emerald-500", "dark:text-emerald-400", "rounded-xl"], [1, "p-2", "bg-blue-50", "dark:bg-blue-900/20", "text-blue-500", "dark:text-blue-400", "rounded-xl"], [1, "text-4xl", "font-black", "text-rose-600", "dark:text-rose-400", "tracking-tighter"], [1, "p-2", "bg-rose-50", "dark:bg-rose-900/20", "text-rose-500", "dark:text-rose-400", "rounded-xl"], [1, "bg-slate-900", "dark:bg-slate-800/80", "rounded-[2.5rem]", "p-10", "text-white", "shadow-2xl", "relative", "overflow-hidden", "border", "border-white/5"], [1, "absolute", "-top-20", "-right-20", "w-64", "h-64", "bg-primary-500/10", "rounded-full", "blur-3xl"], [1, "relative", "z-10", "space-y-10"], [1, "flex", "items-center", "justify-between", "border-b", "border-white/10", "pb-6"], [1, "text-2xl", "font-bold"], [1, "flex", "items-center", "gap-2", "text-slate-400", "dark:text-slate-500", "text-sm", "font-semibold"], [1, "!text-sm"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-12"], [1, "space-y-4"], [1, "text-slate-400", "dark:text-slate-500", "text-xs", "font-black", "uppercase", "tracking-[0.2em]"], [1, "flex", "items-center", "justify-between"], [1, "text-slate-300"], [1, "text-xl", "font-bold", "text-emerald-400"], [1, "text-xl", "font-bold", "text-amber-400"], [1, "w-full", "bg-white/10", "rounded-full", "h-1.5", "mt-2"], [1, "bg-primary-500", "h-1.5", "rounded-full"], [1, "space-y-4", "border-l", "border-white/5", "pl-12", "hidden", "md:block"], [1, "text-xl", "font-bold", "text-white"], [1, "text-xl", "font-bold", "text-primary-400"], [1, "flex", "flex-col", "justify-center", "items-center", "bg-white/5", "rounded-3xl", "p-6", "border", "border-white/10"], [1, "!text-5xl", "text-primary-500", "mb-2"], [1, "text-slate-400", "dark:text-slate-500", "text-xs", "font-bold", "uppercase", "tracking-widest", "mb-1"], [1, "text-3xl", "font-black", "italic", "tracking-tighter", "text-white"]], template: function ReportsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
        \u0275\u0275text(4, "Reporter\xEDa Avanzada");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p", 3);
        \u0275\u0275text(6, "An\xE1lisis de rendimiento y m\xE9tricas operativas por per\xEDodo.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div", 4)(8, "mat-form-field", 5)(9, "mat-label");
        \u0275\u0275text(10, "Fecha Inicial");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "input", 6);
        \u0275\u0275twoWayListener("ngModelChange", function ReportsComponent_Template_input_ngModelChange_11_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.fechaInicio, $event) || (ctx.fechaInicio = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275element(12, "div", 7);
        \u0275\u0275elementStart(13, "mat-form-field", 5)(14, "mat-label");
        \u0275\u0275text(15, "Fecha Final");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "input", 6);
        \u0275\u0275twoWayListener("ngModelChange", function ReportsComponent_Template_input_ngModelChange_16_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.fechaFin, $event) || (ctx.fechaFin = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(17, "button", 8);
        \u0275\u0275listener("click", function ReportsComponent_Template_button_click_17_listener() {
          return ctx.loadReport();
        });
        \u0275\u0275elementStart(18, "mat-icon", 9);
        \u0275\u0275text(19, "analytics");
        \u0275\u0275elementEnd();
        \u0275\u0275text(20, " Generar Reporte ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(21, ReportsComponent_Conditional_21_Template, 4, 0, "div", 10)(22, ReportsComponent_Conditional_22_Template, 86, 21);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(11);
        \u0275\u0275twoWayProperty("ngModel", ctx.fechaInicio);
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.fechaFin);
        \u0275\u0275advance(5);
        \u0275\u0275conditional(21, ctx.loading() ? 21 : ctx.summary() ? 22 : -1);
      }
    }, dependencies: [CommonModule, DecimalPipe, DatePipe, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, MatCardModule, MatButtonModule, MatIconModule, MatIcon, MatFormFieldModule, MatFormField, MatLabel, MatInputModule, MatInput, MatProgressSpinnerModule, MatProgressSpinner, MatTabsModule], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n  .density-compact .mat-mdc-form-field-subscript-wrapper {\n  display: none !important;\n}\n/*# sourceMappingURL=reports.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ReportsComponent, { className: "ReportsComponent", filePath: "src\\app\\features\\reports\\reports.component.ts", lineNumber: 23 });
})();
export {
  ReportsComponent
};
//# sourceMappingURL=chunk-3XTQULGS.js.map
