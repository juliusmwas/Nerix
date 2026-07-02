import { Routes, Route } from "react-router-dom";

// Navigate

import Homepage from "../Pages/Homepage";
import PublicLayout from "../layouts/PublicLayout";
//import Login from "../pages/Login";
//import Register from "../pages/Register";
//import Scan from "../pages/Scan";
//import ScanDetails from "../pages/ScanDetails";
//import NotFound from "../pages/NotFound";

{
  /*const isAuthenticated = () => {
  return localStorage.getItem("token");
};

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}*/
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Homepage />} />

        {/* other public pages */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
      </Route>
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
