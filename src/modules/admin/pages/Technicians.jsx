import { useCallback, useMemo, useState } from 'react'

import AdminDataState from '../components/AdminDataState.jsx'
import TechniciansFilters from '../components/TechniciansFilters.jsx'
import TechniciansTable from '../components/TechniciansTable.jsx'
import useAdminResource from '../hooks/useAdminResource.js'
import { activateUser, fetchAllTechnicians, suspendUser } from '../services/adminApi.js'
import { TECHNICIANS_PAGE_SIZE, filterTechnicians } from '../services/adminService.js'
import { useToast } from '../../../shared/toast/toastContext.js'

const NO_FILTERS = { city: '', specialty: '', status: '' }

/**
 * The options a select offers, taken from the rows on hand.
 *
 * The list endpoint accepts `pageNumber` and `pageSize` and nothing else — no
 * city, no profession, no state — so the filtering happens here, over the whole
 * roster. Building the options from that roster too keeps the selects honest: a
 * city nobody works in is not offered, and a profession the backend adds shows
 * up without anyone editing a list of them here.
 */
const optionsFrom = (rows, key) =>
  [...new Set(rows.map((row) => row[key]).filter((value) => value && value !== '—'))].sort()

function Technicians() {
  const [filters, setFilters] = useState(NO_FILTERS)
  const [page, setPage] = useState(1)
  const [busyId, setBusyId] = useState(null)

  const { showToast } = useToast()

  const { data, error, loading, reload } = useAdminResource(fetchAllTechnicians)

  const technicians = useMemo(() => data ?? [], [data])

  const matches = useMemo(
    () => filterTechnicians(technicians, filters),
    [technicians, filters],
  )

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

  /**
   * Suspends or reinstates one account.
   *
   * The endpoints take the *user* id rather than the technician id — two
   * different keys on the same person — so a row that arrived without one says
   * so instead of calling with an id the API would reject.
   *
   * The roster is read back afterwards rather than patched in place: the API
   * owns the account state, and reading it again is what proves the change
   * landed.
   */
  const toggleStatus = useCallback(
    async (technician) => {
      if (!technician.userId) {
        showToast({
          message: 'تعذر تنفيذ الإجراء: لا يوجد معرف حساب لهذا الفني.',
          variant: 'error',
        })
        return
      }

      const suspending = technician.status !== 'suspended'
      setBusyId(technician.id)

      try {
        await (suspending ? suspendUser : activateUser)(technician.userId)

        showToast({
          message: suspending
            ? `تم إيقاف حساب ${technician.name}`
            : `تم تفعيل حساب ${technician.name}`,
        })

        await reload()
      } catch (failure) {
        showToast({
          message: failure.message || 'تعذر تحديث حالة الحساب.',
          variant: 'error',
        })
      } finally {
        setBusyId(null)
      }
    },
    [reload, showToast],
  )

  return (
    <div className="flex flex-col gap-[24px]">
      <div>
        <h1 className="text-[32px] leading-[44px] font-bold text-text-500">إدارة الفنيين</h1>
        <p className="mt-[4px] text-[16px] leading-[24px] text-text-300">
          عرض وإدارة حسابات الفنيين وتقييم أدائهم.
        </p>
      </div>

      {loading || error ? (
        <AdminDataState
          loading={loading}
          error={error}
          onRetry={reload}
          label="جاري تحميل قائمة الفنيين..."
        />
      ) : (
        <>
          <TechniciansFilters
            filters={filters}
            onChange={applyFilters}
            onReset={() => applyFilters(NO_FILTERS)}
            cities={optionsFrom(technicians, 'city')}
            specialties={optionsFrom(technicians, 'specialty')}
          />

          <TechniciansTable
            rows={rows}
            page={safePage}
            pageCount={pageCount}
            total={matches.length}
            from={matches.length === 0 ? 0 : start + 1}
            to={start + rows.length}
            onPageChange={setPage}
            onToggleStatus={toggleStatus}
            busyId={busyId}
          />
        </>
      )}
    </div>
  )
}

export default Technicians
