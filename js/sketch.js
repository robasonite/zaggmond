// Robert's breakout, Zaggmond
// Copyright 2020 Robasonite.com
// License: MIT
//
// Built with P5js
//
// A huge thankyou goes out to the great people of the Internet. Though we have never met, on or offline, this work would have been impossible without the efforts of the many YouTubers, Redditors, and bloggers who post content about JavaScript, Android, and game development. It's like a college education without a rigid schedule, classrooms, crappy professors, or rediculous debt. Thank you all so very much.
//
// TODO:
// - *DONE* Set up a basic loading screen
// - *DONE* Design a some level backgrounds
// - *DONE* Implement some kind of power-up system
// - *DONE* Get moving bricks working
// - Get bullets working

var breakout = function(sketch) {
  gameConfig = {
    canvas: '',
    compStyle: '',
    buttonOffsetX: '',
    scale: 1.0,
    areaWidth: 720,
    areaHeight: 1280,
    buttonFontHeight: 16,
    brickSpacing: 10,
    mode: 'loading',
    uiBarHeight: 100,
    msgMaxTime: 60,
    font: '',
    fontName: '',
    level: 0
  };

  // Give gameConfig a function for getting the current style rules and the current buttonOffsetX.
  gameConfig.getCompStyle = function() {
    // Get the style rules
    let targetElement = gameConfig.canvas.elt;
    gameConfig.compStyle = targetElement.currentStyle || window.getComputedStyle(targetElement);

    // Get the current left margin as a floating point number.
    gameConfig.buttonOffsetX = parseFloat(gameConfig.compStyle.marginLeft);
  };

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

  // Need another element for powerups.
  let powerups = [];

  // Bullets get their own array.
  let bullets = [];
  let weapons = [];

  // Need another array for explosion points.
  let explosionPoints = []

  // Make an array of buttons.
  let buttons = [];

  // The player should be global.
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
  let level1 = {}
  level1.backgroundImage = 'img/background1.jpg';
  level1.bricks = [
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
 
  let level2 = {};
  level2.backgroundImage = 'img/background2.jpg';
  level2.bricks = [
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
  
  let level3 = {};
  level3.backgroundImage = 'img/background3.jpg';
  level3.bricks = [
    [0],
     [0],
    [0],
     [0],
    [0,6,0,0,0,6,0],
     [0,6,0,0,6,0],
    [0,0,6,0,6,0,0],
     [0,0,6,6,0,0],
    [1,2,1,10,1,2,1],
     [7,6,7,7,6,7],
    [1,2,1,10,1,2,1],
     [5,7,5,5,7,5],
    [1,2,1,10,1,2,1],
     [5,7,5,5,7,5],
    [1,2,1,10,1,2,1],
     [7,6,7,7,6,7],
    [0,0,0,10,0,0,0],
     [0,0,6,6,0,0],
    [0,0,0,10,0,0,0],
     [0,0,6,6,0,0],
    [0,0,0,10,0,0,0],
     [0,0,6,6,0,0],
    [0,0,0,10,0,0,0],
     [0,0,6,6,0,0],
    [0,0,0,10,0,0,0],
     [0,0,6,6,0,0],
    [0,0,0,10,0,0,0],
     [0,0,6,6,0,0],
    [0,0,0,10,0,0,0],
     [0,0,6,6,0,0],
    [0,0,0,6,0,0,0],
  ];
  
  let level4 = {};
  level4.backgroundImage = 'img/background4.jpg';
  level4.bricks = [
    [0],
     [0],
    [0],
     [0],
    [0,0,0,2,0,0,0],
     [0,0,2,2,0,0],
    [0,0,2,6,2,0,0],
     [0,2,6,6,2,0],
    [0,2,6,0,6,2,0],
     [2,6,0,0,6,2],
    [2,6,0,9,0,6,2],
     [6,0,9,9,0,6],
    [2,0,9,10,9,0,2],
     [6,0,10,10,0,6],
    [2,0,9,10,9,0,2],
     [6,0,10,10,0,6],
    [2,0,9,9,9,0,2],
     [6,0,0,0,0,6],
    [2,6,0,0,0,6,2],
     [0,6,0,0,6,0],
    [6,0,6,0,6,0,6],
     [0],
    [6,0,6,0,6,0,6],
     [0],
    [6,0,6,0,6,0,6],
     [0],
    [6,0,9,0,9,0,6],
     [0],
    [9,0,0,0,0,0,9],
  ];
  
  let level5 = {};
  level5.backgroundImage = 'img/background6.jpg';
  level5.bricks = [
    [0],
     [0],
    [0],
     [10,10,10,10,10,10],
    [10,1,1,10,1,1,10],
     [0,0,10,0,0,0],
    [10,0,0,10,0,0,10],
     [2,2,10,2,2,2],
    [10,2,2,10,2,2,10],
     [0,0,10,0,10,0],
    [10,0,0,10,0,0,10],
     [3,3,10,3,10,3],
    [10,3,3,10,3,3,10],
     [0,0,10,0,10,0],
    [10,0,0,10,0,0,10],
     [4,4,10,4,10,4],
    [10,4,4,10,4,4,10],
     [0,0,10,0,10,0],
    [10,0,0,10,0,0,10],
     [5,5,10,5,10,5],
    [10,5,5,10,5,5,10],
     [0,0,10,0,10,0],
    [10,0,0,10,0,0,10],
     [6,6,10,6,10,6],
    [10,6,6,10,6,6,10],
     [0,0,10,0,10,0],
    [10,0,0,10,0,0,10],
     [7,7,10,7,7,10],
    [0,7,7,10,7,7,7],
     [0,0,9,9,0,0],
  ];
  
  let level6 = {};
  level6.backgroundImage = 'img/background1.jpg';
  level6.bricks = [
    [0],
     [0],
    [0],
     [0],
    [0,0,0,4,0,0,0],
     [0],
    [0,0,0,4,0,0,0],
     [0,4,6,6,4,0],
    [0,5,5,5,5,5,0],
     [6,6,6,6,6,6],
    [1,2,1,2,1,2,1],
     [6,6,6,6,6,6],
    [0],
     [0],
    [6,1,1,1,1,1,6],
     [6,6,6,6,6,6],
    [0,6,6,6,6,6,0],
     [0,3,3,3,3,0],
    [0,0,3,3,3,0,0],
     [0,0,3,3,0,0],
    [0,0,0,3,0,0,0],
  ];

  // This level has special bricks.
  level6.specialBricks = [];

  function movingBrick1() {
    let brickTotal = 8;
    let armored = true;
    let demoBrick = makeBrick(0,0);
    for (let i = 0; i < brickTotal; i++) {

      // Flip between armored and invincible bricks.
      let brickMaker;
      if (armored) {
        brickMaker = makeArmoredBrick;
        armored = false;
      }
      else {
        brickMaker = makeInvincibleBrick;
        armored = true;
      }


      // Make the required brick.
      let mybrick = makeMovingBrickHorizontal(
        brickMaker,
        gameConfig.brickSpacing + ((gameConfig.brickSpacing + demoBrick.width) * i),
        gameConfig.uiBarHeight + ((gameConfig.brickSpacing + demoBrick.height) * 6.4),
        7
      );

      // Make sure the bounding box starts all the way to the left.
      mybrick.bounds.x = gameConfig.brickSpacing;

      // Make them move faster
      mybrick.vx = 8;
      mybrick.speed = 8;

      // If we're over 7, reverse the direction and correct the initial X position.
      if (i > 6) {
        let over = brickTotal - i;
        mybrick.vx *= -1;
        mybrick.x = (gameConfig.brickSpacing + demoBrick.width) * (0.5 + over);
      }
     
      // Add the brick.
      bricks.push(mybrick);
    }
  }

  level6.specialBricks.push(movingBrick1);


  let level7 = {};
  level7.backgroundImage = 'img/background6.jpg';
  level7.bricks = [
    [0],
     [0],
    [0],
     [0],
    [0],
     [0],
    [0],
     [0,0,3,3,0,0],
    [1,1,0,0,0,1,1],
     [10,0,6,6,0,8],
    [1,1,0,0,0,1,1],
     [8,0,6,6,0,10],
    [6,6,7,7,7,6,6],
     [6,7,10,10,7,6],
    [0,6,7,10,7,6,0],
     [0,7,6,6,7,0],
    [0,0,6,6,6,0,0],
     [0,6,6,6,6,0],
    [0,6,0,0,0,6,0],
     [6,0,6,6,0,6],
    [0,0,6,0,6,0,0],
     [6,0,0,0,0,6],
    [0,0,9,0,9,0,0],
     [9,0,0,0,0,9]
  ];
  
  let level8 = {};
  level8.backgroundImage = 'img/background7.jpg';
  level8.bricks = [
    [0],
     [0],
    [0],
     [0],
    [0,0,0,2,0,0,0],
     [0,0,0,0,0,0],
    [0,0,0,5,0,0,0],
     [0,0,0,0,0,0],
    [0,3,0,5,0,3,0],
     [0,0,5,5,0,0],
    [0,5,6,10,6,5,0],
     [0,5,5,5,5,0],
    [0,6,6,6,6,6,0],
     [0,1,1,1,1,0],
    [0,5,10,5,10,5,0],
     [0,6,6,6,6,0],
    [0,5,5,5,5,5,0]
  ]

  // Special properties required for the special function.
  // Max number of bricks to spawn
  level8.maxBricks = 22;
  
  // A reference model for normal bricks
  level8.demoBrick = makeBrick(0,0);

  // Default brick speed
  level8.brickSpeed = 8;

  // Brick step and delay values
  level8.brickStep = gameConfig.brickSpacing + level8.demoBrick.width;
  level8.spawnDelay = level8.brickStep / level8.brickSpeed;
  level8.spawnDelaySave = level8.spawnDelay;

  // Tell the function to stop.
  level8.stopSpawn = false;

  // Whether to spawn an armored brick.
  level8.spawnArmored = false
  
  // This level has a special function.
  level8.specialFunction = function() {
    if (!level8.stopSpawn) {
      if (level8.spawnDelay > 0) {
        level8.spawnDelay--;
      }
      else {
        if (level8.maxBricks > 0) {
          let brickMaker;
          if (level8.spawnArmored) {
            brickMaker = makeArmoredBrick;
            level8.spawnArmored = false;
          }
          else {
            brickMaker = makeBlueBrick;
            level8.spawnArmored = true;
          }
          mybrick = makeMovingBrickRectPath(
            brickMaker,
            gameConfig.brickSpacing,
            gameConfig.uiBarHeight + gameConfig.brickSpacing,
            7
          );
          mybrick.bounds.height = ((mybrick.width + gameConfig.brickSpacing) * 7) - gameConfig.brickSpacing
          mybrick.speed = 8;
          mybrick.vx = mybrick.speed;
          bricks.push(mybrick);

          // Make sure to decrement this number to prevent infinite spawning
          level8.maxBricks--;
        }

        level8.spawnDelay = level8.spawnDelaySave;
      }
    }
  }
  

  let level9 = {};
  level9.backgroundImage = 'img/background5.jpg';
  level9.bricks = [
    [0],
     [0],
    [0],
     [0],
    [0,0,0,3,0,0,0],
     [0,0,3,3,0,0],
    [0,0,3,10,3,0,0],
     [0,3,1,1,3,0],
    [0,3,1,1,1,3,0],
     [3,1,1,1,1,3],
    [0,3,1,1,1,3,0],
     [3,3,1,1,3,3],
    [0,4,3,10,3,2,0],
     [3,4,3,3,2,3],
    [0,4,4,3,2,2,0],
     [3,4,10,10,2,3],
    [0,4,4,3,2,2,0],
     [3,4,4,2,2,3],
    [0,10,4,3,2,10,0],
     [3,4,4,2,2,3],
    [0,3,4,3,2,3,0],
     [0,3,4,2,3,0],
    [0,0,3,3,3,0,0],
     [0,0,3,3,0,0],
    [0,0,0,3,0,0,0],
  ];


  Levels.push(level1);
  Levels.push(level2);
  Levels.push(level3);
  Levels.push(level4);
  Levels.push(level5);
  Levels.push(level6);
  Levels.push(level7);
  Levels.push(level8);
  Levels.push(level9);


  

  function levelReader(level) {
    // Grab the level bricks.
    let levelBricks = level.bricks;

    // Make a brick to use as a model.
    let demoBrick = makeBrick(0,0);
   
    // Default for even rows.
    let xOffset = gameConfig.brickSpacing;
    let yOffset = gameConfig.uiBarHeight + gameConfig.brickSpacing;

    // Whether or not we are on a staggered row.
    let stagRow = false;

    // > NORMAL BRICK HANDLING
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

        // Brick guide
        // Choose which brick spawning function to run.
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
    
    // > END NORMAL BRICK HANDLING

    // Custom brick processing.
    // These are special functions for non-standard bricks.
    // They run as soon as a level is started, when the rest of the bricks spawn in.
    if (level.specialBricks) {
      let sb = level.specialBricks;
      for (let i = 0; i < sb.length; i++) {
        // Run the special brick function.
        sb[i]();
      }
      //console.log(sb.length);
    }

    // If the level has no special function declared, set it to false.
    // This is really just to make sure that the property exists so that 'simUpdate()' doesn't freak out.
    if (!level.hasOwnProperty('specialFunction')) {
      level.specialFunction = false;
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
  


  // >> ACTIVE LOADER SECTION
  // Load sound files.
  let totalAudioFiles = 0;
  let loadedAudioFiles = 0;
  let audioLoadingDone = false;

  // Load audio files and attach them to soundEffects.
  function audioLoader(sa) {
    // Volume level is optional.
    let volume = 1.0
    if (sa[2]) {
      volume = sa[2];
    }

    // The effect name and sound file are not optional.
    let effectName = sa[0];
    let soundFile = sa[1];
    

    // Function to run upon success.
    function soundLoaded(sound) {

      // Increment the loaded audio file counter.
      loadedAudioFiles++;

      // Set the volume of the sound file.
      soundEffects[effectName].setVolume(volume);

      // Change playback mode to restart
      //soundEffects[effectName].playMode('restart');

      //console.log("File: " + sound.file);
      //console.log("volume: " + volume);
     
      // Mark audio loading done.
      if (loadedAudioFiles == totalAudioFiles) {
        audioLoadingDone = true;
        //console.log("All audio loaded");
      }

    }

    // Load the sound file with a callback.
    soundEffects[effectName] = sketch.loadSound(soundFile, soundLoaded);

  }

  // Load the font file.
  let fontFileLoaded = false;
  function fontLoader(fa) {
    let fontFile = fa[0];
    let fontName = fa[1];

    // Check for success.
    function fontLoaded() {
      fontFileLoaded = true;

      // Set the fontName for buttons.
      gameConfig.fontName = fontName;

      // Set the font
      sketch.textFont(gameConfig.font);

      //console.log("Font loaded.");

    }

    // Try to load the font.
    gameConfig.font = sketch.loadFont(fontFile, fontLoaded);
  }

  // Sprite loading
  let totalSprites = 0;
  let loadedSprites = 0;
  let spriteLoadingDone = false;

  // This function process shap blueprint objects.
  function spriteLoader(blueprint) {

    // Success callback
    function spriteLoaded() {
      loadedSprites++;

      // Check if we're don loading sprites.
      if (loadedSprites == totalSprites) {
        spriteLoadingDone = true;
        //console.log("All " + totalSprites + " sprites loaded.");
      }
    }

    // Make the buffer
    shapeBuffers[blueprint.shapeName] = sketch.createGraphics(blueprint.width, blueprint.height);

    // If the blueprint has a sprite, load it and replace the buffer.
    if (blueprint.sprite) {
      shapeBuffers[blueprint.shapeName] = sketch.loadImage(blueprint.sprite, spriteLoaded);
    }

    // Else, run the makeShape function.
    else {
      blueprint.makeShape(shapeBuffers[blueprint.shapeName]);
      spriteLoaded();
    }
  }



  // Level backgrounds
  let loadedLevelBackgrounds = 0;
  let totalLevelBackgrounds = 0;
  let allLevelBackgroundsLoaded = false;
  function levelBackgroundLoader(level) {
    let img = '';

    // Success callback
    function backgroundLoaded() {
      loadedLevelBackgrounds++;
      level.background = img;

      if (loadedLevelBackgrounds == totalLevelBackgrounds) {
        allLevelBackgroundsLoaded = true;

        //console.log("All " + totalLevelBackgrounds + " level backgrounds loaded.");
      }
    }

    img = sketch.loadImage(level.backgroundImage, backgroundLoaded);
  }


  // Determine whether everything has been loaded and fire switchScreen() ONLY
  // ONCE.
  let everythingLoaded = false;
  let preloaderStopped = false;

  function checkLoading() {
    if (everythingLoaded) {
      if (preloaderStopped == false) {
        preloaderStopped = true;
        switchScreen('title');
      }

      else {
        // Tell the main draw function that everything is loaded.
        return true;
      }
    }

    else {
      if (
        audioLoadingDone &&
        fontFileLoaded &&
        spriteLoadingDone &&
        allLevelBackgroundsLoaded) {
        everythingLoaded = true;
      }

      // Tell the main draw function that we're still loading.
      return false;
    }
  }


  // >> END ACTIVE LOADER SECTION
 

  sketch.preload = function() {
    // Set the inital scale.
    gameConfig.scale = window.innerHeight / gameConfig.areaHeight;

    // Need to load sound files before trying to use them.
    //soundEffects.ballHitWall = sketch.loadSound('sounds/hitWall.ogg');
    //soundEffects.ballHitBrick = sketch.loadSound('sounds/hitBrick.ogg');
    //soundEffects.ballHitPaddle = sketch.loadSound('sounds/hitPaddle.ogg');

    // Adjust the volume of the sound effects.
    //soundEffects.ballHitWall.setVolume(0.2);
    //soundEffects.ballHitBrick.setVolume(1.7);
    //soundEffects.ballHitPaddle.setVolume(0.7);

    // Also preload the base font.
    //gameConfig.font = sketch.loadFont('fonts/FiraMono-Medium.otf');
    //gameConfig.fontName = 'FiraMono-Medium';
    
    // Before we draw ANYTHING, create shape buffers for the game objects.
    /*shapeBlueprints.push(makeEffectParticle(0,0));
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
    shapeBlueprints.push(makePowerupGrowPaddle(0,0));
    shapeBlueprints.push(makePowerupShrinkPaddle(0,0));

    // Count the sprites.
    totalSprites = shapeBlueprints.length;
    
    for (let i = 0; i < shapeBlueprints.length; i++) {
      // Make the buffer
      shapeBuffers[shapeBlueprints[i].shapeName] = sketch.createGraphics(shapeBlueprints[i].width, shapeBlueprints[i].height);

      // Check if the shape has an image file. If so, preload it.
      if (shapeBlueprints[i].sprite) {
        shapeBuffers[shapeBlueprints[i].shapeName] = sketch.loadImage(shapeBlueprints[i].sprite);
      }

      else {
        // If not, run its shape drawing function.
        shapeBlueprints[i].makeShape(shapeBuffers[shapeBlueprints[i].shapeName]);
      }
    } */

    // Also preload all level backgrounds.
    /*for (let i = 0; i < Levels.length; i++) {
      if (Levels[i].backgroundImage) {
        let img = sketch.loadImage(Levels[i].backgroundImage);
        Levels[i].background = img;
      }
    }*/
  }

  sketch.setup = function() {
    // put setup code here

    // Create the canvas
    gameConfig.canvas = sketch.createCanvas(
      gameConfig.areaWidth * gameConfig.scale,
      gameConfig.areaHeight * gameConfig.scale
    );

    // Get the current style of the canvas
    gameConfig.getCompStyle();


    // Load audio files
    let audioArray = [
      ['ballHitWall', 'sounds/hitWall.ogg'],
      ['ballHitBrick', 'sounds/hitBrick.ogg'],
      ['ballHitPaddle', 'sounds/hitPaddle.ogg'],
      ['powerupCollect', 'sounds/powerupCollect.ogg'],
      ['bulletFire', 'sounds/bulletFire.ogg']
    ];

    // Tell the program how many audi files there are.
    totalAudioFiles = audioArray.length;

    for (let i = 0; i < totalAudioFiles; i++) {
      audioLoader(audioArray[i]);
    }

    // Load the game font.
    fontLoader(['fonts/FiraMono-Medium.otf', 'FiraMono-Medium']);

    // Load or make all of the sprites.
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
    shapeBlueprints.push(makeBullet(0,0));
    shapeBlueprints.push(makeCannon(0,0));
    shapeBlueprints.push(makePaddle(0,0));
    shapeBlueprints.push(makePowerupCannons(0,0));
    shapeBlueprints.push(makePowerupGrowPaddle(0,0));
    shapeBlueprints.push(makePowerupShrinkPaddle(0,0));
    shapeBlueprints.push(makePowerupKillPaddle(0,0));
    shapeBlueprints.push(makePowerupGive100(0, 0));
    shapeBlueprints.push(makePowerupGive200(0, 0));
    shapeBlueprints.push(makePowerupGive500(0, 0));
    shapeBlueprints.push(makePowerupGive1k(0, 0));
    shapeBlueprints.push(makeNoBorderInvincibleBrick(0,0));
    shapeBlueprints.push(makeNoBorderGrayBrick(0,0));
    shapeBlueprints.push(makeNoBorderWhiteBrick(0,0));
    shapeBlueprints.push(makeNoBorderBrick(0,0));
    shapeBlueprints.push(makeNoBorderYellowBrick(0,0));
    shapeBlueprints.push(makeNoBorderGreenBrick(0,0));

    // Count the sprites.
    totalSprites = shapeBlueprints.length;

    for (let i = 0; i < totalSprites; i++) {
      spriteLoader(shapeBlueprints[i]);
    }

    // Count the level backgrounds
    for (let i = 0; i < Levels.length; i++) {
      if (Levels[i].backgroundImage) {
        totalLevelBackgrounds++;
      }
    }
    
    for (let i = 0; i < Levels.length; i++) {
      if (Levels[i].backgroundImage) {
        levelBackgroundLoader(Levels[i]);
      }
    }


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
      (gameConfig.areaWidth / 2) - (270 / 2),
      gameConfig.areaHeight * 0.4,
      270,
      140,
      'title',
      70
    );
    
    startBtn.mousePressed(function() {

      // Set up the game
      resetGame();

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
      //resetGame();
      switchScreen('title');
    });
    
    buttons.push(quitBtn);
    
    let resumeBtn = makeUiButton(
      'RESUME',
      (gameConfig.areaWidth / 2) - (340 / 2),
      gameConfig.areaHeight * 0.5,
      340,
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
      gameConfig.areaWidth - gameConfig.uiBarHeight,
      gameConfig.areaHeight - gameConfig.uiBarHeight,
      gameConfig.uiBarHeight,
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
    //resetGame();

    // Start the game with the preloader.
    switchScreen('loading');
  }

  // The damage resolution function for bricks
  function resolveBrickDamage(brick) {
    // Damage the brick if it can be dstroyed.
    brick.hp -= 1;

    // Destroy the brick if HP is less than 1
    if (brick.hp < 1) {
      // Brick is "destroyed"
      brick.visible = false;
      brick.alive = false;
      
      // Play the sound effect
      soundEffects.ballHitBrick.play();
      
      // Award points
      playerScore += brick.points;

      // If the brick had a power up, spawn it.
      /*if (brick.dropPowerup) {
        brick.dropPowerup();
      }*/

      // Decide to generate a powerup by random chance
      let dropval = sketch.random();
      //console.log(dropval);
      // 20% chance to spawn a powerup
      if (dropval > 0.8) {
        // Drop a powerup
        let pu = pickPowerup(
          brick.x + (brick.width / 2),
          brick.y + brick.height
        )
        powerups.push(pu);
      }
      
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
      // If the brick is not supposed to be destroyed, don't count it.
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

        // And the powerups
        powerups = [];

        // And bullets
        bullets = [];
        weapons = [];
        levelReader(Levels[gameConfig.level]);
        gamePaused = true;
        makeResumeCountdown();
      }

      else {
        //console.log("You win!");
        switchScreen('title');
      }
    }

    // Next, check for balls.
    if (balls.length == 0) {
      // Kill the player
      killPlayer();
    }

    // Iterate over bullets and resolve collisions.
    let aliveBullets = [];

    for (let x = 0; x < bullets.length; x++) {
      // If the bullet is onscreen, it's alive
      let bullet = bullets[x];
      bullet.move();
      
      if (
        bullet.x > 0 &&
        bullet.y > 0 &&
        bullet.x + bullet.width < gameConfig.areaWidth &&
        bullet.y + bullet.height < gameConfig.areaHeight
      ) {
        for (let b = 0; b < bricks.length; b++) {
          if (collider(bullet, bricks[b])) {
            resolveBrickDamage(bricks[b]);
            bullet.alive = false;
          }
        }
      }

      else {
        bullet.alive = false;
      }

      if (bullet.alive) {
        aliveBullets.push(bullet);
      }
    }

    bullets = aliveBullets;



    let aliveBalls = [];
    for (let x = 0; x < balls.length; x++) {
      // First, check if the ball is alive.
      if (balls[x].alive) {
        // If so, add it to aliveBalls.
        aliveBalls.push(balls[x]);

        // Take top and bottom bars into account for bounds checks.
        balls[x].boundsCheck();

        // Check for paddle collisions.
        if (collider(balls[x], player)) {
          
          soundEffects.ballHitPaddle.play();
          

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
            let ballMidX = balls[x].x + (balls[x].width / 2);
            let brickMidX= bricks[b].x + (bricks[b].width / 2);
            let ballMidY = balls[x].y + (balls[x].height / 2);
            let brickMidY= bricks[b].y + (bricks[b].height / 2);

            // Up and down
            if (
                balls[x].vy > 0 && ballMidY < brickMidY ||
                balls[x].vy < 0 && ballMidY > brickMidY
              ) {
              balls[x].vy *= -1;
            }

            // Left and right
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


    
    // Powerups
    alivePowerups = [];
    for (let p = 0; p < powerups.length; p++) {
      
      // First check if the powerup is still on the screen.
      if (powerups[p].y < gameConfig.areaHeight) {
        // Check for a collision with the player.
        if (collider(powerups[p], player)) {
         
          // Play the sound effect.
          soundEffects.powerupCollect.play();
        
          // Update the score.
          playerScore += powerups[p].points;
          
          // Mark powerup as dead.
          powerups[p].alive = false;
          
          // Apply the effect.
          powerups[p].effect();
        }

        // Else, move the powerup.
        else {
          powerups[p].move(gameConfig.scale);
        }
      }

      else {
        // Else, the powerup is no longer alive.
        powerups[p].alive = false;
      }

      // If the powerup is still alive, save it.
      if (powerups[p].alive) {
        alivePowerups.push(powerups[p]);
      }
    }

    // Scrub dead powerups
    powerups = alivePowerups;


    // Run special functions for the current level
    let cl = Levels[gameConfig.level];
    if (typeof cl.specialFunction === 'function') {
      // If so, run it.
      cl.specialFunction();
    }

    // Update the player
    player.boundsCheck();
    player.move(gameConfig.scale);
    
    // Weapon handling
    aliveWeapons = [];
    for (let w = 0; w < weapons.length; w++) {
      let wep = weapons[w];
      // Place the weapon.
      
      // The Y position will always be the same as the player.
      wep.y = player.y;
      let place = wep.placement;

      // Find the X position.
      if (place == 'center') {
        wep.x = player.x + (player.width / 2) - (wep.width / 2);
      }

      else if (place == 'left') {
        wep.x = player.x;
      }
      else if (place == 'right') {
        wep.x = player.x + player.width - wep.width;
      }

      // Run the fire method.
      wep.fire();

      // If the weapon is still alive, add to aliveWeapons.
      if (wep.alive) {
        aliveWeapons.push(wep);
      }
    }

    weapons = aliveWeapons;
  }
  
  function gameLoop() {
    
    // Set the background color if there is no background for the level.
    if (Levels[gameConfig.level].background) {
      sketch.image(
        Levels[gameConfig.level].background,
        0, 
        0,
        gameConfig.areaWidth * gameConfig.scale,
        gameConfig.areaHeight * gameConfig.scale
      );
    }
    else {
      sketch.background(90,90,255);
    }
    
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
          bricks[x].boundsCheck();

          // Then move the brick.
          bricks[x].move(gameConfig.scale);
        }
      }
    }
    
    // Remove bricks that are no longer alive.
    bricks = aliveBricks;


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

    // Draw any particles that exist.
    for (let x = 0; x < particles.length; x++) {
      particles[x].draw(gameConfig.scale, shapeBuffers[particles[x].shapeName]);
    }
   
    // Draw powerups
    for (let x = 0; x < powerups.length; x++) {
      powerups[x].draw(gameConfig.scale, shapeBuffers[powerups[x].shapeName]);
    }

    // Draw the player.
    if (player.visible) {
      player.draw(gameConfig.scale, shapeBuffers.normalPaddle);
    }
   
    // If the bullets are drawn BEFORE the weapons, then the weapons will cover the bullets as they spawn in. This is an easy way to make it looke like the bullets are coming out of the weapons.
    // Draw bullets
    for (let b = 0; b < bullets.length; b++) {
      bullets[b].draw(gameConfig.scale, shapeBuffers[bullets[b].shapeName]);
    }


    // Draw weapons
    for (let w = 0; w < weapons.length; w++) {
      weapons[w].draw(gameConfig.scale, shapeBuffers[weapons[w].shapeName]);
    }
    

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


    // Draw the player's lives, but NOT if it's a negative number.
    let showNumber = 0;
    if (playerLives >= 0) {
      showNumber = playerLives;
    }

    showBarText(
      "Lives: " + showNumber,
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
    sketch.fill(90,90,200);
    //sketch.fill(90,90,200);
    //strokeWeight(4);
    //stroke(0,0,200);
    sketch.rect(
      0,
      0,
      gameConfig.areaWidth * gameConfig.scale,
      gameConfig.areaHeight * gameConfig.scale
    );
    sketch.fill(0);
    sketch.stroke(255);
    sketch.strokeWeight(4);
    sketch.textAlign(sketch.CENTER);
    sketch.textSize(90 * gameConfig.scale);
    sketch.text(
      "ZaGgMoNd",
      (gameConfig.areaWidth / 2) * gameConfig.scale,
      (gameConfig.areaHeight * 0.15) * gameConfig.scale
    );
    sketch.noStroke();
  }

  function loadingScreen() {
    sketch.background(0,200,0);
    sketch.fill(0);
    sketch.stroke(255);
    sketch.strokeWeight(4);
    sketch.textAlign(sketch.CENTER);
    sketch.textSize(90 * gameConfig.scale);
    sketch.text(
      "Loading...",
      (gameConfig.areaWidth / 2) * gameConfig.scale,
      (gameConfig.areaHeight / 2) * gameConfig.scale
    );
    sketch.noStroke();
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
  //let lastLoop = new Date();
  sketch.draw = function() {
    // put drawing code here


    // If everything is loaded, run the game normally.
    let loaded = checkLoading();
    if (loaded) {

      // Show the right screen for each mode.
      if (gameConfig.mode == 'title') {
        titleScreen();
      }
      else if (gameConfig.mode == 'pause') {
        pauseScreen();
      }
      else if (gameConfig.mode == 'play') {
        gameLoop();
      }

      // Show FPS
      /*let thisLoop = new Date();
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
      );*/
    }

    // Else, show the preloader.
    else {
      loadingScreen();
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
      // Update the styles to get the new X offset
      gameConfig.getCompStyle();

      // Modify the buttons.
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].position(
          (buttons[i].initX * gameConfig.scale) + gameConfig.buttonOffsetX,
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
      buffer.noStroke();
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


  // Powerups
  

  // Randomly pick a powerup
  function pickPowerup(x, y) {
    let pick = sketch.random();
    let powerup = makePowerupCannons(x, y);
    /*let powerup = '';
    if (pick < 0.10) {
      powerup = makePowerupKillPaddle(x, y);
    }
    else if (pick < 0.25) {
      powerup = makePowerupGrowPaddle(x, y);
    }

    else if (pick < 0.50) {
      powerup = makePowerupShrinkPaddle(x, y);
    }
    
    else if (pick < 0.55) {
      powerup = makePowerupGive100(x, y);
    }
    
    else if (pick < 0.60) {
      powerup = makePowerupGive200(x, y);
    }
    
    else if (pick < 0.65) {
      powerup = makePowerupGive500(x, y);
    }
    
    else if (pick < 0.70) {
      powerup = makePowerupGive1k(x, y);
    }*/

    return powerup;
  }


  
  // Grow the paddle.
  function makePowerupGrowPaddle(x, y) {
    let mypowerup = makeParticle(x, y);
    mypowerup.shapeName = 'growPaddle';
    mypowerup.speed = 4;
    mypowerup.vy = mypowerup.speed;
    mypowerup.height = 40;
    mypowerup.width = 90;

    // Also award the player some points.
    mypowerup.points = 150;
    
    mypowerup.sprite = 'img/powerUpGrowPaddle.png';
    mypowerup.makeShape = function(buffer) {
      // This function should never run as long as the sprite file exists.

      // Draw the outer frame.
      buffer.fill(155);
      buffer.rect(
        mypowerup.x,
        mypowerup.y,
        mypowerup.width,
        mypowerup.height
      );
     
      // Draw inner frame.
      buffer.fill(0);
      buffer.rect(
        mypowerup.x + 4,
        mypowerup.y + 4,
        mypowerup.width - 8,
        mypowerup.height - 8
      );
    }

    // Decide what the powerup does when the user collects it.
    mypowerup.effect = function() {
      let newsize = player.width + (player.width * 0.15);
      if (newsize < player.maxWidth) {
        player.width = newsize;
        playerScore += mypowerup.points;
      }
    }

    return mypowerup;
  }
  
  // Shrink the player paddle
  function makePowerupShrinkPaddle(x, y) {
    let mypowerup = makePowerupGrowPaddle(x, y);
    mypowerup.shapeName = 'shrinkPaddle';
    mypowerup.points = 250;
    mypowerup.sprite = 'img/powerUpShrinkPaddle.png';
    
    mypowerup.effect = function() {
      let newsize = player.width - (player.width * 0.15);
      if (newsize > player.minWidth) {
        player.width = newsize;
      }
    }

    return mypowerup;

  }
  
  // Kill the player
  function makePowerupKillPaddle(x, y) {
    let mypowerup = makePowerupShrinkPaddle(x, y);
    mypowerup.shapeName = 'killPaddle';
    mypowerup.points = 1000;
    mypowerup.sprite = 'img/powerUpKillPaddle.png';
    
    mypowerup.effect = function() {
      balls = [];
    }

    return mypowerup;
  }
 
 
  // Give the player a weapon.
  function makePowerupCannons(x, y) {
    let mypowerup = makePowerupGrowPaddle(x, y);
    mypowerup.shapeName = 'giveCannons';
    mypowerup.points = 300;
    mypowerup.sprite = 'img/powerUpCannons.png';
    
    mypowerup.effect = function() {
      // Remove previous weapons
      weapons = []

      // Grant a pair of cannons.
      let wep1 = makeCannon(player.x, player.y);
      let wep2 = makeCannon(player.x, player.y);
      wep1.placement = 'left';
      wep2.placement = 'right';

      weapons.push(wep1);
      weapons.push(wep2);
    }

    return mypowerup;
  }

  
  // Give the player extra points
  function makePowerupGive100(x, y) {
    let mypowerup = makePowerupGrowPaddle(x, y);
    mypowerup.shapeName = 'give100';
    mypowerup.points = 100;
    mypowerup.sprite = 'img/powerUp100Points.png';
    
    mypowerup.effect = function() {
      return false
    }

    return mypowerup;

  }


  function makePowerupGive200(x, y) {
    let mypowerup = makePowerupGive100(x, y);
    mypowerup.shapeName = 'give200';
    mypowerup.points = 200;
    mypowerup.sprite = 'img/powerUp200Points.png';
    
    return mypowerup;

  }


  function makePowerupGive500(x, y) {
    let mypowerup = makePowerupGive100(x, y);
    mypowerup.shapeName = 'give500';
    mypowerup.points = 500;
    mypowerup.sprite = 'img/powerUp500Points.png';
    
    return mypowerup;

  }
  

  function makePowerupGive1k(x, y) {
    let mypowerup = makePowerupGive100(x, y);
    mypowerup.shapeName = 'give1k';
    mypowerup.points = 1000;
    mypowerup.sprite = 'img/powerUp1kPoints.png';
    
    return mypowerup;

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


  // Bullet making function
  function makeBullet(x, y) {
    let mybullet = makeParticle(x, y);
    mybullet.shapeName = 'regularBullet';
    mybullet.speed = 10;
    mybullet.height = 20;
    mybullet.width = 10;
    mybullet.makeShape = function(buffer) {
      buffer.fill(0,255,0);
      buffer.rect(
        mybullet.x,
        mybullet.y,
        mybullet.width,
        mybullet.height
      );
    }

    return mybullet;
  }

  function makeCannon(x, y) {
    let mycannon = makeBullet(x, y);

    mycannon.shapeName = 'cannon';
    mycannon.speed = 10;
    mycannon.height = 40;
    mycannon.width = 24;

    // Weapon specific variables
    
    // Which side of the player is it on?
    mycannon.placement = 'center';
    
    // This is how long the weapon will last
    mycannon.timer = 300;

    // Fire rate
    mycannon.rate = 20;
    mycannon.rateSave = mycannon.rate;

    // What the cannon does when it fires.
    // This function will run every frame.
    mycannon.fire = function() {
      //console.log("Weapon fired");
      if (mycannon.timer > 0) {

        // Decrement the timer.
        mycannon.timer--;

        if (mycannon.rate > 0) {
          // Decrement the counter.
          mycannon.rate--;
        }

        else {
          // The Y value should be the that of the cannon.
          let bullet = makeBullet(0,mycannon.y);

          // Line the bullet X position up with the middle of the cannon.
          bullet.x = mycannon.x + (mycannon.width / 2) - (bullet.width / 2);

          // Set the bullet to travel straight up.
          bullet.speed = 8;
          bullet.vy = bullet.speed * -1;

          // Play the sound effect.
          soundEffects.bulletFire.play();

          // Add the bullet to the array
          bullets.push(bullet);

          // Reset rate counter.
          mycannon.rate = mycannon.rateSave;
        }
      }

      // Weapon has expired.
      else {
        mycannon.alive = false;
      }
    }

    // This one will have an outline
    mycannon.makeShape = function(buffer) {
      buffer.fill(155);
      buffer.rect(
        mycannon.x,
        mycannon.y,
        mycannon.width,
        mycannon.height
      );
      buffer.fill(200,200,0);
      buffer.rect(
        mycannon.x + 8,
        mycannon.y + 8,
        mycannon.width - 16,
        mycannon.height - 16
      );
    }

    return mycannon;

  }


  // Ball making function
  //function makeBall(x, y, s) {
  // Decided to set ball size to 30px.
  function makeBall(x, y) {
    let myball = makeParticle(x, y);
    myball.x = x;
    myball.y = y;
    myball.vx = 10;
    myball.vy = 10;
    myball.speed = 10;
    myball.width = 30;
    myball.height = 30;

    // Balls are the first shape to require bounds checking.
    myball.bounds = {
      x: 0,
      y: gameConfig.uiBarHeight,
      width: gameConfig.areaWidth,
      height: gameConfig.areaHeight - gameConfig.uiBarHeight
    }

    myball.shapeName = 'blueBall';
    myball.makeShape = function(buffer) {
      buffer.noStroke();
      buffer.ellipseMode(buffer.CORNER);

      // Outer circle
      buffer.fill(155);
      buffer.ellipse(
        myball.x,
        myball.y,
        myball.width,
        myball.height
      );


      // Inner circle
      buffer.fill(0,0,255);
      buffer.ellipse(
        myball.x + 2,
        myball.y + 2,
        myball.width - 4,
        myball.height - 4
      );
    }

    // Use custom paramters
    //myball.boundsCheck = function (x, y, width, height) {
    myball.boundsCheck = function () {
      let b = myball.bounds;
      let hitWall = false;
      if (myball.x + myball.width > b.x + b.width) {
        myball.x = b.x + b.width - myball.width - 1;
        myball.vx *= -1;
        hitWall = true;
      }
      else if (myball.x < b.x) {
        myball.x = b.x + 1;
        myball.vx *= -1;
        hitWall = true;
      }

      // If the ball falls through the bottom of the screen, kill it.
      else if (myball.y + myball.height > b.y + b.height) {
        myball.y = b.y + b.height - myball.height -1;
        myball.vy *= -1;
        //hitWall = true;
        myball.alive = false;
      }
      else if (myball.y < b.y) {
        myball.y = b.y + 1;
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

  function makeBrick(x, y) {
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

    // Brick borders
    mybrick.border = 4;
    mybrick.borderColor = sketch.color(200);

    // Draw the right shape
    mybrick.makeShape = function(buffer) {
      // Make absolutely sure we don't have a an outline
      // stroke.
      buffer.noStroke();
      
      // If border is 0, don't draw 2 diamonds
      if (mybrick.border > 0) {
        // Fill with the border color.
        buffer.fill(mybrick.borderColor);
       
        // Draw the border.
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
        
        // Make the diamond.
        buffer.fill(mybrick.color);
        buffer.quad(

          // Left corner XY
          mybrick.x + mybrick.border,
          mybrick.y + (mybrick.height / 2),

          // Top center XY
          mybrick.x + (mybrick.width / 2),
          mybrick.y + (mybrick.border / 2),

          // Right corner XY
          mybrick.x + mybrick.width - mybrick.border,
          mybrick.y + (mybrick.height / 2),

          // Lower center XY
          mybrick.x + (mybrick.width / 2),
          mybrick.y + mybrick.height - (mybrick.border / 2),
        );
      }

      else {
        // Fill with the border color.
        buffer.fill(mybrick.color);
       
        // Draw the border.
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

    }
   
    // Or they could be "invincible".
    // This is just used to denote a brick with a crazy high HP, like 20. Such bricks DO NOT have to be destroyed to move to the next level.
    mybrick.noDie = false;
    
    mybrick.bounds = {
      x: 0,
      y: gameConfig.uiBarHeight,
      width: gameConfig.areaWidth,
      height: gameConfig.areaHeight - gameConfig.uiBarHeight
    }

    // Bricks don't die when the hit the bottom of their 'bounds box'.
    mybrick.boundsCheck = function () {
      let b = mybrick.bounds;
      if (mybrick.x + mybrick.width > b.x + b.width) {
        mybrick.x = b.x + b.width - mybrick.width - 1;
        mybrick.vx *= -1;
      }
      else if (mybrick.x < b.x) {
        mybrick.x = b.x + 1;
        mybrick.vx *= -1;
      }

      else if (mybrick.y + mybrick.height > b.y + b.height) {
        mybrick.y = b.y + b.height - mybrick.height -1;
        mybrick.vy *= -1;
      }
      else if (mybrick.y < b.y) {
        mybrick.y = b.y + 1;
        mybrick.vy *= -1;
      }
    }

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

    // Drop a powerup
    /*mybrick.dropPowerup = function() {
      let pu = pickPowerup(
        mybrick.x + (mybrick.width / 2),
        mybrick.y + mybrick.height
      );
      powerups.push(pu);
    }*/
    return mybrick;
  }

  // Bricks with no borders will be needed to render armored bricks.
  function makeNoBorderWhiteBrick(x, y) {
    let mybrick = makeWhiteBrick(x, y);
    mybrick.shapeName = 'whiteBrickNoBorder';
    mybrick.border = 0;
    return mybrick;
  }
  
  function makeGrayBrick(x, y) {
    let mybrick = makeBrick(x, y);
    mybrick.color = sketch.color(90);
    mybrick.shapeName = 'grayBrick';
    return mybrick;
  }
  
  function makeNoBorderGrayBrick(x, y) {
    let mybrick = makeGrayBrick(x, y);
    mybrick.shapeName = 'grayBrickNoBorder';
    mybrick.border = 0;
    return mybrick;
  }
  

  // These bricks can not be destroyed.
  function makeInvincibleBrick(x, y) {
    let mybrick = makeBrick(x, y);
    mybrick.color = sketch.color(115,0,115);
    mybrick.shapeName = 'invincibleBrick';
    mybrick.noDie = true;
    mybrick.hp = 20;
    mybrick.border = 4;
    return mybrick;
  }
  
  function makeNoBorderInvincibleBrick(x, y) {
    let mybrick = makeInvincibleBrick(x, y);
    mybrick.shapeName = 'invincibleBrickNoBorder';
    mybrick.border = 0;
    return mybrick;
  }
  
  function makeNoBorderBrick(x, y) {
    let mybrick = makeBrick(x, y);
    mybrick.shapeName = 'redBrickNoBorder';
    mybrick.border = 0;
    return mybrick;
  }

  function makeNoBorderYellowBrick(x,y) {
    let mybrick = makeYellowBrick(x, y);
    mybrick.shapeName = 'yellowBrickNoBorder';
    mybrick.border = 0;
    return mybrick;
  }

  function makeNoBorderGreenBrick(x, y) {
    let mybrick = makeGreenBrick(x, y);
    mybrick.shapeName = 'greenBrickNoBorder';
    mybrick.border = 0;
    return mybrick;
  }
  

  // These bricks blow up when destroyed.
  function makeBombBrick(x, y) {
    let mybrick = makeBrick(x, y);
    mybrick.color = sketch.color(0);
    mybrick.shapeName = 'bombBrick';
    mybrick.border = 4;

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
        shapeBuffers.redBrickNoBorder,
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
    let mybrick = makeGrayBrick(x, y);
    mybrick.hp = 4;

    // Reward the player for popping it.
    mybrick.points = 1000;

    // These need a different kind of draw function to show HP.
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
      let innerBuffer;

      if (mybrick.hp > 3) {
        innerBuffer = shapeBuffers.redBrickNoBorder;
      }

      // Next, we use the HP to determine which buffer to replace this with.
      if (mybrick.hp == 3) {
        innerBuffer = shapeBuffers.yellowBrickNoBorder;
      }

      else if (mybrick.hp == 2) {
        innerBuffer = shapeBuffers.greenBrickNoBorder;
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

  // Make diagonally moving bricks.
  // Distance is a multiple of brick height and width.
  // the starting position.
  function makeMovingBrickDiagonal(brickMaker, x, y, distance) {
    let mybrick = brickMaker(x, y);

    // Ball has to travel:
    // 300 pixels to right.
    // 150 down.
    mybrick.speed = 1;
    mybrick.vx = mybrick.speed;
    mybrick.vy = mybrick.speed * ((gameConfig.brickSpacing + mybrick.height) / (mybrick.width + gameConfig.brickSpacing));

    mybrick.bounds = {
      x: x,
      y: y,
      width: ((mybrick.width + gameConfig.brickSpacing) * distance) - gameConfig.brickSpacing,
      height: ((mybrick.height + gameConfig.brickSpacing) * distance) - gameConfig.brickSpacing
    }

    return mybrick;
  }

  // These bricks only move back and forth.
  function makeMovingBrickHorizontal(brickMaker, x, y, distance) {
    let mybrick = makeMovingBrickDiagonal(brickMaker, x, y, distance);
   
    mybrick.vy = 0;
    
    return mybrick;
  }
 

  // These bricks move in rectangular paths.
  function makeMovingBrickRectPath(brickMaker, x, y, distance) {
    let mybrick = makeMovingBrickDiagonal(brickMaker, x, y, distance);

    mybrick.speed = 0;
    mybrick.vx = 0;
    mybrick.vy = 0;
    
    // To make this work right, this function must be overwritten.
    mybrick.boundsCheck = function () {
      let b = mybrick.bounds;

      // Right side of bounds
      if (mybrick.x + mybrick.width > b.x + b.width) {
        mybrick.x = b.x + b.width - mybrick.width - 1;
        mybrick.vx = 0;
        mybrick.vy = mybrick.speed;
      }

      // Left side
      else if (mybrick.x < b.x) {
        mybrick.x = b.x + 1;
        mybrick.vx = 0;
        mybrick.vy = mybrick.speed * -1;
      }

      // Bottom
      else if (mybrick.y + mybrick.height > b.y + b.height) {
        mybrick.y = b.y + b.height - mybrick.height - 1;
        mybrick.vy = 0;
        mybrick.vx = mybrick.speed * -1;
      }

      // Top
      else if (mybrick.y < b.y) {
        mybrick.y = b.y + 1;
        mybrick.vy = 0;
        mybrick.vx = mybrick.speed;
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
    mypaddle.speed = 12;

    // Need to adjust the width and height
    mypaddle.width = 140;
    mypaddle.height = 20;

    // Make sure the paddle doesn't get too big
    mypaddle.maxWidth = 380;

    // Or too small
    mypaddle.minWidth = 80;

    // Paddles are rectangles
    mypaddle.makeShape = function(buffer) {
      buffer.stroke(155);
      buffer.strokeWeight(8);
      buffer.fill(0);
      buffer.rect(
        mypaddle.x,
        mypaddle.y,
        mypaddle.width,
        mypaddle.height
      );
      buffer.noStroke();
    }

    mypaddle.bounds = {
      x: 0,
      width: gameConfig.areaWidth
    }

    // Because the paddle is player controlled, this needs an overhaul.
    // The paddle only moves left and right.
    mypaddle.boundsCheck = function () {
      let b = mypaddle.bounds;
      if (mypaddle.x < b.x) {
        mypaddle.x = b.x + 1;
      }

      else if (mypaddle.x + mypaddle.width > b.x + b.width) {
        mypaddle.x = b.x + b.width - mypaddle.width - 1;
      }
    }

    return mypaddle;
  }


  // Make an explosion of particles.
  function makeEffectExplosion(x, y) {
    // Randomly decide how many particles to generate.
    let numberOfParticles = sketch.floor(sketch.random(3, 7));
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

    // Set position and size based on game scale and buttonOffsetX.
    mybutton.position(
      (mybutton.initX * gameConfig.scale) + gameConfig.buttonOffsetX,
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


  // Kill the player and show an explosion
  function killPlayer() {
    // Pause the game.
    gamePaused = true;
    
    // Make the paddle "explode".
    player.visible = false;

    // Determine how many explosions to triger.
    let step = 15;
    for (let xp = 0; xp < player.width; xp += step) {
      makeEffectExplosion(
        player.x + xp,
        player.y + (player.height / 2)
      );
    }
    
    // Play the explosion sound effect.
    soundEffects.ballHitBrick.play();
    
    // Player loses a life.
    playerLives--;


    // If the player has no lives left, game over.
    if (playerLives < 0) {
      // If not, game over.
      let gameOver = makeMessage("GAME OVER!");
      gameOver.endAction = function() {
        switchScreen('title');
      }
      gameOver.maxTime = 120;
      messages.push(gameOver);
      //console.log("You LOSE!");

    }

    // Else, reset with a new ball.
    else {
      // Tell the player that they missed.
      let missMessage = makeMessage("MISS!");
      missMessage.endAction = function() {
        gamePaused = true;
        resetPlayer();
        makeResumeCountdown();
      }
      missMessage.maxTime = 60;
      messages.push(missMessage);
    }

  }

  
  // Reset the balls and bricks. Used when moving to the next level.
  function resetPlayer() {
    
    // Prepare level, starting with the player's paddle.
    player = makePaddle(
      (gameConfig.areaWidth / 2) - 70,
      1100
    );
    player.visible = true;
    
    // Clear all onscreen powerups and effect items.
    powerups = [];
    particles = [];
    explosionPoints = [];
    bullets = [];
    weapons = [];

    // Make sure balls are cleared befor making a new one.
    balls = [];

    // Make a new ball.
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
    powerups = [];
    bullets = [];
    weapons = [];
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
