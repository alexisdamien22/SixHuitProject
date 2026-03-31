import { el } from "../../utils/DOMBuilder.js";

export class ParentHomePage {
  constructor(app) {
    this.app = app;
  }
  render() {
    const child = this.app.model.getChildData() || { name: "?", streak: 0 };

    return el(
      "div",
      { className: "page parent-screen-centered" },
      el("h2", { className: "parent-title" }, "Espace Parent"),
      el(
        "div",
        { className: "parent-info flex-col flex-center" },
        el("p", {}, `Enfant : ${child.name}`),
        el("p", {}, `Streak actuel : ${child.streak}`),
      ),
      el(
        "button",
        {
          className: "btn-primary btn-add-child",
          onClick: () => this.app.navigation.goTo("create-account"),
        },
        "+ Ajouter un profil enfant",
      ),
    );
  }
}
