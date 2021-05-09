
/* global p5 */

let p = new p5(() => {});
//vars
let enemy;
let player;
let e2;
let e3;
let e4;
let tiles = [];
let levelData = [
  [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [4, 4, 4, 4, 4, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 2, 2, 2, 0, 0, 0, 0],
  [0, 3, 0, 0, 4, 2, 2, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 2, 2, 2, 0, 0, 3, 0],
  [0, 0, 0, 0, 4, 2, 2, 2, 0, 0, 0, 0],
  [0, 0, 3, 0, 4, 2, 2, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 2, 2, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 4, 0, 0, 0],
  [0, 1, 1, 0, 0, 2, 2, 2, 4, 2, 2, 2],
  [0, 1, 1, 1, 0, 2, 2, 2, 4, 2, 2, 2],
  [0, 1, 0, 0, 0, 2, 2, 2, 4, 2, 2, 2],
  [0, 0, 0, 1, 0, 0, 0, 0, 4, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 3, 0, 4, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 4, 0, 0, 0]
];

let gameMode;
let questionBank; //array of strings read in from a file (unprocessed)
let questions = [];
let battle = null;
let defaultFont, titleFont;
let startScreenImg, gameOverImg, battleImg;

//constants
const TILE_SIZE = 50;
const VACANT = 0,
  TREE = 1,
  BUSH = 2,
  ROCK = 3,
  PATH = 4;
const WIDTH_IN_TILES = levelData.length; //how many tiles wide is the screen?
const HEIGHT_IN_TILES = levelData[0].length; //how many tiles high is the screen?
const START_SCREEN = 0, RPG = 1, BATTLE = 2, GAME_OVER = 3;

//PRELOAD -------------------------------------------------------------------------------------------------------------------------------
p.preload = function() {
  questionBank = p.loadStrings("questionbank.txt");
  defaultFont = p.loadFont("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Forangekid.ttf?v=1617855147722");
  titleFont = p.loadFont("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2FARCADECLASSIC.TTF?v=1617855972162");
  startScreenImg = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Fstart%20screen.png?v=1618082969465");
  gameOverImg = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Fgameover.png?v=1618082963395");
  battleImg = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Fbattlebkg2.png?v=1618090295848");
}
//SETUP ---------------------------------------------------------------------------------------------------------------------------------
/*
initialization here --> not frame by frame
*/
p.setup = function() {
  p.createCanvas(WIDTH_IN_TILES * TILE_SIZE, HEIGHT_IN_TILES * TILE_SIZE); //1200x600 px screen size
  loadLevelData();
  loadQuestions();
  gameMode = START_SCREEN;
  player = new Player(1, 0, 50, 50);
};

//HELPER METHODS FOR SETUP --------------------------------------------------------------------------------------------------------------
function loadLevelData() {
  for (let i = 0; i < levelData.length; i++) {
    for (let j = 0; j < levelData[i].length; j++) {
      let type = levelData[i][j];
      tiles.push(new Tile(i, j, type));
    }
  }
}

function loadQuestions() {
  for(let i = 0; i < questionBank.length; i +=6) {
    let q = new Question();
    for(let j = 0; j < 6; j ++) {
      if(j == 0) {
        q.question = questionBank[i + j];
      } else if (j == 1 || j == 2 || j == 3 || j == 4) {
        q.answers.push(questionBank[i + j]);
      } else {
        q.correctAnswer = questionBank[i + j];
      }
    }
    questions.push(q);
  }
}

//DRAW ----------------------------------------------------------------------------------------------------------------------------------
p.draw = function() {
  switch (gameMode) {
    case START_SCREEN:
      drawStartScreen();
      break;
    case RPG:
      drawTiles();
      updateAndDrawPlayer();
      break;
    case BATTLE:
      if(battle == null) {
        battle = new Battle();
      }
      battle.draw();
      battle.checkForWinner();
      break;
    case GAME_OVER:
      drawGameOver();
      break;
  }
};

function drawTiles() {
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].draw();
  }
}

function updateAndDrawPlayer() {
  player.checkForCollision();
  player.updateScreenPosition();
  player.draw();
}

function drawStartScreen() {
  p.background(startScreenImg);
  p.fill("white");
  p.textSize(80);
  p.textFont(defaultFont);
  p.text(":", 907, p.height / 2 - 70);
  p.textFont(titleFont);
  p.textAlign(p.CENTER);
  p.text("COSC   111   Review \n The   Game", 590, p.height / 2 - 60);
  p.textSize(50);
  p.text("Press   ENTER   to   start", p.width / 2, 440);
  p.textAlign(p.LEFT);
}

