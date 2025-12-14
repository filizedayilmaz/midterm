import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllStarships,
  searchStarships,
  getIdFromUrl,
} from "../services/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import SearchBar from "../components/UI/SearchBar";
import Pagination from "../components/UI/Pagination";

export default function Starships() {
  const [starships, setStarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [classFilter, setClassFilter] = useState("all");

  const fetchStarships = async (page = 1, query = "") => {
    setLoading(true);
    setError(null);

    try {
      const data = query
        ? await searchStarships(query)
        : await getAllStarships(page);
      setStarships(data.results);
      setTotalCount(data.count);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStarships(currentPage, searchQuery);
  }, [currentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchStarships(1, query);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter starships by class
  const filteredStarships = starships.filter((ship) => {
    if (classFilter === "all") return true;
    return ship.starship_class
      ?.toLowerCase()
      .includes(classFilter.toLowerCase());
  });

  // Format credits
  const formatCredits = (cost) => {
    if (cost === "unknown") return "Unknown";
    const num = parseInt(cost);
    if (isNaN(num)) return cost;
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-muted-200 mb-2">Starships</h1>
          <p className="text-muted-400">
            Browse the legendary ships of the Star Wars galaxy ({totalCount}{" "}
            total)
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SearchBar
            placeholder="Search starships by name..."
            onSearch={handleSearch}
          />
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-dark-700 border border-dark-500 rounded-lg px-4 py-3 text-muted-200 focus:outline-none focus:border-muted-400 transition-colors cursor-pointer"
          >
            <option value="all">All Classes</option>
            <option value="starfighter">Starfighter</option>
            <option value="cruiser">Cruiser</option>
            <option value="transport">Transport</option>
            <option value="destroyer">Destroyer</option>
            <option value="freighter">Freighter</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Loading starships..." />
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={() => fetchStarships(currentPage, searchQuery)}
          />
        ) : filteredStarships.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-400">
              No starships found matching your criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStarships.map((starship, index) => (
                <Link
                  key={starship.url}
                  to={`/starships/${getIdFromUrl(starship.url)}`}
                  className="bg-dark-800 border border-dark-600 hover:border-dark-500 rounded-xl p-6 group transition-all hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Ship Icon */}
                  <div className="w-16 h-16 mx-auto mb-4 bg-dark-700 rounded-lg flex items-center justify-center border border-dark-500 group-hover:border-muted-400 transition-colors">
                    <svg
                      className="w-8 h-8 text-muted-400"
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

                  {/* Name */}
                  <h2 className="text-xl font-bold text-muted-200 text-center mb-2 group-hover:text-white transition-colors">
                    {starship.name}
                  </h2>

                  {/* Model & Class */}
                  <p className="text-muted-400 text-sm text-center mb-2 truncate">
                    {starship.model}
                  </p>
                  <div className="flex justify-center mb-4">
                    <span className="text-xs px-2 py-1 bg-dark-600 text-muted-300 rounded-full capitalize">
                      {starship.starship_class}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-dark-700 rounded-lg p-2 text-center">
                      <div className="text-muted-400 text-xs">Cost</div>
                      <div className="text-muted-200">
                        {formatCredits(starship.cost_in_credits)} ₡
                      </div>
                    </div>
                    <div className="bg-dark-700 rounded-lg p-2 text-center">
                      <div className="text-muted-400 text-xs">Hyperdrive</div>
                      <div className="text-muted-200">
                        {starship.hyperdrive_rating}
                      </div>
                    </div>
                    <div className="bg-dark-700 rounded-lg p-2 text-center">
                      <div className="text-muted-400 text-xs">Crew</div>
                      <div className="text-muted-200">{starship.crew}</div>
                    </div>
                    <div className="bg-dark-700 rounded-lg p-2 text-center">
                      <div className="text-muted-400 text-xs">Passengers</div>
                      <div className="text-muted-200">
                        {starship.passengers}
                      </div>
                    </div>
                  </div>

                  {/* View More */}
                  <div className="mt-4 flex items-center justify-center text-muted-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
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
