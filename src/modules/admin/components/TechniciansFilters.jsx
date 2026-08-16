import { FilterX } from 'lucide-react'

import {
  TECHNICIAN_CITIES,
  TECHNICIAN_SPECIALTIES,
  TECHNICIAN_STATUSES,
} from '../services/adminService.js'

const FIELD_CLASS =
  'h-[48px] w-full rounded-[10px] border border-line bg-card px-[14px] text-[15px] text-text-400 outline-none focus:border-primary-400'

/**
 * The three filters above the technicians table.
 *
 * Every filter carries an "all" option with an empty value, so clearing one is
 * the same operation as never having set it and the table needs no separate
 * notion of an unset filter.
 *
 * The cities and the professions are handed in by the screen, which reads them
 * off the roster the API returned — offering a city no technician works in is a
 * filter that can only ever empty the table. The written-down lists stay as the
 * fallback for a caller with nothing to hand.
 */
function TechniciansFilters({
  filters,
  onChange,
  onReset,
  cities = TECHNICIAN_CITIES,
  specialties = TECHNICIAN_SPECIALTIES,
}) {
  const update = (key) => (event) => onChange({ ...filters, [key]: event.target.value })

  return (
    <section className="rounded-[12px] border border-line bg-white p-[20px] shadow-card">
      <div className="grid grid-cols-1 items-end gap-[16px] md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label htmlFor="filter-city" className="mb-[8px] block text-[15px] text-text-400">
            المدينة
          </label>
          <select
            id="filter-city"
            value={filters.city}
            onChange={update('city')}
            className={FIELD_CLASS}
          >
            <option value="">الكل</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-specialty" className="mb-[8px] block text-[15px] text-text-400">
            التخصص
          </label>
          <select
            id="filter-specialty"
            value={filters.specialty}
            onChange={update('specialty')}
            className={FIELD_CLASS}
          >
            <option value="">الكل</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-status" className="mb-[8px] block text-[15px] text-text-400">
            الحالة
          </label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={update('status')}
            className={FIELD_CLASS}
          >
            <option value="">الكل</option>
            {TECHNICIAN_STATUSES.map((status) => (
              <option key={status.key} value={status.key}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex h-[48px] w-full items-center justify-center gap-[8px] rounded-[10px] bg-error-50 px-[20px] text-[15px] font-bold text-error-500 transition-colors hover:bg-error-100 xl:w-fit"
        >
          <FilterX size={18} aria-hidden="true" />
          مسح الفلاتر
        </button>
      </div>
    </section>
  )
}

export default TechniciansFilters
