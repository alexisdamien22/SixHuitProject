import { el } from "../../utils/DOMBuilder.js";

export const AccountSwitcher = {
  create(view, accounts = []) {
    let container = document.getElementById("account-switcher-container");
    if (container) container.remove();

    const items = accounts.map((acc) =>
      el(
        "div",
        {
          className: "switcher-item",
          dataset: { id: String(acc.id) },
          onClick: async () => {
            localStorage.setItem("activeChildId", acc.id);
            view.toggleAccountSwitcher(false);
            if (
              view.app.child &&
              typeof view.app.child.loadChildData === "function"
            ) {
              await view.app.child.loadChildData();
            }
            view.app.navigation.goTo("home");
          },
        },
        el("div", { className: "switcher-avatar" }, acc.mascot || "🎵"),
        el(
          "div",
          { className: "switcher-info" },
          el("span", { className: "switcher-name" }, acc.name),
          el("span", { className: "switcher-status" }, "Élève"),
        ),
      ),
    );

    const switcher = el(
      "div",
      {
        id: "account-switcher-container",
        className: "account-switcher-container",
      },
      el("div", {
        className: "account-switcher-overlay",
        onClick: () => view.toggleAccountSwitcher(false),
      }),
      el(
        "div",
        { className: "account-switcher-sheet" },
        el(
          "div",
          {
            className: "switcher-header",
          },
          "Changer de profil",
        ),
        el(
          "div",
          { className: "switcher-list" },
          ...items,
          el(
            "div",
            {
              className: "switcher-item",
              id: "btn-switch-add",
              onClick: () => {
                view.toggleAccountSwitcher(false);
                view.app.navigation.goTo("registerChild");
              },
            },
            el("div", { className: "switcher-avatar" }, "+"),
            el(
              "div",
              { className: "switcher-info" },
              el("span", { className: "switcher-name" }, "Ajouter un enfant"),
            ),
          ),
        ),
        el("div", { className: "switcher-divider" }),
        el(
          "div",
          {
            className: "switcher-item",
            id: "btn-switch-parent",
            onClick: () => {
              localStorage.removeItem("activeChildId");
              view.toggleAccountSwitcher(false);
              view.app.navigation.goTo("parent-home");
            },
          },
          el(
            "div",
            { className: "switcher-info" },
            el("span", { className: "switcher-name" }, "Espace Parent"),
          ),
        ),
      ),
    );

    document.body.appendChild(switcher);
  },
};
