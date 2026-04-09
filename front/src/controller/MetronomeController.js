export class MetronomeController {
    constructor(app) {
        this.app = app;
        this.audioContext = null;
        this.nextNoteTime = 0.0;
        this.timerID = null;
        this.lookahead = 25.0;
        this.scheduleAheadTime = 0.1;
    }

    init() {
        if (!this.audioContext) {
            this.audioContext = new (
                window.AudioContext || window.webkitAudioContext
            )();
        }
    }

    setBpm(bpm) {
        this.app.model.setMetronomeBpm(bpm);
        if (this.app.view.currentPage?.updateBpmDisplay) {
            this.app.view.currentPage.updateBpmDisplay(
                this.app.model.getMetronomeBpm(),
            );
        }
    }

    toggle() {
        this.init();
        const isPlaying = this.app.model.toggleMetronome();

        if (isPlaying) {
            if (this.audioContext.state === "suspended") {
                this.audioContext.resume();
            }
            this.nextNoteTime = this.audioContext.currentTime;
            this.scheduler();
        } else {
            clearTimeout(this.timerID);
        }

        if (this.app.view.currentPage?.updatePlayButton) {
            this.app.view.currentPage.updatePlayButton(isPlaying);
        }
    }

    stop() {
        if (this.app.model.getMetronomeState().isPlaying) {
            this.toggle();
        }
    }

    scheduler() {
        const bpm = this.app.model.getMetronomeBpm();
        while (
            this.nextNoteTime <
            this.audioContext.currentTime + this.scheduleAheadTime
        ) {
            this.scheduleNote(this.nextNoteTime);
            this.nextNoteTime += 60.0 / bpm;
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

        const delay = (time - this.audioContext.currentTime) * 1000;
        setTimeout(() => {
            if (this.app.view.currentPage?.flashDot) {
                this.app.view.currentPage.flashDot();
            }
        }, delay);
    }
}
