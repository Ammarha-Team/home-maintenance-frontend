import React from "react";
import { Link } from "react-router-dom";
import { Check, X, Sparkles } from "lucide-react";

export default function OrderCard({ order }) {
  // شارات حالة الطلب
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#e6f7ed] text-[#059669] border border-[#a7f3d0] px-3 py-1 rounded-full text-xs font-semibold shrink-0">
            <Check size={13} className="stroke-[2.5]" />
            <span>مكتملة</span>
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#e6f7ed] text-[#059669] border border-[#a7f3d0] px-3 py-1 rounded-full text-xs font-semibold shrink-0">
            <Check size={13} className="stroke-[2.5]" />
            <span>اتمام الطلب</span>
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#fff7ed] text-[#d97706] border border-[#fed7aa] px-3 py-1 rounded-full text-xs font-semibold shrink-0">
            <Sparkles size={13} className="stroke-[2]" />
            <span>معلقة</span>
          </span>
        );
      case "canceled":
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
  const renderActionButton = (actionType) => {
    if (actionType === "view_offers") {
      return (
        <Link
          to={`/my-orders/${order.id}`}
          className="block w-full py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl text-sm transition-colors shadow-2xs cursor-pointer text-center"
        >
          عرض العروض المتقدمه
        </Link>
      );
    }
    if (actionType === "track") {
      return (
        <Link
          to={`/my-orders/${order.id}/track`}
          className="block w-full py-2.5 bg-white border border-[#2563eb] text-[#2563eb] hover:bg-blue-50 font-semibold rounded-xl text-sm transition-colors shadow-2xs cursor-pointer text-center"
        >
          تتبع الطلب
        </Link>
      );
    }
    if (actionType === "reorder") {
      return (
        <button className="w-full py-2.5 bg-white border border-[#2563eb] text-[#2563eb] hover:bg-blue-50 font-semibold rounded-xl text-sm transition-colors cursor-pointer">
          إعادة الطلب
        </button>
      );
    }
    // الطلب المكتمل ينتهي بالتقييم، وهو المدخل إلى شاشة تقييم الفني
    if (actionType === "review") {
      return (
        <Link
          to={`/my-orders/${order.id}/review`}
          className="block w-full py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl text-sm transition-colors shadow-2xs cursor-pointer text-center"
        >
          تقييم الفني
        </Link>
      );
    }
    return (
      <Link
        to={`/my-orders/${order.id}/track`}
        className="block w-full py-2.5 bg-white border border-[#2563eb] text-[#2563eb] hover:bg-blue-50 font-semibold rounded-xl text-sm transition-colors cursor-pointer text-center"
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
            <h3 className="text-[#2563eb] font-bold text-base">{order.title}</h3>
            <span className="text-gray-400 text-xs font-normal">({order.date})</span>
          </div>
          {getStatusBadge(order.status)}
        </div>

        {/* جسم الكارت: الصورة على اليمين ثم النص على الشمال */}
        <div className="flex items-start gap-3.5 sm:gap-4 mb-6">
          {/* الصورة أولاً لتظهر على اليمين في الـ RTL */}
          <img
            src={order.image || "/electrical_socket.jpg"}
            alt={order.title}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-gray-100 shrink-0 shadow-2xs"
          />

          {/* تفاصيل النص */}
          <div className="flex-1 min-w-0 text-right">
            <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1 truncate">
              {order.subtitle}
            </h4>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
              {order.description}
            </p>
          </div>
        </div>
      </div>

      {/* الزرار السفلي */}
      {renderActionButton(order.actionType)}
    </div>
  );
}