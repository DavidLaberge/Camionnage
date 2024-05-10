// service-worker.js

// Installer le service worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('journal-de-bord-cache-v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/script.js'
        // Ajoutez d'autres fichiers à mettre en cache ici
      ]);
    })
  );
});

// Intercepter les requêtes réseau
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});