import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 flex items-center justify-center bg-dark-600 rounded-lg">
                <svg
                  className="w-5 h-5 text-muted-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-lg font-bold text-muted-200">
                STAR WARS WIKI
              </span>
            </Link>
            <p className="text-muted-400 text-sm">
              Explore the galaxy far, far away. Discover films, characters,
              planets, and starships from the Star Wars universe.
            </p>
          </div>

          {/* Data Source */}
          <div>
            <h3 className="text-muted-200 font-semibold mb-4">Data Source</h3>
            <p className="text-muted-400 text-sm mb-2">
              Powered by the Star Wars API (SWAPI)
            </p>
            <a
              href="https://swapi.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-300 hover:text-muted-200 transition-colors text-sm"
            >
              swapi.dev →
            </a>
          </div>
        </div>

        <div className="h-px bg-dark-600 my-6"></div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-400">
          <p>© 2025 Star Wars Wiki. All rights reserved.</p>
          <p>© Made by Eda Yılmaz</p>
        </div>
      </div>
    </footer>
  );
}
