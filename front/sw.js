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
    "/assets/img/mascots/camelion.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)),
    );
    self.skipWaiting();
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
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.url.includes("/api/") || event.request.method !== "GET") {
        return;
    }

    const url = new URL(event.request.url);

    if (
        url.origin === "https://fonts.gstatic.com" ||
        url.origin === "https://fonts.googleapis.com"
    ) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (
                    !response ||
                    response.status !== 200 ||
                    response.type !== "basic"
                ) {
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
