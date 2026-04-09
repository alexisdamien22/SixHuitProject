import { el } from "../utils/DOMBuilder.js";

export const AppViewNavigation = {
    updateSlider(index, animated = true) {
        const footer = document.querySelector(".main-footer");
        const icons = document.querySelectorAll(".icon-footer");

        if (!footer || !icons[index]) return;

        let slider = footer.querySelector(".footer-slider");
        if (!slider) {
            slider = document.createElement("div");
            slider.className = "footer-slider";
            footer.appendChild(slider);
        }

        const activeIcon = icons[index];

        requestAnimationFrame(() => {
            slider.style.transition = animated
                ? "left 0.3s cubic-bezier(0.25, 1, 0.5, 1), width 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease"
                : "none";

            slider.style.width = `${activeIcon.offsetWidth}px`;
            slider.style.left = `${activeIcon.offsetLeft}px`;

            if (activeIcon.offsetWidth > 0) {
                slider.style.opacity = "1";
                slider.style.display = "block";
            }
        });
    },

    createBottomMenu(view) {
        if (document.getElementById("bottom-menu-container")) return;

        const bottomMenu = el(
            "div",
            { id: "bottom-menu-container", className: "bottom-menu-container" },
            el("div", {
                className: "bottom-menu-overlay",
                onClick: () => view.toggleBottomMenu(false),
            }),
            el(
                "div",
                { className: "bottom-menu-sheet" },
                el(
                    "div",
                    {
                        className: "bottom-menu-item",
                        onClick: () => {
                            view.toggleBottomMenu(false, true);
                            view.syncFooter(3);
                            view.app.navigation.goTo("profil");
                        },
                    },
                    el("span", {}, "Compte"),
                ),
                el(
                    "div",
                    {
                        className: "bottom-menu-item",
                        onClick: () => {
                            view.toggleBottomMenu(false, true);
                            view.syncFooter(3);
                            view.app.navigation.goTo("metronome");
                        },
                    },
                    el("span", {}, "Métronome"),
                ),
                el(
                    "div",
                    {
                        className: "bottom-menu-item",
                        onClick: () => {
                            view.toggleBottomMenu(false, true);
                            view.syncFooter(3);
                            view.app.navigation.goTo("settings");
                        },
                    },
                    el("span", {}, "Paramètres"),
                ),
            ),
        );
        document.body.appendChild(bottomMenu);
        bottomMenu.offsetHeight;
    },
};
