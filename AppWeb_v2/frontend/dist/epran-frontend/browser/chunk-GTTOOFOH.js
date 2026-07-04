import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from "./chunk-KCFHIW3D.js";
import {
  MatInputModule
} from "./chunk-GXZEZIYO.js";
import {
  MatSnackBar,
  MatSnackBarModule
} from "./chunk-7QJW63DM.js";
import {
  MatTableModule
} from "./chunk-3L7HTECJ.js";
import {
  MatSelectModule
} from "./chunk-DD2LOOAS.js";
import {
  MatFormFieldModule
} from "./chunk-YUDUWHLJ.js";
import {
  MatTooltip,
  MatTooltipModule
} from "./chunk-PBKBS7OR.js";
import "./chunk-CELNEZAJ.js";
import "./chunk-ABO6AUNU.js";
import {
  CheckboxControlValueAccessor,
  CheckboxRequiredValidator,
  DefaultValueAccessor,
  FormBuilder,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControlStatus,
  NgControlStatusGroup,
  NgModel,
  NgSelectOption,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
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
  FocusMonitor,
  MatButtonModule,
  MatCommonModule,
  MatIcon,
  MatIconModule,
  MatRipple,
  _MatInternalFormField
} from "./chunk-KQNRR4FF.js";
import "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  ANIMATION_MODULE_TYPE,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  DatePipe,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  InputFlags,
  NgClass,
  NgIf,
  NgModule,
  Optional,
  Output,
  Subject,
  ViewChild,
  ViewEncapsulation$1,
  __spreadProps,
  __spreadValues,
  booleanAttribute,
  debounceTime,
  distinctUntilChanged,
  forwardRef,
  numberAttribute,
  of,
  setClassMetadata,
  signal,
  switchMap,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵInputTransformsFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
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
  ɵɵhostProperty,
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
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
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

// node_modules/@angular/material/fesm2022/slide-toggle.mjs
var _c0 = ["switch"];
var _c1 = ["*"];
function MatSlideToggle_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 12);
    \u0275\u0275element(2, "path", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "svg", 14);
    \u0275\u0275element(4, "path", 15);
    \u0275\u0275elementEnd()();
  }
}
var MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS = new InjectionToken("mat-slide-toggle-default-options", {
  providedIn: "root",
  factory: () => ({
    disableToggleValue: false,
    hideIcon: false
  })
});
var MAT_SLIDE_TOGGLE_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MatSlideToggle),
  multi: true
};
var MatSlideToggleChange = class {
  constructor(source, checked) {
    this.source = source;
    this.checked = checked;
  }
};
var nextUniqueId = 0;
var MatSlideToggle = class _MatSlideToggle {
  _createChangeEvent(isChecked) {
    return new MatSlideToggleChange(this, isChecked);
  }
  /** Returns the unique id for the visual hidden button. */
  get buttonId() {
    return `${this.id || this._uniqueId}-button`;
  }
  /** Focuses the slide-toggle. */
  focus() {
    this._switchElement.nativeElement.focus();
  }
  /** Whether the slide-toggle element is checked or not. */
  get checked() {
    return this._checked;
  }
  set checked(value) {
    this._checked = value;
    this._changeDetectorRef.markForCheck();
  }
  /** Returns the unique id for the visual hidden input. */
  get inputId() {
    return `${this.id || this._uniqueId}-input`;
  }
  constructor(_elementRef, _focusMonitor, _changeDetectorRef, tabIndex, defaults, animationMode) {
    this._elementRef = _elementRef;
    this._focusMonitor = _focusMonitor;
    this._changeDetectorRef = _changeDetectorRef;
    this.defaults = defaults;
    this._onChange = (_) => {
    };
    this._onTouched = () => {
    };
    this._validatorOnChange = () => {
    };
    this._checked = false;
    this.name = null;
    this.labelPosition = "after";
    this.ariaLabel = null;
    this.ariaLabelledby = null;
    this.disabled = false;
    this.disableRipple = false;
    this.tabIndex = 0;
    this.change = new EventEmitter();
    this.toggleChange = new EventEmitter();
    this.tabIndex = parseInt(tabIndex) || 0;
    this.color = defaults.color || "accent";
    this._noopAnimations = animationMode === "NoopAnimations";
    this.id = this._uniqueId = `mat-mdc-slide-toggle-${++nextUniqueId}`;
    this.hideIcon = defaults.hideIcon ?? false;
    this._labelId = this._uniqueId + "-label";
  }
  ngAfterContentInit() {
    this._focusMonitor.monitor(this._elementRef, true).subscribe((focusOrigin) => {
      if (focusOrigin === "keyboard" || focusOrigin === "program") {
        this._focused = true;
        this._changeDetectorRef.markForCheck();
      } else if (!focusOrigin) {
        Promise.resolve().then(() => {
          this._focused = false;
          this._onTouched();
          this._changeDetectorRef.markForCheck();
        });
      }
    });
  }
  ngOnChanges(changes) {
    if (changes["required"]) {
      this._validatorOnChange();
    }
  }
  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }
  /** Implemented as part of ControlValueAccessor. */
  writeValue(value) {
    this.checked = !!value;
  }
  /** Implemented as part of ControlValueAccessor. */
  registerOnChange(fn) {
    this._onChange = fn;
  }
  /** Implemented as part of ControlValueAccessor. */
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  /** Implemented as a part of Validator. */
  validate(control) {
    return this.required && control.value !== true ? {
      "required": true
    } : null;
  }
  /** Implemented as a part of Validator. */
  registerOnValidatorChange(fn) {
    this._validatorOnChange = fn;
  }
  /** Implemented as a part of ControlValueAccessor. */
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
  }
  /** Toggles the checked state of the slide-toggle. */
  toggle() {
    this.checked = !this.checked;
    this._onChange(this.checked);
  }
  /**
   * Emits a change event on the `change` output. Also notifies the FormControl about the change.
   */
  _emitChangeEvent() {
    this._onChange(this.checked);
    this.change.emit(this._createChangeEvent(this.checked));
  }
  /** Method being called whenever the underlying button is clicked. */
  _handleClick() {
    this.toggleChange.emit();
    if (!this.defaults.disableToggleValue) {
      this.checked = !this.checked;
      this._onChange(this.checked);
      this.change.emit(new MatSlideToggleChange(this, this.checked));
    }
  }
  _getAriaLabelledBy() {
    if (this.ariaLabelledby) {
      return this.ariaLabelledby;
    }
    return this.ariaLabel ? null : this._labelId;
  }
  static {
    this.\u0275fac = function MatSlideToggle_Factory(t) {
      return new (t || _MatSlideToggle)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(FocusMonitor), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275injectAttribute("tabindex"), \u0275\u0275directiveInject(MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS), \u0275\u0275directiveInject(ANIMATION_MODULE_TYPE, 8));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _MatSlideToggle,
      selectors: [["mat-slide-toggle"]],
      viewQuery: function MatSlideToggle_Query(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275viewQuery(_c0, 5);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._switchElement = _t.first);
        }
      },
      hostAttrs: [1, "mat-mdc-slide-toggle"],
      hostVars: 13,
      hostBindings: function MatSlideToggle_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275hostProperty("id", ctx.id);
          \u0275\u0275attribute("tabindex", null)("aria-label", null)("name", null)("aria-labelledby", null);
          \u0275\u0275classMap(ctx.color ? "mat-" + ctx.color : "");
          \u0275\u0275classProp("mat-mdc-slide-toggle-focused", ctx._focused)("mat-mdc-slide-toggle-checked", ctx.checked)("_mat-animation-noopable", ctx._noopAnimations);
        }
      },
      inputs: {
        name: "name",
        id: "id",
        labelPosition: "labelPosition",
        ariaLabel: [InputFlags.None, "aria-label", "ariaLabel"],
        ariaLabelledby: [InputFlags.None, "aria-labelledby", "ariaLabelledby"],
        ariaDescribedby: [InputFlags.None, "aria-describedby", "ariaDescribedby"],
        required: [InputFlags.HasDecoratorInputTransform, "required", "required", booleanAttribute],
        color: "color",
        disabled: [InputFlags.HasDecoratorInputTransform, "disabled", "disabled", booleanAttribute],
        disableRipple: [InputFlags.HasDecoratorInputTransform, "disableRipple", "disableRipple", booleanAttribute],
        tabIndex: [InputFlags.HasDecoratorInputTransform, "tabIndex", "tabIndex", (value) => value == null ? 0 : numberAttribute(value)],
        checked: [InputFlags.HasDecoratorInputTransform, "checked", "checked", booleanAttribute],
        hideIcon: [InputFlags.HasDecoratorInputTransform, "hideIcon", "hideIcon", booleanAttribute]
      },
      outputs: {
        change: "change",
        toggleChange: "toggleChange"
      },
      exportAs: ["matSlideToggle"],
      standalone: true,
      features: [\u0275\u0275ProvidersFeature([MAT_SLIDE_TOGGLE_VALUE_ACCESSOR, {
        provide: NG_VALIDATORS,
        useExisting: _MatSlideToggle,
        multi: true
      }]), \u0275\u0275InputTransformsFeature, \u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature],
      ngContentSelectors: _c1,
      decls: 13,
      vars: 24,
      consts: [["switch", ""], ["mat-internal-form-field", "", 3, "labelPosition"], ["role", "switch", "type", "button", 1, "mdc-switch", 3, "click", "tabIndex", "disabled"], [1, "mdc-switch__track"], [1, "mdc-switch__handle-track"], [1, "mdc-switch__handle"], [1, "mdc-switch__shadow"], [1, "mdc-elevation-overlay"], [1, "mdc-switch__ripple"], ["mat-ripple", "", 1, "mat-mdc-slide-toggle-ripple", "mat-mdc-focus-indicator", 3, "matRippleTrigger", "matRippleDisabled", "matRippleCentered"], [1, "mdc-switch__icons"], [1, "mdc-label", 3, "click", "for"], ["viewBox", "0 0 24 24", "aria-hidden", "true", 1, "mdc-switch__icon", "mdc-switch__icon--on"], ["d", "M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z"], ["viewBox", "0 0 24 24", "aria-hidden", "true", 1, "mdc-switch__icon", "mdc-switch__icon--off"], ["d", "M20 13H4v-2h16v2z"]],
      template: function MatSlideToggle_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = \u0275\u0275getCurrentView();
          \u0275\u0275projectionDef();
          \u0275\u0275elementStart(0, "div", 1)(1, "button", 2, 0);
          \u0275\u0275listener("click", function MatSlideToggle_Template_button_click_1_listener() {
            \u0275\u0275restoreView(_r1);
            return \u0275\u0275resetView(ctx._handleClick());
          });
          \u0275\u0275element(3, "div", 3);
          \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6);
          \u0275\u0275element(7, "div", 7);
          \u0275\u0275elementEnd();
          \u0275\u0275elementStart(8, "div", 8);
          \u0275\u0275element(9, "div", 9);
          \u0275\u0275elementEnd();
          \u0275\u0275template(10, MatSlideToggle_Conditional_10_Template, 5, 0, "div", 10);
          \u0275\u0275elementEnd()()();
          \u0275\u0275elementStart(11, "label", 11);
          \u0275\u0275listener("click", function MatSlideToggle_Template_label_click_11_listener($event) {
            \u0275\u0275restoreView(_r1);
            return \u0275\u0275resetView($event.stopPropagation());
          });
          \u0275\u0275projection(12);
          \u0275\u0275elementEnd()();
        }
        if (rf & 2) {
          const switch_r2 = \u0275\u0275reference(2);
          \u0275\u0275property("labelPosition", ctx.labelPosition);
          \u0275\u0275advance();
          \u0275\u0275classProp("mdc-switch--selected", ctx.checked)("mdc-switch--unselected", !ctx.checked)("mdc-switch--checked", ctx.checked)("mdc-switch--disabled", ctx.disabled);
          \u0275\u0275property("tabIndex", ctx.disabled ? -1 : ctx.tabIndex)("disabled", ctx.disabled);
          \u0275\u0275attribute("id", ctx.buttonId)("name", ctx.name)("aria-label", ctx.ariaLabel)("aria-labelledby", ctx._getAriaLabelledBy())("aria-describedby", ctx.ariaDescribedby)("aria-required", ctx.required || null)("aria-checked", ctx.checked);
          \u0275\u0275advance(8);
          \u0275\u0275property("matRippleTrigger", switch_r2)("matRippleDisabled", ctx.disableRipple || ctx.disabled)("matRippleCentered", true);
          \u0275\u0275advance();
          \u0275\u0275conditional(10, !ctx.hideIcon ? 10 : -1);
          \u0275\u0275advance();
          \u0275\u0275property("for", ctx.buttonId);
          \u0275\u0275attribute("id", ctx._labelId);
        }
      },
      dependencies: [MatRipple, _MatInternalFormField],
      styles: ['.mdc-elevation-overlay{position:absolute;border-radius:inherit;pointer-events:none;opacity:var(--mdc-elevation-overlay-opacity);transition:opacity 280ms cubic-bezier(0.4, 0, 0.2, 1);background-color:var(--mdc-elevation-overlay-color)}.mdc-switch{align-items:center;background:none;border:none;cursor:pointer;display:inline-flex;flex-shrink:0;margin:0;outline:none;overflow:visible;padding:0;position:relative}.mdc-switch[hidden]{display:none}.mdc-switch:disabled{cursor:default;pointer-events:none}.mdc-switch__track{overflow:hidden;position:relative;width:100%}.mdc-switch__track::before,.mdc-switch__track::after{border:1px solid rgba(0,0,0,0);border-radius:inherit;box-sizing:border-box;content:"";height:100%;left:0;position:absolute;width:100%}@media screen and (forced-colors: active){.mdc-switch__track::before,.mdc-switch__track::after{border-color:currentColor}}.mdc-switch__track::before{transition:transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:translateX(0)}.mdc-switch__track::after{transition:transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1);transform:translateX(-100%)}[dir=rtl] .mdc-switch__track::after,.mdc-switch__track[dir=rtl]::after{transform:translateX(100%)}.mdc-switch--selected .mdc-switch__track::before{transition:transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1);transform:translateX(100%)}[dir=rtl] .mdc-switch--selected .mdc-switch__track::before,.mdc-switch--selected .mdc-switch__track[dir=rtl]::before{transform:translateX(-100%)}.mdc-switch--selected .mdc-switch__track::after{transition:transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:translateX(0)}.mdc-switch__handle-track{height:100%;pointer-events:none;position:absolute;top:0;transition:transform 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);left:0;right:auto;transform:translateX(0)}[dir=rtl] .mdc-switch__handle-track,.mdc-switch__handle-track[dir=rtl]{left:auto;right:0}.mdc-switch--selected .mdc-switch__handle-track{transform:translateX(100%)}[dir=rtl] .mdc-switch--selected .mdc-switch__handle-track,.mdc-switch--selected .mdc-switch__handle-track[dir=rtl]{transform:translateX(-100%)}.mdc-switch__handle{display:flex;pointer-events:auto;position:absolute;top:50%;transform:translateY(-50%);left:0;right:auto}[dir=rtl] .mdc-switch__handle,.mdc-switch__handle[dir=rtl]{left:auto;right:0}.mdc-switch__handle::before,.mdc-switch__handle::after{border:1px solid rgba(0,0,0,0);border-radius:inherit;box-sizing:border-box;content:"";width:100%;height:100%;left:0;position:absolute;top:0;transition:background-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1),border-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);z-index:-1}@media screen and (forced-colors: active){.mdc-switch__handle::before,.mdc-switch__handle::after{border-color:currentColor}}.mdc-switch__shadow{border-radius:inherit;bottom:0;left:0;position:absolute;right:0;top:0}.mdc-elevation-overlay{bottom:0;left:0;right:0;top:0}.mdc-switch__ripple{left:50%;position:absolute;top:50%;transform:translate(-50%, -50%);z-index:-1}.mdc-switch:disabled .mdc-switch__ripple{display:none}.mdc-switch__icons{height:100%;position:relative;width:100%;z-index:1}.mdc-switch__icon{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0;opacity:0;transition:opacity 30ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mdc-switch--selected .mdc-switch__icon--on,.mdc-switch--unselected .mdc-switch__icon--off{opacity:1;transition:opacity 45ms 30ms cubic-bezier(0, 0, 0.2, 1)}.mat-mdc-slide-toggle .mdc-switch--disabled+label{color:var(--mdc-switch-disabled-label-text-color)}.mdc-switch{width:var(--mdc-switch-track-width)}.mdc-switch.mdc-switch--selected:enabled .mdc-switch__handle::after{background:var(--mdc-switch-selected-handle-color)}.mdc-switch.mdc-switch--selected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after{background:var(--mdc-switch-selected-hover-handle-color)}.mdc-switch.mdc-switch--selected:enabled:focus:not(:active) .mdc-switch__handle::after{background:var(--mdc-switch-selected-focus-handle-color)}.mdc-switch.mdc-switch--selected:enabled:active .mdc-switch__handle::after{background:var(--mdc-switch-selected-pressed-handle-color)}.mdc-switch.mdc-switch--selected:disabled .mdc-switch__handle::after{background:var(--mdc-switch-disabled-selected-handle-color)}.mdc-switch.mdc-switch--unselected:enabled .mdc-switch__handle::after{background:var(--mdc-switch-unselected-handle-color)}.mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after{background:var(--mdc-switch-unselected-hover-handle-color)}.mdc-switch.mdc-switch--unselected:enabled:focus:not(:active) .mdc-switch__handle::after{background:var(--mdc-switch-unselected-focus-handle-color)}.mdc-switch.mdc-switch--unselected:enabled:active .mdc-switch__handle::after{background:var(--mdc-switch-unselected-pressed-handle-color)}.mdc-switch.mdc-switch--unselected:disabled .mdc-switch__handle::after{background:var(--mdc-switch-disabled-unselected-handle-color)}.mdc-switch .mdc-switch__handle::before{background:var(--mdc-switch-handle-surface-color)}.mdc-switch:enabled .mdc-switch__shadow{box-shadow:var(--mdc-switch-handle-elevation)}.mdc-switch:disabled .mdc-switch__shadow{box-shadow:var(--mdc-switch-disabled-handle-elevation)}.mdc-switch .mdc-switch__focus-ring-wrapper,.mdc-switch .mdc-switch__handle{height:var(--mdc-switch-handle-height)}.mdc-switch .mdc-switch__handle{border-radius:var(--mdc-switch-handle-shape)}.mdc-switch .mdc-switch__handle{width:var(--mdc-switch-handle-width)}.mdc-switch .mdc-switch__handle-track{width:calc(100% - var(--mdc-switch-handle-width))}.mdc-switch.mdc-switch--selected:enabled .mdc-switch__icon{fill:var(--mdc-switch-selected-icon-color)}.mdc-switch.mdc-switch--selected:disabled .mdc-switch__icon{fill:var(--mdc-switch-disabled-selected-icon-color)}.mdc-switch.mdc-switch--unselected:enabled .mdc-switch__icon{fill:var(--mdc-switch-unselected-icon-color)}.mdc-switch.mdc-switch--unselected:disabled .mdc-switch__icon{fill:var(--mdc-switch-disabled-unselected-icon-color)}.mdc-switch.mdc-switch--selected:disabled .mdc-switch__icons{opacity:var(--mdc-switch-disabled-selected-icon-opacity)}.mdc-switch.mdc-switch--unselected:disabled .mdc-switch__icons{opacity:var(--mdc-switch-disabled-unselected-icon-opacity)}.mdc-switch.mdc-switch--selected .mdc-switch__icon{width:var(--mdc-switch-selected-icon-size);height:var(--mdc-switch-selected-icon-size)}.mdc-switch.mdc-switch--unselected .mdc-switch__icon{width:var(--mdc-switch-unselected-icon-size);height:var(--mdc-switch-unselected-icon-size)}.mdc-switch.mdc-switch--selected:enabled:hover:not(:focus) .mdc-switch__ripple::before,.mdc-switch.mdc-switch--selected:enabled:hover:not(:focus) .mdc-switch__ripple::after{background-color:var(--mdc-switch-selected-hover-state-layer-color)}.mdc-switch.mdc-switch--selected:enabled:focus .mdc-switch__ripple::before,.mdc-switch.mdc-switch--selected:enabled:focus .mdc-switch__ripple::after{background-color:var(--mdc-switch-selected-focus-state-layer-color)}.mdc-switch.mdc-switch--selected:enabled:active .mdc-switch__ripple::before,.mdc-switch.mdc-switch--selected:enabled:active .mdc-switch__ripple::after{background-color:var(--mdc-switch-selected-pressed-state-layer-color)}.mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus) .mdc-switch__ripple::before,.mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus) .mdc-switch__ripple::after{background-color:var(--mdc-switch-unselected-hover-state-layer-color)}.mdc-switch.mdc-switch--unselected:enabled:focus .mdc-switch__ripple::before,.mdc-switch.mdc-switch--unselected:enabled:focus .mdc-switch__ripple::after{background-color:var(--mdc-switch-unselected-focus-state-layer-color)}.mdc-switch.mdc-switch--unselected:enabled:active .mdc-switch__ripple::before,.mdc-switch.mdc-switch--unselected:enabled:active .mdc-switch__ripple::after{background-color:var(--mdc-switch-unselected-pressed-state-layer-color)}.mdc-switch.mdc-switch--selected:enabled:hover:not(:focus):hover .mdc-switch__ripple::before,.mdc-switch.mdc-switch--selected:enabled:hover:not(:focus).mdc-ripple-surface--hover .mdc-switch__ripple::before{opacity:var(--mdc-switch-selected-hover-state-layer-opacity)}.mdc-switch.mdc-switch--selected:enabled:focus.mdc-ripple-upgraded--background-focused .mdc-switch__ripple::before,.mdc-switch.mdc-switch--selected:enabled:focus:not(.mdc-ripple-upgraded):focus .mdc-switch__ripple::before{transition-duration:75ms;opacity:var(--mdc-switch-selected-focus-state-layer-opacity)}.mdc-switch.mdc-switch--selected:enabled:active:not(.mdc-ripple-upgraded) .mdc-switch__ripple::after{transition:opacity 150ms linear}.mdc-switch.mdc-switch--selected:enabled:active:not(.mdc-ripple-upgraded):active .mdc-switch__ripple::after{transition-duration:75ms;opacity:var(--mdc-switch-selected-pressed-state-layer-opacity)}.mdc-switch.mdc-switch--selected:enabled:active.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-switch-selected-pressed-state-layer-opacity)}.mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus):hover .mdc-switch__ripple::before,.mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus).mdc-ripple-surface--hover .mdc-switch__ripple::before{opacity:var(--mdc-switch-unselected-hover-state-layer-opacity)}.mdc-switch.mdc-switch--unselected:enabled:focus.mdc-ripple-upgraded--background-focused .mdc-switch__ripple::before,.mdc-switch.mdc-switch--unselected:enabled:focus:not(.mdc-ripple-upgraded):focus .mdc-switch__ripple::before{transition-duration:75ms;opacity:var(--mdc-switch-unselected-focus-state-layer-opacity)}.mdc-switch.mdc-switch--unselected:enabled:active:not(.mdc-ripple-upgraded) .mdc-switch__ripple::after{transition:opacity 150ms linear}.mdc-switch.mdc-switch--unselected:enabled:active:not(.mdc-ripple-upgraded):active .mdc-switch__ripple::after{transition-duration:75ms;opacity:var(--mdc-switch-unselected-pressed-state-layer-opacity)}.mdc-switch.mdc-switch--unselected:enabled:active.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-switch-unselected-pressed-state-layer-opacity)}.mdc-switch .mdc-switch__ripple{height:var(--mdc-switch-state-layer-size);width:var(--mdc-switch-state-layer-size)}.mdc-switch .mdc-switch__track{height:var(--mdc-switch-track-height)}.mdc-switch:disabled .mdc-switch__track{opacity:var(--mdc-switch-disabled-track-opacity)}.mdc-switch:enabled .mdc-switch__track::after{background:var(--mdc-switch-selected-track-color)}.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::after{background:var(--mdc-switch-selected-hover-track-color)}.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::after{background:var(--mdc-switch-selected-focus-track-color)}.mdc-switch:enabled:active .mdc-switch__track::after{background:var(--mdc-switch-selected-pressed-track-color)}.mdc-switch:disabled .mdc-switch__track::after{background:var(--mdc-switch-disabled-selected-track-color)}.mdc-switch:enabled .mdc-switch__track::before{background:var(--mdc-switch-unselected-track-color)}.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::before{background:var(--mdc-switch-unselected-hover-track-color)}.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::before{background:var(--mdc-switch-unselected-focus-track-color)}.mdc-switch:enabled:active .mdc-switch__track::before{background:var(--mdc-switch-unselected-pressed-track-color)}.mdc-switch:disabled .mdc-switch__track::before{background:var(--mdc-switch-disabled-unselected-track-color)}.mdc-switch .mdc-switch__track{border-radius:var(--mdc-switch-track-shape)}.mdc-switch:enabled .mdc-switch__shadow{box-shadow:var(--mdc-switch-handle-elevation-shadow)}.mdc-switch:disabled .mdc-switch__shadow{box-shadow:var(--mdc-switch-disabled-handle-elevation-shadow)}.mat-mdc-slide-toggle{display:inline-block;-webkit-tap-highlight-color:rgba(0,0,0,0);outline:0}.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple,.mat-mdc-slide-toggle .mdc-switch__ripple::after{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:50%;pointer-events:none}.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple:not(:empty),.mat-mdc-slide-toggle .mdc-switch__ripple::after:not(:empty){transform:translateZ(0)}.mat-mdc-slide-toggle .mdc-switch__ripple::after{content:"";opacity:0}.mat-mdc-slide-toggle .mdc-switch:hover .mdc-switch__ripple::after{opacity:.04;transition:opacity 75ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mat-mdc-slide-toggle.mat-mdc-slide-toggle-focused .mdc-switch .mdc-switch__ripple::after{opacity:.12}.mat-mdc-slide-toggle.mat-mdc-slide-toggle-focused .mat-mdc-focus-indicator::before{content:""}.mat-mdc-slide-toggle .mat-ripple-element{opacity:.12}.mat-mdc-slide-toggle .mat-mdc-focus-indicator::before{border-radius:50%}.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle-track,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-elevation-overlay,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__icon,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::before,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::after,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::before,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::after{transition:none}.mat-mdc-slide-toggle .mdc-switch:enabled+.mdc-label{cursor:pointer}.mdc-switch__handle{transition:width 75ms cubic-bezier(0.4, 0, 0.2, 1),height 75ms cubic-bezier(0.4, 0, 0.2, 1),margin 75ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-switch--selected .mdc-switch__track::before{opacity:var(--mat-switch-hidden-track-opacity);transition:var(--mat-switch-hidden-track-transition)}.mdc-switch--selected .mdc-switch__track::after{opacity:var(--mat-switch-visible-track-opacity);transition:var(--mat-switch-visible-track-transition)}.mdc-switch--unselected .mdc-switch__track::before{opacity:var(--mat-switch-visible-track-opacity);transition:var(--mat-switch-visible-track-transition)}.mdc-switch--unselected .mdc-switch__track::after{opacity:var(--mat-switch-hidden-track-opacity);transition:var(--mat-switch-hidden-track-transition)}.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle{width:var(--mat-switch-unselected-handle-size);height:var(--mat-switch-unselected-handle-size)}.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle{width:var(--mat-switch-selected-handle-size);height:var(--mat-switch-selected-handle-size)}.mat-mdc-slide-toggle .mdc-switch__handle:has(.mdc-switch__icons){width:var(--mat-switch-with-icon-handle-size);height:var(--mat-switch-with-icon-handle-size)}.mat-mdc-slide-toggle:active .mdc-switch:not(.mdc-switch--disabled) .mdc-switch__handle{width:var(--mat-switch-pressed-handle-size);height:var(--mat-switch-pressed-handle-size)}.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle{margin:var(--mat-switch-selected-handle-horizontal-margin)}.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle:has(.mdc-switch__icons){margin:var(--mat-switch-selected-with-icon-handle-horizontal-margin)}.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle{margin:var(--mat-switch-unselected-handle-horizontal-margin)}.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle:has(.mdc-switch__icons){margin:var(--mat-switch-unselected-with-icon-handle-horizontal-margin)}.mat-mdc-slide-toggle:active .mdc-switch--selected:not(.mdc-switch--disabled) .mdc-switch__handle{margin:var(--mat-switch-selected-pressed-handle-horizontal-margin)}.mat-mdc-slide-toggle:active .mdc-switch--unselected:not(.mdc-switch--disabled) .mdc-switch__handle{margin:var(--mat-switch-unselected-pressed-handle-horizontal-margin)}.mdc-switch__track::after,.mdc-switch__track::before{border-width:var(--mat-switch-track-outline-width);border-color:var(--mat-switch-track-outline-color)}.mdc-switch--selected .mdc-switch__track::after,.mdc-switch--selected .mdc-switch__track::before{border-width:var(--mat-switch-selected-track-outline-width)}.mdc-switch--disabled .mdc-switch__track::after,.mdc-switch--disabled .mdc-switch__track::before{border-width:var(--mat-switch-disabled-unselected-track-outline-width);border-color:var(--mat-switch-disabled-unselected-track-outline-color)}.mdc-switch--disabled.mdc-switch--selected .mdc-switch__handle::after{opacity:var(--mat-switch-disabled-selected-handle-opacity)}.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__handle::after{opacity:var(--mat-switch-disabled-unselected-handle-opacity)}'],
      encapsulation: 2,
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSlideToggle, [{
    type: Component,
    args: [{
      selector: "mat-slide-toggle",
      host: {
        "class": "mat-mdc-slide-toggle",
        "[id]": "id",
        // Needs to be removed since it causes some a11y issues (see #21266).
        "[attr.tabindex]": "null",
        "[attr.aria-label]": "null",
        "[attr.name]": "null",
        "[attr.aria-labelledby]": "null",
        "[class.mat-mdc-slide-toggle-focused]": "_focused",
        "[class.mat-mdc-slide-toggle-checked]": "checked",
        "[class._mat-animation-noopable]": "_noopAnimations",
        "[class]": 'color ? "mat-" + color : ""'
      },
      exportAs: "matSlideToggle",
      encapsulation: ViewEncapsulation$1.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [MAT_SLIDE_TOGGLE_VALUE_ACCESSOR, {
        provide: NG_VALIDATORS,
        useExisting: MatSlideToggle,
        multi: true
      }],
      standalone: true,
      imports: [MatRipple, _MatInternalFormField],
      template: `<div mat-internal-form-field [labelPosition]="labelPosition">
  <button
    class="mdc-switch"
    role="switch"
    type="button"
    [class.mdc-switch--selected]="checked"
    [class.mdc-switch--unselected]="!checked"
    [class.mdc-switch--checked]="checked"
    [class.mdc-switch--disabled]="disabled"
    [tabIndex]="disabled ? -1 : tabIndex"
    [disabled]="disabled"
    [attr.id]="buttonId"
    [attr.name]="name"
    [attr.aria-label]="ariaLabel"
    [attr.aria-labelledby]="_getAriaLabelledBy()"
    [attr.aria-describedby]="ariaDescribedby"
    [attr.aria-required]="required || null"
    [attr.aria-checked]="checked"
    (click)="_handleClick()"
    #switch>
    <div class="mdc-switch__track"></div>
    <div class="mdc-switch__handle-track">
      <div class="mdc-switch__handle">
        <div class="mdc-switch__shadow">
          <div class="mdc-elevation-overlay"></div>
        </div>
        <div class="mdc-switch__ripple">
          <div class="mat-mdc-slide-toggle-ripple mat-mdc-focus-indicator" mat-ripple
            [matRippleTrigger]="switch"
            [matRippleDisabled]="disableRipple || disabled"
            [matRippleCentered]="true"></div>
        </div>
        @if (!hideIcon) {
          <div class="mdc-switch__icons">
            <svg
              class="mdc-switch__icon mdc-switch__icon--on"
              viewBox="0 0 24 24"
              aria-hidden="true">
              <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" />
            </svg>
            <svg
              class="mdc-switch__icon mdc-switch__icon--off"
              viewBox="0 0 24 24"
              aria-hidden="true">
              <path d="M20 13H4v-2h16v2z" />
            </svg>
          </div>
        }
      </div>
    </div>
  </button>

  <!--
    Clicking on the label will trigger another click event from the button.
    Stop propagation here so other listeners further up in the DOM don't execute twice.
  -->
  <label class="mdc-label" [for]="buttonId" [attr.id]="_labelId" (click)="$event.stopPropagation()">
    <ng-content></ng-content>
  </label>
</div>
`,
      styles: ['.mdc-elevation-overlay{position:absolute;border-radius:inherit;pointer-events:none;opacity:var(--mdc-elevation-overlay-opacity);transition:opacity 280ms cubic-bezier(0.4, 0, 0.2, 1);background-color:var(--mdc-elevation-overlay-color)}.mdc-switch{align-items:center;background:none;border:none;cursor:pointer;display:inline-flex;flex-shrink:0;margin:0;outline:none;overflow:visible;padding:0;position:relative}.mdc-switch[hidden]{display:none}.mdc-switch:disabled{cursor:default;pointer-events:none}.mdc-switch__track{overflow:hidden;position:relative;width:100%}.mdc-switch__track::before,.mdc-switch__track::after{border:1px solid rgba(0,0,0,0);border-radius:inherit;box-sizing:border-box;content:"";height:100%;left:0;position:absolute;width:100%}@media screen and (forced-colors: active){.mdc-switch__track::before,.mdc-switch__track::after{border-color:currentColor}}.mdc-switch__track::before{transition:transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:translateX(0)}.mdc-switch__track::after{transition:transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1);transform:translateX(-100%)}[dir=rtl] .mdc-switch__track::after,.mdc-switch__track[dir=rtl]::after{transform:translateX(100%)}.mdc-switch--selected .mdc-switch__track::before{transition:transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1);transform:translateX(100%)}[dir=rtl] .mdc-switch--selected .mdc-switch__track::before,.mdc-switch--selected .mdc-switch__track[dir=rtl]::before{transform:translateX(-100%)}.mdc-switch--selected .mdc-switch__track::after{transition:transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:translateX(0)}.mdc-switch__handle-track{height:100%;pointer-events:none;position:absolute;top:0;transition:transform 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);left:0;right:auto;transform:translateX(0)}[dir=rtl] .mdc-switch__handle-track,.mdc-switch__handle-track[dir=rtl]{left:auto;right:0}.mdc-switch--selected .mdc-switch__handle-track{transform:translateX(100%)}[dir=rtl] .mdc-switch--selected .mdc-switch__handle-track,.mdc-switch--selected .mdc-switch__handle-track[dir=rtl]{transform:translateX(-100%)}.mdc-switch__handle{display:flex;pointer-events:auto;position:absolute;top:50%;transform:translateY(-50%);left:0;right:auto}[dir=rtl] .mdc-switch__handle,.mdc-switch__handle[dir=rtl]{left:auto;right:0}.mdc-switch__handle::before,.mdc-switch__handle::after{border:1px solid rgba(0,0,0,0);border-radius:inherit;box-sizing:border-box;content:"";width:100%;height:100%;left:0;position:absolute;top:0;transition:background-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1),border-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);z-index:-1}@media screen and (forced-colors: active){.mdc-switch__handle::before,.mdc-switch__handle::after{border-color:currentColor}}.mdc-switch__shadow{border-radius:inherit;bottom:0;left:0;position:absolute;right:0;top:0}.mdc-elevation-overlay{bottom:0;left:0;right:0;top:0}.mdc-switch__ripple{left:50%;position:absolute;top:50%;transform:translate(-50%, -50%);z-index:-1}.mdc-switch:disabled .mdc-switch__ripple{display:none}.mdc-switch__icons{height:100%;position:relative;width:100%;z-index:1}.mdc-switch__icon{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0;opacity:0;transition:opacity 30ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mdc-switch--selected .mdc-switch__icon--on,.mdc-switch--unselected .mdc-switch__icon--off{opacity:1;transition:opacity 45ms 30ms cubic-bezier(0, 0, 0.2, 1)}.mat-mdc-slide-toggle .mdc-switch--disabled+label{color:var(--mdc-switch-disabled-label-text-color)}.mdc-switch{width:var(--mdc-switch-track-width)}.mdc-switch.mdc-switch--selected:enabled .mdc-switch__handle::after{background:var(--mdc-switch-selected-handle-color)}.mdc-switch.mdc-switch--selected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after{background:var(--mdc-switch-selected-hover-handle-color)}.mdc-switch.mdc-switch--selected:enabled:focus:not(:active) .mdc-switch__handle::after{background:var(--mdc-switch-selected-focus-handle-color)}.mdc-switch.mdc-switch--selected:enabled:active .mdc-switch__handle::after{background:var(--mdc-switch-selected-pressed-handle-color)}.mdc-switch.mdc-switch--selected:disabled .mdc-switch__handle::after{background:var(--mdc-switch-disabled-selected-handle-color)}.mdc-switch.mdc-switch--unselected:enabled .mdc-switch__handle::after{background:var(--mdc-switch-unselected-handle-color)}.mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after{background:var(--mdc-switch-unselected-hover-handle-color)}.mdc-switch.mdc-switch--unselected:enabled:focus:not(:active) .mdc-switch__handle::after{background:var(--mdc-switch-unselected-focus-handle-color)}.mdc-switch.mdc-switch--unselected:enabled:active .mdc-switch__handle::after{background:var(--mdc-switch-unselected-pressed-handle-color)}.mdc-switch.mdc-switch--unselected:disabled .mdc-switch__handle::after{background:var(--mdc-switch-disabled-unselected-handle-color)}.mdc-switch .mdc-switch__handle::before{background:var(--mdc-switch-handle-surface-color)}.mdc-switch:enabled .mdc-switch__shadow{box-shadow:var(--mdc-switch-handle-elevation)}.mdc-switch:disabled .mdc-switch__shadow{box-shadow:var(--mdc-switch-disabled-handle-elevation)}.mdc-switch .mdc-switch__focus-ring-wrapper,.mdc-switch .mdc-switch__handle{height:var(--mdc-switch-handle-height)}.mdc-switch .mdc-switch__handle{border-radius:var(--mdc-switch-handle-shape)}.mdc-switch .mdc-switch__handle{width:var(--mdc-switch-handle-width)}.mdc-switch .mdc-switch__handle-track{width:calc(100% - var(--mdc-switch-handle-width))}.mdc-switch.mdc-switch--selected:enabled .mdc-switch__icon{fill:var(--mdc-switch-selected-icon-color)}.mdc-switch.mdc-switch--selected:disabled .mdc-switch__icon{fill:var(--mdc-switch-disabled-selected-icon-color)}.mdc-switch.mdc-switch--unselected:enabled .mdc-switch__icon{fill:var(--mdc-switch-unselected-icon-color)}.mdc-switch.mdc-switch--unselected:disabled .mdc-switch__icon{fill:var(--mdc-switch-disabled-unselected-icon-color)}.mdc-switch.mdc-switch--selected:disabled .mdc-switch__icons{opacity:var(--mdc-switch-disabled-selected-icon-opacity)}.mdc-switch.mdc-switch--unselected:disabled .mdc-switch__icons{opacity:var(--mdc-switch-disabled-unselected-icon-opacity)}.mdc-switch.mdc-switch--selected .mdc-switch__icon{width:var(--mdc-switch-selected-icon-size);height:var(--mdc-switch-selected-icon-size)}.mdc-switch.mdc-switch--unselected .mdc-switch__icon{width:var(--mdc-switch-unselected-icon-size);height:var(--mdc-switch-unselected-icon-size)}.mdc-switch.mdc-switch--selected:enabled:hover:not(:focus) .mdc-switch__ripple::before,.mdc-switch.mdc-switch--selected:enabled:hover:not(:focus) .mdc-switch__ripple::after{background-color:var(--mdc-switch-selected-hover-state-layer-color)}.mdc-switch.mdc-switch--selected:enabled:focus .mdc-switch__ripple::before,.mdc-switch.mdc-switch--selected:enabled:focus .mdc-switch__ripple::after{background-color:var(--mdc-switch-selected-focus-state-layer-color)}.mdc-switch.mdc-switch--selected:enabled:active .mdc-switch__ripple::before,.mdc-switch.mdc-switch--selected:enabled:active .mdc-switch__ripple::after{background-color:var(--mdc-switch-selected-pressed-state-layer-color)}.mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus) .mdc-switch__ripple::before,.mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus) .mdc-switch__ripple::after{background-color:var(--mdc-switch-unselected-hover-state-layer-color)}.mdc-switch.mdc-switch--unselected:enabled:focus .mdc-switch__ripple::before,.mdc-switch.mdc-switch--unselected:enabled:focus .mdc-switch__ripple::after{background-color:var(--mdc-switch-unselected-focus-state-layer-color)}.mdc-switch.mdc-switch--unselected:enabled:active .mdc-switch__ripple::before,.mdc-switch.mdc-switch--unselected:enabled:active .mdc-switch__ripple::after{background-color:var(--mdc-switch-unselected-pressed-state-layer-color)}.mdc-switch.mdc-switch--selected:enabled:hover:not(:focus):hover .mdc-switch__ripple::before,.mdc-switch.mdc-switch--selected:enabled:hover:not(:focus).mdc-ripple-surface--hover .mdc-switch__ripple::before{opacity:var(--mdc-switch-selected-hover-state-layer-opacity)}.mdc-switch.mdc-switch--selected:enabled:focus.mdc-ripple-upgraded--background-focused .mdc-switch__ripple::before,.mdc-switch.mdc-switch--selected:enabled:focus:not(.mdc-ripple-upgraded):focus .mdc-switch__ripple::before{transition-duration:75ms;opacity:var(--mdc-switch-selected-focus-state-layer-opacity)}.mdc-switch.mdc-switch--selected:enabled:active:not(.mdc-ripple-upgraded) .mdc-switch__ripple::after{transition:opacity 150ms linear}.mdc-switch.mdc-switch--selected:enabled:active:not(.mdc-ripple-upgraded):active .mdc-switch__ripple::after{transition-duration:75ms;opacity:var(--mdc-switch-selected-pressed-state-layer-opacity)}.mdc-switch.mdc-switch--selected:enabled:active.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-switch-selected-pressed-state-layer-opacity)}.mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus):hover .mdc-switch__ripple::before,.mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus).mdc-ripple-surface--hover .mdc-switch__ripple::before{opacity:var(--mdc-switch-unselected-hover-state-layer-opacity)}.mdc-switch.mdc-switch--unselected:enabled:focus.mdc-ripple-upgraded--background-focused .mdc-switch__ripple::before,.mdc-switch.mdc-switch--unselected:enabled:focus:not(.mdc-ripple-upgraded):focus .mdc-switch__ripple::before{transition-duration:75ms;opacity:var(--mdc-switch-unselected-focus-state-layer-opacity)}.mdc-switch.mdc-switch--unselected:enabled:active:not(.mdc-ripple-upgraded) .mdc-switch__ripple::after{transition:opacity 150ms linear}.mdc-switch.mdc-switch--unselected:enabled:active:not(.mdc-ripple-upgraded):active .mdc-switch__ripple::after{transition-duration:75ms;opacity:var(--mdc-switch-unselected-pressed-state-layer-opacity)}.mdc-switch.mdc-switch--unselected:enabled:active.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-switch-unselected-pressed-state-layer-opacity)}.mdc-switch .mdc-switch__ripple{height:var(--mdc-switch-state-layer-size);width:var(--mdc-switch-state-layer-size)}.mdc-switch .mdc-switch__track{height:var(--mdc-switch-track-height)}.mdc-switch:disabled .mdc-switch__track{opacity:var(--mdc-switch-disabled-track-opacity)}.mdc-switch:enabled .mdc-switch__track::after{background:var(--mdc-switch-selected-track-color)}.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::after{background:var(--mdc-switch-selected-hover-track-color)}.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::after{background:var(--mdc-switch-selected-focus-track-color)}.mdc-switch:enabled:active .mdc-switch__track::after{background:var(--mdc-switch-selected-pressed-track-color)}.mdc-switch:disabled .mdc-switch__track::after{background:var(--mdc-switch-disabled-selected-track-color)}.mdc-switch:enabled .mdc-switch__track::before{background:var(--mdc-switch-unselected-track-color)}.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::before{background:var(--mdc-switch-unselected-hover-track-color)}.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::before{background:var(--mdc-switch-unselected-focus-track-color)}.mdc-switch:enabled:active .mdc-switch__track::before{background:var(--mdc-switch-unselected-pressed-track-color)}.mdc-switch:disabled .mdc-switch__track::before{background:var(--mdc-switch-disabled-unselected-track-color)}.mdc-switch .mdc-switch__track{border-radius:var(--mdc-switch-track-shape)}.mdc-switch:enabled .mdc-switch__shadow{box-shadow:var(--mdc-switch-handle-elevation-shadow)}.mdc-switch:disabled .mdc-switch__shadow{box-shadow:var(--mdc-switch-disabled-handle-elevation-shadow)}.mat-mdc-slide-toggle{display:inline-block;-webkit-tap-highlight-color:rgba(0,0,0,0);outline:0}.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple,.mat-mdc-slide-toggle .mdc-switch__ripple::after{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:50%;pointer-events:none}.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple:not(:empty),.mat-mdc-slide-toggle .mdc-switch__ripple::after:not(:empty){transform:translateZ(0)}.mat-mdc-slide-toggle .mdc-switch__ripple::after{content:"";opacity:0}.mat-mdc-slide-toggle .mdc-switch:hover .mdc-switch__ripple::after{opacity:.04;transition:opacity 75ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mat-mdc-slide-toggle.mat-mdc-slide-toggle-focused .mdc-switch .mdc-switch__ripple::after{opacity:.12}.mat-mdc-slide-toggle.mat-mdc-slide-toggle-focused .mat-mdc-focus-indicator::before{content:""}.mat-mdc-slide-toggle .mat-ripple-element{opacity:.12}.mat-mdc-slide-toggle .mat-mdc-focus-indicator::before{border-radius:50%}.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle-track,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-elevation-overlay,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__icon,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::before,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::after,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::before,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::after{transition:none}.mat-mdc-slide-toggle .mdc-switch:enabled+.mdc-label{cursor:pointer}.mdc-switch__handle{transition:width 75ms cubic-bezier(0.4, 0, 0.2, 1),height 75ms cubic-bezier(0.4, 0, 0.2, 1),margin 75ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-switch--selected .mdc-switch__track::before{opacity:var(--mat-switch-hidden-track-opacity);transition:var(--mat-switch-hidden-track-transition)}.mdc-switch--selected .mdc-switch__track::after{opacity:var(--mat-switch-visible-track-opacity);transition:var(--mat-switch-visible-track-transition)}.mdc-switch--unselected .mdc-switch__track::before{opacity:var(--mat-switch-visible-track-opacity);transition:var(--mat-switch-visible-track-transition)}.mdc-switch--unselected .mdc-switch__track::after{opacity:var(--mat-switch-hidden-track-opacity);transition:var(--mat-switch-hidden-track-transition)}.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle{width:var(--mat-switch-unselected-handle-size);height:var(--mat-switch-unselected-handle-size)}.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle{width:var(--mat-switch-selected-handle-size);height:var(--mat-switch-selected-handle-size)}.mat-mdc-slide-toggle .mdc-switch__handle:has(.mdc-switch__icons){width:var(--mat-switch-with-icon-handle-size);height:var(--mat-switch-with-icon-handle-size)}.mat-mdc-slide-toggle:active .mdc-switch:not(.mdc-switch--disabled) .mdc-switch__handle{width:var(--mat-switch-pressed-handle-size);height:var(--mat-switch-pressed-handle-size)}.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle{margin:var(--mat-switch-selected-handle-horizontal-margin)}.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle:has(.mdc-switch__icons){margin:var(--mat-switch-selected-with-icon-handle-horizontal-margin)}.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle{margin:var(--mat-switch-unselected-handle-horizontal-margin)}.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle:has(.mdc-switch__icons){margin:var(--mat-switch-unselected-with-icon-handle-horizontal-margin)}.mat-mdc-slide-toggle:active .mdc-switch--selected:not(.mdc-switch--disabled) .mdc-switch__handle{margin:var(--mat-switch-selected-pressed-handle-horizontal-margin)}.mat-mdc-slide-toggle:active .mdc-switch--unselected:not(.mdc-switch--disabled) .mdc-switch__handle{margin:var(--mat-switch-unselected-pressed-handle-horizontal-margin)}.mdc-switch__track::after,.mdc-switch__track::before{border-width:var(--mat-switch-track-outline-width);border-color:var(--mat-switch-track-outline-color)}.mdc-switch--selected .mdc-switch__track::after,.mdc-switch--selected .mdc-switch__track::before{border-width:var(--mat-switch-selected-track-outline-width)}.mdc-switch--disabled .mdc-switch__track::after,.mdc-switch--disabled .mdc-switch__track::before{border-width:var(--mat-switch-disabled-unselected-track-outline-width);border-color:var(--mat-switch-disabled-unselected-track-outline-color)}.mdc-switch--disabled.mdc-switch--selected .mdc-switch__handle::after{opacity:var(--mat-switch-disabled-selected-handle-opacity)}.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__handle::after{opacity:var(--mat-switch-disabled-unselected-handle-opacity)}']
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: FocusMonitor
  }, {
    type: ChangeDetectorRef
  }, {
    type: void 0,
    decorators: [{
      type: Attribute,
      args: ["tabindex"]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS]
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
    _switchElement: [{
      type: ViewChild,
      args: ["switch"]
    }],
    name: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    labelPosition: [{
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
    required: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    color: [{
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
    }],
    tabIndex: [{
      type: Input,
      args: [{
        transform: (value) => value == null ? 0 : numberAttribute(value)
      }]
    }],
    checked: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    hideIcon: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    change: [{
      type: Output
    }],
    toggleChange: [{
      type: Output
    }]
  });
})();
var MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MatSlideToggleRequiredValidator),
  multi: true
};
var MatSlideToggleRequiredValidator = class _MatSlideToggleRequiredValidator extends CheckboxRequiredValidator {
  static {
    this.\u0275fac = /* @__PURE__ */ (() => {
      let \u0275MatSlideToggleRequiredValidator_BaseFactory;
      return function MatSlideToggleRequiredValidator_Factory(t) {
        return (\u0275MatSlideToggleRequiredValidator_BaseFactory || (\u0275MatSlideToggleRequiredValidator_BaseFactory = \u0275\u0275getInheritedFactory(_MatSlideToggleRequiredValidator)))(t || _MatSlideToggleRequiredValidator);
      };
    })();
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _MatSlideToggleRequiredValidator,
      selectors: [["mat-slide-toggle", "required", "", "formControlName", ""], ["mat-slide-toggle", "required", "", "formControl", ""], ["mat-slide-toggle", "required", "", "ngModel", ""]],
      standalone: true,
      features: [\u0275\u0275ProvidersFeature([MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR]), \u0275\u0275InheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSlideToggleRequiredValidator, [{
    type: Directive,
    args: [{
      selector: `mat-slide-toggle[required][formControlName],
             mat-slide-toggle[required][formControl], mat-slide-toggle[required][ngModel]`,
      providers: [MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR],
      standalone: true
    }]
  }], null, null);
})();
var _MatSlideToggleRequiredValidatorModule = class __MatSlideToggleRequiredValidatorModule {
  static {
    this.\u0275fac = function _MatSlideToggleRequiredValidatorModule_Factory(t) {
      return new (t || __MatSlideToggleRequiredValidatorModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: __MatSlideToggleRequiredValidatorModule
    });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_MatSlideToggleRequiredValidatorModule, [{
    type: NgModule,
    args: [{
      imports: [MatSlideToggleRequiredValidator],
      exports: [MatSlideToggleRequiredValidator]
    }]
  }], null, null);
})();
var MatSlideToggleModule = class _MatSlideToggleModule {
  static {
    this.\u0275fac = function MatSlideToggleModule_Factory(t) {
      return new (t || _MatSlideToggleModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _MatSlideToggleModule
    });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
      imports: [MatSlideToggle, MatCommonModule, MatCommonModule]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSlideToggleModule, [{
    type: NgModule,
    args: [{
      imports: [MatSlideToggle, MatCommonModule],
      exports: [MatSlideToggle, MatCommonModule]
    }]
  }], null, null);
})();

