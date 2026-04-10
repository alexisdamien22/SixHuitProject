import { el } from "../../utils/DOMBuilder.js";
import { Tuner } from "../../utils/tuner.js";

export class TunerPage {
    constructor(app) {
        this.app = app;
        this.tuner = null;
        this.mounted = false;
        this.currentPitchValue = "A";
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
            center,
        );

        const options = [
            { value: "A", label: "Concert A" },
            { value: "Bb", label: "Instrument en Sib" },
            { value: "Eb", label: "Instrument en Mib" },
            { value: "F", label: "Instrument en Fa" },
        ];

        const currentLabelText =
            options.find((o) => o.value === this.currentPitchValue)?.label ||
            "Concert A";

        const triggerLabel = el(
            "span",
            { className: "ca-dropdown-label" },
            currentLabelText,
        );
        const triggerArrow = el(
            "span",
            { className: "ca-dropdown-arrow" },
            "▼",
        );

        let activeCloseHandler = null;
        let dropdownList;

        const closeDropdown = () => {
            if (dropdownList) dropdownList.classList.remove("show");
            triggerArrow.classList.remove("open");
            if (activeCloseHandler) {
                document.removeEventListener("click", activeCloseHandler);
                activeCloseHandler = null;
            }
        };

        const items = options.map((opt) =>
            el(
                "div",
                {
                    className: `ca-dropdown-item ${opt.value === this.currentPitchValue ? "sel" : ""}`,
                    onClick: (e) => {
                        e.stopPropagation();
                        this.currentPitchValue = opt.value;

                        if (this.tuner) {
                            this.tuner.currentPitch = opt.value;
                        }

                        triggerLabel.textContent = opt.label;

                        Array.from(dropdownList.children).forEach((child) =>
                            child.classList.remove("sel"),
                        );
                        e.currentTarget.classList.add("sel");

                        closeDropdown();
                    },
                },
                opt.label,
            ),
        );

        dropdownList = el("div", { className: "ca-dropdown-list" }, ...items);

        const trigger = el(
            "div",
            {
                className: "ca-input ca-dropdown-trigger",
                onClick: (e) => {
                    e.stopPropagation();
                    const isOpening = !dropdownList.classList.contains("show");
                    if (isOpening) {
                        dropdownList.classList.add("show");
                        triggerArrow.classList.add("open");
                        activeCloseHandler = () => closeDropdown();
                        setTimeout(
                            () =>
                                document.addEventListener(
                                    "click",
                                    activeCloseHandler,
                                ),
                            0,
                        );
                    } else {
                        closeDropdown();
                    }
                },
            },
            triggerLabel,
            triggerArrow,
        );

        const pitchSelectWrapper = el(
            "div",
            { className: "ca-dropdown-wrapper tuner-dropdown" },
            trigger,
            dropdownList,
        );

        const noteEl = el("div", { className: "tuner-note", id: "note" }, "--");

        const freqEl = el("p", { id: "freq" }, "Fréquence : -- Hz");
        const centsEl = el("p", { id: "cents" }, "Écart : -- cents");
        const clarityEl = el("p", { id: "clarity" }, "Clarté : -- %");

        const info = el(
            "div",
            { className: "tuner-info" },
            freqEl,
            centsEl,
            clarityEl,
        );

        const tunerContainer = el(
            "div",
            { className: "tuner-container" },
            gauge,
            noteEl,
            info,
        );

        const title = el("h1", {}, "Accordeur");

        container.appendChild(title);
        container.appendChild(tunerContainer);
        container.appendChild(pitchSelectWrapper);

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
        const center = document.querySelector(".tuner-center");

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

                needle.style.setProperty("--needle-angle", `${angle}deg`);

                if (Math.abs(cents) < 5) {
                    needle.classList.add("tuned");
                    needle.classList.remove("untuned");
                    center.classList.add("good");
                } else {
                    needle.classList.add("untuned");
                    needle.classList.remove("tuned");
                    center.classList.remove("good");
                }
            },
        });

        this.tuner.currentPitch = this.currentPitchValue;

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
