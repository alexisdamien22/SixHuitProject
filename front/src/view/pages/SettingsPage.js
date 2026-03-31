import { el } from "../../utils/DOMBuilder.js";

export class SettingsPage {
  constructor(app) {
    this.app = app;
  }

  render() {
    const isLightMode = document.body.classList.contains("light-mode");

    return el(
      "div",
      { className: "page page-centered" },
      el("h2", {}, "Paramètres"),
      el("p", {}, "Gérez vos options ici."),
      el(
        "div",
        { className: "theme-switch-wrapper" },
        el("span", {}, "Sombre"),
        el(
          "label",
          { className: "theme-switch", htmlFor: "theme-checkbox" },
          el("input", {
            type: "checkbox",
            id: "theme-checkbox",
            checked: isLightMode,
          }),
          el("div", { className: "slider" }),
        ),
        el("span", {}, "Clair"),
      ),
      el(
        "button",
        {
          className: "btn-primary mt-40",
          style: { maxWidth: "250px" },
          onClick: () => this.app.auth.logout(),
        },
        "Se déconnecter",
      ),
    );
  }
}
