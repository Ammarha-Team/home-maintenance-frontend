import { Minus, TrendingDown, TrendingUp } from 'lucide-react'

// A figure that has not moved is neither good news nor bad, so it is drawn flat
// and grey rather than being forced into one of the two coloured directions.
const TRENDS = {
  up: { chip: 'bg-success-100 text-success-800', Arrow: TrendingUp },
  down: { chip: 'bg-error-50 text-error-500', Arrow: TrendingDown },
  flat: { chip: 'bg-card text-text-300', Arrow: Minus },
}

/**
 * The five tiles under the period tabs.
 *
 * They are the panel those tabs control, which is why the group points back at
 * the selected one: changing the period changes every figure here at once.
 */
function ProfitMetrics({ metrics, period }) {
  return (
    <div
      role="tabpanel"
      aria-labelledby={`profit-period-${period}`}
      className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    >
      {metrics.map((metric) => {
        const trend = TRENDS[metric.trend] ?? TRENDS.flat
        const { Arrow } = trend

        return (
          <article
            key={metric.key}
            className="rounded-[12px] border border-line bg-white p-[20px] shadow-card"
          >
            {/* The chip stands alone on its row against the far left, which
                under RTL means nothing precedes it in the markup. */}
            <span
              className={`inline-flex items-center gap-[4px] rounded-[8px] px-[8px] py-[4px] text-[12px] font-bold ${trend.chip}`}
            >
              <Arrow size={12} aria-hidden="true" />
              <span dir="ltr">{metric.delta}</span>
            </span>

            <p className="mt-[16px] text-end text-[14px] leading-[22px] text-text-400">
              {metric.label}
            </p>

            <p className="mt-[4px] flex items-baseline justify-end gap-[6px] text-[24px] leading-[34px] font-bold text-text-500">
              <span className="text-[14px] font-normal text-text-300">ج.م</span>
              {metric.value}
            </p>
          </article>
        )
      })}
    </div>
  )
}

export default ProfitMetrics
