// ============================================
// STEP 1: CONFIGURATION
// ============================================
// Get your FREE API key from:
// https://www.weatherapi.com/signup.aspx

const API_KEY = '8975e06709954cbdae4165044261506'; // ← CHANGE THIS!

// ============================================
// STEP 2: VARIABLES (Memory boxes)
// ============================================
// These store data we need later

let currentData = null;      // Stores weather data
let currentUnit = 'C';       // 'C' or 'F'
let isLocating = false;      // Are we getting GPS now?


// ============================================
// STEP 3: HELPER FUNCTIONS (Small tools)
// ============================================

/**
 * getWeatherIcon(condition)
 * -------------------------
 * Input: "Light rain" → Output: "🌧️"
 * Checks text for keywords and returns emoji
 */
function getWeatherIcon(condition) {
    const text = condition.toLowerCase();
    
    if (text.includes('sun') || text.includes('clear')) return '☀️';
    if (text.includes('partly')) return '⛅';
    if (text.includes('cloud') || text.includes('overcast')) return '☁️';
    if (text.includes('rain') || text.includes('drizzle')) return '🌧️';
    if (text.includes('thunder')) return '⚡';
    if (text.includes('snow') || text.includes('blizzard')) return '❄️';
    if (text.includes('mist') || text.includes('fog')) return '🌫️';
    if (text.includes('sleet')) return '🌨️';
    
    return '🌡️'; // Default
}

/**
 * getBackgroundUrl(condition, isDay)
 * -----------------------------------
 * Chooses background image based on weather
 */
function getBackgroundUrl(condition, isDay) {
    const text = condition.toLowerCase();
    
    // Rain
    if (text.includes('rain') || text.includes('drizzle')) {
        return 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920';
    }
    // Snow
    if (text.includes('snow') || text.includes('blizzard') || text.includes('ice')) {
        return 'https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=1920';
    }
    // Thunder
    if (text.includes('thunder')) {
        return 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1920';
    }
    // Fog/Mist
    if (text.includes('mist') || text.includes('fog')) {
        return 'https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1920';
    }
    // Night
    if (!isDay) {
        return 'https://images.unsplash.com/photo-1532978379173-523e16f371f2?w=1920';
    }
    // Cloudy day
    if (text.includes('cloud') || text.includes('overcast')) {
        return 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920';
    }
    // Sunny day (default)
    return 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1920';
}

/**
 * convertTemp(celsius)
 * --------------------
 * If user wants Fahrenheit, convert it
 */
function convertTemp(celsius) {
    if (currentUnit === 'F') {
        return Math.round((celsius * 9/5) + 32);
    }
    return Math.round(celsius);
}

/**
 * getUvInfo(uv)
 * -------------
 * Returns text and color based on UV number
 */
function getUvInfo(uv) {
    if (uv <= 2) return { text: 'Low', advice: 'No protection needed' };
    if (uv <= 5) return { text: 'Moderate', advice: 'Use sun protection 10:00-16:00' };
    if (uv <= 7) return { text: 'High', advice: 'Protection essential 10:00-16:00' };
    if (uv <= 10) return { text: 'Very High', advice: 'Extra protection 10:00-16:00' };
    return { text: 'Extreme', advice: 'Avoid sun 10:00-16:00' };
}

/**
 * formatTime(timeString)
 * ----------------------
 * "2024-01-15 14:00" → "2 PM"
 */
function formatTime(timeString) {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
    });
}


// ============================================
// STEP 4: SEARCH FUNCTION (Find any city)
// ============================================

/**
 * searchCity(query)
 * -----------------
 * Calls WeatherAPI's "search" endpoint
 * Returns list of matching cities
 */
async function searchCity(query) {
    if (!query || query.length < 2) return; // Need at least 2 letters
    
    try {
        const url = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const cities = await response.json();
        
        showSearchResults(cities);
        
    } catch (error) {
        console.error('Search error:', error);
    }
}

/**
 * showSearchResults(cities)
 * -------------------------
 * Shows dropdown with city suggestions
 */
function showSearchResults(cities) {
    const dropdown = document.getElementById('searchDropdown');
    
    // If no results, hide dropdown
    if (!cities || cities.length === 0) {
        dropdown.classList.remove('active');
        return;
    }
    
    // Build HTML for each city
    dropdown.innerHTML = cities.map(city => `
        <div class="dropdown-item" onclick="selectCity('${city.name}')">
            <div class="dropdown-city">${city.name}</div>
            <div class="dropdown-region">${city.region}, ${city.country}</div>
        </div>
    `).join('');
    
    dropdown.classList.add('active');
}

/**
 * selectCity(cityName)
 * ------------------
 * When user clicks a suggestion, fetch weather
 */
