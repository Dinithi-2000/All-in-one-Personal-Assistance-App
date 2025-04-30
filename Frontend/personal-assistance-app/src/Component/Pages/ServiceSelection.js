// Frontend/personal-assistance-app/src/Pages/ServiceSelection.js
import React, { useState, useEffect } from "react";
import useServiceProviders from "../Hooks/CustomHook/useServiceProviders";
import { createBooking } from "../../Lib/api";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import { 
  FaChild, 
  FaUserNurse, 
  FaUtensils, 
  FaPaw, 
  FaGraduationCap, 
  FaBroom,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaSignature,
  FaMapMarkerAlt,
  FaStar,
  FaInfoCircle
} from "react-icons/fa";

const categories = [
  { id: "ChildCare", label: "Child Care", icon: FaChild },
  { id: "ElderCare", label: "Elder Care", icon: FaUserNurse },
  { id: "KitchenHelpers", label: "Kitchen Helpers", icon: FaUtensils },
  { id: "PetCare", label: "Pet Care", icon: FaPaw },
  { id: "Education", label: "Education", icon: FaGraduationCap },
  { id: "HouseCleaning", label: "House Cleaning", icon: FaBroom },
];

// Static user details
const staticUser = {
  id: "static-user-123",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+94 123 456 789",
};

