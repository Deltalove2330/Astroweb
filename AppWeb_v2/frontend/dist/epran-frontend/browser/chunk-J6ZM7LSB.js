import {
  MatBadgeModule
} from "./chunk-UGOZ64SM.js";
import {
  MatListModule
} from "./chunk-EBSQWFJT.js";
import "./chunk-APQQCC2U.js";
import {
  RealtimeService
} from "./chunk-7WZINN4L.js";
import {
  AuthService
} from "./chunk-FAJEMXMR.js";
import {
  MatTooltip,
  MatTooltipModule
} from "./chunk-PBKBS7OR.js";
import {
  Overlay,
  OverlayConfig,
  OverlayModule
} from "./chunk-CELNEZAJ.js";
import {
  CdkScrollable,
  CdkScrollableModule,
  DomPortalOutlet,
  ScrollDispatcher,
  TemplatePortal,
  ViewportRuler
} from "./chunk-ABO6AUNU.js";
import "./chunk-I7XEM5TB.js";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "./chunk-WHO5S5ML.js";
import {
  ApiService
} from "./chunk-G4LBJVY7.js";
import {
  DOWN_ARROW,
  Directionality,
  ENTER,
  ESCAPE,
  FocusKeyManager,
  FocusMonitor,
  FocusTrapFactory,
  InteractivityChecker,
  LEFT_ARROW,
  MatButtonModule,
  MatCommonModule,
  MatIcon,
  MatIconModule,
  MatRipple,
  MatRippleModule,
  Platform,
  RIGHT_ARROW,
  SPACE,
  UP_ARROW,
  coerceBooleanProperty,
  coerceNumberProperty,
  hasModifierKey,
  isFakeMousedownFromScreenReader,
  isFakeTouchstartFromScreenReader,
  normalizePassiveListenerOptions
} from "./chunk-KQNRR4FF.js";
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from "./chunk-QGVFX6Y7.js";
import "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  ANIMATION_MODULE_TYPE,
  ApplicationRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  ComponentFactoryResolver$1,
  ContentChild,
  ContentChildren,
  DOCUMENT,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Injector,
  Input,
  InputFlags,
  NgModule,
  NgZone,
  Optional,
  Output,
  QueryList,
  Self,
  Subject,
  Subscription,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation$1,
  __spreadProps,
  __spreadValues,
  asapScheduler,
  booleanAttribute,
  computed,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  forwardRef,
  fromEvent,
  inject,
  map,
  mapTo,
  merge,
  of,
  setClassMetadata,
  signal,
  startWith,
  switchMap,
  take,
  takeUntil,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵInputTransformsFeature,
  ɵɵProvidersFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵsyntheticHostListener,
  ɵɵsyntheticHostProperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-QB3BCYT5.js";

// node_modules/@angular/material/fesm2022/toolbar.mjs
var _c0 = ["*", [["mat-toolbar-row"]]];
var _c1 = ["*", "mat-toolbar-row"];
var MatToolbarRow = class _MatToolbarRow {
  static {
    this.\u0275fac = function MatToolbarRow_Factory(t) {
      return new (t || _MatToolbarRow)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _MatToolbarRow,
      selectors: [["mat-toolbar-row"]],
      hostAttrs: [1, "mat-toolbar-row"],
      exportAs: ["matToolbarRow"],
      standalone: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatToolbarRow, [{
    type: Directive,
    args: [{
      selector: "mat-toolbar-row",
      exportAs: "matToolbarRow",
      host: {
        "class": "mat-toolbar-row"
      },
      standalone: true
    }]
  }], null, null);
})();
var MatToolbar = class _MatToolbar {
  constructor(_elementRef, _platform, document2) {
    this._elementRef = _elementRef;
    this._platform = _platform;
    this._document = document2;
  }
  ngAfterViewInit() {
    if (this._platform.isBrowser) {
      this._checkToolbarMixedModes();
      this._toolbarRows.changes.subscribe(() => this._checkToolbarMixedModes());
    }
  }
  /**
   * Throws an exception when developers are attempting to combine the different toolbar row modes.
   */
  _checkToolbarMixedModes() {
    if (this._toolbarRows.length && (typeof ngDevMode === "undefined" || ngDevMode)) {
      const isCombinedUsage = Array.from(this._elementRef.nativeElement.childNodes).filter((node) => !(node.classList && node.classList.contains("mat-toolbar-row"))).filter((node) => node.nodeType !== (this._document ? this._document.COMMENT_NODE : 8)).some((node) => !!(node.textContent && node.textContent.trim()));
      if (isCombinedUsage) {
        throwToolbarMixedModesError();
      }
    }
  }
  static {
    this.\u0275fac = function MatToolbar_Factory(t) {
      return new (t || _MatToolbar)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(Platform), \u0275\u0275directiveInject(DOCUMENT));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MatToolbar,
      selectors: [["mat-toolbar"]],
      contentQueries: function MatToolbar_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuery(dirIndex, MatToolbarRow, 5);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._toolbarRows = _t);
        }
      },
      hostAttrs: [1, "mat-toolbar"],
      hostVars: 6,
      hostBindings: function MatToolbar_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275classMap(ctx.color ? "mat-" + ctx.color : "");
          \u0275\u0275classProp("mat-toolbar-multiple-rows", ctx._toolbarRows.length > 0)("mat-toolbar-single-row", ctx._toolbarRows.length === 0);
        }
      },
      inputs: {
        color: "color"
      },
      exportAs: ["matToolbar"],
      standalone: true,
      features: [\u0275\u0275StandaloneFeature],
      ngContentSelectors: _c1,
      decls: 2,
      vars: 0,
      template: function MatToolbar_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef(_c0);
          \u0275\u0275projection(0);
          \u0275\u0275projection(1, 1);
        }
      },
      styles: [".mat-toolbar{background:var(--mat-toolbar-container-background-color);color:var(--mat-toolbar-container-text-color)}.mat-toolbar,.mat-toolbar h1,.mat-toolbar h2,.mat-toolbar h3,.mat-toolbar h4,.mat-toolbar h5,.mat-toolbar h6{font-family:var(--mat-toolbar-title-text-font);font-size:var(--mat-toolbar-title-text-size);line-height:var(--mat-toolbar-title-text-line-height);font-weight:var(--mat-toolbar-title-text-weight);letter-spacing:var(--mat-toolbar-title-text-tracking);margin:0}.cdk-high-contrast-active .mat-toolbar{outline:solid 1px}.mat-toolbar .mat-form-field-underline,.mat-toolbar .mat-form-field-ripple,.mat-toolbar .mat-focused .mat-form-field-ripple{background-color:currentColor}.mat-toolbar .mat-form-field-label,.mat-toolbar .mat-focused .mat-form-field-label,.mat-toolbar .mat-select-value,.mat-toolbar .mat-select-arrow,.mat-toolbar .mat-form-field.mat-focused .mat-select-arrow{color:inherit}.mat-toolbar .mat-input-element{caret-color:currentColor}.mat-toolbar .mat-mdc-button-base.mat-mdc-button-base.mat-unthemed{--mdc-text-button-label-text-color:var(--mat-toolbar-container-text-color);--mdc-outlined-button-label-text-color:var(--mat-toolbar-container-text-color)}.mat-toolbar-row,.mat-toolbar-single-row{display:flex;box-sizing:border-box;padding:0 16px;width:100%;flex-direction:row;align-items:center;white-space:nowrap;height:var(--mat-toolbar-standard-height)}@media(max-width: 599px){.mat-toolbar-row,.mat-toolbar-single-row{height:var(--mat-toolbar-mobile-height)}}.mat-toolbar-multiple-rows{display:flex;box-sizing:border-box;flex-direction:column;width:100%;min-height:var(--mat-toolbar-standard-height)}@media(max-width: 599px){.mat-toolbar-multiple-rows{min-height:var(--mat-toolbar-mobile-height)}}"],
      encapsulation: 2,
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatToolbar, [{
    type: Component,
    args: [{
      selector: "mat-toolbar",
      exportAs: "matToolbar",
      host: {
        "class": "mat-toolbar",
        "[class]": 'color ? "mat-" + color : ""',
        "[class.mat-toolbar-multiple-rows]": "_toolbarRows.length > 0",
        "[class.mat-toolbar-single-row]": "_toolbarRows.length === 0"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation$1.None,
      standalone: true,
      template: '<ng-content></ng-content>\n<ng-content select="mat-toolbar-row"></ng-content>\n',
      styles: [".mat-toolbar{background:var(--mat-toolbar-container-background-color);color:var(--mat-toolbar-container-text-color)}.mat-toolbar,.mat-toolbar h1,.mat-toolbar h2,.mat-toolbar h3,.mat-toolbar h4,.mat-toolbar h5,.mat-toolbar h6{font-family:var(--mat-toolbar-title-text-font);font-size:var(--mat-toolbar-title-text-size);line-height:var(--mat-toolbar-title-text-line-height);font-weight:var(--mat-toolbar-title-text-weight);letter-spacing:var(--mat-toolbar-title-text-tracking);margin:0}.cdk-high-contrast-active .mat-toolbar{outline:solid 1px}.mat-toolbar .mat-form-field-underline,.mat-toolbar .mat-form-field-ripple,.mat-toolbar .mat-focused .mat-form-field-ripple{background-color:currentColor}.mat-toolbar .mat-form-field-label,.mat-toolbar .mat-focused .mat-form-field-label,.mat-toolbar .mat-select-value,.mat-toolbar .mat-select-arrow,.mat-toolbar .mat-form-field.mat-focused .mat-select-arrow{color:inherit}.mat-toolbar .mat-input-element{caret-color:currentColor}.mat-toolbar .mat-mdc-button-base.mat-mdc-button-base.mat-unthemed{--mdc-text-button-label-text-color:var(--mat-toolbar-container-text-color);--mdc-outlined-button-label-text-color:var(--mat-toolbar-container-text-color)}.mat-toolbar-row,.mat-toolbar-single-row{display:flex;box-sizing:border-box;padding:0 16px;width:100%;flex-direction:row;align-items:center;white-space:nowrap;height:var(--mat-toolbar-standard-height)}@media(max-width: 599px){.mat-toolbar-row,.mat-toolbar-single-row{height:var(--mat-toolbar-mobile-height)}}.mat-toolbar-multiple-rows{display:flex;box-sizing:border-box;flex-direction:column;width:100%;min-height:var(--mat-toolbar-standard-height)}@media(max-width: 599px){.mat-toolbar-multiple-rows{min-height:var(--mat-toolbar-mobile-height)}}"]
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: Platform
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }], {
    color: [{
      type: Input
    }],
    _toolbarRows: [{
      type: ContentChildren,
      args: [MatToolbarRow, {
        descendants: true
      }]
    }]
  });
})();
function throwToolbarMixedModesError() {
  throw Error("MatToolbar: Attempting to combine different toolbar modes. Either specify multiple `<mat-toolbar-row>` elements explicitly or just place content inside of a `<mat-toolbar>` for a single row.");
}
var MatToolbarModule = class _MatToolbarModule {
  static {
    this.\u0275fac = function MatToolbarModule_Factory(t) {
      return new (t || _MatToolbarModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _MatToolbarModule
    });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
      imports: [MatCommonModule, MatCommonModule]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatToolbarModule, [{
    type: NgModule,
    args: [{
      imports: [MatCommonModule, MatToolbar, MatToolbarRow],
      exports: [MatToolbar, MatToolbarRow, MatCommonModule]
    }]
  }], null, null);
})();

