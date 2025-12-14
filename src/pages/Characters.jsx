import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllPeople, searchPeople, getIdFromUrl } from "../services/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import SearchBar from "../components/UI/SearchBar";
import Pagination from "../components/UI/Pagination";
import { User, Users } from "lucide-react";

export default function Characters() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCharacters = async (page = 1, query = "") => {
    setLoading(true);
    setError(null);

    try {
      const data = query ? await searchPeople(query) : await getAllPeople(page);
      setCharacters(data.results);
      setTotalCount(data.count);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters(currentPage, searchQuery);
  }, [currentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchCharacters(1, query);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-accent-amber mb-2">
            Characters
          </h1>
          <p className="text-muted-400">
            Meet the heroes and villains of the Star Wars universe ({totalCount}{" "}
            total)
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar
            placeholder="Search characters by name..."
            onSearch={handleSearch}
          />
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Loading characters..." />
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={() => fetchCharacters(currentPage, searchQuery)}
          />
        ) : characters.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-400">
              No characters found matching your search.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((character, index) => (
                <Link
                  key={character.url}
                  to={`/characters/${getIdFromUrl(character.url)}`}
                  className="bg-dark-800 border border-dark-600 hover:border-accent-amber/50 rounded-xl p-6 group transition-all hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Character Icon */}
                  <div className="w-16 h-16 mx-auto mb-4 bg-dark-700 rounded-full flex items-center justify-center border border-dark-500 group-hover:border-accent-amber transition-colors">
                    <User className="w-8 h-8 text-muted-400 group-hover:text-accent-amber transition-colors" />
                  </div>

                  {/* Name */}
                  <h2 className="text-xl font-bold text-muted-200 text-center mb-2 group-hover:text-accent-amber transition-colors">
                    {character.name}
                  </h2>

                  {/* Badges */}
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-dark-600 text-muted-300 rounded-full capitalize">
                      {character.gender}
                    </span>
                    <span className="text-xs px-2 py-1 bg-dark-600 text-muted-300 rounded-full capitalize">
                      {character.birth_year}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-dark-700 rounded-lg p-2 text-center">
                      <div className="text-muted-400 text-xs">Height</div>
                      <div className="text-muted-200">
                        {character.height !== "unknown"
                          ? `${character.height}cm`
                          : "Unknown"}
                      </div>
                    </div>
                    <div className="bg-dark-700 rounded-lg p-2 text-center">
                      <div className="text-muted-400 text-xs">Mass</div>
                      <div className="text-muted-200">
                        {character.mass !== "unknown"
                          ? `${character.mass}kg`
                          : "Unknown"}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {!searchQuery && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                hasNext={currentPage < totalPages}
                hasPrevious={currentPage > 1}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
