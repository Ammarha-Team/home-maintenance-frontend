// Single source of truth for auth paths. Import these instead of hardcoding
// strings in links, redirects and route definitions.
export const AUTH_ROUTES = {
  login: '/login',
  // The whole reset flow — pick a method, enter the code, set the password —
  // lives on this one route, the way the frame draws it.
  forgotPassword: '/forgot-password',
  // Where the confirmation mail should point. The backend currently builds
  // that link against its own dev address, so it has to be repointed here for
  // the flow to work from an inbox.
  confirmEmail: '/confirm-email',
  // Where the reset mail should point. The backend currently mails a link to
  // its own POST endpoint on a dev address, which a browser cannot open.
  resetPassword: '/reset-password',
  customerSignUp: '/signup/customer',
  customerSignUpTerms: '/signup/customer/terms',
  technicianSignUp: '/signup/technician',
  technicianSignUpTerms: '/signup/technician/terms',
}

export const SIGN_UP_ROLES = ['customer', 'technician']

// Login accepts either identifier (Figma nodes 6:1196 phone / 6:1280 email).
export const AUTH_METHODS = { phone: 'phone', email: 'email' }

// Which of them the backend can actually authenticate. Its LoginCommand takes
// an email and a password and nothing else, so phone sign in is switched off
// the same way phone password-recovery is: the field, the switcher and the
// validation all stay in the codebase and return by flipping this flag.
export const AUTH_METHOD_AVAILABILITY = {
  [AUTH_METHODS.email]: true,
  [AUTH_METHODS.phone]: false,
}

export const isAuthMethodAvailable = (method) =>
  AUTH_METHOD_AVAILABILITY[method] === true

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
