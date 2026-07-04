import {
  MatInput,
  MatInputModule
} from "./chunk-GXZEZIYO.js";
import {
  AuthService
} from "./chunk-FAJEMXMR.js";
import {
  MatFormFieldModule
} from "./chunk-YUDUWHLJ.js";
import {
  MatCardModule
} from "./chunk-HA7AXTKJ.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-I7XEM5TB.js";
import "./chunk-WHO5S5ML.js";
import {
  MatProgressSpinner,
  MatProgressSpinnerModule
} from "./chunk-EGRIEE5E.js";
import {
  MatButtonModule,
  MatIcon,
  MatIconModule
} from "./chunk-KQNRR4FF.js";
import {
  Router,
  RouterLink
} from "./chunk-QGVFX6Y7.js";
import "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  CommonModule,
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
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-QB3BCYT5.js";

// src/app/features/auth/login-mercaderista/login-mercaderista.component.ts
function LoginMercaderistaComponent_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "mat-icon", 27);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 28);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function LoginMercaderistaComponent_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 23);
  }
}
function LoginMercaderistaComponent_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Ingresar al Sistema ");
  }
}
var LoginMercaderistaComponent = class _LoginMercaderistaComponent {
  constructor(fb, auth, router) {
    this.fb = fb;
    this.auth = auth;
    this.router = router;
    this.loading = signal(false);
    this.error = signal("");
    this.showPass = signal(false);
    this.form = this.fb.group({
      cedula: ["", Validators.required],
      password: ["", Validators.required]
    });
  }
  onSubmit() {
    if (this.form.invalid)
      return;
    this.loading.set(true);
    this.error.set("");
    this.auth.loginMercaderista(this.form.value).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl("/mercaderista");
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.detail ?? "Error al ingresar");
      }
    });
  }
  static {
    this.\u0275fac = function LoginMercaderistaComponent_Factory(t) {
      return new (t || _LoginMercaderistaComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginMercaderistaComponent, selectors: [["app-login-mercaderista"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 42, vars: 6, consts: [[1, "min-h-screen", "relative", "flex", "items-center", "justify-center", "overflow-hidden", "bg-slate-950", "font-sans"], [1, "absolute", "inset-0", "z-0"], [1, "absolute", "top-[-10%]", "left-[-10%]", "w-[40%]", "h-[40%]", "rounded-full", "bg-emerald-600/20", "blur-[120px]", "animate-pulse"], [1, "absolute", "bottom-[-10%]", "right-[-10%]", "w-[40%]", "h-[40%]", "rounded-full", "bg-slate-600/20", "blur-[120px]", "animate-pulse", "delay-700"], [1, "relative", "z-10", "w-full", "max-w-[440px]", "px-6", "animate-in", "fade-in", "zoom-in-95", "duration-700"], [1, "bg-white/[0.03]", "backdrop-blur-2xl", "rounded-[2.5rem]", "border", "border-white/10", "shadow-2xl", "overflow-hidden"], [1, "px-10", "pt-12", "pb-8", "text-center", "border-b", "border-white/5"], [1, "inline-flex", "items-center", "justify-center", "w-16", "h-16", "rounded-2xl", "bg-gradient-to-tr", "from-emerald-600", "to-teal-500", "shadow-xl", "shadow-emerald-500/20", "mb-6"], [1, "text-white", "!text-3xl"], [1, "text-3xl", "font-black", "text-white", "tracking-tighter", "mb-1"], [1, "text-slate-400", "font-medium", "text-sm"], [1, "px-10", "py-10"], [1, "space-y-6", 3, "ngSubmit", "formGroup"], [1, "space-y-2", "group"], [1, "text-[10px]", "font-black", "text-slate-500", "uppercase", "tracking-[0.2em]", "ml-1"], [1, "relative"], [1, "absolute", "left-4", "top-1/2", "-translate-y-1/2", "text-slate-500", "group-focus-within:text-emerald-400", "transition-colors"], ["matInput", "", "formControlName", "cedula", "placeholder", "Ej: V-12345678", 1, "w-full", "h-14", "pl-12", "bg-white/5", "border", "border-white/10", "rounded-2xl", "text-white", "focus:border-emerald-500/50", "focus:ring-4", "focus:ring-emerald-500/10", "transition-all", "outline-none", "font-medium"], ["matInput", "", "formControlName", "password", "placeholder", "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", 1, "w-full", "h-14", "pl-12", "pr-12", "bg-white/5", "border", "border-white/10", "rounded-2xl", "text-white", "focus:border-emerald-500/50", "focus:ring-4", "focus:ring-emerald-500/10", "transition-all", "outline-none", "font-medium", 3, "type"], ["type", "button", 1, "absolute", "right-4", "top-1/2", "-translate-y-1/2", "text-slate-500", "hover:text-white", "transition-colors", 3, "click"], [1, "!text-xl"], [1, "bg-rose-500/10", "border", "border-rose-500/20", "p-4", "rounded-2xl", "flex", "items-center", "gap-3"], ["type", "submit", 1, "w-full", "h-14", "bg-emerald-500", "hover:bg-emerald-600", "disabled:bg-slate-800", "disabled:text-slate-600", "text-white", "rounded-2xl", "font-black", "uppercase", "tracking-widest", "text-xs", "shadow-xl", "shadow-emerald-500/20", "transition-all", "active:scale-[0.98]", 3, "disabled"], ["diameter", "24", 1, "mx-auto"], [1, "px-10", "py-6", "bg-white/[0.02]", "border-t", "border-white/5", "text-center"], ["routerLink", "/login", 1, "inline-flex", "items-center", "gap-2", "text-xs", "font-bold", "text-slate-500", "hover:text-white", "transition-colors"], [1, "!text-sm"], [1, "text-rose-500", "text-sm"], [1, "text-[10px]", "font-bold", "text-rose-200"]], template: function LoginMercaderistaComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
        \u0275\u0275element(2, "div", 2)(3, "div", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "mat-icon", 8);
        \u0275\u0275text(9, "badge");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "h1", 9);
        \u0275\u0275text(11, "Portal Mercaderista");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "p", 10);
        \u0275\u0275text(13, "Autenticaci\xF3n por C\xE9dula");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(14, "div", 11)(15, "form", 12);
        \u0275\u0275listener("ngSubmit", function LoginMercaderistaComponent_Template_form_ngSubmit_15_listener() {
          return ctx.onSubmit();
        });
        \u0275\u0275elementStart(16, "div", 13)(17, "label", 14);
        \u0275\u0275text(18, "Documento de Identidad");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "div", 15)(20, "mat-icon", 16);
        \u0275\u0275text(21, "assignment_ind");
        \u0275\u0275elementEnd();
        \u0275\u0275element(22, "input", 17);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(23, "div", 13)(24, "label", 14);
        \u0275\u0275text(25, "Contrase\xF1a");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(26, "div", 15)(27, "mat-icon", 16);
        \u0275\u0275text(28, "lock");
        \u0275\u0275elementEnd();
        \u0275\u0275element(29, "input", 18);
        \u0275\u0275elementStart(30, "button", 19);
        \u0275\u0275listener("click", function LoginMercaderistaComponent_Template_button_click_30_listener() {
          return ctx.showPass.set(!ctx.showPass());
        });
        \u0275\u0275elementStart(31, "mat-icon", 20);
        \u0275\u0275text(32);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(33, LoginMercaderistaComponent_Conditional_33_Template, 5, 1, "div", 21);
        \u0275\u0275elementStart(34, "button", 22);
        \u0275\u0275template(35, LoginMercaderistaComponent_Conditional_35_Template, 1, 0, "mat-spinner", 23)(36, LoginMercaderistaComponent_Conditional_36_Template, 1, 0);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(37, "div", 24)(38, "a", 25)(39, "mat-icon", 26);
        \u0275\u0275text(40, "arrow_back");
        \u0275\u0275elementEnd();
        \u0275\u0275text(41, " Volver al Login General ");
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(15);
        \u0275\u0275property("formGroup", ctx.form);
        \u0275\u0275advance(14);
        \u0275\u0275property("type", ctx.showPass() ? "text" : "password");
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.showPass() ? "visibility" : "visibility_off");
        \u0275\u0275advance();
        \u0275\u0275conditional(33, ctx.error() ? 33 : -1);
        \u0275\u0275advance();
        \u0275\u0275property("disabled", ctx.loading() || ctx.form.invalid);
        \u0275\u0275advance();
        \u0275\u0275conditional(35, ctx.loading() ? 35 : 36);
      }
    }, dependencies: [
      CommonModule,
      ReactiveFormsModule,
      \u0275NgNoValidate,
      DefaultValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      FormGroupDirective,
      FormControlName,
      RouterLink,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatInput,
      MatButtonModule,
      MatIconModule,
      MatIcon,
      MatProgressSpinnerModule,
      MatProgressSpinner
    ], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=login-mercaderista.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginMercaderistaComponent, { className: "LoginMercaderistaComponent", filePath: "src\\app\\features\\auth\\login-mercaderista\\login-mercaderista.component.ts", lineNumber: 24 });
})();
export {
  LoginMercaderistaComponent
};
//# sourceMappingURL=chunk-EMJHDMQR.js.map
