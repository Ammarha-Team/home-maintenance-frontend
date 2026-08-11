import { ChevronLeft } from 'lucide-react'

/**
 * One row of "مهام اليوم المجدوله" (Figma node 21:2178).
 *
 * Drawn as a card with a chevron; rendered as a button so the whole row is the
 * target rather than the 7px arrow the frame shows. The chevron points left —
 * forward in RTL.
 */
function ScheduledJobRow({ job, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(job)}
      className="flex w-full items-center gap-[16px] rounded-[16px] border border-[rgba(194,198,214,0.2)] bg-white p-[17px] text-right transition-colors hover:border-primary-100 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    >
      <ChevronLeft
        size={18}
        aria-hidden="true"
        className="shrink-0 text-text-300"
      />

      <span className="flex min-w-0 flex-1 flex-col gap-[4px]">
        <span className="text-[20px] leading-[1.5] font-bold text-text-400 md:text-[24px]">
          {job.title}
        </span>
        <span className="text-[16px] leading-[1.5] text-text-300 md:text-[20px]">
          {job.time} • {job.customer}
        </span>
      </span>
    </button>
  )
}

export default ScheduledJobRow
