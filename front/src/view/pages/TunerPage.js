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

        const greenZone = el("div", { className: "tuner-green-zone" });
        const needle = el("div", { className: "tuner-needle", id: "needle" });
        const center = el("div", { className: "tuner-center" });

        const gauge = el(
            "div",
            { className: "tuner-gauge" },
            greenZone,
            needle,
            center
        );

        const pitchSelect = el(
            "select",
            { id: "concertPitch" },
            el("option", { value: "A" }, "Concert A"),
            el("option", { value: "Bb" }, "Bb instrument"),
            el("option", { value: "Eb" }, "Eb instrument"),
            el("option", { value: "F" }, "F instrument")
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
        container.appendChild(pitchSelect);
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
        const pitchSelect = document.getElementById("concertPitch");
        const center = document.querySelector(".tuner-center");

        pitchSelect.addEventListener("change", () => {
            if (this.tuner) {
                this.tuner.currentPitch = pitchSelect.value;
            }
        });

        this.tuner = new Tuner({
            minClarity: 0.5,
            onUpdate: (data) => {
                if (!data) return;

                const { freq, clarity, note, cents } = data;

                freqEl.textContent = `Fréquence : ${freq.toFixed(2)} Hz`;
                clarityEl.textContent = `Clarté : ${(clarity * 100).toFixed(1)} %`;
                noteEl.textContent = `${data.noteTransposed}${data.octaveTransposed}`;

                centsEl.textContent = `Écart : ${cents.toFixed(1)} cents`;
                const angle = Math.max(-50, Math.min(50, cents)) * 0.9;
                needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;

                if (Math.abs(cents) < 5) {
                    needle.style.background = "#4caf50";
                    center.classList.add("good");
                } else {
                    needle.style.background = "red";
                    center.classList.remove("good");
                }


            }
        });

        this.tuner.currentPitch = pitchSelect.value;

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
