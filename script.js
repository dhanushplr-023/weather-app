const API_KEY = "8b2b49eb0e5f4e292cabce66e633d5f6";
const ctx = document.getElementById("tempChart");

const tempChart = new Chart(ctx, {

    type: "line",

    data: {

        labels: [],

        datasets: [{

            label: "Temperature",

            data: [],

            borderWidth: 3,

            tension: 0.4

        }]

    }

});
let searchHistory = [];

const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

setTimeTheme();

searchBtn.addEventListener("click", () => {

    const city =
        document.getElementById("cityInput").value;

    if(city){

        getWeather(city);

    }
});

locationBtn.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(

        position => {

            const lat =
                position.coords.latitude;

            const lon =
                position.coords.longitude;

            getWeatherByCoords(lat, lon);

        },

        () => {

            alert(
                "Location Permission Denied"
            );

        }

    );

});

async function getWeather(city){

    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        if(data.cod != 200){

            alert("City Not Found");

            return;
        }

        updateUI(data);

    }

    catch(error){

        alert("Something Went Wrong");

    }

}

async function getWeatherByCoords(lat, lon){

    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        updateUI(data);

    }

    catch(error){

        alert("Unable To Fetch Location");

    }

}

function updateUI(data){

    document.getElementById("cityName").textContent =
        data.name;

    document.getElementById("temperature").textContent =
        `${Math.round(data.main.temp)}°C`;

    document.getElementById("condition").textContent =
        data.weather[0].main;
    document.getElementById("humidity").textContent =
        `Humidity: ${data.main.humidity}%`;

    document.getElementById("windSpeed").textContent =
        `Wind: ${data.wind.speed} km/h`;

    document.getElementById("feelsLike").textContent =
         `Feels Like: ${Math.round(data.main.feels_like)}°C`;
    document.getElementById("rainPercent").textContent =
    `${data.clouds.all}%`;

    setWeatherBackground(
        data.weather[0].main
    );
    updateChart(data.main.temp);
    addToHistory(data.name);

}

function updateChart(temp){

    tempChart.data.labels.push(

        new Date().toLocaleTimeString()

    );

    tempChart.data.datasets[0].data.push(temp);

    if(tempChart.data.labels.length > 8){

        tempChart.data.labels.shift();

        tempChart.data.datasets[0].data.shift();

    }

    tempChart.update();

}

function setWeatherBackground(weather){

    weather = weather.toLowerCase();

    if(weather.includes("clear")){

        document.body.style.background =
        "linear-gradient(135deg,#f9d423,#ff4e50)";

    }

    else if(weather.includes("cloud")){

        document.body.style.background =
        "linear-gradient(135deg,#485563,#29323c)";

    }

    else if(weather.includes("rain")){

        document.body.style.background =
        "linear-gradient(135deg,#314755,#26a0da)";

    }

    else{

        document.body.style.background =
        "linear-gradient(135deg,#0f2027,#203a43,#2c5364)";

    }

}

function setTimeTheme(){

    const hour = new Date().getHours();

    if(hour >= 5 && hour < 12){

        document.body.classList.add("morning");

    }

    else if(hour >= 12 && hour < 18){

        document.body.classList.add("sunny");

    }

    else if(hour >= 18 && hour < 20){

        document.body.classList.add("evening");

    }

    else{

        document.body.classList.add("night");

    }

}

function addToHistory(city){

    if(searchHistory.includes(city))
        return;

    searchHistory.unshift(city);

    if(searchHistory.length > 5){

        searchHistory.pop();

    }

    const history =
        document.getElementById("historyList");

    history.innerHTML = "";

    searchHistory.forEach(city=>{

        history.innerHTML +=

        `<li>${city}</li>`;

    });

}

document
.getElementById("cityInput")
.addEventListener("keypress",

function(e){

    if(e.key==="Enter"){

        searchBtn.click();

    }

});

