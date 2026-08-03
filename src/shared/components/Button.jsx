// Button from the Figma shared library (node 4:980).
// Default = primary-500 with primary-50 label; the pressed/hover state is
// primary-700 (library "Variant2").
const VARIANTS = {
  primary:
    'bg-primary-500 text-primary-50 hover:bg-primary-700 active:bg-primary-700',
  secondary:
    'border border-primary-500 bg-transparent text-primary-500 hover:bg-primary-50',
}

function Button({
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`flex h-[48px] items-center justify-center rounded-[12px] p-[15px] text-[16px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        disabled ? '' : 'cursor-pointer'
      } ${VARIANTS[variant]} ${fullWidth ? 'w-full' : 'w-[343px]'} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
