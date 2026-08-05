import { useId, useState } from 'react'
import { Star } from 'lucide-react'

const LABELS = ['سيئ', 'مقبول', 'جيد', 'جيد جداً', 'ممتاز']

/**
 * Star rating input.
 *
 * Built on real radio inputs inside a fieldset, so arrow keys, form submission
 * and screen-reader announcements all come from the platform. The frame drew a
 * single unselected state with no hover, focus or selected treatment; all four
 * exist here.
 *
 * Each star's hit area is 44px even though the glyph is smaller — five 26px
 * targets in a row is the classic mis-tap on a phone.
 */
function RatingStars({ value, onChange, name }) {
  const generatedName = useId()
  const groupName = name ?? generatedName
  const [hovered, setHovered] = useState(0)

  // Hover previews a value without committing it, so the fill follows the
  // pointer while the announced state stays whatever is actually selected.
  const shown = hovered || value

  return (
    <fieldset className="border-0 p-0">
      <legend className="sr-only">تقييم الفني من 1 إلى 5</legend>

      {/* No row-reverse: inside the RTL page the row already runs right to
          left, so star 1 is the rightmost. Reversing it put the low scores on
          the left while the browser kept mirroring the arrow keys for RTL, so
          ArrowRight lowered the rating. */}
      <div
        className="flex justify-center gap-[2px]"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((score) => {
          const filled = score <= shown

          return (
            <label
              key={score}
              onMouseEnter={() => setHovered(score)}
              className="grid size-11 cursor-pointer place-items-center rounded-full transition-colors hover:bg-primary-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary-500"
            >
              <input
                type="radio"
                name={groupName}
                value={score}
                checked={value === score}
                onChange={() => onChange(score)}
                className="sr-only"
              />
              <span className="sr-only">
                {score} من 5 — {LABELS[score - 1]}
              </span>
              <Star
                size={26}
                aria-hidden="true"
                className={
                  filled
                    ? 'fill-warning-500 text-warning-500'
                    : 'fill-transparent text-text-100'
                }
              />
            </label>
          )
        })}
      </div>

      {/* The chosen level in words, under the row. Announced politely so it
          does not interrupt while the user is still arrowing through. */}
      <p
        aria-live="polite"
        className="mt-[6px] h-[20px] text-center text-[13px] font-bold text-text-400"
      >
        {value ? LABELS[value - 1] : ''}
      </p>
    </fieldset>
  )
}

export default RatingStars
