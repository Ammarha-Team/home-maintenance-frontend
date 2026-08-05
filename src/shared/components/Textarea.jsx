import { useId } from 'react'

/**
 * Multi-line counterpart to Input. Same chrome — card fill, 12px radius, line
 * border — so a form can mix the two without a seam.
 *
 * The placeholder uses text-300 rather than Input's text-200: on the card fill
 * text-200 measures 2.7:1, under the 4.5:1 minimum, while text-300 reaches
 * 5.3:1.
 */
function Textarea({
  id,
  label,
  error,
  hint,
  rows = 4,
  className = '',
  ...props
}) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`

  const describedBy = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex w-full flex-col items-end gap-[10px]">
      {label ? (
        <label
          htmlFor={fieldId}
          className="w-full text-right text-[15px] font-bold leading-[1.5] text-text-400 md:text-[18px]"
        >
          {label}
        </label>
      ) : null}

      <textarea
        id={fieldId}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        className={`w-full resize-y rounded-[12px] border bg-card px-[14px] py-[12px] text-right text-[15px] leading-[1.6] text-text-500 outline-none transition-colors placeholder:text-text-300 focus-visible:border-primary-500 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-500 md:text-[16px] ${
          error ? 'border-error-500' : 'border-line'
        } ${className}`}
        {...props}
      />

      {hint && !error ? (
        <p id={hintId} className="w-full text-right text-[12px] text-text-300">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="w-full text-right text-[12px] font-bold text-error-500"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default Textarea
