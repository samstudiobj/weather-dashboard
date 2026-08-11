// Weather Dashboard — EN/FR language toggle.
// Same pattern as TaskFlow/luna-bistro: data-i18n attributes for static
// markup, plus t()/onLanguageChange() exports for dynamically-rendered
// strings used by app.js, api.js and weatherFormatter.js.

const translations = {
  en: {
    "header.subtitle": "Check the current weather for any city",
    "search.city_label": "City name",
    "search.placeholder": "Enter a city name...",
    "search.button": "Search",
    "recent.aria_label": "Recent searches",
    "recent.label": "Recent:",
    "idle.text": "Search for a city to see its current weather.",
    "loading.text": 'Loading weather for "{city}"...',
    "error.city_not_found": 'Could not find a city named "{city}".',
    "error.empty_city": "Please enter a city name.",
    "error.generic": "Something went wrong. Please try again.",
    "error.connection": "Unable to connect. Please check your internet connection and try again.",
    "detail.humidity": "Humidity",
    "detail.wind": "Wind",
    "detail.feels_like": "Feels like",
    "footer.text": "Weather data provided by Open-Meteo.",
    "lang_toggle.aria_label": "Switch language / Changer de langue",
    "weather.0": "Clear sky",
    "weather.1": "Mainly clear",
    "weather.2": "Partly cloudy",
    "weather.3": "Overcast",
    "weather.45": "Fog",
    "weather.48": "Depositing rime fog",
    "weather.51": "Light drizzle",
    "weather.53": "Moderate drizzle",
    "weather.55": "Dense drizzle",
    "weather.61": "Slight rain",
    "weather.63": "Moderate rain",
    "weather.65": "Heavy rain",
    "weather.71": "Slight snow",
    "weather.73": "Moderate snow",
    "weather.75": "Heavy snow",
    "weather.80": "Rain showers",
    "weather.81": "Moderate rain showers",
    "weather.82": "Violent rain showers",
    "weather.95": "Thunderstorm",
    "weather.96": "Thunderstorm with hail",
    "weather.99": "Thunderstorm with heavy hail",
    "weather.unknown": "Unknown conditions"
  },
  fr: {
    "header.subtitle": "Consultez la météo actuelle de n'importe quelle ville",
    "search.city_label": "Nom de la ville",
    "search.placeholder": "Entrez le nom d'une ville...",
    "search.button": "Rechercher",
    "recent.aria_label": "Recherches récentes",
    "recent.label": "Récentes :",
    "idle.text": "Recherchez une ville pour voir la météo actuelle.",
    "loading.text": 'Chargement de la météo pour « {city} »...',
    "error.city_not_found": 'Impossible de trouver une ville nommée « {city} ».',
    "error.empty_city": "Veuillez entrer un nom de ville.",
    "error.generic": "Une erreur s'est produite. Veuillez réessayer.",
    "error.connection": "Connexion impossible. Vérifiez votre connexion internet et réessayez.",
    "detail.humidity": "Humidité",
    "detail.wind": "Vent",
    "detail.feels_like": "Ressenti",
    "footer.text": "Données météo fournies par Open-Meteo.",
    "lang_toggle.aria_label": "Switch language / Changer de langue",
    "weather.0": "Ciel dégagé",
    "weather.1": "Généralement dégagé",
    "weather.2": "Partiellement nuageux",
    "weather.3": "Couvert",
    "weather.45": "Brouillard",
    "weather.48": "Brouillard givrant",
    "weather.51": "Bruine légère",
    "weather.53": "Bruine modérée",
    "weather.55": "Bruine dense",
    "weather.61": "Pluie faible",
    "weather.63": "Pluie modérée",
    "weather.65": "Pluie forte",
    "weather.71": "Neige faible",
    "weather.73": "Neige modérée",
    "weather.75": "Neige forte",
    "weather.80": "Averses de pluie",
    "weather.81": "Averses de pluie modérées",
    "weather.82": "Averses de pluie violentes",
    "weather.95": "Orage",
    "weather.96": "Orage avec grêle",
    "weather.99": "Orage avec forte grêle",
    "weather.unknown": "Conditions inconnues"
  }
};

const STORAGE_KEY = "weatherDashboard.lang";
const langChangeListeners = [];

export function currentLang() {
  return document.documentElement.lang === "fr" ? "fr" : "en";
}

export function t(key, vars) {
  const dict = translations[currentLang()];
  let value = dict && dict[key] !== undefined ? dict[key] : key;
  if (vars) {
    Object.keys(vars).forEach((k) => {
      value = value.replace(`{${k}}`, vars[k]);
    });
  }
  return value;
}

export function onLanguageChange(fn) {
  langChangeListeners.push(fn);
}

export function applyLanguage(lang) {
  const dict = translations[lang] || translations.en;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria-label");
    if (dict[key] !== undefined) el.setAttribute("aria-label", dict[key]);
  });

  document.documentElement.lang = lang;

  const langToggle = document.querySelector(".lang-toggle");
  if (langToggle) {
    langToggle.querySelectorAll("[data-lang-option]").forEach((opt) => {
      opt.classList.toggle("is-active", opt.getAttribute("data-lang-option") === lang);
    });
  }

  localStorage.setItem(STORAGE_KEY, lang);
  langChangeListeners.forEach((fn) => fn(lang));
}

const savedLang = localStorage.getItem(STORAGE_KEY) || "en";
applyLanguage(savedLang);

document.addEventListener("DOMContentLoaded", () => {
  const langToggle = document.querySelector(".lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      applyLanguage(currentLang() === "en" ? "fr" : "en");
    });
  }
});
