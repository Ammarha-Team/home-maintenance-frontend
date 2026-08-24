import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Loader2, MapPin } from "lucide-react";
import UserNavbar from "../../../shared/components/HomeNavbar";
import Footer from "../../../shared/components/Footer";
import TechnicianOfferCard from "../components/TechnicianOfferCard";
import { useServiceRequest } from "../hooks/useServiceRequest";

// The API sends a preferred day as "2026-09-05". `Date` would read that as UTC
// midnight and hand back the day before for anyone east of Greenwich, so the
// parts are split out and rebuilt locally.
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

// العروض هنا حقيقية: تأتي ضمن تفاصيل الطلب من
// GET /api/service-requests/{id} في الحقل offers، فلا توجد نقطة نهاية منفصلة
// لها ولا بيانات عرض مؤقتة.
//
// الفرز يقتصر على ما تحمله الاستجابة فعلاً — السعر والتقييم. كان هناك تبويب
// ثالث للأقرب مسافةً، ولا يوجد في الاستجابة أي إحداثي أو مسافة للفني، فحُذف
// بدل ترتيب القائمة على حقل لا وجود له.
const FILTERS = [
  { id: "all", label: "الكل" },
  { id: "lowest_price", label: "الأقل سعرا" },
  { id: "highest_rated", label: "الأعلى تقييما" },
];

export default function OrderOffers() {
  const { id: orderId } = useParams();

  const {
    request,
    loading: requestLoading,
    error: requestError,
  } = useServiceRequest(orderId);

  const [activeFilter, setActiveFilter] = useState("all");

  const offers = request?.offers ?? [];

  // نسخة قبل الفرز: sort يعدّل المصفوفة في مكانها، والمصدر هنا هو ما ردّ به
  // الخادم.
  const sortedOffers = [...offers].sort((a, b) => {
    if (activeFilter === "lowest_price") return (a.price ?? 0) - (b.price ?? 0);
    if (activeFilter === "highest_rated") return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-cairo" dir="rtl">
      {/* 1. الهيدر/النافبار */}
      <UserNavbar />

      {/* 2. محتوى الصفحة الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* البريدكرامب (Breadcrumb) مطابق للاسكرين شوت */}
        <nav aria-label="Breadcrumb" className="mb-6 flex justify-start">
          <ol className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#8e9aaf]">
            <li>
              <Link to="/home" className="hover:text-[#2563eb] transition-colors">
                الرئيسيه
              </Link>
            </li>
            <li>
              <ChevronLeft size={14} className="text-[#8e9aaf]" />
            </li>
            <li>
              <Link to="/my-orders" className="hover:text-[#2563eb] transition-colors">
                طلباتي
              </Link>
            </li>
            <li>
              <ChevronLeft size={14} className="text-[#8e9aaf]" />
            </li>
            <li>
              <span className="text-[#2563eb] font-semibold" aria-current="page">
                عرض العروض المتقدمه
              </span>
            </li>
          </ol>
        </nav>

        {/* شبكة الصفحة الرئيسية (Responsive Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-right">
              تفاصيل المشكلة
            </h2>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-2xs text-right">
              {requestLoading ? (
                <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm font-medium">جارٍ تحميل الطلب...</span>
                </div>
              ) : requestError ? (
                <p className="py-16 text-center text-sm font-medium text-gray-700">
                  {requestError}
                </p>
              ) : request ? (
                <>
                  {/* صورة المشكلة — زخرفية، فكل ما تعرضه مكتوب بجوارها */}
                  <img
                    src={request.images[0] || "/electrical_socket.jpg"}
                    alt=""
                    className="w-full h-56 sm:h-64 object-cover rounded-xl border border-gray-100 mb-4 shadow-2xs"
                  />

                  {/* عنوان المشكلة ووصفها */}
                  <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-2">
                    {`خدمة ${request.categoryLabel}`}
                  </h3>

                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                    {request.problemDescription}
                  </p>

                  <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-xs sm:text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-gray-400">الحالة</dt>
                      <dd className="font-semibold text-gray-700">
                        {request.statusLabel}
                      </dd>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-gray-400">الموعد المفضل</dt>
                      <dd className="font-semibold text-gray-700">
                        {formatDay(request.preferredDate)}
                      </dd>
                    </div>

                    {request.address && (
                      <div className="flex items-start justify-between gap-3">
                        <dt className="shrink-0 text-gray-400">الموقع</dt>
                        <dd className="flex items-start gap-1.5 font-semibold text-gray-700">
                          <span>{request.address}</span>
                          <MapPin size={14} className="mt-0.5 shrink-0 text-[#2563eb]" />
                        </dd>
                      </div>
                    )}
                  </dl>

                  {/* بقية الصور المرفقة، إن وُجدت */}
                  {request.images.length > 1 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {request.images.slice(1).map((image) => (
                        <img
                          key={image}
                          src={image}
                          alt=""
                          className="h-16 w-16 rounded-lg border border-gray-100 object-cover"
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="py-16 text-center text-sm font-medium text-gray-500">
                  لم يتم العثور على هذا الطلب.
                </p>
              )}
            </div>
          </div>

          {/* العمود الأيمن: العروض المقدمة من الفنيين */}
          <div className="lg:col-span-8">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                العروض المقدمة من الفنيين ({offers.length})
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                اختر الفني الأنسب بناءً على التقييم والسعر
              </p>
            </div>

            {/* الفلاتر (Pills) */}
            <div className="flex gap-2.5 mb-6 overflow-x-auto pb-2 scrollbar-none">
              {FILTERS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-6 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === tab.id
                      ? "bg-[#e8f0fe] text-[#2563eb] border-blue-200 shadow-2xs"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* كروت الفنيين */}
            {requestLoading ? (
              <div className="bg-white rounded-2xl p-10 flex items-center justify-center gap-2 border border-gray-100 shadow-2xs text-gray-500">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm font-medium">جارٍ تحميل العروض...</span>
              </div>
            ) : sortedOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {sortedOffers.map((offer) => (
                  <TechnicianOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-2xs">
                <p className="text-gray-500 font-medium">
                  لم يقدم أي فني عرضًا على هذا الطلب حتى الآن.
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  ستظهر العروض هنا فور وصولها. أعد تحميل الصفحة للاطلاع على
                  الجديد.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. الفوتر */}
      <Footer />
    </div>
  );
}