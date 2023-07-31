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
    currentTurn.takeTurn()
    this.nextTurn();

  }

  const nextTurn = function() {
    let k = players.indexOf(currentTurn);
    currentTurn = players[1 - k];
    console.log(`Player ${players[0].symbol} has ${players[0].squaresOwned}`)
    console.log(`Player ${players[1].symbol} has ${players[1].squaresOwned}`)
    currentTurn.takeTurn();
    if (!currentTurn.hasWon()) {
      if (this.getRemainingMoves()) {
        this.nextTurn();
      }
      else {
        console.log("Game is a draw");
      }
    }
    else {
      console.log(`Player ${currentTurn.symbol} has won!`);
    }
  }


  const getRemainingMoves = () => remainingMoves;

  const removeRemainingMove = function(number) {
    let index = remainingMoves.indexOf(number);
    remainingMoves.splice(index, 1);
  }

  return { reset, getRemainingMoves, addPlayer, removeRemainingMove, nextTurn, firstTurn, currentTurn };
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


function newPlayer(symbol, game) {
  let squaresOwned = [];

  const playMove = function(number) {
    if (game.getRemainingMoves().includes(number)) {
      squaresOwned.push(number);
      game.removeRemainingMove(number);
      return true;
    }
    else {
      console.log("Number is already owned, please choose another");
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

  const takeTurn = function() {
    let input = prompt(`Choose a number from ${game.getRemainingMoves()}`)
    let moveAttempt = playMove(parseInt(input));
    if (!moveAttempt) {
      takeTurn();
    }
  }

  return {
    symbol, squaresOwned, playMove, hasWon, getWinningMoves, takeTurn
  }
}

function cpuIntelligence(game) {
  const me = game.currentTurn;
  let k = game.players.indexOf(me);
  const opponent = game.players[1 - k];
  let remaining = game.getRemainingMoves()

  if (me.getWinningMoves()) {
    me.playMove(me.getWinningMoves()[0])
    return;
  }

  if (opponent.getWinningMoves()) {
    me.playMove(opponent.getWinningMoves()[0])
    return;
  }

  if (remaining.length === 9) {
    let chooser = Math.random();
    if (chooser < 0.125) {
      me.playMove(1);
      return;
    }
    else if (chooser < 0.25) {
      me.playMove(5);
      return;
    }
    else if (chooser < 0.375) {
      me.playMove(2);
      return;
    }
    else if (chooser < 0.5) {
      me.playMove(7);
      return;
    }
    else {
      me.playMove(4);
      return;
    }
  }

  else {
    let winningCombinations = getWinningCombinations(me.squaresOwned, remaining);
    let bestMove;
    if (winningCombinations.length > 0) {
      bestMove = findBestMove(remaining, winningCombinations);
    }
    else {
      let opponentWinningCombinations = getWinningCombinations(opponent.squaresOwned, remaining);
      if (winningCombinations.length > 0) {
        bestMove = findBestMove(remaining, opponentWinningCombinations);
      }
      else {
        bestMove = remaining[0]
      }
    }
    me.playMove(bestMove);
  }

}

function getWinningCombinations(playersNumbers, remainingNumbers) {
  let winningCombinations = [];
  let numberPool = playersNumbers.concat(remainingNumbers);
  for (let combination of combinationsOf(numberPool, 3)) {
    if (sum(combination === 12)) {
      winningCombinations.push(combination);
    }
  }
}

function findBestMove(remainingMoves, winningCombinations) {
  let optionCounter = {};
  for (let potentialMove of remainingMoves) {
    optionCounter[potentialMove] = 0;
    for (let winningCombination of winningCombinations) {
      if (winningCombination.includes(potentialMove)) {
        optionCounter[potentialMove]++;
      }
    }
  }

  let bestMove = potentialMove;
  for (let option in optionCounter) {
    if (optionCounter[option] > optionCounter[bestMove]) {
      bestMove = option;
    }
  }
  return bestMove;
}


game.reset();
let playerOne = newPlayer("X", game);
let playerTwo = newPlayer("O", game);
game.addPlayer(playerOne);
game.addPlayer(playerTwo);
game.firstTurn();
