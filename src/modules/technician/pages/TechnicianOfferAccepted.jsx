import { Link, useNavigate, useParams } from 'react-router-dom'
import { BadgeCheck, MapPin, MessageSquare, Navigation, Phone } from 'lucide-react'
import ServiceMap from '../../../shared/components/ServiceMap.jsx'
import SuccessSeal from '../../../shared/components/SuccessSeal.jsx'
import TechnicianLayout from '../../../shared/layouts/TechnicianLayout.jsx'
import {
  TECHNICIAN_ROUTES,
  technicianOrderPath,
} from '../constants/technicianRoutes.js'
import { ACTIVE_JOB, CURRENCY, findOrder } from '../services/technicianService.js'

/**
 * The customer has accepted the offer (Figma node 22:3934).
 *
 * Where a technician lands after sending an offer that wins the job: who the
 * customer is, where the work is, what it pays, and the one action that starts
 * it. Everything below the seal summarises a job that already exists — nothing
 * on this screen is edited.
 *
 * The map is the shared `ServiceMap`, read only: the job's location belongs to
 * the customer and is not a technician's to move.
 */
function TechnicianOfferAccepted() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const order = findOrder(orderId)

  // A hand-typed or stale id. Nothing can be summarised for it, so the screen
  // says so and offers the way back rather than rendering an empty shell.
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

  const startJob = () =>
    navigate(technicianOrderPath(TECHNICIAN_ROUTES.jobTracking, order.id))

  return (
    <TechnicianLayout>
      <div className="mx-auto flex w-full max-w-[961px] flex-col px-[24px] py-[48px] lg:px-0">
        <div className="flex flex-col items-center gap-[8px] text-center">
          <SuccessSeal className="size-[120px] md:size-[167px]" />

          <h1 className="text-[20px] leading-[1.5] font-bold text-success-500 md:text-[24px]">
            رائع!! لقد وافق العميل علي عرضك
          </h1>
          <p className="text-[20px] leading-[1.5] text-text-300 md:text-[24px]">
            المهمه الان في انتظار التنفيذ
          </p>
        </div>

        {/* The customer, and the two ways to reach them. */}
        <section className="mt-[48px] flex flex-col gap-[24px] rounded-[12px] border border-line bg-white px-[12px] py-[24px]">
          <div className="flex items-center gap-[16px]">
            {/* Avatar first, so it sits at the right edge as the frame draws it,
                with the name beside it and the reference pushed away. */}
            <span className="relative shrink-0">
              {/* The frame puts the customer's photo here. A request carries no
                  such field, so the initial stands in rather than a broken image
                  or a stock face belonging to nobody. */}
              <span
                aria-hidden="true"
                className="flex size-[62px] items-center justify-center rounded-full border border-primary-400 bg-primary-50 text-[24px] font-bold text-primary-700"
              >
                {order.customer.name.charAt(0)}
              </span>

              {order.customer.verified ? (
                <BadgeCheck
                  size={21}
                  aria-hidden="true"
                  className="absolute bottom-0 left-[4px] rounded-full bg-white text-success-500"
                />
              ) : null}
            </span>

            <p className="shrink-0 text-[20px] leading-[1.5] font-bold text-text-400 md:text-[24px]">
              {order.customer.name}
            </p>

            {/* Pushed to the far end of the row, where the frame puts it. */}
            <p className="min-w-0 flex-1 text-left text-[20px] leading-[1.5] text-text-300 md:text-[24px]">
              {`رقم الطلب:${ACTIVE_JOB.customerReference}`}
            </p>
          </div>

          {/* Message fills the row and sits at the right; call is the narrower
              outline button to its left, as the frame lays them out. */}
          <div className="flex flex-col items-stretch justify-between gap-[12px] sm:flex-row sm:items-center">
            <Link
              to={TECHNICIAN_ROUTES.messages}
              className="flex h-[56px] flex-1 items-center justify-center gap-[11px] rounded-[12px] bg-primary-500 px-[16px] py-[8px] text-[20px] font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              مراسله
              <MessageSquare size={24} aria-hidden="true" />
            </Link>

            {/* No phone number reaches the client today, so this says as much
                rather than opening an empty `tel:` link. */}
            <button
              type="button"
              disabled
              title="الاتصال غير متاح حاليًا — لا يوفر الخادم رقم العميل بعد."
              className="flex h-[56px] w-full cursor-not-allowed items-center justify-center gap-[11px] rounded-[12px] border border-primary-500 px-[16px] py-[8px] text-[20px] font-bold text-primary-500 opacity-60 sm:w-[335px]"
            >
              اتصال
              <Phone size={24} aria-hidden="true" />
            </button>
          </div>
        </section>

        {/* The job itself: where it is, what it is, what it pays. */}
        <section className="mt-[16px] flex flex-col gap-[24px] rounded-[12px] border border-line bg-white p-[17px]">
          <div className="overflow-hidden rounded-[12px] border border-line">
            <div className="relative">
              <ServiceMap
                value={order.coords}
                onChange={() => {}}
                ariaLabel={`موقع الطلب: ${order.address}`}
                className="h-[160px] w-full"
              />

              {/* Above Leaflet's own panes, which sit at z-index 400. */}
              <p className="pointer-events-none absolute bottom-[12px] left-[16px] z-[500] flex items-center gap-[8px] rounded-[8px] bg-white/90 px-[8px] py-[4px] text-[14px] leading-[1.5] text-text-400 shadow-card">
                <MapPin size={14} aria-hidden="true" className="shrink-0" />
                {order.address}
              </p>
            </div>

            <p className="flex items-center gap-[8px] bg-white px-[16px] py-[16px] text-[16px] leading-[1.5] text-text-300">
              <Navigation size={15} aria-hidden="true" className="shrink-0" />
              {order.travelTime}
            </p>
          </div>

          <div className="flex flex-col gap-[8px] text-right">
            <h2 className="text-[20px] leading-[1.5] font-bold text-text-500 md:text-[24px]">
              {order.title}
            </h2>
            <p className="text-[18px] leading-[1.5] text-text-300 md:text-[20px]">
              {order.summary}
            </p>
          </div>

          <div className="h-px w-full bg-accent-100" />

          {/* Label right, amount left. */}
          <div className="flex items-center justify-between gap-[16px]">
            <p className="text-[18px] leading-[1.5] text-text-300 md:text-[20px]">
              قيمة العرض
            </p>
            <p className="text-[20px] leading-[1.5] font-bold text-primary-500 md:text-[24px]">
              {`${ACTIVE_JOB.amount.toFixed(2)} ${CURRENCY}`}
            </p>
          </div>
        </section>

        <button
          type="button"
          onClick={startJob}
          className="mt-[48px] flex h-[56px] w-full items-center justify-center rounded-[12px] bg-primary-500 text-[20px] font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          بدا المهمه الان
        </button>
      </div>
    </TechnicianLayout>
  )
}

export default TechnicianOfferAccepted
