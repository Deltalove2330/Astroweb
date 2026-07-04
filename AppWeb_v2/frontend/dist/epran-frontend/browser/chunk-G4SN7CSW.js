import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogModule,
  MatDialogRef
} from "./chunk-KCFHIW3D.js";
import {
  MatSnackBar
} from "./chunk-7QJW63DM.js";
import {
  MatSelectModule
} from "./chunk-DD2LOOAS.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-I7XEM5TB.js";
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
  MatIconButton,
  MatIconModule
} from "./chunk-KQNRR4FF.js";
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
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QB3BCYT5.js";

// src/app/features/users/client-categories-dialog.component.ts
var _forTrack0 = ($index, $item) => $item.id_categoria;
function ClientCategoriesDialogComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "mat-spinner", 11);
    \u0275\u0275elementEnd();
  }
}
function ClientCategoriesDialogComponent_Conditional_17_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 31);
    \u0275\u0275listener("click", function ClientCategoriesDialogComponent_Conditional_17_Conditional_8_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.searchAvailable = "");
    });
    \u0275\u0275elementStart(1, "mat-icon", 32);
    \u0275\u0275text(2, "close");
    \u0275\u0275elementEnd()();
  }
}
function ClientCategoriesDialogComponent_Conditional_17_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "p", 33);
    \u0275\u0275text(2, "No se encontraron categor\xEDas");
    \u0275\u0275elementEnd()();
  }
}
function ClientCategoriesDialogComponent_Conditional_17_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 21)(1, "input", 34);
    \u0275\u0275listener("change", function ClientCategoriesDialogComponent_Conditional_17_For_12_Template_input_change_1_listener() {
      const cat_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleSelection(cat_r5.id_categoria));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 35);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const cat_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r1.isSelected(cat_r5.id_categoria));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(cat_r5.nombre);
  }
}
function ClientCategoriesDialogComponent_Conditional_17_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "mat-icon", 36);
    \u0275\u0275text(2, "inventory_2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 37);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.assignedCategories().length === 0 ? "Sin categor\xEDas" : "Ninguna coincide");
  }
}
function ClientCategoriesDialogComponent_Conditional_17_Conditional_29_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 38)(1, "div", 39)(2, "div", 40);
    \u0275\u0275element(3, "div", 41)(4, "div", 42);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 43);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 44);
    \u0275\u0275listener("click", function ClientCategoriesDialogComponent_Conditional_17_Conditional_29_For_1_Template_button_click_7_listener() {
      const cat_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.removeCategory(cat_r7.id_categoria));
    });
    \u0275\u0275elementStart(8, "mat-icon", 32);
    \u0275\u0275text(9, "close");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const cat_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(cat_r7.categoria_nombre);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.saving());
  }
}
function ClientCategoriesDialogComponent_Conditional_17_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, ClientCategoriesDialogComponent_Conditional_17_Conditional_29_For_1_Template, 10, 2, "div", 38, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(ctx_r1.filteredAssigned());
  }
}
function ClientCategoriesDialogComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 13)(2, "label", 14);
    \u0275\u0275text(3, "Disponibles");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 15)(5, "mat-icon", 16);
    \u0275\u0275text(6, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 17);
    \u0275\u0275twoWayListener("ngModelChange", function ClientCategoriesDialogComponent_Conditional_17_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.searchAvailable, $event) || (ctx_r1.searchAvailable = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, ClientCategoriesDialogComponent_Conditional_17_Conditional_8_Template, 3, 0, "button", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 19);
    \u0275\u0275template(10, ClientCategoriesDialogComponent_Conditional_17_Conditional_10_Template, 3, 0, "div", 20);
    \u0275\u0275repeaterCreate(11, ClientCategoriesDialogComponent_Conditional_17_For_12_Template, 4, 2, "label", 21, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "button", 22);
    \u0275\u0275listener("click", function ClientCategoriesDialogComponent_Conditional_17_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addSelectedCategories());
    });
    \u0275\u0275elementStart(14, "mat-icon", 23);
    \u0275\u0275text(15, "add_task");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 24)(18, "label", 25)(19, "span");
    \u0275\u0275text(20, "Asignadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 26);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 15)(24, "mat-icon", 27);
    \u0275\u0275text(25, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "input", 28);
    \u0275\u0275twoWayListener("ngModelChange", function ClientCategoriesDialogComponent_Conditional_17_Template_input_ngModelChange_26_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.searchAssigned, $event) || (ctx_r1.searchAssigned = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 29);
    \u0275\u0275template(28, ClientCategoriesDialogComponent_Conditional_17_Conditional_28_Template, 5, 1, "div", 30)(29, ClientCategoriesDialogComponent_Conditional_17_Conditional_29_Template, 2, 0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.searchAvailable);
    \u0275\u0275advance();
    \u0275\u0275conditional(8, ctx_r1.searchAvailable ? 8 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(10, ctx_r1.filteredAvailable().length === 0 ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.filteredAvailable());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.selectedIds.length === 0 || ctx_r1.saving());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" Asignar (", ctx_r1.selectedIds.length, ") ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.assignedCategories().length);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.searchAssigned);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(28, ctx_r1.filteredAssigned().length === 0 ? 28 : 29);
  }
}
var ClientCategoriesDialogComponent = class _ClientCategoriesDialogComponent {
  constructor(data, dialogRef, api, snack) {
    this.data = data;
    this.dialogRef = dialogRef;
    this.api = api;
    this.snack = snack;
    this.loading = signal(true);
    this.saving = signal(false);
    this.assignedCategories = signal([]);
    this.allCategories = signal([]);
    this.searchAvailable = "";
    this.searchAssigned = "";
    this.selectedIds = [];
  }
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.loading.set(true);
    this.api.getClientCategories(this.data.cliente.id).subscribe({
      next: (assigned) => {
        this.assignedCategories.set(assigned);
        this.api.getCatalogosCategorias().subscribe({
          next: (all) => {
            this.allCategories.set(all);
            this.loading.set(false);
          },
          error: () => {
            this.snack.open("Error al cargar cat\xE1logos de categor\xEDas", "OK", { duration: 3e3 });
            this.loading.set(false);
          }
        });
      },
      error: () => {
        this.snack.open("Error al cargar categor\xEDas del cliente", "OK", { duration: 3e3 });
        this.loading.set(false);
      }
    });
  }
  availableCategories() {
    const assignedIds = new Set(this.assignedCategories().map((c) => c.id_categoria));
    return this.allCategories().filter((c) => !assignedIds.has(c.id_categoria));
  }
  filteredAvailable() {
    let list = this.availableCategories();
    const term = this.searchAvailable.toLowerCase().trim();
    if (term) {
      list = list.filter((c) => c.nombre.toLowerCase().includes(term));
    }
    return list;
  }
  filteredAssigned() {
    let list = this.assignedCategories();
    const term = this.searchAssigned.toLowerCase().trim();
    if (term) {
      list = list.filter((c) => c.categoria_nombre.toLowerCase().includes(term));
    }
    return list;
  }
  isSelected(id) {
    return this.selectedIds.includes(id);
  }
  toggleSelection(id) {
    if (this.isSelected(id)) {
      this.selectedIds = this.selectedIds.filter((i) => i !== id);
    } else {
      this.selectedIds.push(id);
    }
  }
  addSelectedCategories() {
    if (this.selectedIds.length === 0)
      return;
    this.saving.set(true);
    let completed = 0;
    const total = this.selectedIds.length;
    let hasError = false;
    this.selectedIds.forEach((id) => {
      this.api.addClientCategory(this.data.cliente.id, id).subscribe({
        next: () => {
          completed++;
          if (completed === total)
            this.finishBulkAdd(hasError);
        },
        error: () => {
          hasError = true;
          completed++;
          if (completed === total)
            this.finishBulkAdd(hasError);
        }
      });
    });
  }
  finishBulkAdd(hasError) {
    this.saving.set(false);
    this.selectedIds = [];
    if (hasError) {
      this.snack.open("Algunas categor\xEDas no se pudieron asignar", "OK", { duration: 3e3 });
    } else {
      this.snack.open("Categor\xEDas asignadas correctamente", "OK", { duration: 2500 });
    }
    this.reloadAssigned();
  }
  removeCategory(categoryId) {
    if (!confirm("\xBFSeguro que deseas remover esta categor\xEDa?"))
      return;
    this.saving.set(true);
    this.api.removeClientCategory(this.data.cliente.id, categoryId).subscribe({
      next: () => {
        this.snack.open("Categor\xEDa removida", "OK", { duration: 2e3 });
        this.saving.set(false);
        this.reloadAssigned();
      },
      error: (err) => {
        this.snack.open(err.error?.detail || "Error al remover", "OK", { duration: 3e3 });
        this.saving.set(false);
      }
    });
  }
  reloadAssigned() {
    this.api.getClientCategories(this.data.cliente.id).subscribe({
      next: (assigned) => {
        this.assignedCategories.set(assigned);
      }
    });
  }
  static {
    this.\u0275fac = function ClientCategoriesDialogComponent_Factory(t) {
      return new (t || _ClientCategoriesDialogComponent)(\u0275\u0275directiveInject(MAT_DIALOG_DATA), \u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ClientCategoriesDialogComponent, selectors: [["app-client-categories-dialog"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 18, vars: 2, consts: [[1, "relative", "flex", "flex-col", "bg-slate-950", "text-white", "rounded-3xl", "overflow-hidden", "shadow-[0_0_50px_-12px_rgba(0,0,0,1)]", "border", "border-white/5", 2, "min-height", "500px", "max-height", "85vh"], [1, "absolute", "top-0", "left-1/2", "-translate-x-1/2", "w-[400px]", "h-[150px]", "bg-indigo-600/30", "blur-[70px]", "pointer-events-none", "rounded-full"], [1, "relative", "z-10", "flex", "items-center", "justify-between", "p-6", "pb-4", "border-b", "border-white/10", "shrink-0"], [1, "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "rounded-2xl", "bg-indigo-500/20", "border", "border-indigo-500/30", "flex", "items-center", "justify-center", "shadow-lg"], [1, "text-indigo-400", "!text-2xl"], [1, "text-xl", "font-black", "tracking-tight", "text-white", "m-0", "leading-tight"], [1, "text-sm", "text-indigo-200/70", "font-medium", "mt-0.5"], ["mat-icon-button", "", "mat-dialog-close", "", 1, "!w-10", "!h-10", "rounded-xl", "bg-white/5", "hover:bg-white/10", "text-slate-400", "hover:text-white", "transition-all", "flex", "items-center", "justify-center", "shrink-0"], [1, "relative", "z-10", "p-6", "flex", "flex-col", "flex-1", "min-h-0"], [1, "flex-1", "flex", "items-center", "justify-center", "py-8"], ["diameter", "40", 1, "text-indigo-500"], [1, "flex", "flex-col", "md:flex-row", "gap-6", "flex-1", "min-h-0"], [1, "flex-1", "flex", "flex-col", "min-h-0", "bg-slate-900/60", "rounded-2xl", "border", "border-white/5", "p-4", "shadow-inner"], [1, "block", "text-[11px]", "font-black", "text-indigo-400/80", "uppercase", "tracking-widest", "mb-3", "shrink-0"], [1, "relative", "mb-3", "shrink-0"], [1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-400", "!text-[18px]"], ["placeholder", "Buscar categor\xEDa...", 1, "w-full", "bg-slate-950", "border", "border-white/10", "focus:border-indigo-500", "text-white", "rounded-xl", "pl-9", "pr-3", "py-2", "text-sm", "font-semibold", "outline-none", "transition-colors", "shadow-sm", 3, "ngModelChange", "ngModel"], [1, "absolute", "right-2", "top-1/2", "-translate-y-1/2", "text-slate-500", "hover:text-white"], [1, "flex-1", "overflow-y-auto", "custom-scrollbar", "space-y-1", "pr-1", "mb-3"], [1, "py-6", "text-center", "text-slate-500"], [1, "flex", "items-center", "gap-3", "p-2", "rounded-xl", "hover:bg-slate-800/80", "cursor-pointer", "transition-colors", "border", "border-transparent", "hover:border-white/5"], [1, "shrink-0", "flex", "items-center", "justify-center", "gap-2", "w-full", "py-2.5", "bg-gradient-to-r", "from-indigo-600", "to-violet-600", "hover:from-indigo-500", "hover:to-violet-500", "disabled:opacity-50", "disabled:grayscale", "text-white", "font-bold", "rounded-xl", "transition-all", "shadow-lg", "active:scale-95", 3, "click", "disabled"], [1, "!text-[18px]"], [1, "flex-1", "flex", "flex-col", "min-h-0", "bg-slate-900/40", "rounded-2xl", "border", "border-white/5", "p-4"], [1, "block", "text-[11px]", "font-black", "text-slate-500", "uppercase", "tracking-widest", "mb-3", "flex", "items-center", "justify-between", "shrink-0"], [1, "px-2", "py-0.5", "rounded-full", "bg-slate-800", "text-slate-300"], [1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-500", "!text-[18px]"], ["placeholder", "Filtrar asignadas...", 1, "w-full", "bg-slate-900/50", "border", "border-white/5", "focus:border-slate-500", "text-white", "rounded-xl", "pl-9", "pr-3", "py-2", "text-sm", "font-semibold", "outline-none", "transition-colors", 3, "ngModelChange", "ngModel"], [1, "flex-1", "overflow-y-auto", "pr-1", "custom-scrollbar", "space-y-2"], [1, "flex", "flex-col", "items-center", "justify-center", "py-10", "px-4", "text-center", "bg-slate-900/30", "rounded-xl", "border", "border-dashed", "border-white/5", "h-full"], [1, "absolute", "right-2", "top-1/2", "-translate-y-1/2", "text-slate-500", "hover:text-white", 3, "click"], [1, "!text-[16px]"], [1, "text-xs", "font-semibold"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "border-slate-700", "bg-slate-950", "text-indigo-500", "focus:ring-indigo-500", "focus:ring-offset-slate-900", 3, "change", "checked"], [1, "text-sm", "font-bold", "text-slate-300", "select-none"], [1, "!text-3xl", "text-slate-600", "mb-2"], [1, "text-xs", "text-slate-500", "font-bold"], [1, "flex", "items-center", "justify-between", "bg-slate-950/50", "hover:bg-slate-800", "border", "border-white/5", "rounded-xl", "p-3", "shadow-sm", "transition-all", "group"], [1, "flex", "items-center", "gap-3"], [1, "relative", "flex", "items-center", "justify-center", "w-2", "h-2"], [1, "absolute", "inset-0", "bg-emerald-500", "rounded-full", "animate-ping", "opacity-20"], [1, "relative", "w-1.5", "h-1.5", "rounded-full", "bg-emerald-500", "shadow-[0_0_8px_rgba(16,185,129,0.8)]"], [1, "font-bold", "text-xs", "text-slate-300", "group-hover:text-white", "transition-colors"], [1, "!w-7", "!h-7", "rounded-lg", "bg-slate-900", "flex", "items-center", "justify-center", "text-slate-500", "hover:text-red-400", "hover:bg-red-500/10", "transition-colors", "opacity-60", "group-hover:opacity-100", 3, "click", "disabled"]], template: function ClientCategoriesDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275element(1, "div", 1);
        \u0275\u0275elementStart(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "mat-icon", 5);
        \u0275\u0275text(6, "category");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div")(8, "h2", 6);
        \u0275\u0275text(9, "Categor\xEDas Cliente");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "p", 7);
        \u0275\u0275text(11);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(12, "button", 8)(13, "mat-icon");
        \u0275\u0275text(14, "close");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(15, "div", 9);
        \u0275\u0275template(16, ClientCategoriesDialogComponent_Conditional_16_Template, 2, 0, "div", 10)(17, ClientCategoriesDialogComponent_Conditional_17_Template, 30, 8);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(11);
        \u0275\u0275textInterpolate(ctx.data.cliente.nombre || ctx.data.cliente.cliente);
        \u0275\u0275advance(5);
        \u0275\u0275conditional(16, ctx.loading() ? 16 : 17);
      }
    }, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, MatDialogModule, MatDialogClose, MatButtonModule, MatIconButton, MatIconModule, MatIcon, MatSelectModule, MatProgressSpinnerModule, MatProgressSpinner], styles: ["\n\n.premium-dialog-panel[_ngcontent-%COMP%]   .mdc-dialog__surface[_ngcontent-%COMP%] {\n  background: transparent !important;\n  box-shadow: none !important;\n  padding: 0 !important;\n  border-radius: 1.5rem !important;\n}\n.custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 6px;\n}\n.custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: transparent;\n}\n.custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #334155;\n  border-radius: 4px;\n}\n.custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: #475569;\n}\n/*# sourceMappingURL=client-categories-dialog.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ClientCategoriesDialogComponent, { className: "ClientCategoriesDialogComponent", filePath: "src\\app\\features\\users\\client-categories-dialog.component.ts", lineNumber: 143 });
})();

export {
  ClientCategoriesDialogComponent
};
//# sourceMappingURL=chunk-G4SN7CSW.js.map
