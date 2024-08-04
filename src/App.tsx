import React from "react";
import { Route, Routes } from "react-router-dom";

import { SnackbarProvider } from "notistack";

import { AuthProviderWrapper } from "./contexts/AuthContext";

import Login from "./pages/authPages/Login";
import Register from "./pages/authPages/Register";
import ForgotPassword from "./pages/authPages/ForgotPassword";
import ResetPassword from "./pages/authPages/ResetPassword";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import RedirectRoute from "./components/RedirectRoute";

import Facilities from "./components/FacilityList";
import Monitoring from "./components/Monitoring";

import "./App.css";

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <AuthProviderWrapper>
        <Routes>
          <Route element={<RedirectRoute />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/auth/reset-password/:token"
              element={<ResetPassword />}
            />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Facilities />} /> {/* Default view */}
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/monitoring/:facilityId" element={<Monitoring />} />
            </Route>
          </Route>
        </Routes>
      </AuthProviderWrapper>
    </SnackbarProvider>
  );
}

export default App;
