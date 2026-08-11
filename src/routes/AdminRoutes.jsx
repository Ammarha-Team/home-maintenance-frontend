import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "../shared/layouts/AdminLayout.jsx";

import Dashboard from "../modules/admin/pages/Dashboard.jsx";
import Technicians from "../modules/admin/pages/Technicians.jsx";
import TechnicianSummary from "../modules/technician-management/pages/TechnicianSummary.jsx";
import OrderManagement from "../modules/admin-order-management/pages/OrderManagement.jsx";
import Commissions from "../modules/commissions/pages/Commissions.jsx";
import Customers from "../modules/admin/pages/Customers.jsx";
import Profits from "../modules/admin/pages/Profits.jsx";
import Settings from "../modules/admin/pages/Settings.jsx";

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

        <Route path="orders" element={<OrderManagement />} />

        <Route path="commissions" element={<Commissions />} />

        {/* Both of these are advertised in the sidebar. Without the route the
            link falls through to the catch-all below and the console bounces
            back to the dashboard instead of opening the screen. */}
        <Route path="customers" element={<Customers />} />

        <Route path="profits" element={<Profits />} />

        <Route path="settings" element={<Settings />} />

        <Route
          path="*"
          element={<Navigate to="/admin" replace />}
        />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;