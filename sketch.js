let video;
let hands;
let handData = [];

let osc;

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

    // Inicializar oscilador
    osc = new p5.Oscillator('sine');
    osc.start();
    osc.amp(0.05); // empieza en silencio
    userStartAudio();
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
    for (let i = 0; i < handData.length; i++) {
        let hand = handData[i];

        // Dibujar dedos
        for (let f = 0; f < fingers.length; f++) {
            let finger = fingers[f];
            let localParts = [];
            for (let j = 0; j < fingerParts.length; j++) {
                // Mapear landmark a dedos (MediaPipe tiene indices fijos)
                let index = fingerLandmarkIndex(finger, j);
                if (index !== null) {
                    let point = hand[index];
                    localParts[j] = { x: point.x * width, y: point.y * height };
                }
            }
            if (localParts.length === 4) {
                for (let j = 0; j < 3; j++) {
                    line(localParts[j].x, localParts[j].y, localParts[j + 1].x, localParts[j + 1].y);
                }
            }
        }
    }

    // Dibujar distancia entre muñecas si hay 2 manos
    drawHandDistance();
}

// Mapeo de dedos a índices MediaPipe
function fingerLandmarkIndex(finger, part) {
    const map = {
        thumb: ["_mcp", "_ip", "_tip", null],
        index_finger: ["_mcp", "_pip", "_dip", "_tip"],
        middle_finger: ["_mcp", "_pip", "_dip", "_tip"],
        ring_finger: ["_mcp", "_pip", "_dip", "_tip"],
        pinky_finger: ["_mcp", "_pip", "_dip", "_tip"]
    };

    const baseIndex = {
        thumb_mcp: 1,
        thumb_ip: 2,
        thumb_tip: 4,
        index_finger_mcp: 5,
        index_finger_pip: 6,
        index_finger_dip: 7,
        index_finger_tip: 8,
        middle_finger_mcp: 9,
        middle_finger_pip: 10,
        middle_finger_dip: 11,
        middle_finger_tip: 12,
        ring_finger_mcp: 13,
        ring_finger_pip: 14,
        ring_finger_dip: 15,
        ring_finger_tip: 16,
        pinky_finger_mcp: 17,
        pinky_finger_pip: 18,
        pinky_finger_dip: 19,
        pinky_finger_tip: 20
    };

    return baseIndex[finger + part] !== undefined ? baseIndex[finger + part] : null;
}

// Dibuja línea entre muñecas y círculos escalados según Z
function drawHandDistance() {
    if (handData.length >= 2) {
        const wrist1 = handData[0][0];
        const wrist2 = handData[1][0];

        // Calibrar Z la primera vez

        c1 = handCenter(handData[0]);
        c2 = handCenter(handData[1]);
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

        osc.freq(freq);
        osc.amp(amp, 0.1);

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
        fill(0);
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
    stroke(0);
    beginShape();
    for (let i = 0; i <= steps; i++) {
        //const frequency = 0.1 + distance * 0.01; // frecuencia crece linealmente con la distancia
        const x = c1.x + vx * i;
        const y = c1.y + vy * i;
        const w = sin(i * frequency + t) * amp;
        vertex(x + nx * w, y + ny * w);
    }
    endShape();
}
