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



// =========================
// Fetch Weather by Coordinates
// =========================

async function getWeatherByCoords(lat, lon){

try{

    const response = await fetch(

        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=5&aqi=yes&alerts=no`

    );

    if(!response.ok){

        throw new Error("Location not found");

    }

    return await response.json();

}

catch(error){

    console.log(error);

    return null;

}
    
}