export class HandVisualizer {
    constructor(options = {}) {
        this.onHandDataUpdate = options.onHandDataUpdate || null;
        
        this.hands = null;
        this.video = null;
        this.cameraMP = null;
        this.handData = [];
        this.zScale = null;
        this.videoReady = false;

        this.noHandFrameCount = 0;
        this.noHandThreshold = 5; 
    }

    /**
     * Initialize and start the hand visualizer
     */
    async start() {
        createCanvas(640, 480);

        // Create video capture
        this.video = createCapture(VIDEO);
        this.video.size(width, height);
        this.video.hide();

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
                await this.hands.send({ image: this.video.elt });
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

    /**
     * Stop the visualizer
     */
    stop() {
        if (this.cameraMP) this.cameraMP.stop();
        if (this.video) this.video.remove();
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
            image(this.video, 0, 0, width, height);
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
            this.noHandFrameCount=0;
            this.drawHandDistance();
        }else if(this.handData.length>=0){// notify no hands on screen
            this.noHandFrameCount++;
            if (this.noHandFrameCount >= this.noHandThreshold) {
                this.noHandFrameCount = this.noHandThreshold;
                if (this.onHandDataUpdate) {
                    this.onHandDataUpdate({distance: 0});
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

        const c1 = this.handCenter(this.handData[0]);
        const c2 = this.handCenter(this.handData[1]);
        
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
    handCenter(hand) {
        let sx = 0, sy = 0;
        for (let i = 0; i < hand.length; i++) {
            sx += hand[i].x * width;
            sy += hand[i].y * height;
        }
        return { x: sx / hand.length, y: sy / hand.length };
    }

    /**
     * Draw a wave visualization between two points
     */
    drawWave(c1, c2, amp, distance) {
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
}
