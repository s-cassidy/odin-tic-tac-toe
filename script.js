'use strict';

const game = (() => {
  let remainingMoves;

  const reset = function() {
    remainingMoves =
      [...Array(15).keys()].map((i) => i + 1);
  }

  const getRemainingMoves = () => console.log(remainingMoves);

  return { reset, getRemainingMoves };
})();

game.reset();
game.getRemainingMoves();
