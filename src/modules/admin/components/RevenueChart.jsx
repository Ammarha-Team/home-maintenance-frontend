import { useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { REVENUE_RANGES, revenueSeries } from '../services/adminService.js'

const AXIS_STYLE = { fill: '#636363', fontSize: 13 }

const AXIS_MAX = 350000
const AXIS_STEP = 50000
const AXIS_TICKS = Array.from({ length: AXIS_MAX / AXIS_STEP + 1 }, (_, step) => step * AXIS_STEP)

/** Axis and tooltip figures carry thousands separators, as the frame prints them. */
const formatMoney = (value) => value.toLocaleString('en-US')

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div
      dir="rtl"
      className="rounded-[8px] border border-line bg-white px-[12px] py-[8px] shadow-card"
    >
      <p className="text-[13px] text-text-300">{label}</p>
      <p className="text-[15px] font-bold text-text-500">
        {formatMoney(payload[0].value)} <span className="font-normal">ج.م</span>
      </p>
    </div>
  )
}

/**
 * Monthly revenue, as an area under a line.
 *
 * The plot runs left to right: the months are a timeline, and the frame draws
 * January at the left even though the card around it is RTL. Flipping the axis
 * to follow the text direction would put the newest month where a reader
 * expects the oldest, so the chart is marked LTR and left alone.
 */
function RevenueChart() {
  const [range, setRange] = useState(REVENUE_RANGES[0].key)
  const data = revenueSeries(range)

  return (
    <section className="rounded-[12px] border border-line bg-white p-[20px] shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] leading-[26px] font-bold text-text-500">
          الإيرادات الشهرية
        </h2>

        <label className="sr-only" htmlFor="revenue-range">
          المدة
        </label>
        <select
          id="revenue-range"
          value={range}
          onChange={(event) => setRange(event.target.value)}
          className="rounded-[8px] border border-line bg-card px-[12px] py-[8px] text-[14px] text-text-400 outline-none focus:border-primary-400"
        >
          {REVENUE_RANGES.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div dir="ltr" className="mt-[20px] h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2a70ea" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#2a70ea" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#e8ebf1" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={AXIS_STYLE}
            />
            {/* The scale is fixed rather than fitted to the data. Left to
                itself the axis picks its own round numbers and the gridlines
                move as the range changes, which makes two readings of the same
                card hard to compare. */}
            <YAxis
              domain={[0, AXIS_MAX]}
              ticks={AXIS_TICKS}
              tickLine={false}
              axisLine={false}
              width={64}
              tick={AXIS_STYLE}
              tickFormatter={formatMoney}
            />
            <Tooltip content={<RevenueTooltip />} cursor={{ stroke: '#bdd3f8' }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2a70ea"
              strokeWidth={2}
              fill="url(#revenueFill)"
              dot={{ r: 4, fill: '#ffffff', stroke: '#2a70ea', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default RevenueChart
