// Single source of truth for auth paths. Import these instead of hardcoding
// strings in links, redirects and route definitions.
export const AUTH_ROUTES = {
  login: '/login',
  // Screen not in this Figma scope yet — the route falls through to login.
  forgotPassword: '/forgot-password',
  customerSignUp: '/signup/customer',
  customerSignUpTerms: '/signup/customer/terms',
  technicianSignUp: '/signup/technician',
  technicianSignUpTerms: '/signup/technician/terms',
}

export const SIGN_UP_ROLES = ['customer', 'technician']

// Login accepts either identifier (Figma nodes 6:1196 phone / 6:1280 email).
export const AUTH_METHODS = { phone: 'phone', email: 'email' }

// Both info screens are the same screen with a different role, so they share one
// route. Keeping the panel mounted across the switch is what lets the segmented
// control slide and the fields fade instead of the whole page blinking.
export const SIGN_UP_INFO_PATTERN = '/signup/:role'

export const signUpPathFor = (role) => `/signup/${role}`

// Step labels shown by SignUpStepper (Figma node 1:468), right to left.
export const SIGN_UP_STEP_LABELS = ['نوع الحساب', 'إدخال البيانات', 'الموافقة']

// Step order per role, used by SignUpStepper and by the next / back flow.
export const SIGN_UP_STEPS = {
  customer: [AUTH_ROUTES.customerSignUp, AUTH_ROUTES.customerSignUpTerms],
  technician: [AUTH_ROUTES.technicianSignUp, AUTH_ROUTES.technicianSignUpTerms],
}
