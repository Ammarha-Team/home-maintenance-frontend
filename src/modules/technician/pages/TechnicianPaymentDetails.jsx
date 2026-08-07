import { Link } from 'react-router-dom'
import { Clock, CreditCard, Info } from 'lucide-react'
import TechnicianLayout from '../../../shared/layouts/TechnicianLayout.jsx'
import IncomeBreakdown from '../components/IncomeBreakdown.jsx'
import { TECHNICIAN_ROUTES } from '../constants/technicianRoutes.js'
import { CURRENCY, WALLET, walletTotals } from '../services/technicianService.js'

/**
 * What is owed, and how long is left to pay it (Figma node 22:3064).
 *
 * The screen states the amount, counts down to the deadline, then shows the
 * income it was worked out from. That breakdown is the same card the wallet
 * draws, so the two can never disagree about the figures.
 *
 * The countdown does not run. Its values come from the frame; a ticking clock
 * needs a deadline from the API, and one invented here would count down to a
 * moment that means nothing.
 */
function TechnicianPaymentDetails() {
  const { due } = walletTotals()

  return (
    <TechnicianLayout>
      <div className="mx-auto flex w-full max-w-[1110px] flex-col gap-[32px] px-[24px] py-[32px] lg:px-0 lg:py-[48px]">
        <h1 className="text-[24px] leading-[1.5] font-bold text-text-500 md:text-[30px]">
          تفاصيل الدفع
        </h1>

        {/* The amount, set apart from everything that explains it. */}
        <section className="relative flex flex-col items-center gap-[16px] overflow-hidden rounded-[12px] bg-primary-50 px-[24px] py-[24px]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-[128px] -right-[128px] size-[256px] rounded-full bg-primary-100/25"
          />

          <div className="relative flex flex-col items-center gap-[8px]">
            <p className="text-[16px] leading-[1.5] text-text-400">
              إجمالي المبلغ المستحق
            </p>

            {/* The figure reads before its unit, so the number is written first
                and lands to the right of it. */}
            <p className="flex items-baseline gap-[8px]">
              <span className="text-[32px] leading-[1.5] font-bold text-primary-500 md:text-[42px]">
                {due.toFixed(2)}
              </span>
              <span className="text-[18px] leading-[1.5] text-primary-500 md:text-[20px]">
                {CURRENCY}
              </span>
            </p>
          </div>

          <p className="relative w-full max-w-[514px] rounded-[12px] bg-primary-100 px-[16px] py-[12px] text-center text-[18px] leading-[1.5] font-bold text-primary-700 md:text-[20px]">
            {WALLET.period}
          </p>
        </section>

        <section className="flex flex-col items-center gap-[24px] rounded-[12px] border border-line bg-white px-[24px] py-[25px]">
          {/* The clock leads, so it sits to the right of the heading. */}
          <h2 className="flex items-center gap-[8px] text-[18px] leading-[1.5] font-bold text-text-500 md:text-[20px]">
            <Clock size={20} aria-hidden="true" className="text-error-500" />
            الوقت المتبقي للدفع
          </h2>

          {/* Days first, which puts them at the right end as the frame has them,
              and minutes at the left. */}
          <ul className="flex items-center gap-[12px]">
            {WALLET.countdown.map((unit) => (
              <li
                key={unit.key}
                className="flex h-[87px] w-[100px] flex-col items-center justify-center gap-[4px] rounded-[12px] border border-line bg-card md:w-[120px]"
              >
                <span
                  className={`text-[24px] leading-[1.4] font-bold md:text-[28px] ${
                    unit.key === 'minutes' ? 'text-error-500' : 'text-text-500'
                  }`}
                >
                  {unit.value}
                </span>
                <span className="text-[12px] leading-[1.4] text-text-300">
                  {unit.label}
                </span>
              </li>
            ))}
          </ul>

          <p className="rounded-[8px] bg-error-50 px-[16px] py-[4px] text-center text-[16px] leading-[1.5] text-error-500">
            يجب السداد لتجنب تعليق الحساب مؤقتاً
          </p>
        </section>

        <section className="flex flex-col gap-[24px]">
          <h2 className="text-[20px] leading-[1.5] font-bold text-text-500">
            تفاصيل الدخل الكلي
          </h2>

          <IncomeBreakdown />
        </section>

        {/* The icon leads, so it lands at the right edge of the note. */}
        <p className="flex items-start gap-[12px] rounded-[12px] border border-primary-100 bg-primary-50 px-[24px] py-[24px] text-[16px] leading-[1.6] text-primary-700 md:text-[18px]">
          <Info size={20} aria-hidden="true" className="mt-[4px] shrink-0" />
          يتم احتساب العمولة أسبوعياً بناءً على الطلبات المكتملة فقط. يمكنك الدفع
          عبر بطاقة مدى، فيزا، أو آبل باي.
        </p>

        <Link
          to={TECHNICIAN_ROUTES.paymentMethod}
          className="flex h-[56px] w-full items-center justify-center gap-[12px] rounded-[12px] bg-primary-500 text-[20px] font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 md:text-[24px]"
        >
          ادفع الآن
          <CreditCard size={22} aria-hidden="true" />
        </Link>
      </div>
    </TechnicianLayout>
  )
}

export default TechnicianPaymentDetails
