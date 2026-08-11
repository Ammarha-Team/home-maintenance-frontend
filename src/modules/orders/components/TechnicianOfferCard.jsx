import React from "react";
import { Link } from "react-router-dom";
import { Star, Clock, Wrench, X } from "lucide-react";

export default function TechnicianOfferCard({ offer, onAccept, onDismiss }) {
  const {
    id = 1,
    name = "أحمد العتيبي",
    experience = "10 سنوات خبرة",
    role = "فني كهرباء معتمد",
    successfulOffers = "+16 عرض متقدم ناجح",
    reviewsCount = "+10 تعليقات",
    rating = "4.9",
    avatar = "/technician_avatar.jpg",
    notes = "سأقوم بفحص كامل للوحة المفاتيح واستبدال القطع التالفة بقطع أصلية مع ضمان لمدة 30 يوم.",
    price = "150",
    arrivalTime = "يصل خلال 30 دقيقة",
  } = offer || {};

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between w-full">
      <div>
        {/* الجزء العلوي: هيدر الفني + زر الإلغاء */}
        <div className="flex items-start justify-between gap-3 mb-4">
          
          {/* الجانب الأيمن: الصورة والبيانات (الترتيب الطبيعي للـ DOM يضع الصورة أولاً) */}
          <div className="flex items-start gap-3 min-w-0">
            {/* صورة الفني والتكست الخاص بالتقييم */}
            <div className="relative shrink-0">
              <img
                src={avatar}
                alt={name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-gray-100 shadow-2xs"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs border border-gray-100 px-1.5 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                <span className="text-[11px] font-bold text-gray-900">{rating}</span>
                <Star size={11} className="fill-amber-400 text-amber-400" />
              </div>
            </div>

            {/* بيانات الاسم والتخصص والخبرة */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                  {name}
                </h3>
                <span className="text-[#2563eb] font-semibold text-[11px] bg-blue-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                  {experience}
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-0.5 font-medium truncate">{role}</p>

              {/* الشارات الاحصائية */}
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                <span className="bg-[#e8f0fe]/70 text-[#2563eb] text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg font-medium whitespace-nowrap">
                  {successfulOffers}
                </span>
                <span className="bg-[#e8f0fe]/70 text-[#2563eb] text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg font-medium whitespace-nowrap">
                  {reviewsCount}
                </span>
              </div>
            </div>
          </div>

          {/* الجانب الأيسر: زر الإلغاء */}
          <button
            type="button"
            onClick={() => onDismiss && onDismiss(id)}
            aria-label="Dismiss offer"
            className="w-7 h-7 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <X size={14} className="stroke-[2.5]" />
          </button>
        </div>

        {/* تفاصيل الخدمة / الملاحظات */}
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

        {/* السعر ووقت الوصول */}
        <div className="bg-blue-50/30 rounded-xl p-3 border border-blue-100/40 flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 shrink-0">
            <Clock size={15} className="text-[#2563eb]" />
            <span>{arrivalTime}</span>
          </div>

          <div className="text-left">
            <span className="text-[10px] text-gray-400 block font-medium">السعر</span>
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-[#2563eb] font-bold text-base sm:text-lg">
                {price}
              </span>
              <span className="text-[#2563eb] font-semibold text-xs">ر.س</span>
            </div>
          </div>
        </div>
      </div>

      {/* أزرار التحكم السفلية */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => onAccept && onAccept(offer)}
          className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white font-bold py-2.5 px-3 rounded-xl text-xs sm:text-sm transition-colors shadow-2xs cursor-pointer text-center"
        >
          قبول الطلب
        </button>

        <Link
          to={`/my-orders/1/technicians/${id}`}
          className="flex-1 sm:flex-none border border-[#2563eb] text-[#2563eb] hover:bg-blue-50 font-semibold py-2.5 px-3.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer text-center whitespace-nowrap"
        >
          عرض صفحه الفني
        </Link>
      </div>
    </div>
  );
}