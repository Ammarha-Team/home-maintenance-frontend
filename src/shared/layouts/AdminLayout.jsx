import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { LogOut, Settings } from 'lucide-react'

import AdminSidebar from '../components/AdminSidebar.jsx'
import AdminTopbar from '../components/AdminTopbar.jsx'
import {
  ADMIN_NAV_ITEMS,
  ADMIN_ROUTES,
} from '../../modules/admin/constants/adminRoutes.js'

// The rail draws whatever it is handed, so the two rows the console wants under
// its nav are described here rather than built into the shared component.
const SIDEBAR_FOOTER = (
  <>
    <span className="flex items-center gap-[12px] px-[24px] py-[12px] text-[16px] text-text-400">
      <Settings size={20} aria-hidden="true" />
      الإعدادات
    </span>
    <span className="flex items-center gap-[12px] px-[24px] py-[12px] text-[16px] text-error-500">
      <LogOut size={20} aria-hidden="true" />
      تسجيل خروج
    </span>
  </>
)

// Stands in until the console reads the signed-in admin from the session, which
// waits on the backend admin role.
const ADMIN_USER = { name: 'احمد حمدي', avatar: '/technician_avatar.jpg' }

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

const [notifications] = useState([
  {
    id: 1,
    type: 'order',
    title: 'طلب صيانة جديد',
    message: 'تم إنشاء طلب صيانة جديد من أحد العملاء',
    time: 'منذ 5 دقائق',
    read: false,
  },
  {
    id: 2,
    type: 'technician',
    title: 'طلب انضمام فني جديد',
    message: 'يوجد فني جديد بانتظار مراجعة طلبه',
    time: 'منذ 20 دقيقة',
    read: false,
  },
  {
    id: 3,
    type: 'payment',
    title: 'عملية دفع جديدة',
    message: 'تم استلام دفعة مقابل طلب صيانة',
    time: 'منذ ساعة',
    read: true,
  },
  {
    id: 4,
    type: 'review',
    title: 'تقييم جديد',
    message: 'تم إضافة تقييم جديد لأحد الفنيين',
    time: 'منذ ساعتين',
    read: true,
  },
])

  return (
    <div dir="rtl" className="min-h-screen bg-surface font-sans">

      <AdminSidebar
        items={ADMIN_NAV_ITEMS}
        homeTo={ADMIN_ROUTES.dashboard}
        subtitle="إدارة الصيانة المنزلية"
        footer={SIDEBAR_FOOTER}
        label="أقسام لوحة التحكم"
        open={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
      />

      {sidebarOpen ? (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-dark/40 md:hidden"
        />
      ) : null}

      <div className="md:mr-[260px]">

        <AdminTopbar
          user={ADMIN_USER}
          notifications={notifications}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="px-[24px] py-[24px]">
          <Outlet />
        </main>

      </div>
    </div>
  )

const handleNotifications = () => {
  setNotificationsOpen((prev) => !prev)
}
  return (
    <div dir="rtl" className="min-h-screen bg-surface font-sans">
      <AdminSidebar
        items={ADMIN_NAV_ITEMS}
        homeTo={ADMIN_ROUTES.dashboard}
        subtitle="إدارة الصيانة المنزلية"
        footer={SIDEBAR_FOOTER}
        label="أقسام لوحة التحكم"
        open={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
      />

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
<AdminTopbar
  user={ADMIN_USER}
  notifications={notifications}
  onOpenSidebar={() => setSidebarOpen(true)}
  onNotifications={handleNotifications}
/>
        <main className="px-[24px] py-[24px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
