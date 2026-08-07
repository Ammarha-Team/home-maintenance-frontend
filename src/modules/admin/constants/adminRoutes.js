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
 */
export const ADMIN_NAV_ITEMS = [
  { key: 'dashboard', label: 'لوحة التحكم', icon: 'dashboard', to: ADMIN_ROUTES.dashboard, ready: true },
  { key: 'technicians', label: 'الفنين', icon: 'technicians', to: ADMIN_ROUTES.technicians, ready: true },
  { key: 'customers', label: 'العملاء', icon: 'customers', to: ADMIN_ROUTES.customers, ready: false },
  { key: 'orders', label: 'الطلبات', icon: 'orders', to: ADMIN_ROUTES.orders, ready: false },
  { key: 'commissions', label: 'العمولات', icon: 'commissions', to: ADMIN_ROUTES.commissions, ready: false },
  { key: 'earnings', label: 'الأرباح', icon: 'earnings', to: ADMIN_ROUTES.earnings, ready: false },
]
