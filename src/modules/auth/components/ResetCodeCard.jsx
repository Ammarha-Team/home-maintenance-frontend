import { useEffect, useRef, useState } from 'react'
import Button from '../../../shared/components/Button.jsx'
import ResetCard from './ResetCard.jsx'
import { OTP_LENGTH, OTP_TTL_SECONDS } from '../constants/passwordReset.js'

const formatCountdown = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = String(totalSeconds % 60).padStart(2, '0')

  return `${minutes}:${seconds}`
}

// Step 2 (Figma node 14:820): the 5 digit code.
//
// Five separate inputs rather than one — that is what the frame draws, and it
// is also what a phone's one-time-code autofill expects. They run right to left
// with the page, so the first digit lands in the right-hand box.
function ResetCodeCard({
  digits,
  onDigitsChange,
  error,
  submitting,
  onSubmit,
  onResend,
  resendKey,
  locked,
}) {
  const inputsRef = useRef([])
  const [secondsLeft, setSecondsLeft] = useState(OTP_TTL_SECONDS)

  // Nothing has been sent while the step is locked, so the clock does not
  // start until it opens. Restarting on `resendKey` re-arms it for each new
  // code, including the first one.
  useEffect(() => {
    setSecondsLeft(OTP_TTL_SECONDS)

    if (locked) return undefined

    const timer = setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [resendKey, locked])

  const expired = secondsLeft === 0

  const focusInput = (index) => {
    const target = inputsRef.current[index]
    if (target) target.focus()
  }

  const setDigit = (index, value) => {
    const next = [...digits]
    next[index] = value
    onDigitsChange(next)
  }

  const handleChange = (index) => (event) => {
    const typed = event.target.value.replace(/\D/g, '')

    if (!typed) {
      setDigit(index, '')
      return
    }

    // A paste or an autofill arrives in one field: spread it across the rest
    // instead of keeping the first character and dropping the code.
    if (typed.length > 1) {
      const next = [...digits]
      typed
        .slice(0, OTP_LENGTH - index)
        .split('')
        .forEach((character, offset) => {
          next[index + offset] = character
        })
      onDigitsChange(next)
      focusInput(Math.min(index + typed.length, OTP_LENGTH - 1))
      return
    }

    setDigit(index, typed)
    if (index < OTP_LENGTH - 1) focusInput(index + 1)
  }

  const handleKeyDown = (index) => (event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      focusInput(index - 1)
      return
    }

    // The boxes are laid out right to left, so the arrow that moves back is
    // the one pointing right.
    if (event.key === 'ArrowRight' && index > 0) {
      event.preventDefault()
      focusInput(index - 1)
    }

    if (event.key === 'ArrowLeft' && index < OTP_LENGTH - 1) {
      event.preventDefault()
      focusInput(index + 1)
    }
  }

  return (
    <ResetCard
      title="تأكد من رسائلك"
      subtitle={`ادخل الكود المرسل المكون من ${OTP_LENGTH} ارقام`}
      locked={locked}
      gap={32}
    >
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex w-full flex-col items-center gap-[24px]"
      >
        <div
          dir="rtl"
          role="group"
          aria-label="كود التحقق"
          className="flex w-full flex-wrap justify-center gap-[8px]"
        >
          {Array.from({ length: OTP_LENGTH }, (_, index) => (
            <input
              key={index}
              ref={(element) => {
                inputsRef.current[index] = element
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={OTP_LENGTH}
              aria-label={`الرقم ${index + 1}`}
              aria-invalid={Boolean(error)}
              value={digits[index] ?? ''}
              onChange={handleChange(index)}
              onKeyDown={handleKeyDown(index)}
              onFocus={(event) => event.target.select()}
              // 64.5px in the frame; it steps down on a narrow window so five
              // boxes and their gaps still fit a 360px screen.
              className={`size-[52px] rounded-[8px] border text-center text-[20px] font-bold text-text-500 transition-colors duration-200 outline-none focus:border-primary-500 focus:bg-primary-50 sm:size-[64.5px] sm:text-[24px] ${
                error
                  ? 'border-error-500 bg-error-50'
                  : digits[index]
                    ? 'border-primary-100 bg-primary-50'
                    : 'border-line bg-card'
              }`}
            />
          ))}
        </div>

        <p
          aria-live="polite"
          className="text-center text-[16px] leading-[1.5] text-text-300 sm:text-[20px]"
        >
          {expired ? (
            'انتهت صلاحية رمز التحقق'
          ) : (
            <>
              ينتهي رمز التحقق بعد{' '}
              <span dir="ltr" className="font-bold text-primary-500">
                {formatCountdown(secondsLeft)}
              </span>{' '}
              ث
            </>
          )}
        </p>

        {error ? (
          <p
            role="alert"
            className="w-full text-center text-[16px] text-error-500"
          >
            {error}
          </p>
        ) : null}

        {/* Verify first in the source, so in a right to left row it lands on
            the right where the frame puts it. */}
        <div className="flex w-full max-w-[698px] flex-col gap-[12px] sm:flex-row">
          <Button
            type="submit"
            fullWidth
            disabled={submitting}
            className="h-[56px] text-[18px] sm:text-[20px]"
          >
            {submitting ? '...جارٍ التحقق' : 'تحقق'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onResend}
            className="h-[56px] text-[18px] sm:text-[20px]"
          >
            اعاده ارسال
          </Button>
        </div>
      </form>
    </ResetCard>
  )
}

export default ResetCodeCard
