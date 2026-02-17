// need to add drop down for cities to ensure accuracy

const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const weatherResult = document.getElementById("form-message");

weatherForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (city === "") {
    weatherResult.textContent = "Please enter a city name.";
    return;
  }

  weatherResult.textContent = "";

  const apiKey = "b06f1561520a4609ba024535261202";
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=4`;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const dCurrent = data.current;
      const dLocation = data.location;
      const dForecast = data.forecast.forecastday;

      const cityNameEl = document.getElementById("city-name");
      const timeEl = document.getElementById("weather-time");
      const tempEl = document.getElementById("temp-value");
      const highEl = document.getElementById("temp-high");
      const lowEl = document.getElementById("temp-low");
      const feelsLikeEl = document.getElementById("feels-like");
      const humidityEl = document.getElementById("humidity");
      const windEl = document.getElementById("wind-speed");
      const pressureEl = document.getElementById("pressure");
      const forecastHighEls = [
        document.getElementById("forecast-high-1"),
        document.getElementById("forecast-high-2"),
        document.getElementById("forecast-high-3")
      ];
      const forecastLowEls = [
        document.getElementById("forecast-low-1"),
        document.getElementById("forecast-low-2"),
        document.getElementById("forecast-low-3")
      ];

      cityNameEl.textContent = dLocation.name;
      timeEl.textContent = dLocation.localtime.split(" ")[1];
      tempEl.textContent = dCurrent.temp_f;
      highEl.textContent = dForecast[0].day.maxtemp_f;
      lowEl.textContent = dForecast[0].day.mintemp_f;
      feelsLikeEl.textContent = dCurrent.feelslike_f;
      humidityEl.textContent = dCurrent.humidity;
      windEl.textContent = dCurrent.wind_mph;
      pressureEl.textContent = dCurrent.pressure_mb;

      for (let i = 0; i < 3; i++) {
        forecastHighEls[i].textContent = dForecast[i + 1].day.maxtemp_f;
        forecastLowEls[i].textContent = dForecast[i + 1].day.mintemp_f;
      }
    });
});


// add suggestions for cities
// change label for 3 days forecast, dates, next 3 weekday names etc.
// make it look pretty
// add weather icon that changes based on the weather condition