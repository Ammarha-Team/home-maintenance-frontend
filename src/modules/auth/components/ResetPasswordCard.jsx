import Button from '../../../shared/components/Button.jsx'
import PasswordField from './PasswordField.jsx'
import ResetCard from './ResetCard.jsx'
import { PASSWORD_RULES } from '../constants/passwordReset.js'

const FIELD_HEIGHT = 56
const FIELD_FONT_SIZE = 16

// Step 3 (Figma node 14:840): the new password, with the rule list from node
// 14:860 checking itself as you type. The frame draws the marks as checkboxes,
// so they are rendered as boxes rather than as ticks in free space — but they
// are output, not input, which is why they are spans carrying a label and not
// disabled inputs a keyboard would still stop on.
function ResetPasswordCard({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  errors,
  submitError,
  submitting,
  onSubmit,
}) {
  return (
    <ResetCard
      title="إعادة تعيين كلمة المرور"
      subtitle="قم بإدخال كلمة مرور جديدة للوصول إلى حسابك"
      gap={32}
    >
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex w-full max-w-[650px] flex-col gap-[24px]"
      >
        <PasswordField
          id="reset-new-password"
          label="كلمه السر"
          placeholder="********"
          autoComplete="new-password"
          height={FIELD_HEIGHT}
          fontSize={FIELD_FONT_SIZE}
          value={password}
          onChange={onPasswordChange}
          error={errors.password}
        />

        <PasswordField
          id="reset-confirm-password"
          label="تاكيد كلمه السر"
          placeholder="********"
          autoComplete="new-password"
          height={FIELD_HEIGHT}
          fontSize={FIELD_FONT_SIZE}
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          error={errors.confirmPassword}
        />

        <div className="flex w-full flex-col gap-[8px]">
          <p className="text-right text-[16px] font-bold leading-[1.5] text-text-400 sm:text-[20px]">
            كلمه مرورك يجب ان تحتوي علي :
          </p>

          <ul className="flex w-full flex-col gap-[8px]">
            {PASSWORD_RULES.map((rule) => {
              const met = rule.test(password)

              return (
                <li
                  key={rule.id}
                  className="flex items-center justify-between gap-[12px]"
                >
                  {/* The rule reads first and the mark sits opposite it, which
                      in a right to left row puts the box on the left, as the
                      frame draws it. */}
                  <span
                    className={`text-right text-[14px] leading-[1.5] transition-colors duration-200 sm:text-[16px] ${
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

        {submitError ? (
          <p role="alert" className="text-right text-[16px] text-error-500">
            {submitError}
          </p>
        ) : null}

        <Button
          type="submit"
          fullWidth
          disabled={submitting}
          className="text-[18px] sm:text-[20px]"
        >
          {submitting ? '...جارٍ الحفظ' : 'حفظ كلمة المرور'}
        </Button>
      </form>
    </ResetCard>
  )
}

export default ResetPasswordCard
