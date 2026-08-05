/**
 * The scalloped success mark both confirmation screens open with. Drawn rather
 * than exported so it scales with the heading instead of shipping a fixed
 * 167px asset — the frames used one size for a 1440px canvas.
 *
 * Decorative: the heading beside it already states the outcome, so it is
 * hidden from assistive technology.
 */
function SuccessSeal({ className = '' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={`size-16 md:size-20 ${className}`}
    >
      {/* 12-point scallop, built by rotating one rounded lobe around the
          centre — cheaper than a hand-traced path and stays crisp at any size. */}
      <g className="fill-success-200">
        {Array.from({ length: 12 }, (_, index) => (
          <rect
            key={index}
            x="24"
            y="4"
            width="16"
            height="56"
            rx="8"
            transform={`rotate(${index * 15} 32 32)`}
          />
        ))}
      </g>

      <path
        d="M21.5 32.8l7 7 14-14.5"
        fill="none"
        className="stroke-success-800"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SuccessSeal
