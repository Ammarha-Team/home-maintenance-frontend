import {
  CURRENCY,
  PLATFORM_COMMISSION_RATE,
  walletTotals,
} from '../services/technicianService.js'

// Grouped to the thousand, as the frame writes these: 2,882.00 rather than
// 2882.00. The figures here run to four digits, which is hard to read unbroken.
const money = (amount) =>
  `${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${CURRENCY}`

/**
 * تفاصيل الدخل الكلي — what the orders billed, what the platform takes, and
 * what is left (Figma nodes 22:3009 and 22:3137).
 *
 * The wallet and the payment details screen draw this same card, so it is one
 * component rather than two copies free to drift apart. The frames differ only
 * in the width it is given, which the caller controls.
 *
 * Each row is a label at the right and a figure at the left, which under
 * `dir="rtl"` is what `justify-between` gives when the label is written first.
 */
function IncomeBreakdown({ className = '' }) {
  const { billed, commission, net } = walletTotals()
  const percent = Math.round(PLATFORM_COMMISSION_RATE * 100)

  return (
    <div
      className={`overflow-hidden rounded-[12px] border border-line bg-white shadow-card ${className}`}
    >
      <dl>
        <div className="flex items-center justify-between gap-[16px] border-b border-line px-[24px] py-[24px]">
          <dt className="text-[16px] leading-[1.5] text-text-300 md:text-[20px]">
            إجمالي الطلبات المنفذة
          </dt>
          <dd className="text-[18px] leading-[1.5] font-bold text-text-500 md:text-[24px]">
            {money(billed)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-[16px] border-b border-line px-[24px] py-[24px]">
          <dt className="text-[16px] leading-[1.5] font-bold text-error-500 md:text-[20px]">
            {`خصم عمولة المنصة (${percent}%)`}
          </dt>
          <dd className="text-[18px] leading-[1.5] font-bold text-error-500 md:text-[24px]">
            {`- ${money(commission)}`}
          </dd>
        </div>

        {/* The closing row carries the tint in the frame, which is what makes it
            read as the total rather than a third line item. */}
        <div className="flex items-center justify-between gap-[16px] bg-primary-50 px-[24px] py-[28px]">
          <dt className="text-[16px] leading-[1.5] font-bold text-primary-500 md:text-[20px]">
            الصافي الحالي
          </dt>
          <dd className="text-[18px] leading-[1.5] font-bold text-primary-500 md:text-[24px]">
            {money(net)}
          </dd>
        </div>
      </dl>
    </div>
  )
}

export default IncomeBreakdown
