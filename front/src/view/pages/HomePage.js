export class HomePage {
    constructor(controller) {
        this.controller = controller;
    }

    render(childData) {
        if (!childData || !childData.sessions) {
            return `<div class="home-screen"></div>`;
        }

        return `
      <div class="home-screen">
        <div class="path-container">
          ${childData.sessions.map((s, i) => this.renderStep(s, i)).join("")}
        </div>
      </div>
    `;
    }

    renderStep(session, index) {
        const offset = this.getOffset(index);
        const extra = this.renderExtra(session);
        const popup = this.renderPopup(session, index);

        return `
      <div class="path-step ${session.status} ${session.isLocked ? "is-locked" : ""}"
           style="transform: translateX(${offset}px); z-index: 1;">
           
        <div class="path-button-container">
          ${extra}
          <div class="path-dot-shadow"></div>
          <div class="path-dot"></div>
          <div class="duo-popup">
            <div class="popup-arrow"></div>
            ${popup}
          </div>
        </div>

        <span class="path-label">${session.day}</span>
      </div>
    `;
    }

    getOffset(index) {
        const pattern = [0, 45, 25, -25, -45];
        return pattern[index % pattern.length];
    }

    renderExtra(session) {
        if (!session.isToday) return "";

        return `
      <div class="today-halo"></div>
      <img src="/assets/img/mascottes/camelion.png"
           class="mascotte-path"
           alt="Mascotte">
    `;
    }

    renderPopup(session, index) {
        if (session.isToday) {
            return `
        <h3>Leçon ${index + 1}</h3>
        <p>Prêt pour un défi ?</p>
        <button class="start-btn" data-session="${index}">COMMENCER</button>
      `;
        }

        if (session.status === "done") {
            return `
        <h3>Leçon ${index + 1}</h3>
        <p>Bravo ! Tu as validé cette séance.</p>
      `;
        }

        return `
      <h3>Leçon ${index + 1}</h3>
      <p>Patience... cette leçon n'est pas encore disponible.</p>
      <button class="start-btn disabled" disabled>
        <span class="icon-lock">🔒</span> BLOQUÉ
      </button>
    `;
    }

    mount() {
        const mascot = document.querySelector(".mascotte-path");
        if (mascot) {
            mascot.scrollIntoView({
                behavior: "auto",
                block: "center",
            });
        }

        // Gestion du bouton "COMMENCER"
        document.querySelectorAll(".start-btn:not(.disabled)").forEach(btn => {
            btn.addEventListener("click", () => {
                const sessionIndex = btn.dataset.session;
                this.controller.startSession(sessionIndex);
            });
        });
    }
}