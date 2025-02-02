// ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

const RedirectRoute: React.FC<{ redirectPath?: string }> = ({
  redirectPath = "/",
}) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? <Navigate to={redirectPath} /> : <Outlet />;
};

export default RedirectRoute;
