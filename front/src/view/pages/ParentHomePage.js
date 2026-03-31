import { el } from "../../utils/DOMBuilder.js";

export class ParentHomePage {
  constructor(app) {
    this.app = app;
  }

  render() {
    const parentData = this.app.model.getParentData() || {};
    const welcomeName = parentData.name ? `, ${parentData.name}` : "";

    return el(
      "div",
      {
        className: "parent-screen page",
        style: {
          padding: "20px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
        },
      },
      el("h1", { style: { marginBottom: "10px" } }, "Espace Parent"),
      el(
        "p",
        { style: { color: "#666", marginBottom: "30px" } },
        `Bienvenue dans ton tableau de bord${welcomeName} !`,
      ),

      el(
        "div",
        {
          className: "ca-form-block",
          style: {
            width: "100%",
            maxWidth: "400px",
            padding: "20px",
            borderRadius: "15px",
            background: "var(--color-bg-popup)",
          },
        },
        el("p", { className: "ca-question" }, "Gère les profils enfants ici."),
        el(
          "p",
          { style: { fontSize: "0.9em", color: "#888" } },
          "Crée un profil pour que ton enfant puisse commencer ses sessions de musique.",
        ),
      ),

      el(
        "button",
        {
          className: "ca-btn-next",
          style: { marginTop: "40px", width: "100%", maxWidth: "300px" },
          onClick: () => this.app.navigation.goTo("registerChild"),
        },
        "+ Ajouter un profil enfant",
      ),

      el(
        "a",
        {
          href: "#",
          style: {
            marginTop: "20px",
            color: "#ff4757",
            textDecoration: "none",
            fontSize: "0.9em",
          },
          onClick: (e) => {
            e.preventDefault();
            this.app.auth.logout();
          },
        },
        "Se déconnecter",
      ),
    );
  }
}
