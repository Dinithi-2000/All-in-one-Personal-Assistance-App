import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./Routes/ProtectedRoute";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Login from "./Component/Pages/Login";
import Signup from "./Component/Pages/Signup";
import Dashboard from "./Component/Pages/Dashboard";
import CreateAccount from "./Component/Pages/ServiceProvider/CreateSProviderAccount";
import ServiceSelection from "./Component/Pages/ServiceSelection";
import Profile from "./Component/Pages/Profile";
import ServiceProviderDashboard from "./Component/Pages/ServiceProvider/ServiceProviderDashboard";

import ServiceSelection1 from "./Component/Pages/ServiceProvider/ServiceSelection";
import HouseCleaningService from "./Component/Pages/ServiceProvider/HouseCleaningService";
import KitchenServiceSelection from "./Component/Pages/ServiceProvider/KitchenServiceSelection";
import ElderCareService from "./Component/Pages/ServiceProvider/ElderCareServiceSelection";
import PetCareService from "./Component/Pages/ServiceProvider/PetCareServiceSelection";
import ChildCareService from "./Component/Pages/ServiceProvider/ChildCareServiceSelection";
import EducationService from "./Component/Pages/ServiceProvider/EducationServiceSelection";

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
        <Route path="/createaccount"element={<CreateAccount />}/>
        <Route path="/serviceselections"element={<ServiceSelection1 />}/>
        <Route path='/housecselection' element={<HouseCleaningService/>}/>
        <Route path='/kitchensselection' element={<KitchenServiceSelection/>}/>
        <Route path='/eldercselection' element={<ElderCareService/>}/>
        <Route path='/petcaresselection' element={<PetCareService/>}/>
        <Route path='/childcaresselection' element={<ChildCareService/>}/>
        <Route path='/educationsselection' element={<EducationService/>}/>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spdashboard"
          element={
            <ProtectedRoute>
              <ServiceProviderDashboard />
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
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
