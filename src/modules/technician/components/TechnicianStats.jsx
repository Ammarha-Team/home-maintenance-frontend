import { Link } from 'react-router-dom'
import { Star, Wallet } from 'lucide-react'
import { TECHNICIAN_ROUTES } from '../constants/technicianRoutes.js'

/**
 * The three summary tiles under the greeting (Figma node 21:2076): today's
 * earnings, the current rating, and what the platform is owed.
 *
 * The third tile is the odd one out by design — filled brand blue with its own
 * call to action — so it is written inline here rather than forced through the
 * same shape as the other two.
 */

// Shared by the first two tiles. The number and its unit sit on one baseline,
// with the caption beneath in the success tone the frame uses for both.
function StatTile({ icon, label, value, caption, unit }) {
  return (
    <article className="flex flex-col gap-[14px] rounded-[12px] border border-[#e8e8e8] bg-white p-[24px] shadow-card md:p-[33px]">
      {icon}

      <div className="flex flex-col gap-[4px] text-right">
        <p className="text-[16px] leading-[1.5] text-text-400 md:text-[20px]">
          {label}
        </p>

        <p className="flex items-end gap-[4px]">
          <span className="text-[34px] leading-[1.5] font-bold text-text-500 md:text-[42px]">
            {value}
          </span>
          {unit ? (
            <span className="pb-[8px] text-[16px] leading-[1.5] font-bold text-text-400">
              {unit}
            </span>
          ) : null}
        </p>
      </div>

      <p className="text-[12px] leading-[1.5] text-success-600">{caption}</p>
    </article>
  )
}

function TechnicianStats({ stats }) {
  const {
    earnings,
    currency,
    completedCount,
    rating,
    ratingDelta,
    platformDue,
    dueDays,
  } = stats

  return (
    <section
      aria-label="ملخص اليوم"
      className="grid gap-[16px] sm:grid-cols-2 xl:grid-cols-3"
    >
      <StatTile
        icon={
          <Wallet
            size={28}
            aria-hidden="true"
            className="shrink-0 text-text-400"
          />
        }
        label="ارباح اليوم"
        value={earnings}
        unit={currency}
        caption={`${completedCount} مهام مكتمله`}
      />

      <StatTile
        icon={
          <span className="flex gap-[4px]">
            <Star
              size={24}
              aria-hidden="true"
              className="fill-warning-500 text-warning-500"
            />
            <Star
              size={24}
              aria-hidden="true"
              className="fill-warning-500 text-warning-500"
            />
          </span>
        }
        label="التقييم الحالي"
        value={rating}
        caption={`${ratingDelta} هذا الأسبوع`}
      />

      {/* Platform dues. The button is white on brand blue, which the shared
          Button component has no variant for, so it is written here rather than
          adding a variant used by exactly one screen. */}
      <article className="relative flex flex-col gap-[8px] overflow-hidden rounded-[12px] bg-primary-500 p-[24px] shadow-raised sm:col-span-2 md:p-[32px] xl:col-span-1">
        <Wallet
          size={95}
          aria-hidden="true"
          className="pointer-events-none absolute -top-[16px] -left-[16px] text-white opacity-10"
        />

        <p className="text-[14px] leading-[1.5] font-bold text-surface opacity-80">
          المستحق للمنصه (باقي {dueDays} ايام)
        </p>

        <p className="flex items-end gap-[4px]">
          <span className="text-[34px] leading-[1.5] font-bold text-surface md:text-[42px]">
            {platformDue}
          </span>
          <span className="pb-[8px] text-[16px] leading-[1.5] font-bold text-surface">
            {currency}
          </span>
        </p>

        {/* The only way into the wallet from the dashboard, and the settlement
            flow starts there. It had no handler, so the tile stated a debt with
            no way to pay it. */}
        <Link
          to={TECHNICIAN_ROUTES.wallet}
          className="mt-[16px] block w-full rounded-[8px] bg-white py-[12px] text-center text-[16px] leading-[24px] font-bold text-primary-600 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          سداد الان
        </Link>
      </article>
    </section>
  )
}

export default TechnicianStats
