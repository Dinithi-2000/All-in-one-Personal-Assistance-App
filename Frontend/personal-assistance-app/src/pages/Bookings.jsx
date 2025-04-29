import React, { useEffect, useState } from "react";
import api from "Lib/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import NavBar from "Component/UI/NavBar";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/booking/get-my-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      Swal.fire("Error", "Failed to load your bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar user={userData} handleLogout={handleLogout} />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-[#003366] mb-6">My Bookings</h1>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            You have no bookings.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-md p-5 space-y-2"
              >
                <h2 className="text-xl font-semibold text-[#003366]">
                  {booking.serviceId?.serviceType || "Unknown Service"}
                </h2>
                <p className="text-gray-700">
                  <strong>Provider:</strong>{" "}
                  {booking.providerId?.fullName || "Unknown"}
                </p>
                <p className="text-gray-700">
                  <strong>Agreement:</strong> {booking.agreementDuration}
                </p>
                <p className="text-gray-700">
                  <strong>Monthly Payment:</strong> Rs. {booking.monthlyPayment}
                </p>
                <p className="text-gray-700">
                  <strong>Date:</strong>{" "}
                  {new Date(booking.bookingDate).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <strong>Time:</strong> {booking.bookingTime}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
