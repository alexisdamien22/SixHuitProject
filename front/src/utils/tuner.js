import { PitchDetector } from "pitchy";

const NOTE_NAMES = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
const A4_FREQ = 440;
const A4_MIDI = 69;

export class Tuner {
    constructor({ fftSize = 2048, minClarity = 0.8, onUpdate = null } = {}) {
        this.fftSize = fftSize;
        this.minClarity = minClarity;
        this.onUpdate = onUpdate;

        this.TRANSPOSITIONS = {
            "A": 0,
            "Bb": 2,
            "Eb": -3,
            "F": -5
        };

        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.detector = PitchDetector.forFloat32Array(this.fftSize);
        this.running = false;

        this.smoothFreq = null;
        this.smoothCents = null;

        this.lastUpdate = 0;
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

    _loop(timestamp) {
        if (!this.running) return;

        this.analyser.getFloatTimeDomainData(this.dataArray);

        const [pitch, clarity] = this.detector.findPitch(
            this.dataArray,
            this.audioContext.sampleRate
        );

        if (timestamp - this.lastUpdate < 100) {
            requestAnimationFrame((t) => this._loop(t));
            return;
        }
        this.lastUpdate = timestamp;

        if (pitch <= 0) {
            requestAnimationFrame((t) => this._loop(t));
            return;
        }

        const midi = this._freqToMidi(pitch);
        const octave = Math.floor(midi / 12) - 1;
        const noteName = this._noteName(midi);
        const targetFreq = this._midiToFreq(midi);
        const cents = this._centsDiff(pitch, targetFreq);
        const transpo = this.TRANSPOSITIONS[this.currentPitch] || 0;
        const midiTransposed = midi + transpo;
        const octaveTransposed = Math.floor(midiTransposed / 12) - 1;
        const noteTransposed = this._noteName(midiTransposed);

        const alpha = 0.2;
        this.smoothFreq = this.smoothFreq == null
            ? pitch
            : this.smoothFreq + alpha * (pitch - this.smoothFreq);

        this.smoothCents = this.smoothCents == null
            ? cents
            : this.smoothCents + alpha * (cents - this.smoothCents);

        if (clarity < this.minClarity) {
            requestAnimationFrame((t) => this._loop(t));
            return;
        }

        this.onUpdate({
            freq: this.smoothFreq,
            clarity,
            note: noteName,
            noteTransposed,
            midi,
            midiTransposed,
            octave,
            octaveTransposed,
            targetFreq,
            cents: this.smoothCents
        });



        requestAnimationFrame((t) => this._loop(t));
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