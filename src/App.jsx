import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Films from "./pages/Films";
import FilmDetail from "./pages/FilmDetail";
import Planets from "./pages/Planets";
import PlanetDetail from "./pages/PlanetDetail";
import Starships from "./pages/Starships";
import StarshipDetail from "./pages/StarshipDetail";
import Characters from "./pages/Characters";
import CharacterDetail from "./pages/CharacterDetail";
import Home from "./components/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="films" element={<Films />} />
        <Route path="films/:id" element={<FilmDetail />} />
        <Route path="characters" element={<Characters />} />
        <Route path="characters/:id" element={<CharacterDetail />} />
        <Route path="planets" element={<Planets />} />
        <Route path="planets/:id" element={<PlanetDetail />} />
        <Route path="starships" element={<Starships />} />
        <Route path="starships/:id" element={<StarshipDetail />} />
      </Route>
    </Routes>
  );
}
