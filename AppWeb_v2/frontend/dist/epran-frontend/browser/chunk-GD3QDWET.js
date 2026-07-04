import {
  MatInputModule
} from "./chunk-GXZEZIYO.js";
import {
  MatSnackBar,
  MatSnackBarModule
} from "./chunk-7QJW63DM.js";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableModule
} from "./chunk-3L7HTECJ.js";
import {
  MatFormFieldModule
} from "./chunk-YUDUWHLJ.js";
import "./chunk-CELNEZAJ.js";
import "./chunk-ABO6AUNU.js";
import {
  DefaultValueAccessor,
  FormArrayName,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormGroupName,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  ReactiveFormsModule,
  SelectControlValueAccessor,
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
  MatButton,
  MatButtonModule,
  MatIcon,
  MatIconButton,
  MatIconModule
} from "./chunk-KQNRR4FF.js";
import "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  CommonModule,
  DatePipe,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
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
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QB3BCYT5.js";

// src/app/features/data/data.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function DataComponent_Conditional_1_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 21);
    \u0275\u0275listener("click", function DataComponent_Conditional_1_Conditional_15_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.clearFilters());
    });
    \u0275\u0275elementStart(1, "mat-icon", 22);
    \u0275\u0275text(2, "close");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Limpiar filtros ");
    \u0275\u0275elementEnd();
  }
}
function DataComponent_Conditional_1_For_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r4 = ctx.$implicit;
    \u0275\u0275property("value", c_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r4.nombre);
  }
}
function DataComponent_Conditional_1_For_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r5 = ctx.$implicit;
    \u0275\u0275property("value", m_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(m_r5.nombre_completo || m_r5.nombre);
  }
}
function DataComponent_Conditional_1_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "mat-spinner", 23);
    \u0275\u0275elementStart(2, "p", 24);
    \u0275\u0275text(3, "Consultando registros hist\xF3ricos...");
    \u0275\u0275elementEnd()();
  }
}
function DataComponent_Conditional_1_Conditional_52_th_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 42);
    \u0275\u0275text(1, "Fecha");
    \u0275\u0275elementEnd();
  }
}
function DataComponent_Conditional_1_Conditional_52_td_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 43);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(2, 1, v_r6.fecha, "shortDate"));
  }
}
function DataComponent_Conditional_1_Conditional_52_th_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 42);
    \u0275\u0275text(1, "Cliente");
    \u0275\u0275elementEnd();
  }
}
function DataComponent_Conditional_1_Conditional_52_td_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 44);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r7 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(v_r7.cliente == null ? null : v_r7.cliente.nombre);
  }
}
function DataComponent_Conditional_1_Conditional_52_th_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 42);
    \u0275\u0275text(1, "Punto de Venta");
    \u0275\u0275elementEnd();
  }
}
function DataComponent_Conditional_1_Conditional_52_td_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 45)(1, "div", 46)(2, "span", 47);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 48);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const v_r8 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(v_r8.punto == null ? null : v_r8.punto.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(v_r8.punto == null ? null : v_r8.punto.codigo);
  }
}
function DataComponent_Conditional_1_Conditional_52_th_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 42);
    \u0275\u0275text(1, "Mercaderista");
    \u0275\u0275elementEnd();
  }
}
function DataComponent_Conditional_1_Conditional_52_td_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 49);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r9 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(v_r9.mercaderista == null ? null : v_r9.mercaderista.nombre_completo);
  }
}
function DataComponent_Conditional_1_Conditional_52_th_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 50);
    \u0275\u0275text(1, "Acci\xF3n");
    \u0275\u0275elementEnd();
  }
}
function DataComponent_Conditional_1_Conditional_52_td_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 51)(1, "button", 52);
    \u0275\u0275listener("click", function DataComponent_Conditional_1_Conditional_52_td_16_Template_button_click_1_listener() {
      const v_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.reviewVisit(v_r11));
    });
    \u0275\u0275elementStart(2, "mat-icon", 53);
    \u0275\u0275text(3, "edit_note");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Revisar Data ");
    \u0275\u0275elementEnd()();
  }
}
function DataComponent_Conditional_1_Conditional_52_tr_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 54);
  }
}
function DataComponent_Conditional_1_Conditional_52_tr_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 55);
  }
}
function DataComponent_Conditional_1_Conditional_52_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41)(1, "mat-icon", 56);
    \u0275\u0275text(2, "database_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 57);
    \u0275\u0275text(4, "No se encontr\xF3 data para auditar");
    \u0275\u0275elementEnd()();
  }
}
function DataComponent_Conditional_1_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25)(1, "table", 26);
    \u0275\u0275elementContainerStart(2, 27);
    \u0275\u0275template(3, DataComponent_Conditional_1_Conditional_52_th_3_Template, 2, 0, "th", 28)(4, DataComponent_Conditional_1_Conditional_52_td_4_Template, 3, 4, "td", 29);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(5, 30);
    \u0275\u0275template(6, DataComponent_Conditional_1_Conditional_52_th_6_Template, 2, 0, "th", 28)(7, DataComponent_Conditional_1_Conditional_52_td_7_Template, 2, 1, "td", 31);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(8, 32);
    \u0275\u0275template(9, DataComponent_Conditional_1_Conditional_52_th_9_Template, 2, 0, "th", 28)(10, DataComponent_Conditional_1_Conditional_52_td_10_Template, 6, 2, "td", 33);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(11, 34);
    \u0275\u0275template(12, DataComponent_Conditional_1_Conditional_52_th_12_Template, 2, 0, "th", 28)(13, DataComponent_Conditional_1_Conditional_52_td_13_Template, 2, 1, "td", 35);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(14, 36);
    \u0275\u0275template(15, DataComponent_Conditional_1_Conditional_52_th_15_Template, 2, 0, "th", 37)(16, DataComponent_Conditional_1_Conditional_52_td_16_Template, 5, 0, "td", 38);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275template(17, DataComponent_Conditional_1_Conditional_52_tr_17_Template, 1, 0, "tr", 39)(18, DataComponent_Conditional_1_Conditional_52_tr_18_Template, 1, 0, "tr", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275template(19, DataComponent_Conditional_1_Conditional_52_Conditional_19_Template, 5, 0, "div", 41);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("dataSource", ctx_r1.visits());
    \u0275\u0275advance(16);
    \u0275\u0275property("matHeaderRowDef", ctx_r1.visitColumns);
    \u0275\u0275advance();
    \u0275\u0275property("matRowDefColumns", ctx_r1.visitColumns);
    \u0275\u0275advance();
    \u0275\u0275conditional(19, ctx_r1.visits().length === 0 ? 19 : -1);
  }
}
function DataComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "div")(2, "h1", 2);
    \u0275\u0275text(3, "Gesti\xF3n de Data");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 3);
    \u0275\u0275text(5, "Auditor\xEDa de balances e inventarios reportados en campo.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "button", 4);
    \u0275\u0275listener("click", function DataComponent_Conditional_1_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadVisits());
    });
    \u0275\u0275elementStart(7, "mat-icon");
    \u0275\u0275text(8, "refresh");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 5)(10, "div", 6)(11, "mat-icon", 7);
    \u0275\u0275text(12, "filter_list");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 8);
    \u0275\u0275text(14, "Filtros");
    \u0275\u0275elementEnd();
    \u0275\u0275template(15, DataComponent_Conditional_1_Conditional_15_Template, 4, 0, "button", 9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 10)(17, "div", 11)(18, "label", 12);
    \u0275\u0275text(19, "Desde");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "input", 13);
    \u0275\u0275twoWayListener("ngModelChange", function DataComponent_Conditional_1_Template_input_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.fechaInicio, $event) || (ctx_r1.fechaInicio = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function DataComponent_Conditional_1_Template_input_change_20_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadVisits());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 11)(22, "label", 12);
    \u0275\u0275text(23, "Hasta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "input", 13);
    \u0275\u0275twoWayListener("ngModelChange", function DataComponent_Conditional_1_Template_input_ngModelChange_24_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.fechaFin, $event) || (ctx_r1.fechaFin = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function DataComponent_Conditional_1_Template_input_change_24_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadVisits());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 11)(26, "label", 12);
    \u0275\u0275text(27, "Cliente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 14)(29, "select", 15);
    \u0275\u0275twoWayListener("ngModelChange", function DataComponent_Conditional_1_Template_select_ngModelChange_29_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.clienteId, $event) || (ctx_r1.clienteId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function DataComponent_Conditional_1_Template_select_change_29_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadVisits());
    });
    \u0275\u0275elementStart(30, "option", 16);
    \u0275\u0275text(31, "Todos");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(32, DataComponent_Conditional_1_For_33_Template, 2, 2, "option", 17, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "mat-icon", 18);
    \u0275\u0275text(35, "expand_more");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(36, "div", 11)(37, "label", 12);
    \u0275\u0275text(38, "Mercaderista");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "div", 14)(40, "select", 15);
    \u0275\u0275twoWayListener("ngModelChange", function DataComponent_Conditional_1_Template_select_ngModelChange_40_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.mercaderistaId, $event) || (ctx_r1.mercaderistaId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function DataComponent_Conditional_1_Template_select_change_40_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadVisits());
    });
    \u0275\u0275elementStart(41, "option", 16);
    \u0275\u0275text(42, "Todos");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(43, DataComponent_Conditional_1_For_44_Template, 2, 2, "option", 17, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "mat-icon", 18);
    \u0275\u0275text(46, "expand_more");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(47, "div", 11)(48, "label", 12);
    \u0275\u0275text(49, "Punto de Venta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "input", 19);
    \u0275\u0275twoWayListener("ngModelChange", function DataComponent_Conditional_1_Template_input_ngModelChange_50_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.puntoSearch, $event) || (ctx_r1.puntoSearch = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function DataComponent_Conditional_1_Template_input_change_50_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadVisits());
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275template(51, DataComponent_Conditional_1_Conditional_51_Template, 4, 0, "div", 20)(52, DataComponent_Conditional_1_Conditional_52_Template, 20, 4);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(15);
    \u0275\u0275conditional(15, ctx_r1.hasFilters ? 15 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.fechaInicio);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.fechaFin);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.clienteId);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.clients());
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.mercaderistaId);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.mercaderistas());
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.puntoSearch);
    \u0275\u0275advance();
    \u0275\u0275conditional(51, ctx_r1.loadingVisits() ? 51 : 52);
  }
}
function DataComponent_Conditional_2_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "mat-spinner", 67);
    \u0275\u0275elementStart(2, "p", 68);
    \u0275\u0275text(3, "Sincronizando balances totales...");
    \u0275\u0275elementEnd()();
  }
}
function DataComponent_Conditional_2_Conditional_18_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 76)(1, "td", 77)(2, "div", 46)(3, "span", 78);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 79);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "td", 80);
    \u0275\u0275element(8, "input", 81);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 80);
    \u0275\u0275element(10, "input", 82);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 80);
    \u0275\u0275element(12, "input", 83);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 80);
    \u0275\u0275element(14, "input", 84);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 80);
    \u0275\u0275element(16, "input", 85);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 80);
    \u0275\u0275element(18, "input", 86);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_13_0;
    let tmp_14_0;
    const ctrl_r13 = ctx.$implicit;
    const i_r14 = ctx.$index;
    \u0275\u0275property("formGroupName", i_r14);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate((tmp_13_0 = ctrl_r13.get("producto")) == null ? null : tmp_13_0.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_14_0 = ctrl_r13.get("categoria")) == null ? null : tmp_14_0.value);
  }
}
function DataComponent_Conditional_2_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "form", 69)(1, "table", 70)(2, "thead")(3, "tr", 71)(4, "th", 72);
    \u0275\u0275text(5, "Producto / Categor\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 73);
    \u0275\u0275text(7, "Ini");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 73);
    \u0275\u0275text(9, "Fin");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 73);
    \u0275\u0275text(11, "Dep");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 73);
    \u0275\u0275text(13, "Caras");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 74);
    \u0275\u0275text(15, "Precio (Bs)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 74);
    \u0275\u0275text(17, "Precio ($)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody", 75);
    \u0275\u0275repeaterCreate(19, DataComponent_Conditional_2_Conditional_18_For_20_Template, 19, 3, "tr", 76, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("formGroup", ctx_r1.balancesForm);
    \u0275\u0275advance(19);
    \u0275\u0275repeater(ctx_r1.balancesArray.controls);
  }
}
function DataComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 58)(1, "div", 59)(2, "div", 60)(3, "button", 61);
    \u0275\u0275listener("click", function DataComponent_Conditional_2_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goBack());
    });
    \u0275\u0275elementStart(4, "mat-icon");
    \u0275\u0275text(5, "arrow_back");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "h2", 62);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 63);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "date");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "div", 64)(13, "button", 65);
    \u0275\u0275listener("click", function DataComponent_Conditional_2_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goBack());
    });
    \u0275\u0275text(14, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "button", 66);
    \u0275\u0275listener("click", function DataComponent_Conditional_2_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveChanges());
    });
    \u0275\u0275text(16, " Guardar Auditor\xEDa ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(17, DataComponent_Conditional_2_Conditional_17_Template, 4, 0, "div", 20)(18, DataComponent_Conditional_2_Conditional_18_Template, 21, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1("Revisi\xF3n de Visita #", (tmp_1_0 = ctx_r1.selectedVisit()) == null ? null : tmp_1_0.id, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", (tmp_2_0 = ctx_r1.selectedVisit()) == null ? null : tmp_2_0.punto == null ? null : tmp_2_0.punto.nombre, " \u2022 ", \u0275\u0275pipeBind2(11, 4, (tmp_2_0 = ctx_r1.selectedVisit()) == null ? null : tmp_2_0.fecha, "fullDate"), "");
    \u0275\u0275advance(7);
    \u0275\u0275conditional(17, ctx_r1.loadingBalances() ? 17 : 18);
  }
}
var DataComponent = class _DataComponent {
  constructor(api, fb, snack) {
    this.api = api;
    this.fb = fb;
    this.snack = snack;
    this.loadingVisits = signal(true);
    this.loadingBalances = signal(false);
    this.isReviewMode = signal(false);
    this.visits = signal([]);
    this.selectedVisit = signal(null);
    this.clients = signal([]);
    this.mercaderistas = signal([]);
    this.fechaInicio = "";
    this.fechaFin = "";
    this.clienteId = "";
    this.mercaderistaId = "";
    this.puntoSearch = "";
    this.visitColumns = ["fecha", "cliente", "pdv", "mercaderista", "acciones"];
    this.balanceColumns = ["producto", "categoria", "inv_inicial", "inv_final", "inv_deposito", "caras", "precio_bs", "precio_usd"];
    this.balancesForm = this.fb.group({ balances: this.fb.array([]) });
  }
  get balancesArray() {
    return this.balancesForm.get("balances");
  }
  ngOnInit() {
    this.loadVisits();
    this.api.getClients().subscribe({ next: (d) => this.clients.set(d), error: () => {
    } });
    this.api.getMercaderistas().subscribe({ next: (d) => this.mercaderistas.set(d), error: () => {
    } });
  }
  loadVisits() {
    this.loadingVisits.set(true);
    const opts = {};
    if (this.fechaInicio)
      opts.fecha_inicio = this.fechaInicio;
    if (this.fechaFin)
      opts.fecha_fin = this.fechaFin;
    if (this.clienteId)
      opts.cliente_id = +this.clienteId;
    if (this.mercaderistaId)
      opts.mercaderista_id = +this.mercaderistaId;
    if (this.puntoSearch)
      opts.punto_id = this.puntoSearch;
    this.api.getVisitsWithBalances(opts).subscribe({
      next: (data) => {
        this.visits.set(data);
        this.loadingVisits.set(false);
      },
      error: () => this.loadingVisits.set(false)
    });
  }
  clearFilters() {
    this.fechaInicio = "";
    this.fechaFin = "";
    this.clienteId = "";
    this.mercaderistaId = "";
    this.puntoSearch = "";
    this.loadVisits();
  }
  get hasFilters() {
    return !!(this.fechaInicio || this.fechaFin || this.clienteId || this.mercaderistaId || this.puntoSearch);
  }
  reviewVisit(visit) {
    this.selectedVisit.set(visit);
    this.isReviewMode.set(true);
    this.loadingBalances.set(true);
    this.api.getVisitBalances(visit.id).subscribe({
      next: (balances) => {
        this.setBalances(balances);
        this.loadingBalances.set(false);
      },
      error: () => this.loadingBalances.set(false)
    });
  }
  setBalances(balances) {
    const formGroups = balances.map((b) => this.fb.group({
      id_balance: [b.id],
      producto: [b.producto],
      categoria: [b.categoria],
      inv_inicial: [b.inv_inicial],
      inv_final: [b.inv_final],
      inv_deposito: [b.inv_deposito],
      caras: [b.caras],
      precio_bs: [b.precio_bs],
      precio_usd: [b.precio_ds]
    }));
    this.balancesForm.setControl("balances", this.fb.array(formGroups));
  }
  goBack() {
    this.isReviewMode.set(false);
    this.selectedVisit.set(null);
  }
  saveChanges() {
    if (this.balancesForm.invalid)
      return;
    this.api.saveBalances({ visita_id: this.selectedVisit()?.id, balances: this.balancesForm.value.balances }).subscribe({
      next: () => {
        this.snack.open("Cambios guardados", "Cerrar", { duration: 3e3 });
        this.goBack();
      },
      error: (err) => this.snack.open("Error al guardar: " + err.message, "Cerrar", { duration: 5e3 })
    });
  }
  static {
    this.\u0275fac = function DataComponent_Factory(t) {
      return new (t || _DataComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DataComponent, selectors: [["app-data"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 3, vars: 1, consts: [[1, "space-y-8", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-6"], [1, "text-3xl", "font-bold", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "w-12", "h-12", "flex", "items-center", "justify-center", "rounded-2xl", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "text-slate-500", "dark:text-slate-400", "hover:bg-slate-50", "dark:hover:bg-slate-800", "hover:text-primary-500", "transition-all", "shadow-sm", 3, "click"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "p-5", "space-y-4"], [1, "flex", "items-center", "gap-2", "mb-1"], [1, "!text-base", "text-primary-500"], [1, "text-sm", "font-black", "text-slate-600", "dark:text-slate-400", "uppercase", "tracking-widest"], [1, "ml-auto", "flex", "items-center", "gap-1", "text-xs", "font-bold", "text-slate-400", "hover:text-rose-400", "transition-colors"], [1, "grid", "grid-cols-2", "md:grid-cols-3", "lg:grid-cols-5", "gap-3"], [1, "space-y-1"], [1, "text-[10px]", "font-black", "text-slate-500", "uppercase", "tracking-widest"], ["type", "date", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "text-slate-800", "dark:text-white", "rounded-xl", "px-3", "py-2", "text-sm", "font-semibold", "outline-none", "transition-colors", 3, "ngModelChange", "change", "ngModel"], [1, "relative"], [1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "text-slate-800", "dark:text-white", "rounded-xl", "px-3", "py-2", "pr-8", "text-sm", "font-semibold", "appearance-none", "outline-none", "transition-colors", 3, "ngModelChange", "change", "ngModel"], ["value", ""], [3, "value"], [1, "absolute", "right-2", "top-1/2", "-translate-y-1/2", "text-slate-400", "pointer-events-none", "!text-base"], ["placeholder", "ID del punto...", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "px-3", "py-2", "text-sm", "font-semibold", "outline-none", "transition-colors", 3, "ngModelChange", "change", "ngModel"], [1, "flex", "flex-col", "items-center", "justify-center", "py-24", "gap-4"], [1, "ml-auto", "flex", "items-center", "gap-1", "text-xs", "font-bold", "text-slate-400", "hover:text-rose-400", "transition-colors", 3, "click"], [1, "!text-sm"], ["diameter", "48", "strokeWidth", "4"], [1, "text-slate-400", "font-medium"], [1, "bg-white", "dark:bg-slate-900", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "overflow-hidden", "overflow-x-auto"], ["mat-table", "", 1, "w-full", 3, "dataSource"], ["matColumnDef", "fecha"], ["mat-header-cell", "", "class", "!bg-slate-50 dark:!bg-slate-950/50 !text-slate-500 !font-bold !py-5", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "!py-4 text-slate-600 dark:text-slate-300 font-medium", 4, "matCellDef"], ["matColumnDef", "cliente"], ["mat-cell", "", "class", "!py-4 text-slate-600 dark:text-slate-300 font-bold", 4, "matCellDef"], ["matColumnDef", "pdv"], ["mat-cell", "", "class", "!py-4", 4, "matCellDef"], ["matColumnDef", "mercaderista"], ["mat-cell", "", "class", "!py-4 text-slate-500 dark:text-slate-400", 4, "matCellDef"], ["matColumnDef", "acciones"], ["mat-header-cell", "", "class", "!bg-slate-50 dark:!bg-slate-950/50 !text-slate-500 !font-bold !py-5 text-right px-6", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "!py-4 text-right px-6", 4, "matCellDef"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-slate-100 dark:border-white/5 last:border-0", 4, "matRowDef", "matRowDefColumns"], [1, "py-20", "text-center", "flex", "flex-col", "items-center", "gap-3", "grayscale", "opacity-40"], ["mat-header-cell", "", 1, "!bg-slate-50", "dark:!bg-slate-950/50", "!text-slate-500", "!font-bold", "!py-5"], ["mat-cell", "", 1, "!py-4", "text-slate-600", "dark:text-slate-300", "font-medium"], ["mat-cell", "", 1, "!py-4", "text-slate-600", "dark:text-slate-300", "font-bold"], ["mat-cell", "", 1, "!py-4"], [1, "flex", "flex-col"], [1, "font-bold", "text-slate-800", "dark:text-white"], [1, "text-xs", "text-slate-400"], ["mat-cell", "", 1, "!py-4", "text-slate-500", "dark:text-slate-400"], ["mat-header-cell", "", 1, "!bg-slate-50", "dark:!bg-slate-950/50", "!text-slate-500", "!font-bold", "!py-5", "text-right", "px-6"], ["mat-cell", "", 1, "!py-4", "text-right", "px-6"], ["mat-flat-button", "", "color", "primary", 1, "!rounded-xl", "!font-bold", "!bg-primary-50", "dark:!bg-primary-900/20", "!text-primary-600", "dark:!text-primary-400", "hover:!bg-primary-500", "hover:!text-white", "transition-all", 3, "click"], [1, "mr-1"], ["mat-header-row", ""], ["mat-row", "", 1, "hover:bg-slate-50", "dark:hover:bg-white/5", "transition-colors", "border-b", "border-slate-100", "dark:border-white/5", "last:border-0"], [1, "!text-6xl"], [1, "text-xl", "font-bold", "dark:text-white"], [1, "space-y-6"], [1, "flex", "items-center", "justify-between", "bg-white", "dark:bg-slate-900", "p-6", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm"], [1, "flex", "items-center", "gap-4"], ["mat-icon-button", "", 1, "!bg-slate-100", "dark:!bg-slate-800", "!text-slate-500", 3, "click"], [1, "text-xl", "font-bold", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-sm", "text-slate-500", "dark:text-slate-400"], [1, "flex", "items-center", "gap-3"], ["mat-button", "", 1, "!rounded-xl", "!font-bold", "!text-slate-500", 3, "click"], ["mat-flat-button", "", "color", "primary", 1, "!rounded-xl", "!h-12", "!px-8", "!font-bold", "!bg-emerald-500", "hover:!bg-emerald-600", "shadow-lg", "shadow-emerald-500/20", 3, "click"], ["diameter", "40"], [1, "text-slate-400", "font-medium", "italic"], [1, "bg-white", "dark:bg-slate-900", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-xl", "overflow-hidden", "overflow-x-auto", 3, "formGroup"], [1, "w-full", "text-left", "border-collapse"], [1, "bg-slate-50", "dark:bg-slate-950/50", "border-b", "border-slate-100", "dark:border-white/5"], [1, "p-5", "text-xs", "font-black", "text-slate-400", "uppercase", "tracking-widest"], [1, "p-5", "text-xs", "font-black", "text-slate-400", "uppercase", "tracking-widest", "w-24"], [1, "p-5", "text-xs", "font-black", "text-slate-400", "uppercase", "tracking-widest", "w-32"], ["formArrayName", "balances"], [1, "border-b", "border-slate-100", "dark:border-white/5", "hover:bg-slate-50/50", "dark:hover:bg-white/5", "transition-colors", 3, "formGroupName"], [1, "p-5"], [1, "font-bold", "text-slate-800", "dark:text-white", "text-sm"], [1, "text-[10px]", "font-black", "text-primary-500", "uppercase", "tracking-widest"], [1, "p-3"], ["type", "number", "formControlName", "inv_inicial", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border-none", "rounded-lg", "p-2", "text-sm", "font-bold", "text-slate-700", "dark:text-white", "focus:ring-2", "focus:ring-primary-500", "outline-none"], ["type", "number", "formControlName", "inv_final", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border-none", "rounded-lg", "p-2", "text-sm", "font-bold", "text-slate-700", "dark:text-white", "focus:ring-2", "focus:ring-primary-500", "outline-none"], ["type", "number", "formControlName", "inv_deposito", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border-none", "rounded-lg", "p-2", "text-sm", "font-bold", "text-slate-700", "dark:text-white", "focus:ring-2", "focus:ring-primary-500", "outline-none"], ["type", "number", "formControlName", "caras", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border-none", "rounded-lg", "p-2", "text-sm", "font-bold", "text-slate-700", "dark:text-white", "focus:ring-2", "focus:ring-primary-500", "outline-none"], ["type", "number", "step", "0.01", "formControlName", "precio_bs", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border-none", "rounded-lg", "p-2", "text-sm", "font-bold", "text-slate-700", "dark:text-white", "focus:ring-2", "focus:ring-primary-500", "outline-none"], ["type", "number", "step", "0.01", "formControlName", "precio_usd", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border-none", "rounded-lg", "p-2", "text-sm", "font-bold", "text-slate-700", "dark:text-white", "focus:ring-2", "focus:ring-primary-500", "outline-none"]], template: function DataComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275template(1, DataComponent_Conditional_1_Template, 53, 7)(2, DataComponent_Conditional_2_Template, 19, 7);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275conditional(1, !ctx.isReviewMode() ? 1 : 2);
      }
    }, dependencies: [CommonModule, DatePipe, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, ReactiveFormsModule, FormGroupDirective, FormControlName, FormGroupName, FormArrayName, MatTableModule, MatTable, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatButtonModule, MatButton, MatIconButton, MatIconModule, MatIcon, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatProgressSpinner, MatSnackBarModule], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.mat-mdc-table[_ngcontent-%COMP%] {\n  background: transparent !important;\n}\n.mat-mdc-header-cell[_ngcontent-%COMP%] {\n  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;\n}\ninput[_ngcontent-%COMP%]::-webkit-outer-spin-button, input[_ngcontent-%COMP%]::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\ninput[type=number][_ngcontent-%COMP%] {\n  -moz-appearance: textfield;\n}\n/*# sourceMappingURL=data.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DataComponent, { className: "DataComponent", filePath: "src\\app\\features\\data\\data.component.ts", lineNumber: 25 });
})();
export {
  DataComponent
};
//# sourceMappingURL=chunk-GD3QDWET.js.map
