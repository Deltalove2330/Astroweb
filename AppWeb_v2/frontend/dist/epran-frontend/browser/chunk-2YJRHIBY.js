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
  MatTooltip,
  MatTooltipModule
} from "./chunk-PBKBS7OR.js";
import "./chunk-CELNEZAJ.js";
import "./chunk-ABO6AUNU.js";
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-QB3BCYT5.js";

// src/app/features/admin/sessions/sessions.component.ts
function SessionsComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "mat-spinner", 9);
    \u0275\u0275elementStart(2, "p", 10);
    \u0275\u0275text(3, "Cargando sesiones...");
    \u0275\u0275elementEnd()();
  }
}
function SessionsComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "mat-icon", 12);
    \u0275\u0275text(2, "manage_accounts");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 13);
    \u0275\u0275text(4, "No hay sesiones activas");
    \u0275\u0275elementEnd()();
  }
}
function SessionsComponent_Conditional_16_th_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 31);
    \u0275\u0275text(1, "Usuario");
    \u0275\u0275elementEnd();
  }
}
function SessionsComponent_Conditional_16_td_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 32)(1, "div", 4)(2, "div", 33);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "p", 34);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 35);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const s_r1 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", (s_r1.username || "?").charAt(0).toUpperCase(), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r1.username || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("#", s_r1.user_id, "");
  }
}
function SessionsComponent_Conditional_16_th_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 31);
    \u0275\u0275text(1, "Rol");
    \u0275\u0275elementEnd();
  }
}
function SessionsComponent_Conditional_16_td_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 32)(1, "span", 36);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", s_r2.rol || "\u2014", " ");
  }
}
function SessionsComponent_Conditional_16_th_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 31);
    \u0275\u0275text(1, "IP");
    \u0275\u0275elementEnd();
  }
}
function SessionsComponent_Conditional_16_td_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 37);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r3.ip_address || "\u2014");
  }
}
function SessionsComponent_Conditional_16_th_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 31);
    \u0275\u0275text(1, "Navegador");
    \u0275\u0275elementEnd();
  }
}
function SessionsComponent_Conditional_16_td_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 38);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r4 = ctx.$implicit;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r4.parseAgent(s_r4.user_agent));
  }
}
function SessionsComponent_Conditional_16_th_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 31);
    \u0275\u0275text(1, "Iniciada");
    \u0275\u0275elementEnd();
  }
}
function SessionsComponent_Conditional_16_td_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 38);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(2, 1, s_r6.created_at, "dd/MM/yy HH:mm"));
  }
}
function SessionsComponent_Conditional_16_th_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 31);
    \u0275\u0275text(1, "\xDAltimo acceso");
    \u0275\u0275elementEnd();
  }
}
function SessionsComponent_Conditional_16_td_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 38);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r7 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(2, 1, s_r7.last_active, "dd/MM/yy HH:mm"));
  }
}
function SessionsComponent_Conditional_16_th_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 39);
    \u0275\u0275text(1, "Acciones");
    \u0275\u0275elementEnd();
  }
}
function SessionsComponent_Conditional_16_td_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 40)(1, "div", 41)(2, "button", 42);
    \u0275\u0275listener("click", function SessionsComponent_Conditional_16_td_22_Template_button_click_2_listener() {
      const s_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.killAll(s_r9.user_id, s_r9.username));
    });
    \u0275\u0275elementStart(3, "mat-icon");
    \u0275\u0275text(4, "person_off");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "button", 43);
    \u0275\u0275listener("click", function SessionsComponent_Conditional_16_td_22_Template_button_click_5_listener() {
      const s_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.kill(s_r9.id));
    });
    \u0275\u0275elementStart(6, "mat-icon");
    \u0275\u0275text(7, "power_settings_new");
    \u0275\u0275elementEnd()()()();
  }
}
function SessionsComponent_Conditional_16_tr_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 44);
  }
}
function SessionsComponent_Conditional_16_tr_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 45);
  }
}
function SessionsComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14)(1, "table", 15);
    \u0275\u0275elementContainerStart(2, 16);
    \u0275\u0275template(3, SessionsComponent_Conditional_16_th_3_Template, 2, 0, "th", 17)(4, SessionsComponent_Conditional_16_td_4_Template, 9, 3, "td", 18);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(5, 19);
    \u0275\u0275template(6, SessionsComponent_Conditional_16_th_6_Template, 2, 0, "th", 17)(7, SessionsComponent_Conditional_16_td_7_Template, 3, 1, "td", 18);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(8, 20);
    \u0275\u0275template(9, SessionsComponent_Conditional_16_th_9_Template, 2, 0, "th", 17)(10, SessionsComponent_Conditional_16_td_10_Template, 2, 1, "td", 21);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(11, 22);
    \u0275\u0275template(12, SessionsComponent_Conditional_16_th_12_Template, 2, 0, "th", 17)(13, SessionsComponent_Conditional_16_td_13_Template, 2, 1, "td", 23);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(14, 24);
    \u0275\u0275template(15, SessionsComponent_Conditional_16_th_15_Template, 2, 0, "th", 17)(16, SessionsComponent_Conditional_16_td_16_Template, 3, 4, "td", 23);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(17, 25);
    \u0275\u0275template(18, SessionsComponent_Conditional_16_th_18_Template, 2, 0, "th", 17)(19, SessionsComponent_Conditional_16_td_19_Template, 3, 4, "td", 23);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(20, 26);
    \u0275\u0275template(21, SessionsComponent_Conditional_16_th_21_Template, 2, 0, "th", 27)(22, SessionsComponent_Conditional_16_td_22_Template, 8, 0, "td", 28);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275template(23, SessionsComponent_Conditional_16_tr_23_Template, 1, 0, "tr", 29)(24, SessionsComponent_Conditional_16_tr_24_Template, 1, 0, "tr", 30);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("dataSource", ctx_r4.sessions());
    \u0275\u0275advance(22);
    \u0275\u0275property("matHeaderRowDef", ctx_r4.columns);
    \u0275\u0275advance();
    \u0275\u0275property("matRowDefColumns", ctx_r4.columns);
  }
}
var SessionsComponent = class _SessionsComponent {
  constructor(api, snack) {
    this.api = api;
    this.snack = snack;
    this.loading = signal(true);
    this.sessions = signal([]);
    this.columns = ["username", "rol", "ip_address", "user_agent", "created_at", "last_active", "acciones"];
  }
  ngOnInit() {
    this.load();
  }
  load() {
    this.loading.set(true);
    this.api.getActiveSessions().subscribe({
      next: (data) => {
        this.sessions.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
  kill(id) {
    if (!confirm("\xBFTerminar esta sesi\xF3n? El usuario ser\xE1 desconectado."))
      return;
    this.api.killSession(id).subscribe({
      next: () => {
        this.sessions.update((s) => s.filter((x) => x.id !== id));
        this.snack.open("Sesi\xF3n terminada", "OK", { duration: 2500 });
      },
      error: () => this.snack.open("Error al terminar sesi\xF3n", "OK", { duration: 3e3 })
    });
  }
  killAll(userId, username) {
    if (!confirm(`\xBFTerminar TODAS las sesiones de ${username}?`))
      return;
    this.api.killUserSessions(userId).subscribe({
      next: () => {
        this.sessions.update((s) => s.filter((x) => x.user_id !== userId));
        this.snack.open(`Todas las sesiones de ${username} terminadas`, "OK", { duration: 3e3 });
      },
      error: () => this.snack.open("Error", "OK", { duration: 3e3 })
    });
  }
  parseAgent(ua) {
    if (!ua)
      return "\u2014";
    if (ua.includes("Chrome"))
      return "Chrome";
    if (ua.includes("Firefox"))
      return "Firefox";
    if (ua.includes("Safari"))
      return "Safari";
    if (ua.includes("Edge"))
      return "Edge";
    return ua.slice(0, 30);
  }
  static {
    this.\u0275fac = function SessionsComponent_Factory(t) {
      return new (t || _SessionsComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SessionsComponent, selectors: [["app-sessions"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 17, vars: 3, consts: [[1, "space-y-8", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4"], [1, "text-3xl", "font-bold", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "flex", "items-center", "gap-3"], [1, "px-4", "py-2", "bg-emerald-50", "dark:bg-emerald-900/20", "text-emerald-700", "dark:text-emerald-400", "rounded-2xl", "border", "border-emerald-100", "dark:border-emerald-900/30", "flex", "items-center", "gap-2", "font-bold", "text-sm"], [1, "w-2", "h-2", "rounded-full", "bg-emerald-500", "animate-pulse"], [1, "w-11", "h-11", "flex", "items-center", "justify-center", "rounded-2xl", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "text-slate-500", "hover:text-primary-500", "hover:bg-slate-50", "dark:hover:bg-slate-800", "transition-all", "shadow-sm", 3, "click"], [1, "flex", "flex-col", "items-center", "justify-center", "py-24", "gap-4"], ["diameter", "48", "strokeWidth", "4"], [1, "text-slate-400", "font-medium"], [1, "bg-white", "dark:bg-slate-900", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "p-12", "text-center"], [1, "!text-5xl", "text-slate-300", "dark:text-slate-600"], [1, "mt-3", "text-slate-500", "dark:text-slate-400", "font-medium"], [1, "bg-white", "dark:bg-slate-900", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "overflow-hidden", "overflow-x-auto"], ["mat-table", "", 1, "w-full", 3, "dataSource"], ["matColumnDef", "username"], ["mat-header-cell", "", "class", "!bg-slate-50 dark:!bg-slate-950/50 !text-slate-500 !font-bold !py-4", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "!py-3", 4, "matCellDef"], ["matColumnDef", "rol"], ["matColumnDef", "ip_address"], ["mat-cell", "", "class", "!py-3 font-mono text-sm text-slate-600 dark:text-slate-300", 4, "matCellDef"], ["matColumnDef", "user_agent"], ["mat-cell", "", "class", "!py-3 text-sm text-slate-500", 4, "matCellDef"], ["matColumnDef", "created_at"], ["matColumnDef", "last_active"], ["matColumnDef", "acciones"], ["mat-header-cell", "", "class", "!bg-slate-50 dark:!bg-slate-950/50 !text-slate-500 !font-bold !py-4 text-right pr-6", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "!py-3 text-right pr-6", 4, "matCellDef"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-white/5 last:border-0", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", "", 1, "!bg-slate-50", "dark:!bg-slate-950/50", "!text-slate-500", "!font-bold", "!py-4"], ["mat-cell", "", 1, "!py-3"], [1, "w-9", "h-9", "rounded-xl", "bg-primary-50", "dark:bg-primary-900/20", "flex", "items-center", "justify-center", "text-primary-600", "font-bold", "text-sm"], [1, "font-bold", "text-slate-800", "dark:text-white", "text-sm"], [1, "text-xs", "text-slate-400"], [1, "px-2.5", "py-1", "rounded-lg", "text-xs", "font-bold", "uppercase", "bg-slate-100", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300"], ["mat-cell", "", 1, "!py-3", "font-mono", "text-sm", "text-slate-600", "dark:text-slate-300"], ["mat-cell", "", 1, "!py-3", "text-sm", "text-slate-500"], ["mat-header-cell", "", 1, "!bg-slate-50", "dark:!bg-slate-950/50", "!text-slate-500", "!font-bold", "!py-4", "text-right", "pr-6"], ["mat-cell", "", 1, "!py-3", "text-right", "pr-6"], [1, "flex", "items-center", "justify-end", "gap-1"], ["mat-icon-button", "", "matTooltip", "Terminar todas las sesiones del usuario", 1, "hover:!bg-amber-50", "!text-amber-500", "transition-colors", 3, "click"], ["mat-icon-button", "", "matTooltip", "Terminar esta sesi\xF3n", 1, "hover:!bg-rose-50", "!text-rose-500", "transition-colors", 3, "click"], ["mat-header-row", ""], ["mat-row", "", 1, "hover:bg-slate-50", "dark:hover:bg-slate-800/50", "transition-colors", "border-b", "border-slate-100", "dark:border-white/5", "last:border-0"]], template: function SessionsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
        \u0275\u0275text(4, "Sesiones Activas");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p", 3);
        \u0275\u0275text(6, "Visualiza y gestiona todas las sesiones abiertas en el sistema.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div", 4)(8, "div", 5);
        \u0275\u0275element(9, "span", 6);
        \u0275\u0275text(10);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "button", 7);
        \u0275\u0275listener("click", function SessionsComponent_Template_button_click_11_listener() {
          return ctx.load();
        });
        \u0275\u0275elementStart(12, "mat-icon");
        \u0275\u0275text(13, "refresh");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(14, SessionsComponent_Conditional_14_Template, 4, 0, "div", 8)(15, SessionsComponent_Conditional_15_Template, 5, 0)(16, SessionsComponent_Conditional_16_Template, 25, 3);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(10);
        \u0275\u0275textInterpolate2(" ", ctx.sessions().length, " activa", ctx.sessions().length !== 1 ? "s" : "", " ");
        \u0275\u0275advance(4);
        \u0275\u0275conditional(14, ctx.loading() ? 14 : ctx.sessions().length === 0 ? 15 : 16);
      }
    }, dependencies: [CommonModule, DatePipe, MatTableModule, MatTable, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatButtonModule, MatIconButton, MatIconModule, MatIcon, MatProgressSpinnerModule, MatProgressSpinner, MatSnackBarModule, MatTooltipModule, MatTooltip], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SessionsComponent, { className: "SessionsComponent", filePath: "src\\app\\features\\admin\\sessions\\sessions.component.ts", lineNumber: 31 });
})();
export {
  SessionsComponent
};
//# sourceMappingURL=chunk-2YJRHIBY.js.map
