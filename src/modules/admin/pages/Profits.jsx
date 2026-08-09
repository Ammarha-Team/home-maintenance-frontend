import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'

import BusinessInsights from '../components/BusinessInsights.jsx'
import ProfitMetrics from '../components/ProfitMetrics.jsx'
import ProfitPeriodTabs from '../components/ProfitPeriodTabs.jsx'
import ProfitSummary from '../components/ProfitSummary.jsx'
import {
  PROFIT_INSIGHTS,
  PROFIT_PERIODS,
  PROFIT_SUMMARY,
  profitMetrics,
} from '../services/adminService.js'

const EXPORT_HEADERS = ['البند', 'القيمة (ج.م)', 'التغير']

/**
 * Writes the tiles for the selected period out as a spreadsheet.
 *
 * The byte order mark is what makes Excel read the file as UTF-8; without it
 * every Arabic column opens as mojibake.
 */
const exportMetrics = (metrics, periodLabel) => {
  const csv = [EXPORT_HEADERS, ...metrics.map((metric) => [metric.label, metric.value, metric.delta])]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n')

  const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' }))
  const link = document.createElement('a')

  link.href = url
  link.download = `profits-${periodLabel}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function Profits() {
  const [period, setPeriod] = useState('month')

  const metrics = useMemo(() => profitMetrics(period), [period])

  const periodLabel = PROFIT_PERIODS.find((item) => item.key === period)?.label ?? ''

  return (
    <div className="flex flex-col gap-[24px]">
      {/* The frame opens straight onto the cards with no heading over them. One
          is kept for the screen reader so the page still announces what it is
          when it loads. */}
      <h1 className="sr-only">الأرباح</h1>

      <ProfitSummary items={PROFIT_SUMMARY} />

      {/* The same notes the dashboard stacks beside its chart, laid out in a
          row here and with nothing written above them. */}
      <BusinessInsights insights={PROFIT_INSIGHTS} title={null} layout="grid" />

      {/* The frame gathers the tabs and the export button together at the far
          end of the row rather than pushing them apart, so the two controls
          read as one group. */}
      <div className="flex flex-wrap items-center justify-end gap-[16px]">
        <ProfitPeriodTabs periods={PROFIT_PERIODS} value={period} onChange={setPeriod} />

        {/* What is exported is the period being read, not all five. */}
        <button
          type="button"
          onClick={() => exportMetrics(metrics, periodLabel)}
          className="flex h-[50px] items-center gap-[8px] rounded-[10px] border border-line bg-white px-[20px] text-[14px] text-text-400 shadow-card transition-colors hover:border-primary-400 hover:text-primary-500"
        >
          تصدير
          <Download size={16} aria-hidden="true" />
        </button>
      </div>

      <ProfitMetrics metrics={metrics} period={period} />
    </div>
  )
}

export default Profits
