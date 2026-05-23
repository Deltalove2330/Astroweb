/**
 * merc-notificaciones.js  —  v4 DEFINITIVO (Web Push VAPID)
 * ============================================================
 * Coloca en: /app/static/js/modules/merc-notificaciones.js
 *
 * ✅ Badges en tiempo real (polling 8s + sockets)
 * ✅ Notificaciones push al teléfono — app minimizada / pantalla bloqueada
 * ✅ Sonido sin archivos externos (Web Audio API)
 * ✅ Compatible iPhone (PWA instalada iOS 16.4+) y Android
 * ✅ NO toca ningún archivo existente
 */
;(function () {
    'use strict';

    /* ── Estado ─────────────────────────────────────────────── */
    var cedula           = null;
    var prevAnalistas    = -1;
    var prevClientes     = -1;
    var audioCtx         = null;
    var sockA            = null;
    var sockC            = null;
    var salasA           = {};
    var salasC           = {};
    var modalAnalAbierto = false;
    var modalCliAbierto  = false;

    /* ── Arranque ─────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {
        esperarCedula(function (ced) {
            cedula = ced;
            setupAudio();
            rastrearModales();
            registrarSWyPush();
            iniciarPolling();
            iniciarSockets();
        });
    });

    function esperarCedula(cb) {
        var n = 0;
        var t = setInterval(function () {
            var c = sessionStorage.getItem('merchandiser_cedula');
            if (c) { clearInterval(t); cb(c); }
            else if (++n > 40) clearInterval(t);
        }, 500);
    }

    /* ═══════════════════════════════════════════════════════════
     *  POLLING HTTP — Actualiza badges aunque app esté minimizada
     *  (El SW hace el push; el polling actualiza los badges
     *   cuando el usuario vuelve a abrir la app)
     * ═══════════════════════════════════════════════════════════ */
    function iniciarPolling() {
        verificarTodo();
        setInterval(verificarTodo, 8000);
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) verificarTodo();
        });
    }

    function verificarTodo() {
        verificarAnalistas();
        verificarClientes();
    }

    function verificarAnalistas() {
        var ced = sessionStorage.getItem('merchandiser_cedula');
        if (!ced) return;
        fetch('/api/merchandiser-unread-count/' + ced)
            .then(function (r) { return r.json(); })
            .then(function (d) {
                var n = parseInt(d.unread_count || 0, 10);
                actualizarBtnAnalistas(n);
                if (prevAnalistas >= 0 && n > prevAnalistas && !modalAnalAbierto) {
                    var diff = n - prevAnalistas;
                    sonar('analista');
                    pulsarBoton('btnChatAnalistas', 'success');
                    // Notificación directa (app en primer plano)
                    notificarDirecto(
                        '💬 Nuevo mensaje — Analistas',
                        diff + ' mensaje' + (diff > 1 ? 's' : '') + ' nuevo' + (diff > 1 ? 's' : ''),
                        'analistas'
                    );
                }
                prevAnalistas = n;
            })
            .catch(function () {});
    }

    function verificarClientes() {
        var ced = sessionStorage.getItem('merchandiser_cedula');
        if (!ced) return;
        fetch('/api/merchandiser-unread-count-clientes/' + ced)
            .then(function (r) { return r.json(); })
            .then(function (d) {
                var n = parseInt(d.unread_count || 0, 10);
                actualizarBtnClientes(n);
                if (prevClientes >= 0 && n > prevClientes && !modalCliAbierto) {
                    var diff = n - prevClientes;
                    sonar('cliente');
                    pulsarBoton('btnChatClientes', 'warning');
                    notificarDirecto(
                        '🏢 Nuevo mensaje — Clientes',
                        diff + ' mensaje' + (diff > 1 ? 's' : '') + ' nuevo' + (diff > 1 ? 's' : ''),
                        'clientes'
                    );
                }
                prevClientes = n;
            })
            .catch(function () {});
    }

    /* ── Actualizar botones ─────────────────────────────────── */
    function actualizarBtnAnalistas(count) {
        var btn   = document.getElementById('btnChatAnalistas');
        var badge = document.getElementById('chatNotificationBadge');
        if (!btn) return;
        if (count > 0) {
            btn.className = btn.className.replace(/btn-outline-primary|btn-primary/g, '').trim();
            if (!/ btn-success/.test(' ' + btn.className)) btn.className += ' btn-success';
            btn.innerHTML = '<i class="bi bi-envelope me-1"></i>' + count + ' nuevo' + (count > 1 ? 's' : '');
            if (badge) { badge.textContent = count; badge.style.display = ''; }
        } else {
            btn.className = btn.className.replace(/\bbtn-success\b/g, '').trim();
            if (!/ btn-outline-primary/.test(' ' + btn.className)) btn.className += ' btn-outline-primary';
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
            if (!/ btn-warning/.test(' ' + btn.className)) btn.className += ' btn-warning';
            btn.innerHTML = '<i class="bi bi-chat-left-dots me-1"></i>' + count + ' nuevo' + (count > 1 ? 's' : '');
            if (badge) { badge.textContent = count; badge.style.display = ''; }
        } else {
            btn.className = btn.className.replace(/\bbtn-warning\b/g, '').trim();
            if (!/ btn-outline-warning/.test(' ' + btn.className)) btn.className += ' btn-outline-warning';
            btn.innerHTML = '<i class="bi bi-chat-left-dots-fill me-1"></i>Abrir Chats';
            if (badge) badge.style.display = 'none';
        }
    }

    /* ═══════════════════════════════════════════════════════════
     *  SOCKETS — Reacción inmediata sin esperar el polling
     * ═══════════════════════════════════════════════════════════ */
    function iniciarSockets() {
        if (typeof io === 'undefined') return;

        sockA = io('/chat', { transports: ['websocket', 'polling'], reconnection: true, reconnectionAttempts: Infinity, reconnectionDelay: 3000 });
        sockA.on('connect',   function () { salasA = {}; unirseAnalistaSalas(); });
        sockA.on('reconnect', function () { salasA = {}; unirseAnalistaSalas(); });
        sockA.on('chat_history', function () {});
        sockA.on('new_message',  function () { setTimeout(verificarAnalistas, 300); });

        sockC = io('/chat_cliente', { transports: ['websocket', 'polling'], reconnection: true, reconnectionAttempts: Infinity, reconnectionDelay: 3000 });
        sockC.on('connect',   function () { salasC = {}; unirseClienteSalas(); });
        sockC.on('reconnect', function () { salasC = {}; unirseClienteSalas(); });
        sockC.on('chat_history_cliente', function () {});
        sockC.on('new_message_cliente',  function () { setTimeout(verificarClientes, 300); });

        setInterval(function () { salasA = {}; salasC = {}; unirseAnalistaSalas(); unirseClienteSalas(); }, 5 * 60 * 1000);
    }

    function unirseAnalistaSalas() {
        if (!sockA || !sockA.connected) return;
        var ced = sessionStorage.getItem('merchandiser_cedula');
        if (!ced) return;
        fetch('/api/merchandiser-chats/' + ced)
            .then(function (r) { return r.json(); })
            .then(function (d) {
                (d.chats || []).forEach(function (c) {
                    var k = String(c.id_visita);
                    if (!salasA[k]) { sockA.emit('join_chat', { visit_id: c.id_visita }); salasA[k] = true; }
                });
            }).catch(function () {});
    }

    function unirseClienteSalas() {
        if (!sockC || !sockC.connected) return;
        var ced = sessionStorage.getItem('merchandiser_cedula');
        if (!ced) return;
        fetch('/api/merchandiser-chats-clientes/' + ced)
            .then(function (r) { return r.json(); })
            .then(function (d) {
                (d.chats || []).forEach(function (c) {
                    var k = c.id_visita + '_' + c.id_cliente;
                    if (!salasC[k]) {
                        sockC.emit('join_chat_cliente', { visit_id: c.id_visita, cliente_id: c.id_cliente, username: ced });
                        salasC[k] = true;
                    }
                });
            }).catch(function () {});
    }

    /* ═══════════════════════════════════════════════════════════
     *  SERVICE WORKER + SUSCRIPCIÓN PUSH (VAPID)
     *  ← Esta es la clave para recibir con app minimizada
     * ═══════════════════════════════════════════════════════════ */
    function registrarSWyPush() {
        if (!('serviceWorker' in navigator)) return;

        navigator.serviceWorker
            .register('/sw-mercaderista.js', { scope: '/' })
            .then(function (reg) {
                // Forzar actualización si hay versión nueva
                if (reg.waiting) reg.waiting.postMessage({ accion: 'skipWaiting' });
                reg.addEventListener('updatefound', function () {
                    var w = reg.installing;
                    if (w) w.addEventListener('statechange', function () {
                        if (w.state === 'installed' && navigator.serviceWorker.controller)
                            w.postMessage({ accion: 'skipWaiting' });
                    });
                });

                // Una vez registrado, pedir permiso y suscribir push
                return navigator.serviceWorker.ready;
            })
            .then(function (reg) {
                pedirPermisoySuscribir(reg);
            })
            .catch(function () {
                // Sin HTTPS (salvo localhost): funciona todo excepto push en background
            });

        // Mensajes del SW → abrir chat cuando usuario toca la notificación
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

    function pedirPermisoySuscribir(swReg) {
        if (!('PushManager' in window)) return;
        if (!('Notification' in window)) return;

        var pedirYSuscribir = function () {
            var req = Notification.requestPermission();
            var promesa = (req && typeof req.then === 'function')
                ? req
                : new Promise(function (res) { req ? res(req) : res('denied'); });

            promesa.then(function (perm) {
                if (perm !== 'granted') return;
                suscribirPush(swReg);
            }).catch(function () {});
        };

        if (Notification.permission === 'granted') {
            suscribirPush(swReg);
        } else if (Notification.permission === 'default') {
            // Pedir después de 6 s (no interrumpir al cargar)
            setTimeout(pedirYSuscribir, 6000);
        }
    }

    function suscribirPush(swReg) {
        // Obtener la clave pública VAPID del servidor
        fetch('/api/push-vapid-public-key')
            .then(function (r) { return r.json(); })
            .then(function (d) {
                if (!d.public_key) return;

                var applicationServerKey = urlBase64ToUint8Array(d.public_key);

                // Comprobar si ya hay una suscripción activa
                return swReg.pushManager.getSubscription()
                    .then(function (sub) {
                        if (sub) {
                            // Ya suscrito → enviar al servidor por si cambió
                            enviarSuscripcionAlServidor(sub);
                            return;
                        }
                        // Suscribirse
                        return swReg.pushManager.subscribe({
                            userVisibleOnly:      true,
                            applicationServerKey: applicationServerKey
                        }).then(function (nuevaSub) {
                            enviarSuscripcionAlServidor(nuevaSub);
                        });
                    });
            })
            .catch(function () {});
    }

    function enviarSuscripcionAlServidor(subscription) {
        var ced = sessionStorage.getItem('merchandiser_cedula');
        if (!ced) return;

        fetch('/api/push-subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cedula:       ced,
                subscription: subscription.toJSON()
            })
        }).catch(function () {});
    }

    function urlBase64ToUint8Array(base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        var raw     = window.atob(base64);
        var arr     = new Uint8Array(raw.length);
        for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
        return arr;
    }

    /* ── Notificación directa (app en primer plano) ─────────── */
    function notificarDirecto(titulo, cuerpo, tipo) {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;

        // Si el SW está activo, delegarle
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                accion: 'mostrar', titulo: titulo, cuerpo: cuerpo, tipo: tipo
            });
            return;
        }

        try {
            var n = new Notification(titulo, {
                body: cuerpo, icon: '/static/icons/favicon.ico',
                tag: 'merc-' + tipo, renotify: true, silent: false,
                vibrate: [200, 80, 200, 80, 200]
            });
            n.onclick = function () {
                window.focus(); n.close();
                if (tipo === 'analistas' && typeof abrirChatsAnalistas === 'function') abrirChatsAnalistas();
                if (tipo === 'clientes'  && typeof abrirChatsClientes  === 'function') abrirChatsClientes();
            };
            setTimeout(function () { try { n.close(); } catch (e) {} }, 9000);
        } catch (e) {}
    }

    /* ── Sonido Web Audio API ───────────────────────────────── */
    function setupAudio() {
        function crear() {
            if (!audioCtx) try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
        }
        document.addEventListener('click',      crear, { once: true });
        document.addEventListener('touchstart', crear, { once: true });
        document.addEventListener('keydown',    crear, { once: true });
    }

    function sonar(tipo) {
        if (!audioCtx) return;
        try {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            var notas = tipo === 'analista'
                ? [{ f: 880, t: 0 }, { f: 1100, t: 0.18 }]
                : [{ f: 659, t: 0 }, { f: 659, t: 0.16 }, { f: 880, t: 0.32 }];
            notas.forEach(function (n) {
                var o = audioCtx.createOscillator(), g = audioCtx.createGain();
                o.connect(g); g.connect(audioCtx.destination);
                o.type = 'sine'; o.frequency.value = n.f;
                var t = audioCtx.currentTime + n.t;
                g.gain.setValueAtTime(0, t);
                g.gain.linearRampToValueAtTime(0.35, t + 0.01);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
                o.start(t); o.stop(t + 0.25);
            });
        } catch (e) {}
    }

    /* ── Efecto glow en botones ─────────────────────────────── */
    function pulsarBoton(id, color) {
        var btn = document.getElementById(id);
        if (!btn) return;
        var cls = 'merc-glow-' + color;
        btn.classList.add(cls);
        setTimeout(function () { btn.classList.remove(cls); }, 2500);
    }

    /* ── Rastrear modales abiertos ──────────────────────────── */
    function rastrearModales() {
        document.addEventListener('shown.bs.modal', function (e) {
            if (!e.target) return;
            if (e.target.id === 'chatIndividualModal')         modalAnalAbierto = true;
            if (e.target.id === 'chatIndividualModalClientes') modalCliAbierto  = true;
        });
        document.addEventListener('hidden.bs.modal', function (e) {
            if (!e.target) return;
            if (e.target.id === 'chatIndividualModal')         { modalAnalAbierto = false; verificarAnalistas(); }
            if (e.target.id === 'chatIndividualModalClientes') { modalCliAbierto  = false; verificarClientes(); }
        });
    }

    /* ── CSS pulso ──────────────────────────────────────────── */
    var s = document.createElement('style');
    s.textContent = '@keyframes gPG{0%{box-shadow:0 0 0 0 rgba(40,167,69,.85)}70%{box-shadow:0 0 0 18px rgba(40,167,69,0)}100%{box-shadow:0 0 0 0 rgba(40,167,69,0)}}' +
        '@keyframes gPA{0%{box-shadow:0 0 0 0 rgba(255,193,7,.9)}70%{box-shadow:0 0 0 18px rgba(255,193,7,0)}100%{box-shadow:0 0 0 0 rgba(255,193,7,0)}}' +
        '.merc-glow-success{animation:gPG .7s ease-out 3}.merc-glow-warning{animation:gPA .7s ease-out 3}';
    document.head.appendChild(s);

    window.MercNotif = { verificar: verificarTodo };
})();