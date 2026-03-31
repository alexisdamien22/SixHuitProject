import { el } from "../../utils/DOMBuilder.js";

export class PodiumPage {
  constructor(app) {
    this.app = app;
  }
  render() {
    return el(
      "div",
      { className: "page page-centered" },
      el("h2", {}, "Communauté"),
      el("p", {}, "Page de communication et d'entraide."),
    );
  }
}
