/* LOAD SESSION STORAGE */

function LoadSessionStorage() {
    const latitude = sessionStorage.getItem('latitude');
    const longitude = sessionStorage.getItem('longitude');

    fetchCurrentWeather({ latitude, longitude });
    fetchForecast({ latitude, longitude });
}

LoadSessionStorage();

/* FETCH CURRENT WEATHER API  */
function fetchCurrentWeather({ city, latitude, longitude }) {

    let weatherURL;
    if (city) {
        weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5d701d369d46aa133c404b3d2ec1d506&units=metric`;
    } else if (latitude && longitude) {
        weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=5d701d369d46aa133c404b3d2ec1d506&units=metric`;
    }
    /* GET CURRENT WEATHER INFO */
    fetch(weatherURL)
        .then((response) => response.json())
        .then(data => {
            displayWeatherData(data);
            displayCurrentInfo(data);
        })
        .catch((error) => {
            document.getElementById("display-info").innerText = "Error retrieving weather data. Please try again.";
            console.error("Weather Error:", error);
        });
}

/* FETCH FORECAST API */
function fetchForecast({ city, latitude, longitude }) {

    let forecastURL;
    if (city) {
        forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=5d701d369d46aa133c404b3d2ec1d506&units=metric`;
    } else if (latitude && longitude) {
        forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=5d701d369d46aa133c404b3d2ec1d506&units=metric`;
    }

    /* GET FORECAST INFO */
    fetch(forecastURL)
        .then((response) => response.json())
        .then(displayForecast)
        .catch((error) => {
            document.getElementById("forecast-info").innerText = "Error retrieving forecast data. Please try again.";
            console.error("Forecast Error:", error);
        });
}

/* BY USER INPUT */
function WeatherData() {
    const cityInputElement = document.getElementById('city-input');
    const cityInput = cityInputElement.value;

    /* call the two API by user input */
    fetchCurrentWeather({ city: cityInput });
    fetchForecast({ city: cityInput });
    cityInputElement.value = '';
}

/* PRINTING OUT THE CURRENT WEATHER DATA */
function displayWeatherData(weatherData) {
    const infoText = document.getElementById("display-info");
    const iconCode = weatherData.weather[0].icon;
    const temp = Math.round(weatherData.main.temp);
    const iconPath = getSVGIcon(iconCode);
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });

    infoText.innerHTML = `
    <div class="icon-info">
    <div>${weatherData.name}, ${weatherData.sys.country}</div>
        <div class="today-date">${today}</div>
        <img class="svg-animated" src="${iconPath}" width="250px" height="250px">
        <div>${weatherData.weather[0].description}</div>
    </div>
    <div class="information-box">
        <div class="temp-info">${temp}<span class="degree-icon">°</span></div>
    </div>`;
}

/* PRINT OUT DAILY INFORMATION DATA */
function displayCurrentInfo(weatherData) {
    const container = document.getElementById('current-info');

    container.innerHTML = '';
    const rain = weatherData.rain ? weatherData.rain['1h'] : 0;

    /* CONVERT UNIX TIME FOR SUNRISE AND SUNSET TO LOCAL TIMES RATHER THAN UTC */
    const sunriseUTC = new Date(weatherData.sys.sunrise * 1000);
    const sunsetUTC = new Date(weatherData.sys.sunset * 1000);
    const timezone = weatherData.timezone;

    const localSunrise = new Date(sunriseUTC.getTime() + timezone * 1000);
    const localSunset = new Date(sunsetUTC.getTime() + timezone * 1000);
    const sunrise = localSunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = localSunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const currentweatherDataContainer = document.createElement("div");
    currentweatherDataContainer.classList.add("current-info-data");

    currentweatherDataContainer.innerHTML = `
            <div><span class="info-title">Min temp:</span> ${Math.round(weatherData.main.temp_min)}°C</div>
            <div><span class="info-title">Max temp:</span> ${Math.round(weatherData.main.temp_max)}°C</div>
            <div><span class="info-title">Humidity:</span> ${weatherData.main.humidity}%</div>
            <div><span class="info-title">Wind speed:</span> ${weatherData.wind.speed} m/s</div>
            <div><span class="info-title">Rain:</span> ${rain} mm</div>
            <div><span class="info-title">Sunrise:</span> ${sunrise}</div>
            <div><span class="info-title">Sunset:</span> ${sunset}</div>
        `;
    container.appendChild(currentweatherDataContainer);
}

/* PRINTING OUT THE FORECAST DATA */

