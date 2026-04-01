import { el } from "../utils/DOMBuilder.js";
import { playSound } from "../utils/audio.js";

export const AppViewNavigation = {
  // --- SLIDER DU FOOTER ---
  updateSlider(index, animated = true) {
    const footer = document.querySelector(".main-footer");
    const icons = document.querySelectorAll(".icon-footer");

    if (!footer || icons.length === 0 || !icons[index]) return;

    let slider = footer.querySelector(".footer-slider");
    if (!slider) {
      slider = document.createElement("div");
      slider.className = "footer-slider";
      footer.appendChild(slider);
    }

    const icon = icons[index];

    requestAnimationFrame(() => {
      slider.style.transition = animated
        ? "left 0.3s cubic-bezier(0.25, 1, 0.5, 1), width 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease"
        : "none";
      slider.style.width = `${icon.offsetWidth}px`;
      slider.style.left = `${icon.offsetLeft}px`;

      if (icon.offsetWidth > 0) {
        slider.style.opacity = "1";
        slider.style.display = "block";
      }
    });
  },

  // --- MENU DU BAS (Paramètres / Compte) ---
  createBottomMenu(view) {
    if (document.getElementById("bottom-menu-container")) return;

    const bottomMenu = el(
      "div",
      { id: "bottom-menu-container", className: "bottom-menu-container" },
      el("div", {
        className: "bottom-menu-overlay",
        onClick: () => view.toggleBottomMenu(false),
      }),
      el(
        "div",
        { className: "bottom-menu-sheet" },
        el(
          "div",
          {
            className: "bottom-menu-item",
            onClick: () => {
              view.toggleBottomMenu(false, true);
              view.syncFooter(3);
              view.app.navigation.goTo("profil");
            },
          },
          el("span", {}, "Compte"),
        ),

        el(
          "div",
          {
            className: "bottom-menu-item",
            onClick: () => {
              playSound('assets/audio/settings.mp3'); // Dernier ajout
              view.toggleBottomMenu(false, true);
              view.syncFooter(3);
              view.app.navigation.goTo("settings");
            },
          },
          el("span", {}, "Paramètres"),
        ),
      ),
    );
    document.body.appendChild(bottomMenu);
  },

  // --- MENU DU HAUT (Changement de compte enfant) ---
  createTopMenu(view, childAccounts = []) {
    let menuContainer = document.getElementById("top-menu-container");
    let sheet;

    if (!menuContainer) {
      menuContainer = el(
        "div",
        { id: "top-menu-container", className: "top-menu-container" },
        el("div", {
          className: "top-menu-overlay",
          onClick: () => view.toggleTopMenu(false),
        }),
      );
      sheet = el("div", { className: "top-menu-sheet" });
      menuContainer.appendChild(sheet);
      document.body.insertBefore(menuContainer, document.body.firstChild);
    } else {
      sheet = menuContainer.querySelector(".top-menu-sheet");
      sheet.textContent = "";
    }

    const items = childAccounts.map((account) => {
      return el(
        "div",
        {
          className: "swap-account-item",
          dataset: { id: String(account.id) },
          onClick: () => {
            view.toggleTopMenu(false);
          },
        },
        el(
          "div",
          { className: "swap-info" },
          el("div", { className: "swap-avatar" }),
          el("span", { className: "swap-pseudo" }, account.name),
        ),
        el("div", { className: "swap-icon-btn" }, "⇄"),
      );
    });

    items.forEach((item) => sheet.appendChild(item));
  },
};
