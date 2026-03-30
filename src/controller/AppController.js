export class AppController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async init() {
    await this.model.init();
    const currentPage = this.getCurrentPageFromHash();
    this.navigateToPage(currentPage);
  }

  getCurrentPageFromHash() {
    const hash = window.location.hash.substring(1);
    const validPages = [
      "home",
      "podium",
      "music",
      "menu",
      "settings",
      "profil",
      "createAccount",
    ];
    return validPages.includes(hash) ? hash : "home";
  }

  navigateToPage(pageName) {
    if (!this.model.isLoggedIn() && pageName !== "createAccount") {
      this.navigateToPage("createAccount");
      return;
    }

    this.updateHash(pageName);

    switch (pageName) {
      case "home":
        if (!localStorage.getItem("activeChildId")) {
          this.view.renderParentHome(
            this.model.getParentData ? this.model.getParentData() : null,
          );
        } else {
          this.view.renderHome(this.model.getChildData());
        }
        break;
      case "podium":
        this.view.renderPodium();
        break;
      case "music":
        this.view.renderMusic();
        break;
      case "settings":
        this.view.renderSettings();
        break;
      case "profil":
        this.view.renderProfil(this.model.getChildData());
        break;
      case "createAccount":
        this.view.renderCreateAccount();
        break;
    }
  }

  updateHash(pageName) {
    window.location.hash = pageName;
  }

  async handleSessionValidation() {
    try {
      await this.model.completeCurrentSession();

      const childData = this.model.getChildData();
      if (childData && childData.streakData) {
        if (typeof this.view.updateHeaderStreak === "function") {
          this.view.updateHeaderStreak(childData.streakData.current_streak);
        }
      }

      this.navigateToPage("home");
    } catch (error) {
      console.error(error);
    }
  }
}
