let video;

let bodyPose;
let poses = [];

let faceMesh;
let faces = [];
let nose;

let handPose;
let hands = [];

let fingers = ["thumb", "index_finger", "middle_finger", "ring_finger", "pinky_finger"];
let fingerParts = ["_mcp", "_pip", "_dip", "_tip"];
tf.ENV.set('WEBGPU_ENABLED', false);


function preload() {
  faceMesh = ml5.faceMesh();
  bodyPose = ml5.bodyPose();
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  //faceMesh.detectStart(video, gotFaces);
  //bodyPose.detectStart(video, gotPoses);
  handPose.detectStart(video, gotHands);

  strokeWeight(5);
}

function draw() {
  background(255);
  
  tint(255, 255, 255, 85);
  image(video, 0, 0, width, height);
  noTint();
  
  if (poses.length>0) {
    drawPoses();
  }

  if (faces.length>0) {
    drawFace();
  }
  
  if (hands.length>0) {
    drawHands();
  }
}

function drawPoses() {
  pose = poses[0];
  
  let left_shoulder = pose.left_shoulder;
  let left_elbow = pose.left_elbow;
  let left_wrist = pose.left_wrist;
  
  strokeWeight(5);
  line(left_shoulder.x,left_shoulder.y,left_elbow.x,left_elbow.y);
  line(left_elbow.x, left_elbow.y, left_wrist.x, left_wrist.y);

  let right_shoulder = pose.right_shoulder;
  let right_elbow = pose.right_elbow;
  let right_wrist = pose.right_wrist;
  
  line(right_shoulder.x,right_shoulder.y,right_elbow.x, right_elbow.y);
  line(right_elbow.x, right_elbow.y, right_wrist.x, right_wrist.y);  
  
  line(right_shoulder.x, right_shoulder.y, left_shoulder.x, left_shoulder.y);
  
  let left_eye = pose.left_eye;
  let right_eye = pose.right_eye;
  let left_hip = pose.left_hip;
  let right_hip = pose.right_hip
  
  line((left_eye.x+right_eye.x)/2, (left_eye.y+right_eye.y)/2, (left_hip.x+right_hip.x)/2, (left_hip.y+right_hip.y)/2);
  
  line(left_hip.x, left_hip.y, right_hip.x, right_hip.y);

  fill(255);
  circle(pose.left_ear.x, pose.left_ear.y, 25);
  circle(pose.right_ear.x, pose.right_ear.y, 25);
  
  if (pose.keypoints[0].name == "nose") {
    nose = pose.keypoints[0];
  }
}

function drawFace() {
  if (faces.length > 0) {
    rectMode(CENTER);

    fill(255);
    
    let faceOval = faces[0].faceOval;
    ellipse(faceOval.centerX, faceOval.centerY, faceOval.width, faceOval.height);

    let lips = faces[0].lips;
    ellipse(lips.centerX, lips.centerY, lips.width, lips.height);
    
    let leftEye = faces[0].leftEye;
    let rightEye = faces[0].rightEye;
    
    ellipse(leftEye.centerX, leftEye.centerY, leftEye.width, leftEye.height);
    ellipse(rightEye.centerX, rightEye.centerY, rightEye.width, rightEye.height);
    
    let leftEyebrow = faces[0].leftEyebrow;
    let rightEyebrow = faces[0].rightEyebrow;
    
    line(leftEyebrow.keypoints[0].x, leftEyebrow.keypoints[0].y, leftEyebrow.keypoints[leftEyebrow.keypoints.length-1].x, leftEyebrow.keypoints[leftEyebrow.keypoints.length-1].y);
    
    line(rightEyebrow.keypoints[0].x, rightEyebrow.keypoints[0].y, rightEyebrow.keypoints[rightEyebrow.keypoints.length-1].x, rightEyebrow.keypoints[rightEyebrow.keypoints.length-1].y);
  }
  
  fill(255, 0, 0);
  circle(nose.x, nose.y, 40);
}

function drawHands() {
  for (let i=0; i<hands.length; i++) {
    let hand = hands[i];
    
    //ellipse(hand.wrist.x,hand.wrist.y, 50,50);
    
    for (let finger of fingers) {
      let localParts = [];
      let totalParts = 0;
      for (let j=0; j<fingerParts.length; j++) {
        let element = "hand." + finger + fingerParts[j];
        element = eval(element);
        if (element != undefined) {
          localParts[j] = element;
          totalParts++;
        }
      }
      if (totalParts==4) {
        for (let j=0; j<3; j++) {
          line(localParts[j].x, localParts[j].y, localParts[j+1].x, localParts[j+1].y);
        }
      } else if (finger=="thumb") {
        line(localParts[0].x, localParts[0].y, localParts[3].x, localParts[3].y);
      }
    }
  }
  drawHandDistance();
}

function drawHandDistance() {
  if (hands.length >= 2) {
    let hand1 = hands[0];
    let hand2 = hands[1];

    // Coordenadas de las muñecas
    let x1 = hand1.wrist.x;
    let y1 = hand1.wrist.y;
    let x2 = hand2.wrist.x;
    let y2 = hand2.wrist.y;

    // Distancia euclídea en píxeles
    let dx = x1 - x2;
    let dy = y1 - y2;
    let distance = Math.sqrt(dx*dx + dy*dy);

    // Estimar “tamaño” de la mano (ancho aproximado)
    let width1 = Math.abs(hand1.thumb_mcp.x - hand1.pinky_finger_mcp.x);
    let width2 = Math.abs(hand2.thumb_mcp.x - hand2.pinky_finger_mcp.x);

    // Factor de escala relativo a una referencia
    let referenceWidth = 100;
    let scale1 = referenceWidth / width1;
    let scale2 = referenceWidth / width2;

    // Dibujar línea entre muñecas
    stroke(0, 0, 255);
    strokeWeight(4);
    line(x1, y1, x2, y2);

    // Dibujar círculos en las muñecas escalados según distancia (Y aproximada)
    noStroke();
    fill(0, 0, 255);
    let radius1 = 50 / scale1; // más lejos → círculo más pequeño
    let radius2 = 50 / scale2;
    circle(x1, y1, radius1);
    circle(x2, y2, radius2);

    // Mostrar distancia en pantalla
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text(Math.round(distance) + " px", (x1 + x2) / 2, (y1 + y2) / 2 - 15);
  }
}



function gotFaces(results) {
  faces = results;
}

function gotPoses(results) {
  poses = results;
}

function gotHands(results) {
  hands = results;
}