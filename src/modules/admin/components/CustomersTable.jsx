import { Mail, Phone } from 'lucide-react'

import TablePagination from './TablePagination.jsx'
import { customerStatusLabel } from '../services/adminService.js'

const HEAD_CLASS = 'px-[16px] py-[14px] text-start text-[14px] font-bold text-text-400'
const CELL_CLASS = 'px-[16px] py-[14px] text-[14px] text-text-400'

// The pill and the dot inside it carry the same colour, so the two are
// described together rather than looked up twice.
const STATUS_CLASS = {
  active: { pill: 'bg-success-100 text-success-800', dot: 'bg-success-800' },
  banned: { pill: 'bg-error-50 text-error-500', dot: 'bg-error-500' },
}

// A state the API introduces that this table has no colour for is drawn in a
// neutral pill rather than failing the row on a missing lookup.
const NEUTRAL_STATUS = { pill: 'bg-card text-text-400', dot: 'bg-text-300' }

/**
 * The customers roster.
 *
 * The rows arrive already filtered and already cut to a page — the table draws
 * what it is given and reports which page was asked for, so the filtering and
 * the paging stay together on the screen above.
 */
function CustomersTable({ rows, page, pageCount, total, from, to, onPageChange }) {
  return (
    <>
      {/* Five columns of names, addresses and phone numbers cannot narrow
          indefinitely; below the breakpoint the table scrolls sideways inside
          the card rather than crushing the columns. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead className="bg-primary-50">
            <tr>
              <th scope="col" className={HEAD_CLASS}>العميل</th>
              <th scope="col" className={HEAD_CLASS}>التواصل</th>
              <th scope="col" className={HEAD_CLASS}>المدينة</th>
              <th scope="col" className={HEAD_CLASS}>الطلبات</th>
              <th scope="col" className={HEAD_CLASS}>الحالة</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((customer) => {
              const status = STATUS_CLASS[customer.status] ?? NEUTRAL_STATUS

              return (
                <tr key={customer.id} className="border-t border-line">
                  <td className={CELL_CLASS}>
                    <span className="flex items-center gap-[12px]">
                      {/* Not every customer has uploaded a photograph, and the
                          frame falls back to the first letter of the name
                          rather than to a silhouette. */}
                      {customer.avatar ? (
                        <img
                          src={customer.avatar}
                          alt=""
                          className="h-[40px] w-[40px] shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-primary-100 text-[14px] text-primary-700"
                        >
                          {(customer.name ?? '').charAt(0)}
                        </span>
                      )}

                      <span>
                        <span className="block text-[15px] font-bold text-text-400">
                          {customer.name}
                        </span>
                        <span dir="ltr" className="block text-start text-[13px] text-text-300">
                          ID: #{customer.id}
                        </span>
                      </span>
                    </span>
                  </td>

                  <td className={CELL_CLASS}>
                    {/* Each line reads icon first, then value, while the value
                        itself is a latin run that has to be marked as one or it
                        drifts to the wrong end of the line. */}
                    <span className="flex flex-col gap-[4px]">
                      <span className="flex items-center gap-[6px]">
                        <Phone size={12} aria-hidden="true" className="shrink-0 text-text-300" />
                        <span dir="ltr">{customer.phone}</span>
                      </span>

                      <span className="flex items-center gap-[6px]">
                        <Mail size={12} aria-hidden="true" className="shrink-0 text-text-300" />
                        <span dir="ltr">{customer.email}</span>
                      </span>
                    </span>
                  </td>

                  <td className={CELL_CLASS}>{customer.city}</td>

                  <td className={CELL_CLASS}>
                    <span className="text-[18px] font-bold text-text-500">{customer.orders}</span>
                    <span className="mr-[6px] text-[14px] text-text-400">طلب</span>
                  </td>

                  <td className={CELL_CLASS}>
                    <span
                      className={`inline-flex items-center gap-[6px] rounded-full px-[12px] py-[6px] text-[13px] font-bold ${status.pill}`}
                    >
                      {customerStatusLabel(customer.status)}
                      <span
                        aria-hidden="true"
                        className={`h-[6px] w-[6px] rounded-full ${status.dot}`}
                      />
                    </span>
                  </td>
                </tr>
              )
            })}

            {rows.length === 0 ? (
              <tr className="border-t border-line">
                <td
                  colSpan={5}
                  className="px-[16px] py-[40px] text-center text-[15px] text-text-300"
                >
                  لا يوجد عملاء مطابقون للبحث أو الفلاتر المختارة.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {pageCount > 1 ? (
        <TablePagination
          page={page}
          pageCount={pageCount}
          total={total}
          from={from}
          to={to}
          onChange={onPageChange}
          noun="عميل"
        />
      ) : null}
    </>
  )
}

export default CustomersTable
