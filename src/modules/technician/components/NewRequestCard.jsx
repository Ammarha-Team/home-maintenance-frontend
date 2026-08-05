import { MapPin } from 'lucide-react'
import Badge from '../../../shared/components/Badge.jsx'
import Button from '../../../shared/components/Button.jsx'

/**
 * One card in the "طلبات جديدة" row (Figma node 21:2116).
 *
 * The frame's urgency chip is red text on a red tint for emergencies and a
 * plain chip otherwise, which is what `Badge`'s danger and neutral tones
 * already draw — so the chip and both buttons come from the shared library
 * rather than being restyled here.
 */
function NewRequestCard({ request, onDetails, onAccept }) {
  const emergency = request.urgency === 'emergency'

  return (
    <article className="flex flex-col gap-[4px] rounded-[16px] border border-line bg-white px-[13px] py-[25px] shadow-card">
      <div className="flex items-center justify-between gap-[8px]">
        <p className="text-[16px] leading-[1.5] text-text-300">{request.age}</p>
        <Badge tone={emergency ? 'danger' : 'neutral'}>
          {emergency ? 'طوارئ' : 'عادي'}
        </Badge>
      </div>

      <h3 className="pt-[8px] text-right text-[20px] leading-[1.5] font-bold text-text-500">
        {request.title}
      </h3>

      <p className="flex items-center justify-end gap-[8px] text-[18px] leading-[1.5] text-text-400 md:text-[20px]">
        {request.district}
        <MapPin size={16} aria-hidden="true" className="shrink-0" />
      </p>

      {/* Widths are set on wrappers, not on the buttons. `Button` always emits
          a width class of its own, and a second one passed through `className`
          wins or loses by stylesheet order rather than by being written last —
          so both buttons run full width inside a box that is sized here. */}
      <div className="flex gap-[8px] pt-[12px]">
        <div className="w-[98px] shrink-0">
          <Button
            size="sm"
            variant="secondary"
            fullWidth
            onClick={() => onDetails(request)}
          >
            تفاصيل
          </Button>
        </div>
        <div className="min-w-0 flex-1">
          <Button size="sm" fullWidth onClick={() => onAccept(request)}>
            قبول
          </Button>
        </div>
      </div>
    </article>
  )
}

export default NewRequestCard
