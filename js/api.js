// Weather Dashboard — API communication only.
// No DOM access and no UI state here; this module's only job is turning
// a city name into a plain weather data object, or throwing an Error with
// a user-friendly message that app.js can display as-is. Every technical
// failure (network errors, bad responses, unexpected data) is normalized
// here so no raw browser/network error text ever reaches the UI layer.

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const CONNECTION_ERROR_MESSAGE =
  "Unable to connect. Please check your internet connection and try again.";

// Marks the one failure that isn't a technical error — a valid search
// that legitimately found no matching city. Its message should reach
// the user unchanged; everything else gets collapsed into a generic,
// friendly connection message.
class NotFoundError extends Error {}

export async function fetchWeatherByCity(city) {
  try {
    return await getWeatherData(city);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new Error(CONNECTION_ERROR_MESSAGE);
  }
}

async function getWeatherData(city) {
  const geoResponse = await fetch(
    `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1`
  );

  if (!geoResponse.ok) {
    throw new Error("Geocoding request failed.");
  }

  const geoData = await geoResponse.json();
  const place = geoData.results && geoData.results[0];

  if (!place) {
    throw new NotFoundError(`Could not find a city named "${city}".`);
  }

  const forecastResponse = await fetch(
    `${FORECAST_URL}?latitude=${place.latitude}&longitude=${place.longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code`
  );

  if (!forecastResponse.ok) {
    throw new Error("Forecast request failed.");
  }

  const forecastData = await forecastResponse.json();
  const current = forecastData.current;

  if (!current) {
    throw new Error("Weather data is unavailable for this location.");
  }

  return {
    city: place.name,
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    feelsLike: current.apparent_temperature,
    weatherCode: current.weather_code,
  };
}
