gameConfig = {
  scale: 1.0,
  areaWidth: 720,
  areaHeight: 1280,
  buttonFontHeight: 16,
  brickRowLength: 7,
  brickSpacing: 10
}

// Make an array of balls.
let balls = [];

// Make an array of buttons.
let buttons = [];

function setup() {
  // put setup code here
  createCanvas(
    window.innerWidth,
    window.innerHeight
  );

  // Set the inital scale.
  gameConfig.scale = (window.innerHeight - 50) / gameConfig.areaHeight;

  // Set initial background and fill colors.
  background(0);
  fill(255);

  // Create the fullscreen button.
  fsBtn = createButton('fs');

  // Default x, y, width, height, font size
  fsBtn.initX = 19;
  fsBtn.initY = 1200;
  fsBtn.initWidth = 80;
  fsBtn.initHeight = 60;
  fsBtn.initFontSize = 34;

  // Set initial position and size.
  fsBtn.position(
    fsBtn.initX * gameConfig.scale,
    fsBtn.initY * gameConfig.scale
  );
  fsBtn.size(
    fsBtn.initWidth * gameConfig.scale,
    fsBtn.initHeight * gameConfig.scale
  );

  // Font size, family, and style
  fsBtn.style('font-size', (fsBtn.initFontSize * gameConfig.scale) + 'px');
  fsBtn.style('font-family', 'monospace');
  fsBtn.style('font-weight', 'bold');

  // Add the action and default class.
  fsBtn.mousePressed(toggleFS);
  fsBtn.class('buttons');

  // Add button to array
  buttons.push(fsBtn);

  // Make a ball
  balls.push(makeBall(10, 10, 30));

  // Make bricks
  for (let i = 0; i < gameConfig.brickRowLength; i++) {
    balls.push(makeBrick(4 + 8 + (i * (90 + gameConfig.brickSpacing)), 4, 30));
  }
}

function draw() {
  // put drawing code here

  // Set background
  background(0);
  
  /*if (mouseIsPressed) {
    fill(0);
  }
  else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 80, 80);*/

  // Draw the game area
  fill(255);
  strokeWeight(4);
  stroke(0,0,200);
  rect(0, 0, gameConfig.areaWidth * gameConfig.scale, gameConfig.areaHeight * gameConfig.scale);

  // Iterate over balls
  for (let x = 0; x < balls.length; x++) {
    balls[x].boundsCheck(
      0,
      0,
      gameConfig.areaWidth,
      gameConfig.areaHeight
    );
    balls[x].move(gameConfig.scale);
    balls[x].draw(gameConfig.scale);
  }
}

function changeBG() {
  let val = random(255);
  background(val);
}

function toggleFS() {
  let fs = fullscreen();
  if (fs) {
    // Exit fullscreen mode
    fullscreen(false);

    // Resize canvas to match the window dimensions.
    resizeCanvas(
      window.innerWidth,
      window.innerHeight
    );

    // Give the window a bit of time to unmaximize.
    setTimeout(() => {
      // Then adjust the scale value.
      gameConfig.scale = (window.innerHeight - 50) / gameConfig.areaHeight;
    }, 500);
  }
  else {
    // Enter fullscreen mode.
    fullscreen(true);

    // Resize canvas to match screen dimensions.
    resizeCanvas(
      window.screen.width,
      window.screen.height
    );
   
    // Same thing again, but with the screen height.
    setTimeout(() => {
      gameConfig.scale = window.screen.height / gameConfig.areaHeight;
    }, 500);
  }

  // After getting the new scale, resize and reposition all buttons to match
  setTimeout(() => {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].position(
        buttons[i].initX * gameConfig.scale,
        buttons[i].initY * gameConfig.scale
      );
      buttons[i].size(
        buttons[i].initWidth * gameConfig.scale,
        buttons[i].initHeight * gameConfig.scale
      );
      buttons[i].style('font-size', (buttons[i].initFontSize * gameConfig.scale) + 'px');
    }
  }, 600);
}


// Ball making function
function makeBall(x, y, s) {
  let myball = {};
  myball.x = x;
  myball.y = y;
  myball.vx = random(0,10)
  myball.vy = random(0,10)
  myball.width = s;
  myball.height = s;
  myball.draw = function (scale) {
    let r = random(0,256);
    let g = random(0,256);
    let b = random(0,256);
    noStroke();
    fill(0,0,b);
    ellipse(
      myball.x * scale,
      myball.y * scale,
      myball.width * scale,
      myball.height * scale
    );
    noFill();
  }
  myball.move = function (scale) {
    myball.x += myball.vx;
    myball.y += myball.vy;
  }

  myball.boundsCheck = function (x, y, width, height) {
    if (myball.x + myball.vx > x + width) {
      myball.vx *= -1;
    }
    else if (myball.x + myball.vx < x) {
      myball.vx *= -1;
    }
    else if (myball.y + myball.vy > y + height) {
      myball.vy *= -1;
    }
    else if (myball.y + myball.vy < y) {
      myball.vy *= -1;
    }
  }

  return myball;
}

function makeBrick(x,y, s) {
  let mybrick = makeBall(x, y, s);

  // Bricks do not move by default.
  mybrick.vx = 0;
  mybrick.vy = 0;

  // Bricks are wider than they are tall.
  mybrick.width = mybrick.height * 3;

  // Draw rectangles instead of circles.
  mybrick.draw = function (scale) {
    noStroke();

    // Let's make them red
    fill(255,0,0);
    rect(
      mybrick.x * scale,
      mybrick.y * scale,
      mybrick.width * scale,
      mybrick.height * scale
    );
    noFill();
  }

  return mybrick;
}
