"use strict";

const canvas = document.createElement("canvas");
canvas.id = "canvas";
document.getElementById("game-screen").appendChild(canvas);
canvas.width = 1200;
canvas.height = 600;

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
        gameScreen: {
            
        },
        gameOverScreen: {
          
        },

        
}}