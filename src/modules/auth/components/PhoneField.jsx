import flagEgypt from '../../../assets/auth/icon-flag-eg.svg'
import Input from '../../../shared/components/Input.jsx'

// Phone field: the shared library Input (node 4:745) with the Egyptian dial
// code and flag from the login frame (node 1:413) in the leading slot.
const DialCode = ({ fontSize }) => (
  <span className="flex shrink-0 items-center gap-[6px]">
    <img src={flagEgypt} alt="" className="size-[16px]" />
    <span style={{ fontSize }} className="leading-[1.5] text-text-300">
      +20
    </span>
    <span aria-hidden="true" className="mx-[2px] h-[21px] w-px bg-line" />
  </span>
)

function PhoneField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  height,
  fontSize = 12,
}) {
  // Digits only: keeps the value clean for the API and blocks stray characters
  // without fighting the user's cursor.
  const handleChange = (event) => {
    onChange(event.target.value.replace(/\D/g, '').slice(0, 11))
  }

  return (
    <Input
      id={id}
      label={label}
      error={error}
      leadingSlot={<DialCode fontSize={fontSize} />}
      height={height}
      fontSize={fontSize}
      type="tel"
      inputMode="numeric"
      autoComplete="tel-national"
      dir="ltr"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
    />
  )
}

export default PhoneField
