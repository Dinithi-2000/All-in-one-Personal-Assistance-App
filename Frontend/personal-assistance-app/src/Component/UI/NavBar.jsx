import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const NavBar = () => {
  return (
    <nav className="bg-[#f5f5f5] shadow-lg w-full">
      {/* Soft-off-white background */}
      <div className="w-full mx-auto ">
        <div className="flex justify-between gap-x-40 pl-10">
          <div className="flex space-x-5 p-2 gap-x-24">
            {/* Logo or Brand Name */}
            <div className="space-x-2 ">
              <Link to="/" className="flex items-center py-4 px-2 no-underline">
                <span className="font-semibold text-[#003366] text-2xl tracking-wide font-bold font-mono ">
                  SereniLux
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x- gap-x-10">
              <Link
                to="/"
                className="py-4 px-2 text-[#003366] font-semibold hover:text-[#40E0D0] transition duration-300 relative group no-underline"
              >
                <span className="group-hover:bg-gradient-to-r group-hover:from-[#40E0D0] group-hover:via-[#9333ea] group-hover:to-[#40E0D0] group-hover:bg-clip-text group-hover:text-transparent">
                  Home
                </span>

                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#40E0D0] via-[#9333ea] to-[#40E0D0] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link
                to="/templates"
                className="py-4 px-2 text-[#003366] font-semibold hover:text-[#40E0D0] transition duration-300 relative group no-underline whitespace-nowrap"
              >
                <span className="group-hover:bg-gradient-to-r group-hover:from-[#40E0D0] group-hover:via-[#9333ea] group-hover:to-[#40E0D0] group-hover:bg-clip-text group-hover:text-transparent">
                  Service Providers
                </span>

                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#40E0D0] via-[#9333ea] to-[#40E0D0] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link
                to="/pricing"
                className="py-4 px-2 text-[#003366] font-semibold hover:text-[#40E0D0] transition duration-300 relative group no-underline whitespace-nowrap"
              >
                <span className="group-hover:bg-gradient-to-r group-hover:from-[#40E0D0] group-hover:via-[#9333ea] group-hover:to-[#40E0D0] group-hover:bg-clip-text group-hover:text-transparent">
                  Hire Service Provider
                </span>

                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#40E0D0] via-[#9333ea] to-[#40E0D0] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link
                to="/payment"
                className="py-4 px-2 text-[#003366] font-semibold hover:text-[#40E0D0] transition duration-300 relative group no-underline"
              >
                <span className="group-hover:bg-gradient-to-r group-hover:from-[#40E0D0] group-hover:via-[#9333ea] group-hover:to-[#40E0D0] group-hover:bg-clip-text group-hover:text-transparent">
                  Payment
                </span>

                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#40E0D0] via-[#9333ea] to-[#40E0D0] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </div>
          </div>

          {/* Right Side Links (e.g., Discord, Twitter, Search) */}
          <div className="hidden md:flex items-center space-x-8 gap-x-30">
            <Link
              to="/discord"
              className="py-2 px-4 bg-gradient-to-r from-[#40E0D0] to-[#00BFFF] text-white font-semibold rounded-md hover:bg-gradient-to-r hover:from-[#00BFFF] hover:to-[#40E0D0] transition duration-300 no-underline whitespace-nowrap"
            >
              Become A service Provider
            </Link>
            <Link
              to="/twitter"
              className="py-2 px-4  text-[#003366] font-semibold border-3 border-sky-500 rounded-md hover:text-[#40E0D0] transition duration-300 no-underline whitespace-nowrap block"
            >
              Log In
            </Link>
            <Link to="/showcase" className="flex items-center">
              <img
                src="/Images/person2.png"
                className="w-10 h-10 rounded-full"
                alt="Person"
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