function selectCity(cityName) {
    document.getElementById('searchInput').value = cityName;
    document.getElementById('searchDropdown').classList.remove('active');
    fetchWeather(cityName);
}

/**
 * handleSearchInput()
 * -----------------
 * Called every time user types in search box
 */
function handleSearchInput() {
    const query = document.getElementById('searchInput').value.trim();
    
    // Clear previous timeout (prevents too many API calls)
    if (window.searchTimeout) {
        clearTimeout(window.searchTimeout);
    }
    
    // Wait 300ms after typing stops, then search
    window.searchTimeout = setTimeout(() => {
        searchCity(query);
    }, 300);
}


// ============================================
// STEP 5: GPS LOCATION (Get user's real location)
// ============================================

/**
 * getUserLocation()
 * -----------------
 * Uses browser's GPS to find where user is
 */
function getUserLocation() {
    const btn = document.getElementById('locationBtn');
    
    // Check if browser supports GPS
    if (!navigator.geolocation) {
        alert('Your browser does not support location services');
        return;
    }
    
    // Show loading state
    isLocating = true;
    btn.classList.add('loading');
    showLoading(true);
    
    // Ask browser for location
    navigator.geolocation.getCurrentPosition(
        // SUCCESS: Got location!
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // WeatherAPI accepts "lat,lon" format
            fetchWeather(`${lat},${lon}`);
            
            // Reset button
            isLocating = false;
            btn.classList.remove('loading');
        },
        // ERROR: Couldn't get location
        (error) => {
            isLocating = false;
            btn.classList.remove('loading');
            showLoading(false);
            
            // Friendly error messages
            let message = 'Could not get your location';
            if (error.code === 1) message = 'Location access denied. Please allow location permission.';
            if (error.code === 2) message = 'Location unavailable. Try again later.';
            if (error.code === 3) message = 'Location request timed out.';
            
            alert(message);
        },
        // OPTIONS
        {
            enableHighAccuracy: true, // Use GPS if available
            timeout: 10000,             // Wait 10 seconds max
            maximumAge: 0               // Don't use cached location
        }
    );
}


// ============================================
// STEP 6: FETCH WEATHER DATA (Main function)
// ============================================

/**
 * fetchWeather(location)
 * ----------------------
 * The heart of the app - gets weather from API
 * 
 * location can be:
 * - City name: "London"
 * - Coordinates: "51.5,-0.1" (from GPS)
 */
