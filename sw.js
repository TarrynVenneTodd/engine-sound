// Offline cache for Tesla Engine Sound. The page itself comes from the network when there is signal
// (so updates show on the first load) and from the cache when the network is slow or gone.
const CACHE = 'engine-sound-v2';
const CORE = ['./', './index.html'];
const offline = () => new Response('Offline, and this page has not been cached yet. Open it once with a connection.',
  { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

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
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  const page = req.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname);
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = page ? (await cache.match('./index.html')) || (await cache.match(req, { ignoreSearch: true }))
      : await cache.match(req, { ignoreSearch: true });
    const network = fetch(req).then((res) => {
      if (res && res.ok) cache.put(page ? './index.html' : req, res.clone());
      return res;
    });
    if (page) {
      const slow = new Promise((r) => setTimeout(() => r(null), 2500));
      const res = await Promise.race([network.catch(() => null), slow]);
      if (res) return res;
    }
    if (cached) { e.waitUntil(network.catch(() => {})); return cached; }
    try { return await network; } catch (err) { return offline(); }
  })());
});
