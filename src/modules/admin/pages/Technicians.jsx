import { useMemo, useState } from 'react'

import TechniciansFilters from '../components/TechniciansFilters.jsx'
import TechniciansTable from '../components/TechniciansTable.jsx'
import {
  TECHNICIANS,
  TECHNICIANS_PAGE_SIZE,
  filterTechnicians,
} from '../services/adminService.js'

const NO_FILTERS = { city: '', specialty: '', status: '' }

function Technicians() {
  const [filters, setFilters] = useState(NO_FILTERS)
  const [page, setPage] = useState(1)

  const matches = useMemo(() => filterTechnicians(TECHNICIANS, filters), [filters])

  const pageCount = Math.max(1, Math.ceil(matches.length / TECHNICIANS_PAGE_SIZE))

  // A filter can shorten the list past the page being read, which would
  // otherwise leave the table empty on a page that no longer exists.
  const safePage = Math.min(page, pageCount)
  const start = (safePage - 1) * TECHNICIANS_PAGE_SIZE
  const rows = matches.slice(start, start + TECHNICIANS_PAGE_SIZE)

  const applyFilters = (next) => {
    setFilters(next)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <div>
        <h1 className="text-[32px] leading-[44px] font-bold text-text-500">إدارة الفنيين</h1>
        <p className="mt-[4px] text-[16px] leading-[24px] text-text-300">
          عرض وإدارة حسابات الفنيين وتقييم أدائهم.
        </p>
      </div>

      <TechniciansFilters
        filters={filters}
        onChange={applyFilters}
        onReset={() => applyFilters(NO_FILTERS)}
      />

      <TechniciansTable
        rows={rows}
        page={safePage}
        pageCount={pageCount}
        total={matches.length}
        from={matches.length === 0 ? 0 : start + 1}
        to={start + rows.length}
        onPageChange={setPage}
      />
    </div>
  )
}

export default Technicians
