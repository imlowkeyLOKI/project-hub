const form = document.getElementById("guess-form");
const input = document.getElementById("guess-input");
const inputErrorEl = document.getElementById("input-error");
const feedbackEl = document.getElementById("feedback");
const remainingEl = document.getElementById("remaining-guesses");
const meterFillEl = document.getElementById("guesses-meter-fill");
const historyEl = document.getElementById("guess-history");
const restartBtn = document.getElementById("restart-btn");
const rangeLowEl = document.getElementById("range-low");
const rangeHighEl = document.getElementById("range-high");
const rangeWindowEl = document.getElementById("range-window");
const gameEl = document.querySelector(".game");
const submitBtn = form.querySelector('button[type="submit"]');

const MIN = 1;
const MAX = 100;
const MAX_GUESSES = 10;

let secretNumber = 0;
let remainingGuesses = MAX_GUESSES;
let history = [];
let gameOver = false;
let lowBound = MIN;
let highBound = MAX;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setFeedback(message, tone = "neutral") {
  feedbackEl.textContent = message;
  feedbackEl.className = `feedback feedback-${tone}`;

  // Re-trigger animation each time message changes.
  feedbackEl.classList.remove("feedback-pop");
  void feedbackEl.offsetWidth;
  feedbackEl.classList.add("feedback-pop");
}

function updateRangeUI() {
  rangeLowEl.textContent = lowBound;
  rangeHighEl.textContent = highBound;

  const leftPct = ((lowBound - MIN) / (MAX - MIN)) * 100;
  const widthPct = ((highBound - lowBound + 1) / (MAX - MIN + 1)) * 100;
  rangeWindowEl.style.left = `${leftPct}%`;
  rangeWindowEl.style.width = `${Math.max(widthPct, 2)}%`;
}

function updateGuessesUI() {
  remainingEl.textContent = remainingGuesses;
  const fillPct = (remainingGuesses / MAX_GUESSES) * 100;
  meterFillEl.style.width = `${fillPct}%`;
}

function renderHistory() {
  historyEl.innerHTML = "";

  history.forEach((entry) => {
    const li = document.createElement("li");
    li.className = `guess-chip guess-${entry.result}`;
    li.textContent = entry.value;
    historyEl.appendChild(li);
  });
}

function clearInputError() {
  inputErrorEl.textContent = "";
  input.classList.remove("input-invalid", "input-shake");
}

function setInputError(message) {
  inputErrorEl.textContent = message;
  input.classList.add("input-invalid");
  input.classList.remove("input-shake");
  void input.offsetWidth;
  input.classList.add("input-shake");
}

function setGameEnabled(enabled) {
  input.disabled = !enabled;
  submitBtn.disabled = !enabled;
  gameEl.classList.toggle("game-over", !enabled);
}

function endGame(message, tone) {
  gameOver = true;
  setFeedback(message, tone);
  setGameEnabled(false);
  restartBtn.textContent = "Play Again";
}

function resetGame() {
  secretNumber = randomInt(MIN, MAX);
  remainingGuesses = MAX_GUESSES;
  history = [];
  gameOver = false;
  lowBound = MIN;
  highBound = MAX;

  clearInputError();
  setFeedback("Make your first guess.", "neutral");
  renderHistory();
  updateGuessesUI();
  updateRangeUI();
  setGameEnabled(true);

  restartBtn.textContent = "Restart";
  input.value = "";
  input.focus();

  // Dev-only: remove after testing.
  console.log("Secret number:", secretNumber);
}

function validateGuess(rawValue) {
  const raw = rawValue.trim();
  const guess = Number(raw);

  if (!raw) return "Enter a number from 1 to 100.";
  if (!Number.isFinite(guess)) return "That is not a valid number.";
  if (!Number.isInteger(guess)) return "Enter a whole number (no decimals).";
  if (guess < MIN || guess > MAX) return "Your guess must be between 1 and 100.";
  if (history.some((entry) => entry.value === guess)) {
    return `You already guessed ${guess}. Try a new number.`;
  }
  if (guess < lowBound || guess > highBound) {
    return `Stay within the current range: ${lowBound} to ${highBound}.`;
  }

  return guess;
}

function handleSubmit(event) {
  event.preventDefault();
  if (gameOver) return;

  const validated = validateGuess(input.value);
  if (typeof validated === "string") {
    setInputError(validated);
    input.focus();
    return;
  }

  clearInputError();
  const guess = validated;

  let result = "correct";
  if (guess < secretNumber) result = "low";
  if (guess > secretNumber) result = "high";

  history.push({ value: guess, result });
  renderHistory();

  remainingGuesses -= 1;
  updateGuessesUI();

  if (result === "correct") {
    endGame(`Correct! ${guess} is the number.`, "win");
    return;
  }

  if (result === "low") {
    lowBound = Math.max(lowBound, guess + 1);
    updateRangeUI();
    setFeedback(`${guess} is too low. Try higher.`, "low");
  } else {
    highBound = Math.min(highBound, guess - 1);
    updateRangeUI();
    setFeedback(`${guess} is too high. Try lower.`, "high");
  }

  if (remainingGuesses === 0) {
    endGame(`No guesses left. The number was ${secretNumber}.`, "lose");
    return;
  }

  input.value = "";
  input.focus();
}

form.addEventListener("submit", handleSubmit);
restartBtn.addEventListener("click", resetGame);

resetGame();
