const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const btn = document.getElementById("submit");
btn.addEventListener("click", getCity);

function getCity() {
  const city = document.getElementsByClassName("city")[0].value;
  getInfo(city);
}

async function getWeatherTime(city) {
  const weather = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a2b31b5194909447fca322253a92a955`
  ).then((res) => res.json());
  return weather;
}

async function getWeather30Days(data) {
  const weather = await fetch(
    ` https://api.openweathermap.org/data/2.5/onecall?lat=${data.lat}&lon=${data.lon}&exclude=minutely,alerts&appid=20f7632ffc2c022654e4093c6947b4f4`
  ).then((res) => res.json());
  return weather;
}

// https://api.openweathermap.org/data/2.5/onecall?lat=${e.lat}&lon=${e.lon}&exclude=minutely,alerts&units=${t}&appid=20f7632ffc2c022654e4093c6947b4f4

async function getInfo(city) {
  const result = {};
  let weather = await getWeatherTime(city);
  result.city = capitalize(weather.name);
  result.description = capitalize(weather.weather[0].description);
  result.temp_c = parseInt(weather.main.temp - 273.15);
  result.feels_like_c = parseInt(weather.main.feels_like - 273.15);
  result.maxtemp_c = parseInt(weather.main.temp_max - 273.15);
  result.mintemp_c = parseInt(weather.main.temp_min - 273.15);
  result.temp_f = parseInt(((weather.main.temp - 273.15) * 9) / 5 + 32);
  result.feels_like_f = parseInt(
    ((weather.main.feels_like - 273.15) * 9) / 5 + 32
  );
  result.humidity = weather.main.humidity;
  result.windSpeed = weather.wind.speed * 3.6;
  result.icon = weather.weather[0].icon;
  result.date = new Date();
  let info = await getWeather30Days(weather.coord);
  info.daily.shift();
  setDom(result, info.daily);
}

function setDom(result, daily) {
  console.log(result);
  document.querySelector(".weather_actual-description").textContent =
    result.description;
  document.querySelector(".weather_actual-city").textContent = result.city;
  document.querySelector(".weather_actual-date").textContent = `${
    days[result.date.getDay()]
  }, ${result.date.getDate()} ${
    months[result.date.getMonth()]
  } ${result.date.getFullYear()}  `;
  document.querySelector(
    ".weather_actual-temp-minmax"
  ).textContent = `Min: ${result.mintemp_c} °C - Max: ${result.maxtemp_c} °C`;
  document.querySelector(
    ".weather_actual-temp"
  ).innerHTML = `<span>${result.temp_c} °C</span><img src='http://openweathermap.org/img/wn/10d@2x.png'></img> `;
  document.querySelector(
    ".weather_actual-feels-like"
  ).innerHTML = `<p class="title">Feels like</p><p class="text">${result.feels_like_c} °C</p>`;
  document.querySelector(
    ".weather_actual-humidity"
  ).innerHTML = `<p class="title">Humidity</p><p class="text">${result.humidity}%</p>`;
  document.querySelector(
    ".weather_actual-wind-speed"
  ).innerHTML = `<p class="title">Wind</p><p class="text">${result.windSpeed.toFixed(
    2
  )} km/h</p>`;
  let nextdays = document.querySelector(".weather_next");
  nextdays.textContent = '';
  daily.forEach((day) => {
    let miliseconds = day.dt + "000";
    let article = document.createElement("article");
    article.classList.add("weather_next-information");
    let pn = document.createElement("p");
    pn.classList.add("weather_next-day-name");
    let ptmax = document.createElement("p");
    ptmax.classList.add("weather_next-day-tempmax");
    let ptmin = document.createElement("p");
    ptmin.classList.add("weather_next-day-tempmin");
    pn.textContent = days[new Date(parseInt(miliseconds)).getDay()];
    ptmax.textContent = `${parseInt(day.temp.max - 273.15)} °C`;
    ptmin.textContent = `${parseInt(day.temp.min - 273.15)} °C`;
    article.appendChild(pn);
    article.appendChild(ptmax);
    article.appendChild(ptmin);
    nextdays.appendChild(article);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

window.addEventListener("load", getInfo("Buenos Aires"));
