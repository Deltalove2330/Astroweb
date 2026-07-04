import {
  MatTabsModule
} from "./chunk-A5TTJWI6.js";
import {
  ClientCategoriesDialogComponent
} from "./chunk-G4SN7CSW.js";
import {
  MatDialog,
  MatDialogModule
} from "./chunk-KCFHIW3D.js";
import {
  MatInput,
  MatInputModule
} from "./chunk-GXZEZIYO.js";
import {
  MatSnackBar,
  MatSnackBarModule
} from "./chunk-7QJW63DM.js";
import {
  RealtimeService
} from "./chunk-7WZINN4L.js";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableModule
} from "./chunk-3L7HTECJ.js";
import {
  MatSelectModule
} from "./chunk-DD2LOOAS.js";
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
  MatPrefix
} from "./chunk-YUDUWHLJ.js";
import {
  MatCard,
  MatCardContent,
  MatCardModule
} from "./chunk-HA7AXTKJ.js";
import {
  MatTooltip,
  MatTooltipModule
} from "./chunk-PBKBS7OR.js";
import "./chunk-CELNEZAJ.js";
import "./chunk-ABO6AUNU.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
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
  MatButton,
  MatButtonModule,
  MatIcon,
  MatIconButton,
  MatIconModule
} from "./chunk-KQNRR4FF.js";
import "./chunk-NRWDSKQC.js";
import "./chunk-XGS5Y2XL.js";
import {
  CommonModule,
  NgClass,
  NgIf,
  __spreadProps,
  __spreadValues,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
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
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QB3BCYT5.js";

// src/app/features/users/users.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function UsersComponent_Conditional_54_Conditional_11_span_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 35);
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function UsersComponent_Conditional_54_Conditional_11_For_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 44);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r4 = ctx.$implicit;
    \u0275\u0275property("ngValue", r_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r4.nombre);
  }
}
function UsersComponent_Conditional_54_Conditional_11_Conditional_50_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 44);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r5 = ctx.$implicit;
    \u0275\u0275property("ngValue", p_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r5.nombre || p_r5.cliente || p_r5.nombre_completo || p_r5.nombre_analista);
  }
}
function UsersComponent_Conditional_54_Conditional_11_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45)(1, "label", 34);
    \u0275\u0275text(2, "Perfil Relacionado (Opcional)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 36)(4, "mat-icon", 37);
    \u0275\u0275text(5, "link");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "mat-icon", 42);
    \u0275\u0275text(7, "expand_more");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "select", 54)(9, "option", 44);
    \u0275\u0275text(10, "Sin perfil asignado");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(11, UsersComponent_Conditional_54_Conditional_11_Conditional_50_For_12_Template, 2, 2, "option", 44, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(9);
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.getProfilesForSelectedRole());
  }
}
function UsersComponent_Conditional_54_Conditional_11_Conditional_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 53);
  }
}
function UsersComponent_Conditional_54_Conditional_11_Conditional_62_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 25);
    \u0275\u0275text(1, "save");
    \u0275\u0275elementEnd();
  }
}
function UsersComponent_Conditional_54_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 26)(1, "div", 28)(2, "div", 29)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div")(6, "h3", 30);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 31);
    \u0275\u0275text(9, "Completa los campos a continuaci\xF3n para guardar el usuario.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 19)(11, "form", 32);
    \u0275\u0275listener("ngSubmit", function UsersComponent_Conditional_54_Conditional_11_Template_form_ngSubmit_11_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.saveUser());
    });
    \u0275\u0275elementStart(12, "div", 33)(13, "div")(14, "label", 34);
    \u0275\u0275text(15, "Nombre de Usuario ");
    \u0275\u0275elementStart(16, "span", 35);
    \u0275\u0275text(17, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 36)(19, "mat-icon", 37);
    \u0275\u0275text(20, "person_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275element(21, "input", 38);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div")(23, "label", 34);
    \u0275\u0275text(24, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 36)(26, "mat-icon", 37);
    \u0275\u0275text(27, "mail_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275element(28, "input", 39);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div")(30, "label", 34);
    \u0275\u0275text(31, "Contrase\xF1a ");
    \u0275\u0275template(32, UsersComponent_Conditional_54_Conditional_11_span_32_Template, 2, 0, "span", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 36)(34, "mat-icon", 37);
    \u0275\u0275text(35, "lock_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275element(36, "input", 41);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "div")(38, "label", 34);
    \u0275\u0275text(39, "Rol Asignado ");
    \u0275\u0275elementStart(40, "span", 35);
    \u0275\u0275text(41, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "div", 36)(43, "mat-icon", 37);
    \u0275\u0275text(44, "badge");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "mat-icon", 42);
    \u0275\u0275text(46, "expand_more");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "select", 43);
    \u0275\u0275repeaterCreate(48, UsersComponent_Conditional_54_Conditional_11_For_49_Template, 2, 2, "option", 44, _forTrack0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(50, UsersComponent_Conditional_54_Conditional_11_Conditional_50_Template, 13, 1, "div", 45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "label", 46);
    \u0275\u0275element(52, "input", 47);
    \u0275\u0275elementStart(53, "span", 48);
    \u0275\u0275text(54, "Usuario activo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "span", 49);
    \u0275\u0275text(56, "\u2014 desm\xE1rcalo para desactivar su acceso");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(57, "div", 50)(58, "button", 51);
    \u0275\u0275listener("click", function UsersComponent_Conditional_54_Conditional_11_Template_button_click_58_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.showForm.set(false));
    });
    \u0275\u0275text(59, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "button", 52);
    \u0275\u0275template(61, UsersComponent_Conditional_54_Conditional_11_Conditional_61_Template, 1, 0, "mat-spinner", 53)(62, UsersComponent_Conditional_54_Conditional_11_Conditional_62_Template, 2, 0);
    \u0275\u0275text(63);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.editingUser() ? "edit" : "person_add");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.editingUser() ? "Editar Usuario" : "Nuevo Usuario");
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r1.createForm);
    \u0275\u0275advance(21);
    \u0275\u0275property("ngIf", !ctx_r1.editingUser());
    \u0275\u0275advance(4);
    \u0275\u0275property("placeholder", ctx_r1.editingUser() ? "Dejar en blanco para no cambiar" : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022");
    \u0275\u0275advance(12);
    \u0275\u0275repeater(ctx_r1.rolesDisponibles);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(50, ctx_r1.showProfileSelect() ? 50 : -1);
    \u0275\u0275advance(10);
    \u0275\u0275property("disabled", ctx_r1.createForm.invalid || ctx_r1.saving());
    \u0275\u0275advance();
    \u0275\u0275conditional(61, ctx_r1.saving() ? 61 : 62);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingUser() ? "Guardar Cambios" : "Crear Usuario", " ");
  }
}
function UsersComponent_Conditional_54_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275element(1, "mat-spinner", 55);
    \u0275\u0275elementEnd();
  }
}
function UsersComponent_Conditional_54_Conditional_13_th_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 74);
    \u0275\u0275text(1, "ID");
    \u0275\u0275elementEnd();
  }
}
function UsersComponent_Conditional_54_Conditional_13_td_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 75)(1, "span", 76);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const u_r6 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("#", u_r6.id, "");
  }
}
function UsersComponent_Conditional_54_Conditional_13_th_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 77);
    \u0275\u0275text(1, "Usuario");
    \u0275\u0275elementEnd();
  }
}
function UsersComponent_Conditional_54_Conditional_13_td_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 75)(1, "div", 78)(2, "div", 79);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 80);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const u_r7 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", u_r7.username.charAt(0).toUpperCase(), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r7.username);
  }
}
function UsersComponent_Conditional_54_Conditional_13_th_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 77);
    \u0275\u0275text(1, "Email");
    \u0275\u0275elementEnd();
  }
}
function UsersComponent_Conditional_54_Conditional_13_td_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 81);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const u_r8 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(u_r8.email || "No asignado");
  }
}
function UsersComponent_Conditional_54_Conditional_13_th_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 74);
    \u0275\u0275text(1, "Rol");
    \u0275\u0275elementEnd();
  }
}
function UsersComponent_Conditional_54_Conditional_13_td_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 75)(1, "span", 82);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const u_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.getRoleClasses(u_r9.id_rol));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", u_r9.rol_nombre || u_r9.rol, " ");
  }
}
function UsersComponent_Conditional_54_Conditional_13_th_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 74);
    \u0275\u0275text(1, "Perfil Relacionado");
    \u0275\u0275elementEnd();
  }
}
function UsersComponent_Conditional_54_Conditional_13_td_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 83);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const u_r10 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", u_r10.perfil_nombre || "N/A", " ");
  }
}
function UsersComponent_Conditional_54_Conditional_13_th_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 74);
    \u0275\u0275text(1, "Estado");
    \u0275\u0275elementEnd();
  }
}
function UsersComponent_Conditional_54_Conditional_13_td_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 75)(1, "div", 84);
    \u0275\u0275element(2, "span", 85);
    \u0275\u0275elementStart(3, "span", 86);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const u_r11 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275classMap(u_r11.activo ? "bg-emerald-500" : "bg-slate-300");
    \u0275\u0275advance();
    \u0275\u0275classMap(u_r11.activo ? "text-emerald-700" : "text-slate-500");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(u_r11.activo ? "Activo" : "Inactivo");
  }
}
function UsersComponent_Conditional_54_Conditional_13_th_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 87);
    \u0275\u0275text(1, "Acciones");
    \u0275\u0275elementEnd();
  }
}
function UsersComponent_Conditional_54_Conditional_13_td_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 88)(1, "button", 89);
    \u0275\u0275listener("click", function UsersComponent_Conditional_54_Conditional_13_td_22_Template_button_click_1_listener() {
      const u_r13 = \u0275\u0275restoreView(_r12).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.toggleActivo(u_r13));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "button", 90);
    \u0275\u0275listener("click", function UsersComponent_Conditional_54_Conditional_13_td_22_Template_button_click_4_listener() {
      const u_r13 = \u0275\u0275restoreView(_r12).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.editUser(u_r13));
    });
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "edit_square");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 91);
    \u0275\u0275listener("click", function UsersComponent_Conditional_54_Conditional_13_td_22_Template_button_click_7_listener() {
      const u_r13 = \u0275\u0275restoreView(_r12).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.deleteUser(u_r13));
    });
    \u0275\u0275elementStart(8, "mat-icon");
    \u0275\u0275text(9, "delete_outline");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const u_r13 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275classMap(u_r13.activo ? "hover:!bg-amber-50 !text-amber-500" : "hover:!bg-emerald-50 !text-emerald-500");
    \u0275\u0275property("matTooltip", u_r13.activo ? "Desactivar usuario" : "Activar usuario");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r13.activo ? "toggle_on" : "toggle_off");
  }
}
function UsersComponent_Conditional_54_Conditional_13_tr_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 92);
  }
}
function UsersComponent_Conditional_54_Conditional_13_tr_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 93);
  }
}
function UsersComponent_Conditional_54_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 56)(1, "table", 57);
    \u0275\u0275elementContainerStart(2, 58);
    \u0275\u0275template(3, UsersComponent_Conditional_54_Conditional_13_th_3_Template, 2, 0, "th", 59)(4, UsersComponent_Conditional_54_Conditional_13_td_4_Template, 3, 1, "td", 60);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(5, 61);
    \u0275\u0275template(6, UsersComponent_Conditional_54_Conditional_13_th_6_Template, 2, 0, "th", 62)(7, UsersComponent_Conditional_54_Conditional_13_td_7_Template, 6, 2, "td", 60);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(8, 63);
    \u0275\u0275template(9, UsersComponent_Conditional_54_Conditional_13_th_9_Template, 2, 0, "th", 62)(10, UsersComponent_Conditional_54_Conditional_13_td_10_Template, 2, 1, "td", 64);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(11, 65);
    \u0275\u0275template(12, UsersComponent_Conditional_54_Conditional_13_th_12_Template, 2, 0, "th", 59)(13, UsersComponent_Conditional_54_Conditional_13_td_13_Template, 3, 3, "td", 60);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(14, 66);
    \u0275\u0275template(15, UsersComponent_Conditional_54_Conditional_13_th_15_Template, 2, 0, "th", 59)(16, UsersComponent_Conditional_54_Conditional_13_td_16_Template, 2, 1, "td", 67);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(17, 68);
    \u0275\u0275template(18, UsersComponent_Conditional_54_Conditional_13_th_18_Template, 2, 0, "th", 59)(19, UsersComponent_Conditional_54_Conditional_13_td_19_Template, 5, 5, "td", 60);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(20, 69);
    \u0275\u0275template(21, UsersComponent_Conditional_54_Conditional_13_th_21_Template, 2, 0, "th", 70)(22, UsersComponent_Conditional_54_Conditional_13_td_22_Template, 10, 4, "td", 71);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275template(23, UsersComponent_Conditional_54_Conditional_13_tr_23_Template, 1, 0, "tr", 72)(24, UsersComponent_Conditional_54_Conditional_13_tr_24_Template, 1, 0, "tr", 73);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("dataSource", ctx_r1.users());
    \u0275\u0275advance(22);
    \u0275\u0275property("matHeaderRowDef", ctx_r1.columns);
    \u0275\u0275advance();
    \u0275\u0275property("matRowDefColumns", ctx_r1.columns);
  }
}
function UsersComponent_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18)(1, "div", 20)(2, "div", 21)(3, "h2", 22);
    \u0275\u0275text(4, "Usuarios");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 23);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 24);
    \u0275\u0275listener("click", function UsersComponent_Conditional_54_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showForm() ? ctx_r1.showForm.set(false) : ctx_r1.openCreateForm());
    });
    \u0275\u0275elementStart(8, "mat-icon", 25);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(11, UsersComponent_Conditional_54_Conditional_11_Template, 64, 9, "div", 26)(12, UsersComponent_Conditional_54_Conditional_12_Template, 2, 0, "div", 27)(13, UsersComponent_Conditional_54_Conditional_13_Template, 25, 3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.tabHints["usuarios"]);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r1.showForm() ? "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300" : "bg-primary-600 hover:bg-primary-500 text-white shadow-lg");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.showForm() ? "close" : "person_add");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.showForm() ? "Cerrar" : "Nuevo Usuario", " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(11, ctx_r1.showForm() ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(12, ctx_r1.loading() ? 12 : 13);
  }
}
function UsersComponent_Conditional_55_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 26)(1, "div", 102)(2, "div", 103)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div")(6, "h3", 30);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 104);
    \u0275\u0275text(9, "Ingresa la informaci\xF3n del analista de ruta.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 19)(11, "form", 105);
    \u0275\u0275listener("ngSubmit", function UsersComponent_Conditional_55_Conditional_16_Template_form_ngSubmit_11_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.saveAnalyst());
    });
    \u0275\u0275elementStart(12, "mat-form-field", 106)(13, "mat-label");
    \u0275\u0275text(14, "Nombre Completo del Analista");
    \u0275\u0275elementEnd();
    \u0275\u0275element(15, "input", 107);
    \u0275\u0275elementStart(16, "mat-icon", 108);
    \u0275\u0275text(17, "badge");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 109)(19, "button", 110);
    \u0275\u0275listener("click", function UsersComponent_Conditional_55_Conditional_16_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.showAnalystForm.set(false));
    });
    \u0275\u0275text(20, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "button", 111);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.editingAnalyst() ? "edit" : "person_add");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.editingAnalyst() ? "Editar Analista" : "Nuevo Analista");
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r1.analystForm);
    \u0275\u0275advance(10);
    \u0275\u0275property("disabled", ctx_r1.analystForm.invalid || ctx_r1.saving());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingAnalyst() ? "Guardar Cambios" : "Guardar Analista", " ");
  }
}
function UsersComponent_Conditional_55_For_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-card", 101)(1, "mat-card-content", 112)(2, "div", 78)(3, "div", 113)(4, "mat-icon");
    \u0275\u0275text(5, "analytics");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "div", 114);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 49);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 115)(12, "button", 116);
    \u0275\u0275listener("click", function UsersComponent_Conditional_55_For_19_Template_button_click_12_listener() {
      const a_r17 = \u0275\u0275restoreView(_r16).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.editAnalyst(a_r17));
    });
    \u0275\u0275elementStart(13, "mat-icon");
    \u0275\u0275text(14, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "button", 117);
    \u0275\u0275listener("click", function UsersComponent_Conditional_55_For_19_Template_button_click_15_listener() {
      const a_r17 = \u0275\u0275restoreView(_r16).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteAnalyst(a_r17));
    });
    \u0275\u0275elementStart(16, "mat-icon");
    \u0275\u0275text(17, "delete");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const a_r17 = ctx.$implicit;
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(a_r17.nombre_analista || a_r17.nombre || "Sin nombre");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("ID: ", a_r17.id, "");
  }
}
function UsersComponent_Conditional_55_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19)(1, "div", 94)(2, "div", 21)(3, "h2", 22);
    \u0275\u0275text(4, "Analistas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 23);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 95)(8, "div", 96)(9, "label", 97);
    \u0275\u0275text(10, "Nuevo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 98);
    \u0275\u0275twoWayListener("ngModelChange", function UsersComponent_Conditional_55_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.quickAnalyst, $event) || (ctx_r1.quickAnalyst = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("keyup.enter", function UsersComponent_Conditional_55_Template_input_keyup_enter_11_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addQuickAnalyst());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "button", 99);
    \u0275\u0275listener("click", function UsersComponent_Conditional_55_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addQuickAnalyst());
    });
    \u0275\u0275elementStart(13, "mat-icon", 25);
    \u0275\u0275text(14, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(15, " Agregar ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(16, UsersComponent_Conditional_55_Conditional_16_Template, 23, 5, "div", 26);
    \u0275\u0275elementStart(17, "div", 100);
    \u0275\u0275repeaterCreate(18, UsersComponent_Conditional_55_For_19_Template, 18, 2, "mat-card", 101, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.tabHints["analistas"]);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.quickAnalyst);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r1.quickAnalyst.trim() || ctx_r1.saving());
    \u0275\u0275advance(4);
    \u0275\u0275conditional(16, ctx_r1.showAnalystForm() ? 16 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.realAnalysts);
  }
}
function UsersComponent_Conditional_56_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 26)(1, "div", 121)(2, "div", 122)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div")(6, "h3", 30);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 104);
    \u0275\u0275text(9, "Informaci\xF3n comercial del cliente.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 19)(11, "form", 32);
    \u0275\u0275listener("ngSubmit", function UsersComponent_Conditional_56_Conditional_20_Template_form_ngSubmit_11_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.saveClient());
    });
    \u0275\u0275elementStart(12, "div", 33)(13, "div")(14, "label", 34);
    \u0275\u0275text(15, "Nombre / Raz\xF3n Social ");
    \u0275\u0275elementStart(16, "span", 35);
    \u0275\u0275text(17, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 36)(19, "mat-icon", 37);
    \u0275\u0275text(20, "storefront");
    \u0275\u0275elementEnd();
    \u0275\u0275element(21, "input", 123);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div")(23, "label", 34);
    \u0275\u0275text(24, "RIF");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 36)(26, "mat-icon", 37);
    \u0275\u0275text(27, "receipt_long");
    \u0275\u0275elementEnd();
    \u0275\u0275element(28, "input", 124);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(29, "p", 125)(30, "mat-icon", 126);
    \u0275\u0275text(31, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275text(32, " El tipo de cuenta (Exclusiva / Tradex) se determina por la ruta a la que se asigne el cliente. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 50)(34, "button", 51);
    \u0275\u0275listener("click", function UsersComponent_Conditional_56_Conditional_20_Template_button_click_34_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.showClientForm.set(false));
    });
    \u0275\u0275text(35, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "button", 52)(37, "mat-icon", 25);
    \u0275\u0275text(38, "save");
    \u0275\u0275elementEnd();
    \u0275\u0275text(39);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.editingClient() ? "domain_verification" : "domain_add");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.editingClient() ? "Editar Cliente" : "Registrar Nuevo Cliente");
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r1.clientForm);
    \u0275\u0275advance(25);
    \u0275\u0275property("disabled", ctx_r1.clientForm.invalid || ctx_r1.saving());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingClient() ? "Guardar Cambios" : "Guardar Cliente", " ");
  }
}
function UsersComponent_Conditional_56_For_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-card", 101)(1, "mat-card-content", 112)(2, "div")(3, "div", 127);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 128);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 129);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 115)(10, "button", 130);
    \u0275\u0275listener("click", function UsersComponent_Conditional_56_For_23_Template_button_click_10_listener() {
      const c_r21 = \u0275\u0275restoreView(_r20).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.manageClientCategories(c_r21));
    });
    \u0275\u0275elementStart(11, "mat-icon");
    \u0275\u0275text(12, "category");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "button", 131);
    \u0275\u0275listener("click", function UsersComponent_Conditional_56_For_23_Template_button_click_13_listener() {
      const c_r21 = \u0275\u0275restoreView(_r20).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.editClient(c_r21));
    });
    \u0275\u0275elementStart(14, "mat-icon");
    \u0275\u0275text(15, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "button", 132);
    \u0275\u0275listener("click", function UsersComponent_Conditional_56_For_23_Template_button_click_16_listener() {
      const c_r21 = \u0275\u0275restoreView(_r20).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteClient(c_r21));
    });
    \u0275\u0275elementStart(17, "mat-icon");
    \u0275\u0275text(18, "delete");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const c_r21 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(c_r21.nombre || c_r21.cliente);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r21.rif || "Sin RIF");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("ID: ", c_r21.id, "");
  }
}
function UsersComponent_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19)(1, "div", 118)(2, "div", 21)(3, "h2", 22);
    \u0275\u0275text(4, "Clientes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 23);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 95)(8, "div", 96)(9, "label", 97);
    \u0275\u0275text(10, "Nombre / Raz\xF3n Social");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 119);
    \u0275\u0275twoWayListener("ngModelChange", function UsersComponent_Conditional_56_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.quickClienteNombre, $event) || (ctx_r1.quickClienteNombre = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("keyup.enter", function UsersComponent_Conditional_56_Template_input_keyup_enter_11_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addQuickClient());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 96)(13, "label", 97);
    \u0275\u0275text(14, "RIF");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "input", 120);
    \u0275\u0275twoWayListener("ngModelChange", function UsersComponent_Conditional_56_Template_input_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.quickClienteRif, $event) || (ctx_r1.quickClienteRif = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("keyup.enter", function UsersComponent_Conditional_56_Template_input_keyup_enter_15_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addQuickClient());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "button", 99);
    \u0275\u0275listener("click", function UsersComponent_Conditional_56_Template_button_click_16_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addQuickClient());
    });
    \u0275\u0275elementStart(17, "mat-icon", 25);
    \u0275\u0275text(18, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(19, " Agregar ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(20, UsersComponent_Conditional_56_Conditional_20_Template, 40, 5, "div", 26);
    \u0275\u0275elementStart(21, "div", 100);
    \u0275\u0275repeaterCreate(22, UsersComponent_Conditional_56_For_23_Template, 19, 3, "mat-card", 101, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.tabHints["clientes"]);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.quickClienteNombre);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.quickClienteRif);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r1.quickClienteNombre.trim() || ctx_r1.saving());
    \u0275\u0275advance(4);
    \u0275\u0275conditional(20, ctx_r1.showClientForm() ? 20 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.clients());
  }
}
function UsersComponent_Conditional_57_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 26)(1, "div", 133)(2, "div", 134)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div")(6, "h3", 30);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 104);
    \u0275\u0275text(9, "Datos personales y de contacto del trabajador de campo.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 19)(11, "form", 32);
    \u0275\u0275listener("ngSubmit", function UsersComponent_Conditional_57_Conditional_11_Template_form_ngSubmit_11_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.saveMercaderista());
    });
    \u0275\u0275elementStart(12, "div", 135)(13, "div")(14, "label", 34);
    \u0275\u0275text(15, "Nombre Completo ");
    \u0275\u0275elementStart(16, "span", 35);
    \u0275\u0275text(17, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 36)(19, "mat-icon", 37);
    \u0275\u0275text(20, "badge");
    \u0275\u0275elementEnd();
    \u0275\u0275element(21, "input", 136);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div")(23, "label", 34);
    \u0275\u0275text(24, "C\xE9dula de Identidad ");
    \u0275\u0275elementStart(25, "span", 35);
    \u0275\u0275text(26, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 36)(28, "mat-icon", 37);
    \u0275\u0275text(29, "pin");
    \u0275\u0275elementEnd();
    \u0275\u0275element(30, "input", 137);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div")(32, "label", 34);
    \u0275\u0275text(33, "Tel\xE9fono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "div", 36)(35, "mat-icon", 37);
    \u0275\u0275text(36, "phone");
    \u0275\u0275elementEnd();
    \u0275\u0275element(37, "input", 138);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(38, "div", 50)(39, "button", 51);
    \u0275\u0275listener("click", function UsersComponent_Conditional_57_Conditional_11_Template_button_click_39_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.showMercaderistaForm.set(false));
    });
    \u0275\u0275text(40, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "button", 52)(42, "mat-icon", 25);
    \u0275\u0275text(43, "save");
    \u0275\u0275elementEnd();
    \u0275\u0275text(44);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.editingMercaderista() ? "manage_accounts" : "person_add_alt");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.editingMercaderista() ? "Editar Mercaderista" : "Registrar Mercaderista");
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r1.mercaderistaForm);
    \u0275\u0275advance(30);
    \u0275\u0275property("disabled", ctx_r1.mercaderistaForm.invalid || ctx_r1.saving());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingMercaderista() ? "Guardar Cambios" : "Guardar Mercaderista", " ");
  }
}
function UsersComponent_Conditional_57_For_14_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 129);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r25 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Tel: ", m_r25.telefono, "");
  }
}
function UsersComponent_Conditional_57_For_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-card", 101)(1, "mat-card-content", 112)(2, "div")(3, "div", 127);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 139);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, UsersComponent_Conditional_57_For_14_Conditional_7_Template, 2, 1, "div", 129);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 140)(9, "div", 141);
    \u0275\u0275element(10, "span", 85);
    \u0275\u0275elementStart(11, "span", 142);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 143)(14, "button", 116);
    \u0275\u0275listener("click", function UsersComponent_Conditional_57_For_14_Template_button_click_14_listener() {
      const m_r25 = \u0275\u0275restoreView(_r24).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.editMercaderista(m_r25));
    });
    \u0275\u0275elementStart(15, "mat-icon");
    \u0275\u0275text(16, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "button", 117);
    \u0275\u0275listener("click", function UsersComponent_Conditional_57_For_14_Template_button_click_17_listener() {
      const m_r25 = \u0275\u0275restoreView(_r24).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteMercaderista(m_r25));
    });
    \u0275\u0275elementStart(18, "mat-icon");
    \u0275\u0275text(19, "delete");
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    const m_r25 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(m_r25.nombre || m_r25.nombre_completo);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("C\xE9dula: ", m_r25.cedula, "");
    \u0275\u0275advance();
    \u0275\u0275conditional(7, m_r25.telefono ? 7 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275classMap(m_r25.activo ? "bg-emerald-500" : "bg-slate-300");
    \u0275\u0275advance();
    \u0275\u0275classMap(m_r25.activo ? "text-emerald-700" : "text-slate-500");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(m_r25.activo ? "Activo" : "Inactivo");
  }
}
function UsersComponent_Conditional_57_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19)(1, "div", 94)(2, "div", 21)(3, "h2", 22);
    \u0275\u0275text(4, "Mercaderistas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 23);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 24);
    \u0275\u0275listener("click", function UsersComponent_Conditional_57_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showMercaderistaForm() ? ctx_r1.showMercaderistaForm.set(false) : ctx_r1.openMercaderistaForm());
    });
    \u0275\u0275elementStart(8, "mat-icon", 25);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(11, UsersComponent_Conditional_57_Conditional_11_Template, 45, 5, "div", 26);
    \u0275\u0275elementStart(12, "div", 100);
    \u0275\u0275repeaterCreate(13, UsersComponent_Conditional_57_For_14_Template, 20, 8, "mat-card", 101, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.tabHints["mercaderistas"]);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r1.showMercaderistaForm() ? "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300" : "bg-primary-600 hover:bg-primary-500 text-white shadow-lg");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.showMercaderistaForm() ? "close" : "person_add_alt");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.showMercaderistaForm() ? "Cerrar" : "Nuevo Mercaderista", " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(11, ctx_r1.showMercaderistaForm() ? 11 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.mercaderistas());
  }
}
function UsersComponent_Conditional_58_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 26)(1, "div", 133)(2, "div", 134)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div")(6, "h3", 30);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 104);
    \u0275\u0275text(9, "Ingresa el nombre del supervisor.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 19)(11, "form", 105);
    \u0275\u0275listener("ngSubmit", function UsersComponent_Conditional_58_Conditional_19_Template_form_ngSubmit_11_listener() {
      \u0275\u0275restoreView(_r27);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.saveSupervisor());
    });
    \u0275\u0275elementStart(12, "mat-form-field", 106)(13, "mat-label");
    \u0275\u0275text(14, "Nombre del Supervisor");
    \u0275\u0275elementEnd();
    \u0275\u0275element(15, "input", 146);
    \u0275\u0275elementStart(16, "mat-icon", 108);
    \u0275\u0275text(17, "badge");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 109)(19, "button", 110);
    \u0275\u0275listener("click", function UsersComponent_Conditional_58_Conditional_19_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r27);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.showSupervisorForm.set(false));
    });
    \u0275\u0275text(20, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "button", 111);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.editingSupervisor() ? "edit" : "supervisor_account");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.editingSupervisor() ? "Editar Supervisor" : "Nuevo Supervisor");
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r1.supervisorForm);
    \u0275\u0275advance(10);
    \u0275\u0275property("disabled", ctx_r1.supervisorForm.invalid || ctx_r1.saving());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.editingSupervisor() ? "Guardar Cambios" : "Guardar Supervisor", " ");
  }
}
function UsersComponent_Conditional_58_For_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-card", 101)(1, "mat-card-content", 147)(2, "div", 78)(3, "div", 148)(4, "mat-icon");
    \u0275\u0275text(5, "supervisor_account");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "div", 114);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 49);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 149)(12, "span", 150);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 151);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 115)(17, "button", 116);
    \u0275\u0275listener("click", function UsersComponent_Conditional_58_For_22_Template_button_click_17_listener() {
      const s_r29 = \u0275\u0275restoreView(_r28).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.editSupervisor(s_r29));
    });
    \u0275\u0275elementStart(18, "mat-icon");
    \u0275\u0275text(19, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "button", 117);
    \u0275\u0275listener("click", function UsersComponent_Conditional_58_For_22_Template_button_click_20_listener() {
      const s_r29 = \u0275\u0275restoreView(_r28).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteSupervisor(s_r29));
    });
    \u0275\u0275elementStart(21, "mat-icon");
    \u0275\u0275text(22, "delete");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const s_r29 = ctx.$implicit;
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(s_r29.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("ID: ", s_r29.id, "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", s_r29.rutas_count, " rutas");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", s_r29.clientes_count, " clientes");
  }
}
function UsersComponent_Conditional_58_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 145)(1, "mat-icon", 152);
    \u0275\u0275text(2, "supervisor_account");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 153);
    \u0275\u0275text(4, "No hay supervisores. Crea el primero.");
    \u0275\u0275elementEnd()();
  }
}
function UsersComponent_Conditional_58_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19)(1, "div", 118)(2, "div", 21)(3, "h2", 22);
    \u0275\u0275text(4, "Supervisores");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 23);
    \u0275\u0275text(6, "Supervisores de rutas y clientes. Sus rutas/clientes se asignan en ");
    \u0275\u0275elementStart(7, "b");
    \u0275\u0275text(8, "Rutas \u2192 Asignaci\xF3n Supervisores");
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, ".");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 95)(11, "div", 96)(12, "label", 97);
    \u0275\u0275text(13, "Nuevo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "input", 144);
    \u0275\u0275twoWayListener("ngModelChange", function UsersComponent_Conditional_58_Template_input_ngModelChange_14_listener($event) {
      \u0275\u0275restoreView(_r26);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.quickSupervisor, $event) || (ctx_r1.quickSupervisor = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("keyup.enter", function UsersComponent_Conditional_58_Template_input_keyup_enter_14_listener() {
      \u0275\u0275restoreView(_r26);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addQuickSupervisor());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "button", 99);
    \u0275\u0275listener("click", function UsersComponent_Conditional_58_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r26);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addQuickSupervisor());
    });
    \u0275\u0275elementStart(16, "mat-icon", 25);
    \u0275\u0275text(17, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(18, " Agregar ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(19, UsersComponent_Conditional_58_Conditional_19_Template, 23, 5, "div", 26);
    \u0275\u0275elementStart(20, "div", 100);
    \u0275\u0275repeaterCreate(21, UsersComponent_Conditional_58_For_22_Template, 23, 4, "mat-card", 101, _forTrack0);
    \u0275\u0275template(23, UsersComponent_Conditional_58_Conditional_23_Template, 5, 0, "div", 145);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(14);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.quickSupervisor);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r1.quickSupervisor.trim() || ctx_r1.saving());
    \u0275\u0275advance(4);
    \u0275\u0275conditional(19, ctx_r1.showSupervisorForm() ? 19 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.supervisors());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(23, ctx_r1.supervisors().length === 0 ? 23 : -1);
  }
}
var UsersComponent = class _UsersComponent {
  // Solo analistas reales (rol 2) en la pestaña Analistas; los supervisores van aparte
  get realAnalysts() {
    return this.analysts().filter((a) => (a.id_rol ?? 2) === 2);
  }
  constructor(api, fb, snack, realtime, dialog) {
    this.api = api;
    this.fb = fb;
    this.snack = snack;
    this.realtime = realtime;
    this.dialog = dialog;
    this.loading = signal(true);
    this.saving = signal(false);
    this.activeTab = signal("usuarios");
    this.users = signal([]);
    this.showForm = signal(false);
    this.editingUser = signal(null);
    this.columns = ["id", "username", "email", "rol", "perfil", "activo", "acciones"];
    this.analysts = signal([]);
    this.clients = signal([]);
    this.mercaderistas = signal([]);
    this.supervisors = signal([]);
    this.rolesDisponibles = [
      { id: 8, nombre: "Administrador" },
      { id: 2, nombre: "Analista" },
      { id: 6, nombre: "Supervisor" },
      { id: 3, nombre: "Coordinador Exclusivo" },
      { id: 4, nombre: "Coordinador Tradex" },
      { id: 11, nombre: "Coordinador General" },
      { id: 10, nombre: "Atenci\xF3n al Cliente" },
      { id: 9, nombre: "Vendedor" },
      { id: 1, nombre: "Cliente" },
      { id: 5, nombre: "Mercaderista" },
      { id: 7, nombre: "Auditor" }
    ];
    this.tabHints = {
      usuarios: "Accesos al sistema: administrador, analista, supervisor, coordinador (exclusivo / tradex / general), cliente o mercaderista.",
      analistas: "Analistas que revisan y gestionan las cuentas de clientes.",
      clientes: "Cuentas / marcas del sistema. El tipo (Exclusiva / Tradex) se define por la ruta a la que se asigna.",
      mercaderistas: "Personal de campo que ejecuta las visitas en los puntos de venta.",
      supervisores: "Supervisores de rutas y clientes."
    };
    this.quickAnalyst = "";
    this.quickSupervisor = "";
    this.quickClienteNombre = "";
    this.quickClienteRif = "";
    this.createForm = this.fb.group({
      username: ["", Validators.required],
      email: [""],
      password: [""],
      id_rol: [2, Validators.required],
      id_perfil: [null],
      activo: [true]
    });
    this.showAnalystForm = signal(false);
    this.editingAnalyst = signal(null);
    this.analystForm = this.fb.group({
      nombre_analista: ["", Validators.required],
      id_rol: [2]
    });
    this.showClientForm = signal(false);
    this.editingClient = signal(null);
    this.clientForm = this.fb.group({
      cliente: ["", Validators.required],
      rif: [""],
      id_categoria: [1],
      id_tipo_cliente: [1]
    });
    this.showMercaderistaForm = signal(false);
    this.editingMercaderista = signal(null);
    this.mercaderistaForm = this.fb.group({
      nombre: ["", Validators.required],
      cedula: ["", Validators.required],
      telefono: [""],
      tipo_mercaderista: ["MERCADERISTA"],
      activo: [true]
    });
    this.showSupervisorForm = signal(false);
    this.editingSupervisor = signal(null);
    this.supervisorForm = this.fb.group({
      nombre: ["", Validators.required]
    });
  }
  ngOnInit() {
    this.loadData();
    this.realtime.events$.subscribe((ev) => {
      if (ev.tipo.startsWith("user.") || ev.tipo.startsWith("client."))
        this.loadData();
    });
  }
  // --- Alta rápida (estilo Catálogos) ---
  addQuickAnalyst() {
    const nombre = this.quickAnalyst.trim();
    if (!nombre)
      return;
    this.saving.set(true);
    this.api.createAnalyst({ nombre_analista: nombre, id_rol: 2 }).subscribe({
      next: () => {
        this.saving.set(false);
        this.quickAnalyst = "";
        this.api.getAnalystsList().subscribe((d) => this.analysts.set(d));
        this.snack.open("Analista creado", "OK", { duration: 2500 });
      },
      error: () => {
        this.saving.set(false);
        this.snack.open("Error al crear analista", "OK", { duration: 3e3 });
      }
    });
  }
  addQuickSupervisor() {
    const nombre = this.quickSupervisor.trim();
    if (!nombre)
      return;
    this.saving.set(true);
    this.api.createSupervisor({ nombre }).subscribe({
      next: () => {
        this.saving.set(false);
        this.quickSupervisor = "";
        this.reloadSupervisors();
        this.snack.open("Supervisor creado", "OK", { duration: 2500 });
      },
      error: () => {
        this.saving.set(false);
        this.snack.open("Error al crear supervisor", "OK", { duration: 3e3 });
      }
    });
  }
  addQuickClient() {
    const cliente = this.quickClienteNombre.trim();
    if (!cliente)
      return;
    this.saving.set(true);
    this.api.createClient({ cliente, rif: this.quickClienteRif.trim(), id_categoria: 1, id_tipo_cliente: 1 }).subscribe({
      next: () => {
        this.saving.set(false);
        this.quickClienteNombre = "";
        this.quickClienteRif = "";
        this.api.getClients().subscribe((d) => this.clients.set(d));
        this.snack.open("Cliente creado", "OK", { duration: 2500 });
      },
      error: () => {
        this.saving.set(false);
        this.snack.open("Error al crear cliente", "OK", { duration: 3e3 });
      }
    });
  }
  toggleActivo(user) {
    const nuevo = !user.activo;
    this.api.updateUser(user.id, { activo: nuevo }).subscribe({
      next: () => {
        this.users.update((us) => us.map((u) => u.id === user.id ? __spreadProps(__spreadValues({}, u), { activo: nuevo }) : u));
        this.snack.open(nuevo ? "Usuario activado" : "Usuario desactivado", "OK", { duration: 2500 });
      },
      error: () => this.snack.open("Error al cambiar estado", "OK", { duration: 3e3 })
    });
  }
  loadData() {
    this.api.getUsers().subscribe((data) => {
      this.users.set(data);
      this.loading.set(false);
    });
    this.api.getAnalystsList().subscribe((data) => this.analysts.set(data));
    this.api.getClients().subscribe((data) => this.clients.set(data));
    this.api.getMercaderistas().subscribe((data) => this.mercaderistas.set(data));
    this.api.getSupervisorsWithAssignments().subscribe((data) => this.supervisors.set(data));
  }
  getProfilesForSelectedRole() {
    const rol = this.createForm.get("id_rol")?.value;
    if (rol === 1 || rol === 3 || rol === 4)
      return this.clients();
    if (rol === 2)
      return this.realAnalysts;
    if (rol === 6)
      return this.supervisors();
    if (rol === 5)
      return this.mercaderistas();
    return [];
  }
  showProfileSelect() {
    const rol = this.createForm.get("id_rol")?.value;
    return [1, 2, 3, 4, 5, 6].includes(rol || 0);
  }
  editUser(user) {
    this.editingUser.set(user);
    this.showForm.set(true);
    this.createForm.patchValue({
      username: user.username,
      email: user.email,
      id_rol: user.id_rol,
      id_perfil: user.id_perfil,
      activo: user.activo ?? true
    });
    this.createForm.get("password")?.clearValidators();
    this.createForm.get("password")?.updateValueAndValidity();
  }
  openCreateForm() {
    this.editingUser.set(null);
    this.createForm.reset({ id_rol: 2, activo: true });
    this.createForm.get("password")?.setValidators([Validators.required, Validators.minLength(6)]);
    this.createForm.get("password")?.updateValueAndValidity();
    this.showForm.set(true);
  }
  saveUser() {
    if (this.createForm.invalid)
      return;
    this.saving.set(true);
    const user = this.editingUser();
    const data = __spreadValues({}, this.createForm.value);
    if (!data.password)
      delete data.password;
    const request = user ? this.api.updateUser(user.id, data) : this.api.createUser(data);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.loadData();
        this.showForm.set(false);
        this.snack.open(user ? "Usuario modificado" : "Usuario creado", "OK", { duration: 3e3 });
      },
      error: (err) => {
        this.saving.set(false);
        this.snack.open(err.error?.detail ?? "Error al guardar usuario", "OK", { duration: 3e3 });
      }
    });
  }
  getRoleClasses(idRol) {
    const map = {
      8: "bg-primary-500 text-white",
      2: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      6: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
      5: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
      7: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
      3: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
      4: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
      11: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
      10: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
      1: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    };
    return map[idRol ?? 0] ?? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  }
  deleteUser(user) {
    if (!confirm(`\xBFEliminar al usuario "${user.username}"?`))
      return;
    this.api.deleteUser(user.id).subscribe({
      next: () => {
        this.users.update((us) => us.filter((u) => u.id !== user.id));
      },
      error: () => {
        this.snack.open("Error al eliminar usuario", "OK", { duration: 3e3 });
      }
    });
  }
  // --- Analysts CRUD Methods ---
  openAnalystForm() {
    this.editingAnalyst.set(null);
    this.analystForm.reset({ id_rol: 2 });
    this.showAnalystForm.set(true);
  }
  editAnalyst(a) {
    this.editingAnalyst.set(a);
    this.analystForm.patchValue({ nombre_analista: a.nombre, id_rol: a.id_rol });
    this.showAnalystForm.set(true);
  }
  saveAnalyst() {
    if (this.analystForm.invalid)
      return;
    this.saving.set(true);
    const a = this.editingAnalyst();
    const request = a ? this.api.updateAnalyst(a.id, this.analystForm.value) : this.api.createAnalyst(this.analystForm.value);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.api.getAnalystsList().subscribe((data) => this.analysts.set(data));
        this.showAnalystForm.set(false);
        this.snack.open(a ? "Analista modificado" : "Analista creado", "OK", { duration: 3e3 });
      },
      error: () => {
        this.saving.set(false);
        this.snack.open("Error guardando analista", "OK", { duration: 3e3 });
      }
    });
  }
  deleteAnalyst(a) {
    if (!confirm(`\xBFEliminar analista "${a.nombre}"?`))
      return;
    this.api.deleteAnalyst(a.id).subscribe({
      next: () => this.api.getAnalystsList().subscribe((data) => this.analysts.set(data)),
      error: () => this.snack.open("Error al eliminar", "OK", { duration: 3e3 })
    });
  }
  // --- Clients CRUD Methods ---
  openClientForm() {
    this.editingClient.set(null);
    this.clientForm.reset({ id_categoria: 1, id_tipo_cliente: 1 });
    this.showClientForm.set(true);
  }
  editClient(c) {
    this.editingClient.set(c);
    this.clientForm.patchValue({ cliente: c.cliente || c.nombre, rif: c.rif, id_categoria: c.id_categoria, id_tipo_cliente: c.id_tipo_cliente });
    this.showClientForm.set(true);
  }
  saveClient() {
    if (this.clientForm.invalid)
      return;
    this.saving.set(true);
    const c = this.editingClient();
    const request = c ? this.api.updateClient(c.id, this.clientForm.value) : this.api.createClient(this.clientForm.value);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.api.getClients().subscribe((data) => this.clients.set(data));
        this.showClientForm.set(false);
        this.snack.open(c ? "Cliente modificado" : "Cliente creado", "OK", { duration: 3e3 });
      },
      error: () => {
        this.saving.set(false);
        this.snack.open("Error guardando cliente", "OK", { duration: 3e3 });
      }
    });
  }
  deleteClient(c) {
    if (!confirm(`\xBFEliminar cliente "${c.cliente || c.nombre}"?`))
      return;
    this.api.deleteClient(c.id).subscribe({
      next: () => this.api.getClients().subscribe((data) => this.clients.set(data)),
      error: () => this.snack.open("Error al eliminar", "OK", { duration: 3e3 })
    });
  }
  manageClientCategories(c) {
    this.dialog.open(ClientCategoriesDialogComponent, {
      width: "760px",
      panelClass: "premium-dialog-panel",
      data: { cliente: c }
    });
  }
  // --- Mercaderistas CRUD Methods ---
  openMercaderistaForm() {
    this.editingMercaderista.set(null);
    this.mercaderistaForm.reset({ tipo_mercaderista: "MERCADERISTA", activo: true });
    this.showMercaderistaForm.set(true);
  }
  editMercaderista(m) {
    this.editingMercaderista.set(m);
    this.mercaderistaForm.patchValue({
      nombre: m.nombre || m.nombre_completo,
      cedula: m.cedula,
      telefono: m.telefono,
      tipo_mercaderista: m.tipo_mercaderista || "MERCADERISTA",
      activo: m.activo
    });
    this.showMercaderistaForm.set(true);
  }
  saveMercaderista() {
    if (this.mercaderistaForm.invalid)
      return;
    this.saving.set(true);
    const m = this.editingMercaderista();
    const request = m ? this.api.updateMercaderista(m.id, this.mercaderistaForm.value) : this.api.createMercaderista(this.mercaderistaForm.value);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.api.getMercaderistas().subscribe((data) => this.mercaderistas.set(data));
        this.showMercaderistaForm.set(false);
        this.snack.open(m ? "Mercaderista modificado" : "Mercaderista creado", "OK", { duration: 3e3 });
      },
      error: () => {
        this.saving.set(false);
        this.snack.open("Error guardando mercaderista", "OK", { duration: 3e3 });
      }
    });
  }
  deleteMercaderista(m) {
    if (!confirm(`\xBFEliminar mercaderista "${m.nombre || m.nombre_completo}"?`))
      return;
    this.api.deleteMercaderista(m.id).subscribe({
      next: () => this.api.getMercaderistas().subscribe((data) => this.mercaderistas.set(data)),
      error: () => this.snack.open("Error al eliminar", "OK", { duration: 3e3 })
    });
  }
  // --- Supervisores CRUD Methods ---
  reloadSupervisors() {
    this.api.getSupervisorsWithAssignments().subscribe((data) => this.supervisors.set(data));
  }
  openSupervisorForm() {
    this.editingSupervisor.set(null);
    this.supervisorForm.reset({ nombre: "" });
    this.showSupervisorForm.set(true);
  }
  editSupervisor(s) {
    this.editingSupervisor.set(s);
    this.supervisorForm.patchValue({ nombre: s.nombre });
    this.showSupervisorForm.set(true);
  }
  saveSupervisor() {
    if (this.supervisorForm.invalid)
      return;
    this.saving.set(true);
    const s = this.editingSupervisor();
    const payload = { nombre: this.supervisorForm.value.nombre };
    const request = s ? this.api.updateSupervisor(s.id, payload) : this.api.createSupervisor(payload);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.reloadSupervisors();
        this.showSupervisorForm.set(false);
        this.snack.open(s ? "Supervisor modificado" : "Supervisor creado", "OK", { duration: 3e3 });
      },
      error: () => {
        this.saving.set(false);
        this.snack.open("Error guardando supervisor", "OK", { duration: 3e3 });
      }
    });
  }
  deleteSupervisor(s) {
    if (!confirm(`\xBFEliminar supervisor "${s.nombre}"?`))
      return;
    this.api.deleteSupervisor(s.id).subscribe({
      next: () => this.reloadSupervisors(),
      error: () => this.snack.open("Error al eliminar", "OK", { duration: 3e3 })
    });
  }
  static {
    this.\u0275fac = function UsersComponent_Factory(t) {
      return new (t || _UsersComponent)(\u0275\u0275directiveInject(ApiService), \u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(MatSnackBar), \u0275\u0275directiveInject(RealtimeService), \u0275\u0275directiveInject(MatDialog));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UsersComponent, selectors: [["app-users"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 59, vars: 15, consts: [[1, "space-y-8", "animate-in", "fade-in", "slide-in-from-bottom-4", "duration-500"], [1, "relative", "rounded-3xl", "overflow-hidden", "p-8", "bg-gradient-to-r", "from-primary-700", "via-primary-600", "to-indigo-600", "shadow-lg", "shadow-primary-500/20"], [1, "absolute", "-right-10", "-top-10", "w-48", "h-48", "rounded-full", "bg-white/10", "blur-2xl"], [1, "absolute", "-left-8", "-bottom-12", "w-56", "h-56", "rounded-full", "bg-indigo-400/20", "blur-3xl"], [1, "relative", "z-10", "flex", "flex-col", "lg:flex-row", "lg:items-center", "justify-between", "gap-6"], [1, "flex", "items-center", "gap-3", "mb-2"], [1, "w-11", "h-11", "rounded-2xl", "bg-white/20", "backdrop-blur-sm", "flex", "items-center", "justify-center"], [1, "text-white"], [1, "text-[11px]", "font-black", "text-white/80", "uppercase", "tracking-[0.2em]"], [1, "text-3xl", "md:text-4xl", "font-black", "text-white", "tracking-tight", "leading-tight"], [1, "text-primary-100", "mt-1", "text-sm", "font-medium"], [1, "grid", "grid-cols-3", "sm:grid-cols-5", "gap-3"], [1, "bg-white/15", "backdrop-blur-sm", "rounded-2xl", "px-4", "py-3", "text-center", "min-w-[64px]"], [1, "text-2xl", "font-black", "text-white"], [1, "text-[10px]", "font-bold", "text-primary-100", "uppercase", "tracking-wider"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "p-2", "overflow-x-auto", "mb-6"], [1, "flex", "gap-1", "min-w-max"], [1, "flex", "items-center", "gap-2", "px-4", "py-2", "rounded-xl", "text-sm", "font-bold", "whitespace-nowrap", "transition-all", 3, "click", "ngClass"], [1, "p-6", "space-y-6"], [1, "p-6"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "p-5", "flex", "flex-col", "md:flex-row", "md:items-end", "gap-4"], [1, "flex-1"], [1, "text-xl", "font-black", "text-slate-900", "dark:text-white"], [1, "text-xs", "text-slate-500", "mt-1"], [1, "flex", "items-center", "gap-2", "px-5", "py-2.5", "rounded-xl", "font-black", "text-sm", "transition-all", "active:scale-95", "whitespace-nowrap", 3, "click", "ngClass"], [1, "!text-base"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-lg", "border", "border-slate-200", "dark:border-white/5", "overflow-hidden", "animate-in", "zoom-in-95", "duration-300", "mb-8"], [1, "flex", "flex-col", "items-center", "justify-center", "py-12", "gap-4"], [1, "bg-slate-50", "dark:bg-slate-900/50", "p-6", "border-b", "border-slate-100", "dark:border-white/5", "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-primary-100", "dark:bg-primary-900/30", "text-primary-600", "flex", "items-center", "justify-center"], [1, "text-lg", "font-bold", "text-slate-800", "dark:text-white"], [1, "text-sm", "text-slate-500"], [1, "space-y-5", 3, "ngSubmit", "formGroup"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-5"], [1, "block", "text-xs", "font-black", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wider", "mb-1.5"], [1, "text-rose-500"], [1, "relative"], [1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-400", "!text-lg", "pointer-events-none"], ["formControlName", "username", "placeholder", "ej. jperez", 1, "w-full", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/10", "focus:border-primary-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "pl-10", "pr-3", "py-3", "text-sm", "font-semibold", "outline-none", "transition-colors"], ["formControlName", "email", "type", "email", "placeholder", "correo@empresa.com", 1, "w-full", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/10", "focus:border-primary-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "pl-10", "pr-3", "py-3", "text-sm", "font-semibold", "outline-none", "transition-colors"], ["class", "text-rose-500", 4, "ngIf"], ["formControlName", "password", "type", "password", 1, "w-full", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/10", "focus:border-primary-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "pl-10", "pr-3", "py-3", "text-sm", "font-semibold", "outline-none", "transition-colors", 3, "placeholder"], [1, "absolute", "right-3", "top-1/2", "-translate-y-1/2", "text-slate-400", "!text-lg", "pointer-events-none"], ["formControlName", "id_rol", 1, "w-full", "appearance-none", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/10", "focus:border-primary-500", "text-slate-800", "dark:text-white", "rounded-xl", "pl-10", "pr-9", "py-3", "text-sm", "font-semibold", "outline-none", "transition-colors", "cursor-pointer"], [3, "ngValue"], [1, "md:col-span-2"], [1, "flex", "items-center", "gap-2", "cursor-pointer", "select-none", "w-fit"], ["type", "checkbox", "formControlName", "activo", 1, "w-5", "h-5", "accent-primary-600", "rounded"], [1, "text-sm", "font-semibold", "text-slate-700", "dark:text-slate-300"], [1, "text-xs", "text-slate-400"], [1, "flex", "items-center", "justify-end", "gap-3", "pt-4", "border-t", "border-slate-100", "dark:border-white/5"], ["type", "button", 1, "px-6", "py-2.5", "rounded-xl", "border", "border-slate-300", "dark:border-slate-700", "text-slate-600", "dark:text-slate-300", "font-bold", "text-sm", "hover:bg-slate-50", "dark:hover:bg-slate-800", "transition-colors", 3, "click"], ["type", "submit", 1, "flex", "items-center", "gap-2", "px-7", "py-2.5", "rounded-xl", "bg-primary-600", "hover:bg-primary-500", "disabled:opacity-50", "text-white", "font-black", "text-sm", "shadow-md", "transition-all", "active:scale-95", 3, "disabled"], ["diameter", "18"], ["formControlName", "id_perfil", 1, "w-full", "appearance-none", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/10", "focus:border-primary-500", "text-slate-800", "dark:text-white", "rounded-xl", "pl-10", "pr-9", "py-3", "text-sm", "font-semibold", "outline-none", "transition-colors", "cursor-pointer"], ["diameter", "48"], [1, "overflow-x-auto", "rounded-2xl", "border", "border-slate-200", "dark:border-white/5"], ["mat-table", "", 1, "w-full", 3, "dataSource"], ["matColumnDef", "id"], ["mat-header-cell", "", "class", "!bg-slate-50 !text-slate-500 !font-bold !py-5", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "!py-4", 4, "matCellDef"], ["matColumnDef", "username"], ["mat-header-cell", "", "class", "!bg-slate-50 dark:!bg-slate-950/50 !text-slate-500 !font-bold !py-5", 4, "matHeaderCellDef"], ["matColumnDef", "email"], ["mat-cell", "", "class", "!py-4 text-slate-600", 4, "matCellDef"], ["matColumnDef", "rol"], ["matColumnDef", "perfil"], ["mat-cell", "", "class", "!py-4 text-slate-600 font-medium", 4, "matCellDef"], ["matColumnDef", "activo"], ["matColumnDef", "acciones"], ["mat-header-cell", "", "class", "!bg-slate-50 !text-slate-500 !font-bold !py-5 text-right px-6", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "!py-4 text-right px-6", 4, "matCellDef"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "hover:bg-slate-50 transition-colors border-b border-slate-100", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", "", 1, "!bg-slate-50", "!text-slate-500", "!font-bold", "!py-5"], ["mat-cell", "", 1, "!py-4"], [1, "text-xs", "font-mono", "text-slate-400"], ["mat-header-cell", "", 1, "!bg-slate-50", "dark:!bg-slate-950/50", "!text-slate-500", "!font-bold", "!py-5"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-2xl", "bg-primary-50", "text-primary-600", "flex", "items-center", "justify-center", "font-bold"], [1, "font-bold", "text-slate-800", "dark:text-white"], ["mat-cell", "", 1, "!py-4", "text-slate-600"], [1, "px-3", "py-1", "rounded-lg", "text-xs", "font-bold", "uppercase", "tracking-wider"], ["mat-cell", "", 1, "!py-4", "text-slate-600", "font-medium"], [1, "flex", "items-center", "gap-2"], [1, "w-2", "h-2", "rounded-full"], [1, "text-sm", "font-medium"], ["mat-header-cell", "", 1, "!bg-slate-50", "!text-slate-500", "!font-bold", "!py-5", "text-right", "px-6"], ["mat-cell", "", 1, "!py-4", "text-right", "px-6"], ["mat-icon-button", "", 3, "click", "matTooltip"], ["mat-icon-button", "", 1, "hover:!bg-slate-100", "!text-slate-400", 3, "click"], ["mat-icon-button", "", 1, "hover:!bg-rose-50", "!text-rose-500", 3, "click"], ["mat-header-row", ""], ["mat-row", "", 1, "hover:bg-slate-50", "transition-colors", "border-b", "border-slate-100"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "p-5", "mb-6", "flex", "flex-col", "md:flex-row", "md:items-end", "gap-4"], [1, "flex", "flex-col", "sm:flex-row", "gap-3", "items-stretch", "sm:items-end"], [1, "space-y-1"], [1, "text-[10px]", "font-black", "text-slate-500", "uppercase", "tracking-widest"], ["placeholder", "Nombre del analista", 1, "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-3", "py-2", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "w-full", "md:w-72", 3, "ngModelChange", "keyup.enter", "ngModel"], [1, "flex", "items-center", "gap-2", "px-5", "py-2", "bg-primary-600", "hover:bg-primary-500", "disabled:opacity-40", "text-white", "font-black", "rounded-xl", "text-sm", "shadow-lg", "transition-all", "active:scale-95", 3, "click", "disabled"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-4"], [1, "!shadow-sm", "!rounded-2xl", "border", "border-slate-100", "dark:border-white/5", "dark:!bg-slate-800", "relative", "group"], [1, "bg-blue-50", "dark:bg-blue-900/30", "p-5", "border-b", "border-blue-100", "dark:border-blue-900/50", "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-blue-100", "text-blue-600", "flex", "items-center", "justify-center"], [1, "text-xs", "text-slate-500"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6", 3, "ngSubmit", "formGroup"], ["appearance", "outline", 1, "w-full"], ["matInput", "", "formControlName", "nombre_analista"], ["matPrefix", "", 1, "text-slate-400", "mr-2"], [1, "flex", "items-center", "justify-end", "gap-3", "mt-2", "md:mt-0"], ["mat-stroked-button", "", "type", "button", 1, "!rounded-xl", "!h-12", "px-6", 3, "click"], ["mat-flat-button", "", "color", "primary", "type", "submit", 1, "!rounded-xl", "!h-12", "px-8", "shadow-md", 3, "disabled"], [1, "!p-4", "flex", "flex-col", "justify-between", "h-full", "gap-2"], [1, "w-10", "h-10", "rounded-2xl", "bg-blue-100", "text-blue-600", "flex", "items-center", "justify-center", "shrink-0"], [1, "font-bold", "text-base", "text-slate-800", "dark:text-white"], [1, "flex", "justify-end", "gap-2", "opacity-100", "md:opacity-0", "md:group-hover:opacity-100", "transition-opacity"], ["mat-icon-button", "", "color", "primary", 3, "click"], ["mat-icon-button", "", "color", "warn", 3, "click"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "border", "border-slate-200", "dark:border-white/5", "shadow-sm", "p-5", "mb-6", "flex", "flex-col", "lg:flex-row", "lg:items-end", "gap-4"], ["placeholder", "Ej. Coca Cola", 1, "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-3", "py-2", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "w-full", "md:w-56", 3, "ngModelChange", "keyup.enter", "ngModel"], ["placeholder", "J-12345678-9", 1, "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-3", "py-2", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "w-full", "md:w-44", 3, "ngModelChange", "keyup.enter", "ngModel"], [1, "bg-indigo-50", "dark:bg-indigo-900/30", "p-5", "border-b", "border-indigo-100", "dark:border-indigo-900/50", "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-indigo-100", "text-indigo-600", "flex", "items-center", "justify-center"], ["formControlName", "cliente", "placeholder", "Ej. Coca Cola, Unilever...", 1, "w-full", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/10", "focus:border-primary-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "pl-10", "pr-3", "py-3", "text-sm", "font-semibold", "outline-none", "transition-colors"], ["formControlName", "rif", "placeholder", "J-12345678-9", 1, "w-full", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/10", "focus:border-primary-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "pl-10", "pr-3", "py-3", "text-sm", "font-semibold", "outline-none", "transition-colors"], [1, "text-xs", "text-slate-400", "flex", "items-center", "gap-1.5"], [1, "!text-sm"], [1, "font-bold", "text-lg", "text-slate-800", "dark:text-white"], [1, "text-sm", "text-slate-500", "dark:text-slate-400", "font-mono"], [1, "text-xs", "text-slate-400", "mt-1"], ["mat-icon-button", "", "color", "accent", "matTooltip", "Categor\xEDas de Productos", 3, "click"], ["mat-icon-button", "", "color", "primary", "matTooltip", "Editar Cliente", 3, "click"], ["mat-icon-button", "", "color", "warn", "matTooltip", "Eliminar Cliente", 3, "click"], [1, "bg-amber-50", "dark:bg-amber-900/30", "p-5", "border-b", "border-amber-100", "dark:border-amber-900/50", "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-amber-100", "text-amber-600", "flex", "items-center", "justify-center"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-5"], ["formControlName", "nombre", "placeholder", "Nombre y apellido", 1, "w-full", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/10", "focus:border-primary-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "pl-10", "pr-3", "py-3", "text-sm", "font-semibold", "outline-none", "transition-colors"], ["formControlName", "cedula", "placeholder", "V-12345678", 1, "w-full", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/10", "focus:border-primary-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "pl-10", "pr-3", "py-3", "text-sm", "font-semibold", "outline-none", "transition-colors"], ["formControlName", "telefono", "placeholder", "0412-1234567", 1, "w-full", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-white/10", "focus:border-primary-500", "text-slate-800", "dark:text-white", "placeholder-slate-400", "rounded-xl", "pl-10", "pr-3", "py-3", "text-sm", "font-semibold", "outline-none", "transition-colors"], [1, "text-sm", "text-slate-500", "dark:text-slate-300"], [1, "flex", "justify-between", "items-center", "mt-2"], [1, "flex", "items-center", "gap-1"], [1, "text-xs", "font-medium"], [1, "flex", "justify-end", "gap-1", "opacity-100", "md:opacity-0", "md:group-hover:opacity-100", "transition-opacity"], ["placeholder", "Nombre del supervisor", 1, "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "focus:border-primary-500", "rounded-xl", "px-3", "py-2", "text-sm", "font-semibold", "text-slate-900", "dark:text-white", "placeholder-slate-400", "outline-none", "w-full", "md:w-72", 3, "ngModelChange", "keyup.enter", "ngModel"], [1, "col-span-3", "py-12", "text-center", "text-slate-400"], ["matInput", "", "formControlName", "nombre"], [1, "!p-4", "flex", "flex-col", "justify-between", "h-full", "gap-3"], [1, "w-10", "h-10", "rounded-2xl", "bg-amber-100", "text-amber-600", "flex", "items-center", "justify-center", "shrink-0"], [1, "flex", "items-center", "gap-2", "text-xs"], [1, "px-2", "py-1", "rounded-lg", "bg-primary-50", "text-primary-700", "font-bold"], [1, "px-2", "py-1", "rounded-lg", "bg-emerald-50", "text-emerald-700", "font-bold"], [1, "!text-5xl", "opacity-40"], [1, "font-bold", "mt-2"]], template: function UsersComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
        \u0275\u0275element(2, "div", 2)(3, "div", 3);
        \u0275\u0275elementStart(4, "div", 4)(5, "div")(6, "div", 5)(7, "div", 6)(8, "mat-icon", 7);
        \u0275\u0275text(9, "groups");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "span", 8);
        \u0275\u0275text(11, "Centro de Personal");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "h1", 9);
        \u0275\u0275text(13, "Gesti\xF3n de Usuarios y Perfiles");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "p", 10);
        \u0275\u0275text(15, "Accesos, roles, analistas, supervisores, clientes y mercaderistas.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(16, "div", 11)(17, "div", 12)(18, "div", 13);
        \u0275\u0275text(19);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "div", 14);
        \u0275\u0275text(21, "Usuarios");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(22, "div", 12)(23, "div", 13);
        \u0275\u0275text(24);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(25, "div", 14);
        \u0275\u0275text(26, "Analistas");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(27, "div", 12)(28, "div", 13);
        \u0275\u0275text(29);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(30, "div", 14);
        \u0275\u0275text(31, "Supervis.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(32, "div", 12)(33, "div", 13);
        \u0275\u0275text(34);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(35, "div", 14);
        \u0275\u0275text(36, "Clientes");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(37, "div", 12)(38, "div", 13);
        \u0275\u0275text(39);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(40, "div", 14);
        \u0275\u0275text(41, "Mercad.");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(42, "div", 15)(43, "div", 16)(44, "button", 17);
        \u0275\u0275listener("click", function UsersComponent_Template_button_click_44_listener() {
          return ctx.activeTab.set("usuarios");
        });
        \u0275\u0275text(45, "Usuarios");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(46, "button", 17);
        \u0275\u0275listener("click", function UsersComponent_Template_button_click_46_listener() {
          return ctx.activeTab.set("analistas");
        });
        \u0275\u0275text(47, "Analistas");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(48, "button", 17);
        \u0275\u0275listener("click", function UsersComponent_Template_button_click_48_listener() {
          return ctx.activeTab.set("clientes");
        });
        \u0275\u0275text(49, "Clientes");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(50, "button", 17);
        \u0275\u0275listener("click", function UsersComponent_Template_button_click_50_listener() {
          return ctx.activeTab.set("mercaderistas");
        });
        \u0275\u0275text(51, "Mercaderistas");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(52, "button", 17);
        \u0275\u0275listener("click", function UsersComponent_Template_button_click_52_listener() {
          return ctx.activeTab.set("supervisores");
        });
        \u0275\u0275text(53, "Supervisores");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(54, UsersComponent_Conditional_54_Template, 14, 6, "div", 18)(55, UsersComponent_Conditional_55_Template, 20, 4, "div", 19)(56, UsersComponent_Conditional_56_Template, 24, 5, "div", 19)(57, UsersComponent_Conditional_57_Template, 15, 5, "div", 19)(58, UsersComponent_Conditional_58_Template, 24, 4, "div", 19);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(19);
        \u0275\u0275textInterpolate(ctx.users().length);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.realAnalysts.length);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.supervisors().length);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.clients().length);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.mercaderistas().length);
        \u0275\u0275advance(5);
        \u0275\u0275property("ngClass", ctx.activeTab() === "usuarios" ? "bg-primary-600 text-white shadow-md" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5");
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", ctx.activeTab() === "analistas" ? "bg-primary-600 text-white shadow-md" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5");
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", ctx.activeTab() === "clientes" ? "bg-primary-600 text-white shadow-md" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5");
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", ctx.activeTab() === "mercaderistas" ? "bg-primary-600 text-white shadow-md" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5");
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", ctx.activeTab() === "supervisores" ? "bg-primary-600 text-white shadow-md" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5");
        \u0275\u0275advance(2);
        \u0275\u0275conditional(54, ctx.activeTab() === "usuarios" ? 54 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(55, ctx.activeTab() === "analistas" ? 55 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(56, ctx.activeTab() === "clientes" ? 56 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(57, ctx.activeTab() === "mercaderistas" ? 57 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(58, ctx.activeTab() === "supervisores" ? 58 : -1);
      }
    }, dependencies: [CommonModule, NgClass, NgIf, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, MatCardModule, MatCard, MatCardContent, MatTableModule, MatTable, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatButtonModule, MatButton, MatIconButton, MatIconModule, MatIcon, MatFormFieldModule, MatFormField, MatLabel, MatPrefix, MatInputModule, MatInput, MatSelectModule, MatProgressSpinnerModule, MatProgressSpinner, MatSnackBarModule, MatTabsModule, MatTooltipModule, MatTooltip, FormsModule, NgModel, MatDialogModule], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n/*# sourceMappingURL=users.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UsersComponent, { className: "UsersComponent", filePath: "src\\app\\features\\users\\users.component.ts", lineNumber: 33 });
})();
export {
  UsersComponent
};
//# sourceMappingURL=chunk-XWTWTH5S.js.map
