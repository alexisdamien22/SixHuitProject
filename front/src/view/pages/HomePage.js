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

        let svgWrapper = pathContainer.querySelector(".global-staff-wrapper");
        if (svgWrapper) {
            svgWrapper.classList.add("hidden-measure");
        }

        const totalHeight = pathContainer.scrollHeight;

        if (!svgWrapper) {
            svgWrapper = document.createElement("div");
            svgWrapper.className = "global-staff-wrapper";
            pathContainer.appendChild(svgWrapper);
        }
        svgWrapper.classList.remove("hidden-measure");
        svgWrapper.innerHTML = "";

        const centerX = pathContainer.offsetWidth / 2;

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", totalHeight);

        for (let i = 0; i < this.CONFIG.nbLines; i++) {
            const xOffset = (i - 2) * this.CONFIG.lineSpacing;
            const path = document.createElementNS(svgNS, "path");

            let d = `M ${centerX + xOffset + Math.sin(0 * this.CONFIG.frequency + this.CONFIG.phaseOffset) * this.CONFIG.amplitude},0`;

            for (let y = 10; y <= totalHeight; y += 15) {
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
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "var(--color-staff-line)");
            path.setAttribute("stroke-width", "2");
            path.setAttribute("stroke-linecap", "round");
            svg.appendChild(path);
        }
        svgWrapper.appendChild(svg);

        const steps = container.querySelectorAll(".path-step");
        steps.forEach((step) => {
            const y = step.offsetTop + step.offsetHeight / 2;
            const offset =
                Math.sin(y * this.CONFIG.frequency + this.CONFIG.phaseOffset) *
                this.CONFIG.amplitude;

            step.style.transform = `translateX(${offset}px)`;
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
