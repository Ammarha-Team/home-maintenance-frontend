import { TECHNICIAN_ROUTES } from '../../technician/constants/technicianRoutes.js'

// Where the signed-in session lives on the client.
//
// The access token goes in localStorage; the refresh token is a cookie the
// server owns and the browser never shows us. A bearer token in localStorage is
// readable by any script on the page — that is the accepted trade for a token
// the app has to attach to requests itself, and it is the reason the refresh
// token stays in an httpOnly cookie rather than joining it here.
const STORAGE_KEY = 'ammarha.session'

export const saveSession = (session) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export const readSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    // A malformed entry is not worth crashing the app over; treat it as signed
    // out and let the user sign in again.
    return null
  }
}

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Reads the payload of a JWT without verifying it.
 *
 * Verification is the server's job and cannot be done here in any meaningful
 * way, so nothing security-bearing may rest on this: it decides which landing
 * screen to show, and the API rejects a forged token regardless.
 */
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))

    // The payload is UTF-8; atob gives bytes, so it is re-decoded rather than
    // read directly — an Arabic name in a claim would be mangled otherwise.
    return JSON.parse(
      decodeURIComponent(
        json
          .split('')
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join(''),
      ),
    )
  } catch {
    return null
  }
}

// .NET writes the role under the long ClaimTypes URI unless it is remapped, so
// both spellings are checked.
const ROLE_CLAIMS = [
  'role',
  'roles',
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
]

/**
 * The role carried by a session, lower-cased, or null when the token says
 * nothing about it.
 */
export const readRole = (session) => {
  if (!session?.token) return null

  // Login answers with `roles: ["Technician"]`, so that is the first place to
  // look; the token is only decoded when the payload said nothing.
  const roles = session.user?.roles
  if (Array.isArray(roles) && roles.length) {
    return String(roles[0]).toLowerCase()
  }

  const fromUser = session.user?.role
  if (fromUser) return String(fromUser).toLowerCase()

  const claims = decodeToken(session.token)
  if (!claims) return null

  for (const claim of ROLE_CLAIMS) {
    const value = claims[claim]
    if (value) {
      return String(Array.isArray(value) ? value[0] : value).toLowerCase()
    }
  }

  return null
}

/**
 * Where a session lands after signing in. A technician goes to their portal,
 * everyone else to the customer home — which is also the fallback when the
 * token names no role, since the customer area is the safe default.
 */
export const landingRouteFor = (session) =>
  readRole(session) === 'technician' ? TECHNICIAN_ROUTES.dashboard : '/home'

/**
 * The signed-in user's name, or an empty string when the backend has not told
 * us one.
 *
 * As of today it is always empty: the login payload carries `id`, `email` and
 * `roles`, and the token carries `sub`, `jti`, `email`, `role`, `exp`, `iss`
 * and `aud` — no name in either. The full name is collected at registration but
 * never returned at sign in.
 *
 * The claims below are read anyway so that the moment the API adds one, the
 * name appears with no further change here. What this deliberately does not do
 * is derive a name from the email address: `ahmed.hassan` is not what anyone
 * is called, and showing it as a name is a guess dressed as a fact.
 */
export const readDisplayName = (session) => {
  if (!session?.token) return ''

  const fromPayload = session.user?.fullName ?? session.user?.name
  if (fromPayload) return String(fromPayload)

  const claims = decodeToken(session.token) ?? {}
  const named =
    claims.name ??
    claims.given_name ??
    claims.fullName ??
    claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']

  // A `name` claim that is just the address is not a name.
  if (named && !String(named).includes('@')) return String(named)

  return ''
}
