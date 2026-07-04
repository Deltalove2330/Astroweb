import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from "./chunk-KCFHIW3D.js";
import {
  MatInput,
  MatInputModule
} from "./chunk-GXZEZIYO.js";
import {
  MatListModule
} from "./chunk-EBSQWFJT.js";
import "./chunk-APQQCC2U.js";
import {
  AuthService
} from "./chunk-FAJEMXMR.js";
import {
  MatFormFieldModule
} from "./chunk-YUDUWHLJ.js";
import {
  MatCardModule
} from "./chunk-HA7AXTKJ.js";
import "./chunk-CELNEZAJ.js";
import "./chunk-ABO6AUNU.js";
import {
  DefaultValueAccessor,
  FormControl,
  FormControlDirective,
  FormsModule,
  NgControlStatus,
  NgModel,
  ReactiveFormsModule
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
import {
  ActivatedRoute
} from "./chunk-QGVFX6Y7.js";
import {
  environment
} from "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  AnonymousSubject,
  CommonModule,
  DatePipe,
  NgClass,
  Observable,
  ReplaySubject,
  Subject,
  Subscriber,
  Subscription,
  computed,
  debounceTime,
  delayWhen,
  distinctUntilChanged,
  retryWhen,
  signal,
  timer,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
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
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-QB3BCYT5.js";

// src/app/features/chat/new-chat-dialog.component.ts
var _forTrack0 = ($index, $item) => $item.id_usuario;
var _forTrack1 = ($index, $item) => $item.region;
var _forTrack2 = ($index, $item) => $item.identificador;
function NewChatDialogComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "mat-spinner", 13);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Cargando opciones...");
    \u0275\u0275elementEnd()();
  }
}
function NewChatDialogComponent_Conditional_19_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 14);
    \u0275\u0275text(1, "Elige el tipo de chat que quieres crear.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 15)(3, "button", 16);
    \u0275\u0275listener("click", function NewChatDialogComponent_Conditional_19_Conditional_0_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectTipo("direct"));
    });
    \u0275\u0275elementStart(4, "mat-icon");
    \u0275\u0275text(5, "person");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 17);
    \u0275\u0275text(7, "Chat directo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "small");
    \u0275\u0275text(9, "Con un analista o mercaderista");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "button", 16);
    \u0275\u0275listener("click", function NewChatDialogComponent_Conditional_19_Conditional_0_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectTipo("group_team"));
    });
    \u0275\u0275elementStart(11, "mat-icon");
    \u0275\u0275text(12, "groups");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 17);
    \u0275\u0275text(14, "Equipo completo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "small");
    \u0275\u0275text(16, "Todos los analistas, mercs, supervisores");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "button", 16);
    \u0275\u0275listener("click", function NewChatDialogComponent_Conditional_19_Conditional_0_Template_button_click_17_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectTipo("group_region"));
    });
    \u0275\u0275elementStart(18, "mat-icon");
    \u0275\u0275text(19, "map");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span", 17);
    \u0275\u0275text(21, "Por regi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "small");
    \u0275\u0275text(23, "Mercaderistas de una regi\xF3n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "button", 16);
    \u0275\u0275listener("click", function NewChatDialogComponent_Conditional_19_Conditional_0_Template_button_click_24_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectTipo("group_pdv"));
    });
    \u0275\u0275elementStart(25, "mat-icon");
    \u0275\u0275text(26, "store");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "span", 17);
    \u0275\u0275text(28, "Por PDV");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "small");
    \u0275\u0275text(30, "Mercaderistas de un punto");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("selected", ctx_r1.tipo() === "direct");
    \u0275\u0275advance(7);
    \u0275\u0275classProp("selected", ctx_r1.tipo() === "group_team");
    \u0275\u0275advance(7);
    \u0275\u0275classProp("selected", ctx_r1.tipo() === "group_region");
    \u0275\u0275advance(7);
    \u0275\u0275classProp("selected", ctx_r1.tipo() === "group_pdv");
  }
}
function NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_4_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_4_For_3_Template_button_click_0_listener() {
      const u_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.destinatarioId.set(u_r5.id_usuario));
    });
    \u0275\u0275elementStart(1, "mat-icon", 25);
    \u0275\u0275text(2, "analytics");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 26)(4, "span", 27);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "small");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "mat-icon", 28);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const u_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("selected", ctx_r1.destinatarioId() === u_r5.id_usuario);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(u_r5.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r5.subtitulo);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.destinatarioId() === u_r5.id_usuario ? "check_circle" : "radio_button_unchecked");
  }
}
function NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_4_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_4_For_7_Template_button_click_0_listener() {
      const u_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.destinatarioId.set(u_r7.id_usuario));
    });
    \u0275\u0275elementStart(1, "mat-icon", 29);
    \u0275\u0275text(2, "person");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 26)(4, "span", 27);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "small");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "mat-icon", 28);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const u_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("selected", ctx_r1.destinatarioId() === u_r7.id_usuario);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(u_r7.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r7.subtitulo);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.destinatarioId() === u_r7.id_usuario ? "check_circle" : "radio_button_unchecked");
  }
}
function NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_4_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 23);
    \u0275\u0275text(1, "No hay destinatarios disponibles.");
    \u0275\u0275elementEnd();
  }
}
function NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1, "Analistas asignados");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(2, NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_4_For_3_Template, 10, 5, "button", 22, _forTrack0);
    \u0275\u0275elementStart(4, "p", 21);
    \u0275\u0275text(5, "Mercaderistas asignados");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_4_For_7_Template, 10, 5, "button", 22, _forTrack0);
    \u0275\u0275template(8, NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_4_Conditional_8_Template, 2, 0, "p", 23);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.filteredAnalistas());
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r1.filteredMercaderistas());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(8, ctx_r1.filteredAnalistas().length === 0 && ctx_r1.filteredMercaderistas().length === 0 ? 8 : -1);
  }
}
function NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "mat-icon");
    \u0275\u0275text(2, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "strong");
    \u0275\u0275text(5, "Se incluir\xE1:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "ul")(7, "li");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "li");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "li");
    \u0275\u0275text(12, "Supervisores y coordinadores activos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "li");
    \u0275\u0275text(14, "Todos los usuarios del cliente");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1("", ((tmp_3_0 = ctx_r1.recipients()) == null ? null : tmp_3_0.analistas == null ? null : tmp_3_0.analistas.length) || 0, " analista(s)");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ((tmp_4_0 = ctx_r1.recipients()) == null ? null : tmp_4_0.mercaderistas == null ? null : tmp_4_0.mercaderistas.length) || 0, " mercaderista(s)");
  }
}
function NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_6_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_6_For_1_Template_button_click_0_listener() {
      const r_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.region.set(r_r9.region));
    });
    \u0275\u0275elementStart(1, "mat-icon", 30);
    \u0275\u0275text(2, "map");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 26)(4, "span", 27);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "small");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "mat-icon", 28);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("selected", ctx_r1.region() === r_r9.region);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(r_r9.region);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", r_r9.mercaderistas_count, " mercaderista(s)");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.region() === r_r9.region ? "check_circle" : "radio_button_unchecked");
  }
}
function NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 23);
    \u0275\u0275text(1, "No hay regiones con mercaderistas asignados.");
    \u0275\u0275elementEnd();
  }
}
function NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_6_For_1_Template, 10, 5, "button", 22, _forTrack1);
    \u0275\u0275template(2, NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_6_Conditional_2_Template, 2, 0, "p", 23);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275repeater(ctx_r1.filteredRegiones());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(2, ctx_r1.filteredRegiones().length === 0 ? 2 : -1);
  }
}
function NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_7_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_7_For_1_Template_button_click_0_listener() {
      const p_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.puntoInteresId.set(p_r11.identificador));
    });
    \u0275\u0275elementStart(1, "mat-icon", 31);
    \u0275\u0275text(2, "store");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 26)(4, "span", 27);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "small");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "mat-icon", 28);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r11 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("selected", ctx_r1.puntoInteresId() === p_r11.identificador);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(p_r11.punto_de_interes);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", p_r11.region || "\u2014", " \xB7 ", p_r11.mercaderistas_count, " mercaderista(s)");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.puntoInteresId() === p_r11.identificador ? "check_circle" : "radio_button_unchecked");
  }
}
function NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_7_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 23);
    \u0275\u0275text(1, "No hay PDVs con mercaderistas asignados.");
    \u0275\u0275elementEnd();
  }
}
function NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_7_For_1_Template, 10, 6, "button", 22, _forTrack2);
    \u0275\u0275template(2, NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_7_Conditional_2_Template, 2, 0, "p", 23);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275repeater(ctx_r1.filteredPdvs());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(2, ctx_r1.filteredPdvs().length === 0 ? 2 : -1);
  }
}
function NewChatDialogComponent_Conditional_19_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18)(1, "mat-icon");
    \u0275\u0275text(2, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 19);
    \u0275\u0275twoWayListener("ngModelChange", function NewChatDialogComponent_Conditional_19_Conditional_1_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.searchTerm, $event) || (ctx_r1.searchTerm = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(4, NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_4_Template, 9, 1)(5, NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_5_Template, 15, 2, "div", 20)(6, NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_6_Template, 3, 1)(7, NewChatDialogComponent_Conditional_19_Conditional_1_Conditional_7_Template, 3, 1);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.searchTerm);
    \u0275\u0275advance();
    \u0275\u0275conditional(4, ctx_r1.tipo() === "direct" ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(5, ctx_r1.tipo() === "group_team" ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(6, ctx_r1.tipo() === "group_region" ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(7, ctx_r1.tipo() === "group_pdv" ? 7 : -1);
  }
}
function NewChatDialogComponent_Conditional_19_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 14);
    \u0275\u0275text(1, " Escribe el primer mensaje (opcional). Puedes crear el chat sin mensaje y enviarlo despu\xE9s. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "textarea", 32);
    \u0275\u0275twoWayListener("ngModelChange", function NewChatDialogComponent_Conditional_19_Conditional_2_Template_textarea_ngModelChange_2_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.primerMensaje, $event) || (ctx_r1.primerMensaje = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.primerMensaje);
  }
}
function NewChatDialogComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, NewChatDialogComponent_Conditional_19_Conditional_0_Template, 31, 8)(1, NewChatDialogComponent_Conditional_19_Conditional_1_Template, 8, 5)(2, NewChatDialogComponent_Conditional_19_Conditional_2_Template, 3, 1);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(0, ctx_r1.step() === 1 ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(1, ctx_r1.step() === 2 ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(2, ctx_r1.step() === 3 ? 2 : -1);
  }
}
function NewChatDialogComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 33);
    \u0275\u0275listener("click", function NewChatDialogComponent_Conditional_21_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.prev());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "arrow_back");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Atr\xE1s ");
    \u0275\u0275elementEnd();
  }
}
function NewChatDialogComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 34);
    \u0275\u0275listener("click", function NewChatDialogComponent_Conditional_23_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.next());
    });
    \u0275\u0275text(1, " Siguiente ");
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "arrow_forward");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", !ctx_r1.canAdvance());
  }
}
function NewChatDialogComponent_Conditional_24_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 36);
  }
}
function NewChatDialogComponent_Conditional_24_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1, "send");
    \u0275\u0275elementEnd();
  }
}
function NewChatDialogComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 35);
    \u0275\u0275listener("click", function NewChatDialogComponent_Conditional_24_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.create());
    });
    \u0275\u0275template(1, NewChatDialogComponent_Conditional_24_Conditional_1_Template, 1, 0, "mat-spinner", 36)(2, NewChatDialogComponent_Conditional_24_Conditional_2_Template, 2, 0);
    \u0275\u0275text(3, " Crear chat ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r1.creating());
    \u0275\u0275advance();
    \u0275\u0275conditional(1, ctx_r1.creating() ? 1 : 2);
  }
}
var NewChatDialogComponent = class _NewChatDialogComponent {
  constructor(api, dialogRef, data) {
    this.api = api;
    this.dialogRef = dialogRef;
    this.data = data;
    this.step = signal(1);
    this.loading = signal(false);
    this.creating = signal(false);
    this.tipo = signal(null);
    this.destinatarioId = signal(null);
    this.region = signal(null);
    this.puntoInteresId = signal(null);
    this.primerMensaje = "";
    this.searchTerm = "";
    this.recipients = signal(null);
    this.filteredAnalistas = computed(() => {
      const term = this.searchTerm.toLowerCase().trim();
      const list = this.recipients()?.analistas || [];
      return term ? list.filter((a) => a.nombre.toLowerCase().includes(term)) : list;
    });
    this.filteredMercaderistas = computed(() => {
      const term = this.searchTerm.toLowerCase().trim();
      const list = this.recipients()?.mercaderistas || [];
      return term ? list.filter((m) => m.nombre.toLowerCase().includes(term)) : list;
    });
    this.filteredRegiones = computed(() => {
      const term = this.searchTerm.toLowerCase().trim();
      const list = this.recipients()?.regiones || [];
      return term ? list.filter((r) => r.region.toLowerCase().includes(term)) : list;
    });
    this.filteredPdvs = computed(() => {
      const term = this.searchTerm.toLowerCase().trim();
      const list = this.recipients()?.pdvs || [];
      return term ? list.filter((p) => p.punto_de_interes.toLowerCase().includes(term)) : list;
    });
    this.stepLabel = computed(() => {
      switch (this.step()) {
        case 1:
          return "Selecciona el tipo";
        case 2:
          return "Elige destinatario";
        case 3:
          return "Mensaje inicial";
      }
      return "";
    });
  }
  ngOnInit() {
    this.loading.set(true);
    this.api.getChatRecipients(this.data.clienteId).subscribe({
      next: (r) => {
        this.recipients.set(r);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  selectTipo(t) {
    this.tipo.set(t);
    this.destinatarioId.set(null);
    this.region.set(null);
    this.puntoInteresId.set(null);
  }
  canAdvance() {
    if (this.step() === 1)
      return !!this.tipo();
    if (this.step() === 2) {
      const t = this.tipo();
      if (t === "direct")
        return !!this.destinatarioId();
      if (t === "group_team")
        return true;
      if (t === "group_region")
        return !!this.region();
      if (t === "group_pdv")
        return !!this.puntoInteresId();
    }
    return true;
  }
  next() {
    if (!this.canAdvance())
      return;
    if (this.step() < 3)
      this.step.update((s) => s + 1);
  }
  prev() {
    if (this.step() > 1)
      this.step.update((s) => s - 1);
    this.searchTerm = "";
  }
  cancel() {
    this.dialogRef.close(null);
  }
  create() {
    const tipo = this.tipo();
    if (!tipo)
      return;
    this.creating.set(true);
    const body = { tipo };
    if (this.data.clienteId)
      body.cliente_id = this.data.clienteId;
    if (tipo === "direct")
      body.destinatario_id = this.destinatarioId();
    if (tipo === "group_region")
      body.region = this.region();
    if (tipo === "group_pdv")
      body.punto_interes_id = this.puntoInteresId();
    if (this.primerMensaje.trim())
      body.primer_mensaje = this.primerMensaje.trim();
    this.api.createConversation(body).subscribe({
      next: (conv) => {
        this.creating.set(false);
        this.dialogRef.close(conv);
      },
      error: (err) => {
        this.creating.set(false);
        const detail = err?.error?.detail || "No se pudo crear la conversaci\xF3n.";
        alert(detail);
      }
    });
  }
  static {
    this.\u0275fac = function NewChatDialogComponent_Factory(t) {
      return new (t || _NewChatDialogComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NewChatDialogComponent, selectors: [["app-new-chat-dialog"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 25, vars: 12, consts: [[1, "nc-dialog"], [1, "nc-header"], [1, "nc-header-icon"], [1, "nc-title"], [1, "nc-subtitle"], [1, "nc-close", 3, "click"], [1, "nc-stepper"], [1, "nc-body"], [1, "nc-loading"], [1, "nc-footer"], [1, "nc-btn", "nc-btn-secondary"], [2, "flex", "1"], [1, "nc-btn", "nc-btn-primary", 3, "disabled"], ["diameter", "36"], [1, "nc-help"], [1, "nc-type-grid"], [1, "nc-type-card", 3, "click"], [1, "nc-type-name"], [1, "nc-search"], ["type", "text", "placeholder", "Buscar...", 3, "ngModelChange", "ngModel"], [1, "nc-info-box"], [1, "nc-section-label"], [1, "nc-recipient", 3, "selected"], [1, "nc-empty"], [1, "nc-recipient", 3, "click"], [1, "nc-recipient-icon", "nc-rec-analista"], [1, "nc-recipient-info"], [1, "nc-recipient-name"], [1, "nc-check"], [1, "nc-recipient-icon", "nc-rec-merc"], [1, "nc-recipient-icon", "nc-rec-region"], [1, "nc-recipient-icon", "nc-rec-pdv"], ["rows", "5", "placeholder", "Escribe tu primer mensaje (opcional)...", 1, "nc-textarea", 3, "ngModelChange", "ngModel"], [1, "nc-btn", "nc-btn-secondary", 3, "click"], [1, "nc-btn", "nc-btn-primary", 3, "click", "disabled"], [1, "nc-btn", "nc-btn-success", 3, "click", "disabled"], ["diameter", "18"]], template: function NewChatDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "mat-icon");
        \u0275\u0275text(4, "chat_bubble");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(5, "div")(6, "h2", 3);
        \u0275\u0275text(7, "Nuevo Chat");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "p", 4);
        \u0275\u0275text(9);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "button", 5);
        \u0275\u0275listener("click", function NewChatDialogComponent_Template_button_click_10_listener() {
          return ctx.cancel();
        });
        \u0275\u0275elementStart(11, "mat-icon");
        \u0275\u0275text(12, "close");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(13, "div", 6);
        \u0275\u0275element(14, "span")(15, "span")(16, "span");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(17, "div", 7);
        \u0275\u0275template(18, NewChatDialogComponent_Conditional_18_Template, 4, 0, "div", 8)(19, NewChatDialogComponent_Conditional_19_Template, 3, 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "div", 9);
        \u0275\u0275template(21, NewChatDialogComponent_Conditional_21_Template, 4, 0, "button", 10);
        \u0275\u0275element(22, "span", 11);
        \u0275\u0275template(23, NewChatDialogComponent_Conditional_23_Template, 4, 1, "button", 12)(24, NewChatDialogComponent_Conditional_24_Template, 4, 2);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(9);
        \u0275\u0275textInterpolate2(" Paso ", ctx.step(), " de 3 \u2014 ", ctx.stepLabel(), " ");
        \u0275\u0275advance(5);
        \u0275\u0275classProp("active", ctx.step() >= 1);
        \u0275\u0275advance();
        \u0275\u0275classProp("active", ctx.step() >= 2);
        \u0275\u0275advance();
        \u0275\u0275classProp("active", ctx.step() >= 3);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(18, ctx.loading() ? 18 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(19, !ctx.loading() ? 19 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(21, ctx.step() > 1 ? 21 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(23, ctx.step() < 3 ? 23 : 24);
      }
    }, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, MatDialogModule, MatButtonModule, MatIconModule, MatIcon, MatProgressSpinnerModule, MatProgressSpinner], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.nc-dialog[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  min-width: 520px;\n  max-width: 600px;\n  max-height: 80vh;\n  background: #fff;\n}\n.nc-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 1rem 1.25rem;\n  border-bottom: 1px solid #e2e8f0;\n}\n.nc-header-icon[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #6366f1,\n      #8b5cf6);\n  color: #fff;\n  width: 40px;\n  height: 40px;\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.nc-title[_ngcontent-%COMP%] {\n  font-size: 1.05rem;\n  font-weight: 700;\n  color: #1e293b;\n  margin: 0;\n}\n.nc-subtitle[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: #64748b;\n  margin: 0;\n}\n.nc-close[_ngcontent-%COMP%] {\n  margin-left: auto;\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  color: #94a3b8;\n  width: 36px;\n  height: 36px;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.nc-close[_ngcontent-%COMP%]:hover {\n  background: #f1f5f9;\n  color: #475569;\n}\n.nc-stepper[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  justify-content: center;\n  padding: 0.5rem 0;\n  background: #f8fafc;\n}\n.nc-stepper[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 4px;\n  border-radius: 2px;\n  background: #e2e8f0;\n  transition: background 0.2s;\n}\n.nc-stepper[_ngcontent-%COMP%]   span.active[_ngcontent-%COMP%] {\n  background: #6366f1;\n}\n.nc-body[_ngcontent-%COMP%] {\n  flex: 1;\n  overflow-y: auto;\n  padding: 1.25rem 1.5rem;\n  min-height: 280px;\n}\n.nc-help[_ngcontent-%COMP%] {\n  color: #475569;\n  font-size: 0.85rem;\n  margin-bottom: 1rem;\n}\n.nc-type-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 0.75rem;\n}\n.nc-type-card[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.35rem;\n  padding: 1.25rem 0.75rem;\n  background: #fff;\n  border: 2px solid #e2e8f0;\n  border-radius: 12px;\n  cursor: pointer;\n  text-align: center;\n  transition: all 0.15s;\n}\n.nc-type-card[_ngcontent-%COMP%]:hover {\n  border-color: #a5b4fc;\n  transform: translateY(-2px);\n  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.1);\n}\n.nc-type-card.selected[_ngcontent-%COMP%] {\n  border-color: #6366f1;\n  background:\n    linear-gradient(\n      135deg,\n      #eef2ff,\n      #f5f3ff);\n}\n.nc-type-card[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 28px;\n  width: 28px;\n  height: 28px;\n  color: #6366f1;\n}\n.nc-type-name[_ngcontent-%COMP%] {\n  font-weight: 700;\n  color: #1e293b;\n  font-size: 0.92rem;\n}\n.nc-type-card[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #64748b;\n  font-size: 0.72rem;\n}\n.nc-search[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 0.5rem 0.85rem;\n  margin-bottom: 0.75rem;\n}\n.nc-search[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #64748b;\n}\n.nc-search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  flex: 1;\n  border: none;\n  outline: none;\n  background: transparent;\n  color: #1e293b;\n  font-size: 0.9rem;\n}\n.nc-section-label[_ngcontent-%COMP%] {\n  font-size: 0.72rem;\n  font-weight: 700;\n  color: #94a3b8;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  margin: 1rem 0 0.35rem;\n}\n.nc-recipient[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  width: 100%;\n  padding: 0.65rem 0.85rem;\n  background: #fff;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  margin-bottom: 0.35rem;\n  cursor: pointer;\n  text-align: left;\n  transition: all 0.15s;\n}\n.nc-recipient[_ngcontent-%COMP%]:hover {\n  border-color: #a5b4fc;\n  background: #f8fafc;\n}\n.nc-recipient.selected[_ngcontent-%COMP%] {\n  border-color: #6366f1;\n  background: #eef2ff;\n}\n.nc-recipient-icon[_ngcontent-%COMP%] {\n  padding: 0.35rem;\n  border-radius: 8px;\n  color: #fff;\n}\n.nc-rec-analista[_ngcontent-%COMP%] {\n  background: #3b82f6;\n}\n.nc-rec-merc[_ngcontent-%COMP%] {\n  background: #10b981;\n}\n.nc-rec-region[_ngcontent-%COMP%] {\n  background: #f59e0b;\n}\n.nc-rec-pdv[_ngcontent-%COMP%] {\n  background: #8b5cf6;\n}\n.nc-recipient-info[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n.nc-recipient-name[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #1e293b;\n  font-size: 0.88rem;\n}\n.nc-recipient-info[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #64748b;\n  font-size: 0.7rem;\n}\n.nc-check[_ngcontent-%COMP%] {\n  color: #cbd5e1;\n}\n.nc-recipient.selected[_ngcontent-%COMP%]   .nc-check[_ngcontent-%COMP%] {\n  color: #6366f1;\n}\n.nc-info-box[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.75rem;\n  padding: 1rem;\n  background: #eef2ff;\n  border-left: 4px solid #6366f1;\n  border-radius: 8px;\n  color: #312e81;\n}\n.nc-info-box[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #6366f1;\n}\n.nc-info-box[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  margin: 0.25rem 0 0 0;\n  padding-left: 1.25rem;\n  font-size: 0.85rem;\n}\n.nc-textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.85rem;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  resize: vertical;\n  font-family: inherit;\n  font-size: 0.9rem;\n  color: #1e293b;\n  outline: none;\n  min-height: 100px;\n}\n.nc-textarea[_ngcontent-%COMP%]:focus {\n  border-color: #6366f1;\n  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);\n}\n.nc-empty[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  text-align: center;\n  padding: 1.5rem;\n  font-style: italic;\n  font-size: 0.9rem;\n}\n.nc-loading[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 2rem;\n}\n.nc-loading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #64748b;\n  margin: 0;\n  font-size: 0.85rem;\n}\n.nc-footer[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.85rem 1.25rem;\n  border-top: 1px solid #e2e8f0;\n  background: #f8fafc;\n}\n.nc-btn[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n  padding: 0.55rem 1rem;\n  border-radius: 8px;\n  border: none;\n  cursor: pointer;\n  font-weight: 600;\n  font-size: 0.85rem;\n  transition: all 0.15s;\n}\n.nc-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.nc-btn-primary[_ngcontent-%COMP%] {\n  background: #6366f1;\n  color: #fff;\n}\n.nc-btn-primary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #4f46e5;\n}\n.nc-btn-success[_ngcontent-%COMP%] {\n  background: #16a34a;\n  color: #fff;\n}\n.nc-btn-success[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #15803d;\n}\n.nc-btn-secondary[_ngcontent-%COMP%] {\n  background: #fff;\n  color: #475569;\n  border: 1px solid #e2e8f0;\n}\n.nc-btn-secondary[_ngcontent-%COMP%]:hover {\n  background: #f1f5f9;\n}\n@media (max-width: 600px) {\n  .nc-dialog[_ngcontent-%COMP%] {\n    min-width: 90vw;\n  }\n  .nc-type-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=new-chat-dialog.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NewChatDialogComponent, { className: "NewChatDialogComponent", filePath: "src\\app\\features\\chat\\new-chat-dialog.component.ts", lineNumber: 309 });
})();

// node_modules/rxjs/dist/esm/internal/observable/dom/WebSocketSubject.js
var DEFAULT_WEBSOCKET_CONFIG = {
  url: "",
  deserializer: (e) => JSON.parse(e.data),
  serializer: (value) => JSON.stringify(value)
};
var WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT = "WebSocketSubject.error must be called with an object with an error code, and an optional reason: { code: number, reason: string }";
var WebSocketSubject = class _WebSocketSubject extends AnonymousSubject {
  constructor(urlConfigOrSource, destination) {
    super();
    this._socket = null;
    if (urlConfigOrSource instanceof Observable) {
      this.destination = destination;
      this.source = urlConfigOrSource;
    } else {
      const config = this._config = Object.assign({}, DEFAULT_WEBSOCKET_CONFIG);
      this._output = new Subject();
      if (typeof urlConfigOrSource === "string") {
        config.url = urlConfigOrSource;
      } else {
        for (const key in urlConfigOrSource) {
          if (urlConfigOrSource.hasOwnProperty(key)) {
            config[key] = urlConfigOrSource[key];
          }
        }
      }
      if (!config.WebSocketCtor && WebSocket) {
        config.WebSocketCtor = WebSocket;
      } else if (!config.WebSocketCtor) {
        throw new Error("no WebSocket constructor can be found");
      }
      this.destination = new ReplaySubject();
    }
  }
  lift(operator) {
    const sock = new _WebSocketSubject(this._config, this.destination);
    sock.operator = operator;
    sock.source = this;
    return sock;
  }
  _resetState() {
    this._socket = null;
    if (!this.source) {
      this.destination = new ReplaySubject();
    }
    this._output = new Subject();
  }
  multiplex(subMsg, unsubMsg, messageFilter) {
    const self = this;
    return new Observable((observer) => {
      try {
        self.next(subMsg());
      } catch (err) {
        observer.error(err);
      }
      const subscription = self.subscribe({
        next: (x) => {
          try {
            if (messageFilter(x)) {
              observer.next(x);
            }
          } catch (err) {
            observer.error(err);
          }
        },
        error: (err) => observer.error(err),
        complete: () => observer.complete()
      });
      return () => {
        try {
          self.next(unsubMsg());
        } catch (err) {
          observer.error(err);
        }
        subscription.unsubscribe();
      };
    });
  }
  _connectSocket() {
    const { WebSocketCtor, protocol, url, binaryType } = this._config;
    const observer = this._output;
    let socket = null;
    try {
      socket = protocol ? new WebSocketCtor(url, protocol) : new WebSocketCtor(url);
      this._socket = socket;
      if (binaryType) {
        this._socket.binaryType = binaryType;
      }
    } catch (e) {
      observer.error(e);
      return;
    }
    const subscription = new Subscription(() => {
      this._socket = null;
      if (socket && socket.readyState === 1) {
        socket.close();
      }
    });
    socket.onopen = (evt) => {
      const { _socket } = this;
      if (!_socket) {
        socket.close();
        this._resetState();
        return;
      }
      const { openObserver } = this._config;
      if (openObserver) {
        openObserver.next(evt);
      }
      const queue = this.destination;
      this.destination = Subscriber.create((x) => {
        if (socket.readyState === 1) {
          try {
            const { serializer } = this._config;
            socket.send(serializer(x));
          } catch (e) {
            this.destination.error(e);
          }
        }
      }, (err) => {
        const { closingObserver } = this._config;
        if (closingObserver) {
          closingObserver.next(void 0);
        }
        if (err && err.code) {
          socket.close(err.code, err.reason);
        } else {
          observer.error(new TypeError(WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT));
        }
        this._resetState();
      }, () => {
        const { closingObserver } = this._config;
        if (closingObserver) {
          closingObserver.next(void 0);
        }
        socket.close();
        this._resetState();
      });
      if (queue && queue instanceof ReplaySubject) {
        subscription.add(queue.subscribe(this.destination));
      }
    };
    socket.onerror = (e) => {
      this._resetState();
      observer.error(e);
    };
    socket.onclose = (e) => {
      if (socket === this._socket) {
        this._resetState();
      }
      const { closeObserver } = this._config;
      if (closeObserver) {
        closeObserver.next(e);
      }
      if (e.wasClean) {
        observer.complete();
      } else {
        observer.error(e);
      }
    };
    socket.onmessage = (e) => {
      try {
        const { deserializer } = this._config;
        observer.next(deserializer(e));
      } catch (err) {
        observer.error(err);
      }
    };
  }
  _subscribe(subscriber) {
    const { source } = this;
    if (source) {
      return source.subscribe(subscriber);
    }
    if (!this._socket) {
      this._connectSocket();
    }
    this._output.subscribe(subscriber);
    subscriber.add(() => {
      const { _socket } = this;
      if (this._output.observers.length === 0) {
        if (_socket && (_socket.readyState === 1 || _socket.readyState === 0)) {
          _socket.close();
        }
        this._resetState();
      }
    });
    return subscriber;
  }
  unsubscribe() {
    const { _socket } = this;
    if (_socket && (_socket.readyState === 1 || _socket.readyState === 0)) {
      _socket.close();
    }
    this._resetState();
    super.unsubscribe();
  }
};

// node_modules/rxjs/dist/esm/internal/observable/dom/webSocket.js
function webSocket(urlConfigOrSource) {
  return new WebSocketSubject(urlConfigOrSource);
}

// src/app/core/services/websocket.service.ts
var WebSocketService = class _WebSocketService {
  constructor() {
    this.sockets = /* @__PURE__ */ new Map();
  }
  connectToChat(room) {
    return this.getOrCreate(`${environment.wsUrl}/api/chat/ws/${room}`);
  }
  connectToNotifications(userId) {
    return this.getOrCreate(`${environment.wsUrl}/api/notifications/ws/${userId}`);
  }
  sendToChat(room, message) {
    const url = `${environment.wsUrl}/api/chat/ws/${room}`;
    this.sockets.get(url)?.next(message);
  }
  disconnect(url) {
    const socket = this.sockets.get(url);
    if (socket) {
      socket.complete();
      this.sockets.delete(url);
    }
  }
  disconnectAll() {
    this.sockets.forEach((s) => s.complete());
    this.sockets.clear();
  }
  getOrCreate(url) {
    if (!this.sockets.has(url)) {
      const socket = webSocket(url);
      this.sockets.set(url, socket);
    }
    return this.sockets.get(url).pipe(retryWhen((errors) => errors.pipe(delayWhen(() => timer(3e3)))));
  }
  static {
    this.\u0275fac = function WebSocketService_Factory(t) {
      return new (t || _WebSocketService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _WebSocketService, factory: _WebSocketService.\u0275fac, providedIn: "root" });
  }
};

// src/app/features/chat/chat.component.ts
var _c0 = ["scrollContainer"];
var _forTrack02 = ($index, $item) => $item.id_cliente;
var _forTrack12 = ($index, $item) => $item.visita_id;
var _forTrack22 = ($index, $item) => $item.kind + "-" + ($item.visita_id || $item.conversacion_id);
var _forTrack3 = ($index, $item) => $item.id;
var _c1 = (a0) => ({ "bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-900/30": a0 });
function ChatComponent_Conditional_0_For_12_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1, "Exclusivo");
    \u0275\u0275elementEnd();
  }
}
function ChatComponent_Conditional_0_For_12_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1, "Tradex");
    \u0275\u0275elementEnd();
  }
}
function ChatComponent_Conditional_0_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 9);
    \u0275\u0275listener("click", function ChatComponent_Conditional_0_For_12_Template_button_click_0_listener() {
      const c_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectExclusiveClient(c_r4));
    });
    \u0275\u0275elementStart(1, "mat-icon", 10);
    \u0275\u0275text(2, "business");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 11);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, ChatComponent_Conditional_0_For_12_Conditional_5_Template, 2, 0, "span", 12)(6, ChatComponent_Conditional_0_For_12_Conditional_6_Template, 2, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r4 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(c_r4.cliente);
    \u0275\u0275advance();
    \u0275\u0275conditional(5, c_r4.id_tipo_cliente === 3 ? 5 : c_r4.id_tipo_cliente === 1 ? 6 : -1);
  }
}
function ChatComponent_Conditional_0_ForEmpty_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 8);
    \u0275\u0275text(1, "No hay clientes disponibles.");
    \u0275\u0275elementEnd();
  }
}
function ChatComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 3)(2, "mat-icon");
    \u0275\u0275text(3, "business");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h2");
    \u0275\u0275text(5, "Selecciona un Cliente para ver sus Chats");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 4)(7, "mat-icon");
    \u0275\u0275text(8, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 5);
    \u0275\u0275listener("ngModelChange", function ChatComponent_Conditional_0_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.exclusiveClientSearch.set($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 6);
    \u0275\u0275repeaterCreate(11, ChatComponent_Conditional_0_For_12_Template, 7, 2, "button", 7, _forTrack02, false, ChatComponent_Conditional_0_ForEmpty_13_Template, 2, 0, "p", 8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275property("ngModel", ctx_r1.exclusiveClientSearch());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.filteredExclusiveClients());
  }
}
function ChatComponent_Conditional_1_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 21)(1, "div", 28)(2, "mat-icon");
    \u0275\u0275text(3, "business");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 29);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "button", 30);
    \u0275\u0275listener("click", function ChatComponent_Conditional_1_Conditional_12_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.changeExclusiveClient());
    });
    \u0275\u0275elementStart(7, "mat-icon");
    \u0275\u0275text(8, "swap_horiz");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.selectedExclusiveClient().cliente);
  }
}
function ChatComponent_Conditional_1_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 25);
  }
}
function ChatComponent_Conditional_1_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 31);
    \u0275\u0275listener("click", function ChatComponent_Conditional_1_Conditional_18_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.searchControl.setValue(""));
    });
    \u0275\u0275elementStart(1, "mat-icon", 32);
    \u0275\u0275text(2, "close");
    \u0275\u0275elementEnd()();
  }
}
function ChatComponent_Conditional_1_Conditional_20_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33)(1, "mat-icon", 35);
    \u0275\u0275text(2, "search_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 36);
    \u0275\u0275text(4, "No se encontraron visitas");
    \u0275\u0275elementEnd()();
  }
}
function ChatComponent_Conditional_1_Conditional_20_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 37);
    \u0275\u0275listener("click", function ChatComponent_Conditional_1_Conditional_20_For_2_Template_div_click_0_listener() {
      const chat_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.selectVisitFromSearch(chat_r9.visita_id, chat_r9.punto_nombre));
    });
    \u0275\u0275elementStart(1, "div", 38)(2, "span", 39);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 40);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 41)(8, "mat-icon", 42);
    \u0275\u0275text(9, "storefront");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 41)(12, "mat-icon", 42);
    \u0275\u0275text(13, "person");
    \u0275\u0275elementEnd();
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 43)(16, "span", 44)(17, "span", 45);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275text(19, " Toca para iniciar chat ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const chat_r9 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(chat_r9.punto_nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(6, 6, chat_r9.last_message_date, "dd/MM HH:mm"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2(" ", chat_r9.cadena, " \u2022 ", chat_r9.region, " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", chat_r9.mercaderista_nombre, " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("V-", chat_r9.visita_id, ":");
  }
}
function ChatComponent_Conditional_1_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ChatComponent_Conditional_1_Conditional_20_Conditional_0_Template, 5, 0, "div", 33);
    \u0275\u0275repeaterCreate(1, ChatComponent_Conditional_1_Conditional_20_For_2_Template, 20, 9, "div", 34, _forTrack12);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(0, ctx_r1.searchResults().length === 0 ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.searchResults());
  }
}
function ChatComponent_Conditional_1_Conditional_21_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33)(1, "mat-icon", 35);
    \u0275\u0275text(2, "speaker_notes_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 36);
    \u0275\u0275text(4, "No tienes conversaciones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 47);
    \u0275\u0275text(6, 'Crea una con el bot\xF3n "+ Nuevo"');
    \u0275\u0275elementEnd()();
  }
}
function ChatComponent_Conditional_1_Conditional_21_For_2_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r11.unread_count, " ");
  }
}
function ChatComponent_Conditional_1_Conditional_21_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275listener("click", function ChatComponent_Conditional_1_Conditional_21_For_2_Template_div_click_0_listener() {
      const item_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.selectInboxItem(item_r11));
    });
    \u0275\u0275elementStart(1, "div", 49)(2, "mat-icon", 50);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 51);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 40);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 43)(10, "span", 52)(11, "span", 53);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275template(14, ChatComponent_Conditional_1_Conditional_21_For_2_Conditional_14_Template, 2, 1, "span", 54);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r11 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(18, _c1, ctx_r1.isItemActive(item_r11)));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-primary-500", item_r11.kind === "visit")("text-emerald-500", item_r11.kind === "conversation");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.iconForItem(item_r11), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.labelForItem(item_r11), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(8, 15, item_r11.last_message_date, "dd/MM HH:mm"), " ");
    \u0275\u0275advance(4);
    \u0275\u0275classProp("text-primary-500", item_r11.kind === "visit")("text-emerald-500", item_r11.kind === "conversation");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.sublabelForItem(item_r11), ": ");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r11.last_message || "(Sin mensajes)", " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(14, item_r11.unread_count && item_r11.unread_count > 0 ? 14 : -1);
  }
}
function ChatComponent_Conditional_1_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ChatComponent_Conditional_1_Conditional_21_Conditional_0_Template, 7, 0, "div", 33);
    \u0275\u0275repeaterCreate(1, ChatComponent_Conditional_1_Conditional_21_For_2_Template, 15, 20, "div", 46, _forTrack22);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(0, ctx_r1.inbox().length === 0 ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.inbox());
  }
}
function ChatComponent_Conditional_1_Conditional_23_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 64)(1, "mat-icon", 70);
    \u0275\u0275text(2, "chat");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 71);
    \u0275\u0275text(4, "Env\xEDa un mensaje para iniciar la conversaci\xF3n.");
    \u0275\u0275elementEnd()();
  }
}
function ChatComponent_Conditional_1_Conditional_23_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 72)(1, "span", 73);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 74);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 75);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "date");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const msg_r13 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("items-end", msg_r13.sender_id === ctx_r1.currentUserId())("self-end", msg_r13.sender_id === ctx_r1.currentUserId());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", msg_r13.sender_id === ctx_r1.currentUserId() ? "T\xFA" : msg_r13.sender_nombre || "Soporte", " ");
    \u0275\u0275advance();
    \u0275\u0275classMap(msg_r13.sender_id === ctx_r1.currentUserId() ? "bg-primary-500 text-white rounded-l-2xl rounded-tr-2xl shadow-md shadow-primary-500/20" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-r-2xl rounded-tl-2xl shadow-sm border border-slate-100 dark:border-white/5");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", msg_r13.mensaje, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(7, 9, msg_r13.created_at, "HH:mm"), " ");
  }
}
function ChatComponent_Conditional_1_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 55)(1, "div", 56)(2, "mat-icon", 18);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "h2", 57);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 58);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 59)(10, "span", 60);
    \u0275\u0275element(11, "span", 61)(12, "span", 62);
    \u0275\u0275elementEnd();
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 63, 0);
    \u0275\u0275template(16, ChatComponent_Conditional_1_Conditional_23_Conditional_16_Template, 5, 0, "div", 64);
    \u0275\u0275repeaterCreate(17, ChatComponent_Conditional_1_Conditional_23_For_18_Template, 8, 12, "div", 65, _forTrack3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 66)(20, "div", 67)(21, "input", 68);
    \u0275\u0275listener("keyup.enter", function ChatComponent_Conditional_1_Conditional_23_Template_input_keyup_enter_21_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.sendMessage());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "button", 69);
    \u0275\u0275listener("click", function ChatComponent_Conditional_1_Conditional_23_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.sendMessage());
    });
    \u0275\u0275elementStart(23, "mat-icon");
    \u0275\u0275text(24, "send");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.activeKind() === "visit" ? "store" : "forum", " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.activeTitle());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.activeKind() === "visit" ? "Visita #" + ctx_r1.activeId() : "Chat #" + ctx_r1.activeId(), " ");
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.connected() ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30" : "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30");
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r1.connected() ? "bg-emerald-400" : "bg-rose-400");
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.connected() ? "bg-emerald-500" : "bg-rose-500");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.connected() ? "ONLINE" : "OFFLINE", " ");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(16, ctx_r1.messages().length === 0 ? 16 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.messages());
    \u0275\u0275advance(4);
    \u0275\u0275property("formControl", ctx_r1.messageControl);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !(ctx_r1.messageControl.value == null ? null : ctx_r1.messageControl.value.trim()));
  }
}
function ChatComponent_Conditional_1_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 76)(1, "div", 77)(2, "mat-icon", 78);
    \u0275\u0275text(3, "forum");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "h2", 79);
    \u0275\u0275text(5, "Centro de Mensajer\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 80);
    \u0275\u0275text(7, " Selecciona un chat de la lista o crea uno nuevo con el bot\xF3n ");
    \u0275\u0275elementStart(8, "strong");
    \u0275\u0275text(9, "+ Nuevo");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10, ". ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 81);
    \u0275\u0275listener("click", function ChatComponent_Conditional_1_Conditional_24_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openNewChatDialog());
    });
    \u0275\u0275elementStart(12, "mat-icon");
    \u0275\u0275text(13, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(14, " Crear chat nuevo ");
    \u0275\u0275elementEnd()();
  }
}
function ChatComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 14)(2, "div", 15)(3, "div", 16)(4, "h2", 17)(5, "mat-icon", 18);
    \u0275\u0275text(6, "forum");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, " Chats ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 19);
    \u0275\u0275listener("click", function ChatComponent_Conditional_1_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openNewChatDialog());
    });
    \u0275\u0275elementStart(9, "mat-icon", 20);
    \u0275\u0275text(10, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(11, " Nuevo ");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(12, ChatComponent_Conditional_1_Conditional_12_Template, 9, 1, "div", 21);
    \u0275\u0275elementStart(13, "div", 22)(14, "mat-icon", 23);
    \u0275\u0275text(15, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "input", 24);
    \u0275\u0275template(17, ChatComponent_Conditional_1_Conditional_17_Template, 1, 0, "mat-spinner", 25)(18, ChatComponent_Conditional_1_Conditional_18_Template, 3, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 26);
    \u0275\u0275template(20, ChatComponent_Conditional_1_Conditional_20_Template, 3, 1)(21, ChatComponent_Conditional_1_Conditional_21_Template, 3, 1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 27);
    \u0275\u0275template(23, ChatComponent_Conditional_1_Conditional_23_Template, 25, 13)(24, ChatComponent_Conditional_1_Conditional_24_Template, 15, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(12);
    \u0275\u0275conditional(12, ctx_r1.isCoordinadorExclusivo() && ctx_r1.selectedExclusiveClient() ? 12 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("formControl", ctx_r1.searchControl);
    \u0275\u0275advance();
    \u0275\u0275conditional(17, ctx_r1.isSearching() ? 17 : ctx_r1.searchControl.value ? 18 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(20, ctx_r1.searchControl.value ? 20 : 21);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(23, ctx_r1.activeId() ? 23 : 24);
  }
}
var ChatComponent = class _ChatComponent {
  constructor(api, ws, auth, route, dialog) {
    this.api = api;
    this.ws = ws;
    this.auth = auth;
    this.route = route;
    this.dialog = dialog;
    this.inbox = signal([]);
    this.searchResults = signal([]);
    this.messages = signal([]);
    this.connected = signal(false);
    this.isSearching = signal(false);
    this.messageControl = new FormControl("");
    this.searchControl = new FormControl("");
    this.currentUserId = signal(null);
    this.activeKind = signal(null);
    this.activeId = signal(null);
    this.activeTitle = signal("");
    this.isCoordinadorExclusivo = signal(false);
    this.exclusiveClients = signal([]);
    this.selectedExclusiveClient = signal(null);
    this.exclusiveClientSearch = signal("");
    this.filteredExclusiveClients = computed(() => {
      const term = this.exclusiveClientSearch().trim().toLowerCase();
      if (!term)
        return this.exclusiveClients();
      return this.exclusiveClients().filter((c) => (c.cliente || "").toLowerCase().includes(term));
    });
    this.currentUserId.set(this.auth.currentUser()?.id ?? null);
  }
  ngOnInit() {
    const u = this.auth.currentUser();
    if (u?.is_coordinador_exclusivo) {
      this.isCoordinadorExclusivo.set(true);
      this.loadExclusiveClients();
    } else {
      this.loadInbox();
    }
    this.route.queryParams.subscribe((params) => {
      const visitaId = params["visita"] ? parseInt(params["visita"], 10) : null;
      if (visitaId) {
        this.selectChat("visit", visitaId);
      }
    });
    this.searchSubscription = this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((query) => {
      if (query && query.trim().length >= 2) {
        this.isSearching.set(true);
        this.api.searchChatVisits(query.trim()).subscribe({
          next: (results) => {
            this.searchResults.set(results);
            this.isSearching.set(false);
          },
          error: () => this.isSearching.set(false)
        });
      } else {
        this.searchResults.set([]);
      }
    });
  }
  // ─── COORDINADOR EXCLUSIVO ───────────────────────────────────────
  loadExclusiveClients() {
    this.api.getExclusiveClients().subscribe({
      next: (data) => this.exclusiveClients.set(data)
    });
  }
  selectExclusiveClient(c) {
    this.selectedExclusiveClient.set(c);
    this.loadInbox();
  }
  changeExclusiveClient() {
    this.selectedExclusiveClient.set(null);
    this.inbox.set([]);
    this.activeKind.set(null);
    this.activeId.set(null);
    this.wsSubscription?.unsubscribe();
    this.ws.disconnectAll();
  }
  // ─── INBOX ────────────────────────────────────────────────────────
  loadInbox() {
    const clienteId = this.selectedExclusiveClient()?.id_cliente;
    this.api.getChatInbox(clienteId).subscribe({
      next: (data) => this.inbox.set(data)
    });
  }
  get activeList() {
    return this.searchControl.value ? this.searchResults() : this.inbox();
  }
  isItemActive(item) {
    if (item.kind === "visit")
      return this.activeKind() === "visit" && this.activeId() === item.visita_id;
    if (item.kind === "conversation")
      return this.activeKind() === "conversation" && this.activeId() === item.conversacion_id;
    return false;
  }
  selectInboxItem(item) {
    if (item.kind === "visit" && item.visita_id) {
      this.selectChat("visit", item.visita_id, item.punto_nombre);
    } else if (item.kind === "conversation" && item.conversacion_id) {
      this.selectChat("conversation", item.conversacion_id, item.titulo);
    }
  }
  // Visita seleccionada desde search results (mantenemos compat)
  selectVisitFromSearch(visitaId, puntoNombre) {
    this.selectChat("visit", visitaId, puntoNombre);
  }
  selectChat(kind, id, title) {
    if (this.activeKind() === kind && this.activeId() === id)
      return;
    this.activeKind.set(kind);
    this.activeId.set(id);
    this.activeTitle.set(title || (kind === "visit" ? `Visita #${id}` : `Chat #${id}`));
    if (this.searchControl.value) {
      this.searchControl.setValue("", { emitEvent: false });
      this.searchResults.set([]);
      this.loadInbox();
    }
    this.wsSubscription?.unsubscribe();
    this.ws.disconnectAll();
    this.messages.set([]);
    const history$ = kind === "visit" ? this.api.getMessagesByVisit(id) : this.api.getConversationMessages(id);
    history$.subscribe({
      next: (history) => {
        this.messages.set(history);
        setTimeout(() => this.scrollToBottom(), 50);
      }
    });
    const room = kind === "visit" ? id.toString() : `conv_${id}`;
    this.wsSubscription = this.ws.connectToChat(room).subscribe({
      next: (msg) => {
        this.messages.update((ms) => [...ms, msg]);
        this.connected.set(true);
        setTimeout(() => this.scrollToBottom(), 50);
        if (!this.searchControl.value)
          this.loadInbox();
      },
      error: () => this.connected.set(false)
    });
  }
  sendMessage() {
    const text = this.messageControl.value?.trim();
    if (!text || this.activeId() === null)
      return;
    const user = this.auth.currentUser();
    const kind = this.activeKind();
    const id = this.activeId();
    if (kind === "visit") {
      this.ws.sendToChat(id.toString(), {
        visita_id: id,
        mensaje: text,
        sender_type: user?.is_client ? "cliente" : "usuario",
        sender_id: user?.id,
        sender_nombre: user?.username
      });
    } else if (kind === "conversation") {
      this.ws.sendToChat(`conv_${id}`, {
        conversacion_id: id,
        mensaje: text,
        sender_type: user?.is_client ? "cliente" : "usuario",
        sender_id: user?.id,
        sender_nombre: user?.username
      });
    }
    this.messageControl.reset();
  }
  // ─── NUEVO CHAT ───────────────────────────────────────────────────
  openNewChatDialog() {
    const clienteId = this.selectedExclusiveClient()?.id_cliente;
    const ref = this.dialog.open(NewChatDialogComponent, {
      data: { clienteId },
      autoFocus: false,
      panelClass: "nc-dialog-panel"
    });
    ref.afterClosed().subscribe((conv) => {
      if (conv?.id) {
        this.loadInbox();
        this.selectChat("conversation", conv.id, conv.titulo);
      }
    });
  }
  ngOnDestroy() {
    this.wsSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.ws.disconnectAll();
  }
  scrollToBottom() {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch {
    }
  }
  // Helpers de UI
  iconForItem(item) {
    if (item.kind === "visit")
      return "store";
    switch (item.tipo) {
      case "direct":
        return "person";
      case "group_team":
        return "groups";
      case "group_region":
        return "map";
      case "group_pdv":
        return "storefront";
      default:
        return "forum";
    }
  }
  labelForItem(item) {
    if (item.kind === "visit")
      return item.punto_nombre || "Visita";
    return item.titulo || "(Sin t\xEDtulo)";
  }
  sublabelForItem(item) {
    if (item.kind === "visit")
      return `V-${item.visita_id}`;
    const map = {
      direct: "Directo",
      group_team: "Equipo",
      group_region: "Regi\xF3n",
      group_pdv: "PDV"
    };
    return map[item.tipo || ""] || "Chat";
  }
  static {
    this.\u0275fac = function ChatComponent_Factory(t) {
      return new (t || _ChatComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(WebSocketService), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(MatDialog));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChatComponent, selectors: [["app-chat"]], viewQuery: function ChatComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c0, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.scrollContainer = _t.first);
      }
    }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 2, vars: 2, consts: [["scrollContainer", ""], [1, "chat-client-selector"], [1, "h-[calc(100vh-160px)]", "flex", "flex-col", "md:flex-row", "gap-4", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "chat-client-selector-header"], [1, "chat-client-search"], ["type", "text", "placeholder", "Buscar cliente...", 3, "ngModelChange", "ngModel"], [1, "chat-client-grid"], [1, "chat-client-card"], [1, "chat-empty"], [1, "chat-client-card", 3, "click"], [1, "chat-client-icon"], [1, "chat-client-name"], [1, "chat-client-tag", "chat-tag-exclusivo"], [1, "chat-client-tag", "chat-tag-tradex"], [1, "w-full", "md:w-80", "flex-shrink-0", "bg-white", "dark:bg-slate-900", "rounded-[2rem]", "border", "border-slate-200", "dark:border-white/5", "shadow-xl", "shadow-slate-200/50", "dark:shadow-none", "flex", "flex-col", "overflow-hidden"], [1, "p-5", "border-b", "border-slate-100", "dark:border-white/5", "bg-slate-50/50", "dark:bg-slate-950/20"], [1, "flex", "items-center", "justify-between", "mb-3"], [1, "text-xl", "font-bold", "text-slate-800", "dark:text-white", "flex", "items-center", "gap-2"], [1, "text-primary-500"], [1, "inline-flex", "items-center", "gap-1", "px-3", "py-1.5", "bg-primary-500", "hover:bg-primary-600", "text-white", "text-xs", "font-bold", "rounded-xl", "shadow-md", "shadow-primary-500/20", "transition-all", "active:scale-95", 3, "click"], [1, "!text-[18px]", "!w-[18px]", "!h-[18px]"], [1, "chat-client-banner"], [1, "relative"], [1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-400"], ["placeholder", "Buscar visita por cadena, regi\xF3n...", 1, "w-full", "h-10", "pl-10", "pr-4", "bg-white", "dark:bg-slate-900", "rounded-xl", "border", "border-slate-200", "dark:border-white/10", "focus:border-primary-500", "focus:ring-2", "focus:ring-primary-500/20", "transition-all", "outline-none", "text-sm", "font-medium", "text-slate-700", "dark:text-slate-200", "placeholder:text-slate-400", 3, "formControl"], ["diameter", "16", 1, "absolute", "right-3", "top-1/2", "-translate-y-1/2"], [1, "flex-1", "overflow-y-auto", "custom-scrollbar", "p-2"], [1, "flex-1", "bg-white", "dark:bg-slate-900", "rounded-[2rem]", "border", "border-slate-200", "dark:border-white/5", "shadow-xl", "shadow-slate-200/50", "dark:shadow-none", "flex", "flex-col", "overflow-hidden", "relative"], [1, "chat-client-banner-info"], [1, "truncate"], ["matTooltip", "Cambiar cliente", 1, "chat-client-banner-change", 3, "click"], [1, "absolute", "right-3", "top-1/2", "-translate-y-1/2", "text-slate-400", "hover:text-slate-600", "dark:hover:text-slate-200", 3, "click"], [1, "text-[18px]", "w-[18px]", "h-[18px]"], [1, "h-full", "flex", "flex-col", "items-center", "justify-center", "text-center", "opacity-40", "p-4"], [1, "p-4", "mb-2", "rounded-2xl", "cursor-pointer", "transition-all", "hover:bg-slate-50", "dark:hover:bg-slate-800", "border", "border-transparent"], [1, "!text-4xl", "mb-2"], [1, "text-sm", "font-medium"], [1, "p-4", "mb-2", "rounded-2xl", "cursor-pointer", "transition-all", "hover:bg-slate-50", "dark:hover:bg-slate-800", "border", "border-transparent", 3, "click"], [1, "flex", "justify-between", "items-start", "mb-1"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "truncate", "pr-2", "text-sm"], [1, "text-[10px]", "text-slate-400", "whitespace-nowrap", "pt-1"], [1, "text-[10px]", "font-medium", "text-slate-400", "dark:text-slate-500", "mb-1", "flex", "items-center", "gap-1"], [1, "text-[12px]", "w-[12px]", "h-[12px]"], [1, "flex", "justify-between", "items-center"], [1, "text-xs", "text-primary-600", "font-medium", "truncate", "flex-1"], [1, "text-primary-500", "font-medium", "mr-1"], [1, "p-4", "mb-2", "rounded-2xl", "cursor-pointer", "transition-all", "hover:bg-slate-50", "dark:hover:bg-slate-800", "border", "border-transparent", 3, "ngClass"], [1, "text-xs", "mt-1"], [1, "p-4", "mb-2", "rounded-2xl", "cursor-pointer", "transition-all", "hover:bg-slate-50", "dark:hover:bg-slate-800", "border", "border-transparent", 3, "click", "ngClass"], [1, "flex", "items-start", "gap-2", "mb-1"], [1, "!text-[18px]", "!w-[18px]", "!h-[18px]", "mt-0.5"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "truncate", "flex-1", "text-sm"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "truncate", "flex-1"], [1, "text-xs", "font-bold", "mr-1"], [1, "bg-primary-500", "text-white", "text-[10px]", "font-bold", "px-2", "py-0.5", "rounded-full", "ml-2"], [1, "p-4", "border-b", "border-slate-100", "dark:border-white/5", "bg-slate-50/50", "dark:bg-slate-950/20", "flex", "justify-between", "items-center"], [1, "flex", "items-center", "gap-2"], [1, "text-lg", "font-bold", "text-slate-800", "dark:text-white"], [1, "text-xs", "text-slate-500", "dark:text-slate-400"], [1, "px-3", "py-1", "rounded-2xl", "border", "flex", "items-center", "gap-2", "font-bold", "text-[10px]", "shadow-sm"], [1, "relative", "flex", "h-2", "w-2"], [1, "animate-ping", "absolute", "inline-flex", "h-full", "w-full", "rounded-full", "opacity-75"], [1, "relative", "inline-flex", "rounded-full", "h-2", "w-2"], [1, "flex-1", "overflow-y-auto", "p-4", "md:p-6", "space-y-4", "custom-scrollbar", "bg-slate-50/30", "dark:bg-slate-950/20"], [1, "h-full", "flex", "flex-col", "items-center", "justify-center", "text-center", "opacity-30", "grayscale", "gap-4"], [1, "flex", "flex-col", "gap-1", "max-w-[85%]", "md:max-w-[75%]", 3, "items-end", "self-end"], [1, "p-4", "bg-white", "dark:bg-slate-900", "border-t", "border-slate-100", "dark:border-white/5"], [1, "relative", "flex", "items-center", "gap-3"], ["matInput", "", "placeholder", "Escribe tu mensaje...", 1, "flex-1", "h-12", "pl-4", "pr-4", "bg-slate-50", "dark:bg-slate-800", "rounded-2xl", "border", "border-slate-200", "dark:border-white/5", "focus:border-primary-500", "focus:ring-2", "focus:ring-primary-500/20", "transition-all", "outline-none", "font-medium", "text-slate-700", "dark:text-slate-200", "placeholder:text-slate-400", "dark:placeholder:text-slate-500", 3, "keyup.enter", "formControl"], [1, "w-12", "h-12", "bg-primary-500", "hover:bg-primary-600", "disabled:bg-slate-200", "dark:disabled:bg-slate-800", "disabled:text-slate-400", "text-white", "rounded-2xl", "flex", "items-center", "justify-center", "shadow-md", "shadow-primary-500/20", "transition-all", "active:scale-95", "shrink-0", 3, "click", "disabled"], [1, "!text-6xl", "dark:text-white"], [1, "font-medium", "dark:text-white"], [1, "flex", "flex-col", "gap-1", "max-w-[85%]", "md:max-w-[75%]"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "px-2"], [1, "p-3", "text-sm", "font-medium", "leading-relaxed"], [1, "text-[9px]", "text-slate-400", "dark:text-slate-500", "font-semibold", "px-2"], [1, "h-full", "flex", "flex-col", "items-center", "justify-center", "text-center", "p-8", "bg-slate-50/30", "dark:bg-slate-950/20"], [1, "w-24", "h-24", "bg-primary-50", "dark:bg-primary-900/20", "rounded-full", "flex", "items-center", "justify-center", "mb-6", "shadow-inner"], [1, "!text-5xl", "text-primary-500"], [1, "text-2xl", "font-bold", "text-slate-800", "dark:text-white", "mb-2"], [1, "text-slate-500", "dark:text-slate-400", "max-w-md", "mb-4"], [1, "inline-flex", "items-center", "gap-2", "px-5", "py-2.5", "bg-primary-500", "hover:bg-primary-600", "text-white", "font-bold", "rounded-xl", "shadow-lg", "shadow-primary-500/30", "transition-all", "active:scale-95", 3, "click"]], template: function ChatComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, ChatComponent_Conditional_0_Template, 14, 2, "div", 1)(1, ChatComponent_Conditional_1_Template, 25, 5, "div", 2);
      }
      if (rf & 2) {
        \u0275\u0275conditional(0, ctx.isCoordinadorExclusivo() && !ctx.selectedExclusiveClient() ? 0 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(1, !ctx.isCoordinadorExclusivo() || ctx.selectedExclusiveClient() ? 1 : -1);
      }
    }, dependencies: [CommonModule, NgClass, DatePipe, ReactiveFormsModule, DefaultValueAccessor, NgControlStatus, FormControlDirective, FormsModule, NgModel, MatCardModule, MatFormFieldModule, MatInputModule, MatInput, MatButtonModule, MatIconModule, MatIcon, MatListModule, MatProgressSpinnerModule, MatProgressSpinner, MatDialogModule], styles: ['@charset "UTF-8";\n\n\n\n.chat-client-selector[_ngcontent-%COMP%] {\n  background: var(--mat-app-background-color, #ffffff);\n  border-radius: 16px;\n  padding: 1.75rem;\n  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);\n  margin-bottom: 1rem;\n  max-width: 900px;\n}\n.dark[_nghost-%COMP%]   .chat-client-selector[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .chat-client-selector[_ngcontent-%COMP%] {\n  background: #0f172a;\n}\n.chat-client-selector-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.6rem;\n  margin-bottom: 1rem;\n}\n.chat-client-selector-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 700;\n  color: #1e293b;\n  margin: 0;\n}\n.chat-client-selector-header[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #16a34a;\n}\n.dark[_nghost-%COMP%]   .chat-client-selector-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .chat-client-selector-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: #f1f5f9;\n}\n.chat-client-search[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 0.5rem 0.85rem;\n  margin-bottom: 1rem;\n  max-width: 480px;\n}\n.chat-client-search[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #64748b;\n}\n.chat-client-search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  flex: 1;\n  border: none;\n  outline: none;\n  font-size: 0.95rem;\n  background: transparent;\n  color: #1e293b;\n}\n.dark[_nghost-%COMP%]   .chat-client-search[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .chat-client-search[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-color: #334155;\n}\n.dark[_nghost-%COMP%]   .chat-client-search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .chat-client-search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  color: #f1f5f9;\n}\n.chat-client-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));\n  gap: 0.75rem;\n}\n.chat-client-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 0.85rem;\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  cursor: pointer;\n  text-align: left;\n  transition:\n    transform 0.15s,\n    box-shadow 0.15s,\n    border-color 0.15s;\n  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);\n}\n.chat-client-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  border-color: #16a34a;\n  box-shadow: 0 4px 10px rgba(22, 163, 74, 0.15);\n}\n.dark[_nghost-%COMP%]   .chat-client-card[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .chat-client-card[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-color: #334155;\n}\n.chat-client-icon[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #dcfce7,\n      #bbf7d0);\n  color: #15803d;\n  padding: 0.4rem;\n  border-radius: 8px;\n  font-size: 1.3rem;\n  width: 1.3rem;\n  height: 1.3rem;\n}\n.chat-client-name[_ngcontent-%COMP%] {\n  flex: 1;\n  font-weight: 600;\n  font-size: 0.9rem;\n  color: #1e293b;\n}\n.dark[_nghost-%COMP%]   .chat-client-name[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .chat-client-name[_ngcontent-%COMP%] {\n  color: #f1f5f9;\n}\n.chat-client-tag[_ngcontent-%COMP%] {\n  font-size: 0.65rem;\n  padding: 0.18rem 0.5rem;\n  border-radius: 999px;\n  font-weight: 700;\n}\n.chat-tag-exclusivo[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #15803d;\n}\n.chat-tag-tradex[_ngcontent-%COMP%] {\n  background: #dbeafe;\n  color: #1d4ed8;\n}\n.chat-empty[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  text-align: center;\n  color: #64748b;\n  padding: 1.5rem;\n  margin: 0;\n  font-style: italic;\n}\n.chat-client-banner[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background:\n    linear-gradient(\n      135deg,\n      #dcfce7,\n      #bbf7d0);\n  border-left: 4px solid #16a34a;\n  padding: 0.5rem 0.75rem;\n  border-radius: 8px;\n  margin-bottom: 0.75rem;\n  font-size: 0.78rem;\n  color: #14532d;\n  gap: 0.5rem;\n}\n.chat-client-banner-info[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  min-width: 0;\n  flex: 1;\n}\n.chat-client-banner-info[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #15803d;\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.chat-client-banner-info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.chat-client-banner-change[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border: 1px solid #16a34a;\n  color: #15803d;\n  width: 32px;\n  height: 32px;\n  border-radius: 6px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: background-color 0.15s;\n  flex-shrink: 0;\n}\n.chat-client-banner-change[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n}\n.chat-client-banner-change[_ngcontent-%COMP%]:hover {\n  background: #f0fdf4;\n}\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n.custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 6px;\n}\n.custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: transparent;\n}\n.custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: rgba(148, 163, 184, 0.2);\n  border-radius: 10px;\n}\n.custom-scrollbar[_ngcontent-%COMP%]:hover::-webkit-scrollbar-thumb {\n  background: rgba(148, 163, 184, 0.4);\n}\n/*# sourceMappingURL=chat.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChatComponent, { className: "ChatComponent", filePath: "src\\app\\features\\chat\\chat.component.ts", lineNumber: 47 });
})();
export {
  ChatComponent
};
//# sourceMappingURL=chunk-CTVLY4Y3.js.map
