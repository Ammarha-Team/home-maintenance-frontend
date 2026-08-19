import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Loader2, Search } from 'lucide-react'
import TechnicianLayout from '../../../shared/layouts/TechnicianLayout.jsx'
import OrderCard from '../components/OrderCard.jsx'
import OrderFilters from '../components/OrderFilters.jsx'
import {
  TECHNICIAN_ROUTES,
  technicianOrderPath,
} from '../constants/technicianRoutes.js'
import { useAvailableServiceRequests } from '../hooks/useAvailableServiceRequests.js'

// The filter rail and the API spell the same categories slightly differently —
// "سباكه" against "سباكة" — so both sides are folded to one form before they
// are compared. Nothing else in the app depends on the spelling.
const foldArabic = (text) =>
  String(text ?? '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

// How long ago the customer filed it, in the same shape the frame writes.
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

// "2026-09-05" read as the day it names. `Date` would take it as UTC midnight
// and give back the day before east of Greenwich.
const formatDay = (value) => {
  if (!value) return ''

  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number)
  if (!year || !month || !day) return ''

  return new Date(year, month - 1, day).toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
  })
}

// The board's card was drawn against the mock records, and the API answers with
// a smaller set of facts. Everything it does send is mapped onto the same
// names; what it does not — a distance from the technician — is left null, and
// the card omits what it is not given.
//
// `urgency` is 'normal' for every record here and that is not a placeholder:
// this endpoint returns normal service requests, and emergencies travel through
// their own flow entirely.
const toBoardOrder = (request) => ({
  id: request.id,
  category: request.categoryLabel,
  urgency: 'normal',
  age: relativeAge(request.createdAt),
  title: `خدمة ${request.categoryLabel}`,
  summary: request.problemDescription,
  district: request.city,
  distance: null,
  schedule: request.preferredDate
    ? `الموعد المفضل ${formatDay(request.preferredDate)}`
    : null,
  attachmentLabel: request.thumbnailImage ? 'صورة مرفقة' : 'لا توجد صور',
  photo: request.thumbnailImage,
})

/**
 * Technician Orders — the job board (Figma node 21:2236).
 *
 * A filter rail on the left in RTL and the customer requests on the right.
 * Below `lg` the rail moves above the list: a filter that has scrolled off the
 * top of a phone is a filter nobody uses.
 *
 * The requests are the live ones from GET /api/service-requests/available.
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

  const { requests, loading, error, reload } = useAvailableServiceRequests()

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
    reload()
  }

  // An empty category list means "nothing chosen", which reads as all of them —
  // the board starts unfiltered.
  //
  // The distance slider has nothing to filter on: the API sends no distance
  // from the technician, so no request is excluded by it. The control stays
  // because the record may grow one, and removing it would change a screen the
  // design owns.
  const visible = useMemo(() => {
    const term = foldArabic(query.trim())
    const chosen = categories.map(foldArabic)

    return requests.map(toBoardOrder).filter((order) => {
      if (chosen.length && !chosen.includes(foldArabic(order.category))) {
        return false
      }

      if (urgency !== 'all' && order.urgency !== urgency) return false

      const haystack = foldArabic(
        `${order.title} ${order.summary} ${order.district ?? ''}`,
      )
      if (term && !haystack.includes(term)) return false

      return true
    })
  }, [requests, categories, urgency, query])

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

            {loading ? (
              <p className="flex items-center justify-center gap-[8px] rounded-[12px] bg-white p-[32px] text-center text-[18px] leading-[1.6] text-text-300 shadow-card">
                <Loader2 size={20} aria-hidden="true" className="animate-spin" />
                جارٍ تحميل الطلبات المتاحة...
              </p>
            ) : error ? (
              <div className="flex flex-col items-center gap-[16px] rounded-[12px] bg-white p-[32px] text-center shadow-card">
                <p className="text-[18px] leading-[1.6] text-text-400">{error}</p>

                <button
                  type="button"
                  onClick={reload}
                  className="cursor-pointer rounded-[12px] bg-primary-500 px-[24px] py-[10px] text-[16px] font-bold text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : visible.length ? (
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
                {requests.length
                  ? 'لا توجد طلبات تطابق هذه التصفية. وسّع نطاق البحث أو أزل بعض التصنيفات.'
                  : 'لا توجد طلبات متاحة الآن.'}
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
