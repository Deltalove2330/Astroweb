import {
  PhotoLightboxComponent
} from "./chunk-6JKMYGP7.js";
import {
  MatDialog,
  MatDialogModule
} from "./chunk-KCFHIW3D.js";
import {
  MatInputModule
} from "./chunk-GXZEZIYO.js";
import {
  AuthService
} from "./chunk-FAJEMXMR.js";
import {
  MatChipsModule
} from "./chunk-ZMRIVOSV.js";
import {
  MatFormFieldModule
} from "./chunk-YUDUWHLJ.js";
import {
  MatCardModule
} from "./chunk-HA7AXTKJ.js";
import {
  MatTooltip,
  MatTooltipModule
} from "./chunk-PBKBS7OR.js";
import "./chunk-CELNEZAJ.js";
import {
  CdkPortalOutlet,
  PortalModule,
  TemplatePortal,
  UniqueSelectionDispatcher
} from "./chunk-ABO6AUNU.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgModel
} from "./chunk-I7XEM5TB.js";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "./chunk-WHO5S5ML.js";
import {
  MatProgressSpinner,
  MatProgressSpinnerModule
} from "./chunk-EGRIEE5E.js";
import {
  ApiService
} from "./chunk-G4LBJVY7.js";
import {
  ENTER,
  FocusKeyManager,
  FocusMonitor,
  MatButton,
  MatButtonModule,
  MatCommonModule,
  MatIcon,
  MatIconButton,
  MatIconModule,
  SPACE,
  hasModifierKey
} from "./chunk-KQNRR4FF.js";
import {
  Router
} from "./chunk-QGVFX6Y7.js";
import "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  ANIMATION_MODULE_TYPE,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  ContentChild,
  ContentChildren,
  DOCUMENT,
  DatePipe,
  Directive,
  EMPTY,
  ElementRef,
  EventEmitter,
  Host,
  Inject,
  InjectionToken,
  Input,
  InputFlags,
  NgModule,
  Optional,
  Output,
  QueryList,
  SkipSelf,
  Subject,
  Subscription,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation$1,
  __spreadProps,
  __spreadValues,
  booleanAttribute,
  computed,
  filter,
  merge,
  numberAttribute,
  setClassMetadata,
  signal,
  startWith,
  take,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵInputTransformsFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵinjectAttribute,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-QB3BCYT5.js";

