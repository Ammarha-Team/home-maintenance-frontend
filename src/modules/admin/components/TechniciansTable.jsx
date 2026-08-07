import { Ban, CircleCheck, Eye, Star } from 'lucide-react'

import TablePagination from './TablePagination.jsx'
import { technicianStatusLabel } from '../services/adminService.js'

const HEAD_CLASS = 'px-[16px] py-[14px] text-start text-[14px] font-bold text-text-400'
const CELL_CLASS = 'px-[16px] py-[14px] text-[14px] text-text-400'

const STATUS_CLASS = {
  active: 'bg-success-100 text-success-800',
  suspended: 'bg-error-50 text-error-500',
}

/**
 * The technicians roster.
 *
 * The rows arrive already filtered and already cut to a page — the table draws
 * what it is given and reports which page was asked for, so the filtering and
 * the paging stay together on the screen above.
 */
function TechniciansTable({ rows, page, pageCount, total, from, to, onPageChange }) {
  return (
    <section className="overflow-hidden rounded-[12px] border border-line bg-white shadow-card">
      {/* A ten-column table cannot narrow indefinitely; below the breakpoint it
          scrolls sideways inside the card rather than crushing the columns. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse">
          <thead className="bg-primary-50">
            <tr>
              <th scope="col" className={HEAD_CLASS}>الصورة</th>
              <th scope="col" className={HEAD_CLASS}>الاسم</th>
              <th scope="col" className={HEAD_CLASS}>رقم الهاتف</th>
              <th scope="col" className={HEAD_CLASS}>المدينة</th>
              <th scope="col" className={HEAD_CLASS}>التخصص</th>
              <th scope="col" className={HEAD_CLASS}>الخبرة</th>
              <th scope="col" className={HEAD_CLASS}>التقييم</th>
              <th scope="col" className={HEAD_CLASS}>الطلبات</th>
              <th scope="col" className={HEAD_CLASS}>الحالة</th>
              <th scope="col" className={HEAD_CLASS}>إجراءات</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((technician) => {
              const suspended = technician.status === 'suspended'

              return (
                <tr key={technician.id} className="border-t border-line">
                  <td className={CELL_CLASS}>
                    <span className="relative inline-block">
                      <img
                        src="/technician_avatar.jpg"
                        alt=""
                        className="h-[40px] w-[40px] rounded-full object-cover"
                      />
                      {/* A suspended account is marked on the face itself, so
                          the state survives a reader skimming down the column
                          of photographs rather than the column of pills. */}
                      {suspended ? (
                        <span className="absolute -bottom-[2px] -left-[2px] flex h-[16px] w-[16px] items-center justify-center rounded-full bg-error-500 text-white">
                          <Ban size={10} aria-hidden="true" />
                        </span>
                      ) : null}
                    </span>
                  </td>

                  <td className={CELL_CLASS}>
                    <p className="text-[15px] font-bold text-text-500">{technician.name}</p>
                    <p dir="ltr" className="text-start text-[13px] text-text-200">
                      {technician.email}
                    </p>
                  </td>

                  <td className={CELL_CLASS}>
                    <span dir="ltr">{technician.phone}</span>
                  </td>

                  <td className={CELL_CLASS}>{technician.city}</td>
                  <td className={CELL_CLASS}>{technician.specialty}</td>
                  <td className={CELL_CLASS}>{technician.experienceYears} سنوات</td>

                  <td className={CELL_CLASS}>
                    {/* The star sits to the right of the score, which under RTL
                        means it comes first in the markup. */}
                    <span className="flex items-center gap-[4px]">
                      <Star size={14} aria-hidden="true" className="text-warning-500" />
                      {technician.rating}
                    </span>
                  </td>

                  <td className={CELL_CLASS}>{technician.orders}</td>

                  <td className={CELL_CLASS}>
                    <span
                      className={`inline-block rounded-[8px] px-[12px] py-[6px] text-[13px] font-bold ${STATUS_CLASS[technician.status]}`}
                    >
                      {technicianStatusLabel(technician.status)}
                    </span>
                  </td>

                  <td className={CELL_CLASS}>
                    <span className="flex items-center gap-[8px]">
                      <button
                        type="button"
                        aria-label={`عرض ملف ${technician.name}`}
                        className="rounded-[8px] p-[6px] text-text-300 transition-colors hover:bg-card hover:text-primary-500"
                      >
                        <Eye size={18} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        aria-label={
                          suspended
                            ? `تفعيل حساب ${technician.name}`
                            : `إيقاف حساب ${technician.name}`
                        }
                        className="rounded-[8px] p-[6px] text-text-300 transition-colors hover:bg-card hover:text-primary-500"
                      >
                        {suspended ? (
                          <CircleCheck size={18} aria-hidden="true" />
                        ) : (
                          <Ban size={18} aria-hidden="true" />
                        )}
                      </button>
                    </span>
                  </td>
                </tr>
              )
            })}

            {rows.length === 0 ? (
              <tr className="border-t border-line">
                <td
                  colSpan={10}
                  className="px-[16px] py-[40px] text-center text-[15px] text-text-300"
                >
                  لا يوجد فنيون مطابقون للفلاتر المختارة.
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
        />
      ) : null}
    </section>
  )
}

export default TechniciansTable
