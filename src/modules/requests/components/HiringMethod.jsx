import { UserRound, Users } from "lucide-react";

import { REQUEST_TYPE } from "../services/serviceRequestService";

/**
 * How the customer wants the job taken: by a technician they pick, or by
 * whoever offers.
 *
 * This is the request's `RequestType` — `Direct` for a chosen technician,
 * `Public` for open offers. Only `Public` is in service: the backend has the
 * direct flow in the enum but not behind an implementation yet, so that card is
 * drawn and marked unavailable rather than removed. Removing it would lose the
 * design; leaving it live would send a request nothing answers.
 *
 * Both cards are full-height flex columns so the pair keeps a level top and
 * bottom edge — the unavailable one carries an extra line, and without this it
 * stood taller than the card beside it.
 *
 * @param {number} value one of REQUEST_TYPE
 * @param {(type: number) => void} onChange
 */
export default function HiringMethod({ value, onChange }) {
  const selected = value === REQUEST_TYPE.public;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-gray-800">طريقة التوظيف</h3>

      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
        {/* اختيار فني معين */}
        <div
          aria-disabled="true"
          title="غير متاحة حاليًا"
          className="flex h-full cursor-not-allowed flex-col rounded-xl border border-gray-200 bg-white p-5 opacity-60"
        >
          <UserRound size={22} aria-hidden="true" className="text-blue-600" />

          <h4 className="mt-3 font-semibold text-gray-800">اختيار فني معين</h4>

          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            تصفح قائمة الفنيين المتاحين وقم بحجز موعد مع الفني الذي تفضله
            مباشرة.
          </p>

          {/* Pushed to the foot of the card so the badge lines up with the
              bottom of the card beside it. */}
          <p className="mt-auto pt-3 text-xs font-medium text-gray-400">
            غير متاحة حاليًا
          </p>
        </div>

        {/* استقبال عروض */}
        <button
          type="button"
          onClick={() => onChange(REQUEST_TYPE.public)}
          aria-pressed={selected}
          className={`flex h-full cursor-pointer flex-col rounded-xl border p-5 text-right transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            selected
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 bg-white hover:border-blue-300"
          }`}
        >
          <Users size={22} aria-hidden="true" className="text-blue-600" />

          <h4 className="mt-3 font-semibold text-gray-800">
            استقبال عروض من الفنيين
          </h4>

          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            سيقدم الفنيون عروضهم بناءً على وصف المشكلة، ثم اختر الأنسب لك.
          </p>
        </button>
      </div>
    </div>
  );
}
