import { useState } from 'react'
import squareLock from '../../../assets/icons/square-lock-01.svg'
import Input from '../../../shared/components/Input.jsx'
import EyeIcon from '../../../shared/components/icons/EyeIcon.jsx'
import EyeSlashIcon from '../../../shared/components/icons/EyeSlashIcon.jsx'

// Password field: shared library Input in its "with eye" variant (node 4:746) —
// square-lock-01 leading, visibility toggle trailing. Real
// <input type="password"> so password managers and autofill keep working.
//
// Toggle icons are Font Awesome regular: eye while the password is hidden,
// eye-slash while it is visible.
function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  height,
  fontSize,
}) {
  const [visible, setVisible] = useState(false)
  const ToggleIcon = visible ? EyeSlashIcon : EyeIcon

  const toggle = (
    <button
      type="button"
      onClick={() => setVisible((current) => !current)}
      aria-label={visible ? 'إخفاء كلمة السر' : 'إظهار كلمة السر'}
      aria-pressed={visible}
      className="shrink-0 cursor-pointer text-text-200 transition-colors hover:text-text-300"
    >
      <ToggleIcon className="h-[16px] w-[16px]" />
    </button>
  )

  return (
    <Input
      id={id}
      label={label}
      error={error}
      leadingIcon={squareLock}
      action={toggle}
      height={height}
      fontSize={fontSize}
      type={visible ? 'text' : 'password'}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
    />
  )
}

export default PasswordField
