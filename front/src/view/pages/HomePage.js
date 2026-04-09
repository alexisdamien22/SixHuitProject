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

    formatWeeklyPlan(rawPlan, lessonDay = "Lundi", history = []) {
        const dayMap = {
            monday: "Lundi",
            tuesday: "Mardi",
            wednesday: "Mercredi",
            thursday: "Jeudi",
            friday: "Vendredi",
            saturday: "Samedi",
            sunday: "Dimanche",
        };

        const frenchDays = [
            "Lundi",
            "Mardi",
            "Mercredi",
            "Jeudi",
            "Vendredi",
            "Samedi",
            "Dimanche",
        ];
        let startIndex = frenchDays.indexOf(lessonDay);
        if (startIndex === -1) startIndex = 0;

        const orderedDays = [
            ...frenchDays.slice(startIndex),
            ...frenchDays.slice(0, startIndex),
        ];

        const fullPlan = {};
        orderedDays.forEach((day) => (fullPlan[day] = "nothing"));

        const jsDays = [
            "Dimanche",
            "Lundi",
            "Mardi",
            "Mercredi",
            "Jeudi",
            "Vendredi",
            "Samedi",
        ];
        const now = new Date();
        const currentDayName = jsDays[now.getDay()];

        let targetDayIndex = jsDays.indexOf(lessonDay);
        if (targetDayIndex === -1) targetDayIndex = 1;

        let daysAgo = now.getDay() - targetDayIndex;
        if (daysAgo < 0) daysAgo += 7;

        const startOfCycle = new Date(now);
        startOfCycle.setDate(now.getDate() - daysAgo);
        startOfCycle.setHours(0, 0, 0, 0);

        const doneDaysThisCycle = new Set();
        history.forEach((session) => {
            if (session.session_date) {
                const sessionDate = new Date(session.session_date);
                if (sessionDate >= startOfCycle && session.practice_day) {
                    doneDaysThisCycle.add(session.practice_day);
                }
            }
        });

        const todayIndexInOrdered = orderedDays.indexOf(currentDayName);
        if (!rawPlan || !Array.isArray(rawPlan)) return fullPlan;

        rawPlan.forEach((entry) => {
            const day = dayMap[entry.day_of_week];
            if (day) {
                const dayIndex = orderedDays.indexOf(day);
                const isPast = dayIndex < todayIndexInOrdered;

                if (doneDaysThisCycle.has(day) || entry.status === 1) {
                    fullPlan[day] = "done";
                } else if (entry.practice === 1) {
                    if (day === currentDayName) {
                        fullPlan[day] = "todo";
                    } else if (isPast) {
                        fullPlan[day] = "missed";
                    } else {
                        fullPlan[day] = "todo-future";
                    }
                } else {
                    fullPlan[day] = "nothing";
                }
            }
        });

        return fullPlan;
    }

    async render() {
        const childData = (await this.app.model.getChildData()) || {};
        const weeklyPlan = this.formatWeeklyPlan(
            childData.weeklyPlan || [],
            childData.lesson_day,
            childData.history || childData.sessions || [],
        );

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
            { className: "home-page" },
            el("div", { className: "path-container" }, steps),
        );

        requestAnimationFrame(() => {
            setTimeout(() => {
                this.drawPathLine(container);
                this.scrollToMascot();
            }, 50);
        });
        requestAnimationFrame(() => {
            setTimeout(() => {
                this.drawPathLine(container);
                this.scrollToMascot();
            }, 50);
        });

        return container;
    }

    drawPathLine(container) {
        const pathContainer = container.querySelector(".path-container");
        if (!pathContainer) return;

        // Met à jour la ligne automatiquement si l'écran est redimensionné
        if (!container._hasPathObserver) {
            const observer = new ResizeObserver(() => {
                requestAnimationFrame(() => this.drawPathLine(container));
            });
            observer.observe(pathContainer);
            container._hasPathObserver = true;

            // Met à jour la ligne quand la mascotte a fini de charger et change la taille
            const images = pathContainer.querySelectorAll("img");
            images.forEach((img) => {
                if (!img.complete) {
                    img.addEventListener("load", () =>
                        this.drawPathLine(container),
                    );
                }
            });
        }

        // Nettoie l'ancienne ligne globale (si présente)
        const oldGlobal = pathContainer.querySelector(".path-line-wrapper");
        if (oldGlobal) oldGlobal.remove();

        const steps = Array.from(pathContainer.querySelectorAll(".path-step"));
        if (steps.length < 2) return;

        // 1. Pré-calculer les centres de chaque point pour de meilleures performances
        const centers = steps.map((step) => {
            const dot = step.querySelector(".path-button-container");
            if (!dot) return null;
            const rect = dot.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                dot: dot,
            };
        });

        // 2. Dessiner une courbe fluide (Catmull-Rom vers Bézier cubique)
        for (let i = 0; i < centers.length - 1; i++) {
            const current = centers[i];
            const next = centers[i + 1];
            if (!current || !next) continue;

            const existing = current.dot.querySelector(".step-path-svg");
            if (existing) existing.remove();

            const prev = centers[i - 1] || current;
            const nextNext = centers[i + 2] || next;

            // Calcul des tangentes pour que la courbe traverse les points naturellement
            let tx1 = next.x - prev.x;
            let ty1 = next.y - prev.y;
            if (i === 0) {
                tx1 = next.x - current.x;
                ty1 = next.y - current.y;
            }

            let tx2 = nextNext.x - current.x;
            let ty2 = nextNext.y - current.y;
            if (i === centers.length - 2) {
                tx2 = next.x - current.x;
                ty2 = next.y - current.y;
            }

            const tension = 0.25; // Ajuste la rondeur de la courbe (0.2 à 0.3 = idéal)

            const dx = next.x - current.x;
            const dy = next.y - current.y;

            const cp1x = tx1 * tension;
            const cp1y = ty1 * tension;

            const cp2x = dx - tx2 * tension;
            const cp2y = dy - ty2 * tension;

            const pathD = `M 0 0 C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${dx} ${dy}`;

            const svgWrapper = document.createElement("div");
            svgWrapper.className = "step-path-svg";
            svgWrapper.style.cssText =
                "position: absolute; top: 50%; left: 50%; width: 0; height: 0; overflow: visible; z-index: -1; pointer-events: none;";

            svgWrapper.innerHTML = `
                <svg style="overflow: visible; position: absolute; top: 0; left: 0; width: 1px; height: 1px;">
                    <path d="${pathD}" stroke="var(--color-border-soft)" stroke-width="100" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="${pathD}" stroke="var(--color-bg-main)" stroke-width="92" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            `;

            current.dot.insertBefore(svgWrapper, current.dot.firstChild);
        }
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
