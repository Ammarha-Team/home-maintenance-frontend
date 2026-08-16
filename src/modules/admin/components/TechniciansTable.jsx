import { Ban, CircleCheck, Eye, LoaderCircle, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import TablePagination from './TablePagination.jsx'
import { technicianStatusLabel } from '../services/adminService.js'

const HEAD_CLASS = 'px-[16px] py-[14px] text-start text-[14px] font-bold text-text-400'
const CELL_CLASS = 'px-[16px] py-[14px] text-[14px] text-text-400'

const STATUS_CLASS = {
  active: 'bg-success-100 text-success-800',
  suspended: 'bg-error-50 text-error-500',
}

// A state the API introduces that this table has no colour for is drawn in a
// neutral pill rather than failing the row on a missing lookup.
const NEUTRAL_STATUS_CLASS = 'bg-card text-text-400'

/**
 * The technicians roster.
 *
 * The rows arrive already filtered and already cut to a page — the table draws
 * what it is given and reports which page was asked for, so the filtering and
 * the paging stay together on the screen above.
 *
 * Suspending an account is the screen's business too: this reports which row
 * was pressed and `busyId` says which one is mid-flight, so the button that was
 * pressed is the one that goes quiet rather than the whole table.
 */
function TechniciansTable({
  rows,
  page,
  pageCount,
  total,
  from,
  to,
  onPageChange,
  onToggleStatus,
  busyId = null,
}) {
  const navigate = useNavigate()
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
                <tr
  key={technician.id}
  onClick={() => navigate(`/admin/technicians/${technician.id}`)}
  className="cursor-pointer border-t border-line transition-colors hover:bg-primary-50">
                  <td className={CELL_CLASS}>
                    <span className="relative inline-block">
                      <img
                        src={technician.avatar || '/technician_avatar.jpg'}
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
                      className={`inline-block rounded-[8px] px-[12px] py-[6px] text-[13px] font-bold ${
                        STATUS_CLASS[technician.status] ?? NEUTRAL_STATUS_CLASS
                      }`}
                    >
                      {technicianStatusLabel(technician.status)}
                    </span>
                  </td>

                  <td className={CELL_CLASS}>
                    <span className="flex items-center gap-[8px]">
                   <button
  type="button"
  aria-label={`عرض ملف ${technician.name}`}
  onClick={(event) => {
    event.stopPropagation()
    navigate(`/admin/technicians/${technician.id}`)
  }}
  className="rounded-[8px] p-[6px] text-text-300 transition-colors hover:bg-card hover:text-primary-500"
>
  <Eye size={18} aria-hidden="true" />
</button>
                      {/* The row itself opens the technician, so this has to
                          stop the click travelling upwards or suspending an
                          account would navigate away from the table that is
                          about to redraw. */}
                      <button
                        type="button"
                        disabled={!onToggleStatus || busyId === technician.id}
                        onClick={(event) => {
                          event.stopPropagation()
                          onToggleStatus?.(technician)
                        }}
                        aria-label={
                          suspended
                            ? `تفعيل حساب ${technician.name}`
                            : `إيقاف حساب ${technician.name}`
                        }
                        className="rounded-[8px] p-[6px] text-text-300 transition-colors hover:bg-card hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {busyId === technician.id ? (
                          <LoaderCircle size={18} aria-hidden="true" className="animate-spin" />
                        ) : suspended ? (
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
