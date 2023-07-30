'use strict';

const game = (() => {
  let remainingMoves;

  const reset = function() {
    remainingMoves =
      [...Array(15).keys()];
  }

  const getRemainingMoves = () => remainingMoves;

  const removeRemainingMove = function(number) {
    let index = remainingMoves.indexOf(number);
    remainingMoves.splice(index, 1);
  }

  return { reset, getRemainingMoves, removeRemainingMove };
})();


const newPlayer = function(symbol, game) {
  let squaresOwned = [];

  const playMove = function(number) {
    if (number in game.getRemainingMoves()) {
      squaresOwned.push(number);
      game.removeRemainingMove(number);
    }

  }
  return {
    symbol, squaresOwned, playMove
  }
}


game.reset();
let playerOne = newPlayer("X", null, game);
