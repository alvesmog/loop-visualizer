let mainCanvas = document.getElementById("canvas");
let mainContext = mainCanvas.getContext("2d");

let canvasWidth = mainCanvas.width;
let canvasHeight = mainCanvas.height;

//Array que contém todos os circulos criados
let circles = new Array();

function Circle(angle, sign, radius, rotationRadius, initialX, initialY) {
  this.angle = angle;
  this.sign = sign;
  this.radius = radius;
  this.rotationRadius = rotationRadius;
  this.initialX = initialX;
  this.initialY = initialY;
  this.incrementer = 0.01;
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
    drawLoops();
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

function start(finalValue) {
  console.log("Chamou Start");
  requestAnimationFrame(draw);
}

Circle.prototype.update = function () {
  this.angle += this.incrementer;

  this.currentX = this.initialX + this.rotationRadius * Math.cos(this.angle);
  this.currentY = this.initialY + this.rotationRadius * Math.sin(this.angle);

  if (this.angle >= Math.PI * 2) {
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
};

function createCircle(loop) {
  let radius = 10;
  let initialX = loop.x;
  let initialY = loop.y;
  let rotationRadius = loop.radius;
  let angle = (3 * Math.PI) / 2;
  let sign = 1;

  // create the Circle object
  let circle = new Circle(
    angle,
    sign,
    radius,
    rotationRadius,
    initialX,
    initialY
  );
  circles.push(circle);
}

function draw() {
  mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
  mainContext.fillStyle = "rgba(255, 255, 255, 0.1)";
  mainContext.fillRect(0, 0, canvasWidth, canvasHeight);
  drawLoops();
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];
    circle.update();
  }

  // call the draw function again!
  requestAnimationFrame(draw);
}