function drawGameOver() {
  p.background(gameOverImg);
  p.fill("white");
  p.textSize(100);
  p.textFont(titleFont);
  p.text("Game over!", 350, 100);
}

//KEYBOARD INPUT ------------------------------------------------------------------------------------------------------------------------
function keyPressed() {
  player.move();

  if (gameMode == START_SCREEN && p.keyIsDown(p.ENTER)) {
    gameMode = RPG;
  }
}

function keyTyped() {
    if(gameMode == BATTLE && (p.key == 'a' || p.key == 'b' || p.key == 'c' || p.key == 'd') ) {
      battle.checkAnswer();
    }
}

//PLAYER CLASS --------------------------------------------------------------------------------------------------------------------------
class Player {
  constructor(row, col, size) {
    this.currentTile = { row: row, col: col };
    this.position = { x: row * TILE_SIZE, y: col * TILE_SIZE };
    this.size = size;
    
    this.imageL = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Fplayersprite_left.png?v=1617861645717");
    this.imageR = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Fplayersprite_right.png?v=1617861645717");
    this.imageU = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Fplayersprite_up.png?v=1617861645717");
    this.imageD = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Fplayersprite_down.png?v=1617861645716");
    
    this.direction = this.LEFT;
  }

  //update
  updateScreenPosition() {
    this.position.x = this.currentTile.row * TILE_SIZE;
    this.position.y = this.currentTile.col * TILE_SIZE;
  }

  move() {
    if (p.keyIsDown(p.LEFT_ARROW) && this.canMoveLeft()) {
      this.currentTile.row--;
      this.direction = 0;
    } else if (p.keyIsDown(p.RIGHT_ARROW) && this.canMoveRight()) {
      this.currentTile.row++;
      this.direction = 1;
    } else if (p.keyIsDown(p.UP_ARROW) && this.canMoveUp()) {
      this.currentTile.col--;
      this.direction = 2;
    } else if (p.keyIsDown(p.DOWN_ARROW) && this.canMoveDown()) {
      this.currentTile.col++;
      this.direction = 3;
    }
  }

  checkForCollision() {
    let index = this.findTileAt(this.currentTile.row, this.currentTile.col);
    
    if (tiles[index].type == BUSH && tiles[index].hasEnemy) {
      gameMode = BATTLE;
    }
  }
  
  //helper method for checking collisions
  findTileAt(row, col) {
    for(let i = 0; i < tiles.length; i ++) {
      if(tiles[i].row == row && tiles[i].col == col) {
        return i;
      }
    }
    
    return -1; //tile at desired row/col could not be found
  }
  
  //helper methods for movement
  isValidMove(row, col) {
    return (
      row >= 0 &&
      col >= 0 &&
      row <= WIDTH_IN_TILES - 1 &&
      col <= HEIGHT_IN_TILES - 1
    );
  }

  canMoveLeft() {
    return (gameMode == RPG &&
      this.isValidMove(this.currentTile.row - 1, this.currentTile.col) &&
      (levelData[this.currentTile.row - 1][this.currentTile.col] == VACANT ||
        levelData[this.currentTile.row - 1][this.currentTile.col] == BUSH ||
        levelData[this.currentTile.row - 1][this.currentTile.col] == PATH)
    );
  }

  canMoveRight() {
    return (gameMode == RPG &&
      this.isValidMove(this.currentTile.row + 1, this.currentTile.col) &&
      (levelData[this.currentTile.row + 1][this.currentTile.col] == VACANT ||
        levelData[this.currentTile.row + 1][this.currentTile.col] == BUSH ||
        levelData[this.currentTile.row + 1][this.currentTile.col] == PATH)
    );
  }

  canMoveUp() {
    return (gameMode == RPG &&
      this.isValidMove(this.currentTile.row, this.currentTile.col - 1) &&
      (levelData[this.currentTile.row][this.currentTile.col - 1] == VACANT ||
        levelData[this.currentTile.row][this.currentTile.col - 1] == BUSH ||
        levelData[this.currentTile.row][this.currentTile.col - 1] == PATH)
    );
  }

  canMoveDown() {
    return (gameMode == RPG &&
      this.isValidMove(this.currentTile.row, this.currentTile.col + 1) &&
      (levelData[this.currentTile.row][this.currentTile.col + 1] == VACANT ||
        levelData[this.currentTile.row][this.currentTile.col + 1] == BUSH ||
        levelData[this.currentTile.row][this.currentTile.col + 1] == PATH)
    );
  }

