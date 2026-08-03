import { useId } from 'react'

// Dropdown field matching Input's chrome (Figma node 1:719). Uses a native
// <select> so the caret, keyboard handling and mobile picker come from the
// platform rather than a custom widget.
function Select({
  id,
  label,
  error,
  leadingIcon,
  placeholder,
  options,
  height = 56,
  fontSize = 16,
  className = '',
  ...props
}) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const errorId = `${selectId}-error`

  return (
    <div className="flex w-full flex-col items-end gap-[10px]">
      {label ? (
        <label
          htmlFor={selectId}
          className="w-full text-right text-[20px] font-bold leading-[1.5] text-text-300"
        >
          {label}
        </label>
      ) : null}

      <div
        style={{ height }}
        className={`flex w-full items-center gap-[8px] rounded-[12px] border bg-card px-[12px] py-[15px] ${
          error ? 'border-red-500' : 'border-line'
        } ${className}`}
      >
        {leadingIcon ? (
          <img src={leadingIcon} alt="" className="size-[16px] shrink-0" />
        ) : null}

        <select
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          style={{ fontSize }}
          className="w-full cursor-pointer bg-transparent text-right leading-[1.5] text-text-500 outline-none"
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p id={errorId} className="w-full text-right text-[12px] text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default Select
