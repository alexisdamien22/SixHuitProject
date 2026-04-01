import { el } from "../../utils/DOMBuilder.js";

export class HomePage {
  constructor(app) {
    this.app = app;
    this.hasHighlighted = false;
  }

  formatWeeklyPlan(rawPlan) {
    const dayMap = {
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche",
    };

    const statusMap = {
      1: "done",
      0: "todo",
    };

    const fullPlan = {
      Lundi: "nothing",
      Mardi: "nothing",
      Mercredi: "nothing",
      Jeudi: "nothing",
      Vendredi: "nothing",
      Samedi: "nothing",
      Dimanche: "nothing",
    };

    if (!rawPlan || !Array.isArray(rawPlan)) return fullPlan;

    rawPlan.forEach((entry) => {
      const day = dayMap[entry.day_of_week];
      if (day) {
        fullPlan[day] = statusMap[entry.practice];
      }
    });

    return fullPlan;
  }

  async render() {
    const childData = (await this.app.model.getChildData()) || {};
    const weeklyPlan = this.formatWeeklyPlan(childData.weeklyPlan || []);

    const pattern = [0, 45, 25, -25, -45];
    this.hasHighlighted = false;

    const steps = Object.entries(weeklyPlan).map(([day, status], i) => {
      const offset = pattern[i % pattern.length];
      const isToday = status === "todo" && !this.hasHighlighted;

      if (isToday) this.hasHighlighted = true;

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
          style: { transform: `translateX(${offset}px)`, zIndex: "1" },
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

    if (isToday) {
      desc = "Prêt pour un défi ?";
      button = el(
        "button",
        {
          className: "start-btn",
          onClick: (e) => {
            e.stopPropagation();
            this.handleStart(day);
          },
        },
        "COMMENCER",
      );
    } else if (status === "done") {
      desc = "Bravo ! Tu as validé cette séance.";
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
    await this.app.child.updateSession({
      practice_day: day,
      practice: 1,
      session_date: new Date().toISOString().slice(0, 10),
    });
    this.app.navigation.goTo("music");
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
