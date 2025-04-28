import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Component/UI/NavBar";
import api from "Lib/api";
import Swal from "sweetalert2";

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const response = await api.get("/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        

        setUserData(response.data);
        localStorage.setItem("userData", JSON.stringify(response.data));
      } catch (error) {
        console.error("Failed to fetch user:", error);

        // If error is unauthorized or token invalid, force logout
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem("authToken");
          navigate("/signin");
        }
      }
    };

    fetchUserData();
  }, [navigate]);


  // Sample Logout Function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/"); // Redirect to home
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar handleLogout={handleLogout}  user={userData}/>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-[#003366]">Dashboard</h2>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h4 className="text-xl font-semibold text-[#003366]">Bookings</h4>
            <p className="text-3xl font-bold text-teal-500">{userData.bookings}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h4 className="text-xl font-semibold text-[#003366]">Services</h4>
            <p className="text-3xl font-bold text-teal-500">{userData.services}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h4 className="text-xl font-semibold text-[#003366]">Pending Tasks</h4>
            <p className="text-3xl font-bold text-teal-500">2</p>
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-[#003366]">Recent Activities</h3>
          <ul className="mt-4 space-y-4">
            <li className="flex justify-between">
              <span className="text-lg text-gray-700">Booking Confirmation #1</span>
              <span className="text-sm text-gray-500">2 days ago</span>
            </li>
            <li className="flex justify-between">
              <span className="text-lg text-gray-700">Service Request for Plumbing</span>
              <span className="text-sm text-gray-500">3 days ago</span>
            </li>
            <li className="flex justify-between">
              <span className="text-lg text-gray-700">Payment for Service #12</span>
              <span className="text-sm text-gray-500">1 week ago</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
