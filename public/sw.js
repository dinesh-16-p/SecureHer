/**
 * SecureHer — Progressive Web App Service Worker
 * Version: 1.0.0
 * 
 * STRICT PRIVACY & SECURITY RULES:
 * - Pre-caches only public application shell and UI assets.
 * - NEVER caches authenticated API responses (/api/*).
 * - NEVER caches Firestore requests, incident reports, evidence media, or personal tokens.
 */

const CACHE_NAME = 'secureher-app-shell-v1';

// Public static assets safe for offline application shell
const APP_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png'
];

// Domains and URL patterns that must NEVER be cached
const SENSITIVE_URL_PATTERNS = [
  '/api/',                             // FastAPI backend (SOS dispatch, journey share, AI)
  'firestore.googleapis.com',          // User private documents & incident reports
  'identitytoolkit.googleapis.com',     // Firebase auth tokens
  'securetoken.googleapis.com',        // Token refresh
  'firebasestorage.googleapis.com',    // Evidence files & photos
  'api.brevo.com',                     // Emergency email API
  'overpass-api.de',                   // External dynamic OSM queries
  'google-analytics.com',
  'googletagmanager.com'
];

function isSensitiveRequest(url) {
  const urlStr = url.toString().toLowerCase();
  return SENSITIVE_URL_PATTERNS.some(pattern => urlStr.includes(pattern));
}

// 1. Install Event: Pre-cache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL_ASSETS);
    }).then(() => {
      // Don't wait for old workers; allow new version activation
      return self.skipWaiting();
    }).catch((err) => {
      console.warn('PWA Precache warning:', err);
    })
  );
});

// 2. Activate Event: Clean up stale caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 3. Fetch Event: Safe caching strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle GET requests; never touch POST/PUT/DELETE
  if (request.method !== 'GET') {
    return;
  }

  // Never cache sensitive API endpoints, Firebase tokens, or Firestore data
  if (isSensitiveRequest(url)) {
    return;
  }

  // Navigation requests (HTML pages) -> Network first, fallback to cached shell or offline.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If response is valid, update the cached app shell
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Offline fallback
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          const indexFallback = await caches.match('/index.html');
          if (indexFallback) {
            return indexFallback;
          }
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // Same-origin static assets (Vite hashed bundles, css, images, fonts)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Cache hit: fetch in background to refresh cache (Stale-While-Revalidate)
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse);
              });
            }
          }).catch(() => {
            // Ignore background fetch error when offline
          });
          return cachedResponse;
        }

        // Cache miss: fetch from network and cache
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // External static assets (e.g. Google Fonts CDN)
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Default: normal network fetch for any remaining non-sensitive requests
});

// 4. Message Event: Allow client to trigger skipWaiting on update
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
