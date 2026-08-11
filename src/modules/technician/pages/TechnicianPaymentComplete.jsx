import { Link, useLocation } from 'react-router-dom'
import {
  Banknote,
  CalendarDays,
  ChevronLeft,
  Clock,
  CreditCard,
} from 'lucide-react'
import SuccessSeal from '../../../shared/components/SuccessSeal.jsx'
import TechnicianLayout from '../../../shared/layouts/TechnicianLayout.jsx'
import { TECHNICIAN_ROUTES } from '../constants/technicianRoutes.js'
import {
  CURRENCY,
  PAYMENT_RECEIPT,
  findPaymentMethod,
  walletTotals,
} from '../services/technicianService.js'

/** One line of the receipt: label and icon at the right, value at the left. */
function ReceiptRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center justify-between gap-[16px]">
      {/* The icon leads, so it sits at the right edge beside its label. */}
      <dt className="flex items-center gap-[8px] text-[16px] leading-[1.5] text-text-300 md:text-[20px]">
        <Icon size={17} aria-hidden="true" className="shrink-0" />
        {label}
      </dt>

      <dd className="text-[16px] leading-[1.5] text-text-500 md:text-[20px]">
        {children}
      </dd>
    </div>
  )
}

/**
 * The receipt (Figma node 22:3345).
 *
 * The amount and the method are whatever the previous screen confirmed, so they
 * arrive with the navigation; the reference, date and time come from the
 * stand-in data. A reload loses that state, which is why both fall back — a
 * receipt showing nothing would be worse than one showing the amount owed.
 *
 * The frame heads this screen "تم انهاء الخدمه بنجاح" — the same words as the
 * job completion screen, which is where they belong. Nothing here ends a
 * service: the technician has just settled the platform's commission, and the
 * card below is a payment receipt. The heading says that instead, because a
 * technician reading that a service ended would go looking for a job that was
 * never touched.
 */
function TechnicianPaymentComplete() {
  const location = useLocation()
  const { due } = walletTotals()

  const method = findPaymentMethod(location.state?.methodKey)
  const amount = location.state?.amount ?? due

  return (
    <TechnicianLayout>
      <div className="mx-auto flex w-full max-w-[795px] flex-col gap-[16px] px-[24px] py-[32px] lg:px-0 lg:py-[48px]">
        <section className="flex flex-col items-center gap-[8px] rounded-[12px] border border-line bg-white px-[24px] py-[25px] text-center">
          <SuccessSeal className="size-[120px] md:size-[144px]" />

          <h1 className="text-[20px] leading-[1.5] font-bold text-success-500 md:text-[24px]">
            تم الدفع بنجاح
          </h1>
          <p className="text-[18px] leading-[1.5] text-text-300 md:text-[24px]">
            تم سداد المستحق للمنصة، وسيظهر في سجل التسويات
          </p>
        </section>

        <section className="flex flex-col gap-[24px] rounded-[12px] border border-line bg-white p-[25px]">
          <div className="flex items-center justify-between gap-[16px] border-b border-line pb-[24px]">
            <p className="text-[16px] leading-[1.5] text-text-300 md:text-[20px]">
              رقم المعاملة
            </p>
            {/* The reference is a latin string. Left to the paragraph's own
                direction its leading # is treated as neutral and drifts to the
                far end, printing TRX-992834# — so it is marked LTR. */}
            <p
              dir="ltr"
              className="text-[16px] leading-[1.5] font-bold text-text-500 md:text-[20px]"
            >
              {PAYMENT_RECEIPT.reference}
            </p>
          </div>

          <dl className="flex flex-col gap-[24px]">
            <ReceiptRow icon={Banknote} label="المبلغ الإجمالي">
              <span className="text-[18px] font-bold text-primary-500 md:text-[24px]">
                {`${amount.toFixed(2)} ${CURRENCY}`}
              </span>
            </ReceiptRow>

            <ReceiptRow icon={CalendarDays} label="التاريخ">
              {PAYMENT_RECEIPT.date}
            </ReceiptRow>

            <ReceiptRow icon={Clock} label="الوقت">
              {PAYMENT_RECEIPT.time}
            </ReceiptRow>

            <ReceiptRow icon={CreditCard} label="وسيلة الدفع">
              {method.name}
            </ReceiptRow>
          </dl>
        </section>

        <Link
          to={TECHNICIAN_ROUTES.dashboard}
          className="mt-[24px] flex h-[56px] w-full items-center justify-center gap-[8px] rounded-[12px] bg-primary-500 text-[16px] font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 md:text-[18px]"
        >
          العوده للرئيسيه
          <ChevronLeft size={18} aria-hidden="true" />
        </Link>
      </div>
    </TechnicianLayout>
  )
}

export default TechnicianPaymentComplete
