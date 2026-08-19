import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Loader2, MapPin } from "lucide-react";
import UserNavbar from "../../../shared/components/HomeNavbar";
import Footer from "../../../shared/components/Footer";
import TechnicianOfferCard from "../components/TechnicianOfferCard";
import { useToast } from "../../../shared/toast/toastContext.js";
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

// قائمة فنيين وهمية مطابقة للتصميم للـ 12 عرضاً
const INITIAL_OFFERS = [
  {
    id: 1,
    name: "أحمد العتيبي",
    experience: "10 سنوات خبرة",
    role: "فني كهرباء معتمد",
    successfulOffers: "+16 عرض متقدم ناجح",
    reviewsCount: "+10 تعليقات",
    rating: "4.9",
    avatar: "/technician_avatar.jpg",
    notes:
      "سأقوم بفحص كامل للوحة المفاتيح واستبدال القطع التالفة بقطع أصلية مع ضمان لمدة 30 يوم.",
    price: 150,
    arrivalTime: "يصل خلال 30 دقيقة",
    distanceKm: 2,
  },
  {
    id: 2,
    name: "أحمد العتيبي",
    experience: "10 سنوات خبرة",
    role: "فني كهرباء معتمد",
    successfulOffers: "+16 عرض متقدم ناجح",
    reviewsCount: "+10 تعليقات",
    rating: "4.9",
    avatar: "/technician_avatar.jpg",
    notes:
      "سأقوم بفحص كامل للوحة المفاتيح واستبدال القطع التالفة بقطع أصلية مع ضمان لمدة 30 يوم.",
    price: 150,
    arrivalTime: "يصل خلال 30 دقيقة",
    distanceKm: 1.5,
  },
  {
    id: 3,
    name: "أحمد العتيبي",
    experience: "10 سنوات خبرة",
    role: "فني كهرباء معتمد",
    successfulOffers: "+16 عرض متقدم ناجح",
    reviewsCount: "+10 تعليقات",
    rating: "4.9",
    avatar: "/technician_avatar.jpg",
    notes:
      "سأقوم بفحص كامل للوحة المفاتيح واستبدال القطع التالفة بقطع أصلية مع ضمان لمدة 30 يوم.",
    price: 140,
    arrivalTime: "يصل خلال 20 دقيقة",
    distanceKm: 1,
  },
  {
    id: 4,
    name: "أحمد العتيبي",
    experience: "10 سنوات خبرة",
    role: "فني كهرباء معتمد",
    successfulOffers: "+16 عرض متقدم ناجح",
    reviewsCount: "+10 تعليقات",
    rating: "4.9",
    avatar: "/technician_avatar.jpg",
    notes:
      "سأقوم بفحص كامل للوحة المفاتيح واستبدال القطع التالفة بقطع أصلية مع ضمان لمدة 30 يوم.",
    price: 150,
    arrivalTime: "يصل خلال 30 دقيقة",
    distanceKm: 3,
  },
];

export default function OrderOffers() {
  // يُمرَّر إلى كارت العرض حتى تفتح صفحة الفني ضمن الطلب نفسه
  const { id: orderId } = useParams();
  const [offers, setOffers] = useState(INITIAL_OFFERS);

  // تفاصيل الطلب تأتي من الخادم؛ العروض المعروضة بجوارها ما زالت بيانات عرض
  // مؤقتة لأن لها نقطة نهاية أخرى خارج نطاق هذا الربط.
  const {
    request,
    loading: requestLoading,
    error: requestError,
  } = useServiceRequest(orderId);
  const [activeFilter, setActiveFilter] = useState("all");

  const navigate = useNavigate();
  const { showToast } = useToast();

  // لو غادر العميل الصفحة قبل انتهاء المهلة، يُلغى الانتقال المؤجل
  const redirectTimer = useRef(null);

  useEffect(
    () => () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    },
    [],
  );

  const handleDismissOffer = (offerId) => {
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
  };

  // قبول العرض يؤكد بإشعار عابر ثم ينتقل إلى تتبع الطلب: الطلب صار مسنداً إلى
  // فني، ومكانه بعد ذلك شاشة التتبع لا قائمة العروض.
  const handleAcceptOffer = (offer) => {
    showToast({
      message: `تم قبول عرض الفني ${offer.name} بسعر ${offer.price} ر.س بنجاح!`,
    });

    redirectTimer.current = setTimeout(
      () => navigate(`/my-orders/${orderId}/track`),
      1200,
    );
  };

  // فرز العروض بناءً على التاب النشط
  const getSortedOffers = () => {
    const list = [...offers];
    if (activeFilter === "lowest_price") {
      return list.sort((a, b) => a.price - b.price);
    }
    if (activeFilter === "highest_rated") {
      return list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    }
    if (activeFilter === "nearest") {
      return list.sort((a, b) => a.distanceKm - b.distanceKm);
    }
    return list;
  };

  const sortedOffers = getSortedOffers();

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
              {[
                { id: "all", label: "الكل" },
                { id: "lowest_price", label: "الأقل سعرا" },
                { id: "nearest", label: "الأقرب" },
                { id: "highest_rated", label: "الأعلى تقييما" },
              ].map((tab) => (
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
            {sortedOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {sortedOffers.map((offer) => (
                  <TechnicianOfferCard
                    key={offer.id}
                    offer={offer}
                    orderId={orderId}
                    onDismiss={handleDismissOffer}
                    onAccept={handleAcceptOffer}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-2xs">
                <p className="text-gray-500 font-medium">لا توجد عروض حالية متاحة لهذا الفلتر.</p>
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