import { Film, Globe, Rocket, Users } from "lucide-react";

// Home component
export default function Home() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-12 pb-32 bg-transparent">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-muted-200 mb-8">
            Star Wars Wiki
          </h1>

          <div className="bg-dark-800/50 p-6 rounded-lg border border-dark-600 max-w-2xl mx-auto backdrop-blur-sm">
            <h3 className="text-accent-amber font-semibold mb-2">
              About the Universe
            </h3>
            <p className="text-muted-300">
              Star Wars depicts the adventures of characters "a long time ago in
              a galaxy far, far away", where humans and alien species co-exist
              with droids. Space travel is common, and the galaxy is caught in
              an eternal struggle between the light and dark sides of the Force.
            </p>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <a
            href="/films"
            className="group bg-dark-800 border border-dark-600 hover:border-accent-amber rounded-xl p-8 transition-all hover:-translate-y-1 flex flex-col items-center"
          >
            <Film className="w-16 h-16 mb-4 text-accent-amber" />
            <h2 className="text-2xl font-bold text-muted-200 mb-2 group-hover:text-white transition-colors">
              Films
            </h2>
            <p className="text-muted-400">The Saga</p>
          </a>

          <a
            href="/characters"
            className="group bg-dark-800 border border-dark-600 hover:border-accent-amber rounded-xl p-8 transition-all hover:-translate-y-1 flex flex-col items-center"
          >
            <Users className="w-16 h-16 mb-4 text-accent-amber" />
            <h2 className="text-2xl font-bold text-muted-200 mb-2 group-hover:text-white transition-colors">
              Characters
            </h2>
            <p className="text-muted-400">Heroes & Villains</p>
          </a>

          <a
            href="/planets"
            className="group bg-dark-800 border border-dark-600 hover:border-accent-amber rounded-xl p-8 transition-all hover:-translate-y-1 flex flex-col items-center"
          >
            <Globe className="w-16 h-16 mb-4 text-accent-amber" />
            <h2 className="text-2xl font-bold text-muted-200 mb-2 group-hover:text-white transition-colors">
              Planets
            </h2>
            <p className="text-muted-400">Worlds</p>
          </a>

          <a
            href="/starships"
            className="group bg-dark-800 border border-dark-600 hover:border-accent-amber rounded-xl p-8 transition-all hover:-translate-y-1 flex flex-col items-center"
          >
            <Rocket className="w-16 h-16 mb-4 text-accent-amber" />
            <h2 className="text-2xl font-bold text-muted-200 mb-2 group-hover:text-white transition-colors">
              Starships
            </h2>
            <p className="text-muted-400">Vehicles</p>
          </a>
        </div>
      </div>
    </div>
  );
}
