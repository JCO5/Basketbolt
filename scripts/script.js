"use strict";

// BOARD SETTINGS
let board;
let boardWidth = 1000;
let boardHeight = 800;
let context;

// PLAYER PADDLE SETTINGS //
// CHARACTER OBJECTS //
// SET DIFFICULTIES //
////////////////////////////
let playerWidth = 150; //1000 for testing, 150 normal
let playerHeight = 20;
let playerVelocityX = 10; // start with 10
let playerColor = "lightgreen";

let player = {
  x: boardWidth / 2 - playerWidth / 2,
  y: boardHeight - playerHeight - 5,
  width: playerWidth,
  height: playerHeight,
  velocityX: playerVelocityX,
  color: playerColor,
};

// EASY BUT SLOW
let shaq = {
  // playerWidth + x needs to be updated together
  // as well as playerHeight + x
  name: "shaq",
  x: boardWidth / 2 - (playerWidth + 100) / 2,
  width: playerWidth + 100,
  y: boardHeight - (playerHeight + 200) - 5,
  height: playerHeight + 200,
  velocityX: playerVelocityX + 10,
  color: "#4249ce",
};

// MEDIUM
let lebron = {
  // playerWidth + x needs to be updated together
  // as well as playerHeight + x
  name: "lebron",
  x: boardWidth / 2 - (playerWidth + 50) / 2,
  width: playerWidth + 50,
  y: boardHeight - (playerHeight + 150) - 5,
  height: playerHeight + 150,
  velocityX: playerVelocityX + 40,
  color: "#880016",
  ballVelocityX: 4,
  ballVelocityY: 9,
};

// PRETTY HARD
let curry = {
  // playerWidth + x needs to be updated together
  // as well as playerHeight + x
  name: "curry",
  x: boardWidth / 2 - (playerWidth - 10) / 2,
  width: playerWidth - 10,
  y: boardHeight - (playerHeight + 80) - 5,
  height: playerHeight + 80,
  velocityX: playerVelocityX + 40,
  color: "#ffc809",
  ballVelocityX: 4,
  ballVelocityY: 9,
};

// BIT EASIER THAN CURRY
let nash = {
  // playerWidth + x needs to be updated together
  // as well as playerHeight + x
  name: "nash",
  x: boardWidth / 2 - (playerWidth - 15) / 2,
  width: playerWidth - 15,
  y: boardHeight - (playerHeight + 120) - 5,
  height: playerHeight + 120,
  velocityX: playerVelocityX + 50,
  color: "#5c3568",
};

const game = {
  isRunning: false,
  currentScreen: null,
  // DOM variables
  startScreen: {
    playerNameInput: $("#name-input"),
    playBtn: $("#play-btn"),
    rulesBtn: $("#rules-btn"),
    characters: $("#player-select > input"),
  },
  gameScreen: $("#game-screen"),
  gameOverScreen: {},
  // Game variables
  playerName: undefined,
  resetPlayer: null,
  activePlayer: null,
};

function setCharacter() {
  let players = game.startScreen.characters;
  for (let i = 0; i < players.length; i++) {
    // console.log(players[i].value);
    if (players[i].checked) {
      let player = players[i].value;
      switch (player) {
        case "curry":
          game.resetPlayer = curry;
          game.activePlayer = { ...curry };
          break;
        case "nash":
          game.resetPlayer = nash;
          game.activePlayer = { ...nash };
          break;
        case "lebron":
          game.resetPlayer = lebron;
          game.activePlayer = { ...lebron };
          break;
        case "shaq":
          game.resetPlayer = shaq;
          game.activePlayer = { ...shaq };
          break;
      }
    }
  }
}

function setName() {
  game.playerName = game.startScreen.playerNameInput[0].value;
  console.log(game.playerName);
}

function entryInvalid(error) {
  if (error === "name") {
    let name = game.startScreen.playerNameInput;
    name.css({
      border: "3px solid red",
      "border-radius": "3px",
    });
    name[0].placeholder = "Please enter a name!";
    console.log("name error");
  } else if (error === "character") {
    // clear any messages first
    $("#player-select > p:first-child + p").remove();
    // create error message and append
    let message = $("<p></p>")
      .text("You must select a character")
      .css({ color: "white", "font-size": "1.5rem" });
    $("#player-select > p:first-child").after(message);
  }
}
entryInvalid();

game.startScreen.playBtn.on("click", () => {
  setCharacter();
  setName();
  console.log(
    "pname",
    game.playerName,
    "reset",
    game.resetPlayer,
    "active",
    game.activePlayer
  );
  // Handle empty name and character entries //
  if (!game.playerName) {
    entryInvalid("name");
  }
  if (!game.resetPlayer || !game.activePlayer) {
    entryInvalid("character");
  } 
  if(game.playerName && game.resetPlayer && game.activePlayer) {
    $("#splash-screen").hide();
    $('#game-screen').show()
  }
});

game.startScreen.playerNameInput.on("focus", () => {
  let name = game.startScreen.playerNameInput;
  name.css({
    border: "0",
  });
});
