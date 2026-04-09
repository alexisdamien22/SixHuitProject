import { el } from "../../utils/DOMBuilder.js";

export class MetronomePage {
    constructor(app) {
        this.app = app;
    }

    async render() {
        const state = this.app.model.getMetronomeState();

        return el(
            "div",
            { className: "page metronome-page" },
            el(
                "div",
                { className: "details-header" },
                el(
                    "button",
                    {
                        className: "back-circle-btn",
                        onClick: () => this.app.navigation.goTo("home"),
                    },
                    "‹",
                ),
                el("h2", { className: "ca-title" }, "Métronome"),
            ),

            el(
                "div",
                { className: "metronome-main" },
                el(
                    "div",
                    { className: "bpm-display" },
                    el("span", { id: "bpm-value" }, state.bpm),
                    el("span", { className: "bpm-label" }, "BPM"),
                ),

                el(
                    "div",
                    { className: "visual-indicator" },
                    el("div", { className: "dot", id: "beat-dot" }),
                ),

                el("input", {
                    type: "range",
                    className: "bpm-slider",
                    id: "bpm-slider-input",
                    min: 40,
                    max: 220,
                    value: state.bpm,
                    onInput: (e) => this.app.metronome.setBpm(e.target.value),
                }),

                el(
                    "div",
                    { className: "tempo-controls" },
                    el(
                        "button",
                        {
                            className: "tempo-btn",
                            onClick: () =>
                                this.app.metronome.setBpm(
                                    this.app.model.getMetronomeBpm() - 1,
                                ),
                        },
                        "-",
                    ),
                    el(
                        "button",
                        {
                            className: "play-btn",
                            id: "metronome-play",
                            onClick: () => this.app.metronome.toggle(),
                        },
                        state.isPlaying ? "■" : "▶",
                    ),
                    el(
                        "button",
                        {
                            className: "tempo-btn",
                            onClick: () =>
                                this.app.metronome.setBpm(
                                    this.app.model.getMetronomeBpm() + 1,
                                ),
                        },
                        "+",
                    ),
                ),
            ),
        );
    }

    updateBpmDisplay(bpm) {
        const display = document.getElementById("bpm-value");
        const slider = document.getElementById("bpm-slider-input");
        if (display) display.textContent = bpm;
        if (slider && slider.value !== String(bpm)) slider.value = bpm;
    }

    updatePlayButton(isPlaying) {
        const btn = document.getElementById("metronome-play");
        if (btn) btn.textContent = isPlaying ? "■" : "▶";
    }

    flashDot() {
        const dot = document.getElementById("beat-dot");
        if (dot) {
            dot.classList.add("active");
            setTimeout(() => dot.classList.remove("active"), 100);
        }
    }
}
