import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./header.jsx";
import Home from "./home.jsx";
import Products from "./pro.jsx";
import Consultation from "./consulation.jsx";
import Connect from "./contect.jsx";
import LoadingScreen from "./LoadingScreen.jsx";

function PublicApp() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingScreen onFinish={() => setLoading(false)} />;
  }

  return (
    <>
      <Header />

      <Routes>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="consultation" element={<Consultation />} />
        <Route path="connect" element={<Connect />} />
      </Routes>
    </>
  );
}

export default PublicApp;
