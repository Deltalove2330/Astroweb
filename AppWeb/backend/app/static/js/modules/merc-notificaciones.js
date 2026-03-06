/**
 * merc-notificaciones.js  —  v3 DEFINITIVO
 * ============================================================
 * Estrategia DUAL: HTTP polling (siempre funciona) + Sockets (bonus)
 * ============================================================
 * Coloca en: /app/static/js/modules/merc-notificaciones.js
 *
 * ✅ Badges se actualizan cada 8 segundos SIN recargar página
 * ✅ Notificaciones push al teléfono (Android + iOS PWA instalada)
 * ✅ Sonido sin archivos externos
 * ✅ NO toca ningún archivo existente
 * ✅ Funciona en HTTP y HTTPS
 */
;(function () {
    'use strict';

    /* ── Variables de estado ─────────────────────────────────── */
    var cedula            = null;
    var prevAnalistas     = -1;      // -1 = primera carga, no notificar aún
    var prevClientes      = -1;
    var audioCtx          = null;
    var sockNotifA        = null;    // socket fondo /chat
    var sockNotifC        = null;    // socket fondo /chat_cliente
    var salasA            = {};
    var salasC            = {};
    var modalAnalAbierto  = false;
    var modalCliAbierto   = false;
    var swRegistrado      = false;

    /* ── Arranque ────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {
        esperarCedula(function (ced) {
            cedula = ced;
            setupAudio();
            rastrearModales();
            registrarSW();
            pedirPermiso();
            iniciarPolling();
            iniciarSockets();
        });
    });

    /* Espera hasta que sessionStorage tenga la cédula */
    function esperarCedula(cb) {
        var intentos = 0;
        var t = setInterval(function () {
            var c = sessionStorage.getItem('merchandiser_cedula');
            intentos++;
            if (c) { clearInterval(t); cb(c); }
            else if (intentos > 40) clearInterval(t); // 20 seg máx
        }, 500);
    }

    /* ═══════════════════════════════════════════════════════════
     *  CAPA 1 — POLLING HTTP (100% confiable, sin dependencias)
     * ═══════════════════════════════════════════════════════════ */
    function iniciarPolling() {
        // Primera verificación inmediata
        verificarTodo();
        // Cada 8 segundos
        setInterval(verificarTodo, 8000);
        // Al volver a la pestaña → verificar de inmediato
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
            .then(function (data) {
                var count = parseInt(data.unread_count || 0, 10);
                actualizarBotonAnalistas(count);

                // Notificar solo si el modal NO está abierto y hay mensajes NUEVOS
                if (prevAnalistas >= 0 && count > prevAnalistas && !modalAnalAbierto) {
                    var diff = count - prevAnalistas;
                    sonar('analista');
                    pulsarBoton('btnChatAnalistas', 'success');
                    notificar(
                        '💬 Nuevo mensaje — Analistas',
                        diff + ' mensaje' + (diff > 1 ? 's' : '') + ' nuevo' + (diff > 1 ? 's' : ''),
                        'analistas'
                    );
                }
                prevAnalistas = count;
            })
            .catch(function () {});
    }

    function verificarClientes() {
        var ced = sessionStorage.getItem('merchandiser_cedula');
        if (!ced) return;

        fetch('/api/merchandiser-unread-count-clientes/' + ced)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                var count = parseInt(data.unread_count || 0, 10);
                actualizarBotonClientes(count);

                if (prevClientes >= 0 && count > prevClientes && !modalCliAbierto) {
                    var diff = count - prevClientes;
                    sonar('cliente');
                    pulsarBoton('btnChatClientes', 'warning');
                    notificar(
                        '🏢 Nuevo mensaje — Clientes',
                        diff + ' mensaje' + (diff > 1 ? 's' : '') + ' nuevo' + (diff > 1 ? 's' : ''),
                        'clientes'
                    );
                }
                prevClientes = count;
            })
            .catch(function () {});
    }

    /* ── Actualizar botones (reemplaza lo que hacía checkUnreadMessages) ── */
    function actualizarBotonAnalistas(count) {
        var btn   = document.getElementById('btnChatAnalistas');
        var badge = document.getElementById('chatNotificationBadge');
        if (!btn) return;

        if (count > 0) {
            btn.className = btn.className
                .replace(/btn-outline-primary|btn-primary/g, '')
                .trim();
            if (!btn.className.includes('btn-success')) btn.className += ' btn-success';
            btn.innerHTML = '<i class="bi bi-envelope me-1"></i>' +
                            count + ' nuevo' + (count > 1 ? 's' : '');
            if (badge) { badge.textContent = count; badge.style.display = ''; }
        } else {
            btn.className = btn.className
                .replace(/btn-success/g, '')
                .trim();
            if (!btn.className.includes('btn-outline-primary')) btn.className += ' btn-outline-primary';
            btn.innerHTML = '<i class="bi bi-envelope-open me-1"></i>Abrir Chats';
            if (badge) badge.style.display = 'none';
        }
    }

    function actualizarBotonClientes(count) {
        var btn   = document.getElementById('btnChatClientes');
        var badge = document.getElementById('chatClientesNotificationBadge');
        if (!btn) return;

        if (count > 0) {
            btn.className = btn.className
                .replace(/btn-outline-warning/g, '')
                .trim();
            if (!btn.className.includes('btn-warning')) btn.className += ' btn-warning';
            btn.innerHTML = '<i class="bi bi-chat-left-dots me-1"></i>' +
                            count + ' nuevo' + (count > 1 ? 's' : '');
            if (badge) { badge.textContent = count; badge.style.display = ''; }
        } else {
            btn.className = btn.className
                .replace(/\bbtn-warning\b/g, '')
                .trim();
            if (!btn.className.includes('btn-outline-warning')) btn.className += ' btn-outline-warning';
            btn.innerHTML = '<i class="bi bi-chat-left-dots-fill me-1"></i>Abrir Chats';
            if (badge) badge.style.display = 'none';
        }
    }

    /* ═══════════════════════════════════════════════════════════
     *  CAPA 2 — SOCKETS (respuesta inmediata cuando hay conexión)
     * ═══════════════════════════════════════════════════════════ */
    function iniciarSockets() {
        if (typeof io === 'undefined') return;  // socket.io no cargado aún

        /* ── Socket analistas ── */
        sockNotifA = io('/chat', {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 3000
        });
        sockNotifA.on('connect',    function () { unirseAnalistaSalas(); });
        sockNotifA.on('reconnect',  function () { salasA = {}; unirseAnalistaSalas(); });
        sockNotifA.on('chat_history', function () { /* silenciar historial */ });
        sockNotifA.on('new_message', function () {
            // Disparo inmediato al recibir evento (no esperar los 8s)
            setTimeout(verificarAnalistas, 200);
        });

        /* ── Socket clientes ── */
        sockNotifC = io('/chat_cliente', {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 3000
        });
        sockNotifC.on('connect',    function () { unirseClienteSalas(); });
        sockNotifC.on('reconnect',  function () { salasC = {}; unirseClienteSalas(); });
        sockNotifC.on('chat_history_cliente', function () { /* silenciar */ });
        sockNotifC.on('new_message_cliente', function () {
            setTimeout(verificarClientes, 200);
        });

        // Refrescar salas cada 5 min (visitas nuevas)
        setInterval(function () { salasA = {}; salasC = {}; unirseAnalistaSalas(); unirseClienteSalas(); }, 5 * 60 * 1000);
    }

    function unirseAnalistaSalas() {
        if (!sockNotifA || !sockNotifA.connected) return;
        var ced = sessionStorage.getItem('merchandiser_cedula');
        if (!ced) return;
        fetch('/api/merchandiser-chats/' + ced)
            .then(function (r) { return r.json(); })
            .then(function (d) {
                if (!d.success || !d.chats) return;
                d.chats.forEach(function (c) {
                    var k = String(c.id_visita);
                    if (!salasA[k]) {
                        sockNotifA.emit('join_chat', { visit_id: c.id_visita });
                        salasA[k] = true;
                    }
                });
            }).catch(function () {});
    }

    function unirseClienteSalas() {
        if (!sockNotifC || !sockNotifC.connected) return;
        var ced = sessionStorage.getItem('merchandiser_cedula');
        if (!ced) return;
        fetch('/api/merchandiser-chats-clientes/' + ced)
            .then(function (r) { return r.json(); })
            .then(function (d) {
                if (!d.success || !d.chats) return;
                d.chats.forEach(function (c) {
                    var k = c.id_visita + '_' + c.id_cliente;
                    if (!salasC[k]) {
                        sockNotifC.emit('join_chat_cliente', {
                            visit_id: c.id_visita, cliente_id: c.id_cliente,
                            username: sessionStorage.getItem('merchandiser_cedula')
                        });
                        salasC[k] = true;
                    }
                });
            }).catch(function () {});
    }

    /* ═══════════════════════════════════════════════════════════
     *  SONIDO (Web Audio API — sin archivos externos)
     * ═══════════════════════════════════════════════════════════ */
    function setupAudio() {
        /* AudioContext requiere un gesto del usuario (política navegadores).
           Lo creamos en el primer interacción para que el sonido funcione. */
        function crear(e) {
            if (audioCtx) return;
            try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
            catch (err) {}
            // Una vez creado, quitamos el listener
            document.removeEventListener('click',      crear);
            document.removeEventListener('touchstart', crear);
            document.removeEventListener('keydown',    crear);
        }
        document.addEventListener('click',      crear);
        document.addEventListener('touchstart', crear);
        document.addEventListener('keydown',    crear);
    }

    function sonar(tipo) {
        if (!audioCtx) return;
        try {
            if (audioCtx.state === 'suspended') audioCtx.resume();

            // Analista: 2 pings agudos | Cliente: 3 pings cálidos
            var notas = tipo === 'analista'
                ? [{ f: 880, t: 0 }, { f: 1100, t: 0.18 }]
                : [{ f: 659, t: 0 }, { f: 659, t: 0.16 }, { f: 880, t: 0.32 }];

            notas.forEach(function (n) {
                var osc  = audioCtx.createOscillator();
                var gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sine';
                osc.frequency.value = n.f;
                var t = audioCtx.currentTime + n.t;
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.35,  t + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
                osc.start(t);
                osc.stop(t + 0.25);
            });
        } catch (e) {}
    }

    /* ═══════════════════════════════════════════════════════════
     *  NOTIFICACIONES PUSH (navegador + PWA)
     * ═══════════════════════════════════════════════════════════ */
    function pedirPermiso() {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'granted') return;
        if (Notification.permission === 'denied')  return;

        // Pedir después de 6 s para no interrumpir al cargar
        setTimeout(function () {
            try {
                var p = Notification.requestPermission();
                if (p && p.then) {
                    p.then(function (perm) {
                        if (perm === 'granted') {
                            // Confirmación de que funciona
                            setTimeout(function () {
                                mostrarNotificacion(
                                    '✅ Notificaciones activadas',
                                    'Recibirás alertas de mensajes nuevos.',
                                    'sistema'
                                );
                            }, 500);
                        }
                    }).catch(function () {});
                }
            } catch (e) {}
        }, 6000);
    }

    function notificar(titulo, cuerpo, tipo) {
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') {
            // Intentar pedir permiso si aún no se pidió
            if (Notification.permission === 'default') pedirPermiso();
            return;
        }
        mostrarNotificacion(titulo, cuerpo, tipo);
    }

    function mostrarNotificacion(titulo, cuerpo, tipo) {
        var opts = {
            body:     cuerpo,
            icon:     '/static/icons/favicon.ico',
            badge:    '/static/icons/favicon.ico',
            tag:      'merc-' + tipo,
            renotify: true,
            silent:   false,
            vibrate:  [200, 80, 200, 80, 200],
            data:     { tipo: tipo }
        };

        // ① Vía Service Worker (funciona en background y pantalla bloqueada)
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                accion: 'mostrar', titulo: titulo, cuerpo: cuerpo, tipo: tipo
            });
            return;
        }

        // ② Fallback directo (app en primer plano sin SW activo)
        try {
            var n = new Notification(titulo, opts);
            n.onclick = function () {
                window.focus(); n.close();
                if (tipo === 'analistas' && typeof abrirChatsAnalistas === 'function') abrirChatsAnalistas();
                if (tipo === 'clientes'  && typeof abrirChatsClientes  === 'function') abrirChatsClientes();
            };
            setTimeout(function () { try { n.close(); } catch (e) {} }, 9000);
        } catch (e) {}
    }

    /* ── Service Worker ──────────────────────────────────────── */
    function registrarSW() {
        if (!('serviceWorker' in navigator) || swRegistrado) return;
        navigator.serviceWorker
            .register('/sw-mercaderista.js', { scope: '/' })
            .then(function (reg) {
                swRegistrado = true;
                // Forzar actualización si hay versión nueva
                if (reg.waiting) reg.waiting.postMessage({ accion: 'skipWaiting' });
                reg.addEventListener('updatefound', function () {
                    var w = reg.installing;
                    if (!w) return;
                    w.addEventListener('statechange', function () {
                        if (w.state === 'installed' && navigator.serviceWorker.controller) {
                            w.postMessage({ accion: 'skipWaiting' });
                        }
                    });
                });
            })
            .catch(function () {
                /* Sin HTTPS (salvo localhost): las notificaciones directas
                   siguen funcionando mientras la app esté abierta */
            });

        // Escuchar mensajes del SW (click en notificación → abrir chat)
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

    /* ── Rastrear modales abiertos ───────────────────────────── */
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

    /* ── Pulso en el botón ───────────────────────────────────── */
    function pulsarBoton(id, color) {
        var btn = document.getElementById(id);
        if (!btn) return;
        var cls = 'merc-glow-' + color;
        btn.classList.add(cls);
        setTimeout(function () { btn.classList.remove(cls); }, 2000);
    }

    /* ── CSS del pulso ───────────────────────────────────────── */
    var s = document.createElement('style');
    s.textContent = [
        '@keyframes gPG{0%{box-shadow:0 0 0 0 rgba(40,167,69,.85)}70%{box-shadow:0 0 0 18px rgba(40,167,69,0)}100%{box-shadow:0 0 0 0 rgba(40,167,69,0)}}',
        '@keyframes gPA{0%{box-shadow:0 0 0 0 rgba(255,193,7,.9)}70%{box-shadow:0 0 0 18px rgba(255,193,7,0)}100%{box-shadow:0 0 0 0 rgba(255,193,7,0)}}',
        '.merc-glow-success{animation:gPG .7s ease-out 3}',
        '.merc-glow-warning{animation:gPA .7s ease-out 3}'
    ].join('\n');
    document.head.appendChild(s);

    /* ── API pública ─────────────────────────────────────────── */
    window.MercNotif = {
        verificar: verificarTodo,
        refresh: function () {
            salasA = {}; salasC = {};
            unirseAnalistaSalas();
            unirseClienteSalas();
            verificarTodo();
        }
    };

})();