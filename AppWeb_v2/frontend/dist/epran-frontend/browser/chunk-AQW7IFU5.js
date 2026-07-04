import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "./chunk-4L4CQRER.js";
import {
  require_maplibre_gl
} from "./chunk-Y5EJGXWO.js";
import {
  MatTab,
  MatTabGroup,
  MatTabLabel,
  MatTabsModule
} from "./chunk-A5TTJWI6.js";
import {
  MatInput,
  MatInputModule
} from "./chunk-GXZEZIYO.js";
import {
  MatBadge,
  MatBadgeModule
} from "./chunk-UGOZ64SM.js";
import {
  MatDividerModule
} from "./chunk-APQQCC2U.js";
import {
  MatSnackBar,
  MatSnackBarModule
} from "./chunk-7QJW63DM.js";
import {
  AuthService
} from "./chunk-FAJEMXMR.js";
import {
  MatSelect,
  MatSelectModule
} from "./chunk-DD2LOOAS.js";
import {
  MatFormFieldModule,
  MatSuffix
} from "./chunk-YUDUWHLJ.js";
import "./chunk-CELNEZAJ.js";
import "./chunk-ABO6AUNU.js";
import {
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
  ApiService
} from "./chunk-G4LBJVY7.js";
import {
  MatButtonModule,
  MatIcon,
  MatIconModule,
  MatNativeDateModule,
  MatOption
} from "./chunk-KQNRR4FF.js";
import "./chunk-QGVFX6Y7.js";
import "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  BehaviorSubject,
  CommonModule,
  DatePipe,
  HttpClient,
  NgClass,
  Subject,
  __async,
  __spreadProps,
  __spreadValues,
  __toESM,
  computed,
  fromEvent,
  inject,
  interval,
  map,
  merge,
  of,
  signal,
  startWith,
  switchMap,
  takeUntil,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QB3BCYT5.js";

// src/app/features/mercaderista/components/merc-ruta/merc-ruta.component.ts
var import_maplibre_gl = __toESM(require_maplibre_gl());

// src/app/features/mercaderista/services/merc-ui.service.ts
var MercUiService = class _MercUiService {
  constructor() {
    this.activeVisit = signal(null);
  }
  openVisit(visit) {
    this.activeVisit.set(visit);
  }
  closeVisit() {
    this.activeVisit.set(null);
  }
  static {
    this.\u0275fac = function MercUiService_Factory(t) {
      return new (t || _MercUiService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MercUiService, factory: _MercUiService.\u0275fac, providedIn: "root" });
  }
};

