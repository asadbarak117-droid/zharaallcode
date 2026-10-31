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

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token || token === "undefined" || token === "null") {
    localStorage.removeItem("adminToken");
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function AdminLogout() {
  useEffect(() => {
    localStorage.removeItem("adminToken");
  }, []);

  return <Navigate to="/admin/login" replace />;
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin/logout" element={<AdminLogout />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Mother />
          </ProtectedRoute>
        }
      >
        <Route index element={null} />

        <Route path="website" element={<WebManagement />} />

        <Route path="website/home" element={<HomeManagement />} />

        <Route path="website/product" element={<ProductManagement />} />

        <Route path="website/header" element={<HeaderManagement />} />

        <Route path="website/connect" element={<ConectMagment />} />

        <Route
          path="website/consultation"
          element={<ConsultationManagement />}
        />

        <Route path="database" element={<DatabaseFront />} />

        <Route path="users" element={<UserManagement />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

function App() {
  const isAdminDomain =
    window.location.hostname === "beautyonlineshop-manager.vercel.app";

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isAdminDomain) {
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
