// import React from "react";
// import { Route, Routes, Navigate } from "react-router-dom";
// import Layout from "../Component/UI/Layout";
// import HomePage from "../Component/Pages/HomePage";
// import PrivateRoute from "./PrivateRoute";
// import PaymentDashboard from "../Component/Pages/PaymentDashboard";
// import { BackgroundGradient } from "../Component/UI/background-gradient";
// import PaymentMethod from "../Component/UI/PaymentMethod";
// import PaymentHistory from "../Component/UI/PaymentHistory";
// import RefundHistory from "../Component/UI/RefundHistory";
// import AdminRoute from "./AdminRoute";
// import AdminLayout from "../Component/UI/AdminDashboard/AdminLayout";
// import AdminDashboard from "../Component/Pages/Admindashboard/AdminDashboard";
// import LoginPage from "../Component/UI/LoginPage";
// import Overview from "../Component/Pages/Admindashboard/Overview";
// import AdminBookings from "../Component/Pages/Admindashboard/AdminBookings";
// import ServiceSelection from "../Component/Pages/ServiceSelection";

// import MyBookings from "../Component/Pages/MyBookings";
// import ProfitLoss from "../Component/Pages/Admindashboard/ProfitLoss";
// import SalaryCalculation from "../Component/Pages/Admindashboard/SalaryCalculation";
// import Transactions from "../Component/Pages/Admindashboard/Transactions";
// import ServicePage from "../Component/Pages/Admindashboard/ServicePage";
// import ProviderPage from "../Component/Pages/Admindashboard/ProviderPage";
// import RefundPage from "../Component/Pages/Admindashboard/RefundPage";
// import Settings from "../Component/Pages/Admindashboard/Settings";
// import Users from "../Component/Pages/Admindashboard/Users";
// import PaymentSuccess from "../Component/UI/PaymenSuccess";
// import PaymentCancel from "../Component/UI/PaymentCancel";

// import CreateAccount from '../Component/Pages/ServiceProvider/CreateSProviderAccount';
// import ServiceSelection1 from '../Component/Pages/ServiceProvider/ServiceSelection';
// import ServiceProviderDashboard from '../Component/Pages/ServiceProvider/ServiceProviderDashboard';


// import DeleteAccount from '../Component/Pages/ServiceProvider/DeleteSProviderAccount';
// import HouseCleaningService from '../Component/Pages/ServiceProvider/HouseCleaningService';
// import KitchenServiceSelection from '../Component/Pages/ServiceProvider/KitchenServiceSelection';
// import ElderCareService from '../Component/Pages/ServiceProvider/ElderCareServiceSelection';
// import PetCareService from '../Component/Pages/ServiceProvider/PetCareServiceSelection';
// import ChildCareService from '../Component/Pages/ServiceProvider/ChildCareServiceSelection';
// import EducationService from '../Component/Pages/ServiceProvider/EducationServiceSelection';

// import ServiceProviderProfile from '../Component/Pages/ServiceProvider/ServiceProviderProfile';
// import EditServiceProviderProfile from '../Component/Pages/ServiceProvider/ServiceProviderProfileEdit';
// import ServiceProviderHome from '../Component/Pages/ServiceProvider/HomePageApp';


// // You'll need to create this

// export default function AppRoutes({
//   isAuthenticated,
//   setIsAuthenticated,
//   isAdmin,
//   handleLogin,
// }) {
//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route path="/" element={<Layout />}>
//         <Route index element={<HomePage />} />
//         <Route path="/bookings" element={<AdminBookings />} />
//         <Route
//           path="/login"
//           element={<LoginPage handleLogin={handleLogin} />}
//         />

//         {/* Protected User Route */}
//         <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
//           <Route path="/payment" element={<PaymentDashboard />}>
//             <Route path="MakePayment" element={<BackgroundGradient />} />
//             <Route path="PaymentOption" element={<PaymentMethod />} />
//             <Route path="PaymentHistory" element={<PaymentHistory />} />
//             <Route path="RefundHistory" element={<RefundHistory />} />
//             <Route path="paymentSuccess" element={<PaymentSuccess />} />
//             <Route path="paymentCancel" element={<PaymentCancel />} />
//           </Route>
//           <Route path="/serviceselection" element={<ServiceSelection />} />
//           <Route path="/my-bookings" element={<MyBookings />} />


