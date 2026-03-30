import { createElement as el } from "../../utils/DOMBuilder.js";

export const HomePage = {
  render(childData) {
    if (!childData || !childData.sessions) {
      return el("div", { className: "home-screen" });
    }

    const pattern = [0, 45, 25, -25, -45];

    const pathSteps = childData.sessions.map((session, i) => {
      const offset = pattern[i % pattern.length];
      const isToday = session.isToday;
      const isDone = session.status === "done";

      const lockedClass = !isToday && !isDone ? "is-locked" : "";

      const popup = this.buildPopup(session, i + 1, isToday, isDone);

      return el(
        "div",
        {
          className: `path-step ${session.status} ${lockedClass}`,
          style: { transform: `translateX(${offset}px)`, zIndex: "1" },
        },
        el(
          "div",
          { className: "path-button-container" },
          isToday ? el("div", { className: "today-halo" }) : null,
          isToday
            ? el("img", {
                className: "mascotte-path",
                src: "/assets/img/mascottes/camelion.png",
                alt: "Mascotte",
              })
            : null,
          el("div", { className: "path-dot-shadow" }),
          el("div", { className: "path-dot" }),
          popup,
        ),
        el("span", { className: "path-label" }, session.day),
      );
    });

    return el(
      "div",
      { className: "home-screen" },
      el("div", { className: "path-container" }, pathSteps),
    );
  },
  buildPopup(session, lessonNumber, isToday, isDone) {
    let content = [];
    content.push(el("h3", {}, `Leçon ${lessonNumber}`));

    if (isToday) {
      content.push(el("p", {}, "Prêt pour un défi ?"));
      content.push(el("button", { className: "start-btn" }, "COMMENCER"));
    } else if (isDone) {
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
  },

  afterRender() {
    const currentElement = document.querySelector(".mascotte-path");
    if (currentElement) {
      currentElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  },
};
