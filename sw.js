const CACHE = "workshop-cloud-v11-flat1";
const FILES = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
// شبكة أولا ثم الكاش (عشان التحديثات توصل) — مع تخزين مكتبة Firebase للتشغيل بدون نت
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (u.origin !== location.origin && u.hostname !== "www.gstatic.com") return;
  e.respondWith(fetch(e.request).then(res => {
    if (res && (res.ok || res.type === "opaque")) { const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); }
    return res;
  }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});
