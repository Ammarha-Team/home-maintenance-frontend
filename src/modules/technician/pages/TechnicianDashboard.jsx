import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import TechnicianLayout from '../../../shared/layouts/TechnicianLayout.jsx'
import AvailabilityBanner from '../components/AvailabilityBanner.jsx'
import CurrentWorkPanel from '../components/CurrentWorkPanel.jsx'
import NewRequestCard from '../components/NewRequestCard.jsx'
import ScheduledJobRow from '../components/ScheduledJobRow.jsx'
import TechnicianStats from '../components/TechnicianStats.jsx'
import {
  TECHNICIAN_NAV_ITEMS,
  TECHNICIAN_ROUTES,
} from '../constants/technicianRoutes.js'
import {
  CURRENT_JOB,
  NEW_REQUESTS,
  SCHEDULED_JOBS,
  TECHNICIAN,
  TODAY_STATS,
} from '../services/technicianService.js'

/**
 * Technician Dashboard — the landing screen after a technician signs in
 * (Figma node 21:2028, "home technician").
 *
 * The frame is a 1440px two-column page: a 936px main column on the right in
 * RTL and a 304px side column on the left. Below `lg` the two stack, main
 * column first, since the side column summarises work the main column already
 * lists.
 */
function TechnicianDashboard() {
  const [available, setAvailable] = useState(TECHNICIAN.available)
  const navigate = useNavigate()

  // Every forward action on this screen leads to Technician Orders or
  // Technician Order Details, and the portal is being built one screen per
  // branch. Until those routes are registered, navigating would fall through
  // the router's catch-all and drop the technician on the landing page, so the
  // actions stay inert rather than breaking the flow. The `ready` flag flips
  // when that screen merges.
  const ordersReady = TECHNICIAN_NAV_ITEMS.find(
    (item) => item.key === 'orders',
  ).ready

  const openOrders = () => {
    if (ordersReady) navigate(TECHNICIAN_ROUTES.orders)
  }

  return (
    <TechnicianLayout>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[24px] px-[24px] py-[24px] lg:flex-row lg:items-start lg:gap-[40px] lg:px-[80px] lg:py-[32px]">
        {/* Main column first in the DOM: in an RTL row the first child is the
            rightmost, which is where the frame puts it. */}
        <div className="flex min-w-0 flex-1 flex-col gap-[24px]">
          <p className="flex items-center justify-end gap-[8px] text-[16px] leading-[1.5] text-text-400 md:text-[20px]">
            <button
              type="button"
              className="px-[6px] py-[10px] text-[16px] font-bold text-primary-500 underline transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              تغيير
            </button>
            {TECHNICIAN.city}
            <MapPin size={22} aria-hidden="true" className="shrink-0" />
          </p>

          <AvailabilityBanner
            name={TECHNICIAN.name}
            available={available}
            onAvailabilityChange={setAvailable}
          />

          <TechnicianStats stats={TODAY_STATS} />

          <section
            aria-labelledby="new-requests-heading"
            className="flex flex-col gap-[24px]"
          >
            <div className="flex items-center justify-between gap-[16px]">
              <button
                type="button"
                onClick={openOrders}
                className="px-[6px] py-[7px] text-[18px] font-bold text-primary-500 underline transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 md:text-[20px]"
              >
                عرض الكل
              </button>

              <h2
                id="new-requests-heading"
                className="flex items-center gap-[8px] text-[22px] leading-[1.5] font-bold text-text-500 md:text-[28px]"
              >
                طلبات جديدة ({NEW_REQUESTS.length})
                <span
                  aria-hidden="true"
                  className="size-[8px] shrink-0 rounded-full bg-success-500"
                />
              </h2>
            </div>

            <div className="grid gap-[16px] sm:grid-cols-2 xl:grid-cols-3">
              {NEW_REQUESTS.map((request) => (
                <NewRequestCard
                  key={request.id}
                  request={request}
                  onDetails={openOrders}
                  onAccept={openOrders}
                />
              ))}
            </div>
          </section>

          <section
            aria-labelledby="today-jobs-heading"
            className="flex flex-col gap-[24px]"
          >
            <div className="flex items-center justify-between gap-[16px]">
              <button
                type="button"
                onClick={openOrders}
                className="px-[6px] py-[7px] text-[18px] font-bold text-primary-500 underline transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 md:text-[20px]"
              >
                عرض الكل
              </button>

              <h2
                id="today-jobs-heading"
                className="text-[22px] leading-[1.5] font-bold text-text-500 md:text-[24px]"
              >
                مهام اليوم المجدوله
              </h2>
            </div>

            <div className="flex flex-col gap-[12px]">
              {SCHEDULED_JOBS.map((job) => (
                <ScheduledJobRow key={job.id} job={job} onOpen={openOrders} />
              ))}
            </div>
          </section>

          <button
            type="button"
            onClick={openOrders}
            className="h-[63px] w-full rounded-[12px] bg-primary-500 text-[18px] font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 md:text-[20px]"
          >
            مشاهده طلبات اليوم
          </button>
        </div>

        <aside className="w-full shrink-0 lg:w-[304px]">
          <CurrentWorkPanel job={CURRENT_JOB} />
        </aside>
      </div>
    </TechnicianLayout>
  )
}

export default TechnicianDashboard
