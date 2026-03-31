// --- MusicPage.js ---
import { el } from "../../utils/DOMBuilder.js";

export class MusicPage {
  constructor(app) {
    this.app = app;
  }
  render() {
    return el(
      "div",
      { className: "page page-centered" },
      el("h2", {}, "Musique"),
      el("p", {}, "Ici tu pourras jouer, écouter et apprendre."),
      el(
        "button",
        {
          className: "start-btn mt-24",
          onClick: () => this.app.navigation.goTo("home"),
        },
        "Retour",
      ),
    );
  }
}
