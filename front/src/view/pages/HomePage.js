import { el } from "../../utils/DOMBuilder.js";

export class HomePage {
  constructor(app) {
    this.app = app;
  }

  render() {
    const childData = this.app.model.getChildData();

    if (!childData || !childData.weeklyPlan) {
      return el("div", { className: "home-screen" });
    }

    const pathSteps = childData.weeklyPlan.map((session, index) =>
      this.renderStep(session, index),
    );

    const root = el(
      "div",
      { className: "home-screen" },
      el("div", { className: "path-container" }, pathSteps),
    );

    // Déclencher le scroll une fois inséré dans le DOM
    setTimeout(() => this.mount(), 0);
    return root;
  }

  renderStep(session, index) {
    const pattern = [0, 45, 25, -25, -45];
    const offset = pattern[index % pattern.length];

    const lockedClass = session.isLocked ? "is-locked" : "";

    // Le style en ligne ici est justifié car c'est une position géométrique dynamique
    return el(
      "div",
      {
        className: `path-step ${session.status} ${lockedClass}`,
        style: { transform: `translateX(${offset}px)`, zIndex: "1" },
      },
      el(
        "div",
        { className: "path-button-container" },
        this.renderExtra(session),
        el("div", { className: "path-dot-shadow" }),
        el("div", { className: "path-dot" }),
        this.renderPopup(session, index),
      ),
      el("span", { className: "path-label" }, session.day),
    );
  }

  renderExtra(session) {
    if (!session.isToday) return null;
    return [
      el("div", { className: "today-halo" }),
      el("img", {
        src: "/assets/img/mascottes/camelion.png",
        className: "mascotte-path",
        alt: "Mascotte",
      }),
    ];
  }

  renderPopup(session, index) {
    let content = [];
    content.push(el("h3", {}, `Leçon ${index + 1}`));

    if (session.isToday) {
      content.push(el("p", {}, "Prêt pour un défi ?"));
      content.push(
        el(
          "button",
          {
            className: "start-btn",
            dataset: { session: index },
            onClick: () => {
              this.app.child.updateSession("Lundi", "done");
              this.app.navigation.goTo("music");
            },
          },
          "COMMENCER",
        ),
      );
    } else if (session.status === "done") {
      content.push(el("p", {}, "Bravo ! Tu as validé cette séance."));
    } else {
      content.push(
        el("p", {}, "Patience... cette leçon n'est pas encore disponible."),
      );
      content.push(
        el(
          "button",
          { className: "start-btn disabled", disabled: true },
          "🔒 BLOQUÉ",
        ),
      );
    }

    return el(
      "div",
      { className: "duo-popup" },
      el("div", { className: "popup-arrow" }),
      content,
    );
  }

  mount() {
    const mascot = document.querySelector(".mascotte-path");
    if (mascot) {
      mascot.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  update(childData) {
    // Sera géré par le contrôleur qui rappellera render()
  }
}
