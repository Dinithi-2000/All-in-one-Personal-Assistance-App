// Frontend/personal-assistance-app/src/Pages/ServiceSelection.js
import React, { useState } from "react";
import useServiceProviders from "../Hooks/CustomHook/useServiceProviders";
import { createBooking } from "../../Lib/api";
import { motion } from "framer-motion"; // For smooth animations

const categories = [
  "Child Care",
  "Elder Care",
  "Kitchen Helpers",
  "Pet Care",
  "Tutoring",
  "House Cleaning",
];

// Define filter options for each category
const filterOptions = {
  "House Cleaning": {
    servicesOffered: [
      "BATHROOM CLEANING",
      "CARPET CLEANING",
      "KITCHEN CLEANING",
      "LAUNDRY",
      "WINDOWS CLEANING",
    ],
  },
  "Pet Care": {
    servicesOffered: [
      "WALKING",
      "DAY CARE",
      "GROOMING",
      "TRAINING",
      "OVERNIGHT SITTING",
      "TRANSPORT",
    ],
    petType: ["Dog", "Cat"],
  },
  "Child Care": {
    childAgeGroup: [
      "NEWBORN",
      "TODDLER",
      "PRE-SCHOOL",
      "PRIMARY SCHOOL",
      "TEENAGER(12+ YEARS)",
    ],
    numberOfChildren: [1, 2, 3, 4, 5],
    servicesOffered: [
      "DAY CARE",
      "AFTER SCHOOL CARE",
      "NANNIES",
      "BABY SITTERS",
      "IN-HOME CARE",
      "CHILDMINDERS",
    ],
  },
  Tutoring: {
    syllabus: ["LOCAL", "CAMBRIDGE", "EDXCEL"],
    grade: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    subjects: [
      "ART",
      "BUSINESS",
      "ICT",
      "MATHEMATICS",
      "PHYSICS",
      "SCIENCE",
      "MUSIC",
      "ENGLISH",
      "CHEMISTRY",
      "OTHER LANGUAGES",
    ],
  },
  "Elder Care": {
    servicesOffered: [
      "PERSONAL CARE",
      "TRANSPORTATION",
      "SPECIALIZED CARE",
      "HOSPICE CARE",
      "HOUSEHOLD TASKS",
      "NURSING & HEALTH CARE",
    ],
  },
  "Kitchen Helpers": {
    servicesOffered: [
      "BIRTHDAY",
      "FAMILY REUNION",
      "ALMS GIVING",
      "FRIENDS GATHERING",
      "FOODIE ADVENTURE",
      "OTHER",
    ],
  },
};

const languages = ["SINHALA", "ENGLISH", "TAMIL"];

