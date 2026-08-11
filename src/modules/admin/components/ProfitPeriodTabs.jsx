/**
 * The stretch of time the tiles below are counted over.
 *
 * These are tabs rather than a dropdown because the frame draws all five at
 * once, so `tablist` is the role that describes them; the panel of tiles they
 * control names the selected tab in turn.
 */
function ProfitPeriodTabs({ periods, value, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="الفترة الزمنية"
      className="flex flex-wrap items-center gap-[4px] rounded-[10px] border border-line bg-white p-[6px] shadow-card"
    >
      {periods.map((period) => {
        const selected = period.key === value

        return (
          <button
            key={period.key}
            type="button"
            role="tab"
            id={`profit-period-${period.key}`}
            aria-selected={selected}
            onClick={() => onChange(period.key)}
            className={`h-[38px] rounded-[8px] px-[16px] text-[14px] transition-colors ${
              selected
                ? 'bg-primary-500 font-bold text-white'
                : 'text-text-400 hover:bg-primary-50 hover:text-primary-500'
            }`}
          >
            {period.label}
          </button>
        )
      })}
    </div>
  )
}

export default ProfitPeriodTabs
