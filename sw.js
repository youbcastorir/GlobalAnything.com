// sw.js — GlobalAnything Service Worker
// Provides offline support and caching for PWA

const CACHE_NAME = 'globalanything-v1';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/keyboards.js',
  '/transliteration.js',
  '/languages.js',
  '/translations.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Serif+Arabic:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap'
];

// Install: cache all core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_URLS).catch(err => {
        console.warn('SW: Some assets failed to cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for assets, network-first for HTML
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin API requests
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // HTML: network first, fallback to cache
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // Everything else: cache first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return res;
      });
    })
  );
});

// Background sync for analytics (future use)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-usage') {
    // Future: sync offline usage analytics
  }
});
