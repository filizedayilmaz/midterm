import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllFilms, searchFilms, getIdFromUrl } from "../services/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import SearchBar from "../components/UI/SearchBar";

export default function Films() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchFilms = async (query = "") => {
    setLoading(true);
    setError(null);

    try {
      const data = query ? await searchFilms(query) : await getAllFilms();
      setFilms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchFilms(query);
  };

  // Convert episode IDs to Roman numerals
  const toRoman = (num) => {
    const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    return roman[num - 1] || num;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-muted-200 mb-2">Films</h1>
          <p className="text-muted-400">
            Explore all the Star Wars films from the saga
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar
            placeholder="Search films by title..."
            onSearch={handleSearch}
          />
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Loading films..." />
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={() => fetchFilms(searchQuery)}
          />
        ) : films.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-400">
              No films found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {films.map((film, index) => (
              <Link
                key={film.url}
                to={`/films/${getIdFromUrl(film.url)}`}
                className="bg-dark-800 border border-dark-600 hover:border-dark-500 rounded-xl p-6 group transition-all hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Episode Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-dark-700 border border-dark-500 rounded-full text-sm text-muted-300">
                    Episode {toRoman(film.episode_id)}
                  </span>
                  <span className="text-muted-400 text-sm">
                    {film.release_date}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-muted-200 mb-3 group-hover:text-white transition-colors">
                  {film.title}
                </h2>

                {/* Info */}
                <div className="space-y-2 text-sm text-muted-400 mb-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-muted-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    <span>Director: {film.director}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-muted-400"
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
                    <span>{film.characters.length} Characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-muted-400"
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
                    <span>{film.planets.length} Planets</span>
                  </div>
                </div>

                {/* Opening Crawl Preview */}
                <p className="text-muted-400 text-sm line-clamp-3 italic">
                  {film.opening_crawl.replace(/\r\n|\r|\n/g, " ").slice(0, 150)}
                  ...
                </p>

                {/* View More */}
                <div className="mt-4 flex items-center text-muted-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
