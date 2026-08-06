import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Banknote, CreditCard, Smartphone } from 'lucide-react'
import TechnicianLayout from '../../../shared/layouts/TechnicianLayout.jsx'
import OrderBreadcrumb from '../components/OrderBreadcrumb.jsx'
import { TECHNICIAN_ROUTES } from '../constants/technicianRoutes.js'
import { PAYMENT_METHODS } from '../services/technicianService.js'

// The frame gives each method its own brand mark. Those are not shipped with
// this project, so each carries a lucide icon describing what it is instead.
const METHOD_ICONS = {
  vodafone: Smartphone,
  instapay: Banknote,
  card: CreditCard,
}

const METHOD_TINTS = {
  error: 'bg-error-50 text-error-500',
  success: 'bg-success-100 text-success-800',
  primary: 'bg-primary-50 text-primary-500',
}

/**
 * Choosing how to settle (Figma node 22:3169).
 *
 * A radio group rather than three buttons: only one method can be picked, and
 * the arrow keys should move between them the way they do in any other set of
 * options. The inputs are visually hidden and the label carries the styling, so
 * the frame's look survives without giving up that behaviour.
 */
function TechnicianPaymentMethod() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(
    PAYMENT_METHODS.find((method) => method.available).key,
  )

  const trail = [
    { label: 'المحفظه', to: TECHNICIAN_ROUTES.wallet },
    { label: 'تفاصيل الدفع', to: TECHNICIAN_ROUTES.paymentDetails },
    { label: 'اختيار وسيله دفع' },
  ]

  // The choice travels with the navigation rather than living in a store: only
  // the two screens after this one need it, and a reload then falls back to a
  // usable method instead of restoring a half-finished payment.
  const goToConfirmation = () =>
    navigate(TECHNICIAN_ROUTES.paymentConfirm, { state: { methodKey: selected } })

  return (
    <TechnicianLayout>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[48px] px-[24px] py-[24px] lg:px-[80px] lg:py-[32px]">
        <OrderBreadcrumb trail={trail} />

        <div className="mx-auto w-full max-w-[894px] rounded-[12px] border border-line bg-white p-[24px] shadow-card md:p-[40px]">
          <div className="flex flex-col gap-[4px]">
            <h1 className="text-[20px] leading-[1.5] font-bold text-text-500 md:text-[24px]">
              وسائل الدفع المتاحة
            </h1>
            <p className="text-[16px] leading-[1.5] text-text-300 md:text-[20px]">
              يرجى اختيار الطريقة التي تفضلها لإتمام المعاملة
            </p>
          </div>

          <fieldset className="mt-[40px] flex flex-col gap-[24px]">
            <legend className="sr-only">وسيلة الدفع</legend>

            {PAYMENT_METHODS.map((method) => {
              const Icon = METHOD_ICONS[method.key]
              const active = method.available && method.key === selected

              return (
                <label
                  key={method.key}
                  title={
                    method.available
                      ? undefined
                      : 'الدفع بالبطاقة غير متاح حاليًا — لم يتم تصميم شاشة تأكيد له بعد.'
                  }
                  className={`flex items-center gap-[16px] rounded-[12px] border p-[17px] transition-colors ${
                    active
                      ? 'border-primary-400 bg-primary-50'
                      : 'border-line bg-white'
                  } ${
                    method.available
                      ? 'cursor-pointer hover:border-primary-300'
                      : 'cursor-not-allowed opacity-60'
                  } has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary-500`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={method.key}
                    checked={active}
                    disabled={!method.available}
                    onChange={() => setSelected(method.key)}
                    className="sr-only"
                  />

                  {/* The mark leads, so it sits at the right edge as the frame
                      draws it, with the name beside it. */}
                  <span
                    aria-hidden="true"
                    className={`flex size-[48px] shrink-0 items-center justify-center rounded-[12px] ${METHOD_TINTS[method.tone]}`}
                  >
                    <Icon size={22} />
                  </span>

                  <span className="flex min-w-0 flex-col gap-[2px]">
                    <span className="text-[16px] leading-[1.5] font-bold text-text-500">
                      {method.name}
                    </span>
                    <span className="text-[12px] leading-[1.5] text-text-300">
                      {method.hint}
                    </span>
                  </span>
                </label>
              )
            })}
          </fieldset>

          <button
            type="button"
            onClick={goToConfirmation}
            className="mt-[40px] flex h-[68px] w-full items-center justify-center rounded-[12px] bg-primary-500 text-[20px] font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 md:text-[24px]"
          >
            التالي
          </button>
        </div>
      </div>
    </TechnicianLayout>
  )
}

export default TechnicianPaymentMethod
