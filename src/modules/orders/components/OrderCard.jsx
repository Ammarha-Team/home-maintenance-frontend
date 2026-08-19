import React from "react";
import { Link } from "react-router-dom";
import { Check, X, Sparkles, Wrench } from "lucide-react";

// A calendar day the API sends as "2026-09-05", and a timestamp it sends in
// full. Both are read as the day they name; `Date` parses the short form as
// UTC midnight, so the parts are taken apart by hand rather than through the
// timezone that would shift the day back one.
const formatDay = (value) => {
  if (!value) return "";

  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return "";

  return new Date(year, month - 1, day).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * One service request on the customer's orders board.
 *
 * The badge and the button both follow `status`, which the API sends as the
 * enum's name — PendingOffers, Assigned, InProgress, Completed, Cancelled.
 * A request waiting on offers opens the offers screen, one already assigned
 * opens tracking, a finished one opens its rating.
 */
export default function OrderCard({ order }) {
  // شارات حالة الطلب
  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#e6f7ed] text-[#059669] border border-[#a7f3d0] px-3 py-1 rounded-full text-xs font-semibold shrink-0">
            <Check size={13} className="stroke-[2.5]" />
            <span>مكتملة</span>
          </span>
        );
      case "Assigned":
      case "InProgress":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] px-3 py-1 rounded-full text-xs font-semibold shrink-0">
            <Wrench size={13} className="stroke-[2.5]" />
            <span>{order.statusLabel}</span>
          </span>
        );
      case "PendingOffers":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#fff7ed] text-[#d97706] border border-[#fed7aa] px-3 py-1 rounded-full text-xs font-semibold shrink-0">
            <Sparkles size={13} className="stroke-[2]" />
            <span>معلقة</span>
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] px-3 py-1 rounded-full text-xs font-semibold shrink-0">
            <X size={13} className="stroke-[2.5]" />
            <span>ملغية</span>
          </span>
        );
      default:
        return null;
    }
  };

  // الأزرار السفلية
  const renderActionButton = (status) => {
    if (status === "PendingOffers") {
      return (
        <Link
          to={`/my-orders/${order.id}/offers`}
          className="block w-full py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl text-sm transition-colors shadow-2xs cursor-pointer text-center"
        >
          عرض العروض المتقدمه
        </Link>
      );
    }

    // الطلب المكتمل ينتهي بالتقييم، وهو المدخل إلى شاشة تقييم الفني
    if (status === "Completed") {
      return (
        <Link
          to={`/my-orders/${order.id}/review`}
          className="block w-full py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl text-sm transition-colors shadow-2xs cursor-pointer text-center"
        >
          تقييم الفني
        </Link>
      );
    }

    // طلب ملغي لا يُتتبع؛ المدخل الوحيد منه هو طلب جديد
    if (status === "Cancelled") {
      return (
        <Link
          to="/request-service"
          className="block w-full py-2.5 bg-white border border-[#2563eb] text-[#2563eb] hover:bg-blue-50 font-semibold rounded-xl text-sm transition-colors cursor-pointer text-center"
        >
          إعادة الطلب
        </Link>
      );
    }

    return (
      <Link
        to={`/my-orders/${order.id}/track`}
        className="block w-full py-2.5 bg-white border border-[#2563eb] text-[#2563eb] hover:bg-blue-50 font-semibold rounded-xl text-sm transition-colors shadow-2xs cursor-pointer text-center"
      >
        تتبع الطلب
      </Link>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* الهيدر العلوي */}
        <div className="flex justify-between items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-[#2563eb] font-bold text-base">
              {`خدمة ${order.categoryLabel}`}
            </h3>
            <span className="text-gray-400 text-xs font-normal">
              ({formatDay(order.createdAt)})
            </span>
          </div>
          {getStatusBadge(order.status)}
        </div>

        {/* جسم الكارت: الصورة على اليمين ثم النص على الشمال */}
        <div className="flex items-start gap-3.5 sm:gap-4 mb-6">
          {/* الصورة أولاً لتظهر على اليمين في الـ RTL. الصورة هنا زخرفية —
              كل ما تعرضه مكتوب بجوارها — فتُترك بنص بديل فارغ. */}
          <img
            src={order.thumbnailImage || "/electrical_socket.jpg"}
            alt=""
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-gray-100 shrink-0 shadow-2xs"
          />

          {/* تفاصيل النص */}
          <div className="flex-1 min-w-0 text-right">
            <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1 truncate">
              {`الموعد المفضل: ${formatDay(order.preferredDate)}`}
            </h4>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
              {order.problemDescription}
            </p>
          </div>
        </div>
      </div>

      {/* الزرار السفلي */}
      {renderActionButton(order.status)}
    </div>
  );
}
