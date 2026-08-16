import { FilterX, Search } from 'lucide-react'

import { CUSTOMER_CITIES, CUSTOMER_STATUSES } from '../services/adminService.js'

const CONTROL_CLASS =
  'h-[44px] rounded-[8px] border border-line bg-card px-[16px] text-[14px] text-text-500 outline-none focus:border-primary-400'

/**
 * The bar across the top of the customers card: a search on one side, the two
 * filters and a way to clear them on the other.
 *
 * The search comes first in the markup so RTL draws it against the right edge,
 * which is where the frame puts it, with the filters left at the far side.
 *
 * Both selects carry an "all" option with an empty value, so clearing one is
 * the same operation as never having set it and the table needs no separate
 * notion of an unset filter.
 */
function CustomersToolbar({ filters, onChange, onReset, cities = CUSTOMER_CITIES }) {
  const update = (key) => (event) => onChange({ ...filters, [key]: event.target.value })

  const filtered = Boolean(filters.search || filters.city || filters.status)

  return (
    <div className="flex flex-wrap items-center justify-between gap-[16px] p-[20px]">
      <div className="relative w-full sm:w-[347px]">
        <Search
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[16px] -translate-y-1/2 text-text-200"
        />

        <label htmlFor="customer-search" className="sr-only">
          البحث في العملاء
        </label>

        <input
          id="customer-search"
          type="search"
          value={filters.search}
          onChange={update('search')}
          placeholder="بحث بالاسم ,المدينه......"
          className={`${CONTROL_CLASS} w-full bg-white pr-[46px]`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-[8px]">
        <label htmlFor="customer-status" className="sr-only">
          حالة الحساب
        </label>

        <select
          id="customer-status"
          value={filters.status}
          onChange={update('status')}
          className={CONTROL_CLASS}
        >
          <option value="">حاله الحساب(الكل)</option>
          {CUSTOMER_STATUSES.map((status) => (
            <option key={status.key} value={status.key}>
              {status.label}
            </option>
          ))}
        </select>

        <label htmlFor="customer-city" className="sr-only">
          المدينة
        </label>

        <select
          id="customer-city"
          value={filters.city}
          onChange={update('city')}
          className={CONTROL_CLASS}
        >
          <option value="">جميع المدن</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* The frame draws this square button beside the selects with nothing
            written on it, so the only thing naming it is the label read out
            loud. It is dimmed while there is nothing to clear rather than
            hidden, which would shift the selects sideways as filters come and
            go. */}
        <button
          type="button"
          onClick={onReset}
          disabled={!filtered}
          aria-label="مسح الفلاتر"
          className="flex h-[44px] w-[48px] items-center justify-center rounded-[8px] border border-line text-text-400 transition-colors hover:border-primary-400 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-text-400"
        >
          <FilterX size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default CustomersToolbar
