// Two-up segmented control from the Figma shared library (node 4:957) — used for
// the sign up role switch and the login method switch.
//
// The selected background is a single element that slides between the halves
// rather than a class that jumps from one button to the other. `options` is a
// list of { id, label, Icon }; the control sits in an RTL layout, so the first
// option renders on the right.
function SegmentedControl({
  options,
  value,
  onChange,
  ariaLabel,
  className = '',
}) {
  const selectedIndex = options.findIndex((option) => option.id === value)
  const segmentWidth = 100 / options.length

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`relative flex w-full items-stretch justify-center rounded-[12px] bg-primary-50 p-[4px] ${className}`}
    >
      <span
        aria-hidden="true"
        style={{
          width: `calc(${segmentWidth}% - 4px)`,
          transform: `translateX(${selectedIndex * -100}%)`,
        }}
        className="absolute inset-y-[4px] right-[4px] rounded-[16px] bg-primary-400 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-out motion-reduce:transition-none"
      />

      {options.map((option) => {
        const selected = option.id === value
        const { Icon } = option

        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.id)}
            className={`relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-[8px] rounded-[16px] py-[12px] text-[16px] leading-[1.5] transition-colors duration-300 ${
              selected ? 'font-bold text-surface' : 'text-text-200'
            }`}
          >
            {option.label}
            <Icon className="size-[16px] shrink-0" />
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
