import api from '../../../shared/services/api.js'

// The admin console's calls to the backend.
//
// Everything here goes through the shared axios instance, so the bearer token,
// the silent refresh and the error shape are the same ones the rest of the app
// already uses. The instance unwraps the `{ success, data, errors }` envelope,
// which is why these functions return the payload directly.
//
// Only the endpoints the API actually publishes appear below. The console has
// screens the backend has no answer for yet — the revenue chart, the profit
// periods, the commissions ledger — and those keep reading their sample data
// rather than being pointed at an invented path.

/**
 * How many rows one request asks for when the screen wants the whole roster.
 *
 * The list endpoints take `pageNumber` and `pageSize` and nothing else — no
 * filter, no search, no sort. The technicians and customers screens both filter
 * on the client, over the whole set, so the whole set has to be here before the
 * filter can mean anything.
 */
const FETCH_PAGE_SIZE = 100

/**
 * The most pages a roster call will walk.
 *
 * A guard rather than a limit anyone should reach: at a hundred rows a page it
 * is two thousand accounts. It exists so a backend that reports a wrong
 * `totalPages` cannot spin the browser forever.
 */
const MAX_PAGES = 20

/** The eight figures across the top of the dashboard. */
export const fetchDashboard = () => api.get('/api/Admin/dashboard')

/** One page of technicians, as the API pages them. */
export const fetchTechniciansPage = (pageNumber, pageSize = FETCH_PAGE_SIZE) =>
  api.get('/api/Admin/technicians', { params: { pageNumber, pageSize } })

/** One page of clients, as the API pages them. */
export const fetchClientsPage = (pageNumber, pageSize = FETCH_PAGE_SIZE) =>
  api.get('/api/Admin/clients', { params: { pageNumber, pageSize } })

/** One technician in full, including their recent requests. */
export const fetchTechnician = (id) => api.get(`/api/Admin/technicians/${id}`)

/** Lifts a suspension. `userId` is the account id, not the technician id. */
export const activateUser = (userId) => api.put(`/api/Admin/users/${userId}/activate`)

/** Suspends an account. `userId` is the account id, not the technician id. */
export const suspendUser = (userId) => api.put(`/api/Admin/users/${userId}/suspend`)

/**
 * Walks a paged endpoint to the end and returns every row.
 *
 * The first response carries `totalPages`, so the rest are requested together
 * rather than one after another — the roster is a handful of pages at most and
 * waiting for each in turn would show a spinner for no reason.
 */
const fetchAllPages = async (fetchPage) => {
  const first = await fetchPage(1)
  const pages = Math.min(first?.totalPages ?? 1, MAX_PAGES)

  if (pages <= 1) return first?.items ?? []

  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, index) => fetchPage(index + 2)),
  )

  return rest.reduce((all, page) => all.concat(page?.items ?? []), first?.items ?? [])
}

// The API writes an account state in English — "Active", "Suspended" — while the
// tables key their pills on the words the console was built around. A state
// nobody has seen yet passes through lower-cased rather than being forced into
// one of these, so an unknown value shows up as itself instead of as a wrong
// answer.
const ACCOUNT_STATUS = {
  active: 'active',
  suspended: 'suspended',
  banned: 'suspended',
}

const readStatus = (accountStatus) => {
  const value = String(accountStatus ?? '').toLowerCase()
  return ACCOUNT_STATUS[value] ?? value
}

// The customers table draws a banned account rather than a suspended one. Same
// state, the word that screen already uses for it.
const readClientStatus = (accountStatus) => {
  const status = readStatus(accountStatus)
  return status === 'suspended' ? 'banned' : status
}

/**
 * A technician as the roster draws them.
 *
 * `location` is the API's word for what the table's column calls the city, and
 * it is null for an account that never set one — an em dash reads better in a
 * table cell than a blank.
 */
export const toTechnicianRow = (dto) => ({
  id: dto.id,
  userId: dto.userId,
  name: dto.fullName,
  email: dto.email,
  phone: dto.phoneNumber,
  city: dto.location || '—',
  specialty: dto.professionName || '—',
  experienceYears: dto.yearsOfExperience ?? 0,
  rating: dto.rating ?? 0,
  orders: dto.completedRequestsCount ?? 0,
  status: readStatus(dto.accountStatus),
  avatar: dto.profilePictureUrl || null,
})

/** A client as the customers table draws them. */
export const toCustomerRow = (dto) => ({
  id: dto.id,
  name: dto.fullName,
  email: dto.email,
  phone: dto.phoneNumber,
  city: dto.location || '—',
  orders: dto.serviceRequestsCount ?? 0,
  status: readClientStatus(dto.accountStatus),
  avatar: dto.profilePictureUrl || null,
})

// Thousands separators, latin digits — the same way the tiles were drawn when
// the figures were written by hand.
const groupDigits = (value) => Number(value ?? 0).toLocaleString('en-US')

/**
 * The dashboard's eight tiles, in the order the console draws them.
 *
 * The keys are the ones `DashboardStats` already looks its icons up by, so the
 * grid needs no changes to draw these.
 *
 * What the API does not send is the comparison: there is no previous period in
 * the response, so no tile carries a `delta` or a `trend`. The chip is left off
 * rather than filled with a number nobody measured.
 */
export const toDashboardStats = (dto = {}) => [
  { key: 'customers', label: 'إجمالي العملاء', value: groupDigits(dto.totalClients), tone: 'primary' },
  { key: 'technicians', label: 'إجمالي الفنيين', value: groupDigits(dto.totalTechnicians), tone: 'primary' },
  { key: 'newOrders', label: 'الطلبات الجديدة اليوم', value: groupDigits(dto.newRequestsToday), tone: 'success' },
  { key: 'openOrders', label: 'الطلبات قيد التنفيذ', value: groupDigits(dto.inProgressRequests), tone: 'primary' },
  { key: 'doneOrders', label: 'الطلبات المكتملة', value: groupDigits(dto.completedRequests), tone: 'success' },
  { key: 'revenue', label: 'الإيرادات الشهرية', value: groupDigits(dto.monthlyRevenue), unit: 'ج.م', tone: 'primary' },
  { key: 'commission', label: 'العمولات المستحقة', value: groupDigits(dto.pendingCommissions), unit: 'ج.م', tone: 'error' },
  {
    key: 'satisfaction',
    label: 'نسبة رضا العملاء',
    value: `${Number(dto.customerSatisfactionRate ?? 0)}%`,
    tone: 'primary',
  },
]

/** Every technician, mapped for the roster. */
export const fetchAllTechnicians = async () =>
  (await fetchAllPages(fetchTechniciansPage)).map(toTechnicianRow)

/** Every client, mapped for the customers table. */
export const fetchAllCustomers = async () =>
  (await fetchAllPages(fetchClientsPage)).map(toCustomerRow)