// node_modules/@angular/material/fesm2022/sidenav.mjs
var _c02 = ["*"];
var _c12 = ["content"];
var _c2 = [[["mat-drawer"]], [["mat-drawer-content"]], "*"];
var _c3 = ["mat-drawer", "mat-drawer-content", "*"];
function MatDrawerContainer_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275listener("click", function MatDrawerContainer_Conditional_0_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1._onBackdropClicked());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("mat-drawer-shown", ctx_r1._isShowingBackdrop());
  }
}
function MatDrawerContainer_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-drawer-content");
    \u0275\u0275projection(1, 2);
    \u0275\u0275elementEnd();
  }
}
var _c4 = [[["mat-sidenav"]], [["mat-sidenav-content"]], "*"];
var _c5 = ["mat-sidenav", "mat-sidenav-content", "*"];
function MatSidenavContainer_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275listener("click", function MatSidenavContainer_Conditional_0_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1._onBackdropClicked());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("mat-drawer-shown", ctx_r1._isShowingBackdrop());
  }
}
function MatSidenavContainer_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-sidenav-content");
    \u0275\u0275projection(1, 2);
    \u0275\u0275elementEnd();
  }
}
var _c6 = '.mat-drawer-container{position:relative;z-index:1;color:var(--mat-sidenav-content-text-color);background-color:var(--mat-sidenav-content-background-color);box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible;background-color:var(--mat-sidenav-scrim-color)}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}.cdk-high-contrast-active .mat-drawer-backdrop{opacity:.5}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;color:var(--mat-sidenav-container-text-color);box-shadow:var(--mat-sidenav-container-elevation-shadow);background-color:var(--mat-sidenav-container-background-color);border-top-right-radius:var(--mat-sidenav-container-shape);border-bottom-right-radius:var(--mat-sidenav-container-shape);width:var(--mat-sidenav-container-width);display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}.cdk-high-contrast-active .mat-drawer,.cdk-high-contrast-active [dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}.cdk-high-contrast-active [dir=rtl] .mat-drawer,.cdk-high-contrast-active .mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0);border-top-left-radius:var(--mat-sidenav-container-shape);border-bottom-left-radius:var(--mat-sidenav-container-shape);border-top-right-radius:0;border-bottom-right-radius:0}[dir=rtl] .mat-drawer{border-top-left-radius:var(--mat-sidenav-container-shape);border-bottom-left-radius:var(--mat-sidenav-container-shape);border-top-right-radius:0;border-bottom-right-radius:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{border-top-right-radius:var(--mat-sidenav-container-shape);border-bottom-right-radius:var(--mat-sidenav-container-shape);border-top-left-radius:0;border-bottom-left-radius:0;left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer[style*="visibility: hidden"]{display:none}.mat-drawer-side{box-shadow:none;border-right-color:var(--mat-sidenav-container-divider-color);border-right-width:1px;border-right-style:solid}.mat-drawer-side.mat-drawer-end{border-left-color:var(--mat-sidenav-container-divider-color);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side{border-left-color:var(--mat-sidenav-container-divider-color);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side.mat-drawer-end{border-right-color:var(--mat-sidenav-container-divider-color);border-right-width:1px;border-right-style:solid;border-left:none}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}';
var matDrawerAnimations = {
  /** Animation that slides a drawer in and out. */
  transformDrawer: trigger("transform", [
    // We remove the `transform` here completely, rather than setting it to zero, because:
    // 1. Having a transform can cause elements with ripples or an animated
    //    transform to shift around in Chrome with an RTL layout (see #10023).
    // 2. 3d transforms causes text to appear blurry on IE and Edge.
    state("open, open-instant", style({
      "transform": "none",
      "visibility": "visible"
    })),
    state("void", style({
      // Avoids the shadow showing up when closed in SSR.
      "box-shadow": "none",
      "visibility": "hidden"
    })),
    transition("void => open-instant", animate("0ms")),
    transition("void <=> open, open-instant => void", animate("400ms cubic-bezier(0.25, 0.8, 0.25, 1)"))
  ])
};
function throwMatDuplicatedDrawerError(position) {
  throw Error(`A drawer was already declared for 'position="${position}"'`);
}
var MAT_DRAWER_DEFAULT_AUTOSIZE = new InjectionToken("MAT_DRAWER_DEFAULT_AUTOSIZE", {
  providedIn: "root",
  factory: MAT_DRAWER_DEFAULT_AUTOSIZE_FACTORY
});
var MAT_DRAWER_CONTAINER = new InjectionToken("MAT_DRAWER_CONTAINER");
function MAT_DRAWER_DEFAULT_AUTOSIZE_FACTORY() {
  return false;
}
var MatDrawerContent = class _MatDrawerContent extends CdkScrollable {
  constructor(_changeDetectorRef, _container, elementRef, scrollDispatcher, ngZone) {
    super(elementRef, scrollDispatcher, ngZone);
    this._changeDetectorRef = _changeDetectorRef;
    this._container = _container;
  }
  ngAfterContentInit() {
    this._container._contentMarginChanges.subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }
  static {
    this.\u0275fac = function MatDrawerContent_Factory(t) {
      return new (t || _MatDrawerContent)(\u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(forwardRef(() => MatDrawerContainer)), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(ScrollDispatcher), \u0275\u0275directiveInject(NgZone));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MatDrawerContent,
      selectors: [["mat-drawer-content"]],
      hostAttrs: [1, "mat-drawer-content"],
      hostVars: 4,
      hostBindings: function MatDrawerContent_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275styleProp("margin-left", ctx._container._contentMargins.left, "px")("margin-right", ctx._container._contentMargins.right, "px");
        }
      },
      standalone: true,
      features: [\u0275\u0275ProvidersFeature([{
        provide: CdkScrollable,
        useExisting: _MatDrawerContent
      }]), \u0275\u0275InheritDefinitionFeature, \u0275\u0275StandaloneFeature],
      ngContentSelectors: _c02,
      decls: 1,
      vars: 0,
      template: function MatDrawerContent_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275projection(0);
        }
      },
      encapsulation: 2,
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatDrawerContent, [{
    type: Component,
    args: [{
      selector: "mat-drawer-content",
      template: "<ng-content></ng-content>",
      host: {
        "class": "mat-drawer-content",
        "[style.margin-left.px]": "_container._contentMargins.left",
        "[style.margin-right.px]": "_container._contentMargins.right"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation$1.None,
      providers: [{
        provide: CdkScrollable,
        useExisting: MatDrawerContent
      }],
      standalone: true
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: MatDrawerContainer,
    decorators: [{
      type: Inject,
      args: [forwardRef(() => MatDrawerContainer)]
    }]
  }, {
    type: ElementRef
  }, {
    type: ScrollDispatcher
  }, {
    type: NgZone
  }], null);
})();
var MatDrawer = class _MatDrawer {
  /** The side that the drawer is attached to. */
  get position() {
    return this._position;
  }
  set position(value) {
    value = value === "end" ? "end" : "start";
    if (value !== this._position) {
      if (this._isAttached) {
        this._updatePositionInParent(value);
      }
      this._position = value;
      this.onPositionChanged.emit();
    }
  }
  /** Mode of the drawer; one of 'over', 'push' or 'side'. */
  get mode() {
    return this._mode;
  }
  set mode(value) {
    this._mode = value;
    this._updateFocusTrapState();
    this._modeChanged.next();
  }
  /** Whether the drawer can be closed with the escape key or by clicking on the backdrop. */
  get disableClose() {
    return this._disableClose;
  }
  set disableClose(value) {
    this._disableClose = coerceBooleanProperty(value);
  }
  /**
   * Whether the drawer should focus the first focusable element automatically when opened.
   * Defaults to false in when `mode` is set to `side`, otherwise defaults to `true`. If explicitly
   * enabled, focus will be moved into the sidenav in `side` mode as well.
   * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or AutoFocusTarget
   * instead.
   */
  get autoFocus() {
    const value = this._autoFocus;
    if (value == null) {
      if (this.mode === "side") {
        return "dialog";
      } else {
        return "first-tabbable";
      }
    }
    return value;
  }
  set autoFocus(value) {
    if (value === "true" || value === "false" || value == null) {
      value = coerceBooleanProperty(value);
    }
    this._autoFocus = value;
  }
  /**
   * Whether the drawer is opened. We overload this because we trigger an event when it
   * starts or end.
   */
  get opened() {
    return this._opened;
  }
  set opened(value) {
    this.toggle(coerceBooleanProperty(value));
  }
  constructor(_elementRef, _focusTrapFactory, _focusMonitor, _platform, _ngZone, _interactivityChecker, _doc, _container) {
    this._elementRef = _elementRef;
    this._focusTrapFactory = _focusTrapFactory;
    this._focusMonitor = _focusMonitor;
    this._platform = _platform;
    this._ngZone = _ngZone;
    this._interactivityChecker = _interactivityChecker;
    this._doc = _doc;
    this._container = _container;
    this._focusTrap = null;
    this._elementFocusedBeforeDrawerWasOpened = null;
    this._enableAnimations = false;
    this._position = "start";
    this._mode = "over";
    this._disableClose = false;
    this._opened = false;
    this._animationStarted = new Subject();
    this._animationEnd = new Subject();
    this._animationState = "void";
    this.openedChange = // Note this has to be async in order to avoid some issues with two-bindings (see #8872).
    new EventEmitter(
      /* isAsync */
      true
    );
    this._openedStream = this.openedChange.pipe(filter((o) => o), map(() => {
    }));
    this.openedStart = this._animationStarted.pipe(filter((e) => e.fromState !== e.toState && e.toState.indexOf("open") === 0), mapTo(void 0));
    this._closedStream = this.openedChange.pipe(filter((o) => !o), map(() => {
    }));
    this.closedStart = this._animationStarted.pipe(filter((e) => e.fromState !== e.toState && e.toState === "void"), mapTo(void 0));
    this._destroyed = new Subject();
    this.onPositionChanged = new EventEmitter();
    this._modeChanged = new Subject();
    this.openedChange.subscribe((opened) => {
      if (opened) {
        if (this._doc) {
          this._elementFocusedBeforeDrawerWasOpened = this._doc.activeElement;
        }
        this._takeFocus();
      } else if (this._isFocusWithinDrawer()) {
        this._restoreFocus(this._openedVia || "program");
      }
    });
    this._ngZone.runOutsideAngular(() => {
      fromEvent(this._elementRef.nativeElement, "keydown").pipe(filter((event) => {
        return event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event);
      }), takeUntil(this._destroyed)).subscribe((event) => this._ngZone.run(() => {
        this.close();
        event.stopPropagation();
        event.preventDefault();
      }));
    });
    this._animationEnd.pipe(distinctUntilChanged((x, y) => {
      return x.fromState === y.fromState && x.toState === y.toState;
    })).subscribe((event) => {
      const {
        fromState,
        toState
      } = event;
      if (toState.indexOf("open") === 0 && fromState === "void" || toState === "void" && fromState.indexOf("open") === 0) {
        this.openedChange.emit(this._opened);
      }
    });
  }
  /**
   * Focuses the provided element. If the element is not focusable, it will add a tabIndex
   * attribute to forcefully focus it. The attribute is removed after focus is moved.
   * @param element The element to focus.
   */
  _forceFocus(element, options) {
    if (!this._interactivityChecker.isFocusable(element)) {
      element.tabIndex = -1;
      this._ngZone.runOutsideAngular(() => {
        const callback = () => {
          element.removeEventListener("blur", callback);
          element.removeEventListener("mousedown", callback);
          element.removeAttribute("tabindex");
        };
        element.addEventListener("blur", callback);
        element.addEventListener("mousedown", callback);
      });
    }
    element.focus(options);
  }
  /**
   * Focuses the first element that matches the given selector within the focus trap.
   * @param selector The CSS selector for the element to set focus to.
   */
  _focusByCssSelector(selector, options) {
    let elementToFocus = this._elementRef.nativeElement.querySelector(selector);
    if (elementToFocus) {
      this._forceFocus(elementToFocus, options);
    }
  }
  /**
   * Moves focus into the drawer. Note that this works even if
   * the focus trap is disabled in `side` mode.
   */
  _takeFocus() {
    if (!this._focusTrap) {
      return;
    }
    const element = this._elementRef.nativeElement;
    switch (this.autoFocus) {
      case false:
      case "dialog":
        return;
      case true:
      case "first-tabbable":
        this._focusTrap.focusInitialElementWhenReady().then((hasMovedFocus) => {
          if (!hasMovedFocus && typeof this._elementRef.nativeElement.focus === "function") {
            element.focus();
          }
        });
        break;
      case "first-heading":
        this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');
        break;
      default:
        this._focusByCssSelector(this.autoFocus);
        break;
    }
  }
  /**
   * Restores focus to the element that was originally focused when the drawer opened.
   * If no element was focused at that time, the focus will be restored to the drawer.
   */
  _restoreFocus(focusOrigin) {
    if (this.autoFocus === "dialog") {
      return;
    }
    if (this._elementFocusedBeforeDrawerWasOpened) {
      this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened, focusOrigin);
    } else {
      this._elementRef.nativeElement.blur();
    }
    this._elementFocusedBeforeDrawerWasOpened = null;
  }
  /** Whether focus is currently within the drawer. */
  _isFocusWithinDrawer() {
    const activeEl = this._doc.activeElement;
    return !!activeEl && this._elementRef.nativeElement.contains(activeEl);
  }
  ngAfterViewInit() {
    this._isAttached = true;
    if (this._position === "end") {
      this._updatePositionInParent("end");
    }
    if (this._platform.isBrowser) {
      this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
      this._updateFocusTrapState();
    }
  }
  ngAfterContentChecked() {
    if (this._platform.isBrowser) {
      this._enableAnimations = true;
    }
  }
  ngOnDestroy() {
    this._focusTrap?.destroy();
    this._anchor?.remove();
    this._anchor = null;
    this._animationStarted.complete();
    this._animationEnd.complete();
    this._modeChanged.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }
  /**
   * Open the drawer.
   * @param openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
   * Used for focus management after the sidenav is closed.
   */
  open(openedVia) {
    return this.toggle(true, openedVia);
  }
  /** Close the drawer. */
  close() {
    return this.toggle(false);
  }
  /** Closes the drawer with context that the backdrop was clicked. */
  _closeViaBackdropClick() {
    return this._setOpen(
      /* isOpen */
      false,
      /* restoreFocus */
      true,
      "mouse"
    );
  }
  /**
   * Toggle this drawer.
   * @param isOpen Whether the drawer should be open.
   * @param openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
   * Used for focus management after the sidenav is closed.
   */
  toggle(isOpen = !this.opened, openedVia) {
    if (isOpen && openedVia) {
      this._openedVia = openedVia;
    }
    const result = this._setOpen(
      isOpen,
      /* restoreFocus */
      !isOpen && this._isFocusWithinDrawer(),
      this._openedVia || "program"
    );
    if (!isOpen) {
      this._openedVia = null;
    }
    return result;
  }
  /**
   * Toggles the opened state of the drawer.
   * @param isOpen Whether the drawer should open or close.
   * @param restoreFocus Whether focus should be restored on close.
   * @param focusOrigin Origin to use when restoring focus.
   */
  _setOpen(isOpen, restoreFocus, focusOrigin) {
    this._opened = isOpen;
    if (isOpen) {
      this._animationState = this._enableAnimations ? "open" : "open-instant";
    } else {
      this._animationState = "void";
      if (restoreFocus) {
        this._restoreFocus(focusOrigin);
      }
    }
    this._updateFocusTrapState();
    return new Promise((resolve) => {
      this.openedChange.pipe(take(1)).subscribe((open) => resolve(open ? "open" : "close"));
    });
  }
  _getWidth() {
    return this._elementRef.nativeElement ? this._elementRef.nativeElement.offsetWidth || 0 : 0;
  }
  /** Updates the enabled state of the focus trap. */
  _updateFocusTrapState() {
    if (this._focusTrap) {
      this._focusTrap.enabled = !!this._container?.hasBackdrop;
    }
  }
  /**
   * Updates the position of the drawer in the DOM. We need to move the element around ourselves
   * when it's in the `end` position so that it comes after the content and the visual order
   * matches the tab order. We also need to be able to move it back to `start` if the sidenav
   * started off as `end` and was changed to `start`.
   */
  _updatePositionInParent(newPosition) {
    if (!this._platform.isBrowser) {
      return;
    }
    const element = this._elementRef.nativeElement;
    const parent = element.parentNode;
    if (newPosition === "end") {
      if (!this._anchor) {
        this._anchor = this._doc.createComment("mat-drawer-anchor");
        parent.insertBefore(this._anchor, element);
      }
      parent.appendChild(element);
    } else if (this._anchor) {
      this._anchor.parentNode.insertBefore(element, this._anchor);
    }
  }
  static {
    this.\u0275fac = function MatDrawer_Factory(t) {
      return new (t || _MatDrawer)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(FocusTrapFactory), \u0275\u0275directiveInject(FocusMonitor), \u0275\u0275directiveInject(Platform), \u0275\u0275directiveInject(NgZone), \u0275\u0275directiveInject(InteractivityChecker), \u0275\u0275directiveInject(DOCUMENT, 8), \u0275\u0275directiveInject(MAT_DRAWER_CONTAINER, 8));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MatDrawer,
      selectors: [["mat-drawer"]],
      viewQuery: function MatDrawer_Query(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275viewQuery(_c12, 5);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._content = _t.first);
        }
      },
      hostAttrs: ["tabIndex", "-1", 1, "mat-drawer"],
      hostVars: 12,
      hostBindings: function MatDrawer_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275syntheticHostListener("@transform.start", function MatDrawer_animation_transform_start_HostBindingHandler($event) {
            return ctx._animationStarted.next($event);
          })("@transform.done", function MatDrawer_animation_transform_done_HostBindingHandler($event) {
            return ctx._animationEnd.next($event);
          });
        }
        if (rf & 2) {
          \u0275\u0275syntheticHostProperty("@transform", ctx._animationState);
          \u0275\u0275attribute("align", null);
          \u0275\u0275classProp("mat-drawer-end", ctx.position === "end")("mat-drawer-over", ctx.mode === "over")("mat-drawer-push", ctx.mode === "push")("mat-drawer-side", ctx.mode === "side")("mat-drawer-opened", ctx.opened);
        }
      },
      inputs: {
        position: "position",
        mode: "mode",
        disableClose: "disableClose",
        autoFocus: "autoFocus",
        opened: "opened"
      },
      outputs: {
        openedChange: "openedChange",
        _openedStream: "opened",
        openedStart: "openedStart",
        _closedStream: "closed",
        closedStart: "closedStart",
        onPositionChanged: "positionChanged"
      },
      exportAs: ["matDrawer"],
      standalone: true,
      features: [\u0275\u0275StandaloneFeature],
      ngContentSelectors: _c02,
      decls: 3,
      vars: 0,
      consts: [["content", ""], ["cdkScrollable", "", 1, "mat-drawer-inner-container"]],
      template: function MatDrawer_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275elementStart(0, "div", 1, 0);
          \u0275\u0275projection(2);
          \u0275\u0275elementEnd();
        }
      },
      dependencies: [CdkScrollable],
      encapsulation: 2,
      data: {
        animation: [matDrawerAnimations.transformDrawer]
      },
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatDrawer, [{
    type: Component,
    args: [{
      selector: "mat-drawer",
      exportAs: "matDrawer",
      animations: [matDrawerAnimations.transformDrawer],
      host: {
        "class": "mat-drawer",
        // must prevent the browser from aligning text based on value
        "[attr.align]": "null",
        "[class.mat-drawer-end]": 'position === "end"',
        "[class.mat-drawer-over]": 'mode === "over"',
        "[class.mat-drawer-push]": 'mode === "push"',
        "[class.mat-drawer-side]": 'mode === "side"',
        "[class.mat-drawer-opened]": "opened",
        "tabIndex": "-1",
        "[@transform]": "_animationState",
        "(@transform.start)": "_animationStarted.next($event)",
        "(@transform.done)": "_animationEnd.next($event)"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation$1.None,
      standalone: true,
      imports: [CdkScrollable],
      template: '<div class="mat-drawer-inner-container" cdkScrollable #content>\r\n  <ng-content></ng-content>\r\n</div>\r\n'
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: FocusTrapFactory
  }, {
    type: FocusMonitor
  }, {
    type: Platform
  }, {
    type: NgZone
  }, {
    type: InteractivityChecker
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: MatDrawerContainer,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [MAT_DRAWER_CONTAINER]
    }]
  }], {
    position: [{
      type: Input
    }],
    mode: [{
      type: Input
    }],
    disableClose: [{
      type: Input
    }],
    autoFocus: [{
      type: Input
    }],
    opened: [{
      type: Input
    }],
    openedChange: [{
      type: Output
    }],
    _openedStream: [{
      type: Output,
      args: ["opened"]
    }],
    openedStart: [{
      type: Output
    }],
    _closedStream: [{
      type: Output,
      args: ["closed"]
    }],
    closedStart: [{
      type: Output
    }],
    onPositionChanged: [{
      type: Output,
      args: ["positionChanged"]
    }],
    _content: [{
      type: ViewChild,
      args: ["content"]
    }]
  });
})();
var MatDrawerContainer = class _MatDrawerContainer {
  /** The drawer child with the `start` position. */
  get start() {
    return this._start;
  }
  /** The drawer child with the `end` position. */
  get end() {
    return this._end;
  }
  /**
   * Whether to automatically resize the container whenever
   * the size of any of its drawers changes.
   *
   * **Use at your own risk!** Enabling this option can cause layout thrashing by measuring
   * the drawers on every change detection cycle. Can be configured globally via the
   * `MAT_DRAWER_DEFAULT_AUTOSIZE` token.
   */
  get autosize() {
    return this._autosize;
  }
  set autosize(value) {
    this._autosize = coerceBooleanProperty(value);
  }
  /**
   * Whether the drawer container should have a backdrop while one of the sidenavs is open.
   * If explicitly set to `true`, the backdrop will be enabled for drawers in the `side`
   * mode as well.
   */
  get hasBackdrop() {
    return this._drawerHasBackdrop(this._start) || this._drawerHasBackdrop(this._end);
  }
  set hasBackdrop(value) {
    this._backdropOverride = value == null ? null : coerceBooleanProperty(value);
  }
  /** Reference to the CdkScrollable instance that wraps the scrollable content. */
  get scrollable() {
    return this._userContent || this._content;
  }
  constructor(_dir, _element, _ngZone, _changeDetectorRef, viewportRuler, defaultAutosize = false, _animationMode) {
    this._dir = _dir;
    this._element = _element;
    this._ngZone = _ngZone;
    this._changeDetectorRef = _changeDetectorRef;
    this._animationMode = _animationMode;
    this._drawers = new QueryList();
    this.backdropClick = new EventEmitter();
    this._destroyed = new Subject();
    this._doCheckSubject = new Subject();
    this._contentMargins = {
      left: null,
      right: null
    };
    this._contentMarginChanges = new Subject();
    if (_dir) {
      _dir.change.pipe(takeUntil(this._destroyed)).subscribe(() => {
        this._validateDrawers();
        this.updateContentMargins();
      });
    }
    viewportRuler.change().pipe(takeUntil(this._destroyed)).subscribe(() => this.updateContentMargins());
    this._autosize = defaultAutosize;
  }
  ngAfterContentInit() {
    this._allDrawers.changes.pipe(startWith(this._allDrawers), takeUntil(this._destroyed)).subscribe((drawer) => {
      this._drawers.reset(drawer.filter((item) => !item._container || item._container === this));
      this._drawers.notifyOnChanges();
    });
    this._drawers.changes.pipe(startWith(null)).subscribe(() => {
      this._validateDrawers();
      this._drawers.forEach((drawer) => {
        this._watchDrawerToggle(drawer);
        this._watchDrawerPosition(drawer);
        this._watchDrawerMode(drawer);
      });
      if (!this._drawers.length || this._isDrawerOpen(this._start) || this._isDrawerOpen(this._end)) {
        this.updateContentMargins();
      }
      this._changeDetectorRef.markForCheck();
    });
    this._ngZone.runOutsideAngular(() => {
      this._doCheckSubject.pipe(
        debounceTime(10),
        // Arbitrary debounce time, less than a frame at 60fps
        takeUntil(this._destroyed)
      ).subscribe(() => this.updateContentMargins());
    });
  }
  ngOnDestroy() {
    this._contentMarginChanges.complete();
    this._doCheckSubject.complete();
    this._drawers.destroy();
    this._destroyed.next();
    this._destroyed.complete();
  }
  /** Calls `open` of both start and end drawers */
  open() {
    this._drawers.forEach((drawer) => drawer.open());
  }
  /** Calls `close` of both start and end drawers */
  close() {
    this._drawers.forEach((drawer) => drawer.close());
  }
  /**
   * Recalculates and updates the inline styles for the content. Note that this should be used
   * sparingly, because it causes a reflow.
   */
  updateContentMargins() {
    let left = 0;
    let right = 0;
    if (this._left && this._left.opened) {
      if (this._left.mode == "side") {
        left += this._left._getWidth();
      } else if (this._left.mode == "push") {
        const width = this._left._getWidth();
        left += width;
        right -= width;
      }
    }
    if (this._right && this._right.opened) {
      if (this._right.mode == "side") {
        right += this._right._getWidth();
      } else if (this._right.mode == "push") {
        const width = this._right._getWidth();
        right += width;
        left -= width;
      }
    }
    left = left || null;
    right = right || null;
    if (left !== this._contentMargins.left || right !== this._contentMargins.right) {
      this._contentMargins = {
        left,
        right
      };
      this._ngZone.run(() => this._contentMarginChanges.next(this._contentMargins));
    }
  }
  ngDoCheck() {
    if (this._autosize && this._isPushed()) {
      this._ngZone.runOutsideAngular(() => this._doCheckSubject.next());
    }
  }
  /**
   * Subscribes to drawer events in order to set a class on the main container element when the
   * drawer is open and the backdrop is visible. This ensures any overflow on the container element
   * is properly hidden.
   */
  _watchDrawerToggle(drawer) {
    drawer._animationStarted.pipe(filter((event) => event.fromState !== event.toState), takeUntil(this._drawers.changes)).subscribe((event) => {
      if (event.toState !== "open-instant" && this._animationMode !== "NoopAnimations") {
        this._element.nativeElement.classList.add("mat-drawer-transition");
      }
      this.updateContentMargins();
      this._changeDetectorRef.markForCheck();
    });
    if (drawer.mode !== "side") {
      drawer.openedChange.pipe(takeUntil(this._drawers.changes)).subscribe(() => this._setContainerClass(drawer.opened));
    }
  }
  /**
   * Subscribes to drawer onPositionChanged event in order to
   * re-validate drawers when the position changes.
   */
  _watchDrawerPosition(drawer) {
    if (!drawer) {
      return;
    }
    drawer.onPositionChanged.pipe(takeUntil(this._drawers.changes)).subscribe(() => {
      this._ngZone.onMicrotaskEmpty.pipe(take(1)).subscribe(() => {
        this._validateDrawers();
      });
    });
  }
  /** Subscribes to changes in drawer mode so we can run change detection. */
  _watchDrawerMode(drawer) {
    if (drawer) {
      drawer._modeChanged.pipe(takeUntil(merge(this._drawers.changes, this._destroyed))).subscribe(() => {
        this.updateContentMargins();
        this._changeDetectorRef.markForCheck();
      });
    }
  }
  /** Toggles the 'mat-drawer-opened' class on the main 'mat-drawer-container' element. */
  _setContainerClass(isAdd) {
    const classList = this._element.nativeElement.classList;
    const className = "mat-drawer-container-has-open";
    if (isAdd) {
      classList.add(className);
    } else {
      classList.remove(className);
    }
  }
  /** Validate the state of the drawer children components. */
  _validateDrawers() {
    this._start = this._end = null;
    this._drawers.forEach((drawer) => {
      if (drawer.position == "end") {
        if (this._end != null && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throwMatDuplicatedDrawerError("end");
        }
        this._end = drawer;
      } else {
        if (this._start != null && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throwMatDuplicatedDrawerError("start");
        }
        this._start = drawer;
      }
    });
    this._right = this._left = null;
    if (this._dir && this._dir.value === "rtl") {
      this._left = this._end;
      this._right = this._start;
    } else {
      this._left = this._start;
      this._right = this._end;
    }
  }
  /** Whether the container is being pushed to the side by one of the drawers. */
  _isPushed() {
    return this._isDrawerOpen(this._start) && this._start.mode != "over" || this._isDrawerOpen(this._end) && this._end.mode != "over";
  }
  _onBackdropClicked() {
    this.backdropClick.emit();
    this._closeModalDrawersViaBackdrop();
  }
  _closeModalDrawersViaBackdrop() {
    [this._start, this._end].filter((drawer) => drawer && !drawer.disableClose && this._drawerHasBackdrop(drawer)).forEach((drawer) => drawer._closeViaBackdropClick());
  }
  _isShowingBackdrop() {
    return this._isDrawerOpen(this._start) && this._drawerHasBackdrop(this._start) || this._isDrawerOpen(this._end) && this._drawerHasBackdrop(this._end);
  }
  _isDrawerOpen(drawer) {
    return drawer != null && drawer.opened;
  }
  // Whether argument drawer should have a backdrop when it opens
  _drawerHasBackdrop(drawer) {
    if (this._backdropOverride == null) {
      return !!drawer && drawer.mode !== "side";
    }
    return this._backdropOverride;
  }
  static {
    this.\u0275fac = function MatDrawerContainer_Factory(t) {
      return new (t || _MatDrawerContainer)(\u0275\u0275directiveInject(Directionality, 8), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(NgZone), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(ViewportRuler), \u0275\u0275directiveInject(MAT_DRAWER_DEFAULT_AUTOSIZE), \u0275\u0275directiveInject(ANIMATION_MODULE_TYPE, 8));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MatDrawerContainer,
      selectors: [["mat-drawer-container"]],
      contentQueries: function MatDrawerContainer_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuery(dirIndex, MatDrawerContent, 5);
          \u0275\u0275contentQuery(dirIndex, MatDrawer, 5);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._content = _t.first);
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._allDrawers = _t);
        }
      },
      viewQuery: function MatDrawerContainer_Query(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275viewQuery(MatDrawerContent, 5);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._userContent = _t.first);
        }
      },
      hostAttrs: [1, "mat-drawer-container"],
      hostVars: 2,
      hostBindings: function MatDrawerContainer_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275classProp("mat-drawer-container-explicit-backdrop", ctx._backdropOverride);
        }
      },
      inputs: {
        autosize: "autosize",
        hasBackdrop: "hasBackdrop"
      },
      outputs: {
        backdropClick: "backdropClick"
      },
      exportAs: ["matDrawerContainer"],
      standalone: true,
      features: [\u0275\u0275ProvidersFeature([{
        provide: MAT_DRAWER_CONTAINER,
        useExisting: _MatDrawerContainer
      }]), \u0275\u0275StandaloneFeature],
      ngContentSelectors: _c3,
      decls: 4,
      vars: 2,
      consts: [[1, "mat-drawer-backdrop", 3, "mat-drawer-shown"], [1, "mat-drawer-backdrop", 3, "click"]],
      template: function MatDrawerContainer_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef(_c2);
          \u0275\u0275template(0, MatDrawerContainer_Conditional_0_Template, 1, 2, "div", 0);
          \u0275\u0275projection(1);
          \u0275\u0275projection(2, 1);
          \u0275\u0275template(3, MatDrawerContainer_Conditional_3_Template, 2, 0, "mat-drawer-content");
        }
        if (rf & 2) {
          \u0275\u0275conditional(0, ctx.hasBackdrop ? 0 : -1);
          \u0275\u0275advance(3);
          \u0275\u0275conditional(3, !ctx._content ? 3 : -1);
        }
      },
      dependencies: [MatDrawerContent],
      styles: ['.mat-drawer-container{position:relative;z-index:1;color:var(--mat-sidenav-content-text-color);background-color:var(--mat-sidenav-content-background-color);box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible;background-color:var(--mat-sidenav-scrim-color)}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}.cdk-high-contrast-active .mat-drawer-backdrop{opacity:.5}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;color:var(--mat-sidenav-container-text-color);box-shadow:var(--mat-sidenav-container-elevation-shadow);background-color:var(--mat-sidenav-container-background-color);border-top-right-radius:var(--mat-sidenav-container-shape);border-bottom-right-radius:var(--mat-sidenav-container-shape);width:var(--mat-sidenav-container-width);display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}.cdk-high-contrast-active .mat-drawer,.cdk-high-contrast-active [dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}.cdk-high-contrast-active [dir=rtl] .mat-drawer,.cdk-high-contrast-active .mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0);border-top-left-radius:var(--mat-sidenav-container-shape);border-bottom-left-radius:var(--mat-sidenav-container-shape);border-top-right-radius:0;border-bottom-right-radius:0}[dir=rtl] .mat-drawer{border-top-left-radius:var(--mat-sidenav-container-shape);border-bottom-left-radius:var(--mat-sidenav-container-shape);border-top-right-radius:0;border-bottom-right-radius:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{border-top-right-radius:var(--mat-sidenav-container-shape);border-bottom-right-radius:var(--mat-sidenav-container-shape);border-top-left-radius:0;border-bottom-left-radius:0;left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer[style*="visibility: hidden"]{display:none}.mat-drawer-side{box-shadow:none;border-right-color:var(--mat-sidenav-container-divider-color);border-right-width:1px;border-right-style:solid}.mat-drawer-side.mat-drawer-end{border-left-color:var(--mat-sidenav-container-divider-color);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side{border-left-color:var(--mat-sidenav-container-divider-color);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side.mat-drawer-end{border-right-color:var(--mat-sidenav-container-divider-color);border-right-width:1px;border-right-style:solid;border-left:none}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}'],
      encapsulation: 2,
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatDrawerContainer, [{
    type: Component,
    args: [{
      selector: "mat-drawer-container",
      exportAs: "matDrawerContainer",
      host: {
        "class": "mat-drawer-container",
        "[class.mat-drawer-container-explicit-backdrop]": "_backdropOverride"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation$1.None,
      providers: [{
        provide: MAT_DRAWER_CONTAINER,
        useExisting: MatDrawerContainer
      }],
      standalone: true,
      imports: [MatDrawerContent],
      template: '@if (hasBackdrop) {\n  <div class="mat-drawer-backdrop" (click)="_onBackdropClicked()"\n       [class.mat-drawer-shown]="_isShowingBackdrop()"></div>\n}\n\n<ng-content select="mat-drawer"></ng-content>\n\n<ng-content select="mat-drawer-content">\n</ng-content>\n\n@if (!_content) {\n  <mat-drawer-content>\n    <ng-content></ng-content>\n  </mat-drawer-content>\n}\n',
      styles: ['.mat-drawer-container{position:relative;z-index:1;color:var(--mat-sidenav-content-text-color);background-color:var(--mat-sidenav-content-background-color);box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible;background-color:var(--mat-sidenav-scrim-color)}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}.cdk-high-contrast-active .mat-drawer-backdrop{opacity:.5}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;color:var(--mat-sidenav-container-text-color);box-shadow:var(--mat-sidenav-container-elevation-shadow);background-color:var(--mat-sidenav-container-background-color);border-top-right-radius:var(--mat-sidenav-container-shape);border-bottom-right-radius:var(--mat-sidenav-container-shape);width:var(--mat-sidenav-container-width);display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}.cdk-high-contrast-active .mat-drawer,.cdk-high-contrast-active [dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}.cdk-high-contrast-active [dir=rtl] .mat-drawer,.cdk-high-contrast-active .mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0);border-top-left-radius:var(--mat-sidenav-container-shape);border-bottom-left-radius:var(--mat-sidenav-container-shape);border-top-right-radius:0;border-bottom-right-radius:0}[dir=rtl] .mat-drawer{border-top-left-radius:var(--mat-sidenav-container-shape);border-bottom-left-radius:var(--mat-sidenav-container-shape);border-top-right-radius:0;border-bottom-right-radius:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{border-top-right-radius:var(--mat-sidenav-container-shape);border-bottom-right-radius:var(--mat-sidenav-container-shape);border-top-left-radius:0;border-bottom-left-radius:0;left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer[style*="visibility: hidden"]{display:none}.mat-drawer-side{box-shadow:none;border-right-color:var(--mat-sidenav-container-divider-color);border-right-width:1px;border-right-style:solid}.mat-drawer-side.mat-drawer-end{border-left-color:var(--mat-sidenav-container-divider-color);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side{border-left-color:var(--mat-sidenav-container-divider-color);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side.mat-drawer-end{border-right-color:var(--mat-sidenav-container-divider-color);border-right-width:1px;border-right-style:solid;border-left:none}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}']
    }]
  }], () => [{
    type: Directionality,
    decorators: [{
      type: Optional
    }]
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }, {
    type: ChangeDetectorRef
  }, {
    type: ViewportRuler
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [MAT_DRAWER_DEFAULT_AUTOSIZE]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [ANIMATION_MODULE_TYPE]
    }]
  }], {
    _allDrawers: [{
      type: ContentChildren,
      args: [MatDrawer, {
        // We need to use `descendants: true`, because Ivy will no longer match
        // indirect descendants if it's left as false.
        descendants: true
      }]
    }],
    _content: [{
      type: ContentChild,
      args: [MatDrawerContent]
    }],
    _userContent: [{
      type: ViewChild,
      args: [MatDrawerContent]
    }],
    autosize: [{
      type: Input
    }],
    hasBackdrop: [{
      type: Input
    }],
    backdropClick: [{
      type: Output
    }]
  });
})();
var MatSidenavContent = class _MatSidenavContent extends MatDrawerContent {
  constructor(changeDetectorRef, container, elementRef, scrollDispatcher, ngZone) {
    super(changeDetectorRef, container, elementRef, scrollDispatcher, ngZone);
  }
  static {
    this.\u0275fac = function MatSidenavContent_Factory(t) {
      return new (t || _MatSidenavContent)(\u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(forwardRef(() => MatSidenavContainer)), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(ScrollDispatcher), \u0275\u0275directiveInject(NgZone));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MatSidenavContent,
      selectors: [["mat-sidenav-content"]],
      hostAttrs: [1, "mat-drawer-content", "mat-sidenav-content"],
      hostVars: 4,
      hostBindings: function MatSidenavContent_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275styleProp("margin-left", ctx._container._contentMargins.left, "px")("margin-right", ctx._container._contentMargins.right, "px");
        }
      },
      standalone: true,
      features: [\u0275\u0275ProvidersFeature([{
        provide: CdkScrollable,
        useExisting: _MatSidenavContent
      }]), \u0275\u0275InheritDefinitionFeature, \u0275\u0275StandaloneFeature],
      ngContentSelectors: _c02,
      decls: 1,
      vars: 0,
      template: function MatSidenavContent_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275projection(0);
        }
      },
      encapsulation: 2,
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSidenavContent, [{
    type: Component,
    args: [{
      selector: "mat-sidenav-content",
      template: "<ng-content></ng-content>",
      host: {
        "class": "mat-drawer-content mat-sidenav-content",
        "[style.margin-left.px]": "_container._contentMargins.left",
        "[style.margin-right.px]": "_container._contentMargins.right"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation$1.None,
      providers: [{
        provide: CdkScrollable,
        useExisting: MatSidenavContent
      }],
      standalone: true
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: MatSidenavContainer,
    decorators: [{
      type: Inject,
      args: [forwardRef(() => MatSidenavContainer)]
    }]
  }, {
    type: ElementRef
  }, {
    type: ScrollDispatcher
  }, {
    type: NgZone
  }], null);
})();
var MatSidenav = class _MatSidenav extends MatDrawer {
  constructor() {
    super(...arguments);
    this._fixedInViewport = false;
    this._fixedTopGap = 0;
    this._fixedBottomGap = 0;
  }
  /** Whether the sidenav is fixed in the viewport. */
  get fixedInViewport() {
    return this._fixedInViewport;
  }
  set fixedInViewport(value) {
    this._fixedInViewport = coerceBooleanProperty(value);
  }
  /**
   * The gap between the top of the sidenav and the top of the viewport when the sidenav is in fixed
   * mode.
   */
  get fixedTopGap() {
    return this._fixedTopGap;
  }
  set fixedTopGap(value) {
    this._fixedTopGap = coerceNumberProperty(value);
  }
  /**
   * The gap between the bottom of the sidenav and the bottom of the viewport when the sidenav is in
   * fixed mode.
   */
  get fixedBottomGap() {
    return this._fixedBottomGap;
  }
  set fixedBottomGap(value) {
    this._fixedBottomGap = coerceNumberProperty(value);
  }
  static {
    this.\u0275fac = /* @__PURE__ */ (() => {
      let \u0275MatSidenav_BaseFactory;
      return function MatSidenav_Factory(t) {
        return (\u0275MatSidenav_BaseFactory || (\u0275MatSidenav_BaseFactory = \u0275\u0275getInheritedFactory(_MatSidenav)))(t || _MatSidenav);
      };
    })();
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MatSidenav,
      selectors: [["mat-sidenav"]],
      hostAttrs: ["tabIndex", "-1", 1, "mat-drawer", "mat-sidenav"],
      hostVars: 17,
      hostBindings: function MatSidenav_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275attribute("align", null);
          \u0275\u0275styleProp("top", ctx.fixedInViewport ? ctx.fixedTopGap : null, "px")("bottom", ctx.fixedInViewport ? ctx.fixedBottomGap : null, "px");
          \u0275\u0275classProp("mat-drawer-end", ctx.position === "end")("mat-drawer-over", ctx.mode === "over")("mat-drawer-push", ctx.mode === "push")("mat-drawer-side", ctx.mode === "side")("mat-drawer-opened", ctx.opened)("mat-sidenav-fixed", ctx.fixedInViewport);
        }
      },
      inputs: {
        fixedInViewport: "fixedInViewport",
        fixedTopGap: "fixedTopGap",
        fixedBottomGap: "fixedBottomGap"
      },
      exportAs: ["matSidenav"],
      standalone: true,
      features: [\u0275\u0275InheritDefinitionFeature, \u0275\u0275StandaloneFeature],
      ngContentSelectors: _c02,
      decls: 3,
      vars: 0,
      consts: [["content", ""], ["cdkScrollable", "", 1, "mat-drawer-inner-container"]],
      template: function MatSidenav_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275elementStart(0, "div", 1, 0);
          \u0275\u0275projection(2);
          \u0275\u0275elementEnd();
        }
      },
      dependencies: [CdkScrollable],
      encapsulation: 2,
      data: {
        animation: [matDrawerAnimations.transformDrawer]
      },
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSidenav, [{
    type: Component,
    args: [{
      selector: "mat-sidenav",
      exportAs: "matSidenav",
      animations: [matDrawerAnimations.transformDrawer],
      host: {
        "class": "mat-drawer mat-sidenav",
        "tabIndex": "-1",
        // must prevent the browser from aligning text based on value
        "[attr.align]": "null",
        "[class.mat-drawer-end]": 'position === "end"',
        "[class.mat-drawer-over]": 'mode === "over"',
        "[class.mat-drawer-push]": 'mode === "push"',
        "[class.mat-drawer-side]": 'mode === "side"',
        "[class.mat-drawer-opened]": "opened",
        "[class.mat-sidenav-fixed]": "fixedInViewport",
        "[style.top.px]": "fixedInViewport ? fixedTopGap : null",
        "[style.bottom.px]": "fixedInViewport ? fixedBottomGap : null"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation$1.None,
      standalone: true,
      imports: [CdkScrollable],
      template: '<div class="mat-drawer-inner-container" cdkScrollable #content>\r\n  <ng-content></ng-content>\r\n</div>\r\n'
    }]
  }], null, {
    fixedInViewport: [{
      type: Input
    }],
    fixedTopGap: [{
      type: Input
    }],
    fixedBottomGap: [{
      type: Input
    }]
  });
})();
var MatSidenavContainer = class _MatSidenavContainer extends MatDrawerContainer {
  constructor() {
    super(...arguments);
    this._allDrawers = void 0;
    this._content = void 0;
  }
  static {
    this.\u0275fac = /* @__PURE__ */ (() => {
      let \u0275MatSidenavContainer_BaseFactory;
      return function MatSidenavContainer_Factory(t) {
        return (\u0275MatSidenavContainer_BaseFactory || (\u0275MatSidenavContainer_BaseFactory = \u0275\u0275getInheritedFactory(_MatSidenavContainer)))(t || _MatSidenavContainer);
      };
    })();
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MatSidenavContainer,
      selectors: [["mat-sidenav-container"]],
      contentQueries: function MatSidenavContainer_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuery(dirIndex, MatSidenavContent, 5);
          \u0275\u0275contentQuery(dirIndex, MatSidenav, 5);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._content = _t.first);
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._allDrawers = _t);
        }
      },
      hostAttrs: [1, "mat-drawer-container", "mat-sidenav-container"],
      hostVars: 2,
      hostBindings: function MatSidenavContainer_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275classProp("mat-drawer-container-explicit-backdrop", ctx._backdropOverride);
        }
      },
      exportAs: ["matSidenavContainer"],
      standalone: true,
      features: [\u0275\u0275ProvidersFeature([{
        provide: MAT_DRAWER_CONTAINER,
        useExisting: _MatSidenavContainer
      }]), \u0275\u0275InheritDefinitionFeature, \u0275\u0275StandaloneFeature],
      ngContentSelectors: _c5,
      decls: 4,
      vars: 2,
      consts: [[1, "mat-drawer-backdrop", 3, "mat-drawer-shown"], [1, "mat-drawer-backdrop", 3, "click"]],
      template: function MatSidenavContainer_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef(_c4);
          \u0275\u0275template(0, MatSidenavContainer_Conditional_0_Template, 1, 2, "div", 0);
          \u0275\u0275projection(1);
          \u0275\u0275projection(2, 1);
          \u0275\u0275template(3, MatSidenavContainer_Conditional_3_Template, 2, 0, "mat-sidenav-content");
        }
        if (rf & 2) {
          \u0275\u0275conditional(0, ctx.hasBackdrop ? 0 : -1);
          \u0275\u0275advance(3);
          \u0275\u0275conditional(3, !ctx._content ? 3 : -1);
        }
      },
      dependencies: [MatSidenavContent],
      styles: [_c6],
      encapsulation: 2,
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSidenavContainer, [{
    type: Component,
    args: [{
      selector: "mat-sidenav-container",
      exportAs: "matSidenavContainer",
      host: {
        "class": "mat-drawer-container mat-sidenav-container",
        "[class.mat-drawer-container-explicit-backdrop]": "_backdropOverride"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation$1.None,
      providers: [{
        provide: MAT_DRAWER_CONTAINER,
        useExisting: MatSidenavContainer
      }],
      standalone: true,
      imports: [MatSidenavContent],
      template: '@if (hasBackdrop) {\n  <div class="mat-drawer-backdrop" (click)="_onBackdropClicked()"\n       [class.mat-drawer-shown]="_isShowingBackdrop()"></div>\n}\n\n<ng-content select="mat-sidenav"></ng-content>\n\n<ng-content select="mat-sidenav-content">\n</ng-content>\n\n@if (!_content) {\n  <mat-sidenav-content>\n    <ng-content></ng-content>\n  </mat-sidenav-content>\n}\n',
      styles: ['.mat-drawer-container{position:relative;z-index:1;color:var(--mat-sidenav-content-text-color);background-color:var(--mat-sidenav-content-background-color);box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible;background-color:var(--mat-sidenav-scrim-color)}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}.cdk-high-contrast-active .mat-drawer-backdrop{opacity:.5}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;color:var(--mat-sidenav-container-text-color);box-shadow:var(--mat-sidenav-container-elevation-shadow);background-color:var(--mat-sidenav-container-background-color);border-top-right-radius:var(--mat-sidenav-container-shape);border-bottom-right-radius:var(--mat-sidenav-container-shape);width:var(--mat-sidenav-container-width);display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}.cdk-high-contrast-active .mat-drawer,.cdk-high-contrast-active [dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}.cdk-high-contrast-active [dir=rtl] .mat-drawer,.cdk-high-contrast-active .mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0);border-top-left-radius:var(--mat-sidenav-container-shape);border-bottom-left-radius:var(--mat-sidenav-container-shape);border-top-right-radius:0;border-bottom-right-radius:0}[dir=rtl] .mat-drawer{border-top-left-radius:var(--mat-sidenav-container-shape);border-bottom-left-radius:var(--mat-sidenav-container-shape);border-top-right-radius:0;border-bottom-right-radius:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{border-top-right-radius:var(--mat-sidenav-container-shape);border-bottom-right-radius:var(--mat-sidenav-container-shape);border-top-left-radius:0;border-bottom-left-radius:0;left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer[style*="visibility: hidden"]{display:none}.mat-drawer-side{box-shadow:none;border-right-color:var(--mat-sidenav-container-divider-color);border-right-width:1px;border-right-style:solid}.mat-drawer-side.mat-drawer-end{border-left-color:var(--mat-sidenav-container-divider-color);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side{border-left-color:var(--mat-sidenav-container-divider-color);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side.mat-drawer-end{border-right-color:var(--mat-sidenav-container-divider-color);border-right-width:1px;border-right-style:solid;border-left:none}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}']
    }]
  }], null, {
    _allDrawers: [{
      type: ContentChildren,
      args: [MatSidenav, {
        // We need to use `descendants: true`, because Ivy will no longer match
        // indirect descendants if it's left as false.
        descendants: true
      }]
    }],
    _content: [{
      type: ContentChild,
      args: [MatSidenavContent]
    }]
  });
})();
var MatSidenavModule = class _MatSidenavModule {
  static {
    this.\u0275fac = function MatSidenavModule_Factory(t) {
      return new (t || _MatSidenavModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _MatSidenavModule
    });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
      imports: [MatCommonModule, CdkScrollableModule, CdkScrollableModule, MatCommonModule]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSidenavModule, [{
    type: NgModule,
    args: [{
      imports: [MatCommonModule, CdkScrollableModule, MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav, MatSidenavContainer, MatSidenavContent],
      exports: [CdkScrollableModule, MatCommonModule, MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav, MatSidenavContainer, MatSidenavContent]
    }]
  }], null, null);
})();

