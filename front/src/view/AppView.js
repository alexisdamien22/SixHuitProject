import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";

import { HomePage } from "./pages/HomePage.js";
import { CreateAccountPage } from "./pages/CreateAccountPage.js";
import { ProfilPage } from "./pages/ProfilPage.js";
import { SettingsPage } from "./pages/SettingsPage.js";
import { MusicPage } from "./pages/MusicPage.js";
import { PodiumPage } from "./pages/PodiumPage.js";
import { ParentHomePage } from "./pages/ParentHomePage.js";

import { AppViewTheme } from "./AppViewTheme.js";
import { AppViewNavigation } from "./AppViewNavigation.js";
import { initAppEvents } from "./AppViewEvents.js";

export class AppView {
  constructor() {
    // Les conteneurs principaux de ton index.html
    this.appRoot = document.getElementById("app");
    this.headerRoot = document.getElementById("header-placeholder");
    this.footerRoot = document.getElementById("footer-placeholder");

    this.currentPage = null;
  }

  init(app) {
    this.app = app;

    // Instanciation des composants fixes
    this.header = new Header(app);
    this.footer = new Footer(app);

    // Injection 100% DOM sécurisée
    this.headerRoot.replaceChildren(this.header.render());
    this.footerRoot.replaceChildren(this.footer.render());

    // Initialisation du thème (clair/sombre) et des événements globaux
    AppViewTheme.init();
    initAppEvents(this);

    // Initialise l'animation du slider du footer
    requestAnimationFrame(() => this.syncFooter(0));
  }

  // --- ROUTEUR PRINCIPAL ---
  renderPage(name, params = {}) {
    // 1. Vider la zone de contenu proprement
    this.appRoot.replaceChildren();

    // 2. Affichage conditionnel (On cache la navigation sur l'onboarding et l'espace parent)
    const hideNav = name === "create-account" || name === "parent-home";
    this.headerRoot.style.display = hideNav ? "none" : "";
    this.footerRoot.style.display = hideNav ? "none" : "";

    // 3. Instanciation de la page demandée
    let page;
    switch (name) {
      case "home":
        page = new HomePage(this.app);
        break;
      case "create-account":
        page = new CreateAccountPage(this.app);
        break;
      case "profil":
        page = new ProfilPage(this.app);
        break;
      case "settings":
        page = new SettingsPage(this.app);
        break;
      case "music":
        page = new MusicPage(this.app);
        break;
      case "podium":
        page = new PodiumPage(this.app);
        break;
      case "parent-home":
        page = new ParentHomePage(this.app);
        break;
      default:
        page = this.createErrorPage(name);
    }

    this.currentPage = page;

    // 4. Injection sécurisée du DOM généré par le composant
    this.appRoot.appendChild(page.render());
  }

  // --- MISE À JOUR DES DONNÉES ---
  updateChildData(data) {
    this.header.update(data);

    // Si la page actuellement affichée a une méthode update(), on l'appelle
    if (this.currentPage && typeof this.currentPage.update === "function") {
      this.currentPage.update(data);
    }
  }

  // --- GESTION DES MENUS & NAVIGATION ---
  syncFooter(index) {
    const icons = document.querySelectorAll(".icon-footer");
    icons.forEach((i) => i.classList.remove("active"));
    if (icons[index]) {
      icons[index].classList.add("active");
      AppViewNavigation.updateSlider(index, true);
    }
  }

  toggleBottomMenu(force, skipReset = false) {
    AppViewNavigation.createBottomMenu(this);
    const container = document.getElementById("bottom-menu-container");
    if (!container) return;

    const show =
      force !== undefined ? force : !container.classList.contains("show");
    container.classList.toggle("show", show);

    // Si on ferme le menu sans aller vers les paramètres ou le profil, on remet le curseur au bon endroit
    if (!show && !skipReset) {
      const hash = window.location.hash.substring(1) || "home";
      const pages = ["home", "podium", "music", "menu"];
      let idx = pages.indexOf(
        hash === "settings" || hash === "profil" ? "menu" : hash,
      );
      if (idx === -1) idx = 0;
      this.syncFooter(idx);
    }
  }

  toggleTopMenu(force, accounts = []) {
    AppViewNavigation.createTopMenu(this, accounts);
    const container = document.getElementById("top-menu-container");
    if (!container) return;

    const show =
      force !== undefined ? force : !container.classList.contains("show");
    container.classList.toggle("show", show);
  }

  // --- FALLBACK ---
  createErrorPage(name) {
    return {
      render() {
        const div = document.createElement("div");
        div.className = "page page-centered";
        div.textContent = `Erreur 404 : La page "${name}" n'existe pas.`;
        return div;
      },
    };
  }
}
