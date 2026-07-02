// UI update functions
// ===============================
// Update Weather Card
// ===============================

function updateWeatherUI(data) {

    console.log("Updating UI...");

    const ids = [
        "temperature",
        "cityName",
        "feelsLike",
        "humidity",
        "wind",
        "weatherIcon",
        "currentDate",
        "currentTime"
    ];

    ids.forEach(id => {
        if (!document.getElementById(id)) {
            console.error(`Missing HTML element with id="${id}"`);
        }
    });

    document.getElementById("temperature").textContent =
        `${Math.round(data.current.temp_c)}°C`;

    document.getElementById("cityName").textContent =
        `${data.location.name}, ${data.location.country}`;

    document.getElementById("feelsLike").textContent =
        `Feels Like: ${Math.round(data.current.feelslike_c)}°C`;

    document.getElementById("humidity").textContent =
        `💧 ${data.current.humidity}%`;

    document.getElementById("wind").textContent =
        `🌬️ ${data.current.wind_kph} km/h`;

    document.getElementById("weatherIcon").src =
        "https:" + data.current.condition.icon;

   // ------------------------------
   // Update Weather Detail Cards
   // ------------------------------

   // Wind Speed
    document.getElementById("windSpeed").textContent =
        `${data.current.wind_kph} km/h`;

    // Current Precipitation
    document.getElementById("rainChance").textContent =
        `${data.current.precip_mm} mm`;

    // UV Index
    document.getElementById("uvIndex").textContent =
        data.current.uv;

    // Cloud Cover
    document.getElementById("cloudCover").textContent =
        `${data.current.cloud}%`;

        // Wind Speed Card
    document.getElementById("windSpeed").textContent =
        `${data.current.wind_kph} km/h`;

    // Rain Chance
    document.getElementById("rainChance").textContent =
        `${data.current.precip_mm} mm`;

    // UV Index
    document.getElementById("uvIndex").textContent =
        data.current.uv;

    // Cloud Cover
    document.getElementById("cloudCover").textContent =
        `${data.current.cloud}%`;

    updateForecast(data);
    
    updateTemperatureChart(data);
}

function updateDateTime(){

    const now = new Date();

    document.getElementById("currentDate").textContent =
        "📅 " + now.toDateString();

    document.getElementById("currentTime").textContent =
        "🕒 " + now.toLocaleTimeString();

}

updateDateTime();

setInterval(updateDateTime,1000);

function updateForecast(data){

    const container = document.getElementById("forecastContainer");

    container.innerHTML = "";

    data.forecast.forecastday.forEach(day=>{

        const date = new Date(day.date);

        const weekDay = date.toLocaleDateString("en-US",{

            weekday:"short"

        });

        container.innerHTML += `

        <div class="forecast-card">

            <h3>${weekDay}</h3>

            <img src="https:${day.day.condition.icon}">

            <h2>${Math.round(day.day.avgtemp_c)}°C</h2>

            <p>${day.day.condition.text}</p>

        </div>

        `;

    });

}

function updateTemperatureChart(data) {

    const hours = data.forecast.forecastday[0].hour;

    const labels = [];
    const temperatures = [];

    for (let i = 0; i < 24; i += 3) {

        labels.push(hours[i].time.split(" ")[1]);

        temperatures.push(hours[i].temp_c);

    }

    const ctx = document
        .getElementById("temperatureChart")
        .getContext("2d");

    if (temperatureChart) {

        temperatureChart.destroy();

    }

    temperatureChart = new Chart(ctx, {

        type: "line",

        data: {

            labels,

            datasets: [

                {

                    label: "Temperature (°C)",

                    data: temperatures,

                    borderColor: "#6d5dfc",

                    backgroundColor: "rgba(109,93,252,.2)",

                    fill: true,

                    tension: .4

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}