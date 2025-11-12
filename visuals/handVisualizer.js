import { HarmonicWaveGenerator } from "../music/musicModule.js";

let hands;
let video;
let cameraMP;
let generator = null;
let handData = [];
let zScale = null;
let videoReady = false;

export async function startHandVisualizer() {
    createCanvas(640, 480);

    // === Crea un elemento de video nativo (sin p5) ===
    //videoElement = document.createElement("video");
    //videoElement.width = width;
    //videoElement.height = height;
    //videoElement.style.display = "none"; // oculto
    //document.body.appendChild(videoElement);
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();
    // === Configurar MediaPipe Hands ===
    hands = new Hands({
        locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    // === Iniciar cámara de MediaPipe ===
    cameraMP = new Camera(video.elt, {
        onFrame: async () => {
            videoReady = true;
            await hands.send({ image: video.elt });
        },
        width: width,
        height: height,
    });

    try {
        await cameraMP.start();
        console.log("✅ Cámara iniciada correctamente");
    } catch (e) {
        console.error("❌ Error al iniciar la cámara:", e);
    }

    //userStartAudio();
    createGenerator();
    if (generator) generator.start();
}

// === CALLBACK DE MEDIAPIPE ===
function onResults(results) {
    handData = results.multiHandLandmarks || [];
}

// === DIBUJO PRINCIPAL ===
window.draw = function draw() {
    background(255);

    if (video?.loadedmetadata) {
        image(video, 0, 0, width, height);
    }

    if (handData.length > 0) drawHands();
};

// === GENERADOR DE SONIDO ===
function createGenerator() {
    if (generator) generator.stop();
    generator = new HarmonicWaveGenerator(getParams());
}

function updateGenerator(params) {
    if (generator) generator.update(params);
}

// === FUNCIONES DE DIBUJO ===
function drawHands() {
    stroke(0, 0, 255);
    strokeWeight(3);

    const fingerIndices = {
        thumb: [1, 2, 3, 4],
        index: [5, 6, 7, 8],
        middle: [9, 10, 11, 12],
        ring: [13, 14, 15, 16],
        pinky: [17, 18, 19, 20],
    };

    for (const hand of handData) {
        for (const indices of Object.values(fingerIndices)) drawFinger(hand, indices);

        noStroke();
        fill(80, 50, 0);
        for (const pt of hand) {
            circle(pt.x * width, pt.y * height, 8);
        }
    }

    drawHandDistance();
}

function drawFinger(hand, indexes) {
    stroke(80, 50, 0);
    noFill();
    beginShape();
    for (const i of indexes) {
        const p = hand[i];
        vertex(p.x * width, p.y * height);
    }
    endShape();
}

function drawHandDistance() {
    if (handData.length < 2) return;
    const params = {};

    fill(90, 255, 100);
    stroke(90, 255, 100);

    const wrist1 = handData[0][0];
    const wrist2 = handData[1][0];

    const c1 = handCenter(handData[0]);
    const c2 = handCenter(handData[1]);
    circle(c1.x, c1.y, 20);
    circle(c2.x, c2.y, 20);

    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const z1 = wrist1.z;
    const z2 = wrist2.z;

    if (zScale === null) {
        const dz = Math.abs(z1 - z2);
        zScale = dz > 0 ? 100 / dz : 1;
    }

    const distance = Math.sqrt(dx * dx + dy * dy);
    const freq = map(distance, 0, 700, 20, 280);
    const amp = distance * 0.1;

    params.baseFreq = freq;
    params.amplitude = 1;
    updateGenerator(params);

    drawWave(c1, c2, amp, distance);

    textSize(24);
    textAlign(CENTER);
    text(`${Math.round(distance)} px 3D`, (c1.x + c2.x) / 2, (c1.y + c2.y) / 2 - 15);
}

function handCenter(hand) {
    let sx = 0,
        sy = 0;
    for (let i = 0; i < hand.length; i++) {
        sx += hand[i].x * width;
        sy += hand[i].y * height;
    }
    return { x: sx / hand.length, y: sy / hand.length };
}

function drawWave(c1, c2, amp, distance) {
    const steps = 40;
    const t = frameCount * 0.1;
    const frequency = map(distance, 0, 700, 0.1, 1);
    const vx = (c2.x - c1.x) / steps;
    const vy = (c2.y - c1.y) / steps;
    const px = -vy;
    const py = vx;
    const plen = sqrt(px * px + py * py);
    const nx = px / plen;
    const ny = py / plen;

    noFill();
    beginShape();
    for (let i = 0; i <= steps; i++) {
        const x = c1.x + vx * i;
        const y = c1.y + vy * i;
        const dampFactor = sin((i / steps) * PI);
        const w = sin(i * frequency + t) * amp * dampFactor;
        vertex(x + nx * w, y + ny * w);
    }
    endShape();
}

function getParams() {
    return { baseFreq: 220, amplitude: 1, rightVol: 1, leftVol: 1, waveType: 'sawtooth', echo: false, vibrato: false};
}
