import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PublicLayout from '../../../shared/layouts/PublicLayout.jsx'
import PasswordChangedDialog from '../components/PasswordChangedDialog.jsx'
import ResetPasswordCard from '../components/ResetPasswordCard.jsx'
import { AUTH_ROUTES } from '../constants/authRoutes.js'
import { passwordMeetsRules } from '../constants/passwordReset.js'
import { resetPassword } from '../services/authService.js'
import { validateConfirmPassword } from '../../../shared/utils/validation.js'

/**
 * Reads a query parameter without decoding it.
 *
 * `URLSearchParams.get` percent-decodes, which is normally what you want and is
 * wrong here. The reset endpoint decodes the token itself, so it has to receive
 * the escaped form the mail link carries: decoding first and letting the server
 * decode again turns every `+` in the token into a space — the token holds four
 * of them — and the resulting string is no longer valid base64, which the API
 * reports as `Auth.PasswordResetFailed` / "Invalid token."
 *
 * So the value is cut out of the raw query string byte for byte and passed on
 * exactly as it arrived.
 */
const readRawParam = (search, name) => {
  const pair = search
    .replace(/^\?/, '')
    .split('&')
    .find((entry) => entry.startsWith(`${name}=`))

  return pair ? pair.slice(name.length + 1) : null
}

/**
 * The second half of the link-based password reset (Figma node 14:840).
 *
 * The mail carries a `userId` and a single-use `token`; this page reads them
 * from the query string and is the only place the new password is set. It
 * reuses the card and the confirmation dialog the OTP flow drew, so the screen
 * a user reaches from their inbox is the one the design specifies.
 */
function ResetPassword() {
  const { search } = useLocation()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const userId = readRawParam(search, 'userId')
  const token = readRawParam(search, 'token')
  const linkComplete = Boolean(userId && token)

  const handleSubmit = async (event) => {
    event.preventDefault()

    // The rule list under the fields is the spec for the password, so the
    // submit check is that same list rather than a second, looser one.
    const passwordError = passwordMeetsRules(password)
      ? ''
      : 'كلمة السر لا تحقق الشروط المطلوبة'
    const confirmError = validateConfirmPassword(confirmPassword, password)

    if (passwordError || confirmError) {
      setErrors({ password: passwordError, confirmPassword: confirmError })
      return
    }

    setErrors({})
    setSubmitting(true)

    try {
      await resetPassword({
        userId,
        token,
        newPassword: password,
        confirmNewPassword: confirmPassword,
      })
      setDone(true)
    } catch (error) {
      setErrors({
        submit: error.message || 'تعذر تغيير كلمة المرور، حاول مرة أخرى لاحقًا.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PublicLayout>
      <div
        dir="rtl"
        className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-[24px] px-[16px] pt-[32px] pb-[64px] sm:px-[24px]"
      >
        {linkComplete ? (
          <ResetPasswordCard
            password={password}
            confirmPassword={confirmPassword}
            onPasswordChange={(value) => {
              setPassword(value)
              setErrors((current) => ({ ...current, password: '' }))
            }}
            onConfirmPasswordChange={(value) => {
              setConfirmPassword(value)
              setErrors((current) => ({ ...current, confirmPassword: '' }))
            }}
            errors={errors}
            submitError={errors.submit}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        ) : (
          // Reached without the link's parameters — nothing can be reset, so
          // the page says so instead of showing a form that would always fail.
          <div className="flex w-full flex-col items-center gap-[16px] rounded-[12px] border border-line bg-white p-[32px] text-center">
            <h1 className="text-[24px] font-bold text-text-500">
              رابط إعادة التعيين غير صالح
            </h1>
            <p className="text-[16px] leading-[1.6] text-text-300">
              افتح الرابط من رسالة البريد كما هو، أو اطلب رابطًا جديدًا.
            </p>
            <Link
              to={AUTH_ROUTES.forgotPassword}
              className="flex h-[52px] w-full max-w-[320px] items-center justify-center rounded-[12px] bg-primary-500 text-[16px] font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              طلب رابط جديد
            </Link>
          </div>
        )}
      </div>

      {done ? <PasswordChangedDialog /> : null}
    </PublicLayout>
  )
}

export default ResetPassword
