import { el } from "../../utils/DOMBuilder.js";
import { SessionModal } from "../components/SessionModal.js";

export class HomePage {
    constructor(app) {
        this.app = app;
        this.hasHighlighted = false;
        this.CONFIG = {
            frequency: 0.01,
            phaseOffset: -1.4,
            amplitude: 45,
            nbLines: 5,
            lineSpacing: 12,
        };
    }

    async render() {
        const childData = (await this.app.model.getChildData()) || {};
        const weeklyPlan = childData.formattedWeeklyPlan || {};
        const showDecorations = childData.show_decorations !== 0;
        const jsDays = [
            "Dimanche",
            "Lundi",
            "Mardi",
            "Mercredi",
            "Jeudi",
            "Vendredi",
            "Samedi",
        ];
        const currentDayName = jsDays[new Date().getDay()];
        const steps = Object.entries(weeklyPlan).map(([day, status], i) => {
            const isToday = day === currentDayName;
            const extraElements = isToday
                ? [
                      el("div", { className: "today-halo" }),
                      el("img", {
                          className: "mascot-path",
                          src: childData.mascot,
                          alt: "Mascotte",
                      }),
                  ]
                : [];

            return el(
                "div",
                {
                    className: `path-step ${status} ${!isToday && (status === "todo" || status === "todo-future") ? "is-locked" : ""}`,
                    dataset: { day: day },
                },
                el(
                    "div",
                    { className: "path-button-container" },
                    ...extraElements,
                    el("div", { className: "path-dot-shadow" }),
                    el("div", { className: "path-dot" }),
                    this.createPopup(day, status, i, isToday),
                ),
                el("span", { className: "path-label" }, day),
            );
        });

        const container = el(
            "div",
            {
                className: "home-page",
            },
            el("div", { className: "path-container" }, steps),
        );

        requestAnimationFrame(() => {
            setTimeout(() => {
                this.drawPathLine(container, showDecorations);
                this.scrollToMascot();
                container.style.opacity = "1";
            }, 50);
        });

        return container;
    }

    drawPathLine(container, showDecorations = true) {
        const pathContainer = container.querySelector(".path-container");
        if (!pathContainer) return;

        let oldWrapper = pathContainer.querySelector(".global-staff-wrapper");
        if (oldWrapper) {
            oldWrapper.classList.add("hidden-measure");
        }

        const totalHeight = pathContainer.scrollHeight;

        if (oldWrapper) {
            oldWrapper.remove();
        }

        const svgWrapper = el("div", { className: "global-staff-wrapper" });
        pathContainer.appendChild(svgWrapper);

        const centerX = pathContainer.offsetWidth / 2;

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", totalHeight);

        if (showDecorations) {
            for (let i = 0; i < this.CONFIG.nbLines; i++) {
                const xOffset = (i - 2) * this.CONFIG.lineSpacing;
                const path = document.createElementNS(svgNS, "path");

                const startY = -200;
                const endY = totalHeight + 200;

                let d = `M ${centerX + xOffset + Math.sin(startY * this.CONFIG.frequency + this.CONFIG.phaseOffset) * this.CONFIG.amplitude},${startY}`;

                for (let y = startY + 15; y <= endY; y += 15) {
                    const x =
                        centerX +
                        xOffset +
                        Math.sin(
                            y * this.CONFIG.frequency + this.CONFIG.phaseOffset,
                        ) *
                            this.CONFIG.amplitude;
                    d += ` L ${x},${y}`;
                }

                path.setAttribute("d", d);
                path.setAttribute("class", "staff-line-path");
                svg.appendChild(path);
            }
            svgWrapper.appendChild(svg);
        }

        const steps = container.querySelectorAll(".path-step");
        steps.forEach((step) => {
            const y = step.offsetTop + step.offsetHeight / 2;
            const offset =
                Math.sin(y * this.CONFIG.frequency + this.CONFIG.phaseOffset) *
                this.CONFIG.amplitude;

            step.style.setProperty("--step-offset", `${offset}px`);
            step.classList.add("dynamic-pos");
        });
    }

    createPopup(day, status, index, isToday) {
        const title = `Leçon ${index + 1}`;
        let desc = "";
        let button = null;

        if (status === "done") {
            desc = "Bravo ! Tu as validé cette séance.";
        } else if (status === "missed") {
            desc = "Séance manquée !";
            button = el(
                "button",
                { className: "start-btn disabled", disabled: true },
                "MANQUÉ",
            );
        } else if (isToday && status === "todo") {
            desc = "Valider la leçon ?";
            button = el(
                "button",
                {
                    className: "start-btn",
                    onClick: (e) => {
                        e.stopPropagation();
                        this.handleStart(day);
                    },
                },
                "VALIDER",
            );
        } else if (status === "nothing") {
            desc = "C'est un jour de repos !";
        } else {
            desc = "Patience... cette leçon n'est pas encore disponible.";
            button = el(
                "button",
                { className: "start-btn disabled", disabled: true },
                "🔒 BLOQUÉ",
            );
        }

        return el(
            "div",
            { className: "duo-popup" },
            el("div", { className: "popup-arrow" }),
            el("h3", {}, title),
            el("p", {}, desc),
            button,
        );
    }

    async handleStart(day) {
        const sessionModal = new SessionModal(
            this.app,
            day,
            async (finalSessionData) => {
                try {
                    await this.app.child.updateSession(finalSessionData);
                    document.querySelector(".modal-overlay")?.remove();

                    const successSound = new Audio(
                        "/assets/sounds/success.wav",
                    );
                    successSound
                        .play()
                        .catch((err) => console.log("Audio non lu :", err));

                    await this.app.child.loadChildData();
                    this.app.navigation.goTo("home");
                } catch (error) {
                    console.error("Erreur lors de l'enregistrement :", error);
                }
            },
        );
        document.body.appendChild(sessionModal.render());
    }

    scrollToMascot() {
        document
            .querySelector(".mascot-path")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}
