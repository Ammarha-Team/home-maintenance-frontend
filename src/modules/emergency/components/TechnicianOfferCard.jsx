import { BadgeCheck, Clock, Star } from 'lucide-react'
import Avatar from '../../../shared/components/Avatar.jsx'
import Badge from '../../../shared/components/Badge.jsx'
import Button from '../../../shared/components/Button.jsx'

/**
 * One available technician, with the accept action.
 *
 * The frame labelled the action "قبول الطلب" — accepting a request — which is
 * what the technician does, not the customer. From the customer's side this is
 * choosing a technician, so the label says that.
 *
 * The card is a plain <article>, not a clickable surface: only the button acts,
 * which keeps one unambiguous target instead of a card-wide hit area competing
 * with the button inside it.
 */
function TechnicianOfferCard({ technician, onSelect, busy, index = 0 }) {
  const {
    name,
    title,
    experience,
    rating,
    reviews,
    jobs,
    comments,
    price,
    etaMinutes,
    distanceKm,
    verified,
  } = technician

  return (
    <article
      className="emergency-item-enter flex h-full flex-col gap-[14px] rounded-[14px] border border-line bg-white p-[14px] shadow-card md:p-[16px]"
      // Offers land one after another rather than all at once.
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex items-start gap-[12px]">
        <Avatar name={name} size="md" presence="online" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[4px]">
            <h4 className="text-[15px] leading-[1.5] font-bold text-text-500 md:text-[16px]">
              {name}
            </h4>
            <span className="text-[12px] text-text-300">{experience}</span>
          </div>

          <p className="mt-[2px] text-[13px] leading-[1.6] text-text-300">
            {title}
          </p>

          <p className="mt-[6px] flex items-center gap-[4px] text-[13px] font-bold text-text-400">
            <Star
              size={14}
              aria-hidden="true"
              className="fill-warning-500 text-warning-500"
            />
            {rating}
            <span className="font-normal text-text-300">({reviews}+ تقييم)</span>
          </p>
        </div>

        {verified ? (
          <Badge tone="success" icon={BadgeCheck}>
            موثّق
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-[6px]">
        <Badge tone="neutral">{jobs}</Badge>
        <Badge tone="neutral">{comments}</Badge>
      </div>

      <p className="flex items-center gap-[6px] text-[13px] leading-[1.6] text-text-400">
        <Clock size={14} aria-hidden="true" className="text-primary-600" />
        يصل خلال {etaMinutes} دقيقة
        <span className="text-text-300">({distanceKm} كم)</span>
      </p>

      {/* Price and action share the base of the card so every offer lines up
          regardless of how long the name or title wrapped. */}
      <div className="mt-auto flex flex-col gap-[10px] border-t border-line pt-[12px]">
        <p className="flex items-baseline justify-between gap-2">
          <span className="text-[12px] text-text-300">السعر</span>
          <span className="text-[18px] leading-[1.4] font-bold text-text-500">
            {price} ر.س
          </span>
        </p>

        <Button
          variant="success"
          size="sm"
          fullWidth
          disabled={busy}
          onClick={() => onSelect(technician)}
        >
          {busy ? 'جارٍ الإرسال…' : `اختيار ${name}`}
        </Button>
      </div>
    </article>
  )
}

export default TechnicianOfferCard