  //draw
  draw() {
    let currImg;
    if(this.direction == 0) {
      currImg = this.imageL;
    } else if(this.direction == 1) {
      currImg = this.imageR;
    } else if(this.direction == 2) {
      currImg = this.imageU;
    } else {
      currImg = this.imageD;
    }
    
    p.image(currImg, this.position.x, this.position.y, this.size, this.size);
    //debugging panel
    //p.fill("black");
    //p.rect(1000, 550, 200, 100);
    //p.fill("white");
    //p.text("DEBUGGING PANEL", 1045, 570);
    //p.text("current tile position: (" + this.currentTile.row + ", " + this.currentTile.col + ")", 1010, 590);
  }
}

//TILE CLASS ----------------------------------------------------------------------------------------------------------------------------
/*
this class represents anything on the map that is not the player or an enemy
ie: trees, buildings, rocks, etc.
*/
class Tile {
  constructor(row, col, type) {
    this.row = row;
    this.col = col;
    this.x = row * TILE_SIZE;
    this.y = col * TILE_SIZE;
    this.type = type;
    if(this.type == VACANT) {
      this.image = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Fgrass5.png?v=1617859748352");
    } else if(this.type == TREE) {
      this.image = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Ftree.png?v=1617860113243");
    } else if(this.type == BUSH) {
      this.image = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Fbush3.png?v=1617859965647");
    } else if(this.type == ROCK) {
      this.image = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Frock.png?v=1617860367434");
    } else if(this.type == PATH) {
      this.image = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Fpath.png?v=1617860526814");
    }
    
    this.hasEnemy = false;
    if (this.type == BUSH) {
      let rnd = Math.floor(p.random(0, 10));
      if(rnd % 2 == 0) {
        this.hasEnemy = false;
      } else {
        this.hasEnemy = true;
      }
    }
  }

  draw() {
    //p.noStroke(); (having a stroke allows us to see each tile as a square)
    //p.stroke("black");
    p.image(this.image, this.x, this.y, TILE_SIZE, TILE_SIZE);
  }
}

//QUESTION CLASS -------------------------------------------------------------------------------------------------------------------------
class Question {
  constructor() {
    this.question = "";
    this.answers = [];
    this.correctAnswer = "";
    this.hasAlreadyBeenChosen = false;
  }
  
  draw() {
    p.fill("black");
    p.text("Question: " + this.question, TILE_SIZE, 4 * TILE_SIZE - 53);
    
    for(let i = 0; i < this.answers.length; i ++) {
      p.text(this.answers[i], 13 * TILE_SIZE + 18, (5 + i) * TILE_SIZE);
    }
  }
  
  isCorrect(guess) {
    return this.correctAnswer.toUpperCase() == guess.toUpperCase();
  }
  
}

//BATTLE CLASS ---------------------------------------------------------------------------------------------------------------------------
class Battle {
  constructor() {
    this.player = new BattleSprite("player");
    this.enemy = new BattleSprite("enemy"); //change later to specific type of enemy (randomize it)
    this.currentQuestion = this.getRandomQuestion();
  }
  
  draw() {
    //background
    p.background(battleImg);
    
    //set colors and stuff
    p.textSize(50);
    p.textFont(titleFont);
    p.noStroke();
    p.fill("black");
    p.text("An enemy approaches", 7 * TILE_SIZE, TILE_SIZE + 15);
    
    
    //reset colors and stuff
    p.textSize(28);
    p.textFont(defaultFont);

    p.fill("white");

    this.currentQuestion.draw();

    //player
    this.player.draw();
    this.player.drawHealthBar();

    //enemy
    this.enemy.draw();
    this.enemy.drawHealthBar();
  }

  checkAnswer() {
    let guess = p.key + "";
  
    //if player answered correctly, enemy takes damage
    if(this.currentQuestion.isCorrect(guess)) {
      alert("Correct! The enemy loses 1 hp!");
      this.enemy.takeDamage();
    } else { //otherwise, incorrect answer, player takes damage and show correct answer
      this.player.takeDamage();
      alert("Sorry, that's not quite right. Correct answer: " + this.currentQuestion.correctAnswer + ")");
    }

    //new question
    this.currentQuestion = this.getRandomQuestion();
  }
  
