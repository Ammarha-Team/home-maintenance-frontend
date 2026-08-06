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

  // The job itself, once the customer has accepted the offer. These four run in
  // order — accepted, on the way, arrived, finished — and each screen carries
  // the technician on to the next, so the paths are named for the stage rather
  // than for the frame titles, which describe the same steps from outside.
  offerAccepted: '/technician/orders/:orderId/accepted',
  jobTracking: '/technician/orders/:orderId/tracking',
  jobArrival: '/technician/orders/:orderId/arrival',
  jobCompletion: '/technician/orders/:orderId/completed',

  // Not tied to one order: the inbox lists every conversation the technician
  // has, which is why it sits beside the order paths rather than under one.
  messages: '/technician/messages',

  // The wallet, and the settlement that starts from it. This flow runs the
  // opposite way from the job screens: the technician owes the platform its
  // commission, so here the technician is the one paying.
  //
  // The four payment paths nest under the wallet because that is the only way
  // in — each screen carries the technician to the next, and none of them means
  // anything on its own.
  wallet: '/technician/wallet',
  paymentDetails: '/technician/wallet/payment',
  paymentMethod: '/technician/wallet/payment/method',
  paymentConfirm: '/technician/wallet/payment/confirm',
  paymentComplete: '/technician/wallet/payment/complete',
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
  { key: 'messages', label: 'الرسائل', to: TECHNICIAN_ROUTES.messages, ready: true },
  { key: 'wallet', label: 'المحفظه', to: TECHNICIAN_ROUTES.wallet, ready: true },
]
