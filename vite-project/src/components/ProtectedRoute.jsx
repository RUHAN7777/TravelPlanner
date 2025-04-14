import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');

  if (!user) {
    // If no user is found, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the child component
  return children;
};

export default ProtectedRoute;
