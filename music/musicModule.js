/**
 * HarmonicWaveGenerator.js
 * ------------------------
 * A JavaScript module using the p5.sound library to generate harmonically rich but pleasant sounds.
 *
 * Features:
 *  - Generates 3 harmonically related oscillators (base, fifth, octave)
 *  - Smooth amplitude control that preserves harmonic balance
 *  - Stereo panning with controllable left/right balance
 *  - Optional echo (reverb-like) and vibrato for texture
 *
 * Usage:
 *  const hwg = new HarmonicWaveGenerator({
 *    baseFreq: 220,
 *    amplitude: 0.5,
 *    leftVol: 0.6,
 *    rightVol: 0.4,
 *    echo: true,
 *    vibrato: true,
 *    waveType: 'sine'
 *  });
 *
 *  hwg.start();
 *  hwg.stop();
 */

export class HarmonicWaveGenerator {
    /**
     * @param {Object} options - Configuration options
     * @param {number} [options.baseFreq=220] - Base frequency in Hz
     * @param {string} [options.waveType='sine'] - Waveform type ('sine', 'triangle', 'square', 'sawtooth')
     * @param {number} [options.amplitude=0.5] - Master amplitude (0–1)
     * @param {number} [options.leftVol=0.5] - Left channel volume (0–1)
     * @param {number} [options.rightVol=0.5] - Right channel volume (0–1)
     * @param {boolean} [options.echo=false] - Add echo/reverb-like delay
     * @param {boolean} [options.vibrato=false] - Add gentle vibrato modulation
     */
    constructor({
        baseFreq = 220,
        waveType = 'sine',
        amplitude = 0.5,
        leftVol = 0.5,
        rightVol = 0.5,
        echo = false,
        vibrato = false
    } = {}) {
        this.waveType = waveType;
        this.amplitude = amplitude;
        this.leftVol = leftVol;
        this.rightVol = rightVol;
        this.echoEnabled = echo;
        this.vibratoEnabled = vibrato;
        
        // Amplitude and freq ratios for harmonic balance
        this.ampRatios = [1.0, 0.6, 0.4];
        this.freqRatios = [1.0, 1.5, 2.0];

        // --- Create three harmonically related pairs of oscillators ---7
        // pitch each oscillator to the according pan.
        this.oscillators = [
            { "left": new p5.Oscillator(this.waveType), "right": new p5.Oscillator(this.waveType) }, // base
            { "left": new p5.Oscillator(this.waveType), "right": new p5.Oscillator(this.waveType) }, // perfect fifth
            { "left": new p5.Oscillator(this.waveType), "right": new p5.Oscillator(this.waveType) }, // octave
        ];
        for (let i = 0; i < this.freqRatios.length; i++) {
            this.oscillators[i]["left"].pan(-1.);
            this.oscillators[i]["right"].pan(1.);
        }

        // Set their frequencies with the harmonic ratios
        this.updateFreq(baseFreq);

        // Create a master gain node, and stereo controls
        this.masterGain = new p5.Gain();
        this.leftGain = new p5.Gain();
        this.rightGain = new p5.Gain();

        this.masterGain.amp(this.amplitude);
        this.leftGain.amp(this.leftVol);
        this.rightGain.amp(this.rightVol);

        this.leftGain.connect(this.masterGain);
        this.rightGain.connect(this.masterGain);
        this.masterGain.connect();

        // Connect oscillators to the master gain with proportional levels
        this.oscillators.forEach((osc, i) => {
            const leftLevel = new p5.Gain();
            const rightLevel = new p5.Gain();
            leftLevel.amp(this.ampRatios[i]);
            rightLevel.amp(this.ampRatios[i]);

            osc.left.disconnect();
            osc.right.disconnect();
            osc.left.connect(leftLevel);
            osc.right.connect(rightLevel);

            leftLevel.connect(this.leftGain);
            rightLevel.connect(this.rightGain);
        });

        // Optional echo
        this.delay = new p5.Delay();

        //vibrato WIP
        // this.vibrato = new p5.Oscillator('sine');
        // this.vibrato.freq(5); // Vibrato speed (Hz)
        // this.vibrato.amp(10); // Vibrato depth (Hz)
        // this.vibrato.disconnect();
        // this.oscillators.forEach(osc => {
        //     this.vibrato.connect(osc.left.freq);
        //     this.vibrato.connect(osc.right.freq);
        // });
        // if (this.vibratoEnabled) {
        //     this.vibrato.start();
        // }
    }
    updateFreq(baseFreq) {
        this.baseFreq = baseFreq;
        for (let i = 0; i < this.freqRatios.length; i++) {
            this.oscillators[i]["left"].freq(this.baseFreq * this.freqRatios[i] * (1 + random(-0.002, 0.002)));
            this.oscillators[i]["right"].freq(this.baseFreq * this.freqRatios[i] * (1 + random(-0.002, 0.002)));
        }
    }
    updateWaveType(waveType) {
        this.waveType = waveType;
        this.oscillators.forEach(osc => {
            osc.left.setType(waveType);
            osc.right.setType(waveType);
        });
    }
    toggleVibrato(on) {
        if (on) {
            // this.vibrato.start();
        } else {
            // this.vibrato.stop();
        }
    }
    toggleEcho(on) {
        if (on) {
            this.delay.process(this.masterGain, 3, 2, 1200);
        } else {
            this.delay.disconnect();
        }
    }

    start() {
        this.oscillators.forEach(osc => { osc["left"].start(); osc["right"].start() });
    }

    /** Stop the harmonic sound */
    stop() {
        this.oscillators.forEach(osc => { osc["left"].stop(); osc["right"].stop() });
        if (this.vibrato) this.vibrato.stop();
    }

    /** Update dynamic parameters (frequency, amplitude, etc.) */
    update(params = {}) {
        if (params.baseFreq) this.updateFreq(params.baseFreq);
        if (params.amplitude) this.masterGain.amp(params.amplitude);
        if (params.leftVol) this.leftGain.amp(params.leftVol);
        if (params.rightVol) this.rightGain.amp(params.rightVol);
        if (params.waveType) this.updateWaveType(params.waveType);
        if (params.echo != undefined) this.toggleEcho(params.echo);
        if (params.vibrato != undefined) this.toggleVibrato(params.vibrato);
    }
}
