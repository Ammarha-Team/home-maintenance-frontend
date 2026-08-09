import { Banknote, ChartPie, CreditCard, TrendingDown, TrendingUp } from 'lucide-react'

const ICONS = {
  monthlyRevenue: CreditCard,
  weeklyRevenue: Banknote,
  netProfit: ChartPie,
}

/**
 * The three figures across the top of the profits screen.
 *
 * These read the platform as a whole and deliberately do not answer the period
 * tabs further down — each one names its own period in the line beneath it.
 */
function ProfitSummary({ items }) {
  return (
    <div className="grid grid-cols-1 gap-[16px] md:grid-cols-3">
      {items.map((item) => {
        const Icon = ICONS[item.key]
        const rising = item.trend === 'up'
        const Arrow = rising ? TrendingUp : TrendingDown

        return (
          <article
            key={item.key}
            className="rounded-[12px] border border-line bg-white p-[24px] shadow-card"
          >
            {/* The label reads from the right and the badge sits at the far
                left, which under RTL is the order they are written in. */}
            <div className="flex items-center justify-between gap-[12px]">
              <h2 className="text-[16px] leading-[24px] font-bold text-text-400">{item.label}</h2>

              <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                <Icon size={18} aria-hidden="true" />
              </span>
            </div>

            <p className="mt-[12px] flex items-baseline justify-end gap-[6px] text-[32px] leading-[44px] font-bold text-text-500">
              <span className="text-[18px] font-normal text-text-400">{item.unit}</span>
              {item.value}
            </p>

            {/* The change and the period it is measured against are one
                sentence, so they share a colour and a direction. */}
            <p
              className={`mt-[8px] flex items-center justify-end gap-[6px] text-[13px] ${
                rising ? 'text-success-600' : 'text-error-500'
              }`}
            >
              {item.caption}
              <span dir="ltr">{item.delta}</span>
              <Arrow size={14} aria-hidden="true" />
            </p>
          </article>
        )
      })}
    </div>
  )
}

export default ProfitSummary
