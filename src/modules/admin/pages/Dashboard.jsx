import { useMemo } from 'react'
import { Calendar } from 'lucide-react'

import AdminDataState from '../components/AdminDataState.jsx'
import BusinessInsights from '../components/BusinessInsights.jsx'
import DashboardStats from '../components/DashboardStats.jsx'
import RevenueChart from '../components/RevenueChart.jsx'
import useAdminResource from '../hooks/useAdminResource.js'
import { fetchDashboard, toDashboardStats } from '../services/adminApi.js'
import { BUSINESS_INSIGHTS } from '../services/adminService.js'
import { readDisplayName, readSession } from '../../auth/services/authSession.js'

const DATE_FORMAT = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}

const TIME_FORMAT = { hour: 'numeric', minute: '2-digit' }

/**
 * The stamp in the corner of the header. It is read once per render rather than
 * ticking: the frame shows a moment, not a clock, and rerendering the whole
 * dashboard every second would be a poor trade for a live minute hand.
 */
const stampNow = () => {
  const now = new Date()
  return `${now.toLocaleDateString('ar-EG', DATE_FORMAT)} في ${now.toLocaleTimeString('ar-EG', TIME_FORMAT)}`
}

function Dashboard() {
  const { data, error, loading, reload } = useAdminResource(fetchDashboard)

  const stats = useMemo(() => (data ? toDashboardStats(data) : []), [data])

  // The login payload names the signed-in admin, so the greeting says who is
  // actually reading the screen. An account the API sends no name for is
  // greeted without one rather than with someone else's.
  const name = readDisplayName(readSession())

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex flex-wrap items-start justify-between gap-[16px]">
        <div>
          <h1 className="text-[32px] leading-[44px] font-bold text-text-500">
            {name ? `مرحبًا، ${name}` : 'مرحبًا بك'}
          </h1>
          <p className="mt-[4px] text-[16px] leading-[24px] text-text-300">
            إليك ملخص أداء منصة عمّرها اليوم.
          </p>
        </div>

        <p className="flex items-center gap-[10px] rounded-[10px] border border-line bg-white px-[16px] py-[10px] text-[14px] text-text-400 shadow-card">
          <Calendar size={18} aria-hidden="true" className="text-text-300" />
          {stampNow()}
        </p>
      </div>

      {loading || error ? (
        <AdminDataState
          loading={loading}
          error={error}
          onRetry={reload}
          label="جاري تحميل مؤشرات المنصة..."
        />
      ) : (
        <DashboardStats stats={stats} />
      )}

      {/* The notes come first in the markup so RTL draws them against the right
          edge, with the chart taking the wider half beside them. */}
      <div className="grid grid-cols-1 gap-[16px] lg:grid-cols-3">
        <BusinessInsights insights={BUSINESS_INSIGHTS} />
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
