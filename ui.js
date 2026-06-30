// UI update functions
// ===============================
// Update Weather Card
// ===============================

function updateWeatherUI(data){

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