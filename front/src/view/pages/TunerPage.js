import { el } from "../../utils/DOMBuilder.js";
import { Tuner } from "../../utils/tuner.js";

export class TunerPage {
    constructor(app) {
        this.app = app;
        this.tuner = null;
        this.mounted = false;
    }

    async render() {
        const container = el("div", { className: "page tuner-page" });

        const needle = el("div", { className: "tuner-needle", id: "needle" });
        const center = el("div", { className: "tuner-center" });

        const gauge = el(
            "div",
            { className: "tuner-gauge" },
            needle,
            center
        );

        const noteEl = el("div", { className: "tuner-note", id: "note" }, "--");

        const freqEl = el("p", { id: "freq" }, "Fréquence : -- Hz");
        const centsEl = el("p", { id: "cents" }, "Écart : -- cents");
        const clarityEl = el("p", { id: "clarity" }, "Clarté : -- %");

        const info = el("div", { className: "tuner-info" }, freqEl, centsEl, clarityEl);

        const tunerContainer = el(
            "div",
            { className: "tuner-container" },
            gauge,
            noteEl,
            info
        );

        const title = el("h1", {}, "Accordeur");

        container.appendChild(title);
        container.appendChild(tunerContainer);

        return container;
    }


    async onMount() {
        if (this.mounted) return;
        this.mounted = true;

        const freqEl = document.getElementById("freq");
        const clarityEl = document.getElementById("clarity");
        const noteEl = document.getElementById("note");
        const centsEl = document.getElementById("cents");
        const needle = document.getElementById("needle");

        this.tuner = new Tuner({
            minClarity: 0,
            onUpdate: (data) => {
                if (!data) return;

                const { freq, clarity, note, cents } = data;

                freqEl.textContent = `Fréquence : ${freq.toFixed(2)} Hz`;
                clarityEl.textContent = `Clarté : ${(clarity * 100).toFixed(1)} %`;
                noteEl.textContent = note;
                centsEl.textContent = `Écart : ${cents.toFixed(1)} cents`;

                const angle = Math.max(-50, Math.min(50, cents)) * 0.9;
                needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
            }
        });

        await this.tuner.start();
    }

    onUnmount() {
        if (this.tuner) {
            this.tuner.stop();
            this.tuner = null;
        }

        this.mounted = false;
    }
}
