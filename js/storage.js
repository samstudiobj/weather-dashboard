// Weather Dashboard — persistence layer.
// localStorage only: no DOM access, no network calls, no formatting.
// This module's one job is remembering what cities the user has searched.

const RECENT_SEARCHES_KEY = "weatherDashboard.recentSearches";
const MAX_RECENT_SEARCHES = 5;

export function getRecentSearches() {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((entry) => typeof entry === "string");
  } catch {
    return [];
  }
}

export function addRecentSearch(city) {
  const withoutDuplicate = getRecentSearches().filter(
    (entry) => entry.toLowerCase() !== city.toLowerCase()
  );
  const updated = [city, ...withoutDuplicate].slice(0, MAX_RECENT_SEARCHES);

  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Storage full or unavailable (e.g. some browsers' private mode).
    // The search itself already succeeded — remembering it is best-effort.
  }

  return updated;
}

export function getLastSearchedCity() {
  const recent = getRecentSearches();
  return recent.length > 0 ? recent[0] : null;
}
