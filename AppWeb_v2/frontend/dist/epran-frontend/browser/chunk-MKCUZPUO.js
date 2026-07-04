import {
  BaseChartDirective
} from "./chunk-IGEIV4O7.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-I7XEM5TB.js";
import {
  environment
} from "./chunk-NRWDSKQC.js";
import {
  CommonModule,
  HttpClient,
  NgForOf,
  NgIf,
  inject,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QB3BCYT5.js";

// src/app/features/cliente-encuestador/cliente-encuestador-dashboard.component.ts
function ClienteEncuestadorDashboardComponent_div_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275element(1, "div", 20);
    \u0275\u0275elementEnd();
  }
}
function ClienteEncuestadorDashboardComponent_ng_container_24_tr_115_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 59)(1, "td", 60);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 61);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 61);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 61);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 62);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 63);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const m_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r1.nombre_completo);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r1.especialidad);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r1.centro);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r1.ciudad);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r1.valor_consulta_rango);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r1.promedio_pacientes);
  }
}
function ClienteEncuestadorDashboardComponent_ng_container_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 21)(2, "div", 22)(3, "div", 23);
    \u0275\u0275element(4, "i", 24);
    \u0275\u0275text(5, " M\xE9dicos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 25);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 22)(9, "div", 23);
    \u0275\u0275element(10, "i", 26);
    \u0275\u0275text(11, " Centros");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 25);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 22)(15, "div", 23);
    \u0275\u0275element(16, "i", 27);
    \u0275\u0275text(17, " Encuestas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 25);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 28);
    \u0275\u0275element(21, "i", 29);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 22)(24, "div", 23);
    \u0275\u0275element(25, "i", 30);
    \u0275\u0275text(26, " Especialidades");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 25);
    \u0275\u0275text(28);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div", 22)(30, "div", 23);
    \u0275\u0275element(31, "i", 31);
    \u0275\u0275text(32, " Est/Ciudades");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 25);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 32)(36, "div", 33);
    \u0275\u0275text(37, "Con 2\xBA Consultorio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "div", 25);
    \u0275\u0275text(39);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "div", 28);
    \u0275\u0275text(41);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "div", 34)(43, "div", 35);
    \u0275\u0275text(44, "Contactabilidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "div", 25);
    \u0275\u0275text(46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "div", 28);
    \u0275\u0275text(48);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(49, "div", 36)(50, "div", 37)(51, "h3", 38);
    \u0275\u0275element(52, "i", 39);
    \u0275\u0275text(53, "M\xE9dicos por especialidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "div", 40);
    \u0275\u0275element(55, "canvas", 41);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(56, "div", 37)(57, "h3", 38);
    \u0275\u0275element(58, "i", 42);
    \u0275\u0275text(59, "Distribuci\xF3n valor consulta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "div", 40);
    \u0275\u0275element(61, "canvas", 41);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(62, "div", 37)(63, "h3", 38);
    \u0275\u0275element(64, "i", 43);
    \u0275\u0275text(65, "Pacientes / semana");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "div", 40);
    \u0275\u0275element(67, "canvas", 41);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(68, "div", 44)(69, "div", 45)(70, "h3", 38);
    \u0275\u0275element(71, "i", 46);
    \u0275\u0275text(72, "M\xE9dicos por estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(73, "div", 47);
    \u0275\u0275element(74, "canvas", 41);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(75, "div", 45)(76, "h3", 38);
    \u0275\u0275element(77, "i", 48);
    \u0275\u0275text(78, "Top universidades");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(79, "div", 47);
    \u0275\u0275element(80, "canvas", 41);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(81, "div", 44)(82, "div", 45)(83, "h3", 38);
    \u0275\u0275element(84, "i", 49);
    \u0275\u0275text(85, "Top centros de salud");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "div", 47);
    \u0275\u0275element(87, "canvas", 41);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(88, "div", 45)(89, "h3", 38);
    \u0275\u0275element(90, "i", 50);
    \u0275\u0275text(91, "D\xEDas de consulta m\xE1s comunes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "div", 47);
    \u0275\u0275element(93, "canvas", 41);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(94, "div", 51)(95, "h3", 52);
    \u0275\u0275element(96, "i", 53);
    \u0275\u0275text(97, "M\xE9dicos (tabla filtrada)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(98, "div", 54)(99, "table", 55)(100, "thead")(101, "tr", 56)(102, "th", 57);
    \u0275\u0275text(103, "M\xE9dico");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(104, "th", 57);
    \u0275\u0275text(105, "Especialidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(106, "th", 57);
    \u0275\u0275text(107, "Centro");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(108, "th", 57);
    \u0275\u0275text(109, "Ciudad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(110, "th", 57);
    \u0275\u0275text(111, "Valor");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(112, "th", 57);
    \u0275\u0275text(113, "Pac./Sem");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(114, "tbody");
    \u0275\u0275template(115, ClienteEncuestadorDashboardComponent_ng_container_24_tr_115_Template, 13, 6, "tr", 58);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.kpis.total_medicos);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.kpis.total_centros);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.kpis.total_encuestas);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" \xDAlt. 30 d\xEDas: ", ctx_r1.kpis.encuestas_30d, "");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.kpis.total_especialidades);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", ctx_r1.kpis.total_estados, " / ", ctx_r1.kpis.total_ciudades, "");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.kpis.medicos_con_2do_consultorio);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r1.kpis.pct_2do_consultorio, "% del total");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r1.kpis.pct_whatsapp, "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("WA ", ctx_r1.kpis.pct_whatsapp, "% \u2022 Email ", ctx_r1.kpis.pct_email, "%");
    \u0275\u0275advance(7);
    \u0275\u0275property("data", ctx_r1.espChartData)("options", ctx_r1.doughnutOptions)("type", "doughnut");
    \u0275\u0275advance(6);
    \u0275\u0275property("data", ctx_r1.valChartData)("options", ctx_r1.doughnutOptions)("type", "doughnut");
    \u0275\u0275advance(6);
    \u0275\u0275property("data", ctx_r1.pacChartData)("options", ctx_r1.doughnutOptions)("type", "doughnut");
    \u0275\u0275advance(7);
    \u0275\u0275property("data", ctx_r1.estChartData)("options", ctx_r1.barOptions)("type", "bar");
    \u0275\u0275advance(6);
    \u0275\u0275property("data", ctx_r1.uniChartData)("options", ctx_r1.horizontalBarOptions)("type", "bar");
    \u0275\u0275advance(7);
    \u0275\u0275property("data", ctx_r1.cenChartData)("options", ctx_r1.horizontalBarOptions)("type", "bar");
    \u0275\u0275advance(6);
    \u0275\u0275property("data", ctx_r1.diasChartData)("options", ctx_r1.barOptions)("type", "bar");
    \u0275\u0275advance(22);
    \u0275\u0275property("ngForOf", ctx_r1.medicos);
  }
}
var ClienteEncuestadorDashboardComponent = class _ClienteEncuestadorDashboardComponent {
  constructor() {
    this.http = inject(HttpClient);
    this.loading = true;
    this.kpis = null;
    this.medicos = [];
    this.filters = {
      fecha_desde: "",
      fecha_hasta: "",
      estados: [],
      ciudades: [],
      especialidades: [],
      universidades: [],
      centros: [],
      encuestadores: []
    };
    this.catalogs = {
      estados: [],
      ciudades: [],
      especialidades: [],
      universidades: [],
      centros: [],
      encuestadores: []
    };
    this.doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "right", labels: { color: "#94a3b8" } } }
    };
    this.barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(255,255,255,0.05)" } },
        y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(255,255,255,0.05)" } }
      }
    };
    this.horizontalBarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(255,255,255,0.05)" } },
        y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(255,255,255,0.05)" } }
      }
    };
    this.espChartData = { labels: [], datasets: [] };
    this.valChartData = { labels: [], datasets: [] };
    this.pacChartData = { labels: [], datasets: [] };
    this.estChartData = { labels: [], datasets: [] };
    this.uniChartData = { labels: [], datasets: [] };
    this.cenChartData = { labels: [], datasets: [] };
    this.diasChartData = { labels: [], datasets: [] };
  }
  ngOnInit() {
    this.loadData();
    this.loadFilters();
  }
  loadFilters() {
  }
  loadData() {
    this.loading = true;
    let params = new URLSearchParams();
    if (this.filters.fecha_desde)
      params.append("fecha_desde", this.filters.fecha_desde);
    if (this.filters.fecha_hasta)
      params.append("fecha_hasta", this.filters.fecha_hasta);
    this.http.get(`${environment.apiUrl}/api/cliente-encuestador/kpis?${params.toString()}`).subscribe({
      next: (res) => {
        this.kpis = res;
        if (res.charts) {
          this.buildCharts(res.charts);
        }
        this.http.get(`${environment.apiUrl}/api/cliente-encuestador/medicos?page=1&per_page=10&${params.toString()}`).subscribe((medRes) => {
          this.medicos = medRes.medicos || [];
          this.loading = false;
        });
      },
      error: () => this.loading = false
    });
  }
  buildCharts(charts) {
    const bgColors = ["#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#6366f1"];
    this.espChartData = {
      labels: charts.especialidades.map((c) => c.name),
      datasets: [{ data: charts.especialidades.map((c) => c.value), backgroundColor: bgColors, borderWidth: 0 }]
    };
    this.valChartData = {
      labels: charts.valor_consulta.map((c) => c.name),
      datasets: [{ data: charts.valor_consulta.map((c) => c.value), backgroundColor: bgColors, borderWidth: 0 }]
    };
    this.pacChartData = {
      labels: charts.pacientes_semana.map((c) => c.name),
      datasets: [{ data: charts.pacientes_semana.map((c) => c.value), backgroundColor: bgColors, borderWidth: 0 }]
    };
    this.estChartData = {
      labels: charts.estados.map((c) => c.name),
      datasets: [{ data: charts.estados.map((c) => c.value), backgroundColor: "#8b5cf6", borderRadius: 4 }]
    };
    this.uniChartData = {
      labels: charts.universidades.map((c) => c.name),
      datasets: [{ data: charts.universidades.map((c) => c.value), backgroundColor: ["#8b5cf6", "#0ea5e9"], borderRadius: 4 }]
    };
    this.cenChartData = {
      labels: charts.centros.map((c) => c.name),
      datasets: [{ data: charts.centros.map((c) => c.value), backgroundColor: ["#8b5cf6", "#0ea5e9"], borderRadius: 4 }]
    };
    this.diasChartData = {
      labels: charts.dias_consulta.map((c) => c.name),
      datasets: [{ data: charts.dias_consulta.map((c) => c.value), backgroundColor: bgColors, borderRadius: 4 }]
    };
  }
  static {
    this.\u0275fac = function ClienteEncuestadorDashboardComponent_Factory(t) {
      return new (t || _ClienteEncuestadorDashboardComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ClienteEncuestadorDashboardComponent, selectors: [["app-cliente-encuestador-dashboard"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 25, vars: 4, consts: [[1, "flex", "h-full", "bg-[#0f172a]", "text-slate-300", "overflow-hidden"], [1, "w-64", "glass-panel", "border-r", "border-white/5", "flex", "flex-col", "h-full", "overflow-y-auto", "custom-scrollbar", "flex-shrink-0", "z-10", "hidden", "md:flex"], [1, "p-4", "border-b", "border-white/5"], [1, "text-sm", "font-bold", "text-white", "uppercase", "tracking-wider", "flex", "items-center", "gap-2"], [1, "fas", "fa-filter", "text-indigo-400"], [1, "p-4", "space-y-6"], [1, "block", "text-xs", "font-semibold", "text-slate-400", "mb-2", "uppercase"], ["type", "date", 1, "w-full", "bg-slate-900", "border", "border-slate-700", "rounded", "p-2", "text-sm", "text-white", "mb-2", "focus:border-indigo-500", "focus:outline-none", 3, "ngModelChange", "ngModel"], ["type", "date", 1, "w-full", "bg-slate-900", "border", "border-slate-700", "rounded", "p-2", "text-sm", "text-white", "focus:border-indigo-500", "focus:outline-none", 3, "ngModelChange", "ngModel"], [1, "w-full", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "py-2", "rounded", "font-semibold", "transition-colors", 3, "click"], [1, "fas", "fa-sync-alt", "mr-2"], [1, "flex-1", "overflow-y-auto", "custom-scrollbar", "p-6", "relative"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-white", "flex", "items-center", "gap-2"], [1, "fas", "fa-chart-line", "text-indigo-500"], [1, "md:hidden", "bg-slate-800", "text-white", "px-3", "py-2", "rounded"], [1, "fas", "fa-filter"], ["class", "flex items-center justify-center py-20", 4, "ngIf"], [4, "ngIf"], [1, "flex", "items-center", "justify-center", "py-20"], [1, "animate-spin", "rounded-full", "h-10", "w-10", "border-b-2", "border-indigo-500"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "xl:grid-cols-7", "gap-4", "mb-6"], [1, "glass-panel", "rounded-xl", "p-4", "relative", "overflow-hidden"], [1, "text-xs", "text-slate-400", "font-semibold", "mb-1", "uppercase"], [1, "fas", "fa-user-md", "mr-1"], [1, "text-3xl", "font-bold", "text-white"], [1, "fas", "fa-hospital", "mr-1"], [1, "fas", "fa-clipboard-list", "mr-1"], [1, "text-[10px]", "text-slate-500", "mt-1"], [1, "fas", "fa-history"], [1, "fas", "fa-stethoscope", "mr-1"], [1, "fas", "fa-map-marker-alt", "mr-1"], [1, "glass-panel", "rounded-xl", "p-4", "relative", "overflow-hidden", "border-t-2", "border-t-amber-500"], [1, "text-xs", "text-amber-400", "font-semibold", "mb-1", "uppercase"], [1, "glass-panel", "rounded-xl", "p-4", "relative", "overflow-hidden", "border-t-2", "border-t-emerald-500"], [1, "text-xs", "text-emerald-400", "font-semibold", "mb-1", "uppercase"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-6", "mb-6"], [1, "glass-panel", "rounded-xl", "p-4", "h-64"], [1, "text-sm", "font-semibold", "text-white", "mb-2"], [1, "fas", "fa-chart-pie", "text-indigo-400", "mr-2"], [1, "h-48"], ["baseChart", "", 3, "data", "options", "type"], [1, "fas", "fa-money-bill-wave", "text-indigo-400", "mr-2"], [1, "fas", "fa-users", "text-indigo-400", "mr-2"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6", "mb-6"], [1, "glass-panel", "rounded-xl", "p-4", "h-72"], [1, "fas", "fa-chart-bar", "text-indigo-400", "mr-2"], [1, "h-56"], [1, "fas", "fa-university", "text-indigo-400", "mr-2"], [1, "fas", "fa-hospital-alt", "text-indigo-400", "mr-2"], [1, "fas", "fa-calendar-alt", "text-indigo-400", "mr-2"], [1, "glass-panel", "rounded-xl", "p-4", "mb-6"], [1, "text-sm", "font-semibold", "text-white", "mb-4"], [1, "fas", "fa-table", "text-indigo-400", "mr-2"], [1, "overflow-x-auto"], [1, "w-full", "text-left", "border-collapse", "text-sm"], [1, "text-slate-400", "text-xs", "uppercase", "border-b", "border-white/10"], [1, "pb-2", "px-3"], ["class", "border-b border-white/5 hover:bg-white/5 transition-colors", 4, "ngFor", "ngForOf"], [1, "border-b", "border-white/5", "hover:bg-white/5", "transition-colors"], [1, "py-2", "px-3", "font-semibold", "text-white"], [1, "py-2", "px-3"], [1, "py-2", "px-3", "text-emerald-400"], [1, "py-2", "px-3", "text-sky-400"]], template: function ClienteEncuestadorDashboardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "aside", 1)(2, "div", 2)(3, "h2", 3);
        \u0275\u0275element(4, "i", 4);
        \u0275\u0275text(5, " Filtros ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(6, "div", 5)(7, "div")(8, "label", 6);
        \u0275\u0275text(9, "Fechas");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "input", 7);
        \u0275\u0275twoWayListener("ngModelChange", function ClienteEncuestadorDashboardComponent_Template_input_ngModelChange_10_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filters.fecha_desde, $event) || (ctx.filters.fecha_desde = $event);
          return $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "input", 8);
        \u0275\u0275twoWayListener("ngModelChange", function ClienteEncuestadorDashboardComponent_Template_input_ngModelChange_11_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filters.fecha_hasta, $event) || (ctx.filters.fecha_hasta = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "button", 9);
        \u0275\u0275listener("click", function ClienteEncuestadorDashboardComponent_Template_button_click_12_listener() {
          return ctx.loadData();
        });
        \u0275\u0275element(13, "i", 10);
        \u0275\u0275text(14, " Aplicar ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(15, "main", 11)(16, "div", 12)(17, "div")(18, "h1", 13);
        \u0275\u0275element(19, "i", 14);
        \u0275\u0275text(20, " MedInsights Dashboard ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(21, "button", 15);
        \u0275\u0275element(22, "i", 16);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(23, ClienteEncuestadorDashboardComponent_div_23_Template, 2, 0, "div", 17)(24, ClienteEncuestadorDashboardComponent_ng_container_24_Template, 116, 34, "ng-container", 18);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(10);
        \u0275\u0275twoWayProperty("ngModel", ctx.filters.fecha_desde);
        \u0275\u0275advance();
        \u0275\u0275twoWayProperty("ngModel", ctx.filters.fecha_hasta);
        \u0275\u0275advance(12);
        \u0275\u0275property("ngIf", ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading && ctx.kpis);
      }
    }, dependencies: [CommonModule, NgForOf, NgIf, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, BaseChartDirective], styles: ["\n\n.glass-panel[_ngcontent-%COMP%] {\n  background: rgba(15, 23, 42, 0.7);\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.05);\n}\n.custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 6px;\n}\n.custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: rgba(15, 23, 42, 0.5);\n}\n.custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: rgba(99, 102, 241, 0.5);\n  border-radius: 10px;\n}\n/*# sourceMappingURL=cliente-encuestador-dashboard.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ClienteEncuestadorDashboardComponent, { className: "ClienteEncuestadorDashboardComponent", filePath: "src\\app\\features\\cliente-encuestador\\cliente-encuestador-dashboard.component.ts", lineNumber: 32 });
})();

// src/app/features/cliente-encuestador/cliente-encuestador.routes.ts
var CLIENTE_ENCUESTADOR_ROUTES = [
  { path: "dashboard", component: ClienteEncuestadorDashboardComponent },
  { path: "", redirectTo: "dashboard", pathMatch: "full" }
];
export {
  CLIENTE_ENCUESTADOR_ROUTES
};
//# sourceMappingURL=chunk-MKCUZPUO.js.map
