const CACHE_NAME = "six-huit";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/css/style.css",
  "/assets/css/base/variables.css",
  "/assets/css/base/reset.css",
  "/assets/css/layout/header.css",
  "/assets/css/layout/footer.css",
  "/assets/css/layout/menus.css",
  "/assets/css/components/buttons.css",
  "/assets/css/components/popups.css",
  "/assets/css/pages/home.css",
  "/assets/css/pages/profile.css",
  "/assets/css/pages/settings.css",
  "/assets/css/pages/create-account.css",
  "/assets/img/icons/home.png",
  "/assets/img/icons/podium.png",
  "/assets/img/icons/music.png",
  "/assets/img/icons/menu.png",
  "/assets/img/icons/app-icon-86.png",
  "/assets/img/mascottes/camelion.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });

        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
