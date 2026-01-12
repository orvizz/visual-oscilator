/**
 * HarmonicWaveGenerator.js
 * ------------------------
 * A JavaScript module using the p5.sound library to generate harmonically rich but pleasant sounds.
 *
 * Features:
 *  - Generates multiple harmonically related oscillators based on the harmonic series
 *  - Smooth amplitude control that preserves harmonic balance
 *  - Stereo panning with controllable left/right balance
 *  - Optional echo (delay) and vibrato for texture
 *  - Optimized for real-time gesture control
 *
 * Usage:
 *  const hwg = new HarmonicWaveGenerator({
 *    baseFreq: 220,
 *    amplitude: 0.5,
 *    pan: 0,
 *    echo: true,
 *    vibrato: true,
 *    waveType: 'sine'
 *  });
 *
 *  hwg.start();
 *  // In draw loop:
 *  hwg.update({ baseFreq: 440, pan: 0.5 });
 *  hwg.stop();
 */

export class HarmonicWaveGenerator {
    /**
     * @param {Object} options - Configuration options
     * @param {number} [options.baseFreq=220] - Base frequency in Hz
     * @param {string} [options.waveType='sine'] - Waveform type ('sine', 'triangle', 'square', 'sawtooth')
     * @param {number} [options.amplitude=0.5] - Master amplitude (0–1)
     * @param {number} [options.pan=0] - Stereo pan position (-1 to 1, 0=center)
     * @param {boolean} [options.echo=false] - Add echo/delay effect
     * @param {boolean} [options.vibrato=false] - Add gentle vibrato modulation
     * @param {number} [options.numHarmonics=5] - Number of harmonics to generate (1-8)
     */
    constructor({
        baseFreq = 220,
        amplitude = 0.5,
        pan = 0,
        echo = false,
        vibrato = false,
        numHarmonics = 5
    } = {}) {
        this.amplitude = amplitude;
        this.pan = pan;
        this.echoEnabled = echo;
        this.vibratoEnabled = vibrato;
        this.baseFreq = baseFreq;
        
        // Clamp number of harmonics to reasonable range
        this.numHarmonics = Math.max(1, Math.min(8, numHarmonics));
        
        // Define harmonic series with amplitude rolloff for pleasant sound
        // Using overtone series: f, 2f, 3f, 4f, 5f, 6f, 7f, 8f
        // With decreasing amplitudes for natural timbre
        this.harmonicData = [
            { ratio: 1.0, amp: 1.0 },    // Fundamental
            { ratio: 2.0, amp: 0.5 },    // Octave
            { ratio: 3.0, amp: 0.33 },   // Perfect fifth above octave
            { ratio: 4.0, amp: 0.25 },   // Two octaves
            { ratio: 5.0, amp: 0.2 },    // Major third above two octaves
            { ratio: 6.0, amp: 0.17 },   // Perfect fifth above two octaves
            { ratio: 7.0, amp: 0.14 },   // Minor seventh (adds character)
            { ratio: 8.0, amp: 0.125 }   // Three octaves
        ].slice(0, this.numHarmonics);

        // Create oscillators for each harmonic
        this.oscillators = [];
        this.harmonicGains = [];
        
        for (let i = 0; i < this.numHarmonics; i++) {
            const osc = new p5.Oscillator('sine');
            const gain = new p5.Gain();
            
            osc.disconnect();
            osc.freq(this.baseFreq * this.harmonicData[i].ratio);
            gain.amp(this.harmonicData[i].amp);
            
            osc.connect(gain);
            
            this.oscillators.push(osc);
            this.harmonicGains.push(gain);
        }
        //Envelope
        this.envelopePresets = {piano:{att:0.01,dec:0.1,sust:0.5,rel:0.5},pluck:{att:0.001,dec:0.2,sust:0.0,rel:0.2},pad:{att:0.2,dec:1.0,sust:0.7,rel:2.0},lead:{att:0.05,dec:0.1,sust:0.8,rel:0.1}}

        this.envelope = new p5.Envelope();
        this.envelope.setADSR(this.envelopePresets.pad.att, this.envelopePresets.pad.dec,this.envelopePresets.pad.sust, this.envelopePresets.pad.rel); 
        this.envelope.setRange(1.0, 0.0); // Output range from 1.0 (full) to 0.0 (silent)

        // Create master gain and panner
        this.masterGain = new p5.Gain();
        this.panner = new p5.Panner3D();
        
        this.masterGain.amp(0);//always on, but silent. the envelope triggers the sound
        this.envelope.connect(this.masterGain.output.gain);
        this.panner.set(this.pan,0,0);
        
        // Connect harmonics to master gain
        this.harmonicGains.forEach(gain => {
            gain.connect(this.masterGain);
        });
        
        // Master gain -> panner -> output
        this.masterGain.connect(this.panner);
        
        // Optional delay effect
        this.delay = new p5.Delay();
        this.delay.process(this.panner, 0.12, 0.7, 2300);
        this.delay.disconnect(); // Start disconnected
        
        if (this.echoEnabled) {
            this.delay.connect();
        }
        
        // Optional vibrato
        this.vibratoOsc = new p5.Oscillator('sine');
        this.vibratoOsc.freq(5); // 5 Hz vibrato rate
        this.vibratoOsc.amp(8);  // ±8 Hz vibrato depth
        this.vibratoOsc.disconnect();
        
        if (this.vibratoEnabled) {
            this.oscillators.forEach(osc => {
                this.vibratoOsc.connect(osc.freq);
            });
            this.vibratoOsc.start();
        }
    }

