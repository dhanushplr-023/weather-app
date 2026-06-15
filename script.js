const apiKey = "8975e06709954cbdae4165044261506";

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

const weatherIcon =
document.getElementById("weatherIcon");

const loader =
document.getElementById("loader");

const forecastContainer =
document.getElementById("forecastContainer");

const historyList =
document.getElementById("historyList");

const dateTime =
document.getElementById("dateTime");

async function getWeather(city){

loader.classList.remove("hidden");

try{

const url =
`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;

const response =
await fetch(url);

const data =
await response.json();

if(data.error){

alert("City not found");
loader.classList.add("hidden");
return;
}

displayWeather(data);

saveHistory(city);

}
catch(error){

console.log(error);

}
finally{

loader.classList.add("hidden");

}

}

function displayWeather(data){

cityName.textContent =
data.location.name;

temperature.textContent =
`${data.current.temp_c}°C`;

description.textContent =
data.current.condition.text;

humidity.textContent =
`${data.current.humidity}%`;

wind.textContent =
`${data.current.wind_kph} km/h`;

weatherIcon.src =
"https:" +
data.current.condition.icon;

dateTime.textContent =
new Date().toLocaleString();

setBackground(
data.current.condition.text
);

showForecast(data);

}

function setBackground(condition){

document.body.className="";

condition =
condition.toLowerCase();

if(condition.includes("sun")){

document.body.classList.add(
"sunny"
);

}

else if(condition.includes("rain")){

document.body.classList.add(
"rainy"
);

}

else{

document.body.classList.add(
"cloudy"
);

}

}

function showForecast(data){

forecastContainer.innerHTML="";

data.forecast.forecastday.forEach(day=>{

const card =
document.createElement("div");

card.className =
"forecast-card";

card.innerHTML=`
<h4>
${day.date}
</h4>

<img src="https:${day.day.condition.icon}">

<p>
${day.day.avgtemp_c}°C
</p>
`;

forecastContainer.appendChild(card);

});

}

function saveHistory(city){

let history =
JSON.parse(
localStorage.getItem(
"history"
)
) || [];

if(!history.includes(city)){

history.unshift(city);

}

history =
history.slice(0,5);

localStorage.setItem(
"history",
JSON.stringify(history)
);

loadHistory();

}

function loadHistory(){

historyList.innerHTML="";

const history =
JSON.parse(
localStorage.getItem(
"history"
)
) || [];

history.forEach(city=>{

const li =
document.createElement("li");

li.textContent =
city;

li.onclick=()=>{

getWeather(city);

};

historyList.appendChild(li);

});

}

searchBtn.addEventListener(
"click",
()=>{

if(cityInput.value){

getWeather(
cityInput.value
);

}

}
);

cityInput.addEventListener(
"keydown",
(e)=>{

if(e.key==="Enter"){

getWeather(
cityInput.value
);

}

}
);

document
.getElementById("themeBtn")
.addEventListener(
"click",
()=>{

document.body.classList.toggle(
"dark"
);

}
);

document
.getElementById(
"locationBtn"
)
.addEventListener(
"click",
()=>{

navigator.geolocation
.getCurrentPosition(
position=>{

const lat =
position.coords.latitude;

const lon =
position.coords.longitude;

getWeather(
`${lat},${lon}`
);

}
);

}
);

loadHistory();