import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import UserNavbar from "../../../shared/components/HomeNavbar";
import Footer from "../../../shared/components/Footer";
import TechnicianOfferCard from "../components/TechnicianOfferCard";
import { useToast } from "../../../shared/toast/toastContext.js";

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
  const { id: orderId = "1" } = useParams();
  const [offers, setOffers] = useState(INITIAL_OFFERS);
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
              {/* صورة المشكلة */}
              <img
                src="/electrical_socket.jpg"
                alt="تلف لوحة المفاتيح"
                className="w-full h-56 sm:h-64 object-cover rounded-xl border border-gray-100 mb-4 shadow-2xs"
              />

              {/* عنوان المشكلة ووصفها */}
              <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-2">
                تلف لوحة المفاتيح
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                تلف في لوحة مفاتيح الكهرباء الرئيسية في الصالة، تسبب في انقطاع التيار عن بعض الأجهزة. نحتاج لفحص شامل واستبدال القطع التالفة.
              </p>
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