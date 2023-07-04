"use strict";

// Creating the canvas element in JS so that my autocomplete works in vs code
const canvas = document.createElement("canvas");
canvas.id = "canvas";
document.getElementById("game-screen").appendChild(canvas);
canvas.width = 1200;
canvas.height = 600;