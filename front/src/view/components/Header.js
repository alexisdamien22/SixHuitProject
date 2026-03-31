import { el } from "../../utils/DOMBuilder.js";

export class Header {
  constructor(app) {
    this.app = app;
  }

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
      el("div", { className: "parametre", dataset: { rotation: "0" } }),
    );
  }
}
