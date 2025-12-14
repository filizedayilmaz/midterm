import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getStarshipById, fetchByUrl, getIdFromUrl } from "../services/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";

export default function StarshipDetail() {
  const { id } = useParams();
  const [starship, setStarship] = useState(null);
  const [pilots, setPilots] = useState([]);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format credits
  const formatCredits = (cost) => {
    if (cost === "unknown") return "Unknown";
    const num = parseInt(cost);
    if (isNaN(num)) return cost;
    return num.toLocaleString();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const starshipData = await getStarshipById(id);
        setStarship(starshipData);

        // Fetch pilots
        if (starshipData.pilots.length > 0) {
          const pilotPromises = starshipData.pilots.map((url) =>
            fetchByUrl(url)
          );
          const pilotData = await Promise.all(pilotPromises);
          setPilots(pilotData);
        }

        // Fetch films
        if (starshipData.films.length > 0) {
          const filmPromises = starshipData.films.map((url) => fetchByUrl(url));
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

  if (loading) return <LoadingSpinner message="Loading starship details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!starship) return <ErrorMessage message="Starship not found" />;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/starships"
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
          Back to Starships
        </Link>

        {/* Hero Section */}
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-8 mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Starship Icon */}
            <div className="w-32 h-32 bg-dark-700 rounded-xl flex items-center justify-center border-4 border-dark-500 flex-shrink-0">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-muted-200 mb-2">
                {starship.name}
              </h1>
              <p className="text-muted-400 text-lg mb-4">{starship.model}</p>

              {/* Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-dark-700 border border-dark-500 rounded-full text-sm text-muted-300 capitalize">
                  {starship.starship_class}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-dark-700 border border-dark-500 rounded-full text-sm text-muted-300">
                  {starship.manufacturer.split(",")[0]}
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Cost: {formatCredits(starship.cost_in_credits)} credits
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Technical Specs */}
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Technical Specs
            </h3>
            <div className="space-y-3">
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-muted-400 text-sm">Length</div>
                <div className="text-muted-200">{starship.length} m</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-muted-400 text-sm">Hyperdrive Rating</div>
                <div className="text-muted-200">
                  {starship.hyperdrive_rating}
                </div>
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-muted-400 text-sm">MGLT</div>
                <div className="text-muted-200">{starship.MGLT}</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-muted-400 text-sm">Max Speed</div>
                <div className="text-muted-200">
                  {starship.max_atmosphering_speed}
                </div>
              </div>
            </div>
          </div>

          {/* Capacity */}
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Capacity
            </h3>
            <div className="space-y-3">
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-muted-400 text-sm">Crew</div>
                <div className="text-muted-200">{starship.crew}</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-muted-400 text-sm">Passengers</div>
                <div className="text-muted-200">{starship.passengers}</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-muted-400 text-sm">Cargo Capacity</div>
                <div className="text-muted-200">
                  {starship.cargo_capacity !== "unknown"
                    ? `${parseInt(starship.cargo_capacity).toLocaleString()} kg`
                    : "Unknown"}
                </div>
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-muted-400 text-sm">Consumables</div>
                <div className="text-muted-200 capitalize">
                  {starship.consumables}
                </div>
              </div>
            </div>
          </div>

          {/* General Info */}
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              General Info
            </h3>
            <div className="space-y-3">
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-muted-400 text-sm">Class</div>
                <div className="text-muted-200 capitalize">
                  {starship.starship_class}
                </div>
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-muted-400 text-sm">Manufacturer</div>
                <div className="text-muted-200 text-sm">
                  {starship.manufacturer}
                </div>
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-muted-400 text-sm">Cost</div>
                <div className="text-muted-200">
                  {formatCredits(starship.cost_in_credits)} credits
                </div>
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-muted-400 text-sm">Known Pilots</div>
                <div className="text-muted-200">{starship.pilots.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pilots Section */}
        {pilots.length > 0 && (
          <div
            className="mb-8 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <h3 className="text-2xl font-bold text-muted-200 mb-4">
              Known Pilots
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {pilots.map((pilot) => (
                <Link
                  key={pilot.url}
                  to={`/characters/${getIdFromUrl(pilot.url)}`}
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
                  <p className="text-muted-200 text-sm font-medium group-hover:text-white transition-colors truncate">
                    {pilot.name}
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
