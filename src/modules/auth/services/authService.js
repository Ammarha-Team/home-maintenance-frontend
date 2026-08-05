import api from '../../../shared/services/api.js'
import { clearSession } from './authSession.js'

// Auth API surface, backed by /api/Authentication.

// The API answers in English ("User not found", "Email or password is
// incorrect!") and the app is Arabic, so the codes it sends — which are stable,
// unlike the prose — are mapped to copy the user can read. Anything unmapped
// keeps whatever message came back rather than being swallowed.
const AUTH_ERROR_MESSAGES = {
  'Auth.UserNotFound': 'لا يوجد حساب مسجل بهذا البريد الإلكتروني.',
  'Auth.InvalidCredentials': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
  'Auth.EmailNotConfirmed':
    'لم يتم تفعيل هذا الحساب بعد. افتح بريدك واضغط على رابط التفعيل.',
  'Auth.RefreshTokenMissing': 'انتهت الجلسة. سجّل الدخول مرة أخرى.',
  // Both arrive as the API's "Invalid token." — a link that has expired, has
  // already been used, or was truncated on its way through a mail client.
  'Auth.InvalidToken':
    'رابط التفعيل غير صالح أو منتهي الصلاحية. اطلب رسالة تفعيل جديدة.',
  'Auth.PasswordResetFailed':
    'رابط إعادة التعيين غير صالح أو منتهي الصلاحية. اطلب رابطًا جديدًا.',
  'Validation.Failed': 'تحقق من البيانات المدخلة وحاول مرة أخرى.',
  'Network.Unreachable': 'تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.',
}

const translateAuthError = (error) => {
  const message = AUTH_ERROR_MESSAGES[error.code]
  if (message) error.message = message

  return error
}

// Both register endpoints currently take the technician DTO — the backend team
// has confirmed `register-client` shares it for now — so a customer sign up has
// to send a location the form never asks for. Only `location` is enforced:
// posting a client without `professionId` or `yearsOfExperience` succeeds, so
// neither is sent rather than inventing a trade for someone who has none.
//
// This stand-in is the one thing to delete once the client DTO is split.
const CLIENT_LOCATION_PLACEHOLDER = 'غير محدد'

/**
 * Trades, for the technician sign up select.
 *
 * @returns {Promise<Array<{id: string, name: string}>>}
 */
export const getProfessions = async () => {
  const professions = await api.get('/api/Profession/GetAll')

  return Array.isArray(professions) ? professions : []
}

/**
 * POST /api/Authentication/login.
 *
 * The API takes an email and a password — there is no phone sign in — so the
 * caller's `identifier` is sent as the address.
 *
 * Swagger documents this as `200: OK` with no schema. The shape below was read
 * off a real successful login:
 *
 *   { id, email, token, roles: ["Technician"], message, isAuthenticated,
 *     refreshTokenExpiration }
 *
 * plus a `refreshToken` httpOnly cookie the browser stores and never shows us.
 */
export const login = async ({ identifier, password }) => {
  try {
    const data = await api.post('/api/Authentication/login', {
      email: identifier,
      password,
    })

    return readSession(data)
  } catch (error) {
    throw translateAuthError(error)
  }
}

// A login without a token is not a login, whatever the envelope says, so a
// payload missing one fails loudly rather than storing an empty session that
// would only break on the next request.
//
// `refreshTokenExpiration` is deliberately ignored: the refresh token is a
// cookie the browser manages, and the server is the only party whose opinion of
// its lifetime counts.
const readSession = (data) => {
  const token = data?.token

  if (!token) {
    const failure = new Error('تعذر إتمام تسجيل الدخول. حاول مرة أخرى لاحقًا.')
    failure.code = 'Auth.UnexpectedLoginPayload'
    throw failure
  }

  return {
    token,
    user: {
      id: data.id ?? null,
      email: data.email ?? null,
      roles: Array.isArray(data.roles) ? data.roles : [data.roles].filter(Boolean),
    },
  }
}

// Shared by both sign ups.
//
// Today the endpoint answers with a sentence, not a session — "Registration
// successful. Please confirm your email" — and logging in before that
// confirmation is rejected. So there is no role to route on and the caller
// shows the confirm-your-email step.
//
// If the API is later changed to return a session at registration, the token
// is picked up here and handed back, and the caller routes by role through the
// same helper login uses. Nothing about the destination is decided here.
const registerRequest = (path, body) =>
  api.post(path, body).then((data) => {
    if (data && typeof data === 'object' && data.token) {
      return { session: readSession(data) }
    }

    return {
      message:
        typeof data === 'string' ? data : 'تم إنشاء الحساب. افتح بريدك لتفعيله.',
    }
  })

/**
 * POST /api/Authentication/register-client.
 *
 * @param {{fullName: string, email: string, phone: string, password: string,
 *          confirmPassword: string, location?: string}} details
 */
