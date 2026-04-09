import { PitchDetector } from "pitchy";

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const A4_FREQ = 440;
const A4_MIDI = 69;

export class Tuner {
    constructor({ fftSize = 2048, minClarity = 0.8, onUpdate = null } = {}) {
        this.fftSize = fftSize;
        this.minClarity = minClarity;
        this.onUpdate = onUpdate;

        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.detector = PitchDetector.forFloat32Array(this.fftSize);
        this.running = false;
    }

    async start() {
        if (this.running) return;
        this.running = true;

        this.audioContext = new AudioContext();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = this.audioContext.createMediaStreamSource(stream);

        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = this.fftSize;
        this.dataArray = new Float32Array(this.analyser.fftSize);

        source.connect(this.analyser);

        this._loop();
    }

    stop() {
        this.running = false;
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }

    _loop() {
        if (!this.running) return;

        this.analyser.getFloatTimeDomainData(this.dataArray);

        const [pitch, clarity] = this.detector.findPitch(
            this.dataArray,
            this.audioContext.sampleRate
        );

        if (pitch > 0) {
            const midi = this._freqToMidi(pitch);
            const noteName = this._noteName(midi);
            const targetFreq = this._midiToFreq(midi);
            const cents = this._centsDiff(pitch, targetFreq);

            this.onUpdate({
                freq: pitch,
                clarity,
                note: noteName,
                midi,
                targetFreq,
                cents
            });
        }

        requestAnimationFrame(() => this._loop());
    }



    _freqToMidi(freq) {
        const n = 12 * (Math.log(freq / A4_FREQ) / Math.log(2)) + A4_MIDI;
        return Math.round(n);
    }

    _midiToFreq(midi) {
        return A4_FREQ * Math.pow(2, (midi - A4_MIDI) / 12);
    }

    _noteName(midi) {
        return NOTE_NAMES[midi % 12];
    }

    _centsDiff(freq, targetFreq) {
        return 1200 * Math.log(freq / targetFreq) / Math.log(2);
    }
}