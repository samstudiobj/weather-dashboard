// Weather Dashboard — data formatting layer.
// Pure data transformation only: no DOM access, no network calls. Turns
// the raw object api.js returns into display-ready strings (and an icon)
// so app.js never has to know how to round a number or map a weather
// code to text.

const WEATHER_CODE_TEXT = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with heavy hail",
};

const WEATHER_CODE_ICON = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  71: "🌨️",
  73: "🌨️",
  75: "❄️",
  80: "🌦️",
  81: "🌧️",
  82: "⛈️",
  95: "⛈️",
  96: "⛈️",
  99: "⛈️",
};

function describeWeatherCode(code) {
  return WEATHER_CODE_TEXT[code] || "Unknown conditions";
}

function iconForWeatherCode(code) {
  return WEATHER_CODE_ICON[code] || "🌡️";
}

function formatTemperature(value) {
  return `${Math.round(value)}°C`;
}

function formatPercent(value) {
  return `${Math.round(value)}%`;
}

function formatWindSpeed(value) {
  return `${Math.round(value)} km/h`;
}

export function formatWeatherForDisplay(data) {
  return {
    city: data.city,
    condition: describeWeatherCode(data.weatherCode),
    icon: iconForWeatherCode(data.weatherCode),
    temperature: formatTemperature(data.temperature),
    humidity: formatPercent(data.humidity),
    wind: formatWindSpeed(data.windSpeed),
    feelsLike: formatTemperature(data.feelsLike),
  };
}
