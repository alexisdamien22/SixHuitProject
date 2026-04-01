import { el } from "../../utils/DOMBuilder.js";

export class ParentHomePage {
  constructor(app) {
    this.app = app;
  }

  async render() {
    console.log("[ParentHomePage] Début du render()...");
    if (
      this.app.model &&
      typeof this.app.model.fetchChildrenAccounts === "function"
    ) {
      console.log("[ParentHomePage] Appel de fetchChildrenAccounts()...");
      await this.app.model.fetchChildrenAccounts();
      console.log("[ParentHomePage] fetchChildrenAccounts() terminé.");
    } else {
      console.warn(
        "[ParentHomePage] ATTENTION: fetchChildrenAccounts n'existe pas dans le modèle !",
      );
    }

    const parentData = this.app.model.getParentData() || {};
    const welcomeName = parentData.name ? `, ${parentData.name}` : "";

    const children = this.app.model?.childrenAccounts || [];
    console.log("[ParentHomePage] Liste des enfants récupérée :", children);

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
        "div",
        { style: { width: "100%", maxWidth: "400px", marginTop: "20px" } },
        children.length > 0
          ? children.map((child) =>
              el(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#fff",
                    padding: "10px 15px",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  },
                },
                el(
                  "div",
                  {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    },
                  },
                  el(
                    "span",
                    { style: { fontSize: "1.5em" } },
                    child.mascot || "🎵",
                  ),
                  el(
                    "span",
                    { style: { fontWeight: "bold", color: "#333" } },
                    child.name,
                  ),
                ),
                el(
                  "button",
                  {
                    style: {
                      padding: "5px 10px",
                      borderRadius: "5px",
                      background: "#f0f0f0",
                      border: "none",
                      cursor: "pointer",
                    },
                  },
                  "Modifier",
                ),
              ),
            )
          : el(
              "p",
              { style: { color: "#888", fontStyle: "italic" } },
              "Aucun enfant associé pour le moment.",
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
