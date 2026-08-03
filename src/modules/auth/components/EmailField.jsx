import Input from '../../../shared/components/Input.jsx'
import EnvelopeIcon from '../../../shared/components/icons/EnvelopeIcon.jsx'

// Email field: the shared Input with the envelope mark leading (Figma nodes
// 6:1280 login / 6:1345 sign up). Mirrors PhoneField's props so the login form
// can swap between the two without special-casing either.
function EmailField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  height,
  fontSize,
  labelGap,
  autoComplete = 'email',
}) {
  return (
    <Input
      id={id}
      label={label}
      error={error}
      leadingSlot={
        <EnvelopeIcon className="size-[16px] shrink-0 text-text-200" />
      }
      height={height}
      fontSize={fontSize}
      labelGap={labelGap}
      type="email"
      inputMode="email"
      autoComplete={autoComplete}
      dir="ltr"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  )
}

export default EmailField
