/**
 * sw-mercaderista.js  —  v4
 * Coloca en: /app/static/sw-mercaderista.js
 * Servido por Flask en: /sw-mercaderista.js  (scope raíz — CRÍTICO)
 */
'use strict';

self.addEventListener('install',  function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(clients.claim()); });

/* ── Mensaje desde la página (app en primer plano) ── */
self.addEventListener('message', function (e) {
    if (!e.data) return;
    if (e.data.accion === 'skipWaiting') { self.skipWaiting(); return; }
    if (e.data.accion === 'mostrar') {
        e.waitUntil(_mostrar(e.data.titulo, e.data.cuerpo, e.data.tipo));
    }
});

/* ── Push del servidor (app minimizada / pantalla bloqueada) ── */
self.addEventListener('push', function (e) {
    if (!e.data) return;
    var p = {};
    try { p = e.data.json(); } catch (_) { return; }
    e.waitUntil(_mostrar(p.titulo || '💬 HJASSTA', p.cuerpo || 'Nuevo mensaje', p.tipo || 'general'));
});

function _mostrar(titulo, cuerpo, tipo) {
    return self.registration.showNotification(titulo, {
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
    });
}

/* ── Click en la notificación ── */
self.addEventListener('notificationclick', function (e) {
    e.notification.close();
    if (e.action === 'ignorar') return;

    var tipo = (e.notification.data && e.notification.data.tipo) || 'general';

    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(function (lista) {
                for (var i = 0; i < lista.length; i++) {
                    if ('focus' in lista[i]) {
                        lista[i].focus();
                        lista[i].postMessage({ tipo: tipo });
                        return;
                    }
                }
                return clients.openWindow('/dashboard-mercaderista');
            })
    );
});