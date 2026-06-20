const CACHE_NAME = 'astroweb-v1';
const urlsToCache = [
  '/',
  '/login',
  '/supervisor',
  '/routes',
  '/client_photos',
  '/reporteria',
  // Agrega todas las rutas importantes de tu aplicación
  '/static/css/styles.css',
  '/static/css/client-photos.css',
  '/static/css/carga-mercaderista.css',
  '/static/js/main.js',
  '/static/js/modules/client.js',
  '/static/js/modules/auth.js',
  '/static/js/modules/sidebar.js',
  '/static/js/modules/theme.js',
  '/static/js/modules/utils.js',
  '/static/js/modules/realizar-ruta-mercaderista.js',
  '/static/js/modules/dashboard-mercaderista.js',
  '/static/js/modules/carga-mercaderista.js',
  '/static/js/modules/carga-fotos-mercaderista.js',
  '/static/js/modules/login-mercaderista.js',
  '/static/js/modules/logout-mercaderista.js',
  // Agrega todos los recursos estáticos importantes
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
  'https://code.jquery.com/jquery-3.6.0.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});