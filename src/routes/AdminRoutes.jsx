import { Navigate, Route, Routes } from 'react-router-dom'

import AdminLayout from '../shared/layouts/AdminLayout.jsx'
import Dashboard from '../modules/admin/pages/Dashboard.jsx'
import Technicians from '../modules/admin/pages/Technicians.jsx'

/**
 * The console's own route table, mounted whole under /admin.
 *
 * Keeping it here rather than in AppRoutes means the console can grow a screen
 * at a time without the shared table being edited for each one, and the layout
 * is declared once as the parent instead of being wrapped around every page.
 *
 * The trailing catch-all returns an unknown /admin path to the dashboard rather
 * than out to the landing page — an admin who mistypes a console URL is still
 * an admin.
 */
function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="technicians" element={<Technicians />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes
