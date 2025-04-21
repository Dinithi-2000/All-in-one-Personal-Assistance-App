import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "../Component/UI/Layout";
import HomePage from "../Component/Pages/HomePage";
import PrivateRoute from "./PrivateRoute";
import PaymentDashboard from "../Component/Pages/PaymentDashboard";
import { BackgroundGradient } from "../Component/UI/background-gradient";
import PaymentMethod from "../Component/UI/PaymentMethod";
import PaymentHistory from "../Component/UI/PaymentHistory";
import RefundHistory from "../Component/UI/RefundHistory";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../Component/UI/AdminDashboard/AdminLayout";
import AdminDashboard from "../Component/Pages/Admindashboard/AdminDashboard";
import LoginPage from "../Component/UI/LoginPage";
import Overview from "../Component/Pages/Admindashboard/Overview";
import AdminBookings from "../Component/Pages/Admindashboard/AdminBookings";
import ServiceSelection from "../Component/Pages/ServiceSelection";

import MyBookings from "../Component/Pages/MyBookings";
import ProfitLoss from "../Component/Pages/Admindashboard/ProfitLoss";
import SalaryCalculation from "../Component/Pages/Admindashboard/SalaryCalculation";
import Transactions from "../Component/Pages/Admindashboard/Transactions";
import ServicePage from "../Component/Pages/Admindashboard/ServicePage";
import ProviderPage from "../Component/Pages/Admindashboard/ProviderPage";
import RefundPage from "../Component/Pages/Admindashboard/RefundPage";
import Settings from "../Component/Pages/Admindashboard/Settings";
import Users from "../Component/Pages/Admindashboard/Users";


// You'll need to create this

export default function AppRoutes({
  isAuthenticated,
  setIsAuthenticated,
  isAdmin,
  handleLogin,
}) {
  return (
    
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/bookings" element={<AdminBookings />} />
        <Route
          path="/login"
          element={<LoginPage handleLogin={handleLogin} />}
        />

        {/* Protected User Route */}
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/payment" element={<PaymentDashboard />}>
            <Route path="MakePayment" element={<BackgroundGradient />} />
            <Route path="PaymentOption" element={<PaymentMethod />} />
            <Route path="PaymentHistory" element={<PaymentHistory />} />
            <Route path="RefundHistory" element={<RefundHistory />} />
          </Route>
          <Route path="/serviceselection" element={<ServiceSelection />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          
        </Route>
      </Route>


      {/* Admin Route */}
     
<Route
        path="/admin"
        element={
          <AdminRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
        }
      >
        <Route element={<AdminLayout />}>
          <Route index element={<Overview />} />
          <Route path="user" element={<Users />} />
          <Route path="servicePage" element={<ServicePage />} />
          <Route path="transaction" element={<Transactions />} />
          <Route path="provider" element={<ProviderPage />} />
          <Route path="profitLoss" element={<ProfitLoss />} />
          <Route path="salary" element={<SalaryCalculation />} />
          <Route path="refund" element={<RefundPage />} />
          <Route path="setting" element={<Settings />} />
          <Route path="bookings" element={<AdminBookings />} /> {/* New route */}
        </Route>
      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
