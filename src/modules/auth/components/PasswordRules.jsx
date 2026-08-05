import { PASSWORD_RULES } from '../constants/passwordReset.js'

/**
 * The password requirements, each ticking itself off as the password satisfies
 * it (Figma node 14:860).
 *
 * Shown while typing rather than after submitting: the rules are what the field
 * will be judged against, so withholding them until a failed submit makes the
 * user guess at something we already know.
 *
 * The marks are drawn as checkboxes because that is how the frame draws them,
 * but they are output rather than input — spans carrying a label, not disabled
 * inputs a keyboard would still stop on.
 */
function PasswordRules({ password, title = 'كلمه مرورك يجب ان تحتوي علي :' }) {
  return (
    <div className="flex w-full flex-col gap-[8px]">
      <p className="text-right text-[14px] leading-[1.5] font-bold text-text-400 sm:text-[16px]">
        {title}
      </p>

      {/* Polite, not assertive: the list updates on nearly every keystroke, and
          an assertive region would interrupt the user mid-word. */}
      <ul aria-live="polite" className="flex w-full flex-col gap-[8px]">
        {PASSWORD_RULES.map((rule) => {
          const met = rule.test(password)

          return (
            <li
              key={rule.id}
              className="flex items-center justify-between gap-[12px]"
            >
              {/* The rule reads first and the mark sits opposite it, which in a
                  right to left row puts the box on the left, as drawn. */}
              <span
                className={`text-right text-[13px] leading-[1.5] transition-colors duration-200 sm:text-[14px] ${
                  met ? 'text-success-800' : 'text-text-300'
                }`}
              >
                {rule.label}
              </span>

              <span
                role="img"
                aria-label={met ? 'مستوفى' : 'غير مستوفى'}
                className={`flex size-[20px] shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-200 ${
                  met
                    ? 'border-success-500 bg-success-500 text-white'
                    : 'border-accent-100 bg-white text-transparent'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                  className="size-[14px]"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default PasswordRules
