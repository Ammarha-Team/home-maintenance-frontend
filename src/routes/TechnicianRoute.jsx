import { Navigate } from 'react-router-dom'
import { AUTH_ROUTES } from '../modules/auth/constants/authRoutes.js'
import { readRole, readSession } from '../modules/auth/services/authSession.js'
import { TECHNICIAN_ROUTES } from '../modules/technician/constants/technicianRoutes.js'
import { useSignedInTechnicianReview } from '../modules/technician-review/hooks/useTechnicianReview.js'

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

  // TEMPORARY — DEMO ONLY. Read unconditionally because it is a hook; the
  // branches below decide whether the answer matters. Delete this line and the
  // review branch when the API starts enforcing approval itself.
  const { isUnderReview } = useSignedInTechnicianReview()

  if (!session?.token) {
    return <Navigate to={AUTH_ROUTES.login} replace />
  }

  // A signed-in customer goes to their own home rather than the login screen —
  // they are authenticated, just not for this area.
  if (readRole(session) !== 'technician') {
    return <Navigate to="/home" replace />
  }

  // TEMPORARY — DEMO ONLY. Every portal screen is wrapped in this guard, so one
  // branch here holds the whole portal shut rather than each screen checking for
  // itself.
  //
  // Worth being precise about what this does and does not do. It is a redirect,
  // not an authorisation check: the API has no notion of an unreviewed account
  // and answers this technician's token exactly as it answers any other, so
  // anyone who wants past it only has to clear their site data. It also only
  // fires for accounts this browser watched register — a technician who signed
  // up elsewhere is unknown to the store and passes straight through, which is
  // the right failure direction while the state lives on the client.
  if (isUnderReview) {
    return <Navigate to={TECHNICIAN_ROUTES.underReview} replace />
  }

  return children
}

export default TechnicianRoute
