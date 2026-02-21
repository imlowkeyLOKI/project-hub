const form = document.getElementById("guess-form");
const input = document.getElementById("guess-input");
const inputErrorEl = document.getElementById("input-error");
const feedbackEl = document.getElementById("feedback");
const remainingEl = document.getElementById("remaining-guesses");
const meterFillEl = document.getElementById("guesses-meter-fill");
const historyEl = document.getElementById("guess-history");
const achievementCountEl = document.getElementById("achievement-count");
const achievementListEl = document.getElementById("achievement-list");
const achievementsPanelEl = document.getElementById("achievements-panel");
const restartBtn = document.getElementById("restart-btn");
const gameOverMessageEl = document.getElementById("game-over-message");
const heroEl = document.querySelector(".hero");
const statusPanelEl = document.getElementById("status-panel");
const guessesPanelEl = document.getElementById("guesses-panel");
const historyPanelEl = document.getElementById("history-panel");
const rangeLowEl = document.getElementById("range-low");
const rangeHighEl = document.getElementById("range-high");
const rangeBoundsEl = document.getElementById("range-bounds");
const rangeWindowEl = document.getElementById("range-window");
const rangePanelEl = document.getElementById("range-panel");
const rangeProgressBarEl = document.querySelector(".range-progress-bar");
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
const RARITY_ODDS = {
  uncommon: 62,
  rare: 25,
  ultrarare: 10,
  legendary: 3
};
const WIN_LINES = {
  uncommon: [
    "You found it. Try not to act shocked.",
    "Look at you, making one good decision in {tries} tries.",
    "You guessed right and suddenly you're a genius.",
    "That was sharp. You actually planned that.",
    "Congrats. Even your luck looked skilled."
  ],
  rare: [
    "You hunted like rent was due.",
    "That guess had villain energy.",
    "You really woke up and chose accuracy."
  ],
  ultrarare: [
    "You didn’t win. You bullied the number.",
    "That wasn’t a guess. That was a threat."
  ],
  legendary: [
    "LEGENDARY: The sharks asked for your autograph."
  ]
};
const LOSE_LINES = {
  uncommon: [
    "You had one job and still drowned it.",
    "The number survived. Your ego didn’t.",
    "That run was a full-body miss.",
    "You guessed like the keyboard owed you money.",
    "No bite. Just vibes."
  ],
  rare: [
    "You got cooked by a number between 1 and 100.",
    "You read the clues and still picked chaos.",
    "That was confidence with zero receipts."
  ],
  ultrarare: [
    "Historic fumble. The sharks are forwarding the replay.",
    "That collapse needs its own documentary."
  ],
  legendary: [
    "LEGENDARY FAIL: The ocean itself is roasting you."
  ]
};
const messageQueues = {
  win: {},
  lose: {}
};
const unlockedAchievements = new Map();
let achievementsVisible = false;
let revealAchievementsOnNextReplay = false;
const TOTAL_ACHIEVEMENTS =
  Object.values(WIN_LINES).flat().length +
  Object.values(LOSE_LINES).flat().length;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hideStageElement(element) {
  element.hidden = true;
  element.classList.remove("drop-in");
}

function revealStageElement(element) {
  if (!element.hidden) return;
  element.hidden = false;
  element.classList.remove("drop-in");
  void element.offsetWidth;
  element.classList.add("drop-in");
}

function runStageOne() {
  if (formRevealTimeoutId) clearTimeout(formRevealTimeoutId);

  hideStageElement(form);
  hideStageElement(statusPanelEl);
  hideStageElement(guessesPanelEl);
  hideStageElement(historyPanelEl);
  hideStageElement(restartBtn);
  rangePanelEl.hidden = true;

  revealStageElement(form);
  revealStageElement(statusPanelEl);
  revealStageElement(guessesPanelEl);
  if (achievementsVisible) {
    revealStageElement(historyPanelEl);
  }
  input.focus();
}

function runStageTwo() {
  revealStageElement(historyPanelEl);
  revealStageElement(rangePanelEl);
}

