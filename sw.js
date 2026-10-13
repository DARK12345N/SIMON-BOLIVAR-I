const CACHE_NAME = 'simon-bolivar-site-v1';
const APP_SHELL = [
  './index.html',
  './comunidad.html',
  './recursos.html',
  './contactos.html',
  './areas-colegio.html',
  './area-ciencia-tecnologia-produccion.html',
  './area-comunidad-sociedad.html',
  './area-cosmos-pensamiento.html',
  './area-vida-tierra-territorio.html',
  './estudiantes.html',
  './plantel-docente.html',
  './quienes-somos.html',
  './login.html',
  './styles.css',
  './responsive.css',
  './Imagenes/3dgifmaker75460.gif',
  './Imagenes/PORTADA.png',
  '../instalar/manifest.json',
  '../instalar/icon-192.png',
  '../instalar/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(APP_SHELL.map(path => new URL(path, self.registration.scope)))
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(cacheName => cacheName.startsWith('simon-bolivar-site-') && cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const requestUrl = new URL(request.url);

  if (
    request.method !== 'GET' ||
    requestUrl.origin !== self.location.origin ||
    !requestUrl.href.startsWith(self.registration.scope)
  ) {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const isNavigation = request.mode === 'navigate';

    if (!isNavigation) {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) return cachedResponse;
    }

    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) return cachedResponse;

      if (isNavigation) {
        const offlinePage = await cache.match(new URL('./index.html', self.registration.scope));
        if (offlinePage) return offlinePage;
      }

      throw error;
    }
  })());
});
