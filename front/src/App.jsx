import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useState } from "react";

import Mother from "./Admin/mother";
import AdminLogin from "./Admin/AdminLogin";
import WebManagement from "./Admin/webmagment";
import HomeManagement from "./Admin/homemangemet";
import ProductManagement from "./Admin/productmagment";
import HeaderManagement from "./Admin/headrmangemet";
import ConectMagment from "./Admin/conectmagment";
import ConsultationManagement from "./Admin/consultationmangment";
import DatabaseFront from "./Admin/databasefront";

import PublicApp from "./Public/app1";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("adminToken");

  return isLoggedIn ? children : <Navigate to="/admin/login" replace />;
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Mother />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/website"
        element={
          <ProtectedRoute>
            <WebManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/website/home"
        element={
          <ProtectedRoute>
            <HomeManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/website/product"
        element={
          <ProtectedRoute>
            <ProductManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/website/header"
        element={
          <ProtectedRoute>
            <HeaderManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/website/connect"
        element={
          <ProtectedRoute>
            <ConectMagment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/website/consultation"
        element={
          <ProtectedRoute>
            <ConsultationManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/database"
        element={
          <ProtectedRoute>
            <DatabaseFront />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <div>User Management - Coming Soon</div>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

function App() {
  const isAdminDomain =
    window.location.hostname === "beautyonlineshop-manager.vercel.app";

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
