import { AppViewTheme } from "./AppViewTheme.js";

export function initAppEvents(view) {
  document.addEventListener("change", (e) => {
    if (e.target.id === "theme-checkbox") AppViewTheme.toggle(e.target.checked);
  });

  document.addEventListener("click", (e) => {
    const headerProfile = e.target.closest(
      ".profile-icon, .header-profile-btn",
    );
    if (headerProfile) {
      view.toggleAccountSwitcher();
      return;
    }

    const switcher = document.getElementById("account-switcher-container");
    if (switcher?.classList.contains("show")) {
      if (!e.target.closest(".account-switcher-sheet") && !headerProfile) {
        view.toggleAccountSwitcher(false);
      }
    }
    const bottomMenu = document.getElementById("bottom-menu-container");
    if (bottomMenu?.classList.contains("show")) {
      const clickedIcon = e.target.closest(".icon-footer");
      const isMenuIcon = clickedIcon && clickedIcon.dataset?.page === "menu";
      if (!e.target.closest(".bottom-menu-sheet") && !isMenuIcon)
        view.toggleBottomMenu(false);
    }

    const topMenu = document.getElementById("top-menu-container");
    if (topMenu?.classList.contains("show")) {
      if (
        !e.target.closest(".top-menu-sheet") &&
        !e.target.closest(".profile-icon")
      )
        view.toggleTopMenu(false);
    }

    const paramBtn = e.target.closest(".parametre");
    if (paramBtn) {
      const rot = parseInt(paramBtn.dataset.rotation || "0", 10) + 360;
      paramBtn.dataset.rotation = rot;
      paramBtn.style.transform = `rotate(${rot}deg)`;
      view.app.navigation.goTo("settings");
      view.syncFooter(3);
    }

    const footerIcon = e.target.closest(".icon-footer");
    if (footerIcon) {
      const page = footerIcon.dataset.page;
      const icons = Array.from(document.querySelectorAll(".icon-footer"));
      const index = icons.indexOf(footerIcon);

      if (page === "menu") {
        view.toggleBottomMenu();
      } else {
        view.toggleBottomMenu(false, true);
        view.syncFooter(index);
        view.app.navigation.goTo(page);
      }
    }
  });

  view.appRoot.addEventListener("click", (e) => {
    if (e.target.closest(".duo-popup")) {
      e.stopImmediatePropagation();
      return;
    }

    const clickedElement = document.elementFromPoint(e.clientX, e.clientY);
    const pathDot = clickedElement?.closest(".path-dot");

    if (pathDot) {
      const step = pathDot.closest(".path-step");
      const popup = step.querySelector(".duo-popup");

      document
        .querySelectorAll(".path-step")
        .forEach((s) => (s.style.zIndex = "1"));
      document.querySelectorAll(".duo-popup").forEach((p) => {
        if (p !== popup) p.classList.remove("show");
      });

      popup.classList.toggle("show");
      step.style.zIndex = popup.classList.contains("show") ? "999" : "1";
    } else {
      document.querySelectorAll(".duo-popup.show").forEach((p) => {
        p.classList.remove("show");
        p.closest(".path-step").style.zIndex = "1";
      });
    }
  });

  view.appRoot.addEventListener("pointerdown", (e) => {
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

  view.appRoot.addEventListener("pointerup", handlePointerRelease);
  view.appRoot.addEventListener("pointercancel", handlePointerRelease);
  view.appRoot.addEventListener("pointerleave", handlePointerRelease);
}
