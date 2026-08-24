import { Clock, Star, Wrench } from "lucide-react";

import { OFFER_CURRENCY } from "../../requests/services/serviceRequestService";

/**
 * One technician's bid, as the customer sees it.
 *
 * Every field drawn here comes off the offer the API returns on
 * `GET /api/service-requests/{id}`. The card used to show four more — a
 * distance in kilometres, an arrival time, a count of reviews and a count of
 * previously won jobs — and none of them exists anywhere in the response, so
 * none of them is drawn.
 *
 * Two fields are absent often enough to be worth handling rather than
 * defaulting: a technician who never uploaded a picture has
 * `technicianProfilePicture: null`, and `rating` is 0 for every technician on
 * the platform today because no rating endpoint exists to raise it. A zero is
 * shown as "no ratings yet" rather than as a score of nought, which would read
 * as a bad technician instead of a new one.
 */

/** "90" -> "ساعة و30 دقيقة". Whole hours drop the minutes half. */
const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return "";

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (!hours) return `${rest} دقيقة`;
  if (!rest) return hours === 1 ? "ساعة" : `${hours} ساعات`;

  return `${hours === 1 ? "ساعة" : `${hours} ساعات`} و${rest} دقيقة`;
};

/** The first letter of the name, for a technician with no picture. */
const initialOf = (name) => String(name || "؟").trim().charAt(0) || "؟";

export default function TechnicianOfferCard({ offer }) {
  const {
    technicianName,
    technicianProfilePicture,
    rating,
    yearsOfExperience,
    professionLabel,
    notes,
    price,
    durationInMinutes,
  } = offer;

  const hasRating = typeof rating === "number" && rating > 0;
  const duration = formatDuration(durationInMinutes);

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between w-full">
      <div>
        {/* هيدر الفني */}
        <div className="flex items-start gap-3 min-w-0 mb-4">
          <div className="relative shrink-0">
            {technicianProfilePicture ? (
              <img
                src={technicianProfilePicture}
                alt=""
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-gray-100 shadow-2xs"
              />
            ) : (
              <div
                aria-hidden="true"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-gray-100 bg-[#e8f0fe] text-[#2563eb] flex items-center justify-center text-2xl font-bold shadow-2xs"
              >
                {initialOf(technicianName)}
              </div>
            )}

            {hasRating && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs border border-gray-100 px-1.5 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                <span className="text-[11px] font-bold text-gray-900">
                  {rating.toFixed(1)}
                </span>
                <Star size={11} className="fill-amber-400 text-amber-400" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                {technicianName}
              </h3>

              {typeof yearsOfExperience === "number" && (
                <span className="text-[#2563eb] font-semibold text-[11px] bg-blue-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                  {`${yearsOfExperience} سنوات خبرة`}
                </span>
              )}
            </div>

            {professionLabel && (
              <p className="text-gray-400 text-xs mt-0.5 font-medium truncate">
                {professionLabel}
              </p>
            )}

            {!hasRating && (
              <p className="text-gray-400 text-[11px] mt-2">
                لا توجد تقييمات بعد
              </p>
            )}
          </div>
        </div>

        {/* ملاحظات الفني */}
        {notes && (
          <div className="mt-4 mb-4">
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-2">
              تفاصيل الخدمة
            </h4>
            <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1">
                <Wrench size={14} className="text-gray-600" />
                <span>ملاحظات الفني</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                {notes}
              </p>
            </div>
          </div>
        )}

        {/* السعر ومدة التنفيذ */}
        <div className="bg-blue-50/30 rounded-xl p-3 border border-blue-100/40 flex items-center justify-between mb-4 gap-2">
          {duration ? (
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 shrink-0">
              <Clock size={15} className="text-[#2563eb]" />
              <span>{`مدة التنفيذ ${duration}`}</span>
            </div>
          ) : (
            <span />
          )}

          <div className="text-left">
            <span className="text-[10px] text-gray-400 block font-medium">
              السعر
            </span>
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-[#2563eb] font-bold text-base sm:text-lg">
                {typeof price === "number" ? price.toLocaleString("ar-EG") : "—"}
              </span>
              <span className="text-[#2563eb] font-semibold text-xs">
                {OFFER_CURRENCY}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* لا يوجد إجراء هنا بعد.
          قبول العرض يحتاج نقطة نهاية لا توجد في الـ API حتى الآن، وزر يبدو
          فعّالاً بينما لا يُسند الطلب فعليًا أسوأ من غيابه. */}
      <p className="pt-1 text-center text-xs font-medium text-gray-400">
        قبول العروض غير متاح حاليًا
      </p>
    </div>
  );
}
