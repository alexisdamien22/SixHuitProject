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
          onClick: async (e) => {
            e.preventDefault();
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
          el("span", { className: "switcher-status" }, " Élève"),
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
        onClick: (e) => {
          e.preventDefault();
          view.toggleAccountSwitcher(false);
        },
      }),
      el(
        "div",
        { className: "account-switcher-sheet" },
        el("div", { className: "switcher-header" }, "Changer de profil"),
        el(
          "div",
          { className: "switcher-list" },
          ...items,
          el(
            "div",
            {
              className: "switcher-item",
              id: "btn-switch-add",
              onClick: (e) => {
                e.preventDefault();
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
            onClick: (e) => {
              e.preventDefault();
              view.toggleAccountSwitcher(false);
              view.app.auth.handleSwitchToParent();
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

  showPinPopup(verifyCallback) {
    const overlay = el("div", { className: "ca-pin-overlay" });
    let enteredPin = "";
    let isProcessing = false;

    const updateDots = () => {
      const dots = overlay.querySelectorAll(".verify-pin-dot");
      dots.forEach((dot, i) => {
        if (i < enteredPin.length) dot.classList.add("filled");
        else dot.classList.remove("filled");
      });
    };

    const handleKey = (key) => {
      if (isProcessing) return;
      if (key === "⌫") enteredPin = enteredPin.slice(0, -1);
      else if (enteredPin.length < 4) enteredPin += key;
      updateDots();

      if (enteredPin.length === 4) {
        isProcessing = true;
        verifyCallback(
          enteredPin,
          () => {
            overlay.remove();
          },
          () => {
            // Callback onError
            const container = overlay.querySelector(".verify-pin-container");
            container.classList.add("error-shake");
            setTimeout(() => {
              container.classList.remove("error-shake");
              enteredPin = "";
              updateDots();
              isProcessing = false;
            }, 400);
          },
        );
      }
    };

    const dotsContainer = el(
      "div",
      { className: "verify-pin-container" },
      ...Array.from({ length: 4 }).map(() =>
        el("div", { className: "verify-pin-dot" }),
      ),
    );

    const keys = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "Annuler",
      "0",
      "⌫",
    ];

    const keypad = el(
      "div",
      { className: "verify-pin-keypad" },
      ...keys.map((key) =>
        el(
          "button",
          {
            className: key === "Annuler" ? "pin-key pin-key-cancel" : "pin-key",
            onClick: (e) => {
              e.preventDefault();
              if (key === "Annuler") overlay.remove();
              else handleKey(key);
            },
          },
          key,
        ),
      ),
    );

    overlay.appendChild(
      el("h2", { className: "verify-pin-title" }, "Code PIN Parent"),
    );
    overlay.appendChild(dotsContainer);
    overlay.appendChild(keypad);
    document.body.appendChild(overlay);
  },
};
