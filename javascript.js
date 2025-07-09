const API_KEY = "dd26aacbf32f4ed34394a62d3a085287";

function getWeather(cityName) {
  const city = cityName || document.getElementById("city-input").value.trim();
  const resultDiv = document.getElementById("weather-result");
  const loader = document.getElementById("loader");

  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  loader.classList.remove("hidden");
  resultDiv.classList.add("hidden");

  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  fetch(URL)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      const { name, sys, main, weather } = data;

      document.getElementById("city-name").textContent = `${name}, ${sys.country}`;
      document.getElementById("temperature").textContent = `🌡️ ${main.temp}°C`;
      document.getElementById("description").textContent = `📋 ${weather[0].description}`;
      document.getElementById("icon").src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
      document.getElementById("flag").src = `https://flagsapi.com/${sys.country}/flat/64.png`;

      addToHistory(name);
      displayHistory();

      resultDiv.classList.remove("hidden");
    })
    .catch(error => {
      alert(error.message);
      resultDiv.classList.add("hidden");
    })
    .finally(() => {
      loader.classList.add("hidden");
    });
}

// Save to localStorage
function addToHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  if (!history.includes(city)) {
    history.unshift(city);
    if (history.length > 5) history.pop();
    localStorage.setItem("weatherHistory", JSON.stringify(history));
  }
}

function displayHistory() {
  const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  const list = document.getElementById("history-list");
  list.innerHTML = "";
  history.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.onclick = () => getWeather(city);
    list.appendChild(li);
  });
}

window.onload = displayHistory;
