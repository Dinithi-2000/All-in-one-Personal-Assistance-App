import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Lib/api";
import NavBar from "../UI/NavBar";
import Swal from "sweetalert2";
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

const BookmarkPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [serviceProviders, setServiceProviders] = useState([]);
  
    const fetchBookmarks = useCallback(async () => {
        const token = localStorage.getItem("authToken");
        setIsLoading(true);
        try {
          const res = await api.get("/api/user/bookmark/my-bookmarks",
            {
                headers: { Authorization: `Bearer ${token}` },
            },
          ); 
          const providers = res.data.map((item) => item.providerID); 
          setServiceProviders(providers);
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
          await api.delete(`/api/user/bookmark/remove-bookmark?providerID=${provider._id}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            },
          );
          setServiceProviders((prev) => prev.filter(p => p._id !== provider._id));
          Swal.fire("Removed", `${provider.name} was removed from your bookmarks.`, "success");
        } catch (error) {
          console.error("Failed to remove bookmark", error);
          Swal.fire("Error", "Could not remove bookmark.", "error");
        }
      };
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/");
  };

  // parse userData for NavBar
  const navUser = JSON.parse(localStorage.getItem("userData") || "null");

  if (!isLoading && serviceProviders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-600">
        <NavBar handleLogout={handleLogout} user={navUser} />
        <div className="mt-20 text-center">
          <FaSearch className="text-4xl text-teal-500 mb-4" />
          <h2 className="text-2xl font-semibold">No Bookmarked Providers</h2>
          <p className="mt-2 text-sm text-gray-500">
            You haven't bookmarked any service providers yet.
          </p>
        </div>
      </div>
    );
  }

 

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar handleLogout={handleLogout} user={navUser} />

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {serviceProviders.map((provider) => (
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
                      <h3 className="text-xl font-bold text-gray-800">
                        {provider.name}
                      </h3>
                      <div className="space-y-1 mt-2">
                        <p className="text-gray-600 flex items-center text-sm">
                          <FaMapMarkerAlt className="mr-2 text-teal-500 h-4 w-4" />{" "}
                          {provider.location}
                        </p>
                        <p className="text-gray-600 flex items-center text-sm">
                          <FaVenusMars className="mr-2 text-teal-500 h-4 w-4" />{" "}
                          {provider.gender}
                        </p>
                        <p className="text-gray-600 flex items-center text-sm">
                          <FaInfoCircle className="mr-2 text-teal-500 h-4 w-4" />{" "}
                          Availability:{" "}
                          <span
                            className={`ml-1 ${
                              provider.availability === "yes"
                                ? "text-green-600"
                                : "text-red-600"
                            } font-medium`}
                          >
                            {provider.availability === "yes"
                              ? "Available"
                              : "Not Available"}
                          </span>
                        </p>
                      </div>
                    </div>
                    {/* <div className="mt-4 md:mt-0 text-right">
                      <div className="text-lg font-bold text-teal-600">
                        Rs. {provider.payRate[0]} - {provider.payRate[1]}{" "}
                        <span className="text-sm font-normal text-gray-500">
                          / hour
                        </span>
                      </div>
                    </div> */}
                  </div>

                  <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                    {provider.about}
                  </p>

                  {/* Additional Details */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Languages */}
                    <div>
                      <p className="text-gray-700 font-medium flex items-center text-sm">
                        <FaLanguage className="mr-2 text-teal-500 h-4 w-4" />{" "}
                        Languages
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
                        <FaServicestack className="mr-2 text-teal-500 h-4 w-4" />{" "}
                        Services Offered
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
                    {provider.serviceType === "PetCare" &&
                      provider.selectedPetTypes?.length > 0 && (
                        <div>
                          <p className="text-gray-700 font-medium flex items-center text-sm">
                            <FaDog className="mr-2 text-teal-500 h-4 w-4" /> Pet
                            Types
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
                              <FaBook className="mr-2 text-teal-500 h-4 w-4" />{" "}
                              Syllabi
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {provider.selectedSyllabi.map(
                                (syllabus, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full shadow-sm"
                                  >
                                    {syllabus}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                        {provider.selectedSubjects?.length > 0 && (
                          <div>
                            <p className="text-gray-700 font-medium flex items-center text-sm">
                              <FaChalkboardTeacher className="mr-2 text-teal-500 h-4 w-4" />{" "}
                              Subjects
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {provider.selectedSubjects.map(
                                (subject, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full shadow-sm"
                                  >
                                    {subject}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                        {provider.selectedGrades?.length > 0 && (
                          <div>
                            <p className="text-gray-700 font-medium flex items-center text-sm">
                              <FaBook className="mr-2 text-teal-500 h-4 w-4" />{" "}
                              Grades
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

                    {(provider.serviceType === "ChildCare" ||
                      provider.serviceType === "ElderCare") &&
                      provider.selectedAgeGroups?.length > 0 && (
                        <div>
                          <p className="text-gray-700 font-medium flex items-center text-sm">
                            <FaUsers className="mr-2 text-teal-500 h-4 w-4" />{" "}
                            Age Groups
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {provider.selectedAgeGroups.map(
                              (ageGroup, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-pink-50 text-pink-700 text-xs font-medium rounded-full shadow-sm"
                                >
                                  {ageGroup}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-4">
                    {/* Bookmark Button */}
                    <button
                      onClick={() => handleBookmark(provider)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      aria-label={`Bookmark ${provider.name}`}
                    >
                      <span>Bookmark</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.184 3.64h3.832c.969 0 1.371 1.24.588 1.81l-3.1 2.254 1.184 3.64c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.1 2.254c-.784.57-1.838-.197-1.539-1.118l1.183-3.64-3.1-2.254c-.783-.57-.38-1.81.588-1.81h3.832l1.184-3.64z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
    </div>

    </div>
  );
};



export default BookmarkPage;