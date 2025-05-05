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
  FaInfoCircle,
  FaLanguage,
  FaServicestack,
  FaVenusMars,
  FaBook,
  FaUsers,
  FaDog,
  FaChalkboardTeacher,
  FaTimes,
  FaSearch,
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
    const initialPayment = provider.payRate
      ? Math.round((provider.payRate[0] + provider.payRate[1]) / 2) * 10
      : 5000;

    setSelectedProvider(provider);
    setFormData((prev) => ({
      ...prev,
      monthlyPayment: initialPayment,
      bookingDate: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0],
      bookingTime: "10:00",
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

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.monthlyPayment) {
      errors.monthlyPayment = "Monthly payment is required";
    } else if (formData.monthlyPayment < 15000) {
      errors.monthlyPayment = "Monthly payment must be at least 15000";
    }

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
    ? serviceProviders.filter(
      (provider) =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.about.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.selectedLanguages.some((lang) =>
          lang.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        provider.selectedServices.some((service) =>
          service.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
    : serviceProviders;

  // Get current category object
  const currentCategory = categories.find((cat) => cat.id === category) || categories[0];
  const CategoryIcon = currentCategory.icon;

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 p-6 flex flex-col md:flex-row animate-pulse">
      <div className="md:w-1/4 lg:w-1/5 flex items-center justify-center p-6">
        <div className="w-28 h-28 bg-gray-200 rounded-full"></div>
      </div>
      <div className="flex-1 p-6">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            </div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans w-screen">
      {/* Notification Bar */}
      <AnimatePresence>
        {bookingSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <span>✓</span>
            <span>{bookingSuccess}</span>
          </motion.div>
        )}
        {bookingError && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <span>✕</span>
            <span>{bookingError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-700 text-white py-12 md:py-16 w-full">
        <div className="w-full px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
              Find Your Perfect Service Provider
            </h1>
            <p className="text-teal-100 text-lg md:text-xl mb-8">
              Discover professional and reliable assistance tailored to your needs.
            </p>

            {/* Search Bar */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by name, location, languages, or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-300 bg-white shadow-md transition-all duration-300"
                aria-label="Search service providers"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 py-10">
        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm p-2 mb-10 overflow-x-auto scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-gray-100"
        >
          <div className="flex min-w-max space-x-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center justify-center px-5 py-3 rounded-xl font-medium text-sm transition duration-300 whitespace-nowrap ${category === cat.id
                      ? "bg-teal-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-teal-50 hover:text-teal-700"
                    }`}
                  aria-label={`Select ${cat.label} category`}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Category Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center mb-8"
        >
          <div className="bg-teal-100 p-3 rounded-full shadow-sm">
            <CategoryIcon className="text-teal-600 text-2xl" />
          </div>
          <h2 className="ml-4 text-2xl md:text-3xl font-semibold text-gray-800">
            {currentCategory.label} Professionals
          </h2>
        </motion.div>

        {/* Service Providers List */}
        <div className="space-y-6">
          {loading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg"
            >
              <div className="flex items-center">
                <FaInfoCircle className="mr-2 h-5 w-5" />
                <p>{error}</p>
              </div>
            </motion.div>
          )}

          {!loading && filteredProviders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-12 rounded-lg text-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              <p className="font-medium text-lg">No service providers found for this category.</p>
              <p className="mt-2 text-gray-500">
                Try selecting a different category or adjusting your search.
              </p>
            </motion.div>
          )}

          {filteredProviders.map((provider) => (
            <motion.div
              key={provider._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 lg:w-1/5 bg-gray-50 flex items-center justify-center p-6">
                  <div className="relative group">
                    <img
                      src={provider.photo || "https://via.placeholder.com/150"}
                      alt={provider.name}
                      className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center shadow">
                      4.8 <FaStar className="inline ml-1 text-yellow-300" />
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{provider.name}</h3>
                      <div className="space-y-1 mt-2">
                        <p className="text-gray-600 flex items-center text-sm">
                          <FaMapMarkerAlt className="mr-2 text-teal-500 h-4 w-4" /> {provider.location}
                        </p>
                        <p className="text-gray-600 flex items-center text-sm">
                          <FaVenusMars className="mr-2 text-teal-500 h-4 w-4" /> {provider.gender}
                        </p>
                        <p className="text-gray-600 flex items-center text-sm">
                          <FaInfoCircle className="mr-2 text-teal-500 h-4 w-4" /> Availability:{" "}
                          <span
                            className={`ml-1 ${provider.availability === "yes" ? "text-green-600" : "text-red-600"
                              } font-medium`}
                          >
                            {provider.availability === "yes" ? "Available" : "Not Available"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <div className="text-lg font-bold text-teal-600">
                        Rs. {provider.payRate[0]} - {provider.payRate[1]}{" "}
                        <span className="text-sm font-normal text-gray-500">/ hour</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mt-4 text-sm leading-relaxed">{provider.about}</p>

                  {/* Additional Details */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Languages */}
                    <div>
                      <p className="text-gray-700 font-medium flex items-center text-sm">
                        <FaLanguage className="mr-2 text-teal-500 h-4 w-4" /> Languages
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {provider.selectedLanguages.map((lang, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full shadow-sm"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Services Offered */}
                    <div>
                      <p className="text-gray-700 font-medium flex items-center text-sm">
                        <FaServicestack className="mr-2 text-teal-500 h-4 w-4" /> Services Offered
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {provider.selectedServices.map((service, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full shadow-sm"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Category-Specific Details */}
                    {provider.serviceType === "PetCare" && provider.selectedPetTypes?.length > 0 && (
                      <div>
                        <p className="text-gray-700 font-medium flex items-center text-sm">
                          <FaDog className="mr-2 text-teal-500 h-4 w-4" /> Pet Types
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {provider.selectedPetTypes.map((petType, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full shadow-sm"
                            >
                              {petType}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {provider.serviceType === "Education" && (
                      <>
                        {provider.selectedSyllabi?.length > 0 && (
                          <div>
                            <p className="text-gray-700 font-medium flex items-center text-sm">
                              <FaBook className="mr-2 text-teal-500 h-4 w-4" /> Syllabi
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {provider.selectedSyllabi.map((syllabus, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full shadow-sm"
                                >
                                  {syllabus}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {provider.selectedSubjects?.length > 0 && (
                          <div>
                            <p className="text-gray-700 font-medium flex items-center text-sm">
                              <FaChalkboardTeacher className="mr-2 text-teal-500 h-4 w-4" /> Subjects
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {provider.selectedSubjects.map((subject, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full shadow-sm"
                                >
                                  {subject}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {provider.selectedGrades?.length > 0 && (
                          <div>
                            <p className="text-gray-700 font-medium flex items-center text-sm">
                              <FaBook className="mr-2 text-teal-500 h-4 w-4" /> Grades
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {provider.selectedGrades.map((grade, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full shadow-sm"
                                >
                                  {grade}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {(provider.serviceType === "ChildCare" || provider.serviceType === "ElderCare") &&
                      provider.selectedAgeGroups?.length > 0 && (
                        <div>
                          <p className="text-gray-700 font-medium flex items-center text-sm">
                            <FaUsers className="mr-2 text-teal-500 h-4 w-4" /> Age Groups
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {provider.selectedAgeGroups.map((ageGroup, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-pink-50 text-pink-700 text-xs font-medium rounded-full shadow-sm"
                              >
                                {ageGroup}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Book Now Button */}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => handleOpenModal(provider)}
                      className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      aria-label={`Book ${provider.name}`}
                    >
                      <span>Book Now</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6">
                <h2 id="modal-title" className="text-xl font-bold flex items-center">
                  <FaCalendarAlt className="mr-3 h-6 w-6" />
                  Book {selectedProvider?.name}
                </h2>
                <p className="text-teal-100 mt-1 text-sm">
                  Complete your booking details below
                </p>
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 text-white hover:text-teal-100 transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-gray-100">
                {/* Agreement Duration */}
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center text-sm">
                    <FaSignature className="mr-2 text-teal-500 h-4 w-4" />
                    Agreement Duration
                  </label>
                  <select
                    name="agreementDuration"
                    value={formData.agreementDuration}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 bg-gray-50"
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
                    <FaMoneyBillWave className="mr-2 text-teal-500 h-4 w-4" />
                    Monthly Payment (Rs.)
                  </label>
                  <div className="relative flex items-center border rounded-xl bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition duration-200">
                    <span className="pl-3 pr-1 text-gray-500">Rs.</span>
                    <input
                      type="number"
                      name="monthlyPayment"
                      value={formData.monthlyPayment}
                      onChange={handleFormChange}
                      className={`w-full border-none p-3 focus:outline-none focus:ring-0 bg-gray-50 ${validationErrors.monthlyPayment ? "text-red-500" : "text-gray-700"
                        }`}
                      min="15000"
                      step="100"
                      aria-label="Enter monthly payment"
                    />
                  </div>
                  {validationErrors.monthlyPayment && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.monthlyPayment}</p>
                  )}
                </div>

                {/* Booking Date */}
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center text-sm">
                    <FaCalendarAlt className="mr-2 text-teal-500 h-4 w-4" />
                    Booking Date
                  </label>
                  <input
                    type="date"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleFormChange}
                    className={`w-full border ${validationErrors.bookingDate ? "border-red-500" : "border-gray-300"
                      } rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 bg-gray-50`}
                    min={new Date().toISOString().split("T")[0]}
                    aria-label="Select booking date"
                  />
                  {validationErrors.bookingDate && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.bookingDate}</p>
                  )}
                </div>

                {/* Booking Time */}
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2 flex items-center text-sm">
                    <FaClock className="mr-2 text-teal-500 h-4 w-4" />
                    Booking Time
                  </label>
                  <input
                    type="time"
                    name="bookingTime"
                    value={formData.bookingTime}
                    onChange={handleFormChange}
                    className={`w-full border ${validationErrors.bookingTime ? "border-red-500" : "border-gray-300"
                      } rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 bg-gray-50`}
                    aria-label="Select booking time"
                  />
                  {validationErrors.bookingTime && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.bookingTime}</p>
                  )}
                </div>

                {/* User Details */}
                <div className="mb-5 bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                    <FaInfoCircle className="mr-2 text-teal-500 h-5 w-5" />
                    Booking For
                  </h3>
                  <div className="space-y-2 text-gray-600 text-sm">
                    <p>
                      <span className="font-medium">Name:</span> {staticUser.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {staticUser.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {staticUser.phone}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all duration-300 hover:shadow-md"
                    aria-label="Cancel booking"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBookNow}
                    className="px-5 py-2.5 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-all duration-300 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    aria-label="Confirm booking"
                  >
                    <span>Confirm Booking</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
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

export default ServiceSelection;