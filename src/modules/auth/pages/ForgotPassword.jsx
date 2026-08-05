import { useRef, useState } from 'react'
import PublicLayout from '../../../shared/layouts/PublicLayout.jsx'
import ResetLinkSentCard from '../components/ResetLinkSentCard.jsx'
import ResetMethodCard from '../components/ResetMethodCard.jsx'
import ResetStepper from '../components/ResetStepper.jsx'
import {
  ACTIVE_RESET_STEPS,
  ACTIVE_RESET_STEP_LABELS,
  RESET_METHODS,
} from '../constants/passwordReset.js'
import { requestPasswordReset } from '../services/authService.js'
import { validateEmail } from '../../../shared/utils/validation.js'

// "Change password" (Figma node 14:762).
//
// The frame draws three steps — choose a channel, type an OTP, set a new
// password. The backend implements recovery as a link instead: it mails a URL
// carrying the user id and a token, and the password is set from that mail. So
// the app owns only the first step, and the second is a confirmation that the
// mail is on its way.
//
// The OTP and in-app password screens (ResetCodeCard, ResetPasswordCard,
// PasswordChangedDialog) and the phone channel are left in the codebase
// untouched. They come back by restoring the steps here and flipping phone on
// in RESET_METHOD_AVAILABILITY, once the OTP endpoints exist.
function ForgotPassword() {
  const [step, setStep] = useState(ACTIVE_RESET_STEPS.request)
  const [method, setMethod] = useState(RESET_METHODS.email)
  const [identifier, setIdentifier] = useState('')

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  const stepRef = useRef(null)

  // Steps differ in height, so after a swap the card can start above the fold
  // on a short window. Bringing its top back into view keeps the heading of
  // the new step where the last one was.
  const revealStep = (nextStep) => {
    setStep(nextStep)

    window.requestAnimationFrame(() => {
      stepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const handleMethodChange = (nextMethod) => {
    setMethod(nextMethod)
    setIdentifier('')
    setErrors({})
  }

  // Email is the only channel the API offers, so the identifier is always an
  // address and is always validated as one.
  const handleSendLink = async (event) => {
    event.preventDefault()

    const identifierError = validateEmail(identifier)

    if (identifierError) {
      setErrors({ identifier: identifierError })
      return
    }

    setErrors({})
    setSubmitting(true)

    try {
      await requestPasswordReset({ method, identifier })
      revealStep(ACTIVE_RESET_STEPS.sent)
    } catch (error) {
      // The server names the field when it rejects the address itself;
      // otherwise its message is the most specific thing available.
      setErrors({
        identifier:
          error.fieldErrors?.email ||
          error.message ||
          'تعذر إرسال الرابط، حاول مرة أخرى لاحقًا.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    setErrors({})
    setResending(true)

    try {
      await requestPasswordReset({ method, identifier })
    } catch (error) {
      setErrors({
        resend:
          error.fieldErrors?.email ||
          error.message ||
          'تعذر إرسال الرابط مرة أخرى، حاول لاحقًا.',
      })
    } finally {
      setResending(false)
    }
  }

  return (
    <PublicLayout>
      <div
        dir="rtl"
        className="mx-auto flex w-full max-w-[1200px] flex-col gap-[24px] px-[16px] pt-[24px] pb-[64px] sm:px-[24px] xl:flex-row xl:items-stretch xl:gap-[40px] xl:px-[40px] xl:pt-[40px]"
      >
        {/* The rail comes after the cards in the source so a keyboard and a
            screen reader reach the form first; `order` puts it back on the
            side the frame draws it. */}
        {/* One step at a time. Re-keying on the step is what makes the swap an
            animation rather than a re-render: the outgoing card leaves, the
            incoming one plays its entrance. */}
        <div
          ref={stepRef}
          className="min-w-0 flex-1 scroll-mt-[24px] xl:order-2"
        >
          <div key={step} className="reset-step-enter">
            {step === ACTIVE_RESET_STEPS.request ? (
              <ResetMethodCard
                method={method}
                onMethodChange={handleMethodChange}
                identifier={identifier}
                onIdentifierChange={(value) => {
                  setIdentifier(value)
                  setErrors((current) => ({ ...current, identifier: '' }))
                }}
                error={errors.identifier}
                submitting={submitting}
                onSubmit={handleSendLink}
              />
            ) : (
              <ResetLinkSentCard
                email={identifier}
                onResend={handleResend}
                resending={resending}
                error={errors.resend}
              />
            )}
          </div>
        </div>

        {/* Last in the source, first on screen: the row layout wants the rail
            above the cards, where a stacked page reads it as a header. */}
        <div className="order-first xl:order-1 xl:w-[118px] xl:shrink-0 xl:py-[24px]">
          <ResetStepper currentStep={step} labels={ACTIVE_RESET_STEP_LABELS} />
        </div>
      </div>
    </PublicLayout>
  )
}

export default ForgotPassword
