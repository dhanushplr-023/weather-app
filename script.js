// Main application entry point
// ==========================
// Temperature Chart
// ==========================
console.log("SCRIPT.JS IS RUNNING");
const chartCanvas = document.getElementById("temperatureChart");

if (chartCanvas) {

    new Chart(chartCanvas, {

        type: "line",

        data: {

            labels: [

                "6 AM",

                "9 AM",

                "12 PM",

                "3 PM",

                "6 PM",

                "9 PM"

            ],

            datasets: [

                {

                    label: "Temperature",

                    data: [

                        20,

                        24,

                        30,

                        33,

                        28,

                        24

                    ],

                    borderColor: "#6d5dfc",

                    backgroundColor: "rgba(109,93,252,.2)",

                    fill: true,

                    tension: .4

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            aspectRatio: 2,

            plugins: {

                legend: {

                    labels: {

                        color: "white"

                    }

                }

            },

            scales: {

                x: {

                    ticks: {

                        color: "white"

                    }

                },

                y: {

                    ticks: {

                        color: "white"

                    }

                }

            }

        }

    });

}

// ==============================
// Search Weather
// ==============================

const searchButton = document.getElementById("searchBtn");

const cityInput = document.getElementById("cityInput");

searchButton.addEventListener("click", async () => {

    const city = cityInput.value.trim();

    if (city === "") {

        alert("Please enter a city.");

        return;

    }

const weather = await getWeather(city);

if(weather){

    console.log(weather);

    updateWeatherUI(weather);

}

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