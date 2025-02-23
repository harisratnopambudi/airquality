const aqiValue = document.getElementById("aqiValue");
const aqiStatus = document.getElementById("aqiStatus");
const lastUpdate = document.getElementById("lastUpdate");
const locationElement = document.getElementById("location");
const body = document.body;

const API_KEY = "b5ff0398-6674-41f5-bcc1-b3ad6322dcc1";
const API_URL = "https://api.airvisual.com/v2/nearest_city";

const colorScheme = {
  good: { bg: "#E6F4D7", text: "#4CAF50", status: "Good" },
  moderate: { bg: "#FFF3C4", text: "#FFC107", status: "Moderate" },
  unhealthy1: {
    bg: "#FFE0B2",
    text: "#FF9800",
    status: "Unhealthy for Sensitive Groups",
  },
  unhealthy2: { bg: "#FFCDD2", text: "#F44336", status: "Unhealthy" },
  veryUnhealthy: { bg: "#E1BEE7", text: "#9C27B0", status: "Very Unhealthy" },
  hazardous: { bg: "#D7CCC8", text: "#795548", status: "Hazardous" },
};

let coords;

function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          coords = position.coords;
          resolve(coords);
        },
        (error) => reject(error)
      );
    }
  });
}

async function fetchAQI(coords) {
  const url = `${API_URL}?lat=${coords.latitude}&lon=${coords.longitude}&key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "success") {
      return {
        aqi: data.data?.current?.pollution?.aqius || 0,
        pm25: data.data?.current?.pollution?.pm25 || "N/A",
        city: data.data?.city || "Unknown",
        temperature: data.data?.current?.weather?.tp || "N/A",
        humidity: data.data?.current?.weather?.hu || "N/A",
        windSpeed: data.data?.current?.weather?.ws || 0,
        windDirection: data.data?.current?.weather?.wd || 0,
      };
    }
    throw new Error(data.data?.message || "API request failed");
  } catch (error) {
    throw new Error("Failed to fetch air quality data: " + error.message);
  }
}

function getWindDirection(degrees) {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index] || "N/A";
}

function updateDisplay(data) {
  const now = new Date();

  aqiValue.textContent = data.aqi.toString().padStart(3, "0");
  locationElement.textContent = data.city;
  lastUpdate.textContent = now.toLocaleTimeString();

  document.getElementById("pm25").textContent = data.pm25 ?? "N/A";
  document.getElementById("temperature").textContent =
    data.temperature ?? "N/A";
  document.getElementById("humidity").textContent = data.humidity ?? "N/A";
  document.getElementById("windSpeed").textContent =
    (data.windSpeed * 3.6).toFixed(1) ?? "N/A";
  document.getElementById("windDirection").textContent =
    getWindDirection(data.windDirection) ?? "N/A";

  document.getElementById(
    "windIcon"
  ).style.transform = `rotate(${data.windDirection}deg)`;

  updateColorsBasedOnAQI(data.aqi);
}

function updateColorsBasedOnAQI(aqi) {
  let scheme;
  if (aqi <= 50) scheme = colorScheme.good;
  else if (aqi <= 100) scheme = colorScheme.moderate;
  else if (aqi <= 150) scheme = colorScheme.unhealthy1;
  else if (aqi <= 200) scheme = colorScheme.unhealthy2;
  else if (aqi <= 300) scheme = colorScheme.veryUnhealthy;
  else scheme = colorScheme.hazardous;

  applyColors(scheme);
}

function applyColors(scheme) {
  body.style.backgroundColor = scheme.bg;
  aqiValue.style.color = scheme.text;
  aqiStatus.textContent = scheme.status;
  aqiStatus.style.color = scheme.text;
}

async function updateAQI() {
  try {
    const coordinates = await getLocation();
    const aqiData = await fetchAQI(coordinates);
    updateDisplay(aqiData);
  } catch (error) {
    aqiStatus.textContent = "Error: " + error.message;
    aqiStatus.style.color = "#F44336";
    console.error("Error:", error);

    document.querySelectorAll(".value, .weather-item span").forEach((el) => {
      el.textContent = "N/A";
    });
  }
}

setInterval(updateAQI, 600000);
updateAQI();
