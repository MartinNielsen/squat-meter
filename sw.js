self.addEventListener('install', event => {
  // Bypass the waiting lifecycle stage.
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  // Do nothing, just pass through the request.
  event.respondWith(fetch(event.request));
});