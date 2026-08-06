import { Link, useNavigate, useParams } from 'react-router-dom'
import { MapPin, Navigation } from 'lucide-react'
import ServiceMap from '../../../shared/components/ServiceMap.jsx'
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
 * The job on the way to the customer (Figma node 22:3431).
 *
 * The stage list says where the job has got to and the map says where it is
 * going; the one action confirms arrival and moves the job on. The map is the
 * shared `ServiceMap`, read only — the destination belongs to the customer.
 */
function TechnicianJobTracking() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const order = findOrder(orderId)

  const trail = [
    { label: 'الرئيسيه', to: TECHNICIAN_ROUTES.dashboard },
    // The offers screen has not been built, so this step is a label rather than
    // a link: routing to an unregistered path would leave the portal.
    { label: 'العروض' },
    { label: 'بدء الخدمه الان' },
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

  const confirmArrival = () =>
    navigate(technicianOrderPath(TECHNICIAN_ROUTES.jobArrival, order.id))

  return (
    <TechnicianLayout>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[24px] px-[24px] py-[24px] lg:px-[80px] lg:py-[32px]">
        <OrderBreadcrumb trail={trail} />

        <JobBrief
          reference={ACTIVE_JOB.reference}
          statusLabel="في الطريق"
          statusTone="warning"
          title={order.title}
          summary={order.summary}
        />

        {/* The frame puts the map on the right and the stage list on the left,
            so the map is written first — the first child of an RTL row being
            the rightmost. */}
        <div className="flex flex-col gap-[24px] lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 overflow-hidden rounded-[12px] border border-line bg-white">
            <div className="relative">
              <ServiceMap
                value={order.coords}
                onChange={() => {}}
                ariaLabel={`موقع العميل: ${order.address}`}
                className="h-[320px] w-full lg:h-[420px]"
              />

              {/* Above Leaflet's own panes, which sit at z-index 400. */}
              <p className="pointer-events-none absolute bottom-[12px] left-[16px] z-[500] flex items-center gap-[8px] rounded-[8px] bg-white/90 px-[8px] py-[4px] text-[14px] leading-[1.5] text-text-400 shadow-card">
                <MapPin size={14} aria-hidden="true" className="shrink-0" />
                {order.address}
              </p>
            </div>

            <p className="flex items-center gap-[8px] px-[16px] py-[16px] text-[16px] leading-[1.5] text-text-300">
              <Navigation size={15} aria-hidden="true" className="shrink-0" />
              {order.travelTime}
            </p>
          </div>

          <aside className="flex w-full flex-col gap-[24px] rounded-[12px] border border-line bg-white p-[25px] lg:w-[320px] lg:shrink-0">
            <JobStageTimeline current="enroute" />

            <button
              type="button"
              onClick={confirmArrival}
              className="flex h-[56px] w-full items-center justify-center rounded-[12px] bg-primary-700 text-[18px] font-bold text-white transition-colors hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              تأكيد الوصول للموقع
            </button>
          </aside>
        </div>
      </div>
    </TechnicianLayout>
  )
}

export default TechnicianJobTracking
