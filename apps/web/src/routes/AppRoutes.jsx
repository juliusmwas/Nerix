import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "../components/Navbar";
//import Home from "../pages/Home";
//import Login from "../pages/Login";
//import Register from "../pages/Register";
//import Scan from "../pages/Scan";
//import ScanDetails from "../pages/ScanDetails";
//import NotFound from "../pages/NotFound";

const isAuthenticated = () => {
  return localStorage.getItem("token");
};

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Navbar />} />
      {/*<Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> */}

      {/* PROTECTED 
      <Route
        path="/scan"
        element={
          <ProtectedRoute>
            <Scan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/scan/:scanId"
        element={
          <ProtectedRoute>
            <ScanDetails />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}
