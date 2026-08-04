// Small status chip. Every tone pairs a tinted fill with the darkest step of
// its own ramp so the label clears 4.5:1 — the library's mid-ramp fills with
// white text sat at roughly 2.8:1.
const TONES = {
  neutral: 'bg-card text-text-400 border-line',
  primary: 'bg-primary-50 text-primary-700 border-primary-100',
  success: 'bg-success-100 text-success-800 border-success-200',
  warning: 'bg-[#fff4e5] text-[#8a5200] border-[#ffd9a8]',
  danger: 'bg-error-50 text-error-500 border-error-100',
}

function Badge({ tone = 'neutral', icon: Icon, children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-[6px] rounded-full border px-[10px] py-[5px] text-[12px] leading-[1.4] font-bold whitespace-nowrap ${TONES[tone]} ${className}`}
    >
      {Icon ? <Icon size={13} aria-hidden="true" className="shrink-0" /> : null}
      {children}
    </span>
  )
}

export default Badge
