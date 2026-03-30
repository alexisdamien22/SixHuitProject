// --- MusicPage.js ---
import { createElement as el } from "../../utils/DOMBuilder.js";

export const MusicPage = {
  render() {
    return el(
      "div",
      {
        style: {
          paddingTop: "12dvh",
          textAlign: "center",
          color: "var(--color-text-main)",
        },
      },
      el("h1", {}, "Musique"),
      el("p", {}, "Contenu de la page musique..."),
    );
  },
};
