import { MapPin, MessageSquare, Navigation } from 'lucide-react'
import ServiceMap from '../../../shared/components/ServiceMap.jsx'

/**
 * The dashboard's side column (Figma node 21:2194): the job in progress above,
 * the professional-plan promotion below.
 *
 * The frame draws the job's location as a flat map image. It is rendered here
 * with the existing `ServiceMap` instead, so the portal draws the same map as
 * the rest of the app and no screenshot has to be shipped as an asset.
 */
function CurrentWorkPanel({ job }) {
  return (
    <div className="flex flex-col gap-[15px]">
      <section
        aria-label="العمل الحالي"
        className="flex flex-col gap-[24px] rounded-[12px] border border-line bg-white p-[16px] shadow-card"
      >
        <h2 className="text-right text-[20px] leading-[1.5] font-bold text-text-500">
          العمل الحالي
        </h2>

        <div className="flex flex-col gap-[24px]">
          <div className="flex items-center justify-between gap-[8px]">
            <p className="text-[16px] leading-[1.5] text-text-400">
              ID: {job.id}
            </p>
            <span className="rounded-[12px] bg-primary-50 px-[8px] py-[2px] text-[16px] leading-[1.5] text-primary-600">
              {job.status}
            </span>
          </div>

          <div className="flex flex-col gap-[8px]">
            <h3 className="text-right text-[20px] leading-[1.5] font-bold text-text-500">
              {job.title}
            </h3>

            <div className="relative h-[160px] w-full overflow-hidden rounded-[12px]">
              <ServiceMap
                value={job.coords}
                onChange={() => {}}
                className="h-full w-full"
                ariaLabel={`موقع ${job.title}`}
              />

              {/* Address plate over the map, as drawn. The gradient keeps the
                  white label readable whatever tile sits under it. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
              />
              <p className="pointer-events-none absolute right-[12px] bottom-[12px] z-[500] flex items-center gap-[8px] text-[14px] leading-[1.5] font-bold text-white drop-shadow-[0_2px_1px_rgba(0,0,0,0.6)]">
                {job.address}
                <span className="flex size-[28px] items-center justify-center rounded-full bg-white/90">
                  <MapPin
                    size={15}
                    aria-hidden="true"
                    className="text-primary-500"
                  />
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[12px]">
            <button
              type="button"
              aria-label="مراسلة العميل"
              className="flex size-[48px] shrink-0 items-center justify-center rounded-[12px] border border-primary-700 text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <MessageSquare size={20} aria-hidden="true" />
            </button>

            <button
              type="button"
              className="flex h-[48px] flex-1 items-center justify-center gap-[8px] rounded-[12px] bg-primary-500 text-[16px] font-bold text-white shadow-raised transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <Navigation size={16} aria-hidden="true" />
              توجيه
            </button>
          </div>
        </div>
      </section>

      <section
        aria-label="الاشتراك الاحترافي"
        className="flex flex-col items-end gap-[12px] rounded-[12px] border border-primary-100 bg-primary-50 p-[24px] shadow-card"
      >
        <p className="rounded-[12px] border border-primary-500 bg-surface px-[12px] py-[8px] text-[14px] leading-[1.5] font-bold text-primary-700">
          حصري للمحترفين بخصم 25 %
        </p>

        <h2 className="pt-[8px] text-right text-[16px] leading-[1.5] font-bold text-text-300">
          ارتقِ بعملك إلى المستوى الاحترافي
        </h2>

        <p className="max-w-[320px] text-right text-[16px] leading-[1.5] text-text-200">
          انضم إلى نخبة مقدمي الخدمات واحصل على ميزات حصرية تضاعف أرباحك.
        </p>

        <button
          type="button"
          className="h-[48px] w-full rounded-[12px] bg-primary-500 text-[16px] font-bold text-surface transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          اشترك الان
        </button>
      </section>
    </div>
  )
}

export default CurrentWorkPanel
