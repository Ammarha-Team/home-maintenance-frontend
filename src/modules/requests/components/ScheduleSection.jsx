import { CalendarDays, MapPin } from "lucide-react";

import CustomCalendar from "./CustomCalendar";

// The map, its tile layer and the Leaflet default-marker fix all live in
// ServiceMap now, which MapPicker renders — nothing map-related is needed here.
import MapPicker from "./MapPicker";

const formatDate = (date) =>
  date.toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/**
 * The "when and where" half of a service request: a day and a place.
 *
 * Controlled throughout — the form above owns both values so the request it
 * eventually sends is the one shown here. The summary underneath reads them
 * straight back, which is what makes a picked location visible outside the map.
 *
 * The request carries a date only. An hour is settled between the customer and
 * whoever takes the job, so asking for one here would promise a precision the
 * request cannot keep.
 *
 * @param {{date: Date|null, location: {lat: number, lng: number}|null}} value
 * @param {(patch: object) => void} onChange receives just the field that moved
 */
export default function ScheduleSection({ value, onChange }) {
  const { date, location } = value;

  return (
    <div className="space-y-6">
      {/* العنوان */}
      <div className="text-right">
        <h3 className="text-lg font-bold text-gray-800">اختر التاريخ</h3>

        <p className="mt-1 text-sm text-gray-500">
          برجاء تحديد الموعد المناسب لزيارة الفني
        </p>
      </div>

      {/* الخريطة + الكالندر */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* الخريطة */}
        <MapPicker
          value={location}
          onChange={(next) => onChange({ location: next })}
        />

        {/* الكالندر */}
        <CustomCalendar
          value={date}
          onChange={(next) => onChange({ date: next })}
        />
      </div>

      {/* ملخص الموعد */}
      <div className="space-y-3 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <h4 className="font-semibold text-gray-800">تفاصيل الموعد</h4>

        <div className="flex items-center gap-2 text-sm text-gray-700">
          <CalendarDays size={18} className="text-blue-600" />
          <span>{date ? formatDate(date) : "لم يتم اختيار التاريخ بعد"}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin size={18} className="text-blue-600" />
          <span>
            {location
              ? `${location.lat.toFixed(5)} , ${location.lng.toFixed(5)}`
              : "لم يتم تحديد الموقع بعد"}
          </span>
        </div>
      </div>
    </div>
  );
}
