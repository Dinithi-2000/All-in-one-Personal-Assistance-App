import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../UI/NavBar";
import api from "../../Lib/api";
import Swal from "sweetalert2";

// Dashboard Icons
const BookingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ServiceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const TaskIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const RatingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const EarningsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AvailabilityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Stat Card Component
const StatCard = ({ title, value, icon, onClick, buttonText = null }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center">
    {icon}
    <h4 className="text-xl font-semibold text-[#003366]">{title}</h4>
    <p className="text-3xl font-bold text-teal-500 my-2">{value}</p>
    {buttonText && (
      <button 
        onClick={onClick} 
        className="mt-4 bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
      >
        {buttonText}
      </button>
    )}
  </div>
);

// Activity Item Component
const ActivityItem = ({ title, time, status, statusColor }) => (
  <li className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-lg text-gray-800 font-medium">{title}</p>
        <span className={`inline-block px-2 py-1 text-xs rounded-full text-white bg-${statusColor}-500 mt-1`}>
          {status}
        </span>
      </div>
      <span className="text-sm text-gray-500">{time}</span>
    </div>
  </li>
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const counst = await api.get("/api/user/counts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        
        console.log(response.data);
        setUserData(response.data);
        localStorage.setItem("userData", JSON.stringify(response.data));
        
        // Set example stats (in a real app, these would come from the API)
        setStats({
          bookings: counst.data.myBookings || 0,
          services: counst.data.completedBookings || 0,
          pendingTasks: counst.data.pendingBookings || 0,
          rating: 4.8,
          earnings: response.data.earnings || 0,
          completedServices: counst.data.completedBookings || 0,
        });
        
        // Set example activities (in a real app, these would come from the API)
        if (response.data.isServiceProvider) {
          setActivities([
            { id: 1, title: "New Service Request - Cleaning", time: "2 hours ago", status: "New", statusColor: "blue" },
            { id: 2, title: "Payment Received - $120", time: "Yesterday", status: "Completed", statusColor: "green" },
            { id: 3, title: "Client Review - 5 Stars", time: "2 days ago", status: "Review", statusColor: "purple" },
            { id: 4, title: "Booking Confirmed - Home Tutor", time: "3 days ago", status: "Confirmed", statusColor: "teal" },
          ]);
        } else {
          setActivities([
            { id: 1, title: "Booked Cleaning Service", time: "1 day ago", status: "Confirmed", statusColor: "green" },
            { id: 2, title: "Payment for Plumbing Service", time: "3 days ago", status: "Paid", statusColor: "blue" },
            { id: 3, title: "Left Review for Electrician", time: "1 week ago", status: "Completed", statusColor: "teal" },
          ]);
        }
        
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // If error is unauthorized or token invalid, force logout
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
  
  // Sample Logout Function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/"); // Redirect to home
  };
  
  // Handle adding a new service
  const handleAddService = () => {
    navigate("/add-service");
  };
  
  // Handle viewing all bookings
  const handleViewBookings = () => {
    navigate("/my-bookings");
  };
  
  // Handle adding availability
  const handleManageAvailability = () => {
    navigate("/manage-availability");
  };
  
  // Handle viewing all services
  const handleViewServices = () => {
    navigate("/services");
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar handleLogout={handleLogout} user={userData}/>
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#003366]">
              Welcome back, {userData.firstName || "User"}!
            </h2>
            <p className="text-gray-600 mt-1">
              {userData.isServiceProvider 
                ? "Manage your services and bookings" 
                : "Find and book the services you need"}
            </p>
          </div>
        </div>
        
        {/* Stats Section - Different for providers and regular users */}
        {userData.isServiceProvider ? (
          // Service Provider Stats
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            />
            <StatCard 
              title="Rating" 
              value={stats.rating.toFixed(1)} 
              icon={<RatingIcon />}
            />
            <StatCard 
              title="Earnings" 
              value={`$${stats.earnings}`} 
              icon={<EarningsIcon />}
            />
            <StatCard 
              title="Availability" 
              value={userData.availability === "yes" ? "Active" : "Inactive"} 
              icon={<AvailabilityIcon />}
              onClick={handleManageAvailability}
              buttonText="Manage"
            />
          </div>
        ) : (
          // Regular User Stats
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="My Bookings" 
              value={stats.bookings} 
              icon={<BookingIcon />}
              onClick={handleViewBookings}
              buttonText="View History"
            />
            <StatCard 
              title="Completed Services" 
              value={stats.completedServices} 
              icon={<ServiceIcon />}
            />
            <StatCard 
              title="Pending Services" 
              value={stats.pendingTasks} 
              icon={<TaskIcon />}
            />
          </div>
        )}
        
        {/* Recent Activities Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold text-[#003366]">Recent Activities</h3>
            <button className="text-teal-500 hover:text-teal-600 font-medium">
              View All
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {activities.length > 0 ? (
              <ul>
                {activities.map(activity => (
                  <ActivityItem
                    key={activity.id}
                    title={activity.title}
                    time={activity.time}
                    status={activity.status}
                    statusColor={activity.statusColor}
                  />
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No recent activities to display
              </div>
            )}
          </div>
        </div>
        
        {/* Service Provider Quick Actions */}
        {userData.isServiceProvider && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-[#003366] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => navigate("/profile")}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Update Profile</span>
              </button>
              <button 
                onClick={handleManageAvailability}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Update Availability</span>
              </button>
              <button 
                onClick={() => navigate("/earnings")}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>View Earnings</span>
              </button>
              <button 
                onClick={() => navigate("/feedback")}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span>View Feedback</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Regular User Features */}
        {!userData.isServiceProvider && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-[#003366] mb-4">Popular Services</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Cleaning', 'Plumbing', 'Tutoring', 'Electrical'].map((service, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => navigate(`/services/${service.toLowerCase()}`)}
                >
                  <div className="h-36 bg-gray-200"></div>
                  <div className="p-4">
                    <h4 className="font-semibold text-lg text-[#003366]">{service}</h4>
                    <p className="text-gray-600 text-sm">Professional {service.toLowerCase()} services</p>
                    <button className="mt-2 text-teal-500 hover:text-teal-600 font-medium text-sm">
                      Browse Providers →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <button 
                onClick={() => navigate("/services")}
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-8 rounded-lg transition-colors duration-300"
              >
                View All Services
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;