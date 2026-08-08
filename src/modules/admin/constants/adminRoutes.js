import {
  Banknote,
  LayoutGrid,
  ReceiptText,
  ShoppingCart,
  Users,
  Wrench,
} from 'lucide-react'

// Admin console paths. Everything sits under /admin and is mounted as one
// nested route, so the console owns its own routing table and the public and
// technician route lists stay untouched.
export const ADMIN_ROUTES = {
  dashboard: '/admin',
  technicians: '/admin/technicians',
  customers: '/admin/customers',
  orders: '/admin/orders',
  commissions: '/admin/commissions',
  earnings: '/admin/earnings',
  settings: '/admin/settings',
}

/**
 * Sidebar items, in the order the frame draws them (top to bottom).
 *
 * `ready` marks the screens that exist today. Only the dashboard and the
 * technicians table have been designed, so the remaining items render as plain
 * text rather than links — a <Link> to an unregistered path would fall through
 * to the catch-all route and throw the admin out of the console.
 *
 * `icon` carries the component itself. The shared Sidebar draws whatever it is
 * handed and keeps no list of its own, so the console is free to choose icons
 * without the rail having to know the console's screens by name.
 */
export const ADMIN_NAV_ITEMS = [
  { key: 'dashboard', label: 'لوحة التحكم', icon: LayoutGrid, to: ADMIN_ROUTES.dashboard, ready: true },
  { key: 'technicians', label: 'الفنين', icon: Wrench, to: ADMIN_ROUTES.technicians, ready: true },
  { key: 'customers', label: 'العملاء', icon: Users, to: ADMIN_ROUTES.customers, ready: false },
  { key: 'orders', label: 'الطلبات', icon: ShoppingCart, to: ADMIN_ROUTES.orders, ready: false },
  { key: 'commissions', label: 'العمولات', icon: Banknote, to: ADMIN_ROUTES.commissions, ready: false },
  { key: 'earnings', label: 'الأرباح', icon: ReceiptText, to: ADMIN_ROUTES.earnings, ready: false },
]