async function fetchWeather(location) {
    
    // Check API key
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        alert('Please add your WeatherAPI key in script.js line 12!');
        return;
    }
    
    showLoading(true);
    
    try {
        // Build API URL
        // forecast.json gives: current + 10 days + astronomy
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=10&aqi=no&alerts=no`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('City not found or API limit reached');
        }
        
        const data = await response.json();
        currentData = data;
        
        // Update everything on screen
        updatePage(data);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    } finally {
        showLoading(false);
    }
}

/**
 * showLoading(show)
 * ---------------
 * Show or hide the loading spinner
 */
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}


// ============================================
// STEP 7: UPDATE THE PAGE (Display data)
// ============================================

function updatePage(data) {
    const current = data.current;
    const location = data.location;
    const forecast = data.forecast.forecastday;
    
    // 1. BACKGROUND IMAGE
    const bgUrl = getBackgroundUrl(current.condition.text, current.is_day);
    document.getElementById('bgImage').style.backgroundImage = `url('${bgUrl}')`;
    
    // 2. LEFT PANEL - Main info
    document.getElementById('location').textContent = `${location.name}, ${location.country}`;
    document.getElementById('tempNumber').textContent = convertTemp(current.temp_c);
    document.getElementById('condition').textContent = current.condition.text;
    
    // Description paragraph
    const maxTemp = convertTemp(forecast[0].day.maxtemp_c);
    const minTemp = convertTemp(forecast[0].day.mintemp_c);
    document.getElementById('description').textContent = 
        `Today in ${location.name}, expect ${current.condition.text.toLowerCase()} with ` +
        `a high of ${maxTemp}° and a low of ${minTemp}°. ` +
        `Humidity is ${current.humidity}% with winds up to ${current.wind_kph} km/h.`;
    
    // 3. DETAIL CARDS
    document.getElementById('feelsLike').textContent = `${convertTemp(current.feelslike_c)}°`;
    document.getElementById('precipitation').textContent = `${forecast[0].day.totalprecip_mm} mm`;
    document.getElementById('precipSubtext').textContent = 'in last 24h';
    document.getElementById('visibility').textContent = `${current.vis_km} km`;
    document.getElementById('humidity').textContent = `${current.humidity}%`;
    document.getElementById('humiditySubtext').textContent = `Dew point is ${convertTemp(current.dewpoint_c)}°`;
    
    // 4. HOURLY FORECAST
    updateHourly(forecast[0].hour);
    
    // 5. DAILY FORECAST (10 days)
    updateDaily(forecast);
    
    // 6. UV INDEX
    const uvInfo = getUvInfo(current.uv);
    document.getElementById('uvNumber').textContent = current.uv;
    document.getElementById('uvText').textContent = uvInfo.text;
    document.getElementById('uvAdvice').textContent = uvInfo.advice;
    
    // Move marker to correct position (UV 0-11 scale)
    const uvPercent = Math.min((current.uv / 11) * 100, 100);
    document.getElementById('uvMarker').style.left = `${uvPercent}%`;
    
    // 7. WIND
    document.getElementById('windSpeed').innerHTML = `${current.wind_kph} <span>km/h</span>`;
    document.getElementById('windGusts').textContent = current.gust_kph || current.wind_kph;
    
    // Rotate compass arrow to wind direction
    document.getElementById('compassArrow').style.transform = 
        `rotate(${current.wind_degree}deg)`;
}

/**
 * updateHourly(hours)
 * -------------------
 * Shows next 24 hours in horizontal scroll
 */
function updateHourly(hours) {
    const container = document.getElementById('hourlyContainer');
    container.innerHTML = '';
    
    // Get current hour
    const now = new Date().getHours();
    
    // Show next 24 hours (wrapping to tomorrow if needed)
    for (let i = 0; i < 24; i++) {
        const hourIndex = (now + i) % 24;
        const hourData = hours[hourIndex];
        if (!hourData) continue;
        
        const div = document.createElement('div');
        div.className = 'hour-item';
        div.innerHTML = `
            <div class="hour-time">${formatTime(hourData.time)}</div>
            <div class="hour-icon">${getWeatherIcon(hourData.condition.text)}</div>
            <div class="hour-temp">${convertTemp(hourData.temp_c)}°</div>
        `;
        container.appendChild(div);
    }
}

/**
 * updateDaily(days)
 * -----------------
 * Shows 10 days in vertical list with temp bars
 */
function updateDaily(days) {
    const container = document.getElementById('dailyContainer');
    container.innerHTML = '';
    
    // Find overall min/max for bar scaling
    let allMin = [], allMax = [];
    days.forEach(d => {
        allMin.push(d.day.mintemp_c);
        allMax.push(d.day.maxtemp_c);
    });
    const globalMin = Math.min(...allMin);
    const globalMax = Math.max(...allMax);
    const range = globalMax - globalMin || 1;
    
    days.forEach((day, index) => {
        const date = new Date(day.date);
        const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const min = day.day.mintemp_c;
        const max = day.day.maxtemp_c;
        
        // Calculate bar position
        const leftPercent = ((min - globalMin) / range) * 100;
        const widthPercent = ((max - min) / range) * 100;
        
        const div = document.createElement('div');
        div.className = 'day-item';
        div.innerHTML = `
            <div class="day-name">${dayName}</div>
            <div class="day-icon">${getWeatherIcon(day.day.condition.text)}</div>
            <div class="day-temp-bar">
                <span class="temp-min">${convertTemp(min)}°</span>
                <div class="temp-bar">
                    <div class="temp-bar-fill" style="left:${leftPercent}%; width:${Math.max(widthPercent, 5)}%;"></div>
                </div>
                <span class="temp-max">${convertTemp(max)}°</span>
            </div>
        `;
        container.appendChild(div);
    });
}


// ============================================
// STEP 8: EVENT LISTENERS (Button clicks)
// ============================================

// When page finishes loading
window.addEventListener('DOMContentLoaded', () => {
    
    // 1. Search input: detect typing
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearchInput);
    
    // 2. Search button: manual search
    document.getElementById('searchBtn').addEventListener('click', () => {
        const city = searchInput.value.trim();
        if (city) {
            fetchWeather(city);
            document.getElementById('searchDropdown').classList.remove('active');
        }
    });
    
    // 3. Press Enter in search box
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = searchInput.value.trim();
            if (city) {
                fetchWeather(city);
                document.getElementById('searchDropdown').classList.remove('active');
            }
        }
    });
    
    // 4. GPS button: get my location
    document.getElementById('locationBtn').addEventListener('click', getUserLocation);
    
    // 5. Click outside dropdown to close it
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            document.getElementById('searchDropdown').classList.remove('active');
        }
    });
    
    // 6. Auto-load default city (optional)
    // Uncomment next line to load weather on startup:
    // fetchWeather('London');
});