import { AppViewTheme } from "./AppViewTheme.js";

export function initAppEvents(view) {
  // 1. Changement de thème clair/sombre
  document.addEventListener("change", (e) => {
    if (e.target.id === "theme-checkbox") {
      AppViewTheme.toggle(e.target.checked);
    }
  });

  // 2. Écouteur global pour les clics (Délégation)
  document.addEventListener("click", (e) => {
    // --- Gestion du Menu du Bas (Bottom Menu) ---
    const bottomMenu = document.getElementById("bottom-menu-container");
    if (bottomMenu?.classList.contains("show")) {
      const clickedIcon = e.target.closest(".icon-footer");
      const isMenuIcon = clickedIcon && clickedIcon.dataset?.page === "menu";

      // Si on clique ailleurs que sur le menu blanc ou sur l'icône menu, on le ferme
      if (!e.target.closest(".bottom-menu-sheet") && !isMenuIcon) {
        view.toggleBottomMenu(false);
      }
    }

    // --- Gestion du Menu du Haut (Top Menu - Swap Account) ---
    const topMenu = document.getElementById("top-menu-container");
    if (topMenu?.classList.contains("show")) {
      // Si on clique ailleurs que sur la feuille et ailleurs que sur l'icône profil
      if (
        !e.target.closest(".top-menu-sheet") &&
        !e.target.closest(".profile-icon")
      ) {
        view.toggleTopMenu(false);
      }
    }

    // Clic sur l'icône de profil (Ouvrir le menu de Swap Account)
    const profileBtn = e.target.closest(".profile-icon");
    if (profileBtn) {
      // On demande au contrôleur les comptes disponibles
      const accounts = window.appController?.model?.getChildrenAccounts() || [];
      view.toggleTopMenu(undefined, accounts);
    }

    // --- Gestion du bouton Paramètre dans le header ---
    const paramBtn = e.target.closest(".parametre");
    if (paramBtn) {
      const rot = parseInt(paramBtn.dataset.rotation || "0", 10) + 360;
      paramBtn.dataset.rotation = rot;
      paramBtn.style.transform = `rotate(${rot}deg)`;
      window.appController?.navigateToPage("settings");
      view.syncFooter(3); // 3 = index du bouton menu/paramètres
    }

    // Validation d'une séance (utilisé sur certaines popups ou pages)
    if (e.target.closest("#btn-valider-seance")) {
      window.appController?.handleSessionValidation();
    }
  });

  // 3. Écouteurs spécifiques à la zone d'application (Le chemin de la HomePage)
  view.app.addEventListener("click", (e) => {
    // Bouton COMMENCER de la popup
    const startBtn = e.target.closest(".start-btn");
    if (startBtn && !startBtn.disabled) {
      window.appController?.handleSessionValidation();
      return;
    }

    // Clic dans la popup (ne rien faire, stopper la propagation)
    if (e.target.closest(".duo-popup")) {
      e.stopImmediatePropagation();
      return;
    }

    // Clic sur un point du chemin (Path Dot)
    const clickedElement = document.elementFromPoint(e.clientX, e.clientY);
    const pathDot = clickedElement?.closest(".path-dot");

    if (pathDot) {
      const step = pathDot.closest(".path-step");
      const popup = step.querySelector(".duo-popup");

      // Remettre tous les z-index à 1
      document
        .querySelectorAll(".path-step")
        .forEach((s) => (s.style.zIndex = "1"));

      // Fermer toutes les autres popups
      document.querySelectorAll(".duo-popup").forEach((p) => {
        if (p !== popup) p.classList.remove("show");
      });

      // Afficher la popup sélectionnée et la passer au premier plan
      popup.classList.toggle("show");
      step.style.zIndex = popup.classList.contains("show") ? "999" : "1";
    } else {
      // Si on clique n'importe où ailleurs dans l'app, on ferme les popups
      document.querySelectorAll(".duo-popup.show").forEach((p) => {
        p.classList.remove("show");
        p.closest(".path-step").style.zIndex = "1";
      });
    }
  });

  // 4. Gestion des effets de pression (Boutons du chemin)
  view.app.addEventListener("pointerdown", (e) => {
    const btn = e.target.closest(".path-button-container");
    if (btn && !e.target.closest(".duo-popup")) {
      btn.classList.add("pressed");
      try {
        btn.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
  });

  const handlePointerRelease = (e) => {
    document
      .querySelectorAll(".path-button-container.pressed")
      .forEach((btn) => {
        btn.classList.remove("pressed");
        if (e?.pointerId) {
          try {
            btn.releasePointerCapture(e.pointerId);
          } catch (err) {}
        }
      });
  };

  view.app.addEventListener("pointerup", handlePointerRelease);
  view.app.addEventListener("pointercancel", handlePointerRelease);
  view.app.addEventListener("pointerleave", handlePointerRelease);
}
