import { useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '../../../shared/components/Button.jsx'
import { AUTH_ROUTES } from '../../auth/constants/authRoutes.js'
import { resendConfirmationEmail } from '../../auth/services/authService.js'

// TEMPORARY — DEMO ONLY. Part of the frontend-only technician review flow; see
// `../services/technicianReviewStore.js`.
//
// The actions that close the technician sign-up, shown inside the review card.
//
// The review is the demo half of this screen, but confirming the address is
// not: the API refuses a login with Auth.EmailNotConfirmed until the link in
// that mail is opened, so the instruction and the way to send it again have to
// survive whatever happens to the review flow around them.
//
// This deliberately repeats a little of `auth/components/AccountCreatedPanel`
// rather than reshaping it. That component ends the customer sign-up, which this
// change has no business touching, and keeping them apart means deleting this
// module later cannot break the customer path.

function ConfirmEmailActions({ email }) {
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
      setError(resendError.message || 'تعذر إرسال رسالة التفعيل، حاول مرة أخرى لاحقًا.')
    } finally {
      setResending(false)
    }
  }

  return (
    <>
      <p className="text-[14px] leading-[1.6] text-text-300">
        أرسلنا رسالة تفعيل إلى بريدك. افتح الرسالة واضغط على الرابط لتفعيل الحساب،
        ثم سجّل الدخول لمتابعة حالة المراجعة.
      </p>

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
    </>
  )
}

export default ConfirmEmailActions
