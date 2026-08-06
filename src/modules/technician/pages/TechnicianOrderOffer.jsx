import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Lightbulb, Send } from 'lucide-react'
import Button from '../../../shared/components/Button.jsx'
import Textarea from '../../../shared/components/Textarea.jsx'
import TechnicianLayout from '../../../shared/layouts/TechnicianLayout.jsx'
import OrderBreadcrumb from '../components/OrderBreadcrumb.jsx'
import {
  TECHNICIAN_ROUTES,
  technicianOrderPath,
} from '../constants/technicianRoutes.js'
import {
  CURRENCY,
  PLATFORM_COMMISSION_RATE,
  findOrder,
} from '../services/technicianService.js'

// Money is written to two places throughout the frame.
const money = (amount) => `${amount.toFixed(2)} ${CURRENCY}`

/**
 * Technician Order Offer (Figma node 21:2617).
 *
 * The last step of the technician flow: a price, when the work starts, and a
 * note to the customer. The frame is filed under "Order details" as well, but
 * nothing on it details an order — it composes the bid — so the route and the
 * component are named for what the screen does.
 *
 * The commission panel is the reason the price field exists: a technician types
 * what the customer pays and needs to see, before sending, what actually
 * reaches them. It recalculates on every keystroke rather than on blur, because
 * a figure that lags behind the field it describes is worse than no figure.
 */
