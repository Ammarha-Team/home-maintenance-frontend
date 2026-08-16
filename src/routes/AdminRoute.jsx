import { Navigate } from 'react-router-dom'
import { AUTH_ROUTES } from '../modules/auth/constants/authRoutes.js'
import { readRole, readSession } from '../modules/auth/services/authSession.js'

/**
 * Gate for the admin console.
 *
 * The sibling of `TechnicianRoute`, asking for the other role. Login answers
 * with `roles: ["Admin"]`, which `readRole` lower-cases, so that is what this
 * compares against.
 *
 * This is navigation, not security. Every admin endpoint rejects a token
 * without the role — a signed-out caller gets 401 — no matter what the browser
 * renders. What this stops is a console that loads its chrome and then fills
 * every panel with an authorisation failure: the visitor is sent to sign in, or
 * back to their own home if they are signed in as somebody else.
 */
function AdminRoute({ children }) {
  const session = readSession()

  if (!session?.token) {
    return <Navigate to={AUTH_ROUTES.login} replace />
  }

  if (readRole(session) !== 'admin') {
    return <Navigate to="/home" replace />
  }

  return children
}

export default AdminRoute
