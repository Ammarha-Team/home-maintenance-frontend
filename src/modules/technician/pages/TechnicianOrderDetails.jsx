import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  CalendarDays,
  ExternalLink,
  History,
  Loader2,
  MapPin,
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
import { useAvailableServiceRequest } from '../hooks/useAvailableServiceRequests.js'

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const relativeAge = (createdAt) => {
  if (!createdAt) return ''

  const elapsed = Date.now() - new Date(createdAt).getTime()
  if (Number.isNaN(elapsed) || elapsed < 0) return 'الآن'

  if (elapsed < HOUR) {
    return `منذ ${Math.max(Math.floor(elapsed / MINUTE), 1)} دقيقة`
  }
  if (elapsed < DAY) return `منذ ${Math.floor(elapsed / HOUR)} ساعة`

  return `منذ ${Math.floor(elapsed / DAY)} يوم`
}

// "2026-09-05" read as the day it names, not as UTC midnight.
const formatDay = (value) => {
  if (!value) return ''

  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number)
  if (!year || !month || !day) return ''

  return new Date(year, month - 1, day).toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Technician Order Details (Figma node 21:2465).
 *
 * Everything a technician needs before deciding whether to bid: the request in
 * the customer's own words, the photos they attached, and where the job is. The
 * action card sits alongside, and the one thing it does is carry the technician
 * on to the offer form.
 *
 * The record is the live one from GET /api/service-requests/available/{id},
 * which is technician-only. Two things the frame draws are not in it — the
 * travel time to the job, and whether the customer's identity is verified — so
 * neither is drawn rather than being filled with a number nothing produced.
 *
 * The map is the shared `ServiceMap`, which is a picker by design. Here it is
 * only ever read, so the change handler is deliberately empty: the job's
 * location belongs to the customer and is not a technician's to move.
 */
