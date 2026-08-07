import { Link, useLocation } from 'react-router-dom'
import {
  Banknote,
  LayoutGrid,
  LogOut,
  ReceiptText,
  Settings,
  ShoppingCart,
  Users,
  Wrench,
} from 'lucide-react'

import logo from '../../../assets/brand/logo.png'
import { ADMIN_NAV_ITEMS, ADMIN_ROUTES } from '../constants/adminRoutes.js'

// The nav list travels as data so it can be read at a glance, which leaves the
// icons to be looked up here rather than stored beside the labels.
const ICONS = {
  dashboard: LayoutGrid,
  technicians: Wrench,
  customers: Users,
  orders: ShoppingCart,
  commissions: Banknote,
  earnings: ReceiptText,
}

/**
 * The console's navigation rail, which under RTL sits against the right edge.
 * It is fixed on desktop and slides in over the page below `md`, where 260px of
 * permanent navigation would leave the tables no room.
 */
function AdminSidebar({ open, onNavigate }) {
  const { pathname } = useLocation()

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-40 flex w-[260px] flex-col border-l border-line bg-white transition-transform md:translate-x-0 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="border-b border-line px-[24px] py-[20px]">
        <Link to={ADMIN_ROUTES.dashboard} onClick={onNavigate} className="block">
          <img src={logo} alt="عمّرها" className="h-[40px] w-auto" />
        </Link>
        <p className="mt-[10px] text-[14px] leading-[20px] text-text-300">
          إدارة الصيانة المنزلية
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto py-[16px]">
        <ul>
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.icon]
            const active = pathname === item.to

            // An unbuilt screen is drawn but not linked: a <Link> to a path no
            // route answers falls through to the catch-all and throws the admin
            // back out to the landing page.
            if (!item.ready) {
              return (
                <li key={item.key}>
                  <span className="flex items-center gap-[12px] px-[24px] py-[12px] text-[16px] text-text-200">
                    <Icon size={20} aria-hidden="true" />
                    {item.label}
                  </span>
                </li>
              )
            }

            return (
              <li key={item.key}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-[12px] px-[24px] py-[12px] text-[16px] transition-colors ${
                    active
                      ? 'border-r-[3px] border-primary-500 bg-primary-50 font-bold text-primary-500'
                      : 'text-text-400 hover:bg-card hover:text-primary-500'
                  }`}
                >
                  <Icon size={20} aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-line py-[12px]">
        <span className="flex items-center gap-[12px] px-[24px] py-[12px] text-[16px] text-text-400">
          <Settings size={20} aria-hidden="true" />
          الإعدادات
        </span>
        <span className="flex items-center gap-[12px] px-[24px] py-[12px] text-[16px] text-error-500">
          <LogOut size={20} aria-hidden="true" />
          تسجيل خروج
        </span>
      </div>
    </aside>
  )
}

export default AdminSidebar
