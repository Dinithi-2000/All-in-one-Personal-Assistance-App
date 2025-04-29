import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./Routes/ProtectedRoute";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Profile from "pages/Profile";
import ServicePage from './pages/Services'
import ServiceSelection from "./Component/ServiceProvider/ServiceSelection";
import HouseCleaningService from "Component/ServiceProvider/HouseCleaningService";
import KitchenServiceSelection from "Component/ServiceProvider/KitchenServiceSelection";
import ChildCareService from "Component/ServiceProvider/ChildCareServiceSelection";
import ElderCareService from "Component/ServiceProvider/ElderCareServiceSelection";
import PetCareService from "Component/ServiceProvider/PetCareServiceSelection";
import EducationService from "Component/ServiceProvider/EducationServiceSelection";
import CreateAccount from "Component/ServiceProvider/CreateSProviderAccount";
import ServiceProviders from "pages/ServiceProviders";
import MyBookings from "pages/Bookings";


function AuthRedirector() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp * 1000 > Date.now()) {
      
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
        }
      } catch (error) {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
      }
    }

    setLoading(false);
  }, []);

  if (loading) return null; // Or a loading spinner

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/signin" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/service-selections" element={<ServiceSelection />} /> */}
        <Route path="/" element={<AuthRedirector />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ServicePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/service-selections"
          element={
            <ProtectedRoute>
              <ServiceSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/housec-selection"
          element={
            <ProtectedRoute>
              <HouseCleaningService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kitchens-selection"
          element={
            <ProtectedRoute>
              <KitchenServiceSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/childcares-selection"
          element={
            <ProtectedRoute>
              <ChildCareService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/elderc-selection"
          element={
            <ProtectedRoute>
              <ElderCareService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/petcares-selection"
          element={
            <ProtectedRoute>
              <PetCareService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/educations-selection"
          element={
            <ProtectedRoute>
              <EducationService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-service"
          element={
            <ProtectedRoute>
              <CreateAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hire-services"
          element={
            <ProtectedRoute>
              <ServiceProviders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