  checkForWinner() {
    if(this.player.isDead()) {
      gameMode = GAME_OVER;
    } else if(this.enemy.isDead()) {
      gameMode = RPG;
      battle = null;
      //current tile.hasEnemy = false;
      let index = player.findTileAt(player.currentTile.row, player.currentTile.col);
      tiles[index].hasEnemy = false;
    }
  }

  getRandomQuestion() {
    let q = questions[Math.floor(p.random(0, questions.length))];
    while(q.hasAlreadyBeenChosen) {
      q = questions[Math.floor(p.random(0, questions.length))];
    }
    q.hasAlreadyBeenChosen = true;
    return q;
  }
  //note: this code assumes that we never run out of questions ;-;
}

class BattleSprite {
  constructor(type) {
    this.type = type;
    if(this.type == "player") {
      this.x = TILE_SIZE;
      this.y = 7 * TILE_SIZE; 
      this.image = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Fplayer_headshot.png?v=1617853418488");
    } else { //enemy
      this.x = 8 * TILE_SIZE;
      this.y = 4 * TILE_SIZE;
      
      let rndImageNum = [Math.floor(p.random(1, 5))];
      if(rndImageNum == 1) {
        this.image = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Fenemy1.png?v=1617853854956");
      } else if(rndImageNum == 2) {
        this.image = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Fenemy2.jpg?v=1617854410883");
      } else if(rndImageNum == 3) {
        this.image = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Fenemy3.jpg?v=1617854590423");
      } else if(rndImageNum == 4) {
        this.image = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Fenemy4.jpg?v=1617854971867");
      } else {
        this.image = p.loadImage("https://cdn.glitch.com/1dda00d4-f61a-4586-88dc-da2e3f361762%2Fenemy5.png?v=1617854971866");
      }
    }

    this.size = 4 * TILE_SIZE;
    this.health = 4; //initiallly has full health
  }
  
  takeDamage() {
    if(!this.isDead()) {
      this.health --;
    }
  }
  
  isDead() {
    return this.health == 0;
  }
  
  draw() {
    p.image(this.image, this.x, this.y, this.size, this.size);
  }
  
  drawHealthBar() {
    if(this.type == "player") {
      p.fill("black");
      p.rect(5 * TILE_SIZE - 5, 9 * TILE_SIZE + (TILE_SIZE / 2) - 10, 2 * TILE_SIZE + 5, TILE_SIZE / 2 + 10);
      p.fill("green");
      
      if(this.health >= 1) {
        p.rect(5 * TILE_SIZE, 9 * TILE_SIZE + TILE_SIZE / 2 - 5, TILE_SIZE / 2 - 5, TILE_SIZE / 2);
      }
      if(this.health >= 2) {
        p.rect(5 * TILE_SIZE + TILE_SIZE / 2, 9 * TILE_SIZE + TILE_SIZE / 2 - 5, TILE_SIZE / 2 - 5, TILE_SIZE / 2);
      }
      if(this.health >= 3) {
        p.rect(6 * TILE_SIZE, 9 * TILE_SIZE + TILE_SIZE / 2 - 5, TILE_SIZE / 2 - 5, TILE_SIZE / 2);
      }
      if(this.health == 4) {
        p.rect(6 * TILE_SIZE + TILE_SIZE / 2, 9 * TILE_SIZE + TILE_SIZE / 2 - 5, TILE_SIZE / 2 - 5, TILE_SIZE / 2);
      }
      
    } else { //enemy
      p.fill("black");
      p.rect(5 * TILE_SIZE - 5, 4 * TILE_SIZE, 2 * TILE_SIZE + 5, TILE_SIZE / 2 + 10);
      p.fill("green");
      
      if(this.health >= 1) {
        p.rect(5 * TILE_SIZE, 4 * TILE_SIZE + 5, TILE_SIZE / 2 - 5, TILE_SIZE / 2);
      }
      if(this.health >= 2) {
        p.rect(5 * TILE_SIZE + TILE_SIZE / 2, 4 * TILE_SIZE + 5, TILE_SIZE / 2 - 5, TILE_SIZE / 2);
      }
      if(this.health >= 3) {
        p.rect(6 * TILE_SIZE, 4 * TILE_SIZE + 5, TILE_SIZE / 2 - 5, TILE_SIZE / 2);
      }
      if(this.health == 4) {
        p.rect(6 * TILE_SIZE + TILE_SIZE / 2, 4 * TILE_SIZE + 5, TILE_SIZE / 2 - 5, TILE_SIZE / 2);
      }
    }
    
  }
}