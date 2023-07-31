'use strict';

const MAGIC_NUMBER = 12;


const game = (() => {
  let remainingMoves;

  const reset = function() {
    remainingMoves =
      [...Array(9).keys()];
  }

  const getRemainingMoves = () => remainingMoves;

  const removeRemainingMove = function(number) {
    let index = remainingMoves.indexOf(number);
    remainingMoves.splice(index, 1);
  }

  return { reset, getRemainingMoves, removeRemainingMove };
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


const newPlayer = function(symbol, game) {
  let squaresOwned = [];

  const playMove = function(number) {
    if (number in game.getRemainingMoves()) {
      squaresOwned.push(number);
      game.removeRemainingMove(number);
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

  const canWin = function() {
    if (squaresOwned.length <= 1) {
      return false;
    }

    for (let combination of combinationsOf(squaresOwned, 2)) {
      if (game.getRemainingMoves().includes(MAGIC_NUMBER - sum(combination))) {
        return true;
      }
    }
    return false;
  }


  return {
    symbol, squaresOwned, playMove, hasWon, canWin
  }

}




game.reset();
let playerOne = newPlayer("X", game);
