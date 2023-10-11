'use strict';

const MAGIC_NUMBER = 12;

const gameBoard = (() => {
  let remainingMoves = [];

  const reset = function() {
    for (let j of [...Array(9).keys()]) {
      remainingMoves.push(j)
    }
  }

  const removeRemainingMove = function(number) {
    let index = remainingMoves.indexOf(number);
    remainingMoves.splice(index, 1);
  }

  return { remainingMoves, reset, removeRemainingMove }
})()


const domBoardController = ((board) => {
  let grid = document.querySelectorAll(".grid-square");

  function addBoardListeners() {
    for (let square of grid) {
      let playSquare = function(event) {
        let squareNumber = parseInt(event.target.getAttribute("data-square"));
        square.classList.remove('hover');
        game.playMove(squareNumber)
      }
      square.addEventListener('click', playSquare)
      let hoverSquare = function(event) {
        let squareNumber = parseInt(event.target.getAttribute("data-square"));
        if (board.remainingMoves.includes(squareNumber)) {
          square.classList.add('hover');
          square.textContent = game.getSymbol();
        }
      }
      let leaveSquare = function(event) {
        let squareNumber = parseInt(event.target.getAttribute("data-square"));
        if (board.remainingMoves.includes(squareNumber)) {
          square.classList.remove('hover');
          square.textContent = '';
        }

      }
      square.addEventListener('mouseenter', hoverSquare)
      square.addEventListener('mouseleave', leaveSquare)
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

  function showWin(combination) {
    for (let square of grid) {
      if (combination.includes(parseInt(square.getAttribute("data-square")))) {
        square.classList.add("winning");
        setTimeout(() => this.hideWin(), 2000)
      }
    }
  }

  function hideWin() {
    for (let square of grid) {
      square.classList.remove("winning")
    }
    clearBoard();
  }

  function clearBoard() {
    for (let square of grid) {
      square.textContent = "";
    }
  }
  return { clearBoard, addBoardListeners, redrawBoard, showWin, hideWin }
})(gameBoard)


const game = ((board) => {
  let players = [];
  let currentTurn;
  let isPlaying = false;

  const addPlayer = function(player) {
    if (players.length < 2) {
      players.push(player);
    }
  }

  const getSymbol = function() {
    if (currentTurn) {
      return currentTurn.symbol
    }
  }

  const pickFirstMove = function() {
    isPlaying = true;
    currentTurn = players[Math.floor(Math.random() * 2)];
    gameOptionsController.showTurn(currentTurn);
  }

  const reset = function() {
    players.pop();
    players.pop();
    currentTurn = null;
  }

  const advanceTurn = function() {
    isPlaying = true;
    let k = players.indexOf(currentTurn);
    currentTurn = players[1 - k];
    gameOptionsController.showTurn(currentTurn);
  }

  const checkDraw = function() {
    return board.remainingMoves.length === 0;
  }

  const playMove = function(number) {
    if (!isPlaying) {
      return;
    }

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
      domBoardController.showWin(currentTurn.hasWon());
      isPlaying = false;
      currentTurn.score++;
      setTimeout(endRound, 2001);
    }
  }

  const endRound = function() {
    gameBoard.reset()
    for (const player of players) {
      while (player.squaresOwned.length > 0) {
        player.squaresOwned.pop();
      }
    }
    gameOptionsController.redrawScore(currentTurn.symbol, currentTurn.score);
    setTimeout(advanceTurn, 100);
    return;
  }

  return {
    addPlayer,
    currentTurn,
    getSymbol,
    reset,
    playMove,
    players,
    pickFirstMove,
    isPlaying,
  }
})(gameBoard)


const gameOptionsController = function() {
  const swapButton = document.querySelector(".swap")
  const goButton = document.querySelector(".go")
  let pOne = {};
  let pTwo = {};
  pOne.name = document.querySelector("#player-one-name")
  pOne.symbol = document.querySelector("#player-one-symbol")
  pOne.score = document.querySelector("#player-one-score")
  pTwo.name = document.querySelector("#player-two-name")
  pTwo.symbol = document.querySelector("#player-two-symbol")
  pTwo.score = document.querySelector("#player-two-score")
  pOne.box = document.querySelector(".player-one")
  pTwo.box = document.querySelector(".player-two")

  let resetButton = document.createElement("button");
  resetButton.setAttribute("type", "button");
  resetButton.textContent = "Reset";
  resetButton.classList.add("reset-button");
  let goContainer = document.querySelector(".go-container");
  let swapContainer = document.querySelector(".swap-container");
  swapButton.addEventListener('click', swapSymbols);
  resetButton.addEventListener('click', pressReset)

  goButton.addEventListener('click', pressGo);

  function swapSymbols() {
    if (pOne.symbol.value === "X") {
      pOne.symbol.value = "O";
      pTwo.symbol.value = "X";
    } else {
      pOne.symbol.value = "X";
      pTwo.symbol.value = "O";
    }
  }

  function redrawScore(symbol, score) {
    for (let player of [pOne, pTwo]) {
      if (player.symbol.value === symbol) {
        player.score.value = score;
      }
    }
  }

  function showTurn(currentTurn) {
    for (let player of [pOne, pTwo]) {
      if (player.symbol.value === currentTurn.symbol) {
        player.box.classList.add("current-turn");
      }
      else {
        player.box.classList.remove("current-turn");
      }
    }
  }


  function pressGo() {
    if (pOne.name.value === "" || pTwo.name.value === "") {
      return;
    }
    let playerOne = newPlayer(pOne.symbol.value, pOne.name.value);
    let playerTwo = newPlayer(pTwo.symbol.value, pTwo.name.value);
    game.addPlayer(playerOne);
    game.addPlayer(playerTwo);
    for (let prop in pOne) {
      pOne[prop].classList.add("fixed");
      pTwo[prop].classList.add("fixed");
    }
    gameBoard.reset();
    domBoardController.addBoardListeners();

    goButton.remove();
    swapButton.remove();
    goContainer.appendChild(resetButton);

    game.pickFirstMove();
  }

  function pressReset() {
    resetButton.remove();
    swapContainer.appendChild(swapButton);
    goContainer.appendChild(goButton);
    game.reset();
    gameBoard.reset();
    domBoardController.clearBoard();
    pOne.score.value = 0;
    pTwo.score.value = 0;
  }

  return { swapSymbols, showTurn, redrawScore }
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
        return combination;
      }
    }
    return false;
  }

  return {
    squaresOwned, score, symbol, name, hasWon
  };
}


