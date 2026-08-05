import { Navigate } from 'react-router-dom'
import { AUTH_ROUTES } from '../modules/auth/constants/authRoutes.js'
import { readRole, readSession } from '../modules/auth/services/authSession.js'

/**
 * Gate for the technician portal.
 *
 * This is navigation, not security: it keeps a customer off a screen built for
 * someone else and sends a signed-out visitor to the login form. Nothing here
 * protects data — every request still carries a token the API validates, and it
 * rejects whatever the role does not allow no matter what the client renders.
 */
function TechnicianRoute({ children }) {
  const session = readSession()

  if (!session?.token) {
    return <Navigate to={AUTH_ROUTES.login} replace />
  }

  // A signed-in customer goes to their own home rather than the login screen —
  // they are authenticated, just not for this area.
  if (readRole(session) !== 'technician') {
    return <Navigate to="/home" replace />
  }

  return children
}

export default TechnicianRoute
