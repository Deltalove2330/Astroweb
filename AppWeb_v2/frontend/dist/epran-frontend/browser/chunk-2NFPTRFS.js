import {
  MatSnackBar,
  MatSnackBarModule
} from "./chunk-7QJW63DM.js";
import "./chunk-CELNEZAJ.js";
import "./chunk-ABO6AUNU.js";
import {
  CheckboxControlValueAccessor,
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
  MatIcon,
  MatIconModule
} from "./chunk-KQNRR4FF.js";
import "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  CommonModule,
  computed,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
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
  ɵɵtwoWayProperty
} from "./chunk-QB3BCYT5.js";

// src/app/features/admin/permissions.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function PermissionsComponent_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const u_r1 = ctx.$implicit;
    \u0275\u0275property("ngValue", u_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", u_r1.username, " (", u_r1.rol, ")");
  }
}
function PermissionsComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 12);
  }
}
function PermissionsComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 15);
    \u0275\u0275text(1, "save");
    \u0275\u0275elementEnd();
  }
}
function PermissionsComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14)(1, "mat-icon", 16);
    \u0275\u0275text(2, "manage_accounts");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 17);
    \u0275\u0275text(4, "Selecciona un usuario para configurar sus permisos");
    \u0275\u0275elementEnd()();
  }
}
function PermissionsComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275element(1, "mat-spinner", 19);
    \u0275\u0275elementEnd();
  }
}
function PermissionsComponent_Conditional_25_For_12_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const root_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(root_r3.icono);
  }
}
function PermissionsComponent_Conditional_25_For_12_For_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 30)(1, "div", 31)(2, "mat-icon", 32);
    \u0275\u0275text(3, "subdirectory_arrow_right");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 21)(6, "input", 28);
    \u0275\u0275twoWayListener("ngModelChange", function PermissionsComponent_Conditional_25_For_12_For_18_Template_input_ngModelChange_6_listener($event) {
      const h_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r3.perms[h_r6.clave].can_read, $event) || (ctx_r3.perms[h_r6.clave].can_read = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "span", 21)(8, "input", 28);
    \u0275\u0275twoWayListener("ngModelChange", function PermissionsComponent_Conditional_25_For_12_For_18_Template_input_ngModelChange_8_listener($event) {
      const h_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r3.perms[h_r6.clave].can_write, $event) || (ctx_r3.perms[h_r6.clave].can_write = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 21)(10, "input", 28);
    \u0275\u0275twoWayListener("ngModelChange", function PermissionsComponent_Conditional_25_For_12_For_18_Template_input_ngModelChange_10_listener($event) {
      const h_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r3.perms[h_r6.clave].can_delete, $event) || (ctx_r3.perms[h_r6.clave].can_delete = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "span", 33);
    \u0275\u0275text(12, "\u2014");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const h_r6 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", h_r6.nombre, " ");
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.perms[h_r6.clave].can_read);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.perms[h_r6.clave].can_write);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.perms[h_r6.clave].can_delete);
  }
}
function PermissionsComponent_Conditional_25_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 23)(2, "div", 24);
    \u0275\u0275template(3, PermissionsComponent_Conditional_25_For_12_Conditional_3_Template, 2, 1, "mat-icon", 25);
    \u0275\u0275text(4);
    \u0275\u0275elementStart(5, "button", 26);
    \u0275\u0275listener("click", function PermissionsComponent_Conditional_25_For_12_Template_button_click_5_listener() {
      const root_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.setModulo(root_r3, true));
    });
    \u0275\u0275text(6, "Todo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 27);
    \u0275\u0275listener("click", function PermissionsComponent_Conditional_25_For_12_Template_button_click_7_listener() {
      const root_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.setModulo(root_r3, false));
    });
    \u0275\u0275text(8, "Nada");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 21)(10, "input", 28);
    \u0275\u0275twoWayListener("ngModelChange", function PermissionsComponent_Conditional_25_For_12_Template_input_ngModelChange_10_listener($event) {
      const root_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r3.perms[root_r3.clave].can_read, $event) || (ctx_r3.perms[root_r3.clave].can_read = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "span", 21)(12, "input", 28);
    \u0275\u0275twoWayListener("ngModelChange", function PermissionsComponent_Conditional_25_For_12_Template_input_ngModelChange_12_listener($event) {
      const root_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r3.perms[root_r3.clave].can_write, $event) || (ctx_r3.perms[root_r3.clave].can_write = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "span", 21)(14, "input", 28);
    \u0275\u0275twoWayListener("ngModelChange", function PermissionsComponent_Conditional_25_For_12_Template_input_ngModelChange_14_listener($event) {
      const root_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r3.perms[root_r3.clave].can_delete, $event) || (ctx_r3.perms[root_r3.clave].can_delete = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "span", 21)(16, "input", 29);
    \u0275\u0275twoWayListener("ngModelChange", function PermissionsComponent_Conditional_25_For_12_Template_input_ngModelChange_16_listener($event) {
      const root_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r3.perms[root_r3.clave].can_see_all, $event) || (ctx_r3.perms[root_r3.clave].can_see_all = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275repeaterCreate(17, PermissionsComponent_Conditional_25_For_12_For_18_Template, 13, 4, "div", 30, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const root_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(3, root_r3.icono ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", root_r3.nombre, " ");
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.perms[root_r3.clave].can_read);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.perms[root_r3.clave].can_write);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.perms[root_r3.clave].can_delete);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.perms[root_r3.clave].can_see_all);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r3.hijos(root_r3.id));
  }
}
function PermissionsComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "span");
    \u0275\u0275text(2, "M\xF3dulo / Bot\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 21);
    \u0275\u0275text(4, "Lectura");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 21);
    \u0275\u0275text(6, "Modificar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 21);
    \u0275\u0275text(8, "Eliminar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 21);
    \u0275\u0275text(10, "Ver todo");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(11, PermissionsComponent_Conditional_25_For_12_Template, 19, 6, "div", 22, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(11);
    \u0275\u0275repeater(ctx_r3.roots());
  }
}
var PermissionsComponent = class _PermissionsComponent {
  constructor(api, snack) {
    this.api = api;
    this.snack = snack;
    this.users = signal([]);
    this.modulos = signal([]);
    this.selectedUserId = null;
    this.saving = signal(false);
    this.loading = signal(false);
    this.perms = {};
    this.roots = computed(() => this.modulos().filter((m) => !m.id_padre).sort((a, b) => a.orden - b.orden));
  }
  ngOnInit() {
    this.api.getUsers().subscribe((u) => this.users.set(u));
    this.api.getModulos().subscribe((m) => {
      this.modulos.set(m);
      this.ensurePerms();
    });
  }
  hijos(idPadre) {
    return this.modulos().filter((m) => m.id_padre === idPadre).sort((a, b) => a.orden - b.orden);
  }
  ensurePerms() {
    for (const m of this.modulos()) {
      if (!this.perms[m.clave])
        this.perms[m.clave] = { can_read: false, can_write: false, can_delete: false, can_see_all: false };
    }
  }
  onUserChange(userId) {
    this.perms = {};
    this.ensurePerms();
    if (!userId)
      return;
    this.loading.set(true);
    this.api.getUserPermissions(userId).subscribe({
      next: (list) => {
        for (const p of list) {
          this.perms[p.module] = {
            can_read: !!p.can_read,
            can_write: !!p.can_write,
            can_delete: !!p.can_delete,
            can_see_all: !!p.can_see_all
          };
        }
        this.ensurePerms();
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
  setModulo(root, val) {
    const apply = (clave) => {
      const p = this.perms[clave];
      p.can_read = val;
      p.can_write = val;
      p.can_delete = val;
    };
    apply(root.clave);
    for (const h of this.hijos(root.id))
      apply(h.clave);
  }
  save() {
    if (!this.selectedUserId)
      return;
    this.saving.set(true);
    const permissions = this.modulos().map((m) => ({
      module: m.clave,
      can_read: this.perms[m.clave].can_read,
      can_write: this.perms[m.clave].can_write,
      can_delete: this.perms[m.clave].can_delete,
      can_see_all: this.perms[m.clave].can_see_all
    }));
    this.api.updateUserPermissions(this.selectedUserId, permissions).subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open("Permisos guardados", "OK", { duration: 2500 });
      },
      error: () => {
        this.saving.set(false);
        this.snack.open("Error al guardar", "OK", { duration: 3e3 });
      }
    });
  }
  static {
    this.\u0275fac = function PermissionsComponent_Factory(t) {
      return new (t || _PermissionsComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PermissionsComponent, selectors: [["app-permissions"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 26, vars: 5, consts: [[1, "min-h-screen", "bg-slate-950", "text-white"], [1, "bg-gradient-to-r", "from-slate-900", "to-slate-800", "border-b", "border-white/8", "px-8", "py-6"], [1, "flex", "items-center", "justify-between", "gap-4", "flex-wrap"], [1, "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "rounded-2xl", "bg-gradient-to-br", "from-violet-600", "to-purple-700", "flex", "items-center", "justify-center", "shadow-lg", "shrink-0"], [1, "text-white"], [1, "text-2xl", "font-black", "tracking-tight", "leading-none"], [1, "text-slate-400", "text-sm", "mt-0.5"], [1, "flex", "items-center", "gap-3"], [1, "bg-slate-800", "border", "border-slate-700", "focus:border-violet-500", "rounded-xl", "px-3", "py-2.5", "text-sm", "font-semibold", "text-white", "outline-none", "min-w-64", 3, "ngModelChange", "ngModel"], [3, "ngValue"], [1, "flex", "items-center", "gap-2", "px-5", "py-2.5", "bg-gradient-to-r", "from-violet-700", "to-purple-700", "hover:from-violet-600", "hover:to-purple-600", "disabled:opacity-50", "rounded-xl", "font-black", "text-sm", "shadow-lg", 3, "click", "disabled"], ["diameter", "16"], [1, "px-8", "py-6", "max-w-5xl"], [1, "flex", "flex-col", "items-center", "justify-center", "py-32", "text-slate-600", "gap-3"], [1, "!text-base"], [1, "!text-5xl"], [1, "font-bold"], [1, "flex", "justify-center", "py-24"], ["diameter", "40"], [1, "grid", "grid-cols-[1fr_90px_90px_90px_90px]", "gap-2", "px-4", "py-2", "text-[10px]", "font-black", "text-slate-500", "uppercase", "tracking-widest", "sticky", "top-0", "bg-slate-950", "z-10"], [1, "text-center"], [1, "bg-slate-900", "border", "border-white/8", "rounded-2xl", "mb-3", "overflow-hidden"], [1, "grid", "grid-cols-[1fr_90px_90px_90px_90px]", "gap-2", "items-center", "px-4", "py-3", "bg-slate-800/60", "border-b", "border-white/5"], [1, "flex", "items-center", "gap-2", "font-bold"], [1, "!text-base", "text-violet-400"], [1, "ml-2", "text-[10px]", "px-2", "py-0.5", "rounded-full", "bg-violet-950", "text-violet-300", "font-bold", 3, "click"], [1, "text-[10px]", "px-2", "py-0.5", "rounded-full", "bg-slate-800", "text-slate-400", "font-bold", 3, "click"], ["type", "checkbox", 1, "w-5", "h-5", "accent-violet-600", 3, "ngModelChange", "ngModel"], ["type", "checkbox", 1, "w-5", "h-5", "accent-amber-500", 3, "ngModelChange", "ngModel"], [1, "grid", "grid-cols-[1fr_90px_90px_90px_90px]", "gap-2", "items-center", "px-4", "py-2.5", "border-b", "border-white/5", "last:border-0"], [1, "flex", "items-center", "gap-2", "text-sm", "text-slate-300", "pl-6"], [1, "!text-sm", "text-slate-600"], [1, "text-center", "text-slate-700"]], template: function PermissionsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "mat-icon", 5);
        \u0275\u0275text(6, "admin_panel_settings");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div")(8, "h1", 6);
        \u0275\u0275text(9, "Panel de Control de Accesos");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "p", 7);
        \u0275\u0275text(11, "Permisos por usuario para cada m\xF3dulo y bot\xF3n del sistema");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(12, "div", 8)(13, "select", 9);
        \u0275\u0275twoWayListener("ngModelChange", function PermissionsComponent_Template_select_ngModelChange_13_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.selectedUserId, $event) || (ctx.selectedUserId = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function PermissionsComponent_Template_select_ngModelChange_13_listener($event) {
          return ctx.onUserChange($event);
        });
        \u0275\u0275elementStart(14, "option", 10);
        \u0275\u0275text(15, "\u2014 Selecciona un usuario \u2014");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(16, PermissionsComponent_For_17_Template, 2, 3, "option", 10, _forTrack0);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(18, "button", 11);
        \u0275\u0275listener("click", function PermissionsComponent_Template_button_click_18_listener() {
          return ctx.save();
        });
        \u0275\u0275template(19, PermissionsComponent_Conditional_19_Template, 1, 0, "mat-spinner", 12)(20, PermissionsComponent_Conditional_20_Template, 2, 0);
        \u0275\u0275text(21, " Guardar ");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(22, "div", 13);
        \u0275\u0275template(23, PermissionsComponent_Conditional_23_Template, 5, 0, "div", 14)(24, PermissionsComponent_Conditional_24_Template, 2, 0)(25, PermissionsComponent_Conditional_25_Template, 13, 0);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(13);
        \u0275\u0275twoWayProperty("ngModel", ctx.selectedUserId);
        \u0275\u0275advance();
        \u0275\u0275property("ngValue", null);
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.users());
        \u0275\u0275advance(2);
        \u0275\u0275property("disabled", !ctx.selectedUserId || ctx.saving());
        \u0275\u0275advance();
        \u0275\u0275conditional(19, ctx.saving() ? 19 : 20);
        \u0275\u0275advance(4);
        \u0275\u0275conditional(23, !ctx.selectedUserId ? 23 : ctx.loading() ? 24 : 25);
      }
    }, dependencies: [CommonModule, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, MatIconModule, MatIcon, MatProgressSpinnerModule, MatProgressSpinner, MatSnackBarModule], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PermissionsComponent, { className: "PermissionsComponent", filePath: "src\\app\\features\\admin\\permissions.component.ts", lineNumber: 92 });
})();
export {
  PermissionsComponent
};
//# sourceMappingURL=chunk-2NFPTRFS.js.map