// node_modules/@angular/cdk/fesm2022/accordion.mjs
var nextId$1 = 0;
var CDK_ACCORDION = new InjectionToken("CdkAccordion");
var CdkAccordion = class _CdkAccordion {
  constructor() {
    this._stateChanges = new Subject();
    this._openCloseAllActions = new Subject();
    this.id = `cdk-accordion-${nextId$1++}`;
    this.multi = false;
  }
  /** Opens all enabled accordion items in an accordion where multi is enabled. */
  openAll() {
    if (this.multi) {
      this._openCloseAllActions.next(true);
    }
  }
  /** Closes all enabled accordion items. */
  closeAll() {
    this._openCloseAllActions.next(false);
  }
  ngOnChanges(changes) {
    this._stateChanges.next(changes);
  }
  ngOnDestroy() {
    this._stateChanges.complete();
    this._openCloseAllActions.complete();
  }
  static {
    this.\u0275fac = function CdkAccordion_Factory(t) {
      return new (t || _CdkAccordion)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _CdkAccordion,
      selectors: [["cdk-accordion"], ["", "cdkAccordion", ""]],
      inputs: {
        multi: [InputFlags.HasDecoratorInputTransform, "multi", "multi", booleanAttribute]
      },
      exportAs: ["cdkAccordion"],
      standalone: true,
      features: [\u0275\u0275ProvidersFeature([{
        provide: CDK_ACCORDION,
        useExisting: _CdkAccordion
      }]), \u0275\u0275InputTransformsFeature, \u0275\u0275NgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkAccordion, [{
    type: Directive,
    args: [{
      selector: "cdk-accordion, [cdkAccordion]",
      exportAs: "cdkAccordion",
      providers: [{
        provide: CDK_ACCORDION,
        useExisting: CdkAccordion
      }],
      standalone: true
    }]
  }], null, {
    multi: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var nextId = 0;
var CdkAccordionItem = class _CdkAccordionItem {
  /** Whether the AccordionItem is expanded. */
  get expanded() {
    return this._expanded;
  }
  set expanded(expanded) {
    if (this._expanded !== expanded) {
      this._expanded = expanded;
      this.expandedChange.emit(expanded);
      if (expanded) {
        this.opened.emit();
        const accordionId = this.accordion ? this.accordion.id : this.id;
        this._expansionDispatcher.notify(this.id, accordionId);
      } else {
        this.closed.emit();
      }
      this._changeDetectorRef.markForCheck();
    }
  }
  constructor(accordion, _changeDetectorRef, _expansionDispatcher) {
    this.accordion = accordion;
    this._changeDetectorRef = _changeDetectorRef;
    this._expansionDispatcher = _expansionDispatcher;
    this._openCloseAllSubscription = Subscription.EMPTY;
    this.closed = new EventEmitter();
    this.opened = new EventEmitter();
    this.destroyed = new EventEmitter();
    this.expandedChange = new EventEmitter();
    this.id = `cdk-accordion-child-${nextId++}`;
    this._expanded = false;
    this.disabled = false;
    this._removeUniqueSelectionListener = () => {
    };
    this._removeUniqueSelectionListener = _expansionDispatcher.listen((id, accordionId) => {
      if (this.accordion && !this.accordion.multi && this.accordion.id === accordionId && this.id !== id) {
        this.expanded = false;
      }
    });
    if (this.accordion) {
      this._openCloseAllSubscription = this._subscribeToOpenCloseAllActions();
    }
  }
  /** Emits an event for the accordion item being destroyed. */
  ngOnDestroy() {
    this.opened.complete();
    this.closed.complete();
    this.destroyed.emit();
    this.destroyed.complete();
    this._removeUniqueSelectionListener();
    this._openCloseAllSubscription.unsubscribe();
  }
  /** Toggles the expanded state of the accordion item. */
  toggle() {
    if (!this.disabled) {
      this.expanded = !this.expanded;
    }
  }
  /** Sets the expanded state of the accordion item to false. */
  close() {
    if (!this.disabled) {
      this.expanded = false;
    }
  }
  /** Sets the expanded state of the accordion item to true. */
  open() {
    if (!this.disabled) {
      this.expanded = true;
    }
  }
  _subscribeToOpenCloseAllActions() {
    return this.accordion._openCloseAllActions.subscribe((expanded) => {
      if (!this.disabled) {
        this.expanded = expanded;
      }
    });
  }
  static {
    this.\u0275fac = function CdkAccordionItem_Factory(t) {
      return new (t || _CdkAccordionItem)(\u0275\u0275directiveInject(CDK_ACCORDION, 12), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(UniqueSelectionDispatcher));
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _CdkAccordionItem,
      selectors: [["cdk-accordion-item"], ["", "cdkAccordionItem", ""]],
      inputs: {
        expanded: [InputFlags.HasDecoratorInputTransform, "expanded", "expanded", booleanAttribute],
        disabled: [InputFlags.HasDecoratorInputTransform, "disabled", "disabled", booleanAttribute]
      },
      outputs: {
        closed: "closed",
        opened: "opened",
        destroyed: "destroyed",
        expandedChange: "expandedChange"
      },
      exportAs: ["cdkAccordionItem"],
      standalone: true,
      features: [\u0275\u0275ProvidersFeature([
        // Provide `CDK_ACCORDION` as undefined to prevent nested accordion items from
        // registering to the same accordion.
        {
          provide: CDK_ACCORDION,
          useValue: void 0
        }
      ]), \u0275\u0275InputTransformsFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkAccordionItem, [{
    type: Directive,
    args: [{
      selector: "cdk-accordion-item, [cdkAccordionItem]",
      exportAs: "cdkAccordionItem",
      providers: [
        // Provide `CDK_ACCORDION` as undefined to prevent nested accordion items from
        // registering to the same accordion.
        {
          provide: CDK_ACCORDION,
          useValue: void 0
        }
      ],
      standalone: true
    }]
  }], () => [{
    type: CdkAccordion,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CDK_ACCORDION]
    }, {
      type: SkipSelf
    }]
  }, {
    type: ChangeDetectorRef
  }, {
    type: UniqueSelectionDispatcher
  }], {
    closed: [{
      type: Output
    }],
    opened: [{
      type: Output
    }],
    destroyed: [{
      type: Output
    }],
    expandedChange: [{
      type: Output
    }],
    expanded: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var CdkAccordionModule = class _CdkAccordionModule {
  static {
    this.\u0275fac = function CdkAccordionModule_Factory(t) {
      return new (t || _CdkAccordionModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _CdkAccordionModule
    });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkAccordionModule, [{
    type: NgModule,
    args: [{
      imports: [CdkAccordion, CdkAccordionItem],
      exports: [CdkAccordion, CdkAccordionItem]
    }]
  }], null, null);
})();

// node_modules/@angular/material/fesm2022/expansion.mjs
var _c0 = ["body"];
var _c1 = [[["mat-expansion-panel-header"]], "*", [["mat-action-row"]]];
var _c2 = ["mat-expansion-panel-header", "*", "mat-action-row"];
function MatExpansionPanel_ng_template_5_Template(rf, ctx) {
}
var _c3 = [[["mat-panel-title"]], [["mat-panel-description"]], "*"];
var _c4 = ["mat-panel-title", "mat-panel-description", "*"];
function MatExpansionPanelHeader_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 1);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 2);
    \u0275\u0275element(2, "path", 3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("@indicatorRotate", ctx_r0._getExpandedState());
  }
}
var MAT_ACCORDION = new InjectionToken("MAT_ACCORDION");
var EXPANSION_PANEL_ANIMATION_TIMING = "225ms cubic-bezier(0.4,0.0,0.2,1)";
var matExpansionAnimations = {
  /** Animation that rotates the indicator arrow. */
  indicatorRotate: trigger("indicatorRotate", [state("collapsed, void", style({
    transform: "rotate(0deg)"
  })), state("expanded", style({
    transform: "rotate(180deg)"
  })), transition("expanded <=> collapsed, void => collapsed", animate(EXPANSION_PANEL_ANIMATION_TIMING))]),
  /** Animation that expands and collapses the panel content. */
  bodyExpansion: trigger("bodyExpansion", [
    state("collapsed, void", style({
      height: "0px",
      visibility: "hidden"
    })),
    // Clear the `visibility` while open, otherwise the content will be visible when placed in
    // a parent that's `visibility: hidden`, because `visibility` doesn't apply to descendants
    // that have a `visibility` of their own (see #27436).
    state("expanded", style({
      height: "*",
      visibility: ""
    })),
    transition("expanded <=> collapsed, void => collapsed", animate(EXPANSION_PANEL_ANIMATION_TIMING))
  ])
};
var MAT_EXPANSION_PANEL = new InjectionToken("MAT_EXPANSION_PANEL");
var MatExpansionPanelContent = class _MatExpansionPanelContent {
  constructor(_template, _expansionPanel) {
    this._template = _template;
    this._expansionPanel = _expansionPanel;
  }
  static {
    this.\u0275fac = function MatExpansionPanelContent_Factory(t) {
      return new (t || _MatExpansionPanelContent)(\u0275\u0275directiveInject(TemplateRef), \u0275\u0275directiveInject(MAT_EXPANSION_PANEL, 8));
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _MatExpansionPanelContent,
      selectors: [["ng-template", "matExpansionPanelContent", ""]],
      standalone: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatExpansionPanelContent, [{
    type: Directive,
    args: [{
      selector: "ng-template[matExpansionPanelContent]",
      standalone: true
    }]
  }], () => [{
    type: TemplateRef
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [MAT_EXPANSION_PANEL]
    }, {
      type: Optional
    }]
  }], null);
})();
var uniqueId = 0;
var MAT_EXPANSION_PANEL_DEFAULT_OPTIONS = new InjectionToken("MAT_EXPANSION_PANEL_DEFAULT_OPTIONS");
var MatExpansionPanel = class _MatExpansionPanel extends CdkAccordionItem {
  /** Whether the toggle indicator should be hidden. */
  get hideToggle() {
    return this._hideToggle || this.accordion && this.accordion.hideToggle;
  }
  set hideToggle(value) {
    this._hideToggle = value;
  }
  /** The position of the expansion indicator. */
  get togglePosition() {
    return this._togglePosition || this.accordion && this.accordion.togglePosition;
  }
  set togglePosition(value) {
    this._togglePosition = value;
  }
  constructor(accordion, _changeDetectorRef, _uniqueSelectionDispatcher, _viewContainerRef, _document, _animationMode, defaultOptions) {
    super(accordion, _changeDetectorRef, _uniqueSelectionDispatcher);
    this._viewContainerRef = _viewContainerRef;
    this._animationMode = _animationMode;
    this._hideToggle = false;
    this.afterExpand = new EventEmitter();
    this.afterCollapse = new EventEmitter();
    this._inputChanges = new Subject();
    this._headerId = `mat-expansion-panel-header-${uniqueId++}`;
    this.accordion = accordion;
    this._document = _document;
    this._animationsDisabled = _animationMode === "NoopAnimations";
    if (defaultOptions) {
      this.hideToggle = defaultOptions.hideToggle;
    }
  }
  /** Determines whether the expansion panel should have spacing between it and its siblings. */
  _hasSpacing() {
    if (this.accordion) {
      return this.expanded && this.accordion.displayMode === "default";
    }
    return false;
  }
  /** Gets the expanded state string. */
  _getExpandedState() {
    return this.expanded ? "expanded" : "collapsed";
  }
  /** Toggles the expanded state of the expansion panel. */
  toggle() {
    this.expanded = !this.expanded;
  }
  /** Sets the expanded state of the expansion panel to false. */
  close() {
    this.expanded = false;
  }
  /** Sets the expanded state of the expansion panel to true. */
  open() {
    this.expanded = true;
  }
  ngAfterContentInit() {
    if (this._lazyContent && this._lazyContent._expansionPanel === this) {
      this.opened.pipe(startWith(null), filter(() => this.expanded && !this._portal), take(1)).subscribe(() => {
        this._portal = new TemplatePortal(this._lazyContent._template, this._viewContainerRef);
      });
    }
  }
  ngOnChanges(changes) {
    this._inputChanges.next(changes);
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this._inputChanges.complete();
  }
  /** Checks whether the expansion panel's content contains the currently-focused element. */
  _containsFocus() {
    if (this._body) {
      const focusedElement = this._document.activeElement;
      const bodyElement = this._body.nativeElement;
      return focusedElement === bodyElement || bodyElement.contains(focusedElement);
    }
    return false;
  }
  /** Called when the expansion animation has started. */
  _animationStarted(event) {
    if (!isInitialAnimation(event) && !this._animationsDisabled && this._body) {
      this._body?.nativeElement.setAttribute("inert", "");
    }
  }
  /** Called when the expansion animation has finished. */
  _animationDone(event) {
    if (!isInitialAnimation(event)) {
      if (event.toState === "expanded") {
        this.afterExpand.emit();
      } else if (event.toState === "collapsed") {
        this.afterCollapse.emit();
      }
      if (!this._animationsDisabled && this._body) {
        this._body.nativeElement.removeAttribute("inert");
      }
    }
  }
  static {
    this.\u0275fac = function MatExpansionPanel_Factory(t) {
      return new (t || _MatExpansionPanel)(\u0275\u0275directiveInject(MAT_ACCORDION, 12), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(UniqueSelectionDispatcher), \u0275\u0275directiveInject(ViewContainerRef), \u0275\u0275directiveInject(DOCUMENT), \u0275\u0275directiveInject(ANIMATION_MODULE_TYPE, 8), \u0275\u0275directiveInject(MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, 8));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MatExpansionPanel,
      selectors: [["mat-expansion-panel"]],
      contentQueries: function MatExpansionPanel_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuery(dirIndex, MatExpansionPanelContent, 5);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._lazyContent = _t.first);
        }
      },
      viewQuery: function MatExpansionPanel_Query(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275viewQuery(_c0, 5);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._body = _t.first);
        }
      },
      hostAttrs: [1, "mat-expansion-panel"],
      hostVars: 6,
      hostBindings: function MatExpansionPanel_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275classProp("mat-expanded", ctx.expanded)("_mat-animation-noopable", ctx._animationsDisabled)("mat-expansion-panel-spacing", ctx._hasSpacing());
        }
      },
      inputs: {
        hideToggle: [InputFlags.HasDecoratorInputTransform, "hideToggle", "hideToggle", booleanAttribute],
        togglePosition: "togglePosition"
      },
      outputs: {
        afterExpand: "afterExpand",
        afterCollapse: "afterCollapse"
      },
      exportAs: ["matExpansionPanel"],
      standalone: true,
      features: [\u0275\u0275ProvidersFeature([
        // Provide MatAccordion as undefined to prevent nested expansion panels from registering
        // to the same accordion.
        {
          provide: MAT_ACCORDION,
          useValue: void 0
        },
        {
          provide: MAT_EXPANSION_PANEL,
          useExisting: _MatExpansionPanel
        }
      ]), \u0275\u0275InputTransformsFeature, \u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature],
      ngContentSelectors: _c2,
      decls: 7,
      vars: 4,
      consts: [["body", ""], ["role", "region", 1, "mat-expansion-panel-content", 3, "id"], [1, "mat-expansion-panel-body"], [3, "cdkPortalOutlet"]],
      template: function MatExpansionPanel_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = \u0275\u0275getCurrentView();
          \u0275\u0275projectionDef(_c1);
          \u0275\u0275projection(0);
          \u0275\u0275elementStart(1, "div", 1, 0);
          \u0275\u0275listener("@bodyExpansion.start", function MatExpansionPanel_Template_div_animation_bodyExpansion_start_1_listener($event) {
            \u0275\u0275restoreView(_r1);
            return \u0275\u0275resetView(ctx._animationStarted($event));
          })("@bodyExpansion.done", function MatExpansionPanel_Template_div_animation_bodyExpansion_done_1_listener($event) {
            \u0275\u0275restoreView(_r1);
            return \u0275\u0275resetView(ctx._animationDone($event));
          });
          \u0275\u0275elementStart(3, "div", 2);
          \u0275\u0275projection(4, 1);
          \u0275\u0275template(5, MatExpansionPanel_ng_template_5_Template, 0, 0, "ng-template", 3);
          \u0275\u0275elementEnd();
          \u0275\u0275projection(6, 2);
          \u0275\u0275elementEnd();
        }
        if (rf & 2) {
          \u0275\u0275advance();
          \u0275\u0275property("@bodyExpansion", ctx._getExpandedState())("id", ctx.id);
          \u0275\u0275attribute("aria-labelledby", ctx._headerId);
          \u0275\u0275advance(4);
          \u0275\u0275property("cdkPortalOutlet", ctx._portal);
        }
      },
      dependencies: [CdkPortalOutlet],
      styles: ['.mat-expansion-panel{box-sizing:content-box;display:block;margin:0;overflow:hidden;transition:margin 225ms cubic-bezier(0.4, 0, 0.2, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);position:relative;background:var(--mat-expansion-container-background-color);color:var(--mat-expansion-container-text-color);border-radius:var(--mat-expansion-container-shape)}.mat-expansion-panel:not([class*=mat-elevation-z]){box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)}.mat-accordion .mat-expansion-panel:not(.mat-expanded),.mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing){border-radius:0}.mat-accordion .mat-expansion-panel:first-of-type{border-top-right-radius:var(--mat-expansion-container-shape);border-top-left-radius:var(--mat-expansion-container-shape)}.mat-accordion .mat-expansion-panel:last-of-type{border-bottom-right-radius:var(--mat-expansion-container-shape);border-bottom-left-radius:var(--mat-expansion-container-shape)}.cdk-high-contrast-active .mat-expansion-panel{outline:solid 1px}.mat-expansion-panel.ng-animate-disabled,.ng-animate-disabled .mat-expansion-panel,.mat-expansion-panel._mat-animation-noopable{transition:none}.mat-expansion-panel-content{display:flex;flex-direction:column;overflow:visible;font-family:var(--mat-expansion-container-text-font);font-size:var(--mat-expansion-container-text-size);font-weight:var(--mat-expansion-container-text-weight);line-height:var(--mat-expansion-container-text-line-height);letter-spacing:var(--mat-expansion-container-text-tracking)}.mat-expansion-panel-content[style*="visibility: hidden"] *{visibility:hidden !important}.mat-expansion-panel-body{padding:0 24px 16px}.mat-expansion-panel-spacing{margin:16px 0}.mat-accordion>.mat-expansion-panel-spacing:first-child,.mat-accordion>*:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-top:0}.mat-accordion>.mat-expansion-panel-spacing:last-child,.mat-accordion>*:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-bottom:0}.mat-action-row{border-top-style:solid;border-top-width:1px;display:flex;flex-direction:row;justify-content:flex-end;padding:16px 8px 16px 24px;border-top-color:var(--mat-expansion-actions-divider-color)}.mat-action-row .mat-button-base,.mat-action-row .mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-action-row .mat-button-base,[dir=rtl] .mat-action-row .mat-mdc-button-base{margin-left:0;margin-right:8px}'],
      encapsulation: 2,
      data: {
        animation: [matExpansionAnimations.bodyExpansion]
      },
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatExpansionPanel, [{
    type: Component,
    args: [{
      selector: "mat-expansion-panel",
      exportAs: "matExpansionPanel",
      encapsulation: ViewEncapsulation$1.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      animations: [matExpansionAnimations.bodyExpansion],
      providers: [
        // Provide MatAccordion as undefined to prevent nested expansion panels from registering
        // to the same accordion.
        {
          provide: MAT_ACCORDION,
          useValue: void 0
        },
        {
          provide: MAT_EXPANSION_PANEL,
          useExisting: MatExpansionPanel
        }
      ],
      host: {
        "class": "mat-expansion-panel",
        "[class.mat-expanded]": "expanded",
        "[class._mat-animation-noopable]": "_animationsDisabled",
        "[class.mat-expansion-panel-spacing]": "_hasSpacing()"
      },
      standalone: true,
      imports: [CdkPortalOutlet],
      template: '<ng-content select="mat-expansion-panel-header"></ng-content>\n<div class="mat-expansion-panel-content"\n     role="region"\n     [@bodyExpansion]="_getExpandedState()"\n     (@bodyExpansion.start)="_animationStarted($event)"\n     (@bodyExpansion.done)="_animationDone($event)"\n     [attr.aria-labelledby]="_headerId"\n     [id]="id"\n     #body>\n  <div class="mat-expansion-panel-body">\n    <ng-content></ng-content>\n    <ng-template [cdkPortalOutlet]="_portal"></ng-template>\n  </div>\n  <ng-content select="mat-action-row"></ng-content>\n</div>\n',
      styles: ['.mat-expansion-panel{box-sizing:content-box;display:block;margin:0;overflow:hidden;transition:margin 225ms cubic-bezier(0.4, 0, 0.2, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);position:relative;background:var(--mat-expansion-container-background-color);color:var(--mat-expansion-container-text-color);border-radius:var(--mat-expansion-container-shape)}.mat-expansion-panel:not([class*=mat-elevation-z]){box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)}.mat-accordion .mat-expansion-panel:not(.mat-expanded),.mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing){border-radius:0}.mat-accordion .mat-expansion-panel:first-of-type{border-top-right-radius:var(--mat-expansion-container-shape);border-top-left-radius:var(--mat-expansion-container-shape)}.mat-accordion .mat-expansion-panel:last-of-type{border-bottom-right-radius:var(--mat-expansion-container-shape);border-bottom-left-radius:var(--mat-expansion-container-shape)}.cdk-high-contrast-active .mat-expansion-panel{outline:solid 1px}.mat-expansion-panel.ng-animate-disabled,.ng-animate-disabled .mat-expansion-panel,.mat-expansion-panel._mat-animation-noopable{transition:none}.mat-expansion-panel-content{display:flex;flex-direction:column;overflow:visible;font-family:var(--mat-expansion-container-text-font);font-size:var(--mat-expansion-container-text-size);font-weight:var(--mat-expansion-container-text-weight);line-height:var(--mat-expansion-container-text-line-height);letter-spacing:var(--mat-expansion-container-text-tracking)}.mat-expansion-panel-content[style*="visibility: hidden"] *{visibility:hidden !important}.mat-expansion-panel-body{padding:0 24px 16px}.mat-expansion-panel-spacing{margin:16px 0}.mat-accordion>.mat-expansion-panel-spacing:first-child,.mat-accordion>*:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-top:0}.mat-accordion>.mat-expansion-panel-spacing:last-child,.mat-accordion>*:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-bottom:0}.mat-action-row{border-top-style:solid;border-top-width:1px;display:flex;flex-direction:row;justify-content:flex-end;padding:16px 8px 16px 24px;border-top-color:var(--mat-expansion-actions-divider-color)}.mat-action-row .mat-button-base,.mat-action-row .mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-action-row .mat-button-base,[dir=rtl] .mat-action-row .mat-mdc-button-base{margin-left:0;margin-right:8px}']
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: SkipSelf
    }, {
      type: Inject,
      args: [MAT_ACCORDION]
    }]
  }, {
    type: ChangeDetectorRef
  }, {
    type: UniqueSelectionDispatcher
  }, {
    type: ViewContainerRef
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [ANIMATION_MODULE_TYPE]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [MAT_EXPANSION_PANEL_DEFAULT_OPTIONS]
    }, {
      type: Optional
    }]
  }], {
    hideToggle: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    togglePosition: [{
      type: Input
    }],
    afterExpand: [{
      type: Output
    }],
    afterCollapse: [{
      type: Output
    }],
    _lazyContent: [{
      type: ContentChild,
      args: [MatExpansionPanelContent]
    }],
    _body: [{
      type: ViewChild,
      args: ["body"]
    }]
  });
})();
function isInitialAnimation(event) {
  return event.fromState === "void";
}
var MatExpansionPanelActionRow = class _MatExpansionPanelActionRow {
  static {
    this.\u0275fac = function MatExpansionPanelActionRow_Factory(t) {
      return new (t || _MatExpansionPanelActionRow)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _MatExpansionPanelActionRow,
      selectors: [["mat-action-row"]],
      hostAttrs: [1, "mat-action-row"],
      standalone: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatExpansionPanelActionRow, [{
    type: Directive,
    args: [{
      selector: "mat-action-row",
      host: {
        class: "mat-action-row"
      },
      standalone: true
    }]
  }], null, null);
})();
var MatExpansionPanelHeader = class _MatExpansionPanelHeader {
  constructor(panel, _element, _focusMonitor, _changeDetectorRef, defaultOptions, _animationMode, tabIndex) {
    this.panel = panel;
    this._element = _element;
    this._focusMonitor = _focusMonitor;
    this._changeDetectorRef = _changeDetectorRef;
    this._animationMode = _animationMode;
    this._parentChangeSubscription = Subscription.EMPTY;
    this.tabIndex = 0;
    const accordionHideToggleChange = panel.accordion ? panel.accordion._stateChanges.pipe(filter((changes) => !!(changes["hideToggle"] || changes["togglePosition"]))) : EMPTY;
    this.tabIndex = parseInt(tabIndex || "") || 0;
    this._parentChangeSubscription = merge(panel.opened, panel.closed, accordionHideToggleChange, panel._inputChanges.pipe(filter((changes) => {
      return !!(changes["hideToggle"] || changes["disabled"] || changes["togglePosition"]);
    }))).subscribe(() => this._changeDetectorRef.markForCheck());
    panel.closed.pipe(filter(() => panel._containsFocus())).subscribe(() => _focusMonitor.focusVia(_element, "program"));
    if (defaultOptions) {
      this.expandedHeight = defaultOptions.expandedHeight;
      this.collapsedHeight = defaultOptions.collapsedHeight;
    }
  }
  /**
   * Whether the associated panel is disabled. Implemented as a part of `FocusableOption`.
   * @docs-private
   */
  get disabled() {
    return this.panel.disabled;
  }
  /** Toggles the expanded state of the panel. */
  _toggle() {
    if (!this.disabled) {
      this.panel.toggle();
    }
  }
  /** Gets whether the panel is expanded. */
  _isExpanded() {
    return this.panel.expanded;
  }
  /** Gets the expanded state string of the panel. */
  _getExpandedState() {
    return this.panel._getExpandedState();
  }
  /** Gets the panel id. */
  _getPanelId() {
    return this.panel.id;
  }
  /** Gets the toggle position for the header. */
  _getTogglePosition() {
    return this.panel.togglePosition;
  }
  /** Gets whether the expand indicator should be shown. */
  _showToggle() {
    return !this.panel.hideToggle && !this.panel.disabled;
  }
  /**
   * Gets the current height of the header. Null if no custom height has been
   * specified, and if the default height from the stylesheet should be used.
   */
  _getHeaderHeight() {
    const isExpanded = this._isExpanded();
    if (isExpanded && this.expandedHeight) {
      return this.expandedHeight;
    } else if (!isExpanded && this.collapsedHeight) {
      return this.collapsedHeight;
    }
    return null;
  }
  /** Handle keydown event calling to toggle() if appropriate. */
  _keydown(event) {
    switch (event.keyCode) {
      case SPACE:
      case ENTER:
        if (!hasModifierKey(event)) {
          event.preventDefault();
          this._toggle();
        }
        break;
      default:
        if (this.panel.accordion) {
          this.panel.accordion._handleHeaderKeydown(event);
        }
        return;
    }
  }
  /**
   * Focuses the panel header. Implemented as a part of `FocusableOption`.
   * @param origin Origin of the action that triggered the focus.
   * @docs-private
   */
  focus(origin, options) {
    if (origin) {
      this._focusMonitor.focusVia(this._element, origin, options);
    } else {
      this._element.nativeElement.focus(options);
    }
  }
  ngAfterViewInit() {
    this._focusMonitor.monitor(this._element).subscribe((origin) => {
      if (origin && this.panel.accordion) {
        this.panel.accordion._handleHeaderFocus(this);
      }
    });
  }
  ngOnDestroy() {
    this._parentChangeSubscription.unsubscribe();
    this._focusMonitor.stopMonitoring(this._element);
  }
  static {
    this.\u0275fac = function MatExpansionPanelHeader_Factory(t) {
      return new (t || _MatExpansionPanelHeader)(\u0275\u0275directiveInject(MatExpansionPanel, 1), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(FocusMonitor), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, 8), \u0275\u0275directiveInject(ANIMATION_MODULE_TYPE, 8), \u0275\u0275injectAttribute("tabindex"));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MatExpansionPanelHeader,
      selectors: [["mat-expansion-panel-header"]],
      hostAttrs: ["role", "button", 1, "mat-expansion-panel-header", "mat-focus-indicator"],
      hostVars: 15,
      hostBindings: function MatExpansionPanelHeader_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("click", function MatExpansionPanelHeader_click_HostBindingHandler() {
            return ctx._toggle();
          })("keydown", function MatExpansionPanelHeader_keydown_HostBindingHandler($event) {
            return ctx._keydown($event);
          });
        }
        if (rf & 2) {
          \u0275\u0275attribute("id", ctx.panel._headerId)("tabindex", ctx.disabled ? -1 : ctx.tabIndex)("aria-controls", ctx._getPanelId())("aria-expanded", ctx._isExpanded())("aria-disabled", ctx.panel.disabled);
          \u0275\u0275styleProp("height", ctx._getHeaderHeight());
          \u0275\u0275classProp("mat-expanded", ctx._isExpanded())("mat-expansion-toggle-indicator-after", ctx._getTogglePosition() === "after")("mat-expansion-toggle-indicator-before", ctx._getTogglePosition() === "before")("_mat-animation-noopable", ctx._animationMode === "NoopAnimations");
        }
      },
      inputs: {
        expandedHeight: "expandedHeight",
        collapsedHeight: "collapsedHeight",
        tabIndex: [InputFlags.HasDecoratorInputTransform, "tabIndex", "tabIndex", (value) => value == null ? 0 : numberAttribute(value)]
      },
      standalone: true,
      features: [\u0275\u0275InputTransformsFeature, \u0275\u0275StandaloneFeature],
      ngContentSelectors: _c4,
      decls: 5,
      vars: 3,
      consts: [[1, "mat-content"], [1, "mat-expansion-indicator"], ["xmlns", "http://www.w3.org/2000/svg", "viewBox", "0 -960 960 960", "aria-hidden", "true", "focusable", "false"], ["d", "M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"]],
      template: function MatExpansionPanelHeader_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef(_c3);
          \u0275\u0275elementStart(0, "span", 0);
          \u0275\u0275projection(1);
          \u0275\u0275projection(2, 1);
          \u0275\u0275projection(3, 2);
          \u0275\u0275elementEnd();
          \u0275\u0275template(4, MatExpansionPanelHeader_Conditional_4_Template, 3, 1, "span", 1);
        }
        if (rf & 2) {
          \u0275\u0275classProp("mat-content-hide-toggle", !ctx._showToggle());
          \u0275\u0275advance(4);
          \u0275\u0275conditional(4, ctx._showToggle() ? 4 : -1);
        }
      },
      styles: ['.mat-expansion-panel-header{display:flex;flex-direction:row;align-items:center;padding:0 24px;border-radius:inherit;transition:height 225ms cubic-bezier(0.4, 0, 0.2, 1);height:var(--mat-expansion-header-collapsed-state-height);font-family:var(--mat-expansion-header-text-font);font-size:var(--mat-expansion-header-text-size);font-weight:var(--mat-expansion-header-text-weight);line-height:var(--mat-expansion-header-text-line-height);letter-spacing:var(--mat-expansion-header-text-tracking)}.mat-expansion-panel-header.mat-expanded{height:var(--mat-expansion-header-expanded-state-height)}.mat-expansion-panel-header[aria-disabled=true]{color:var(--mat-expansion-header-disabled-state-text-color)}.mat-expansion-panel-header:not([aria-disabled=true]){cursor:pointer}.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover{background:var(--mat-expansion-header-hover-state-layer-color)}@media(hover: none){.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover{background:var(--mat-expansion-container-background-color)}}.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-keyboard-focused,.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-program-focused{background:var(--mat-expansion-header-focus-state-layer-color)}.mat-expansion-panel-header._mat-animation-noopable{transition:none}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:none}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before{flex-direction:row-reverse}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 16px 0 0}[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 0 0 16px}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-content.mat-content-hide-toggle{margin-right:8px}[dir=rtl] .mat-content.mat-content-hide-toggle{margin-right:0;margin-left:8px}.mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle{margin-left:24px;margin-right:0}[dir=rtl] .mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle{margin-right:24px;margin-left:0}.mat-expansion-panel-header-title{color:var(--mat-expansion-header-text-color)}.mat-expansion-panel-header-title,.mat-expansion-panel-header-description{display:flex;flex-grow:1;flex-basis:0;margin-right:16px;align-items:center}[dir=rtl] .mat-expansion-panel-header-title,[dir=rtl] .mat-expansion-panel-header-description{margin-right:0;margin-left:16px}.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-title,.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-description{color:inherit}.mat-expansion-panel-header-description{flex-grow:2;color:var(--mat-expansion-header-description-color)}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:"";display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle;color:var(--mat-expansion-header-indicator-color);display:inline-block;display:var(--mat-expansion-legacy-header-indicator-display, inline-block)}.mat-expansion-indicator svg{width:24px;height:24px;margin:0 -8px;vertical-align:middle;fill:var(--mat-expansion-header-indicator-color);display:none;display:var(--mat-expansion-header-indicator-display, none)}.cdk-high-contrast-active .mat-expansion-panel-content{border-top:1px solid;border-top-left-radius:0;border-top-right-radius:0}'],
      encapsulation: 2,
      data: {
        animation: [matExpansionAnimations.indicatorRotate]
      },
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatExpansionPanelHeader, [{
    type: Component,
    args: [{
      selector: "mat-expansion-panel-header",
      encapsulation: ViewEncapsulation$1.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      animations: [matExpansionAnimations.indicatorRotate],
      host: {
        "class": "mat-expansion-panel-header mat-focus-indicator",
        "role": "button",
        "[attr.id]": "panel._headerId",
        "[attr.tabindex]": "disabled ? -1 : tabIndex",
        "[attr.aria-controls]": "_getPanelId()",
        "[attr.aria-expanded]": "_isExpanded()",
        "[attr.aria-disabled]": "panel.disabled",
        "[class.mat-expanded]": "_isExpanded()",
        "[class.mat-expansion-toggle-indicator-after]": `_getTogglePosition() === 'after'`,
        "[class.mat-expansion-toggle-indicator-before]": `_getTogglePosition() === 'before'`,
        "[class._mat-animation-noopable]": '_animationMode === "NoopAnimations"',
        "[style.height]": "_getHeaderHeight()",
        "(click)": "_toggle()",
        "(keydown)": "_keydown($event)"
      },
      standalone: true,
      template: '<span class="mat-content" [class.mat-content-hide-toggle]="!_showToggle()">\n  <ng-content select="mat-panel-title"></ng-content>\n  <ng-content select="mat-panel-description"></ng-content>\n  <ng-content></ng-content>\n</span>\n\n@if (_showToggle()) {\n  <span [@indicatorRotate]="_getExpandedState()" class="mat-expansion-indicator">\n    <svg\n      xmlns="http://www.w3.org/2000/svg"\n      viewBox="0 -960 960 960"\n      aria-hidden="true"\n      focusable="false">\n      <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/>\n    </svg>\n  </span>\n}\n',
      styles: ['.mat-expansion-panel-header{display:flex;flex-direction:row;align-items:center;padding:0 24px;border-radius:inherit;transition:height 225ms cubic-bezier(0.4, 0, 0.2, 1);height:var(--mat-expansion-header-collapsed-state-height);font-family:var(--mat-expansion-header-text-font);font-size:var(--mat-expansion-header-text-size);font-weight:var(--mat-expansion-header-text-weight);line-height:var(--mat-expansion-header-text-line-height);letter-spacing:var(--mat-expansion-header-text-tracking)}.mat-expansion-panel-header.mat-expanded{height:var(--mat-expansion-header-expanded-state-height)}.mat-expansion-panel-header[aria-disabled=true]{color:var(--mat-expansion-header-disabled-state-text-color)}.mat-expansion-panel-header:not([aria-disabled=true]){cursor:pointer}.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover{background:var(--mat-expansion-header-hover-state-layer-color)}@media(hover: none){.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover{background:var(--mat-expansion-container-background-color)}}.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-keyboard-focused,.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-program-focused{background:var(--mat-expansion-header-focus-state-layer-color)}.mat-expansion-panel-header._mat-animation-noopable{transition:none}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:none}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before{flex-direction:row-reverse}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 16px 0 0}[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 0 0 16px}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-content.mat-content-hide-toggle{margin-right:8px}[dir=rtl] .mat-content.mat-content-hide-toggle{margin-right:0;margin-left:8px}.mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle{margin-left:24px;margin-right:0}[dir=rtl] .mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle{margin-right:24px;margin-left:0}.mat-expansion-panel-header-title{color:var(--mat-expansion-header-text-color)}.mat-expansion-panel-header-title,.mat-expansion-panel-header-description{display:flex;flex-grow:1;flex-basis:0;margin-right:16px;align-items:center}[dir=rtl] .mat-expansion-panel-header-title,[dir=rtl] .mat-expansion-panel-header-description{margin-right:0;margin-left:16px}.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-title,.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-description{color:inherit}.mat-expansion-panel-header-description{flex-grow:2;color:var(--mat-expansion-header-description-color)}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:"";display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle;color:var(--mat-expansion-header-indicator-color);display:inline-block;display:var(--mat-expansion-legacy-header-indicator-display, inline-block)}.mat-expansion-indicator svg{width:24px;height:24px;margin:0 -8px;vertical-align:middle;fill:var(--mat-expansion-header-indicator-color);display:none;display:var(--mat-expansion-header-indicator-display, none)}.cdk-high-contrast-active .mat-expansion-panel-content{border-top:1px solid;border-top-left-radius:0;border-top-right-radius:0}']
    }]
  }], () => [{
    type: MatExpansionPanel,
    decorators: [{
      type: Host
    }]
  }, {
    type: ElementRef
  }, {
    type: FocusMonitor
  }, {
    type: ChangeDetectorRef
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [MAT_EXPANSION_PANEL_DEFAULT_OPTIONS]
    }, {
      type: Optional
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [ANIMATION_MODULE_TYPE]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Attribute,
      args: ["tabindex"]
    }]
  }], {
    expandedHeight: [{
      type: Input
    }],
    collapsedHeight: [{
      type: Input
    }],
    tabIndex: [{
      type: Input,
      args: [{
        transform: (value) => value == null ? 0 : numberAttribute(value)
      }]
    }]
  });
})();
var MatExpansionPanelDescription = class _MatExpansionPanelDescription {
  static {
    this.\u0275fac = function MatExpansionPanelDescription_Factory(t) {
      return new (t || _MatExpansionPanelDescription)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _MatExpansionPanelDescription,
      selectors: [["mat-panel-description"]],
      hostAttrs: [1, "mat-expansion-panel-header-description"],
      standalone: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatExpansionPanelDescription, [{
    type: Directive,
    args: [{
      selector: "mat-panel-description",
      host: {
        class: "mat-expansion-panel-header-description"
      },
      standalone: true
    }]
  }], null, null);
})();
var MatExpansionPanelTitle = class _MatExpansionPanelTitle {
  static {
    this.\u0275fac = function MatExpansionPanelTitle_Factory(t) {
      return new (t || _MatExpansionPanelTitle)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _MatExpansionPanelTitle,
      selectors: [["mat-panel-title"]],
      hostAttrs: [1, "mat-expansion-panel-header-title"],
      standalone: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatExpansionPanelTitle, [{
    type: Directive,
    args: [{
      selector: "mat-panel-title",
      host: {
        class: "mat-expansion-panel-header-title"
      },
      standalone: true
    }]
  }], null, null);
})();
var MatAccordion = class _MatAccordion extends CdkAccordion {
  constructor() {
    super(...arguments);
    this._ownHeaders = new QueryList();
    this.hideToggle = false;
    this.displayMode = "default";
    this.togglePosition = "after";
  }
  ngAfterContentInit() {
    this._headers.changes.pipe(startWith(this._headers)).subscribe((headers) => {
      this._ownHeaders.reset(headers.filter((header) => header.panel.accordion === this));
      this._ownHeaders.notifyOnChanges();
    });
    this._keyManager = new FocusKeyManager(this._ownHeaders).withWrap().withHomeAndEnd();
  }
  /** Handles keyboard events coming in from the panel headers. */
  _handleHeaderKeydown(event) {
    this._keyManager.onKeydown(event);
  }
  _handleHeaderFocus(header) {
    this._keyManager.updateActiveItem(header);
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this._keyManager?.destroy();
    this._ownHeaders.destroy();
  }
  static {
    this.\u0275fac = /* @__PURE__ */ (() => {
      let \u0275MatAccordion_BaseFactory;
      return function MatAccordion_Factory(t) {
        return (\u0275MatAccordion_BaseFactory || (\u0275MatAccordion_BaseFactory = \u0275\u0275getInheritedFactory(_MatAccordion)))(t || _MatAccordion);
      };
    })();
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _MatAccordion,
      selectors: [["mat-accordion"]],
      contentQueries: function MatAccordion_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuery(dirIndex, MatExpansionPanelHeader, 5);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._headers = _t);
        }
      },
      hostAttrs: [1, "mat-accordion"],
      hostVars: 2,
      hostBindings: function MatAccordion_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275classProp("mat-accordion-multi", ctx.multi);
        }
      },
      inputs: {
        hideToggle: [InputFlags.HasDecoratorInputTransform, "hideToggle", "hideToggle", booleanAttribute],
        displayMode: "displayMode",
        togglePosition: "togglePosition"
      },
      exportAs: ["matAccordion"],
      standalone: true,
      features: [\u0275\u0275ProvidersFeature([{
        provide: MAT_ACCORDION,
        useExisting: _MatAccordion
      }]), \u0275\u0275InputTransformsFeature, \u0275\u0275InheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatAccordion, [{
    type: Directive,
    args: [{
      selector: "mat-accordion",
      exportAs: "matAccordion",
      providers: [{
        provide: MAT_ACCORDION,
        useExisting: MatAccordion
      }],
      host: {
        class: "mat-accordion",
        // Class binding which is only used by the test harness as there is no other
        // way for the harness to detect if multiple panel support is enabled.
        "[class.mat-accordion-multi]": "this.multi"
      },
      standalone: true
    }]
  }], null, {
    _headers: [{
      type: ContentChildren,
      args: [MatExpansionPanelHeader, {
        descendants: true
      }]
    }],
    hideToggle: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    displayMode: [{
      type: Input
    }],
    togglePosition: [{
      type: Input
    }]
  });
})();
var MatExpansionModule = class _MatExpansionModule {
  static {
    this.\u0275fac = function MatExpansionModule_Factory(t) {
      return new (t || _MatExpansionModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _MatExpansionModule
    });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
      imports: [MatCommonModule, CdkAccordionModule, PortalModule]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatExpansionModule, [{
    type: NgModule,
    args: [{
      imports: [MatCommonModule, CdkAccordionModule, PortalModule, MatAccordion, MatExpansionPanel, MatExpansionPanelActionRow, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription, MatExpansionPanelContent],
      exports: [MatAccordion, MatExpansionPanel, MatExpansionPanelActionRow, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription, MatExpansionPanelContent]
    }]
  }], null, null);
})();

