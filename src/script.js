var xoBoard;
const humanPlayer = "O";
const logicPlayer = "X";
const winSets = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
  document.querySelector(".info .message").innerText = "Welcome to xando!!!";
  document.querySelector(".play").style.display = "none";
  xoBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", clickHumanChange, false);
  }
}

function clickHumanChange(box) {
  if (typeof xoBoard[box.target.id] === "number") {
    fillChange(box.target.id, humanPlayer);
    if (!checkTie()) {
      fillChange(bestSpot(), logicPlayer);
    }
  }
}

function bestSpot() {
  return emptySquares()[0];
  //return minimax(xoBoard, logicPlayer).index;
}

function minimax(newBoard, player) {
  var availableSpots = emptySquares(newBoard);

  if (checkWin(newBoard, player)) {
    return { score: -10 };
  } else if (checkWin(newBoard, logicPlayer)) {
    return { score: 10 };
  } else if (availableSpots.length === 0) {
    return { score: 0 };
  }

  var moves = [];
  for (var i = 0; i < availableSpots.length; i++) {
    var move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    if (player == logicPlayer) {
      var result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, logicPlayer);
      move.score = result.score;
    }

    newBoard[availableSpots[i]] = move.index;
    moves.push(move);
  }

  var bestMove;
  if (player === logicPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function emptySquares() {
  return xoBoard.filter((s) => typeof s == "number");
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "darkgrey";
      cells[i].removeEventListener("click", clickHumanChange, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

function declareWinner(who) {
  document.querySelector(".info .message").innerText = who;
  document.querySelector(".play").style.display = "block";
}

function fillChange(boxID, player) {
  xoBoard[boxID] = player;
  document.getElementById(boxID).innerText = player;
  let gameWon = checkWin(xoBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let checkBox = board.reduce(
    (a, e, i) => (e === player ? a.concat(i) : a),
    []
  );
  console.log(checkBox);
  let gameWon = null;
  for (let [index, winSet] of winSets.entries()) {
    if (winSet.every((elem) => checkBox.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winSets[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == humanPlayer ? "limegreen" : "tomato";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", clickHumanChange, false);
  }
  declareWinner(gameWon.player == humanPlayer ? "You Win!" : "You Lose!");
}
