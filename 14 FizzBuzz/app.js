const button = document.getElementById("run-btn");
const input = document.getElementById("number-input");
const output = document.getElementById("output");
const message = document.getElementById("output-message");

button.addEventListener("click", function(event) {
  event.preventDefault();
  const rawValue = Number(input.value);
  const inputValue = parseInt(input.value);
  output.innerHTML = "";
  message.innerHTML = "";

  if (rawValue !== inputValue) {
    message.innerHTML = "Please enter a whole number";
    return;
  }

  if (inputValue < 1) {
    message.innerHTML = "Please enter a number greater than 1";
    return;
  }

  for (let i = 1; i <= inputValue; i++) {
    let result = "";
    if (i % 3 === 0) result += "Fizz";
    if (i % 5 === 0) result += "Buzz";
    output.innerHTML += result || i;
    output.innerHTML += "<br>";
  }
});
