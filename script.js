// Main application entry point
// ==========================
// Temperature Chart
// ==========================
let temperatureChart = null;

// ==============================
// Search Weather
// ==============================

const searchButton = document.getElementById("searchBtn");

const cityInput = document.getElementById("cityInput");

// Search when Enter key is pressed
cityInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {

        searchButton.click();

    }

});

searchButton.addEventListener("click", async () => {

    const city = cityInput.value.trim();

    searchButton.textContent = "Loading...";
    searchButton.disabled = true;

    if (city === "") {

        alert("Please enter a city.");

        return;

    }

const weather = await getWeather(city);

if(weather){

    updateWeatherUI(weather);

}

searchButton.textContent = "🔍";
searchButton.disabled = false;

});

// =========================
// Current Location Button
// =========================

const locationBtn = document.getElementById("locationBtn");

locationBtn.addEventListener("click", () => {

    if(!navigator.geolocation){

        alert("Geolocation is not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        async(position)=>{

            const lat = position.coords.latitude;

            const lon = position.coords.longitude;

            const weather = await getWeatherByCoords(lat, lon);

            updateWeatherUI(weather);

        },

        ()=>{

            alert("Location permission denied.");

        }

    );

});

// =====================================
// Automatically Load User Location
// =====================================
window.addEventListener("load", () => {

    console.log("Website Loaded");

    if (!navigator.geolocation) {

        console.log("Geolocation Not Supported");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            console.log("Location Permission Granted");

            console.log(position.coords.latitude);
            console.log(position.coords.longitude);

           const weather = await getWeatherByCoords(
    position.coords.latitude,
    position.coords.longitude
);

        console.log("Weather Object:", weather);

        if (weather && weather.error) {

            console.error("Weather API Error:", weather.error);

        }

        if (weather && weather.location) {

            console.log("City:", weather.location.name);
            console.log("Temperature:", weather.current.temp_c);

            updateWeatherUI(weather);

        }

        },

        (error) => {

            console.log("Location Error:", error);

        }

    );

});