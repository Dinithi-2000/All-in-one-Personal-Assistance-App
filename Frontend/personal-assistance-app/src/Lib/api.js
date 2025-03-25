// Frontend/personal-assistance-app/src/Lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8070", // Your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include authentication token if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Assuming you store JWT token in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const filterServiceProviders = (filters) =>
  api.get("/home/booking/service-providers/filter", { params: filters });

export const createBooking = (bookingData) =>
  api.post("/home/booking/create", bookingData);

export default api;