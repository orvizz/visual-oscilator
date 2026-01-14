export class HandVisualizer {
    constructor(options = {}) {
        this.onHandDataUpdate = options.onHandDataUpdate || null;

        this.hands = null;
        this.video = null;
        this.cameraMP = null;
        this.mirrorImageCanvas=null;
        this.handData = [];
        this.zScale = null;
        this.videoReady = false;

        this.noHandFrameCount = 0;
        this.noHandThreshold = 5;

        this.currentWaveType = 'saw';

        this.canvasSize = { width: window.innerWidth * 0.7, height: window.innerHeight * 0.8 };
    }

    /**
     * Initialize and start the hand visualizer
     */
    async start() {
        createCanvas(this.canvasSize.width, this.canvasSize.height);

        // Create video capture
        this.video = createCapture(VIDEO);
        this.video.elt.style.transform = "scaleX(-1)";
        this.video.size(width, height);
        this.video.hide();
        
        this.mirrorImageCanvas = createGraphics(width, height);

        // Configure MediaPipe Hands
        this.hands = new Hands({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        this.hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        this.hands.onResults(this.onResults.bind(this));

        // Start MediaPipe camera
        this.cameraMP = new Camera(this.video.elt, {
            onFrame: async () => {
                this.videoReady = true;
                this.mirrorImageCanvas.push();
                this.mirrorImageCanvas.scale(-1, 1);
                this.mirrorImageCanvas.image(this.video, -width, 0, width, height);
                this.mirrorImageCanvas.pop();
                await this.hands.send({ image: this.mirrorImageCanvas.elt });
            },
            width: width,
            height: height,
        });

        try {
            await this.cameraMP.start();
        } catch (e) {
            console.error("Error starting camera:", e);
        }

        // Set up p5.js draw loop
        window.draw = this.draw.bind(this);
    }
    setFrequency(freq) {
        this.currentFreq = freq;
    }

    setAmplitude(amp) {
        this.currentAmp = amp;
    }

    setWaveType(waveType) {
        this.currentWaveType = waveType;
    }
    /**
     * Stop the visualizer
     */
    stop() {
        if (this.cameraMP) this.cameraMP.stop();
        if (this.video) this.video.remove();
        if (this.mirrorImageCanvas) this.mirrorImageCanvas.remove();
    }

    /**
     * MediaPipe callback for hand detection results
     */
    onResults(results) {
        this.handData = results.multiHandLandmarks || [];
    }

    /**
     * Main draw loop (called by p5.js)
     */
    draw() {
        // Fondo con estela
        noStroke();
        fill(0, 30); // negro con alpha
        rect(0, 0, width, height);

        if (this.video?.loadedmetadata) {
            image(this.mirrorImageCanvas, 0, 0, width, height);
        }

        if (this.handData.length > 0) {
            this.drawHands();
        }
    }


    /**
     * Draw detected hands and their features
     */
    drawHands() {
        const fingerIndices = {
            thumb: [1, 2, 3, 4],
            index: [5, 6, 7, 8],
            middle: [9, 10, 11, 12],
            ring: [13, 14, 15, 16],
            pinky: [17, 18, 19, 20],
        };

        // Dibujar cada mano
        for (const hand of this.handData) {

            // Dedos
            for (const indices of Object.values(fingerIndices)) {
                this.drawFinger(hand, indices);
            }

            // Puntos de la mano (landmarks)
            noStroke();
            fill(255, 200);
            for (const pt of hand) {
                circle(pt.x * width, pt.y * height, 6);
            }
        }

        // Si hay dos manos, dibujar relación entre ellas
        if (this.handData.length >= 2) {
            this.noHandFrameCount = 0;
            this.drawHandDistance();
        } else {
            this.noHandFrameCount++;
            if (this.noHandFrameCount >= this.noHandThreshold) {
                this.noHandFrameCount = this.noHandThreshold;
                if (this.onHandDataUpdate) {
                    this.onHandDataUpdate({ distance: 0 });
                }
            }
        }
    }


    /**
     * Draw a single finger
     */
    drawFinger(hand, indexes) {
        stroke(255, 120);
        strokeWeight(2);
        noFill();

        beginShape();
        for (const i of indexes) {
            const p = hand[i];
            vertex(p.x * width, p.y * height);
        }
        endShape();
    }


    /**
     * Draw distance visualization between two hands and notify callback
     */
    drawHandDistance() {
        if (this.handData.length < 2) return;

        const hand1 = this.handData[0];
        const hand2 = this.handData[1];

        const c1 = this.handCenter(hand1, hand1[0], hand1[9]);
        const c2 = this.handCenter(hand2, hand2[0], hand2[9]);

        // Altura normalizada (0 = abajo, 1 = arriba)
        const leftHeight  = 1 - (c1.y / height);
        const rightHeight = 1 - (c2.y / height);

        // Diferencia de alturas
        let heightDiff = rightHeight - leftHeight;

        /// zona muerta (anti-jitter)
        const deadZone = 0.04;
        if (abs(heightDiff) < deadZone) heightDiff = 0;

        // curva no lineal (más intención = más efecto)
        const curved = pow(abs(heightDiff), 1.5) * Math.sign(heightDiff);

        // rango expandido
        this.wavePeakPos = constrain(
            0.5 + curved * 0.55,
            0.08,
            0.92
        );

        const dx = c1.x - c2.x;
        const dy = c1.y - c2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const midX = (c1.x + c2.x) / 2;
        const midY = (c1.y + c2.y) / 2;

        // ──────────────────────────────────────────────
        // Parámetros dinámicos
        // ──────────────────────────────────────────────
        const hue = map(this.currentFreq || 220, 55, 1046, 200, 340);
        colorMode(HSB, 360, 100, 100, 100);

        const energy = map(distance, 50, width * 0.7, 1.3, 0.5); // más energía cerca

        // ★★★ Clave: amplitud visual ligada al volumen real ★★★
        const volumeFactor = this.currentAmp || 0.5;           // 0.0 → 1.0 (o más si lo permites)
        const baseWaveAmp = 15 + (volumeFactor * 60);          // 15–75 px aprox
        const distanceFactor = map(distance, 40, width * 0.6, 1.4, 0.6);
        
        const waveAmp = baseWaveAmp * distanceFactor * energy; // combinación final

        const pulseSpeed = map(this.currentFreq || 220, 55, 1046, 0.06, 0.16);
        const pulse = sin(frameCount * pulseSpeed) * 5 + 16;

        // ──────────────────────────────────────────────
        // 1. Onda principal (ahora sí responde al volumen)
        // ──────────────────────────────────────────────
        const waveThickness = map(volumeFactor, 0, 1, 1.8, 3) * energy;

        drawingContext.shadowBlur = 30;
        drawingContext.shadowColor = color(hue, 90, 85, 55);

        noFill();
        stroke(hue, 75, 95, 50);
        strokeWeight(waveThickness * 2.5);
        this.drawWaveShape(c1, c2, waveAmp * 1.3, distance);

        stroke(hue, 95, 100, 90);
        strokeWeight(waveThickness);
        this.drawWaveShape(c1, c2, waveAmp, distance);

        drawingContext.shadowBlur = 0;

        // ──────────────────────────────────────────────
        // 2. Línea base sutil (opcional)
        // ──────────────────────────────────────────────
        stroke(hue, 80, 60, 35);
        strokeWeight(1.5);
        line(c1.x, c1.y, c2.x, c2.y);

        // ──────────────────────────────────────────────
        // 3. Nodos más discretos
        // ──────────────────────────────────────────────
        noStroke();
        fill(hue, 90, 100, 75);
        circle(c1.x, c1.y, pulse * 1.6);
        circle(c2.x, c2.y, pulse * 1.6);

        fill(360, 8, 100);
        circle(c1.x, c1.y, 14);
        circle(c2.x, c2.y, 14);

        // ──────────────────────────────────────────────
        // 4. Texto pequeño (opcional, puedes quitarlo si molesta)
        // ──────────────────────────────────────────────
        const textY = midY - 50 - (distance * 0.25);

        drawingContext.shadowBlur = 10;
        drawingContext.shadowColor = color(hue, 90, 100);

        fill(hue, 80, 100);
        textSize(18);
        textAlign(CENTER);
        text(`${Math.round(distance)} px`, midX, textY);

        drawingContext.shadowBlur = 0;
        colorMode(RGB);

        // Callback
        if (this.onHandDataUpdate) {
            this.onHandDataUpdate({
                distance: distance,
                center1: c1,
                center2: c2,
                wrist1: hand1[0],
                wrist2: hand2[0]
            });
        }
    }
    
    /**
     * Calculate the center point of a hand
     */
    handCenter(hand, wrist, ringMCP) {
        const x = (wrist.x + ringMCP.x) * 0.5 * width;
        const y = (wrist.y + ringMCP.y) * 0.45 * height;
        return { x, y };
    }

    /**
     * Draw a wave visualization between two points
     */

    drawWave(c1, c2, amp, distance) {
        const steps = 1000;
        const t = frameCount * 0.01; // animation speed
        const vx = (c2.x - c1.x) / steps;
        const vy = (c2.y - c1.y) / steps;

        // perpendicular vector
        const px = -vy;
        const py = vx;
        const plen = sqrt(px * px + py * py);
        const nx = px / plen;
        const ny = py / plen;

        // more cycles when hands are close, fewer when far
        const numCycles = map(this.currentFreq, 20, 280, 1, 12);
        const waveLength = steps / numCycles;

        noFill();

        // Color dinámico según frecuencia
        const hue = map(this.currentFreq || 100, 50, 1200, 180, 360);
        colorMode(HSB, 360, 100, 100, 100);

        // Glow
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = color(hue, 80, 100, 80);

        // Aura externa
        stroke(hue, 60, 100, 30);
        strokeWeight(10);
        this.drawWaveShape(c1, c2, amp * 1.1, distance);

        // Núcleo
        stroke(hue, 90, 100, 90);
        strokeWeight(2.5);
        this.drawWaveShape(c1, c2, amp, distance);

        
        drawingContext.shadowBlur = 0;
        colorMode(RGB, 255);

        endShape();
    }

    drawWaveShape(c1, c2, amp, distance) {
        const peakBias = (this.wavePeakPos - 0.5) * 2;
        const steps = 1000;
        const t = frameCount * 0.02;

        const vx = (c2.x - c1.x) / steps;
        const vy = (c2.y - c1.y) / steps;

        const px = -vy;
        const py = vx;
        const plen = sqrt(px * px + py * py);
        const nx = px / plen;
        const ny = py / plen;

        const numCycles = map(this.currentFreq || 100, 50, 1200, 1, 12);
        const waveLength = steps / numCycles;

        // 🔑 posición del máximo (0..1)
        const peakPos = this.wavePeakPos ?? 0.5;

        noFill();
        beginShape();
        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;

            const x = c1.x + vx * i;
            const y = c1.y + vy * i;

            const phase = (i / waveLength) * TWO_PI + t;

            // ───────────────────────────────
            // Envelope DESPLAZADO
            // ───────────────────────────────
            let damp;
            if (progress < peakPos) {
                damp = sin((progress / peakPos) * HALF_PI);
            } else {
                damp = sin(((1 - progress) / (1 - peakPos)) * HALF_PI);
            }

            const sideBoost = 1 + abs(peakBias) * 0.6;
            const w = sin(phase) * amp * damp * sideBoost;

            vertex(x + nx * w, y + ny * w);
        }
        endShape();
    }



    customHarmonic(phase) {
        // Timbre “dulce”: fundamental + 2º + 3º + 5º parcial
        return (
            1.0 * sin(phase) +          // fundamental
            0.5 * sin(phase * 2) +      // octava
            0.33 * sin(phase * 3) +     // quinta
            0.2 * sin(phase * 5)        // tercera mayor añadida
        ) / (1.0 + 0.5 + 0.33 + 0.2); // normalizar
    }

}
