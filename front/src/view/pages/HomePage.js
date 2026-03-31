import { el } from "../../utils/DOMBuilder.js";

export class HomePage {
    constructor(app) {
        this.app = app;

        // État interne
        this.stepsContainer = null;
        this.popup = null;
        this.popupTitle = null;
        this.popupDesc = null;
        this.startBtn = null;
        this.hasHighlighted = false;
    }

    // -----------------------------
    // 1. Mapping BDD → Front
    // -----------------------------
    formatWeeklyPlan(rawPlan) {
        const DAY_MAP = {
            monday: "Lundi",
            tuesday: "Mardi",
            wednesday: "Mercredi",
            thursday: "Jeudi",
            friday: "Vendredi"
        };

        const STATUS_MAP = {
            1: "done",
            0: "todo"
        };

        // Plan complet par défaut
        const fullPlan = {
            Lundi: "nothing",
            Mardi: "nothing",
            Mercredi: "nothing",
            Jeudi: "nothing",
            Vendredi: "nothing"
        };

        // Remplissage avec les données SQL
        rawPlan.forEach(entry => {
            const day = DAY_MAP[entry.day_of_week];
            const status = STATUS_MAP[entry.practice];
            fullPlan[day] = status;
        });

        return fullPlan;
    }

    // -----------------------------
    // 2. Popup
    // -----------------------------
    showPopup(day) {
        this.popupTitle.textContent = day;
        this.popupDesc.textContent = "Prêt pour un défi ?";
        this.popup.classList.add("show");

        this.startBtn.onclick = async () => {
            await this.app.child.updateSession({
                practice_day: day,
                practice: 1,
                session_date: new Date().toISOString().slice(0, 10)
            });

            this.popup.classList.remove("show");
            this.app.navigation.goTo("music");
        };
    }

    // -----------------------------
    // 3. Rendu principal
    // -----------------------------
    async render() {
        const childData = await this.app.child.getChildData();
        const weeklyPlan = this.formatWeeklyPlan(childData.weeklyPlan);

        this.hasHighlighted = false;

        return el(
            "div",
            { className: "home-page" },

            // -----------------------------
            // Steps container
            // -----------------------------
            (this.stepsContainer = el(
                "div",
                { className: "steps-container" },

                Object.entries(weeklyPlan).map(([day, status]) => {
                    const step = el(
                        "div",
                        {
                            className: `step ${status}`,
                            dataset: { day }
                        },
                        el("span", { className: "step-label" }, day)
                    );

                    // Mascotte + halo sur le premier "todo"
                    if (status === "todo" && !this.hasHighlighted) {
                        this.hasHighlighted = true;

                        step.appendChild(
                            el("div", { className: "halo" })
                        );

                        step.appendChild(
                            el("img", {
                                className: "mascotte",
                                src: "/assets/img/mascottes/camelion.png"
                            })
                        );

                        step.addEventListener("click", () => this.showPopup(day));
                    }

                    return step;
                })
            )),

            // -----------------------------
            // Popup
            // -----------------------------
            (this.popup = el(
                "div",
                { className: "duo-popup" },

                el("div", { className: "popup-arrow" }),

                (this.popupTitle = el("h3", {}, "")),
                (this.popupDesc = el("p", {}, "")),

                (this.startBtn = el(
                    "button",
                    { className: "start-btn" },
                    "COMMENCER"
                ))
            ))
        );
    }

    // -----------------------------
    // 4. Hook d’affichage
    // -----------------------------
    onShow() {
        if (this.popup) this.popup.classList.remove("show");
    }
}