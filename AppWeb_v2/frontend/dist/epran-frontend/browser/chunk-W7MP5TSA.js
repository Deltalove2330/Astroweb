import {
  MatChipsModule
} from "./chunk-ZMRIVOSV.js";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableModule
} from "./chunk-3L7HTECJ.js";
import {
  MatSelect,
  MatSelectModule
} from "./chunk-DD2LOOAS.js";
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel
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
  MatButton,
  MatButtonModule,
  MatIcon,
  MatIconButton,
  MatIconModule,
  MatOption
} from "./chunk-KQNRR4FF.js";
import "./chunk-QGVFX6Y7.js";
import "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  CommonModule,
  DatePipe,
  UpperCasePipe,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QB3BCYT5.js";

// src/app/features/visits/visits.component.ts
function VisitsComponent_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275element(1, "mat-spinner", 16);
    \u0275\u0275elementStart(2, "p", 17);
    \u0275\u0275text(3, "Sincronizando visitas...");
    \u0275\u0275elementEnd()();
  }
}
function VisitsComponent_Conditional_29_th_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 35);
    \u0275\u0275text(1, "ID");
    \u0275\u0275elementEnd();
  }
}
function VisitsComponent_Conditional_29_td_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 36)(1, "span", 37);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const v_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("#", v_r1.id, "");
  }
}
function VisitsComponent_Conditional_29_th_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 35);
    \u0275\u0275text(1, "Mercaderista");
    \u0275\u0275elementEnd();
  }
}
function VisitsComponent_Conditional_29_td_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 36)(1, "div", 38)(2, "div", 39);
    \u0275\u0275text(3, " M ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 40);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const v_r2 = ctx.$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("ID: ", v_r2.mercaderista_id, "");
  }
}
function VisitsComponent_Conditional_29_th_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 35);
    \u0275\u0275text(1, "Punto de Venta");
    \u0275\u0275elementEnd();
  }
}
function VisitsComponent_Conditional_29_td_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 36)(1, "div", 41)(2, "span", 42);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 43);
    \u0275\u0275text(5, "Ubicaci\xF3n asignada");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const v_r3 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Punto #", v_r3.punto_id, "");
  }
}
function VisitsComponent_Conditional_29_th_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 44);
    \u0275\u0275text(1, "Fecha");
    \u0275\u0275elementEnd();
  }
}
function VisitsComponent_Conditional_29_td_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 45);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(2, 1, v_r4.fecha, "mediumDate"), " ");
  }
}
function VisitsComponent_Conditional_29_th_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 35);
    \u0275\u0275text(1, "Estado");
    \u0275\u0275elementEnd();
  }
}
function VisitsComponent_Conditional_29_td_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 36)(1, "span", 46);
    \u0275\u0275element(2, "span", 47);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "uppercase");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const v_r5 = ctx.$implicit;
    const ctx_r5 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r5.getStatusClasses(v_r5.estado));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 3, v_r5.estado), " ");
  }
}
function VisitsComponent_Conditional_29_th_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 48);
    \u0275\u0275text(1, "Acciones");
    \u0275\u0275elementEnd();
  }
}
function VisitsComponent_Conditional_29_td_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 49)(1, "div", 50)(2, "button", 51);
    \u0275\u0275listener("click", function VisitsComponent_Conditional_29_td_19_Template_button_click_2_listener() {
      const v_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r5 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r5.viewPhotos(v_r8));
    });
    \u0275\u0275elementStart(3, "mat-icon");
    \u0275\u0275text(4, "photo_library");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "button", 52)(6, "mat-icon");
    \u0275\u0275text(7, "info");
    \u0275\u0275elementEnd()()()();
  }
}
function VisitsComponent_Conditional_29_tr_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 53);
  }
}
function VisitsComponent_Conditional_29_tr_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 54);
  }
}
function VisitsComponent_Conditional_29_tr_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 55)(2, "div", 56)(3, "div", 57)(4, "mat-icon", 58);
    \u0275\u0275text(5, "inventory_2");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "p", 59);
    \u0275\u0275text(7, "No se encontraron visitas registradas.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 60);
    \u0275\u0275listener("click", function VisitsComponent_Conditional_29_tr_22_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r5 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r5.loadVisits());
    });
    \u0275\u0275text(9, "Actualizar listado");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r5 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275attribute("colspan", ctx_r5.columns.length);
  }
}
function VisitsComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "table", 19);
    \u0275\u0275elementContainerStart(2, 20);
    \u0275\u0275template(3, VisitsComponent_Conditional_29_th_3_Template, 2, 0, "th", 21)(4, VisitsComponent_Conditional_29_td_4_Template, 3, 1, "td", 22);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(5, 23);
    \u0275\u0275template(6, VisitsComponent_Conditional_29_th_6_Template, 2, 0, "th", 21)(7, VisitsComponent_Conditional_29_td_7_Template, 6, 1, "td", 22);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(8, 24);
    \u0275\u0275template(9, VisitsComponent_Conditional_29_th_9_Template, 2, 0, "th", 21)(10, VisitsComponent_Conditional_29_td_10_Template, 6, 1, "td", 22);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(11, 25);
    \u0275\u0275template(12, VisitsComponent_Conditional_29_th_12_Template, 2, 0, "th", 26)(13, VisitsComponent_Conditional_29_td_13_Template, 3, 4, "td", 27);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(14, 28);
    \u0275\u0275template(15, VisitsComponent_Conditional_29_th_15_Template, 2, 0, "th", 21)(16, VisitsComponent_Conditional_29_td_16_Template, 5, 5, "td", 22);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(17, 29);
    \u0275\u0275template(18, VisitsComponent_Conditional_29_th_18_Template, 2, 0, "th", 30)(19, VisitsComponent_Conditional_29_td_19_Template, 8, 0, "td", 31);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275template(20, VisitsComponent_Conditional_29_tr_20_Template, 1, 0, "tr", 32)(21, VisitsComponent_Conditional_29_tr_21_Template, 1, 0, "tr", 33)(22, VisitsComponent_Conditional_29_tr_22_Template, 10, 1, "tr", 34);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r5 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("dataSource", ctx_r5.visits());
    \u0275\u0275advance(19);
    \u0275\u0275property("matHeaderRowDef", ctx_r5.columns);
    \u0275\u0275advance();
    \u0275\u0275property("matRowDefColumns", ctx_r5.columns);
  }
}
var VisitsComponent = class _VisitsComponent {
  constructor(api) {
    this.api = api;
    this.loading = signal(true);
    this.visits = signal([]);
    this.filterEstado = "";
    this.columns = ["id", "mercaderista_id", "punto_id", "fecha", "estado", "acciones"];
  }
  ngOnInit() {
    this.loadVisits();
  }
  loadVisits() {
    this.loading.set(true);
    const params = this.filterEstado ? { estado: this.filterEstado } : {};
    this.api.getVisits(params).subscribe({
      next: (data) => {
        this.visits.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
  getStatusClasses(estado) {
    const map = {
      completada: "bg-emerald-50 text-emerald-700",
      en_progreso: "bg-primary-50 text-primary-700",
      pendiente: "bg-amber-50 text-amber-700"
    };
    return map[estado] ?? "bg-slate-50 text-slate-700";
  }
  viewPhotos(visit) {
    console.log("Ver fotos de visita", visit.id);
  }
  static {
    this.\u0275fac = function VisitsComponent_Factory(t) {
      return new (t || _VisitsComponent)(\u0275\u0275directiveInject(ApiService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VisitsComponent, selectors: [["app-visits"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 30, vars: 2, consts: [[1, "space-y-8", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-6"], [1, "text-3xl", "font-bold", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "flex", "flex-wrap", "items-center", "gap-3", "bg-white", "dark:bg-slate-900", "p-2", "rounded-2xl", "shadow-sm", "border", "border-slate-200", "dark:border-white/5"], [1, "flex", "items-center", "gap-2", "px-3", "border-r", "border-slate-100", "dark:border-white/5"], [1, "text-slate-400", "text-sm"], [1, "text-sm", "font-semibold", "text-slate-600", "dark:text-slate-400"], ["appearance", "outline", 1, "density-compact", "!mb-0", "w-44"], [3, "ngModelChange", "ngModel"], ["value", ""], ["value", "pendiente"], ["value", "en_progreso"], ["value", "completada"], [1, "w-10", "h-10", "flex", "items-center", "justify-center", "rounded-xl", "bg-primary-50", "dark:bg-primary-900/20", "text-primary-600", "dark:text-primary-400", "hover:bg-primary-500", "hover:text-white", "transition-all", "duration-200", 3, "click"], [1, "flex", "flex-col", "items-center", "justify-center", "py-24", "gap-4"], ["diameter", "48", "strokeWidth", "4"], [1, "text-slate-400", "font-medium"], [1, "bg-white", "dark:bg-slate-900", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "overflow-hidden", "overflow-x-auto"], ["mat-table", "", 1, "w-full", 3, "dataSource"], ["matColumnDef", "id"], ["mat-header-cell", "", "class", "!bg-slate-50 !text-slate-500 !font-bold !py-5", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "!py-4", 4, "matCellDef"], ["matColumnDef", "mercaderista_id"], ["matColumnDef", "punto_id"], ["matColumnDef", "fecha"], ["mat-header-cell", "", "class", "!bg-slate-50 dark:!bg-slate-950/50 !text-slate-500 !font-bold !py-5", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "!py-4 text-slate-600 dark:text-slate-300", 4, "matCellDef"], ["matColumnDef", "estado"], ["matColumnDef", "acciones"], ["mat-header-cell", "", "class", "!bg-slate-50 !text-slate-500 !font-bold !py-5 text-right px-6", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "!py-4 text-right px-6", 4, "matCellDef"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "hover:bg-slate-50/80 transition-colors cursor-pointer border-b border-slate-100 last:border-0", 4, "matRowDef", "matRowDefColumns"], [4, "matNoDataRow"], ["mat-header-cell", "", 1, "!bg-slate-50", "!text-slate-500", "!font-bold", "!py-5"], ["mat-cell", "", 1, "!py-4"], [1, "font-mono", "text-xs", "bg-slate-100", "px-2", "py-1", "rounded", "text-slate-600"], [1, "flex", "items-center", "gap-3"], [1, "w-8", "h-8", "rounded-full", "bg-primary-50", "flex", "items-center", "justify-center", "text-primary-700", "font-bold", "text-xs"], [1, "font-medium", "text-slate-700"], [1, "flex", "flex-col"], [1, "font-semibold", "text-slate-800", "dark:text-white"], [1, "text-xs", "text-slate-400", "dark:text-slate-500"], ["mat-header-cell", "", 1, "!bg-slate-50", "dark:!bg-slate-950/50", "!text-slate-500", "!font-bold", "!py-5"], ["mat-cell", "", 1, "!py-4", "text-slate-600", "dark:text-slate-300"], [1, "px-3", "py-1.5", "rounded-full", "text-xs", "font-bold", "flex", "items-center", "w-fit", "gap-1.5"], [1, "w-1.5", "h-1.5", "rounded-full", "bg-current"], ["mat-header-cell", "", 1, "!bg-slate-50", "!text-slate-500", "!font-bold", "!py-5", "text-right", "px-6"], ["mat-cell", "", 1, "!py-4", "text-right", "px-6"], [1, "flex", "items-center", "justify-end", "gap-2"], ["mat-icon-button", "", "matTooltip", "Ver Fotos", 1, "!text-primary-500", "hover:!bg-primary-50", "transition-colors", 3, "click"], ["mat-icon-button", "", "matTooltip", "Detalles", 1, "!text-slate-400", "hover:!bg-slate-50", "transition-colors"], ["mat-header-row", ""], ["mat-row", "", 1, "hover:bg-slate-50/80", "transition-colors", "cursor-pointer", "border-b", "border-slate-100", "last:border-0"], [1, "py-20", "text-center"], [1, "flex", "flex-col", "items-center", "gap-3"], [1, "w-16", "h-16", "bg-slate-50", "rounded-full", "flex", "items-center", "justify-center", "text-slate-300"], [1, "!text-4xl"], [1, "text-slate-500", "font-medium"], ["mat-button", "", "color", "primary", 3, "click"]], template: function VisitsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
        \u0275\u0275text(4, "Registro de Visitas");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p", 3);
        \u0275\u0275text(6, "Supervisi\xF3n y seguimiento de actividades en campo.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div", 4)(8, "div", 5)(9, "mat-icon", 6);
        \u0275\u0275text(10, "filter_list");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "span", 7);
        \u0275\u0275text(12, "Filtrar:");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(13, "mat-form-field", 8)(14, "mat-label");
        \u0275\u0275text(15, "Estado");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "mat-select", 9);
        \u0275\u0275twoWayListener("ngModelChange", function VisitsComponent_Template_mat_select_ngModelChange_16_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filterEstado, $event) || (ctx.filterEstado = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function VisitsComponent_Template_mat_select_ngModelChange_16_listener() {
          return ctx.loadVisits();
        });
        \u0275\u0275elementStart(17, "mat-option", 10);
        \u0275\u0275text(18, "Todos los estados");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "mat-option", 11);
        \u0275\u0275text(20, "Pendientes");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "mat-option", 12);
        \u0275\u0275text(22, "En Progreso");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "mat-option", 13);
        \u0275\u0275text(24, "Completadas");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(25, "button", 14);
        \u0275\u0275listener("click", function VisitsComponent_Template_button_click_25_listener() {
          return ctx.loadVisits();
        });
        \u0275\u0275elementStart(26, "mat-icon");
        \u0275\u0275text(27, "refresh");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(28, VisitsComponent_Conditional_28_Template, 4, 0, "div", 15)(29, VisitsComponent_Conditional_29_Template, 23, 3);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(16);
        \u0275\u0275twoWayProperty("ngModel", ctx.filterEstado);
        \u0275\u0275advance(12);
        \u0275\u0275conditional(28, ctx.loading() ? 28 : 29);
      }
    }, dependencies: [CommonModule, UpperCasePipe, DatePipe, MatTableModule, MatTable, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatNoDataRow, MatButtonModule, MatButton, MatIconButton, MatIconModule, MatIcon, MatCardModule, MatChipsModule, MatFormFieldModule, MatFormField, MatLabel, MatSelectModule, MatSelect, MatOption, MatProgressSpinnerModule, MatProgressSpinner, MatTooltipModule, MatTooltip, FormsModule, NgControlStatus, NgModel], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n  .density-compact .mat-mdc-form-field-subscript-wrapper {\n  display: none !important;\n}\n/*# sourceMappingURL=visits.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VisitsComponent, { className: "VisitsComponent", filePath: "src\\app\\features\\visits\\visits.component.ts", lineNumber: 28 });
})();
export {
  VisitsComponent
};
//# sourceMappingURL=chunk-W7MP5TSA.js.map
