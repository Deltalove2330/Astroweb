import {
  MatProgressSpinner,
  MatProgressSpinnerModule
} from "./chunk-EGRIEE5E.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-KQNRR4FF.js";
import {
  CommonModule,
  InputFlags,
  computed,
  input,
  output,
  signal,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate2
} from "./chunk-QB3BCYT5.js";

// src/app/shared/photo-lightbox/photo-lightbox.component.ts
var _c0 = ["*", [["", "lightbox-sidebar", ""]]];
var _c1 = ["*", "[lightbox-sidebar]"];
function PhotoLightboxComponent_Conditional_0_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate2(" ", ctx_r1.currentIndex() + 1, " / ", ctx_r1.photos().length, " ");
  }
}
function PhotoLightboxComponent_Conditional_0_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 16);
    \u0275\u0275listener("click", function PhotoLightboxComponent_Conditional_0_Conditional_12_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.prev());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "chevron_left");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.currentIndex() === 0);
  }
}
function PhotoLightboxComponent_Conditional_0_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 17);
    \u0275\u0275listener("load", function PhotoLightboxComponent_Conditional_0_Conditional_14_Template_img_load_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onImgLoad());
    })("error", function PhotoLightboxComponent_Conditional_0_Conditional_14_Template_img_error_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onImgError());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275styleProp("opacity", ctx_r1.loading() ? 0.25 : 1);
    \u0275\u0275property("src", ctx_r1.currentUrl(), \u0275\u0275sanitizeUrl);
  }
}
function PhotoLightboxComponent_Conditional_0_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275element(1, "mat-spinner", 18);
    \u0275\u0275elementEnd();
  }
}
function PhotoLightboxComponent_Conditional_0_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 19);
    \u0275\u0275listener("click", function PhotoLightboxComponent_Conditional_0_Conditional_16_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.next());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "chevron_right");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.currentIndex() === ctx_r1.photos().length - 1);
  }
}
function PhotoLightboxComponent_Conditional_0_Conditional_17_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 21);
    \u0275\u0275listener("click", function PhotoLightboxComponent_Conditional_0_Conditional_17_For_2_Template_span_click_0_listener() {
      const dot_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.goTo(dot_r7));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const dot_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("active", ctx_r1.currentIndex() === dot_r7);
  }
}
function PhotoLightboxComponent_Conditional_0_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275repeaterCreate(1, PhotoLightboxComponent_Conditional_0_Conditional_17_For_2_Template, 1, 2, "span", 20, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.dots());
  }
}
function PhotoLightboxComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275listener("click", function PhotoLightboxComponent_Conditional_0_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.close());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "div", 1);
    \u0275\u0275listener("click", function PhotoLightboxComponent_Conditional_0_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 2)(3, "div", 3)(4, "h3", 4);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 5);
    \u0275\u0275template(7, PhotoLightboxComponent_Conditional_0_Conditional_7_Template, 1, 2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 6);
    \u0275\u0275listener("click", function PhotoLightboxComponent_Conditional_0_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.close());
    });
    \u0275\u0275elementStart(9, "mat-icon");
    \u0275\u0275text(10, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 7);
    \u0275\u0275template(12, PhotoLightboxComponent_Conditional_0_Conditional_12_Template, 3, 1, "button", 8);
    \u0275\u0275elementStart(13, "div", 9);
    \u0275\u0275template(14, PhotoLightboxComponent_Conditional_0_Conditional_14_Template, 1, 3, "img", 10)(15, PhotoLightboxComponent_Conditional_0_Conditional_15_Template, 2, 0, "div", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275template(16, PhotoLightboxComponent_Conditional_0_Conditional_16_Template, 3, 1, "button", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275template(17, PhotoLightboxComponent_Conditional_0_Conditional_17_Template, 3, 0, "div", 13);
    \u0275\u0275elementStart(18, "div", 14);
    \u0275\u0275projection(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 15);
    \u0275\u0275projection(21, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.title() || " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(7, ctx_r1.photos().length > 1 ? 7 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(12, ctx_r1.photos().length > 1 ? 12 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(14, ctx_r1.currentUrl() ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(15, ctx_r1.loading() ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(16, ctx_r1.photos().length > 1 ? 16 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(17, ctx_r1.photos().length > 1 ? 17 : -1);
  }
}
var PhotoLightboxComponent = class _PhotoLightboxComponent {
  constructor() {
    this.open = input(false);
    this.photos = input([]);
    this.startIndex = input(0);
    this.title = input("");
    this.closed = output();
    this.indexChange = output();
    this.currentIndex = signal(0);
    this.loading = signal(false);
    this.preloadCache = /* @__PURE__ */ new Set();
    this.currentUrl = computed(() => this.urlOf(this.photos()[this.currentIndex()]));
    this.dots = computed(() => Array.from({ length: Math.min(this.photos().length, 14) }, (_, i) => i));
  }
  ngOnChanges(ch) {
    if (ch["open"] && this.open()) {
      const start = Math.max(0, Math.min(this.startIndex(), this.photos().length - 1));
      this.currentIndex.set(start);
      const url = this.urlOf(this.photos()[start]);
      this.loading.set(!!url && !this.preloadCache.has(url));
      this.preloadAround(start);
      document.body.classList.add("modal-open");
    }
    if (ch["open"] && !this.open()) {
      document.body.classList.remove("modal-open");
    }
    if (ch["photos"]) {
      this.preloadCache.clear();
    }
  }
  close() {
    document.body.classList.remove("modal-open");
    this.closed.emit();
  }
  prev() {
    if (this.currentIndex() > 0)
      this.goTo(this.currentIndex() - 1);
  }
  next() {
    if (this.currentIndex() < this.photos().length - 1)
      this.goTo(this.currentIndex() + 1);
  }
  goTo(i) {
    if (i === this.currentIndex())
      return;
    const url = this.urlOf(this.photos()[i]);
    this.loading.set(!!url && !this.preloadCache.has(url));
    this.currentIndex.set(i);
    this.preloadAround(i);
    this.indexChange.emit(i);
  }
  onImgLoad() {
    const url = this.currentUrl();
    if (url)
      this.preloadCache.add(url);
    this.loading.set(false);
  }
  onImgError() {
    this.loading.set(false);
  }
  urlOf(p) {
    if (!p)
      return null;
    return p.url || p.file_path || null;
  }
  preloadAround(index) {
    const fotos = this.photos();
    for (const i of [index, index + 1, index - 1, index + 2]) {
      const url = this.urlOf(fotos[i]);
      if (url && !this.preloadCache.has(url)) {
        const img = new Image();
        img.onload = () => this.preloadCache.add(url);
        img.src = url;
      }
    }
  }
  onKey(e) {
    if (!this.open())
      return;
    if (e.key === "ArrowLeft") {
      this.prev();
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      this.next();
      e.preventDefault();
    } else if (e.key === "Escape") {
      this.close();
      e.preventDefault();
    }
  }
  static {
    this.\u0275fac = function PhotoLightboxComponent_Factory(t) {
      return new (t || _PhotoLightboxComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PhotoLightboxComponent, selectors: [["app-photo-lightbox"]], hostBindings: function PhotoLightboxComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("keydown", function PhotoLightboxComponent_keydown_HostBindingHandler($event) {
          return ctx.onKey($event);
        }, false, \u0275\u0275resolveDocument);
      }
    }, inputs: { open: [InputFlags.SignalBased, "open"], photos: [InputFlags.SignalBased, "photos"], startIndex: [InputFlags.SignalBased, "startIndex"], title: [InputFlags.SignalBased, "title"] }, outputs: { closed: "closed", indexChange: "indexChange" }, standalone: true, features: [\u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature], ngContentSelectors: _c1, decls: 1, vars: 1, consts: [[1, "pl-backdrop", 3, "click"], [1, "pl-modal", 3, "click"], [1, "pl-main-content"], [1, "pl-header"], [1, "pl-title"], [1, "pl-counter"], ["type", "button", "aria-label", "Cerrar", 1, "pl-close", 3, "click"], [1, "pl-body"], ["type", "button", "aria-label", "Anterior", 1, "pl-nav", "pl-prev", 3, "disabled"], [1, "pl-img-wrap"], ["alt", "Foto", 3, "src", "opacity"], [1, "pl-loading"], ["type", "button", "aria-label", "Siguiente", 1, "pl-nav", "pl-next", 3, "disabled"], [1, "pl-dots"], [1, "pl-footer"], [1, "pl-sidebar-container"], ["type", "button", "aria-label", "Anterior", 1, "pl-nav", "pl-prev", 3, "click", "disabled"], ["alt", "Foto", 3, "load", "error", "src"], ["diameter", "42", "strokeWidth", "3"], ["type", "button", "aria-label", "Siguiente", 1, "pl-nav", "pl-next", 3, "click", "disabled"], [1, "pl-dot", 3, "active"], [1, "pl-dot", 3, "click"]], template: function PhotoLightboxComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c0);
        \u0275\u0275template(0, PhotoLightboxComponent_Conditional_0_Template, 22, 7);
      }
      if (rf & 2) {
        \u0275\u0275conditional(0, ctx.open() ? 0 : -1);
      }
    }, dependencies: [CommonModule, MatIconModule, MatIcon, MatProgressSpinnerModule, MatProgressSpinner], styles: ["\n\n[_nghost-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 10000;\n  pointer-events: none;\n}\n.pl-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.85);\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n  pointer-events: auto;\n  animation: _ngcontent-%COMP%_pl-fade 0.15s;\n}\n.pl-modal[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  pointer-events: auto;\n  display: flex;\n  flex-direction: row;\n  max-width: 100vw;\n  max-height: 100vh;\n  animation: _ngcontent-%COMP%_pl-zoom 0.18s ease-out;\n}\n.pl-main-content[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n.pl-sidebar-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.2);\n  z-index: 10;\n  animation: _ngcontent-%COMP%_slide-in-right 0.2s ease-out;\n}\n.pl-sidebar-container[_ngcontent-%COMP%]:empty {\n  display: none;\n}\n@keyframes _ngcontent-%COMP%_pl-fade {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_pl-zoom {\n  from {\n    opacity: 0;\n    transform: scale(0.96);\n  }\n  to {\n    opacity: 1;\n    transform: none;\n  }\n}\n@keyframes _ngcontent-%COMP%_slide-in-right {\n  from {\n    transform: translateX(100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n.pl-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 0.85rem 1.25rem;\n  color: #fff;\n  font-weight: 600;\n}\n.pl-title[_ngcontent-%COMP%] {\n  flex: 1;\n  margin: 0;\n  font-size: 1.05rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.pl-counter[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  opacity: 0.7;\n  font-weight: 500;\n  min-width: 60px;\n  text-align: right;\n}\n.pl-close[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  border: 0;\n  background: rgba(255, 255, 255, 0.12);\n  color: #fff;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  transition: background 0.15s;\n}\n.pl-close[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.22);\n}\n.pl-body[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  padding: 0 0.5rem;\n  min-height: 0;\n}\n.pl-img-wrap[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  min-height: 0;\n}\n.pl-img-wrap[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: 100%;\n  max-height: 70vh;\n  object-fit: contain;\n  border-radius: 8px;\n  transition: opacity 0.15s;\n  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);\n}\n.pl-loading[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  pointer-events: none;\n}\n.pl-nav[_ngcontent-%COMP%] {\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  border: 0;\n  background: rgba(255, 255, 255, 0.12);\n  color: #fff;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  transition: background 0.15s;\n  flex-shrink: 0;\n}\n.pl-nav[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: rgba(255, 255, 255, 0.22);\n}\n.pl-nav[_ngcontent-%COMP%]:disabled {\n  opacity: 0.25;\n  cursor: not-allowed;\n}\n.pl-nav[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 28px;\n  width: 28px;\n  height: 28px;\n}\n.pl-dots[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  justify-content: center;\n  padding: 0.5rem 1rem;\n}\n.pl-dot[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.25);\n  cursor: pointer;\n  transition: background 0.15s, transform 0.15s;\n}\n.pl-dot[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.5);\n}\n.pl-dot.active[_ngcontent-%COMP%] {\n  background: #a78bfa;\n  transform: scale(1.3);\n}\n.pl-footer[_ngcontent-%COMP%] {\n  padding: 0.75rem 1.25rem 1.25rem;\n  color: #fff;\n}\n.pl-footer[_ngcontent-%COMP%]:empty {\n  display: none;\n}\n/*# sourceMappingURL=photo-lightbox.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PhotoLightboxComponent, { className: "PhotoLightboxComponent", filePath: "src\\app\\shared\\photo-lightbox\\photo-lightbox.component.ts", lineNumber: 180 });
})();

export {
  PhotoLightboxComponent
};
//# sourceMappingURL=chunk-6JKMYGP7.js.map
