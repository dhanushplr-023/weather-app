// API functions
// ==============================
// Weather API Configuration
// ==============================

const API_KEY = "8975e06709954cbdae4165044261506";

// Replace with your actual WeatherAPI key
// Example:
// const API_KEY = "a1b2c3d4e5f6";

const BASE_URL = "https://api.weatherapi.com/v1";

// ==============================
// Fetch Current Weather
// ==============================

async function getWeather(city) {

    try {

        const response = await fetch(
            `${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=yes`
        );

        if (!response.ok) {

            throw new Error("City not found");

        }

        const data = await response.json();

        return data;

    } catch (error) {

        alert(error.message);

        return null;

    }

}

// =========================
// Fetch Weather by Coordinates
// =========================

async function getWeatherByCoords(lat, lon){

    try{

        const response = await fetch(

            `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=yes`

        );

        const data = await response.json();

        return data;

    }

    catch(error){

        console.log(error);

    }

}