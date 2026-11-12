const CACHE = 'stocks-v1794495247';
const SHELL = ['./', './index.html', './manifest.json', './heebo.ttf', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (u.pathname.endsWith('data.json') || e.request.mode === 'navigate') {
    // network first: always try fresh data, fall back to the last copy when offline
    e.respondWith(fetch(e.request, {cache: 'no-cache'}).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(u.pathname.endsWith('data.json') ? './data.json' : e.request, c)); return r; })
      .catch(() => caches.match(u.pathname.endsWith('data.json') ? './data.json' : e.request, {ignoreSearch: true}).then(r => r || caches.match('./index.html'))));
  } else {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});
