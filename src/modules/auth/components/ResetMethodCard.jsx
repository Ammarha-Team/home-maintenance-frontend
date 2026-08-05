import Button from '../../../shared/components/Button.jsx'
import EnvelopeIcon from '../../../shared/components/icons/EnvelopeIcon.jsx'
import PhoneIcon from '../../../shared/components/icons/PhoneIcon.jsx'
import EmailField from './EmailField.jsx'
import PhoneField from './PhoneField.jsx'
import ResetCard from './ResetCard.jsx'
import {
  RESET_METHODS,
  isResetMethodAvailable,
} from '../constants/passwordReset.js'

// Step 1 (Figma node 14:813): choose where the reset is sent.
//
// The frame shows the two options already carrying an address and a number,
// which is the signed-in case. This flow is reached from the login screen, so
// the account is not known yet and the chosen option has to ask for the
// identifier before anything can be sent — the field sits under the pair rather
// than beside it, so the two option cards keep the layout the frame gives them.
//
// Both options stay in this list. Which of them a user can reach is decided by
// RESET_METHOD_AVAILABILITY, so switching phone back on is a one-line change
// there rather than a rebuild of this card.
const OPTIONS = [
  {
    id: RESET_METHODS.email,
    label: 'عبر البريد الالكتروني',
    hint: 'رابط إعادة التعيين يصل إلى بريدك',
    Icon: EnvelopeIcon,
  },
  {
    id: RESET_METHODS.phone,
    label: 'عبر الهاتف المحمول',
    hint: 'كود التحقق يصل برسالة نصية',
    Icon: PhoneIcon,
  },
]

const AVAILABLE_OPTIONS = OPTIONS.filter((option) =>
  isResetMethodAvailable(option.id),
)

// Login draws the shared field at 56px / 16px; the reset cards inherit that so
// the two screens do not disagree about how tall an input is.
const FIELD_HEIGHT = 56
const FIELD_FONT_SIZE = 16

function ResetMethodCard({
  method,
  onMethodChange,
  identifier,
  onIdentifierChange,
  error,
  submitting,
  onSubmit,
}) {
  const isEmail = method === RESET_METHODS.email

  return (
    <ResetCard
      title="هل نسيت كلمة المرور؟"
      subtitle="أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور"
    >
      {/* One option renders on its own rather than as half a row: a lone card
          stretched across the full width reads as a heading, not a choice. */}
      <div className="flex w-full flex-col gap-[12px] sm:flex-row">
        {AVAILABLE_OPTIONS.map(({ id, label, hint, Icon }) => {
          const selected = method === id

          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => onMethodChange(id)}
              className={`flex min-w-0 flex-1 cursor-pointer items-center justify-end gap-[16px] rounded-[12px] border px-[15px] py-[16px] text-right transition-colors duration-200 ${
                selected
                  ? 'border-primary-100 bg-primary-50'
                  : 'border-line bg-card hover:border-primary-100'
              }`}
            >
              <span className="flex min-w-0 flex-col gap-[4px]">
                <span className="truncate text-[16px] font-bold leading-[1.5] text-text-500">
                  {label}
                </span>
                <span className="truncate text-[14px] leading-[1.5] text-text-300">
                  {hint}
                </span>
              </span>

              <span
                className={`flex size-[36px] shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                  selected
                    ? 'bg-primary-100 text-primary-500'
                    : 'bg-accent-100 text-text-300'
                }`}
              >
                <Icon className="size-[16px]" />
              </span>
            </button>
          )
        })}
      </div>

      {/* Re-keyed so the field replays its entrance when the method changes,
          the same way the login identifier swaps. */}
      <form
        key={method}
        onSubmit={onSubmit}
        noValidate
        className="reset-card-enter flex w-full flex-col gap-[16px]"
      >
        {isEmail ? (
          <EmailField
            id="reset-email"
            label="الايميل الالكتروني"
            placeholder="ادخل الايميل الالكتروني"
            height={FIELD_HEIGHT}
            fontSize={FIELD_FONT_SIZE}
            value={identifier}
            onChange={onIdentifierChange}
            error={error}
          />
        ) : (
          <PhoneField
            id="reset-phone"
            label="رقم الهاتف"
            placeholder="234567899"
            height={FIELD_HEIGHT}
            fontSize={FIELD_FONT_SIZE}
            value={identifier}
            onChange={onIdentifierChange}
            error={error}
          />
        )}

        <Button
          type="submit"
          fullWidth
          disabled={submitting}
          className="h-[56px] text-[18px] sm:text-[20px]"
        >
          {submitting ? '...جارٍ الإرسال' : 'إرسال رابط إعادة التعيين'}
        </Button>
      </form>
    </ResetCard>
  )
}

export default ResetMethodCard
