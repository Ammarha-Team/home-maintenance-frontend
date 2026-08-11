import { configureAuthHandlers } from '../../../shared/services/api.js'
import { AUTH_ROUTES } from '../constants/authRoutes.js'
import { refreshSession } from './authService.js'
import { clearSession, readSession, saveSession } from './authSession.js'

/**
 * Teaches the HTTP client how this app stores a session.
 *
 * `api` cannot import the auth module — the auth module imports it — so the
 * three things it needs are handed over here instead: where to find the access
 * token, how to renew it, and what to do when renewing is no longer possible.
 *
 * Called once at start up.
 */
export const installAuthHandlers = () => {
  configureAuthHandlers({
    getToken: () => readSession()?.token ?? null,

    onRefresh: async () => {
      const session = await refreshSession()

      // The renewed token replaces the stored one, so the retry and every
      // request after it use the new session rather than the expired one.
      saveSession(session)

      return session.token
    },

    onExpired: () => {
      clearSession()

      // A hard navigation, not a router one: this runs inside an interceptor,
      // outside the React tree, where there is no `navigate` to call. Guarded
      // so a failure that happens while already on the login screen does not
      // reload it underneath someone who is typing.
      if (window.location.pathname !== AUTH_ROUTES.login) {
        window.location.assign(AUTH_ROUTES.login)
      }
    },
  })
}
