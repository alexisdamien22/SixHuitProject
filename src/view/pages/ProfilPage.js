import { createElement as el } from "../../utils/DOMBuilder.js";
import { AppFireChange } from "../AppFireChange.js";

export const ProfilPage = {
  render(data) {
    const mascot = data?.mascotte || "👤";
    const name = data?.name || "Profil";
    const rawInstrument = data?.instrument || "";
    const instrument = rawInstrument
      ? rawInstrument.charAt(0).toUpperCase() + rawInstrument.slice(1)
      : "-";

    const currentStreak = parseInt(
      data?.streakData?.current_streak || localStorage.getItem("streak") || "0",
      10,
    );

    return el(
      "div",
      { className: "profile-page" },
      el(
        "div",
        {
          className: "profil-img",
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "4rem",
          },
        },
        mascot,
      ),
      el("p", { className: "profil-name" }, name),

      el(
        "div",
        { className: "stats-row" },
        el(
          "div",
          { className: "card" },
          el("h3", {}, "Série actuelle"),
          el(
            "div",
            {
              className: "strik",
              style: { marginTop: "10px", justifyContent: "center" },
            },
            el("img", {
              className: "strik-icon",
              src: AppFireChange.FireTextur(currentStreak),
              alt: "flame",
            }),
            el("span", { className: "strik-text" }, String(currentStreak)),
          ),
        ),
        el(
          "div",
          { className: "card" },
          el("h3", {}, "Instrument"),
          el(
            "p",
            { style: { fontSize: "1.2rem", marginTop: "10px" } },
            instrument,
          ),
        ),
      ),

      el(
        "div",
        { className: "history-section" },
        el("h3", {}, "Historique des séances"),
      ),
    );
  },
};
