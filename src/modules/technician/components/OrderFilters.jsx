import { RotateCw, SlidersHorizontal } from 'lucide-react'
import Button from '../../../shared/components/Button.jsx'
import Checkbox from '../../../shared/components/Checkbox.jsx'
import {
  ORDER_CATEGORIES,
  ORDER_URGENCIES,
} from '../services/technicianService.js'

/**
 * The job board's filter rail (Figma node 21:2268).
 *
 * It holds no state. The board owns the filters because the board is what has
 * to apply them, and a panel keeping its own copy would have to be told when
 * the page reset them — so the values and their setters are passed in.
 *
 * The distance control is a native range input: it keeps keyboard and screen
 * reader behaviour for free. `aria-valuetext` restates the value in Arabic with
 * its unit, which a bare number would not carry.
 */
function OrderFilters({
  categories,
  onCategoryToggle,
  urgency,
  onUrgencyChange,
  distance,
  onDistanceChange,
  onRefresh,
}) {
  return (
    <aside className="flex w-full flex-col rounded-[12px] border border-primary-50 bg-white p-[25px] shadow-card lg:w-[320px] lg:shrink-0">
      {/* Heading right, icon left — and in an RTL row that means the heading
          comes first. Every row in this panel is written in the reverse of the
          order the frame reads. */}
      <div className="flex items-center justify-between pb-[24px]">
        <h2 className="text-[20px] leading-[1.5] font-bold text-primary-500">
          تصفية النتائج
        </h2>
        <SlidersHorizontal
          size={18}
          aria-hidden="true"
          className="shrink-0 text-text-300"
        />
      </div>

      <fieldset className="flex flex-col gap-[12px] pb-[40px]">
        <legend className="w-full text-right text-[14px] leading-[1.5] font-bold text-text-400">
          التصنيفات
        </legend>

        {ORDER_CATEGORIES.map((category) => (
          <Checkbox
            key={category}
            label={category}
            checked={categories.includes(category)}
            onChange={() => onCategoryToggle(category)}
            // `Checkbox` writes the label before the box, which puts the box
            // on the left in RTL. The frame has it on the right of the label,
            // so the row is reversed here rather than in the shared component
            // the sign up and terms screens already depend on.
            className="flex-row-reverse justify-end [&_label]:text-[16px] [&_label]:text-text-500"
          />
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-[12px] pb-[40px]">
        <legend className="w-full text-right text-[14px] leading-[1.5] font-bold text-text-400">
          الأولوية
        </legend>

        {/* "الكل" is the rightmost chip in the frame and the default, so it is
            first in the DOM — which in RTL puts it on the right and makes it
            the first one a keyboard reaches. */}
        <div className="flex gap-[6px]">
          {ORDER_URGENCIES.map((option) => {
            const active = urgency === option.key

            return (
              <button
                key={option.key}
                type="button"
                aria-pressed={active}
                onClick={() => onUrgencyChange(option.key)}
                className={`flex-1 cursor-pointer rounded-[12px] border px-[10px] py-[9px] text-[12px] leading-[1.4] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
                  active
                    ? 'border-primary-300 bg-primary-50 text-primary-500'
                    : 'border-text-100 bg-white text-text-300 hover:border-primary-300'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-[11px] pb-[40px]">
        <label
          htmlFor="order-distance"
          className="text-right text-[16px] leading-[1.5] font-bold text-text-400"
        >
          المسافة (كم)
        </label>

        <input
          id="order-distance"
          type="range"
          min={1}
          max={50}
          value={distance}
          aria-valuetext={`${distance} كم`}
          onChange={(event) => onDistanceChange(Number(event.target.value))}
          className="h-[8px] w-full cursor-pointer appearance-none rounded-[8px] bg-primary-100 accent-primary-500"
        />

        {/* The track runs right to left with the page, so the low end sits
            under the right of the slider and the high end under the left —
            reversed from the source order a reader would expect. */}
        <div className="flex items-center justify-between text-[12px] leading-[1.5] text-text-secondary">
          <span>1 كم</span>
          <span>50 كم</span>
        </div>
      </div>

      <Button icon={RotateCw} fullWidth onClick={onRefresh}>
        تحديث النتائج
      </Button>
    </aside>
  )
}

export default OrderFilters
