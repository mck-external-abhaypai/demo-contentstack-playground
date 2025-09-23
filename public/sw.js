// Empty service worker that unregisters itself
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // Clear all caches
  caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
  });

  // Unregister this service worker
  self.registration.unregister();
});