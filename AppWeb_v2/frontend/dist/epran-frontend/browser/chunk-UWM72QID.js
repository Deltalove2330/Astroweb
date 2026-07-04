import {
  MatSnackBar,
  MatSnackBarModule
} from "./chunk-7QJW63DM.js";
import {
  AuthService
} from "./chunk-FAJEMXMR.js";
import "./chunk-CELNEZAJ.js";
import "./chunk-ABO6AUNU.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NumberValueAccessor
} from "./chunk-I7XEM5TB.js";
import "./chunk-WHO5S5ML.js";
import {
  MatProgressSpinner,
  MatProgressSpinnerModule
} from "./chunk-EGRIEE5E.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-KQNRR4FF.js";
import "./chunk-QGVFX6Y7.js";
import {
  environment
} from "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  CommonModule,
  HttpClient,
  NgClass,
  __spreadProps,
  __spreadValues,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
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
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QB3BCYT5.js";

// src/app/features/auditor-campo/auditor-campo.component.ts
var _forTrack0 = ($index, $item) => $item.n;
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.t;
var _forTrack3 = ($index, $item) => $item.k;
var _forTrack4 = ($index, $item) => $item.l;
function AuditorCampoComponent_For_13_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 16);
    \u0275\u0275text(1, "check");
    \u0275\u0275elementEnd();
  }
}
function AuditorCampoComponent_For_13_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const s_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", s_r2.n, " ");
  }
}
function AuditorCampoComponent_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 15);
    \u0275\u0275template(2, AuditorCampoComponent_For_13_Conditional_2_Template, 2, 0, "mat-icon", 16)(3, AuditorCampoComponent_For_13_Conditional_3_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 17);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r2.step() === s_r2.n ? "bg-violet-600 border-violet-500 text-white" : ctx_r2.step() > s_r2.n ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-800 border-slate-700 text-slate-500");
    \u0275\u0275advance();
    \u0275\u0275conditional(2, ctx_r2.step() > s_r2.n ? 2 : 3);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r2.step() >= s_r2.n ? "text-violet-300" : "text-slate-600");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r2.label);
  }
}
function AuditorCampoComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275element(1, "mat-spinner", 18);
    \u0275\u0275elementEnd();
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_0_For_5_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275text(1, "\xB7 Activa");
    \u0275\u0275elementEnd();
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_0_For_5_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 31);
    \u0275\u0275listener("click", function AuditorCampoComponent_Conditional_16_Conditional_0_For_5_Conditional_12_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const r_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.noActivar(r_r5));
    });
    \u0275\u0275text(1, "No activar");
    \u0275\u0275elementEnd();
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_0_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 21)(1, "div", 23)(2, "mat-icon", 24);
    \u0275\u0275text(3, "route");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 25)(5, "p", 26);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 27);
    \u0275\u0275text(8);
    \u0275\u0275template(9, AuditorCampoComponent_Conditional_16_Conditional_0_For_5_Conditional_9_Template, 2, 0, "span", 28);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "button", 29);
    \u0275\u0275listener("click", function AuditorCampoComponent_Conditional_16_Conditional_0_For_5_Template_button_click_10_listener() {
      const r_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.activarRuta(r_r5));
    });
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275template(12, AuditorCampoComponent_Conditional_16_Conditional_0_For_5_Conditional_12_Template, 2, 0, "button", 30);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r5 = ctx.$implicit;
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(r_r5.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", r_r5.total_puntos, " PDVs ");
    \u0275\u0275advance();
    \u0275\u0275conditional(9, r_r5.esta_activa ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r5.esta_activa ? "Continuar" : "Activar");
    \u0275\u0275advance();
    \u0275\u0275conditional(12, !r_r5.esta_activa ? 12 : -1);
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_0_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 22);
    \u0275\u0275text(1, "No tienes rutas asignadas.");
    \u0275\u0275elementEnd();
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2", 19);
    \u0275\u0275text(1, "Mis rutas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 20);
    \u0275\u0275text(3, "Selecciona una ruta para iniciar la jornada");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(4, AuditorCampoComponent_Conditional_16_Conditional_0_For_5_Template, 13, 5, "div", 21, _forTrack1);
    \u0275\u0275template(6, AuditorCampoComponent_Conditional_16_Conditional_0_Conditional_6_Template, 2, 0, "p", 22);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.rutas());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(6, !ctx_r2.rutas().length ? 6 : -1);
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_1_For_5_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 35);
    \u0275\u0275listener("click", function AuditorCampoComponent_Conditional_16_Conditional_1_For_5_Conditional_11_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const p_r8 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.abrirClientes(p_r8));
    });
    \u0275\u0275text(1, "Clientes");
    \u0275\u0275elementEnd();
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_1_For_5_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 36);
    \u0275\u0275listener("click", function AuditorCampoComponent_Conditional_16_Conditional_1_For_5_Conditional_12_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const p_r8 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.activarPdv(p_r8));
    });
    \u0275\u0275elementStart(1, "mat-icon", 16);
    \u0275\u0275text(2, "photo_camera");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, "Activar");
    \u0275\u0275elementEnd();
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_1_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "div", 32)(2, "mat-icon", 33);
    \u0275\u0275text(3, "store");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 25)(5, "p", 26);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 27);
    \u0275\u0275text(8);
    \u0275\u0275elementStart(9, "span", 33);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(11, AuditorCampoComponent_Conditional_16_Conditional_1_For_5_Conditional_11_Template, 2, 0, "button", 34)(12, AuditorCampoComponent_Conditional_16_Conditional_1_For_5_Conditional_12_Template, 4, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r8 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", p_r8.activado ? "bg-emerald-900" : "bg-slate-800");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", p_r8.activado ? "text-emerald-400" : "text-slate-400");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r8.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", p_r8.total_clientes, " clientes \xB7 ");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", p_r8.activado ? "text-emerald-400" : "text-amber-400");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r8.activado ? "Activado" : "Pendiente");
    \u0275\u0275advance();
    \u0275\u0275conditional(11, p_r8.activado ? 11 : 12);
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 22);
    \u0275\u0275text(1, "No hay PDVs programados para hoy.");
    \u0275\u0275elementEnd();
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2", 19);
    \u0275\u0275text(1, "Puntos de venta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 20);
    \u0275\u0275text(3, "Programados para hoy");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(4, AuditorCampoComponent_Conditional_16_Conditional_1_For_5_Template, 13, 7, "div", 21, _forTrack1);
    \u0275\u0275template(6, AuditorCampoComponent_Conditional_16_Conditional_1_Conditional_6_Template, 2, 0, "p", 22);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.pdvs());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(6, !ctx_r2.pdvs().length ? 6 : -1);
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_2_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275listener("click", function AuditorCampoComponent_Conditional_16_Conditional_2_For_5_Template_button_click_0_listener() {
      const c_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.iniciarCliente(c_r11));
    });
    \u0275\u0275elementStart(1, "div", 23)(2, "mat-icon", 24);
    \u0275\u0275text(3, "person");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 39)(5, "p", 40);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 41);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "mat-icon", 42);
    \u0275\u0275text(10, "chevron_right");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r11 = ctx.$implicit;
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(c_r11.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r11.prioridad);
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 22);
    \u0275\u0275text(1, "Sin clientes para hoy.");
    \u0275\u0275elementEnd();
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2", 19);
    \u0275\u0275text(1, "Clientes del PDV");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 20);
    \u0275\u0275text(3, "Selecciona el cliente a auditar");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(4, AuditorCampoComponent_Conditional_16_Conditional_2_For_5_Template, 11, 2, "button", 37, _forTrack1);
    \u0275\u0275template(6, AuditorCampoComponent_Conditional_16_Conditional_2_Conditional_6_Template, 2, 0, "p", 22);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.clientes());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(6, !ctx_r2.clientes().length ? 6 : -1);
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_3_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275listener("click", function AuditorCampoComponent_Conditional_16_Conditional_3_For_5_Template_button_click_0_listener() {
      const cat_r13 = \u0275\u0275restoreView(_r12).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.abrirCategoria(cat_r13));
    });
    \u0275\u0275elementStart(1, "div", 23)(2, "mat-icon", 24);
    \u0275\u0275text(3, "layers");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 39)(5, "p", 40);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 44);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "mat-icon", 42);
    \u0275\u0275text(10, "chevron_right");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const cat_r13 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("opacity-50", ctx_r2.catsHechas().includes(cat_r13.id));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(cat_r13.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.catsHechas().includes(cat_r13.id) ? "Auditada" : "Toca para auditar");
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_3_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 22);
    \u0275\u0275text(1, "Este cliente no tiene categor\xEDas configuradas.");
    \u0275\u0275elementEnd();
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2", 19);
    \u0275\u0275text(1, "Categor\xEDas a auditar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 20);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(4, AuditorCampoComponent_Conditional_16_Conditional_3_For_5_Template, 11, 4, "button", 43, _forTrack1);
    \u0275\u0275template(6, AuditorCampoComponent_Conditional_16_Conditional_3_Conditional_6_Template, 2, 0, "p", 22);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_3_0 = ctx_r2.clienteSel()) == null ? null : tmp_3_0.nombre);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.categorias());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(6, !ctx_r2.categorias().length ? 6 : -1);
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 62)(1, "input", 67);
    \u0275\u0275twoWayListener("ngModelChange", function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_8_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r2 = \u0275\u0275nextContext(5);
      \u0275\u0275twoWayBindingSet(ctx_r2.form["prox_vencer_cantidad"], $event) || (ctx_r2.form["prox_vencer_cantidad"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "input", 68);
    \u0275\u0275twoWayListener("ngModelChange", function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_8_Template_input_ngModelChange_2_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r2 = \u0275\u0275nextContext(5);
      \u0275\u0275twoWayBindingSet(ctx_r2.form["prox_vencer_marca"], $event) || (ctx_r2.form["prox_vencer_marca"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "label", 69);
    \u0275\u0275text(4, "Fechas pr\xF3ximas a vencer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "input", 70);
    \u0275\u0275twoWayListener("ngModelChange", function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_8_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r2 = \u0275\u0275nextContext(5);
      \u0275\u0275twoWayBindingSet(ctx_r2.form["prox_vencer_fecha1"], $event) || (ctx_r2.form["prox_vencer_fecha1"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "input", 70);
    \u0275\u0275twoWayListener("ngModelChange", function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_8_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r2 = \u0275\u0275nextContext(5);
      \u0275\u0275twoWayBindingSet(ctx_r2.form["prox_vencer_fecha2"], $event) || (ctx_r2.form["prox_vencer_fecha2"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form["prox_vencer_cantidad"]);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form["prox_vencer_marca"]);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form["prox_vencer_fecha1"]);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form["prox_vencer_fecha2"]);
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 63)(1, "label", 71)(2, "input", 72);
    \u0275\u0275twoWayListener("ngModelChange", function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_9_Template_input_ngModelChange_2_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r2 = \u0275\u0275nextContext(5);
      \u0275\u0275twoWayBindingSet(ctx_r2.form["competencia_material_pop"], $event) || (ctx_r2.form["competencia_material_pop"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Hay material POP");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "label", 71)(5, "input", 72);
    \u0275\u0275twoWayListener("ngModelChange", function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_9_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r2 = \u0275\u0275nextContext(5);
      \u0275\u0275twoWayBindingSet(ctx_r2.form["competencia_impulsadora"], $event) || (ctx_r2.form["competencia_impulsadora"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(6, " Hay impulsadora");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form["competencia_material_pop"]);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form["competencia_impulsadora"]);
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 73);
    \u0275\u0275twoWayListener("ngModelChange", function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_10_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r19);
      const ctx_r2 = \u0275\u0275nextContext(5);
      \u0275\u0275twoWayBindingSet(ctx_r2.form["promo_nuestra_desc"], $event) || (ctx_r2.form["promo_nuestra_desc"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form["promo_nuestra_desc"]);
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 74);
    \u0275\u0275twoWayListener("ngModelChange", function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_11_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r20);
      const ctx_r2 = \u0275\u0275nextContext(5);
      \u0275\u0275twoWayBindingSet(ctx_r2.form["promo_competencia_desc"], $event) || (ctx_r2.form["promo_competencia_desc"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form["promo_competencia_desc"]);
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_12_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 75)(1, "input", 76);
    \u0275\u0275listener("change", function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_12_For_2_Template_input_change_1_listener() {
      const t_r22 = \u0275\u0275restoreView(_r21).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r2.toggleExhib(t_r22));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r22 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(6);
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r2.exhibSel.has(t_r22));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", t_r22, "");
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 66);
    \u0275\u0275repeaterCreate(1, AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_12_For_2_Template, 3, 2, "label", 75, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.exhibTipos);
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 57)(1, "span", 58);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 59)(4, "button", 60);
    \u0275\u0275listener("click", function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Template_button_click_4_listener() {
      const q_r16 = \u0275\u0275restoreView(_r15).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.form[q_r16.k] = 1);
    });
    \u0275\u0275text(5, "S\xED");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 61);
    \u0275\u0275listener("click", function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Template_button_click_6_listener() {
      const q_r16 = \u0275\u0275restoreView(_r15).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.form[q_r16.k] = 0);
    });
    \u0275\u0275text(7, "No");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(8, AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_8_Template, 7, 4, "div", 62)(9, AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_9_Template, 7, 2, "div", 63)(10, AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_10_Template, 1, 1, "input", 64)(11, AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_11_Template, 1, 1, "input", 65)(12, AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Conditional_12_Template, 3, 0, "div", 66);
  }
  if (rf & 2) {
    const q_r16 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(q_r16.l);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r2.form[q_r16.k] === 1 ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r2.form[q_r16.k] === 0 ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(8, q_r16.k === "prox_vencer" && ctx_r2.form["prox_vencer"] === 1 ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(9, q_r16.k === "competencia_actividad" && ctx_r2.form["competencia_actividad"] === 1 ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(10, q_r16.k === "promo_nuestra" && ctx_r2.form["promo_nuestra"] === 1 ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(11, q_r16.k === "promo_competencia" && ctx_r2.form["promo_competencia"] === 1 ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(12, q_r16.k === "exhibicion_adicional" && ctx_r2.form["exhibicion_adicional"] === 1 ? 12 : -1);
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 77);
    \u0275\u0275twoWayListener("ngModelChange", function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_Conditional_6_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r23);
      const ctx_r2 = \u0275\u0275nextContext(4);
      \u0275\u0275twoWayBindingSet(ctx_r2.form["pop_otro"], $event) || (ctx_r2.form["pop_otro"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form["pop_otro"]);
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_4_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45)(1, "div", 46);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 55);
    \u0275\u0275repeaterCreate(4, AuditorCampoComponent_Conditional_16_Conditional_4_For_18_For_5_Template, 13, 8, null, null, _forTrack3);
    \u0275\u0275template(6, AuditorCampoComponent_Conditional_16_Conditional_4_For_18_Conditional_6_Template, 1, 1, "input", 56);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const sec_r24 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(sec_r24.t);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(sec_r24.qs);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(6, sec_r24.t === "Material POP del cliente" ? 6 : -1);
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_4_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 54);
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_4_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 16);
    \u0275\u0275text(1, "save");
    \u0275\u0275elementEnd();
  }
}
function AuditorCampoComponent_Conditional_16_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "h2", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 20);
    \u0275\u0275text(3, "Cuestionario de auditor\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 45)(5, "div", 46);
    \u0275\u0275text(6, "Fotos de la categor\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 47)(8, "span", 48);
    \u0275\u0275text(9, "Puedes tomar varias");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 49)(11, "span", 50);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "button", 51);
    \u0275\u0275listener("click", function AuditorCampoComponent_Conditional_16_Conditional_4_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.cam("cat"));
    });
    \u0275\u0275elementStart(14, "mat-icon", 16);
    \u0275\u0275text(15, "photo_camera");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16, "Tomar");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275repeaterCreate(17, AuditorCampoComponent_Conditional_16_Conditional_4_For_18_Template, 7, 2, "div", 45, _forTrack2);
    \u0275\u0275elementStart(19, "div", 8)(20, "button", 52);
    \u0275\u0275listener("click", function AuditorCampoComponent_Conditional_16_Conditional_4_Template_button_click_20_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.catSel.set(null));
    });
    \u0275\u0275text(21, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "button", 53);
    \u0275\u0275listener("click", function AuditorCampoComponent_Conditional_16_Conditional_4_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.guardarCategoria());
    });
    \u0275\u0275template(23, AuditorCampoComponent_Conditional_16_Conditional_4_Conditional_23_Template, 1, 0, "mat-spinner", 54)(24, AuditorCampoComponent_Conditional_16_Conditional_4_Conditional_24_Template, 2, 0);
    \u0275\u0275text(25, " Guardar ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate((tmp_3_0 = ctx_r2.catSel()) == null ? null : tmp_3_0.nombre);
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate1("", ctx_r2.fotos(), " fotos");
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.secciones);
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", ctx_r2.saving());
    \u0275\u0275advance();
    \u0275\u0275conditional(23, ctx_r2.saving() ? 23 : 24);
  }
}
function AuditorCampoComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AuditorCampoComponent_Conditional_16_Conditional_0_Template, 7, 1)(1, AuditorCampoComponent_Conditional_16_Conditional_1_Template, 7, 1)(2, AuditorCampoComponent_Conditional_16_Conditional_2_Template, 7, 1)(3, AuditorCampoComponent_Conditional_16_Conditional_3_Template, 7, 2)(4, AuditorCampoComponent_Conditional_16_Conditional_4_Template, 26, 4);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional(0, ctx_r2.step() === 1 ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(1, ctx_r2.step() === 2 ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(2, ctx_r2.step() === 3 && !ctx_r2.clienteSel() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(3, ctx_r2.step() === 3 && ctx_r2.clienteSel() && !ctx_r2.catSel() ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(4, ctx_r2.step() === 4 && ctx_r2.catSel() ? 4 : -1);
  }
}
function AuditorCampoComponent_Conditional_17_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 79);
    \u0275\u0275listener("click", function AuditorCampoComponent_Conditional_17_For_2_Template_button_click_0_listener() {
      const b_r26 = \u0275\u0275restoreView(_r25).$implicit;
      return \u0275\u0275resetView(b_r26.fn());
    });
    \u0275\u0275elementStart(1, "mat-icon", 16);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r26 = ctx.$implicit;
    \u0275\u0275property("ngClass", b_r26.cls);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(b_r26.i);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", b_r26.l, " ");
  }
}
function AuditorCampoComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275repeaterCreate(1, AuditorCampoComponent_Conditional_17_For_2_Template, 4, 3, "button", 78, _forTrack4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.footerBtns());
  }
}
function AuditorCampoComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 80);
    \u0275\u0275element(2, "mat-spinner", 81);
    \u0275\u0275elementStart(3, "p", 82);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.uploadMsg());
  }
}
var AuditorCampoComponent = class _AuditorCampoComponent {
  constructor() {
    this.http = inject(HttpClient);
    this.auth = inject(AuthService);
    this.snack = inject(MatSnackBar);
    this.API = `${environment.apiUrl}/api/auditor-campo`;
    this.cedula = (() => {
      const un = this.auth.currentUser()?.username || "";
      return /^\d{5,}$/.test(un) ? un : "88880001";
    })();
    this.steps = [{ n: 1, label: "Ruta" }, { n: 2, label: "PDV" }, { n: 3, label: "Cliente" }, { n: 4, label: "Auditor\xEDa" }];
    this.exhibTipos = ["Cabezal", "Torre", "Isla", "Cross", "Checkout"];
    this.exhibSel = /* @__PURE__ */ new Set();
    this.secciones = [
      { t: "Cumplimiento en el anaquel", qs: [
        { k: "aplico_planograma", l: "\xBFAplic\xF3 planograma?" },
        { k: "lineamiento_marca", l: "Lineamiento de marca" },
        { k: "precio_correcto", l: "Precio colocado correcto" },
        { k: "limpieza_correcta", l: "Limpieza correcta" },
        { k: "participacion_correcta", l: "Participaci\xF3n seg\xFAn objetivos" },
        { k: "fifo_correcto", l: "Aplicaci\xF3n correcta de FIFO" }
      ] },
      { t: "Vencimiento y competencia", qs: [
        { k: "prox_vencer", l: "\xBFProductos pr\xF3ximos a vencer?" },
        { k: "competencia_actividad", l: "\xBFActividad de la competencia?" }
      ] },
      { t: "Material POP del cliente", qs: [
        { k: "pop_hablador", l: "Hablador" },
        { k: "pop_rompetrafico", l: "Rompetr\xE1fico" }
      ] },
      { t: "Promociones", qs: [
        { k: "promo_nuestra", l: "\xBFPromociones nuestras?" },
        { k: "promo_competencia", l: "\xBFPromociones de la competencia?" }
      ] },
      { t: "Exhibici\xF3n adicional", qs: [{ k: "exhibicion_adicional", l: "\xBFExiste exhibici\xF3n adicional?" }] }
    ];
    this.step = signal(1);
    this.loading = signal(false);
    this.saving = signal(false);
    this.uploading = signal(false);
    this.uploadMsg = signal("Subiendo foto\u2026");
    this.rutas = signal([]);
    this.pdvs = signal([]);
    this.clientes = signal([]);
    this.categorias = signal([]);
    this.catsHechas = signal([]);
    this.rutaSel = signal(null);
    this.pdvSel = signal(null);
    this.clienteSel = signal(null);
    this.catSel = signal(null);
    this.idVisita = signal(null);
    this.fotos = signal(0);
    this.form = {};
    this.camMode = "cat";
  }
  ngOnInit() {
    this.loadRutas();
  }
  crumb() {
    return [this.rutaSel()?.nombre, this.pdvSel()?.nombre, this.clienteSel()?.nombre, this.catSel()?.nombre].filter(Boolean).join("  \u203A  ");
  }
  footerBtns() {
    if (this.step() === 2)
      return [
        { l: "Rutas", i: "arrow_back", cls: "bg-slate-800 text-slate-300", fn: () => this.loadRutas() },
        { l: "Terminar jornada", i: "flag", cls: "bg-red-950 text-red-300", fn: () => this.desactivarRuta() }
      ];
    if (this.step() === 3 && !this.clienteSel())
      return [
        { l: "PDVs", i: "arrow_back", cls: "bg-slate-800 text-slate-300", fn: () => this.loadPdvs() },
        { l: "Desactivar PDV", i: "photo_camera", cls: "bg-red-950 text-red-300", fn: () => this.cam("pdv-off") }
      ];
    if (this.step() === 3 && this.clienteSel())
      return [
        { l: "Clientes", i: "arrow_back", cls: "bg-slate-800 text-slate-300", fn: () => this.abrirClientes(this.pdvSel()) },
        { l: "Terminar cliente", i: "check", cls: "bg-emerald-900 text-emerald-300", fn: () => this.finalizarCliente() }
      ];
    return [];
  }
  get(u) {
    return this.http.get(`${this.API}${u}`);
  }
  post(u, b) {
    return this.http.post(`${this.API}${u}`, b);
  }
  err(e) {
    this.snack.open(e?.error?.detail || e?.error?.message || "Error", "OK", { duration: 4e3 });
  }
  loadRutas() {
    this.step.set(1);
    this.rutaSel.set(null);
    this.pdvSel.set(null);
    this.clienteSel.set(null);
    this.catSel.set(null);
    this.loading.set(true);
    this.get(`/rutas/${this.cedula}`).subscribe({ next: (r) => {
      this.rutas.set(r);
      this.loading.set(false);
    }, error: (e) => {
      this.loading.set(false);
      this.err(e);
    } });
  }
  activarRuta(r) {
    this.rutaSel.set(r);
    this.post("/activar-ruta", { id_ruta: r.id, cedula: this.cedula }).subscribe({ next: () => this.loadPdvs(), error: (e) => this.err(e) });
  }
  noActivar(r) {
    const razon = prompt("Motivo por el que NO activas esta ruta hoy:");
    if (!razon?.trim())
      return;
    this.post("/no-activar-ruta", { id_ruta: r.id, cedula: this.cedula, razon: razon.trim() }).subscribe({ next: () => this.snack.open("Registrado", "OK", { duration: 2500 }), error: (e) => this.err(e) });
  }
  loadPdvs() {
    this.step.set(2);
    this.clienteSel.set(null);
    this.catSel.set(null);
    this.loading.set(true);
    this.get(`/ruta-puntos/${this.rutaSel().id}?cedula=${this.cedula}`).subscribe({ next: (p) => {
      this.pdvs.set(p);
      this.loading.set(false);
    }, error: (e) => {
      this.loading.set(false);
      this.err(e);
    } });
  }
  abrirClientes(p) {
    this.pdvSel.set(p);
    this.step.set(3);
    this.clienteSel.set(null);
    this.catSel.set(null);
    this.loading.set(true);
    this.get(`/pdv-clientes/${p.id}/${this.rutaSel().id}`).subscribe({ next: (c) => {
      this.clientes.set(c);
      this.loading.set(false);
    }, error: (e) => {
      this.loading.set(false);
      this.err(e);
    } });
  }
  iniciarCliente(c) {
    this.post("/iniciar-auditoria-cliente", { cliente_id: c.id, point_id: this.pdvSel().id, cedula: this.cedula }).subscribe({
      next: (r) => {
        this.clienteSel.set(c);
        this.idVisita.set(r.id_visita);
        this.catsHechas.set([]);
        this.loadCategorias();
      },
      error: (e) => this.err(e)
    });
  }
  loadCategorias() {
    this.catSel.set(null);
    this.loading.set(true);
    this.get(`/cliente-categorias/${this.clienteSel().id}`).subscribe({ next: (c) => {
      this.categorias.set(c);
      this.loading.set(false);
    }, error: (e) => {
      this.loading.set(false);
      this.err(e);
    } });
  }
  abrirCategoria(cat) {
    this.catSel.set(cat);
    this.step.set(4);
    this.form = {};
    this.exhibSel.clear();
    this.fotos.set(0);
  }
  toggleExhib(t) {
    this.exhibSel.has(t) ? this.exhibSel.delete(t) : this.exhibSel.add(t);
  }
  guardarCategoria() {
    this.saving.set(true);
    const payload = __spreadProps(__spreadValues({}, this.form), {
      id_visita: this.idVisita(),
      id_categoria: this.catSel().id,
      exhibicion_tipos: [...this.exhibSel].join(", ") || null
    });
    this.post("/guardar-auditoria-categoria", payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open("Categor\xEDa guardada", "OK", { duration: 2500 });
        this.catsHechas.update((a) => [...a, this.catSel().id]);
        this.step.set(3);
        this.catSel.set(null);
      },
      error: (e) => {
        this.saving.set(false);
        this.err(e);
      }
    });
  }
  finalizarCliente() {
    if (!confirm("\xBFTerminar la auditor\xEDa de este cliente?"))
      return;
    this.post("/finalizar-auditoria-cliente", { id_visita: this.idVisita() }).subscribe({ next: () => {
      this.snack.open("Cliente finalizado", "OK", { duration: 2500 });
      this.abrirClientes(this.pdvSel());
    }, error: (e) => this.err(e) });
  }
  activarPdv(p) {
    this.pdvSel.set(p);
    this.cam("pdv-on");
  }
  desactivarRuta() {
    if (!confirm("\xBFTerminar la jornada de esta ruta?"))
      return;
    this.post("/desactivar-ruta", { id_ruta: this.rutaSel().id, cedula: this.cedula }).subscribe({ next: () => {
      this.snack.open("Jornada terminada", "OK", { duration: 2500 });
      this.loadRutas();
    }, error: (e) => this.err(e) });
  }
  cam(mode) {
    this.camMode = mode;
    this.camEl ??= document.querySelector("input[type=file]");
    this.camEl?.click();
  }
  onCam(ev) {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file)
      return;
    const send = (lat, lon) => {
      this.uploadMsg.set("Subiendo foto\u2026");
      this.uploading.set(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("cedula", this.cedula);
      if (lat != null)
        fd.append("lat", String(lat));
      if (lon != null)
        fd.append("lon", String(lon));
      let url = "";
      if (this.camMode === "cat") {
        url = "/subir-foto-categoria";
        fd.append("id_visita", String(this.idVisita()));
        fd.append("id_categoria", String(this.catSel().id));
        fd.append("categoria_nombre", this.catSel().nombre);
        fd.append("point_id", this.pdvSel()?.id || "");
      } else {
        url = this.camMode === "pdv-on" ? "/activar-pdv" : "/desactivar-pdv";
        fd.append("point_id", this.pdvSel().id);
      }
      this.http.post(`${this.API}${url}`, fd).subscribe({
        next: () => {
          this.uploading.set(false);
          if (this.camMode === "cat")
            this.fotos.update((n) => n + 1);
          else if (this.camMode === "pdv-on")
            this.abrirClientes(this.pdvSel());
          else {
            this.snack.open("PDV desactivado", "OK", { duration: 2500 });
            this.loadPdvs();
          }
        },
        error: (e) => {
          this.uploading.set(false);
          this.err(e);
        }
      });
    };
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition((p) => send(p.coords.latitude, p.coords.longitude), () => send(), { enableHighAccuracy: true, timeout: 8e3 });
    else
      send();
  }
  static {
    this.\u0275fac = function AuditorCampoComponent_Factory(t) {
      return new (t || _AuditorCampoComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AuditorCampoComponent, selectors: [["app-auditor-campo"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 21, vars: 4, consts: [["camInput", ""], [1, "min-h-screen", "bg-slate-950", "text-white"], [1, "bg-gradient-to-r", "from-slate-900", "to-slate-800", "border-b", "border-white/8", "px-6", "py-5"], [1, "flex", "items-center", "gap-3"], [1, "w-11", "h-11", "rounded-2xl", "bg-gradient-to-br", "from-violet-600", "to-purple-700", "flex", "items-center", "justify-center", "shadow-lg"], [1, "text-white"], [1, "text-xl", "font-black", "tracking-tight", "leading-none"], [1, "text-slate-400", "text-xs", "mt-0.5"], [1, "flex", "gap-2", "mt-4"], [1, "flex-1", "text-center"], [1, "px-6", "py-6", "max-w-3xl", "mx-auto", "pb-28"], [1, "flex", "justify-center", "py-24"], [1, "fixed", "bottom-0", "left-0", "right-0", "bg-slate-900/95", "backdrop-blur", "border-t", "border-white/8", "px-6", "py-3", "flex", "gap-2", "max-w-3xl", "mx-auto"], ["type", "file", "accept", "image/*", "capture", "environment", 1, "hidden", 3, "change"], [1, "fixed", "inset-0", "bg-black/60", "z-50", "flex", "items-center", "justify-center"], [1, "w-8", "h-8", "mx-auto", "rounded-full", "flex", "items-center", "justify-center", "text-xs", "font-black", "border-2", "transition-all", 3, "ngClass"], [1, "!text-base"], [1, "text-[10px]", "font-bold", "uppercase", "tracking-wider", "mt-1", "block", 3, "ngClass"], ["diameter", "40"], [1, "text-lg", "font-black", "mb-1"], [1, "text-slate-400", "text-sm", "mb-4"], [1, "bg-slate-900", "border", "border-white/8", "rounded-2xl", "p-4", "mb-3", "flex", "items-center", "gap-3"], [1, "text-center", "text-slate-600", "py-12"], [1, "w-10", "h-10", "rounded-xl", "bg-violet-900", "flex", "items-center", "justify-center"], [1, "text-violet-400"], [1, "flex-1", "min-w-0"], [1, "font-bold", "truncate"], [1, "text-xs", "text-slate-400"], [1, "text-emerald-400", "font-bold"], [1, "px-4", "py-2", "bg-violet-700", "hover:bg-violet-600", "rounded-xl", "text-sm", "font-bold", 3, "click"], [1, "px-3", "py-2", "bg-slate-800", "hover:bg-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-300"], [1, "px-3", "py-2", "bg-slate-800", "hover:bg-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-300", 3, "click"], [1, "w-10", "h-10", "rounded-xl", "flex", "items-center", "justify-center", 3, "ngClass"], [3, "ngClass"], [1, "px-4", "py-2", "bg-violet-900", "hover:bg-violet-800", "rounded-xl", "text-sm", "font-bold", "text-violet-300"], [1, "px-4", "py-2", "bg-violet-900", "hover:bg-violet-800", "rounded-xl", "text-sm", "font-bold", "text-violet-300", 3, "click"], [1, "px-4", "py-2", "bg-amber-600", "hover:bg-amber-500", "rounded-xl", "text-sm", "font-bold", "flex", "items-center", "gap-1", 3, "click"], [1, "w-full", "text-left", "bg-slate-900", "hover:bg-slate-800", "border", "border-white/8", "rounded-2xl", "p-4", "mb-3", "flex", "items-center", "gap-3"], [1, "w-full", "text-left", "bg-slate-900", "hover:bg-slate-800", "border", "border-white/8", "rounded-2xl", "p-4", "mb-3", "flex", "items-center", "gap-3", 3, "click"], [1, "flex-1"], [1, "font-bold"], [1, "text-xs", "px-2", "py-0.5", "bg-violet-950", "text-violet-300", "rounded-full", "font-bold"], [1, "text-slate-600"], [1, "w-full", "text-left", "bg-slate-900", "hover:bg-slate-800", "border", "border-white/8", "rounded-2xl", "p-4", "mb-3", "flex", "items-center", "gap-3", 3, "opacity-50"], [1, "text-xs", "text-slate-500"], [1, "bg-slate-900", "border", "border-white/8", "rounded-2xl", "overflow-hidden", "mb-3"], [1, "px-4", "py-2.5", "bg-slate-800", "text-violet-400", "text-xs", "font-black", "uppercase", "tracking-wider"], [1, "p-4", "flex", "items-center", "justify-between"], [1, "text-sm", "text-slate-400"], [1, "flex", "items-center", "gap-2"], [1, "text-xs", "px-2", "py-1", "bg-violet-950", "text-violet-300", "rounded-full", "font-bold"], [1, "px-3", "py-2", "bg-violet-900", "hover:bg-violet-800", "rounded-xl", "text-sm", "font-bold", "text-violet-300", "flex", "items-center", "gap-1", 3, "click"], [1, "flex-1", "py-3", "border", "border-slate-700", "rounded-xl", "font-bold", "text-slate-400", 3, "click"], [1, "flex-1", "py-3", "bg-gradient-to-r", "from-violet-700", "to-purple-700", "rounded-xl", "font-black", "flex", "items-center", "justify-center", "gap-2", 3, "click", "disabled"], ["diameter", "18"], [1, "p-4", "space-y-1"], ["placeholder", "Otro material POP (opcional)", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "outline-none", "mt-1", 3, "ngModel"], [1, "flex", "items-center", "justify-between", "gap-3", "py-2.5", "border-b", "border-white/5", "last:border-0"], [1, "text-sm", "font-semibold"], [1, "flex", "rounded-lg", "overflow-hidden", "border", "border-slate-700", "shrink-0"], [1, "px-4", "py-1.5", "text-sm", "font-bold", 3, "click", "ngClass"], [1, "px-4", "py-1.5", "text-sm", "font-bold", "border-l", "border-slate-700", 3, "click", "ngClass"], [1, "pl-1", "pb-2", "grid", "grid-cols-2", "gap-2"], [1, "pl-1", "pb-2", "space-y-2"], ["placeholder", "\xBFCu\xE1les?", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "outline-none", "mb-2", 3, "ngModel"], ["placeholder", "Describe", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "outline-none", "mb-2", 3, "ngModel"], [1, "pl-1", "pb-2", "flex", "flex-wrap", "gap-3"], ["type", "number", "placeholder", "Cantidad", 1, "bg-slate-800", "border", "border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "outline-none", 3, "ngModelChange", "ngModel"], ["placeholder", "Marca", 1, "bg-slate-800", "border", "border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "outline-none", 3, "ngModelChange", "ngModel"], [1, "text-[11px]", "text-slate-500", "col-span-2", "-mb-1"], ["type", "date", 1, "bg-slate-800", "border", "border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "outline-none", "text-slate-200", 3, "ngModelChange", "ngModel"], [1, "flex", "items-center", "gap-2", "text-sm"], ["type", "checkbox", 1, "w-4", "h-4", 3, "ngModelChange", "ngModel"], ["placeholder", "\xBFCu\xE1les?", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "outline-none", "mb-2", 3, "ngModelChange", "ngModel"], ["placeholder", "Describe", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "outline-none", "mb-2", 3, "ngModelChange", "ngModel"], [1, "flex", "items-center", "gap-1.5", "text-sm"], ["type", "checkbox", 1, "w-4", "h-4", 3, "change", "checked"], ["placeholder", "Otro material POP (opcional)", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "outline-none", "mt-1", 3, "ngModelChange", "ngModel"], [1, "flex-1", "py-2.5", "rounded-xl", "font-bold", "text-sm", "flex", "items-center", "justify-center", "gap-1.5", 3, "ngClass"], [1, "flex-1", "py-2.5", "rounded-xl", "font-bold", "text-sm", "flex", "items-center", "justify-center", "gap-1.5", 3, "click", "ngClass"], [1, "bg-slate-900", "rounded-2xl", "px-8", "py-6", "text-center", "border", "border-white/10"], ["diameter", "40", 1, "mx-auto"], [1, "mt-3", "font-bold"]], template: function AuditorCampoComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "div", 4)(4, "mat-icon", 5);
        \u0275\u0275text(5, "fact_check");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(6, "div")(7, "h1", 6);
        \u0275\u0275text(8, "Auditor\xEDa de Campo");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "p", 7);
        \u0275\u0275text(10);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(11, "div", 8);
        \u0275\u0275repeaterCreate(12, AuditorCampoComponent_For_13_Template, 6, 4, "div", 9, _forTrack0);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(14, "div", 10);
        \u0275\u0275template(15, AuditorCampoComponent_Conditional_15_Template, 2, 0, "div", 11)(16, AuditorCampoComponent_Conditional_16_Template, 5, 5);
        \u0275\u0275elementEnd();
        \u0275\u0275template(17, AuditorCampoComponent_Conditional_17_Template, 3, 0, "div", 12);
        \u0275\u0275elementStart(18, "input", 13, 0);
        \u0275\u0275listener("change", function AuditorCampoComponent_Template_input_change_18_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onCam($event));
        });
        \u0275\u0275elementEnd();
        \u0275\u0275template(20, AuditorCampoComponent_Conditional_20_Template, 5, 1, "div", 14);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(10);
        \u0275\u0275textInterpolate(ctx.crumb() || "CI " + ctx.cedula);
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.steps);
        \u0275\u0275advance(3);
        \u0275\u0275conditional(15, ctx.loading() ? 15 : 16);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(17, !ctx.loading() && ctx.footerBtns().length ? 17 : -1);
        \u0275\u0275advance(3);
        \u0275\u0275conditional(20, ctx.uploading() ? 20 : -1);
      }
    }, dependencies: [CommonModule, NgClass, FormsModule, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgModel, MatIconModule, MatIcon, MatSnackBarModule, MatProgressSpinnerModule, MatProgressSpinner], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AuditorCampoComponent, { className: "AuditorCampoComponent", filePath: "src\\app\\features\\auditor-campo\\auditor-campo.component.ts", lineNumber: 211 });
})();
export {
  AuditorCampoComponent
};
//# sourceMappingURL=chunk-UWM72QID.js.map
