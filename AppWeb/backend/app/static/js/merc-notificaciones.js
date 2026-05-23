/**
 * merc-notificaciones.js — v8 DEFINITIVO
 * UBICACIÓN: backend/app/static/js/merc-notificaciones.js
 *
 * FIXES v8:
 * - iOS: requestPermission() DEBE ser llamado desde un gesto de usuario explícito.
 *   Se inyecta un botón flotante "🔔 Activar notificaciones" si el permiso es 'default'.
 * - iOS: NO usa new Notification() (no soportado en iOS Safari dentro de SW). Todo
 *   va por postMessage al SW controller.
 * - Polling robusto: si fetch falla (red caída) no bloquea el intervalo.
 * - Suscripción persistente: al cargar verifica si ya hay suscripción activa y la re-envía.
 */
;(function () {
    'use strict';

    var ICON          = '/static/icons/web-app-manifest-192x192.png';
    var cedula        = null;
    var prevAnalistas = -1;
    var prevClientes  = -1;
    var audioCtx      = null;
    var modalAnal     = false;
    var modalCli      = false;
    var swReg         = null;   // Registro global del SW

    document.addEventListener('DOMContentLoaded', function () {
        inyectarCSS();
        setupAudio();
        rastrearModales();
        esperarCedula(function (ced) {
            cedula = ced;
            registrarSW();
            iniciarPolling();
            iniciarSockets();
        });
    });

    /* ══════════════════════════════════════════════════════════
       ESPERAR CÉDULA
       ══════════════════════════════════════════════════════════ */
    function esperarCedula(cb) {
        var n = 0;
        var t = setInterval(function () {
            var c = sessionStorage.getItem('merchandiser_cedula');
            if (c) { clearInterval(t); cb(c); }
            else if (++n > 40) clearInterval(t);
        }, 500);
    }

    /* ══════════════════════════════════════════════════════════
       SERVICE WORKER
       ══════════════════════════════════════════════════════════ */
    function registrarSW() {
        if (!('serviceWorker' in navigator)) {
            console.warn('[MercNotif] ServiceWorker no disponible');
            return;
        }

        navigator.serviceWorker
            .register('/sw-mercaderista.js', { scope: '/' })
            .then(function (reg) {
                swReg = reg;
                console.info('[MercNotif] SW registrado ✅ scope:', reg.scope);

                // Forzar actualización si hay nueva versión esperando
                if (reg.waiting) {
                    reg.waiting.postMessage({ accion: 'skipWaiting' });
                }
                reg.addEventListener('updatefound', function () {
                    var w = reg.installing;
                    if (!w) return;
                    w.addEventListener('statechange', function () {
                        if (w.state === 'installed' && navigator.serviceWorker.controller) {
                            w.postMessage({ accion: 'skipWaiting' });
                        }
                    });
                });

                return navigator.serviceWorker.ready;
            })
            .then(function (reg) {
                swReg = reg;
                manejarPermisoNotificaciones(reg);
            })
            .catch(function (err) {
                console.error('[MercNotif] Error registrando SW:', err);
            });

        // Mensajes del SW → abrir chat correcto al tocar notificación
        navigator.serviceWorker.addEventListener('message', function (e) {
            if (!e.data) return;
            if (e.data.tipo === 'analistas' && typeof abrirChatsAnalistas === 'function') {
                window.focus(); setTimeout(abrirChatsAnalistas, 200);
            }
            if (e.data.tipo === 'clientes' && typeof abrirChatsClientes === 'function') {
                window.focus(); setTimeout(abrirChatsClientes, 200);
            }
        });
    }

    /* ══════════════════════════════════════════════════════════
       MANEJO DE PERMISO — iOS necesita gesto explícito
       ══════════════════════════════════════════════════════════ */
    function manejarPermisoNotificaciones(reg) {
        if (!('PushManager' in window)) {
            console.warn('[MercNotif] PushManager no disponible (iOS < 16.4 fuera de home screen, o HTTP puro)');
            return;
        }

        var perm = Notification.permission;

        if (perm === 'granted') {
            // Ya tiene permiso → suscribir directamente
            suscribirAlServidor(reg);

        } else if (perm === 'default') {
            /*
             * iOS Safari EXIGE que requestPermission() sea llamado desde
             * un handler de click/tap. Si se llama automáticamente, lo ignora
             * silenciosamente y el permiso queda 'default' para siempre.
             * Solución: mostrar botón flotante que el usuario toca.
             */
            mostrarBotonActivar(reg);

        } else {
            // 'denied' — no se puede hacer nada
            console.warn('[MercNotif] Permiso de notificaciones denegado');
        }
    }

    function mostrarBotonActivar(reg) {
        // Evitar duplicados
        if (document.getElementById('btn-activar-notif')) return;

        var btn = document.createElement('button');
        btn.id             = 'btn-activar-notif';
        btn.innerHTML      = '🔔 Activar notificaciones';
        btn.style.cssText  =
            'position:fixed;bottom:80px;right:16px;z-index:9999;' +
            'background:#0d6efd;color:#fff;border:none;border-radius:24px;' +
            'padding:10px 18px;font-size:14px;font-weight:600;' +
            'box-shadow:0 4px 12px rgba(0,0,0,.3);cursor:pointer;' +
            'animation:pulseBtnNotif 2s infinite;';

        btn.addEventListener('click', function () {
            btn.disabled    = true;
            btn.textContent = '⏳ Activando…';

            // Dentro del click: iOS acepta requestPermission()
            var req = Notification.requestPermission();
            var p   = (req && typeof req.then === 'function') ? req : Promise.resolve(req);

            p.then(function (perm) {
                btn.remove();
                if (perm === 'granted') {
                    suscribirAlServidor(reg);
                } else {
                    console.warn('[MercNotif] Permiso no concedido:', perm);
                }
            }).catch(function (err) {
                btn.remove();
                console.error('[MercNotif] Error en requestPermission:', err);
            });
        });

        document.body.appendChild(btn);
        console.info('[MercNotif] Botón "Activar notificaciones" mostrado');
    }

    /* ══════════════════════════════════════════════════════════
       SUSCRIPCIÓN WEB PUSH
       ══════════════════════════════════════════════════════════ */
    function suscribirAlServidor(reg) {
        // Este endpoint NO tiene @login_required
        fetch('/api/push-vapid-public-key')
            .then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.json();
            })
            .then(function (d) {
                if (!d.public_key) throw new Error('Sin public_key');
                var appKey = urlBase64ToUint8Array(d.public_key);

                return reg.pushManager.getSubscription().then(function (subExistente) {
                    if (subExistente) {
                        console.info('[MercNotif] Suscripción existente, re-enviando al servidor');
                        return guardarEnServidor(subExistente);
                    }
                    return reg.pushManager.subscribe({
                        userVisibleOnly:      true,
                        applicationServerKey: appKey
                    }).then(guardarEnServidor);
                });
            })
            .catch(function (err) {
                console.error('[MercNotif] Error suscribiendo:', err);
            });
    }

    function guardarEnServidor(sub) {
        var ced = sessionStorage.getItem('merchandiser_cedula');
        if (!ced) { console.warn('[MercNotif] Sin cédula en sessionStorage'); return; }

        return fetch('/api/push-subscribe', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ cedula: ced, subscription: sub.toJSON() })
        })
        .then(function (r) { return r.json(); })
        .then(function (d) {
            if (d.success) console.info('[MercNotif] Suscripción guardada ✅ cédula:', ced);
            else           console.warn('[MercNotif] Servidor rechazó suscripción:', d);
        })
        .catch(function (err) {
            console.error('[MercNotif] Error guardando suscripción:', err);
        });
    }

    function urlBase64ToUint8Array(b64) {
        var pad = '='.repeat((4 - b64.length % 4) % 4);
        var raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
        var arr = new Uint8Array(raw.length);
        for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
        return arr;
    }

    /* ══════════════════════════════════════════════════════════
       MOSTRAR NOTIFICACIÓN (app en primer plano)
       iOS no soporta new Notification() fuera del SW — siempre via postMessage
       ══════════════════════════════════════════════════════════ */
    function mostrarNotificacion(titulo, cuerpo, tipo) {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;

        var ctrl = navigator.serviceWorker && navigator.serviceWorker.controller;
        if (ctrl) {
            ctrl.postMessage({ accion: 'mostrar', titulo: titulo, cuerpo: cuerpo, tipo: tipo });
            return;
        }

        // Fallback solo en Android Chrome con app en primer plano (iOS no entra aquí)
        var isIOS = /ipad|iphone|ipod/i.test(navigator.userAgent);
        if (isIOS) return; // iOS solo acepta notificaciones del SW

        try {
            var n = new Notification(titulo, {
                body: cuerpo, icon: ICON, tag: 'hjassta-' + tipo, renotify: true
            });
            n.onclick = function () {
                window.focus(); n.close();
                if (tipo === 'analistas' && typeof abrirChatsAnalistas === 'function') abrirChatsAnalistas();
                if (tipo === 'clientes'  && typeof abrirChatsClientes  === 'function') abrirChatsClientes();
            };
            setTimeout(function () { try { n.close(); } catch (_) {} }, 8000);
        } catch (err) {
            console.warn('[MercNotif] Notification() falló:', err);
        }
    }

    /* ══════════════════════════════════════════════════════════
       POLLING HTTP — cada 8 segundos, también al volver a la app
       ══════════════════════════════════════════════════════════ */
    function iniciarPolling() {
        verificarTodo();
        setInterval(verificarTodo, 8000);
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) verificarTodo();
        });
    }

    function verificarTodo() { verificarAnalistas(); verificarClientes(); }

    function verificarAnalistas() {
        var ced = sessionStorage.getItem('merchandiser_cedula');
        if (!ced) return;
        fetch('/api/merchandiser-unread-count/' + ced)
            .then(function (r) { return r.json(); })
            .then(function (d) {
                var n = parseInt(d.unread_count || 0, 10);
                actualizarBtnAnalistas(n);
                if (prevAnalistas >= 0 && n > prevAnalistas && !modalAnal) {
                    var diff = n - prevAnalistas;
                    sonar('analista');
                    pulsarBoton('btnChatAnalistas', 'success');
                    mostrarNotificacion(
                        '💬 Nuevo mensaje — Analistas',
                        diff + ' mensaje' + (diff > 1 ? 's nuevos' : ' nuevo'),
                        'analistas'
                    );
                }
                prevAnalistas = n;
            }).catch(function () {});
    }

    function verificarClientes() {
        var ced = sessionStorage.getItem('merchandiser_cedula');
        if (!ced) return;
        fetch('/api/merchandiser-unread-count-clientes/' + ced)
            .then(function (r) { return r.json(); })
            .then(function (d) {
                var n = parseInt(d.unread_count || 0, 10);
                actualizarBtnClientes(n);
                if (prevClientes >= 0 && n > prevClientes && !modalCli) {
                    var diff = n - prevClientes;
                    sonar('cliente');
                    pulsarBoton('btnChatClientes', 'warning');
                    mostrarNotificacion(
                        '🏢 Nuevo mensaje — Clientes',
                        diff + ' mensaje' + (diff > 1 ? 's nuevos' : ' nuevo'),
                        'clientes'
                    );
                }
                prevClientes = n;
            }).catch(function () {});
    }

    /* ══════════════════════════════════════════════════════════
       SOCKETS — disparan verificación inmediata al llegar mensaje
       ══════════════════════════════════════════════════════════ */
    function iniciarSockets() {
        if (typeof io === 'undefined') return;

        var sockA = io('/chat', {
            transports: ['websocket', 'polling'],
            reconnection: true, reconnectionAttempts: Infinity, reconnectionDelay: 3000
        });
        sockA.on('new_message', function () { setTimeout(verificarAnalistas, 400); });

        var sockC = io('/chat_cliente', {
            transports: ['websocket', 'polling'],
            reconnection: true, reconnectionAttempts: Infinity, reconnectionDelay: 3000
        });
        sockC.on('new_message_cliente', function () { setTimeout(verificarClientes, 400); });
    }

    /* ══════════════════════════════════════════════════════════
       BADGES
       ══════════════════════════════════════════════════════════ */
    function actualizarBtnAnalistas(count) {
        var btn   = document.getElementById('btnChatAnalistas');
        var badge = document.getElementById('chatNotificationBadge');
        if (!btn) return;
        if (count > 0) {
            btn.className = btn.className.replace(/btn-outline-primary|btn-primary/g, '').trim();
            if (btn.className.indexOf('btn-success') === -1) btn.className += ' btn-success';
            btn.innerHTML = '<i class="bi bi-envelope me-1"></i>' + count + ' nuevo' + (count > 1 ? 's' : '');
            if (badge) { badge.textContent = count; badge.style.display = ''; }
        } else {
            btn.className = btn.className.replace(/\bbtn-success\b/g, '').trim();
            if (btn.className.indexOf('btn-outline-primary') === -1) btn.className += ' btn-outline-primary';
            btn.innerHTML = '<i class="bi bi-envelope-open me-1"></i>Abrir Chats';
            if (badge) badge.style.display = 'none';
        }
    }

    function actualizarBtnClientes(count) {
        var btn   = document.getElementById('btnChatClientes');
        var badge = document.getElementById('chatClientesNotificationBadge');
        if (!btn) return;
        if (count > 0) {
            btn.className = btn.className.replace(/\bbtn-outline-warning\b/g, '').trim();
            if (btn.className.indexOf('btn-warning') === -1) btn.className += ' btn-warning';
            btn.innerHTML = '<i class="bi bi-chat-left-dots me-1"></i>' + count + ' nuevo' + (count > 1 ? 's' : '');
            if (badge) { badge.textContent = count; badge.style.display = ''; }
        } else {
            btn.className = btn.className.replace(/\bbtn-warning\b/g, '').trim();
            if (btn.className.indexOf('btn-outline-warning') === -1) btn.className += ' btn-outline-warning';
            btn.innerHTML = '<i class="bi bi-chat-left-dots-fill me-1"></i>Abrir Chats';
            if (badge) badge.style.display = 'none';
        }
    }

    /* ══════════════════════════════════════════════════════════
       AUDIO
       ══════════════════════════════════════════════════════════ */
    function setupAudio() {
        var crear = function () {
            if (!audioCtx) try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (_) {}
        };
        document.addEventListener('click',      crear, { once: true });
        document.addEventListener('touchstart', crear, { once: true });
        document.addEventListener('keydown',    crear, { once: true });
    }

    function sonar(tipo) {
        if (!audioCtx) return;
        try {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            var notas = tipo === 'analista'
                ? [{ f: 880, t: 0.00 }, { f: 1100, t: 0.18 }]
                : [{ f: 659, t: 0.00 }, { f: 659,  t: 0.16 }, { f: 880, t: 0.32 }];
            notas.forEach(function (nota) {
                var osc = audioCtx.createOscillator(), gai = audioCtx.createGain();
                osc.connect(gai); gai.connect(audioCtx.destination);
                osc.type = 'sine'; osc.frequency.value = nota.f;
                var t = audioCtx.currentTime + nota.t;
                gai.gain.setValueAtTime(0, t);
                gai.gain.linearRampToValueAtTime(0.35, t + 0.01);
                gai.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
                osc.start(t); osc.stop(t + 0.25);
            });
        } catch (_) {}
    }

    function pulsarBoton(id, color) {
        var btn = document.getElementById(id);
        if (!btn) return;
        var cls = 'merc-glow-' + color;
        btn.classList.add(cls);
        setTimeout(function () { btn.classList.remove(cls); }, 2500);
    }

    function rastrearModales() {
        document.addEventListener('shown.bs.modal', function (e) {
            if (!e.target) return;
            if (e.target.id === 'chatIndividualModal')         modalAnal = true;
            if (e.target.id === 'chatIndividualModalClientes') modalCli  = true;
        });
        document.addEventListener('hidden.bs.modal', function (e) {
            if (!e.target) return;
            if (e.target.id === 'chatIndividualModal')         { modalAnal = false; verificarAnalistas(); }
            if (e.target.id === 'chatIndividualModalClientes') { modalCli  = false; verificarClientes(); }
        });
    }

    function inyectarCSS() {
        var st = document.createElement('style');
        st.textContent =
            '@keyframes gwS{0%{box-shadow:0 0 0 0 rgba(40,167,69,.85)}70%{box-shadow:0 0 0 18px rgba(40,167,69,0)}100%{box-shadow:0 0 0 0 rgba(40,167,69,0)}}' +
            '@keyframes gwW{0%{box-shadow:0 0 0 0 rgba(255,193,7,.9)}70%{box-shadow:0 0 0 18px rgba(255,193,7,0)}100%{box-shadow:0 0 0 0 rgba(255,193,7,0)}}' +
            '.merc-glow-success{animation:gwS .7s ease-out 3}' +
            '.merc-glow-warning{animation:gwW .7s ease-out 3}' +
            '@keyframes pulseBtnNotif{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.85;transform:scale(1.05)}}';
        document.head.appendChild(st);
    }

    window.MercNotif = { verificar: verificarTodo };
})();