import { useMemo, useState } from "react";

const operators = ["+", "-", "*", "/"];

function evalTokens(toks) {
  const stack = [];

  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];

    if (t === "*" || t === "/") {
      const left = Number(stack.pop());
      const right = Number(toks[i + 1]);
      i += 1;
      stack.push(t === "*" ? left * right : left / right);
    } else {
      stack.push(t);
    }
  }

  let result = Number(stack[0]);
  for (let i = 1; i < stack.length; i += 2) {
    const op = stack[i];
    const num = Number(stack[i + 1]);
    result = op === "+" ? result + num : result - num;
  }

  return String(result);
}

function getExpressionString(tokens, current) {
  const parts = [...tokens, current !== "0" ? current : ""].filter(Boolean);
  let expr = "";

  for (const part of parts) {
    if (operators.includes(part)) {
      const symbol = part === "*" ? "x" : part === "/" ? "÷" : part;
      expr += "\u2009" + symbol + "\u2009";
    } else {
      expr += part;
    }
  }

  return expr === "" ? "0" : expr;
}

function App() {
  const [current, setCurrent] = useState("0");
  const [tokens, setTokens] = useState([]);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [lastResult, setLastResult] = useState("");

  const displayValue = useMemo(
    () => getExpressionString(tokens, current),
    [tokens, current],
  );

  const handlePreviousClick = () => {
    if (!lastResult) return;
    setCurrent(lastResult);
    setTokens([]);
    setJustEvaluated(false);
  };

  const handleEquals = () => {
    if (tokens.length === 0) return;

    const nextTokens = [...tokens, current];
    const result = evalTokens(nextTokens);
    setCurrent(result);
    setTokens([]);
    setJustEvaluated(true);
    setLastResult(result);
  };

  const handleOperator = (op) => {
    if (justEvaluated) {
      setJustEvaluated(false);
    }
    setTokens((prev) => [...prev, current, op]);
    setCurrent("0");
  };

  const handleButtonClick = (value, id) => {
    if (id === "clear") {
      setCurrent("0");
      setTokens([]);
      setJustEvaluated(false);
      setLastResult("");
      return;
    }

    if (id === "backspace") {
      setCurrent((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
      setJustEvaluated(false);
      return;
    }

    if (!value) return;

    if (value === "=") {
      handleEquals();
      return;
    }

    if (operators.includes(value)) {
      handleOperator(value);
      return;
    }

    if (value === ".") {
      if (justEvaluated) {
        setCurrent("0.");
        setTokens([]);
        setJustEvaluated(false);
        return;
      }
      setCurrent((prev) => (prev.includes(".") ? prev : `${prev}.`));
      return;
    }

    if (value === "+/-") {
      setJustEvaluated(false);
      setCurrent((prev) => (prev.startsWith("-") ? prev.slice(1) : `-${prev}`));
      return;
    }

    if (value === "%") {
      setJustEvaluated(false);
      setCurrent((prev) => String(Number(prev) / 100));
      return;
    }

    if (justEvaluated) {
      setCurrent(value);
      setTokens([]);
      setJustEvaluated(false);
      return;
    }

    setCurrent((prev) => (prev === "0" ? value : prev + value));
  };

  const rows = [
    [
      { id: "backspace", label: "⌫", tone: "utility" },
      { id: "clear", label: "C", tone: "utility" },
      { value: "%", label: "%", tone: "utility" },
      { value: "/", label: "÷", tone: "operator" },
    ],
    [
      { value: "1", label: "1", tone: "number" },
      { value: "2", label: "2", tone: "number" },
      { value: "3", label: "3", tone: "number" },
      { value: "*", label: "X", tone: "operator" },
    ],
    [
      { value: "4", label: "4", tone: "number" },
      { value: "5", label: "5", tone: "number" },
      { value: "6", label: "6", tone: "number" },
      { value: "-", label: "-", tone: "operator" },
    ],
    [
      { value: "7", label: "7", tone: "number" },
      { value: "8", label: "8", tone: "number" },
      { value: "9", label: "9", tone: "number" },
      { value: "+", label: "+", tone: "operator" },
    ],
    [
      { value: "+/-", label: "+/-", tone: "utility" },
      { value: "0", label: "0", tone: "number" },
      { value: ".", label: ".", tone: "number" },
      { id: "equals", value: "=", label: "=", tone: "operator" },
    ],
  ];

  const buttonBase =
    "h-16 rounded-full border-0 text-[1.6rem] flex items-center justify-center shadow-[inset_0_-2px_0_rgba(0,0,0,0.25)] transition duration-100 ease-out active:scale-[0.98] active:brightness-110";

  const buttonTone = {
    number: "bg-[#333] text-[whitesmoke]",
    utility: "bg-[#a5a5a5] text-[#333]",
    operator: "bg-[#f1a33c] text-[whitesmoke]",
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#333] text-[whitesmoke]">
      <div className="w-80 rounded-[32px] bg-[radial-gradient(circle_at_top,#1c1c1c,#111_70%)] px-4 pb-5 pt-[18px] shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
        <div
          className="ml-auto min-h-[22px] w-fit cursor-pointer px-[10px] pt-1 text-right text-[0.95rem] tracking-[0.02em] text-[#9b9b9b]"
          onClick={handlePreviousClick}
        >
          {lastResult}
        </div>
        <input
          type="text"
          className="w-full bg-transparent px-[10px] pb-3 pt-[6px] text-right text-[3.5rem] font-light outline-none"
          value={displayValue}
          readOnly
        />
        <div className="grid grid-cols-4 gap-3 px-1 pt-[6px]">
          {rows.flat().map((btn) => (
            <button
              key={`${btn.id || btn.value}-${btn.label}`}
              className={`${buttonBase} ${buttonTone[btn.tone]}`}
              id={btn.id}
              data-value={btn.value}
              onClick={() => handleButtonClick(btn.value, btn.id)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;
