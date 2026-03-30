export const SettingsPage = {
  getHTML: () => {
    const isLightMode = document.body.classList.contains("light-mode");

    return `
      <div style="padding-top: 12dvh; text-align: center; color: var(--color-text-main);">
        <h1>Paramètres</h1>
        <p>Gérez vos options ici.</p>
        <div class="theme-switch-wrapper">
          <span>Sombre</span>
          <label class="theme-switch" for="theme-checkbox">
            <input type="checkbox" id="theme-checkbox" ${isLightMode ? "checked" : ""}>
            <div class="slider"></div>
          </label>
          <span>Clair</span>
        </div>
      </div>
    `;
  },
};
