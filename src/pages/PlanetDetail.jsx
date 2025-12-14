import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPlanetById, fetchByUrl, getIdFromUrl } from "../services/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";

export default function PlanetDetail() {
  const { id } = useParams();
  const [planet, setPlanet] = useState(null);
  const [residents, setResidents] = useState([]);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format population
  const formatPopulation = (pop) => {
    if (pop === "unknown") return "Unknown";
    const num = parseInt(pop);
    if (isNaN(num)) return pop;
    return num.toLocaleString();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const planetData = await getPlanetById(id);
        setPlanet(planetData);

        // Fetch residents (first 8)
        if (planetData.residents.length > 0) {
          const residentPromises = planetData.residents
            .slice(0, 8)
            .map((url) => fetchByUrl(url));
          const residentData = await Promise.all(residentPromises);
          setResidents(residentData);
        }

        // Fetch films
        if (planetData.films.length > 0) {
          const filmPromises = planetData.films.map((url) => fetchByUrl(url));
          const filmData = await Promise.all(filmPromises);
          setFilms(filmData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading planet details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!planet) return <ErrorMessage message="Planet not found" />;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/planets"
          className="inline-flex items-center text-muted-400 hover:text-muted-200 transition-colors mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Planets
        </Link>

        {/* Hero Section */}
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-8 mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Planet Icon */}
            <div className="w-32 h-32 bg-dark-700 rounded-full flex items-center justify-center border-4 border-dark-500 flex-shrink-0">
              <svg
                className="w-16 h-16 text-muted-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-muted-200 mb-4">
                {planet.name}
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-dark-700 border border-dark-500 rounded-full text-sm text-muted-300 capitalize">
                  {planet.climate}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-dark-700 border border-dark-500 rounded-full text-sm text-muted-300 capitalize">
                  {planet.terrain?.split(",")[0]}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-muted-400">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-muted-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Population: {formatPopulation(planet.population)}
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-muted-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Diameter:{" "}
                  {planet.diameter !== "unknown"
                    ? `${parseInt(planet.diameter).toLocaleString()} km`
                    : "Unknown"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Physical Info */}
          <div
            className="bg-dark-800 border border-dark-600 rounded-xl p-6 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <h3 className="text-xl font-bold text-muted-200 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-muted-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Physical Properties
            </h3>
            <div className="space-y-4">
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="text-muted-400 text-sm mb-1">Climate</div>
                <div className="text-muted-200 capitalize">
                  {planet.climate}
                </div>
              </div>
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="text-muted-400 text-sm mb-1">Terrain</div>
                <div className="text-muted-200 capitalize">
                  {planet.terrain}
                </div>
              </div>
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="text-muted-400 text-sm mb-1">Surface Water</div>
                <div className="text-muted-200">
                  {planet.surface_water !== "unknown"
                    ? `${planet.surface_water}%`
                    : "Unknown"}
                </div>
              </div>
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="text-muted-400 text-sm mb-1">Gravity</div>
                <div className="text-muted-200">{planet.gravity}</div>
              </div>
            </div>
          </div>

          {/* Orbital Info */}
          <div
            className="bg-dark-800 border border-dark-600 rounded-xl p-6 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-xl font-bold text-muted-200 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-muted-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Orbital Properties
            </h3>
            <div className="space-y-4">
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="text-muted-400 text-sm mb-1">Diameter</div>
                <div className="text-muted-200">
                  {planet.diameter !== "unknown"
                    ? `${parseInt(planet.diameter).toLocaleString()} km`
                    : "Unknown"}
                </div>
              </div>
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="text-muted-400 text-sm mb-1">
                  Rotation Period
                </div>
                <div className="text-muted-200">
                  {planet.rotation_period !== "unknown"
                    ? `${planet.rotation_period} hours`
                    : "Unknown"}
                </div>
              </div>
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="text-muted-400 text-sm mb-1">
                  Orbital Period
                </div>
                <div className="text-muted-200">
                  {planet.orbital_period !== "unknown"
                    ? `${planet.orbital_period} days`
                    : "Unknown"}
                </div>
              </div>
              <div className="bg-dark-700 rounded-lg p-4">
                <div className="text-muted-400 text-sm mb-1">Population</div>
                <div className="text-muted-200">
                  {formatPopulation(planet.population)}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            className="bg-dark-800 border border-dark-600 rounded-xl p-6 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <h3 className="text-xl font-bold text-muted-200 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-muted-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-dark-700 rounded-lg">
                <div className="text-3xl font-bold text-muted-200">
                  {planet.residents.length}
                </div>
                <div className="text-muted-400 text-sm">Known Residents</div>
              </div>
              <div className="text-center p-4 bg-dark-700 rounded-lg">
                <div className="text-3xl font-bold text-muted-200">
                  {planet.films.length}
                </div>
                <div className="text-muted-400 text-sm">Film Appearances</div>
              </div>
            </div>
          </div>
        </div>

        {/* Residents Section */}
        {residents.length > 0 && (
          <div
            className="mb-8 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-muted-200">
                Notable Residents
              </h3>
              {planet.residents.length > 8 && (
                <span className="text-muted-400 text-sm">
                  Showing {residents.length} of {planet.residents.length}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {residents.map((resident) => (
                <Link
                  key={resident.url}
                  to={`/characters/${getIdFromUrl(resident.url)}`}
                  className="bg-dark-800 border border-dark-600 hover:border-dark-500 rounded-xl p-4 text-center transition-all group"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-dark-700 rounded-full flex items-center justify-center group-hover:bg-dark-600 transition-colors">
                    <svg
                      className="w-6 h-6 text-muted-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-muted-200 text-xs font-medium group-hover:text-white transition-colors truncate">
                    {resident.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Films Section */}
        {films.length > 0 && (
          <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <h3 className="text-2xl font-bold text-muted-200 mb-4">
              Film Appearances
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {films.map((film) => (
                <Link
                  key={film.url}
                  to={`/films/${getIdFromUrl(film.url)}`}
                  className="bg-dark-800 border border-dark-600 hover:border-dark-500 rounded-xl p-4 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-dark-700 rounded-lg flex items-center justify-center group-hover:bg-dark-600 transition-colors">
                      <svg
                        className="w-6 h-6 text-muted-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-muted-200 font-medium group-hover:text-white transition-colors">
                        {film.title}
                      </p>
                      <p className="text-muted-400 text-sm">
                        Episode {film.episode_id}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
