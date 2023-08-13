'use strict';

const MAGIC_NUMBER = 12;

const gameBoard = (() => {
  let remainingMoves = [];

  const reset = function() {
    remainingMoves =
      [...Array(9).keys()];

  }

  const removeRemainingMove = function(number) {
    let index = remainingMoves.indexOf(number);
    remainingMoves.splice(index, 1);
  }
  return { remainingMoves, reset, removeRemainingMove }
})()

let grid = document.querySelectorAll(".grid-square");

function createBoard() {

  for (let square of grid) {
    let playSquare = function(event) {
      game.getCurrentTurn().playMove(
        parseInt(event.target.getAttribute("data-square")))
    }
    square.addEventListener('click', playSquare, { once: true })
  }
}

function redrawBoard(game) {
  for (let square of grid) {
    square.textContent = "";
  }

  for (let player of game.getPlayers()) {
    for (let square of grid) {
      if (player.squaresOwned.includes(parseInt(square.getAttribute("data-square")))) {
        square.textContent = player.symbol;
      }
    }
  }
}

const game = ((board) => {
  let players = [];
  let currentTurn;

})(board)

function newPlayer(symbol, name) {
  let squaresOwned = [];
  let score = 0;
  let symbol = symbol;
  let name = name;
}
