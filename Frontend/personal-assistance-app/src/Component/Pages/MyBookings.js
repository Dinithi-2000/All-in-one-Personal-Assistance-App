import React, { useState, useEffect } from "react";
import { retrieveBookings, updateBooking, deleteBooking } from "../../Lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Banknote,
  FileSignature,
  X,
  User,
  Package,
  Ban,
  MessageSquare,
  Edit,
  Calendar,
  ChevronRight,
  AlertTriangle,
  Check,
  Search,
  Filter
} from "lucide-react";

const staticUser = {
  id: "static-user-123",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+94 123 456 789",
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState(null);
  const [editReason, setEditReason] = useState("");
  const [editReasonError, setEditReasonError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editFormData, setEditFormData] = useState({
    agreementDuration: "",
    monthlyPayment: "",
    bookingDate: "",
    bookingTime: "",
  });

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await retrieveBookings(staticUser.id);
        setBookings(response.data.bookings || []);
      } catch (err) {
        setError("Failed to fetch bookings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
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

  const handleEditOpen = (booking) => {
    setSelectedBooking(booking);
    setEditFormData({
      agreementDuration: booking.agreementDuration,
      monthlyPayment: booking.monthlyPayment,
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime,
    });
    setEditReason("");
    setEditReasonError(null);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedBooking(null);
    setEditFormData({
      agreementDuration: "",
      monthlyPayment: "",
      bookingDate: "",
      bookingTime: "",
    });
    setEditReason("");
    setEditReasonError(null);
  };

  const handleCancelOpen = (bookingID) => {
    setBookingToCancel(bookingID);
    setCancelReason("");
    setCancelError(null);
    setCancelModalOpen(true);
  };

  const handleCancelClose = () => {
    setCancelModalOpen(false);
    setBookingToCancel(null);
    setCancelReason("");
    setCancelError(null);
  };

  const handleCancelReasonChange = (e) => {
    setCancelReason(e.target.value);
    if (cancelError) {
      setCancelError(null);
    }
  };

  const handleEditReasonChange = (e) => {
    setEditReason(e.target.value);
    if (editReasonError) {
      setEditReasonError(null);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditBooking = async () => {
    if (!selectedBooking) return;

    // If the booking is CONFIRMED, require an edit reason
    if (selectedBooking.status === "CONFIRMED" && !editReason.trim()) {
      setEditReasonError("Please provide a reason for editing this confirmed booking.");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const updatedData = {
        agreementDuration: editFormData.agreementDuration,
        bookingService: selectedBooking.bookingService,
        monthlyPayment: parseFloat(editFormData.monthlyPayment),
        bookingDate: editFormData.bookingDate,
        bookingTime: editFormData.bookingTime,
        status: selectedBooking.status,
      };

      // Include editReason if the booking is CONFIRMED
      if (selectedBooking.status === "CONFIRMED") {
        updatedData.editReason = editReason;
      }

      const response = await updateBooking(selectedBooking._id, updatedData);
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === selectedBooking._id ? response.data.updatedBooking : booking
        )
      );
      setSuccess("Booking updated successfully!");
      handleEditClose();
    } catch (err) {
      setError("Failed to update booking");
      console.error(err);
    }
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;

    if (!cancelReason.trim()) {
      setCancelError("Please provide a reason for cancellation.");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      // Send the cancellation reason to the backend
      await deleteBooking(bookingToCancel, {
        cancellationReason: cancelReason,
      });

      setBookings((prev) => prev.filter((booking) => booking._id !== bookingToCancel));
      setSuccess("Booking cancelled successfully!");
      handleCancelClose();
    } catch (err) {
      setError("Failed to cancel booking");
      console.error(err);
    }
  };

  // Filter and search bookings
  const filteredBookings = bookings
    .filter(booking => {
      // Status filter
      if (filterStatus !== "all" && booking.status !== filterStatus) return false;

      // Search query filter (case insensitive)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          booking.bookingService?.toLowerCase().includes(query) ||
          booking.providerID?.name?.toLowerCase().includes(query) ||
          booking.agreementDuration?.toLowerCase().includes(query)
        );
      }

      return true;
    });

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const getStatusStyle = () => {
      switch (status) {
        case "CONFIRMED":
          return "bg-emerald-100 text-emerald-800 border-emerald-200";
        case "PENDING":
          return "bg-amber-100 text-amber-800 border-amber-200";
        case "CANCELLED":
          return "bg-red-100 text-red-800 border-red-200";
        case "REJECTED":
          return "bg-gray-100 text-gray-800 border-gray-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle()}`}>
        {status}
      </span>
    );
  };

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans w-screen">
      {/* Notification Toasts */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <Check size={18} />
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} className="ml-4 hover:opacity-80">
              <X size={16} />
            </button>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <AlertTriangle size={18} />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4 hover:opacity-80">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white w-full">
        <div className="w-full px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-14 md:py-20"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              My Bookings
            </h1>
            <p className="text-indigo-100 text-lg md:text-xl">
              Manage your scheduled services and appointments in one place.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 py-8">
        {/* Search and Filter Controls */}
        <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bookings..."
                className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors outline-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="py-3 px-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors outline-none"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {loading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {!loading && filteredBookings.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-gray-200 text-gray-700 px-6 py-12 rounded-xl text-center"
            >
              <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              {searchQuery || filterStatus !== "all" ? (
                <>
                  <p className="font-medium text-lg">No matching bookings found.</p>
                  <p className="mt-2 text-gray-600">
                    Try adjusting your search or filter criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterStatus("all");
                    }}
                    className="mt-4 px-4 py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors"
                  >
                    Clear filters
                  </button>
                </>
              ) : (
                <>
                  <p className="font-medium text-lg">No bookings found.</p>
                  <p className="mt-2 text-gray-600">
                    Book a service provider to get started!
                  </p>
                </>
              )}
            </motion.div>
          )}

          {filteredBookings.map((booking) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left side: Booking details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {booking.providerID?.name || "Unknown Provider"}
                      </h3>
                      <StatusBadge status={booking.status} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                      <div className="flex items-center text-gray-700">
                        <Package size={16} className="mr-2 text-violet-500" />
                        <span className="text-sm font-medium">{booking.bookingService}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FileSignature size={16} className="mr-2 text-violet-500" />
                        <span className="text-sm">{booking.agreementDuration}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Banknote size={16} className="mr-2 text-violet-500" />
                        <span className="text-sm">Rs. {booking.monthlyPayment}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <CalendarDays size={16} className="mr-2 text-violet-500" />
                        <span className="text-sm">{booking.bookingDate}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock size={16} className="mr-2 text-violet-500" />
                        <span className="text-sm">{booking.bookingTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Actions */}
                  <div className="flex md:flex-col justify-end gap-3 mt-4 md:mt-0">
                    <button
                      onClick={() => handleEditOpen(booking)}
                      className="px-4 py-2.5 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                      aria-label={`Edit booking for ${booking.providerID?.name || "provider"}`}
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleCancelOpen(booking._id)}
                      className="px-4 py-2.5 bg-white text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                      aria-label={`Cancel booking for ${booking.providerID?.name || "provider"}`}
                    >
                      <Ban size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit Booking Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
            onClick={handleEditClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white p-6">
                <h2 id="edit-modal-title" className="text-xl font-bold flex items-center">
                  <User className="mr-3 h-5 w-5" />
                  Edit Booking Details
                </h2>
                <p className="text-violet-100 mt-1 text-sm">
                  {selectedBooking?.providerID?.name || "Provider"} - {selectedBooking?.bookingService}
                </p>
                <button
                  onClick={handleEditClose}
                  className="absolute top-4 right-4 text-white hover:text-violet-100 transition-colors duration-200"
                  aria-label="Close edit modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Agreement Duration */}
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center text-sm">
                    <FileSignature className="mr-2 text-violet-500 h-4 w-4" />
                    Agreement Duration
                  </label>
                  <select
                    name="agreementDuration"
                    value={editFormData.agreementDuration}
                    onChange={handleEditFormChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-200 bg-gray-50"
                    aria-label="Select agreement duration"
                  >
                    <option value="1 month">1 Month</option>
                    <option value="3 months">3 Months</option>
                    <option value="6 months">6 Months</option>
                    <option value="1 year">1 Year</option>
                  </select>
                </div>

                {/* Monthly Payment */}
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center text-sm">
                    <Banknote className="mr-2 text-violet-500 h-4 w-4" />
                    Monthly Payment (Rs.)
                  </label>
                  <div className="relative flex items-center border rounded-lg bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent transition duration-200">
                    <span className="pl-3 pr-1 text-gray-500">Rs.</span>
                    <input
                      type="number"
                      name="monthlyPayment"
                      value={editFormData.monthlyPayment}
                      onChange={handleEditFormChange}
                      className="w-full border-none p-3 focus:outline-none focus:ring-0 bg-gray-50 text-gray-700"
                      min="15000"
                      step="100"
                      aria-label="Enter monthly payment"
                    />
                  </div>
                </div>

                {/* Booking Date */}
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center text-sm">
                    <CalendarDays className="mr-2 text-violet-500 h-4 w-4" />
                    Booking Date
                  </label>
                  <input
                    type="date"
                    name="bookingDate"
                    value={editFormData.bookingDate}
                    onChange={handleEditFormChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-200 bg-gray-50"
                    min={new Date().toISOString().split("T")[0]}
                    aria-label="Select booking date"
                  />
                </div>

                {/* Booking Time */}
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center text-sm">
                    <Clock className="mr-2 text-violet-500 h-4 w-4" />
                    Booking Time
                  </label>
                  <input
                    type="time"
                    name="bookingTime"
                    value={editFormData.bookingTime}
                    onChange={handleEditFormChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-200 bg-gray-50"
                    aria-label="Select booking time"
                  />
                </div>

                {/* Edit Reason (only for CONFIRMED bookings) */}
                {selectedBooking?.status === "CONFIRMED" && (
                  <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2 flex items-center text-sm">
                      <MessageSquare className="mr-2 text-violet-500 h-4 w-4" />
                      Reason for Edit
                    </label>
                    <textarea
                      value={editReason}
                      onChange={handleEditReasonChange}
                      className={`w-full border ${editReasonError ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                        } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-200 bg-gray-50 resize-none h-32`}
                      placeholder="Please explain why you're editing this confirmed booking..."
                      aria-label="Enter reason for editing"
                    />
                    {editReasonError && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertTriangle size={12} className="mr-1" />
                        {editReasonError}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleEditClose}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                    aria-label="Cancel edit"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditBooking}
                    className="px-4 py-2.5 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-all flex items-center shadow-sm"
                    aria-label="Save changes"
                  >
                    <span>Save Changes</span>
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Booking Modal */}
      <AnimatePresence>
        {cancelModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
            onClick={handleCancelClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
                <h2 id="cancel-modal-title" className="text-xl font-bold flex items-center">
                  <AlertTriangle className="mr-3 h-5 w-5" />
                  Cancel Booking
                </h2>
                <p className="text-red-100 mt-1 text-sm">
                  Please provide a reason for cancellation
                </p>
                <button
                  onClick={handleCancelClose}
                  className="absolute top-4 right-4 text-white hover:text-red-100 transition-colors duration-200"
                  aria-label="Close cancel modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Cancellation Reason */}
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center text-sm">
                    <MessageSquare className="mr-2 text-red-500 h-4 w-4" />
                    Reason for Cancellation
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={handleCancelReasonChange}
                    className={`w-full border ${cancelError ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                      } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 bg-gray-50 resize-none h-32`}
                    placeholder="Please explain why you're cancelling this booking..."
                    aria-label="Enter reason for cancellation"
                  />
                  {cancelError && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertTriangle size={12} className="mr-1" />
                      {cancelError}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleCancelClose}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                    aria-label="Cancel cancellation"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmCancel}
                    className="px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center shadow-sm"
                    aria-label="Confirm cancellation"
                  >
                    <span>Confirm Cancellation</span>
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookings;