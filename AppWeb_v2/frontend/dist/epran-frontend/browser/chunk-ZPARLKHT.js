import {
  MatSnackBar,
  MatSnackBarModule
} from "./chunk-7QJW63DM.js";
import {
  MatSelectModule
} from "./chunk-DD2LOOAS.js";
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
import "./chunk-ABO6AUNU.js";
import {
  FormsModule
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
  MatButton,
  MatButtonModule,
  MatIcon,
  MatIconModule
} from "./chunk-KQNRR4FF.js";
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
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-QB3BCYT5.js";

// src/app/features/photos/photos.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function PhotosComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "mat-spinner", 9);
    \u0275\u0275elementStart(2, "p", 10);
    \u0275\u0275text(3, "Cargando galer\xEDa de revisi\xF3n...");
    \u0275\u0275elementEnd()();
  }
}
function PhotosComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 12)(2, "mat-icon", 13);
    \u0275\u0275text(3, "verified_user");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "h3", 14);
    \u0275\u0275text(5, "\xA1Todo en orden!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 15);
    \u0275\u0275text(7, "No hay fotograf\xEDas rechazadas que requieran revisi\xF3n en este momento.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 16);
    \u0275\u0275listener("click", function PhotosComponent_Conditional_16_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadPhotos());
    });
    \u0275\u0275text(9, " Actualizar Galer\xEDa ");
    \u0275\u0275elementEnd()();
  }
}
function PhotosComponent_Conditional_17_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 33);
    \u0275\u0275listener("error", function PhotosComponent_Conditional_17_For_2_Conditional_2_Template_img_error_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onImgError($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const foto_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", foto_r5.url, \u0275\u0275sanitizeUrl)("alt", "Foto " + foto_r5.id);
  }
}
function PhotosComponent_Conditional_17_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34)(1, "mat-icon", 35);
    \u0275\u0275text(2, "broken_image");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 36);
    \u0275\u0275text(4, "Sin previsualizaci\xF3n");
    \u0275\u0275elementEnd()();
  }
}
function PhotosComponent_Conditional_17_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18)(1, "div", 19);
    \u0275\u0275template(2, PhotosComponent_Conditional_17_For_2_Conditional_2_Template, 1, 2, "img", 20)(3, PhotosComponent_Conditional_17_For_2_Conditional_3_Template, 5, 0);
    \u0275\u0275elementStart(4, "div", 21)(5, "span", 22);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 23)(8, "button", 24);
    \u0275\u0275listener("click", function PhotosComponent_Conditional_17_For_2_Template_button_click_8_listener() {
      const foto_r5 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.approvePhoto(foto_r5));
    });
    \u0275\u0275elementStart(9, "mat-icon");
    \u0275\u0275text(10, "check_circle");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "button", 25)(12, "mat-icon");
    \u0275\u0275text(13, "zoom_in");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(14, "div", 26)(15, "div", 27)(16, "div", 28)(17, "span");
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 29);
    \u0275\u0275text(20, "Pendiente");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 30)(22, "p", 31);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "button", 32);
    \u0275\u0275listener("click", function PhotosComponent_Conditional_17_For_2_Template_button_click_24_listener() {
      const foto_r5 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.approvePhoto(foto_r5));
    });
    \u0275\u0275text(25, " Aprobar Ahora ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const foto_r5 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275conditional(2, foto_r5.url ? 2 : 3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" Nexus #", foto_r5.id, " ");
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate1("Tipo: ", foto_r5.id_tipo_foto, "");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", foto_r5.motivo_rechazo || "Motivo de rechazo no especificado", " ");
  }
}
function PhotosComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275repeaterCreate(1, PhotosComponent_Conditional_17_For_2_Template, 26, 4, "div", 18, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.photos());
  }
}
var PhotosComponent = class _PhotosComponent {
  constructor(api, snack) {
    this.api = api;
    this.snack = snack;
    this.loading = signal(true);
    this.photos = signal([]);
  }
  ngOnInit() {
    this.loadPhotos();
  }
  loadPhotos() {
    this.loading.set(true);
    this.api.getRejectedPhotos().subscribe({
      next: (data) => {
        this.photos.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
  approvePhoto(foto) {
    this.api.approvePhotos([foto.id]).subscribe({
      next: () => {
        this.photos.update((ps) => ps.filter((p) => p.id !== foto.id));
        this.snack.open("Foto aprobada", "OK", { duration: 2e3 });
      },
      error: () => {
        this.snack.open("Error al aprobar foto", "OK", { duration: 3e3 });
      }
    });
  }
  onImgError(event) {
    event.target.src = "assets/images/no-image.png";
  }
  static {
    this.\u0275fac = function PhotosComponent_Factory(t) {
      return new (t || _PhotosComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PhotosComponent, selectors: [["app-photos"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 18, vars: 2, consts: [[1, "space-y-8", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-6"], [1, "text-3xl", "font-bold", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "flex", "items-center", "gap-3"], [1, "px-4", "py-2", "bg-rose-50", "dark:bg-rose-900/20", "text-rose-600", "dark:text-rose-400", "rounded-2xl", "border", "border-rose-100", "dark:border-rose-900/30", "flex", "items-center", "gap-2", "font-bold", "shadow-sm"], [1, "text-sm"], [1, "w-12", "h-12", "flex", "items-center", "justify-center", "rounded-2xl", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/5", "text-slate-500", "dark:text-slate-400", "hover:bg-slate-50", "dark:hover:bg-slate-800", "hover:text-primary-500", "transition-all", "duration-200", "shadow-sm", "shadow-slate-200/50", "dark:shadow-none", 3, "click"], [1, "flex", "flex-col", "items-center", "justify-center", "py-24", "gap-4"], ["diameter", "48", "strokeWidth", "4"], [1, "text-slate-400", "font-medium"], [1, "bg-white", "dark:bg-slate-900", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "p-12", "text-center", "flex", "flex-col", "items-center", "gap-4", "shadow-sm", "animate-in", "zoom-in-95", "duration-500"], [1, "w-20", "h-20", "bg-emerald-50", "dark:bg-emerald-900/20", "rounded-full", "flex", "items-center", "justify-center", "text-emerald-500", "mb-2"], [1, "!text-5xl"], [1, "text-2xl", "font-bold", "text-slate-800", "dark:text-white"], [1, "text-slate-500", "dark:text-slate-400", "max-w-md", "mx-auto"], ["mat-flat-button", "", "color", "primary", 1, "!rounded-xl", "!h-12", "px-8", "mt-4", "shadow-lg", "shadow-primary-500/20", 3, "click"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4", "gap-8"], [1, "group", "bg-white", "dark:bg-slate-900", "rounded-3xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "hover:shadow-2xl", "hover:shadow-slate-300/50", "dark:hover:shadow-primary-500/10", "transition-all", "duration-500", "overflow-hidden", "flex", "flex-col"], [1, "relative", "h-60", "w-full", "bg-slate-100", "dark:bg-slate-800", "overflow-hidden"], [1, "w-full", "h-full", "object-cover", "transition-transform", "duration-700", "group-hover:scale-110", 3, "src", "alt"], [1, "absolute", "top-4", "left-4"], [1, "px-2.5", "py-1", "bg-black/40", "backdrop-blur-md", "text-white", "text-[10px]", "font-bold", "rounded-lg", "uppercase", "tracking-widest", "border", "border-white/10"], [1, "absolute", "inset-0", "bg-primary-600/60", "opacity-0", "group-hover:opacity-100", "transition-opacity", "duration-300", "flex", "items-center", "justify-center", "gap-4", "backdrop-blur-sm"], ["matTooltip", "Aprobar Foto", 1, "w-14", "h-14", "bg-white", "dark:bg-slate-900", "text-primary-600", "dark:text-primary-400", "rounded-2xl", "flex", "items-center", "justify-center", "shadow-xl", "hover:scale-110", "transition-transform", "active:scale-95", 3, "click"], ["matTooltip", "Zoom", 1, "w-14", "h-14", "bg-white/20", "text-white", "rounded-2xl", "flex", "items-center", "justify-center", "border", "border-white/30", "hover:bg-white/30", "transition-colors"], [1, "p-6", "space-y-4", "flex-1", "flex", "flex-col", "justify-between"], [1, "space-y-3"], [1, "flex", "items-center", "justify-between", "text-xs", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-tighter"], [1, "text-primary-500"], [1, "p-4", "bg-rose-50", "dark:bg-rose-900/10", "border", "border-rose-100/50", "dark:border-rose-900/20", "rounded-2xl"], [1, "text-sm", "font-semibold", "text-rose-700", "dark:text-rose-400", "leading-snug"], ["mat-flat-button", "", "color", "primary", 1, "!w-full", "!rounded-2xl", "!h-12", "!font-bold", "!bg-primary-500", "hover:!bg-primary-600", "shadow-md", "shadow-primary-500/10", 3, "click"], [1, "w-full", "h-full", "object-cover", "transition-transform", "duration-700", "group-hover:scale-110", 3, "error", "src", "alt"], [1, "w-full", "h-full", "flex", "flex-col", "items-center", "justify-center", "text-slate-300", "dark:text-slate-600", "gap-2"], [1, "!text-4xl"], [1, "text-xs", "font-medium"]], template: function PhotosComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
        \u0275\u0275text(4, "Fotos Rechazadas");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p", 3);
        \u0275\u0275text(6, "Revisa y aprueba las fotograf\xEDas que fueron marcadas con observaciones.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div", 4)(8, "div", 5)(9, "mat-icon", 6);
        \u0275\u0275text(10, "error_outline");
        \u0275\u0275elementEnd();
        \u0275\u0275text(11);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "button", 7);
        \u0275\u0275listener("click", function PhotosComponent_Template_button_click_12_listener() {
          return ctx.loadPhotos();
        });
        \u0275\u0275elementStart(13, "mat-icon");
        \u0275\u0275text(14, "refresh");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(15, PhotosComponent_Conditional_15_Template, 4, 0, "div", 8)(16, PhotosComponent_Conditional_16_Template, 10, 0)(17, PhotosComponent_Conditional_17_Template, 3, 0);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(11);
        \u0275\u0275textInterpolate1(" ", ctx.photos().length, " Pendientes ");
        \u0275\u0275advance(4);
        \u0275\u0275conditional(15, ctx.loading() ? 15 : ctx.photos().length === 0 ? 16 : 17);
      }
    }, dependencies: [
      CommonModule,
      MatCardModule,
      MatButtonModule,
      MatButton,
      MatIconModule,
      MatIcon,
      MatProgressSpinnerModule,
      MatProgressSpinner,
      MatFormFieldModule,
      MatSelectModule,
      FormsModule,
      MatSnackBarModule,
      MatTooltipModule,
      MatTooltip
    ], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n/*# sourceMappingURL=photos.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PhotosComponent, { className: "PhotosComponent", filePath: "src\\app\\features\\photos\\photos.component.ts", lineNumber: 26 });
})();
export {
  PhotosComponent
};
//# sourceMappingURL=chunk-ZPARLKHT.js.map
