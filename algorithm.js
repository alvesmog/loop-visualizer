let mainCanvas = document.getElementById("canvas");
let mainContext = mainCanvas.getContext("2d");

let canvasWidth = mainCanvas.width;
let canvasHeight = mainCanvas.height;

//Array que contém todos os circulos criados
let circles = new Array();

function Circle(
  angle,
  sign,
  radius,
  rotationRadius,
  initialX,
  initialY,
  firstLoop
) {
  this.angle = angle;
  this.sign = sign;
  this.radius = radius;
  this.rotationRadius = rotationRadius;
  this.initialX = initialX;
  this.initialY = initialY;
  this.incrementer = 0.02;
  this.firstLoop = firstLoop;
}

let loops = new Array();

function Loop(x, y, radius) {
  this.sAngle = 0;
  this.eAngle = 2 * Math.PI;
  this.x = x;
  this.y = y;
  this.radius = radius;
}

window.onload = () => {
  document.getElementById("addCircle").addEventListener("click", function () {
    addLoop();
  });
  document.getElementById("start").addEventListener("click", function () {
    let finalValue = document.getElementById("finalValue");
    start();
  });
};

function addLoop() {
  console.log("Chamou Add Loop");

  let x, y, radius;

  //Check how many loops we have already
  //If it's zero, use default atributes
  //If it's not zero, calculate the atributes based on the last loop in the loops array

  if (loops.length != 0 && loops.length < 6) {
    console.log(loops.length);
    let lastLoopRadius = loops[loops.length - 1].radius;
    let lastLoopY = loops[loops.length - 1].y;
    let lastLoopX = loops[loops.length - 1].x;

    radius = (2 * lastLoopRadius) / 3;
    x = lastLoopX + lastLoopRadius + radius;
    y = lastLoopY;
    createAndDrawLoop();
  } else if (loops.length === 0) {
    console.log(loops.length);
    //Use default values
    x = 250;
    y = 300;
    radius = 200;
    createAndDrawLoop();
  }

  function createAndDrawLoop() {
    // Create the Loop object
    let loop = new Loop(x, y, radius);
    loops.push(loop);
    //Create the circle that represents the loop
    createCircle(loop);
    //Draw loops on screen again
    drawLoops(loop);
    drawCircles();
  }
}

function drawLoops() {
  mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
  for (loop in loops) {
    parseInt(loop);
    mainContext.fillStyle = "rgba(255, 255, 255, 0.1)";
    mainContext.beginPath();
    mainContext.arc(
      loops[loop].x,
      loops[loop].y,
      loops[loop].radius,
      loops[loop].sAngle,
      loops[loop].eAngle
    );
    mainContext.stroke();
  }
  mainContext.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawCircles() {
  let loopsRadius = new Array();

  for (loop in loops) {
    loopsRadius.push(loops[loop].radius);
  }

  for (circle in circles) {
    console.log(circle);

    if (circle === "0") {
      initialX = circles[circle].initialX;
      initialY = circles[circle].initialY - loopsRadius[parseInt(circle)];
    } else {
      initialX = circles[circle].initialX - loopsRadius[parseInt(circle)];
      initialY = circles[circle].initialY;
    }

    mainContext.beginPath();
    mainContext.arc(
      initialX,
      initialY,
      circles[circle].radius,
      0,
      Math.PI * 2,
      false
    );
    mainContext.closePath();
    mainContext.fillStyle = "rgba(177, 0, 129, .5)";
    mainContext.fill();
  }
}

function keepCircles() {
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];
    mainContext.beginPath();
    mainContext.arc(
      circle.currentX,
      circle.currentY,
      circle.radius,
      0,
      Math.PI * 2,
      false
    );
    mainContext.closePath();
    mainContext.fillStyle = "rgba(80, 50, 129, .8)";
    mainContext.fill();
  }
}

function start(finalValue) {
  console.log("Chamou Start");
  requestAnimationFrame(draw);
}

Circle.prototype.update = function () {
  this.angle += this.incrementer;

  this.currentX = this.initialX + this.rotationRadius * Math.cos(this.angle);
  this.currentY = this.initialY + this.rotationRadius * Math.sin(this.angle);

  /*   if (this.firstLoop) {
    //console.log(this.firstLoop)
    initialAngle = 3*Math.PI/2
  } else {
    //console.log(this.firstLoop)
    initialAngle = Math.PI
  } */

  if (this.angle >= 2 * Math.PI) {
    this.angle = 0;
    this.incrementer = 0.01;
  }

  // The following code is responsible for actually drawing the circle on the screen

  mainContext.beginPath();
  mainContext.arc(
    this.currentX,
    this.currentY,
    this.radius,
    0,
    Math.PI * 2,
    false
  );
  mainContext.closePath();
  mainContext.fillStyle = "rgba(177, 0, 129, .1)";
  mainContext.fill();
  //console.log("Fez update")
};

function createCircle(loop) {
  let radius = 10;
  let initialX = loop.x;
  let initialY = loop.y;
  let rotationRadius = loop.radius;
  let angle;
  let sign = 1;
  let firstLoop;

  if (loops.length > 1) {
    angle = Math.PI; //Loop > 0
    firstLoop = false;
  } else {
    angle = (3 * Math.PI) / 2; //Loop 0
    firstLoop = true;
  }

  // create the Circle object
  let circle = new Circle(
    angle,
    sign,
    radius,
    rotationRadius,
    initialX,
    initialY,
    firstLoop
  );
  circles.push(circle);
  lastLoop = circles.length-1;
}

let firstLoop = 0;
let currentLoop = 0;
let lastLoop;
let direction = "right";

function draw() {
  mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
  mainContext.fillStyle = "rgba(255, 255, 255, 0.1)";
  mainContext.fillRect(0, 0, canvasWidth, canvasHeight);
  drawLoops();

  if (currentLoop != lastLoop) {
    let circle = circles[currentLoop];
    let nextCircle = circles[currentLoop + 1];
    if (
      circle.angle + Math.PI != nextCircle.angle &&
      nextCircle.angle == Math.PI
    ) {
      circle.update();
    } else {
      currentLoop++;
    }
  } else {
    //console.log("Current loop é o last loop")
    let circle = circles[currentLoop];
    //console.log(circle)
    let nextCircle = circles[currentLoop - 1];
    //console.log(nextCircle)
    if (
      circle.angle + Math.PI != nextCircle.angle &&
      nextCircle.angle == Math.PI
    ) {
      circle.update();
    } else {
      currentLoop--;
    }
  }

  keepCircles();

  //nextCircle.update();

  /*   //Left to right
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];
    let nextCircle = circles[i + 1];
    if (i+1 < circles.length) {
      while (circle.angle > nextCircle.angle) {
        console.log("chamou update no normal")
        circle.update();
      }
    }
    if ((i == circles.length - 1)) {
      console.log("Voltando")
      backToStart();
    }
  }

  function backToStart() {
    //Right to left
    for (let i = circles.length - 1; i > 0; i--) {
      console.log("back to start nivel 1")
      let circle = circles[i];
      let nextCircle = circles[i - 1];
      if (i-1 >= 0) {
        console.log("back to start nivel 2")
        while (circle.angle > nextCircle.angle+Math.PI) {
          console.log("chamou update no back to start")
          circle.update();
        }
      }
    }
  }

  console.log("Finalizou 1 frame") */

  // call the draw function again!
  requestAnimationFrame(draw);
}