// node_modules/@angular/material/fesm2022/menu.mjs
var _c03 = ["mat-menu-item", ""];
var _c13 = [[["mat-icon"], ["", "matMenuItemIcon", ""]], "*"];
var _c22 = ["mat-icon, [matMenuItemIcon]", "*"];
function MatMenuItem_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 2);
    \u0275\u0275element(1, "polygon", 3);
    \u0275\u0275elementEnd();
  }
}
var _c32 = ["*"];
function MatMenu_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275listener("keydown", function MatMenu_ng_template_0_Template_div_keydown_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1._handleKeydown($event));
    })("click", function MatMenu_ng_template_0_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closed.emit("click"));
    })("@transformMenu.start", function MatMenu_ng_template_0_Template_div_animation_transformMenu_start_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1._onAnimationStart($event));
    })("@transformMenu.done", function MatMenu_ng_template_0_Template_div_animation_transformMenu_done_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1._onAnimationDone($event));
    });
    \u0275\u0275elementStart(1, "div", 1);
    \u0275\u0275projection(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r1._classList);
    \u0275\u0275property("id", ctx_r1.panelId)("@transformMenu", ctx_r1._panelAnimationState);
    \u0275\u0275attribute("aria-label", ctx_r1.ariaLabel || null)("aria-labelledby", ctx_r1.ariaLabelledby || null)("aria-describedby", ctx_r1.ariaDescribedby || null);
  }
}
var MAT_MENU_PANEL = new InjectionToken("MAT_MENU_PANEL");
var MatMenuItem = class _MatMenuItem {
  constructor(_elementRef, _document, _focusMonitor, _parentMenu, _changeDetectorRef) {
    this._elementRef = _elementRef;
    this._document = _document;
    this._focusMonitor = _focusMonitor;
    this._parentMenu = _parentMenu;
    this._changeDetectorRef = _changeDetectorRef;
    this.role = "menuitem";
    this.disabled = false;
    this.disableRipple = false;
    this._hovered = new Subject();
    this._focused = new Subject();
    this._highlighted = false;
    this._triggersSubmenu = false;
    _parentMenu?.addItem?.(this);
  }
  /** Focuses the menu item. */
  focus(origin, options) {
    if (this._focusMonitor && origin) {
      this._focusMonitor.focusVia(this._getHostElement(), origin, options);
    } else {
      this._getHostElement().focus(options);
    }
    this._focused.next(this);
  }
  ngAfterViewInit() {
    if (this._focusMonitor) {
      this._focusMonitor.monitor(this._elementRef, false);
    }
  }
  ngOnDestroy() {
    if (this._focusMonitor) {
      this._focusMonitor.stopMonitoring(this._elementRef);
    }
    if (this._parentMenu && this._parentMenu.removeItem) {
      this._parentMenu.removeItem(this);
    }
    this._hovered.complete();
    this._focused.complete();
  }
  /** Used to set the `tabindex`. */
  _getTabIndex() {
    return this.disabled ? "-1" : "0";
  }
  /** Returns the host DOM element. */
  _getHostElement() {
    return this._elementRef.nativeElement;
  }
  /** Prevents the default element actions if it is disabled. */
  _checkDisabled(event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  /** Emits to the hover stream. */
  _handleMouseEnter() {
    this._hovered.next(this);
  }
  /** Gets the label to be used when determining whether the option should be focused. */
  getLabel() {
    const clone = this._elementRef.nativeElement.cloneNode(true);
    const icons = clone.querySelectorAll("mat-icon, .material-icons");
    for (let i = 0; i < icons.length; i++) {
      icons[i].remove();
    }
    return clone.textContent?.trim() || "";
  }
  _setHighlighted(isHighlighted) {
    this._highlighted = isHighlighted;
    this._changeDetectorRef?.markForCheck();
  }
  _setTriggersSubmenu(triggersSubmenu) {
    this._triggersSubmenu = triggersSubmenu;
    this._changeDetectorRef?.markForCheck();
  }
  _hasFocus() {
    return this._document && this._document.activeElement === this._getHostElement();
  }
  static {
    this.\u0275fac = function MatMenuItem_Factory(t) {
      return new (t || _MatMenuItem)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(DOCUMENT), \u0275\u0275directiveInject(FocusMonitor), \u0275\u0275directiveInject(MAT_MENU_PANEL, 8), \u0275\u0275directiveInject(ChangeDetectorRef));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MatMenuItem,
      selectors: [["", "mat-menu-item", ""]],
      hostAttrs: [1, "mat-mdc-menu-item", "mat-mdc-focus-indicator"],
      hostVars: 8,
      hostBindings: function MatMenuItem_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("click", function MatMenuItem_click_HostBindingHandler($event) {
            return ctx._checkDisabled($event);
          })("mouseenter", function MatMenuItem_mouseenter_HostBindingHandler() {
            return ctx._handleMouseEnter();
          });
        }
        if (rf & 2) {
          \u0275\u0275attribute("role", ctx.role)("tabindex", ctx._getTabIndex())("aria-disabled", ctx.disabled)("disabled", ctx.disabled || null);
          \u0275\u0275classProp("mat-mdc-menu-item-highlighted", ctx._highlighted)("mat-mdc-menu-item-submenu-trigger", ctx._triggersSubmenu);
        }
      },
      inputs: {
        role: "role",
        disabled: [InputFlags.HasDecoratorInputTransform, "disabled", "disabled", booleanAttribute],
        disableRipple: [InputFlags.HasDecoratorInputTransform, "disableRipple", "disableRipple", booleanAttribute]
      },
      exportAs: ["matMenuItem"],
      standalone: true,
      features: [\u0275\u0275InputTransformsFeature, \u0275\u0275StandaloneFeature],
      attrs: _c03,
      ngContentSelectors: _c22,
      decls: 5,
      vars: 3,
      consts: [[1, "mat-mdc-menu-item-text"], ["matRipple", "", 1, "mat-mdc-menu-ripple", 3, "matRippleDisabled", "matRippleTrigger"], ["viewBox", "0 0 5 10", "focusable", "false", "aria-hidden", "true", 1, "mat-mdc-menu-submenu-icon"], ["points", "0,0 5,5 0,10"]],
      template: function MatMenuItem_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef(_c13);
          \u0275\u0275projection(0);
          \u0275\u0275elementStart(1, "span", 0);
          \u0275\u0275projection(2, 1);
          \u0275\u0275elementEnd();
          \u0275\u0275element(3, "div", 1);
          \u0275\u0275template(4, MatMenuItem_Conditional_4_Template, 2, 0, ":svg:svg", 2);
        }
        if (rf & 2) {
          \u0275\u0275advance(3);
          \u0275\u0275property("matRippleDisabled", ctx.disableRipple || ctx.disabled)("matRippleTrigger", ctx._getHostElement());
          \u0275\u0275advance();
          \u0275\u0275conditional(4, ctx._triggersSubmenu ? 4 : -1);
        }
      },
      dependencies: [MatRipple],
      encapsulation: 2,
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatMenuItem, [{
    type: Component,
    args: [{
      selector: "[mat-menu-item]",
      exportAs: "matMenuItem",
      host: {
        "[attr.role]": "role",
        "class": "mat-mdc-menu-item mat-mdc-focus-indicator",
        "[class.mat-mdc-menu-item-highlighted]": "_highlighted",
        "[class.mat-mdc-menu-item-submenu-trigger]": "_triggersSubmenu",
        "[attr.tabindex]": "_getTabIndex()",
        "[attr.aria-disabled]": "disabled",
        "[attr.disabled]": "disabled || null",
        "(click)": "_checkDisabled($event)",
        "(mouseenter)": "_handleMouseEnter()"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation$1.None,
      standalone: true,
      imports: [MatRipple],
      template: '<ng-content select="mat-icon, [matMenuItemIcon]"></ng-content>\n<span class="mat-mdc-menu-item-text"><ng-content></ng-content></span>\n<div class="mat-mdc-menu-ripple" matRipple\n     [matRippleDisabled]="disableRipple || disabled"\n     [matRippleTrigger]="_getHostElement()">\n</div>\n\n@if (_triggersSubmenu) {\n     <svg\n       class="mat-mdc-menu-submenu-icon"\n       viewBox="0 0 5 10"\n       focusable="false"\n       aria-hidden="true"><polygon points="0,0 5,5 0,10"/></svg>\n}\n'
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: FocusMonitor
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [MAT_MENU_PANEL]
    }, {
      type: Optional
    }]
  }, {
    type: ChangeDetectorRef
  }], {
    role: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disableRipple: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
function throwMatMenuInvalidPositionX() {
  throw Error(`xPosition value must be either 'before' or after'.
      Example: <mat-menu xPosition="before" #menu="matMenu"></mat-menu>`);
}
function throwMatMenuInvalidPositionY() {
  throw Error(`yPosition value must be either 'above' or below'.
      Example: <mat-menu yPosition="above" #menu="matMenu"></mat-menu>`);
}
function throwMatMenuRecursiveError() {
  throw Error(`matMenuTriggerFor: menu cannot contain its own trigger. Assign a menu that is not a parent of the trigger or move the trigger outside of the menu.`);
}
var MAT_MENU_CONTENT = new InjectionToken("MatMenuContent");
var MatMenuContent = class _MatMenuContent {
  constructor(_template, _componentFactoryResolver, _appRef, _injector, _viewContainerRef, _document, _changeDetectorRef) {
    this._template = _template;
    this._componentFactoryResolver = _componentFactoryResolver;
    this._appRef = _appRef;
    this._injector = _injector;
    this._viewContainerRef = _viewContainerRef;
    this._document = _document;
    this._changeDetectorRef = _changeDetectorRef;
    this._attached = new Subject();
  }
  /**
   * Attaches the content with a particular context.
   * @docs-private
   */
  attach(context = {}) {
    if (!this._portal) {
      this._portal = new TemplatePortal(this._template, this._viewContainerRef);
    }
    this.detach();
    if (!this._outlet) {
      this._outlet = new DomPortalOutlet(this._document.createElement("div"), this._componentFactoryResolver, this._appRef, this._injector);
    }
    const element = this._template.elementRef.nativeElement;
    element.parentNode.insertBefore(this._outlet.outletElement, element);
    this._changeDetectorRef?.markForCheck();
    this._portal.attach(this._outlet, context);
    this._attached.next();
  }
  /**
   * Detaches the content.
   * @docs-private
   */
  detach() {
    if (this._portal.isAttached) {
      this._portal.detach();
    }
  }
  ngOnDestroy() {
    if (this._outlet) {
      this._outlet.dispose();
    }
  }
  static {
    this.\u0275fac = function MatMenuContent_Factory(t) {
      return new (t || _MatMenuContent)(\u0275\u0275directiveInject(TemplateRef), \u0275\u0275directiveInject(ComponentFactoryResolver$1), \u0275\u0275directiveInject(ApplicationRef), \u0275\u0275directiveInject(Injector), \u0275\u0275directiveInject(ViewContainerRef), \u0275\u0275directiveInject(DOCUMENT), \u0275\u0275directiveInject(ChangeDetectorRef));
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _MatMenuContent,
      selectors: [["ng-template", "matMenuContent", ""]],
      standalone: true,
      features: [\u0275\u0275ProvidersFeature([{
        provide: MAT_MENU_CONTENT,
        useExisting: _MatMenuContent
      }])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatMenuContent, [{
    type: Directive,
    args: [{
      selector: "ng-template[matMenuContent]",
      providers: [{
        provide: MAT_MENU_CONTENT,
        useExisting: MatMenuContent
      }],
      standalone: true
    }]
  }], () => [{
    type: TemplateRef
  }, {
    type: ComponentFactoryResolver$1
  }, {
    type: ApplicationRef
  }, {
    type: Injector
  }, {
    type: ViewContainerRef
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: ChangeDetectorRef
  }], null);
})();
var matMenuAnimations = {
  /**
   * This animation controls the menu panel's entry and exit from the page.
   *
   * When the menu panel is added to the DOM, it scales in and fades in its border.
   *
   * When the menu panel is removed from the DOM, it simply fades out after a brief
   * delay to display the ripple.
   */
  transformMenu: trigger("transformMenu", [state("void", style({
    opacity: 0,
    transform: "scale(0.8)"
  })), transition("void => enter", animate("120ms cubic-bezier(0, 0, 0.2, 1)", style({
    opacity: 1,
    transform: "scale(1)"
  }))), transition("* => void", animate("100ms 25ms linear", style({
    opacity: 0
  })))]),
  /**
   * This animation fades in the background color and content of the menu panel
   * after its containing element is scaled in.
   */
  fadeInItems: trigger("fadeInItems", [
    // TODO(crisbeto): this is inside the `transformMenu`
    // now. Remove next time we do breaking changes.
    state("showing", style({
      opacity: 1
    })),
    transition("void => *", [style({
      opacity: 0
    }), animate("400ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)")])
  ])
};
var fadeInItems = matMenuAnimations.fadeInItems;
var transformMenu = matMenuAnimations.transformMenu;
var menuPanelUid = 0;
var MAT_MENU_DEFAULT_OPTIONS = new InjectionToken("mat-menu-default-options", {
  providedIn: "root",
  factory: MAT_MENU_DEFAULT_OPTIONS_FACTORY
});
function MAT_MENU_DEFAULT_OPTIONS_FACTORY() {
  return {
    overlapTrigger: false,
    xPosition: "after",
    yPosition: "below",
    backdropClass: "cdk-overlay-transparent-backdrop"
  };
}
var MatMenu = class _MatMenu {
  /** Position of the menu in the X axis. */
  get xPosition() {
    return this._xPosition;
  }
  set xPosition(value) {
    if (value !== "before" && value !== "after" && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throwMatMenuInvalidPositionX();
    }
    this._xPosition = value;
    this.setPositionClasses();
  }
  /** Position of the menu in the Y axis. */
  get yPosition() {
    return this._yPosition;
  }
  set yPosition(value) {
    if (value !== "above" && value !== "below" && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throwMatMenuInvalidPositionY();
    }
    this._yPosition = value;
    this.setPositionClasses();
  }
  /**
   * This method takes classes set on the host mat-menu element and applies them on the
   * menu template that displays in the overlay container.  Otherwise, it's difficult
   * to style the containing menu from outside the component.
   * @param classes list of class names
   */
  set panelClass(classes) {
    const previousPanelClass = this._previousPanelClass;
    const newClassList = __spreadValues({}, this._classList);
    if (previousPanelClass && previousPanelClass.length) {
      previousPanelClass.split(" ").forEach((className) => {
        newClassList[className] = false;
      });
    }
    this._previousPanelClass = classes;
    if (classes && classes.length) {
      classes.split(" ").forEach((className) => {
        newClassList[className] = true;
      });
      this._elementRef.nativeElement.className = "";
    }
    this._classList = newClassList;
  }
  /**
   * This method takes classes set on the host mat-menu element and applies them on the
   * menu template that displays in the overlay container.  Otherwise, it's difficult
   * to style the containing menu from outside the component.
   * @deprecated Use `panelClass` instead.
   * @breaking-change 8.0.0
   */
  get classList() {
    return this.panelClass;
  }
  set classList(classes) {
    this.panelClass = classes;
  }
  constructor(_elementRef, _ngZone, defaultOptions, _changeDetectorRef) {
    this._elementRef = _elementRef;
    this._ngZone = _ngZone;
    this._changeDetectorRef = _changeDetectorRef;
    this._elevationPrefix = "mat-elevation-z";
    this._baseElevation = 8;
    this._directDescendantItems = new QueryList();
    this._classList = {};
    this._panelAnimationState = "void";
    this._animationDone = new Subject();
    this.closed = new EventEmitter();
    this.close = this.closed;
    this.panelId = `mat-menu-panel-${menuPanelUid++}`;
    this.overlayPanelClass = defaultOptions.overlayPanelClass || "";
    this._xPosition = defaultOptions.xPosition;
    this._yPosition = defaultOptions.yPosition;
    this.backdropClass = defaultOptions.backdropClass;
    this.overlapTrigger = defaultOptions.overlapTrigger;
    this.hasBackdrop = defaultOptions.hasBackdrop;
  }
  ngOnInit() {
    this.setPositionClasses();
  }
  ngAfterContentInit() {
    this._updateDirectDescendants();
    this._keyManager = new FocusKeyManager(this._directDescendantItems).withWrap().withTypeAhead().withHomeAndEnd();
    this._keyManager.tabOut.subscribe(() => this.closed.emit("tab"));
    this._directDescendantItems.changes.pipe(startWith(this._directDescendantItems), switchMap((items) => merge(...items.map((item) => item._focused)))).subscribe((focusedItem) => this._keyManager.updateActiveItem(focusedItem));
    this._directDescendantItems.changes.subscribe((itemsList) => {
      const manager = this._keyManager;
      if (this._panelAnimationState === "enter" && manager.activeItem?._hasFocus()) {
        const items = itemsList.toArray();
        const index = Math.max(0, Math.min(items.length - 1, manager.activeItemIndex || 0));
        if (items[index] && !items[index].disabled) {
          manager.setActiveItem(index);
        } else {
          manager.setNextItemActive();
        }
      }
    });
  }
  ngOnDestroy() {
    this._keyManager?.destroy();
    this._directDescendantItems.destroy();
    this.closed.complete();
    this._firstItemFocusSubscription?.unsubscribe();
  }
  /** Stream that emits whenever the hovered menu item changes. */
  _hovered() {
    const itemChanges = this._directDescendantItems.changes;
    return itemChanges.pipe(startWith(this._directDescendantItems), switchMap((items) => merge(...items.map((item) => item._hovered))));
  }
  /*
   * Registers a menu item with the menu.
   * @docs-private
   * @deprecated No longer being used. To be removed.
   * @breaking-change 9.0.0
   */
  addItem(_item) {
  }
  /**
   * Removes an item from the menu.
   * @docs-private
   * @deprecated No longer being used. To be removed.
   * @breaking-change 9.0.0
   */
  removeItem(_item) {
  }
  /** Handle a keyboard event from the menu, delegating to the appropriate action. */
  _handleKeydown(event) {
    const keyCode = event.keyCode;
    const manager = this._keyManager;
    switch (keyCode) {
      case ESCAPE:
        if (!hasModifierKey(event)) {
          event.preventDefault();
          this.closed.emit("keydown");
        }
        break;
      case LEFT_ARROW:
        if (this.parentMenu && this.direction === "ltr") {
          this.closed.emit("keydown");
        }
        break;
      case RIGHT_ARROW:
        if (this.parentMenu && this.direction === "rtl") {
          this.closed.emit("keydown");
        }
        break;
      default:
        if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
          manager.setFocusOrigin("keyboard");
        }
        manager.onKeydown(event);
        return;
    }
    event.stopPropagation();
  }
  /**
   * Focus the first item in the menu.
   * @param origin Action from which the focus originated. Used to set the correct styling.
   */
  focusFirstItem(origin = "program") {
    this._firstItemFocusSubscription?.unsubscribe();
    this._firstItemFocusSubscription = this._ngZone.onStable.pipe(take(1)).subscribe(() => {
      let menuPanel = null;
      if (this._directDescendantItems.length) {
        menuPanel = this._directDescendantItems.first._getHostElement().closest('[role="menu"]');
      }
      if (!menuPanel || !menuPanel.contains(document.activeElement)) {
        const manager = this._keyManager;
        manager.setFocusOrigin(origin).setFirstItemActive();
        if (!manager.activeItem && menuPanel) {
          menuPanel.focus();
        }
      }
    });
  }
  /**
   * Resets the active item in the menu. This is used when the menu is opened, allowing
   * the user to start from the first option when pressing the down arrow.
   */
  resetActiveItem() {
    this._keyManager.setActiveItem(-1);
  }
  /**
   * Sets the menu panel elevation.
   * @param depth Number of parent menus that come before the menu.
   */
  setElevation(depth) {
    const elevation = Math.min(this._baseElevation + depth, 24);
    const newElevation = `${this._elevationPrefix}${elevation}`;
    const customElevation = Object.keys(this._classList).find((className) => {
      return className.startsWith(this._elevationPrefix);
    });
    if (!customElevation || customElevation === this._previousElevation) {
      const newClassList = __spreadValues({}, this._classList);
      if (this._previousElevation) {
        newClassList[this._previousElevation] = false;
      }
      newClassList[newElevation] = true;
      this._previousElevation = newElevation;
      this._classList = newClassList;
    }
  }
  /**
   * Adds classes to the menu panel based on its position. Can be used by
   * consumers to add specific styling based on the position.
   * @param posX Position of the menu along the x axis.
   * @param posY Position of the menu along the y axis.
   * @docs-private
   */
  setPositionClasses(posX = this.xPosition, posY = this.yPosition) {
    this._classList = __spreadProps(__spreadValues({}, this._classList), {
      ["mat-menu-before"]: posX === "before",
      ["mat-menu-after"]: posX === "after",
      ["mat-menu-above"]: posY === "above",
      ["mat-menu-below"]: posY === "below"
    });
    this._changeDetectorRef?.markForCheck();
  }
  /** Starts the enter animation. */
  _startAnimation() {
    this._panelAnimationState = "enter";
  }
  /** Resets the panel animation to its initial state. */
  _resetAnimation() {
    this._panelAnimationState = "void";
  }
  /** Callback that is invoked when the panel animation completes. */
  _onAnimationDone(event) {
    this._animationDone.next(event);
    this._isAnimating = false;
  }
  _onAnimationStart(event) {
    this._isAnimating = true;
    if (event.toState === "enter" && this._keyManager.activeItemIndex === 0) {
      event.element.scrollTop = 0;
    }
  }
  /**
   * Sets up a stream that will keep track of any newly-added menu items and will update the list
   * of direct descendants. We collect the descendants this way, because `_allItems` can include
   * items that are part of child menus, and using a custom way of registering items is unreliable
   * when it comes to maintaining the item order.
   */
  _updateDirectDescendants() {
    this._allItems.changes.pipe(startWith(this._allItems)).subscribe((items) => {
      this._directDescendantItems.reset(items.filter((item) => item._parentMenu === this));
      this._directDescendantItems.notifyOnChanges();
    });
  }
  static {
    this.\u0275fac = function MatMenu_Factory(t) {
      return new (t || _MatMenu)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(NgZone), \u0275\u0275directiveInject(MAT_MENU_DEFAULT_OPTIONS), \u0275\u0275directiveInject(ChangeDetectorRef));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MatMenu,
      selectors: [["mat-menu"]],
      contentQueries: function MatMenu_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuery(dirIndex, MAT_MENU_CONTENT, 5);
          \u0275\u0275contentQuery(dirIndex, MatMenuItem, 5);
          \u0275\u0275contentQuery(dirIndex, MatMenuItem, 4);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.lazyContent = _t.first);
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._allItems = _t);
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.items = _t);
        }
      },
      viewQuery: function MatMenu_Query(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275viewQuery(TemplateRef, 5);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.templateRef = _t.first);
        }
      },
      hostVars: 3,
      hostBindings: function MatMenu_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275attribute("aria-label", null)("aria-labelledby", null)("aria-describedby", null);
        }
      },
      inputs: {
        backdropClass: "backdropClass",
        ariaLabel: [InputFlags.None, "aria-label", "ariaLabel"],
        ariaLabelledby: [InputFlags.None, "aria-labelledby", "ariaLabelledby"],
        ariaDescribedby: [InputFlags.None, "aria-describedby", "ariaDescribedby"],
        xPosition: "xPosition",
        yPosition: "yPosition",
        overlapTrigger: [InputFlags.HasDecoratorInputTransform, "overlapTrigger", "overlapTrigger", booleanAttribute],
        hasBackdrop: [InputFlags.HasDecoratorInputTransform, "hasBackdrop", "hasBackdrop", (value) => value == null ? null : booleanAttribute(value)],
        panelClass: [InputFlags.None, "class", "panelClass"],
        classList: "classList"
      },
      outputs: {
        closed: "closed",
        close: "close"
      },
      exportAs: ["matMenu"],
      standalone: true,
      features: [\u0275\u0275ProvidersFeature([{
        provide: MAT_MENU_PANEL,
        useExisting: _MatMenu
      }]), \u0275\u0275InputTransformsFeature, \u0275\u0275StandaloneFeature],
      ngContentSelectors: _c32,
      decls: 1,
      vars: 0,
      consts: [["tabindex", "-1", "role", "menu", 1, "mat-mdc-menu-panel", "mat-mdc-elevation-specific", 3, "keydown", "click", "id"], [1, "mat-mdc-menu-content"]],
      template: function MatMenu_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275template(0, MatMenu_ng_template_0_Template, 3, 7, "ng-template");
        }
      },
      styles: ['mat-menu{display:none}.mat-mdc-menu-content{margin:0;padding:8px 0;list-style-type:none}.mat-mdc-menu-content:focus{outline:none}.mat-mdc-menu-content,.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;flex:1;white-space:normal;font-family:var(--mat-menu-item-label-text-font);line-height:var(--mat-menu-item-label-text-line-height);font-size:var(--mat-menu-item-label-text-size);letter-spacing:var(--mat-menu-item-label-text-tracking);font-weight:var(--mat-menu-item-label-text-weight)}.mat-mdc-menu-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;box-sizing:border-box;outline:0;border-radius:var(--mat-menu-container-shape);background-color:var(--mat-menu-container-color);will-change:transform,opacity}.mat-mdc-menu-panel.ng-animating{pointer-events:none}.cdk-high-contrast-active .mat-mdc-menu-panel{outline:solid 1px}.mat-divider{color:var(--mat-menu-divider-color);margin-bottom:var(--mat-menu-divider-bottom-spacing);margin-top:var(--mat-menu-divider-top-spacing)}.mat-mdc-menu-item{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:var(--mat-menu-item-leading-spacing);padding-right:var(--mat-menu-item-trailing-spacing);-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer;width:100%;text-align:left;box-sizing:border-box;color:inherit;font-size:inherit;background:none;text-decoration:none;margin:0;align-items:center;min-height:48px}.mat-mdc-menu-item:focus{outline:none}[dir=rtl] .mat-mdc-menu-item,.mat-mdc-menu-item[dir=rtl]{padding-left:var(--mat-menu-item-trailing-spacing);padding-right:var(--mat-menu-item-leading-spacing)}.mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]){padding-left:var(--mat-menu-item-with-icon-leading-spacing);padding-right:var(--mat-menu-item-with-icon-trailing-spacing)}[dir=rtl] .mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]),.mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon])[dir=rtl]{padding-left:var(--mat-menu-item-with-icon-trailing-spacing);padding-right:var(--mat-menu-item-with-icon-leading-spacing)}.mat-mdc-menu-item::-moz-focus-inner{border:0}.mat-mdc-menu-item,.mat-mdc-menu-item:visited,.mat-mdc-menu-item:link{color:var(--mat-menu-item-label-text-color)}.mat-mdc-menu-item .mat-icon-no-color,.mat-mdc-menu-item .mat-mdc-menu-submenu-icon{color:var(--mat-menu-item-icon-color)}.mat-mdc-menu-item[disabled]{cursor:default;opacity:.38}.mat-mdc-menu-item[disabled]::after{display:block;position:absolute;content:"";top:0;left:0;bottom:0;right:0}.mat-mdc-menu-item .mat-icon{flex-shrink:0;margin-right:var(--mat-menu-item-spacing);height:var(--mat-menu-item-icon-size);width:var(--mat-menu-item-icon-size)}[dir=rtl] .mat-mdc-menu-item{text-align:right}[dir=rtl] .mat-mdc-menu-item .mat-icon{margin-right:0;margin-left:var(--mat-menu-item-spacing)}.mat-mdc-menu-item:not([disabled]):hover{background-color:var(--mat-menu-item-hover-state-layer-color)}.mat-mdc-menu-item:not([disabled]).cdk-program-focused,.mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused,.mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted{background-color:var(--mat-menu-item-focus-state-layer-color)}.cdk-high-contrast-active .mat-mdc-menu-item{margin-top:1px}.mat-mdc-menu-submenu-icon{width:var(--mat-menu-item-icon-size);height:10px;fill:currentColor;padding-left:var(--mat-menu-item-spacing)}[dir=rtl] .mat-mdc-menu-submenu-icon{padding-right:var(--mat-menu-item-spacing);padding-left:0}[dir=rtl] .mat-mdc-menu-submenu-icon polygon{transform:scaleX(-1)}.cdk-high-contrast-active .mat-mdc-menu-submenu-icon{fill:CanvasText}.mat-mdc-menu-item .mat-mdc-menu-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}'],
      encapsulation: 2,
      data: {
        animation: [matMenuAnimations.transformMenu, matMenuAnimations.fadeInItems]
      },
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatMenu, [{
    type: Component,
    args: [{
      selector: "mat-menu",
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation$1.None,
      exportAs: "matMenu",
      host: {
        "[attr.aria-label]": "null",
        "[attr.aria-labelledby]": "null",
        "[attr.aria-describedby]": "null"
      },
      animations: [matMenuAnimations.transformMenu, matMenuAnimations.fadeInItems],
      providers: [{
        provide: MAT_MENU_PANEL,
        useExisting: MatMenu
      }],
      standalone: true,
      template: `<ng-template>
  <div
    class="mat-mdc-menu-panel mat-mdc-elevation-specific"
    [id]="panelId"
    [class]="_classList"
    (keydown)="_handleKeydown($event)"
    (click)="closed.emit('click')"
    [@transformMenu]="_panelAnimationState"
    (@transformMenu.start)="_onAnimationStart($event)"
    (@transformMenu.done)="_onAnimationDone($event)"
    tabindex="-1"
    role="menu"
    [attr.aria-label]="ariaLabel || null"
    [attr.aria-labelledby]="ariaLabelledby || null"
    [attr.aria-describedby]="ariaDescribedby || null">
    <div class="mat-mdc-menu-content">
      <ng-content></ng-content>
    </div>
  </div>
</ng-template>
`,
      styles: ['mat-menu{display:none}.mat-mdc-menu-content{margin:0;padding:8px 0;list-style-type:none}.mat-mdc-menu-content:focus{outline:none}.mat-mdc-menu-content,.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;flex:1;white-space:normal;font-family:var(--mat-menu-item-label-text-font);line-height:var(--mat-menu-item-label-text-line-height);font-size:var(--mat-menu-item-label-text-size);letter-spacing:var(--mat-menu-item-label-text-tracking);font-weight:var(--mat-menu-item-label-text-weight)}.mat-mdc-menu-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;box-sizing:border-box;outline:0;border-radius:var(--mat-menu-container-shape);background-color:var(--mat-menu-container-color);will-change:transform,opacity}.mat-mdc-menu-panel.ng-animating{pointer-events:none}.cdk-high-contrast-active .mat-mdc-menu-panel{outline:solid 1px}.mat-divider{color:var(--mat-menu-divider-color);margin-bottom:var(--mat-menu-divider-bottom-spacing);margin-top:var(--mat-menu-divider-top-spacing)}.mat-mdc-menu-item{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:var(--mat-menu-item-leading-spacing);padding-right:var(--mat-menu-item-trailing-spacing);-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer;width:100%;text-align:left;box-sizing:border-box;color:inherit;font-size:inherit;background:none;text-decoration:none;margin:0;align-items:center;min-height:48px}.mat-mdc-menu-item:focus{outline:none}[dir=rtl] .mat-mdc-menu-item,.mat-mdc-menu-item[dir=rtl]{padding-left:var(--mat-menu-item-trailing-spacing);padding-right:var(--mat-menu-item-leading-spacing)}.mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]){padding-left:var(--mat-menu-item-with-icon-leading-spacing);padding-right:var(--mat-menu-item-with-icon-trailing-spacing)}[dir=rtl] .mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]),.mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon])[dir=rtl]{padding-left:var(--mat-menu-item-with-icon-trailing-spacing);padding-right:var(--mat-menu-item-with-icon-leading-spacing)}.mat-mdc-menu-item::-moz-focus-inner{border:0}.mat-mdc-menu-item,.mat-mdc-menu-item:visited,.mat-mdc-menu-item:link{color:var(--mat-menu-item-label-text-color)}.mat-mdc-menu-item .mat-icon-no-color,.mat-mdc-menu-item .mat-mdc-menu-submenu-icon{color:var(--mat-menu-item-icon-color)}.mat-mdc-menu-item[disabled]{cursor:default;opacity:.38}.mat-mdc-menu-item[disabled]::after{display:block;position:absolute;content:"";top:0;left:0;bottom:0;right:0}.mat-mdc-menu-item .mat-icon{flex-shrink:0;margin-right:var(--mat-menu-item-spacing);height:var(--mat-menu-item-icon-size);width:var(--mat-menu-item-icon-size)}[dir=rtl] .mat-mdc-menu-item{text-align:right}[dir=rtl] .mat-mdc-menu-item .mat-icon{margin-right:0;margin-left:var(--mat-menu-item-spacing)}.mat-mdc-menu-item:not([disabled]):hover{background-color:var(--mat-menu-item-hover-state-layer-color)}.mat-mdc-menu-item:not([disabled]).cdk-program-focused,.mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused,.mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted{background-color:var(--mat-menu-item-focus-state-layer-color)}.cdk-high-contrast-active .mat-mdc-menu-item{margin-top:1px}.mat-mdc-menu-submenu-icon{width:var(--mat-menu-item-icon-size);height:10px;fill:currentColor;padding-left:var(--mat-menu-item-spacing)}[dir=rtl] .mat-mdc-menu-submenu-icon{padding-right:var(--mat-menu-item-spacing);padding-left:0}[dir=rtl] .mat-mdc-menu-submenu-icon polygon{transform:scaleX(-1)}.cdk-high-contrast-active .mat-mdc-menu-submenu-icon{fill:CanvasText}.mat-mdc-menu-item .mat-mdc-menu-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}']
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: NgZone
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [MAT_MENU_DEFAULT_OPTIONS]
    }]
  }, {
    type: ChangeDetectorRef
  }], {
    _allItems: [{
      type: ContentChildren,
      args: [MatMenuItem, {
        descendants: true
      }]
    }],
    backdropClass: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input,
      args: ["aria-label"]
    }],
    ariaLabelledby: [{
      type: Input,
      args: ["aria-labelledby"]
    }],
    ariaDescribedby: [{
      type: Input,
      args: ["aria-describedby"]
    }],
    xPosition: [{
      type: Input
    }],
    yPosition: [{
      type: Input
    }],
    templateRef: [{
      type: ViewChild,
      args: [TemplateRef]
    }],
    items: [{
      type: ContentChildren,
      args: [MatMenuItem, {
        descendants: false
      }]
    }],
    lazyContent: [{
      type: ContentChild,
      args: [MAT_MENU_CONTENT]
    }],
    overlapTrigger: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    hasBackdrop: [{
      type: Input,
      args: [{
        transform: (value) => value == null ? null : booleanAttribute(value)
      }]
    }],
    panelClass: [{
      type: Input,
      args: ["class"]
    }],
    classList: [{
      type: Input
    }],
    closed: [{
      type: Output
    }],
    close: [{
      type: Output
    }]
  });
})();
var MAT_MENU_SCROLL_STRATEGY = new InjectionToken("mat-menu-scroll-strategy", {
  providedIn: "root",
  factory: () => {
    const overlay = inject(Overlay);
    return () => overlay.scrollStrategies.reposition();
  }
});
function MAT_MENU_SCROLL_STRATEGY_FACTORY(overlay) {
  return () => overlay.scrollStrategies.reposition();
}
var MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: MAT_MENU_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: MAT_MENU_SCROLL_STRATEGY_FACTORY
};
var passiveEventListenerOptions = normalizePassiveListenerOptions({
  passive: true
});
var MatMenuTrigger = class _MatMenuTrigger {
  /**
   * @deprecated
   * @breaking-change 8.0.0
   */
  get _deprecatedMatMenuTriggerFor() {
    return this.menu;
  }
  set _deprecatedMatMenuTriggerFor(v) {
    this.menu = v;
  }
  /** References the menu instance that the trigger is associated with. */
  get menu() {
    return this._menu;
  }
  set menu(menu) {
    if (menu === this._menu) {
      return;
    }
    this._menu = menu;
    this._menuCloseSubscription.unsubscribe();
    if (menu) {
      if (menu === this._parentMaterialMenu && (typeof ngDevMode === "undefined" || ngDevMode)) {
        throwMatMenuRecursiveError();
      }
      this._menuCloseSubscription = menu.close.subscribe((reason) => {
        this._destroyMenu(reason);
        if ((reason === "click" || reason === "tab") && this._parentMaterialMenu) {
          this._parentMaterialMenu.closed.emit(reason);
        }
      });
    }
    this._menuItemInstance?._setTriggersSubmenu(this.triggersSubmenu());
  }
  constructor(_overlay, _element, _viewContainerRef, scrollStrategy, parentMenu, _menuItemInstance, _dir, _focusMonitor, _ngZone) {
    this._overlay = _overlay;
    this._element = _element;
    this._viewContainerRef = _viewContainerRef;
    this._menuItemInstance = _menuItemInstance;
    this._dir = _dir;
    this._focusMonitor = _focusMonitor;
    this._ngZone = _ngZone;
    this._overlayRef = null;
    this._menuOpen = false;
    this._closingActionsSubscription = Subscription.EMPTY;
    this._hoverSubscription = Subscription.EMPTY;
    this._menuCloseSubscription = Subscription.EMPTY;
    this._changeDetectorRef = inject(ChangeDetectorRef);
    this._handleTouchStart = (event) => {
      if (!isFakeTouchstartFromScreenReader(event)) {
        this._openedBy = "touch";
      }
    };
    this._openedBy = void 0;
    this.restoreFocus = true;
    this.menuOpened = new EventEmitter();
    this.onMenuOpen = this.menuOpened;
    this.menuClosed = new EventEmitter();
    this.onMenuClose = this.menuClosed;
    this._scrollStrategy = scrollStrategy;
    this._parentMaterialMenu = parentMenu instanceof MatMenu ? parentMenu : void 0;
    _element.nativeElement.addEventListener("touchstart", this._handleTouchStart, passiveEventListenerOptions);
  }
  ngAfterContentInit() {
    this._handleHover();
  }
  ngOnDestroy() {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
    this._element.nativeElement.removeEventListener("touchstart", this._handleTouchStart, passiveEventListenerOptions);
    this._menuCloseSubscription.unsubscribe();
    this._closingActionsSubscription.unsubscribe();
    this._hoverSubscription.unsubscribe();
  }
  /** Whether the menu is open. */
  get menuOpen() {
    return this._menuOpen;
  }
  /** The text direction of the containing app. */
  get dir() {
    return this._dir && this._dir.value === "rtl" ? "rtl" : "ltr";
  }
  /** Whether the menu triggers a sub-menu or a top-level one. */
  triggersSubmenu() {
    return !!(this._menuItemInstance && this._parentMaterialMenu && this.menu);
  }
  /** Toggles the menu between the open and closed states. */
  toggleMenu() {
    return this._menuOpen ? this.closeMenu() : this.openMenu();
  }
  /** Opens the menu. */
  openMenu() {
    const menu = this.menu;
    if (this._menuOpen || !menu) {
      return;
    }
    const overlayRef = this._createOverlay(menu);
    const overlayConfig = overlayRef.getConfig();
    const positionStrategy = overlayConfig.positionStrategy;
    this._setPosition(menu, positionStrategy);
    overlayConfig.hasBackdrop = menu.hasBackdrop == null ? !this.triggersSubmenu() : menu.hasBackdrop;
    overlayRef.attach(this._getPortal(menu));
    if (menu.lazyContent) {
      menu.lazyContent.attach(this.menuData);
    }
    this._closingActionsSubscription = this._menuClosingActions().subscribe(() => this.closeMenu());
    this._initMenu(menu);
    if (menu instanceof MatMenu) {
      menu._startAnimation();
      menu._directDescendantItems.changes.pipe(takeUntil(menu.close)).subscribe(() => {
        positionStrategy.withLockedPosition(false).reapplyLastPosition();
        positionStrategy.withLockedPosition(true);
      });
    }
  }
  /** Closes the menu. */
  closeMenu() {
    this.menu?.close.emit();
  }
  /**
   * Focuses the menu trigger.
   * @param origin Source of the menu trigger's focus.
   */
  focus(origin, options) {
    if (this._focusMonitor && origin) {
      this._focusMonitor.focusVia(this._element, origin, options);
    } else {
      this._element.nativeElement.focus(options);
    }
  }
  /**
   * Updates the position of the menu to ensure that it fits all options within the viewport.
   */
  updatePosition() {
    this._overlayRef?.updatePosition();
  }
  /** Closes the menu and does the necessary cleanup. */
  _destroyMenu(reason) {
    if (!this._overlayRef || !this.menuOpen) {
      return;
    }
    const menu = this.menu;
    this._closingActionsSubscription.unsubscribe();
    this._overlayRef.detach();
    if (this.restoreFocus && (reason === "keydown" || !this._openedBy || !this.triggersSubmenu())) {
      this.focus(this._openedBy);
    }
    this._openedBy = void 0;
    if (menu instanceof MatMenu) {
      menu._resetAnimation();
      if (menu.lazyContent) {
        menu._animationDone.pipe(
          filter((event) => event.toState === "void"),
          take(1),
          // Interrupt if the content got re-attached.
          takeUntil(menu.lazyContent._attached)
        ).subscribe({
          next: () => menu.lazyContent.detach(),
          // No matter whether the content got re-attached, reset the menu.
          complete: () => this._setIsMenuOpen(false)
        });
      } else {
        this._setIsMenuOpen(false);
      }
    } else {
      this._setIsMenuOpen(false);
      menu?.lazyContent?.detach();
    }
  }
  /**
   * This method sets the menu state to open and focuses the first item if
   * the menu was opened via the keyboard.
   */
  _initMenu(menu) {
    menu.parentMenu = this.triggersSubmenu() ? this._parentMaterialMenu : void 0;
    menu.direction = this.dir;
    this._setMenuElevation(menu);
    menu.focusFirstItem(this._openedBy || "program");
    this._setIsMenuOpen(true);
  }
  /** Updates the menu elevation based on the amount of parent menus that it has. */
  _setMenuElevation(menu) {
    if (menu.setElevation) {
      let depth = 0;
      let parentMenu = menu.parentMenu;
      while (parentMenu) {
        depth++;
        parentMenu = parentMenu.parentMenu;
      }
      menu.setElevation(depth);
    }
  }
  // set state rather than toggle to support triggers sharing a menu
  _setIsMenuOpen(isOpen) {
    if (isOpen !== this._menuOpen) {
      this._menuOpen = isOpen;
      this._menuOpen ? this.menuOpened.emit() : this.menuClosed.emit();
      if (this.triggersSubmenu()) {
        this._menuItemInstance._setHighlighted(isOpen);
      }
      this._changeDetectorRef.markForCheck();
    }
  }
  /**
   * This method creates the overlay from the provided menu's template and saves its
   * OverlayRef so that it can be attached to the DOM when openMenu is called.
   */
  _createOverlay(menu) {
    if (!this._overlayRef) {
      const config = this._getOverlayConfig(menu);
      this._subscribeToPositions(menu, config.positionStrategy);
      this._overlayRef = this._overlay.create(config);
      this._overlayRef.keydownEvents().subscribe();
    }
    return this._overlayRef;
  }
  /**
   * This method builds the configuration object needed to create the overlay, the OverlayState.
   * @returns OverlayConfig
   */
  _getOverlayConfig(menu) {
    return new OverlayConfig({
      positionStrategy: this._overlay.position().flexibleConnectedTo(this._element).withLockedPosition().withGrowAfterOpen().withTransformOriginOn(".mat-menu-panel, .mat-mdc-menu-panel"),
      backdropClass: menu.backdropClass || "cdk-overlay-transparent-backdrop",
      panelClass: menu.overlayPanelClass,
      scrollStrategy: this._scrollStrategy(),
      direction: this._dir
    });
  }
  /**
   * Listens to changes in the position of the overlay and sets the correct classes
   * on the menu based on the new position. This ensures the animation origin is always
   * correct, even if a fallback position is used for the overlay.
   */
  _subscribeToPositions(menu, position) {
    if (menu.setPositionClasses) {
      position.positionChanges.subscribe((change) => {
        const posX = change.connectionPair.overlayX === "start" ? "after" : "before";
        const posY = change.connectionPair.overlayY === "top" ? "below" : "above";
        if (this._ngZone) {
          this._ngZone.run(() => menu.setPositionClasses(posX, posY));
        } else {
          menu.setPositionClasses(posX, posY);
        }
      });
    }
  }
  /**
   * Sets the appropriate positions on a position strategy
   * so the overlay connects with the trigger correctly.
   * @param positionStrategy Strategy whose position to update.
   */
  _setPosition(menu, positionStrategy) {
    let [originX, originFallbackX] = menu.xPosition === "before" ? ["end", "start"] : ["start", "end"];
    let [overlayY, overlayFallbackY] = menu.yPosition === "above" ? ["bottom", "top"] : ["top", "bottom"];
    let [originY, originFallbackY] = [overlayY, overlayFallbackY];
    let [overlayX, overlayFallbackX] = [originX, originFallbackX];
    let offsetY = 0;
    if (this.triggersSubmenu()) {
      overlayFallbackX = originX = menu.xPosition === "before" ? "start" : "end";
      originFallbackX = overlayX = originX === "end" ? "start" : "end";
      if (this._parentMaterialMenu) {
        if (this._parentInnerPadding == null) {
          const firstItem = this._parentMaterialMenu.items.first;
          this._parentInnerPadding = firstItem ? firstItem._getHostElement().offsetTop : 0;
        }
        offsetY = overlayY === "bottom" ? this._parentInnerPadding : -this._parentInnerPadding;
      }
    } else if (!menu.overlapTrigger) {
      originY = overlayY === "top" ? "bottom" : "top";
      originFallbackY = overlayFallbackY === "top" ? "bottom" : "top";
    }
    positionStrategy.withPositions([{
      originX,
      originY,
      overlayX,
      overlayY,
      offsetY
    }, {
      originX: originFallbackX,
      originY,
      overlayX: overlayFallbackX,
      overlayY,
      offsetY
    }, {
      originX,
      originY: originFallbackY,
      overlayX,
      overlayY: overlayFallbackY,
      offsetY: -offsetY
    }, {
      originX: originFallbackX,
      originY: originFallbackY,
      overlayX: overlayFallbackX,
      overlayY: overlayFallbackY,
      offsetY: -offsetY
    }]);
  }
  /** Returns a stream that emits whenever an action that should close the menu occurs. */
  _menuClosingActions() {
    const backdrop = this._overlayRef.backdropClick();
    const detachments = this._overlayRef.detachments();
    const parentClose = this._parentMaterialMenu ? this._parentMaterialMenu.closed : of();
    const hover = this._parentMaterialMenu ? this._parentMaterialMenu._hovered().pipe(filter((active) => active !== this._menuItemInstance), filter(() => this._menuOpen)) : of();
    return merge(backdrop, parentClose, hover, detachments);
  }
  /** Handles mouse presses on the trigger. */
  _handleMousedown(event) {
    if (!isFakeMousedownFromScreenReader(event)) {
      this._openedBy = event.button === 0 ? "mouse" : void 0;
      if (this.triggersSubmenu()) {
        event.preventDefault();
      }
    }
  }
  /** Handles key presses on the trigger. */
  _handleKeydown(event) {
    const keyCode = event.keyCode;
    if (keyCode === ENTER || keyCode === SPACE) {
      this._openedBy = "keyboard";
    }
    if (this.triggersSubmenu() && (keyCode === RIGHT_ARROW && this.dir === "ltr" || keyCode === LEFT_ARROW && this.dir === "rtl")) {
      this._openedBy = "keyboard";
      this.openMenu();
    }
  }
  /** Handles click events on the trigger. */
  _handleClick(event) {
    if (this.triggersSubmenu()) {
      event.stopPropagation();
      this.openMenu();
    } else {
      this.toggleMenu();
    }
  }
  /** Handles the cases where the user hovers over the trigger. */
  _handleHover() {
    if (!this.triggersSubmenu() || !this._parentMaterialMenu) {
      return;
    }
    this._hoverSubscription = this._parentMaterialMenu._hovered().pipe(filter((active) => active === this._menuItemInstance && !active.disabled), delay(0, asapScheduler)).subscribe(() => {
      this._openedBy = "mouse";
      if (this.menu instanceof MatMenu && this.menu._isAnimating) {
        this.menu._animationDone.pipe(take(1), delay(0, asapScheduler), takeUntil(this._parentMaterialMenu._hovered())).subscribe(() => this.openMenu());
      } else {
        this.openMenu();
      }
    });
  }
  /** Gets the portal that should be attached to the overlay. */
  _getPortal(menu) {
    if (!this._portal || this._portal.templateRef !== menu.templateRef) {
      this._portal = new TemplatePortal(menu.templateRef, this._viewContainerRef);
    }
    return this._portal;
  }
  static {
    this.\u0275fac = function MatMenuTrigger_Factory(t) {
      return new (t || _MatMenuTrigger)(\u0275\u0275directiveInject(Overlay), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(ViewContainerRef), \u0275\u0275directiveInject(MAT_MENU_SCROLL_STRATEGY), \u0275\u0275directiveInject(MAT_MENU_PANEL, 8), \u0275\u0275directiveInject(MatMenuItem, 10), \u0275\u0275directiveInject(Directionality, 8), \u0275\u0275directiveInject(FocusMonitor), \u0275\u0275directiveInject(NgZone));
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _MatMenuTrigger,
      selectors: [["", "mat-menu-trigger-for", ""], ["", "matMenuTriggerFor", ""]],
      hostAttrs: [1, "mat-mdc-menu-trigger"],
      hostVars: 3,
      hostBindings: function MatMenuTrigger_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("click", function MatMenuTrigger_click_HostBindingHandler($event) {
            return ctx._handleClick($event);
          })("mousedown", function MatMenuTrigger_mousedown_HostBindingHandler($event) {
            return ctx._handleMousedown($event);
          })("keydown", function MatMenuTrigger_keydown_HostBindingHandler($event) {
            return ctx._handleKeydown($event);
          });
        }
        if (rf & 2) {
          \u0275\u0275attribute("aria-haspopup", ctx.menu ? "menu" : null)("aria-expanded", ctx.menuOpen)("aria-controls", ctx.menuOpen ? ctx.menu.panelId : null);
        }
      },
      inputs: {
        _deprecatedMatMenuTriggerFor: [InputFlags.None, "mat-menu-trigger-for", "_deprecatedMatMenuTriggerFor"],
        menu: [InputFlags.None, "matMenuTriggerFor", "menu"],
        menuData: [InputFlags.None, "matMenuTriggerData", "menuData"],
        restoreFocus: [InputFlags.None, "matMenuTriggerRestoreFocus", "restoreFocus"]
      },
      outputs: {
        menuOpened: "menuOpened",
        onMenuOpen: "onMenuOpen",
        menuClosed: "menuClosed",
        onMenuClose: "onMenuClose"
      },
      exportAs: ["matMenuTrigger"],
      standalone: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatMenuTrigger, [{
    type: Directive,
    args: [{
      selector: `[mat-menu-trigger-for], [matMenuTriggerFor]`,
      host: {
        "class": "mat-mdc-menu-trigger",
        "[attr.aria-haspopup]": 'menu ? "menu" : null',
        "[attr.aria-expanded]": "menuOpen",
        "[attr.aria-controls]": "menuOpen ? menu.panelId : null",
        "(click)": "_handleClick($event)",
        "(mousedown)": "_handleMousedown($event)",
        "(keydown)": "_handleKeydown($event)"
      },
      exportAs: "matMenuTrigger",
      standalone: true
    }]
  }], () => [{
    type: Overlay
  }, {
    type: ElementRef
  }, {
    type: ViewContainerRef
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [MAT_MENU_SCROLL_STRATEGY]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [MAT_MENU_PANEL]
    }, {
      type: Optional
    }]
  }, {
    type: MatMenuItem,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }]
  }, {
    type: Directionality,
    decorators: [{
      type: Optional
    }]
  }, {
    type: FocusMonitor
  }, {
    type: NgZone
  }], {
    _deprecatedMatMenuTriggerFor: [{
      type: Input,
      args: ["mat-menu-trigger-for"]
    }],
    menu: [{
      type: Input,
      args: ["matMenuTriggerFor"]
    }],
    menuData: [{
      type: Input,
      args: ["matMenuTriggerData"]
    }],
    restoreFocus: [{
      type: Input,
      args: ["matMenuTriggerRestoreFocus"]
    }],
    menuOpened: [{
      type: Output
    }],
    onMenuOpen: [{
      type: Output
    }],
    menuClosed: [{
      type: Output
    }],
    onMenuClose: [{
      type: Output
    }]
  });
})();
var MatMenuModule = class _MatMenuModule {
  static {
    this.\u0275fac = function MatMenuModule_Factory(t) {
      return new (t || _MatMenuModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _MatMenuModule
    });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
      providers: [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER],
      imports: [CommonModule, MatRippleModule, MatCommonModule, OverlayModule, CdkScrollableModule, MatCommonModule]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatMenuModule, [{
    type: NgModule,
    args: [{
      imports: [CommonModule, MatRippleModule, MatCommonModule, OverlayModule, MatMenu, MatMenuItem, MatMenuContent, MatMenuTrigger],
      exports: [CdkScrollableModule, MatMenu, MatCommonModule, MatMenuItem, MatMenuContent, MatMenuTrigger],
      providers: [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER]
    }]
  }], null, null);
})();

