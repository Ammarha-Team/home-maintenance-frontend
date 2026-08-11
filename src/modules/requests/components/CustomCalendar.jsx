import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        {/* Right to left, the chevron pointing right walks backwards. */}
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          aria-label="الشهر السابق"
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
        >
          <ChevronRight size={18} />
        </button>

        <h3 className="font-bold text-gray-800">
          {monthName} {year}
        </h3>

        <button
          type="button"
          onClick={() => goToMonth(1)}
          aria-label="الشهر التالي"
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* أيام الأسبوع */}
      <div className="mb-3 grid grid-cols-7 gap-2 text-center">
        {["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"].map((day) => (
          <span key={day} className="text-xs text-gray-400">
            {day}
          </span>
        ))}
      </div>

      {/* الأيام */}
      <div className="grid grid-cols-7 gap-3 text-center">
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
              className={`mx-auto h-9 w-9 rounded-full text-sm transition ${
                selected
                  ? "bg-blue-600 text-white"
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
