const CACHE = 'planner-v1';
const ASSETS = [
  '/daily-planner/',
  '/daily-planner/index.html',
  '/daily-planner/manifest.json',
  '/daily-planner/icon-192.png',
  '/daily-planner/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Firebase และ Google Fonts ให้ผ่านตรง (ต้องการ network เสมอ)
  const url = e.request.url;
  if (url.includes('firestore') || url.includes('googleapis') || url.includes('gstatic') || url.includes('fonts.google')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