    /**
     * Update the base frequency and all harmonics
     * @param {number} baseFreq - New base frequency in Hz
     */
    updateFreq(baseFreq) {
        this.baseFreq = baseFreq;
        for (let i = 0; i < this.oscillators.length; i++) {
            // Use rampTime for smooth transitions during gesture control
            this.oscillators[i].freq(this.baseFreq * this.harmonicData[i].ratio, 0.05);
        }
    }

    /**
     * Update the waveform type for all oscillators
     * @param {string} preset - 'piano', 'pluck', 'pad', or 'lead'
     */
    updatePreset(preset) {
        const p = this.envelopePresets[preset];
        if (p) {
            this.envelope.setADSR(p.att, p.dec, p.sust, p.rel);
        }
    }

    /**
     * Toggle vibrato effect on/off
     * @param {boolean} on - Enable or disable vibrato
     */
    toggleVibrato(on) {
        this.vibratoEnabled = on;
        if (on) {
            if (!this.vibratoOsc.started) {
                this.oscillators.forEach(osc => {
                    this.vibratoOsc.connect(osc.freq);
                });
                this.vibratoOsc.start();
            }
        } else {
            if (this.vibratoOsc.started) {
                this.vibratoOsc.stop();
                this.vibratoOsc.disconnect();
            }
        }
    }

    /**
     * Toggle echo/delay effect on/off
     * @param {boolean} on - Enable or disable echo
     */
    toggleEcho(on) {
        this.echoEnabled = on;
        if (on) {
            this.delay.connect();
        } else {
            this.delay.disconnect();
        }
    }

    // Función para calcular el Master Volume
    calcularMasterVolume(L, R) {
    return (L + R) / 2;
    } 

    /**
     * Start all oscillators
     */
     start() {
        const context = p5.prototype.getAudioContext();
        if (context.state !== 'running') {
            context.resume();
        }
        this.oscillators.forEach(osc => {
            if(!osc.started) osc.start();
        });
        if (this.vibratoOsc && !this.vibratoOsc.started) {
            this.vibratoOsc.start();
        }
        this.envelope.triggerAttack();
        console.log(this)
    }

    /**
     * Stop all oscillators and effects
     */
    stop() {
        this.envelope.triggerRelease();
    }

    /**
     * Update dynamic parameters smoothly for real-time control
     * Call this method every frame with gesture data
     * @param {Object} params - Parameters to update
     * @param {number} [params.baseFreq] - Base frequency in Hz
     * @param {number} [params.amplitude] - Master amplitude (0-1)
     * @param {number} [params.pan] - Stereo pan (-1 to 1)
     * @param {string} [params.waveType] - Waveform type
     * @param {boolean} [params.echo] - Echo effect toggle
     * @param {boolean} [params.vibrato] - Vibrato effect toggle
     */
    update(params = {}) {
        if (params.baseFreq !== undefined) {
            this.updateFreq(params.baseFreq);
        }
        if (params.amplitude !== undefined) {
            this.amplitude = params.amplitude;
            // Smooth amplitude changes with ramp time
            for (let i = 0; i < this.harmonicGains.length; i++) {
                let targetAmp = this.harmonicData[i].amp * this.amplitude;
                this.harmonicGains[i].amp(targetAmp, 0.05);
            }
        }
        if (params.leftVol !== undefined && params.rightVol !== undefined) {
            this.pan = (params.rightVol-params.leftVol)*10000;
            this.panner.positionX(this.pan, 0.05);
        }
        if (params.preset !== undefined) {
            this.updatePreset(params.preset);
        }
        if (params.echo !== undefined) {
            this.toggleEcho(params.echo);
        }
        if (params.vibrato !== undefined) {
            this.toggleVibrato(params.vibrato);
        }
    }
}