// src/app/features/mercaderista/components/merc-ruta/merc-ruta.component.ts
var _forTrack0 = ($index, $item) => $item.id_ruta;
var _forTrack1 = ($index, $item) => $item.id_punto;
var _forTrack2 = ($index, $item) => $item.id_cliente;
function MercRutaComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "mat-spinner", 9);
    \u0275\u0275elementStart(2, "span", 10);
    \u0275\u0275text(3, "Sincronizando ruta...");
    \u0275\u0275elementEnd()();
  }
}
function MercRutaComponent_Conditional_11_For_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275listener("click", function MercRutaComponent_Conditional_11_For_4_Template_div_click_0_listener() {
      const ruta_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectRoute(ruta_r4));
    });
    \u0275\u0275elementStart(1, "div", 16)(2, "div", 17)(3, "div", 18)(4, "mat-icon");
    \u0275\u0275text(5, "route");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "h4", 19);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 20);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "mat-icon", 21);
    \u0275\u0275text(12, "chevron_right");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ruta_r4 = ctx.$implicit;
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ruta_r4.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("ID: ", ruta_r4.id_ruta, "");
  }
}
function MercRutaComponent_Conditional_11_ForEmpty_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14)(1, "p", 22);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("No hay rutas ", ctx_r1.activeTab(), "s hoy");
  }
}
function MercRutaComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "p", 12);
    \u0275\u0275text(2, "Selecciona una ruta para hoy");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, MercRutaComponent_Conditional_11_For_4_Template, 13, 2, "div", 13, _forTrack0, false, MercRutaComponent_Conditional_11_ForEmpty_5_Template, 3, 1, "div", 14);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.filteredRutas());
  }
}
function MercRutaComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23)(1, "button", 24);
    \u0275\u0275listener("click", function MercRutaComponent_Conditional_12_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.selectedRouteId.set(null));
    });
    \u0275\u0275elementStart(2, "mat-icon", 25);
    \u0275\u0275text(3, "arrow_back");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 26);
    \u0275\u0275text(5, "Volver");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 27)(7, "div", 28)(8, "div")(9, "span", 29);
    \u0275\u0275text(10, "Ruta Seleccionada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "h3", 30);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 31)(14, "div", 32)(15, "span", 33);
    \u0275\u0275text(16, "PDVs de la ruta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 34);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(19, "div", 35);
    \u0275\u0275elementStart(20, "div", 32)(21, "span", 33);
    \u0275\u0275text(22, "Tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span", 36);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "button", 37);
    \u0275\u0275listener("click", function MercRutaComponent_Conditional_12_Template_button_click_25_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.ejecutarRuta());
    });
    \u0275\u0275text(26, " Ejecutar Ruta ");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(27, "div", 38);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate((tmp_2_0 = ctx_r1.selectedRoute()) == null ? null : tmp_2_0.nombre);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.groupedPdvs().length);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.activeTab());
  }
}
function MercRutaComponent_Conditional_13_For_10_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 50);
    \u0275\u0275text(1, "location_on");
    \u0275\u0275elementEnd();
  }
}
function MercRutaComponent_Conditional_13_For_10_Conditional_15_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 58);
    \u0275\u0275listener("click", function MercRutaComponent_Conditional_13_For_10_Conditional_15_For_5_Template_button_click_0_listener() {
      const c_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const group_r10 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.iniciar(group_r10, c_r9));
    });
    \u0275\u0275elementStart(1, "span", 59);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-icon", 60);
    \u0275\u0275text(4, "arrow_forward");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r9 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r9.nombre);
  }
}
function MercRutaComponent_Conditional_13_For_10_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 54)(1, "p", 20);
    \u0275\u0275text(2, "Selecciona el Cliente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 55);
    \u0275\u0275repeaterCreate(4, MercRutaComponent_Conditional_13_For_10_Conditional_15_For_5_Template, 5, 1, "button", 56, _forTrack2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 57);
    \u0275\u0275listener("click", function MercRutaComponent_Conditional_13_For_10_Conditional_15_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.activatingPdvId.set(null));
    });
    \u0275\u0275text(7, "Cancelar");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const group_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275repeater(group_r10.clients);
  }
}
function MercRutaComponent_Conditional_13_For_10_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 61);
    \u0275\u0275listener("click", function MercRutaComponent_Conditional_13_For_10_Conditional_16_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const group_r10 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.triggerActivation(group_r10));
    });
    \u0275\u0275elementStart(1, "mat-icon", 25);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const group_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classMap(group_r10.hasVisited ? "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300" : "bg-primary-600 text-white shadow-lg shadow-primary-600/20");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(group_r10.hasVisited ? "visibility" : "camera_alt");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", group_r10.hasVisited ? "Ver Visitas" : "Activar PDV", " ");
  }
}
function MercRutaComponent_Conditional_13_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43)(1, "div", 45)(2, "div", 46)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 47)(6, "div", 48)(7, "span", 49);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, MercRutaComponent_Conditional_13_For_10_Conditional_9_Template, 2, 0, "mat-icon", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "h4", 51);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "p", 52);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "div", 53);
    \u0275\u0275template(15, MercRutaComponent_Conditional_13_For_10_Conditional_15_Template, 8, 0, "div", 54)(16, MercRutaComponent_Conditional_13_For_10_Conditional_16_Template, 4, 4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const group_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(group_r10.hasVisited ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-100 dark:bg-white/5 text-slate-400");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(group_r10.hasVisited ? "check_circle" : "storefront");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(group_r10.cadena);
    \u0275\u0275advance();
    \u0275\u0275conditional(9, group_r10.latitud && group_r10.longitud ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(group_r10.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(group_r10.direccion);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(15, ctx_r1.activatingPdvId() === group_r10.id_punto ? 15 : 16);
  }
}
function MercRutaComponent_Conditional_13_ForEmpty_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44)(1, "mat-icon", 62);
    \u0275\u0275text(2, "wrong_location");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 63);
    \u0275\u0275text(4, "Esta ruta no tiene PDV activos");
    \u0275\u0275elementEnd()();
  }
}
function MercRutaComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 39)(1, "div", 40)(2, "button", 41);
    \u0275\u0275listener("click", function MercRutaComponent_Conditional_13_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.routeExecuted.set(false));
    });
    \u0275\u0275elementStart(3, "mat-icon", 25);
    \u0275\u0275text(4, "arrow_back");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 26);
    \u0275\u0275text(6, "Resumen");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "span", 42);
    \u0275\u0275text(8, "En Ejecuci\xF3n");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(9, MercRutaComponent_Conditional_13_For_10_Template, 17, 8, "div", 43, _forTrack1, false, MercRutaComponent_Conditional_13_ForEmpty_11_Template, 5, 0, "div", 44);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275repeater(ctx_r1.groupedPdvs());
  }
}
var MercRutaComponent = class _MercRutaComponent {
  constructor() {
    this.api = inject(ApiService);
    this.snack = inject(MatSnackBar);
    this.ui = inject(MercUiService);
    this.loading = signal(true);
    this.activeTab = signal("fija");
    this.rutas = signal([]);
    this.pdvs = signal([]);
    this.selectedRouteId = signal(null);
    this.routeExecuted = signal(false);
    this.map = null;
    this.markers = [];
    this.activatingPdvId = signal(null);
    this.activationGroup = signal(null);
    this.filteredRutas = computed(() => {
      return this.rutas().filter((r) => r.tipo.toLowerCase() === this.activeTab().toLowerCase());
    });
    this.selectedRoute = computed(() => {
      return this.rutas().find((r) => r.id_ruta === this.selectedRouteId());
    });
    this.pdvsOfSelectedRoute = computed(() => {
      return this.pdvs().filter((p) => p.id_ruta === this.selectedRouteId());
    });
    this.groupedPdvs = computed(() => {
      const list = this.pdvsOfSelectedRoute();
      const groups = {};
      list.forEach((p) => {
        if (!groups[p.id_punto]) {
          groups[p.id_punto] = {
            id_punto: p.id_punto,
            nombre: p.nombre,
            cadena: p.cadena,
            direccion: p.direccion,
            latitud: p.latitud,
            longitud: p.longitud,
            clients: [],
            hasVisited: false
          };
        }
        groups[p.id_punto].clients.push({
          id_cliente: p.id_cliente,
          nombre: p.cliente,
          visitado: p.visitado,
          visita_id: p.visita_id
        });
        if (p.visitado)
          groups[p.id_punto].hasVisited = true;
      });
      return Object.values(groups);
    });
  }
  ngOnInit() {
    this.loadData();
  }
  ngOnDestroy() {
    if (this.map)
      this.map.remove();
  }
  loadData() {
    this.loading.set(true);
    this.api.getMercMiRuta().subscribe({
      next: (res) => {
        this.rutas.set(res.rutas || []);
        this.pdvs.set(res.pdvs || []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snack.open("Error al cargar datos", "OK", { duration: 3e3 });
      }
    });
  }
  changeTab(tab) {
    this.activeTab.set(tab);
    this.selectedRouteId.set(null);
    this.routeExecuted.set(false);
  }
  selectRoute(ruta) {
    this.selectedRouteId.set(ruta.id_ruta);
    this.routeExecuted.set(false);
    this.loadRoutePdvs(ruta.id_ruta);
  }
  /** Carga TODOS los PDV de la ruta (sin filtro de día) para que aparezcan al ejecutar. */
  loadRoutePdvs(idRuta) {
    this.api.getMercRutaPdvs(idRuta).subscribe({
      next: (res) => this.pdvs.set(res.pdvs || []),
      error: () => {
      }
    });
  }
  ejecutarRuta() {
    this.routeExecuted.set(true);
  }
  initMap() {
    const el = document.getElementById("merc-map");
    if (!el)
      return;
    if (this.map)
      this.map.remove();
    this.map = new import_maplibre_gl.default.Map({
      container: el,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [-66.9, 10.48],
      zoom: 12
    });
    this.markers = [];
    const bounds = new import_maplibre_gl.default.LngLatBounds();
    let hasPoints = false;
    this.groupedPdvs().forEach((pdv) => {
      if (pdv.latitud && pdv.longitud) {
        hasPoints = true;
        const marker = new import_maplibre_gl.default.Marker({
          color: pdv.hasVisited ? "#10b981" : "#6366f1",
          scale: 0.8
        }).setLngLat([pdv.longitud, pdv.latitud]).setPopup(new import_maplibre_gl.default.Popup({ offset: 25 }).setHTML(`
          <div style="padding:4px">
            <div style="font-weight:900;font-size:11px">${pdv.nombre}</div>
            <div style="font-size:9px;color:#64748b">${pdv.cadena}</div>
          </div>
        `)).addTo(this.map);
        this.markers.push(marker);
        bounds.extend([pdv.longitud, pdv.latitud]);
      }
    });
    if (hasPoints) {
      this.map.fitBounds(bounds, { padding: 40, maxZoom: 15 });
    }
  }
  centerOnUser() {
    if (!navigator.geolocation)
      return;
    navigator.geolocation.getCurrentPosition((pos) => {
      if (this.map) {
        this.map.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 15 });
        new import_maplibre_gl.default.Marker({ color: "#f43f5e", scale: 0.6 }).setLngLat([pos.coords.longitude, pos.coords.latitude]).addTo(this.map);
      }
    });
  }
  triggerActivation(group) {
    if (group.hasVisited) {
      this.activatingPdvId.set(group.id_punto);
      return;
    }
    this.activationGroup.set(group);
    const input = document.querySelector('input[type="file"]');
    if (input)
      input.click();
  }
  onActivationPhoto(event) {
    const file = event.target.files?.[0];
    if (!file)
      return;
    const group = this.activationGroup();
    if (group) {
      this.activatingPdvId.set(group.id_punto);
      this.snack.open("Foto de activaci\xF3n capturada", "OK", { duration: 2e3 });
    }
  }
  iniciar(group, client) {
    if (client.visitado && client.visita_id) {
      this.ui.openVisit({
        id_visita: client.visita_id,
        pdv_nombre: group.nombre,
        id_cliente: client.id_cliente,
        cliente: client.nombre
      });
      return;
    }
    this.api.iniciarVisita({ id_punto: group.id_punto, id_cliente: client.id_cliente }).subscribe({
      next: (res) => {
        this.ui.openVisit({
          id_visita: res.id_visita,
          pdv_nombre: group.nombre,
          id_cliente: client.id_cliente,
          cliente: client.nombre
        });
        this.activatingPdvId.set(null);
        this.activationGroup.set(null);
        this.loadData();
      },
      error: () => this.snack.open("Error al iniciar visita", "OK", { duration: 3e3 })
    });
  }
  static {
    this.\u0275fac = function MercRutaComponent_Factory(t) {
      return new (t || _MercRutaComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MercRutaComponent, selectors: [["app-merc-ruta"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 16, vars: 5, consts: [["cameraInput", ""], [1, "flex", "flex-col", "h-full", "bg-slate-50", "dark:bg-slate-950"], [1, "bg-white", "dark:bg-slate-900", "px-6", "pt-6", "border-b", "border-slate-200", "dark:border-white/5", "shrink-0"], [1, "text-2xl", "font-black", "text-slate-800", "dark:text-white", "tracking-tight", "italic", "uppercase", "mb-4"], [1, "flex", "gap-8"], [1, "pb-3", "text-xs", "font-black", "uppercase", "tracking-widest", "transition-all", 3, "click"], [1, "flex-grow", "overflow-y-auto", "p-6", "space-y-6"], [1, "py-20", "flex", "flex-col", "items-center", "gap-3"], ["type", "file", "accept", "image/*", "capture", "camera", 1, "hidden", 3, "change"], ["diameter", "32"], [1, "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest"], [1, "space-y-3"], [1, "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-[0.2em]", "mb-4"], [1, "bg-white", "dark:bg-slate-900", "p-5", "rounded-[1.5rem]", "border", "border-slate-100", "dark:border-white/5", "shadow-sm", "active:scale-[0.98]", "transition-all", "cursor-pointer"], [1, "py-12", "text-center", "opacity-40", "grayscale", "italic"], [1, "bg-white", "dark:bg-slate-900", "p-5", "rounded-[1.5rem]", "border", "border-slate-100", "dark:border-white/5", "shadow-sm", "active:scale-[0.98]", "transition-all", "cursor-pointer", 3, "click"], [1, "flex", "items-center", "justify-between"], [1, "flex", "items-center", "gap-4"], [1, "w-10", "h-10", "rounded-2xl", "bg-primary-500/10", "text-primary-500", "flex", "items-center", "justify-center"], [1, "font-bold", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-[9px]", "font-black", "text-slate-400", "uppercase", "tracking-widest"], [1, "text-slate-200"], [1, "text-xs", "text-slate-400", "uppercase", "font-black", "tracking-widest"], [1, "space-y-6"], [1, "flex", "items-center", "gap-2", "text-slate-400", "active:scale-95", "transition-all", 3, "click"], [1, "!text-sm"], [1, "text-[10px]", "font-black", "uppercase", "tracking-widest"], [1, "bg-gradient-to-br", "from-primary-600", "to-indigo-700", "p-8", "rounded-[2.5rem]", "text-white", "shadow-xl", "shadow-primary-500/20", "relative", "overflow-hidden"], [1, "relative", "z-10", "space-y-4"], [1, "text-[10px]", "font-black", "uppercase", "tracking-[0.3em]", "opacity-70"], [1, "text-2xl", "font-black", "italic", "uppercase", "tracking-tighter"], [1, "flex", "gap-4"], [1, "flex", "flex-col"], [1, "text-[9px]", "font-black", "uppercase", "opacity-60"], [1, "text-lg", "font-black"], [1, "w-px", "h-8", "bg-white/20", "mt-2"], [1, "text-lg", "font-black", "capitalize"], [1, "w-full", "py-4", "bg-white", "text-primary-600", "rounded-2xl", "font-black", "uppercase", "tracking-widest", "text-xs", "active:scale-95", "transition-all", "shadow-lg", 3, "click"], [1, "absolute", "-top-20", "-right-20", "w-64", "h-64", "bg-white/10", "rounded-full", "blur-3xl"], [1, "space-y-4", "pb-20"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "flex", "items-center", "gap-2", "text-slate-400", 3, "click"], [1, "text-[10px]", "font-black", "text-primary-500", "uppercase", "tracking-widest", "bg-primary-500/10", "px-3", "py-1", "rounded-full"], [1, "bg-white", "dark:bg-slate-900", "rounded-[1.5rem]", "border", "border-slate-100", "dark:border-white/5", "p-5", "shadow-sm", "space-y-4"], [1, "py-16", "text-center", "opacity-50"], [1, "flex", "items-start", "gap-4"], [1, "w-12", "h-12", "rounded-2xl", "flex", "items-center", "justify-center", "shrink-0", "transition-colors"], [1, "flex-grow", "min-w-0"], [1, "flex", "items-center", "gap-2", "mb-0.5"], [1, "text-[10px]", "font-black", "text-primary-500", "uppercase", "tracking-widest", "truncate"], [1, "!text-[10px]", "text-slate-300"], [1, "font-bold", "text-slate-800", "dark:text-white", "truncate", "tracking-tight"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "line-clamp-1", "italic"], [1, "pt-2"], [1, "bg-slate-50", "dark:bg-slate-950", "rounded-2xl", "p-4", "space-y-3", "animate-in", "fade-in", "zoom-in", "duration-200"], [1, "grid", "grid-cols-1", "gap-2"], [1, "w-full", "p-3", "rounded-xl", "border", "border-slate-200", "dark:border-white/5", "bg-white", "dark:bg-slate-900", "text-left", "hover:border-primary-500", "transition-all", "flex", "items-center", "justify-between", "group/btn"], [1, "w-full", "py-2", "text-[9px]", "font-black", "text-slate-400", "uppercase", "tracking-widest", 3, "click"], [1, "w-full", "p-3", "rounded-xl", "border", "border-slate-200", "dark:border-white/5", "bg-white", "dark:bg-slate-900", "text-left", "hover:border-primary-500", "transition-all", "flex", "items-center", "justify-between", "group/btn", 3, "click"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "text-slate-300", "group-hover/btn:text-primary-500", "transition-colors"], [1, "w-full", "py-3", "rounded-xl", "text-xs", "font-black", "uppercase", "tracking-widest", "active:scale-95", "transition-all", "flex", "items-center", "justify-center", "gap-2", 3, "click"], [1, "!text-5xl", "text-slate-300"], [1, "text-xs", "font-black", "text-slate-400", "uppercase", "tracking-widest", "mt-2"]], template: function MercRutaComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "h2", 3);
        \u0275\u0275text(3, "Mi Ruta");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "button", 5);
        \u0275\u0275listener("click", function MercRutaComponent_Template_button_click_5_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.changeTab("fija"));
        });
        \u0275\u0275text(6, " Rutas Fijas ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "button", 5);
        \u0275\u0275listener("click", function MercRutaComponent_Template_button_click_7_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.changeTab("variable"));
        });
        \u0275\u0275text(8, " Rutas Variables ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(9, "div", 6);
        \u0275\u0275template(10, MercRutaComponent_Conditional_10_Template, 4, 0, "div", 7)(11, MercRutaComponent_Conditional_11_Template, 6, 1)(12, MercRutaComponent_Conditional_12_Template, 28, 3)(13, MercRutaComponent_Conditional_13_Template, 12, 1);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "input", 8, 0);
        \u0275\u0275listener("change", function MercRutaComponent_Template_input_change_14_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onActivationPhoto($event));
        });
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(5);
        \u0275\u0275classMap(ctx.activeTab() === "fija" ? "text-primary-500 border-b-4 border-primary-500" : "text-slate-400 border-b-4 border-transparent");
        \u0275\u0275advance(2);
        \u0275\u0275classMap(ctx.activeTab() === "variable" ? "text-primary-500 border-b-4 border-primary-500" : "text-slate-400 border-b-4 border-transparent");
        \u0275\u0275advance(3);
        \u0275\u0275conditional(10, ctx.loading() ? 10 : !ctx.selectedRouteId() ? 11 : !ctx.routeExecuted() ? 12 : 13);
      }
    }, dependencies: [CommonModule, MatIconModule, MatIcon, MatButtonModule, MatProgressSpinnerModule, MatProgressSpinner, MatSnackBarModule], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  height: 100%;\n}\n/*# sourceMappingURL=merc-ruta.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MercRutaComponent, { className: "MercRutaComponent", filePath: "src\\app\\features\\mercaderista\\components\\merc-ruta\\merc-ruta.component.ts", lineNumber: 193 });
})();

// src/app/features/mercaderista/components/merc-visitas/merc-visitas.component.ts
var _forTrack02 = ($index, $item) => $item.id_visita;
function MercVisitasComponent_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r1 = ctx.$implicit;
    \u0275\u0275property("value", c_r1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r1);
  }
}
function MercVisitasComponent_For_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r2 = ctx.$implicit;
    \u0275\u0275property("value", c_r2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r2);
  }
}
function MercVisitasComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275element(1, "mat-spinner", 16);
    \u0275\u0275elementStart(2, "span", 17);
    \u0275\u0275text(3, "Cargando historial...");
    \u0275\u0275elementEnd()();
  }
}
function MercVisitasComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "mat-icon", 19);
    \u0275\u0275text(2, "query_stats");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 20);
    \u0275\u0275text(4, "No se encontraron registros");
    \u0275\u0275elementEnd()();
  }
}
function MercVisitasComponent_Conditional_28_For_2_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33)(1, "div", 36)(2, "div", 37)(3, "mat-icon", 38);
    \u0275\u0275text(4, "photo_library");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " Fotos Enviadas ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 39);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 36)(9, "div", 37)(10, "mat-icon", 38);
    \u0275\u0275text(11, "inventory_2");
    \u0275\u0275elementEnd();
    \u0275\u0275text(12, " SKU Cargados ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 39);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const v_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(v_r4.fotos_count);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(v_r4.balances_count);
  }
}
function MercVisitasComponent_Conditional_28_For_2_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40)(1, "div", 41)(2, "span", 42);
    \u0275\u0275text(3, "\xDAltimo Balance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 43);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "p", 44);
    \u0275\u0275text(7, "Haz clic para ver el detalle de inventario, precios y FIFO registrados.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const v_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", v_r4.balances_count, " productos");
  }
}
function MercVisitasComponent_Conditional_28_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 23)(2, "div", 24)(3, "div", 25)(4, "mat-icon");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 26)(7, "span", 27);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "h4", 28);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 29)(12, "span", 30);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 31);
    \u0275\u0275text(15, "\u2022");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 30);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "date");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(19, "div", 32);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(21, MercVisitasComponent_Conditional_28_For_2_Conditional_21_Template, 15, 2, "div", 33)(22, MercVisitasComponent_Conditional_28_For_2_Conditional_22_Template, 8, 1);
    \u0275\u0275elementStart(23, "button", 34);
    \u0275\u0275listener("click", function MercVisitasComponent_Conditional_28_For_2_Template_button_click_23_listener() {
      const v_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.verDetalle(v_r4));
    });
    \u0275\u0275elementStart(24, "mat-icon", 35);
    \u0275\u0275text(25, "visibility");
    \u0275\u0275elementEnd();
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const v_r4 = ctx.$implicit;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r4.mode() === "visitas" ? "store" : "analytics");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(v_r4.cliente_nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(v_r4.pdv_nombre);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(v_r4.cadena);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(18, 10, v_r4.fecha, "shortDate"));
    \u0275\u0275advance(2);
    \u0275\u0275classMap(v_r4.estado === "Revisada" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", v_r4.estado, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(21, ctx_r4.mode() === "visitas" ? 21 : 22);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r4.mode() === "visitas" ? "Revisar Visita" : "Ver Inventario", " ");
  }
}
function MercVisitasComponent_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275repeaterCreate(1, MercVisitasComponent_Conditional_28_For_2_Template, 27, 13, "div", 22, _forTrack02);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r4.filteredVisitas());
  }
}
var MercVisitasComponent = class _MercVisitasComponent {
  constructor() {
    this.api = inject(ApiService);
    this.ui = inject(MercUiService);
    this.loading = signal(true);
    this.mode = signal("visitas");
    this.visitas = signal([]);
    this.searchQuery = "";
    this.selectedChain = "";
    this.selectedClient = "";
    this.chains = computed(() => [...new Set(this.visitas().map((v) => v.cadena))].filter(Boolean));
    this.clients = computed(() => [...new Set(this.visitas().map((v) => v.cliente_nombre))].filter(Boolean));
    this.filteredVisitas = computed(() => {
      return this.visitas().filter((v) => {
        const matchSearch = !this.searchQuery || v.pdv_nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) || v.cliente_nombre.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchChain = !this.selectedChain || v.cadena === this.selectedChain;
        const matchClient = !this.selectedClient || v.cliente_nombre === this.selectedClient;
        const matchMode = this.mode() === "visitas" ? true : v.balances_count > 0;
        return matchSearch && matchChain && matchClient && matchMode;
      });
    });
  }
  ngOnInit() {
    this.loadVisitas();
  }
  loadVisitas() {
    this.loading.set(true);
    const fi = /* @__PURE__ */ new Date();
    fi.setDate(fi.getDate() - 30);
    this.api.getMercMisVisitas({ fecha_inicio: fi.toISOString().split("T")[0] }).subscribe({
      next: (res) => {
        this.visitas.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  verDetalle(v) {
    this.ui.openVisit({
      id_visita: v.id_visita,
      pdv_nombre: v.pdv_nombre,
      id_cliente: v.id_cliente,
      cliente: v.cliente_nombre
    });
  }
  static {
    this.\u0275fac = function MercVisitasComponent_Factory(t) {
      return new (t || _MercVisitasComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MercVisitasComponent, selectors: [["app-merc-visitas"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 30, vars: 10, consts: [[1, "flex", "flex-col", "h-full", "bg-slate-50", "dark:bg-slate-950"], [1, "p-6", "bg-white", "dark:bg-slate-900", "border-b", "border-slate-100", "dark:border-white/5", "space-y-6"], [1, "flex", "items-center", "justify-between"], [1, "text-2xl", "font-black", "text-slate-800", "dark:text-white", "uppercase", "tracking-tight", "italic"], [1, "flex", "bg-slate-100", "dark:bg-slate-800", "p-1", "rounded-xl"], [1, "px-4", "py-1.5", "rounded-lg", "text-[10px]", "font-black", "uppercase", "tracking-widest", "transition-all", 3, "click"], [1, "grid", "grid-cols-2", "gap-3"], [1, "col-span-2", "relative"], [1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-400", "!text-sm"], ["type", "text", "placeholder", "Buscar PDV o Cliente...", 1, "w-full", "pl-10", "pr-4", "py-3", "bg-slate-50", "dark:bg-slate-950", "border", "border-slate-100", "dark:border-white/5", "rounded-2xl", "text-xs", "focus:ring-2", "focus:ring-primary-500", "outline-none", "transition-all", 3, "ngModelChange", "ngModel"], ["placeholder", "Cadena", 1, "bg-slate-50", "dark:bg-slate-950", "px-4", "py-2.5", "rounded-xl", "border", "border-slate-100", "dark:border-white/5", "text-[10px]", "font-bold", 3, "ngModelChange", "ngModel"], [3, "value"], ["placeholder", "Cliente", 1, "bg-slate-50", "dark:bg-slate-950", "px-4", "py-2.5", "rounded-xl", "border", "border-slate-100", "dark:border-white/5", "text-[10px]", "font-bold", 3, "ngModelChange", "ngModel"], [1, "flex-grow", "overflow-y-auto", "p-6"], [1, "py-20", "flex", "flex-col", "items-center", "gap-3"], [1, "h-20"], ["diameter", "32"], [1, "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest"], [1, "py-20", "text-center", "flex", "flex-col", "items-center", "gap-4", "opacity-30", "grayscale", "italic"], [1, "!text-6xl"], [1, "font-black", "uppercase", "tracking-widest", "text-xs"], [1, "space-y-4"], [1, "bg-white", "dark:bg-slate-900", "rounded-[2rem]", "border", "border-slate-100", "dark:border-white/5", "p-6", "shadow-sm"], [1, "flex", "justify-between", "items-start", "mb-6"], [1, "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "rounded-2xl", "bg-slate-50", "dark:bg-white/5", "flex", "items-center", "justify-center", "text-slate-400"], [1, "flex", "flex-col", "min-w-0"], [1, "text-[10px]", "font-black", "text-primary-500", "uppercase", "tracking-widest", "truncate"], [1, "font-bold", "text-slate-800", "dark:text-white", "truncate", "tracking-tight"], [1, "flex", "items-center", "gap-2", "mt-0.5"], [1, "text-[9px]", "font-black", "text-slate-400", "uppercase", "tracking-widest"], [1, "text-slate-200", "dark:text-white/10"], [1, "px-3", "py-1", "rounded-full", "border", "text-[9px]", "font-black", "uppercase", "tracking-widest"], [1, "grid", "grid-cols-2", "gap-3", "mb-6"], [1, "w-full", "py-3.5", "bg-slate-900", "dark:bg-white/10", "hover:bg-black", "dark:hover:bg-white/20", "text-white", "rounded-2xl", "text-xs", "font-black", "uppercase", "tracking-widest", "shadow-lg", "active:scale-95", "transition-all", "flex", "items-center", "justify-center", "gap-2", 3, "click"], [1, "!text-sm"], [1, "bg-slate-50", "dark:bg-slate-800/40", "p-3", "rounded-2xl", "border", "border-slate-100", "dark:border-white/5"], [1, "flex", "items-center", "gap-2", "text-[9px]", "font-black", "text-slate-400", "uppercase", "mb-1"], [1, "!text-xs"], [1, "text-lg", "font-black", "text-slate-800", "dark:text-white"], [1, "bg-primary-500/5", "dark:bg-primary-500/10", "rounded-2xl", "p-4", "mb-6", "border", "border-primary-500/10"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "text-[10px]", "font-black", "uppercase", "tracking-widest", "text-primary-600", "dark:text-primary-400"], [1, "text-[9px]", "font-bold", "text-slate-400"], [1, "text-xs", "text-slate-600", "dark:text-slate-400", "italic"]], template: function MercVisitasComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h2", 3);
        \u0275\u0275text(4, "Mi Actividad");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "div", 4)(6, "button", 5);
        \u0275\u0275listener("click", function MercVisitasComponent_Template_button_click_6_listener() {
          return ctx.mode.set("visitas");
        });
        \u0275\u0275text(7, " Visitas ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "button", 5);
        \u0275\u0275listener("click", function MercVisitasComponent_Template_button_click_8_listener() {
          return ctx.mode.set("data");
        });
        \u0275\u0275text(9, " Data ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(10, "div", 6)(11, "div", 7)(12, "mat-icon", 8);
        \u0275\u0275text(13, "search");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "input", 9);
        \u0275\u0275twoWayListener("ngModelChange", function MercVisitasComponent_Template_input_ngModelChange_14_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(15, "mat-select", 10);
        \u0275\u0275twoWayListener("ngModelChange", function MercVisitasComponent_Template_mat_select_ngModelChange_15_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.selectedChain, $event) || (ctx.selectedChain = $event);
          return $event;
        });
        \u0275\u0275elementStart(16, "mat-option", 11);
        \u0275\u0275text(17, "Todas las Cadenas");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(18, MercVisitasComponent_For_19_Template, 2, 2, "mat-option", 11, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "mat-select", 12);
        \u0275\u0275twoWayListener("ngModelChange", function MercVisitasComponent_Template_mat_select_ngModelChange_20_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.selectedClient, $event) || (ctx.selectedClient = $event);
          return $event;
        });
        \u0275\u0275elementStart(21, "mat-option", 11);
        \u0275\u0275text(22, "Todos los Clientes");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(23, MercVisitasComponent_For_24_Template, 2, 2, "mat-option", 11, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(25, "div", 13);
        \u0275\u0275template(26, MercVisitasComponent_Conditional_26_Template, 4, 0, "div", 14)(27, MercVisitasComponent_Conditional_27_Template, 5, 0)(28, MercVisitasComponent_Conditional_28_Template, 3, 0);
        \u0275\u0275element(29, "div", 15);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(6);
        \u0275\u0275classMap(ctx.mode() === "visitas" ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm" : "text-slate-400");
        \u0275\u0275advance(2);
        \u0275\u0275classMap(ctx.mode() === "data" ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm" : "text-slate-400");
        \u0275\u0275advance(6);
        \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
        \u0275\u0275advance();
        \u0275\u0275twoWayProperty("ngModel", ctx.selectedChain);
        \u0275\u0275advance();
        \u0275\u0275property("value", "");
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.chains());
        \u0275\u0275advance(2);
        \u0275\u0275twoWayProperty("ngModel", ctx.selectedClient);
        \u0275\u0275advance();
        \u0275\u0275property("value", "");
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.clients());
        \u0275\u0275advance(3);
        \u0275\u0275conditional(26, ctx.loading() ? 26 : ctx.filteredVisitas().length === 0 ? 27 : 28);
      }
    }, dependencies: [
      CommonModule,
      DatePipe,
      FormsModule,
      DefaultValueAccessor,
      NgControlStatus,
      NgModel,
      MatIconModule,
      MatIcon,
      MatButtonModule,
      MatProgressSpinnerModule,
      MatProgressSpinner,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatSelect,
      MatOption
    ], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  height: 100%;\n}\n  .mat-mdc-select-value {\n  font-size: 10px !important;\n  font-weight: 800 !important;\n  text-transform: uppercase !important;\n  letter-spacing: 0.1em !important;\n}\n/*# sourceMappingURL=merc-visitas.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MercVisitasComponent, { className: "MercVisitasComponent", filePath: "src\\app\\features\\mercaderista\\components\\merc-visitas\\merc-visitas.component.ts", lineNumber: 150 });
})();

// src/app/features/mercaderista/services/merc-socket.service.ts
var MercSocketService = class _MercSocketService {
  constructor(http) {
    this.http = http;
    this._messages$ = new Subject();
    this.messages$ = this._messages$.asObservable();
    this._currentVisitId = null;
    this._destroy$ = new Subject();
    this._stopPolling$ = new Subject();
    this._lastMsgCount = 0;
  }
  /** Conectar al chat de una visita (poll cada 8s) */
  joinChat(visitaId) {
    this._currentVisitId = visitaId;
    this._stopPolling$.next();
    return interval(8e3).pipe(startWith(0), takeUntil(this._stopPolling$), switchMap(() => this.http.get(`/api/chat/visit/${visitaId}/messages`)));
  }
  leaveChat() {
    this._currentVisitId = null;
    this._stopPolling$.next();
  }
  sendMessage(visitaId, mensaje, senderNombre) {
    return this.http.post("/api/chat/send", {
      visita_id: visitaId,
      mensaje,
      sender_nombre: senderNombre
    });
  }
  getInbox() {
    return this.http.get("/api/merc/chat/inbox");
  }
  ngOnDestroy() {
    this._destroy$.next();
    this._stopPolling$.next();
  }
  static {
    this.\u0275fac = function MercSocketService_Factory(t) {
      return new (t || _MercSocketService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MercSocketService, factory: _MercSocketService.\u0275fac, providedIn: "root" });
  }
};

// src/app/features/mercaderista/components/merc-chat/merc-chat.component.ts
var _forTrack03 = ($index, $item) => $item.id_visita;
function MercChatComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275element(1, "mat-spinner", 10);
    \u0275\u0275elementStart(2, "span", 11);
    \u0275\u0275text(3, "Sincronizando mensajes...");
    \u0275\u0275elementEnd()();
  }
}
function MercChatComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 13)(2, "mat-icon", 14);
    \u0275\u0275text(3, "chat_bubble_outline");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 15)(5, "p", 16);
    \u0275\u0275text(6, "Sin conversaciones activas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 17);
    \u0275\u0275text(8, "Inicia una visita para chatear");
    \u0275\u0275elementEnd()()();
  }
}
function MercChatComponent_Conditional_14_For_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", c_r2.no_leidos, " ");
  }
}
function MercChatComponent_Conditional_14_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275listener("click", function MercChatComponent_Conditional_14_For_2_Template_div_click_0_listener() {
      const c_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openChat(c_r2));
    });
    \u0275\u0275elementStart(1, "div", 5)(2, "div", 21)(3, "mat-icon", 22);
    \u0275\u0275text(4, "chat");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(5, MercChatComponent_Conditional_14_For_2_Conditional_5_Template, 2, 1, "div", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 24)(7, "div", 25)(8, "h4", 26);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 27);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 28)(14, "span", 29);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "p", 30);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "mat-icon", 31);
    \u0275\u0275text(19, "chevron_right");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r2 = ctx.$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275conditional(5, c_r2.no_leidos > 0 ? 5 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(c_r2.pdv_nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(12, 5, c_r2.ultimo_at, "HH:mm"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(c_r2.cliente);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r2.ultimo_msg || "Sin mensajes a\xFAn");
  }
}
function MercChatComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275repeaterCreate(1, MercChatComponent_Conditional_14_For_2_Template, 20, 8, "div", 19, _forTrack03);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.conversations());
  }
}
var MercChatComponent = class _MercChatComponent {
  constructor() {
    this.socket = inject(MercSocketService);
    this.ui = inject(MercUiService);
    this.loading = signal(true);
    this.conversations = signal([]);
  }
  ngOnInit() {
    this.loadInbox();
  }
  loadInbox() {
    this.loading.set(true);
    this.socket.getInbox().subscribe({
      next: (res) => {
        this.conversations.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  openChat(c) {
    this.ui.openVisit({
      id_visita: c.id_visita,
      pdv_nombre: c.pdv_nombre,
      id_cliente: c.id_cliente,
      cliente: c.cliente
    });
  }
  static {
    this.\u0275fac = function MercChatComponent_Factory(t) {
      return new (t || _MercChatComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MercChatComponent, selectors: [["app-merc-chat"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 15, vars: 1, consts: [[1, "flex", "flex-col", "h-full", "bg-white", "dark:bg-slate-950"], [1, "p-6", "pb-2"], [1, "text-2xl", "font-black", "text-slate-800", "dark:text-white", "tracking-tight", "italic", "uppercase"], [1, "text-xs", "text-slate-500", "dark:text-slate-400"], [1, "px-6", "py-4"], [1, "relative"], [1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "!text-slate-400"], ["type", "text", "placeholder", "Buscar por PDV o Cliente...", 1, "w-full", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-100", "dark:border-white/5", "rounded-2xl", "pl-10", "pr-4", "py-2.5", "text-xs", "font-bold", "outline-none", "focus:ring-2", "focus:ring-primary-500", "transition-all"], [1, "flex-grow", "overflow-y-auto", "px-4", "pb-10"], [1, "py-20", "flex", "flex-col", "items-center", "gap-3"], ["diameter", "32"], [1, "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest"], [1, "py-20", "text-center", "flex", "flex-col", "items-center", "gap-4", "opacity-40", "grayscale"], [1, "w-20", "h-20", "rounded-full", "bg-slate-100", "dark:bg-white/5", "flex", "items-center", "justify-center"], [1, "!text-4xl", "text-slate-400"], [1, "space-y-1"], [1, "font-bold", "text-slate-600", "dark:text-slate-400"], [1, "text-[10px]", "uppercase", "tracking-widest", "text-slate-400"], [1, "space-y-2"], [1, "group", "flex", "items-center", "gap-4", "p-4", "rounded-3xl", "hover:bg-slate-50", "dark:hover:bg-white/5", "transition-all", "cursor-pointer", "active:scale-95", "border", "border-transparent", "hover:border-slate-100", "dark:hover:border-white/5"], [1, "group", "flex", "items-center", "gap-4", "p-4", "rounded-3xl", "hover:bg-slate-50", "dark:hover:bg-white/5", "transition-all", "cursor-pointer", "active:scale-95", "border", "border-transparent", "hover:border-slate-100", "dark:hover:border-white/5", 3, "click"], [1, "w-14", "h-14", "rounded-[1.25rem]", "bg-gradient-to-br", "from-primary-500", "to-indigo-600", "flex", "items-center", "justify-center", "text-white", "shadow-lg", "shadow-primary-500/20"], [1, "!text-2xl"], [1, "absolute", "-top-1", "-right-1", "w-6", "h-6", "bg-rose-500", "text-white", "rounded-full", "border-4", "border-white", "dark:border-slate-950", "flex", "items-center", "justify-center", "text-[9px]", "font-black"], [1, "flex-grow", "min-w-0"], [1, "flex", "items-center", "justify-between", "mb-0.5"], [1, "font-bold", "text-slate-800", "dark:text-white", "truncate", "tracking-tight"], [1, "text-[9px]", "font-bold", "text-slate-400"], [1, "flex", "flex-col"], [1, "text-[9px]", "font-black", "text-primary-500", "uppercase", "tracking-widest", "mb-0.5"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "line-clamp-1", "italic"], [1, "text-slate-200", "group-hover:text-primary-500", "transition-colors", "!text-lg"]], template: function MercChatComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h2", 2);
        \u0275\u0275text(3, "Mensajer\xEDa");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "p", 3);
        \u0275\u0275text(5, "Conversaciones con analistas y clientes");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "mat-icon", 6);
        \u0275\u0275text(9, "search");
        \u0275\u0275elementEnd();
        \u0275\u0275element(10, "input", 7);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(11, "div", 8);
        \u0275\u0275template(12, MercChatComponent_Conditional_12_Template, 4, 0, "div", 9)(13, MercChatComponent_Conditional_13_Template, 9, 0)(14, MercChatComponent_Conditional_14_Template, 3, 0);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(12);
        \u0275\u0275conditional(12, ctx.loading() ? 12 : ctx.conversations().length === 0 ? 13 : 14);
      }
    }, dependencies: [CommonModule, DatePipe, MatIconModule, MatIcon, MatButtonModule, MatBadgeModule, MatProgressSpinnerModule, MatProgressSpinner], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  height: 100%;\n}\n/*# sourceMappingURL=merc-chat.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MercChatComponent, { className: "MercChatComponent", filePath: "src\\app\\features\\mercaderista\\components\\merc-chat\\merc-chat.component.ts", lineNumber: 88 });
})();

// src/app/features/mercaderista/services/offline-queue.service.ts
var DB_NAME = "mercaderista_offline_db";
var DB_VERSION = 1;
var STORE_FOTOS = "pending_photos";
var OfflineQueueService = class _OfflineQueueService {
  constructor(http) {
    this.http = http;
    this.db = null;
    this._pendingCount = new BehaviorSubject(0);
    this.pendingCount$ = this._pendingCount.asObservable();
    this.isOnline$ = merge(of(navigator.onLine), fromEvent(window, "online").pipe(map(() => true)), fromEvent(window, "offline").pipe(map(() => false)));
    this.initDB();
    fromEvent(window, "online").subscribe(() => this.syncQueue());
  }
  initDB() {
    return __async(this, null, function* () {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_FOTOS)) {
            db.createObjectStore(STORE_FOTOS, { keyPath: "id" });
          }
        };
        req.onsuccess = (e) => {
          this.db = e.target.result;
          this.refreshCount();
          resolve();
        };
        req.onerror = () => reject(req.error);
      });
    });
  }
  /** Encola una foto para subir */
  enqueuePhoto(visitaId, tipoFoto, file) {
    return __async(this, null, function* () {
      const photo = {
        id: crypto.randomUUID(),
        visitaId,
        tipoFoto,
        file,
        fileName: file.name,
        timestamp: Date.now(),
        status: "pending"
      };
      yield this.dbPut(photo);
      this.refreshCount();
      if (navigator.onLine) {
        this.uploadPhoto(photo);
      }
      return photo.id;
    });
  }
  /** Sube todos los pendientes */
  syncQueue() {
    return __async(this, null, function* () {
      if (!navigator.onLine)
        return;
      const photos = yield this.getPendingPhotos();
      for (const photo of photos) {
        if (photo.status === "pending" || photo.status === "error") {
          yield this.uploadPhoto(photo);
        }
      }
    });
  }
  uploadPhoto(photo) {
    return __async(this, null, function* () {
      yield this.dbUpdateStatus(photo.id, "uploading");
      const fd = new FormData();
      fd.append("visita_id", String(photo.visitaId));
      fd.append("tipo_foto", photo.tipoFoto);
      fd.append("file", photo.file, photo.fileName);
      try {
        yield this.http.post("/api/merc/fotos/upload", fd).toPromise();
        yield this.dbDelete(photo.id);
        this.refreshCount();
      } catch (err) {
        yield this.dbUpdateStatus(photo.id, "error");
      }
    });
  }
  getPendingPhotos() {
    return __async(this, null, function* () {
      return new Promise((resolve) => {
        if (!this.db)
          return resolve([]);
        const tx = this.db.transaction(STORE_FOTOS, "readonly");
        const req = tx.objectStore(STORE_FOTOS).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    });
  }
  refreshCount() {
    return __async(this, null, function* () {
      const photos = yield this.getPendingPhotos();
      this._pendingCount.next(photos.filter((p) => p.status !== "done").length);
    });
  }
  dbPut(photo) {
    return new Promise((resolve, reject) => {
      if (!this.db)
        return resolve();
      const tx = this.db.transaction(STORE_FOTOS, "readwrite");
      const req = tx.objectStore(STORE_FOTOS).put(photo);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
  dbDelete(id) {
    return new Promise((resolve, reject) => {
      if (!this.db)
        return resolve();
      const tx = this.db.transaction(STORE_FOTOS, "readwrite");
      const req = tx.objectStore(STORE_FOTOS).delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
  dbUpdateStatus(id, status) {
    return new Promise((resolve) => __async(this, null, function* () {
      const all = yield this.getPendingPhotos();
      const photo = all.find((p) => p.id === id);
      if (photo) {
        photo.status = status;
        yield this.dbPut(photo);
      }
      resolve();
    }));
  }
  static {
    this.\u0275fac = function OfflineQueueService_Factory(t) {
      return new (t || _OfflineQueueService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _OfflineQueueService, factory: _OfflineQueueService.\u0275fac, providedIn: "root" });
  }
};

// src/app/features/mercaderista/components/merc-perfil/merc-perfil.component.ts
function MercPerfilComponent_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 22);
  }
}
var MercPerfilComponent = class _MercPerfilComponent {
  constructor() {
    this.api = inject(ApiService);
    this.auth = inject(AuthService);
    this.offline = inject(OfflineQueueService);
    this.perfil = signal(null);
    this.pendingCount = signal(0);
    this.isOnline = signal(navigator.onLine);
    this.syncing = signal(false);
  }
  ngOnInit() {
    this.api.getMercMiPerfil().subscribe({
      next: (res) => this.perfil.set(res),
      error: () => {
      }
    });
    this.offline.pendingCount$.subscribe((v) => this.pendingCount.set(v));
    this.offline.isOnline$.subscribe((v) => this.isOnline.set(v));
  }
  syncNow() {
    return __async(this, null, function* () {
      this.syncing.set(true);
      yield this.offline.syncQueue();
      this.syncing.set(false);
    });
  }
  logout() {
    this.auth.logout();
  }
  static {
    this.\u0275fac = function MercPerfilComponent_Factory(t) {
      return new (t || _MercPerfilComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MercPerfilComponent, selectors: [["app-merc-perfil"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 60, vars: 6, consts: [[1, "p-6", "space-y-8", "pb-20"], [1, "flex", "flex-col", "items-center", "text-center", "space-y-4", "py-4"], [1, "relative"], [1, "w-24", "h-24", "rounded-[2.5rem]", "bg-slate-200", "dark:bg-white/5", "flex", "items-center", "justify-center", "text-slate-400", "border-4", "border-white", "dark:border-slate-900", "shadow-xl"], [1, "!text-5xl"], [1, "absolute", "-bottom-1", "-right-1", "w-8", "h-8", "rounded-2xl", "bg-emerald-500", "border-4", "border-white", "dark:border-slate-900", "flex", "items-center", "justify-center", "text-white"], [1, "!text-sm"], [1, "text-2xl", "font-black", "text-slate-800", "dark:text-white", "tracking-tight", "uppercase", "italic"], [1, "text-xs", "font-black", "text-primary-500", "uppercase", "tracking-[0.2em]", "opacity-80"], [1, "grid", "grid-cols-1", "gap-3"], [1, "bg-white", "dark:bg-slate-900", "p-5", "rounded-3xl", "border", "border-slate-100", "dark:border-white/5", "shadow-sm", "flex", "items-center", "gap-4"], [1, "w-10", "h-10", "rounded-2xl", "bg-slate-50", "dark:bg-white/5", "flex", "items-center", "justify-center", "text-slate-400"], [1, "flex", "flex-col"], [1, "text-[9px]", "font-black", "text-slate-400", "uppercase", "tracking-widest"], [1, "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "flex", "flex-col", "min-w-0"], [1, "font-bold", "text-slate-700", "dark:text-slate-200", "truncate"], [1, "bg-indigo-600/5", "dark:bg-indigo-500/5", "rounded-[2rem]", "p-6", "border", "border-indigo-500/10", "space-y-4"], [1, "flex", "items-center", "justify-between"], [1, "flex", "items-center", "gap-2"], [1, "text-indigo-500"], [1, "font-bold", "text-slate-800", "dark:text-white", "text-sm"], ["diameter", "16", "strokeWidth", "3"], [1, "flex", "items-center", "justify-between", "p-4", "bg-white", "dark:bg-slate-900/50", "rounded-2xl", "border", "border-indigo-500/5", "shadow-sm"], [1, "text-xl", "font-black", "text-slate-800", "dark:text-white"], [1, "px-4", "py-2", "bg-indigo-600", "text-white", "rounded-xl", "text-[10px]", "font-black", "uppercase", "tracking-widest", "disabled:opacity-30", "active:scale-95", "transition-all", 3, "click", "disabled"], [1, "text-[9px]", "text-slate-400", "italic", "text-center", "px-4"], [1, "w-full", "flex", "items-center", "justify-center", "gap-3", "py-4", "rounded-[2rem]", "bg-rose-500/10", "text-rose-500", "border", "border-rose-500/10", "font-black", "uppercase", "tracking-widest", "text-xs", "hover:bg-rose-500", "hover:text-white", "transition-all", "active:scale-95", 3, "click"], [1, "text-center", "space-y-1", "py-4"], [1, "text-[10px]", "font-black", "text-slate-300", "dark:text-slate-700", "uppercase", "tracking-[0.3em]"], [1, "text-[8px]", "text-slate-400"]], template: function MercPerfilComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "mat-icon", 4);
        \u0275\u0275text(5, "account_circle");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(6, "div", 5)(7, "mat-icon", 6);
        \u0275\u0275text(8, "verified");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(9, "div")(10, "h2", 7);
        \u0275\u0275text(11);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "p", 8);
        \u0275\u0275text(13, "Mercaderista Autorizado");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(14, "div", 9)(15, "div", 10)(16, "div", 11)(17, "mat-icon");
        \u0275\u0275text(18, "badge");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(19, "div", 12)(20, "span", 13);
        \u0275\u0275text(21, "C\xE9dula");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(22, "span", 14);
        \u0275\u0275text(23);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(24, "div", 10)(25, "div", 11)(26, "mat-icon");
        \u0275\u0275text(27, "email");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(28, "div", 15)(29, "span", 13);
        \u0275\u0275text(30, "Contacto");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(31, "span", 16);
        \u0275\u0275text(32);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(33, "div", 17)(34, "div", 18)(35, "div", 19)(36, "mat-icon", 20);
        \u0275\u0275text(37, "cloud_sync");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(38, "h3", 21);
        \u0275\u0275text(39, "Estado de Sincronizaci\xF3n");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(40, MercPerfilComponent_Conditional_40_Template, 1, 0, "mat-spinner", 22);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(41, "div", 23)(42, "div", 12)(43, "span", 13);
        \u0275\u0275text(44, "Fotos Pendientes");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(45, "span", 24);
        \u0275\u0275text(46);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(47, "button", 25);
        \u0275\u0275listener("click", function MercPerfilComponent_Template_button_click_47_listener() {
          return ctx.syncNow();
        });
        \u0275\u0275text(48, " Sincronizar ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(49, "p", 26);
        \u0275\u0275text(50, " Las fotos tomadas sin conexi\xF3n se guardan en tu dispositivo y se subir\xE1n autom\xE1ticamente al recuperar la se\xF1al. ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(51, "button", 27);
        \u0275\u0275listener("click", function MercPerfilComponent_Template_button_click_51_listener() {
          return ctx.logout();
        });
        \u0275\u0275elementStart(52, "mat-icon");
        \u0275\u0275text(53, "logout");
        \u0275\u0275elementEnd();
        \u0275\u0275text(54, " Cerrar Sesi\xF3n ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(55, "div", 28)(56, "p", 29);
        \u0275\u0275text(57, "AstroWeb V2.0");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(58, "p", 30);
        \u0275\u0275text(59, "Desarrollado por Antigravity");
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        let tmp_0_0;
        let tmp_1_0;
        let tmp_2_0;
        \u0275\u0275advance(11);
        \u0275\u0275textInterpolate(((tmp_0_0 = ctx.perfil()) == null ? null : tmp_0_0.nombre) || "Cargando...");
        \u0275\u0275advance(12);
        \u0275\u0275textInterpolate((tmp_1_0 = ctx.perfil()) == null ? null : tmp_1_0.cedula);
        \u0275\u0275advance(9);
        \u0275\u0275textInterpolate(((tmp_2_0 = ctx.perfil()) == null ? null : tmp_2_0.email) || "N/A");
        \u0275\u0275advance(8);
        \u0275\u0275conditional(40, ctx.syncing() ? 40 : -1);
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate(ctx.pendingCount());
        \u0275\u0275advance();
        \u0275\u0275property("disabled", ctx.pendingCount() === 0 || ctx.syncing() || !ctx.isOnline());
      }
    }, dependencies: [CommonModule, MatIconModule, MatIcon, MatButtonModule, MatDividerModule, MatProgressSpinnerModule, MatProgressSpinner], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=merc-perfil.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MercPerfilComponent, { className: "MercPerfilComponent", filePath: "src\\app\\features\\mercaderista\\components\\merc-perfil\\merc-perfil.component.ts", lineNumber: 99 });
})();

// src/app/features/mercaderista/components/merc-visit-panel/components/photo-grid/photo-grid.component.ts
var _forTrack04 = ($index, $item) => $item.codigo;
var _forTrack12 = ($index, $item) => $item.id_foto;
function PhotoGridComponent_For_2_Conditional_9_For_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 19);
    \u0275\u0275text(1, "RECHAZADA");
    \u0275\u0275elementEnd();
  }
}
function PhotoGridComponent_For_2_Conditional_9_For_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 20);
    \u0275\u0275text(1, "APROBADA");
    \u0275\u0275elementEnd();
  }
}
function PhotoGridComponent_For_2_Conditional_9_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275element(1, "img", 16);
    \u0275\u0275elementStart(2, "button", 17);
    \u0275\u0275listener("click", function PhotoGridComponent_For_2_Conditional_9_For_2_Template_button_click_2_listener() {
      const f_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const tipo_r4 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.deleteFoto(tipo_r4, f_r3));
    });
    \u0275\u0275elementStart(3, "mat-icon", 18);
    \u0275\u0275text(4, "close");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(5, PhotoGridComponent_For_2_Conditional_9_For_2_Conditional_5_Template, 2, 0, "span", 19)(6, PhotoGridComponent_For_2_Conditional_9_For_2_Conditional_6_Template, 2, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", f_r3.url, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(5, f_r3.estado === "Rechazada" ? 5 : f_r3.estado === "Aprobada" ? 6 : -1);
  }
}
function PhotoGridComponent_For_2_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275repeaterCreate(1, PhotoGridComponent_For_2_Conditional_9_For_2_Template, 7, 2, "div", 15, _forTrack12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tipo_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(tipo_r4.fotos);
  }
}
function PhotoGridComponent_For_2_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 21);
    \u0275\u0275listener("click", function PhotoGridComponent_For_2_Conditional_15_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const tipo_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.pick(tipo_r4, "gal"));
    });
    \u0275\u0275elementStart(1, "mat-icon", 10);
    \u0275\u0275text(2, "photo_library");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Galer\xEDa ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tipo_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r4.isUploading(tipo_r4.codigo));
  }
}
function PhotoGridComponent_For_2_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275element(1, "mat-spinner", 22);
    \u0275\u0275elementStart(2, "span", 23);
    \u0275\u0275text(3, "Subiendo...");
    \u0275\u0275elementEnd()();
  }
}
function PhotoGridComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "span", 4);
    \u0275\u0275text(4, "Tipo de Foto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h4", 5);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "span", 6);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(9, PhotoGridComponent_For_2_Conditional_9_Template, 3, 0, "div", 7);
    \u0275\u0275elementStart(10, "div", 8)(11, "button", 9);
    \u0275\u0275listener("click", function PhotoGridComponent_For_2_Template_button_click_11_listener() {
      const tipo_r4 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.pick(tipo_r4, "cam"));
    });
    \u0275\u0275elementStart(12, "mat-icon", 10);
    \u0275\u0275text(13, "photo_camera");
    \u0275\u0275elementEnd();
    \u0275\u0275text(14, " C\xE1mara ");
    \u0275\u0275elementEnd();
    \u0275\u0275template(15, PhotoGridComponent_For_2_Conditional_15_Template, 4, 1, "button", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275template(16, PhotoGridComponent_For_2_Conditional_16_Template, 4, 0, "div", 12);
    \u0275\u0275elementStart(17, "input", 13);
    \u0275\u0275listener("change", function PhotoGridComponent_For_2_Template_input_change_17_listener($event) {
      const tipo_r4 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.onFiles($event, tipo_r4));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "input", 14);
    \u0275\u0275listener("change", function PhotoGridComponent_For_2_Template_input_change_18_listener($event) {
      const tipo_r4 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.onFiles($event, tipo_r4));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const tipo_r4 = ctx.$implicit;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", tipo_r4.fotos.length > 0 ? "border-emerald-400 dark:border-emerald-500/40" : "border-slate-100 dark:border-white/5");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(tipo_r4.label);
    \u0275\u0275advance();
    \u0275\u0275classMap(tipo_r4.fotos.length > 0 ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400" : "bg-slate-100 dark:bg-white/5 text-slate-400");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", tipo_r4.fotos.length, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(9, tipo_r4.fotos.length > 0 ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r4.isUploading(tipo_r4.codigo));
    \u0275\u0275advance(4);
    \u0275\u0275conditional(15, !tipo_r4.solo_camara ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(16, ctx_r4.isUploading(tipo_r4.codigo) ? 16 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("id", "cam-" + tipo_r4.codigo);
    \u0275\u0275advance();
    \u0275\u0275property("id", "gal-" + tipo_r4.codigo);
  }
}
var PhotoGridComponent = class _PhotoGridComponent {
  constructor() {
    this.api = inject(ApiService);
    this.offline = inject(OfflineQueueService);
    this.snack = inject(MatSnackBar);
    this.tipos = signal([]);
    this.uploading = signal(/* @__PURE__ */ new Set());
  }
  ngOnInit() {
    this.loadFotos();
  }
  loadFotos() {
    this.api.getFotosVisita(this.visitaId).subscribe((res) => {
      this.tipos.set((res.tipos || []).map((t) => __spreadProps(__spreadValues({}, t), { fotos: t.fotos || [] })));
    });
  }
  pick(tipo, source) {
    const input = document.getElementById((source === "cam" ? "cam-" : "gal-") + tipo.codigo);
    input?.click();
  }
  isUploading(codigo) {
    return this.uploading().has(codigo);
  }
  onFiles(event, tipo) {
    return __async(this, null, function* () {
      const input = event.target;
      const files = Array.from(input.files || []);
      input.value = "";
      if (!files.length)
        return;
      this.uploading.update((s) => {
        s.add(tipo.codigo);
        return new Set(s);
      });
      try {
        for (const file of files) {
          yield this.offline.enqueuePhoto(this.visitaId, tipo.codigo, file);
        }
      } finally {
        setTimeout(() => {
          this.uploading.update((s) => {
            s.delete(tipo.codigo);
            return new Set(s);
          });
          this.loadFotos();
        }, 900);
      }
    });
  }
  deleteFoto(tipo, foto) {
    if (!confirm("\xBFEliminar esta foto?"))
      return;
    this.tipos.update((list) => list.map((t) => t.codigo === tipo.codigo ? __spreadProps(__spreadValues({}, t), { fotos: t.fotos.filter((f) => f.id_foto !== foto.id_foto) }) : t));
    this.api.deleteMercFoto(foto.id_foto).subscribe({
      next: () => this.snack.open("Foto eliminada", "OK", { duration: 1500 }),
      error: () => {
        this.snack.open("No se pudo eliminar", "OK", { duration: 2500 });
        this.loadFotos();
      }
    });
  }
  static {
    this.\u0275fac = function PhotoGridComponent_Factory(t) {
      return new (t || _PhotoGridComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PhotoGridComponent, selectors: [["app-photo-grid"]], inputs: { visitaId: "visitaId" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 3, vars: 0, consts: [[1, "grid", "grid-cols-1", "sm:grid-cols-2", "gap-4"], [1, "bg-white", "dark:bg-slate-900", "border", "rounded-3xl", "p-4", "shadow-sm", "flex", "flex-col", "gap-3", "transition-all", 3, "ngClass"], [1, "flex", "items-start", "justify-between", "gap-2"], [1, "flex", "flex-col"], [1, "text-[8px]", "font-black", "text-slate-400", "uppercase", "tracking-widest", "mb-0.5"], [1, "text-[12px]", "font-black", "text-slate-700", "dark:text-slate-100", "leading-tight"], [1, "shrink-0", "text-[10px]", "font-black", "px-2", "py-0.5", "rounded-full"], [1, "grid", "grid-cols-3", "gap-2"], [1, "flex", "gap-2", "mt-auto"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-1.5", "py-2.5", "rounded-xl", "bg-primary-600", "hover:bg-primary-500", "disabled:opacity-50", "text-white", "text-[10px]", "font-black", "uppercase", "tracking-widest", "active:scale-95", "transition-all", 3, "click", "disabled"], [1, "!text-sm"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-1.5", "py-2.5", "rounded-xl", "bg-slate-100", "dark:bg-white/5", "hover:bg-slate-200", "dark:hover:bg-white/10", "disabled:opacity-50", "text-slate-600", "dark:text-slate-300", "text-[10px]", "font-black", "uppercase", "tracking-widest", "active:scale-95", "transition-all", 3, "disabled"], [1, "flex", "items-center", "justify-center", "gap-2", "text-primary-500"], ["type", "file", "accept", "image/*", "capture", "environment", 1, "hidden", 3, "change", "id"], ["type", "file", "accept", "image/*", "multiple", "", 1, "hidden", 3, "change", "id"], [1, "relative", "aspect-square", "rounded-xl", "overflow-hidden", "bg-slate-100", "dark:bg-slate-950", "group"], ["loading", "lazy", "decoding", "async", "onerror", "this.style.opacity=0.2", 1, "w-full", "h-full", "object-cover", 3, "src"], [1, "absolute", "top-1", "right-1", "w-6", "h-6", "rounded-lg", "bg-rose-600/90", "hover:bg-rose-600", "text-white", "flex", "items-center", "justify-center", "opacity-0", "group-hover:opacity-100", "transition-opacity", 3, "click"], [1, "!text-[14px]", "!w-[14px]", "!h-[14px]"], [1, "absolute", "bottom-0", "inset-x-0", "bg-rose-600", "text-white", "text-[7px]", "font-black", "text-center", "py-0.5"], [1, "absolute", "bottom-0", "inset-x-0", "bg-emerald-600", "text-white", "text-[7px]", "font-black", "text-center", "py-0.5"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-1.5", "py-2.5", "rounded-xl", "bg-slate-100", "dark:bg-white/5", "hover:bg-slate-200", "dark:hover:bg-white/10", "disabled:opacity-50", "text-slate-600", "dark:text-slate-300", "text-[10px]", "font-black", "uppercase", "tracking-widest", "active:scale-95", "transition-all", 3, "click", "disabled"], ["diameter", "16"], [1, "text-[9px]", "font-black", "uppercase", "tracking-widest"]], template: function PhotoGridComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275repeaterCreate(1, PhotoGridComponent_For_2_Template, 19, 11, "div", 1, _forTrack04);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.tipos());
      }
    }, dependencies: [CommonModule, NgClass, MatIconModule, MatIcon, MatProgressSpinnerModule, MatProgressSpinner], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=photo-grid.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PhotoGridComponent, { className: "PhotoGridComponent", filePath: "src\\app\\features\\mercaderista\\components\\merc-visit-panel\\components\\photo-grid\\photo-grid.component.ts", lineNumber: 81 });
})();

// src/app/features/mercaderista/components/merc-visit-panel/components/balance-form/balance-form.component.ts
var _forTrack05 = ($index, $item) => $item.id;
function BalanceFormComponent_Conditional_11_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275listener("click", function BalanceFormComponent_Conditional_11_For_2_Template_div_click_0_listener() {
      const p_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.addProduct(p_r2));
    });
    \u0275\u0275elementStart(1, "span", 18);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 19);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r2.sku);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", p_r2.fabricante, " | ", p_r2.categoria, "");
  }
}
function BalanceFormComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275repeaterCreate(1, BalanceFormComponent_Conditional_11_For_2_Template, 5, 3, "div", 16, _forTrack05);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.filteredProducts());
  }
}
function BalanceFormComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "mat-icon", 20);
    \u0275\u0275text(2, "inventory_2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 21);
    \u0275\u0275text(4, "Busca y agrega productos de este cliente");
    \u0275\u0275elementEnd()();
  }
}
function BalanceFormComponent_Conditional_16_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 23)(2, "div", 24)(3, "span", 25);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h5", 26);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 27);
    \u0275\u0275listener("click", function BalanceFormComponent_Conditional_16_For_1_Template_button_click_7_listener() {
      const p_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.removeProduct(p_r5.id));
    });
    \u0275\u0275elementStart(8, "mat-icon", 28);
    \u0275\u0275text(9, "delete");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 29)(11, "div", 30)(12, "label", 31);
    \u0275\u0275text(13, "Inv. Inicial");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "input", 32);
    \u0275\u0275twoWayListener("ngModelChange", function BalanceFormComponent_Conditional_16_For_1_Template_input_ngModelChange_14_listener($event) {
      const p_r5 = \u0275\u0275restoreView(_r4).$implicit;
      \u0275\u0275twoWayBindingSet(p_r5.inv_inicial, $event) || (p_r5.inv_inicial = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 30)(16, "label", 31);
    \u0275\u0275text(17, "Inv. Final");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "input", 32);
    \u0275\u0275twoWayListener("ngModelChange", function BalanceFormComponent_Conditional_16_For_1_Template_input_ngModelChange_18_listener($event) {
      const p_r5 = \u0275\u0275restoreView(_r4).$implicit;
      \u0275\u0275twoWayBindingSet(p_r5.inv_final, $event) || (p_r5.inv_final = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 30)(20, "label", 31);
    \u0275\u0275text(21, "Caras");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "input", 32);
    \u0275\u0275twoWayListener("ngModelChange", function BalanceFormComponent_Conditional_16_For_1_Template_input_ngModelChange_22_listener($event) {
      const p_r5 = \u0275\u0275restoreView(_r4).$implicit;
      \u0275\u0275twoWayBindingSet(p_r5.caras, $event) || (p_r5.caras = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 30)(24, "label", 31);
    \u0275\u0275text(25, "Inv. Deposito");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "input", 32);
    \u0275\u0275twoWayListener("ngModelChange", function BalanceFormComponent_Conditional_16_For_1_Template_input_ngModelChange_26_listener($event) {
      const p_r5 = \u0275\u0275restoreView(_r4).$implicit;
      \u0275\u0275twoWayBindingSet(p_r5.inv_deposito, $event) || (p_r5.inv_deposito = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(27, "div", 33)(28, "label", 31);
    \u0275\u0275text(29, "FIFO (Fecha de Vencimiento)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 34)(31, "input", 35);
    \u0275\u0275twoWayListener("ngModelChange", function BalanceFormComponent_Conditional_16_For_1_Template_input_ngModelChange_31_listener($event) {
      const p_r5 = \u0275\u0275restoreView(_r4).$implicit;
      \u0275\u0275twoWayBindingSet(p_r5.fifo, $event) || (p_r5.fifo = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("click", function BalanceFormComponent_Conditional_16_For_1_Template_input_click_31_listener() {
      \u0275\u0275restoreView(_r4);
      const picker_r6 = \u0275\u0275reference(34);
      return \u0275\u0275resetView(picker_r6.open());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(32, "mat-datepicker-toggle", 36)(33, "mat-datepicker", null, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 37)(36, "div", 30)(37, "label", 31);
    \u0275\u0275text(38, "Precio BS");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "div", 38)(40, "span", 39);
    \u0275\u0275text(41, "Bs");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "input", 40);
    \u0275\u0275twoWayListener("ngModelChange", function BalanceFormComponent_Conditional_16_For_1_Template_input_ngModelChange_42_listener($event) {
      const p_r5 = \u0275\u0275restoreView(_r4).$implicit;
      \u0275\u0275twoWayBindingSet(p_r5.precio_bs, $event) || (p_r5.precio_bs = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(43, "div", 30)(44, "label", 31);
    \u0275\u0275text(45, "Precio USD");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "div", 38)(47, "span", 39);
    \u0275\u0275text(48, "$");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "input", 40);
    \u0275\u0275twoWayListener("ngModelChange", function BalanceFormComponent_Conditional_16_For_1_Template_input_ngModelChange_49_listener($event) {
      const p_r5 = \u0275\u0275restoreView(_r4).$implicit;
      \u0275\u0275twoWayBindingSet(p_r5.precio_ds, $event) || (p_r5.precio_ds = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const p_r5 = ctx.$implicit;
    const picker_r6 = \u0275\u0275reference(34);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r5.categoria);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r5.sku);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", p_r5.inv_inicial);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", p_r5.inv_final);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", p_r5.caras);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", p_r5.inv_deposito);
    \u0275\u0275advance(5);
    \u0275\u0275property("matDatepicker", picker_r6);
    \u0275\u0275twoWayProperty("ngModel", p_r5.fifo);
    \u0275\u0275advance();
    \u0275\u0275property("for", picker_r6);
    \u0275\u0275advance(10);
    \u0275\u0275twoWayProperty("ngModel", p_r5.precio_bs);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", p_r5.precio_ds);
  }
}
function BalanceFormComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, BalanceFormComponent_Conditional_16_For_1_Template, 50, 11, "div", 22, _forTrack05);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r2.addedProducts());
  }
}
function BalanceFormComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 15);
  }
}
function BalanceFormComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1, "cloud_upload");
    \u0275\u0275elementEnd();
  }
}
var BalanceFormComponent = class _BalanceFormComponent {
  constructor() {
    this.api = inject(ApiService);
    this.snack = inject(MatSnackBar);
    this.searchQuery = "";
    this.products = signal([]);
    this.filteredProducts = signal([]);
    this.addedProducts = signal([]);
    this.saving = signal(false);
  }
  ngOnInit() {
    this.api.getMercProductosCliente(this.idCliente).subscribe((res) => {
      this.products.set(res);
    });
  }
  filterProducts() {
    if (!this.searchQuery) {
      this.filteredProducts.set([]);
      return;
    }
    const q = this.searchQuery.toLowerCase();
    this.filteredProducts.set(this.products().filter((p) => p.sku.toLowerCase().includes(q) || p.fabricante.toLowerCase().includes(q)));
  }
  addProduct(p) {
    if (this.addedProducts().some((x) => x.id === p.id)) {
      this.snack.open("Producto ya agregado", "OK", { duration: 2e3 });
      this.searchQuery = "";
      this.filteredProducts.set([]);
      return;
    }
    const balance = {
      id: p.id,
      sku: p.sku,
      fabricante: p.fabricante,
      categoria: p.categoria,
      inv_inicial: 0,
      inv_final: 0,
      inv_deposito: 0,
      caras: 0,
      precio_bs: 0,
      precio_ds: 0,
      fifo: null
    };
    this.addedProducts.update((list) => [...list, balance]);
    this.searchQuery = "";
    this.filteredProducts.set([]);
  }
  removeProduct(id) {
    this.addedProducts.update((list) => list.filter((x) => x.id !== id));
  }
  saveBalances() {
    this.saving.set(true);
    const payload = {
      visita_id: this.visitaId,
      id_cliente: this.idCliente,
      productos: this.addedProducts().map((p) => __spreadProps(__spreadValues({}, p), {
        // Convert Date object to string if necessary (FastAPI handles ISO strings usually)
        fifo: p.fifo ? p.fifo.toISOString().split("T")[0] : null
      }))
    };
    this.api.guardarMercBalances(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open("Data guardada correctamente", "OK", { duration: 3e3 });
        this.addedProducts.set([]);
      },
      error: () => {
        this.saving.set(false);
        this.snack.open("Error al guardar balances", "OK", { duration: 3e3 });
      }
    });
  }
  static {
    this.\u0275fac = function BalanceFormComponent_Factory(t) {
      return new (t || _BalanceFormComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BalanceFormComponent, selectors: [["app-balance-form"]], inputs: { visitaId: "visitaId", idCliente: "idCliente" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 22, vars: 7, consts: [["picker", ""], [1, "space-y-6"], [1, "relative", "bg-white", "dark:bg-slate-900", "p-4", "rounded-3xl", "border", "border-slate-100", "dark:border-white/5", "shadow-sm"], [1, "flex", "items-center", "justify-between", "mb-4", "px-2"], [1, "text-xs", "font-black", "text-slate-400", "uppercase", "tracking-widest"], [1, "text-[10px]", "font-bold", "text-primary-500"], [1, "relative", "mb-4"], [1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-400"], ["type", "text", "placeholder", "Buscar por nombre o SKU...", 1, "w-full", "bg-slate-50", "dark:bg-slate-950", "border", "border-slate-100", "dark:border-white/5", "rounded-2xl", "pl-10", "pr-4", "py-3", "text-sm", "font-bold", "outline-none", "focus:ring-2", "focus:ring-primary-500", "transition-all", 3, "ngModelChange", "ngModel"], [1, "absolute", "z-10", "left-4", "right-4", "top-[100%]", "mt-1", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-white/10", "rounded-2xl", "shadow-2xl", "max-h-[300px]", "overflow-y-auto"], [1, "space-y-4"], [1, "text-xs", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "px-2"], [1, "py-12", "bg-slate-50", "dark:bg-slate-900/50", "rounded-[2rem]", "border", "border-dashed", "border-slate-200", "dark:border-white/5", "flex", "flex-col", "items-center", "gap-4", "opacity-40", "grayscale"], [1, "pt-6", "pb-12"], [1, "w-full", "py-4", "bg-primary-600", "text-white", "rounded-[2rem]", "font-black", "uppercase", "tracking-widest", "text-sm", "shadow-xl", "shadow-primary-600/20", "active:scale-95", "transition-all", "flex", "items-center", "justify-center", "gap-2", 3, "click", "disabled"], ["diameter", "18"], [1, "p-3", "hover:bg-slate-50", "dark:hover:bg-white/5", "cursor-pointer", "flex", "flex-col", "border-b", "border-slate-50", "dark:border-white/5", "last:border-0"], [1, "p-3", "hover:bg-slate-50", "dark:hover:bg-white/5", "cursor-pointer", "flex", "flex-col", "border-b", "border-slate-50", "dark:border-white/5", "last:border-0", 3, "click"], [1, "text-xs", "font-bold", "text-slate-800", "dark:text-white"], [1, "text-[9px]", "text-slate-400", "uppercase", "tracking-widest"], [1, "!text-5xl"], [1, "text-xs", "font-bold", "italic"], [1, "bg-white", "dark:bg-slate-900", "rounded-[2rem]", "border", "border-slate-100", "dark:border-white/5", "p-6", "shadow-sm", "animate-in", "slide-in-from-right-4", "duration-300", "relative", "overflow-hidden"], [1, "flex", "items-start", "justify-between", "mb-4"], [1, "flex", "flex-col", "min-w-0"], [1, "text-[9px]", "font-black", "text-primary-500", "uppercase", "tracking-widest", "mb-0.5"], [1, "font-bold", "text-slate-800", "dark:text-white", "text-sm", "tracking-tight", "truncate"], [1, "w-8", "h-8", "rounded-lg", "bg-rose-500/10", "text-rose-500", "flex", "items-center", "justify-center", 3, "click"], [1, "!text-sm"], [1, "grid", "grid-cols-2", "gap-4", "mb-4"], [1, "space-y-1"], [1, "text-[9px]", "font-black", "text-slate-400", "uppercase", "tracking-widest", "px-1"], ["type", "number", 1, "w-full", "bg-slate-50", "dark:bg-slate-950", "border", "border-slate-100", "dark:border-white/5", "rounded-xl", "px-3", "py-2", "text-sm", "font-black", "outline-none", 3, "ngModelChange", "ngModel"], [1, "space-y-1", "mb-4"], [1, "relative", "merc-datepicker-container"], ["matInput", "", "placeholder", "Seleccionar fecha", 1, "w-full", "bg-slate-50", "dark:bg-slate-950", "border", "border-slate-100", "dark:border-white/5", "rounded-xl", "px-3", "py-2.5", "text-sm", "font-bold", "outline-none", "cursor-pointer", 3, "ngModelChange", "click", "matDatepicker", "ngModel"], ["matSuffix", "", 1, "absolute", "right-1", "top-1/2", "-translate-y-1/2", "scale-75", 3, "for"], [1, "grid", "grid-cols-2", "gap-4"], [1, "relative"], [1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-[10px]", "font-black", "text-slate-400"], ["type", "number", 1, "w-full", "bg-slate-50", "dark:bg-slate-950", "border", "border-slate-100", "dark:border-white/5", "rounded-xl", "pl-8", "pr-3", "py-2", "text-sm", "font-black", "outline-none", 3, "ngModelChange", "ngModel"]], template: function BalanceFormComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "h4", 4);
        \u0275\u0275text(4, "Agregar Producto");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "span", 5);
        \u0275\u0275text(6);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div", 6)(8, "mat-icon", 7);
        \u0275\u0275text(9, "search");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "input", 8);
        \u0275\u0275twoWayListener("ngModelChange", function BalanceFormComponent_Template_input_ngModelChange_10_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function BalanceFormComponent_Template_input_ngModelChange_10_listener() {
          return ctx.filterProducts();
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275template(11, BalanceFormComponent_Conditional_11_Template, 3, 0, "div", 9);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "div", 10)(13, "h4", 11);
        \u0275\u0275text(14);
        \u0275\u0275elementEnd();
        \u0275\u0275template(15, BalanceFormComponent_Conditional_15_Template, 5, 0, "div", 12)(16, BalanceFormComponent_Conditional_16_Template, 2, 0);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(17, "div", 13)(18, "button", 14);
        \u0275\u0275listener("click", function BalanceFormComponent_Template_button_click_18_listener() {
          return ctx.saveBalances();
        });
        \u0275\u0275template(19, BalanceFormComponent_Conditional_19_Template, 1, 0, "mat-spinner", 15)(20, BalanceFormComponent_Conditional_20_Template, 2, 0);
        \u0275\u0275text(21, " Guardar Data de Visita ");
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate1("", ctx.products().length, " en cat\xE1logo");
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
        \u0275\u0275advance();
        \u0275\u0275conditional(11, ctx.searchQuery && ctx.filteredProducts().length > 0 ? 11 : -1);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1("Data Cargada (", ctx.addedProducts().length, ")");
        \u0275\u0275advance();
        \u0275\u0275conditional(15, ctx.addedProducts().length === 0 ? 15 : 16);
        \u0275\u0275advance(3);
        \u0275\u0275property("disabled", ctx.addedProducts().length === 0 || ctx.saving());
        \u0275\u0275advance();
        \u0275\u0275conditional(19, ctx.saving() ? 19 : 20);
      }
    }, dependencies: [
      CommonModule,
      FormsModule,
      DefaultValueAccessor,
      NumberValueAccessor,
      NgControlStatus,
      NgModel,
      MatIconModule,
      MatIcon,
      MatButtonModule,
      MatProgressSpinnerModule,
      MatProgressSpinner,
      MatSnackBarModule,
      MatDatepickerModule,
      MatDatepicker,
      MatDatepickerInput,
      MatDatepickerToggle,
      MatNativeDateModule,
      MatFormFieldModule,
      MatSuffix,
      MatInputModule,
      MatInput
    ], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.merc-datepicker-container[_ngcontent-%COMP%]     .mat-mdc-form-field-subscript-wrapper {\n  display: none;\n}\n.merc-datepicker-container[_ngcontent-%COMP%]     .mat-mdc-text-field-wrapper {\n  padding: 0;\n  background: transparent !important;\n}\n.merc-datepicker-container[_ngcontent-%COMP%]     .mat-mdc-form-field-flex {\n  padding: 0 !important;\n}\n.merc-datepicker-container[_ngcontent-%COMP%]     .mdc-line-ripple {\n  display: none;\n}\n/*# sourceMappingURL=balance-form.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BalanceFormComponent, { className: "BalanceFormComponent", filePath: "src\\app\\features\\mercaderista\\components\\merc-visit-panel\\components\\balance-form\\balance-form.component.ts", lineNumber: 163 });
})();

// src/app/features/mercaderista/components/merc-visit-panel/merc-visit-panel.component.ts
function MercVisitPanelComponent_ng_template_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "mat-icon", 22);
    \u0275\u0275text(2, "photo_camera");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 23);
    \u0275\u0275text(4, "Fotos");
    \u0275\u0275elementEnd()();
  }
}
function MercVisitPanelComponent_ng_template_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "mat-icon", 22);
    \u0275\u0275text(2, "inventory_2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 23);
    \u0275\u0275text(4, "Data");
    \u0275\u0275elementEnd()();
  }
}
function MercVisitPanelComponent_ng_template_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "mat-icon", 22);
    \u0275\u0275text(2, "chat");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 23);
    \u0275\u0275text(4, "Chat");
    \u0275\u0275elementEnd()();
  }
}
var MercVisitPanelComponent = class _MercVisitPanelComponent {
  constructor() {
    this.visit = null;
    this.ui = inject(MercUiService);
    this.socket = inject(MercSocketService);
  }
  ngOnInit() {
    if (this.visit) {
    }
  }
  close() {
    this.ui.closeVisit();
  }
  static {
    this.\u0275fac = function MercVisitPanelComponent_Factory(t) {
      return new (t || _MercVisitPanelComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MercVisitPanelComponent, selectors: [["app-merc-visit-panel"]], inputs: { visit: "visit" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 36, vars: 6, consts: [[1, "fixed", "inset-0", "z-[100]", "bg-white", "dark:bg-slate-950", "flex", "flex-col", "animate-in", "slide-in-from-right-full", "duration-300"], [1, "bg-white", "dark:bg-slate-900", "border-b", "border-slate-100", "dark:border-white/5", "px-6", "py-4", "flex", "items-center", "justify-between", "shadow-sm", "shrink-0"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-slate-50", "dark:bg-white/5", "flex", "items-center", "justify-center", "text-slate-500", 3, "click"], [1, "flex", "flex-col", "min-w-0"], [1, "text-[9px]", "font-black", "text-primary-500", "uppercase", "tracking-widest", "truncate"], [1, "font-bold", "text-slate-800", "dark:text-white", "truncate", "tracking-tight", "text-sm"], [1, "flex", "items-center", "gap-2"], [1, "w-2", "h-2", "rounded-full", "bg-emerald-500", "animate-pulse"], [1, "text-[10px]", "font-black", "uppercase", "tracking-widest", "text-emerald-500"], [1, "flex-grow", "overflow-y-auto"], ["mat-stretch-tabs", "false", "mat-align-tabs", "start", 1, "merc-visit-tabs"], ["mat-tab-label", ""], [1, "p-4"], [3, "visitaId"], [3, "visitaId", "idCliente"], [1, "p-4", "h-[60vh]"], [1, "h-full", "flex", "flex-col", "items-center", "justify-center", "opacity-30", "gap-4"], [1, "!text-5xl"], [1, "font-bold"], [1, "p-4", "bg-slate-50", "dark:bg-slate-900/50", "border-t", "border-slate-100", "dark:border-white/5", "text-center"], [1, "text-[9px]", "font-black", "text-slate-400", "uppercase", "tracking-widest"], [1, "!text-sm"], [1, "text-[10px]", "font-black", "uppercase", "tracking-widest"]], template: function MercVisitPanelComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "button", 3);
        \u0275\u0275listener("click", function MercVisitPanelComponent_Template_button_click_3_listener() {
          return ctx.close();
        });
        \u0275\u0275elementStart(4, "mat-icon");
        \u0275\u0275text(5, "arrow_back");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(6, "div", 4)(7, "span", 5);
        \u0275\u0275text(8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "h3", 6);
        \u0275\u0275text(10);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(11, "div", 7);
        \u0275\u0275element(12, "div", 8);
        \u0275\u0275elementStart(13, "span", 9);
        \u0275\u0275text(14, "Activa");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(15, "div", 10)(16, "mat-tab-group", 11)(17, "mat-tab");
        \u0275\u0275template(18, MercVisitPanelComponent_ng_template_18_Template, 5, 0, "ng-template", 12);
        \u0275\u0275elementStart(19, "div", 13);
        \u0275\u0275element(20, "app-photo-grid", 14);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(21, "mat-tab");
        \u0275\u0275template(22, MercVisitPanelComponent_ng_template_22_Template, 5, 0, "ng-template", 12);
        \u0275\u0275elementStart(23, "div", 13);
        \u0275\u0275element(24, "app-balance-form", 15);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(25, "mat-tab");
        \u0275\u0275template(26, MercVisitPanelComponent_ng_template_26_Template, 5, 0, "ng-template", 12);
        \u0275\u0275elementStart(27, "div", 16)(28, "div", 17)(29, "mat-icon", 18);
        \u0275\u0275text(30, "chat");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(31, "p", 19);
        \u0275\u0275text(32, "Chat de la visita activa");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(33, "div", 20)(34, "p", 21);
        \u0275\u0275text(35);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate(ctx.visit == null ? null : ctx.visit.cliente);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.visit == null ? null : ctx.visit.pdv_nombre);
        \u0275\u0275advance(10);
        \u0275\u0275property("visitaId", ctx.visit == null ? null : ctx.visit.id_visita);
        \u0275\u0275advance(4);
        \u0275\u0275property("visitaId", ctx.visit == null ? null : ctx.visit.id_visita)("idCliente", ctx.visit == null ? null : ctx.visit.id_cliente);
        \u0275\u0275advance(11);
        \u0275\u0275textInterpolate1("ID Visita: ", ctx.visit == null ? null : ctx.visit.id_visita, "");
      }
    }, dependencies: [CommonModule, MatIconModule, MatIcon, MatButtonModule, MatTabsModule, MatTabLabel, MatTab, MatTabGroup, PhotoGridComponent, BalanceFormComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.merc-visit-tabs[_ngcontent-%COMP%]     .mat-mdc-tab-header {\n  background: white;\n}\n.dark[_ngcontent-%COMP%]   .merc-visit-tabs[_ngcontent-%COMP%]     .mat-mdc-tab-header {\n  background: #0f172a;\n}\n.merc-visit-tabs[_ngcontent-%COMP%]     .mat-mdc-tab {\n  height: 48px;\n  min-width: 0;\n  padding: 0 16px;\n}\n/*# sourceMappingURL=merc-visit-panel.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MercVisitPanelComponent, { className: "MercVisitPanelComponent", filePath: "src\\app\\features\\mercaderista\\components\\merc-visit-panel\\merc-visit-panel.component.ts", lineNumber: 99 });
})();

// src/app/features/mercaderista/mercaderista.component.ts
function MercaderistaComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "mat-icon", 16);
    \u0275\u0275text(2, "sync");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 17);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.pendingPhotos());
  }
}
function MercaderistaComponent_ng_template_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "mat-icon");
    \u0275\u0275text(2, "explore");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 19);
    \u0275\u0275text(4, "Mi Ruta");
    \u0275\u0275elementEnd()();
  }
}
function MercaderistaComponent_ng_template_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "mat-icon");
    \u0275\u0275text(2, "assignment");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 19);
    \u0275\u0275text(4, "Visitas");
    \u0275\u0275elementEnd()();
  }
}
function MercaderistaComponent_ng_template_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "mat-icon", 20);
    \u0275\u0275text(2, "chat_bubble");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 19);
    \u0275\u0275text(4, "Chat");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("matBadge", 0)("matBadgeHidden", true);
  }
}
function MercaderistaComponent_ng_template_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "mat-icon");
    \u0275\u0275text(2, "account_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 19);
    \u0275\u0275text(4, "Perfil");
    \u0275\u0275elementEnd()();
  }
}
function MercaderistaComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-merc-visit-panel", 15);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("visit", ctx_r0.ui.activeVisit());
  }
}
var MercaderistaComponent = class _MercaderistaComponent {
  constructor(offline) {
    this.offline = offline;
    this.isOnline = signal(navigator.onLine);
    this.pendingPhotos = signal(0);
    this.today = (/* @__PURE__ */ new Date()).toLocaleDateString("es-VE", { weekday: "long", day: "numeric", month: "long" });
    this.ui = inject(MercUiService);
  }
  ngOnInit() {
    this.offline.isOnline$.subscribe((v) => this.isOnline.set(v));
    this.offline.pendingCount$.subscribe((v) => this.pendingPhotos.set(v));
  }
  static {
    this.\u0275fac = function MercaderistaComponent_Factory(t) {
      return new (t || _MercaderistaComponent)(\u0275\u0275directiveInject(OfflineQueueService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MercaderistaComponent, selectors: [["app-mercaderista"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 31, vars: 8, consts: [[1, "merc-portal-container", "flex", "flex-col", "h-[calc(100vh-64px)]", "overflow-hidden"], [1, "status-header", "px-6", "py-3", "flex", "items-center", "justify-between", "bg-white", "dark:bg-slate-900", "border-b", "border-slate-100", "dark:border-white/5", "shadow-sm", "z-10"], [1, "flex", "flex-col"], [1, "text-sm", "font-bold", "text-slate-800", "dark:text-white", "uppercase", "tracking-tight"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-black", "uppercase", "tracking-widest"], [1, "flex", "items-center", "gap-3"], [1, "flex", "items-center", "gap-1.5", "px-3", "py-1", "rounded-full", "border", "text-[10px]", "font-black", "uppercase", "tracking-widest", "transition-all"], [1, "w-1.5", "h-1.5", "rounded-full"], [1, "bg-amber-500", "text-white", "px-2", "py-1", "rounded-lg", "flex", "items-center", "gap-1", "shadow-lg", "shadow-amber-500/20", "animate-bounce"], [1, "flex-grow", "overflow-hidden"], ["headerPosition", "below", "animationDuration", "200ms", "mat-stretch-tabs", "false", "mat-align-tabs", "center", 1, "h-full", "merc-tabs"], ["mat-tab-label", ""], [1, "h-full", "overflow-y-auto"], [1, "h-full", "overflow-y-auto", "bg-slate-50", "dark:bg-slate-950"], [1, "h-full"], [3, "visit"], [1, "!text-[14px]", "!w-[14px]", "!h-[14px]"], [1, "text-[10px]", "font-black"], [1, "flex", "flex-col", "items-center", "gap-1", "pt-2"], [1, "text-[9px]", "font-black", "uppercase", "tracking-widest"], ["matBadgeOverlap", "false", "matBadgeColor", "warn", 3, "matBadge", "matBadgeHidden"]], template: function MercaderistaComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h2", 3);
        \u0275\u0275text(4, "Portal Mercaderista");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "span", 4);
        \u0275\u0275text(6);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div", 5)(8, "div", 6);
        \u0275\u0275element(9, "div", 7);
        \u0275\u0275text(10);
        \u0275\u0275elementEnd();
        \u0275\u0275template(11, MercaderistaComponent_Conditional_11_Template, 5, 1, "div", 8);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "div", 9)(13, "mat-tab-group", 10)(14, "mat-tab");
        \u0275\u0275template(15, MercaderistaComponent_ng_template_15_Template, 5, 0, "ng-template", 11);
        \u0275\u0275elementStart(16, "div", 12);
        \u0275\u0275element(17, "app-merc-ruta");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(18, "mat-tab");
        \u0275\u0275template(19, MercaderistaComponent_ng_template_19_Template, 5, 0, "ng-template", 11);
        \u0275\u0275elementStart(20, "div", 13);
        \u0275\u0275element(21, "app-merc-visitas");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(22, "mat-tab");
        \u0275\u0275template(23, MercaderistaComponent_ng_template_23_Template, 5, 2, "ng-template", 11);
        \u0275\u0275elementStart(24, "div", 14);
        \u0275\u0275element(25, "app-merc-chat");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(26, "mat-tab");
        \u0275\u0275template(27, MercaderistaComponent_ng_template_27_Template, 5, 0, "ng-template", 11);
        \u0275\u0275elementStart(28, "div", 13);
        \u0275\u0275element(29, "app-merc-perfil");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(30, MercaderistaComponent_Conditional_30_Template, 1, 1, "app-merc-visit-panel", 15);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate(ctx.today);
        \u0275\u0275advance(2);
        \u0275\u0275classMap(ctx.isOnline() ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20");
        \u0275\u0275advance();
        \u0275\u0275classMap(ctx.isOnline() ? "bg-emerald-500 animate-pulse" : "bg-rose-500");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.isOnline() ? "Online" : "Offline", " ");
        \u0275\u0275advance();
        \u0275\u0275conditional(11, ctx.pendingPhotos() > 0 ? 11 : -1);
        \u0275\u0275advance(19);
        \u0275\u0275conditional(30, ctx.ui.activeVisit() ? 30 : -1);
      }
    }, dependencies: [
      CommonModule,
      MatTabsModule,
      MatTabLabel,
      MatTab,
      MatTabGroup,
      MatIconModule,
      MatIcon,
      MatBadgeModule,
      MatBadge,
      MatButtonModule,
      MercRutaComponent,
      MercVisitasComponent,
      MercChatComponent,
      MercPerfilComponent,
      MercVisitPanelComponent
    ], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  height: 100%;\n}\n.merc-tabs[_ngcontent-%COMP%]     {\n}\n.merc-tabs[_ngcontent-%COMP%]     .mat-mdc-tab-header {\n  background: white;\n  border-top: 1px solid rgba(0, 0, 0, 0.05);\n}\n.dark[_ngcontent-%COMP%]   .merc-tabs[_ngcontent-%COMP%]     .mat-mdc-tab-header {\n  background: #0f172a;\n  border-top-color: rgba(255, 255, 255, 0.05);\n}\n.merc-tabs[_ngcontent-%COMP%]     .mat-mdc-tab-label-container {\n  padding: 4px 0;\n}\n.merc-tabs[_ngcontent-%COMP%]     .mat-mdc-tab-labels {\n  justify-content: space-around;\n}\n.merc-tabs[_ngcontent-%COMP%]     .mat-mdc-tab {\n  min-width: 0;\n  flex: 1;\n  height: 64px;\n  opacity: 0.6;\n  transition: all 0.2s;\n}\n.merc-tabs[_ngcontent-%COMP%]     .mat-mdc-tab.mdc-tab--active {\n  opacity: 1;\n}\n.merc-tabs[_ngcontent-%COMP%]     .mat-mdc-tab.mdc-tab--active .mat-icon {\n  color: #6366f1;\n  transform: translateY(-2px);\n}\n.merc-tabs[_ngcontent-%COMP%]     .mat-mdc-tab.mdc-tab--active .dark .mat-icon {\n  color: #818cf8;\n}\n.merc-tabs[_ngcontent-%COMP%]     .mat-mdc-tab-group.mat-tabs-with-background .mat-mdc-tab-header {\n  background-color: transparent;\n}\n.merc-tabs[_ngcontent-%COMP%]     .mat-mdc-tab-body-wrapper {\n  flex-grow: 1;\n}\n.merc-tabs[_ngcontent-%COMP%]     .mdc-tab-indicator__content--underline {\n  display: none;\n}\n.status-header[_ngcontent-%COMP%] {\n  height: 56px;\n}\n/*# sourceMappingURL=mercaderista.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MercaderistaComponent, { className: "MercaderistaComponent", filePath: "src\\app\\features\\mercaderista\\mercaderista.component.ts", lineNumber: 25 });
})();
export {
  MercaderistaComponent
};
//# sourceMappingURL=chunk-AQW7IFU5.js.map