// src/app/layout/shell/shell.component.ts
var _forTrack0 = ($index, $item) => $item.route;
function ShellComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 50);
    \u0275\u0275listener("click", function ShellComponent_Conditional_1_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.toggleSidenav());
    });
    \u0275\u0275elementEnd();
  }
}
function ShellComponent_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 11);
    \u0275\u0275element(1, "div", 51);
    \u0275\u0275elementStart(2, "mat-icon", 52);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 53);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("routerLink", item_r4.route)("matTooltip", !ctx_r2.sidenavOpen() ? item_r4.label : "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r4.icon);
    \u0275\u0275advance();
    \u0275\u0275classProp("opacity-0", !ctx_r2.sidenavOpen())("translate-x-4", !ctx_r2.sidenavOpen());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r4.label, " ");
  }
}
function ShellComponent_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 33);
  }
}
function ShellComponent_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 37);
    \u0275\u0275text(1, "No hay notificaciones nuevas");
    \u0275\u0275elementEnd();
  }
}
function ShellComponent_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 54)(1, "mat-icon", 55);
    \u0275\u0275text(2, "warning");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Tienes ", ctx_r2.notifCount, " visitas rechazadas");
  }
}
var ShellComponent = class _ShellComponent {
  constructor(auth, api, router, realtime) {
    this.auth = auth;
    this.api = api;
    this.router = router;
    this.realtime = realtime;
    this.sidenavOpen = signal(window.innerWidth > 1024);
    this.isMobile = signal(window.innerWidth <= 1024);
    this.isDark = signal(false);
    this.notifCount = 0;
    this.user = computed(() => this.auth.currentUser());
    this.hasClientDashboard = signal(false);
    this.navItems = [
      { label: "Dashboard", icon: "dashboard", route: "/dashboard", roles: [] },
      { label: "Centro de Mando", icon: "bolt", route: "/centro-mando", roles: ["admin", "superadmin", "analyst"] },
      { label: "Rutas", icon: "route", route: "/routes", roles: ["admin", "analyst"], module: "rutas" },
      { label: "Puntos de Venta", icon: "store", route: "/points", roles: ["admin", "supervisor", "atc"] },
      { label: "Usuarios", icon: "people", route: "/users", roles: ["admin"], module: "users" },
      { label: "Permisos", icon: "admin_panel_settings", route: "/permissions", roles: ["admin"] },
      { label: "Productos", icon: "inventory_2", route: "/products", roles: ["admin", "atc"] },
      { label: "Categor\xEDas Cliente", icon: "category", route: "/client-categories", roles: ["admin"] },
      { label: "Clientes \xB7 Rutas", icon: "alt_route", route: "/clientes-rutas", roles: ["admin", "analyst"] },
      { label: "Mis Rutas", icon: "route", route: "/mercaderista", roles: ["mercaderista"] },
      { label: "Auditor\xEDa de Campo", icon: "fact_check", route: "/auditor-campo", roles: ["auditor_campo", "admin"] },
      { label: "Chat", icon: "chat", route: "/chat", roles: [], module: "chat" },
      { label: "Supervisor", icon: "supervisor_account", route: "/supervisor", roles: ["admin", "supervisor"] },
      { label: "Solicitudes", icon: "support_agent", route: "/atencion-cliente", roles: ["admin", "atc"] },
      { label: "Auditor\xEDa Logs", icon: "fact_check", route: "/audit", roles: ["admin"] },
      { label: "Mis Fotos", icon: "photo_library", route: "/client", roles: ["coordinador_exclusivo"] },
      { label: "Mis Visitas", icon: "today", route: "/client/visits", roles: ["client", "coordinador_exclusivo"] },
      { label: "Data", icon: "table_chart", route: "/data", roles: ["admin", "analyst", "client", "coordinador_exclusivo"] },
      { label: "Encuestador", icon: "assignment", route: "/encuestador", roles: ["encuestador", "admin"] },
      { label: "BI Encuestas", icon: "pie_chart", route: "/cliente-encuestador", roles: ["cliente_encuestador", "admin"] }
    ];
    this.visibleNavItems = computed(() => {
      const u = this.user();
      if (!u)
        return [];
      return this.navItems.filter((item) => {
        const clave = AuthService.claveFromRoute(item.route);
        return this.auth.canAccess(clave, item.roles);
      });
    });
    this.loadNotifications();
  }
  ngOnInit() {
    this.realtime.connect();
    this.initTheme();
    this.checkClientDashboard();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.isMobile()) {
        this.sidenavOpen.set(false);
      }
    });
  }
  checkClientDashboard() {
    const u = this.user();
    if (u && (u.is_client || u.rol === "coordinador_exclusivo")) {
      this.api.getClientDashboard().subscribe({
        next: (res) => this.hasClientDashboard.set(res.has_dashboard),
        error: () => this.hasClientDashboard.set(false)
      });
    }
  }
  onResize() {
    const mobile = window.innerWidth <= 1024;
    this.isMobile.set(mobile);
    if (mobile && this.sidenavOpen()) {
      this.sidenavOpen.set(false);
    } else if (!mobile && !this.sidenavOpen()) {
      this.sidenavOpen.set(true);
    }
  }
  toggleSidenav() {
    this.sidenavOpen.update((v) => !v);
  }
  toggleTheme() {
    this.isDark.update((v) => {
      const newVal = !v;
      localStorage.setItem("theme", newVal ? "dark" : "light");
      this.applyTheme(newVal);
      return newVal;
    });
  }
  initTheme() {
    const savedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === "dark" || !savedTheme && systemDark;
    this.isDark.set(isDark);
    this.applyTheme(isDark);
  }
  applyTheme(dark) {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
  logout() {
    this.auth.logout();
  }
  loadNotifications() {
    this.api.getRejectionNotifications().subscribe({
      next: (notifs) => {
        this.notifCount = notifs.length;
      },
      error: () => {
      }
    });
  }
  static {
    this.\u0275fac = function ShellComponent_Factory(t) {
      return new (t || _ShellComponent)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(RealtimeService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ShellComponent, selectors: [["app-shell"]], hostBindings: function ShellComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("resize", function ShellComponent_resize_HostBindingHandler($event) {
          return ctx.onResize($event);
        }, false, \u0275\u0275resolveWindow);
      }
    }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 82, vars: 27, consts: [["notifMenu", "matMenu"], ["userMenu", "matMenu"], [1, "min-h-screen", "flex", "bg-slate-50", "dark:bg-slate-950", "transition-colors", "duration-500"], [1, "fixed", "inset-0", "bg-slate-950/60", "backdrop-blur-sm", "z-40", "lg:hidden", "animate-in", "fade-in", "duration-300"], [1, "bg-gradient-to-b", "from-slate-900", "via-slate-900", "to-slate-950", "text-slate-300", "transition-all", "duration-500", "ease-in-out", "flex", "flex-col", "z-50", "fixed", "h-screen", "lg:sticky", "lg:top-0", "border-r", "border-white/5", "lg:translate-x-0", "overflow-hidden"], [1, "h-20", "flex", "items-center", "px-6", "gap-4", "border-b", "border-white/5", "shrink-0", "overflow-hidden"], [1, "w-11", "h-11", "bg-gradient-to-tr", "from-primary-600", "to-primary-400", "rounded-xl", "flex", "items-center", "justify-center", "shadow-lg", "shadow-primary-500/20", "shrink-0"], [1, "text-white"], [1, "text-2xl", "font-black", "tracking-tighter", "text-white", "transition-all", "duration-500", "whitespace-nowrap"], [1, "text-primary-400", "italic"], [1, "flex-1", "overflow-y-auto", "overflow-x-hidden", "py-8", "px-3", "space-y-2", "custom-scrollbar"], ["routerLinkActive", "bg-white/5 text-white !border-primary-500/30 shadow-inner", "matTooltipPosition", "right", 1, "flex", "items-center", "gap-4", "px-4", "py-3.5", "rounded-2xl", "border", "border-transparent", "transition-all", "duration-300", "hover:bg-white/5", "hover:text-white", "group", "relative", "overflow-hidden", "h-[52px]", 3, "routerLink", "matTooltip"], [1, "p-3", "border-t", "border-white/5", "bg-slate-950/30", "shrink-0"], [1, "flex", "items-center", "gap-3", "p-3", "bg-white/5", "rounded-2xl", "border", "border-white/5", "hover:bg-white/10", "transition-colors", "cursor-pointer", "group", "overflow-hidden"], [1, "w-10", "h-10", "rounded-xl", "bg-gradient-to-br", "from-slate-700", "to-slate-800", "flex", "items-center", "justify-center", "border", "border-white/10", "shadow-lg", "group-hover:border-primary-500/50", "transition-colors", "shrink-0"], [1, "text-slate-400", "group-hover:text-primary-400"], [1, "flex", "flex-col", "min-w-0", "transition-all", "duration-500"], [1, "text-sm", "font-bold", "text-white", "truncate", "tracking-tight"], [1, "text-[10px]", "font-black", "text-slate-500", "uppercase", "tracking-widest"], [1, "flex-1", "flex", "flex-col", "min-w-0", "h-screen", "overflow-hidden"], [1, "h-20", "bg-white/80", "dark:bg-slate-900/80", "backdrop-blur-md", "border-b", "border-slate-200", "dark:border-white/5", "px-6", "flex", "items-center", "justify-between", "sticky", "top-0", "z-40", "shrink-0"], [1, "flex", "items-center", "gap-3", "md:gap-4"], [1, "w-10", "h-10", "flex", "items-center", "justify-center", "rounded-xl", "hover:bg-slate-100", "dark:hover:bg-slate-800", "text-slate-500", "dark:text-slate-400", "transition-colors", "bg-slate-50", "dark:bg-slate-800/50", 3, "click"], [1, "flex", "flex-col"], [1, "text-sm", "md:text-lg", "font-bold", "text-slate-800", "dark:text-white", "leading-none"], [1, "text-[10px]", "font-black", "text-primary-500", "uppercase", "tracking-widest", "md:hidden"], [1, "flex", "items-center", "gap-2", "md:gap-3"], [1, "w-10", "h-10", "flex", "items-center", "justify-center", "rounded-xl", "hover:bg-slate-100", "dark:hover:bg-slate-800", "text-slate-500", "transition-colors", 3, "click", "matTooltip"], [1, "hidden", "lg:flex", "items-center", "bg-slate-100", "dark:bg-slate-800", "rounded-xl", "px-3", "py-1.5", "border", "border-slate-200", "dark:border-slate-700", "focus-within:border-primary-500/50", "transition-all"], [1, "text-slate-400", "!text-lg"], ["type", "text", "placeholder", "Buscar...", 1, "bg-transparent", "border-none", "outline-none", "text-xs", "font-medium", "text-slate-600", "dark:text-slate-300", "px-2", "w-32", "focus:w-48", "transition-all"], [1, "relative", "w-10", "h-10", "flex", "items-center", "justify-center", "rounded-xl", "hover:bg-slate-100", "text-slate-500", "transition-colors", 3, "matMenuTriggerFor"], [1, "!text-xl"], [1, "absolute", "top-2.5", "right-2.5", "w-2", "h-2", "bg-rose-500", "rounded-full", "ring-2", "ring-white"], ["xPosition", "before", 1, "modern-menu"], [1, "px-4", "py-3", "border-b", "border-slate-100"], [1, "font-semibold", "text-slate-800"], ["mat-menu-item", "", "disabled", "", 1, "text-slate-400"], [1, "flex", "items-center", "gap-2", "pl-2", "pr-1", "py-1", "rounded-full", "hover:bg-slate-100", "transition-colors", "group", "border", "border-transparent", "hover:border-slate-200", 3, "matMenuTriggerFor"], [1, "w-8", "h-8", "rounded-full", "bg-slate-200", "flex", "items-center", "justify-center", "text-slate-600", "font-bold", "overflow-hidden", "border", "border-white"], [1, "text-slate-400", "group-hover:text-slate-600"], [1, "px-4", "py-3", "border-b", "border-slate-100", "flex", "flex-col", "min-w-[200px]"], [1, "text-xs", "text-slate-500"], ["mat-menu-item", "", "routerLink", "/profile"], ["mat-menu-item", "", "routerLink", "/settings"], [1, "my-1", "border-slate-100"], ["mat-menu-item", "", 1, "text-rose-600", 3, "click"], [1, "!text-rose-600"], [1, "flex-1", "overflow-y-auto", "p-4", "md:p-8", "custom-scrollbar", "bg-slate-50/50", "dark:bg-slate-950/20"], [1, "max-w-7xl", "mx-auto", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "fixed", "inset-0", "bg-slate-950/60", "backdrop-blur-sm", "z-40", "lg:hidden", "animate-in", "fade-in", "duration-300", 3, "click"], ["routerLinkActive", "opacity-100 scale-y-100", 1, "absolute", "left-0", "top-3", "bottom-3", "w-1", "bg-primary-500", "rounded-full", "opacity-0", "scale-y-0", "transition-all", "duration-300"], ["routerLinkActive", "!text-primary-400", 1, "shrink-0", "transition-transform", "group-hover:scale-110", "text-slate-400", "group-hover:text-primary-400"], [1, "font-bold", "text-sm", "tracking-tight", "whitespace-nowrap", "transition-all", "duration-500"], ["mat-menu-item", "", "routerLink", "/visits", 1, "py-3"], [1, "text-rose-500"]], template: function ShellComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275elementStart(0, "div", 2);
        \u0275\u0275template(1, ShellComponent_Conditional_1_Template, 1, 0, "div", 3);
        \u0275\u0275elementStart(2, "aside", 4)(3, "div", 5)(4, "div", 6)(5, "mat-icon", 7);
        \u0275\u0275text(6, "rocket_launch");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "span", 8);
        \u0275\u0275text(8, " Nexus");
        \u0275\u0275elementStart(9, "span", 9);
        \u0275\u0275text(10, "2DI");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(11, "nav", 10);
        \u0275\u0275repeaterCreate(12, ShellComponent_For_13_Template, 6, 8, "a", 11, _forTrack0);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "div", 12)(15, "div", 13)(16, "div", 14)(17, "mat-icon", 15);
        \u0275\u0275text(18, "person");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(19, "div", 16)(20, "span", 17);
        \u0275\u0275text(21);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(22, "span", 18);
        \u0275\u0275text(23);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(24, "div", 19)(25, "header", 20)(26, "div", 21)(27, "button", 22);
        \u0275\u0275listener("click", function ShellComponent_Template_button_click_27_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.toggleSidenav());
        });
        \u0275\u0275elementStart(28, "mat-icon");
        \u0275\u0275text(29);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(30, "div", 23)(31, "h2", 24);
        \u0275\u0275text(32, "Portal de Gesti\xF3n");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(33, "span", 25);
        \u0275\u0275text(34, "Nexus2DI");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(35, "div", 26)(36, "button", 27);
        \u0275\u0275listener("click", function ShellComponent_Template_button_click_36_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.toggleTheme());
        });
        \u0275\u0275elementStart(37, "mat-icon");
        \u0275\u0275text(38);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(39, "div", 28)(40, "mat-icon", 29);
        \u0275\u0275text(41, "search");
        \u0275\u0275elementEnd();
        \u0275\u0275element(42, "input", 30);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(43, "button", 31)(44, "mat-icon", 32);
        \u0275\u0275text(45, "notifications");
        \u0275\u0275elementEnd();
        \u0275\u0275template(46, ShellComponent_Conditional_46_Template, 1, 0, "span", 33);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(47, "mat-menu", 34, 0)(49, "div", 35)(50, "p", 36);
        \u0275\u0275text(51, "Notificaciones");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(52, ShellComponent_Conditional_52_Template, 2, 0, "button", 37)(53, ShellComponent_Conditional_53_Template, 5, 1);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(54, "button", 38)(55, "div", 39);
        \u0275\u0275text(56);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(57, "mat-icon", 40);
        \u0275\u0275text(58, "expand_more");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(59, "mat-menu", 34, 1)(61, "div", 41)(62, "span", 36);
        \u0275\u0275text(63);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(64, "span", 42);
        \u0275\u0275text(65);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(66, "button", 43)(67, "mat-icon");
        \u0275\u0275text(68, "person_outline");
        \u0275\u0275elementEnd();
        \u0275\u0275text(69, " Mi Perfil");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(70, "button", 44)(71, "mat-icon");
        \u0275\u0275text(72, "settings_outline");
        \u0275\u0275elementEnd();
        \u0275\u0275text(73, " Configuraci\xF3n");
        \u0275\u0275elementEnd();
        \u0275\u0275element(74, "hr", 45);
        \u0275\u0275elementStart(75, "button", 46);
        \u0275\u0275listener("click", function ShellComponent_Template_button_click_75_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.logout());
        });
        \u0275\u0275elementStart(76, "mat-icon", 47);
        \u0275\u0275text(77, "logout");
        \u0275\u0275elementEnd();
        \u0275\u0275text(78, " Cerrar sesi\xF3n ");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(79, "main", 48)(80, "div", 49);
        \u0275\u0275element(81, "router-outlet");
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        let tmp_11_0;
        let tmp_12_0;
        let tmp_20_0;
        let tmp_21_0;
        let tmp_22_0;
        const notifMenu_r5 = \u0275\u0275reference(48);
        const userMenu_r6 = \u0275\u0275reference(60);
        \u0275\u0275advance();
        \u0275\u0275conditional(1, ctx.sidenavOpen() ? 1 : -1);
        \u0275\u0275advance();
        \u0275\u0275classProp("w-72", ctx.sidenavOpen())("w-20", !ctx.sidenavOpen())("-translate-x-full", !ctx.sidenavOpen());
        \u0275\u0275advance(5);
        \u0275\u0275classProp("opacity-0", !ctx.sidenavOpen())("translate-x-4", !ctx.sidenavOpen());
        \u0275\u0275advance(5);
        \u0275\u0275repeater(ctx.visibleNavItems());
        \u0275\u0275advance(7);
        \u0275\u0275classProp("opacity-0", !ctx.sidenavOpen())("translate-x-4", !ctx.sidenavOpen());
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate((tmp_11_0 = ctx.user()) == null ? null : tmp_11_0.username);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(((tmp_12_0 = ctx.user()) == null ? null : tmp_12_0.rol_nombre) || ((tmp_12_0 = ctx.user()) == null ? null : tmp_12_0.rol));
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate(ctx.sidenavOpen() ? "menu_open" : "menu");
        \u0275\u0275advance(7);
        \u0275\u0275property("matTooltip", ctx.isDark() ? "Modo Claro" : "Modo Oscuro");
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.isDark() ? "light_mode" : "dark_mode");
        \u0275\u0275advance(5);
        \u0275\u0275property("matMenuTriggerFor", notifMenu_r5);
        \u0275\u0275advance(3);
        \u0275\u0275conditional(46, ctx.notifCount > 0 ? 46 : -1);
        \u0275\u0275advance(6);
        \u0275\u0275conditional(52, ctx.notifCount === 0 ? 52 : 53);
        \u0275\u0275advance(2);
        \u0275\u0275property("matMenuTriggerFor", userMenu_r6);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1(" ", (tmp_20_0 = ctx.user()) == null ? null : tmp_20_0.username == null ? null : (tmp_20_0 = tmp_20_0.username.charAt(0)) == null ? null : tmp_20_0.toUpperCase(), " ");
        \u0275\u0275advance(7);
        \u0275\u0275textInterpolate((tmp_21_0 = ctx.user()) == null ? null : tmp_21_0.username);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(((tmp_22_0 = ctx.user()) == null ? null : tmp_22_0.rol_nombre) || ((tmp_22_0 = ctx.user()) == null ? null : tmp_22_0.rol));
      }
    }, dependencies: [
      CommonModule,
      RouterOutlet,
      RouterLink,
      RouterLinkActive,
      MatToolbarModule,
      MatSidenavModule,
      MatListModule,
      MatIconModule,
      MatIcon,
      MatButtonModule,
      MatMenuModule,
      MatMenu,
      MatMenuItem,
      MatMenuTrigger,
      MatBadgeModule,
      MatTooltipModule,
      MatTooltip
    ], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n.custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 4px;\n}\n.custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: transparent;\n}\n.custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: rgba(255, 255, 255, 0.05);\n  border-radius: 10px;\n}\n.custom-scrollbar[_ngcontent-%COMP%]:hover::-webkit-scrollbar-thumb {\n  background: rgba(255, 255, 255, 0.1);\n}\n  .modern-menu {\n  border-radius: 20px !important;\n  border: 1px solid rgba(0, 0, 0, 0.05) !important;\n  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;\n  padding: 8px !important;\n  margin-top: 8px !important;\n  background: rgba(255, 255, 255, 0.95) !important;\n  -webkit-backdrop-filter: blur(10px) !important;\n  backdrop-filter: blur(10px) !important;\n}\n  .modern-menu .mat-mdc-menu-item {\n  border-radius: 12px !important;\n  margin: 2px 0 !important;\n  font-weight: 500 !important;\n  font-size: 0.875rem !important;\n  color: #475569 !important;\n}\n  .modern-menu .mat-mdc-menu-item:hover:not([disabled]) {\n  background: #f1f5f9 !important;\n  color: #1e293b !important;\n}\n  .modern-menu .mat-mdc-menu-item .mat-icon {\n  color: #94a3b8 !important;\n  margin-right: 12px !important;\n  font-size: 20px !important;\n  width: 20px !important;\n  height: 20px !important;\n}\n/*# sourceMappingURL=shell.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ShellComponent, { className: "ShellComponent", filePath: "src\\app\\layout\\shell\\shell.component.ts", lineNumber: 36 });
})();
export {
  ShellComponent
};
//# sourceMappingURL=chunk-J6ZM7LSB.js.map
