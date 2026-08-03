import { useRef, useState } from 'react'
import PublicLayout from '../../../shared/layouts/PublicLayout.jsx'
import PasswordChangedDialog from '../components/PasswordChangedDialog.jsx'
import ResetCodeCard from '../components/ResetCodeCard.jsx'
import ResetMethodCard from '../components/ResetMethodCard.jsx'
import ResetPasswordCard from '../components/ResetPasswordCard.jsx'
import ResetStepper from '../components/ResetStepper.jsx'
import {
  OTP_LENGTH,
  RESET_METHODS,
  RESET_STEPS,
  passwordMeetsRules,
} from '../constants/passwordReset.js'
import {
  requestPasswordReset,
  resetPassword,
  verifyResetCode,
} from '../services/authService.js'
import {
  validateConfirmPassword,
  validateEmail,
  validatePhone,
} from '../../../shared/utils/validation.js'

const emptyCode = () => Array.from({ length: OTP_LENGTH }, () => '')

// "Change password" (Figma node 14:762). All three steps sit on one page, as
// the frame draws them, with the rail beside them tracking which one is live.
// Steps you have not reached yet are dimmed and inert rather than hidden, so
// the page keeps the shape the design gives it.
function ForgotPassword() {
  const [step, setStep] = useState(RESET_STEPS.method)
  const [method, setMethod] = useState(RESET_METHODS.email)
  const [identifier, setIdentifier] = useState('')
  const [digits, setDigits] = useState(emptyCode)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [resendKey, setResendKey] = useState(0)
  const [done, setDone] = useState(false)

  const codeCardRef = useRef(null)
  const passwordCardRef = useRef(null)

  // A step opening lower down the page is easy to miss on a laptop, so the
  // page brings it into view — smoothly, and only when it actually unlocks.
  const revealStep = (nextStep) => {
    setStep(nextStep)

    const target =
      nextStep === RESET_STEPS.code
        ? codeCardRef.current
        : passwordCardRef.current

    window.requestAnimationFrame(() => {
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  const handleMethodChange = (nextMethod) => {
    setMethod(nextMethod)
    setIdentifier('')
    setErrors({})
  }

  const handleSendCode = async (event) => {
    event.preventDefault()

    const identifierError =
      method === RESET_METHODS.email
        ? validateEmail(identifier)
        : validatePhone(identifier)

    if (identifierError) {
      setErrors({ identifier: identifierError })
      return
    }

    setErrors({})
    setSubmitting(true)

    try {
      await requestPasswordReset({ method, identifier })
      setDigits(emptyCode())
      setResendKey((current) => current + 1)
      revealStep(RESET_STEPS.code)
    } catch {
      setErrors({ identifier: 'تعذر إرسال كود التحقق، حاول مرة أخرى لاحقًا.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    setErrors({})
    setDigits(emptyCode())

    try {
      await requestPasswordReset({ method, identifier })
      setResendKey((current) => current + 1)
    } catch {
      setErrors({ code: 'تعذر إرسال كود جديد، حاول مرة أخرى لاحقًا.' })
    }
  }

  const handleVerify = async (event) => {
    event.preventDefault()

    const code = digits.join('')

    if (code.length < OTP_LENGTH) {
      setErrors({ code: 'يرجى إدخال الكود كاملًا' })
      return
    }

    setErrors({})
    setSubmitting(true)

    try {
      await verifyResetCode({ code })
      revealStep(RESET_STEPS.password)
    } catch {
      setErrors({ code: 'كود التحقق غير صحيح' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = async (event) => {
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
      await resetPassword({ method, identifier, password })
      setDone(true)
    } catch {
      setErrors({ submit: 'تعذر تغيير كلمة المرور، حاول مرة أخرى لاحقًا.' })
    } finally {
      setSubmitting(false)
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
        <div className="flex min-w-0 flex-1 flex-col gap-[24px] xl:order-2">
          <ResetMethodCard
            method={method}
            onMethodChange={handleMethodChange}
            identifier={identifier}
            onIdentifierChange={(value) => {
              setIdentifier(value)
              setErrors((current) => ({ ...current, identifier: '' }))
            }}
            error={errors.identifier}
            submitting={submitting && step === RESET_STEPS.method}
            onSubmit={handleSendCode}
            locked={step !== RESET_STEPS.method}
          />

          <div ref={codeCardRef} className="scroll-mt-[24px]">
            <ResetCodeCard
              digits={digits}
              onDigitsChange={(next) => {
                setDigits(next)
                setErrors((current) => ({ ...current, code: '' }))
              }}
              error={errors.code}
              submitting={submitting && step === RESET_STEPS.code}
              onSubmit={handleVerify}
              onResend={handleResend}
              resendKey={resendKey}
              locked={step !== RESET_STEPS.code}
            />
          </div>

          <div ref={passwordCardRef} className="scroll-mt-[24px]">
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
              submitting={submitting && step === RESET_STEPS.password}
              onSubmit={handleReset}
              locked={step !== RESET_STEPS.password}
            />
          </div>
        </div>

        {/* Last in the source, first on screen: the row layout wants the rail
            above the cards, where a stacked page reads it as a header. */}
        <div className="order-first xl:order-1 xl:w-[118px] xl:shrink-0 xl:py-[24px]">
          <ResetStepper currentStep={step} />
        </div>
      </div>

      {done ? <PasswordChangedDialog /> : null}
    </PublicLayout>
  )
}

export default ForgotPassword
