import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ userType }) => {
  const { isAuthenticated, userType: currentUserType } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const allowedTypes = Array.isArray(userType) ? userType : [userType];
  if (!allowedTypes.includes(currentUserType)) {
    // Redirect based on user type or to home if unauthorized
    switch (currentUserType) {
      case 'sp':
        return <Navigate to="/spdashboard" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'user':
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;