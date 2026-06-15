const API_KEY = " 8975e06709954cbdae4165044261506";

async function getWeather(cityName = null){

    const city =
        cityName ||
        document.getElementById("cityInput").value ||
        "Chennai";

    try{

        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`
        );

        const data = await response.json();

        if(data.error){
            alert(data.error.message);
            return;
        }

        document.getElementById("city").textContent =
            data.location.name;

        document.getElementById("country").textContent =
            data.location.country;

        document.getElementById("temperature").textContent =
            `${Math.round(data.current.temp_c)}°`;

        document.getElementById("condition").textContent =
            data.current.condition.text;

        document.getElementById("humidity").textContent =
            `${data.current.humidity}%`;

        document.getElementById("wind").textContent =
            `${data.current.wind_kph} km/h`;

        document.getElementById("feelsLike").textContent =
            `${Math.round(data.current.feelslike_c)}°C`;

        document.getElementById("weatherIcon").src =
            "https:" + data.current.condition.icon;

    }
    catch(error){
        alert("Unable to fetch weather data.");
        console.error(error);
    }
}

document
.getElementById("cityInput")
.addEventListener("keypress",function(e){

    if(e.key==="Enter"){
        getWeather();
    }
});

getWeather("Chennai");