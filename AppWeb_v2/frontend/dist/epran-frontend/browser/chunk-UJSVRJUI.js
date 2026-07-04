import {
  PhotoLightboxComponent
} from "./chunk-6JKMYGP7.js";
import {
  MatInputModule
} from "./chunk-GXZEZIYO.js";
import {
  AuthService
} from "./chunk-FAJEMXMR.js";
import {
  MatSelectModule
} from "./chunk-DD2LOOAS.js";
import {
  MatFormFieldModule
} from "./chunk-YUDUWHLJ.js";
import "./chunk-CELNEZAJ.js";
import "./chunk-ABO6AUNU.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
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
  MatIconModule
} from "./chunk-KQNRR4FF.js";
import "./chunk-QGVFX6Y7.js";
import "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  CommonModule,
  ElementRef,
  EventEmitter,
  InputFlags,
  __spreadProps,
  __spreadValues,
  computed,
  inject,
  input,
  model,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
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
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-QB3BCYT5.js";

// src/app/features/client-visits/searchable-select.component.ts
var _forTrack0 = ($index, $item) => $item.value;
function SearchableSelectComponent_Conditional_8_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 16);
    \u0275\u0275listener("click", function SearchableSelectComponent_Conditional_8_Conditional_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.search.set(""));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "close");
    \u0275\u0275elementEnd()();
  }
}
function SearchableSelectComponent_Conditional_8_For_14_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 19);
    \u0275\u0275text(1, "check");
    \u0275\u0275elementEnd();
  }
}
function SearchableSelectComponent_Conditional_8_For_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 17);
    \u0275\u0275listener("click", function SearchableSelectComponent_Conditional_8_For_14_Template_button_click_0_listener() {
      const opt_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.pick(opt_r5.value));
    });
    \u0275\u0275elementStart(1, "span", 18);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, SearchableSelectComponent_Conditional_8_For_14_Conditional_3_Template, 2, 0, "mat-icon", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opt_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("ss-active", opt_r5.value === ctx_r1.value());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(opt_r5.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(3, opt_r5.value === ctx_r1.value() ? 3 : -1);
  }
}
function SearchableSelectComponent_Conditional_8_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15)(1, "mat-icon");
    \u0275\u0275text(2, "search_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Sin coincidencias");
    \u0275\u0275elementEnd()();
  }
}
function SearchableSelectComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "div", 7)(2, "mat-icon", 8);
    \u0275\u0275text(3, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 9, 0);
    \u0275\u0275listener("ngModelChange", function SearchableSelectComponent_Conditional_8_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.search.set($event));
    })("keydown.escape", function SearchableSelectComponent_Conditional_8_Template_input_keydown_escape_4_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.close());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, SearchableSelectComponent_Conditional_8_Conditional_6_Template, 3, 0, "button", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 11)(8, "button", 12);
    \u0275\u0275listener("click", function SearchableSelectComponent_Conditional_8_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.pick(""));
    });
    \u0275\u0275elementStart(9, "mat-icon", 13);
    \u0275\u0275text(10, "all_inclusive");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(13, SearchableSelectComponent_Conditional_8_For_14_Template, 4, 4, "button", 14, _forTrack0);
    \u0275\u0275template(15, SearchableSelectComponent_Conditional_8_Conditional_15_Template, 5, 0, "div", 15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r1.search())("placeholder", ctx_r1.searchPlaceholder());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(6, ctx_r1.search() ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("ss-active", !ctx_r1.value());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.allLabel());
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.filtered());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(15, ctx_r1.filtered().length === 0 ? 15 : -1);
  }
}
var SearchableSelectComponent = class _SearchableSelectComponent {
  constructor() {
    this.options = input([]);
    this.value = model("");
    this.placeholder = input("Selecciona...");
    this.searchPlaceholder = input("Buscar...");
    this.allLabel = input("Todos");
    this.icon = input("list");
    this.valueChange = new EventEmitter();
    this.open = signal(false);
    this.search = signal("");
    this.host = inject(ElementRef);
    this.selectedLabel = computed(() => {
      const opt = this.options().find((o) => o.value === this.value());
      return opt ? opt.label : "";
    });
    this.filtered = computed(() => {
      const q = this.search().trim().toLowerCase();
      const opts = this.options();
      if (!q)
        return opts;
      return opts.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q));
    });
  }
  toggle() {
    this.open.update((v) => !v);
    if (this.open())
      this.search.set("");
  }
  close() {
    this.open.set(false);
  }
  pick(v) {
    this.value.set(v);
    this.valueChange.emit(v);
    this.close();
  }
  onDocClick(e) {
    if (this.open() && !this.host.nativeElement.contains(e.target))
      this.close();
  }
  static {
    this.\u0275fac = function SearchableSelectComponent_Factory(t) {
      return new (t || _SearchableSelectComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SearchableSelectComponent, selectors: [["app-searchable-select"]], hostBindings: function SearchableSelectComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("click", function SearchableSelectComponent_click_HostBindingHandler($event) {
          return ctx.onDocClick($event);
        }, false, \u0275\u0275resolveDocument);
      }
    }, inputs: { options: [InputFlags.SignalBased, "options"], value: [InputFlags.SignalBased, "value"], placeholder: [InputFlags.SignalBased, "placeholder"], searchPlaceholder: [InputFlags.SignalBased, "searchPlaceholder"], allLabel: [InputFlags.SignalBased, "allLabel"], icon: [InputFlags.SignalBased, "icon"] }, outputs: { value: "valueChange", valueChange: "valueChange" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 9, vars: 8, consts: [["searchInput", ""], [1, "ss-wrap"], ["type", "button", 1, "ss-trigger", 3, "click"], [1, "ss-trigger-icon"], [1, "ss-trigger-text"], [1, "ss-trigger-chevron"], [1, "ss-panel"], [1, "ss-search"], [1, "ss-search-icon"], ["autofocus", "", 3, "ngModelChange", "keydown.escape", "ngModel", "placeholder"], ["type", "button", 1, "ss-clear-search"], [1, "ss-list"], ["type", "button", 1, "ss-item", "ss-item-all", 3, "click"], [1, "ss-item-icon"], ["type", "button", 1, "ss-item", 3, "ss-active"], [1, "ss-empty"], ["type", "button", 1, "ss-clear-search", 3, "click"], ["type", "button", 1, "ss-item", 3, "click"], [1, "ss-item-label"], [1, "ss-check"]], template: function SearchableSelectComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 1)(1, "button", 2);
        \u0275\u0275listener("click", function SearchableSelectComponent_Template_button_click_1_listener() {
          return ctx.toggle();
        });
        \u0275\u0275elementStart(2, "mat-icon", 3);
        \u0275\u0275text(3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "span", 4);
        \u0275\u0275text(5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "mat-icon", 5);
        \u0275\u0275text(7);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(8, SearchableSelectComponent_Conditional_8_Template, 16, 7, "div", 6);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275classProp("ss-open", ctx.open());
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.icon());
        \u0275\u0275advance();
        \u0275\u0275classProp("ss-placeholder", !ctx.selectedLabel());
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.selectedLabel() || ctx.placeholder(), " ");
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.open() ? "expand_less" : "expand_more");
        \u0275\u0275advance();
        \u0275\u0275conditional(8, ctx.open() ? 8 : -1);
      }
    }, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, MatIconModule, MatIcon], styles: ["\n\n.ss-wrap[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n}\n.ss-trigger[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  width: 100%;\n  padding: 0.55rem 0.75rem;\n  background: rgba(255, 255, 255, 0.05);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  border-radius: 0.75rem;\n  color: inherit;\n  cursor: pointer;\n  font: inherit;\n  text-align: left;\n  transition: border-color 0.15s, background 0.15s;\n}\n.ss-trigger[_ngcontent-%COMP%]:hover {\n  border-color: rgba(124, 58, 237, 0.5);\n}\n.ss-open[_ngcontent-%COMP%]   .ss-trigger[_ngcontent-%COMP%] {\n  border-color: #7c3aed;\n  background: rgba(124, 58, 237, 0.08);\n}\n.ss-trigger-icon[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  width: 1.1rem;\n  height: 1.1rem;\n  opacity: 0.7;\n}\n.ss-trigger-text[_ngcontent-%COMP%] {\n  flex: 1;\n  font-size: 0.875rem;\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.ss-placeholder[_ngcontent-%COMP%] {\n  opacity: 0.5;\n  font-weight: 400;\n}\n.ss-trigger-chevron[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  width: 1.1rem;\n  height: 1.1rem;\n  opacity: 0.5;\n}\n.ss-panel[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 1000;\n  top: calc(100% + 4px);\n  left: 0;\n  right: 0;\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 0.75rem;\n  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);\n  overflow: hidden;\n  animation: _ngcontent-%COMP%_ss-fade 0.12s ease-out;\n  color: #1e293b;\n  transition: background 0.3s, border-color 0.3s;\n}\n.dark[_nghost-%COMP%]   .ss-panel[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .ss-panel[_ngcontent-%COMP%] {\n  background: #1f2937;\n  border-color: rgba(255, 255, 255, 0.1);\n  color: #f1f5f9;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);\n}\n@keyframes _ngcontent-%COMP%_ss-fade {\n  from {\n    opacity: 0;\n    transform: translateY(-4px);\n  }\n  to {\n    opacity: 1;\n    transform: none;\n  }\n}\n.ss-search[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.6rem 0.75rem;\n  background: #f8fafc;\n  border-bottom: 1px solid #f1f5f9;\n}\n.dark[_nghost-%COMP%]   .ss-search[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .ss-search[_ngcontent-%COMP%] {\n  background: rgba(0, 0, 0, 0.2);\n  border-bottom-color: rgba(255, 255, 255, 0.05);\n}\n.ss-search-icon[_ngcontent-%COMP%] {\n  color: #64748b;\n  font-size: 1.1rem;\n  width: 1.1rem;\n  height: 1.1rem;\n}\n.ss-search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  flex: 1;\n  background: transparent;\n  border: 0;\n  outline: 0;\n  color: #1e293b;\n  font: inherit;\n  font-size: 0.875rem;\n}\n.dark[_nghost-%COMP%]   .ss-search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .ss-search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  color: #fff;\n}\n.ss-search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::placeholder {\n  color: #94a3b8;\n}\n.ss-clear-search[_ngcontent-%COMP%] {\n  background: transparent;\n  border: 0;\n  cursor: pointer;\n  padding: 2px;\n  color: #64748b;\n  display: inline-flex;\n}\n.ss-clear-search[_ngcontent-%COMP%]:hover {\n  color: #1e293b;\n}\n.dark[_nghost-%COMP%]   .ss-clear-search[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .ss-clear-search[_ngcontent-%COMP%]:hover {\n  color: #fff;\n}\n.ss-clear-search[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  width: 1rem;\n  height: 1rem;\n}\n.ss-list[_ngcontent-%COMP%] {\n  max-height: 280px;\n  overflow-y: auto;\n  padding: 0.35rem;\n}\n.ss-list[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 5px;\n}\n.ss-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #e2e8f0;\n  border-radius: 10px;\n}\n.dark[_nghost-%COMP%]   .ss-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb, .dark   [_nghost-%COMP%]   .ss-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: rgba(255, 255, 255, 0.1);\n}\n.ss-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.6rem;\n  width: 100%;\n  padding: 0.55rem 0.75rem;\n  background: transparent;\n  border: 0;\n  cursor: pointer;\n  color: #334155;\n  font: inherit;\n  text-align: left;\n  border-radius: 0.5rem;\n  font-size: 0.875rem;\n  transition: all 0.15s;\n}\n.dark[_nghost-%COMP%]   .ss-item[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .ss-item[_ngcontent-%COMP%] {\n  color: #cbd5e1;\n}\n.ss-item[_ngcontent-%COMP%]:hover {\n  background: #f1f5f9;\n  color: #7c3aed;\n}\n.dark[_nghost-%COMP%]   .ss-item[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .ss-item[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.05);\n  color: #a78bfa;\n}\n.ss-active[_ngcontent-%COMP%] {\n  background: #f5f3ff;\n  color: #7c3aed;\n  font-weight: 600;\n}\n.dark[_nghost-%COMP%]   .ss-active[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .ss-active[_ngcontent-%COMP%] {\n  background: rgba(124, 58, 237, 0.15);\n  color: #a78bfa;\n}\n.ss-item-icon[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  width: 1.1rem;\n  height: 1.1rem;\n  opacity: 0.7;\n}\n.ss-item-label[_ngcontent-%COMP%] {\n  flex: 1;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.ss-check[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  width: 1.1rem;\n  height: 1.1rem;\n  color: #7c3aed;\n}\n.dark[_nghost-%COMP%]   .ss-check[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .ss-check[_ngcontent-%COMP%] {\n  color: #a78bfa;\n}\n.ss-item-all[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #f1f5f9;\n  border-radius: 0;\n  margin-bottom: 4px;\n  padding-bottom: 0.6rem;\n  color: #64748b;\n}\n.dark[_nghost-%COMP%]   .ss-item-all[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .ss-item-all[_ngcontent-%COMP%] {\n  border-bottom-color: rgba(255, 255, 255, 0.05);\n  color: #94a3b8;\n}\n.ss-item-all[_ngcontent-%COMP%]:hover {\n  color: #7c3aed;\n}\n.dark[_nghost-%COMP%]   .ss-item-all[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .ss-item-all[_ngcontent-%COMP%]:hover {\n  color: #a78bfa;\n}\n.ss-empty[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 2rem 1rem;\n  color: #94a3b8;\n  font-size: 0.875rem;\n}\n.ss-empty[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  width: 1.75rem;\n  height: 1.75rem;\n  opacity: 0.5;\n}\n/*# sourceMappingURL=searchable-select.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SearchableSelectComponent, { className: "SearchableSelectComponent", filePath: "src\\app\\features\\client-visits\\searchable-select.component.ts", lineNumber: 175 });
})();

