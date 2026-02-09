let current = "0";
let tokens = [];
let justEvaluated = false;
let lastResult = "";

const display = document.querySelector("#display");
const previousEl = document.querySelector("#previous");
const buttons = document.querySelector(".buttons");

function getExpressionString() {
  const parts = [...tokens, current !== "0" ? current : ""].filter(Boolean);
  let expr = "";
  for (const part of parts) {
    if (["+", "-", "*", "/"].includes(part)) {
      const symbol = part === "*" ? "x" : part === "/" ? "÷" : part;
      expr += "\u2009" + symbol + "\u2009";
    } else {
      expr += part;
    }
  }
  return expr === "" ? "0" : expr;
}

function updateDisplay() {
  display.value = getExpressionString();
}

function updateExpression() {
  previousEl.textContent = lastResult;
}

previousEl.addEventListener("click", () => {
  if (!lastResult) return;
  current = lastResult;
  tokens = [];
  justEvaluated = false;
  updateDisplay();
  updateExpression();
});

updateDisplay();
updateExpression();

/* ---------- PEMDAS EVALUATION ---------- */
function evalTokens(toks) {
  let stack = [];

  // pass 1: * and /
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];

    if (t === "*" || t === "/") {
      const left = Number(stack.pop());
      const right = Number(toks[++i]);
      stack.push(t === "*" ? left * right : left / right);
    } else {
      stack.push(t);
    }
  }

  // pass 2: + and -
  let result = Number(stack[0]);
  for (let i = 1; i < stack.length; i += 2) {
    const op = stack[i];
    const num = Number(stack[i + 1]);
    result = op === "+" ? result + num : result - num;
  }

  return String(result);
}

function handleEquals() {
  if (tokens.length === 0) return;

  tokens.push(current);
  current = evalTokens(tokens);
  tokens = [];
  justEvaluated = true;
  lastResult = current;

  updateDisplay();
  updateExpression();
}

function handleOperator(op) {
  if (justEvaluated) {
    justEvaluated = false;
  }
  tokens.push(current);
  tokens.push(op);
  current = "0";

  updateDisplay();
  updateExpression();
}

/* ---------- CLICK HANDLER ---------- */
buttons.addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;

  // CLEAR
  if (btn.id === "clear") {
    current = "0";
    tokens = [];
    justEvaluated = false;
    lastResult = "";
    updateDisplay();
    updateExpression();
    return;
  }

  // BACKSPACE
  if (btn.id === "backspace") {
    current = current.length <= 1 ? "0" : current.slice(0, -1);
    justEvaluated = false;
    updateDisplay();
    updateExpression();
    return;
  }

  const value = btn.dataset.value;
  if (!value) return;

  // EQUALS
  if (value === "=") {
    handleEquals();
    return;
  }

  // OPERATORS
  if (["+", "-", "*", "/"].includes(value)) {
    handleOperator(value);
    return;
  }

  // DECIMAL
  if (value === ".") {
    if (justEvaluated) {
      current = "0";
      tokens = [];
      justEvaluated = false;
    }
    if (!current.includes(".")) {
      current += ".";
      updateDisplay();
      updateExpression();
    }
    return;
  }

  // SIGN
  if (value === "+/-") {
    justEvaluated = false;
    current = current.startsWith("-") ? current.slice(1) : "-" + current;
    updateDisplay();
    updateExpression();
    return;
  }

  // PERCENT
  if (value === "%") {
    justEvaluated = false;
    current = String(Number(current) / 100);
    updateDisplay();
    updateExpression();
    return;
  }

  // NUMBERS
  if (justEvaluated) {
    current = value;
    tokens = [];
    justEvaluated = false;
  } else {
    current = current === "0" ? value : current + value;
  }
  updateDisplay();
  updateExpression();
});