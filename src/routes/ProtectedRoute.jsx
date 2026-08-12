import { Navigate } from 'react-router-dom'
import { AUTH_ROUTES } from '../modules/auth/constants/authRoutes.js'
import { readSession } from '../modules/auth/services/authSession.js'

/**
 * Gate for screens that need a signed-in user, whoever they are.
 *
 * The sibling of `TechnicianRoute`, minus the role check: this one only asks
 * whether anyone is signed in, so it suits screens that belong to every
 * account rather than to one kind of account.
 *
 * Same caveat as that guard — this is navigation, not security. It stops a
 * signed-out visitor from opening a page that has nothing to show them and
 * sends them to the login form instead. The data behind such a page is
 * protected by the token every request carries, which the API validates.
 *
 * `replace` rather than a push, so the back button returns to wherever the
 * visitor came from instead of to a screen that will only bounce them here
 * again.
 */
function ProtectedRoute({ children }) {
  const session = readSession()

  if (!session?.token) {
    return <Navigate to={AUTH_ROUTES.login} replace />
  }

  return children
}

export default ProtectedRoute
