import { Link } from 'react-router-dom'
import { CalendarDays, CircleCheck, Percent } from 'lucide-react'
import TechnicianLayout from '../../../shared/layouts/TechnicianLayout.jsx'
import IncomeBreakdown from '../components/IncomeBreakdown.jsx'
import { TECHNICIAN_ROUTES } from '../constants/technicianRoutes.js'
import {
  CURRENCY,
  PLATFORM_COMMISSION_RATE,
  WALLET,
  WALLET_HISTORY,
  walletTotals,
} from '../services/technicianService.js'

/** One of the three figures across the top of the frame. */
function StatCard({ icon: Icon, tint, value, label }) {
  return (
    <div className="flex flex-col items-center gap-[16px] rounded-[12px] border border-line bg-white px-[16px] py-[48px]">
      <span
        aria-hidden="true"
        className={`flex size-[48px] items-center justify-center rounded-full ${tint}`}
      >
        <Icon size={20} />
      </span>

      <p className="text-[24px] leading-[1.4] font-bold text-text-500 md:text-[30px]">
        {value}
      </p>
      <p className="text-[16px] leading-[1.5] text-text-300">{label}</p>
    </div>
  )
}

/** A settled month in الملخص التاريخي. */
function HistoryCard({ entry }) {
  return (
    <li className="flex items-center justify-between gap-[16px] rounded-[12px] border border-line bg-white p-[17px]">
      {/* The month leads, which puts the icon beside it at the right edge. */}
      <div className="flex min-w-0 items-center gap-[16px]">
        <span
          aria-hidden="true"
          className="flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-primary-50 text-primary-500"
        >
          <CalendarDays size={20} />
        </span>

        <div className="flex min-w-0 flex-col gap-[8px]">
          <p className="truncate text-[18px] leading-[1.5] font-bold text-text-500 md:text-[20px]">
            {entry.month}
          </p>
          <p className="text-[16px] leading-[1.5] text-text-300">
            {`${entry.orders} طلب مكتمل`}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-start gap-[8px]">
        <p className="text-[18px] leading-[1.5] font-bold text-text-500 md:text-[20px]">
          {`${entry.amount.toLocaleString('en-US')} ${CURRENCY}`}
        </p>

        {entry.settled ? (
          <span className="rounded-[8px] bg-success-100 px-[8px] py-[5px] text-[16px] leading-[1.5] text-success-800">
            تمت التسوية
          </span>
        ) : null}
      </div>
    </li>
  )
}

/**
 * The technician's wallet (Figma node 22:2926).
 *
 * Two bands. The top one sets three figures about the work against what the
 * platform is owed for it, and that card is the only way into the settlement
 * flow. The lower one splits the money two ways: how this period's income
 * breaks down, and what earlier periods settled at.
 *
 * The frame puts the amount owed and the income breakdown on the right, the
 * stats and the history on the left, so in each row the right-hand block is
 * written first — the first child of an RTL row is the rightmost.
 */
function TechnicianWallet() {
  const { due } = walletTotals()
  const percent = Math.round(PLATFORM_COMMISSION_RATE * 100)

  return (
    <TechnicianLayout>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[48px] px-[24px] py-[32px] lg:px-[80px] lg:py-[48px]">
        <h1 className="text-[28px] leading-[1.5] font-bold text-text-500 md:text-[36px]">
          إحصائيات المحفظة
        </h1>

        <div className="flex flex-col gap-[24px] lg:flex-row lg:items-stretch">
          {/* What is owed, and the way to pay it. */}
          <section className="relative w-full overflow-hidden rounded-[12px] border border-primary-100 bg-primary-50 p-[24px] lg:w-[499px] lg:shrink-0">
            {/* The frame's decorative disc, bleeding off the top-right corner
                behind the label. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[40px] -right-[40px] size-[160px] rounded-full bg-primary-100/25"
            />

            <div className="relative flex h-full flex-col justify-between gap-[24px]">
              <div className="flex flex-col gap-[12px]">
                <p className="text-[16px] leading-[1.5] text-text-400">
                  {`المستحق للمنصه (باقي ${WALLET.dueDays} ايام)`}
                </p>

                {/* The figure reads before its unit, so the number is written
                    first and lands to the right of it. */}
                <p className="flex items-baseline gap-[8px]">
                  <span className="text-[30px] leading-[1.4] font-bold text-primary-500 md:text-[36px]">
                    {due.toFixed(2)}
                  </span>
                  <span className="text-[18px] leading-[1.5] text-primary-500 md:text-[20px]">
                    {CURRENCY}
                  </span>
                </p>
              </div>

              <Link
                to={TECHNICIAN_ROUTES.paymentDetails}
                className="flex h-[48px] w-full items-center justify-center rounded-[12px] bg-primary-500 text-[18px] font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 md:text-[20px]"
              >
                سداد الان
              </Link>
            </div>
          </section>

          {/* Read right to left in the frame: the commission rate, the week's
              earnings, then the count of finished jobs. */}
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-[12px] sm:grid-cols-3">
            <StatCard
              icon={Percent}
              tint="bg-error-50 text-error-500"
              value={`${percent}%`}
              label="عمولة المنصة"
            />
            <StatCard
              icon={CalendarDays}
              tint="bg-primary-50 text-primary-500"
              value={`${WALLET.weekEarnings.toLocaleString('en-US')} ${CURRENCY}`}
              label="هذا الأسبوع"
            />
            <StatCard
              icon={CircleCheck}
              tint="bg-success-100 text-success-800"
              value={WALLET.completedCount}
              label="طلب مكتمل"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[24px] lg:flex-row lg:items-start">
          <section className="flex min-w-0 flex-1 flex-col gap-[24px]">
            <h2 className="text-[20px] leading-[1.5] font-bold text-text-500">
              تفاصيل الدخل الكلي
            </h2>

            <IncomeBreakdown />
          </section>

          <section className="flex w-full flex-col gap-[24px] lg:w-[499px] lg:shrink-0">
            {/* Heading right, the way into the full list left. */}
            <div className="flex items-center justify-between gap-[16px]">
              <h2 className="text-[20px] leading-[1.5] font-bold text-text-500">
                الملخص التاريخي
              </h2>

              {/* Nothing lists every settlement yet, so this says so rather than
                  routing to a path that would fall through to the catch-all and
                  drop the technician out of the portal. */}
              <button
                type="button"
                disabled
                title="سجل التسويات الكامل غير متاح حاليًا — لم يتم بناء الشاشة بعد."
                className="cursor-not-allowed text-[16px] leading-[1.5] text-primary-500 underline underline-offset-4 opacity-60"
              >
                عرض الكل
              </button>
            </div>

            <ul className="flex flex-col gap-[16px]">
              {WALLET_HISTORY.map((entry) => (
                <HistoryCard key={entry.id} entry={entry} />
              ))}
            </ul>
          </section>
        </div>
      </div>
    </TechnicianLayout>
  )
}

export default TechnicianWallet
