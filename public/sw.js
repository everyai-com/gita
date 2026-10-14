// Offline support: stale-while-revalidate for the Gita data and brand assets, network-first for the app shell.
const CACHE = "gita-v3";
const PRECACHE = ["/", "/data/gita.json", "/data/lessons.json", "/brand/mark.svg", "/brand/krishna.webp", "/manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

// Only keep good same-origin (or CORS) responses, so one failed request is never served forever.
function fetchAndCache(req) {
  return fetch(req).then((res) => {
    if (res.ok && (res.type === "basic" || res.type === "cors")) {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
    }
    return res;
  });
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const stable = url.pathname.startsWith("/data/") || url.pathname.startsWith("/brand/") || url.pathname.startsWith("/icons/") || url.hostname.includes("fonts.");
  if (stable) {
    // Serve the cached copy instantly, and refresh it in the background for next time.
    e.respondWith(
      caches.match(req).then((hit) => {
        const fresh = fetchAndCache(req);
        if (hit) {
          e.waitUntil(fresh.catch(() => {}));
          return hit;
        }
        return fresh;
      }),
    );
  } else if (url.origin === location.origin) {
    e.respondWith(fetchAndCache(req).catch(() => caches.match(req).then((hit) => hit || caches.match("/"))));
  }
});