// src/app/features/routes/route-detail-dialog.component.ts
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.point.id;
var _forTrack2 = ($index, $item) => $item.dia;
var _forTrack3 = ($index, $item) => $item.v;
var _c02 = (a0) => ({ "opacity-50": a0 });
function RouteDetailDialogComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12)(1, "mat-icon", 29);
    \u0275\u0275text(2, "person_pin");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r0.exclusiveClientName, " ");
  }
}
function RouteDetailDialogComponent_Conditional_32_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 37);
  }
}
function RouteDetailDialogComponent_Conditional_32_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 16);
    \u0275\u0275text(1, "save");
    \u0275\u0275elementEnd();
  }
}
function RouteDetailDialogComponent_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19)(1, "div", 30)(2, "div", 31)(3, "label", 32);
    \u0275\u0275text(4, "Cuadrante");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "input", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 31)(7, "label", 32);
    \u0275\u0275text(8, "Servicio");
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "input", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 31)(11, "label", 32);
    \u0275\u0275text(12, "Coordinador 1");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "input", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 31)(15, "label", 32);
    \u0275\u0275text(16, "Coordinador 2");
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "input", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 35)(19, "button", 36);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_32_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.saveRoute());
    });
    \u0275\u0275template(20, RouteDetailDialogComponent_Conditional_32_Conditional_20_Template, 1, 0, "mat-spinner", 37)(21, RouteDetailDialogComponent_Conditional_32_Conditional_21_Template, 2, 0);
    \u0275\u0275text(22, " Guardar Cambios ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("formControl", ctx_r0.editRouteForm.get("cuadrante"));
    \u0275\u0275advance(4);
    \u0275\u0275property("formControl", ctx_r0.editRouteForm.get("servicio"));
    \u0275\u0275advance(4);
    \u0275\u0275property("formControl", ctx_r0.editRouteForm.get("coordinador_1"));
    \u0275\u0275advance(4);
    \u0275\u0275property("formControl", ctx_r0.editRouteForm.get("coordinador_2"));
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.savingRoute());
    \u0275\u0275advance();
    \u0275\u0275conditional(20, ctx_r0.savingRoute() ? 20 : 21);
  }
}
function RouteDetailDialogComponent_Conditional_51_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41)(1, "mat-icon", 48);
    \u0275\u0275text(2, "lock");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 49);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 50);
    \u0275\u0275text(6, "Exclusiva");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.exclusiveClientName);
  }
}
function RouteDetailDialogComponent_Conditional_51_Conditional_8_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 56);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_51_Conditional_8_For_6_Template_button_click_0_listener() {
      const c_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.toggleClient(c_r6.id));
    });
    \u0275\u0275elementStart(1, "mat-icon", 57);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 58);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r6 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", ctx_r0.isClientSelected(c_r6.id) ? "bg-emerald-700 border-emerald-500 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.isClientSelected(c_r6.id) ? "check_box" : "check_box_outline_blank");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r6.nombre);
  }
}
function RouteDetailDialogComponent_Conditional_51_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 51)(1, "input", 52);
    \u0275\u0275twoWayListener("ngModelChange", function RouteDetailDialogComponent_Conditional_51_Conditional_8_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.clientSearch, $event) || (ctx_r0.clientSearch = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 53);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 54);
    \u0275\u0275repeaterCreate(5, RouteDetailDialogComponent_Conditional_51_Conditional_8_For_6_Template, 5, 3, "button", 55, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.clientSearch);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r0.isTradex ? "Tradex: selecciona uno o varios clientes" : "Selecciona cliente(s)", " \u2014 ", ctx_r0.selectedClientIds().length, " seleccionado(s)");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.filteredClients);
  }
}
function RouteDetailDialogComponent_Conditional_51_Conditional_21_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 60);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_51_Conditional_21_For_2_Template_button_click_0_listener() {
      const p_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.selectPoint(p_r9));
    });
    \u0275\u0275elementStart(1, "span", 61);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 62);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r9 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r9.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r9.direccion || p_r9.ciudad);
  }
}
function RouteDetailDialogComponent_Conditional_51_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 46);
    \u0275\u0275repeaterCreate(1, RouteDetailDialogComponent_Conditional_51_Conditional_21_For_2_Template, 5, 2, "button", 59, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.pointResults());
  }
}
function RouteDetailDialogComponent_Conditional_51_Conditional_26_For_2_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 74);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "span", 89);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 90);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_51_Conditional_26_For_2_For_12_Template_button_click_4_listener() {
      const d_r14 = \u0275\u0275restoreView(_r13).$implicit;
      const idx_r12 = \u0275\u0275nextContext().$index;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.removeDay(idx_r12, d_r14.dia));
    });
    \u0275\u0275elementStart(5, "mat-icon", 57);
    \u0275\u0275text(6, "close");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const d_r14 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.dayLabel(d_r14.dia), " \u2014 ");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.getPriorityClass(d_r14.prioridad));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r14.prioridad);
  }
}
function RouteDetailDialogComponent_Conditional_51_Conditional_26_For_2_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 75);
    \u0275\u0275text(1, "Sin d\xEDas asignados");
    \u0275\u0275elementEnd();
  }
}
function RouteDetailDialogComponent_Conditional_51_Conditional_26_For_2_For_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 87)(1, "input", 91);
    \u0275\u0275twoWayListener("ngModelChange", function RouteDetailDialogComponent_Conditional_51_Conditional_26_For_2_For_33_Template_input_ngModelChange_1_listener($event) {
      const d_r17 = \u0275\u0275restoreView(_r16).$implicit;
      const row_r15 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(row_r15.dayChecks[d_r17.v], $event) || (row_r15.dayChecks[d_r17.v] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r17 = ctx.$implicit;
    const row_r15 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("ngClass", row_r15.dayChecks[d_r17.v] ? "bg-primary-700 border-primary-500 text-white" : "bg-slate-800 border-slate-700 text-slate-300");
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", row_r15.dayChecks[d_r17.v]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", d_r17.l, " ");
  }
}
function RouteDetailDialogComponent_Conditional_51_Conditional_26_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 64)(1, "div", 68)(2, "div", 69)(3, "mat-icon", 70);
    \u0275\u0275text(4, "storefront");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 71);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 72);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_51_Conditional_26_For_2_Template_button_click_7_listener() {
      const idx_r12 = \u0275\u0275restoreView(_r11).$index;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.removeEditorRow(idx_r12));
    });
    \u0275\u0275elementStart(8, "mat-icon", 16);
    \u0275\u0275text(9, "delete");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 73);
    \u0275\u0275repeaterCreate(11, RouteDetailDialogComponent_Conditional_51_Conditional_26_For_2_For_12_Template, 7, 3, "span", 74, _forTrack2);
    \u0275\u0275template(13, RouteDetailDialogComponent_Conditional_51_Conditional_26_For_2_Conditional_13_Template, 2, 0, "span", 75);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 76)(15, "div", 77)(16, "label", 78);
    \u0275\u0275text(17, "Prioridad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 79)(19, "select", 80);
    \u0275\u0275twoWayListener("ngModelChange", function RouteDetailDialogComponent_Conditional_51_Conditional_26_For_2_Template_select_ngModelChange_19_listener($event) {
      const row_r15 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(row_r15.prioridad, $event) || (row_r15.prioridad = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(20, "option", 81);
    \u0275\u0275text(21, "Alta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "option", 82);
    \u0275\u0275text(23, "Media");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "option", 83);
    \u0275\u0275text(25, "Baja");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "mat-icon", 84);
    \u0275\u0275text(27, "expand_more");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(28, "div", 85)(29, "label", 78);
    \u0275\u0275text(30, "D\xEDas (misma prioridad)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 86);
    \u0275\u0275repeaterCreate(32, RouteDetailDialogComponent_Conditional_51_Conditional_26_For_2_For_33_Template, 3, 3, "label", 87, _forTrack3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "button", 88);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_51_Conditional_26_For_2_Template_button_click_34_listener() {
      const idx_r12 = \u0275\u0275restoreView(_r11).$index;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.addDaysToRow(idx_r12));
    });
    \u0275\u0275elementStart(35, "mat-icon", 16);
    \u0275\u0275text(36, "playlist_add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(37, " Agregar ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const row_r15 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(row_r15.point.nombre);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(row_r15.days);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(13, row_r15.days.length === 0 ? 13 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", row_r15.prioridad);
    \u0275\u0275advance(13);
    \u0275\u0275repeater(ctx_r0.dias);
  }
}
function RouteDetailDialogComponent_Conditional_51_Conditional_26_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 67);
  }
}
function RouteDetailDialogComponent_Conditional_51_Conditional_26_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 16);
    \u0275\u0275text(1, "save");
    \u0275\u0275elementEnd();
  }
}
function RouteDetailDialogComponent_Conditional_51_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 63);
    \u0275\u0275repeaterCreate(1, RouteDetailDialogComponent_Conditional_51_Conditional_26_For_2_Template, 38, 3, "div", 64, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 65)(4, "button", 66);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_51_Conditional_26_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.saveBulk());
    });
    \u0275\u0275template(5, RouteDetailDialogComponent_Conditional_51_Conditional_26_Conditional_5_Template, 1, 0, "mat-spinner", 67)(6, RouteDetailDialogComponent_Conditional_51_Conditional_26_Conditional_6_Template, 2, 0);
    \u0275\u0275text(7, " Guardar todos los cambios ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.editorRows());
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r0.savingBulk() || !ctx_r0.canSaveBulk);
    \u0275\u0275advance();
    \u0275\u0275conditional(5, ctx_r0.savingBulk() ? 5 : 6);
  }
}
function RouteDetailDialogComponent_Conditional_51_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 92)(1, "mat-icon", 93);
    \u0275\u0275text(2, "playlist_add");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 94);
    \u0275\u0275text(4, "Busca y agrega puntos para asignarles d\xEDas y prioridad");
    \u0275\u0275elementEnd()();
  }
}
function RouteDetailDialogComponent_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25)(1, "div")(2, "div", 38)(3, "mat-icon", 39);
    \u0275\u0275text(4, "groups");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 40);
    \u0275\u0275text(6, "Cliente(s)");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(7, RouteDetailDialogComponent_Conditional_51_Conditional_7_Template, 7, 1, "div", 41)(8, RouteDetailDialogComponent_Conditional_51_Conditional_8_Template, 7, 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div")(10, "div", 38)(11, "mat-icon", 39);
    \u0275\u0275text(12, "add_location_alt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 40);
    \u0275\u0275text(14, "Agregar Punto de Inter\xE9s");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 42)(16, "div", 43)(17, "mat-icon", 44);
    \u0275\u0275text(18, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "input", 45, 0);
    \u0275\u0275listener("input", function RouteDetailDialogComponent_Conditional_51_Template_input_input_19_listener() {
      \u0275\u0275restoreView(_r3);
      const ps_r7 = \u0275\u0275reference(20);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onPointSearch(ps_r7.value));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(21, RouteDetailDialogComponent_Conditional_51_Conditional_21_Template, 3, 0, "div", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "button", 47);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_51_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.addPointToEditor());
    });
    \u0275\u0275elementStart(23, "mat-icon", 16);
    \u0275\u0275text(24, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(25, " Agregar ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(26, RouteDetailDialogComponent_Conditional_51_Conditional_26_Template, 8, 2)(27, RouteDetailDialogComponent_Conditional_51_Conditional_27_Template, 5, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275conditional(7, ctx_r0.isExclusiva ? 7 : 8);
    \u0275\u0275advance(12);
    \u0275\u0275property("value", ctx_r0.pointSearchText());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(21, ctx_r0.pointResults().length > 0 ? 21 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r0.selectedPoint);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(26, ctx_r0.editorRows().length > 0 ? 26 : 27);
  }
}
function RouteDetailDialogComponent_Conditional_52_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 107);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_52_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.bulkDelete());
    });
    \u0275\u0275elementStart(1, "mat-icon", 16);
    \u0275\u0275text(2, "delete_sweep");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" Eliminar seleccionados (", ctx_r0.selectedCount, ") ");
  }
}
function RouteDetailDialogComponent_Conditional_52_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 101);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r20 = ctx.$implicit;
    \u0275\u0275property("value", d_r20.v);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r20.l);
  }
}
function RouteDetailDialogComponent_Conditional_52_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 104)(1, "mat-icon", 108);
    \u0275\u0275text(2, "location_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 94);
    \u0275\u0275text(4, "No hay puntos programados");
    \u0275\u0275elementEnd()();
  }
}
function RouteDetailDialogComponent_Conditional_52_For_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 106)(1, "button", 109);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_52_For_21_Template_button_click_1_listener() {
      const p_r22 = \u0275\u0275restoreView(_r21).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.toggleProgSelected(p_r22.id));
    });
    \u0275\u0275elementStart(2, "mat-icon", 110);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 111)(5, "p", 71);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 112);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 113);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 114);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "button", 115);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_52_For_21_Template_button_click_13_listener() {
      const p_r22 = \u0275\u0275restoreView(_r21).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.toggleActive(p_r22));
    });
    \u0275\u0275elementStart(14, "mat-icon", 57);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "button", 116);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_52_For_21_Template_button_click_17_listener() {
      const p_r22 = \u0275\u0275restoreView(_r21).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openFutureModal(p_r22));
    });
    \u0275\u0275elementStart(18, "mat-icon", 16);
    \u0275\u0275text(19, "calendar_month");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "button", 117);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_52_For_21_Template_button_click_20_listener() {
      const p_r22 = \u0275\u0275restoreView(_r21).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.deletePdvAllDays(p_r22));
    });
    \u0275\u0275elementStart(21, "mat-icon", 16);
    \u0275\u0275text(22, "delete_sweep");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "button", 118);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_52_For_21_Template_button_click_23_listener() {
      const p_r22 = \u0275\u0275restoreView(_r21).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.removePoint(p_r22));
    });
    \u0275\u0275elementStart(24, "mat-icon", 16);
    \u0275\u0275text(25, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const p_r22 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(12, _c02, !p_r22.activo));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r0.isProgSelected(p_r22.id) ? "text-primary-400" : "text-slate-600");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.isProgSelected(p_r22.id) ? "check_box" : "check_box_outline_blank");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((p_r22.punto == null ? null : p_r22.punto.nombre) || p_r22.punto_interes_nombre || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((p_r22.cliente == null ? null : p_r22.cliente.nombre) || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r22.dia);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.getPriorityClass(p_r22.prioridad));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r22.prioridad);
    \u0275\u0275advance();
    \u0275\u0275property("matTooltip", p_r22.activo ? "Inactivar para ese d\xEDa" : "Activar")("ngClass", p_r22.activo ? "bg-emerald-950 text-emerald-400" : "bg-slate-800 text-slate-500");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r22.activo ? "check_circle" : "cancel");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", p_r22.activo ? "S\xED" : "No", " ");
  }
}
function RouteDetailDialogComponent_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 26)(1, "div", 95)(2, "span", 96);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, RouteDetailDialogComponent_Conditional_52_Conditional_4_Template, 4, 1, "button", 97);
    \u0275\u0275elementStart(5, "div", 98)(6, "select", 99);
    \u0275\u0275twoWayListener("ngModelChange", function RouteDetailDialogComponent_Conditional_52_Template_select_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.bulkDeleteDay, $event) || (ctx_r0.bulkDeleteDay = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(7, "option", 100);
    \u0275\u0275text(8, "Eliminar d\xEDa\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(9, RouteDetailDialogComponent_Conditional_52_For_10_Template, 2, 2, "option", 101, _forTrack3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 102);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_52_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.applyDeleteDay());
    });
    \u0275\u0275elementStart(12, "mat-icon", 16);
    \u0275\u0275text(13, "event_busy");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "button", 103);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_52_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.deleteAllRoute());
    });
    \u0275\u0275elementStart(15, "mat-icon", 16);
    \u0275\u0275text(16, "delete_forever");
    \u0275\u0275elementEnd();
    \u0275\u0275text(17, " Eliminar todo ");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(18, RouteDetailDialogComponent_Conditional_52_Conditional_18_Template, 5, 0, "div", 104);
    \u0275\u0275elementStart(19, "div", 105);
    \u0275\u0275repeaterCreate(20, RouteDetailDialogComponent_Conditional_52_For_21_Template, 26, 14, "div", 106, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r0.routePoints().length, " punto(s)");
    \u0275\u0275advance();
    \u0275\u0275conditional(4, ctx_r0.selectedCount > 0 ? 4 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.bulkDeleteDay);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.dias);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r0.bulkDeleteDay);
    \u0275\u0275advance(7);
    \u0275\u0275conditional(18, ctx_r0.routePoints().length === 0 ? 18 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.routePoints());
  }
}
function RouteDetailDialogComponent_Conditional_53_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 104)(1, "mat-icon", 108);
    \u0275\u0275text(2, "event_available");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 94);
    \u0275\u0275text(4, "No hay cambios futuros programados");
    \u0275\u0275elementEnd()();
  }
}
function RouteDetailDialogComponent_Conditional_53_For_3_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 126)(1, "mat-icon", 29);
    \u0275\u0275text(2, "calendar_today");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(4, 1, c_r23.fecha_ejecucion, "dd/MM/yyyy"));
  }
}
function RouteDetailDialogComponent_Conditional_53_For_3_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 126)(1, "mat-icon", 29);
    \u0275\u0275text(2, "today");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r23.dia);
  }
}
function RouteDetailDialogComponent_Conditional_53_For_3_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 126)(1, "mat-icon", 29);
    \u0275\u0275text(2, "sync_alt");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r23.tipo_cambio);
  }
}
function RouteDetailDialogComponent_Conditional_53_For_3_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 126)(1, "mat-icon", 29);
    \u0275\u0275text(2, "business");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r23.cliente_nombre);
  }
}
function RouteDetailDialogComponent_Conditional_53_For_3_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 127);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1('"', c_r23.observaciones, '"');
  }
}
function RouteDetailDialogComponent_Conditional_53_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 119)(1, "div", 120)(2, "mat-icon", 121);
    \u0275\u0275text(3, "schedule");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 111)(5, "div", 122)(6, "span", 123);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 124);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 125);
    \u0275\u0275template(11, RouteDetailDialogComponent_Conditional_53_For_3_Conditional_11_Template, 5, 4, "span", 126)(12, RouteDetailDialogComponent_Conditional_53_For_3_Conditional_12_Template, 4, 1, "span", 126)(13, RouteDetailDialogComponent_Conditional_53_For_3_Conditional_13_Template, 4, 1, "span", 126)(14, RouteDetailDialogComponent_Conditional_53_For_3_Conditional_14_Template, 4, 1, "span", 126);
    \u0275\u0275elementEnd();
    \u0275\u0275template(15, RouteDetailDialogComponent_Conditional_53_For_3_Conditional_15_Template, 2, 1, "p", 127);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r23 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(c_r23.punto_interes_nombre || "\u2014");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.getChangeBadge(c_r23));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r23.estado || "pendiente");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(11, c_r23.fecha_ejecucion ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(12, c_r23.dia ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(13, c_r23.tipo_cambio ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(14, c_r23.cliente_nombre ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(15, c_r23.observaciones ? 15 : -1);
  }
}
function RouteDetailDialogComponent_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275template(1, RouteDetailDialogComponent_Conditional_53_Conditional_1_Template, 5, 0, "div", 104);
    \u0275\u0275repeaterCreate(2, RouteDetailDialogComponent_Conditional_53_For_3_Template, 16, 8, "div", 119, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(1, ctx_r0.futureChanges().length === 0 ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.futureChanges());
  }
}
function RouteDetailDialogComponent_Conditional_54_For_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 101);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r25 = ctx.$implicit;
    \u0275\u0275property("value", d_r25.v);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r25.l);
  }
}
function RouteDetailDialogComponent_Conditional_54_Conditional_62_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 37);
  }
}
function RouteDetailDialogComponent_Conditional_54_Conditional_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 16);
    \u0275\u0275text(1, "save");
    \u0275\u0275elementEnd();
  }
}
function RouteDetailDialogComponent_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28)(1, "div", 128);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_54_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeFutureModal());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 129)(3, "div", 130)(4, "div", 131)(5, "mat-icon", 132);
    \u0275\u0275text(6, "calendar_month");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "h3", 133);
    \u0275\u0275text(8, "Programar Cambio Futuro");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 134)(10, "div", 135)(11, "span", 136);
    \u0275\u0275text(12, "Punto:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 137);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 138);
    \u0275\u0275text(16, "\xB7");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 138);
    \u0275\u0275text(18, "Cliente:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 139);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 31)(22, "label", 32);
    \u0275\u0275text(23, "Fecha de ejecuci\xF3n ");
    \u0275\u0275elementStart(24, "span", 140);
    \u0275\u0275text(25, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "input", 141);
    \u0275\u0275twoWayListener("ngModelChange", function RouteDetailDialogComponent_Conditional_54_Template_input_ngModelChange_26_listener($event) {
      \u0275\u0275restoreView(_r24);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.futureForm["fecha_ejecucion"], $event) || (ctx_r0.futureForm["fecha_ejecucion"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 31)(28, "label", 32);
    \u0275\u0275text(29, "Tipo de cambio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "select", 142);
    \u0275\u0275twoWayListener("ngModelChange", function RouteDetailDialogComponent_Conditional_54_Template_select_ngModelChange_30_listener($event) {
      \u0275\u0275restoreView(_r24);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.futureForm["tipo_cambio"], $event) || (ctx_r0.futureForm["tipo_cambio"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(31, "option", 143);
    \u0275\u0275text(32, "Actualizar (d\xEDa / prioridad)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "option", 144);
    \u0275\u0275text(34, "Inactivar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "option", 145);
    \u0275\u0275text(36, "Activar");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(37, "div", 146)(38, "div", 31)(39, "label", 32);
    \u0275\u0275text(40, "D\xEDa de visita");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "select", 142);
    \u0275\u0275twoWayListener("ngModelChange", function RouteDetailDialogComponent_Conditional_54_Template_select_ngModelChange_41_listener($event) {
      \u0275\u0275restoreView(_r24);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.futureForm["dia"], $event) || (ctx_r0.futureForm["dia"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(42, RouteDetailDialogComponent_Conditional_54_For_43_Template, 2, 2, "option", 101, _forTrack3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "div", 31)(45, "label", 32);
    \u0275\u0275text(46, "Prioridad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "select", 142);
    \u0275\u0275twoWayListener("ngModelChange", function RouteDetailDialogComponent_Conditional_54_Template_select_ngModelChange_47_listener($event) {
      \u0275\u0275restoreView(_r24);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.futureForm["prioridad"], $event) || (ctx_r0.futureForm["prioridad"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(48, "option", 81);
    \u0275\u0275text(49, "Alta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "option", 82);
    \u0275\u0275text(51, "Media");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "option", 83);
    \u0275\u0275text(53, "Baja");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(54, "div", 31)(55, "label", 32);
    \u0275\u0275text(56, "Observaciones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "textarea", 147);
    \u0275\u0275twoWayListener("ngModelChange", function RouteDetailDialogComponent_Conditional_54_Template_textarea_ngModelChange_57_listener($event) {
      \u0275\u0275restoreView(_r24);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.futureForm["observaciones"], $event) || (ctx_r0.futureForm["observaciones"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(58, "div", 148)(59, "button", 149);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_54_Template_button_click_59_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeFutureModal());
    });
    \u0275\u0275text(60, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "button", 150);
    \u0275\u0275listener("click", function RouteDetailDialogComponent_Conditional_54_Template_button_click_61_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.saveFutureChange());
    });
    \u0275\u0275template(62, RouteDetailDialogComponent_Conditional_54_Conditional_62_Template, 1, 0, "mat-spinner", 37)(63, RouteDetailDialogComponent_Conditional_54_Conditional_63_Template, 2, 0);
    \u0275\u0275text(64, " Programar ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(14);
    \u0275\u0275textInterpolate((ctx_r0.futurePoint == null ? null : ctx_r0.futurePoint.punto == null ? null : ctx_r0.futurePoint.punto.nombre) || (ctx_r0.futurePoint == null ? null : ctx_r0.futurePoint.punto_interes_nombre));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate((ctx_r0.futurePoint == null ? null : ctx_r0.futurePoint.cliente == null ? null : ctx_r0.futurePoint.cliente.nombre) || "\u2014");
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.futureForm["fecha_ejecucion"]);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.futureForm["tipo_cambio"]);
    \u0275\u0275advance(11);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.futureForm["dia"]);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.dias);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.futureForm["prioridad"]);
    \u0275\u0275advance(10);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.futureForm["observaciones"]);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r0.savingFuture());
    \u0275\u0275advance();
    \u0275\u0275conditional(62, ctx_r0.savingFuture() ? 62 : 63);
  }
}
var RouteDetailDialogComponent = class _RouteDetailDialogComponent {
  constructor(dialogRef, data, api, fb, snack) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.api = api;
    this.fb = fb;
    this.snack = snack;
    this.tipo = "T";
    this.clients = signal([]);
    this.routePoints = signal([]);
    this.futureChanges = signal([]);
    this.activeTab = signal("masivo");
    this.editingRoute = signal(false);
    this.savingRoute = signal(false);
    this.pointResults = signal([]);
    this.pointSearchText = signal("");
    this.searchingPoints = signal(false);
    this.selectedPoint = null;
    this.editorRows = signal([]);
    this.savingBulk = signal(false);
    this.clientSearch = "";
    this.selectedClientIds = signal([]);
    this.pointSearch$ = new Subject();
    this.selectedProgIds = signal(/* @__PURE__ */ new Set());
    this.dias = [
      { v: "Lunes", l: "Lunes" },
      { v: "Martes", l: "Martes" },
      { v: "Miercoles", l: "Mi\xE9rcoles" },
      { v: "Jueves", l: "Jueves" },
      { v: "Viernes", l: "Viernes" },
      { v: "Sabado", l: "S\xE1bado" },
      { v: "Domingo", l: "Domingo" }
    ];
    this.editRouteForm = this.fb.group({
      cuadrante: [""],
      servicio: [""],
      coordinador_1: [""],
      coordinador_2: [""]
    });
    this.bulkDeleteDay = "";
    this.futureModalOpen = signal(false);
    this.futurePoint = null;
    this.futureForm = {};
    this.savingFuture = signal(false);
  }
  ngOnInit() {
    this.ruta = __spreadValues({}, this.data.ruta);
    if (this.data.startEdit)
      this.editingRoute.set(true);
    const n = this.ruta.nombre ?? "";
    if (n.startsWith("Ruta ") && n.length > 5 && ["E", "T", "A"].includes(n[5]))
      this.tipo = n[5];
    this.editRouteForm.patchValue({
      cuadrante: this.ruta.cuadrante ?? "",
      servicio: this.ruta.servicio ?? "",
      coordinador_1: this.ruta.coordinador_1 ?? "",
      coordinador_2: this.ruta.coordinador_2 ?? ""
    });
    this.api.getClients().subscribe((d) => {
      this.clients.set(d ?? []);
      if (this.isExclusiva && this.ruta.id_cliente_exclusivo) {
        this.selectedClientIds.set([Number(this.ruta.id_cliente_exclusivo)]);
      }
    });
    this.loadRoutePoints();
    this.pointSearch$.pipe(debounceTime(300), distinctUntilChanged(), switchMap((term) => {
      if (!term || term.length < 2) {
        this.pointResults.set([]);
        this.searchingPoints.set(false);
        return of([]);
      }
      this.searchingPoints.set(true);
      return this.api.getPoints({ search: term, limit: 30 });
    })).subscribe({
      next: (res) => {
        this.pointResults.set(res);
        this.searchingPoints.set(false);
      },
      error: () => this.searchingPoints.set(false)
    });
  }
  get isExclusiva() {
    return this.tipo === "E";
  }
  get isTradex() {
    return this.tipo === "T";
  }
  get exclusiveClientName() {
    return this.ruta.cliente_exclusivo_nombre ?? this.clients().find((c) => c.id === Number(this.ruta.id_cliente_exclusivo))?.nombre ?? "\u2014";
  }
  get filteredClients() {
    const s = this.clientSearch.trim().toLowerCase();
    return this.clients().filter((c) => !s || c.nombre?.toLowerCase().includes(s));
  }
  // ── Tabs / route edit ─────────────────────────────────────
  loadTab(tab) {
    this.activeTab.set(tab);
    if (tab === "changes")
      this.api.getFutureChanges(this.ruta.id).subscribe((d) => this.futureChanges.set(d));
    if (tab === "points")
      this.loadRoutePoints();
  }
  saveRoute() {
    this.savingRoute.set(true);
    this.api.updateRoute(this.ruta.id, this.editRouteForm.value).subscribe({
      next: (updated) => {
        this.ruta = __spreadValues(__spreadValues({}, this.ruta), updated);
        this.savingRoute.set(false);
        this.editingRoute.set(false);
        this.snack.open("Ruta actualizada", "OK", { duration: 3e3 });
      },
      error: () => this.savingRoute.set(false)
    });
  }
  // ── Clientes (selección) ──────────────────────────────────
  isClientSelected(id) {
    return this.selectedClientIds().includes(id);
  }
  toggleClient(id) {
    if (this.isExclusiva)
      return;
    this.selectedClientIds.update((list) => list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }
  // ── Búsqueda de puntos ────────────────────────────────────
  onPointSearch(term) {
    this.pointSearchText.set(term);
    this.selectedPoint = null;
    this.pointSearch$.next(term);
  }
  selectPoint(p) {
    this.selectedPoint = p;
    this.pointSearchText.set(p.nombre ?? "");
    this.pointResults.set([]);
  }
  addPointToEditor() {
    if (!this.selectedPoint)
      return;
    if (this.editorRows().some((r) => r.point.id === this.selectedPoint.id)) {
      this.snack.open("Ese punto ya est\xE1 en el editor", "OK", { duration: 2500 });
      return;
    }
    this.editorRows.update((rows) => [...rows, {
      point: this.selectedPoint,
      days: [],
      prioridad: "Media",
      dayChecks: {}
    }]);
    this.selectedPoint = null;
    this.pointSearchText.set("");
  }
  removeEditorRow(idx) {
    this.editorRows.update((rows) => rows.filter((_, i) => i !== idx));
  }
  // Agrega los días marcados con la prioridad elegida (misma prioridad a varios días)
  addDaysToRow(idx) {
    this.editorRows.update((rows) => rows.map((r, i) => {
      if (i !== idx)
        return r;
      const checked = this.dias.filter((d) => r.dayChecks[d.v]).map((d) => d.v);
      if (checked.length === 0)
        return r;
      const days = [...r.days];
      for (const dia of checked) {
        const existing = days.find((d) => d.dia === dia);
        if (existing)
          existing.prioridad = r.prioridad;
        else
          days.push({ dia, prioridad: r.prioridad });
      }
      return __spreadProps(__spreadValues({}, r), { days, dayChecks: {} });
    }));
  }
  removeDay(idx, dia) {
    this.editorRows.update((rows) => rows.map((r, i) => i === idx ? __spreadProps(__spreadValues({}, r), { days: r.days.filter((d) => d.dia !== dia) }) : r));
  }
  dayLabel(v) {
    return this.dias.find((d) => d.v === v)?.l ?? v;
  }
  get canSaveBulk() {
    return this.selectedClientIds().length > 0 && this.editorRows().length > 0 && this.editorRows().some((r) => r.days.length > 0);
  }
  saveBulk() {
    if (!this.canSaveBulk) {
      this.snack.open("Selecciona cliente(s), punto(s) y al menos un d\xEDa", "OK", { duration: 3500 });
      return;
    }
    const inserts = [];
    for (const row of this.editorRows()) {
      for (const cid of this.selectedClientIds()) {
        for (const dp of row.days) {
          inserts.push({ point_id: row.point.id, client_id: cid, dia: dp.dia, prioridad: dp.prioridad });
        }
      }
    }
    if (inserts.length === 0)
      return;
    this.savingBulk.set(true);
    this.api.bulkApply(this.ruta.id, { inserts }).subscribe({
      next: (res) => {
        this.savingBulk.set(false);
        this.editorRows.set([]);
        this.loadRoutePoints();
        this.snack.open(res?.message ?? "Cambios guardados", "OK", { duration: 4e3 });
      },
      error: (err) => {
        this.savingBulk.set(false);
        this.snack.open(err.error?.detail ?? "Error al guardar", "OK", { duration: 4e3 });
      }
    });
  }
  // ── Puntos Actuales ───────────────────────────────────────
  loadRoutePoints() {
    this.api.getRoutePoints(this.ruta.id, true).subscribe((d) => {
      this.routePoints.set(d);
      if (this.isExclusiva && this.selectedClientIds().length === 0) {
        const cid = d.find((x) => x.cliente?.id)?.cliente?.id;
        if (cid)
          this.selectedClientIds.set([cid]);
      }
    });
  }
  toggleActive(p) {
    const nuevo = !p.activo;
    this.api.setPointActive(p.id, nuevo).subscribe({
      next: () => {
        this.routePoints.update((list) => list.map((x) => x.id === p.id ? __spreadProps(__spreadValues({}, x), { activo: nuevo }) : x));
      },
      error: () => this.snack.open("No se pudo cambiar el estado", "OK", { duration: 3e3 })
    });
  }
  removePoint(point) {
    if (!confirm("\xBFEliminar este punto de la ruta?"))
      return;
    this.api.removePointFromRoute(point.id).subscribe({
      next: () => {
        this.loadRoutePoints();
        this.snack.open("Punto eliminado", "OK", { duration: 3e3 });
      }
    });
  }
  isProgSelected(id) {
    return this.selectedProgIds().has(id);
  }
  toggleProgSelected(id) {
    this.selectedProgIds.update((set) => {
      const s = new Set(set);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }
  get selectedCount() {
    return this.selectedProgIds().size;
  }
  // ── Borrado: helper genérico + 4 modos ────────────────────
  deleteByIds(ids, msg) {
    if (ids.length === 0)
      return;
    this.api.bulkApply(this.ruta.id, { deletes: ids.map((id) => ({ programacion_id: id })) }).subscribe({
      next: (res) => {
        this.selectedProgIds.set(/* @__PURE__ */ new Set());
        this.loadRoutePoints();
        this.snack.open(res?.message ?? msg, "OK", { duration: 3500 });
      },
      error: () => this.snack.open("Error al eliminar", "OK", { duration: 3e3 })
    });
  }
  bulkDelete() {
    const ids = [...this.selectedProgIds()];
    if (ids.length === 0)
      return;
    if (!confirm(`\xBFEliminar ${ids.length} punto(s) seleccionado(s)?`))
      return;
    this.deleteByIds(ids, "Puntos eliminados");
  }
  // Eliminar un PDV en TODOS sus días (todas las programaciones de ese punto)
  deletePdvAllDays(p) {
    const pid = p.punto?.id ?? p.punto_id;
    const ids = this.routePoints().filter((x) => (x.punto?.id ?? x.punto_id) === pid).map((x) => x.id);
    if (!confirm(`\xBFEliminar "${p.punto?.nombre || p.punto_interes_nombre}" de TODOS los d\xEDas (${ids.length})?`))
      return;
    this.deleteByIds(ids, "PDV eliminado de todos los d\xEDas");
  }
  applyDeleteDay() {
    if (!this.bulkDeleteDay)
      return;
    const ids = this.routePoints().filter((x) => x.dia === this.bulkDeleteDay).map((x) => x.id);
    if (ids.length === 0) {
      this.snack.open("No hay puntos ese d\xEDa", "OK", { duration: 2500 });
      return;
    }
    if (!confirm(`\xBFEliminar los ${ids.length} punto(s) del d\xEDa ${this.dayLabel(this.bulkDeleteDay)}?`))
      return;
    this.deleteByIds(ids, `Puntos del ${this.dayLabel(this.bulkDeleteDay)} eliminados`);
    this.bulkDeleteDay = "";
  }
  // Eliminar TODOS los PDV de la ruta
  deleteAllRoute() {
    const ids = this.routePoints().map((x) => x.id);
    if (ids.length === 0)
      return;
    if (!confirm(`\xBFEliminar TODOS los ${ids.length} puntos de la ruta? Esta acci\xF3n no se puede deshacer.`))
      return;
    this.deleteByIds(ids, "Todos los puntos eliminados");
  }
  openFutureModal(p) {
    this.futurePoint = p;
    this.futureForm = {
      fecha_ejecucion: "",
      tipo_cambio: "modificacion",
      dia: p.dia ?? "Lunes",
      prioridad: p.prioridad ?? "Media",
      activa: true,
      observaciones: ""
    };
    this.futureModalOpen.set(true);
  }
  closeFutureModal() {
    this.futureModalOpen.set(false);
    this.futurePoint = null;
  }
  saveFutureChange() {
    if (!this.futureForm["fecha_ejecucion"]) {
      this.snack.open("La fecha de ejecuci\xF3n es obligatoria", "OK", { duration: 3e3 });
      return;
    }
    const p = this.futurePoint;
    const payload = {
      id_programacion: p.id,
      id_punto_interes: p.punto?.id ?? p.punto_id,
      punto_interes_nombre: p.punto?.nombre ?? p.punto_interes_nombre,
      id_cliente: p.cliente?.id,
      cliente_nombre: p.cliente?.nombre,
      dia: this.futureForm["dia"],
      prioridad: this.futureForm["prioridad"],
      tipo_cambio: this.futureForm["tipo_cambio"],
      fecha_ejecucion: this.futureForm["fecha_ejecucion"],
      observaciones: this.futureForm["observaciones"]
    };
    this.savingFuture.set(true);
    this.api.scheduleChange(this.ruta.id, payload).subscribe({
      next: () => {
        this.savingFuture.set(false);
        this.closeFutureModal();
        this.api.getFutureChanges(this.ruta.id).subscribe((d) => this.futureChanges.set(d));
        this.snack.open("Cambio futuro programado", "OK", { duration: 3e3 });
      },
      error: () => {
        this.savingFuture.set(false);
        this.snack.open("No se pudo programar", "OK", { duration: 3e3 });
      }
    });
  }
  // ── Helpers de estilo ─────────────────────────────────────
  getPriorityClass(p) {
    switch (p) {
      case "Alta":
        return "bg-red-950 text-red-400 border border-red-900";
      case "Media":
        return "bg-amber-950 text-amber-400 border border-amber-900";
      case "Baja":
        return "bg-sky-950 text-sky-400 border border-sky-900";
      default:
        return "bg-slate-800 text-slate-400";
    }
  }
  getChangeBadge(c) {
    if (c.estado === "pendiente" || !c.estado)
      return "bg-amber-950 text-amber-400";
    if (c.estado === "ejecutado")
      return "bg-emerald-950 text-emerald-400";
    return "bg-slate-800 text-slate-400";
  }
  static {
    this.\u0275fac = function RouteDetailDialogComponent_Factory(t) {
      return new (t || _RouteDetailDialogComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA), \u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RouteDetailDialogComponent, selectors: [["app-route-detail-dialog"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 55, vars: 18, consts: [["ps", ""], [1, "flex", "flex-col", "bg-slate-950", "text-white", "rounded-3xl", "overflow-hidden", "shadow-2xl", "border", "border-white/8", 2, "width", "min(96vw,1100px)", "max-height", "90vh"], [1, "bg-gradient-to-r", "from-slate-900", "via-slate-900", "to-slate-800", "border-b", "border-white/8", "shrink-0"], [1, "flex", "items-start", "justify-between", "px-8", "pt-7", "pb-5"], [1, "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "rounded-2xl", "bg-gradient-to-br", "from-primary-600", "to-indigo-600", "flex", "items-center", "justify-center", "shadow-lg", "shrink-0"], [1, "text-white", "!text-2xl"], [1, "text-xl", "font-black", "text-white", "tracking-tight", "leading-none", "mb-1"], [1, "flex", "flex-wrap", "gap-2", "mt-2"], [1, "px-2.5", "py-1", "bg-white/8", "rounded-lg", "text-xs", "font-bold", "text-slate-400", "flex", "items-center", "gap-1"], [1, "!text-xs", "text-primary-400"], [1, "!text-xs", "text-indigo-400"], [1, "px-2.5", "py-1", "bg-amber-950", "rounded-lg", "text-xs", "font-bold", "text-amber-400", "flex", "items-center", "gap-1"], [1, "!text-xs", "text-emerald-400"], [1, "flex", "items-center", "gap-2", "shrink-0", "ml-4"], [1, "flex", "items-center", "gap-1.5", "px-4", "py-2", "rounded-xl", "border", "transition-all", "duration-200", "text-sm", "font-bold", 3, "click", "ngClass"], [1, "!text-base"], [1, "w-9", "h-9", "rounded-xl", "bg-white/5", "hover:bg-white/10", "flex", "items-center", "justify-center", "text-slate-400", "hover:text-white", "transition-all", 3, "click"], [1, "!text-lg"], [1, "px-8", "pb-6"], [1, "flex", "gap-1", "px-8"], ["type", "button", 1, "px-5", "py-2.5", "text-sm", "font-black", "rounded-t-xl", "transition-all", "flex", "items-center", "gap-2", 3, "click", "ngClass"], [1, "bg-primary-900", "text-primary-400", "text-xs", "px-2", "py-0.5", "rounded-full"], [1, "bg-amber-900", "text-amber-400", "text-xs", "px-2", "py-0.5", "rounded-full"], [1, "flex-1", "overflow-y-auto"], [1, "px-8", "py-6", "space-y-6"], [1, "px-8", "py-5"], [1, "px-8", "py-6", "space-y-3"], [1, "fixed", "inset-0", "z-[60]", "flex", "items-center", "justify-center", "p-4"], [1, "!text-xs"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-3", "bg-slate-800", "rounded-2xl", "p-4", "border", "border-white/5"], [1, "space-y-1.5"], [1, "text-[10px]", "font-black", "text-slate-500", "uppercase", "tracking-widest"], [1, "w-full", "bg-slate-700", "border", "border-slate-600", "focus:border-primary-500", "text-white", "rounded-xl", "px-3", "py-2.5", "text-sm", "font-semibold", "outline-none", 3, "formControl"], [1, "w-full", "bg-slate-700", "border", "border-slate-600", "text-white", "rounded-xl", "px-3", "py-2.5", "text-sm", "font-semibold", "outline-none", 3, "formControl"], [1, "col-span-2", "md:col-span-4", "flex", "justify-end", "pt-1"], ["type", "button", 1, "flex", "items-center", "gap-2", "px-6", "py-2", "bg-primary-600", "hover:bg-primary-500", "text-white", "font-black", "rounded-xl", "text-sm", "shadow-lg", "transition-all", "active:scale-95", "disabled:opacity-50", 3, "click", "disabled"], ["diameter", "14"], [1, "flex", "items-center", "gap-2", "mb-3"], [1, "!text-base", "text-emerald-400"], [1, "text-sm", "font-black", "text-slate-300", "uppercase", "tracking-widest"], [1, "inline-flex", "items-center", "gap-2", "bg-amber-950", "border", "border-amber-800", "rounded-xl", "px-4", "py-2.5"], [1, "flex", "gap-2", "relative"], [1, "relative", "flex-1"], [1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-500", "pointer-events-none", "!text-base"], ["placeholder", "Buscar punto de inter\xE9s...", "autocomplete", "off", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-emerald-500", "text-white", "placeholder-slate-500", "rounded-xl", "pl-9", "pr-3", "py-2.5", "text-sm", "font-semibold", "outline-none", 3, "input", "value"], [1, "absolute", "z-50", "top-full", "mt-1", "w-full", "bg-slate-800", "border", "border-slate-700", "rounded-xl", "shadow-2xl", "max-h-52", "overflow-y-auto"], ["type", "button", 1, "px-4", "py-2.5", "bg-emerald-700", "hover:bg-emerald-600", "disabled:opacity-40", "text-white", "rounded-xl", "font-black", "text-sm", "flex", "items-center", "gap-1", "whitespace-nowrap", 3, "click", "disabled"], [1, "!text-base", "text-amber-400"], [1, "text-sm", "font-bold", "text-amber-300"], [1, "text-[10px]", "text-amber-500", "uppercase", "font-black", "ml-1"], [1, "bg-slate-900", "border", "border-slate-800", "rounded-2xl", "p-3"], ["placeholder", "Buscar cliente...", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-emerald-500", "text-white", "placeholder-slate-500", "rounded-xl", "px-3", "py-2", "text-sm", "font-semibold", "outline-none", "mb-2", 3, "ngModelChange", "ngModel"], [1, "text-[11px]", "text-slate-500", "mb-2"], [1, "max-h-40", "overflow-y-auto", "grid", "grid-cols-2", "md:grid-cols-3", "gap-1.5"], ["type", "button", 1, "flex", "items-center", "gap-1.5", "px-2.5", "py-1.5", "rounded-lg", "border", "text-xs", "font-bold", "text-left", "transition-all", 3, "ngClass"], ["type", "button", 1, "flex", "items-center", "gap-1.5", "px-2.5", "py-1.5", "rounded-lg", "border", "text-xs", "font-bold", "text-left", "transition-all", 3, "click", "ngClass"], [1, "!text-sm"], [1, "truncate"], ["type", "button", 1, "w-full", "text-left", "px-4", "py-2.5", "hover:bg-slate-700", "text-sm", "text-white", "font-semibold", "border-b", "border-slate-700", "last:border-0"], ["type", "button", 1, "w-full", "text-left", "px-4", "py-2.5", "hover:bg-slate-700", "text-sm", "text-white", "font-semibold", "border-b", "border-slate-700", "last:border-0", 3, "click"], [1, "block", "truncate"], [1, "block", "text-xs", "text-slate-500", "truncate"], [1, "space-y-3"], [1, "bg-slate-900", "border", "border-slate-800", "rounded-2xl", "p-4"], [1, "flex", "justify-end", "pt-2"], ["type", "button", 1, "flex", "items-center", "gap-2", "px-8", "py-3", "bg-emerald-700", "hover:bg-emerald-600", "disabled:opacity-40", "text-white", "font-black", "rounded-xl", "shadow-lg", "transition-all", "active:scale-95", 3, "click", "disabled"], ["diameter", "16"], [1, "flex", "items-center", "justify-between", "mb-3"], [1, "flex", "items-center", "gap-2", "min-w-0"], [1, "!text-base", "text-primary-400"], [1, "font-bold", "text-white", "text-sm", "truncate"], ["type", "button", 1, "w-7", "h-7", "rounded-lg", "bg-red-950", "hover:bg-red-900", "text-red-400", "flex", "items-center", "justify-center", 3, "click"], [1, "flex", "flex-wrap", "gap-1.5", "mb-3"], [1, "inline-flex", "items-center", "gap-1", "px-2.5", "py-1", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-xs", "font-bold"], [1, "text-xs", "text-slate-500", "italic"], [1, "flex", "flex-wrap", "items-end", "gap-3", "bg-slate-950", "rounded-xl", "p-3", "border", "border-white/5"], [1, "space-y-1"], [1, "text-[10px]", "font-black", "text-slate-500", "uppercase"], [1, "relative"], [1, "bg-slate-800", "border", "border-slate-700", "text-white", "rounded-lg", "px-3", "py-2", "pr-8", "text-sm", "font-semibold", "appearance-none", "outline-none", 3, "ngModelChange", "ngModel"], ["value", "Alta"], ["value", "Media"], ["value", "Baja"], [1, "absolute", "right-2", "top-1/2", "-translate-y-1/2", "text-slate-500", "pointer-events-none", "!text-base"], [1, "space-y-1", "flex-1"], [1, "flex", "flex-wrap", "gap-1.5"], [1, "flex", "items-center", "gap-1", "px-2", "py-1", "rounded-lg", "border", "text-xs", "font-bold", "cursor-pointer", "select-none", 3, "ngClass"], ["type", "button", 1, "px-3", "py-2", "bg-primary-700", "hover:bg-primary-600", "text-white", "rounded-lg", "font-bold", "text-sm", "flex", "items-center", "gap-1", 3, "click"], [1, "px-1.5", "rounded", 3, "ngClass"], ["type", "button", 1, "text-slate-500", "hover:text-red-400", 3, "click"], ["type", "checkbox", 1, "hidden", 3, "ngModelChange", "ngModel"], [1, "flex", "flex-col", "items-center", "justify-center", "py-12", "gap-3", "text-slate-600"], [1, "!text-4xl"], [1, "font-bold", "text-sm"], [1, "flex", "flex-wrap", "items-center", "gap-2", "mb-4"], [1, "text-sm", "font-black", "text-slate-300", "uppercase", "tracking-widest", "mr-auto"], ["type", "button", 1, "flex", "items-center", "gap-1.5", "px-3", "py-2", "bg-red-950", "hover:bg-red-900", "text-red-400", "rounded-xl", "font-bold", "text-sm"], [1, "flex", "items-center", "gap-1", "bg-slate-900", "border", "border-slate-800", "rounded-xl", "px-1.5", "py-1"], [1, "bg-slate-800", "border", "border-slate-700", "text-white", "rounded-lg", "px-2", "py-1.5", "text-xs", "font-semibold", "outline-none", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], ["type", "button", "matTooltip", "Eliminar todos los puntos de ese d\xEDa", 1, "w-7", "h-7", "rounded-lg", "bg-red-950", "hover:bg-red-900", "disabled:opacity-30", "text-red-400", "flex", "items-center", "justify-center", 3, "click", "disabled"], ["type", "button", "matTooltip", "Eliminar TODOS los puntos de la ruta", 1, "flex", "items-center", "gap-1.5", "px-3", "py-2", "bg-red-900", "hover:bg-red-800", "text-white", "rounded-xl", "font-bold", "text-sm", 3, "click"], [1, "flex", "flex-col", "items-center", "justify-center", "py-16", "gap-3", "text-slate-600"], [1, "space-y-2"], [1, "flex", "items-center", "gap-3", "bg-slate-900", "border", "border-slate-800", "rounded-2xl", "px-4", "py-3", 3, "ngClass"], ["type", "button", 1, "flex", "items-center", "gap-1.5", "px-3", "py-2", "bg-red-950", "hover:bg-red-900", "text-red-400", "rounded-xl", "font-bold", "text-sm", 3, "click"], [1, "!text-3xl"], ["type", "button", 1, "shrink-0", 3, "click"], [1, "!text-lg", 3, "ngClass"], [1, "flex-1", "min-w-0"], [1, "text-xs", "text-slate-500"], [1, "px-2.5", "py-1", "bg-slate-800", "border", "border-slate-700", "rounded-lg", "text-xs", "font-black", "text-slate-400"], [1, "px-2.5", "py-1", "rounded-lg", "text-xs", "font-black", 3, "ngClass"], ["type", "button", 1, "px-2.5", "py-1", "rounded-lg", "text-xs", "font-black", "flex", "items-center", "gap-1", 3, "click", "matTooltip", "ngClass"], ["type", "button", "matTooltip", "Programar cambio futuro", 1, "w-8", "h-8", "rounded-lg", "bg-amber-950", "hover:bg-amber-900", "text-amber-400", "flex", "items-center", "justify-center", 3, "click"], ["type", "button", "matTooltip", "Eliminar este PDV en todos los d\xEDas", 1, "w-8", "h-8", "rounded-lg", "bg-orange-950", "hover:bg-orange-900", "text-orange-400", "flex", "items-center", "justify-center", 3, "click"], ["type", "button", "matTooltip", "Eliminar este d\xEDa", 1, "w-8", "h-8", "rounded-lg", "bg-red-950", "hover:bg-red-900", "text-red-400", "flex", "items-center", "justify-center", 3, "click"], [1, "flex", "items-start", "gap-4", "bg-slate-900", "border", "border-slate-800", "rounded-2xl", "px-5", "py-4"], [1, "w-10", "h-10", "rounded-xl", "bg-amber-950", "flex", "items-center", "justify-center", "shrink-0", "mt-0.5"], [1, "!text-lg", "text-amber-400"], [1, "flex", "items-center", "gap-2", "mb-1"], [1, "font-black", "text-white", "text-sm"], [1, "px-2", "py-0.5", "rounded-full", "text-xs", "font-black", "uppercase", 3, "ngClass"], [1, "flex", "flex-wrap", "gap-3", "text-xs", "text-slate-500"], [1, "flex", "items-center", "gap-1"], [1, "mt-1.5", "text-xs", "text-slate-600", "italic"], [1, "absolute", "inset-0", "bg-black/70", "backdrop-blur-sm", 3, "click"], [1, "relative", "w-full", "max-w-md", "bg-slate-950", "border", "border-white/10", "rounded-3xl", "shadow-2xl", "overflow-hidden"], [1, "bg-gradient-to-r", "from-amber-700", "to-orange-600", "px-6", "py-4", "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-white/20", "flex", "items-center", "justify-center"], [1, "text-white"], [1, "font-black", "text-white", "text-lg"], [1, "p-6", "space-y-4"], [1, "bg-slate-900", "border", "border-white/5", "rounded-xl", "px-4", "py-2.5", "text-sm"], [1, "text-slate-500"], [1, "font-bold", "text-white"], [1, "text-slate-500", "ml-2"], [1, "font-bold", "text-amber-300"], [1, "text-rose-400"], ["type", "date", 1, "w-full", "bg-slate-800", "border", "border-amber-700", "focus:border-amber-500", "text-white", "rounded-xl", "px-3", "py-2.5", "text-sm", "font-semibold", "outline-none", 3, "ngModelChange", "ngModel"], [1, "w-full", "bg-slate-800", "border", "border-slate-700", "text-white", "rounded-xl", "px-3", "py-2.5", "text-sm", "font-semibold", "outline-none", 3, "ngModelChange", "ngModel"], ["value", "modificacion"], ["value", "inactivacion"], ["value", "activacion"], [1, "grid", "grid-cols-2", "gap-3"], ["rows", "2", "placeholder", "Opcional", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-amber-500", "text-white", "placeholder-slate-600", "rounded-xl", "px-3", "py-2.5", "text-sm", "font-semibold", "outline-none", "resize-none", 3, "ngModelChange", "ngModel"], [1, "px-6", "py-4", "border-t", "border-white/5", "flex", "justify-end", "gap-3", "bg-slate-900/50"], ["type", "button", 1, "px-5", "py-2.5", "border", "border-slate-700", "text-slate-400", "hover:text-white", "rounded-xl", "font-bold", "text-sm", "transition-all", 3, "click"], ["type", "button", 1, "flex", "items-center", "gap-2", "px-6", "py-2.5", "bg-amber-600", "hover:bg-amber-500", "disabled:opacity-50", "text-white", "font-black", "rounded-xl", "text-sm", "shadow-lg", "transition-all", "active:scale-95", 3, "click", "disabled"]], template: function RouteDetailDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "div", 4)(4, "div", 5)(5, "mat-icon", 6);
        \u0275\u0275text(6, "route");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div")(8, "h2", 7);
        \u0275\u0275text(9);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "div", 8)(11, "span", 9)(12, "mat-icon", 10);
        \u0275\u0275text(13, "grid_view");
        \u0275\u0275elementEnd();
        \u0275\u0275text(14);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "span", 9)(16, "mat-icon", 11);
        \u0275\u0275text(17, "business_center");
        \u0275\u0275elementEnd();
        \u0275\u0275text(18);
        \u0275\u0275elementEnd();
        \u0275\u0275template(19, RouteDetailDialogComponent_Conditional_19_Template, 4, 1, "span", 12);
        \u0275\u0275elementStart(20, "span", 9)(21, "mat-icon", 13);
        \u0275\u0275text(22, "manage_accounts");
        \u0275\u0275elementEnd();
        \u0275\u0275text(23);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(24, "div", 14)(25, "button", 15);
        \u0275\u0275listener("click", function RouteDetailDialogComponent_Template_button_click_25_listener() {
          return ctx.editingRoute.set(!ctx.editingRoute());
        });
        \u0275\u0275elementStart(26, "mat-icon", 16);
        \u0275\u0275text(27);
        \u0275\u0275elementEnd();
        \u0275\u0275text(28);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(29, "button", 17);
        \u0275\u0275listener("click", function RouteDetailDialogComponent_Template_button_click_29_listener() {
          return ctx.dialogRef.close();
        });
        \u0275\u0275elementStart(30, "mat-icon", 18);
        \u0275\u0275text(31, "close");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(32, RouteDetailDialogComponent_Conditional_32_Template, 23, 6, "div", 19);
        \u0275\u0275elementStart(33, "div", 20)(34, "button", 21);
        \u0275\u0275listener("click", function RouteDetailDialogComponent_Template_button_click_34_listener() {
          return ctx.loadTab("masivo");
        });
        \u0275\u0275elementStart(35, "mat-icon", 16);
        \u0275\u0275text(36, "edit_note");
        \u0275\u0275elementEnd();
        \u0275\u0275text(37, " Editor Masivo ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(38, "button", 21);
        \u0275\u0275listener("click", function RouteDetailDialogComponent_Template_button_click_38_listener() {
          return ctx.loadTab("points");
        });
        \u0275\u0275elementStart(39, "mat-icon", 16);
        \u0275\u0275text(40, "location_on");
        \u0275\u0275elementEnd();
        \u0275\u0275text(41, " Puntos Actuales ");
        \u0275\u0275elementStart(42, "span", 22);
        \u0275\u0275text(43);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(44, "button", 21);
        \u0275\u0275listener("click", function RouteDetailDialogComponent_Template_button_click_44_listener() {
          return ctx.loadTab("changes");
        });
        \u0275\u0275elementStart(45, "mat-icon", 16);
        \u0275\u0275text(46, "schedule");
        \u0275\u0275elementEnd();
        \u0275\u0275text(47, " Cambios Futuros ");
        \u0275\u0275elementStart(48, "span", 23);
        \u0275\u0275text(49);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(50, "div", 24);
        \u0275\u0275template(51, RouteDetailDialogComponent_Conditional_51_Template, 28, 5, "div", 25)(52, RouteDetailDialogComponent_Conditional_52_Template, 22, 5, "div", 26)(53, RouteDetailDialogComponent_Conditional_53_Template, 4, 1, "div", 27);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(54, RouteDetailDialogComponent_Conditional_54_Template, 65, 9, "div", 28);
      }
      if (rf & 2) {
        \u0275\u0275advance(9);
        \u0275\u0275textInterpolate(ctx.ruta.nombre);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate1("", ctx.ruta.cuadrante || "\u2014", " ");
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate1("", ctx.ruta.servicio || "\u2014", " ");
        \u0275\u0275advance();
        \u0275\u0275conditional(19, ctx.isExclusiva ? 19 : -1);
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate1("", ctx.ruta.coordinador_1 || "\u2014", " ");
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", ctx.editingRoute() ? "border-primary-500 text-primary-400 bg-primary-900" : "border-slate-700 text-slate-400 hover:border-slate-500");
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.editingRoute() ? "close" : "edit");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.editingRoute() ? "Cancelar" : "Editar Ruta", " ");
        \u0275\u0275advance(4);
        \u0275\u0275conditional(32, ctx.editingRoute() ? 32 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", ctx.activeTab() === "masivo" ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-300");
        \u0275\u0275advance(4);
        \u0275\u0275property("ngClass", ctx.activeTab() === "points" ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-300");
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.routePoints().length);
        \u0275\u0275advance();
        \u0275\u0275property("ngClass", ctx.activeTab() === "changes" ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-300");
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.futureChanges().length);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(51, ctx.activeTab() === "masivo" ? 51 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(52, ctx.activeTab() === "points" ? 52 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(53, ctx.activeTab() === "changes" ? 53 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(54, ctx.futureModalOpen() ? 54 : -1);
      }
    }, dependencies: [CommonModule, NgClass, DatePipe, ReactiveFormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, FormControlDirective, FormsModule, NgModel, MatDialogModule, MatButtonModule, MatIconModule, MatIcon, MatProgressSpinnerModule, MatProgressSpinner, MatTooltipModule, MatTooltip], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RouteDetailDialogComponent, { className: "RouteDetailDialogComponent", filePath: "src\\app\\features\\routes\\route-detail-dialog.component.ts", lineNumber: 28 });
})();

// src/app/features/routes/routes.component.ts
var _forTrack02 = ($index, $item) => $item.id;
var _c03 = () => [];
function RoutesComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 10);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_7_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showCreateForm.set(!ctx_r1.showCreateForm()));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.showCreateForm() ? "close" : "add_location");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.showCreateForm() ? "Cerrar" : "Nueva Ruta", " ");
  }
}
function RoutesComponent_Conditional_25_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "mat-icon", 59);
    \u0275\u0275text(2, "auto_awesome");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 60);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate((tmp_3_0 = ctx_r1.createForm.get("nombre_previsto")) == null ? null : tmp_3_0.value);
  }
}
function RoutesComponent_Conditional_25_Conditional_0_For_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r5 = ctx.$implicit;
    \u0275\u0275property("value", s_r5.nombre);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r5.nombre);
  }
}
function RoutesComponent_Conditional_25_Conditional_0_For_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r6 = ctx.$implicit;
    \u0275\u0275property("value", c_r6.nombre);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r6.nombre);
  }
}
function RoutesComponent_Conditional_25_Conditional_0_Conditional_70_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cl_r7 = ctx.$implicit;
    \u0275\u0275property("value", cl_r7.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(cl_r7.nombre);
  }
}
function RoutesComponent_Conditional_25_Conditional_0_Conditional_70_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 51)(1, "div", 61)(2, "label", 62)(3, "mat-icon", 46);
    \u0275\u0275text(4, "person_pin");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " Cliente exclusivo ");
    \u0275\u0275elementStart(6, "span", 37);
    \u0275\u0275text(7, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 16)(9, "select", 63)(10, "option", 48);
    \u0275\u0275text(11, "Seleccionar cliente...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(12, RoutesComponent_Conditional_25_Conditional_0_Conditional_70_For_13_Template, 2, 2, "option", 19, _forTrack02);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "mat-icon", 42);
    \u0275\u0275text(15, "expand_more");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "p", 64);
    \u0275\u0275text(17, "Las rutas Exclusivas trabajan un \xFAnico cliente; se precargar\xE1 al asignar PDV.");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(12);
    \u0275\u0275repeater(ctx_r1.clients());
  }
}
function RoutesComponent_Conditional_25_Conditional_0_Conditional_90_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 65);
    \u0275\u0275text(1, " Creando... ");
  }
}
function RoutesComponent_Conditional_25_Conditional_0_Conditional_91_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 66);
    \u0275\u0275text(1, "rocket_launch");
    \u0275\u0275elementEnd();
    \u0275\u0275text(2, " Crear Ruta ");
  }
}
function RoutesComponent_Conditional_25_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 24)(2, "div", 25)(3, "div", 26)(4, "mat-icon", 27);
    \u0275\u0275text(5, "alt_route");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "h3", 28);
    \u0275\u0275text(8, "Nueva Ruta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 29);
    \u0275\u0275text(10, "El nombre se asigna autom\xE1ticamente seg\xFAn el tipo");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(11, RoutesComponent_Conditional_25_Conditional_0_Conditional_11_Template, 5, 1, "div", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 31)(13, "form", 32);
    \u0275\u0275listener("ngSubmit", function RoutesComponent_Conditional_25_Conditional_0_Template_form_ngSubmit_13_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.createRoute());
    });
    \u0275\u0275elementStart(14, "div", 33)(15, "div", 34)(16, "label", 35)(17, "mat-icon", 36);
    \u0275\u0275text(18, "category");
    \u0275\u0275elementEnd();
    \u0275\u0275text(19, " Tipo ");
    \u0275\u0275elementStart(20, "span", 37);
    \u0275\u0275text(21, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 16)(23, "select", 38);
    \u0275\u0275listener("change", function RoutesComponent_Conditional_25_Conditional_0_Template_select_change_23_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onTipoChange($event.target.value));
    });
    \u0275\u0275elementStart(24, "option", 39);
    \u0275\u0275text(25, "E \u2014 Exclusiva");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "option", 40);
    \u0275\u0275text(27, "T \u2014 Tradex");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "option", 41);
    \u0275\u0275text(29, "A \u2014 Auditor\xEDa");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "mat-icon", 42);
    \u0275\u0275text(31, "expand_more");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(32, "div", 34)(33, "label", 43)(34, "span", 44)(35, "mat-icon", 36);
    \u0275\u0275text(36, "business_center");
    \u0275\u0275elementEnd();
    \u0275\u0275text(37, " Servicio ");
    \u0275\u0275elementStart(38, "span", 37);
    \u0275\u0275text(39, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "button", 45);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_25_Conditional_0_Template_button_click_40_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openCatalogModal("servicios"));
    });
    \u0275\u0275elementStart(41, "mat-icon", 46);
    \u0275\u0275text(42, "settings");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(43, "div", 16)(44, "select", 47)(45, "option", 48);
    \u0275\u0275text(46, "Seleccionar...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(47, RoutesComponent_Conditional_25_Conditional_0_For_48_Template, 2, 2, "option", 19, _forTrack02);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "mat-icon", 42);
    \u0275\u0275text(50, "expand_more");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(51, "div", 34)(52, "label", 43)(53, "span", 44)(54, "mat-icon", 36);
    \u0275\u0275text(55, "grid_view");
    \u0275\u0275elementEnd();
    \u0275\u0275text(56, " Cuadrante ");
    \u0275\u0275elementStart(57, "span", 37);
    \u0275\u0275text(58, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(59, "button", 49);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_25_Conditional_0_Template_button_click_59_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openCatalogModal("cuadrantes"));
    });
    \u0275\u0275elementStart(60, "mat-icon", 46);
    \u0275\u0275text(61, "settings");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(62, "div", 16)(63, "select", 50)(64, "option", 48);
    \u0275\u0275text(65, "Seleccionar...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(66, RoutesComponent_Conditional_25_Conditional_0_For_67_Template, 2, 2, "option", 19, _forTrack02);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "mat-icon", 42);
    \u0275\u0275text(69, "expand_more");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275template(70, RoutesComponent_Conditional_25_Conditional_0_Conditional_70_Template, 18, 0, "div", 51);
    \u0275\u0275elementStart(71, "div", 52)(72, "div", 34)(73, "label", 35)(74, "mat-icon", 36);
    \u0275\u0275text(75, "manage_accounts");
    \u0275\u0275elementEnd();
    \u0275\u0275text(76, " Coordinador Principal ");
    \u0275\u0275elementStart(77, "span", 37);
    \u0275\u0275text(78, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(79, "input", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(80, "div", 34)(81, "label", 35)(82, "mat-icon", 54);
    \u0275\u0275text(83, "person_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275text(84, " Coordinador Secundario ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(85, "input", 55);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(86, "div", 56)(87, "button", 57);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_25_Conditional_0_Template_button_click_87_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.showCreateForm.set(false));
    });
    \u0275\u0275text(88, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(89, "button", 58);
    \u0275\u0275template(90, RoutesComponent_Conditional_25_Conditional_0_Conditional_90_Template, 2, 0)(91, RoutesComponent_Conditional_25_Conditional_0_Conditional_91_Template, 3, 0);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(11);
    \u0275\u0275conditional(11, ((tmp_2_0 = ctx_r1.createForm.get("nombre_previsto")) == null ? null : tmp_2_0.value) ? 11 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("formGroup", ctx_r1.createForm);
    \u0275\u0275advance(34);
    \u0275\u0275repeater(ctx_r1.servicios());
    \u0275\u0275advance(19);
    \u0275\u0275repeater(ctx_r1.cuadrantes());
    \u0275\u0275advance(4);
    \u0275\u0275conditional(70, ctx_r1.isExclusiva ? 70 : -1);
    \u0275\u0275advance(19);
    \u0275\u0275property("disabled", ctx_r1.createForm.invalid || ctx_r1.saving());
    \u0275\u0275advance();
    \u0275\u0275conditional(90, ctx_r1.saving() ? 90 : 91);
  }
}
function RoutesComponent_Conditional_25_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r8 = ctx.$implicit;
    \u0275\u0275property("value", c_r8.nombre);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r8.nombre);
  }
}
function RoutesComponent_Conditional_25_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cl_r9 = ctx.$implicit;
    \u0275\u0275property("value", cl_r9);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(cl_r9);
  }
}
function RoutesComponent_Conditional_25_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 67);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_25_Conditional_22_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.clearFilters());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "filter_alt_off");
    \u0275\u0275elementEnd()();
  }
}
function RoutesComponent_Conditional_25_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275element(1, "mat-spinner", 68);
    \u0275\u0275elementStart(2, "p", 69);
    \u0275\u0275text(3, "Cargando rutas...");
    \u0275\u0275elementEnd()();
  }
}
function RoutesComponent_Conditional_25_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 70)(1, "div", 71)(2, "mat-icon", 72);
    \u0275\u0275text(3, "route");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 73);
    \u0275\u0275text(5, "No se encontraron rutas.");
    \u0275\u0275elementEnd()()();
  }
}
function RoutesComponent_Conditional_25_Conditional_27_For_2_Conditional_16_span_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r12 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \xB7 ", r_r12.coordinador_2, "");
  }
}
function RoutesComponent_Conditional_25_Conditional_27_For_2_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 83)(1, "mat-icon", 46);
    \u0275\u0275text(2, "manage_accounts");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275template(4, RoutesComponent_Conditional_25_Conditional_27_For_2_Conditional_16_span_4_Template, 2, 1, "span", 94);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r12 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r12.coordinador_1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", r_r12.coordinador_2);
  }
}
function RoutesComponent_Conditional_25_Conditional_27_For_2_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 85);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r13 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r13);
  }
}
function RoutesComponent_Conditional_25_Conditional_27_For_2_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 86);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_13_0;
    const r_r12 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("+", ((tmp_13_0 = r_r12.clientes) !== null && tmp_13_0 !== void 0 ? tmp_13_0 : \u0275\u0275pureFunction0(1, _c03)).length - 4, "");
  }
}
function RoutesComponent_Conditional_25_Conditional_27_For_2_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 87);
    \u0275\u0275text(1, "Sin clientes asociados");
    \u0275\u0275elementEnd();
  }
}
function RoutesComponent_Conditional_25_Conditional_27_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 75)(1, "div", 76)(2, "span", 77);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 78);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 79)(7, "div", 80)(8, "mat-icon", 81);
    \u0275\u0275text(9, "place");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div")(12, "span", 82)(13, "mat-icon", 46);
    \u0275\u0275text(14, "grid_view");
    \u0275\u0275elementEnd();
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(16, RoutesComponent_Conditional_25_Conditional_27_For_2_Conditional_16_Template, 5, 2, "div", 83);
    \u0275\u0275elementStart(17, "div", 84);
    \u0275\u0275repeaterCreate(18, RoutesComponent_Conditional_25_Conditional_27_For_2_For_19_Template, 2, 1, "span", 85, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275template(20, RoutesComponent_Conditional_25_Conditional_27_For_2_Conditional_20_Template, 2, 2, "span", 86)(21, RoutesComponent_Conditional_25_Conditional_27_For_2_Conditional_21_Template, 2, 0, "span", 87);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 88)(23, "button", 89);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_25_Conditional_27_For_2_Template_button_click_23_listener() {
      const r_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.viewPoints(r_r12));
    });
    \u0275\u0275elementStart(24, "mat-icon", 8);
    \u0275\u0275text(25, "visibility");
    \u0275\u0275elementEnd();
    \u0275\u0275text(26, " Ver Detalles ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 90)(28, "button", 91);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_25_Conditional_27_For_2_Template_button_click_28_listener() {
      const r_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.viewPoints(r_r12, true));
    });
    \u0275\u0275elementStart(29, "mat-icon", 8);
    \u0275\u0275text(30, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "button", 92);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_25_Conditional_27_For_2_Template_button_click_31_listener() {
      const r_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.duplicateRoute(r_r12));
    });
    \u0275\u0275elementStart(32, "mat-icon", 8);
    \u0275\u0275text(33, "content_copy");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "button", 93);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_25_Conditional_27_For_2_Template_button_click_34_listener() {
      const r_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.deleteRoute(r_r12));
    });
    \u0275\u0275elementStart(35, "mat-icon", 8);
    \u0275\u0275text(36, "delete");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_14_0;
    let tmp_17_0;
    let tmp_18_0;
    let tmp_19_0;
    const r_r12 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r12.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r12.servicio || "\u2014");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", (tmp_14_0 = r_r12.puntos_count) !== null && tmp_14_0 !== void 0 ? tmp_14_0 : 0, " puntos ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", r_r12.region || r_r12.cuadrante || "Sin regi\xF3n", " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(16, r_r12.coordinador_1 ? 16 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(((tmp_17_0 = r_r12.clientes) !== null && tmp_17_0 !== void 0 ? tmp_17_0 : \u0275\u0275pureFunction0(7, _c03)).slice(0, 4));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(20, ((tmp_18_0 = r_r12.clientes) !== null && tmp_18_0 !== void 0 ? tmp_18_0 : \u0275\u0275pureFunction0(8, _c03)).length > 4 ? 20 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(21, ((tmp_19_0 = r_r12.clientes) !== null && tmp_19_0 !== void 0 ? tmp_19_0 : \u0275\u0275pureFunction0(9, _c03)).length === 0 ? 21 : -1);
  }
}
function RoutesComponent_Conditional_25_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 74);
    \u0275\u0275repeaterCreate(1, RoutesComponent_Conditional_25_Conditional_27_For_2_Template, 37, 10, "div", 75, _forTrack02);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.filteredRoutes);
  }
}
function RoutesComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275template(0, RoutesComponent_Conditional_25_Conditional_0_Template, 92, 5, "div", 11);
    \u0275\u0275elementStart(1, "div", 12)(2, "div", 13)(3, "mat-icon", 14);
    \u0275\u0275text(4, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "input", 15);
    \u0275\u0275twoWayListener("ngModelChange", function RoutesComponent_Conditional_25_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.searchTerm, $event) || (ctx_r1.searchTerm = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 16)(7, "select", 17);
    \u0275\u0275twoWayListener("ngModelChange", function RoutesComponent_Conditional_25_Template_select_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filterCuadrante, $event) || (ctx_r1.filterCuadrante = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(8, "option", 18);
    \u0275\u0275text(9, "Todas las regiones");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(10, RoutesComponent_Conditional_25_For_11_Template, 2, 2, "option", 19, _forTrack02);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "mat-icon", 20);
    \u0275\u0275text(13, "expand_more");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 16)(15, "select", 17);
    \u0275\u0275twoWayListener("ngModelChange", function RoutesComponent_Conditional_25_Template_select_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.filterCliente, $event) || (ctx_r1.filterCliente = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(16, "option", 18);
    \u0275\u0275text(17, "Todos los clientes");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(18, RoutesComponent_Conditional_25_For_19_Template, 2, 2, "option", 19, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "mat-icon", 20);
    \u0275\u0275text(21, "expand_more");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(22, RoutesComponent_Conditional_25_Conditional_22_Template, 3, 0, "button", 21);
    \u0275\u0275elementStart(23, "span", 22);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(25, RoutesComponent_Conditional_25_Conditional_25_Template, 4, 0, "div", 23)(26, RoutesComponent_Conditional_25_Conditional_26_Template, 6, 0)(27, RoutesComponent_Conditional_25_Conditional_27_Template, 3, 0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(0, ctx_r1.showCreateForm() ? 0 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.searchTerm);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filterCuadrante);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.cuadrantes());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.filterCliente);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.clienteOptions);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(22, ctx_r1.searchTerm || ctx_r1.filterCuadrante || ctx_r1.filterCliente ? 22 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r1.filteredRoutes.length, " de ", ctx_r1.routes().length, " rutas");
    \u0275\u0275advance();
    \u0275\u0275conditional(25, ctx_r1.loading() ? 25 : ctx_r1.filteredRoutes.length === 0 ? 26 : 27);
  }
}
function RoutesComponent_Conditional_26_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r15 = ctx.$implicit;
    \u0275\u0275property("value", t_r15);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r15);
  }
}
function RoutesComponent_Conditional_26_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275element(1, "mat-spinner", 68);
    \u0275\u0275elementStart(2, "p", 69);
    \u0275\u0275text(3, "Cargando mercaderistas...");
    \u0275\u0275elementEnd()();
  }
}
function RoutesComponent_Conditional_26_Conditional_17_For_2_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 109)(1, "mat-icon", 110);
    \u0275\u0275text(2, "phone");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r17 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", m_r17.telefono, " ");
  }
}
function RoutesComponent_Conditional_26_Conditional_17_For_2_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 109)(1, "mat-icon", 110);
    \u0275\u0275text(2, "email");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r17 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", m_r17.email, " ");
  }
}
function RoutesComponent_Conditional_26_Conditional_17_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 99)(1, "div", 101)(2, "div", 102)(3, "div", 103)(4, "mat-icon", 104);
    \u0275\u0275text(5, "person");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "h3", 105);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 106);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "span", 107);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 108);
    \u0275\u0275template(14, RoutesComponent_Conditional_26_Conditional_17_For_2_Conditional_14_Template, 4, 1, "div", 109)(15, RoutesComponent_Conditional_26_Conditional_17_For_2_Conditional_15_Template, 4, 1, "div", 109);
    \u0275\u0275elementStart(16, "div", 109)(17, "mat-icon", 110);
    \u0275\u0275text(18, "badge");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 111);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 112)(22, "mat-icon", 81);
    \u0275\u0275text(23, "route");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span", 113);
    \u0275\u0275text(25, "Rutas Asignadas:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span", 114);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "button", 89);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_26_Conditional_17_For_2_Template_button_click_28_listener() {
      const m_r17 = \u0275\u0275restoreView(_r16).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openPanel(m_r17));
    });
    \u0275\u0275elementStart(29, "mat-icon", 8);
    \u0275\u0275text(30, "edit_note");
    \u0275\u0275elementEnd();
    \u0275\u0275text(31, " Administrar Rutas ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const m_r17 = ctx.$implicit;
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(m_r17.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r17.cedula);
    \u0275\u0275advance();
    \u0275\u0275classMap(m_r17.activo ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", m_r17.activo ? "Activo" : "Inactivo", " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(14, m_r17.telefono ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(15, m_r17.email ? 15 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(m_r17.tipo);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(m_r17.rutas_count);
  }
}
function RoutesComponent_Conditional_26_Conditional_17_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 100)(1, "div", 71)(2, "mat-icon", 72);
    \u0275\u0275text(3, "person_search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 73);
    \u0275\u0275text(5, "No se encontraron mercaderistas");
    \u0275\u0275elementEnd()()();
  }
}
function RoutesComponent_Conditional_26_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 74);
    \u0275\u0275repeaterCreate(1, RoutesComponent_Conditional_26_Conditional_17_For_2_Template, 32, 9, "div", 99, _forTrack02);
    \u0275\u0275template(3, RoutesComponent_Conditional_26_Conditional_17_Conditional_3_Template, 6, 0, "div", 100);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.filteredMercaderistas);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(3, ctx_r1.filteredMercaderistas.length === 0 && !ctx_r1.mercLoading() ? 3 : -1);
  }
}
function RoutesComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 95)(1, "div", 13)(2, "mat-icon", 14);
    \u0275\u0275text(3, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 96);
    \u0275\u0275twoWayListener("ngModelChange", function RoutesComponent_Conditional_26_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.mercSearch, $event) || (ctx_r1.mercSearch = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 16)(6, "select", 97);
    \u0275\u0275twoWayListener("ngModelChange", function RoutesComponent_Conditional_26_Template_select_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.mercFilterTipo, $event) || (ctx_r1.mercFilterTipo = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(7, "option", 18);
    \u0275\u0275text(8, "Todos los tipos");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(9, RoutesComponent_Conditional_26_For_10_Template, 2, 2, "option", 19, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "mat-icon", 20);
    \u0275\u0275text(12, "expand_more");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "button", 98);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_26_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadMercaderistas());
    });
    \u0275\u0275elementStart(14, "mat-icon");
    \u0275\u0275text(15, "refresh");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(16, RoutesComponent_Conditional_26_Conditional_16_Template, 4, 0, "div", 23)(17, RoutesComponent_Conditional_26_Conditional_17_Template, 4, 1);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.mercSearch);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.mercFilterTipo);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.mercTipos);
    \u0275\u0275advance(7);
    \u0275\u0275conditional(16, ctx_r1.mercLoading() ? 16 : 17);
  }
}
function RoutesComponent_Conditional_27_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275element(1, "mat-spinner", 68);
    \u0275\u0275elementStart(2, "p", 69);
    \u0275\u0275text(3, "Cargando analistas...");
    \u0275\u0275elementEnd()();
  }
}
function RoutesComponent_Conditional_27_Conditional_5_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 99)(1, "div", 117)(2, "div", 118)(3, "mat-icon", 119);
    \u0275\u0275text(4, "analytics");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "h3", 105);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 120)(8, "div", 121)(9, "mat-icon", 81);
    \u0275\u0275text(10, "alt_route");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 122);
    \u0275\u0275text(12, "Rutas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 114);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 121)(16, "mat-icon", 123);
    \u0275\u0275text(17, "groups");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 122);
    \u0275\u0275text(19, "Clientes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span", 124);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "button", 125);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_27_Conditional_5_For_2_Template_button_click_22_listener() {
      const a_r20 = \u0275\u0275restoreView(_r19).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openAssignPanel(a_r20, "analista"));
    });
    \u0275\u0275elementStart(23, "mat-icon", 8);
    \u0275\u0275text(24, "edit_note");
    \u0275\u0275elementEnd();
    \u0275\u0275text(25, " Administrar ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const a_r20 = ctx.$implicit;
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(a_r20.nombre);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(a_r20.rutas_count);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(a_r20.clientes_count);
  }
}
function RoutesComponent_Conditional_27_Conditional_5_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 100)(1, "div", 71)(2, "mat-icon", 72);
    \u0275\u0275text(3, "person_search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 73);
    \u0275\u0275text(5, "No se encontraron analistas");
    \u0275\u0275elementEnd()()();
  }
}
function RoutesComponent_Conditional_27_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 74);
    \u0275\u0275repeaterCreate(1, RoutesComponent_Conditional_27_Conditional_5_For_2_Template, 26, 3, "div", 99, _forTrack02);
    \u0275\u0275template(3, RoutesComponent_Conditional_27_Conditional_5_Conditional_3_Template, 6, 0, "div", 100);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.filteredAnalysts);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(3, ctx_r1.filteredAnalysts.length === 0 ? 3 : -1);
  }
}
function RoutesComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 115)(1, "mat-icon", 14);
    \u0275\u0275text(2, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 116);
    \u0275\u0275twoWayListener("ngModelChange", function RoutesComponent_Conditional_27_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.analystSearch, $event) || (ctx_r1.analystSearch = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(4, RoutesComponent_Conditional_27_Conditional_4_Template, 4, 0, "div", 23)(5, RoutesComponent_Conditional_27_Conditional_5_Template, 4, 1);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.analystSearch);
    \u0275\u0275advance();
    \u0275\u0275conditional(4, ctx_r1.analystLoading() ? 4 : 5);
  }
}
function RoutesComponent_Conditional_28_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275element(1, "mat-spinner", 68);
    \u0275\u0275elementStart(2, "p", 69);
    \u0275\u0275text(3, "Cargando supervisores...");
    \u0275\u0275elementEnd()();
  }
}
function RoutesComponent_Conditional_28_Conditional_5_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 127)(1, "div", 117)(2, "div", 128)(3, "mat-icon", 129);
    \u0275\u0275text(4, "supervisor_account");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "h3", 105);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 120)(8, "div", 121)(9, "mat-icon", 81);
    \u0275\u0275text(10, "alt_route");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 122);
    \u0275\u0275text(12, "Rutas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 114);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 121)(16, "mat-icon", 123);
    \u0275\u0275text(17, "groups");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 122);
    \u0275\u0275text(19, "Clientes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span", 124);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "button", 130);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_28_Conditional_5_For_2_Template_button_click_22_listener() {
      const s_r23 = \u0275\u0275restoreView(_r22).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openAssignPanel(s_r23, "supervisor"));
    });
    \u0275\u0275elementStart(23, "mat-icon", 8);
    \u0275\u0275text(24, "edit_note");
    \u0275\u0275elementEnd();
    \u0275\u0275text(25, " Administrar ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r23 = ctx.$implicit;
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(s_r23.nombre);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(s_r23.rutas_count);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(s_r23.clientes_count);
  }
}
function RoutesComponent_Conditional_28_Conditional_5_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 100)(1, "div", 71)(2, "mat-icon", 72);
    \u0275\u0275text(3, "person_search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 73);
    \u0275\u0275text(5, "No se encontraron supervisores");
    \u0275\u0275elementEnd()()();
  }
}
function RoutesComponent_Conditional_28_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 74);
    \u0275\u0275repeaterCreate(1, RoutesComponent_Conditional_28_Conditional_5_For_2_Template, 26, 3, "div", 127, _forTrack02);
    \u0275\u0275template(3, RoutesComponent_Conditional_28_Conditional_5_Conditional_3_Template, 6, 0, "div", 100);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.filteredSupervisors);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(3, ctx_r1.filteredSupervisors.length === 0 ? 3 : -1);
  }
}
function RoutesComponent_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 115)(1, "mat-icon", 14);
    \u0275\u0275text(2, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 126);
    \u0275\u0275twoWayListener("ngModelChange", function RoutesComponent_Conditional_28_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r21);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.supervisorSearch, $event) || (ctx_r1.supervisorSearch = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(4, RoutesComponent_Conditional_28_Conditional_4_Template, 4, 0, "div", 23)(5, RoutesComponent_Conditional_28_Conditional_5_Template, 4, 1);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.supervisorSearch);
    \u0275\u0275advance();
    \u0275\u0275conditional(4, ctx_r1.supervisorLoading() ? 4 : 5);
  }
}
function RoutesComponent_Conditional_29_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 145)(1, "mat-icon", 154);
    \u0275\u0275text(2, "route");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 155);
    \u0275\u0275text(4, "Sin rutas asignadas");
    \u0275\u0275elementEnd()();
  }
}
function RoutesComponent_Conditional_29_Conditional_25_For_1_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 159);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r26 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r26.servicio);
  }
}
function RoutesComponent_Conditional_29_Conditional_25_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 156)(1, "div", 157)(2, "p", 158);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, RoutesComponent_Conditional_29_Conditional_25_For_1_Conditional_4_Template, 2, 1, "p", 159);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 160)(6, "select", 161);
    \u0275\u0275listener("ngModelChange", function RoutesComponent_Conditional_29_Conditional_25_For_1_Template_select_ngModelChange_6_listener($event) {
      const r_r26 = \u0275\u0275restoreView(_r25).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.setTipoRuta(r_r26.id, $event));
    });
    \u0275\u0275elementStart(7, "option", 162);
    \u0275\u0275text(8, "Variable");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "option", 163);
    \u0275\u0275text(10, "Fija");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "mat-icon", 164);
    \u0275\u0275text(12, "expand_more");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "button", 165);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_29_Conditional_25_For_1_Template_button_click_13_listener() {
      const r_r26 = \u0275\u0275restoreView(_r25).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.removeRoute(r_r26.id));
    });
    \u0275\u0275elementStart(14, "mat-icon", 46);
    \u0275\u0275text(15, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const r_r26 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r26.nombre);
    \u0275\u0275advance();
    \u0275\u0275conditional(4, r_r26.servicio ? 4 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", r_r26.tipo_ruta);
  }
}
function RoutesComponent_Conditional_29_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, RoutesComponent_Conditional_29_Conditional_25_For_1_Template, 16, 3, "div", 156, _forTrack02);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(ctx_r1.assignedRoutes());
  }
}
function RoutesComponent_Conditional_29_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 145)(1, "mat-icon", 154);
    \u0275\u0275text(2, "done_all");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 155);
    \u0275\u0275text(4, "Todas las rutas est\xE1n asignadas");
    \u0275\u0275elementEnd()();
  }
}
function RoutesComponent_Conditional_29_Conditional_39_For_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 159);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r28 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r28.servicio);
  }
}
function RoutesComponent_Conditional_29_Conditional_39_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 167);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_29_Conditional_39_For_1_Template_div_click_0_listener() {
      const r_r28 = \u0275\u0275restoreView(_r27).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.addRoute(r_r28));
    });
    \u0275\u0275elementStart(1, "div", 168)(2, "mat-icon", 169);
    \u0275\u0275text(3, "check");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 157)(5, "p", 158);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, RoutesComponent_Conditional_29_Conditional_39_For_1_Conditional_7_Template, 2, 1, "p", 159);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r28 = ctx.$implicit;
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(r_r28.nombre);
    \u0275\u0275advance();
    \u0275\u0275conditional(7, r_r28.servicio ? 7 : -1);
  }
}
function RoutesComponent_Conditional_29_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, RoutesComponent_Conditional_29_Conditional_39_For_1_Template, 8, 2, "div", 166, _forTrack02);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(ctx_r1.availableRoutes);
  }
}
function RoutesComponent_Conditional_29_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 153);
  }
}
function RoutesComponent_Conditional_29_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 8);
    \u0275\u0275text(1, "save");
    \u0275\u0275elementEnd();
  }
}
function RoutesComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 131);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_29_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closePanel());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 132)(3, "div", 133)(4, "div", 102)(5, "div", 134)(6, "mat-icon", 135);
    \u0275\u0275text(7, "edit_note");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div")(9, "h3", 136);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "p", 137);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "button", 138);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_29_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closePanel());
    });
    \u0275\u0275elementStart(14, "mat-icon");
    \u0275\u0275text(15, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "div", 139)(17, "div", 140)(18, "div", 141)(19, "mat-icon", 142);
    \u0275\u0275text(20, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 143);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 144);
    \u0275\u0275template(24, RoutesComponent_Conditional_29_Conditional_24_Template, 5, 0, "div", 145)(25, RoutesComponent_Conditional_29_Conditional_25_Template, 2, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 146)(27, "div", 147)(28, "mat-icon", 142);
    \u0275\u0275text(29, "add_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "span", 143);
    \u0275\u0275text(31, "Rutas Disponibles");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 148)(33, "div", 16)(34, "mat-icon", 14);
    \u0275\u0275text(35, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "input", 149);
    \u0275\u0275twoWayListener("ngModelChange", function RoutesComponent_Conditional_29_Template_input_ngModelChange_36_listener($event) {
      \u0275\u0275restoreView(_r24);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.panelRouteSearch, $event) || (ctx_r1.panelRouteSearch = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(37, "div", 144);
    \u0275\u0275template(38, RoutesComponent_Conditional_29_Conditional_38_Template, 5, 0, "div", 145)(39, RoutesComponent_Conditional_29_Conditional_39_Template, 2, 0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(40, "div", 150)(41, "button", 151);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_29_Template_button_click_41_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closePanel());
    });
    \u0275\u0275text(42, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "button", 152);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_29_Template_button_click_43_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveRoutes());
    });
    \u0275\u0275template(44, RoutesComponent_Conditional_29_Conditional_44_Template, 1, 0, "mat-spinner", 153)(45, RoutesComponent_Conditional_29_Conditional_45_Template, 2, 0);
    \u0275\u0275text(46, " Guardar Asignaciones ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate1("", (tmp_1_0 = ctx_r1.selectedMerc()) == null ? null : tmp_1_0.nombre, " \u2014 Asignar Rutas");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_2_0 = ctx_r1.selectedMerc()) == null ? null : tmp_2_0.cedula);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate1("Rutas Asignadas (", ctx_r1.assignedRoutes().length, ")");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(24, ctx_r1.assignedRoutes().length === 0 ? 24 : 25);
    \u0275\u0275advance(12);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.panelRouteSearch);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(38, ctx_r1.availableRoutes.length === 0 ? 38 : 39);
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", ctx_r1.panelSaving());
    \u0275\u0275advance();
    \u0275\u0275conditional(44, ctx_r1.panelSaving() ? 44 : 45);
  }
}
function RoutesComponent_Conditional_30_For_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 121)(1, "input", 178, 0);
    \u0275\u0275listener("keyup.enter", function RoutesComponent_Conditional_30_For_21_Template_input_keyup_enter_1_listener() {
      const it_r31 = \u0275\u0275restoreView(_r30).$implicit;
      const nm_r32 = \u0275\u0275reference(2);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.renameCatalogItem(it_r31, nm_r32.value));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 179);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_30_For_21_Template_button_click_3_listener() {
      const it_r31 = \u0275\u0275restoreView(_r30).$implicit;
      const nm_r32 = \u0275\u0275reference(2);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.renameCatalogItem(it_r31, nm_r32.value));
    });
    \u0275\u0275elementStart(4, "mat-icon", 8);
    \u0275\u0275text(5, "save");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "button", 180);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_30_For_21_Template_button_click_6_listener() {
      const it_r31 = \u0275\u0275restoreView(_r30).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteCatalogItem(it_r31));
    });
    \u0275\u0275elementStart(7, "mat-icon", 8);
    \u0275\u0275text(8, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const it_r31 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("value", it_r31.nombre);
  }
}
function RoutesComponent_Conditional_30_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 175);
    \u0275\u0275text(1, "Sin elementos. Agrega el primero arriba.");
    \u0275\u0275elementEnd();
  }
}
function RoutesComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 131);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_30_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeCatalogModal());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 170)(3, "div", 133)(4, "div", 102)(5, "div", 134)(6, "mat-icon", 135);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "h3", 136);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "button", 138);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_30_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeCatalogModal());
    });
    \u0275\u0275elementStart(11, "mat-icon");
    \u0275\u0275text(12, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "div", 171)(14, "input", 172);
    \u0275\u0275twoWayListener("ngModelChange", function RoutesComponent_Conditional_30_Template_input_ngModelChange_14_listener($event) {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.catalogNewName, $event) || (ctx_r1.catalogNewName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("keyup.enter", function RoutesComponent_Conditional_30_Template_input_keyup_enter_14_listener() {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addCatalogItem());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "button", 173);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_30_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addCatalogItem());
    });
    \u0275\u0275elementStart(16, "mat-icon", 8);
    \u0275\u0275text(17, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(18, " Agregar ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 174);
    \u0275\u0275repeaterCreate(20, RoutesComponent_Conditional_30_For_21_Template, 9, 1, "div", 121, _forTrack02);
    \u0275\u0275template(22, RoutesComponent_Conditional_30_Conditional_22_Template, 2, 0, "p", 175);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "div", 176)(24, "button", 177);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_30_Template_button_click_24_listener() {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeCatalogModal());
    });
    \u0275\u0275text(25, "Listo");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.catalogKind() === "cuadrantes" ? "grid_view" : "business_center");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.catalogKind() === "cuadrantes" ? "Cuadrantes" : "Servicios");
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.catalogNewName);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.catalogSaving() || !ctx_r1.catalogNewName.trim());
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r1.catalogItems);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(22, ctx_r1.catalogItems.length === 0 ? 22 : -1);
  }
}
function RoutesComponent_Conditional_31_Conditional_22_For_9_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 159);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r36 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r36.servicio);
  }
}
function RoutesComponent_Conditional_31_Conditional_22_For_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r35 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 184)(1, "div", 157)(2, "p", 158);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, RoutesComponent_Conditional_31_Conditional_22_For_9_Conditional_4_Template, 2, 1, "p", 159);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 191);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_31_Conditional_22_For_9_Template_button_click_5_listener() {
      const r_r36 = \u0275\u0275restoreView(_r35).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.removeAnalystRoute(r_r36.id));
    });
    \u0275\u0275elementStart(6, "mat-icon", 46);
    \u0275\u0275text(7, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const r_r36 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r36.nombre);
    \u0275\u0275advance();
    \u0275\u0275conditional(4, r_r36.servicio ? 4 : -1);
  }
}
function RoutesComponent_Conditional_31_Conditional_22_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 185)(1, "mat-icon", 154);
    \u0275\u0275text(2, "route");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 155);
    \u0275\u0275text(4, "Sin rutas");
    \u0275\u0275elementEnd()();
  }
}
function RoutesComponent_Conditional_31_Conditional_22_For_21_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 159);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r38 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r38.servicio);
  }
}
function RoutesComponent_Conditional_31_Conditional_22_For_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r37 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 192);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_31_Conditional_22_For_21_Template_div_click_0_listener() {
      const r_r38 = \u0275\u0275restoreView(_r37).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.addAnalystRoute(r_r38));
    });
    \u0275\u0275elementStart(1, "mat-icon", 193);
    \u0275\u0275text(2, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 157)(4, "p", 158);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, RoutesComponent_Conditional_31_Conditional_22_For_21_Conditional_6_Template, 2, 1, "p", 159);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r38 = ctx.$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(r_r38.nombre);
    \u0275\u0275advance();
    \u0275\u0275conditional(6, r_r38.servicio ? 6 : -1);
  }
}
function RoutesComponent_Conditional_31_Conditional_22_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 153);
  }
}
function RoutesComponent_Conditional_31_Conditional_22_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 8);
    \u0275\u0275text(1, "save");
    \u0275\u0275elementEnd();
  }
}
function RoutesComponent_Conditional_31_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 183)(1, "div", 140)(2, "div", 141)(3, "mat-icon", 142);
    \u0275\u0275text(4, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 143);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 144);
    \u0275\u0275repeaterCreate(8, RoutesComponent_Conditional_31_Conditional_22_For_9_Template, 8, 2, "div", 184, _forTrack02);
    \u0275\u0275template(10, RoutesComponent_Conditional_31_Conditional_22_Conditional_10_Template, 5, 0, "div", 185);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 146)(12, "div", 147)(13, "mat-icon", 142);
    \u0275\u0275text(14, "add_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 143);
    \u0275\u0275text(16, "Rutas Disponibles");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 148)(18, "input", 186);
    \u0275\u0275twoWayListener("ngModelChange", function RoutesComponent_Conditional_31_Conditional_22_Template_input_ngModelChange_18_listener($event) {
      \u0275\u0275restoreView(_r34);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.analystRouteSearch, $event) || (ctx_r1.analystRouteSearch = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 144);
    \u0275\u0275repeaterCreate(20, RoutesComponent_Conditional_31_Conditional_22_For_21_Template, 7, 2, "div", 187, _forTrack02);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 188)(23, "button", 189);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_31_Conditional_22_Template_button_click_23_listener() {
      \u0275\u0275restoreView(_r34);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeAnalystPanel());
    });
    \u0275\u0275text(24, "Cerrar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "button", 190);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_31_Conditional_22_Template_button_click_25_listener() {
      \u0275\u0275restoreView(_r34);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.saveAnalystRoutes());
    });
    \u0275\u0275template(26, RoutesComponent_Conditional_31_Conditional_22_Conditional_26_Template, 1, 0, "mat-spinner", 153)(27, RoutesComponent_Conditional_31_Conditional_22_Conditional_27_Template, 2, 0);
    \u0275\u0275text(28, " Guardar Rutas ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("Rutas Asignadas (", ctx_r1.assignedAnalystRoutes().length, ")");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.assignedAnalystRoutes());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(10, ctx_r1.assignedAnalystRoutes().length === 0 ? 10 : -1);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.analystRouteSearch);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.availableAnalystRoutes);
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", ctx_r1.analystPanelSaving());
    \u0275\u0275advance();
    \u0275\u0275conditional(26, ctx_r1.analystPanelSaving() ? 26 : 27);
  }
}
function RoutesComponent_Conditional_31_Conditional_23_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 196)(1, "mat-icon", 154);
    \u0275\u0275text(2, "person_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 155);
    \u0275\u0275text(4, "No hay clientes en las rutas asignadas");
    \u0275\u0275elementEnd()();
  }
}
function RoutesComponent_Conditional_31_Conditional_23_Conditional_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r40 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 200);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_31_Conditional_23_Conditional_7_For_2_Template_button_click_0_listener() {
      const c_r41 = \u0275\u0275restoreView(_r40).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.toggleAnalystClient(c_r41.id));
    });
    \u0275\u0275elementStart(1, "mat-icon", 8);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 201);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r41 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngClass", ctx_r1.isAnalystClientSelected(c_r41.id) ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.isAnalystClientSelected(c_r41.id) ? "check_box" : "check_box_outline_blank");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r41.nombre);
  }
}
function RoutesComponent_Conditional_31_Conditional_23_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 198);
    \u0275\u0275repeaterCreate(1, RoutesComponent_Conditional_31_Conditional_23_Conditional_7_For_2_Template, 5, 3, "button", 199, _forTrack02);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.routeClientOptions());
  }
}
function RoutesComponent_Conditional_31_Conditional_23_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 153);
  }
}
function RoutesComponent_Conditional_31_Conditional_23_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 8);
    \u0275\u0275text(1, "save");
    \u0275\u0275elementEnd();
  }
}
function RoutesComponent_Conditional_31_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 194)(1, "div", 195)(2, "mat-icon", 8);
    \u0275\u0275text(3, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, RoutesComponent_Conditional_31_Conditional_23_Conditional_6_Template, 5, 0, "div", 196)(7, RoutesComponent_Conditional_31_Conditional_23_Conditional_7_Template, 3, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 188)(9, "button", 189);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_31_Conditional_23_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r39);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeAnalystPanel());
    });
    \u0275\u0275text(10, "Cerrar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 197);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_31_Conditional_23_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r39);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.saveAnalystClients());
    });
    \u0275\u0275template(12, RoutesComponent_Conditional_31_Conditional_23_Conditional_12_Template, 1, 0, "mat-spinner", 153)(13, RoutesComponent_Conditional_31_Conditional_23_Conditional_13_Template, 2, 0);
    \u0275\u0275text(14, " Guardar Clientes ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("Solo se listan los clientes presentes en las rutas asignadas a este ", ctx_r1.assignKindLabel.toLowerCase(), ". Ver\xE1 \xFAnicamente los clientes que marques aqu\xED, aunque sus rutas tengan m\xE1s. Guarda primero las rutas si las cambiaste.");
    \u0275\u0275advance();
    \u0275\u0275conditional(6, ctx_r1.routeClientOptions().length === 0 ? 6 : 7);
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", ctx_r1.analystPanelSaving());
    \u0275\u0275advance();
    \u0275\u0275conditional(12, ctx_r1.analystPanelSaving() ? 12 : 13);
  }
}
function RoutesComponent_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r33 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 131);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_31_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r33);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeAnalystPanel());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 132)(3, "div", 181)(4, "div", 102)(5, "div", 134)(6, "mat-icon", 135);
    \u0275\u0275text(7, "analytics");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "h3", 136);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "button", 138);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_31_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r33);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeAnalystPanel());
    });
    \u0275\u0275elementStart(11, "mat-icon");
    \u0275\u0275text(12, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "div", 182)(14, "button", 7);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_31_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r33);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.switchAnalystTab("rutas"));
    });
    \u0275\u0275elementStart(15, "mat-icon", 8);
    \u0275\u0275text(16, "alt_route");
    \u0275\u0275elementEnd();
    \u0275\u0275text(17, " Rutas ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "button", 7);
    \u0275\u0275listener("click", function RoutesComponent_Conditional_31_Template_button_click_18_listener() {
      \u0275\u0275restoreView(_r33);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.switchAnalystTab("clientes"));
    });
    \u0275\u0275elementStart(19, "mat-icon", 8);
    \u0275\u0275text(20, "groups");
    \u0275\u0275elementEnd();
    \u0275\u0275text(21, " Clientes ");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(22, RoutesComponent_Conditional_31_Conditional_22_Template, 29, 5)(23, RoutesComponent_Conditional_31_Conditional_23_Template, 15, 4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate2("", (tmp_1_0 = ctx_r1.selectedAnalyst()) == null ? null : tmp_1_0.nombre, " \xB7 ", ctx_r1.assignKindLabel, " \u2014 Asignaciones");
    \u0275\u0275advance(5);
    \u0275\u0275classMap(ctx_r1.analystTab() === "rutas" ? "bg-slate-100 dark:bg-slate-800 text-primary-600 dark:text-primary-400" : "text-slate-500");
    \u0275\u0275advance(4);
    \u0275\u0275classMap(ctx_r1.analystTab() === "clientes" ? "bg-slate-100 dark:bg-slate-800 text-primary-600 dark:text-primary-400" : "text-slate-500");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(22, ctx_r1.analystTab() === "rutas" ? 22 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(23, ctx_r1.analystTab() === "clientes" ? 23 : -1);
  }
}
var RoutesComponent = class _RoutesComponent {
  constructor(api, fb, snack, dialog) {
    this.api = api;
    this.fb = fb;
    this.snack = snack;
    this.dialog = dialog;
    this.loading = signal(true);
    this.saving = signal(false);
    this.routes = signal([]);
    this.showCreateForm = signal(false);
    this.nextNumber = signal(null);
    this.servicios = signal([]);
    this.cuadrantes = signal([]);
    this.clients = signal([]);
    this.searchTerm = "";
    this.filterCuadrante = "";
    this.filterCliente = "";
    this.createForm = this.fb.group({
      tipo: ["E", Validators.required],
      nombre_previsto: [{ value: "", disabled: true }],
      servicio: ["", Validators.required],
      coordinador_1: ["", Validators.required],
      coordinador_2: [""],
      cuadrante: ["", Validators.required],
      id_cliente_exclusivo: [""],
      activa: [true]
    });
    this.activeTab = signal("rutas");
    this.mercLoading = signal(false);
    this.mercList = signal([]);
    this.mercSearch = "";
    this.mercFilterTipo = "";
    this.panelOpen = signal(false);
    this.panelSaving = signal(false);
    this.selectedMerc = signal(null);
    this.assignedRoutes = signal([]);
    this.panelRouteSearch = "";
    this.catalogModalOpen = signal(false);
    this.catalogKind = signal("cuadrantes");
    this.catalogNewName = "";
    this.catalogSaving = signal(false);
    this.analystLoading = signal(false);
    this.analystList = signal([]);
    this.analystSearch = "";
    this.supervisorLoading = signal(false);
    this.supervisorList = signal([]);
    this.supervisorSearch = "";
    this.assignKind = signal("analista");
    this.analystPanelOpen = signal(false);
    this.analystPanelSaving = signal(false);
    this.selectedAnalyst = signal(null);
    this.analystTab = signal("rutas");
    this.assignedAnalystRoutes = signal([]);
    this.analystRouteSearch = "";
    this.routeClientOptions = signal([]);
    this.selectedAnalystClientIds = signal([]);
  }
  ngOnInit() {
    this.loadRoutes();
    this.loadCatalogs();
    this.loadClients();
    this.onTipoChange("E");
  }
  // ── Carga ─────────────────────────────────────────────────
  loadCatalogs() {
    this.api.listCatalog("servicios", true).subscribe((d) => this.servicios.set(d));
    this.api.listCatalog("cuadrantes", true).subscribe((d) => this.cuadrantes.set(d));
  }
  loadClients() {
    this.api.getClients().subscribe((d) => this.clients.set(d ?? []));
  }
  loadRoutes() {
    this.loading.set(true);
    this.api.getRoutes().subscribe({
      next: (data) => {
        this.routes.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  // ── Filtros dinámicos ─────────────────────────────────────
  get filteredRoutes() {
    const s = this.searchTerm.trim().toLowerCase();
    const cu = this.filterCuadrante;
    const cl = this.filterCliente;
    return this.routes().filter((r) => (!s || r.nombre?.toLowerCase().includes(s)) && (!cu || (r.region ?? r.cuadrante) === cu) && (!cl || (r.clientes ?? []).includes(cl)));
  }
  get clienteOptions() {
    const set = /* @__PURE__ */ new Set();
    this.routes().forEach((r) => (r.clientes ?? []).forEach((c) => set.add(c)));
    return [...set].sort();
  }
  clearFilters() {
    this.searchTerm = "";
    this.filterCuadrante = "";
    this.filterCliente = "";
  }
  // ── Crear ─────────────────────────────────────────────────
  get isExclusiva() {
    return this.createForm.get("tipo")?.value === "E";
  }
  onTipoChange(tipo) {
    if (!tipo)
      return;
    const clienteCtrl = this.createForm.get("id_cliente_exclusivo");
    if (tipo === "E") {
      clienteCtrl?.setValidators([Validators.required]);
    } else {
      clienteCtrl?.clearValidators();
      clienteCtrl?.setValue("");
    }
    clienteCtrl?.updateValueAndValidity();
    this.api.getNextRouteNumber(tipo).subscribe((data) => {
      this.nextNumber.set(data.next_number);
      this.createForm.patchValue({ nombre_previsto: `Ruta ${tipo}${data.next_number}` });
    });
  }
  createRoute() {
    if (this.createForm.invalid)
      return;
    this.saving.set(true);
    const v = this.createForm.value;
    const payload = {
      tipo: v.tipo,
      servicio: v.servicio,
      coordinador_1: v.coordinador_1,
      coordinador_2: v.coordinador_2 || null,
      cuadrante: v.cuadrante,
      id_cliente_exclusivo: v.tipo === "E" && v.id_cliente_exclusivo ? Number(v.id_cliente_exclusivo) : null
    };
    this.api.createRoute(payload).subscribe({
      next: (ruta) => {
        this.saving.set(false);
        this.routes.update((rs) => [...rs, ruta].sort((a, b) => a.nombre.localeCompare(b.nombre)));
        this.createForm.reset({ tipo: "E", activa: true });
        this.onTipoChange("E");
        this.showCreateForm.set(false);
        this.snack.open("Ruta creada exitosamente", "OK", { duration: 3e3 });
      },
      error: (err) => {
        this.saving.set(false);
        this.snack.open(err.error?.detail ?? "Error al crear ruta", "OK", { duration: 4e3 });
      }
    });
  }
  // ── Acciones de ruta ──────────────────────────────────────
  viewPoints(ruta, startEdit = false) {
    const ref = this.dialog.open(RouteDetailDialogComponent, {
      data: { ruta, startEdit },
      width: "100%",
      maxWidth: "1100px",
      panelClass: "custom-dialog"
    });
    ref.afterClosed().subscribe(() => this.loadRoutes());
  }
  duplicateRoute(ruta) {
    this.api.duplicateRoute(ruta.id).subscribe({
      next: (nueva) => {
        this.routes.update((rs) => [...rs, nueva].sort((a, b) => a.nombre.localeCompare(b.nombre)));
        this.snack.open(`Ruta duplicada como ${nueva.nombre}`, "OK", { duration: 3e3 });
      },
      error: (err) => this.snack.open(err.error?.detail ?? "Error al duplicar", "OK", { duration: 4e3 })
    });
  }
  deleteRoute(ruta) {
    if (!confirm(`\xBFEliminar la ruta ${ruta.nombre}? Se borrar\xE1n sus puntos y asignaciones.`))
      return;
    this.api.deleteRoute(ruta.id).subscribe({
      next: () => {
        this.routes.update((rs) => rs.filter((r) => r.id !== ruta.id));
        this.snack.open("Ruta eliminada", "OK", { duration: 3e3 });
      },
      error: (err) => this.snack.open(err.error?.detail ?? "Error al eliminar", "OK", { duration: 4e3 })
    });
  }
  // ── Catálogo ABM ──────────────────────────────────────────
  openCatalogModal(kind) {
    this.catalogKind.set(kind);
    this.catalogNewName = "";
    this.catalogModalOpen.set(true);
  }
  closeCatalogModal() {
    this.catalogModalOpen.set(false);
  }
  get catalogItems() {
    return this.catalogKind() === "cuadrantes" ? this.cuadrantes() : this.servicios();
  }
  refreshCatalog(kind) {
    this.api.listCatalog(kind, true).subscribe((d) => {
      if (kind === "cuadrantes")
        this.cuadrantes.set(d);
      else
        this.servicios.set(d);
    });
  }
  addCatalogItem() {
    const nombre = this.catalogNewName.trim();
    if (!nombre)
      return;
    const kind = this.catalogKind();
    this.catalogSaving.set(true);
    this.api.createCatalogItem(kind, { nombre }).subscribe({
      next: () => {
        this.catalogNewName = "";
        this.catalogSaving.set(false);
        this.refreshCatalog(kind);
      },
      error: (err) => {
        this.catalogSaving.set(false);
        this.snack.open(err.error?.detail ?? "Error", "OK", { duration: 3500 });
      }
    });
  }
  renameCatalogItem(item, nuevo) {
    const nombre = nuevo.trim();
    if (!nombre || nombre === item.nombre)
      return;
    const kind = this.catalogKind();
    this.api.updateCatalogItem(kind, item.id, { nombre }).subscribe({
      next: () => {
        this.refreshCatalog(kind);
        this.loadRoutes();
      },
      error: (err) => this.snack.open(err.error?.detail ?? "Error", "OK", { duration: 3500 })
    });
  }
  deleteCatalogItem(item) {
    const kind = this.catalogKind();
    this.api.deleteCatalogItem(kind, item.id).subscribe({
      next: () => this.refreshCatalog(kind),
      error: (err) => {
        const detail = err.error?.detail;
        const msg = typeof detail === "object" ? detail.message : detail;
        if (err.status === 409 && confirm(`${msg}

\xBFEliminar de todos modos?`)) {
          this.api.deleteCatalogItem(kind, item.id, true).subscribe({
            next: () => {
              this.refreshCatalog(kind);
              this.loadRoutes();
            },
            error: () => this.snack.open("No se pudo eliminar", "OK", { duration: 3500 })
          });
        } else {
          this.snack.open(msg ?? "Error al eliminar", "OK", { duration: 4e3 });
        }
      }
    });
  }
  // ── Tab switch ────────────────────────────────────────────
  switchTab(tab) {
    this.activeTab.set(tab);
    if (tab === "mercaderistas" && this.mercList().length === 0)
      this.loadMercaderistas();
    if (tab === "analistas" && this.analystList().length === 0)
      this.loadAnalysts();
    if (tab === "supervisores" && this.supervisorList().length === 0)
      this.loadSupervisors();
  }
  // ── Analistas / Supervisores (panel compartido) ───────────
  loadAnalysts() {
    this.analystLoading.set(true);
    this.api.getAnalystsWithAssignments().subscribe({
      next: (data) => {
        this.analystList.set(data);
        this.analystLoading.set(false);
      },
      error: () => this.analystLoading.set(false)
    });
  }
  loadSupervisors() {
    this.supervisorLoading.set(true);
    this.api.getSupervisorsWithAssignments().subscribe({
      next: (data) => {
        this.supervisorList.set(data);
        this.supervisorLoading.set(false);
      },
      error: () => this.supervisorLoading.set(false)
    });
  }
  get filteredAnalysts() {
    const s = this.analystSearch.trim().toLowerCase();
    return this.analystList().filter((a) => !s || a.nombre?.toLowerCase().includes(s));
  }
  get filteredSupervisors() {
    const s = this.supervisorSearch.trim().toLowerCase();
    return this.supervisorList().filter((a) => !s || a.nombre?.toLowerCase().includes(s));
  }
  get assignKindLabel() {
    return this.assignKind() === "supervisor" ? "Supervisor" : "Analista";
  }
  // Selección de endpoints según el tipo de persona
  kindRoutes(id) {
    return this.assignKind() === "supervisor" ? this.api.getSupervisorRoutes(id) : this.api.getAnalystRoutes(id);
  }
  kindSyncRoutes(id, ids) {
    return this.assignKind() === "supervisor" ? this.api.syncSupervisorRoutes(id, ids) : this.api.syncAnalystRoutes(id, ids);
  }
  kindClients(id) {
    return this.assignKind() === "supervisor" ? this.api.getSupervisorClients(id) : this.api.getAnalystClients(id);
  }
  kindRouteClients(id) {
    return this.assignKind() === "supervisor" ? this.api.getSupervisorRouteClients(id) : this.api.getAnalystRouteClients(id);
  }
  kindSyncClients(id, ids) {
    return this.assignKind() === "supervisor" ? this.api.syncSupervisorClients(id, ids) : this.api.syncAnalystClients(id, ids);
  }
  updatePersonCount(id, patch) {
    const sig = this.assignKind() === "supervisor" ? this.supervisorList : this.analystList;
    sig.update((list) => list.map((x) => x.id === id ? __spreadValues(__spreadValues({}, x), patch) : x));
  }
  openAssignPanel(person, kind) {
    this.assignKind.set(kind);
    this.selectedAnalyst.set(person);
    this.analystPanelOpen.set(true);
    this.analystTab.set("rutas");
    this.analystRouteSearch = "";
    this.kindRoutes(person.id).subscribe({
      next: (r) => this.assignedAnalystRoutes.set(r),
      error: () => this.assignedAnalystRoutes.set([])
    });
  }
  closeAnalystPanel() {
    this.analystPanelOpen.set(false);
    this.selectedAnalyst.set(null);
    this.assignedAnalystRoutes.set([]);
    this.routeClientOptions.set([]);
    this.selectedAnalystClientIds.set([]);
  }
  switchAnalystTab(tab) {
    this.analystTab.set(tab);
    const a = this.selectedAnalyst();
    if (tab === "clientes" && a) {
      this.kindRouteClients(a.id).subscribe((opts) => this.routeClientOptions.set(opts));
      this.kindClients(a.id).subscribe((cli) => this.selectedAnalystClientIds.set(cli.map((c) => c.id)));
    }
  }
  // Rutas del analista
  isAnalystRouteAssigned(id) {
    return this.assignedAnalystRoutes().some((r) => r.id === id);
  }
  addAnalystRoute(r) {
    if (this.isAnalystRouteAssigned(r.id))
      return;
    this.assignedAnalystRoutes.update((list) => [...list, { id: r.id, nombre: r.nombre, servicio: r.servicio }]);
  }
  removeAnalystRoute(id) {
    this.assignedAnalystRoutes.update((list) => list.filter((r) => r.id !== id));
  }
  get availableAnalystRoutes() {
    const s = this.analystRouteSearch.toLowerCase();
    return this.routes().filter((r) => !this.isAnalystRouteAssigned(r.id) && (!s || r.nombre?.toLowerCase().includes(s) || r.servicio?.toLowerCase().includes(s)));
  }
  saveAnalystRoutes() {
    const a = this.selectedAnalyst();
    if (!a)
      return;
    this.analystPanelSaving.set(true);
    const ids = this.assignedAnalystRoutes().map((r) => r.id);
    this.kindSyncRoutes(a.id, ids).subscribe({
      next: () => {
        this.analystPanelSaving.set(false);
        this.updatePersonCount(a.id, { rutas_count: ids.length });
        this.snack.open(`Rutas del ${this.assignKindLabel.toLowerCase()} guardadas`, "OK", { duration: 3e3 });
      },
      error: (err) => {
        this.analystPanelSaving.set(false);
        this.snack.open(err.error?.detail ?? "Error", "OK", { duration: 4e3 });
      }
    });
  }
  // Clientes del analista
  isAnalystClientSelected(id) {
    return this.selectedAnalystClientIds().includes(id);
  }
  toggleAnalystClient(id) {
    this.selectedAnalystClientIds.update((list) => list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }
  saveAnalystClients() {
    const a = this.selectedAnalyst();
    if (!a)
      return;
    this.analystPanelSaving.set(true);
    const ids = this.selectedAnalystClientIds();
    this.kindSyncClients(a.id, ids).subscribe({
      next: () => {
        this.analystPanelSaving.set(false);
        this.updatePersonCount(a.id, { clientes_count: ids.length });
        this.snack.open(`Clientes del ${this.assignKindLabel.toLowerCase()} guardados`, "OK", { duration: 3e3 });
      },
      error: (err) => {
        this.analystPanelSaving.set(false);
        this.snack.open(err.error?.detail ?? "Error", "OK", { duration: 4e3 });
      }
    });
  }
  // ── Mercaderistas grid methods ────────────────────────────
  loadMercaderistas() {
    this.mercLoading.set(true);
    this.api.getMercaderistasConRutas().subscribe({
      next: (data) => {
        this.mercList.set(data);
        this.mercLoading.set(false);
      },
      error: () => this.mercLoading.set(false)
    });
  }
  get filteredMercaderistas() {
    const s = this.mercSearch.toLowerCase();
    const t = this.mercFilterTipo;
    return this.mercList().filter((m) => (!s || m.nombre?.toLowerCase().includes(s) || m.cedula?.includes(s) || m.email?.toLowerCase().includes(s)) && (!t || m.tipo === t));
  }
  get mercTipos() {
    return [...new Set(this.mercList().map((m) => m.tipo).filter(Boolean))];
  }
  // ── Assignment panel methods ──────────────────────────────
  openPanel(merc) {
    this.selectedMerc.set(merc);
    this.panelOpen.set(true);
    this.panelRouteSearch = "";
    this.api.getMercaderistaRoutes(merc.id).subscribe({
      next: (routes) => this.assignedRoutes.set(routes),
      error: () => this.assignedRoutes.set([])
    });
  }
  closePanel() {
    this.panelOpen.set(false);
    this.selectedMerc.set(null);
    this.assignedRoutes.set([]);
  }
  isAssigned(routeId) {
    return this.assignedRoutes().some((r) => r.id === routeId);
  }
  addRoute(ruta) {
    if (this.isAssigned(ruta.id))
      return;
    this.assignedRoutes.update((list) => [...list, { id: ruta.id, nombre: ruta.nombre, servicio: ruta.servicio, tipo_ruta: "Variable" }]);
  }
  removeRoute(routeId) {
    this.assignedRoutes.update((list) => list.filter((r) => r.id !== routeId));
  }
  setTipoRuta(routeId, tipo) {
    this.assignedRoutes.update((list) => list.map((r) => r.id === routeId ? __spreadProps(__spreadValues({}, r), { tipo_ruta: tipo }) : r));
  }
  get availableRoutes() {
    const s = this.panelRouteSearch.toLowerCase();
    return this.routes().filter((r) => !this.isAssigned(r.id) && (!s || r.nombre?.toLowerCase().includes(s) || r.servicio?.toLowerCase().includes(s)));
  }
  saveRoutes() {
    const merc = this.selectedMerc();
    if (!merc)
      return;
    this.panelSaving.set(true);
    const payload = this.assignedRoutes().map((r) => ({ ruta_id: r.id, tipo_ruta: r.tipo_ruta }));
    this.api.syncMercaderistaRoutes(merc.id, payload).subscribe({
      next: () => {
        this.panelSaving.set(false);
        this.snack.open("Asignaciones guardadas", "OK", { duration: 3e3 });
        this.mercList.update((list) => list.map((m) => m.id === merc.id ? __spreadProps(__spreadValues({}, m), { rutas_count: this.assignedRoutes().length }) : m));
        this.closePanel();
      },
      error: (err) => {
        this.panelSaving.set(false);
        this.snack.open(err?.error?.detail ?? "Error al guardar", "OK", { duration: 4e3 });
      }
    });
  }
  static {
    this.\u0275fac = function RoutesComponent_Factory(t) {
      return new (t || _RoutesComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(MatSnackBar), \u0275\u0275directiveInject(MatDialog));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RoutesComponent, selectors: [["app-routes"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 32, vars: 16, consts: [["nm", ""], [1, "space-y-6", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4"], [1, "text-3xl", "font-bold", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "flex", "items-center", "gap-2", "px-6", "py-3", "bg-primary-500", "hover:bg-primary-600", "text-white", "rounded-2xl", "shadow-lg", "shadow-primary-500/20", "transition-all", "active:scale-95", "font-semibold"], [1, "flex", "gap-1", "bg-slate-100", "dark:bg-slate-800", "p-1", "rounded-2xl", "w-fit"], [1, "flex", "items-center", "gap-2", "px-5", "py-2", "rounded-xl", "text-sm", "font-bold", "transition-all", 3, "click"], [1, "!text-base"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4"], [1, "flex", "items-center", "gap-2", "px-6", "py-3", "bg-primary-500", "hover:bg-primary-600", "text-white", "rounded-2xl", "shadow-lg", "shadow-primary-500/20", "transition-all", "active:scale-95", "font-semibold", 3, "click"], [1, "rounded-3xl", "overflow-hidden", "shadow-2xl", "shadow-slate-900/20", "animate-in", "zoom-in-95", "duration-300", "border", "border-white/10"], [1, "flex", "flex-wrap", "items-center", "gap-3"], [1, "relative", "flex-1", "min-w-52"], [1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-400", "pointer-events-none", "!text-base"], ["placeholder", "Buscar ruta...", 1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "focus:border-primary-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "pl-9", "pr-4", "py-2.5", "text-sm", "font-semibold", "outline-none", "transition-colors", "shadow-sm", 3, "ngModelChange", "ngModel"], [1, "relative"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "focus:border-primary-500", "text-slate-800", "dark:text-white", "rounded-xl", "px-4", "py-2.5", "pr-8", "text-sm", "font-semibold", "appearance-none", "outline-none", "transition-colors", "shadow-sm", "min-w-44", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "absolute", "right-2", "top-1/2", "-translate-y-1/2", "text-slate-400", "pointer-events-none", "!text-base"], ["matTooltip", "Limpiar filtros", 1, "w-10", "h-10", "flex", "items-center", "justify-center", "rounded-xl", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "text-slate-500", "hover:text-rose-500", "transition-all", "shadow-sm"], [1, "text-sm", "font-bold", "text-slate-400", "ml-auto"], [1, "flex", "flex-col", "items-center", "justify-center", "py-24", "gap-4"], [1, "bg-gradient-to-r", "from-primary-700", "via-primary-600", "to-indigo-600", "p-6", "flex", "items-center", "justify-between"], [1, "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "bg-white/20", "backdrop-blur-sm", "rounded-2xl", "flex", "items-center", "justify-center"], [1, "text-white", "!text-2xl"], [1, "text-xl", "font-black", "text-white", "tracking-tight"], [1, "text-primary-200", "text-sm"], [1, "hidden", "md:flex", "items-center", "gap-2", "bg-white/15", "border", "border-white/20", "rounded-2xl", "px-5", "py-2.5"], [1, "bg-slate-900", "p-8"], [3, "ngSubmit", "formGroup"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-5", "mb-5"], [1, "space-y-2"], [1, "text-xs", "font-black", "text-slate-400", "uppercase", "tracking-widest", "flex", "items-center", "gap-1.5"], [1, "!text-sm", "text-primary-400"], [1, "text-rose-400"], ["formControlName", "tipo", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-primary-500", "text-white", "rounded-xl", "px-4", "py-3.5", "pr-10", "font-semibold", "appearance-none", "outline-none", "transition-colors", 3, "change"], ["value", "E"], ["value", "T"], ["value", "A"], [1, "absolute", "right-3", "top-1/2", "-translate-y-1/2", "text-slate-400", "pointer-events-none"], [1, "text-xs", "font-black", "text-slate-400", "uppercase", "tracking-widest", "flex", "items-center", "justify-between", "gap-1.5"], [1, "flex", "items-center", "gap-1.5"], ["type", "button", "matTooltip", "Administrar servicios", 1, "text-primary-400", "hover:text-primary-300", "inline-flex", "items-center", "gap-0.5", "normal-case", "tracking-normal", "text-[11px]", "font-bold", 3, "click"], [1, "!text-sm"], ["formControlName", "servicio", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-primary-500", "text-white", "rounded-xl", "px-4", "py-3.5", "pr-10", "font-semibold", "appearance-none", "outline-none", "transition-colors"], ["value", "", "disabled", ""], ["type", "button", "matTooltip", "Administrar cuadrantes", 1, "text-primary-400", "hover:text-primary-300", "inline-flex", "items-center", "gap-0.5", "normal-case", "tracking-normal", "text-[11px]", "font-bold", 3, "click"], ["formControlName", "cuadrante", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-primary-500", "text-white", "rounded-xl", "px-4", "py-3.5", "pr-10", "font-semibold", "appearance-none", "outline-none", "transition-colors"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-5", "mb-5", "animate-in", "fade-in", "duration-200"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-5", "mb-8"], ["formControlName", "coordinador_1", "placeholder", "Nombre del coordinador principal", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "focus:border-primary-500", "text-white", "placeholder-slate-500", "rounded-xl", "px-4", "py-3.5", "font-semibold", "outline-none", "transition-colors"], [1, "!text-sm", "text-slate-500"], ["formControlName", "coordinador_2", "placeholder", "Opcional", 1, "w-full", "bg-slate-800", "border", "border-slate-700", "text-white", "placeholder-slate-500", "rounded-xl", "px-4", "py-3.5", "font-semibold", "outline-none", "transition-colors"], [1, "flex", "items-center", "justify-end", "gap-3", "pt-6", "border-t", "border-slate-800"], ["type", "button", 1, "px-6", "py-2.5", "rounded-xl", "border", "border-slate-700", "text-slate-400", "hover:text-white", "font-semibold", "transition-all", 3, "click"], ["type", "submit", 1, "flex", "items-center", "gap-2", "px-8", "py-2.5", "bg-gradient-to-r", "from-primary-600", "to-indigo-600", "hover:from-primary-500", "hover:to-indigo-500", "disabled:opacity-40", "text-white", "font-black", "rounded-xl", "shadow-lg", "transition-all", "active:scale-95", 3, "disabled"], [1, "text-yellow-300", "!text-lg"], [1, "text-white", "font-black", "text-lg"], [1, "space-y-2", "md:col-span-1"], [1, "text-xs", "font-black", "text-amber-400", "uppercase", "tracking-widest", "flex", "items-center", "gap-1.5"], ["formControlName", "id_cliente_exclusivo", 1, "w-full", "bg-slate-800", "border", "border-amber-700", "focus:border-amber-500", "text-white", "rounded-xl", "px-4", "py-3.5", "pr-10", "font-semibold", "appearance-none", "outline-none", "transition-colors"], [1, "text-[11px]", "text-slate-500"], ["diameter", "18"], [1, "!text-lg"], ["matTooltip", "Limpiar filtros", 1, "w-10", "h-10", "flex", "items-center", "justify-center", "rounded-xl", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "text-slate-500", "hover:text-rose-500", "transition-all", "shadow-sm", 3, "click"], ["diameter", "48", "strokeWidth", "4"], [1, "text-slate-400", "font-medium"], [1, "py-20", "text-center"], [1, "flex", "flex-col", "items-center", "gap-3", "opacity-40"], [1, "!text-5xl"], [1, "font-bold"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "xl:grid-cols-3", "gap-4"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "rounded-2xl", "overflow-hidden", "shadow-sm", "hover:shadow-md", "hover:border-primary-200", "dark:hover:border-primary-900/50", "transition-all", "flex", "flex-col"], [1, "bg-gradient-to-r", "from-primary-600", "to-indigo-600", "px-5", "py-3", "flex", "items-center", "justify-between"], [1, "text-white", "font-black", "text-lg", "tracking-tight"], [1, "text-[10px]", "font-black", "px-2", "py-1", "rounded-full", "bg-white/20", "text-white", "uppercase"], [1, "p-5", "flex-1", "flex", "flex-col", "gap-3"], [1, "flex", "items-center", "gap-2", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "!text-base", "text-primary-500"], [1, "inline-flex", "items-center", "gap-1", "px-2.5", "py-1", "bg-slate-100", "dark:bg-white/5", "rounded-lg", "font-bold", "text-xs", "text-slate-600", "dark:text-slate-300"], [1, "text-xs", "text-slate-500", "flex", "items-center", "gap-1.5"], [1, "flex", "flex-wrap", "gap-1.5", "min-h-[1.5rem]"], [1, "px-2", "py-0.5", "bg-emerald-50", "dark:bg-emerald-950", "text-emerald-700", "dark:text-emerald-400", "rounded-md", "text-[11px]", "font-bold"], [1, "px-2", "py-0.5", "bg-slate-100", "dark:bg-slate-800", "text-slate-500", "rounded-md", "text-[11px]", "font-bold"], [1, "text-[11px]", "text-slate-400", "italic"], [1, "px-5", "pb-5", "space-y-2"], [1, "w-full", "flex", "items-center", "justify-center", "gap-2", "py-2.5", "bg-primary-600", "hover:bg-primary-500", "text-white", "font-black", "rounded-xl", "text-sm", "shadow-md", "transition-all", "active:scale-95", 3, "click"], [1, "grid", "grid-cols-3", "gap-2"], ["matTooltip", "Editar ruta", 1, "flex", "items-center", "justify-center", "py-2", "rounded-xl", "border", "border-slate-200", "dark:border-white/10", "text-slate-500", "hover:text-primary-500", "hover:border-primary-300", "transition-all", 3, "click"], ["matTooltip", "Duplicar ruta", 1, "flex", "items-center", "justify-center", "py-2", "rounded-xl", "border", "border-slate-200", "dark:border-white/10", "text-slate-500", "hover:text-indigo-500", "hover:border-indigo-300", "transition-all", 3, "click"], ["matTooltip", "Eliminar ruta", 1, "flex", "items-center", "justify-center", "py-2", "rounded-xl", "border", "border-slate-200", "dark:border-white/10", "text-slate-500", "hover:text-rose-500", "hover:border-rose-300", "transition-all", 3, "click"], [4, "ngIf"], [1, "flex", "flex-wrap", "gap-3"], ["placeholder", "Buscar por nombre, c\xE9dula o email...", 1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "focus:border-primary-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "pl-9", "pr-4", "py-2.5", "text-sm", "font-semibold", "outline-none", "transition-colors", "shadow-sm", 3, "ngModelChange", "ngModel"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "focus:border-primary-500", "text-slate-800", "dark:text-white", "rounded-xl", "px-4", "py-2.5", "pr-8", "text-sm", "font-semibold", "appearance-none", "outline-none", "transition-colors", "shadow-sm", "min-w-40", 3, "ngModelChange", "ngModel"], [1, "w-10", "h-10", "flex", "items-center", "justify-center", "rounded-xl", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "text-slate-500", "hover:text-primary-500", "transition-all", "shadow-sm", 3, "click"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "rounded-2xl", "p-5", "shadow-sm", "hover:shadow-md", "hover:border-primary-200", "dark:hover:border-primary-900/50", "transition-all"], [1, "col-span-3", "py-20", "text-center"], [1, "flex", "items-start", "justify-between", "mb-4"], [1, "flex", "items-center", "gap-3"], [1, "w-11", "h-11", "rounded-2xl", "bg-primary-100", "dark:bg-primary-900/30", "flex", "items-center", "justify-center", "shrink-0"], [1, "text-primary-600", "dark:text-primary-400"], [1, "font-black", "text-slate-800", "dark:text-white", "text-sm", "leading-tight"], [1, "text-xs", "text-slate-400", "font-mono"], [1, "text-[10px]", "font-black", "px-2", "py-1", "rounded-full", "border", "whitespace-nowrap"], [1, "space-y-1.5", "mb-4"], [1, "flex", "items-center", "gap-2", "text-xs", "text-slate-500", "dark:text-slate-400"], [1, "!text-sm", "text-slate-400"], [1, "px-2", "py-0.5", "bg-amber-100", "dark:bg-amber-950", "text-amber-700", "dark:text-amber-400", "rounded-full", "font-bold"], [1, "flex", "items-center", "gap-2", "bg-slate-50", "dark:bg-slate-800", "rounded-xl", "px-3", "py-2", "mb-4"], [1, "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "ml-auto", "text-sm", "font-black", "text-primary-600", "dark:text-primary-400"], [1, "relative", "max-w-md"], ["placeholder", "Buscar analista...", 1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "focus:border-primary-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "pl-9", "pr-4", "py-2.5", "text-sm", "font-semibold", "outline-none", "transition-colors", "shadow-sm", 3, "ngModelChange", "ngModel"], [1, "flex", "items-center", "gap-3", "mb-4"], [1, "w-11", "h-11", "rounded-2xl", "bg-indigo-100", "dark:bg-indigo-900/30", "flex", "items-center", "justify-center", "shrink-0"], [1, "text-indigo-600", "dark:text-indigo-400"], [1, "grid", "grid-cols-2", "gap-2", "mb-4"], [1, "flex", "items-center", "gap-2", "bg-slate-50", "dark:bg-slate-800", "rounded-xl", "px-3", "py-2"], [1, "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300"], [1, "!text-base", "text-emerald-500"], [1, "ml-auto", "text-sm", "font-black", "text-emerald-600", "dark:text-emerald-400"], [1, "w-full", "flex", "items-center", "justify-center", "gap-2", "py-2.5", "bg-indigo-600", "hover:bg-indigo-500", "text-white", "font-black", "rounded-xl", "text-sm", "shadow-md", "transition-all", "active:scale-95", 3, "click"], ["placeholder", "Buscar supervisor...", 1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "focus:border-primary-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "pl-9", "pr-4", "py-2.5", "text-sm", "font-semibold", "outline-none", "transition-colors", "shadow-sm", 3, "ngModelChange", "ngModel"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "rounded-2xl", "p-5", "shadow-sm", "hover:shadow-md", "hover:border-amber-200", "dark:hover:border-amber-900/50", "transition-all"], [1, "w-11", "h-11", "rounded-2xl", "bg-amber-100", "dark:bg-amber-900/30", "flex", "items-center", "justify-center", "shrink-0"], [1, "text-amber-600", "dark:text-amber-400"], [1, "w-full", "flex", "items-center", "justify-center", "gap-2", "py-2.5", "bg-amber-600", "hover:bg-amber-500", "text-white", "font-black", "rounded-xl", "text-sm", "shadow-md", "transition-all", "active:scale-95", 3, "click"], [1, "absolute", "inset-0", "bg-black/60", "backdrop-blur-sm", 3, "click"], [1, "relative", "w-full", "max-w-5xl", "bg-white", "dark:bg-slate-900", "rounded-3xl", "shadow-2xl", "overflow-hidden", "flex", "flex-col", 2, "max-height", "85vh"], [1, "bg-gradient-to-r", "from-primary-700", "to-indigo-600", "px-6", "py-5", "flex", "items-center", "justify-between", "shrink-0"], [1, "w-10", "h-10", "rounded-xl", "bg-white/20", "flex", "items-center", "justify-center"], [1, "text-white"], [1, "font-black", "text-white", "text-lg"], [1, "text-primary-200", "text-xs"], [1, "w-9", "h-9", "rounded-xl", "bg-white/20", "hover:bg-white/30", "flex", "items-center", "justify-center", "text-white", "transition-all", 3, "click"], [1, "flex-1", "overflow-hidden", "flex", "min-h-0"], [1, "w-1/2", "border-r", "border-slate-200", "dark:border-white/5", "flex", "flex-col"], [1, "bg-primary-600", "px-5", "py-3", "flex", "items-center", "gap-2", "shrink-0"], [1, "text-white", "!text-base"], [1, "text-white", "font-black", "text-sm"], [1, "flex-1", "overflow-y-auto"], [1, "flex", "flex-col", "items-center", "justify-center", "h-full", "gap-3", "opacity-40", "py-12"], [1, "w-1/2", "flex", "flex-col"], [1, "bg-emerald-600", "px-5", "py-3", "flex", "items-center", "gap-2", "shrink-0"], [1, "px-4", "py-3", "border-b", "border-slate-200", "dark:border-white/5", "shrink-0"], ["placeholder", "Buscar ruta...", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "pl-9", "pr-4", "py-2", "text-sm", "font-semibold", "outline-none", "transition-colors", 3, "ngModelChange", "ngModel"], [1, "px-6", "py-4", "border-t", "border-slate-200", "dark:border-white/5", "flex", "items-center", "justify-end", "gap-3", "shrink-0", "bg-slate-50", "dark:bg-slate-800/50"], [1, "px-6", "py-2.5", "border", "border-slate-300", "dark:border-slate-700", "text-slate-600", "dark:text-slate-400", "hover:text-slate-900", "dark:hover:text-white", "rounded-xl", "font-bold", "text-sm", "transition-all", 3, "click"], [1, "flex", "items-center", "gap-2", "px-8", "py-2.5", "bg-primary-600", "hover:bg-primary-500", "disabled:opacity-50", "text-white", "font-black", "rounded-xl", "text-sm", "shadow-lg", "transition-all", "active:scale-95", 3, "click", "disabled"], ["diameter", "16"], [1, "!text-4xl"], [1, "text-sm", "font-bold"], [1, "flex", "items-center", "gap-3", "px-5", "py-3", "border-b", "border-slate-100", "dark:border-white/5", "hover:bg-slate-50", "dark:hover:bg-white/5", "transition-colors"], [1, "flex-1", "min-w-0"], [1, "font-bold", "text-slate-800", "dark:text-white", "text-sm", "truncate"], [1, "text-xs", "text-slate-400"], [1, "relative", "shrink-0"], [1, "bg-slate-100", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "text-slate-700", "dark:text-white", "rounded-lg", "px-2", "py-1", "text-xs", "font-bold", "appearance-none", "pr-6", "outline-none", 3, "ngModelChange", "ngModel"], ["value", "Variable"], ["value", "Fija"], [1, "absolute", "right-1", "top-1/2", "-translate-y-1/2", "text-slate-400", "pointer-events-none", "!text-xs"], ["matTooltip", "Quitar ruta", 1, "w-7", "h-7", "rounded-lg", "bg-rose-50", "dark:bg-rose-950", "hover:bg-rose-100", "dark:hover:bg-rose-900", "text-rose-500", "flex", "items-center", "justify-center", "transition-all", "shrink-0", 3, "click"], [1, "flex", "items-center", "gap-3", "px-5", "py-3", "border-b", "border-slate-100", "dark:border-white/5", "hover:bg-emerald-50", "dark:hover:bg-emerald-950/30", "cursor-pointer", "transition-colors", "group"], [1, "flex", "items-center", "gap-3", "px-5", "py-3", "border-b", "border-slate-100", "dark:border-white/5", "hover:bg-emerald-50", "dark:hover:bg-emerald-950/30", "cursor-pointer", "transition-colors", "group", 3, "click"], [1, "w-5", "h-5", "rounded", "border-2", "border-slate-300", "dark:border-slate-600", "group-hover:border-emerald-500", "group-hover:bg-emerald-500", "flex", "items-center", "justify-center", "transition-all", "shrink-0"], [1, "!text-xs", "text-white", "opacity-0", "group-hover:opacity-100"], [1, "relative", "w-full", "max-w-lg", "bg-white", "dark:bg-slate-900", "rounded-3xl", "shadow-2xl", "overflow-hidden", "flex", "flex-col", 2, "max-height", "85vh"], [1, "px-6", "py-4", "border-b", "border-slate-200", "dark:border-white/5", "flex", "gap-2", "shrink-0"], ["placeholder", "Nuevo nombre...", 1, "flex-1", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "px-4", "py-2.5", "text-sm", "font-semibold", "outline-none", "transition-colors", 3, "ngModelChange", "keyup.enter", "ngModel"], [1, "flex", "items-center", "gap-1", "px-4", "py-2.5", "bg-primary-600", "hover:bg-primary-500", "disabled:opacity-40", "text-white", "font-black", "rounded-xl", "text-sm", "transition-all", "active:scale-95", 3, "click", "disabled"], [1, "flex-1", "overflow-y-auto", "px-6", "py-3", "space-y-2"], [1, "text-center", "text-slate-400", "py-8", "text-sm"], [1, "px-6", "py-4", "border-t", "border-slate-200", "dark:border-white/5", "flex", "justify-end", "shrink-0", "bg-slate-50", "dark:bg-slate-800/50"], [1, "px-6", "py-2.5", "bg-primary-600", "hover:bg-primary-500", "text-white", "rounded-xl", "font-bold", "text-sm", "transition-all", 3, "click"], [1, "flex-1", "bg-transparent", "border", "border-transparent", "hover:border-slate-300", "focus:border-primary-500", "text-slate-800", "dark:text-white", "rounded-lg", "px-2", "py-1", "text-sm", "font-semibold", "outline-none", "transition-colors", 3, "keyup.enter", "value"], ["matTooltip", "Guardar nombre", 1, "w-8", "h-8", "rounded-lg", "bg-primary-50", "dark:bg-primary-950", "text-primary-500", "hover:bg-primary-100", "flex", "items-center", "justify-center", "transition-all", 3, "click"], ["matTooltip", "Eliminar", 1, "w-8", "h-8", "rounded-lg", "bg-rose-50", "dark:bg-rose-950", "text-rose-500", "hover:bg-rose-100", "flex", "items-center", "justify-center", "transition-all", 3, "click"], [1, "bg-gradient-to-r", "from-indigo-700", "to-primary-600", "px-6", "py-5", "flex", "items-center", "justify-between", "shrink-0"], [1, "flex", "gap-1", "px-6", "pt-4", "shrink-0"], [1, "flex-1", "overflow-hidden", "flex", "min-h-0", "mt-3"], [1, "flex", "items-center", "gap-3", "px-5", "py-3", "border-b", "border-slate-100", "dark:border-white/5"], [1, "flex", "flex-col", "items-center", "justify-center", "h-full", "gap-2", "opacity-40", "py-12"], ["placeholder", "Buscar ruta...", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "text-slate-800", "dark:text-white", "rounded-xl", "px-3", "py-2", "text-sm", "font-semibold", "outline-none", 3, "ngModelChange", "ngModel"], [1, "flex", "items-center", "gap-3", "px-5", "py-3", "border-b", "border-slate-100", "dark:border-white/5", "hover:bg-emerald-50", "dark:hover:bg-emerald-950/30", "cursor-pointer"], [1, "px-6", "py-4", "border-t", "border-slate-200", "dark:border-white/5", "flex", "justify-end", "gap-3", "shrink-0", "bg-slate-50", "dark:bg-slate-800/50"], [1, "px-6", "py-2.5", "border", "border-slate-300", "dark:border-slate-700", "text-slate-600", "dark:text-slate-400", "rounded-xl", "font-bold", "text-sm", 3, "click"], [1, "flex", "items-center", "gap-2", "px-8", "py-2.5", "bg-primary-600", "hover:bg-primary-500", "disabled:opacity-50", "text-white", "font-black", "rounded-xl", "text-sm", "shadow-lg", "active:scale-95", 3, "click", "disabled"], [1, "w-7", "h-7", "rounded-lg", "bg-rose-50", "dark:bg-rose-950", "hover:bg-rose-100", "text-rose-500", "flex", "items-center", "justify-center", 3, "click"], [1, "flex", "items-center", "gap-3", "px-5", "py-3", "border-b", "border-slate-100", "dark:border-white/5", "hover:bg-emerald-50", "dark:hover:bg-emerald-950/30", "cursor-pointer", 3, "click"], [1, "!text-base", "text-slate-300"], [1, "flex-1", "overflow-y-auto", "p-6"], [1, "bg-indigo-50", "dark:bg-indigo-950/40", "border", "border-indigo-200", "dark:border-indigo-900", "rounded-xl", "px-4", "py-3", "mb-4", "text-xs", "text-indigo-700", "dark:text-indigo-300", "flex", "items-start", "gap-2"], [1, "flex", "flex-col", "items-center", "justify-center", "py-12", "gap-2", "opacity-40"], [1, "flex", "items-center", "gap-2", "px-8", "py-2.5", "bg-emerald-600", "hover:bg-emerald-500", "disabled:opacity-50", "text-white", "font-black", "rounded-xl", "text-sm", "shadow-lg", "active:scale-95", 3, "click", "disabled"], [1, "grid", "grid-cols-2", "md:grid-cols-3", "gap-2"], [1, "flex", "items-center", "gap-2", "px-3", "py-2", "rounded-xl", "border", "text-sm", "font-bold", "text-left", "transition-all", 3, "ngClass"], [1, "flex", "items-center", "gap-2", "px-3", "py-2", "rounded-xl", "border", "text-sm", "font-bold", "text-left", "transition-all", 3, "click", "ngClass"], [1, "truncate"]], template: function RoutesComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div")(3, "h1", 3);
        \u0275\u0275text(4, "Gesti\xF3n de Rutas");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p", 4);
        \u0275\u0275text(6, "Configura trayectos y asigna mercaderistas.");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(7, RoutesComponent_Conditional_7_Template, 4, 2, "button", 5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "div", 6)(9, "button", 7);
        \u0275\u0275listener("click", function RoutesComponent_Template_button_click_9_listener() {
          return ctx.switchTab("rutas");
        });
        \u0275\u0275elementStart(10, "mat-icon", 8);
        \u0275\u0275text(11, "alt_route");
        \u0275\u0275elementEnd();
        \u0275\u0275text(12, " Rutas ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(13, "button", 7);
        \u0275\u0275listener("click", function RoutesComponent_Template_button_click_13_listener() {
          return ctx.switchTab("mercaderistas");
        });
        \u0275\u0275elementStart(14, "mat-icon", 8);
        \u0275\u0275text(15, "people");
        \u0275\u0275elementEnd();
        \u0275\u0275text(16, " Asignaci\xF3n Mercaderistas ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(17, "button", 7);
        \u0275\u0275listener("click", function RoutesComponent_Template_button_click_17_listener() {
          return ctx.switchTab("analistas");
        });
        \u0275\u0275elementStart(18, "mat-icon", 8);
        \u0275\u0275text(19, "analytics");
        \u0275\u0275elementEnd();
        \u0275\u0275text(20, " Asignaci\xF3n Analistas ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "button", 7);
        \u0275\u0275listener("click", function RoutesComponent_Template_button_click_21_listener() {
          return ctx.switchTab("supervisores");
        });
        \u0275\u0275elementStart(22, "mat-icon", 8);
        \u0275\u0275text(23, "supervisor_account");
        \u0275\u0275elementEnd();
        \u0275\u0275text(24, " Asignaci\xF3n Supervisores ");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(25, RoutesComponent_Conditional_25_Template, 28, 8)(26, RoutesComponent_Conditional_26_Template, 18, 3)(27, RoutesComponent_Conditional_27_Template, 6, 2)(28, RoutesComponent_Conditional_28_Template, 6, 2);
        \u0275\u0275elementEnd();
        \u0275\u0275template(29, RoutesComponent_Conditional_29_Template, 47, 8, "div", 9)(30, RoutesComponent_Conditional_30_Template, 26, 5, "div", 9)(31, RoutesComponent_Conditional_31_Template, 24, 8, "div", 9);
      }
      if (rf & 2) {
        \u0275\u0275advance(7);
        \u0275\u0275conditional(7, ctx.activeTab() === "rutas" ? 7 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275classMap(ctx.activeTab() === "rutas" ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300");
        \u0275\u0275advance(4);
        \u0275\u0275classMap(ctx.activeTab() === "mercaderistas" ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300");
        \u0275\u0275advance(4);
        \u0275\u0275classMap(ctx.activeTab() === "analistas" ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300");
        \u0275\u0275advance(4);
        \u0275\u0275classMap(ctx.activeTab() === "supervisores" ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300");
        \u0275\u0275advance(4);
        \u0275\u0275conditional(25, ctx.activeTab() === "rutas" ? 25 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(26, ctx.activeTab() === "mercaderistas" ? 26 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(27, ctx.activeTab() === "analistas" ? 27 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(28, ctx.activeTab() === "supervisores" ? 28 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(29, ctx.panelOpen() ? 29 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(30, ctx.catalogModalOpen() ? 30 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(31, ctx.analystPanelOpen() ? 31 : -1);
      }
    }, dependencies: [
      CommonModule,
      NgClass,
      NgIf,
      ReactiveFormsModule,
      \u0275NgNoValidate,
      NgSelectOption,
      \u0275NgSelectMultipleOption,
      DefaultValueAccessor,
      SelectControlValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      FormGroupDirective,
      FormControlName,
      FormsModule,
      NgModel,
      MatButtonModule,
      MatIconModule,
      MatIcon,
      MatTableModule,
      MatFormFieldModule,
      MatInputModule,
      MatDialogModule,
      MatProgressSpinnerModule,
      MatProgressSpinner,
      MatSlideToggleModule,
      MatSnackBarModule,
      MatSelectModule,
      MatTooltipModule,
      MatTooltip
    ], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n/*# sourceMappingURL=routes.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RoutesComponent, { className: "RoutesComponent", filePath: "src\\app\\features\\routes\\routes.component.ts", lineNumber: 41 });
})();
export {
  RoutesComponent
};
//# sourceMappingURL=chunk-GTTOOFOH.js.map
