import { Link, useNavigate, useParams } from 'react-router-dom'
import { BadgeCheck, Briefcase, MapPin, MessageSquare, Phone } from 'lucide-react'
import TechnicianLayout from '../../../shared/layouts/TechnicianLayout.jsx'
import JobBrief from '../components/JobBrief.jsx'
import JobStageTimeline from '../components/JobStageTimeline.jsx'
import OrderBreadcrumb from '../components/OrderBreadcrumb.jsx'
import {
  TECHNICIAN_ROUTES,
  technicianOrderPath,
} from '../constants/technicianRoutes.js'
import { ACTIVE_JOB, findOrder } from '../services/technicianService.js'

/**
 * On site, with the work still to do (Figma node 22:3542).
 *
 * The map is gone by this point — the technician is standing at the address, so
 * what matters is who to talk to and what was agreed. The one action closes the
 * job out.
 */
function TechnicianJobArrival() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const order = findOrder(orderId)

  const trail = [
    { label: 'الرئيسيه', to: TECHNICIAN_ROUTES.dashboard },
    // The offers screen has not been built, so this step is a label rather than
    // a link: routing to an unregistered path would leave the portal.
    { label: 'العروض' },
    { label: 'تاكيد الوصول للموقع' },
  ]

  if (!order) {
    return (
      <TechnicianLayout>
        <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-[16px] px-[24px] py-[64px] text-center">
          <h1 className="text-[24px] leading-[1.5] font-bold text-text-500">
            هذه المهمة غير موجودة
          </h1>
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

  const finishJob = () =>
    navigate(technicianOrderPath(TECHNICIAN_ROUTES.jobCompletion, order.id))

  return (
    <TechnicianLayout>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[24px] px-[24px] py-[24px] lg:px-[80px] lg:py-[32px]">
        <OrderBreadcrumb trail={trail} />

        <JobBrief
          reference={ACTIVE_JOB.reference}
          statusLabel="تم الوصول"
          statusTone="success"
          title={order.title}
          summary={order.summary}
        />

        {/* The customer panel sits on the right in the frame and the stage list
            on the left, so the panel is written first. */}
        <div className="flex flex-col gap-[24px] lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-[24px]">
            <section className="flex flex-col gap-[24px] rounded-[12px] border border-line bg-white p-[25px]">
              {/* Customer right, the two ways to reach them left. */}
              <div className="flex items-center justify-between gap-[16px] border-b border-line pb-[24px]">
                <div className="flex min-w-0 items-center gap-[16px]">
                  <span className="relative shrink-0">
                    {/* The frame shows the customer's photo. A request carries
                        no such field, so the initial stands in. */}
                    <span
                      aria-hidden="true"
                      className="flex size-[62px] items-center justify-center rounded-full bg-primary-50 text-[24px] font-bold text-primary-700"
                    >
                      {order.customer.name.charAt(0)}
                    </span>

                    {order.customer.verified ? (
                      <BadgeCheck
                        size={20}
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 rounded-full bg-white text-success-500"
                      />
                    ) : null}
                  </span>

                  <p className="truncate text-[20px] leading-[1.5] font-bold text-text-500 md:text-[24px]">
                    {order.customer.name}
                  </p>
                </div>

                {/* Call first so it lands to the right of the message button,
                    which the frame puts furthest left. */}
                <div className="flex shrink-0 items-center gap-[12px]">
                  {/* No phone number reaches the client, so this says so rather
                      than opening an empty `tel:` link. */}
                  <button
                    type="button"
                    disabled
                    aria-label="اتصال"
                    title="الاتصال غير متاح حاليًا — لا يوفر الخادم رقم العميل بعد."
                    className="flex size-[48px] cursor-not-allowed items-center justify-center rounded-[12px] bg-primary-50 text-primary-500 opacity-60"
                  >
                    <Phone size={20} aria-hidden="true" />
                  </button>

                  <Link
                    to={TECHNICIAN_ROUTES.messages}
                    aria-label={`مراسلة ${order.customer.name}`}
                    className="flex size-[48px] items-center justify-center rounded-[12px] bg-primary-500 text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                  >
                    <MessageSquare size={20} aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* The icon leads each row, so it sits at the right edge with the
                  label beside it — no `justify-between`, which would throw the
                  icon to the far side of the card. */}
              <dl className="flex flex-col gap-[24px]">
                <div className="flex items-start gap-[12px]">
                  <Briefcase
                    size={18}
                    aria-hidden="true"
                    className="mt-[4px] shrink-0 text-text-300"
                  />

                  <div className="flex min-w-0 flex-col gap-[4px] text-right">
                    <dt className="text-[16px] leading-[1.5] font-bold text-text-400">
                      نوع المهمة
                    </dt>
                    <dd className="text-[16px] leading-[1.5] text-text-300">
                      {ACTIVE_JOB.serviceType}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-[12px]">
                  <MapPin
                    size={18}
                    aria-hidden="true"
                    className="mt-[4px] shrink-0 text-text-300"
                  />

                  <div className="flex min-w-0 flex-col gap-[4px] text-right">
                    <dt className="text-[16px] leading-[1.5] font-bold text-text-400">
                      العنوان
                    </dt>
                    <dd className="text-[16px] leading-[1.5] text-text-300">
                      {ACTIVE_JOB.address}
                    </dd>
                  </div>
                </div>
              </dl>
            </section>

            <button
              type="button"
              onClick={finishJob}
              className="flex h-[56px] w-full items-center justify-center gap-[12px] rounded-[12px] bg-primary-500 text-[20px] font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <BadgeCheck size={24} aria-hidden="true" />
              إنهــاء الخدمه
            </button>
          </div>

          <aside className="w-full rounded-[12px] border border-line bg-white p-[25px] lg:w-[344px] lg:shrink-0">
            <JobStageTimeline current="arrived" />
          </aside>
        </div>
      </div>
    </TechnicianLayout>
  )
}

export default TechnicianJobArrival
