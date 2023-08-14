'use strict';

const MAGIC_NUMBER = 12;

const gameBoard = (() => {
  let remainingMoves = [];

  const reset = function() {
    this.remainingMoves =
      [...Array(9).keys()];
  }

  const removeRemainingMove = function(number) {
    let index = remainingMoves.indexOf(number);
    remainingMoves.splice(index, 1);
  }

  return { remainingMoves, reset, removeRemainingMove }
})()



const domBoardController = (() => {
  let grid = document.querySelectorAll(".grid-square");
  function addBoardListeners() {
    for (let square of grid) {
      let playSquare = function(event) {
        game.playMove(
          parseInt(event.target.getAttribute("data-square")))
      }
      square.addEventListener('click', playSquare, { once: true })
    }
  }

  function redrawBoard(game) {
    for (let square of grid) {
      square.textContent = "";
    }

    for (let player of game.players) {
      for (let square of grid) {
        if (player.squaresOwned.includes(parseInt(square.getAttribute("data-square")))) {
          square.textContent = player.symbol;
        }
      }
    }
  }
  return { addBoardListeners, redrawBoard }
})()

const game = ((board) => {
  let players = [];
  let currentTurn;

  const addPlayer = function(player) {
    if (players.length < 2) {
      players.push(player);
    }
  }

  const pickFirstMove = function() {
    currentTurn = players[Math.floor(Math.random() * 2)];
  }

  const advanceTurn = function() {
    let k = players.indexOf(currentTurn);
    currentTurn = players[1 - k];
  }

  const checkDraw = function() {
    return board.remainingMoves.length === 0;
  }

  const playMove = function(number) {
    if (!board.remainingMoves.includes(number)) {
      console.log("Move already taken!");
      return;
    }
    currentTurn.squaresOwned.push(number);
    board.removeRemainingMove(number);
    domBoardController.redrawBoard(this);

    if (!currentTurn.hasWon()) {
      if (checkDraw()) {
        console.log("It's a draw");
        return;
      }
      advanceTurn();
    } else {
      console.log(`Player ${currentTurn.symbol} has won!`);
      return;
    }
  }

  return { addPlayer, playMove, players, pickFirstMove }

})(gameBoard)


const gameOptionsController = function() {
  const swapButton = document.querySelector(".swap")
  const goButton = document.querySelector(".go")
  const pOneName = document.querySelector("#player-one-name")
  const pOneSymbol = document.querySelector("#player-one-symbol")
  const pOneScore = document.querySelector("#player-one-score")
  const pTwoName = document.querySelector("#player-two-name")
  const pTwoSymbol = document.querySelector("#player-two-symbol")
  const pTwoScore = document.querySelector("#player-two-score")
  swapButton.addEventListener('click', swapSymbols)

  function swapSymbols() {
    if (pOneSymbol.value === "X") {
      pOneSymbol.value = "O";
      pTwoSymbol.value = "X";
    } else {
      pOneSymbol.value = "X";
      pTwoSymbol.value = "O";
    }
  }

  return { swapSymbols }
}()


const utils = (() => {
  const combinationsOf = function(array, choose) {
    let n = array.length;
    let combinations = [];

    if (choose === 1) {
      combinations = array.map((x) => [x]);
    }
    else {
      let partialArray;
      let element;
      for (let i = 0; i < n; i++) {
        element = array[i];
        partialArray = array.slice(i + 1);
        for (let combination of combinationsOf(partialArray, choose - 1)) {
          combination.unshift(element);
          combinations.push(combination);
        }
      }
    }
    return combinations;
  }

  const sum = function(array) {
    return array.reduce((T, x) => T + x)
  }

  return { sum, combinationsOf };
})()


function newPlayer(symbol, name) {
  let squaresOwned = [];
  let score = 0;

  const hasWon = function() {
    if (squaresOwned.length < 3) {
      return false;
    }
    for (let combination of utils.combinationsOf(squaresOwned, 3)) {
      if (utils.sum(combination) === MAGIC_NUMBER) {
        return true;
      }
    }
    return false;
  }

  return {
    squaresOwned, score, symbol, name, hasWon
  };
}


gameBoard.reset();
domBoardController.addBoardListeners();
let playerOne = newPlayer("X", "Sam");
let playerTwo = newPlayer("O", "Kirsty");
game.addPlayer(playerOne);
game.addPlayer(playerTwo);
game.pickFirstMove();
