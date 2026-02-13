let current = "0";
let tokens = [];
let justCalculated = false;
let lastResult = "";
let showAsPercent = false;

const display = document.querySelector("#display");
const prev = document.querySelector("#previous");
const buttons = document.querySelector(".buttons");

function isOp(val) {
  return ["+", "-", "*", "/"].includes(val);
}

function cleanNum(val) {
  return val.includes(".") ? val.replace(/\.?0+$/, "") : val;
}

function getDisplayText() {
  let displayVal = current;

  // handle percent display
  if (showAsPercent && Number.isFinite(Number(current))) {
    displayVal = cleanNum(String(Number(current) * 100)) + "%";
  }

  const parts = [...tokens];
  if (current !== "0" || tokens.length === 0) parts.push(displayVal);

  if (parts.length === 0) return "0";

  // format with proper symbols
  return parts.map(p => {
    if (isOp(p)) {
      const sym = p === "*" ? "x" : p === "/" ? "÷" : p;
      return `\u2009${sym}\u2009`;
    }
    return p;
  }).join("");
}

function update() {
  display.value = getDisplayText();
  prev.textContent = lastResult;
}

function calculate(expr) {
  const stack = [];

  // handle multiplication/division first
  for (let i = 0; i < expr.length; i++) {
    const tok = expr[i];
    if (tok === "*" || tok === "/") {
      const left = Number(stack.pop());
      const right = Number(expr[++i]);
      stack.push(tok === "*" ? left * right : left / right);
    } else {
      stack.push(tok);
    }
  }

  // then addition/subtraction
  let result = Number(stack[0]);
  for (let i = 1; i < stack.length; i += 2) {
    const op = stack[i];
    const val = Number(stack[i + 1]);
    result = op === "+" ? result + val : result - val;
  }

  return String(result);
}

function clear() {
  current = "0";
  tokens = [];
  justCalculated = false;
  lastResult = "";
  update();
}

function backspace() {
  current = current.length <= 1 ? "0" : current.slice(0, -1);
  if (current === "-" || current === "") current = "0";
  justCalculated = false;
  update();
}

function equals() {
  if (tokens.length === 0) return;

  current = calculate([...tokens, current]);
  tokens = [];
  justCalculated = true;
  lastResult = current;
  update();
}

function addOperator(op) {
  // replace last operator if we just typed one
  if (tokens.length > 0 && isOp(tokens[tokens.length - 1]) && current === "0") {
    tokens[tokens.length - 1] = op;
    update();
    return;
  }

  tokens.push(current, op);
  current = "0";
  justCalculated = false;
  update();
}

function decimal() {
  if (justCalculated) {
    current = "0";
    tokens = [];
    justCalculated = false;
  }
  if (!current.includes(".")) current += ".";
  update();
}

function toggleSign() {
  justCalculated = false;
  current = current.startsWith("-") ? current.slice(1) : `-${current}`;
  update();
}

function togglePercent() {
  if (Number.isFinite(Number(current))) {
    showAsPercent = !showAsPercent;
  }
  justCalculated = false;
  update();
}

function addNumber(val) {
  if (justCalculated) {
    current = val;
    tokens = [];
    justCalculated = false;
  } else {
    current = current === "0" ? val : current + val;
  }
  update();
}

prev.addEventListener("click", () => {
  if (!lastResult) return;
  current = lastResult;
  tokens = [];
  justCalculated = false;
  update();
});

buttons.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.id === "clear") return clear();
  if (btn.id === "backspace") return backspace();

  const val = btn.dataset.value;
  if (!val) return;

  if (val === "=") return equals();
  if (isOp(val)) return addOperator(val);
  if (val === ".") return decimal();
  if (val === "+/-") return toggleSign();
  if (val === "%") return togglePercent();

  addNumber(val);
});

update();
