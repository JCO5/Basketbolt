"use strict";

// BOARD SETTINGS
let board;
let boardWidth = 1000;
let boardHeight = 800;
let context;

// PLAYER PADDLE SETTINGS
// SET DIFFICULTIES
let playerWidth = 150; //1000 for testing, 150 normal
let playerHeight = 20;
let playerVelocityX = 30;
let playerColor = "lightgreen";

let player = {
  x: boardWidth / 2 - playerWidth / 2,
  y: boardHeight - playerHeight - 5,
  width: playerWidth,
  height: playerHeight,
  velocityX: playerVelocityX,
  color: playerColor,
};

let shaq = {
  x: boardWidth / 2 - (playerWidth + 100) / 2,
  y: boardHeight - (playerHeight + 100) - 5,
  width: playerWidth + 100,
  height: playerHeight + 100,
  velocityX: playerVelocityX - 5,
  color: '#4249ce',
};

let lebron = {
  x: boardWidth / 2 - (playerWidth + 80) / 2,
  y: boardHeight - (playerHeight + 80) - 5,
  width: playerWidth + 80,
  height: playerHeight + 80,
  velocityX: playerVelocityX + 50,
  color: 'maroon',
};


let game = {
  resetPlayer : lebron,
  activePlayer: {...lebron},
};

// game.activePlayer = game.activePlayer

// BALL SETTINGS
// SET DIFFICULTIES
let ballWidth = 20;
let ballHeight = 20;
let ballVelocityX = -4; //15 for testing, 3 normal
let ballVelocityY = 4; //10 for testing, 2 normal
let ballColor = "orange";

let ball = {
  x: boardWidth / 2,
  y: boardHeight / 2,
  width: ballWidth,
  height: ballHeight,
  velocityX: ballVelocityX,
  velocityY: ballVelocityY,
  color: ballColor,
};

// BLOCK ARRAY SETTINGS //
let blocks = {
  blockStyle: "white",
  blockArray: [],
  blockWidth: 50,
  blockHeight: 10,
  blockColumns: 16,
  blockRows: 3, // add more as game goes on
  blockMaxRows: 10, // limit how many rows
  blockCount: 0,
  // BRICK ROWS STARTING POSITION //
  blockX: 10,
  blockY: 65,
};

// GAME INITIAL STATES //
let score = 0;
let gameOver = false;

// SET UP GAME PIECES ON LOAD //
////////////////////////////////
window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); // used for drawing on the board

  // draw initial game.activePlayer
  context.fillStyle = game.activePlayer.color;
  context.fillRect(
    game.activePlayer.x,
    game.activePlayer.y,
    game.activePlayer.width,
    game.activePlayer.height
  );

  requestAnimationFrame(update);
  document.addEventListener("keydown", movePlayer);

  // create blocks
  createBlocks();
};


/* 
UPDATE FUNCTION - DRAWING/REFRESHING CANVAS, DETECTING COLLISION,
LEVEL PROGRESSION, AND DISPLAY SCORE
*/ //////////////////////////////////////////////////////////////
function update() {
  // CONTROL FPS
  const fps = 100;
  setTimeout(() => {
    requestAnimationFrame(update);
  }, 1000 / fps);

  if (gameOver) {
    // STOP DRAWING
    return;
  }
  // REFRESHING CANVAS
  context.clearRect(0, 0, board.width, board.height);

  // DRAW PLAYER
  context.fillStyle = game.activePlayer.color;
  context.fillRect(
    game.activePlayer.x,
    game.activePlayer.y,
    game.activePlayer.width,
    game.activePlayer.height
  );

  // DRAW AND ANIMATE BALL
  context.fillStyle = ball.color;
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  // PADDLE REBOUNDING
  if (
    topCollision(ball, game.activePlayer) ||
    bottomCollision(ball, game.activePlayer)
  ) {
    ball.velocityY *= -1; // flip y direction up or down
  } else if (
    leftCollision(ball, game.activePlayer) ||
    rightCollision(ball, game.activePlayer)
  ) {
    ball.velocityX *= -1; // flip x direction left or right
  }

  // DETECT COLLISION WITH CANVAS EDGES
  if (ball.y <= 0) {
    // if ball touches top of canvas
    ball.velocityY *= -1; //reverse direction
  } else if (ball.x <= 0 || ball.x + ball.width >= boardWidth) {
    // if ball touches left or right of canvas
    ball.velocityX *= -1; //reverse direction
  } else if (ball.y + ball.height >= boardHeight) {
    ///////////////
    // GAME OVER //
    // if ball touches bottom of canvas
    // display game over message in the center, set gameOver to true
    context.font = "bold 30px monospace, Verdana, sans-serif";
    let message1 = "G A M E O V E R";
    let message2 = "Press Space to Restart";
    context.fillText(
      message1,
      boardWidth / 2 - context.measureText(message1).width / 2,
      boardHeight / 2
    );
    context.font = "24px monospace, Verdana, sans-serif";
    context.fillText(
      message2,
      boardWidth / 2 - context.measureText(message2).width / 2,
      boardHeight / 2 + 35
    );
    gameOver = true;
  }

  // UPDATE AND DRAW BLOCKS
  context.fillStyle = blocks.blockStyle;
  for (let i = 0; i < blocks.blockArray.length; i++) {
    // BLOCK ARRAY IS LOOPED TO DETECT FOR BLOCK COLLISION AND DRAWS UPDATED ARRAY
    let newBlock = blocks.blockArray[i];
    if (!newBlock.break) {
      if (topCollision(ball, newBlock) || bottomCollision(ball, newBlock)) {
        // HANDLE TOP/BOTTOM COLLISION
        newBlock.break = true; // newBlock is broken
        ball.velocityY *= -1; // flip y direction up or down
        score += 100;
        blocks.blockCount -= 1;
      } else if (
        leftCollision(ball, newBlock) ||
        rightCollision(ball, newBlock)
      ) {
        // HANDLE LEFT/RIGHT COLLISION
        newBlock.break = true; // newBlock is broken
        ball.velocityX *= -1; // flip x direction left or right
        score += 100;
        blocks.blockCount -= 1;
      }
      context.fillRect(newBlock.x, newBlock.y, newBlock.width, newBlock.height);
    }
  }

  // NEXT LEVEL
  if (blocks.blockCount == 0) {
    score += 100 * blocks.blockRows * blocks.blockColumns; // bonus points
    blocks.blockRows = Math.min(blocks.blockRows + 1, blocks.blockMaxRows);
    createBlocks();
  }

  // DISPLAY SCORE
  context.font = "30px sans-serif";
  context.fillStyle = "white";
  context.fillText(score, 20, 40);
}


