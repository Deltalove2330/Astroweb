import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  RequiredValidator,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-I7XEM5TB.js";
import {
  ApiService
} from "./chunk-G4LBJVY7.js";
import {
  Router,
  RouterLink,
  RouterModule
} from "./chunk-QGVFX6Y7.js";
import {
  environment
} from "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  CommonModule,
  HttpClient,
  NgForOf,
  NgIf,
  UpperCasePipe,
  __spreadValues,
  inject,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtextInterpolate4,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QB3BCYT5.js";

// src/app/features/encuestador/encuestador-dashboard.component.ts
function EncuestadorDashboardComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275text(1, "Cargando...");
    \u0275\u0275elementEnd();
  }
}
function EncuestadorDashboardComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "div", 7)(2, "div", 8)(3, "span", 9);
    \u0275\u0275text(4, "play_arrow");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(5, "h2", 10);
    \u0275\u0275text(6, "Inicia tu jornada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 11);
    \u0275\u0275text(8, "Activa para comenzar a visitar centros de salud y registrar m\xE9dicos.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 12);
    \u0275\u0275listener("click", function EncuestadorDashboardComponent_div_4_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.activarJornada());
    });
    \u0275\u0275elementStart(10, "span", 13);
    \u0275\u0275text(11, "rocket_launch");
    \u0275\u0275elementEnd();
    \u0275\u0275text(12, " Activar Jornada ");
    \u0275\u0275elementEnd()();
  }
}
function EncuestadorDashboardComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 15)(2, "h2", 16);
    \u0275\u0275text(3, "Jornada en Progreso");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 17);
    \u0275\u0275listener("click", function EncuestadorDashboardComponent_div_5_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.finalizarJornada());
    });
    \u0275\u0275text(5, " Finalizar Jornada ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 18)(7, "div", 19)(8, "div", 20);
    \u0275\u0275text(9, "Centros Visitados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 21);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 19)(13, "div", 20);
    \u0275\u0275text(14, "M\xE9dicos Registrados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 21);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "button", 22);
    \u0275\u0275text(18, " Gestionar Centro de Salud ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate(ctx_r1.stats.centros_visitados);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.stats.medicos_registrados);
  }
}
var EncuestadorDashboardComponent = class _EncuestadorDashboardComponent {
  constructor() {
    this.http = inject(HttpClient);
    this.router = inject(Router);
    this.loading = true;
    this.jornadaActiva = false;
    this.stats = { centros_visitados: 0, medicos_registrados: 0 };
  }
  ngOnInit() {
    this.checkJornada();
  }
  checkJornada() {
    this.http.get(`${environment.apiUrl}/api/encuestador/jornada-activa`).subscribe({
      next: (res) => {
        this.jornadaActiva = res.activa;
        if (res.activa) {
          this.stats = {
            centros_visitados: res.centros_visitados,
            medicos_registrados: res.medicos_registrados
          };
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
  activarJornada() {
    this.loading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => this.doActivar(pos.coords.latitude, pos.coords.longitude), () => this.doActivar(null, null), { timeout: 5e3 });
    } else {
      this.doActivar(null, null);
    }
  }
  doActivar(lat, lng) {
    this.http.post(`${environment.apiUrl}/api/encuestador/activar-jornada`, {
      latitud: lat,
      longitud: lng,
      ciudad: "",
      estado_geo: ""
    }).subscribe({
      next: () => {
        this.router.navigate(["/encuestador/centro"]);
      },
      error: () => this.loading = false
    });
  }
  finalizarJornada() {
    if (confirm("\xBFEst\xE1s seguro de finalizar la jornada actual?")) {
      this.loading = true;
      this.http.post(`${environment.apiUrl}/api/encuestador/finalizar-jornada`, {}).subscribe({
        next: () => this.checkJornada(),
        error: () => this.loading = false
      });
    }
  }
  static {
    this.\u0275fac = function EncuestadorDashboardComponent_Factory(t) {
      return new (t || _EncuestadorDashboardComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EncuestadorDashboardComponent, selectors: [["app-encuestador-dashboard"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 6, vars: 3, consts: [[1, "p-6", "max-w-4xl", "mx-auto"], [1, "text-3xl", "font-bold", "text-white", "mb-6"], ["class", "text-white", 4, "ngIf"], ["class", "bg-slate-900 rounded-xl p-8 border border-white/10 shadow-lg text-center max-w-2xl mx-auto mt-10", 4, "ngIf"], ["class", "bg-slate-900 rounded-xl p-6 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]", 4, "ngIf"], [1, "text-white"], [1, "bg-slate-900", "rounded-xl", "p-8", "border", "border-white/10", "shadow-lg", "text-center", "max-w-2xl", "mx-auto", "mt-10"], [1, "mb-4", "flex", "justify-center"], [1, "w-16", "h-16", "rounded-full", "border-2", "border-indigo-500", "flex", "items-center", "justify-center", "text-indigo-500"], [1, "material-icons", "text-4xl", "ml-1"], [1, "text-2xl", "font-semibold", "text-white", "mb-2"], [1, "text-slate-400", "mb-8"], [1, "w-full", "bg-emerald-500", "hover:bg-emerald-600", "text-white", "font-bold", "py-4", "rounded-lg", "transition-colors", "flex", "items-center", "justify-center", "gap-2", "text-lg", 3, "click"], [1, "material-icons"], [1, "bg-slate-900", "rounded-xl", "p-6", "border", "border-emerald-500/30", "shadow-[0_0_15px_rgba(16,185,129,0.2)]"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-emerald-400"], [1, "bg-red-600", "hover:bg-red-700", "text-white", "px-4", "py-2", "rounded-lg", "transition-colors", "text-sm", "font-semibold", 3, "click"], [1, "grid", "grid-cols-2", "gap-4", "mb-6"], [1, "bg-slate-800", "p-4", "rounded-lg", "border", "border-slate-700"], [1, "text-slate-400", "text-sm"], [1, "text-3xl", "font-bold", "text-white"], ["routerLink", "/encuestador/centro", 1, "w-full", "bg-emerald-600", "hover:bg-emerald-700", "text-white", "font-bold", "py-4", "rounded-lg", "transition-colors", "text-lg", "shadow-lg"]], template: function EncuestadorDashboardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
        \u0275\u0275text(2, "Dashboard Encuestador");
        \u0275\u0275elementEnd();
        \u0275\u0275template(3, EncuestadorDashboardComponent_div_3_Template, 2, 0, "div", 2)(4, EncuestadorDashboardComponent_div_4_Template, 13, 0, "div", 3)(5, EncuestadorDashboardComponent_div_5_Template, 19, 2, "div", 4);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("ngIf", ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading && !ctx.jornadaActiva);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading && ctx.jornadaActiva);
      }
    }, dependencies: [CommonModule, NgIf, RouterModule, RouterLink, FormsModule], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EncuestadorDashboardComponent, { className: "EncuestadorDashboardComponent", filePath: "src\\app\\features\\encuestador\\encuestador-dashboard.component.ts", lineNumber: 57 });
})();

// src/app/features/encuestador/centro-form.component.ts
function CentroFormComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "div", 9);
    \u0275\u0275text(2, " Cargando... ");
    \u0275\u0275elementEnd();
  }
}
function CentroFormComponent_div_7_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "div")(2, "div", 22);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 23);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 24)(7, "span", 25);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const m_r3 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate4("", m_r3.apellido1, " ", m_r3.apellido2, ", ", m_r3.nombre1, " ", m_r3.nombre2, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r3.especialidad);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(m_r3.valor_consulta_rango);
  }
}
function CentroFormComponent_div_7_div_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275text(1, "No hay m\xE9dicos registrados en este centro a\xFAn.");
    \u0275\u0275elementEnd();
  }
}
function CentroFormComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 11)(2, "div")(3, "h2", 12);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 13);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 14);
    \u0275\u0275listener("click", function CentroFormComponent_div_7_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cerrarEncuesta());
    });
    \u0275\u0275text(8, " Cerrar Centro ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 15)(10, "h3", 16);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "button", 17);
    \u0275\u0275text(13, " + Agregar M\xE9dico ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 18);
    \u0275\u0275template(15, CentroFormComponent_div_7_div_15_Template, 9, 6, "div", 19)(16, CentroFormComponent_div_7_div_16_Template, 2, 0, "div", 20);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.encuestaActiva.nombre_centro);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r1.encuestaActiva.ciudad, ", ", ctx_r1.encuestaActiva.estado, "");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("M\xE9dicos Registrados (", (ctx_r1.encuestaActiva.medicos == null ? null : ctx_r1.encuestaActiva.medicos.length) || 0, ")");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngForOf", ctx_r1.encuestaActiva.medicos);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !(ctx_r1.encuestaActiva.medicos == null ? null : ctx_r1.encuestaActiva.medicos.length));
  }
}
function CentroFormComponent_div_8_div_10_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 39);
    \u0275\u0275listener("click", function CentroFormComponent_div_8_div_10_div_1_Template_div_click_0_listener() {
      const c_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.confirmarApertura(c_r6));
    });
    \u0275\u0275elementStart(1, "div", 40);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "uppercase");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 41);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r6 = ctx.$implicit;
    const last_r7 = ctx.last;
    \u0275\u0275classProp("border-b", !last_r7)("border-slate-700", !last_r7);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 6, c_r6.nombre_centro));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r6.direccion_completa);
  }
}
function CentroFormComponent_div_8_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 37);
    \u0275\u0275template(1, CentroFormComponent_div_8_div_10_div_1_Template, 6, 8, "div", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.centrosResult);
  }
}
function CentroFormComponent_div_8_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 42)(1, "button", 43);
    \u0275\u0275listener("click", function CentroFormComponent_div_8_div_11_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.mostrandoCrearCentro = true);
    });
    \u0275\u0275elementStart(2, "span", 44);
    \u0275\u0275text(3, "add_business");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Crear nuevo centro de salud ");
    \u0275\u0275elementEnd()();
  }
}
function CentroFormComponent_div_8_div_12_option_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 62);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const est_r10 = ctx.$implicit;
    \u0275\u0275property("value", est_r10.nombre);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(est_r10.nombre);
  }
}
function CentroFormComponent_div_8_div_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 45)(1, "div", 1)(2, "h3", 46)(3, "span", 47);
    \u0275\u0275text(4, "add_location_alt");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " Solicitud de Nuevo Centro");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 48);
    \u0275\u0275listener("click", function CentroFormComponent_div_8_div_12_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.mostrandoCrearCentro = false);
    });
    \u0275\u0275elementStart(7, "span", 49);
    \u0275\u0275text(8, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 50)(10, "div", 51)(11, "div", 52)(12, "label", 53);
    \u0275\u0275text(13, "Nombre del Centro *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "input", 54);
    \u0275\u0275twoWayListener("ngModelChange", function CentroFormComponent_div_8_div_12_Template_input_ngModelChange_14_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.nuevoCentro.nombre_centro, $event) || (ctx_r1.nuevoCentro.nombre_centro = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 52)(16, "label", 53);
    \u0275\u0275text(17, "Direcci\xF3n Completa *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "input", 54);
    \u0275\u0275twoWayListener("ngModelChange", function CentroFormComponent_div_8_div_12_Template_input_ngModelChange_18_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.nuevoCentro.direccion_completa, $event) || (ctx_r1.nuevoCentro.direccion_completa = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div")(20, "label", 53);
    \u0275\u0275text(21, "Ciudad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "input", 54);
    \u0275\u0275twoWayListener("ngModelChange", function CentroFormComponent_div_8_div_12_Template_input_ngModelChange_22_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.nuevoCentro.ciudad, $event) || (ctx_r1.nuevoCentro.ciudad = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div")(24, "label", 53);
    \u0275\u0275text(25, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "select", 55);
    \u0275\u0275twoWayListener("ngModelChange", function CentroFormComponent_div_8_div_12_Template_select_ngModelChange_26_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.nuevoCentro.estado, $event) || (ctx_r1.nuevoCentro.estado = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(27, "option", 56);
    \u0275\u0275text(28, "Seleccione un estado");
    \u0275\u0275elementEnd();
    \u0275\u0275template(29, CentroFormComponent_div_8_div_12_option_29_Template, 2, 2, "option", 57);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "div", 58)(31, "span", 59);
    \u0275\u0275text(32, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "p", 60);
    \u0275\u0275text(34, "Al enviar este formulario, se crear\xE1 una solicitud que deber\xE1 ser aprobada por el equipo de ATC antes de que el centro aparezca en la lista.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(35, "button", 61);
    \u0275\u0275listener("click", function CentroFormComponent_div_8_div_12_Template_button_click_35_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.crearCentro());
    });
    \u0275\u0275elementStart(36, "span", 47);
    \u0275\u0275text(37, "send");
    \u0275\u0275elementEnd();
    \u0275\u0275text(38, " Enviar Solicitud a ATC ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(14);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.nuevoCentro.nombre_centro);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.nuevoCentro.direccion_completa);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.nuevoCentro.ciudad);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.nuevoCentro.estado);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r1.estados);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", !ctx_r1.nuevoCentro.nombre_centro || !ctx_r1.nuevoCentro.direccion_completa);
  }
}
function CentroFormComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27)(1, "div", 28)(2, "span", 29);
    \u0275\u0275text(3, "domain");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h2", 30);
    \u0275\u0275text(5, "Selecciona un centro");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 31)(7, "span", 32);
    \u0275\u0275text(8, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 33);
    \u0275\u0275twoWayListener("ngModelChange", function CentroFormComponent_div_8_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.searchQuery, $event) || (ctx_r1.searchQuery = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function CentroFormComponent_div_8_Template_input_input_9_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.buscarCentros());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(10, CentroFormComponent_div_8_div_10_Template, 2, 1, "div", 34)(11, CentroFormComponent_div_8_div_11_Template, 5, 0, "div", 35)(12, CentroFormComponent_div_8_div_12_Template, 39, 6, "div", 36);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.searchQuery);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.centrosResult.length);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.mostrandoCrearCentro);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.mostrandoCrearCentro);
  }
}
function CentroFormComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 63)(1, "div", 64);
    \u0275\u0275element(2, "div", 65);
    \u0275\u0275elementStart(3, "div", 66)(4, "span", 67);
    \u0275\u0275text(5, "add_task");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "h3", 68);
    \u0275\u0275text(7, "\xBFIniciar encuesta?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 69);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 70)(11, "button", 71);
    \u0275\u0275listener("click", function CentroFormComponent_div_9_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.abrirEncuesta(ctx_r1.centroAConfirmar.id_centro));
    });
    \u0275\u0275text(12, " S\xED, iniciar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "button", 72);
    \u0275\u0275listener("click", function CentroFormComponent_div_9_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.centroAConfirmar = null);
    });
    \u0275\u0275text(14, " Cancelar ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r1.centroAConfirmar.nombre_centro);
  }
}
var CentroFormComponent = class _CentroFormComponent {
  constructor() {
    this.http = inject(HttpClient);
    this.router = inject(Router);
    this.apiService = inject(ApiService);
    this.loading = true;
    this.encuestaActiva = null;
    this.searchQuery = "";
    this.centrosResult = [];
    this.centroAConfirmar = null;
    this.mostrandoCrearCentro = false;
    this.estados = [];
    this.nuevoCentro = { nombre_centro: "", direccion_completa: "", ciudad: "", estado: "" };
  }
  ngOnInit() {
    this.checkEncuesta();
    this.buscarCentros();
    this.apiService.getEstados().subscribe((res) => {
      this.estados = res || [];
    });
  }
  checkEncuesta() {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/api/encuestador/encuesta-abierta`).subscribe({
      next: (res) => {
        if (!res.jornada_activa) {
          this.router.navigate(["/encuestador/dashboard"]);
          return;
        }
        if (res.tiene_encuesta) {
          this.encuestaActiva = res;
        } else {
          this.encuestaActiva = null;
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
  buscarCentros() {
    this.http.get(`${environment.apiUrl}/api/encuestador/centros?q=${this.searchQuery}`).subscribe((res) => {
      this.centrosResult = res.centros || [];
    });
  }
  crearCentro() {
    this.loading = true;
    this.http.post(`${environment.apiUrl}/api/encuestador/centros`, this.nuevoCentro).subscribe({
      next: (res) => {
        this.loading = false;
        this.mostrandoCrearCentro = false;
        alert(res.message || "Solicitud enviada exitosamente.");
        this.nuevoCentro = { nombre_centro: "", direccion_completa: "", ciudad: "", estado: "" };
      },
      error: () => {
        this.loading = false;
        alert("Hubo un error al enviar la solicitud.");
      }
    });
  }
  confirmarApertura(centro) {
    this.centroAConfirmar = centro;
  }
  abrirEncuesta(id_centro) {
    this.centroAConfirmar = null;
    this.loading = true;
    this.http.post(`${environment.apiUrl}/api/encuestador/encuestas`, { id_centro }).subscribe({
      next: () => this.checkEncuesta(),
      error: () => this.loading = false
    });
  }
  cerrarEncuesta() {
    if (confirm("\xBFEst\xE1s seguro de cerrar este centro?")) {
      this.loading = true;
      this.http.post(`${environment.apiUrl}/api/encuestador/encuestas/${this.encuestaActiva.id_encuesta}/cerrar`, {}).subscribe({
        next: () => this.checkEncuesta(),
        error: () => this.loading = false
      });
    }
  }
  static {
    this.\u0275fac = function CentroFormComponent_Factory(t) {
      return new (t || _CentroFormComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CentroFormComponent, selectors: [["app-centro-form"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 10, vars: 4, consts: [[1, "p-6", "max-w-7xl", "mx-auto", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-3xl", "font-bold", "text-white"], ["routerLink", "/encuestador/dashboard", 1, "text-slate-400", "hover:text-white", "transition-colors"], ["class", "text-white flex items-center gap-3", 4, "ngIf"], ["class", "bg-slate-900 rounded-xl p-6 border border-emerald-500/30 shadow-lg mb-6", 4, "ngIf"], ["class", "bg-slate-900 rounded-xl p-8 border border-white/10 shadow-xl max-w-4xl mx-auto", 4, "ngIf"], ["class", "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in", 4, "ngIf"], [1, "text-white", "flex", "items-center", "gap-3"], [1, "animate-spin", "rounded-full", "h-5", "w-5", "border-b-2", "border-indigo-500"], [1, "bg-slate-900", "rounded-xl", "p-6", "border", "border-emerald-500/30", "shadow-lg", "mb-6"], [1, "flex", "justify-between", "items-start", "mb-4"], [1, "text-2xl", "font-bold", "text-emerald-400"], [1, "text-slate-400"], [1, "bg-red-600", "hover:bg-red-700", "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-semibold", "transition-colors", "shadow-lg", 3, "click"], [1, "mt-6", "flex", "justify-between", "items-center"], [1, "text-lg", "font-semibold", "text-white"], ["routerLink", "/encuestador/medico", 1, "bg-indigo-600", "hover:bg-indigo-700", "text-white", "px-4", "py-2", "rounded-lg", "font-semibold", "transition-colors", "shadow-lg", "shadow-indigo-500/20"], [1, "mt-4", "space-y-2"], ["class", "bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-between items-center", 4, "ngFor", "ngForOf"], ["class", "text-slate-500 italic py-4", 4, "ngIf"], [1, "bg-slate-800", "p-4", "rounded-lg", "border", "border-slate-700", "flex", "justify-between", "items-center"], [1, "font-bold", "text-white"], [1, "text-sm", "text-slate-400"], [1, "text-right"], [1, "inline-block", "px-2", "py-1", "bg-slate-700", "text-xs", "rounded", "text-slate-300"], [1, "text-slate-500", "italic", "py-4"], [1, "bg-slate-900", "rounded-xl", "p-8", "border", "border-white/10", "shadow-xl", "max-w-4xl", "mx-auto"], [1, "flex", "items-center", "gap-2", "mb-6"], [1, "material-icons", "text-indigo-400", "!text-3xl"], [1, "text-2xl", "font-bold", "text-white"], [1, "mb-4", "relative"], [1, "material-icons", "absolute", "left-4", "top-1/2", "-translate-y-1/2", "text-slate-500"], ["type", "text", "placeholder", "Buscar por nombre, ciudad o estado...", 1, "w-full", "bg-slate-800/80", "border", "border-slate-700", "rounded-xl", "py-4", "pl-12", "pr-4", "text-white", "focus:border-indigo-500", "focus:ring-1", "focus:ring-indigo-500", "transition-colors", "shadow-inner", 3, "ngModelChange", "input", "ngModel"], ["class", "max-h-96 overflow-y-auto mb-6 rounded-xl border border-slate-700 bg-slate-800/30 custom-scrollbar", 4, "ngIf"], ["class", "mt-6 pt-6 border-t border-slate-800", 4, "ngIf"], ["class", "mt-6 pt-6 border-t border-slate-800 animate-in slide-in-from-top-4 duration-300", 4, "ngIf"], [1, "max-h-96", "overflow-y-auto", "mb-6", "rounded-xl", "border", "border-slate-700", "bg-slate-800/30", "custom-scrollbar"], ["class", "p-5 hover:bg-slate-700/80 cursor-pointer transition-colors group", 3, "border-b", "border-slate-700", "click", 4, "ngFor", "ngForOf"], [1, "p-5", "hover:bg-slate-700/80", "cursor-pointer", "transition-colors", "group", 3, "click"], [1, "font-bold", "text-white", "group-hover:text-indigo-300", "transition-colors"], [1, "text-sm", "text-slate-400", "mt-1"], [1, "mt-6", "pt-6", "border-t", "border-slate-800"], [1, "w-full", "border-2", "border-dashed", "border-indigo-500/50", "text-indigo-400", "hover:bg-indigo-500/10", "hover:border-indigo-400", "font-bold", "py-4", "rounded-xl", "transition-colors", "flex", "items-center", "justify-center", "gap-2", 3, "click"], [1, "material-icons", "text-xl"], [1, "mt-6", "pt-6", "border-t", "border-slate-800", "animate-in", "slide-in-from-top-4", "duration-300"], [1, "text-xl", "font-bold", "text-indigo-300", "flex", "items-center", "gap-2"], [1, "material-icons"], [1, "text-slate-400", "hover:text-white", "transition-colors", "bg-slate-800", "w-8", "h-8", "rounded-full", "flex", "items-center", "justify-center", 3, "click"], [1, "material-icons", "!text-lg"], [1, "bg-slate-800/50", "p-6", "rounded-xl", "border", "border-slate-700", "mb-6"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-5"], [1, "md:col-span-2"], [1, "block", "text-xs", "font-bold", "text-slate-400", "mb-1", "uppercase", "tracking-wider"], ["type", "text", 1, "w-full", "bg-slate-900", "border", "border-slate-700", "rounded-lg", "p-3", "text-white", "focus:border-indigo-500", "outline-none", "transition-colors", 3, "ngModelChange", "ngModel"], [1, "w-full", "bg-slate-900", "border", "border-slate-700", "rounded-lg", "p-3", "text-white", "focus:border-indigo-500", "outline-none", "transition-colors", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], [1, "mt-6", "p-4", "bg-indigo-500/10", "border", "border-indigo-500/20", "rounded-lg", "flex", "gap-3", "text-indigo-300"], [1, "material-icons", "mt-0.5"], [1, "text-sm"], [1, "bg-indigo-600", "hover:bg-indigo-700", "text-white", "font-bold", "px-6", "py-3.5", "rounded-xl", "transition-colors", "w-full", "flex", "items-center", "justify-center", "gap-2", "shadow-lg", "disabled:opacity-50", "disabled:grayscale", 3, "click", "disabled"], [3, "value"], [1, "fixed", "inset-0", "bg-black/60", "backdrop-blur-sm", "z-50", "flex", "items-center", "justify-center", "p-4", "animate-in", "fade-in"], [1, "bg-slate-900", "rounded-3xl", "p-8", "max-w-md", "w-full", "border", "border-slate-700", "shadow-2xl", "text-center", "relative", "overflow-hidden"], [1, "absolute", "top-0", "left-0", "w-full", "h-2", "bg-gradient-to-r", "from-indigo-500", "to-purple-500"], [1, "w-20", "h-20", "bg-indigo-500/20", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-6", "border-4", "border-indigo-500/30"], [1, "material-icons", "text-4xl", "text-indigo-400"], [1, "text-2xl", "font-black", "text-white", "mb-2"], [1, "text-slate-300", "font-medium", "mb-8"], [1, "flex", "gap-4", "justify-center"], [1, "flex-1", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "font-bold", "py-3", "px-6", "rounded-xl", "transition-colors", "shadow-lg", "shadow-indigo-500/20", 3, "click"], [1, "flex-1", "bg-slate-800", "hover:bg-slate-700", "text-white", "font-bold", "py-3", "px-6", "rounded-xl", "transition-colors", "border", "border-slate-700", 3, "click"]], template: function CentroFormComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
        \u0275\u0275text(3, "Gesti\xF3n de Centro");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "button", 3);
        \u0275\u0275text(5, "Volver al Dashboard");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(6, CentroFormComponent_div_6_Template, 3, 0, "div", 4)(7, CentroFormComponent_div_7_Template, 17, 6, "div", 5)(8, CentroFormComponent_div_8_Template, 13, 4, "div", 6);
        \u0275\u0275elementEnd();
        \u0275\u0275template(9, CentroFormComponent_div_9_Template, 15, 1, "div", 7);
      }
      if (rf & 2) {
        \u0275\u0275advance(6);
        \u0275\u0275property("ngIf", ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading && ctx.encuestaActiva);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading && !ctx.encuestaActiva);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.centroAConfirmar);
      }
    }, dependencies: [CommonModule, NgForOf, NgIf, UpperCasePipe, RouterModule, RouterLink, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CentroFormComponent, { className: "CentroFormComponent", filePath: "src\\app\\features\\encuestador\\centro-form.component.ts", lineNumber: 147 });
})();

// src/app/features/encuestador/medico-form.component.ts
function MedicoFormComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275element(1, "div", 10);
    \u0275\u0275text(2, " Cargando datos... ");
    \u0275\u0275elementEnd();
  }
}
function MedicoFormComponent_div_10_div_8_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 64);
    \u0275\u0275listener("click", function MedicoFormComponent_div_10_div_8_div_1_Template_div_click_0_listener() {
      const m_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.seleccionarMedico(m_r4));
    });
    \u0275\u0275elementStart(1, "div", 65);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 66);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const m_r4 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate4("", m_r4.apellido1, " ", m_r4.apellido2, ", ", m_r4.nombre1, " ", m_r4.nombre2, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("ID: ", m_r4.id_medico_externo, " | ", m_r4.especialidad, " | ", m_r4.ciudad, "");
  }
}
function MedicoFormComponent_div_10_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 62);
    \u0275\u0275template(1, MedicoFormComponent_div_10_div_8_div_1_Template, 5, 7, "div", 63);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.medicosResult);
  }
}
function MedicoFormComponent_div_10_label_111_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 67)(1, "input", 68);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_label_111_Template_input_ngModelChange_1_listener($event) {
      const dia_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.selectedDias[dia_r6], $event) || (ctx_r1.selectedDias[dia_r6] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const dia_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.selectedDias[dia_r6]);
    \u0275\u0275property("name", "dia_" + dia_r6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", dia_r6, " ");
  }
}
function MedicoFormComponent_div_10_label_136_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 67)(1, "input", 68);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_label_136_Template_input_ngModelChange_1_listener($event) {
      const dia_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.selectedDias2[dia_r8], $event) || (ctx_r1.selectedDias2[dia_r8] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const dia_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.selectedDias2[dia_r8]);
    \u0275\u0275property("name", "dia2_" + dia_r8);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", dia_r8, " ");
  }
}
function MedicoFormComponent_div_10_option_153_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 69);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r9 = ctx.$implicit;
    \u0275\u0275property("value", r_r9);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r9);
  }
}
function MedicoFormComponent_div_10_option_162_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 69);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r10 = ctx.$implicit;
    \u0275\u0275property("value", r_r10);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r10);
  }
}
function MedicoFormComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 12)(2, "label", 13);
    \u0275\u0275text(3, "\xBFYa existe el m\xE9dico? B\xFAscalo por ID o apellido:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 14)(5, "span", 15);
    \u0275\u0275text(6, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 16);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.searchQuery, $event) || (ctx_r1.searchQuery = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function MedicoFormComponent_div_10_Template_input_input_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.buscarMedicos());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(8, MedicoFormComponent_div_10_div_8_Template, 2, 1, "div", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "form", 18, 0);
    \u0275\u0275listener("ngSubmit", function MedicoFormComponent_div_10_Template_form_ngSubmit_9_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.guardarMedicoCentro());
    });
    \u0275\u0275elementStart(11, "div", 19)(12, "h3", 20);
    \u0275\u0275text(13, "1. Datos del m\xE9dico");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 21)(15, "div", 22)(16, "label", 23);
    \u0275\u0275text(17, "ID M\xE9dico (c\xE9dula/ext.) ");
    \u0275\u0275elementStart(18, "span", 24);
    \u0275\u0275text(19, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "input", 25);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.id_medico_externo, $event) || (ctx_r1.medicoData.id_medico_externo = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 22)(22, "label", 23);
    \u0275\u0275text(23, "Apellido 1 ");
    \u0275\u0275elementStart(24, "span", 24);
    \u0275\u0275text(25, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "input", 26);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_26_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.apellido1, $event) || (ctx_r1.medicoData.apellido1 = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 27)(28, "label", 23);
    \u0275\u0275text(29, "Apellido 2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "input", 28);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_30_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.apellido2, $event) || (ctx_r1.medicoData.apellido2 = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div", 22)(32, "label", 23);
    \u0275\u0275text(33, "Nombre 1 ");
    \u0275\u0275elementStart(34, "span", 24);
    \u0275\u0275text(35, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "input", 29);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_36_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.nombre1, $event) || (ctx_r1.medicoData.nombre1 = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "div", 22)(38, "label", 23);
    \u0275\u0275text(39, "Nombre 2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "input", 30);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_40_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.nombre2, $event) || (ctx_r1.medicoData.nombre2 = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "div", 27)(42, "label", 23);
    \u0275\u0275text(43, "Especialidad ");
    \u0275\u0275elementStart(44, "span", 24);
    \u0275\u0275text(45, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "input", 31);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_46_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.especialidad, $event) || (ctx_r1.medicoData.especialidad = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "div", 27)(48, "label", 23);
    \u0275\u0275text(49, "Sub-especialidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "input", 32);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_50_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.sub_especialidad, $event) || (ctx_r1.medicoData.sub_especialidad = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(51, "div", 27)(52, "label", 23);
    \u0275\u0275text(53, "Universidad de graduaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "input", 33);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_54_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.universidad_graduacion, $event) || (ctx_r1.medicoData.universidad_graduacion = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(55, "div", 22)(56, "label", 23);
    \u0275\u0275text(57, "N\xBA MPPS");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "input", 34);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_58_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.nro_MPPS, $event) || (ctx_r1.medicoData.nro_MPPS = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(59, "div", 22)(60, "label", 23);
    \u0275\u0275text(61, "N\xBA Colegiado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "input", 35);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_62_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.nro_colegiado, $event) || (ctx_r1.medicoData.nro_colegiado = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(63, "div", 22)(64, "label", 23);
    \u0275\u0275text(65, "Ciudad ");
    \u0275\u0275elementStart(66, "span", 24);
    \u0275\u0275text(67, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(68, "input", 36);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_68_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.ciudad, $event) || (ctx_r1.medicoData.ciudad = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(69, "div", 22)(70, "label", 23);
    \u0275\u0275text(71, "Estado ");
    \u0275\u0275elementStart(72, "span", 24);
    \u0275\u0275text(73, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(74, "input", 37);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_74_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.estado, $event) || (ctx_r1.medicoData.estado = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(75, "div", 22)(76, "label", 23);
    \u0275\u0275text(77, "Tel\xE9fono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(78, "input", 38);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_78_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.telefono, $event) || (ctx_r1.medicoData.telefono = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(79, "div", 22)(80, "label", 23);
    \u0275\u0275text(81, "WhatsApp");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(82, "input", 39);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_82_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.whatsapp, $event) || (ctx_r1.medicoData.whatsapp = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(83, "div", 22)(84, "label", 23);
    \u0275\u0275text(85, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "input", 40);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_86_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.email, $event) || (ctx_r1.medicoData.email = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(87, "div", 22)(88, "label", 23);
    \u0275\u0275text(89, "Instagram");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(90, "input", 41);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_90_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.instagram, $event) || (ctx_r1.medicoData.instagram = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(91, "div", 42)(92, "label", 23);
    \u0275\u0275text(93, "LinkedIn");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(94, "input", 43);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_94_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.linkedin, $event) || (ctx_r1.medicoData.linkedin = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(95, "div", 19)(96, "h3", 20);
    \u0275\u0275text(97, "2. Datos del consultorio 1 (en este centro)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(98, "div", 21)(99, "div", 22)(100, "label", 23);
    \u0275\u0275text(101, "# Piso / Consultorio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(102, "input", 44);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_102_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.piso_consultorio, $event) || (ctx_r1.medicoData.piso_consultorio = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(103, "div", 22)(104, "label", 23);
    \u0275\u0275text(105, "Horarios de consulta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(106, "input", 45);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_106_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.horarios_consulta, $event) || (ctx_r1.medicoData.horarios_consulta = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(107, "div", 27)(108, "label", 46);
    \u0275\u0275text(109, "D\xEDas de consulta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(110, "div", 47);
    \u0275\u0275template(111, MedicoFormComponent_div_10_label_111_Template, 3, 3, "label", 48);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(112, "div", 42)(113, "label", 23);
    \u0275\u0275text(114, "Direcci\xF3n espec\xEDfica");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(115, "textarea", 49);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_textarea_ngModelChange_115_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.direccion_especifica, $event) || (ctx_r1.medicoData.direccion_especifica = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(116, "div", 19)(117, "h3", 20);
    \u0275\u0275text(118, "3. Consultorio 2 (opcional)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(119, "div", 21)(120, "div", 22)(121, "label", 23);
    \u0275\u0275text(122, "Cl\xEDnica 2 (nombre)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(123, "input", 50);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_123_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.clinica2_nombre, $event) || (ctx_r1.medicoData.clinica2_nombre = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(124, "div", 22)(125, "label", 23);
    \u0275\u0275text(126, "# Piso");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(127, "input", 51);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_127_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.piso_consultorio2, $event) || (ctx_r1.medicoData.piso_consultorio2 = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(128, "div", 22)(129, "label", 23);
    \u0275\u0275text(130, "Horarios");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(131, "input", 52);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_input_ngModelChange_131_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.horarios_consulta2, $event) || (ctx_r1.medicoData.horarios_consulta2 = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(132, "div", 22)(133, "label", 46);
    \u0275\u0275text(134, "D\xEDas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(135, "div", 47);
    \u0275\u0275template(136, MedicoFormComponent_div_10_label_136_Template, 3, 3, "label", 48);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(137, "div", 42)(138, "label", 23);
    \u0275\u0275text(139, "Direcci\xF3n 2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(140, "textarea", 53);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_textarea_ngModelChange_140_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.direccion_especifica2, $event) || (ctx_r1.medicoData.direccion_especifica2 = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(141, "div", 19)(142, "h3", 20);
    \u0275\u0275text(143, "4. Datos econ\xF3micos");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(144, "div", 54)(145, "div")(146, "label", 23);
    \u0275\u0275text(147, "Valor de la consulta ");
    \u0275\u0275elementStart(148, "span", 24);
    \u0275\u0275text(149, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(150, "select", 55);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_select_ngModelChange_150_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.valor_consulta_rango, $event) || (ctx_r1.medicoData.valor_consulta_rango = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(151, "option", 56);
    \u0275\u0275text(152, "Seleccione...");
    \u0275\u0275elementEnd();
    \u0275\u0275template(153, MedicoFormComponent_div_10_option_153_Template, 2, 2, "option", 57);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(154, "div")(155, "label", 23);
    \u0275\u0275text(156, "Promedio de pacientes / semana ");
    \u0275\u0275elementStart(157, "span", 24);
    \u0275\u0275text(158, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(159, "select", 58);
    \u0275\u0275twoWayListener("ngModelChange", function MedicoFormComponent_div_10_Template_select_ngModelChange_159_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.medicoData.promedio_pacientes_semanal_rango, $event) || (ctx_r1.medicoData.promedio_pacientes_semanal_rango = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(160, "option", 56);
    \u0275\u0275text(161, "Seleccione...");
    \u0275\u0275elementEnd();
    \u0275\u0275template(162, MedicoFormComponent_div_10_option_162_Template, 2, 2, "option", 57);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(163, "div", 59)(164, "button", 60);
    \u0275\u0275text(165, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(166, "button", 61)(167, "span", 6);
    \u0275\u0275text(168, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275text(169, " Guardar m\xE9dico ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const f_r11 = \u0275\u0275reference(10);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.searchQuery);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.medicosResult.length > 0);
    \u0275\u0275advance(12);
    \u0275\u0275classProp("bg-gray-100", ctx_r1.medicoExistente && !ctx_r1.isDark())("opacity-60", ctx_r1.medicoExistente);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.id_medico_externo);
    \u0275\u0275property("readonly", ctx_r1.medicoExistente);
    \u0275\u0275advance(6);
    \u0275\u0275classProp("bg-gray-100", ctx_r1.medicoExistente && !ctx_r1.isDark())("opacity-60", ctx_r1.medicoExistente);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.apellido1);
    \u0275\u0275property("readonly", ctx_r1.medicoExistente);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("bg-gray-100", ctx_r1.medicoExistente && !ctx_r1.isDark())("opacity-60", ctx_r1.medicoExistente);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.apellido2);
    \u0275\u0275property("readonly", ctx_r1.medicoExistente);
    \u0275\u0275advance(6);
    \u0275\u0275classProp("bg-gray-100", ctx_r1.medicoExistente && !ctx_r1.isDark())("opacity-60", ctx_r1.medicoExistente);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.nombre1);
    \u0275\u0275property("readonly", ctx_r1.medicoExistente);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("bg-gray-100", ctx_r1.medicoExistente && !ctx_r1.isDark())("opacity-60", ctx_r1.medicoExistente);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.nombre2);
    \u0275\u0275property("readonly", ctx_r1.medicoExistente);
    \u0275\u0275advance(6);
    \u0275\u0275classProp("bg-gray-100", ctx_r1.medicoExistente && !ctx_r1.isDark())("opacity-60", ctx_r1.medicoExistente);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.especialidad);
    \u0275\u0275property("readonly", ctx_r1.medicoExistente);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("bg-gray-100", ctx_r1.medicoExistente && !ctx_r1.isDark())("opacity-60", ctx_r1.medicoExistente);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.sub_especialidad);
    \u0275\u0275property("readonly", ctx_r1.medicoExistente);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("bg-gray-100", ctx_r1.medicoExistente && !ctx_r1.isDark())("opacity-60", ctx_r1.medicoExistente);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.universidad_graduacion);
    \u0275\u0275property("readonly", ctx_r1.medicoExistente);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("bg-gray-100", ctx_r1.medicoExistente && !ctx_r1.isDark())("opacity-60", ctx_r1.medicoExistente);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.nro_MPPS);
    \u0275\u0275property("readonly", ctx_r1.medicoExistente);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("bg-gray-100", ctx_r1.medicoExistente && !ctx_r1.isDark())("opacity-60", ctx_r1.medicoExistente);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.nro_colegiado);
    \u0275\u0275property("readonly", ctx_r1.medicoExistente);
    \u0275\u0275advance(6);
    \u0275\u0275classProp("bg-gray-100", ctx_r1.medicoExistente && !ctx_r1.isDark())("opacity-60", ctx_r1.medicoExistente);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.ciudad);
    \u0275\u0275property("readonly", ctx_r1.medicoExistente);
    \u0275\u0275advance(6);
    \u0275\u0275classProp("bg-gray-100", ctx_r1.medicoExistente && !ctx_r1.isDark())("opacity-60", ctx_r1.medicoExistente);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.estado);
    \u0275\u0275property("readonly", ctx_r1.medicoExistente);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("bg-gray-100", ctx_r1.medicoExistente && !ctx_r1.isDark())("opacity-60", ctx_r1.medicoExistente);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.telefono);
    \u0275\u0275property("readonly", ctx_r1.medicoExistente);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("bg-gray-100", ctx_r1.medicoExistente && !ctx_r1.isDark())("opacity-60", ctx_r1.medicoExistente);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.whatsapp);
    \u0275\u0275property("readonly", ctx_r1.medicoExistente);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("bg-gray-100", ctx_r1.medicoExistente && !ctx_r1.isDark())("opacity-60", ctx_r1.medicoExistente);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.email);
    \u0275\u0275property("readonly", ctx_r1.medicoExistente);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("bg-gray-100", ctx_r1.medicoExistente && !ctx_r1.isDark())("opacity-60", ctx_r1.medicoExistente);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.instagram);
    \u0275\u0275property("readonly", ctx_r1.medicoExistente);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("bg-gray-100", ctx_r1.medicoExistente && !ctx_r1.isDark())("opacity-60", ctx_r1.medicoExistente);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.linkedin);
    \u0275\u0275property("readonly", ctx_r1.medicoExistente);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.piso_consultorio);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.horarios_consulta);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngForOf", ctx_r1.diasList);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.direccion_especifica);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.clinica2_nombre);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.piso_consultorio2);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.horarios_consulta2);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngForOf", ctx_r1.diasList);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.direccion_especifica2);
    \u0275\u0275advance(10);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.valor_consulta_rango);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r1.catalogos.valor_consulta_rangos);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.medicoData.promedio_pacientes_semanal_rango);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r1.catalogos.promedio_pacientes_rangos);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !f_r11.valid);
  }
}
var MedicoFormComponent = class _MedicoFormComponent {
  constructor() {
    this.http = inject(HttpClient);
    this.router = inject(Router);
    this.loading = true;
    this.searchQuery = "";
    this.medicosResult = [];
    this.catalogos = { valor_consulta_rangos: [], promedio_pacientes_rangos: [] };
    this.medicoExistente = false;
    this.medicoData = this.getEmptyMedico();
    this.diasList = ["Lun", "Mar", "Mi\xE9", "Jue", "Vie", "S\xE1b", "Dom"];
    this.selectedDias = {};
    this.selectedDias2 = {};
  }
  ngOnInit() {
    this.http.get(`${environment.apiUrl}/api/encuestador/catalogos`).subscribe((res) => {
      this.catalogos = res;
      this.loading = false;
    });
  }
  isDark() {
    return document.documentElement.classList.contains("dark");
  }
  getEmptyMedico() {
    this.selectedDias = {};
    this.selectedDias2 = {};
    return {
      id_medico: null,
      id_medico_externo: "",
      apellido1: "",
      apellido2: "",
      nombre1: "",
      nombre2: "",
      especialidad: "",
      sub_especialidad: "",
      universidad_graduacion: "",
      nro_MPPS: "",
      nro_colegiado: "",
      ciudad: "",
      estado: "",
      telefono: "",
      whatsapp: "",
      email: "",
      linkedin: "",
      instagram: "",
      piso_consultorio: "",
      horarios_consulta: "",
      dias_consulta: "",
      direccion_especifica: "",
      clinica2_nombre: "",
      piso_consultorio2: "",
      horarios_consulta2: "",
      dias_consulta2: "",
      direccion_especifica2: "",
      valor_consulta_rango: "",
      promedio_pacientes_semanal_rango: ""
    };
  }
  buscarMedicos() {
    if (this.searchQuery.length < 3) {
      this.medicosResult = [];
      return;
    }
    this.http.get(`${environment.apiUrl}/api/encuestador/medicos?q=${this.searchQuery}`).subscribe((res) => {
      this.medicosResult = res.medicos || [];
    });
  }
  seleccionarMedico(m) {
    this.medicoExistente = true;
    this.medicoData = __spreadValues(__spreadValues({}, this.getEmptyMedico()), m);
    this.medicosResult = [];
    this.searchQuery = m.id_medico_externo;
  }
  guardarMedicoCentro() {
    this.medicoData.dias_consulta = this.diasList.filter((d) => this.selectedDias[d]).join(", ");
    this.medicoData.dias_consulta2 = this.diasList.filter((d) => this.selectedDias2[d]).join(", ");
    const url = `${environment.apiUrl}/api/encuestador/medico-centro`;
    this.http.post(url, this.medicoData).subscribe({
      next: () => {
        alert("M\xE9dico guardado correctamente en el centro.");
        this.router.navigate(["/encuestador/centro"]);
      },
      error: (err) => {
        console.error(err);
        alert("Error al guardar: " + (err.error?.detail || err.message));
      }
    });
  }
  static {
    this.\u0275fac = function MedicoFormComponent_Factory(t) {
      return new (t || _MedicoFormComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MedicoFormComponent, selectors: [["app-medico-form"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 11, vars: 2, consts: [["f", "ngForm"], [1, "p-6", "max-w-5xl", "mx-auto", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-3xl", "font-bold", "text-slate-800", "dark:text-white", "flex", "items-center", "gap-2"], [1, "material-icons", "text-indigo-600", "dark:text-indigo-400"], ["routerLink", "/encuestador/centro", 1, "text-slate-500", "hover:text-slate-800", "dark:text-slate-400", "dark:hover:text-white", "transition-colors"], [1, "material-icons"], ["class", "text-slate-800 dark:text-white flex items-center gap-3", 4, "ngIf"], ["class", "bg-white dark:bg-slate-900 rounded-xl p-8 border border-gray-200 dark:border-white/10 shadow-xl relative", 4, "ngIf"], [1, "text-slate-800", "dark:text-white", "flex", "items-center", "gap-3"], [1, "animate-spin", "rounded-full", "h-5", "w-5", "border-b-2", "border-indigo-600", "dark:border-indigo-500"], [1, "bg-white", "dark:bg-slate-900", "rounded-xl", "p-8", "border", "border-gray-200", "dark:border-white/10", "shadow-xl", "relative"], [1, "mb-10", "bg-indigo-50", "dark:bg-slate-800/50", "p-6", "rounded-xl", "border", "border-indigo-100", "dark:border-slate-700", "relative"], [1, "block", "text-sm", "font-semibold", "text-indigo-800", "dark:text-indigo-300", "mb-2"], [1, "relative"], [1, "material-icons", "absolute", "left-4", "top-1/2", "-translate-y-1/2", "text-slate-400", "dark:text-slate-500"], ["type", "text", "placeholder", "Ej: V-12345678 o P\xE9rez", 1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "py-3", "pl-12", "pr-4", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "focus:ring-1", "focus:ring-indigo-500", "transition-colors", "shadow-sm", "dark:shadow-inner", 3, "ngModelChange", "input", "ngModel"], ["class", "absolute z-10 w-full left-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-2xl max-h-60 overflow-y-auto custom-scrollbar", 4, "ngIf"], [3, "ngSubmit"], [1, "flex", "items-center", "gap-2", "mb-6", "border-l-4", "border-indigo-600", "dark:border-indigo-500", "pl-3"], [1, "text-xl", "font-bold", "text-indigo-700", "dark:text-indigo-400"], [1, "grid", "grid-cols-1", "md:grid-cols-4", "gap-x-5", "gap-y-5", "mb-10"], [1, "md:col-span-1"], [1, "block", "text-xs", "font-semibold", "text-slate-600", "dark:text-slate-400", "mb-1"], [1, "text-red-500", "dark:text-red-400"], ["type", "text", "name", "id_externo", "required", "", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel", "readonly"], ["type", "text", "name", "apellido1", "required", "", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel", "readonly"], [1, "md:col-span-2"], ["type", "text", "name", "apellido2", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel", "readonly"], ["type", "text", "name", "nombre1", "required", "", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel", "readonly"], ["type", "text", "name", "nombre2", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel", "readonly"], ["type", "text", "name", "especialidad", "required", "", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel", "readonly"], ["type", "text", "name", "sub_especialidad", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel", "readonly"], ["type", "text", "name", "universidad_graduacion", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel", "readonly"], ["type", "text", "name", "mpps", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel", "readonly"], ["type", "text", "name", "colegiado", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel", "readonly"], ["type", "text", "name", "ciudad", "required", "", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel", "readonly"], ["type", "text", "name", "estado", "required", "", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel", "readonly"], ["type", "text", "name", "telefono", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel", "readonly"], ["type", "text", "name", "whatsapp", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel", "readonly"], ["type", "email", "name", "email", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel", "readonly"], ["type", "text", "name", "instagram", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel", "readonly"], [1, "md:col-span-4"], ["type", "text", "name", "linkedin", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel", "readonly"], ["type", "text", "name", "piso_consultorio", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "horarios_consulta", "placeholder", "Ej: 8:00 - 12:00", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel"], [1, "block", "text-xs", "font-semibold", "text-slate-600", "dark:text-slate-400", "mb-2"], [1, "flex", "flex-wrap", "gap-3", "mt-1"], ["class", "flex items-center gap-1.5 cursor-pointer text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors", 4, "ngFor", "ngForOf"], ["name", "direccion_especifica", "rows", "2", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", "resize-y", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "clinica2_nombre", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "piso_consultorio2", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "horarios_consulta2", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel"], ["name", "direccion_especifica2", "rows", "2", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", "resize-y", 3, "ngModelChange", "ngModel"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-x-5", "gap-y-5", "mb-8"], ["name", "valor", "required", "", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel"], ["value", "", "disabled", "", "selected", ""], [3, "value", 4, "ngFor", "ngForOf"], ["name", "pacientes", "required", "", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-gray-300", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-slate-800", "dark:text-white", "focus:border-indigo-500", "transition-colors", "outline-none", 3, "ngModelChange", "ngModel"], [1, "flex", "justify-end", "gap-4", "border-t", "border-gray-200", "dark:border-slate-800", "pt-6", "mt-4"], ["type", "button", "routerLink", "/encuestador/centro", 1, "bg-gray-100", "hover:bg-gray-200", "text-slate-700", "dark:bg-slate-700", "dark:hover:bg-slate-600", "dark:text-white", "font-semibold", "py-3", "px-8", "rounded-lg", "transition-colors", "shadow-sm", "dark:shadow-lg"], ["type", "submit", 1, "bg-indigo-600", "hover:bg-indigo-700", "dark:hover:bg-indigo-500", "text-white", "font-bold", "py-3", "px-8", "rounded-lg", "transition-colors", "disabled:opacity-50", "flex", "items-center", "gap-2", "shadow-lg", "shadow-indigo-600/30", "dark:shadow-indigo-500/25", 3, "disabled"], [1, "absolute", "z-10", "w-full", "left-0", "mt-1", "bg-white", "dark:bg-slate-800", "border", "border-gray-200", "dark:border-slate-600", "rounded-lg", "shadow-2xl", "max-h-60", "overflow-y-auto", "custom-scrollbar"], ["class", "p-4 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer border-b border-gray-100 dark:border-slate-700 last:border-0 transition-colors", 3, "click", 4, "ngFor", "ngForOf"], [1, "p-4", "hover:bg-gray-50", "dark:hover:bg-slate-700", "cursor-pointer", "border-b", "border-gray-100", "dark:border-slate-700", "last:border-0", "transition-colors", 3, "click"], [1, "font-bold", "text-slate-800", "dark:text-white"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "flex", "items-center", "gap-1.5", "cursor-pointer", "text-sm", "text-slate-700", "dark:text-slate-300", "hover:text-indigo-600", "dark:hover:text-indigo-300", "transition-colors"], ["type", "checkbox", 1, "rounded", "border-gray-300", "dark:border-slate-600", "bg-white", "dark:bg-slate-800", "text-indigo-600", "dark:text-indigo-500", "focus:ring-indigo-500", 3, "ngModelChange", "ngModel", "name"], [3, "value"]], template: function MedicoFormComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "h1", 3)(3, "span", 4);
        \u0275\u0275text(4, "badge");
        \u0275\u0275elementEnd();
        \u0275\u0275text(5, " Agregar m\xE9dico al centro ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "button", 5)(7, "span", 6);
        \u0275\u0275text(8, "close");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(9, MedicoFormComponent_div_9_Template, 3, 0, "div", 7)(10, MedicoFormComponent_div_10_Template, 170, 118, "div", 8);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(9);
        \u0275\u0275property("ngIf", ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading);
      }
    }, dependencies: [CommonModule, NgForOf, NgIf, RouterModule, RouterLink, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MedicoFormComponent, { className: "MedicoFormComponent", filePath: "src\\app\\features\\encuestador\\medico-form.component.ts", lineNumber: 231 });
})();

// src/app/features/encuestador/encuestador.routes.ts
var ENCUESTADOR_ROUTES = [
  { path: "dashboard", component: EncuestadorDashboardComponent },
  { path: "centro", component: CentroFormComponent },
  { path: "medico", component: MedicoFormComponent },
  { path: "", redirectTo: "dashboard", pathMatch: "full" }
];
export {
  ENCUESTADOR_ROUTES
};
//# sourceMappingURL=chunk-HKQJIGJD.js.map
