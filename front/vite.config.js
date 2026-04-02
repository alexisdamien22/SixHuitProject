import { defineConfig } from "vite";

export default defineConfig({
    server: {
        allowedHosts: [
            "subventricular-carlee-tormentingly.ngrok-free.dev"
        ],
        host: true,
        port: 5173,
        watch: {
            usePolling: true, // Safari + ngrok = parfois besoin de polling
        },
        hmr: {
            protocol: "ws",
            host: "localhost", // évite les erreurs HMR via ngrok
        },
        headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    },
    build: {
        sourcemap: true
    }
});
