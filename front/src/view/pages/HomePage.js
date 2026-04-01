import { el } from "../../utils/DOMBuilder.js";

export class HomePage {
  constructor(app) {
    this.app = app;

    this.stepsContainer = null;
    this.popup = null;
    this.popupTitle = null;
    this.popupDesc = null;
    this.startBtn = null;
    this.hasHighlighted = false;
  }

  formatWeeklyPlan(rawPlan) {
    const DAY_MAP = {
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
    };

    const STATUS_MAP = {
      1: "done",
      0: "todo",
    };

    const fullPlan = {
      Lundi: "nothing",
      Mardi: "nothing",
      Mercredi: "nothing",
      Jeudi: "nothing",
      Vendredi: "nothing",
    };

    if (!rawPlan || !Array.isArray(rawPlan)) return fullPlan;

    rawPlan.forEach((entry) => {
      const day = DAY_MAP[entry.day_of_week];
      const status = STATUS_MAP[entry.practice];
      fullPlan[day] = status;
    });

    return fullPlan;
  }

  showPopup(day) {
    this.popupTitle.textContent = day;
    this.popupDesc.textContent = "Prêt pour un défi ?";
    this.popup.classList.add("show");

    this.startBtn.onclick = async () => {
      await this.app.child.updateSession({
        practice_day: day,
        practice: 1,
        session_date: new Date().toISOString().slice(0, 10),
      });

      this.popup.classList.remove("show");
      this.app.navigation.goTo("music");
    };
  }

  async render() {
    const childData = (await this.app.model.getChildData()) || {};
    console.log("[HomePage] childData reçu du modèle :", childData);

    const weeklyPlan = this.formatWeeklyPlan(childData.weeklyPlan || []);

    this.hasHighlighted = false;

    return el(
      "div",
      { className: "home-page" },

      (this.stepsContainer = el(
        "div",
        { className: "steps-container" },

        Object.entries(weeklyPlan).map(([day, status]) => {
          const step = el(
            "div",
            {
              className: `step ${status}`,
              dataset: { day },
            },
            el("span", { className: "step-label" }, day),
          );

          if (status === "todo" && !this.hasHighlighted) {
            this.hasHighlighted = true;

            step.appendChild(el("div", { className: "halo" }));

            step.appendChild(
              el("img", {
                className: "mascot",
                src: "/assets/img/mascots/camelion.png",
              }),
            );

            step.addEventListener("click", () => this.showPopup(day));
          }

          return step;
        }),
      )),
      (this.popup = el(
        "div",
        { className: "duo-popup" },

        el("div", { className: "popup-arrow" }),

        (this.popupTitle = el("h3", {}, "")),
        (this.popupDesc = el("p", {}, "")),
        (this.startBtn = el("button", { className: "start-btn" }, "COMMENCER")),
      )),
    );
  }

  onShow() {
    if (this.popup) this.popup.classList.remove("show");
  }
}
