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

function toggleDropdown(dropdownContentSelector) {
    const dropdownContent = document.querySelector(dropdownContentSelector);
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';

    // Close dropdown
    window.onclick = function (event) {
        if (!event.target.matches('.dropdown-btn')) {
            const dropdowns = document.querySelectorAll('.swe, .rwa');
            dropdowns.forEach(function (dropdown) {
                if (dropdown.style.display === 'block') {
                    dropdown.style.display = 'none';
                }
            });
        }
    };
}

function weatherApi(city, win) {
    let cityInput = city
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=5d701d369d46aa133c404b3d2ec1d506&units=metric`)
        .then((response) => response.json())
        .then((data) => { displayVs(data, win) })

        .catch((error) => {
            console.error("Error:", error);
        });
}


function weatherApiHelper(win){
    const valueInput = document.getElementsByClassName('input-search')[0].value;
    weatherApi(valueInput, win)

}

function search(win){

    const one = `
    <div class="dropdown">
        <button class="dropdown-btn" onclick="toggleDropdown('.dropdown .swe')">Select Swedish
            City</button>
        <div class="swe">
            <div onclick="weatherApi('Malmo', 'one')">Malmö</div>
            <div onclick="weatherApi('Norrkoping', 'one')">Norrköping</div>
            <div onclick="weatherApi('Stockholm', 'one')">Stockholm</div>
            <div onclick="weatherApi('kiruna', 'one')">Kiruna</div>
        </div>
    </div>
    `

    const two = `
    <div class="dropdown">
        <button class="dropdown-btn" onclick="toggleDropdown('.dropdown .rwa')">Select Rwandan
            City</button>
        <div class="rwa">
            <div onclick="weatherApi('Kigali', 'two')">Kigali</div>
            <div onclick="weatherApi('Gisenyi', 'two')">Gisenyi</div>
            <div onclick="weatherApi('Butare', 'two')">Butare</div>
            <div onclick="weatherApi('Gitarama', 'two')">Gitarama</div>
        </div>
    </div>
    `
    let final = two;

    if (win === 'one'){
        final = one;
    }


    const onclickSearch = document.getElementsByClassName(`win-${win}`)[0];

    onclickSearch.innerHTML = `
    ${final}
    `
}

function displayVs(weatherData, win) {
    const infoTextCollection = document.getElementsByClassName(`win-${win}`)[0];
    const iconCode = weatherData.weather[0].icon;
    const temp = Math.round(weatherData.main.temp);
    const feelsComp = Math.round(weatherData.main.feels_like);
    const minComp = Math.round(weatherData.main.temp_min);
    const maxComp = Math.round(weatherData.main.temp_max);
    const humiComp = Math.round(weatherData.main.humidity);
    const windComp = Math.round(weatherData.wind.speed);
    const iconPath = getSVGIcon(iconCode);

    const tempDiv = document.getElementsByClassName(`temp-comp-${win}`)[0];
    const feelsDiv = document.getElementsByClassName(`feels-comp-${win}`)[0];
    const minDiv = document.getElementsByClassName(`min-comp-${win}`)[0];
    const maxDiv = document.getElementsByClassName(`max-comp-${win}`)[0];
    const humDiv = document.getElementsByClassName(`humidity-comp-${win}`)[0];
    const windDiv = document.getElementsByClassName(`wind-comp-${win}`)[0];


    infoTextCollection.classList.add(`move-${win}`);
    setTimeout(function () {
        infoTextCollection.innerHTML = `
        <button class="search-button-${win}" onclick="search('${win}')">
          
            <div class=city-info>${weatherData.name}, ${weatherData.sys.country}</div>
            <img class="icon-img" src="${iconPath}">
            
            <div class="vs-temp-info">${temp}°</div>
        </button>
            `;
    }, 750);
    infoTextCollection.addEventListener('animationend', function handleAnimationEnd() {
        infoTextCollection.classList.remove(`move-${win}`);

        tempDiv.innerHTML = temp;
        feelsDiv.innerHTML = feelsComp;
        minDiv.innerHTML = minComp;
        maxDiv.innerHTML = maxComp;
        humDiv.innerHTML = humiComp;
        windDiv.innerHTML = windComp;
    })
}
