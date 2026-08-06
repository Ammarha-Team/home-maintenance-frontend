import Badge from '../../../shared/components/Badge.jsx'

/**
 * The job's reference, its current status and what the customer asked for
 * (Figma nodes 22:3431 and 22:3542).
 *
 * Both stages of the job open with this same block; only the chip changes, so
 * its tone and label are passed in rather than worked out from the stage here.
 *
 * The reference leads the row so it sits at the right and the chip at the left,
 * as the frames draw them.
 */
function JobBrief({ reference, statusLabel, statusTone, title, summary }) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex items-center justify-between gap-[16px]">
        <p className="text-[20px] leading-[1.5] text-text-400 md:text-[24px]">
          {`رقم المهمة ${reference}`}
        </p>

        <Badge tone={statusTone} className="text-[14px]">
          {statusLabel}
        </Badge>
      </div>

      <div className="flex flex-col gap-[8px] rounded-[12px] border border-line bg-white p-[25px] text-right">
        <h1 className="text-[20px] leading-[1.5] font-bold text-text-500 md:text-[24px]">
          {title}
        </h1>
        <p className="text-[16px] leading-[1.5] text-text-300 md:text-[20px]">
          {summary}
        </p>
      </div>
    </div>
  )
}

export default JobBrief
