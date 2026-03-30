export class HomePage {
    constructor(app) {
        this.app = app;
    }

    render() {
        const childData = this.app.model.getChildData();

        const root = document.createElement("div");
        root.classList.add("home-screen");

        if (!childData || !childData.weeklyPlan) {
            return root;
        }

        const pathContainer = document.createElement("div");
        pathContainer.classList.add("path-container");

        childData.weeklyPlan.forEach((session, index) => {
            const step = this.renderStep(session, index);
            pathContainer.appendChild(step);
        });

        root.appendChild(pathContainer);

        setTimeout(() => this.mount(), 0);

        return root;
    }

    renderStep(session, index) {
        const step = document.createElement("div");
        step.classList.add("path-step", session.status);
        if (session.isLocked) step.classList.add("is-locked");

        const offset = this.getOffset(index);
        step.style.transform = `translateX(${offset}px)`;
        step.style.zIndex = "1";

        const container = document.createElement("div");
        container.classList.add("path-button-container");

        const extra = this.renderExtra(session);
        if (extra) container.appendChild(extra);

        const shadow = document.createElement("div");
        shadow.classList.add("path-dot-shadow");

        const dot = document.createElement("div");
        dot.classList.add("path-dot");

        const popup = this.renderPopup(session, index);

        container.appendChild(shadow);
        container.appendChild(dot);
        container.appendChild(popup);

        const label = document.createElement("span");
        label.classList.add("path-label");
        label.textContent = session.day;

        step.appendChild(container);
        step.appendChild(label);

        return step;
    }

    getOffset(index) {
        const pattern = [0, 45, 25, -25, -45];
        return pattern[index % pattern.length];
    }

    renderExtra(session) {
        if (!session.isToday) return null;

        const wrapper = document.createElement("div");

        const halo = document.createElement("div");
        halo.classList.add("today-halo");

        const mascotte = document.createElement("img");
        mascotte.src = "/assets/img/mascottes/camelion.png";
        mascotte.classList.add("mascotte-path");
        mascotte.alt = "Mascotte";

        wrapper.appendChild(halo);
        wrapper.appendChild(mascotte);

        return wrapper;
    }

    renderPopup(session, index) {
        const popup = document.createElement("div");
        popup.classList.add("duo-popup");

        const arrow = document.createElement("div");
        arrow.classList.add("popup-arrow");

        popup.appendChild(arrow);

        const title = document.createElement("h3");
        title.textContent = `Leçon ${index + 1}`;

        const desc = document.createElement("p");

        popup.appendChild(title);
        popup.appendChild(desc);

        if (session.isToday) {
            desc.textContent = "Prêt pour un défi ?";

            const btn = document.createElement("button");
            btn.classList.add("start-btn");
            btn.dataset.session = index;
            btn.textContent = "COMMENCER";

            popup.appendChild(btn);
            return popup;
        }

        if (session.status === "done") {
            desc.textContent = "Bravo ! Tu as validé cette séance.";
            return popup;
        }

        desc.textContent = "Patience... cette leçon n'est pas encore disponible.";

        const btn = document.createElement("button");
        btn.classList.add("start-btn", "disabled");
        btn.disabled = true;
        btn.innerHTML = `<span class="icon-lock">🔒</span> BLOQUÉ`;

        popup.appendChild(btn);

        return popup;
    }

    mount() {
        const mascot = document.querySelector(".mascotte-path");
        if (mascot) {
            mascot.scrollIntoView({
                behavior: "auto",
                block: "center",
            });
        }

        document.querySelectorAll(".start-btn:not(.disabled)").forEach(btn => {
            btn.addEventListener("click", () => {
                const sessionIndex = btn.dataset.session;
                this.app.child.updateSession("Lundi", "done");
                this.app.navigation.goTo("music");
            });
        });
    }

    update(childData) {
        // Si tu veux mettre à jour dynamiquement la page
    }
}
