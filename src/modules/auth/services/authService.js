// Auth API surface. Bodies land once src/shared/services/api.js (axios
// instance, VITE_API_URL) is wired — these throw for now so a half-finished
// screen fails loudly instead of silently pretending to succeed.

const notImplemented = (name) => {
  throw new Error(`authService.${name} is not implemented yet`)
}

// { method: 'phone' | 'email', identifier, password, rememberMe } -> { token, user }
export const login = () => notImplemented('login')

// { fullName, phone, email, password } -> { token, user }
export const registerCustomer = () => notImplemented('registerCustomer')

// customer fields + { specialisation, experience, documents } -> { token, user }
export const registerTechnician = () => notImplemented('registerTechnician')
