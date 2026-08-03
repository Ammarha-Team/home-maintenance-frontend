import { useState } from 'react'
import Button from '../../../shared/components/Button.jsx'
import Checkbox from '../../../shared/components/Checkbox.jsx'

// Terms list + "I have read and agree" consent + submit, from Figma node 1:601.
// Shared by the customer terms screen and the technician joining agreement.
// `terms` is a list of clause strings; the consent box gates the submit.
function TermsConsent({
  children,
  accepted,
  onAcceptedChange,
  consentLabel,
  submitLabel,
  onSubmit,
  submitError = '',
  submitting = false,
  contentGap = 92,
  actionsGap = 24,
}) {
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!accepted) {
      setError('يجب الموافقة على الشروط والأحكام للمتابعة.')
      return
    }

    setError('')
    onSubmit()
  }

  const handleAcceptedChange = (next) => {
    onAcceptedChange(next)
    if (next) setError('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ gap: contentGap }}
      className="flex w-full flex-col"
    >
      {children}

      <div style={{ gap: actionsGap }} className="flex flex-col">
        {/* Both frames (6:1494, 6:1763) put the box at the right of the row,
            which in RTL means reversing Checkbox's label-first default. */}
        <Checkbox
          label={consentLabel}
          checked={accepted}
          onChange={handleAcceptedChange}
          size={32}
          className="flex-row-reverse"
        />

        {error || submitError ? (
          <p role="alert" className="text-right text-[16px] text-red-500">
            {error || submitError}
          </p>
        ) : null}

        <Button
          type="submit"
          fullWidth
          disabled={submitting}
          className="h-auto rounded-[16px] py-[16px] text-[20px] leading-[1.5] shadow-[0px_4px_7px_rgba(42,112,234,0.25)]"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default TermsConsent
