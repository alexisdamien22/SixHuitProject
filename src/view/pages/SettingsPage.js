import { createElement as el } from "../../utils/DOMBuilder.js";

export const SettingsPage = {
  render() {
    const isLightMode = document.body.classList.contains("light-mode");

    return el(
      "div",
      {
        style: {
          paddingTop: "12dvh",
          textAlign: "center",
          color: "var(--color-text-main)",
        },
      },
      el("h1", {}, "Paramètres"),
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
    );
  },
};