const ServiceSelection = () => {
  const { category, setCategory, serviceProviders, loading, error } =
    useServiceProviders();

  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    agreementDuration: "1 month",
    monthlyPayment: 5000,
    bookingDate: "", 
    bookingTime: "",
  });

  // Clear notifications after 5 seconds
  useEffect(() => {
    if (bookingError || bookingSuccess) {
      const timer = setTimeout(() => {
        setBookingError(null);
        setBookingSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [bookingError, bookingSuccess]);

  const handleOpenModal = (provider) => {
    // Set initial payment based on provider's rates
    const initialPayment = provider.payRate ? 
      Math.round((provider.payRate[0] + provider.payRate[1]) / 2) * 10 : 5000;
    
    setSelectedProvider(provider);
    setFormData(prev => ({
      ...prev,
      monthlyPayment: initialPayment,
      // Set default date to tomorrow
      bookingDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
      // Set default time to 10:00 AM
      bookingTime: "10:00"
    }));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProvider(null);
    setValidationErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error for this field when user makes changes
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate monthly payment
    if (!formData.monthlyPayment) {
      errors.monthlyPayment = "Monthly payment is required";
    } else if (formData.monthlyPayment < 1000) {
      errors.monthlyPayment = "Monthly payment must be at least 1000";
    }
    
    // Validate booking date
    if (!formData.bookingDate) {
      errors.bookingDate = "Booking date is required";
    } else {
      const selectedDate = new Date(formData.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.bookingDate = "Booking date cannot be in the past";
      }
    }
    
    // Validate booking time
    if (!formData.bookingTime) {
      errors.bookingTime = "Booking time is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookNow = async () => {
    if (!selectedProvider) return;
    
    if (!validateForm()) {
      return;
    }

    setBookingError(null);
    setBookingSuccess(null);

    try {
      const bookingData = {
        customerID: staticUser.id,
        customerDetails: {
          name: staticUser.name,
          email: staticUser.email,
          phone: staticUser.phone,
        },
        providerID: selectedProvider._id,
        agreementDuration: formData.agreementDuration,
        bookingService: category,
        monthlyPayment: parseFloat(formData.monthlyPayment),
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
      };

      const response = await createBooking(bookingData);
      setBookingSuccess("Booking created successfully!");
      console.log(response.data);
      handleCloseModal();
    } catch (err) {
      setBookingError("Failed to create booking");
      console.error(err);
    }
  };

  // Filter providers based on search query
  const filteredProviders = searchQuery 
    ? serviceProviders.filter(provider => 
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.about.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : serviceProviders;

  // Get current category object
  const currentCategory = categories.find(cat => cat.id === category) || categories[0];
  const CategoryIcon = currentCategory.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Bar */}
      <AnimatePresence>
        {bookingSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center"
          >
            <span className="mr-2">✓</span> {bookingSuccess}
          </motion.div>
        )}
        {bookingError && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center"
          >
            <span className="mr-2">✕</span> {bookingError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Service Provider</h1>
          <p className="text-teal-100 mb-6">Professional and reliable assistance for all your needs</p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by name, location or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
            <div className="absolute left-4 top-3.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="bg-white rounded-xl shadow-md p-1 mb-8 overflow-x-auto">
          <div className="flex min-w-max">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium text-sm transition duration-300 whitespace-nowrap ${
                    category === cat.id
                      ? "bg-teal-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="mr-2" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Title */}
        <div className="flex items-center mb-6">
          <div className="bg-teal-100 p-3 rounded-full">
            <CategoryIcon className="text-teal-600 text-xl" />
          </div>
          <h2 className="ml-4 text-2xl font-semibold text-gray-800">{currentCategory.label} Professionals</h2>
        </div>

        {/* Service Providers List */}
        <div className="space-y-6">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
              <div className="flex items-center">
                <FaInfoCircle className="mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {!loading && filteredProviders.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-12 rounded-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              <p className="font-medium">No service providers found for this category.</p>
              <p className="mt-2">Try selecting a different category or adjusting your search.</p>
            </div>
          )}

          {filteredProviders.map((provider) => (
            <motion.div
              key={provider._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 lg:w-1/5 bg-gray-50 flex items-center justify-center p-6">
                  <div className="relative">
                    <img
                      src={provider.photo || "https://via.placeholder.com/150"}
                      alt={provider.name}
                      className="w-28 h-28 object-cover rounded-full border-4 border-white shadow"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      4.8 <FaStar className="inline ml-1 text-yellow-300" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{provider.name}</h3>
                      <p className="text-gray-600 flex items-center mt-1">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" /> {provider.location}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <div className="text-lg font-bold text-teal-600">
                        Rs. {provider.payRate[0]} - {provider.payRate[1]} <span className="text-sm font-normal text-gray-500">/ hour</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mt-4">{provider.about}</p>
                  
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
                      5+ Years Experience
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      Certified
                    </span>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                      Background Checked
                    </span>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => handleOpenModal(provider)}
                      className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 flex items-center"
                    >
                      <span>Book Now</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-teal-500 text-white p-6">
                <h2 className="text-xl font-bold flex items-center">
                  <FaCalendarAlt className="mr-3" />
                  Book {selectedProvider?.name}
                </h2>
                <p className="text-teal-100 mt-1">Complete your booking details below</p>
              </div>

              <div className="p-6">
                {/* Agreement Duration */}
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <FaSignature className="mr-2 text-teal-500" />
                    Agreement Duration
                  </label>
                  <select
                    name="agreementDuration"
                    value={formData.agreementDuration}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                  >
                    <option value="1 month">1 Month</option>
                    <option value="3 months">3 Months</option>
                    <option value="6 months">6 Months</option>
                    <option value="1 year">1 Year</option>
                  </select>
                </div>
                
                {/* Monthly Payment */}
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <FaMoneyBillWave className="mr-2 text-teal-500" />
                    Monthly Payment (Rs.)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="monthlyPayment"
                      value={formData.monthlyPayment}
                      onChange={handleFormChange}
                      className={`w-full border ${
                        validationErrors.monthlyPayment ? "border-red-500" : "border-gray-300"
                      } rounded-lg p-3 pl-12 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200`}
                      min="1000"
                      step="100"
                    />
                    <div className="absolute left-3 top-3 text-gray-500">
                      Rs.
                    </div>
                  </div>
                  {validationErrors.monthlyPayment && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.monthlyPayment}</p>
                  )}
                </div>

                {/* Booking Date */}
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <FaCalendarAlt className="mr-2 text-teal-500" />
                    Booking Date
                  </label>
                  <input
                    type="date"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleFormChange}
                    className={`w-full border ${
                      validationErrors.bookingDate ? "border-red-500" : "border-gray-300"
                    } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200`}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {validationErrors.bookingDate && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.bookingDate}</p>
                  )}
                </div>

                {/* Booking Time */}
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <FaClock className="mr-2 text-teal-500" />
                    Booking Time
                  </label>
                  <input
                    type="time"
                    name="bookingTime"
                    value={formData.bookingTime}
                    onChange={handleFormChange}
                    className={`w-full border ${
                      validationErrors.bookingTime ? "border-red-500" : "border-gray-300"
                    } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200`}
                  />
                  {validationErrors.bookingTime && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.bookingTime}</p>
                  )}
                </div>

                {/* User Details */}
                <div className="mb-5 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                    <FaInfoCircle className="mr-2 text-teal-500" />
                    Booking For
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-medium">Name:</span> {staticUser.name}</p>
                    <p><span className="font-medium">Email:</span> {staticUser.email}</p>
                    <p><span className="font-medium">Phone:</span> {staticUser.phone}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBookNow}
                    className="px-5 py-2.5 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition duration-300 flex items-center"
                  >
                    <span>Confirm Booking</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceSelection;