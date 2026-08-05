// Password reset flow (Figma nodes 14:762 "change password" and 14:908 "The
// password has been changed."). One page, three steps, a confirmation dialog.

// Step order, matching the vertical stepper on the frame's left rail.
export const RESET_STEPS = {
  method: 1,
  code: 2,
  password: 3,
}

export const RESET_STEP_LABELS = [
  'وسيله التحقق',
  'رمز ال otp',
  'اعاده تعيين كلمه مرور',
]

// The frame offers the same two identifiers login does, so the wording and the
// order match AuthMethodSwitcher rather than introducing a third vocabulary.
export const RESET_METHODS = {
  email: 'email',
  phone: 'phone',
}

// Which channels a user can actually pick today.
//
// The backend sends a reset link by email and has no SMS or OTP endpoint yet,
// so phone is switched off rather than deleted: the option, its icon, its field
// and the OTP screens all stay in the codebase and come back by flipping this
// flag once those endpoints exist.
export const RESET_METHOD_AVAILABILITY = {
  [RESET_METHODS.email]: true,
  [RESET_METHODS.phone]: false,
}

export const isResetMethodAvailable = (method) =>
  RESET_METHOD_AVAILABILITY[method] === true

// The rail while the flow is link-based. RESET_STEP_LABELS above is the
// three-step OTP rail the frame draws, kept for when that flow returns.
export const ACTIVE_RESET_STEP_LABELS = ['وسيله التحقق', 'تحقق من بريدك']

export const ACTIVE_RESET_STEPS = {
  request: 1,
  sent: 2,
}

export const OTP_LENGTH = 5

// The frame shows "3:23 ث" left on the countdown, i.e. a code that starts life
// somewhere under four minutes. 180s is the round number inside that.
export const OTP_TTL_SECONDS = 180

// Rules from node 14:860, in the frame's order. Each one is checked live as the
// new password is typed, which is what the check marks in the design show.
export const PASSWORD_RULES = [
  { id: 'digit', label: 'أرقام (0–9)', test: (value) => /\d/.test(value) },
  {
    id: 'length',
    label: '8 احرف علي الاقل',
    test: (value) => value.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'حروف كبيرة (A, B, C…)',
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: 'symbol',
    label: 'رموز خاصة (! @ # $ % ^ & *)',
    test: (value) => /[!@#$%^&*]/.test(value),
  },
]

export const passwordMeetsRules = (value) =>
  PASSWORD_RULES.every((rule) => rule.test(value))

// Masks the identifier the code was sent to, the way the frame does
// ("+020*******97"). The full value never needs to reach the screen.
export const maskIdentifier = (method, value) => {
  if (!value) return ''

  if (method === RESET_METHODS.email) {
    const [name, domain] = value.split('@')
    if (!domain) return value
    const head = name.slice(0, 2)

    return `${head}${'*'.repeat(Math.max(name.length - 2, 1))}@${domain}`
  }

  const digits = value.replace(/\s/g, '')

  return `${digits.slice(0, 3)}${'*'.repeat(
    Math.max(digits.length - 5, 1),
  )}${digits.slice(-2)}`
}
