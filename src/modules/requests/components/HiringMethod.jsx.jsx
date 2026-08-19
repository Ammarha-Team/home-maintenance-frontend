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
 * @param {number} value one of REQUEST_TYPE
 * @param {(type: number) => void} onChange
 */
export default function HiringMethod({ value, onChange }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">
        طريقة التوظيف
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* اختيار فني معين */}
        <div
          aria-disabled="true"
          title="غير متاحة حاليًا"
          className="cursor-not-allowed rounded-xl border border-gray-200 bg-white p-5 opacity-60"
        >
          <div className="flex justify-between items-start">
            <UserRound className="text-blue-600" size={22} />
          </div>

          <h4 className="font-semibold mt-3">
            اختيار فني معين
          </h4>

          <p className="text-sm text-gray-500 mt-2">
            تصفح قائمة الفنيين المتاحين وقم بحجز موعد مع الفني الذي تفضله مباشرة.
          </p>

          <p className="mt-3 text-xs font-medium text-gray-400">
            غير متاحة حاليًا
          </p>
        </div>

        {/* استقبال عروض */}
        <button
          type="button"
          onClick={() => onChange(REQUEST_TYPE.public)}
          aria-pressed={value === REQUEST_TYPE.public}
          className={`cursor-pointer rounded-xl border p-5 text-right transition ${
            value === REQUEST_TYPE.public
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex justify-between items-start">
            <Users className="text-blue-600" size={22} />
          </div>

          <h4 className="font-semibold mt-3">
            استقبال عروض من الفنيين
          </h4>

          <p className="text-sm text-gray-500 mt-2">
            سيقدم الفنيون عروضهم بناءً على وصف المشكلة، ثم اختر الأنسب لك.
          </p>
        </button>

      </div>
    </div>
  );
}
