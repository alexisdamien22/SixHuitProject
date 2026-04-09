import { el } from "../../utils/DOMBuilder.js";
import { SessionModal } from "../components/SessionModal.js";

export class HomePage {
    constructor(app) {
        this.app = app;
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

        if (rawPlan && Array.isArray(rawPlan)) {
            rawPlan.forEach((entry) => {
                const day = dayMap[entry.day_of_week];
                if (day) {
                    const dayIndex = orderedDays.indexOf(day);
                    const isPast = dayIndex < todayIndexInOrdered;

                    if (doneDaysThisCycle.has(day) || entry.status === 1) {
                        fullPlan[day] = "done";
                    } else if (entry.practice === 1) {
                        if (day === currentDayName) fullPlan[day] = "todo";
                        else if (isPast) fullPlan[day] = "missed";
                        else fullPlan[day] = "todo-future";
                    }
                }
            });
        }
        return fullPlan;
    }

    async render() {
        const childData = (await this.app.model.getChildData()) || {};
        const weeklyPlan = this.formatWeeklyPlan(
            childData.weeklyPlan || [],
            childData.lesson_day,
            childData.sessions || [],
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
                          src: "/assets/img/mascots/camelion.png",
                          alt: "Mascotte",
                      }),
                  ]
                : [];

            return el(
                "div",
                { className: `path-step ${status}` },
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
            { className: "page home-page" },
            el("div", { className: "path-container" }, steps),
        );

        requestAnimationFrame(() => this.scrollToMascot());
        return container;
    }

    createPopup(day, status, index, isToday) {
        let desc = "";
        let button = null;

        if (status === "done") desc = "Bravo ! Séance validée.";
        else if (status === "missed") desc = "Séance manquée !";
        else if (isToday && status === "todo") {
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
        } else if (status === "nothing") desc = "Repos aujourd'hui !";
        else desc = "Patience... bientôt disponible.";

        return el(
            "div",
            { className: "duo-popup" },
            el("div", { className: "popup-arrow" }),
            el("h3", {}, `Leçon ${index + 1}`),
            el("p", {}, desc),
            button,
        );
    }

    async handleStart(day) {
        const modal = new SessionModal(this.app, day, async (data) => {
            await this.app.child.updateSession(data);
            document.querySelector(".modal-overlay")?.remove();
            this.app.navigation.goTo("home");
        });
        document.body.appendChild(modal.render());
    }

    scrollToMascot() {
        document
            .querySelector(".mascot-path")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}
