import { Building2, CircleAlert, Star, TrendingUp, TriangleAlert } from 'lucide-react'

const ICONS = {
  growth: TrendingUp,
  quality: Star,
  dues: CircleAlert,
  geography: Building2,
  alert: TriangleAlert,
}

// A note is either an observation or a warning, and the warning has to be
// legible as one at a glance rather than through its wording alone. `neutral`
// carries no colour of its own and is told apart by its border; `highlight` is
// `primary` with the heading picked out too, which is how the profits frame
// draws the note it wants read first.
const TONES = {
  primary: {
    card: 'bg-primary-50',
    badge: 'bg-white text-primary-500',
    title: 'text-text-500',
  },
  highlight: {
    card: 'bg-primary-50',
    badge: 'bg-white text-primary-500',
    title: 'text-primary-500',
  },
  neutral: {
    card: 'border border-line bg-white shadow-card',
    badge: 'bg-card text-text-400',
    title: 'text-text-500',
  },
  error: {
    card: 'bg-error-50',
    badge: 'bg-white text-error-500',
    title: 'text-error-500',
  },
}

/**
 * A set of short notes about the business.
 *
 * The dashboard stacks them in a titled card beside the revenue chart; the
 * profits screen lays the same notes out in a row with nothing over them. Both
 * are this component because the note itself is identical — only the shelf it
 * sits on differs.
 */
function BusinessInsights({ insights, title = 'رؤى الأعمال', layout = 'list' }) {
  const grid = layout === 'grid'

  return (
    <section className={grid ? '' : 'rounded-[12px] border border-line bg-white p-[20px] shadow-card'}>
      {title ? (
        <h2 className="text-[18px] leading-[26px] font-bold text-text-500">{title}</h2>
      ) : null}

      <ul
        className={
          grid
            ? 'grid grid-cols-1 gap-[16px] md:grid-cols-3'
            : `flex flex-col gap-[12px] ${title ? 'mt-[20px]' : ''}`
        }
      >
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
