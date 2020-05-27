// Robert's breakout
// Copyright 2020 Robasonite.com
// License: MIT
//
// A huge thankyou goes out to the great people of the Internet. Though we have never met, on or offline, this work would have been impossible without the efforts of the many YouTubers, Redditors, and bloggers who post content about JavaScript, Android, and game development. It's like a college education without a rigid schedule, classrooms, crappy professors, or rediculous debt. Thank you all so very much.


var breakout = function(sketch) {
  gameConfig = {
    scale: 1.0,
    areaWidth: 720,
    areaHeight: 1280,
    buttonFontHeight: 16,
    brickRowLength: 7,
    brickSpacing: 10,
    mode: 'title',
    uiBarHeight: 100,
    font: '',
    fontName: '',
    level: 0,
    countdownStart: 3,
    countdownTick: 40,
  }

  // Global pause variable; Nothing should be moving if true.
  let gamePaused = false;

  // Whether or not a countdown is running.
  let countdownRunning = false;

  // The countdown that runs when the user starts a new game, or unpauses an existing one.
  let resumeCountdown;

  // Make an array of balls.
  let balls = [];

  // Make an array of bricks.
  let bricks = [];

  // Make an array of effect particles.
  let particles = [];

  // Make an array of buttons.
  let buttons = [];

  // The player should be global
  let player;

  // Player score value
  let playerScore = 0;

  // Shape buffers to store pre-rendered stuff.
  let shapeBuffers = {};

  // Blueprint objects
  // This array contains a collection of shape objects that are
  // never drawn to the screen. Instead, their attributes are
  // used to make pre-rendered shape buffers.
  let shapeBlueprints = [];

  // Preload sound effects into their own object.
  let soundEffects = {};

  // Level building function get put into their own array.
  let Levels = [];

  // >> LEVEL SECTION START
  function level_0() {
    // Make a brick to use as a model.
    let demoBrick = makeBrick(0,0);

    // Set the number of rows.
    let rows = 9;

    // Get the starting Y axis offset.
    let yOffset = gameConfig.uiBarHeight + gameConfig.brickSpacing;
    
    // Make rows of bricks.
    for (let r = 0; r < rows; r++) {
      for (let i = 0; i < gameConfig.brickRowLength; i++) {
        bricks.push(
          makeBlueBrick(
            gameConfig.brickSpacing + ((demoBrick.width + gameConfig.brickSpacing) * i),
            yOffset
          )
        );
      }
      yOffset += demoBrick.height + gameConfig.brickSpacing;
    }
  }

  Levels.push(level_0);

  // >> LEVEL SECTION END
  
  sketch.preload = function() {
    // Set the inital scale.
    gameConfig.scale = window.innerHeight / gameConfig.areaHeight;

    // Need to load sound files before trying to use them.
    soundEffects.ballHitWall = sketch.loadSound('sounds/hitWall.ogg');
    soundEffects.ballHitBrick = sketch.loadSound('sounds/hitBrick.ogg');

    // Also preload the base font.
    gameConfig.font = sketch.loadFont('fonts/FiraMono-Medium.otf');
    gameConfig.fontName = 'FiraMono-Medium';
    
    // Before we draw ANYTHING, create shape buffers for the bricks
    shapeBlueprints.push(makeEffectParticle(0,0));
    shapeBlueprints.push(makeBrick(0,0));
    shapeBlueprints.push(makeBlueBrick(0,0));
    shapeBlueprints.push(makeBall(0,0));
    shapeBlueprints.push(makePaddle(0,0));
    for (let i = 0; i < shapeBlueprints.length; i++) {
      // Make the buffer
      shapeBuffers[shapeBlueprints[i].shapeName] = sketch.createGraphics(shapeBlueprints[i].width, shapeBlueprints[i].height);

      // Draw to the buffer
      shapeBlueprints[i].makeShape(shapeBuffers[shapeBlueprints[i].shapeName]);
    }
  }

  sketch.setup = function() {
    // put setup code here

    // Create the canvas
    sketch.createCanvas(
      gameConfig.areaWidth * gameConfig.scale,
      gameConfig.areaHeight * gameConfig.scale
    );

    // Set the font
    sketch.textFont(gameConfig.font);

    /*let demoBrick = makeBrick(0,0);
    shapeBuffers.redBrick = sketch.createGraphics(demoBrick.width, demoBrick.height);
    demoBrick.makeShape(shapeBuffers.redBrick);

    // And normal balls
    let demoBall = makeBall(0,0);
    shapeBuffers.blueBall = sketch.createGraphics(demoBall.width, demoBall.height);
    demoBall.makeShape(shapeBuffers.blueBall); */

    // Make the resume countdown.
    function unpause() {
      gamePaused = false;
    }

    resumeCountdown = makeCountdown(
      gameConfig.countdownStart,
      gameConfig.countdownTick,
      unpause
    );


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
    
    let quitBtn = makeUiButton(
      'QUIT',
      (gameConfig.areaWidth / 2) - (280 / 2),
      gameConfig.areaHeight * 0.3,
      280,
      140,
      'pause',
      70
    );
    
    quitBtn.mousePressed(function() {
      resetGame();
      switchScreen('title');
    });
    
    buttons.push(quitBtn);
    
    let resumeBtn = makeUiButton(
      'RESUME',
      (gameConfig.areaWidth / 2) - (280 / 2),
      gameConfig.areaHeight * 0.5,
      280,
      140,
      'pause',
      70
    );
    
    resumeBtn.mousePressed(function() {
      switchScreen('play');
      countdownRunning = true;
    });
    
    buttons.push(resumeBtn);
    
    // makeUiButton(label, x, y, w, h, screen, fontSize)
    let pauseBtn = makeUiButton(
      //'&#9613;&#9613;',
      '&#10074;&#10074;',
      gameConfig.areaWidth - 90,
      gameConfig.areaHeight - gameConfig.uiBarHeight,
      90,
      gameConfig.uiBarHeight,
      'play',
      40
    );

    pauseBtn.mousePressed(function() {
      if (!gamePaused) {
        gamePaused = true;
        switchScreen('pause');
      }
    });
    
    buttons.push(pauseBtn);

    // Run the reset function to start the game at level 0
    resetGame();

    // Make sure that the right buttons are showing
    switchScreen('title');
  }

  // The main game loop.
  // Updating function
  function simUpdate() {
    for (let x = 0; x < balls.length; x++) {

      // Take top and bottom bars into account
      balls[x].boundsCheck(
        0,
        gameConfig.uiBarHeight,
        gameConfig.areaWidth,
        gameConfig.areaHeight - (gameConfig.uiBarHeight * 2)
      );

      // Check for paddle collisions
      if (collider(balls[x], player)) {
        // Send the ball back up.
        if (balls[x].vy > 0) {
          balls[x].vy *= -1;
        }

        // Get the absolute distance between ball and paddle midpoints.
        let ballMidX = balls[x].x + (balls[x].width / 2);
        let paddleMidX = player.x + (player.width / 2);
        let midpointDistance = sketch.abs(ballMidX - paddleMidX);

        // Convert value to percentage
        let midpointPercent = midpointDistance / sketch.abs(paddleMidX - player.x);

        // Flatten and convert percentage,
        // round to nearest hundredth
        let multiplier = sketch.pow(10,2);
        midpointPercent = sketch.round(midpointPercent * multiplier) / multiplier;

        // Floor if over 1
        if (midpointPercent > 1.0) {
          midpointPercent = sketch.floor(midpointPercent);
        }
          
        // Adjust the X velocity of the ball.
        balls[x].vx = balls[x].speed * midpointPercent;

        // Bounce left or right
        if (ballMidX < paddleMidX) {
          balls[x].vx *= -1;
        }
      }

      // Ball and brick collisions
      for (let b = 0; b < bricks.length; b++) {
        if (collider(balls[x], bricks[b]) && bricks[b].visible) {
         
          // Damage the brick.
          bricks[b].hp -= 1;

          if (bricks[b].hp < 1) {
            // Brick is "destroyed"
            bricks[b].visible = false;
            
            // Play the sound effect
            soundEffects.ballHitBrick.play();
            
            // Award points
            playerScore += bricks[b].points;

            // Trigger an explosion at the location of the brick.
            makeEffectExplosion(
              bricks[b].x + (bricks[b].width / 2),
              bricks[b].y + (bricks[b].height / 2)
            );
          }

          // If the brick is not destroyed, play the normal wall hit sound.
          else {
            soundEffects.ballHitWall.play();
          }

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
      }
    }

    // Iterate over particles.
    let aliveParticles = []
    for (let i = 0; i < particles.length; i++) {

      // Update each particle's distance life.
      particles[i].checkDistance();

      // If still alive, save it for next frame and move it.
      if (particles[i].alive) {
        aliveParticles.push(particles[i]);
        particles[i].move(gameConfig.scale);
      }
    }

    // Remove dead particles.
    particles = aliveParticles;

    // Update the player
    player.boundsCheck(0, gameConfig.areaWidth);
    player.move(gameConfig.scale);
  }
  
  function gameLoop() {
    
    // Set the background color
    sketch.background(90,90,255);
    
    /*if (mouseIsPressed) {
      fill(0);
    }
    else {
      fill(255);
    }
    ellipse(mouseX, mouseY, 80, 80);*/

    // Draw the game area.
    /*sketch.fill(50,190,50);
    //strokeWeight(4);
    //stroke(0,0,200);
    sketch.rect(
      0,
      0,
      gameConfig.areaWidth * gameConfig.scale,
      gameConfig.areaHeight * gameConfig.scale
    ); */

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

    // Update positions of balls, paddle, and bricks, BUT only if the game is NOT paused. Also won't run if there's a countdown running.
    if (!gamePaused && !countdownRunning) {
      simUpdate();
    }

    // If a countdown is running, run it's iterate function.
    if (countdownRunning) {
      // Currently only the resumeCountdown exists.
      resumeCountdown.iterate();
    }

    // Draw the balls.
    for (let x = 0; x < balls.length; x++) {
      // Draw all objects according to their buffered shape names.
      balls[x].draw(gameConfig.scale, shapeBuffers[balls[x].shapeName]);
    }
    
    // Draw the brick.
    for (let x = 0; x < bricks.length; x++) {
      // Check if a brick is visible first
      if (bricks[x].visible) {
        bricks[x].draw(gameConfig.scale, shapeBuffers[bricks[x].shapeName]);
      }
    }

    // Draw any particles that exist.
    for (let x = 0; x < particles.length; x++) {
      particles[x].draw(gameConfig.scale, shapeBuffers[particles[x].shapeName]);
    }

    // Draw the player.
    player.draw(gameConfig.scale, shapeBuffers.normalPaddle);

    // Draw the player's score
    sketch.fill(255);
    sketch.textAlign(sketch.LEFT);
    sketch.textSize(40 * gameConfig.scale);
    sketch.text(
      "Score: " + playerScore,
      20 * gameConfig.scale,
      50 * gameConfig.scale
    );

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
    // Hide and show the right buttons
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].hide();
    }
    
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].screen == screenName || buttons[i].screen == 'all') {
        buttons[i].show();
      }
    }

    // Change the screen
    gameConfig.mode = screenName;
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
    sketch.textSize(90 * gameConfig.scale);
    sketch.text(
      "Title here",
      (gameConfig.areaWidth / 2) * gameConfig.scale,
      (gameConfig.areaHeight * 0.2) * gameConfig.scale
    );
  }
  
  function pauseScreen() {
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
      "Pause",
      (gameConfig.areaWidth / 2) * gameConfig.scale,
      (gameConfig.areaHeight * 0.2) * gameConfig.scale
    );
  }

  // Needed to report FPS
  let lastLoop = new Date();
  sketch.draw = function() {
    // put drawing code here
    if (gameConfig.mode == 'play') {
      gameLoop();
    }
    else if (gameConfig.mode == 'title') {
      titleScreen();
    }
    else if (gameConfig.mode == 'pause') {
      pauseScreen();
    }

    // Show FPS
    let thisLoop = new Date();
    let fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;
    if (fps < 50) {
      sketch.fill(200,0,0);
    }
    else {
      sketch.fill(0,200,0);
    }
    sketch.textAlign(sketch.LEFT);
    sketch.textSize(50 * gameConfig.scale);
    sketch.text(
      "FPS: " + Math.floor(fps),
      500 * gameConfig.scale,
      50 * gameConfig.scale
    );
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
      
      // Need to give the window a bit of time to un-fullscreen.
      setTimeout(() => {
        //gameConfig.scale = window.screen.height / gameConfig.areaHeight;
        gameConfig.scale = window.innerHeight / gameConfig.areaHeight;
        /*console.log("Fullscreen scale: " + gameConfig.scale);
        console.log("Fullscreen height: " + gameConfig.areaHeight * gameConfig.scale);
        console.log("Screen height: " + window.screen.height);*/
        
        // Resize canvas to match screen dimensions.
        sketch.resizeCanvas(
          gameConfig.areaWidth * gameConfig.scale,
          gameConfig.areaHeight * gameConfig.scale
        );
      }, 500);
    }

    // Normal toggling with button
    else {
      if (fs) {
        // Exit fullscreen mode
        sketch.fullscreen(false);

        // Give the window a bit of time to unmaximize.
        setTimeout(() => {
          // Then adjust the scale value.
          //gameConfig.scale = window.innerHeight / gameConfig.areaHeight;
          gameConfig.scale = window.innerHeight / gameConfig.areaHeight;
        
          // Resize canvas to match the window dimensions.
          sketch.resizeCanvas(
            gameConfig.areaWidth * gameConfig.scale,
            gameConfig.areaHeight * gameConfig.scale
          );
        }, 500);
      }
      else {
        // Enter fullscreen mode.
        sketch.fullscreen(true);

        // Same thing again, but with the screen height.
        setTimeout(() => {
          //gameConfig.scale = window.screen.height / gameConfig.areaHeight;
          gameConfig.scale = window.innerHeight / gameConfig.areaHeight;
          
          // Resize canvas to match screen dimensions.
          sketch.resizeCanvas(
            gameConfig.areaWidth * gameConfig.scale,
            gameConfig.areaHeight * gameConfig.scale
          );
       
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

  // Simple particle function.
  function makeParticle(x,y) {
    let myparticle = {};
    myparticle.x = x;
    myparticle.y = y;
    myparticle.vx = 0;
    myparticle.vy = 0;
    myparticle.speed = 2;
    myparticle.width = 4;
    myparticle.height = 4;

    myparticle.shapeName = 'particle';
    myparticle.makeShape = function(buffer) {
      buffer.strokeWeight(0);
      buffer.fill(255);
      buffer.rect(
        myparticle.x,
        myparticle.y,
        myparticle.width,
        myparticle.height
      );
    }
    
    myparticle.move = function(scale) {
      myparticle.x += myparticle.vx;
      myparticle.y += myparticle.vy;
    }
    
    myparticle.draw = function(scale, buffer) {
      sketch.image(
        buffer,
        myparticle.x * scale,
        myparticle.y * scale,
        myparticle.width * scale,
        myparticle.height * scale
      );
    }

    return myparticle;

  }
  
  // Special effect particles.
  // These particles are used for explosions and the like.
  function makeEffectParticle(x, y) {
    let eparticle = makeParticle(x, y);

    // Set a maximum travel distance.
    eparticle.maxDistance = 20;

    // Particle must be alive to be seen.
    eparticle.alive = true;

    // When the particle travels far enough, it dies.
    eparticle.checkDistance = function() {
      if (eparticle.maxDistance > 0) {
        eparticle.maxDistance--;
      }
      else {
        eparticle.alive = false;
      }
    }

    return eparticle;
  }


  // Ball making function
  //function makeBall(x, y, s) {
  // Decided to set ball size to 30px.
  function makeBall(x, y) {
    let myball = makeParticle(x, y);
    myball.x = x;
    myball.y = y;
    myball.vx = 8;
    myball.vy = 8;
    myball.speed = 8;
    myball.width = 30;
    myball.height = 30;

    myball.shapeName = 'blueBall';
    myball.makeShape = function(buffer) {
      // Add an outline.
      buffer.strokeWeight(1);
      buffer.stroke(0);
      //buffer.noStroke();
      buffer.fill(0,0,200);
      buffer.ellipseMode(buffer.CORNER);
      buffer.ellipse(
        myball.x,
        myball.y,
        myball.width,
        myball.height
      );
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

  function makeBrick(x,y) {
    //let mybrick = makeBall(x, y, w);
    let mybrick = makeBall(x, y);

    // Bricks do not move by default.
    mybrick.vx = 0;
    mybrick.vy = 0;

    // Bricks have to be visible
    mybrick.visible = true;
    mybrick.height = 40;
    mybrick.width = 90;

    mybrick.shapeName = 'redBrick';

    // Color
    mybrick.color = sketch.color(255,0,0);

    // Draw diamonds instead of circles.
    mybrick.makeShape = function(buffer) {
      //buffer.noStroke();

      // Let's make them red.
      buffer.fill(mybrick.color);
     
      // Add an outline.
      buffer.strokeWeight(2);
      buffer.stroke(0);
      
      // Draw a diamond.
      buffer.quad(

        // Left corner XY
        mybrick.x,
        mybrick.y + (mybrick.height / 2),

        // Top center XY
        mybrick.x + (mybrick.width / 2),
        mybrick.y,

        // Right corner XY
        mybrick.x + mybrick.width,
        mybrick.y + (mybrick.height / 2),

        // Lower center XY
        mybrick.x + (mybrick.width / 2),
        mybrick.y + mybrick.height,
      );
    }

    // And bricks award points to the player!
    mybrick.points = 10;

    // And they may take multiple hits.
    mybrick.hp = 1;


    return mybrick;
  }

  function makeBlueBrick(x, y) {
    let mybrick = makeBrick(x, y);
    mybrick.color = sketch.color(0,0,255);
    mybrick.shapeName = 'blueBrick';
    return mybrick;
  }

  function makePaddle(x, y) {
    // Borrow some functions from the Ball.
    // Paddles wil always spawn in the middle of the playing field, towards the bottom.
    let mypaddle = makeBall(x,y);
    
    mypaddle.shapeName = 'normalPaddle';

    // Paddle doesn't move until the player tells it to.
    mypaddle.vx = 0
    mypaddle.vy = 0

    // Set a separate speed variable
    mypaddle.speed = 10;

    // Need to adjust the width and height
    mypaddle.width = 140;
    mypaddle.height = 20;

    // Paddles are rectangles
    mypaddle.makeShape = function(buffer) {
      buffer.noStroke();
      buffer.fill(0);
      buffer.rect(
        mypaddle.x,
        mypaddle.y,
        mypaddle.width,
        mypaddle.height
      );
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


  // Make an explosion of particles.
  function makeEffectExplosion(x, y) {
    // Randomly decide how many particles to generate.
    let numberOfParticles = sketch.random(3, 7);
    let multipliers = [-1, 1, -0.5, 0.5, 0.2, -0.2];

    for (let i = 0; i < numberOfParticles; i++) {

      // Inject a particle with semi random x and y velocity
      let particle = makeEffectParticle(x, y);
      particle.speed = sketch.random(1, 15);
      particle.vx = particle.speed * sketch.random(multipliers);
      particle.vy = particle.speed * sketch.random(multipliers);
      particles.push(particle);
    }
  }

  

  // Generate UI button controls
  function makeUiButton(label, x, y, w, h, screen, fs) {
    mybutton = sketch.createButton(label);
    mybutton.initX = x;
    mybutton.initY = y;
    mybutton.initWidth = w;
    mybutton.initHeight = h;
    mybutton.screen = screen;

    // The font size parameter is optional.
    if (fs) {
      mybutton.initFontSize = fs;
    }
    else {
      mybutton.initFontSize = 34;
    }

    // Set position and size based on game scale.
    mybutton.position(
      mybutton.initX * gameConfig.scale,
      mybutton.initY * gameConfig.scale
    );
    mybutton.size(
      mybutton.initWidth * gameConfig.scale,
      mybutton.initHeight * gameConfig.scale
    );
    
    // Font size, family, and style.
    mybutton.style('font-size', (mybutton.initFontSize * gameConfig.scale) + 'px');
    mybutton.style('font-family', gameConfig.fontName);
    mybutton.style('font-weight', 'bold');

    // DOES NOT WORK
    // Try to make button text unselectable and keep the long-press context
    // menu from appearing.
    //mybutton.setAttribute("unselectable", "on");
    //mybutton.style.MozUserSelect = "none";
    //mybutton.style.webkitUserSelect = "none";
   
    // Attach a class for additional styling.
    mybutton.class('buttons');


    return mybutton;
  }

  // Countdown before releasing the ball.
  function makeCountdown(start,tick, endAction) {
    cd = {}

    // Initial values
    cd.startValue = start + 1;
    cd.tickValue = tick + 1;

    // Iterating values
    cd.startValueSave = start + 1;
    cd.tickValueSave = tick + 1;

    // What to do when the countdown ends
    cd.end = endAction;

    cd.iterate = function() {
      if (cd.startValue > 0) {

        // If the tick value is greater than 0, decrement it.
        if (cd.tickValue > 0) {
          // console.log("Tick value: " + cd.tickValue);
          cd.tickValue--;
        }

        // Else, reset the tick value and decrement the start value.
        else {
          cd.tickValue = cd.tickValueSave;
          console.log("Start value: " + cd.tickValue);
          cd.startValue--;
        }

        // Tell the user what value we're on.
        let count = cd.startValue - 1;

        // Don't print anything on -1 count.
        if (count > -1) {

          // If we're on 0, set it to go;
          if (count == 0) {
            count = "Go!"
          }

          // Draw the text
          sketch.fill(0);
          sketch.stroke(255);
          sketch.strokeWeight(4);
          sketch.textAlign(sketch.CENTER);
          sketch.textSize(90 * gameConfig.scale);
          sketch.text(
            count,
            (gameConfig.areaWidth / 2) * gameConfig.scale,
            (gameConfig.areaHeight * 0.5) * gameConfig.scale
          );
        }

      }

      // When the countdown reaches 0, run the end() function.
      else {
        console.log("End function fired!");
        cd.startValue = cd.startValueSave;
        cd.tickValue = cd.tickValueSave;
        countdownRunning = false;
        cd.end();
      }
    }

    return cd;
  }

  // Reset the level, balls, and bricks.
  function resetGame() {

    // Reset all of the relevent values.
    playerScore = 0;
    bricks = [];
    balls = [];
    particles = [];
    gamePaused = false;
    gameConfig.level = 0;

    // Restore level 0 conditions, starting with the player's paddle.
    player = makePaddle(
      (gameConfig.areaWidth / 2) - 70,
      1100
    );

    // Make the ball.
    let newBall = (makeBall(0,0));

    // Position the ball over the paddle.
    newBall.x = player.x + (player.width / 2) - (newBall.width / 2)
    newBall.y = player.y - newBall.height - 6;

    // Add the ball to the array so it can be tracked.
    balls.push(newBall);

    // Set up level 0, which will populate the bricks[] array.
    Levels[gameConfig.level]();
  }
}

new p5(breakout, "canvas");
