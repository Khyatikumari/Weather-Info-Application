//SELECT FOR GEOLOCATION
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temp");
const locationElement = document.querySelector(".city");
const notificationElement = document.querySelector(".error");
const descElement = document.querySelector(".temperature-description p");
const humidityelement = document.querySelector(".humidity");
const windelement = document.querySelector(".wind");

//FOR SEARCHING THROUGH CITY
const searchbox = document.querySelector(".search input");
const searchbtn = document.querySelector(".search button");

// App data
const weather = {};

weather.temperature = {
    unit: "celsius"
}

// APP CONSTS AND VARS
const KELVIN = 273;
const apikey = "30ed8be7a8570eaddbedc2f8ab835006";
const apiurl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;

    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.humidity = data.main.humidity;
            weather.wind = data.wind.speed;
        })
        .then(function () {
            displayWeather();
        });
}

// DISPLAY WEATHER TO UI
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    humidityelement.innerHTML = weather.humidity;
    windelement.innerHTML = weather.wind;
}

// C to F conversion
function celsiusToFahrenheit(temperature) {
    return (temperature * 9 / 5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function () {
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit == "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});

//CHECK WEATHER FOR CITY
async function checkWeather(city) {                               //this city comes from eventlistener
    const response = await fetch(apiurl + city + `&appid=${apikey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        //document.querySelector(".weather").style.display = "none";
    }
    else {
        document.querySelector(".error").style.display = "none";

        var data = await response.json();

        console.log(data);

        //to get the data from api and to show through innerhtml

        document.querySelector(".city").innerHTML = data.name + " , " + data.sys.country; 
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + " °C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + " %";
        document.querySelector(".wind").innerHTML = data.wind.speed + " kmph";

        // iconElement.src="icons/${weather.icon}.png";

        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "images/clouds.png";
        }
        else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "images/rain.png";
        }
        else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "images/clear.png";
        }
        else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "images/rain.png";
        }
        else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        }
        else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "images/mist.png";
        }
        else if (data.weather[0].main == "snow") {
            weatherIcon.src = "images/snow.png";
        }
        else if (data.weather[0].main == "Haze") {
            weatherIcon.src = "images/mist.png";
        }

    }
}

//EVENT LISTENER ON BUTTON
searchbtn.addEventListener("click", () => {
    if (searchbox.value == "") {
        displayWeather();
    }
    else {
        checkWeather(searchbox.value);     //take value from searchbox and sends to check weather
    }
})