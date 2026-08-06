import { Check, MapPin, Truck, Wrench } from 'lucide-react'
import { JOB_STAGES, stageStatus } from '../services/technicianService.js'

// One icon per stage, used while the stage is current or still waiting. A stage
// the job is already past shows a tick instead, which is how the frames mark
// what is behind them.
const STAGE_ICONS = {
  accepted: Check,
  enroute: Truck,
  arrived: MapPin,
  completed: Wrench,
}

const TONE = {
  done: {
    marker: 'bg-primary-500 text-white',
    title: 'text-primary-500',
    detail: 'text-text-300',
  },
  current: {
    marker: 'bg-primary-500 text-white',
    title: 'text-primary-500',
    detail: 'text-text-300',
  },
  waiting: {
    marker: 'bg-card text-text-200',
    title: 'text-text-400',
    detail: 'text-text-200',
  },
}

/**
 * The four stages of a job, from acceptance to completion (Figma nodes 22:3431,
 * 22:3542 and 22:3667).
 *
 * Three screens draw this same list; what differs is how far along `current`
 * says the job has got. Passing a key that names no stage — the closing screen
 * does — marks every one of them done.
 *
 * The marker leads each row because in an RTL row the first child is the
 * rightmost, and the frames run the circles down the right edge with the copy
 * to their left.
 */
function JobStageTimeline({ current }) {
  return (
    <ol className="flex flex-col">
      {JOB_STAGES.map((stage, index) => {
        const status = stageStatus(stage.key, current)
        const tone = TONE[status]
        const Icon = status === 'done' ? Check : STAGE_ICONS[stage.key]
        const last = index === JOB_STAGES.length - 1

        return (
          <li key={stage.key} className="flex items-start gap-[16px]">
            {/* The marker and the run of line beneath it are one column, so the
                line always meets the next circle however tall a row grows. */}
            <div className="flex shrink-0 flex-col items-center self-stretch">
              <span
                className={`flex size-[32px] shrink-0 items-center justify-center rounded-full ${tone.marker}`}
              >
                <Icon size={16} aria-hidden="true" />
              </span>

              {!last ? <span aria-hidden="true" className="w-px flex-1 bg-line" /> : null}
            </div>

            <div
              className={`flex min-w-0 flex-col gap-[4px] text-right ${last ? '' : 'pb-[32px]'}`}
            >
              <p className={`text-[20px] leading-[1.5] font-bold ${tone.title}`}>
                {stage.title}
              </p>
              <p className={`text-[16px] leading-[1.5] ${tone.detail}`}>
                {status === 'waiting' ? stage.detail : stage.doneDetail}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default JobStageTimeline
