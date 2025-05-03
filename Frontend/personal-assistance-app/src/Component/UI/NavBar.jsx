import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../Lib/api";

const NavBar = ({ handleLogout, user, forceUpdate }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Always get the latest value from localStorage directly
  const getUserData = () => {
    const stored = localStorage.getItem("userData");
    return stored ? JSON.parse(stored) : {};
  };

  // Get provider status directly from localStorage
  const isProvider = getUserData().isServiceProvider === true;

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

  // Always use the most up-to-date user data from localStorage
  const currentUser = getUserData();

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
   
               {!isProvider && (
              <Link
                to="/serviceselection"
                className="text-[#003366] font-semibold hover:text-teal-500 transition duration-300 relative group no-underline whitespace-nowrap"
              >
                <span>Hire Service Provider</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>)}
              
              {!isProvider && (
              <Link
                to="/my-bookings"
                className="text-[#003366] font-semibold hover:text-teal-500 transition duration-300 relative group no-underline whitespace-nowrap"
              >
                <span>My Bookings</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>)}
              
              {!isProvider && (
              <Link
                to="/payment"
                className="text-[#003366] font-semibold hover:text-teal-500 transition duration-300 relative group no-underline"
              >
                <span>Payment</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>)}
              
              {isProvider && (
              <Link
                to="/services"
                className="text-[#003366] font-semibold hover:text-teal-500 transition duration-300 relative group no-underline"
              >
                <span>Services</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>)}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!currentUser ? (
              <div className="animate-pulse h-10 w-24 bg-gray-200 rounded"></div>
            ) : (
              <Link to="/profile" className="flex items-center space-x-2">
                <img
                  src={currentUser.profile_pic || "/Images/person2.png"}
                  className="w-10 h-10 rounded-full"
                  alt={currentUser.firstName}
                />
                <span className="text-[#003366] font-semibold">
                  {currentUser.firstName}
                </span>
              </Link>
            )}

            <button
              onClick={onLogout}
              className="py-2 px-4 text-[#003366] font-semibold border border-teal-500 rounded-md hover:bg-teal-500 hover:text-white transition duration-300 whitespace-nowrap"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;