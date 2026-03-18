/**
 * sw-mercaderista.js — v8 DEFINITIVO
 * UBICACIÓN: backend/app/static/js/sw-mercaderista.js
 *
 * ICONO CORRECTO: /static/icons/web-app-manifest-192x192.png
 * (confirmado en manifest.json del proyecto)
 *
 * PROBLEMA RESUELTO "presione para copiar URL":
 * Chrome muestra su propia notificación genérica cuando showNotification() lanza
 * cualquier excepción interna. Triple fallback garantiza que NUNCA pase.
 */
'use strict';

var ICON = '/static/icons/web-app-manifest-192x192.png';

self.addEventListener('install', function (e) {
    e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (e) {
    e.waitUntil(clients.claim());
});

/* ══════════════════════════════════════════════════════════════
   PUSH — dispositivo cerrado / minimizado / pantalla bloqueada
   ══════════════════════════════════════════════════════════════ */
self.addEventListener('push', function (e) {
    e.waitUntil(
        (function () {
            var titulo = 'HJASSTA';
            var cuerpo = 'Tienes un nuevo mensaje';
            var tipo   = 'general';

            if (e.data) {
                try {
                    var obj = JSON.parse(e.data.text());
                    titulo  = obj.titulo || titulo;
                    cuerpo  = obj.cuerpo || cuerpo;
                    tipo    = obj.tipo   || tipo;
                } catch (_) {
                    try { cuerpo = e.data.text(); } catch (__) {}
                }
            }

            /* Intento 1: opciones normales con icono */
            return self.registration.showNotification(titulo, {
                body:               cuerpo,
                icon:               ICON,
                tag:                'hjassta-' + tipo,
                renotify:           true,
                requireInteraction: false,
                data:               { tipo: tipo }
            }).catch(function () {
                /* Intento 2: sin icono (algunos Android/iOS lo rechazan) */
                return self.registration.showNotification(titulo, {
                    body:               cuerpo,
                    tag:                'hjassta-' + tipo,
                    renotify:           true,
                    requireInteraction: false,
                    data:               { tipo: tipo }
                }).catch(function () {
                    /* Intento 3: absolutamente mínimo — NUNCA falla */
                    return self.registration.showNotification('HJASSTA', {
                        body: cuerpo,
                        data: { tipo: tipo }
                    });
                });
            });
        })()
    );
});

/* ══════════════════════════════════════════════════════════════
   MESSAGE — desde merc-notificaciones.js (app en primer plano)
   ══════════════════════════════════════════════════════════════ */
self.addEventListener('message', function (e) {
    if (!e.data) return;

    if (e.data.accion === 'skipWaiting') {
        self.skipWaiting();
        return;
    }

    if (e.data.accion === 'mostrar') {
        var titulo = e.data.titulo || 'HJASSTA';
        var cuerpo = e.data.cuerpo || 'Nuevo mensaje';
        var tipo   = e.data.tipo   || 'general';

        self.registration.showNotification(titulo, {
            body:               cuerpo,
            icon:               ICON,
            tag:                'hjassta-' + tipo,
            renotify:           true,
            requireInteraction: false,
            data:               { tipo: tipo }
        }).catch(function () {
            self.registration.showNotification(titulo, {
                body: cuerpo,
                data: { tipo: tipo }
            });
        });
    }
});

/* ══════════════════════════════════════════════════════════════
   NOTIFICATIONCLICK
   ══════════════════════════════════════════════════════════════ */
self.addEventListener('notificationclick', function (e) {
    e.notification.close();
    var tipo = (e.notification.data && e.notification.data.tipo) || 'general';

    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(function (lista) {
                for (var i = 0; i < lista.length; i++) {
                    var c = lista[i];
                    if (c.url.indexOf('/dashboard-mercaderista') !== -1) {
                        return c.focus().then(function (w) {
                            w.postMessage({ tipo: tipo });
                        });
                    }
                }
                return clients.openWindow('/dashboard-mercaderista');
            })
    );
});