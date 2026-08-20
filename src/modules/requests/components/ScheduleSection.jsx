import { CalendarDays, MapPin } from "lucide-react";

import CustomCalendar from "./CustomCalendar";

// The map, its tile layer and the Leaflet default-marker fix all live in
// ServiceMap, which MapPicker renders — and MapPicker itself is now drawn by
// AddressSelector, which decides whether a pin is being placed at all.
import AddressSelector, { NEW_ADDRESS } from "./AddressSelector";

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
 * @param {{mode: string, savedId: string, save: boolean, title: string}} address
 * @param {(patch: object) => void} onAddressChange
 * @param {Array<{id: string, label: string}>} addresses the saved address book
 */
export default function ScheduleSection({
  value,
  onChange,
  address,
  onAddressChange,
  addresses,
  addressesLoading,
  addressesError,
  onAddressesRetry,
}) {
  const { date, location } = value;

  // A saved address is a row the server owns: the form holds its id and never
  // its coordinates, so the summary below has a title to show and no point.
  const usingSaved = address.mode !== NEW_ADDRESS && addresses.length > 0;
  const savedLabel = addresses.find((entry) => entry.id === address.savedId)
    ?.label;

  return (
    <div className="space-y-6">
      {/* العنوان + الكالندر.
          `items-start` matters: the address column grows with the map and the
          save card, and without it the calendar was stretched down the whole
          row and left hanging under its own last week. Each column also owns
          its heading now — a single heading above the pair sat over the
          address block in RTL and read as a label for the wrong control. */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {/* العنوان — قائمة العناوين المحفوظة، والخريطة عند اختيار عنوان جديد */}
        <AddressSelector
          value={address}
          onChange={onAddressChange}
          location={location}
          onLocationChange={(next) => onChange({ location: next })}
          addresses={addresses}
          loading={addressesLoading}
          error={addressesError}
          onRetry={onAddressesRetry}
        />

        {/* الكالندر */}
        <div className="space-y-4">
          <div className="text-right">
            <h3 className="text-lg font-bold text-gray-800">اختر التاريخ</h3>

            <p className="mt-1 text-sm text-gray-500">
              برجاء تحديد الموعد المناسب لزيارة الفني
            </p>
          </div>

          <CustomCalendar
            value={date}
            onChange={(next) => onChange({ date: next })}
          />
        </div>
      </div>

      {/* ملخص الموعد */}
      <div className="space-y-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:p-5">
        <h4 className="text-base font-bold text-gray-800">تفاصيل الموعد</h4>

        <div className="flex items-start gap-2 text-sm text-gray-700">
          <CalendarDays
            size={18}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-blue-600"
          />
          <span>{date ? formatDate(date) : "لم يتم اختيار التاريخ بعد"}</span>
        </div>

        <div className="flex items-start gap-2 text-sm text-gray-700">
          <MapPin
            size={18}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-blue-600"
          />
          <span>
            {usingSaved
              ? (savedLabel ?? "لم يتم اختيار العنوان بعد")
              : location
                ? `${location.lat.toFixed(5)} , ${location.lng.toFixed(5)}`
                : "لم يتم تحديد الموقع بعد"}
          </span>
        </div>
      </div>
    </div>
  );
}
