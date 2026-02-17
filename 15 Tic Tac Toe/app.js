/* 
12 Features to add:
    1. add a way to switch who goes first in the next game
    3. score board
    4. score board reset button
*/

const boardEl = document.querySelector(".board");
const messageEl = document.getElementById("player-message");
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let currentPlayer = "X";
let boardState = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;

function playerName() {
  return currentPlayer === "X" ? "Player 1" : "Player 2";
}

function setMessage() {
  messageEl.textContent = `${playerName()}'s turn`;
}

setMessage();

boardEl.addEventListener("click", function (event) {
  const cellEl = event.target;
  if (!cellEl.classList.contains("cell")) return;

  if (cellEl.textContent !== "") return;

  if (gameOver) return;

  cellEl.textContent = currentPlayer;
  boardState[cellEl.dataset.index] = currentPlayer;

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      messageEl.textContent = `${playerName()} wins!`;
      gameOver = true;
      boardEl.classList.add("disabled");
      return;
    }
  }

  if (!boardState.includes("")) {
    messageEl.textContent = "It's a draw!";
    gameOver = true;
    boardEl.classList.add("disabled");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  setMessage();
});

const restartBtn = document.getElementById("restart-btn");
restartBtn.addEventListener("click", function () {
  currentPlayer = "X";
  boardState = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  setMessage();
  boardEl.classList.remove("disabled");
  const cellEls = document.querySelectorAll(".cell");
  cellEls.forEach((cell) => (cell.textContent = ""));
});