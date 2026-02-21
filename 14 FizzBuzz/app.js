const button = document.getElementById("run-btn");
const input = document.getElementById("number-input");
const output = document.getElementById("output");
const message = document.getElementById("output-message");

button.addEventListener("click", function() {
  const inputValue = parseInt(input.value);
  output.innerHTML = "";
  message.textContent = "";

  if (Number(input.value) !== inputValue) {
    message.textContent = "Please enter a whole number";
    return;
  }

  if (inputValue < 1) {
    message.textContent = "Please enter a number of at least 1";
    return;
  }

  const fragment = document.createDocumentFragment();
  for (let i = 1; i <= inputValue; i++) {
    let result = "";
    if (i % 3 === 0) result += "Fizz";
    if (i % 5 === 0) result += "Buzz";

    const span = document.createElement("span");
    if (result === "FizzBuzz") {
      span.className = "fizzbuzz";
    } else if (result === "Fizz") {
      span.className = "fizz";
    } else if (result === "Buzz") {
      span.className = "buzz";
    } else {
      span.className = "num";
      result = String(i);
    }
    span.textContent = result;
    fragment.appendChild(span);
    fragment.appendChild(document.createTextNode("\n"));
  }
  output.appendChild(fragment);
});
