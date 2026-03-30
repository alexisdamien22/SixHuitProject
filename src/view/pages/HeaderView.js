import { createElement as el } from "../utils/DOMBuilder.js";

export const HeaderView = {
  render() {
    return el(
      "header",
      { className: "main-header" },
      el("div", { className: "profile-icon" }),
      el(
        "div",
        { className: "strik" },
        el("img", {
          className: "strik-icon",
          src: "/assets/img/icons/strik/flame_1.png",
          alt: "Série de jours",
        }),
        el("p", { className: "strik-text" }, "0"),
      ),
      el("div", { className: "swipe" }),
      el("div", { className: "parametre" }),
    );
  },
};
