// variables
const API_KEY = 'fc6b3a05a1ea67723f15ad5620126f9d';
const API_URL = `https://api.openweathermap.org/data/2.5/weather`;
const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast`;

const buttonElement = document.querySelector('#submit-btn');
const cityContainerElement = document.querySelector('#city-container');
const weatherContainerElement = document.querySelector('#weather-container');
const forecastContainerElement = document.querySelector('#forecast-container');
const searchInputElement = document.querySelector('#search-input');

const options = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

const options1 = {
  day: 'numeric',
  month: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

// functions
const getWeather = async (cityName) => {
  return fetch(`${API_URL}?q=${cityName}&appid=${API_KEY}&units=metric`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.cod === 200) {
        displayWeather(data);
        const { lat, lon } = data.coord;
        get5DayForecast(lat, lon);
      } else if (data.cod === 400) {
        console.log('An error has occurred. Try again.');
      } else {
        console.log('City has not been found.');
      }
    });
};

const searchWeather = () => {
  const cityName = document.querySelector('#search-input').value;
  clearLocation(cityContainerElement);
  clearLocation(weatherContainerElement);
  getWeather(cityName);
};

const getWindDirection = (degrees) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

const get5DayForecast = async (lat, lon) => {
  return fetch(`${FORECAST_API_URL}?lat=${lat}&lon=${lon}&cnt=40&appid=${API_KEY}&units=metric`)
    .then((response) => {
      return response.json();
    })
    .then((data) => display5DayForecast(data));
};

const clearLocation = (location) => {
  while (location.firstChild) {
    location.removeChild(location.firstChild);
  }
};

const displayWeather = (data) => {
  const { name, dt, timezone } = data;
  const { country } = data.sys;
  const { icon, description } = data.weather[0];
  const { temp, humidity, temp_min, temp_max } = data.main;
  const { speed, deg } = data.wind;

  const cityCountryElement = document.createElement('div');
  cityCountryElement.classList.add('city-container__title');

  const cityNameTitle = document.createElement('h1');
  cityNameTitle.innerText = name + ', ' + country;
  cityNameTitle.classList.add('city-title');

  const weatherIcon = document.createElement('img');
  weatherIcon.src = 'https://openweathermap.org/img/wn/' + icon + '.png';

  const weatherDescription = document.createElement('p');
  weatherDescription.innerText = description.charAt(0).toUpperCase() + description.slice(1);

  const weatherTemperature = document.createElement('h3');
  weatherTemperature.innerText = `Temperature: ${Math.round(temp)}\u00B0C`;
  const weatherTemperatureMinAndMax = document.createElement('p');
  weatherTemperatureMinAndMax.innerText = `L: ${Math.round(temp_min)}\u00B0C / H: ${Math.round(temp_max)}\u00B0C`;

  const weatherHumidity = document.createElement('p');
  weatherHumidity.innerText = 'Humidity: ' + humidity + '%';

  const weatherWind = document.createElement('p');
  weatherWind.innerText = 'Wind: ' + Math.round(speed) + ' m/s ' + getWindDirection(deg);

  const countryFlag = document.createElement('img');
  countryFlag.src = `https://flagsapi.com/${country}/shiny/32.png`;

  const localTime = new Date((dt + timezone - 7200) * 1000);
  const localTimeElement = document.createElement('p');
  localTimeElement.innerText = `${localTime.toLocaleString('en-GB', options)}`;

  cityCountryElement.append(cityNameTitle, countryFlag);
  cityContainerElement.append(cityCountryElement, localTimeElement);

  const currentWeatherConditions = document.createElement('div');
  const currentWeatherDescription = document.createElement('div');
  currentWeatherDescription.classList.add('current-weather__description');

  currentWeatherConditions.append(weatherTemperature, weatherTemperatureMinAndMax, weatherWind, weatherHumidity);

  currentWeatherDescription.append(weatherIcon, weatherDescription);

  weatherContainerElement.append(currentWeatherConditions, currentWeatherDescription);
};

const display5DayForecast = (data) => {
  // clear previous data
  clearLocation(forecastContainerElement);

  const forecastsToDisplay = 5; // number of forecasts
  const forecastsPerDay = data.list.length / forecastsToDisplay;

  for (let i = 0; i < forecastsToDisplay; i++) {
    const forecastIndex = i * forecastsPerDay; // total 40 forecasts, 8 a day, need every 8th

    const { weather, main, wind, dt_txt } = data.list[forecastIndex];
    const { icon, description } = weather[0];
    const { temp, humidity } = main;
    const { speed, deg } = wind;

    const forecastDayElement = document.createElement('div');
    forecastDayElement.classList.add('forecast-card');

    const forecastWeatherIcon = document.createElement('img');
    forecastWeatherIcon.src = 'https://openweathermap.org/img/wn/' + icon + '.png';

    const forecastWeatherDescription = document.createElement('p');
    forecastWeatherDescription.innerText = description.charAt(0).toUpperCase() + description.slice(1);

    const forecastWeatherTemperature = document.createElement('p');
    forecastWeatherTemperature.innerText = `Temperature: ${Math.round(temp)}\u00B0C`;

    const forecastWeatherHumidity = document.createElement('p');
    forecastWeatherHumidity.innerText = 'Humidity: ' + humidity + '%';

    const forecastWeatherWind = document.createElement('p');
    forecastWeatherWind.innerText = 'Wind: ' + Math.round(speed) + ' m/s ' + getWindDirection(deg);

    const forecastDateTime = document.createElement('p');
    forecastDateTime.innerText = 'Time: ' + new Date(dt_txt).toLocaleString('en-GB', options1);

    const forecastWeatherDescriptionElement = document.createElement('div');
    forecastWeatherDescriptionElement.classList.add('forecast-description__element');
    forecastWeatherDescriptionElement.append(forecastWeatherIcon, forecastWeatherDescription);

    forecastDayElement.append(
      forecastWeatherDescriptionElement,
      forecastWeatherTemperature,
      forecastWeatherHumidity,
      forecastWeatherWind,
      forecastDateTime
    );

    forecastContainerElement.appendChild(forecastDayElement); // append each
  }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', getWeather('Kaunas'));

buttonElement.addEventListener('click', searchWeather);

searchInputElement.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    searchWeather();
  }
});
