import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'

import CustomersTable from '../components/CustomersTable.jsx'
import CustomersToolbar from '../components/CustomersToolbar.jsx'
import {
  CUSTOMERS,
  CUSTOMERS_PAGE_SIZE,
  customerStatusLabel,
  filterCustomers,
} from '../services/adminService.js'

const NO_FILTERS = { search: '', city: '', status: '' }

const EXPORT_HEADERS = [
  'العميل',
  'رقم العميل',
  'الهاتف',
  'البريد الإلكتروني',
  'المدينة',
  'الطلبات',
  'الحالة',
]

/**
 * Writes the rows currently on screen out as a spreadsheet.
 *
 * The byte order mark is what makes Excel read the file as UTF-8; without it
 * every Arabic column opens as mojibake.
 */
const exportCustomers = (customers) => {
  const rows = customers.map((customer) => [
    customer.name,
    customer.id,
    customer.phone,
    customer.email,
    customer.city,
    customer.orders,
    customerStatusLabel(customer.status),
  ])

  const csv = [EXPORT_HEADERS, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n')

  const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' }))
  const link = document.createElement('a')

  link.href = url
  link.download = 'customers.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function Customers() {
  const [filters, setFilters] = useState(NO_FILTERS)
  const [page, setPage] = useState(1)

  const matches = useMemo(() => filterCustomers(CUSTOMERS, filters), [filters])

  const pageCount = Math.max(1, Math.ceil(matches.length / CUSTOMERS_PAGE_SIZE))

  // A filter can shorten the list past the page being read, which would
  // otherwise leave the table empty on a page that no longer exists.
  const safePage = Math.min(page, pageCount)
  const start = (safePage - 1) * CUSTOMERS_PAGE_SIZE
  const rows = matches.slice(start, start + CUSTOMERS_PAGE_SIZE)

  const applyFilters = (next) => {
    setFilters(next)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-[24px]">
      {/* The heading comes first in the markup so RTL draws it against the
          right edge, leaving the export button at the far side as the frame
          has it. */}
      <div className="flex flex-wrap items-start justify-between gap-[16px]">
        <div>
          <h1 className="text-[29px] leading-[44px] font-bold text-text-500">إدارة العملاء</h1>
          <p className="mt-[4px] text-[16px] leading-[24px] text-text-400">
            عرض وإدارة بيانات العملاء المسجلين في النظام.
          </p>
        </div>

        {/* What is exported is what is on screen: the filtered list rather than
            the whole roster, so the file matches the table being read. */}
        <button
          type="button"
          onClick={() => exportCustomers(matches)}
          className="flex h-[46px] items-center gap-[8px] rounded-[8px] border border-primary-500 bg-white px-[17px] text-[13px] font-bold text-primary-500 shadow-card transition-colors hover:bg-primary-50"
        >
          تصدير البيانات
          <Download size={14} aria-hidden="true" />
        </button>
      </div>

      <section className="overflow-hidden rounded-[12px] border border-line bg-white shadow-card">
        <CustomersToolbar
          filters={filters}
          onChange={applyFilters}
          onReset={() => applyFilters(NO_FILTERS)}
        />

        <CustomersTable
          rows={rows}
          page={safePage}
          pageCount={pageCount}
          total={matches.length}
          from={matches.length === 0 ? 0 : start + 1}
          to={start + rows.length}
          onPageChange={setPage}
        />
      </section>
    </div>
  )
}

export default Customers
