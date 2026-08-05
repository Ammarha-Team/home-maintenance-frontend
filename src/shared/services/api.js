import axios from 'axios'

// HTTP client for the backend. One instance so the base URL, the credential
// policy and the error shape are decided once rather than per call.
//
// Credentials are off by default, and that is not a preference — it is forced.
// The API answers preflight with `Access-Control-Allow-Origin: *`, and a
// browser rejects a wildcard origin outright for any request made in
// credentials mode:
//
//   "The value of the 'Access-Control-Allow-Origin' header in the response
//    must not be the wildcard '*' when the request's credentials mode is
//    'include'."
//
// With `withCredentials: true` on the instance, that blocks every call, even
// the ones that carry everything in the body and want no cookie at all.
//
// The refresh token does live in a cookie — `refresh-token` and `logout` take
// no body and read it — so those two calls must opt in per request with
// `{ withCredentials: true }`. They will keep failing until the server echoes
// the caller's origin and adds `Access-Control-Allow-Credentials: true`.
// Everything else works today.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
})

// Session plumbing, injected rather than imported.
//
// This file lives in shared/ and the auth module already depends on it, so it
// must not depend on the auth module back. The two things it needs from a
// session — the access token to attach, and the way to renew it — are handed in
// at start up by `configureAuthHandlers` instead.
let getAccessToken = () => null
let requestRefresh = null
let handleSessionExpired = null

export const configureAuthHandlers = ({ getToken, onRefresh, onExpired } = {}) => {
  getAccessToken = getToken ?? (() => null)
  requestRefresh = onRefresh ?? null
  handleSessionExpired = onExpired ?? null
}

// Endpoints that establish or end a session rather than consume one.
//
// They must not carry a bearer token — sending a stale one alongside the
// credentials meant to replace it is at best noise — and a 401 from any of them
// is a real answer about those credentials, not a hint that the access token
// needs renewing. Renewing on those would loop.
const PUBLIC_AUTH_PATHS = [
  '/api/Authentication/login',
  '/api/Authentication/register-client',
  '/api/Authentication/register-technician',
  '/api/Authentication/confirm-email',
  '/api/Authentication/resend-confirmation-email',
  '/api/Authentication/forgot-password',
  '/api/Authentication/reset-password',
  '/api/Authentication/refresh-token',
]

const isPublicAuthPath = (url = '') =>
  PUBLIC_AUTH_PATHS.some((path) => url.startsWith(path))

api.interceptors.request.use((config) => {
  if (isPublicAuthPath(config.url)) return config

  const token = getAccessToken()
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// One renewal at a time.
//
// A page that fires several requests at once will see them all fail together on
// the same expired token. Without this they would start a refresh each, and all
// but one would be spending a refresh token that the first had already rotated.
let pendingRefresh = null

const renewAccessToken = () => {
  pendingRefresh ??= Promise.resolve()
    .then(() => requestRefresh())
    .finally(() => {
      pendingRefresh = null
    })

  return pendingRefresh
}

// The API answers with two different failure shapes, and a caller should not
// have to know which one it got:
//
//   domain      { success: false, data: null, errors: [{ code, message }] }
//   validation  application/problem+json — { errors: { Email: ["…"] } }
//
// Both collapse to an Error carrying `code`, a readable `message`, and
// `fieldErrors` keyed by the lower-cased field name when the server named one.
const normaliseError = (error) => {
  if (!error.response) {
    const offline = new Error(
      'تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.',
    )
    offline.code = 'Network.Unreachable'
    offline.status = 0
    offline.fieldErrors = {}
    return offline
  }

  const status = error.response.status
  const payload = error.response.data

  // Domain failure: the first entry is the one worth showing.
  const first = Array.isArray(payload?.errors) ? payload.errors[0] : null
  if (first) {
    const failure = new Error(first.message || 'تعذر إتمام الطلب.')
    failure.code = first.code
    failure.status = status
    failure.fieldErrors = {}
    return failure
  }

  // Validation failure: `errors` is an object of field -> messages.
  if (payload?.errors && typeof payload.errors === 'object') {
    const fieldErrors = Object.entries(payload.errors).reduce(
      (acc, [field, messages]) => ({
        ...acc,
        [field.charAt(0).toLowerCase() + field.slice(1)]: Array.isArray(messages)
          ? messages[0]
          : String(messages),
      }),
      {},
    )

    const failure = new Error(
      payload.title || 'تحقق من البيانات المدخلة وحاول مرة أخرى.',
    )
    failure.code = 'Validation.Failed'
    failure.status = status
    failure.fieldErrors = fieldErrors
    return failure
  }

  const unknown = new Error('حدث خطأ غير متوقع. حاول مرة أخرى لاحقًا.')
  unknown.code = 'Unknown'
  unknown.status = status
  unknown.fieldErrors = {}
  return unknown
}

// Diagnostic for the link-based auth flows.
//
// The backend team asked for proof of the exact `userId` and `token` the
// browser sends back from an email link, so the two calls that carry one log
// their outgoing payload. Passwords are redacted; the token is printed in full
// because it is the value under investigation, and it is already visible in the
// address bar of the page doing the printing.
//
// `tokenLength` and `tokenHasSpace` are the tell: a token mangled in transit
// loses characters or gains a space where a `+` used to be. A clean token
// prints `tokenHasSpace: false`.
//
// Remove this once the reset flow is verified end to end.
const LOGGED_PATHS = [
  '/api/Authentication/reset-password',
  '/api/Authentication/confirm-email',
]

const redactPasswords = (body) =>
  Object.fromEntries(
    Object.entries(body).map(([key, value]) =>
      /password/i.test(key) ? [key, '<redacted>'] : [key, value],
    ),
  )

api.interceptors.request.use((config) => {
  if (!LOGGED_PATHS.some((path) => config.url?.startsWith(path))) return config

  const payload = config.data ?? config.params ?? {}
  const token = typeof payload.token === 'string' ? payload.token : ''

  console.info('[auth] outgoing request', {
    method: config.method?.toUpperCase(),
    url: `${config.baseURL ?? ''}${config.url}`,
    payload: redactPasswords(payload),
    tokenLength: token.length,
    tokenHasSpace: token.includes(' '),
  })

  return config
})

// Callers get the payload, not the envelope. A body that says `success: false`
// with a 200 is still a failure, so it is rejected rather than returned.
api.interceptors.response.use(
  (response) => {
    const body = response.data

    if (body && typeof body === 'object' && 'success' in body) {
      if (!body.success) {
        return Promise.reject(
          normaliseError({ response: { status: response.status, data: body } }),
        )
      }

      return body.data
    }

    return body
  },
  async (error) => {
    const original = error.config
    const status = error.response?.status

    // An expired access token is worth one silent renewal and one retry, so a
    // signed-in user is not thrown back to the login form mid-task.
    //
    // `renewed` marks the request as having had its one attempt: if the fresh
    // token is refused too, the problem is not staleness and retrying again
    // would loop.
    if (
      status === 401 &&
      original &&
      !original.renewed &&
      !isPublicAuthPath(original.url) &&
      requestRefresh
    ) {
      original.renewed = true

      try {
        const token = await renewAccessToken()
        if (token) original.headers.Authorization = `Bearer ${token}`

        return await api(original)
      } catch {
        // The refresh token is missing, expired or refused. The session is over
        // — say so once, here, rather than letting every pending call decide
        // for itself.
        handleSessionExpired?.()
      }
    }

    return Promise.reject(normaliseError(error))
  },
)

export default api
