import { el } from "../../utils/DOMBuilder.js";
import { SessionModal } from "../components/SessionModal.js";

export class HomePage {
    constructor(app) {
        this.app = app;
        this.hasHighlighted = false;
    }

    formatWeeklyPlan(rawPlan, lessonDay = "Lundi") {
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

        if (!rawPlan || !Array.isArray(rawPlan)) return fullPlan;

        rawPlan.forEach((entry) => {
            const day = dayMap[entry.day_of_week];
            if (day) {
                if (entry.status === 1) {
                    fullPlan[day] = "done";
                } else if (entry.practice === 1) {
                    fullPlan[day] = "todo";
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
        );

        const frenchDays = [
            "Dimanche",
            "Lundi",
            "Mardi",
            "Mercredi",
            "Jeudi",
            "Vendredi",
            "Samedi",
        ];
        const currentDayName = frenchDays[new Date().getDay()];

        const steps = Object.entries(weeklyPlan).map(([day, status], i) => {
            const isToday = day === currentDayName;

            const extraElements = isToday
                ? [
                      el("div", { className: "today-halo" }),
                      el("img", {
                          className: "mascot-path",
                          src: "/assets/img/mascots/camelion.png",
                          alt: "Mascotte",
                      }),
                  ]
                : [];

            const popup = this.createPopup(day, status, i, isToday);

            const pathButtonContainer = el(
                "div",
                { className: "path-button-container" },
                ...extraElements,
                el("div", { className: "path-dot-shadow" }),
                el("div", { className: "path-dot" }),
                popup,
            );

            return el(
                "div",
                {
                    className: `path-step ${status} ${!isToday && status === "todo" ? "is-locked" : ""}`,

                    dataset: { day: day },
                },
                pathButtonContainer,
                el("span", { className: "path-label" }, day),
            );
        });

        const container = el(
            "div",
            { className: "home-page" },
            el("div", { className: "path-container" }, steps),
        );

        requestAnimationFrame(() => this.scrollToMascot());

        return container;
    }

    createPopup(day, status, index, isToday) {
        const title = `Leçon ${index + 1}`;
        let desc = "";
        let button = null;

        if (status === "done") {
            desc = "Bravo ! Tu as validé cette séance.";
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

                    const modalElement =
                        document.querySelector(".modal-overlay");
                    if (modalElement) modalElement.remove();
                    await this.app.child.loadChildData();
                    this.app.navigation.goTo("home");
                } catch (error) {
                    console.error("Erreur lors de l'enregistrement :", error);
                    alert("Erreur lors de l'enregistrement de la séance.");
                }
            },
        );

        document.body.appendChild(sessionModal.render());
    }

    scrollToMascot() {
        const mascot = document.querySelector(".mascot-path");
        if (mascot) {
            mascot.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }
}
