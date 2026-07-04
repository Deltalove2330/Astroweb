import {
  ClientCategoriesDialogComponent
} from "./chunk-G4SN7CSW.js";
import {
  MatDialog,
  MatDialogModule
} from "./chunk-KCFHIW3D.js";
import {
  HasPermDirective
} from "./chunk-RNOX4RCL.js";
import "./chunk-7QJW63DM.js";
import "./chunk-FAJEMXMR.js";
import "./chunk-DD2LOOAS.js";
import "./chunk-YUDUWHLJ.js";
import {
  MatCard,
  MatCardContent,
  MatCardModule
} from "./chunk-HA7AXTKJ.js";
import {
  MatTooltipModule
} from "./chunk-PBKBS7OR.js";
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
  ApiService
} from "./chunk-G4LBJVY7.js";
import {
  MatButton,
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
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QB3BCYT5.js";

// src/app/features/client-categories/client-categories.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function ClientCategoriesComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275element(1, "mat-spinner", 16);
    \u0275\u0275elementEnd();
  }
}
function ClientCategoriesComponent_Conditional_21_For_2_button_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 28);
    \u0275\u0275listener("click", function ClientCategoriesComponent_Conditional_21_For_2_button_13_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const c_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.manageCategories(c_r2));
    });
    \u0275\u0275elementStart(1, "mat-icon", 29);
    \u0275\u0275text(2, "category");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Gestionar Categor\xEDas ");
    \u0275\u0275elementEnd();
  }
}
function ClientCategoriesComponent_Conditional_21_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-card", 18)(1, "mat-card-content", 20)(2, "div")(3, "div", 21)(4, "div")(5, "h3", 22);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 23);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 24)(10, "mat-icon", 25);
    \u0275\u0275text(11, "storefront");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(12, "div", 26);
    \u0275\u0275template(13, ClientCategoriesComponent_Conditional_21_For_2_button_13_Template, 4, 0, "button", 27);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const c_r2 = ctx.$implicit;
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(c_r2.nombre || c_r2.cliente);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r2.rif || "Sin RIF");
    \u0275\u0275advance(5);
    \u0275\u0275property("hasPerm", "client-categories")("hasPermAction", "write");
  }
}
function ClientCategoriesComponent_Conditional_21_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "mat-icon", 30);
    \u0275\u0275text(2, "search_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 31);
    \u0275\u0275text(4, "No se encontraron clientes");
    \u0275\u0275elementEnd()();
  }
}
function ClientCategoriesComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275repeaterCreate(1, ClientCategoriesComponent_Conditional_21_For_2_Template, 14, 4, "mat-card", 18, _forTrack0);
    \u0275\u0275template(3, ClientCategoriesComponent_Conditional_21_Conditional_3_Template, 5, 0, "div", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.filteredClients());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(3, ctx_r2.filteredClients().length === 0 ? 3 : -1);
  }
}
var ClientCategoriesComponent = class _ClientCategoriesComponent {
  constructor(api, dialog) {
    this.api = api;
    this.dialog = dialog;
    this.clients = signal([]);
    this.loading = signal(true);
    this.searchTerm = "";
  }
  ngOnInit() {
    this.api.getClients().subscribe((data) => {
      this.clients.set(data);
      this.loading.set(false);
    });
  }
  filteredClients() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term)
      return this.clients();
    return this.clients().filter((c) => c.nombre && c.nombre.toLowerCase().includes(term) || c.cliente && c.cliente.toLowerCase().includes(term) || c.rif && c.rif.toLowerCase().includes(term));
  }
  manageCategories(c) {
    this.dialog.open(ClientCategoriesDialogComponent, {
      width: "760px",
      panelClass: "premium-dialog-panel",
      data: { cliente: c }
    });
  }
  static {
    this.\u0275fac = function ClientCategoriesComponent_Factory(t) {
      return new (t || _ClientCategoriesComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(MatDialog));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ClientCategoriesComponent, selectors: [["app-client-categories"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 22, vars: 2, consts: [[1, "space-y-8", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "relative", "rounded-3xl", "overflow-hidden", "p-8", "bg-gradient-to-r", "from-indigo-700", "via-indigo-600", "to-violet-600", "shadow-lg", "shadow-indigo-500/20"], [1, "absolute", "-right-10", "-top-10", "w-48", "h-48", "rounded-full", "bg-white/10", "blur-2xl"], [1, "relative", "z-10"], [1, "flex", "items-center", "gap-3", "mb-2"], [1, "w-11", "h-11", "rounded-2xl", "bg-white/20", "backdrop-blur-sm", "flex", "items-center", "justify-center"], [1, "text-white"], [1, "text-[11px]", "font-black", "text-white/80", "uppercase", "tracking-[0.2em]"], [1, "text-3xl", "md:text-4xl", "font-black", "text-white", "tracking-tight", "leading-tight"], [1, "text-indigo-100", "mt-1", "text-sm", "font-medium"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200", "dark:border-white/5", "p-6", "mb-8"], [1, "flex", "items-center", "justify-between", "mb-6"], [1, "relative", "w-full", "md:w-72"], [1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-400", "!text-lg"], ["placeholder", "Buscar cliente por nombre o RIF...", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-white/10", "focus:border-indigo-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "pl-10", "pr-3", "py-2.5", "text-sm", "font-semibold", "outline-none", "transition-colors", 3, "ngModelChange", "ngModel"], [1, "flex", "justify-center", "py-12"], ["diameter", "40"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4", "gap-4"], [1, "!shadow-sm", "!rounded-2xl", "border", "border-slate-100", "dark:border-white/5", "dark:!bg-slate-800", "group", "hover:border-indigo-500", "transition-colors"], [1, "col-span-full", "py-12", "text-center", "text-slate-400"], [1, "!p-5", "flex", "flex-col", "h-full", "justify-between"], [1, "flex", "items-start", "justify-between", "mb-2"], [1, "font-bold", "text-lg", "text-slate-800", "dark:text-white", "leading-tight", "mb-1"], [1, "text-xs", "text-slate-500", "font-mono"], [1, "w-10", "h-10", "rounded-xl", "bg-indigo-50", "dark:bg-indigo-900/30", "flex", "items-center", "justify-center", "shrink-0"], [1, "text-indigo-600", "dark:text-indigo-400", "!text-xl"], [1, "mt-4", "pt-4", "border-t", "border-slate-100", "dark:border-white/5"], ["mat-flat-button", "", "color", "primary", "class", "!rounded-xl !bg-indigo-600 hover:!bg-indigo-500 w-full", 3, "click", 4, "hasPerm", "hasPermAction"], ["mat-flat-button", "", "color", "primary", 1, "!rounded-xl", "!bg-indigo-600", "hover:!bg-indigo-500", "w-full", 3, "click"], [1, "mr-2"], [1, "!text-5xl", "opacity-30", "mb-2"], [1, "font-bold", "text-sm"]], template: function ClientCategoriesComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
        \u0275\u0275element(2, "div", 2);
        \u0275\u0275elementStart(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "mat-icon", 6);
        \u0275\u0275text(7, "category");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "span", 7);
        \u0275\u0275text(9, "Administraci\xF3n");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "h1", 8);
        \u0275\u0275text(11, "Categor\xEDas de Clientes");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "p", 9);
        \u0275\u0275text(13, "Asignaci\xF3n de categor\xEDas de productos por cada cliente en el sistema.");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(14, "div", 10)(15, "div", 11)(16, "div", 12)(17, "mat-icon", 13);
        \u0275\u0275text(18, "search");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "input", 14);
        \u0275\u0275twoWayListener("ngModelChange", function ClientCategoriesComponent_Template_input_ngModelChange_19_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.searchTerm, $event) || (ctx.searchTerm = $event);
          return $event;
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(20, ClientCategoriesComponent_Conditional_20_Template, 2, 0, "div", 15)(21, ClientCategoriesComponent_Conditional_21_Template, 4, 1);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(19);
        \u0275\u0275twoWayProperty("ngModel", ctx.searchTerm);
        \u0275\u0275advance();
        \u0275\u0275conditional(20, ctx.loading() ? 20 : 21);
      }
    }, dependencies: [CommonModule, MatCardModule, MatCard, MatCardContent, MatIconModule, MatIcon, MatButtonModule, MatButton, MatDialogModule, MatProgressSpinnerModule, MatProgressSpinner, MatTooltipModule, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, HasPermDirective], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ClientCategoriesComponent, { className: "ClientCategoriesComponent", filePath: "src\\app\\features\\client-categories\\client-categories.component.ts", lineNumber: 81 });
})();
export {
  ClientCategoriesComponent
};
//# sourceMappingURL=chunk-LNPFKWQ4.js.map
