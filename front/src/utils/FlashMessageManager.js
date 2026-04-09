import { el } from "./DOMBuilder.js";

export const FlashMessageManager = {
    show(message, type = "success", persistent = false) {
        const container = this._getOrCreateContainer();

        const closeBtn = el(
            "button",
            {
                className: "flash-close",
            },
            "×",
        );

        const messageEl = el(
            "div",
            {
                className: `flash-message flash-${type} ${persistent ? "flash-persistent" : "flash-temporary"}`,
            },
            el("span", { className: "flash-text" }, message),
            closeBtn,
        );

        closeBtn.onclick = (e) => {
            e.stopPropagation();
            this._remove(messageEl);
        };

        container.appendChild(messageEl);

        if (!persistent) {
            setTimeout(() => {
                this._remove(messageEl);
            }, 3000);
        }
    },

    _remove(element) {
        if (
            !element ||
            element.classList.contains("flash-hiding") ||
            !element.parentNode
        )
            return;

        element.classList.add("flash-hiding");

        const handleTransitionEnd = () => {
            if (element.parentNode) {
                element.remove();
            }
            element.removeEventListener("transitionend", handleTransitionEnd);
        };

        element.addEventListener("transitionend", handleTransitionEnd);

        setTimeout(() => {
            if (element.parentNode) element.remove();
        }, 400);
    },

    _getOrCreateContainer() {
        let container = document.getElementById("flash-container");
        if (!container) {
            container = el("div", { id: "flash-container" });
            document.body.appendChild(container);
        }
        return container;
    },
};
