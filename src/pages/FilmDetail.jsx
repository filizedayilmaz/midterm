import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getFilmById, fetchByUrl, getIdFromUrl } from "../services/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";

export default function FilmDetail() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Convert episode ID to Roman numeral
  const toRoman = (num) => {
    const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    return roman[num - 1] || num;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const filmData = await getFilmById(id);
        setFilm(filmData);

        // Fetch first 6 characters
        const characterPromises = filmData.characters
          .slice(0, 6)
          .map((url) => fetchByUrl(url));
        const characterData = await Promise.all(characterPromises);
        setCharacters(characterData);

        // Fetch first 4 planets
        const planetPromises = filmData.planets
          .slice(0, 4)
          .map((url) => fetchByUrl(url));
        const planetData = await Promise.all(planetPromises);
        setPlanets(planetData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading film details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!film) return <ErrorMessage message="Film not found" />;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/films"
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
          Back to Films
        </Link>

        {/* Hero Section */}
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-8 mb-8 animate-fade-in">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-dark-700 border border-dark-500 rounded-full text-sm text-muted-300 mb-4">
                Episode {toRoman(film.episode_id)}
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-muted-200 mb-2">
                {film.title}
              </h1>
              <p className="text-muted-400">Released: {film.release_date}</p>
            </div>
          </div>

          {/* Opening Crawl */}
          <div className="bg-dark-700 rounded-lg p-6 border border-dark-500">
            <h3 className="text-muted-200 font-semibold mb-4">Opening Crawl</h3>
            <p className="text-muted-400 leading-relaxed whitespace-pre-line italic">
              {film.opening_crawl}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Details Card */}
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Film Details
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-muted-400 text-sm">Director</span>
                <p className="text-muted-200">{film.director}</p>
              </div>
              <div>
                <span className="text-muted-400 text-sm">Producer(s)</span>
                <p className="text-muted-200">{film.producer}</p>
              </div>
              <div>
                <span className="text-muted-400 text-sm">Release Date</span>
                <p className="text-muted-200">{film.release_date}</p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-dark-700 rounded-lg">
                <div className="text-2xl font-bold text-muted-200">
                  {film.characters.length}
                </div>
                <div className="text-muted-400 text-sm">Characters</div>
              </div>
              <div className="text-center p-4 bg-dark-700 rounded-lg">
                <div className="text-2xl font-bold text-muted-200">
                  {film.planets.length}
                </div>
                <div className="text-muted-400 text-sm">Planets</div>
              </div>
              <div className="text-center p-4 bg-dark-700 rounded-lg">
                <div className="text-2xl font-bold text-muted-200">
                  {film.starships.length}
                </div>
                <div className="text-muted-400 text-sm">Starships</div>
              </div>
              <div className="text-center p-4 bg-dark-700 rounded-lg">
                <div className="text-2xl font-bold text-muted-200">
                  {film.vehicles.length}
                </div>
                <div className="text-muted-400 text-sm">Vehicles</div>
              </div>
            </div>
          </div>

          {/* Species Card */}
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Quick Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-400">Episode</span>
                <span className="text-muted-200 font-medium">
                  {toRoman(film.episode_id)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-400">Species Featured</span>
                <span className="text-muted-200 font-medium">
                  {film.species.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-400">Total Vehicles</span>
                <span className="text-muted-200 font-medium">
                  {film.vehicles.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Characters Section */}
        <div
          className="mb-8 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-muted-200">
              Featured Characters
            </h3>
            <Link
              to="/characters"
              className="text-muted-400 hover:text-muted-200 text-sm flex items-center gap-1"
            >
              View All
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {characters.map((character) => (
              <Link
                key={character.url}
                to={`/characters/${getIdFromUrl(character.url)}`}
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
                  {character.name}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Planets Section */}
        <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-muted-200">
              Featured Planets
            </h3>
            <Link
              to="/planets"
              className="text-muted-400 hover:text-muted-200 text-sm flex items-center gap-1"
            >
              View All
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {planets.map((planet) => (
              <Link
                key={planet.url}
                to={`/planets/${getIdFromUrl(planet.url)}`}
                className="bg-dark-800 border border-dark-600 hover:border-dark-500 rounded-xl p-4 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center group-hover:bg-dark-600 transition-colors">
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
                  </div>
                  <div>
                    <p className="text-muted-200 font-medium group-hover:text-white transition-colors">
                      {planet.name}
                    </p>
                    <p className="text-muted-400 text-sm">{planet.terrain}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
