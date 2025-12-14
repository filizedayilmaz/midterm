import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllPlanets, searchPlanets, getIdFromUrl } from "../services/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import SearchBar from "../components/UI/SearchBar";
import Pagination from "../components/UI/Pagination";

export default function Planets() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [climateFilter, setClimateFilter] = useState("all");

  const fetchPlanets = async (page = 1, query = "") => {
    setLoading(true);
    setError(null);

    try {
      const data = query
        ? await searchPlanets(query)
        : await getAllPlanets(page);
      setPlanets(data.results);
      setTotalCount(data.count);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanets(currentPage, searchQuery);
  }, [currentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchPlanets(1, query);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get unique climates for filter
  const climates = [
    "all",
    ...new Set(planets.flatMap((p) => p.climate?.split(", ") || [])),
  ];

  // Filter planets by climate
  const filteredPlanets = planets.filter((planet) => {
    if (climateFilter === "all") return true;
    return planet.climate?.toLowerCase().includes(climateFilter.toLowerCase());
  });

  // Format population
  const formatPopulation = (pop) => {
    if (pop === "unknown") return "Unknown";
    const num = parseInt(pop);
    if (isNaN(num)) return pop;
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
          <h1 className="text-4xl font-bold text-muted-200 mb-2">Planets</h1>
          <p className="text-muted-400">
            Explore the diverse worlds of the Star Wars universe ({totalCount}{" "}
            total)
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SearchBar
            placeholder="Search planets by name..."
            onSearch={handleSearch}
          />
          <select
            value={climateFilter}
            onChange={(e) => setClimateFilter(e.target.value)}
            className="bg-dark-700 border border-dark-500 rounded-lg px-4 py-3 text-muted-200 focus:outline-none focus:border-muted-400 transition-colors cursor-pointer"
          >
            <option value="all">All Climates</option>
            <option value="arid">Arid</option>
            <option value="temperate">Temperate</option>
            <option value="tropical">Tropical</option>
            <option value="frozen">Frozen</option>
            <option value="hot">Hot</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Loading planets..." />
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={() => fetchPlanets(currentPage, searchQuery)}
          />
        ) : filteredPlanets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-400">
              No planets found matching your criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlanets.map((planet, index) => (
                <Link
                  key={planet.url}
                  to={`/planets/${getIdFromUrl(planet.url)}`}
                  className="bg-dark-800 border border-dark-600 hover:border-dark-500 rounded-xl p-6 group transition-all hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Planet Icon */}
                  <div className="w-16 h-16 mx-auto mb-4 bg-dark-700 rounded-full flex items-center justify-center border border-dark-500 group-hover:border-muted-400 transition-colors">
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
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  {/* Name */}
                  <h2 className="text-xl font-bold text-muted-200 text-center mb-2 group-hover:text-white transition-colors">
                    {planet.name}
                  </h2>

                  {/* Badges */}
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-dark-600 text-muted-300 rounded-full capitalize">
                      {planet.climate}
                    </span>
                    <span className="text-xs px-2 py-1 bg-dark-600 text-muted-300 rounded-full capitalize">
                      {planet.terrain?.split(",")[0] || "Unknown"}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-dark-700 rounded-lg p-2 text-center">
                      <div className="text-muted-400 text-xs">Population</div>
                      <div className="text-muted-200">
                        {formatPopulation(planet.population)}
                      </div>
                    </div>
                    <div className="bg-dark-700 rounded-lg p-2 text-center">
                      <div className="text-muted-400 text-xs">Diameter</div>
                      <div className="text-muted-200">
                        {planet.diameter !== "unknown"
                          ? `${parseInt(planet.diameter).toLocaleString()} km`
                          : "Unknown"}
                      </div>
                    </div>
                    <div className="bg-dark-700 rounded-lg p-2 text-center">
                      <div className="text-muted-400 text-xs">Residents</div>
                      <div className="text-muted-200">
                        {planet.residents.length}
                      </div>
                    </div>
                    <div className="bg-dark-700 rounded-lg p-2 text-center">
                      <div className="text-muted-400 text-xs">Films</div>
                      <div className="text-muted-200">
                        {planet.films.length}
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
