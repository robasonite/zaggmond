// Robert's breakout
// Copyright 2020 Robasonite.com
// License: MIT
//
// Built with P5js
//
// A huge thankyou goes out to the great people of the Internet. Though we have never met, on or offline, this work would have been impossible without the efforts of the many YouTubers, Redditors, and bloggers who post content about JavaScript, Android, and game development. It's like a college education without a rigid schedule, classrooms, crappy professors, or rediculous debt. Thank you all so very much.


var breakout = function(sketch) {
  gameConfig = {
    scale: 1.0,
    areaWidth: 720,
    areaHeight: 1280,
    buttonFontHeight: 16,
    brickSpacing: 10,
    mode: 'title',
    uiBarHeight: 100,
    msgMaxTime: 60,
    font: '',
    fontName: '',
    level: 0
  }

  // Global pause variable; Nothing should be moving if true.
  let gamePaused = false;

  // Need to integrate timed message into the main game loop.
  let messages = [];

  // Make an array of balls.
  let balls = [];

  // Make an array of bricks.
  let bricks = [];

  // Make an array of effect particles.
  let particles = [];

  // Need another array for explosion points;
  let explosionPoints = []

  // Make an array of buttons.
  let buttons = [];

  // The player should be global
  let player;

  // Player score value
  let playerScore = 0;

  // Player lives
  let playerLives = 2;

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

  // Keep in mind that every other row is stagger!
  // The pattern goes 7 bricks, 6 bricks, 7 bricks, etc.
  let level0 = {}
  level0.bricks = [
    [0],
     [0],
    [0],
     [0],
    [0],
     [0],
    [1,1,1,1,1,1,1],
     [0],
    [2,2,2,2,2,2,2],
     [0,0,10,10,0,0],
    [3,3,3,3,3,3,3],
     [0],
    [4,4,4,4,4,4,4],
     [0],
    [5,5,5,5,5,5,5],
  ];
  Levels.push(level0);
 
  let level1 = {};
  level1.bricks = [
    [0],
     [0],
    [0],
     [1,2,3,4,5,6],
    [7,1,2,3,4,5,6],
     [7,1,2,3,4,5],
    [6,7,1,2,3,4,5],
     [6,7,1,2,3,4],
    [5,6,7,1,2,3,4],
     [5,6,7,1,2,3],
    [4,5,6,7,1,2,3],
     [4,5,6,7,1,2],
    [9,9,9,9,9,9,9],
     [3,10,10,10,10,1],
    [9,9,9,9,9,9,9],
     [2,3,4,5,6,7],
    [1,2,3,4,5,6,7],
     [1,2,3,4,5,6]
  ];
  Levels.push(level1);
  


  

  function levelReader(level) {
    // Grab the level bricks
    let levelBricks = level.bricks;

    // Make a brick to use as a model.
    let demoBrick = makeBrick(0,0);
   
    // Default for even rows.
    let xOffset = gameConfig.brickSpacing;
    let yOffset = gameConfig.uiBarHeight + gameConfig.brickSpacing;

    // Whether or not we are on a staggered row.
    let stagRow = false;

    // Each outer element is an array.
    for (let rowNum = 0; rowNum < levelBricks.length; rowNum++) {

      // Each element of an array is a brick number.
      for (let brickNum = 0; brickNum < levelBricks[rowNum].length; brickNum++) {

        // Set our x and y positions.
        // The Y position always goes up by half a brick height.
        let y = yOffset + (((demoBrick.height / 2) + (gameConfig.brickSpacing / 2)) * rowNum);

        // The X position depends on whether or not we're on a staggered row.
          let x = gameConfig.brickSpacing + ((demoBrick.width + gameConfig.brickSpacing) * brickNum);
        if (stagRow) {
          x += (demoBrick.width / 2) + (gameConfig.brickSpacing / 2);
        }

        // The brick making function
        let spawnBrick;

        // Choose which brick spawning function to run
        switch (levelBricks[rowNum][brickNum]) {
          // A value of 0 means no brick spawns
          case 1:
            spawnBrick = makeBrick(x, y);
            break;

          case 2:
            spawnBrick = makeBlueBrick(x, y);
            break;

          case 3:
            spawnBrick = makeGreenBrick(x, y);
            break;

          case 4:
            spawnBrick = makeOrangeBrick(x, y);
            break;

          case 5:
            spawnBrick = makeYellowBrick(x, y);
            break;

          case 6:
            spawnBrick = makeWhiteBrick(x, y);
            break;

          case 7:
            spawnBrick = makeGrayBrick(x, y);
            break;
          
          case 8:
            spawnBrick = makeInvincibleBrick(x, y);
            break;
          
          case 9:
            spawnBrick = makeArmoredBrick(x, y);
            break;
          
          case 10:
            spawnBrick = makeBombBrick(x, y);
            break;

          // If there's no match, set spawnBrick to false;
          default:
            spawnBrick = false;
        }

        // At this point, spawnBrick is either the value 'false', or a brick object.
        if (spawnBrick) {
          bricks.push(spawnBrick);
        }
      }

      // Toggle stagRow after each row.
      if (stagRow) {
        stagRow = false;
      }
      else {
        stagRow = true;
      }
    }
  }

  /*
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
          makeGrayBrick(
            gameConfig.brickSpacing + ((demoBrick.width + gameConfig.brickSpacing) * i),
            yOffset
          )
        );
      }
      yOffset += demoBrick.height + gameConfig.brickSpacing;
    }
    
    // Get the starting Y axis offset.
    yOffset = gameConfig.uiBarHeight + gameConfig.brickSpacing + (demoBrick.height / 2);
    let xOffset = (gameConfig.brickSpacing / 2) + (demoBrick.width / 2);
    
    // Make rows of bricks.
    for (let r = 0; r < rows; r++) {
      for (let i = 0; i < gameConfig.brickRowLength - 1; i++) {
        bricks.push(
          makeOrangeBrick(
            gameConfig.brickSpacing + ((demoBrick.width + gameConfig.brickSpacing) * i) + xOffset,
            yOffset + (gameConfig.brickSpacing / 2)
          )
        );
      }
      yOffset += demoBrick.height + gameConfig.brickSpacing;
    }
  }

  Levels.push(level_0); */

  // >> LEVEL SECTION END
  
  sketch.preload = function() {
    // Set the inital scale.
    gameConfig.scale = window.innerHeight / gameConfig.areaHeight;

    // Need to load sound files before trying to use them.
    soundEffects.ballHitWall = sketch.loadSound('sounds/hitWall.ogg');
    soundEffects.ballHitBrick = sketch.loadSound('sounds/hitBrick.ogg');
    soundEffects.ballHitPaddle = sketch.loadSound('sounds/hitPaddle.ogg');

    // Adjust the volume of the sound effects.
    soundEffects.ballHitWall.setVolume(0.2);
    soundEffects.ballHitBrick.setVolume(0.7);
    soundEffects.ballHitPaddle.setVolume(0.7);

    // Also preload the base font.
    gameConfig.font = sketch.loadFont('fonts/FiraMono-Medium.otf');
    gameConfig.fontName = 'FiraMono-Medium';
    
    // Before we draw ANYTHING, create shape buffers for the bricks
    shapeBlueprints.push(makeEffectParticle(0,0));
    shapeBlueprints.push(makeBombSpark(0,0));
    shapeBlueprints.push(makeBrick(0,0));
    shapeBlueprints.push(makeBlueBrick(0,0));
    shapeBlueprints.push(makeGreenBrick(0,0));
    shapeBlueprints.push(makeOrangeBrick(0,0));
    shapeBlueprints.push(makeYellowBrick(0,0));
    shapeBlueprints.push(makeWhiteBrick(0,0));
    shapeBlueprints.push(makeGrayBrick(0,0));
    shapeBlueprints.push(makeInvincibleBrick(0,0));
    shapeBlueprints.push(makeBombBrick(0,0));

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

      // Switch to the play screen
      switchScreen('play');

      // Pause the game
      gamePaused = true;

      // Inject a countdown into messages[].
      makeResumeCountdown();

      // Generate a test message
      /*let demoText = makeMessage("Welcome!");

      // Set the end action
      demoText.endAction = function() {
        gamePaused = false;
      }

      // Feed it to the game loop
      messages.push(demoText); */
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
      makeResumeCountdown();
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

  // The damage resolution function for bricks
  function resolveBrickDamage(brick) {
    // Damage the brick if it can be dstroyed.
    if (!brick.noDie) {
      brick.hp -= 1;
    }

    // Destroy the brick if HP is less than 1 AND noDie is false.
    if (brick.hp < 1 && brick.noDie == false) {
      // Brick is "destroyed"
      brick.visible = false;
      brick.alive = false;
      
      // Play the sound effect
      soundEffects.ballHitBrick.play();
      
      // Award points
      playerScore += brick.points;
      
      // If the brick is a bomb brick, trigger a bomb explosion.
      //console.log("bomb explosion triggered");
      if (brick.type == "bomb") {
        makeBombExplosion(
          brick.x + (brick.width / 2),
          brick.y + (brick.height / 2)
        );
      }

      // Else, trigger a regular particle explosion.
      else {
        makeEffectExplosion(
          brick.x + (brick.width / 2),
          brick.y + (brick.height / 2)
        );
      }

    }

    // If the brick is not destroyed, play the normal wall hit sound.
    else {
      soundEffects.ballHitWall.play();
    }
  }

  // The main game loop.
  // Updating function
  function simUpdate() {

    // Before doing ANYTHING, check for bricks.
    
    // Check for destructable bricks first.
    let regularBrickCount = 0;
    for (let x = 0; x < bricks.length; x++) {
      // If the brick is destructable, count it.
      if (bricks[x].noDie == false) {
        regularBrickCount++;
      }
    }


    // When there are no more destructible bricks, the level is "cleared".
    if (regularBrickCount == 0) {
      // If so, move the player to the next level, if there is one.
      gameConfig.level++
      if (Levels[gameConfig.level]) {
        resetPlayer();
        // Clear the the bricks to get rid of non-dstructable brick.
        bricks = [];

        // Also clear the particles
        particles = [];
        levelReader(Levels[gameConfig.level]);
        gamePaused = true;
        makeResumeCountdown();
      }

      else {
        console.log("You win!");
        resetGame();
        switchScreen('title');
      }
    }

    // Next, check for balls.
    else if (balls.length == 0) {
      // Player loses a life
      playerLives--;
      console.log(playerLives);

      // If the play has no lives left, game over.
      if (playerLives < 0) {
        // If not, game over.
        console.log("You LOSE!");
        resetGame();
        switchScreen('title');
      }

      // Else, reset with a new ball.
      else {
        resetPlayer();
        gamePaused = true;
        makeResumeCountdown();
      }
    }

    let aliveBalls = [];
    for (let x = 0; x < balls.length; x++) {
      // First, check if the ball is alive.
      if (balls[x].alive) {
        // If so, add it to aliveBalls.
        aliveBalls.push(balls[x]);

        // Take top and bottom bars into account for bounds checks.
        balls[x].boundsCheck(
          0,
          gameConfig.uiBarHeight,
          gameConfig.areaWidth,
          gameConfig.areaHeight - gameConfig.uiBarHeight 
        );

        // Check for paddle collisions.
        if (collider(balls[x], player)) {
          // Play the right sound, but not if it's already playing.
          if (!soundEffects.ballHitPaddle.isPlaying()) {
            soundEffects.ballHitPaddle.play();
          }
          

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
            resolveBrickDamage(bricks[b]);

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

        // Finally, move the ball.
        balls[x].move(gameConfig.scale);
      }
    }

    // Scrub dead balls.
    balls = aliveBalls;
    

    // Iterate over particles.
    let aliveParticles = []
    for (let i = 0; i < particles.length; i++) {

      // Update each particle's distance life.
      particles[i].checkDistance();

      // If still alive, save it for next frame and resolve it.
      if (particles[i].alive) {
        aliveParticles.push(particles[i]);

        // If the spark damages bricks, resolve collisions.
        // This causes continuous calls to makeBombExplosion!
        // DO NOT UNCOMMENT!
        /*if (particles[i].damageBricks) {
          for (let b = 0; b < bricks.length; b++) {
            if (collider(particles[i], bricks[b])) {
              // Remove the particle.
              particles[i].alive = false;

              // Resolve brick damage
              resolveBrickDamage(bricks[b]);
            }
          }
        }*/

        // Move the particle.
        particles[i].move(gameConfig.scale);
      }
    }

    // Remove dead particles.
    particles = aliveParticles;

    // Now resolve explosionPoints
    for (let e = 0; e < explosionPoints.length; e++) {
      for (let b = 0; b < bricks.length; b++) {
        // Don't apply damage to bricks that no longer alive.
        if (collider(explosionPoints[e], bricks[b]) && bricks[b].alive == true) {
          resolveBrickDamage(bricks[b]);
        }
      }
    }

    // After running through all explosions, reset the array.
    explosionPoints = [];


    
    // This part is mainly used for moving bricks, but it's also a good time to remove dead bricks.
    let aliveBricks = [];
    for (let x = 0; x < bricks.length; x++) {
      // Check if a brick is alive first
      if (bricks[x].alive) {
        // Is so, than it is alive and should be added to aliveBricks.
        aliveBricks.push(bricks[x]);
       
        // Next check if the brick is visible.
        if (bricks[x].visible) {

          // Next, do a bounds check.
          bricks[x].boundsCheck(
            0,
            0,
            gameConfig.areaWidth,
            gameConfig.areaHeight
          );

          // Then move the brick.
          bricks[x].move(gameConfig.scale);
        }
      }
    }
    
    // Remove bricks that are no longer alive.
    bricks = aliveBricks;


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

    // Update positions of balls, paddle, and bricks, BUT only if the game is NOT paused.
    if (!gamePaused) {
      simUpdate();
    }

    // Draw the balls.
    for (let x = 0; x < balls.length; x++) {
      // Draw all objects according to their buffered shape names.
      balls[x].draw(gameConfig.scale, shapeBuffers[balls[x].shapeName]);
    }
    
    // Draw the bricks.
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

    // Draw timed text messages with garbage collecting.
    let activeMessages = [];
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].active) {
        messages[i].showMessageText();
        activeMessages.push(messages[i]);
      }
    }

    messages = activeMessages;

    
    // Draw the top and bottom bars AFTER drawing all of the game elements.
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

    // Draw the player's score.
    showBarText(
      "Score: " + playerScore,
      20 * gameConfig.scale,
      50 * gameConfig.scale
    );


    // Draw the player's lives.
    showBarText(
      "Lives: " + playerLives,
      420 * gameConfig.scale,
      1250 * gameConfig.scale
    );
    
    // Tell the player what level we're on.
    showBarText(
      "Lvl: " + gameConfig.level,
      120 * gameConfig.scale,
      1250 * gameConfig.scale
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
       
          //console.log("Fullscreen scale: " + gameConfig.scale);
          //console.log("Fullscreen height: " + gameConfig.areaHeight * gameConfig.scale);
          //console.log("Screen height: " + window.screen.height);
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
    // Particles, and other game elements, must be 'alive' to prevent from
    // being garbage collected.
    myparticle.alive = true;

    // Some particles can damage bricks
    //myparticle.damageBricks = false;
   
    // Standard attributes like X and Y positions, velocity, speed, and dimensions.
    myparticle.x = x;
    myparticle.y = y;
    myparticle.vx = 0;
    myparticle.vy = 0;
    myparticle.speed = 2;
    myparticle.width = 4;
    myparticle.height = 4;

    // Set the color
    myparticle.color = sketch.color(255);

    myparticle.shapeName = 'particle';
    myparticle.makeShape = function(buffer) {
      buffer.strokeWeight(0);
      buffer.fill(myparticle.color);
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
    eparticle.maxDistance = 80;

    // When the particle travels far enough, it dies.
    eparticle.checkDistance = function() {
      if (eparticle.maxDistance > 0) {
        eparticle.maxDistance -= eparticle.speed;
      }
      else {
        eparticle.alive = false;
        
        // Optional function to run when the particle dies.
        if (eparticle.endAction) {
          eparticle.endAction();
        }
      }
    }

    return eparticle;
  }


  // Bomb sparks are closely related, but they trigger explosionPoints upon death.
  // Remember to set the target X and Y.
  function makeBombSpark(x, y, targetX, targetY) {
    let bspark = makeEffectParticle(x, y)
    bspark.shapeName = 'bombSpark';

    // Make sure the target x and y are defined.
    bspark.targetX = targetX;
    bspark.targetY = targetY;

    // Make bomb sparks bigger.
    bspark.width = 8;
    bspark.height = 8;
    
    // Make it travel faster.
    bspark.speed = 8;
   
    // Adjust max distance.
    //bspark.maxDistance = 48;

    // Make the spark red.
    bspark.color = sketch.color(255, 0, 0);
    
    // Make sparks trigger damage to other bricks upon death.
    bspark.endAction = function() {
      let ep = makeEffectParticle(
        bspark.targetX,
        bspark.targetY
      );
      ep.width = bspark.width;
      ep.height = bspark.height;
      ep.x -= ep.width / 2;
      ep.y -= ep.height / 2;
      explosionPoints.push(ep);

      //console.log(explosionPoints);
    }

    return bspark;
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

      // If the ball falls through the bottom of the screen, kill it.
      else if (myball.y + myball.height > y + height) {
        myball.y = y + height - myball.height -1;
        myball.vy *= -1;
        //hitWall = true;
        myball.alive = false;
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
    
    // And bricks award points to the player!
    mybrick.points = 10;

    // And they may take multiple hits.
    mybrick.hp = 1;

    // Color, red by default
    mybrick.color = sketch.color(255,0,0);

    // Draw diamonds instead of circles.
    mybrick.makeShape = function(buffer) {
      //buffer.noStroke();

      // Fill with specified color.
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
   
    // Or they could be invincible
    mybrick.noDie = false;


    return mybrick;
  }

  function makeBlueBrick(x, y) {
    let mybrick = makeBrick(x, y);
    mybrick.color = sketch.color(0,0,255);
    mybrick.shapeName = 'blueBrick';
    return mybrick;
  }
  
  function makeGreenBrick(x, y) {
    let mybrick = makeBrick(x, y);
    mybrick.color = sketch.color(0,255,0);
    mybrick.shapeName = 'greenBrick';
    return mybrick;
  }
  
  function makeOrangeBrick(x, y) {
    let mybrick = makeBrick(x, y);
    mybrick.color = sketch.color(255,165,0);
    mybrick.shapeName = 'orangeBrick';
    return mybrick;
  }
  
  function makeYellowBrick(x, y) {
    let mybrick = makeBrick(x, y);
    mybrick.color = sketch.color(255,255,0);
    mybrick.shapeName = 'yellowBrick';
    return mybrick;
  }
  
  function makeWhiteBrick(x, y) {
    let mybrick = makeBrick(x, y);
    mybrick.color = sketch.color(255,255,255);
    mybrick.shapeName = 'whiteBrick';
    return mybrick;
  }
  
  function makeGrayBrick(x, y) {
    let mybrick = makeBrick(x, y);
    mybrick.color = sketch.color(128);
    mybrick.shapeName = 'grayBrick';
    return mybrick;
  }
  

  // These bricks can not be destroyed.
  function makeInvincibleBrick(x, y) {
    let mybrick = makeBrick(x, y);
    mybrick.color = sketch.color(0);
    mybrick.shapeName = 'invincibleBrick';
    mybrick.noDie = true;
    return mybrick;
  }


  // These bricks blow up when destroyed.
  function makeBombBrick(x, y) {
    let mybrick = makeBrick(x, y);
    mybrick.color = sketch.color(0);
    mybrick.shapeName = 'bombBrick';

    // Make resolveBrickDamage() create explosionPoints.
    mybrick.type = 'bomb';

    // These bricks are drawn differently.
    mybrick.draw = function(scale, buffer) {
      // Draw the main brick first like normal
      sketch.image(
        buffer,
        mybrick.x * scale,
        mybrick.y * scale,
        mybrick.width * scale,
        mybrick.height * scale 
      );

      // Next, define multipliers for rendering the inner diamond.
      let whMultiplier = 0.5;
      let xyMultiplier = whMultiplier / 2;

      // Render a small red brick for the center
      sketch.image(
        shapeBuffers.redBrick,
        (mybrick.x + (mybrick.width * xyMultiplier)) * scale,
        (mybrick.y + (mybrick.height * xyMultiplier)) * scale,
        (mybrick.width - (mybrick.width * whMultiplier)) * scale,
        (mybrick.height - (mybrick.height * whMultiplier)) * scale,
      );
    }

    return mybrick;
  }

  
  // These bricks take 3 hits to die and reuse existing shape buffers.
  function makeArmoredBrick(x, y) {
    let mybrick = makeBrick(x, y);
    mybrick.hp = 4;

    // These need a different kind of draw function to shop HP left.
    mybrick.draw = function(scale, buffer) {
      // Draw the main brick first like normal
      sketch.image(
        buffer,
        mybrick.x * scale,
        mybrick.y * scale,
        mybrick.width * scale,
        mybrick.height * scale 
      );

      // Next, define multipliers for rendering the inner diamond.
      let whMultiplier = 0.5;
      let xyMultiplier = whMultiplier / 2;

      // By default, we want the inner diamond to be black, which is going to use the invincibleBrick shape buffer.
      let innerBuffer = shapeBuffers.invincibleBrick;

      // Next, we use the HP to determine which buffer to replace this with.
      if (mybrick.hp == 3) {
        innerBuffer = shapeBuffers.grayBrick;
      }

      else if (mybrick.hp == 2) {
        innerBuffer = shapeBuffers.whiteBrick;
      }
      

      // Only draw the inner diamond if the HP is greater than 1.
      if (mybrick.hp > 1) {
        sketch.image(
          innerBuffer,
          (mybrick.x + (mybrick.width * xyMultiplier)) * scale,
          (mybrick.y + (mybrick.height * xyMultiplier)) * scale,
          (mybrick.width - (mybrick.width * whMultiplier)) * scale,
          (mybrick.height - (mybrick.height * whMultiplier)) * scale,
        );
      }
    }
    
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
  
  // Make an explosion of particles and deal damage to surrounding bricks.
  function makeBombExplosion(x, y) {
    // Make 8 sparks, one for each direction.
    // Upon death, each spark hits its target.
    
    // Need a demo brick
    let demoBrick = makeBrick(0, 0);

    //console.log("Bomb brick origin: " + x + "," + y);

    // Each spark has a target
    let leftParticle = makeBombSpark(
      x, 
      y,
      x - demoBrick.width,
      y
    );
    //console.log("Left particle: " + (x - demoBrick.width) + "," + y);
    leftParticle.vx = leftParticle.speed * -1;
    leftParticle.vy = 0;
    particles.push(leftParticle);
    
    let upParticle = makeBombSpark(
      x,
      y,
      x,
      y - demoBrick.height
    );
    upParticle.vx = 0;
    upParticle.vy = upParticle.speed * -1;
    particles.push(upParticle);
    
    let rightParticle = makeBombSpark(
      x,
      y,
      x + demoBrick.width,
      y
    );
    rightParticle.vx = rightParticle.speed;
    rightParticle.vy = 0;
    particles.push(rightParticle);
    
    let downParticle = makeBombSpark(
      x,
      y,
      x,
      y + demoBrick.height
    );
    downParticle.vx = 0;
    downParticle.vy = downParticle.speed;
    particles.push(downParticle);
    
    let upperLeft = makeBombSpark(
      x,
      y,
      x - demoBrick.width,
      y - demoBrick.height
    );
    upperLeft.vx = upperLeft.speed * -1;
    upperLeft.vy = upperLeft.speed * -1;
    particles.push(upperLeft);
    
    let upperRight = makeBombSpark(
      x,
      y,
      x + demoBrick.width,
      y - demoBrick.height
    );
    upperRight.vx = upperRight.speed;
    upperRight.vy = upperRight.speed * -1;
    particles.push(upperRight);
    
    let lowerRight = makeBombSpark(
      x,
      y,
      x + demoBrick.width,
      y + demoBrick.height
    );
    lowerRight.vx = lowerRight.speed;
    lowerRight.vy = lowerRight.speed;
    particles.push(lowerRight);
    
    let lowerLeft = makeBombSpark(
      x,
      y,
      x - demoBrick.width,
      y + demoBrick.height
    );
    lowerLeft.vx = lowerLeft.speed * -1;
    lowerLeft.vy = lowerLeft.speed;
    particles.push(lowerLeft);
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

  // Function that makes message text objects
  function makeMessage(txt) {
    let msg = {}

    // X, Y, and message text.
    msg.x = 400 * gameConfig.scale;
    msg.y = 400 * gameConfig.scale;
    msg.txt = txt;
    msg.fontSize = 100;
    msg.fillColor = sketch.color(0);
    msg.strokeColor = sketch.color(255);
    msg.strokeWeight = 4;

    // Whether or not the msg object is active.
    msg.active = true;

    // How long the msg object should live
    msg.maxTime = gameConfig.msgMaxTime;

    // A counter to increment every frame
    msg.time = 0;

    // The text drawing function
    msg.showMessageText = function() {
      
      // If time is less than maxTime, show the message
      if (msg.time < msg.maxTime) {
        sketch.textAlign(sketch.CENTER);
        sketch.textSize(msg.fontSize * gameConfig.scale);
        sketch.fill(msg.fillColor);
        if (msg.strokeWeight > 0) {
          sketch.strokeWeight(msg.strokeWeight);
        }
        sketch.stroke(msg.strokeColor)
        sketch.text(
          msg.txt,
          (gameConfig.areaWidth / 2) * gameConfig.scale,
          (gameConfig.areaHeight / 2) * gameConfig.scale
        );
        sketch.noStroke();

        // Increment the time
        msg.time++;
      }

      // Else, mark the msg object as inactive so that gets deleted.
      else {
        msg.active = false;

        // Check for an end-action function
        if (msg.endAction) {
          msg.endAction();
        }
      }
    }

    return msg
  }

  // String a set of 4 messages together to make the countdown.
  function makeResumeCountdown() {

    // Start with the first message
    let threeCountMessage = makeMessage("3");

    // Define the end action to display the next number.
    threeCountMessage.endAction = function() {
      let twoCountMessage = makeMessage("2");

      twoCountMessage.endAction = function() {
        let oneCountMessage = makeMessage("1");

        oneCountMessage.endAction = function() {
          let goMessage = makeMessage("Go!");

          goMessage.endAction = function() {
            gamePaused = false;
          }

          messages.push(goMessage);
        }

        messages.push(oneCountMessage);
      }

      messages.push(twoCountMessage);
    }

    // Push this into the main messages array.
    messages.push(threeCountMessage);
  }

  // Function that shows bar text
  function showBarText(message, x, y) {
    sketch.fill(255);
    sketch.textAlign(sketch.LEFT);
    sketch.textSize(40 * gameConfig.scale);
    sketch.text(message, x, y);
  }

  
  // Reset the balls and bricks. Used when moving to the next level.
  function resetPlayer() {
    
    // Prepare level, starting with the player's paddle.
    player = makePaddle(
      (gameConfig.areaWidth / 2) - 70,
      1100
    );

    // Make the ball.
    balls = [];
    let newBall = (makeBall(0,0));

    // Position the ball over the paddle.
    newBall.x = player.x + (player.width / 2) - (newBall.width / 2)
    newBall.y = player.y - newBall.height - 6;

    // Add the ball to the array so it can be tracked.
    balls.push(newBall);

  }

  // Reset the level, balls, and bricks.
  function resetGame() {

    // Reset all of the relevent values.
    bricks = [];
    particles = [];
    playerScore = 0;
    playerLives = 2;
    gameConfig.level = 0;
    gamePaused = false;

    // Reset player and ball
    resetPlayer();
    
    // Set up the level
    levelReader(Levels[gameConfig.level]);
  }
}

new p5(breakout, "canvas");
