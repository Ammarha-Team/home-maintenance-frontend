import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"];

const isSameDay = (a, b) =>
  Boolean(a) &&
  Boolean(b) &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * The appointment-date calendar.
 *
 * Controlled: the chosen day is a full `Date` owned by the surrounding form,
 * so it can be read back alongside the location. Only the month being
 * looked at is local — paging through months is browsing, not choosing.
 *
 * The selection is compared by whole date rather than by day number, so the
 * 5th of one month does not appear selected while the 5th of another is.
 *
 * Weekday labels and day cells share one grid definition — same column count,
 * same gap — because they are two rows of the same table and drifted apart
 * while each carried its own spacing.
 *
 * @param {Date|null} value chosen day, or null
 * @param {(next: Date) => void} onChange
 */
export default function CustomCalendar({ value = null, onChange }) {
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(value ?? new Date()),
  );

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const monthName = visibleMonth.toLocaleString("ar-EG", { month: "long" });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const goToMonth = (offset) =>
    setVisibleMonth(new Date(year, month + offset, 1));

  return (
    <div
      dir="rtl"
      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-2">
        {/* Right to left, the chevron pointing right walks backwards. */}
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          aria-label="الشهر السابق"
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>

        <h4 className="text-base font-bold text-gray-800">
          {monthName} {year}
        </h4>

        <button
          type="button"
          onClick={() => goToMonth(1)}
          aria-label="الشهر التالي"
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
      </div>

      {/* أيام الأسبوع */}
      <div className="grid grid-cols-7 justify-items-center gap-1">
        {WEEKDAYS.map((day) => (
          <span
            key={day}
            className="pb-2 text-center text-xs font-medium text-gray-400"
          >
            {day}
          </span>
        ))}
      </div>

      {/* الأيام */}
      <div className="grid grid-cols-7 justify-items-center gap-1">
        {/* فراغ بداية الشهر */}
        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={`pad-${index}`} />
        ))}

        {days.map((day) => {
          const date = new Date(year, month, day);
          const selected = isSameDay(value, date);

          return (
            <button
              key={day}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange?.(date)}
              // The circle keeps its own size and is centred in its column;
              // the labels above are centred in the same seven columns, so the
              // two rows line up without the cell having to stretch.
              className={`flex size-10 cursor-pointer items-center justify-center rounded-full text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                selected
                  ? "bg-blue-600 font-semibold text-white"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
