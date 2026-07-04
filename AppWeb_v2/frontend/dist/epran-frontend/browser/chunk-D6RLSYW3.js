import {
  AuthService
} from "./chunk-FAJEMXMR.js";
import {
  MatCardModule
} from "./chunk-HA7AXTKJ.js";
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
import {
  RouterLink
} from "./chunk-QGVFX6Y7.js";
import "./chunk-NRWDSKQC.js";
import {
  DomSanitizer
} from "./chunk-XGS5Y2XL.js";
import {
  CommonModule,
  catchError,
  computed,
  forkJoin,
  of,
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-QB3BCYT5.js";

// src/app/features/dashboard/dashboard.component.ts
function DashboardComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4)(1, "button", 10);
    \u0275\u0275listener("click", function DashboardComponent_Conditional_7_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.activeView.set("summary"));
    });
    \u0275\u0275elementStart(2, "mat-icon", 11);
    \u0275\u0275text(3, "analytics");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Resumen ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 10);
    \u0275\u0275listener("click", function DashboardComponent_Conditional_7_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.activeView.set("powerbi"));
    });
    \u0275\u0275elementStart(6, "mat-icon", 11);
    \u0275\u0275text(7, "insert_chart");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8, " Power BI ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classProp("bg-white", ctx_r1.activeView() === "summary")("dark:bg-slate-700", ctx_r1.activeView() === "summary")("shadow-md", ctx_r1.activeView() === "summary")("text-indigo-600", ctx_r1.activeView() === "summary")("text-slate-500", ctx_r1.activeView() !== "summary");
    \u0275\u0275advance(4);
    \u0275\u0275classProp("bg-white", ctx_r1.activeView() === "powerbi")("dark:bg-slate-700", ctx_r1.activeView() === "powerbi")("shadow-md", ctx_r1.activeView() === "powerbi")("text-indigo-600", ctx_r1.activeView() === "powerbi")("text-slate-500", ctx_r1.activeView() !== "powerbi");
  }
}
function DashboardComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "mat-spinner", 12);
    \u0275\u0275elementStart(2, "p", 13);
    \u0275\u0275text(3, "Cargando datos del sistema...");
    \u0275\u0275elementEnd()();
  }
}
function DashboardComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 14);
    \u0275\u0275element(2, "div", 15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("innerHTML", ctx_r1.clientDashboardUrl(), \u0275\u0275sanitizeHtml);
  }
}
function DashboardComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "div", 17)(2, "div", 18)(3, "div", 19)(4, "mat-icon", 20);
    \u0275\u0275text(5, "event_available");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "span", 21);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "h3", 22);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 23);
    \u0275\u0275text(11, "Visitas Recientes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 24)(13, "a", 25);
    \u0275\u0275text(14, " Ver todas las visitas ");
    \u0275\u0275elementStart(15, "mat-icon", 26);
    \u0275\u0275text(16, "arrow_forward");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(17, "div", 17)(18, "div", 18)(19, "div", 27)(20, "mat-icon", 20);
    \u0275\u0275text(21, "collections");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "span", 21);
    \u0275\u0275text(23, "Total hist\xF3ricas");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "h3", 22);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "p", 23);
    \u0275\u0275text(27, "Fotos Aprobadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 24)(29, "a", 28);
    \u0275\u0275text(30, " Explorar galer\xEDa ");
    \u0275\u0275elementStart(31, "mat-icon", 26);
    \u0275\u0275text(32, "arrow_forward");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(33, "div", 17)(34, "div", 18)(35, "div", 29)(36, "mat-icon", 20);
    \u0275\u0275text(37, "forum");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(38, "span", 21);
    \u0275\u0275text(39, "\xDAltimas 48h");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "h3", 22);
    \u0275\u0275text(41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "p", 23);
    \u0275\u0275text(43, "Mensajes Nuevos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "div", 24)(45, "a", 30);
    \u0275\u0275text(46, " Ir al centro de mensajes ");
    \u0275\u0275elementStart(47, "mat-icon", 26);
    \u0275\u0275text(48, "arrow_forward");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(49, "div", 31)(50, "div", 32)(51, "h2", 33);
    \u0275\u0275text(52, "Bienvenido a su Portal de Gesti\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "p", 34);
    \u0275\u0275text(54, "Aqu\xED puede supervisar en tiempo real la ejecuci\xF3n de sus puntos de venta y la gesti\xF3n de los mercaderistas.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "div", 35)(56, "button", 36);
    \u0275\u0275text(57, " Ver Fotos ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "button", 37);
    \u0275\u0275text(59, " Historial de Visitas ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(60, "div", 38)(61, "h3", 39);
    \u0275\u0275text(62, "Accesos R\xE1pidos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "div", 40)(64, "a", 41)(65, "div", 42)(66, "mat-icon", 43);
    \u0275\u0275text(67, "photo_library");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "span", 44);
    \u0275\u0275text(69, "Mis Fotos");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(70, "mat-icon", 45);
    \u0275\u0275text(71, "chevron_right");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(72, "a", 46)(73, "div", 42)(74, "mat-icon", 47);
    \u0275\u0275text(75, "calendar_today");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(76, "span", 44);
    \u0275\u0275text(77, "Mis Visitas");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(78, "mat-icon", 45);
    \u0275\u0275text(79, "chevron_right");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(80, "a", 48)(81, "div", 42)(82, "mat-icon", 49);
    \u0275\u0275text(83, "table_chart");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(84, "span", 44);
    \u0275\u0275text(85, "Data e Inventarios");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(86, "mat-icon", 45);
    \u0275\u0275text(87, "chevron_right");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate((tmp_1_0 = ctx_r1.clientSummary()) == null ? null : tmp_1_0.period);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_2_0 = ctx_r1.clientSummary()) == null ? null : tmp_2_0.recent_visits);
    \u0275\u0275advance(16);
    \u0275\u0275textInterpolate((tmp_3_0 = ctx_r1.clientSummary()) == null ? null : tmp_3_0.recent_photos);
    \u0275\u0275advance(16);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r1.clientSummary()) == null ? null : tmp_4_0.recent_messages);
  }
}
function DashboardComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 50)(1, "div", 51)(2, "div", 52)(3, "div", 53)(4, "mat-icon");
    \u0275\u0275text(5, "map");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "span", 54);
    \u0275\u0275text(7, "30 D\xEDas");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 55)(9, "h3", 56);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "p", 57);
    \u0275\u0275text(12, "Visitas Totales");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "div", 58)(14, "div", 52)(15, "div", 59)(16, "mat-icon");
    \u0275\u0275text(17, "check_circle");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "span", 60);
    \u0275\u0275text(19, "Eficiencia");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 55)(21, "h3", 56);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "p", 57);
    \u0275\u0275text(24, "Visitas Completadas");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "div", 61)(26, "div", 52)(27, "div", 62)(28, "mat-icon");
    \u0275\u0275text(29, "schedule");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "span", 63);
    \u0275\u0275text(31, "En Curso");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 55)(33, "h3", 64);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "p", 65);
    \u0275\u0275text(36, "Visitas Pendientes");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(37, "div", 66)(38, "div", 52)(39, "div", 67)(40, "mat-icon");
    \u0275\u0275text(41, "report_problem");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "span", 68);
    \u0275\u0275text(43, "Alerta");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "div", 55)(45, "h3", 64);
    \u0275\u0275text(46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "p", 65);
    \u0275\u0275text(48, "Fotos Rechazadas");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(49, "div", 69)(50, "div", 70)(51, "div", 71)(52, "h3", 72);
    \u0275\u0275text(53, "Estado de Fotograf\xEDas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "button", 73)(55, "mat-icon");
    \u0275\u0275text(56, "more_vert");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(57, "div", 74)(58, "div", 75)(59, "div", 76)(60, "div", 77);
    \u0275\u0275element(61, "div", 78);
    \u0275\u0275elementStart(62, "span", 79);
    \u0275\u0275text(63, "Aprobadas");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(64, "span", 80);
    \u0275\u0275text(65);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(66, "div", 81);
    \u0275\u0275element(67, "div", 82);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(68, "div", 75)(69, "div", 76)(70, "div", 77);
    \u0275\u0275element(71, "div", 83);
    \u0275\u0275elementStart(72, "span", 79);
    \u0275\u0275text(73, "Pendientes");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(74, "span", 84);
    \u0275\u0275text(75);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(76, "div", 81);
    \u0275\u0275element(77, "div", 85);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(78, "div", 75)(79, "div", 76)(80, "div", 77);
    \u0275\u0275element(81, "div", 86);
    \u0275\u0275elementStart(82, "span", 79);
    \u0275\u0275text(83, "Rechazadas");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(84, "span", 87);
    \u0275\u0275text(85);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(86, "div", 81);
    \u0275\u0275element(87, "div", 88);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(88, "div", 89)(89, "div", 90)(90, "h3", 91);
    \u0275\u0275text(91, "Accesos R\xE1pidos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "mat-icon", 45);
    \u0275\u0275text(93, "bolt");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(94, "div", 92)(95, "a", 93)(96, "div", 42)(97, "div", 94)(98, "mat-icon", 6);
    \u0275\u0275text(99, "map");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(100, "span", 95);
    \u0275\u0275text(101, "Ver Visitas");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(102, "mat-icon", 96);
    \u0275\u0275text(103, "chevron_right");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(104, "a", 97)(105, "div", 42)(106, "div", 94)(107, "mat-icon", 6);
    \u0275\u0275text(108, "photo_library");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(109, "span", 95);
    \u0275\u0275text(110, "Revisar Fotos");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(111, "mat-icon", 96);
    \u0275\u0275text(112, "chevron_right");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(113, "a", 98)(114, "div", 42)(115, "div", 94)(116, "mat-icon", 6);
    \u0275\u0275text(117, "bar_chart");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(118, "span", 95);
    \u0275\u0275text(119, "Reporter\xEDa");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(120, "mat-icon", 96);
    \u0275\u0275text(121, "chevron_right");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_7_0;
    let tmp_9_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate((tmp_1_0 = (tmp_1_0 = ctx_r1.summary()) == null ? null : tmp_1_0.visitas == null ? null : tmp_1_0.visitas.total) !== null && tmp_1_0 !== void 0 ? tmp_1_0 : 0);
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate((tmp_2_0 = (tmp_2_0 = ctx_r1.summary()) == null ? null : tmp_2_0.visitas == null ? null : tmp_2_0.visitas.completadas) !== null && tmp_2_0 !== void 0 ? tmp_2_0 : 0);
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate((tmp_3_0 = (tmp_3_0 = ctx_r1.summary()) == null ? null : tmp_3_0.visitas == null ? null : tmp_3_0.visitas.pendientes) !== null && tmp_3_0 !== void 0 ? tmp_3_0 : 0);
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate((tmp_4_0 = (tmp_4_0 = ctx_r1.summary()) == null ? null : tmp_4_0.fotos == null ? null : tmp_4_0.fotos.rechazadas) !== null && tmp_4_0 !== void 0 ? tmp_4_0 : 0);
    \u0275\u0275advance(19);
    \u0275\u0275textInterpolate1(" ", (tmp_5_0 = (tmp_5_0 = ctx_r1.summary()) == null ? null : tmp_5_0.fotos == null ? null : tmp_5_0.fotos.aprobadas) !== null && tmp_5_0 !== void 0 ? tmp_5_0 : 0, " ");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", 65, "%");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", (tmp_7_0 = (tmp_7_0 = ctx_r1.summary()) == null ? null : tmp_7_0.fotos == null ? null : tmp_7_0.fotos.pendientes) !== null && tmp_7_0 !== void 0 ? tmp_7_0 : 0, " ");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", 20, "%");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", (tmp_9_0 = (tmp_9_0 = ctx_r1.summary()) == null ? null : tmp_9_0.fotos == null ? null : tmp_9_0.fotos.rechazadas) !== null && tmp_9_0 !== void 0 ? tmp_9_0 : 0, " ");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", 15, "%");
  }
}
var DashboardComponent = class _DashboardComponent {
  constructor(api, auth, sanitizer) {
    this.api = api;
    this.auth = auth;
    this.sanitizer = sanitizer;
    this.loading = signal(true);
    this.summary = signal(null);
    this.clientSummary = signal(null);
    this.clientDashboardUrl = signal(null);
    this.activeView = signal("summary");
    this.isClientUser = computed(() => {
      const u = this.auth.currentUser();
      if (!u)
        return false;
      const clientRols = ["client", "coordinador_exclusivo", "coordinador_tradex"];
      return u.is_client || clientRols.includes(u.rol);
    });
    this.today = (/* @__PURE__ */ new Date()).toLocaleDateString("es-VE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  ngOnInit() {
    if (this.isClientUser()) {
      this.loadClientData();
    } else {
      this.loadSummary();
    }
  }
  loadSummary() {
    this.api.getReportSummary().subscribe({
      next: (data) => {
        this.summary.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
  loadClientData() {
    forkJoin({
      summaryData: this.api.getClientSummary().pipe(catchError(() => of({ recent_visits: 0, recent_photos: 0, recent_messages: 0, period: "\xDAltimos 7 d\xEDas" }))),
      dashboardData: this.api.getClientDashboard().pipe(catchError(() => of({ has_dashboard: false, url_html: null })))
    }).subscribe({
      next: ({ summaryData, dashboardData }) => {
        this.clientSummary.set(summaryData);
        if (dashboardData?.has_dashboard && dashboardData?.url_html) {
          this.clientDashboardUrl.set(this.sanitizer.bypassSecurityTrustHtml(dashboardData.url_html));
        }
        this.loading.set(false);
      },
      error: () => {
        this.clientSummary.set({ recent_visits: 0, recent_photos: 0, recent_messages: 0, period: "\xDAltimos 7 d\xEDas" });
        this.loading.set(false);
      }
    });
  }
  static {
    this.\u0275fac = function DashboardComponent_Factory(t) {
      return new (t || _DashboardComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(DomSanitizer));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardComponent, selectors: [["app-dashboard"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 17, vars: 6, consts: [[1, "space-y-8", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4"], [1, "text-3xl", "font-bold", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "bg-slate-100", "dark:bg-slate-800", "p-1.5", "rounded-2xl", "flex", "gap-1", "shadow-inner", "border", "border-slate-200/50", "dark:border-white/5"], [1, "flex", "items-center", "gap-2", "px-4", "py-2", "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200", "dark:border-white/5"], [1, "text-primary-500"], [1, "text-sm", "font-medium", "text-slate-700", "dark:text-slate-300", "capitalize"], [1, "flex", "flex-col", "items-center", "justify-center", "py-20", "gap-4"], [1, "client-dashboard-container", "animate-in", "fade-in", "zoom-in", "duration-700"], [1, "px-6", "py-2.5", "rounded-xl", "text-sm", "font-bold", "transition-all", "flex", "items-center", "gap-2", 3, "click"], [2, "font-size", "18px", "width", "18px", "height", "18px"], ["diameter", "48", "strokeWidth", "4"], [1, "text-slate-400", "font-medium", "animate-pulse"], [1, "bg-white", "dark:bg-slate-900", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-xl", "overflow-hidden", "p-2", "min-h-[600px]"], [1, "dashboard-iframe-wrapper", "w-full", "h-full", 3, "innerHTML"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-6", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-700"], [1, "group", "bg-white", "dark:bg-slate-900", "p-8", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "hover:shadow-xl", "transition-all", "duration-300"], [1, "flex", "items-center", "justify-between", "mb-6"], [1, "w-14", "h-14", "bg-indigo-50", "dark:bg-indigo-900/20", "rounded-2xl", "flex", "items-center", "justify-center", "text-indigo-600", "dark:text-indigo-400", "group-hover:bg-indigo-600", "group-hover:text-white", "transition-all"], [1, "text-2xl"], [1, "text-xs", "font-bold", "text-slate-400", "uppercase", "tracking-widest"], [1, "text-4xl", "font-black", "text-slate-800", "dark:text-white", "mb-1"], [1, "text-slate-500", "dark:text-slate-400", "font-semibold"], [1, "mt-6", "pt-6", "border-t", "border-slate-50", "dark:border-white/5"], ["routerLink", "/client/visits", 1, "text-indigo-600", "dark:text-indigo-400", "font-bold", "text-sm", "flex", "items-center", "gap-1", "hover:gap-2", "transition-all"], [1, "text-sm"], [1, "w-14", "h-14", "bg-rose-50", "dark:bg-rose-900/20", "rounded-2xl", "flex", "items-center", "justify-center", "text-rose-600", "dark:text-rose-400", "group-hover:bg-rose-600", "group-hover:text-white", "transition-all"], ["routerLink", "/client", 1, "text-rose-600", "dark:text-rose-400", "font-bold", "text-sm", "flex", "items-center", "gap-1", "hover:gap-2", "transition-all"], [1, "w-14", "h-14", "bg-emerald-50", "dark:bg-emerald-900/20", "rounded-2xl", "flex", "items-center", "justify-center", "text-emerald-600", "dark:text-emerald-400", "group-hover:bg-emerald-600", "group-hover:text-white", "transition-all"], ["routerLink", "/chat", 1, "text-emerald-600", "dark:text-emerald-400", "font-bold", "text-sm", "flex", "items-center", "gap-1", "hover:gap-2", "transition-all"], [1, "mt-8", "grid", "grid-cols-1", "lg:grid-cols-2", "gap-8", "animate-in", "fade-in", "slide-in-from-bottom-8", "duration-1000"], [1, "bg-indigo-600", "rounded-3xl", "p-8", "text-white", "shadow-lg", "shadow-indigo-500/20", "flex", "flex-col", "justify-center"], [1, "text-2xl", "font-bold", "mb-2"], [1, "text-indigo-100", "mb-6", "opacity-90"], [1, "flex", "gap-4"], ["mat-flat-button", "", "routerLink", "/client", 2, "background", "white", "color", "#4f46e5", "font-weight", "700", "border-radius", "12px"], ["mat-stroked-button", "", "routerLink", "/client/visits", 2, "color", "white", "border-color", "rgba(255,255,255,0.3)", "font-weight", "700", "border-radius", "12px"], [1, "bg-white", "dark:bg-slate-900", "rounded-3xl", "p-8", "border", "border-slate-200", "dark:border-white/5", "shadow-sm"], [1, "text-lg", "font-bold", "text-slate-800", "dark:text-white", "mb-4"], [1, "space-y-3"], ["routerLink", "/client", 1, "flex", "items-center", "justify-between", "p-4", "bg-slate-50", "dark:bg-slate-800/50", "rounded-2xl", "hover:bg-slate-100", "dark:hover:bg-slate-800", "transition-colors", "border", "border-transparent", "hover:border-slate-200"], [1, "flex", "items-center", "gap-4"], [1, "text-indigo-500"], [1, "font-bold", "text-slate-700", "dark:text-slate-300"], [1, "text-slate-400"], ["routerLink", "/client/visits", 1, "flex", "items-center", "justify-between", "p-4", "bg-slate-50", "dark:bg-slate-800/50", "rounded-2xl", "hover:bg-slate-100", "dark:hover:bg-slate-800", "transition-colors", "border", "border-transparent", "hover:border-slate-200"], [1, "text-rose-500"], ["routerLink", "/data", 1, "flex", "items-center", "justify-between", "p-4", "bg-slate-50", "dark:bg-slate-800/50", "rounded-2xl", "hover:bg-slate-100", "dark:hover:bg-slate-800", "transition-colors", "border", "border-transparent", "hover:border-slate-200"], [1, "text-emerald-500"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-4", "gap-6"], [1, "group", "bg-white", "dark:bg-slate-900", "p-6", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "hover:shadow-xl", "hover:shadow-primary-500/10", "transition-all", "duration-300"], [1, "flex", "items-start", "justify-between"], [1, "w-12", "h-12", "bg-primary-50", "dark:bg-primary-900/20", "rounded-2xl", "flex", "items-center", "justify-center", "text-primary-600", "dark:text-primary-400", "group-hover:bg-primary-500", "group-hover:text-white", "transition-colors"], [1, "text-xs", "font-bold", "text-slate-400", "uppercase", "tracking-wider"], [1, "mt-6"], [1, "text-3xl", "font-bold", "text-slate-800", "dark:text-white"], [1, "text-slate-500", "dark:text-slate-400", "font-medium"], [1, "group", "bg-white", "dark:bg-slate-900", "p-6", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "hover:shadow-xl", "hover:shadow-emerald-500/10", "transition-all", "duration-300"], [1, "w-12", "h-12", "bg-emerald-50", "dark:bg-emerald-900/20", "rounded-2xl", "flex", "items-center", "justify-center", "text-emerald-600", "dark:text-emerald-400", "group-hover:bg-emerald-500", "group-hover:text-white", "transition-colors"], [1, "text-xs", "font-bold", "text-slate-400", "uppercase", "tracking-wider", "text-emerald-600"], [1, "group", "bg-white", "p-6", "rounded-3xl", "border", "border-slate-200", "shadow-sm", "hover:shadow-xl", "hover:shadow-amber-500/10", "transition-all", "duration-300"], [1, "w-12", "h-12", "bg-amber-50", "rounded-2xl", "flex", "items-center", "justify-center", "text-amber-600", "group-hover:bg-amber-500", "group-hover:text-white", "transition-colors"], [1, "text-xs", "font-bold", "text-slate-400", "uppercase", "tracking-wider", "text-amber-600"], [1, "text-3xl", "font-bold", "text-slate-800"], [1, "text-slate-500", "font-medium"], [1, "group", "bg-white", "p-6", "rounded-3xl", "border", "border-slate-200", "shadow-sm", "hover:shadow-xl", "hover:shadow-rose-500/10", "transition-all", "duration-300"], [1, "w-12", "h-12", "bg-rose-50", "rounded-2xl", "flex", "items-center", "justify-center", "text-rose-600", "group-hover:bg-rose-500", "group-hover:text-white", "transition-colors"], [1, "text-xs", "font-bold", "text-slate-400", "uppercase", "tracking-wider", "text-rose-600"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-8"], [1, "bg-white", "dark:bg-slate-900", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "overflow-hidden"], [1, "px-8", "py-6", "border-b", "border-slate-100", "dark:border-white/5", "flex", "items-center", "justify-between"], [1, "text-lg", "font-bold", "text-slate-800", "dark:text-white"], ["mat-icon-button", "", 1, "text-slate-400"], [1, "p-8", "space-y-6"], [1, "space-y-4"], [1, "flex", "items-center", "justify-between"], [1, "flex", "items-center", "gap-3"], [1, "w-2", "h-2", "rounded-full", "bg-emerald-500"], [1, "text-slate-600", "font-medium"], [1, "px-3", "py-1", "bg-emerald-50", "text-emerald-700", "rounded-lg", "text-sm", "font-bold"], [1, "w-full", "bg-slate-100", "rounded-full", "h-2"], [1, "bg-emerald-500", "h-2", "rounded-full"], [1, "w-2", "h-2", "rounded-full", "bg-amber-500"], [1, "px-3", "py-1", "bg-amber-50", "text-amber-700", "rounded-lg", "text-sm", "font-bold"], [1, "bg-amber-500", "h-2", "rounded-full"], [1, "w-2", "h-2", "rounded-full", "bg-rose-500"], [1, "px-3", "py-1", "bg-rose-50", "text-rose-700", "rounded-lg", "text-sm", "font-bold"], [1, "bg-rose-500", "h-2", "rounded-full"], [1, "bg-white", "rounded-3xl", "border", "border-slate-200", "shadow-sm", "overflow-hidden"], [1, "px-8", "py-6", "border-b", "border-slate-100", "flex", "items-center", "justify-between"], [1, "text-lg", "font-bold", "text-slate-800"], [1, "p-8", "grid", "grid-cols-1", "gap-4"], ["routerLink", "/visits", 1, "flex", "items-center", "justify-between", "p-4", "rounded-2xl", "bg-slate-50", "hover:bg-primary-500", "group", "transition-all", "duration-300", "border", "border-slate-100"], [1, "w-10", "h-10", "rounded-xl", "bg-white", "flex", "items-center", "justify-center", "shadow-sm", "group-hover:scale-110", "transition-transform"], [1, "font-semibold", "text-slate-700", "group-hover:text-white"], [1, "text-slate-400", "group-hover:text-white", "group-hover:translate-x-1", "transition-all"], ["routerLink", "/photos", 1, "flex", "items-center", "justify-between", "p-4", "rounded-2xl", "bg-slate-50", "hover:bg-primary-500", "group", "transition-all", "duration-300", "border", "border-slate-100"], ["routerLink", "/reports", 1, "flex", "items-center", "justify-between", "p-4", "rounded-2xl", "bg-slate-50", "hover:bg-primary-500", "group", "transition-all", "duration-300", "border", "border-slate-100"]], template: function DashboardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
        \u0275\u0275text(4, "Dashboard");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p", 3);
        \u0275\u0275text(6, "Resumen general de actividades y estad\xEDsticas.");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(7, DashboardComponent_Conditional_7_Template, 9, 20, "div", 4);
        \u0275\u0275elementStart(8, "div", 5)(9, "mat-icon", 6);
        \u0275\u0275text(10, "calendar_today");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "span", 7);
        \u0275\u0275text(12);
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(13, DashboardComponent_Conditional_13_Template, 4, 0, "div", 8)(14, DashboardComponent_Conditional_14_Template, 3, 1, "div", 9)(15, DashboardComponent_Conditional_15_Template, 88, 4)(16, DashboardComponent_Conditional_16_Template, 122, 13);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(7);
        \u0275\u0275conditional(7, ctx.clientDashboardUrl() ? 7 : -1);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.today);
        \u0275\u0275advance();
        \u0275\u0275conditional(13, ctx.loading() ? 13 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(14, !ctx.loading() && ctx.clientDashboardUrl() && ctx.activeView() === "powerbi" ? 14 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(15, !ctx.loading() && ctx.isClientUser() && ctx.activeView() === "summary" ? 15 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(16, !ctx.loading() && !ctx.isClientUser() && ctx.summary() ? 16 : -1);
      }
    }, dependencies: [CommonModule, MatCardModule, MatIconModule, MatIcon, MatProgressSpinnerModule, MatProgressSpinner, MatButtonModule, MatButton, MatIconButton, RouterLink], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n.dashboard-iframe-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: calc(100vh - 250px);\n  min-height: 600px;\n}\n.dashboard-iframe-wrapper[_ngcontent-%COMP%]     iframe {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100% !important;\n  height: 100% !important;\n  border: none !important;\n  border-radius: 12px;\n}\n/*# sourceMappingURL=dashboard.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src\\app\\features\\dashboard\\dashboard.component.ts", lineNumber: 21 });
})();
export {
  DashboardComponent
};
//# sourceMappingURL=chunk-D6RLSYW3.js.map
