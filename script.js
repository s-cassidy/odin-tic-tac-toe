'use strict';

const MAGIC_NUMBER = 12;


const game = (() => {
  let remainingMoves;
  let players = [];
  let currentTurn;

  const reset = function() {
    remainingMoves =
      [...Array(9).keys()];
  }

  const addPlayer = function(player) {
    if (players.length < 2) {
      players.push(player);
    }
  }

  const firstTurn = function() {
    currentTurn = players[Math.floor(Math.random() * 2)];
    this.nextTurn();
  }

  const nextTurn = function() {
    if (!currentTurn.hasWon()) {
      if (this.getRemainingMoves().length === 0) {
        console.log("Game is a draw");
      }
    }
    else {
      console.log(`Player ${currentTurn.symbol} has won!`);
      return;
    }
    let k = players.indexOf(currentTurn);
    currentTurn = players[1 - k];
    console.log(`${currentTurn.symbol}.takeTurn called`);
    currentTurn.takeTurn(this);
  }


  const getRemainingMoves = () => remainingMoves;
  const getPlayers = () => players;
  const getCurrentTurn = () => currentTurn;

  const removeRemainingMove = function(number) {
    let index = remainingMoves.indexOf(number);
    remainingMoves.splice(index, 1);
  }

  return { reset, getRemainingMoves, addPlayer, getPlayers, removeRemainingMove, nextTurn, firstTurn, getCurrentTurn };
})();


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


function newPlayer(symbol, game, turnTaker) {
  let squaresOwned = [];

  const playMove = function(number) {
    console.log("playMove called");
    if (game.getRemainingMoves().includes(number)) {
      squaresOwned.push(number);
      game.removeRemainingMove(number);
      drawBoard(game);
      game.nextTurn();
      return true;
    }
    else {
      console.log(`Player ${symbol} tried to play ${number}, is already owned, please choose another`);
      return false;
    }
  }

  const hasWon = function() {
    if (squaresOwned.length < 3) {
      return false;
    }
    for (let combination of combinationsOf(squaresOwned, 3)) {
      if (sum(combination) === MAGIC_NUMBER) {
        return true;
      }
    }
    return false;
  }

  const getWinningMoves = function() {
    let winningMoves = [];
    let neededToWin;

    if (squaresOwned.length > 1) {
      for (let combination of combinationsOf(squaresOwned, 2)) {
        neededToWin = MAGIC_NUMBER - sum(combination)
        if (game.getRemainingMoves().includes(neededToWin)) {
          winningMoves.push(neededToWin);
        }
      }
    }
    return winningMoves;
  }

  const takeTurn = turnTaker;

  return {
    symbol, squaresOwned, playMove, hasWon, getWinningMoves, takeTurn
  }
}

function addMoveButtons(game) {
  for (let square of grid) {
    let playSquare = function(event) {
      game.getCurrentTurn().playMove(
        parseInt(event.target.getAttribute("data-square")))
    }
    let sqNo = parseInt(square.getAttribute("data-square"));
    square.removeEventListener('click', playSquare);
    if (game.getRemainingMoves().includes(sqNo)) {
      square.addEventListener('click', playSquare, { once: true })
    }
  }
}

function consoleMovePrompt(game) {
  let input = prompt(`Choose a number from ${game.getRemainingMoves()}`)
  let moveAttempt = this.playMove(parseInt(input));
  if (!moveAttempt) {
    takeTurn();
  }
}


function cpuIntelligence(game) {
  const me = game.getCurrentTurn();
  let k = game.getPlayers().indexOf(me);
  const opponent = game.getPlayers()[1 - k];
  let remaining = game.getRemainingMoves();

  if (me.getWinningMoves().length > 0) {
    me.playMove(me.getWinningMoves()[0])
    return;
  }

  if (opponent.getWinningMoves().length > 0) {
    me.playMove(opponent.getWinningMoves()[0])
    return;
  }

  if (remaining.length === 9) {
    me.playMove(pickFirstMove())
    return;
  }

  let moveTowardAWin = chooseAMove(me, remaining);
  console.log(moveTowardAWin);
  if (moveTowardAWin !== null) {
    me.playMove(moveTowardAWin);
    return;
  }

  let moveTowardADraw = chooseAMove(opponent, remaining);
  if (moveTowardADraw !== null) {
    me.playMove(moveTowardADraw);
    return;
  }

  me.playMove(randomChoice(remaining))
  return;
}

function chooseAMove(player, remaining) {
  let bestMoves;
  let winningCombinations = getWinningCombinations(player.squaresOwned, remaining);
  if (winningCombinations.length > 0) {
    bestMoves = findBestMoves(remaining, winningCombinations);
    return randomChoice(bestMoves);
  }
  else {
    return null;
  }


}

function pickFirstMove() {
  let chooser = Math.random();
  if (chooser < 0.125) {
    return 1;
  }
  else if (chooser < 0.25) {
    return 5;
  }
  else if (chooser < 0.375) {
    return 2;
  }
  else if (chooser < 0.5) {
    return 7;
  }
  else {
    return 4;
  }
}

function getWinningCombinations(playersNumbers, remainingNumbers) {
  let winningCombinations = [];
  let numberPool = playersNumbers.concat(remainingNumbers);
  for (let combination of combinationsOf(numberPool, 3)) {
    if (sum(combination) === MAGIC_NUMBER) {
      winningCombinations.push(combination);
    }
  }
  return winningCombinations;
}

function findBestMoves(remainingMoves, winningCombinations) {
  let optionCounter = [];
  for (let potentialMove of remainingMoves) {
    optionCounter[potentialMove] = 0;
    for (let winningCombination of winningCombinations) {
      if (winningCombination.includes(potentialMove)) {
        optionCounter[potentialMove]++;
      }
    }
  }

  let maxOptions = 0;
  for (let option in optionCounter) {
    if (optionCounter[option] > maxOptions) {
      maxOptions = optionCounter[option];
    }
  }
  let bestMoves = [];
  for (let option in optionCounter) {
    if (optionCounter[option] === maxOptions) {
      bestMoves.push(parseInt(option));
    }
  }
  return bestMoves;
}

function randomChoice(array) {
  let n = array.length;
  return array[Math.floor(Math.random() * n)];
}

const grid = document.querySelectorAll(".grid-square");

function drawBoard(game) {
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


game.reset();
let playerOne = newPlayer("X", game, addMoveButtons);
let playerTwo = newPlayer("O", game, cpuIntelligence);
game.addPlayer(playerOne);
game.addPlayer(playerTwo);
game.firstTurn();
