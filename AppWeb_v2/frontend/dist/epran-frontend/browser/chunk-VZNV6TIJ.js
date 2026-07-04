import {
  MatButtonModule,
  MatIcon,
  MatIconModule
} from "./chunk-KQNRR4FF.js";
import {
  RouterLink
} from "./chunk-QGVFX6Y7.js";
import "./chunk-XGS5Y2XL.js";
import {
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-QB3BCYT5.js";

// src/app/features/auth/unauthorized/unauthorized.component.ts
var UnauthorizedComponent = class _UnauthorizedComponent {
  static {
    this.\u0275fac = function UnauthorizedComponent_Factory(t) {
      return new (t || _UnauthorizedComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UnauthorizedComponent, selectors: [["app-unauthorized"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 25, vars: 0, consts: [[1, "min-h-screen", "flex", "items-center", "justify-center", "bg-slate-50", "p-6"], [1, "bg-white", "rounded-[2.5rem]", "p-12", "shadow-2xl", "border", "border-slate-200", "text-center", "max-w-lg", "w-full", "animate-in", "zoom-in-95", "duration-500"], [1, "w-24", "h-24", "bg-rose-50", "text-rose-500", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-8", "shadow-inner"], [1, "!text-6xl"], [1, "text-3xl", "font-black", "text-slate-800", "tracking-tighter", "mb-4", "uppercase"], [1, "p-6", "bg-slate-50", "rounded-2xl", "border", "border-slate-100", "mb-8"], [1, "text-slate-600", "font-medium", "leading-relaxed"], [1, "text-primary-600", "font-bold", "tracking-tight"], [1, "flex", "flex-col", "gap-3"], ["routerLink", "/dashboard", 1, "flex", "items-center", "justify-center", "gap-2", "h-14", "bg-primary-500", "hover:bg-primary-600", "text-white", "rounded-2xl", "font-bold", "shadow-lg", "shadow-primary-500/20", "transition-all", "active:scale-95"], ["onclick", "window.history.back()", 1, "text-slate-400", "font-bold", "text-sm", "hover:text-slate-600", "transition-colors", "py-2"], [1, "mt-12", "pt-8", "border-t", "border-slate-100", "flex", "items-center", "justify-center", "gap-2", "opacity-30"], [1, "!text-sm"], [1, "text-[10px]", "font-black", "uppercase", "tracking-[0.3em]"]], template: function UnauthorizedComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "mat-icon", 3);
        \u0275\u0275text(4, "lock_person");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(5, "h1", 4);
        \u0275\u0275text(6, "Acceso Denegado");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "div", 5)(8, "p", 6);
        \u0275\u0275text(9, " Su perfil de usuario no cuenta con los privilegios necesarios para visualizar este m\xF3dulo de ");
        \u0275\u0275elementStart(10, "span", 7);
        \u0275\u0275text(11, "Nexus2DI");
        \u0275\u0275elementEnd();
        \u0275\u0275text(12, ". ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(13, "div", 8)(14, "a", 9)(15, "mat-icon");
        \u0275\u0275text(16, "dashboard");
        \u0275\u0275elementEnd();
        \u0275\u0275text(17, " Volver al Panel Principal ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(18, "button", 10);
        \u0275\u0275text(19, " Regresar a la p\xE1gina anterior ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(20, "div", 11)(21, "mat-icon", 12);
        \u0275\u0275text(22, "security");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "span", 13);
        \u0275\u0275text(24, "Protocolo de Seguridad Nexus");
        \u0275\u0275elementEnd()()()();
      }
    }, dependencies: [RouterLink, MatButtonModule, MatIconModule, MatIcon], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n/*# sourceMappingURL=unauthorized.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UnauthorizedComponent, { className: "UnauthorizedComponent", filePath: "src\\app\\features\\auth\\unauthorized\\unauthorized.component.ts", lineNumber: 13 });
})();
export {
  UnauthorizedComponent
};
//# sourceMappingURL=chunk-VZNV6TIJ.js.map
