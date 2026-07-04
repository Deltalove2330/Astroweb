import {
  MatSnackBar,
  MatSnackBarModule
} from "./chunk-7QJW63DM.js";
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
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-I7XEM5TB.js";
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
import {
  CommonModule,
  DatePipe,
  NgClass,
  NgTemplateOutlet,
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
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QB3BCYT5.js";

// src/app/features/revision-visitas/revision-visitas.component.ts
var _forTrack0 = ($index, $item) => $item.id_visita;
var _forTrack1 = ($index, $item) => $item.key;
var _forTrack2 = ($index, $item) => $item.id;
var _c0 = (a0) => ({ $implicit: a0 });
function RevisionVisitasComponent_For_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r1 = ctx.$implicit;
    \u0275\u0275property("value", r_r1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r1);
  }
}
function RevisionVisitasComponent_For_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r2 = ctx.$implicit;
    \u0275\u0275property("value", p_r2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r2);
  }
}
function RevisionVisitasComponent_For_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r3 = ctx.$implicit;
    \u0275\u0275property("value", c_r3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r3);
  }
}
function RevisionVisitasComponent_For_78_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r4 = ctx.$implicit;
    \u0275\u0275property("value", m_r4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(m_r4);
  }
}
function RevisionVisitasComponent_Conditional_96_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39);
    \u0275\u0275element(1, "mat-spinner", 43);
    \u0275\u0275elementStart(2, "p", 44);
    \u0275\u0275text(3, "Cargando visitas...");
    \u0275\u0275elementEnd()();
  }
}
function RevisionVisitasComponent_Conditional_97_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45)(1, "div", 46)(2, "mat-icon", 47);
    \u0275\u0275text(3, "photo_library");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 48);
    \u0275\u0275text(5, "No hay visitas con fotos para revisar en este per\xEDodo.");
    \u0275\u0275elementEnd()()();
  }
}
function RevisionVisitasComponent_Conditional_98_For_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "REVISADA");
    \u0275\u0275elementEnd();
  }
}
function RevisionVisitasComponent_Conditional_98_For_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 70);
    \u0275\u0275text(1, "PENDIENTE");
    \u0275\u0275elementEnd();
  }
}
function RevisionVisitasComponent_Conditional_98_For_2_For_30_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 74);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\xB7 ", g_r7.rechazadas, "\u2715");
  }
}
function RevisionVisitasComponent_Conditional_98_For_2_For_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 71);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_98_For_2_For_30_Template_button_click_0_listener() {
      const g_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const v_r8 = \u0275\u0275nextContext().$implicit;
      const ctx_r8 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r8.openReview(v_r8, g_r7.key));
    });
    \u0275\u0275elementStart(1, "mat-icon", 72);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 73);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, RevisionVisitasComponent_Conditional_98_For_2_For_30_Conditional_7_Template, 2, 1, "span", 74);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r7 = ctx.$implicit;
    \u0275\u0275property("matTooltip", "Ver fotos: " + g_r7.label)("ngClass", g_r7.revisable ? "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-primary-400 hover:text-primary-600" : "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:border-blue-400");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(g_r7.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(g_r7.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(g_r7.total);
    \u0275\u0275advance();
    \u0275\u0275conditional(7, g_r7.rechazadas ? 7 : -1);
  }
}
function RevisionVisitasComponent_Conditional_98_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 50)(1, "div", 51)(2, "span", 52);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, RevisionVisitasComponent_Conditional_98_For_2_Conditional_4_Template, 2, 0, "span", 53)(5, RevisionVisitasComponent_Conditional_98_For_2_Conditional_5_Template, 2, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 54)(7, "div", 55);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 56)(10, "mat-icon", 57);
    \u0275\u0275text(11, "store");
    \u0275\u0275elementEnd();
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 58)(14, "mat-icon", 57);
    \u0275\u0275text(15, "person");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 59);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 60)(21, "div", 61);
    \u0275\u0275element(22, "div", 62);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "div", 63)(24, "span", 64);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span", 65);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(28, "div", 66);
    \u0275\u0275repeaterCreate(29, RevisionVisitasComponent_Conditional_98_For_2_For_30_Template, 8, 6, "button", 67, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div", 68)(32, "button", 69);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_98_For_2_Template_button_click_32_listener() {
      const v_r8 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r8 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r8.openReview(v_r8));
    });
    \u0275\u0275elementStart(33, "mat-icon", 10);
    \u0275\u0275text(34, "fact_check");
    \u0275\u0275elementEnd();
    \u0275\u0275text(35, " Revisar fotos ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const v_r8 = ctx.$implicit;
    const ctx_r8 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("#", v_r8.id_visita, "");
    \u0275\u0275advance();
    \u0275\u0275conditional(4, v_r8.revisada ? 4 : 5);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(v_r8.cliente);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(v_r8.punto_de_interes);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", v_r8.mercaderista, " \xB7 ", v_r8.ruta, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind2(19, 14, v_r8.fecha, "dd/MM/yyyy HH:mm"), " \xB7 ", v_r8.ciudad, "");
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("width", ctx_r8.pct(v_r8), "%");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate3("", v_r8.aprobadas, "/", v_r8.fotos_revisar, " aprobadas (", ctx_r8.pct(v_r8), "%)");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", v_r8.sin_revisar, " sin revisar");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r8.gruposDe(v_r8));
  }
}
function RevisionVisitasComponent_Conditional_98_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49);
    \u0275\u0275repeaterCreate(1, RevisionVisitasComponent_Conditional_98_For_2_Template, 36, 17, "div", 50, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r8 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r8.filtered);
  }
}
function RevisionVisitasComponent_Conditional_99_For_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 82);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_99_For_18_Template_button_click_0_listener() {
      const g_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r8 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r8.setGrupoSel(g_r12.key));
    });
    \u0275\u0275elementStart(1, "mat-icon", 57);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r12 = ctx.$implicit;
    const ctx_r8 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r8.grupoSel === g_r12.key ? "bg-primary-600 text-white border-primary-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(g_r12.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", g_r12.label, " (", g_r12.total, ") ");
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275element(0, "div", 97);
    \u0275\u0275elementStart(1, "button", 98);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_99_Conditional_28_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r8 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r8.comparar = !ctx_r8.comparar);
    });
    \u0275\u0275elementStart(2, "mat-icon", 57);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r8 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r8.comparar ? "bg-primary-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500");
    \u0275\u0275property("matTooltip", ctx_r8.comparar ? "Ver en cuadr\xEDcula" : "Comparar Antes/Despu\xE9s");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r8.comparar ? "compare" : "grid_view");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r8.comparar ? "Comparando A/D" : "Comparar A/D", " ");
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 87);
    \u0275\u0275element(1, "mat-spinner", 99);
    \u0275\u0275elementEnd();
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_31_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 103);
    \u0275\u0275text(1, "No hay fotos en este filtro.");
    \u0275\u0275elementEnd();
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_31_Conditional_10_For_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_31_Conditional_10_For_2_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_31_Conditional_10_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 105);
    \u0275\u0275template(1, RevisionVisitasComponent_Conditional_99_Conditional_31_Conditional_10_For_2_ng_container_1_Template, 1, 0, "ng-container", 106)(2, RevisionVisitasComponent_Conditional_99_Conditional_31_Conditional_10_For_2_ng_container_2_Template, 1, 0, "ng-container", 106);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r14 = ctx.$implicit;
    \u0275\u0275nextContext(3);
    const photoCard_r15 = \u0275\u0275reference(35);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", photoCard_r15)("ngTemplateOutletContext", \u0275\u0275pureFunction1(4, _c0, p_r14.antes));
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", photoCard_r15)("ngTemplateOutletContext", \u0275\u0275pureFunction1(6, _c0, p_r14.despues));
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_31_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 104);
    \u0275\u0275repeaterCreate(1, RevisionVisitasComponent_Conditional_99_Conditional_31_Conditional_10_For_2_Template, 3, 8, "div", 105, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r8 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r8.comparePairs);
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 100)(1, "div", 101)(2, "mat-icon", 57);
    \u0275\u0275text(3, "history");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Antes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 102)(6, "mat-icon", 57);
    \u0275\u0275text(7, "check");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8, " Despu\xE9s");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(9, RevisionVisitasComponent_Conditional_99_Conditional_31_Conditional_9_Template, 2, 0, "p", 103)(10, RevisionVisitasComponent_Conditional_99_Conditional_31_Conditional_10_Template, 3, 0);
  }
  if (rf & 2) {
    const ctx_r8 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(9);
    \u0275\u0275conditional(9, ctx_r8.comparePairs.length === 0 ? 9 : 10);
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 103);
    \u0275\u0275text(1, "No hay fotos en este filtro.");
    \u0275\u0275elementEnd();
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_33_For_2_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_33_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, RevisionVisitasComponent_Conditional_99_Conditional_33_For_2_ng_container_0_Template, 1, 0, "ng-container", 106);
  }
  if (rf & 2) {
    const f_r16 = ctx.$implicit;
    \u0275\u0275nextContext(2);
    const photoCard_r15 = \u0275\u0275reference(35);
    \u0275\u0275property("ngTemplateOutlet", photoCard_r15)("ngTemplateOutletContext", \u0275\u0275pureFunction1(2, _c0, f_r16));
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 107);
    \u0275\u0275repeaterCreate(1, RevisionVisitasComponent_Conditional_99_Conditional_33_For_2_Template, 1, 4, "ng-container", null, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r8 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r8.filteredPhotos);
  }
}
function RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 111);
    \u0275\u0275text(1, "APROBADA");
    \u0275\u0275elementEnd();
  }
}
function RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 114);
    \u0275\u0275text(1, "RECHAZADA");
    \u0275\u0275elementEnd();
  }
}
function RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Conditional_7_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 116);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const rz_r19 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(rz_r19);
  }
}
function RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Conditional_7_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 117)(1, "mat-icon", 118);
    \u0275\u0275text(2, "person");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r18 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" Rechazada por ", f_r18.rechazado_por_nombre, "");
  }
}
function RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 112)(1, "div", 115);
    \u0275\u0275repeaterCreate(2, RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Conditional_7_For_3_Template, 2, 1, "span", 116, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Conditional_7_Conditional_4_Template, 4, 1, "div", 117);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r18 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275repeater(f_r18.razones);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(4, f_r18.rechazado_por_nombre ? 4 : -1);
  }
}
function RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 113)(1, "button", 119);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Conditional_8_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r20);
      const f_r18 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r8 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r8.setDecision(f_r18, "Aprobada"));
    });
    \u0275\u0275elementStart(2, "mat-icon", 10);
    \u0275\u0275text(3, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Aprobar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 120);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Conditional_8_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r20);
      const f_r18 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r8 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r8.promptReject(f_r18));
    });
    \u0275\u0275elementStart(6, "mat-icon", 10);
    \u0275\u0275text(7, "cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8, " Rechazar ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r18 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r8 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r8.isAprobada(f_r18) ? "bg-emerald-600 text-white" : "bg-slate-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40");
    \u0275\u0275advance(4);
    \u0275\u0275classMap(ctx_r8.isRechazada(f_r18) ? "bg-rose-600 text-white" : "bg-slate-50 dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40");
  }
}
function RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 121)(1, "mat-icon", 57);
    \u0275\u0275text(2, "visibility");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Solo lectura ");
    \u0275\u0275elementEnd();
  }
}
function RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 108)(1, "div", 24)(2, "img", 109);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Template_img_click_2_listener() {
      \u0275\u0275restoreView(_r17);
      const f_r18 = \u0275\u0275nextContext().$implicit;
      const ctx_r8 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r8.openLightbox(f_r18.url));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 110);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Conditional_5_Template, 2, 0, "span", 111)(6, RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Conditional_6_Template, 2, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Conditional_7_Template, 5, 1, "div", 112)(8, RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Conditional_8_Template, 9, 4, "div", 113)(9, RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Conditional_9_Template, 4, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r18 = \u0275\u0275nextContext().$implicit;
    const ctx_r8 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", ctx_r8.isAprobada(f_r18) ? "border-emerald-500" : ctx_r8.isRechazada(f_r18) ? "border-rose-500" : "border-slate-200 dark:border-white/10");
    \u0275\u0275advance(2);
    \u0275\u0275property("src", f_r18.url, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r8.tipoLabel(f_r18.id_tipo_foto));
    \u0275\u0275advance();
    \u0275\u0275conditional(5, ctx_r8.isAprobada(f_r18) ? 5 : ctx_r8.isRechazada(f_r18) ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(7, ctx_r8.isRechazada(f_r18) && (f_r18.razones == null ? null : f_r18.razones.length) ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(8, ctx_r8.isReviewable(f_r18) ? 8 : 9);
  }
}
function RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 122)(1, "mat-icon", 123);
    \u0275\u0275text(2, "image_not_supported");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 124);
    \u0275\u0275text(4, "Sin foto");
    \u0275\u0275elementEnd()();
  }
}
function RevisionVisitasComponent_Conditional_99_ng_template_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_0_Template, 10, 6, "div", 108)(1, RevisionVisitasComponent_Conditional_99_ng_template_34_Conditional_1_Template, 5, 0);
  }
  if (rf & 2) {
    const f_r18 = ctx.$implicit;
    \u0275\u0275conditional(0, f_r18 ? 0 : 1);
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 92);
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 94);
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r8 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r8.isRevisada ? "task_alt" : "fact_check");
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_53_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 130);
    \u0275\u0275element(1, "mat-spinner", 134);
    \u0275\u0275elementEnd();
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_53_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 135);
    \u0275\u0275text(1, "No hay mensajes todav\xEDa.");
    \u0275\u0275elementEnd();
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_53_Conditional_13_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6)(1, "div", 137)(2, "div", 138);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementStart(5, "div", 139);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "date");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const m_r22 = ctx.$implicit;
    \u0275\u0275classProp("items-end", m_r22.sender_type !== "cliente");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", m_r22.sender_type !== "cliente" ? "bg-primary-600 text-white rounded-br-sm" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-sm border border-slate-200 dark:border-white/5");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r22.sender_nombre || "Usuario");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", m_r22.mensaje, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(7, 6, m_r22.created_at, "dd/MM HH:mm"));
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_53_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, RevisionVisitasComponent_Conditional_99_Conditional_53_Conditional_13_For_1_Template, 8, 9, "div", 136, _forTrack2);
  }
  if (rf & 2) {
    const ctx_r8 = \u0275\u0275nextContext(3);
    \u0275\u0275repeater(ctx_r8.chatMessages());
  }
}
function RevisionVisitasComponent_Conditional_99_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 96)(1, "div", 125)(2, "div", 126)(3, "mat-icon", 10);
    \u0275\u0275text(4, "chat");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 127);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 128);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_99_Conditional_53_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r21);
      const ctx_r8 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r8.closeChat());
    });
    \u0275\u0275elementStart(8, "mat-icon", 10);
    \u0275\u0275text(9, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 129);
    \u0275\u0275template(11, RevisionVisitasComponent_Conditional_99_Conditional_53_Conditional_11_Template, 2, 0, "div", 130)(12, RevisionVisitasComponent_Conditional_99_Conditional_53_Conditional_12_Template, 2, 0)(13, RevisionVisitasComponent_Conditional_99_Conditional_53_Conditional_13_Template, 2, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 131)(15, "input", 132);
    \u0275\u0275twoWayListener("ngModelChange", function RevisionVisitasComponent_Conditional_99_Conditional_53_Template_input_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r21);
      const ctx_r8 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r8.chatInput, $event) || (ctx_r8.chatInput = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("keyup.enter", function RevisionVisitasComponent_Conditional_99_Conditional_53_Template_input_keyup_enter_15_listener() {
      \u0275\u0275restoreView(_r21);
      const ctx_r8 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r8.sendChat());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "button", 133);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_99_Conditional_53_Template_button_click_16_listener() {
      \u0275\u0275restoreView(_r21);
      const ctx_r8 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r8.sendChat());
    });
    \u0275\u0275elementStart(17, "mat-icon", 10);
    \u0275\u0275text(18, "send");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r8 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("Chat \xB7 Visita #", (tmp_3_0 = ctx_r8.selectedVisita()) == null ? null : tmp_3_0.id_visita, "");
    \u0275\u0275advance(5);
    \u0275\u0275conditional(11, ctx_r8.chatLoading() ? 11 : ctx_r8.chatMessages().length === 0 ? 12 : 13);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r8.chatInput);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r8.chatSending() || !ctx_r8.chatInput.trim());
  }
}
function RevisionVisitasComponent_Conditional_99_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 40)(1, "div", 75);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_99_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r8 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r8.closeReview());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 76)(3, "div", 77)(4, "div")(5, "h3", 78);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 79);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "button", 80);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_99_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r8 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r8.closeReview());
    });
    \u0275\u0275elementStart(10, "mat-icon");
    \u0275\u0275text(11, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "div", 81)(13, "button", 82);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_99_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r8 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r8.setGrupoSel("all"));
    });
    \u0275\u0275elementStart(14, "mat-icon", 57);
    \u0275\u0275text(15, "collections");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(17, RevisionVisitasComponent_Conditional_99_For_18_Template, 4, 5, "button", 83, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 84)(20, "button", 85);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_99_Template_button_click_20_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r8 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r8.photoFilter = "todas");
    });
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "button", 85);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_99_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r8 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r8.photoFilter = "pendientes");
    });
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "button", 85);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_99_Template_button_click_24_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r8 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r8.photoFilter = "aprobadas");
    });
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "button", 85);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_99_Template_button_click_26_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r8 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r8.photoFilter = "rechazadas");
    });
    \u0275\u0275text(27);
    \u0275\u0275elementEnd();
    \u0275\u0275template(28, RevisionVisitasComponent_Conditional_99_Conditional_28_Template, 5, 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "div", 86);
    \u0275\u0275template(30, RevisionVisitasComponent_Conditional_99_Conditional_30_Template, 2, 0, "div", 87)(31, RevisionVisitasComponent_Conditional_99_Conditional_31_Template, 11, 1)(32, RevisionVisitasComponent_Conditional_99_Conditional_32_Template, 2, 0)(33, RevisionVisitasComponent_Conditional_99_Conditional_33_Template, 3, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275template(34, RevisionVisitasComponent_Conditional_99_ng_template_34_Template, 2, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementStart(36, "div", 88)(37, "span", 58)(38, "mat-icon", 89);
    \u0275\u0275text(39, "cloud_done");
    \u0275\u0275elementEnd();
    \u0275\u0275text(40, " Guardado autom\xE1tico \xB7 el cliente ve las fotos al aprobarlas ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "div", 90)(42, "button", 91);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_99_Template_button_click_42_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r8 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r8.openChat());
    });
    \u0275\u0275elementStart(43, "mat-icon", 10);
    \u0275\u0275text(44, "chat");
    \u0275\u0275elementEnd();
    \u0275\u0275text(45, " Chat ");
    \u0275\u0275template(46, RevisionVisitasComponent_Conditional_99_Conditional_46_Template, 1, 0, "span", 92);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "button", 93);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_99_Template_button_click_47_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r8 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r8.toggleRevisada());
    });
    \u0275\u0275template(48, RevisionVisitasComponent_Conditional_99_Conditional_48_Template, 1, 0, "mat-spinner", 94)(49, RevisionVisitasComponent_Conditional_99_Conditional_49_Template, 2, 1);
    \u0275\u0275text(50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "button", 95);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_99_Template_button_click_51_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r8 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r8.closeReview());
    });
    \u0275\u0275text(52, "Cerrar");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(53, RevisionVisitasComponent_Conditional_99_Conditional_53_Template, 19, 4, "div", 96);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_17_0;
    const ctx_r8 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("Revisi\xF3n de Fotos \xB7 Visita #", (tmp_2_0 = ctx_r8.selectedVisita()) == null ? null : tmp_2_0.id_visita, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", (tmp_3_0 = ctx_r8.selectedVisita()) == null ? null : tmp_3_0.cliente, " \xB7 ", (tmp_3_0 = ctx_r8.selectedVisita()) == null ? null : tmp_3_0.punto_de_interes, "");
    \u0275\u0275advance(5);
    \u0275\u0275classMap(ctx_r8.grupoSel === "all" ? "bg-primary-600 text-white border-primary-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" Todas (", ctx_r8.photos().length, ") ");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r8.modalGrupos);
    \u0275\u0275advance(3);
    \u0275\u0275classMap(ctx_r8.photoFilter === "todas" ? "bg-slate-800 text-white" : "bg-slate-100 dark:bg-slate-800/50 text-slate-500");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Todas (", ctx_r8.grupoTotal, ")");
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r8.photoFilter === "pendientes" ? "bg-amber-600 text-white" : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Pendientes (", ctx_r8.countBy("pendiente"), ")");
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r8.photoFilter === "aprobadas" ? "bg-emerald-600 text-white" : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Aprobadas (", ctx_r8.countBy("Aprobada"), ")");
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r8.photoFilter === "rechazadas" ? "bg-rose-600 text-white" : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Rechazadas (", ctx_r8.countBy("Rechazada"), ")");
    \u0275\u0275advance();
    \u0275\u0275conditional(28, ctx_r8.groupHasPairs ? 28 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(30, ctx_r8.photosLoading() ? 30 : ctx_r8.showCompare ? 31 : ctx_r8.filteredPhotos.length === 0 ? 32 : 33);
    \u0275\u0275advance(16);
    \u0275\u0275conditional(46, ((tmp_17_0 = ctx_r8.selectedVisita()) == null ? null : tmp_17_0.tiene_chat) ? 46 : -1);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r8.isRevisada ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-primary-600 hover:bg-primary-500 text-white");
    \u0275\u0275property("disabled", ctx_r8.revisando());
    \u0275\u0275advance();
    \u0275\u0275conditional(48, ctx_r8.revisando() ? 48 : 49);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r8.isRevisada ? "Revisada \u2713" : "Marcar Revisada", " ");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(53, ctx_r8.chatOpen() ? 53 : -1);
  }
}
function RevisionVisitasComponent_Conditional_100_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 145)(1, "input", 151);
    \u0275\u0275listener("change", function RevisionVisitasComponent_Conditional_100_For_12_Template_input_change_1_listener() {
      const r_r25 = \u0275\u0275restoreView(_r24).$implicit;
      const ctx_r8 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r8.toggleReason(r_r25.id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 152);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r25 = ctx.$implicit;
    const ctx_r8 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", ctx_r8.isReasonSel(r_r25.id) ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800" : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800");
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r8.isReasonSel(r_r25.id));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r25.razon);
  }
}
function RevisionVisitasComponent_Conditional_100_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 146);
    \u0275\u0275text(1, "No hay razones configuradas.");
    \u0275\u0275elementEnd();
  }
}
function RevisionVisitasComponent_Conditional_100_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 94);
  }
}
function RevisionVisitasComponent_Conditional_100_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 10);
    \u0275\u0275text(1, "block");
    \u0275\u0275elementEnd();
  }
}
function RevisionVisitasComponent_Conditional_100_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 41)(1, "div", 75);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_100_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r8 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r8.cancelReject());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 140)(3, "div", 141)(4, "mat-icon");
    \u0275\u0275text(5, "cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "h3", 142);
    \u0275\u0275text(7, "Razones de rechazo");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 143)(9, "p", 144);
    \u0275\u0275text(10, "Selecciona una o varias razones:");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(11, RevisionVisitasComponent_Conditional_100_For_12_Template, 4, 3, "label", 145, _forTrack2);
    \u0275\u0275template(13, RevisionVisitasComponent_Conditional_100_Conditional_13_Template, 2, 0, "p", 146);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 147)(15, "span", 148);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 90)(18, "button", 149);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_100_Template_button_click_18_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r8 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r8.cancelReject());
    });
    \u0275\u0275text(19, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "button", 150);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_100_Template_button_click_20_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r8 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r8.confirmReject());
    });
    \u0275\u0275template(21, RevisionVisitasComponent_Conditional_100_Conditional_21_Template, 1, 0, "mat-spinner", 94)(22, RevisionVisitasComponent_Conditional_100_Conditional_22_Template, 2, 0);
    \u0275\u0275text(23, " Rechazar foto ");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r8 = \u0275\u0275nextContext();
    \u0275\u0275advance(11);
    \u0275\u0275repeater(ctx_r8.rejectReasons());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(13, ctx_r8.rejectReasons().length === 0 ? 13 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r8.selectedReasonIds.length, " seleccionada(s)");
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r8.rejecting() || ctx_r8.selectedReasonIds.length === 0);
    \u0275\u0275advance();
    \u0275\u0275conditional(21, ctx_r8.rejecting() ? 21 : 22);
  }
}
function RevisionVisitasComponent_Conditional_101_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 153);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_101_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r26);
      const ctx_r8 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r8.closeLightbox());
    });
    \u0275\u0275element(1, "div", 154);
    \u0275\u0275elementStart(2, "img", 155);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_101_Template_img_click_2_listener($event) {
      \u0275\u0275restoreView(_r26);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 156);
    \u0275\u0275listener("click", function RevisionVisitasComponent_Conditional_101_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r26);
      const ctx_r8 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r8.closeLightbox());
    });
    \u0275\u0275elementStart(4, "mat-icon");
    \u0275\u0275text(5, "close");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r8 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("src", ctx_r8.lightboxUrl(), \u0275\u0275sanitizeUrl);
  }
}
var RevisionVisitasComponent = class _RevisionVisitasComponent {
  constructor(api, snack, auth, realtime) {
    this.api = api;
    this.snack = snack;
    this.auth = auth;
    this.realtime = realtime;
    this.loading = signal(true);
    this.visitas = signal([]);
    this.periodo = "semana";
    this.desde = "";
    this.hasta = "";
    this.search = "";
    this.filtroRuta = "";
    this.filtroPunto = "";
    this.filtroCliente = "";
    this.filtroMercaderista = "";
    this.filtroChat = "";
    this.filtroEstado = "";
    this.reviewOpen = signal(false);
    this.selectedVisita = signal(null);
    this.photos = signal([]);
    this.photosLoading = signal(false);
    this.photoFilter = "todas";
    this.grupoSel = "all";
    this.modalGrupos = [];
    this.tipoLabels = {};
    this.comparar = true;
    this.ANTES_IDS = [1, 4, 8];
    this.DESPUES_IDS = [2, 7, 10];
    this.rejectReasons = signal([]);
    this.rejectDialogOpen = signal(false);
    this.rejectingPhoto = null;
    this.selectedReasonIds = [];
    this.rejecting = signal(false);
    this.lightboxUrl = signal(null);
    this.GRUPOS = [
      { key: "gestion", label: "Gesti\xF3n", icon: "photo_camera", ids: [1, 2], revisable: true },
      { key: "exhibiciones", label: "Exhibiciones", icon: "view_carousel", ids: [4, 7], revisable: true },
      { key: "pop", label: "Material POP", icon: "campaign", ids: [8, 10], revisable: true },
      { key: "precio", label: "Precio", icon: "sell", ids: [3], revisable: true },
      { key: "activacion", label: "Activaci\xF3n / Desact.", icon: "bolt", ids: [5, 6], revisable: false }
    ];
    this.revisando = signal(false);
    this.chatOpen = signal(false);
    this.chatMessages = signal([]);
    this.chatInput = "";
    this.chatLoading = signal(false);
    this.chatSending = signal(false);
  }
  ngOnInit() {
    const r = this.rangeFor("semana");
    this.desde = r.desde;
    this.hasta = r.hasta;
    this.load();
    this.api.getRejectReasons().subscribe({ next: (rs) => this.rejectReasons.set(rs || []), error: () => {
    } });
    this.realtime.events$.subscribe((ev) => {
      if (ev.tipo === "chat.message" && this.chatOpen() && ev.data?.visita_id === this.selectedVisita()?.id_visita) {
        this.loadChat();
        return;
      }
      if (ev.tipo.startsWith("visit.") || ev.tipo.startsWith("photo.")) {
        if (this.reviewOpen())
          return;
        clearTimeout(this.rtDebounce);
        this.rtDebounce = setTimeout(() => this.load(), 800);
      }
    });
  }
  rangeFor(p) {
    const hoy = /* @__PURE__ */ new Date();
    const fmt = (d2) => d2.toISOString().slice(0, 10);
    if (p === "hoy")
      return { desde: fmt(hoy), hasta: fmt(hoy) };
    const d = new Date(hoy);
    d.setDate(d.getDate() - (p === "semana" ? 6 : 29));
    return { desde: fmt(d), hasta: fmt(hoy) };
  }
  setPeriodo(p) {
    this.periodo = p;
    const r = this.rangeFor(p);
    this.desde = r.desde;
    this.hasta = r.hasta;
    this.load();
  }
  onDateChange() {
    this.periodo = "custom";
    this.load();
  }
  load() {
    this.loading.set(true);
    this.api.getReviewList({ desde: this.desde, hasta: this.hasta }).subscribe({
      next: (d) => {
        this.visitas.set(d || []);
        this.loading.set(false);
      },
      error: () => {
        this.visitas.set([]);
        this.loading.set(false);
      }
    });
  }
  // ── Opciones de filtros (valores distintos del set cargado) ──
  distinct(key) {
    return Array.from(new Set(this.visitas().map((v) => v[key]).filter((x) => x != null && x !== ""))).sort();
  }
  get rutasOpts() {
    return this.distinct("ruta");
  }
  get puntosOpts() {
    return this.distinct("punto_de_interes");
  }
  get clientesOpts() {
    return this.distinct("cliente");
  }
  get mercaderistasOpts() {
    return this.distinct("mercaderista");
  }
  clearFilters() {
    this.search = "";
    this.filtroRuta = "";
    this.filtroPunto = "";
    this.filtroCliente = "";
    this.filtroMercaderista = "";
    this.filtroChat = "";
    this.filtroEstado = "";
  }
  get filtered() {
    const s = this.search.trim().toLowerCase();
    return this.visitas().filter((v) => {
      if (this.filtroRuta && v.ruta !== this.filtroRuta)
        return false;
      if (this.filtroPunto && v.punto_de_interes !== this.filtroPunto)
        return false;
      if (this.filtroCliente && v.cliente !== this.filtroCliente)
        return false;
      if (this.filtroMercaderista && v.mercaderista !== this.filtroMercaderista)
        return false;
      if (this.filtroChat === "con" && !v.tiene_chat)
        return false;
      if (this.filtroChat === "sin" && v.tiene_chat)
        return false;
      if (this.filtroEstado && v.estado !== this.filtroEstado)
        return false;
      if (s && !((v.cliente || "").toLowerCase().includes(s) || (v.mercaderista || "").toLowerCase().includes(s) || (v.punto_de_interes || "").toLowerCase().includes(s) || (v.ruta || "").toLowerCase().includes(s) || String(v.id_visita).includes(s)))
        return false;
      return true;
    });
  }
  get stats() {
    const f = this.filtered;
    const fotos = f.reduce((a, v) => a + (v.fotos_revisar || 0), 0);
    const apr = f.reduce((a, v) => a + (v.aprobadas || 0), 0);
    const rec = f.reduce((a, v) => a + (v.rechazadas || 0), 0);
    const sin = f.reduce((a, v) => a + (v.sin_revisar || 0), 0);
    return {
      visitas: f.length,
      fotos,
      aprobadas: apr,
      rechazadas: rec,
      sin_revisar: sin,
      progreso: fotos ? Math.round(apr / fotos * 1e3) / 10 : 0
    };
  }
  pct(v) {
    const t = v.fotos_revisar || 0;
    return t ? Math.round((v.aprobadas || 0) / t * 100) : 0;
  }
  /** Agrupa el desglose `v.tipos` en grupos con total/rechazadas, omitiendo los vacíos. */
  gruposDe(v) {
    const tipos = v?.tipos || [];
    const out = [];
    const used = /* @__PURE__ */ new Set();
    for (const g of this.GRUPOS) {
      const items = tipos.filter((t) => g.ids.includes(t.id_tipo_foto));
      if (!items.length)
        continue;
      items.forEach((t) => used.add(t.id_tipo_foto));
      out.push({
        key: g.key,
        label: g.label,
        icon: g.icon,
        revisable: g.revisable,
        ids: items.map((t) => t.id_tipo_foto),
        total: items.reduce((a, t) => a + (t.total || 0), 0),
        rechazadas: items.reduce((a, t) => a + (t.rechazadas || 0), 0)
      });
    }
    const otros = tipos.filter((t) => !used.has(t.id_tipo_foto));
    if (otros.length) {
      out.push({
        key: "otros",
        label: "Otros",
        icon: "image",
        revisable: true,
        ids: otros.map((t) => t.id_tipo_foto),
        total: otros.reduce((a, t) => a + (t.total || 0), 0),
        rechazadas: otros.reduce((a, t) => a + (t.rechazadas || 0), 0)
      });
    }
    return out;
  }
  // ── Modal ──────────────────────────────────────────────
  openReview(v, grupoKey) {
    this.selectedVisita.set(v);
    this.photoFilter = "todas";
    this.modalGrupos = this.gruposDe(v);
    this.tipoLabels = {};
    (v.tipos || []).forEach((t) => this.tipoLabels[t.id_tipo_foto] = t.label);
    this.grupoSel = grupoKey ?? (this.modalGrupos.find((g) => g.revisable)?.key ?? "all");
    this.reviewOpen.set(true);
    this.chatOpen.set(false);
    this.photosLoading.set(true);
    this.api.getVisitPhotos(v.id_visita).subscribe({
      next: (ph) => {
        this.photos.set(ph);
        this.photosLoading.set(false);
      },
      error: () => {
        this.photos.set([]);
        this.photosLoading.set(false);
      }
    });
  }
  closeReview() {
    this.reviewOpen.set(false);
    this.chatOpen.set(false);
    this.selectedVisita.set(null);
    this.photos.set([]);
    this.modalGrupos = [];
  }
  setGrupoSel(key) {
    this.grupoSel = key;
    this.photoFilter = "todas";
  }
  isReviewable(f) {
    return ![5, 6].includes(f.id_tipo_foto);
  }
  estadoDe(f) {
    return f?.estado ?? "pendiente";
  }
  isAprobada(f) {
    return this.estadoDe(f) === "Aprobada";
  }
  isRechazada(f) {
    return this.estadoDe(f) === "Rechazada";
  }
  /** Aprobar/Rechazar se guarda EN VIVO: el cliente las ve a medida que se aprueban. */
  setDecision(f, estado) {
    if (!f || this.estadoDe(f) === estado)
      return;
    const prev = f.estado;
    this.photos.update((list) => list.map((x) => x.id === f.id ? __spreadProps(__spreadValues({}, x), { estado }) : x));
    const req = estado === "Aprobada" ? this.api.approvePhotos([f.id]) : this.api.rejectPhoto(f.id, "Rechazada por analista");
    req.subscribe({
      next: () => this.syncVisitaCounts(),
      error: () => {
        this.photos.update((list) => list.map((x) => x.id === f.id ? __spreadProps(__spreadValues({}, x), { estado: prev }) : x));
        this.snack.open("No se pudo guardar el cambio", "OK", { duration: 3e3 });
      }
    });
  }
  /** Refleja al instante los conteos en la tarjeta de la lista. */
  syncVisitaCounts() {
    const v = this.selectedVisita();
    if (!v)
      return;
    const rev = this.photos().filter((f) => this.isReviewable(f));
    const apr = rev.filter((f) => f.estado === "Aprobada").length;
    const rec = rev.filter((f) => f.estado === "Rechazada").length;
    const upd = { aprobadas: apr, rechazadas: rec, sin_revisar: Math.max(rev.length - apr - rec, 0) };
    this.visitas.update((list) => list.map((x) => x.id_visita === v.id_visita ? __spreadValues(__spreadValues({}, x), upd) : x));
  }
  // ── Rechazo con múltiples razones ─────────────────────────
  promptReject(f) {
    this.rejectingPhoto = f;
    this.selectedReasonIds = Array.isArray(f?.razones_ids) ? [...f.razones_ids] : [];
    this.rejectDialogOpen.set(true);
  }
  toggleReason(id) {
    const i = this.selectedReasonIds.indexOf(id);
    if (i >= 0)
      this.selectedReasonIds.splice(i, 1);
    else
      this.selectedReasonIds.push(id);
  }
  isReasonSel(id) {
    return this.selectedReasonIds.includes(id);
  }
  cancelReject() {
    this.rejectDialogOpen.set(false);
    this.rejectingPhoto = null;
    this.selectedReasonIds = [];
  }
  confirmReject() {
    const f = this.rejectingPhoto;
    if (!f || this.selectedReasonIds.length === 0) {
      this.snack.open("Selecciona al menos una raz\xF3n", "OK", { duration: 2500 });
      return;
    }
    const ids = [...this.selectedReasonIds];
    const nombres = this.rejectReasons().filter((r) => ids.includes(r.id)).map((r) => r.razon);
    const prev = { estado: f.estado, razones: f.razones, razones_ids: f.razones_ids, rechazado_por_nombre: f.rechazado_por_nombre };
    const quien = this.auth.currentUser()?.username || "T\xFA";
    this.photos.update((list) => list.map((x) => x.id === f.id ? __spreadProps(__spreadValues({}, x), { estado: "Rechazada", razones: nombres, razones_ids: ids, rechazado_por_nombre: quien }) : x));
    this.rejecting.set(true);
    this.api.rejectPhoto(f.id, "", ids).subscribe({
      next: () => {
        this.rejecting.set(false);
        this.rejectDialogOpen.set(false);
        this.rejectingPhoto = null;
        this.selectedReasonIds = [];
        this.syncVisitaCounts();
      },
      error: () => {
        this.photos.update((list) => list.map((x) => x.id === f.id ? __spreadValues(__spreadValues({}, x), prev) : x));
        this.rejecting.set(false);
        this.snack.open("No se pudo rechazar", "OK", { duration: 3e3 });
      }
    });
  }
  get isRevisada() {
    return !!this.selectedVisita()?.revisada;
  }
  toggleRevisada() {
    const v = this.selectedVisita();
    if (!v)
      return;
    const next = !v.revisada;
    this.revisando.set(true);
    this.api.markVisitReviewed(v.id_visita, next).subscribe({
      next: () => {
        v.revisada = next;
        v.estado = next ? "Revisado" : "Pendiente";
        this.selectedVisita.set(__spreadValues({}, v));
        this.visitas.update((list) => list.map((x) => x.id_visita === v.id_visita ? __spreadProps(__spreadValues({}, x), { revisada: next, estado: next ? "Revisado" : "Pendiente" }) : x));
        this.revisando.set(false);
        this.snack.open(next ? "Visita marcada como revisada" : "Marca de revisada quitada", "OK", { duration: 2500 });
      },
      error: () => {
        this.revisando.set(false);
        this.snack.open("No se pudo actualizar", "OK", { duration: 3e3 });
      }
    });
  }
  openChat() {
    this.chatOpen.set(true);
    this.loadChat();
  }
  closeChat() {
    this.chatOpen.set(false);
  }
  loadChat() {
    const v = this.selectedVisita();
    if (!v)
      return;
    this.chatLoading.set(true);
    this.api.getMessagesByVisit(v.id_visita).subscribe({
      next: (m) => {
        this.chatMessages.set(m);
        this.chatLoading.set(false);
      },
      error: () => {
        this.chatMessages.set([]);
        this.chatLoading.set(false);
      }
    });
  }
  sendChat() {
    const v = this.selectedVisita();
    const txt = this.chatInput.trim();
    if (!v || !txt)
      return;
    this.chatSending.set(true);
    this.api.sendMessage({ visita_id: v.id_visita, mensaje: txt, cliente_id: v.id_cliente }).subscribe({
      next: (m) => {
        this.chatMessages.update((list) => [...list, m]);
        this.chatInput = "";
        this.chatSending.set(false);
        this.visitas.update((list) => list.map((x) => x.id_visita === v.id_visita ? __spreadProps(__spreadValues({}, x), { tiene_chat: true }) : x));
      },
      error: () => {
        this.chatSending.set(false);
        this.snack.open("No se pudo enviar", "OK", { duration: 3e3 });
      }
    });
  }
  // fotos del grupo seleccionado en el modal
  photosByGrupo() {
    const ph = this.photos();
    if (this.grupoSel === "all")
      return ph;
    const ids = this.modalGrupos.find((g) => g.key === this.grupoSel)?.ids || [];
    return ph.filter((f) => ids.includes(f.id_tipo_foto));
  }
  get grupoTotal() {
    return this.photosByGrupo().length;
  }
  get filteredPhotos() {
    const ph = this.photosByGrupo();
    if (this.photoFilter === "todas")
      return ph;
    return ph.filter((f) => {
      const e = this.estadoDe(f);
      if (this.photoFilter === "aprobadas")
        return e === "Aprobada";
      if (this.photoFilter === "rechazadas")
        return e === "Rechazada";
      return e !== "Aprobada" && e !== "Rechazada";
    });
  }
  countBy(estado) {
    return this.photosByGrupo().filter((f) => {
      const e = this.estadoDe(f);
      if (estado === "pendiente")
        return e !== "Aprobada" && e !== "Rechazada";
      return e === estado;
    }).length;
  }
  tipoLabel(id) {
    return this.tipoLabels[id] || "Tipo " + id;
  }
  // ── Comparación Antes / Después ───────────────────────────
  estadoMatch(f) {
    if (this.photoFilter === "todas")
      return true;
    const e = this.estadoDe(f);
    if (this.photoFilter === "aprobadas")
      return e === "Aprobada";
    if (this.photoFilter === "rechazadas")
      return e === "Rechazada";
    return e !== "Aprobada" && e !== "Rechazada";
  }
  /** El grupo seleccionado tiene fotos de Antes y de Después → se puede comparar. */
  get groupHasPairs() {
    const ph = this.photosByGrupo();
    return ph.some((f) => this.ANTES_IDS.includes(f.id_tipo_foto)) && ph.some((f) => this.DESPUES_IDS.includes(f.id_tipo_foto));
  }
  get showCompare() {
    return this.comparar && this.groupHasPairs;
  }
  /** Empareja la N-ésima foto "Antes" con la N-ésima "Después" (orden por id). */
  get comparePairs() {
    const ph = this.photosByGrupo();
    const byId = (a, b) => (a.id || 0) - (b.id || 0);
    const antes = ph.filter((f) => this.ANTES_IDS.includes(f.id_tipo_foto) && this.estadoMatch(f)).sort(byId);
    const despues = ph.filter((f) => this.DESPUES_IDS.includes(f.id_tipo_foto) && this.estadoMatch(f)).sort(byId);
    const n = Math.max(antes.length, despues.length);
    const pairs = [];
    for (let i = 0; i < n; i++)
      pairs.push({ antes: antes[i] || null, despues: despues[i] || null });
    return pairs;
  }
  openLightbox(url) {
    if (url)
      this.lightboxUrl.set(url);
  }
  closeLightbox() {
    this.lightboxUrl.set(null);
  }
  static {
    this.\u0275fac = function RevisionVisitasComponent_Factory(t) {
      return new (t || _RevisionVisitasComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(MatSnackBar), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(RealtimeService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RevisionVisitasComponent, selectors: [["app-revision-visitas"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 102, vars: 20, consts: [["photoCard", ""], [1, "space-y-5", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "flex", "flex-col", "lg:flex-row", "lg:items-end", "justify-between", "gap-4"], [1, "text-3xl", "font-bold", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "flex", "flex-wrap", "items-end", "gap-3"], [1, "flex", "flex-col"], [1, "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-wider", "mb-1"], ["type", "date", 1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/10", "text-slate-700", "dark:text-white", "rounded-xl", "px-3", "py-2", "text-sm", "font-bold", "outline-none", "focus:border-primary-500", 3, "ngModelChange", "change", "ngModel"], [1, "flex", "items-center", "gap-1.5", "px-4", "py-2", "border", "border-primary-500/40", "text-primary-600", "dark:text-primary-400", "hover:bg-primary-50", "dark:hover:bg-primary-900/20", "rounded-xl", "text-sm", "font-bold", "transition-all", 3, "click"], [1, "!text-base"], [1, "grid", "grid-cols-2", "md:grid-cols-3", "lg:grid-cols-6", "gap-3"], [1, "bg-white", "dark:bg-slate-900", "border-t-4", "border-blue-500", "rounded-2xl", "p-4", "text-center", "shadow-sm"], [1, "text-2xl", "font-black", "text-slate-800", "dark:text-white"], [1, "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-wider", "mt-1"], [1, "bg-white", "dark:bg-slate-900", "border-t-4", "border-indigo-500", "rounded-2xl", "p-4", "text-center", "shadow-sm"], [1, "bg-white", "dark:bg-slate-900", "border-t-4", "border-emerald-500", "rounded-2xl", "p-4", "text-center", "shadow-sm"], [1, "text-2xl", "font-black", "text-emerald-600", "dark:text-emerald-400"], [1, "bg-white", "dark:bg-slate-900", "border-t-4", "border-amber-500", "rounded-2xl", "p-4", "text-center", "shadow-sm"], [1, "text-2xl", "font-black", "text-amber-600", "dark:text-amber-400"], [1, "bg-white", "dark:bg-slate-900", "border-t-4", "border-rose-500", "rounded-2xl", "p-4", "text-center", "shadow-sm"], [1, "text-2xl", "font-black", "text-rose-600", "dark:text-rose-400"], [1, "bg-white", "dark:bg-slate-900", "border-t-4", "border-yellow-400", "rounded-2xl", "p-4", "text-center", "shadow-sm"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "rounded-2xl", "p-3", "space-y-3", "shadow-sm"], [1, "relative"], [1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-400", "pointer-events-none", "!text-base"], ["placeholder", "Buscar visita, cliente, punto, mercaderista, ruta...", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-white/5", "focus:border-primary-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "pl-9", "pr-24", "py-2.5", "text-sm", "font-semibold", "outline-none", "transition-colors", 3, "ngModelChange", "ngModel"], [1, "absolute", "right-3", "top-1/2", "-translate-y-1/2", "text-xs", "font-bold", "text-slate-400"], [1, "flex", "flex-wrap", "items-center", "gap-2"], [1, "flex-1", "min-w-[140px]", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-white/5", "text-slate-700", "dark:text-white", "rounded-xl", "px-3", "py-2", "text-sm", "font-semibold", "outline-none", "focus:border-primary-500", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "flex-1", "min-w-[130px]", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-white/5", "text-slate-700", "dark:text-white", "rounded-xl", "px-3", "py-2", "text-sm", "font-semibold", "outline-none", "focus:border-primary-500", 3, "ngModelChange", "ngModel"], ["value", "Pendiente"], ["value", "Revisado"], [1, "flex-1", "min-w-[120px]", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-white/5", "text-slate-700", "dark:text-white", "rounded-xl", "px-3", "py-2", "text-sm", "font-semibold", "outline-none", "focus:border-primary-500", 3, "ngModelChange", "ngModel"], ["value", "con"], ["value", "sin"], ["matTooltip", "Limpiar filtros", 1, "w-9", "h-9", "shrink-0", "flex", "items-center", "justify-center", "rounded-xl", "border", "border-slate-200", "dark:border-white/10", "text-slate-400", "hover:text-rose-500", "hover:border-rose-300", "transition-colors", 3, "click"], [1, "flex", "flex-col", "items-center", "justify-center", "py-24", "gap-4"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4"], [1, "fixed", "inset-0", "z-[65]", "flex", "items-center", "justify-center", "p-4"], [1, "fixed", "inset-0", "z-[70]", "flex", "items-center", "justify-center", "p-4"], ["diameter", "48", "strokeWidth", "4"], [1, "text-slate-400", "font-medium"], [1, "py-20", "text-center"], [1, "flex", "flex-col", "items-center", "gap-3", "opacity-40"], [1, "!text-5xl"], [1, "font-bold"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "xl:grid-cols-3", "gap-4"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "rounded-2xl", "overflow-hidden", "shadow-sm", "hover:shadow-md", "transition-all", "flex", "flex-col"], [1, "px-4", "py-2.5", "flex", "items-center", "justify-between", "gap-2", "border-b", "border-slate-100", "dark:border-white/5"], [1, "text-xs", "font-mono", "px-2", "py-0.5", "rounded-lg", "bg-primary-50", "dark:bg-primary-900/30", "text-primary-600", "dark:text-primary-400", "font-bold"], [1, "text-[10px]", "font-black", "px-2", "py-1", "rounded-full", "bg-emerald-100", "dark:bg-emerald-950", "text-emerald-700", "dark:text-emerald-400"], [1, "p-4", "flex-1", "space-y-1.5"], [1, "font-black", "text-slate-800", "dark:text-white", "text-sm"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "flex", "items-center", "gap-1"], [1, "!text-sm"], [1, "text-xs", "text-slate-400", "flex", "items-center", "gap-1"], [1, "text-[11px]", "text-slate-400"], [1, "pt-2"], [1, "h-2", "rounded-full", "bg-slate-100", "dark:bg-slate-800", "overflow-hidden"], [1, "h-full", "rounded-full", "bg-emerald-500", "transition-all"], [1, "flex", "items-center", "justify-between", "mt-1.5", "text-[11px]"], [1, "text-slate-500"], [1, "text-amber-600", "dark:text-amber-400", "font-bold"], [1, "flex", "flex-wrap", "gap-1.5", "pt-1"], [1, "flex", "items-center", "gap-1", "text-[10px]", "font-bold", "px-2", "py-1", "rounded-lg", "border", "transition-colors", "active:scale-95", 3, "matTooltip", "ngClass"], [1, "px-4", "pb-4"], [1, "w-full", "flex", "items-center", "justify-center", "gap-2", "py-2.5", "bg-primary-600", "hover:bg-primary-500", "text-white", "font-black", "rounded-xl", "text-sm", "shadow-md", "transition-all", "active:scale-95", 3, "click"], [1, "text-[10px]", "font-black", "px-2", "py-1", "rounded-full", "bg-amber-100", "dark:bg-amber-950", "text-amber-700", "dark:text-amber-400"], [1, "flex", "items-center", "gap-1", "text-[10px]", "font-bold", "px-2", "py-1", "rounded-lg", "border", "transition-colors", "active:scale-95", 3, "click", "matTooltip", "ngClass"], [1, "!text-xs", "!w-3", "!h-3", "!leading-3"], [1, "font-black"], [1, "text-rose-500"], [1, "absolute", "inset-0", "bg-black/70", "backdrop-blur-sm", 3, "click"], [1, "relative", "w-full", "max-w-5xl", "bg-white", "dark:bg-slate-900", "rounded-3xl", "shadow-2xl", "overflow-hidden", "flex", "flex-col", 2, "max-height", "92vh"], [1, "bg-gradient-to-r", "from-primary-700", "to-indigo-600", "px-6", "py-4", "flex", "items-center", "justify-between", "shrink-0"], [1, "font-black", "text-white", "text-lg"], [1, "text-primary-200", "text-xs"], [1, "w-9", "h-9", "rounded-xl", "bg-white/20", "hover:bg-white/30", "text-white", "flex", "items-center", "justify-center", 3, "click"], [1, "px-6", "pt-3", "pb-3", "border-b", "border-slate-100", "dark:border-white/5", "shrink-0", "flex", "flex-wrap", "gap-2"], [1, "px-3", "py-1.5", "rounded-lg", "text-xs", "font-bold", "flex", "items-center", "gap-1", "border", 3, "click"], [1, "px-3", "py-1.5", "rounded-lg", "text-xs", "font-bold", "flex", "items-center", "gap-1", "border", 3, "class"], [1, "px-6", "py-3", "border-b", "border-slate-200", "dark:border-white/5", "shrink-0", "flex", "flex-wrap", "gap-2"], [1, "px-3", "py-1.5", "rounded-lg", "text-xs", "font-bold", 3, "click"], [1, "flex-1", "overflow-y-auto", "p-4"], [1, "flex", "justify-center", "py-16"], [1, "px-6", "py-4", "border-t", "border-slate-200", "dark:border-white/5", "flex", "items-center", "justify-between", "gap-3", "shrink-0", "bg-slate-50", "dark:bg-slate-800/50"], [1, "!text-sm", "text-emerald-500"], [1, "flex", "gap-2"], [1, "relative", "flex", "items-center", "gap-1.5", "px-4", "py-2.5", "border", "border-slate-300", "dark:border-slate-700", "text-slate-600", "dark:text-slate-300", "hover:border-primary-400", "rounded-xl", "font-bold", "text-sm", "transition-colors", 3, "click"], [1, "w-2", "h-2", "rounded-full", "bg-primary-500"], [1, "flex", "items-center", "gap-2", "px-5", "py-2.5", "disabled:opacity-50", "font-black", "rounded-xl", "text-sm", "shadow-lg", "transition-all", "active:scale-95", 3, "click", "disabled"], ["diameter", "16"], [1, "px-5", "py-2.5", "border", "border-slate-300", "dark:border-slate-700", "text-slate-600", "dark:text-slate-400", "rounded-xl", "font-bold", "text-sm", 3, "click"], [1, "absolute", "inset-y-0", "right-0", "w-full", "sm:w-96", "bg-white", "dark:bg-slate-900", "border-l", "border-slate-200", "dark:border-white/10", "shadow-2xl", "flex", "flex-col", "z-10", "animate-in", "slide-in-from-right", "duration-300"], [1, "flex-1"], [1, "px-3", "py-1.5", "rounded-lg", "text-xs", "font-bold", "flex", "items-center", "gap-1", 3, "click", "matTooltip"], ["diameter", "40"], [1, "grid", "grid-cols-2", "gap-3", "mb-3", "sticky", "-top-4", "z-10"], [1, "text-center", "text-xs", "font-black", "uppercase", "tracking-wider", "py-1.5", "rounded-lg", "bg-slate-200", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300", "flex", "items-center", "justify-center", "gap-1"], [1, "text-center", "text-xs", "font-black", "uppercase", "tracking-wider", "py-1.5", "rounded-lg", "bg-emerald-100", "dark:bg-emerald-950/50", "text-emerald-700", "dark:text-emerald-400", "flex", "items-center", "justify-center", "gap-1"], [1, "text-center", "text-slate-400", "py-12"], [1, "space-y-3"], [1, "grid", "grid-cols-2", "gap-3", "items-start"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "gap-3"], [1, "rounded-2xl", "overflow-hidden", "border-2", "transition-all", 3, "ngClass"], ["loading", "lazy", "decoding", "async", "fetchpriority", "low", "onerror", "this.style.opacity=0.3", 1, "w-full", "h-52", "object-cover", "cursor-pointer", "bg-slate-100", "dark:bg-slate-800", 3, "click", "src"], [1, "absolute", "top-2", "left-2", "text-[10px]", "font-black", "px-2", "py-0.5", "rounded-md", "bg-black/60", "text-white"], [1, "absolute", "top-2", "right-2", "text-[10px]", "font-black", "px-2", "py-0.5", "rounded-md", "bg-emerald-500", "text-white"], [1, "px-2", "py-1.5", "bg-rose-50", "dark:bg-rose-950/30", "border-t", "border-rose-100", "dark:border-rose-900/40"], [1, "flex"], [1, "absolute", "top-2", "right-2", "text-[10px]", "font-black", "px-2", "py-0.5", "rounded-md", "bg-rose-500", "text-white"], [1, "flex", "flex-wrap", "gap-1"], [1, "text-[9px]", "font-bold", "px-1.5", "py-0.5", "rounded", "bg-rose-100", "dark:bg-rose-900/50", "text-rose-600", "dark:text-rose-300"], [1, "text-[9px]", "text-rose-500/80", "mt-1", "flex", "items-center", "gap-0.5"], [1, "!text-[11px]", "!w-3", "!h-3"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-1", "py-2", "text-xs", "font-black", "transition-colors", 3, "click"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-1", "py-2", "text-xs", "font-black", "transition-colors", "border-l", "border-slate-200", "dark:border-white/5", 3, "click"], [1, "py-2", "text-center", "text-[11px]", "font-bold", "text-slate-400", "bg-slate-50", "dark:bg-slate-800", "flex", "items-center", "justify-center", "gap-1"], [1, "rounded-2xl", "border-2", "border-dashed", "border-slate-200", "dark:border-white/10", "h-52", "flex", "flex-col", "items-center", "justify-center", "text-slate-300", "dark:text-slate-700", "gap-1"], [1, "!text-3xl"], [1, "text-[10px]", "font-bold"], [1, "px-4", "py-3", "bg-gradient-to-r", "from-primary-700", "to-indigo-600", "flex", "items-center", "justify-between", "shrink-0"], [1, "flex", "items-center", "gap-2", "text-white"], [1, "font-black", "text-sm"], [1, "w-8", "h-8", "rounded-lg", "bg-white/20", "hover:bg-white/30", "text-white", "flex", "items-center", "justify-center", 3, "click"], [1, "flex-1", "overflow-y-auto", "p-3", "space-y-2", "bg-slate-50", "dark:bg-slate-950/40"], [1, "flex", "justify-center", "py-8"], [1, "p-3", "border-t", "border-slate-200", "dark:border-white/10", "flex", "gap-2", "shrink-0"], ["placeholder", "Escribe un mensaje...", 1, "flex-1", "bg-slate-100", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-white/5", "rounded-xl", "px-3", "py-2", "text-sm", "text-slate-800", "dark:text-white", "placeholder-slate-400", "outline-none", "focus:border-primary-500", 3, "ngModelChange", "keyup.enter", "ngModel"], [1, "w-10", "h-10", "rounded-xl", "bg-primary-600", "hover:bg-primary-500", "disabled:opacity-40", "text-white", "flex", "items-center", "justify-center", 3, "click", "disabled"], ["diameter", "28"], [1, "text-center", "text-slate-400", "text-xs", "py-8"], [1, "flex", "flex-col", 3, "items-end"], [1, "max-w-[80%]", "rounded-2xl", "px-3", "py-2", "text-sm", 3, "ngClass"], [1, "text-[10px]", "font-bold", "opacity-70", "mb-0.5"], [1, "text-[9px]", "opacity-60", "mt-0.5", "text-right"], [1, "relative", "w-full", "max-w-md", "bg-white", "dark:bg-slate-900", "rounded-3xl", "shadow-2xl", "overflow-hidden", "flex", "flex-col", 2, "max-height", "88vh"], [1, "bg-rose-600", "px-5", "py-4", "flex", "items-center", "gap-2", "text-white", "shrink-0"], [1, "font-black", "text-base"], [1, "p-4", "overflow-y-auto", "space-y-1.5"], [1, "text-xs", "text-slate-500", "mb-2"], [1, "flex", "items-center", "gap-2", "p-2.5", "rounded-xl", "cursor-pointer", "border", "transition-colors", 3, "ngClass"], [1, "text-center", "text-slate-400", "text-sm", "py-4"], [1, "px-4", "py-3", "border-t", "border-slate-200", "dark:border-white/5", "flex", "justify-between", "items-center", "gap-2", "shrink-0"], [1, "text-xs", "text-slate-400"], [1, "px-4", "py-2", "border", "border-slate-300", "dark:border-slate-700", "text-slate-600", "dark:text-slate-400", "rounded-xl", "font-bold", "text-sm", 3, "click"], [1, "flex", "items-center", "gap-2", "px-5", "py-2", "bg-rose-600", "hover:bg-rose-500", "disabled:opacity-50", "text-white", "font-black", "rounded-xl", "text-sm", 3, "click", "disabled"], ["type", "checkbox", 1, "w-4", "h-4", "accent-rose-600", 3, "change", "checked"], [1, "text-sm", "font-semibold", "text-slate-700", "dark:text-slate-200"], [1, "fixed", "inset-0", "z-[70]", "flex", "items-center", "justify-center", "p-4", 3, "click"], [1, "absolute", "inset-0", "bg-black/85"], [1, "relative", "max-w-full", "max-h-[90vh]", "object-contain", "rounded-2xl", "shadow-2xl", 3, "click", "src"], [1, "absolute", "top-4", "right-4", "w-10", "h-10", "rounded-xl", "bg-white/10", "hover:bg-white/20", "text-white", "flex", "items-center", "justify-center", 3, "click"]], template: function RevisionVisitasComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div")(3, "h1", 3);
        \u0275\u0275text(4, "Todas las Visitas");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p", 4);
        \u0275\u0275text(6, "Revisa y aprueba/rechaza las fotos de gesti\xF3n de cada visita.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div", 5)(8, "div", 6)(9, "label", 7);
        \u0275\u0275text(10, "Desde");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "input", 8);
        \u0275\u0275twoWayListener("ngModelChange", function RevisionVisitasComponent_Template_input_ngModelChange_11_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.desde, $event) || (ctx.desde = $event);
          return $event;
        });
        \u0275\u0275listener("change", function RevisionVisitasComponent_Template_input_change_11_listener() {
          return ctx.onDateChange();
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "div", 6)(13, "label", 7);
        \u0275\u0275text(14, "Hasta");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "input", 8);
        \u0275\u0275twoWayListener("ngModelChange", function RevisionVisitasComponent_Template_input_ngModelChange_15_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.hasta, $event) || (ctx.hasta = $event);
          return $event;
        });
        \u0275\u0275listener("change", function RevisionVisitasComponent_Template_input_change_15_listener() {
          return ctx.onDateChange();
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(16, "button", 9);
        \u0275\u0275listener("click", function RevisionVisitasComponent_Template_button_click_16_listener() {
          return ctx.load();
        });
        \u0275\u0275elementStart(17, "mat-icon", 10);
        \u0275\u0275text(18, "refresh");
        \u0275\u0275elementEnd();
        \u0275\u0275text(19, " Actualizar ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(20, "div", 11)(21, "div", 12)(22, "div", 13);
        \u0275\u0275text(23);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(24, "div", 14);
        \u0275\u0275text(25, "Visitas");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(26, "div", 15)(27, "div", 13);
        \u0275\u0275text(28);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(29, "div", 14);
        \u0275\u0275text(30, "Fotos Totales");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(31, "div", 16)(32, "div", 17);
        \u0275\u0275text(33);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(34, "div", 14);
        \u0275\u0275text(35, "Aprobadas");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(36, "div", 18)(37, "div", 19);
        \u0275\u0275text(38);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(39, "div", 14);
        \u0275\u0275text(40, "Sin Revisar");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(41, "div", 20)(42, "div", 21);
        \u0275\u0275text(43);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(44, "div", 14);
        \u0275\u0275text(45, "Rechazadas");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(46, "div", 22)(47, "div", 13);
        \u0275\u0275text(48);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(49, "div", 14);
        \u0275\u0275text(50, "Progreso");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(51, "div", 23)(52, "div", 24)(53, "mat-icon", 25);
        \u0275\u0275text(54, "search");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(55, "input", 26);
        \u0275\u0275twoWayListener("ngModelChange", function RevisionVisitasComponent_Template_input_ngModelChange_55_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.search, $event) || (ctx.search = $event);
          return $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(56, "span", 27);
        \u0275\u0275text(57);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(58, "div", 28)(59, "select", 29);
        \u0275\u0275twoWayListener("ngModelChange", function RevisionVisitasComponent_Template_select_ngModelChange_59_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filtroRuta, $event) || (ctx.filtroRuta = $event);
          return $event;
        });
        \u0275\u0275elementStart(60, "option", 30);
        \u0275\u0275text(61, "Todas las rutas");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(62, RevisionVisitasComponent_For_63_Template, 2, 2, "option", 31, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(64, "select", 29);
        \u0275\u0275twoWayListener("ngModelChange", function RevisionVisitasComponent_Template_select_ngModelChange_64_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filtroPunto, $event) || (ctx.filtroPunto = $event);
          return $event;
        });
        \u0275\u0275elementStart(65, "option", 30);
        \u0275\u0275text(66, "Todos los puntos");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(67, RevisionVisitasComponent_For_68_Template, 2, 2, "option", 31, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(69, "select", 29);
        \u0275\u0275twoWayListener("ngModelChange", function RevisionVisitasComponent_Template_select_ngModelChange_69_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filtroCliente, $event) || (ctx.filtroCliente = $event);
          return $event;
        });
        \u0275\u0275elementStart(70, "option", 30);
        \u0275\u0275text(71, "Todos los clientes");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(72, RevisionVisitasComponent_For_73_Template, 2, 2, "option", 31, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(74, "select", 29);
        \u0275\u0275twoWayListener("ngModelChange", function RevisionVisitasComponent_Template_select_ngModelChange_74_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filtroMercaderista, $event) || (ctx.filtroMercaderista = $event);
          return $event;
        });
        \u0275\u0275elementStart(75, "option", 30);
        \u0275\u0275text(76, "Todos los mercaderistas");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(77, RevisionVisitasComponent_For_78_Template, 2, 2, "option", 31, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(79, "select", 32);
        \u0275\u0275twoWayListener("ngModelChange", function RevisionVisitasComponent_Template_select_ngModelChange_79_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filtroEstado, $event) || (ctx.filtroEstado = $event);
          return $event;
        });
        \u0275\u0275elementStart(80, "option", 30);
        \u0275\u0275text(81, "Todos los estados");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(82, "option", 33);
        \u0275\u0275text(83, "Pendientes");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(84, "option", 34);
        \u0275\u0275text(85, "Revisadas");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(86, "select", 35);
        \u0275\u0275twoWayListener("ngModelChange", function RevisionVisitasComponent_Template_select_ngModelChange_86_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filtroChat, $event) || (ctx.filtroChat = $event);
          return $event;
        });
        \u0275\u0275elementStart(87, "option", 30);
        \u0275\u0275text(88, "Todos los chats");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(89, "option", 36);
        \u0275\u0275text(90, "Con chat");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(91, "option", 37);
        \u0275\u0275text(92, "Sin chat");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(93, "button", 38);
        \u0275\u0275listener("click", function RevisionVisitasComponent_Template_button_click_93_listener() {
          return ctx.clearFilters();
        });
        \u0275\u0275elementStart(94, "mat-icon", 10);
        \u0275\u0275text(95, "close");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(96, RevisionVisitasComponent_Conditional_96_Template, 4, 0, "div", 39)(97, RevisionVisitasComponent_Conditional_97_Template, 6, 0)(98, RevisionVisitasComponent_Conditional_98_Template, 3, 0);
        \u0275\u0275elementEnd();
        \u0275\u0275template(99, RevisionVisitasComponent_Conditional_99_Template, 54, 27, "div", 40)(100, RevisionVisitasComponent_Conditional_100_Template, 24, 4, "div", 41)(101, RevisionVisitasComponent_Conditional_101_Template, 6, 1, "div", 42);
      }
      if (rf & 2) {
        \u0275\u0275advance(11);
        \u0275\u0275twoWayProperty("ngModel", ctx.desde);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.hasta);
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate(ctx.stats.visitas);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.stats.fotos);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.stats.aprobadas);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.stats.sin_revisar);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.stats.rechazadas);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate1("", ctx.stats.progreso, "%");
        \u0275\u0275advance(7);
        \u0275\u0275twoWayProperty("ngModel", ctx.search);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1("", ctx.filtered.length, " resultados");
        \u0275\u0275advance(2);
        \u0275\u0275twoWayProperty("ngModel", ctx.filtroRuta);
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.rutasOpts);
        \u0275\u0275advance(2);
        \u0275\u0275twoWayProperty("ngModel", ctx.filtroPunto);
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.puntosOpts);
        \u0275\u0275advance(2);
        \u0275\u0275twoWayProperty("ngModel", ctx.filtroCliente);
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.clientesOpts);
        \u0275\u0275advance(2);
        \u0275\u0275twoWayProperty("ngModel", ctx.filtroMercaderista);
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.mercaderistasOpts);
        \u0275\u0275advance(2);
        \u0275\u0275twoWayProperty("ngModel", ctx.filtroEstado);
        \u0275\u0275advance(7);
        \u0275\u0275twoWayProperty("ngModel", ctx.filtroChat);
        \u0275\u0275advance(10);
        \u0275\u0275conditional(96, ctx.loading() ? 96 : ctx.filtered.length === 0 ? 97 : 98);
        \u0275\u0275advance(3);
        \u0275\u0275conditional(99, ctx.reviewOpen() ? 99 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(100, ctx.rejectDialogOpen() ? 100 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(101, ctx.lightboxUrl() ? 101 : -1);
      }
    }, dependencies: [CommonModule, NgClass, NgTemplateOutlet, DatePipe, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, MatIconModule, MatIcon, MatProgressSpinnerModule, MatProgressSpinner, MatSnackBarModule, MatTooltipModule, MatTooltip], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RevisionVisitasComponent, { className: "RevisionVisitasComponent", filePath: "src\\app\\features\\revision-visitas\\revision-visitas.component.ts", lineNumber: 21 });
})();

export {
  RevisionVisitasComponent
};
//# sourceMappingURL=chunk-2KPHPDAE.js.map
