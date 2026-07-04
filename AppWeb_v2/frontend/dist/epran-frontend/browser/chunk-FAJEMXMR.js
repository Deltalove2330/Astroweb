import {
  Router
} from "./chunk-QGVFX6Y7.js";
import {
  environment
} from "./chunk-NRWDSKQC.js";
import {
  HttpClient,
  signal,
  tap,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-QB3BCYT5.js";

// src/app/core/services/auth.service.ts
var AuthService = class _AuthService {
  constructor(http, router) {
    this.http = http;
    this.router = router;
    this.TOKEN_KEY = "epran_token";
    this.USER_KEY = "epran_user";
    this.currentUser = signal(this.loadUser());
  }
  login(credentials) {
    return this.http.post(`${environment.apiUrl}/auth/login`, credentials).pipe(tap((res) => this.handleAuthSuccess(res)));
  }
  loginMercaderista(credentials) {
    return this.http.post(`${environment.apiUrl}/auth/login-mercaderista`, credentials).pipe(tap((res) => this.handleAuthSuccess(res)));
  }
  logout() {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({
      complete: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }
  getMe() {
    return this.http.get(`${environment.apiUrl}/auth/me`).pipe(tap((user) => {
      this.currentUser.set(user);
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }));
  }
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  isLoggedIn() {
    return !!this.getToken();
  }
  hasRole(...roles) {
    const user = this.currentUser();
    return user ? roles.includes(user.rol) : false;
  }
  /** ¿El usuario tiene registros de permisos configurados? (si no, se cae al rol) */
  hasAnyPerms() {
    const u = this.currentUser();
    return !!(u && u.permisos && u.permisos.length > 0);
  }
  /** ¿Puede el usuario 'read' | 'write' | 'delete' sobre la clave del módulo/botón?
   *  Admin = todo. Si no hay permiso para la clave → false. */
  can(clave, action = "read") {
    const u = this.currentUser();
    if (!u)
      return false;
    if (u.is_admin)
      return true;
    const p = (u.permisos || []).find((x) => x.module === clave);
    if (!p)
      return false;
    if (action === "write")
      return !!p.can_write;
    if (action === "delete")
      return !!p.can_delete;
    return !!p.can_read;
  }
  /** Decide si un usuario puede ACCEDER a un módulo/ruta.
   *  - Admin: siempre.
   *  - Si tiene permisos configurados: manda el permiso (can_read de la clave).
   *  - Si NO tiene permisos: se cae al rol (comportamiento previo, no rompe nada). */
  canAccess(clave, roles = []) {
    const u = this.currentUser();
    if (!u)
      return false;
    if (u.is_admin || u.rol === "admin")
      return true;
    if (this.hasAnyPerms())
      return this.can(clave, "read");
    return roles.length === 0 || roles.includes(u.rol);
  }
  /** clave del catálogo MODULOS a partir de la ruta (/client/visits → client-visits) */
  static claveFromRoute(route) {
    return (route || "").replace(/^\//, "").replace(/\//g, "-") || "dashboard";
  }
  redirectAfterLogin(rol) {
    const routes = {
      admin: "/dashboard",
      analyst: "/dashboard",
      supervisor: "/supervisor",
      client: "/client",
      mercaderista: "/mercaderista",
      auditor_campo: "/auditor-campo",
      encuestador: "/encuestador/dashboard",
      cliente_encuestador: "/cliente-encuestador/dashboard"
    };
    this.router.navigateByUrl(routes[rol] ?? "/dashboard");
  }
  handleAuthSuccess(res) {
    localStorage.setItem(this.TOKEN_KEY, res.access_token);
    this.getMe().subscribe((user) => {
      this.redirectAfterLogin(user.rol);
    });
  }
  clearSession() {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigateByUrl("/login");
  }
  loadUser() {
    try {
      const raw = sessionStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  static {
    this.\u0275fac = function AuthService_Factory(t) {
      return new (t || _AuthService)(\u0275\u0275inject(HttpClient), \u0275\u0275inject(Router));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
  }
};

export {
  AuthService
};
//# sourceMappingURL=chunk-FAJEMXMR.js.map
