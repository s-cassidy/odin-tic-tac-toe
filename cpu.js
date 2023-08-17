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


game.reset();
let playerOne = newPlayer("X", game, consoleMovePrompt);
let playerTwo = newPlayer("O", game, cpuIntelligence);
game.addPlayer(playerOne);
game.addPlayer(playerTwo);
game.firstTurn();
