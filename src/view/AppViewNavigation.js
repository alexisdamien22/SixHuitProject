import { createElement as el } from "../utils/DOMBuilder.js";

export const AppViewNavigation = {
  // --- 1. SLIDER DU FOOTER (Logique inchangée, 100% DOM native) ---
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

  // --- 2. MENU DU BAS (Refonte Sécurisée) ---
  createBottomMenu(view) {
    if (document.getElementById("bottom-menu-container")) return;

    const bottomMenu = el(
      "div",
      { id: "bottom-menu-container", className: "bottom-menu-container" },
      // L'overlay sombre avec son événement de fermeture
      el("div", {
        className: "bottom-menu-overlay",
        onClick: () => view.toggleBottomMenu(false),
      }),
      // La feuille de menu blanche
      el(
        "div",
        { className: "bottom-menu-sheet" },

        // Bouton Compte
        el(
          "div",
          {
            className: "bottom-menu-item",
            id: "btn-compte",
            onClick: () => {
              view.toggleBottomMenu(false, true);
              view.syncFooter(3);
              window.appController?.navigateToPage("profil");
            },
          },
          el("span", {}, "Compte"),
        ),

        // Bouton Paramètres
        el(
          "div",
          {
            className: "bottom-menu-item",
            id: "btn-parametre-menu",
            onClick: () => {
              view.toggleBottomMenu(false, true);
              view.syncFooter(3);
              window.appController?.navigateToPage("settings");
            },
          },
          el("span", {}, "Paramètres"),
        ),
      ),
    );

    // Insertion sécurisée
    document.body.appendChild(bottomMenu);
  },

  // --- 3. MENU DU HAUT / SWAP ACCOUNT (Réintégré proprement) ---
  createTopMenu(view, childAccounts = []) {
    let menuContainer = document.getElementById("top-menu-container");
    let sheet;

    // Squelette du menu
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
      // Si le menu existe déjà, on le vide de manière sécurisée
      sheet = menuContainer.querySelector(".top-menu-sheet");
      sheet.textContent = "";
    }

    // Création dynamique et sécurisée des enfants
    const items = childAccounts.map((account) => {
      return el(
        "div",
        {
          className: "swap-account-item",
          dataset: { id: String(account.id) },
          onClick: () => {
            console.log("Swap sécurisé vers le compte enfant ID :", account.id);
            view.toggleTopMenu(false);
            // Logique future : window.appController.switchChild(account.id);
          },
        },
        el(
          "div",
          { className: "swap-info" },
          el("div", { className: "swap-avatar" }),
          el("span", { className: "swap-pseudo" }, account.name), // 🔒 Sécurité absolue
        ),
        el("div", { className: "swap-icon-btn" }, "⇄"),
      );
    });

    // Insertion groupée
    items.forEach((item) => sheet.appendChild(item));
  },
};
