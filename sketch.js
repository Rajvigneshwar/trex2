var trex, trex_running, trex_collided, trex_standing;
var gameover, restart, game_img, restart_img
var ground, invisibleground, groundImage;
var cloudImage;
var obstacleImage1, obstacleImage2, obstacleImage3, obstacleImage4, obstacleImage5, obstacleImage6;
var score = 0
var cloudsGroup, obstaclesGroup;
var PLAY = 1;
var END = 2;
var START = 0;
var gameState = START
var checkpoint, die, jump;


function preload() {

  game_img = loadImage("gameOver.png");
  restart_img = loadImage("restart.png");

  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_standing = loadAnimation("trex1.png");
  trex_collided = loadAnimation("trex_collided.png");


  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");

  obstacleImage1 = loadImage("obstacle1.png");
  obstacleImage2 = loadImage("obstacle2.png");
  obstacleImage3 = loadImage("obstacle3.png");
  obstacleImage4 = loadImage("obstacle4.png");
  obstacleImage5 = loadImage("obstacle5.png");
  obstacleImage6 = loadImage("obstacle6.png");

  checkpoint = loadSound("checkPoint.mp3");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");


}

function setup() {
  createCanvas(windowWidth,windowHeight);

  //create a trex sprite
  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("standing", trex_standing);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.addAnimation("collided", trex_collided)
  trex.setCollider("circle", 0, 0, 40)

  //create a ground sprite
  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  //ground.velocityX = -12;

  invisibleground = createSprite(200, 190, 400, 20);
  invisibleground.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  gameover = createSprite(300, 100);
  gameover.addImage("image", game_img);
  gameover.scale = 0.5;
  gameover.visible = false;

  restart = createSprite(300, 140);
  restart.addImage("restart", restart_img);
  restart.scale = 0.5;
  restart.visible = false;
}

function draw() {
  background(255);
  text("score: " + score, 500, 50)

  if (gameState === START) {

    //ground.visible=false;
    textSize(20)
    fill("black")
    text("press space to start", 225, 100);
    if ((touches.length>0 || keyDown("space")) && gameState === START) {
      gameState = PLAY
      jump.play();
    }
  }
  //score
  if (gameState === PLAY) {
    trex.changeAnimation("running", trex_running);
    score = score + Math.round(getFrameRate()/60)
    ground.velocityX = -(4 + 3 * score / 100);
    // Math.round(frameCount /60);
    // console.log("ground: "+ground.velocityX)
    if (score > 0 && score % 100 === 0) {
      checkpoint.play();
    }
    //jump when the space button is pressed
    //jump only when trex is on the ground
    if (keyDown("space") && trex.y >= 150) {
      trex.velocityY = -14;
      jump.play();
    }
    //adding gravity to trex
    trex.velocityY = trex.velocityY + 0.8

    //reseting the ground to scroll infinitely
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    spawnclouds();
    spawnobstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      die.play();
      //trex.velocityY=-12;
      //jump.play();
    }
  } else if (gameState === END) {
    ground.velocityX = 0;
    trex.velocityY = 0
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided", trex_collided)
    gameover.visible = true;
    restart.visible = true;


    if (mousePressedOver(restart)) {
     reset();
    }
  }





  trex.collide(invisibleground);


  drawSprites();
  // console.timeEnd();
}

function spawnclouds() {

  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 80, 10, 20);
    cloud.y = Math.round(random(10, 100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1
    cloud.velocityX = -4;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.lifetime = Math.round(cloud.x / abs(cloud.velocityX))
    cloudsGroup.add(cloud);
  }
}

function spawnobstacles() {

  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 20);
    obstacle.velocityX = -(6 + 4 * score / 100);
    var randomnum = Math.round(random(1, 6));
    obstacle.x = Math.round(random(500, 600))
    //console.log(randomnum)
    switch (randomnum) {
      case 1:
        obstacle.addImage(obstacleImage1);
        break;
      case 2:
        obstacle.addImage(obstacleImage2);
        break;
      case 3:
        obstacle.addImage(obstacleImage3);
        break;
      case 4:
        obstacle.addImage(obstacleImage4);
        break;
      case 5:
        obstacle.addImage(obstacleImage5);
        break;
      case 6:
        obstacle.addImage(obstacleImage6);
        break;
      default:
        break
    }
    obstacle.scale = 0.5
    obstacle.lifetime = Math.round(obstacle.x /
      abs(obstacle.velocityX))
    obstaclesGroup.add(obstacle);

  }
}
  
  function reset(){
    gameState=PLAY;
    gameover.visible=false;
    restart.visible=false;
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    score=0
  
  }