import { useId } from 'react'

// Input from the Figma shared library (node 4:745): 48px tall, card fill, 12px
// radius, leading icon at the start of the field and an optional action slot at
// the end (the library's "with eye" variant).
//
// `leadingIcon` is an imported SVG path, `action` any node rendered at the far
// end (visibility toggle, dial code, …).
// `height` defaults to the library's 48px; the sign up frames (nodes 1:498,
// 1:690) draw the same field at 56px, so those screens pass 56.
function Input({
  id,
  label,
  error,
  leadingIcon,
  leadingSlot,
  action,
  height = 48,
  fontSize = 12,
  // Gap between the label and the field. The frames use 8px on plain text
  // inputs (nodes 6:1377, 6:1586) and 10px everywhere else.
  labelGap = 10,
  className = '',
  ...props
}) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <div
      style={{ gap: labelGap }}
      className="flex w-full flex-col items-end"
    >
      {label ? (
        <label
          htmlFor={inputId}
          className="w-full text-right text-[20px] font-bold leading-[1.5] text-text-300"
        >
          {label}
        </label>
      ) : null}

      <div
        style={{ height }}
        className={`flex w-full items-center gap-[8px] rounded-[12px] border bg-card px-[12px] ${
          error ? 'border-red-500' : 'border-line'
        } ${className}`}
      >
        {leadingIcon ? (
          <img src={leadingIcon} alt="" className="size-[16px] shrink-0" />
        ) : null}
        {leadingSlot}

        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          style={{ fontSize }}
          // h-full so the tappable area matches the field the user sees: the
          // native control is ~23px inside a 48-56px wrapper, which leaves the
          // padding dead to touch.
          className="h-full w-full bg-transparent text-right leading-[1.5] text-text-500 outline-none placeholder:text-text-200"
          {...props}
        />

        {action}
      </div>

      {error ? (
        <p id={errorId} className="w-full text-right text-[12px] text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default Input
