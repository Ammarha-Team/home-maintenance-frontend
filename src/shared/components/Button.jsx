// Button from the Figma shared library (node 4:980).
// Default = primary-500 with primary-50 label; the pressed/hover state is
// primary-700 (library "Variant2").
//
// The emergency frames added three more roles. Two needed a colour change on
// the way in: the accept action was drawn as success-500 with a white label
// (2.8:1, under the 4.5:1 minimum), and the outline call action used
// primary-500 text that sat close to its own hairline. Green now starts at
// success-800 (7.5:1) and keeps its meaning; outline text darkens a step.
const VARIANTS = {
  // The library pairs primary-500 with a primary-50 label, which measures
  // 4.02:1 — under the 4.5:1 minimum. White on the same fill reaches 4.52:1,
  // so the brand colour is kept and only the label moves.
  primary: 'bg-primary-500 text-white hover:bg-primary-700 active:bg-primary-700',
  secondary:
    'border border-primary-500 bg-transparent text-primary-500 hover:bg-primary-50',
  success:
    'bg-success-800 text-white hover:bg-success-900 active:bg-success-900',
  outline:
    'border border-primary-500 bg-white text-primary-700 hover:bg-primary-50',
  danger:
    'border border-error-500 bg-white text-error-500 hover:bg-error-50 active:bg-error-50',
}

// The library draws the control at 48px. Anything a finger has to hit on a
// phone gets at least 44px, so `sm` stops there rather than shrinking further.
const SIZES = {
  sm: 'h-[44px] px-[14px] text-[14px]',
  md: 'h-[48px] p-[15px] text-[16px]',
  lg: 'h-[52px] px-[18px] text-[16px] md:h-[56px]',
}

function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon: Icon,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`flex items-center justify-center gap-[8px] rounded-[12px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-60 ${
        disabled ? '' : 'cursor-pointer'
      } ${SIZES[size]} ${VARIANTS[variant]} ${
        fullWidth ? 'w-full' : 'w-[343px]'
      } ${className}`}
      {...props}
    >
      {Icon ? <Icon size={18} aria-hidden="true" className="shrink-0" /> : null}
      {children}
    </button>
  )
}

export default Button
