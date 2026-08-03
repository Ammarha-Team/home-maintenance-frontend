import { useId } from 'react'

// Plain native checkbox tinted with the platform accent colour — no image
// assets, so it stays crisp at any size and keeps focus, keyboard and form
// semantics for free. Blue (primary-500) matches the rest of the UI.
// `size` is the box edge in px: 16 for remember-me, 32 on the terms screens.
function Checkbox({ id, label, checked, onChange, size = 16, className = '' }) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={`flex items-center gap-[5px] ${className}`}>
      <label
        htmlFor={inputId}
        className="cursor-pointer text-[20px] leading-[1.5] text-text-secondary"
      >
        {label}
      </label>

      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        style={{ width: size, height: size }}
        className="shrink-0 cursor-pointer accent-primary-500"
      />
    </div>
  )
}

export default Checkbox
