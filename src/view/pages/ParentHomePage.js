import { createElement as el } from "../../utils/DOMBuilder.js";

export const ParentHomePage = {
  render(parentData) {
    return el(
      "div",
      {
        className: "parent-screen",
        style: { padding: "20px", textAlign: "center" },
      },
      el("h1", { style: { marginBottom: "20px" } }, "Espace Parent"),
      el(
        "button",
        {
          id: "add-child-btn",
          className: "ca-btn-next",
          style: { marginTop: "40px", maxWidth: "300px" },
          onClick: () => {
            window.appController?.navigateToPage("createAccount");
          },
        },
        "+ Ajouter un profil enfant",
      ),
    );
  },
};