export const registerCustomer = async (details) => {
  try {
    return await registerRequest('/api/Authentication/register-client', {
      fullName: details.fullName,
      email: details.email,
      phoneNumber: details.phone,
      password: details.password,
      confirmPassword: details.confirmPassword,
      location: details.location || CLIENT_LOCATION_PLACEHOLDER,
    })
  } catch (error) {
    throw translateAuthError(error)
  }
}

/**
 * POST /api/Authentication/register-technician.
 *
 * `specialisation` carries the profession id chosen from getProfessions, and
 * `experience` the years as typed.
 */
export const registerTechnician = async (details) => {
  try {
    return await registerRequest('/api/Authentication/register-technician', {
      fullName: details.fullName,
      email: details.email,
      phoneNumber: details.phone,
      password: details.password,
      confirmPassword: details.confirmPassword,
      location: details.location || CLIENT_LOCATION_PLACEHOLDER,
      professionId: details.specialisation,
      yearsOfExperience: Number(details.experience) || 0,
    })
  } catch (error) {
    throw translateAuthError(error)
  }
}

/**
 * POST /api/Authentication/logout.
 *
 * Revokes the refresh token server side. Takes no body and identifies the
 * session purely by the httpOnly `refreshToken` cookie, so it has to go out
 * with credentials.
 */
export const logout = async () => {
  try {
    await api.post('/api/Authentication/logout', null, {
      withCredentials: true,
    })
  } catch (error) {
    throw translateAuthError(error)
  }
}

/**
 * POST /api/Authentication/refresh-token.
 *
 * Trades the refresh cookie for a fresh access token. As with logout it is the
 * cookie that identifies the caller, so this needs credentials and no body.
 *
 * @returns {Promise<{token: string, user: object}>} the renewed session
 */
export const refreshSession = async () => {
  try {
    const data = await api.post('/api/Authentication/refresh-token', null, {
      withCredentials: true,
    })

    // Same reader as login: it insists on a token rather than storing a
    // session that has none.
    return readSession(data)
  } catch (error) {
    throw translateAuthError(error)
  }
}

/**
 * Ends the session on the server and on this device.
 *
 * The local session is cleared whether or not the server call succeeds. Someone
 * who pressed sign out has to end up signed out here even if the network was
 * down — staying logged in because the server could not be reached is the worse
 * of the two failures. The error is returned rather than thrown so the caller
 * can mention it without that blocking the redirect.
 *
 * @returns {Promise<{revoked: boolean, error: Error|null}>}
 */
export const signOut = async () => {
  try {
    await logout()
    return { revoked: true, error: null }
  } catch (error) {
    return { revoked: false, error }
  } finally {
    clearSession()
  }
}

/**
 * GET /api/Authentication/confirm-email.
 *
 * `userId` and `token` come straight off the link in the confirmation mail.
 * The token is single use — calling twice fails, which is why the screen guards
 * against a second request.
 */
export const confirmEmail = async ({ userId, token }) => {
  try {
    await api.get('/api/Authentication/confirm-email', {
      params: { userId, token },
    })
  } catch (error) {
    throw translateAuthError(error)
  }
}

/** POST /api/Authentication/resend-confirmation-email. */
export const resendConfirmationEmail = async (email) => {
  try {
    await api.post('/api/Authentication/resend-confirmation-email', { email })
  } catch (error) {
    throw translateAuthError(error)
  }
}

// Password reset, step one: POST /api/Authentication/forgot-password.
//
// This is the whole of the reset flow the app owns. The backend answers by
// mailing a link, and everything after that happens in the user's inbox, on the
// URL the mail carries — there is no code to verify and no password form here.
//
// `method` stays in the signature because the screens still pass it and phone
// is only switched off, not removed; email is the one channel the API has.
export const requestPasswordReset = async ({ identifier }) => {
  try {
    await api.post('/api/Authentication/forgot-password', { email: identifier })
  } catch (error) {
    throw translateAuthError(error)
  }
}

// Kept for the OTP recovery flow, which the backend does not implement yet.
// Unused by the active screens — see ForgotPassword.jsx.
export const verifyResetCode = async ({ code }) => {
  if (!/^\d{5}$/.test(code ?? '')) {
    throw new Error('invalid-code')
  }

  return { ticket: 'local-dev-reset-ticket' }
}

/**
 * POST /api/Authentication/reset-password.
 *
 * `userId` and `token` come from the link in the reset mail, not from anything
 * the user types — this is the second half of the link-based flow, and it is
 * the only place the new password is set.
 */
export const resetPassword = async ({
  userId,
  token,
  newPassword,
  confirmNewPassword,
}) => {
  try {
    await api.post('/api/Authentication/reset-password', {
      userId,
      token,
      newPassword,
      confirmNewPassword,
    })
  } catch (error) {
    throw translateAuthError(error)
  }
}
