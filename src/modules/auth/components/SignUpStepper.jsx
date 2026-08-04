import { SIGN_UP_STEP_LABELS } from '../constants/authRoutes.js'

// Step indicator from Figma node 1:468 — three numbered circles joined by
// connectors. Steps run right to left: 1 نوع الحساب, 2 إدخال البيانات,
// 3 الموافقة. `currentStep` is 1-based.
// The joining agreement frame (node 6:1698) draws the same indicator larger, so
// `size` picks between the two rather than forking the component.
const SIZES = {
  default: { circle: 'size-[32px] rounded-[16px] text-[14px]', label: 'text-[12px]' },
  large: { circle: 'size-[40px] rounded-[20px] text-[16px]', label: 'text-[16px]' },
}

function SignUpStepper({
  steps = SIGN_UP_STEP_LABELS,
  currentStep,
  size = 'default',
}) {
  const sizing = SIZES[size]

  return (
    <ol dir="rtl" className="flex w-full items-center justify-between px-[16px]">
      {steps.map((label, index) => {
        const stepNumber = index + 1
        const reached = stepNumber <= currentStep
        const isCurrent = stepNumber === currentStep
        // The connector before a step is blue once that step has been reached.
        const connectorReached = stepNumber <= currentStep

        return (
          <li key={label} className="contents">
            {index > 0 ? (
              <span
                aria-hidden="true"
                // 137px is the frame's connector length. Capped rather than
                // fixed so a narrow card shortens the rule instead of pushing
                // the row wider than its container; at the frame's width the
                // cap is reached and the spacing is unchanged.
                className={`h-[2px] w-full max-w-[137px] min-w-[8px] flex-1 ${
                  connectorReached ? 'bg-primary-500' : 'bg-accent-100'
                }`}
              />
            ) : null}

            <div
              className="flex flex-col items-center gap-[8px]"
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span
                className={`flex items-center justify-center border-2 p-[2px] font-bold ${sizing.circle} ${
                  reached
                    ? 'border-primary-500 text-primary-500'
                    : 'border-accent-100 text-[#b7b7b7]'
                } ${isCurrent ? 'bg-surface' : 'bg-card'}`}
              >
                {stepNumber}
              </span>
              <span
                className={`${sizing.label} leading-[1.5] ${
                  reached ? 'text-primary-500' : 'text-text-200'
                }`}
              >
                {label}
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default SignUpStepper