//           <Route path='/createaccount' element={<CreateAccount/>}/>
//     <Route path='/serviceselections' element={<ServiceSelection1/>}/>
//     <Route path='/spdashboard' element={<ServiceProviderDashboard />} />
    
//     <Route path='/deleteaccount' element={<DeleteAccount/>}/>
//     <Route path='/housecselection' element={<HouseCleaningService/>}/>
//     <Route path='/kitchensselection' element={<KitchenServiceSelection/>}/>
//     <Route path='/eldercselection' element={<ElderCareService/>}/>
//     <Route path='/petcaresselection' element={<PetCareService/>}/>
//     <Route path='/childcaresselection' element={<ChildCareService/>}/>
//     <Route path='/educationsselection' element={<EducationService/>}/>

//     <Route path='/viewspprofile' element={<ServiceProviderProfile/>}/>
//     <Route path='/editspprofile' element={<EditServiceProviderProfile/>}/>
//     <Route path='/spdashboard' element={<ServiceProviderHome/>}/>

//         </Route>
//       </Route>

//       {/* Admin Route */}

//       <Route
//         path="/admin"
//         element={
//           <AdminRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
//         }
//       >
//         <Route element={<AdminLayout />}>
//           <Route index element={<Overview />} />
//           <Route path="user" element={<Users />} />
//           <Route path="servicePage" element={<ServicePage />} />
//           <Route path="transaction" element={<Transactions />} />
//           <Route path="provider" element={<ProviderPage />} />
//           <Route path="profitLoss" element={<ProfitLoss />} />
//           <Route path="salary" element={<SalaryCalculation />} />
//           <Route path="refund" element={<RefundPage />} />
//           <Route path="setting" element={<Settings />} />
//           <Route path="bookings" element={<AdminBookings />} />{" "}
//           {/* New route */}
//         </Route>
//       </Route>

//       {/* Catch-all Route */}
//       <Route path="*" element={<Navigate to="/" />} />
//     </Routes>
//   );
// }

//================================

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../Component/Pages/Login"
import Signup from "../Component/Pages/Signup";
import Dashboard from "../Component/Pages/Dashboard";
import ProtectedRoute from "../Routes/ProtectedRoute";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
// import Profile from "pages/Profile";
// import ServicePage from './pages/Services'
// import ServiceSelection from "./Component/ServiceProvider/ServiceSelection";
// import HouseCleaningService from "Component/ServiceProvider/HouseCleaningService";
// import KitchenServiceSelection from "Component/ServiceProvider/KitchenServiceSelection";
// import ChildCareService from "Component/ServiceProvider/ChildCareServiceSelection";
// import ElderCareService from "Component/ServiceProvider/ElderCareServiceSelection";
// import PetCareService from "Component/ServiceProvider/PetCareServiceSelection";
// import EducationService from "Component/ServiceProvider/EducationServiceSelection";
// import CreateAccount from "Component/ServiceProvider/CreateSProviderAccount";
// import ServiceProviders from "pages/ServiceProviders";
// import MyBookings from "pages/Bookings";

import ServiceProviderHome from '../Component/Pages/ServiceProvider/HomePageApp';
import ServiceSelection from "../Component/Pages/ServiceSelection";
import MyBookings from "../Component/Pages/MyBookings";
import PaymentDashboard from "../Component/Pages/PaymentDashboard";


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
        {/* <Route
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
        /> */}
        {/* <Route
          path="/spdashboard"
          element={
            <ProtectedRoute>
              <ServiceProviderHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/serviceselection"
          element={
            <ProtectedRoute>
              <ServiceSelection />
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
        /> */}
        {/* <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentDashboard />
            </ProtectedRoute>
          }
        /> */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
