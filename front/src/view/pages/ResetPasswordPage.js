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
                    "Choisis un nouveau mot de passe sécurisé.",
                ),
                el(
                    "div",
                    { className: "ca-form-block" },
                    el(
                        "div",
                        { className: "rp-input-group" },
                        el("input", {
                            id: "rp-pass",
                            className: "ca-input",
                            type: "password",
                            placeholder: "Nouveau mot de passe",
                        }),
                        el(
                            "button",
                            {
                                type: "button",
                                className: "rp-toggle-btn",
                                onClick: (e) => {
                                    e.preventDefault();
                                    const input =
                                        document.getElementById("rp-pass");
                                    input.type =
                                        input.type === "password"
                                            ? "text"
                                            : "password";
                                    e.target.textContent =
                                        input.type === "password" ? "👁️" : "🙈";
                                },
                            },
                            "👁️",
                        ),
                    ),
                    el(
                        "div",
                        {
                            className: "rp-input-group rp-input-group-spaced",
                        },
                        el("input", {
                            id: "rp-conf",
                            className: "ca-input",
                            type: "password",
                            placeholder: "Confirmer le mot de passe",
                        }),
                        el(
                            "button",
                            {
                                type: "button",
                                className: "rp-toggle-btn",
                                onClick: (e) => {
                                    e.preventDefault();
                                    const input =
                                        document.getElementById("rp-conf");
                                    input.type =
                                        input.type === "password"
                                            ? "text"
                                            : "password";
                                    e.target.textContent =
                                        input.type === "password" ? "👁️" : "🙈";
                                },
                            },
                            "👁️",
                        ),
                    ),
                ),
                el(
                    "button",
                    {
                        className: "ca-btn-next",
                        onClick: async (e) => {
                            const p1 = document.getElementById("rp-pass").value;
                            const p2 = document.getElementById("rp-conf").value;
                            if (!p1 || p1 !== p2)
                                return alert(
                                    "Les mots de passe ne correspondent pas.",
                                );
                            if (p1.length < 6)
                                return alert(
                                    "Le mot de passe doit faire au moins 6 caractères.",
                                );

                            const btn = e.target;
                            btn.textContent = "Chargement...";
                            btn.disabled = true;

                            try {
                                await this.app.auth.resetPassword(p1);
                                alert(
                                    "Mot de passe modifié avec succès ! Tu peux maintenant te connecter.",
                                );
                                window.location.href = "/"; // Recharge la page pour nettoyer l'URL
                            } catch (err) {
                                alert(
                                    err.message ||
                                        "Erreur lors de la réinitialisation.",
                                );
                                btn.textContent = "Valider";
                                btn.disabled = false;
                            }
                        },
                    },
                    "Valider",
                ),
            ),
        );
    }
}
