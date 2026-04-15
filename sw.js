const CACHE_NAME = "nana-player-v2";

const urlsToCache = [
  "/youtube-player/",
  "/youtube-player/index.html"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", event => {

  // YouTubeはキャッシュしない（非常に重要）
  if (
    event.request.url.includes("youtube.com") ||
    event.request.url.includes("ytimg.com")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request).catch(() => {
        return caches.match("/youtube-player/index.html");
      });
    })
  );
});