// src/app/features/client-visits/client-visits.component.ts
var _forTrack02 = ($index, $item) => $item.id_cliente;
var _forTrack1 = ($index, $item) => $item.name;
var _forTrack2 = ($index, $item) => $item.id_visita;
var _forTrack3 = ($index, $item) => $item.nombre;
function ClientVisitsComponent_Conditional_1_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275element(1, "mat-spinner", 6);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Cargando clientes...");
    \u0275\u0275elementEnd()();
  }
}
function ClientVisitsComponent_Conditional_1_Conditional_11_For_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1, "Exclusivo");
    \u0275\u0275elementEnd();
  }
}
function ClientVisitsComponent_Conditional_1_Conditional_11_For_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1, "Tradex");
    \u0275\u0275elementEnd();
  }
}
function ClientVisitsComponent_Conditional_1_Conditional_11_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 10);
    \u0275\u0275listener("click", function ClientVisitsComponent_Conditional_1_Conditional_11_For_2_Template_button_click_0_listener() {
      const c_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.selectExclusiveClient(c_r4));
    });
    \u0275\u0275elementStart(1, "mat-icon", 11);
    \u0275\u0275text(2, "business");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 12);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, ClientVisitsComponent_Conditional_1_Conditional_11_For_2_Conditional_5_Template, 2, 0, "span", 13)(6, ClientVisitsComponent_Conditional_1_Conditional_11_For_2_Conditional_6_Template, 2, 0);
    \u0275\u0275elementStart(7, "mat-icon", 14);
    \u0275\u0275text(8, "arrow_forward");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r4 = ctx.$implicit;
    const i_r5 = ctx.$index;
    \u0275\u0275styleProp("animation-delay", i_r5 * 40 + "ms");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(c_r4.cliente);
    \u0275\u0275advance();
    \u0275\u0275conditional(5, c_r4.id_tipo_cliente === 3 ? 5 : c_r4.id_tipo_cliente === 1 ? 6 : -1);
  }
}
function ClientVisitsComponent_Conditional_1_Conditional_11_ForEmpty_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 9);
    \u0275\u0275text(1, "No hay clientes disponibles.");
    \u0275\u0275elementEnd();
  }
}
function ClientVisitsComponent_Conditional_1_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275repeaterCreate(1, ClientVisitsComponent_Conditional_1_Conditional_11_For_2_Template, 9, 4, "button", 8, _forTrack02, false, ClientVisitsComponent_Conditional_1_Conditional_11_ForEmpty_3_Template, 2, 0, "p", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.filteredExclusiveClients());
  }
}
function ClientVisitsComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "mat-icon");
    \u0275\u0275text(3, "business");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h2");
    \u0275\u0275text(5, "Selecciona un Cliente");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 3)(7, "mat-icon");
    \u0275\u0275text(8, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 4);
    \u0275\u0275listener("ngModelChange", function ClientVisitsComponent_Conditional_1_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.exclusiveClientSearch.set($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(10, ClientVisitsComponent_Conditional_1_Conditional_10_Template, 4, 0, "div", 5)(11, ClientVisitsComponent_Conditional_1_Conditional_11_Template, 4, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275property("ngModel", ctx_r1.exclusiveClientSearch());
    \u0275\u0275advance();
    \u0275\u0275conditional(10, ctx_r1.loading() ? 10 : 11);
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "div", 41)(2, "mat-icon");
    \u0275\u0275text(3, "business");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span")(5, "strong");
    \u0275\u0275text(6, "Cliente:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "button", 42);
    \u0275\u0275listener("click", function ClientVisitsComponent_Conditional_2_Conditional_0_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.changeExclusiveClient());
    });
    \u0275\u0275elementStart(9, "mat-icon");
    \u0275\u0275text(10, "swap_horiz");
    \u0275\u0275elementEnd();
    \u0275\u0275text(11, " Cambiar cliente ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", ctx_r1.selectedExclusiveClient().cliente, "");
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F4C5} Visitas de hoy ");
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" \u{1F4C5} Visitas del ", ctx_r1.formatDateShort(ctx_r1.bannerInfo().fechaInicio), " ");
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate2(" \u{1F4C5} Visitas (", ctx_r1.formatDateShort(ctx_r1.bannerInfo().fechaInicio), " - ", ctx_r1.formatDateShort(ctx_r1.bannerInfo().fechaFin), ") ");
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatDateHuman(ctx_r1.bannerInfo().fechaInicio), " ");
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate2(" Del ", ctx_r1.formatDateHuman(ctx_r1.bannerInfo().fechaInicio), " al ", ctx_r1.formatDateHuman(ctx_r1.bannerInfo().fechaFin), " ");
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38);
    \u0275\u0275element(1, "div", 43)(2, "div", 43)(3, "div", 43);
    \u0275\u0275elementEnd();
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_57_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "span", 44);
    \u0275\u0275text(2, "\u26A0\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 45);
    \u0275\u0275text(4, "Ocurri\xF3 un error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 46);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 47);
    \u0275\u0275listener("click", function ClientVisitsComponent_Conditional_2_Conditional_57_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cargarVisitas());
    });
    \u0275\u0275elementStart(8, "mat-icon");
    \u0275\u0275text(9, "refresh");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10, " Reintentar ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_58_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "span", 44);
    \u0275\u0275text(2, "\u{1F50D}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 45);
    \u0275\u0275text(4, "Sin visitas para este d\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 46);
    \u0275\u0275text(6, "No se encontraron visitas con los filtros aplicados.");
    \u0275\u0275element(7, "br");
    \u0275\u0275text(8, "Prueba cambiando la fecha o limpiando los filtros.");
    \u0275\u0275elementEnd()();
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 60);
  }
  if (rf & 2) {
    const visita_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", visita_r10.preview_foto, \u0275\u0275sanitizeUrl);
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 74);
    \u0275\u0275text(1, "\u{1F4F7}");
    \u0275\u0275elementEnd();
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 61);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const visita_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", visita_r10.total_fotos, " \u{1F4F8}");
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 67)(1, "mat-icon");
    \u0275\u0275text(2, "schedule");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const visita_r10 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(6);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatTime(visita_r10.fecha_visita), " ");
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 69);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const visita_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\u{1F306} ", visita_r10.ciudad, "");
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_For_33_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 81);
    \u0275\u0275listener("error", function ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_For_33_Conditional_0_Conditional_2_Template_img_error_0_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(9);
      return \u0275\u0275resetView(ctx_r1.onImageError($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "div", 82)(2, "span", 83);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const fotos_r12 = \u0275\u0275nextContext();
    const cfg_r13 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", fotos_r12[0].file_path, \u0275\u0275sanitizeUrl)("alt", cfg_r13.nombre);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(fotos_r12.length);
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_For_33_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 84);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cfg_r13 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275styleProp("color", cfg_r13.color + "80")("background-color", cfg_r13.color + "12");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", cfg_r13.emoji, " ");
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_For_33_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 76);
    \u0275\u0275listener("click", function ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_For_33_Conditional_0_Template_div_click_0_listener($event) {
      const fotos_r12 = \u0275\u0275restoreView(_r11);
      const cfg_r13 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r1.openCarousel(cfg_r13.nombre, fotos_r12, $event));
    });
    \u0275\u0275elementStart(1, "div", 77);
    \u0275\u0275template(2, ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_For_33_Conditional_0_Conditional_2_Template, 4, 3)(3, ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_For_33_Conditional_0_Conditional_3_Template, 2, 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 78)(5, "p", 79);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 80);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const fotos_r12 = ctx;
    const cfg_r13 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classProp("has-fotos", fotos_r12.length > 0)("empty", fotos_r12.length === 0);
    \u0275\u0275attribute("role", fotos_r12.length > 0 ? "button" : null)("tabindex", fotos_r12.length > 0 ? "0" : null);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(2, fotos_r12.length > 0 && fotos_r12[0].file_path ? 2 : 3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(cfg_r13.nombre);
    \u0275\u0275advance();
    \u0275\u0275classProp("has-fotos", fotos_r12.length > 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", fotos_r12.length > 0 ? fotos_r12.length + " foto" + (fotos_r12.length !== 1 ? "s" : "") : "Sin fotos", " ");
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_For_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_For_33_Conditional_0_Template, 9, 11, "div", 75);
  }
  if (rf & 2) {
    let tmp_52_0;
    const cfg_r13 = ctx.$implicit;
    const visita_r10 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(6);
    \u0275\u0275conditional(0, (tmp_52_0 = ctx_r1.getFotosForCategoria(visita_r10, cfg_r13.nombre)) ? 0 : -1, tmp_52_0);
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 57);
    \u0275\u0275listener("click", function ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_Template_div_click_0_listener() {
      const visita_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.toggleCard(visita_r10));
    });
    \u0275\u0275elementStart(1, "div", 58)(2, "div", 59);
    \u0275\u0275template(3, ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_Conditional_3_Template, 1, 1, "img", 60)(4, ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_Conditional_4_Template, 2, 0)(5, ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_Conditional_5_Template, 2, 1, "span", 61);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 62)(7, "div")(8, "div", 63)(9, "span", 64);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 65);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 66)(14, "span", 67)(15, "mat-icon");
    \u0275\u0275text(16, "person");
    \u0275\u0275elementEnd();
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275template(18, ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_Conditional_18_Template, 4, 1, "span", 67);
    \u0275\u0275elementStart(19, "span", 67)(20, "mat-icon");
    \u0275\u0275text(21, "business");
    \u0275\u0275elementEnd();
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 68);
    \u0275\u0275template(24, ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_Conditional_24_Template, 2, 1, "span", 69);
    \u0275\u0275elementStart(25, "span", 70);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(27, "div", 71)(28, "mat-icon");
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "div", 72)(31, "div", 73);
    \u0275\u0275repeaterCreate(32, ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_For_33_Template, 1, 1, null, null, _forTrack3);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const visita_r10 = ctx.$implicit;
    const idx_r15 = ctx.$index;
    const ctx_r1 = \u0275\u0275nextContext(6);
    \u0275\u0275styleProp("animation-delay", idx_r15 * 40 + "ms");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(3, visita_r10.preview_foto ? 3 : 4);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(5, visita_r10.total_fotos > 0 ? 5 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(visita_r10.punto_nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("#", visita_r10.id_visita, "");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", visita_r10.mercaderista || "Sin asignar", " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(18, visita_r10.fecha_visita ? 18 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", visita_r10.cliente_nombre || "", " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(24, visita_r10.ciudad ? 24 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("\u{1F5BC} ", visita_r10.total_fotos, " foto", visita_r10.total_fotos !== 1 ? "s" : "", "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(visita_r10.expanded ? "expand_less" : "expand_more");
    \u0275\u0275advance();
    \u0275\u0275classProp("open", visita_r10.expanded);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.CATEGORIAS);
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53)(1, "h4", 54)(2, "mat-icon");
    \u0275\u0275text(3, "location_on");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 55);
    \u0275\u0275repeaterCreate(6, ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_For_7_Template, 34, 15, "div", 56, _forTrack2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const pdv_r16 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", pdv_r16.name, " ");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(pdv_r16.visitas);
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 51)(1, "h3", 52)(2, "mat-icon");
    \u0275\u0275text(3, "storefront");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_For_6_Template, 8, 1, "div", 53, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cadena_r17 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", cadena_r17.name, " ");
    \u0275\u0275advance();
    \u0275\u0275repeater(cadena_r17.pdvs);
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_59_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49)(1, "h2", 50)(2, "mat-icon");
    \u0275\u0275text(3, "directions_car");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, ClientVisitsComponent_Conditional_2_Conditional_59_For_2_For_6_Template, 7, 1, "div", 51, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ruta_r18 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ruta_r18.name, " ");
    \u0275\u0275advance();
    \u0275\u0275repeater(ruta_r18.cadenas);
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275repeaterCreate(1, ClientVisitsComponent_Conditional_2_Conditional_59_For_2_Template, 7, 1, "div", 49, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.groupedVisitas());
  }
}
function ClientVisitsComponent_Conditional_2_Conditional_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40)(1, "span", 85);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 86);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 87);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r19 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r19.tipo_desc);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("#", f_r19.id_foto, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.formatDateShort(f_r19.fecha));
  }
}
function ClientVisitsComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275template(0, ClientVisitsComponent_Conditional_2_Conditional_0_Template, 12, 1, "div", 16);
    \u0275\u0275elementStart(1, "div", 17)(2, "div", 18)(3, "div", 19)(4, "h1", 20);
    \u0275\u0275template(5, ClientVisitsComponent_Conditional_2_Conditional_5_Template, 1, 0)(6, ClientVisitsComponent_Conditional_2_Conditional_6_Template, 1, 1)(7, ClientVisitsComponent_Conditional_2_Conditional_7_Template, 1, 2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 21);
    \u0275\u0275template(9, ClientVisitsComponent_Conditional_2_Conditional_9_Template, 1, 1)(10, ClientVisitsComponent_Conditional_2_Conditional_10_Template, 1, 2);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 22)(12, "div", 23)(13, "span", 24);
    \u0275\u0275text(14, "Visitas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 25);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 23)(18, "span", 24);
    \u0275\u0275text(19, "Fotos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span", 26);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(22, "div", 27)(23, "div", 28)(24, "div", 29)(25, "label");
    \u0275\u0275text(26, "Desde");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 30)(28, "mat-icon");
    \u0275\u0275text(29, "event");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "input", 31);
    \u0275\u0275listener("ngModelChange", function ClientVisitsComponent_Conditional_2_Template_input_ngModelChange_30_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.fechaInicio.set($event);
      return \u0275\u0275resetView(ctx_r1.cargarVisitas());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(31, "div", 29)(32, "label");
    \u0275\u0275text(33, "Hasta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "div", 30)(35, "mat-icon");
    \u0275\u0275text(36, "event");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "input", 31);
    \u0275\u0275listener("ngModelChange", function ClientVisitsComponent_Conditional_2_Template_input_ngModelChange_37_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.fechaFin.set($event);
      return \u0275\u0275resetView(ctx_r1.cargarVisitas());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(38, "div", 29)(39, "label");
    \u0275\u0275text(40, "Ruta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "app-searchable-select", 32);
    \u0275\u0275listener("valueChange", function ClientVisitsComponent_Conditional_2_Template_app_searchable_select_valueChange_41_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onRutaChange($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "div", 29)(43, "label");
    \u0275\u0275text(44, "Cadena");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "app-searchable-select", 33);
    \u0275\u0275listener("valueChange", function ClientVisitsComponent_Conditional_2_Template_app_searchable_select_valueChange_45_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onCadenaChange($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "div", 29)(47, "label");
    \u0275\u0275text(48, "Punto de Venta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "app-searchable-select", 34);
    \u0275\u0275listener("valueChange", function ClientVisitsComponent_Conditional_2_Template_app_searchable_select_valueChange_49_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onPuntoChange($event));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(50, "div", 35)(51, "button", 36);
    \u0275\u0275listener("click", function ClientVisitsComponent_Conditional_2_Template_button_click_51_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.volverAHoy());
    });
    \u0275\u0275elementStart(52, "mat-icon");
    \u0275\u0275text(53, "today");
    \u0275\u0275elementEnd();
    \u0275\u0275text(54, " Volver a Hoy ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(55, "div", 37);
    \u0275\u0275template(56, ClientVisitsComponent_Conditional_2_Conditional_56_Template, 4, 0, "div", 38)(57, ClientVisitsComponent_Conditional_2_Conditional_57_Template, 11, 1)(58, ClientVisitsComponent_Conditional_2_Conditional_58_Template, 9, 0)(59, ClientVisitsComponent_Conditional_2_Conditional_59_Template, 3, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "app-photo-lightbox", 39);
    \u0275\u0275listener("closed", function ClientVisitsComponent_Conditional_2_Template_app_photo_lightbox_closed_60_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeCarousel());
    })("indexChange", function ClientVisitsComponent_Conditional_2_Template_app_photo_lightbox_indexChange_60_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onCarouselIndexChange($event));
    });
    \u0275\u0275template(61, ClientVisitsComponent_Conditional_2_Conditional_61_Template, 7, 3, "div", 40);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_19_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(0, ctx_r1.isCoordinadorExclusivo() && ctx_r1.selectedExclusiveClient() ? 0 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(5, ctx_r1.bannerInfo().esHoy ? 5 : ctx_r1.bannerInfo().fechaInicio === ctx_r1.bannerInfo().fechaFin ? 6 : 7);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(9, ctx_r1.bannerInfo().fechaInicio === ctx_r1.bannerInfo().fechaFin ? 9 : 10);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.bannerInfo().totalVisitas);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.bannerInfo().totalFotos);
    \u0275\u0275advance(9);
    \u0275\u0275property("ngModel", ctx_r1.fechaInicio());
    \u0275\u0275advance(7);
    \u0275\u0275property("ngModel", ctx_r1.fechaFin());
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r1.rutaOptions())("value", ctx_r1.ruta());
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r1.cadenaOptions())("value", ctx_r1.cadena());
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r1.puntoOptions())("value", ctx_r1.puntoId());
    \u0275\u0275advance(7);
    \u0275\u0275conditional(56, ctx_r1.loading() ? 56 : ctx_r1.error() ? 57 : ctx_r1.visitas().length === 0 ? 58 : 59);
    \u0275\u0275advance(4);
    \u0275\u0275property("open", ctx_r1.carouselOpen())("photos", ctx_r1.lightboxPhotos())("startIndex", ctx_r1.carouselIndex())("title", ctx_r1.carouselTitle());
    \u0275\u0275advance();
    \u0275\u0275conditional(61, (tmp_19_0 = ctx_r1.currentCarouselFoto()) ? 61 : -1, tmp_19_0);
  }
}
var ClientVisitsComponent = class _ClientVisitsComponent {
  constructor(api, auth) {
    this.api = api;
    this.auth = auth;
    this.loading = signal(false);
    this.error = signal(null);
    this.isCoordinadorExclusivo = signal(false);
    this.needsClientSelection = signal(false);
    this.exclusiveClients = signal([]);
    this.selectedExclusiveClient = signal(null);
    this.exclusiveClientSearch = signal("");
    this.filteredExclusiveClients = computed(() => {
      const term = this.exclusiveClientSearch().trim().toLowerCase();
      if (!term)
        return this.exclusiveClients();
      return this.exclusiveClients().filter((c) => (c.cliente || "").toLowerCase().includes(term));
    });
    this.visitas = signal([]);
    this.groupedVisitas = computed(() => {
      const data = this.visitas();
      const groups = {};
      for (const v of data) {
        const r = v.ruta || "Sin Ruta";
        const c = v.cadena || "Sin Cadena";
        const p = v.punto_nombre || "Punto Desconocido";
        if (!groups[r])
          groups[r] = {};
        if (!groups[r][c])
          groups[r][c] = {};
        if (!groups[r][c][p])
          groups[r][c][p] = [];
        groups[r][c][p].push(v);
      }
      return Object.keys(groups).sort().map((rutaName) => ({
        name: rutaName,
        cadenas: Object.keys(groups[rutaName]).sort().map((cadenaName) => ({
          name: cadenaName,
          pdvs: Object.keys(groups[rutaName][cadenaName]).sort().map((pdvName) => ({
            name: pdvName,
            visitas: groups[rutaName][cadenaName][pdvName]
          }))
        }))
      }));
    });
    this.filtrosDisponibles = signal({ rutas: [], cadenas: [], puntos: [] });
    this.bannerInfo = signal({
      esHoy: true,
      fechaInicio: "",
      fechaFin: "",
      totalVisitas: 0,
      totalFotos: 0
    });
    this.fechaInicio = signal(this.getTodayStr());
    this.fechaFin = signal(this.getTodayStr());
    this.ruta = signal("");
    this.cadena = signal("");
    this.puntoId = signal("");
    this.carouselOpen = signal(false);
    this.carouselFotos = signal([]);
    this.carouselIndex = signal(0);
    this.carouselTitle = signal("");
    this.lightboxPhotos = computed(() => this.carouselFotos().map((f) => __spreadProps(__spreadValues({}, f), { url: f.file_path })));
    this.currentCarouselFoto = computed(() => this.carouselFotos()[this.carouselIndex()]);
    this.CATEGORIAS = [
      { nombre: "Gesti\xF3n", emoji: "\u{1F4CB}", color: "#3b82f6" },
      { nombre: "Precio", emoji: "\u{1F3F7}\uFE0F", color: "#f59e0b" },
      { nombre: "Exhibiciones Adicionales", emoji: "\u{1F5BC}\uFE0F", color: "#06b6d4" },
      { nombre: "Activaci\xF3n", emoji: "\u{1F50B}", color: "#10b981" },
      { nombre: "Desactivaci\xF3n", emoji: "\u{1F50C}", color: "#f43f5e" },
      { nombre: "Material POP Antes", emoji: "\u{1F4E6}", color: "#8b5cf6" },
      { nombre: "Material POP Despues", emoji: "\u{1F381}", color: "#ec4899" }
    ];
    this.rutaOptions = computed(() => this.filtrosDisponibles().rutas.map((r) => ({ value: r, label: r })));
    this.cadenaOptions = computed(() => this.filtrosDisponibles().cadenas.map((c) => ({ value: c, label: c })));
    this.puntoOptions = computed(() => this.filtrosDisponibles().puntos.map((p) => ({ value: p.id, label: p.nombre })));
  }
  ngOnInit() {
    const u = this.auth.currentUser();
    if (u?.is_coordinador_exclusivo) {
      this.isCoordinadorExclusivo.set(true);
      this.needsClientSelection.set(true);
      this.loadExclusiveClients();
    } else {
      this.cargarVisitas();
    }
  }
  // ─── COORDINADOR EXCLUSIVO ───────────────────────────────────────
  loadExclusiveClients() {
    this.loading.set(true);
    this.api.getExclusiveClients().subscribe({
      next: (data) => {
        this.exclusiveClients.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  selectExclusiveClient(c) {
    this.selectedExclusiveClient.set(c);
    this.needsClientSelection.set(false);
    this.cargarVisitas();
  }
  changeExclusiveClient() {
    this.selectedExclusiveClient.set(null);
    this.needsClientSelection.set(true);
    this.visitas.set([]);
  }
  // Helper for today's date in YYYY-MM-DD
  getTodayStr() {
    const d = /* @__PURE__ */ new Date();
    return d.toISOString().split("T")[0];
  }
  // Load data from API
  cargarVisitas() {
    this.loading.set(true);
    this.error.set(null);
    const params = {
      fecha_inicio: this.fechaInicio(),
      fecha_fin: this.fechaFin()
    };
    if (this.ruta())
      params.ruta = this.ruta();
    if (this.cadena())
      params.cadena = this.cadena();
    if (this.puntoId())
      params.punto_id = this.puntoId();
    const exc = this.selectedExclusiveClient();
    if (exc)
      params.cliente_id = exc.id_cliente;
    this.api.getClientMisVisitas(params).subscribe({
      next: (res) => {
        if (res.success) {
          const visitsData = res.visitas.map((v) => __spreadProps(__spreadValues({}, v), { expanded: false }));
          this.visitas.set(visitsData);
          if (res.filtros) {
            this.filtrosDisponibles.set(res.filtros);
          }
          const totalFotos = visitsData.reduce((sum, v) => sum + v.total_fotos, 0);
          this.bannerInfo.set({
            esHoy: res.es_hoy,
            fechaInicio: res.fecha_inicio,
            fechaFin: res.fecha_fin,
            totalVisitas: res.total,
            totalFotos
          });
        } else {
          this.error.set(res.error || "Error al cargar visitas");
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set("No se pudo conectar con el servidor. Intenta de nuevo.");
        this.loading.set(false);
      }
    });
  }
  // Filter actions
  volverAHoy() {
    this.fechaInicio.set(this.getTodayStr());
    this.fechaFin.set(this.getTodayStr());
    this.ruta.set("");
    this.cadena.set("");
    this.puntoId.set("");
    this.cargarVisitas();
  }
  onRutaChange(value) {
    this.ruta.set(value);
    this.cadena.set("");
    this.puntoId.set("");
    this.cargarVisitas();
  }
  onCadenaChange(value) {
    this.cadena.set(value);
    this.puntoId.set("");
    this.cargarVisitas();
  }
  onPuntoChange(value) {
    this.puntoId.set(value);
    this.cargarVisitas();
  }
  // UI interactions
  toggleCard(visita) {
    const current = this.visitas();
    const index = current.findIndex((v) => v.id_visita === visita.id_visita);
    if (index !== -1) {
      const newVisitas = [...current];
      newVisitas[index] = __spreadProps(__spreadValues({}, newVisitas[index]), { expanded: !newVisitas[index].expanded });
      this.visitas.set(newVisitas);
    }
  }
  onImageError(event) {
    event.target.src = "assets/img/placeholder.png";
    event.target.style.display = "none";
    event.target.parentElement.classList.add("error");
  }
  getFotosForCategoria(visita, catNombre) {
    return visita.fotos_por_categoria[catNombre] || [];
  }
  openCarousel(catNombre, fotos, event) {
    event.stopPropagation();
    if (!fotos || fotos.length === 0)
      return;
    this.carouselTitle.set(catNombre);
    this.carouselFotos.set(fotos);
    this.carouselIndex.set(0);
    this.carouselOpen.set(true);
  }
  closeCarousel() {
    this.carouselOpen.set(false);
    this.carouselFotos.set([]);
  }
  onCarouselIndexChange(i) {
    this.carouselIndex.set(i);
  }
  // Formatters
  formatDateHuman(fechaStr) {
    if (!fechaStr)
      return "";
    try {
      const d = /* @__PURE__ */ new Date(fechaStr + "T00:00:00");
      return d.toLocaleDateString("es-VE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch (e) {
      return fechaStr;
    }
  }
  formatDateShort(fechaStr) {
    if (!fechaStr)
      return "";
    try {
      const d = /* @__PURE__ */ new Date(fechaStr + "T00:00:00");
      return d.toLocaleDateString("es-VE", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch (e) {
      return fechaStr;
    }
  }
  formatTime(fechaStr) {
    if (!fechaStr)
      return "";
    try {
      return new Date(fechaStr).toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "";
    }
  }
  static {
    this.\u0275fac = function ClientVisitsComponent_Factory(t) {
      return new (t || _ClientVisitsComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(AuthService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ClientVisitsComponent, selectors: [["app-client-visits"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 3, vars: 2, consts: [[1, "mv-main-container"], [1, "mv-client-selector"], [1, "mv-client-selector-header"], [1, "mv-client-search"], ["type", "text", "placeholder", "Buscar cliente...", 3, "ngModelChange", "ngModel"], [1, "mv-loading"], ["diameter", "40"], [1, "mv-client-grid"], [1, "mv-client-card", 3, "animation-delay"], [1, "mv-empty"], [1, "mv-client-card", 3, "click"], [1, "mv-client-icon"], [1, "mv-client-name"], [1, "mv-client-tag", "mv-tag-exclusivo"], [1, "mv-client-arrow"], [1, "mv-client-tag", "mv-tag-tradex"], [1, "mv-client-banner"], [1, "mv-banner"], [1, "mv-banner-content"], [1, "mv-banner-text"], ["id", "bannerFecha"], ["id", "bannerFechaSub"], [1, "mv-banner-stats"], [1, "mv-stat-box"], [1, "mv-stat-label"], ["id", "statVisitas", 1, "mv-stat-value"], ["id", "statFotos", 1, "mv-stat-value"], [1, "mv-filters"], [1, "mv-filter-group"], [1, "mv-filter-item"], [1, "mv-input-with-icon"], ["type", "date", 3, "ngModelChange", "ngModel"], ["icon", "directions_car", "placeholder", "Todas las rutas", "searchPlaceholder", "Buscar ruta...", "allLabel", "Todas las rutas", 3, "valueChange", "options", "value"], ["icon", "storefront", "placeholder", "Todas las cadenas", "searchPlaceholder", "Buscar cadena...", "allLabel", "Todas las cadenas", 3, "valueChange", "options", "value"], ["icon", "location_on", "placeholder", "Todos los puntos", "searchPlaceholder", "Buscar punto de venta...", "allLabel", "Todos los puntos", 3, "valueChange", "options", "value"], [1, "mv-filter-actions"], [1, "mv-btn-secondary", 3, "click"], ["id", "mvListContainer", 1, "mv-list-container"], [1, "mv-skeleton"], [3, "closed", "indexChange", "open", "photos", "startIndex", "title"], [1, "mv-car-info", 2, "display", "flex", "gap", ".5rem", "align-items", "center", "justify-content", "center"], [1, "mv-client-banner-info"], [1, "mv-client-banner-change", 3, "click"], [1, "mv-skeleton-card"], [1, "mv-empty-icon"], [1, "mv-empty-title"], [1, "mv-empty-sub"], [1, "mv-btn-secondary", 2, "margin-top", "1rem", 3, "click"], [1, "mv-visita-groups"], [1, "mv-region-section"], [1, "mv-region-title"], [1, "mv-cadena-section"], [1, "mv-cadena-title"], [1, "mv-pdv-section"], [1, "mv-pdv-title"], [1, "mv-visita-list"], [1, "mv-card", 3, "animation-delay"], [1, "mv-card", 3, "click"], [1, "mv-card-inner"], [1, "mv-card-thumb"], ["alt", "Preview", "loading", "lazy", 3, "src"], [1, "mv-thumb-count"], [1, "mv-card-body"], [1, "mv-card-top"], [1, "mv-card-punto"], [1, "mv-card-visita-id"], [1, "mv-card-meta"], [1, "mv-card-meta-item"], [1, "mv-card-tags"], [1, "mv-tag", "mv-tag-ciudad"], [1, "mv-tag", "mv-tag-fotos"], [1, "mv-card-arrow"], [1, "mv-cat-expand"], [1, "mv-cat-grid-inner"], [1, "mv-card-thumb-placeholder"], [1, "mv-cat-item", 3, "has-fotos", "empty"], [1, "mv-cat-item", 3, "click"], [1, "mv-cat-preview"], [1, "mv-cat-info"], [1, "mv-cat-name"], [1, "mv-cat-count"], ["loading", "lazy", 3, "error", "src", "alt"], [1, "mv-cat-overlay"], [1, "mv-cat-overlay-count"], [1, "mv-cat-preview-icon"], [1, "mv-badge"], [1, "mv-badge-outline"], [1, "mv-badge-text"]], template: function ClientVisitsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275template(1, ClientVisitsComponent_Conditional_1_Template, 12, 2, "div", 1)(2, ClientVisitsComponent_Conditional_2_Template, 62, 19);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275conditional(1, ctx.needsClientSelection() ? 1 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(2, !ctx.needsClientSelection() ? 2 : -1);
      }
    }, dependencies: [
      CommonModule,
      FormsModule,
      DefaultValueAccessor,
      NgControlStatus,
      NgModel,
      MatSelectModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule,
      MatIcon,
      MatProgressSpinnerModule,
      MatProgressSpinner,
      SearchableSelectComponent,
      PhotoLightboxComponent
    ], styles: ['@charset "UTF-8";\n\n\n\n.mv-main-container[_ngcontent-%COMP%] {\n  font-family: "DM Sans", sans-serif;\n  background: #f8fafc;\n  color: #0f172a;\n  min-height: 100vh;\n  transition: background 0.3s ease, color 0.3s ease;\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%] {\n  background: #0b0e14;\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-filters[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-filters[_ngcontent-%COMP%] {\n  background: #111827;\n  border-bottom-color: rgba(255, 255, 255, 0.08);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-filters[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-filters[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  color: #818cf8;\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-filters[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   .mv-input-with-icon[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-filters[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   .mv-input-with-icon[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-filters[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   .mv-input-with-icon[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-filters[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   .mv-input-with-icon[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.05);\n  border-color: rgba(255, 255, 255, 0.08);\n  color: #fff;\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-filters[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   .mv-input-with-icon[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-filters[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   .mv-input-with-icon[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, .dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-filters[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   .mv-input-with-icon[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-filters[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   .mv-input-with-icon[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus {\n  border-color: #6366f1;\n  background: rgba(255, 255, 255, 0.08);\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-filters[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   .mv-input-with-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-filters[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   .mv-input-with-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%] {\n  background: rgba(31, 41, 55, 0.7);\n  -webkit-backdrop-filter: blur(12px);\n  backdrop-filter: blur(12px);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]:hover {\n  border-color: rgba(99, 102, 241, 0.5);\n  box-shadow: 0 12px 32px rgba(99, 102, 241, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3);\n  transform: translateY(-2px);\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-punto[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-punto[_ngcontent-%COMP%] {\n  color: #fff;\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-meta[_ngcontent-%COMP%]   .mv-card-meta-item[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-meta[_ngcontent-%COMP%]   .mv-card-meta-item[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-arrow[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-arrow[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%] {\n  background: rgba(0, 0, 0, 0.2);\n  border-top-color: rgba(255, 255, 255, 0.08);\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.03);\n  border-color: rgba(255, 255, 255, 0.08);\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]   .mv-cat-name[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]   .mv-cat-name[_ngcontent-%COMP%] {\n  color: #fff;\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]   .mv-cat-count[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]   .mv-cat-count[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]   .mv-cat-count.has-fotos[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]   .mv-cat-count.has-fotos[_ngcontent-%COMP%] {\n  color: #818cf8;\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]:hover {\n  border-color: #818cf8;\n  background: rgba(255, 255, 255, 0.06);\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-empty[_ngcontent-%COMP%]   .mv-empty-title[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-empty[_ngcontent-%COMP%]   .mv-empty-title[_ngcontent-%COMP%] {\n  color: #fff;\n}\n.dark[_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-empty[_ngcontent-%COMP%]   .mv-empty-sub[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-main-container[_ngcontent-%COMP%]   .mv-empty[_ngcontent-%COMP%]   .mv-empty-sub[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.mv-banner[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #1e1b4b 0%,\n      #4338ca 100%);\n  position: relative;\n  overflow: hidden;\n  padding: 30px 24px;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);\n}\n.mv-banner[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: -50%;\n  left: -50%;\n  width: 200%;\n  height: 200%;\n  background:\n    radial-gradient(\n      circle,\n      rgba(99, 102, 241, 0.15) 0%,\n      transparent 60%);\n  animation: _ngcontent-%COMP%_rotate 20s linear infinite;\n}\n.mv-banner[_ngcontent-%COMP%]   .mv-banner-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 12px;\n}\n.mv-banner[_ngcontent-%COMP%]   .mv-banner-text[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-family: inherit;\n  font-size: 1.4rem;\n  font-weight: 800;\n  color: #fff;\n  margin: 0;\n  letter-spacing: -0.4px;\n}\n.mv-banner[_ngcontent-%COMP%]   .mv-banner-text[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.82rem;\n  color: rgba(255, 255, 255, 0.65);\n  margin: 2px 0 0 0;\n}\n.mv-banner[_ngcontent-%COMP%]   .mv-banner-stats[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.mv-banner[_ngcontent-%COMP%]   .mv-banner-stats[_ngcontent-%COMP%]   .mv-stat-box[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.15);\n  -webkit-backdrop-filter: blur(8px);\n  backdrop-filter: blur(8px);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  color: #fff;\n  border-radius: 50px;\n  padding: 5px 14px;\n  font-size: 0.8rem;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n.mv-banner[_ngcontent-%COMP%]   .mv-banner-stats[_ngcontent-%COMP%]   .mv-stat-box[_ngcontent-%COMP%]   .mv-stat-label[_ngcontent-%COMP%] {\n  opacity: 0.9;\n}\n.mv-banner[_ngcontent-%COMP%]   .mv-banner-stats[_ngcontent-%COMP%]   .mv-stat-box[_ngcontent-%COMP%]   .mv-stat-value[_ngcontent-%COMP%] {\n  font-weight: 800;\n}\n.mv-filters[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-bottom: 1px solid #e2e8f0;\n  padding: 14px 24px;\n  position: sticky;\n  top: 0;\n  z-index: 800;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  align-items: flex-end;\n  transition: all 0.3s ease;\n}\n.mv-filters[_ngcontent-%COMP%]   .mv-filter-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  flex: 1;\n}\n.mv-filters[_ngcontent-%COMP%]   .mv-filter-group[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  flex: 1;\n  min-width: 120px;\n}\n.mv-filters[_ngcontent-%COMP%]   .mv-filter-group[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 0.68rem;\n  font-weight: 700;\n  color: #6366f1;\n  text-transform: uppercase;\n  letter-spacing: 0.7px;\n}\n.mv-filters[_ngcontent-%COMP%]   .mv-filter-group[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   .mv-input-with-icon[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n.mv-filters[_ngcontent-%COMP%]   .mv-filter-group[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   .mv-input-with-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 10px;\n  color: #94a3b8;\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.mv-filters[_ngcontent-%COMP%]   .mv-filter-group[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   .mv-input-with-icon[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .mv-filters[_ngcontent-%COMP%]   .mv-filter-group[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   .mv-input-with-icon[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  height: 38px;\n  width: 100%;\n  border: 1.5px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 0 12px 0 34px;\n  font-family: "DM Sans", sans-serif;\n  font-size: 0.84rem;\n  color: #0f172a;\n  background: #f8fafc;\n  outline: none;\n  transition:\n    border-color 0.2s,\n    box-shadow 0.2s,\n    background 0.2s;\n}\n.mv-filters[_ngcontent-%COMP%]   .mv-filter-group[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   .mv-input-with-icon[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, .mv-filters[_ngcontent-%COMP%]   .mv-filter-group[_ngcontent-%COMP%]   .mv-filter-item[_ngcontent-%COMP%]   .mv-input-with-icon[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus {\n  border-color: #6366f1;\n  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);\n  background: #fff;\n}\n.mv-filters[_ngcontent-%COMP%]   .mv-filter-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n}\n.mv-filters[_ngcontent-%COMP%]   .mv-filter-actions[_ngcontent-%COMP%]   .mv-btn-secondary[_ngcontent-%COMP%] {\n  height: 38px;\n  padding: 0 16px;\n  background: transparent;\n  color: #6366f1;\n  border: 1.5px solid #6366f1;\n  border-radius: 10px;\n  font-size: 0.82rem;\n  font-weight: 600;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  gap: 5px;\n  transition: all 0.2s ease;\n}\n.mv-filters[_ngcontent-%COMP%]   .mv-filter-actions[_ngcontent-%COMP%]   .mv-btn-secondary[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.mv-filters[_ngcontent-%COMP%]   .mv-filter-actions[_ngcontent-%COMP%]   .mv-btn-secondary[_ngcontent-%COMP%]:hover {\n  background: rgba(99, 102, 241, 0.18);\n}\n.mv-list-container[_ngcontent-%COMP%] {\n  padding: 24px;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-empty[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 80px 24px;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-empty[_ngcontent-%COMP%]   .mv-empty-icon[_ngcontent-%COMP%] {\n  font-size: 3.5rem;\n  opacity: 0.2;\n  display: block;\n  margin-bottom: 16px;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-empty[_ngcontent-%COMP%]   .mv-empty-title[_ngcontent-%COMP%] {\n  font-family: inherit;\n  font-size: 1.3rem;\n  font-weight: 700;\n  color: #334155;\n  margin-bottom: 8px;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-empty[_ngcontent-%COMP%]   .mv-empty-sub[_ngcontent-%COMP%] {\n  color: #64748b;\n  font-size: 0.9rem;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-skeleton[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-skeleton[_ngcontent-%COMP%]   .mv-skeleton-card[_ngcontent-%COMP%] {\n  height: 140px;\n  background:\n    linear-gradient(\n      90deg,\n      #f1f5f9 25%,\n      #e2e8f0 50%,\n      #f1f5f9 75%);\n  background-size: 200% 100%;\n  animation: _ngcontent-%COMP%_shimmer 1.4s infinite;\n  border-radius: 16px;\n}\n@keyframes _ngcontent-%COMP%_shimmer {\n  0% {\n    background-position: 200% 0;\n  }\n  100% {\n    background-position: -200% 0;\n  }\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-visita-groups[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 32px;\n  padding-bottom: 32px;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-region-section[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-region-section[_ngcontent-%COMP%]   .mv-region-title[_ngcontent-%COMP%] {\n  font-family: inherit;\n  font-size: 1.4rem;\n  font-weight: 800;\n  color: #6366f1;\n  margin: 0;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding-bottom: 12px;\n  border-bottom: 2px solid #e2e8f0;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-region-section[_ngcontent-%COMP%]   .mv-region-title[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 28px;\n  width: 28px;\n  height: 28px;\n  color: #818cf8;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cadena-section[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  padding-left: 12px;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cadena-section[_ngcontent-%COMP%]   .mv-cadena-title[_ngcontent-%COMP%] {\n  font-family: inherit;\n  font-size: 1.15rem;\n  font-weight: 700;\n  color: #0f172a;\n  margin: 0;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cadena-section[_ngcontent-%COMP%]   .mv-cadena-title[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n  color: #64748b;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cadena-section[_ngcontent-%COMP%]   .mv-pdv-section[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding-left: 12px;\n  border-left: 2px dashed #e2e8f0;\n  margin-top: 8px;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cadena-section[_ngcontent-%COMP%]   .mv-pdv-section[_ngcontent-%COMP%]   .mv-pdv-title[_ngcontent-%COMP%] {\n  font-family: inherit;\n  font-size: 1.05rem;\n  font-weight: 600;\n  color: #1e293b;\n  margin: 0;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cadena-section[_ngcontent-%COMP%]   .mv-pdv-section[_ngcontent-%COMP%]   .mv-pdv-title[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: #818cf8;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-visita-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-radius: 22px;\n  border: 1.5px solid #e2e8f0;\n  overflow: hidden;\n  transition: all 0.3s ease;\n  cursor: pointer;\n  animation: _ngcontent-%COMP%_cardIn 0.4s ease both;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]:hover {\n  border-color: #818cf8;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04);\n  transform: translateY(-2px);\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-inner[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: stretch;\n  min-height: 120px;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-thumb[_ngcontent-%COMP%] {\n  width: 130px;\n  min-width: 130px;\n  position: relative;\n  overflow: hidden;\n  background: #f8fafc;\n  flex-shrink: 0;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-thumb[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: transform 0.5s ease;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-thumb[_ngcontent-%COMP%]   .mv-card-thumb-placeholder[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 2rem;\n  color: #94a3b8;\n  background:\n    linear-gradient(\n      135deg,\n      #f1f5f9,\n      #e2e8f0);\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-thumb[_ngcontent-%COMP%]   .mv-thumb-count[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 8px;\n  left: 8px;\n  background: rgba(0, 0, 0, 0.65);\n  color: #fff;\n  font-size: 0.68rem;\n  font-weight: 700;\n  padding: 2px 8px;\n  border-radius: 50px;\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]:hover   .mv-card-thumb[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  transform: scale(1.08);\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%] {\n  flex: 1;\n  padding: 16px 18px;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  min-width: 0;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-top[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 8px;\n  margin-bottom: 8px;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-punto[_ngcontent-%COMP%] {\n  font-family: inherit;\n  font-size: 1rem;\n  font-weight: 700;\n  color: #0f172a;\n  letter-spacing: -0.2px;\n  line-height: 1.3;\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-visita-id[_ngcontent-%COMP%] {\n  font-size: 0.72rem;\n  font-weight: 700;\n  color: #6366f1;\n  background: rgba(99, 102, 241, 0.18);\n  padding: 3px 9px;\n  border-radius: 50px;\n  white-space: nowrap;\n  flex-shrink: 0;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-meta[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px 14px;\n  margin-bottom: 10px;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-meta[_ngcontent-%COMP%]   .mv-card-meta-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 0.78rem;\n  color: #64748b;\n  font-weight: 500;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-meta[_ngcontent-%COMP%]   .mv-card-meta-item[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-tags[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 5px;\n  align-items: center;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-tags[_ngcontent-%COMP%]   .mv-tag[_ngcontent-%COMP%] {\n  font-size: 0.68rem;\n  font-weight: 700;\n  padding: 3px 9px;\n  border-radius: 50px;\n  white-space: nowrap;\n  transition: all 0.2s ease;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-tags[_ngcontent-%COMP%]   .mv-tag.mv-tag-region[_ngcontent-%COMP%] {\n  background: #ede9fe;\n  color: #5b21b6;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-tags[_ngcontent-%COMP%]   .mv-tag.mv-tag-cadena[_ngcontent-%COMP%] {\n  background: #fef3c7;\n  color: #92400e;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-tags[_ngcontent-%COMP%]   .mv-tag.mv-tag-ciudad[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #14532d;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-tags[_ngcontent-%COMP%]   .mv-tag.mv-tag-fotos[_ngcontent-%COMP%] {\n  background: #dbeafe;\n  color: #1e40af;\n}\n.dark[_nghost-%COMP%]   .mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-tags[_ngcontent-%COMP%]   .mv-tag.mv-tag-region[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-tags[_ngcontent-%COMP%]   .mv-tag.mv-tag-region[_ngcontent-%COMP%] {\n  background: rgba(139, 92, 246, 0.15);\n  color: #c4b5fd;\n}\n.dark[_nghost-%COMP%]   .mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-tags[_ngcontent-%COMP%]   .mv-tag.mv-tag-cadena[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-tags[_ngcontent-%COMP%]   .mv-tag.mv-tag-cadena[_ngcontent-%COMP%] {\n  background: rgba(245, 158, 11, 0.15);\n  color: #fcd34d;\n}\n.dark[_nghost-%COMP%]   .mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-tags[_ngcontent-%COMP%]   .mv-tag.mv-tag-ciudad[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-tags[_ngcontent-%COMP%]   .mv-tag.mv-tag-ciudad[_ngcontent-%COMP%] {\n  background: rgba(16, 185, 129, 0.15);\n  color: #6ee7b7;\n}\n.dark[_nghost-%COMP%]   .mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-tags[_ngcontent-%COMP%]   .mv-tag.mv-tag-fotos[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-body[_ngcontent-%COMP%]   .mv-card-tags[_ngcontent-%COMP%]   .mv-tag.mv-tag-fotos[_ngcontent-%COMP%] {\n  background: rgba(59, 130, 246, 0.15);\n  color: #93c5fd;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]   .mv-card-arrow[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: 0 16px 0 8px;\n  color: #94a3b8;\n  transition: color 0.2s, transform 0.2s;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-card[_ngcontent-%COMP%]:hover   .mv-card-arrow[_ngcontent-%COMP%] {\n  color: #6366f1;\n  transform: translateX(3px);\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%] {\n  border-top: 1px solid #e2e8f0;\n  background: #fafbff;\n  display: none;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand.open[_ngcontent-%COMP%] {\n  display: block;\n  animation: _ngcontent-%COMP%_slideDown 0.3s ease;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-grid-inner[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));\n  gap: 10px;\n  padding: 16px;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border: 1.5px solid #e2e8f0;\n  border-radius: 16px;\n  overflow: hidden;\n  cursor: pointer;\n  transition: all 0.22s ease;\n  outline: none;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]:hover, .mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]:focus-visible {\n  border-color: #818cf8;\n  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.15);\n  transform: translateY(-2px);\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item.empty[_ngcontent-%COMP%] {\n  opacity: 0.45;\n  cursor: default;\n  pointer-events: none;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]   .mv-cat-preview[_ngcontent-%COMP%] {\n  height: 90px;\n  background: #f8fafc;\n  overflow: hidden;\n  position: relative;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]   .mv-cat-preview[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: transform 0.4s ease;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]   .mv-cat-preview[_ngcontent-%COMP%]   .mv-cat-preview-icon[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.6rem;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]   .mv-cat-preview[_ngcontent-%COMP%]   .mv-cat-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background:\n    linear-gradient(\n      to top,\n      rgba(79, 70, 229, 0.75),\n      transparent 60%);\n  display: flex;\n  align-items: flex-end;\n  justify-content: center;\n  padding-bottom: 6px;\n  opacity: 0;\n  transition: opacity 0.22s ease;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]   .mv-cat-preview[_ngcontent-%COMP%]   .mv-cat-overlay[_ngcontent-%COMP%]   .mv-cat-overlay-count[_ngcontent-%COMP%] {\n  color: #fff;\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]:hover   .mv-cat-preview[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  transform: scale(1.1);\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]:hover   .mv-cat-overlay[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]   .mv-cat-info[_ngcontent-%COMP%] {\n  padding: 8px 10px;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]   .mv-cat-info[_ngcontent-%COMP%]   .mv-cat-name[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 700;\n  color: #0f172a;\n  margin-bottom: 2px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]   .mv-cat-info[_ngcontent-%COMP%]   .mv-cat-count[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  color: #64748b;\n  font-weight: 500;\n  margin: 0;\n}\n.mv-list-container[_ngcontent-%COMP%]   .mv-cat-expand[_ngcontent-%COMP%]   .mv-cat-item[_ngcontent-%COMP%]   .mv-cat-info[_ngcontent-%COMP%]   .mv-cat-count.has-fotos[_ngcontent-%COMP%] {\n  color: #6366f1;\n}\n@keyframes _ngcontent-%COMP%_cardIn {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.mv-carousel-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.85);\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n  z-index: 10049;\n  animation: _ngcontent-%COMP%_fadeIn 0.3s ease;\n}\n.mv-carousel-modal[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 10050;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  padding: 12px;\n  pointer-events: none;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-header[_ngcontent-%COMP%], .mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-body[_ngcontent-%COMP%], .mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-footer[_ngcontent-%COMP%] {\n  pointer-events: auto;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-header[_ngcontent-%COMP%] {\n  max-width: 800px;\n  width: 100%;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background: #0d0d1a;\n  padding: 16px 20px;\n  border-radius: 20px 20px 0 0;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #fff;\n  font-family: inherit;\n  font-size: 1.1rem;\n  font-weight: 700;\n  margin: 0;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-header[_ngcontent-%COMP%]   .mv-car-close[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.1);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  color: #fff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-header[_ngcontent-%COMP%]   .mv-car-close[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.2);\n  transform: scale(1.08);\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-body[_ngcontent-%COMP%] {\n  max-width: 800px;\n  width: 100%;\n  background: #07071a;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  min-height: 380px;\n  max-height: 60vh;\n  padding: 20px;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-body[_ngcontent-%COMP%]   .mv-car-btn[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n  background: rgba(255, 255, 255, 0.12);\n  border: 1.5px solid rgba(255, 255, 255, 0.2);\n  color: #fff;\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  -webkit-backdrop-filter: blur(8px);\n  backdrop-filter: blur(8px);\n  z-index: 10;\n  transition: all 0.2s;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-body[_ngcontent-%COMP%]   .mv-car-btn[_ngcontent-%COMP%]:hover:not(.disabled) {\n  background: rgba(99, 102, 241, 0.6);\n  border-color: #818cf8;\n  transform: translateY(-50%) scale(1.08);\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-body[_ngcontent-%COMP%]   .mv-car-btn.disabled[_ngcontent-%COMP%] {\n  opacity: 0.25;\n  cursor: default;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-body[_ngcontent-%COMP%]   .mv-car-btn[_ngcontent-%COMP%]:first-child {\n  left: 16px;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-body[_ngcontent-%COMP%]   .mv-car-btn[_ngcontent-%COMP%]:last-child {\n  right: 16px;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-body[_ngcontent-%COMP%]   .mv-car-img-wrap[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-body[_ngcontent-%COMP%]   .mv-car-img-wrap[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: 100%;\n  max-height: 56vh;\n  object-fit: contain;\n  border-radius: 6px;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-body[_ngcontent-%COMP%]   .mv-car-img-wrap[_ngcontent-%COMP%]   .mv-car-loading[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  pointer-events: none;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-footer[_ngcontent-%COMP%] {\n  max-width: 800px;\n  width: 100%;\n  background: #0d0d1a;\n  border-radius: 0 0 20px 20px;\n  padding: 16px 20px 20px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 12px;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-footer[_ngcontent-%COMP%]   .mv-car-info[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  justify-content: center;\n  align-items: center;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-footer[_ngcontent-%COMP%]   .mv-car-info[_ngcontent-%COMP%]   .mv-badge[_ngcontent-%COMP%] {\n  background: rgba(99, 102, 241, 0.2);\n  color: #a5b4fc;\n  padding: 4px 10px;\n  border-radius: 50px;\n  font-size: 0.75rem;\n  font-weight: 700;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-footer[_ngcontent-%COMP%]   .mv-car-info[_ngcontent-%COMP%]   .mv-badge-outline[_ngcontent-%COMP%] {\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  color: rgba(255, 255, 255, 0.8);\n  padding: 3px 10px;\n  border-radius: 50px;\n  font-size: 0.75rem;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-footer[_ngcontent-%COMP%]   .mv-car-info[_ngcontent-%COMP%]   .mv-badge-text[_ngcontent-%COMP%] {\n  color: #6b7280;\n  font-size: 0.8rem;\n  font-weight: 500;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-footer[_ngcontent-%COMP%]   .mv-car-dots[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  justify-content: center;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-footer[_ngcontent-%COMP%]   .mv-car-dots[_ngcontent-%COMP%]   .mv-dot[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.2);\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-footer[_ngcontent-%COMP%]   .mv-car-dots[_ngcontent-%COMP%]   .mv-dot.active[_ngcontent-%COMP%] {\n  background: #6366f1;\n  transform: scale(1.35);\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-footer[_ngcontent-%COMP%]   .mv-car-dots[_ngcontent-%COMP%]   .mv-dot[_ngcontent-%COMP%]:hover:not(.active) {\n  background: rgba(255, 255, 255, 0.45);\n}\n.mv-carousel-modal[_ngcontent-%COMP%]   .mv-car-footer[_ngcontent-%COMP%]   .mv-car-counter[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  font-size: 0.75rem;\n  font-weight: 600;\n  letter-spacing: 1px;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@media (max-width: 768px) {\n  .mv-filters[_ngcontent-%COMP%] {\n    padding: 12px 16px;\n  }\n  .mv-list-container[_ngcontent-%COMP%] {\n    padding: 16px;\n  }\n  .mv-filters[_ngcontent-%COMP%]   .mv-filter-group[_ngcontent-%COMP%] {\n    flex: 1 1 100%;\n  }\n  .mv-card-thumb[_ngcontent-%COMP%] {\n    width: 100px !important;\n    min-width: 100px !important;\n  }\n  .mv-cat-grid-inner[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr) !important;\n  }\n}\n@media (max-width: 480px) {\n  .mv-card-thumb[_ngcontent-%COMP%] {\n    width: 85px !important;\n    min-width: 85px !important;\n  }\n  .mv-car-body[_ngcontent-%COMP%] {\n    min-height: 260px !important;\n  }\n  .mv-cat-grid-inner[_ngcontent-%COMP%] {\n    padding: 12px !important;\n    gap: 8px !important;\n  }\n}\n.mv-client-selector[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 1.5rem;\n  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);\n  margin-bottom: 1.5rem;\n}\n.mv-client-selector-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-bottom: 1rem;\n}\n.mv-client-selector-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: #1e293b;\n  margin: 0;\n}\n.mv-client-selector-header[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #16a34a;\n}\n.mv-client-search[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 0.5rem 0.85rem;\n  margin-bottom: 1rem;\n  max-width: 480px;\n}\n.mv-client-search[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #64748b;\n}\n.mv-client-search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  flex: 1;\n  border: none;\n  outline: none;\n  font-size: 0.95rem;\n  background: transparent;\n  color: #1e293b;\n}\n.mv-loading[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 2rem;\n}\n.mv-loading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #64748b;\n  margin: 0;\n  font-size: 0.9rem;\n}\n.mv-client-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n  gap: 0.85rem;\n}\n.mv-client-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 1rem;\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  cursor: pointer;\n  text-align: left;\n  transition:\n    transform 0.15s,\n    box-shadow 0.15s,\n    border-color 0.15s;\n  animation: _ngcontent-%COMP%_mvClientFadeIn 0.3s ease-out both;\n  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);\n}\n.mv-client-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  border-color: #16a34a;\n  box-shadow: 0 4px 10px rgba(22, 163, 74, 0.15);\n}\n.mv-client-icon[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #dcfce7,\n      #bbf7d0);\n  color: #15803d;\n  padding: 0.5rem;\n  border-radius: 10px;\n  font-size: 1.5rem;\n  width: 1.5rem;\n  height: 1.5rem;\n}\n.mv-client-name[_ngcontent-%COMP%] {\n  flex: 1;\n  font-weight: 600;\n  font-size: 0.95rem;\n  color: #1e293b;\n}\n.mv-client-tag[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  padding: 0.2rem 0.55rem;\n  border-radius: 999px;\n  font-weight: 600;\n}\n.mv-tag-exclusivo[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #15803d;\n}\n.mv-tag-tradex[_ngcontent-%COMP%] {\n  background: #dbeafe;\n  color: #1d4ed8;\n}\n.mv-client-arrow[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  transition: transform 0.15s;\n}\n.mv-client-card[_ngcontent-%COMP%]:hover   .mv-client-arrow[_ngcontent-%COMP%] {\n  transform: translateX(3px);\n  color: #16a34a;\n}\n.mv-empty[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  text-align: center;\n  color: #64748b;\n  padding: 2rem;\n  margin: 0;\n  font-style: italic;\n}\n.mv-client-banner[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background:\n    linear-gradient(\n      135deg,\n      #dcfce7 0%,\n      #bbf7d0 100%);\n  border-left: 4px solid #16a34a;\n  padding: 0.75rem 1rem;\n  border-radius: 8px;\n  margin-bottom: 1rem;\n  font-size: 0.9rem;\n  color: #14532d;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.mv-client-banner-info[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.mv-client-banner-info[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #15803d;\n}\n.mv-client-banner-change[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n  background: #ffffff;\n  border: 1px solid #16a34a;\n  color: #15803d;\n  padding: 0.35rem 0.7rem;\n  border-radius: 6px;\n  font-size: 0.8rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: background-color 0.15s;\n}\n.mv-client-banner-change[_ngcontent-%COMP%]:hover {\n  background: #f0fdf4;\n}\n@keyframes _ngcontent-%COMP%_mvClientFadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(8px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_rotate {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n/*# sourceMappingURL=client-visits.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ClientVisitsComponent, { className: "ClientVisitsComponent", filePath: "src\\app\\features\\client-visits\\client-visits.component.ts", lineNumber: 72 });
})();
export {
  ClientVisitsComponent
};
//# sourceMappingURL=chunk-UJSVRJUI.js.map
