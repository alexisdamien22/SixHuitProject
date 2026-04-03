import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";

import { HomePage } from "./pages/HomePage.js";
import { ProfilPage } from "./pages/ProfilPage.js";
import { SettingsPage } from "./pages/SettingsPage.js";
import { MusicPage } from "./pages/MusicPage.js";
import { PodiumPage } from "./pages/PodiumPage.js";
import { ParentHomePage } from "./pages/ParentHomePage.js";

import { LoginPage } from "./pages/LoginPage.js";
import { RegisterParentPage } from "./pages/RegisterParentPage.js";
import { RegisterChildPage } from "./pages/RegisterChildPage.js";

import { AccountSwitcher } from "./pages/AccountSwitcher.js";

import { AppViewTheme } from "./AppViewTheme.js";
import { AppViewNavigation } from "./AppViewNavigation.js";
import { initAppEvents } from "./AppViewEvents.js";

export class AppView {
  constructor() {
    this.appRoot = document.getElementById("app");
    this.headerRoot = document.getElementById("header-placeholder");
    this.footerRoot = document.getElementById("footer-placeholder");
    this.currentPage = null;
  }

  init(app) {
    this.app = app;
    this.header = new Header(app);
    this.footer = new Footer(app);

    this.headerRoot.replaceChildren(this.header.render());
    this.footerRoot.replaceChildren(this.footer.render());

    AppViewTheme.init();
    initAppEvents(this);
    requestAnimationFrame(() => this.syncFooter(0));
  }

  async renderPage(name, params = {}) {
    const activeChildId = localStorage.getItem("activeChildId");

    if (name === "parent-home" && activeChildId) {
      if (
        this.app.child &&
        typeof this.app.child.loadChildData === "function"
      ) {
        await this.app.child.loadChildData();
      }
      this.app.navigation.goTo("home");
      return;
    }

    this.appRoot.replaceChildren();

    const hideHeader = ["login", "registerParent", "registerChild"].includes(
      name,
    );

    const hideFooter = ["login", "registerParent", "registerChild"].includes(
      name,
    );

    this.headerRoot.style.display = hideHeader ? "none" : "";
    this.footerRoot.style.display = hideFooter ? "none" : "";

    const isParentMode =
      this.app.model.session.isParent() &&
      !localStorage.getItem("activeChildId");
    document.body.classList.toggle("parent-mode", isParentMode);

    let page;
    switch (name) {
      case "home":
        page = new HomePage(this.app);
        break;
      case "login":
        page = new LoginPage(this.app);
        break;
      case "registerParent":
        page = new RegisterParentPage(this.app);
        break;
      case "registerChild":
        page = new RegisterChildPage(this.app);
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
    const content = await page.render();
    this.appRoot.appendChild(content);

    const pageToIconMap = {
      home: 0,
      "parent-home": 0,
      podium: 1,
      music: 2,
      profil: 3,
      settings: 3,
    };
    const activeFooterIndex = pageToIconMap[name];
    if (activeFooterIndex !== undefined) {
      this.syncFooter(activeFooterIndex);
    }
  }

  updateChildData(data) {
    if (this.header && typeof this.header.update === "function") {
      this.header.update(data);
    }
    if (this.currentPage && typeof this.currentPage.update === "function") {
      this.currentPage.update(data);
    }
  }

  syncFooter(index) {
    const icons = document.querySelectorAll(".icon-footer");
    icons.forEach((i) => i.classList.remove("active"));
    if (icons[index]) {
      icons[index].classList.add("active");
      AppViewNavigation.updateSlider(index, true);
    }
  }

  // Localisation : front/src/view/AppView.js

  toggleBottomMenu(force, skipReset = false) {
    AppViewNavigation.createBottomMenu(this);
    const container = document.getElementById("bottom-menu-container");
    if (!container) return;

    const show =
      force !== undefined ? force : !container.classList.contains("show");

    container.classList.toggle("show", show);

    if (!show && !skipReset) {
      const currentPageName = this.currentPage?.constructor.name;

      const isMenuPage = ["ProfilPage", "SettingsPage"].includes(
        currentPageName,
      );

      if (isMenuPage) {
        this.syncFooter(3);
      } else {
        const pageToIconMap = {
          HomePage: 0,
          ParentHomePage: 0,
          PodiumPage: 1,
          MusicPage: 2,
        };
        const idx = pageToIconMap[currentPageName] ?? 0;
        this.syncFooter(idx);
      }
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

  async toggleAccountSwitcher(show) {
    let switcher = document.getElementById("account-switcher-container");
    const isShowing = switcher?.classList.contains("show");
    const targetShow = show !== undefined ? show : !isShowing;

    if (targetShow) {
      if (
        this.app.model &&
        typeof this.app.model.fetchChildrenAccounts === "function"
      ) {
        await this.app.model.fetchChildrenAccounts();
      } else {
        console.warn(
          "[AppView] ATTENTION: fetchChildrenAccounts n'existe pas dans le modèle !",
        );
      }

      const children =
        this.app.model?.childrenAccounts ||
        (this.app.model?.getChildren ? this.app.model.getChildren() : []);

      AccountSwitcher.create(this, children);
      switcher = document.getElementById("account-switcher-container");

      void switcher.offsetWidth;

      switcher.classList.add("show");
      document.body.style.overflow = "hidden";
    } else if (switcher) {
      switcher.classList.remove("show");
      document.body.style.overflow = "";
    }
  }
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
