/* LEVEL service worker: aggiornamento automatico e pulizia delle vecchie cache. */
const LEVEL_SW_VERSION = 'level-sw-2026-10-10-v1';
self.addEventListener('install', (event) => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('level-') && key !== LEVEL_SW_VERSION).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
/* Non memorizza index.html in cache: evita di servire una versione obsoleta. */
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request, {cache:'no-store'}).catch(async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      return new Response('LEVEL non è disponibile offline. Riconnettiti e riapri l’app.', {status: 503, headers:{'Content-Type':'text/plain; charset=utf-8'}});
    }));
  }
});
