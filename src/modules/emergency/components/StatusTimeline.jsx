import { Check, Truck, Wrench } from 'lucide-react'
import { REQUEST_STAGES } from '../constants/emergency.js'

const ICONS = { received: Check, enroute: Truck, completed: Wrench }

/**
 * Request progress as an ordered list.
 *
 * It is a real <ol> with `aria-current="step"` on the active item, so order and
 * position are conveyed structurally rather than by the rail graphic alone.
 * Each state also carries a word — مكتملة / جارية / لم تبدأ — because colour is
 * otherwise the only thing separating them.
 */
function StatusTimeline({ currentStage }) {
  const activeIndex = REQUEST_STAGES.findIndex(
    (stage) => stage.key === currentStage,
  )

  return (
    <ol className="flex flex-col">
      {REQUEST_STAGES.map((stage, index) => {
        const done = index < activeIndex
        const active = index === activeIndex
        const Icon = ICONS[stage.key]
        const state = done ? 'مكتملة' : active ? 'جارية' : 'لم تبدأ'
        const isLast = index === REQUEST_STAGES.length - 1

        return (
          <li
            key={stage.key}
            aria-current={active ? 'step' : undefined}
            className="flex gap-[12px]"
          >
            {/* Marker column: the dot plus the rail joining it to the next
                step. The last item renders no rail. */}
            <div className="flex flex-col items-center">
              <span
                aria-hidden="true"
                className={`grid size-9 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                  done
                    ? 'border-success-800 bg-success-800 text-white'
                    : active
                      ? 'emergency-pulse border-primary-500 bg-primary-500 text-white'
                      : 'border-line bg-white text-text-200'
                }`}
              >
                <Icon size={16} />
              </span>

              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={`w-[2px] flex-1 ${done ? 'bg-success-800' : 'bg-line'}`}
                />
              ) : null}
            </div>

            <div className={isLast ? '' : 'pb-[22px]'}>
              <p
                className={`text-[14px] leading-[1.5] font-bold ${
                  active
                    ? 'text-primary-700'
                    : done
                      ? 'text-success-800'
                      : 'text-text-300'
                }`}
              >
                {stage.title}
                <span className="sr-only"> — {state}</span>
              </p>
              <p className="mt-[2px] text-[12px] leading-[1.6] text-text-300">
                {stage.detail}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default StatusTimeline
