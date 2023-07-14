"use strict";

import {
  drawBoard,
  ball,
  ballSettings,
  game,
  curry,
  nash,
  lebron,
  shaq,
} from "./game.js";

/////// SCREEN CONTROL //////////
////////////////////////////////
let screen = {
  // isRunning: false,
  // currentScreen: null,
  // DOM VARIABLES //
  startScreen: {
    playerNameInput: $("#name-input"),
    playBtn: $("#play-btn"),
    rulesBtn: $("#rules-btn"),
    characters: $("#player-select > input"),
    exitBtn: $("#exit-btn"),
  },
  gameScreen: $("#game-screen"),
  gameOverScreen: {},

  // RUN GAME //
  //////////////
  init: function () {
    // Just a event listener to get rid of red error border
    screen.startScreen.playerNameInput.on("focus", () => {
      let name = screen.startScreen.playerNameInput;
      name.css({
        border: "0",
      });
    });

    screen.startScreen.playBtn.on("click", () => {
      screen.setCharacter();
      screen.setName();
      // debugging
      console.log(
        "pname:",
        game.playerName,
        "reset:",
        game.resetPlayer,
        "active:",
        game.activePlayer
      );
      // Handle empty name and character entries //
      if (!game.playerName) {
        screen.entryInvalid("name");
      }
      if (!game.resetPlayer || !game.activePlayer) {
        screen.entryInvalid("character");
      }
      if (game.playerName && game.resetPlayer && game.activePlayer) {
        // if required game values are fulfilled, switch to game screen
        $("#splash-screen").hide();
        $("#game-screen").show();
        // set ball position
        ball.y = game.activePlayer.y - ballSettings.ballHeight;
        ball.velocityX = 0;
        ball.velocityY = 0;
        // log ball properties - debugging purposes
        console.log({ ...ball });
        // draw board
        drawBoard();

        // initial player velocity is 0 to prevent movement before game starts
        game.activePlayer.velocityX = 0;

        console.log(game.activePlayer)

        // WHEN PLAYER PRESSES ENTER AND GAME STARTS 
        document.addEventListener("keypress", startGame);
        function startGame(e) {
          if (e.key == 'Enter') {
            // Hide message, and show exit button
            $('#start').hide();
            screen.startScreen.exitBtn.css("display", "inline");
            // activate ball movement
            ball.velocityX = game.activePlayer.ballVelocityX;
            ball.velocityY = game.activePlayer.ballVelocityY;
            // save the initial ball settings to game
            game.resetBall = {...ball};
            game.activePlayer.velocityX = game.activePlayer.setVelocityX;
            console.log(game.activePlayer);
            // clear 'enter' key event listener
            document.removeEventListener("keypress", startGame);
          }
        }
      }
    });

    screen.startScreen.exitBtn.on("click", () => {
      $("#splash-screen").show();
      $("#game-screen").hide();
      screen.startScreen.playerNameInput.val("");
      for(let input of screen.startScreen.characters){
        input.checked = false;
      }
    });
  },

  // Helper Function: Save selected character
  setCharacter: function () {
    let players = screen.startScreen.characters;
    for (let i = 0; i < players.length; i++) {
      // console.log(players[i].value);
      if (players[i].checked) {
        let player = players[i].value;
        // Set player values according to character selected
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
  },

  // Helper Function: Save player name
  setName: function () {
    game.playerName = screen.startScreen.playerNameInput[0].value;
    console.log(game.playerName);
  },

  // Helper Function: Display errors for splash screen
  entryInvalid: function (error) {
    if (error === "name") {
      let name = screen.startScreen.playerNameInput;
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
  },
};

/////////////////////////////////////////
screen.init();
