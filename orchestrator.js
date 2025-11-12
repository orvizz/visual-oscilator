import { HandVisualizer } from "./visuals/handVisualizer.js";
import { HarmonicWaveGenerator } from "./music/musicModule.js";

let visualizer = null;
let generator = null;
let soundOff=true;

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

    // Map distance to frequency and amplitude
    const freq = map(distance, 0, 700, 20, 280);
    const amp = 1; // Keep amplitude constant or adjust as needed

    // Update the music generator
    generator.update({
        baseFreq: freq,
        amplitude: amp
    });
}

/**
 * Helper function for mapping values (if not using p5.js globally)
 */
function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}