// FUNCTION FOR CREATING BLOCKS //
//////////////////////////////////
function createBlocks() {
  blocks.blockArray = []; //clear blocks.blockArray
  for (let c = 0; c < blocks.blockColumns; c++) {
    // loop # of columns
    for (let r = 0; r < blocks.blockRows; r++) {
      // loop # of rows
      // instantiate an object for each new block we are creating
      let newBlock = {
        x: blocks.blockX + c * blocks.blockWidth + c * 12, // c*10 space 10 pixels apart columns
        y: blocks.blockY + r * blocks.blockHeight + r * 10, // r*10 space 10 pixels apart rows
        width: blocks.blockWidth,
        height: blocks.blockHeight,
        break: false,
      };
      // then add newBlock to our "blocks" object's blockArray
      blocks.blockArray.push(newBlock);
    }
  }
  // set our blockCount with amount of newBlocks we created
  blocks.blockCount = blocks.blockArray.length;
}

// FUNCTION TO LISTEN FOR PLAYER INPUTS //
//////////////////////////////////////////
function movePlayer(e) {
  if (gameOver) {
    if (e.code == "Space") {
      resetGame();
      console.log("RESET");
    }
    return;
  }
  if (e.code == "ArrowLeft") {
    // game.activePlayer.x -= game.activePlayer.velocityX;
    let nextplayerX = game.activePlayer.x - game.activePlayer.velocityX
    if (!outOfBounds(nextplayerX)) {
      game.activePlayer.x = nextplayerX;
    }
  } else if (e.code == "ArrowRight") {
    let nextplayerX = game.activePlayer.x + game.activePlayer.velocityX;
    if (!outOfBounds(nextplayerX)) {
      game.activePlayer.x = nextplayerX;
    }
    // game.activePlayer.x += game.activePlayer.velocityX;
  }
}

// FUNCTION TO DETECT IF MOVING PIECES GO OUT OF BOUNDS //
//////////////////////////////////////////////////////////
function outOfBounds(xPosition) {
  return xPosition < 0 || xPosition + game.activePlayer.width >= boardWidth;
}

// COLLISION DETECTION FUNCTIONS //
///////////////////////////////////
function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && //a's top right corner passes b's top left corner
    a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y
  ); //a's bottom left corner passes b's top left corner
}

function topCollision(ball, block) {
  //a is above b (ball is above block)
  return detectCollision(ball, block) && ball.y + ball.height >= block.y;
}

function bottomCollision(ball, block) {
  //a is above b (ball is below block)
  return detectCollision(ball, block) && block.y + block.height >= ball.y;
}

function leftCollision(ball, block) {
  //a is left of b (ball is left of block)
  return detectCollision(ball, block) && ball.x + ball.width >= block.x;
}

function rightCollision(ball, block) {
  //a is right of b (ball is right of block)
  return detectCollision(ball, block) && block.x + block.width >= ball.x;
}
///////////////////////////////////

// RESET GAME - RESETS PLAYER, BALL, AND BLOCK SETTINGS TO INITIAL STATE //
///////////////////////////////////////////////////////////////////////////
function resetGame() {
  gameOver = false;
  game.activePlayer = {...game.resetPlayer}
  ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY,
    color: ballColor,
  };
  blocks.blockArray = [];
  blocks.blockRows = 3;
  score = 0;
  createBlocks();
}
