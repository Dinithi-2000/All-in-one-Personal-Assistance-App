import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "Lib/api";
import Swal from "sweetalert2";
import NavBar from "Component/UI/NavBar";

const PLACEHOLDER = "/Images/service-placeholder.png";

const categories = [
  "ALL",
  "ChildCare",
  "ElderCare",
  "KitchenHelpers",
  "PetCare",
  "Education",
  "HouseCleaning",
];

export default function BrowseServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [userData, setUserData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [formData, setFormData] = useState({
    agreementDuration: "1 month",
    monthlyPayment: "",
    bookingDate: "",
    bookingTime: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user) {
      setUserData(user);
    }
    fetchServices(selectedCategory);
  }, [selectedCategory]);

  const fetchServices = async (category) => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    try {
      const res = await api.get("/service/get-services", {
        params: { serviceType: category },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setServices(data);
    } catch (err) {
      console.error("Failed to load services:", err);
      Swal.fire("Error", "Could not fetch services.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/");
  };

  const handleBooking = (service) => {
    setSelectedProvider(service);
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProvider(null);
    setFormData({
      agreementDuration: "1 month",
      monthlyPayment: "",
      bookingDate: "",
      bookingTime: "",
    });
    setValidationErrors({});
  };

  const handleBookNow = async() => {
    const errors = {};
    if (!formData.monthlyPayment) errors.monthlyPayment = "Required";
    if (!formData.bookingDate) errors.bookingDate = "Required";
    if (!formData.bookingTime) errors.bookingTime = "Required";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
        const response = await api.post(
          "/booking/book-service",
          {
            providerId: selectedProvider.userId,
            serviceId: selectedProvider._id,
            agreementDuration: formData.agreementDuration,
            monthlyPayment: parseFloat(formData.monthlyPayment),
            bookingDate: formData.bookingDate,
            bookingTime: formData.bookingTime,
            status: "PENDING",
            payments: [],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if(response.status == 200){
            Swal.fire("Success", "Booking Created!", "success");
            handleCloseModal();
        }else{
            console.log(response.data.message);
            
            Swal.fire("Error",response.data.message, "error");
        }
    
        Swal.fire("Success", "Booking Created!", "success");
        handleCloseModal();
      } catch (err) {
        console.error("Booking failed", err);
        Swal.fire("Error", err.response.data.message, "info");
      }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar handleLogout={handleLogout} user={userData} />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-[#003366] mb-6">
            Browse Services
          </h1>

          <div className="mb-6">
            <label className="mr-3 font-medium text-gray-700">
              Filter by Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center text-gray-500">
              No services found for "{selectedCategory}"
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-105 transition"
                >
                  <img
                    src={service.photo || PLACEHOLDER}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-[#003366] mb-1">
                      {service.serviceType}
                    </h2>
                    <p className="text-gray-600 text-sm mb-3">
                      {service.createdAt}
                    </p>
                    {Array.isArray(service.payRate) &&
                    service.payRate.length === 2 ? (
                      <p className="text-teal-600 font-semibold">
                        Rs. {service.payRate[0]} - Rs. {service.payRate[1]}
                      </p>
                    ) : (
                      <p className="text-gray-500">No rate info</p>
                    )}
                    <button
                      onClick={() => handleBooking(service)}
                      className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                    >
                      Booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Book {selectedProvider?.serviceType}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Agreement Duration
              </label>
              <select
                name="agreementDuration"
                value={formData.agreementDuration}
                onChange={handleFormChange}
                className="w-full border rounded-md p-2"
              >
                <option value="1 month">1 Month</option>
                <option value="3 months">3 Months</option>
                <option value="6 months">6 Months</option>
                <option value="1 year">1 Year</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Monthly Payment (Rs.)
              </label>
              <input
                type="number"
                name="monthlyPayment"
                value={formData.monthlyPayment}
                onChange={handleFormChange}
                className={`w-full border rounded-md p-2 ${
                  validationErrors.monthlyPayment ? "border-red-500" : ""
                }`}
                min="1000"
                step="100"
              />
              {validationErrors.monthlyPayment && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.monthlyPayment}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Booking Date
              </label>
              <input
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleFormChange}
                className={`w-full border rounded-md p-2 ${
                  validationErrors.bookingDate ? "border-red-500" : ""
                }`}
                min={new Date().toISOString().split("T")[0]}
              />
              {validationErrors.bookingDate && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.bookingDate}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Booking Time
              </label>
              <input
                type="time"
                name="bookingTime"
                value={formData.bookingTime}
                onChange={handleFormChange}
                className={`w-full border rounded-md p-2 ${
                  validationErrors.bookingTime ? "border-red-500" : ""
                }`}
              />
              {validationErrors.bookingTime && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.bookingTime}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleBookNow}
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition duration-300"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for viewing service details */}
      {showModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative shadow-lg">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-[#003366] mb-4">
              {selectedService.serviceType}
            </h2>
            <img
              src={selectedService.photo || PLACEHOLDER}
              alt="Service"
              className="w-full h-56 object-cover rounded mb-4"
            />
            <p>
              <strong>Description:</strong>{" "}
              {selectedService.description || "No description available."}
            </p>
            <p>
              <strong>Pay Range:</strong> ${selectedService.payRate?.[0]} - $
              {selectedService.payRate?.[1]}
            </p>
            <p>
              <strong>Posted:</strong>{" "}
              {new Date(selectedService.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
