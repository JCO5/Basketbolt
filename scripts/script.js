"use strict";
// Canvas Variables

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

    // BALL SETTINGS
    // SET DIFFICULTIES
    let ballWidth = 20;
    let ballHeight = 20;
    let ballVelocityX = -4; //15 for testing, 3 normal
    let ballVelocityY = 4; //10 for testing, 2 normal
    let ballColor = "orange";

// game object
const game = {
  isRunning: false,
  currentScreen: null,
  // DOM variables
  elems: {
    startScreen: {
      playerNameInput: document.getElementById("name-input"),
      playBtn: document.getElementById("play-btn"),
      rulesBtn: document.getElementById("rules-btn"),
      playerSelect: document.getElementById("player-select"),
    },
    gameScreen: {},
    gameOverScreen: {},
  },
};
