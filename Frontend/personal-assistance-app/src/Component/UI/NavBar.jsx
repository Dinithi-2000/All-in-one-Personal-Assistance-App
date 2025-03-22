import React from "react";

const NavBar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            {/* Logo or Brand Name */}
            <div>
              <a href="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-gray-800 text-lg">
                  Aceternity UI
                </span>
              </a>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="/components"
                className="py-4 px-2 text-gray-800 font-semibold hover:text-purple-600 transition duration-300 relative group"
              >
                Components
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
              <a
                href="/templates"
                className="py-4 px-2 text-gray-800 font-semibold hover:text-purple-600 transition duration-300 relative group"
              >
                Templates (x86)
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
              <a
                href="/pricing"
                className="py-4 px-2 text-gray-800 font-semibold hover:text-purple-600 transition duration-300 relative group"
              >
                Pricing
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
              <a
                href="/showcase"
                className="py-4 px-2 text-gray-800 font-semibold hover:text-purple-600 transition duration-300 relative group"
              >
                Showcase
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
            </div>
          </div>

          {/* Right Side Links (e.g., Discord, Twitter, Search) */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="/discord"
              className="py-4 px-2 text-gray-800 font-semibold hover:text-purple-600 transition duration-300 relative group"
            >
              Discord
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
            <a
              href="/twitter"
              className="py-4 px-2 text-gray-800 font-semibold hover:text-purple-600 transition duration-300 relative group"
            >
              Twitter
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
            <a
              href="/search"
              className="py-4 px-2 text-gray-800 font-semibold hover:text-purple-600 transition duration-300 relative group"
            >
              Search Components
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