function TechnicianOrderOffer() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const order = findOrder(orderId)

  const [price, setPrice] = useState('100')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('09:00')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const trail = [
    { label: 'الرئيسيه', to: TECHNICIAN_ROUTES.dashboard },
    { label: 'الطلبات', to: TECHNICIAN_ROUTES.orders },
    { label: 'تقديم العرض' },
  ]

  if (!order) {
    return (
      <TechnicianLayout>
        <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-[16px] px-[24px] py-[64px] text-center">
          <h1 className="text-[24px] leading-[1.5] font-bold text-text-500">
            هذا الطلب غير موجود
          </h1>
          <p className="text-[16px] leading-[1.6] text-text-300">
            ربما تم سحبه أو قبوله من فني آخر.
          </p>
          <Link
            to={TECHNICIAN_ROUTES.orders}
            className="flex h-[52px] w-full max-w-[320px] items-center justify-center rounded-[12px] bg-primary-500 text-[16px] font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            العودة إلى الطلبات
          </Link>
        </div>
      </TechnicianLayout>
    )
  }

  // A blank or half-typed field reads as zero rather than NaN, so the panel
  // shows 0.00 while someone is still typing instead of flashing an error at
  // them mid-keystroke.
  const total = Number.parseFloat(price) || 0
  const commission = total * PLATFORM_COMMISSION_RATE
  const earnings = total - commission

  const handleSubmit = (event) => {
    event.preventDefault()

    if (total <= 0) {
      setError('أدخل سعرًا أكبر من صفر.')
      return
    }

    if (!date) {
      setError('اختر تاريخ البدء.')
      return
    }

    setError('')
    setSent(true)
  }

  // Nothing receives this yet, so the screen is honest about what just
  // happened: the offer is held on this device only, and the technician is told
  // so rather than shown a success that reached nobody.
  if (sent) {
    return (
      <TechnicianLayout>
        <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-[16px] px-[24px] py-[64px] text-center">
          <h1 className="text-[24px] leading-[1.5] font-bold text-text-500">
            تم تجهيز عرضك
          </h1>
          <p className="text-[16px] leading-[1.6] text-text-300">
            {`سعر ${money(total)} لطلب ${order.reference}. لم يصل العرض إلى العميل بعد — لا يوفر الخادم خدمة لاستقبال العروض حتى الآن.`}
          </p>
          <div className="w-full max-w-[320px]">
            <Button fullWidth onClick={() => navigate(TECHNICIAN_ROUTES.orders)}>
              العودة إلى الطلبات
            </Button>
          </div>
        </div>
      </TechnicianLayout>
    )
  }

  return (
    <TechnicianLayout>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[24px] px-[24px] py-[24px] lg:px-[80px] lg:py-[32px]">
        <OrderBreadcrumb trail={trail} />

        {/* Summary card on the left (x=0), form on the right (x=448) — so the
            form is written first, the first child being the rightmost in an
            RTL row. */}
        <div className="flex flex-col gap-[24px] lg:flex-row lg:items-start lg:gap-[41px]">
          <form
            onSubmit={handleSubmit}
            className="flex min-w-0 flex-1 flex-col gap-[40px]"
          >
            <section className="flex flex-col gap-[24px]">
              <h1 className="text-right text-[20px] leading-[1.5] font-bold text-text-400 md:text-[24px]">
                تفاصيل العرض المالي
              </h1>

              {/* Price field right (x=428), the breakdown left (x=0). */}
              <div className="flex flex-col gap-[24px] md:flex-row md:items-stretch">
                <div className="flex flex-1 flex-col gap-[12px] rounded-[12px] border border-line bg-white px-[25px] pt-[25px] pb-[50px] shadow-card">
                  <label
                    htmlFor="offer-price"
                    className="w-full text-right text-[14px] leading-[1.5] font-bold text-text-400"
                  >
                    سعرك المقترح
                  </label>

                  <div className="flex h-[56px] items-center gap-[8px] rounded-[8px] border border-line bg-card px-[25px]">
                    <input
                      id="offer-price"
                      type="number"
                      min="0"
                      step="1"
                      inputMode="decimal"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                      aria-describedby="offer-price-hint"
                      className="min-w-0 flex-1 bg-transparent text-right text-[20px] text-text-400 outline-none"
                    />
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-[13px] text-text-300"
                    >
                      {CURRENCY}
                    </span>
                  </div>

                  <p
                    id="offer-price-hint"
                    className="w-full text-right text-[14px] leading-[1.5] font-bold text-text-200"
                  >
                    أدخل السعر الإجمالي شاملاً قطع الغيار إن وجدت.
                  </p>
                </div>

                {/* A running total, not an input — `output` is the element for
                    a figure the page computes from another field. */}
                <output
                  htmlFor="offer-price"
                  className="flex flex-1 flex-col justify-between gap-[24px] rounded-[12px] border border-line bg-card p-[25px]"
                >
                  <div className="flex flex-col gap-[12px]">
                    <div className="flex items-center justify-between gap-[16px]">
                      <span className="text-[20px] leading-[1.5] font-bold text-text-400">
                        {money(total)}
                      </span>
                      <span className="text-[16px] leading-[1.5] text-text-secondary">
                        إجمالي الخدمة
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-[16px]">
                      <span className="text-[20px] leading-[1.5] font-bold text-error-500">
                        {`-${money(commission)}`}
                      </span>
                      <span className="text-[16px] leading-[1.5] text-error-500">
                        {`عمولة المنصة (${PLATFORM_COMMISSION_RATE * 100}%)`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-[16px] border-t border-primary-100 pt-[25px]">
                    <span className="text-[20px] leading-[1.5] font-bold text-primary-500">
                      {money(earnings)}
                    </span>
                    <span className="text-[20px] leading-[1.5] text-primary-500">
                      أرباحك المتوقعة
                    </span>
                  </div>
                </output>
              </div>
            </section>

            <section className="flex flex-col gap-[24px]">
              <h2 className="text-right text-[20px] leading-[1.5] font-bold text-text-400 md:text-[24px]">
                موعد البدء
              </h2>

              <div className="flex flex-col gap-[24px] rounded-[12px] border border-line bg-white p-[25px] shadow-card md:flex-row-reverse">
                <div className="flex flex-1 flex-col gap-[12px]">
                  <label
                    htmlFor="offer-date"
                    className="w-full text-right text-[16px] leading-[1.5] font-bold text-text-300"
                  >
                    تاريخ البدء
                  </label>
                  {/* Native date and time controls: they bring their own
                      picker, keyboard handling and locale formatting, all of
                      which a hand-drawn field would reimplement badly. */}
                  <input
                    id="offer-date"
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="h-[56px] w-full rounded-[8px] border border-line bg-card px-[25px] text-right text-[16px] text-text-400 outline-none focus-visible:border-primary-500 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-500"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-[12px]">
                  <label
                    htmlFor="offer-time"
                    className="w-full text-right text-[16px] leading-[1.5] font-bold text-text-300"
                  >
                    وقت الوصول المتوقع
                  </label>
                  <input
                    id="offer-time"
                    type="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    className="h-[56px] w-full rounded-[8px] border border-line bg-card px-[25px] text-right text-[16px] text-text-400 outline-none focus-visible:border-primary-500 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-500"
                  />
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-[24px]">
              <h2 className="text-right text-[20px] leading-[1.5] font-bold text-text-400">
                ملاحظات للعميل
              </h2>

              <Textarea
                id="offer-notes"
                rows={5}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="أخبر العميل عن خبرتك في إصلاحات مماثلة، وما هي الأدوات التي ستستخدمها..."
              />
            </section>

            <div className="flex flex-col gap-[24px] pt-[24px]">
              {error ? (
                <p
                  role="alert"
                  className="text-right text-[16px] font-bold text-error-500"
                >
                  {error}
                </p>
              ) : null}

              <Button type="submit" icon={Send} fullWidth className="h-[64px]">
                تقديم العرض
              </Button>

              <p className="text-right text-[16px] leading-[1.6] text-text-400 md:text-[20px]">
                بالنقر على &quot;تقديم العرض&quot;، فإنك توافق على شروط الخدمة
                الخاصة بنا. سيتم إخطار العميل فوراً وسنخطرك في حال تم قبول
                العرض.
              </p>
            </div>
          </form>

          <aside className="flex w-full flex-col gap-[25px] rounded-[12px] border border-line bg-white p-[17px] shadow-card lg:w-[407px] lg:shrink-0">
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-start justify-between gap-[12px]">
                <span className="rounded-[12px] bg-success-100 px-[8px] py-[4px] text-[16px] leading-[1.5] font-bold text-success-800">
                  طلب نشط
                </span>
                <span className="text-[20px] leading-[1.5] text-text-400 md:text-[24px]">
                  {order.reference}
                </span>
              </div>

              <h2 className="pt-[4px] text-right text-[20px] leading-[1.5] font-bold text-text-500">
                {order.title}
              </h2>

              <p className="text-right text-[18px] leading-[1.5] text-text-400 md:text-[20px]">
                {order.locationSummary}
              </p>

              <Link
                to={technicianOrderPath(
                  TECHNICIAN_ROUTES.orderDetails,
                  order.id,
                )}
                className="text-right text-[16px] font-bold text-primary-500 underline-offset-4 transition-colors hover:text-primary-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                عرض تفاصيل الطلب
              </Link>
            </div>

            <div className="flex flex-col gap-[12px] rounded-[12px] bg-primary-50 p-[24px]">
              {/* Icon right (x=235), heading left (x=107). */}
              <div className="flex items-center gap-[12px]">
                <Lightbulb
                  size={28}
                  aria-hidden="true"
                  className="shrink-0 text-warning-500"
                />
                <h3 className="text-[20px] leading-[1.5] font-bold text-text-300">
                  نصيحة ذهبية
                </h3>
              </div>

              <p className="pb-[12px] text-right text-[16px] leading-[1.6] text-text-300">
                تقديم عرض سعر منافس مع شرح واضح للخطوات التي ستتخذها يزيد من
                فرصة قبول طلبك بنسبة تصل إلى 40%.
              </p>

              {/* Decorative in the frame — it tracks nothing — so it is hidden
                  from the accessibility tree rather than announced as a
                  progress bar carrying no value. */}
              <div
                aria-hidden="true"
                className="h-[4px] w-full overflow-hidden rounded-full bg-card"
              >
                <div className="h-full w-[40%] rounded-full bg-primary-500" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </TechnicianLayout>
  )
}

export default TechnicianOrderOffer
