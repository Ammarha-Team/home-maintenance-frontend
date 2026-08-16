import {
  Banknote,
  CircleCheck,
  Hourglass,
  ReceiptText,
  Smile,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react'

const ICONS = {
  customers: Users,
  technicians: UserPlus,
  newOrders: CircleCheck,
  openOrders: Hourglass,
  doneOrders: CircleCheck,
  revenue: ReceiptText,
  commission: Banknote,
  satisfaction: Smile,
}

// The tile's icon badge. Success reads as a solid mark because those two tiles
// count work that is finished, which the frame sets apart from the rest.
const TONES = {
  primary: 'bg-primary-50 text-primary-500',
  success: 'bg-success-500 text-white',
  error: 'bg-error-50 text-error-500',
}

/**
 * The eight figures across the top of the dashboard.
 *
 * Under RTL the first tile in the list is drawn furthest right, which is the
 * order the frame reads them in, so the array needs no reversing here.
 *
 * The change chip is drawn only for a tile that carries one. The dashboard
 * endpoint reports the current figures and nothing about the period before
 * them, so a tile fed from the API has no movement to show and says nothing
 * rather than showing one nobody measured.
 */
function DashboardStats({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = ICONS[stat.key]
        const rising = stat.trend === 'up'
        const Arrow = rising ? TrendingUp : TrendingDown

        return (
          <article
            key={stat.key}
            className="rounded-[12px] border border-line bg-white p-[20px] shadow-card"
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex h-[40px] w-[40px] items-center justify-center rounded-[10px] ${TONES[stat.tone]}`}
              >
                <Icon size={20} aria-hidden="true" />
              </span>

              {stat.delta ? (
                <span
                  className={`flex items-center gap-[4px] rounded-[8px] px-[8px] py-[4px] text-[12px] font-bold ${
                    rising ? 'bg-success-100 text-success-800' : 'bg-error-50 text-error-500'
                  }`}
                >
                  {/* A latin figure drifts to the wrong end of an RTL line
                      unless it is marked as the LTR run it is. The arrow
                      follows it so it lands on the left of the chip, as the
                      frame draws it. */}
                  <span dir="ltr">{stat.delta}</span>
                  <Arrow size={14} aria-hidden="true" />
                </span>
              ) : null}
            </div>

            <p className="mt-[16px] text-[15px] leading-[22px] text-text-300">{stat.label}</p>

            <p className="mt-[4px] flex items-baseline gap-[6px] text-[28px] leading-[36px] font-bold text-text-500">
              {stat.value}
              {stat.unit ? (
                <span className="text-[16px] font-normal text-text-300">{stat.unit}</span>
              ) : null}
            </p>
          </article>
        )
      })}
    </div>
  )
}

export default DashboardStats