const ServiceSelection = () => {
  const {
    category,
    setCategory,
    filters,
    updateFilters,
    toggleFilter,
    serviceProviders,
    loading,
    error,
  } = useServiceProviders();

  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const handleBookNow = async (providerID) => {
    setBookingError(null);
    setBookingSuccess(null);

    try {
      const customerID = localStorage.getItem("customerID"); // Replace with actual customer ID from auth
      if (!customerID) {
        setBookingError("Please log in to book a service provider");
        return;
      }

      const bookingData = {
        customerID,
        providerID,
        agreementDuration: "1 month", // You can make this dynamic
        bookingService: `${category} - ${filters.servicesOffered.join(", ") || "General"}`,
        monthlyPayment: 5000, // You can calculate this dynamically based on hourly rate
      };

      const response = await createBooking(bookingData);
      setBookingSuccess("Booking created successfully!");
      console.log(response.data);
    } catch (err) {
      setBookingError("Failed to create booking");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Category Tabs */}
      <div className="flex justify-center space-x-4 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              updateFilters({
                servicesOffered: [],
                categoryType: cat,
              });
            }}
            className={`px-4 py-2 rounded ${
              category === cat
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex">
        {/* Filters Section */}
        <div className="w-1/3 p-4 bg-gray-100 rounded-lg mr-4">
          <h2 className="text-lg font-bold mb-4">HOURLY PAY RATE RANGE</h2>
          <div className="flex items-center mb-4">
            <input
              type="range"
              min="500"
              max="2000"
              value={filters.minHourlyRate}
              onChange={(e) =>
                updateFilters({ minHourlyRate: parseInt(e.target.value) })
              }
              className="w-full"
            />
            <span className="ml-2">Min: Rs.{filters.minHourlyRate}</span>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="range"
              min="500"
              max="2000"
              value={filters.maxHourlyRate}
              onChange={(e) =>
                updateFilters({ maxHourlyRate: parseInt(e.target.value) })
              }
              className="w-full"
            />
            <span className="ml-2">Max: Rs.{filters.maxHourlyRate}</span>
          </div>

          {/* Category-Specific Filters */}
          {filterOptions[category]?.petType && (
            <div className="mb-4">
              <h3 className="font-semibold">Pet Type</h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions[category].petType.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleFilter("petType", type)}
                    className={`px-4 py-2 rounded ${
                      filters.petType?.includes(type)
                        ? "bg-blue-200"
                        : "bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filterOptions[category]?.childAgeGroup && (
            <div className="mb-4">
              <h3 className="font-semibold">Child Age Group</h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions[category].childAgeGroup.map((age) => (
                  <button
                    key={age}
                    onClick={() => toggleFilter("childAgeGroup", age)}
                    className={`px-4 py-2 rounded ${
                      filters.childAgeGroup?.includes(age)
                        ? "bg-blue-200"
                        : "bg-gray-200"
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filterOptions[category]?.numberOfChildren && (
            <div className="mb-4">
              <h3 className="font-semibold">Number of Children</h3>
              <select
                value={filters.numberOfChildren || 1}
                onChange={(e) =>
                  updateFilters({ numberOfChildren: parseInt(e.target.value) })
                }
                className="border rounded p-2"
              >
                {filterOptions[category].numberOfChildren.map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filterOptions[category]?.syllabus && (
            <div className="mb-4">
              <h3 className="font-semibold">Syllabus</h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions[category].syllabus.map((syl) => (
                  <button
                    key={syl}
                    onClick={() => toggleFilter("syllabus", syl)}
                    className={`px-4 py-2 rounded ${
                      filters.syllabus?.includes(syl)
                        ? "bg-blue-200"
                        : "bg-gray-200"
                    }`}
                  >
                    {syl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filterOptions[category]?.grade && (
            <div className="mb-4">
              <h3 className="font-semibold">Grade</h3>
              <select
                value={filters.grade || 1}
                onChange={(e) =>
                  updateFilters({ grade: parseInt(e.target.value) })
                }
                className="border rounded p-2"
              >
                {filterOptions[category].grade.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filterOptions[category]?.subjects && (
            <div className="mb-4">
              <h3 className="font-semibold">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions[category].subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => toggleFilter("subjects", subject)}
                    className={`px-4 py-2 rounded ${
                      filters.subjects?.includes(subject)
                        ? "bg-blue-200"
                        : "bg-gray-200"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <h3 className="font-semibold">Services Offered</h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions[category]?.servicesOffered.map((service) => (
                <button
                  key={service}
                  onClick={() => toggleFilter("servicesOffered", service)}
                  className={`px-4 py-2 rounded ${
                    filters.servicesOffered.includes(service)
                      ? "bg-blue-200"
                      : "bg-gray-200"
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold">Languages Spoken</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => toggleFilter("languagesSpoken", lang)}
                  className={`px-4 py-2 rounded ${
                    filters.languagesSpoken.includes(lang)
                      ? "bg-blue-200"
                      : "bg-gray-200"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full bg-teal-500 text-white py-2 rounded">
            Apply Filters
          </button>
        </div>

        {/* Service Providers List */}
        <div className="w-2/3 p-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {bookingError && <p className="text-red-500">{bookingError}</p>}
          {bookingSuccess && (
            <p className="text-green-500">{bookingSuccess}</p>
          )}
          {serviceProviders.length === 0 && !loading && (
            <p>No service providers found.</p>
          )}
          {serviceProviders.map((provider) => (
            <div
              key={provider.ProviderID}
              className="flex items-center p-4 mb-4 border rounded-lg"
            >
              <img
                src="https://via.placeholder.com/100" // Replace with actual image URL
                alt={provider.FirstName}
                className="w-24 h-24 rounded-full mr-4"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold">
                  {provider.FirstName} {provider.LastName}
                </h3>
                <p>{provider.Address || "Location not specified"}</p>
                <p>{provider.experience || "Experience not specified"}</p>
                <p>
                  "{provider.description || "No description available"}"
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">
                  from Rs.{provider.hourlyRate} per hour
                </p>
                <button
                  onClick={() => handleBookNow(provider.ProviderID)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  BOOK NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;