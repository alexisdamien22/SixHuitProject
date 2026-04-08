import { el } from "../../utils/DOMBuilder.js";

export class ResetPasswordPage {
    constructor(app) {
        this.app = app;
    }

    render() {
        return el(
            "div",
            { className: "ca-screen" },
            el(
                "div",
                { className: "ca-content" },
                el("h1", { className: "ca-title" }, "Nouveau mot de passe"),
                el(
                    "p",
                    { className: "ca-step-label" },
                    "Réinitialisez votre accès",
                ),
                el(
                    "div",
                    { className: "ca-form-block" },
                    el("input", {
                        id: "rp-pass",
                        className: "ca-input",
                        type: "password",
                        placeholder: "Nouveau mot de passe",
                    }),
                    el("input", {
                        id: "rp-conf",
                        className: "ca-input",
                        type: "password",
                        placeholder: "Confirmer",
                    }),
                ),
                el(
                    "button",
                    {
                        className: "ca-btn-next",
                        onClick: async (e) => {
                            const p1 = document.getElementById("rp-pass").value;
                            const p2 = document.getElementById("rp-conf").value;
                            if (p1 !== p2 || p1.length < 6)
                                return alert("Erreur de mot de passe");

                            e.target.disabled = true;
                            try {
                                await this.app.auth.resetPassword(p1);
                                alert("Succès ! Connectez-vous.");
                                this.app.navigation.goTo("login");
                            } catch (err) {
                                alert(err.message);
                                e.target.disabled = false;
                            }
                        },
                    },
                    "Valider",
                ),
            ),
        );
    }
}
