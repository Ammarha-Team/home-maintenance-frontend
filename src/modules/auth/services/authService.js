// Auth API surface. Bodies land once src/shared/services/api.js (axios
// instance, VITE_API_URL) is wired — these throw for now so a half-finished
// screen fails loudly instead of silently pretending to succeed.

const notImplemented = (name) => {
  throw new Error(`authService.${name} is not implemented yet`)
}

// { method: 'phone' | 'email', identifier, password, rememberMe } -> { token, user }
export const login = () => notImplemented('login')

// Sign up has no endpoint behind it yet, so these resolve locally instead of
// throwing: the terms step is the end of the flow, and a stub there leaves the
// screens unusable. Swap both bodies for the real call once the API is wired —
// what they resolve with is the shape the endpoint is expected to return.
const localSession = (role, details) => ({
  token: 'local-dev-session',
  user: {
    role,
    fullName: details?.fullName ?? '',
    phone: details?.phone ?? '',
    email: details?.email ?? '',
  },
})

// { fullName, phone, email, password } -> { token, user }
export const registerCustomer = async (details) =>
  localSession('customer', details)

// customer fields + { specialisation, experience, documents } -> { token, user }
export const registerTechnician = async (details) =>
  localSession('technician', details)
