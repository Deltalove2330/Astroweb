import {
  environment
} from "./chunk-NRWDSKQC.js";
import {
  NgZone,
  Subject,
  signal,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-QB3BCYT5.js";

// src/app/core/services/realtime.service.ts
var RealtimeService = class _RealtimeService {
  constructor(zone) {
    this.zone = zone;
    this.manualClose = false;
    this._events = new Subject();
    this.events$ = this._events.asObservable();
    this.connected = signal(false);
  }
  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING))
      return;
    this.manualClose = false;
    const base = environment.wsUrl || `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}`;
    const url = `${base}/api/ws/events`;
    try {
      this.ws = new WebSocket(url);
      this.ws.onopen = () => this.zone.run(() => this.connected.set(true));
      this.ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg && msg.tipo)
            this.zone.run(() => this._events.next(msg));
        } catch {
        }
      };
      this.ws.onclose = () => {
        this.zone.run(() => this.connected.set(false));
        if (!this.manualClose)
          this.scheduleReconnect();
      };
      this.ws.onerror = () => {
        try {
          this.ws?.close();
        } catch {
        }
      };
    } catch {
      this.scheduleReconnect();
    }
  }
  scheduleReconnect() {
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => this.connect(), 4e3);
  }
  disconnect() {
    this.manualClose = true;
    clearTimeout(this.reconnectTimer);
    try {
      this.ws?.close();
    } catch {
    }
    this.ws = void 0;
  }
  static {
    this.\u0275fac = function RealtimeService_Factory(t) {
      return new (t || _RealtimeService)(\u0275\u0275inject(NgZone));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RealtimeService, factory: _RealtimeService.\u0275fac, providedIn: "root" });
  }
};

export {
  RealtimeService
};
//# sourceMappingURL=chunk-7WZINN4L.js.map
