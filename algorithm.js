let mainCanvas = document.getElementById("canvas");
let mainContext = mainCanvas.getContext("2d");

let canvasWidth = mainCanvas.width;
let canvasHeight = mainCanvas.height;

//Array que contém todos os circulos criados
let circles = new Array();

function Circle(
  angle,
  finalAngle,
  finalCycle,
  currentCycle,
  sign,
  radius,
  rotationRadius,
  initialX,
  initialY,
  firstLoop,
  activate
) {
  this.angle = angle;
  this.finalAngle = finalAngle;
  this.finalCycle = finalCycle;
  this.currentCycle = currentCycle;
  this.sign = sign;
  this.radius = radius;
  this.rotationRadius = rotationRadius;
  this.initialX = initialX;
  this.initialY = initialY;
  this.incrementer = 0.01;
  this.firstLoop = firstLoop;
  this.activate = activate;
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
  //console.log("Chamou Add Loop");

  let x, y, radius;

  //Check how many loops we have already
  //If it's zero, use default atributes
  //If it's not zero, calculate the atributes based on the last loop in the loops array

  if (loops.length != 0 && loops.length < 6) {
    //console.log(loops.length);
    let lastLoopRadius = loops[loops.length - 1].radius;
    let lastLoopY = loops[loops.length - 1].y;
    let lastLoopX = loops[loops.length - 1].x;

    radius = (2 * lastLoopRadius) / 3;
    x = lastLoopX + lastLoopRadius + radius;
    y = lastLoopY;
    createAndDrawLoop();
  } else if (loops.length === 0) {
    //console.log(loops.length);
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
    //console.log(circle);

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

Circle.prototype.update = function () {
  this.angle += this.incrementer;
  this.currentCycle += this.incrementer;

  this.currentX = this.initialX + this.rotationRadius * Math.cos(this.angle);
  this.currentY = this.initialY + this.rotationRadius * Math.sin(this.angle);

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
  let finalAngle;
  let finalCycle = 1; //temporarily set to 1, will be dynamic in the future
  let currentCycle = 0;
  let sign = 1;
  let firstLoop;

  if (loops.length > 1) {
    angle = Math.PI; //Loop > 0
    finalAngle = Math.PI
    firstLoop = false;
    activate = false;
  } else {
    angle = (3 * Math.PI) / 2; //Loop 0
    finalAngle = (3 * Math.PI) / 2;
    firstLoop = true;
    activate = true;
  }

  // create the Circle object
  let circle = new Circle(
    angle,
    finalAngle,
    finalCycle,
    currentCycle,
    sign,
    radius,
    rotationRadius,
    initialX,
    initialY,
    firstLoop,
    activate,
  );
  circles.push(circle);
  lastLoop = circles.length-1;
}

let firstLoop = 0;
let currentLoop = 0;
let lastLoop;
let direction = "right";
let finalValue = 3;
let cycle = 0;


function start() {
  //console.log("Chamou Start");

  //We will iterate over the circles array and determine which circle is to be updated at the time
  //Take the first loop and update it's state until it's circle position matches the next loop's circle position
  //entra no for, atualiza até chegar no proximo
  //entra no proximo, atualiza até chegar no proximo
  //...
  //quando chegar no ultimo, continua até terminar a atualização
  //novo atributo no circle: ativate (bool) ok
  //no caso do firstLoop, quando o angulo dele for igual ao inicial do proximo: != activate e ativar no proximo

  for (let i = 0; i < circles.length; i++) {

    let currentCircle;
    let nextCircle;

      if(i<circles.length) {
        currentCircle = circles[i];
        nextCircle = circles[i+1];
      } else {
        currentCircle = circles[i];
        nextCircle = circles[i-1];
      }

      if(circles[i].activate) {
        //O status é activate
        //Checar se já está na hora de desativar e ativar o proximo
        //Se estiver, desativa e ativa o proximo
        if(currentCircle.currentCycle >= currentCircle.finalCycle*(2*Math.PI)) { //Já concluiu seu ciclo, desativa e ativa o proximo
          currentCircle.activate = false;
          nextCircle.activate = true;
        } else { //Ainda não concluiu seu ciclo, continua atualizando
          cycleLoop(currentCircle)
        }
      }
  }

  function cycleLoop(circle) {
    if(circle.currentCycle<=circle.finalCycle*(2*Math.PI)) {
      circle.update();
    }
  }
  requestAnimationFrame(draw);
}

function draw() { //Represents the current state of the circles array
  mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
  mainContext.fillStyle = "rgba(255, 255, 255, 0.1)";
  mainContext.fillRect(0, 0, canvasWidth, canvasHeight);
  drawLoops();

  keepCircles();

  // call the draw function again!
  requestAnimationFrame(start);
}
