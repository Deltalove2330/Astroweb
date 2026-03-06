/**
 * sw-mercaderista.js
 * ============================================================
 * Service Worker — Notificaciones PWA Mercaderista
 * ============================================================
 * Archivo físico en: /app/static/sw-mercaderista.js
 * Servido por Flask en la URL: /sw-mercaderista.js  (scope raíz)
 *
 * Permite notificaciones cuando la PWA está en background o
 * con la pantalla del teléfono bloqueada (Android Chrome).
 * iOS: funciona si la PWA está instalada y iOS >= 16.4
 */
'use strict';

self.addEventListener('install', function (e) {
    self.skipWaiting();
});

self.addEventListener('activate', function (e) {
    e.waitUntil(clients.claim());
});

/* ── Mensajes desde la página ── */
self.addEventListener('message', function (e) {
    if (!e.data) return;

    if (e.data.accion === 'skipWaiting') {
        self.skipWaiting();
        return;
    }

    if (e.data.accion === 'mostrar') {
        var titulo = e.data.titulo || '💬 HJASSTA';
        var cuerpo = e.data.cuerpo || 'Nuevo mensaje';
        var tipo   = e.data.tipo   || 'general';

        e.waitUntil(
            self.registration.showNotification(titulo, {
                body:               cuerpo,
                icon:               '/static/icons/favicon.ico',
                badge:              '/static/icons/favicon.ico',
                tag:                'merc-' + tipo,
                renotify:           true,
                requireInteraction: false,
                silent:             false,
                vibrate:            [200, 80, 200, 80, 200],
                data:               { tipo: tipo },
                actions: [
                    { action: 'ver',     title: '📬 Ver' },
                    { action: 'ignorar', title: '✖ Ignorar' }
                ]
            })
        );
    }
});

/* ── Click en la notificación ── */
self.addEventListener('notificationclick', function (e) {
    e.notification.close();
    if (e.action === 'ignorar') return;

    var tipo = (e.notification.data && e.notification.data.tipo) || 'general';

    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(function (lista) {
                for (var i = 0; i < lista.length; i++) {
                    var c = lista[i];
                    if ('focus' in c) {
                        c.focus();
                        /* merc-notificaciones.js escucha este mensaje
                           y llama abrirChatsAnalistas() o abrirChatsClientes() */
                        c.postMessage({ tipo: tipo });
                        return;
                    }
                }
                return clients.openWindow('/dashboard-mercaderista');
            })
    );
});

/* ── Push API (preparado para FCM/VAPID futuro) ── */
self.addEventListener('push', function (e) {
    if (!e.data) return;
    var p = {};
    try { p = e.data.json(); } catch (err) { return; }
    e.waitUntil(
        self.registration.showNotification(p.titulo || '💬 HJASSTA', {
            body:    p.cuerpo || '',
            icon:    '/static/icons/favicon.ico',
            tag:     'merc-push',
            vibrate: [200, 80, 200],
            data:    { tipo: p.tipo || 'general' }
        })
    );
});