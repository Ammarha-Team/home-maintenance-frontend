import { CircleAlert, Star, TrendingUp } from 'lucide-react'

const ICONS = {
  growth: TrendingUp,
  quality: Star,
  dues: CircleAlert,
}

// A note is either an observation or a warning, and the warning has to be
// legible as one at a glance rather than through its wording alone.
const TONES = {
  primary: {
    card: 'bg-primary-50',
    badge: 'bg-white text-primary-500',
    title: 'text-text-500',
  },
  error: {
    card: 'bg-error-50',
    badge: 'bg-white text-error-500',
    title: 'text-error-500',
  },
}

/** The three notes stacked beside the revenue chart. */
function BusinessInsights({ insights }) {
  return (
    <section className="rounded-[12px] border border-line bg-white p-[20px] shadow-card">
      <h2 className="text-[18px] leading-[26px] font-bold text-text-500">رؤى الأعمال</h2>

      <ul className="mt-[20px] flex flex-col gap-[12px]">
        {insights.map((insight) => {
          const Icon = ICONS[insight.key]
          const tone = TONES[insight.tone]

          return (
            <li
              key={insight.key}
              className={`flex items-start gap-[12px] rounded-[10px] p-[16px] ${tone.card}`}
            >
              <span
                className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] ${tone.badge}`}
              >
                <Icon size={18} aria-hidden="true" />
              </span>

              <div>
                <p className={`text-[15px] leading-[22px] font-bold ${tone.title}`}>
                  {insight.title}
                </p>
                <p className="mt-[4px] text-[14px] leading-[22px] text-text-300">
                  {insight.body}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default BusinessInsights
