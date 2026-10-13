const SHELL_CACHE = 'nammanudi-shell-v2';
const API_CACHE = 'nammanudi-api-v2';

const PRECACHE_SHELL_URLS = ['/', '/index.html'];
const DEFAULT_SCENARIOS = [
  'transport',
  'shopping',
  'healthcare',
  'workplace',
  'restaurant',
];

function isCachedApiPath(urlObj) {
  const path = urlObj.pathname;
  if (path === '/api/scenarios') return true;
  return /^\/api\/scenarios\/[^/]+\/(phrases|roleplay|quiz)$/.test(path);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE_SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL_CACHE && k !== API_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (data && data.type === 'WARM_OFFLINE_CACHE' && data.apiBaseUrl) {
    const base = data.apiBaseUrl.replace(/\/$/, '');
    const shellUrls = Array.isArray(data.shellUrls) ? data.shellUrls : [];

    event.waitUntil(
      (async () => {
        const apiCache = await caches.open(API_CACHE);
        const slugs = new Set(DEFAULT_SCENARIOS);

        // 1. Warm GET /api/scenarios and discover any dynamic scenario slugs
        const scenariosUrl = `${base}/api/scenarios`;
        try {
          const res = await fetch(scenariosUrl, {
            headers: { Accept: 'application/json' },
          });
          if (res && res.ok) {
            await apiCache.put(scenariosUrl, res.clone());
            const list = await res.json();
            if (Array.isArray(list)) {
              for (const item of list) {
                if (item && item.slug) slugs.add(item.slug);
              }
            }
          }
        } catch {
          // Ignore network errors while warming
        }

        // 2. Warm phrases, roleplay, and quiz for all 5 scenarios
        const endpoints = [];
        for (const slug of slugs) {
          const encoded = encodeURIComponent(slug);
          endpoints.push(`${base}/api/scenarios/${encoded}/phrases`);
          endpoints.push(`${base}/api/scenarios/${encoded}/roleplay`);
          endpoints.push(`${base}/api/scenarios/${encoded}/quiz`);
        }

        await Promise.all(
          endpoints.map(async (url) => {
            try {
              const res = await fetch(url, {
                headers: { Accept: 'application/json' },
              });
              if (res && res.ok) {
                await apiCache.put(url, res.clone());
              }
            } catch {
              // Ignore network errors while warming
            }
          })
        );

        // 3. Warm app shell static assets
        const shellCache = await caches.open(SHELL_CACHE);
        await Promise.all(
          shellUrls.map(async (url) => {
            try {
              const res = await fetch(url);
              if (res && res.ok) {
                await shellCache.put(url, res.clone());
              }
            } catch {
              // Ignore network errors while warming
            }
          })
        );

        const clients = await self.clients.matchAll();
        for (const client of clients) {
          client.postMessage({ type: 'OFFLINE_CACHE_WARMED' });
        }
      })()
    );
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. Cached API endpoints: GET /api/scenarios and GET /api/scenarios/{slug}/{phrases|roleplay|quiz}
  if (isCachedApiPath(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(API_CACHE);
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.ok) {
            await cache.put(request.url, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          const cachedResponse = await cache.match(request.url);
          if (cachedResponse) {
            return cachedResponse;
          }
          throw err;
        }
      })()
    );
    return;
  }

  // 2. Live search (/api/phrases) and other /api/* requests remain strictly network-only
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // 3. App Shell & Static Assets (same-origin + Google Fonts)
  const isSameOrigin = url.origin === self.location.origin;
  const isGoogleFonts =
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  if (isSameOrigin || isGoogleFonts) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(SHELL_CACHE);
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.ok) {
            await cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          const cached = await cache.match(request);
          if (cached) return cached;

          if (request.mode === 'navigate') {
            const indexCached =
              (await cache.match('/index.html')) || (await cache.match('/'));
            if (indexCached) return indexCached;
          }
          throw err;
        }
      })()
    );
  }
});
