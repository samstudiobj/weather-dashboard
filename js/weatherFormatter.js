// Weather Dashboard — data formatting layer.
// Pure data transformation only: no DOM access, no network calls. Turns
// the raw object api.js returns into display-ready strings (and an icon)
// so app.js never has to know how to round a number or map a weather
// code to text.

import { t } from "./i18n.js";

const WEATHER_CODES = [
  0, 1, 2, 3, 45, 48, 51, 53, 55, 61, 63, 65, 71, 73, 75, 80, 81, 82, 95, 96, 99,
];

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
  return WEATHER_CODES.includes(code) ? t(`weather.${code}`) : t("weather.unknown");
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
