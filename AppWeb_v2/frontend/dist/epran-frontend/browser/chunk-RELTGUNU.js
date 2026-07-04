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
  CheckboxControlValueAccessor,
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
  debounceTime,
  distinctUntilChanged,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
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

// src/app/features/products/products.component.ts
var _forTrack0 = ($index, $item) => $item.id_categoria;
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.id_subcategoria;
var _forTrack3 = ($index, $item) => $item.key;
function ProductsComponent_button_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 25);
    \u0275\u0275listener("click", function ProductsComponent_button_15_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openCatalogPanel());
    });
    \u0275\u0275elementStart(1, "mat-icon", 26);
    \u0275\u0275text(2, "tune");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Cat\xE1logos ");
    \u0275\u0275elementEnd();
  }
}
function ProductsComponent_button_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function ProductsComponent_button_16_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openPanel(null));
    });
    \u0275\u0275elementStart(1, "mat-icon", 26);
    \u0275\u0275text(2, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Nuevo Producto ");
    \u0275\u0275elementEnd();
  }
}
function ProductsComponent_For_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r4 = ctx.$implicit;
    \u0275\u0275property("ngValue", c_r4.id_categoria);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r4.nombre);
  }
}
function ProductsComponent_For_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r5 = ctx.$implicit;
    \u0275\u0275property("ngValue", m_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(m_r5.nombre);
  }
}
function ProductsComponent_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 28);
    \u0275\u0275listener("click", function ProductsComponent_Conditional_38_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clearFilters());
    });
    \u0275\u0275elementStart(1, "mat-icon", 26);
    \u0275\u0275text(2, "close");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Limpiar ");
    \u0275\u0275elementEnd();
  }
}
function ProductsComponent_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275element(1, "mat-spinner", 29);
    \u0275\u0275elementEnd();
  }
}
function ProductsComponent_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "div", 31)(2, "mat-icon", 32);
    \u0275\u0275text(3, "inventory_2");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "p", 33);
    \u0275\u0275text(5, "No se encontraron productos");
    \u0275\u0275elementEnd()();
  }
}
function ProductsComponent_Conditional_42_For_22_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 49)(1, "mat-icon", 53);
    \u0275\u0275text(2, "all_inclusive");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " S\xED ");
    \u0275\u0275elementEnd();
  }
}
function ProductsComponent_Conditional_42_For_22_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275text(1, "No");
    \u0275\u0275elementEnd();
  }
}
function ProductsComponent_Conditional_42_For_22_button_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 55);
    \u0275\u0275listener("click", function ProductsComponent_Conditional_42_For_22_button_25_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const p_r9 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openPanel(p_r9));
    });
    \u0275\u0275elementStart(1, "mat-icon", 26);
    \u0275\u0275text(2, "edit");
    \u0275\u0275elementEnd()();
  }
}
function ProductsComponent_Conditional_42_For_22_button_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 56);
    \u0275\u0275listener("click", function ProductsComponent_Conditional_42_For_22_button_26_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const p_r9 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteProducto(p_r9));
    });
    \u0275\u0275elementStart(1, "mat-icon", 26);
    \u0275\u0275text(2, "delete");
    \u0275\u0275elementEnd()();
  }
}
function ProductsComponent_Conditional_42_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36)(1, "div", 42)(2, "div", 43)(3, "mat-icon", 44);
    \u0275\u0275text(4, "inventory_2");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "p", 45);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "span", 46);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 47);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 47);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 47);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 47);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 47);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 47);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 48);
    \u0275\u0275template(22, ProductsComponent_Conditional_42_For_22_Conditional_22_Template, 4, 0, "span", 49)(23, ProductsComponent_Conditional_42_For_22_Conditional_23_Template, 2, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 50);
    \u0275\u0275template(25, ProductsComponent_Conditional_42_For_22_button_25_Template, 3, 0, "button", 51)(26, ProductsComponent_Conditional_42_For_22_button_26_Template, 3, 0, "button", 52);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r9 = ctx.$implicit;
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(p_r9.producto_gu || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r9.cod_prod || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r9.departamento || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r9.categoria || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r9.subcategoria || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r9.marca || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r9.presentacion || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r9.tamano || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(22, p_r9.inagotable ? 22 : 23);
    \u0275\u0275advance(3);
    \u0275\u0275property("hasPerm", "products")("hasPermAction", "write");
    \u0275\u0275advance();
    \u0275\u0275property("hasPerm", "products")("hasPermAction", "delete");
  }
}
function ProductsComponent_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 34)(1, "div", 35)(2, "span");
    \u0275\u0275text(3, "Producto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "C\xF3d. Barras");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7, "Departamento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span");
    \u0275\u0275text(9, "Categor\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span");
    \u0275\u0275text(11, "Subcategor\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13, "Marca");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15, "Presentaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span");
    \u0275\u0275text(17, "Tama\xF1o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span");
    \u0275\u0275text(19, "Inagotable");
    \u0275\u0275elementEnd();
    \u0275\u0275element(20, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(21, ProductsComponent_Conditional_42_For_22_Template, 27, 13, "div", 36, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "div", 37)(24, "p", 38);
    \u0275\u0275text(25, "Mostrando ");
    \u0275\u0275elementStart(26, "span", 39);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd();
    \u0275\u0275text(28, " de ");
    \u0275\u0275elementStart(29, "span", 39);
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div", 40)(32, "button", 41);
    \u0275\u0275listener("click", function ProductsComponent_Conditional_42_Template_button_click_32_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.prevPage());
    });
    \u0275\u0275elementStart(33, "mat-icon", 26);
    \u0275\u0275text(34, "chevron_left");
    \u0275\u0275elementEnd();
    \u0275\u0275text(35, " Anterior");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "button", 41);
    \u0275\u0275listener("click", function ProductsComponent_Conditional_42_Template_button_click_36_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nextPage());
    });
    \u0275\u0275text(37, "Siguiente ");
    \u0275\u0275elementStart(38, "mat-icon", 26);
    \u0275\u0275text(39, "chevron_right");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(21);
    \u0275\u0275repeater(ctx_r1.productos());
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", ctx_r1.skipVal() + 1, "\u2013", ctx_r1.skipVal() + ctx_r1.productos().length, "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.total());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.skipVal() === 0);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r1.skipVal() + ctx_r1.pageSize >= ctx_r1.total());
  }
}
function ProductsComponent_Conditional_43_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 70);
    \u0275\u0275text(1, "El nombre es requerido");
    \u0275\u0275elementEnd();
  }
}
function ProductsComponent_Conditional_43_For_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 18);
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
function ProductsComponent_Conditional_43_For_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r13 = ctx.$implicit;
    \u0275\u0275property("ngValue", c_r13.id_categoria);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r13.nombre);
  }
}
function ProductsComponent_Conditional_43_For_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r14 = ctx.$implicit;
    \u0275\u0275property("ngValue", s_r14.id_subcategoria);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r14.nombre);
  }
}
function ProductsComponent_Conditional_43_For_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r15 = ctx.$implicit;
    \u0275\u0275property("ngValue", m_r15.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(m_r15.nombre);
  }
}
function ProductsComponent_Conditional_43_For_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pr_r16 = ctx.$implicit;
    \u0275\u0275property("ngValue", pr_r16.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(pr_r16.nombre);
  }
}
function ProductsComponent_Conditional_43_For_75_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r17 = ctx.$implicit;
    \u0275\u0275property("ngValue", t_r17.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r17.nombre);
  }
}
function ProductsComponent_Conditional_43_Conditional_102_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 90);
  }
}
function ProductsComponent_Conditional_43_Conditional_103_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 26);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.editingId() ? "save" : "add");
  }
}
function ProductsComponent_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23)(1, "div", 57);
    \u0275\u0275listener("click", function ProductsComponent_Conditional_43_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closePanel());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 58)(3, "div", 59)(4, "div", 9)(5, "div", 60)(6, "mat-icon", 61);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div")(9, "h3", 62);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "p", 63);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "button", 64);
    \u0275\u0275listener("click", function ProductsComponent_Conditional_43_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closePanel());
    });
    \u0275\u0275elementStart(14, "mat-icon", 65);
    \u0275\u0275text(15, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "form", 66)(17, "div", 67)(18, "label", 68);
    \u0275\u0275text(19, "Nombre del producto *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(20, "input", 69);
    \u0275\u0275template(21, ProductsComponent_Conditional_43_Conditional_21_Template, 2, 0, "p", 70);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 67)(23, "label", 68);
    \u0275\u0275text(24, "C\xF3digo de barras / SKU");
    \u0275\u0275elementEnd();
    \u0275\u0275element(25, "input", 71);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 67)(27, "label", 68);
    \u0275\u0275text(28, "Departamento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "select", 72);
    \u0275\u0275listener("change", function ProductsComponent_Conditional_43_Template_select_change_29_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onDepartamentoChange());
    });
    \u0275\u0275elementStart(30, "option", 18);
    \u0275\u0275text(31, "\u2014 Selecciona \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(32, ProductsComponent_Conditional_43_For_33_Template, 2, 2, "option", 18, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "div", 73)(35, "div", 67)(36, "label", 68);
    \u0275\u0275text(37, "Categor\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "select", 74);
    \u0275\u0275listener("change", function ProductsComponent_Conditional_43_Template_select_change_38_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onCategoriaChange());
    });
    \u0275\u0275elementStart(39, "option", 18);
    \u0275\u0275text(40, "\u2014 Selecciona \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(41, ProductsComponent_Conditional_43_For_42_Template, 2, 2, "option", 18, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(43, "div", 67)(44, "label", 68);
    \u0275\u0275text(45, "Subcategor\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "select", 75)(47, "option", 18);
    \u0275\u0275text(48, "\u2014 Selecciona \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(49, ProductsComponent_Conditional_43_For_50_Template, 2, 2, "option", 18, _forTrack2);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(51, "div", 73)(52, "div", 67)(53, "label", 68);
    \u0275\u0275text(54, "Marca / Fabricante");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "select", 76)(56, "option", 18);
    \u0275\u0275text(57, "\u2014 Selecciona \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(58, ProductsComponent_Conditional_43_For_59_Template, 2, 2, "option", 18, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(60, "div", 67)(61, "label", 68);
    \u0275\u0275text(62, "Presentaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "select", 77)(64, "option", 18);
    \u0275\u0275text(65, "\u2014 Selecciona \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(66, ProductsComponent_Conditional_43_For_67_Template, 2, 2, "option", 18, _forTrack1);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(68, "div", 67)(69, "label", 68);
    \u0275\u0275text(70, "Tama\xF1o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "select", 78)(72, "option", 18);
    \u0275\u0275text(73, "\u2014 Selecciona \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(74, ProductsComponent_Conditional_43_For_75_Template, 2, 2, "option", 18, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(76, "div", 73)(77, "div", 67)(78, "label", 68);
    \u0275\u0275text(79, "Descripci\xF3n BI");
    \u0275\u0275elementEnd();
    \u0275\u0275element(80, "input", 79);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(81, "div", 67)(82, "label", 68);
    \u0275\u0275text(83, "Gramos");
    \u0275\u0275elementEnd();
    \u0275\u0275element(84, "input", 80);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(85, "div", 67)(86, "label", 68);
    \u0275\u0275text(87, "Inagotable");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "label", 81);
    \u0275\u0275element(89, "input", 82);
    \u0275\u0275elementStart(90, "div", 83);
    \u0275\u0275element(91, "div", 84);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "span", 85);
    \u0275\u0275text(93);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(94, "div", 67)(95, "label", 68);
    \u0275\u0275text(96, "Comentario");
    \u0275\u0275elementEnd();
    \u0275\u0275element(97, "textarea", 86);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(98, "div", 87)(99, "button", 88);
    \u0275\u0275listener("click", function ProductsComponent_Conditional_43_Template_button_click_99_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closePanel());
    });
    \u0275\u0275text(100, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(101, "button", 89);
    \u0275\u0275listener("click", function ProductsComponent_Conditional_43_Template_button_click_101_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveProducto());
    });
    \u0275\u0275template(102, ProductsComponent_Conditional_43_Conditional_102_Template, 1, 0, "mat-spinner", 90)(103, ProductsComponent_Conditional_43_Conditional_103_Template, 2, 1);
    \u0275\u0275text(104);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_6_0;
    let tmp_19_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.editingId() ? "edit" : "add_circle");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.editingId() ? "Editar Producto" : "Nuevo Producto");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.editingId() ? "Modifica los datos" : "Agrega al cat\xE1logo");
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r1.form);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("border-red-600", ((tmp_5_0 = ctx_r1.form.get("producto_gu")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx_r1.form.get("producto_gu")) == null ? null : tmp_5_0.touched));
    \u0275\u0275advance();
    \u0275\u0275conditional(21, ((tmp_6_0 = ctx_r1.form.get("producto_gu")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx_r1.form.get("producto_gu")) == null ? null : tmp_6_0.touched) ? 21 : -1);
    \u0275\u0275advance(9);
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.departamentosList());
    \u0275\u0275advance(7);
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.catsFiltradas());
    \u0275\u0275advance(6);
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.subcatsFiltradas());
    \u0275\u0275advance(7);
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.marcasList());
    \u0275\u0275advance(6);
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.presentacionesList());
    \u0275\u0275advance(6);
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.tamanosList());
    \u0275\u0275advance(19);
    \u0275\u0275textInterpolate(((tmp_19_0 = ctx_r1.form.get("inagotable")) == null ? null : tmp_19_0.value) ? "S\xED \u2014 el producto nunca se agota" : "No \u2014 stock normal");
    \u0275\u0275advance(8);
    \u0275\u0275property("disabled", ctx_r1.form.invalid || ctx_r1.saving());
    \u0275\u0275advance();
    \u0275\u0275conditional(102, ctx_r1.saving() ? 102 : 103);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingId() ? "Guardar Cambios" : "Crear Producto", " ");
  }
}
function ProductsComponent_Conditional_44_For_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 104);
    \u0275\u0275listener("click", function ProductsComponent_Conditional_44_For_19_Template_button_click_0_listener() {
      const t_r20 = \u0275\u0275restoreView(_r19).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setTab(t_r20.key));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r20 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", ctx_r1.catTab() === t_r20.key ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r20.label);
  }
}
function ProductsComponent_Conditional_44_Conditional_26_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r22 = ctx.$implicit;
    \u0275\u0275property("ngValue", d_r22.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r22.nombre);
  }
}
function ProductsComponent_Conditional_44_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 105);
    \u0275\u0275twoWayListener("ngModelChange", function ProductsComponent_Conditional_44_Conditional_26_Template_select_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r21);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newParent, $event) || (ctx_r1.newParent = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(1, "option", 18);
    \u0275\u0275text(2, "Departamento\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, ProductsComponent_Conditional_44_Conditional_26_For_4_Template, 2, 2, "option", 18, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newParent);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.departamentosList());
  }
}
function ProductsComponent_Conditional_44_Conditional_27_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r24 = ctx.$implicit;
    \u0275\u0275property("ngValue", c_r24.id_categoria);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r24.nombre);
  }
}
function ProductsComponent_Conditional_44_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 105);
    \u0275\u0275twoWayListener("ngModelChange", function ProductsComponent_Conditional_44_Conditional_27_Template_select_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r23);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newParent, $event) || (ctx_r1.newParent = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(1, "option", 18);
    \u0275\u0275text(2, "Categor\xEDa\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, ProductsComponent_Conditional_44_Conditional_27_For_4_Template, 2, 2, "option", 18, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newParent);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.catList());
  }
}
function ProductsComponent_Conditional_44_Conditional_28_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pr_r26 = ctx.$implicit;
    \u0275\u0275property("ngValue", pr_r26.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(pr_r26.nombre);
  }
}
function ProductsComponent_Conditional_44_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 105);
    \u0275\u0275twoWayListener("ngModelChange", function ProductsComponent_Conditional_44_Conditional_28_Template_select_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r25);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newParent, $event) || (ctx_r1.newParent = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(1, "option", 18);
    \u0275\u0275text(2, "Productora (opcional)\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, ProductsComponent_Conditional_44_Conditional_28_For_4_Template, 2, 2, "option", 18, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newParent);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.productorasList());
  }
}
function ProductsComponent_Conditional_44_For_33_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 108);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const it_r28 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("(", it_r28.extra, ")");
  }
}
function ProductsComponent_Conditional_44_For_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 102)(1, "div", 106)(2, "span", 107);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, ProductsComponent_Conditional_44_For_33_Conditional_4_Template, 2, 1, "span", 108);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 109);
    \u0275\u0275listener("click", function ProductsComponent_Conditional_44_For_33_Template_button_click_5_listener() {
      const it_r28 = \u0275\u0275restoreView(_r27).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.delCatItem(it_r28.id));
    });
    \u0275\u0275elementStart(6, "mat-icon", 65);
    \u0275\u0275text(7, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const it_r28 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(it_r28.nombre);
    \u0275\u0275advance();
    \u0275\u0275conditional(4, it_r28.extra ? 4 : -1);
  }
}
function ProductsComponent_Conditional_44_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 103);
    \u0275\u0275text(1, "Sin elementos");
    \u0275\u0275elementEnd();
  }
}
function ProductsComponent_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 24)(1, "div", 57);
    \u0275\u0275listener("click", function ProductsComponent_Conditional_44_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeCatalogPanel());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 91)(3, "div", 59)(4, "div", 9)(5, "div", 60)(6, "mat-icon", 61);
    \u0275\u0275text(7, "tune");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div")(9, "h3", 62);
    \u0275\u0275text(10, "Cat\xE1logos (Snowflake)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "p", 63);
    \u0275\u0275text(12, "Departamentos \u2192 Categor\xEDas \u2192 Subcategor\xEDas \xB7 Marcas \xB7 Presentaciones \xB7 Tama\xF1os");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "button", 64);
    \u0275\u0275listener("click", function ProductsComponent_Conditional_44_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeCatalogPanel());
    });
    \u0275\u0275elementStart(14, "mat-icon", 65);
    \u0275\u0275text(15, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "div", 92)(17, "div", 93);
    \u0275\u0275repeaterCreate(18, ProductsComponent_Conditional_44_For_19_Template, 2, 2, "button", 94, _forTrack3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 92)(21, "div", 95)(22, "h4", 96);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 97)(25, "input", 98);
    \u0275\u0275twoWayListener("ngModelChange", function ProductsComponent_Conditional_44_Template_input_ngModelChange_25_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.newName, $event) || (ctx_r1.newName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(26, ProductsComponent_Conditional_44_Conditional_26_Template, 5, 2, "select", 99)(27, ProductsComponent_Conditional_44_Conditional_27_Template, 5, 2, "select", 99)(28, ProductsComponent_Conditional_44_Conditional_28_Template, 5, 2, "select", 99);
    \u0275\u0275elementStart(29, "button", 100);
    \u0275\u0275listener("click", function ProductsComponent_Conditional_44_Template_button_click_29_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addCatItem());
    });
    \u0275\u0275text(30, "Agregar");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(31, "div", 101);
    \u0275\u0275repeaterCreate(32, ProductsComponent_Conditional_44_For_33_Template, 8, 2, "div", 102, _forTrack1);
    \u0275\u0275template(34, ProductsComponent_Conditional_44_Conditional_34_Template, 2, 0, "p", 103);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r1.tabs);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("Agregar ", ctx_r1.currentTab().singular, "");
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newName);
    \u0275\u0275property("placeholder", "Nombre de " + ctx_r1.currentTab().singular.toLowerCase());
    \u0275\u0275advance();
    \u0275\u0275conditional(26, ctx_r1.catTab() === "categorias" ? 26 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(27, ctx_r1.catTab() === "subcategorias" ? 27 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(28, ctx_r1.catTab() === "marcas" ? 28 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r1.newName || ctx_r1.needsParent() && !ctx_r1.newParent);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.currentCatList());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(34, ctx_r1.currentCatList().length === 0 ? 34 : -1);
  }
}
var ProductsComponent = class _ProductsComponent {
  constructor(api, fb, snack) {
    this.api = api;
    this.fb = fb;
    this.snack = snack;
    this.productos = signal([]);
    this.total = signal(0);
    this.loading = signal(false);
    this.saving = signal(false);
    this.panelOpen = signal(false);
    this.editingId = signal(null);
    this.catList = signal([]);
    this.subcatList = signal([]);
    this.marcasList = signal([]);
    this.presentacionesList = signal([]);
    this.departamentosList = signal([]);
    this.productorasList = signal([]);
    this.tamanosList = signal([]);
    this.catalogPanelOpen = signal(false);
    this.catTab = signal("departamentos");
    this.newName = "";
    this.newParent = null;
    this.tabs = [
      { key: "departamentos", label: "Departamentos", singular: "Departamento" },
      { key: "categorias", label: "Categor\xEDas", singular: "Categor\xEDa" },
      { key: "subcategorias", label: "Subcategor\xEDas", singular: "Subcategor\xEDa" },
      { key: "marcas", label: "Marcas", singular: "Marca" },
      { key: "presentaciones", label: "Presentaciones", singular: "Presentaci\xF3n" },
      { key: "tamanos", label: "Tama\xF1os", singular: "Tama\xF1o" }
    ];
    this.searchText = signal("");
    this.filterCategoria = signal(null);
    this.filterMarca = signal(null);
    this.skipVal = signal(0);
    this.pageSize = 25;
    this.search$ = new Subject();
    this.form = this.fb.group({
      producto_gu: ["", Validators.required],
      cod_prod: [""],
      id_departamento: [null],
      id_categoria: [null],
      id_subcategoria: [null],
      id_marca: [null],
      id_presentacion: [null],
      id_clasificacion_tamano: [null],
      descripcion_bi: [""],
      gramos: [null],
      inagotable: [false],
      comentario: [""]
    });
  }
  ngOnInit() {
    this.loadProductos();
    this.loadCatalogs();
    this.search$.pipe(debounceTime(350), distinctUntilChanged()).subscribe(() => {
      this.skipVal.set(0);
      this.loadProductos();
    });
  }
  loadProductos() {
    this.loading.set(true);
    this.api.getProductos({ skip: this.skipVal(), limit: this.pageSize, busqueda: this.searchText() || void 0, id_categoria: this.filterCategoria() ?? void 0, id_marca: this.filterMarca() ?? void 0 }).subscribe({ next: (res) => {
      this.productos.set(res.items);
      this.total.set(res.total);
      this.loading.set(false);
    }, error: () => this.loading.set(false) });
  }
  loadCatalogs() {
    this.api.getCatalogosCategorias().subscribe({ next: (d) => this.catList.set(d), error: () => {
    } });
    this.api.getCatalogosSubCategorias().subscribe({ next: (d) => this.subcatList.set(d), error: () => {
    } });
    this.api.getCatMarcas().subscribe({ next: (d) => this.marcasList.set(d), error: () => {
    } });
    this.api.getCatPresentaciones().subscribe({ next: (d) => this.presentacionesList.set(d), error: () => {
    } });
    this.api.getCatDepartamentos().subscribe({ next: (d) => this.departamentosList.set(d), error: () => {
    } });
    this.api.getCatProductoras().subscribe({ next: (d) => this.productorasList.set(d), error: () => {
    } });
    this.api.getCatTamanos().subscribe({ next: (d) => this.tamanosList.set(d), error: () => {
    } });
  }
  catsFiltradas() {
    const idd = this.form.get("id_departamento")?.value;
    return idd ? this.catList().filter((c) => c.id_departamento === idd) : this.catList();
  }
  subcatsFiltradas() {
    const idc = this.form.get("id_categoria")?.value;
    return idc ? this.subcatList().filter((s) => s.id_categoria === idc) : this.subcatList();
  }
  onDepartamentoChange() {
    this.form.patchValue({ id_categoria: null, id_subcategoria: null });
  }
  onCategoriaChange() {
    this.form.patchValue({ id_subcategoria: null });
  }
  onSearch(val) {
    this.searchText.set(val);
    this.search$.next(val);
  }
  reload() {
    this.skipVal.set(0);
    this.loadProductos();
  }
  clearFilters() {
    this.searchText.set("");
    this.filterCategoria.set(null);
    this.filterMarca.set(null);
    this.skipVal.set(0);
    this.loadProductos();
  }
  prevPage() {
    this.skipVal.update((v) => Math.max(0, v - this.pageSize));
    this.loadProductos();
  }
  nextPage() {
    this.skipVal.update((v) => v + this.pageSize);
    this.loadProductos();
  }
  openPanel(p) {
    this.editingId.set(p?.id ?? null);
    this.form.reset({
      producto_gu: p?.producto_gu ?? "",
      cod_prod: p?.cod_prod ?? "",
      id_departamento: p?.id_departamento ?? null,
      id_categoria: p?.id_categoria ?? null,
      id_subcategoria: p?.id_subcategoria ?? null,
      id_marca: p?.id_marca ?? null,
      id_presentacion: p?.id_presentacion ?? null,
      id_clasificacion_tamano: p?.id_clasificacion_tamano ?? null,
      descripcion_bi: p?.descripcion_bi ?? "",
      gramos: p?.gramos ?? null,
      inagotable: p?.inagotable ?? false,
      comentario: p?.comentario ?? ""
    });
    this.panelOpen.set(true);
  }
  closePanel() {
    this.panelOpen.set(false);
  }
  saveProducto() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const v = this.form.value;
    const payload = {
      producto_gu: v.producto_gu,
      cod_prod: v.cod_prod || null,
      descripcion_bi: v.descripcion_bi || null,
      gramos: v.gramos != null && v.gramos !== "" ? Number(v.gramos) : null,
      inagotable: v.inagotable === true,
      comentario: v.comentario || null,
      id_subcategoria: v.id_subcategoria ?? null,
      id_marca: v.id_marca ?? null,
      id_presentacion: v.id_presentacion ?? null,
      id_clasificacion_tamano: v.id_clasificacion_tamano ?? null
    };
    const op = this.editingId() ? this.api.updateProducto(this.editingId(), payload) : this.api.createProducto(payload);
    op.subscribe({
      next: () => {
        this.saving.set(false);
        this.closePanel();
        this.loadProductos();
        this.snack.open(this.editingId() ? "Producto actualizado" : "Producto creado", "OK", { duration: 3e3 });
      },
      error: (err) => {
        this.saving.set(false);
        this.snack.open(err?.error?.detail ?? "Error al guardar", "OK", { duration: 4e3 });
      }
    });
  }
  deleteProducto(p) {
    if (!confirm(`\xBFEliminar "${p.producto_gu}"?`))
      return;
    this.api.deleteProducto(p.id).subscribe({ next: () => {
      this.loadProductos();
      this.snack.open("Producto eliminado", "OK", { duration: 3e3 });
    }, error: () => this.snack.open("Error al eliminar", "OK", { duration: 3e3 }) });
  }
  // ── Catálogos (ABM) ──
  openCatalogPanel() {
    this.catalogPanelOpen.set(true);
    this.loadCatalogs();
  }
  closeCatalogPanel() {
    this.catalogPanelOpen.set(false);
  }
  currentTab() {
    return this.tabs.find((t) => t.key === this.catTab());
  }
  setTab(k) {
    this.catTab.set(k);
    this.newName = "";
    this.newParent = null;
  }
  needsParent() {
    return this.catTab() === "categorias" || this.catTab() === "subcategorias";
  }
  depName(id) {
    return this.departamentosList().find((d) => d.id === id)?.nombre || "";
  }
  catName(id) {
    return this.catList().find((c) => c.id_categoria === id)?.nombre || "";
  }
  currentCatList() {
    switch (this.catTab()) {
      case "departamentos":
        return this.departamentosList().map((d) => ({ id: d.id, nombre: d.nombre }));
      case "categorias":
        return this.catList().map((c) => ({ id: c.id_categoria, nombre: c.nombre, extra: this.depName(c.id_departamento) }));
      case "subcategorias":
        return this.subcatList().map((s) => ({ id: s.id_subcategoria, nombre: s.nombre, extra: this.catName(s.id_categoria) }));
      case "marcas":
        return this.marcasList().map((m) => ({ id: m.id, nombre: m.nombre }));
      case "presentaciones":
        return this.presentacionesList().map((p) => ({ id: p.id, nombre: p.nombre }));
      case "tamanos":
        return this.tamanosList().map((t) => ({ id: t.id, nombre: t.nombre }));
    }
    return [];
  }
  addCatItem() {
    const nombre = this.newName.trim();
    if (!nombre)
      return;
    const p = this.newParent;
    let obs;
    switch (this.catTab()) {
      case "departamentos":
        obs = this.api.createCatDepartamento({ nombre });
        break;
      case "categorias":
        obs = this.api.createCatalogosCategoria({ nombre, id_departamento: p });
        break;
      case "subcategorias":
        obs = this.api.createCatalogosSubCategoria({ nombre, id_categoria: p });
        break;
      case "marcas":
        obs = this.api.createCatMarca({ nombre, id_productora: p });
        break;
      case "presentaciones":
        obs = this.api.createCatPresentacion({ nombre });
        break;
      case "tamanos":
        obs = this.api.createCatTamano({ nombre });
        break;
      default:
        return;
    }
    obs.subscribe({ next: () => {
      this.newName = "";
      this.newParent = null;
      this.loadCatalogs();
      this.snack.open("Agregado", "OK", { duration: 2e3 });
    }, error: (e) => this.snack.open(e?.error?.detail ?? "Error al agregar", "OK", { duration: 4e3 }) });
  }
  delCatItem(id) {
    if (!confirm("\xBFEliminar este elemento del cat\xE1logo?"))
      return;
    let obs;
    switch (this.catTab()) {
      case "departamentos":
        obs = this.api.deleteCatDepartamento(id);
        break;
      case "categorias":
        obs = this.api.deleteCatalogosCategoria(id);
        break;
      case "subcategorias":
        obs = this.api.deleteCatalogosSubCategoria(id);
        break;
      case "marcas":
        obs = this.api.deleteCatMarca(id);
        break;
      case "presentaciones":
        obs = this.api.deleteCatPresentacion(id);
        break;
      case "tamanos":
        obs = this.api.deleteCatTamano(id);
        break;
      default:
        return;
    }
    obs.subscribe({ next: () => {
      this.loadCatalogs();
      this.snack.open("Eliminado", "OK", { duration: 2e3 });
    }, error: (e) => this.snack.open(e?.error?.detail ?? "Error al eliminar", "OK", { duration: 4e3 }) });
  }
  static {
    this.\u0275fac = function ProductsComponent_Factory(t) {
      return new (t || _ProductsComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProductsComponent, selectors: [["app-products"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 45, vars: 14, consts: [[1, "min-h-screen", "bg-slate-950", "text-white"], [1, "bg-gradient-to-r", "from-slate-900", "via-slate-900", "to-slate-800", "border-b", "border-white/8", "px-8", "py-6"], [1, "flex", "items-center", "justify-between", "gap-4", "flex-wrap"], [1, "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "rounded-2xl", "bg-gradient-to-br", "from-violet-600", "to-purple-700", "flex", "items-center", "justify-center", "shadow-lg", "shrink-0"], [1, "text-white", "!text-2xl"], [1, "text-2xl", "font-black", "tracking-tight", "text-white", "leading-none"], [1, "text-slate-400", "text-sm", "mt-0.5"], [1, "font-bold", "text-violet-400"], [1, "flex", "items-center", "gap-3"], ["class", "flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl shadow-sm transition-all active:scale-95 text-sm border border-slate-700", 3, "click", 4, "hasPerm", "hasPermAction"], ["class", "flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-700 to-purple-700 hover:from-violet-600 hover:to-purple-600 text-white font-black rounded-xl shadow-lg transition-all active:scale-95 text-sm", 3, "click", 4, "hasPerm", "hasPermAction"], [1, "flex", "flex-wrap", "gap-3", "mt-5"], [1, "relative", "flex-1", "min-w-52"], [1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-500", "pointer-events-none", "!text-base"], ["placeholder", "Buscar por nombre o c\xF3digo...", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-violet-500", "text-white", "placeholder-slate-500", "rounded-xl", "pl-9", "pr-4", "py-2.5", "text-sm", "font-semibold", "outline-none", "transition-colors", 3, "ngModelChange", "ngModel"], [1, "relative"], [1, "bg-slate-800", "border", "border-slate-700", "focus:border-violet-500", "text-white", "rounded-xl", "px-3", "py-2.5", "pr-8", "text-sm", "font-semibold", "appearance-none", "outline-none", "min-w-36", 3, "ngModelChange", "ngModel"], [3, "ngValue"], [1, "absolute", "right-2", "top-1/2", "-translate-y-1/2", "text-slate-500", "pointer-events-none", "!text-base"], [1, "flex", "items-center", "gap-1.5", "px-4", "py-2.5", "bg-slate-800", "hover:bg-slate-700", "border", "border-slate-700", "text-slate-400", "hover:text-white", "rounded-xl", "text-sm", "font-bold", "transition-all"], [1, "px-8", "py-6"], [1, "flex", "items-center", "justify-center", "py-32"], [1, "fixed", "inset-0", "z-50", "flex", "justify-end"], [1, "fixed", "inset-0", "z-[60]", "flex", "justify-end"], [1, "flex", "items-center", "gap-2", "px-5", "py-2.5", "bg-slate-800", "hover:bg-slate-700", "text-slate-300", "font-bold", "rounded-xl", "shadow-sm", "transition-all", "active:scale-95", "text-sm", "border", "border-slate-700", 3, "click"], [1, "!text-base"], [1, "flex", "items-center", "gap-2", "px-5", "py-2.5", "bg-gradient-to-r", "from-violet-700", "to-purple-700", "hover:from-violet-600", "hover:to-purple-600", "text-white", "font-black", "rounded-xl", "shadow-lg", "transition-all", "active:scale-95", "text-sm", 3, "click"], [1, "flex", "items-center", "gap-1.5", "px-4", "py-2.5", "bg-slate-800", "hover:bg-slate-700", "border", "border-slate-700", "text-slate-400", "hover:text-white", "rounded-xl", "text-sm", "font-bold", "transition-all", 3, "click"], ["diameter", "40"], [1, "flex", "flex-col", "items-center", "justify-center", "py-32", "gap-4", "text-slate-600"], [1, "w-20", "h-20", "rounded-3xl", "bg-slate-800", "flex", "items-center", "justify-center"], [1, "!text-4xl"], [1, "font-bold", "text-lg", "tracking-tight"], [1, "bg-slate-900", "border", "border-white/8", "rounded-2xl", "overflow-hidden", "overflow-x-auto"], [1, "grid", "grid-cols-[1.7fr_1fr_1fr_1.1fr_1.1fr_1fr_1fr_0.9fr_0.7fr_56px]", "gap-3", "px-5", "py-3", "bg-slate-800", "border-b", "border-white/8", "text-[10px]", "font-black", "text-slate-500", "uppercase", "tracking-widest", "min-w-[1380px]"], [1, "grid", "grid-cols-[1.7fr_1fr_1fr_1.1fr_1.1fr_1fr_1fr_0.9fr_0.7fr_56px]", "gap-3", "items-center", "px-5", "py-3.5", "border-b", "border-white/5", "hover:bg-slate-800", "transition-colors", "group", "min-w-[1380px]"], [1, "flex", "items-center", "justify-between", "mt-5"], [1, "text-sm", "text-slate-500"], [1, "text-white", "font-bold"], [1, "flex", "gap-2"], [1, "flex", "items-center", "gap-1", "px-4", "py-2", "bg-slate-800", "hover:bg-slate-700", "disabled:opacity-40", "border", "border-slate-700", "text-white", "rounded-xl", "text-sm", "font-bold", 3, "click", "disabled"], [1, "flex", "items-center", "gap-3", "min-w-0"], [1, "w-9", "h-9", "rounded-xl", "bg-violet-900", "flex", "items-center", "justify-center", "shrink-0"], [1, "!text-base", "text-violet-400"], [1, "font-bold", "text-white", "text-sm", "truncate"], [1, "text-xs", "font-mono", "text-slate-400", "truncate"], [1, "text-sm", "text-slate-400", "truncate"], [1, "flex", "items-center"], [1, "inline-flex", "items-center", "gap-1", "px-2", "py-0.5", "rounded-full", "bg-emerald-900/60", "text-emerald-400", "text-[10px]", "font-black"], [1, "flex", "items-center", "gap-1", "opacity-0", "group-hover:opacity-100", "transition-opacity"], ["matTooltip", "Editar", "class", "w-8 h-8 rounded-lg bg-violet-900 hover:bg-violet-800 text-violet-400 flex items-center justify-center", 3, "click", 4, "hasPerm", "hasPermAction"], ["matTooltip", "Eliminar", "class", "w-8 h-8 rounded-lg bg-red-950 hover:bg-red-900 text-red-400 flex items-center justify-center", 3, "click", 4, "hasPerm", "hasPermAction"], [1, "!text-[11px]"], [1, "text-slate-600", "text-xs"], ["matTooltip", "Editar", 1, "w-8", "h-8", "rounded-lg", "bg-violet-900", "hover:bg-violet-800", "text-violet-400", "flex", "items-center", "justify-center", 3, "click"], ["matTooltip", "Eliminar", 1, "w-8", "h-8", "rounded-lg", "bg-red-950", "hover:bg-red-900", "text-red-400", "flex", "items-center", "justify-center", 3, "click"], [1, "absolute", "inset-0", "bg-black/60", "backdrop-blur-sm", 3, "click"], [1, "relative", "w-full", "max-w-md", "bg-slate-900", "border-l", "border-white/8", "h-full", "flex", "flex-col", "shadow-2xl"], [1, "bg-gradient-to-r", "from-slate-800", "to-slate-900", "border-b", "border-white/8", "px-6", "py-5", "shrink-0", "flex", "items-center", "justify-between"], [1, "w-10", "h-10", "rounded-xl", "bg-violet-900", "flex", "items-center", "justify-center"], [1, "text-violet-400", "!text-xl"], [1, "font-black", "text-white"], [1, "text-xs", "text-slate-500"], [1, "w-9", "h-9", "rounded-xl", "bg-white/5", "hover:bg-white/10", "flex", "items-center", "justify-center", "text-slate-400", "hover:text-white", 3, "click"], [1, "!text-lg"], [1, "flex-1", "px-6", "py-6", "space-y-5", "overflow-y-auto", 3, "formGroup"], [1, "space-y-1.5"], [1, "text-[10px]", "font-black", "text-slate-500", "uppercase", "tracking-widest"], ["formControlName", "producto_gu", "placeholder", "Nombre del producto", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-violet-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-semibold", "text-white", "placeholder-slate-500", "outline-none"], [1, "text-xs", "text-red-400"], ["formControlName", "cod_prod", "placeholder", "Ej: 7501234567890", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-violet-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-semibold", "font-mono", "text-white", "placeholder-slate-500", "outline-none"], ["formControlName", "id_departamento", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-violet-500", "rounded-xl", "px-3", "py-2.5", "text-sm", "font-semibold", "text-white", "outline-none", 3, "change"], [1, "grid", "grid-cols-2", "gap-4"], ["formControlName", "id_categoria", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-violet-500", "rounded-xl", "px-3", "py-2.5", "text-sm", "font-semibold", "text-white", "outline-none", 3, "change"], ["formControlName", "id_subcategoria", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-violet-500", "rounded-xl", "px-3", "py-2.5", "text-sm", "font-semibold", "text-white", "outline-none"], ["formControlName", "id_marca", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-violet-500", "rounded-xl", "px-3", "py-2.5", "text-sm", "font-semibold", "text-white", "outline-none"], ["formControlName", "id_presentacion", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-violet-500", "rounded-xl", "px-3", "py-2.5", "text-sm", "font-semibold", "text-white", "outline-none"], ["formControlName", "id_clasificacion_tamano", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-violet-500", "rounded-xl", "px-3", "py-2.5", "text-sm", "font-semibold", "text-white", "outline-none"], ["formControlName", "descripcion_bi", "placeholder", "Descripci\xF3n", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-violet-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-semibold", "text-white", "placeholder-slate-500", "outline-none"], ["formControlName", "gramos", "type", "number", "placeholder", "0", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-violet-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-semibold", "text-white", "placeholder-slate-500", "outline-none"], [1, "flex", "items-center", "gap-3", "cursor-pointer"], ["type", "checkbox", "formControlName", "inagotable", 1, "sr-only", "peer"], [1, "relative", "w-11", "h-6", "bg-slate-700", "peer-checked:bg-emerald-600", "rounded-full", "transition-colors"], [1, "absolute", "left-1", "top-1", "w-4", "h-4", "bg-white", "rounded-full", "shadow", "transition-transform", "peer-checked:translate-x-5", "translate-x-0"], [1, "text-sm", "text-slate-300", "font-semibold", "peer-checked:text-emerald-400"], ["formControlName", "comentario", "rows", "2", "placeholder", "Notas (opcional)", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-violet-500", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-semibold", "text-white", "placeholder-slate-500", "outline-none", "resize-none"], [1, "px-6", "py-5", "border-t", "border-white/8", "bg-slate-900", "shrink-0", "flex", "gap-3"], ["type", "button", 1, "flex-1", "py-2.5", "border", "border-slate-700", "text-slate-400", "hover:text-white", "rounded-xl", "font-bold", "text-sm", 3, "click"], ["type", "button", 1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-2.5", "bg-gradient-to-r", "from-violet-700", "to-purple-700", "hover:from-violet-600", "hover:to-purple-600", "disabled:opacity-50", "text-white", "font-black", "rounded-xl", "text-sm", "shadow-lg", "active:scale-95", 3, "click", "disabled"], ["diameter", "16"], [1, "relative", "w-full", "max-w-lg", "bg-slate-900", "border-l", "border-white/8", "h-full", "flex", "flex-col", "shadow-2xl"], [1, "px-4", "pt-4", "shrink-0"], [1, "flex", "gap-1", "bg-slate-800", "rounded-xl", "p-1", "overflow-x-auto"], [1, "flex-1", "px-3", "py-1.5", "rounded-lg", "text-xs", "font-bold", "whitespace-nowrap", "transition-all", 3, "ngClass"], [1, "bg-slate-800", "rounded-2xl", "p-4", "border", "border-slate-700", "space-y-3"], [1, "text-sm", "font-bold", "text-white"], [1, "flex", "flex-wrap", "gap-2"], [1, "flex-1", "min-w-40", "bg-slate-900", "border", "border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "text-white", "outline-none", "focus:border-violet-500", 3, "ngModelChange", "ngModel", "placeholder"], [1, "bg-slate-900", "border", "border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "text-white", "outline-none", "focus:border-violet-500", 3, "ngModel"], [1, "px-4", "bg-violet-600", "hover:bg-violet-500", "text-white", "rounded-lg", "text-sm", "font-bold", "disabled:opacity-50", 3, "click", "disabled"], [1, "flex-1", "overflow-y-auto", "p-4", "space-y-2"], [1, "flex", "items-center", "justify-between", "bg-slate-800", "border", "border-slate-700", "rounded-xl", "px-4", "py-2.5"], [1, "text-center", "text-slate-600", "text-sm", "py-8"], [1, "flex-1", "px-3", "py-1.5", "rounded-lg", "text-xs", "font-bold", "whitespace-nowrap", "transition-all", 3, "click", "ngClass"], [1, "bg-slate-900", "border", "border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "text-white", "outline-none", "focus:border-violet-500", 3, "ngModelChange", "ngModel"], [1, "min-w-0"], [1, "font-bold", "text-sm", "text-white"], [1, "text-xs", "text-slate-500", "ml-2"], [1, "text-red-400", "hover:text-red-300", 3, "click"]], template: function ProductsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "mat-icon", 5);
        \u0275\u0275text(6, "inventory_2");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div")(8, "h1", 6);
        \u0275\u0275text(9, "Productos");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "p", 7)(11, "span", 8);
        \u0275\u0275text(12);
        \u0275\u0275elementEnd();
        \u0275\u0275text(13, " productos en cat\xE1logo");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(14, "div", 9);
        \u0275\u0275template(15, ProductsComponent_button_15_Template, 4, 0, "button", 10)(16, ProductsComponent_button_16_Template, 4, 0, "button", 11);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(17, "div", 12)(18, "div", 13)(19, "mat-icon", 14);
        \u0275\u0275text(20, "search");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "input", 15);
        \u0275\u0275listener("ngModelChange", function ProductsComponent_Template_input_ngModelChange_21_listener($event) {
          return ctx.onSearch($event);
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(22, "div", 16)(23, "select", 17);
        \u0275\u0275listener("ngModelChange", function ProductsComponent_Template_select_ngModelChange_23_listener($event) {
          ctx.filterCategoria.set($event);
          return ctx.reload();
        });
        \u0275\u0275elementStart(24, "option", 18);
        \u0275\u0275text(25, "Todas las categor\xEDas");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(26, ProductsComponent_For_27_Template, 2, 2, "option", 18, _forTrack0);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(28, "mat-icon", 19);
        \u0275\u0275text(29, "expand_more");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(30, "div", 16)(31, "select", 17);
        \u0275\u0275listener("ngModelChange", function ProductsComponent_Template_select_ngModelChange_31_listener($event) {
          ctx.filterMarca.set($event);
          return ctx.reload();
        });
        \u0275\u0275elementStart(32, "option", 18);
        \u0275\u0275text(33, "Todas las marcas");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(34, ProductsComponent_For_35_Template, 2, 2, "option", 18, _forTrack1);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(36, "mat-icon", 19);
        \u0275\u0275text(37, "expand_more");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(38, ProductsComponent_Conditional_38_Template, 4, 0, "button", 20);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(39, "div", 21);
        \u0275\u0275template(40, ProductsComponent_Conditional_40_Template, 2, 0, "div", 22)(41, ProductsComponent_Conditional_41_Template, 6, 0)(42, ProductsComponent_Conditional_42_Template, 40, 5);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(43, ProductsComponent_Conditional_43_Template, 105, 17, "div", 23)(44, ProductsComponent_Conditional_44_Template, 35, 8, "div", 24);
      }
      if (rf & 2) {
        \u0275\u0275advance(12);
        \u0275\u0275textInterpolate(ctx.total());
        \u0275\u0275advance(3);
        \u0275\u0275property("hasPerm", "products")("hasPermAction", "write");
        \u0275\u0275advance();
        \u0275\u0275property("hasPerm", "products")("hasPermAction", "write");
        \u0275\u0275advance(5);
        \u0275\u0275property("ngModel", ctx.searchText());
        \u0275\u0275advance(2);
        \u0275\u0275property("ngModel", ctx.filterCategoria());
        \u0275\u0275advance();
        \u0275\u0275property("ngValue", null);
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.catList());
        \u0275\u0275advance(5);
        \u0275\u0275property("ngModel", ctx.filterMarca());
        \u0275\u0275advance();
        \u0275\u0275property("ngValue", null);
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.marcasList());
        \u0275\u0275advance(4);
        \u0275\u0275conditional(38, ctx.searchText() || ctx.filterCategoria() || ctx.filterMarca() ? 38 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(40, ctx.loading() ? 40 : ctx.productos().length === 0 ? 41 : 42);
        \u0275\u0275advance(3);
        \u0275\u0275conditional(43, ctx.panelOpen() ? 43 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(44, ctx.catalogPanelOpen() ? 44 : -1);
      }
    }, dependencies: [CommonModule, NgClass, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, FormsModule, NgModel, MatIconModule, MatIcon, MatSnackBarModule, MatProgressSpinnerModule, MatProgressSpinner, MatTooltipModule, MatTooltip, HasPermDirective], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProductsComponent, { className: "ProductsComponent", filePath: "src\\app\\features\\products\\products.component.ts", lineNumber: 327 });
})();
export {
  ProductsComponent
};
//# sourceMappingURL=chunk-RELTGUNU.js.map
