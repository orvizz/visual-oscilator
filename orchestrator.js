import { HandVisualizer } from "./visuals/handVisualizer.js";
import { HarmonicWaveGenerator } from "./music/musicModule.js";

let visualizer = null;
let generator = null;
let soundOff=true;
let waveType="sine";
let waveTypes=["sine", "custom", "triangle","square","sawtooth"];
let currentWaveTypeIndex=0;
let preset=0;
/**
 * Initialize and start the hand tracking with audio generation
 */
export async function start() {
    // Create visualizer with callback for hand data updates
    visualizer = new HandVisualizer({
        onHandDataUpdate: handleHandDataUpdate
    });
    
    // Create music generator with default parameters
    generator = new HarmonicWaveGenerator();
    // setInterval(() => {
    //     currentWaveTypeIndex = (currentWaveTypeIndex + 1) % waveTypes.length;
    //     waveType = waveTypes[currentWaveTypeIndex];
    //     generator.update({ waveType: waveType });
    //     visualizer.setWaveType(waveType);
    // }, 5000); // Change wave type every 10 seconds
    await visualizer.start();
}

/**
 * Stop both visualizer and audio generator
 */
export function stop() {
    if (visualizer) visualizer.stop();
    if (generator) generator.stop();
}

/**
 * Handle hand data updates from the visualizer
 * @param {Object} data - Hand tracking data including distance, centers, etc.
 */
function handleHandDataUpdate(data) {
    if (!generator) return;

    const { distance, center1, center2, wrist1, wrist2} = data;
    if (distance==0){
        generator.stop();
        soundOff=true;
        return;
    }else{
        if(soundOff){
            soundOff=false;
            generator.start();
        }
    }

    // Maximum distance based on window size
    const maxDistance = Math.sqrt((window.innerWidth * 0.7) ** 2 + (window.innerHeight * 0.8) ** 2);


    // Map distance to frequency and amplitude
    function mapLog(value, inMin, inMax, outMin, outMax) {
        const norm = (value - inMin) / (inMax - inMin);
        return outMin * Math.pow(outMax / outMin, norm);
    }
    const freq = mapLog(distance, 0, maxDistance, 1046, 55);

    // Optional: clamp frequency just in case
    const clampedFreq = Math.min(Math.max(freq, 20), 2000);

    visualizer.setFrequency(clampedFreq);

    /* =========================
    PAN → LEFT / RIGHT
    ========================= */

     // Altura normalizada → volumen por lado
    const leftVol = center1
        ? 1 - (center1.y / window.innerHeight)
        : 0;

    const rightVol = center2
        ? 1 - (center2.y / window.innerHeight)
        : 0;

    // Clamp de seguridad
    const leftVolClamped = Math.min(Math.max(leftVol, 0), 1);
    const rightVolClamped = Math.min(Math.max(rightVol, 0), 1);

    /* =========================
    AMPLITUD GLOBAL
    Mano más alta gana
    ========================= */

    const amplitude = Math.min(leftVolClamped, rightVolClamped) * 5;
    
    visualizer.setAmplitude(amplitude);
    // Update the music generator
    generator.update({
        baseFreq: freq,
        amplitude: amplitude,
        leftVol: leftVolClamped,
        rightVol: rightVolClamped
    });
}

/**
 * Helper function for mapping values (if not using p5.js globally)
 */
function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}