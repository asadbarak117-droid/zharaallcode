import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Mother from "./Admin/mother";
import AdminLogin from "./Admin/AdminLogin";
import UserManagement from "./Admin/UserManagement";

import WebManagement from "./Admin/webmagment";
import HomeManagement from "./Admin/homemangemet";
import ProductManagement from "./Admin/productmagment";
import HeaderManagement from "./Admin/headrmangemet";
import ConectMagment from "./Admin/conectmagment";
import ConsultationManagement from "./Admin/consultationmangment";
import DatabaseFront from "./Admin/databasefront";

import PublicApp from "./Public/app1";

// Check admin login
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token || token === "undefined" || token === "null") {
    localStorage.removeItem("adminToken");
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

// Admin logout
function AdminLogout() {
  useEffect(() => {
    localStorage.removeItem("adminToken");
  }, []);

  return <Navigate to="/admin/login" replace />;
}

// Admin routes
function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Logout */}
      <Route path="/admin/logout" element={<AdminLogout />} />

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Mother />
          </ProtectedRoute>
        }
      />

      {/* Website Management */}
      <Route
        path="/admin/website"
        element={
          <ProtectedRoute>
            <WebManagement />
          </ProtectedRoute>
        }
      />

      {/* Home Management */}
      <Route
        path="/admin/website/home"
        element={
          <ProtectedRoute>
            <HomeManagement />
          </ProtectedRoute>
        }
      />

      {/* Product Management */}
      <Route
        path="/admin/website/product"
        element={
          <ProtectedRoute>
            <ProductManagement />
          </ProtectedRoute>
        }
      />

      {/* Header Management */}
      <Route
        path="/admin/website/header"
        element={
          <ProtectedRoute>
            <HeaderManagement />
          </ProtectedRoute>
        }
      />

      {/* Connect Management */}
      <Route
        path="/admin/website/connect"
        element={
          <ProtectedRoute>
            <ConectMagment />
          </ProtectedRoute>
        }
      />

      {/* Consultation Management */}
      <Route
        path="/admin/website/consultation"
        element={
          <ProtectedRoute>
            <ConsultationManagement />
          </ProtectedRoute>
        }
      />

      {/* Database */}
      <Route
        path="/admin/database"
        element={
          <ProtectedRoute>
            <DatabaseFront />
          </ProtectedRoute>
        }
      />

      {/* User Management */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        }
      />

      {/* Unknown Admin Route */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

// Main App
function App() {
  const isAdminDomain =
    window.location.hostname === "beautyonlineshop-manager.vercel.app";

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isAdminDomain) {
      // Require login whenever admin app opens or refreshes
      localStorage.removeItem("adminToken");
    }

    setInitialized(true);
  }, [isAdminDomain]);

  if (!initialized) {
    return null;
  }

  return (
    <BrowserRouter>
      {isAdminDomain ? (
        <AdminRoutes />
      ) : (
        <Routes>
          <Route path="/*" element={<PublicApp />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
