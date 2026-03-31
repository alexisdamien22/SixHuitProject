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

  renderPage(name, params = {}) {
    this.appRoot.replaceChildren();

    const hideNav = [
      "login",
      "registerParent",
      "registerChild",
      "parent-home",
    ].includes(name);
    this.headerRoot.style.display = hideNav ? "none" : "";
    this.footerRoot.style.display = hideNav ? "none" : "";

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
    this.appRoot.appendChild(page.render());
  }

  updateChildData(data) {
    this.header.update(data);
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

  toggleBottomMenu(force, skipReset = false) {
    AppViewNavigation.createBottomMenu(this);
    const container = document.getElementById("bottom-menu-container");
    if (!container) return;

    const show =
      force !== undefined ? force : !container.classList.contains("show");
    container.classList.toggle("show", show);

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

  toggleAccountSwitcher(show) {
    let switcher = document.getElementById("account-switcher-container");
    if (!switcher && show) {
      const children = this.app.model?.getChildren
        ? this.app.model.getChildren()
        : [];
      AccountSwitcher.create(this, children);
      switcher = document.getElementById("account-switcher-container");
    }

    if (switcher) {
      if (show) {
        switcher.classList.add("show");
        document.body.style.overflow = "hidden";
      } else {
        switcher.classList.remove("show");
        document.body.style.overflow = "";
      }
    }
  }
  toggleAccountSwitcher(show) {
    let switcher = document.getElementById("account-switcher-container");

    if (!switcher && show) {
      const children = this.model?.getChildren ? this.model.getChildren() : [];
      AccountSwitcher.create(this, children);
      switcher = document.getElementById("account-switcher-container");
    }

    if (switcher) {
      if (show) {
        switcher.classList.add("show");
        document.body.style.overflow = "hidden";
      } else {
        switcher.classList.remove("show");
        document.body.style.overflow = "";
      }
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
