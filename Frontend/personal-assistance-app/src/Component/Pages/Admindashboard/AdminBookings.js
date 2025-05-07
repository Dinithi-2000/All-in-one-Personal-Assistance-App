import React, { useState, useEffect } from "react";
import { getAllBookings, updateBooking } from "../../../Lib/api";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from 'jspdf-autotable';
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFileExport,
  FaSearch,
  FaCheck,
  FaTimes,
  FaFilter,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaUserAlt,
  FaUserTie,
  FaInfoCircle,
  FaExclamationTriangle
} from "react-icons/fa";

const statusColors = {
  PENDING: {
    bg: "bg-[#FFF3E0]", // Light orange background
    text: "text-[#FF9800]", // Orange text
    badge: "bg-[#FF9800]" // Orange badge
  },
  CONFIRMED: {
    bg: "bg-[#E8F5E9]", // Light green background
    text: "text-[#4CAF50]", // Green text
    badge: "bg-[#4CAF50]" // Green badge
  },
  REJECTED: {
    bg: "bg-[#FFEBEE]", // Light red background
    text: "text-[#ff5252]", // Red text
    badge: "bg-[#ff5252]" // Red badge
  }
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectBookingID, setRejectBookingID] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [expandedRow, setExpandedRow] = useState(null);

  // Company information
  const companyInfo = {
    name: "SereniLux",
    address: "123 Business Street, City, Country",
    phone: "+1 234 567 890",
    email: "info@SereniLux.com"
  };

  // Fetch all bookings on component mount
  useEffect(() => {
    const fetchAllBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllBookings();
        console.log("Fetched bookings with populated provider data:", response.data.bookings);
        setBookings(response.data.bookings || []);
        setFilteredBookings(response.data.bookings || []);
      } catch (err) {
        setError("Failed to fetch bookings. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBookings();
  }, []);

  // Clear notifications after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Filter bookings based on search term and status
  useEffect(() => {
    let filtered = [...bookings];

    // Apply status filter if not "ALL"
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter(booking => booking.status === selectedStatus);
    }

    // Apply search term filter
    if (searchTerm !== "") {
      filtered = filtered.filter(booking => {
        return (
          (booking.customerDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.providerID?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.bookingService?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.bookingDate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.rejectionReason?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        // Handle nested properties and null values
        let aValue, bValue;

        if (sortConfig.key === "customerName") {
          aValue = a.customerDetails?.name || "";
          bValue = b.customerDetails?.name || "";
        } else if (sortConfig.key === "providerName") {
          aValue = a.providerID?.name || "";
          bValue = b.providerID?.name || "";
        } else {
          aValue = a[sortConfig.key] || "";
          bValue = b[sortConfig.key] || "";
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredBookings(filtered);
  }, [searchTerm, bookings, selectedStatus, sortConfig]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? " ↑" : " ↓";
  };

  const handleConfirm = async (bookingID) => {
    setError(null);
    setSuccess(null);

    try {
      const updatedData = { status: "CONFIRMED" };
      const response = await updateBooking(bookingID, updatedData);
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingID ? response.data.updatedBooking : booking
        )
      );
      setSuccess("Booking confirmed successfully!");
    } catch (err) {
      setError("Failed to confirm booking. Please try again.");
      console.error(err);
    }
  };

  const handleOpenRejectModal = (bookingID) => {
    setRejectBookingID(bookingID);
    setRejectionReason("");
    setRejectionError(null);
    setIsRejectModalOpen(true);
  };

  const handleCloseRejectModal = () => {
    setIsRejectModalOpen(false);
    setRejectBookingID(null);
    setRejectionReason("");
    setRejectionError(null);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setRejectionError("Please provide a reason for rejection");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const updatedData = { status: "REJECTED", rejectionReason };
      const response = await updateBooking(rejectBookingID, updatedData);
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === rejectBookingID ? response.data.updatedBooking : booking
        )
      );
      setSuccess("Booking rejected successfully!");
      handleCloseRejectModal();
    } catch (err) {
      setError("Failed to reject booking. Please try again.");
      console.error(err);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add company logo and information
    doc.setFontSize(18);
    doc.setTextColor(0, 102, 204); // Blue color
    doc.text(companyInfo.name, 105, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100); // Gray
    doc.text(companyInfo.address, 105, 22, { align: 'center' });
    doc.text(`Phone: ${companyInfo.phone} | Email: ${companyInfo.email}`, 105, 28, { align: 'center' });

    // Add title and date
    doc.setFontSize(16);
    doc.setTextColor(0, 102, 204); // Blue color
    doc.text("Bookings Report", 105, 38, { align: 'center' });

    const date = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 105, 44, { align: 'center' });

    // Add filter information
    doc.setFontSize(10);
    doc.text(`Status Filter: ${selectedStatus}`, 14, 52);
    if (searchTerm) {
      doc.text(`Search Term: "${searchTerm}"`, 14, 58);
    }

    // Prepare data for the table
    const headers = [
      ['Customer', 'Provider', 'Service', 'Duration', 'Payment (Rs.)', 'Date', 'Time', 'Status']
    ];

    const tableData = filteredBookings.map(booking => [
      booking.customerDetails?.name || "N/A",
      booking.providerID?.name || "N/A",
      booking.bookingService || "N/A",
      booking.agreementDuration || "N/A",
      booking.monthlyPayment || "N/A",
      booking.bookingDate || "N/A",
      booking.bookingTime || "N/A",
      booking.status || "N/A"
    ]);

    // Add table using autoTable
    autoTable(doc, {
      head: headers,
      body: tableData,
      startY: 65,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 102, 204], // Blue header
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240] // Light gray
      },
      margin: { top: 65 }
    });

    // Add rejection reasons for rejected bookings
    const rejectedBookings = filteredBookings.filter(booking => booking.status === "REJECTED");
    if (rejectedBookings.length > 0) {
      let yPosition = doc.lastAutoTable.finalY + 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 102, 204); // Blue color
      doc.text("Rejection Details", 14, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setTextColor(100);

      rejectedBookings.forEach(booking => {
        doc.text(`Customer: ${booking.customerDetails?.name || "N/A"}`, 14, yPosition);
        yPosition += 5;
        doc.text(`Provider: ${booking.providerID?.name || "N/A"}`, 14, yPosition);
        yPosition += 5;
        doc.text(`Reason: ${booking.rejectionReason || "No reason provided"}`, 14, yPosition);
        yPosition += 10;
      });
    }

    // Save the PDF
    doc.save(`bookings_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const toggleRowExpansion = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a237e] to-[#121212] p-6 z-10 flex-1">
      <main className="max-w-screen mx-auto py-8 px-0 lg:px-8">
        {/* Notification System */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 bg-[#4CAF50] text-white px-6 py-3 rounded-lg shadow-lg flex items-center"
            >
              <FaCheck className="mr-2" /> {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 bg-[#ff5252] text-white px-6 py-3 rounded-lg shadow-lg flex items-center"
            >
              <FaExclamationTriangle className="mr-2" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-lg rounded-lg shadow-sm p-6 mb-6 border border-[rgba(255,255,255,0.1)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Booking Management</h1>
              <p className="text-[rgba(255,255,255,0.7)]">Manage and process service bookings</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={generatePDF}
                className="flex items-center px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#005BB5] transition duration-300 shadow-sm"
              >
                <FaFileExport className="mr-2" />
                Export to PDF
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Search Section */}
        <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-lg rounded-lg shadow-sm p-6 mb-6 border border-[rgba(255,255,255,0.1)]">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search bookings by name, service, date..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-[rgba(255,255,255,0.3)] bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-4 top-3.5 text-[rgba(255,255,255,0.7)]">
                  <FaSearch />
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto flex items-center">
              <div className="flex items-center mr-2 text-[rgba(255,255,255,0.7)]">
                <FaFilter className="mr-2" />
                <span>Status:</span>
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-3 pr-8 py-2 rounded-lg border border-[rgba(255,255,255,0.3)] bg-[rgba(0,0,0,0.5)] text-white focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent appearance-none"
              >
                <option value="ALL" className="bg-[rgba(0,0,0,0.5)] text-white">All Statuses</option>
                <option value="PENDING" className="bg-[rgba(0,0,0,0.5)] text-white">Pending</option>
                <option value="CONFIRMED" className="bg-[rgba(0,0,0,0.5)] text-white">Confirmed</option>
                <option value="REJECTED" className="bg-[rgba(0,0,0,0.5)] text-white">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-[rgba(0,91,187,0.3)] rounded-lg shadow-sm p-6 border-l-4 border-[#0066CC]">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white text-sm font-medium">Total Bookings</p>
                <p className="text-2xl font-bold text-white mt-1">{bookings.length}</p>
              </div>
              <div className="bg-[rgba(255,255,255,0.1)] p-3 rounded-full">
                <FaCalendarAlt className="text-[#0066CC] text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-[rgba(255,152,0,0.2)] rounded-lg shadow-sm p-6 border-l-4 border-[#FF9800]">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white text-sm font-medium">Pending Bookings</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {bookings.filter(b => b.status === "PENDING").length}
                </p>
              </div>
              <div className="bg-[rgba(255,255,255,0.1)] p-3 rounded-full">
                <FaClock className="text-[#FF9800] text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-[rgba(76,175,80,0.2)] rounded-lg shadow-sm p-6 border-l-4 border-[#4CAF50]">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white text-sm font-medium">Confirmed Bookings</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {bookings.filter(b => b.status === "CONFIRMED").length}
                </p>
              </div>
              <div className="bg-[rgba(255,255,255,0.1)] p-3 rounded-full">
                <FaMoneyBillWave className="text-[#4CAF50] text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-lg rounded-lg shadow-sm overflow-hidden border border-[rgba(255,255,255,0.1)]">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0066CC]"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-[rgba(255,255,255,0.1)] rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <FaInfoCircle className="text-[rgba(255,255,255,0.7)] text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-white">No bookings found</h3>
              <p className="text-[rgba(255,255,255,0.7)] mt-1">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[rgba(255,255,255,0.05)]">
                <thead className="bg-[rgba(0,91,187,0.3)]">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("customerName")}
                    >
                      <div className="flex items-center">
                        <FaUserAlt className="mr-2 text-[rgba(255,255,255,0.7)]" />
                        Customer {getSortIndicator("customerName")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("providerName")}
                    >
                      <div className="flex items-center">
                        <FaUserTie className="mr-2 text-[rgba(255,255,255,0.7)]" />
                        Provider {getSortIndicator("providerName")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("bookingService")}
                    >
                      Service {getSortIndicator("bookingService")}
                    </th>
                    <th
                      className="hidden lg:table-cell px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("bookingDate")}
                    >
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-[rgba(255,255,255,0.7)]" />
                        Date {getSortIndicator("bookingDate")}
                      </div>
                    </th>
                    <th
                      className="hidden lg:table-cell px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("monthlyPayment")}
                    >
                      <div className="flex items-center">
                        <FaMoneyBillWave className="mr-2 text-[rgba(255,255,255,0.7)]" />
                        Payment {getSortIndicator("monthlyPayment")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      Status {getSortIndicator("status")}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-[rgba(255,255,255,0.05)]">
                  {filteredBookings.map((booking) => (
                    <React.Fragment key={booking._id}>
                      <tr
                        className="hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-150 cursor-pointer"
                        onClick={() => toggleRowExpansion(booking._id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-[rgba(255,255,255,0.1)] rounded-full flex items-center justify-center text-white">
                              {booking.customerDetails?.name?.charAt(0) || "?"}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {booking.customerDetails?.name || "Unknown Customer"}
                              </div>
                              <div className="text-sm text-[rgba(255,255,255,0.7)]">
                                {booking.customerDetails?.email || "No email"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {booking.providerID?.name || "Unknown Provider"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{booking.bookingService}</div>
                          <div className="text-xs text-[rgba(255,255,255,0.7)]">{booking.agreementDuration}</div>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{booking.bookingDate}</div>
                          <div className="text-xs text-[rgba(255,255,255,0.7)]">{booking.bookingTime}</div>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            Rs. {booking.monthlyPayment}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]?.bg} ${statusColors[booking.status]?.text}`}>
                            <span className={`h-2 w-2 rounded-full ${statusColors[booking.status]?.badge} mr-1`}></span>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {booking.status === "PENDING" && (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConfirm(booking._id);
                                }}
                                className="inline-flex items-center px-3 py-1 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#4CAF50] rounded-md transition duration-300"
                              >
                                <FaCheck className="mr-1" />
                                <span>Confirm</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenRejectModal(booking._id);
                                }}
                                className="inline-flex items-center px-3 py-1 bg-[#FFEBEE] hover:bg-[#FFCDD2] text-[#ff5252] rounded-md transition duration-300"
                              >
                                <FaTimes className="mr-1" />
                                <span>Reject</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                      {expandedRow === booking._id && (
                        <tr className="bg-[rgba(255,255,255,0.05)]">
                          <td colSpan="7" className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-white mb-2">Customer Details</h4>
                                <div className="bg-[rgba(255,255,255,0.1)] p-3 rounded-md shadow-sm">
                                  <p className="text-sm text-white"><span className="font-medium">Name:</span> {booking.customerDetails?.name}</p>
                                  <p className="text-sm text-white"><span className="font-medium">Email:</span> {booking.customerDetails?.email}</p>
                                  <p className="text-sm text-white"><span className="font-medium">Phone:</span> {booking.customerDetails?.phone}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-white mb-2">Booking Details</h4>
                                <div className="bg-[rgba(255,255,255,0.1)] p-3 rounded-md shadow-sm">
                                  <p className="text-sm text-white"><span className="font-medium">Service:</span> {booking.bookingService}</p>
                                  <p className="text-sm text-white"><span className="font-medium">Duration:</span> {booking.agreementDuration}</p>
                                  <p className="text-sm text-white"><span className="font-medium">Payment:</span> Rs. {booking.monthlyPayment}</p>
                                  <p className="text-sm text-white"><span className="font-medium">Date & Time:</span> {booking.bookingDate} at {booking.bookingTime}</p>
                                </div>
                              </div>

                              {booking.status === "REJECTED" && booking.rejectionReason && (
                                <div className="md:col-span-2">
                                  <h4 className="font-medium text-white mb-2">Rejection Reason</h4>
                                  <div className="bg-[#FFEBEE] border-l-4 border-[#ff5252] p-3 rounded-md">
                                    <p className="text-sm text-white">{booking.rejectionReason}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Rejection Reason Modal */}
        <AnimatePresence>
          {isRejectModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#1a1a1a] rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-[rgba(255,255,255,0.1)]"
              >
                <div className="bg-[#ff5252] text-white p-4">
                  <h2 className="text-xl font-bold flex items-center">
                    <FaTimes className="mr-3" />
                    Reject Booking
                  </h2>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <label className="block text-white font-medium mb-2">
                      Reason for Rejection
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className={`w-full border ${rejectionError ? "border-[#ff5252]" : "border-[rgba(255,255,255,0.3)]"
                        } rounded-lg p-3 h-32 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#ff5252] focus:border-transparent transition duration-200`}
                      placeholder="Please provide detailed reason for rejecting this booking..."
                    />
                    {rejectionError && (
                      <p className="text-[#ff5252] text-sm mt-1">{rejectionError}</p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleCloseRejectModal}
                      className="px-4 py-2 bg-[rgba(255,255,255,0.1)] text-white rounded-lg hover:bg-[rgba(255,255,255,0.2)] transition duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      className="px-4 py-2 bg-[#ff5252] text-white rounded-lg hover:bg-[#e04848] transition duration-300 flex items-center"
                    >
                      <FaTimes className="mr-2" />
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminBookings;