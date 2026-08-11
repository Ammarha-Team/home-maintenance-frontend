import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../shared/components/Button.jsx'
import EnvelopeIcon from '../../../shared/components/icons/EnvelopeIcon.jsx'
import { AUTH_ROUTES } from '../constants/authRoutes.js'
import { resendConfirmationEmail } from '../services/authService.js'

/**
 * End of both sign up flows.
 *
 * The API creates the account but does not sign anyone in — it answers
 * "Registration successful. Please confirm your email", and a login before that
 * confirmation is rejected with Auth.EmailNotConfirmed. So the last step is an
 * instruction rather than a redirect, with a way to send the mail again for the
 * common case where it never arrives.
 */
function AccountCreatedPanel({ email }) {
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [error, setError] = useState('')

  const handleResend = async () => {
    setResending(true)
    setResent(false)
    setError('')

    try {
      await resendConfirmationEmail(email)
      setResent(true)
    } catch (resendError) {
      setError(
        resendError.message ||
          'تعذر إرسال رسالة التفعيل، حاول مرة أخرى لاحقًا.',
      )
    } finally {
      setResending(false)
    }
  }

  return (
    <section className="flex flex-col items-center gap-[20px] rounded-[12px] border border-line bg-white p-[24px] text-center sm:p-[32px]">
      <span
        aria-hidden="true"
        className="flex size-[72px] items-center justify-center rounded-full bg-primary-50 text-primary-500"
      >
        <EnvelopeIcon className="size-[30px]" />
      </span>

      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[24px] leading-[1.5] font-bold text-text-500">
          تم إنشاء حسابك
        </h2>
        <p className="text-[16px] leading-[1.6] text-text-300">
          أرسلنا رسالة تفعيل إلى بريدك. افتح الرسالة واضغط على الرابط لتفعيل
          الحساب، ثم سجّل الدخول.
        </p>
      </div>

      {email ? (
        <p className="text-[18px] leading-[1.5] font-bold break-all text-text-500">
          {email}
        </p>
      ) : null}

      {resent ? (
        <p role="status" className="text-[14px] font-bold text-success-800">
          تم إرسال رسالة التفعيل مرة أخرى.
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="text-[14px] font-bold text-error-500">
          {error}
        </p>
      ) : null}

      <div className="flex w-full flex-col gap-[12px]">
        <Link
          to={AUTH_ROUTES.login}
          className="flex h-[52px] w-full items-center justify-center rounded-[12px] bg-primary-500 text-[16px] font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          الذهاب لتسجيل الدخول
        </Link>

        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={resending || !email}
          onClick={handleResend}
          className="h-[52px] text-[16px]"
        >
          {resending ? '...جارٍ الإرسال' : 'إعادة إرسال رسالة التفعيل'}
        </Button>
      </div>
    </section>
  )
}

export default AccountCreatedPanel
