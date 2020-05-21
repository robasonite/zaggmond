var breakout = function(sketch) {
  gameConfig = {
    scale: 1.0,
    areaWidth: 720,
    areaHeight: 1280,
    buttonFontHeight: 16,
    brickRowLength: 7,
    brickSpacing: 10,
    mode: 'title',
    uiBarHeight: 100
  }

  // Make an array of balls.
  let balls = [];

  // Make an array of bricks
  let bricks = [];

  // Make an array of buttons.
  let buttons = [];

  // The player should be global
  let player;

  // Preload sound effects into their own object
  let soundEffects = {};

  sketch.preload = function() {
    // Need to load sound files before trying to use them
    soundEffects.ballHitWall = sketch.loadSound('sounds/hitWall.ogg');
    soundEffects.ballHitBrick = sketch.loadSound('sounds/hitBrick.ogg');
  }

  sketch.setup = function() {
    // put setup code here
    sketch.createCanvas(
      window.innerWidth,
      window.innerHeight
    );

    // Set the inital scale.
    gameConfig.scale = window.innerHeight / gameConfig.areaHeight;

    // Set initial background and fill colors.
    sketch.background(0);
    sketch.fill(255);

    /*
    // Create the fullscreen button.
    fsBtn = createButton('fs');

    // Default x, y, width, height, font size
    fsBtn.initX = 19;
    fsBtn.initY = 1200;
    fsBtn.initWidth = 80;
    fsBtn.initHeight = 60;
    fsBtn.initFontSize = 34;

    // Every button has a screen.
    // 'all' appears on every screen
    fsBtn.screen = 'all';

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
    */

    // makeUiButton(label, x, y, w, h, screen)
    let fsBtn = makeUiButton(
      'fs',
      19,
      1200,
      80,
      60,
      'all'
    );
    
    fsBtn.mousePressed(toggleFS);

    // Add button to array
    buttons.push(fsBtn);
    
    let startBtn = makeUiButton(
      'START',
      (gameConfig.areaWidth / 2) - 125,
      gameConfig.areaHeight * 0.4,
      250,
      140,
      'title',
      70
    );
    
    startBtn.mousePressed(function() {
      switchScreen('play');
    });
    
    buttons.push(startBtn);
    
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

    // Need to create the player's paddle
    player = makePaddle();
  }

  // The main game loop
  function gameLoop() {
    
    // Set background
    sketch.background(0);
    
    /*if (mouseIsPressed) {
      fill(0);
    }
    else {
      fill(255);
    }
    ellipse(mouseX, mouseY, 80, 80);*/

    // Draw the game area.
    sketch.fill(255);
    //strokeWeight(4);
    //stroke(0,0,200);
    sketch.rect(
      0,
      0,
      gameConfig.areaWidth * gameConfig.scale,
      gameConfig.areaHeight * gameConfig.scale
    );

    // Top bar
    sketch.fill(100);
    sketch.noStroke();
    sketch.rect(
      0,
      0,
      gameConfig.areaWidth * gameConfig.scale,
      gameConfig.uiBarHeight * gameConfig.scale
    );

    // Bottom bar
    sketch.rect(
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

          // Play the sound effect
          soundEffects.ballHitBrick.play();

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

    // Draw the player
    player.boundsCheck(0, gameConfig.areaWidth);
    player.move(gameConfig.scale);
    player.draw(gameConfig.scale);

    // Input handling
    if (sketch.mouseIsPressed) {
      //sketch.stroke(150);
      //sketch.line(sketch.mouseX, 0, sketch.mouseX, gameConfig.areaHeight);
      //console.log("Mouse down: " + sketch.mouseX);
      //console.log((gameConfig.areaWidth * gameConfig.scale / 2));
      if (sketch.mouseX < (gameConfig.areaWidth * gameConfig.scale) / 2) {
        //console.log("LEFT");
        player.vx = player.speed * -1;
      }
      else {
        //console.log("RIGHT");
        player.vx = player.speed;
      }
    }
    
    // Same thing for the arrow keys
    else if (sketch.keyIsPressed) {
      if (sketch.keyCode === sketch.LEFT_ARROW) {
        player.vx = player.speed * -1;
      }
      else if (sketch.keyCode === sketch.RIGHT_ARROW) {
        player.vx = player.speed;
      }
    }

    // If the player isn't holding the mouse button or a key down, don't move the paddle.
    else {
      player.vx = 0;
    }
  }

  // Need a screen switching function to show and hide buttons
  function switchScreen(screenName) {
    // First hide all buttons
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].screen != 'all') {
        buttons[i].hide();
      }
      else if (buttons[i].screen == screenName) {
        buttons[i].show();
      }
    }

    // Change the screen
    gameConfig.mode = 'play';
  }

  function titleScreen() {
    sketch.background(0);
    sketch.fill(90,90,200);
    //strokeWeight(4);
    //stroke(0,0,200);
    sketch.rect(
      0,
      0,
      gameConfig.areaWidth * gameConfig.scale,
      gameConfig.areaHeight * gameConfig.scale
    );
    sketch.fill(0);
    sketch.textAlign(sketch.CENTER);
    sketch.textSize(140 * gameConfig.scale);
    sketch.text(
      "Title here",
      (gameConfig.areaWidth / 2) * gameConfig.scale,
      (gameConfig.areaHeight * 0.2) * gameConfig.scale
    );
  }

  sketch.draw = function() {
    // put drawing code here
    if (gameConfig.mode == 'play') {
      gameLoop();
    }
    else if (gameConfig.mode == 'title') {
      titleScreen();
    }
  }

  // Simple overlap collision test
  function collider(a,b) {
    if (a.x < b.x + b.width &&
       a.x + a.width > b.x &&
       a.y < b.y + b.height &&
       a.y + a.height > b.y) {
      return true;
    }

    return false;
  }

  function toggleFS(forceExit) {
    let fs = sketch.fullscreen();

    // Allow for forcing fullscreen exit
    if (forceExit) {
      // Resize canvas to match screen dimensions.
      sketch.resizeCanvas(
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
        sketch.fullscreen(false);

        // Resize canvas to match the window dimensions.
        sketch.resizeCanvas(
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
        sketch.fullscreen(true);

        // Resize canvas to match screen dimensions.
        sketch.resizeCanvas(
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
  sketch.windowResized = function() {
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
      let r = sketch.random(0,256);
      let g = sketch.random(0,256);
      let b = sketch.random(0,256);
      sketch.noStroke();
      sketch.fill(0,0,b);
      sketch.ellipseMode(sketch.CORNER);
      sketch.ellipse(
        myball.x * scale,
        myball.y * scale,
        myball.width * scale,
        myball.height * scale
      );
      sketch.noFill();
    }
    myball.move = function (scale) {
      myball.x += myball.vx;
      myball.y += myball.vy;
    }

    myball.boundsCheck = function (x, y, width, height) {
      let hitWall = false;
      if (myball.x + myball.width > x + width) {
        myball.x = x + width - myball.width - 1;
        myball.vx *= -1;
        hitWall = true;
      }
      else if (myball.x < x) {
        myball.x = x + 1;
        myball.vx *= -1;
        hitWall = true;
      }
      else if (myball.y + myball.height > y + height) {
        myball.y = y + height - myball.height -1;
        myball.vy *= -1;
        hitWall = true;
      }
      else if (myball.y < y) {
        myball.y = y + 1;
        myball.vy *= -1;
        hitWall = true;
      }

      // If the ball hit a wall, play the sound effect.
      if (hitWall) {
        soundEffects.ballHitWall.play();
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
      sketch.noStroke();

      // Let's make them red
      sketch.fill(255,0,0);
      
      // Draw a diamond
      sketch.quad(

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
      sketch.noFill();
    }

    return mybrick;
  }

  function makePaddle() {
    // Borrow some functions from the Ball.
    // Paddles wil always spawn in the middle of the playing field, towards the bottom.
    let mypaddle = makeBall(
      (gameConfig.areaWidth / 2) - 70,
      1100,
      20
    );
    mypaddle.vx = 0
    mypaddle.vy = 0

    // Set a separate speed variable
    mypaddle.speed = 10;

    // Need to adjust the width
    mypaddle.width = 140;

    // Paddles are rectangles
    mypaddle.draw = function (scale) {
      sketch.noStroke();
      sketch.fill(0);
      sketch.rect(
        mypaddle.x * scale,
        mypaddle.y * scale,
        mypaddle.width * scale,
        mypaddle.height * scale
      );
      sketch.noFill();
    }

    // Because the paddle is player controlled, this needs an overhaul.
    // The paddle only moves left and right.
    mypaddle.boundsCheck = function (x, width) {
      if (mypaddle.x < x) {
        mypaddle.x = x + 1;
      }

      else if (mypaddle.x + mypaddle.width > x + width) {
        mypaddle.x = x + width - mypaddle.width - 1;
      }
    }

    return mypaddle;
  }

  function makeUiButton(label, x, y, w, h, screen, fs) {
    mybutton = sketch.createButton(label);
    mybutton.initX = x;
    mybutton.initY = y;
    mybutton.initWidth = w;
    mybutton.initHeight = h;
    mybutton.screen = screen;

    // Optional font size
    if (fs) {
      mybutton.initFontSize = fs;
    }
    else {
      mybutton.initFontSize = 34;
    }

    // Set position and size based on game scale
    mybutton.position(
      mybutton.initX * gameConfig.scale,
      mybutton.initY * gameConfig.scale
    );
    mybutton.size(
      mybutton.initWidth * gameConfig.scale,
      mybutton.initHeight * gameConfig.scale
    );
    
    // Font size, family, and style
    mybutton.style('font-size', (mybutton.initFontSize * gameConfig.scale) + 'px');
    mybutton.style('font-family', 'monospace');
    mybutton.style('font-weight', 'bold');
    mybutton.class('buttons');

    return mybutton;
  }
}

new p5(breakout, "canvas");
