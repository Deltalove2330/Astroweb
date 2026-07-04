import {
  AuthService
} from "./chunk-FAJEMXMR.js";
import {
  TemplateRef,
  ViewContainerRef,
  inject,
  ɵɵdefineDirective
} from "./chunk-QB3BCYT5.js";

// src/app/core/directives/has-perm.directive.ts
var HasPermDirective = class _HasPermDirective {
  constructor() {
    this.tpl = inject(TemplateRef);
    this.vcr = inject(ViewContainerRef);
    this.auth = inject(AuthService);
    this.shown = false;
    this.key = "";
    this.act = "read";
  }
  set hasPerm(clave) {
    this.key = clave;
    this.update();
  }
  set hasPermAction(a) {
    this.act = a || "read";
    this.update();
  }
  update() {
    if (!this.key)
      return;
    const ok = this.auth.can(this.key, this.act);
    if (ok && !this.shown) {
      this.vcr.createEmbeddedView(this.tpl);
      this.shown = true;
    } else if (!ok && this.shown) {
      this.vcr.clear();
      this.shown = false;
    }
  }
  static {
    this.\u0275fac = function HasPermDirective_Factory(t) {
      return new (t || _HasPermDirective)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({ type: _HasPermDirective, selectors: [["", "hasPerm", ""]], inputs: { hasPerm: "hasPerm", hasPermAction: "hasPermAction" }, standalone: true });
  }
};

export {
  HasPermDirective
};
//# sourceMappingURL=chunk-RNOX4RCL.js.map
