// Weather Dashboard — application flow only.
// Reads the form, drives the idle/loading/error/result states, and writes
// already-formatted data into the DOM. No fetch calls, no formatting math,
// and no direct localStorage access live here — api.js owns network
// communication, weatherFormatter.js owns display formatting, storage.js
// owns persisting recent searches.

import { fetchWeatherByCity } from "./api.js";
import { formatWeatherForDisplay } from "./weatherFormatter.js";
import {
  addRecentSearch,
  getRecentSearches,
  getLastSearchedCity,
} from "./storage.js";
import { t, onLanguageChange } from "./i18n.js";

const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const recentSearchesEl = document.getElementById("recent-searches");
const loadingMessage = document.getElementById("loading-message");

const states = {
  idle: document.getElementById("state-idle"),
  loading: document.getElementById("state-loading"),
  error: document.getElementById("state-error"),
  result: document.getElementById("state-result"),
};

// Tracks whether a search is currently in flight, so recent-search chips
// can be disabled too (not just the search button) — otherwise clicking
// a second chip before the first request resolves can let the earlier
// request's response land last and overwrite the newer one on screen.
let isSearching = false;
let lastWeatherData = null;

function showState(name) {
  Object.values(states).forEach((el) => el.classList.remove("is-active"));
  states[name].classList.add("is-active");
}

function showLoading(city) {
  loadingMessage.textContent = t("loading.text", { city });
  showState("loading");
}

function showError(message) {
  states.error.querySelector(".error-message").textContent = message;
  showState("error");
}

function renderResult(rawData) {
  lastWeatherData = rawData;
  const weather = formatWeatherForDisplay(rawData);
  const card = states.result;

  card.querySelector(".weather-card__icon").textContent = weather.icon;
  card.querySelector(".weather-card__city").textContent = weather.city;
  card.querySelector(".weather-card__condition").textContent =
    weather.condition;
  card.querySelector(".weather-card__temp").textContent = weather.temperature;

  const [humidity, wind, feelsLike] = card.querySelectorAll(".detail__value");
  humidity.textContent = weather.humidity;
  wind.textContent = weather.wind;
  feelsLike.textContent = weather.feelsLike;

  showState("result");
}

function renderRecentSearches() {
  const recent = getRecentSearches();
  recentSearchesEl.innerHTML = "";

  if (recent.length === 0) {
    recentSearchesEl.hidden = true;
    return;
  }

  recentSearchesEl.hidden = false;

  const label = document.createElement("span");
  label.className = "recent-searches__label";
  label.textContent = t("recent.label");
  recentSearchesEl.appendChild(label);

  recent.forEach((city) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "recent-searches__item";
    chip.textContent = city;
    chip.disabled = isSearching;
    chip.addEventListener("click", () => performSearch(city));
    recentSearchesEl.appendChild(chip);
  });
}

async function performSearch(city) {
  if (!city) {
    showError(t("error.empty_city"));
    return;
  }

  cityInput.value = city;
  isSearching = true;
  searchButton.disabled = true;
  cityInput.disabled = true;
  renderRecentSearches();
  showLoading(city);

  try {
    const weather = await fetchWeatherByCity(city);
    renderResult(weather);
    addRecentSearch(weather.city);
  } catch (error) {
    showError(error.message || t("error.generic"));
  } finally {
    isSearching = false;
    searchButton.disabled = false;
    cityInput.disabled = false;
    renderRecentSearches();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  performSearch(cityInput.value.trim());
});

renderRecentSearches();

onLanguageChange(() => {
  renderRecentSearches();
  if (lastWeatherData && states.result.classList.contains("is-active")) {
    renderResult(lastWeatherData);
  }
});

const lastCity = getLastSearchedCity();
if (lastCity) {
  performSearch(lastCity);
}