function TechnicianOrderDetails() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { request, loading, error } = useAvailableServiceRequest(orderId)

  const trail = [
    { label: 'الرئيسيه', to: TECHNICIAN_ROUTES.dashboard },
    { label: 'الطلبات', to: TECHNICIAN_ROUTES.orders },
    { label: 'تفاصيل الطلب' },
  ]

  if (loading) {
    return (
      <TechnicianLayout>
        <div className="mx-auto flex w-full max-w-[720px] items-center justify-center gap-[12px] px-[24px] py-[64px] text-[18px] text-text-300">
          <Loader2 size={20} aria-hidden="true" className="animate-spin" />
          جارٍ تحميل الطلب...
        </div>
      </TechnicianLayout>
    )
  }

  // A hand-typed or stale id, a request another technician has already taken,
  // or a failed call. Nothing can be shown for any of them, so the page says so
  // and offers the way back rather than rendering an empty shell.
  if (error || !request) {
    return (
      <TechnicianLayout>
        <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-[16px] px-[24px] py-[64px] text-center">
          <h1 className="text-[24px] leading-[1.5] font-bold text-text-500">
            هذا الطلب غير متاح
          </h1>
          <p className="text-[16px] leading-[1.6] text-text-300">
            {error || 'ربما تم سحبه أو قبوله من فني آخر.'}
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

  const title = `خدمة ${request.categoryLabel}`
  const coords =
    request.latitude !== null && request.longitude !== null
      ? { lat: request.latitude, lng: request.longitude }
      : null
  const openOffer = () =>
    navigate(technicianOrderPath(TECHNICIAN_ROUTES.orderOffer, request.id))

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
                    <Badge tone="primary">{request.categoryLabel}</Badge>
                    {/* Every request on this board is a normal one; emergencies
                        travel through their own flow entirely. */}
                    <Badge tone="neutral">عادي</Badge>
                  </div>

                  <p className="text-[16px] leading-[1.5] text-text-secondary">
                    {relativeAge(request.createdAt)}
                  </p>
                </div>

                <h1 className="text-right text-[24px] leading-[1.4] font-bold text-text-500 md:text-[29px]">
                  {title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-[24px] gap-y-[8px] text-[14px] leading-[1.5] font-bold text-text-300">
                  {request.city ? (
                    <span className="flex items-center gap-[4px]">
                      {request.city}
                      <MapPin size={15} aria-hidden="true" className="shrink-0" />
                    </span>
                  ) : null}

                  {request.preferredDate ? (
                    <span className="flex items-center gap-[4px]">
                      {`الموعد المفضل ${formatDay(request.preferredDate)}`}
                      <CalendarDays
                        size={15}
                        aria-hidden="true"
                        className="shrink-0"
                      />
                    </span>
                  ) : null}

                  <span>
                    {request.images.length
                      ? `${request.images.length} مرفقات`
                      : 'لا توجد مرفقات'}
                  </span>
                </div>
              </div>

              <div className="h-px w-full bg-accent-100" />

              <div className="flex flex-col gap-[12px]">
                <h2 className="text-right text-[20px] leading-[1.5] font-bold text-text-400">
                  وصف المشكلة
                </h2>
                <p className="rounded-[8px] bg-card p-[25px] text-right text-[18px] leading-[1.7] text-text-secondary md:text-[20px]">
                  {request.problemDescription}
                </p>
              </div>
            </section>

            {request.images.length ? (
              <section className="flex flex-col gap-[12px]">
                <div className="flex items-center justify-between gap-[16px]">
                  <h2 className="text-[20px] leading-[1.5] font-bold text-text-400">
                    الصور والمرفقات
                  </h2>
                  <p className="text-[14px] leading-[1.5] font-bold text-text-300">
                    {`${request.images.length} مرفقات`}
                  </p>
                </div>

                <div className="grid gap-[12px] sm:grid-cols-3">
                  {request.images.map((image, index) => (
                    <img
                      key={image}
                      src={image}
                      alt={`مرفق ${index + 1} من ${title}`}
                      className="h-[200px] w-full rounded-[12px] border border-line object-cover md:h-[271px]"
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {coords ? (
              <section className="flex flex-col gap-[12px]">
                <h2 className="text-right text-[20px] leading-[1.5] font-bold text-text-400">
                  الموقع
                </h2>

                <div className="overflow-hidden rounded-[12px] border border-line">
                  <ServiceMap
                    value={coords}
                    onChange={() => {}}
                    ariaLabel={`موقع الطلب: ${request.address}`}
                    className="h-[256px] w-full"
                  />

                  {/* Address right (x=501), the maps link left (x=24). */}
                  <div className="flex flex-wrap items-center justify-between gap-[12px] bg-white p-[16px]">
                    <p className="flex items-center gap-[12px] text-[16px] leading-[1.5] font-bold text-text-400">
                      <span className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                        <MapPin size={18} aria-hidden="true" />
                      </span>
                      {request.address}
                    </p>

                    <a
                      href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=16/${coords.lat}/${coords.lng}`}
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
            ) : null}
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
                {/* The icon sits to the right of its label in the frame
                    (x=341, label at x=169), so it leads the row. */}
                <li className="flex items-center justify-end gap-[12px]">
                  <History size={18} aria-hidden="true" className="shrink-0" />
                  {`تم تقديم ${request.offersCount} عروض على هذا الطلب`}
                </li>
              </ul>
            </div>

            {/* Avatar right (x=245), name and reference left (x=0). */}
            <div className="flex items-center gap-[16px] rounded-[12px] bg-white p-[12px] shadow-card">
              {request.clientProfilePicture ? (
                <img
                  src={request.clientProfilePicture}
                  alt=""
                  className="size-[62px] shrink-0 rounded-full border-2 border-primary-400 object-cover"
                />
              ) : (
                // No photo on the record. The initial stands in rather than a
                // broken image or a stock face belonging to nobody.
                <span
                  aria-hidden="true"
                  className="flex size-[62px] shrink-0 items-center justify-center rounded-full border-2 border-primary-400 bg-primary-50 text-[24px] font-bold text-primary-700"
                >
                  {request.clientName.charAt(0)}
                </span>
              )}

              <div className="flex min-w-0 flex-col gap-[8px] text-right">
                <p className="text-[20px] leading-[1.5] font-bold text-text-500">
                  {request.clientName}
                </p>
                <p className="text-[16px] leading-[1.5] text-text-300">
                  {`رقم الطلب: #${String(request.id).slice(0, 8)}`}
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
