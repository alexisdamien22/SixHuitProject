export const AppViewTheme = {
  init() {
    const isLight =
      localStorage.getItem("theme") === "light" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: light)").matches);

    document.body.classList.toggle("light-mode", isLight);
  },

  toggle(isLight) {
    document.body.classList.toggle("light-mode", isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
  },
};
