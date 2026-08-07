import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, Wallet } from 'lucide-react'
import PhoneField from '../../auth/components/PhoneField.jsx'
import TechnicianLayout from '../../../shared/layouts/TechnicianLayout.jsx'
import OrderBreadcrumb from '../components/OrderBreadcrumb.jsx'
import { TECHNICIAN_ROUTES } from '../constants/technicianRoutes.js'
import {
  CURRENCY,
  PAYMENT_STEPS,
  findPaymentMethod,
  walletTotals,
} from '../services/technicianService.js'

/**
 * The last step before the money moves (Figma node 22:3249).
 *
 * The amount and the wallet number sit on the right, what happens next on the
 * left, which is how the frame splits it — so the right-hand column is written
 * first, the first child of an RTL row being the rightmost.
 *
 * The number field is the shared `PhoneField`: it already draws the dial code,
 * the flag and the divider the frame asks for, and already holds the input to
 * digits, so this screen adds only the check that one was entered.
 *
 * Nothing is charged. No endpoint takes a payment yet, so confirming moves to
 * the receipt and the receipt reports what was chosen — it does not claim a
 * transaction happened anywhere but on this device.
 */
function TechnicianPaymentConfirm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { due } = walletTotals()

  // Reached directly, or reloaded, there is no choice to read — so fall back to
  // the first method that can be used rather than rendering a blank one.
  const method = findPaymentMethod(location.state?.methodKey)

  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const trail = [
    { label: 'المحفظه', to: TECHNICIAN_ROUTES.wallet },
    { label: 'تفاصيل الدفع', to: TECHNICIAN_ROUTES.paymentDetails },
    { label: 'اختيار وسيله دفع', to: TECHNICIAN_ROUTES.paymentMethod },
    { label: 'تاكيد دفع' },
  ]

  const handleSubmit = (event) => {
    event.preventDefault()

    if (phone.length !== 11) {
      setError('أدخل رقم موبايل صحيح مكوّن من 11 رقمًا.')
      return
    }

    setError('')
    navigate(TECHNICIAN_ROUTES.paymentComplete, {
      state: { methodKey: method.key, amount: due },
    })
  }

  return (
    <TechnicianLayout>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[48px] px-[24px] py-[24px] lg:px-[80px] lg:py-[32px]">
        <OrderBreadcrumb trail={trail} />

        <div className="flex flex-col gap-[8px]">
          <h1 className="text-[24px] leading-[1.5] font-bold text-text-500 md:text-[30px]">
            إتمام الدفع
          </h1>
          <p className="text-[16px] leading-[1.5] text-text-300 md:text-[20px]">
            يرجى مراجعة التفاصيل وإكمال عملية الدفع عبر المحفظة الإلكترونية.
          </p>
        </div>

        <div className="flex flex-col gap-[24px] lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-[24px]">
            {/* The mark leads, so it sits at the right edge with the amount
                beside it, as the frame draws them. The row is left to pack at
                its start, which under `dir="rtl"` is the right edge —
                `justify-end` would push the pair to the left of the card. */}
            <section className="flex items-center gap-[16px] rounded-[12px] border border-primary-100 bg-primary-50 px-[24px] py-[40px]">
              <span
                aria-hidden="true"
                className="flex size-[64px] shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-500"
              >
                <Wallet size={28} />
              </span>

              <div className="flex flex-col gap-[4px]">
                <p className="text-[18px] leading-[1.5] text-text-400 md:text-[20px]">
                  إجمالي المبلغ المطلوب
                </p>

                <p className="flex items-baseline gap-[8px]">
                  <span className="text-[32px] leading-[1.5] font-bold text-primary-500 md:text-[42px]">
                    {due.toFixed(2)}
                  </span>
                  <span className="text-[18px] leading-[1.5] text-primary-500 md:text-[20px]">
                    {CURRENCY}
                  </span>
                </p>
              </div>
            </section>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-[24px] rounded-[12px] border border-line bg-white p-[25px]"
            >
              <h2 className="text-[18px] leading-[1.5] font-bold text-text-500 md:text-[20px]">
                وسيلة الدفع
              </h2>

              <PhoneField
                id="wallet-phone"
                label="رقم الموبايل (المحفظة)"
                value={phone}
                onChange={setPhone}
                error={error}
                placeholder="01xxxxxxxxx"
                height={56}
                fontSize={16}
              />

              <button
                type="submit"
                className="flex h-[56px] w-full items-center justify-center gap-[8px] rounded-[12px] bg-primary-500 text-[18px] font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 md:text-[20px]"
              >
                تأكيد الدفع
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
            </form>
          </div>

          {/* What the confirmation sets off, step by step. */}
          <aside className="flex w-full flex-col gap-[40px] rounded-[12px] border border-line bg-card p-[24px] lg:w-[519px] lg:shrink-0 lg:p-[41px]">
            <h2 className="text-[18px] leading-[1.5] font-bold text-text-500 md:text-[20px]">
              خطوات الدفع
            </h2>

            <ol className="flex flex-col gap-[24px]">
              {PAYMENT_STEPS.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-[12px] rounded-[12px] border border-line bg-white p-[13px]"
                >
                  {/* The number leads, so it lands at the right of its step. */}
                  <span
                    aria-hidden="true"
                    className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] bg-primary-50 text-[16px] font-bold text-primary-500"
                  >
                    {index + 1}
                  </span>

                  <span className="min-w-0 text-[16px] leading-[1.5] text-text-400">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </TechnicianLayout>
  )
}

export default TechnicianPaymentConfirm
