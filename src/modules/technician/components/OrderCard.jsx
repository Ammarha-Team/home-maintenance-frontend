import { CalendarDays, Images, MapPin } from 'lucide-react'
import Badge from '../../../shared/components/Badge.jsx'
import Button from '../../../shared/components/Button.jsx'

/**
 * One row on the technician job board (Figma node 21:2352).
 *
 * Not the dashboard's `NewRequestCard`: that one is a compact tile in a
 * three-up grid, this is a wide row carrying a photo, the customer's own
 * description and a meta strip. They read the same record and draw different
 * frames, so they stay separate components.
 *
 * A note on child order throughout this file. The page is `dir="rtl"`, so the
 * first child of a row is the one furthest right, while the frame is measured
 * left to right. Every row below is therefore written in the reverse of how the
 * design reads: photo before content (photo x=686, content x=0), chips before
 * the timestamp (chips x=605, timestamp x=0), and the primary button before the
 * secondary (primary x=263.5, secondary x=3.5).
 *
 * The photo is decorative — everything it shows is written beside it — so it
 * carries an empty alt, and it is dropped below `md` where the row has no width
 * to spare for it.
 */
function OrderCard({ order, onDetails, onOffer }) {
  const emergency = order.urgency === 'emergency'

  return (
    <article className="flex flex-col gap-[16px] rounded-[12px] bg-white p-[25px] shadow-card md:flex-row md:items-start">
      {order.photo ? (
        <img
          src={order.photo}
          alt=""
          className="hidden size-[192px] shrink-0 rounded-[8px] object-cover md:block"
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
        <div className="flex items-center justify-between gap-[12px]">
          <div className="flex items-center gap-[12px]">
            <Badge tone="primary">{order.category}</Badge>
            <Badge tone={emergency ? 'danger' : 'neutral'}>
              {emergency ? 'عاجل جداً' : 'عادي'}
            </Badge>
          </div>

          <p className="text-[16px] leading-[1.5] text-text-secondary">
            {order.age}
          </p>
        </div>

        <h3 className="pt-[8px] text-right text-[20px] leading-[1.5] font-bold text-text-500">
          {order.title}
        </h3>

        {/* Two lines then an ellipsis, the way the frame truncates a summary
            that would otherwise push the row taller than its photo. */}
        <p className="line-clamp-2 text-right text-[18px] leading-[1.6] text-text-secondary md:text-[20px]">
          {order.summary}
        </p>

        {/* Distance sits at the right of the strip and the attachment count at
            the left, matching the frame. The icons all lead their label, which
            is what the dashboard card already does — the frame puts the pin
            after its label and the gallery icon before its own, and one
            consistent side reads better than reproducing that. */}
        <div className="flex flex-wrap items-center gap-x-[24px] gap-y-[8px] pt-[20px] text-[14px] leading-[1.5] font-bold text-text-300">
          {/* The distance is the technician's own and the request does not
              carry one, so it is drawn beside the district only when there is
              one — rather than as an empty pair of brackets. */}
          {order.district ? (
            <span className="flex items-center gap-[4px]">
              {order.distance
                ? `${order.district} (${order.distance})`
                : order.district}
              <MapPin size={15} aria-hidden="true" className="shrink-0" />
            </span>
          ) : null}

          {order.schedule ? (
            <span className="flex items-center gap-[4px]">
              {order.schedule}
              <CalendarDays size={15} aria-hidden="true" className="shrink-0" />
            </span>
          ) : null}

          <span className="flex items-center gap-[4px]">
            {order.attachmentLabel}
            <Images size={15} aria-hidden="true" className="shrink-0" />
          </span>
        </div>

        {/* Widths sit on the wrappers, not the buttons: `Button` emits a width
            class of its own, and a second one passed through `className` would
            win or lose by stylesheet order rather than by being written last. */}
        <div className="flex flex-col gap-[16px] pt-[20px] sm:flex-row">
          <div className="min-w-0 flex-1">
            <Button fullWidth onClick={() => onOffer(order)}>
              تقديم عرض
            </Button>
          </div>
          <div className="sm:w-[244px] sm:shrink-0">
            <Button variant="outline" fullWidth onClick={() => onDetails(order)}>
              عرض التفاصيل
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default OrderCard
