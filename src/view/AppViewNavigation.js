export const AppViewNavigation = {
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

  createBottomMenu(view) {
    if (document.getElementById("bottom-menu-container")) return;

    const menuHTML = `
      <div id="bottom-menu-container" class="bottom-menu-container">
        <div class="bottom-menu-overlay"></div>
        <div class="bottom-menu-sheet">
          <div class="bottom-menu-item" id="btn-compte"><span>Compte</span></div>
          <div class="bottom-menu-item" id="btn-parametre-menu"><span>Paramètres</span></div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML("beforeend", menuHTML);

    const container = document.getElementById("bottom-menu-container");

    container
      .querySelector(".bottom-menu-overlay")
      .addEventListener("click", () => {
        view.toggleBottomMenu(false);
      });

    container
      .querySelector("#btn-parametre-menu")
      .addEventListener("click", () => {
        view.toggleBottomMenu(false, true);
        view.syncFooter(3);
        window.appController?.navigateToPage("settings");
      });

    container.querySelector("#btn-compte").addEventListener("click", () => {
      view.toggleBottomMenu(false, true);
      view.syncFooter(3);
      window.appController?.navigateToPage("profil");
    });
  },
};
