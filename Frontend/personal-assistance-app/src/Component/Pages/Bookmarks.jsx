import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Lib/api";
import NavBar from "../UI/NavBar";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaVenusMars,
  FaInfoCircle,
  FaLanguage,
  FaServicestack,
  FaDog,
  FaBook,
  FaChalkboardTeacher,
  FaUsers,
  FaStar,
  FaTimes,
  FaFilter
} from "react-icons/fa";

const BookmarkPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [serviceTypeFilter, setServiceTypeFilter] = useState("All");

  const fetchBookmarks = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    setIsLoading(true);
    try {
      const res = await api.get("/api/user/bookmark/my-bookmarks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServiceProviders(res.data.map((item) => item.providerID));
    } catch (error) {
      console.error("Failed to fetch bookmarks", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load bookmarked service providers.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleBookmark = async (provider) => {
    const token = localStorage.getItem("authToken");
    try {
      const result = await Swal.fire({
        title: "Remove Bookmark?",
        text: `Do you want to remove ${provider.name} from your bookmarks?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0d9488",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Yes, remove",
      });

      if (result.isConfirmed) {
        await api.delete(`/api/user/bookmark/remove-bookmark?providerID=${provider._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServiceProviders((prev) => prev.filter((p) => p._id !== provider._id));
        Swal.fire({
          icon: "success",
          title: "Removed",
          text: `${provider.name} was removed from your bookmarks.`,
        });
      }
    } catch (error) {
      console.error("Failed to remove bookmark", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not remove bookmark.",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/");
  };

  const navUser = JSON.parse(localStorage.getItem("userData") || "null");

  // Get unique service types for the filter dropdown
  const serviceTypes = ["All", ...new Set(serviceProviders.map((provider) => provider.serviceType))];

  // Filter providers based on service type
  const filteredProviders = serviceTypeFilter === "All"
    ? serviceProviders
    : serviceProviders.filter((provider) => provider.serviceType === serviceTypeFilter);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <NavBar handleLogout={handleLogout} user={navUser} />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-500"></div>
        </div>
      </div>
    );
  }

  if (filteredProviders.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <NavBar handleLogout={handleLogout} user={navUser} />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <FaSearch className="text-5xl text-teal-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">
            {serviceTypeFilter === "All" ? "No Bookmarked Providers" : `No ${serviceTypeFilter} Providers`}
          </h2>
          <p className="mt-2 text-gray-500">
            {serviceTypeFilter === "All"
              ? "You haven't bookmarked any service providers yet."
              : `No bookmarked providers found for ${serviceTypeFilter}.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar handleLogout={handleLogout} user={navUser} />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Bookmarked Providers</h1>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <FaFilter className="text-teal-600" />
            <select
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {serviceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <AnimatePresence>
      {filteredProviders.map((provider) => (
        <motion.div
          key={provider._id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-32 bg-gray-100 flex items-center justify-center p-4">
              <div className="relative">
                <img
                  src={provider.photo || "https://via.placeholder.com/150"}
                  alt={provider.name}
                  className="w-20 h-20 object-cover rounded-full border-2 border-teal-100"
                />
                <span className="absolute bottom-0 right-0 bg-teal-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  4.8 <FaStar className="ml-1 text-yellow-300" />
                </span>
              </div>
            </div>
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{provider.name}</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-teal-500" /> {provider.location}
                    </p>
                    <p className="flex items-center">
                      <FaVenusMars className="mr-2 text-teal-500" /> {provider.gender}
                    </p>
                    <p className="flex items-center">
                      <FaInfoCircle className="mr-2 text-teal-500" /> Availability:{" "}
                      <span
                        className={`ml-1 font-medium ${
                          provider.availability === "yes" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {provider.availability === "yes" ? "Available" : "Not Available"}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleBookmark(provider)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Remove bookmark for ${provider.name}`}
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">{provider.about}</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 flex items-center">
                    <FaLanguage className="mr-2 text-teal-500" /> Languages
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {provider.selectedLanguages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-teal-100 text-teal-700 text-xs Rounded-full"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 flex items-center">
                    <FaServicestack className="mr-2 text-teal-500" /> Services
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {provider.selectedServices.map((service, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                {provider.serviceType === "PetCare" && provider.selectedPetTypes?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 flex items-center">
                      <FaDog className="mr-2 text-teal-500" /> Pet Types
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {provider.selectedPetTypes.map((petType, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
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
                        <p className="text-sm font-medium text-gray-700 flex items-center">
                          <FaBook className="mr-2 text-teal-500" /> Syllabi
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {provider.selectedSyllabi.map((syllabus, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                            >
                              {syllabus}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {provider.selectedSubjects?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 flex items-center">
                          <FaChalkboardTeacher className="mr-2 text-teal-500" /> Subjects
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {provider.selectedSubjects.map((subject, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {provider.selectedGrades?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 flex items-center">
                          <FaBook className="mr-2 text-teal-500" /> Grades
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {provider.selectedGrades.map((grade, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
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
                      <p className="text-sm font-medium text-gray-700 flex items-center">
                        <FaUsers className="mr-2 text-teal-500" /> Age Groups
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {provider.selectedAgeGroups.map((ageGroup, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full"
                          >
                            {ageGroup}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
</div>
</div>
);
};

export default BookmarkPage;