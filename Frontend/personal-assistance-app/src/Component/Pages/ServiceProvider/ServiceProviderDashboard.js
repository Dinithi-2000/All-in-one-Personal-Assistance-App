import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../../Lib/api";

// Components for dashboard
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// UI Components
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  Star,
  User,
  Menu,
  X,
  Home,
  FileText,
  Book,
  MessageSquare,
  Bell,
  Settings,
  ChevronDown,
  Download,
  Search,
  Calendar as CalendarIcon,
  TrendingUp,
  Activity,
  Briefcase,
  Camera,
  Plus,
} from "lucide-react";

const ServiceProviderDashboard = () => {
  const navigate = useNavigate();

  // State variables
  const [serviceProvider, setServiceProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeframe, setTimeframe] = useState("weekly");
  const [notifications, setNotifications] = useState([]);
  const [reportTimeframe, setReportTimeframe] = useState("month");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken"); 

        const response = await api.get("/api/user/review/my-reviews", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        
        setReviews(response.data);

        // Calculate average rating
        if (response.data.length > 0) {
          const totalRating = response.data.reduce(
            (sum, review) => sum + review.starRate,
            0,
          );
          setAverageRating((totalRating / response.data.length).toFixed(1));
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load reviews");
        setLoading(false);
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fetch service provider data on component mount
  useEffect(() => {
    const fetchServiceProviderData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage

        const response = await api.get("/api/service-provider/get-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Store the data in state and localStorage
        setServiceProvider(response.data);
        localStorage.setItem(
          "serviceProviderData",
          JSON.stringify(response.data),
        );

        // Generate mock data based on real user
        generateMockData(response.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching service provider data:", err);
        setError("Failed to load your profile data. Please try again later.");
        setLoading(false);

        // Fallback to localStorage if API fails
        const cachedData = localStorage.getItem("serviceProviderData");
        if (cachedData) {
          setServiceProvider(JSON.parse(cachedData));
          generateMockData(JSON.parse(cachedData));
        }
      }
    };

    fetchServiceProviderData();

    // Mock notifications
    setNotifications([
      {
        id: 1,
        message: "New booking from Sarath Fonseka",
        time: "10 minutes ago",
        read: false,
      },
      {
        id: 2,
        message: "Payment received: Rs. 2,500",
        time: "2 hours ago",
        read: false,
      },
      {
        id: 3,
        message: "New review: 5 stars from Kumari Silva",
        time: "1 day ago",
        read: true,
      },
    ]);
  }, []);

  // Generate mock data based on the real service provider
  const [mockData, setMockData] = useState({
    recentBookings: [],
    earnings: [],
    clientDemographics: [],
    upcomingBookings: [],
    performanceMetrics: {},
    weeklyBookingData: [],
    clients: [],
    reviews: [],
  });

  const generateMockData = (provider) => {
    if (!provider) return;

    // Mock bookings data
    const recentBookings = [
      {
        id: 1,
        client: "Malini Fernando",
        date: "2025-05-02",
        duration: "3 hours",
        status: "Completed",
        amount: 2100,
      },
      {
        id: 2,
        client: "Sarath Perera",
        date: "2025-04-30",
        duration: "4 hours",
        status: "Completed",
        amount: 2800,
      },
      {
        id: 3,
        client: "Kumari Silva",
        date: "2025-04-25",
        duration: "2 hours",
        status: "Completed",
        amount: 1400,
      },
      {
        id: 4,
        client: "Nimal Dissanayake",
        date: "2025-04-20",
        duration: "3 hours",
        status: "Completed",
        amount: 2100,
      },
      {
        id: 5,
        client: "Chamari Jayasuriya",
        date: "2025-04-15",
        duration: "5 hours",
        status: "Completed",
        amount: 3500,
      },
    ];

    const upcomingBookings = [
      {
        id: 6,
        client: "Sarath Fonseka",
        date: "2025-05-10",
        time: "9:00 AM",
        duration: "3 hours",
        status: "Confirmed",
        clientId: 101,
      },
      {
        id: 7,
        client: "Malini Fernando",
        date: "2025-05-15",
        time: "2:00 PM",
        duration: "2 hours",
        status: "Pending",
        clientId: 102,
      },
      {
        id: 8,
        client: "Kumari Silva",
        date: "2025-05-20",
        time: "10:00 AM",
        duration: "4 hours",
        status: "Confirmed",
        clientId: 103,
      },
    ];

    // Monthly earnings for past 6 months
    const earnings = [
      { month: "Dec", earnings: 8500 },
      { month: "Jan", earnings: 12000 },
      { month: "Feb", earnings: 15500 },
      { month: "Mar", earnings: 14000 },
      { month: "Apr", earnings: 18900 },
      { month: "May", earnings: 9200 },
    ];

    // Client demographics
    const clientDemographics = [
      { name: "Age 60-70", value: 45 },
      { name: "Age 71-80", value: 30 },
      { name: "Age 81-90", value: 20 },
      { name: "Age 90+", value: 5 },
    ];

    // Performance metrics
    const performanceMetrics = {
      totalEarnings: earnings.reduce(
        (total, month) => total + month.earnings,
        0,
      ),
      completedBookings: recentBookings.length,
      averageRating: averageRating,
      newClients: 3,
      averageOrderValue: Math.round(
        recentBookings.reduce((sum, booking) => sum + booking.amount, 0) /
          recentBookings.length,
      ),
    };

    // Weekly booking data
    const weeklyBookingData = [
      { name: "Mon", bookings: 1 },
      { name: "Tue", bookings: 2 },
      { name: "Wed", bookings: 0 },
      { name: "Thu", bookings: 1 },
      { name: "Fri", bookings: 2 },
      { name: "Sat", bookings: 3 },
      { name: "Sun", bookings: 1 },
    ];

    // Clients
    const clients = [
      {
        id: 101,
        name: "Sarath Fonseka",
        age: 72,
        address: "23 Kandy Road, Colombo",
        phoneNumber: "+94 77 123 4567",
        caregiverNotes:
          "Needs assistance with mobility. Enjoys reading and classical music.",
        bookingHistory: [
          {
            id: 201,
            date: "2025-04-15",
            duration: "4 hours",
            status: "Completed",
          },
          {
            id: 202,
            date: "2025-04-22",
            duration: "3 hours",
            status: "Completed",
          },
          {
            id: 6,
            date: "2025-05-10",
            time: "9:00 AM",
            duration: "3 hours",
            status: "Confirmed",
          },
        ],
      },
      {
        id: 102,
        name: "Malini Fernando",
        age: 68,
        address: "45 Galle Road, Colombo 03",
        phoneNumber: "+94 71 234 5678",
        caregiverNotes:
          "Has diabetes and needs medication reminders. Enjoys watching TV and gardening.",
        bookingHistory: [
          {
            id: 203,
            date: "2025-04-01",
            duration: "3 hours",
            status: "Completed",
          },
          {
            id: 204,
            date: "2025-04-08",
            duration: "3 hours",
            status: "Completed",
          },
          {
            id: 7,
            date: "2025-05-15",
            time: "2:00 PM",
            duration: "2 hours",
            status: "Pending",
          },
        ],
      },
      {
        id: 103,
        name: "Kumari Silva",
        age: 75,
        address: "12 Nawala Road, Nugegoda",
        phoneNumber: "+94 76 345 6789",
        caregiverNotes:
          "Needs help with daily tasks. Enjoys playing cards and socializing.",
        bookingHistory: [
          {
            id: 205,
            date: "2025-04-10",
            duration: "2 hours",
            status: "Completed",
          },
          {
            id: 206,
            date: "2025-04-17",
            duration: "2 hours",
            status: "Completed",
          },
          {
            id: 8,
            date: "2025-05-20",
            time: "10:00 AM",
            duration: "4 hours",
            status: "Confirmed",
          },
        ],
      },
    ];

    // Reviews
    const reviews = [
      {
        id: 301,
        clientName: "Sarath Fonseka",
        date: "2025-04-17",
        rating: 5,
        comment:
          "Very caring and attentive. Always on time and goes above and beyond.",
      },
      {
        id: 302,
        clientName: "Malini Fernando",
        date: "2025-04-09",
        rating: 5,
        comment:
          "Excellent service. Very patient and understanding with my mother.",
      },
      {
        id: 303,
        clientName: "Kumari Silva",
        date: "2025-04-12",
        rating: 4,
        comment: "Great care provider. Would recommend to others.",
      },
      {
        id: 304,
        clientName: "Nimal Dissanayake",
        date: "2025-04-22",
        rating: 5,
        comment: "Professional and friendly. Made my father feel comfortable.",
      },
      {
        id: 305,
        clientName: "Chamari Jayasuriya",
        date: "2025-04-16",
        rating: 5,
        comment: "Reliable and trustworthy. Always communicates well.",
      },
    ];

    setMockData({
      recentBookings,
      upcomingBookings,
      earnings,
      clientDemographics,
      performanceMetrics,
      weeklyBookingData,
      clients,
      reviews,
    });
  };

  // Filter bookings based on search term
  const filteredBookings = useMemo(() => {
    if (!mockData.recentBookings) return [];

    return mockData.recentBookings.filter(
      (booking) =>
        booking.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.date.includes(searchTerm) ||
        booking.status.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, mockData.recentBookings]);

  // Generate PDF report function
  const generateReport = () => {
    // In a real implementation, we'd use jsPDF here
    alert(
      "Generating PDF report... This feature would download a PDF with all relevant statistics.",
    );
  };

  // Colors for the dashboard
  const COLORS = {
    primary: "#2563eb", // Blue
    secondary: "#8b5cf6", // Purple
    accent: "#f97316", // Orange
    success: "#10b981", // Green
    warning: "#f59e0b", // Amber
    error: "#ef4444", // Red
    gray: "#6b7280", // Gray
    lightGray: "#f3f4f6", // Light Gray
    pieColors: ["#2563eb", "#8b5cf6", "#f97316", "#10b981", "#f59e0b"],
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-700">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !serviceProvider) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 flex justify-center text-red-500">
            <X size={48} />
          </div>
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
            Connection Error
          </h2>
          <p className="mb-6 text-center text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white md:block">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-600">Project Name</h2>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-3 rounded-lg bg-blue-50 p-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-blue-100">
              {serviceProvider?.profilePhoto ? (
                <img
                  src={serviceProvider.profilePhoto}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-full w-full p-2 text-blue-500" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800">
                {serviceProvider?.name || "User"}
              </p>
              <p className="text-sm text-gray-500">
                {serviceProvider?.serviceType || "Elder Care"}
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-4 space-y-1 px-2">
          {[
            { name: "Dashboard", icon: <Home size={18} />, id: "dashboard" },
            { name: "Bookings", icon: <Calendar size={18} />, id: "bookings" },
            { name: "Reports", icon: <FileText size={18} />, id: "reports" },
            { name: "Clients", icon: <Users size={18} />, id: "clients" },
            { name: "Reviews", icon: <Star size={18} />, id: "reviews" },
            {
              name: "Messages",
              icon: <MessageSquare size={18} />,
              id: "messages",
            },
            { name: "Profile", icon: <User size={18} />, id: "profile" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 transition-colors ${
                activeTab === item.id
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "bookings" && "Bookings"}
              {activeTab === "reports" && "Reports"}
              {activeTab === "clients" && "Clients"}
              {activeTab === "reviews" && "Reviews & Ratings"}
              {activeTab === "messages" && "Messages"}
              {activeTab === "profile" && "Profile"}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell
                size={20}
                className="cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => alert("Notifications panel would open here")}
              />
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </div>

            {/* <div className="relative">
              <button
                className="flex items-center space-x-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                onClick={() => navigate("/profile")}
              >
                <span>Profile</span>
                <ChevronDown size={16} />
              </button>
            </div> */}
          </div>
        </header>

        <div className="p-4 md:p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Dashboard metrics */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total Revenue
                      </p>
                      <p className="mt-1 text-2xl font-bold text-gray-800">
                        Rs.{" "}
                        {mockData.performanceMetrics?.totalEarnings?.toLocaleString() ||
                          "0"}
                      </p>
                      <p className="mt-1 text-sm text-green-500">
                        +12% from last month
                      </p>
                    </div>
                    <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                      <DollarSign size={24} />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Completed Bookings
                      </p>
                      <p className="mt-1 text-2xl font-bold text-gray-800">
                        {mockData.performanceMetrics?.completedBookings || "0"}
                      </p>
                      <p className="mt-1 text-sm text-green-500">
                        +5% from last month
                      </p>
                    </div>
                    <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                      <Calendar size={24} />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Average Rating
                      </p>
                      <p className="mt-1 text-2xl font-bold text-gray-800">
                        {averageRating}
                      </p>
                      <p className="mt-1 flex items-center text-sm">
                        <Star
                          size={16}
                          className="mr-1 fill-yellow-400 text-yellow-400"
                        />
                        <Star
                          size={16}
                          className="mr-1 fill-yellow-400 text-yellow-400"
                        />
                        <Star
                          size={16}
                          className="mr-1 fill-yellow-400 text-yellow-400"
                        />
                        <Star
                          size={16}
                          className="mr-1 fill-yellow-400 text-yellow-400"
                        />
                        <Star
                          size={16}
                          className="mr-1 fill-yellow-400 text-yellow-400"
                        />
                      </p>
                    </div>
                    <div className="rounded-full bg-yellow-100 p-3 text-yellow-600">
                      <Star size={24} />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        New Clients
                      </p>
                      <p className="mt-1 text-2xl font-bold text-gray-800">
                        {mockData.performanceMetrics?.newClients || "0"}
                      </p>
                      <p className="mt-1 text-sm text-green-500">
                        +2 this month
                      </p>
                    </div>
                    <div className="rounded-full bg-green-100 p-3 text-green-600">
                      <Users size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Charts */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="col-span-2 rounded-lg bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">
                      Monthly Revenue
                    </h3>
                    <div className="flex space-x-2">
                      {["weekly", "monthly", "yearly"].map((period) => (
                        <button
                          key={period}
                          onClick={() => setTimeframe(period)}
                          className={`rounded-md px-3 py-1 text-sm ${
                            timeframe === period
                              ? "bg-blue-100 text-blue-600"
                              : "text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          {period.charAt(0).toUpperCase() + period.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={mockData.earnings}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => `Rs.${value}`}
                        />
                        <Tooltip
                          formatter={(value) => [`Rs.${value}`, "Revenue"]}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="earnings"
                          stroke={COLORS.primary}
                          strokeWidth={3}
                          dot={{
                            r: 6,
                            fill: COLORS.primary,
                            strokeWidth: 2,
                            stroke: "#fff",
                          }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-medium text-gray-800">
                    Client Demographics
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockData.clientDemographics}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {mockData.clientDemographics.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                COLORS.pieColors[
                                  index % COLORS.pieColors.length
                                ]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Percentage"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Upcoming Bookings and Weekly Stats */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">
                        Upcoming Bookings
                      </h3>
                      <button
                        className="rounded-md bg-blue-50 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100"
                        onClick={() => setActiveTab("bookings")}
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-4">
                      {mockData.upcomingBookings?.slice(0, 3).map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4 hover:border-blue-200 hover:bg-blue-50"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                              <User size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {booking.client}
                              </p>
                              <div className="flex items-center text-sm text-gray-500">
                                <CalendarIcon size={14} className="mr-1" />
                                <span>{booking.date}</span>
                                <Clock size={14} className="ml-3 mr-1" />
                                <span>{booking.time}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <span
                              className={`mr-2 rounded-full px-3 py-1 text-xs font-medium ${
                                booking.status === "Confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {booking.status}
                            </span>
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                              {booking.duration}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-medium text-gray-800">
                    Weekly Bookings
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={mockData.weeklyBookingData}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar
                          dataKey="bookings"
                          fill={COLORS.secondary}
                          radius={[4, 4, 0, 0]}
                          barSize={30}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* bookings */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h2 className="text-2xl font-bold text-gray-800">Bookings</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <button className="flex items-center space-x-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Calendar size={16} />
                    <span>Add Booking</span>
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-white shadow">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-sm font-medium text-gray-500">
                        <th className="whitespace-nowrap px-6 py-3">Client</th>
                        <th className="whitespace-nowrap px-6 py-3">Date</th>
                        <th className="whitespace-nowrap px-6 py-3">
                          Duration
                        </th>
                        <th className="whitespace-nowrap px-6 py-3">Status</th>
                        <th className="whitespace-nowrap px-6 py-3">Amount</th>
                        <th className="whitespace-nowrap px-6 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                          <tr
                            key={booking.id}
                            className="text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <td className="whitespace-nowrap px-6 py-4 font-medium">
                              {booking.client}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {booking.date}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {booking.duration}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                  booking.status === "Completed"
                                    ? "bg-green-100 text-green-700"
                                    : booking.status === "Cancelled"
                                      ? "bg-red-100 text-red-700"
                                      : booking.status === "Pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              Rs. {booking.amount.toLocaleString()}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <button className="mr-2 rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100">
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            No bookings found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-medium text-gray-800">
                  Upcoming Bookings
                </h3>
                <div className="space-y-4">
                  {mockData.upcomingBookings?.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm hover:border-blue-200 hover:bg-blue-50 md:flex-row md:items-center"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {booking.client}
                          </p>
                          <div className="flex flex-wrap items-center text-sm text-gray-500">
                            <CalendarIcon size={14} className="mr-1" />
                            <span>{booking.date}</span>
                            <Clock size={14} className="ml-3 mr-1" />
                            <span>{booking.time}</span>
                            <span className="ml-3">({booking.duration})</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center space-x-2 md:mt-0">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            booking.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedClientId(booking.clientId);
                            setActiveTab("clients");
                          }}
                          className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                        >
                          View Client
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <select
                      value={reportTimeframe}
                      onChange={(e) => setReportTimeframe(e.target.value)}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                  <button
                    onClick={generateReport}
                    className="flex items-center space-x-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <Download size={16} />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg bg-white p-6 shadow">
                  <h3 className="mb-6 text-lg font-medium text-gray-800">
                    Earnings Overview
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={mockData.earnings}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => `Rs.${value}`}
                        />
                        <Tooltip
                          formatter={(value) => [`Rs.${value}`, "Revenue"]}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="earnings"
                          stroke={COLORS.primary}
                          strokeWidth={3}
                          dot={{
                            r: 6,
                            fill: COLORS.primary,
                            strokeWidth: 2,
                            stroke: "#fff",
                          }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-blue-50 p-4">
                      <p className="text-sm font-medium text-gray-500">
                        Total Earnings
                      </p>
                      <p className="mt-1 text-2xl font-bold text-gray-800">
                        Rs.{" "}
                        {mockData.performanceMetrics?.totalEarnings?.toLocaleString() ||
                          "0"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4">
                      <p className="text-sm font-medium text-gray-500">
                        Average Order Value
                      </p>
                      <p className="mt-1 text-2xl font-bold text-gray-800">
                        Rs.{" "}
                        {mockData.performanceMetrics?.averageOrderValue?.toLocaleString() ||
                          "0"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow">
                  <h3 className="mb-6 text-lg font-medium text-gray-800">
                    Booking Statistics
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={mockData.weeklyBookingData}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar
                          dataKey="bookings"
                          fill={COLORS.secondary}
                          radius={[4, 4, 0, 0]}
                          barSize={30}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-purple-50 p-4">
                      <p className="text-sm font-medium text-gray-500">
                        Total Bookings
                      </p>
                      <p className="mt-1 text-2xl font-bold text-gray-800">
                        {mockData.performanceMetrics?.completedBookings || "0"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-yellow-50 p-4">
                      <p className="text-sm font-medium text-gray-500">
                        Avg. Hours/Booking
                      </p>
                      <p className="mt-1 text-2xl font-bold text-gray-800">
                        3.2
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-medium text-gray-800">
                  Key Performance Indicators
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col rounded-lg border border-gray-100 p-4">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <TrendingUp size={20} />
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                      Booking Acceptance Rate
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-800">98%</p>
                    <p className="mt-1 text-xs text-green-500">
                      +2% from last month
                    </p>
                  </div>

                  <div className="flex flex-col rounded-lg border border-gray-100 p-4">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <Activity size={20} />
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                      Service Hours
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-800">
                      56 hrs
                    </p>
                    <p className="mt-1 text-xs text-green-500">
                      +8 hrs from last month
                    </p>
                  </div>

                  <div className="flex flex-col rounded-lg border border-gray-100 p-4">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                      <Star size={20} />
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                      Customer Satisfaction
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-800">
                      4.8/5
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Same as last month
                    </p>
                  </div>

                  <div className="flex flex-col rounded-lg border border-gray-100 p-4">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <Briefcase size={20} />
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                      Repeat Clients
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-800">85%</p>
                    <p className="mt-1 text-xs text-green-500">
                      +5% from last month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "clients" && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Client Management
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search clients..."
                      className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <button className="flex items-center space-x-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Users size={16} />
                    <span>Add Client</span>
                  </button>
                </div>
              </div>

              {selectedClientId ? (
                // Client Detail View
                <div className="space-y-6">
                  {mockData.clients
                    .filter((client) => client.id === selectedClientId)
                    .map((client) => (
                      <div key={client.id}>
                        <div className="mb-4 flex items-center justify-between">
                          <button
                            onClick={() => setSelectedClientId(null)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                          >
                            <ChevronDown className="rotate-90" size={16} />
                            <span>Back to all clients</span>
                          </button>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow">
                          <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
                            <div className="flex items-center space-x-4">
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <User size={32} />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                  {client.name}
                                </h3>
                                <p className="text-gray-500">
                                  Age: {client.age}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                Schedule Service
                              </button>
                              <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Contact
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                              <h4 className="mb-3 text-lg font-medium text-gray-800">
                                Client Information
                              </h4>
                              <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                                <div className="flex items-start">
                                  <span className="w-32 flex-shrink-0 text-sm font-medium text-gray-500">
                                    Address
                                  </span>
                                  <span className="text-sm text-gray-800">
                                    {client.address}
                                  </span>
                                </div>
                                <div className="flex items-start">
                                  <span className="w-32 flex-shrink-0 text-sm font-medium text-gray-500">
                                    Phone
                                  </span>
                                  <span className="text-sm text-gray-800">
                                    {client.phoneNumber}
                                  </span>
                                </div>
                                <div className="flex items-start">
                                  <span className="w-32 flex-shrink-0 text-sm font-medium text-gray-500">
                                    Notes
                                  </span>
                                  <span className="text-sm text-gray-800">
                                    {client.caregiverNotes}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="mb-3 text-lg font-medium text-gray-800">
                                Booking History
                              </h4>
                              <div className="space-y-3">
                                {client.bookingHistory.map((booking) => (
                                  <div
                                    key={booking.id}
                                    className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm"
                                  >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div className="flex items-center space-x-2">
                                        <CalendarIcon
                                          size={16}
                                          className="text-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-800">
                                          {booking.date}
                                        </span>
                                      </div>
                                      <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                          booking.status === "Completed"
                                            ? "bg-green-100 text-green-700"
                                            : booking.status === "Cancelled"
                                              ? "bg-red-100 text-red-700"
                                              : booking.status === "Pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                      >
                                        {booking.status}
                                      </span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                      <span className="text-xs text-gray-500">
                                        Duration: {booking.duration}
                                      </span>
                                      {booking.time && (
                                        <span className="text-xs text-gray-500">
                                          Time: {booking.time}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                // Client List View
                <div className="rounded-lg bg-white shadow">
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b border-gray-200 text-left text-sm font-medium text-gray-500">
                          <th className="whitespace-nowrap px-6 py-3">Name</th>
                          <th className="whitespace-nowrap px-6 py-3">Age</th>
                          <th className="whitespace-nowrap px-6 py-3">Phone</th>
                          <th className="whitespace-nowrap px-6 py-3">
                            Last Service
                          </th>
                          <th className="whitespace-nowrap px-6 py-3">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {mockData.clients.map((client) => (
                          <tr
                            key={client.id}
                            className="text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <td className="whitespace-nowrap px-6 py-4 font-medium">
                              {client.name}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {client.age}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {client.phoneNumber}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {
                                client.bookingHistory.sort(
                                  (a, b) => new Date(b.date) - new Date(a.date),
                                )[0]?.date
                              }
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <button
                                onClick={() => setSelectedClientId(client.id)}
                                className="mr-2 rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100"
                              >
                                View
                              </button>
                              <button className="rounded bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">
                                Contact
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Reviews & Ratings
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 rounded-lg bg-blue-50 px-3 py-2">
                    <Star
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="font-medium text-gray-800">
                      {averageRating}
                    </span>
                    <span className="text-sm text-gray-500">/ 5</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    from {reviews.length} reviews
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                {reviews.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No reviews yet
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 overflow-hidden rounded-full">
                              {review.customerID.profile_pic ? (
                                <img
                                  src={review.customerID.profile_pic}
                                  alt={`${review.customerID.firstName} ${review.customerID.lastName}`}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                  <User size={20} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {review.customerID.firstName}{" "}
                                {review.customerID.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(review.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < review.starRate
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-3 text-gray-600">{review.review}</p>
                        <div className="mt-3 flex justify-end">
                          <button className="text-xs text-blue-600 hover:text-blue-800">
                            Reply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="flex h-full flex-col items-center justify-center p-10 text-center">
              <MessageSquare size={64} className="mb-4 text-blue-500" />
              <h3 className="mb-2 text-xl font-bold text-gray-800">
                Messages Coming Soon
              </h3>
              <p className="mb-6 max-w-md text-gray-600">
                We're working on implementing a messaging system to help you
                communicate with your clients more effectively.
              </p>
              <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
                Notify Me When Available
              </button>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Profile Settings
              </h2>

              <div className="rounded-lg bg-white p-6 shadow">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-blue-100">
                        {serviceProvider?.profilePhoto ? (
                          <img
                            src={serviceProvider.profilePhoto}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-full w-full p-4 text-blue-500" />
                        )}
                      </div>
                      <button className="absolute -bottom-2 -right-2 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700">
                        <Camera size={14} />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {serviceProvider?.name || "Your Name"}
                      </h3>
                      <p className="text-gray-500">
                        {serviceProvider?.serviceType || "Service Provider"}
                      </p>
                    </div>
                  </div>
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Save Changes
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-4 text-lg font-medium text-gray-800">
                      Personal Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={serviceProvider?.name || ""}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={serviceProvider?.email || ""}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          defaultValue={serviceProvider?.phoneNumber || ""}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <textarea
                          defaultValue={serviceProvider?.address || ""}
                          rows={3}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-4 text-lg font-medium text-gray-800">
                      Service Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Service Type
                        </label>
                        <select
                          defaultValue={serviceProvider?.serviceType || ""}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="">Select a service type</option>
                          <option value="Home Care">Home Care</option>
                          <option value="Nursing">Nursing</option>
                          <option value="Physiotherapy">Physiotherapy</option>
                          <option value="Elder Care">Elder Care</option>
                          <option value="Child Care">Child Care</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          defaultValue={
                            serviceProvider?.yearsOfExperience || ""
                          }
                          min="0"
                          max="50"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Hourly Rate (Rs.)
                        </label>
                        <input
                          type="number"
                          defaultValue={serviceProvider?.hourlyRate || ""}
                          min="0"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Availability
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun",
                          ].map((day) => (
                            <div
                              key={day}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={`day-${day}`}
                                defaultChecked={serviceProvider?.availability?.includes(
                                  day,
                                )}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label
                                htmlFor={`day-${day}`}
                                className="text-sm text-gray-700"
                              >
                                {day}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="mb-4 text-lg font-medium text-gray-800">
                    Professional Details
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        About Me
                      </label>
                      <textarea
                        defaultValue={serviceProvider?.bio || ""}
                        rows={4}
                        placeholder="Write a short bio describing your experience, specialties, and approach..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Qualifications
                      </label>
                      <div className="space-y-2">
                        {serviceProvider?.qualifications?.map(
                          (qualification, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="text"
                                defaultValue={qualification}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                              />
                              <button className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200">
                                <X size={16} />
                              </button>
                            </div>
                          ),
                        )}
                        <button className="mt-2 flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800">
                          <Plus size={16} />
                          <span>Add Qualification</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Certifications
                      </label>
                      <div className="space-y-2">
                        {serviceProvider?.certifications?.map(
                          (certification, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="text"
                                defaultValue={certification}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                              />
                              <button className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200">
                                <X size={16} />
                              </button>
                            </div>
                          ),
                        )}
                        <button className="mt-2 flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800">
                          <Plus size={16} />
                          <span>Add Certification</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="mb-4 text-lg font-medium text-gray-800">
                    Account Settings
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Change Password
                      </label>
                      <div className="space-y-2">
                        <input
                          type="password"
                          placeholder="Current Password"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Email Notifications
                        </p>
                        <p className="text-xs text-gray-500">
                          Receive emails about new bookings, reviews, and
                          messages
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          defaultChecked={serviceProvider?.emailNotifications}
                          className="peer sr-only"
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          SMS Notifications
                        </p>
                        <p className="text-xs text-gray-500">
                          Receive text messages for booking confirmations and
                          reminders
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          defaultChecked={serviceProvider?.smsNotifications}
                          className="peer sr-only"
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ServiceProviderDashboard;
