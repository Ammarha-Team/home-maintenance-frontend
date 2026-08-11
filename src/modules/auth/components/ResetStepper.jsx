import { RESET_STEP_LABELS } from '../constants/passwordReset.js'

// Progress rail for the password reset flow (Figma node 14:795).
//
// The frame draws it as a vertical rail beside the cards, which only fits while
// the cards keep their width. Below that it lays out as a row above them —
// same marks, same colours, same order — so the step you are on is still
// visible on a phone instead of disappearing with the rail.
// `labels` defaults to the frame's three OTP steps. The link-based flow passes
// its own shorter list, which is why the rail counts what it is given rather
// than the constant.
function ResetStepper({ currentStep, labels = RESET_STEP_LABELS }) {
  return (
    <ol
      aria-label="مراحل إعادة تعيين كلمة المرور"
      className="flex w-full items-start justify-center gap-[8px] xl:h-full xl:w-[118px] xl:flex-col xl:items-stretch xl:gap-0"
    >
      {labels.map((label, index) => {
        const step = index + 1
        const done = step < currentStep
        const active = step === currentStep
        const isLast = step === labels.length

        return (
          <li
            key={label}
            aria-current={active ? 'step' : undefined}
            className="flex min-w-0 flex-1 flex-col items-center xl:flex-none"
          >
            <div className="flex w-full flex-col items-center gap-[12px]">
              {/* Re-keying on the state is what replays the pop: the mark is a
                  new element each time the step changes hands, so the
                  animation runs instead of being stuck at its end frame. */}
              <span
                key={done ? 'done' : active ? 'active' : 'idle'}
                className={`reset-mark-pop flex size-[48px] shrink-0 items-center justify-center rounded-full border text-[17px] font-bold transition-colors duration-300 ${
                  done
                    ? 'border-success-200 bg-success-500 text-white'
                    : active
                      ? 'border-primary-50 bg-primary-300 text-white'
                      : 'border-text-100 bg-surface text-text-100'
                }`}
              >
                {done ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                    className="size-[24px]"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </span>

              <span
                className={`text-center text-[14px] font-bold leading-[1.5] transition-colors duration-300 ${
                  done
                    ? 'text-success-500'
                    : active
                      ? 'text-primary-300'
                      : 'text-text-100'
                }`}
              >
                {label}
              </span>
            </div>

            {/* The rule belongs to the step above it, so it fills only once
                that step is behind you. Drawing it as a track with a green
                line growing down it makes the rail advance rather than jump
                from one colour to the other. It is part of the rail, which
                the row layout does not draw. */}
            {isLast ? null : (
              <span
                aria-hidden="true"
                className="relative hidden overflow-hidden bg-text-100 xl:my-[8px] xl:block xl:h-full xl:min-h-[120px] xl:w-[2px] xl:self-center xl:rounded-full"
              >
                <span
                  className={`absolute inset-x-0 top-0 rounded-full bg-success-500 transition-[height] duration-500 ease-out ${
                    done ? 'h-full' : 'h-0'
                  }`}
                />
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default ResetStepper
