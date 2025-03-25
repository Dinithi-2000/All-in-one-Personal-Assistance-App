import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../Component/UI/Layout";
import HomePage from "../Component/Pages/HomePage";
import PrivateRoute from "./PrivateRoute";
import PaymentDashboard from "../Component/Pages/PaymentDashboard";
import { BackgroundGradient } from "../Component/UI/background-gradient";
import PaymentMethod from "../Component/UI/PaymentMethod";
import PaymentHistory from "../Component/UI/PaymentHistory";
import RefundHistory from "../Component/UI/RefundHistory";

export default function AppRoutes({ isAuthenticated, setIsAuthenticated }) {
  return (
    <Routes>
      {/*set public route*/}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />}></Route>
        {/*<Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated}/>}>login</Route>*/}
        {/*Protected Path*/}
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/payment" element={<PaymentDashboard />}>
            <Route path="MakePayment" element={<BackgroundGradient />} />
            <Route path="PaymentOption" element={<PaymentMethod />} />
            <Route path="PaymentHistory" element={<PaymentHistory />} />
            <Route path="RefundHistory" element={<RefundHistory />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