function shuffled(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function rollRarity(messagesByRarity) {
  const availableRarities = Object.keys(messagesByRarity).filter(
    (rarity) => messagesByRarity[rarity]?.length
  );
  let total = 0;
  for (const rarity of availableRarities) {
    total += RARITY_ODDS[rarity] || 0;
  }
  if (total <= 0) return availableRarities[0];

  let roll = Math.random() * total;
  for (const rarity of availableRarities) {
    roll -= RARITY_ODDS[rarity] || 0;
    if (roll <= 0) return rarity;
  }
  return availableRarities[availableRarities.length - 1];
}

function nextRarityMessage(poolKey, messagesByRarity) {
  const rarity = rollRarity(messagesByRarity);
  if (!messageQueues[poolKey][rarity] || messageQueues[poolKey][rarity].length === 0) {
    messageQueues[poolKey][rarity] = shuffled(messagesByRarity[rarity]);
  }
  const template = messageQueues[poolKey][rarity].pop();
  return { poolKey, rarity, template };
}

function updateAchievementCount() {
  achievementCountEl.textContent = `${unlockedAchievements.size}/${TOTAL_ACHIEVEMENTS}`;
}

function unlockAchievement(messageMeta, renderedText) {
  const wasEmpty = unlockedAchievements.size === 0;
  const key = `${messageMeta.poolKey}:${messageMeta.rarity}:${messageMeta.template}`;
  if (unlockedAchievements.has(key)) return;

  const text = messageMeta.template.includes("{tries}")
    ? messageMeta.template.replace("{tries}", "X")
    : renderedText;
  unlockedAchievements.set(key, {
    rarity: messageMeta.rarity,
    text
  });

  const emptyEl = achievementListEl.querySelector(".achievement-empty");
  if (emptyEl) emptyEl.remove();

  const item = document.createElement("li");
  item.className = "achievement-item";
  const rarity = document.createElement("span");
  rarity.className = `achievement-rarity achievement-${messageMeta.rarity}`;
  rarity.textContent = messageMeta.rarity;
  const message = document.createElement("span");
  message.className = "achievement-text";
  message.textContent = text;
  item.append(rarity, message);
  achievementListEl.prepend(item);
  updateAchievementCount();

  if (wasEmpty && !achievementsVisible) {
    revealAchievementsOnNextReplay = true;
  }
}

const STAR_COUNTS = {
  uncommon: 1,
  rare: 2,
  ultrarare: 3,
  legendary: 3
};

const RARITY_LABELS = {
  uncommon: "Uncommon",
  rare: "Rare",
  ultrarare: "Ultra Rare",
  legendary: "Legendary"
};

function buildStars(rarity, count) {
  const cls = rarity === "legendary" ? "rarity-legendary" : `rarity-${rarity}`;
  let stars = "";
  for (let i = 0; i < count; i++) {
    stars += `<span class="rarity-star ${cls}">&#9733;</span>`;
  }
  return stars;
}

function setGameOverMessage(isWin) {
  let messageMeta;
  let rendered;

  if (isWin) {
    const triesUsed = history.length;
    messageMeta = nextRarityMessage("win", WIN_LINES);
    rendered = messageMeta.template.replace("{tries}", String(triesUsed));
    gameOverMessageEl.className = "game-over-message game-over-positive";
  } else {
    messageMeta = nextRarityMessage("lose", LOSE_LINES);
    rendered = messageMeta.template;
    gameOverMessageEl.className = "game-over-message game-over-negative";
  }

  const rarity = messageMeta.rarity;
  const count = STAR_COUNTS[rarity] || 1;
  const stars = buildStars(rarity, count);
  const label = RARITY_LABELS[rarity] || rarity;

  gameOverMessageEl.classList.add(`rarity-tier-${rarity}`);
  gameOverMessageEl.innerHTML =
    `<span class="rarity-tag rarity-tag-${rarity}">${label}</span>` +
    `<div class="rarity-row">` +
      `<span class="rarity-stars-row">${stars}</span>` +
      `<span class="rarity-text">${rendered}</span>` +
      `<span class="rarity-stars-row">${stars}</span>` +
    `</div>`;
  unlockAchievement(messageMeta, rendered);
}

function setEndGameView(enabled) {
  if (enabled) {
    if (formRevealTimeoutId) clearTimeout(formRevealTimeoutId);
    heroEl.hidden = true;
    form.hidden = true;
    statusPanelEl.hidden = true;
    historyPanelEl.hidden = true;
    revealStageElement(gameOverMessageEl);
    revealStageElement(restartBtn);
    return;
  }

  heroEl.hidden = false;
  gameOverMessageEl.hidden = true;
  gameOverMessageEl.className = "game-over-message";
}

function setFeedback(message, tone = "neutral") {
  feedbackEl.textContent = message;
  feedbackEl.className = `feedback feedback-${tone}`;

  feedbackEl.classList.remove("feedback-pop");
  feedbackEl.classList.remove("feedback-flash");
  void feedbackEl.offsetWidth;
  feedbackEl.classList.add("feedback-pop");
  feedbackEl.classList.add("feedback-flash");
}

function updateRangeUI() {
  rangeLowEl.textContent = lowBound;
  rangeHighEl.textContent = highBound;
  input.placeholder = `Depth ${lowBound}-${highBound}`;

  const leftPct = ((lowBound - MIN) / (MAX - MIN)) * 100;
  const widthPct = ((highBound - lowBound + 1) / (MAX - MIN + 1)) * 100;
  const activeWidthPct = Math.max(widthPct, 2);

  const barWidth = rangeProgressBarEl?.clientWidth || 1;
  const activeWidthPx = (barWidth * activeWidthPct) / 100;
  const actorScale = Math.max(0.4, Math.min(1, activeWidthPx / 170));
  const baseChompMs = Math.max(240, Math.min(860, 240 + (widthPct / 100) * 620));
  const sharkSizePx = Math.max(28, Math.min(60, activeWidthPx * 0.4));
  const humanSizePx = Math.max(20, Math.min(38, activeWidthPx * 0.28));
  const visualSharkPx = sharkSizePx * actorScale;
  const visualHumanPx = humanSizePx * actorScale;
  const minActorSpacingPx = 12;
  const overlapThresholdPx = visualSharkPx * 2 + visualHumanPx + minActorSpacingPx;
  const actorsTight = activeWidthPx < overlapThresholdPx;
  const chompMs = actorsTight ? Math.max(130, baseChompMs * 0.58) : baseChompMs;
  const struggleMs = actorsTight ? 620 : 1100;
  const sharkOffsetPx = actorsTight
    ? -Math.min(24, (overlapThresholdPx - activeWidthPx) / 2 + 6)
    : 5;
  const labelsTight = activeWidthPx < 72;

  rangeWindowEl.style.left = `${leftPct}%`;
  rangeWindowEl.style.width = `${activeWidthPct}%`;
  rangeWindowEl.classList.toggle("range-actors-tight", actorsTight);
  rangeBoundsEl.classList.toggle("range-bounds-tight", labelsTight);
  rangeBoundsEl.style.left = `${leftPct}%`;
  rangeBoundsEl.style.width = `${activeWidthPct}%`;
  rangeWindowEl.style.setProperty("--range-actor-scale", actorScale.toFixed(3));
  rangeWindowEl.style.setProperty("--chomp-speed", `${chompMs.toFixed(0)}ms`);
  rangeWindowEl.style.setProperty("--struggle-speed", `${struggleMs}ms`);
  rangeWindowEl.style.setProperty("--shark-size", `${sharkSizePx.toFixed(1)}px`);
  rangeWindowEl.style.setProperty("--human-size", `${humanSizePx.toFixed(1)}px`);
  rangeWindowEl.style.setProperty("--shark-offset", `${sharkOffsetPx.toFixed(1)}px`);
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
}

function endGame(message, tone) {
  gameOver = true;
  setFeedback(message, tone);
  setGameEnabled(false);
  setGameOverMessage(tone === "win");
  setEndGameView(true);
  restartBtn.textContent = "Play Again";
}

function resetGame() {
  const wasGameOver = gameOver;

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
  setEndGameView(false);
  runStageOne();

  restartBtn.textContent = "Restart";
  input.value = "";

  if (!achievementsVisible && revealAchievementsOnNextReplay && wasGameOver) {
    achievementsVisible = true;
    revealAchievementsOnNextReplay = false;
  }
  achievementsPanelEl.hidden = !achievementsVisible;
}

function validateGuess(rawValue) {
  const raw = rawValue.trim();
  const guess = Number(raw);

  if (!raw) return "Enter a number from 1 to 100.";
  if (!Number.isFinite(guess)) return "Enter a valid number.";
  if (!Number.isInteger(guess)) return "Use a whole number.";
  if (guess < MIN || guess > MAX) return "Pick a number between 1 and 100.";
  if (history.some((entry) => entry.value === guess)) {
    return `You already guessed ${guess}. Try a different number.`;
  }
  if (guess < lowBound || guess > highBound) {
    return `Stay in range: ${lowBound} to ${highBound}.`;
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
  if (history.length === 1) {
    runStageTwo();
  }
  if (history.length === 2) {
    revealStageElement(restartBtn);
  }

  remainingGuesses -= 1;
  updateGuessesUI();

  if (result === "correct") {
    endGame(`Nice. ${guess} is correct.`, "win");
    return;
  }

  if (result === "low") {
    lowBound = Math.max(lowBound, guess + 1);
    updateRangeUI();
    setFeedback(`${guess} is too low.`, "low");
  } else {
    highBound = Math.min(highBound, guess - 1);
    updateRangeUI();
    setFeedback(`${guess} is too high.`, "high");
  }

  if (remainingGuesses === 0) {
    endGame(`Out of guesses. The number was ${secretNumber}.`, "lose");
    return;
  }

  input.value = "";
  input.focus();
}

form.addEventListener("submit", handleSubmit);
restartBtn.addEventListener("click", resetGame);
input.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  if (form.hidden || submitBtn.disabled) return;
  form.requestSubmit(submitBtn);
});

resetGame();
updateAchievementCount();
