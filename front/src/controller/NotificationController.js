import { ApiClient } from "../model/ApiClient.js";
import { PUBLIC_VAPID_KEY } from "../config/api.js";
import { FlashMessageManager } from "../utils/FlashMessageManager.js";

export class NotificationController {
    static async subscribeUser(childId) {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            console.warn("Notifications non supportées sur ce navigateur.");
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;

            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                const permission = await Notification.requestPermission();
                if (permission !== "granted") {
                    console.log("Permission de notification refusée.");
                    return;
                }

                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey:
                        this.urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
                });
            }

            await ApiClient.post(
                `/social/${childId}/subscribe-push`,
                subscription,
            );
            console.log("Notifications activées avec succès !");
        } catch (error) {
            console.error(
                "Erreur lors de l'activation des notifications:",
                error,
            );
        }
    }

    static urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, "+")
            .replace(/_/g, "/");
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}
