import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import AdminSidebar from '../../modules/admin/components/AdminSidebar.jsx'
import AdminTopbar from '../../modules/admin/components/AdminTopbar.jsx'

/**
 * The chrome every console screen sits inside. `dir` is set here rather than on
 * the document because the rest of the app opts into RTL section by section,
 * and the console is the only part that is RTL from edge to edge.
 *
 * The sidebar is fixed, so the page is pushed clear of it with a margin rather
 * than a flex row — that keeps the main column scrolling on its own and stops
 * the rail from sliding away with it.
 */
function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div dir="rtl" className="min-h-screen bg-surface font-sans">
      <AdminSidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      {/* Below `md` the sidebar covers the page, and a tap anywhere off it is
          the expected way back out. */}
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-dark/40 md:hidden"
        />
      ) : null}

      <div className="md:mr-[260px]">
        <AdminTopbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="px-[24px] py-[24px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
