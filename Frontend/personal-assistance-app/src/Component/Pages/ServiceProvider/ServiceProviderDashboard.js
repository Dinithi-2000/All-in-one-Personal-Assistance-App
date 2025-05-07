import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../../Lib/api";
import Swal from "sweetalert2";
import jsPDF from 'jspdf';
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
  Save,
  Loader,
  Edit,
} from "lucide-react";
import { Select, MenuItem, Chip, Box } from '@mui/material';

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
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({});
  const [isViewingProfile, setIsViewingProfile] = useState(false);

  const filteredBookings = useMemo(() => {
    if (!bookings || !Array.isArray(bookings)) return [];
    return bookings.filter((booking) => {
      const clientName = booking.customerDetails?.name?.toLowerCase() || "";
      const serviceName = booking.bookingService?.toLowerCase() || "";
      const appointmentDate = booking.bookingDate?.toLowerCase() || "";
      const duration = booking.agreementDuration?.toLowerCase() || "";
      const status = booking.status?.toLowerCase() || "";
      const paymentAmount = booking.monthlyPayment?.toString() || "";
      const searchTermLower = searchTerm.toLowerCase();
      
      return (
        clientName.includes(searchTermLower) ||
        serviceName.includes(searchTermLower) ||
        appointmentDate.includes(searchTermLower) ||
        duration.includes(searchTermLower) ||
        status.includes(searchTermLower) ||
        paymentAmount.includes(searchTermLower)
      );
    });
  }, [searchTerm, bookings]);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      try {
        const response = await api.post(
          "/api/service-provider/bookings/my-bookings",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setBookings(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch bookings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const formatStatus = (status) => {
    return status ? status.charAt(0) + status.slice(1).toLowerCase() : "";
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await api.get("/api/service-provider/review/my-reviews", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReviews(response.data);
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

  useEffect(() => {
    const fetchServiceProviderData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await api.get("/api/service-provider/get-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setServiceProvider(response.data);
        setFormData(response.data);
        localStorage.setItem(
          "serviceProviderData",
          JSON.stringify(response.data),
        );
        generateMockData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching service provider data:", err);
        setError("Failed to load your profile data. Please try again later.");
        setLoading(false);
        const cachedData = localStorage.getItem("serviceProviderData");
        if (cachedData) {
          setServiceProvider(JSON.parse(cachedData));
          generateMockData(JSON.parse(cachedData));
        }
      }
    };
    fetchServiceProviderData();
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
    const earnings = [
      { month: "Dec", earnings: 8500 },
      { month: "Jan", earnings: 12000 },
      { month: "Feb", earnings: 15500 },
      { month: "Mar", earnings: 14000 },
      { month: "Apr", earnings: 18900 },
      { month: "May", earnings: 9200 },
    ];
    const clientDemographics = [
      { name: "Age 60-70", value: 45 },
      { name: "Age 71-80", value: 30 },
      { name: "Age 81-90", value: 20 },
      { name: "Age 90+", value: 5 },
    ];
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
    const weeklyBookingData = [
      { name: "Mon", bookings: 1 },
      { name: "Tue", bookings: 2 },
      { name: "Wed", bookings: 0 },
      { name: "Thu", bookings: 1 },
      { name: "Fri", bookings: 2 },
      { name: "Sat", bookings: 3 },
      { name: "Sun", bookings: 1 },
    ];
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
    setMockData({
      recentBookings,
      upcomingBookings,
      earnings,
      clientDemographics,
      performanceMetrics,
      weeklyBookingData,
      clients,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteProfile = async() => {
    const token = localStorage.getItem("authToken");
    Swal.fire({
         title: 'Are you sure?',
         text: "This account will be permanently deleted.",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#0d9488', 
         cancelButtonColor: '#d33',
         confirmButtonText: 'Yes, Delete!',
       }).then(async (result) => {
         if (result.isConfirmed) {
           try {
             const res = await api.delete(`/api/service-provider/delete-user-account`,
               {
                 headers: { Authorization: `Bearer ${token}` },
               });
             if(res.status == 200){
               Swal.fire('Deleted!', 'Your account has been deleted.', 'success');
               handleLogout();
             }
           } catch (error) {
             console.error("Account deletion failed:", error);
             Swal.fire('Error!', 'There was a problem deleting your account.', 'error');
           }
         }
       });
  }

  const handleLogout = () => {
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
            localStorage.removeItem("authToken");
            localStorage.removeItem("serviceProviderData");
            localStorage.removeItem("serviceProviderProfile");
            localStorage.removeItem("userRole");
            navigate("/");
          }
        });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field]) ? [...prev[field], value] : [value],
    }));
  };

  const handleRemoveArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const token = localStorage.getItem("authToken");
      const response = await api.put(
        "/api/service-provider/update-user",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setServiceProvider(response.data);
      setFormData(response.data);
      setUpdating(false);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile has been updated successfully.',
        confirmButtonColor: '#0d9488',
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setUpdating(false);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update profile. Please try again.',
        confirmButtonColor: '#0d9488',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFillColor(33, 150, 243);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Booking Report", 105, 20, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, 40);
    doc.text(`Total Bookings: ${filteredBookings.length}`, 10, 50);
    let yPos = 70;
    const tableHeaders = ["Client", "Service", "Date", "Duration", "Status", "Payment"];
    const columnWidths = [35, 35, 30, 25, 25, 30];
    const totalTableWidth = columnWidths.reduce((sum, width) => sum + width, 0);
    const tableStartX = (210 - totalTableWidth) / 2;
    doc.setFillColor(200, 220, 255);
    doc.rect(tableStartX, yPos - 8, totalTableWidth, 10, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    let xPos = tableStartX;
    tableHeaders.forEach((header, index) => {
      doc.text(header, xPos + columnWidths[index]/2, yPos, { align: 'center' });
      xPos += columnWidths[index];
    });
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.3);
    doc.line(tableStartX, yPos - 8, tableStartX + totalTableWidth, yPos - 8);
    doc.line(tableStartX, yPos + 2, tableStartX + totalTableWidth, yPos + 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    filteredBookings.forEach((booking, index) => {
      yPos += 10;
      if (yPos > 270) {
        doc.addPage();
        yPos = 40;
        doc.setFillColor(200, 220, 255);
        doc.rect(tableStartX, yPos - 8, totalTableWidth, 10, "F");
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        let headerX = tableStartX;
        tableHeaders.forEach((header, idx) => {
          doc.text(header, headerX + columnWidths[idx]/2, yPos, { align: 'center' });
          headerX += columnWidths[idx];
        });
        doc.line(tableStartX, yPos - 8, tableStartX + totalTableWidth, yPos - 8);
        doc.line(tableStartX, yPos + 2, tableStartX + totalTableWidth, yPos + 2);
      }
      if (index % 2 === 0) {
        doc.setFillColor(240, 244, 255);
        doc.rect(tableStartX, yPos - 8, totalTableWidth, 10, "F");
      }
      const rowData = [
        booking.customerDetails?.name || "N/A",
        booking.bookingService || "N/A",
        booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "N/A",
        booking.agreementDuration || "N/A",
        formatStatus(booking.status),
        `Rs. ${booking.monthlyPayment?.toLocaleString('en-IN') || "0"}`,
      ];
      xPos = tableStartX;
      rowData.forEach((cell, cellIndex) => {
        doc.setTextColor(0, 0, 0);
        if (cellIndex === 4) {
          const status = cell.toLowerCase();
          if (status === "completed") {
            doc.setTextColor(34, 139, 34);
          } else if (status === "pending") {
            doc.setTextColor(255, 165, 0);
          } else if (status === "cancelled") {
            doc.setTextColor(255, 0, 0);
          }
        }
        if (cellIndex === 5) {
          doc.text(cell, xPos + columnWidths[cellIndex] - 2, yPos, { align: 'right' });
        } else {
          doc.text(cell, xPos + columnWidths[cellIndex]/2, yPos, { 
            align: 'center',
            maxWidth: columnWidths[cellIndex] - 4
          });
        }
        xPos += columnWidths[cellIndex];
      });
      xPos = tableStartX;
      for (let i = 0; i <= columnWidths.length; i++) {
        doc.line(xPos, yPos - 8, xPos, yPos + 2);
        if (i < columnWidths.length) xPos += columnWidths[i];
      }
      doc.line(tableStartX, yPos + 2, tableStartX + totalTableWidth, yPos + 2);
    });
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, 190, 285, { align: 'right' });
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 287, 190, 287);
    }
    doc.save(`bookings-report-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const COLORS = {
    primary: "#2563eb",
    secondary: "#8b5cf6",
    accent: "#f97316",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    gray: "#6b7280",
    lightGray: "#f3f4f6",
    pieColors: ["#2563eb", "#8b5cf6", "#f97316", "#10b981", "#f59e0b"],
  };

  // Updated getServicesOffered function
const getServicesOffered = (serviceType) => {
  switch (serviceType) {
    case 'PetCare':
      return ['Walking', 'Day Care', 'Overnight Sitting', 'Training', 'Grooming', 'Transportation'];
    case 'ChildCare':
      return ['Day Care', 'After School Care', 'Nannies', 'Baby Sitters', 'In-Home Care', 'Childminders'];
    case 'HouseCleaning':
      return ['Bathroom Cleaning', 'Carpet Cleaning', 'Kitchen Cleaning', 'Laundry', 'Windows Cleaning'];
    case 'KitchenHelpers':
      return ['Birthday', 'Family Reunion', 'Friends Gathering', 'Alms Giving', 'Foodie Adventure', 'Other'];
    case 'ElderCare':
      return ['Personal Care', 'Transportation', 'Specialized Care', 'Household Tasks', 'Hospice Care', 'Nursing and Health Care'];
    default:
      return [];
  }
};
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

  const ProfileView = ({ provider }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-600 p-10 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="relative group">
            <div className="h-36 w-36 rounded-full bg-indigo-100 overflow-hidden ring-4 ring-white/90 transition-transform duration-500 group-hover:ring-indigo-300 group-hover:scale-105">
              {provider?.photo ? (
                <img
                  src={provider.photo}
                  alt="Profile"
                  className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                />
              ) : (
                <User className="h-full w-full p-8 text-indigo-300 opacity-80" />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">{provider?.name || "Your Name"}</h2>
            <p className="mt-3 text-lg font-medium text-indigo-100/90">{provider?.serviceType || "Service Provider"}</p>
            <div className="mt-4 flex items-center gap-3">
              <Star className="h-6 w-6 text-yellow-300 fill-current drop-shadow" />
              <span className="text-base font-semibold text-white">{averageRating} / 5</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsViewingProfile(false)}
          className="absolute top-6 right-6 flex items-center gap-2 bg-white/95 text-indigo-700 px-5 py-2.5 rounded-full hover:bg-indigo-100 hover:text-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Edit size={20} />
          <span className="font-semibold text-sm">Edit Profile</span>
        </button>
      </div>
      <div className="p-10 bg-gradient-to-b from-gray-50 to-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Personal Information</h3>
            <div className="bg-white rounded-2xl p-8 space-y-5 shadow-lg border border-gray-100/50 transition-all duration-300 hover:shadow-xl">
              {[
                { label: "Full Name", value: provider?.name || "N/A" },
                { label: "Email", value: provider?.email || "N/A" },
                { label: "NIC", value: provider?.nic || "N/A" },
                { label: "Gender", value: provider?.gender || "N/A" },
                { label: "Location", value: provider?.location || "N/A" },
              ].map((item, index) => (
                <div key={index} className="flex items-start bg-gradient-to-r from-gray-50/50 to-white p-3 rounded-xl transition-all duration-200 hover:bg-indigo-50/50">
                  <span className="w-36 flex-shrink-0 text-sm font-semibold text-gray-600">{item.label}</span>
                  <span className="text-sm font-medium text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Service Information</h3>
            <div className="bg-white rounded-2xl p-8 space-y-5 shadow-lg border border-gray-100/50 transition-all duration-300 hover:shadow-xl">
              {[
                { label: "Service Type", value: provider?.serviceType || "N/A" },
                {
                  label: "Pay Rate",
                  value: provider?.payRate
                    ? `Rs. ${provider.payRate[0]} - Rs. ${provider.payRate[1]}`
                    : "N/A",
                },
                {
                  label: "Languages",
                  value: provider?.selectedLanguages?.join(", ") || "N/A",
                },
                {
                  label: "Availability",
                  value: provider?.availability === "yes" ? "Available" : "Not Available",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start bg-gradient-to-r from-gray-50/50 to-white p-3 rounded-xl transition-all duration-200 hover:bg-indigo-50/50">
                  <span className="w-36 flex-shrink-0 text-sm font-semibold text-gray-600">{item.label}</span>
                  <span className="text-sm font-medium text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 space-y-8">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Professional Details</h3>
          <div className="bg-white rounded-2xl p-8 space-y-5 shadow-lg border border-gray-100/50 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-start bg-gradient-to-r from-gray-50/50 to-white p-3 rounded-xl transition-all duration-200 hover:bg-indigo-50/50">
              <span className="w-36 flex-shrink-0 text-sm font-semibold text-gray-600">About Me</span>
              <p className="text-sm font-medium text-gray-800 leading-relaxed">{provider?.about || "N/A"}</p>
            </div>
            <div className="flex items-start bg-gradient-to-r from-gray-50/50 to-white p-3 rounded-xl transition-all duration-200 hover:bg-indigo-50/50">
              <span className="w-36 flex-shrink-0 text-sm font-semibold text-gray-600">Services Offered</span>
              <div className="flex flex-wrap gap-3">
                {provider?.selectedServices?.map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-900 hover:bg-indigo-200 transition-all duration-200 transform hover:scale-105"
                  >
                    {service}
                  </span>
                )) || "N/A"}
              </div>
            </div>
            {provider?.serviceType === "PetCare" && provider?.selectedPetTypes?.length > 0 && (
              <div className="flex items-start bg-gradient-to-r from-gray-50/50 to-white p-3 rounded-xl transition-all duration-200 hover:bg-indigo-50/50">
                <span className="w-36 flex-shrink-0 text-sm font-semibold text-gray-600">Pet Types</span>
                <div className="flex flex-wrap gap-3">
                  {provider?.selectedPetTypes?.map((pet, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-900 hover:bg-indigo-200 transition-all duration-200 transform hover:scale-105"
                    >
                      {pet}
                    </span>
                  )) || "N/A"}
                </div>
              </div>
            )}
            {provider?.serviceType === "Education" && (
              <>
                {provider?.selectedGrades?.length > 0 && (
                  <div className="flex items-start bg-gradient-to-r from-gray-50/50 to-white p-3 rounded-xl transition-all duration-200 hover:bg-indigo-50/50">
                    <span className="w-36 flex-shrink-0 text-sm font-semibold text-gray-600">Grades</span>
                    <div className="flex flex-wrap gap-3">
                      {provider?.selectedGrades?.map((grade, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-900 hover:bg-indigo-200 transition-all duration-200 transform hover:scale-105"
                        >
                          {grade}
                        </span>
                      )) || "N/A"}
                    </div>
                  </div>
                )}
                {provider?.selectedSyllabi?.length > 0 && (
                  <div className="flex items-start bg-gradient-to-r from-gray-50/50 to-white p-3 rounded-xl transition-all duration-200 hover:bg-indigo-50/50">
                    <span className="w-36 flex-shrink-0 text-sm font-semibold text-gray-600">Syllabus</span>
                    <div className="flex flex-wrap gap-3">
                      {provider?.selectedSyllabi?.map((syllabus, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-900 hover:bg-indigo-200 transition-all duration-200 transform hover:scale-105"
                        >
                          {syllabus}
                        </span>
                      )) || "N/A"}
                    </div>
                  </div>
                )}
                {provider?.selectedSubjects?.length > 0 && (
                  <div className="flex items-start bg-gradient-to-r from-gray-50/50 to-white p-3 rounded-xl transition-all duration-200 hover:bg-indigo-50/50">
                    <span className="w-36 flex-shrink-0 text-sm font-semibold text-gray-600">Subjects</span>
                    <div className="flex flex-wrap gap-3">
                      {provider?.selectedSubjects?.map((subject, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-900 hover:bg-indigo-200 transition-all duration-200 transform hover:scale-105"
                        >
                          {subject}
                        </span>
                      )) || "N/A"}
                    </div>
                  </div>
                )}
              </>
            )}
            {provider?.serviceType === "ChildCare" && provider?.selectedAgeGroups?.length > 0 && (
              <div className="flex items-start bg-gradient-to-r from-gray-50/50 to-white p-3 rounded-xl transition-all duration-200 hover:bg-indigo-50/50">
                <span className="w-36 flex-shrink-0 text-sm font-semibold text-gray-600">Age Groups</span>
                <div className="flex flex-wrap gap-3">
                  {provider?.selectedAgeGroups?.map((ageGroup, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-900 hover:bg-indigo-200 transition-all duration-200 transform hover:scale-105"
                    >
                      {ageGroup}
                    </span>
                  )) || "N/A"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white md:block">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">SereniLux</h1>
        </div>
        <div className="p-4">
          <div 
            className="flex items-center space-x-3 rounded-lg bg-blue-50 p-3 cursor-pointer hover:bg-blue-100 transition-colors"
            onClick={() => {
              setActiveTab("profile");
              setIsViewingProfile(true);
            }}
          >
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-blue-100">
              {serviceProvider?.photo ? (
                <img
                  src={serviceProvider.photo}
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
            { name: "Reviews", icon: <Star size={18} />, id: "reviews" },
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
              {activeTab === "reviews" && "Reviews & Ratings"}
              {activeTab === "profile" && "Profile"}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                className="flex items-center space-x-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                onClick={() => handleLogout()}
              >
                <span>Logout</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </header>
        <div className="p-4 md:p-6">
        {activeTab === "dashboard" && (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Bookings</p>
            <p className="mt-1 text-2xl font-bold text-gray-800">
              {bookings.length || "0"}
            </p>
            <p className="mt-1 text-sm text-green-500">
              {bookings.length > 0 ? "+5% from last month" : "No bookings yet"}
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
            <p className="text-sm font-medium text-gray-500">Average Rating</p>
            <p className="mt-1 text-2xl font-bold text-gray-800">
              {averageRating}
            </p>
            <p className="mt-1 flex items-center text-sm">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`mr-1 ${
                    i < Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
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
            <p className="text-sm font-medium text-gray-500">Pending Bookings</p>
            <p className="mt-1 text-2xl font-bold text-gray-800">
              {bookings.filter((b) => b.status === "PENDING").length || "0"}
            </p>
            <p className="mt-1 text-sm text-green-500">
              {bookings.filter((b) => b.status === "PENDING").length > 0
                ? "Action required"
                : "No pending bookings"}
            </p>
          </div>
          <div className="rounded-full bg-blue-100 p-3 text-blue-600">
            <Clock size={24} />
          </div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800">Booking Status</h3>
          <div className="flex space-x-2">
            {["all",  "confirmed", "pending", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setTimeframe(status)}
                className={`rounded-md px-3 py-1 text-sm ${
                  timeframe === status
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={(() => {
                const statusCounts = bookings.reduce(
                  (acc, booking) => {
                    const status = booking.status.toUpperCase();
                    acc[status] = (acc[status] || 0) + 1;
                    return acc;
                  },
                  {  CONFIRMED: 0, PENDING: 0, REJECTED: 0 }
                );
                return [
                  //{ name: "Completed", count: statusCounts.COMPLETED },
                  { name: "Confirmed", count: statusCounts.CONFIRMED },
                  { name: "Pending", count: statusCounts.PENDING },
                  { name: "Rejected", count: statusCounts.REJECTED },
                ].filter(
                  (entry) =>
                    timeframe === "all" ||
                    entry.name.toLowerCase() === timeframe
                );
              })()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                formatter={(value) => [`${value} bookings`, "Count"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="count"
                fill={COLORS.primary}
                barSize={50}
                radius={[4, 4, 0, 0]}
              >
                {[
                  //{ name: "Completed", fill: COLORS.success },
                  { name: "Confirmed", fill: COLORS.primary },
                  { name: "Pending", fill: COLORS.warning },
                  { name: "Rejected", fill: COLORS.error },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-800">
          Bookings Over Time
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={(() => {
                const bookingsByDate = bookings.reduce((acc, booking) => {
                  const date = new Date(booking.bookingDate)
                    .toISOString()
                    .slice(0, 10);
                  acc[date] = (acc[date] || 0) + 1;
                  return acc;
                }, {});
                return Object.entries(bookingsByDate)
                  .map(([date, count]) => ({ date, count }))
                  .sort((a, b) => new Date(a.date) - new Date(b.date));
              })()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                formatter={(value) => [`${value} bookings`, "Count"]}
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                }
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke={COLORS.secondary}
                strokeWidth={3}
                dot={{
                  r: 6,
                  fill: COLORS.secondary,
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
)}
          {activeTab === "bookings" && (
  <div className="space-y-8">
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bookings</h2>
        <p className="text-sm text-gray-600 mt-2 font-medium">Manage and track all your client bookings with ease</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all duration-200 hover:shadow-md"
          />
        </div>
        <button
          onClick={() => generateReport()}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Download size={18} />
          <span>Export Report</span>
        </button>
      </div>
    </div>
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100/50 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading your bookings...</p>
        </div>
      ) : error ? (
        <div className="p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <X className="h-7 w-7 text-red-600" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">Error loading bookings</h3>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                {[
                  "Client",
                  "Service",
                  "Appointment",
                  "Duration",
                  "Status",
                  "Payment"
                ].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-indigo-50/50 transition-all duration-200 transform hover:scale-[1.005]">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center ring-2 ring-indigo-200/50">
                          {booking.customerDetails?.profile_pic ? (
                            <img
                              className="h-12 w-12 rounded-full object-cover"
                              src={booking.customerDetails.profile_pic}
                              alt=""
                            />
                          ) : (
                            <User className="h-6 w-6 text-indigo-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{booking.customerDetails?.name || "N/A"}</div>
                          <div className="text-xs text-gray-500">{booking.customerDetails?.phone || ""}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-800">{booking.bookingService || "N/A"}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-800">
                        {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-500">{booking.bookingTime || "All day"}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-800">{booking.agreementDuration || "N/A"}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex text-xs font-semibold rounded-full 
                        ${booking.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                          booking.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                          booking.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                          "bg-indigo-100 text-indigo-800"} shadow-sm transform transition-all duration-200 hover:scale-105`}>
                        {formatStatus(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                      Rs. {booking.monthlyPayment?.toLocaleString('en-IN') || "0"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center justify-center py-12">
                      <Calendar className="h-14 w-14 text-gray-300" />
                      <h3 className="mt-3 text-lg font-semibold text-gray-900">
                        {searchTerm ? "No bookings match your search" : "No bookings yet"}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        {searchTerm ? "Try a different search term" : "Your upcoming bookings will appear here"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
)}

{activeTab === "reviews" && (
  <div className="space-y-8">
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Customer Reviews</h2>
        <p className="text-sm text-gray-600 mt-2 font-medium">Feedback from your clients to help you shine</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 rounded-xl shadow-sm transform transition-all duration-200 hover:scale-105">
          <div className="flex items-center">
            <Star className="h-6 w-6 text-yellow-400 fill-current" />
            <span className="ml-2 text-2xl font-bold text-gray-900">{averageRating}</span>
            <span className="ml-2 text-sm text-gray-600">/ 5</span>
          </div>
          <div className="ml-6 border-l border-gray-200 pl-6">
            <span className="text-sm font-medium text-gray-600">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100/50 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Star className="h-14 w-14 text-gray-300" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">No reviews yet</h3>
          <p className="mt-2 text-sm text-gray-600">Your client reviews will appear here</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {reviews.map((review) => (
            <li key={review._id} className="p-8 hover:bg-indigo-50/50 transition-all duration-200 transform hover:scale-[1.005]">
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  {review.customerID?.profile_pic ? (
                    <img
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-200/50"
                      src={review.customerID.profile_pic}
                      alt={`${review.customerID.firstName} ${review.customerID.lastName}`}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center ring-2 ring-indigo-200/50">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-gray-900">
                      {review.customerID ?
                        `${review.customerID.firstName} ${review.customerID.lastName}` :
                        'Anonymous User'}
                    </p>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < review.starRate ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(review.createdAt)}</p>
                  <p className="mt-3 text-sm text-gray-800 leading-relaxed">{review.review}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
)}

         
         {activeTab === "profile" && (
  <div className="space-y-8">
    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
      {isViewingProfile ? "Your Profile" : "Profile Settings"}
    </h2>
    {isViewingProfile ? (
      <ProfileView provider={serviceProvider} />
    ) : (
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-2xl p-10 transition-all duration-300 transform hover:scale-[1.01]"
      >
        <div className="space-y-10">
        <div className="flex flex-col sm:flex-row items-center gap-8 border-b border-gray-200/50 pb-8">
  <div className="relative group">
    <div className="h-40 w-40 rounded-full bg-indigo-100 overflow-hidden ring-4 ring-indigo-100 transition-transform duration-500 group-hover:ring-indigo-300 group-hover:scale-105">
      {formData.photo ? (
        <img
          src={formData.photo}
          alt="Profile"
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
        />
      ) : (
        <User className="h-full w-full p-10 text-indigo-500 opacity-80" />
      )}
    </div>
  </div>
  <div className="text-center sm:text-left">
    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{formData.name || "Your Name"}</h3>
    <p className="mt-2 text-lg font-medium text-gray-600">{formData.serviceType || "Service Provider"}</p>
  </div>
</div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "Full Name", name: "name", type: "text", required: true },
                { label: "Email Address", name: "email", type: "email", required: true },
                { label: "NIC", name: "nic", type: "text", required: true },
                {
                  label: "Gender",
                  name: "gender",
                  type: "select",
                  options: [
                    { value: "", label: "Select Gender" },
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ],
                  required: true,
                },
                {
                  label: "Location",
                  name: "location",
                  type: "select",
                  options: [
                    { value: "", label: "Select your location" },
                    ...[
                      'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
                      'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
                      'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
                      'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
                      'Monaragala', 'Ratnapura', 'Kegalle'
                    ].map((loc) => ({ value: loc, label: loc })),
                  ],
                  required: true,
                },
              ].map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 px-5 py-3 bg-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 hover:shadow-md"
                      required={field.required}
                    >
                      {field.options.map((option, idx) => (
                        <option key={idx} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 px-5 py-3 bg-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 hover:shadow-md"
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Service Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type</label>
                <select
                  name="serviceType"
                  value={formData.serviceType || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-5 py-3 bg-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 hover:shadow-md"
                  required
                >
                  <option value="">Select a service type</option>
                  <option value="HouseCleaning">House Cleaning</option>
                  <option value="KitchenHelpers">Kitchen Helpers & Chefs</option>
                  <option value="ChildCare">Child Care & Baby Sittings</option>
                  <option value="ElderCare">Elder Care</option>
                  <option value="PetCare">Pet Care Services</option>
                  <option value="Education">Education & Tutoring</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pay Rate (Range)</label>
                <div className="flex space-x-4">
                  <input
                    type="number"
                    name="payRateMin"
                    value={formData.payRate ? formData.payRate[0] : ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payRate: [
                          Number(e.target.value),
                          formData.payRate ? formData.payRate[1] : 0,
                        ],
                      })
                    }
                    placeholder="Min"
                    min="0"
                    className="w-1/2 rounded-xl border border-gray-200 px-5 py-3 bg-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 hover:shadow-md"
                    required
                  />
                  <input
                    type="number"
                    name="payRateMax"
                    value={formData.payRate ? formData.payRate[1] : ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payRate: [
                          formData.payRate ? formData.payRate[0] : 0,
                          Number(e.target.value),
                        ],
                      })
                    }
                    placeholder="Max"
                    min="0"
                    className="w-1/2 rounded-xl border border-gray-200 px-5 py-3 bg-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 hover:shadow-md"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Languages Spoken</label>
                <Select
                  multiple
                  name="selectedLanguages"
                  value={formData.selectedLanguages || []}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      selectedLanguages: e.target.value
                    }));
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" sx={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }} />
                      ))}
                    </Box>
                  )}
                  className="w-full rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      padding: '10px',
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
                    },
                  }}
                >
                  {['Sinhala', 'English', 'Tamil'].map((language) => (
                    <MenuItem key={language} value={language}>
                      {language}
                    </MenuItem>
                  ))}
                </Select>
                <div className="mt-3 flex flex-wrap gap-3">
                  {formData.selectedLanguages?.map((language) => (
                    <span
                      key={language}
                      className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-900 hover:bg-indigo-200 transition-all duration-200 transform hover:scale-105"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                <select
                  name="availability"
                  value={formData.availability || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-5 py-3 bg-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 hover:shadow-md"
                  required
                >
                  <option value="">Select availability</option>
                  <option value="yes">Available</option>
                  <option value="no">Not Available</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Professional Details</h3>
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">About Me</label>
                <textarea
                  name="about"
                  value={formData.about || ""}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Write a short bio describing your experience, specialties, and approach..."
                  className="w-full rounded-xl border border-gray-200 px-5 py-3 bg-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 hover:shadow-md"
                  required
                />
              </div>
              {formData.serviceType !== "Education" && formData.serviceType !== "Tutoring" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Service Offered</label>
                  <Select
                    name="selectedServices"
                    value={formData.selectedServices?.[0] || ""}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        selectedServices: [e.target.value]
                      }));
                    }}
                    className="w-full rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        padding: '10px',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Select a service</em>
                    </MenuItem>
                    {getServicesOffered(formData.serviceType).map((service) => (
                      <MenuItem key={service} value={service}>
                        {service}
                      </MenuItem>
                    ))}
                  </Select>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {formData.selectedServices?.map((service) => (
                      <span
                        key={service}
                        className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-900 hover:bg-indigo-200 transition-all duration-200 transform hover:scale-105"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {formData.serviceType === "PetCare" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pet Types</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["Dogs", "Cats", "Birds", "Fish"].map((pet) => (
                      <div key={pet} className="flex items-center p-2 rounded-lg hover:bg-indigo-50/50 transition-all duration-200">
                        <input
                          type="checkbox"
                          id={`pet-${pet}`}
                          name={pet}
                          checked={formData.selectedPetTypes?.includes(pet) || false}
                          onChange={(e) => {
                            const { name, checked } = e.target;
                            setFormData(prev => ({
                              ...prev,
                              selectedPetTypes: checked
                                ? [...(prev.selectedPetTypes || []), name]
                                : (prev.selectedPetTypes || []).filter(type => type !== name)
                            }));
                          }}
                          className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20 shadow-sm"
                        />
                        <label htmlFor={`pet-${pet}`} className="ml-3 text-sm font-medium text-gray-800">{pet}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {formData.serviceType === "Education" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Grades</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
                        "Grade 7", "Grade 8", "Grade 9", "O/L", "A/L"].map((grade) => (
                        <div key={grade} className="flex items-center p-2 rounded-lg hover:bg-indigo-50/50 transition-all duration-200">
                          <input
                            type="checkbox"
                            id={`grade-${grade}`}
                            name={grade}
                            checked={formData.selectedGrades?.includes(grade) || false}
                            onChange={(e) => {
                              const { name, checked } = e.target;
                              setFormData(prev => ({
                                ...prev,
                                selectedGrades: checked
                                  ? [...(prev.selectedGrades || []), name]
                                  : (prev.selectedGrades || []).filter(g => g !== name)
                              }));
                            }}
                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20 shadow-sm"
                          />
                          <label htmlFor={`grade-${grade}`} className="ml-3 text-sm font-medium text-gray-800">{grade}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Syllabus</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {["Local Syllabus", "Cambridge Syllabus", "Edxcel Syllabus"].map((syllabus) => (
                        <div key={syllabus} className="flex items-center p-2 rounded-lg hover:bg-indigo-50/50 transition-all duration-200">
                          <input
                            type="checkbox"
                            id={`syllabus-${syllabus}`}
                            name={syllabus}
                            checked={formData.selectedSyllabi?.includes(syllabus) || false}
                            onChange={(e) => {
                              const { name, checked } = e.target;
                              setFormData(prev => ({
                                ...prev,
                                selectedSyllabi: checked
                                  ? [...(prev.selectedSyllabi || []), name]
                                  : (prev.selectedSyllabi || []).filter(s => s !== name)
                              }));
                            }}
                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20 shadow-sm"
                          />
                          <label htmlFor={`syllabus-${syllabus}`} className="ml-3 text-sm font-medium text-gray-800">{syllabus}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subjects</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Art', 'Business', 'ICT', 'Mathematics', 'Physics', 'Science', 'Music', 'English', 'Chemistry', 'History', 'Other Languages'].map((subject) => (
                        <div key={subject} className="flex items-center p-2 rounded-lg hover:bg-indigo-50/50 transition-all duration-200">
                          <input
                            type="checkbox"
                            id={`subject-${subject}`}
                            name={subject}
                            checked={formData.selectedSubjects?.includes(subject) || false}
                            onChange={(e) => {
                              const { name, checked } = e.target;
                              setFormData(prev => ({
                                ...prev,
                                selectedSubjects: checked
                                  ? [...(prev.selectedSubjects || []), name]
                                  : (prev.selectedSubjects || []).filter(s => s !== name)
                              }));
                            }}
                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20 shadow-sm"
                          />
                          <label htmlFor={`subject-${subject}`} className="ml-3 text-sm font-medium text-gray-800">{subject}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {formData.serviceType === "ChildCare" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Age Groups</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {["Newborn", "Toddler", "Pre-school", "Primary School", "Teenager (12+ years)"].map((ageGroup) => (
                      <div key={ageGroup} className="flex items-center p-2 rounded-lg hover:bg-indigo-50/50 transition-all duration-200">
                        <input
                          type="checkbox"
                          id={`age-${ageGroup}`}
                          name={ageGroup}
                          checked={formData.selectedAgeGroups?.includes(ageGroup) || false}
                          onChange={(e) => {
                            const { name, checked } = e.target;
                            setFormData(prev => ({
                              ...prev,
                              selectedAgeGroups: checked
                                ? [...(prev.selectedAgeGroups || []), name]
                                : (prev.selectedAgeGroups || []).filter(age => age !== name)
                            }));
                          }}
                          className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20 shadow-sm"
                        />
                        <label htmlFor={`age-${ageGroup}`} className="ml-3 text-sm font-medium text-gray-800">{ageGroup}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={handleDeleteProfile}
              className="flex items-center gap-2 bg-red-100 text-red-700 px-6 py-3 rounded-xl hover:bg-red-200 hover:text-red-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <X size={20} />
              <span className="font-semibold">Delete Account</span>
            </button>
            <button
              type="submit"
              disabled={updating}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                <Save size={20} />
              )}
              <span className="font-semibold">{updating ? "Updating..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </form>
    )}
  </div>
)}
                  </div>
                </main>
              </div>
            );
          };
          
          export default ServiceProviderDashboard;
