import {
  require_maplibre_gl
} from "./chunk-Y5EJGXWO.js";
import {
  HasPermDirective
} from "./chunk-RNOX4RCL.js";
import {
  MatSnackBar,
  MatSnackBarModule
} from "./chunk-7QJW63DM.js";
import "./chunk-FAJEMXMR.js";
import {
  MatTooltip,
  MatTooltipModule
} from "./chunk-PBKBS7OR.js";
import "./chunk-CELNEZAJ.js";
import "./chunk-ABO6AUNU.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
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
  MatIcon,
  MatIconModule
} from "./chunk-KQNRR4FF.js";
import "./chunk-QGVFX6Y7.js";
import "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  CommonModule,
  NgClass,
  Subject,
  __spreadProps,
  __spreadValues,
  __toESM,
  computed,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
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
  ɵɵrepeaterTrackByIdentity,
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

// src/app/features/visits/points/points.component.ts
var import_maplibre_gl = __toESM(require_maplibre_gl());

// src/app/features/visits/points/catalogos.component.ts
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.id;
function CatalogosComponent_For_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 17);
    \u0275\u0275listener("click", function CatalogosComponent_For_4_Template_button_click_0_listener() {
      const t_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.switchTab(t_r2.key));
    });
    \u0275\u0275elementStart(1, "mat-icon", 18);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", ctx_r2.activeTab() === t_r2.key ? "bg-primary-600 text-white shadow-md" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r2.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", t_r2.label, " ");
  }
}
function CatalogosComponent_Conditional_13_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r5 = ctx.$implicit;
    \u0275\u0275property("ngValue", d_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r5.nombre);
  }
}
function CatalogosComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "label", 11);
    \u0275\u0275text(2, "Departamento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 19);
    \u0275\u0275twoWayListener("ngModelChange", function CatalogosComponent_Conditional_13_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.newCiudadDepId, $event) || (ctx_r2.newCiudadDepId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(4, "option", 20);
    \u0275\u0275text(5, "\u2014 Selecciona \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, CatalogosComponent_Conditional_13_For_7_Template, 2, 2, "option", 20, _forTrack1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.newCiudadDepId);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.departamentos());
  }
}
function CatalogosComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 14);
  }
}
function CatalogosComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 18);
    \u0275\u0275text(1, "add");
    \u0275\u0275elementEnd();
  }
}
function CatalogosComponent_Conditional_22_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r7 = ctx.$implicit;
    \u0275\u0275property("ngValue", d_r7.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r7.nombre);
  }
}
function CatalogosComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "mat-icon", 21);
    \u0275\u0275text(2, "filter_list");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 22);
    \u0275\u0275text(4, "Filtrar por departamento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "select", 23);
    \u0275\u0275twoWayListener("ngModelChange", function CatalogosComponent_Conditional_22_Template_select_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.filterDepId, $event) || (ctx_r2.filterDepId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function CatalogosComponent_Conditional_22_Template_select_ngModelChange_5_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.loadList());
    });
    \u0275\u0275elementStart(6, "option", 20);
    \u0275\u0275text(7, "Todos");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(8, CatalogosComponent_Conditional_22_For_9_Template, 2, 2, "option", 20, _forTrack1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.filterDepId);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.departamentos());
  }
}
function CatalogosComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275element(1, "mat-spinner", 24);
    \u0275\u0275elementStart(2, "p", 25);
    \u0275\u0275text(3, "Cargando\u2026");
    \u0275\u0275elementEnd()();
  }
}
function CatalogosComponent_Conditional_24_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 29);
    \u0275\u0275text(1, "Departamento");
    \u0275\u0275elementEnd();
  }
}
function CatalogosComponent_Conditional_24_For_13_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 37);
    \u0275\u0275twoWayListener("ngModelChange", function CatalogosComponent_Conditional_24_For_13_Conditional_2_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r2.editName, $event) || (ctx_r2.editName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.editName);
  }
}
function CatalogosComponent_Conditional_24_For_13_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 38);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r10.nombre);
  }
}
function CatalogosComponent_Conditional_24_For_13_Conditional_4_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r12 = ctx.$implicit;
    \u0275\u0275property("ngValue", d_r12.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r12.nombre);
  }
}
function CatalogosComponent_Conditional_24_For_13_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 40);
    \u0275\u0275twoWayListener("ngModelChange", function CatalogosComponent_Conditional_24_For_13_Conditional_4_Conditional_1_Template_select_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r2 = \u0275\u0275nextContext(4);
      \u0275\u0275twoWayBindingSet(ctx_r2.editDepId, $event) || (ctx_r2.editDepId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(1, CatalogosComponent_Conditional_24_For_13_Conditional_4_Conditional_1_For_2_Template, 2, 2, "option", 20, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.editDepId);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.departamentos());
  }
}
function CatalogosComponent_Conditional_24_For_13_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 41);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r10 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.asCiudad(item_r10).departamento_nombre || "\u2014");
  }
}
function CatalogosComponent_Conditional_24_For_13_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 32);
    \u0275\u0275template(1, CatalogosComponent_Conditional_24_For_13_Conditional_4_Conditional_1_Template, 3, 1, "select", 39)(2, CatalogosComponent_Conditional_24_For_13_Conditional_4_Conditional_2_Template, 2, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r10 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(1, ctx_r2.editingId() === item_r10.id ? 1 : 2);
  }
}
function CatalogosComponent_Conditional_24_For_13_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 42);
    \u0275\u0275listener("click", function CatalogosComponent_Conditional_24_For_13_Conditional_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r13);
      const item_r10 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.saveEdit(item_r10));
    });
    \u0275\u0275elementStart(1, "mat-icon", 43);
    \u0275\u0275text(2, "check");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(3, "button", 44);
    \u0275\u0275listener("click", function CatalogosComponent_Conditional_24_For_13_Conditional_10_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.cancelEdit());
    });
    \u0275\u0275elementStart(4, "mat-icon", 43);
    \u0275\u0275text(5, "close");
    \u0275\u0275elementEnd()();
  }
}
function CatalogosComponent_Conditional_24_For_13_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 45);
    \u0275\u0275listener("click", function CatalogosComponent_Conditional_24_For_13_Conditional_11_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r14);
      const item_r10 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.startEdit(item_r10));
    });
    \u0275\u0275elementStart(1, "mat-icon", 43);
    \u0275\u0275text(2, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(3, "button", 46);
    \u0275\u0275listener("click", function CatalogosComponent_Conditional_24_For_13_Conditional_11_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r14);
      const item_r10 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.remove(item_r10));
    });
    \u0275\u0275elementStart(4, "mat-icon", 43);
    \u0275\u0275text(5, "delete");
    \u0275\u0275elementEnd()();
  }
}
function CatalogosComponent_Conditional_24_For_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 31)(1, "td", 32);
    \u0275\u0275template(2, CatalogosComponent_Conditional_24_For_13_Conditional_2_Template, 1, 1, "input", 33)(3, CatalogosComponent_Conditional_24_For_13_Conditional_3_Template, 2, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, CatalogosComponent_Conditional_24_For_13_Conditional_4_Template, 3, 1, "td", 32);
    \u0275\u0275elementStart(5, "td", 32)(6, "button", 34);
    \u0275\u0275listener("click", function CatalogosComponent_Conditional_24_For_13_Template_button_click_6_listener() {
      const item_r10 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toggleActive(item_r10));
    });
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td", 35)(9, "div", 36);
    \u0275\u0275template(10, CatalogosComponent_Conditional_24_For_13_Conditional_10_Template, 6, 0)(11, CatalogosComponent_Conditional_24_For_13_Conditional_11_Template, 6, 0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const item_r10 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(2, ctx_r2.editingId() === item_r10.id ? 2 : 3);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(4, ctx_r2.activeTab() === "ciudades" ? 4 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("bg-emerald-100", item_r10.activo)("text-emerald-700", item_r10.activo)("bg-slate-100", !item_r10.activo)("text-slate-500", !item_r10.activo);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r10.activo ? "Activo" : "Inactivo", " ");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(10, ctx_r2.editingId() === item_r10.id ? 10 : 11);
  }
}
function CatalogosComponent_Conditional_24_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 47)(2, "div", 48)(3, "mat-icon", 49);
    \u0275\u0275text(4, "inbox");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 50);
    \u0275\u0275text(6, "Sin elementos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 51);
    \u0275\u0275text(8, "Agrega el primero arriba");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275attribute("colspan", ctx_r2.activeTab() === "ciudades" ? 4 : 3);
  }
}
function CatalogosComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26)(1, "table", 27)(2, "thead", 28)(3, "tr")(4, "th", 29);
    \u0275\u0275text(5, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, CatalogosComponent_Conditional_24_Conditional_6_Template, 2, 0, "th", 29);
    \u0275\u0275elementStart(7, "th", 29);
    \u0275\u0275text(8, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 30);
    \u0275\u0275text(10, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "tbody");
    \u0275\u0275repeaterCreate(12, CatalogosComponent_Conditional_24_For_13_Template, 12, 12, "tr", 31, _forTrack1);
    \u0275\u0275template(14, CatalogosComponent_Conditional_24_Conditional_14_Template, 9, 1, "tr");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275conditional(6, ctx_r2.activeTab() === "ciudades" ? 6 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r2.items());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(14, ctx_r2.items().length === 0 ? 14 : -1);
  }
}
var CatalogosComponent = class _CatalogosComponent {
  constructor() {
    this.api = inject(ApiService);
    this.snack = inject(MatSnackBar);
    this.tabs = [
      { key: "tipo-negocio", label: "Tipo de Negocio", icon: "category", hint: "Categorizaci\xF3n principal del establecimiento (antes Jerarqu\xEDa Nivel 2)" },
      { key: "subtipo-negocio", label: "Subtipo de Negocio", icon: "sell", hint: "Subcategor\xEDa del tipo de negocio (antes Jerarqu\xEDa Nivel 2_2)" },
      { key: "alcance", label: "Alcance", icon: "public", hint: "Alcance geogr\xE1fico/comercial del PDV" },
      { key: "canal-venta", label: "Canal de Venta", icon: "storefront", hint: "Clasificaci\xF3n del canal comercial" },
      { key: "departamentos", label: "Departamentos", icon: "map", hint: "Departamentos / regiones donde operan los PDV" },
      { key: "ciudades", label: "Ciudades", icon: "location_city", hint: "Ciudades asociadas a cada departamento" }
    ];
    this.activeTab = signal("tipo-negocio");
    this.loading = signal(false);
    this.saving = signal(false);
    this.items = signal([]);
    this.departamentos = signal([]);
    this.editingId = signal(null);
    this.editName = "";
    this.editDepId = null;
    this.newName = "";
    this.newCiudadDepId = null;
    this.filterDepId = null;
    this.currentTab = computed(() => this.tabs.find((t) => t.key === this.activeTab()));
    this.canAdd = computed(() => {
      if (!this.newName.trim())
        return false;
      if (this.activeTab() === "ciudades" && !this.newCiudadDepId)
        return false;
      return true;
    });
  }
  ngOnInit() {
    this.loadDepartamentos();
    this.loadList();
  }
  asCiudad(it) {
    return it;
  }
  switchTab(key) {
    this.activeTab.set(key);
    this.editingId.set(null);
    this.newName = "";
    this.filterDepId = null;
    this.loadList();
  }
  loadDepartamentos() {
    this.api.listCatalog("departamentos").subscribe({
      next: (d) => this.departamentos.set(d),
      error: () => {
      }
    });
  }
  loadList() {
    this.loading.set(true);
    if (this.activeTab() === "ciudades") {
      this.api.listCiudades(this.filterDepId ? { departamento_id: this.filterDepId } : {}).subscribe({
        next: (d) => {
          this.items.set(d);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.api.listCatalog(this.activeTab()).subscribe({
        next: (d) => {
          this.items.set(d);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }
  add() {
    if (!this.canAdd())
      return;
    this.saving.set(true);
    const nombre = this.newName.trim();
    const op = this.activeTab() === "ciudades" ? this.api.createCiudad({ nombre, departamento_id: this.newCiudadDepId }) : this.api.createCatalogItem(this.activeTab(), { nombre });
    op.subscribe({
      next: () => {
        this.saving.set(false);
        this.newName = "";
        if (this.activeTab() === "departamentos")
          this.loadDepartamentos();
        this.loadList();
        this.snack.open("Agregado", "OK", { duration: 2e3 });
      },
      error: (err) => {
        this.saving.set(false);
        this.snack.open(err?.error?.detail ?? "Error al agregar", "OK", { duration: 4e3 });
      }
    });
  }
  startEdit(item) {
    this.editingId.set(item.id);
    this.editName = item.nombre;
    if (this.activeTab() === "ciudades")
      this.editDepId = item.departamento_id;
  }
  cancelEdit() {
    this.editingId.set(null);
    this.editName = "";
    this.editDepId = null;
  }
  saveEdit(item) {
    const nombre = this.editName.trim();
    if (!nombre)
      return;
    const op = this.activeTab() === "ciudades" ? this.api.updateCiudad(item.id, { nombre, departamento_id: this.editDepId ?? void 0 }) : this.api.updateCatalogItem(this.activeTab(), item.id, { nombre });
    op.subscribe({
      next: () => {
        this.cancelEdit();
        if (this.activeTab() === "departamentos")
          this.loadDepartamentos();
        this.loadList();
        this.snack.open("Guardado", "OK", { duration: 2e3 });
      },
      error: (err) => this.snack.open(err?.error?.detail ?? "Error al guardar", "OK", { duration: 4e3 })
    });
  }
  toggleActive(item) {
    const nuevoEstado = !item.activo;
    const op = this.activeTab() === "ciudades" ? this.api.updateCiudad(item.id, { activo: nuevoEstado }) : this.api.updateCatalogItem(this.activeTab(), item.id, { activo: nuevoEstado });
    op.subscribe({
      next: () => this.loadList(),
      error: (err) => this.snack.open(err?.error?.detail ?? "Error al cambiar estado", "OK", { duration: 4e3 })
    });
  }
  remove(item) {
    if (!confirm(`\xBFEliminar "${item.nombre}"?`))
      return;
    const op = this.activeTab() === "ciudades" ? this.api.deleteCiudad(item.id) : this.api.deleteCatalogItem(this.activeTab(), item.id);
    op.subscribe({
      next: () => {
        if (this.activeTab() === "departamentos")
          this.loadDepartamentos();
        this.loadList();
        this.snack.open("Eliminado", "OK", { duration: 2e3 });
      },
      error: (err) => {
        const detail = err?.error?.detail;
        if (typeof detail === "object" && detail?.usage_count) {
          const msg = `${detail.message}

Ejemplos de PDV: ${(detail.sample_pdv_ids || []).join(", ")}

\xBFForzar eliminaci\xF3n de todos modos?`;
          if (confirm(msg))
            this.forceRemove(item);
        } else {
          this.snack.open(typeof detail === "string" ? detail : "Error al eliminar", "OK", { duration: 5e3 });
        }
      }
    });
  }
  forceRemove(item) {
    const op = this.activeTab() === "ciudades" ? this.api.deleteCiudad(item.id, true) : this.api.deleteCatalogItem(this.activeTab(), item.id, true);
    op.subscribe({
      next: () => {
        if (this.activeTab() === "departamentos")
          this.loadDepartamentos();
        this.loadList();
        this.snack.open("Eliminado (los PDV referenciados quedaron sin este valor)", "OK", { duration: 5e3 });
      },
      error: (err) => this.snack.open(err?.error?.detail ?? "Error al forzar eliminaci\xF3n", "OK", { duration: 4e3 })
    });
  }
  static {
    this.\u0275fac = function CatalogosComponent_Factory(t) {
      return new (t || _CatalogosComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CatalogosComponent, selectors: [["app-catalogos"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 25, vars: 9, consts: [[1, "space-y-5"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "p-2", "overflow-x-auto"], [1, "flex", "gap-1", "min-w-max"], [1, "flex", "items-center", "gap-2", "px-4", "py-2", "rounded-xl", "text-sm", "font-bold", "whitespace-nowrap", "transition-all", 3, "ngClass"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "p-5"], [1, "flex", "flex-col", "md:flex-row", "md:items-end", "gap-4", "md:gap-6"], [1, "flex-1"], [1, "text-xl", "font-black", "text-slate-900", "dark:text-white"], [1, "text-xs", "text-slate-500", "mt-1"], [1, "flex", "flex-col", "md:flex-row", "gap-3", "items-stretch", "md:items-end"], [1, "space-y-1"], [1, "text-[10px]", "font-black", "text-slate-500", "uppercase", "tracking-widest"], [1, "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-3", "py-2", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "w-full", "md:w-72", 3, "ngModelChange", "keyup.enter", "ngModel", "placeholder"], [1, "flex", "items-center", "gap-2", "px-5", "py-2", "bg-primary-600", "hover:bg-primary-500", "disabled:opacity-40", "text-white", "font-black", "rounded-xl", "text-sm", "shadow-lg", "transition-all", "active:scale-95", 3, "click", "disabled"], ["diameter", "14"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "p-4", "flex", "items-center", "gap-3"], [1, "flex", "flex-col", "items-center", "py-20", "gap-3"], [1, "flex", "items-center", "gap-2", "px-4", "py-2", "rounded-xl", "text-sm", "font-bold", "whitespace-nowrap", "transition-all", 3, "click", "ngClass"], [1, "!text-base"], [1, "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-3", "py-2", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "outline-none", 3, "ngModelChange", "ngModel"], [3, "ngValue"], [1, "text-primary-500", "!text-base"], [1, "text-xs", "font-black", "text-slate-500", "uppercase", "tracking-widest"], [1, "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-3", "py-1.5", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "outline-none", 3, "ngModelChange", "ngModel"], ["diameter", "40"], [1, "text-slate-400", "font-medium", "text-sm"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "overflow-hidden"], [1, "w-full", "text-left"], [1, "bg-slate-50", "dark:bg-slate-950/50", "border-b", "border-slate-100", "dark:border-white/5"], [1, "px-4", "py-3", "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest"], [1, "px-4", "py-3", "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest", "text-right"], [1, "border-b", "border-slate-100", "dark:border-white/5", "hover:bg-slate-50", "dark:hover:bg-white/5"], [1, "px-4", "py-3"], [1, "bg-slate-50", "dark:bg-slate-800", "border", "border-primary-500", "rounded-lg", "px-2", "py-1", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "outline-none", "w-full", 3, "ngModel"], [1, "text-[10px]", "font-black", "px-2", "py-1", "rounded-full", "uppercase", "tracking-wider", 3, "click"], [1, "px-4", "py-3", "text-right"], [1, "inline-flex", "items-center", "gap-1"], [1, "bg-slate-50", "dark:bg-slate-800", "border", "border-primary-500", "rounded-lg", "px-2", "py-1", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "outline-none", "w-full", 3, "ngModelChange", "ngModel"], [1, "font-semibold", "text-slate-800", "dark:text-white", "text-sm"], [1, "bg-slate-50", "dark:bg-slate-800", "border", "border-primary-500", "rounded-lg", "px-2", "py-1", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "outline-none", 3, "ngModel"], [1, "bg-slate-50", "dark:bg-slate-800", "border", "border-primary-500", "rounded-lg", "px-2", "py-1", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "outline-none", 3, "ngModelChange", "ngModel"], [1, "text-xs", "text-slate-500"], ["matTooltip", "Guardar", 1, "w-8", "h-8", "rounded-lg", "bg-emerald-500", "hover:bg-emerald-600", "text-white", "inline-flex", "items-center", "justify-center", 3, "click"], [1, "!text-sm"], ["matTooltip", "Cancelar", 1, "w-8", "h-8", "rounded-lg", "bg-slate-200", "dark:bg-white/5", "hover:bg-slate-300", "text-slate-600", "inline-flex", "items-center", "justify-center", 3, "click"], ["matTooltip", "Editar", 1, "w-8", "h-8", "rounded-lg", "bg-slate-100", "dark:bg-white/5", "hover:bg-primary-500", "text-slate-500", "hover:text-white", "inline-flex", "items-center", "justify-center", 3, "click"], ["matTooltip", "Eliminar", 1, "w-8", "h-8", "rounded-lg", "bg-slate-100", "dark:bg-white/5", "hover:bg-rose-500", "text-slate-500", "hover:text-white", "inline-flex", "items-center", "justify-center", 3, "click"], [1, "py-16", "text-center"], [1, "flex", "flex-col", "items-center", "gap-2", "opacity-40"], [1, "!text-4xl"], [1, "font-bold", "text-sm"], [1, "text-xs"]], template: function CatalogosComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275repeaterCreate(3, CatalogosComponent_For_4_Template, 4, 3, "button", 3, _forTrack0);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(5, "div", 4)(6, "div", 5)(7, "div", 6)(8, "h2", 7);
        \u0275\u0275text(9);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "p", 8);
        \u0275\u0275text(11);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "div", 9);
        \u0275\u0275template(13, CatalogosComponent_Conditional_13_Template, 8, 2, "div", 10);
        \u0275\u0275elementStart(14, "div", 10)(15, "label", 11);
        \u0275\u0275text(16, "Nuevo");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(17, "input", 12);
        \u0275\u0275twoWayListener("ngModelChange", function CatalogosComponent_Template_input_ngModelChange_17_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.newName, $event) || (ctx.newName = $event);
          return $event;
        });
        \u0275\u0275listener("keyup.enter", function CatalogosComponent_Template_input_keyup_enter_17_listener() {
          return ctx.add();
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(18, "button", 13);
        \u0275\u0275listener("click", function CatalogosComponent_Template_button_click_18_listener() {
          return ctx.add();
        });
        \u0275\u0275template(19, CatalogosComponent_Conditional_19_Template, 1, 0, "mat-spinner", 14)(20, CatalogosComponent_Conditional_20_Template, 2, 0);
        \u0275\u0275text(21, " Agregar ");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(22, CatalogosComponent_Conditional_22_Template, 10, 2, "div", 15)(23, CatalogosComponent_Conditional_23_Template, 4, 0, "div", 16)(24, CatalogosComponent_Conditional_24_Template, 15, 2);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.tabs);
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate(ctx.currentTab().label);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.currentTab().hint);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(13, ctx.activeTab() === "ciudades" ? 13 : -1);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.newName);
        \u0275\u0275property("placeholder", "Nombre de " + ctx.currentTab().label.toLowerCase());
        \u0275\u0275advance();
        \u0275\u0275property("disabled", !ctx.canAdd() || ctx.saving());
        \u0275\u0275advance();
        \u0275\u0275conditional(19, ctx.saving() ? 19 : 20);
        \u0275\u0275advance(3);
        \u0275\u0275conditional(22, ctx.activeTab() === "ciudades" ? 22 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(23, ctx.loading() ? 23 : 24);
      }
    }, dependencies: [CommonModule, NgClass, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, MatIconModule, MatIcon, MatSnackBarModule, MatProgressSpinnerModule, MatProgressSpinner, MatTooltipModule, MatTooltip], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CatalogosComponent, { className: "CatalogosComponent", filePath: "src\\app\\features\\visits\\points\\catalogos.component.ts", lineNumber: 192 });
})();

// src/app/features/visits/points/points.component.ts
var _forTrack02 = ($index, $item) => $item.id;
function PointsComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275text(2, " puntos en total ");
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.total());
  }
}
function PointsComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Gestiona los cat\xE1logos asociados a los PDV ");
  }
}
function PointsComponent_Conditional_18_button_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function PointsComponent_Conditional_18_button_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openPanel(null));
    });
    \u0275\u0275elementStart(1, "mat-icon", 7);
    \u0275\u0275text(2, "add_location_alt");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Nuevo PDV ");
    \u0275\u0275elementEnd();
  }
}
function PointsComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 10);
    \u0275\u0275listener("click", function PointsComponent_Conditional_18_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.loadAll());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "refresh");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(3, PointsComponent_Conditional_18_button_3_Template, 4, 0, "button", 11);
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("hasPerm", "points")("hasPermAction", "write");
  }
}
function PointsComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-catalogos");
  }
}
function PointsComponent_Conditional_20_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 29);
    \u0275\u0275listener("click", function PointsComponent_Conditional_20_Conditional_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.clearFilters());
    });
    \u0275\u0275elementStart(1, "mat-icon", 30);
    \u0275\u0275text(2, "close");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Limpiar ");
    \u0275\u0275elementEnd();
  }
}
function PointsComponent_Conditional_20_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r6 = ctx.$implicit;
    \u0275\u0275property("value", r_r6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r6);
  }
}
function PointsComponent_Conditional_20_For_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r7 = ctx.$implicit;
    \u0275\u0275property("value", c_r7);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r7);
  }
}
function PointsComponent_Conditional_20_For_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const j_r8 = ctx.$implicit;
    \u0275\u0275property("value", j_r8);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(j_r8);
  }
}
function PointsComponent_Conditional_20_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28);
    \u0275\u0275element(1, "mat-spinner", 31);
    \u0275\u0275elementStart(2, "p", 32);
    \u0275\u0275text(3, "Cargando directorio...");
    \u0275\u0275elementEnd()();
  }
}
function PointsComponent_Conditional_20_Conditional_49_For_24_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 59);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r10.cadena);
  }
}
function PointsComponent_Conditional_20_Conditional_49_For_24_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 65);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
  }
}
function PointsComponent_Conditional_20_Conditional_49_For_24_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 60);
    \u0275\u0275text(1);
    \u0275\u0275element(2, "br");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", p_r10.latitud, ",");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r10.longitud);
  }
}
function PointsComponent_Conditional_20_Conditional_49_For_24_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 66);
    \u0275\u0275text(1, "Sin coord.");
    \u0275\u0275elementEnd();
  }
}
function PointsComponent_Conditional_20_Conditional_49_For_24_button_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 67);
    \u0275\u0275listener("click", function PointsComponent_Conditional_20_Conditional_49_For_24_button_32_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const p_r10 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openPanel(p_r10));
    });
    \u0275\u0275elementStart(1, "mat-icon", 30);
    \u0275\u0275text(2, "edit");
    \u0275\u0275elementEnd()();
  }
}
function PointsComponent_Conditional_20_Conditional_49_For_24_button_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 68);
    \u0275\u0275listener("click", function PointsComponent_Conditional_20_Conditional_49_For_24_button_33_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r12);
      const p_r10 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.deletePoint(p_r10));
    });
    \u0275\u0275elementStart(1, "mat-icon", 30);
    \u0275\u0275text(2, "delete");
    \u0275\u0275elementEnd()();
  }
}
function PointsComponent_Conditional_20_Conditional_49_For_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 38)(1, "td", 47)(2, "span", 48);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 47)(5, "div", 49)(6, "div", 50)(7, "mat-icon", 51);
    \u0275\u0275text(8, "storefront");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 52);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "td", 53)(12, "span", 54);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td", 47)(15, "div", 55)(16, "span", 56);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 57);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "td", 58);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "td", 58);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "td", 47);
    \u0275\u0275template(25, PointsComponent_Conditional_20_Conditional_49_For_24_Conditional_25_Template, 2, 1, "span", 59)(26, PointsComponent_Conditional_20_Conditional_49_For_24_Conditional_26_Template, 2, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "td", 47);
    \u0275\u0275template(28, PointsComponent_Conditional_20_Conditional_49_For_24_Conditional_28_Template, 4, 2, "span", 60)(29, PointsComponent_Conditional_20_Conditional_49_For_24_Conditional_29_Template, 2, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "td", 61)(31, "div", 62);
    \u0275\u0275template(32, PointsComponent_Conditional_20_Conditional_49_For_24_button_32_Template, 3, 0, "button", 63)(33, PointsComponent_Conditional_20_Conditional_49_For_24_button_33_Template, 3, 0, "button", 64);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const p_r10 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r10.id);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(p_r10.nombre || "\u2014");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r10.direccion || "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r10.departamento || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r10.ciudad);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r10.jerarquia_n2 || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r10.jerarquia_n2_2 || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(25, p_r10.cadena ? 25 : 26);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(28, p_r10.latitud && p_r10.longitud ? 28 : 29);
    \u0275\u0275advance(4);
    \u0275\u0275property("hasPerm", "points")("hasPermAction", "write");
    \u0275\u0275advance();
    \u0275\u0275property("hasPerm", "points")("hasPermAction", "delete");
  }
}
function PointsComponent_Conditional_20_Conditional_49_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 69)(2, "div", 70)(3, "mat-icon", 71);
    \u0275\u0275text(4, "location_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 72);
    \u0275\u0275text(6, "No se encontraron puntos");
    \u0275\u0275elementEnd()()()();
  }
}
function PointsComponent_Conditional_20_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 33)(1, "table", 34)(2, "thead")(3, "tr", 35)(4, "th", 36);
    \u0275\u0275text(5, "Identificador");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 36);
    \u0275\u0275text(7, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 36);
    \u0275\u0275text(9, "Direcci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 36);
    \u0275\u0275text(11, "Dpto / Ciudad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 36);
    \u0275\u0275text(13, "Tipo Negocio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 36);
    \u0275\u0275text(15, "Subtipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 36);
    \u0275\u0275text(17, "Canal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th", 36);
    \u0275\u0275text(19, "Coord.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th", 37);
    \u0275\u0275text(21, "Acci\xF3n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "tbody");
    \u0275\u0275repeaterCreate(23, PointsComponent_Conditional_20_Conditional_49_For_24_Template, 34, 13, "tr", 38, _forTrack02);
    \u0275\u0275template(25, PointsComponent_Conditional_20_Conditional_49_Conditional_25_Template, 7, 0, "tr");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(26, "div", 39)(27, "div", 40)(28, "p", 41);
    \u0275\u0275text(29, " Mostrando ");
    \u0275\u0275elementStart(30, "span", 42);
    \u0275\u0275text(31);
    \u0275\u0275elementEnd();
    \u0275\u0275text(32, " de ");
    \u0275\u0275elementStart(33, "span", 42);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 21)(36, "select", 43);
    \u0275\u0275listener("ngModelChange", function PointsComponent_Conditional_20_Conditional_49_Template_select_ngModelChange_36_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onPageSizeChange($event));
    });
    \u0275\u0275elementStart(37, "option", 24);
    \u0275\u0275text(38, "100 / p\xE1g");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "option", 24);
    \u0275\u0275text(40, "200 / p\xE1g");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "option", 24);
    \u0275\u0275text(42, "500 / p\xE1g");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(43, "mat-icon", 44);
    \u0275\u0275text(44, "expand_more");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(45, "div", 45)(46, "button", 46);
    \u0275\u0275listener("click", function PointsComponent_Conditional_20_Conditional_49_Template_button_click_46_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.prevPage());
    });
    \u0275\u0275elementStart(47, "mat-icon", 7);
    \u0275\u0275text(48, "chevron_left");
    \u0275\u0275elementEnd();
    \u0275\u0275text(49, " Anterior ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "button", 46);
    \u0275\u0275listener("click", function PointsComponent_Conditional_20_Conditional_49_Template_button_click_50_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.nextPage());
    });
    \u0275\u0275text(51, " Siguiente ");
    \u0275\u0275elementStart(52, "mat-icon", 7);
    \u0275\u0275text(53, "chevron_right");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(23);
    \u0275\u0275repeater(ctx_r0.points());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(25, ctx_r0.points().length === 0 ? 25 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", ctx_r0.skip() + 1, "\u2013", ctx_r0.skip() + ctx_r0.points().length, "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.total());
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", ctx_r0.pageSize());
    \u0275\u0275advance();
    \u0275\u0275property("value", 100);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", 200);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", 500);
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", ctx_r0.skip() === 0);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r0.skip() + ctx_r0.pageSize() >= ctx_r0.total());
  }
}
function PointsComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 14)(2, "mat-icon", 15);
    \u0275\u0275text(3, "filter_list");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 16);
    \u0275\u0275text(5, "Filtros");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, PointsComponent_Conditional_20_Conditional_6_Template, 4, 0, "button", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 18)(8, "div", 19)(9, "label", 20);
    \u0275\u0275text(10, "Departamento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 21)(12, "select", 22);
    \u0275\u0275listener("ngModelChange", function PointsComponent_Conditional_20_Template_select_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onFilterRegionChange($event));
    });
    \u0275\u0275elementStart(13, "option", 23);
    \u0275\u0275text(14, "Todos");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(15, PointsComponent_Conditional_20_For_16_Template, 2, 2, "option", 24, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "mat-icon", 25);
    \u0275\u0275text(18, "expand_more");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 19)(20, "label", 20);
    \u0275\u0275text(21, "Ciudad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 21)(23, "select", 22);
    \u0275\u0275listener("ngModelChange", function PointsComponent_Conditional_20_Template_select_ngModelChange_23_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      ctx_r0.filterCiudad.set($event);
      return \u0275\u0275resetView(ctx_r0.reload());
    });
    \u0275\u0275elementStart(24, "option", 23);
    \u0275\u0275text(25, "Todas");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(26, PointsComponent_Conditional_20_For_27_Template, 2, 2, "option", 24, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "mat-icon", 25);
    \u0275\u0275text(29, "expand_more");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "div", 19)(31, "label", 20);
    \u0275\u0275text(32, "Tipo de Negocio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 21)(34, "select", 22);
    \u0275\u0275listener("ngModelChange", function PointsComponent_Conditional_20_Template_select_ngModelChange_34_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      ctx_r0.filterJerarquia.set($event);
      return \u0275\u0275resetView(ctx_r0.reload());
    });
    \u0275\u0275elementStart(35, "option", 23);
    \u0275\u0275text(36, "Todos");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(37, PointsComponent_Conditional_20_For_38_Template, 2, 2, "option", 24, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "mat-icon", 25);
    \u0275\u0275text(40, "expand_more");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(41, "div", 19)(42, "label", 20);
    \u0275\u0275text(43, "Buscar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "div", 21)(45, "mat-icon", 26);
    \u0275\u0275text(46, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "input", 27);
    \u0275\u0275listener("ngModelChange", function PointsComponent_Conditional_20_Template_input_ngModelChange_47_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSearch($event));
    });
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275template(48, PointsComponent_Conditional_20_Conditional_48_Template, 4, 0, "div", 28)(49, PointsComponent_Conditional_20_Conditional_49_Template, 54, 10);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275conditional(6, ctx_r0.filterRegion() || ctx_r0.filterCiudad() || ctx_r0.filterJerarquia() || ctx_r0.searchText() ? 6 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275property("ngModel", ctx_r0.filterRegion());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.regions());
    \u0275\u0275advance(8);
    \u0275\u0275property("ngModel", ctx_r0.filterCiudad());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.cities());
    \u0275\u0275advance(8);
    \u0275\u0275property("ngModel", ctx_r0.filterJerarquia());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.jerarquias());
    \u0275\u0275advance(10);
    \u0275\u0275property("ngModel", ctx_r0.searchText());
    \u0275\u0275advance();
    \u0275\u0275conditional(48, ctx_r0.loading() ? 48 : 49);
  }
}
function PointsComponent_Conditional_21_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 88);
    \u0275\u0275text(1, "Se genera seg\xFAn la jerarqu\xEDa del punto");
    \u0275\u0275elementEnd();
  }
}
function PointsComponent_Conditional_21_For_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "option", 24);
  }
  if (rf & 2) {
    const r_r14 = ctx.$implicit;
    \u0275\u0275property("value", r_r14);
  }
}
function PointsComponent_Conditional_21_For_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "option", 24);
  }
  if (rf & 2) {
    const c_r15 = ctx.$implicit;
    \u0275\u0275property("value", c_r15);
  }
}
function PointsComponent_Conditional_21_For_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "option", 24);
  }
  if (rf & 2) {
    const c_r16 = ctx.$implicit;
    \u0275\u0275property("value", c_r16);
  }
}
function PointsComponent_Conditional_21_For_62_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "option", 24);
  }
  if (rf & 2) {
    const j_r17 = ctx.$implicit;
    \u0275\u0275property("value", j_r17);
  }
}
function PointsComponent_Conditional_21_For_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "option", 24);
  }
  if (rf & 2) {
    const j_r18 = ctx.$implicit;
    \u0275\u0275property("value", j_r18);
  }
}
function PointsComponent_Conditional_21_For_76_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "option", 24);
  }
  if (rf & 2) {
    const n_r19 = ctx.$implicit;
    \u0275\u0275property("value", n_r19);
  }
}
function PointsComponent_Conditional_21_Conditional_104_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 115);
  }
}
function PointsComponent_Conditional_21_Conditional_105_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 7);
    \u0275\u0275text(1, "save");
    \u0275\u0275elementEnd();
  }
}
function PointsComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 73);
    \u0275\u0275listener("click", function PointsComponent_Conditional_21_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closePanel());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 74)(3, "div", 75)(4, "div", 76)(5, "div", 40)(6, "div", 77)(7, "mat-icon", 78);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div")(10, "h3", 79);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "p", 80);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "button", 81);
    \u0275\u0275listener("click", function PointsComponent_Conditional_21_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closePanel());
    });
    \u0275\u0275elementStart(15, "mat-icon", 82);
    \u0275\u0275text(16, "close");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(17, "div", 83)(18, "form", 84)(19, "div", 85)(20, "div", 86)(21, "label", 20);
    \u0275\u0275text(22, "Identificador *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(23, "input", 87);
    \u0275\u0275template(24, PointsComponent_Conditional_21_Conditional_24_Template, 2, 0, "p", 88);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 86)(26, "label", 20);
    \u0275\u0275text(27, "Nombre del Punto *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(28, "input", 89);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div", 86)(30, "label", 20);
    \u0275\u0275text(31, "Direcci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275element(32, "input", 90);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 91)(34, "div", 86)(35, "label", 20);
    \u0275\u0275text(36, "Departamento");
    \u0275\u0275elementEnd();
    \u0275\u0275element(37, "input", 92);
    \u0275\u0275elementStart(38, "datalist", 93);
    \u0275\u0275repeaterCreate(39, PointsComponent_Conditional_21_For_40_Template, 1, 1, "option", 24, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "div", 86)(42, "label", 20);
    \u0275\u0275text(43, "Ciudad");
    \u0275\u0275elementEnd();
    \u0275\u0275element(44, "input", 94);
    \u0275\u0275elementStart(45, "datalist", 95);
    \u0275\u0275repeaterCreate(46, PointsComponent_Conditional_21_For_47_Template, 1, 1, "option", 24, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(48, "div", 86)(49, "label", 20);
    \u0275\u0275text(50, "Canal de Venta");
    \u0275\u0275elementEnd();
    \u0275\u0275element(51, "input", 96);
    \u0275\u0275elementStart(52, "datalist", 97);
    \u0275\u0275repeaterCreate(53, PointsComponent_Conditional_21_For_54_Template, 1, 1, "option", 24, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(55, "div", 91)(56, "div", 86)(57, "label", 20);
    \u0275\u0275text(58, "Tipo de Negocio");
    \u0275\u0275elementEnd();
    \u0275\u0275element(59, "input", 98);
    \u0275\u0275elementStart(60, "datalist", 99);
    \u0275\u0275repeaterCreate(61, PointsComponent_Conditional_21_For_62_Template, 1, 1, "option", 24, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(63, "div", 86)(64, "label", 20);
    \u0275\u0275text(65, "Subtipo de Negocio");
    \u0275\u0275elementEnd();
    \u0275\u0275element(66, "input", 100);
    \u0275\u0275elementStart(67, "datalist", 101);
    \u0275\u0275repeaterCreate(68, PointsComponent_Conditional_21_For_69_Template, 1, 1, "option", 24, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(70, "div", 86)(71, "label", 20);
    \u0275\u0275text(72, "Alcance");
    \u0275\u0275elementEnd();
    \u0275\u0275element(73, "input", 102);
    \u0275\u0275elementStart(74, "datalist", 103);
    \u0275\u0275repeaterCreate(75, PointsComponent_Conditional_21_For_76_Template, 1, 1, "option", 24, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(77, "div", 85)(78, "div", 86)(79, "label", 20);
    \u0275\u0275text(80, "RIF");
    \u0275\u0275elementEnd();
    \u0275\u0275element(81, "input", 104);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(82, "div", 86)(83, "label", 20);
    \u0275\u0275text(84, "Radio (metros)");
    \u0275\u0275elementEnd();
    \u0275\u0275element(85, "input", 105);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(86, "div", 106)(87, "div", 85)(88, "div", 86)(89, "label", 20);
    \u0275\u0275text(90, "Latitud");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(91, "input", 107);
    \u0275\u0275listener("change", function PointsComponent_Conditional_21_Template_input_change_91_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.syncMapCenter());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(92, "div", 86)(93, "label", 20);
    \u0275\u0275text(94, "Longitud");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(95, "input", 108);
    \u0275\u0275listener("change", function PointsComponent_Conditional_21_Template_input_change_95_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.syncMapCenter());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(96, "div", 109);
    \u0275\u0275element(97, "div", 110);
    \u0275\u0275elementStart(98, "div", 111);
    \u0275\u0275text(99, " Haz clic para establecer coordenadas ");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(100, "div", 112)(101, "button", 113);
    \u0275\u0275listener("click", function PointsComponent_Conditional_21_Template_button_click_101_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closePanel());
    });
    \u0275\u0275text(102, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(103, "button", 114);
    \u0275\u0275listener("click", function PointsComponent_Conditional_21_Template_button_click_103_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.save());
    });
    \u0275\u0275template(104, PointsComponent_Conditional_21_Conditional_104_Template, 1, 0, "mat-spinner", 115)(105, PointsComponent_Conditional_21_Conditional_105_Template, 2, 0);
    \u0275\u0275text(106);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_7_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r0.editingId() ? "edit_location" : "add_location_alt");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.editingId() ? "Editar Punto de Inter\xE9s" : "Nuevo Punto de Inter\xE9s");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.editingId() || "Completa los datos del PDV");
    \u0275\u0275advance(5);
    \u0275\u0275property("formGroup", ctx_r0.form);
    \u0275\u0275advance(5);
    \u0275\u0275classProp("opacity-60", !!ctx_r0.editingId())("cursor-not-allowed", !!ctx_r0.editingId())("border-red-500", ((tmp_7_0 = ctx_r0.form.get("id")) == null ? null : tmp_7_0.invalid) && ((tmp_7_0 = ctx_r0.form.get("id")) == null ? null : tmp_7_0.touched));
    \u0275\u0275attribute("readonly", ctx_r0.editingId() ? true : null);
    \u0275\u0275advance();
    \u0275\u0275conditional(24, !ctx_r0.editingId() ? 24 : -1);
    \u0275\u0275advance(15);
    \u0275\u0275repeater(ctx_r0.regions());
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r0.cities());
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r0.chains());
    \u0275\u0275advance(8);
    \u0275\u0275repeater(ctx_r0.jerarquias());
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r0.jerarquias2());
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r0.nivelesAlcance());
    \u0275\u0275advance(28);
    \u0275\u0275property("disabled", ctx_r0.form.invalid || ctx_r0.saving());
    \u0275\u0275advance();
    \u0275\u0275conditional(104, ctx_r0.saving() ? 104 : 105);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.editingId() ? "Guardar Cambios" : "Crear PDV", " ");
  }
}
var PointsComponent = class _PointsComponent {
  constructor() {
    this.api = inject(ApiService);
    this.snack = inject(MatSnackBar);
    this.fb = inject(FormBuilder);
    this.view = signal("pdvs");
    this.loading = signal(false);
    this.saving = signal(false);
    this.panelOpen = signal(false);
    this.editingId = signal(null);
    this.points = signal([]);
    this.total = signal(0);
    this.skip = signal(0);
    this.pageSize = signal(100);
    this.regions = signal([]);
    this.cities = signal([]);
    this.chains = signal([]);
    this.jerarquias = signal([]);
    this.jerarquias2 = signal([]);
    this.nivelesAlcance = signal([]);
    this.filterRegion = signal("");
    this.filterCiudad = signal("");
    this.filterJerarquia = signal("");
    this.searchText = signal("");
    this.search$ = new Subject();
    this.mapInstance = null;
    this.mapMarker = null;
    this.form = this.fb.group({
      id: ["", Validators.required],
      nombre: ["", Validators.required],
      direccion: [""],
      departamento: [""],
      ciudad: [""],
      cadena: [""],
      jerarquia_n2: [""],
      jerarquia_n2_2: [""],
      nivel_de_alcance: [""],
      latitud: [""],
      longitud: [""],
      rif: [""],
      radio: [""]
    });
  }
  ngOnInit() {
    this.loadAll();
    this.loadDropdowns();
    this.search$.pipe(debounceTime(350), distinctUntilChanged()).subscribe(() => {
      this.skip.set(0);
      this.reload();
    });
    this.form.get("departamento")?.valueChanges.subscribe((dep) => {
      this.api.getCities(dep || void 0).subscribe({
        next: (d) => this.cities.set(d),
        error: () => {
        }
      });
    });
  }
  ngOnDestroy() {
    this.destroyMap();
  }
  filterParams() {
    return {
      region: this.filterRegion() || void 0,
      ciudad: this.filterCiudad() || void 0,
      jerarquia_n2: this.filterJerarquia() || void 0,
      search: this.searchText() || void 0
    };
  }
  loadAll() {
    this.loading.set(true);
    forkJoin({
      items: this.api.getPoints(__spreadProps(__spreadValues({}, this.filterParams()), { skip: this.skip(), limit: this.pageSize() })),
      count: this.api.getPointsCount(this.filterParams())
    }).subscribe({
      next: ({ items, count }) => {
        this.points.set(items);
        this.total.set(count.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  reload() {
    this.skip.set(0);
    this.loadAll();
  }
  loadDropdowns() {
    this.api.getRegions().subscribe({ next: (d) => this.regions.set(d), error: () => {
    } });
    this.api.getCities(this.filterRegion() || void 0).subscribe({ next: (d) => this.cities.set(d), error: () => {
    } });
    this.api.getChains().subscribe({ next: (d) => this.chains.set(d), error: () => {
    } });
    this.api.getJerarquiaN2().subscribe({ next: (d) => this.jerarquias.set(d), error: () => {
    } });
    this.api.getJerarquiaN2_2().subscribe({ next: (d) => this.jerarquias2.set(d), error: () => {
    } });
    this.api.getNivelesAlcance().subscribe({ next: (d) => this.nivelesAlcance.set(d), error: () => {
    } });
  }
  onSearch(val) {
    this.searchText.set(val);
    this.search$.next(val);
  }
  onFilterRegionChange(val) {
    this.filterRegion.set(val);
    this.filterCiudad.set("");
    this.api.getCities(val || void 0).subscribe({ next: (d) => this.cities.set(d), error: () => {
    } });
    this.reload();
  }
  clearFilters() {
    this.filterRegion.set("");
    this.filterCiudad.set("");
    this.filterJerarquia.set("");
    this.searchText.set("");
    this.api.getCities().subscribe({ next: (d) => this.cities.set(d), error: () => {
    } });
    this.reload();
  }
  prevPage() {
    this.skip.update((v) => Math.max(0, v - this.pageSize()));
    this.loadAll();
  }
  nextPage() {
    this.skip.update((v) => v + this.pageSize());
    this.loadAll();
  }
  onPageSizeChange(size) {
    this.pageSize.set(+size);
    this.skip.set(0);
    this.loadAll();
  }
  openPanel(p) {
    this.editingId.set(p?.id ?? null);
    this.form.reset({
      id: p?.id ?? "",
      nombre: p?.nombre ?? "",
      direccion: p?.direccion ?? "",
      departamento: p?.departamento ?? "",
      ciudad: p?.ciudad ?? "",
      cadena: p?.cadena ?? "",
      jerarquia_n2: p?.jerarquia_n2 ?? "",
      jerarquia_n2_2: p?.jerarquia_n2_2 ?? "",
      nivel_de_alcance: p?.nivel_de_alcance ?? "",
      latitud: p?.latitud ?? "",
      longitud: p?.longitud ?? "",
      rif: p?.rif ?? "",
      radio: p?.radio ?? ""
    });
    this.panelOpen.set(true);
    setTimeout(() => this.initMap(), 250);
  }
  closePanel() {
    this.destroyMap();
    this.panelOpen.set(false);
  }
  initMap() {
    const el = document.getElementById("punto-map");
    if (!el)
      return;
    this.destroyMap();
    const latStr = this.form.get("latitud")?.value?.trim() ?? "";
    const lngStr = this.form.get("longitud")?.value?.trim() ?? "";
    const hasCoords = latStr !== "" && lngStr !== "" && !isNaN(+latStr) && !isNaN(+lngStr);
    const lat = hasCoords ? +latStr : 10.48;
    const lng = hasCoords ? +lngStr : -66.9;
    const nombre = this.form.get("nombre")?.value || "PDV";
    this.mapInstance = new import_maplibre_gl.default.Map({
      container: el,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [lng, lat],
      zoom: hasCoords ? 15 : 7
    });
    this.mapInstance.addControl(new import_maplibre_gl.default.NavigationControl({ showCompass: false }), "top-right");
    if (hasCoords) {
      const popup = new import_maplibre_gl.default.Popup({ offset: 42, closeButton: false }).setHTML(this.popupHtml(nombre, latStr, lngStr));
      this.mapMarker = new import_maplibre_gl.default.Marker({ color: "#7c3aed", scale: 1.2 }).setLngLat([lng, lat]).setPopup(popup).addTo(this.mapInstance);
      this.mapMarker.togglePopup();
    }
    this.mapInstance.on("click", (e) => {
      const newLat = e.lngLat.lat.toFixed(6);
      const newLng = e.lngLat.lng.toFixed(6);
      this.form.patchValue({ latitud: newLat, longitud: newLng });
      const n = this.form.get("nombre")?.value || "PDV";
      if (this.mapMarker) {
        this.mapMarker.setLngLat([+newLng, +newLat]);
        this.mapMarker.getPopup()?.setHTML(this.popupHtml(n, newLat, newLng));
        if (!this.mapMarker.getPopup()?.isOpen())
          this.mapMarker.togglePopup();
      } else {
        const p = new import_maplibre_gl.default.Popup({ offset: 42, closeButton: false }).setHTML(this.popupHtml(n, newLat, newLng));
        this.mapMarker = new import_maplibre_gl.default.Marker({ color: "#7c3aed", scale: 1.2 }).setLngLat([+newLng, +newLat]).setPopup(p).addTo(this.mapInstance);
        this.mapMarker.togglePopup();
      }
    });
  }
  popupHtml(nombre, lat, lng) {
    return `<div style="font-family:system-ui,sans-serif;padding:2px 4px">
      <div style="font-weight:700;font-size:13px;color:#1e1b4b;margin-bottom:2px">${nombre}</div>
      <div style="font-family:monospace;font-size:11px;color:#6b7280">${lat}, ${lng}</div>
    </div>`;
  }
  syncMapCenter() {
    const latStr = this.form.get("latitud")?.value?.trim() ?? "";
    const lngStr = this.form.get("longitud")?.value?.trim() ?? "";
    if (!this.mapInstance || !latStr || !lngStr || isNaN(+latStr) || isNaN(+lngStr))
      return;
    const lat = +latStr;
    const lng = +lngStr;
    const nombre = this.form.get("nombre")?.value || "PDV";
    this.mapInstance.flyTo({ center: [lng, lat], zoom: 15, duration: 800 });
    if (this.mapMarker) {
      this.mapMarker.setLngLat([lng, lat]);
      this.mapMarker.getPopup()?.setHTML(this.popupHtml(nombre, latStr, lngStr));
    } else {
      const popup = new import_maplibre_gl.default.Popup({ offset: 42, closeButton: false }).setHTML(this.popupHtml(nombre, latStr, lngStr));
      this.mapMarker = new import_maplibre_gl.default.Marker({ color: "#7c3aed", scale: 1.2 }).setLngLat([lng, lat]).setPopup(popup).addTo(this.mapInstance);
      this.mapMarker.togglePopup();
    }
  }
  destroyMap() {
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
      this.mapMarker = null;
    }
  }
  deletePoint(p) {
    if (!confirm(`\xBFEliminar "${p.nombre || p.id}"? Esta acci\xF3n no se puede deshacer.`))
      return;
    this.api.deletePoint(p.id).subscribe({
      next: () => {
        this.loadAll();
        this.snack.open("PDV eliminado", "OK", { duration: 3e3 });
      },
      error: (err) => this.snack.open(err?.error?.detail ?? "Error al eliminar", "OK", { duration: 4e3 })
    });
  }
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const v = this.form.value;
    const payload = {
      nombre: v.nombre,
      direccion: v.direccion,
      departamento: v.departamento,
      ciudad: v.ciudad,
      cadena: v.cadena,
      jerarquia_n2: v.jerarquia_n2,
      jerarquia_n2_2: v.jerarquia_n2_2,
      nivel_de_alcance: v.nivel_de_alcance,
      latitud: v.latitud,
      longitud: v.longitud,
      rif: v.rif,
      radio: v.radio
    };
    const op = this.editingId() ? this.api.updatePoint(this.editingId(), payload) : this.api.createPoint(__spreadValues({ id: v.id }, payload));
    op.subscribe({
      next: () => {
        this.saving.set(false);
        this.closePanel();
        this.loadAll();
        this.snack.open(this.editingId() ? "PDV actualizado" : "PDV creado", "OK", { duration: 3e3 });
      },
      error: (err) => {
        this.saving.set(false);
        this.snack.open(err?.error?.detail ?? "Error al guardar", "OK", { duration: 4e3 });
      }
    });
  }
  static {
    this.\u0275fac = function PointsComponent_Factory(t) {
      return new (t || _PointsComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PointsComponent, selectors: [["app-points"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 22, vars: 16, consts: [[1, "space-y-6", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4"], [1, "text-3xl", "font-bold", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "flex", "items-center", "gap-2"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "rounded-xl", "p-1", "flex", "shadow-sm"], [1, "flex", "items-center", "gap-1.5", "px-3", "py-1.5", "rounded-lg", "text-xs", "font-black", "transition-all", 3, "click"], [1, "!text-base"], [1, "fixed", "inset-0", "z-50", "flex", "justify-end"], [1, "font-bold", "text-primary-500"], [1, "w-10", "h-10", "flex", "items-center", "justify-center", "rounded-xl", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "text-slate-500", "hover:text-primary-500", "transition-all", "shadow-sm", 3, "click"], ["class", "flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-xl shadow-lg transition-all active:scale-95 text-sm", 3, "click", 4, "hasPerm", "hasPermAction"], [1, "flex", "items-center", "gap-2", "px-5", "py-2.5", "bg-primary-600", "hover:bg-primary-500", "text-white", "font-black", "rounded-xl", "shadow-lg", "transition-all", "active:scale-95", "text-sm", 3, "click"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "p-5"], [1, "flex", "items-center", "gap-2", "mb-3"], [1, "!text-base", "text-primary-500"], [1, "text-xs", "font-black", "text-slate-500", "uppercase", "tracking-widest"], [1, "ml-auto", "flex", "items-center", "gap-1", "text-xs", "font-bold", "text-slate-400", "hover:text-rose-400", "transition-colors"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-3"], [1, "space-y-1"], [1, "text-[10px]", "font-black", "text-slate-500", "uppercase", "tracking-widest"], [1, "relative"], [1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "text-slate-800", "dark:text-white", "rounded-xl", "px-3", "py-2", "pr-8", "text-sm", "font-semibold", "appearance-none", "outline-none", "transition-colors", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "absolute", "right-2", "top-1/2", "-translate-y-1/2", "text-slate-400", "pointer-events-none", "!text-base"], [1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-400", "pointer-events-none", "!text-base"], ["placeholder", "Nombre o identificador...", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "pl-9", "pr-3", "py-2", "text-sm", "font-semibold", "outline-none", "transition-colors", 3, "ngModelChange", "ngModel"], [1, "flex", "flex-col", "items-center", "justify-center", "py-24", "gap-4"], [1, "ml-auto", "flex", "items-center", "gap-1", "text-xs", "font-bold", "text-slate-400", "hover:text-rose-400", "transition-colors", 3, "click"], [1, "!text-sm"], ["diameter", "48", "strokeWidth", "4"], [1, "text-slate-400", "font-medium"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "overflow-hidden", "overflow-x-auto"], [1, "w-full", "text-left", "border-collapse", "min-w-[900px]"], [1, "bg-slate-50", "dark:bg-slate-950/50", "border-b", "border-slate-100", "dark:border-white/5"], [1, "px-4", "py-4", "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest"], [1, "px-4", "py-4", "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest", "text-right"], [1, "border-b", "border-slate-100", "dark:border-white/5", "hover:bg-slate-50", "dark:hover:bg-white/5", "transition-colors"], [1, "flex", "items-center", "justify-between", "flex-wrap", "gap-3"], [1, "flex", "items-center", "gap-3"], [1, "text-sm", "text-slate-500"], [1, "font-bold", "text-slate-800", "dark:text-white"], [1, "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "text-slate-800", "dark:text-white", "rounded-xl", "px-3", "py-1.5", "pr-7", "text-sm", "font-bold", "appearance-none", "outline-none", "transition-colors", 3, "ngModelChange", "ngModel"], [1, "absolute", "right-1.5", "top-1/2", "-translate-y-1/2", "text-slate-500", "pointer-events-none", "!text-base"], [1, "flex", "gap-2"], [1, "flex", "items-center", "gap-1", "px-4", "py-2", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "hover:border-primary-500", "disabled:opacity-40", "text-slate-700", "dark:text-white", "rounded-xl", "text-sm", "font-bold", "transition-all", 3, "click", "disabled"], [1, "px-4", "py-3.5"], [1, "font-mono", "text-xs", "font-bold", "text-primary-600", "dark:text-primary-400", "bg-primary-50", "dark:bg-primary-900/20", "px-2", "py-1", "rounded-lg"], [1, "flex", "items-center", "gap-2.5"], [1, "w-8", "h-8", "rounded-lg", "bg-slate-100", "dark:bg-white/5", "flex", "items-center", "justify-center", "shrink-0"], [1, "!text-sm", "text-slate-500"], [1, "font-bold", "text-slate-800", "dark:text-white", "text-sm"], [1, "px-4", "py-3.5", "text-sm", "text-slate-500", "dark:text-slate-400", "max-w-[160px]"], [1, "line-clamp-2"], [1, "flex", "flex-col"], [1, "text-sm", "font-semibold", "text-slate-700", "dark:text-slate-300"], [1, "text-xs", "text-slate-400"], [1, "px-4", "py-3.5", "text-sm", "text-slate-500", "dark:text-slate-400"], [1, "text-xs", "font-bold", "px-2", "py-1", "rounded-full", "bg-slate-100", "dark:bg-white/5", "text-slate-600", "dark:text-slate-300"], [1, "font-mono", "text-[10px]", "text-slate-400", "leading-tight"], [1, "px-4", "py-3.5", "text-right"], [1, "inline-flex", "items-center", "gap-1"], ["matTooltip", "Editar", "class", "w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-primary-500 text-slate-500 dark:text-slate-400 hover:text-white inline-flex items-center justify-center transition-all", 3, "click", 4, "hasPerm", "hasPermAction"], ["matTooltip", "Eliminar", "class", "w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-rose-500 text-slate-500 dark:text-slate-400 hover:text-white inline-flex items-center justify-center transition-all", 3, "click", 4, "hasPerm", "hasPermAction"], [1, "text-slate-300", "dark:text-slate-600"], [1, "text-slate-300", "dark:text-slate-600", "text-xs"], ["matTooltip", "Editar", 1, "w-8", "h-8", "rounded-lg", "bg-slate-100", "dark:bg-white/5", "hover:bg-primary-500", "text-slate-500", "dark:text-slate-400", "hover:text-white", "inline-flex", "items-center", "justify-center", "transition-all", 3, "click"], ["matTooltip", "Eliminar", 1, "w-8", "h-8", "rounded-lg", "bg-slate-100", "dark:bg-white/5", "hover:bg-rose-500", "text-slate-500", "dark:text-slate-400", "hover:text-white", "inline-flex", "items-center", "justify-center", "transition-all", 3, "click"], ["colspan", "9", 1, "py-20", "text-center"], [1, "flex", "flex-col", "items-center", "gap-3", "opacity-40"], [1, "!text-5xl"], [1, "font-bold"], [1, "absolute", "inset-0", "bg-black/50", "backdrop-blur-sm", 3, "click"], [1, "relative", "w-full", "max-w-2xl", "bg-white", "dark:bg-slate-900", "border-l", "border-slate-200", "dark:border-white/8", "h-full", "flex", "flex-col", "shadow-2xl", "overflow-hidden"], [1, "bg-slate-50", "dark:bg-slate-800/60", "border-b", "border-slate-200", "dark:border-white/8", "px-6", "py-5", "shrink-0"], [1, "flex", "items-center", "justify-between"], [1, "w-10", "h-10", "rounded-xl", "bg-primary-600", "flex", "items-center", "justify-center"], [1, "text-white", "!text-xl"], [1, "font-black", "text-slate-900", "dark:text-white"], [1, "text-xs", "text-slate-500", "font-mono"], [1, "w-9", "h-9", "rounded-xl", "bg-slate-200", "dark:bg-white/10", "hover:bg-slate-300", "dark:hover:bg-white/15", "flex", "items-center", "justify-center", "text-slate-500", "dark:text-slate-400", "transition-all", 3, "click"], [1, "!text-lg"], [1, "flex-1", "overflow-y-auto", "px-6", "py-6"], [1, "space-y-5", 3, "formGroup"], [1, "grid", "grid-cols-2", "gap-4"], [1, "space-y-1.5"], ["formControlName", "id", "placeholder", "Ej: AKT0006_1", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-mono", "font-bold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "transition-colors"], [1, "text-[10px]", "text-slate-400"], ["formControlName", "nombre", "placeholder", "Nombre del establecimiento", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "transition-colors"], ["formControlName", "direccion", "placeholder", "Direcci\xF3n completa", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "transition-colors"], [1, "grid", "grid-cols-3", "gap-4"], ["formControlName", "departamento", "placeholder", "Ej: Zulia", "list", "dept-list", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "transition-colors"], ["id", "dept-list"], ["formControlName", "ciudad", "placeholder", "Ej: Maracaibo", "list", "city-list", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "transition-colors"], ["id", "city-list"], ["formControlName", "cadena", "placeholder", "Ej: Moderno", "list", "canal-list", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "transition-colors"], ["id", "canal-list"], ["formControlName", "jerarquia_n2", "placeholder", "Ej: Supermercado", "list", "jn2-list", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "transition-colors"], ["id", "jn2-list"], ["formControlName", "jerarquia_n2_2", "placeholder", "Ej: Alkosto", "list", "jn22-list", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "transition-colors"], ["id", "jn22-list"], ["formControlName", "nivel_de_alcance", "placeholder", "Ej: Regional", "list", "alcance-list", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "transition-colors"], ["id", "alcance-list"], ["formControlName", "rif", "placeholder", "Ej: J-12345678-9", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "transition-colors"], ["formControlName", "radio", "placeholder", "100", "type", "number", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "transition-colors"], [1, "space-y-3"], ["formControlName", "latitud", "placeholder", "Ej: 10.481910", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-mono", "font-semibold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "transition-colors", 3, "change"], ["formControlName", "longitud", "placeholder", "Ej: -66.903606", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-mono", "font-semibold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "transition-colors", 3, "change"], [1, "rounded-xl", "overflow-hidden", "border", "border-slate-200", "dark:border-slate-700", "relative", 2, "height", "280px"], ["id", "punto-map", 1, "w-full", "h-full"], [1, "absolute", "bottom-2", "left-2", "bg-white/90", "dark:bg-slate-900/90", "backdrop-blur", "text-[10px]", "text-slate-500", "font-semibold", "px-2", "py-1", "rounded-lg", "pointer-events-none"], [1, "px-6", "py-5", "border-t", "border-slate-200", "dark:border-white/8", "shrink-0", "flex", "gap-3"], ["type", "button", 1, "flex-1", "py-2.5", "border", "border-slate-300", "dark:border-slate-700", "text-slate-600", "dark:text-slate-400", "hover:text-slate-900", "dark:hover:text-white", "rounded-xl", "font-bold", "text-sm", "transition-all", 3, "click"], ["type", "button", 1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-2.5", "bg-primary-600", "hover:bg-primary-500", "disabled:opacity-50", "text-white", "font-black", "rounded-xl", "text-sm", "shadow-lg", "transition-all", "active:scale-95", 3, "click", "disabled"], ["diameter", "16"]], template: function PointsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
        \u0275\u0275text(4, "Puntos de Venta");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p", 3);
        \u0275\u0275template(6, PointsComponent_Conditional_6_Template, 3, 1)(7, PointsComponent_Conditional_7_Template, 1, 0);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "div", 4)(9, "div", 5)(10, "button", 6);
        \u0275\u0275listener("click", function PointsComponent_Template_button_click_10_listener() {
          return ctx.view.set("pdvs");
        });
        \u0275\u0275elementStart(11, "mat-icon", 7);
        \u0275\u0275text(12, "storefront");
        \u0275\u0275elementEnd();
        \u0275\u0275text(13, " PDVs ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "button", 6);
        \u0275\u0275listener("click", function PointsComponent_Template_button_click_14_listener() {
          return ctx.view.set("catalogos");
        });
        \u0275\u0275elementStart(15, "mat-icon", 7);
        \u0275\u0275text(16, "tune");
        \u0275\u0275elementEnd();
        \u0275\u0275text(17, " Cat\xE1logos ");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(18, PointsComponent_Conditional_18_Template, 4, 2);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(19, PointsComponent_Conditional_19_Template, 1, 0, "app-catalogos")(20, PointsComponent_Conditional_20_Template, 50, 6);
        \u0275\u0275elementEnd();
        \u0275\u0275template(21, PointsComponent_Conditional_21_Template, 107, 15, "div", 8);
      }
      if (rf & 2) {
        \u0275\u0275advance(6);
        \u0275\u0275conditional(6, ctx.view() === "pdvs" ? 6 : 7);
        \u0275\u0275advance(4);
        \u0275\u0275classProp("bg-primary-600", ctx.view() === "pdvs")("text-white", ctx.view() === "pdvs")("text-slate-500", ctx.view() !== "pdvs");
        \u0275\u0275advance(4);
        \u0275\u0275classProp("bg-primary-600", ctx.view() === "catalogos")("text-white", ctx.view() === "catalogos")("text-slate-500", ctx.view() !== "catalogos");
        \u0275\u0275advance(4);
        \u0275\u0275conditional(18, ctx.view() === "pdvs" ? 18 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(19, ctx.view() === "catalogos" ? 19 : 20);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(21, ctx.panelOpen() ? 21 : -1);
      }
    }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, ReactiveFormsModule, FormGroupDirective, FormControlName, MatIconModule, MatIcon, MatSnackBarModule, MatProgressSpinnerModule, MatProgressSpinner, MatTooltipModule, MatTooltip, CatalogosComponent, HasPermDirective], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PointsComponent, { className: "PointsComponent", filePath: "src\\app\\features\\visits\\points\\points.component.ts", lineNumber: 400 });
})();
export {
  PointsComponent
};
//# sourceMappingURL=chunk-FKYJCO2K.js.map
