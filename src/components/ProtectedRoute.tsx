// ProtectedRoute.tsx
import React from 'react';
import {Navigate, Outlet } from 'react-router-dom';
import {useAuth } from "../contexts/AuthContext";

const ProtectedRoute: React.FC<{ redirectPath?: string }> = ({ redirectPath = '/auth/login' }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    // You can show a loading spinner or similar here
    return <div>Loading...</div>;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to={redirectPath} />;
};

export default ProtectedRoute;
