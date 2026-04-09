const CACHE_NAME = "six-huit-v1";

const ASSETS_TO_CACHE = [
    "/",
    "/index.html",
    "/manifest.json",
    "/assets/css/style.css",
    "/assets/img/icons/home.png",
    "/assets/img/icons/friends.png",
    "/assets/img/icons/music.png",
    "/assets/img/icons/menu.png",
    "/assets/img/icons/app-icon-86.png",
    "/assets/img/icons/family.png",
    "/assets/img/icons/parametre.png",
    "/assets/img/mascots/camelion.png",
    "/assets/img/mascots/cameleon.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[SW] Pre-caching static assets");
            return cache.addAll(ASSETS_TO_CACHE);
        }),
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log("[SW] Deleting old cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                }),
            );
        }),
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    if (url.pathname.startsWith("/api/")) {
        return;
    }

    if (
        event.request.mode === "navigate" ||
        event.request.destination === "script"
    ) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const copy = response.clone();
                    caches
                        .open(CACHE_NAME)
                        .then((cache) => cache.put(event.request, copy));
                    return response;
                })
                .catch(() => caches.match(event.request)),
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return (
                response ||
                fetch(event.request).then((networkResponse) => {
                    if (networkResponse.status === 200) {
                        const copy = networkResponse.clone();
                        caches
                            .open(CACHE_NAME)
                            .then((cache) => cache.put(event.request, copy));
                    }
                    return networkResponse;
                })
            );
        }),
    );
});
