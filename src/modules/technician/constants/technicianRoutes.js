// Technician portal paths. Kept apart from the customer routes in AppRoutes so
// the two portals can never be confused: everything here lives under
// /technician and is named Technician* on both the route and the component.
export const TECHNICIAN_ROUTES = {
  dashboard: '/technician',
  orders: '/technician/orders',
  orderDetails: '/technician/orders/:orderId',
  // Named `orderCompletion` while the screen was still unbuilt. The frame it
  // turns out to describe (21:2617) is the offer a technician sends to win the
  // job — a price, a start time and a note to the customer — not anything that
  // completes one, so the name follows the screen.
  orderOffer: '/technician/orders/:orderId/offer',
}

/** Fills `:orderId` in the two order paths. */
export const technicianOrderPath = (route, orderId) =>
  route.replace(':orderId', encodeURIComponent(orderId))

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
  { key: 'dashboard', label: 'الرئيسية', to: TECHNICIAN_ROUTES.dashboard, ready: true },
  { key: 'orders', label: 'الطلبات', to: TECHNICIAN_ROUTES.orders, ready: true },
  { key: 'offers', label: 'عروضي', to: '/technician/offers', ready: false },
  { key: 'messages', label: 'الرسائل', to: '/technician/messages', ready: false },
  { key: 'wallet', label: 'المحفظه', to: '/technician/wallet', ready: false },
]
