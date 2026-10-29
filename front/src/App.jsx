import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Mother from "./Admin/mother";
import WebManagement from "./Admin/webmagment";
import HomeManagement from "./Admin/homemangemet";
import ProductManagement from "./Admin/productmagment";
import HeaderManagement from "./Admin/headrmangemet";
import ConectMagment from "./Admin/conectmagment";
import ConsultationManagement from "./Admin/consultationmangment";
import DatabaseFront from "./Admin/databasefront";

import PublicApp from "./Public/app1";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Mother />} />

        <Route path="/admin/website" element={<WebManagement />} />
        <Route path="/admin/website/home" element={<HomeManagement />} />
        <Route path="/admin/website/product" element={<ProductManagement />} />
        <Route path="/admin/website/header" element={<HeaderManagement />} />
        <Route path="/admin/website/connect" element={<ConectMagment />} />

        <Route
          path="/admin/website/consultation"
          element={<ConsultationManagement />}
        />

        <Route path="/admin/database" element={<DatabaseFront />} />

        <Route path="/*" element={<PublicApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
