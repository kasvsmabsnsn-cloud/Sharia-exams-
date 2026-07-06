const CACHE_NAME = 'academy-v1';
// تعديل المسارات لتتوافق مع مسار GitHub Pages الفرعي
const urlsToCache = [
  '/Sharia-exams-/',
  '/Sharia-exams-/index.html',
  '/Sharia-exams-/manifest.json'
];

// تثبيت الـ Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // إجبار الـ SW الجديد على التفعيل فوراً
  );
});

// استرجاع الملفات من الكاش
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجد الملف في الكاش يعود به، وإلا يطلبه من الشبكة
        return response || fetch(event.request);
      })
  );
});

// تحديث الـ Service Worker وحذف الكاش القديم
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // السيطرة على الصفحات المفتوحة فوراً
  );
});
