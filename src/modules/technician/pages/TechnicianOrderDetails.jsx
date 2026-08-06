import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  BadgeCheck,
  ExternalLink,
  History,
  MapPin,
  Navigation,
  Send,
} from 'lucide-react'
import Badge from '../../../shared/components/Badge.jsx'
import Button from '../../../shared/components/Button.jsx'
import ServiceMap from '../../../shared/components/ServiceMap.jsx'
import TechnicianLayout from '../../../shared/layouts/TechnicianLayout.jsx'
import OrderBreadcrumb from '../components/OrderBreadcrumb.jsx'
import {
  TECHNICIAN_ROUTES,
  technicianOrderPath,
} from '../constants/technicianRoutes.js'
import { findOrder } from '../services/technicianService.js'

/**
 * Technician Order Details (Figma node 21:2465).
 *
 * Everything a technician needs before deciding whether to bid: the request in
 * the customer's own words, the photos they attached, and where the job is. The
 * action card sits alongside, and the one thing it does is carry the technician
 * on to the offer form.
 *
 * The map is the shared `ServiceMap`, which is a picker by design. Here it is
 * only ever read, so the change handler is deliberately empty: the job's
 * location belongs to the customer and is not a technician's to move.
 */
function TechnicianOrderDetails() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const order = findOrder(orderId)

  const trail = [
    { label: 'الرئيسيه', to: TECHNICIAN_ROUTES.dashboard },
    { label: 'الطلبات', to: TECHNICIAN_ROUTES.orders },
    { label: 'تفاصيل الطلب' },
  ]

  // A hand-typed or stale id. Nothing can be shown for it, so the page says so
  // and offers the way back rather than rendering an empty shell.
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

  const emergency = order.urgency === 'emergency'
  const openOffer = () =>
    navigate(technicianOrderPath(TECHNICIAN_ROUTES.orderOffer, order.id))

  return (
    <TechnicianLayout>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[24px] px-[24px] py-[24px] lg:px-[80px] lg:py-[32px]">
        <OrderBreadcrumb trail={trail} />

        {/* The frame puts the action card on the left (x=0) and the request on
            the right (x=433). In an RTL row the first child is the rightmost,
            so the main column is written first — the same arrangement the
            dashboard uses. */}
        <div className="flex flex-col gap-[24px] lg:flex-row lg:items-start lg:gap-[24px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[24px]">
            <section className="flex flex-col gap-[24px] rounded-[12px] bg-white p-[25px] shadow-card">
              <div className="flex flex-col gap-[16px]">
                <div className="flex items-center justify-between gap-[12px]">
                  <div className="flex items-center gap-[12px]">
                    <Badge tone="primary">{order.category}</Badge>
                    <Badge tone={emergency ? 'danger' : 'neutral'}>
                      {emergency ? 'عاجل جداً' : 'عادي'}
                    </Badge>
                  </div>

                  <p className="text-[16px] leading-[1.5] text-text-secondary">
                    {order.age}
                  </p>
                </div>

                <h1 className="text-right text-[24px] leading-[1.4] font-bold text-text-500 md:text-[29px]">
                  {order.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-[24px] gap-y-[8px] text-[14px] leading-[1.5] font-bold text-text-300">
                  <span className="flex items-center gap-[4px]">
                    {`${order.district} (${order.distance})`}
                    <MapPin size={15} aria-hidden="true" className="shrink-0" />
                  </span>
                  <span>{order.attachmentLabel}</span>
                </div>
              </div>

              <div className="h-px w-full bg-accent-100" />

              <div className="flex flex-col gap-[12px]">
                <h2 className="text-right text-[20px] leading-[1.5] font-bold text-text-400">
                  وصف المشكلة
                </h2>
                <p className="rounded-[8px] bg-card p-[25px] text-right text-[18px] leading-[1.7] text-text-secondary md:text-[20px]">
                  {order.description}
                </p>
              </div>
            </section>

            {order.gallery.length ? (
              <section className="flex flex-col gap-[12px]">
                <div className="flex items-center justify-between gap-[16px]">
                  <h2 className="text-[20px] leading-[1.5] font-bold text-text-400">
                    الصور والمرفقات
                  </h2>
                  <p className="text-[14px] leading-[1.5] font-bold text-text-300">
                    {`${order.gallery.length} مرفقات`}
                  </p>
                </div>

                <div className="grid gap-[12px] sm:grid-cols-3">
                  {order.gallery.map((image, index) => (
                    <img
                      key={image}
                      src={image}
                      alt={`مرفق ${index + 1} من ${order.title}`}
                      className="h-[200px] w-full rounded-[12px] border border-line object-cover md:h-[271px]"
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <section className="flex flex-col gap-[12px]">
              <h2 className="text-right text-[20px] leading-[1.5] font-bold text-text-400">
                الموقع
              </h2>

              <div className="overflow-hidden rounded-[12px] border border-line">
                <div className="relative">
                  <ServiceMap
                    value={order.coords}
                    onChange={() => {}}
                    ariaLabel={`موقع الطلب: ${order.address}`}
                    className="h-[256px] w-full"
                  />

                  {/* Above Leaflet's own panes, which sit at z-index 400. */}
                  <p className="pointer-events-none absolute top-[16px] right-[16px] z-[500] flex items-center gap-[12px] rounded-[8px] bg-white/90 px-[13px] py-[9px] text-[14px] leading-[1.5] font-bold text-text-400 shadow-card">
                    <Navigation
                      size={18}
                      aria-hidden="true"
                      className="shrink-0"
                    />
                    {order.travelTime}
                  </p>
                </div>

                {/* Address right (x=501), the maps link left (x=24). */}
                <div className="flex flex-wrap items-center justify-between gap-[12px] bg-white p-[16px]">
                  <p className="flex items-center gap-[12px] text-[16px] leading-[1.5] font-bold text-text-400">
                    <span className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                      <MapPin size={18} aria-hidden="true" />
                    </span>
                    {order.address}
                  </p>

                  <a
                    href={`https://www.openstreetmap.org/?mlat=${order.coords.lat}&mlon=${order.coords.lng}#map=16/${order.coords.lat}/${order.coords.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-[4px] text-[16px] font-bold text-primary-500 underline-offset-4 transition-colors hover:text-primary-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                  >
                    <ExternalLink
                      size={14}
                      aria-hidden="true"
                      className="shrink-0"
                    />
                    فتح في الخرائط
                  </a>
                </div>
              </div>
            </section>
          </div>

          <aside className="flex w-full flex-col gap-[16px] lg:w-[409px] lg:shrink-0">
            <div className="flex flex-col gap-[24px] rounded-[12px] bg-white p-[25px] shadow-card">
              <div className="flex flex-col gap-[4px] text-right">
                <h2 className="text-[20px] leading-[1.5] font-bold text-text-500">
                  تقديم عرضك
                </h2>
                <p className="text-[16px] leading-[1.5] text-text-secondary">
                  حدد السعر والوقت المتوقع لإنجاز العمل
                </p>
              </div>

              <Button icon={Send} fullWidth onClick={openOffer}>
                تقديم عرض الآن
              </Button>

              <div className="h-px w-full bg-accent-100" />

              <ul className="flex flex-col gap-[12px] text-[16px] leading-[1.5] text-text-secondary">
                {/* Both icons sit to the right of their label in the frame
                    (x=343 and x=341, labels at x=198 and x=169), so each one
                    leads its row. */}
                {order.customer.verified ? (
                  <li className="flex items-center gap-[12px]">
                    <BadgeCheck
                      size={18}
                      aria-hidden="true"
                      className="shrink-0 text-success-800"
                    />
                    العميل موثق الهوية
                  </li>
                ) : null}

                <li className="flex items-center justify-end gap-[12px]">
                  <History size={18} aria-hidden="true" className="shrink-0" />
                  {`تم تقديم ${order.customer.previousOffers} عروض سابقة`}
                </li>
              </ul>
            </div>

            {/* Avatar right (x=245), name and reference left (x=0). */}
            <div className="flex items-center gap-[16px] rounded-[12px] bg-white p-[12px] shadow-card">
              {/* The frame puts the customer's photo here. A request carries no
                  such field, so the initial stands in rather than a broken
                  image or a stock face belonging to nobody. */}
              <span
                aria-hidden="true"
                className="flex size-[62px] shrink-0 items-center justify-center rounded-full border-2 border-primary-400 bg-primary-50 text-[24px] font-bold text-primary-700"
              >
                {order.customer.name.charAt(0)}
              </span>

              <div className="flex min-w-0 flex-col gap-[8px] text-right">
                <p className="text-[20px] leading-[1.5] font-bold text-text-500">
                  {order.customer.name}
                </p>
                <p className="text-[16px] leading-[1.5] text-text-300">
                  {`رقم الطلب: ${order.customer.reference}`}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </TechnicianLayout>
  )
}

export default TechnicianOrderDetails
