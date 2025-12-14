const BASE_URL = "https://swapi.dev/api";

// Helper function to extract ID from SWAPI URL
export function getIdFromUrl(url) {
  // Extracts ID from URL string
  const matches = url.match(/\/(\d+)\/$/);
  return matches ? matches[1] : null;
}

// Generic fetch function with error handling
async function fetchFromApi(endpoint) {
  // Generic fetch wrapper
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  return response.json();
}

// Fetch a resource directly by URL (for related resources)
export async function fetchByUrl(url) {
  // Fetches data from specific URL
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  return response.json();
}

// Films
export async function getAllFilms() {
  const data = await fetchFromApi("/films/");
  return data.results;
}

export async function getFilmById(id) {
  return fetchFromApi(`/films/${id}/`);
}

export async function searchFilms(query) {
  const data = await fetchFromApi(`/films/?search=${encodeURIComponent(query)}`);
  return data.results;
}

// People/Characters
export async function getAllPeople(page = 1) {
  return fetchFromApi(`/people/?page=${page}`);
}

export async function getPersonById(id) {
  return fetchFromApi(`/people/${id}/`);
}

export async function searchPeople(query) {
  const data = await fetchFromApi(`/people/?search=${encodeURIComponent(query)}`);
  return data.results;
}

// Planets
export async function getAllPlanets(page = 1) {
  return fetchFromApi(`/planets/?page=${page}`);
}

export async function getPlanetById(id) {
  return fetchFromApi(`/planets/${id}/`);
}

export async function searchPlanets(query) {
  const data = await fetchFromApi(`/planets/?search=${encodeURIComponent(query)}`);
  return data.results;
}

// Starships
export async function getAllStarships(page = 1) {
  return fetchFromApi(`/starships/?page=${page}`);
}

export async function getStarshipById(id) {
  return fetchFromApi(`/starships/${id}/`);
}

export async function searchStarships(query) {
  const data = await fetchFromApi(`/starships/?search=${encodeURIComponent(query)}`);
  return data.results;
}

// Vehicles
export async function getAllVehicles(page = 1) {
  return fetchFromApi(`/vehicles/?page=${page}`);
}

export async function getVehicleById(id) {
  return fetchFromApi(`/vehicles/${id}/`);
}

export async function searchVehicles(query) {
  const data = await fetchFromApi(`/vehicles/?search=${encodeURIComponent(query)}`);
  return data.results;
}

// Species
export async function getAllSpecies(page = 1) {
  return fetchFromApi(`/species/?page=${page}`);
}

export async function getSpeciesById(id) {
  return fetchFromApi(`/species/${id}/`);
}

export async function searchSpecies(query) {
  const data = await fetchFromApi(`/species/?search=${encodeURIComponent(query)}`);
  return data.results;
}
