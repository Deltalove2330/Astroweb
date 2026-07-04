import {
  RevisionVisitasComponent
} from "./chunk-2KPHPDAE.js";
import "./chunk-7QJW63DM.js";
import {
  RealtimeService
} from "./chunk-7WZINN4L.js";
import {
  AuthService
} from "./chunk-FAJEMXMR.js";
import {
  MatTooltip,
  MatTooltipModule
} from "./chunk-PBKBS7OR.js";
import "./chunk-CELNEZAJ.js";
import "./chunk-ABO6AUNU.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
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
  MatButtonModule,
  MatIcon,
  MatIconModule
} from "./chunk-KQNRR4FF.js";
import "./chunk-QGVFX6Y7.js";
import "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  CommonModule,
  DatePipe,
  NgClass,
  formatDate,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassMapInterpolate1,
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
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QB3BCYT5.js";

// src/app/features/centro-mando/centro-mando.component.ts
var _forTrack0 = ($index, $item) => $item.id_cliente;
var _forTrack1 = ($index, $item) => $item.id_mercaderista;
var _forTrack2 = ($index, $item) => $item.id;
var _forTrack3 = ($index, $item) => $item.cliente;
var _forTrack4 = ($index, $item) => $item.mercaderista;
var _forTrack5 = ($index, $item) => $item.id_punto + "_" + $item.id_cliente;
var _forTrack6 = ($index, $item) => $item.id_visita;
var _forTrack7 = ($index, $item) => $item.id_punto + "_" + $item.id_mercaderista;
function CentroMandoComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-revision-visitas");
  }
}
function CentroMandoComponent_Conditional_12_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r3 = ctx.$implicit;
    \u0275\u0275property("ngValue", c_r3.id_cliente);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r3.cliente);
  }
}
function CentroMandoComponent_Conditional_12_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275element(1, "mat-spinner", 37);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Cargando resumen...");
    \u0275\u0275elementEnd()();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_41_Conditional_47_For_10_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const m_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", m_r5.estado, " ");
  }
}
function CentroMandoComponent_Conditional_12_Conditional_41_Conditional_47_For_10_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const m_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate2(" Act: ", m_r5.activos, "/", m_r5.planificados, " ");
  }
}
function CentroMandoComponent_Conditional_12_Conditional_41_Conditional_47_For_10_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classMapInterpolate1("m-tag ", m_r5.tipo_servicio === "Tradex" ? "yellow" : "blue", "");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", m_r5.tipo_servicio, " ");
  }
}
function CentroMandoComponent_Conditional_12_Conditional_41_Conditional_47_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 71)(1, "div", 73)(2, "mat-icon", 74);
    \u0275\u0275text(3, "account_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 75);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 76);
    \u0275\u0275template(7, CentroMandoComponent_Conditional_12_Conditional_41_Conditional_47_For_10_Conditional_7_Template, 1, 1)(8, CentroMandoComponent_Conditional_12_Conditional_41_Conditional_47_For_10_Conditional_8_Template, 1, 2);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 77)(10, "span", 78);
    \u0275\u0275text(11, "Rutas:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 79);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 80)(15, "div", 81)(16, "span", 82);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275text(18, " POIs ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 83)(20, "span", 82);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275text(22, " rutas ");
    \u0275\u0275elementEnd();
    \u0275\u0275template(23, CentroMandoComponent_Conditional_12_Conditional_41_Conditional_47_For_10_Conditional_23_Template, 2, 4, "div", 84);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const m_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(m_r5.nombre);
    \u0275\u0275advance();
    \u0275\u0275classProp("green", m_r5.faltas === 0)("amber", m_r5.faltas > 0 && m_r5.activos > 0)("gray", m_r5.activos === 0);
    \u0275\u0275advance();
    \u0275\u0275conditional(7, ctx_r1.filtroDesde === ctx_r1.filtroHasta ? 7 : 8);
    \u0275\u0275advance(5);
    \u0275\u0275property("title", m_r5.rutas_nombres.join(", "));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(m_r5.rutas_nombres.join(", ") || "N/A");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", m_r5.pois_completados, "/", m_r5.pois_planificados, "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate3("", m_r5.rutas_planificadas, "/", m_r5.rutas_activas, "/", m_r5.rutas_completadas, "");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(23, m_r5.tipo_servicio ? 23 : -1);
  }
}
function CentroMandoComponent_Conditional_12_Conditional_41_Conditional_47_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 72);
    \u0275\u0275text(1, "Ning\xFAn mercaderista en esta categor\xEDa.");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_41_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53)(1, "div", 67)(2, "div", 68)(3, "mat-icon");
    \u0275\u0275text(4, "people");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 69);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 70);
    \u0275\u0275repeaterCreate(9, CentroMandoComponent_Conditional_12_Conditional_41_Conditional_47_For_10_Template, 24, 16, "div", 71, _forTrack1);
    \u0275\u0275template(11, CentroMandoComponent_Conditional_12_Conditional_41_Conditional_47_Conditional_11_Template, 2, 0, "div", 72);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2(" Mercaderistas que ", ctx_r1.showDetalle === "activos" ? "activaron" : "faltaron", " ", ctx_r1.labelPeriodo === "HOY" ? "hoy" : "en el per\xEDodo", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r1.detalleList.length, " de ", ctx_r1.resumenDia().mercaderistas.planificados_hoy, "");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.detalleList);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(11, !ctx_r1.detalleList.length ? 11 : -1);
  }
}
function CentroMandoComponent_Conditional_12_Conditional_41_Conditional_107_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 59)(1, "div", 60)(2, "span", 61);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 62);
    \u0275\u0275text(5, "Plan.");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(6, "div", 63);
    \u0275\u0275elementStart(7, "div", 60)(8, "span", 64);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 62);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(12, "div", 63);
    \u0275\u0275elementStart(13, "div", 60)(14, "span", 64);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 62);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.resumenDia().clientes_tradex.planificados);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.resumenDia().clientes_tradex.activos);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Activos \xB7 ", ctx_r1.pct(ctx_r1.resumenDia().clientes_tradex.activos, ctx_r1.resumenDia().clientes_tradex.planificados), "%");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.resumenDia().clientes_tradex.completados);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Comp. \xB7 ", ctx_r1.pct(ctx_r1.resumenDia().clientes_tradex.completados, ctx_r1.resumenDia().clientes_tradex.planificados), "%");
  }
}
function CentroMandoComponent_Conditional_12_Conditional_41_Conditional_108_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 85);
    \u0275\u0275text(1, "No aplica (cliente exclusivo)");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 38)(1, "div", 39)(2, "div", 40)(3, "mat-icon");
    \u0275\u0275text(4, "people");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 41)(6, "div", 42);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 43);
    \u0275\u0275text(9, "MERCADERISTAS ASIGNADOS");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 44);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "div", 45)(13, "div", 46)(14, "mat-icon");
    \u0275\u0275text(15, "event_available");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 41)(17, "div", 42);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 43);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 47)(22, "div", 48)(23, "mat-icon");
    \u0275\u0275text(24, "check_circle");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 41)(26, "div", 42);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 43);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "button", 49);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Conditional_41_Template_button_click_30_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleDetalle("activos"));
    });
    \u0275\u0275text(31, " Ver detalle ");
    \u0275\u0275elementStart(32, "mat-icon", 50);
    \u0275\u0275text(33, "expand_more");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(34, "div", 51)(35, "div", 52)(36, "mat-icon");
    \u0275\u0275text(37, "person_off");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(38, "div", 41)(39, "div", 42);
    \u0275\u0275text(40);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "div", 43);
    \u0275\u0275text(42);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "button", 49);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Conditional_41_Template_button_click_43_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleDetalle("faltantes"));
    });
    \u0275\u0275text(44, " Ver detalle ");
    \u0275\u0275elementStart(45, "mat-icon", 50);
    \u0275\u0275text(46, "expand_more");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275template(47, CentroMandoComponent_Conditional_12_Conditional_41_Conditional_47_Template, 12, 5, "div", 53);
    \u0275\u0275elementStart(48, "div", 54)(49, "div", 55)(50, "div", 56)(51, "mat-icon", 57);
    \u0275\u0275text(52, "route");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "span", 58);
    \u0275\u0275text(54, "Rutas");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(55, "div", 59)(56, "div", 60)(57, "span", 61);
    \u0275\u0275text(58);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "span", 62);
    \u0275\u0275text(60, "Plan.");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(61, "div", 63);
    \u0275\u0275elementStart(62, "div", 60)(63, "span", 64);
    \u0275\u0275text(64);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(65, "span", 62);
    \u0275\u0275text(66);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(67, "div", 63);
    \u0275\u0275elementStart(68, "div", 60)(69, "span", 64);
    \u0275\u0275text(70);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "span", 62);
    \u0275\u0275text(72);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(73, "div", 55)(74, "div", 56)(75, "mat-icon", 57);
    \u0275\u0275text(76, "location_on");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(77, "span", 58);
    \u0275\u0275text(78, "Puntos");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(79, "div", 59)(80, "div", 60)(81, "span", 61);
    \u0275\u0275text(82);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(83, "span", 62);
    \u0275\u0275text(84, "Plan.");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(85, "div", 63);
    \u0275\u0275elementStart(86, "div", 60)(87, "span", 64);
    \u0275\u0275text(88);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(89, "span", 62);
    \u0275\u0275text(90);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(91, "div", 63);
    \u0275\u0275elementStart(92, "div", 60)(93, "span", 64);
    \u0275\u0275text(94);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(95, "span", 62);
    \u0275\u0275text(96);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(97, "button", 65);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Conditional_41_Template_button_click_97_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openPdvsModal());
    });
    \u0275\u0275text(98, " Ver PDVs ");
    \u0275\u0275elementStart(99, "mat-icon", 66);
    \u0275\u0275text(100, "arrow_forward");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(101, "div", 55)(102, "div", 56)(103, "mat-icon", 57);
    \u0275\u0275text(104, "groups");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(105, "span", 58);
    \u0275\u0275text(106, "Clientes (Tradex)");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(107, CentroMandoComponent_Conditional_12_Conditional_41_Conditional_107_Template, 18, 5, "div", 59)(108, CentroMandoComponent_Conditional_12_Conditional_41_Conditional_108_Template, 2, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.resumenDia().mercaderistas.total_asignados);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2(" ", ctx_r1.resumenDia().mercaderistas.exclusivos, " Excl. \xB7 ", ctx_r1.resumenDia().mercaderistas.tradex, " Tradex ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.resumenDia().mercaderistas.planificados_hoy);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("PLANIFICADOS ", ctx_r1.labelPeriodo, "");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.resumenDia().mercaderistas.activos_hoy);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("ACTIVARON ", ctx_r1.labelPeriodo, "");
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate(ctx_r1.resumenDia().mercaderistas.faltantes_hoy);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("FALTARON ", ctx_r1.labelPeriodo, "");
    \u0275\u0275advance(5);
    \u0275\u0275conditional(47, ctx_r1.showDetalle ? 47 : -1);
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate(ctx_r1.resumenDia().rutas.planificadas);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.resumenDia().rutas.activas);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Activos \xB7 ", ctx_r1.pct(ctx_r1.resumenDia().rutas.activas, ctx_r1.resumenDia().rutas.planificadas), "%");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.resumenDia().rutas.completadas);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Comp. \xB7 ", ctx_r1.pct(ctx_r1.resumenDia().rutas.completadas, ctx_r1.resumenDia().rutas.planificadas), "%");
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx_r1.resumenDia().puntos_interes.planificados);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.resumenDia().puntos_interes.activos);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Activos \xB7 ", ctx_r1.pct(ctx_r1.resumenDia().puntos_interes.activos, ctx_r1.resumenDia().puntos_interes.planificados), "%");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.resumenDia().puntos_interes.completados);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Comp. \xB7 ", ctx_r1.pct(ctx_r1.resumenDia().puntos_interes.completados, ctx_r1.resumenDia().puntos_interes.planificados), "%");
    \u0275\u0275advance(11);
    \u0275\u0275conditional(107, ctx_r1.resumenDia().clientes_tradex.aplica ? 107 : 108);
  }
}
function CentroMandoComponent_Conditional_12_Conditional_74_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 86);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Conditional_74_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.searchText = "");
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "close");
    \u0275\u0275elementEnd()();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_76_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36);
    \u0275\u0275element(1, "mat-spinner", 87);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Cargando datos...");
    \u0275\u0275elementEnd()();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_0_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 100)(1, "span", 102);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 103);
    \u0275\u0275element(4, "div", 104);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 105);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 106);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const t_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275property("title", t_r8.nombre);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r8.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r1.pctFor(t_r8, "punto"), "%")("background-color", ctx_r1.getBarColor(ctx_r1.pctFor(t_r8, "punto")));
    \u0275\u0275advance();
    \u0275\u0275styleProp("color", ctx_r1.getBarColor(ctx_r1.pctFor(t_r8, "punto")));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r1.pctFor(t_r8, "punto"), "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.countFor(t_r8, "punto"));
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_0_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 101);
    \u0275\u0275text(1, "No hay datos de puntos de venta para este rango.");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_0_For_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 100)(1, "span", 102);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 103);
    \u0275\u0275element(4, "div", 104);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 105);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 106);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const t_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275property("title", t_r9.nombre);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r9.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r1.pctFor(t_r9, "cliente"), "%")("background-color", ctx_r1.getBarColor(ctx_r1.pctFor(t_r9, "cliente")));
    \u0275\u0275advance();
    \u0275\u0275styleProp("color", ctx_r1.getBarColor(ctx_r1.pctFor(t_r9, "cliente")));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r1.pctFor(t_r9, "cliente"), "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.countFor(t_r9, "cliente"));
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_0_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 101);
    \u0275\u0275text(1, "No hay datos de clientes para este rango.");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 88)(1, "div", 89)(2, "div", 90)(3, "div", 91)(4, "span", 92)(5, "mat-icon", 93);
    \u0275\u0275text(6, "place");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, " Por Punto ");
    \u0275\u0275elementStart(8, "mat-icon", 94);
    \u0275\u0275text(9, "info");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "p", 95);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 96)(13, "button", 97);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_0_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.tabPunto = "act");
    });
    \u0275\u0275elementStart(14, "mat-icon", 98);
    \u0275\u0275text(15, "play_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16, " Act. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "button", 97);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_0_Template_button_click_17_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.tabPunto = "com");
    });
    \u0275\u0275elementStart(18, "mat-icon", 98);
    \u0275\u0275text(19, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275text(20, " Comp. ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 99);
    \u0275\u0275repeaterCreate(22, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_0_For_23_Template, 9, 10, "div", 100, _forTrack2);
    \u0275\u0275template(24, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_0_Conditional_24_Template, 2, 0, "div", 101);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 89)(26, "div", 90)(27, "div", 91)(28, "span", 92)(29, "mat-icon", 93);
    \u0275\u0275text(30, "storefront");
    \u0275\u0275elementEnd();
    \u0275\u0275text(31, " Por Cliente ");
    \u0275\u0275elementStart(32, "mat-icon", 94);
    \u0275\u0275text(33, "info");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "p", 95);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "div", 96)(37, "button", 97);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_0_Template_button_click_37_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.tabCliente = "act");
    });
    \u0275\u0275elementStart(38, "mat-icon", 98);
    \u0275\u0275text(39, "play_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275text(40, " Act. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "button", 97);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_0_Template_button_click_41_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.tabCliente = "com");
    });
    \u0275\u0275elementStart(42, "mat-icon", 98);
    \u0275\u0275text(43, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275text(44, " Comp. ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(45, "div", 99);
    \u0275\u0275repeaterCreate(46, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_0_For_47_Template, 9, 10, "div", 100, _forTrack2);
    \u0275\u0275template(48, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_0_Conditional_48_Template, 2, 0, "div", 101);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_7_0;
    let tmp_8_0;
    let tmp_13_0;
    let tmp_14_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(8);
    \u0275\u0275property("matTooltip", ctx_r1.barsTooltip);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r1.helpFor(ctx_r1.tabPunto), " El n\xFAmero es visitas con foto / visitas planificadas.");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.tabPunto === "act" ? "bg-[#1f6feb] text-white" : "text-[#8b949e] hover:text-white");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngClass", ctx_r1.tabPunto === "com" ? "bg-[#238636] text-white" : "text-[#8b949e] hover:text-white");
    \u0275\u0275advance(5);
    \u0275\u0275repeater((tmp_7_0 = ctx_r1.stats()) == null ? null : tmp_7_0.pp_activaciones);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(24, !((tmp_8_0 = ctx_r1.stats()) == null ? null : tmp_8_0.pp_activaciones == null ? null : tmp_8_0.pp_activaciones.length) ? 24 : -1);
    \u0275\u0275advance(8);
    \u0275\u0275property("matTooltip", ctx_r1.barsTooltip);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r1.helpFor(ctx_r1.tabCliente), " El n\xFAmero es visitas con foto / visitas planificadas.");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.tabCliente === "act" ? "bg-[#1f6feb] text-white" : "text-[#8b949e] hover:text-white");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngClass", ctx_r1.tabCliente === "com" ? "bg-[#238636] text-white" : "text-[#8b949e] hover:text-white");
    \u0275\u0275advance(5);
    \u0275\u0275repeater((tmp_13_0 = ctx_r1.stats()) == null ? null : tmp_13_0.pc_activaciones);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(48, !((tmp_14_0 = ctx_r1.stats()) == null ? null : tmp_14_0.pc_activaciones == null ? null : tmp_14_0.pc_activaciones.length) ? 48 : -1);
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_1_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 109)(1, "mat-icon");
    \u0275\u0275text(2, "people_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "Sin mercaderistas para el per\xEDodo");
    \u0275\u0275elementEnd()();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_1_For_20_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 115);
    \u0275\u0275element(1, "span", 132);
    \u0275\u0275text(2, " En punto");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_1_For_20_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 133);
    \u0275\u0275text(1, "Inactivo");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_1_For_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 111)(1, "div", 112)(2, "div", 113);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 114)(5, "h4");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_1_For_20_Conditional_7_Template, 3, 0, "span", 115)(8, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_1_For_20_Conditional_8_Template, 2, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 116)(10, "span", 117)(11, "mat-icon", 98);
    \u0275\u0275text(12, "place");
    \u0275\u0275elementEnd();
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 117)(15, "mat-icon", 98);
    \u0275\u0275text(16, "storefront");
    \u0275\u0275elementEnd();
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 117)(19, "mat-icon", 98);
    \u0275\u0275text(20, "timer");
    \u0275\u0275elementEnd();
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 118)(23, "div", 119)(24, "div", 120);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 121);
    \u0275\u0275text(27, "Activ\xF3");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 119)(29, "div", 122);
    \u0275\u0275text(30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 121);
    \u0275\u0275text(32, "Complet\xF3");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "div", 119)(34, "div", 123);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "div", 121);
    \u0275\u0275text(37, "Pendiente");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(38, "div", 124)(39, "div", 125)(40, "span", 126);
    \u0275\u0275text(41, "Activaciones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "div", 127);
    \u0275\u0275element(43, "div", 128);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "span", 129);
    \u0275\u0275text(45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "span", 130);
    \u0275\u0275text(47);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(48, "div", 125)(49, "span", 126);
    \u0275\u0275text(50, "Completas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "div", 127);
    \u0275\u0275element(52, "div", 128);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "span", 129);
    \u0275\u0275text(54);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "span", 130);
    \u0275\u0275text(56);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(57, "button", 131);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_1_For_20_Template_button_click_57_listener() {
      const m_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.openMercDetail(m_r11));
    });
    \u0275\u0275elementStart(58, "mat-icon", 98);
    \u0275\u0275text(59, "visibility");
    \u0275\u0275elementEnd();
    \u0275\u0275text(60, " Ver visitas ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const m_r11 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((m_r11.nombre || "?").charAt(0).toUpperCase());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(m_r11.nombre);
    \u0275\u0275advance();
    \u0275\u0275conditional(7, m_r11.activo_ahora ? 7 : 8);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", m_r11.total_puntos, " puntos");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", m_r11.total_clientes, " clientes");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.formatDuracion(m_r11.duracion_prom));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(m_r11.activaciones);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(m_r11.completas);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(m_r11.pendientes);
    \u0275\u0275advance(8);
    \u0275\u0275styleProp("width", m_r11.pct_activacion, "%")("background", ctx_r1.getBarColor(m_r11.pct_activacion));
    \u0275\u0275advance();
    \u0275\u0275styleProp("color", ctx_r1.getBarColor(m_r11.pct_activacion));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", m_r11.pct_activacion, "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", m_r11.activaciones, "/", m_r11.planificadas, "");
    \u0275\u0275advance(5);
    \u0275\u0275styleProp("width", m_r11.pct_completas, "%")("background", ctx_r1.getBarColor(m_r11.pct_completas));
    \u0275\u0275advance();
    \u0275\u0275styleProp("color", ctx_r1.getBarColor(m_r11.pct_completas));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", m_r11.pct_completas, "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", m_r11.completas, "/", m_r11.planificadas, "");
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 107)(1, "mat-icon", 108);
    \u0275\u0275text(2, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Cada tarjeta es un mercaderista asignado. Muestra lo ");
    \u0275\u0275elementStart(5, "b");
    \u0275\u0275text(6, "planificado");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, " para el per\xEDodo y cu\xE1nto ");
    \u0275\u0275elementStart(8, "b");
    \u0275\u0275text(9, "activ\xF3");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10, " (entr\xF3 al PDV), ");
    \u0275\u0275elementStart(11, "b");
    \u0275\u0275text(12, "complet\xF3");
    \u0275\u0275elementEnd();
    \u0275\u0275text(13, " (entrada + salida) y queda ");
    \u0275\u0275elementStart(14, "b");
    \u0275\u0275text(15, "pendiente");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16, '. Las barras son sobre lo planificado. "Ver visitas" abre sus fotos y los PDV que le faltan.');
    \u0275\u0275elementEnd()();
    \u0275\u0275template(17, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_1_Conditional_17_Template, 5, 0, "div", 109);
    \u0275\u0275elementStart(18, "div", 110);
    \u0275\u0275repeaterCreate(19, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_1_For_20_Template, 61, 27, "div", 111, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(17);
    \u0275\u0275conditional(17, !ctx_r1.filteredMercaderistas.length ? 17 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.filteredMercaderistas);
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_2_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 109)(1, "mat-icon");
    \u0275\u0275text(2, "calendar_today");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "Sin datos para el per\xEDodo");
    \u0275\u0275elementEnd()();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_2_Conditional_15_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r12 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(2, 1, f_r12, "dd/MM"));
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_2_Conditional_15_For_10_For_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "small");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r13 = \u0275\u0275nextContext().$implicit;
    const c_r14 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275classMap("cell-badge " + ctx_r1.getGestionColorClass(c_r14.dias[f_r13].pct));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r14.dias[f_r13].label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", c_r14.dias[f_r13].pct, "%");
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_2_Conditional_15_For_10_For_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 138);
    \u0275\u0275text(1, "-");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_2_Conditional_15_For_10_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td");
    \u0275\u0275template(1, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_2_Conditional_15_For_10_For_4_Conditional_1_Template, 5, 4, "div", 84)(2, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_2_Conditional_15_For_10_For_4_Conditional_2_Template, 2, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r13 = ctx.$implicit;
    const c_r14 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275conditional(1, c_r14.dias && c_r14.dias[f_r13] ? 1 : 2);
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_2_Conditional_15_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 137);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_2_Conditional_15_For_10_For_4_Template, 3, 1, "td", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r14 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275property("title", c_r14.cliente);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r14.cliente);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.gestionPorDia().fechas);
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_2_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 134)(1, "table", 135)(2, "thead")(3, "tr")(4, "th", 136);
    \u0275\u0275text(5, "Cliente");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_2_Conditional_15_For_7_Template, 3, 4, "th", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "tbody");
    \u0275\u0275repeaterCreate(9, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_2_Conditional_15_For_10_Template, 5, 2, "tr", null, _forTrack3);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r1.gestionPorDia().fechas);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.gestionPorDia().clientes);
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 107)(1, "mat-icon", 108);
    \u0275\u0275text(2, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Matriz por ");
    \u0275\u0275elementStart(5, "b");
    \u0275\u0275text(6, "cliente");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, " (filas) y ");
    \u0275\u0275elementStart(8, "b");
    \u0275\u0275text(9, "d\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10, " (columnas, \xFAltimos 7 d\xEDas). Cada celda = ");
    \u0275\u0275elementStart(11, "b");
    \u0275\u0275text(12, "visitas activadas / visitas registradas");
    \u0275\u0275elementEnd();
    \u0275\u0275text(13, " ese d\xEDa, con su %. El color indica el cumplimiento (verde alto, \xE1mbar medio, rojo bajo). Sirve para ver el ritmo diario de ejecuci\xF3n por cliente.");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(14, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_2_Conditional_14_Template, 5, 0, "div", 109)(15, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_2_Conditional_15_Template, 11, 0);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(14);
    \u0275\u0275conditional(14, !((tmp_3_0 = ctx_r1.gestionPorDia()) == null ? null : tmp_3_0.clientes == null ? null : tmp_3_0.clientes.length) ? 14 : 15);
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_3_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 109)(1, "mat-icon");
    \u0275\u0275text(2, "check_circle_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "\xA1Sin pendientes para el per\xEDodo!");
    \u0275\u0275elementEnd()();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_3_For_14_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 144)(1, "div", 145);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 146)(4, "span", 147);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 148);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const p_r15 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r15.punto_de_interes);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r15.cliente);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r15.ciudad);
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_3_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 140)(1, "div", 141)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 142);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 143);
    \u0275\u0275repeaterCreate(7, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_3_For_14_For_8_Template, 8, 3, "div", 144, _forTrack5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const group_r16 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(group_r16.mercaderista);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(group_r16.items.length);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(group_r16.items);
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 107)(1, "mat-icon", 108);
    \u0275\u0275text(2, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "PDV/clientes ");
    \u0275\u0275elementStart(5, "b");
    \u0275\u0275text(6, "planificados");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, " en las rutas del d\xEDa que ");
    \u0275\u0275elementStart(8, "b");
    \u0275\u0275text(9, "a\xFAn no fueron activados");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10, " (no visitados), agrupados por mercaderista. Es lo que falta por ejecutar en el per\xEDodo.");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(11, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_3_Conditional_11_Template, 5, 0, "div", 109);
    \u0275\u0275elementStart(12, "div", 139);
    \u0275\u0275repeaterCreate(13, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_3_For_14_Template, 9, 2, "div", 140, _forTrack4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(11);
    \u0275\u0275conditional(11, !ctx_r1.pendientesGroupedByMerc.length ? 11 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.pendientesGroupedByMerc);
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 109)(1, "mat-icon");
    \u0275\u0275text(2, "list_alt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "Sin visitas para el per\xEDodo");
    \u0275\u0275elementEnd()();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_For_33_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 150);
    \u0275\u0275text(1, "Completa");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_For_33_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 159);
    \u0275\u0275text(1, "Activa");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_For_33_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 160);
    \u0275\u0275text(1, "Solo salida");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_For_33_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 155);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r18 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.formatDuracion(v_r18.duracion_minutos));
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_For_33_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 161);
    \u0275\u0275text(1, "-");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_For_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275template(2, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_For_33_Conditional_2_Template, 2, 0, "span", 150)(3, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_For_33_Conditional_3_Template, 2, 0)(4, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_For_33_Conditional_4_Template, 2, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 151);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 152);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td")(10, "div", 151);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 153);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td", 154);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "td", 154);
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "td", 154);
    \u0275\u0275template(23, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_For_33_Conditional_23_Template, 2, 1, "span", 155)(24, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_For_33_Conditional_24_Template, 2, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "td", 149)(26, "div", 156)(27, "button", 157);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_For_33_Template_button_click_27_listener() {
      const v_r18 = \u0275\u0275restoreView(_r17).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.openChat(v_r18));
    });
    \u0275\u0275elementStart(28, "mat-icon", 4);
    \u0275\u0275text(29, "chat");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "button", 158);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_For_33_Template_button_click_30_listener() {
      const v_r18 = \u0275\u0275restoreView(_r17).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.openVisitDetail(v_r18));
    });
    \u0275\u0275elementStart(31, "mat-icon", 4);
    \u0275\u0275text(32, "visibility");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const v_r18 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275conditional(2, v_r18.estado_presencia === "completa" ? 2 : v_r18.estado_presencia === "activo" ? 3 : 4);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(v_r18.mercaderista);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(v_r18.cliente);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(v_r18.punto_de_interes);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(v_r18.ruta);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(v_r18.ciudad);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(18, 9, v_r18.fecha_activacion, "HH:mm") || "--:--");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(21, 12, v_r18.fecha_desactivacion, "HH:mm") || "--:--");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(23, v_r18.duracion_minutos != null ? 23 : 24);
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 107)(1, "mat-icon", 108);
    \u0275\u0275text(2, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Listado detallado de ");
    \u0275\u0275elementStart(5, "b");
    \u0275\u0275text(6, "cada visita registrada");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, " en el per\xEDodo (con foto de entrada y/o salida): mercaderista, cliente, PDV, ruta, hora y estado. Es el detalle crudo, no agregados.");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(8, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_Conditional_8_Template, 5, 0, "div", 109);
    \u0275\u0275elementStart(9, "div", 134)(10, "table", 135)(11, "thead")(12, "tr")(13, "th");
    \u0275\u0275text(14, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th");
    \u0275\u0275text(16, "Mercaderista");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th");
    \u0275\u0275text(18, "Cliente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th");
    \u0275\u0275text(20, "Punto de Venta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "th");
    \u0275\u0275text(22, "Ciudad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "th");
    \u0275\u0275text(24, "Entrada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "th");
    \u0275\u0275text(26, "Salida");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "th");
    \u0275\u0275text(28, "Duraci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "th", 149);
    \u0275\u0275text(30, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(31, "tbody");
    \u0275\u0275repeaterCreate(32, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_For_33_Template, 33, 15, "tr", null, _forTrack6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(8);
    \u0275\u0275conditional(8, !ctx_r1.filteredLista.length ? 8 : -1);
    \u0275\u0275advance(24);
    \u0275\u0275repeater(ctx_r1.filteredLista);
  }
}
function CentroMandoComponent_Conditional_12_Conditional_77_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_0_Template, 49, 10, "div", 88)(1, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_1_Template, 21, 1)(2, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_2_Template, 16, 1)(3, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_3_Template, 15, 1)(4, CentroMandoComponent_Conditional_12_Conditional_77_Conditional_4_Template, 34, 1);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(0, ctx_r1.activeView === "dashboard" ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(1, ctx_r1.activeView === "mercaderistas" ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(2, ctx_r1.activeView === "gestion" ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(3, ctx_r1.activeView === "pendientes" ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(4, ctx_r1.activeView === "lista" ? 4 : -1);
  }
}
function CentroMandoComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 11)(2, "mat-icon", 12);
    \u0275\u0275text(3, "assignment");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "h1", 13);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 14);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 15)(10, "div", 16)(11, "mat-icon", 17);
    \u0275\u0275text(12, "business");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "select", 18);
    \u0275\u0275twoWayListener("ngModelChange", function CentroMandoComponent_Conditional_12_Template_select_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtroCliente, $event) || (ctx_r1.filtroCliente = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function CentroMandoComponent_Conditional_12_Template_select_change_13_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onClienteChange());
    });
    \u0275\u0275elementStart(14, "option", 19);
    \u0275\u0275text(15, "Todos los clientes");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(16, CentroMandoComponent_Conditional_12_For_17_Template, 2, 2, "option", 19, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "mat-icon", 20);
    \u0275\u0275text(19, "expand_more");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 21)(21, "div", 22)(22, "mat-icon");
    \u0275\u0275text(23, "date_range");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span");
    \u0275\u0275text(25, "Desde:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "input", 23);
    \u0275\u0275twoWayListener("ngModelChange", function CentroMandoComponent_Conditional_12_Template_input_ngModelChange_26_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtroDesde, $event) || (ctx_r1.filtroDesde = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function CentroMandoComponent_Conditional_12_Template_input_change_26_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.refresh());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275element(27, "div", 24);
    \u0275\u0275elementStart(28, "div", 22)(29, "mat-icon");
    \u0275\u0275text(30, "date_range");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "span");
    \u0275\u0275text(32, "Hasta:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "input", 23);
    \u0275\u0275twoWayListener("ngModelChange", function CentroMandoComponent_Conditional_12_Template_input_ngModelChange_33_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filtroHasta, $event) || (ctx_r1.filtroHasta = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function CentroMandoComponent_Conditional_12_Template_input_change_33_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.refresh());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(34, "button", 25);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Template_button_click_34_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.irHoy());
    });
    \u0275\u0275text(35, "Hoy");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "button", 26);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Template_button_click_36_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.refresh());
    });
    \u0275\u0275elementStart(37, "mat-icon");
    \u0275\u0275text(38, "refresh");
    \u0275\u0275elementEnd();
    \u0275\u0275text(39, " Actualizar ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(40, CentroMandoComponent_Conditional_12_Conditional_40_Template, 4, 0, "div", 27)(41, CentroMandoComponent_Conditional_12_Conditional_41_Template, 109, 21);
    \u0275\u0275elementStart(42, "div", 28)(43, "button", 29);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Template_button_click_43_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.activeView = "dashboard");
    });
    \u0275\u0275elementStart(44, "mat-icon");
    \u0275\u0275text(45, "grid_view");
    \u0275\u0275elementEnd();
    \u0275\u0275text(46, " Dashboard ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "button", 29);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Template_button_click_47_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.activeView = "mercaderistas");
    });
    \u0275\u0275elementStart(48, "mat-icon");
    \u0275\u0275text(49, "people");
    \u0275\u0275elementEnd();
    \u0275\u0275text(50, " Por Mercaderista ");
    \u0275\u0275elementStart(51, "span", 30);
    \u0275\u0275text(52);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(53, "button", 29);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Template_button_click_53_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.activeView = "gestion");
    });
    \u0275\u0275elementStart(54, "mat-icon");
    \u0275\u0275text(55, "calendar_view_week");
    \u0275\u0275elementEnd();
    \u0275\u0275text(56, " Gesti\xF3n por D\xEDa ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "button", 29);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Template_button_click_57_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.activeView = "pendientes");
    });
    \u0275\u0275elementStart(58, "mat-icon");
    \u0275\u0275text(59, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275text(60, " Pendientes ");
    \u0275\u0275elementStart(61, "span", 31);
    \u0275\u0275text(62);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(63, "button", 29);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_12_Template_button_click_63_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.activeView = "lista");
    });
    \u0275\u0275elementStart(64, "mat-icon");
    \u0275\u0275text(65, "list_alt");
    \u0275\u0275elementEnd();
    \u0275\u0275text(66, " Todas las visitas ");
    \u0275\u0275elementStart(67, "span", 30);
    \u0275\u0275text(68);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(69, "div", 32)(70, "div", 33)(71, "mat-icon");
    \u0275\u0275text(72, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(73, "input", 34);
    \u0275\u0275twoWayListener("ngModelChange", function CentroMandoComponent_Conditional_12_Template_input_ngModelChange_73_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.searchText, $event) || (ctx_r1.searchText = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(74, CentroMandoComponent_Conditional_12_Conditional_74_Template, 3, 0, "button");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(75, "div", 35);
    \u0275\u0275template(76, CentroMandoComponent_Conditional_12_Conditional_76_Template, 4, 0, "div", 36)(77, CentroMandoComponent_Conditional_12_Conditional_77_Template, 5, 5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("Resumen \u2014 ", ctx_r1.dateRangeDisplay, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ((tmp_2_0 = ctx_r1.resumenDia()) == null ? null : tmp_2_0.cliente_nombre) || "Todos los clientes", " ");
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filtroCliente);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.clientes());
    \u0275\u0275advance(10);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filtroDesde);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filtroHasta);
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r1.isHoy);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(40, ctx_r1.loadingResumen() ? 40 : ctx_r1.resumenDia() ? 41 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("active", ctx_r1.activeView === "dashboard");
    \u0275\u0275advance(4);
    \u0275\u0275classProp("active", ctx_r1.activeView === "mercaderistas");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.mercaderistasUnificados.length);
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r1.activeView === "gestion");
    \u0275\u0275advance(4);
    \u0275\u0275classProp("active", ctx_r1.activeView === "pendientes");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.pendientes().length);
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r1.activeView === "lista");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.activaciones().length);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.searchText);
    \u0275\u0275advance();
    \u0275\u0275conditional(74, ctx_r1.searchText ? 74 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(76, ctx_r1.loadingActivaciones() ? 76 : 77);
  }
}
function CentroMandoComponent_Conditional_13_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th");
    \u0275\u0275text(1, "Plan.");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_13_For_27_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 119);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r20 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r20.plan);
  }
}
function CentroMandoComponent_Conditional_13_For_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 151);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, CentroMandoComponent_Conditional_13_For_27_Conditional_7_Template, 2, 1, "td", 119);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r20 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r20.ruta);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r20.punto_de_interes);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r20.mercaderista);
    \u0275\u0275advance();
    \u0275\u0275conditional(7, ctx_r1.filtroDesde !== ctx_r1.filtroHasta ? 7 : -1);
  }
}
function CentroMandoComponent_Conditional_13_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 174);
    \u0275\u0275text(2, "Ninguno");
    \u0275\u0275elementEnd()();
  }
}
function CentroMandoComponent_Conditional_13_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th");
    \u0275\u0275text(1, "Plan.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "th");
    \u0275\u0275text(3, "Act.");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_13_For_48_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 119);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "td", 119);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r21 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r21.plan);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r21.act);
  }
}
function CentroMandoComponent_Conditional_13_For_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 151);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, CentroMandoComponent_Conditional_13_For_48_Conditional_7_Template, 4, 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r21 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r21.ruta);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r21.punto_de_interes);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r21.mercaderista);
    \u0275\u0275advance();
    \u0275\u0275conditional(7, ctx_r1.filtroDesde !== ctx_r1.filtroHasta ? 7 : -1);
  }
}
function CentroMandoComponent_Conditional_13_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 175);
    \u0275\u0275text(2, "Ninguno");
    \u0275\u0275elementEnd()();
  }
}
function CentroMandoComponent_Conditional_13_Conditional_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th");
    \u0275\u0275text(1, "Plan.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "th");
    \u0275\u0275text(3, "Comp.");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_13_For_69_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 119);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "td", 119);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r22 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r22.plan);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r22.com);
  }
}
function CentroMandoComponent_Conditional_13_For_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 151);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, CentroMandoComponent_Conditional_13_For_69_Conditional_7_Template, 4, 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r22 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r22.ruta);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r22.punto_de_interes);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r22.mercaderista);
    \u0275\u0275advance();
    \u0275\u0275conditional(7, ctx_r1.filtroDesde !== ctx_r1.filtroHasta ? 7 : -1);
  }
}
function CentroMandoComponent_Conditional_13_Conditional_70_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 175);
    \u0275\u0275text(2, "Ninguno");
    \u0275\u0275elementEnd()();
  }
}
function CentroMandoComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 162);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_13_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeModal());
    });
    \u0275\u0275elementStart(1, "div", 163);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_13_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r19);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 164)(3, "div", 68);
    \u0275\u0275text(4, "PDVs del per\xEDodo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 165);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 166)(8, "div", 167)(9, "div", 168)(10, "mat-icon");
    \u0275\u0275text(11, "hourglass_empty");
    \u0275\u0275elementEnd();
    \u0275\u0275text(12, " Pendientes ");
    \u0275\u0275elementStart(13, "span", 69);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "table", 169)(16, "thead")(17, "tr")(18, "th");
    \u0275\u0275text(19, "Ruta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th");
    \u0275\u0275text(21, "PDV");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "th");
    \u0275\u0275text(23, "Mercaderista");
    \u0275\u0275elementEnd();
    \u0275\u0275template(24, CentroMandoComponent_Conditional_13_Conditional_24_Template, 2, 0, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "tbody");
    \u0275\u0275repeaterCreate(26, CentroMandoComponent_Conditional_13_For_27_Template, 8, 4, "tr", null, _forTrack7);
    \u0275\u0275template(28, CentroMandoComponent_Conditional_13_Conditional_28_Template, 3, 0, "tr");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(29, "div", 167)(30, "div", 170)(31, "mat-icon");
    \u0275\u0275text(32, "play_circle_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275text(33, " Activados ");
    \u0275\u0275elementStart(34, "span", 69);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "table", 169)(37, "thead")(38, "tr")(39, "th");
    \u0275\u0275text(40, "Ruta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "th");
    \u0275\u0275text(42, "PDV");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "th");
    \u0275\u0275text(44, "Mercaderista");
    \u0275\u0275elementEnd();
    \u0275\u0275template(45, CentroMandoComponent_Conditional_13_Conditional_45_Template, 4, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "tbody");
    \u0275\u0275repeaterCreate(47, CentroMandoComponent_Conditional_13_For_48_Template, 8, 4, "tr", null, _forTrack7);
    \u0275\u0275template(49, CentroMandoComponent_Conditional_13_Conditional_49_Template, 3, 0, "tr");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(50, "div", 167)(51, "div", 171)(52, "mat-icon");
    \u0275\u0275text(53, "check_circle_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275text(54, " Completados ");
    \u0275\u0275elementStart(55, "span", 69);
    \u0275\u0275text(56);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(57, "table", 169)(58, "thead")(59, "tr")(60, "th");
    \u0275\u0275text(61, "Ruta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "th");
    \u0275\u0275text(63, "PDV");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "th");
    \u0275\u0275text(65, "Mercaderista");
    \u0275\u0275elementEnd();
    \u0275\u0275template(66, CentroMandoComponent_Conditional_13_Conditional_66_Template, 4, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(67, "tbody");
    \u0275\u0275repeaterCreate(68, CentroMandoComponent_Conditional_13_For_69_Template, 8, 4, "tr", null, _forTrack7);
    \u0275\u0275template(70, CentroMandoComponent_Conditional_13_Conditional_70_Template, 3, 0, "tr");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(71, "div", 172)(72, "button", 173);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_13_Template_button_click_72_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeModal());
    });
    \u0275\u0275text(73, "Cerrar");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", ctx_r1.dateRangeDisplay, " \xB7 ", ((tmp_1_0 = ctx_r1.resumenDia()) == null ? null : tmp_1_0.cliente_nombre) || "Todos los clientes", "");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.modalPdvs.pendientes.length);
    \u0275\u0275advance(10);
    \u0275\u0275conditional(24, ctx_r1.filtroDesde !== ctx_r1.filtroHasta ? 24 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.modalPdvs.pendientes);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(28, !ctx_r1.modalPdvs.pendientes.length ? 28 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.modalPdvs.activos.length);
    \u0275\u0275advance(10);
    \u0275\u0275conditional(45, ctx_r1.filtroDesde !== ctx_r1.filtroHasta ? 45 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.modalPdvs.activos);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(49, !ctx_r1.modalPdvs.activos.length ? 49 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.modalPdvs.completados.length);
    \u0275\u0275advance(10);
    \u0275\u0275conditional(66, ctx_r1.filtroDesde !== ctx_r1.filtroHasta ? 66 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.modalPdvs.completados);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(70, !ctx_r1.modalPdvs.completados.length ? 70 : -1);
  }
}
function CentroMandoComponent_Conditional_14_For_53_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 205);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_14_For_53_Conditional_15_Template_img_click_0_listener() {
      \u0275\u0275restoreView(_r26);
      const v_r25 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openLightbox(v_r25.url_activacion, "Entrada \xB7 " + v_r25.cliente));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r25 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", v_r25.url_activacion, \u0275\u0275sanitizeUrl);
  }
}
function CentroMandoComponent_Conditional_14_For_53_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 206);
    \u0275\u0275text(1, "Sin entrada");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_14_For_53_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 205);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_14_For_53_Conditional_23_Template_img_click_0_listener() {
      \u0275\u0275restoreView(_r27);
      const v_r25 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openLightbox(v_r25.url_desactivacion, "Salida \xB7 " + v_r25.cliente));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r25 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", v_r25.url_desactivacion, \u0275\u0275sanitizeUrl);
  }
}
function CentroMandoComponent_Conditional_14_For_53_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 206);
    \u0275\u0275text(1, "Sin salida");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_14_For_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 191)(1, "div", 194)(2, "div", 91)(3, "p", 195);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 196);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 197)(8, "span", 198);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 199);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_14_For_53_Template_button_click_10_listener() {
      const v_r25 = \u0275\u0275restoreView(_r24).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openChat(v_r25));
    });
    \u0275\u0275elementStart(11, "mat-icon", 4);
    \u0275\u0275text(12, "chat");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(13, "div", 200)(14, "div", 201);
    \u0275\u0275template(15, CentroMandoComponent_Conditional_14_For_53_Conditional_15_Template, 1, 1, "img", 202)(16, CentroMandoComponent_Conditional_14_For_53_Conditional_16_Template, 2, 0);
    \u0275\u0275elementStart(17, "p", 203);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "mat-icon", 204);
    \u0275\u0275text(21, "arrow_forward");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 201);
    \u0275\u0275template(23, CentroMandoComponent_Conditional_14_For_53_Conditional_23_Template, 1, 1, "img", 202)(24, CentroMandoComponent_Conditional_14_For_53_Conditional_24_Template, 2, 0);
    \u0275\u0275elementStart(25, "p", 203);
    \u0275\u0275text(26);
    \u0275\u0275pipe(27, "date");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const v_r25 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(v_r25.cliente);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", v_r25.punto_de_interes, " \xB7 ", v_r25.ciudad, "");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.estadoClass(v_r25));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.estadoLabel(v_r25));
    \u0275\u0275advance(6);
    \u0275\u0275conditional(15, v_r25.url_activacion ? 15 : 16);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Entrada ", v_r25.fecha_activacion ? \u0275\u0275pipeBind2(19, 9, v_r25.fecha_activacion, "HH:mm") : "\u2014", "");
    \u0275\u0275advance(5);
    \u0275\u0275conditional(23, v_r25.url_desactivacion ? 23 : 24);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Salida ", v_r25.fecha_desactivacion ? \u0275\u0275pipeBind2(27, 12, v_r25.fecha_desactivacion, "HH:mm") : "\u2014", "");
  }
}
function CentroMandoComponent_Conditional_14_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 192);
    \u0275\u0275text(1, "Sin visitas con actividad en el per\xEDodo.");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_14_Conditional_55_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 208)(1, "div", 91)(2, "p", 209);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 210);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "span", 211);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r28 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r28.cliente);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", p_r28.punto_de_interes, " \xB7 ", p_r28.ciudad, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r28.ruta);
  }
}
function CentroMandoComponent_Conditional_14_Conditional_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 193)(1, "p", 207)(2, "mat-icon", 4);
    \u0275\u0275text(3, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 124);
    \u0275\u0275repeaterCreate(6, CentroMandoComponent_Conditional_14_Conditional_55_For_7_Template, 8, 4, "div", 208, _forTrack5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.mercPendientes.length, " cliente(s)/PDV pendiente(s) ");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.mercPendientes);
  }
}
function CentroMandoComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "div", 176);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_14_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMercDetail());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 177)(3, "div", 178)(4, "div", 179)(5, "div", 180);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div")(8, "h3", 181);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 182);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "button", 183);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_14_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMercDetail());
    });
    \u0275\u0275elementStart(13, "mat-icon");
    \u0275\u0275text(14, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(15, "div", 184)(16, "div")(17, "div", 181);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 185);
    \u0275\u0275text(20, "Planif.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div")(22, "div", 181);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 185);
    \u0275\u0275text(25, "Visitas");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div")(27, "div", 186);
    \u0275\u0275text(28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "div", 185);
    \u0275\u0275text(30, "Activ\xF3");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div")(32, "div", 187);
    \u0275\u0275text(33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "div", 185);
    \u0275\u0275text(35, "Complet\xF3");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "div")(37, "div", 188);
    \u0275\u0275text(38);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "div", 185);
    \u0275\u0275text(40, "Pendiente");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "div")(42, "div", 189);
    \u0275\u0275text(43);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "div", 185);
    \u0275\u0275text(45, "Activaci\xF3n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "div")(47, "div", 189);
    \u0275\u0275text(48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "div", 185);
    \u0275\u0275text(50, "Completas");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(51, "div", 190);
    \u0275\u0275repeaterCreate(52, CentroMandoComponent_Conditional_14_For_53_Template, 28, 15, "div", 191, _forTrack6);
    \u0275\u0275template(54, CentroMandoComponent_Conditional_14_Conditional_54_Template, 2, 0, "div", 192)(55, CentroMandoComponent_Conditional_14_Conditional_55_Template, 8, 1, "div", 193);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_4_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    let tmp_10_0;
    let tmp_11_0;
    let tmp_12_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate((((tmp_1_0 = ctx_r1.selectedMercDet()) == null ? null : tmp_1_0.nombre) || "?").charAt(0).toUpperCase());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_2_0 = ctx_r1.selectedMercDet()) == null ? null : tmp_2_0.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r1.mercVisitas.length, " visitas \xB7 ", ctx_r1.dateRangeDisplay, "");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate((tmp_4_0 = (tmp_4_0 = ctx_r1.selectedMercDet()) == null ? null : tmp_4_0.planificadas) !== null && tmp_4_0 !== void 0 ? tmp_4_0 : 0);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.mercVisitas.length);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate((tmp_6_0 = ctx_r1.selectedMercDet()) == null ? null : tmp_6_0.activaciones);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate((tmp_7_0 = ctx_r1.selectedMercDet()) == null ? null : tmp_7_0.completas);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate((tmp_8_0 = ctx_r1.selectedMercDet()) == null ? null : tmp_8_0.pendientes);
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("color", ctx_r1.getBarColor(((tmp_9_0 = ctx_r1.selectedMercDet()) == null ? null : tmp_9_0.pct_activacion) || 0));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", (tmp_10_0 = ctx_r1.selectedMercDet()) == null ? null : tmp_10_0.pct_activacion, "%");
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("color", ctx_r1.getBarColor(((tmp_11_0 = ctx_r1.selectedMercDet()) == null ? null : tmp_11_0.pct_completas) || 0));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", (tmp_12_0 = ctx_r1.selectedMercDet()) == null ? null : tmp_12_0.pct_completas, "%");
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r1.mercVisitas);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(54, !ctx_r1.mercVisitas.length ? 54 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(55, ctx_r1.mercPendientes.length ? 55 : -1);
  }
}
function CentroMandoComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 212);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_15_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeLightbox());
    });
    \u0275\u0275element(1, "div", 213);
    \u0275\u0275elementStart(2, "div", 214);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_15_Template_div_click_2_listener($event) {
      \u0275\u0275restoreView(_r29);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(3, "div", 215)(4, "span", 216);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 125)(7, "a", 217)(8, "mat-icon");
    \u0275\u0275text(9, "download");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "button", 218);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_15_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeLightbox());
    });
    \u0275\u0275elementStart(11, "mat-icon");
    \u0275\u0275text(12, "close");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275element(13, "img", 219);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.lightboxTitle);
    \u0275\u0275advance(2);
    \u0275\u0275property("href", ctx_r1.lightboxUrl(), \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(6);
    \u0275\u0275property("src", ctx_r1.lightboxUrl(), \u0275\u0275sanitizeUrl);
  }
}
function CentroMandoComponent_Conditional_16_Conditional_64_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 250);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_16_Conditional_64_Template_img_click_0_listener() {
      let tmp_3_0;
      \u0275\u0275restoreView(_r31);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openLightbox((tmp_3_0 = ctx_r1.selectedVisit()) == null ? null : tmp_3_0.url_activacion, "Entrada \xB7 " + ((tmp_3_0 = ctx_r1.selectedVisit()) == null ? null : tmp_3_0.cliente)));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("src", (tmp_2_0 = ctx_r1.selectedVisit()) == null ? null : tmp_2_0.url_activacion, \u0275\u0275sanitizeUrl);
  }
}
function CentroMandoComponent_Conditional_16_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 251);
    \u0275\u0275text(1, "Sin entrada");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_16_Conditional_72_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 250);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_16_Conditional_72_Template_img_click_0_listener() {
      let tmp_3_0;
      \u0275\u0275restoreView(_r32);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openLightbox((tmp_3_0 = ctx_r1.selectedVisit()) == null ? null : tmp_3_0.url_desactivacion, "Salida \xB7 " + ((tmp_3_0 = ctx_r1.selectedVisit()) == null ? null : tmp_3_0.cliente)));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("src", (tmp_2_0 = ctx_r1.selectedVisit()) == null ? null : tmp_2_0.url_desactivacion, \u0275\u0275sanitizeUrl);
  }
}
function CentroMandoComponent_Conditional_16_Conditional_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 251);
    \u0275\u0275text(1, "Sin salida");
    \u0275\u0275elementEnd();
  }
}
function CentroMandoComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 220);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_16_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r30);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeVisitDetail());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 221)(3, "div", 222)(4, "div", 223)(5, "div", 125)(6, "mat-icon", 224);
    \u0275\u0275text(7, "bolt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 181);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "button", 225);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_16_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r30);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeVisitDetail());
    });
    \u0275\u0275elementStart(11, "mat-icon");
    \u0275\u0275text(12, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "div", 226)(14, "span", 227);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 228);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 229);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "div", 230)(21, "div", 231)(22, "div", 232)(23, "div", 233);
    \u0275\u0275text(24, "Ruta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 234);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 232)(28, "div", 233);
    \u0275\u0275text(29, "Ciudad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 234);
    \u0275\u0275text(31);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 232)(33, "div", 233);
    \u0275\u0275text(34, "Duraci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "div", 234);
    \u0275\u0275text(36);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "div", 232)(38, "div", 233);
    \u0275\u0275text(39, "Analista");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "div", 209);
    \u0275\u0275text(41);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(42, "div", 235)(43, "div", 236);
    \u0275\u0275element(44, "span", 237);
    \u0275\u0275elementStart(45, "span", 204);
    \u0275\u0275text(46, "Entrada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "span", 238);
    \u0275\u0275text(48);
    \u0275\u0275pipe(49, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "div", 239)(51, "span", 240);
    \u0275\u0275text(52);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(53, "div", 236)(54, "span", 204);
    \u0275\u0275text(55, "Salida");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "span", 238);
    \u0275\u0275text(57);
    \u0275\u0275pipe(58, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275element(59, "span", 241);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(60, "div", 242)(61, "div")(62, "p", 243);
    \u0275\u0275text(63, "Entrada");
    \u0275\u0275elementEnd();
    \u0275\u0275template(64, CentroMandoComponent_Conditional_16_Conditional_64_Template, 1, 1, "img", 244)(65, CentroMandoComponent_Conditional_16_Conditional_65_Template, 2, 0);
    \u0275\u0275elementStart(66, "p", 245);
    \u0275\u0275text(67);
    \u0275\u0275pipe(68, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(69, "div")(70, "p", 243);
    \u0275\u0275text(71, "Salida");
    \u0275\u0275elementEnd();
    \u0275\u0275template(72, CentroMandoComponent_Conditional_16_Conditional_72_Template, 1, 1, "img", 244)(73, CentroMandoComponent_Conditional_16_Conditional_73_Template, 2, 0);
    \u0275\u0275elementStart(74, "p", 245);
    \u0275\u0275text(75);
    \u0275\u0275pipe(76, "date");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(77, "div", 246)(78, "button", 247);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_16_Template_button_click_78_listener() {
      \u0275\u0275restoreView(_r30);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openChat(ctx_r1.selectedVisit()));
    });
    \u0275\u0275elementStart(79, "mat-icon", 4);
    \u0275\u0275text(80, "chat");
    \u0275\u0275elementEnd();
    \u0275\u0275text(81, " Chat");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(82, "button", 248);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_16_Template_button_click_82_listener() {
      \u0275\u0275restoreView(_r30);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.verMercDesdeVisita(ctx_r1.selectedVisit()));
    });
    \u0275\u0275elementStart(83, "mat-icon", 4);
    \u0275\u0275text(84, "person");
    \u0275\u0275elementEnd();
    \u0275\u0275text(85, " Ver mercaderista");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "button", 249);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_16_Template_button_click_86_listener() {
      \u0275\u0275restoreView(_r30);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeVisitDetail());
    });
    \u0275\u0275text(87, "Cerrar");
    \u0275\u0275elementEnd()()()();
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
    let tmp_11_0;
    let tmp_12_0;
    let tmp_13_0;
    let tmp_14_0;
    let tmp_15_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1("Visita #", (tmp_1_0 = ctx_r1.selectedVisit()) == null ? null : tmp_1_0.id_visita, "");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate((tmp_2_0 = ctx_r1.selectedVisit()) == null ? null : tmp_2_0.mercaderista);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_3_0 = ctx_r1.selectedVisit()) == null ? null : tmp_3_0.cliente);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r1.selectedVisit()) == null ? null : tmp_4_0.punto_de_interes);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(((tmp_5_0 = ctx_r1.selectedVisit()) == null ? null : tmp_5_0.ruta) || "\u2014");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_6_0 = ctx_r1.selectedVisit()) == null ? null : tmp_6_0.ciudad) || "\u2014");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatDuracion((tmp_7_0 = ctx_r1.selectedVisit()) == null ? null : tmp_7_0.duracion_minutos));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_8_0 = ctx_r1.selectedVisit()) == null ? null : tmp_8_0.analista) || "\u2014");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(((tmp_9_0 = ctx_r1.selectedVisit()) == null ? null : tmp_9_0.fecha_activacion) ? \u0275\u0275pipeBind2(49, 15, (tmp_9_0 = ctx_r1.selectedVisit()) == null ? null : tmp_9_0.fecha_activacion, "HH:mm") : "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.formatDuracion((tmp_10_0 = ctx_r1.selectedVisit()) == null ? null : tmp_10_0.duracion_minutos));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_11_0 = ctx_r1.selectedVisit()) == null ? null : tmp_11_0.fecha_desactivacion) ? \u0275\u0275pipeBind2(58, 18, (tmp_11_0 = ctx_r1.selectedVisit()) == null ? null : tmp_11_0.fecha_desactivacion, "HH:mm") : "\u2014");
    \u0275\u0275advance(7);
    \u0275\u0275conditional(64, ((tmp_12_0 = ctx_r1.selectedVisit()) == null ? null : tmp_12_0.url_activacion) ? 64 : 65);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(((tmp_13_0 = ctx_r1.selectedVisit()) == null ? null : tmp_13_0.fecha_activacion) ? \u0275\u0275pipeBind2(68, 21, (tmp_13_0 = ctx_r1.selectedVisit()) == null ? null : tmp_13_0.fecha_activacion, "dd/MM/yyyy HH:mm") : "\u2014");
    \u0275\u0275advance(5);
    \u0275\u0275conditional(72, ((tmp_14_0 = ctx_r1.selectedVisit()) == null ? null : tmp_14_0.url_desactivacion) ? 72 : 73);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(((tmp_15_0 = ctx_r1.selectedVisit()) == null ? null : tmp_15_0.fecha_desactivacion) ? \u0275\u0275pipeBind2(76, 24, (tmp_15_0 = ctx_r1.selectedVisit()) == null ? null : tmp_15_0.fecha_desactivacion, "dd/MM/yyyy HH:mm") : "\u2014");
  }
}
function CentroMandoComponent_Conditional_17_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 256)(1, "p", 261);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const msg_r34 = ctx.$implicit;
    \u0275\u0275property("ngClass", msg_r34.sender_type === "mercaderista" ? "bg-[#21262d] text-white mr-auto" : "bg-[#1f6feb] text-white ml-auto");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(msg_r34.sender_nombre);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", msg_r34.mensaje, " ");
  }
}
function CentroMandoComponent_Conditional_17_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 257)(1, "mat-icon", 262);
    \u0275\u0275text(2, "forum");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 263);
    \u0275\u0275text(4, "No hay mensajes a\xFAn.");
    \u0275\u0275elementEnd()();
  }
}
function CentroMandoComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r33 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 176);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_17_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r33);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeChat());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 252)(3, "div", 253)(4, "span", 254)(5, "mat-icon");
    \u0275\u0275text(6, "chat");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 255);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_17_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r33);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeChat());
    });
    \u0275\u0275elementStart(9, "mat-icon");
    \u0275\u0275text(10, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 190);
    \u0275\u0275repeaterCreate(12, CentroMandoComponent_Conditional_17_For_13_Template, 4, 3, "div", 256, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275template(14, CentroMandoComponent_Conditional_17_Conditional_14_Template, 5, 0, "div", 257);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 258)(16, "input", 259);
    \u0275\u0275twoWayListener("ngModelChange", function CentroMandoComponent_Conditional_17_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r33);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.chatInput, $event) || (ctx_r1.chatInput = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("keyup.enter", function CentroMandoComponent_Conditional_17_Template_input_keyup_enter_16_listener() {
      \u0275\u0275restoreView(_r33);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sendChat());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "button", 260);
    \u0275\u0275listener("click", function CentroMandoComponent_Conditional_17_Template_button_click_17_listener() {
      \u0275\u0275restoreView(_r33);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sendChat());
    });
    \u0275\u0275elementStart(18, "mat-icon");
    \u0275\u0275text(19, "send");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" Chat de Visita #", (tmp_1_0 = ctx_r1.chatVisita()) == null ? null : tmp_1_0.id_visita, "");
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r1.chatMessages());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(14, !ctx_r1.chatMessages().length ? 14 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.chatInput);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.chatSending() || !ctx_r1.chatInput.trim());
  }
}
var CentroMandoComponent = class _CentroMandoComponent {
  // ─── Filtros Globales (Día) ────────────────────────────────────────────────
  get fecha() {
    return this.filtroDesde;
  }
  set fecha(val) {
    this.filtroDesde = val;
  }
  // ─── Helpers ─────────────────────────────────────────────────────────────
  get diaSemana() {
    const DIAS = ["Domingo", "Lunes", "Martes", "Mi\xE9rcoles", "Jueves", "Viernes", "S\xE1bado"];
    const d = /* @__PURE__ */ new Date(this.filtroDesde + "T12:00:00");
    return DIAS[d.getDay()];
  }
  get fechaDisplay() {
    const d = /* @__PURE__ */ new Date(this.filtroDesde + "T12:00:00");
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  }
  get isHoy() {
    return this.filtroDesde === this.todayStr() && this.filtroHasta === this.todayStr();
  }
  get labelPeriodo() {
    return this.filtroDesde === this.filtroHasta ? "HOY" : "EN PER\xCDODO";
  }
  get dateRangeDisplay() {
    if (this.filtroDesde === this.filtroHasta) {
      const d = /* @__PURE__ */ new Date(this.filtroDesde + "T12:00:00");
      const DIAS = ["Domingo", "Lunes", "Martes", "Mi\xE9rcoles", "Jueves", "Viernes", "S\xE1bado"];
      const dia = DIAS[d.getDay()];
      return `${dia} ${this.formatDateDMY(this.filtroDesde)}`;
    } else {
      return `${this.formatDateDMY(this.filtroDesde)} al ${this.formatDateDMY(this.filtroHasta)}`;
    }
  }
  formatDateDMY(dateStr) {
    const d = /* @__PURE__ */ new Date(dateStr + "T12:00:00");
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  }
  constructor(api, auth, realtime) {
    this.api = api;
    this.auth = auth;
    this.realtime = realtime;
    this.vista = signal("activaciones");
    this.loadingResumen = signal(true);
    this.loadingActivaciones = signal(false);
    this.resumenDia = signal(null);
    this.activaciones = signal([]);
    this.stats = signal({});
    this.porMercaderista = signal([]);
    this.pendientes = signal([]);
    this.gestionPorDia = signal({ fechas: [], clientes: [] });
    this.clientes = signal([]);
    this.filtroCliente = null;
    this.filtroDesde = this.todayStr();
    this.filtroHasta = this.todayStr();
    this.activeView = "dashboard";
    this.showDetalle = null;
    this.detalleList = [];
    this.showModalPdvs = false;
    this.modalPdvs = { pendientes: [], activos: [], completados: [] };
    this.searchText = "";
    this.tabPunto = "act";
    this.tabCliente = "act";
    this.lightboxOpen = signal(false);
    this.lightboxUrl = signal(null);
    this.lightboxTitle = "";
    this.visitDetailOpen = signal(false);
    this.selectedVisit = signal(null);
    this.mercDetailOpen = signal(false);
    this.selectedMercDet = signal(null);
    this.chatOpen = signal(false);
    this.chatVisita = signal(null);
    this.chatMessages = signal([]);
    this.chatInput = "";
    this.chatSending = signal(false);
  }
  ngOnInit() {
    this.loadClientes();
    this.loadResumenDia();
    this.loadActivaciones();
    this.realtime.events$.subscribe((ev) => {
      if (ev.tipo.startsWith("visit.") || ev.tipo.startsWith("photo.")) {
        clearTimeout(this.rtDebounce);
        this.rtDebounce = setTimeout(() => {
          this.loadResumenDia();
          this.loadActivaciones();
        }, 800);
      }
    });
  }
  todayStr() {
    return formatDate(/* @__PURE__ */ new Date(), "yyyy-MM-dd", "en-US");
  }
  addDays(dateStr, n) {
    const d = /* @__PURE__ */ new Date(dateStr + "T12:00:00");
    d.setDate(d.getDate() + n);
    return formatDate(d, "yyyy-MM-dd", "en-US");
  }
  // ─── Cargas ───────────────────────────────────────────────────────────────
  loadClientes() {
    this.api.getCentroMandoClientes().subscribe({
      next: (res) => {
        if (res.success)
          this.clientes.set(res.clientes);
      },
      error: () => {
      }
    });
  }
  loadResumenDia() {
    this.loadingResumen.set(true);
    const opts = { desde: this.filtroDesde, hasta: this.filtroHasta };
    if (this.filtroCliente)
      opts.cliente_id = this.filtroCliente;
    this.api.getCentroMandoResumenDia(opts).subscribe({
      next: (res) => {
        if (res.success) {
          this.resumenDia.set(res);
          if (this.showDetalle === "activos") {
            this.detalleList = res.mercaderistas?.activos || [];
          } else if (this.showDetalle === "faltantes") {
            this.detalleList = res.mercaderistas?.faltantes || [];
          }
        }
        this.loadingResumen.set(false);
      },
      error: () => this.loadingResumen.set(false)
    });
  }
  loadActivaciones() {
    this.loadingActivaciones.set(true);
    const opts = { desde: this.filtroDesde, hasta: this.filtroHasta };
    if (this.filtroCliente)
      opts.cliente_id = this.filtroCliente;
    this.api.getCentroMandoActivaciones(opts).subscribe({
      next: (res) => {
        if (res.success) {
          this.activaciones.set(res.activaciones || []);
          this.stats.set(res.stats || {});
          this.porMercaderista.set(res.por_mercaderista || []);
          this.pendientes.set(res.pendientes || []);
          this.gestionPorDia.set(res.gestion_por_dia || { fechas: [], clientes: [] });
        }
        this.loadingActivaciones.set(false);
      },
      error: () => this.loadingActivaciones.set(false)
    });
  }
  // ─── Acciones Top UI ──────────────────────────────────────────────────────
  irHoy() {
    const today = this.todayStr();
    this.filtroDesde = today;
    this.filtroHasta = today;
    this.refresh();
  }
  navegarFecha(dias) {
    this.filtroDesde = this.addDays(this.filtroDesde, dias);
    this.filtroHasta = this.addDays(this.filtroHasta, dias);
    this.refresh();
  }
  refresh() {
    this.loadResumenDia();
    this.loadActivaciones();
  }
  onClienteChange() {
    this.refresh();
  }
  buscarRango() {
    this.refresh();
  }
  // ─── Toggle Detalle Mercaderistas ─────────────────────────────────────────
  toggleDetalle(tipo) {
    if (this.showDetalle === tipo) {
      this.showDetalle = null;
      this.detalleList = [];
    } else {
      this.showDetalle = tipo;
      const r = this.resumenDia();
      if (!r)
        return;
      this.detalleList = tipo === "activos" ? r.mercaderistas.activos : r.mercaderistas.faltantes;
    }
  }
  // ─── Modal PDVs ───────────────────────────────────────────────────────────
  openPdvsModal() {
    const pts = this.resumenDia()?.puntos_interes?.detalle || [];
    this.modalPdvs = { pendientes: [], activos: [], completados: [] };
    for (const p of pts) {
      const com = p.com ?? (p.clientes_com ?? 0);
      const act = p.act ?? (p.clientes_act ?? 0);
      if (com > 0 || com === true) {
        this.modalPdvs.completados.push(p);
      } else if (act > 0 || act === true) {
        this.modalPdvs.activos.push(p);
      } else {
        this.modalPdvs.pendientes.push(p);
      }
    }
    this.showModalPdvs = true;
  }
  closeModal() {
    this.showModalPdvs = false;
  }
  onEscape() {
    this.closeModal();
  }
  // ─── Utils UI ─────────────────────────────────────────────────────────────
  irATab(tab) {
    this.activeView = tab;
  }
  /** Lista completa de mercaderistas ASIGNADOS (del resumen) + métricas de
   *  ejecución (del detalle de activaciones). Así aparecen TODOS, no solo los
   *  que ya subieron foto, y los conteos cuadran con el resumen de arriba. */
  get mercaderistasUnificados() {
    return this.porMercaderista();
  }
  get filteredMercaderistas() {
    const q = this.searchText.toLowerCase();
    return this.mercaderistasUnificados.filter((m) => !q || (m.nombre || "").toLowerCase().includes(q));
  }
  /** PDV/clientes pendientes (sin activación) del mercaderista del modal. */
  get mercPendientes() {
    const m = this.selectedMercDet();
    if (!m)
      return [];
    return this.pendientes().filter((p) => p.id_mercaderista === m.id_mercaderista);
  }
  openLightbox(url, title) {
    if (!url)
      return;
    this.lightboxUrl.set(url);
    this.lightboxTitle = title;
    this.lightboxOpen.set(true);
  }
  closeLightbox() {
    this.lightboxOpen.set(false);
    this.lightboxUrl.set(null);
  }
  /** Duración legible: minutos, pero en horas cuando es >= 60 min. */
  formatDuracion(min) {
    if (min == null)
      return "\u2014";
    if (min < 60)
      return `${min}m`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  }
  openVisitDetail(v) {
    this.selectedVisit.set(v);
    this.visitDetailOpen.set(true);
  }
  closeVisitDetail() {
    this.visitDetailOpen.set(false);
    this.selectedVisit.set(null);
  }
  verMercDesdeVisita(v) {
    const m = this.mercaderistasUnificados.find((x) => x.id_mercaderista === v.id_mercaderista);
    this.closeVisitDetail();
    if (m)
      this.openMercDetail(m);
  }
  estadoVisitaLabel(v) {
    return v.estado_presencia === "completa" ? "Completa" : v.estado_presencia === "activo" ? "Activa" : "Solo salida";
  }
  get filteredPendientes() {
    const q = this.searchText.toLowerCase();
    return this.pendientes().filter((p) => !q || (p.mercaderista || "").toLowerCase().includes(q) || (p.cliente || "").toLowerCase().includes(q) || (p.punto_de_interes || "").toLowerCase().includes(q));
  }
  get filteredLista() {
    const q = this.searchText.toLowerCase();
    return this.activaciones().filter((v) => !q || (v.mercaderista || "").toLowerCase().includes(q) || (v.cliente || "").toLowerCase().includes(q) || (v.punto_de_interes || "").toLowerCase().includes(q));
  }
  get pendientesGroupedByMerc() {
    const groups = {};
    for (const p of this.filteredPendientes) {
      const k = p.mercaderista || "Sin asignar";
      if (!groups[k])
        groups[k] = [];
      groups[k].push(p);
    }
    return Object.keys(groups).sort().map((k) => ({ mercaderista: k, items: groups[k] }));
  }
  getCompletadoForId(id, type) {
    const arr = type === "punto" ? this.stats()?.pp_completas : this.stats()?.pc_completas;
    if (!arr)
      return null;
    return arr.find((x) => x.id === id) || null;
  }
  pct(n, t) {
    return t ? Math.round(n / t * 100) : 0;
  }
  getBarColor(pct) {
    if (pct >= 90)
      return "#22c55e";
    if (pct >= 60)
      return "#f59e0b";
    return "#ef4444";
  }
  /** % de la barra según el toggle Act./Comp. (estilo v1). */
  pctFor(t, type) {
    const tab = type === "punto" ? this.tabPunto : this.tabCliente;
    if (tab === "com")
      return this.getCompletadoForId(t.id, type)?.porcentaje || 0;
    return t.porcentaje || 0;
  }
  /** Conteo "con/total" según el toggle Act./Comp. */
  countFor(t, type) {
    const tab = type === "punto" ? this.tabPunto : this.tabCliente;
    if (tab === "com")
      return `${this.getCompletadoForId(t.id, type)?.con || 0}/${t.total}`;
    return `${t.con || 0}/${t.total}`;
  }
  /** Texto de ayuda según el toggle activo. */
  helpFor(tab) {
    return tab === "act" ? "Activado = la visita tiene foto de activaci\xF3n (apertura)." : "Completado = la visita tiene activaci\xF3n (apertura) y cierre.";
  }
  /** Tooltip detallado para el ícono de info. */
  get barsTooltip() {
    return "Cada fila es un PDV (Por Punto) o un cliente (Por Cliente). El n\xFAmero con/total = visitas con la foto requerida / visitas PLANIFICADAS en el per\xEDodo. Act.: cuenta las visitas con foto de activaci\xF3n (apertura). Comp.: cuenta las visitas con activaci\xF3n Y cierre. Por eso en Act. un punto puede salir <100% si alguna visita solo tiene foto de cierre sin activaci\xF3n, y en Comp. baja si se activ\xF3 pero no se cerr\xF3.";
  }
  openMercDetail(m) {
    this.selectedMercDet.set(m);
    this.mercDetailOpen.set(true);
  }
  closeMercDetail() {
    this.mercDetailOpen.set(false);
    this.selectedMercDet.set(null);
  }
  get mercVisitas() {
    const m = this.selectedMercDet();
    if (!m)
      return [];
    return this.activaciones().filter((v) => v.id_mercaderista === m.id_mercaderista);
  }
  estadoLabel(v) {
    return v.estado_presencia === "completa" ? "Completa" : v.estado_presencia === "activo" ? "Activo" : "Solo salida";
  }
  estadoClass(v) {
    return v.estado_presencia === "completa" ? "bg-emerald-950 text-emerald-400" : v.estado_presencia === "activo" ? "bg-amber-950 text-amber-400" : "bg-red-950 text-red-400";
  }
  openChat(v) {
    this.chatVisita.set(v);
    this.chatOpen.set(true);
    this.chatInput = "";
    this.loadChat();
  }
  loadChat() {
    const v = this.chatVisita();
    if (!v)
      return;
    this.api.getMessagesByVisit(v.id_visita).subscribe({
      next: (msgs) => this.chatMessages.set(msgs || []),
      error: () => this.chatMessages.set([])
    });
  }
  closeChat() {
    this.chatOpen.set(false);
    this.chatVisita.set(null);
    this.chatMessages.set([]);
  }
  sendChat() {
    const v = this.chatVisita();
    const txt = this.chatInput.trim();
    if (!v || !txt)
      return;
    this.chatSending.set(true);
    this.api.sendMessage({ visita_id: v.id_visita, mensaje: txt }).subscribe({
      next: () => {
        this.chatInput = "";
        this.chatSending.set(false);
        this.loadChat();
      },
      error: () => this.chatSending.set(false)
    });
  }
  getGestionColorClass(pct) {
    if (pct >= 95)
      return "cell-green";
    if (pct >= 75)
      return "cell-amber";
    return "cell-red";
  }
  static {
    this.\u0275fac = function CentroMandoComponent_Factory(t) {
      return new (t || _CentroMandoComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(RealtimeService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CentroMandoComponent, selectors: [["app-centro-mando"]], hostBindings: function CentroMandoComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("keydown.escape", function CentroMandoComponent_keydown_escape_HostBindingHandler() {
          return ctx.onEscape();
        }, false, \u0275\u0275resolveDocument);
      }
    }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 18, vars: 8, consts: [[1, "cm-wrapper"], [1, "flex", "justify-center", "mb-6"], [1, "inline-flex", "gap-1", "bg-slate-100", "dark:bg-slate-800", "p-1", "rounded-2xl", "shadow-sm"], [1, "flex", "items-center", "gap-2", "px-7", "py-2.5", "rounded-xl", "text-sm", "font-black", "transition-all", 3, "click", "ngClass"], [1, "!text-base"], [1, "cm-modal-overlay"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4"], [1, "fixed", "inset-0", "z-[70]", "flex", "items-center", "justify-center", "p-4"], [1, "fixed", "inset-0", "z-[55]", "flex", "items-center", "justify-center", "p-4"], [1, "fixed", "inset-0", "z-[60]", "flex", "items-center", "justify-center", "p-4"], [1, "cm-header"], [1, "cm-header-left"], [1, "cm-header-icon"], [1, "cm-title"], [1, "cm-subtitle"], [1, "cm-header-right"], [1, "cm-select-wrap"], [1, "cm-select-icon"], [1, "cm-select", 3, "ngModelChange", "change", "ngModel"], [3, "ngValue"], [1, "cm-select-arrow"], [1, "cm-date-range-box"], [1, "cm-date-input"], ["type", "date", 3, "ngModelChange", "change", "ngModel"], [1, "cm-date-sep"], [1, "cm-hoy-btn", 3, "click"], [1, "cm-refresh-btn", 3, "click"], [1, "cm-loading-top"], [1, "cm-tabs-bar"], [1, "cm-tab", 3, "click"], [1, "cm-badge"], [1, "cm-badge", "danger"], [1, "cm-dash-filters"], [1, "cm-search-box", "flex-1", "max-w-[300px]"], ["type", "text", "placeholder", "Buscar en resultados...", 3, "ngModelChange", "ngModel"], [1, "cm-content"], [1, "cm-loading-center"], ["diameter", "36", "strokeWidth", "3"], [1, "cm-stats-grid"], [1, "cm-stat-card", "border-blue"], [1, "cm-stat-icon", "blue"], [1, "cm-stat-body"], [1, "cm-stat-num"], [1, "cm-stat-label"], [1, "cm-stat-sub"], [1, "cm-stat-card", "border-purple"], [1, "cm-stat-icon", "purple"], [1, "cm-stat-card", "border-green"], [1, "cm-stat-icon", "green"], [1, "cm-detail-link", 3, "click"], [1, "!text-[14px]"], [1, "cm-stat-card", "border-red"], [1, "cm-stat-icon", "red"], [1, "cm-inline-detail"], [1, "cm-secondary-grid", "mt-2"], [1, "cm-sec-card"], [1, "cm-sec-header"], [1, "cm-sec-icon"], [1, "cm-sec-title"], [1, "cm-sec-metrics"], [1, "cm-metric"], [1, "cm-metric-num"], [1, "cm-metric-lbl"], [1, "cm-metric-sep"], [1, "cm-metric-num", "orange"], [1, "cm-pdvs-link", 3, "click"], [1, "!text-[13px]"], [1, "cm-inline-header"], [1, "title"], [1, "count"], [1, "cm-inline-cards"], [1, "cm-merc-inline-card"], [1, "mic-empty"], [1, "mic-top"], [1, "user-ic"], [1, "mic-name"], [1, "status-pill"], [1, "mic-rutas"], [1, "l"], [1, "v", 3, "title"], [1, "mic-stats"], [1, "m-box"], [1, "b"], ["title", "Rutas (Planificadas / Activas / Completadas)", 1, "m-box"], [3, "class"], [1, "cm-no-tradex"], [3, "click"], ["diameter", "40", "strokeWidth", "3"], [1, "cm-bars-grid"], [1, "cm-bars-card"], [1, "cm-bars-header", "flex", "items-start", "justify-between", "gap-2"], [1, "min-w-0"], [1, "title", "flex", "items-center", "gap-1.5"], [1, "!text-base", "text-[#58a6ff]"], ["matTooltipClass", "cm-tooltip", 1, "!text-sm", "text-[#8b949e]", "cursor-help", 3, "matTooltip"], [1, "text-[11px]", "text-[#8b949e]", "mt-0.5"], [1, "flex", "gap-1", "bg-[#161b22]", "border", "border-white/10", "rounded-lg", "p-0.5", "shrink-0"], [1, "px-3", "py-1", "rounded-md", "text-xs", "font-bold", "flex", "items-center", "gap-1", "transition-all", 3, "click", "ngClass"], [1, "!text-sm"], [1, "px-1", "pt-1"], [1, "flex", "items-center", "gap-3", "py-2.5", "border-b", "border-white/5", "last:border-0"], [1, "cm-empty"], [1, "flex-1", "min-w-0", "truncate", "text-sm", "font-semibold", "text-[#c9d1d9]", 3, "title"], [1, "w-28", "sm:w-40", "h-2", "rounded-full", "bg-[#21262d]", "overflow-hidden", "shrink-0"], [1, "h-full", "rounded-full", "transition-all", "duration-300"], [1, "w-11", "text-right", "text-sm", "font-black", "shrink-0"], [1, "w-12", "text-right", "text-xs", "text-[#8b949e]", "shrink-0"], [1, "flex", "items-start", "gap-2", "text-xs", "text-[#8b949e]", "bg-[#161b22]", "border", "border-white/5", "rounded-xl", "px-4", "py-2.5", "mb-3"], [1, "!text-base", "text-[#58a6ff]", "shrink-0"], [1, "cm-empty-state"], [1, "cm-merc-grid"], [1, "cm-merc-card"], [1, "cm-merc-top"], [1, "cm-avatar"], [1, "cm-merc-info"], [1, "cm-pill", "green"], [1, "flex", "items-center", "gap-3", "text-[11px]", "text-[#8b949e]", "mt-1", "mb-2", "px-0.5"], [1, "flex", "items-center", "gap-1"], [1, "grid", "grid-cols-3", "gap-2", "mb-3"], [1, "text-center"], [1, "text-xl", "font-black", "text-[#3fb950]"], [1, "text-[9px]", "text-[#8b949e]", "uppercase", "tracking-wider"], [1, "text-xl", "font-black", "text-[#58a6ff]"], [1, "text-xl", "font-black", "text-[#f59e0b]"], [1, "space-y-1.5"], [1, "flex", "items-center", "gap-2"], [1, "w-[88px]", "text-[11px]", "text-[#8b949e]", "shrink-0"], [1, "flex-1", "h-2", "rounded-full", "bg-[#21262d]", "overflow-hidden"], [1, "h-full", "rounded-full"], [1, "w-11", "text-right", "text-[11px]", "font-bold", "shrink-0"], [1, "w-10", "text-right", "text-[10px]", "text-[#8b949e]", "shrink-0"], [1, "mt-3", "w-full", "flex", "items-center", "justify-center", "gap-1.5", "py-2", "rounded-lg", "bg-[#1f6feb]", "hover:bg-[#388bfd]", "text-white", "text-xs", "font-bold", "transition-all", 3, "click"], [1, "dot"], [1, "cm-pill", "gray"], [1, "cm-table-wrap"], [1, "cm-table"], [1, "sticky-col"], [1, "sticky-col", "name-col", 3, "title"], [1, "cell-empty"], [1, "cm-pend-grid"], [1, "cm-pend-card"], [1, "cm-pend-head"], [1, "cm-pend-count"], [1, "cm-pend-list"], [1, "cm-pend-item"], [1, "cm-pend-name"], [1, "cm-pend-tags"], [1, "tag", "blue"], [1, "tag", "gray"], [1, "text-right"], [1, "status-pill", "green"], [1, "fw"], [1, "cl"], [1, "sub"], [1, "mono"], [1, "dur"], [1, "flex", "items-center", "justify-end", "gap-1.5"], ["matTooltip", "Chat de la visita", 1, "w-8", "h-8", "rounded-lg", "bg-[#21262d]", "hover:bg-[#30363d]", "text-[#58a6ff]", "inline-flex", "items-center", "justify-center", "transition-colors", 3, "click"], ["matTooltip", "Ver detalle", 1, "w-8", "h-8", "rounded-lg", "bg-[#1f6feb]", "hover:bg-[#388bfd]", "text-white", "inline-flex", "items-center", "justify-center", "transition-colors", 3, "click"], [1, "status-pill", "amber"], [1, "status-pill", "gray"], [1, "no-dur"], [1, "cm-modal-overlay", 3, "click"], [1, "cm-modal", 3, "click"], [1, "cm-modal-header"], [1, "subtitle"], [1, "cm-modal-body"], [1, "pdv-section"], [1, "pdv-header", "gray"], [1, "pdv-table"], [1, "pdv-header", "blue"], [1, "pdv-header", "green"], [1, "cm-modal-footer"], [1, "btn-close", 3, "click"], ["colspan", "4", 1, "text-center", "text-muted"], ["colspan", "5", 1, "text-center", "text-muted"], [1, "absolute", "inset-0", "bg-black/70", "backdrop-blur-sm", 3, "click"], [1, "relative", "w-full", "max-w-3xl", "bg-[#0d1117]", "border", "border-white/10", "rounded-3xl", "shadow-2xl", "overflow-hidden", "flex", "flex-col", 2, "max-height", "90vh"], [1, "px-6", "py-4", "border-b", "border-white/10", "flex", "items-center", "justify-between", "shrink-0"], [1, "flex", "items-center", "gap-3"], [1, "w-11", "h-11", "rounded-2xl", "bg-gradient-to-br", "from-[#1f6feb]", "to-indigo-600", "flex", "items-center", "justify-center", "text-white", "font-black"], [1, "text-lg", "font-black", "text-white"], [1, "text-xs", "text-[#8b949e]"], [1, "w-9", "h-9", "rounded-xl", "bg-white/5", "hover:bg-white/10", "flex", "items-center", "justify-center", "text-slate-400", 3, "click"], [1, "grid", "grid-cols-4", "sm:grid-cols-7", "gap-2", "px-6", "py-3", "border-b", "border-white/5", "shrink-0", "text-center"], [1, "text-[9px]", "text-[#8b949e]", "uppercase"], [1, "text-lg", "font-black", "text-[#3fb950]"], [1, "text-lg", "font-black", "text-[#58a6ff]"], [1, "text-lg", "font-black", "text-[#f59e0b]"], [1, "text-lg", "font-black"], [1, "flex-1", "overflow-y-auto", "p-4", "space-y-2"], [1, "bg-[#161b22]", "border", "border-white/5", "rounded-2xl", "p-3"], [1, "text-center", "text-[#8b949e]", "py-10"], [1, "mt-3", "pt-3", "border-t", "border-white/10"], [1, "flex", "items-start", "justify-between", "gap-2"], [1, "font-bold", "text-white", "text-sm", "truncate"], [1, "text-xs", "text-[#8b949e]", "truncate"], [1, "flex", "items-center", "gap-2", "shrink-0"], [1, "px-2", "py-1", "rounded-lg", "text-[10px]", "font-black", "uppercase", 3, "ngClass"], ["matTooltip", "Chat de la visita", 1, "w-8", "h-8", "rounded-lg", "bg-[#1f6feb]", "hover:bg-[#388bfd]", "text-white", "flex", "items-center", "justify-center", 3, "click"], [1, "flex", "items-center", "gap-2", "mt-2"], [1, "flex-1"], ["loading", "lazy", "decoding", "async", "fetchpriority", "low", "onerror", "this.style.display='none'", 1, "h-16", "w-full", "object-cover", "rounded-lg", "border", "border-white/5", "cursor-pointer", "hover:opacity-80", "transition-opacity", 3, "src"], [1, "text-[9px]", "text-center", "text-[#8b949e]", "mt-0.5"], [1, "text-[#8b949e]"], ["loading", "lazy", "decoding", "async", "fetchpriority", "low", "onerror", "this.style.display='none'", 1, "h-16", "w-full", "object-cover", "rounded-lg", "border", "border-white/5", "cursor-pointer", "hover:opacity-80", "transition-opacity", 3, "click", "src"], [1, "h-16", "rounded-lg", "border", "border-dashed", "border-white/10", "flex", "items-center", "justify-center", "text-[10px]", "text-[#8b949e]"], [1, "text-xs", "font-black", "text-[#f85149]", "uppercase", "tracking-wider", "mb-2", "flex", "items-center", "gap-1.5"], [1, "flex", "items-center", "justify-between", "gap-2", "bg-[#1a1416]", "border", "border-[#5a1f1f]", "rounded-xl", "px-3", "py-2"], [1, "text-sm", "font-bold", "text-white", "truncate"], [1, "text-[11px]", "text-[#8b949e]", "truncate"], [1, "text-[10px]", "text-[#8b949e]", "shrink-0", "bg-[#21262d]", "rounded-lg", "px-2", "py-1"], [1, "fixed", "inset-0", "z-[70]", "flex", "items-center", "justify-center", "p-4", 3, "click"], [1, "absolute", "inset-0", "bg-black/85"], [1, "relative", "max-w-3xl", "w-full", 3, "click"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "text-white", "font-black", "text-lg"], ["target", "_blank", "download", "", "matTooltip", "Descargar", 1, "w-9", "h-9", "rounded-xl", "bg-white/10", "hover:bg-white/20", "text-white", "flex", "items-center", "justify-center", 3, "href"], [1, "w-9", "h-9", "rounded-xl", "bg-white/10", "hover:bg-white/20", "text-white", "flex", "items-center", "justify-center", 3, "click"], [1, "w-full", "max-h-[80vh]", "object-contain", "rounded-2xl", "shadow-2xl", 3, "src"], [1, "absolute", "inset-0", "bg-black/75", "backdrop-blur-sm", 3, "click"], [1, "relative", "w-full", "max-w-3xl", "bg-[#0d1117]", "border", "border-white/10", "rounded-3xl", "shadow-2xl", "overflow-hidden", "flex", "flex-col", 2, "max-height", "92vh"], [1, "px-6", "py-4", "border-b", "border-white/10", "shrink-0"], [1, "flex", "items-start", "justify-between", "gap-3"], [1, "text-amber-400"], [1, "w-9", "h-9", "rounded-xl", "bg-white/5", "hover:bg-white/10", "text-slate-400", "flex", "items-center", "justify-center", "shrink-0", 3, "click"], [1, "flex", "flex-wrap", "gap-2", "mt-2"], [1, "px-2.5", "py-1", "bg-white/8", "rounded-lg", "text-xs", "font-bold", "text-slate-200"], [1, "px-2.5", "py-1", "bg-[#1f6feb]", "rounded-lg", "text-xs", "font-bold", "text-white"], [1, "px-2.5", "py-1", "bg-white/8", "rounded-lg", "text-xs", "font-bold", "text-slate-400"], [1, "flex-1", "overflow-y-auto", "p-6", "space-y-4"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-2"], [1, "bg-[#161b22]", "border", "border-white/5", "rounded-xl", "px-3", "py-2"], [1, "text-[10px]", "text-[#8b949e]", "uppercase"], [1, "text-sm", "font-bold", "text-white"], [1, "flex", "items-center", "gap-3", "bg-[#161b22]", "border", "border-white/5", "rounded-xl", "px-4", "py-3", "text-xs"], [1, "flex", "items-center", "gap-1.5"], [1, "w-2.5", "h-2.5", "rounded-full", "bg-[#3fb950]"], [1, "font-bold", "text-white"], [1, "flex-1", "border-t", "border-dashed", "border-white/15", "text-center", "-mt-2"], [1, "bg-[#0d1117]", "px-2", "text-amber-400", "font-bold"], [1, "w-2.5", "h-2.5", "rounded-full", "bg-[#f85149]"], [1, "grid", "grid-cols-2", "gap-3"], [1, "text-sm", "font-bold", "text-white", "mb-1"], ["loading", "lazy", "decoding", "async", "onerror", "this.style.display='none'", 1, "w-full", "h-56", "object-cover", "rounded-xl", "border", "border-white/5", "cursor-pointer", "hover:opacity-80", "transition-opacity", 3, "src"], [1, "text-[10px]", "text-[#8b949e]", "mt-1"], [1, "px-6", "py-4", "border-t", "border-white/10", "flex", "justify-end", "gap-2", "shrink-0"], [1, "flex", "items-center", "gap-1.5", "px-4", "py-2", "rounded-xl", "bg-[#21262d]", "hover:bg-[#30363d]", "text-[#58a6ff]", "font-bold", "text-sm", "transition-colors", 3, "click"], [1, "flex", "items-center", "gap-1.5", "px-4", "py-2", "rounded-xl", "bg-[#1f6feb]", "hover:bg-[#388bfd]", "text-white", "font-bold", "text-sm", "transition-colors", 3, "click"], [1, "px-4", "py-2", "rounded-xl", "border", "border-white/15", "text-slate-300", "hover:text-white", "font-bold", "text-sm", "transition-colors", 3, "click"], ["loading", "lazy", "decoding", "async", "onerror", "this.style.display='none'", 1, "w-full", "h-56", "object-cover", "rounded-xl", "border", "border-white/5", "cursor-pointer", "hover:opacity-80", "transition-opacity", 3, "click", "src"], [1, "w-full", "h-56", "rounded-xl", "border", "border-dashed", "border-white/10", "flex", "items-center", "justify-center", "text-[#8b949e]", "text-sm"], [1, "relative", "w-full", "max-w-lg", "bg-[#0d1117]", "border", "border-white/10", "rounded-3xl", "shadow-2xl", "overflow-hidden", "flex", "flex-col", 2, "height", "min(80vh,560px)"], [1, "bg-gradient-to-r", "from-[#1f6feb]", "to-indigo-600", "px-5", "py-3", "flex", "items-center", "justify-between", "shrink-0"], [1, "text-white", "font-black", "flex", "items-center", "gap-2"], [1, "w-8", "h-8", "rounded-lg", "bg-white/20", "hover:bg-white/30", "text-white", "flex", "items-center", "justify-center", 3, "click"], [1, "max-w-[80%]", "rounded-2xl", "px-3", "py-2", "text-sm", 3, "ngClass"], [1, "h-full", "flex", "flex-col", "items-center", "justify-center", "text-[#8b949e]", "gap-2"], [1, "p-3", "border-t", "border-white/10", "flex", "gap-2", "shrink-0"], ["placeholder", "Escribe un mensaje...", 1, "flex-1", "bg-[#161b22]", "border", "border-white/10", "rounded-xl", "px-3", "py-2", "text-sm", "text-white", "placeholder-[#8b949e]", "outline-none", "focus:border-[#1f6feb]", 3, "ngModelChange", "keyup.enter", "ngModel"], [1, "w-10", "h-10", "rounded-xl", "bg-[#1f6feb]", "hover:bg-[#388bfd]", "disabled:opacity-40", "text-white", "flex", "items-center", "justify-center", 3, "click", "disabled"], [1, "text-[10px]", "opacity-70", "mb-0.5"], [1, "!text-4xl", "opacity-40"], [1, "text-sm"]], template: function CentroMandoComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "button", 3);
        \u0275\u0275listener("click", function CentroMandoComponent_Template_button_click_3_listener() {
          return ctx.vista.set("activaciones");
        });
        \u0275\u0275elementStart(4, "mat-icon", 4);
        \u0275\u0275text(5, "bolt");
        \u0275\u0275elementEnd();
        \u0275\u0275text(6, " Activaciones ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "button", 3);
        \u0275\u0275listener("click", function CentroMandoComponent_Template_button_click_7_listener() {
          return ctx.vista.set("visitas");
        });
        \u0275\u0275elementStart(8, "mat-icon", 4);
        \u0275\u0275text(9, "fact_check");
        \u0275\u0275elementEnd();
        \u0275\u0275text(10, " Visitas ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(11, CentroMandoComponent_Conditional_11_Template, 1, 0, "app-revision-visitas")(12, CentroMandoComponent_Conditional_12_Template, 78, 25);
        \u0275\u0275elementEnd();
        \u0275\u0275template(13, CentroMandoComponent_Conditional_13_Template, 74, 11, "div", 5)(14, CentroMandoComponent_Conditional_14_Template, 56, 17, "div", 6)(15, CentroMandoComponent_Conditional_15_Template, 14, 3, "div", 7)(16, CentroMandoComponent_Conditional_16_Template, 88, 27, "div", 8)(17, CentroMandoComponent_Conditional_17_Template, 20, 4, "div", 9);
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("ngClass", ctx.vista() === "activaciones" ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300");
        \u0275\u0275advance(4);
        \u0275\u0275property("ngClass", ctx.vista() === "visitas" ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300");
        \u0275\u0275advance(4);
        \u0275\u0275conditional(11, ctx.vista() === "visitas" ? 11 : 12);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(13, ctx.showModalPdvs ? 13 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(14, ctx.mercDetailOpen() ? 14 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(15, ctx.lightboxOpen() ? 15 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(16, ctx.visitDetailOpen() ? 16 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(17, ctx.chatOpen() ? 17 : -1);
      }
    }, dependencies: [
      CommonModule,
      NgClass,
      DatePipe,
      FormsModule,
      NgSelectOption,
      \u0275NgSelectMultipleOption,
      DefaultValueAccessor,
      SelectControlValueAccessor,
      NgControlStatus,
      NgModel,
      MatIconModule,
      MatIcon,
      MatButtonModule,
      MatProgressSpinnerModule,
      MatProgressSpinner,
      MatTooltipModule,
      MatTooltip,
      RevisionVisitasComponent
    ], styles: ['\n\n.cm-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  font-family:\n    "Inter",\n    "Segoe UI",\n    sans-serif;\n  color: #e6edf3;\n}\n.cm-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 12px;\n  background: #161b22;\n  border: 1px solid #21262d;\n  border-radius: 12px;\n  padding: 16px 20px;\n}\n.cm-header-left[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.cm-header-icon[_ngcontent-%COMP%] {\n  color: #58a6ff;\n  font-size: 22px !important;\n  width: 22px !important;\n  height: 22px !important;\n}\n.cm-title[_ngcontent-%COMP%] {\n  font-size: 16px;\n  font-weight: 700;\n  color: #e6edf3;\n  margin: 0;\n}\n.cm-subtitle[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #8b949e;\n  margin: 2px 0 0;\n}\n.cm-header-right[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.cm-select-wrap[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  background: #0d1117;\n  border: 1px solid #21262d;\n  border-radius: 8px;\n  padding: 6px 10px;\n  gap: 6px;\n  cursor: pointer;\n}\n.cm-select-wrap[_ngcontent-%COMP%]   .cm-select-icon[_ngcontent-%COMP%] {\n  color: #8b949e;\n  font-size: 16px !important;\n  width: 16px !important;\n  height: 16px !important;\n}\n.cm-select-wrap[_ngcontent-%COMP%]   .cm-select-arrow[_ngcontent-%COMP%] {\n  color: #8b949e;\n  font-size: 16px !important;\n  width: 16px !important;\n  height: 16px !important;\n}\n.cm-select[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  outline: none;\n  color: #e6edf3;\n  font-size: 13px;\n  font-weight: 500;\n  cursor: pointer;\n  max-width: 200px;\n}\n.cm-select[_ngcontent-%COMP%]   option[_ngcontent-%COMP%] {\n  background: #161b22;\n  color: #e6edf3;\n}\n.cm-date-nav[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  background: #0d1117;\n  border: 1px solid #21262d;\n  border-radius: 8px;\n  overflow: hidden;\n}\n.cm-nav-btn[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  color: #8b949e;\n  cursor: pointer;\n  padding: 6px 8px;\n  display: flex;\n  align-items: center;\n  transition: color 0.15s, background 0.15s;\n}\n.cm-nav-btn[_ngcontent-%COMP%]:hover {\n  background: #21262d;\n  color: #e6edf3;\n}\n.cm-nav-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px !important;\n  width: 18px !important;\n  height: 18px !important;\n}\n.cm-date-label[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 600;\n  color: #e6edf3;\n  padding: 0 12px;\n  border-left: 1px solid #21262d;\n  border-right: 1px solid #21262d;\n  white-space: nowrap;\n}\n.cm-hoy-btn[_ngcontent-%COMP%] {\n  background: transparent;\n  border: 1px solid #21262d;\n  border-radius: 8px;\n  color: #8b949e;\n  font-size: 13px;\n  font-weight: 600;\n  padding: 6px 14px;\n  cursor: pointer;\n  transition: all 0.15s;\n}\n.cm-hoy-btn[_ngcontent-%COMP%]:hover, .cm-hoy-btn.active[_ngcontent-%COMP%] {\n  border-color: #58a6ff;\n  color: #58a6ff;\n  background: rgba(88, 166, 255, 0.08);\n}\n.cm-refresh-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  background: transparent;\n  border: 1px solid #58a6ff;\n  border-radius: 8px;\n  color: #58a6ff;\n  font-size: 13px;\n  font-weight: 600;\n  padding: 6px 14px;\n  cursor: pointer;\n  transition: all 0.15s;\n}\n.cm-refresh-btn[_ngcontent-%COMP%]:hover {\n  background: rgba(88, 166, 255, 0.12);\n}\n.cm-refresh-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px !important;\n  width: 16px !important;\n  height: 16px !important;\n}\n.cm-loading-top[_ngcontent-%COMP%], .cm-loading-center[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  padding: 32px;\n  color: #8b949e;\n  font-size: 14px;\n}\n.cm-stats-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 12px;\n}\n@media (max-width: 900px) {\n  .cm-stats-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 500px) {\n  .cm-stats-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.cm-stat-card[_ngcontent-%COMP%] {\n  background: #161b22;\n  border: 1px solid #21262d;\n  border-radius: 12px;\n  padding: 16px;\n  display: flex;\n  align-items: flex-start;\n  gap: 12px;\n  border-top: 3px solid transparent;\n}\n.cm-stat-card.border-blue[_ngcontent-%COMP%] {\n  border-top-color: #58a6ff;\n}\n.cm-stat-card.border-purple[_ngcontent-%COMP%] {\n  border-top-color: #bc8cff;\n}\n.cm-stat-card.border-green[_ngcontent-%COMP%] {\n  border-top-color: #3fb950;\n}\n.cm-stat-card.border-red[_ngcontent-%COMP%] {\n  border-top-color: #f85149;\n}\n.cm-stat-icon[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.cm-stat-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 20px !important;\n  width: 20px !important;\n  height: 20px !important;\n}\n.cm-stat-icon.blue[_ngcontent-%COMP%] {\n  background: rgba(88, 166, 255, 0.15);\n  color: #58a6ff;\n}\n.cm-stat-icon.purple[_ngcontent-%COMP%] {\n  background: rgba(188, 140, 255, 0.15);\n  color: #bc8cff;\n}\n.cm-stat-icon.green[_ngcontent-%COMP%] {\n  background: rgba(63, 185, 80, 0.15);\n  color: #3fb950;\n}\n.cm-stat-icon.red[_ngcontent-%COMP%] {\n  background: rgba(248, 81, 73, 0.15);\n  color: #f85149;\n}\n.cm-stat-body[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.cm-stat-num[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: 800;\n  color: #e6edf3;\n  line-height: 1;\n}\n.cm-stat-label[_ngcontent-%COMP%] {\n  font-size: 10px;\n  font-weight: 700;\n  letter-spacing: 0.06em;\n  color: #8b949e;\n  text-transform: uppercase;\n  margin-top: 4px;\n}\n.cm-stat-sub[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: #8b949e;\n  margin-top: 4px;\n}\n.cm-detail-link[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 2px;\n  background: transparent;\n  border: none;\n  color: #39d353;\n  font-size: 11px;\n  font-weight: 600;\n  cursor: pointer;\n  margin-top: 6px;\n  padding: 0;\n  transition: opacity 0.15s;\n}\n.cm-detail-link[_ngcontent-%COMP%]:hover {\n  opacity: 0.75;\n}\n.cm-secondary-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n}\n@media (max-width: 768px) {\n  .cm-secondary-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.cm-sec-card[_ngcontent-%COMP%] {\n  background: #1c2333;\n  border: 1px solid #21262d;\n  border-radius: 12px;\n  padding: 14px 16px;\n}\n.cm-sec-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-bottom: 12px;\n}\n.cm-sec-icon[_ngcontent-%COMP%] {\n  color: #58a6ff;\n  font-size: 18px !important;\n  width: 18px !important;\n  height: 18px !important;\n}\n.cm-sec-title[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 700;\n  color: #e6edf3;\n}\n.cm-sec-metrics[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.cm-metric[_ngcontent-%COMP%] {\n  flex: 1;\n  text-align: center;\n}\n.cm-metric-num[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 24px;\n  font-weight: 800;\n  color: #e6edf3;\n}\n.cm-metric-num.orange[_ngcontent-%COMP%] {\n  color: #f0883e;\n}\n.cm-metric-lbl[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 10px;\n  color: #8b949e;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.cm-metric-sep[_ngcontent-%COMP%] {\n  width: 1px;\n  height: 40px;\n  background: #21262d;\n}\n.cm-pdvs-link[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 2px;\n  background: transparent;\n  border: none;\n  color: #3fb950;\n  font-size: 11px;\n  font-weight: 600;\n  cursor: pointer;\n  margin-top: 10px;\n  padding: 0;\n}\n.cm-pdvs-link[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 13px !important;\n}\n.cm-pdvs-link[_ngcontent-%COMP%]:hover {\n  opacity: 0.75;\n}\n.cm-no-tradex[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #8b949e;\n  text-align: center;\n  padding: 12px 0;\n}\n.cm-tabs-bar[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 4px;\n  background: #161b22;\n  border: 1px solid #21262d;\n  border-radius: 10px;\n  padding: 4px;\n  overflow-x: auto;\n  flex-shrink: 0;\n}\n.cm-tabs-bar[_ngcontent-%COMP%]::-webkit-scrollbar {\n  height: 4px;\n}\n.cm-tabs-bar[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #21262d;\n  border-radius: 4px;\n}\n.cm-tab[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 7px 14px;\n  border: none;\n  border-radius: 7px;\n  background: transparent;\n  color: #8b949e;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  white-space: nowrap;\n  transition: all 0.15s;\n}\n.cm-tab[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px !important;\n  width: 16px !important;\n  height: 16px !important;\n}\n.cm-tab[_ngcontent-%COMP%]:hover {\n  background: #21262d;\n  color: #e6edf3;\n}\n.cm-tab.active[_ngcontent-%COMP%] {\n  background: #58a6ff;\n  color: #fff;\n  pointer-events: none;\n}\n.cm-badge[_ngcontent-%COMP%] {\n  font-size: 10px;\n  font-weight: 800;\n  padding: 1px 6px;\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.15);\n  color: inherit;\n}\n.cm-badge.danger[_ngcontent-%COMP%] {\n  background: rgba(248, 81, 73, 0.25);\n  color: #f85149;\n}\n.cm-tab.active[_ngcontent-%COMP%]   .cm-badge.danger[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.25);\n  color: #fff;\n}\n.cm-content[_ngcontent-%COMP%] {\n  min-height: 300px;\n}\n.cm-dash-filters[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  flex-wrap: wrap;\n  margin-bottom: 16px;\n}\n.cm-period-pills[_ngcontent-%COMP%] {\n  display: flex;\n  background: #161b22;\n  border: 1px solid #21262d;\n  border-radius: 8px;\n  overflow: hidden;\n}\n.cm-period-pills[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  color: #8b949e;\n  font-size: 12px;\n  font-weight: 700;\n  padding: 6px 14px;\n  cursor: pointer;\n  transition: all 0.15s;\n}\n.cm-period-pills[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  color: #e6edf3;\n  background: #21262d;\n}\n.cm-period-pills[_ngcontent-%COMP%]   button.active[_ngcontent-%COMP%] {\n  background: #58a6ff;\n  color: #fff;\n}\n.cm-search-box[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  background: #161b22;\n  border: 1px solid #21262d;\n  border-radius: 8px;\n  padding: 6px 12px;\n  gap: 8px;\n  flex: 1;\n  min-width: 180px;\n  max-width: 360px;\n}\n.cm-search-box[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #8b949e;\n  font-size: 18px !important;\n  width: 18px !important;\n  height: 18px !important;\n}\n.cm-search-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  flex: 1;\n  background: transparent;\n  border: none;\n  outline: none;\n  color: #e6edf3;\n  font-size: 13px;\n}\n.cm-search-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::placeholder {\n  color: #8b949e;\n}\n.cm-search-box[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  color: #8b949e;\n  cursor: pointer;\n  display: flex;\n  padding: 0;\n}\n.cm-search-box[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px !important;\n}\n.cm-search-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  flex-wrap: wrap;\n  margin-bottom: 16px;\n}\n.cm-bars-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 16px;\n}\n@media (max-width: 768px) {\n  .cm-bars-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.cm-bars-card[_ngcontent-%COMP%] {\n  background: #161b22;\n  border: 1px solid #21262d;\n  border-radius: 12px;\n  padding: 16px;\n}\n.cm-bars-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 14px;\n}\n.cm-bars-icon[_ngcontent-%COMP%] {\n  color: #8b949e;\n  font-size: 17px !important;\n  width: 17px !important;\n  height: 17px !important;\n}\n.cm-bars-title[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 700;\n  color: #e6edf3;\n}\n.cm-bars-toggle[_ngcontent-%COMP%] {\n  display: flex;\n  background: #0d1117;\n  border: 1px solid #21262d;\n  border-radius: 6px;\n  overflow: hidden;\n}\n.cm-bars-toggle[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  background: transparent;\n  border: none;\n  color: #8b949e;\n  font-size: 11px;\n  font-weight: 700;\n  padding: 4px 10px;\n  cursor: pointer;\n  transition: all 0.15s;\n}\n.cm-bars-toggle[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  color: #e6edf3;\n}\n.cm-bars-toggle[_ngcontent-%COMP%]   button.active[_ngcontent-%COMP%] {\n  background: #58a6ff;\n  color: #fff;\n}\n.cm-bars-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  max-height: 320px;\n  overflow-y: auto;\n}\n.cm-bars-list[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 4px;\n}\n.cm-bars-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #21262d;\n  border-radius: 4px;\n}\n.cm-bar-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr auto auto;\n  align-items: center;\n  gap: 8px;\n}\n.cm-bar-name[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #e6edf3;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  min-width: 0;\n}\n.cm-bar-track[_ngcontent-%COMP%] {\n  height: 6px;\n  background: #0d1117;\n  border-radius: 4px;\n  overflow: hidden;\n}\n.cm-bar-fill[_ngcontent-%COMP%] {\n  height: 100%;\n  border-radius: 4px;\n  transition: width 0.6s ease;\n}\n.cm-bar-pct[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 800;\n  min-width: 36px;\n  text-align: right;\n}\n.cm-bar-count[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: #8b949e;\n  min-width: 32px;\n  text-align: right;\n}\n.cm-empty[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #8b949e;\n  font-size: 13px;\n  padding: 20px;\n}\n.cm-merc-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 14px;\n}\n@media (max-width: 1100px) {\n  .cm-merc-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 680px) {\n  .cm-merc-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.cm-merc-card[_ngcontent-%COMP%] {\n  background: #161b22;\n  border: 1px solid #21262d;\n  border-radius: 12px;\n  padding: 16px;\n}\n.cm-merc-top[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 12px;\n  margin-bottom: 14px;\n}\n.cm-avatar[_ngcontent-%COMP%] {\n  width: 44px;\n  height: 44px;\n  border-radius: 10px;\n  background:\n    linear-gradient(\n      135deg,\n      #4f46e5,\n      #7c3aed);\n  color: #fff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 18px;\n  font-weight: 800;\n  flex-shrink: 0;\n}\n.cm-merc-info[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.cm-merc-info[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0 0 4px;\n  font-size: 14px;\n  font-weight: 700;\n  color: #e6edf3;\n}\n.cm-pill[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 10px;\n  font-weight: 700;\n  border-radius: 20px;\n  padding: 2px 8px;\n}\n.cm-pill.green[_ngcontent-%COMP%] {\n  background: rgba(63, 185, 80, 0.15);\n  color: #3fb950;\n}\n.cm-pill.green[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: #3fb950;\n  animation: _ngcontent-%COMP%_pulse 1.5s infinite;\n}\n.cm-pill.gray[_ngcontent-%COMP%] {\n  background: rgba(139, 148, 158, 0.15);\n  color: #8b949e;\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.4;\n  }\n}\n.cm-merc-metrics[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0;\n  margin-bottom: 14px;\n  border: 1px solid #21262d;\n  border-radius: 8px;\n  overflow: hidden;\n}\n.cm-merc-metrics[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  flex: 1;\n  text-align: center;\n  padding: 8px 4px;\n  border-right: 1px solid #21262d;\n}\n.cm-merc-metrics[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]:last-child {\n  border-right: none;\n}\n.cm-merc-metrics[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .n[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 20px;\n  font-weight: 800;\n  color: #e6edf3;\n}\n.cm-merc-metrics[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .n[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 400;\n  color: #8b949e;\n}\n.cm-merc-metrics[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]   .l[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 9px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  color: #8b949e;\n  margin-top: 2px;\n}\n.cm-merc-bars[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.cm-table-wrap[_ngcontent-%COMP%] {\n  background: #161b22;\n  border: 1px solid #21262d;\n  border-radius: 12px;\n  overflow: auto;\n}\n.cm-table-wrap[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 6px;\n  height: 6px;\n}\n.cm-table-wrap[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #21262d;\n  border-radius: 4px;\n}\n.cm-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n.cm-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  background: #1c2333;\n}\n.cm-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 10px 14px;\n  font-size: 10px;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  color: #8b949e;\n  white-space: nowrap;\n  border-bottom: 1px solid #21262d;\n}\n.cm-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 10px 14px;\n  color: #e6edf3;\n  border-bottom: 1px solid rgba(33, 38, 45, 0.6);\n  vertical-align: middle;\n}\n.cm-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.025);\n}\n.cm-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] {\n  border-bottom: none;\n}\n.cm-table[_ngcontent-%COMP%]   .sticky-col[_ngcontent-%COMP%] {\n  position: sticky;\n  left: 0;\n  background: #161b22;\n  z-index: 2;\n  border-right: 1px solid #21262d;\n}\n.cm-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   .sticky-col[_ngcontent-%COMP%] {\n  background: #1c2333;\n}\n.cm-table[_ngcontent-%COMP%]   .name-col[_ngcontent-%COMP%] {\n  font-weight: 700;\n  max-width: 220px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.cm-table[_ngcontent-%COMP%]   .fw[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n.cm-table[_ngcontent-%COMP%]   .cl[_ngcontent-%COMP%] {\n  color: #818cf8;\n  font-weight: 600;\n}\n.cm-table[_ngcontent-%COMP%]   .sub[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: #8b949e;\n  margin-top: 2px;\n}\n.cm-table[_ngcontent-%COMP%]   .mono[_ngcontent-%COMP%] {\n  font-family: "JetBrains Mono", monospace;\n  font-size: 12px;\n}\n.cm-table[_ngcontent-%COMP%]   .dur[_ngcontent-%COMP%] {\n  background: #1c2333;\n  border: 1px solid #21262d;\n  border-radius: 5px;\n  padding: 2px 6px;\n  font-weight: 700;\n}\n.cm-table[_ngcontent-%COMP%]   .no-dur[_ngcontent-%COMP%] {\n  color: #21262d;\n}\n.cell-badge[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 4px 8px;\n  border-radius: 6px;\n  min-width: 56px;\n}\n.cell-badge[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 12px;\n}\n.cell-badge[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 10px;\n  opacity: 0.8;\n}\n.cell-badge.cell-green[_ngcontent-%COMP%] {\n  background: rgba(63, 185, 80, 0.15);\n  color: #3fb950;\n}\n.cell-badge.cell-amber[_ngcontent-%COMP%] {\n  background: rgba(240, 136, 62, 0.15);\n  color: #f0883e;\n}\n.cell-badge.cell-red[_ngcontent-%COMP%] {\n  background: rgba(248, 81, 73, 0.15);\n  color: #f85149;\n}\n.cell-empty[_ngcontent-%COMP%] {\n  color: #21262d;\n}\n.status-pill[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 3px 10px;\n  border-radius: 20px;\n  font-size: 11px;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.status-pill.green[_ngcontent-%COMP%] {\n  background: rgba(63, 185, 80, 0.15);\n  color: #3fb950;\n}\n.status-pill.amber[_ngcontent-%COMP%] {\n  background: rgba(240, 136, 62, 0.15);\n  color: #f0883e;\n}\n.status-pill.gray[_ngcontent-%COMP%] {\n  background: rgba(139, 148, 158, 0.15);\n  color: #8b949e;\n}\n.cm-pend-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 14px;\n}\n@media (max-width: 1100px) {\n  .cm-pend-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 680px) {\n  .cm-pend-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.cm-pend-card[_ngcontent-%COMP%] {\n  background: #161b22;\n  border: 1px solid rgba(248, 81, 73, 0.25);\n  border-radius: 12px;\n  overflow: hidden;\n}\n.cm-pend-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 10px 16px;\n  background: rgba(248, 81, 73, 0.08);\n  border-bottom: 1px solid rgba(248, 81, 73, 0.15);\n  font-weight: 700;\n  font-size: 13px;\n  color: #fca5a5;\n}\n.cm-pend-count[_ngcontent-%COMP%] {\n  background: rgba(248, 81, 73, 0.25);\n  color: #f85149;\n  font-size: 11px;\n  font-weight: 800;\n  padding: 2px 8px;\n  border-radius: 12px;\n}\n.cm-pend-list[_ngcontent-%COMP%] {\n  max-height: 260px;\n  overflow-y: auto;\n}\n.cm-pend-list[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 4px;\n}\n.cm-pend-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #21262d;\n  border-radius: 4px;\n}\n.cm-pend-item[_ngcontent-%COMP%] {\n  padding: 10px 16px;\n  border-bottom: 1px solid rgba(33, 38, 45, 0.6);\n}\n.cm-pend-item[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.cm-pend-item[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.02);\n}\n.cm-pend-name[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 13px;\n  color: #e6edf3;\n  margin-bottom: 4px;\n}\n.cm-pend-tags[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px;\n}\n.tag[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 600;\n  padding: 2px 8px;\n  border-radius: 6px;\n}\n.tag.blue[_ngcontent-%COMP%] {\n  background: rgba(129, 140, 248, 0.15);\n  color: #818cf8;\n}\n.tag.gray[_ngcontent-%COMP%] {\n  background: rgba(139, 148, 158, 0.1);\n  color: #8b949e;\n}\n.cm-empty-state[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  padding: 60px 20px;\n  color: #8b949e;\n}\n.cm-empty-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 48px !important;\n  width: 48px !important;\n  height: 48px !important;\n  opacity: 0.25;\n}\n.cm-empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 500;\n}\n.cm-inline-detail[_ngcontent-%COMP%] {\n  background: rgba(13, 17, 23, 0.4);\n  border: 1px solid #21262d;\n  border-radius: 12px;\n  padding: 16px;\n  margin-top: 4px;\n}\n.cm-inline-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 12px;\n}\n.cm-inline-header[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 14px;\n  font-weight: 700;\n  color: #e6edf3;\n}\n.cm-inline-header[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px !important;\n  width: 18px !important;\n  height: 18px !important;\n  color: #8b949e;\n}\n.cm-inline-header[_ngcontent-%COMP%]   .count[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n  color: #8b949e;\n}\n.cm-inline-cards[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  overflow-x: auto;\n  padding-bottom: 8px;\n}\n.cm-inline-cards[_ngcontent-%COMP%]::-webkit-scrollbar {\n  height: 6px;\n}\n.cm-inline-cards[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #30363d;\n  border-radius: 4px;\n}\n.cm-merc-inline-card[_ngcontent-%COMP%] {\n  flex: 0 0 280px;\n  background: #161b22;\n  border: 1px solid #30363d;\n  border-radius: 8px;\n  padding: 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.mic-top[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.mic-top[_ngcontent-%COMP%]   .user-ic[_ngcontent-%COMP%] {\n  color: #8b949e;\n}\n.mic-top[_ngcontent-%COMP%]   .mic-name[_ngcontent-%COMP%] {\n  flex: 1;\n  font-weight: 700;\n  font-size: 13px;\n  color: #e6edf3;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.mic-rutas[_ngcontent-%COMP%] {\n  font-size: 11px;\n  display: flex;\n  gap: 4px;\n}\n.mic-rutas[_ngcontent-%COMP%]   .l[_ngcontent-%COMP%] {\n  color: #8b949e;\n}\n.mic-rutas[_ngcontent-%COMP%]   .v[_ngcontent-%COMP%] {\n  color: #58a6ff;\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.mic-stats[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 11px;\n}\n.mic-stats[_ngcontent-%COMP%]   .m-box[_ngcontent-%COMP%] {\n  background: #0d1117;\n  border: 1px solid #30363d;\n  padding: 3px 8px;\n  border-radius: 4px;\n  color: #8b949e;\n}\n.mic-stats[_ngcontent-%COMP%]   .m-box[_ngcontent-%COMP%]   .b[_ngcontent-%COMP%] {\n  color: #e6edf3;\n  font-weight: 700;\n}\n.mic-stats[_ngcontent-%COMP%]   .m-tag[_ngcontent-%COMP%] {\n  margin-left: auto;\n  font-weight: 700;\n  padding: 2px 8px;\n  border-radius: 12px;\n}\n.mic-stats[_ngcontent-%COMP%]   .m-tag.yellow[_ngcontent-%COMP%] {\n  background: rgba(240, 136, 62, 0.15);\n  color: #f0883e;\n}\n.mic-stats[_ngcontent-%COMP%]   .m-tag.blue[_ngcontent-%COMP%] {\n  background: rgba(88, 166, 255, 0.15);\n  color: #58a6ff;\n}\n.mic-empty[_ngcontent-%COMP%] {\n  color: #8b949e;\n  font-size: 13px;\n  padding: 20px 0;\n  text-align: center;\n  width: 100%;\n}\n.cm-date-range-box[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  background: #161b22;\n  border: 1px solid #30363d;\n  border-radius: 8px;\n  padding: 6px 12px;\n  gap: 12px;\n}\n.cm-date-input[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.cm-date-input[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px !important;\n  width: 16px !important;\n  height: 16px !important;\n  color: #8b949e;\n}\n.cm-date-input[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n  color: #8b949e;\n}\n.cm-date-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  color: #e6edf3;\n  font-family: inherit;\n  font-size: 13px;\n  outline: none;\n  cursor: pointer;\n}\n.cm-date-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::-webkit-calendar-picker-indicator {\n  filter: invert(1);\n  cursor: pointer;\n  opacity: 0.6;\n}\n.cm-date-sep[_ngcontent-%COMP%] {\n  width: 1px;\n  height: 20px;\n  background: #30363d;\n}\n.cm-modal-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background: rgba(0, 0, 0, 0.6);\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n  z-index: 9999;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.cm-modal[_ngcontent-%COMP%] {\n  background: #161b22;\n  border: 1px solid #30363d;\n  border-radius: 12px;\n  width: 90%;\n  max-width: 800px;\n  max-height: 90vh;\n  display: flex;\n  flex-direction: column;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);\n}\n.cm-modal-header[_ngcontent-%COMP%] {\n  padding: 20px;\n  border-bottom: 1px solid #30363d;\n  text-align: center;\n}\n.cm-modal-header[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 700;\n  color: #e6edf3;\n  margin-bottom: 4px;\n}\n.cm-modal-header[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #8b949e;\n}\n.cm-modal-body[_ngcontent-%COMP%] {\n  padding: 20px;\n  overflow-y: auto;\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n}\n.pdv-section[_ngcontent-%COMP%] {\n  border: 1px solid #30363d;\n  border-radius: 8px;\n  overflow: hidden;\n}\n.pdv-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 16px;\n  font-weight: 700;\n  font-size: 14px;\n}\n.pdv-header[_ngcontent-%COMP%]   .count[_ngcontent-%COMP%] {\n  margin-left: auto;\n  font-size: 12px;\n  font-weight: 800;\n}\n.pdv-header.gray[_ngcontent-%COMP%] {\n  background: #30363d;\n  color: #e6edf3;\n}\n.pdv-header.blue[_ngcontent-%COMP%] {\n  background: #1f6feb;\n  color: #fff;\n}\n.pdv-header.green[_ngcontent-%COMP%] {\n  background: #238636;\n  color: #fff;\n}\n.pdv-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n}\n.pdv-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  text-align: left;\n  padding: 8px 16px;\n  font-size: 11px;\n  text-transform: uppercase;\n  color: #8b949e;\n  background: #0d1117;\n  border-bottom: 1px solid #30363d;\n}\n.pdv-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 10px 16px;\n  font-size: 13px;\n  color: #e6edf3;\n  border-bottom: 1px solid #30363d;\n}\n.pdv-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] {\n  border-bottom: none;\n}\n.pdv-table[_ngcontent-%COMP%]   .fw[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n.cm-modal-footer[_ngcontent-%COMP%] {\n  padding: 16px 20px;\n  border-top: 1px solid #30363d;\n  display: flex;\n  justify-content: center;\n}\n.btn-close[_ngcontent-%COMP%] {\n  background: #6366f1;\n  color: white;\n  border: none;\n  padding: 10px 30px;\n  border-radius: 8px;\n  font-weight: 700;\n  font-size: 14px;\n  cursor: pointer;\n  transition: opacity 0.2s;\n}\n.btn-close[_ngcontent-%COMP%]:hover {\n  opacity: 0.8;\n}\n/*# sourceMappingURL=centro-mando.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CentroMandoComponent, { className: "CentroMandoComponent", filePath: "src\\app\\features\\centro-mando\\centro-mando.component.ts", lineNumber: 25 });
})();
export {
  CentroMandoComponent
};
//# sourceMappingURL=chunk-GAUPALG3.js.map
