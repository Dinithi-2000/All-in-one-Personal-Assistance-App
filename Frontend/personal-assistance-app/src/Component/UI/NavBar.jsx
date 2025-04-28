
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const NavBar = ({ handleLogout, user  }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const onLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out from your account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d9488', 
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout!',
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
        navigate("/");
      }
    });
  };

  return (
    <nav className="bg-white shadow-lg w-full">
      <div className="w-full mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center no-underline">
              <span className="font-semibold text-[#003366] text-2xl tracking-wide font-bold font-mono">
                SereniLux
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-[#003366] font-semibold hover:text-teal-500 transition duration-300 relative group no-underline"
              >
                <span>Home</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link
                to="/serviceselection"
                className="text-[#003366] font-semibold hover:text-teal-500 transition duration-300 relative group no-underline whitespace-nowrap"
              >
                <span>Service Providers</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link
                to="/serviceselection"
                className="text-[#003366] font-semibold hover:text-teal-500 transition duration-300 relative group no-underline whitespace-nowrap"
              >
                <span>Hire Service Provider</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link
                to="/my-bookings"
                className="text-[#003366] font-semibold hover:text-teal-500 transition duration-300 relative group no-underline whitespace-nowrap"
              >
                <span>My Bookings</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link
                to="/payment"
                className="text-[#003366] font-semibold hover:text-teal-500 transition duration-300 relative group no-underline"
              >
                <span>Payment</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/register-provider"
              className="py-2 px-4 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition duration-300 no-underline whitespace-nowrap"
            >
              Become A Service Provider
            </Link>
            {!user ? (
              <div className="animate-pulse h-10 w-24 bg-gray-200 rounded"></div>
            ) : (
              <Link to="/profile" className="flex items-center space-x-2">
                <img
                  src={user.profileImage || "/Images/person2.png"} 
                  className="w-10 h-10 rounded-full"
                  alt={user.firstName}
                />
                <span className="text-[#003366] font-semibold">{user.name}</span>
              </Link>
            )}

            <button
              onClick={onLogout}
              className="py-2 px-4 text-[#003366] font-semibold border border-teal-500 rounded-md hover:bg-teal-500 hover:text-white transition duration-300 whitespace-nowrap"
            >
              Log Out
            </button>
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#003366]">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <Link
              to="/"
              className="block py-2 px-4 text-[#003366] font-semibold hover:bg-teal-500 hover:text-white transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/serviceselection"
              className="block py-2 px-4 text-[#003366] font-semibold hover:bg-teal-500 hover:text-white transition duration-300"
            >
              Service Providers
            </Link>
            <Link
              to="/serviceselection"
              className="block py-2 px-4 text-[#003366] font-semibold hover:bg-teal-500 hover:text-white transition duration-300"
            >
              Hire Service Provider
            </Link>
            <Link
              to="/my-bookings"
              className="block py-2 px-4 text-[#003366] font-semibold hover:bg-teal-500 hover:text-white transition duration-300"
            >
              My Bookings
            </Link>
            <Link
              to="/payment"
              className="block py-2 px-4 text-[#003366] font-semibold hover:bg-teal-500 hover:text-white transition duration-300"
            >
              Payment
            </Link>
            <Link
              to="/register-provider"
              className="block py-2 px-4 bg-teal-500 text-white font-semibold hover:bg-teal-600 transition duration-300"
            >
              Become A Service Provider
            </Link>
            {user ? (
              <Link to="/profile" className="flex items-center space-x-2">
                <img
                  src={user.profile_pic || "/Images/person2.png"} 
                  className="w-10 h-10 rounded-full"
                  alt={user.firstName}
                />
                <span className="text-[#003366] font-semibold">
                  {user.firstName}
                </span>
                <span className="text-[#003366] font-semibold">
                  {user.lastName}
                </span>
              </Link>
            ) : (
              <div>Loading...</div> // or show a login link if user not loaded
            )}
            <button
              onClick={onLogout}
              className="block w-full text-left py-2 px-4 text-[#003366] font-semibold border border-teal-500 hover:bg-teal-500 hover:text-white transition duration-300"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;