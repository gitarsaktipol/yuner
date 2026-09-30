// Yuner service worker — supaya bisa jalan offline.
// Setiap kali kamu mengubah index.html, naikkan angka versi ini (v1 -> v2, dst).
const CACHE = 'fertune-v21';
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png',
  './privacy.html',
  './fonts/bricolage-grotesque-latin.woff2'
];

self.addEventListener('install', (e) => {
  // cache:'reload' = selalu ambil dari server, jangan dari cache HTTP browser (GitHub Pages
  // menyimpan file ±10 menit), supaya versi baru tidak tersimpan dengan ikon/file lama.
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin) return;

  // File sendiri dicek ulang ke server (no-cache) supaya pembaruan cepat terlihat.
  const netReq = req.mode === 'navigate' ? new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' })
                                         : new Request(req, { cache: 'no-cache' });

  // Cache dulu, lalu perbarui diam-diam di belakang layar.
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      const net = fetch(netReq).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined));
      return hit || net;
    })
  );
});
