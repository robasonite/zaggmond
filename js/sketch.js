gameConfig = {
  scale: 1.0,
  areaWidth: 720,
  areaHeight: 1280,
  buttonFontHeight: 16,
  brickRowLength: 7,
  brickSpacing: 10,
  mode: 'play',
  uiBarHeight: 100
}

// Make an array of balls.
let balls = [];

// Make an array of bricks
let bricks = [];

// Make an array of buttons.
let buttons = [];

function setup() {
  // put setup code here
  createCanvas(
    window.innerWidth,
    window.innerHeight
  );

  // Set the inital scale.
  gameConfig.scale = window.innerHeight / gameConfig.areaHeight;

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
  balls.push(makeBall(300, 300, 30));

  // Make bricks
  let rows = 9;
  let yOffset = gameConfig.uiBarHeight + gameConfig.brickSpacing;
  let brickHeight = 40;
  let brickWidth = 90;
  for (let r = 0; r < rows; r++) {
    for (let i = 0; i < gameConfig.brickRowLength; i++) {
      // Need to make room for top bar
      bricks.push(
        makeBrick(
          4 + 8 + (i * (90 + gameConfig.brickSpacing)),
          yOffset,
          brickWidth,
          brickHeight
        )
      );
    }
    yOffset += brickHeight + gameConfig.brickSpacing;
  }
}

// The main game loop
function gameLoop() {
  // Set background
  background(0);
  
  /*if (mouseIsPressed) {
    fill(0);
  }
  else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 80, 80);*/

  // Draw the game area.
  fill(255);
  //strokeWeight(4);
  //stroke(0,0,200);
  rect(
    0,
    0,
    gameConfig.areaWidth * gameConfig.scale,
    gameConfig.areaHeight * gameConfig.scale
  );

  // Top bar
  fill(100);
  noStroke();
  rect(
    0,
    0,
    gameConfig.areaWidth * gameConfig.scale,
    gameConfig.uiBarHeight * gameConfig.scale
  );

  // Bottom bar
  rect(
    0,
    (gameConfig.areaHeight - gameConfig.uiBarHeight) * gameConfig.scale,
    gameConfig.areaWidth * gameConfig.scale,
    gameConfig.uiBarHeight * gameConfig.scale
  );

  // Iterate over balls.
  for (let x = 0; x < balls.length; x++) {

    // Take top and bottom bars into account
    balls[x].boundsCheck(
      0,
      gameConfig.uiBarHeight,
      gameConfig.areaWidth,
      gameConfig.areaHeight - (gameConfig.uiBarHeight * 2)
    );

    // Ball and brick collisions
    for (let b = 0; b < bricks.length; b++) {
      if (collider(balls[x], bricks[b]) && bricks[b].visible) {

        // Brick is "destroyed"
        bricks[b].visible = false;

        // Decide how to bounce the ball
        let ballMidX = balls[x].x + (balls[x].height / 2);
        let brickMidX= bricks[b].x + (bricks[b].height / 2);

        balls[x].vy *= -1;
        if (
            balls[x].vx > 0 && ballMidX < brickMidX ||
            balls[x].vx < 0 && ballMidX > brickMidX
          ) {
          balls[x].vx *= -1;
        }
      }
    }
    balls[x].move(gameConfig.scale);
    balls[x].draw(gameConfig.scale);
  }
  
  // Iterate over bricks
  for (let x = 0; x < bricks.length; x++) {
    // Check if a brick is visible first
    if (bricks[x].visible) {
      bricks[x].boundsCheck(
        0,
        0,
        gameConfig.areaWidth,
        gameConfig.areaHeight
      );
      bricks[x].move(gameConfig.scale);
      bricks[x].draw(gameConfig.scale);
    }
  }

}

function draw() {
  // put drawing code here
  if (gameConfig.mode == 'play') {
    gameLoop();
  }
}

function collider(a,b) {
  if (a.x < b.x + b.width &&
     a.x + a.width > b.x &&
     a.y < b.y + b.height &&
     a.y + a.height > b.y) {
    return true;
  }

  return false;
}

function changeBG() {
  let val = random(255);
  background(val);
}

function toggleFS(forceExit) {
  let fs = fullscreen();

  // Allow for forcing fullscreen exit
  if (forceExit) {
    // Resize canvas to match screen dimensions.
    resizeCanvas(
      window.screen.width,
      window.screen.height
    );
   
    // Same thing again, but with the screen height.
    setTimeout(() => {
      //gameConfig.scale = window.screen.height / gameConfig.areaHeight;
      gameConfig.scale = window.innerHeight / gameConfig.areaHeight;
      /*console.log("Fullscreen scale: " + gameConfig.scale);
      console.log("Fullscreen height: " + gameConfig.areaHeight * gameConfig.scale);
      console.log("Screen height: " + window.screen.height);*/
    }, 500);
  }

  // Normal toggling with button
  else {
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
        //gameConfig.scale = window.innerHeight / gameConfig.areaHeight;
        gameConfig.scale = window.innerHeight / gameConfig.areaHeight;
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
        //gameConfig.scale = window.screen.height / gameConfig.areaHeight;
        gameConfig.scale = window.innerHeight / gameConfig.areaHeight;
        console.log("Fullscreen scale: " + gameConfig.scale);
        console.log("Fullscreen height: " + gameConfig.areaHeight * gameConfig.scale);
        console.log("Screen height: " + window.screen.height);
      }, 500);
    }
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

// Run this function when the user exits fullscreen mode through a method other than by pressing the button.
function windowResized() {
  toggleFS(true);
}


// Ball making function
function makeBall(x, y, s) {
  let myball = {};
  myball.x = x;
  myball.y = y;
  myball.vx = 4
  myball.vy = 8
  myball.width = s;
  myball.height = s;
  myball.draw = function (scale) {
    let r = random(0,256);
    let g = random(0,256);
    let b = random(0,256);
    noStroke();
    fill(0,0,b);
    ellipseMode(CORNER);
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
    if (myball.x + myball.width > x + width) {
      myball.x = x + width - myball.width - 1;
      myball.vx *= -1;
    }
    else if (myball.x < x) {
      myball.x = x + 1;
      myball.vx *= -1;
    }
    else if (myball.y + myball.height > y + height) {
      myball.y = y + height - myball.height -1;
      myball.vy *= -1;
    }
    else if (myball.y < y) {
      myball.y = y + 1;
      myball.vy *= -1;
    }
  }

  return myball;
}

function makeBrick(x,y,w,h) {
  let mybrick = makeBall(x, y, w);

  // Bricks do not move by default.
  mybrick.vx = 0;
  mybrick.vy = 0;

  // Bricks have to be visible
  mybrick.visible = true;
  mybrick.height = h;

  // Draw rectangles instead of circles.
  mybrick.draw = function (scale) {
    noStroke();

    // Let's make them red
    fill(255,0,0);
    
    // Draw a diamond
    quad(

      // Left corner XY
      mybrick.x * scale,
      (mybrick.y + (mybrick.height / 2)) * scale,

      // Top center XY
      (mybrick.x + (mybrick.width / 2)) * scale,
      mybrick.y * scale,

      // Right corner XY
      (mybrick.x + mybrick.width) * scale,
      (mybrick.y + (mybrick.height / 2)) * scale,


      // Lower center XY
      (mybrick.x + (mybrick.width / 2)) * scale,
      (mybrick.y + mybrick.height) * scale,
    );
    noFill();
  }

  return mybrick;
}
