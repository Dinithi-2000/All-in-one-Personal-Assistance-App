import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../UI/NavBar";
import api from "../../Lib/api";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

// Custom SVG Icons with Light Color Styling
const BookingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500 mx-auto mb-3 transition-transform hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ServiceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500 mx-auto mb-3 transition-transform hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const TaskIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500 mx-auto mb-3 transition-transform hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const RatingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-500 mx-auto mb-3 transition-transform hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const EarningsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500 mx-auto mb-3 transition-transform hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AvailabilityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500 mx-auto mb-3 transition-transform hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const MyBookingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500 mx-auto mb-3 transition-transform hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const CompletedServicesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500 mx-auto mb-3 transition-transform hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PendingServicesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500 mx-auto mb-3 transition-transform hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Stat Card Component with Light Glassmorphism Design
const StatCard = ({ title, value, icon, onClick, buttonText = null }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    const duration = 1000;
    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start === end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      className="relative bg-white/90 backdrop-blur-md border border-gray-200/50 p-6 rounded-3xl shadow-md hover:shadow-lg transition-all duration-500 flex flex-col items-center cursor-pointer group"
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/30 to-teal-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
      <div className="relative z-10">
        {icon}
        <h4 className="text-base font-semibold text-gray-800 tracking-tight">{title}</h4>
        <p className="text-3xl font-extrabold text-indigo-600 my-2">
          {title === "Earnings" ? `$${displayValue}` : displayValue}
          {title === "Rating" && <span className="text-sm text-gray-500 ml-1">/ 5</span>}
          {title === "Availability" && <span className="text-sm text-gray-500 ml-1 capitalize">{value.toLowerCase()}</span>}
        </p>
        {buttonText && (
          <motion.button 
            className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm py-2 px-4 rounded-full transition-all duration-300 shadow-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {buttonText}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Activity Item Component with Light Styling
const ActivityItem = ({ title, time, status, statusColor }) => (
  <motion.li 
    className="p-4 border-b border-gray-200/50 hover:bg-gray-100/50 transition-all duration-300 backdrop-blur-sm"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className={`h-3 w-3 rounded-full bg-${statusColor}-500 shadow-md`}></div>
        <div>
          <p className="text-sm font-medium text-gray-800 tracking-tight">{title}</p>
          <span className={`inline-block px-2 py-0.5 text-xs rounded-full text-white bg-${statusColor}-500 mt-1 font-medium`}>
            {status}
          </span>
        </div>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  </motion.li>
);

// Service Card Component for Carousel with Light Design
const ServiceCard = ({ name, image, onClick }) => (
  <motion.div 
    className="relative bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-3xl shadow-md hover:shadow-lg transition-all duration-500 overflow-hidden group"
    whileHover={{ scale: 1.05, rotate: 1 }}
    onClick={onClick}
  >
    <div className="relative">
      <img src={image} alt={name} className="h-52 w-full object-cover rounded-t-3xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-800/70 to-transparent rounded-t-3xl"></div>
      <div className="absolute bottom-4 left-4">
        <h4 className="font-semibold text-lg text-white tracking-tight">{name}</h4>
        <p className="text-sm text-gray-200">Professional {name.toLowerCase()} services</p>
      </div>
    </div>
    <div className="p-4">
      <button className="text-indigo-500 hover:text-indigo-600 font-medium text-sm flex items-center transition-colors duration-300">
        Browse Providers
        <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    bookings: 0,
    services: 0,
    pendingTasks: 0,
    rating: 0,
    earnings: 0,
    completedServices: 0,
  });
  const [activities, setActivities] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/signin");
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await api.get("/api/user/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const counts = await api.get("/api/user/counts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data);
        localStorage.setItem("userData", JSON.stringify(response.data));
        
        setStats({
          bookings: counts.data.myBookings || 0,
          services: counts.data.completedBookings || 0,
          pendingTasks: counts.data.pendingBookings || 1,
          rating: 4.8,
          earnings: response.data.earnings || 0,
          completedServices: counts.data.completedBookings || 0,
        });
        
        if (response.data.isServiceProvider) {
          setActivities([
            { id: 1, title: "New Service Request - Cleaning", time: "2 hours ago", status: "New", statusColor: "indigo" },
            { id: 2, title: "Payment Received - $120", time: "Yesterday", status: "Completed", statusColor: "teal" },
            { id: 3, title: "Client Review - 5 Stars", time: "2 days ago", status: "Review", statusColor: "pink" },
            { id: 4, title: "Booking Confirmed - Home Tutor", time: "3 days ago", status: "Confirmed", statusColor: "amber" },
          ]);
        } else {
          setActivities([
            { id: 1, title: "Booked Cleaning Service", time: "1 day ago", status: "Confirmed", statusColor: "teal" },
            { id: 2, title: "Payment for Elder Care Service", time: "3 days ago", status: "Paid", statusColor: "indigo" },
            { id: 3, title: "Left Review for Tutoring", time: "1 week ago", status: "Completed", statusColor: "yellow" },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem("authToken");
          navigate("/signin");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/");
  };

  const handleAddService = () => navigate("/add-service");
  const handleViewBookings = () => navigate("/my-bookings");
  const handleManageAvailability = () => navigate("/manage-availability");
  const handleViewServices = () => navigate("/services");

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 4);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 4) % 4);
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex justify-center items-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-gray-800 font-sans relative overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
      
      <div className="relative z-10">
        <NavBar handleLogout={handleLogout} user={userData} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pl-60">
          {/* Welcome Section with Profile */}
          <motion.div
            className="relative bg-white/90 backdrop-blur-md border border-gray-200/50 p-6 rounded-3xl shadow-md mb-8 flex flex-col md:flex-row md:items-center md:justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/20 to-teal-100/20 rounded-3xl"></div>
            <div className="relative flex items-center space-x-4 z-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                  Welcome back, {userData.firstName || "User"}!
                </h2>
                <p className="text-gray-600 mt-1 text-sm tracking-wide">
                  {userData.isServiceProvider 
                    ? "Manage your services with ease"
                    : "Discover services tailored for you"}
                </p>
              </div>
            </div>
            <motion.button
              className="mt-4 md:mt-0 bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm py-2 px-6 rounded-full shadow-md transition-all duration-300 z-10"
              whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(99, 102, 241, 0.3)" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/profile")}
            >
              View Profile
            </motion.button>
          </motion.div>

          {/* Overview Widget */}
          <motion.div
            className="bg-white/90 backdrop-blur-md border border-gray-200/50 p-6 rounded-3xl shadow-md mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800 tracking-tight">Booking Overview</h3>
              <p className="text-gray-600 text-sm mt-1 tracking-wide">Your key metrics at a glance</p>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
              <span className="flex items-center text-indigo-500 font-medium text-sm">
                <BookingIcon className="h-5 w-5 mr-2" /> Bookings: {stats.bookings}
              </span>
              <span className="flex items-center text-teal-500 font-medium text-sm">
                <ServiceIcon className="h-5 w-5 mr-2" /> Services: {stats.services}
              </span>
              <span className="flex items-center text-amber-500 font-medium text-sm">
                <TaskIcon className="h-5 w-5 mr-2" /> Pending: {stats.pendingTasks}
              </span>
            </div>
          </motion.div>

          {/* Stats Section */}
          {userData.isServiceProvider ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <StatCard 
                title="Bookings" 
                value={stats.bookings} 
                icon={<BookingIcon />}
                onClick={handleViewBookings}
                buttonText="View All"
              />
              <StatCard 
                title="Active Services" 
                value={stats.services} 
                icon={<ServiceIcon />}
                onClick={handleViewServices}
                buttonText="Manage Services"
              />
              <StatCard 
                title="Pending Tasks" 
                value={stats.pendingTasks} 
                icon={<TaskIcon />}
                onClick={() => navigate("/pending-tasks")}
              />
              <StatCard 
                title="Rating" 
                value={stats.rating.toFixed(1)} 
                icon={<RatingIcon />}
                onClick={() => navigate("/reviews")}
              />
              <StatCard 
                title="Earnings" 
                value={stats.earnings} 
                icon={<EarningsIcon />}
                onClick={() => navigate("/earnings")}
              />
              <StatCard 
                title="Availability" 
                value={userData.availability === "yes" ? "Active" : "Inactive"} 
                icon={<AvailabilityIcon />}
                onClick={handleManageAvailability}
                buttonText="Manage"
              />
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <StatCard 
                title="My Bookings" 
                value={stats.bookings} 
                icon={<MyBookingsIcon />}
                onClick={handleViewBookings}
                buttonText="View History"
              />
              <StatCard 
                title="Completed Services" 
                value={stats.completedServices} 
                icon={<CompletedServicesIcon />}
                onClick={() => navigate("/completed-services")}
              />
              <StatCard 
                title="Pending Services" 
                value={stats.pendingTasks} 
                icon={<PendingServicesIcon />}
                onClick={() => navigate("/pending-services")}
              />
            </motion.div>
          )}

          {/* Recent Activities Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 tracking-tight">Recent Activities</h3>
              <motion.button
                className="text-indigo-500 hover:text-indigo-600 font-medium text-sm flex items-center transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                onClick={() => navigate("/activities")}
              >
                View All
                <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
            
            <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-3xl shadow-md overflow-hidden">
              <AnimatePresence>
                {activities.length > 0 ? (
                  activities.slice(0, 3).map(activity => (
                    <ActivityItem
                      key={activity.id}
                      title={activity.title}
                      time={activity.time}
                      status={activity.status}
                      statusColor={activity.statusColor}
                    />
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No recent activities to display
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Service Provider Quick Actions */}
          {userData.isServiceProvider && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 tracking-tight">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.button
                  onClick={() => navigate("/profile")}
                  className="bg-white/90 backdrop-blur-md border border-gray-200/50 p-4 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-3"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-800 font-medium tracking-tight">Update Profile</span>
                </motion.button>
                <motion.button
                  onClick={handleManageAvailability}
                  className="bg-white/90 backdrop-blur-md border border-gray-200/50 p-4 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-3"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-800 font-medium tracking-tight">Update Availability</span>
                </motion.button>
                <motion.button
                  onClick={() => navigate("/earnings")}
                  className="bg-white/90 backdrop-blur-md border border-gray-200/50 p-4 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-3"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-800 font-medium tracking-tight">View Earnings</span>
                </motion.button>
                <motion.button
                  onClick={() => navigate("/feedback")}
                  className="bg-white/90 backdrop-blur-md border border-gray-200/50 p-4 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-3"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span className="text-gray-800 font-medium tracking-tight">View Feedback</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Regular User Features - Carousel */}
          {!userData.isServiceProvider && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 tracking-tight">Popular Services</h3>
              <div className="relative">
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  animate={{ x: `-${currentSlide * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {[
                    { 
                      name: "House Cleaning", 
                      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8Y2xlYW5pbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=80",
                      onClick: () => navigate("/services/cleaning")
                    },
                    { 
                      name: "Elder Care", 
                      image: "https://images.unsplash.com/photo-1601758003122-53c40e686a19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGNhcmVnaXZlciUyMGFzc2lzdGluZyUyMGVsZGVybHklMjB3b21hbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=80",
                      onClick: () => navigate("/services/plumbing")
                    },
                    { 
                      name: "Tutoring", 
                      image: "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHR1dG9yaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
                      onClick: () => navigate("/services/tutoring")
                    },
                    { 
                      name: "Pet Care", 
                      image: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGV0JTIwY2FyZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=80",
                      onClick: () => navigate("/services/electrical")
                    },
                  ].map((service, index) => (
                    <div key={index} className="w-full">
                      <ServiceCard name={service.name} image={service.image} onClick={service.onClick} />
                    </div>
                  ))}
                </motion.div>
                <motion.button
                  onClick={handlePrevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-md p-3 rounded-full shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeftIcon />
                </motion.button>
                <motion.button
                  onClick={handleNextSlide}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-md p-3 rounded-full shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRightIcon />
                </motion.button>
              </div>
              <div className="text-center mt-6">
                <motion.button
                  onClick={() => navigate("/services")}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-8 rounded-full shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(99, 102, 241, 0.3)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  View All Services
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;