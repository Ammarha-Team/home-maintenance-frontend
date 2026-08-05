// Technician portal paths. Kept apart from the customer routes in AppRoutes so
// the two portals can never be confused: everything here lives under
// /technician and is named Technician* on both the route and the component.
export const TECHNICIAN_ROUTES = {
  dashboard: '/technician',
  orders: '/technician/orders',
  orderDetails: '/technician/orders/:orderId',
  orderCompletion: '/technician/orders/:orderId/complete',
}

/**
 * Header tabs, in the order the frame draws them (right to left in RTL).
 *
 * `ready` marks the screens that exist today. The portal is being built one
 * screen per branch, so a tab whose route has not landed yet renders as plain
 * text rather than a link — a <Link> to an unregistered path would fall through
 * to the catch-all route and throw the technician back to the landing page.
 * Each screen flips its own flag as it merges.
 */
export const TECHNICIAN_NAV_ITEMS = [
  { key: 'dashboard', label: 'الرئيسيه', to: TECHNICIAN_ROUTES.dashboard, ready: true },
  { key: 'orders', label: 'الطلبات', to: TECHNICIAN_ROUTES.orders, ready: false },
  { key: 'offers', label: 'عروضي', to: '/technician/offers', ready: false },
  { key: 'messages', label: 'الرسائل', to: '/technician/messages', ready: false },
  { key: 'wallet', label: 'المحفظه', to: '/technician/wallet', ready: false },
]
