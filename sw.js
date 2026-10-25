// Offline cache for Tesla Engine Sound. Serves the cached page right away and refreshes the cache in
// the background, so the page opens with no signal and picks up updates on the next visit.
const CACHE = 'engine-sound-v1';
const CORE = ['./', './index.html'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const nav = req.mode === 'navigate';
    const hit = (await cache.match(req, { ignoreSearch: true })) || (nav ? await cache.match('./index.html') : undefined);
    const fresh = fetch(req).then((res) => {
      if (res && res.ok) cache.put(nav ? './index.html' : req, res.clone());
      return res;
    });
    if (hit) { e.waitUntil(fresh.catch(() => {})); return hit; }
    try { return await fresh; }
    catch (err) {
      return new Response('Offline, and this page has not been cached yet. Open it once with a connection.',
        { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
  })());
});
