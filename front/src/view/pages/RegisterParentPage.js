import { el } from "../../utils/DOMBuilder.js";
import { FormHelpers } from "../../utils/FormHelpers.js";

export class RegisterParentPage {
    constructor(app) {
        this.app = app;
    }

    render() {
        const state = this.app.model.getAuthState();
        const controller = this.app.auth;
        const step = state.step || 1;

        let isValid =
            step === 1
                ? FormHelpers.isParentValid(state.registerData)
                : state.registerData.pin?.length === 4;

        const btnContent = state.isLoading
            ? el("span", { className: "ca-spinner" }, "...")
            : step === 1
              ? "Suivant"
              : "Créer mon compte";

        return el(
            "div",
            { className: "ca-screen" },
            el(
                "div",
                { className: "ca-content" },
                el("h1", { className: "ca-title" }, "Création de compte"),
                el(
                    "p",
                    { className: "ca-step-label" },
                    step === 1
                        ? "Étape 1/2 : Identifiants"
                        : "Étape 2/2 : Code PIN",
                ),
                el(
                    "div",
                    { className: "ca-form-block" },
                    step === 1
                        ? this.buildStep1(state, controller)
                        : this.buildStep2(state, controller),
                ),
                el(
                    "button",
                    {
                        id: "ca-main-btn",
                        className: "ca-btn-next",
                        disabled: !isValid || state.isLoading,
                        onClick: () => controller.handleNextStep("parent"),
                    },
                    btnContent,
                ),
            ),
            el(
                "div",
                { className: "ca-footer" },
                el(
                    "p",
                    { className: "ca-login-hint" },
                    "Déjà inscrit ? ",
                    el(
                        "a",
                        {
                            href: "#",
                            onClick: (e) => {
                                e.preventDefault();
                                this.app.navigation.goTo("login");
                            },
                        },
                        "Connecte-toi !",
                    ),
                ),
            ),
        );
    }

    buildStep1(state, controller) {
        return [
            el("p", { className: "ca-question" }, "Tes identifiants"),
            el("input", {
                className: "ca-input",
                type: "email",
                placeholder: "Email",
                value: state.registerData.email,
                onInput: (e) =>
                    controller.handleInput(
                        "register-adult",
                        "email",
                        e.target.value,
                    ),
            }),
            el("input", {
                className: "ca-input",
                type: "password",
                placeholder: "Mot de passe",
                value: state.registerData.password,
                onInput: (e) =>
                    controller.handleInput(
                        "register-adult",
                        "password",
                        e.target.value,
                    ),
            }),
            el("input", {
                className: "ca-input",
                type: "password",
                placeholder: "Confirmer",
                value: state.registerData.confirmPassword || "",
                onInput: (e) =>
                    controller.handleInput(
                        "register-adult",
                        "confirmPassword",
                        e.target.value,
                    ),
            }),
        ];
    }

    buildStep2(state, controller) {
        const pin = state.registerData.pin || "";
        const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"];

        return [
            el(
                "p",
                { className: "ca-question" },
                "Crée ton code PIN (4 chiffres)",
            ),
            el(
                "div",
                { className: "ca-pin-display-container" },
                ...Array.from({ length: 4 }).map((_, i) =>
                    el(
                        "div",
                        {
                            className: `ca-pin-dot ${i < pin.length ? "filled" : ""}`,
                        },
                        i < pin.length ? pin[i] : "",
                    ),
                ),
            ),
            el(
                "div",
                { className: "ca-pin-keypad" },
                ...keys.map((key) =>
                    el(
                        "button",
                        {
                            className: "pin-key",
                            onClick: (e) => {
                                e.preventDefault();
                                const current = state.registerData.pin || "";
                                if (key === "⌫")
                                    controller.handleInput(
                                        "register-adult",
                                        "pin",
                                        current.slice(0, -1),
                                    );
                                else if (current.length < 4 && key !== "")
                                    controller.handleInput(
                                        "register-adult",
                                        "pin",
                                        current + key,
                                    );
                                this.refreshBtn();
                            },
                        },
                        key,
                    ),
                ),
            ),
        ];
    }

    refreshBtn() {
        const btn = document.getElementById("ca-main-btn");
        if (!btn) return;
        const state = this.app.model.getAuthState();
        const step = state.step || 1;
        const isValid =
            step === 1
                ? FormHelpers.isParentValid(state.registerData)
                : state.registerData.pin?.length === 4;
        btn.disabled = !isValid || state.isLoading;
        const dots = document.querySelectorAll(".ca-pin-dot");
        const pin = state.registerData.pin || "";
        dots.forEach((dot, i) => {
            dot.classList.toggle("filled", i < pin.length);
            dot.textContent = i < pin.length ? pin[i] : "";
        });
    }
}
