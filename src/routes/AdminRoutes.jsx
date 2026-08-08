import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "../shared/layouts/AdminLayout.jsx";
import Dashboard from "../modules/admin/pages/Dashboard.jsx";
import Technicians from "../modules/admin/pages/Technicians.jsx";
import TechnicianSummary from "../modules/technician-management/pages/TechnicianSummary.jsx";

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="technicians" element={<Technicians />} />

        <Route
          path="technicians/summary"
          element={<TechnicianSummary />}
        />

        <Route
          path="*"
          element={<Navigate to="/admin" replace />}
        />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;