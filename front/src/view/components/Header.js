import { el } from "../../utils/DOMBuilder.js";
import { AppFireChange } from "../AppFireChange.js";

export class Header {
  constructor(app) {
    this.app = app;
  }

  update(data) {
    const streakText = document.querySelector(".strik-text");
    const streakIcon = document.querySelector(".strik-icon");

    if (streakText && data.streak !== undefined) {
      streakText.textContent = data.streak;
    }

    if (streakIcon && data.streak !== undefined) {
      streakIcon.src = AppFireChange.FireTextur(data.streak);
    }
  }

  render() {
    const childData = this.app.model.getChildData() || {};
    const streak = childData.streak || 0;

    return el(
      "header",
      { className: "main-header" },
      el(
        "div",
        { className: "header-left-group" },
        el(
          "button",
          {
            className: "profile-icon header-profile-btn",
            onClick: () => this.app.view.toggleAccountSwitcher(true),
          },
          el("img", {
            src: "/assets/img/icons/family.png",
            alt: "Profile",
            className: "header-profile-img",
          }),
        ),
        el(
          "div",
          { className: "strik" },
          el("img", {
            className: "strik-icon",
            src: AppFireChange.FireTextur(streak),
            alt: "Streak",
          }),
          el("p", { className: "strik-text" }, String(streak)),
        ),
      ),
      el("div", { className: "parametre", dataset: { rotation: "0" } }),
    );
  }
}
