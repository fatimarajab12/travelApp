const CACHE_NAME = 'my-cache-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles/style.scss',
    '/scripts/bundle.js',
    '/offline.html' // Optional: Add an offline fallback page
];

// Install event: caching resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting()) // Force the waiting service worker to become the active service worker
    );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName); // Delete old cache
                    }
                })
            );
        })
    );
});

// Fetch event: serve cached content if available, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response or fetch from network
                return response || fetch(event.request).then((networkResponse) => {
                    // Optional: Cache the fetched response
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone()); // Cache the response for future requests
                        return networkResponse; // Return the network response
                    });
                });
            })
            .catch(() => {
                // If both cache and network fail, serve offline fallback (if available)
                return caches.match('/offline.html'); // Optional offline fallback
            })
    );
});
