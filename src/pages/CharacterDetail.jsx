import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPersonById, fetchByUrl, getIdFromUrl } from "../services/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import {
  User,
  Film,
  Globe,
  Rocket,
  ArrowLeft,
  Activity,
  Info,
} from "lucide-react";

export default function CharacterDetail() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [films, setFilms] = useState([]);
  const [homeworld, setHomeworld] = useState(null);
  const [starships, setStarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetches character details on mount
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const characterData = await getPersonById(id);
        setCharacter(characterData);

        // Fetch homeworld
        if (characterData.homeworld) {
          const homeworldData = await fetchByUrl(characterData.homeworld);
          setHomeworld(homeworldData);
        }

        // Fetch first 5 films
        const filmPromises = characterData.films
          .slice(0, 5) // Limits to 5 items
          .map((url) => fetchByUrl(url));
        const filmData = await Promise.all(filmPromises); // Resolves all promises concurrently
        setFilms(filmData);

        // Fetch first 3 starships
        const starshipPromises = characterData.starships
          .slice(0, 3) // Limits to 3 items
          .map((url) => fetchByUrl(url));
        const starshipData = await Promise.all(starshipPromises);
        setStarships(starshipData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading character details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!character) return <ErrorMessage message="Character not found" />;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/characters"
          className="inline-flex items-center text-muted-400 hover:text-accent-amber transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Characters
        </Link>

        {/* Hero Section */}
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-8 mb-8 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <User className="w-64 h-64 text-accent-amber" />
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-accent-amber mb-4">
              {character.name}
            </h1>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-dark-700 border border-dark-500 rounded-full text-sm text-muted-300">
                Born: {character.birth_year}
              </span>
              <span className="px-3 py-1 bg-dark-700 border border-dark-500 rounded-full text-sm text-muted-300">
                Gender: {character.gender}
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Physical Attributes */}
          <div
            className="bg-dark-800 border border-dark-600 rounded-xl p-6 animate-fade-in hover:border-accent-amber/30 transition-colors"
            style={{ animationDelay: "0.1s" }}
          >
            <h3 className="text-xl font-bold text-muted-200 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent-amber" />
              Physical Attributes
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-dark-700 pb-2">
                <span className="text-muted-400">Height</span>
                <span className="text-muted-200">{character.height} cm</span>
              </div>
              <div className="flex justify-between border-b border-dark-700 pb-2">
                <span className="text-muted-400">Mass</span>
                <span className="text-muted-200">{character.mass} kg</span>
              </div>
              <div className="flex justify-between border-b border-dark-700 pb-2">
                <span className="text-muted-400">Hair Color</span>
                <span className="text-muted-200 capitalize">
                  {character.hair_color}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-400">Skin Color</span>
                <span className="text-muted-200 capitalize">
                  {character.skin_color}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info & Homeworld */}
          <div
            className="bg-dark-800 border border-dark-600 rounded-xl p-6 animate-fade-in hover:border-accent-amber/30 transition-colors"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-xl font-bold text-muted-200 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-accent-amber" />
              Other Information
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-muted-400 text-sm block mb-1">
                  Eye Color
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-dark-500"
                    style={{ backgroundColor: character.eye_color }}
                  ></span>
                  <span className="text-muted-200 capitalize">
                    {character.eye_color}
                  </span>
                </div>
              </div>

              {homeworld && (
                <div className="pt-2 border-t border-dark-700 mt-2">
                  <span className="text-muted-400 text-sm block mb-2">
                    Homeworld
                  </span>
                  <Link
                    to={`/planets/${getIdFromUrl(homeworld.url)}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-dark-700 rounded-lg hover:bg-dark-600 hover:text-accent-amber transition-colors text-muted-200"
                  >
                    <Globe className="w-4 h-4" />
                    {homeworld.name}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Films Section */}
        {films.length > 0 && (
          <div
            className="mb-8 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <h3 className="text-2xl font-bold text-muted-200 mb-4 border-l-4 border-accent-amber pl-3">
              Appears in Films
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {films.map((film) => (
                <Link
                  key={film.url}
                  to={`/films/${getIdFromUrl(film.url)}`}
                  className="bg-dark-800 border border-dark-600 hover:border-accent-amber p-4 rounded-xl transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-dark-700 rounded-full flex items-center justify-center group-hover:bg-accent-amber group-hover:text-dark-900 transition-colors">
                    <Film className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-muted-200 group-hover:text-white">
                      {film.title}
                    </h4>
                    <span className="text-sm text-muted-400">
                      Episode {film.episode_id}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Starships Section */}
        {starships.length > 0 && (
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <h3 className="text-2xl font-bold text-muted-200 mb-4 border-l-4 border-accent-amber pl-3">
              Piloted Starships
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {starships.map((ship) => (
                <Link
                  key={ship.url}
                  to={`/starships/${getIdFromUrl(ship.url)}`}
                  className="bg-dark-800 border border-dark-600 hover:border-accent-amber p-4 rounded-xl transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-dark-700 rounded-full flex items-center justify-center group-hover:bg-accent-amber group-hover:text-dark-900 transition-colors">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-muted-200 group-hover:text-white">
                      {ship.name}
                    </h4>
                    <span className="text-sm text-muted-400 capitalize">
                      {ship.starship_class}
                    </span>
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
