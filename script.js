const apiKey = "01ee0b1f3ba540508fb163716261506";

const cityInput =
document.getElementById("cityInput");

const searchBtn =
document.getElementById("searchBtn");

const cityName =
document.getElementById("cityName");

const temperature =
document.getElementById("temperature");

const description =
document.getElementById("description");

const humidity =
document.getElementById("humidity");

const wind =
document.getElementById("wind");

async function getWeather(city){

    try{

        const url =
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Chennai`;
        const response =
        await fetch(url);

        const data =
        await response.json();

        if(data.cod !== 200){

            cityName.textContent =
            "City Not Found";

            return;
        }

        cityName.textContent =
        data.name;

        temperature.textContent =
        `${Math.round(data.main.temp)}°C`;

        description.textContent =
        data.weather[0].description;

        humidity.textContent =
        `Humidity: ${data.main.humidity}%`;

        wind.textContent =
        `Wind: ${data.wind.speed} m/s`;

    }
    catch(error){

        cityName.textContent =
        "Something Went Wrong";
    }
}

searchBtn.addEventListener("click", ()=>{

     console.log("Button clicked");
    const city =
    cityInput.value.trim();

    if(city){

        getWeather(city);
    }

});

cityInput.addEventListener(
"keypress",
(e)=>{

    if(e.key === "Enter"){

        getWeather(
            cityInput.value
        );
    }

});