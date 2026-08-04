import { BadgeCheck, Star } from 'lucide-react'
import Avatar from '../../../shared/components/Avatar.jsx'
import Badge from '../../../shared/components/Badge.jsx'

/**
 * The assigned technician, read-only. Shared by the tracking and rating
 * screens so the person stays presented the same way once chosen — the offer
 * card is a separate component because it carries a price and an action.
 */
function TechnicianSummaryCard({ technician, className = '' }) {
  const { name, title, rating, reviews, verified } = technician

  return (
    <div
      className={`flex items-center gap-[12px] rounded-[14px] border border-line bg-white p-[14px] shadow-card ${className}`}
    >
      <Avatar name={name} size="md" presence="online" />

      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-[8px] gap-y-[4px] text-[15px] leading-[1.5] font-bold text-text-500">
          الفني: {name}
          {verified ? (
            <Badge tone="success" icon={BadgeCheck}>
              موثّق
            </Badge>
          ) : null}
        </p>

        <p className="mt-[2px] text-[13px] leading-[1.6] text-text-300">
          {title}
        </p>
      </div>

      {rating ? (
        <p className="flex shrink-0 items-center gap-[4px] text-[13px] font-bold text-text-400">
          <Star
            size={14}
            aria-hidden="true"
            className="fill-warning-500 text-warning-500"
          />
          {rating}
          {reviews ? (
            <span className="font-normal text-text-300">({reviews}+)</span>
          ) : null}
        </p>
      ) : null}
    </div>
  )
}

export default TechnicianSummaryCard
