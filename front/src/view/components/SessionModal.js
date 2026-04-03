import { el } from "../../utils/DOMBuilder.js";

export class SessionModal {
  constructor(app, day, onComplete) {
    this.app = app;
    this.day = day;
    this.onComplete = onComplete;
    this.happiness = null;
    this.quality = 0;
  }

  render() {
    const emojis = ["😢", "😐", "🙂", "🤩"];

    const emojiButtons = emojis.map((emoji, index) =>
      el(
        "button",
        {
          className: "emoji-btn",
          onClick: (e) => {
            this.happiness = index;
            document
              .querySelectorAll(".emoji-btn")
              .forEach((b) => b.classList.remove("selected"));
            e.target.classList.add("selected");
          },
        },
        emoji,
      ),
    );

    return el(
      "div",
      { className: "modal-overlay" },
      el(
        "div",
        { className: "session-modal" },
        el("h2", { className: "ca-title" }, "Séance terminée !"),
        el("p", {}, "As-tu aimé ta séance ?"),
        el("div", { className: "emoji-group" }, emojiButtons),

        el("p", {}, "Le temps a-t-il été respecté ?"),
        el(
          "select",
          {
            className: "quality-select",
            onChange: (e) => (this.quality = parseInt(e.target.value)),
          },
          el("option", { value: "0" }, "Non (0)"),
          el("option", { value: "1" }, "Oui (1)"),
          el("option", { value: "2" }, "Dépassé (2)"),
        ),

        el(
          "button",
          {
            className: "ca-btn-next",
            onClick: () => {
              if (this.happiness === null) return alert("Choisis un emoji !");
              this.onComplete({
                happiness: this.happiness,
                quality: this.quality,
                session_date: new Date().toISOString().slice(0, 10),
                practice_day: this.day,
              });
            },
          },
          "FINIR LA SÉANCE",
        ),
      ),
    );
  }
}