function displayForecast(data) {
    const today = new Date().toLocaleDateString('en-US');
    const hourlyForecastContainer = document.getElementById("hourly-forecast");
    const dailyForecastContainer = document.getElementById("daily-forecast");

    hourlyForecastContainer.innerHTML = "";
    dailyForecastContainer.innerHTML = "";

    displayHourlyForecast(data, hourlyForecastContainer);
    displayDailyForecast(data, today, dailyForecastContainer);
}

/* DISPLAY HOURLY */
function displayHourlyForecast(data, container) {
    const hourlyForecasts = data.list.slice(0, 5);

    hourlyForecasts.forEach((forecast) => {
        const time = new Date(forecast.dt_txt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        const temp = Math.round(forecast.main.temp);
        const iconCode = forecast.weather[0].icon;
        const iconPath = getSVGIcon(iconCode);

        const forecastCard = document.createElement("div");
        forecastCard.classList.add("forecast-card");

        forecastCard.innerHTML = `
            <div class="forecast-day">${time}</div>
            <img class="forecast-icon" src="${iconPath}" alt="Weather Icon">
            <div class="forecast-temp">${temp}°C</div>
        `;

        container.appendChild(forecastCard);
    });
}

/* DISPLAY DAILY FORECAST */
function displayDailyForecast(weatherData, today, container) {
    const dailyForecasts = weatherData.list.filter(entry => {
        const entryDate = new Date(entry.dt_txt).toLocaleDateString('en-US');
        return entry.dt_txt.includes("12:00:00") && entryDate !== today;
    })
    dailyForecasts.forEach((forecast) => {
        const dayOfWeek = new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(forecast.main.temp);
        const iconCode = forecast.weather[0].icon;
        const iconPath = getSVGIcon(iconCode);

        const forecastCard = document.createElement("div");
        forecastCard.classList.add("forecast-card");

        forecastCard.innerHTML = `
            <div class="forecast-day">${dayOfWeek}</div>
            <img class="forecast-icon" src="${iconPath}" alt="Weather Icon">
            <div class="forecast-temp">${temp}°C</div>
        `;

        container.appendChild(forecastCard);
    });
}

/* SHOW/HIDE FORECAST */
function showForecast(type) {
    const hourlyForecastContainer = document.getElementById("hourly-forecast");
    const dailyForecastContainer = document.getElementById("daily-forecast");
    const currentInfoContainer = document.getElementById("current-info");

    hourlyForecastContainer.style.display = "none";
    dailyForecastContainer.style.display = "none";
    currentInfoContainer.style.display = "none";

    document.getElementById("show-hourly").classList.remove("active-button");
    document.getElementById("show-daily").classList.remove("active-button");
    document.getElementById("show-current").classList.remove("active-button");

    if (type === 'hourly') {
        hourlyForecastContainer.style.display = "flex";
        document.getElementById("show-hourly").classList.add("active-button");
    } else if (type === 'daily') {
        dailyForecastContainer.style.display = "flex";
        document.getElementById("show-daily").classList.add("active-button");
    } else if (type === 'current') {
        currentInfoContainer.style.display = "flex";
        document.getElementById("show-current").classList.add("active-button");
    }
}

/* MATCHING THE ICON CODES WITH SVGs */
function getSVGIcon(iconCode) {
    let iconPath;
    switch (iconCode) {
        case '01d':
            iconPath = 'icons/animated/day.svg';
            break;
        case '01n':
            iconPath = 'icons/animated/night.svg';
            break;
        case '02d':
            iconPath = 'icons/animated/cloudy-day-1.svg';
            break;
        case '02n':
            iconPath = 'icons/animated/cloudy-night-1.svg';
            break;
        case '03d':
            iconPath = 'icons/animated/cloudy-day-2.svg';
            break;
        case '03n':
            iconPath = 'icons/animated/cloudy-night-2.svg';
            break;
        case '04d':
            iconPath = 'icons/animated/cloudy-day-3.svg';
            break;
        case '04n':
            iconPath = 'icons/animated/cloudy-night-3.svg';
            break;
        case '09d':
            iconPath = 'icons/animated/rainy-1.svg';
            break;
        case '09n':
            iconPath = 'icons/animated/rainy-4.svg';
            break;
        case '10d':
            iconPath = 'icons/animated/rainy-2.svg';
            break;
        case '10n':
            iconPath = 'icons/animated/rainy-5.svg';
            break;
        case '11d':
        case '11n':
            iconPath = 'icons/animated/thunder.svg';
            break;
        case '13d':
            iconPath = 'icons/animated/snowy-1.svg';
            break;
        case '13n':
            iconPath = 'icons/animated/snowy-5.svg';
            break;
        case '50d':
        case '50n':
            iconPath = 'icons/animated/cloudy.svg';
            break;
        default:
            iconPath = 'icons/animated/cloudy.svg';
            break;
    }
    return iconPath;
}
