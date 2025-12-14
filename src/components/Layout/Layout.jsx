import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900 relative overflow-x-hidden">
      {/* Starry Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-stars opacity-40"></div>
        <div className="absolute inset-0 bg-twinkle opacity-20"></div>
      </div>

      {/* Navigation */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Main content */}
      <main className="flex-1 pt-20 pb-0 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