// src/app/features/client-photos/client-photos.component.ts
var _forTrack0 = ($index, $item) => $item.key;
function PhotoRejectionFormComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ctx_r0.countSelected(), " seleccionado", ctx_r0.countSelected() === 1 ? "" : "s", "");
  }
}
function PhotoRejectionFormComponent_For_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 17);
    \u0275\u0275listener("click", function PhotoRejectionFormComponent_For_22_Template_button_click_0_listener() {
      const m_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.toggle(m_r3.key));
    });
    \u0275\u0275elementStart(1, "div", 18)(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 19)(5, "span", 20);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 21);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const m_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classProp("active", ctx_r0.motivos[m_r3.key]);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.motivos[m_r3.key] ? "check_circle" : "radio_button_unchecked");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(m_r3.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r3.label);
  }
}
var _forTrack1 = ($index, $item) => $item.id_cliente;
var _forTrack2 = ($index, $item) => $item.region;
var _forTrack3 = ($index, $item) => $item.cadena;
var _forTrack4 = ($index, $item) => $item.identificador;
var _forTrack5 = ($index, $item) => $item.id_visita;
var _forTrack6 = ($index, $item) => $item.tipo;
var _forTrack7 = ($index, $item) => $item.id_foto;
function ClientPhotosComponent_Conditional_8_For_7_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 14);
    \u0275\u0275text(1, "chevron_right");
    \u0275\u0275elementEnd();
  }
}
function ClientPhotosComponent_Conditional_8_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, ClientPhotosComponent_Conditional_8_For_7_Conditional_2_Template, 2, 0, "mat-icon", 14);
  }
  if (rf & 2) {
    const crumb_r3 = ctx.$implicit;
    const \u0275i_26_r4 = ctx.$index;
    const \u0275$count_26_r5 = ctx.$count;
    \u0275\u0275classProp("active", \u0275i_26_r4 === \u0275$count_26_r5 - 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(crumb_r3);
    \u0275\u0275advance();
    \u0275\u0275conditional(2, !(\u0275i_26_r4 === \u0275$count_26_r5 - 1) ? 2 : -1);
  }
}
function ClientPhotosComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5)(1, "button", 12);
    \u0275\u0275listener("click", function ClientPhotosComponent_Conditional_8_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goBack());
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "arrow_back");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Regresar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 13);
    \u0275\u0275repeaterCreate(6, ClientPhotosComponent_Conditional_8_For_7_Template, 3, 4, null, null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r1.getBreadcrumb());
  }
}
function ClientPhotosComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "div", 15)(2, "mat-icon");
    \u0275\u0275text(3, "business");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span")(5, "strong");
    \u0275\u0275text(6, "Cliente:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "button", 16);
    \u0275\u0275listener("click", function ClientPhotosComponent_Conditional_9_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.changeExclusiveClient());
    });
    \u0275\u0275elementStart(9, "mat-icon");
    \u0275\u0275text(10, "swap_horiz");
    \u0275\u0275elementEnd();
    \u0275\u0275text(11, " Cambiar cliente ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", ctx_r1.selectedExclusiveClient().cliente, "");
  }
}
function ClientPhotosComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "mat-spinner", 17);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Cargando datos\u2026");
    \u0275\u0275elementEnd()();
  }
}
function ClientPhotosComponent_Conditional_11_For_11_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1, "Exclusivo");
    \u0275\u0275elementEnd();
  }
}
function ClientPhotosComponent_Conditional_11_For_11_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1, "Tradex");
    \u0275\u0275elementEnd();
  }
}
function ClientPhotosComponent_Conditional_11_For_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function ClientPhotosComponent_Conditional_11_For_11_Template_button_click_0_listener() {
      const c_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectExclusiveClient(c_r9));
    });
    \u0275\u0275elementStart(1, "mat-icon", 25);
    \u0275\u0275text(2, "business");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 26);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, ClientPhotosComponent_Conditional_11_For_11_Conditional_5_Template, 2, 0, "span", 27)(6, ClientPhotosComponent_Conditional_11_For_11_Conditional_6_Template, 2, 0);
    \u0275\u0275elementStart(7, "mat-icon", 28);
    \u0275\u0275text(8, "arrow_forward");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r9 = ctx.$implicit;
    const i_r10 = ctx.$index;
    \u0275\u0275styleProp("animation-delay", i_r10 * 40 + "ms");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(c_r9.cliente);
    \u0275\u0275advance();
    \u0275\u0275conditional(5, c_r9.id_tipo_cliente === 3 ? 5 : c_r9.id_tipo_cliente === 1 ? 6 : -1);
  }
}
function ClientPhotosComponent_Conditional_11_ForEmpty_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "mat-icon");
    \u0275\u0275text(2, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "No hay clientes disponibles.");
    \u0275\u0275elementEnd()();
  }
}
function ClientPhotosComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18)(1, "mat-icon");
    \u0275\u0275text(2, "business");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Selecciona un Cliente");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 19)(6, "mat-icon");
    \u0275\u0275text(7, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "input", 20);
    \u0275\u0275listener("ngModelChange", function ClientPhotosComponent_Conditional_11_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.exclusiveClientSearch.set($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 21);
    \u0275\u0275repeaterCreate(10, ClientPhotosComponent_Conditional_11_For_11_Template, 9, 4, "button", 22, _forTrack1, false, ClientPhotosComponent_Conditional_11_ForEmpty_12_Template, 5, 0, "div", 23);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275property("ngModel", ctx_r1.exclusiveClientSearch());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.filteredExclusiveClients());
  }
}
function ClientPhotosComponent_Conditional_12_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 32);
    \u0275\u0275listener("click", function ClientPhotosComponent_Conditional_12_For_7_Template_button_click_0_listener() {
      const r_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectRegion(r_r12.region));
    });
    \u0275\u0275elementStart(1, "span", 33);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 34);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "mat-icon", 35);
    \u0275\u0275text(6, "arrow_forward");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r12 = ctx.$implicit;
    const i_r13 = ctx.$index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275styleProp("--region-color", ctx_r1.getRegionColor(r_r12.region))("animation-delay", i_r13 * 60 + "ms");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getRegionEmoji(r_r12.region));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r12.region);
  }
}
function ClientPhotosComponent_Conditional_12_ForEmpty_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "mat-icon");
    \u0275\u0275text(2, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "No hay regiones disponibles para tu cuenta.");
    \u0275\u0275elementEnd()();
  }
}
function ClientPhotosComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "mat-icon");
    \u0275\u0275text(2, "public");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Selecciona una regi\xF3n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 30);
    \u0275\u0275repeaterCreate(6, ClientPhotosComponent_Conditional_12_For_7_Template, 7, 6, "button", 31, _forTrack2, false, ClientPhotosComponent_Conditional_12_ForEmpty_8_Template, 5, 0, "div", 23);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r1.regions());
  }
}
function ClientPhotosComponent_Conditional_13_For_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 45);
    \u0275\u0275listener("click", function ClientPhotosComponent_Conditional_13_For_20_Template_button_click_0_listener() {
      const c_r16 = \u0275\u0275restoreView(_r15).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectChain(c_r16.cadena));
    });
    \u0275\u0275elementStart(1, "div", 46)(2, "mat-icon");
    \u0275\u0275text(3, "storefront");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 40)(5, "span", 41);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 42);
    \u0275\u0275text(8, "Ver puntos de venta \u2192");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "mat-icon", 43);
    \u0275\u0275text(10, "chevron_right");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r16 = ctx.$implicit;
    const i_r17 = ctx.$index;
    \u0275\u0275styleProp("animation-delay", (i_r17 + 1) * 50 + "ms");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(c_r16.cadena);
  }
}
function ClientPhotosComponent_Conditional_13_ForEmpty_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "mat-icon");
    \u0275\u0275text(2, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "No hay cadenas en esta regi\xF3n.");
    \u0275\u0275elementEnd()();
  }
}
function ClientPhotosComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18)(1, "mat-icon");
    \u0275\u0275text(2, "store");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Cadenas en ");
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "div", 36)(8, "button", 37);
    \u0275\u0275listener("click", function ClientPhotosComponent_Conditional_13_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.selectChain("");
      return \u0275\u0275resetView(ctx_r1.loadPoints());
    });
    \u0275\u0275elementStart(9, "div", 38)(10, "mat-icon", 39);
    \u0275\u0275text(11, "all_inclusive");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 40)(13, "span", 41);
    \u0275\u0275text(14, "Todos los Puntos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 42);
    \u0275\u0275text(16, "Explorar sin filtrar por cadena \u2192");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "mat-icon", 43);
    \u0275\u0275text(18, "chevron_right");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(19, ClientPhotosComponent_Conditional_13_For_20_Template, 11, 3, "button", 44, _forTrack3, false, ClientPhotosComponent_Conditional_13_ForEmpty_21_Template, 5, 0, "div", 23);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.selectedRegion());
    \u0275\u0275advance(13);
    \u0275\u0275repeater(ctx_r1.chains());
  }
}
function ClientPhotosComponent_Conditional_14_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 56);
    \u0275\u0275listener("click", function ClientPhotosComponent_Conditional_14_Conditional_4_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext(3);
      ctx_r1.selectedChain.set("");
      return \u0275\u0275resetView(ctx_r1.pointSearch.set(""));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "mat-icon", 57);
    \u0275\u0275text(3, "close");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.selectedChain(), " ");
  }
}
function ClientPhotosComponent_Conditional_14_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 58);
    \u0275\u0275listener("click", function ClientPhotosComponent_Conditional_14_Conditional_4_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r20);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.pointSearch.set(""));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "close");
    \u0275\u0275elementEnd()();
  }
}
function ClientPhotosComponent_Conditional_14_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 50);
    \u0275\u0275template(1, ClientPhotosComponent_Conditional_14_Conditional_4_Conditional_1_Template, 4, 1, "button", 54)(2, ClientPhotosComponent_Conditional_14_Conditional_4_Conditional_2_Template, 3, 0, "button", 55);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(1, ctx_r1.selectedChain() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(2, ctx_r1.pointSearch() ? 2 : -1);
  }
}
function ClientPhotosComponent_Conditional_14_Conditional_5_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " en ");
    \u0275\u0275elementStart(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.selectedChain());
  }
}
function ClientPhotosComponent_Conditional_14_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 51);
    \u0275\u0275text(1);
    \u0275\u0275template(2, ClientPhotosComponent_Conditional_14_Conditional_5_Conditional_2_Template, 3, 1, "strong");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" Mostrando ", ctx_r1.filteredPoints().length, " de ", ctx_r1.points().length, " puntos ");
    \u0275\u0275advance();
    \u0275\u0275conditional(2, ctx_r1.selectedChain() ? 2 : -1);
  }
}
function ClientPhotosComponent_Conditional_14_For_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 59);
    \u0275\u0275listener("click", function ClientPhotosComponent_Conditional_14_For_8_Template_button_click_0_listener() {
      const p_r22 = \u0275\u0275restoreView(_r21).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectPoint(p_r22));
    });
    \u0275\u0275elementStart(1, "div", 60)(2, "mat-icon");
    \u0275\u0275text(3, "location_on");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 61)(5, "span", 62);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 63);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "mat-icon", 64);
    \u0275\u0275text(10, "chevron_right");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r22 = ctx.$implicit;
    const i_r23 = ctx.$index;
    \u0275\u0275styleProp("animation-delay", i_r23 * 30 + "ms");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(p_r22.punto_de_interes);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r22.cadena);
  }
}
function ClientPhotosComponent_Conditional_14_ForEmpty_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "mat-icon");
    \u0275\u0275text(2, "search_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "No se encontraron puntos.");
    \u0275\u0275elementEnd()();
  }
}
function ClientPhotosComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 47)(1, "mat-icon", 48);
    \u0275\u0275text(2, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 49);
    \u0275\u0275listener("ngModelChange", function ClientPhotosComponent_Conditional_14_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.pointSearch.set($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, ClientPhotosComponent_Conditional_14_Conditional_4_Template, 3, 2, "div", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, ClientPhotosComponent_Conditional_14_Conditional_5_Template, 3, 3, "p", 51);
    \u0275\u0275elementStart(6, "div", 52);
    \u0275\u0275repeaterCreate(7, ClientPhotosComponent_Conditional_14_For_8_Template, 11, 4, "button", 53, _forTrack4, false, ClientPhotosComponent_Conditional_14_ForEmpty_9_Template, 5, 0, "div", 23);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("placeholder", ctx_r1.selectedChain() ? "Buscar en " + ctx_r1.selectedChain() + "..." : "Buscar entre " + ctx_r1.points().length + " puntos...")("ngModel", ctx_r1.pointSearch());
    \u0275\u0275advance();
    \u0275\u0275conditional(4, ctx_r1.pointSearch() || ctx_r1.selectedChain() ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(5, ctx_r1.pointSearch() || ctx_r1.selectedChain() ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.filteredPoints());
  }
}
function ClientPhotosComponent_Conditional_15_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "mat-icon");
    \u0275\u0275text(2, "photo_library");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "No hay visitas registradas en este punto.");
    \u0275\u0275elementEnd()();
  }
}
function ClientPhotosComponent_Conditional_15_For_12_For_27_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 86)(1, "mat-icon");
    \u0275\u0275text(2, "photo");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tipo_r26 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275styleProp("color", ctx_r1.getTipoConfig(tipo_r26.tipo).color);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", tipo_r26.count, " foto", tipo_r26.count > 1 ? "s" : "", " ");
  }
}
function ClientPhotosComponent_Conditional_15_For_12_For_27_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 87);
    \u0275\u0275text(1, "Sin fotos");
    \u0275\u0275elementEnd();
  }
}
function ClientPhotosComponent_Conditional_15_For_12_For_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 81)(1, "div", 82)(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 83)(5, "span", 84);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, ClientPhotosComponent_Conditional_15_For_12_For_27_Conditional_7_Template, 4, 4, "span", 85)(8, ClientPhotosComponent_Conditional_15_For_12_For_27_Conditional_8_Template, 2, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const tipo_r26 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275styleProp("background", ctx_r1.getTipoConfig(tipo_r26.tipo).gradient);
    \u0275\u0275classProp("has-photos", tipo_r26.count > 0);
    \u0275\u0275advance();
    \u0275\u0275styleProp("color", ctx_r1.getTipoConfig(tipo_r26.tipo).color);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getTipoConfig(tipo_r26.tipo).icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(tipo_r26.nombre);
    \u0275\u0275advance();
    \u0275\u0275conditional(7, tipo_r26.count > 0 ? 7 : 8);
  }
}
function ClientPhotosComponent_Conditional_15_For_12_Conditional_28_For_2_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 92);
    \u0275\u0275listener("click", function ClientPhotosComponent_Conditional_15_For_12_Conditional_28_For_2_For_7_Template_div_click_0_listener() {
      const i_r28 = \u0275\u0275restoreView(_r27).$index;
      const grupo_r29 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.openLightbox(grupo_r29.fotos, i_r28, grupo_r29.nombre));
    });
    \u0275\u0275element(1, "img", 93);
    \u0275\u0275elementStart(2, "div", 94)(3, "mat-icon");
    \u0275\u0275text(4, "zoom_in");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const foto_r30 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", foto_r30.url, \u0275\u0275sanitizeUrl)("alt", foto_r30.tipo_nombre);
  }
}
function ClientPhotosComponent_Conditional_15_For_12_Conditional_28_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 88)(1, "h4", 89)(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 90);
    \u0275\u0275repeaterCreate(6, ClientPhotosComponent_Conditional_15_For_12_Conditional_28_For_2_For_7_Template, 5, 2, "div", 91, _forTrack7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const grupo_r29 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275styleProp("color", ctx_r1.getTipoConfig(grupo_r29.tipo).color);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getTipoConfig(grupo_r29.tipo).icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", grupo_r29.nombre, " ");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(grupo_r29.fotos);
  }
}
function ClientPhotosComponent_Conditional_15_For_12_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 80);
    \u0275\u0275repeaterCreate(1, ClientPhotosComponent_Conditional_15_For_12_Conditional_28_For_2_Template, 8, 4, "div", 88, _forTrack6);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r25 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.groupFotosByTipo(v_r25.fotos));
  }
}
function ClientPhotosComponent_Conditional_15_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-expansion-panel", 70)(1, "mat-expansion-panel-header")(2, "mat-panel-title", 71)(3, "mat-icon", 72);
    \u0275\u0275text(4, "assignment");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 73);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 74);
    \u0275\u0275listener("click", function ClientPhotosComponent_Conditional_15_For_12_Template_button_click_7_listener($event) {
      const v_r25 = \u0275\u0275restoreView(_r24).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      $event.stopPropagation();
      return \u0275\u0275resetView(ctx_r1.goToChat(v_r25.id_visita));
    });
    \u0275\u0275elementStart(8, "mat-icon", 75);
    \u0275\u0275text(9, "chat_bubble_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span");
    \u0275\u0275text(11, "Chat");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "mat-panel-description", 76)(13, "span", 77)(14, "mat-icon");
    \u0275\u0275text(15, "person");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 77)(18, "mat-icon");
    \u0275\u0275text(19, "calendar_today");
    \u0275\u0275elementEnd();
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 77)(22, "mat-icon");
    \u0275\u0275text(23, "photo");
    \u0275\u0275elementEnd();
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "div", 78);
    \u0275\u0275repeaterCreate(26, ClientPhotosComponent_Conditional_15_For_12_For_27_Template, 9, 9, "div", 79, _forTrack6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(28, ClientPhotosComponent_Conditional_15_For_12_Conditional_28_Template, 3, 0, "div", 80);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r25 = ctx.$implicit;
    const i_r31 = ctx.$index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("expanded", i_r31 === 0);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("Visita #", v_r25.id_visita, "");
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate1(" ", v_r25.mercaderista, " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", v_r25.fecha, " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", v_r25.total_fotos, " fotos ");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.getAllTipos(v_r25.fotos));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(28, v_r25.total_fotos > 0 ? 28 : -1);
  }
}
function ClientPhotosComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 65)(1, "div", 66)(2, "mat-icon");
    \u0275\u0275text(3, "store");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div")(5, "h2", 67);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 68);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(9, ClientPhotosComponent_Conditional_15_Conditional_9_Template, 5, 0, "div", 23);
    \u0275\u0275elementStart(10, "mat-accordion", 69);
    \u0275\u0275repeaterCreate(11, ClientPhotosComponent_Conditional_15_For_12_Template, 29, 6, "mat-expansion-panel", 70, _forTrack5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate((tmp_1_0 = ctx_r1.selectedPoint()) == null ? null : tmp_1_0.punto_de_interes);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", (tmp_2_0 = ctx_r1.selectedPoint()) == null ? null : tmp_2_0.cadena, " \xB7 ", (tmp_2_0 = ctx_r1.selectedPoint()) == null ? null : tmp_2_0.ciudad, "");
    \u0275\u0275advance();
    \u0275\u0275conditional(9, ctx_r1.visits().length === 0 ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.visits());
  }
}
function ClientPhotosComponent_Conditional_18_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 95)(1, "div", 96)(2, "span", 97);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 98);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "date");
    \u0275\u0275elementStart(7, "span", 99);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 100)(10, "button", 101);
    \u0275\u0275listener("click", function ClientPhotosComponent_Conditional_18_Conditional_0_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r32);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.startRejection());
    });
    \u0275\u0275text(11, "Rechazar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "button", 102);
    \u0275\u0275listener("click", function ClientPhotosComponent_Conditional_18_Conditional_0_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r32);
      const f_r33 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.approvePhoto(f_r33));
    });
    \u0275\u0275text(13, "Aprobar");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const f_r33 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" #", f_r33.id_foto, " \u2013 ", f_r33.tipo_nombre, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(6, 4, f_r33.fecha, "medium"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", f_r33.estado, " ");
  }
}
function ClientPhotosComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ClientPhotosComponent_Conditional_18_Conditional_0_Template, 14, 7, "div", 95);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(0, !ctx_r1.isRejecting() ? 0 : -1);
  }
}
function ClientPhotosComponent_Conditional_20_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-photo-rejection-form", 104);
    \u0275\u0275listener("cancel", function ClientPhotosComponent_Conditional_20_Conditional_0_Template_app_photo_rejection_form_cancel_0_listener() {
      \u0275\u0275restoreView(_r34);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.isRejecting.set(false));
    })("confirm", function ClientPhotosComponent_Conditional_20_Conditional_0_Template_app_photo_rejection_form_confirm_0_listener($event) {
      \u0275\u0275restoreView(_r34);
      const f_r35 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.submitRejection($event, f_r35));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r35 = \u0275\u0275nextContext();
    \u0275\u0275property("foto", f_r35);
  }
}
function ClientPhotosComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ClientPhotosComponent_Conditional_20_Conditional_0_Template, 1, 1, "app-photo-rejection-form", 103);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(0, ctx_r1.isRejecting() ? 0 : -1);
  }
}
function ClientPhotosComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r36 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 105)(2, "h3")(3, "mat-icon");
    \u0275\u0275text(4, "bar_chart");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " Dashboard");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 106);
    \u0275\u0275listener("click", function ClientPhotosComponent_Conditional_24_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r36);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.dashboardOpen.set(false));
    });
    \u0275\u0275elementStart(7, "mat-icon");
    \u0275\u0275text(8, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 107)(10, "div", 108)(11, "mat-icon");
    \u0275\u0275text(12, "analytics");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "p");
    \u0275\u0275text(14, "El dashboard se cargar\xE1 aqu\xED con los datos de tu cuenta.");
    \u0275\u0275elementEnd()()()();
  }
}
var REGION_EMOJIS = {
  andes: "\u{1F3D4}\uFE0F",
  capital: "\u{1F3DB}\uFE0F",
  centro: "\u{1F306}",
  insular: "\u{1F3DD}\uFE0F",
  occidente: "\u{1F305}",
  oriente: "\u{1F304}",
  llanos: "\u{1F33E}",
  zulia: "\u{1F334}"
};
var REGION_COLORS = {
  andes: "#6366f1",
  capital: "#8b5cf6",
  centro: "#06b6d4",
  insular: "#f59e0b",
  occidente: "#f97316",
  oriente: "#ec4899",
  llanos: "#22c55e",
  zulia: "#14b8a6"
};
var TIPO_FOTO_CONFIG = {
  1: { icon: "edit_note", color: "#6366f1", gradient: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)" },
  2: { icon: "edit_note", color: "#22c55e", gradient: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)" },
  3: { icon: "sell", color: "#f59e0b", gradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)" },
  4: { icon: "grid_view", color: "#8b5cf6", gradient: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)" },
  8: { icon: "inventory_2", color: "#ec4899", gradient: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)" },
  9: { icon: "inventory_2", color: "#14b8a6", gradient: "linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)" }
};
var PhotoRejectionFormComponent = class _PhotoRejectionFormComponent {
  constructor() {
    this.cancel = new EventEmitter();
    this.confirm = new EventEmitter();
    this.motivos = {
      resolucion: false,
      orientacion: false,
      planograma: false,
      precio: false,
      pop: false
    };
    this.comentario = "";
    this.motivosList = [
      { key: "resolucion", label: "Resoluci\xF3n", icon: "\u{1F50D}" },
      { key: "orientacion", label: "Orientaci\xF3n de foto", icon: "\u{1F504}" },
      { key: "planograma", label: "Incumplimiento de planograma", icon: "\u{1F4D0}" },
      { key: "precio", label: "Falta informaci\xF3n de precio", icon: "\u{1F3F7}\uFE0F" },
      { key: "pop", label: "Falta material POP", icon: "\u{1F4E6}" }
    ];
  }
  toggle(key) {
    this.motivos[key] = !this.motivos[key];
  }
  countSelected() {
    return Object.values(this.motivos).filter(Boolean).length;
  }
  isValido() {
    return this.countSelected() > 0 || this.comentario.trim().length > 0;
  }
  confirmar() {
    const seleccionados = [];
    if (this.motivos.resolucion)
      seleccionados.push("Resoluci\xF3n");
    if (this.motivos.orientacion)
      seleccionados.push("Orientaci\xF3n de Foto");
    if (this.motivos.planograma)
      seleccionados.push("Incumplimiento de Planograma");
    if (this.motivos.precio)
      seleccionados.push("Falta Informaci\xF3n de Precio");
    if (this.motivos.pop)
      seleccionados.push("Falta Material POP");
    let stringMotivo = seleccionados.join(", ");
    if (this.comentario.trim()) {
      stringMotivo = stringMotivo ? `${stringMotivo} - ${this.comentario.trim()}` : this.comentario.trim();
    }
    this.confirm.emit(stringMotivo);
  }
  static {
    this.\u0275fac = function PhotoRejectionFormComponent_Factory(t) {
      return new (t || _PhotoRejectionFormComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PhotoRejectionFormComponent, selectors: [["app-photo-rejection-form"]], inputs: { foto: "foto" }, outputs: { cancel: "cancel", confirm: "confirm" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 41, vars: 4, consts: [[1, "rj-form-panel"], [1, "rj-header"], [1, "rj-header-icon"], [1, "rj-header-text"], ["type", "button", "aria-label", "Cerrar", 1, "rj-close", 3, "click"], [1, "rj-body"], [1, "rj-section-title"], [1, "rj-counter"], [1, "rj-grid"], ["type", "button", 1, "rj-chip", 3, "active"], [1, "rj-section-title", 2, "margin-top", "1.25rem"], [1, "rj-optional"], ["rows", "3", "maxlength", "500", "placeholder", "Describe el problema o da instrucciones espec\xEDficas\u2026", 1, "rj-textarea", 3, "ngModelChange", "ngModel"], [1, "rj-counter-text"], [1, "rj-actions"], ["mat-stroked-button", "", 3, "click"], ["type", "button", 1, "rj-btn-confirm", 3, "click", "disabled"], ["type", "button", 1, "rj-chip", 3, "click"], [1, "rj-chip-check"], [1, "rj-chip-text"], [1, "rj-chip-icon"], [1, "rj-chip-label"]], template: function PhotoRejectionFormComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "mat-icon");
        \u0275\u0275text(4, "block");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(5, "div", 3)(6, "h2");
        \u0275\u0275text(7, "Rechazar foto");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "p");
        \u0275\u0275text(9, "Indica al menos un motivo o agrega un comentario.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "button", 4);
        \u0275\u0275listener("click", function PhotoRejectionFormComponent_Template_button_click_10_listener() {
          return ctx.cancel.emit();
        });
        \u0275\u0275elementStart(11, "mat-icon");
        \u0275\u0275text(12, "close");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(13, "div", 5)(14, "div", 6)(15, "mat-icon");
        \u0275\u0275text(16, "fact_check");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(17, "span");
        \u0275\u0275text(18, "Motivo del rechazo");
        \u0275\u0275elementEnd();
        \u0275\u0275template(19, PhotoRejectionFormComponent_Conditional_19_Template, 2, 2, "span", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "div", 8);
        \u0275\u0275repeaterCreate(21, PhotoRejectionFormComponent_For_22_Template, 9, 5, "button", 9, _forTrack0);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "div", 10)(24, "mat-icon");
        \u0275\u0275text(25, "edit_note");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(26, "span");
        \u0275\u0275text(27, "Comentario para el mercaderista");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(28, "span", 11);
        \u0275\u0275text(29, "opcional");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(30, "textarea", 12);
        \u0275\u0275twoWayListener("ngModelChange", function PhotoRejectionFormComponent_Template_textarea_ngModelChange_30_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.comentario, $event) || (ctx.comentario = $event);
          return $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(31, "div", 13);
        \u0275\u0275text(32);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(33, "div", 14)(34, "button", 15);
        \u0275\u0275listener("click", function PhotoRejectionFormComponent_Template_button_click_34_listener() {
          return ctx.cancel.emit();
        });
        \u0275\u0275text(35, "Cancelar");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(36, "button", 16);
        \u0275\u0275listener("click", function PhotoRejectionFormComponent_Template_button_click_36_listener() {
          return ctx.confirmar();
        });
        \u0275\u0275elementStart(37, "mat-icon");
        \u0275\u0275text(38, "cancel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(39, "span");
        \u0275\u0275text(40, "Confirmar rechazo");
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(19);
        \u0275\u0275conditional(19, ctx.countSelected() > 0 ? 19 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.motivosList);
        \u0275\u0275advance(9);
        \u0275\u0275twoWayProperty("ngModel", ctx.comentario);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1("", ctx.comentario.length, " / 500");
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", !ctx.isValido());
      }
    }, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, NgControlStatus, MaxLengthValidator, NgModel, MatButtonModule, MatButton, MatIconModule, MatIcon, MatFormFieldModule, MatInputModule], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  color: inherit;\n  height: 100%;\n}\n.rj-form-panel[_ngcontent-%COMP%] {\n  width: 450px;\n  display: flex;\n  flex-direction: column;\n  flex-shrink: 0;\n  height: 100%;\n  background: #ffffff;\n  color: #1e293b;\n}\n.dark[_nghost-%COMP%]   .rj-form-panel[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .rj-form-panel[_ngcontent-%COMP%] {\n  background: #0f172a;\n  color: #f1f5f9;\n}\n@media (max-width: 768px) {\n  .rj-form-panel[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n.rj-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 18px 22px;\n  background:\n    linear-gradient(\n      135deg,\n      #e11d48 0%,\n      #be123c 100%);\n  color: #fff;\n  flex-shrink: 0;\n}\n.rj-header-icon[_ngcontent-%COMP%] {\n  width: 42px;\n  height: 42px;\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.18);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.rj-header-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 22px;\n  width: 22px;\n  height: 22px;\n}\n.rj-header-text[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.rj-header-text[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.05rem;\n  font-weight: 700;\n  line-height: 1.2;\n}\n.rj-header-text[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 2px 0 0;\n  font-size: 0.8rem;\n  opacity: 0.85;\n}\n.rj-close[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  border: 0;\n  background: rgba(0, 0, 0, 0.18);\n  color: #fff;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  transition: background 0.15s;\n}\n.rj-close[_ngcontent-%COMP%]:hover {\n  background: rgba(0, 0, 0, 0.32);\n}\n.rj-close[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.rj-body[_ngcontent-%COMP%] {\n  padding: 18px 22px 4px;\n  flex: 1;\n  overflow-y: auto;\n}\n.rj-section-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 0.8rem;\n  font-weight: 700;\n  color: #64748b;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  margin-bottom: 10px;\n}\n.dark[_nghost-%COMP%]   .rj-section-title[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .rj-section-title[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.rj-section-title[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  opacity: 0.8;\n}\n.rj-counter[_ngcontent-%COMP%] {\n  margin-left: auto;\n  background: #fee2e2;\n  color: #b91c1c;\n  padding: 2px 10px;\n  border-radius: 999px;\n  font-size: 0.7rem;\n  font-weight: 700;\n  text-transform: none;\n  letter-spacing: 0;\n}\n.dark[_nghost-%COMP%]   .rj-counter[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .rj-counter[_ngcontent-%COMP%] {\n  background: rgba(239, 68, 68, 0.2);\n  color: #fca5a5;\n}\n.rj-optional[_ngcontent-%COMP%] {\n  margin-left: auto;\n  background: #f1f5f9;\n  color: #64748b;\n  padding: 2px 10px;\n  border-radius: 999px;\n  font-size: 0.7rem;\n  font-weight: 700;\n  text-transform: none;\n  letter-spacing: 0;\n}\n.dark[_nghost-%COMP%]   .rj-optional[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .rj-optional[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.08);\n  color: #94a3b8;\n}\n.rj-grid[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 10px;\n  grid-template-columns: 1fr;\n}\n.rj-chip[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 14px;\n  background: #f8fafc;\n  border: 2px solid #e2e8f0;\n  border-radius: 12px;\n  color: #334155;\n  font: inherit;\n  cursor: pointer;\n  text-align: left;\n  transition: all 0.15s;\n}\n.dark[_nghost-%COMP%]   .rj-chip[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .rj-chip[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.04);\n  border-color: rgba(255, 255, 255, 0.08);\n  color: #cbd5e1;\n}\n.rj-chip[_ngcontent-%COMP%]:hover {\n  border-color: #fda4af;\n  background: #fff1f2;\n  color: #be123c;\n}\n.dark[_nghost-%COMP%]   .rj-chip[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .rj-chip[_ngcontent-%COMP%]:hover {\n  background: rgba(244, 63, 94, 0.08);\n  border-color: rgba(244, 63, 94, 0.4);\n  color: #fda4af;\n}\n.rj-chip.active[_ngcontent-%COMP%] {\n  border-color: #e11d48;\n  background:\n    linear-gradient(\n      135deg,\n      #fff1f2 0%,\n      #ffe4e6 100%);\n  color: #9f1239;\n  font-weight: 700;\n}\n.dark[_nghost-%COMP%]   .rj-chip.active[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .rj-chip.active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(225, 29, 72, 0.18) 0%,\n      rgba(225, 29, 72, 0.1) 100%);\n  border-color: #e11d48;\n  color: #fecaca;\n}\n.rj-chip-check[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 22px;\n  width: 22px;\n  height: 22px;\n  flex-shrink: 0;\n  opacity: 0.55;\n}\n.rj-chip.active[_ngcontent-%COMP%]   .rj-chip-check[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #e11d48;\n  opacity: 1;\n}\n.rj-chip-text[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n}\n.rj-chip-icon[_ngcontent-%COMP%] {\n  font-size: 1.05rem;\n  line-height: 1;\n}\n.rj-chip-label[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  line-height: 1.2;\n  white-space: normal;\n}\n.rj-textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 80px;\n  resize: vertical;\n  padding: 12px 14px;\n  background: #f8fafc;\n  border: 2px solid #e2e8f0;\n  border-radius: 12px;\n  color: #1e293b;\n  font: inherit;\n  font-size: 0.9rem;\n  outline: none;\n  transition: border-color 0.15s, background 0.15s;\n}\n.rj-textarea[_ngcontent-%COMP%]:focus {\n  border-color: #e11d48;\n  background: #fff;\n}\n.dark[_nghost-%COMP%]   .rj-textarea[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .rj-textarea[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.04);\n  border-color: rgba(255, 255, 255, 0.08);\n  color: #f1f5f9;\n}\n.dark[_nghost-%COMP%]   .rj-textarea[_ngcontent-%COMP%]:focus, .dark   [_nghost-%COMP%]   .rj-textarea[_ngcontent-%COMP%]:focus {\n  background: rgba(255, 255, 255, 0.06);\n}\n.rj-textarea[_ngcontent-%COMP%]::placeholder {\n  color: #94a3b8;\n}\n.rj-counter-text[_ngcontent-%COMP%] {\n  text-align: right;\n  font-size: 0.7rem;\n  color: #94a3b8;\n  margin-top: 4px;\n  font-weight: 600;\n}\n.rj-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 10px;\n  padding: 14px 22px 18px;\n  background: #f8fafc;\n  border-top: 1px solid #f1f5f9;\n  flex-shrink: 0;\n}\n.dark[_nghost-%COMP%]   .rj-actions[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .rj-actions[_ngcontent-%COMP%] {\n  background: rgba(0, 0, 0, 0.18);\n  border-top-color: rgba(255, 255, 255, 0.05);\n}\n.rj-btn-confirm[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 18px;\n  border: 0;\n  border-radius: 10px;\n  background:\n    linear-gradient(\n      135deg,\n      #e11d48,\n      #be123c);\n  color: #fff;\n  font-weight: 700;\n  font-size: 0.9rem;\n  cursor: pointer;\n  box-shadow: 0 4px 14px rgba(225, 29, 72, 0.35);\n  transition:\n    transform 0.12s,\n    box-shadow 0.12s,\n    opacity 0.12s;\n}\n.rj-btn-confirm[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: 0 6px 18px rgba(225, 29, 72, 0.45);\n}\n.rj-btn-confirm[_ngcontent-%COMP%]:active:not(:disabled) {\n  transform: translateY(0);\n}\n.rj-btn-confirm[_ngcontent-%COMP%]:disabled {\n  opacity: 0.45;\n  cursor: not-allowed;\n  box-shadow: none;\n}\n.rj-btn-confirm[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n/*# sourceMappingURL=client-photos.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PhotoRejectionFormComponent, { className: "PhotoRejectionFormComponent", filePath: "src\\app\\features\\client-photos\\client-photos.component.ts", lineNumber: 272 });
})();
var ClientPhotosComponent = class _ClientPhotosComponent {
  constructor(api, auth, router, dialog) {
    this.api = api;
    this.auth = auth;
    this.router = router;
    this.dialog = dialog;
    this.view = signal("regions");
    this.loading = signal(false);
    this.isCoordinadorExclusivo = signal(false);
    this.exclusiveClients = signal([]);
    this.selectedExclusiveClient = signal(null);
    this.exclusiveClientSearch = signal("");
    this.filteredExclusiveClients = computed(() => {
      const term = this.exclusiveClientSearch().trim().toLowerCase();
      if (!term)
        return this.exclusiveClients();
      return this.exclusiveClients().filter((c) => (c.cliente || "").toLowerCase().includes(term));
    });
    this.regions = signal([]);
    this.chains = signal([]);
    this.points = signal([]);
    this.visits = signal([]);
    this.selectedRegion = signal("");
    this.selectedChain = signal("");
    this.selectedPoint = signal(null);
    this.pointSearch = signal("");
    this.filteredPoints = computed(() => {
      const term = this.pointSearch().trim().toLowerCase();
      const chain = this.selectedChain().trim().toLowerCase();
      return this.points().filter((p) => {
        const pChain = (p.cadena || "").trim().toLowerCase();
        const matchChain = !chain || pChain === chain;
        const pName = (p.punto_de_interes || "").toLowerCase();
        const matchTerm = !term || pName.includes(term) || pChain.includes(term);
        return matchChain && matchTerm;
      });
    });
    this.lightboxOpen = signal(false);
    this.lightboxPhotos = signal([]);
    this.lightboxIndex = signal(0);
    this.lightboxTitle = signal("");
    this.lightboxPhoto = computed(() => this.lightboxPhotos()[this.lightboxIndex()] ?? null);
    this.isRejecting = signal(false);
    this.dashboardOpen = signal(false);
  }
  ngOnInit() {
    const u = this.auth.currentUser();
    if (u?.is_coordinador_exclusivo) {
      this.isCoordinadorExclusivo.set(true);
      this.view.set("select-client");
      this.loadExclusiveClients();
    } else {
      this.loadRegions();
    }
  }
  // ─── COORDINADOR EXCLUSIVO ───────────────────────────────────────
  currentClienteId() {
    return this.selectedExclusiveClient()?.id_cliente;
  }
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
    this.view.set("regions");
    this.regions.set([]);
    this.chains.set([]);
    this.points.set([]);
    this.visits.set([]);
    this.selectedRegion.set("");
    this.selectedChain.set("");
    this.selectedPoint.set(null);
    this.loadRegions();
  }
  changeExclusiveClient() {
    this.selectedExclusiveClient.set(null);
    this.view.set("select-client");
  }
  // ─── DATA LOADING ─────────────────────────────────────────────────
  loadRegions() {
    this.loading.set(true);
    this.api.getClientRegions(this.currentClienteId()).subscribe({
      next: (data) => {
        this.regions.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  selectRegion(region) {
    this.selectedRegion.set(region);
    this.selectedChain.set("");
    this.view.set("chains");
    this.loading.set(true);
    this.api.getClientChains(region, this.currentClienteId()).subscribe({
      next: (data) => {
        this.chains.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  selectChain(cadena) {
    this.selectedChain.set(cadena);
    this.loadPoints();
  }
  loadPoints() {
    this.view.set("points");
    this.loading.set(true);
    this.api.getClientPoints(this.selectedRegion(), this.currentClienteId()).subscribe({
      next: (data) => {
        this.points.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  selectPoint(point) {
    this.selectedPoint.set(point);
    this.view.set("photos");
    this.loading.set(true);
    this.api.getClientPointVisits(point.identificador, this.currentClienteId()).subscribe({
      next: (data) => {
        data.forEach((v) => {
          v.total_fotos = this.getAllTipos(v.fotos).reduce((acc, curr) => acc + curr.count, 0);
        });
        const conFotos = data.filter((v) => v.total_fotos > 0);
        this.visits.set(conFotos);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  // ─── NAVIGATION ───────────────────────────────────────────────────
  goBack() {
    const v = this.view();
    if (v === "photos") {
      this.loadPoints();
    } else if (v === "points") {
      this.view.set("chains");
    } else if (v === "chains") {
      this.view.set("regions");
    } else if (v === "regions" && this.isCoordinadorExclusivo()) {
      this.changeExclusiveClient();
    }
  }
  getBreadcrumb() {
    const crumbs = ["Regiones"];
    const region = this.selectedRegion();
    const chain = this.selectedChain();
    const point = this.selectedPoint();
    if (region)
      crumbs.push(region);
    if (this.view() === "points" || this.view() === "photos") {
      crumbs.push(chain || "Todos");
    }
    if (this.view() === "photos" && point) {
      crumbs.push(point.punto_de_interes);
    }
    return crumbs;
  }
  // ─── HELPERS ──────────────────────────────────────────────────────
  getRegionEmoji(region) {
    const normalized = region.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    for (const [key, emoji] of Object.entries(REGION_EMOJIS)) {
      if (normalized.includes(key))
        return emoji;
    }
    return "\u{1F4CD}";
  }
  getRegionColor(region) {
    const normalized = region.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    for (const [key, color] of Object.entries(REGION_COLORS)) {
      if (normalized.includes(key))
        return color;
    }
    return "#6366f1";
  }
  getTipoConfig(tipo) {
    return TIPO_FOTO_CONFIG[tipo] || { icon: "photo", color: "#94a3b8", gradient: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)" };
  }
  groupFotosByTipo(fotos) {
    const groups = {};
    for (const f of fotos) {
      if (!groups[f.id_tipo_foto])
        groups[f.id_tipo_foto] = [];
      groups[f.id_tipo_foto].push(f);
    }
    const TIPO_ORDER = [1, 2, 3, 4, 8, 9];
    return TIPO_ORDER.filter((t) => groups[t]).map((t) => ({ tipo: t, nombre: groups[t][0]?.tipo_nombre || "Otro", fotos: groups[t] }));
  }
  getAllTipos(fotos) {
    const ALL_TIPOS = [
      { tipo: 1, nombre: "Gesti\xF3n" },
      { tipo: 3, nombre: "Precio" },
      { tipo: 4, nombre: "Exhibiciones Adicionales" },
      { tipo: 8, nombre: "Material POP Antes" },
      { tipo: 9, nombre: "Material POP Despu\xE9s" }
    ];
    const grouped = {};
    for (const f of fotos) {
      const key = f.id_tipo_foto === 2 ? 1 : f.id_tipo_foto;
      if (!grouped[key])
        grouped[key] = [];
      grouped[key].push(f);
    }
    return ALL_TIPOS.map((t) => __spreadProps(__spreadValues({}, t), {
      count: grouped[t.tipo]?.length || 0,
      fotos: grouped[t.tipo] || []
    }));
  }
  // ─── LIGHTBOX ─────────────────────────────────────────────────────
  openLightbox(fotos, index, titulo = "") {
    if (!fotos || fotos.length === 0)
      return;
    this.lightboxPhotos.set(fotos);
    this.lightboxIndex.set(index);
    this.lightboxTitle.set(titulo);
    this.lightboxOpen.set(true);
  }
  closeLightbox() {
    this.lightboxOpen.set(false);
    this.lightboxPhotos.set([]);
    this.isRejecting.set(false);
  }
  onLightboxIndexChange(i) {
    this.lightboxIndex.set(i);
    this.isRejecting.set(false);
  }
  goToChat(visitId) {
    this.router.navigate(["/chat"], { queryParams: { visita: visitId } });
  }
  approvePhoto(foto) {
    this.api.approvePhotos([foto.id_foto]).subscribe({
      next: () => {
        foto.estado = "Aprobada";
        this.closeLightbox();
      }
    });
  }
  startRejection() {
    this.isRejecting.set(true);
  }
  submitRejection(motivo, foto) {
    this.api.rejectPhoto(foto.id_foto, motivo).subscribe({
      next: () => {
        foto.estado = "Rechazada";
        this.closeLightbox();
      }
    });
  }
  // ─── DASHBOARD ────────────────────────────────────────────────────
  toggleDashboard() {
    this.dashboardOpen.update((v) => !v);
  }
  getPointsByChain(cadena) {
    return this.filteredPoints().filter((p) => p.cadena === cadena);
  }
  static {
    this.\u0275fac = function ClientPhotosComponent_Factory(t) {
      return new (t || _ClientPhotosComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(MatDialog));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ClientPhotosComponent, selectors: [["app-client-photos"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 25, vars: 16, consts: [[1, "client-photos-container"], [1, "cp-header"], [1, "cp-header-content"], [1, "cp-title"], [1, "cp-subtitle"], [1, "cp-breadcrumb"], [1, "cp-client-banner"], [1, "cp-loading"], [3, "closed", "indexChange", "open", "photos", "startIndex", "title"], ["lightbox-sidebar", ""], ["matTooltip", "Dashboard", 1, "cp-fab", 3, "click"], [1, "cp-dashboard-panel"], [1, "cp-back-btn", 3, "click"], [1, "cp-crumbs"], [1, "cp-crumb-sep"], [1, "cp-client-banner-info"], [1, "cp-client-banner-change", 3, "click"], ["diameter", "48"], [1, "cp-section-label"], [1, "cp-client-search"], ["type", "text", "placeholder", "Buscar cliente...", 3, "ngModelChange", "ngModel"], [1, "cp-client-grid"], [1, "cp-client-card", 3, "animation-delay"], [1, "cp-empty"], [1, "cp-client-card", 3, "click"], [1, "cp-client-icon"], [1, "cp-client-name"], [1, "cp-client-tag", "cp-tag-exclusivo"], [1, "cp-client-arrow"], [1, "cp-client-tag", "cp-tag-tradex"], [1, "cp-region-grid"], [1, "cp-region-card", 3, "--region-color", "animation-delay"], [1, "cp-region-card", 3, "click"], [1, "cp-region-emoji"], [1, "cp-region-name"], [1, "cp-region-arrow"], [1, "cp-chain-list"], [1, "cp-chain-card", 2, "border-style", "dashed", "background", "rgba(99,102,241,0.03)", 3, "click"], [1, "cp-chain-icon", 2, "background", "linear-gradient(135deg, #f1f5f9, #e2e8f0)"], [2, "color", "#64748b"], [1, "cp-chain-info"], [1, "cp-chain-name"], [1, "cp-chain-hint"], [1, "cp-chain-arrow"], [1, "cp-chain-card", 3, "animation-delay"], [1, "cp-chain-card", 3, "click"], [1, "cp-chain-icon"], [1, "cp-search-bar"], [1, "cp-search-icon"], ["type", "text", 1, "cp-search-input", 3, "ngModelChange", "placeholder", "ngModel"], [2, "position", "absolute", "right", "8px", "top", "50%", "transform", "translateY(-50%)", "display", "flex", "gap", "4px"], [1, "cp-search-count"], [1, "cp-points-grid"], [1, "cp-point-card", 3, "animation-delay"], ["matTooltip", "Quitar filtro de cadena", 1, "cp-search-clear", 2, "background", "#ede9fe", "color", "#6366f1", "padding", "4px 10px", "border-radius", "8px", "font-size", "0.75rem", "font-weight", "700", "height", "32px"], [1, "cp-search-clear", 2, "height", "32px", "width", "32px", "justify-content", "center"], ["matTooltip", "Quitar filtro de cadena", 1, "cp-search-clear", 2, "background", "#ede9fe", "color", "#6366f1", "padding", "4px 10px", "border-radius", "8px", "font-size", "0.75rem", "font-weight", "700", "height", "32px", 3, "click"], [2, "font-size", "14px", "width", "14px", "height", "14px", "margin-left", "4px"], [1, "cp-search-clear", 2, "height", "32px", "width", "32px", "justify-content", "center", 3, "click"], [1, "cp-point-card", 3, "click"], [1, "cp-point-icon-wrap"], [1, "cp-point-info"], [1, "cp-point-name"], [1, "cp-point-chain"], [1, "cp-point-arrow"], [1, "cp-point-header"], [1, "cp-point-header-icon"], [1, "cp-point-header-name"], [1, "cp-point-header-detail"], ["multi", "", 1, "cp-visits-accordion"], [1, "cp-visit-panel", 3, "expanded"], [1, "cp-visit-title", 2, "display", "flex", "align-items", "center", "width", "100%"], [1, "cp-visit-icon"], [1, "cp-visit-label", 2, "flex", "1"], ["mat-stroked-button", "", "color", "primary", "matTooltip", "Abrir Chat de la visita", 2, "display", "inline-flex", "align-items", "center", "gap", "6px", "font-weight", "600", "line-height", "1", "min-width", "0", "padding", "0 12px", 3, "click"], [2, "font-size", "18px", "width", "18px", "height", "18px"], [1, "cp-visit-desc"], [1, "cp-visit-meta"], [1, "cp-tipos-grid"], [1, "cp-tipo-card", 3, "has-photos", "background"], [1, "cp-gallery"], [1, "cp-tipo-card"], [1, "cp-tipo-icon"], [1, "cp-tipo-info"], [1, "cp-tipo-name"], [1, "cp-tipo-count", 3, "color"], [1, "cp-tipo-count"], [1, "cp-tipo-empty"], [1, "cp-gallery-section"], [1, "cp-gallery-title"], [1, "cp-gallery-grid"], [1, "cp-photo-thumb"], [1, "cp-photo-thumb", 3, "click"], ["loading", "lazy", 3, "src", "alt"], [1, "cp-photo-overlay"], [2, "background", "#fff", "border-radius", "8px", "padding", ".85rem 1rem", "display", "flex", "justify-content", "space-between", "align-items", "center", "gap", "1rem", "flex-wrap", "wrap"], [2, "display", "flex", "flex-direction", "column"], [2, "font-weight", "600", "font-size", "1rem", "color", "#1e293b"], [2, "font-size", ".85rem", "color", "#64748b", "display", "flex", "gap", "8px", "align-items", "center"], [2, "background", "#e2e8f0", "color", "#475569", "padding", "2px 8px", "border-radius", "4px", "font-size", ".75rem"], [2, "display", "flex", "gap", "8px"], ["mat-stroked-button", "", "color", "warn", 3, "click"], ["mat-flat-button", "", "color", "primary", 3, "click"], [3, "foto"], [3, "cancel", "confirm", "foto"], [1, "cp-dashboard-header"], ["mat-icon-button", "", 3, "click"], [1, "cp-dashboard-body"], [1, "cp-dashboard-placeholder"]], template: function ClientPhotosComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "h1", 3);
        \u0275\u0275text(5, "\u{1F4F8} Mis Fotos");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "p", 4);
        \u0275\u0275text(7, "Explora las fotograf\xEDas de tus puntos de venta por regi\xF3n y cadena comercial.");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(8, ClientPhotosComponent_Conditional_8_Template, 8, 0, "div", 5)(9, ClientPhotosComponent_Conditional_9_Template, 12, 1, "div", 6);
        \u0275\u0275elementEnd();
        \u0275\u0275template(10, ClientPhotosComponent_Conditional_10_Template, 4, 0, "div", 7)(11, ClientPhotosComponent_Conditional_11_Template, 13, 2)(12, ClientPhotosComponent_Conditional_12_Template, 9, 1)(13, ClientPhotosComponent_Conditional_13_Template, 22, 2)(14, ClientPhotosComponent_Conditional_14_Template, 10, 5)(15, ClientPhotosComponent_Conditional_15_Template, 13, 4);
        \u0275\u0275elementStart(16, "app-photo-lightbox", 8);
        \u0275\u0275listener("closed", function ClientPhotosComponent_Template_app_photo_lightbox_closed_16_listener() {
          return ctx.closeLightbox();
        })("indexChange", function ClientPhotosComponent_Template_app_photo_lightbox_indexChange_16_listener($event) {
          return ctx.onLightboxIndexChange($event);
        });
        \u0275\u0275elementContainerStart(17);
        \u0275\u0275template(18, ClientPhotosComponent_Conditional_18_Template, 1, 1);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(19, 9);
        \u0275\u0275template(20, ClientPhotosComponent_Conditional_20_Template, 1, 1);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "button", 10);
        \u0275\u0275listener("click", function ClientPhotosComponent_Template_button_click_21_listener() {
          return ctx.toggleDashboard();
        });
        \u0275\u0275elementStart(22, "mat-icon");
        \u0275\u0275text(23);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(24, ClientPhotosComponent_Conditional_24_Template, 15, 0, "div", 11);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        let tmp_12_0;
        let tmp_13_0;
        \u0275\u0275advance(8);
        \u0275\u0275conditional(8, ctx.view() !== "regions" && ctx.view() !== "select-client" ? 8 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(9, ctx.isCoordinadorExclusivo() && ctx.selectedExclusiveClient() && ctx.view() !== "select-client" ? 9 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(10, ctx.loading() ? 10 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(11, ctx.view() === "select-client" && !ctx.loading() ? 11 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(12, ctx.view() === "regions" && !ctx.loading() ? 12 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(13, ctx.view() === "chains" && !ctx.loading() ? 13 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(14, ctx.view() === "points" && !ctx.loading() ? 14 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(15, ctx.view() === "photos" && !ctx.loading() ? 15 : -1);
        \u0275\u0275advance();
        \u0275\u0275property("open", ctx.lightboxOpen())("photos", ctx.lightboxPhotos())("startIndex", ctx.lightboxIndex())("title", ctx.lightboxTitle());
        \u0275\u0275advance(2);
        \u0275\u0275conditional(18, (tmp_12_0 = ctx.lightboxPhoto()) ? 18 : -1, tmp_12_0);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(20, (tmp_13_0 = ctx.lightboxPhoto()) ? 20 : -1, tmp_13_0);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.dashboardOpen() ? "close" : "bar_chart");
        \u0275\u0275advance();
        \u0275\u0275conditional(24, ctx.dashboardOpen() ? 24 : -1);
      }
    }, dependencies: [
      CommonModule,
      DatePipe,
      FormsModule,
      DefaultValueAccessor,
      NgControlStatus,
      NgModel,
      MatCardModule,
      MatButtonModule,
      MatButton,
      MatIconButton,
      MatIconModule,
      MatIcon,
      MatProgressSpinnerModule,
      MatProgressSpinner,
      MatExpansionModule,
      MatAccordion,
      MatExpansionPanel,
      MatExpansionPanelHeader,
      MatExpansionPanelTitle,
      MatExpansionPanelDescription,
      MatFormFieldModule,
      MatInputModule,
      MatChipsModule,
      MatTooltipModule,
      MatTooltip,
      MatDialogModule,
      PhotoLightboxComponent,
      PhotoRejectionFormComponent
    ], styles: ['@charset "UTF-8";\n\n\n\n.client-photos-container[_ngcontent-%COMP%] {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 1rem 6rem;\n  min-height: 100vh;\n  transition: all 0.3s ease;\n}\n.dark[_nghost-%COMP%]   .client-photos-container[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .client-photos-container[_ngcontent-%COMP%] {\n  background: #0b0e14;\n  color: #f8fafc;\n}\n.dark[_nghost-%COMP%]   .cp-subtitle[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-subtitle[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .cp-breadcrumb[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-breadcrumb[_ngcontent-%COMP%] {\n  background: #111827;\n  border-color: rgba(255, 255, 255, 0.08);\n}\n.dark[_nghost-%COMP%]   .cp-back-btn[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-back-btn[_ngcontent-%COMP%] {\n  background: #1f2937;\n  border-color: rgba(255, 255, 255, 0.1);\n  color: #cbd5e1;\n}\n.dark[_nghost-%COMP%]   .cp-back-btn[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .cp-back-btn[_ngcontent-%COMP%]:hover {\n  border-color: #6366f1;\n  color: #fff;\n}\n.dark[_nghost-%COMP%]   .cp-crumbs[_ngcontent-%COMP%]   span.active[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-crumbs[_ngcontent-%COMP%]   span.active[_ngcontent-%COMP%] {\n  color: #fff;\n}\n.dark[_nghost-%COMP%]   .cp-section-label[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-section-label[_ngcontent-%COMP%] {\n  color: #f1f5f9;\n}\n.dark[_nghost-%COMP%]   .cp-region-card[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-region-card[_ngcontent-%COMP%], .dark[_nghost-%COMP%]   .cp-chain-card[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-chain-card[_ngcontent-%COMP%], .dark[_nghost-%COMP%]   .cp-point-card[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-point-card[_ngcontent-%COMP%], .dark[_nghost-%COMP%]   .cp-search-input[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-search-input[_ngcontent-%COMP%], .dark[_nghost-%COMP%]   .cp-visit-panel[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-visit-panel[_ngcontent-%COMP%] {\n  background: #111827 !important;\n  border-color: rgba(255, 255, 255, 0.08) !important;\n  color: #f1f5f9 !important;\n}\n.dark[_nghost-%COMP%]   .cp-region-card[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .cp-region-card[_ngcontent-%COMP%]:hover, .dark[_nghost-%COMP%]   .cp-chain-card[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .cp-chain-card[_ngcontent-%COMP%]:hover, .dark[_nghost-%COMP%]   .cp-point-card[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .cp-point-card[_ngcontent-%COMP%]:hover, .dark[_nghost-%COMP%]   .cp-search-input[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .cp-search-input[_ngcontent-%COMP%]:hover, .dark[_nghost-%COMP%]   .cp-visit-panel[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .cp-visit-panel[_ngcontent-%COMP%]:hover {\n  border-color: #6366f1 !important;\n  background: #1f2937 !important;\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;\n}\n.dark[_nghost-%COMP%]   .cp-region-name[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-region-name[_ngcontent-%COMP%], .dark[_nghost-%COMP%]   .cp-chain-name[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-chain-name[_ngcontent-%COMP%], .dark[_nghost-%COMP%]   .cp-point-name[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-point-name[_ngcontent-%COMP%], .dark[_nghost-%COMP%]   .cp-visit-label[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-visit-label[_ngcontent-%COMP%], .dark[_nghost-%COMP%]   .cp-tipo-name[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-tipo-name[_ngcontent-%COMP%] {\n  color: #fff !important;\n}\n.dark[_nghost-%COMP%]   .cp-search-input[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-search-input[_ngcontent-%COMP%] {\n  background: #1f2937 !important;\n}\n.dark[_nghost-%COMP%]   .cp-search-input[_ngcontent-%COMP%]::placeholder, .dark   [_nghost-%COMP%]   .cp-search-input[_ngcontent-%COMP%]::placeholder {\n  color: #64748b;\n}\n.dark[_nghost-%COMP%]   .cp-point-header[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-point-header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #1e1b4b 0%,\n      #111827 100%);\n  border-color: #312e81;\n}\n.dark[_nghost-%COMP%]   .cp-point-header[_ngcontent-%COMP%]   .cp-point-header-name[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-point-header[_ngcontent-%COMP%]   .cp-point-header-name[_ngcontent-%COMP%] {\n  color: #fff;\n}\n.dark[_nghost-%COMP%]   .cp-point-header[_ngcontent-%COMP%]   .cp-point-header-detail[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-point-header[_ngcontent-%COMP%]   .cp-point-header-detail[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.dark[_nghost-%COMP%]   .cp-tipo-card.has-photos[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-tipo-card.has-photos[_ngcontent-%COMP%] {\n  border-color: rgba(255, 255, 255, 0.1);\n}\n.dark[_nghost-%COMP%]   .cp-tipo-card[_ngcontent-%COMP%]   .cp-tipo-icon[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-tipo-card[_ngcontent-%COMP%]   .cp-tipo-icon[_ngcontent-%COMP%] {\n  background: rgba(0, 0, 0, 0.2);\n}\n.dark[_nghost-%COMP%]   .cp-photo-thumb[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-photo-thumb[_ngcontent-%COMP%] {\n  border-color: rgba(255, 255, 255, 0.1);\n}\n.dark[_nghost-%COMP%]   .cp-dashboard-panel[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-dashboard-panel[_ngcontent-%COMP%] {\n  background: #111827;\n  border-color: rgba(255, 255, 255, 0.1);\n}\n.dark[_nghost-%COMP%]   .cp-dashboard-panel[_ngcontent-%COMP%]   .cp-dashboard-placeholder[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .cp-dashboard-panel[_ngcontent-%COMP%]   .cp-dashboard-placeholder[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #64748b;\n}\n.cp-header[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n.cp-header-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n}\n.cp-title[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  font-weight: 800;\n  background:\n    linear-gradient(\n      135deg,\n      #6366f1 0%,\n      #8b5cf6 50%,\n      #a855f7 100%);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n  margin: 0;\n}\n.cp-subtitle[_ngcontent-%COMP%] {\n  color: #64748b;\n  margin: 0.25rem 0 0;\n  font-size: 0.95rem;\n}\n.cp-breadcrumb[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin-top: 1rem;\n  padding: 0.75rem 1.25rem;\n  background: #f8fafc;\n  border-radius: 16px;\n  border: 1px solid #e2e8f0;\n}\n.cp-back-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  background: #fff;\n  border: 1.5px solid #e2e8f0;\n  border-radius: 12px;\n  padding: 0.45rem 1rem;\n  font-weight: 600;\n  font-size: 0.85rem;\n  color: #475569;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.cp-back-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.cp-back-btn[_ngcontent-%COMP%]:hover {\n  border-color: #6366f1;\n  color: #6366f1;\n  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);\n}\n.cp-crumbs[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  font-size: 0.85rem;\n  color: #94a3b8;\n  flex-wrap: wrap;\n}\n.cp-crumbs[_ngcontent-%COMP%]   span.active[_ngcontent-%COMP%] {\n  color: #1e293b;\n  font-weight: 700;\n}\n.cp-crumb-sep[_ngcontent-%COMP%] {\n  font-size: 16px !important;\n  width: 16px !important;\n  height: 16px !important;\n  color: #cbd5e1;\n}\n.cp-loading[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 5rem 0;\n  gap: 1rem;\n}\n.cp-loading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  font-size: 0.95rem;\n}\n.cp-section-label[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-bottom: 1.25rem;\n  font-size: 1.1rem;\n  font-weight: 700;\n  color: #334155;\n}\n.cp-section-label[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #6366f1;\n}\n.cp-empty[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 3rem;\n  color: #94a3b8;\n  grid-column: 1/-1;\n}\n.cp-empty[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 48px;\n  width: 48px;\n  height: 48px;\n  margin-bottom: 0.75rem;\n  opacity: 0.5;\n}\n.cp-empty[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.95rem;\n}\n.cp-region-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));\n  gap: 1rem;\n}\n.cp-region-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 1.25rem 1.5rem;\n  background: #fff;\n  border: 1.5px solid #e2e8f0;\n  border-radius: 20px;\n  cursor: pointer;\n  transition: all 0.25s ease;\n  animation: _ngcontent-%COMP%_fadeInUp 0.4s ease both;\n  position: relative;\n  overflow: hidden;\n}\n.cp-region-card[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 4px;\n  height: 100%;\n  background: var(--region-color, #6366f1);\n  border-radius: 20px 0 0 20px;\n  transition: width 0.3s;\n}\n.cp-region-card[_ngcontent-%COMP%]:hover {\n  border-color: var(--region-color, #6366f1);\n  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12);\n  transform: translateY(-3px);\n}\n.cp-region-card[_ngcontent-%COMP%]:hover::before {\n  width: 6px;\n}\n.cp-region-card[_ngcontent-%COMP%]:hover   .cp-region-arrow[_ngcontent-%COMP%] {\n  opacity: 1;\n  transform: translateX(0);\n  color: var(--region-color, #6366f1);\n}\n.cp-region-emoji[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  flex-shrink: 0;\n}\n.cp-region-name[_ngcontent-%COMP%] {\n  flex: 1;\n  font-weight: 700;\n  font-size: 1rem;\n  color: #1e293b;\n}\n.cp-region-arrow[_ngcontent-%COMP%] {\n  opacity: 0;\n  transform: translateX(-4px);\n  transition: all 0.2s;\n  color: #cbd5e1;\n}\n.cp-chain-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}\n.cp-chain-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 1rem 1.5rem;\n  background: #fff;\n  border: 1.5px solid #e2e8f0;\n  border-radius: 16px;\n  cursor: pointer;\n  transition: all 0.2s;\n  animation: _ngcontent-%COMP%_fadeInUp 0.3s ease both;\n}\n.cp-chain-card[_ngcontent-%COMP%]:hover {\n  border-color: #6366f1;\n  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.1);\n  transform: translateX(4px);\n}\n.cp-chain-card[_ngcontent-%COMP%]:hover   .cp-chain-arrow[_ngcontent-%COMP%] {\n  color: #6366f1;\n  transform: translateX(2px);\n}\n.cp-chain-icon[_ngcontent-%COMP%] {\n  width: 44px;\n  height: 44px;\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      135deg,\n      #e0e7ff 0%,\n      #c7d2fe 100%);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.cp-chain-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #6366f1;\n  font-size: 22px;\n}\n.cp-chain-info[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n}\n.cp-chain-name[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 1rem;\n  color: #1e293b;\n}\n.cp-chain-hint[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #94a3b8;\n  margin-top: 2px;\n}\n.cp-chain-arrow[_ngcontent-%COMP%] {\n  color: #cbd5e1;\n  transition: all 0.2s;\n}\n.cp-search-bar[_ngcontent-%COMP%] {\n  position: relative;\n  margin-bottom: 1rem;\n}\n.cp-search-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 14px;\n  top: 50%;\n  transform: translateY(-50%);\n  color: #94a3b8;\n  font-size: 20px;\n  pointer-events: none;\n}\n.cp-search-input[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 48px;\n  padding: 0 44px 0 44px;\n  border: 1.5px solid #e2e8f0;\n  border-radius: 16px;\n  background: #fff;\n  font-size: 0.95rem;\n  color: #1e293b;\n  outline: none;\n  transition: border-color 0.2s, box-shadow 0.2s;\n  font-family: inherit;\n}\n.cp-search-input[_ngcontent-%COMP%]:focus {\n  border-color: #6366f1;\n  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);\n}\n.cp-search-clear[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 8px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: none;\n  border: none;\n  cursor: pointer;\n  color: #94a3b8;\n  padding: 4px;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n}\n.cp-search-clear[_ngcontent-%COMP%]:hover {\n  color: #475569;\n  background: #f1f5f9;\n}\n.cp-search-count[_ngcontent-%COMP%] {\n  font-size: 0.82rem;\n  color: #94a3b8;\n  margin: -0.5rem 0 0.75rem 0.5rem;\n  font-weight: 500;\n}\n.cp-points-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n  gap: 0.6rem;\n}\n.cp-point-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 0.85rem 1rem;\n  background: #fff;\n  border: 1.5px solid #e9ecef;\n  border-radius: 14px;\n  cursor: pointer;\n  transition: all 0.2s;\n  animation: _ngcontent-%COMP%_fadeInUp 0.3s ease both;\n  text-align: left;\n}\n.cp-point-card[_ngcontent-%COMP%]:hover {\n  border-color: #6366f1;\n  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.12);\n  transform: translateY(-1px);\n}\n.cp-point-card[_ngcontent-%COMP%]:hover   .cp-point-name[_ngcontent-%COMP%] {\n  color: #6366f1;\n}\n.cp-point-card[_ngcontent-%COMP%]:hover   .cp-point-arrow[_ngcontent-%COMP%] {\n  color: #6366f1;\n  transform: translateX(2px);\n}\n.cp-point-icon-wrap[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 10px;\n  background:\n    linear-gradient(\n      135deg,\n      #6366f1,\n      #8b5cf6);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.cp-point-icon-wrap[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #fff;\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.cp-point-info[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n}\n.cp-point-name[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 0.88rem;\n  color: #1e293b;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  transition: color 0.15s;\n}\n.cp-point-chain[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: #94a3b8;\n  margin-top: 1px;\n}\n.cp-point-arrow[_ngcontent-%COMP%] {\n  color: #cbd5e1;\n  flex-shrink: 0;\n  font-size: 18px;\n  transition: all 0.15s;\n}\n.cp-point-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin-bottom: 1.5rem;\n  padding: 1.25rem 1.5rem;\n  background:\n    linear-gradient(\n      135deg,\n      #eef2ff 0%,\n      #e0e7ff 100%);\n  border-radius: 20px;\n  border: 1px solid #c7d2fe;\n}\n.cp-point-header-icon[_ngcontent-%COMP%] {\n  width: 52px;\n  height: 52px;\n  border-radius: 16px;\n  background:\n    linear-gradient(\n      135deg,\n      #6366f1,\n      #8b5cf6);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.cp-point-header-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #fff;\n  font-size: 28px;\n  width: 28px;\n  height: 28px;\n}\n.cp-point-header-name[_ngcontent-%COMP%] {\n  font-size: 1.3rem;\n  font-weight: 800;\n  color: #1e293b;\n  margin: 0;\n}\n.cp-point-header-detail[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  color: #64748b;\n  margin: 0.15rem 0 0;\n}\n.cp-visits-accordion[_ngcontent-%COMP%]   .cp-visit-panel[_ngcontent-%COMP%] {\n  border-radius: 20px !important;\n  margin-bottom: 1rem !important;\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04) !important;\n  border: 1.5px solid #e2e8f0;\n}\n.cp-visits-accordion[_ngcontent-%COMP%]   .cp-visit-panel[_ngcontent-%COMP%]::before {\n  display: none !important;\n}\n.cp-visits-accordion[_ngcontent-%COMP%]   .cp-visit-panel[_ngcontent-%COMP%]   .mat-expansion-panel-header[_ngcontent-%COMP%] {\n  padding: 1rem 1.5rem !important;\n}\n.cp-visit-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.cp-visit-icon[_ngcontent-%COMP%] {\n  color: #6366f1;\n  font-size: 20px;\n}\n.cp-visit-label[_ngcontent-%COMP%] {\n  font-weight: 700;\n  color: #1e293b;\n  font-size: 0.95rem;\n}\n.cp-visit-desc[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  flex-wrap: wrap;\n}\n.cp-visit-meta[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.3rem;\n  font-size: 0.82rem;\n  color: #64748b;\n}\n.cp-visit-meta[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  color: #94a3b8;\n}\n.cp-tipos-grid[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.75rem;\n  padding: 0.5rem 0 1rem;\n  overflow-x: auto;\n  scrollbar-width: none;\n}\n.cp-tipos-grid[_ngcontent-%COMP%]::-webkit-scrollbar {\n  display: none;\n}\n.cp-tipo-card[_ngcontent-%COMP%] {\n  min-width: 160px;\n  padding: 1rem 1.25rem;\n  border-radius: 16px;\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  flex-shrink: 0;\n  opacity: 0.55;\n  transition: all 0.2s;\n  border: 1.5px solid transparent;\n}\n.cp-tipo-card.has-photos[_ngcontent-%COMP%] {\n  opacity: 1;\n  border-color: rgba(0, 0, 0, 0.06);\n  cursor: pointer;\n}\n.cp-tipo-icon[_ngcontent-%COMP%] {\n  width: 42px;\n  height: 42px;\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.7);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.cp-tipo-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 22px;\n}\n.cp-tipo-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.cp-tipo-name[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 0.85rem;\n  color: #1e293b;\n}\n.cp-tipo-count[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  font-size: 0.78rem;\n  font-weight: 600;\n}\n.cp-tipo-count[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 14px;\n  width: 14px;\n  height: 14px;\n}\n.cp-tipo-empty[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  color: #94a3b8;\n}\n.cp-gallery[_ngcontent-%COMP%] {\n  margin-top: 0.5rem;\n}\n.cp-gallery-section[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n}\n.cp-gallery-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 0.95rem;\n  font-weight: 700;\n  margin: 0 0 0.75rem;\n}\n.cp-gallery-title[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n.cp-gallery-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));\n  gap: 0.75rem;\n}\n.cp-photo-thumb[_ngcontent-%COMP%] {\n  position: relative;\n  aspect-ratio: 1;\n  border-radius: 14px;\n  overflow: hidden;\n  cursor: pointer;\n  border: 2px solid #e2e8f0;\n  transition: all 0.2s;\n}\n.cp-photo-thumb[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: transform 0.3s;\n}\n.cp-photo-thumb[_ngcontent-%COMP%]:hover {\n  border-color: #6366f1;\n  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2);\n}\n.cp-photo-thumb[_ngcontent-%COMP%]:hover   img[_ngcontent-%COMP%] {\n  transform: scale(1.05);\n}\n.cp-photo-thumb[_ngcontent-%COMP%]:hover   .cp-photo-overlay[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.cp-photo-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background: rgba(99, 102, 241, 0.3);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  opacity: 0;\n  transition: opacity 0.2s;\n}\n.cp-photo-overlay[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #fff;\n  font-size: 32px;\n  width: 32px;\n  height: 32px;\n}\n.cp-lightbox[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 10000;\n  background: rgba(0, 0, 0, 0.85);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  -webkit-backdrop-filter: blur(6px);\n  backdrop-filter: blur(6px);\n  animation: _ngcontent-%COMP%_fadeIn 0.2s ease;\n}\n.cp-lightbox[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: 90vw;\n  max-height: 90vh;\n  border-radius: 12px;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);\n}\n.cp-lightbox-close[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 20px;\n  right: 20px;\n  background: rgba(255, 255, 255, 0.15);\n  border: none;\n  border-radius: 50%;\n  width: 44px;\n  height: 44px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: background 0.2s;\n}\n.cp-lightbox-close[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #fff;\n}\n.cp-lightbox-close[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.3);\n}\n.cp-fab[_ngcontent-%COMP%] {\n  position: fixed;\n  bottom: 28px;\n  right: 28px;\n  z-index: 1000;\n  width: 56px;\n  height: 56px;\n  border-radius: 18px;\n  background:\n    linear-gradient(\n      135deg,\n      #6366f1 0%,\n      #8b5cf6 100%);\n  border: none;\n  color: #fff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);\n  transition: all 0.3s;\n}\n.cp-fab[_ngcontent-%COMP%]:hover {\n  transform: translateY(-3px) scale(1.05);\n  box-shadow: 0 8px 28px rgba(99, 102, 241, 0.5);\n}\n.cp-fab[_ngcontent-%COMP%]:active {\n  transform: scale(0.95);\n}\n.cp-fab[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 26px;\n  width: 26px;\n  height: 26px;\n}\n.cp-dashboard-panel[_ngcontent-%COMP%] {\n  position: fixed;\n  bottom: 96px;\n  right: 28px;\n  z-index: 999;\n  width: 420px;\n  max-width: calc(100vw - 56px);\n  background: #fff;\n  border-radius: 24px;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);\n  border: 1px solid #e2e8f0;\n  overflow: hidden;\n  animation: _ngcontent-%COMP%_slideUpFade 0.3s ease;\n}\n.cp-dashboard-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 1rem 1.5rem;\n  background:\n    linear-gradient(\n      135deg,\n      #6366f1 0%,\n      #8b5cf6 100%);\n  color: #fff;\n}\n.cp-dashboard-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin: 0;\n  font-size: 1.1rem;\n  font-weight: 700;\n}\n.cp-dashboard-header[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.8);\n}\n.cp-dashboard-body[_ngcontent-%COMP%] {\n  padding: 2rem;\n  min-height: 250px;\n}\n.cp-dashboard-placeholder[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  color: #94a3b8;\n  min-height: 200px;\n}\n.cp-dashboard-placeholder[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 56px;\n  width: 56px;\n  height: 56px;\n  opacity: 0.3;\n  margin-bottom: 1rem;\n}\n.cp-dashboard-placeholder[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.95rem;\n}\n@keyframes _ngcontent-%COMP%_fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(12px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_slideUpFade {\n  from {\n    opacity: 0;\n    transform: translateY(16px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 768px) {\n  .cp-title[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .cp-region-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr 1fr;\n  }\n  .cp-points-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .cp-gallery-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));\n  }\n  .cp-tipos-grid[_ngcontent-%COMP%] {\n    gap: 0.5rem;\n  }\n  .cp-tipo-card[_ngcontent-%COMP%] {\n    min-width: 130px;\n    padding: 0.75rem 1rem;\n  }\n  .cp-dashboard-panel[_ngcontent-%COMP%] {\n    right: 12px;\n    bottom: 88px;\n    width: calc(100vw - 24px);\n  }\n  .cp-fab[_ngcontent-%COMP%] {\n    bottom: 20px;\n    right: 20px;\n  }\n  .cp-visit-desc[_ngcontent-%COMP%] {\n    gap: 0.5rem;\n  }\n}\n@media (max-width: 480px) {\n  .cp-region-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.cp-client-banner[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background:\n    linear-gradient(\n      135deg,\n      #dcfce7 0%,\n      #bbf7d0 100%);\n  border-left: 4px solid #16a34a;\n  padding: 0.75rem 1rem;\n  border-radius: 8px;\n  margin-top: 0.75rem;\n  font-size: 0.9rem;\n  color: #14532d;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.cp-client-banner-info[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.cp-client-banner-info[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #15803d;\n}\n.cp-client-banner-change[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n  background: #ffffff;\n  border: 1px solid #16a34a;\n  color: #15803d;\n  padding: 0.35rem 0.7rem;\n  border-radius: 6px;\n  font-size: 0.8rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: background-color 0.15s;\n}\n.cp-client-banner-change[_ngcontent-%COMP%]:hover {\n  background: #f0fdf4;\n}\n.cp-client-search[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 0.5rem 0.85rem;\n  margin: 1rem 0;\n  max-width: 480px;\n  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);\n}\n.cp-client-search[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #64748b;\n}\n.cp-client-search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  flex: 1;\n  border: none;\n  outline: none;\n  font-size: 0.95rem;\n  background: transparent;\n  color: #1e293b;\n}\n.cp-client-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n  gap: 0.85rem;\n  margin-top: 0.5rem;\n}\n.cp-client-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 1rem;\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  cursor: pointer;\n  text-align: left;\n  transition:\n    transform 0.15s,\n    box-shadow 0.15s,\n    border-color 0.15s;\n  animation: _ngcontent-%COMP%_cpClientFadeIn 0.3s ease-out both;\n  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);\n}\n.cp-client-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  border-color: #16a34a;\n  box-shadow: 0 4px 10px rgba(22, 163, 74, 0.15);\n}\n.cp-client-icon[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #dcfce7,\n      #bbf7d0);\n  color: #15803d;\n  padding: 0.5rem;\n  border-radius: 10px;\n  font-size: 1.5rem;\n  width: 1.5rem;\n  height: 1.5rem;\n}\n.cp-client-name[_ngcontent-%COMP%] {\n  flex: 1;\n  font-weight: 600;\n  font-size: 0.95rem;\n  color: #1e293b;\n}\n.cp-client-tag[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  padding: 0.2rem 0.55rem;\n  border-radius: 999px;\n  font-weight: 600;\n}\n.cp-tag-exclusivo[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #15803d;\n}\n.cp-tag-tradex[_ngcontent-%COMP%] {\n  background: #dbeafe;\n  color: #1d4ed8;\n}\n.cp-client-arrow[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  transition: transform 0.15s;\n}\n.cp-client-card[_ngcontent-%COMP%]:hover   .cp-client-arrow[_ngcontent-%COMP%] {\n  transform: translateX(3px);\n  color: #16a34a;\n}\n@keyframes _ngcontent-%COMP%_cpClientFadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(8px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=client-photos.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ClientPhotosComponent, { className: "ClientPhotosComponent", filePath: "src\\app\\features\\client-photos\\client-photos.component.ts", lineNumber: 335 });
})();
export {
  ClientPhotosComponent,
  PhotoRejectionFormComponent
};
//# sourceMappingURL=chunk-XR5CAB5Y.js.map
