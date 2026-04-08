import { el } from "../../utils/DOMBuilder.js";

export class MetronomePage {
    constructor(app) {
        this.app = app;
        this.audioContext = null;
        this.isPlaying = false;
        this.bpm = 120;
        this.nextNoteTime = 0.0;
        this.timerID = null;
        this.lookahead = 25.0;
        this.scheduleAheadTime = 0.1;
    }

    async render() {
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
                        onClick: () => this.handleExit(),
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
                    el("span", { id: "bpm-value" }, this.bpm),
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
                    min: 40,
                    max: 220,
                    value: this.bpm,
                    onInput: (e) => this.updateBpm(e.target.value),
                }),

                el(
                    "div",
                    { className: "tempo-controls" },
                    el(
                        "button",
                        {
                            className: "tempo-btn",
                            onClick: () => this.updateBpm(this.bpm - 1),
                        },
                        "-",
                    ),
                    el(
                        "button",
                        {
                            className: "play-btn",
                            id: "metronome-play",
                            onClick: () => this.toggleMetronome(),
                        },
                        "▶",
                    ),
                    el(
                        "button",
                        {
                            className: "tempo-btn",
                            onClick: () => this.updateBpm(this.bpm + 1),
                        },
                        "+",
                    ),
                ),
            ),
        );
    }

    updateBpm(value) {
        this.bpm = parseInt(value);
        const display = document.getElementById("bpm-value");
        if (display) display.textContent = this.bpm;
    }

    toggleMetronome() {
        if (!this.audioContext) {
            this.audioContext = new (
                window.AudioContext || window.webkitAudioContext
            )();
        }

        this.isPlaying = !this.isPlaying;
        const btn = document.getElementById("metronome-play");

        if (this.isPlaying) {
            btn.textContent = "■";
            this.nextNoteTime = this.audioContext.currentTime;
            this.scheduler();
        } else {
            btn.textContent = "▶";
            clearTimeout(this.timerID);
        }
    }

    scheduler() {
        while (
            this.nextNoteTime <
            this.audioContext.currentTime + this.scheduleAheadTime
        ) {
            this.scheduleNote(this.nextNoteTime);
            this.nextNoteTime += 60.0 / this.bpm;
        }
        this.timerID = setTimeout(() => this.scheduler(), this.lookahead);
    }

    scheduleNote(time) {
        const osc = this.audioContext.createOscillator();
        const envelope = this.audioContext.createGain();

        osc.frequency.value = 880;
        envelope.gain.value = 1;
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

        osc.connect(envelope);
        envelope.connect(this.audioContext.destination);

        osc.start(time);
        osc.stop(time + 0.1);

        window.setTimeout(
            () => {
                const dot = document.getElementById("beat-dot");
                if (dot) {
                    dot.classList.add("active");
                    setTimeout(() => dot.classList.remove("active"), 100);
                }
            },
            (time - this.audioContext.currentTime) * 1000,
        );
    }

    handleExit() {
        if (this.isPlaying) this.toggleMetronome();
        this.app.navigation.goTo("home");
    }
}
