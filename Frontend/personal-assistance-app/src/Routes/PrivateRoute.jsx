import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute({ isAuthenticated }) {
  //if user login only can navigate to others
  const location = useLocation();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
