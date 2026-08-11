import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Search } from 'lucide-react'
import TechnicianLayout from '../../../shared/layouts/TechnicianLayout.jsx'
import OrderCard from '../components/OrderCard.jsx'
import OrderFilters from '../components/OrderFilters.jsx'
import {
  TECHNICIAN_ROUTES,
  technicianOrderPath,
} from '../constants/technicianRoutes.js'
import { ORDERS } from '../services/technicianService.js'

// The slider is in kilometres while the records carry their distance as the
// display string the frame writes — "1.2 كم". Reading a number out of it here
// keeps the filter honest without turning every distance in the app into a
// float it has no other use for.
const distanceOf = (order) => Number.parseFloat(order.distance) || 0

/**
 * Technician Orders — the job board (Figma node 21:2236).
 *
 * A filter rail on the left in RTL and the customer requests on the right.
 * Below `lg` the rail moves above the list: a filter that has scrolled off the
 * top of a phone is a filter nobody uses.
 *
 * Filtering happens here rather than in the rail, because the board is what has
 * to show the result — and the count under the heading has to agree with what
 * is actually on screen.
 */
function TechnicianOrders() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [urgency, setUrgency] = useState('all')
  const [distance, setDistance] = useState(50)
  const [query, setQuery] = useState('')

  const toggleCategory = (category) => {
    setCategories((current) =>
      current.includes(category)
        ? current.filter((entry) => entry !== category)
        : [...current, category],
    )
  }

  const resetFilters = () => {
    setCategories([])
    setUrgency('all')
    setDistance(50)
    setQuery('')
  }

  // An empty category list means "nothing chosen", which reads as all of them —
  // the frame ships the board unfiltered.
  const visible = useMemo(() => {
    const term = query.trim()

    return ORDERS.filter((order) => {
      if (categories.length && !categories.includes(order.category)) return false
      if (urgency !== 'all' && order.urgency !== urgency) return false
      if (distanceOf(order) > distance) return false
      if (term && !`${order.title} ${order.district}`.includes(term)) return false

      return true
    })
  }, [categories, urgency, distance, query])

  const openDetails = (order) =>
    navigate(technicianOrderPath(TECHNICIAN_ROUTES.orderDetails, order.id))

  const openOffer = (order) =>
    navigate(technicianOrderPath(TECHNICIAN_ROUTES.orderOffer, order.id))

  return (
    <TechnicianLayout>
      {/* Stacked, the rail belongs above the list it filters, and the list is
          written first — so the column is reversed and the row is not. */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col-reverse gap-[24px] px-[24px] py-[24px] lg:flex-row lg:items-start lg:gap-[32px] lg:px-[80px] lg:py-[32px]">
        {/* The list first, the rail second. The frame puts the rail on the left
            (x=80) and the list on the right (x=432), and in an RTL row the
            first child is the rightmost — so the reading order and the frame
            agree here rather than fighting. */}
        <div className="flex min-w-0 flex-1 flex-col gap-[32px]">
          <div className="flex flex-col gap-[2px]">
            <h1 className="text-right text-[20px] leading-[1.5] font-bold text-text-500 md:text-[24px]">
              كل الطلبات المقدمه من العملاء
            </h1>

            <div className="flex items-center justify-end gap-[16px] text-[16px] leading-[1.5]">
              <span className="text-text-200">الطلبات القريبة</span>
              {/* The count follows the filters rather than the frame's fixed
                  24, so the number and the list can never disagree. */}
              <span className="font-bold text-primary-500">
                {visible.length} وظيفة موجودة
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-[24px]">
            <div className="flex items-center gap-[16px]">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-[16px] -translate-y-1/2 text-text-200"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="ابحث عن طلبات بالقرب منك"
                  placeholder="ابحث عن طلبات بالقرب منك..."
                  className="h-[48px] w-full rounded-[16px] border border-primary-100 bg-white pr-[48px] pl-[16px] text-[16px] text-text-500 placeholder-text-200 focus:outline-2 focus:outline-offset-2 focus:outline-primary-500 md:text-[20px]"
                />
              </div>

              {/* Date filtering has nothing behind it yet — the frame draws the
                  control and no screen for it. Disabled rather than wired to
                  nothing, so it does not read as broken. */}
              <button
                type="button"
                disabled
                aria-label="تصفية حسب التاريخ"
                title="تصفية حسب التاريخ — غير متاحة حاليًا"
                className="flex size-[48px] shrink-0 cursor-not-allowed items-center justify-center rounded-[12px] border border-line bg-white text-text-200"
              >
                <CalendarDays size={22} aria-hidden="true" />
              </button>
            </div>

            {visible.length ? (
              <div className="flex flex-col gap-[16px]">
                {visible.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onDetails={openDetails}
                    onOffer={openOffer}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-[12px] bg-white p-[32px] text-center text-[18px] leading-[1.6] text-text-300 shadow-card">
                لا توجد طلبات تطابق هذه التصفية. وسّع نطاق المسافة أو أزل بعض
                التصنيفات.
              </p>
            )}
          </div>
        </div>

        <OrderFilters
          categories={categories}
          onCategoryToggle={toggleCategory}
          urgency={urgency}
          onUrgencyChange={setUrgency}
          distance={distance}
          onDistanceChange={setDistance}
          onRefresh={resetFilters}
        />
      </div>
    </TechnicianLayout>
  )
}

export default TechnicianOrders
