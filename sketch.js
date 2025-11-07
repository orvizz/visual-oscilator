
import { HarmonicWaveGenerator } from "./musicModule";

let video;
let hands;
let handData = [];
let generator = null;

let fingers = ["thumb", "index_finger", "middle_finger", "ring_finger", "pinky_finger"];
let fingerParts = ["_mcp", "_pip", "_dip", "_tip"];

let zScale = null;

function setup() {
    createCanvas(640, 480);

    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    // Inicializamos MediaPipe Hands
    hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    const cameraMP = new Camera(video.elt, {
        onFrame: async () => {
            await hands.send({ image: video.elt });
        },
        width: width,
        height: height
    });

    cameraMP.start();

    strokeWeight(5);
    userStartAudio();
    createGenerator();
    if(generator) generator.start();
}

function createGenerator() {
    if (generator) generator.stop();
    generator = new HarmonicWaveGenerator(getParams());
}

function updateGenerator(params) {
    if (!generator) return;
    generator.update(params);
}

function onResults(results) {
    handData = results.multiHandLandmarks || [];
}

function draw() {
    background(255);
    image(video, 0, 0, width, height);

    if (handData.length > 0) {
        drawHands();
    }
}

// Dibuja dedos y líneas
function drawHands() {
    stroke(0, 0, 255);
    strokeWeight(3);

    // Define finger landmark indices once
    const fingerIndices = {
        thumb: [1, 2, 3, 4],
        index: [5, 6, 7, 8],
        middle: [9, 10, 11, 12],
        ring: [13, 14, 15, 16],
        pinky: [17, 18, 19, 20]
    };

    // Loop through detected hands
    for (const hand of handData) {
        // Draw each finger
        for (const indices of Object.values(fingerIndices)) {
            drawFinger(hand, indices);
        }

        // Draw landmarks (red dots)
        noStroke();
        fill(80, 50, 0);
        for (const pt of hand) {
            circle(pt.x * width, pt.y * height, 8);
        }
    }

    // Draw distance if 2 hands are detected
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

// Dibuja línea entre muñecas y círculos escalados según Z
function drawHandDistance() {
    params = {};
    if (handData.length >= 2) {
        fill(90,255,100);
        stroke(90,255,100);
        const wrist1 = handData[0][0];
        const wrist2 = handData[1][0];

        // Calibrar Z la primera vez

        c1 = handCenter(handData[0]);
        c2 = handCenter(handData[1]);
        circle(c1["x"],c1["y"],20);
        circle(c2["x"],c2["y"],20);
        const x1 = wrist1.x * width;
        const y1 = wrist1.y * height;
        const x2 = wrist2.x * width;
        const y2 = wrist2.y * height;

        const dx = c1.x - c2.x;
        const dy = c1.y - c2.y;
        const z1 = wrist1.z;
        const z2 = wrist2.z;

        if (zScale === null) {
            // Queremos que la diferencia de Z entre manos cercanas equivalga a ~100 pixeles
            const dz = abs(z1 - z2);
            zScale = dz > 0 ? 100 / dz : 1;
        }

        const dz = Math.abs(z1 - z2) * zScale;
        const distance = sqrt(dx * dx + dy * dy);
        const freq = map(distance, 0, 700, 0.1, 1);
        const amp = distance * 0.1; // volumen

        params["baseFreq"] = freq * 220; // frecuencia base
        params["amplitude"] = constrain(amp * 0.001, 0, 0.5); // amplitud
        updateGenerator(params);

        drawWave(c1, c2, amp, distance)


        // Línea entre muñecas
        // stroke(0, 0, 255);
        // strokeWeight(4);
        // line(x1, y1, x2, y2);

        // Círculos escalados según profundidad
        // noStroke();
        // fill(0, 0, 255);
        //circle(x1, y1, max(10, 100 / (1 + abs(z1) * zScale)));
        //circle(x2, y2, max(10, 100 / (1 + abs(z2) * zScale)));

        // Mostrar distancia
        textSize(24);
        textAlign(CENTER);
        text(Math.round(distance) + " px 3D", (x1 + x2) / 2, (y1 + y2) / 2 - 15);
    }
}


function handCenter(hand) {
    let sx = 0, sy = 0;
    for (let i = 0; i < hand.length; i++) {
        sx += hand[i].x * width;
        sy += hand[i].y * height;
    }
    return { x: sx / hand.length, y: sy / hand.length };
}

function drawWave(c1, c2, amp, distance) {
    const steps = 40;
    const t = frameCount * 0.1; // animación tiempo
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
        //const frequency = 0.1 + distance * 0.01; // frecuencia crece linealmente con la distancia
        const x = c1.x + vx * i;
        const y = c1.y + vy * i;
        const dampFactor = sin((i / steps) * PI);// reduce los bordes
        const w = sin(i * frequency + t) * amp * dampFactor;
        vertex(x + nx * w, y + ny * w);
    }
    endShape();
}
