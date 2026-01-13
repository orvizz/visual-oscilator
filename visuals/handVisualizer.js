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

        this.currentWaveType = 'sine';

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
        background(255);

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

        // Draw finger lines and landmarks
        for (const hand of this.handData) {
            for (const indices of Object.values(fingerIndices)) {
                this.drawFinger(hand, indices);
            }

            noStroke();
            fill(80, 50, 0);
            for (const pt of hand) {
                circle(pt.x * width, pt.y * height, 8);
            }
        }

        // Draw distance between hands if two hands detected
        if (this.handData.length >= 2) {
            this.noHandFrameCount = 0;
            this.drawHandDistance();
        } else if (this.handData.length >= 0) {// notify no hands on screen
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
        stroke(80, 50, 0);
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
        fill(90, 255, 100);
        stroke(90, 255, 100);

        const wrist1 = this.handData[0][0];
        const wrist2 = this.handData[1][0];

        const c1 = this.handCenter(this.handData[0], wrist1, this.handData[0][13]);
        const c2 = this.handCenter(this.handData[1], wrist2, this.handData[1][13]);

        circle(c1.x, c1.y, 20);
        circle(c2.x, c2.y, 20);

        const dx = c1.x - c2.x;
        const dy = c1.y - c2.y;
        const z1 = wrist1.z;
        const z2 = wrist2.z;

        if (this.zScale === null) {
            const dz = Math.abs(z1 - z2);
            this.zScale = dz > 0 ? 100 / dz : 1;
        }

        const distance = Math.sqrt(dx * dx + dy * dy);

        // Notify the orchestrator of hand data update
        if (this.onHandDataUpdate) {
            this.onHandDataUpdate({
                distance: distance,
                center1: c1,
                center2: c2,
                wrist1: wrist1,
                wrist2: wrist2
            });
        }

        // Visual feedback
        const amp = distance * 0.1;
        this.drawWave(c1, c2, amp, distance);

        // visual text amplitude for debugging 
        textSize(24);
        textAlign(CENTER);
        text(
            `${Math.round(distance)} px 3D`,
            (c1.x + c2.x) / 2,
            (c1.y + c2.y) / 2 - 15
        );
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
        beginShape();
        for (let i = 0; i <= steps; i++) {
            const x = c1.x + vx * i;
            const y = c1.y + vy * i;

            const phase = (i / waveLength) * TWO_PI + t;

            // soft edges for aesthetics
            const dampFactor = sin((i / steps) * PI);

            let w = 0; // wave displacement

            // --------------------------------------
            // SELECT WAVE TYPE
            // --------------------------------------
            switch (this.currentWaveType) {

                case "sine":
                    w = sin(phase) * amp;
                    break;

                case "triangle":
                    // p5 triangle wave formula
                    w = (2 / PI) * asin(sin(phase)) * amp;
                    break;

                case "square":
                    w = (sin(phase) >= 0 ? 1 : -1) * amp;
                    break;

                case "sawtooth":
                    // saw from -1 to 1
                    w = (2 / PI) * (phase % TWO_PI) - 1;
                    w *= amp;
                    break;

                case "custom":
                    // replace this with your own harmonic design
                    w = this.customHarmonic(phase) * amp;
                    break;

                default:
                    // fallback to sine
                    w = sin(phase) * amp;
                    break;
            }

            // apply damping
            w *= dampFactor;

            vertex(x + nx * w, y + ny * w);
        }
        endShape();
    }

    customHarmonic(phase) {
        // A warm harmonic: fundamental + 2nd + 3rd partial
        return (
            1.0 * sin(phase) +
            0.4 * sin(phase * 2) +
            0.2 * sin(phase * 3)
        ) / 1.6; // normalize
    }

}
